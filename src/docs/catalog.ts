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

export const AUTHOR = '컨버전스 최혜선';
export const DOC_TITLE = 'CONVERGENCE Docs.';

// ─────────────────────────────────────────────────────────────────────────
//  샘플 데이터 — 실제 프로젝트에선 이 배열을 자기 화면들로 교체하면 된다.
// ─────────────────────────────────────────────────────────────────────────
export const DOC_GROUPS: DocGroup[] = [
  {
    title: '어드민',
    entries: [
      {
        id: 'policy',
        name: '할인코드 정책',
        docPath: '/admin/discount-code-policy',
        route: '/preview/policy',
        breadcrumb: '어드민 › 할인코드 정책',
        type: 'page',
        updatedAt: '2026-08-28',
        status: '작성중',
        summary: '할인코드 발급·삭제·발송과 관련된 운영 정책을 한 표로 정리해 보여주는 화면. 등록·수정·검색 등 별도 기능 없이 정책 내용만 조회함.',
        common:
          '1) 상단 네비(GNB)·좌측 사이드바(LNB) 없이 정책 표 1개만 노출하는 단독 화면\n2) 등록·수정·검색 등 다른 기능 없음\n3) 실제 정책 시행 여부와 별개로, 개발·기획·CS가 공통으로 참고할 운영 기준을 문서화한 화면',
        sections: [
          { title: '할인코드 운영 정책', badge: 'TABLE', mark: 'table',
            body: '1) 번호 · 정책 항목 · 내용 순으로 표기, 총 9개 항목\n2) 유효기간(발급일로부터 3일) · 사용안함(관리자가 코드를 "사용안함"으로 설정하면 고객이 해당 코드 입력 시 쇼핑몰 주문/결제 페이지에 "사용할 수 없는 코드입니다" 안내 메시지 노출, 할인코드 수정·삭제는 「회원 › 할인코드」 화면에서 가능하되 이미 발송되었거나 고객이 사용한 코드는 수정·삭제 불가능) · 사용 완료 코드는 삭제 안 됨 등 할인코드 발급·삭제 관련 기준을 담음\n3) 삭제 시 리스트에서는 사라지되 DB에는 로그가 남음(CS 대응용) · 3일 경과 시 자동 만료 등 상태 처리 기준을 담음\n4) 마케팅 수신거부 회원 자동 제외 · 야간(밤 9시~아침 8시) 발송 제한 등 발송 대상·시간 제한 기준을 담음\n5) 발송 성공/실패 여부의 회원별 기록, 코드 발급·삭제 처리 로그(주체·시각) 등 기록·감사 기준을 담음\n예외) 표에 없는 새 정책이 생기면 이 표에 행을 추가하는 방식으로 갱신함',
            components: ['DataTable'] },
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
          '1) 실제 서비스 화면(어드민 › LIVE › 라이브 단골 관리 › 단골 리스트)을 참고해 동일 구성으로 재현함\n2) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 사용, 상단 네비는 LIVE 활성 · 좌측은 라이브 단골 관리 › 단골 리스트 활성\n3) 검색 → 회원 구분 필터 → 선택 발송 → 목록 확인 순으로 사용함\n4) 표에서 대상 선택 후 「할인코드 발송」을 누르면 할인코드 발급·발송 팝업이 열리며, 그 팝업 안에서 「할인코드 발송」·「발송내역」 2개 탭으로 등록과 이력 확인을 모두 처리함(발송 후 별도 화면으로 이동하지 않음)',
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
            body: '1) 표에서 체크한 대상에게만 「알림톡 발송」\n2) 선택 없이 「전체 고객 발송」 클릭 시 현재 검색·필터 결과 전체에게 발송\n3) 표에서 체크한 대상에게 「할인코드 발송」으로 할인코드 발급 팝업을 열어 발급·발송\n예외) 선택한 대상이 없는 상태로 「알림톡 발송」을 누르면 대상 선택 안내 후 발송을 막음\n예외) 선택한 대상이 없는 상태로 「할인코드 발송」을 누르면 발송 대상을 먼저 선택하라는 안내 후 팝업을 막음',
            components: ['Checkbox', 'FilledButton', 'OutlineButton'] },
          { title: '단골 리스트', badge: 'TABLE', mark: 'table',
            body: '1) No · 이름 · 회원 구분 · 닉네임 · 연락처 · 누적 지표(담은 횟수/구매횟수/구매금액) · 단골 등록일 순으로 표기\n2) 이름 · 연락처는 클릭 시 각각 회원 상세 · 통화 연결로 이동\n3) 누적 지표 3종은 라이브 단골 등록 이후 누적 기준으로 집계\n예외) 활동 이력이 없는 신규 단골은 누적 지표 3종 모두 0으로 표기\n※ 회원 구분(기존/신규) 배지는 표준 컴포넌트 미적용(프로토타입 임시 조립) — 디자인시스템에 아웃라인+점 배지 컴포넌트 추가 요청 대상',
            components: ['DataTable', 'Checkbox'] },
          { title: '페이지 이동', badge: 'PAGE', mark: 'pagination',
            body: '1) 목록 하단에서 페이지 단위로 이동\n2) 페이지당 노출 개수는 위 필터 영역의 선택값을 따름',
            components: ['Pagination'] },
          { title: '할인코드 발송 팝업 — 안내 문구', badge: 'NOTICE', mark: 'modal-notice',
            body: '1) 탭 영역 바로 아래, 두 탭(할인코드 발송/발송내역) 공통으로 노출 — 탭을 전환해도 항상 보임\n2) 첫 줄: 할인코드 수정·삭제는 「회원 › 할인코드」 화면에서 가능함을 안내, 화면 경로 부분([회원>할인코드])은 초록색 밑줄로 강조\n3) 둘째 줄: 단, 이미 발송되었거나 고객이 사용한 할인코드는 수정·삭제 불가능함을 안내\n4) 셋째 줄(붉은색 강조): 할인코드 유효기간(발급일로부터 3일) 안내\n5) 넷째 줄: 할인코드 사용내역은 「회원 › 할인코드 사용내역」 화면에서 확인 가능함을 안내, 화면 경로 부분([회원>할인코드 사용내역])은 초록색 밑줄로 강조' },
          { title: '할인코드 발송 팝업 — 할인코드 발송 탭', badge: 'POPUP',
            body: '1) 할인코드 등록 폼 — 사용여부(항상 ON으로 노출, 변경 불가) · 할인코드(16자, 특수기호·공백 불가) · 할인종류(금액할인/비율할인 라디오, 비율할인일 때만 최대 할인금액 입력) · 주문금액 제한(최소 주문금액) · 사용가능 환경(전체/APP/Web(PC/Mobile)) · 메모(선택) 순으로 입력, 「구분」 항목은 제외\n2) 알림톡 템플릿 선택(라디오 버튼 포함) — 기 등록된 템플릿 3개를 카카오 알림톡 도착 카드로 제공, 각 카드 우측 상단에 템플릿 타입(A타입/B타입/C타입)을 표기해 서로 구분, 카드 좌측 상단 라디오 버튼으로 1개만 단일 선택(중복 선택 불가), 선택된 카드는 테두리로 강조, 제목·본문 줄바꿈은 실제 줄바꿈으로 표시\n3) 발송을 누르면 팝업이 닫히지 않고 같은 팝업 안의 「발송내역」 탭으로 전환되며, 방금 보낸 결과가 바로 반영됨\n예외) 할인코드 미입력 또는 템플릿 미선택 상태로 발송을 누르면 발송을 막고 해당 위치에 안내 문구를 표시',
            components: ['Section', 'Row', 'Radio', 'HelperText', 'LInput', 'OutlineButton', 'FilledButton'] },
          { title: '할인코드 발송 팝업 — 할인코드 발송 탭 하단 액션', badge: 'ACTION', mark: 'modal-actions',
            body: '1) 좌측: 선택한 대상 인원수와 함께 발급·발송 대상임을 안내\n2) 우측: 취소 / 발송 버튼',
            components: ['OutlineButton', 'FilledButton'] },
          { title: '할인코드 발송 팝업 — 발송내역 탭', badge: 'POPUP',
            body: '1) 팝업 상단 탭으로 「할인코드 발송」과 전환 — 같은 팝업 안에서 등록/발송과 이력 확인을 모두 처리(별도 화면으로 이동하지 않음)\n2) 검색조건 — 이름·닉네임·연락처 통합 검색 1개, 발송일(시작일~종료일 직접 선택), 알림톡 템플릿 필터(전체/현재 사용 중인 템플릿 타입), 처리내역 상태 필터(전체/발송완료/실패)로 구성, 모든 조건은 AND로 결합\n3) 「검색」을 눌러야 조건이 목록에 반영되고, 「초기화」를 누르면 모든 조건이 기본값(발송일 전체 등)으로 돌아가며 목록도 즉시 전체로 재조회\n4) 팝업 진입 시 기본값은 발송일 전체 — 검색조건을 따로 입력하지 않아도 그동안의 발송 이력이 모두 노출됨\n5) 목록 항목 — 이름/휴대폰번호 · 닉네임·회원 구분(기존/신규) · 아이디/이메일 · 가입일 · 최종 로그인 일자/최근 구매일 · 로그인 횟수 · 마케팅 수신 동의 · 발송한 알림톡 템플릿(타입+템플릿명) · 처리내역·발송일 순으로 표기, 가로 스크롤 없이 한 화면에 다 보이도록 관련 항목끼리 한 열로 묶어 표기\n예외) 발송 이력이 전혀 없으면 검색조건과 표 대신 「발송 내역이 없습니다」 안내만 노출, 이력은 있으나 검색조건에 맞는 건이 없으면 표 대신 「검색 조건에 맞는 발송 내역이 없습니다」 안내를 노출',
            components: ['TabStrip', 'RequiredLabel', 'LInput', 'SelectBox', 'FilledButton', 'DataTable'] },
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
        id: 'discount-code-2',
        name: '할인코드',
        docPath: '/admin/discount-code-2',
        route: '/preview/discount-code-2',
        breadcrumb: '어드민 › LIVE › 할인코드 관리 › 할인코드',
        type: 'page',
        updatedAt: '2026-08-26',
        status: '작성중',
        summary: '할인코드 사용여부를 설정하고 등록된 할인코드를 검색·조회하는 어드민 화면. 참고 화면을 그대로 재현하되 「구분」에 라이브만 추가.',
        common:
          '1) 참고 화면(할인코드 사용여부 설정 화면)을 문구·배치·목데이터까지 그대로 재현함 — 발송용 「할인코드」 화면과는 별개의 독립 화면\n2) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 사용\n3) 사용여부 설정 → 검색 조건 → 리스트 순으로 구성\n4) 「구분」 라디오만 원본과 다름 — 일반/CRM 2개였던 것을 일반/CRM/라이브 3개로 늘리고 기본 선택값을 「라이브」로 둠(그 외 문구·배치·목데이터는 원본과 동일)',
        sections: [
          { title: '할인코드 사용여부 설정', badge: 'TOGGLE', mark: 'toggle',
            body: '1) 할인코드 기능 자체의 전체 사용 여부를 켜고 끄는 스위치\n2) 안내 문구로 할인코드의 정의를 설명\n3) 토글 변경 후 「적용」을 눌러야 저장됨\n예외) 기본값은 OFF(미사용)',
            components: ['Toggle', 'FilledButton'] },
          { title: '할인코드 검색', badge: 'SEARCH', mark: 'search',
            body: '1) 첫 줄: 할인코드 · 메모(관리자 메모) 텍스트 검색 + 구분(일반/CRM/라이브 라디오, 기본 라이브)\n2) 둘째 줄: 등록일 기간(직접 입력 또는 오늘/7일/15일/1개월/2개월/전체 버튼)과 사용여부(전체/사용/사용안함 라디오, 기본 전체)\n3) 초기화로 조건 전체 삭제, 검색으로 목록 재조회\n예외) 조건을 아무것도 입력하지 않고 검색하면 전체 목록 표시',
            components: ['RequiredLabel', 'TextInput', 'Radio', 'FilledButton'] },
          { title: '할인코드 리스트', badge: 'TABLE', mark: 'table',
            body: '1) 체크박스 · 구분 · 사용여부 · 할인코드 · 할인종류 · 등록일 · 사용 환경 · 메모 · 관리(수정/삭제) 순으로 표기\n2) 할인코드는 링크 스타일로 강조 표기\n3) 관리 열의 「수정」을 누르면 할인코드 수정 팝업이 열림, 「삭제」(붉은색 버튼)로 개별 코드를 삭제\n예외) 목록이 없으면 0개로 표기(빈 상태 문구는 이 화면 범위 밖)',
            components: ['DataTable', 'LCheck'] },
          { title: '할인코드 수정 팝업', badge: 'POPUP', mark: 'edit-form',
            body: '1) 항목 구성은 할인코드 등록 시 사용하는 폼과 동일(사용여부 · 할인코드 · 할인종류 · 주문금액 제한 · 사용가능 환경 · 메모), 등록 폼과 달리 별도 타이틀 없이 항목만 노출\n2) 「사용여부」만 ON/OFF 토글로 실제 변경 가능, 그 외 항목은 모두 회색 입력창으로 표시되어 조회만 가능하고 수정 불가능\n3) 하단 「적용」을 눌러야 변경한 사용여부가 저장되고 팝업이 닫힘, 「취소」를 누르면 변경 없이 닫힘',
            components: ['Section', 'Row', 'Toggle', 'Radio', 'LInput', 'OutlineButton', 'FilledButton'] },
        ],
      },
      {
        id: 'discount-code-usage',
        name: '할인코드 사용내역',
        docPath: '/admin/discount-code-usage',
        route: '/preview/discount-code-usage',
        breadcrumb: '어드민 › 회원 › 할인코드 사용내역',
        type: 'page',
        updatedAt: '2026-08-26',
        status: '작성중',
        summary: '고객이 실제로 사용한 할인코드 이력을 주문·회원 기준으로 검색·조회하는 어드민 화면. 참고 화면을 그대로 재현.',
        common:
          '1) 참고 화면(할인코드 사용 검색 화면)을 문구·배치·목데이터까지 그대로 재현함 — 등록·발급용 「할인코드」 화면과는 별개의 독립 화면\n2) 표준 셸(상단 네비 + 좌측 사이드바 + 푸터) 사용, 좌측 사이드바는 「회원」 메뉴로 「할인코드 사용내역」이 활성 상태\n3) 검색 조건 → 리스트 순으로 구성',
        sections: [
          { title: '할인코드 사용 검색', badge: 'SEARCH', mark: 'search',
            body: '1) 첫 줄: 구분(일반/CRM 라디오, 기본 일반) · 주문번호 · 할인코드 텍스트 검색\n2) 둘째 줄: 주문일 기간(직접 입력 또는 오늘/7일/15일/1개월/2개월/전체 버튼) · 사용 환경(전체/APP/Web(PC/Mobile) 라디오, 기본 전체) · 회원 구분(전체/회원/비회원 라디오, 기본 전체)\n3) 셋째 줄: 아이디 · 이름 · 연락처 · 이메일 텍스트 검색\n4) 초기화로 조건 전체 삭제, 검색으로 목록 재조회\n예외) 조건을 아무것도 입력하지 않고 검색하면 전체 목록 표시',
            components: ['Radio', 'LInput', 'FilledButton'] },
          { title: '할인코드 사용 리스트', badge: 'TABLE', mark: 'table',
            body: '1) 체크박스 · No · 구분 · 주문일 · 주문번호 · 할인코드 · 할인종류 · 사용 환경 · 아이디/이름 · 연락처/이메일 순으로 표기\n2) 우측 상단 「할인코드 사용내역」 버튼으로 현재 목록을 파일로 내려받음\n3) 우측에서 페이지당 노출 개수를 선택\n예외) 목록이 없으면 0건으로 표기(빈 상태 문구는 이 화면 범위 밖)',
            components: ['DataTable', 'LCheck', 'SelectBox'] },
        ],
      },
    ],
  },
  {
    title: '고객뷰어',
    entries: [],
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
