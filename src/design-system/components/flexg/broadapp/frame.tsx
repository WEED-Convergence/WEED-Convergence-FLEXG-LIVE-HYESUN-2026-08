import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { c, FONT, basset, SCREEN_W, SCREEN_H, STATUS_H } from './theme';

/* ── iOS 상태바 (9:41 · 신호/와이파이/배터리) — 다이내믹 아일랜드 양옆 ── */
export function StatusBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  // tone='light' → 어두운 배경 위 흰 아이콘, 'dark' → 밝은 배경 위 검은 아이콘
  const fg = tone === 'light' ? '#FFFFFF' : '#000000';
  return (
    <Flex h={`${STATUS_H}px`} w="100%" align="center" justify="space-between" pt="2px" flexShrink={0}>
      <Box w="120px" pl="34px">
        <Text fontFamily={FONT} fontWeight="600" fontSize="16px" letterSpacing="-0.4px" color={fg}>
          9:41
        </Text>
      </Box>
      <Flex align="center" gap="7px" pr="32px">
        {/* 신호 4바 */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.7} y={9 - i * 2.7} width="3.2" height={3 + i * 2.7} rx="0.6" fill={fg} />
          ))}
        </svg>
        {/* 와이파이 */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 11 10.4 9A2.6 2.6 0 0 0 6.6 9L8.5 11Z" fill={fg} />
          <path d="M8.5 4.9c2.05 0 4 .8 5.4 2.24l1.5-1.57A10 10 0 0 0 8.5 2.7 10 10 0 0 0 1.6 5.57L3.1 7.14A7.5 7.5 0 0 1 8.5 4.9Z" fill={fg} opacity="0.9" />
        </svg>
        {/* 배터리 */}
        <Flex align="center" gap="1.5px">
          <Box w="24px" h="12px" borderRadius="3.5px" border={`1px solid ${fg}`} opacity="0.5" p="1.6px">
            <Box w="100%" h="100%" borderRadius="1.5px" bg={fg} />
          </Box>
          <Box w="1.4px" h="4.5px" borderRadius="0 1px 1px 0" bg={fg} opacity="0.5" />
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 홈 인디케이터 ── */
export function HomeIndicator({ bg = '#000000', bar = '#FFFFFF' }: { bg?: string; bar?: string }) {
  return (
    <Flex h="28px" w="100%" align="flex-end" justify="center" flexShrink={0} bg={bg} pb="9px">
      <Box w="138px" h="5px" borderRadius="100px" bg={bar} />
    </Flex>
  );
}

/* ── F Live 로고 (흰 F + 빨강 Live 배지). w 기준으로 비율 유지 ── */
export function FLiveLogo({ w = 128 }: { w?: number }) {
  return (
    <Box position="relative" w={`${w}px`} h={`${(w * 36) / 128}px`} flexShrink={0}>
      <Image src={basset('flive-F.svg')} alt="F" position="absolute" left="0" top="0" h="100%" />
      <Image src={basset('flive-Live.svg')} alt="Live" position="absolute" left="30.59%" top="0" h="100%" />
    </Box>
  );
}

/* ── 뒤로가기 화살표 ── */
export function BackArrow({ onClick, color = '#FFFFFF' }: { onClick?: () => void; color?: string }) {
  return (
    <Flex as="button" align="center" justify="center" w="28px" h="28px" cursor="pointer" onClick={onClick} flexShrink={0}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 19 8 12l7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Flex>
  );
}

/* ── 토글 스위치 (ON=빨강/우, OFF=회색/좌) ── */
export function Toggle({ on = false, onClick }: { on?: boolean; onClick?: () => void }) {
  return (
    <Flex
      as="button"
      w="40px"
      h="20px"
      align="center"
      justify={on ? 'flex-end' : 'flex-start'}
      px="3px"
      borderRadius="9999px"
      bg={on ? c.red : c.grB8}
      cursor="pointer"
      flexShrink={0}
      onClick={onClick}
    >
      <Box w="14px" h="14px" borderRadius="9999px" bg={c.white} boxShadow="0px 1px 2px rgba(0,0,0,0.05)" />
    </Flex>
  );
}

/* ── iPhone 16 Pro 디바이스 목업 ──
   각 화면을 393×852 스크린 안에 넣고, 티타늄 베젤 + 다이내믹 아일랜드 + 사이드 버튼을 렌더. */
/* 티타늄 외곽 프레임 + 스크린(다이내믹 아일랜드). 전체 페이지(Phone16Pro)와 미리보기 목업에서 공용. */
export function PhoneFrame({ children, island = 'dark', shadow = true }: { children: React.ReactNode; island?: 'dark' | 'light'; shadow?: boolean }) {
  const islandColor = island === 'dark' ? '#000000' : '#0A0A0A';
  return (
    <Box
      position="relative"
      w={`${SCREEN_W + 22}px`}
      h={`${SCREEN_H + 22}px`}
      borderRadius="64px"
      bg="#1B1B1D"
      p="11px"
      boxShadow={shadow ? 'inset 0 0 0 2px #2C2C2E, inset 0 0 0 6px #4A4A4D, 0 40px 80px rgba(0,0,0,0.55)' : 'inset 0 0 0 2px #2C2C2E, inset 0 0 0 6px #4A4A4D'}
      flexShrink={0}
      fontFamily={FONT}
    >
      {/* 사이드 버튼 */}
      <Box position="absolute" left="-2px" top="168px" w="3px" h="34px" borderRadius="3px" bg="#3A3A3C" />
      <Box position="absolute" left="-2px" top="220px" w="3px" h="58px" borderRadius="3px" bg="#3A3A3C" />
      <Box position="absolute" left="-2px" top="292px" w="3px" h="58px" borderRadius="3px" bg="#3A3A3C" />
      <Box position="absolute" right="-2px" top="240px" w="3px" h="86px" borderRadius="3px" bg="#3A3A3C" />

      {/* 스크린 */}
      <Box position="relative" w={`${SCREEN_W}px`} h={`${SCREEN_H}px`} borderRadius="53px" overflow="hidden" bg={c.black}>
        {/* 화면 콘텐츠 (스크롤은 내부에서) */}
        <Box position="absolute" inset="0">
          {children}
        </Box>

        {/* 다이내믹 아일랜드 */}
        <Flex
          position="absolute"
          top="11px"
          left="50%"
          transform="translateX(-50%)"
          w="125px"
          h="37px"
          borderRadius="20px"
          bg={islandColor}
          align="center"
          justify="flex-end"
          pr="12px"
          zIndex={50}
          pointerEvents="none"
        >
          <Box w="9px" h="9px" borderRadius="9999px" bg="#0F0F12" boxShadow="inset 0 0 2px rgba(80,80,90,0.6)" />
        </Flex>
      </Box>
    </Box>
  );
}

export function Phone16Pro({ children, island = 'dark' }: { children: React.ReactNode; island?: 'dark' | 'light' }) {
  return (
    <Flex w="100%" minH="100dvh" align="center" justify="center" bg="#0B0B0D" py="28px" fontFamily={FONT}>
      <PhoneFrame island={island}>{children}</PhoneFrame>
    </Flex>
  );
}
