"use client";

import Image from "next/image";

type CoinFlipBackgroundProps = {
  className?: string;
};

export function CoinFlipBackground({ className = "" }: CoinFlipBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="coin-flip-scene absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="coin-flip-coin">
          <div className="coin-flip-face coin-flip-front">
            <Image
              src="/logo-rl-os.webp"
              alt=""
              width={520}
              height={520}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="coin-flip-face coin-flip-back">
            <Image
              src="/logo-rl-os.webp"
              alt=""
              width={520}
              height={520}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0E1A_68%)]" />
      <div className="absolute inset-0 bg-[#0A0E1A]/55" />
    </div>
  );
}
