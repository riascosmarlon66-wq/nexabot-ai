import { env } from "../config/env.js";
import { supabase } from "../lib/supabase.js";
import { logFlowError } from "../lib/flow-diagnostics.js";
import { getAIProvider } from "../ai/ai-provider.js";

export function createHealthController({
  config = env,
  supabaseClient = supabase,
  resolveAIProvider = getAIProvider
} = {}) {
  return async function health(_req, res) {
    const [supabaseResult, providerResult] = await Promise.allSettled([
      supabaseClient.from("companies").select("id").limit(1),
      Promise.resolve().then(() => resolveAIProvider().isAvailable())
    ]);

    const supabaseError = supabaseResult.status === "fulfilled"
      ? supabaseResult.value.error
      : supabaseResult.reason;
    if (supabaseError) logFlowError("[HEALTH]", "supabase", supabaseError);

    const providerError = providerResult.status === "rejected"
      ? providerResult.reason
      : null;
    if (providerError) logFlowError("[HEALTH]", "ai_provider", providerError);

    const supabaseAvailable = supabaseResult.status === "fulfilled" &&
      !supabaseResult.value.error;
    const aiProviderAvailable = providerResult.status === "fulfilled" &&
      providerResult.value === true;
    const healthy = supabaseAvailable && aiProviderAvailable;

    return res.status(healthy ? 200 : 503).json({
      status: healthy ? "ok" : "degraded",
      services: {
        supabase: supabaseAvailable,
        [config.aiProvider]: aiProviderAvailable
      }
    });
  };
}
