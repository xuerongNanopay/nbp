import type { AccountEnquiryRequest } from "@/partner/nbp/index.d.js"
import { NBPService } from "@/service/nbp/index.js"
import { Router } from "express"

const ROUTER = Router()

//TODO: using Account_enquery response.
ROUTER.post('/account_enqury', async (req, res) => {
  try {
    const request = req.body as AccountEnquiryRequest
    const enquiryAccount = await NBPService.accountEnquiry(request)
    res.status(200).json({
      code: 200,
      message: 'Valid Account',
      data: enquiryAccount
    })
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      message: err.message,
    })
  }
})

export const NBP_CONTACT_ROUTER = ROUTER