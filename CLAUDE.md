<!-- docs 시스템 개발 : 김희연 / 2026.06.01 -->

# CONVERGENCE Docs — 기획서 프로토타입 제작 지침 (for Claude Code)

이 저장소는 **기획 문서 프로토타입 표준 포맷**이다. 이 CLAUDE.md는
**Claude Code(너)** 가 이 포맷으로 새 기획서 프로토타입을 만들 때의 지침이다.
아래 규칙과 데이터 모델만 따르면 화면 트리·프리뷰·설명·마커·코멘트·배포리스트가 자동 구성된다.

---

## 🧭 세션 연속성 — 새 세션은 여기부터 (마지막 갱신 2026-07-09)

> ⚠️ **이 폴더에서 Claude Code를 새로 열면 이전 세션 메모리는 안 보인다**(예전 개발은 다른 경로 `~/projects/flexg_live_2` 세션에서 진행됨). **이 CLAUDE.md가 유일한 컨텍스트다.** 작업 상태가 바뀌면 이 절을 반드시 갱신할 것.

### 저장소 유래 · 위치 · 원격
- 원래 개인 로컬 `~/projects/flexg-docs-template`(로컬전용)에서 개발 → **2026-07-09 회사 org로 이관.**
- **작업 폴더(현재)**: `~/weed_projects_heeyeon/convergence-docs-template-heeyeon-2026-07`
- **원격**: `git@github-company:WEED-Convergence/convergence-docs-template-heeyeon-2026-07.git` (private)
- **회사 push 방법**: SSH 별칭 `github-company`(키 `~/.ssh/id_ed25519_company`, 인증 신원 `WEED-Convergence`)로만 됨. 개인 `gh`(yeonying-smile)는 이 org 접근 불가 → org 레포 생성은 회사계정 웹, push는 이 SSH 리모트.
- 원본은 `~/projects/_ARCHIVED-flexg-docs-template--migrated-to-weed-2026-07` 로 아카이브(**사용 금지**).

### git 규칙
- **커밋·push·PR은 사용자가 명시 지시할 때만.** 작업 마무리라는 이유로 알아서 커밋하지 않는다. 기본은 "수정만 하고 보고".
- 관련 변경은 한 번에 모아서(기능마다 쪼개지 말 것). 커밋 위생: `node_modules`·`tsconfig.tsbuildinfo` 커밋 금지(`.gitignore` 반영됨).

