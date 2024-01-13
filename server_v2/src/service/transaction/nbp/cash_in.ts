import { LOGGER } from "@/utils/logUtil.js"
import { CashInMethod, CashInStatus } from "@prisma/client"
import type {PrismaTransaction} from "./index.d.js"


//This function should not throw any Error.
export async function scotialRTPCashIn(
  tx: PrismaTransaction, 
  transactionId: number
) {
    const transaction = await tx.transaction.findUniqueOrThrow({
      where: {
        id: transactionId
      },
      select: {
        id: true,
        debitAmount: true,
        sourceAccountId: true,
        sourceAccount: {
          select: {
            email: true
          }
        },
        ownerId: true,
        owner: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })
    let cashIn
    try {
      const requestPaymentResult = await ScotiaRTPService.requestForPayment({
        transactionId: transaction.id,
        create_date_time: new Date(),
        amount: transaction.debitAmount/100.0,
        debtor_email: transaction.sourceAccount.email,
        debtor_name: `${transaction.owner.firstName} ${transaction.owner.lastName}`
      })
      if (!!requestPaymentResult.data) {
        LOGGER.info('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial success with payment_id: \`${requestPaymentResult.data.payment_id}\``)
        const requestPaymentStatusResult = await ScotiaRTPService.requestForPaymentStatus({paymentId: requestPaymentResult.data.payment_id!, transactionId: transaction.id})
        if (
          !!requestPaymentStatusResult.data && 
          requestPaymentStatusResult.data.length > 0
        ) {
          cashIn = await tx.cashIn.create({
            data: {
              status: CashInStatus.WAIT,
              method: CashInMethod.INTERAC,
              ownerId: Number(transaction.ownerId),
              transactionId: Number(transaction.id),
              paymentLink: requestPaymentStatusResult.data[0]?.gateway_url ?? null,
              externalRef: requestPaymentResult.data.payment_id,
              externalRef1: requestPaymentResult.data.clearing_system_reference,
              paymentAccountId: Number(transaction.sourceAccountId),
            }
          })
          return cashIn
        } else {
          let endInfo
          if ( !!requestPaymentStatusResult.notifications && requestPaymentStatusResult.notifications.length>0 ) {
            endInfo = `code: \`${requestPaymentStatusResult.notifications[0]?.code}\`, message: \`${requestPaymentStatusResult.notifications[0]?.message}\``
          }
          LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, endInfo)
        }
      } else {
        let endInfo
        if ( !!requestPaymentResult.notifications && requestPaymentResult.notifications.length>0 ) {
          endInfo = `code: \`${requestPaymentResult.notifications[0]?.code}\`, message: \`${requestPaymentResult.notifications[0]?.message}\``
        }
        LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, endInfo)

      }
    } catch(err) {
      LOGGER.error('_scotialRTPCashIn', `Transaction \`${transaction.id}\` Scotial RTP CashIn initial failed.`, err)
    }
    cashIn = await tx.cashIn.create({
      data: {
        status: CashInStatus.Cancel,
        method: CashInMethod.INTERAC,
        ownerId: Number(transaction.ownerId),
        transactionId: Number(transaction.id),
        endInfo: 'Scotia Payment initial fails',
        paymentAccountId: Number(transaction.sourceAccountId),
      }
    })
    return cashIn
}