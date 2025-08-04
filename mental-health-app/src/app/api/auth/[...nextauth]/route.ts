import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { userStore } from "../../../lib/userStore"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        // Find user in shared store
        const user = userStore.findByEmail(credentials.email)
        console.log('User found:', user ? 'Yes' : 'No', 'for email:', credentials.email)
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          console.log('Password match successful')
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
        
        console.log('Authentication failed')
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup'
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})

export { handler as GET, handler as POST } 