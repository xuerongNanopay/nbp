import http from 'http'
// import { PrismaClient } from '@prisma/client'
export const sever = http.createServer((_, resp) => {
  resp.writeHead(200, {"Content-type": "application/json"})
  resp.end(JSON.stringify({data: "It works"}))
})

// const _ = new PrismaClient()
// client.login.create({})
sever.listen(3000, () => {
  console.log("Server running on 3000")
})

async function name() {
  console.log('aa')
}

await name()