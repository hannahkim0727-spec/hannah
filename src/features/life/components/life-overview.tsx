"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, CheckCheck, NotebookPen, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useLifeOverview } from "@/features/life/hooks/use-life-overview";
import {
  addActionTask,
  addCalendarEvent,
  addDormGuideItem,
  addReflectionPost,
  addThoughtNote,
  addVisionGoal,
  toggleActionTaskStatus,
} from "@/features/life/repositories/life-repository";
import {
  actionTaskFormSchema,
  calendarEventFormSchema,
  dormGuideItemFormSchema,
  reflectionPostFormSchema,
  thoughtNoteFormSchema,
  visionGoalFormSchema,
  type ActionTaskFormValues,
  type CalendarEventFormValues,
  type DormGuideItemFormValues,
  type ReflectionPostFormValues,
  type ThoughtNoteFormValues,
  type VisionGoalFormValues,
} from "@/features/life/schema/life-schema";
import { MonthCalendar } from "@/features/life/components/month-calendar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatTile } from "@/shared/components/ui/stat-tile";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatDateLabel, formatRelativeDate } from "@/shared/lib/format";

const taskStatusLabels = {
  todo: "할 일",
  doing: "진행 중",
  done: "완료",
} as const;

export function LifeOverview() {
  const {
    reflectionPosts,
    visionGoals,
    actionTasks,
    calendarEvents,
    thoughtNotes,
    dormGuideItems,
    upcomingEvents,
  } = useLifeOverview();

  const todoCount = actionTasks.filter((task) => task.status !== "done").length;
  const averageProgress =
    visionGoals.length === 0
      ? 0
      : visionGoals.reduce((sum, goal) => sum + goal.progress, 0) / visionGoals.length;

  const taskForm = useForm<ActionTaskFormValues>({
    resolver: zodResolver(actionTaskFormSchema),
    defaultValues: {
      title: "",
      status: "todo",
      dueDate: new Date().toISOString().slice(0, 10),
    },
  });

  const eventForm = useForm<CalendarEventFormValues>({
    resolver: zodResolver(calendarEventFormSchema),
    defaultValues: {
      title: "",
      category: "school",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const visionForm = useForm<VisionGoalFormValues>({
    resolver: zodResolver(visionGoalFormSchema),
    defaultValues: {
      title: "",
      horizon: "1year",
      progress: 0,
      note: "",
    },
  });

  const reflectionForm = useForm<ReflectionPostFormValues>({
    resolver: zodResolver(reflectionPostFormSchema),
    defaultValues: {
      title: "",
      body: "",
      mood: "calm",
    },
  });

  const thoughtForm = useForm<ThoughtNoteFormValues>({
    resolver: zodResolver(thoughtNoteFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const dormForm = useForm<DormGuideItemFormValues>({
    resolver: zodResolver(dormGuideItemFormSchema),
    defaultValues: {
      category: "rule",
      title: "",
      detail: "",
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Life"
        title="일상 기록과 장기 비전을 한데 묶는 운영 보드"
        description="Action checklist, 일정, 비전, 성찰 기록, 짧은 생각, 기숙사 생활 가이드를 각각 독립된 데이터로 저장합니다."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="남은 액션"
          value={`${todoCount}개`}
          hint="완료 전 할 일"
          icon={<CheckCheck className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="다가오는 일정"
          value={`${upcomingEvents.length}건`}
          hint="오늘 이후 일정"
          icon={<CalendarRange className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="비전 진행 평균"
          value={`${averageProgress.toFixed(0)}%`}
          hint="장기 목표 평균"
          icon={<Target className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="생각 적립"
          value={`${thoughtNotes.length}개`}
          hint="짧은 메모 축적"
          icon={<NotebookPen className="size-4 text-[color:var(--accent)]" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Action Checklist</CardTitle>
            <CardDescription>
              당장 실천할 행동을 일정과 함께 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-4"
              onSubmit={taskForm.handleSubmit(async (values) => {
                await addActionTask(values);
                toast.success("액션 아이템을 저장했습니다.");
                taskForm.reset({
                  title: "",
                  status: values.status,
                  dueDate: new Date().toISOString().slice(0, 10),
                });
              })}
            >
              <Input placeholder="예: 학생 상담 준비" {...taskForm.register("title")} />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...taskForm.register("status")}
                >
                  {Object.entries(taskStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Input type="date" {...taskForm.register("dueDate")} />
              </div>
              <Button className="w-full" type="submit">
                할 일 추가
              </Button>
            </form>

            <div className="space-y-3">
              {actionTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-[20px] bg-white/70 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-[color:var(--muted-foreground)]">
                      {formatDateLabel(task.dueDate)} · {taskStatusLabels[task.status]}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs"
                    onClick={() =>
                      void toggleActionTaskStatus(
                        task.id,
                        task.status === "todo"
                          ? "doing"
                          : task.status === "doing"
                            ? "done"
                            : "todo",
                      )
                    }
                    type="button"
                  >
                    상태 변경
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Flow</CardTitle>
            <CardDescription>
              학교 방문, 교회 일정, 개인 계획을 한 보드에서 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-4"
              onSubmit={eventForm.handleSubmit(async (values) => {
                await addCalendarEvent(values);
                toast.success("일정을 저장했습니다.");
                eventForm.reset({
                  title: "",
                  category: values.category,
                  date: new Date().toISOString().slice(0, 10),
                  note: "",
                });
              })}
            >
              <Input placeholder="예: 학교 방문" {...eventForm.register("title")} />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...eventForm.register("category")}
                >
                  <option value="school">학교</option>
                  <option value="church">교회</option>
                  <option value="personal">개인</option>
                </select>
                <Input type="date" {...eventForm.register("date")} />
              </div>
              <Textarea placeholder="메모" {...eventForm.register("note")} />
              <Button className="w-full" type="submit">
                일정 추가
              </Button>
            </form>

            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[20px] bg-white/70 px-4 py-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{event.title}</p>
                    <Badge>{event.category}</Badge>
                  </div>
                  <p className="mt-2 text-[color:var(--muted-foreground)]">
                    {formatDateLabel(event.date)}
                  </p>
                  {event.note ? (
                    <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                      {event.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <MonthCalendar events={calendarEvents} />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Future Vision</CardTitle>
            <CardDescription>장기 비전과 현실적 계획을 함께 저장합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-4"
              onSubmit={visionForm.handleSubmit(async (values) => {
                await addVisionGoal(values);
                toast.success("비전 항목을 저장했습니다.");
                visionForm.reset({
                  title: "",
                  horizon: values.horizon,
                  progress: 0,
                  note: "",
                });
              })}
            >
              <Input placeholder="예: 1년 안에 정착할 루틴" {...visionForm.register("title")} />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...visionForm.register("horizon")}
                >
                  <option value="1year">1년</option>
                  <option value="3year">3년</option>
                  <option value="lifelong">평생</option>
                </select>
                <Input
                  type="number"
                  {...visionForm.register("progress", { valueAsNumber: true })}
                />
              </div>
              <Textarea placeholder="비전 메모" {...visionForm.register("note")} />
              <Button className="w-full" type="submit">
                비전 저장
              </Button>
            </form>

            <div className="space-y-3">
              {visionGoals.map((goal) => (
                <div key={goal.id} className="rounded-[18px] bg-white/70 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{goal.title}</p>
                    <Badge>{goal.progress}%</Badge>
                  </div>
                  <p className="mt-2 text-[color:var(--muted-foreground)]">{goal.horizon}</p>
                  {goal.note ? (
                    <p className="mt-2 leading-6 text-[color:var(--muted-foreground)]">
                      {goal.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reflection & Thought</CardTitle>
            <CardDescription>블로그형 기록과 짧은 생각 메모를 분리해 쌓습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-4"
              onSubmit={reflectionForm.handleSubmit(async (values) => {
                await addReflectionPost(values);
                toast.success("성찰 기록을 저장했습니다.");
                reflectionForm.reset({
                  title: "",
                  body: "",
                  mood: values.mood,
                });
              })}
            >
              <Input placeholder="글 제목" {...reflectionForm.register("title")} />
              <select
                className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                {...reflectionForm.register("mood")}
              >
                <option value="calm">차분함</option>
                <option value="grateful">감사</option>
                <option value="challenged">도전</option>
                <option value="hopeful">소망</option>
              </select>
              <Textarea placeholder="성찰 내용" {...reflectionForm.register("body")} />
              <Button className="w-full" type="submit">
                성찰 저장
              </Button>
            </form>

            <form
              className="grid gap-4"
              onSubmit={thoughtForm.handleSubmit(async (values) => {
                await addThoughtNote(values);
                toast.success("짧은 생각을 저장했습니다.");
                thoughtForm.reset({ content: "" });
              })}
            >
              <Textarea placeholder="오늘 떠오른 짧은 생각" {...thoughtForm.register("content")} />
              <Button className="w-full" type="submit" variant="secondary">
                생각 적립
              </Button>
            </form>

            <div className="space-y-3">
              {reflectionPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="rounded-[18px] bg-white/70 px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{post.title}</p>
                    <Badge>{post.mood}</Badge>
                  </div>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {post.body}
                  </p>
                </div>
              ))}
              {thoughtNotes.slice(0, 3).map((note) => (
                <div key={note.id} className="rounded-[18px] bg-[color:var(--surface)] px-4 py-3 text-sm">
                  <p>{note.content}</p>
                  <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                    {formatRelativeDate(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dorm Guide</CardTitle>
            <CardDescription>
              생활 규칙과 반복 체크 포인트를 분리해서 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="grid gap-4"
              onSubmit={dormForm.handleSubmit(async (values) => {
                await addDormGuideItem(values);
                toast.success("생활 가이드를 저장했습니다.");
                dormForm.reset({
                  category: values.category,
                  title: "",
                  detail: "",
                });
              })}
            >
              <select
                className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                {...dormForm.register("category")}
              >
                <option value="laundry">빨래</option>
                <option value="shower">샤워</option>
                <option value="quiet">조용 시간</option>
                <option value="rule">규칙</option>
                <option value="custom">기타</option>
              </select>
              <Input placeholder="예: 주말 오전 빨래" {...dormForm.register("title")} />
              <Textarea placeholder="상세 규칙" {...dormForm.register("detail")} />
              <Button className="w-full" type="submit">
                가이드 추가
              </Button>
            </form>

            <div className="space-y-3">
              {dormGuideItems.map((item) => (
                <div key={item.id} className="rounded-[18px] bg-white/70 px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{item.title}</p>
                    <Badge>{item.category}</Badge>
                  </div>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {item.detail || "상세 설명 없음"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
