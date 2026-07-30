#!/usr/bin/env bash
set -euo pipefail

export DATABASE_URL="${DATABASE_URL:-file:./prisma/vercel.db}"

echo "Using DATABASE_URL=$DATABASE_URL"

npx prisma generate
npx prisma migrate deploy
npm run db:seed
npx next build
