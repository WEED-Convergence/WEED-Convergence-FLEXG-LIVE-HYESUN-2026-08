// 할인코드2 — 신규 독립 화면. 기존 screens.tsx(할인코드 등) 파일은 전혀 건드리지 않고
// 이 파일 + main.tsx의 라우팅 한 줄 + catalog.ts의 신규 엔트리 한 개(모두 추가만)로만 연결한다.
// 참고 스크린샷(할인코드 사용여부 설정 화면)을 1:1로 재현 — 문구/배치/목데이터는 이미지 그대로.
// 유일한 의도적 차이: 「구분」 라디오에 「라이브」를 추가하고 기본 선택값을 「라이브」로 둔 것(요청사항).
import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  AdminLayout, DataTable, FilledButton, SelectBox, Radio, Toggle, LInput, LCheck,
  colors,
} from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif";

// 실제 서비스(어드민 › 회원) LNB 구성을 참고해 재현
const SIDEBAR_ITEMS = [
  { label: '회원목록' },
  { label: '회원등급' },
  { label: '회원가입 현황', sub: [{ label: '회원가입 현황' }, { label: '채널별 회원가입 현황' }] },
  { label: '포인트 및 리워드' },
  { label: '포인트 사용내역' },
  { label: '리워드 현황', sub: [{ label: '리워드 매출 현황' }, { label: '리워드 회원가입 현황' }, { label: '리워드 App설치 현황' }] },
  { label: '할인코드', active: true },
  { label: '할인코드 사용내역' },
  { label: '쿠폰목록' },
  { label: '대량 쿠폰 자동 발급', badge: true },
  { label: '쿠폰코드', sub: [{ label: '쿠폰코드 목록' }, { label: '쿠폰코드 대량발급' }] },
  { label: '쿠폰 사용내역' },
  { label: '추첨 이벤트' },
  { label: '개인정보보호 배상책임보험' },
];

type CodeRow = { division: string; used: boolean; code: string; kind: string; date: string; env: string; memo: string };
const CODE_ROWS: CodeRow[] = [
  { division: '라이브', used: true, code: '베리타이어드', kind: '1,000원', date: '2026-08-25', env: '전체', memo: '여름 특가 라이브' },
  { division: '라이브', used: true, code: 'XXXX', kind: '12%', date: '2026-08-04', env: '전체', memo: '뜸한 고객 재방문 유도 라이브' },
  { division: '라이브', used: true, code: 'EEEEOO', kind: '10,000원', date: '2026-08-03', env: '전체', memo: '신규 고객 첫 구매 라이브' },
  { division: '라이브', used: true, code: '앱미설치CRM할인코드', kind: '20%', date: '2026-07-20', env: 'APP', memo: 'APP 미설치 고객 설치 유도 라이브' },
  { division: '라이브', used: true, code: '테스트0720', kind: '20%', date: '2026-07-20', env: '전체', memo: '뜸한 고객 재방문 유도 라이브' },
  { division: '라이브', used: true, code: '테스트111', kind: '20%', date: '2026-07-20', env: '전체', memo: '신규 고객 첫 구매 라이브' },
];

// 라벨 + 입력을 한 줄에 나란히 놓는 검색 필드(이 화면 전용 레이아웃)
function FieldRow({ label, labelWidth = '64px', children }: { label: string; labelWidth?: string; children: React.ReactNode }) {
  return (
    <Flex align="center" gap="10px" flexShrink={0}>
      <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap" w={labelWidth} flexShrink={0}>{label}</Text>
      {children}
    </Flex>
  );
}

function QuickRangeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Flex as="button" onClick={onClick} align="center" justify="center" h="30px" px="10px" borderRadius="4px"
      bg={active ? colors.bcPoint : 'white'} border={`1px solid ${active ? colors.bcPoint : '#D7D6D6'}`} cursor="pointer" flexShrink={0}>
      <Text fontFamily={FONT} fontSize="12px" fontWeight="700" color={active ? 'white' : colors.gr72} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}

