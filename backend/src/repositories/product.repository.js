import { supabase } from "../lib/supabase.js";

export async function getProductsByCompany(companyId) {
  const { data, error } = await supabase
    .from("products")
    .select("name, description, price_cop")
    .eq("company_id", companyId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
