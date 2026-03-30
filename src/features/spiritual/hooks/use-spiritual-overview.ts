"use client";

import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import {
  ensureBibleBooks,
  getBibleProgress,
  listBibleBooks,
  listChurchVisits,
  listPrayerItems,
  listRetreatRecords,
  listSermonNotes,
  listWorshipSongs,
} from "@/features/spiritual/repositories/spiritual-repository";

export function useSpiritualOverview() {
  useEffect(() => {
    void ensureBibleBooks();
  }, []);

  const data = useLiveQuery(async () => {
    const [
      bibleProgress,
      bibleBooks,
      prayerItems,
      sermonNotes,
      worshipSongs,
      churchVisits,
      retreatRecords,
    ] =
      await Promise.all([
        getBibleProgress(),
        listBibleBooks(),
        listPrayerItems(),
        listSermonNotes(),
        listWorshipSongs(),
        listChurchVisits(),
        listRetreatRecords(),
      ]);

    return {
      bibleProgress,
      bibleBooks,
      prayerItems,
      sermonNotes,
      worshipSongs,
      churchVisits,
      retreatRecords,
    };
  }, []);

  return {
    bibleProgress: data?.bibleProgress,
    bibleBooks: data?.bibleBooks ?? [],
    prayerItems: data?.prayerItems ?? [],
    sermonNotes: data?.sermonNotes ?? [],
    worshipSongs: data?.worshipSongs ?? [],
    churchVisits: data?.churchVisits ?? [],
    retreatRecords: data?.retreatRecords ?? [],
  };
}
