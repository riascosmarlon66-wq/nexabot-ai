import { env } from "../../config/env.js";
import { logFlowError } from "../../lib/flow-diagnostics.js";
import { AIProviderError } from "../provider-error.js";

const promptArtifactPattern = /(?:^|\n)\s*(?:SYSTEM|USER|ASSISTANT|CONVERSACIÓN RECIENTE|MENSAJE ACTUAL|INSTRUCCIÓN|INSTRUCCIONES DEL AGENTE|PRODUCTOS DISPONIBLES|SERVICIOS DISPONIBLES|REGLAS OBLIGATORIAS(?: DE RESPUESTA)?)\s*:/i;

export class OllamaProvider {
  constructor({ config = env, fetchImpl = globalThis.fetch } = {}) {
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  async generateText({ systemPrompt, userMessage, context }) {
    const ollamaBaseUrl = this.config.ollamaUrl.replace(/\/+$/, "");
    const ollamaUrl = new URL(`${ollamaBaseUrl}/api/generate`).toString();
    const historyMessages = Array.isArray(context?.historyMessages)
      ? context.historyMessages.filter((entry) =>
          entry &&
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string"
        )
      : (context?.history || "").split("\n").flatMap((line) => {
          const match = /^(Cliente|Asistente):\s?([\s\S]*)$/.exec(line);
          if (!match) return [];
          return [{
            role: match[1] === "Cliente" ? "user" : "assistant",
            content: match[2]
          }];
        });
    const messages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: userMessage }
    ];
    console.info("[MEMORY] final ollama messages", messages.map(({ role, content }, index) => ({
      index,
      role,
      preview: content.slice(0, 80)
    })));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.config.ollamaModel,
        stream: false,
        prompt: messages.map(({ role, content }) =>
          `${role.toUpperCase()}:\n${content}`
        ).join("\n\n")
      }),
      signal: AbortSignal.timeout(this.config.ollamaTimeoutMs)
    };

    let response;
    try {
      response = await this.fetchImpl(ollamaUrl, requestOptions);
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      const providerError = new AIProviderError(
        timedOut ? "AI_PROVIDER_TIMEOUT" : "AI_PROVIDER_UNAVAILABLE",
        timedOut ? "Tiempo de espera del proveedor de IA agotado" : "Proveedor de IA no disponible",
        { cause: error }
      );
      logFlowError("[AI_PROVIDER]", "ollama_request", providerError);
      throw providerError;
    }

    if (!response.ok) {
      const cause = new Error(`Ollama respondió HTTP ${response.status}`);
      cause.status = response.status;
      const providerError = new AIProviderError(
        "AI_PROVIDER_UNAVAILABLE",
        "Proveedor de IA no disponible",
        {
          cause,
          status: response.status,
          statusCode: response.status
        }
      );
      logFlowError("[AI_PROVIDER]", "ollama_http_response", providerError);
      throw providerError;
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      const providerError = new AIProviderError(
        timedOut ? "AI_PROVIDER_TIMEOUT" : "AI_PROVIDER_INVALID_RESPONSE",
        timedOut
          ? "Tiempo de espera del proveedor de IA agotado"
          : "Respuesta inválida del proveedor de IA",
        { cause: error }
      );
      logFlowError("[AI_PROVIDER]", "ollama_invalid_json", providerError);
      throw providerError;
    }

    const text = typeof data?.response === "string" ? data.response.trim() : "";
    if (!text || promptArtifactPattern.test(text)) {
      const cause = new Error("Ollama devolvió una respuesta inválida");
      const providerError = new AIProviderError(
        "AI_PROVIDER_INVALID_RESPONSE",
        "Respuesta inválida del proveedor de IA",
        { cause }
      );
      logFlowError("[AI_PROVIDER]", "ollama_invalid_response", providerError);
      throw providerError;
    }

    return {
      text,
      provider: "ollama",
      model: this.config.ollamaModel
    };
  }

  async isAvailable() {
    try {
      const baseUrl = this.config.ollamaUrl.replace(/\/+$/, "");
      const response = await this.fetchImpl(`${baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
