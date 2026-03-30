"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInCalendarDays, startOfDay, startOfYear } from "date-fns";
import { BookOpenText, Church, Music4, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DAILY_VERSES } from "@/features/spiritual/constants/bible";
import { useSpiritualOverview } from "@/features/spiritual/hooks/use-spiritual-overview";
import {
  addPrayerItem,
  addSermonNote,
  addChurchVisit,
  addRetreatRecord,
  addWorshipSong,
  saveBibleProgress,
  toggleBibleBook,
  togglePrayerAnswered,
} from "@/features/spiritual/repositories/spiritual-repository";
import {
  bibleProgressFormSchema,
  churchVisitFormSchema,
  prayerItemFormSchema,
  retreatRecordFormSchema,
  sermonNoteFormSchema,
  worshipSongFormSchema,
  type BibleProgressFormValues,
  type ChurchVisitFormValues,
  type PrayerItemFormValues,
  type RetreatRecordFormValues,
  type SermonNoteFormValues,
  type WorshipSongFormValues,
} from "@/features/spiritual/schema/spiritual-schema";
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
import { formatDateLabel } from "@/shared/lib/format";

export function SpiritualOverview() {
  const {
    bibleBooks,
    bibleProgress,
    prayerItems,
    sermonNotes,
    worshipSongs,
    churchVisits,
    retreatRecords,
  } =
    useSpiritualOverview();
  const activePrayers = prayerItems.filter((item) => !item.answered).length;
  const completedBookCount = bibleBooks.filter((book) => book.completed).length;
  const verseIndex =
    differenceInCalendarDays(startOfDay(new Date()), startOfYear(new Date())) %
    DAILY_VERSES.length;
  const dailyVerse = DAILY_VERSES[verseIndex];

  const bibleForm = useForm<BibleProgressFormValues>({
    resolver: zodResolver(bibleProgressFormSchema),
    values: {
      completedBooks: completedBookCount,
      currentBook: bibleProgress?.currentBook ?? "",
    },
  });

  const prayerForm = useForm<PrayerItemFormValues>({
    resolver: zodResolver(prayerItemFormSchema),
    defaultValues: {
      title: "",
      category: "personal",
      detail: "",
    },
  });

  const sermonForm = useForm<SermonNoteFormValues>({
    resolver: zodResolver(sermonNoteFormSchema),
    defaultValues: {
      title: "",
      church: "진주 대광교회",
      preacher: "",
      preachedAt: new Date().toISOString().slice(0, 10),
      summary: "",
      takeaways: "",
    },
  });

  const worshipForm = useForm<WorshipSongFormValues>({
    resolver: zodResolver(worshipSongFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      url: "",
      note: "",
    },
  });

  const churchVisitForm = useForm<ChurchVisitFormValues>({
    resolver: zodResolver(churchVisitFormSchema),
    defaultValues: {
      churchName: "진주 대광교회",
      visitDate: new Date().toISOString().slice(0, 10),
      location: "",
      note: "",
    },
  });

  const retreatForm = useForm<RetreatRecordFormValues>({
    resolver: zodResolver(retreatRecordFormSchema),
    defaultValues: {
      title: "",
      period: "",
      highlight: "",
      takeaway: "",
    },
  });

  const onBibleSubmit = bibleForm.handleSubmit(async (values) => {
    await saveBibleProgress(values);
    toast.success("통독 진행률을 저장했습니다.");
  });

  const onPrayerSubmit = prayerForm.handleSubmit(async (values) => {
    await addPrayerItem(values);
    toast.success("기도 제목을 저장했습니다.");
    prayerForm.reset({
      title: "",
      category: values.category,
      detail: "",
    });
  });

  const onSermonSubmit = sermonForm.handleSubmit(async (values) => {
    await addSermonNote(values);
    toast.success("설교 기록을 저장했습니다.");
    sermonForm.reset({
      title: "",
      church: values.church,
      preacher: "",
      preachedAt: new Date().toISOString().slice(0, 10),
      summary: "",
      takeaways: "",
    });
  });

  const onWorshipSubmit = worshipForm.handleSubmit(async (values) => {
    await addWorshipSong(values);
    toast.success("찬양 링크를 저장했습니다.");
    worshipForm.reset({
      title: "",
      artist: "",
      url: "",
      note: "",
    });
  });

  const onChurchVisitSubmit = churchVisitForm.handleSubmit(async (values) => {
    await addChurchVisit(values);
    toast.success("교회 방문 기록을 저장했습니다.");
    churchVisitForm.reset({
      churchName: values.churchName,
      visitDate: new Date().toISOString().slice(0, 10),
      location: "",
      note: "",
    });
  });

  const onRetreatSubmit = retreatForm.handleSubmit(async (values) => {
    await addRetreatRecord(values);
    toast.success("수련회 기록을 저장했습니다.");
    retreatForm.reset({
      title: "",
      period: "",
      highlight: "",
      takeaway: "",
    });
  });

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Spiritual"
        title="기도, 말씀, 설교를 한 흐름으로 쌓아가는 영적 성소"
        description="매일의 말씀 흐름과 기도 제목, 설교 기록, 찬양 링크를 분리된 데이터로 저장합니다. 나중에 검색과 연대기 뷰를 붙이기 쉬운 구조입니다."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="통독 진행"
          value={`${completedBookCount}/66권`}
          hint={bibleProgress?.currentBook || "현재 읽는 권을 입력해 두세요"}
          icon={<BookOpenText className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="활성 기도 제목"
          value={`${activePrayers}개`}
          hint="응답 전 항목"
          icon={<Sparkles className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="설교 기록"
          value={`${sermonNotes.length}편`}
          hint="연대기 축적"
          icon={<Church className="size-4 text-[color:var(--accent)]" />}
        />
        <StatTile
          label="찬양 리스트"
          value={`${worshipSongs.length}곡`}
          hint="기도와 묵상 링크"
          icon={<Music4 className="size-4 text-[color:var(--accent)]" />}
        />
      </div>

      <Card className="overflow-hidden border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(32,52,43,0.98)_0%,rgba(28,39,63,0.95)_100%)] text-white">
        <CardContent className="grid gap-5 px-6 py-6 md:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-2">
            <Badge className="border-0 bg-white/12 text-white/80">Today&apos;s verse</Badge>
            <p className="font-display text-3xl font-semibold tracking-[-0.04em]">
              {dailyVerse.reference}
            </p>
          </div>
          <p className="text-lg leading-8 text-white/88">{dailyVerse.text}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Bible & Prayer</CardTitle>
            <CardDescription>
              통독 진행과 기도 제목을 가장 자주 기록하는 첫 번째 공간입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={onBibleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium">현재 읽는 권</span>
                <Input placeholder="예: 시편" {...bibleForm.register("currentBook")} />
              </label>
              <Button className="w-full" type="submit">
                통독 진행 저장
              </Button>
            </form>

            <div className="h-px bg-[color:var(--border)]" />

            <div className="space-y-3">
              <p className="text-sm font-medium">66권 통독표</p>
              <div className="grid gap-2 md:grid-cols-2">
                {bibleBooks.map((book) => (
                  <button
                    key={book.id}
                    className={`rounded-[16px] px-3 py-2 text-left text-sm transition ${
                      book.completed
                        ? "bg-[color:var(--accent)] text-white"
                        : "bg-white/70 text-[color:var(--foreground)]"
                    }`}
                    onClick={() => void toggleBibleBook(book.id, !book.completed)}
                    type="button"
                  >
                    {book.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-[color:var(--border)]" />

            <form className="space-y-4" onSubmit={onPrayerSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium">기도 제목</span>
                <Input placeholder="예: 마음의 중심을 지키기" {...prayerForm.register("title")} />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">카테고리</span>
                <select
                  className="flex h-12 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white/80 px-4 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring)]"
                  {...prayerForm.register("category")}
                >
                  <option value="personal">개인</option>
                  <option value="family">가정</option>
                  <option value="ministry">사역</option>
                  <option value="future">미래</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">상세 메모</span>
                <Textarea {...prayerForm.register("detail")} />
              </label>
              <Button className="w-full" type="submit">
                기도 제목 추가
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Prayer Garden</CardTitle>
            <CardDescription>
              응답 전 기도 제목과 최근 설교 흐름을 같이 보면서 영적 리듬을 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prayerItems.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
                아직 기도 제목이 없습니다. 자주 떠오르는 제목부터 넣어 두면 됩니다.
              </div>
            ) : (
              prayerItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.title}</p>
                        <Badge>{item.category}</Badge>
                        {item.answered ? (
                          <Badge className="border-0 bg-emerald-100 text-emerald-700">
                            응답됨
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                        {item.detail || "상세 메모 없음"}
                      </p>
                    </div>
                    <button
                      className="rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs"
                      onClick={() => void togglePrayerAnswered(item.id, !item.answered)}
                      type="button"
                    >
                      {item.answered ? "미응답으로" : "응답 체크"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Sermon Chronicle</CardTitle>
            <CardDescription>
              주일 설교와 수련회 메시지를 날짜 기준으로 쌓습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="grid gap-4" onSubmit={onSermonSubmit}>
              <Input placeholder="설교 제목" {...sermonForm.register("title")} />
              <div className="grid gap-4 md:grid-cols-3">
                <Input placeholder="교회" {...sermonForm.register("church")} />
                <Input placeholder="설교자" {...sermonForm.register("preacher")} />
                <Input type="date" {...sermonForm.register("preachedAt")} />
              </div>
              <Textarea placeholder="핵심 요약" {...sermonForm.register("summary")} />
              <Textarea placeholder="적용 포인트" {...sermonForm.register("takeaways")} />
              <Button className="w-full" type="submit">
                설교 기록 저장
              </Button>
            </form>

            <div className="space-y-3">
              {sermonNotes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  className="rounded-[20px] bg-white/70 px-4 py-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{note.title}</p>
                    <span className="text-[color:var(--muted-foreground)]">
                      {formatDateLabel(note.preachedAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-[color:var(--muted-foreground)]">
                    {note.church} · {note.preacher}
                  </p>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {note.summary || note.takeaways || "요약 없음"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Worship Playlist</CardTitle>
            <CardDescription>
              기도와 묵상에 자주 돌아가는 찬양 URL과 메모를 저장합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="grid gap-4" onSubmit={onWorshipSubmit}>
              <Input placeholder="찬양 제목" {...worshipForm.register("title")} />
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="아티스트" {...worshipForm.register("artist")} />
                <Input placeholder="URL" {...worshipForm.register("url")} />
              </div>
              <Textarea placeholder="메모" {...worshipForm.register("note")} />
              <Button className="w-full" type="submit">
                찬양 추가
              </Button>
            </form>

            <div className="space-y-3">
              {worshipSongs.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[color:var(--border-strong)] bg-white/60 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
                  아직 저장한 찬양이 없습니다.
                </div>
              ) : (
                worshipSongs.map((song) => (
                  <a
                    key={song.id}
                    className="block rounded-[20px] bg-white/70 px-4 py-4 text-sm transition hover:bg-white"
                    href={song.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{song.title}</p>
                      <span className="text-[color:var(--muted-foreground)]">
                        외부 열기
                      </span>
                    </div>
                    <p className="mt-2 text-[color:var(--muted-foreground)]">
                      {song.artist || "아티스트 미입력"}
                    </p>
                    <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                      {song.note || song.url}
                    </p>
                  </a>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Church Journal</CardTitle>
            <CardDescription>
              본교회와 방문 교회 기록을 날짜순으로 남깁니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="grid gap-4" onSubmit={onChurchVisitSubmit}>
              <Input placeholder="교회 이름" {...churchVisitForm.register("churchName")} />
              <div className="grid gap-4 md:grid-cols-2">
                <Input type="date" {...churchVisitForm.register("visitDate")} />
                <Input placeholder="지역" {...churchVisitForm.register("location")} />
              </div>
              <Textarea placeholder="방문 메모" {...churchVisitForm.register("note")} />
              <Button className="w-full" type="submit">
                교회 방문 저장
              </Button>
            </form>

            <div className="space-y-3">
              {churchVisits.map((visit) => (
                <div key={visit.id} className="rounded-[20px] bg-white/70 px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{visit.churchName}</p>
                    <span className="text-[color:var(--muted-foreground)]">
                      {formatDateLabel(visit.visitDate)}
                    </span>
                  </div>
                  <p className="mt-2 text-[color:var(--muted-foreground)]">
                    {visit.location || "지역 미입력"}
                  </p>
                  {visit.note ? (
                    <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                      {visit.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Retreat Chronicle</CardTitle>
            <CardDescription>
              수련회에서 받은 은혜와 적용 포인트를 따로 남깁니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="grid gap-4" onSubmit={onRetreatSubmit}>
              <Input placeholder="수련회 이름" {...retreatForm.register("title")} />
              <Input placeholder="기간" {...retreatForm.register("period")} />
              <Textarea placeholder="강하게 남은 장면" {...retreatForm.register("highlight")} />
              <Textarea placeholder="적용 포인트" {...retreatForm.register("takeaway")} />
              <Button className="w-full" type="submit">
                수련회 기록 저장
              </Button>
            </form>

            <div className="space-y-3">
              {retreatRecords.map((record) => (
                <div key={record.id} className="rounded-[20px] bg-white/70 px-4 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{record.title}</p>
                    <Badge>{record.period}</Badge>
                  </div>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {record.highlight || "기록 없음"}
                  </p>
                  <p className="mt-3 leading-6 text-[color:var(--muted-foreground)]">
                    {record.takeaway || "적용 포인트 없음"}
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
