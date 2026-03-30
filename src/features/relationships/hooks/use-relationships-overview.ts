"use client";

import { isBefore, startOfToday } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";

import {
  listInteractionLogs,
  listRelationshipPeople,
} from "@/features/relationships/repositories/relationships-repository";

export function useRelationshipsOverview() {
  const data = useLiveQuery(async () => {
    const [people, interactionLogs] = await Promise.all([
      listRelationshipPeople(),
      listInteractionLogs(),
    ]);
    const today = startOfToday();
    const duePeople = people.filter((person) =>
      isBefore(new Date(person.nextCheckInAt), today),
    );

    return {
      people,
      duePeople,
      interactionLogs,
    };
  }, []);

  return {
    people: data?.people ?? [],
    duePeople: data?.duePeople ?? [],
    interactionLogs: data?.interactionLogs ?? [],
  };
}
