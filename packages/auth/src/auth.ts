import NextAuth from "next-auth";

import AzureAAD from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type { NextAuthConfig } from "next-auth";
import { prisma } from "@flashcast/db";

export const config = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  theme: {
    logo: "/icon/logo-sm.png",
  },
  providers: [
    // GitHub,
    AzureAAD,
  ],
  basePath: "/auth",
  // session: { strategy: "jwt" },
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
