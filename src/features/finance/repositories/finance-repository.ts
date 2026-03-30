"use client";

import { appDb } from "@/db/client/app-db";
import type {
  AssetAccount,
  AssetAccountFormValues,
  BudgetPlan,
  BudgetPlanFormValues,
  ExpenseEntry,
  ExpenseFormValues,
  PortfolioHolding,
  PortfolioHoldingFormValues,
  SavingsGoal,
  SavingsGoalFormValues,
} from "@/features/finance/schema/finance-schema";

const PRIMARY_BUDGET_ID = "primary-budget";

export async function getBudgetPlan() {
  return appDb.budgetPlans.get(PRIMARY_BUDGET_ID);
}

export async function saveBudgetPlan(values: BudgetPlanFormValues) {
  const nextPlan: BudgetPlan = {
    id: PRIMARY_BUDGET_ID,
    monthlyIncome: values.monthlyIncome,
    savingsTarget: values.savingsTarget,
    livingBudget: values.livingBudget,
    updatedAt: new Date().toISOString(),
  };

  await appDb.budgetPlans.put(nextPlan);

  return nextPlan;
}

export async function addExpense(values: ExpenseFormValues) {
  const nextExpense: ExpenseEntry = {
    id: crypto.randomUUID(),
    title: values.title,
    amount: values.amount,
    category: values.category,
    spentAt: values.spentAt,
    createdAt: new Date().toISOString(),
  };

  await appDb.expenseEntries.add(nextExpense);

  return nextExpense;
}

export async function listRecentExpenses() {
  return appDb.expenseEntries.orderBy("spentAt").reverse().limit(8).toArray();
}

export async function listExpenses() {
  return appDb.expenseEntries.orderBy("spentAt").reverse().toArray();
}

export async function addAssetAccount(values: AssetAccountFormValues) {
  const nextAccount: AssetAccount = {
    id: crypto.randomUUID(),
    name: values.name,
    type: values.type,
    balance: values.balance,
    updatedAt: new Date().toISOString(),
  };

  await appDb.assetAccounts.add(nextAccount);
  return nextAccount;
}

export async function listAssetAccounts() {
  return appDb.assetAccounts.orderBy("updatedAt").reverse().toArray();
}

export async function addPortfolioHolding(values: PortfolioHoldingFormValues) {
  const nextHolding: PortfolioHolding = {
    id: crypto.randomUUID(),
    symbol: values.symbol,
    name: values.name,
    quantity: values.quantity,
    averagePrice: values.averagePrice,
    currentPrice: values.currentPrice,
    updatedAt: new Date().toISOString(),
  };

  await appDb.portfolioHoldings.add(nextHolding);
  return nextHolding;
}

export async function listPortfolioHoldings() {
  return appDb.portfolioHoldings.orderBy("updatedAt").reverse().toArray();
}

export async function addSavingsGoal(values: SavingsGoalFormValues) {
  const nextGoal: SavingsGoal = {
    id: crypto.randomUUID(),
    title: values.title,
    targetAmount: values.targetAmount,
    currentAmount: values.currentAmount,
    targetDate: values.targetDate,
    updatedAt: new Date().toISOString(),
  };

  await appDb.savingsGoals.add(nextGoal);
  return nextGoal;
}

export async function listSavingsGoals() {
  return appDb.savingsGoals.orderBy("targetDate").toArray();
}
