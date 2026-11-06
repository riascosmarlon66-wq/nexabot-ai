import test from "node:test";
import assert from "node:assert/strict";
import { createWhatsAppSimulationController } from "../src/channels/whatsapp/whatsapp-simulation.controller.js";
import { createWhatsAppService } from "../src/channels/whatsapp/whatsapp.service.js";

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    sendStatus(code) {
      this.statusCode = code;
      return this;
    }
  };
}

const requestBody = {
  phoneNumberId: "1412569651936737",
  from: "573123762855",
  message: "Hola, ¿qué hamburguesas tienen?"
};

test("la simulación habilitada devuelve IDs y respuesta sin solicitar envío", async () => {
  let processedMessage;
  let processOptions;
  const controller = createWhatsAppSimulationController(async (message, options) => {
    processedMessage = message;
    processOptions = options;
    return {
      status: "processed",
      companyId: "company-from-connection",
      agentId: "agent-from-connection",
      customerId: "customer-1",
      conversationId: "conversation-1",
      reply: "Tenemos hamburguesas."
    };
  }, {
    nodeEnv: "development",
    whatsappDevMode: true
  });
  const response = createResponse();

  await controller({ body: requestBody }, response);

  assert.equal(response.statusCode, undefined);
  assert.deepEqual(processedMessage, {
    phoneNumberId: requestBody.phoneNumberId,
    from: requestBody.from,
    type: "text",
    text: requestBody.message
  });
  assert.deepEqual(processOptions, { sendReply: false });
  assert.deepEqual(response.body, {
    ok: true,
    mode: "simulation",
    companyId: "company-from-connection",
    agentId: "agent-from-connection",
    customerId: "customer-1",
    conversationId: "conversation-1",
    reply: "Tenemos hamburguesas."
  });
});

test("la simulación devuelve 404 si está deshabilitada o en producción", async () => {
  for (const config of [
    { nodeEnv: "development", whatsappDevMode: false },
    { nodeEnv: "production", whatsappDevMode: true }
  ]) {
    const controller = createWhatsAppSimulationController(
      async () => assert.fail("No debe procesar mensajes con la ruta deshabilitada"),
      config
    );
    const response = createResponse();

    await controller({ body: requestBody }, response);

    assert.equal(response.statusCode, 404);
  }
});

test("phoneNumberId sin conexión devuelve el error de conexión no encontrada", async () => {
  const controller = createWhatsAppSimulationController(
    async () => ({ status: "unconfigured" }),
    { nodeEnv: "development", whatsappDevMode: true }
  );
  const response = createResponse();

  await controller({ body: requestBody }, response);

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    ok: false,
    error: "CHANNEL_CONNECTION_NOT_FOUND"
  });
});

test("la simulación reutiliza resolución de conexión, agente, customer y conversation sin enviar", async () => {
  const calls = [];
  const process = createWhatsAppService({
    getChannelConnectionByPhoneNumberId: async (phoneNumberId) => {
      calls.push(["connection", phoneNumberId]);
      return {
        company_id: "company-from-connection",
        agent_id: "agent-from-connection",
        phone_number_id: phoneNumberId
      };
    },
    getAgentById: async (agentId) => {
      calls.push(["agent", agentId]);
      return {
        id: agentId,
        company_id: "company-from-connection",
        active: true
      };
    },
    findOrCreateWhatsAppCustomer: async (input) => {
      calls.push(["customer", input]);
      return { id: "existing-customer" };
    },
    getOrCreateConversation: async (input) => {
      calls.push(["conversation", input]);
      return { id: "existing-conversation" };
    },
    runAgentCore: async (input) => {
      calls.push(["agentCore", input]);
      return "Respuesta de Agent Core";
    },
    sendWhatsAppTextMessage: async () => {
      calls.push(["send"]);
      assert.fail("La simulación no debe enviar a WhatsApp");
    }
  });
  const message = {
    phoneNumberId: requestBody.phoneNumberId,
    from: requestBody.from,
    type: "text",
    text: requestBody.message
  };

  const firstResult = await process(message, { sendReply: false });
  const secondResult = await process(message, { sendReply: false });

  assert.equal(firstResult.companyId, "company-from-connection");
  assert.equal(firstResult.agentId, "agent-from-connection");
  assert.equal(firstResult.customerId, "existing-customer");
  assert.equal(firstResult.conversationId, "existing-conversation");
  assert.equal(secondResult.customerId, "existing-customer");
  assert.equal(secondResult.conversationId, "existing-conversation");
  assert.equal(calls.filter(([name]) => name === "customer").length, 2);
  assert.equal(calls.filter(([name]) => name === "conversation").length, 2);
  assert.equal(calls.filter(([name]) => name === "agentCore").length, 2);
  assert.equal(calls.some(([name]) => name === "send"), false);
});
