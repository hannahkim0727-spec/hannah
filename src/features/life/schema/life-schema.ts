import { z } from "zod";

export const reflectionPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  mood: z.enum(["calm", "grateful", "challenged", "hopeful"]),
  createdAt: z.string(),
});

export const reflectionPostFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요."),
  body: z.string().min(1, "내용을 입력해 주세요."),
  mood: z.enum(["calm", "grateful", "challenged", "hopeful"]),
});

export const visionGoalSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  horizon: z.enum(["1year", "3year", "lifelong"]),
  progress: z.number().int().min(0).max(100),
  note: z.string().default(""),
  updatedAt: z.string(),
});

export const visionGoalFormSchema = z.object({
  title: z.string().min(1, "비전 항목을 입력해 주세요."),
  horizon: z.enum(["1year", "3year", "lifelong"]),
  progress: z.number().int().min(0).max(100),
  note: z.string(),
});

export const actionTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(["todo", "doing", "done"]),
  dueDate: z.string(),
  createdAt: z.string(),
});

export const actionTaskFormSchema = z.object({
  title: z.string().min(1, "할 일을 입력해 주세요."),
  status: z.enum(["todo", "doing", "done"]),
  dueDate: z.string().min(1, "기한을 입력해 주세요."),
});

export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: z.enum(["school", "church", "personal"]),
  date: z.string(),
  note: z.string().default(""),
  createdAt: z.string(),
});

export const calendarEventFormSchema = z.object({
  title: z.string().min(1, "일정 제목을 입력해 주세요."),
  category: z.enum(["school", "church", "personal"]),
  date: z.string().min(1, "날짜를 입력해 주세요."),
  note: z.string(),
});

export const thoughtNoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  createdAt: z.string(),
});

export const thoughtNoteFormSchema = z.object({
  content: z.string().min(1, "짧은 생각을 입력해 주세요."),
});

export const dormGuideItemSchema = z.object({
  id: z.string(),
  category: z.enum(["laundry", "shower", "quiet", "rule", "custom"]),
  title: z.string().min(1),
  detail: z.string().default(""),
  updatedAt: z.string(),
});

export const dormGuideItemFormSchema = z.object({
  category: z.enum(["laundry", "shower", "quiet", "rule", "custom"]),
  title: z.string().min(1, "가이드 제목을 입력해 주세요."),
  detail: z.string(),
});

export type ReflectionPost = z.infer<typeof reflectionPostSchema>;
export type ReflectionPostFormValues = z.infer<typeof reflectionPostFormSchema>;
export type VisionGoal = z.infer<typeof visionGoalSchema>;
export type VisionGoalFormValues = z.infer<typeof visionGoalFormSchema>;
export type ActionTask = z.infer<typeof actionTaskSchema>;
export type ActionTaskFormValues = z.infer<typeof actionTaskFormSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarEventFormValues = z.infer<typeof calendarEventFormSchema>;
export type ThoughtNote = z.infer<typeof thoughtNoteSchema>;
export type ThoughtNoteFormValues = z.infer<typeof thoughtNoteFormSchema>;
export type DormGuideItem = z.infer<typeof dormGuideItemSchema>;
export type DormGuideItemFormValues = z.infer<typeof dormGuideItemFormSchema>;
