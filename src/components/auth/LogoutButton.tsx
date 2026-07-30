import { discordLogout } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={discordLogout}>
      <Button type="submit" variant="ghost" className={className}>
        Log out
      </Button>
    </form>
  );
}
