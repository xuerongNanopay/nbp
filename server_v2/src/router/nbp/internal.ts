import { refreshIDMTransferStatus } from "@/service/transaction/status/refresh_idm_transfer_status.js"
import { refreshNBPTransferStatus } from "@/service/transaction/status/refresh_nbp_transfer_status.js"
import { refreshScotiaRTPCashInStatus } from "@/service/transaction/status/refresh_scotia_rtp_cash_in_status.js"
import { LOGGER } from "@/utils/logUtil.js"
import { Router } from "express"

const ROUTER = Router()


type UpdateCashinPostParams = {
  transactionId: number
}

ROUTER.post('/update_cashin', async (req, res) => {
  const request = req.body as UpdateCashinPostParams
  try {
    const cashin = await refreshScotiaRTPCashInStatus(request.transactionId)
    res.status(200).json({
      code: 200,
      message: 'Processed',
      data: cashin
    })
  } catch (err: any) {
    LOGGER.error('API: update_cashin', `Transaction ID: \`${request.transactionId}\``, err)
    res.status(400).json({
      code: 400,
      message: err.message
    })
  }
})

type UpdateIDMTransferPostParams = {
  transactionId: number,
  newStatus: 'ACCEPTED' | 'REJECTED' | 'ACCEPT' | 'DENY'
}

ROUTER.post('/update_idm_transfer', async (req, res) => {
  const request = req.body as UpdateIDMTransferPostParams
  try {
    const transfer = await refreshIDMTransferStatus({transactionId: request.transactionId, newStatus: request.newStatus})
    res.status(200).json({
      code: 200,
      message: 'Processed',
      data: transfer
    })
  } catch (err: any) {
    LOGGER.error('API: update_idm_transfer', `Transaction ID: \`${request.transactionId}\``, err)
    res.status(400).json({
      code: 400,
      message: err.message
    })
  }
})

type UpdateNBPTransferPostParams = {
  transactionId: number,
}

ROUTER.post('/update_nbp_transfer', async (req, res) => {
  const request = req.body as UpdateIDMTransferPostParams
  try {
    const transfer = await refreshNBPTransferStatus(request.transactionId)
    res.status(200).json({
      code: 200,
      message: 'Processed',
      data: transfer
    })
  } catch (err: any) {
    LOGGER.error('API: update_nbp_transfer', `Transaction ID: \`${request.transactionId}\``, err)
    res.status(400).json({
      code: 400,
      message: err.message
    })
  }
})

export const INTERNAL_UPDATE_ROUTER = ROUTER