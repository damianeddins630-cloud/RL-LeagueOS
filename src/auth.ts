import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

const discordClientId = process.env.AUTH_DISCORD_ID ?? process.env.DISCORD_CLIENT_ID;
const discordClientSecret =
  process.env.AUTH_DISCORD_SECRET ?? process.env.DISCORD_CLIENT_SECRET;

if (!process.env.AUTH_SECRET) {
  console.warn("AUTH_SECRET is not set. Discord login will not work.");
}

if (!discordClientId || !discordClientSecret) {
  console.warn("Discord OAuth credentials are not set. Login will not work.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Discord({
      clientId: discordClientId ?? "",
      clientSecret: discordClientSecret ?? "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
