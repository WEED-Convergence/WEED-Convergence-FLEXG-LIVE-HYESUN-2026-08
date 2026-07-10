import { Box, Flex, Text, Image, Input as ChakraInput } from '@chakra-ui/react';
import { colors, FONT, asset } from '../../../tokens';

/** 섹션 제목 + (필수항목 표기) */
export function SectionTitle({ title, note = true }: { title: string; note?: boolean }) {
  return (
    <Flex align="center" gap="12px" pb="10px" pt="20px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="18px" letterSpacing="-0.36px" color={colors.gr42}>
        {title}
      </Text>
      {note && (
        <Flex align="center" gap="4px">
          <Image src={asset('popup-check.svg')} alt="" w="12px" h="10px" />
          <Text fontFamily={FONT} fontSize="12px" color="#929292">표시 필수항목</Text>
        </Flex>
      )}
    </Flex>
  );
}

/** 라벨/값 행 (라벨 160px + 값) */
export function Row({
  label,
  required = true,
  children,
  last = false,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Flex align="stretch" w="100%" borderBottom={last ? 'none' : '1px solid #E8E8E8'}>
      <Flex w="160px" flexShrink={0} bg={colors.grF8} px="16px" py="8px" align="flex-start">
        <Flex align="center" gap="4px" minH="30px">
          {required ? <Image src={asset('popup-check.svg')} alt="필수" w="12px" h="10px" /> : <Box w="12px" />}
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#929292" whiteSpace="nowrap">
            {label}
          </Text>
        </Flex>
      </Flex>
      <Flex flex="1" minW="0" bg="white" px="16px" py="8px" direction="column" justify="center" gap="6px">
        {children}
      </Flex>
    </Flex>
  );
}

export function Section({ title, note, children }: { title: string; note?: boolean; children: React.ReactNode }) {
  return (
    <Box w="100%">
      <SectionTitle title={title} note={note} />
      <Box borderTop="1px solid #E8E8E8" borderBottom="1px solid #E8E8E8">
        {children}
      </Box>
    </Box>
  );
}

export function TextInput({
  placeholder,
  defaultValue,
  width = '480px',
  type = 'text',
}: {
  placeholder?: string;
  defaultValue?: string;
  width?: string;
  type?: string;
}) {
  return (
    <ChakraInput
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      w={width}
      h="auto"
      bg="white"
      border="1px solid #D7D6D6"
      borderRadius="4px"
      px="8px"
      pt="6px"
      pb="7px"
      fontFamily={FONT}
      fontSize="12px"
      color={colors.gr42}
      _placeholder={{ color: colors.grB8 }}
      _focus={{ boxShadow: 'none', borderColor: colors.bcPoint }}
    />
  );
}

/** 숫자 입력 + 접미 단위 */
export function NumberWithUnit({
  unit,
  placeholder,
  defaultValue,
  width = '160px',
}: {
  unit: string;
  placeholder?: string;
  defaultValue?: string;
  width?: string;
}) {
  return (
    <Flex align="center" gap="4px">
      <TextInput type="number" placeholder={placeholder} defaultValue={defaultValue} width={width} />
      <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>{unit}</Text>
    </Flex>
  );
}

export function HelperText({ children, danger = false }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.22px" color={danger ? colors.red : '#929292'} lineHeight="1.5">
      {children}
    </Text>
  );
}

/** 라디오 (단일) */
export function Radio({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <Flex as="button" align="center" gap="4px" cursor="pointer" onClick={onClick} flexShrink={0}>
      <Flex w="13px" h="13px" borderRadius="100px" bg="white" border={`1px solid ${checked ? colors.blue : colors.gr72}`} align="center" justify="center" flexShrink={0}>
        {checked && <Box w="7px" h="7px" borderRadius="100px" bg={colors.blue} />}
      </Flex>
      <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={colors.gr72} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}

/** 체크박스 (단일) */
export function Checkbox({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <Flex as="button" align="center" gap="6px" cursor="pointer" onClick={onClick} flexShrink={0}>
      {checked ? (
        <Flex w="14px" h="14px" borderRadius="3px" bg={colors.blue} align="center" justify="center" flexShrink={0}>
          <svg width="11" height="11" viewBox="0 0 10 10">
            <path d="M1.5 5 L4 7.5 L8.5 2.5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Flex>
      ) : (
        <Box w="14px" h="14px" borderRadius="3px" border="1px solid #B8B8B8" bg="white" flexShrink={0} />
      )}
      <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={colors.gr72} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}

/** OFF/ON 토글 */
export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Flex as="button" align="center" gap="4px" cursor="pointer" onClick={onToggle}>
      <Text fontFamily="Inter, sans-serif" fontSize="8px" color={colors.gr72}>OFF</Text>
      <Image src={asset(on ? 'popup-toggle-on.svg' : 'popup-toggle-off.svg')} alt={on ? 'ON' : 'OFF'} w="28px" h="14px" />
      <Text fontFamily="Inter, sans-serif" fontSize="8px" color={colors.gr72}>ON</Text>
    </Flex>
  );
}

/** 세그먼트 토글 (공통설정 / 개별설정) */
export function Segmented({ options, active, onChange }: { options: [string, string]; active: string; onChange: (v: string) => void }) {
  return (
    <Flex border="1px solid #D7D6D6" borderRadius="4px" overflow="hidden" w="fit-content">
      {options.map((opt) => {
        const on = opt === active;
        return (
          <Flex
            key={opt}
            as="button"
            px="12px"
            pt="6px"
            pb="7px"
            align="center"
            justify="center"
            bg={on ? colors.green : 'white'}
            cursor="pointer"
            onClick={() => onChange(opt)}
          >
            <Text fontFamily={FONT} fontWeight={on ? '700' : '400'} fontSize="12px" letterSpacing="-0.24px" color={on ? 'white' : colors.grB8} whiteSpace="nowrap">
              {opt}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}

/** 버튼 우측 화살표 (›) */
export function RightChevron() {
  return (
    <svg width="5" height="9" viewBox="0 0 5 9" style={{ flexShrink: 0 }}>
      <path d="M1 1 L4 4.5 L1 8" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 인라인 문구 (단위/설명 텍스트) */
export function Lit({ children }: { children: React.ReactNode }) {
  return (
    <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={colors.gr72} whiteSpace="nowrap">
      {children}
    </Text>
  );
}

/** 셀렉트 박스 (정적 표시용) */
export function SelectInput({ label, width = '160px' }: { label: string; width?: string }) {
  return (
    <Flex bg="white" border="1px solid #D7D6D6" borderRadius="4px" pl="8px" pr="2px" pt="6px" pb="7px" w={width} align="center" justify="space-between" gap="4px" cursor="pointer">
      <Text fontFamily={FONT} fontSize="12px" color={colors.gr42} whiteSpace="nowrap">{label}</Text>
      <Image src={asset('popup-select-chevron.svg')} alt="" w="16px" h="16px" />
    </Flex>
  );
}
