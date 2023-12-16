'use server'

import { cleanSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function signOut() {
  await cleanSession()
  redirect('/nbp/sign_in')
}