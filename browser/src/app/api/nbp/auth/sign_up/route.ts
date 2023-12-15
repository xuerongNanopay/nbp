import { SignUpData } from "@/types/auth";

export async function POST(req: Request) {
  const signUpPayload: SignUpData = await req.json()

  
}