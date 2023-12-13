import { Login, User } from "@prisma/client"
import { JWT } from "./utils/jwtUtil"

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

type Menu = {
  id: string,
  name: string,
  href: string,
  handler?: () => void
}

type Menus = Menu[]

type LoginUser = {
  session: string,
  user: string
}

type NBPTransactionSummary = {
  id: string,
  sendName: string,
  receiveName: String
  created: Date, // Or Date type
  status: string, //awaitPayment, success, process, failed, refundInProgress, cancel
  nbpReference: string,
  sendAmount: string,
  receiveAmount: string,
  summary: string,
}

type NBPTransactionDetail = NBPTransactionSummary & {
  etransferUrl: string,
  fxRate: string,
  fee: string
  receiveAccountSummary: string
  sendAccountSummary: string
}

type NBPContactSummary = {
  id: string,
  firstName: string,
  lastName: string,
  created: date,
  status: 'suspend' | 'verified' | 'pending' 
  type: 'cashPickUp' | 'bankAccount'
  accountSummary: string
}

type NBPContactDetail = NBPContactSummary & {
  relationshipToOwner: string,
  address: string,
  bankName: string,
  accountNumberOrIban: string,
  phoneNumber: string
}

type ForgetPassword = {
  originPassword: string,
  newPassword: string,
  reNewPassword: string
}

type NotificationSummary = {
  id: string
  subject: string
  description: string
  status: 'read' | 'unread',
  created: Date
}

type NotificationDetail = NotificationSummary & {
  from?: string
  content?: string
}