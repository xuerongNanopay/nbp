import { LOG_LEVEL } from '@/constants/env';
import { Session } from '@/types/auth';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import winston, { addColors } from 'winston'
const { combine, timestamp, printf, colorize, align, label } = winston.format

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

addColors({
  fatal: 'bold inverse red',
  error: 'bold red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'rainbow',
  trace: 'white',
})

const wistonLogger = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({
      level: 'trace',
      format: combine(
        label({
          label:'[LOGGER]'
        }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf((info) => {
          return `[${info.timestamp}] [${info.level.toUpperCase().padEnd(5)}]: ${info.message}`
        }),
        colorize({
          all: true,
        })
      )
    })
  ]
})

class Logger {
  #logger
  constructor(logger: any) {
    this.#logger = logger
  }

  info(...args: any[]) {
    this.#log('info', ...args)
  }

  error(...args: any[]) {
    this.#log('error', ...args)
  }

  warn(...args: any[]) {
    this.#log('warn', ...args)
  }

  debug(...args: any[]) {
    this.#log('debug', ...args)
  }

  trace(...args: any[]) {
    this.#log('trace', ...args)
  }

  fatal(...args: any[]) {
    this.#log('fatal', ...args)
  }
  
  #log(level: string, ...args: any[]) {
    const logMsg = args.map((cur) => {
      // if (cur instanceof PrismaClientKnownRequestError ) return `\n--name: ${cur.name}, \n\n--message: ${cur.message}${!!cur.code ? ', \n\n--code: ' + cur.code : ''}${!!cur.cause ? ', \n\n--cause: ' + cur.cause : ''}${!!cur.stack ? ', \n\n--stack: ' + cur.stack : ''}`
      if (cur instanceof Error ) return `\n--name: ${cur.name}, \n\n--message: ${cur.message}${!!cur.cause ? ', \n\n--cause: ' + cur.cause : ''}${!!cur.stack ? ', \n\n--stack: ' + cur.stack : ''}`
      if (cur instanceof Object) return JSON.stringify(cur)
      if (cur instanceof Array) return cur.toString ? cur.toString() : JSON.stringify(cur)
      return cur
    }).join(', ')

    // args.
    this.#logger.log(level, logMsg)
  }
}

export const LOGGER = new Logger(wistonLogger)

export function formatSession(session: Session | null): string {
  if (!session) return "loginId: EMPTY, userId: EMPTY"
  return `loginId: ${!session.login ? 'EMPTY' : session.login.id}, userId: ${!session.user ? 'EMPTY' : session.user.id}`
}