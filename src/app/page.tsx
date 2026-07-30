import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <div className="hex-grid flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col pt-16">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0088FF]/5 via-transparent to-[#0A0E1A]"
          aria-hidden="true"
        />
        <Hero />
      </main>

      <Footer />
    </div>
  );
}
