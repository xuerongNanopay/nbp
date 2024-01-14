import { PRISMAService } from "@/service/prisma/index.js"
import {PrismaTransaction, TRANSACTION_PROJET_TYPE} from "./index.d.js"
import { TRANSACTION_PROJECT } from "./index.js"
import { ContactType, IdentificationType, TransactionStatus, TransferStatus } from "@prisma/client"
import { LOGGER } from "@/utils/logUtil.js"
import type { TransferReqeust } from "@/partner/idm/index.d.js"
import sha1 from 'sha1'
import { IDMService } from "@/service/idm/index.js"

export async function idmProcessor(transactionId: number): Promise<boolean> {
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
      transaction.transfers.length === 1 &&
      transaction.transfers[0]!.name === 'IDM'
    )) {
      LOGGER.warn('Transaction IDM Processor', `Transaction: \`${transaction.id}\` is out of IDM processor scope`)
      return false
    }

    const transfer = transaction.transfers[0]!
    switch (transfer.status) {
      case TransferStatus.INITIAL:
        return await _idmInitialProcessor(tx, transaction)
      case TransferStatus.COMPLETE:
        return await _idmCompleteProcessor(tx, transaction)
      case TransferStatus.CANCEL:
      case TransferStatus.FAIL:
        return await _idmTerminateProcessor(tx, transaction)
      default:
        LOGGER.warn('Transaction IDM Processor', `No status change`, `Transfer: \`${transfer.id}\` is in \`${transfer.status}\``)
        return false
    }
  })
}

