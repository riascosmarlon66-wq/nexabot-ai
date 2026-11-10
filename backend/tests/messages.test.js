import test from "node:test";
import assert from "node:assert/strict";
import { createMessageRepository } from "../src/repositories/message.repository.js";

class SupabaseQueryMock {
  constructor(rows) {
    this.rows = rows;
    this.filters = [];
    this.operations = [];
    this.inserted = undefined;
  }

  insert(value) {
    this.inserted = value;
    this.operations.push(["insert", value]);
    return this;
  }

  select(value) {
    this.operations.push(["select", value]);
    return this;
  }

  eq(column, value) {
    this.filters.push([column, value]);
    return this;
  }

  order(column, options) {
    this.operations.push(["order", column, options]);
    return this;
  }

  limit(value) {
    this.operations.push(["limit", value]);
    this.limitValue = value;
    return this;
  }

  async single() {
    return {
      data: { id: "message-id", ...this.inserted, created_at: "2026-01-01T00:00:00Z" },
      error: null
    };
  }

  then(resolve, reject) {
    try {
      const [orderOperation] = this.operations.filter(([name]) => name === "order");
      let result = this.rows.filter((row) =>
        this.filters.every(([column, value]) => row[column] === value)
      );
      if (orderOperation?.[2]?.ascending === false) {
        result = result.sort((left, right) =>
          right.created_at.localeCompare(left.created_at)
        );
      }
      result = result.slice(0, this.limitValue);
      return Promise.resolve({ data: result, error: null }).then(resolve, reject);
    } catch (error) {
      return Promise.reject(error).then(resolve, reject);
    }
  }
}

function createClient(rows = []) {
  const queries = [];
  return {
    queries,
    from(table) {
      assert.equal(table, "messages");
      const query = new SupabaseQueryMock(rows);
      queries.push(query);
      return query;
    }
  };
}

test("createMessage persiste mensajes customer y agent con tenant y canal", async () => {
  const client = createClient();
  const repository = createMessageRepository(client);
  for (const senderType of ["customer", "agent"]) {
    const saved = await repository.createMessage({
      companyId: "company-1",
      conversationId: "conversation-1",
      senderType,
      content: senderType === "customer" ? "Hola" : "Bienvenido",
      channel: "whatsapp"
    });

    assert.equal(saved.company_id, "company-1");
    assert.equal(saved.conversation_id, "conversation-1");
    assert.equal(saved.sender_type, senderType);
    assert.equal(saved.channel, "whatsapp");
  }
  assert.equal(client.queries.length, 2);
});

test("getRecentMessages aísla ambas claves, limita a 10 y devuelve orden cronológico", async () => {
  const rows = [
    { company_id: "company-1", conversation_id: "conversation-1", sender_type: "customer", content: "1", created_at: "2026-01-01T00:01:00Z" },
    { company_id: "company-1", conversation_id: "conversation-1", sender_type: "agent", content: "2", created_at: "2026-01-01T00:02:00Z" },
    { company_id: "company-2", conversation_id: "conversation-1", sender_type: "customer", content: "tenant ajeno", created_at: "2026-01-01T00:03:00Z" },
    ...Array.from({ length: 11 }, (_, index) => ({
      company_id: "company-1",
      conversation_id: "conversation-1",
      sender_type: index % 2 ? "agent" : "customer",
      content: String(index + 3),
      created_at: new Date(Date.UTC(2026, 0, 1, 0, index + 4)).toISOString()
    }))
  ];
  const client = createClient(rows);
  const repository = createMessageRepository(client);

  const recent = await repository.getRecentMessages({
    companyId: "company-1",
    conversationId: "conversation-1",
    limit: 99
  });

  assert.equal(recent.length, 10);
  assert.equal(recent.some(({ content }) => content === "tenant ajeno"), false);
  assert.deepEqual(client.queries[0].filters, [
    ["company_id", "company-1"],
    ["conversation_id", "conversation-1"]
  ]);
  assert.equal(client.queries[0].limitValue, 10);
  assert.deepEqual(recent.map(({ created_at: createdAt }) => createdAt), [
    ...recent.map(({ created_at: createdAt }) => createdAt)
  ].sort());
});

test("fallo al crear message se registra como error de repository no de IA", async () => {
  const client = {
    from() {
      return {
        insert() { return this; },
        select() { return this; },
        async single() {
          return { data: null, error: new Error("database insert failed") };
        }
      };
    }
  };
  const repository = createMessageRepository(client);
  await assert.rejects(
    repository.createMessage({
      companyId: "company-1",
      conversationId: "conversation-1",
      senderType: "customer",
      content: "private message text",
      channel: "web"
    }),
    (error) => error.code === "MESSAGE_REPOSITORY_ERROR" &&
      error.name === "MessagePersistenceError"
  );
});
