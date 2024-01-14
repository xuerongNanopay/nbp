import { LOGGER } from "@/utils/logUtil.js"
import { ContactType, IdentificationType, TransactionStatus, TransferStatus } from "@prisma/client"
import {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { PRISMAService } from "@/service/prisma/index.js"
import { TRANSACTION_PROJECT, isTransferFinish, processTransaction } from "./index.js"
import { NBPService } from "@/service/nbp/index.js"
import dayjs from "dayjs"
import type { 
  LoadRemittanceAccountsRequest, 
  LoadRemittanceCashRequest, 
  LoadRemittanceRequest, 
  LoadRemittanceResult, 
  LoadRemittanceThirdPartyRequest,
  TransactionStatusByIdsResult,
  TransactionStatusResult
} from "@/partner/nbp/index.d.js"
import { APIError } from "@/schema/error.js"

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
  return _NBPTransferInitial(tx, transaction)
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

async function _NBPTransferInitial(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const nbpTransfer = transaction.transfers[1]!
  const Global_Id = nbpTransfer.externalRef ?? _globalIdGenerator(nbpTransfer.id)
  if (!nbpTransfer.externalRef) {
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
  }
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
          postalCode: true,
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
          postalCode: true,
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
          relationship: {
            select: {
              type: true
            }
          }
        }
      }
    }
  })
  const remitter = infos.owner
  const beneficiary = infos.destinationContact
  const Remitter_Name = `${remitter.firstName} ${remitter.lastName}`
  const Transaction_Date = dayjs().format('YYYY-MM-DD')
  const Amount = infos.destinationAmount/100.0
  const Remitter_Address = _buildAddressSummary({
    address1: remitter.address1,
    address2: remitter.address2,
    city: remitter.city,
    province: remitter.province.name,
    countryCode: remitter.countryCode,
    postCode: remitter.postalCode
  })
  const Remitter_Id_Type = _idTypeMapper(remitter.identification!.type) as LoadRemittanceRequest['Remitter_Id_Type']
  const Remitter_Id = remitter.identification!.value
  const Beneficiary_Name = `${beneficiary.firstName} ${beneficiary.lastName}`
  const Beneficiary_Address = _buildAddressSummary({
    address1: beneficiary.address1,
    address2: beneficiary.address2,
    city: beneficiary.city,
    province: beneficiary.province.name,
    countryCode: beneficiary.countryCode,
    postCode: beneficiary.postalCode 
  })
  const Purpose_Remittance = infos.transactionPurpose!

  const temp = {
    Currency: 'PKR' as LoadRemittanceRequest['Currency'],
    Global_Id,
    Amount,
    Transaction_Date,
    Remitter_Name,
    Remitter_Address,
    Remitter_Id_Type,
    Remitter_Id,
    Beneficiary_Name,
    Beneficiary_Address,
    Purpose_Remittance,
    Originating_Country: 'Canada',
  }

  try {
    let result: LoadRemittanceResult
    if (beneficiary.type === ContactType.CASH_PICKUP) {
      const request: LoadRemittanceCashRequest = {
        ...temp,
        Pmt_Mode: 'CASH',
        Beneficiary_Bank: 'NBP'
      }
      result = await NBPService.loadRemittanceCash(request)
    } else {
      if (beneficiary.institution!.abbr === 'NBP') {
        const request: LoadRemittanceAccountsRequest = {
          ...temp,
          Pmt_Mode: 'ACCOUNT_TRANSFERS',
          Beneficiary_Bank: 'NBP',
          Beneficiary_Account: beneficiary.iban ?? beneficiary.bankAccountNum!
        }
        result = await NBPService.loadRemittanceAccounts(request)
      } else {
        const request: LoadRemittanceThirdPartyRequest = {
          ...temp,
          Pmt_Mode: 'THIRD_PARTY_PAYMENTS',
          Beneficiary_Bank: beneficiary.institution!.abbr,
          Beneficiary_Account: beneficiary.iban ?? beneficiary.bankAccountNum!
        }
        result = await NBPService.loadRemittanceThirdParty(request)
      }
    }
    LOGGER.info('func: _NBPInitialTransferInitial', `Transaction \`${transaction.id}\` initialed NBP transfer successfully.`)
    await tx.transfer.update({
      where: {
        id: nbpTransfer.id
      },
      data: {
        status: TransferStatus.WAIT,
        waitAt: new Date()
      }
    })
    return false
  } catch(err: any) {
    let endInfo: string
    if (err instanceof APIError) {
      endInfo = err.response?.ResponseMessage ?? "NPB Initial Failed"
      LOGGER.error('func: _NBPInitialTransferInitial', `Transaction \`${transaction.id}\` failed to initialNBP transfer.`, `code: \`${err.response?.ResponseCode}\` message: \`${err.response?.ResponseMessage}\``)
    } else {
      endInfo = err.message ?? "NPB Initial Failed"
      LOGGER.error('func: _NBPInitialTransferInitial', `Transaction \`${transaction.id}\` failed to initialNBP transfer.`, err)
    }
    await tx.transfer.update({
      where: {
        id: nbpTransfer.id
      },
      data: {
        status: TransferStatus.FAIL,
        failAt: new Date(),
        endInfo: endInfo
      }
    })
  }
  return true
}

