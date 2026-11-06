import test from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
const { app } = await import("../src/server.js");

test("la aplicación backend inicializa sus rutas sin abrir un listener en tests", () => {
  assert.equal(typeof app, "function");
});
