/* ============================================================
 *  CONVERGENCE Design System — 공개 배럴(public surface)
 * ------------------------------------------------------------
 *  이 폴더(design-system/)는 self-contained 이다.
 *  docs/ · preview/ · main.tsx 등 "밖"에서만 이 배럴을 통해 소비한다.
 *  design-system 내부는 docs/·preview/를 절대 import 하지 않는다(단방향).
 *  → 향후 이 폴더를 통째로 별도 레포/패키지(Storybook 격)로 추출 가능.
 *
 *  계층: 서비스(flexg …) → 페이지(admin·broadapp·viewer·shop) → 컴포넌트
 * ============================================================ */

// 컴포넌트북(디자인 시스템 문서 뷰)
export { ComponentGallery } from './gallery/ComponentGallery';

// 디자인 토큰 (현재 FLEXG)
export * from './tokens';

// ── 표준 컴포넌트 공개 surface (프로토타입 조립용) ──
// 밖(preview/docs)에서 화면을 조립할 땐 deep import 하지 말고 이 배럴로만 가져온다.
// FLEXG · 어드민
export { AdminLayout } from './components/flexg/admin/AdminLayout';
export {
  SectionHead, StatCard, StatusPill, PillStatCard, InfoCard, SubBox,
  LabelValueTable, KVColumns, PromoBanner, AdBanner, NoticeList, Stars,
} from './components/flexg/admin/dashboardAtoms';

// FLEXG · 모바일 앱 chrome (운영 모바일 앱 화면 조립용 표준 컴포넌트)
// broadapp 계층에서 브랜드 무관한 공통 모바일 요소만 공개한다.
export { StatusBar, HomeIndicator, BackArrow, Toggle } from './components/flexg/broadapp/frame';
export {
  Chevron, IconButton, AppButton, Dialog, BottomSheet,
  InfoDot, FieldLabel, TextField, SelectRow,
} from './components/flexg/broadapp/components';
