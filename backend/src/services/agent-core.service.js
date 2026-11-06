import { runAgent } from "../agent/agent.js";
import { getCompanyById } from "../repositories/company.repository.js";
import { getAgentById } from "../repositories/agent.repository.js";
import { getProductsByCompany } from "../repositories/product.repository.js";
import { getServicesByCompany } from "../repositories/service.repository.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

async function loadRepositoryStage(stage, load) {
  try {
    return await load();
  } catch (error) {
    logFlowError("[REPOSITORY]", stage, error);
    throw error;
  }
}

export async function runAgentCore({
  companyId,
  agentId,
  message,
  customerId: _customerId,
  conversationId: _conversationId,
  company: providedCompany,
  agent: providedAgent,
  products: providedProducts,
  services: providedServices
}) {
  const company = providedCompany ?? await loadRepositoryStage(
    "company",
    () => getCompanyById(companyId)
  );
  const agent = providedAgent ?? await loadRepositoryStage(
    "agent",
    () => getAgentById(agentId)
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
    () => getProductsByCompany(companyId)
  );
  console.info("[AGENT_CORE] products loaded");

  const services = providedServices ?? await loadRepositoryStage(
    "services",
    () => getServicesByCompany(companyId)
  );
  console.info("[AGENT_CORE] services loaded");

  console.info("[AGENT_CORE] calling ollama");
  const response = await runAgent({
    name: company.name,
    sector: company.sector,
    agentName: agent.name,
    role: agent.role,
    instructions: agent.instructions,
    products,
    services
  }, message);
  console.info("[AGENT_CORE] ollama response received");
  return response;
}
