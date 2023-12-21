import { Login, User } from "@prisma/client"
import { JWT } from "./utils/jwtUtil"

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

interface ITransfer {

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