// 할인코드 사용내역 — 신규 독립 화면. 기존 screens.tsx·discountCode2.tsx는 전혀 건드리지 않고
// 이 파일 + main.tsx의 라우팅 한 줄 + catalog.ts의 신규 엔트리 한 개(모두 추가만)로만 연결한다.
// 참고 스크린샷(할인코드 사용 검색 화면)을 1:1로 재현 — 문구/배치/목데이터는 이미지 그대로.
import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  AdminLayout, DataTable, FilledButton, SelectBox, Radio, LInput, LCheck,
  colors,
} from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif";

// 실제 서비스(어드민 › 회원) LNB 구성을 참고해 재현 — 할인코드2 화면과 동일 목록, 활성 항목만 다름
const SIDEBAR_ITEMS = [
  { label: '회원목록' },
  { label: '회원등급' },
  { label: '회원가입 현황', sub: [{ label: '회원가입 현황' }, { label: '채널별 회원가입 현황' }] },
  { label: '포인트 및 리워드' },
  { label: '포인트 사용내역' },
  { label: '리워드 현황', sub: [{ label: '리워드 매출 현황' }, { label: '리워드 회원가입 현황' }, { label: '리워드 App설치 현황' }] },
  { label: '할인코드' },
  { label: '할인코드 사용내역', active: true },
  { label: '쿠폰목록' },
  { label: '대량 쿠폰 자동 발급', badge: true },
  { label: '쿠폰코드', sub: [{ label: '쿠폰코드 목록' }, { label: '쿠폰코드 대량발급' }] },
  { label: '쿠폰 사용내역' },
  { label: '추첨 이벤트' },
  { label: '개인정보보호 배상책임보험' },
];

type UsageRow = {
  no: number; division: string; orderedAt: string; orderNo: string; code: string; kind: string; env: string;
  userId: string; name: string; phone: string; email: string;
};
const USAGE_ROWS: UsageRow[] = [
  { no: 61, division: '일반', orderedAt: '2026-07-23 12:03:56', orderNo: 'WAB260723-00000001', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'alwns1234', name: '정민준', phone: '010-4132-6396', email: 'alwns7984@naver.com' },
  { no: 60, division: '일반', orderedAt: '2026-05-21 16:44:49', orderNo: 'WAB260521-00000002', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'ziny123', name: '이진희', phone: '010-5215-3068', email: 'testflexg' },
  { no: 59, division: '일반', orderedAt: '2026-02-26 15:10:42', orderNo: 'WAB260226-00000015', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'testtest1', name: '진혜정', phone: '010-8775-0330', email: 'testflexg' },
  { no: 58, division: '일반', orderedAt: '2026-02-26 14:42:59', orderNo: 'WAB260226-00000012', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'testtest1', name: '진혜정', phone: '010-8775-0330', email: 'testflexg' },
  { no: 57, division: '일반', orderedAt: '2026-02-26 14:35:38', orderNo: 'WAB260226-00000010', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: '테스트', name: '-', phone: '010-0000-0000', email: '-' },
  { no: 56, division: '일반', orderedAt: '2026-02-26 14:21:56', orderNo: 'WAB260226-00000008', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'alwns1234', name: '정민준', phone: '010-4132-6396', email: 'alwns7984@naver.com' },
  { no: 55, division: '일반', orderedAt: '2026-02-26 14:20:47', orderNo: 'WAB260226-00000007', code: '할인해주세요', kind: '500,000원', env: 'Web', userId: 'alwns1234', name: '정민준', phone: '010-4132-6396', email: 'alwns7984@naver.com' },
  { no: 54, division: '일반', orderedAt: '2026-02-26 14:07:12', orderNo: 'WAB260226-00000004', code: '할인코드취소주문금액할인코드취소', kind: '10,000원', env: 'Web', userId: 'jinhee1', name: '이진희', phone: '010-0000-0000', email: '-' },
];

