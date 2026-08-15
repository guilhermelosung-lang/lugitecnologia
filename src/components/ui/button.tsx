import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_8px_22px_rgba(147,51,234,.3)] hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0",
  secondary:
    "bg-surface border border-border text-foreground hover:bg-border/40 disabled:opacity-50",
  ghost: "text-foreground hover:bg-border/40 disabled:opacity-50",
  danger: "bg-danger text-white hover:opacity-90 disabled:opacity-50",
  outline:
    "border border-accent text-accent-dark hover:bg-accent/10 disabled:opacity-50",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
