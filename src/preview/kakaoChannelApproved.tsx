// 카카오톡 채널 승인 완료 알림톡 — 신규 독립 화면. 다른 화면(screens.tsx·discountCode2.tsx·policy.tsx 등)은
// 전혀 건드리지 않고 이 파일 + main.tsx의 라우팅 한 줄 + catalog.ts의 신규 엔트리 한 개(모두 추가만)로만 연결한다.
// 상단 네비(GNB)·좌측 사이드바(LNB) 없이, 카카오톡 채널 승인이 완료됐을 때 고객에게 발송되는
// 알림톡 메시지 모습을 「알림톡 템플릿 선택 영역」과 같은 카카오 도착 카드 형태로 보여주는 화면.
import { Box, Flex, Text } from '@chakra-ui/react';
import { colors } from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif";
const KAKAO_CHIP_BG = '#FAE100'; // 카카오 알림톡 "도착" 배지 — 카카오 브랜드 고정색(디자인 토큰 대상 아님)
const KAKAO_BUTTON_BG = '#FEE500'; // 카카오톡 "채널 추가" 버튼 — 카카오 브랜드 고정색(디자인 토큰 대상 아님)
const KAKAO_TEXT = '#3A1D1D';

function KakaoGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5C6.98 3.5 3 6.86 3 11c0 2.66 1.7 5 4.28 6.36l-1.02 3.72a.5.5 0 0 0 .75.55l4.2-2.78c.25.02.5.03.79.03 5.02 0 9-3.36 9-7.5S17.02 3.5 12 3.5Z" fill={KAKAO_TEXT} />
    </svg>
  );
}

export function KakaoChannelApproved() {
  return (
    <Box fontFamily={FONT} color={colors.gr42} bg="white" minH="100dvh" p="40px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="16px">카카오톡 채널 승인 완료 알림톡</Text>

      <Box data-doc-mark="message" w="320px">
        <Flex align="center" gap="4px" bg={KAKAO_CHIP_BG} borderRadius="14px" px="10px" py="4px" w="fit-content" mb="10px">
          <KakaoGlyph />
          <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={KAKAO_TEXT}>알림톡 도착</Text>
        </Flex>

        <Box bg={colors.grF8} borderRadius="12px" overflow="hidden">
          <Box p="18px 16px">
            <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} lineHeight="1.6">안녕하세요. 플렉스지입니다.</Text>
            <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} lineHeight="1.6">카카오톡 채널톡 등록이 완료되었습니다.</Text>
          </Box>
          <Box as="button" w="100%" bg={KAKAO_BUTTON_BG} py="12px" borderTop="1px solid rgba(0,0,0,0.06)" cursor="pointer">
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={KAKAO_TEXT}>채널 추가</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
