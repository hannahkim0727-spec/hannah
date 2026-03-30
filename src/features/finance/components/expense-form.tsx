"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addExpense } from "@/features/finance/repositories/finance-repository";
import {
  expenseFormSchema,
  type ExpenseFormValues,
} from "@/features/finance/schema/finance-schema";
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

const expenseCategories = [
  { value: "food", label: "식비" },
  { value: "transport", label: "교통" },
  { value: "culture", label: "문화" },
  { value: "faith", label: "신앙" },
  { value: "living", label: "생활" },
  { value: "other", label: "기타" },
] as const;

export function ExpenseForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: "",
      category: "food",
      amount: 0,
      spentAt: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await addExpense(values);
    toast.success("지출을 기록했습니다.");
    reset({
      title: "",
      category: values.category,
      amount: 0,
      spentAt: new Date().toISOString().slice(0, 10),
    });
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Expense Capture</CardTitle>
        <CardDescription>
          사용처와 금액만 빠르게 입력해도 이번 달 예산 소진률이 즉시 갱신됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">사용처</span>
            <Input placeholder="예: 점심 식사" {...register("title")} />
            {errors.title ? (
              <p className="text-sm text-rose-600">{errors.title.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">카테고리</span>
            <select
              className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
              {...register("category")}
            >
              {expenseCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">금액</span>
            <Input
              inputMode="numeric"
              type="number"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount ? (
              <p className="text-sm text-rose-600">{errors.amount.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">날짜</span>
            <Input type="date" {...register("spentAt")} />
            {errors.spentAt ? (
              <p className="text-sm text-rose-600">{errors.spentAt.message}</p>
            ) : null}
          </label>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "기록 중..." : "지출 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
