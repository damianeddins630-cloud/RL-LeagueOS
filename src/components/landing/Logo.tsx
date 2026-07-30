import Image from "next/image";

type LogoProps = {
  animated?: boolean;
  size?: number;
  showWordmark?: boolean;
};

export function Logo({
  animated = false,
  size = 96,
  showWordmark = true,
}: LogoProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full bg-[#0088FF]/20 blur-2xl"
          aria-hidden="true"
        />
        <Image
          src={animated ? "/logo-animated.svg" : "/logo.svg"}
          alt="RL LeagueOS logo"
          width={size}
          height={size}
          priority
          className="relative drop-shadow-[0_0_18px_rgba(0,136,255,0.45)]"
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
