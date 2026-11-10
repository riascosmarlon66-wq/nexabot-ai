import companies from "../companies/companies.js";
import { getCompanyBySlug } from "../repositories/company.repository.js";
import { getAgentBySlug } from "../repositories/agent.repository.js";
import { runAgentCore } from "../services/agent-core.service.js";
import { logFlowError } from "../lib/flow-diagnostics.js";
import { getConversationById } from "../repositories/conversation.repository.js";
import { createMessage } from "../repositories/message.repository.js";

const MAX_MESSAGE_LENGTH = 2000;

async function loadRepositoryStage(stage, load) {
  try {
    return await load();
  } catch (error) {
    logFlowError("[REPOSITORY]", stage, error);
    throw error;
  }
}

export function createChatController(dependencies = {}) {
  const runCore = dependencies.runAgentCore ?? runAgentCore;
  const loadCompanyBySlug = dependencies.getCompanyBySlug ?? getCompanyBySlug;
  const loadAgentBySlug = dependencies.getAgentBySlug ?? getAgentBySlug;
  const loadConversationById = dependencies.getConversationById ?? getConversationById;
  const saveMessage = dependencies.createMessage ?? createMessage;

  return async function postChat(req, res, next) {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const companyId = typeof body.companyId === "string" ? body.companyId.trim() : "";
    const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const conversationId = typeof body.conversationId === "string"
      ? body.conversationId.trim()
      : "";

    if (!companyId) return res.status(400).json({ error: "companyId es obligatorio" });
    if (!message) {
      return res.status(400).json({ error: "message es obligatorio y debe ser texto no vacío" });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `message no puede superar ${MAX_MESSAGE_LENGTH} caracteres`
      });
    }

    try {
      if (companyId === "demo") {
        if (conversationId) {
          return res.status(404).json({ error: "Conversación no encontrada" });
        }
        const demoCompany = companies.demo;
        const demoAgent = {
          id: "demo",
          company_id: demoCompany.id,
          name: demoCompany.agentName,
          instructions: demoCompany.instructions,
          active: true
        };
        const response = await runCore({
          companyId: demoCompany.id,
          agentId: demoAgent.id,
          message,
          company: demoCompany,
          agent: demoAgent,
          products: [],
          services: []
        });
        return res.json({
          company: demoCompany.name,
          agent: demoCompany.agentName,
          response
        });
      }

      if (!agentId) return res.status(400).json({ error: "agentId es obligatorio" });

      console.info(`[INFO] Resolviendo empresa: ${companyId}`);
      const company = await loadRepositoryStage(
        "company",
        () => loadCompanyBySlug(companyId)
      );
      if (!company) return res.status(404).json({ error: "Empresa no encontrada" });

      const agent = await loadRepositoryStage(
        "agent",
        () => loadAgentBySlug(company.id, agentId)
      );
      if (!agent) {
        return res.status(404).json({ error: "Agente no encontrado para esta empresa" });
      }

      if (conversationId) {
        const conversation = await loadRepositoryStage(
          "conversation",
          () => loadConversationById({ companyId: company.id, conversationId })
        );
        if (!conversation || conversation.channel !== "web") {
          return res.status(404).json({ error: "Conversación no encontrada" });
        }
        await saveMessage({
          companyId: company.id,
          conversationId,
          senderType: "customer",
          content: message,
          channel: "web"
        });
      }

      const response = await runCore({
        companyId: company.id,
        agentId: agent.id,
        message,
        conversationId: conversationId || undefined,
        currentMessagePersisted: Boolean(conversationId),
        company,
        agent
      });

      if (conversationId) {
        await saveMessage({
          companyId: company.id,
          conversationId,
          senderType: "agent",
          content: response,
          channel: "web"
        });
      }

      return res.json({ company: company.name, agent: agent.name, response });
    } catch (error) {
      logFlowError("[API_CHAT]", "request", error);
      return next(error);
    }
  };
}

export const postChat = createChatController();
