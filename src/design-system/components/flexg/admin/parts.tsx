import { useState } from 'react';
import { Flex, Text, Image, Box } from '@chakra-ui/react';
import { colors, FONT, bevelShadow, asset } from '../../../tokens';

/** 3-레이어 베벨 버튼 (border + fill + inset shadow) — Figma 공통 버튼 패턴 */
export function FilledButton({
  label,
  bg,
  iconLeft,
  iconRight,
  fontSize = '12px',
  px = '12px',
  pt = '6px',
  pb = '7px',
  onClick,
  markId,
}: {
  label: string;
  bg: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fontSize?: string;
  px?: string;
  pt?: string;
  pb?: string;
  onClick?: () => void;
  markId?: string; // docs 화면 마커 앵커(data-doc-mark)
}) {
  return (
    <Flex
      as="button"
      data-doc-mark={markId}
      align="center"
      justify="center"
      gap="4px"
      bg={bg}
      border="1px solid rgba(0,0,0,0.3)"
      borderRadius="4px"
      px={px}
      pt={pt}
      pb={pb}
      boxShadow={bevelShadow}
      cursor="pointer"
      flexShrink={0}
      onClick={onClick}
    >
      {iconLeft}
      <Text
        fontFamily={FONT}
        fontWeight="700"
        fontSize={fontSize}
        letterSpacing="-0.24px"
        color="white"
        whiteSpace="nowrap"
      >
        {label}
      </Text>
      {iconRight}
    </Flex>
  );
}

/** 아웃라인 버튼 — 흰 배경 + 얇은 테두리(작은 행 액션용, 예: 지급/차감/회수). 표 셀의 보조 액션에 사용 */
export function OutlineButton({
  label,
  fontSize = '12px',
  px = '10px',
  pt = '5px',
  pb = '6px',
  onClick,
  markId,
}: {
  label: string;
  fontSize?: string;
  px?: string;
  pt?: string;
  pb?: string;
  onClick?: () => void;
  markId?: string; // docs 화면 마커 앵커(data-doc-mark)
}) {
  return (
    <Flex
      as="button"
      data-doc-mark={markId}
      align="center"
      justify="center"
      bg="white"
      border={`1px solid ${colors.grD8}`}
      borderRadius="4px"
      px={px}
      pt={pt}
      pb={pb}
      cursor="pointer"
      flexShrink={0}
      onClick={onClick}
      _hover={{ bg: colors.grF8 }}
    >
      <Text fontFamily={FONT} fontWeight="700" fontSize={fontSize} letterSpacing="-0.24px" color={colors.gr42} whiteSpace="nowrap">
        {label}
      </Text>
    </Flex>
  );
}

/** 흰 배경 입력 박스 (placeholder/값 표시용 — 프로토타입은 정적 텍스트) */
export function InputBox({
  placeholder,
  value,
  width = '320px',
}: {
  placeholder?: string;
  value?: string;
  width?: string;
}) {
  return (
    <Flex
      bg="white"
      border="1px solid #D7D6D6"
      borderRadius="4px"
      px="8px"
      pt="6px"
      pb="7px"
      w={width}
      align="center"
    >
      <Text fontFamily={FONT} fontSize="12px" color={value ? '#424242' : '#B8B8B8'} whiteSpace="nowrap">
        {value ?? placeholder}
      </Text>
    </Flex>
  );
}

/** 드롭다운 선택 박스 — options 전달 시 클릭하면 열리는 드롭다운, onSelect로 선택값 전달 */
export type SelectOption = string | { divider: true };

