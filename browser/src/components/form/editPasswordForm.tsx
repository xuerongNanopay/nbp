'use client'

import { useState } from "react"
import { useFormik } from "formik"
import {
  Input,
  Button
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/icons/EyeFilledIcon"
import { EditPasswordData } from "@/types/auth";
import { UpdatePasswordDataValidator } from "@/schema/validator";


export default function EditPasswordForm() {
  const [ isOriginPasswordVisible, setIsOriginPasswordVisible ] = useState(false)
  const [ isNewPasswordVisible, setIsNewPasswordVisible ] = useState(false)
  const [ isReNewPasswordVisible, setIsReNewPasswordVisible ] = useState(false)
  const initialValues: EditPasswordData = {originPassword: '', newPassword: '', reNewPassword: ''}

  const submitNewPassword = (e: EditPasswordData) => { console.log(e) }
  const formik = useFormik({
    initialValues,
    validationSchema: UpdatePasswordDataValidator,
    onSubmit: submitNewPassword
  })

  return (
    <div className="w-full">
      <h4 className="text-2xl font-bold mb-2 text-center">Update your password</h4>
      <h6 className="text-center mb-4">Create a new password for your account</h6>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          id="originPassword"
          //TODO: Using this going to cause the input render twice. Find a good way to resolve.
          type={isOriginPasswordVisible ? "text" : "password"}
          variant="bordered" 
          label="Origin Password"
          color="primary"
          size="sm"
          autoComplete="off"
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsOriginPasswordVisible(pre => !pre)}>
              {isOriginPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          {...formik.getFieldProps('originPassword')}
          errorMessage={formik.touched.originPassword && formik.errors.originPassword}
        />
        <Input
          id="newPassword"
          label="New Password"
          variant="bordered"
          color="primary"
          autoComplete="off"
          type={isNewPasswordVisible ? "text" : "password"}
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsNewPasswordVisible(pre => !pre)}>
              {isNewPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          size="sm"
          {...formik.getFieldProps('newPassword')}
          errorMessage={formik.touched.newPassword && formik.errors.newPassword}
        />
        <Input
          id="reNewPassword"
          label="Re-New Password"
          variant="bordered"
          color="primary"
          size="sm"
          autoComplete="off"
          type={isReNewPasswordVisible ? "text" : "password"}
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsReNewPasswordVisible(pre => !pre)}>
              {isReNewPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          {...formik.getFieldProps('reNewPassword')}
          errorMessage={formik.touched.reNewPassword && formik.errors.reNewPassword}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-4"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Change Password
        </Button>
      </form>
    </div>
  )
}
