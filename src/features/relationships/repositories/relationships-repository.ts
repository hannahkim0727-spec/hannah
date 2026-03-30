"use client";

import { addDays } from "date-fns";

import { appDb } from "@/db/client/app-db";
import type {
  InteractionLog,
  InteractionLogFormValues,
  RelationshipPerson,
  RelationshipPersonFormValues,
} from "@/features/relationships/schema/relationships-schema";

export async function addRelationshipPerson(values: RelationshipPersonFormValues) {
  const lastContact = new Date(values.lastContactAt);

  const nextPerson: RelationshipPerson = {
    id: crypto.randomUUID(),
    name: values.name,
    tier: values.tier,
    contactCadenceDays: values.contactCadenceDays,
    lastContactAt: values.lastContactAt,
    nextCheckInAt: addDays(lastContact, values.contactCadenceDays).toISOString(),
    promiseNote: values.promiseNote,
    gratitudeNote: values.gratitudeNote,
    memo: values.memo,
    updatedAt: new Date().toISOString(),
  };

  await appDb.relationshipPeople.add(nextPerson);

  return nextPerson;
}

export async function listRelationshipPeople() {
  return appDb.relationshipPeople.orderBy("nextCheckInAt").toArray();
}

export async function addInteractionLog(values: InteractionLogFormValues) {
  const nextLog: InteractionLog = {
    id: crypto.randomUUID(),
    personId: values.personId,
    personName: values.personName,
    kind: values.kind,
    note: values.note,
    happenedAt: values.happenedAt,
    createdAt: new Date().toISOString(),
  };

  await appDb.relationshipInteractionLogs.add(nextLog);

  const person = await appDb.relationshipPeople.get(values.personId);

  if (person) {
    await appDb.relationshipPeople.update(values.personId, {
      lastContactAt: values.happenedAt,
      nextCheckInAt: addDays(
        new Date(values.happenedAt),
        person.contactCadenceDays,
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return nextLog;
}

export async function listInteractionLogs() {
  return appDb.relationshipInteractionLogs.orderBy("happenedAt").reverse().toArray();
}
