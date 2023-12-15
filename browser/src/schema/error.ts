abstract class NBPError implements Error {
  code: number
  name: string
  message: string
  errors?: string[] | null | undefined

  constructor({code, name, message, errors}: {code: number, name: string, message: string, errors?: string[] | null | undefined}) {
    this.code = code
    this.name = name
    this.message = message
    if ( !! errors ) this.errors = errors
  }
}

class BadRequestError extends NBPError {
  constructor({name, message, errors}: {name: string, message: string, errors?: string[] | null | undefined}) {
    super({
      code: 400,
      name: 'InvalidInput',
      message,
      errors
    })
  }
}
class InvalidInputError extends BadRequestError {
  constructor(message: string, ...args:any) {
    super({
      name: 'InvalidInput',
      message,
      errors: args[0]
    })
  }
}


class ResourceNoFoundError extends NBPError {
  constructor(message: string) {
    super({
      code: 404,
      name: 'ResourceNoFound',
      message
    })
  }
}

class UnauthenticateError extends NBPError {
  constructor(message: string) {
    super({
      code: 401,
      name: 'Unauthorized',
      message
    })
  }
}

class ForbiddenError extends NBPError {
  constructor(message: string) {
    super({
      code: 403,
      name: 'Unauthorized',
      message
    })
  }
}

class InternalError extends NBPError {

  constructor(message: string) {
    super({
      code: 500,
      name: 'Internal Server Error',
      message
    })
  }
}