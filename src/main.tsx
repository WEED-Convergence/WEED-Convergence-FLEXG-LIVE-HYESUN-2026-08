/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { DocsShell } from './docs/DocsShell';
import { DemoScreen } from './preview/screens';
import { DiscountCode2 } from './preview/discountCode2'; // 신규 독립 화면(screens.tsx 미수정) — 추가 전용 라우팅
import { DiscountCodeUsage } from './preview/discountCodeUsage'; // 신규 독립 화면(할인코드 사용내역) — 추가 전용 라우팅
import { Policy } from './preview/policy'; // 신규 독립 화면(할인코드 정책) — 추가 전용 라우팅
import { ComponentGallery } from './design-system'; // 공개 배럴로 소비(단방향)

// 클라이언트 경로 분기 —
//   /preview/discount-code-2      → 신규 독립 화면(할인코드2, screens.tsx와 무관)
//   /preview/discount-code-usage  → 신규 독립 화면(할인코드 사용내역, screens.tsx와 무관)
//   /preview/policy               → 신규 독립 화면(할인코드 정책, screens.tsx와 무관)
//   /preview/*   → 프리뷰용 샘플 화면(iframe 안에서 렌더)
//   /components  → 주요 컴포넌트 갤러리
//   그 외         → 기획 문서 셸(CONVERGENCE Docs)
const path = window.location.pathname;
const isDiscountCode2 = path === '/preview/discount-code-2';
const isDiscountCodeUsage = path === '/preview/discount-code-usage';
const isPolicy = path === '/preview/policy';
const isPreview = path.startsWith('/preview/');
const isComponents = path.startsWith('/components');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      {isDiscountCode2 ? <DiscountCode2 /> : isDiscountCodeUsage ? <DiscountCodeUsage /> : isPolicy ? <Policy /> : isPreview ? <DemoScreen /> : isComponents ? <ComponentGallery /> : <DocsShell />}
    </ChakraProvider>
  </StrictMode>,
);
