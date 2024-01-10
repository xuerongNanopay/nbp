import { Router } from "express"

const ROUTER = Router()

ROUTER.post('/initial_transaction', async (req, res) => {
  console.log("AAA: ", req.body)
  res.status(200).json({
    code: '200',
    message: 'Success'
  })
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