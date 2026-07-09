import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { c, FONT } from './theme';
import { FLiveLogo, BackArrow } from './frame';

/* ── 아이콘 ── */
export function GearIcon({ color = '#fff', s = 22 }: { color?: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke={color} strokeWidth="1.6" />
      <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8.4 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.4a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}
export function LogoutIcon({ color = '#fff', s = 20 }: { color?: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Chevron({ dir = 'down', color = c.gr72, s = 18 }: { dir?: 'down' | 'right'; color?: string; s?: number }) {
  const d = dir === 'right' ? 'M9 6l6 6-6 6' : 'M6 9l6 6 6-6';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <Flex as="button" w="28px" h="28px" align="center" justify="center" cursor="pointer" flexShrink={0} onClick={onClick}>
      {children}
    </Flex>
  );
}

/* ── 공통 앱 헤더 (검정 바: 뒤로가기 + F Live + 우측 액션) ── */
export function AppHeader({ onBack, right, divider }: { onBack?: () => void; right?: React.ReactNode; divider?: boolean }) {
  return (
    <Flex h="56px" w="100%" align="center" px="24px" flexShrink={0} gap="8px" borderBottom={divider ? '1px solid rgba(255,255,255,0.24)' : undefined}>
      <BackArrow onClick={onBack} />
      <FLiveLogo w={85} />
      <Box flex="1" />
      {right}
    </Flex>
  );
}

/* ── Primary 버튼 (red / dark / gray) ── */
export function AppButton({
  label,
  tone = 'red',
  onClick,
  flex,
  h = '56px',
  radius = '12px',
}: {
  label: string;
  tone?: 'red' | 'dark' | 'gray' | 'outlineRed';
  onClick?: () => void;
  flex?: string;
  h?: string;
  radius?: string;
}) {
  const map = {
    red: { bg: c.red, color: c.white, border: 'none' },
    dark: { bg: c.gr22, color: c.white, border: 'none' },
    gray: { bg: c.grE8, color: c.gr72, border: 'none' },
    outlineRed: { bg: 'transparent', color: c.red, border: `1px solid ${c.red}` },
  }[tone];
  return (
    <Flex as="button" flex={flex} w={flex ? undefined : '100%'} h={h} align="center" justify="center" bg={map.bg} border={map.border} borderRadius={radius} cursor="pointer" onClick={onClick}>
      <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={map.color} whiteSpace="nowrap">
        {label}
      </Text>
    </Flex>
  );
}

/* ── 확인 다이얼로그 (경고 모달 공통) ── */
export type DlgButton = { label: string; tone: 'red' | 'gray' | 'outlineRed'; onClick?: () => void };
function WarnIcon() {
  return (
    <Flex w="60px" h="60px" borderRadius="9999px" bg="#FFECEC" align="center" justify="center">
      <Flex w="40px" h="40px" borderRadius="9999px" bg={c.red} align="center" justify="center">
        <Text fontFamily={FONT} fontWeight="800" fontSize="26px" color={c.white} lineHeight="1">!</Text>
      </Flex>
    </Flex>
  );
}
export function Dialog({ warn, title, body, buttons, markId }: { warn?: boolean; title: React.ReactNode; body?: React.ReactNode; buttons: DlgButton[]; markId?: string }) {
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.6)" align="center" justify="center" zIndex={50} px="20px">
      <Flex data-doc-mark={markId} direction="column" align="center" w="100%" maxW="311px" bg={c.white} borderRadius="20px" p="20px" gap="16px">
        {warn && <WarnIcon />}
        <Flex direction="column" gap="4px" align="center" textAlign="center" w="100%">
          <Text fontFamily={FONT} fontWeight="600" fontSize="16px" letterSpacing="-0.4px" color={c.gr22}>
            {title}
          </Text>
          {body && (
            <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr72} lineHeight="1.4">
              {body}
            </Text>
          )}
        </Flex>
        <Flex gap="8px" w="100%">
          {buttons.map((b, i) => (
            <AppButton key={i} flex="1" h="48px" radius="10px" label={b.label} tone={b.tone} onClick={b.onClick} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 바텀시트 (옵션 선택) ── */
export interface SheetOption {
  t: string;
  d: string;
}
export function BottomSheet({
  title,
  options,
  selectedIdx,
  onSelect,
  onClose,
}: {
  title: string;
  options: SheetOption[];
  selectedIdx: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <Flex position="absolute" inset="0" zIndex={45} direction="column" justify="flex-end">
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.5)" onClick={onClose} />
      <Box position="relative" bg={c.white} borderTopRadius="24px" maxH="80%" overflowY="auto" pb="28px" boxShadow="0 -8px 24px rgba(0,0,0,0.18)">
        <Box position="sticky" top="0" bg={c.white} px="24px" pt="24px" pb="12px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.5px" color={c.gr22}>
            {title}
          </Text>
        </Box>
        <Flex direction="column">
          {options.map((o, i) => {
            const sel = i === selectedIdx;
            return (
              <Flex
                key={i}
                as="button"
                direction="column"
                align="flex-start"
                gap="2px"
                px="24px"
                py="12px"
                textAlign="left"
                cursor="pointer"
                _hover={{ bg: c.grF8 }}
                onClick={() => {
                  onSelect(i);
                  onClose();
                }}
              >
                <Flex align="center" gap="6px">
                  <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={sel ? c.red : c.gr22}>
                    {o.t}
                  </Text>
                  {sel && (
                    <Text fontFamily={FONT} fontWeight="500" fontSize="12px" letterSpacing="-0.3px" color={c.red}>
                      현재 선택
                    </Text>
                  )}
                </Flex>
                <Text fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" color={c.gr92} lineHeight="1.45">
                  {o.d}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </Flex>
  );
}

/* ── 인포 시트 (? 툴팁 안내) ── */
export function InfoSheet({ title, paras, onClose }: { title: string; paras: string[]; onClose: () => void }) {
  return (
    <Flex position="absolute" inset="0" zIndex={45} direction="column" justify="flex-end">
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.5)" onClick={onClose} />
      <Box position="relative" bg={c.white} borderTopRadius="24px" px="24px" pt="24px" pb="28px" boxShadow="0 -8px 24px rgba(0,0,0,0.18)">
        <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.5px" color={c.gr22} pb="16px">
          {title}
        </Text>
        <Flex direction="column" gap="16px">
          {paras.map((p, i) => (
            <Text key={i} fontFamily={FONT} fontSize="14px" letterSpacing="-0.35px" color={c.gr72} lineHeight="1.55">
              {p}
            </Text>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

/* ── 폼 필드 ── */
export function InfoDot({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Flex as={onClick ? 'button' : undefined} w="13px" h="13px" borderRadius="9999px" border={`1px solid ${c.gr72}`} align="center" justify="center" cursor={onClick ? 'pointer' : 'default'} onClick={onClick} flexShrink={0}>
      <Text fontFamily={FONT} fontWeight="500" fontSize="9px" lineHeight="1" color={c.gr72}>
        ?
      </Text>
    </Flex>
  );
}
export function FieldLabel({ children, onInfo }: { children: React.ReactNode; onInfo?: () => void }) {
  return (
    <Flex align="center" gap="4px" px="4px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.3px" color={c.gr42}>
        {children}
      </Text>
      {onInfo && <InfoDot onClick={onInfo} />}
    </Flex>
  );
}
export function TextField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Flex h="48px" w="100%" align="center" px="16px" bg={c.grF8} borderRadius="8px">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        border="none"
        bg="transparent"
        px="0"
        h="auto"
        fontFamily={FONT}
        fontSize="14px"
        letterSpacing="-0.35px"
        color={c.gr22}
        _placeholder={{ color: c.gr92 }}
        _focusVisible={{ boxShadow: 'none', outline: 'none' }}
      />
    </Flex>
  );
}
export function SelectRow({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <Flex as="button" h="48px" w="100%" align="center" px="16px" bg={c.grF8} borderRadius="8px" cursor="pointer" onClick={onClick}>
      <Text flex="1" textAlign="left" fontFamily={FONT} fontSize="14px" letterSpacing="-0.35px" color={c.gr42} truncate>
        {value}
      </Text>
      <Chevron />
    </Flex>
  );
}
