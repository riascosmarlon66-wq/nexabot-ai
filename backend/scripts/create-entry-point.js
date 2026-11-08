import crypto from "crypto";
import { supabase } from "../src/lib/supabase.js";

const [, , companyId, agentId, name] = process.argv;

if (!companyId || !agentId || !name) {
  console.error(
    'Uso: node scripts/create-entry-point.js <companyId> <agentId> "Nombre del QR"'
  );
  process.exit(1);
}

function generateEntryToken() {
  return `nx_${crypto.randomBytes(24).toString("hex")}`;
}

function hashEntryToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function main() {
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .single();

  if (companyError || !company) {
    throw new Error("La empresa indicada no existe.");
  }

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("id, company_id, active")
    .eq("id", agentId)
    .single();

  if (agentError || !agent) {
    throw new Error("El agente indicado no existe.");
  }

  if (agent.company_id !== companyId) {
    throw new Error("El agente no pertenece a la empresa indicada.");
  }

  if (agent.active === false) {
    throw new Error("El agente está inactivo.");
  }

  const token = generateEntryToken();
  const tokenHash = hashEntryToken(token);

  const { data, error } = await supabase
    .from("business_entry_points")
    .insert({
      company_id: companyId,
      agent_id: agentId,
      name,
      token_hash: tokenHash,
      active: true,
    })
    .select("id, name")
    .single();

  if (error) {
    throw error;
  }

  console.log("");
  console.log("Entry point creado correctamente");
  console.log("");
  console.log("ID:");
  console.log(data.id);
  console.log("");
  console.log("Nombre:");
  console.log(data.name);
  console.log("");
  console.log("TOKEN:");
  console.log(token);
  console.log("");
  console.log(
    "IMPORTANTE: este token se muestra una sola vez. Guárdalo de forma segura."
  );
}

main().catch((error) => {
  console.error("Error creando entry point:");
  console.error(error.message);
  process.exitCode = 1;
});