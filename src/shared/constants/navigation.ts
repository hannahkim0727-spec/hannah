import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BookHeart,
  CircleDollarSign,
  Home,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

export type NavigationItem = {
  href: Route;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "오늘의 흐름과 핵심 요약",
    icon: Home,
  },
  {
    href: "/finance",
    label: "Finance",
    description: "예산, 지출, 자산 추적",
    icon: CircleDollarSign,
  },
  {
    href: "/relationships",
    label: "Relationships",
    description: "인연 관리와 체크인",
    icon: UsersRound,
  },
  {
    href: "/spiritual",
    label: "Spiritual",
    description: "기도, 설교, 통독 기록",
    icon: BookHeart,
  },
  {
    href: "/life",
    label: "Life",
    description: "비전, 일정, 생각 적립",
    icon: Sparkles,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "데이터 관리와 앱 환경",
    icon: Settings,
  },
];
