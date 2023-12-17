'use client'

import { useRouter } from 'next/navigation'
import { useState } from "react"
import { useFormik } from "formik"
import {
  Input,
  Button
} from "@nextui-org/react"

import { EmailVerifyData } from '@/types/auth'
import { EmailVerifyDataValidator } from "@/schema/validator"
import { useAlert } from "@/hook/useAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"

export default function EmailVerifyForm() {
  const alert = useAlert() ?? CONSOLE_ALERT
  const router = useRouter()
  const [isSubmit, setIsSubmit] = useState(false)
  const initialValues: EmailVerifyData = {code: ''}

  const emailVerifyFormHandle = async (e: EmailVerifyData) => { 
    try {
      setIsSubmit(true)
      const response = await fetch('/api/nbp/auth/verify_email',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(e)
      })
      const responsePayload = await response.json()

      if (responsePayload.code === 200) {
        alert.info("Email Verified Success")
        router.replace('/nbp/onboarding')
      } else {
        alert.error(responsePayload.message)
        setIsSubmit(false)
      }

    } catch (err: any) {
      alert.error(JSON.stringify(err))
      setIsSubmit(false)
    }
  }

  const resendCodeHandler = async () => { 
    try {
      setIsSubmit(true)
      const response = await fetch('/api/nbp/auth/refresh_code')
      const responsePayload = await response.json()

      if (responsePayload.code === 200) {
        alert('Please check your email: ' + responsePayload.data.email)
        setIsSubmit(false)
      } else {
        alert(responsePayload)
        setIsSubmit(false)
      }

    } catch (err: any) {
      alert(err)
      setIsSubmit(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: EmailVerifyDataValidator,
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
          isLoading={isSubmit}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
        <Button 
          type="button"
          color="primary"
          size="md"
          isLoading={isSubmit}
          variant="light"
          onClick={_ => resendCodeHandler()}
        >
          Recend Code
        </Button>
      </form>
    </div>
  )
}
