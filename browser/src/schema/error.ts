class InvalidInputError extends Error {
  errors: string[]
  
  constructor(message: string, errors: string[]) {
    super(message);
    this.errors = errors ?? []
    this.name = "InvalidInput";
  }
}

class ResourceNoFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceNoFound";
  }
}

class UnauthenticateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Unauthenticate";
  }
}

class AuthenticateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Authenticate";
  }
}

class PrismaError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message);
    this.code = code
    this.name = "Prisma";
  }
}