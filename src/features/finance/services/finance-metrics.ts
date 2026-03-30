import type {
  BudgetPlan,
  ExpenseEntry,
} from "@/features/finance/schema/finance-schema";
import { isCurrentMonth } from "@/shared/lib/format";

export function getMonthlyExpenses(expenses: ExpenseEntry[]) {
  return expenses.filter((expense) => isCurrentMonth(expense.spentAt));
}

export function getSpentAmount(expenses: ExpenseEntry[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getBudgetUsagePercent(
  budgetPlan: BudgetPlan | undefined,
  spentAmount: number,
) {
  if (!budgetPlan || budgetPlan.livingBudget <= 0) {
    return 0;
  }

  return Math.min((spentAmount / budgetPlan.livingBudget) * 100, 100);
}

export function getRemainingBudget(
  budgetPlan: BudgetPlan | undefined,
  spentAmount: number,
) {
  if (!budgetPlan) {
    return 0;
  }

  return budgetPlan.livingBudget - spentAmount;
}
