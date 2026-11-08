import { env } from "../../config/env.js";
import { getChannelConnectionByPhoneNumberId } from "../../repositories/channel-connection.repository.js";
import { getAgentById } from "../../repositories/agent.repository.js";
import { findOrCreateWhatsAppCustomer } from "../../repositories/customer.repository.js";
import { getOrCreateConversation } from "../../repositories/conversation.repository.js";
import { createMessage } from "../../repositories/message.repository.js";
import {
  getActiveCustomerRoutingSession,
  saveCustomerRoutingSession
} from "../../repositories/customer-routing-session.repository.js";
import { runAgentCore } from "../../services/agent-core.service.js";
import { resolveBusinessContext } from "../../services/business-router.service.js";
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
    getActiveCustomerRoutingSession,
    saveCustomerRoutingSession,
    resolveBusinessContext,
    createMessage,
    runAgentCore,
    sendWhatsAppTextMessage,
    ...overrides
  };

  return async function processWhatsAppMessage(
    message,
    { sendReply = true, entryToken } = {}
  ) {
    let stage = "router";
    let companyId;
    let agentId;
    let customerId;
    let conversationId;
    let agent;
    let hasResolvedCustomer = false;
    let hasResolvedConversation = false;

    console.info("[ROUTER] entryToken received", { tokenPresent: Boolean(entryToken) });
    if (entryToken) {
      let context;
      try {
        context = await dependencies.resolveBusinessContext({
          phoneNumberId: message.phoneNumberId,
          customerPhone: message.from,
          entryToken
        });
      } catch (error) {
        logFlowError("[ROUTER]", stage, error);
        throw error;
      }
      if (!context) return { status: "invalid-entry-point" };
      if (context.status === "invalid-agent") return context;

      ({ companyId, agentId, customerId, conversationId, agent } = context);
      if (
        typeof companyId !== "string" || !companyId ||
        typeof agentId !== "string" || !agentId ||
        typeof customerId !== "string" || !customerId ||
        typeof conversationId !== "string" || !conversationId
      ) {
        return { status: "invalid-entry-point" };
      }
      hasResolvedCustomer = true;
      hasResolvedConversation = true;
      console.info("[ROUTER] entry point resolved", { companyId, agentId });
    } else {
      let routingSession;
      try {
        routingSession = await dependencies.getActiveCustomerRoutingSession({
          phoneNumberId: message.phoneNumberId,
          customerPhone: message.from
        });
      } catch (error) {
        logFlowError("[ROUTER]", "routing_session", error);
        throw error;
      }

      if (routingSession) {
        ({
          company_id: companyId,
          agent_id: agentId,
          customer_id: customerId,
          conversation_id: conversationId
        } = routingSession);
        if (
          typeof companyId !== "string" || !companyId ||
          typeof agentId !== "string" || !agentId ||
          typeof customerId !== "string" || !customerId ||
          typeof conversationId !== "string" || !conversationId
        ) {
          return { status: "invalid-routing-session" };
        }
        hasResolvedCustomer = true;
        hasResolvedConversation = true;
        console.info("[ROUTER] routing session resolved", { companyId, agentId });
      } else {
        stage = "channel_connection";
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
        ({ company_id: companyId, agent_id: agentId } = connection);
      }
    }

    if (
      typeof companyId !== "string" || !companyId ||
      typeof agentId !== "string" || !agentId
    ) {
      return { status: "invalid-connection" };
    }

    stage = "agent";
    if (!agent) {
      try {
        agent = await dependencies.getAgentById(agentId);
      } catch (error) {
        logFlowError("[REPOSITORY]", stage, error);
        throw error;
      }
    }
    if (
      !agent ||
      agent.id !== agentId ||
      agent.company_id !== companyId ||
      agent.active !== true
    ) {
      console.warn("[WARN] Ruta WhatsApp asociada a un agente inválido");
      return { status: "invalid-agent" };
    }
    console.info("[ROUTER] agent resolved", { companyId, agentId });

    if (message.type !== "text") return { status: "unsupported" };

    if (!hasResolvedCustomer) {
      stage = "customer";
      let customer;
      try {
        customer = await dependencies.findOrCreateWhatsAppCustomer({
          companyId,
          waId: message.from
        });
      } catch (error) {
        logFlowError("[REPOSITORY]", stage, error);
        throw error;
      }
      customerId = customer.id;
    }

    if (!hasResolvedConversation) {
      stage = "conversation";
      let conversation;
      try {
        conversation = await dependencies.getOrCreateConversation({
          companyId,
          agentId,
          customerId,
          channel: "whatsapp"
        });
      } catch (error) {
        logFlowError("[REPOSITORY]", stage, error);
        throw error;
      }
      conversationId = conversation.id;
    }

    if (entryToken) {
      try {
        await dependencies.saveCustomerRoutingSession({
          phoneNumberId: message.phoneNumberId,
          customerPhone: message.from,
          companyId,
          agentId,
          customerId,
          conversationId
        });
      } catch (error) {
        logFlowError("[REPOSITORY]", "routing_session_update", error);
        throw error;
      }
      console.info("[ROUTER] routing session updated", {
        companyId,
        agentId,
        conversationId
      });
    }

    await dependencies.createMessage({
      companyId,
      conversationId,
      senderType: "customer",
      content: message.text,
      channel: "whatsapp"
    });

    stage = "agent_core";
    let responseText;
    try {
      responseText = await dependencies.runAgentCore({
        companyId,
        agentId,
        message: message.text,
        customerId,
        conversationId,
        currentMessagePersisted: true,
        agent
      });
    } catch (error) {
      if (!(typeof error?.code === "string" && error.code.startsWith("AI_PROVIDER_"))) {
        logFlowError("[SIMULATOR]", stage, error);
      }
      throw error;
    }

    await dependencies.createMessage({
      companyId,
      conversationId,
      senderType: "agent",
      content: responseText,
      channel: "whatsapp"
    });

    if (sendReply) {
      await dependencies.sendWhatsAppTextMessage({
        phoneNumberId: message.phoneNumberId,
        to: message.from,
        text: responseText
      });
    }

    return {
      status: "processed",
      companyId,
      agentId,
      customerId,
      conversationId,
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
