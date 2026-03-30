import type { ReactNode } from "react";

import { Card, CardContent } from "@/shared/components/ui/card";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  emphasis?: boolean;
};

export function StatTile({
  label,
  value,
  hint,
  icon,
  emphasis = false,
}: StatTileProps) {
  return (
    <Card
      className={
        emphasis
          ? "border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(243,236,223,0.96)_100%)]"
          : ""
      }
    >
      <CardContent className="space-y-3 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted-foreground)]">{label}</p>
          {icon}
        </div>
        <p className="text-2xl font-semibold tracking-[-0.03em]">{value}</p>
        {hint ? (
          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
