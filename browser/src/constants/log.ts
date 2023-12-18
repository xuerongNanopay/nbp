import { Session } from "@/types/auth";

export enum LogLevel {
  WARMING = 'WARMING',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export function formatSession(session: Session | null): string {
  if (!session) return "Session: EMPTY"
  return `Session: {login: ${!session.login ? 'EMPTY' : session.login.id}, user: ${!session.user ? 'EMPTY' : session.user.id}}`
}