//TODO: refine.
function _buildAddressSummary({
  address1,
  address2,
  city,
  province,
  postCode,
  countryCode
}: {
  address1: string | null | undefined
  address2: string | null | undefined
  city: string | null | undefined
  province: string | null | undefined
  postCode: string | null | undefined
  countryCode: string | null | undefined
}) {
  let ret = ''
  ret = !address1 ? ret : `${ret}${address1}, `
  ret = !address2 ? ret : `${ret}${address2}, `
  ret = !city ? ret : `${ret}${city}, `
  ret = !province ? ret : `${ret}${province}, `
  ret = !postCode ? ret : `${ret}${postCode}, `
  ret = !countryCode ? ret : `${ret}${countryCode}, `
  ret = !postCode ? ret : `${ret}${postCode}`

  return ret
}

export async function finalizeNBPTransfers(newStatuses: (TransactionStatusResult&{transferId: number})[]) {

  for (const t of newStatuses) {
    try {
      const newNBPTransfer = await PRISMAService.$transaction(async (tx) => {
        await tx.$queryRaw`select id from cash_in where id = ${t.transferId} for update`
        const nbpTransfer = await tx.transfer.findUniqueOrThrow({
          where: {
            id: t.transferId
          },
          select: {
            id: true,
            externalRef: true,
            status: true,
            transactionId: true
          }
        })
        if (nbpTransfer.status !== TransferStatus.WAIT) {
          LOGGER.warn('func: finalizeNBPTransfers', `NBPTransfer \`${t.transferId}\` expect to be \`${TransferStatus.WAIT}\`, but \`${nbpTransfer.status}\``,)
          return
        }
        const newStatus = _nbpTransferStatusMapper(nbpTransfer.status, nbpTransfer.transactionId)
        if (newStatus === TransferStatus.WAIT) return 
        if (
          newStatus === TransferStatus.CANCEL ||
          newStatus === TransferStatus.FAIL
        ) {
          const newTransfer = await tx.transfer.update({
            where: {
              id: nbpTransfer.id
            },
            data: {
              status: newStatus,
              cancelAt: newStatus === TransferStatus.CANCEL ? new Date() : null,
              failAt: newStatus === TransferStatus.FAIL ? new Date() : null,
              endInfo: newStatus === TransferStatus.CANCEL ? 'NBP Transfer canceled' : 'NBP Transfer failed'
            },
            select: {
              id: true,
              status: true,
              transactionId: true
            }
          })
          LOGGER.error('func: finalizeNBPTransfers', `NBPTransfer \`${t.transferId}\ change from \`${nbpTransfer.status}\` to \`${newTransfer.status}\`` )
          return newTransfer
        } else if (newStatus === TransferStatus.COMPLETE) {
          const newTransfer = await tx.transfer.update({
            where: {
              id: nbpTransfer.id
            },
            data: {
              status: newStatus,
              completeAt: new Date(),
              endInfo: 'NBP Transfer successed.'
            },
            select: {
              id: true,
              status: true,
              transactionId: true
            }
          })
          LOGGER.info('func: finalizeNBPTransfers', `NBPTransfer \`${t.transferId}\ change from \`${nbpTransfer.status}\` to \`${newTransfer.status}\`` )
          return newTransfer
        } else {
          LOGGER.warn('func: finalizeNBPTransfers', `NBPTransfer \`${t.transferId}\` reach to unkown state.`)
        }
      })
      if (!!newNBPTransfer && isTransferFinish(newNBPTransfer.status)) await processTransaction(newNBPTransfer.id)
    } catch (err) {
      LOGGER.error('func: finalizeNBPTransfers', `NBPTransfer \`${t.transferId}\``, err)
    }
  }
}

function _globalIdGenerator(transferId: number, prefix: string = 'PK') {
  const zero16 = '0000000000000000'
  const stringId = `${transferId}`
  return `${prefix}-${zero16.substring(0, 16-stringId.length)}${stringId}`
}

function _idTypeMapper(idType: IdentificationType) {
  switch(idType) {
    case IdentificationType.DRIVER_LICENSE:
      return 'DRIVING_LICENSE'
    case IdentificationType.PASSPORT:
      return 'PASSPORT_NO'
    default:
      return 'OTHER'
  }
}

function _nbpTransferStatusMapper(nbpStatus: string, transactionId: number): TransferStatus {
  switch(nbpStatus) {
    case 'PENDGIN':
    case 'IN_PROCESS':
      return TransferStatus.WAIT
    case 'CANCELLED':
      return TransferStatus.CANCEL
    case 'REJECTED':
    case 'ERROR':
      return TransferStatus.FAIL
    case 'PAID':
      return TransferStatus.COMPLETE
    default:
      LOGGER.error('func: _nbpTransferStatusMapper', `Transaction \`${transactionId}\` failed mapping IDM status`, `Unsupport NBP status \`${nbpStatus}\``)
      throw new Error(`Unsupport NBP status \`${nbpStatus}\``)
  }
}