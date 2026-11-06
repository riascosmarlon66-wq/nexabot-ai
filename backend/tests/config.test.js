import test from "node:test";
import assert from "node:assert/strict";
import { env, parseBooleanEnv } from "../src/config/env.js";

test("WHATSAPP_DEV_MODE se interpreta como booleano y por defecto queda deshabilitado", () => {
  assert.equal(parseBooleanEnv("true"), true);
  assert.equal(parseBooleanEnv("false"), false);
  assert.equal(parseBooleanEnv(undefined), false);
  assert.equal(typeof env.whatsappDevMode, "boolean");
});
