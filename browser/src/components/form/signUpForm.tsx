'use client'
import { useRouter } from 'next/navigation'
import type { SignUpData } from "@/types/auth";
import { useState } from "react"
import { useFormik } from "formik"
import { SignUpDataValidator } from "@/schema/validator";
import {
  Input,
  Button
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/icons/EyeFilledIcon"
import { useAlert } from "@/hook/useAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"

export default function SignUpForm() {
  const alert = useAlert() ?? CONSOLE_ALERT
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState(false)
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false)
  const initialValues: SignUpData = {email: '', password: '', rePassword: ''}

  const signUp = async (e: SignUpData) => { 
    try {
      setIsSubmit(true)
      const response = await fetch('/api/nbp/auth/sign_up',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(e)
      })
      const responsePayload = await response.json()

      if (responsePayload.code === 201) {
        router.replace('/nbp/verify_email')
      } else {
        alert(responsePayload)
        setIsSubmit(false)
      }

    } catch (err) {
      alert(err)
      setIsSubmit(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: SignUpDataValidator,
    onSubmit: signUp
  })

  return (
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-6 text-center">Create An Account</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email" 
          variant="bordered" 
          label="Email"
          color="primary"
          size="sm"
          autoComplete="off"
          {...formik.getFieldProps('email')}
          errorMessage={formik.touched.email && formik.errors.email}
        />
        <Input
          id="password"
          label="Password"
          variant="bordered"
          color="primary"
          autoComplete="off"
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsPasswordVisible(pre => !pre)}>
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          size="sm"
          type={isPasswordVisible ? "text" : "password"}
          {...formik.getFieldProps('password')}
          errorMessage={formik.touched.password && formik.errors.password}
        />
        <Input
          id="rePassword"
          label="Re-Password"
          variant="bordered"
          type="password"
          color="primary"
          size="sm"
          autoComplete="off"
          {...formik.getFieldProps('rePassword')}
          errorMessage={formik.touched.rePassword && formik.errors.rePassword}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-4"
          size="md"
          isLoading={isSubmit}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Sign Up
        </Button>
      </form>
    </div>
  )
}
