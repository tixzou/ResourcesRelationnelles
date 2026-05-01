// Front/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // C'est ici que tu appelles ton backend NestJS !
        const res = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        // Si la requête réussit et qu'on récupère un utilisateur (et son token)
        if (res.ok && user) {
          return user;
        }
        // Sinon on renvoie null ou une erreur
        return null;
      }
    })
  ],
  // Autres configurations (pages personnalisées, callbacks pour gérer le token JWT, etc.)
});

export { handler as GET, handler as POST };