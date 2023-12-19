// Run boot to initial dependency
import '@/boot'

import express from 'express'
import { HTTP_PORT } from './constant/env.js'

const PORT = HTTP_PORT

let counter = 0
const app = express()

console.log("PORT: " + PORT)
app.get("/", (_, res) => {
  counter = counter + 1
  console.log("count: ", counter)
  res.json({message: 'count: ' + counter})
});

app.listen(PORT)
