/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// 대시보드(홈) 구성용 재사용 컴포넌트 — 어드민 표준 컴포넌트에 없던 요소를 정의.
// 컴포넌트 갤러리(CONVERGENCE 컴포넌트 표준)에도 등록됨.
import type { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { colors, FONT, asset } from '../../styles/tokens';

/** 광고/홍보 이미지 배너 — 이미지 + (선택)AD 마크. 대시보드 상단 배너 행. */
export function AdBanner({ src, ad = false, alt = '', flex, w }: { src: string; ad?: boolean; alt?: string; flex?: string; w?: string }) {
  return (
    <Box position="relative" flex={flex} w={w} borderRadius="8px" overflow="hidden" flexShrink={0}>
      <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
      {ad && <img src={asset('dashboard/ad-mark.svg')} alt="AD" style={{ position: 'absolute', top: 0, right: 0, width: 27, height: 20 }} />}
    </Box>
  );
}

/** 섹션 헤드 — 제목(18px) + 인라인 안내문(ⓘ …) + (선택)우측 "더보기 ›" 링크. 대시보드 섹션 상단. */
export function SectionHead({ title, helper, more }: { title: string; helper?: string; more?: boolean }) {
  return (
    <Flex align="center" gap="12px" pb="10px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="18px" color={colors.gr42} letterSpacing="-0.36px" whiteSpace="nowrap">{title}</Text>
      {helper && <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} whiteSpace="nowrap">{helper}</Text>}
      {more && (
        <>
          <Box flex="1" />
          <Text as="button" fontFamily={FONT} fontSize="12px" color={colors.gr92} whiteSpace="nowrap" cursor="pointer" flexShrink={0}>더보기 ›</Text>
        </>
      )}
    </Flex>
  );
}

/** 지표 카드 — 라벨 + 회색 박스 안 큰 숫자(Arial). danger면 숫자 빨강(취소/반품 등). */
export function StatCard({ label, value, danger = false, w }: { label: string; value: string; danger?: boolean; w?: string }) {
  return (
    <Box flex={w ? undefined : '1'} w={w} minW="0" bg="white" border={`1px solid ${colors.grE8}`} borderRadius="16px" p="16px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr72} textAlign="center" letterSpacing="-0.24px" pb="12px">{label}</Text>
      <Flex bg={colors.grF8} borderRadius="12px" py="17px" align="center" justify="center">
        <Text fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={danger ? colors.red : colors.gr42} lineHeight="1">{value}</Text>
      </Flex>
    </Box>
  );
}

/** 상태 알약 — 진행중(초록)/종료(회색)/중지(빨강). 솔리드 pill. */
export type PillTone = 'active' | 'ended' | 'stopped';
export function StatusPill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  const bg = { active: colors.green, ended: colors.grB8, stopped: colors.red }[tone];
  return (
    <Flex bg={bg} borderRadius="24px" px="10px" py="4px" align="center" justify="center" w="fit-content">
      <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color="white" whiteSpace="nowrap">{children}</Text>
    </Flex>
  );
}

/** 상태 알약 + 숫자 카드 — 진행중/종료/중지처럼 상태별 건수. (테두리 없음 · 숫자 박스가 남는 높이를 채움) */
export function PillStatCard({ tone, label, value }: { tone: PillTone; label: string; value: string }) {
  return (
    <Flex flex="1" minW="0" h="100%" direction="column" align="center" gap="12px" pt="4px">
      <StatusPill tone={tone}>{label}</StatusPill>
      <Flex flex="1" w="100%" minH="52px" bg={colors.grF8} borderRadius="12px" align="center" justify="center">
        <Text fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={colors.gr42} lineHeight="1">{value}</Text>
      </Flex>
    </Flex>
  );
}

