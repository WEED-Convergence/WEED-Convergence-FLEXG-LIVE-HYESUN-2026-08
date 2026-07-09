import { Flex, Text, Image, Box } from '@chakra-ui/react';
import { colors, FONT, asset } from '../../styles/tokens';

export function Footer() {
  return (
    <Flex
      as="footer"
      h="100px"
      borderTop={`1px solid ${colors.grD8}`}
      align="center"
      gap="32px"
      px="20px"
    >
      <Image src={asset('weedsoft-logo.svg')} alt="WEEDSOFT" w="114px" h="16px" />
      <Box>
        <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={colors.gr92} lineHeight="1.4">
          고객센터 070-7771-5866  평일 10:00~18:00 (토요일/일요일 휴무)
        </Text>
        <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={colors.gr92} lineHeight="1.4">
          ⓒ WEEDSOFT Corp.
        </Text>
      </Box>
    </Flex>
  );
}
