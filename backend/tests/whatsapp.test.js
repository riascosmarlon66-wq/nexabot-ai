import test from "node:test";
import assert from "node:assert/strict";
import {
  createWhatsAppController
} from "../src/channels/whatsapp/whatsapp.controller.js";
import {
  createWhatsAppSender,
  createWhatsAppService,
  extractWhatsAppTextMessage
} from "../src/channels/whatsapp/whatsapp.service.js";

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
    sendStatus(code) {
      this.statusCode = code;
      return this;
    }
  };
}

function textWebhook({
  phoneNumberId = "123456789",
  messageId = "wamid.incoming",
  from = "987654321",
  type = "text",
  body = "Hola"
} = {}) {
  return {
    entry: [{
      changes: [{
        value: {
          metadata: { phone_number_id: phoneNumberId },
          messages: [{
            id: messageId,
            from,
            type,
            ...(type === "text" ? { text: { body } } : {})
          }]
        }
      }]
    }]
  };
}

test("GET webhook devuelve el challenge para verify token válido", () => {
  const controller = createWhatsAppController(undefined, "verify-secret-test");
  const response = createResponse();

  controller.verifyWebhook({
    query: {
      "hub.mode": "subscribe",
      "hub.verify_token": "verify-secret-test",
      "hub.challenge": "challenge-value"
    }
  }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, "challenge-value");
});

test("GET webhook rechaza verify token inválido", () => {
  const controller = createWhatsAppController(undefined, "verify-secret-test");
  const response = createResponse();

  controller.verifyWebhook({
    query: {
      "hub.mode": "subscribe",
      "hub.verify_token": "wrong-token",
      "hub.challenge": "challenge-value"
    }
  }, response);

  assert.equal(response.statusCode, 403);
});

test("POST webhook acepta payload sin entry y no procesa eventos", () => {
  let processed = false;
  const controller = createWhatsAppController(() => {
    processed = true;
  });
  const response = createResponse();

  controller.receiveWebhook({ body: {} }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(processed, false);
});

test("POST webhook acepta payload sin messages y no procesa eventos", () => {
  const payload = {
    entry: [{
      changes: [{
        value: { metadata: { phone_number_id: "123456789" }, messages: [] }
      }]
    }]
  };
  let processed = false;
  const controller = createWhatsAppController(() => {
    processed = true;
  });
  const response = createResponse();

  controller.receiveWebhook({ body: payload }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(processed, false);
  assert.equal(extractWhatsAppTextMessage(payload), null);
});

test("POST webhook ignora mensajes que no sean de texto", () => {
  let processed = false;
  const controller = createWhatsAppController(() => {
    processed = true;
  });
  const response = createResponse();

  controller.receiveWebhook({ body: textWebhook({ type: "image" }) }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(processed, false);
});

test("phone_number_id desconocido no crea customer/conversation ni llama al agente", async () => {
  const process = createWhatsAppService({
    getChannelConnectionByPhoneNumberId: async () => null,
    getAgentById: async () => assert.fail("No debe buscar agente"),
    findOrCreateWhatsAppCustomer: async () => assert.fail("No debe crear customer"),
    getOrCreateConversation: async () => assert.fail("No debe crear conversation"),
    runAgentCore: async () => assert.fail("No debe ejecutar Agent Core"),
    sendWhatsAppTextMessage: async () => assert.fail("No debe enviar mensaje")
  });

  assert.deepEqual(await process(extractWhatsAppTextMessage(textWebhook())), {
    status: "unconfigured"
  });
});

test("agente de otra empresa no se procesa", async () => {
  const process = createWhatsAppService({
    getChannelConnectionByPhoneNumberId: async () => ({
      company_id: "company-1",
      agent_id: "agent-1",
      phone_number_id: "123456789"
    }),
    getAgentById: async () => ({
      id: "agent-1",
      company_id: "company-2",
      active: true
    }),
    findOrCreateWhatsAppCustomer: async () => assert.fail("No debe crear customer"),
    getOrCreateConversation: async () => assert.fail("No debe crear conversation"),
    runAgentCore: async () => assert.fail("No debe ejecutar Agent Core"),
    sendWhatsAppTextMessage: async () => assert.fail("No debe enviar mensaje")
  });

  assert.deepEqual(await process(extractWhatsAppTextMessage(textWebhook())), {
    status: "invalid-agent"
  });
});

test("conexión válida resuelve empresa, agente, customer y conversation", async () => {
  const calls = [];
  const process = createWhatsAppService({
    getChannelConnectionByPhoneNumberId: async (phoneNumberId) => {
      calls.push(["connection", phoneNumberId]);
      return {
        id: "connection-1",
        company_id: "company-1",
        agent_id: "agent-1",
        phone_number_id: phoneNumberId
      };
    },
    getAgentById: async (agentId) => {
      calls.push(["agent", agentId]);
      return { id: agentId, company_id: "company-1", active: true };
    },
    findOrCreateWhatsAppCustomer: async (input) => {
      calls.push(["customer", input]);
      return { id: "customer-1" };
    },
    getOrCreateConversation: async (input) => {
      calls.push(["conversation", input]);
      return { id: "conversation-1" };
    },
    runAgentCore: async (input) => {
      calls.push(["agentCore", input]);
      return "Respuesta";
    },
    sendWhatsAppTextMessage: async (input) => calls.push(["send", input])
  });

  const message = extractWhatsAppTextMessage(textWebhook());
  assert.deepEqual(await process(message), {
    status: "processed",
    companyId: "company-1",
    agentId: "agent-1",
    customerId: "customer-1",
    conversationId: "conversation-1",
    reply: "Respuesta"
  });
  assert.deepEqual(calls.map(([name]) => name), [
    "connection", "agent", "customer", "conversation", "agentCore", "send"
  ]);
  assert.deepEqual(calls.find(([name]) => name === "customer")[1], {
    companyId: "company-1",
    waId: "987654321"
  });
  assert.deepEqual(calls.find(([name]) => name === "conversation")[1], {
    companyId: "company-1",
    agentId: "agent-1",
    customerId: "customer-1",
    channel: "whatsapp"
  });
  assert.deepEqual(calls.find(([name]) => name === "agentCore")[1], {
    companyId: "company-1",
    agentId: "agent-1",
    message: "Hola",
    customerId: "customer-1",
    conversationId: "conversation-1",
    agent: { id: "agent-1", company_id: "company-1", active: true }
  });
  assert.deepEqual(calls.find(([name]) => name === "send")[1], {
    phoneNumberId: "123456789",
    to: "987654321",
    text: "Respuesta"
  });
});

test("sender construye la petición Graph API y valida la respuesta", async () => {
  let requestUrl;
  let requestOptions;
  const sender = createWhatsAppSender({
    config: {
      whatsappToken: "test-token",
      whatsappApiVersion: "v25.0"
    },
    fetchImpl: async (url, options) => {
      requestUrl = url;
      requestOptions = options;
      return {
        ok: true,
        json: async () => ({ messages: [{ id: "wamid.outgoing" }] })
      };
    }
  });

  const result = await sender({
    phoneNumberId: "123456789",
    to: "987654321",
    text: "Respuesta"
  });

  assert.equal(
    requestUrl,
    "https://graph.facebook.com/v25.0/123456789/messages"
  );
  assert.equal(requestOptions.headers.Authorization, "Bearer test-token");
  assert.deepEqual(JSON.parse(requestOptions.body), {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "987654321",
    type: "text",
    text: { body: "Respuesta" }
  });
  assert.deepEqual(result, { messages: [{ id: "wamid.outgoing" }] });
});
