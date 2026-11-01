import { supabase } from "../lib/supabase.js";

export async function getServicesByCompany(companyId) {
  const { data, error } = await supabase
    .from("services")
    .select("name, description, price_cop")
    .eq("company_id", companyId)
    .eq("active", true)
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}