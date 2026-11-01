import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { supabase } from "./lib/supabase.js";
import { isOllamaAvailable } from "./agent/agent.js";
import chatRouter from "./routes/chat.js";
import customersRouter from "./routes/customers.js";
import whatsappRouter from "./channels/whatsapp/whatsapp.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.frontendUrls.includes(origin)) return callback(null, true);
    return callback(new Error("Origen no permitido por CORS"));
  }
}));
app.use(express.json({ limit: "20kb" }));

app.get("/", (_req, res) => {
  res.json({ status: "online", service: "Chatbots para Empresas - Agent Core" });
});

app.get("/health", async (_req, res) => {
  const [supabaseResult, ollamaResult] = await Promise.allSettled([
    supabase.from("companies").select("id").limit(1),
    isOllamaAvailable()
  ]);

  const supabaseError = supabaseResult.status === "fulfilled"
    ? supabaseResult.value.error
    : supabaseResult.reason;

  if (supabaseError) {
    console.error("Supabase health check failed", {
      message: supabaseError.message,
      code: supabaseError.code,
      details: supabaseError.details,
      hint: supabaseError.hint
    });
  }

  const supabaseAvailable = supabaseResult.status === "fulfilled" && !supabaseResult.value.error;
  const ollamaAvailable = ollamaResult.status === "fulfilled" && ollamaResult.value === true;
  const healthy = supabaseAvailable && ollamaAvailable;

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    services: { supabase: supabaseAvailable, ollama: ollamaAvailable }
  });
});

app.use("/api/chat", chatRouter);
app.use("/api/customers", customersRouter);
app.use("/api/webhooks/whatsapp", whatsappRouter);
app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(env.port, () => {
    console.log(`Agent Core funcionando en http://localhost:${env.port}`);
  });
}
