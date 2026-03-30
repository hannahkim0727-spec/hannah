"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/lib/format";

type FinanceCategoryChartProps = {
  expenseCategories: Record<string, number>;
};

const CATEGORY_LABELS: Record<string, string> = {
  food: "식비",
  transport: "교통",
  culture: "문화",
  faith: "신앙",
  living: "생활",
  other: "기타",
};

const CHART_COLORS = [
  "#365949",
  "#7a9569",
  "#b88a44",
  "#526780",
  "#9b6b63",
  "#c6ad7f",
];

export function FinanceCategoryChart({
  expenseCategories,
}: FinanceCategoryChartProps) {
  const chartData = Object.entries(expenseCategories).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] ?? key,
    value,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Mix</CardTitle>
        <CardDescription>
          이번 달 지출이 어떤 카테고리에 쏠리는지 확인합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1fr_220px]">
        <div className="h-[220px]">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-[22px] border border-dashed border-[color:var(--border-strong)] bg-white/60 px-5 text-sm text-[color:var(--muted-foreground)]">
              이번 달 지출을 입력하면 카테고리 비중이 보입니다.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={84}
                  paddingAngle={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? formatCurrency(value) : ""
                  }
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #d7cdbc",
                    backgroundColor: "#fffdf9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-3">
          {chartData.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center justify-between rounded-[18px] bg-white/65 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
