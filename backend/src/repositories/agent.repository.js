import { supabase } from "../lib/supabase.js";

export async function getAgentById(agentId) {
  const { data, error } = await supabase
    .from("agents")
    .select("id, company_id, slug, name, role, instructions, active")
    .eq("id", agentId)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getAgentBySlug(companyId, agentSlug) {
  const { data, error } = await supabase
    .from("agents")
    .select("id, company_id, slug, name, role, instructions, active")
    .eq("company_id", companyId)
    .eq("slug", agentSlug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
