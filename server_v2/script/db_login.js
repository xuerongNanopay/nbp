import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "info",
    }
  ],
})

async function main() {
  const login = await prisma.login.create({data:{
    email: 'aaavvv1@gmail.com',
    password: 'vv'
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