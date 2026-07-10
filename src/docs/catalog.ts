/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// ─────────────────────────────────────────────────────────────────────────
//  기획 문서 카탈로그 — 표준 포맷
//  그룹(작업 영역) → 페이지 → 하위 팝업의 트리 구조.
//  이 파일 한 곳만 채우면 좌측 트리 / 중앙 프리뷰(iframe) / 우측 설명 패널이 자동 구성된다.
// ─────────────────────────────────────────────────────────────────────────

// 설명 패널의 한 항목. mark를 주면 프리뷰 화면의 [data-doc-mark="..."] 요소 위에
// 번호 마커가 얹히고, 이 항목 옆에도 같은 번호가 붙는다(화면↔설명 1:1 매칭).
export interface DocSection {
  title: string;
  badge?: string;    // 짧은 유형 라벨(예: SEARCH · TABLE · ACTION)
  body: string;
  mark?: string;     // 프리뷰 화면 요소의 data-doc-mark 값과 일치시키면 번호 마커로 앵커링
  context?: string;  // 탭 있는 화면에서 이 항목이 속한 탭(data-doc-tab). 탭 전환 시 해당 항목만 노출
}

// 상태별(로그인 전/후 · 권한 등) 노출·동작 차이를 표로 설명 — 우측 패널에 표로 렌더.
export interface StateTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface DocEntry {
  id: string;          // URL(/docs/<id>) · 코멘트/마커 키
  code?: string;       // 화면 코드(예: LIVE-P001)
  name: string;        // 화면명
  docPath?: string;    // 표시용 경로(문서상의 위치)
  route: string;       // 실제 프리뷰 라우트(iframe src)
  breadcrumb: string;  // 상단 경로 표시
  type: 'page' | 'popup';
  summary: string;     // 화면 한 줄~문단 요약
  common?: string;     // 공통 개요·전제·규칙 — 탭 무관 항상 노출(마커로 못 찍는 것). 1)/2) 로 작성
  sections: DocSection[];
  tabs?: string[];     // 탭 있는 화면이면 탭 목록(data-doc-tab 값). 프리뷰 상단 탭 칩으로 노출
  stateTable?: StateTable;
  children?: DocEntry[]; // 소속 팝업
  updatedAt?: string;  // 최근 수정일 YYYY-MM-DD
  hideDesc?: boolean;  // 우측 설명 패널을 숨김(그 자체가 문서인 개요/표지 화면용). 프리뷰가 전체 폭 차지
}

export interface DocGroup {
  title: string;        // 작업 영역명(예: 어드민 · 고객뷰어)
  entries: DocEntry[];
}

export const AUTHOR = '컨버전스 김희연';
export const DOC_TITLE = 'CONVERGENCE Docs.';