// Call IDM, and set transfer to COMPLETE, FAIL, or WAIT base on response.
async function _idmInitialProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {

  const transfer = transaction.transfers[0]!
  if (transfer.status !== TransferStatus.INITIAL) {
    LOGGER.error(`IDM Initial Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }
  return await _IDMTransferInitial(tx, transaction)
}

// IDM Complete, move to next step.
// Inital NBP transfer.
async function _idmCompleteProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {

  const transfer = transaction.transfers[0]!
  if (transfer.status !== TransferStatus.COMPLETE) {
    LOGGER.error(`IDM Complete Processor`, `transaction \`${transaction.id}\``, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
    throw new Error('Unsupport status')
  }

  await tx.transfer.update({
    where: {
      id: transfer.id
    },
    data: {
      next: {
        create: {
          status: TransferStatus.INITIAL,
          name: 'NBP',
          ownerId: transaction.ownerId,
          transactionId: transaction.id
        }
      }
    }
  })
  LOGGER.info(`IDM Complete Processor`, `transaction \`${transaction.id}\``, `Transfer \`${transfer.id}\` Complete Successfully.\``)
  return true
}

// IDM Fail or Cancel. Set the final state for transaction.
async function _idmTerminateProcessor(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const transfer = transaction.transfers[0]!
  if (
    transfer.status !== TransferStatus.CANCEL &&
    transfer.status !== TransferStatus.FAIL
  ) {
    LOGGER.error(`IDM Terminate Processor`, `Unable to processor Transfer \`${transfer.id}\` with status \`${transfer.status}\``)
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
  LOGGER.warn(`IDM Terminate Processor`, `Transaction \`${transaction.id} terminated in \`${updateTransaction.status}\`.\``)
  return false
}

async function _IDMTransferInitial(
  tx: PrismaTransaction, 
  transaction: TRANSACTION_PROJET_TYPE
): Promise<boolean> {
  const idmTransfer = transaction.transfers[0]!
  const t = await tx.transaction.findUniqueOrThrow({
    where: {
      id: transaction.id
    },
    select: {
      id: true,
      destinationAmount: true,
      destinationCurrency: true,
      sourceAmount: true,
      sourceCurrency: true,
      transactionPurpose: true,
      owner: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          postalCode: true,
          phoneNumber: true,
          dob: true,
          pob: true,
          nationality: true,
          province: {
            select: {
              abbr: true
            }
          },
          countryCode: true,
          identification: {
            select: {
              type: true,
              value: true
            }
          },
          occupation: {
            select: {
              type: true
            }
          },
          logins: {
            select: {
              email: true
            }
          }
        }
      },
      destinationContact: {
        select: {
          id: true,
          type: true,
          firstName: true,
          middleName: true,
          lastName: true,
          address1: true,
          address2: true,
          city: true,
          postalCode: true,
          phoneNumber: true,
          province: {
            select: {
              abbr: true
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
      },
      sourceAccount: {
        select: {
          id: true
        }
      },
      createdAt: true
    }
  })
  const remitter = t.owner
  const beneficiary = t.destinationContact
  const source = t.sourceAccount

  const request: TransferReqeust = {
    tid: `${t.id}`,
    bfn: remitter.firstName,
    bmn: remitter.middleName,
    bln: remitter.lastName,
    memo16: remitter.occupation.type,
    bsn: remitter.address1,
    bc: remitter.city,
    bco: remitter.countryCode,
    bs: remitter.province.abbr,
    bz: remitter.postalCode,
    phn: remitter.phoneNumber.replace(/-/g, ''),
    tea: remitter.logins[0]?.email ?? null,
    dob: `${remitter.dob.getTime()}`,
    memo18: remitter.pob,
    nationality: remitter.nationality,
    passportId: remitter.identification!.type === IdentificationType.PASSPORT ? `CA:${remitter.identification?.value}` : null,
    driverId: remitter.identification!.type === IdentificationType.DRIVER_LICENSE ? `CA:${remitter.identification?.value}` : null,
    nationalId: remitter.identification!.type === IdentificationType.PROVINCAL_ID ? `CA:${remitter.identification?.value}` : null,
    phash: sha1(`${source.id}`),
    sfn: beneficiary.firstName,
    smn: beneficiary.middleName,
    sln: beneficiary.lastName,
    dpach: beneficiary.type === ContactType.BANK_ACCOUNT ? sha1(beneficiary.iban ?? beneficiary.bankAccountNum!) : null,
    memo9: beneficiary.type === ContactType.BANK_ACCOUNT ? beneficiary.institution?.abbr : null,
    memo17: beneficiary.type === ContactType.CASH_PICKUP,
    dph: beneficiary.phoneNumber ?? null,
    memo20: beneficiary.relationship?.type,
    ssn: beneficiary.address1,
    sc: beneficiary.city,
    ss: beneficiary.province.abbr,
    sco: beneficiary.countryCode,
    sz: beneficiary.postalCode,
    memo15: t.transactionPurpose,
    tti: `${t.createdAt.getTime()}`,
    amt: `${t.sourceAmount/100.0}`,
    ccy: t.sourceCurrency,
    memo13: `${t.destinationAmount/100.0}`,
    memo12: t.destinationCurrency,
    man: `${remitter.id}`,
    dman: `${beneficiary.id}`
  }

  try {
    const result = await IDMService.transferout(request)
    const resultStatus = result?.res ?? result?.frp
    if (!resultStatus) {
      LOGGER.error('func: _IDMTransferInitial', `Transaction \`${t.id}\` failed to initial IDM`, 'Unsupport status received from IDM')
      throw new Error('Fail to Initial IDM transfer')
    }

    const transferStatus = _idmTransferStatusMapper(resultStatus, t.id)

    if (transferStatus === TransferStatus.COMPLETE) {
      await tx.transfer.update({
        where: {
          id: idmTransfer.id
        },
        data: {
          status: TransferStatus.COMPLETE,
          completeAt: new Date(),
          endInfo: 'IDM complete successfully'
        }
      })
      LOGGER.info('func: _IDMTransferInitial', `Transaction \`${t.id}\` complete IDM transfer`)
      return true
    } else if (transferStatus === TransferStatus.WAIT) {
      await tx.transfer.update({
        where: {
          id: idmTransfer.id
        },
        data: {
          status: TransferStatus.WAIT,
          waitAt: new Date(),
        }
      })
      LOGGER.info('func: _IDMTransferInitial', `Transaction \`${t.id}\` is waiting for IDM transfer to be MANUAL_REVIEW`)
      return false
    }
  } catch (err) {
    LOGGER.error('func: _IDMTransferInitial', `Transaction \`${t.id}\` failed to initial IDM`, err)
  }
  await tx.transfer.update({
    where: {
      id: idmTransfer.id
    },
    data: {
      status: TransferStatus.FAIL,
      failAt: new Date(),
      endInfo: 'IDM check failed.'
    }
  })
  LOGGER.info('func: _IDMTransferInitial', `Transaction \`${t.id}\` failed IDM check.`)
  return true
}

export async function finalizeIDMTransfer(tid: string) {

}

function _idmTransferStatusMapper(idmStatus: string, transactionId: number): TransferStatus {
  switch(idmStatus) {
    case "ACCEPT":
      return TransferStatus.COMPLETE
    case "DENY":
      return TransferStatus.FAIL
    case "MANUAL_REVIEW":
      return TransferStatus.WAIT
    default:
      LOGGER.error('func: _idmTransferStatusMapper', `Transaction \`${transactionId}\` failed to initial IDM`, `Unsupport IDM status \`${idmStatus}\``)
      throw new Error(`Unsupport IDM status \`${idmStatus}\``)
  }
}