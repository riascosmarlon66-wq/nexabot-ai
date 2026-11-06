import companies from "../companies/companies.js";
import { getCompanyBySlug } from "../repositories/company.repository.js";
import { getAgentBySlug } from "../repositories/agent.repository.js";
import { runAgentCore } from "../services/agent-core.service.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

const MAX_MESSAGE_LENGTH = 2000;

async function loadRepositoryStage(stage, load) {
  try {
    return await load();
  } catch (error) {
    logFlowError("[REPOSITORY]", stage, error);
    throw error;
  }
}

export async function postChat(req, res, next) {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const companyId = typeof body.companyId === "string" ? body.companyId.trim() : "";
  const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!companyId) return res.status(400).json({ error: "companyId es obligatorio" });
  if (!message) return res.status(400).json({ error: "message es obligatorio y debe ser texto no vacío" });
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `message no puede superar ${MAX_MESSAGE_LENGTH} caracteres` });
  }

  try {
    if (companyId === "demo") {
      const demoCompany = companies.demo;
      const demoAgent = {
        id: "demo",
        company_id: demoCompany.id,
        name: demoCompany.agentName,
        instructions: demoCompany.instructions,
        active: true
      };
      const response = await runAgentCore({
        companyId: demoCompany.id,
        agentId: demoAgent.id,
        message,
        company: demoCompany,
        agent: demoAgent,
        products: [],
        services: []
      });
      return res.json({ company: demoCompany.name, agent: demoCompany.agentName, response });
    }

    if (!agentId) return res.status(400).json({ error: "agentId es obligatorio" });

    console.info(`[INFO] Resolviendo empresa: ${companyId}`);
    const company = await loadRepositoryStage("company", () => getCompanyBySlug(companyId));
    if (!company) return res.status(404).json({ error: "Empresa no encontrada" });

    const agent = await loadRepositoryStage(
      "agent",
      () => getAgentBySlug(company.id, agentId)
    );
    if (!agent) return res.status(404).json({ error: "Agente no encontrado para esta empresa" });

    const response = await runAgentCore({
      companyId: company.id,
      agentId: agent.id,
      message,
      company,
      agent
    });

    return res.json({ company: company.name, agent: agent.name, response });
  } catch (error) {
    logFlowError("[API_CHAT]", "request", error);
    return next(error);
  }
}
