import { formatSession } from "@/constants/log";
import { getContactDetailByOwnerId } from "@/lib/contact";
import { assertActiveUser } from "@/lib/guard";
import { fetchSession } from "@/lib/session";
import { InvalidInputError, ResourceNoFoundError, UnauthenticateError } from "@/schema/error";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await fetchSession()
  try {
    if (!session || !assertActiveUser(session)) throw new UnauthenticateError("Inactive User")

    const contactId = parseInt(params.id)
    if ( isNaN(contactId) ) throw new InvalidInputError("Invalid Contact Id")

    const contact = await getContactDetailByOwnerId(contactId, session)
    if (!contact) throw new ResourceNoFoundError("Contact No Found")

    return Response.json(
      {
        code: 200,
        data: contact
      },
      {
        status: 200
      }
    )

  } catch (err: any) {
    console.error(formatSession(session), `contact\\${params.id}-GET: `, err.toString())
    
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