import { getActiveBusinessEntryPointByToken } from "../repositories/business-entry-point.repository.js";
import { findOrCreateWhatsAppCustomer } from "../repositories/customer.repository.js";
import { getOrCreateConversation } from "../repositories/conversation.repository.js";
import { getAgentById } from "../repositories/agent.repository.js";

export async function resolveBusinessContext({
  phoneNumberId,
  customerPhone,
  entryToken
}) {
  const entryPoint = await getActiveBusinessEntryPointByToken(entryToken);
  if (
    !entryPoint ||
    typeof entryPoint.company_id !== "string" ||
    !entryPoint.company_id ||
    typeof entryPoint.agent_id !== "string" ||
    !entryPoint.agent_id
  ) return null;

  const agent = await getAgentById(entryPoint.agent_id);
  if (
    !agent ||
    agent.id !== entryPoint.agent_id ||
    agent.company_id !== entryPoint.company_id ||
    agent.active !== true
  ) {
    return { status: "invalid-agent" };
  }

  const customer = await findOrCreateWhatsAppCustomer({
    companyId: entryPoint.company_id,
    waId: customerPhone
  });
  const conversation = await getOrCreateConversation({
    companyId: entryPoint.company_id,
    agentId: entryPoint.agent_id,
    customerId: customer.id,
    channel: "whatsapp"
  });

  console.info("[ROUTER] entry point resolved", {
    companyId: entryPoint.company_id,
    agentId: entryPoint.agent_id
  });
  return {
    companyId: entryPoint.company_id,
    agentId: entryPoint.agent_id,
    customerId: customer.id,
    conversationId: conversation.id,
    agent
  };
}
