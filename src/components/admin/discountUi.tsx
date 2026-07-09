/* 할인코드 화면 전용 실동작 입력 컴포넌트들.
 * 공유 InputBox/Pagination/체크박스 이미지는 시안용 표시 목업이라 동작 안 함 →
 * 이 화면들에서만 쓰는 진짜 동작하는 버전을 별도로 둔다(공유 컴포넌트 무영향). */
import { useState } from 'react';
import { Input as ChakraInput, Flex, Text, Box } from '@chakra-ui/react';
import { colors, FONT } from '../../styles/tokens';

// 실제 타이핑되는 입력창 (InputBox 시안과 동일한 룩)
export function LInput({ value, onChange, placeholder, width = '320px', type = 'text', onEnter }: {
  value: string; onChange: (v: string) => void; placeholder?: string; width?: string; type?: string; onEnter?: () => void;
}) {
  return (
    <ChakraInput
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onEnter?.(); }}
      placeholder={placeholder}
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

// 실제 토글되는 체크박스 (popup-checkbox.svg 시안과 유사한 룩)
export function LCheck({ checked, onChange, size = 14 }: { checked: boolean; onChange: (next: boolean) => void; size?: number }) {
  return (
    <Flex
      as="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      w={`${size}px`}
      h={`${size}px`}
      flexShrink={0}
      borderRadius="3px"
      border={`1.5px solid ${checked ? colors.bcPoint : '#C4C4C4'}`}
      bg={checked ? colors.bcPoint : 'white'}
      align="center"
      justify="center"
      cursor="pointer"
    >
      {checked && (
        <svg width={size - 5} height={size - 5} viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2 5 8.6 9.5 3.6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Flex>
  );
}

// 유효기간 수동 선택 날짜 모달 — 달력 + 시:분 선택. 값 형식 'YYYY-MM-DD HH:MM'.
const pad = (n: number) => String(n).padStart(2, '0');
const clampNum = (v: string, max: number) => { const n = Math.max(0, Math.min(max, parseInt(v.replace(/\D/g, '') || '0', 10))); return pad(n); };
function parseYmdHm(v: string): { y: number; m: number; d: number; hh: string; mm: string } | null {
  const m = v.match(/(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?/);
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3], hh: m[4] ?? '00', mm: m[5] ?? '00' };
}

export function LDateModal({ value, title, onConfirm, onClose }: { value: string; title: string; onConfirm: (v: string) => void; onClose: () => void }) {
  const base = parseYmdHm(value) ?? { y: 2026, m: 6, d: 24, hh: '00', mm: '00' };
  const [y, setY] = useState(base.y);
  const [mon, setMon] = useState(base.m); // 1~12
  const [day, setDay] = useState(base.d);
  const [hh, setHh] = useState(base.hh);
  const [mm, setMm] = useState(base.mm);

  const startWeekday = new Date(y, mon - 1, 1).getDay();
  const daysInMonth = new Date(y, mon, 0).getDate();
  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const shift = (delta: number) => { let nm = mon + delta, ny = y; if (nm < 1) { nm = 12; ny--; } if (nm > 12) { nm = 1; ny++; } setY(ny); setMon(nm); if (day > new Date(ny, nm, 0).getDate()) setDay(new Date(ny, nm, 0).getDate()); };

  return (
    <Flex position="fixed" inset="0" bg="rgba(0,0,0,0.45)" align="center" justify="center" zIndex={1000} onClick={onClose}>
      <Box bg="white" borderRadius="8px" w="320px" boxShadow="0 8px 30px rgba(0,0,0,0.25)" onClick={(e) => e.stopPropagation()}>
        <Flex h="44px" bg="#2B2E36" align="center" justify="space-between" px="14px" borderTopRadius="8px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="white">{title}</Text>
          <Box as="button" onClick={onClose} cursor="pointer"><Text fontFamily={FONT} fontSize="16px" color="white">×</Text></Box>
        </Flex>
        <Box p="14px">
          {/* 월 이동 */}
          <Flex align="center" justify="space-between" pb="10px">
            <Box as="button" onClick={() => shift(-1)} px="8px" cursor="pointer"><Text fontFamily={FONT} fontSize="16px" color={colors.gr72}>‹</Text></Box>
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42}>{y}년 {mon}월</Text>
            <Box as="button" onClick={() => shift(1)} px="8px" cursor="pointer"><Text fontFamily={FONT} fontSize="16px" color={colors.gr72}>›</Text></Box>
          </Flex>
          {/* 요일 */}
          <Flex>{['일', '월', '화', '수', '목', '금', '토'].map((w, i) => (
            <Flex key={w} flex="1" justify="center" py="4px"><Text fontFamily={FONT} fontSize="11px" color={i === 0 ? '#C83434' : colors.gr92}>{w}</Text></Flex>
          ))}</Flex>
          {/* 날짜 그리드 */}
          <Box>
            {Array.from({ length: Math.ceil(cells.length / 7) }, (_, r) => (
              <Flex key={r}>{cells.slice(r * 7, r * 7 + 7).map((c, i) => (
                <Flex key={i} flex="1" justify="center" py="2px">
                  {c == null ? <Box w="30px" h="30px" /> : (
                    <Flex as="button" onClick={() => setDay(c)} w="30px" h="30px" align="center" justify="center" borderRadius="100px"
                      bg={c === day ? colors.bcPoint : 'transparent'} cursor="pointer" _hover={{ bg: c === day ? colors.bcPoint : colors.grF8 }}>
                      <Text fontFamily={FONT} fontSize="12px" color={c === day ? 'white' : colors.gr42}>{c}</Text>
                    </Flex>
                  )}
                </Flex>
              ))}</Flex>
            ))}
          </Box>
          {/* 시:분 */}
          <Flex align="center" gap="6px" justify="center" mt="12px" pt="12px" borderTop={`1px solid ${colors.grE8}`}>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>시간</Text>
            <ChakraInput value={hh} onChange={(e) => setHh(clampNum(e.target.value, 23))} w="44px" h="auto" textAlign="center" px="4px" py="5px" border="1px solid #D7D6D6" borderRadius="4px" fontFamily={FONT} fontSize="12px" />
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>:</Text>
            <ChakraInput value={mm} onChange={(e) => setMm(clampNum(e.target.value, 59))} w="44px" h="auto" textAlign="center" px="4px" py="5px" border="1px solid #D7D6D6" borderRadius="4px" fontFamily={FONT} fontSize="12px" />
          </Flex>
        </Box>
        <Flex bg="#E1E3E4" py="12px" gap="6px" justify="center" borderBottomRadius="8px">
          <Box as="button" onClick={onClose} bg={colors.bcSub} borderRadius="4px" px="20px" py="6px" cursor="pointer"><Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="white">취소</Text></Box>
          <Box as="button" onClick={() => onConfirm(`${y}-${pad(mon)}-${pad(day)} ${hh}:${mm}`)} bg={colors.bcPoint} borderRadius="4px" px="20px" py="6px" cursor="pointer"><Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="white">확인</Text></Box>
        </Flex>
      </Box>
    </Flex>
  );
}