### 현재 진행 상태 (작업 로그)
- ✅ **샘플 대시보드(홈)** Figma 정밀 구현 완료 — `/docs/dashboard`(=`/preview/dashboard`, `src/demo/DemoScreens.tsx`의 `Dashboard`). Figma file `1pTvqSYmvdYcNTyAnXRdfy`. 6영역: ①프로모배너 ②오늘의할일 ③CRM현황·지표 ④쇼핑몰현황(DatAI 실시간표 + 신규가입/리워드 표 + 매출카드 + 배너) ⑤유료서비스현황 ⑥구매후기·상품문의·공지. `data-doc-mark`: promo/todo/crm/shop/paid/reviews.
- ✅ **표준 컴포넌트 확장**(모두 `/components` 갤러리 등록): `KVColumns`(열 타입 4종 rows/center/lines/nodes), `SectionHead`(`more`=더보기 링크), `Stars`(`size`), `NoticeList`(흰 박스+상하 회색선·첫 줄 bold·항목 사이 선 없음). DatAI 표는 헤더/본문을 **공용 grid 컬럼**(`DATAI_COLS`, `minmax(0,…)`)으로 정렬(세로선 편차 0).
- 🔄 **진행중(#40): `/components` 갤러리 shadcn식 개편** — `src/docs/ComponentGallery.tsx` 리팩터 중.
  - 목표: 좌측 **알파벳순 평면 목록**(+검색, area 태그, 중복이름 Toggle×2는 slug로 유일화) / 중앙 **개별 컴포넌트 페이지**(미리보기→Props표→사용법) / 우측 **On This Page** / **`/components/<slug>` 라우팅**(pushState+popstate).
  - `CompEntry`에 `props?: PropRow[]` 필드 추가함. `ALL`(평면 정렬 목록)·`byId`·`PAGE_SECTIONS` 추가함.
  - **미완일 수 있음** — 리팩터 도중이면 `CompRow`/구 목록 JSX 제거와 새 마스터-디테일 뷰 연결이 남아 tsc 에러가 있을 수 있으니 이어서 완성할 것.
- ⏭ **남은 일**: (1) Props 데이터 채우기(대시보드·어드민 표준부터) (2) tsc+로컬 검증.

### 검증 방법
- 타입: `npx tsc --noEmit`
- 로컬: `npm run dev` → http://localhost:3000 · 문서 `/docs` · 대시보드 `/docs/dashboard` · 컴포넌트 `/components`
- Figma 대조: `get_design_context`/`get_screenshot`로 노드 받아 픽셀 비교(헤더/본문 정렬·셀 여백 꼼꼼히).

---

## 🧑‍💻 Claude Code로 작업할 때 — 필독 (작업 규칙)

이 저장소에서 Claude Code로 작업할 땐 아래를 **매번** 지킨다.

1. **모든 작업을 투두리스트로 표기한다.** (TaskCreate/TaskUpdate) 시작 시 등록 → 시작하면 `in_progress` → 끝나면 `completed`. 지시가 여러 개 쌓이면 각각 별도 투두로(누락 방지). 사용자가 진행상황을 실시간으로 보게.
2. **모호하면 임의로 진행하지 않는다.** 먼저 되묻거나 제안(안)을 제시 → 확인 → 구현. 변경이 크면 코드부터 치지 말고 체크리스트·제안부터.
3. **표준 컴포넌트를 먼저 쓴다.** `/components`(CONVERGENCE 컴포넌트 표준)에 정의된 컴포넌트로 화면을 조립한다.
   - 어드민 `src/components/admin/*`(parts·formParts·atoms·dashboardAtoms) · 송출앱 `src/broadapp/*` · 고객뷰어·샵 `src/viewer`·`src/shop`.
4. **표준에 없어 새로 만든 컴포넌트는 반드시 `/components` 갤러리에 등록한다.** (`src/docs/ComponentGallery.tsx` 의 `ITEMS`) — 미리보기 + 설명 + props 태그 + 사용 코드. 등록 안 하면 다음 사람이 또 새로 만든다.
5. **어드민 화면은 `AdminLayout` 으로 감싼다.** (상단 네비 + 사이드바 + 본문 + 푸터 표준 셸) 홈은 `navActive="home"`, 목록 화면은 해당 메뉴 라벨.
6. **Figma → 화면 만들 때 순서:** ① 노드를 `get_design_context` 로 분석(치수·색·텍스트·이미지) → ② 표준 컴포넌트로 구성, 없으면 새 컴포넌트 생성(+④ 갤러리 등록) → ③ 실제 이미지·아이콘은 `public/figma-assets/` 에 받아 사용 → ⑤ 설명 마커 `data-doc-mark` 연결.
7. **끝나면 검증한다.** `npx tsc -b` 통과 + 로컬(`npm run dev`)에서 화면 확인.
8. **셸(DocsShell) 레이아웃 코드는 건드리지 않는다.** 데이터(카탈로그)·프리뷰 화면·컴포넌트만 채운다.

> 컴포넌트 카탈로그: `/components` (CONVERGENCE 컴포넌트 표준) — 어떤 표준 컴포넌트가 있는지 먼저 여기서 확인.

---

## 이 포맷이 뭘 만들어 주나

한 화면(iframe 프리뷰) + 그 화면의 설명(우측 패널) + 화면 위 번호 마커 + 피그마식 코멘트를
트리로 묶은 기획 문서. 배포(릴리즈)별 변경 이력을 표로 보는 **배포리스트** 페이지도 포함.

## 3분할 구조

| 영역 | 내용 | 소스 |
| --- | --- | --- |
| 좌측 | 그룹 → 페이지 → 팝업 트리 · 검색 · 배포리스트 진입 | `DocsShell.tsx` |
| 중앙 | 실제 화면 프리뷰(iframe) + 번호 마커 + 코멘트 핀 + 탭 | `DocsShell.tsx` + 프리뷰 화면 |
| 우측 | 화면 설명 — 공통 개요 · 구성(섹션=마커) · 상태별 표 | `DocsShell.tsx` |

## 새 화면(기획서 한 장) 추가 절차

1. **프리뷰 화면을 만든다.** `src/demo/DemoScreens.tsx` 처럼 실제 UI를 그린다.
   설명과 이을 요소에 `data-doc-mark="키"` 를, 탭이 있으면 컨테이너에 `data-doc-tab="탭명"` 을 단다.
   그리고 `/preview/<id>` 라우트에서 렌더되게 `main.tsx` 분기에 연결한다.
2. **`src/docs/catalog.ts` 의 `DOC_GROUPS` 에 `DocEntry` 를 추가한다.** (아래 모델 참고)
3. `sections[].mark` 를 화면의 `data-doc-mark` 값과 일치시키면 번호 마커가 자동으로 얹힌다.
4. 변경 이력이 있으면 `FEATURES` 에 `Feature` 를 추가한다 → 배포리스트 표에 자동 반영.

## 데이터 모델 (catalog.ts)

```ts
DocEntry {
  id: string          // URL(/docs/<id>) · 마커/코멘트 키 (고유)
  code?: string       // 화면 코드 (예: ADM-P001)
  name: string        // 화면명
  route: string       // 프리뷰 iframe src (예: /preview/dashboard)
  breadcrumb: string  // 상단 경로
  type: 'page' | 'popup'
  summary: string     // 한 줄~문단 요약
  common?: string     // ★ 공통 개요/규칙 — 탭 무관 항상 노출 (1)/2) 로 작성)
  sections: DocSection[]
  tabs?: string[]     // 탭 화면이면 탭명 목록 (data-doc-tab 값)
  stateTable?: { caption?, headers[], rows[][] }  // 상태별 표
  children?: DocEntry[]  // 소속 팝업
  updatedAt?: string  // YYYY-MM-DD
}
DocSection { title; badge?; body; mark?; context? }  // mark=data-doc-mark, context=탭명
Feature { id; release; kind: 'add'|'change'|'fix'; title: '주제 : 내용'; desc; screens: DocEntry.id[] }
Release { id; label; status: 'released'|'planned'; note? }
```

## 작성 규칙 (반드시 지킴 — 사람용 지침은 `docs/지침.md`)

1. **명료 선언형.** 줄글("~합니다") 금지 → 명사형·"~함". 항목 여럿이면 `1) 2) 3)` 으로 쪼갠다.
2. **표로 가능한 건 표로.** 상태·권한·탭 구성처럼 축이 둘 이상이면 `stateTable` 로. "A일 때 X, B일 때 Y"가 2개 이상이면 표.
3. **공통 영역 필수.** 마커로 못 찍는 개요·전제·공통 규칙은 `common` 에 쓴다(항상 노출).
4. **코드 식별자·내부 용어 금지.** 컴포넌트명·상태값·내부 라우트 대신 비개발자도 아는 말로.
5. **변경 프레이밍 금지.** 확정 배포 외에는 "기존 A→B/개편/변경" 대신 그 스펙을 현재형으로.
6. **마커는 요소 왼쪽 위 모서리**, 번호는 화면 좌표(위→아래) 자동. 색: 마커=분홍, 코멘트 핀=파랑.
7. **UI에 이모지 금지** — SVG 아이콘 컴포넌트로.

## 스택 / 실행

- Vite + React 19 + TypeScript + Chakra UI v3, 폰트는 전체 **Pretendard**.
- 코멘트는 `localStorage`(브라우저 한정). 팀 공유가 필요하면 `commentStore.ts` 만 원격 백엔드로 교체(공개 API 동일).
- `npm install && npm run dev` → http://localhost:3000

## 하면 안 되는 것

- 프리뷰 화면(iframe)과 docs 셸은 **같은 출처**여야 마커 앵커링이 된다(cross-origin 금지).
- 데이터(카탈로그/릴리즈)만 채우고 셸 레이아웃 코드는 건드리지 않는다.
