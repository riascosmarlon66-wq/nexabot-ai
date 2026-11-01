import { supabase } from "../lib/supabase.js";

export async function getCustomerByCompanyAndChannelExternalId({ companyId, channel, externalId }) {
  const normalizedExternalId = typeof externalId === "string" ? externalId.trim() : externalId;

  if (!companyId || !channel || !normalizedExternalId) return null;

  const { data, error } = await supabase
    .from("customers")
    .select("id, company_id, channel, external_id, name")
    .eq("company_id", companyId)
    .eq("channel", channel)
    .eq("external_id", normalizedExternalId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function findOrCreateWhatsAppCustomer({ companyId, waId }) {
  const existing = await getCustomerByCompanyAndChannelExternalId({
    companyId,
    channel: "whatsapp",
    externalId: waId
  });

  if (existing) return existing;

  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_id: companyId,
      channel: "whatsapp",
      external_id: waId,
      name: null,
      email: null,
      phone: null
    })
    .select("id, company_id, channel, external_id, name")
    .single();

  if (error) throw error;
  return data;
}

export async function createCustomer({
  companyId,
  name,
  email,
  phone,
  externalId,
  channel
}) {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_id: companyId,
      name,
      email,
      phone,
      external_id: externalId,
      channel
    })
    .select("id, name, channel")
    .single();

  if (error) throw error;
  return data;
}
