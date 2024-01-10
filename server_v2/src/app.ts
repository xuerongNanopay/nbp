// Run boot to initial dependency
import '@/boot'

import express from 'express'
import { HTTP_PORT } from './boot/env.js'
import { NBP_ROUTER } from './router/nbp/index.js'

const PORT = HTTP_PORT
const app = express()

console.log("PORT: " + PORT)

app.use(express.json())
app.use('/nbp', NBP_ROUTER)

app.use((_, res) => {
  res.status(404).json({
    code: 404,
    message: 'Resource No Found'
  })
})

app.listen(PORT)
