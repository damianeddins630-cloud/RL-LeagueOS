import { auth } from "@/auth";
import { db } from "@/lib/db";

export type UserAccess = {
  userId: string;
  isAdmin: boolean;
  isApproved: boolean;
  canViewLeague: boolean;
  applicationStatus: string | null;
};

export async function getAdminDiscordIds(): Promise<string[]> {
  return (process.env.ADMIN_DISCORD_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const adminIds = await getAdminDiscordIds();
  if (adminIds.length === 0) return false;

  const account = await db.account.findFirst({
    where: { userId, provider: "discord" },
  });

  return account ? adminIds.includes(account.providerAccountId) : false;
}

export async function getUserAccess(userId: string): Promise<UserAccess> {
  const [application, isAdmin] = await Promise.all([
    db.leagueApplication.findUnique({ where: { userId } }),
    isAdminUser(userId),
  ]);

  const isApproved = application?.status === "APPROVED";

  return {
    userId,
    isAdmin,
    isApproved,
    canViewLeague: isAdmin || isApproved,
    applicationStatus: application?.status ?? null,
  };
}

export async function requireLeagueAccess() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, reason: "login" as const };
  }

  const access = await getUserAccess(session.user.id);
  if (!access.canViewLeague) {
    return { ok: false as const, reason: "pending" as const, access };
  }

  return { ok: true as const, access, session };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, reason: "login" as const };
  }

  const isAdmin = await isAdminUser(session.user.id);
  if (!isAdmin) {
    return { ok: false as const, reason: "forbidden" as const };
  }

  return { ok: true as const, session };
}
