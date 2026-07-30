"use server";

import { signIn, signOut } from "@/auth";

export async function discordLogin() {
  await signIn("discord", { redirectTo: "/" });
}

export async function discordLogout() {
  await signOut({ redirectTo: "/" });
}
