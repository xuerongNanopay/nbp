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
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      address1: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      province: Yup.string().required('Required'),
      contry: Yup.string().required('Required'),
      relationship: Yup.string().required('Required'),
      transferMethod: Yup.string().required('Required'),
      // @ts-ignore
      bankName: Yup.string().when(['transferMethod'], {
        is: (transferMethod: string) => transferMethod === 'Bank Account',
        then: Yup.string().required('Required')
      }),
      // @ts-ignore
      accountNumber: Yup.string().when(['transferMethod'], {
        is: 'Bank Account',
        then: Yup.string().required('Required')
      })
    }),
    onSubmit: (e) => {}
  })

  return (
    <div>ContactForm</div>
  )
}
