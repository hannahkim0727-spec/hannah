"use client";

import { differenceInCalendarDays, startOfDay, startOfYear } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { BookHeart, CircleDollarSign, Sparkles, UsersRound } from "lucide-react";
import { motion, type Variants } from "motion/react";

import { appDb } from "@/db/client/app-db";
import { DAILY_VERSES } from "@/features/spiritual/constants/bible";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatTile } from "@/shared/components/ui/stat-tile";
import { formatCurrency, formatDateLabel } from "@/shared/lib/format";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function DashboardOverview() {
  const dailyVerse =
    DAILY_VERSES[
      differenceInCalendarDays(startOfDay(new Date()), startOfYear(new Date())) %
        DAILY_VERSES.length
    ];

  const data = useLiveQuery(async () => {
    const [
      expenses,
      assetAccounts,
      portfolioHoldings,
      people,
      prayerItems,
      actionTasks,
      sermonNotes,
      visionGoals,
      reflections,
    ] = await Promise.all([
      appDb.expenseEntries.toArray(),
      appDb.assetAccounts.toArray(),
      appDb.portfolioHoldings.toArray(),
      appDb.relationshipPeople.toArray(),
      appDb.prayerItems.toArray(),
      appDb.actionTasks.toArray(),
      appDb.sermonNotes.orderBy("preachedAt").reverse().limit(10).toArray(),
      appDb.visionGoals.orderBy("updatedAt").reverse().limit(10).toArray(),
      appDb.reflectionPosts.orderBy("createdAt").reverse().limit(10).toArray(),
    ]);

    const monthlySpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalAssets = assetAccounts.reduce((sum, account) => sum + account.balance, 0);
    const portfolioValue = portfolioHoldings.reduce(
      (sum, holding) => sum + holding.quantity * holding.currentPrice,
      0,
    );

    return {
      monthlySpent,
      totalAssets,
      portfolioValue,
      relationshipCount: people.length,
      activePrayers: prayerItems.filter((item) => !item.answered).length,
      openTasks: actionTasks.filter((task) => task.status !== "done").length,
      sermonNotes,
      visionGoals,
      reflections,
    };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <SectionHeading
          eyebrow="Dashboard"
          title="삶의 네 영역을 한 화면에서 보는 홈 대시보드"
          description="지출, 관계, 기도, 실행 항목의 현재 상태를 한 번에 점검하고 최근 기록까지 이어서 볼 수 있게 구성했습니다."
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="생활비 누적"
          value={formatCurrency(data?.monthlySpent ?? 0)}
          hint="현재 저장된 전체 지출 합"
          icon={<CircleDollarSign className="size-4 text-[color:var(--accent-strong)]" />}
          emphasis
        />
        <StatTile
          label="현금성 자산"
          value={formatCurrency(data?.totalAssets ?? 0)}
          hint={`포트폴리오 ${formatCurrency(data?.portfolioValue ?? 0)}`}
          icon={<UsersRound className="size-4 text-[color:var(--accent-strong)]" />}
        />
        <StatTile
          label="관계 기록"
          value={`${data?.relationshipCount ?? 0}명`}
          hint="등록된 인연"
          icon={<BookHeart className="size-4 text-[color:var(--accent-strong)]" />}
        />
        <StatTile
          label="활성 기도 / 실행"
          value={`${data?.activePrayers ?? 0} / ${data?.openTasks ?? 0}`}
          hint="기도 제목 / 할 일"
          icon={<Sparkles className="size-4 text-[color:var(--accent-strong)]" />}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#ffe8ec] via-[#fff4f6] to-[#ffffff] text-[color:var(--foreground)] shadow-[0_8px_30px_rgba(255,182,193,0.15)] ring-1 ring-white/50">
          <CardContent className="grid gap-4 px-8 py-8 md:grid-cols-[0.7fr_1.3fr] items-center">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                Today&apos;s Verse
              </p>
              <p className="font-display text-4xl font-bold tracking-tight text-[color:var(--foreground)]">
                {dailyVerse.reference}
              </p>
            </div>
            <p className="text-xl font-medium leading-[1.6] text-[color:var(--muted-foreground)] text-pretty border-l border-[color:var(--border)] pl-6">
              &quot;{dailyVerse.text}&quot;
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="flex flex-col h-[400px]">
          <CardHeader className="pb-4 shrink-0 border-b border-[color:var(--border)]/50">
            <CardTitle className="text-xl">최근 설교와 비전 흐름</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 overflow-hidden p-0">
            <div className="grid w-full grid-cols-2 divide-x divide-[color:var(--border)]/50 bg-white/30">
              <div className="flex flex-col p-5 overflow-y-auto custom-scrollbar space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)] mb-1">
                  Sermons
                </p>
                {data?.sermonNotes.length ? (
                  data.sermonNotes.map((note) => (
                    <div
                      key={note.id}
                      className="group rounded-[18px] bg-white border border-[color:var(--border)]/60 px-5 py-4 text-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:border-[color:var(--accent-strong)] hover:-translate-y-0.5"
                    >
                      <p className="font-semibold text-base text-[color:var(--foreground)] pr-2 group-hover:text-[color:var(--accent-strong)] transition-colors">
                        {note.title}
                      </p>
                      <p className="mt-2 text-[13px] text-[color:var(--muted-foreground)] font-medium">
                        {note.church} <span className="text-[color:var(--border)] px-1">|</span> {formatDateLabel(note.preachedAt)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)] flex items-center justify-center min-h-[100px]">
                    기록이 아직 없어요 ✨
                  </div>
                )}
              </div>

              <div className="flex flex-col p-5 overflow-y-auto custom-scrollbar space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)] mb-1">
                  Vision
                </p>
                {data?.visionGoals.length ? (
                  data.visionGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="group rounded-[18px] bg-white border border-[color:var(--border)]/60 px-5 py-4 text-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:border-[color:var(--accent-strong)] hover:-translate-y-0.5"
                    >
                      <p className="font-semibold text-base text-[color:var(--foreground)] pr-2 group-hover:text-[color:var(--accent-strong)] transition-colors">
                        {goal.title}
                      </p>
                      <p className="mt-2 text-[13px] text-[color:var(--muted-foreground)] font-medium">
                        {goal.horizon} <span className="text-[color:var(--border)] px-1">|</span> 달성율 {goal.progress}%
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)] flex items-center justify-center min-h-[100px]">
                    비전 목표를 세워보세요 🤍
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <CardHeader className="pb-4 shrink-0 border-b border-[color:var(--border)]/50">
            <CardTitle className="text-xl">최근 성찰 시간</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-white/30 truncate">
            {data?.reflections.length ? (
              data.reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="rounded-[20px] bg-white border border-[color:var(--border)]/60 px-6 py-5 text-sm transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,182,193,0.12)] hover:border-[color:var(--accent-strong)]"
                >
                  <p className="font-semibold text-[17px] text-[color:var(--foreground)] tracking-tight">
                    {reflection.title}
                  </p>
                  <p className="mt-3 leading-[1.7] text-[15px] text-[color:var(--muted-foreground)] break-words whitespace-pre-wrap">
                    {reflection.body}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-6 text-sm leading-6 text-[color:var(--muted-foreground)] flex items-center justify-center min-h-[100px]">
                일상을 돌아보며 기록해보세요 ☁️
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
