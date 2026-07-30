"use client";

const LOGO_SRC = "/logo-rl-os.png";

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

export function CoinFlipBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* Soft blue spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(0,102,255,0.12)_0%,transparent_70%)]" />

      <div className="coin-flip-scene">
        <div className="coin-flip-coin">
          <CoinFace className="coin-flip-front" />
          <CoinFace className="coin-flip-back" />
        </div>
      </div>

      {/* Clean vignette — pure black edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
    </div>
  );
}
