import { Session } from '@/types/auth'
import { createContext, useContext } from 'react'

const SessionContext = createContext<Session|null>(null)

export function SessionProvider({
  children,
  session
}: {
  children: React.ReactNode,
  session: Session
}): React.JSX.Element {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {return useContext(SessionContext)} 