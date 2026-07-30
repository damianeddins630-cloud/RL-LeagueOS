import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="hex-grid relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0E1A]"
        aria-hidden="true"
      />
      <Hero />
    </main>
  );
}
