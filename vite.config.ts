/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 클라이언트 경로 기반 라우팅(main.tsx에서 pathname 분기). 새로고침 시 SPA fallback을 위해
// dev 서버는 미들웨어로 index.html을 돌려주고, 배포 시엔 호스팅쪽 rewrite로 처리한다.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, host: true },
});
