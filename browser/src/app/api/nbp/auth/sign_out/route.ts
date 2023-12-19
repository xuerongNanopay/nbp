import { cleanSession } from "@/lib/session"

async function signOut() {
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

export {signOut as GET, signOut as POST}