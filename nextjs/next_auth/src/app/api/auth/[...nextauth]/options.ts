import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Generate a Random Secret.
// openssl rand -base64 32
export const options: NextAuthOptions = {
  // session: {

  // },
  providers: [

  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("clasbacks.signIn: ", { user, account, profile, email, credentials })
      return true
    },
    async jwt({ token, user, account, profile }) {
      console.log("clasbacks.signIn: ", { user, account, profile });
      return token
    }
  },
  events: {
    async signIn(message) {
      console.log('events.signIn', message)
    }
  }
  // Customize Auth page. refer to Next 
  // pages: {
  //   signIn: '/signin'
  // }
}