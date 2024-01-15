import { Router } from 'express'
import { NBP_TRANSACTION_ROUTER } from './transaction.js'
import { NBP_CONTACT_ROUTER } from './contact.js'
import { INTERNAL_UPDATE_ROUTER } from './internal.js'

const ROUTER = Router()
ROUTER.use('/transaction', NBP_TRANSACTION_ROUTER)
ROUTER.use('/contact', NBP_CONTACT_ROUTER)
ROUTER.use('/internal', INTERNAL_UPDATE_ROUTER)

export const NBP_ROUTER = ROUTER