"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Log out
    </Button>
  );
}
