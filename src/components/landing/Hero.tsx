import { Button } from "@/components/ui/Button";
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
            League management for Rocket League. Clean. Fast. Built for esports.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" className="w-full sm:w-auto">
            Sign Up
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            Log In
          </Button>
        </div>
      </div>
    </section>
  );
}
