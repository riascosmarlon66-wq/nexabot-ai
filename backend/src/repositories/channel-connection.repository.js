import { supabase } from "../lib/supabase.js";

export async function getChannelConnectionByPhoneNumberId(phoneNumberId) {
  if (phoneNumberId === undefined || phoneNumberId === null) return null;

  const normalized = typeof phoneNumberId === "string"
    ? phoneNumberId.trim()
    : String(phoneNumberId).trim();

  if (!normalized) return null;

  const { data, error } = await supabase
    .from("channel_connections")
    .select("company_id, agent_id, channel, phone_number_id, active")
    .eq("channel", "whatsapp")
    .eq("phone_number_id", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}
