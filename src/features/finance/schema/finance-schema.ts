import { z } from "zod";

export const budgetPlanSchema = z.object({
  id: z.string(),
  monthlyIncome: z.number().min(0),
  savingsTarget: z.number().min(0),
  livingBudget: z.number().positive(),
  updatedAt: z.string(),
});

export const budgetPlanFormSchema = z.object({
  monthlyIncome: z.number().min(0, "월 수입은 0 이상이어야 합니다."),
  savingsTarget: z.number().min(0, "저축 목표는 0 이상이어야 합니다."),
  livingBudget: z.number().positive("생활비 예산을 입력해 주세요."),
});

export const expenseEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: z.enum(["food", "transport", "culture", "faith", "living", "other"]),
  amount: z.number().positive(),
  spentAt: z.string(),
  createdAt: z.string(),
});

export const expenseFormSchema = z.object({
  title: z.string().min(1, "사용처를 입력해 주세요."),
  category: z.enum(["food", "transport", "culture", "faith", "living", "other"]),
  amount: z.number().positive("지출 금액은 0보다 커야 합니다."),
  spentAt: z.string().min(1, "지출 날짜를 입력해 주세요."),
});

export const assetAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(["bank", "cash", "investment"]),
  balance: z.number().min(0),
  updatedAt: z.string(),
});

export const assetAccountFormSchema = z.object({
  name: z.string().min(1, "계좌 이름을 입력해 주세요."),
  type: z.enum(["bank", "cash", "investment"]),
  balance: z.number().min(0, "잔액은 0 이상이어야 합니다."),
});

export const portfolioHoldingSchema = z.object({
  id: z.string(),
  symbol: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().positive(),
  averagePrice: z.number().positive(),
  currentPrice: z.number().positive(),
  updatedAt: z.string(),
});

export const portfolioHoldingFormSchema = z.object({
  symbol: z.string().min(1, "종목 코드를 입력해 주세요."),
  name: z.string().min(1, "종목 이름을 입력해 주세요."),
  quantity: z.number().positive("수량을 입력해 주세요."),
  averagePrice: z.number().positive("평균 단가를 입력해 주세요."),
  currentPrice: z.number().positive("현재가를 입력해 주세요."),
});

export const savingsGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0),
  targetDate: z.string(),
  updatedAt: z.string(),
});

export const savingsGoalFormSchema = z.object({
  title: z.string().min(1, "목표 이름을 입력해 주세요."),
  targetAmount: z.number().positive("목표 금액을 입력해 주세요."),
  currentAmount: z.number().min(0, "현재 금액은 0 이상이어야 합니다."),
  targetDate: z.string().min(1, "목표 날짜를 입력해 주세요."),
});

export type BudgetPlan = z.infer<typeof budgetPlanSchema>;
export type BudgetPlanFormValues = z.infer<typeof budgetPlanFormSchema>;
export type ExpenseEntry = z.infer<typeof expenseEntrySchema>;
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
export type AssetAccount = z.infer<typeof assetAccountSchema>;
export type AssetAccountFormValues = z.infer<typeof assetAccountFormSchema>;
export type PortfolioHolding = z.infer<typeof portfolioHoldingSchema>;
export type PortfolioHoldingFormValues = z.infer<typeof portfolioHoldingFormSchema>;
export type SavingsGoal = z.infer<typeof savingsGoalSchema>;
export type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>;