export function DiscountCode2() {
  const [useCode, setUseCode] = useState(false);
  const [codeQ, setCodeQ] = useState('');
  const [memoQ, setMemoQ] = useState('');
  const [division, setDivision] = useState<'일반' | 'CRM' | '라이브'>('라이브');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [quick, setQuick] = useState<string | null>(null);
  const [usedFilter, setUsedFilter] = useState<'전체' | '사용' | '사용안함'>('전체');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleRow = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  return (
    <AdminLayout navActive="회원" sidebar={{ title: '회원', items: SIDEBAR_ITEMS }}>
      <Box fontFamily={FONT} color={colors.gr42} minW="1200px">
        {/* 1. 할인코드 사용여부 설정 */}
        <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="10px">할인코드 사용여부 설정</Text>
        <Text fontFamily={FONT} fontSize="12.5px" color={colors.gr72} pb="16px">
          · 할인코드는 고객이 상품 구매 시 입력하여 특정 금액 또는 비율의 할인을 받을 수 있도록 제공되는 고유한 문자나 숫자의 조합을 의미합니다.
        </Text>
        <Box data-doc-mark="toggle" border={`1px solid ${colors.grE8}`} borderRadius="4px" mb="24px">
          <Flex align="center" gap="16px" px="20px" py="16px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} w="120px" flexShrink={0}>할인코드 사용 여부</Text>
            <Toggle on={useCode} onToggle={() => setUseCode((v) => !v)} />
          </Flex>
        </Box>
        <Flex justify="center" pb="36px">
          <FilledButton label="적용" bg={colors.bcPoint} px="28px" />
        </Flex>

        {/* 2. 할인코드 검색 */}
        <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="16px">할인코드 검색</Text>
        <Box data-doc-mark="search" border={`1px solid ${colors.grE8}`} borderRadius="12px" p="24px" mb="24px">
          <Flex align="center" gap="24px" pb="20px">
            <FieldRow label="할인코드">
              <LInput value={codeQ} onChange={setCodeQ} placeholder="할인코드 입력" width="260px" />
            </FieldRow>
            <FieldRow label="메모">
              <LInput value={memoQ} onChange={setMemoQ} placeholder="관리자 메모 입력" width="260px" />
            </FieldRow>
            <Flex align="center" gap="14px" flexShrink={0}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap">구분</Text>
              <Radio checked={division === '일반'} label="일반" onClick={() => setDivision('일반')} />
              <Radio checked={division === 'CRM'} label="CRM" onClick={() => setDivision('CRM')} />
              <Radio checked={division === '라이브'} label="라이브" onClick={() => setDivision('라이브')} />
            </Flex>
          </Flex>
          <Box borderTop={`1px solid ${colors.grE8}`} pt="20px">
            <Flex align="center" gap="24px" wrap="wrap">
              <Flex align="center" gap="10px" flexShrink={0}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap" w="64px">등록일</Text>
                <LInput value={dateFrom} onChange={setDateFrom} placeholder="날짜 입력" width="140px" />
                <Text color={colors.gr72}>~</Text>
                <LInput value={dateTo} onChange={setDateTo} placeholder="날짜 입력" width="140px" />
              </Flex>
              <Flex align="center" gap="6px" flexShrink={0}>
                {['오늘', '7일', '15일', '1개월', '2개월', '전체'].map((q) => (
                  <QuickRangeButton key={q} label={q} active={quick === q} onClick={() => setQuick(q)} />
                ))}
              </Flex>
              <Flex align="center" gap="14px" flexShrink={0}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap">사용여부</Text>
                <Radio checked={usedFilter === '전체'} label="전체" onClick={() => setUsedFilter('전체')} />
                <Radio checked={usedFilter === '사용'} label="사용" onClick={() => setUsedFilter('사용')} />
                <Radio checked={usedFilter === '사용안함'} label="사용안함" onClick={() => setUsedFilter('사용안함')} />
              </Flex>
            </Flex>
          </Box>
        </Box>
        <Flex justify="center" gap="8px" pb="36px">
          <FilledButton label="초기화" bg={colors.bcSub} />
          <FilledButton label="검색" bg={colors.bcPoint} />
        </Flex>

        {/* 3. 할인코드 리스트 */}
        <Flex align="baseline" justify="space-between" pb="14px">
          <Flex align="baseline" gap="8px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="18px" color={colors.gr42}>할인코드 리스트</Text>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>전체 95개 (페이지 1/1)</Text>
          </Flex>
          <SelectBox label="100개씩 보기" width="150px" options={['20개씩 보기', '50개씩 보기', '100개씩 보기']} />
        </Flex>
        <Box data-doc-mark="table">
        <DataTable
          columns={[
            { header: [''], w: '46px' },
            { header: ['구분'], w: '90px' },
            { header: ['사용여부'], w: '100px' },
            { header: ['할인코드'], flex: '1.2' },
            { header: ['할인종류'], w: '110px' },
            { header: ['등록일'], w: '120px' },
            { header: ['사용 환경'], w: '100px' },
            { header: ['메모'], flex: '2' },
            { header: ['관리'], w: '150px' },
          ]}
          rows={CODE_ROWS.map((r) => [
            <LCheck checked={selected.has(r.code)} onChange={() => toggleRow(r.code)} />,
            r.division,
            r.used ? '사용함' : '사용안함',
            <Text fontFamily={FONT} fontWeight="700" color={colors.green}>{r.code}</Text>,
            r.kind,
            r.date,
            r.env,
            r.memo,
            <Flex gap="6px">
              <FilledButton label="수정" bg={colors.bcDefault} />
              <FilledButton label="삭제" bg={colors.red} />
            </Flex>,
          ])}
        />
        </Box>
      </Box>
    </AdminLayout>
  );
}
