export abstract class NBPError implements Error {
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

  toString(): string {
    return JSON.stringify({
      code: this.code,
      name: this.name,
      message: this.message,
      errors: this.errors
    })
  }
}

export class BadRequestError extends NBPError {
  constructor({name, message, errors}: {name: string, message: string, errors?: string[] | null | undefined}) {
    super({
      code: 400,
      name: name ?? 'InvalidInput',
      message,
      errors
    })
  }
}
export class InvalidInputError extends BadRequestError {
  constructor(message: string, ...args:any) {
    super({
      name: 'InvalidInput',
      message,
      errors: args[0]
    })
  }
}


export class ResourceNoFoundError extends NBPError {
  constructor(message: string) {
    super({
      code: 404,
      name: 'ResourceNoFound',
      message
    })
  }
}

export class UnauthenticateError extends NBPError {
  constructor(message: string) {
    super({
      code: 401,
      name: 'Unauthorized',
      message
    })
  }
}

export class ForbiddenError extends NBPError {
  constructor(message: string) {
    super({
      code: 403,
      name: 'Unauthorized',
      message
    })
  }
}

export class InternalError extends NBPError {

  constructor(...args:any) {
    super({
      code: 500,
      name: 'Internal Server Error',
      message: args[0] ?? 'Please try later again'
    })
  }
}