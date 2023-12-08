import { cleanSession } from "@/lib/auth";

async function logout() {
  await cleanSession()
  
  return Response.json({
    message: 'logout'
  },{
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export {logout as GET, logout as POST}