<!-- docs 시스템 개발 : 김희연 / 2026.06.01 -->

# CONVERGENCE Docs — 기획서 프로토타입 제작 지침 (for Claude Code)

이 저장소는 **기획 문서 프로토타입 표준 포맷**이다. 이 CLAUDE.md는
**Claude Code(너)** 가 이 포맷으로 새 기획서 프로토타입을 만들 때의 지침이다.
아래 규칙과 데이터 모델만 따르면 화면 트리·프리뷰·설명·마커·코멘트·배포리스트가 자동 구성된다.

---

## 🚀 프로토타입 시작 — 질문으로 시작 (팀원용·필독)

> 이 저장소를 받아 **새 프로토타입을 시작하면**, Claude Code는 곧바로 코드를 치지 말고 **아래 2가지를 먼저 질문**한다. 답을 받은 뒤 그 서비스·페이지의 **표준 컴포넌트로만** 화면을 조립한다.

1. **"어떤 서비스를 만드시나요?"** — FLEXG · 발주모아 · 캐치셀 · PAGE
   - 서비스마다 컴포넌트·디자인 토큰(브랜드 색)이 **다르다.** 공통 레이어는 없다(부서가 다름).
2. **"어떤 페이지(영역)를 작업하시나요?"** — 그 서비스의 area
   - 예) FLEXG: 어드민 · 송출앱 · 고객뷰어 · 샵.
3. → **그 서비스+페이지의 표준 컴포넌트**(`/components/<service>`)로 화면을 조립한다. 없으면 새로 만들고 **반드시 갤러리에 등록**(아래 규칙 3·4).

- 서비스가 정해지면 **그 서비스의 디자인 토큰(`var(--Fg…)`)** 으로만 색을 지정한다. 하드코딩 금지.
- 컴포넌트북 구조: **서비스 → 페이지(area) → 컴포넌트**. 각 컴포넌트 페이지 = Preview · Variants · Props · Usage(React·HTML·CSS) · Guidelines.
- 개요는 `/docs/overview`(시작하기), 컴포넌트북은 `/components/<service>`.

---

## 🧑‍💻 Claude Code로 작업할 때 — 필독 (작업 규칙)

이 저장소에서 Claude Code로 작업할 땐 아래를 **매번** 지킨다.

1. **모든 작업을 투두리스트로 표기한다.** (TaskCreate/TaskUpdate) 시작 시 등록 → 시작하면 `in_progress` → 끝나면 `completed`. 지시가 여러 개 쌓이면 각각 별도 투두로(누락 방지). 사용자가 진행상황을 실시간으로 보게.
2. **모호하면 임의로 진행하지 않는다.** 먼저 되묻거나 제안(안)을 제시 → 확인 → 구현. 변경이 크면 코드부터 치지 말고 체크리스트·제안부터.
3. **표준 컴포넌트를 먼저 쓴다.** `/components`(CONVERGENCE 컴포넌트 표준)에 정의된 컴포넌트로 화면을 조립한다.
   - 어드민 `src/components/admin/*`(parts·formParts·atoms·dashboardAtoms) · 송출앱 `src/broadapp/*` · 고객뷰어·샵 `src/viewer`·`src/shop`.
4. **표준에 없어 새로 만든 컴포넌트는 반드시 `/components` 갤러리에 등록한다.** (`src/docs/ComponentGallery.tsx` 의 `GROUPS` — 해당 서비스·area 그룹에 `CompEntry` 추가) — Preview·Variants·Props·Usage(React·HTML·CSS)·Guidelines. 같은 성격이면 낱개로 쪼개지 말고 표준 1개 + Variants로. 등록 안 하면 다음 사람이 또 새로 만든다.
5. **어드민 화면은 `AdminLayout` 으로 감싼다.** (상단 네비 + 사이드바 + 본문 + 푸터 표준 셸) 홈은 `navActive="home"`, 목록 화면은 해당 메뉴 라벨.
6. **Figma → 화면 만들 때 순서:** ① 노드를 `get_design_context` 로 분석(치수·색·텍스트·이미지) → ② 표준 컴포넌트로 구성, 없으면 새 컴포넌트 생성(+④ 갤러리 등록) → ③ 실제 이미지·아이콘은 `public/figma-assets/` 에 받아 사용 → ⑤ 설명 마커 `data-doc-mark` 연결.
7. **끝나면 검증한다.** `npx tsc -b` 통과 + 로컬(`npm run dev`)에서 화면 확인.
8. **셸(DocsShell) 레이아웃 코드는 건드리지 않는다.** 데이터(카탈로그)·프리뷰 화면·컴포넌트만 채운다.
9. **커밋·push·PR은 사용자가 명시 지시할 때만.** 작업 마무리라는 이유로 알아서 커밋하지 않는다. 기본은 "수정만 하고 보고".

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
