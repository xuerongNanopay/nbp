import { 
  EmailVerifyData,
  SignInData, 
  SignUpData 
} from '@/type';
import * as Yup from 'yup';

export const SignInDataValidator = Yup.object<SignInData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required')
})

const formatCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export const SignUpDataValidator = Yup.object<SignUpData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
              .min(8, "Password must have at least 8 characters")
              .matches(/[0-9]/, formatCharacterValidationError("digit"))
              .matches(/[a-z]/, formatCharacterValidationError("lowercase"))
              .matches(/[A-Z]/, formatCharacterValidationError("uppercase")),
  rePassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password")], "Passwords does not match")
  
})

export const EmailVerifyDataValidator = Yup.object<EmailVerifyData>({
  code: Yup.string()
            .required('Required')
            .matches(/^[0-9]+$/, "wrong format")
            .min(6, "wrong format")
            .max(6, "wrong format")
})