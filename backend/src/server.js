import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import chatRouter from "./routes/chat.js";
import customersRouter from "./routes/customers.js";
import demoRouter from "./routes/demo.js";
import whatsappRouter from "./channels/whatsapp/whatsapp.routes.js";
import whatsappSimulationRouter from "./channels/whatsapp/whatsapp-simulation.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { createHealthController } from "./controllers/health.controller.js";

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

app.get("/health", createHealthController());

app.use("/api/chat", chatRouter);
app.use("/api/customers", customersRouter);
app.use("/api/demo", demoRouter);
app.use("/api/dev/whatsapp", whatsappSimulationRouter);
app.use("/api/webhooks/whatsapp", whatsappRouter);
app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(env.port, () => {
    console.log(`Agent Core funcionando en http://localhost:${env.port}`);
  });
}
