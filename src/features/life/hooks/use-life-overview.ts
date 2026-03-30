"use client";

import { isAfter, startOfToday } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

import {
  listActionTasks,
  listCalendarEvents,
  listDormGuideItems,
  listReflectionPosts,
  listThoughtNotes,
  listVisionGoals,
} from "@/features/life/repositories/life-repository";

export function useLifeOverview() {
  const data = useLiveQuery(async () => {
    const [
      reflectionPosts,
      visionGoals,
      actionTasks,
      calendarEvents,
      thoughtNotes,
      dormGuideItems,
    ] = await Promise.all([
      listReflectionPosts(),
      listVisionGoals(),
      listActionTasks(),
      listCalendarEvents(),
      listThoughtNotes(),
      listDormGuideItems(),
    ]);

    const upcomingEvents = calendarEvents.filter((event) =>
      isAfter(new Date(event.date), startOfToday()),
    );

    return {
      reflectionPosts,
      visionGoals,
      actionTasks,
      calendarEvents,
      thoughtNotes,
      dormGuideItems,
      upcomingEvents,
    };
  }, []);

  return {
    reflectionPosts: data?.reflectionPosts ?? [],
    visionGoals: data?.visionGoals ?? [],
    actionTasks: data?.actionTasks ?? [],
    calendarEvents: data?.calendarEvents ?? [],
    thoughtNotes: data?.thoughtNotes ?? [],
    dormGuideItems: data?.dormGuideItems ?? [],
    upcomingEvents: data?.upcomingEvents ?? [],
  };
}
