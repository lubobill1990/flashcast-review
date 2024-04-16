import NextAuth from "next-auth";

import AzureAAD from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type { NextAuthConfig } from "next-auth";
import { prisma } from "@flashcast/db";

export const config = {
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  debug: true,
  theme: {
    logo: "/logo.svg",
  },
  providers: [
    // GitHub,
    AzureAAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
