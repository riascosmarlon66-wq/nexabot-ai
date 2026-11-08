import { createHash } from "node:crypto";
import { supabase } from "../lib/supabase.js";

export async function getActiveBusinessEntryPointByToken(entryToken) {
  const tokenHash = createHash("sha256").update(entryToken).digest("hex");
  const { data, error } = await supabase
    .from("business_entry_points")
    .select("id, company_id, agent_id, active")
    .eq("token_hash", tokenHash)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}
