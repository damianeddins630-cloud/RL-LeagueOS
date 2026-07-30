# RL LeagueOS

A modern Rocket League league management platform. Manage leagues, teams, players, schedules, stats, and admin tools — all in one place.

## Language & Stack

The project is written in **TypeScript** (primary language) on top of:

- **Next.js 15** (App Router) — full-stack React framework
- **React 19** — UI
- **Tailwind CSS 4** — styling
- **@rlrml/subtr-actor** — Rocket League replay parser (Rust compiled to WebAssembly)

HTML/CSS are used for markup and design tokens. A small Python script generates the animated logo GIF.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (included with Node.js)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
RL-LeagueOS/
├── public/                      # Static assets (logos, favicon)
├── scripts/
│   ├── generate-logo-gif.py     # Logo GIF generator
│   └── parse-replay.ts          # CLI replay parser
├── src/
│   ├── app/
│   │   ├── api/replay/parse/    # Replay upload + parse API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── landing/             # Landing page components
│   │   └── ui/                  # Reusable UI primitives
│   └── lib/replay/              # Replay parser (WASM wrapper)
├── tests/fixtures/              # Sample .replay files for testing
├── next.config.ts
├── vercel.json                  # Vercel deployment config
└── package.json
```

## Rocket League Replay Parser

RL LeagueOS includes a replay parser powered by **subtr-actor** (built on the industry-standard **boxcars** parser). It reads `.replay` files and extracts:

- **Match info** — map, date, scores, duration, game type
- **Players** — names, teams, platform IDs
- **Goals** — goal events with frame numbers
- **Event counts** — touches, demolishes, boost pad pickups
- **Field snapshot** — ball and player positions/velocities at a chosen frame

### API (POST `/api/replay/parse`)

Upload a replay as `multipart/form-data`:

| Field | Required | Description |
|-------|----------|-------------|
| `replay` | Yes | `.replay` file |
| `snapshotFrame` | No | Frame index for on-field snapshot (default: last frame) |
| `includeFieldSnapshot` | No | Set to `false` to skip positions (default: `true`) |

Example with curl:

```bash
curl -X POST http://localhost:3000/api/replay/parse \
  -F "replay=@/path/to/match.replay"
```

### CLI

```bash
npm run parse-replay -- tests/fixtures/soccar-lan.replay
```

## Deploy on Vercel

This project is configured for [Vercel](https://vercel.com) out of the box:

1. Push the repository to GitHub (`RL-LeagueOS`).
2. Import the repo in Vercel — it auto-detects **Next.js**.
3. Deploy. No extra environment variables are required for the landing page or replay API.

`vercel.json` sets the replay API to **Node.js runtime**, **60s timeout**, and **1024 MB memory** for parsing larger replays.

> **Note:** Very large replays or heavy frame-by-frame analysis may eventually need a background worker. The current API returns match summary + optional field snapshot, which works well on Vercel serverless.

## Brand Assets

| Asset | Path | Description |
|-------|------|-------------|
| Static logo | `public/logo.svg` | Primary logo (blue, black, white) |
| Animated SVG | `public/logo-animated.svg` | Subtle motion for web |
| Animated GIF | `public/logo-animated.gif` | GIF for social / embeds |

## License

Private — all rights reserved.
