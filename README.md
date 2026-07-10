<!-- ============================================================
     docs 시스템 개발 : 김희연 / 2026.06.01
     ============================================================ -->

# CONVERGENCE Docs — 기획 문서 표준 템플릿

Heeyeon Kim 기획 문서(HY Docs) 화면의 **골격만** 뽑아낸 표준 스타터.
레이아웃 · 디자인(테마) · 화면 위 번호 마커 · 피그마식 핀 코멘트 구조만 들어있고,
실제 콘텐츠(배포월/변경이력/백로그 등)는 없다. 여기에 자기 화면을 끼우면 된다.

> docs 시스템 개발 : 김희연 / 2026.06.01

## 시작하기 (팀원 필독)

처음이라면 **[`START.md`](START.md)** 만 보면 됩니다. **Claude Code로 열고 `/start`** 를 치거나, 그냥 "새 화면 만들래" 라고 말하면 알아서 안내합니다. (상세: [`docs/지침.md`](docs/지침.md))

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

- `/docs` · `/docs/<화면id>` — 기획 문서 셸(3분할 화면)
- `/preview/<화면id>` — iframe 안에 뜨는 샘플 화면(실제 앱 화면 자리)

## 구조

```
src/
  main.tsx              진입 라우팅 (/preview/* → 프리뷰, /components → 컴포넌트북, 그 외 → 문서 셸)
  docs/                 기획 문서 툴(프로젝트별 스펙)
    catalog.ts          ★ 화면 정의(그룹·페이지·팝업·섹션·마커·탭·상태·상태표) — 여기만 채우면 됨
    DocsShell.tsx       3분할 레이아웃 · 라이트/다크 테마 · 번호 마커 앵커링 · 작업페이지 인덱스
    DocComments.tsx     피그마식 핀 코멘트 오버레이
    commentStore.ts     코멘트 저장소 (localStorage — 원격 백엔드로 교체 가능)
  preview/
    screens.tsx         프리뷰용 화면(실제 프로젝트에선 진짜 앱 화면으로 대체)
  design-system/        디자인 시스템(컴포넌트북) — self-contained, 배럴 index.ts로만 소비
    components/flexg/    서비스별 표준 컴포넌트(admin·broadapp·viewer·shop)
    tokens.ts           디자인 토큰
    gallery/            컴포넌트북 문서 뷰(/components)
```

## 세 개의 패널

| 영역 | 내용 |
| --- | --- |
| 좌측 | 작업 영역(그룹) → 페이지 → 팝업 트리 · 검색 · 코멘트 수 뱃지 |
| 중앙 | 실제 화면 프리뷰(iframe) + 번호 마커 + 코멘트 핀 + 탭 전환 |
| 우측 | 화면 설명 — 요약 · 구성(섹션, 번호=화면 마커) · 상태별 표 |

## 화면 추가하는 법

1. `src/docs/catalog.ts` 의 `DOC_GROUPS` 에 `DocEntry` 를 추가한다.
2. 프리뷰로 띄울 화면을 `src/preview/screens.tsx` 에 만들고 `route` 를 그 경로로 지정한다.
   (표준 컴포넌트는 `src/design-system` 배럴에서 가져와 조립한다.)
3. 설명 항목(`sections`)에 `mark: '키'` 를 주고, 화면 요소에 `data-doc-mark="키"` 를 달면
   그 요소 위에 번호 마커가 자동으로 얹히고 우측 설명 항목과 같은 번호로 매칭된다.
4. 탭이 있는 화면은 `tabs: [...]` 를 주고, 화면 요소에 `data-doc-tab="탭명"`,
   섹션에 `context: '탭명'` 을 달면 탭 전환 시 해당 탭 설명·코멘트만 노출된다.

## 코멘트

- 상단 **코멘트** 토글 → 핀 표시 · 스레드 열기.
- **핀 추가** → 화면을 클릭해 새 핀 배치. 핀은 드래그로 이동, 답글 · 해결 · 삭제 지원.
- 현재는 `localStorage` 저장(이 브라우저 한정). 팀 실시간 공유가 필요하면
  `commentStore.ts` 만 원격 백엔드(예: Supabase)로 교체하면 UI 코드는 그대로다.

## 배포

- git · 호스팅 계정은 회사 계정으로 사용하되 부서원 각 PC에서 특정 폴더를 회사 프로젝트 폴더로 지정 후 SSH config 설정하여 사용하는 형태로 처리한다.
- 정적 SPA 이므로 SPA fallback(모든 경로 → `index.html`)이 필요하다. Vercel은 루트 `vercel.json`의 catch-all rewrite로 처리(포함됨). 없으면 중앙 프리뷰 `/preview/*` 가 404 난다.
