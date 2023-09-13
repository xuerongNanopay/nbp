interface ISignUp {
  email: string,
  username: string,
  password: string,
  rePassword: string,
}

interface ISignIn {
  email: string
  password: string
}

interface IEmailVerify {
  code: string
}

interface IForgetPassword {
  email: string
}

interface IUserOnboarding {
  firstName: string,
  middleName?: string,
  lastName: string,
  address1: string,
  address2: string,
  city: string,
  province: string,
  contry: string,
  postalCode: string,
  dob: string
}

interface ITransfer {

}

interface ITransferQuote {

}

interface IContact {
}