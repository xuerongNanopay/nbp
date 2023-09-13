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
  const resetCodeHandler = () => { alert("TODO: send user new code") }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: emailVerifyFormHandle
  })

  return (
    <div>EmailVerifyForm</div>
  )
}
