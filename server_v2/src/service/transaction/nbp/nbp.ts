import { LOGGER } from "@/utils/logUtil.js"
import { TransactionStatus, TransferStatus } from "@prisma/client"
import {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { PRISMAService } from "@/service/prisma/index.js"
import { TRANSACTION_PROJECT } from "./index.js"
import { NBPService } from "@/service/nbp/index.js"
import { v4 as uuidv4 } from 'uuid'
import dayjs from "dayjs"

export async function nbpProcessor(transactionId: number): Promise<boolean> {
  return await PRISMAService.$transaction(async (tx) => {
    await tx.$queryRaw`select id from transaction where id = ${transactionId} for update`
    const transaction = await tx.transaction.findFirstOrThrow({
      where: {
        id: transactionId
      },
      select: TRANSACTION_PROJECT
    })
    if (!(
      transaction.status == TransactionStatus.PROCESS &&
      !!transaction.transfers && 
      transaction.transfers.length === 2 &&
      transaction.transfers[1]!.name === 'NBP'
    )) {
      LOGGER.warn('Transaction NBP Processor', `Transaction: \`${transaction.id}\` is out of NBP processor scope`)
      return false
    }

    const transfer = transaction.transfers[1]!
    switch (transfer.status) {
      case TransferStatus.INITIAL:
        return await _nbpInitialProcessor(tx, transaction)
      case TransferStatus.COMPLETE:
        return await _nbpCompleteProcessor(tx, transaction)
      case TransferStatus.CANCEL:
      case TransferStatus.FAIL:
        return await _nbpTerminateProcessor(tx, transaction)
      default:
        LOGGER.warn('Transaction NBP Processor', `No status change`, `Transfer: \`${transfer.id}\` is in \`${transfer.status}\``)
        return false
    }
  })
}

async function _nbpInitialProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (transfer.status !== TransferStatus.INITIAL) {
    LOGGER.error(`NBP Initial Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  //TODO: call NBP
  await tx.transfer.update({
    where: {
      id: transfer.id
    },
    data: {
      status: TransferStatus.WAIT,
      waitAt: new Date()
    }
  })

  LOGGER.info(`NBP Complete Processor`, `transaction \`${transaction.id}\``, `Transfer \`${transfer.id}\` Initial Successfully.\``)
  return false
}

async function _nbpCompleteProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (transfer.status !== TransferStatus.COMPLETE) {
    LOGGER.error(`NBP Complete Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  await tx.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      status: TransactionStatus.COMPLETE,
      completedAt: new Date(),
      endInfo: 'Complete Successfully.'
    }
  })
  LOGGER.info(`NBP Complete Processor`, `Transaction \`${transaction.id}\` completed sucessfully.`)
  return false
}

async function _nbpTerminateProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[1]!
  if (
    transfer.status !== TransferStatus.CANCEL &&
    transfer.status !== TransferStatus.FAIL
  ) {
    LOGGER.error(`NBP Terminate Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  const updateTransaction = await tx.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      status: transfer.status === TransferStatus.CANCEL ? TransactionStatus.CANCEL : TransactionStatus.REJECT,
      endInfo: transfer.endInfo,
      terminatedAt: new Date()
    },
    select: {
      id: true,
      status: true
    }
  })
  LOGGER.error(`NBP Terminate Processor`, `Transaction \`${transaction.id}\` terminated in \`${updateTransaction.status}\``)
  return false
}

async function _NBPInitialTransferInitial(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
) {
  const nbpTransfer = transaction.transfers[1]!
  const Global_Id = _globalIdGenerator(nbpTransfer.id)
  await tx.transfer.update({
    where: {
      id: nbpTransfer.id
    },
    data: {
      externalRef: Global_Id
    },
    select: {
      id: true
    }
  })
  const infos = await tx.transaction.findUniqueOrThrow({
    where: {
      id: transaction.id
    },
    select: {
      destinationAmount: true,
      transactionPurpose: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          province: {
            select: {
              name: true
            }
          },
          countryCode: true,
          identification: {
            select: {
              type: true,
              value: true
            }
          }
        }
      },
      destinationContact: {
        select: {
          type: true,
          firstName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          province: {
            select: {
              name: true
            }
          },
          countryCode: true,
          institution: {
            select: {
              abbr: true
            }
          },
          bankAccountNum: true,
          branchNum: true,
          iban: true,
        }
      }
    }
  })

  const Remitter_Name = `${infos.owner.firstName} ${infos.owner.lastName}`
  const Transaction_Date = dayjs().format('YYYY-MM-DD')
  const Amount = infos.destinationAmount/100.0
  NBPService.loadRemittanceAccounts({
    Currency: 'PKR',
    Global_Id: 'TODO',
    Amount,
    Pmt_Mode: 'ACCOUNT_TRANSFERS',
    Transaction_Date,
    Remitter_Name,
    Remitter_Address: 'TODO',
    Remitter_Id_Type: 'DRIVING_LICENSE',
    Remitter_Id: 'DRIVING_LICENSE',
    Beneficiary_Name: 'TODO',
    Beneficiary_Address: 'aa',
    Beneficiary_Contact: 'TODO',
    Beneficiary_Bank: 'NBP',
    Beneficiary_Branch: 'TODO',
    Beneficiary_Account: 'TODO',
    Purpose_Remittance: 'TODO',
    Originating_Country: 'Canada'
  })
}

function _globalIdGenerator(transferId: number, prefix: string = 'PK') {
  const zero16 = '0000000000000000'
  const stringId = `${transferId}`
  return `${prefix}-${zero16.substring(0, 16-stringId.length)}${stringId}`
}