export function SelectBox({
  label,
  width,
  options,
  onSelect,
}: {
  label: string;
  width?: string;
  options?: SelectOption[];
  onSelect?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const interactive = !!options?.length;
  const display = selected ?? label;

  const choose = (value: string) => {
    setSelected(value);
    setOpen(false);
    onSelect?.(value);
  };

  return (
    <Box position="relative" w={width} flexShrink={0}>
      <Flex
        as="button"
        bg="white"
        border="1px solid #D7D6D6"
        borderRadius="4px"
        pl="8px"
        pr="2px"
        pt="6px"
        pb="7px"
        w="100%"
        align="center"
        justify="space-between"
        gap="4px"
        cursor="pointer"
        onClick={() => interactive && setOpen((o) => !o)}
      >
        <Text fontFamily={FONT} fontSize="12px" color="#424242" whiteSpace="nowrap">
          {display}
        </Text>
        <Image
          src={asset('popup-select-chevron.svg')}
          alt=""
          w="16px"
          h="16px"
          transform={open ? 'rotate(180deg)' : undefined}
        />
      </Flex>

      {open && interactive && (
        <>
          <Box position="fixed" inset="0" zIndex={20} onClick={() => setOpen(false)} />
          <Box
            position="absolute"
            top="calc(100% + 2px)"
            left="0"
            minW="100%"
            w="max-content"
            bg="white"
            border="1px solid #D7D6D6"
            borderRadius="4px"
            py="6px"
            zIndex={21}
            boxShadow="0px 2px 8px 0px rgba(0,0,0,0.12)"
          >
            {options!.map((opt, i) =>
              typeof opt === 'object' ? (
                <Box key={`div-${i}`} h="1px" bg="#E8E8E8" my="4px" mx="8px" />
              ) : (
                <Flex
                  key={opt}
                  as="button"
                  w="100%"
                  px="8px"
                  py="6px"
                  align="center"
                  cursor="pointer"
                  _hover={{ bg: colors.grF8 }}
                  onClick={() => choose(opt)}
                >
                  <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color="#424242" whiteSpace="nowrap">
                    {opt}
                  </Text>
                </Flex>
              ),
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

/** 페이지네이션 (1~10 + next/last) */
export function Pagination() {
  const pages = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <Flex py="20px" align="center" justify="center" gap="2px" w="100%">
      {pages.map((p) => {
        const active = p === 1;
        return (
          <Flex
            key={p}
            w="30px"
            h="30px"
            align="center"
            justify="center"
            borderRadius="8px"
            bg={active ? colors.grF2 : 'transparent'}
            cursor="pointer"
            _hover={{ bg: active ? colors.grF2 : '#FAFAFA' }}
          >
            <Text fontFamily={FONT} fontWeight={active ? '700' : '400'} fontSize="12px" color={colors.gr92}>
              {p}
            </Text>
          </Flex>
        );
      })}
      <Image src={asset('page-next.svg')} alt="다음" w="30px" h="30px" cursor="pointer" transform="scaleX(-1)" />
      <Image src={asset('page-first.svg')} alt="마지막" w="30px" h="30px" cursor="pointer" transform="scaleX(-1)" />
    </Flex>
  );
}

/** 필수항목 체크 라벨 */
/** 리스트 탭 검색 — 입력 + 검색/초기화. onSearch(q)로 적용. (Enter도 검색) */
export function ListSearch({ placeholder = '검색어 입력', width = '200px', onSearch, onReset, markId }: { placeholder?: string; width?: string; onSearch: (q: string) => void; onReset?: () => void; markId?: string }) {
  const [q, setQ] = useState('');
  const apply = () => onSearch(q.trim());
  const reset = () => { setQ(''); onReset?.(); };
  return (
    <Flex data-doc-mark={markId} gap="4px" align="center">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
        placeholder={placeholder}
        style={{ width, height: '30px', boxSizing: 'border-box', border: '1px solid #D7D6D6', borderRadius: '4px', padding: '0 8px', fontFamily: FONT, fontSize: '12px', color: '#424242' }}
      />
      <FilledButton label="검색" bg={colors.bcPoint} onClick={apply} />
      {onReset && <FilledButton label="초기화" bg={colors.bcSub} onClick={reset} />}
    </Flex>
  );
}

export function RequiredLabel({ label, required = true }: { label: string; required?: boolean }) {
  return (
    <Flex align="center" gap="4px" h="30px">
      {required ? (
        <Image src={asset('popup-check.svg')} alt="필수" w="12px" h="10px" />
      ) : (
        <Box w="12px" h="12px" />
      )}
      <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#929292" whiteSpace="nowrap">
        {label}
      </Text>
    </Flex>
  );
}
