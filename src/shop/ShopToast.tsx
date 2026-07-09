import { Flex, Text } from '@chakra-ui/react';
import { c, FONT } from '../broadapp/theme';

/* 샵프론트 공용 하단 토스트 — 세컨찬스 신청 완료 등 짧은 피드백. bottom은 하단 바 유무에 따라 조정. */
export function ShopToast({ text, onClose, bottom = '34px' }: { text: string; onClose: () => void; bottom?: string }) {
  return (
    <Flex position="absolute" bottom={bottom} left="0" right="0" px="16px" zIndex={60} justify="center">
      <Flex w="100%" bg={c.gr22} borderRadius="8px" px="16px" py="12px" align="center" gap="8px" style={{ animation: 'widgetIn 0.22s ease-out' }}>
        <Text flex="1" minW="0" fontFamily={FONT} fontWeight="700" fontSize="12.5px" letterSpacing="-0.24px" color={c.white} lineHeight="1.4">{text}</Text>
        <Text as="button" fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={c.gr92} flexShrink={0} cursor="pointer" onClick={onClose}>닫기</Text>
      </Flex>
    </Flex>
  );
}
