// 송출앱 인라인 아이콘 모음 (라이브/모니터링 공용)
const S = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const EyeIcon = ({ s = 16, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const BagIcon = ({ s = 16, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M6 7h12l-1 13H7L6 7Z" stroke={color} strokeWidth="1.8" />
    <path d="M9 7a3 3 0 0 1 6 0" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const HeartIcon = ({ s = 16, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const ClockIcon = ({ s = 12, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const PencilIcon = ({ s = 20, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M14.5 5.5 18.5 9.5M4 20l1-4L16 5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const MicIcon = ({ s = 28, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" {...S}>
    <rect x="11" y="5" width="6" height="11" rx="3" stroke={color} strokeWidth="1.6" />
    <path d="M8 13a6 6 0 0 0 12 0M14 19v3M11 22h6" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const VideoIcon = ({ s = 28, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" {...S}>
    <rect x="4" y="8" width="14" height="12" rx="2.5" stroke={color} strokeWidth="1.6" />
    <path d="M18 12l6-3v10l-6-3v-4Z" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const ChatIcon = ({ s = 28, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" {...S}>
    <path d="M5 7h18v12H12l-5 4v-4H5V7Z" stroke={color} strokeWidth="1.6" />
    <path d="M10 12h8M10 15h5" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const BannerIcon = ({ s = 28, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" {...S}>
    <rect x="4" y="6" width="20" height="16" rx="2.5" stroke={color} strokeWidth="1.6" />
    <circle cx="10" cy="12" r="2" stroke={color} strokeWidth="1.6" />
    <path d="M5 19l6-5 4 3 4-4 4 4" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const BoxIcon = ({ s = 28, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" {...S}>
    <path d="M14 4 24 9v10l-10 5L4 19V9l10-5Z" stroke={color} strokeWidth="1.6" />
    <path d="M4 9l10 5 10-5M14 14v10" stroke={color} strokeWidth="1.6" />
  </svg>
);

// 카메라 전환 (회전 화살표 + 카메라)
export const SwitchIcon = ({ s = 24, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M4 8a8 8 0 0 1 13.5-3.5L20 7M20 4v3h-3M20 16a8 8 0 0 1-13.5 3.5L4 17M4 20v-3h3" stroke={color} strokeWidth="1.7" />
    <circle cx="12" cy="12" r="2.3" stroke={color} strokeWidth="1.7" />
  </svg>
);

// 공지 스피커
export const NoticeIcon = ({ s = 16, color = '#fff' }: { s?: number; color?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}>
    <path d="M4 9v6h3l7 4V5L7 9H4Z" stroke={color} strokeWidth="1.7" />
    <path d="M17.5 8.5a5 5 0 0 1 0 7" stroke={color} strokeWidth="1.7" />
  </svg>
);
