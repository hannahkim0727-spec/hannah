"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HeartHandshake, MessagesSquare, TimerReset, UsersRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  addInteractionLog,
  addRelationshipPerson,
} from "@/features/relationships/repositories/relationships-repository";
import {
  interactionLogFormSchema,
  relationshipPersonFormSchema,
  type InteractionLogFormValues,
  type RelationshipPersonFormValues,
} from "@/features/relationships/schema/relationships-schema";
import { useRelationshipsOverview } from "@/features/relationships/hooks/use-relationships-overview";
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

const tierLabels = {
  core: "0순위",
  close: "1순위",
  warm: "2순위",
  friendly: "3순위",
} as const;

const interactionLabels = {
  call: "통화",
  message: "메시지",
  meet: "만남",
  gratitude: "감사",
  promise: "약속",
} as const;

export function RelationshipsOverview() {
  const { people, duePeople, interactionLogs } = useRelationshipsOverview();
  const corePeople = people.filter((person) => person.tier === "core").length;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RelationshipPersonFormValues>({
    resolver: zodResolver(relationshipPersonFormSchema),
    defaultValues: {
      name: "",
      tier: "close",
      contactCadenceDays: 14,
      lastContactAt: new Date().toISOString().slice(0, 10),
      promiseNote: "",
      gratitudeNote: "",
      memo: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await addRelationshipPerson(values);
    toast.success("인연 기록을 저장했습니다.");
    reset({
      name: "",
      tier: values.tier,
      contactCadenceDays: values.contactCadenceDays,
      lastContactAt: new Date().toISOString().slice(0, 10),
      promiseNote: "",
      gratitudeNote: "",
      memo: "",
    });
  });

  const interactionForm = useForm<InteractionLogFormValues>({
    resolver: zodResolver(interactionLogFormSchema),
    defaultValues: {
      personId: "",
      personName: "",
      kind: "message",
      note: "",
      happenedAt: new Date().toISOString().slice(0, 10),
    },
  });
  const interactionPersonField = interactionForm.register("personId");

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Relationships"
        title="소중한 사람과의 리듬을 기록하고 잊지 않기"
        description="관계 티어, 마지막 연락일, 체크인 주기, 지키고 싶은 약속을 한 번에 저장합니다. 다음 연락 시점이 자동으로 계산됩니다."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          label="등록한 인연"
          value={`${people.length}명`}
          hint="관계 데이터베이스"
          icon={<UsersRound className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="체크인 필요"
          value={`${duePeople.length}명`}
          hint="예정일이 지난 인연"
          icon={<TimerReset className="size-4 text-[color:var(--accent)]" />}
          emphasis
        />
        <StatTile
          label="내 편 티어"
          value={`${corePeople}명`}
          hint="0순위 관계"
          icon={<HeartHandshake className="size-4 text-[color:var(--accent)]" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Relationship Capture</CardTitle>
            <CardDescription>
              티어와 연락 주기를 넣어두면 다음 체크인 시점을 자동 계산합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium">이름</span>
                <Input placeholder="예: 김OO" {...register("name")} />
                {errors.name ? (
                  <p className="text-sm text-rose-600">{errors.name.message}</p>
                ) : null}
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">관계 티어</span>
                  <select
                    className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                    {...register("tier")}
                  >
                    {Object.entries(tierLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">체크인 주기(일)</span>
                  <Input
                    type="number"
                    {...register("contactCadenceDays", { valueAsNumber: true })}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium">마지막 연락일</span>
                <Input type="date" {...register("lastContactAt")} />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">지킬 약속</span>
                <Textarea
                  placeholder="다음에 꼭 챙기고 싶은 약속이나 기억 포인트"
                  {...register("promiseNote")}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">고마운 점</span>
                <Textarea
                  placeholder="최근에 감사했던 순간"
                  {...register("gratitudeNote")}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">메모</span>
                <Textarea placeholder="관계 메모" {...register("memo")} />
              </label>

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "저장 중..." : "인연 추가"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Check-in Board</CardTitle>
            <CardDescription>
              누구에게 먼저 연락해야 하는지, 어떤 감정과 약속이 남아 있는지
              바로 보입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {people.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
                아직 등록된 인연이 없습니다. 첫 사람을 추가하면 체크인 보드가
                채워집니다.
              </div>
            ) : (
              <div className="space-y-4">
                {people.map((person) => {
                  const isDue = duePeople.some((duePerson) => duePerson.id === person.id);

                  return (
                    <div
                      key={person.id}
                      className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{person.name}</p>
                            <Badge>{tierLabels[person.tier]}</Badge>
                            {isDue ? (
                              <Badge className="border-0 bg-amber-100 text-amber-800">
                                연락 필요
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                            마지막 연락 {formatRelativeDate(person.lastContactAt)} / 다음 체크인{" "}
                            {formatDateLabel(person.nextCheckInAt)}
                          </p>
                        </div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">
                          {person.contactCadenceDays}일 주기
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-[18px] bg-[color:var(--surface)] px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]">
                          <span className="font-medium text-[color:var(--foreground)]">
                            약속
                          </span>
                          <p className="mt-1">{person.promiseNote || "아직 기록 없음"}</p>
                        </div>
                        <div className="rounded-[18px] bg-[color:var(--surface)] px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]">
                          <span className="font-medium text-[color:var(--foreground)]">
                            감사
                          </span>
                          <p className="mt-1">{person.gratitudeNote || "아직 기록 없음"}</p>
                        </div>
                      </div>

                      {person.memo ? (
                        <p className="mt-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
                          {person.memo}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="size-4 text-[color:var(--accent)]" />
              Interaction Log
            </CardTitle>
            <CardDescription>
              통화, 메시지, 만남, 감사, 약속을 따로 기록해 관계 레벨업 흐름을 남깁니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={interactionForm.handleSubmit(async (values) => {
                await addInteractionLog(values);
                toast.success("상호작용 로그를 저장했습니다.");
                interactionForm.reset({
                  personId: values.personId,
                  personName: values.personName,
                  kind: values.kind,
                  note: "",
                  happenedAt: new Date().toISOString().slice(0, 10),
                });
              })}
            >
              <label className="block space-y-2">
                <span className="text-sm font-medium">대상</span>
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...interactionPersonField}
                  onChange={(event) => {
                    interactionPersonField.onChange(event);
                    const selected = people.find(
                      (person) => person.id === event.target.value,
                    );

                    interactionForm.setValue("personName", selected?.name ?? "");
                  }}
                >
                  <option value="">인연 선택</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...interactionForm.register("kind")}
                >
                  {Object.entries(interactionLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Input type="date" {...interactionForm.register("happenedAt")} />
              </div>

              <Textarea
                placeholder="이번 상호작용에서 남기고 싶은 기록"
                {...interactionForm.register("note")}
              />

              <Button className="w-full" type="submit">
                로그 추가
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Interaction Timeline</CardTitle>
            <CardDescription>
              최근 관계 상호작용을 시간순으로 훑어보며 관계 온도를 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {interactionLogs.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
                아직 기록된 상호작용이 없습니다.
              </div>
            ) : (
              interactionLogs.map((log) => (
                <div key={log.id} className="rounded-[20px] bg-white/70 px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{log.personName}</p>
                      <Badge>{interactionLabels[log.kind]}</Badge>
                    </div>
                    <span className="text-[color:var(--muted-foreground)]">
                      {formatDateLabel(log.happenedAt)}
                    </span>
                  </div>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {log.note}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
