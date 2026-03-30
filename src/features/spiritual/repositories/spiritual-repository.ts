"use client";

import { appDb } from "@/db/client/app-db";
import { BIBLE_BOOKS } from "@/features/spiritual/constants/bible";
import type {
  BibleBook,
  BibleProgress,
  BibleProgressFormValues,
  ChurchVisit,
  ChurchVisitFormValues,
  PrayerItem,
  PrayerItemFormValues,
  RetreatRecord,
  RetreatRecordFormValues,
  SermonNote,
  SermonNoteFormValues,
  WorshipSong,
  WorshipSongFormValues,
} from "@/features/spiritual/schema/spiritual-schema";

const BIBLE_PROGRESS_ID = "default-bible-progress";

export async function getBibleProgress() {
  return appDb.bibleProgress.get(BIBLE_PROGRESS_ID);
}

export async function ensureBibleBooks() {
  const count = await appDb.bibleBooks.count();

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const initialBooks: BibleBook[] = BIBLE_BOOKS.map(([id, name, testament]) => ({
    id,
    name,
    testament,
    completed: false,
    updatedAt: now,
  }));

  await appDb.bibleBooks.bulkAdd(initialBooks);
}

export async function saveBibleProgress(values: BibleProgressFormValues) {
  const nextProgress: BibleProgress = {
    id: BIBLE_PROGRESS_ID,
    completedBooks: values.completedBooks,
    currentBook: values.currentBook,
    updatedAt: new Date().toISOString(),
  };

  await appDb.bibleProgress.put(nextProgress);

  return nextProgress;
}

export async function addPrayerItem(values: PrayerItemFormValues) {
  const nextPrayerItem: PrayerItem = {
    id: crypto.randomUUID(),
    title: values.title,
    category: values.category,
    detail: values.detail,
    answered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await appDb.prayerItems.add(nextPrayerItem);
  return nextPrayerItem;
}

export async function togglePrayerAnswered(id: string, answered: boolean) {
  await appDb.prayerItems.update(id, {
    answered,
    updatedAt: new Date().toISOString(),
  });
}

export async function listPrayerItems() {
  return appDb.prayerItems.orderBy("updatedAt").reverse().toArray();
}

export async function addSermonNote(values: SermonNoteFormValues) {
  const nextSermon: SermonNote = {
    id: crypto.randomUUID(),
    title: values.title,
    church: values.church,
    preacher: values.preacher,
    preachedAt: values.preachedAt,
    summary: values.summary,
    takeaways: values.takeaways,
    createdAt: new Date().toISOString(),
  };

  await appDb.sermonNotes.add(nextSermon);
  return nextSermon;
}

export async function listSermonNotes() {
  return appDb.sermonNotes.orderBy("preachedAt").reverse().toArray();
}

export async function addWorshipSong(values: WorshipSongFormValues) {
  const nextSong: WorshipSong = {
    id: crypto.randomUUID(),
    title: values.title,
    artist: values.artist,
    url: values.url,
    note: values.note,
    createdAt: new Date().toISOString(),
  };

  await appDb.worshipSongs.add(nextSong);
  return nextSong;
}

export async function listWorshipSongs() {
  return appDb.worshipSongs.orderBy("createdAt").reverse().toArray();
}

export async function listBibleBooks() {
  return appDb.bibleBooks.toArray();
}

export async function toggleBibleBook(id: string, completed: boolean) {
  await appDb.bibleBooks.update(id, {
    completed,
    updatedAt: new Date().toISOString(),
  });

  const books = await appDb.bibleBooks.toArray();
  const completedBooks = books.filter((book) => book.completed).length;
  const currentProgress = await appDb.bibleProgress.get(BIBLE_PROGRESS_ID);

  await appDb.bibleProgress.put({
    id: BIBLE_PROGRESS_ID,
    completedBooks,
    currentBook: currentProgress?.currentBook ?? "",
    updatedAt: new Date().toISOString(),
  });
}

export async function addChurchVisit(values: ChurchVisitFormValues) {
  const nextVisit: ChurchVisit = {
    id: crypto.randomUUID(),
    churchName: values.churchName,
    visitDate: values.visitDate,
    location: values.location,
    note: values.note,
    createdAt: new Date().toISOString(),
  };

  await appDb.churchVisits.add(nextVisit);
  return nextVisit;
}

export async function listChurchVisits() {
  return appDb.churchVisits.orderBy("visitDate").reverse().toArray();
}

export async function addRetreatRecord(values: RetreatRecordFormValues) {
  const nextRecord: RetreatRecord = {
    id: crypto.randomUUID(),
    title: values.title,
    period: values.period,
    highlight: values.highlight,
    takeaway: values.takeaway,
    createdAt: new Date().toISOString(),
  };

  await appDb.retreatRecords.add(nextRecord);
  return nextRecord;
}

export async function listRetreatRecords() {
  return appDb.retreatRecords.orderBy("createdAt").reverse().toArray();
}
