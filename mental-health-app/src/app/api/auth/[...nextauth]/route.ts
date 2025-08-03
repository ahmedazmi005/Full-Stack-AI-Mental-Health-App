import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// In-memory user store (replace with database later)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
}> = []

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
          return null
        }

        // Find user
        const user = users.find(u => u.email === credentials.email)
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
        
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