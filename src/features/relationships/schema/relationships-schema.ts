import { z } from "zod";

export const relationshipTierSchema = z.enum(["core", "close", "warm", "friendly"]);

export const relationshipPersonSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  tier: relationshipTierSchema,
  contactCadenceDays: z.number().int().positive(),
  lastContactAt: z.string(),
  nextCheckInAt: z.string(),
  promiseNote: z.string().default(""),
  gratitudeNote: z.string().default(""),
  memo: z.string().default(""),
  updatedAt: z.string(),
});

export const relationshipPersonFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요."),
  tier: relationshipTierSchema,
  contactCadenceDays: z.number().int().positive("체크인 주기를 입력해 주세요."),
  lastContactAt: z.string().min(1, "마지막 연락 날짜를 입력해 주세요."),
  promiseNote: z.string(),
  gratitudeNote: z.string(),
  memo: z.string(),
});

export const interactionLogSchema = z.object({
  id: z.string(),
  personId: z.string(),
  personName: z.string(),
  kind: z.enum(["call", "message", "meet", "gratitude", "promise"]),
  note: z.string(),
  happenedAt: z.string(),
  createdAt: z.string(),
});

export const interactionLogFormSchema = z.object({
  personId: z.string().min(1, "대상을 선택해 주세요."),
  personName: z.string().min(1),
  kind: z.enum(["call", "message", "meet", "gratitude", "promise"]),
  note: z.string().min(1, "기록 내용을 입력해 주세요."),
  happenedAt: z.string().min(1, "날짜를 입력해 주세요."),
});

export type RelationshipPerson = z.infer<typeof relationshipPersonSchema>;
export type RelationshipPersonFormValues = z.infer<
  typeof relationshipPersonFormSchema
>;
export type InteractionLog = z.infer<typeof interactionLogSchema>;
export type InteractionLogFormValues = z.infer<typeof interactionLogFormSchema>;
