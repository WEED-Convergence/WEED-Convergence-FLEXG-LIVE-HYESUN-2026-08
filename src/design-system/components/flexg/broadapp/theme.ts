// 송출앱(F Live) 디자인 토큰 — Figma 1pTvqSYmvdYcNTyAnXRdfy 기준
// 본문은 Pretendard, 스플래시 빅타이틀은 Gmarket Sans Bold.

export const FONT = "'Pretendard', system-ui, sans-serif";
export const TITLE_FONT = "'GmarketSansBold', 'Pretendard', sans-serif";

export const c = {
  black: '#010101', // 앱 배경/헤더
  red: '#FF2F2F', // FgRed — LIVE, 포인트
  white: '#FFFFFF',
  gr22: '#222222',
  gr42: '#424242', // 라벨 강조
  gr72: '#727272',
  gr92: '#929292', // placeholder/보조
  grB8: '#B8B8B8',
  grD8: '#D8D8D8',
  grE8: '#E8E8E8',
  grF2: '#F2F2F2', // 탭 트랙
  grF8: '#F8F8F8', // 인풋/카드 배경
} as const;

// public/figma-assets/broadapp 경로 헬퍼
export const basset = (name: string) => `/figma-assets/broadapp/${name}`;

// iPhone 16 Pro 논리 해상도 (points)
export const SCREEN_W = 393;
export const SCREEN_H = 852;
export const STATUS_H = 54; // 상태바(다이내믹 아일랜드 영역) 높이
