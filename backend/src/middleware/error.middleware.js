import { AIProviderError } from "../ai/provider-error.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

export function errorMiddleware(error, _req, res, _next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "JSON inválido" });
  }

  if (error instanceof AIProviderError) {
    const statuses = {
      AI_PROVIDER_UNAVAILABLE: 503,
      AI_PROVIDER_TIMEOUT: 504,
      AI_PROVIDER_INVALID_RESPONSE: 502,
      UNSUPPORTED_AI_PROVIDER: 500
    };
    return res.status(statuses[error.code] ?? 500).json({ error: error.code });
  }

  if (error?.code === "MESSAGE_REPOSITORY_ERROR") {
    return res.status(500).json({ error: "No se pudo guardar el mensaje" });
  }

  logFlowError("[ERROR]", "request", error);
  return res.status(500).json({ error: "Error interno del servidor" });
}
