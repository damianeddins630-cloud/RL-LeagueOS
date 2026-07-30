import { DiscordLoginButton } from "@/components/auth/DiscordLoginButton";
import { Logo } from "@/components/landing/Logo";

export function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 sm:py-28">
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-12 text-center">
        <Logo />

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            RL <span className="text-[#0088FF]">LeagueOS</span>
          </h1>
          <p className="text-base leading-relaxed text-white/50 sm:text-lg">
            Log in with Discord to apply for a league. Once you&apos;re accepted, you can view
            schedules, standings, and rosters.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <DiscordLoginButton className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
