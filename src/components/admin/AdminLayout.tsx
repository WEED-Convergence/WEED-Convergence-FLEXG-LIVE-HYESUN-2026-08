import type { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { TopNav } from './TopNav';
import { Sidebar, type SidebarItem } from './Sidebar';
import { Footer } from './Footer';

// 어드민 공통 골격 — 상단 네비 + 좌측 사이드바 + 본문 + 푸터.
// 새 어드민 페이지는 이 래퍼로 감싸기만 하면 표준 셸이 보장된다.
type AdminLayoutProps = {
  children: ReactNode;
  navActive?: string; // 상단 네비 활성 메뉴 (기본 LIVE)
  sidebar?: { title?: string; items?: SidebarItem[] }; // 미지정 시 경로 기반 기본(LIVE) 메뉴
  contentPx?: string; // 본문 좌우 패딩 (기본 20px)
  contentPt?: string; // 본문 상단 패딩 (기본 20px)
  contentPb?: string; // 본문 하단 패딩 (기본 40px)
  fullHeight?: boolean; // 본문이 뷰포트(상단바 아래)를 꽉 채우고 자체 내부 스크롤(고정 셸 화면용). 패딩·푸터 없음. (opt-in, 기본 false → 기존 동작 동일)
};

export function AdminLayout({
  children,
  navActive = 'LIVE',
  sidebar,
  contentPx = '20px',
  contentPt = '20px',
  contentPb = '40px',
  fullHeight = false,
}: AdminLayoutProps) {
  if (fullHeight) {
    return (
      <Flex direction="column" h="100dvh" bg="white" overflow="hidden">
        <TopNav active={navActive} />
        <Flex flex="1" minH="0" align="stretch">
          <Sidebar title={sidebar?.title} items={sidebar?.items} />
          <Box flex="1" minW="0" minH="0" display="flex" flexDirection="column">
            {children}
          </Box>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex direction="column" minH="100dvh" bg="white">
      <TopNav active={navActive} />
      <Flex flex="1" align="stretch">
        <Sidebar title={sidebar?.title} items={sidebar?.items} />
        <Box flex="1" minW="0" display="flex" flexDirection="column">
          <Box flex="1" px={contentPx} pt={contentPt} pb={contentPb}>
            {children}
          </Box>
          <Footer />
        </Box>
      </Flex>
    </Flex>
  );
}
