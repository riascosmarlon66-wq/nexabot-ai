import { supabase } from "../lib/supabase.js";
import { env } from "../config/env.js";
import { logFlowError } from "../lib/flow-diagnostics.js";

const MAX_RECENT_MESSAGES = 10;

class MessagePersistenceError extends Error {
  constructor(cause) {
    super("No se pudo persistir el mensaje", { cause });
    this.name = "MessagePersistenceError";
    this.code = "MESSAGE_REPOSITORY_ERROR";
  }
}

function safeDatabaseError(error) {
  const redact = (value) => typeof value === "string"
    ? value
      .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]")
      .replace(/(authorization|token|secret|api[_-]?key)(\s*[:=]\s*)[^\s,;]+/gi, "$1$2[REDACTED]")
    : value;

  return {
    message: redact(error?.message || "No se pudo persistir el mensaje"),
    ...(error?.code ? { code: redact(error.code) } : {}),
    ...(error?.details ? { details: redact(error.details) } : {})
  };
}

export function createMessageRepository(client = supabase) {
  return {
    async createMessage({ companyId, conversationId, senderType, content, channel }) {
      if (env.nodeEnv === "development") {
        console.info("[MESSAGES] saving message", {
          companyId,
          conversationId,
          senderType
        });
      }

      try {
        const { data, error } = await client
          .from("messages")
          .insert({
            company_id: companyId,
            conversation_id: conversationId,
            sender_type: senderType,
            content,
            channel
          })
          .select("id, company_id, conversation_id, sender_type, content, channel, created_at")
          .single();

        if (error) throw error;
        if (!data) {
          throw new Error("Supabase insert did not return a saved message");
        }
        if (env.nodeEnv === "development") {
          console.info("[MESSAGES] message saved", {
            companyId,
            conversationId,
            senderType
          });
        }
        return data;
      } catch (error) {
        console.error("[MESSAGES] insert failed", {
          ...safeDatabaseError(error),
          companyId,
          conversationId,
          senderType
        });
        throw new MessagePersistenceError(error);
      }
    },

    async getRecentMessages({
      companyId,
      conversationId,
      limit = MAX_RECENT_MESSAGES
    }) {
      const safeLimit = Number.isInteger(limit)
        ? Math.max(0, Math.min(limit, MAX_RECENT_MESSAGES))
        : MAX_RECENT_MESSAGES;
      if (!companyId || !conversationId || safeLimit === 0) return [];

      const { data, error } = await client
        .from("messages")
        .select("sender_type, content, created_at")
        .eq("company_id", companyId)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(safeLimit);

      if (error) {
        logFlowError("[REPOSITORY]", "recent_messages", error);
        throw error;
      }

      return (data ?? []).reverse();
    }
  };
}

const messageRepository = createMessageRepository();
export const createMessage = messageRepository.createMessage;
export const getRecentMessages = messageRepository.getRecentMessages;
