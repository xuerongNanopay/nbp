'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import {
  Input,
  Button
} from "@nextui-org/react"

export default function ContactForm() {
  type NewContact = IContact & ICashPickup & IBankTransfer
  const initialValues: NewContact = {
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

  const createContactHandler = (e: NewContact) => { console.log(e) }

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
    onSubmit: createContactHandler
  })

  return (
    <div className="w-full max-w-4xl">
      <h4 className="text-2xl font-bold mb-6 text-center">Create a Contact</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            id="firstName"
            type="text" 
            variant="bordered" 
            label="FirstName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('firstName')}
            errorMessage={formik.touched.firstName && formik.errors.firstName}
          />
          <Input
            id="middleName"
            type="text" 
            variant="bordered" 
            label="MiddleName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('middleName')}
            errorMessage={formik.touched.middleName && formik.errors.middleName}
          />
                    <Input
            id="lastName"
            type="text" 
            variant="bordered" 
            label="LastName"
            color="primary"
            size="sm"
            {...formik.getFieldProps('lastName')}
            errorMessage={formik.touched.lastName && formik.errors.lastName}
          />
        </div>
        <Button 
          type="submit"
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
