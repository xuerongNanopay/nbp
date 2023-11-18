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

export default function SignUpForm() {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false)
  const initialValues: ISignUp = {email: '', password: '', rePassword: ''}

  const signUp = (e: ISignUp) => { console.log(e) }
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
                  .min(8, "Password must have at least 8 characters")
                  .matches(/[0-9]/, getCharacterValidationError("digit"))
                  .matches(/[a-z]/, getCharacterValidationError("lowercase"))
                  .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
      rePassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password")], "Passwords does not match")
      
    }),
    onSubmit: signUp
  })

  return (
    <div className="w-full max-w-sm">
      <h4 className="text-2xl font-bold mb-6 text-center">Create An Account</h4>
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
        <Input
          id="password"
          label="Password"
          variant="bordered"
          color="primary"
          endContent={
            <button className="focus:outline-none" type="button" onClick={() =>setIsPasswordVisible(pre => !pre)}>
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          size="sm"
          type={isPasswordVisible ? "text" : "password"}
          {...formik.getFieldProps('password')}
          errorMessage={formik.touched.password && formik.errors.password}
        />
        <Input
          id="rePassword"
          label="Re-Password"
          variant="bordered"
          type="password"
          color="primary"
          size="sm"
          {...formik.getFieldProps('rePassword')}
          errorMessage={formik.touched.rePassword && formik.errors.rePassword}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-4"
          size="md"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Sign Up
        </Button>
      </form>
    </div>
  )
}
