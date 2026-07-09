import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { colors, nav, FONT, asset } from '../../styles/tokens';

const MENU_ITEMS: { label: string; badge?: boolean }[] = [
  { label: '상품' },
  { label: '주문' },
  { label: '발주' },
  { label: 'CS' },
  { label: '정산' },
  { label: '매출' },
  { label: '통계' },
  { label: '회원' },
  { label: 'CRM', badge: true },
  { label: 'LIVE', badge: true },
  { label: '메시지' },
  { label: '게시판' },
  { label: 'APP' },
  { label: '셀러' },
  { label: '제휴' },
];

function NewBadge() {
  return (
    <Flex
      w="14px"
      h="14px"
      borderRadius="100px"
      bg={colors.red}
      align="center"
      justify="center"
      ml="3px"
    >
      <Text fontFamily="Roboto, sans-serif" fontWeight="700" fontSize="11px" color="white" lineHeight="1">
        N
      </Text>
    </Flex>
  );
}

export function TopNav({ active = 'LIVE' }: { active?: string }) {
  return (
    <Flex as="header" h="50px" bg={nav.bg} align="stretch" flexShrink={0} position="sticky" top="0" zIndex={100}>
      {/* Shop Title */}
      <Flex w="238px" align="center" justify="center" gap="6px" flexShrink={0}>
        <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color="white">
          My Shop Name
        </Text>
        <Image src={asset('shop-dropdown.svg')} alt="" w="10px" h="12px" />
      </Flex>

      {/* Main menu */}
      <Flex flex="1" align="stretch" overflow="hidden">
        {/* Home — active='home'|'홈'이면 홈(대시보드) 활성 표시 */}
        {(() => {
          const homeActive = active === 'home' || active === '홈';
          return (
            <Flex h="50px" px="20px" align="center" cursor="pointer" position="relative"
              bg={homeActive ? nav.activeBg : 'transparent'}
              borderBottom={homeActive ? `4px solid ${colors.green}` : '4px solid transparent'}
              _hover={{ bg: homeActive ? nav.activeBg : '#2a2a2a' }}>
              <Image src={asset('nav-home.svg')} alt="홈" w="18px" h="16px" />
            </Flex>
          );
        })()}
        {MENU_ITEMS.map((item) => {
          const isActive = item.label === active;
          return (
          <Flex
            key={item.label}
            h="50px"
            px="20px"
            align="center"
            cursor="pointer"
            position="relative"
            bg={isActive ? nav.activeBg : 'transparent'}
            borderBottom={isActive ? `4px solid ${colors.green}` : '4px solid transparent'}
            _hover={{ bg: isActive ? nav.activeBg : '#2a2a2a' }}
          >
            <Text
              fontFamily={isActive ? 'Arial, sans-serif' : FONT}
              fontWeight={isActive ? '700' : '400'}
              fontSize="13px"
              letterSpacing="-0.26px"
              color={isActive ? 'white' : nav.inactiveText}
            >
              {item.label}
            </Text>
            {item.badge && <NewBadge />}
          </Flex>
          );
        })}
      </Flex>

      {/* Right side */}
      <Flex align="center" flexShrink={0} pr="12px">
        {/* Service Notification */}
        <Flex align="center" gap="10px" px="8px" cursor="pointer">
          <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.22px" color={nav.inactiveText} whiteSpace="nowrap">
            서비스 알림
          </Text>
          <Image src={asset('notify-bell.svg')} alt="알림" w="14px" h="18px" />
        </Flex>

        {/* Divider */}
        <Flex w="24px" h="50px" align="center" justify="center">
          <Box w="1px" h="16px" bg={nav.divider} />
        </Flex>

        {/* Quick Button */}
        <Flex align="center" gap="8px" pr="8px">
          <Box w="16px" h="16px" borderRadius="100px" bg="#696D70" position="relative" flexShrink={0}>
            <Image
              src={asset('info-question.svg')}
              alt=""
              position="absolute"
              left="5px"
              top="3px"
              w="6px"
              h="10px"
            />
          </Box>
          <Flex bg={colors.green} borderRadius="8px" px="12px" py="7px" align="center" cursor="pointer">
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" letterSpacing="-0.26px" color="white" whiteSpace="nowrap">
              쇼핑몰 바로 적용
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
