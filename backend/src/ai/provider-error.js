export class AIProviderError extends Error {
  constructor(code, message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "AIProviderError";
    this.code = code;
    if (options.status !== undefined) this.status = options.status;
    if (options.statusCode !== undefined) this.statusCode = options.statusCode;
  }
}
