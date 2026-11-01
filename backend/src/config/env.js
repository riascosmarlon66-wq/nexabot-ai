import "dotenv/config";

function required(name, fallback = "") {
  const value = process.env[name]?.trim() || fallback;
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

function validateBackendSupabaseKey(key) {
  if (key.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SECRET_KEY contiene una publishable key. Usa una Secret API Key de backend (sb_secret_...) o una service_role legacy."
    );
  }
  return key;
}

const frontendUrls = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export const env = Object.freeze({
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrls,
  ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "llama3.2",
  ollamaTimeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 30000),
  supabaseUrl: required("SUPABASE_URL", "https://example.supabase.co"),
  supabaseSecretKey: validateBackendSupabaseKey(required("SUPABASE_SECRET_KEY", "sb_secret_test_key")),
  whatsappToken: process.env.WHATSAPP_TOKEN || "",
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
  whatsappApiVersion: process.env.WHATSAPP_API_VERSION || "v20.0",
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || ""
});
