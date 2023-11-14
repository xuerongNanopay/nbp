import CredentialsProvider from "next-auth/providers/credentials"
import { Awaitable, User } from "next-auth"
import type { Session, NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"

export interface AuthItem extends Session {
  token: JWT
  loginItem: LoginItem,
  realUser: RealUser
}

type RealUser = {
  id: string,
  firstname?: string,
  lastname?: string
}

type LoginItem = User & {
  id: string
  isEmailLoginVerified?: boolean,
}

const ADMIN_EMAIL = 'admin@xrw.io'
const ADMIN_PASSWORD= 'adminAb1'
// Generate a Random Secret.
// openssl rand -base64 32
export const authOptions: NextAuthOptions = {
  // session: {

  // },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      // Take login & user info from data base.
      async authorize(credentials, req): Promise<LoginItem | null> {
        if ( ! credentials ) return null
        const { email, password } = credentials
        //TODO: load from database.
        console.log('authorize', credentials)
        if ( email === ADMIN_EMAIL && password === ADMIN_PASSWORD ) {
          //TODO: return login object from data base.
          return { id: '4', email: ADMIN_EMAIL, isEmailLoginVerified: true }
        }
        return null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('clasbacks.signIn', { user, account, profile, email, credentials } )

      const loginItem = user as LoginItem
      if ( ! loginItem ) return false
      console.log('aaa')
      return true
    },
    // async jwt({ token, user, account, profile }) {
    //   console.log('clasbacks.jwt', user, token, account, profile)
    //   // console.log("clasbacks.jwt: ", { user, account, profile });
    //   return token
    // },
    async session({ session, token }) {
      //TODO: Using token.email or session.email to lookup realUser info in database.
      return {...session, token, loginItem: {id: '4', isEmailLoginVerified: true}, realUser: {id: '44'}}
    }
  },
  events: {
    async signIn(message) {
      console.log('events.signIn', message)
    }
  },
  // Customize Auth page. refer to Next 
  pages: {
    signIn: '/auth/signIn',
    //TODO: redirect to page no found
    // error: '/auth/signIn'
  }
}