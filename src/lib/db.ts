import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpPath = "/tmp/leagueos.db";
    const bundledPath = path.join(process.cwd(), "prisma", "vercel.db");

    if (!fs.existsSync(tmpPath) && fs.existsSync(bundledPath)) {
      fs.copyFileSync(bundledPath, tmpPath);
    }

    return `file:${tmpPath}`;
  }

  return process.env.DATABASE_URL ?? "file:./dev.db";
}

const databaseUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: databaseUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
