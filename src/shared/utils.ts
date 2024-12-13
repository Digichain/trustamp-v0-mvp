export class SchemaValidationError extends Error {
  constructor(
    message: string,
    public errors: any[],
    public document: any
  ) {
    super(message);
    this.name = "SchemaValidationError";
  }
}