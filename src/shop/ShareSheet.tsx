import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FONT } from '../broadapp/theme';

/* 공유 시트 — 단골 허브 공유(QR·주소 복사·카카오·인스타). 고객 허브(/shop/hub)와 어드민 꾸미기가 공용.
 * 40-50대 운영자·고객 눈높이: 큰 버튼·쉬운 문구. QR은 매장·오프라인 공유에도. */
export function ShareSheet({ url, onClose, fixed = false, showQr = false }: { url: string; onClose: () => void; fixed?: boolean; showQr?: boolean }) {
  const [copied, setCopied] = useState(false);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(url)}`;
  const copy = () => {
    try { navigator.clipboard?.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* 무시 */ }
  };
  const bigBtn = { as: 'button' as const, h: '48px', w: '100%', borderRadius: '10px', cursor: 'pointer', align: 'center' as const, justify: 'center' as const };
  return (
    <Flex position={fixed ? 'fixed' : 'absolute'} inset="0" bg="rgba(0,0,0,0.45)" align="center" justify="center" zIndex={80} px="16px" onClick={onClose}>
      <Box bg="white" borderRadius="14px" w="100%" maxW="340px" p="22px" boxShadow="0 12px 40px rgba(0,0,0,0.35)" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Flex justify="space-between" align="center" pb="14px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" color="#222">단골 허브 공유하기</Text>
          <Box as="button" onClick={onClose} cursor="pointer" fontFamily={FONT} fontSize="18px" color="#999">✕</Box>
        </Flex>

        {/* QR — 운영자가 매장·오프라인(포스터·명함)에 붙일 때만. 고객 공유는 링크로 충분하므로 미노출 */}
        {showQr && (
          <Flex direction="column" align="center" gap="6px" pb="16px">
            <Box border="1px solid #E8E8E8" borderRadius="12px" p="10px">
              <img src={qr} alt="단골 허브 QR 코드" width={150} height={150} style={{ display: 'block' }} />
            </Box>
            <Text fontFamily={FONT} fontSize="12px" color="#777">매장·오프라인 공유용 QR (포스터·명함 등)</Text>
          </Flex>
        )}

        <Flex direction="column" gap="10px">
          <Flex {...bigBtn} bg={copied ? '#E6F4EA' : '#ED3780'} border={copied ? '1px solid #BFE3CB' : 'none'} onClick={copy}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={copied ? '#1B7A3D' : 'white'}>{copied ? '주소가 복사됐어요 ✓' : '주소 복사하기'}</Text>
          </Flex>
          <Flex {...bigBtn} bg="#FAE100" onClick={() => window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`, '_blank')}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color="#3A1D1D">카카오톡으로 공유</Text>
          </Flex>
          <Box bg="#F7F7F7" border="1px solid #EFEFEF" borderRadius="10px" p="12px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="#444" pb="4px">인스타그램에 걸기</Text>
            <Text fontFamily={FONT} fontSize="12px" color="#777" lineHeight="1.6">인스타 <Box as="span" fontWeight="700">프로필 편집 → 웹사이트</Box> 칸에 위 주소를 붙여넣으면 프로필에서 바로 열려요.</Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
