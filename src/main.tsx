/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { DocsShell } from './docs/DocsShell';
import { DemoScreen } from './preview/screens';
import { ComponentGallery } from './design-system'; // 공개 배럴로 소비(단방향)

// 클라이언트 경로 분기 —
//   /preview/*   → 프리뷰용 샘플 화면(iframe 안에서 렌더)
//   /components  → 주요 컴포넌트 갤러리
//   그 외         → 기획 문서 셸(CONVERGENCE Docs)
const path = window.location.pathname;
const isPreview = path.startsWith('/preview/');
const isComponents = path.startsWith('/components');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      {isPreview ? <DemoScreen /> : isComponents ? <ComponentGallery /> : <DocsShell />}
    </ChakraProvider>
  </StrictMode>,
);
