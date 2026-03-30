import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/75 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
