"use client";

import type { ExpenseEntry } from "@/features/finance/schema/finance-schema";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency, formatDateLabel } from "@/shared/lib/format";

type RecentExpensesCardProps = {
  expenses: ExpenseEntry[];
};

export function RecentExpensesCard({ expenses }: RecentExpensesCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>
          최근에 기록한 지출을 기준으로 생활비 흐름을 빠르게 점검합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
            아직 지출 기록이 없습니다. 첫 기록을 추가하면 이 리스트가 실제 데이터로
            채워집니다.
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-[22px] border border-[color:var(--border)] bg-white/70 px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{expense.title}</p>
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                    <Badge className="px-2 py-0.5 tracking-[0.08em]">
                      {expense.category}
                    </Badge>
                    <span>{formatDateLabel(expense.spentAt)}</span>
                  </div>
                </div>
                <p className="font-semibold text-[color:var(--accent)]">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
