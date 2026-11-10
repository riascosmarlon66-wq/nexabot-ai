import test from "node:test";
import assert from "node:assert/strict";
import { createWhatsAppSimulationController } from "../src/channels/whatsapp/whatsapp-simulation.controller.js";
import { createWhatsAppService } from "../src/channels/whatsapp/whatsapp.service.js";
import { createMessageRepository } from "../src/repositories/message.repository.js";
import { createCustomerRoutingSessionRepository } from "../src/repositories/customer-routing-session.repository.js";

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

test("routing session upsert actualiza la fila del mismo teléfono al cambiar de empresa", async () => {
  const rows = [{
    id: "routing-session-1",
    phone_number_id: "TEST",
    customer_phone: "573000000010",
    company_id: "65615fd5-83a6-4bfb-abaf-bfba8784b82c",
    agent_id: "dd799756-7e16-441c-b841-e2c7e26b5f59",
    customer_id: "restaurant-customer",
    conversation_id: "restaurant-conversation",
    active: true
  }];
  const queryCalls = [];
  const client = {
    from(table) {
      queryCalls.push({ table });
      return {
        upsert(values, options) {
          queryCalls.at(-1).values = values;
          queryCalls.at(-1).options = options;
          const index = rows.findIndex((row) =>
            row.phone_number_id === values.phone_number_id &&
            row.customer_phone === values.customer_phone
          );
          if (index >= 0) rows[index] = { ...rows[index], ...values };
          else rows.push({ id: "routing-session-new", ...values });
          queryCalls.at(-1).row = rows[index >= 0 ? index : rows.length - 1];
          return this;
        },
        select(columns) {
          queryCalls.at(-1).columns = columns;
          return this;
        },
        async single() {
          return { data: queryCalls.at(-1).row, error: null };
        }
      };
    }
  };
  const repository = createCustomerRoutingSessionRepository(client);

  const saved = await repository.saveCustomerRoutingSession({
    phoneNumberId: "TEST",
    customerPhone: "573000000010",
    companyId: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
    agentId: "858c4aa1-2fab-4264-8f72-3094b1adc79b",
    customerId: "nexa-customer",
    conversationId: "nexa-conversation"
  });

  assert.equal(rows.length, 1);
  assert.equal(saved.id, "routing-session-1");
  assert.equal(saved.company_id, "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a");
  assert.equal(saved.agent_id, "858c4aa1-2fab-4264-8f72-3094b1adc79b");
  assert.equal(saved.conversation_id, "nexa-conversation");
  assert.notEqual(saved.conversation_id, "restaurant-conversation");
  assert.equal(queryCalls[0].table, "customer_routing_sessions");
  assert.deepEqual(queryCalls[0].options, {
    onConflict: "phone_number_id,customer_phone"
  });
  assert.deepEqual({
    phone_number_id: queryCalls[0].values.phone_number_id,
    customer_phone: queryCalls[0].values.customer_phone,
    company_id: queryCalls[0].values.company_id,
    agent_id: queryCalls[0].values.agent_id,
    conversation_id: queryCalls[0].values.conversation_id,
    active: queryCalls[0].values.active
  }, {
    phone_number_id: "TEST",
    customer_phone: "573000000010",
    company_id: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
    agent_id: "858c4aa1-2fab-4264-8f72-3094b1adc79b",
    conversation_id: "nexa-conversation",
    active: true
  });
  assert.equal(typeof queryCalls[0].values.updated_at, "string");
  assert.match(queryCalls[0].columns, /conversation_id/);
});

test("routing session conserva los campos del error de Supabase", async () => {
  const supabaseError = {
    message: "routing session write failed",
    code: "23505",
    details: "duplicate key",
    hint: "Use the declared conflict target"
  };
  const client = {
    from() {
      return {
        upsert() {
          return this;
        },
        select() {
          return this;
        },
        async single() {
          return { data: null, error: supabaseError };
        }
      };
    }
  };
  const repository = createCustomerRoutingSessionRepository(client);
  const originalConsoleError = console.error;
  const loggedErrors = [];
  console.error = (...args) => loggedErrors.push(args);

  try {
    await assert.rejects(
      repository.saveCustomerRoutingSession({
        phoneNumberId: "TEST",
        customerPhone: "573000000010",
        companyId: "nexa-company",
        agentId: "nexa-agent",
        customerId: "nexa-customer",
        conversationId: "nexa-conversation"
      }),
      (error) =>
        error.message === supabaseError.message &&
        error.code === supabaseError.code &&
        error.details === supabaseError.details &&
        error.hint === supabaseError.hint &&
        error.stage === "routing_session_update"
    );
  } finally {
    console.error = originalConsoleError;
  }

  assert.deepEqual(loggedErrors, [[
    "[ROUTING_SESSION_ERROR]",
    {
      message: "routing session write failed",
      code: "23505",
      details: "duplicate key",
      hint: "Use the declared conflict target",
      stage: "routing_session_update"
    }
  ]]);
});

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

