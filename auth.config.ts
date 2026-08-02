import type { NextAuthConfig } from "next-auth";

// Kept deliberately free of anything Node-only (bcrypt, Prisma) so it can
// run in the Edge runtime — this is the part proxy.ts (route protection)
// needs. The Credentials provider itself (which does need bcrypt + Prisma)
// lives in auth.ts, which extends this config for the real Node.js runtime
// (API routes, Server Components).
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }
      if (pathname.startsWith("/account")) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
  },
  providers: [], // populated in auth.ts
} satisfies NextAuthConfig;
