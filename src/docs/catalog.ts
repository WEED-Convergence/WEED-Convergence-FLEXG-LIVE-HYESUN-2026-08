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
export type PageStatus = '작성중' | '검토중' | '확정' | '작성 완료' | '1차 작업 완료';
export const STATUS_META: Record<PageStatus, { bg: string; fg: string }> = {
  '작성중': { bg: '#FDF0E1', fg: '#B45309' },
  '검토중': { bg: '#E7F0FF', fg: '#2563EB' },
  '확정': { bg: '#EAF8EA', fg: '#1E8F1B' },
  '작성 완료': { bg: '#EAF8EA', fg: '#1E8F1B' },
  '1차 작업 완료': { bg: '#E7F0FF', fg: '#2563EB' },
};

export interface DocGroup {
  title: string;        // 작업 영역명(예: 어드민 · 고객뷰어)
  entries: DocEntry[];
}

export const AUTHOR = '컨버전스 이하연';
export const VERSION = 'V1.0';
export const DOC_TITLE = 'FLEXG 모바일 앱';

// ── 통계 그룹 엔트리 생성 헬퍼(분류별 페이지 + 상세/필터 바텀시트) ──
function statSheet(id: string, code: string, name: string, kind: 'detail' | 'filter'): DocEntry {
  const filter = kind === 'filter';
  return {
    id, code, name, docPath: `/stat/${id.replace('stat-', '')}`, route: `/preview/${id}`,
    breadcrumb: `통계 › ${name}`, type: 'popup', updatedAt: '2026-07-16', status: '작성 완료',
    summary: filter ? '분류별 매출을 다중 조건으로 좁히는 필터 바텀시트.' : '선택 항목의 상세 정산 내역 바텀시트.',
    common: filter
      ? '1) 목록 화면 우상단 필터 아이콘 터치 → 하단에서 슬라이드업\n2) 취소/외부 영역 터치 시 반영 없이 닫힘, [적용] 시 부모 목록 재조회\n※ 필터 바텀시트는 프로토타입 임시 조립(디자인시스템 요청 대상)'
      : '1) 목록 항목 터치 → 하단에서 슬라이드업\n2) [확인] 또는 외부 영역 터치 시 닫힘\n※ 상세 바텀시트는 프로토타입 임시 조립(디자인시스템 요청 대상)',
    sections: filter
      ? [{ title: '필터', badge: 'FILTER', mark: 'filter', body: '1) 과세구분·결제수단·주문상태·항목 선택 등 다중 조건 체크박스\n2) [초기화]로 조건 해제 · [적용]으로 반영\n3) 전체 선택 시 하위 항목 자동 체크' }]
      : [{ title: '정산 상세', badge: 'DETAIL', mark: 'detail', body: '1) 상품금액·할인·결제·취소·정산금액·공급가·PG수수료·판매이익 등 상세 내역\n2) [확인]으로 닫기' }],
  };
}
function statPage(id: string, code: string, name: string, sections: DocSection[], opts: { detail?: string; filter?: string }): DocEntry {
  const children: DocEntry[] = [];
  if (opts.detail) children.push(statSheet(`${id}-detail`, opts.detail, `${name} 상세`, 'detail'));
  if (opts.filter) children.push(statSheet(`${id}-filter`, opts.filter, `${name} 필터`, 'filter'));
  return {
    id, code, name, docPath: `/stat/${id.replace('stat-', '')}`, route: `/preview/${id}`,
    breadcrumb: `통계 › ${name}`, type: 'page', updatedAt: '2026-07-16', status: '작성 완료',
    summary: `${name} 현황과 항목별 상세 실적을 요약.`,
    common: `1) 통계 허브에서 진입 · 상단 기간 필터 기준으로 집계\n2) 목록 항목 터치 시 상세 바텀시트 노출${opts.filter ? ' · 우상단 필터로 조건 좁힘' : ''}\n※ 차트·리스트·바텀시트는 프로토타입 임시 조립(디자인시스템 요청 대상)`,
    sections,
    children: children.length ? children : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  샘플 데이터 — 실제 프로젝트에선 이 배열을 자기 화면들로 교체하면 된다.
// ─────────────────────────────────────────────────────────────────────────
export const DOC_GROUPS: DocGroup[] = [
  {
    title: '개요',
    entries: [
      {
        id: 'funcspec',
        name: '기능정의서',
        docPath: '/funcspec',
        route: '/preview/funcspec',
        breadcrumb: '기능정의서',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        hideDesc: true, // 표 자체가 문서 → 우측 설명 패널 숨김(전체 폭)
        summary: '전체 화면의 화면별 구성 요소(Element)와 기능·비고를 한 표로 정의한 문서.',
        sections: [],
      },
      {
        id: 'overview',
        name: '프로토타입 개요',
        docPath: '/overview',
        route: '/preview/overview',
        breadcrumb: '개요',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        hideDesc: true, // 프리뷰(표지) 자체가 문서 → 우측 설명 패널 숨김
        summary: 'FLEXG 모바일 앱이 어떤 사용자의 어떤 운영을 위해 만들어졌는지 개요·목적·범위를 협업 개발자·디자이너에게 전달하는 표지 페이지.',
        sections: [],
      },
    ],
  },
  {
    title: '인증',
    entries: [
      {
        id: 'splash',
        code: 'M_CMMN_P001',
        name: '스플래시',
        docPath: '/auth/splash',
        route: '/preview/splash',
        breadcrumb: '인증 › 스플래시',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '앱 최초 진입 시 토큰을 검증해 대시보드/로그인으로 분기하는 로딩 화면.',
        common:
          '1) 앱 최초 진입 시 노출되는 화면(로그인 직후 아님)\n2) FLEXG 로고 풀스크린 + 백그라운드 토큰 검증만 수행(사용자 입력 없음)\n3) 표시 시간 1초 고정 — 검증이 더 빨라도 유지',
        sections: [
          { title: '로고 · 백그라운드 검증', badge: 'SPLASH', mark: 'brand',
            body: '1) FLEXG 로고를 풀스크린 중앙에 노출\n2) 백그라운드에서 Refresh Token 유효성 검증\n3) 강제 업데이트 플래그가 있으면 업데이트 모달 표시\n예외) 1초 후에도 검증 미완료면 로그인으로 폴백\n※ FLEX G 워드마크는 프로토타입 임시 조립 — 디자인시스템 브랜드 로고 컴포넌트 요청 대상' },
        ],
        stateTable: {
          caption: '진입 분기',
          headers: ['조건', '이동'],
          rows: [
            ['Refresh Token 유효', '메인 대시보드'],
            ['Refresh Token 만료/없음', '로그인'],
            ['강제 업데이트 플래그', '업데이트 모달 → 스토어'],
            ['네트워크 없음', '오프라인 안내 배너 노출'],
          ],
        },
      },
      {
        id: 'login',
        code: 'M_CMMN_P002',
        name: '로그인',
        docPath: '/auth/login',
        route: '/preview/login',
        breadcrumb: '인증 › 로그인',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '대표계정·부계정을 탭으로 구분해 인증하는 FLEXG 운영자 로그인 화면.',
        common:
          '1) 대표계정과 부계정의 입력 방식이 달라 상단 탭으로 명확히 구분\n2) 로그인 성공 시 메인 대시보드로 즉시 이동\n3) 아이디는 자동 소문자 변환, 비밀번호는 8자 이상(영문+숫자 필수)',
        sections: [
          { title: '브랜드 · 인사 카피', badge: 'INTRO', mark: 'intro',
            body: '1) 상단에 FLEXG 로고 + 운영 독려 카피를 노출\n※ FLEX G 워드마크는 프로토타입 임시 조립 — 디자인시스템 브랜드 로고 컴포넌트 요청 대상' },
          { title: '계정 유형 탭', badge: 'TAB', mark: 'tabs',
            body: '1) 대표계정 / 부계정을 좌우 분할 탭으로 전환\n2) 탭 전환 시 입력 필드를 모두 초기화\n예외) 부계정 로그인 5회 실패 시 10분 자동 잠금\n※ 세그먼트 탭은 프로토타입 임시 조립 — 디자인시스템 요청 대상' },
          { title: '입력 필드', badge: 'FORM', mark: 'form',
            body: '1) 대표계정: 아이디 + 비밀번호(2필드)\n2) 부계정: 대표 아이디 + 부계정 아이디 + 비밀번호(3필드)\n3) 아이디 자동 소문자 변환 · 비밀번호 8자 이상(영문+숫자 필수)' },
          { title: '로그인 · 비밀번호 찾기', badge: 'ACTION', mark: 'actions',
            body: '1) 로그인 성공 → 메인 대시보드로 즉시 이동\n2) Access Token + Refresh Token 동시 저장(부계정은 권한 스코프 함께 캐싱)\n3) 잠금 중에는 안내 모달 + 남은 시간 카운트를 노출\n예외) 비밀번호 찾기 진입 제공' },
        ],
        stateTable: {
          caption: '계정 유형별 입력 필드',
          headers: ['계정 유형', '입력 필드', '비고'],
          rows: [
            ['대표계정', '아이디 · 비밀번호', '2필드'],
            ['부계정', '대표 아이디 · 부계정 아이디 · 비밀번호', '3필드 · 5회 실패 시 10분 잠금'],
          ],
        },
        children: [
          {
            id: 'password-reset',
            code: 'M_CMMN_P003',
            name: '비밀번호 재설정',
            docPath: '/auth/password-reset',
            route: '/preview/password-reset',
            breadcrumb: '인증 › 비밀번호 재설정',
            type: 'page',
            updatedAt: '2026-07-20',
            status: '작성 완료',
            summary: '로그인 화면의 「비밀번호를 잊으셨나요?」로 진입 — 아이디(이메일) 인증 후 새 비밀번호를 설정하는 화면.',
            common:
              '1) 로그인(M_CMMN_P002)의 비밀번호 찾기로 진입 · 헤더 뒤로가기로 로그인 복귀\n2) 아이디(이메일) 인증 → 인증코드 확인 → 새 비밀번호 설정을 한 화면에서 진행\n3) 새 비밀번호 = 영문+숫자 포함 8자 이상 · 비밀번호 확인 일치 필수\n※ 인증 흐름·입력 폼은 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '안내', badge: 'INTRO', mark: 'intro',
                body: '1) 화면 제목 + 재설정 절차 안내 문구\n2) 가입 시 등록한 아이디(이메일) 기준으로 인증' },
              { title: '아이디(이메일) 인증 요청', badge: 'FORM', mark: 'account',
                body: '1) 가입한 아이디(이메일) 입력\n2) [인증코드 받기] → 해당 메일로 인증번호 발송\n예외) 미가입/형식 오류 시 안내' },
              { title: '인증코드 확인', badge: 'FORM', mark: 'verify',
                body: '1) 메일로 받은 인증번호 6자리 입력\n2) 유효시간 3분 카운트 · [인증코드 재전송] 제공\n예외) 시간 초과·불일치 시 안내' },
              { title: '새 비밀번호 설정', badge: 'FORM', mark: 'newpw',
                body: '1) 새 비밀번호 + 새 비밀번호 확인 입력(마스킹)\n2) 영문+숫자 포함 8자 이상 · 두 입력 일치 필수' },
              { title: '변경 · 로그인 복귀', badge: 'ACTION', mark: 'submit',
                body: '1) [비밀번호 변경] → 재설정 완료 후 로그인으로 이동\n2) [로그인으로 돌아가기]로 인증 중단 후 복귀' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '홈',
    entries: [
      {
        id: 'dashboard',
        code: 'M_HOME_P001',
        name: '메인 대시보드',
        docPath: '/home/dashboard',
        route: '/preview/dashboard',
        breadcrumb: '홈 › 메인 대시보드',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '1인 사장님이 로그인 직후 진입하는 운영 허브. 오늘 할 일·매출·주문 상태를 압축 배치. (PC 반영 필요)',
        common:
          '1) "결과 지표"보다 "행동 유도"를 상단에 배치 — 진입 3초 안에 오늘 할 일을 인지하도록 설계\n2) Phase 1은 조회 전용(편집 비활성), Pull-to-refresh로 즉시 강제 갱신\n3) 갱신 주기 — 처리할 일·KPI·주문 상태·최근 주문 30초 폴링 / 시간대별 매출 차트 5분 마이크로배치\n4) 오프라인 시 마지막 동기화 데이터 + 안내 배너 노출\n※ 카드·차트·리스트는 모바일 표준 컴포넌트 미비로 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '지금 처리할 일', badge: 'ACTION', mark: 'todo',
            body: '1) 미답변 CS·배송준비·재고 부족을 최우선 배치\n2) 항목 탭 → 해당 작업 화면으로 딥링크\n3) 재고 임박 기준 = 잔여 10개 이하 시 뱃지\n예외) 처리할 일 0건이면 카드 자체를 숨김(시각 노이즈 제거)' },
          { title: '오늘 매출', badge: 'KPI', mark: 'sales',
            body: '1) 오늘 매출 + 전일 동시간 대비 증감률\n2) 마감 예상치는 현재 시간대 추이 기반 추정(참고용 표기)' },
          { title: '보조 KPI', badge: 'KPI', mark: 'kpi',
            body: '1) 보조 KPI 2종 = 오늘 주문 · 신규 회원\n2) 전일 대비 증감을 함께 표기' },
          { title: '주문 상태 5단계', badge: 'STATS', mark: 'status',
            body: '1) 입금확인 / 배송준비 / 배송중 / 배송완료 / 주문취소\n2) 주문취소는 강조(빨강)\n3) 건수 탭 → 해당 상태 주문 목록으로 이동' },
          { title: '시간대별 매출 차트', badge: 'CHART', mark: 'chart',
            body: '1) 시간대별 매출 추이 라인 차트\n2) 오늘 vs 어제 비교 + 현재 시점 마커\n3) 5분 마이크로배치로 갱신' },
          { title: '오늘 BEST Top 3', badge: 'LIST', mark: 'best',
            body: '1) 오늘 베스트셀러 상위 3종(상품명 + 판매 건수)' },
          { title: '최근 주문', badge: 'LIST', mark: 'recent',
            body: '1) 최근 주문 최대 5건(주문번호 · 대표 상품 · 금액)\n2) 카드 탭 → 주문 상세로 이동' },
        ],
        children: [
          {
            id: 'notifications',
            code: 'M_HOME_P002',
            name: '알림',
            docPath: '/home/notifications',
            route: '/preview/notifications',
            breadcrumb: '홈 › 알림',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '헤더 알림(벨) 아이콘으로 진입하는 알림 센터. 이벤트 알림을 날짜별로 모아 봄.',
            common:
              '1) 헤더 알림(벨) 아이콘 탭으로 진입, 미읽음 개수를 벨 뱃지로 표시\n2) 최근 30일 보관 후 자동 삭제\n3) 푸시 권한 허용 시 OS 알림 동시 발송',
            sections: [
              { title: '알림 카드 목록', badge: 'LIST', mark: 'list',
                body: '1) 알림 카드 = 아이콘 + 제목 + 본문 + 시간\n2) 미읽음은 우측 점으로 표시\n3) 오늘·어제 등 날짜 그룹으로 구분' },
              { title: '모두 읽음', badge: 'ACTION', mark: 'readall',
                body: '1) 모두 읽음 처리 액션 제공\n2) 카드 탭 → 해당 화면으로 딥링크' },
            ],
            stateTable: {
              caption: '알림 유형별 표기 · 진입',
              headers: ['유형', '아이콘 · 색', '탭 시 이동'],
              rows: [
                ['경고', '경고 아이콘 · 빨강', '주문 목록'],
                ['주문', '주문 아이콘 · 파랑', '주문 상세'],
                ['안내', '안내 아이콘 · 회색', '공지 상세'],
              ],
            },
          },
          {
            id: 'notice-detail',
            code: 'M_HOME_P006',
            name: '공지 상세',
            docPath: '/home/notice',
            route: '/preview/notice-detail',
            breadcrumb: '홈 › 공지 상세',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '알림의 공지/시스템 안내 카드를 탭하면 진입하는 공지 상세 화면.',
            common:
              '1) 알림(M_HOME_P002)의 안내 유형 카드 탭으로 진입\n2) 공지 유형 · 등록일 · 제목 · 본문 노출\n※ 공지 카드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '공지 본문', badge: 'NOTICE', mark: 'notice',
                body: '1) 유형 태그 · 등록일 · 제목\n2) 공지 본문(점검 일시·내용 등)' },
            ],
          },
          {
            id: 'todo-all',
            code: 'M_HOME_P003',
            name: '처리할 일 전체',
            docPath: '/home/todo-all',
            route: '/preview/todo-all',
            breadcrumb: '홈 › 처리할 일 전체',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '대시보드 「지금 처리할 일」 카드의 전체 → 목적지. 유형별(CS·배송준비·재고)로 묶어 조회.',
            common:
              '1) 대시보드 「지금 처리할 일」 카드의 전체 → 로 진입\n2) 유형별 그룹(미답변 CS · 배송준비 · 재고 부족)으로 묶어 표시\n3) 항목 탭 → 해당 작업 화면으로 딥링크\n※ 리스트·카드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '미답변 CS 문의', badge: 'CS', mark: 'cs',
                body: '1) 미답변 문의를 최신순으로 나열(주문번호 · 문의 · 경과 시간)\n2) 탭 → 해당 CS 상세로 이동' },
              { title: '배송준비 주문', badge: 'ORDER', mark: 'ship',
                body: '1) 배송준비 상태 주문을 나열(주문번호 · 대표 상품 · 금액)\n2) 탭 → 주문 상세로 이동' },
              { title: '재고 부족 임박', badge: 'STOCK', mark: 'stock',
                body: '1) 잔여 10개 이하 상품을 나열(상품명 · 재고 수)\n2) 탭 → 상품 상세로 이동' },
            ],
          },
          {
            id: 'best-all',
            code: 'M_HOME_P004',
            name: '오늘 BEST 전체',
            docPath: '/home/best-all',
            route: '/preview/best-all',
            breadcrumb: '홈 › 오늘 BEST 전체',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '대시보드 「오늘 BEST」 카드의 전체 → 목적지. 오늘 판매 건수순 베스트셀러 순위.',
            common:
              '1) 대시보드 「오늘 BEST」 카드의 전체 → 로 진입\n2) 오늘(당일) 판매 건수 기준 순위\n3) 항목 탭 → 상품 상세로 이동\n※ 상품 데이터는 예시(임의 생성) · 리스트는 프로토타입 임시 조립(요청 대상)',
            sections: [
              { title: '베스트셀러 순위', badge: 'RANK', mark: 'rank',
                body: '1) 순위 + 대표 이미지 + 상품명 + 매출 + 판매 건수\n2) 상위 3위는 강조 표기\n3) 정렬 기준 = 오늘 판매 건수' },
            ],
          },
          {
            id: 'recent-all',
            code: 'M_HOME_P005',
            name: '최근 주문 전체',
            docPath: '/home/recent-all',
            route: '/preview/recent-all',
            breadcrumb: '홈 › 최근 주문 전체',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '대시보드 「최근 주문」 카드의 전체 → 목적지. 최근 주문을 상태·금액과 함께 최신순 조회.',
            common:
              '1) 대시보드 「최근 주문」 카드의 전체 → 로 진입\n2) 최신순으로 주문을 나열\n3) 카드 탭 → 주문 상세로 이동\n※ 주문 데이터는 예시(임의 생성) · 리스트는 프로토타입 임시 조립(요청 대상)',
            sections: [
              { title: '주문 목록', badge: 'LIST', mark: 'list',
                body: '1) 주문 카드 = 상태 뱃지 + 주문번호 + 시간 + 대표 상품 + 금액\n2) 상태 = 입금확인/배송준비/배송중/배송완료/주문취소\n3) 카드 탭 → 주문 상세로 이동' },
            ],
            stateTable: {
              caption: '주문 상태 뱃지',
              headers: ['상태', '색'],
              rows: [
                ['입금확인', '파랑'], ['배송준비', '주황'], ['배송중', '초록'], ['배송완료', '회색'], ['주문취소', '빨강'],
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: '주문',
    entries: [
      {
        id: 'order-list',
        code: 'M_ORDR_P001',
        name: '주문 목록',
        docPath: '/order/list',
        route: '/preview/order-list',
        breadcrumb: '주문 › 주문 목록',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '전체·입금대기·배송준비·배송중·주문취소·완료 상태별로 주문 흐름을 파악하는 주문 목록.',
        common:
          '1) 운영자가 상태별·기간별로 주문 흐름을 한눈에 파악하고 상세로 진입\n2) 기본 조회 기간 = 오늘(당일) · 최대 조회 범위 2년\n3) 데이터 갱신 = 메인 대시보드와 동일 30초 폴링 · 페이지당 20건, 하단 도달 시 자동 추가 로드\n※ 리스트·카드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '상태 탭 6종', badge: 'TAB', mark: 'tabs',
            body: '1) 전체 / 입금확인 / 배송준비 / 배송중 / 주문취소 / 배송완료 + 건수 뱃지\n2) 상태 탭 터치 시 하단 목록이 해당 상태 주문만 노출(정렬·기간 조건은 유지)\n3) 탭은 한 줄 배치 · 좌우 스크롤로 탐색(스크롤바 미표시)\n예외) 해당 상태 주문이 없으면 빈 상태 안내' },
          { title: '요약 대시보드', badge: 'STATS', mark: 'summary',
            body: '1) 총 주문 건수 · 합계 금액\n2) 금액 단위는 천 단위 콤마' },
          { title: '정렬', badge: 'SORT', mark: 'sort',
            body: '1) 최신순(기본) / 과거순 / 금액 높은순 / 금액 낮은순\n※ 정렬 드롭다운은 프로토타입 임시 조립 — 디자인시스템 요청 대상' },
          { title: '주문 목록', badge: 'LIST', mark: 'list',
            body: '1) 카드 = 상태 뱃지 · 주문번호 · 주문시각 · 대표 상품명 · 금액 · 주문자명 · 연락처 · 결제수단\n2) 대표 상품명 = 가장 먼저 담은 상품명 + "외 N"\n3) 개인정보 마스킹 = 이름(앞·뒤 1자만) · 전화번호(중간 4자리)\n4) [상세보기] → 주문 상세(M_ORDR_P002)로 이동' },
        ],
        children: [
          {
            id: 'order-detail',
            code: 'M_ORDR_P002',
            name: '주문 상세',
            docPath: '/order/detail',
            route: '/preview/order-detail',
            breadcrumb: '주문 › 주문 상세',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '개별 주문의 상품·결제·배송지·CS 요청 전체 흐름을 한 화면에서 조회.',
            common:
              '1) 운영자가 개별 주문의 전체 흐름(상품·결제·배송지·CS)을 한 화면에서 조회\n2) 이탈 시(헤더 뒤로가기) 주문 목록으로 복귀 — 직전 필터/정렬 상태 유지\n3) 데이터 갱신 = 진입 시 1회 조회 · 30초 폴링\n※ KV 상세표는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '주문 상품', badge: 'ITEM', mark: 'product',
                body: '1) 대표 이미지 · 상품명 · 옵션 · 부가세 구분 · 상품코드\n2) 주문 수량 · 상품금액 · 할인 적용 · 결제금액' },
              { title: '결제 정보', badge: 'PAY', mark: 'payment',
                body: '1) 결제수단 · 결제여부(입금처리 일시) · 입금자명 · 입금계좌 · 현금영수증 발급 상태' },
              { title: '결제 금액', badge: 'PAY', mark: 'amount',
                body: '1) 총 상품금액 · 배송비 · 도서산간 · 쿠폰할인 · 할인코드 · 포인트/즉시/APP 할인 · 최종 결제 금액\n예외) 도서산간 배송비는 0원이어도 항목 노출' },
              { title: '주문 정보', badge: 'INFO', mark: 'orderinfo',
                body: '1) 주문번호 · 주문일시 · 주문상태 · 선물상태\n2) [자세히 보기] → 상태 변경내역 모달' },
              { title: '주문자 및 배송지', badge: 'SHIP', mark: 'delivery',
                body: '1) 주문자(이름·연락처) · 수령인(이름·연락처·배송지)\n2) 배송 요청사항 · 택배사/송장번호' },
              { title: 'CS · 주문취소/반품/교환 요청', badge: 'CS', mark: 'cs',
                body: '1) 요청 유형 · 요청일 · 처리상태 · 사유 · 취소내용 · 환불 계좌 · 회수 주소\n2) [확인하기] → 첨부 사진 모달\n3) 상품 정보 표(상품명·옵션·추가상품여부·주문수량·반품/교환요청 수량)' },
              { title: 'CS · 부분취소 내역', badge: 'CS', mark: 'partial',
                body: '1) 부분취소 처리 내역 리스트\n예외) 내역이 없으면 빈 상태 안내' },
              { title: 'CS · 반품/교환 사진 요청 리스트', badge: 'CS', mark: 'photos',
                body: '1) 사진 요청 내역 리스트\n예외) 내역이 없으면 빈 상태 안내' },
            ],
            stateTable: {
              caption: '결제수단별 노출 차이',
              headers: ['결제수단', '노출'],
              rows: [
                ['무통장', '입금자명 · 입금계좌 노출'],
                ['카드', '입금자명/계좌 숨김 또는 "-"'],
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: '통계',
    entries: [
      {
        id: 'stat-hub',
        code: 'M_STAT_P001',
        name: '통계',
        docPath: '/stat',
        route: '/preview/stat-hub',
        breadcrumb: '통계 › 통계',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '매출·채널·경로·상품·담당자·공급사 등 통계 카테고리 진입 허브. (PC 반영 필요)',
        common:
          '1) 통계 4개 카테고리(매출/주문/회원/트래픽)의 세부 통계로 진입하는 시작점\n2) 각 카드 터치 → 해당 분류별 매출 화면\n※ 카드 그리드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '카테고리 그리드', badge: 'GRID', mark: 'grid',
            body: '1) 매출 현황·채널별·가입경로별·유입경로별·상품별·옵션별·담당자별·공급사별 8개 카드\n2) 카드 터치 → 해당 통계 화면으로 이동' },
        ],
      },
      {
        id: 'stat-sales',
        code: 'M_STAT_P002',
        name: '매출 현황',
        docPath: '/stat/sales',
        route: '/preview/stat-sales',
        breadcrumb: '통계 › 매출 현황',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '총·순매출, 마진, 예상 매출, 상품 매출 TOP N. (PC 반영 필요)',
        common:
          '1) 기간 기준 매출/마진 현재·어제 비교 + 이번달 예상 매출\n2) 일 매출 추이(전기/전년 비교) + 상품 매출 순위 TOP 10\n※ 차트·리스트는 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '매출 현황', badge: 'KPI', mark: 'status', body: '1) 매출·마진 현재/어제 비교' },
          { title: '이번달 예상 매출액', badge: 'KPI', mark: 'expect', body: '1) 일 평균 매출 유지 시 예상 매출/마진\n2) 지난 달 매출 대비 표기' },
          { title: '일 매출 추이', badge: 'CHART', mark: 'trend', body: '1) 일자별 매출 추이 라인 차트\n2) 전기 vs 전년 비교 토글' },
          { title: '상품 매출 순위', badge: 'LIST', mark: 'rank', body: '1) 상품별 매출 TOP 10(기본 10건)' },
        ],
      },
      statPage('stat-channel', 'M_STAT_P003', '채널별 매출', [
        { title: '채널 매출 차트', badge: 'CHART', mark: 'chart', body: '1) 매출 상위 채널 Top N(가로 바)\n2) 매출 상위 채널 비중(도넛)' },
        { title: '상품 매출 순위', badge: 'LIST', mark: 'list', body: '1) 채널별 매출 순위(정산금액 내림차순)\n2) 항목 터치 → 채널별 매출 상세' },
      ], { detail: 'M_STAT_B001', filter: 'M_STAT_B002' }),
      statPage('stat-signup', 'M_STAT_P004', '가입경로별 매출', [
        { title: '가입경로별 누적 매출', badge: 'LIST', mark: 'list', body: '1) 가입 경로(채널)별 누적 매출 순위\n2) 항목 터치 → 상세(가입자 수·구매 수·매출·마진·객단가)' },
      ], { detail: 'M_STAT_B003' }),
      statPage('stat-inflow', 'M_STAT_P005', '유입경로별 매출', [
        { title: '매출 요약', badge: 'STATS', mark: 'summary', body: '1) 유입 채널별 전체 판매금액(건수) 요약' },
        { title: '유입경로별 매출', badge: 'LIST', mark: 'list', body: '1) 유입 경로별 매출 순위\n2) 항목 터치 → 유입경로별 매출 상세' },
      ], { detail: 'M_STAT_B004', filter: 'M_STAT_B005' }),
      statPage('stat-product', 'M_STAT_P006', '상품별 매출', [
        { title: '매출 요약', badge: 'STATS', mark: 'summary', body: '1) 판매수량·상품금액·할인·결제금액·공급가·마진·PG수수료·부가세·수익' },
        { title: '상품 리스트', badge: 'LIST', mark: 'list', body: '1) 상품별 매출 순위(상품금액 내림차순)\n2) 항목 터치 → 상품별 매출 상세' },
      ], { detail: 'M_STAT_B006', filter: 'M_STAT_B007' }),
      statPage('stat-option', 'M_STAT_P007', '옵션별 매출', [
        { title: '매출 요약', badge: 'STATS', mark: 'summary', body: '1) 판매수량·상품금액·할인·결제금액·공급가·마진·수익' },
        { title: '옵션 리스트', badge: 'LIST', mark: 'list', body: '1) 옵션별 매출 순위\n2) 항목 터치 → 옵션별 매출 상세' },
      ], { detail: 'M_STAT_B008' }),
      statPage('stat-staff', 'M_STAT_P008', '담당자별 매출', [
        { title: '담당자별 매출 리스트', badge: 'LIST', mark: 'list', body: '1) 사내 담당자별 매출 순위\n2) 항목 터치 → 담당자별 매출 상세' },
      ], { detail: 'M_STAT_B009' }),
      statPage('stat-supplier', 'M_STAT_P009', '공급사별 매출', [
        { title: '공급사별 매출 리스트', badge: 'LIST', mark: 'list', body: '1) 공급사·입점 상품별 매출 순위\n2) 항목 터치 → 공급사별 매출 상세' },
      ], { detail: 'M_STAT_B010', filter: 'M_STAT_B011' }),
    ],
  },
  {
    title: '상품',
    entries: [
      {
        id: 'product-list',
        code: 'M_PROD_P001',
        name: '상품 목록',
        docPath: '/product/list',
        route: '/preview/product-list',
        breadcrumb: '상품 › 상품 목록',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '등록된 전체 상품 현황과 핵심 운영 지표(판매 상태·재고·주문·가격)를 피드로 제공.',
        common:
          '1) 등록 상품의 판매 상태·재고·주문 성과·가격 지표를 모니터링·관리\n2) 초기 진입 기본 정렬 = 최근 등록순\n3) 정렬 변경 시 새로고침 없이 비동기로 즉시 재정렬\n※ 카드·정렬 시트는 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '정렬 · 역순 재정렬', badge: 'SORT', mark: 'sort',
            body: '1) 정렬 드롭다운 11종(최근 등록/수정순 · 판매가·주문수·찜하기·마진율 높은/낮은순 · 구매후기 많은순)\n2) 정렬 선택 시 즉시 재정렬\n3) 우측 「역순으로 재정렬하기」로 현재 목록 순서 반전' },
          { title: '상품 카드', badge: 'LIST', mark: 'list',
            body: '1) 고유 넘버링(No.000) + 판매 상태 뱃지(판매중/일시품절/완전품절/준비중)\n2) 배송/서비스 태그(조건부 무료배송·무료배송·고정배송비·선물하기)\n3) 주문수·찜하기·재고 · 판매가/이전가/면세 · 마진율 · 목록 노출 · 등록/수정일\n4) 카드 터치 → 상품 상세(M_PROD_P002)로 이동' },
        ],
        children: [
          {
            id: 'product-detail',
            code: 'M_PROD_P002',
            name: '상품 상세',
            docPath: '/product/detail',
            route: '/preview/product-detail',
            breadcrumb: '상품 › 상품 상세',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '선택 상품의 메타데이터·카테고리·결제수단·가격·운영 메모 등 상세 관리 정보.',
            common:
              '1) 개별 상품의 카테고리 매핑·가격 구조·허용 결제수단·운영 메모를 조회\n2) 상품 목록 카드 클릭으로 진입\n※ KV표·결제수단 그리드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '상품 요약', badge: 'HEAD', mark: 'head',
                body: '1) No·판매 상태 · 상품명 · 대표 이미지\n2) 판매가/이전가 · 마진율 · 배송/면세 태그 · 목록 노출 · 등록/수정일' },
              { title: '상품 정보', badge: 'META', mark: 'meta',
                body: '1) 상품 식별 코드 · 담당 입점 공급사 명칭' },
              { title: '카테고리', badge: 'CATEGORY', mark: 'category',
                body: '1) 해당 상품이 연결된 복수 카테고리 경로 전체 노출' },
              { title: '부연 설명 · 연관 검색어', badge: 'DESC', mark: 'desc',
                body: '1) 마케팅용 배송/혜택 문구\n2) 내부 검색 최적화용 매핑 키워드' },
              { title: '결제수단', badge: 'PAY', mark: 'payment',
                body: '1) 주문 시 사용 가능한 다중 결제수단의 활성/비활성 현황(체크 칩)' },
              { title: '가격 정보', badge: 'PRICE', mark: 'price',
                body: '1) 공급가격 · 판매가격 · 이전 판매가격(할인 전 정가)' },
              { title: '상품 메모', badge: 'MEMO', mark: 'memo',
                body: '1) 관리자가 입력한 내부 운영/검수용 메모' },
            ],
          },
          {
            id: 'product-search',
            code: 'M_PROD_P003',
            name: '상품 검색',
            docPath: '/product/search',
            route: '/preview/product-search',
            breadcrumb: '상품 › 상품 검색',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '상품 목록 우측 상단 검색 아이콘으로 진입. 상품명 또는 상품코드로 검색.',
            common:
              '1) 상품 목록 검색 아이콘 탭으로 진입\n2) 상품명 또는 상품코드(부분 일치)로 실시간 검색\n※ 검색 필드·결과 카드는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '상품 검색', badge: 'SEARCH', mark: 'search',
                body: '1) 상단 검색 필드 = 상품명 또는 상품코드 입력\n2) 입력 즉시 결과 카드 필터링\n예외) 결과 없으면 빈 상태 안내' },
            ],
          },
          {
            id: 'product-filter',
            code: 'M_PROD_P004',
            name: '상품 필터',
            docPath: '/product/filter',
            route: '/preview/product-filter',
            breadcrumb: '상품 › 상품 필터',
            type: 'popup',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '상품 목록 우측 상단 필터 아이콘으로 열리는 바텀시트. 다중 조건 필터.',
            common:
              '1) 상품 목록 필터 아이콘 탭 → 하단에서 슬라이드업\n2) 취소/외부 영역 터치 시 반영 없이 닫힘, [적용] 시 목록 재조회\n※ 필터 바텀시트는 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '필터', badge: 'FILTER', mark: 'filter',
                body: '1) 상품상태(판매중/일시품절/완전품절/준비중)\n2) 배송형태(무료배송/조건부 무료배송/고정배송비)\n3) 과세구분(전체/과세/면세)\n4) 결제수단(신용카드·휴대폰 등)\n5) 선물하기(허용/비허용)\n6) [초기화]·[적용] · 전체 선택 시 하위 항목 자동 체크' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'MY',
    entries: [
      {
        id: 'my-account',
        code: 'M_MYPG_P001',
        name: '내 계정',
        docPath: '/my/account',
        route: '/preview/my-account',
        breadcrumb: 'MY › 내 계정',
        type: 'page',
        updatedAt: '2026-07-16',
        status: '작성 완료',
        summary: '로그인된 계정 정보 확인과 앱 설정(푸시 알림)·로그아웃을 제공하는 화면.',
        common:
          '1) 현재 로그인한 사용자의 프로필을 확인하고, 운영에 필요한 알림 설정·로그아웃을 제공\n※ 프로필 카드·설정 행은 프로토타입 임시 조립(디자인시스템 요청 대상)',
        sections: [
          { title: '계정 프로필', badge: 'PROFILE', mark: 'profile',
            body: '1) 상호명 · 이름/계정 등급 태그(대표계정) · 로그인 이메일 요약' },
          { title: '푸시 알림 진입', badge: 'LINK', mark: 'settings',
            body: '1) 알림 조건을 설정하는 상세 화면으로 진입(우측 화살표 인디케이터)\n2) 클릭 시 푸시 알림(M_MYPG_P002)으로 이동' },
          { title: '로그아웃', badge: 'ACTION', mark: 'logout',
            body: '1) 세션을 종료하고 로그인 화면으로 완전히 빠져나가는 하단 단독 버튼\n2) 클릭 시 즉시 세션 종료 후 로그인(M_CMMN_P002)으로 이동' },
        ],
        children: [
          {
            id: 'push-settings',
            code: 'M_MYPG_P002',
            name: '푸시 알림',
            docPath: '/my/push',
            route: '/preview/push-settings',
            breadcrumb: 'MY › 푸시 알림',
            type: 'page',
            updatedAt: '2026-07-16',
            status: '작성 완료',
            summary: '운영·통계 관련 세부 푸시 수신 여부를 항목별 ON/OFF로 설정하는 화면.',
            common:
              '1) 공지·매출 브리핑·CRM 지표 등 푸시 수신 여부를 항목별 ON/OFF로 설정\n2) 토글 조작 시 별도 저장 버튼 없이 실시간 통신으로 즉시 저장\n※ 토글 목록은 프로토타입 임시 조립(디자인시스템 요청 대상)',
            sections: [
              { title: '알림 설정 목록', badge: 'TOGGLE', mark: 'list',
                body: '1) 서비스 알림·공지·매출 브리핑·CRM 지표 등 총 6종 수신 제어\n2) 각 항목 우측 토글 스위치로 ON/OFF 조작\n3) 변경 즉시 저장(저장 버튼 없음)' },
            ],
            stateTable: {
              caption: '알림 항목 기본값',
              headers: ['항목', '기본'],
              rows: [
                ['서비스 알림 여부', 'ON'],
                ['쇼핑몰 주요 공지', 'ON'],
                ['오늘 매출 브리핑', 'ON'],
                ['어제 매출 브리핑', 'OFF'],
                ['지난주 매출 및 전환율 낮은 상품', 'ON'],
                ['어제의 CRM 지표 브리핑', 'OFF'],
              ],
            },
          },
        ],
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
