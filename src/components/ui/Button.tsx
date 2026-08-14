import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300",

    secondary:
      "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400",

    ghost:
      "bg-transparent text-neutral-800 hover:bg-neutral-100 disabled:text-neutral-400",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}