'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button
} from "@nextui-org/react"

export default function ContactForm() {
  const initialValues: IContact & (ICashPickup | IBankTransfer) = {
    firstName: '',
    middleName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    contry: '',
    postalCode: '',
    relationship: '',
    phoneNumber: '',
    transferMethod: '',
    bankName: '',
    branchNo: '',
    accountNumber: ''
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({

      
    }),
    onSubmit: (e) => {}
  })
  return (
    <div>ContactForm</div>
  )
}
