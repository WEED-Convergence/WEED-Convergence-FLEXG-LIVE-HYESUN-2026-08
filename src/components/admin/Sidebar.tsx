import { Box, Flex, Text, Image, Link } from '@chakra-ui/react';
import { sidebar, FONT, asset } from '../../styles/tokens';

function Separator() {
  return <Box h="2px" w="100%" bg={sidebar.separator} borderTop="1px solid #000" />;
}

const QUICK_MENU = [
  { icon: 'quick-shop.svg', label: '쇼핑몰' },
  { icon: 'quick-delivery.svg', label: '배송조회' },
  { icon: 'quick-app.svg', label: 'App설치' },
];

function RoundButton({ label }: { label: string }) {
  return (
    <Flex
      border={`2px solid ${sidebar.labelText}`}
      borderRadius="100px"
      px="12px"
      pt="6px"
      pb="5px"
      cursor="pointer"
      align="center"
      justify="center"
    >
      <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={sidebar.labelText}>
        {label}
      </Text>
    </Flex>
  );
}

// href 없으면 비링크 행(시안용 메뉴)으로 렌더 — 스타일은 동일
function TwoDepthMenu({ label, href, active }: { label: string; href?: string; active?: boolean }) {
  const inner = (
    <>
      {active && <Box position="absolute" left="0" top="0" w="4px" h="32px" bg={sidebar.accentGreen} />}
      <Text
        fontFamily={FONT}
        fontWeight="700"
        fontSize="12px"
        color={active ? sidebar.menuActiveText : sidebar.menuInactiveText}
      >
        {label}
      </Text>
    </>
  );
  const sx = {
    display: 'flex',
    h: '32px',
    w: '100%',
    alignItems: 'center',
    position: 'relative' as const,
    bg: active ? sidebar.menuActiveBg : 'transparent',
    cursor: 'pointer',
    pl: '20px',
    _hover: { bg: active ? sidebar.menuActiveBg : '#2e3133' },
  };
  if (!href) return <Flex {...sx}>{inner}</Flex>;
  return (
    <Link href={href} {...sx} textDecoration="none" _hover={{ ...sx._hover, textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
      {inner}
    </Link>
  );
}

export type SidebarItem = { label: string; href?: string; active?: boolean; sub?: SidebarItem[] };

// 3-depth 서브메뉴(들여쓰기) — 단골 관리 하위(단골 리스트 / 단골 허브 꾸미기) 등
function ThreeDepthMenu({ label, href, active }: { label: string; href?: string; active?: boolean }) {
  const inner = (
    <>
      {active && <Box position="absolute" left="0" top="0" w="4px" h="30px" bg={sidebar.accentGreen} />}
      <Text fontFamily={FONT} fontWeight={active ? '700' : '400'} fontSize="12px" color={active ? sidebar.menuActiveText : sidebar.menuInactiveText}>{label}</Text>
    </>
  );
  const sx = {
    display: 'flex', h: '30px', w: '100%', alignItems: 'center', position: 'relative' as const,
    bg: active ? sidebar.menuActiveBg : 'transparent', cursor: 'pointer', pl: '36px',
    _hover: { bg: active ? sidebar.menuActiveBg : '#2e3133' },
  };
  if (!href) return <Flex {...sx}>{inner}</Flex>;
  return (
    <Link href={href} {...sx} textDecoration="none" _hover={{ ...sx._hover, textDecoration: 'none' }} _focus={{ outline: 'none', boxShadow: 'none' }}>
      {inner}
    </Link>
  );
}

// title·items 미지정 시: 경로 기반 LIVE 메뉴(기존 동작). 지정 시: 그 타이틀/메뉴로 렌더(예: 회원관리).
export function Sidebar({ title, items }: { title?: string; items?: SidebarItem[] } = {}) {
  const path = window.location.pathname;
  const isRegulars = path.startsWith('/admin/regulars');
  // 어드민 v2 컨텍스트(방송관리 v2 / 통계 대시보드 / 채팅 관리)에선 v2 메뉴로 분기.
  // 단골 관리는 v1·v2 공용 화면 → v2 LNB에서 들어올 때만 ?ctx=v2로 v2 컨텍스트 유지(7월 v1 단골 흐름 무영향).
  const isBanned = path.startsWith('/admin/banned-words');
  const oct = new URLSearchParams(window.location.search).get('oct') === '1'; // 10월 컨텍스트(인페이지 방송상세 등) — 단골 10월 서브메뉴 조건
  const isRegularsV2 = isRegulars && new URLSearchParams(window.location.search).get('ctx') === 'v2';
  // v2(8월) 컨텍스트면 전체 LIVE 메뉴(대시보드·방송·단골·채팅) 노출. 채팅 관리 화면(isBanned)·10월(oct)도 v2로 포함. 7월(v1)은 기존 분기 → 무영향.
  const isV2 = path.startsWith('/admin/live-broadcast-v2') || path.startsWith('/admin/live-dashboard') || isBanned || isRegularsV2 || oct;
  const isV2Broadcast = path.startsWith('/admin/live-broadcast-v2');
  const isDashboard = path.startsWith('/admin/live-dashboard');
  const lnbTitle = title ?? 'LIVE';
  // 단골 관리 서브메뉴 — 8월(ctx=v2): [단골 리스트 / 단골 허브 꾸미기]. 10월(oct): + [혜택 발급 설정]. 7월(v1)엔 미노출.
  const view = new URLSearchParams(window.location.search).get('view');
  const ctxParam = oct ? 'oct=1' : 'ctx=v2'; // 10월은 oct=1, 8월은 ctx=v2
  const dangolSub: SidebarItem[] | undefined = (oct || isRegularsV2) && isRegulars
    ? [
        { label: '단골 리스트', href: `/admin/regulars?${ctxParam}`, active: view !== 'recruit' && view !== 'benefit' },
        { label: '단골 허브 꾸미기', href: `/admin/regulars?${ctxParam}&view=recruit`, active: view === 'recruit' },
        ...(oct ? [{ label: '혜택 발급 설정', href: '/admin/regulars?oct=1&view=benefit', active: view === 'benefit' }] : []),
      ]
    : undefined;
  const defaultItems: SidebarItem[] = isV2
    ? [
        { label: '라이브 통계 대시보드', href: '/admin/live-dashboard', active: isDashboard },
        { label: '라이브 방송 관리', href: '/admin/live-broadcast-v2', active: isV2Broadcast },
        { label: '라이브 단골 관리', href: '/admin/regulars?ctx=v2', active: isRegulars && !dangolSub, sub: dangolSub },
        // 라이브 채팅 관리 — 8월 기능. 모든 v2(8·10월) 컨텍스트 LIVE 메뉴에 상시 노출. 7월(v1) else-branch엔 미노출.
        { label: '라이브 채팅 관리', href: '/admin/banned-words', active: isBanned },
      ]
    : [
        { label: '라이브 방송 관리', href: '/admin', active: !isRegulars },
        { label: '라이브 단골 관리', href: '/admin/regulars', active: isRegulars && !dangolSub, sub: dangolSub },
      ];
  const menu = items ?? defaultItems;
  return (
    <Flex
      as="aside"
      direction="column"
      w="238px"
      bg={sidebar.bg}
      flexShrink={0}
      position="sticky"
      top="50px"
      alignSelf="flex-start"
      h="calc(100dvh - 50px)"
      overflowY="auto"
    >
      <Separator />

      {/* Shop info */}
      <Box px="16px" pt="4px" pb="20px">
        <Flex pt="12px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={sidebar.accentGreen}>
            yourshopid
          </Text>
          <Text fontFamily={FONT} fontWeight="400" fontSize="12px" color={sidebar.labelText}>
            님
          </Text>
        </Flex>

        <Flex gap="6px" pt="6px" align="center">
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={sidebar.linkText} cursor="pointer">
            디자인관리
          </Text>
          <Text fontFamily={FONT} fontSize="12px" color={sidebar.labelText}>
            I
          </Text>
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={sidebar.linkText} cursor="pointer">
            환경설정
          </Text>
        </Flex>

        {/* Quick menu */}
        <Flex gap="8px" py="16px" justify="space-between">
          {QUICK_MENU.map((q) => (
            <Flex key={q.label} direction="column" align="center" gap="6px" cursor="pointer" flex="1">
              <Image src={asset(q.icon)} alt={q.label} h="34px" objectFit="contain" />
              <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={sidebar.iconLabel}>
                {q.label}
              </Text>
            </Flex>
          ))}
        </Flex>

        {/* Round buttons */}
        <Flex gap="6px">
          <RoundButton label="서비스 이용료" />
          <RoundButton label="로그아웃" />
        </Flex>
      </Box>

      {/* Search box */}
      <Box px="16px" pb="12px">
        <Flex
          h="36px"
          bg={sidebar.searchBg}
          border={`1px solid ${sidebar.searchBorder}`}
          borderRadius="8px"
          px="8px"
          gap="8px"
          align="center"
        >
          <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={sidebar.linkText} w="32px" flexShrink={0}>
            이름
          </Text>
          <Image src={asset('lnb-down.svg')} alt="" w="10px" h="6px" flexShrink={0} />
          <Box w="1px" h="14px" bg={sidebar.searchBorder} />
          <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={sidebar.linkText} flex="1">
            검색어 입력
          </Text>
          <Image src={asset('lnb-search.svg')} alt="검색" w="16px" h="16px" />
        </Flex>
      </Box>

      {/* LNB title + guide */}
      <Flex px="20px" py="12px" align="center" justify="space-between">
        <Text fontFamily={FONT} fontWeight="700" fontSize="18px" letterSpacing="-0.36px" color={sidebar.titleText}>
          {lnbTitle}
        </Text>
        <Flex
          as="button"
          align="center"
          gap="4px"
          px="10px"
          py="6px"
          borderRadius="30px"
          border={`2px solid ${sidebar.accentOrange}`}
          bgGradient="linear(to-r, #FF7200, #994400)"
          bgImage={`linear-gradient(to right, ${sidebar.accentOrange}, ${sidebar.accentOrangeDark})`}
          cursor="pointer"
          onClick={() => window.open('https://guide.flexgate.co.kr/guide-flexg-live-35a92892ccf680fd9127dcd983b6e476', '_blank', 'noopener,noreferrer')}
        >
          <Text fontFamily={FONT} fontWeight="800" fontSize="10px" color="white">
            가이드
          </Text>
          <Image src={asset('guide-icon.svg')} alt="" w="17px" h="13px" />
        </Flex>
      </Flex>

      {/* 2-depth menu (+ 서브 있으면 3-depth 들여쓰기) */}
      <Box>
        {menu.map((it) => (
          it.sub
            ? (
              <Box key={it.label}>
                <TwoDepthMenu label={it.label} href={it.href} active={it.active} />
                {it.sub.map((s) => <ThreeDepthMenu key={s.label} label={s.label} href={s.href} active={s.active} />)}
              </Box>
            )
            : <TwoDepthMenu key={it.label} label={it.label} href={it.href} active={it.active} />
        ))}
      </Box>
    </Flex>
  );
}
