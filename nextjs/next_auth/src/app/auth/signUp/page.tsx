'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"

import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const router = useRouter()

  const formSignInAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const signInResponse = await signIn('credentials', {email, password, redirect: false})
    console.log(signInResponse)
    if ( ! signInResponse ) {
      alert('Has problem during Sign In')
    } else if ( ! signInResponse.ok ) {
      alert('Invalid credential')
      setEmail('')
      setPassword('')
    } else {
      router.replace('/private/profile')
    }
  }

  return (
    <>
      <div className="min-h-screen grid place-items-center">
        <div className='flex flex-col items-center'>
          <div>New User Form</div>
          <form className="flex flex-col" onSubmit={formSignInAction}>
            email: 
            <input 
              className='border-2 border-amber-800 rounded' 
              type="text" 
              id="email" 
              name="email" 
              value={email} 
              onChange={(e) => {setEmail(e.target.value)}}
            />
            password: 
            <input
              className='border-2 border-amber-800 rounded'
              type="passowrd" 
              id="password" 
              name="password" 
              value={password} 
              onChange={(e) => {setPassword(e.target.value)}}
            />
            <button>Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}
