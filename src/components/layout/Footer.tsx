export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#0066FF]/15 bg-black">
      <div className="mx-auto max-w-5xl px-6 py-6 text-center">
        <p className="text-xs text-white/35">
          © {new Date().getFullYear()} RL LeagueOS · Not affiliated with Psyonix or Epic Games
        </p>
      </div>
    </footer>
  );
}