/** 카드 컨테이너 — 제목 헤더(+우측 액션) + 본문. 본문은 카드 높이를 채움(늘어난 카드에서 내용 fill). 캐시/매출/캠페인 카드 등. */
export function InfoCard({ title, action, children, flex, minW, w, alignSelf, titleSize = '14px', titleColor = colors.gr42, radius = '16px' }: {
  title?: ReactNode; action?: ReactNode; children: ReactNode; flex?: string; minW?: string; w?: string; alignSelf?: string; titleSize?: string; titleColor?: string; radius?: string;
}) {
  return (
    <Flex direction="column" flex={flex} minW={minW} w={w} alignSelf={alignSelf} bg="white" border={`1px solid ${colors.grE8}`} borderRadius={radius} p="16px">
      {(title || action) && (
        <Flex align="center" pb="8px" flexShrink={0}>
          {title && <Text fontFamily={FONT} fontWeight="700" fontSize={titleSize} color={titleColor}>{title}</Text>}
          <Box flex="1" />
          {action}
        </Flex>
      )}
      <Box flex="1" minH="0">{children}</Box>
    </Flex>
  );
}

/** 라벨-값 표 — 헤더(회색) + [라벨, 값] 행. 값 색상 지정 가능(%·수치 강조). CRM 지표/매출 등. */
export interface LVRow { label: string; value: string; tone?: 'default' | 'point' | 'danger' | 'green' }
export function LabelValueTable({ header, rows, flex, minW }: { header?: string; rows: LVRow[]; flex?: string; minW?: string }) {
  const color = (t?: LVRow['tone']) => (t === 'danger' ? colors.red : t === 'green' ? colors.green : t === 'point' ? colors.bcPoint : colors.gr42);
  return (
    <Box flex={flex} minW={minW} border={`1px solid ${colors.grE8}`} borderRadius="4px" overflow="hidden">
      {header && (
        <Box bg={colors.grF8} px="14px" py="9px" borderBottom={`1px solid ${colors.grE8}`}>
          <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} textAlign="center">{header}</Text>
        </Box>
      )}
      {rows.map((r, i) => (
        <Flex key={i} px="14px" py="8px" align="center" borderTop={i && !header ? `1px solid ${colors.grF2}` : header ? `1px solid ${colors.grF2}` : undefined} justify="space-between" gap="10px">
          <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">{r.label}</Text>
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={color(r.tone)} whiteSpace="nowrap">{r.value}</Text>
        </Flex>
      ))}
    </Box>
  );
}

