import { 
  ChangePassowrdData,
  EmailVerifyData,
  ForgetPasswordData,
  SignInData, 
  SignUpData
} from "@/types/auth"
import type { OnboardingData, EditPasswordData } from "@/types/auth"
import type { ContactData} from "@/types/contact"
import * as Yup from 'yup';
import dayjs from "dayjs"
import { parse, isDate } from "date-fns";
import { ContactType } from "@prisma/client";
import { EditInteracData } from "@/types/account";
import { NotificationReadMarkData } from "@/types/notification";
import { TransactionConfirmData, TransactionQuoteData } from "@/types/transaction";

const eighteen_years_age = dayjs().subtract(18, 'year').format('YYYY-MM-DD')
const hundred_years_age = dayjs().subtract(100, 'year').format('YYYY-MM-DD')

export const SignInDataValidator = Yup.object<SignInData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required')
})

const formatCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

//TODO: uncomment after onboarding success.
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

export const OnboardingDataValidator = Yup.object<OnboardingData>({
  firstName: Yup.string().trim().required('Required'),
  lastName: Yup.string().trim().required('Required'),
  address1: Yup.string().trim().required('Required'),
  city: Yup.string().trim().required('Required'),
  provinceCode: Yup.string().trim().required('Required'),
  countryCode: Yup.string().trim().required('Required'),
  postalCode: Yup.string()
                  .trim()
                  .required('Required')
                  .matches(
                    /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/, 
                    "Invalid Format(eg: S4S 3E8)"
                  ),
  phoneNumber: Yup.string()
                  .required('Required')
                  .matches(
                    /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, 
                    "Invalid Format(eg: 111-111-1111)"
                  ),
  dob: Yup.date()
            .transform((value, originalValue) => {
              const parsedDate = isDate(originalValue)
                ? originalValue
                : parse(originalValue, "yyyy-MM-dd", new Date());
              return parsedDate;
            })
            .typeError('Invalid Format(eg: YYYY-MM-DD)')
            .required('Required')
            .max(eighteen_years_age, "You must be at least 18 years old to register")
            .min(hundred_years_age, "You must be at less 100 years old to register"),
  pob: Yup.string().trim().required('Required'),
  nationality: Yup.string().trim().required('Required'),
  occupationId: Yup.number().integer().required('Required'),
  identityType: Yup.string().trim().required('Required'),
  identityNumber: Yup.string().trim().required('Required'),
  interacEmail: Yup.string().email('Invalid email address').required('Required')
})

export const ContactDataValidator = Yup.object<ContactData>({
  firstName: Yup.string().trim().required('Required'),
  middleName: Yup.string().optional(),
  lastName: Yup.string().trim().required('Required'),
  addressLine1: Yup.string().trim().required('Required'),
  city: Yup.string().trim().required('Required'),
  provinceCode: Yup.string().trim().required('Required'),
  countryCode: Yup.string().trim().required('Required'),
  relationshipId: Yup.number().required('Required'),
  transferMethod: Yup.string().trim().required('Required'),
  phoneNumber: Yup.string().matches(/^[0-9]+$/, "Should only contain digits"),
  institutionId: Yup.number().integer().when(['transferMethod'], {
    is: (transferMethod: string) => transferMethod === ContactType.BANK_ACCOUNT,
    then:() => Yup.number().integer().required('Required')
  }),
  accountOrIban: Yup.string().trim().when(['transferMethod'], {
    is: (transferMethod: string) => transferMethod === ContactType.BANK_ACCOUNT,
    then: () => Yup.string().trim().required('Required')
  })
})

export const ForgetPasswordDataValidator = Yup.object<ForgetPasswordData>({
  email: Yup.string().email('Invalid email address').required('Required'),
})

export const ChangePassowrdDataValidator = Yup.object<ChangePassowrdData>({
  email: Yup.string().email('Invalid email address').required('Required'),
  oneTimeToken: Yup.string().required(),
  newPassword: Yup.string()
              .min(8, "Password must have at least 8 characters")
              .matches(/[0-9]/, formatCharacterValidationError("digit"))
              .matches(/[a-z]/, formatCharacterValidationError("lowercase"))
              .matches(/[A-Z]/, formatCharacterValidationError("uppercase")),
  reNewPassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("newPassword")], "Passwords does not match")
})

export const ChangePasswordParamsValidator = Yup.object<Pick<ChangePassowrdData, 'email' | 'oneTimeToken'>>({
  email: Yup.string().email('Invalid email address').required('Required'),
  oneTimeToken: Yup.string().required(),
})

export const EditPasswordDataValidator = Yup.object<EditPasswordData>({
  originPassword: Yup.string().required('Required'),
  newPassword: Yup.string()
              .min(8, "Password must have at least 8 characters")
              .matches(/[0-9]/, formatCharacterValidationError("digit"))
              .matches(/[a-z]/, formatCharacterValidationError("lowercase"))
              .matches(/[A-Z]/, formatCharacterValidationError("uppercase"))
              .required('Required'),
  reNewPassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("newPassword")], "Passwords does not match")
  
})

export const EditInteracDataValidator = Yup.object<EditInteracData>({
  newEmail: Yup.string().email('Invalid email address').required('Required')
})

export const NotificationReadMarkDataValidator = Yup.object<NotificationReadMarkData>({
  ids: Yup.array().of(Yup.number().integer()).min(1, "At least one notification").required()
})

export const TransactionQuoteDataValidator = Yup.object<TransactionQuoteData>({
  sourceAccountId: Yup.number().required('Required'),
  destinationContactId: Yup.number().required('Required'),
  sourceAmount: Yup.number().required('Required').moreThan(10, 'Amount must be greater than 10.00 CAD').lessThan(1000, 'Amount must be less than 1000.00 CAD'),
})

export const TransactionConfirmDataValidator = Yup.object<TransactionConfirmData>({
  transactionId: Yup.number().required('Required')
})