"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  budgetPlanFormSchema,
  type BudgetPlan,
  type BudgetPlanFormValues,
} from "@/features/finance/schema/finance-schema";
import { saveBudgetPlan } from "@/features/finance/repositories/finance-repository";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";

type BudgetPlanFormProps = {
  budgetPlan?: BudgetPlan;
};

export function BudgetPlanForm({ budgetPlan }: BudgetPlanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BudgetPlanFormValues>({
    resolver: zodResolver(budgetPlanFormSchema),
    values: {
      monthlyIncome: budgetPlan?.monthlyIncome ?? 3200000,
      savingsTarget: budgetPlan?.savingsTarget ?? 800000,
      livingBudget: budgetPlan?.livingBudget ?? 1400000,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await saveBudgetPlan(values);
    toast.success("예산 기준을 저장했습니다.");
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Monthly Budget Setup</CardTitle>
        <CardDescription>
          수입, 목표 저축액, 생활비 예산을 먼저 고정해 두면 홈 화면에서 이번 달
          흐름을 바로 확인할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">월 수입</span>
            <Input
              inputMode="numeric"
              type="number"
              {...register("monthlyIncome", { valueAsNumber: true })}
            />
            {errors.monthlyIncome ? (
              <p className="text-sm text-rose-600">{errors.monthlyIncome.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">목표 저축액</span>
            <Input
              inputMode="numeric"
              type="number"
              {...register("savingsTarget", { valueAsNumber: true })}
            />
            {errors.savingsTarget ? (
              <p className="text-sm text-rose-600">{errors.savingsTarget.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">생활비 예산</span>
            <Input
              inputMode="numeric"
              type="number"
              {...register("livingBudget", { valueAsNumber: true })}
            />
            {errors.livingBudget ? (
              <p className="text-sm text-rose-600">{errors.livingBudget.message}</p>
            ) : null}
          </label>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "저장 중..." : "예산 저장"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
