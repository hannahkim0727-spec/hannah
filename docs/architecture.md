# Youth Leader Dashboard Architecture

## 1. 제품 방향

이 프로젝트는 단순한 "예쁜 개인 대시보드"가 아니라, 청년 리더의 실제 생활 데이터를 로컬에서 지속적으로 관리하는 `local-first personal operating system`으로 잡는 것이 맞다.

핵심 원칙은 아래 4가지다.

1. `실사용 데이터`를 다룬다.
2. `빠른 입력`과 `한눈에 보는 요약`을 동시에 만족시킨다.
3. 기능이 늘어나도 `도메인별로 느슨하게 분리`된다.
4. 디자인은 감성적이되, 편집 UI는 `정보 밀도와 유지보수성`을 우선한다.

## 2. 권장 기술 스택

README의 방향을 유지하되, 실제 운영 가능한 수준으로 아래처럼 구체화한다.

- Framework: `Next.js 16 App Router`
- Language: `TypeScript`
- Styling: `Tailwind CSS v4`
- UI primitives: `shadcn/ui`
- Icons: `lucide-react`
- Animation: `motion`
- Forms: `react-hook-form` + `zod`
- Client persistence: `Dexie` + `IndexedDB`
- UI-only state: `zustand`
- Charts: `recharts`
- Date utilities: `date-fns`
- Notifications: `sonner`

### 왜 이렇게 가는가

- `IndexedDB`:
  로컬 스토리지만으로는 도메인이 많아질수록 직렬화, 버전 관리, 검색, 백업이 금방 불편해진다. 실제 데이터 저장소는 IndexedDB가 맞다.
- `Dexie`:
  브라우저 DB를 직접 다루는 복잡도를 줄이고, 테이블/쿼리/마이그레이션을 구조적으로 관리할 수 있다.
- `zustand`:
  영구 데이터 저장용이 아니라, 필터/선택 상태/패널 열림 여부 같은 UI 상태 전용으로만 사용한다.
- `shadcn/ui`:
  빠르게 고급 UI를 만들 수 있고, 컴포넌트 소스를 직접 소유하므로 장기 유지보수에 유리하다.
- `motion`:
  카드 재배치, 섹션 진입, 숫자 변화, 패널 전환 같은 의미 있는 애니메이션에만 제한적으로 사용한다.

## 3. 저장 전략

### 원칙

- `정본 데이터`는 IndexedDB에 저장한다.
- `UI 설정`만 localStorage에 저장한다.
- `백업/복구`는 JSON export/import로 제공한다.
- 모든 저장 데이터는 `zod` 스키마로 검증한다.

### 저장 계층 분리

- `repositories`:
  Dexie를 직접 호출하는 계층
- `services`:
  도메인 규칙과 계산 로직 계층
- `hooks`:
  화면에서 쓰는 조회/수정 훅 계층

즉, 컴포넌트가 Dexie를 직접 만지지 않게 한다.

## 4. 도메인 설계

README 기준 기능은 4개 도메인으로 나누는 것이 가장 자연스럽다.

### finance

- 계좌 잔액
- 주식/ETF 보유 자산
- 월 예산/목표 저축액
- 지출 기록
- 목적형 저축 목표

주요 엔티티:

- `AssetAccount`
- `PortfolioHolding`
- `BudgetPlan`
- `ExpenseEntry`
- `SavingsGoal`

### relationships

- 인연 티어
- 마지막 연락일
- 약속/감사 메모
- 정기 체크인 규칙

주요 엔티티:

- `RelationshipPerson`
- `InteractionLog`
- `PromiseNote`
- `GratitudeMemo`
- `CheckInRule`

### spiritual

- 성경 통독 진행
- 설교/수련회 기록
- 교회 방문 일지
- 찬양 링크
- 기도 제목과 응답 여부
- 오늘의 말씀 캐시

주요 엔티티:

- `BibleProgress`
- `SermonNote`
- `RetreatRecord`
- `ChurchVisit`
- `WorshipSong`
- `PrayerItem`
- `DailyVerse`

### life

