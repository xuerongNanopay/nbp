'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup';
import {
  Input,
  Button,
  Link
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/icons/EyeFilledIcon"

export default function SignInForm({forgetPWLink}: {forgetPWLink?: string}) {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false)
  const initialValues: ISignIn = {email: '', password: ''}

  const signIn = async (e: ISignIn) => { 
    console.log(e)
    const resp = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(e),
    })
    console.log(await resp.json())
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: signIn
  })

  return (
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-6 text-center">Welcome Back</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email" 
          variant="bordered" 
          label="Email"
          color="primary"
          size="sm"
          {...formik.getFieldProps('email')}
          errorMessage={formik.touched.email && formik.errors.email}
        />
        <Input
          id="password"
          label="Password"
          variant="bordered"
          color="primary"
          size="sm"
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsPasswordVisible(pre => !pre)}>
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordVisible ? "text" : "password"}
          {...formik.getFieldProps('password')}
          errorMessage={formik.touched.password && formik.errors.password}
        />
        { !!forgetPWLink && <div className="flex justify-end"><Link href={forgetPWLink} className="text-gray-600">foget password?</Link></div>}
        <Button 
          type="submit"
          color="primary"
          className={`${!forgetPWLink ? 'mt-4': ''}`}
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Sign In
        </Button>
      </form>
    </div>
  )
}