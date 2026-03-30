"use client";

import { FinanceAssetsPanel } from "@/features/finance/components/finance-assets-panel";
import { BudgetPlanForm } from "@/features/finance/components/budget-plan-form";
import { ExpenseForm } from "@/features/finance/components/expense-form";
import { FinanceCategoryChart } from "@/features/finance/components/finance-category-chart";
import { FinanceSummaryStrip } from "@/features/finance/components/finance-summary-strip";
import { RecentExpensesCard } from "@/features/finance/components/recent-expenses-card";
import { useFinanceOverview } from "@/features/finance/hooks/use-finance-overview";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatTile } from "@/shared/components/ui/stat-tile";
import { formatCurrency } from "@/shared/lib/format";

export function FinanceOverview() {
  const {
    budgetPlan,
    recentExpenses,
    spentAmount,
    budgetUsagePercent,
    remainingBudget,
    expenseCategories,
    assetAccounts,
    portfolioHoldings,
    savingsGoals,
    totalLiquidAssets,
    portfolioValue,
  } = useFinanceOverview();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Finance"
        title="생활비와 자산 흐름을 로컬에 안정적으로 기록"
        description="예산, 생활비 지출, 월 수입 기준을 먼저 고정해 두고 이번 달 흐름을 계속 누적합니다. 모든 입력은 현재 기기에 저장됩니다."
      />

      <FinanceSummaryStrip
        monthlyIncome={budgetPlan?.monthlyIncome}
        savingsTarget={budgetPlan?.savingsTarget}
        spentAmount={spentAmount}
        remainingBudget={remainingBudget}
        budgetUsagePercent={budgetUsagePercent}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="현금성 자산"
          value={formatCurrency(totalLiquidAssets)}
          hint={`${assetAccounts.length}개 계정`}
        />
        <StatTile
          label="포트폴리오 평가액"
          value={formatCurrency(portfolioValue)}
          hint={`${portfolioHoldings.length}개 종목`}
        />
        <StatTile
          label="저축 목표"
          value={`${savingsGoals.length}개`}
          hint="목적형 자금 추적"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <BudgetPlanForm budgetPlan={budgetPlan} />
        <ExpenseForm />
      </div>

      <FinanceAssetsPanel
        assetAccounts={assetAccounts}
        portfolioHoldings={portfolioHoldings}
        savingsGoals={savingsGoals}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <RecentExpensesCard expenses={recentExpenses} />
        <FinanceCategoryChart expenseCategories={expenseCategories} />
      </div>
    </div>
  );
}
