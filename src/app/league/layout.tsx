import Link from "next/link";
import { LeagueNav } from "@/components/league/LeagueNav";

export default function LeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#0066FF]/20 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#0088FF]">
              RL LeagueOS
            </Link>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Rocket League Elite Series
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            Home
          </Link>
        </div>
        <LeagueNav />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
