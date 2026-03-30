"use client";

import Dexie, { type Table } from "dexie";

import type {
  AssetAccount,
  BudgetPlan,
  ExpenseEntry,
  PortfolioHolding,
  SavingsGoal,
} from "@/features/finance/schema/finance-schema";
import type { RelationshipPerson } from "@/features/relationships/schema/relationships-schema";
import type { InteractionLog } from "@/features/relationships/schema/relationships-schema";
import type {
  BibleBook,
  BibleProgress,
  ChurchVisit,
  PrayerItem,
  RetreatRecord,
  SermonNote,
  WorshipSong,
} from "@/features/spiritual/schema/spiritual-schema";
import type {
  ActionTask,
  CalendarEvent,
  DormGuideItem,
  ReflectionPost,
  ThoughtNote,
  VisionGoal,
} from "@/features/life/schema/life-schema";

class YouthLeaderDatabase extends Dexie {
  budgetPlans!: Table<BudgetPlan, string>;
  expenseEntries!: Table<ExpenseEntry, string>;
  assetAccounts!: Table<AssetAccount, string>;
  portfolioHoldings!: Table<PortfolioHolding, string>;
  savingsGoals!: Table<SavingsGoal, string>;
  relationshipPeople!: Table<RelationshipPerson, string>;
  relationshipInteractionLogs!: Table<InteractionLog, string>;
  prayerItems!: Table<PrayerItem, string>;
  sermonNotes!: Table<SermonNote, string>;
  worshipSongs!: Table<WorshipSong, string>;
  bibleProgress!: Table<BibleProgress, string>;
  bibleBooks!: Table<BibleBook, string>;
  churchVisits!: Table<ChurchVisit, string>;
  retreatRecords!: Table<RetreatRecord, string>;
  reflectionPosts!: Table<ReflectionPost, string>;
  visionGoals!: Table<VisionGoal, string>;
  actionTasks!: Table<ActionTask, string>;
  calendarEvents!: Table<CalendarEvent, string>;
  thoughtNotes!: Table<ThoughtNote, string>;
  dormGuideItems!: Table<DormGuideItem, string>;

  constructor() {
    super("youth-leader-dashboard");

    this.version(3).stores({
      budgetPlans: "id, updatedAt",
      expenseEntries: "id, category, spentAt, createdAt",
      assetAccounts: "id, type, updatedAt",
      portfolioHoldings: "id, symbol, updatedAt",
      savingsGoals: "id, targetDate, updatedAt",
      relationshipPeople: "id, tier, nextCheckInAt, lastContactAt, name",
      relationshipInteractionLogs: "id, personId, happenedAt, kind",
      prayerItems: "id, answered, updatedAt, category",
      sermonNotes: "id, preachedAt, church",
      worshipSongs: "id, createdAt",
      bibleProgress: "id, updatedAt",
      bibleBooks: "id, testament, completed, updatedAt",
      churchVisits: "id, visitDate, churchName",
      retreatRecords: "id, createdAt",
      reflectionPosts: "id, createdAt, mood",
      visionGoals: "id, horizon, updatedAt, progress",
      actionTasks: "id, status, dueDate, createdAt",
      calendarEvents: "id, category, date",
      thoughtNotes: "id, createdAt",
      dormGuideItems: "id, category, updatedAt",
    });
  }
}

export const appDb = new YouthLeaderDatabase();
