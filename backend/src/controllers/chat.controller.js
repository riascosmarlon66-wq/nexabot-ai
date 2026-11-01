import companies from "../companies/companies.js";
import { runAgent } from "../agent/agent.js";
import { getCompanyBySlug } from "../repositories/company.repository.js";
import { getAgentBySlug } from "../repositories/agent.repository.js";
import { getProductsByCompany } from "../repositories/product.repository.js";
import { getServicesByCompany } from "../repositories/service.repository.js";

const MAX_MESSAGE_LENGTH = 2000;

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
      const response = await runAgent(demoCompany, message);
      return res.json({ company: demoCompany.name, agent: demoCompany.agentName, response });
    }

    if (!agentId) return res.status(400).json({ error: "agentId es obligatorio" });

    console.info(`[INFO] Resolviendo empresa: ${companyId}`);
    const company = await getCompanyBySlug(companyId);
    if (!company) return res.status(404).json({ error: "Empresa no encontrada" });

    const agent = await getAgentBySlug(company.id, agentId);
    if (!agent) return res.status(404).json({ error: "Agente no encontrado para esta empresa" });

    const products = await getProductsByCompany(company.id);
    const services = await getServicesByCompany(company.id);
    console.info(`[INFO] Contexto cargado | empresa=${companyId} agente=${agentId} productos=${products.length} servicios=${services.length}`);

    const response = await runAgent({
      name: company.name,
      sector: company.sector,
      agentName: agent.name,
      role: agent.role,
      instructions: agent.instructions,
      products,
      services
    }, message);

    return res.json({ company: company.name, agent: agent.name, response });
  } catch (error) {
    if (error && typeof error === "object") {
      console.error("[ERROR] Falló POST /api/chat", {
        message: typeof error.message === "string" ? error.message : String(error),
        ...(error.code ? { code: error.code } : {}),
        ...(error.hint ? { hint: error.hint } : {})
      });
    }
    return next(error);
  }
}
