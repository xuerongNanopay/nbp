import { Router } from "express"

const ROUTER = Router()

ROUTER.post('/account_enqury', async (req, res) => {
  console.log("AAA: ", req.body)
})

export const NBP_CONTACT_ROUTER = ROUTER