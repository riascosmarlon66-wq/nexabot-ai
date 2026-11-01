import { supabase } from "../lib/supabase.js";

export async function getConversationByCustomer({ companyId, agentId, customerId, channel }) {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, company_id, agent_id, customer_id, channel, last_activity_at")
    .eq("company_id", companyId)
    .eq("agent_id", agentId)
    .eq("customer_id", customerId)
    .eq("channel", channel)
    .order("last_activity_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function createConversation({ companyId, agentId, customerId, channel }) {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      company_id: companyId,
      agent_id: agentId,
      customer_id: customerId,
      channel,
      last_activity_at: new Date().toISOString()
    })
    .select("id, company_id, agent_id, customer_id, channel, last_activity_at")
    .single();

  if (error) throw error;
  return data;
}

export async function updateConversationLastActivity(conversationId) {
  const { data, error } = await supabase
    .from("conversations")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", conversationId)
    .select("id, last_activity_at")
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateConversation({ companyId, agentId, customerId, channel }) {
  const existing = await getConversationByCustomer({ companyId, agentId, customerId, channel });

  if (existing) {
    await updateConversationLastActivity(existing.id);
    return existing;
  }

  return createConversation({ companyId, agentId, customerId, channel });
}
