import Image from "next/image";

type LogoProps = {
  size?: number;
  showWordmark?: boolean;
};

export function Logo({ size = 96, showWordmark = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full bg-[#0088FF]/25 blur-2xl"
          aria-hidden="true"
        />
        <Image
          src="/logo-rl-os.webp"
          alt="RL LeagueOS logo"
          width={size}
          height={size}
          priority
          className="relative rounded-full drop-shadow-[0_0_24px_rgba(0,136,255,0.55)]"
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
