import { supabase } from "../lib/supabase.js";

const TABLE_NAME = "customer_routing_sessions";
const SESSION_COLUMNS = "id, phone_number_id, customer_phone, company_id, agent_id, customer_id, conversation_id, active";

class RoutingSessionRepositoryError extends Error {
  constructor(error, stage) {
    super(error?.message || "Customer routing session repository failed", { cause: error });
    this.name = "RoutingSessionRepositoryError";
    this.code = error?.code;
    this.details = error?.details;
    this.hint = error?.hint;
    this.stage = stage;
  }
}

function throwRoutingSessionError(error, stage) {
  console.error("[ROUTING_SESSION_ERROR]", {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    stage
  });
  throw new RoutingSessionRepositoryError(error, stage);
}

export function createCustomerRoutingSessionRepository(client = supabase) {
  return {
    async getActiveCustomerRoutingSession({ phoneNumberId, customerPhone }) {
      const { data, error } = await client
        .from(TABLE_NAME)
        .select(SESSION_COLUMNS)
        .eq("phone_number_id", phoneNumberId)
        .eq("customer_phone", customerPhone)
        .eq("active", true)
        .maybeSingle();

      if (error) throwRoutingSessionError(error, "routing_session_lookup");
      return data ?? null;
    },

    async saveCustomerRoutingSession({
      phoneNumberId,
      customerPhone,
      companyId,
      agentId,
      customerId,
      conversationId
    }) {
      const values = {
        phone_number_id: phoneNumberId,
        customer_phone: customerPhone,
        company_id: companyId,
        agent_id: agentId,
        customer_id: customerId,
        conversation_id: conversationId,
        active: true,
        updated_at: new Date().toISOString()
      };

      let result;
      try {
        result = await client
          .from(TABLE_NAME)
          .upsert(values, { onConflict: "phone_number_id,customer_phone" })
          .select(SESSION_COLUMNS)
          .single();
      } catch (error) {
        throwRoutingSessionError(error, "routing_session_update");
      }

      if (result.error) {
        throwRoutingSessionError(result.error, "routing_session_update");
      }
      if (!result.data) {
        throwRoutingSessionError(
          new Error("Supabase upsert returned no routing session"),
          "routing_session_update"
        );
      }
      return result.data;
    }
  };
}

const customerRoutingSessionRepository = createCustomerRoutingSessionRepository();
export const getActiveCustomerRoutingSession =
  customerRoutingSessionRepository.getActiveCustomerRoutingSession;
export const saveCustomerRoutingSession =
  customerRoutingSessionRepository.saveCustomerRoutingSession;
