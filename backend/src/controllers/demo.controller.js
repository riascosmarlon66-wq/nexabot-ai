import { runAgentCore } from "../services/agent-core.service.js";
import { getCompanyById } from "../repositories/company.repository.js";
import { getAgentById } from "../repositories/agent.repository.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_LENGTH = 12000;

const DEMO_TARGETS = Object.freeze({
  restaurant: {
    companyId: "65615fd5-83a6-4bfb-abaf-bfba8784b82c",
    agentId: "dd799756-7e16-441c-b841-e2c7e26b5f59"
  },
  clinic: {
    companyId: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
    agentId: "858c4aa1-2fab-4264-8f72-3094b1adc79b"
  }
});

export function createDemoController(dependencies = {}) {
  const runCore = dependencies.runAgentCore ?? runAgentCore;
  const loadCompany = dependencies.getCompanyById ?? getCompanyById;
  const loadAgent = dependencies.getAgentById ?? getAgentById;

  return async function postDemoChat(req, res, next) {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const business = typeof body.business === "string" ? body.business.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const context = typeof body.context === "string" ? body.context.trim() : "";
    const target = DEMO_TARGETS[business];

    if (!target) {
      return res.status(400).json({ error: "business debe ser restaurant o clinic" });
    }
    if (!message) {
      return res.status(400).json({ error: "message es obligatorio" });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `message no puede superar ${MAX_MESSAGE_LENGTH} caracteres` });
    }
    if (context.length > MAX_CONTEXT_LENGTH) {
      return res.status(400).json({ error: "context es demasiado largo" });
    }

    try {
      const [company, agent] = await Promise.all([
        loadCompany(target.companyId),
        loadAgent(target.agentId)
      ]);

      if (!company) return res.status(404).json({ error: "Empresa demo no disponible" });
      if (!agent || agent.company_id !== company.id || agent.active !== true) {
        return res.status(404).json({ error: "Agente demo no disponible" });
      }

      const response = await runCore({
        companyId: company.id,
        agentId: agent.id,
        message,
        context: context || undefined,
        company,
        agent
      });

      return res.json({
        business,
        company: company.name,
        agent: "VEKTOR AI",
        response
      });
    } catch (error) {
      logFlowError("[DEMO_CHAT]", "request", error);
      return next(error);
    }
  };
}

export const postDemoChat = createDemoController();
