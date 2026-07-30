import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CoinFlipBackground } from "@/components/landing/CoinFlipBackground";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <div className="hex-grid relative flex min-h-screen flex-col overflow-hidden">
      <CoinFlipBackground />

      <Header />

      <main className="relative z-10 flex flex-1 flex-col pt-16">
        <Hero />
      </main>

      <Footer />
    </div>
  );
}
