import { Session } from "@/types/auth";
import { 
  TransactionConfirmData, 
  TransactionQuoteDate 
} from "@/types/transaction";
import { TransactionStatus } from "@prisma/client";

async function quoteTransaction(
  session: Session, 
  transactionQuoteDate: TransactionQuoteDate) 
{
  //Ensure both user and login are active.
  //Ensure both account and contact are active.
  //Ensure not exceed the daily limit.
  //Create transaction.
}

async function confirmTransaction(session: Session, transactionConfirm: TransactionConfirmData) {
  //Ensure the transaction still valid
  //Mark Transaction to Initial. and send to transaction process server.
}

async function getTransactionsByOwnerId(
  session: Session,
  options?: {
    from?: Number,
    size?: Number,
    statuses?: TransactionStatus[]
  }
) {

}

async function countTransactions(
  session: Session,
  options?: {
    statuses?: TransactionStatus[]
  }
) {

}

async function getTransactionDetailByOwnerId(
  session: Session, 
  transactionId: number
) {

}