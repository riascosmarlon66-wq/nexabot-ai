import { supabase } from "../lib/supabase.js";

export async function getCompanyById(id) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, slug, name, sector")
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getCompanyBySlug(slug) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, slug, name, sector")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
