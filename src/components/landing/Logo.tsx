import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/logo-rl-os.png"
      alt="RL LeagueOS"
      width={220}
      height={220}
      priority
      className="h-auto w-[min(72vw,220px)] object-contain drop-shadow-[0_0_48px_rgba(0,102,255,0.35)]"
    />
  );
}
