import { PrismaClient } from "../src/generated/client"

const prisma = new PrismaClient()

async function main() {
  const login = await prisma.login.create({data:{
    email: 'aa',
    password: 'vv',
  }})
  console.log(login)
}

main()
  .catch(e => {
    console.error(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })