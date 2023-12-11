class InvalidInputError extends Error {
  errors: string[]
  
  constructor(message: string, errors: string[]) {
    super(message);
    this.errors = errors ?? []
    this.name = "InvalidInput";
  }
}