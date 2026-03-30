import { z } from "zod";

export const prayerItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: z.enum(["personal", "family", "ministry", "future"]),
  detail: z.string().default(""),
  answered: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const prayerItemFormSchema = z.object({
  title: z.string().min(1, "기도 제목을 입력해 주세요."),
  category: z.enum(["personal", "family", "ministry", "future"]),
  detail: z.string(),
});

export const sermonNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  church: z.string().min(1),
  preacher: z.string().min(1),
  preachedAt: z.string(),
  summary: z.string().default(""),
  takeaways: z.string().default(""),
  createdAt: z.string(),
});

export const sermonNoteFormSchema = z.object({
  title: z.string().min(1, "설교 제목을 입력해 주세요."),
  church: z.string().min(1, "교회 이름을 입력해 주세요."),
  preacher: z.string().min(1, "설교자를 입력해 주세요."),
  preachedAt: z.string().min(1, "날짜를 입력해 주세요."),
  summary: z.string(),
  takeaways: z.string(),
});

export const worshipSongSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  artist: z.string().default(""),
  url: z.url(),
  note: z.string().default(""),
  createdAt: z.string(),
});

export const worshipSongFormSchema = z.object({
  title: z.string().min(1, "찬양 제목을 입력해 주세요."),
  artist: z.string(),
  url: z.string().url("올바른 URL을 입력해 주세요."),
  note: z.string(),
});

export const bibleProgressSchema = z.object({
  id: z.string(),
  completedBooks: z.number().int().min(0).max(66),
  currentBook: z.string().default(""),
  updatedAt: z.string(),
});

export const bibleProgressFormSchema = z.object({
  completedBooks: z.number().int().min(0).max(66),
  currentBook: z.string(),
});

export const bibleBookSchema = z.object({
  id: z.string(),
  name: z.string(),
  testament: z.enum(["old", "new"]),
  completed: z.boolean(),
  updatedAt: z.string(),
});

export const churchVisitSchema = z.object({
  id: z.string(),
  churchName: z.string().min(1),
  visitDate: z.string(),
  location: z.string(),
  note: z.string().default(""),
  createdAt: z.string(),
});

export const churchVisitFormSchema = z.object({
  churchName: z.string().min(1, "교회 이름을 입력해 주세요."),
  visitDate: z.string().min(1, "방문 날짜를 입력해 주세요."),
  location: z.string(),
  note: z.string(),
});

export const retreatRecordSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  period: z.string(),
  highlight: z.string().default(""),
  takeaway: z.string().default(""),
  createdAt: z.string(),
});

export const retreatRecordFormSchema = z.object({
  title: z.string().min(1, "수련회 이름을 입력해 주세요."),
  period: z.string().min(1, "기간을 입력해 주세요."),
  highlight: z.string(),
  takeaway: z.string(),
});

export type PrayerItem = z.infer<typeof prayerItemSchema>;
export type PrayerItemFormValues = z.infer<typeof prayerItemFormSchema>;
export type SermonNote = z.infer<typeof sermonNoteSchema>;
export type SermonNoteFormValues = z.infer<typeof sermonNoteFormSchema>;
export type WorshipSong = z.infer<typeof worshipSongSchema>;
export type WorshipSongFormValues = z.infer<typeof worshipSongFormSchema>;
export type BibleProgress = z.infer<typeof bibleProgressSchema>;
export type BibleProgressFormValues = z.infer<typeof bibleProgressFormSchema>;
export type BibleBook = z.infer<typeof bibleBookSchema>;
export type ChurchVisit = z.infer<typeof churchVisitSchema>;
export type ChurchVisitFormValues = z.infer<typeof churchVisitFormSchema>;
export type RetreatRecord = z.infer<typeof retreatRecordSchema>;
export type RetreatRecordFormValues = z.infer<typeof retreatRecordFormSchema>;
