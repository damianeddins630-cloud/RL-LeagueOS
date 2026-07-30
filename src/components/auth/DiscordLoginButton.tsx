import Link from "next/link";

const buttonClass =
  "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 bg-[#5865F2] text-white hover:bg-[#4752C4] border border-[#5865F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function DiscordLoginButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/api/auth/signin/discord?callbackUrl=/" className={`${buttonClass} ${className}`}>
      Log in with Discord
    </Link>
  );
}
