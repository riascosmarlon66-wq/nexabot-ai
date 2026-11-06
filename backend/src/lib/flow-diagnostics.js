function safeMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]")
    .replace(/(authorization|token|secret|api[_-]?key)(\s*[:=]\s*)[^\s,;]+/gi, "$1$2[REDACTED]");
}

function errorSummary(error) {
  if (!error) return undefined;
  const summary = {
    name: typeof error.name === "string" ? error.name : "Error",
    message: safeMessage(error)
  };
  if (error.status !== undefined) summary.status = error.status;
  if (error.statusCode !== undefined) summary.statusCode = error.statusCode;
  return summary;
}

export function logFlowError(prefix, stage, error) {
  console.error(prefix, {
    ...errorSummary(error),
    ...(error?.cause ? { cause: errorSummary(error.cause) } : {}),
    stage
  });
}