// 실제 이동하는 페이지네이션
export function LPager({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return <Box py="20px" />;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const Arrow = ({ label, to, disabled }: { label: string; to: number; disabled: boolean }) => (
    <Flex as="button" w="30px" h="30px" align="center" justify="center" borderRadius="8px" cursor={disabled ? 'default' : 'pointer'}
      opacity={disabled ? 0.35 : 1} _hover={{ bg: disabled ? 'transparent' : '#FAFAFA' }} onClick={() => !disabled && onPage(to)}>
      <Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>{label}</Text>
    </Flex>
  );
  return (
    <Flex py="20px" align="center" justify="center" gap="2px" w="100%">
      <Arrow label="‹" to={page - 1} disabled={page <= 1} />
      {pages.map((p) => {
        const active = p === page;
        return (
          <Flex key={p} as="button" w="30px" h="30px" align="center" justify="center" borderRadius="8px"
            bg={active ? colors.grF2 : 'transparent'} cursor="pointer" _hover={{ bg: active ? colors.grF2 : '#FAFAFA' }} onClick={() => onPage(p)}>
            <Text fontFamily={FONT} fontWeight={active ? '700' : '400'} fontSize="12px" color={colors.gr92}>{p}</Text>
          </Flex>
        );
      })}
      <Arrow label="›" to={page + 1} disabled={page >= totalPages} />
    </Flex>
  );
}
