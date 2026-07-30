import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/landing/Logo";

export function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <Logo animated size={120} />

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4FC3FF]">
            Rocket League League Management
          </p>
          <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
            Run your league from one place — teams, players, schedules, stats,
            and match replays.
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
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