test("la simulación pasa entryToken al router sin modificarlo ni exponerlo en la respuesta", async () => {
  let processedMessage;
  let processedOptions;
  const controller = createWhatsAppSimulationController(async (message, options) => {
    processedMessage = message;
    processedOptions = options;
    return {
      status: "processed",
      companyId: "nexa-company",
      agentId: "nexa-agent",
      customerId: "nexa-customer",
      conversationId: "nexa-conversation",
      reply: "Hola"
    };
  }, {
    nodeEnv: "development",
    whatsappDevMode: true
  });
  const response = createResponse();

  await controller({
    body: { ...requestBody, phoneNumberId: "TEST", entryToken: "VALID_NEXA_TOKEN" }
  }, response);

  assert.equal(processedMessage.phoneNumberId, "TEST");
  assert.deepEqual(processedOptions, {
    sendReply: false,
    entryToken: "VALID_NEXA_TOKEN"
  });
  assert.equal(response.body.companyId, "nexa-company");
  assert.equal(response.body.agentId, "nexa-agent");
  assert.equal(JSON.stringify(response.body).includes("VALID_NEXA_TOKEN"), false);
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
    getActiveCustomerRoutingSession: async () => null,
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
    createMessage: async (input) => calls.push(["message", input]),
    runAgentCore: async (input) => {
      calls.push(["agentCore", input]);
      return "Respuesta de Agent Core";
    },
    sendWhatsAppTextMessage: async () => {
      calls.push(["send"]);
      assert.fail("La simulación no debe enviar a WhatsApp");
    }
  });

  test("entryToken prioriza BusinessRouter sobre sesión y conexión antiguas y actualiza la sesión", async () => {
    const routingSession = {
      phone_number_id: "TEST",
      customer_phone: "573000000010",
      company_id: "65615fd5-83a6-4bfb-abaf-bfba8784b82c",
      agent_id: "dd799756-7e16-441c-b841-e2c7e26b5f59",
      customer_id: "restaurant-customer",
      conversation_id: "restaurant-conversation",
      active: true
    };
    const receivedContexts = [];
    const savedMessages = [];
    let routingSessionLookups = 0;
    const process = createWhatsAppService({
      getChannelConnectionByPhoneNumberId: async () =>
        assert.fail("La conexión antigua no debe sobrescribir el token o sesión"),
      resolveBusinessContext: async (input) => {
        receivedContexts.push(input);
        return {
          companyId: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
          agentId: "858c4aa1-2fab-4264-8f72-3094b1adc79b",
          customerId: "nexa-customer",
          conversationId: "nexa-conversation",
          agent: {
            id: "858c4aa1-2fab-4264-8f72-3094b1adc79b",
            company_id: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
            active: true
          }
        };
      },
      getActiveCustomerRoutingSession: async () => {
        routingSessionLookups += 1;
        return { ...routingSession };
      },
      saveCustomerRoutingSession: async (session) => {
        Object.assign(routingSession, {
          phone_number_id: session.phoneNumberId,
          customer_phone: session.customerPhone,
          company_id: session.companyId,
          agent_id: session.agentId,
          customer_id: session.customerId,
          conversation_id: session.conversationId
        });
      },
      getAgentById: async (agentId) => ({
        id: agentId,
        company_id: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
        active: true
      }),
      findOrCreateWhatsAppCustomer: async () =>
        assert.fail("BusinessRouter o la sesión ya resolvieron el customer"),
      getOrCreateConversation: async () =>
        assert.fail("BusinessRouter o la sesión ya resolvieron la conversación"),
      createMessage: async (row) => savedMessages.push(row),
      runAgentCore: async () => "Respuesta Nexa",
      sendWhatsAppTextMessage: async () =>
        assert.fail("La simulación no debe enviar a WhatsApp")
    });
    const request = {
      phoneNumberId: "TEST",
      from: "573000000010",
      type: "text",
      text: "Hola"
    };

    const tokenResult = await process(request, {
      sendReply: false,
      entryToken: "VALID_NEXA_TOKEN"
    });

    assert.deepEqual(receivedContexts, [{
      phoneNumberId: "TEST",
      customerPhone: "573000000010",
      entryToken: "VALID_NEXA_TOKEN"
    }]);
    assert.deepEqual(tokenResult, {
      status: "processed",
      companyId: "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a",
      agentId: "858c4aa1-2fab-4264-8f72-3094b1adc79b",
      customerId: "nexa-customer",
      conversationId: "nexa-conversation",
      reply: "Respuesta Nexa"
    });
    assert.equal(routingSession.company_id, "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a");
    assert.equal(routingSession.agent_id, "858c4aa1-2fab-4264-8f72-3094b1adc79b");
    assert.equal(routingSession.customer_id, "nexa-customer");
    assert.equal(routingSession.conversation_id, "nexa-conversation");
    assert.notEqual(routingSession.conversation_id, "restaurant-conversation");
    assert.equal(routingSessionLookups, 0);

    const sessionResult = await process({
      ...request,
      text: "Cuéntame más"
    }, { sendReply: false });

    assert.equal(sessionResult.companyId, "a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a");
    assert.equal(sessionResult.agentId, "858c4aa1-2fab-4264-8f72-3094b1adc79b");
    assert.equal(sessionResult.customerId, "nexa-customer");
    assert.equal(sessionResult.conversationId, "nexa-conversation");
    assert.equal(routingSessionLookups, 1);
    assert.equal(receivedContexts.length, 1);
    assert.deepEqual(savedMessages.map(({ companyId, conversationId }) => [
      companyId,
      conversationId
    ]), [
      ["a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a", "nexa-conversation"],
      ["a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a", "nexa-conversation"],
      ["a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a", "nexa-conversation"],
      ["a54757c6-ae32-4ffe-bd6d-2966ae8e0f7a", "nexa-conversation"]
    ]);
  });

  test("el simulador ejecuta el repository real y guarda customer antes de agent", async () => {
    const persistedRows = [];
    const messageRepository = createMessageRepository({
      from(table) {
        assert.equal(table, "messages");
        return {
          insert(row) {
            persistedRows.push(row);
            return this;
          },
          select() {
            return this;
          },
          async single() {
            return { data: { id: `message-${persistedRows.length}`, ...persistedRows.at(-1) }, error: null };
          }
        };
      }
    });
    const process = createWhatsAppService({
      getActiveCustomerRoutingSession: async () => null,
      getChannelConnectionByPhoneNumberId: async (phoneNumberId) => ({
        company_id: "company-1",
        agent_id: "agent-1",
        phone_number_id: phoneNumberId
      }),
      getAgentById: async () => ({
        id: "agent-1",
        company_id: "company-1",
        active: true
      }),
      findOrCreateWhatsAppCustomer: async () => ({ id: "customer-1" }),
      getOrCreateConversation: async () => ({ id: "conversation-1" }),
      createMessage: messageRepository.createMessage,
      runAgentCore: async ({ conversationId, currentMessagePersisted }) => {
        assert.equal(conversationId, "conversation-1");
        assert.equal(currentMessagePersisted, true);
        assert.deepEqual(persistedRows.map(({ sender_type: senderType }) => senderType), ["customer"]);
        return "Hola Marlon";
      },
      sendWhatsAppTextMessage: async () => assert.fail("La simulación no envía a Meta")
    });

    const result = await process({
      phoneNumberId: requestBody.phoneNumberId,
      from: requestBody.from,
      type: "text",
      text: "Hola, me llamo Marlon"
    }, { sendReply: false });

    assert.equal(result.status, "processed");
    assert.deepEqual(persistedRows, [
      {
        company_id: "company-1",
        conversation_id: "conversation-1",
        sender_type: "customer",
        content: "Hola, me llamo Marlon",
        channel: "whatsapp"
      },
      {
        company_id: "company-1",
        conversation_id: "conversation-1",
        sender_type: "agent",
        content: "Hola Marlon",
        channel: "whatsapp"
      }
    ]);
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
  assert.deepEqual(calls
    .filter(([name]) => name === "message")
    .map(([, saved]) => [saved.senderType, saved.content, saved.channel]), [
    ["customer", requestBody.message, "whatsapp"],
    ["agent", "Respuesta de Agent Core", "whatsapp"],
    ["customer", requestBody.message, "whatsapp"],
    ["agent", "Respuesta de Agent Core", "whatsapp"]
  ]);
  assert.equal(calls.filter(([name]) => name === "agentCore")
    .every(([, input]) =>
      input.conversationId === "existing-conversation" &&
      input.currentMessagePersisted === true
    ), true);
});
