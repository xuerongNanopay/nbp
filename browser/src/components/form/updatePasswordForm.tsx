'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup';
import {
  Input,
  Button
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/icons/EyeFilledIcon"


const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export default function UpdatePasswordForm() {
  const [ isOriginPasswordVisible, setIsOriginPasswordVisible ] = useState(false)
  const [ isNewPasswordVisible, setIsNewPasswordVisible ] = useState(false)
  const [ isReNewPasswordVisible, setIsReNewPasswordVisible ] = useState(false)
  const initialValues: ForgetPassword = {originPassword: '', newPassword: '', reNewPassword: ''}

  const submitNewPassword = (e: ForgetPassword) => { console.log(e) }
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      originPassword: Yup.string().required('Required'),
      newPassword: Yup.string()
                  .min(8, "Password must have at least 8 characters")
                  .matches(/[0-9]/, getCharacterValidationError("digit"))
                  .matches(/[a-z]/, getCharacterValidationError("lowercase"))
                  .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
      reNewPassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("newPassword")], "Passwords does not match")
      
    }),
    onSubmit: submitNewPassword
  })

  return (
    // Investigating Found 2 elements with non-unique id
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-2 text-center">Update your password</h4>
      <h6 className="text-center mb-4">Create a new password for your account</h6>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          key="originPassword"
          id="originPassword"
          type={isOriginPasswordVisible ? "text" : "password"}
          variant="bordered" 
          label="Origin Password"
          color="primary"
          size="sm"
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
          key="newPassword"
          id="newPassword"
          label="New Password"
          variant="bordered"
          color="primary"
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
          key="reNewPassword"
          id="reNewPassword"
          label="Re-New Password"
          variant="bordered"
          color="primary"
          size="sm"
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
