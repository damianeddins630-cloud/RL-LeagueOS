import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/landing/Logo";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-12">
        <Logo animated size={112} />

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <Button variant="secondary" className="w-full sm:w-auto">
            Log In
          </Button>
          <Button variant="primary" className="w-full sm:w-auto">
            Sign Up
          </Button>
        </div>
      </div>
    </section>
  );
}
