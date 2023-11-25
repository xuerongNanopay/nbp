import { createContext, useContext } from 'react'

const UserContext = createContext<number|null>(null)

export function UserProvider({
  children,
  value
}: {
  children: React.ReactNode,
  value: number
}): React.JSX.Element {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const getUser = () => {return useContext(UserContext)} 