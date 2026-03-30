"use client";

import { useLiveQuery } from "dexie-react-hooks";

import {
  getBudgetPlan,
  listAssetAccounts,
  listExpenses,
  listPortfolioHoldings,
  listSavingsGoals,
} from "@/features/finance/repositories/finance-repository";
import {
  getBudgetUsagePercent,
  getMonthlyExpenses,
  getRemainingBudget,
  getSpentAmount,
} from "@/features/finance/services/finance-metrics";

export function useFinanceOverview() {
  const data = useLiveQuery(async () => {
    const [budgetPlan, expenses, assetAccounts, portfolioHoldings, savingsGoals] =
      await Promise.all([
      getBudgetPlan(),
      listExpenses(),
      listAssetAccounts(),
      listPortfolioHoldings(),
      listSavingsGoals(),
    ]);

    const monthlyExpenses = getMonthlyExpenses(expenses);
    const spentAmount = getSpentAmount(monthlyExpenses);
    const budgetUsagePercent = getBudgetUsagePercent(budgetPlan, spentAmount);
    const expenseCategories = monthlyExpenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
        return acc;
      },
      {},
    );

    return {
      budgetPlan,
      recentExpenses: expenses.slice(0, 8),
      assetAccounts,
      portfolioHoldings,
      savingsGoals,
      spentAmount,
      budgetUsagePercent,
      remainingBudget: getRemainingBudget(budgetPlan, spentAmount),
      expenseCategories,
      totalLiquidAssets: assetAccounts.reduce(
        (sum, account) => sum + account.balance,
        0,
      ),
      portfolioValue: portfolioHoldings.reduce(
        (sum, holding) => sum + holding.quantity * holding.currentPrice,
        0,
      ),
    };
  }, []);

  return {
    budgetPlan: data?.budgetPlan,
    recentExpenses: data?.recentExpenses ?? [],
    assetAccounts: data?.assetAccounts ?? [],
    portfolioHoldings: data?.portfolioHoldings ?? [],
    savingsGoals: data?.savingsGoals ?? [],
    spentAmount: data?.spentAmount ?? 0,
    budgetUsagePercent: data?.budgetUsagePercent ?? 0,
    remainingBudget: data?.remainingBudget ?? 0,
    expenseCategories: data?.expenseCategories ?? {},
    totalLiquidAssets: data?.totalLiquidAssets ?? 0,
    portfolioValue: data?.portfolioValue ?? 0,
  };
}
