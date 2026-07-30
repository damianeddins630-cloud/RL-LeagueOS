"use client";

const LOGO_SRC = "/logo-rl-os.png";

type CoinFlipBackgroundProps = {
  className?: string;
};

function CoinFace({ className }: { className: string }) {
  return (
    <div className={`coin-flip-face ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt=""
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

export function CoinFlipBackground({ className = "" }: CoinFlipBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="coin-flip-scene">
        <div className="coin-flip-coin">
          <CoinFace className="coin-flip-front" />
          <CoinFace className="coin-flip-back" />
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,136,255,0.08)_0%,transparent_45%,#0A0E1A_80%)]" />
      <div className="absolute inset-0 bg-[#0A0E1A]/40" />
    </div>
  );
}
