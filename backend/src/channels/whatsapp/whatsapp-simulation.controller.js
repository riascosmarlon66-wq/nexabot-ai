import { env } from "../../config/env.js";
import { processWhatsAppMessage } from "./whatsapp.service.js";

const PHONE_NUMBER_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const CUSTOMER_PHONE_PATTERN = /^\d+$/;

export function createWhatsAppSimulationController(
  processMessage = processWhatsAppMessage,
  config = env
) {
  return async function simulateWhatsAppMessage(req, res) {
    if (config.nodeEnv === "production" || config.whatsappDevMode !== true) {
      return res.sendStatus(404);
    }

    const { phoneNumberId, from, message, entryToken } = req.body ?? {};
    if (
      typeof phoneNumberId !== "string" ||
      !PHONE_NUMBER_ID_PATTERN.test(phoneNumberId) ||
      typeof from !== "string" ||
      !CUSTOMER_PHONE_PATTERN.test(from) ||
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 2000 ||
      (entryToken !== undefined && (typeof entryToken !== "string" || !entryToken.trim()))
    ) {
      return res.status(400).json({
        ok: false,
        error: "INVALID_SIMULATION_REQUEST"
      });
    }

    const result = await processMessage({
      phoneNumberId,
      from,
      type: "text",
      text: message.trim()
    }, {
      sendReply: false,
      ...(entryToken ? { entryToken: entryToken.trim() } : {})
    });

    if (result.status === "unconfigured") {
      return res.status(404).json({
        ok: false,
        error: "CHANNEL_CONNECTION_NOT_FOUND"
      });
    }
    if (result.status === "invalid-entry-point") {
      return res.status(404).json({
        ok: false,
        error: "BUSINESS_ENTRY_POINT_NOT_FOUND"
      });
    }

    if (result.status !== "processed") {
      return res.status(422).json({
        ok: false,
        error: result.status === "invalid-agent"
          ? "CHANNEL_AGENT_INVALID"
          : "CHANNEL_CONNECTION_INVALID"
      });
    }

    return res.json({
      ok: true,
      mode: "simulation",
      companyId: result.companyId,
      agentId: result.agentId,
      customerId: result.customerId,
      conversationId: result.conversationId,
      reply: result.reply
    });
  };
}
