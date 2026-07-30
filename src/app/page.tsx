import { auth } from "@/auth";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CoinFlipBackground } from "@/components/landing/CoinFlipBackground";
import { Hero } from "@/components/landing/Hero";
import { LoggedInHome } from "@/components/home/LoggedInHome";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <CoinFlipBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 flex-col pt-14">
            <Hero />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { application: true },
  });

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <CoinFlipBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 flex-col pt-14">
            <Hero />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <CoinFlipBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header userName={session.user.name} isLoggedIn />
        <main className="flex flex-1 flex-col pt-14">
          <LoggedInHome user={user} discordName={session.user.name ?? user.name ?? ""} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
