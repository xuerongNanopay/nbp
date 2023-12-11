import { 
  SignInData, SignUpData 
} from '@/type';
import * as Yup from 'yup';

export const SignInDataValidator = Yup.object<SignInData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required')
})

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

export const SignUpDataValidator = Yup.object<SignUpData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
              .min(8, "Password must have at least 8 characters")
              .matches(/[0-9]/, getCharacterValidationError("digit"))
              .matches(/[a-z]/, getCharacterValidationError("lowercase"))
              .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  rePassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password")], "Passwords does not match")
  
})