- 블로그형 기록
- 미래 구상
- 액션 체크리스트
- 일정 관리
- 기숙사 생활 가이드
- 짧은 생각 메모

주요 엔티티:

- `ReflectionPost`
- `VisionGoal`
- `ActionTask`
- `CalendarEvent`
- `DormGuideItem`
- `ThoughtNote`

## 5. 추천 라우팅 구조

첫 버전은 기능을 너무 잘게 쪼개지 말고, 도메인 대시보드 중심으로 간다.

```text
app/
  (dashboard)/
    layout.tsx
    page.tsx
    finance/page.tsx
    relationships/page.tsx
    spiritual/page.tsx
    life/page.tsx
    settings/page.tsx
```

### 라우트 역할

- `/`
  오늘 해야 할 것, 최근 기록, 예산 진행률, 기도/관계 리마인더를 모아보는 홈
- `/finance`
  자산, 예산, 지출, 저축 목표
- `/relationships`
  인연 목록, 체크인 필요 인물, 메모
- `/spiritual`
  통독 진행, 설교 기록, 기도 제목, 찬양
- `/life`
  일상 기록, 비전, 캘린더, 체크리스트
- `/settings`
  백업/복구, 테마, 데이터 관리

## 6. 추천 폴더 구조

구현 복잡도를 고려하면 과한 아키텍처보다 `domain-first modular structure`가 적절하다.

```text
src/
  app/
  components/
    ui/
    layout/
    charts/
  lib/
    db/
    utils/
    constants/
    schemas/
  stores/
  features/
    finance/
      components/
      hooks/
      repositories/
      services/
      schemas/
      types/
    relationships/
      components/
      hooks/
      repositories/
      services/
      schemas/
      types/
    spiritual/
      components/
      hooks/
      repositories/
      services/
      schemas/
      types/
    life/
      components/
      hooks/
      repositories/
      services/
      schemas/
      types/
  styles/
```

### 분리 원칙

- `components/ui`:
  shadcn/ui 래퍼와 공용 프리미티브
- `components/layout`:
  사이드바, 헤더, 섹션 셸
- `features/<domain>/components`:
  해당 도메인 전용 카드, 리스트, 폼
- `features/<domain>/services`:
  계산과 도메인 규칙
- `features/<domain>/repositories`:
  IndexedDB 접근
- `stores`:
  전역 UI 상태만 보관

## 7. 렌더링 원칙

Next.js App Router를 쓰더라도, 이 프로젝트는 브라우저 저장소가 핵심이므로 대부분의 실질 데이터 화면은 클라이언트 컴포넌트가 된다.

그래도 아래 원칙은 유지한다.

- 레이아웃과 정적 셸은 가능한 한 `Server Component`
- IndexedDB를 읽는 화면은 `Client Component`
- 무거운 차트/캘린더는 `dynamic import`
- 한 페이지에 모든 데이터를 한 번에 구독하지 말고 `도메인 단위`로 쪼갠다
- 비싼 정렬/집계는 `services` 또는 `memoized selectors`로 분리한다

## 8. 디자인 방향

### 키워드

- `성찰`
- `정돈`
- `따뜻함`
- `신뢰감`
- `조용한 밀도`

### 시각 방향

너무 생산성 앱처럼 차갑지도, 너무 감성 다이어리처럼 흐릿하지도 않게 잡는다.
기본 톤은 `warm stone + forest green + deep navy` 조합이 적합하다.

### 컬러 제안

- Background: `#f5f1e8`
- Surface: `#fbf8f2`
- Primary text: `#1f2933`
- Accent green: `#365949`
- Accent navy: `#213147`
- Accent gold: `#b88a44`
- Muted border: `#d9d1c3`

### 타이포그래피 방향

- 본문: 가독성 높은 한글 UI 폰트
- 섹션 타이틀: 약간의 서정성을 가진 세리프 또는 대비가 있는 디스플레이 폰트

실구현 시 권장:

- Body: `Noto Sans KR` 또는 `IBM Plex Sans KR`
- Display: `Cormorant Garamond` 또는 한국어 대응 자체 호스팅 서체

## 9. 레이아웃 제안

