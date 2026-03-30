"use client";

import { useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  clearAllData,
  exportBackupPayload,
  importBackupPayload,
} from "@/db/client/backup-repository";
import { appDb } from "@/db/client/app-db";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatTile } from "@/shared/components/ui/stat-tile";

export function SettingsOverview() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const counts = useLiveQuery(async () => {
    const [
      finance,
      relationships,
      prayerItems,
      sermons,
      reflections,
      tasks,
    ] = await Promise.all([
      appDb.expenseEntries.count(),
      appDb.relationshipPeople.count(),
      appDb.prayerItems.count(),
      appDb.sermonNotes.count(),
      appDb.reflectionPosts.count(),
      appDb.actionTasks.count(),
    ]);

    return { finance, relationships, prayerItems, sermons, reflections, tasks };
  }, []);

  async function handleExport() {
    const payload = await exportBackupPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `youth-leader-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("백업 파일을 내보냈습니다.");
  }

  async function handleImport(file: File) {
    const text = await file.text();
    await importBackupPayload(JSON.parse(text));
    toast.success("백업을 불러왔습니다.");
  }

  async function handleClear() {
    if (!window.confirm("모든 로컬 데이터를 삭제할까요?")) {
      return;
    }

    await clearAllData();
    toast.success("로컬 데이터를 모두 삭제했습니다.");
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="백업, 복구, 정리 작업을 한 곳에서 관리"
        description="현재 앱은 local-first 구조입니다. 따라서 백업 JSON을 자주 만들어 두는 것이 가장 안전합니다."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatTile label="지출 기록" value={`${counts?.finance ?? 0}건`} />
        <StatTile label="인연 데이터" value={`${counts?.relationships ?? 0}명`} />
        <StatTile
          label="영적/일상 기록"
          value={`${(counts?.prayerItems ?? 0) + (counts?.sermons ?? 0) + (counts?.reflections ?? 0) + (counts?.tasks ?? 0)}건`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Export Backup</CardTitle>
            <CardDescription>
              현재 로컬 데이터를 JSON으로 내려받습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => void handleExport()}>
              <Download className="size-4" />
              백업 내보내기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Backup</CardTitle>
            <CardDescription>
              기존 데이터를 지우고 백업 JSON으로 교체합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                void handleImport(file);
                event.currentTarget.value = "";
              }}
              type="file"
            />
            <Button
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
            >
              <Upload className="size-4" />
              백업 불러오기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Local Data</CardTitle>
            <CardDescription>
              테스트 후 초기화가 필요할 때만 사용합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => void handleClear()} variant="ghost">
              <Trash2 className="size-4" />
              로컬 데이터 삭제
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
