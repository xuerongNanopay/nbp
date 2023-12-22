'use client'
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { useFormik } from "formik"
import {
  Input,
  Button
} from "@nextui-org/react";

import { useAlert } from "@/hook/useAlert"
import { CONSOLE_ALERT } from "@/utils/alertUtil"
import { EditInteracData } from '@/types/account';
import { EditInteracDataValidator } from '@/schema/validator';


export default function EditInteracForm() {
  const alert = useAlert() ?? CONSOLE_ALERT
  const router = useRouter()
  const [ isSubmit, setIsSubmit ] = useState(false)
  const initialValues: EditInteracData = {newEmail: ''}

  const editInteracEmail = async (e: EditInteracData) => {
    setIsSubmit(true)
    try {
      const response = await fetch('/api/nbp/user/profile/edit_interac_email',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(e)
      })
      const responsePayload = await response.json()
      if (responsePayload.code >> 7 === 1 ) {
        alert.info(responsePayload.message)
        router.replace('/nbp/profile')
      } else {
        alert.error(responsePayload.message)
        setIsSubmit(false)
      }
    } catch (err) {
      alert.error(JSON.stringify(err))
      setIsSubmit(false)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: EditInteracDataValidator,
    onSubmit: editInteracEmail
  })

  return (
    <div className="w-full mt-8 sm:mt-16">
      <h4 className="text-2xl font-bold mb-2 text-center">Please Enter New Interac Email</h4>
      <h6 className="text-center mb-4">Please make sure that email auto.....</h6>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          id="newEmail"
          //TODO: Using this going to cause the input render twice. Find a good way to resolve.
          type="text"
          variant="underlined" 
          label="New Email"
          color="primary"
          size="sm"
          autoComplete="off"
          {...formik.getFieldProps('newEmail')}
          errorMessage={formik.touched.newEmail && formik.errors.newEmail}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-4"
          size="md"
          isLoading={isSubmit}
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Change
        </Button>
      </form>
    </div>
  )
}
