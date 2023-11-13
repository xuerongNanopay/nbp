'use client'
import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <>
      <h1 className=''>MAIN</h1>
      <button onClick={() => signIn('credentials', { redirect: false, password: 'password', email:'xxx@gmail.com' })}>Sign In</button>
    </>
  )
}
