import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  href?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0066FF] text-white hover:bg-[#0088FF] border border-[#0066FF] hover:border-[#0088FF]",
  secondary:
    "bg-transparent text-white border border-[#0066FF]/50 hover:border-[#0088FF] hover:bg-[#0066FF]/10",
  ghost:
    "bg-transparent text-white/70 border border-transparent hover:text-white hover:bg-white/5",
};

function buttonClassName(variant: ButtonVariant, className?: string) {
  return [
    "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
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
