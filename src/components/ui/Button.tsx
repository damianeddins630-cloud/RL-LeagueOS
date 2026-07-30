import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  href?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#0088FF] to-[#0066CC] text-white shadow-[0_0_24px_rgba(0,136,255,0.35)] hover:shadow-[0_0_32px_rgba(0,136,255,0.5)] hover:from-[#1A9AFF] hover:to-[#0077EE] border border-[#4FC3FF]/30",
  secondary:
    "bg-transparent text-white border border-white/25 hover:border-[#4FC3FF]/60 hover:bg-white/5 hover:text-[#E8F6FF]",
};

function buttonClassName(variant: ButtonVariant, className?: string) {
  return [
    "inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0088FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A] sm:px-10 sm:py-3.5 sm:text-base",
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={buttonClassName(variant, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName(variant, className)} {...props}>
      {children}
    </button>
  );
}
