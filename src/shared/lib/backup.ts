import { z } from "zod";

import {
  assetAccountSchema,
  budgetPlanSchema,
  expenseEntrySchema,
  portfolioHoldingSchema,
  savingsGoalSchema,
} from "@/features/finance/schema/finance-schema";
import {
  interactionLogSchema,
  relationshipPersonSchema,
} from "@/features/relationships/schema/relationships-schema";
import {
  bibleBookSchema,
  bibleProgressSchema,
  churchVisitSchema,
  prayerItemSchema,
  retreatRecordSchema,
  sermonNoteSchema,
  worshipSongSchema,
} from "@/features/spiritual/schema/spiritual-schema";
import {
  actionTaskSchema,
  calendarEventSchema,
  dormGuideItemSchema,
  reflectionPostSchema,
  thoughtNoteSchema,
  visionGoalSchema,
} from "@/features/life/schema/life-schema";

export const backupPayloadSchema = z.object({
  version: z.number().int().positive(),
  exportedAt: z.string(),
  domains: z.object({
    finance: z.object({
      budgetPlans: z.array(budgetPlanSchema),
      expenseEntries: z.array(expenseEntrySchema),
      assetAccounts: z.array(assetAccountSchema),
      portfolioHoldings: z.array(portfolioHoldingSchema),
      savingsGoals: z.array(savingsGoalSchema),
    }),
    relationships: z.object({
      people: z.array(relationshipPersonSchema),
      interactionLogs: z.array(interactionLogSchema),
    }),
    spiritual: z.object({
      bibleBooks: z.array(bibleBookSchema),
      bibleProgress: z.array(bibleProgressSchema),
      prayerItems: z.array(prayerItemSchema),
      sermonNotes: z.array(sermonNoteSchema),
      worshipSongs: z.array(worshipSongSchema),
      churchVisits: z.array(churchVisitSchema),
      retreatRecords: z.array(retreatRecordSchema),
    }),
    life: z.object({
      reflectionPosts: z.array(reflectionPostSchema),
      visionGoals: z.array(visionGoalSchema),
      actionTasks: z.array(actionTaskSchema),
      calendarEvents: z.array(calendarEventSchema),
      thoughtNotes: z.array(thoughtNoteSchema),
      dormGuideItems: z.array(dormGuideItemSchema),
    }),
  }),
});

export type BackupPayload = z.infer<typeof backupPayloadSchema>;
