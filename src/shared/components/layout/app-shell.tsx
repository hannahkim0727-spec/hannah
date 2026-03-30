"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { motion } from "motion/react";

import { navigationItems } from "@/shared/constants/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/cn";
import { formatTodayHeadline } from "@/shared/lib/format";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const desktopPlatform =
    typeof window !== "undefined" ? window.desktop?.platform : undefined;

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[var(--background)] to-[var(--accent-soft)] text-[color:var(--foreground)] font-sans">
      <div className="mx-auto flex h-full w-full max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col justify-between rounded-[32px] border border-[color:var(--border)] bg-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl px-6 py-8 lg:flex">
          <div className="space-y-8">
            <div className="space-y-3">
              <Badge className="border border-[color:var(--accent-strong)] bg-white/50 text-[color:var(--accent-strong)]">
                Local-first
              </Badge>
              <div className="space-y-2">
                <p className="font-display text-2xl font-bold tracking-[-0.02em] text-[color:var(--foreground)]">
                  Hannah&apos;s Room
                </p>
                <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                  삶의 네 가지 영역을 우아하고 따뜻하게 관리하는 개인 운영 체계
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map(({ href, label, description, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-start gap-4 rounded-[22px] px-4 py-3 transition-all duration-300",
                      isActive
                        ? "bg-[color:var(--surface)] text-[color:var(--accent-strong)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--foreground)]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 items-center justify-center rounded-[14px]",
                        isActive
                          ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                          : "bg-white text-[color:var(--muted-foreground)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="space-y-1">
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block text-xs leading-5 text-[color:var(--muted-foreground)] opacity-80">
                        {description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-[22px] bg-white/40 p-5 text-sm">
            <p className="font-semibold text-[color:var(--foreground)]">System Info</p>
            <p className="mt-2 text-[color:var(--muted-foreground)]">
              {desktopPlatform
                ? `${desktopPlatform} 모드 활성화`
                : "브라우저 미리보기"}
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden">
          <header className="shrink-0 rounded-[28px] border border-[color:var(--border)] bg-white/70 px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--accent-strong)] font-medium">
                  Have a lovely day
                </p>
                <h1 className="font-display mt-2 text-2xl font-bold tracking-[-0.02em] md:text-3xl">
                  {formatTodayHeadline()}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-white/50 text-[color:var(--muted-foreground)] border-[color:var(--border-strong)]">Secure</Badge>
                <div className="rounded-full border border-[color:var(--border)] bg-white/50 px-4 py-2 text-sm text-[color:var(--muted-foreground)] shadow-sm">
                  모든 데이터는 기기에 안전하게 보관돼요 🤍
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-10 pr-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