### 공통 레이아웃

- 좌측:
  도메인 네비게이션
- 상단:
  현재 날짜, 검색, 빠른 추가 버튼
- 본문:
  도메인별 대시보드 카드
- 우측 또는 드로어:
  빠른 입력, 상세 편집, 오늘의 요약

### 홈 화면 구성

1. 상단 Hero Summary
2. 오늘의 집중 카드
3. 예산/관계/기도/할 일 4분할 스냅샷
4. 최근 기록 타임라인
5. 빠른 입력 패널

핵심은 "전체 삶의 현재 상태를 10초 안에 파악"하게 만드는 것이다.

## 10. shadcn/ui 적용 전략

초기 우선 도입 컴포넌트:

- `button`
- `card`
- `tabs`
- `badge`
- `input`
- `textarea`
- `select`
- `dialog`
- `drawer`
- `sheet`
- `dropdown-menu`
- `tooltip`
- `progress`
- `calendar`
- `form`
- `toast`
- `separator`
- `scroll-area`

### 사용 원칙

- shadcn/ui를 그대로 쓰지 말고, `app-card`, `section-heading`, `metric-tile` 같은 도메인형 조합 컴포넌트로 감싼다.
- 폼은 모두 `react-hook-form + zod`로 통일한다.
- 모달 남발 대신 모바일에서는 `drawer`, 데스크탑에서는 `sheet`를 우선한다.

## 11. 애니메이션 원칙

애니메이션은 화려함보다 `상태 변화의 이해`에 써야 한다.

추천 포인트:

- 페이지 첫 진입 시 카드 stagger
- 금액/진행률 숫자 카운트업
- 필터 변경 시 리스트 crossfade
- 상세 패널 열림/닫힘 전환
- 탭 전환 시 underline motion

피해야 할 것:

- 모든 카드 hover bounce
- 과한 spring
- 긴 페이드
- 의미 없는 패럴랙스

## 12. 상태 관리 원칙

### IndexedDB에 넣을 것

- 모든 사용자 입력 데이터
- 백업 스냅샷 메타데이터
- 마지막 수정 시각

### zustand에 넣을 것

- 현재 선택된 사람/카드/패널
- 필터 조건
- 레이아웃 모드
- 테마

### URL search params에 둘 것

- 탭
- 정렬
- 특정 뷰 모드

이렇게 나누면 새로고침, 공유, 유지보수 모두가 편해진다.

## 13. 백업/복구 설계

백업 JSON은 아래 구조를 권장한다.

```ts
type BackupPayload = {
  version: number;
  exportedAt: string;
  domains: {
    finance: unknown[];
    relationships: unknown[];
    spiritual: unknown[];
    life: unknown[];
  };
};
```

원칙:

- import 전에 `zod` 검증
- 버전이 다르면 migration 적용
- import는 merge와 replace를 분리

## 14. 구현 우선순위

한 번에 전부 만들지 말고 아래 순서가 맞다.

### Phase 1

- 앱 셸
- 디자인 토큰
- shadcn/ui 세팅
- IndexedDB 세팅
- 홈 대시보드 기본 골격

### Phase 2

- finance 도메인 완성
- relationships 도메인 기본 기능
- backup/export/import

### Phase 3

- spiritual 도메인
- life 도메인
- 캘린더/저널 고도화

### Phase 4

- 검색
- 통합 대시보드 인사이트
- 데이터 마이그레이션
- 성능 최적화

## 15. 바로 시작할 구현 기준

다음 작업부터는 아래 순서로 실제 코드에 들어가면 된다.

1. `src/` 구조로 옮기기
2. 글로벌 디자인 토큰과 폰트 정리
3. shadcn/ui 초기 컴포넌트 설치
4. Dexie 스키마와 backup schema 정의
5. 앱 셸 레이아웃 구현
6. 홈 화면과 finance 도메인부터 개발

이 프로젝트는 "기능이 많은 예쁜 앱"이 아니라, `도메인 분리`, `로컬 퍼시스턴스`, `빠른 입력 UX` 세 축을 제대로 잡아야 오래 간다.