/** 회색 서브 박스 — (선택)제목 + · 라벨-값 행 목록. 매출 카드 안의 세부 지표. */
export function SubBox({ title, rows }: { title?: ReactNode; rows: { label: string; value: string; tone?: 'default' | 'green' }[] }) {
  return (
    <Box bg={colors.grF8} borderRadius="10px" p="14px" mt="8px">
      {title && <Box pb="6px">{typeof title === 'string' ? <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr42}>{title}</Text> : title}</Box>}
      <Flex direction="column" gap="6px">
        {rows.map((r, i) => (
          <Flex key={i} align="center" justify="space-between" gap="8px">
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">{r.label}</Text>
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={r.tone === 'green' ? colors.green : colors.gr92}>{r.value}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

/** 다중 열 라벨-값 요약표 — 열마다 헤더(회색) + [라벨, 값] 행 목록.
 * rows: [라벨, 값] 또는 [라벨, 값, danger] · danger면 값 빨강. center: 단일 중앙값(총 회원 수 등).
 * lines: 중앙 정렬 여러 줄(건수/금액/단가 등) · b=true면 그 줄만 굵게.
 * nodes: 중앙 정렬 임의 노드 스택(별점 등) · 각 줄 18px 고정행이라 옆 열과 행이 정확히 맞음.
 * Figma 표 형태: 라운드·외곽 테두리 없이 상하 #ddd 선 + 셀 사이 1px 회색(e8e8e8) 구분선. */
export interface KVColumn { header: string; rows?: [string, string, boolean?][]; center?: string; lines?: { t: string; b?: boolean }[]; nodes?: ReactNode[]; wFlex?: string }
export function KVColumns({ columns }: { columns: KVColumn[] }) {
  return (
    <Flex direction="column" w="100%" h="100%" bg={colors.grE8} borderTop="1px solid #ddd" borderBottom="1px solid #ddd">
      {/* 헤더 — 셀 사이·아래 1px 회색선(바탕 e8e8e8이 gap/pb로 비침) */}
      <Flex gap="1px" pb="1px" flexShrink={0}>
        {columns.map((c, i) => (
          <Flex key={i} flex={c.wFlex ?? '1'} minW="0" bg={colors.grF8} px="16px" py="8px" align="center" justify="center">
            <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr72} textAlign="center" whiteSpace="nowrap">{c.header}</Text>
          </Flex>
        ))}
      </Flex>
      {/* 본문 — 높이 채우고, 셀 내용 세로 중앙(행 수 다른 열끼리 상하 여백 균등) */}
      <Flex flex="1" gap="1px" align="stretch">
        {columns.map((c, i) => (
          <Flex key={i} flex={c.wFlex ?? '1'} minW="0" bg="white" px="16px" py="12px" direction="column" justify="center" gap="4px" align={c.center != null || c.lines != null || c.nodes != null ? 'center' : undefined}>
            {c.nodes != null ? (
              <Flex direction="column" align="center" gap="4px" w="100%">
                {c.nodes.map((nd, j) => (
                  <Flex key={j} h="18px" align="center" justify="center">{nd}</Flex>
                ))}
              </Flex>
            ) : c.lines != null ? (
              <Flex direction="column" align="center">
                {c.lines.map((ln, j) => (
                  <Text key={j} fontFamily={FONT} fontWeight={ln.b ? '700' : '400'} fontSize="12px" color={colors.gr72} lineHeight="1.4" letterSpacing="-0.24px" textAlign="center" whiteSpace="nowrap">{ln.t}</Text>
                ))}
              </Flex>
            ) : c.center != null ? (
              <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr42} textAlign="center">{c.center}</Text>
            ) : (c.rows ?? []).map(([l, v, danger], j) => (
              <Flex key={j} align="center" gap="8px" w="100%">
                <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">{l}</Text>
                <Text flex="1" textAlign="right" fontFamily={FONT} fontWeight="700" fontSize="12px" color={danger ? colors.red : colors.gr72}>{v}</Text>
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

/** 프로모 배너 카드 — 컬러 배경 + 문구(+뱃지). 홍보 배너 행/사이드 배너. */
export function PromoBanner({ children, bg = '#2E2E2E', h = '86px', badge, w, flex }: { children: ReactNode; bg?: string; h?: string; badge?: string; w?: string; flex?: string }) {
  return (
    <Box position="relative" flex={flex} w={w} h={h} bg={bg} borderRadius="8px" overflow="hidden" px="16px" py="12px" flexShrink={0}>
      {badge && <Text position="absolute" top="8px" right="8px" fontFamily={FONT} fontSize="9px" fontWeight="700" color="rgba(255,255,255,0.85)" bg="rgba(0,0,0,0.25)" px="5px" py="1px" borderRadius="3px">{badge}</Text>}
      {children}
    </Box>
  );
}

/** 공지 리스트 — 흰 박스(상하 회색선) 안 [제목 … 날짜] 행 목록. bold=true면 그 줄 제목 굵게. 항목 사이 구분선 없음.
 * 높이 100%를 채우고 내용은 세로 중앙(옆 표들과 높이 맞출 때 빈 공간 균등). */
export function NoticeList({ items }: { items: { title: string; date: string; bold?: boolean }[] }) {
  return (
    <Flex direction="column" bg={colors.grE8} pt="1px" pb="1px" h="100%">
      <Flex direction="column" flex="1" bg="white" px="16px" py="16px" gap="6px" justify="center">
        {items.map((it, i) => (
          <Flex key={i} align="center" gap="12px">
            <Text fontFamily={FONT} fontWeight={it.bold ? '700' : '400'} fontSize="12px" color={colors.gr72} letterSpacing="-0.24px" flex="1" minW="0" truncate>{it.title}</Text>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} letterSpacing="-0.24px" flexShrink={0}>{it.date}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

/** 별점 — n개 채운 별(금색). size로 별 크기 지정(기본 14px). */
export function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <Flex gap="1px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} fontSize={`${size}px`} lineHeight="1" color={i <= n ? '#FFB800' : colors.grD8}>★</Text>
      ))}
    </Flex>
  );
}
