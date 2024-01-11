import { initialCashIn } from "@/service/transaction/nbp/index.js"
import { Router } from "express"

const ROUTER = Router()

interface PostParams {
  transactionId: number
}

ROUTER.post('/initial_transaction', async (req, res) => {
  try {
    const request = req.body as PostParams
    const cashIn = await initialCashIn(request.transactionId)
    res.status(200).json({
      code: 200,
      message: 'Success Initial Transaction',
      data: cashIn
    })
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      message: err.message
    })
  }
})

ROUTER.post('/process_transaction', async (req, res) => {

})

ROUTER.post('/retry_transaction', async (req, res) => {

})

ROUTER.post('/cancel_transaction', async (req, res) => {

})

ROUTER.post('/refund_transaction', async (req, res) => {

})

export const NBP_TRANSACTION_ROUTER = ROUTER