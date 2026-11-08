import { getAIProvider, AIProviderError } from "../ai/ai-provider.js";
import { buildAgentSystemPrompt } from "../ai/agent-prompt.js";
import { getCompanyById } from "../repositories/company.repository.js";
import { getAgentById } from "../repositories/agent.repository.js";
import { getProductsByCompany } from "../repositories/product.repository.js";
import { getServicesByCompany } from "../repositories/service.repository.js";
import { getRecentMessages } from "../repositories/message.repository.js";
import { logFlowError } from "../lib/flow-diagnostics.js";
import { env } from "../config/env.js";

async function loadRepositoryStage(stage, load) {
  try {
    return await load();
  } catch (error) {
    logFlowError("[REPOSITORY]", stage, error);
    throw error;
  }
}

export async function runAgentCore(input, dependencies = {}) {
  const {
    companyId,
    agentId,
    message,
    customerId,
    conversationId,
    company: providedCompany,
    agent: providedAgent,
    products: providedProducts,
    services: providedServices,
    context: providedContext,
    currentMessagePersisted = false
  } = input;
  const loadCompany = dependencies.getCompanyById ?? getCompanyById;
  const loadAgent = dependencies.getAgentById ?? getAgentById;
  const loadProducts = dependencies.getProductsByCompany ?? getProductsByCompany;
  const loadServices = dependencies.getServicesByCompany ?? getServicesByCompany;
  const loadRecentMessages = dependencies.getRecentMessages ?? getRecentMessages;
  const resolveAIProvider = dependencies.getAIProvider ?? getAIProvider;

  const company = providedCompany ?? await loadRepositoryStage(
    "company",
    () => loadCompany(companyId)
  );
  const agent = providedAgent ?? await loadRepositoryStage(
    "agent",
    () => loadAgent(agentId)
  );

  if (!company || company.id !== companyId) {
    throw new Error("Empresa no disponible para Agent Core");
  }
  console.info("[AGENT_CORE] company loaded");
  if (!agent || agent.id !== agentId || agent.company_id !== companyId || agent.active !== true) {
    throw new Error("Agente no disponible para Agent Core");
  }
  console.info("[AGENT_CORE] agent loaded");

  const products = providedProducts ?? await loadRepositoryStage(
    "products",
    () => loadProducts(companyId)
  );
  console.info("[AGENT_CORE] products loaded");

  const services = providedServices ?? await loadRepositoryStage(
    "services",
    () => loadServices(companyId)
  );
  console.info("[AGENT_CORE] services loaded");

  let history = providedContext;
  let historyMessages = typeof history === "string" && history
    ? history.split("\n").map((line) => {
        const match = /^(Cliente|Asistente):\s?([\s\S]*)$/.exec(line);
        if (!match) return null;
        return {
          role: match[1] === "Cliente" ? "user" : "assistant",
          content: match[2]
        };
      }).filter(Boolean)
    : [];
  let historyCount = historyMessages.length;
  if (history === undefined && conversationId) {
    const recentMessages = await loadRepositoryStage(
      "recent_messages",
      () => loadRecentMessages({ companyId, conversationId, limit: 10 })
    );
    const recentHistory = Array.isArray(recentMessages) ? [...recentMessages] : [];
    if (currentMessagePersisted) {
      let currentMessageIndex = -1;
      for (let index = recentHistory.length - 1; index >= 0; index -= 1) {
        const entry = recentHistory[index];
        if (entry?.sender_type === "customer" && entry.content === message) {
          currentMessageIndex = index;
          break;
        }
      }
      if (currentMessageIndex >= 0) recentHistory.splice(currentMessageIndex);
    }

    historyMessages = recentHistory
      .filter((entry) =>
        (entry?.sender_type === "customer" || entry?.sender_type === "agent") &&
        typeof entry.content === "string"
      )
      .map((entry) => ({
        role: entry.sender_type === "customer" ? "user" : "assistant",
        content: entry.content
      }));
    historyCount = historyMessages.length;

    console.info("[AGENT_CORE] conversation history loaded", {
      conversationId,
      count: historyMessages.length
    });
    console.info("[AGENT_CORE] history count", { count: historyMessages.length });
    if (env.nodeEnv === "development") {
      console.info("[AGENT_CORE] history roles", historyMessages.map(({ role, content }) => ({
        role,
        preview: typeof content === "string" ? `${content.slice(0, 60)}${content.length > 60 ? "..." : ""}` : ""
      })));
    }

    history = historyMessages
      .map(({ role, content }) => `${role === "user" ? "Cliente" : "Asistente"}: ${content}`)
      .join("\n");
  }

  const systemPrompt = buildAgentSystemPrompt({
    name: company.name,
    sector: company.sector,
    agentName: typeof agent?.name === "string"
      ? agent.name.trim() || "No registrado"
      : "No registrado",
    role: agent.role,
    instructions: agent.instructions,
    products,
    services
  });
  const provider = resolveAIProvider();
  console.info("[AGENT_CORE] calling AI provider", {
    provider: provider.constructor.name,
    historyCount
  });
  const result = await provider.generateText({
    systemPrompt,
    userMessage: message,
    context: {
      companyId,
      agentId,
      customerId,
      conversationId,
      history: history || "",
      historyMessages
    }
  });
  if (!result || typeof result.text !== "string" || !result.text.trim()) {
    throw new AIProviderError(
      "AI_PROVIDER_INVALID_RESPONSE",
      "Respuesta inválida del proveedor de IA"
    );
  }
  console.info("[AGENT_CORE] AI provider response received", {
    provider: result.provider,
    model: result.model
  });
  return result.text;
}
