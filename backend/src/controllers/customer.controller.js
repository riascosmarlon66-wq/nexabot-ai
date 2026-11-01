import { getCompanyBySlug } from "../repositories/company.repository.js";
import { createCustomer } from "../repositories/customer.repository.js";

function isCustomerDuplicateError(error) {
  if (!error || typeof error !== "object" || error.code !== "23505") return false;

  const constraint = [
    error.constraint,
    error.message,
    error.details
  ].filter((value) => typeof value === "string").join(" ").toLowerCase();

  return ["company_id", "channel", "external_id"].every((field) => constraint.includes(field));
}

export async function createCustomerController(req, res, next) {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const companySlug = typeof body.companyId === "string" ? body.companyId.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const channel = typeof body.channel === "string" ? body.channel.trim() : "";

  if (!companySlug) return res.status(400).json({ error: "companyId es obligatorio" });
  if (!name) return res.status(400).json({ error: "name es obligatorio" });
  if (!channel) return res.status(400).json({ error: "channel es obligatorio" });

  const optionalFields = ["email", "phone", "externalId"];
  for (const field of optionalFields) {
    if (body[field] !== undefined && body[field] !== null && typeof body[field] !== "string") {
      return res.status(400).json({ error: `${field} debe ser texto` });
    }
  }

  try {
    const company = await getCompanyBySlug(companySlug);
    if (!company) return res.status(404).json({ error: "Empresa no encontrada" });

    const customer = await createCustomer({
      companyId: company.id,
      name,
      email: typeof body.email === "string" ? body.email.trim() || null : null,
      phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
      externalId: typeof body.externalId === "string" ? body.externalId.trim() || null : null,
      channel
    });

    console.info(`[INFO] Customer creado | empresa=${companySlug} canal=${channel.replace(/[\r\n]/g, "")}`);
    return res.status(201).json({
      id: customer.id,
      name: customer.name,
      channel: customer.channel
    });
  } catch (error) {
    if (isCustomerDuplicateError(error)) {
      return res.status(409).json({ error: "Cliente ya registrado" });
    }
    return next(error);
  }
}
