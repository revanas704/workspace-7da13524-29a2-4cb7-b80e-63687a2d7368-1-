import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      role: string
      guruId?: string
    }
  }
  interface User {
    id: string
    username: string
    role: string
    guruId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: string
    guruId?: string
  }
}

const isDevelopment = process.env.NODE_ENV === 'development'

console.log('=== NextAuth Configuration ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'NOT SET')
console.log('isDevelopment:', isDevelopment)

export const authOptions: NextAuthOptions = {
  debug: isDevelopment,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('Authorize attempt with username:', credentials?.username)
        
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        const user = await db.user.findUnique({
          where: { username: credentials.username },
          include: { guru: true },
        })

        if (!user) {
          console.log('User not found')
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.log('Invalid password')
          return null
        }

        console.log('Login successful for user:', user.username)
        return {
          id: user.id,
          username: user.username,
          role: user.role,
          guruId: user.guruId,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: isDevelopment ? 'next-auth.session-token' : '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: !isDevelopment,
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl })
      if (!url) return baseUrl
      if (url.startsWith('/')) return url
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.guruId = user.guruId
        console.log('JWT token created for user:', user.username)
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          role: token.role,
          guruId: token.guruId,
        }
        console.log('Session created for user:', token.username)
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
