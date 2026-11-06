import { env } from "../../config/env.js";
import {
  extractWhatsAppTextMessage,
  processWhatsAppMessage
} from "./whatsapp.service.js";

function logWebhookError(error) {
  console.error("[ERROR] Falló el procesamiento del webhook de WhatsApp", {
    name: error instanceof Error ? error.name : "Error",
    ...(error && typeof error === "object" && error.code
      ? { code: error.code }
      : {})
  });
}

export function createWhatsAppController(
  processMessage = processWhatsAppMessage,
  expectedVerifyToken = env.whatsappVerifyToken
) {
  return {
    verifyWebhook(req, res) {
      const mode = req.query?.["hub.mode"];
      const verifyToken = req.query?.["hub.verify_token"];
      const challenge = req.query?.["hub.challenge"];

      if (
        mode === "subscribe" &&
        Boolean(expectedVerifyToken) &&
        typeof verifyToken === "string" &&
        verifyToken === expectedVerifyToken &&
        typeof challenge === "string"
      ) {
        return res.status(200).send(challenge);
      }
      return res.sendStatus(403);
    },

    receiveWebhook(req, res) {
      const message = extractWhatsAppTextMessage(req.body);
      res.sendStatus(200);

      if (!message || message.type !== "text") return;

      // TODO: Persist message.id and reject previously processed WhatsApp events.
      Promise.resolve()
        .then(() => processMessage(message))
        .catch(logWebhookError);
    }
  };
}
