'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup';
import {
  Input,
  Button
} from "@nextui-org/react";

import { EyeSlashFilledIcon } from "@/app/icons/EyeSlashFilledIcon"
import { EyeFilledIcon } from "@/app/icons/EyeFilledIcon"


const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export default function SignUpForm() {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState(false)
  const initialValues: ISignUp = {email: '', username: '', password: '', rePassword: ''}

  const signUp = (e: ISignUp) => { console.log(e) }
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string().min(8, 'Must between 8 to 24 characters').max(24, 'Must between 8 to 24 characters').required('Required'),
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
    <div className="max-w-sm">
      <h4 className="text-2xl font-bold mb-6">Create An Account</h4>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email" 
          variant="bordered" 
          label="Email"
          color="primary"
          {...formik.getFieldProps('email')}
          errorMessage={formik.touched.email && formik.errors.email}
        />
        <Input
          id="username"
          type="text" 
          variant="bordered" 
          label="Username"
          color="primary"
          {...formik.getFieldProps('username')}
          errorMessage={formik.touched.username && formik.errors.username}
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
          {...formik.getFieldProps('rePassword')}
          errorMessage={formik.touched.rePassword && formik.errors.rePassword}
        />
        <Button 
          type="submit"
          color="primary"
          className="mt-4"
          isDisabled={!(formik.isValid && formik.dirty)}
        >
          Sign Up
        </Button>
      </form>
    </div>
  )
}
