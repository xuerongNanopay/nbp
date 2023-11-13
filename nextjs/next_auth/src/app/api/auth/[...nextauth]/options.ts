import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "next-auth"

type Login = User & {
  id: string
  isEmailLoginVerified: boolean,
  user: {
    id: string,
    name: string
  } | undefined | null
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
      async authorize(credentials, req): Promise<Login | null> {
        if ( ! credentials ) return null
        const { email, password } = credentials
        //TODO: load from database.
        console.log('authorize', credentials)
        if ( email === ADMIN_EMAIL && password === ADMIN_PASSWORD ) {
          //TODO: return login object from data base.
          return { id: '4', email: ADMIN_EMAIL, isEmailLoginVerified: true, user: {id: '44', name: 'adminUser'} }
        }
        return null
      }
    })
  ],
  callbacks: {
    // user will be login object
    // handle emailVerify at here
    // diable user login
    async signIn({ user, account, profile, email, credentials }) {
      console.log('clasbacks.signIn', { user, account, profile, email, credentials } )

      const login = user as Login
      if ( ! login ) return false
      // require verify email
      if ( ! login.isEmailLoginVerified ) return '/auth/verifyEmail'
      // require fill userOnboarding form
      if ( ! login.user ) return '/auth/userOnboarding'
      return true
    },
    async jwt({ token, user, account, profile }) {
      console.log('clasbacks.jwt', user, token)
      // console.log("clasbacks.jwt: ", { user, account, profile });
      return token
    },
    async session({ session, token, user }) {
      console.log('clasbacks.session', session, token, user)
      return {...session, token, user}
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