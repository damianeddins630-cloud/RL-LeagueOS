import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A0E1A]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/logo-rl-os.png"
            alt="RL LeagueOS"
            width={44}
            height={44}
            className="h-11 w-11 object-contain drop-shadow-[0_0_12px_rgba(0,136,255,0.55)]"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            <span className="text-[#4FC3FF]">RL</span> LeagueOS
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="secondary" className="px-5 py-2 text-sm sm:px-6 sm:py-2.5">
            Log In
          </Button>
          <Button variant="primary" className="px-5 py-2 text-sm sm:px-6 sm:py-2.5">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
