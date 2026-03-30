import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[color:var(--background)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--accent)] px-5 py-2.5 text-[color:var(--accent-foreground)] shadow-[0_14px_40px_-20px_rgba(28,58,46,0.75)] hover:bg-[color:var(--accent-strong)]",
        secondary:
          "border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-5 py-2.5 text-[color:var(--foreground)] hover:bg-[color:var(--surface-strong)]",
        ghost:
          "px-4 py-2 text-[color:var(--muted-foreground)] hover:bg-white/70 hover:text-[color:var(--foreground)]",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
