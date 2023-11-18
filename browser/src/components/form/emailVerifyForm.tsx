'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button
} from "@nextui-org/react"

export default function EmailVerifyForm() {
  const initialValues: IEmailVerify = {code: ''}

  const emailVerifyFormHandle = (e: IEmailVerify) => { console.log(e) }
  const resendCodeHandler = () => { alert("TODO: send user new code") }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      code: Yup.string()
                .required('Required')
                .matches(/^[0-9]+$/, "wrong format")
                .min(6, "wrong format")
                .max(6, "wrong format")
    }),
    onSubmit: emailVerifyFormHandle
  })

  return (
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-6 text-center">Let&apos;s Verify Your Email</h4>
      <p className="text-base mb-6 text-center">We have sent a verification code to your email. Please enter the code below to confirm that this account belongs to you.</p>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <Input
          id="code"
          type="text" 
          variant="underlined" 
          color="primary"
          size="sm"
          placeholder="Please enter the 6-digit code"
          className="text-center"
          {...formik.getFieldProps('code')}
          errorMessage={formik.touched.code && formik.errors.code}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-2"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
        <Button 
          type="button"
          color="primary"
          size="md"
          variant="light"
          onClick={_ => resendCodeHandler()}
        >
          Recend Code
        </Button>
      </form>
    </div>
  )
}
