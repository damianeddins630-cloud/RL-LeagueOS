import Image from "next/image";
import Link from "next/link";
import { DiscordLoginButton } from "@/components/auth/DiscordLoginButton";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/Button";

type HeaderProps = {
  isLoggedIn?: boolean;
  userName?: string | null;
  canViewLeague?: boolean;
};

export function Header({ isLoggedIn = false, userName, canViewLeague = false }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#0066FF]/20 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image
            src="/logo-rl-os.png"
            alt="RL LeagueOS"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-base font-semibold tracking-wide text-white">
            RL <span className="text-[#0088FF]">LeagueOS</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {userName && (
                <span className="hidden text-sm text-white/50 sm:inline">{userName}</span>
              )}
              {canViewLeague && (
                <Button variant="ghost" href="/league" className="px-4 py-2 text-sm">
                  League
                </Button>
              )}
              <LogoutButton className="px-4 py-2 text-sm" />
            </>
          ) : (
            <DiscordLoginButton className="px-4 py-2 text-sm" />
          )}
        </div>
      </div>
    </header>
  );
}
