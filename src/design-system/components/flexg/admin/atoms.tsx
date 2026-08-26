// 어드민 재사용 원자 컴포넌트 — 화면 안에 인라인으로만 있던 패턴을 독립 컴포넌트로 추출.
// (기존 화면 코드는 무영향 — 여기 것을 새로 쓰거나 점진 교체용) 컴포넌트 갤러리에도 노출.
import type { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { colors, FONT } from '../../../tokens';

/** 탭 스트립 — 회색 트랙 위 탭 버튼(활성=흰 배경 + 초록 글씨). 설정 탭바 패턴. */
export function TabStrip({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <Flex bg={colors.grF8} borderBottom="1px solid #D8D8D8" align="center" w="fit-content" maxW="100%" overflowX="auto">
      <Flex bg="#D8D8D8" p="1px" gap="1px">
        {tabs.map((tab) => {
          const on = tab === active;
          return (
            <Flex key={tab} as="button" px="24px" py="12px" align="center" justify="center" position="relative"
              bg={on ? 'white' : colors.grF2} cursor="pointer" onClick={() => onChange(tab)}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={on ? colors.green : '#929292'} whiteSpace="nowrap">
                {tab}
              </Text>
              {on && <Box position="absolute" left="0" right="0" bottom="-1px" h="1px" bg="white" />}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

/** 라이브 진행 상태 배지 — 진행중(LIVE 빨강 칩 + 문구) / 대기중(초록) / 종료(회색). */
export type LiveStatus = 'live' | 'waiting' | 'ended';
export function StatusBadge({ status }: { status: LiveStatus }) {
  if (status === 'live') {
    return (
      <Flex direction="column" align="center" gap="6px">
        <Flex bg="#FF0000" borderRadius="6px" px="4px" py="1px" align="center" justify="center">
          <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color="white" lineHeight="1.4">LIVE</Text>
        </Flex>
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.red}>라이브 진행중</Text>
      </Flex>
    );
  }
  if (status === 'waiting') {
    return <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.green}>라이브 대기중</Text>;
  }
  return <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr92}>라이브 종료</Text>;
}

/** 미니 버튼 — 셀 안 링크형 작은 버튼(흰 배경 + 회색 테두리 #C8C8C8 + 우측 화살표). "…내역 >" · "영수증 출력 >". */
export function MiniButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Flex as="button" onClick={onClick} bg="white" border="1px solid #C8C8C8" borderRadius="4px" px="6px" pt="3px" pb="4px" gap="4px" align="center" justify="center" cursor="pointer" flexShrink={0} w="fit-content" _hover={{ bg: colors.grF8 }}>
      <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} letterSpacing="-0.24px" whiteSpace="nowrap" lineHeight="1.4">{label}</Text>
      <Box as="span" display="inline-flex" flexShrink={0}>
        <svg width="5" height="8" viewBox="0 0 6 10" fill="none" stroke="#727272" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4-4 4" /></svg>
      </Box>
    </Flex>
  );
}

/** 데이터 테이블 — 헤더(회색 grF8·굵게) + 행/셀(흰 배경·중앙). 셀은 다중 라인·MiniButton 포함 가능.
 * Figma 표: 상하 #ddd 선 + 셀/행 사이 1px 회색(grE8) · 헤더 12px 굵게 gr72 · 본문 12px gr72 중앙. */
export interface TableColumn { header: string[]; flex?: string; w?: string }
export function DataTable({ columns, rows }: { columns: TableColumn[]; rows: ReactNode[][] }) {
  // w만 있고 flex가 없는 컬럼은 고정폭(늘어나지 않음) — flex 지정 컬럼만 남는 폭을 나눠 가짐
  const colFlex = (col?: TableColumn) => col?.flex ?? (col?.w ? '0 0 auto' : '1');
  return (
    <Box w="100%" minW="fit-content" maxW="100%" overflowX="auto">
      {/* 헤더 */}
      <Flex bg={colors.grE8} borderTop="1px solid #ddd" borderBottom="1px solid #ddd" gap="1px" py="1px" w="100%" minW="fit-content">
        {columns.map((col, i) => (
          <Flex key={i} flex={colFlex(col)} w={col.w} minW={col.w ?? '0'} bg={colors.grF8} p="8px" align="center" justify="center" direction="column" alignSelf="stretch">
            {col.header.map((line) => (
              <Text key={line} fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={colors.gr72} textAlign="center" lineHeight="1.4" whiteSpace="nowrap">{line}</Text>
            ))}
          </Flex>
        ))}
      </Flex>
      {/* 행 */}
      {rows.map((row, ri) => (
        <Flex key={ri} bg={colors.grE8} gap="1px" pb="1px" align="stretch" w="100%" minW="fit-content">
          {row.map((cell, ci) => (
            <Flex key={ci} flex={colFlex(columns[ci])} w={columns[ci]?.w} minW={columns[ci]?.w ?? '0'} bg="white" p="12px" direction="column" align="center" justify="center" gap="4px" alignSelf="stretch"
              fontFamily={FONT} fontSize="12px" color={colors.gr72} textAlign="center" lineHeight="1.4">
              {cell}
            </Flex>
          ))}
        </Flex>
      ))}
    </Box>
  );
}
