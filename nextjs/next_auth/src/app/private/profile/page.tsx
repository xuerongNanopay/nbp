'use client'
import { signOut } from "next-auth/react"

export default function Root() {
  const signOutHandler = () => {
    signOut({ callbackUrl: '/auth/signIn' })
  }
  return (
    <>
      <div className='min-h-screen grid place-items-center'>
        <div className='flex flex-col items-center'>
          <h1>Private pate</h1>
          
          <button onClick={signOutHandler} className='text-amber-400'>Sign Out</button>
        </div>
      </div>
    </>
  )
}