// 라벨 + 입력을 한 줄에 나란히 놓는 검색 필드(이 화면 전용 레이아웃)
function FieldRow({ label, labelWidth = '64px', children }: { label: string; labelWidth?: string; children: React.ReactNode }) {
  return (
    <Flex align="center" gap="10px" flex="1" minW="0">
      <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap" w={labelWidth} flexShrink={0}>{label}</Text>
      <Box flex="1" minW="0">{children}</Box>
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

// 사용내역 다운로드 버튼 아이콘 — 표준 아이콘 없어 화면 내 임시 조립(디자인시스템 요청 대상)
function DownloadGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DiscountCodeUsage() {
  const [division, setDivision] = useState<'일반' | 'CRM'>('일반');
  const [orderNoQ, setOrderNoQ] = useState('');
  const [codeQ, setCodeQ] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [quick, setQuick] = useState<string | null>(null);
  const [env, setEnv] = useState<'전체' | 'APP' | 'Web(PC/Mobile)'>('전체');
  const [memberType, setMemberType] = useState<'전체' | '회원' | '비회원'>('전체');
  const [idQ, setIdQ] = useState('');
  const [nameQ, setNameQ] = useState('');
  const [phoneQ, setPhoneQ] = useState('');
  const [emailQ, setEmailQ] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleRow = (no: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no); else next.add(no);
      return next;
    });
  };

  return (
    <AdminLayout navActive="회원" sidebar={{ title: '회원', items: SIDEBAR_ITEMS }}>
      <Box fontFamily={FONT} color={colors.gr42} minW="1200px">
        {/* 1. 할인코드 사용 검색 */}
        <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="16px">할인코드 사용 검색</Text>
        <Box data-doc-mark="search" border={`1px solid ${colors.grE8}`} borderRadius="12px" p="24px" mb="24px">
          <Flex align="center" gap="24px" pb="20px">
            <Flex align="center" gap="14px" flexShrink={0}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap">구분</Text>
              <Radio checked={division === '일반'} label="일반" onClick={() => setDivision('일반')} />
              <Radio checked={division === 'CRM'} label="CRM" onClick={() => setDivision('CRM')} />
            </Flex>
            <FieldRow label="주문번호">
              <LInput value={orderNoQ} onChange={setOrderNoQ} placeholder="주문번호 입력" width="100%" />
            </FieldRow>
            <FieldRow label="할인코드">
              <LInput value={codeQ} onChange={setCodeQ} placeholder="할인코드 입력" width="100%" />
            </FieldRow>
          </Flex>
          <Box borderTop={`1px solid ${colors.grE8}`} pt="20px" pb="20px">
            <Flex align="center" gap="24px" wrap="wrap">
              <Flex align="center" gap="10px" flexShrink={0}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap" w="64px">주문일</Text>
                <LInput value={dateFrom} onChange={setDateFrom} placeholder="날짜 입력" width="140px" />
                <Text color={colors.gr72}>~</Text>
                <LInput value={dateTo} onChange={setDateTo} placeholder="날짜 입력" width="140px" />
              </Flex>
              <Flex align="center" gap="6px" flexShrink={0}>
                {['오늘', '7일', '15일', '1개월', '2개월', '전체'].map((q) => (
                  <QuickRangeButton key={q} label={q} active={quick === q} onClick={() => setQuick(q)} />
                ))}
              </Flex>
              <Box flex="1" />
              <Flex align="center" gap="14px" flexShrink={0}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap">사용 환경</Text>
                <Radio checked={env === '전체'} label="전체" onClick={() => setEnv('전체')} />
                <Radio checked={env === 'APP'} label="APP" onClick={() => setEnv('APP')} />
                <Radio checked={env === 'Web(PC/Mobile)'} label="Web(PC/Mobile)" onClick={() => setEnv('Web(PC/Mobile)')} />
              </Flex>
              <Flex align="center" gap="14px" flexShrink={0}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42} whiteSpace="nowrap">회원 구분</Text>
                <Radio checked={memberType === '전체'} label="전체" onClick={() => setMemberType('전체')} />
                <Radio checked={memberType === '회원'} label="회원" onClick={() => setMemberType('회원')} />
                <Radio checked={memberType === '비회원'} label="비회원" onClick={() => setMemberType('비회원')} />
              </Flex>
            </Flex>
          </Box>
          <Box borderTop={`1px solid ${colors.grE8}`} pt="20px">
            <Flex align="center" gap="24px" wrap="wrap">
              <FieldRow label="아이디"><LInput value={idQ} onChange={setIdQ} placeholder="아이디 입력" width="100%" /></FieldRow>
              <FieldRow label="이름"><LInput value={nameQ} onChange={setNameQ} placeholder="이름 입력" width="100%" /></FieldRow>
              <FieldRow label="연락처"><LInput value={phoneQ} onChange={setPhoneQ} placeholder="연락처 입력" width="100%" /></FieldRow>
              <FieldRow label="이메일"><LInput value={emailQ} onChange={setEmailQ} placeholder="이메일 주소 입력" width="100%" /></FieldRow>
            </Flex>
          </Box>
        </Box>
        <Flex justify="center" gap="8px" pb="36px">
          <FilledButton label="초기화" bg={colors.bcSub} />
          <FilledButton label="검색" bg={colors.bcPoint} />
        </Flex>

        {/* 2. 할인코드 사용 리스트 */}
        <Flex align="baseline" justify="space-between" pb="14px">
          <Flex align="baseline" gap="8px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="18px" color={colors.gr42}>할인코드 사용 리스트</Text>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>전체 61건 (페이지 1/2)</Text>
          </Flex>
          <Flex align="center" gap="8px">
            <Flex align="center" gap="6px" bg={colors.green} borderRadius="4px" px="12px" h="32px" cursor="pointer">
              <DownloadGlyph />
              <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color="white" whiteSpace="nowrap">할인코드 사용내역</Text>
            </Flex>
            <SelectBox label="50개씩 보기" width="150px" options={['20개씩 보기', '50개씩 보기', '100개씩 보기']} />
          </Flex>
        </Flex>
        <Box data-doc-mark="table">
        <DataTable
          columns={[
            { header: [''], w: '46px' },
            { header: ['No'], w: '70px' },
            { header: ['구분'], w: '80px' },
            { header: ['주문일'], w: '150px' },
            { header: ['주문번호'], flex: '1.1' },
            { header: ['할인코드'], flex: '1.2' },
            { header: ['할인종류'], w: '110px' },
            { header: ['사용 환경'], w: '90px' },
            { header: ['아이디', '이름'], w: '120px' },
            { header: ['연락처', '이메일'], flex: '1.2' },
          ]}
          rows={USAGE_ROWS.map((r) => [
            <LCheck checked={selected.has(r.no)} onChange={() => toggleRow(r.no)} />,
            r.no,
            r.division,
            r.orderedAt,
            r.orderNo,
            r.code,
            r.kind,
            r.env,
            <Flex direction="column" gap="2px" align="center"><Text>{r.userId}</Text><Text color={colors.gr92}>{r.name}</Text></Flex>,
            <Flex direction="column" gap="2px" align="center"><Text>{r.phone}</Text><Text color={colors.gr92}>{r.email}</Text></Flex>,
          ])}
        />
        </Box>
      </Box>
    </AdminLayout>
  );
}
