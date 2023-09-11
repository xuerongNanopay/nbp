'use client'

import { Formik } from "formik"

interface ISignUp {
  email: string,
  username: string,
  password: string
}

export default function SignUpForm() {
  const initialValue: ISignUp = {email: '', username: '', password: ''}
  const signUp = (e: ISignUp) => {}
  return (
    <>
      <Formik
        initialValues={initialValue}
        onSubmit={signUp}
      >

      </Formik>
    </>
  )
}
