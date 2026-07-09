// 어드민 재사용 원자 컴포넌트 — 화면 안에 인라인으로만 있던 패턴을 독립 컴포넌트로 추출.
// (기존 화면 코드는 무영향 — 여기 것을 새로 쓰거나 점진 교체용) 컴포넌트 갤러리에도 노출.
import type { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { colors, FONT } from '../../styles/tokens';

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

/** 데이터 테이블 — 2줄 헤더(회색) + 행/셀. 방송 목록 테이블 패턴. */
export interface TableColumn { header: string[]; flex?: string; w?: string }
export function DataTable({ columns, rows }: { columns: TableColumn[]; rows: ReactNode[][] }) {
  return (
    <Box border="1px solid #DDD" borderRadius="2px" overflow="hidden" w="fit-content" maxW="100%">
      {/* 헤더 */}
      <Flex bg={colors.grE8} gap="1px">
        {columns.map((col, i) => (
          <Flex key={i} flex={col.flex} w={col.w} bg={colors.grF8} p="8px" align="center" justify="center" direction="column" alignSelf="stretch">
            {col.header.map((line) => (
              <Text key={line} fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={colors.gr72} textAlign="center" whiteSpace="nowrap">{line}</Text>
            ))}
          </Flex>
        ))}
      </Flex>
      {/* 행 */}
      {rows.map((row, ri) => (
        <Flex key={ri} gap="1px" bg="#EEE" borderTop="1px solid #EEE">
          {row.map((cell, ci) => (
            <Flex key={ci} flex={columns[ci]?.flex} w={columns[ci]?.w} bg="white" p="8px" align="center" justify="center" alignSelf="stretch">
              <Text as="div" fontFamily={FONT} fontSize="12px" color={colors.gr42} textAlign="center" lineHeight="1.5">{cell}</Text>
            </Flex>
          ))}
        </Flex>
      ))}
    </Box>
  );
}
