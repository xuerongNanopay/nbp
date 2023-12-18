import { getAllContactsByOwnerId } from "@/lib/contact";
import { assertActiveUser } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { UnauthenticateError } from "@/schema/error";

export async function GET() {
  const session = await fetchSession()
  try {
    if (!session || !assertActiveUser(session)) throw new UnauthenticateError("Inactive User")

    const contacts = await getAllContactsByOwnerId(session)
  } catch (err: any) {
    console.error("session: ", JSON.stringify(session), "contact-GET", err.toString())
    
    const errorResponse = !err.errors ? {
      code: err.code,
      name: err.name,
      message: err.message
    } : {
      code: err.code,
      name: err.name,
      message: err.message,
      errors: err.errors
    }
    return Response.json(errorResponse, {
      status: err.code ?? 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}