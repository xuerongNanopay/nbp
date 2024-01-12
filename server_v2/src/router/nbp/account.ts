import { NBPService } from "@/service/nbp/index.js"
import { Router } from "express"

const ROUTER = Router()

interface PostParams {
  email: string
}

//TODO: using Account_enquery response.
ROUTER.post('/is_auto_deposit_enable', async (req, res) => {
  try {
    const request = req.body as PostParams
    //TODO: service for RTP auto deposit
    res.status(200).json({
      code: 200,
      message: 'Auto deposit Email'
    })
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      message: err.message,
    })
  }
})

export const NBP_ACCOUNT_ROUTER = ROUTER