import type { JWT } from "@/utils/jwtUtil"
export interface SignInData {
  email: string
  password: string
}

//TODO: use Pcik to filter out sensitive infos.
export interface Session extends JWT {
  login: Pick<Login, 'id' | 'email' | 'status'>,
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'status' | 'role'> | null
}

export interface SignUpData {
  email: string,
  password: string,
  rePassword: string,
}

export interface EmailVerifyData {
  code: string
}

export interface ForgetPasswordData {
  email: string
}
export interface OnboardingData {
  firstName: string,
  middleName?: string,
  lastName: string,
  address1: string,
  address2?: string,
  city: string,
  province: string,
  country: string,
  postalCode: string,
  phoneNumber: string,
  dob: string,
  pob: string,
  nationality: string,
  occupationId: number,
  identityType: string,
  identityNumber: string
  interacEmail: string
}

export interface ForgetPasswordData {
  email: string
}

export interface ChangePassowrdData {
  email: string,
  oneTimeToken: string
  newPassword: string,
  reNewPassword: string
}

export interface UpdatePasswordData {
  originPassword: string
  newPassword: string,
  reNewPassword: string
}