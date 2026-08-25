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
  body: string;      // 기능 정의 · 규칙 · 예외 케이스(협업용). 컴포넌트명은 넣지 말 것 → components 로 분리
  mark?: string;     // 프리뷰 화면 요소의 data-doc-mark 값과 일치시키면 번호 마커로 앵커링
  context?: string;  // 탭 있는 화면에서 이 항목이 속한 탭(data-doc-tab). 탭 전환 시 해당 항목만 노출
  components?: string[]; // 이 영역에서 쓴 표준 컴포넌트명 — 본문과 분리해 「사용된 컴포넌트」로 노출
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
  status?: PageStatus; // 작업 상태 — 「작업페이지 한눈에 보기」에서 뱃지로 표기
}

// 화면(페이지) 작업 상태 — 배포 이력이 아니라 문서 작업 진행도
export type PageStatus = '작성중' | '검토중' | '확정';
export const STATUS_META: Record<PageStatus, { bg: string; fg: string }> = {
  '작성중': { bg: '#FDF0E1', fg: '#B45309' },
  '검토중': { bg: '#E7F0FF', fg: '#2563EB' },
  '확정': { bg: '#EAF8EA', fg: '#1E8F1B' },
};

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
        status: '검토중',
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
        status: '검토중',
        summary: '운영 현황을 한 화면에서 파악하는 어드민 진입(홈) 페이지.',
        common:
          '1) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 위에 지표 위주로 구성함\n2) 각 영역에 번호 마커가 붙어 우측 설명과 1:1로 매칭됨\n3) 각 영역에서 쓴 표준 컴포넌트는 아래 「구성」의 영역별 "사용된 컴포넌트"에 표기',
        sections: [
          { title: '인사 + 프로모 배너', badge: 'PROMO', mark: 'promo',
            body: '1) 좌측: 운영자 인사 문구 + 오늘 날짜\n2) 우측: 진행 중 홍보 배너 노출, 클릭 시 지정 링크로 이동\n예외) 진행 중 배너가 없으면 우측 배너 영역을 비움',
            components: ['AdBanner'] },
          { title: '오늘의 할 일', badge: 'STATS', mark: 'todo',
            body: '1) 최근 30일 기준 주문 상태별 처리 필요 건수를 요약\n2) 취소·반품·교환 등 즉시 대응 항목은 강조 표기\n3) 건수 클릭 시 해당 주문 목록으로 이동\n예외) 처리할 건이 없으면 0으로 표기(숨기지 않음)',
            components: ['SectionHead', 'StatCard'] },
          { title: 'CRM 현황', badge: 'CRM', mark: 'crm',
            body: '1) 캠페인 진행 현황을 진행중/종료/중지로 구분해 집계\n2) 적립·사용 캐시 현황 요약\n3) 전일 기준 CRM 지표 제공\n예외) 당일 집계 전에는 전일 값 기준으로 표기',
            components: ['SectionHead', 'InfoCard', 'PillStatCard', 'KVColumns'] },
          { title: '쇼핑몰 현황', badge: 'TABLE', mark: 'shop',
            body: '1) DAU·방문·페이지뷰·실시간 유입/인기 페이지를 표로 제공\n2) 우측에 오늘·어제·이번달 매출 요약\n3) 실시간 항목과 집계 항목은 갱신 주기가 다름\n예외) 값이 없는 항목은 "–"로 표기',
            components: ['SectionHead', 'KVColumns', 'InfoCard'] },
          { title: '유료서비스 현황', badge: 'TABLE', mark: 'paid',
            body: '1) 이번 달 청구 예정 유료서비스(SMS·LMS·알림톡·트래픽·총 이용금액) 현황을 표로 제공\n2) 우측에 관련 안내 배너\n예외) 미사용 서비스는 0으로 표기',
            components: ['SectionHead', 'KVColumns', 'AdBanner'] },
          { title: '구매후기 · 상품문의 · 공지', badge: 'LIST', mark: 'reviews',
            body: '1) 최근 30일 기준 별점 분포별 구매후기 수\n2) 상품문의 답변/미답변 현황\n3) 공지사항 최신 목록\n예외) 미답변 문의가 있으면 개수를 강조',
            components: ['SectionHead', 'KVColumns', 'Stars', 'NoticeList'] },
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
            status: '작성중',
            summary: '테이블 행을 클릭하면 열리는 상세 팝업. 기본 정보 확인 + 저장/삭제 액션.',
            sections: [
              { title: '기본 정보', badge: 'FORM', mark: 'form',
                body: '1) 항목명·상태·담당자를 확인·편집\n예외) 필수값 미입력 시 저장을 막음',
                components: ['Field'] },
              { title: '하단 액션', badge: 'ACTION', mark: 'actions',
                body: '1) 저장 / 삭제 / 닫기 제공\n예외) 삭제는 확인 후 실행\n※ 표준 버튼 컴포넌트 미적용(프로토타입 임시 조립) — 디자인시스템 정식 버튼으로 교체 예정' },
            ],
          },
        ],
      },
      {
        id: 'live-regulars',
        code: 'ADM-P002',
        name: '라이브 단골 리스트',
        docPath: '/admin/live/regulars',
        route: '/preview/live-regulars',
        breadcrumb: '어드민 › LIVE › 라이브 단골 관리 › 단골 리스트',
        type: 'page',
        updatedAt: '2026-08-25',
        status: '작성중',
        summary: '라이브 방송 소식을 받기로 가입한 단골 고객을 검색·조회하고, 선택 대상에게 알림톡을 발송하는 어드민 화면.',
        common:
          '1) 실제 서비스 화면(어드민 › LIVE › 라이브 단골 관리 › 단골 리스트)을 참고해 동일 구성으로 재현함\n2) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 사용, 상단 네비는 LIVE 활성 · 좌측은 라이브 단골 관리 › 단골 리스트 활성\n3) 검색 → 회원 구분 필터 → 선택 발송 → 목록 확인 순으로 사용함',
        sections: [
          { title: '검색 조건', badge: 'SEARCH', mark: 'search',
            body: '1) 이름 · 닉네임 · 연락처 3개 항목으로 단골 검색\n2) 값을 여러 개 입력하면 AND 조건으로 결과를 좁힘\n3) 초기화 클릭 시 입력값 전체 삭제 + 목록 전체 재조회\n예외) 3개 항목을 모두 비워둔 채 검색하면 전체 목록 표시',
            components: ['RequiredLabel', 'TextInput', 'FilledButton'] },
          { title: '라이브 단골 안내 배너', badge: 'PROMO', mark: 'promo',
            body: '1) 라이브 단골 기능의 목적(라이브 관련 소식 수신)을 안내\n2) 「단골 가입 URL 복사」로 가입 페이지 링크를 복사해 SNS·프로필 등에 배포\n3) 「바로가기」로 실제 단골 가입 페이지를 열어 미리보기\n예외) 단골 등록 회원이 0명이어도 배너는 항상 노출(가입 유도 목적)',
            components: ['PromoBanner', 'FilledButton'] },
          { title: '회원 구분 필터 · 정렬', badge: 'FILTER', mark: 'filter',
            body: '1) 전체 / 기존 회원 / 신규 회원 3개 탭으로 목록을 좁힘\n2) 신규는 라이브 방송을 보다가 그 자리에서 가입한 회원, 기존은 이전에 이미 가입돼 있던 회원\n3) 우측에서 정렬 기준과 페이지당 노출 개수를 선택\n예외) 탭 전환 시 검색 조건은 유지한 채 회원 구분만 추가로 좁혀짐',
            components: ['FilledButton', 'OutlineButton', 'SelectBox', 'HelperText'] },
          { title: '선택 대상 일괄 발송', badge: 'ACTION', mark: 'actions',
            body: '1) 표에서 체크한 대상에게만 「알림톡 발송」\n2) 선택 없이 「전체 고객 발송」 클릭 시 현재 검색·필터 결과 전체에게 발송\n예외) 선택한 대상이 없는 상태로 「알림톡 발송」을 누르면 대상 선택 안내 후 발송을 막음',
            components: ['Checkbox', 'FilledButton', 'OutlineButton'] },
          { title: '단골 리스트', badge: 'TABLE', mark: 'table',
            body: '1) No · 이름 · 회원 구분 · 닉네임 · 연락처 · 누적 지표(담은 횟수/구매횟수/구매금액) · 단골 등록일 순으로 표기\n2) 이름 · 연락처는 클릭 시 각각 회원 상세 · 통화 연결로 이동\n3) 누적 지표 3종은 라이브 단골 등록 이후 누적 기준으로 집계\n예외) 활동 이력이 없는 신규 단골은 누적 지표 3종 모두 0으로 표기\n※ 회원 구분(기존/신규) 배지는 표준 컴포넌트 미적용(프로토타입 임시 조립) — 디자인시스템에 아웃라인+점 배지 컴포넌트 추가 요청 대상',
            components: ['DataTable', 'Checkbox'] },
          { title: '페이지 이동', badge: 'PAGE', mark: 'pagination',
            body: '1) 목록 하단에서 페이지 단위로 이동\n2) 페이지당 노출 개수는 위 필터 영역의 선택값을 따름',
            components: ['Pagination'] },
        ],
        stateTable: {
          caption: '회원 구분별',
          headers: ['구분', '정의', '표 배지'],
          rows: [
            ['기존 회원', '라이브 단골 가입 페이지를 통해 사전에 가입한 회원', '회색 「기존」'],
            ['신규 회원', '라이브 방송을 보다가 그 자리에서 가입한 회원', '초록 「신규」'],
          ],
        },
      },
      {
        id: 'discount-code',
        code: 'ADM-P003',
        name: '할인코드',
        docPath: '/admin/discount-code',
        route: '/preview/discount-code',
        breadcrumb: '어드민 › LIVE › 라이브 단골 관리 › 단골 리스트',
        type: 'page',
        updatedAt: '2026-08-25',
        status: '작성중',
        summary: '라이브 방송 소식을 받기로 가입한 단골 고객을 검색·조회하고, 선택 대상에게 알림톡을 발송하는 어드민 화면.',
        common:
          '1) 실제 서비스 화면(어드민 › LIVE › 라이브 단골 관리 › 단골 리스트)을 참고해 동일 구성으로 재현함\n2) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 사용, 상단 네비는 LIVE 활성 · 좌측은 라이브 단골 관리 › 단골 리스트 활성\n3) 검색 → 회원 구분 필터 → 선택 발송 → 목록 확인 순으로 사용함',
        sections: [
          { title: '검색 조건', badge: 'SEARCH', mark: 'search',
            body: '1) 이름 · 닉네임 · 연락처 3개 항목으로 단골 검색\n2) 값을 여러 개 입력하면 AND 조건으로 결과를 좁힘\n3) 초기화 클릭 시 입력값 전체 삭제 + 목록 전체 재조회\n예외) 3개 항목을 모두 비워둔 채 검색하면 전체 목록 표시',
            components: ['RequiredLabel', 'TextInput', 'FilledButton'] },
          { title: '라이브 단골 안내 배너', badge: 'PROMO', mark: 'promo',
            body: '1) 라이브 단골 기능의 목적(라이브 관련 소식 수신)을 안내\n2) 「단골 가입 URL 복사」로 가입 페이지 링크를 복사해 SNS·프로필 등에 배포\n3) 「바로가기」로 실제 단골 가입 페이지를 열어 미리보기\n예외) 단골 등록 회원이 0명이어도 배너는 항상 노출(가입 유도 목적)',
            components: ['PromoBanner', 'FilledButton'] },
          { title: '회원 구분 필터 · 정렬', badge: 'FILTER', mark: 'filter',
            body: '1) 전체 / 기존 회원 / 신규 회원 3개 탭으로 목록을 좁힘\n2) 신규는 라이브 방송을 보다가 그 자리에서 가입한 회원, 기존은 이전에 이미 가입돼 있던 회원\n3) 우측에서 정렬 기준과 페이지당 노출 개수를 선택\n예외) 탭 전환 시 검색 조건은 유지한 채 회원 구분만 추가로 좁혀짐',
            components: ['FilledButton', 'OutlineButton', 'SelectBox', 'HelperText'] },
          { title: '선택 대상 일괄 발송', badge: 'ACTION', mark: 'actions',
            body: '1) 표에서 체크한 대상에게만 「알림톡 발송」\n2) 선택 없이 「전체 고객 발송」 클릭 시 현재 검색·필터 결과 전체에게 발송\n예외) 선택한 대상이 없는 상태로 「알림톡 발송」을 누르면 대상 선택 안내 후 발송을 막음',
            components: ['Checkbox', 'FilledButton', 'OutlineButton'] },
          { title: '단골 리스트', badge: 'TABLE', mark: 'table',
            body: '1) No · 이름 · 회원 구분 · 닉네임 · 연락처 · 누적 지표(담은 횟수/구매횟수/구매금액) · 단골 등록일 순으로 표기\n2) 이름 · 연락처는 클릭 시 각각 회원 상세 · 통화 연결로 이동\n3) 누적 지표 3종은 라이브 단골 등록 이후 누적 기준으로 집계\n예외) 활동 이력이 없는 신규 단골은 누적 지표 3종 모두 0으로 표기\n※ 회원 구분(기존/신규) 배지는 표준 컴포넌트 미적용(프로토타입 임시 조립) — 디자인시스템에 아웃라인+점 배지 컴포넌트 추가 요청 대상',
            components: ['DataTable', 'Checkbox'] },
          { title: '페이지 이동', badge: 'PAGE', mark: 'pagination',
            body: '1) 목록 하단에서 페이지 단위로 이동\n2) 페이지당 노출 개수는 위 필터 영역의 선택값을 따름',
            components: ['Pagination'] },
        ],
        stateTable: {
          caption: '회원 구분별',
          headers: ['구분', '정의', '표 배지'],
          rows: [
            ['기존 회원', '라이브 단골 가입 페이지를 통해 사전에 가입한 회원', '회색 「기존」'],
            ['신규 회원', '라이브 방송을 보다가 그 자리에서 가입한 회원', '초록 「신규」'],
          ],
        },
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
        status: '작성중',
        summary: '고객이 처음 보는 화면.',
        common:
          '1) 상단 히어로 배너 + 콘텐츠 카드 그리드로 구성함\n2) 로그인 전/후로 노출·액션이 달라짐(아래 표)',
        sections: [
          { title: '히어로 배너', badge: 'HERO', mark: 'hero',
            body: '1) 대표 콘텐츠를 큰 배너로 노출\n2) 클릭 시 상세로 이동\n※ 표준 컴포넌트 없이 임시 조립 — 디자인시스템에 히어로 표준 필요(요청 대상)' },
          { title: '콘텐츠 카드', badge: 'GRID', mark: 'grid',
            body: '1) 콘텐츠를 카드 그리드로 나열\n2) 스크롤 하단 도달 시 추가 로드\n예외) 결과 없으면 빈 상태 안내\n※ 표준 카드 컴포넌트 미적용 — 디자인시스템 정식 카드로 교체 예정' },
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
//  「작업페이지 한눈에 보기」 = 화면(페이지) 인덱스
//  배포 이력이 아니라, 이 프로토타입의 작업 화면을 영역(그룹)별로 모아 보는 목차.
//  데이터는 위 DOC_GROUPS 에서 파생한다(별도 목록을 두지 않음).
// ─────────────────────────────────────────────────────────────────────────

// 영역(작업 영역 = 문서 그룹) 목록 — 인덱스 영역 필터에 사용
export const AREA_COLS: string[] = DOC_GROUPS.map((g) => g.title);

// 인덱스 한 줄(화면) — 상위 페이지 + 소속 팝업
export interface IndexRow {
  entry: DocEntry;
  parent?: DocEntry; // 팝업이면 소속 페이지
}

// 영역별로 [페이지, 그 페이지의 팝업들…] 펼친 목록
export function pageRowsInArea(area: string): IndexRow[] {
  const group = DOC_GROUPS.find((g) => g.title === area);
  if (!group) return [];
  return group.entries.flatMap((e) => [
    { entry: e },
    ...(e.children ?? []).map((c) => ({ entry: c, parent: e })),
  ]);
}
