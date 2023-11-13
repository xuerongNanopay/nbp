import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Generate a Random Secret.
// openssl rand -base64 32
export const options: NextAuthOptions = {
  // session: {

  // },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "xwu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //TODO: load from database.
        // const res = await fetch("/your/endpoint", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const user = await res.json()
  
        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user
        // }
        // // Return null if user data could not be retrieved
        console.log(credentials)
        console.log(req.headers?.method)
        return { username: 'xuerong', email: 'xuerong@nanopay.net', id: '1'}
        // return null
      }
    })
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