"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";

import type { CalendarEvent } from "@/features/life/schema/life-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/cn";

type MonthCalendarProps = {
  events: CalendarEvent[];
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthCalendar({ events }: MonthCalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(today, "yyyy년 M월", { locale: ko })} 캘린더</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const dayEvents = events.filter((event) =>
              isSameDay(new Date(event.date), day),
            );

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-28 rounded-[18px] border px-2 py-2",
                  isSameMonth(day, today)
                    ? "border-[color:var(--border)] bg-white/72"
                    : "border-transparent bg-white/30 text-[color:var(--muted-foreground)]",
                )}
              >
                <div
                  className={cn(
                    "mb-2 flex size-7 items-center justify-center rounded-full text-sm",
                    isSameDay(day, today) ? "bg-[color:var(--accent)] text-white" : "",
                  )}
                >
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="truncate rounded-full bg-[color:var(--surface)] px-2 py-1 text-[10px]"
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 ? (
                    <div className="text-[10px] text-[color:var(--muted-foreground)]">
                      +{dayEvents.length - 3} more
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
