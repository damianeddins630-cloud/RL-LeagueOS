import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
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
          <Button variant="ghost" className="hidden px-4 py-2 text-sm sm:inline-flex">
            Log In
          </Button>
          <Button variant="primary" className="px-4 py-2 text-sm">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
