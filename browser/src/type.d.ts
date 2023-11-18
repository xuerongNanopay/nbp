interface ISignUp {
  email: string,
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

interface IAccount {
  id: string,
  type: string,
  name: string,
  currency: string
}

interface ITransferQuote {
  sourceAccountId: string,
  destinationAccountId: string,
  sourceAmount: number,
  destinationAmount: number
}

interface ITransferQuoteResult {
  id: string,
  sourceAccount: IAccount,
  destinationAccout: IAccount,
  sourceAmount: number,
  destinationAmount: number,
  sourceCurrency: string,
  destinationCurrency: string,
  exchangeRate: number,
  transactionFee: number,
  totalDebitAmount: number,
  expireTimestamp: long
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

interface ITransaction {
  id: string,
  remiteeName: string,
  remitAccount: string,
  remitMethod: string, //bankAccount or cashPickup
  receiveAmount: string,
  cost: string,
  status: string, //waitingForPayment, sending, complete
  created: date,
  etransferLink: string,
  paymentMethod: string
}

type ITransactionDetail = ITransaction & {}

type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
}

type IContactResult = 
  IContact & (IBankTransfer | ICashPickup) & {
    id: string,
    status: string // Unverified, Verified, pending
  }