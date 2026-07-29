import { API_URL } from "@/config/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.firstName,
            role: data.user.role,
            accessToken: data.access_token,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Documentation du fichier
 *
 * - Role : Route API NextAuth. Elle configure une authentification par email/mot de passe via CredentialsProvider.
 * - Fonctionnement : La fonction authorize appelle le backend NestJS sur /auth/login, puis transforme la reponse en utilisateur NextAuth.
 * - A retenir : Les callbacks copient le token d'acces et le role dans le JWT puis dans la session pour les composants frontend.
 */
