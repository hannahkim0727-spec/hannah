"use client";

import { motion } from "motion/react";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { formatCompactCurrency, formatCurrency } from "@/shared/lib/format";

type FinanceSummaryStripProps = {
  monthlyIncome?: number;
  savingsTarget?: number;
  spentAmount: number;
  remainingBudget: number;
  budgetUsagePercent: number;
};

export function FinanceSummaryStrip({
  monthlyIncome,
  savingsTarget,
  spentAmount,
  remainingBudget,
  budgetUsagePercent,
}: FinanceSummaryStripProps) {
  const metrics = [
    {
      label: "이번 달 지출",
      value: formatCurrency(spentAmount),
      hint: "입력 즉시 반영",
    },
    {
      label: "남은 생활비",
      value: formatCurrency(remainingBudget),
      hint: "예산 기준",
    },
    {
      label: "월 수입",
      value: monthlyIncome ? formatCompactCurrency(monthlyIncome) : "미설정",
      hint: "기준 금액",
    },
    {
      label: "목표 저축",
      value: savingsTarget ? formatCompactCurrency(savingsTarget) : "미설정",
      hint: "월 목표",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Badge>Finance snapshot</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            생활비 흐름을 한 번에 정리하는 출발점
          </h2>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(34,64,52,0.98)_0%,rgba(24,39,52,0.96)_100%)] text-white">
          <CardContent className="flex h-full flex-col justify-between gap-8 px-6 py-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.18em] text-white/65">
                Current budget rhythm
              </p>
              <p className="max-w-2xl text-3xl font-semibold tracking-[-0.04em]">
                기록할수록 이번 달 소비 패턴이 또렷해집니다.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-sm text-white/70">생활비 소진률</span>
                <span className="text-3xl font-semibold">
                  {budgetUsagePercent.toFixed(0)}%
                </span>
              </div>
              <Progress value={budgetUsagePercent} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.28 }}
            >
              <Card className="h-full">
                <CardContent className="space-y-3 px-5 py-5">
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-[-0.03em]">
                    {metric.value}
                  </p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {metric.hint}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
