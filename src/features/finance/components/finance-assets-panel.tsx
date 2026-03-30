"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, PiggyBank, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  addAssetAccount,
  addPortfolioHolding,
  addSavingsGoal,
} from "@/features/finance/repositories/finance-repository";
import {
  assetAccountFormSchema,
  portfolioHoldingFormSchema,
  savingsGoalFormSchema,
  type AssetAccount,
  type AssetAccountFormValues,
  type PortfolioHolding,
  type PortfolioHoldingFormValues,
  type SavingsGoal,
  type SavingsGoalFormValues,
} from "@/features/finance/schema/finance-schema";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { formatCurrency } from "@/shared/lib/format";

type FinanceAssetsPanelProps = {
  assetAccounts: AssetAccount[];
  portfolioHoldings: PortfolioHolding[];
  savingsGoals: SavingsGoal[];
};

export function FinanceAssetsPanel({
  assetAccounts,
  portfolioHoldings,
  savingsGoals,
}: FinanceAssetsPanelProps) {
  const accountForm = useForm<AssetAccountFormValues>({
    resolver: zodResolver(assetAccountFormSchema),
    defaultValues: {
      name: "",
      type: "bank",
      balance: 0,
    },
  });

  const holdingForm = useForm<PortfolioHoldingFormValues>({
    resolver: zodResolver(portfolioHoldingFormSchema),
    defaultValues: {
      symbol: "",
      name: "",
      quantity: 0,
      averagePrice: 0,
      currentPrice: 0,
    },
  });

  const goalForm = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="size-4 text-[color:var(--accent)]" />
            Asset Accounts
          </CardTitle>
          <CardDescription>통장, 현금, 투자 계정 잔액을 분리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            className="grid gap-4"
            onSubmit={accountForm.handleSubmit(async (values) => {
              await addAssetAccount(values);
              toast.success("자산 계정을 추가했습니다.");
              accountForm.reset({ name: "", type: values.type, balance: 0 });
            })}
          >
            <Input placeholder="예: 토스뱅크" {...accountForm.register("name")} />
            <select
              className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
              {...accountForm.register("type")}
            >
              <option value="bank">은행</option>
              <option value="cash">현금</option>
              <option value="investment">투자 계정</option>
            </select>
            <Input
              type="number"
              {...accountForm.register("balance", { valueAsNumber: true })}
            />
            <Button className="w-full" type="submit">
              계좌 추가
            </Button>
          </form>

          <div className="space-y-3">
            {assetAccounts.map((account) => (
              <div key={account.id} className="rounded-[18px] bg-white/70 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{account.name}</p>
                  <Badge>{account.type}</Badge>
                </div>
                <p className="mt-2 text-[color:var(--accent)]">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[color:var(--accent)]" />
            Portfolio
          </CardTitle>
          <CardDescription>보유 수량, 평균 단가, 현재가를 함께 기록합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            className="grid gap-4"
            onSubmit={holdingForm.handleSubmit(async (values) => {
              await addPortfolioHolding(values);
              toast.success("포트폴리오 항목을 추가했습니다.");
              holdingForm.reset({
                symbol: "",
                name: "",
                quantity: 0,
                averagePrice: 0,
                currentPrice: 0,
              });
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="AAPL" {...holdingForm.register("symbol")} />
              <Input placeholder="Apple" {...holdingForm.register("name")} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                type="number"
                placeholder="수량"
                {...holdingForm.register("quantity", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="평균 단가"
                {...holdingForm.register("averagePrice", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="현재가"
                {...holdingForm.register("currentPrice", { valueAsNumber: true })}
              />
            </div>
            <Button className="w-full" type="submit">
              종목 추가
            </Button>
          </form>

          <div className="space-y-3">
            {portfolioHoldings.map((holding) => (
              <div key={holding.id} className="rounded-[18px] bg-white/70 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {holding.name} ({holding.symbol})
                  </p>
                  <Badge>{holding.quantity}주</Badge>
                </div>
                <p className="mt-2 text-[color:var(--muted-foreground)]">
                  평가액 {formatCurrency(holding.quantity * holding.currentPrice)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="size-4 text-[color:var(--accent)]" />
            Savings Goals
          </CardTitle>
          <CardDescription>내 집 마련, 새 차 같은 목적형 저축을 추적합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            className="grid gap-4"
            onSubmit={goalForm.handleSubmit(async (values) => {
              await addSavingsGoal(values);
              toast.success("저축 목표를 추가했습니다.");
              goalForm.reset({
                title: "",
                targetAmount: 0,
                currentAmount: 0,
                targetDate: new Date().toISOString().slice(0, 10),
              });
            })}
          >
            <Input placeholder="예: 내 집 마련" {...goalForm.register("title")} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="number"
                placeholder="목표 금액"
                {...goalForm.register("targetAmount", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="현재 금액"
                {...goalForm.register("currentAmount", { valueAsNumber: true })}
              />
            </div>
            <Input type="date" {...goalForm.register("targetDate")} />
            <Button className="w-full" type="submit">
              목표 추가
            </Button>
          </form>

          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const progress = Math.min(
                100,
                goal.targetAmount === 0
                  ? 0
                  : (goal.currentAmount / goal.targetAmount) * 100,
              );

              return (
                <div key={goal.id} className="rounded-[18px] bg-white/70 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{goal.title}</p>
                    <Badge>{progress.toFixed(0)}%</Badge>
                  </div>
                  <p className="mt-2 text-[color:var(--muted-foreground)]">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
