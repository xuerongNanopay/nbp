'use client'

import { useFormik } from "formik"
import * as Yup from 'yup';
import {
  Input
} from "@nextui-org/react";

interface ISignUp {
  email: string,
  username: string,
  password: string,
  rePassword: string,
}

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export default function SignUpForm() {
  const initialValues: ISignUp = {email: '', username: '', password: '', rePassword: ''}

  const signUp = (e: ISignUp) => {}

  const formik = useFormik({
    initialValues,
    validationSchema: {
      email: Yup.string().email('Invalid email address').required('Required'),
      username: Yup.string().min(8, 'Must between 8 to 24 characters').max(24, 'Must between 8 to 24 characters').required('Required'),
      password: Yup.string()
                  .min(8, "Password must have at least 8 characters")
                  .matches(/[0-9]/, getCharacterValidationError("digit"))
                  .matches(/[a-z]/, getCharacterValidationError("lowercase"))
                  .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
      rePassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password")], "Passwords does not match")
    },
    onSubmit: values => { console.log(values) }
  })

  return (
    <div className="max-w-sm">
      <h4 className="text-2xl font-bold mb-4">Create An Account</h4>
      <form onSubmit={formik.handleSubmit}>
        <Input type="email" variant="bordered" color="primary" label="Email" />
      </form>
    </div>
  )
}
