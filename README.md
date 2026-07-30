# RL LeagueOS

A modern Rocket League league management platform. Manage leagues, teams, players, schedules, stats, and admin tools — all in one place.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **ESLint**

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
├── public/                  # Static assets
│   ├── logo.svg             # Static logo
│   ├── logo-animated.svg    # Animated SVG logo (web)
│   └── logo-animated.gif    # Animated GIF logo
├── scripts/
│   └── generate-logo-gif.py # Logo GIF generator
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── globals.css      # Global styles & theme
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home / landing page
│   └── components/
│       ├── landing/         # Landing page components
│       │   ├── Hero.tsx
│       │   └── Logo.tsx
│       └── ui/              # Reusable UI primitives
│           └── Button.tsx
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com):

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Vercel will auto-detect Next.js and configure the build.

## Brand Assets

| Asset | Path | Description |
|-------|------|-------------|
| Static logo | `public/logo.svg` | Primary logo (blue, black, white) |
| Animated SVG | `public/logo-animated.svg` | Subtle motion for web (glow, rotation, boost) |
| Animated GIF | `public/logo-animated.gif` | GIF version for social / embeds |

To regenerate the GIF:

```bash
pip install pillow
python scripts/generate-logo-gif.py
```

## License

Private — all rights reserved.
