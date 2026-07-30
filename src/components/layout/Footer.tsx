export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0E1A]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} RL LeagueOS. Rocket League league management.
        </p>
        <p className="text-xs text-white/30">
          Not affiliated with Psyonix or Epic Games.
        </p>
      </div>
    </footer>
  );
}
