"use client";

import { appDb } from "@/db/client/app-db";
import type {
  ActionTask,
  ActionTaskFormValues,
  CalendarEvent,
  CalendarEventFormValues,
  DormGuideItem,
  DormGuideItemFormValues,
  ReflectionPost,
  ReflectionPostFormValues,
  ThoughtNote,
  ThoughtNoteFormValues,
  VisionGoal,
  VisionGoalFormValues,
} from "@/features/life/schema/life-schema";

export async function addReflectionPost(values: ReflectionPostFormValues) {
  const nextPost: ReflectionPost = {
    id: crypto.randomUUID(),
    title: values.title,
    body: values.body,
    mood: values.mood,
    createdAt: new Date().toISOString(),
  };

  await appDb.reflectionPosts.add(nextPost);
  return nextPost;
}

export async function listReflectionPosts() {
  return appDb.reflectionPosts.orderBy("createdAt").reverse().toArray();
}

export async function addVisionGoal(values: VisionGoalFormValues) {
  const nextGoal: VisionGoal = {
    id: crypto.randomUUID(),
    title: values.title,
    horizon: values.horizon,
    progress: values.progress,
    note: values.note,
    updatedAt: new Date().toISOString(),
  };

  await appDb.visionGoals.add(nextGoal);
  return nextGoal;
}

export async function listVisionGoals() {
  return appDb.visionGoals.orderBy("updatedAt").reverse().toArray();
}

export async function addActionTask(values: ActionTaskFormValues) {
  const nextTask: ActionTask = {
    id: crypto.randomUUID(),
    title: values.title,
    status: values.status,
    dueDate: values.dueDate,
    createdAt: new Date().toISOString(),
  };

  await appDb.actionTasks.add(nextTask);
  return nextTask;
}

export async function toggleActionTaskStatus(id: string, status: ActionTask["status"]) {
  await appDb.actionTasks.update(id, {
    status,
  });
}

export async function listActionTasks() {
  return appDb.actionTasks.orderBy("dueDate").toArray();
}

export async function addCalendarEvent(values: CalendarEventFormValues) {
  const nextEvent: CalendarEvent = {
    id: crypto.randomUUID(),
    title: values.title,
    category: values.category,
    date: values.date,
    note: values.note,
    createdAt: new Date().toISOString(),
  };

  await appDb.calendarEvents.add(nextEvent);
  return nextEvent;
}

export async function listCalendarEvents() {
  return appDb.calendarEvents.orderBy("date").toArray();
}

export async function addThoughtNote(values: ThoughtNoteFormValues) {
  const nextThoughtNote: ThoughtNote = {
    id: crypto.randomUUID(),
    content: values.content,
    createdAt: new Date().toISOString(),
  };

  await appDb.thoughtNotes.add(nextThoughtNote);
  return nextThoughtNote;
}

export async function listThoughtNotes() {
  return appDb.thoughtNotes.orderBy("createdAt").reverse().toArray();
}

export async function addDormGuideItem(values: DormGuideItemFormValues) {
  const nextItem: DormGuideItem = {
    id: crypto.randomUUID(),
    category: values.category,
    title: values.title,
    detail: values.detail,
    updatedAt: new Date().toISOString(),
  };

  await appDb.dormGuideItems.add(nextItem);
  return nextItem;
}

export async function listDormGuideItems() {
  return appDb.dormGuideItems.orderBy("updatedAt").reverse().toArray();
}
