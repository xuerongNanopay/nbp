import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Generate a Random Secret.
// openssl rand -base64 32
export const options: NextAuthOptions = {
  providers: [

  ],
  // Customize Auth page. refer to Next 
  // pages: {
  //   signIn: '/signin'
  // }
}