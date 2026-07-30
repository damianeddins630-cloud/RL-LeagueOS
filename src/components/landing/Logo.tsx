import Image from "next/image";

type LogoProps = {
  size?: number;
  showWordmark?: boolean;
};

export function Logo({ size = 140, showWordmark = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          className="absolute -inset-6 rounded-full bg-[#0088FF]/30 blur-3xl"
          aria-hidden="true"
        />
        <Image
          src="/logo-rl-os.png"
          alt="RL LeagueOS logo"
          width={size}
          height={size}
          priority
          className="relative h-auto w-auto max-w-[min(90vw,280px)] drop-shadow-[0_0_40px_rgba(0,136,255,0.6)]"
        />
      </div>
      {showWordmark && (
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            <span className="text-[#4FC3FF]">RL</span> League
            <span className="text-white/90">OS</span>
          </h1>
        </div>
      )}
    </div>
  );
}