// ─────────────────────────────────────────────────────────────────────────
//  샘플 데이터 — 실제 프로젝트에선 이 배열을 자기 화면들로 교체하면 된다.
// ─────────────────────────────────────────────────────────────────────────
export const DOC_GROUPS: DocGroup[] = [
  {
    title: '개요',
    entries: [
      {
        id: 'overview',
        name: '프로토타입 개요',
        docPath: '/overview',
        route: '/preview/overview',
        breadcrumb: '개요',
        type: 'page',
        updatedAt: '2026-07-10',
        hideDesc: true, // 프리뷰(표지) 자체가 문서 → 우측 설명 패널 숨김
        summary: '이 프로토타입이 어떤 서비스의 어떤 기능을 위해 만들어졌는지 개요·목적·범위를 협업 개발자·디자이너에게 전달하는 표지 페이지.',
        sections: [],
      },
    ],
  },
  {
    title: '어드민',
    entries: [
      {
        id: 'dashboard',
        code: 'ADM-P001',
        name: '대시보드',
        docPath: '/admin/dashboard',
        route: '/preview/dashboard',
        breadcrumb: '어드민 › 대시보드',
        type: 'page',
        updatedAt: '2026-07-09',
        summary: '운영 현황을 한 화면에서 파악하는 어드민 진입(홈) 페이지.',
        common:
          '1) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 위에 지표 위주로 구성함\n2) 각 영역에 번호 마커가 붙어 우측 설명과 1:1로 매칭됨\n3) 표준 컴포넌트(StatCard·StatusPill·InfoCard·LabelValueTable·DataTable·PromoBanner·NoticeList·Stars)로 조립됨',
        sections: [
          { title: '인사 + 프로모 배너', badge: 'PROMO', mark: 'promo', body: '1) 좌측 인사 문구 + 오늘 날짜\n2) 우측 홍보 배너 행(PromoBanner)' },
          { title: '오늘의 할 일', badge: 'STATS', mark: 'todo', body: '1) 주문 상태별 건수를 지표 카드(StatCard)로 나열함\n2) 취소·반품·교환 등 처리 필요 건은 빨강으로 강조함' },
          { title: 'CRM 현황', badge: 'CRM', mark: 'crm', body: '1) 캠페인 진행 현황(진행중/종료/중지 StatusPill)\n2) 캐시 현황(InfoCard)\n3) 어제의 CRM 지표(LabelValueTable 3종)' },
          { title: '쇼핑몰 현황', badge: 'TABLE', mark: 'shop', body: '1) DAU·방문·페이지뷰·실시간 유입/인기 페이지 테이블(DataTable)\n2) 우측 매출 지표 카드(InfoCard + LabelValueTable)' },
          { title: '유료서비스 현황', badge: 'TABLE', mark: 'paid', body: 'SMS·LMS·알림톡·트래픽·총 이용금액을 테이블로 표기함' },
          { title: '구매후기 · 상품문의 · 공지', badge: 'LIST', mark: 'reviews', body: '1) 별점별 구매후기 수(Stars)\n2) 상품문의 답변 현황\n3) 공지사항 목록(NoticeList)' },
        ],
        children: [
          {
            id: 'item-detail',
            code: 'ADM-M001',
            name: '항목 상세',
            docPath: '/admin/dashboard/item',
            route: '/preview/item-detail',
            breadcrumb: '대시보드 › 항목 상세',
            type: 'popup',
            updatedAt: '2026-07-08',
            summary: '테이블 행을 클릭하면 열리는 상세 팝업. 기본 정보 확인 + 저장/삭제 액션.',
            sections: [
              { title: '기본 정보', badge: 'FORM', mark: 'form', body: '항목명·상태·담당자를 편집. 필수값 미입력 시 저장 비활성화.' },
              { title: '하단 액션', badge: 'ACTION', mark: 'actions', body: '저장 / 삭제 / 닫기. 삭제는 확인 후 실행.' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '고객뷰어',
    entries: [
      {
        id: 'viewer-home',
        code: 'VW-P001',
        name: '뷰어 홈',
        docPath: '/viewer',
        route: '/preview/viewer',
        breadcrumb: '고객뷰어 › 홈',
        type: 'page',
        updatedAt: '2026-07-08',
        summary: '고객이 처음 보는 화면.',
        common:
          '1) 상단 히어로 배너 + 콘텐츠 카드 그리드로 구성함\n2) 로그인 전/후로 노출·액션이 달라짐(아래 표)',
        sections: [
          { title: '히어로 배너', badge: 'HERO', mark: 'hero', body: '대표 콘텐츠를 큰 배너로 노출. 클릭 시 상세로 이동.' },
          { title: '콘텐츠 카드', badge: 'GRID', mark: 'grid', body: '콘텐츠를 카드 그리드로 나열. 무한 스크롤로 추가 로드.' },
        ],
        stateTable: {
          caption: '로그인 상태별',
          headers: ['상태', '찜하기', '구매'],
          rows: [
            ['로그인 전', 'X (로그인 유도)', 'X'],
            ['로그인 후', 'O', 'O'],
          ],
        },
      },
    ],
  },
];

// ── 파생 헬퍼 (트리 → 평탄 목록) ──
export const ALL_ENTRIES: DocEntry[] = DOC_GROUPS.flatMap((g) =>
  g.entries.flatMap((e) => [e, ...(e.children ?? [])]),
);

export function entryById(id: string): DocEntry | undefined {
  return ALL_ENTRIES.find((e) => e.id === id);
}
export function groupTitleOf(id: string): string {
  for (const g of DOC_GROUPS) {
    for (const e of g.entries) {
      if (e.id === id || (e.children ?? []).some((c) => c.id === id)) return g.title;
    }
  }
  return DOC_GROUPS[0].title;
}
export function screenName(id: string): string {
  return entryById(id)?.name ?? id;
}

// ─────────────────────────────────────────────────────────────────────────
//  배포리스트(변경 이력) 모델 — 릴리즈(배포 월/버전) + 기능 단위
//  화면 카탈로그와 분리: 배포마다 가장 빨리 자라는 부분이라 이 배열만 열어서 추가한다.
// ─────────────────────────────────────────────────────────────────────────
export type ChangeKind = 'add' | 'change' | 'fix'; // 추가 / 변경 / 수정
export const KIND_LABEL: Record<ChangeKind, string> = { add: '추가', change: '변경', fix: '수정' };
export const KIND_COLOR: Record<ChangeKind, string> = { add: '#1B873F', change: '#E08600', fix: '#2563EB' };

export interface Release {
  id: string;
  label: string;                       // '1차 배포 (7/21)'
  status: 'released' | 'planned';      // 반영됨 / 예정
  note?: string;                       // 한 줄 요약
}

export interface Feature {
  id: string;
  release: string;   // Release.id
  kind: ChangeKind;
  title: string;     // 기능명 — "주제 : 내용" 형태면 [주제]로 강조됨
  desc: string;      // 설명(줄바꿈 \n 지원)
  screens: string[]; // 영향 화면(DocEntry.id) — 영역별 열에 화면명 링크로 표기
}

// 배포리스트 영역 열 = 문서 그룹(작업 영역)
export const AREA_COLS: string[] = DOC_GROUPS.map((g) => g.title);

// 표시 순서: 위 = 먼저 보일 항목
export const RELEASES: Release[] = [
  { id: 'r-1', label: '1차 배포 (7/21)', status: 'released', note: '최초 오픈 범위' },
  { id: 'r-2', label: '2차 배포 (8/20)', status: 'planned', note: '운영 편의 · 통계' },
  { id: 'r-3', label: '3차 배포 (미정)', status: 'planned', note: 'VOC 반영 — 일정 미정' },
];

export const FEATURES: Feature[] = [
  {
    id: 'f-kpi', release: 'r-1', kind: 'add', title: '대시보드 : 요약 지표 카드',
    desc: '1) 오늘의 방문·주문·매출을 카드로 요약함\n2) 카드 클릭 시 해당 상세로 이동함',
    screens: ['dashboard'],
  },
  {
    id: 'f-detail', release: 'r-1', kind: 'add', title: '항목 상세 : 편집 팝업',
    desc: '테이블 행 클릭 시 상세 팝업에서 기본 정보를 편집·저장·삭제함',
    screens: ['dashboard', 'item-detail'],
  },
  {
    id: 'f-viewer-home', release: 'r-1', kind: 'add', title: '뷰어 홈 : 히어로 + 카드 그리드',
    desc: '고객 진입 화면에 대표 배너 + 콘텐츠 카드 그리드를 노출함(로그인 전/후 분기)',
    screens: ['viewer-home'],
  },
  {
    id: 'f-detail-edit', release: 'r-2', kind: 'change', title: '항목 상세 : 편집 흐름 개선',
    desc: '1) 필수값 미입력 시 저장을 비활성화함\n2) 삭제는 확인 후 실행함',
    screens: ['item-detail'],
  },
  {
    id: 'f-viewer-like', release: 'r-3', kind: 'add', title: '뷰어 홈 : 찜하기(로그인 유도)',
    desc: '로그인 후 콘텐츠를 찜할 수 있고, 비로그인 시 로그인 유도 레이어를 노출함',
    screens: ['viewer-home'],
  },
];

// 기능이 특정 영역(그룹)에서 영향 주는 화면 id들
export function screensInArea(f: Feature, area: string): string[] {
  return f.screens.filter((sid) => groupTitleOf(sid) === area);
}
// "주제 : 내용" → { tag: '주제', rest: '내용' } (콜론 없으면 tag 없음)
export function splitFeatureTitle(title: string): { tag: string | null; rest: string } {
  const m = title.match(/^(.+?)\s*:\s*(.+)$/);
  return m ? { tag: m[1], rest: m[2] } : { tag: null, rest: title };
}
