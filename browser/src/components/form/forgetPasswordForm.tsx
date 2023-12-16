'use client'

import { useFormik } from "formik"
import {
  Input,
  Button
} from "@nextui-org/react";
import { ForgetPasswordData } from "@/types/auth";
import { ForgetPasswordDataValidator } from "@/schema/validator";
import { useState } from "react";

export default function ForgetPasswrodForm() {
  const [isSubmit, setIsSubmit] = useState(false)
  const initialValues: ForgetPasswordData = {email: ''}

  const forgetPasswordHandle = async (e: ForgetPasswordData) => { 
    setIsSubmit(false)
    try {
      const response = await fetch('/api/nbp/auth/forget_password',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(e)
      })
      const responsePayload = await response.json()
      
      if (responsePayload.code === 200 ) {
        alert("Please check your email")
      } else {
        //TODO: redirect to dashboard. if message is duplicate user.
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
    validationSchema: ForgetPasswordDataValidator,
    onSubmit: forgetPasswordHandle
  })

  return (
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-6 text-center">Forget Password?</h4>
      <p className="text-base mb-6 text-center">Enter the email you used to create your account in order to reset your password.</p>
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
        <Button 
          type="submit"
          isLoading={isSubmit}
          color="primary"
          className="mt-2"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Submit
        </Button>
      </form>
    </div>
  )
}
