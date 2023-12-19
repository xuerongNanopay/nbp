// Run boot to initial dependency
import './boot/index'

import express from 'express'

let counter = 0
const PORT = process.env['HTTP_PORT'] || 3000
const app = express()

console.log("PORT: " + PORT)
app.get("/", (_, res) => {
  counter = counter + 1
  console.log("count: ", counter)
  res.json({message: 'count: ' + counter})
});

app.listen(PORT)
