import { supabase } from "../lib/supabase.js";

export async function getChannelConnectionByPhoneNumberId(phoneNumberId) {
  if (phoneNumberId === undefined || phoneNumberId === null) return null;

  const normalized = typeof phoneNumberId === "string"
    ? phoneNumberId.trim()
    : String(phoneNumberId).trim();

  if (!normalized) return null;

  const { data, error } = await supabase
    .from("channel_connections")
    .select("id, company_id, agent_id, phone_number_id, business_account_id, display_phone_number")
    .eq("channel", "whatsapp")
    .eq("phone_number_id", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}
