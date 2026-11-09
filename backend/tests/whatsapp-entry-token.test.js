import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWhatsAppEntryMessage,
  extractEmbeddedEntryToken
} from "../src/channels/whatsapp/whatsapp-entry-token.js";
import { createWhatsAppService } from "../src/channels/whatsapp/whatsapp.service.js";

const TOKEN = "nx_1234567890abcdef1234567890abcdef1234567890abcdef";

test("extrae token embebido y limpia el mensaje para el agente", () => {
  assert.deepEqual(
    extractEmbeddedEntryToken(`Hola, quiero información [NX:${TOKEN}]`),
    {
      entryToken: TOKEN,
      cleanText: "Hola, quiero información"
    }
  );
});

test("conserva mensajes normales sin token", () => {
  assert.deepEqual(
    extractEmbeddedEntryToken("  Hola, ¿cómo están?  "),
    {
      entryToken: undefined,
      cleanText: "Hola, ¿cómo están?"
    }
  );
});

test("construye el mensaje precargado de WhatsApp", () => {
  assert.equal(
    buildWhatsAppEntryMessage(TOKEN),
    `Hola, quiero información [NX:${TOKEN}]`
  );
});

test("el servicio usa el token embebido, actualiza routing y no persiste el marcador", async () => {
  const calls = [];
  const process = createWhatsAppService({
    resolveBusinessContext: async ({ phoneNumberId, customerPhone, entryToken }) => {
      calls.push(["resolve", { phoneNumberId, customerPhone, entryToken }]);
      return {
        companyId: "clinic-company",
        agentId: "clinic-agent",
        customerId: "clinic-customer",
        conversationId: "clinic-conversation",
        agent: {
          id: "clinic-agent",
          company_id: "clinic-company",
          active: true
        }
      };
    },
    getActiveCustomerRoutingSession: async () =>
      assert.fail("El token embebido debe tener prioridad"),
    getChannelConnectionByPhoneNumberId: async () =>
      assert.fail("El token embebido debe tener prioridad"),
    saveCustomerRoutingSession: async (input) => calls.push(["session", input]),
    createMessage: async (input) => calls.push(["message", input]),
    runAgentCore: async (input) => {
      calls.push(["agentCore", input]);
      return "Respuesta clínica";
    },
    sendWhatsAppTextMessage: async () =>
      assert.fail("La simulación de prueba no debe enviar a Meta")
  });

  const result = await process({
    phoneNumberId: "1412569651936737",
    from: "573000000010",
    type: "text",
    text: `Hola, necesito información [NX:${TOKEN}]`
  }, { sendReply: false });

  assert.equal(result.companyId, "clinic-company");
  assert.equal(calls.find(([name]) => name === "resolve")[1].entryToken, TOKEN);

  const customerMessage = calls
    .filter(([name]) => name === "message")
    .map(([, input]) => input)
    .find(({ senderType }) => senderType === "customer");

  assert.equal(customerMessage.content, "Hola, necesito información");
  assert.equal(customerMessage.content.includes("[NX:"), false);

  const agentInput = calls.find(([name]) => name === "agentCore")[1];
  assert.equal(agentInput.message, "Hola, necesito información");
  assert.equal(agentInput.message.includes("[NX:"), false);
});
