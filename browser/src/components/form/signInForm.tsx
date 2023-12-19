'use client'
import type { SignInData } from "@/types/auth"
import { useState } from "react"
import { useFormik } from "formik"
import { useRouter } from 'next/navigation'
import { SignInDataValidator } from "@/schema/validator"
import {
  Input,
  Button,
  Link
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/icons/EyeFilledIcon"
import { useAlert } from "@/hook/useAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"

export default function SignInForm({forgetPWLink}: {forgetPWLink?: string}) {
  const alert = useAlert() ?? CONSOLE_ALERT
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState(false)
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false)
  const initialValues: SignInData = {email: '', password: ''}

  const signIn = async (e: SignInData) => {
    try {
      setIsSubmit(true)
      const response = await fetch('/api/nbp/auth/sign_in', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(e),
      })
      const responsePayload = await response.json()
      if (responsePayload.code === 200) {
        alert.info("Sign in success")
        router.replace('/nbp/dashboard')
      } else {
        alert.error(responsePayload.message)
        setIsSubmit(false)
      }
    } catch (err: any) {
      alert.error(JSON.stringify(err))
      console.error(err)
      setIsSubmit(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: SignInDataValidator,
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
          autoComplete="on"
          {...formik.getFieldProps('email')}
          errorMessage={formik.touched.email && formik.errors.email}
        />
        <Input
          id="password"
          label="Password"
          variant="bordered"
          color="primary"
          size="sm"
          autoComplete="on"
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
          isLoading={isSubmit}
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