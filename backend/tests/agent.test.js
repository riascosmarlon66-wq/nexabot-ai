import test from "node:test";
import assert from "node:assert/strict";
import { OllamaUnavailableError, runAgent } from "../src/agent/agent.js";
import { errorMiddleware } from "../src/middleware/error.middleware.js";

const config = {
  ollamaUrl: "http://localhost:11434/",
  ollamaModel: "llama3.2",
  ollamaTimeoutMs: 120000
};

test("Agent Core invoca el endpoint Ollama configurado /api/generate", async () => {
  let requestUrl;
  let requestBody;
  const reply = await runAgent({
    name: "Empresa",
    agentName: "Agente",
    instructions: "Ayuda al cliente.",
    products: [],
    services: []
  }, "Hola", {
    config,
    fetchImpl: async (url, options) => {
      requestUrl = url;
      requestBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ response: "Respuesta de prueba" })
      };
    }
  });

  assert.equal(requestUrl, "http://localhost:11434/api/generate");
  assert.equal(requestBody.model, "llama3.2");
  assert.equal(requestBody.stream, false);
  assert.match(requestBody.prompt, /MENSAJE DEL CLIENTE:\nHola/);
  assert.equal(reply, "Respuesta de prueba");
});

test("errores de transporte Ollama conservan su causa y se clasifican como IA", async () => {
  const transportError = new TypeError("fetch failed");
  await assert.rejects(
    runAgent({}, "Hola", {
      config,
      fetchImpl: async () => {
        throw transportError;
      }
    }),
    (error) => error instanceof OllamaUnavailableError && error.cause === transportError
  );
});

test("respuestas JSON inválidas de Ollama se clasifican como IA no disponible", async () => {
  await assert.rejects(
    runAgent({}, "Hola", {
      config,
      fetchImpl: async () => ({
        ok: true,
        json: async () => {
          throw new SyntaxError("invalid json");
        }
      })
    }),
    OllamaUnavailableError
  );
});

test("errores de repository no se convierten en errores de IA", () => {
  const response = {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  errorMiddleware(new Error("Supabase query failed"), {}, response, () => {});

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, { error: "Error interno del servidor" });
});
