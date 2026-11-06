import { OllamaUnavailableError } from "../agent/agent.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

export function errorMiddleware(error, _req, res, _next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "JSON inválido" });
  }

  if (error instanceof OllamaUnavailableError) {
    return res.status(503).json({ error: "Servicio de IA no disponible" });
  }

  logFlowError("[ERROR]", "request", error);
  return res.status(500).json({ error: "Error interno del servidor" });
}
