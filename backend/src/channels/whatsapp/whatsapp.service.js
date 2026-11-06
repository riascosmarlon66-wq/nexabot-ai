import { env } from "../../config/env.js";
import { getChannelConnectionByPhoneNumberId } from "../../repositories/channel-connection.repository.js";
import { getAgentById } from "../../repositories/agent.repository.js";
import { findOrCreateWhatsAppCustomer } from "../../repositories/customer.repository.js";
import { getOrCreateConversation } from "../../repositories/conversation.repository.js";
import { runAgentCore } from "../../services/agent-core.service.js";
import { logFlowError } from "../../lib/flow-diagnostics.js";

const PHONE_NUMBER_ID_PATTERN = /^\d+$/;

export function extractWhatsAppTextMessage(payload) {
  const entry = Array.isArray(payload?.entry) ? payload.entry[0] : null;
  const change = Array.isArray(entry?.changes) ? entry.changes[0] : null;
  const value = change?.value;
  const message = Array.isArray(value?.messages) ? value.messages[0] : null;
  const phoneNumberId = value?.metadata?.phone_number_id;

  if (
    typeof phoneNumberId !== "string" ||
    !PHONE_NUMBER_ID_PATTERN.test(phoneNumberId) ||
    !message ||
    typeof message.id !== "string" ||
    typeof message.from !== "string" ||
    !PHONE_NUMBER_ID_PATTERN.test(message.from) ||
    typeof message.type !== "string"
  ) {
    return null;
  }

  if (message.type !== "text" || typeof message.text?.body !== "string") {
    return {
      id: message.id,
      phoneNumberId,
      from: message.from,
      type: message.type
    };
  }

  const text = message.text.body.trim();
  if (!text || text.length > 2000) return null;

  return {
    id: message.id,
    phoneNumberId,
    from: message.from,
    type: message.type,
    text
  };
}

export function createWhatsAppService(overrides = {}) {
  const dependencies = {
    getChannelConnectionByPhoneNumberId,
    getAgentById,
    findOrCreateWhatsAppCustomer,
    getOrCreateConversation,
    runAgentCore,
    sendWhatsAppTextMessage,
    ...overrides
  };

  return async function processWhatsAppMessage(message, { sendReply = true } = {}) {
    let stage = "channel_connection";
    let connection;
    try {
      connection = await dependencies.getChannelConnectionByPhoneNumberId(message.phoneNumberId);
    } catch (error) {
      logFlowError("[REPOSITORY]", stage, error);
      throw error;
    }
    if (!connection) {
      console.warn("[WARN] Evento WhatsApp recibido sin conexión activa");
      return { status: "unconfigured" };
    }
    console.info("[SIMULATOR] channel connection resolved");
    if (
      connection.phone_number_id !== message.phoneNumberId ||
      typeof connection.company_id !== "string" ||
      !connection.company_id ||
      typeof connection.agent_id !== "string" ||
      !connection.agent_id
    ) {
      console.warn("[WARN] Conexión WhatsApp incompleta o inválida");
      return { status: "invalid-connection" };
    }
    console.info("[SIMULATOR] company resolved");

    stage = "agent";
    let agent;
    try {
      agent = await dependencies.getAgentById(connection.agent_id);
    } catch (error) {
      logFlowError("[REPOSITORY]", stage, error);
      throw error;
    }
    if (
      !agent ||
      agent.id !== connection.agent_id ||
      agent.company_id !== connection.company_id ||
      agent.active !== true
    ) {
      console.warn("[WARN] Conexión WhatsApp asociada a un agente inválido");
      return { status: "invalid-agent" };
    }
    console.info("[SIMULATOR] agent resolved");

    if (message.type !== "text") return { status: "unsupported" };

    stage = "customer";
    let customer;
    try {
      customer = await dependencies.findOrCreateWhatsAppCustomer({
        companyId: connection.company_id,
        waId: message.from
      });
    } catch (error) {
      logFlowError("[REPOSITORY]", stage, error);
      throw error;
    }
    console.info("[SIMULATOR] customer resolved");

    stage = "conversation";
    let conversation;
    try {
      conversation = await dependencies.getOrCreateConversation({
        companyId: connection.company_id,
        agentId: connection.agent_id,
        customerId: customer.id,
        channel: "whatsapp"
      });
    } catch (error) {
      logFlowError("[REPOSITORY]", stage, error);
      throw error;
    }
    console.info("[SIMULATOR] conversation resolved");

    stage = "agent_core";
    let responseText;
    try {
      responseText = await dependencies.runAgentCore({
        companyId: connection.company_id,
        agentId: connection.agent_id,
        message: message.text,
        customerId: customer.id,
        conversationId: conversation.id,
        agent
      });
    } catch (error) {
      if (!(error && error.name === "OllamaUnavailableError")) {
        logFlowError("[SIMULATOR]", stage, error);
      }
      throw error;
    }

    if (sendReply) {
      await dependencies.sendWhatsAppTextMessage({
        phoneNumberId: connection.phone_number_id,
        to: message.from,
        text: responseText
      });
    }

    return {
      status: "processed",
      companyId: connection.company_id,
      agentId: connection.agent_id,
      customerId: customer.id,
      conversationId: conversation.id,
      reply: responseText
    };
  };
}

export function createWhatsAppSender({
  fetchImpl = globalThis.fetch,
  config = env
} = {}) {
  return async function sendWhatsAppTextMessage({ phoneNumberId, to, text }) {
    if (!config.whatsappToken || !config.whatsappApiVersion) {
      throw new Error("Configuración de WhatsApp incompleta");
    }
    if (!PHONE_NUMBER_ID_PATTERN.test(phoneNumberId) || !PHONE_NUMBER_ID_PATTERN.test(to)) {
      throw new Error("Identificador de WhatsApp inválido");
    }
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("El mensaje de respuesta de WhatsApp está vacío");
    }

    const response = await fetchImpl(
      `https://graph.facebook.com/${config.whatsappApiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.whatsappToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { body: text }
        })
      }
    );

    if (!response.ok) {
      const error = new Error(`WhatsApp Cloud API respondió HTTP ${response.status}`);
      error.code = "WHATSAPP_API_ERROR";
      throw error;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      const error = new Error("WhatsApp Cloud API devolvió una respuesta inválida");
      error.code = "WHATSAPP_INVALID_RESPONSE";
      throw error;
    }

    if (typeof data?.messages?.[0]?.id !== "string") {
      const error = new Error("WhatsApp Cloud API devolvió una respuesta inválida");
      error.code = "WHATSAPP_INVALID_RESPONSE";
      throw error;
    }

    return data;
  };
}

export const sendWhatsAppTextMessage = createWhatsAppSender();
export const processWhatsAppMessage = createWhatsAppService();
