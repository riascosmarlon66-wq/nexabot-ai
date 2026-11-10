import { env } from "../config/env.js";
import { OllamaProvider } from "./providers/ollama.provider.js";
import { AIProviderError } from "./provider-error.js";

export { AIProviderError } from "./provider-error.js";

export function getAIProvider(providerName = env.aiProvider) {
  if (providerName === "ollama") return new OllamaProvider();

  throw new AIProviderError(
    "UNSUPPORTED_AI_PROVIDER",
    `Proveedor de IA no soportado: ${providerName}`
  );
}
