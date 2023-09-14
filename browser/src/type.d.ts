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
  addressLine1: string,
  addressLine2?: string,
  city: string,
  province: string,
  country: string,
  postalCode: string,
  phoneNumber: string,
  dob: string,
  pob: string,
  nationality: string,
  occupation: string,
  identityType: string,
  identityNumber: string
  etransfer: string
}

interface ITransfer {

}

interface ITransferQuote {

}

interface IContact {
  firstName: string,
  middleName?: string,
  lastName: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  province: string,
  country: string,
  postalCode?: string,
  relationship: string,
  phoneNumber?: string,
}

interface ICashPickup {
  transferMethod: string    //Cash Pickup
}

interface IBankTransfer {
  transferMethod: string,  //Bank Account
  bankName: string,
  branchNo?: string,
  accountOrIban: string
}
