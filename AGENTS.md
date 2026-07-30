# AGENTS.md

## Cursor Cloud specific instructions

RL LeagueOS is a single Next.js 15 (App Router) + React 19 + Tailwind CSS 4 web app. There is no backend, database, or test suite — the app is currently a static landing page served by Next.js.

- Package manager is npm (`package-lock.json`). Dependencies are refreshed automatically by the startup update script (`npm install`).
- Standard commands live in `package.json` scripts and `README.md`; use those rather than duplicating here:
  - Dev server: `npm run dev` (Next.js + Turbopack on http://localhost:3000)
  - Lint: `npm run lint`
  - Production build: `npm run build`
- Non-obvious notes:
  - `dev` and `build` both use `--turbopack`.
  - The landing page buttons ("Log In" / "Sign Up") have no `href`/handler wired up yet, so clicking them does nothing meaningful — this is expected, not a bug.
  - No automated tests exist; verify UI changes by running the dev server and checking the page in a browser.
