import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CoinFlipBackground } from "@/components/landing/CoinFlipBackground";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E1A]">
      <CoinFlipBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col pt-16">
          <Hero />
        </main>

        <Footer />
      </div>
    </div>
  );
}
