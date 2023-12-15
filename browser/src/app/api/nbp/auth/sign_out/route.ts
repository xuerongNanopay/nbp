// import { cleanSession } from "@/lib/auth"

async function POST() {
  // await cleanSession()
  
  return Response.json({
    message: 'logout'
  },{
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}