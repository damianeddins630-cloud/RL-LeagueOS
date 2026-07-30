"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function DiscordLoginButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="primary"
      className={className}
      onClick={() => signIn("discord", { callbackUrl: "/" })}
    >
      Log in with Discord
    </Button>
  );
}
