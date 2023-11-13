'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function SignIn() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const formSignInAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    signIn('credentials', {email, password})
  }

  return (
    <>
      <div className="grid place-items-center">
        <div>SignIn</div>
        <form onSubmit={formSignInAction}>
          <input type="text" id="email" name="email" value={email} onChange={(e) => {setEmail(e.target.value)}}></input>
          <input type="passowrd" id="password" name="password" value={password} onChange={(e) => {setEmail(e.target.value)}}></input>
        </form>
      </div>
    </>
  )
}
