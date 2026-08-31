/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// 프리뷰용 샘플 화면 — 실제 프로젝트에선 이 자리에 진짜 앱 화면이 들어간다.
// 핵심: 설명 패널과 매칭할 영역에 data-doc-mark="키" 를 달면 번호 마커가 자동으로 얹힌다.
//       탭 있는 화면은 data-doc-tab 으로 탭 컨텍스트를 표시한다.
import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
// 표준 컴포넌트 조합. deep import 금지, 디자인시스템 공개 배럴로만 소비.
import {
  AdminLayout, SectionHead,
  DataTable, FilledButton, OutlineButton, TextInput, RequiredLabel, SelectBox, Pagination, HelperText, PromoBanner,
  TabStrip, Section, SectionTitle, Row, Radio, LInput, LCheck,
  colors, FONT as AFONT,
} from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif"; // 화면 콘텐츠 폰트 — 전체 프리텐다드 통일

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100dvh" bg="#F7F8FA" fontFamily={FONT} color="#1F2937" p="28px">
      <Box maxW="900px" mx="auto">{children}</Box>
    </Box>
  );
}

// ── 라이브 단골 리스트 — 실제 서비스(어드민 › LIVE › 라이브 단골 관리, oct=1) 구성을 참고해 재현 ──
const REGULARS_SIDEBAR_ITEMS = [
  { label: '라이브 통계 대시보드' },
  { label: '라이브 방송 관리' },
  {
    label: '라이브 단골 관리',
    sub: [
      { label: '단골 리스트', active: true },
      { label: '단골 쿠폰 꾸미기' },
      { label: '혜택 발급 설정' },
    ],
  },
  { label: '라이브 채팅 관리' },
  { label: '라이브 게임 관리' },
  { label: '동시송출 설정' },
  { label: '방송 녹화본' },
];

// 회원 구분 배지(기존/신규) — 아웃라인 + 점. 표준 배지(StatusPill)는 솔리드 전용이라
// 이 화면 전용으로 임시 조립(표준 컴포넌트 미적용 — 디자인시스템 요청 대상, 우측 설명 참고).
function RegularBadge({ tone }: { tone: 'existing' | 'new' }) {
  const c = tone === 'new' ? colors.green : colors.gr72;
  return (
    <Flex border={`1px solid ${tone === 'new' ? colors.green : colors.grD8}`} borderRadius="24px" px="8px" py="3px" align="center" gap="4px" w="fit-content">
      <Box w="5px" h="5px" borderRadius="100px" bg={c} />
      <Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color={c} whiteSpace="nowrap">{tone === 'new' ? '신규' : '기존'}</Text>
    </Flex>
  );
}

type RegularRow = {
  no: string; name: string; tone: 'existing' | 'new'; nickname: string; phone: string;
  userId: string; email: string; loginCount: string; lastLogin: string;
  put: string; buy: string; amount: string; joinedAt: string;
  lastPurchase: string; marketingAgree: boolean;
};
const REGULAR_ROWS: RegularRow[] = [
  { no: '1930', name: '홍길동', tone: 'existing', nickname: '길동이님', phone: '010-1234-5678', userId: 'gildong01', email: 'gildong01@example.com', loginCount: '128회', lastLogin: '2026-08-25', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2024-09-24 16:02:24', lastPurchase: '2026-08-18', marketingAgree: true },
  { no: '1929', name: '당웨이', tone: 'new', nickname: '웨이웨이', phone: '010-1234-9999', userId: 'dangwei99', email: 'dangwei99@example.com', loginCount: '12회', lastLogin: '2026-08-24', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 14:33:20', lastPurchase: '2026-08-21', marketingAgree: true },
  { no: '1927', name: '카리나', tone: 'new', nickname: '겨울요정', phone: '010-1234-5678', userId: 'karina_w', email: 'karina.w@example.com', loginCount: '9회', lastLogin: '2026-08-20', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-15', marketingAgree: false },
  { no: '1926', name: '웬디', tone: 'existing', nickname: '웬디트리', phone: '010-1234-5638', userId: 'wendytree', email: 'wendytree@example.com', loginCount: '76회', lastLogin: '2026-08-25', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-22', marketingAgree: true },
  { no: '1925', name: '크리스탈', tone: 'new', nickname: '수정님', phone: '010-1334-5678', userId: 'crystal_s', email: 'crystal.s@example.com', loginCount: '5회', lastLogin: '2026-08-11', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-10', marketingAgree: false },
  { no: '1924', name: '공유', tone: 'existing', nickname: '도깨비', phone: '010-1134-5678', userId: 'gongyu_g', email: 'gongyu.g@example.com', loginCount: '61회', lastLogin: '2026-08-24', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-19', marketingAgree: true },
  { no: '1923', name: '공명', tone: 'new', nickname: '공블리', phone: '010-1234-5578', userId: 'gongbly', email: 'gongbly@example.com', loginCount: '14회', lastLogin: '2026-08-23', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-23', marketingAgree: true },
  { no: '1922', name: '태민', tone: 'existing', nickname: '카이로스', phone: '010-1236-5678', userId: 'kairos_t', email: 'kairos.t@example.com', loginCount: '203회', lastLogin: '2026-08-05', put: '3건', buy: '23건', amount: '489,000원', joinedAt: '2026-10-09 13:33:20', lastPurchase: '2026-08-05', marketingAgree: false },
];

function LiveRegulars() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState<SendHistoryRow[]>(SEED_SEND_HISTORY);

  const toggleRow = (no: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(no)) next.delete(no); else next.add(no);
      return next;
    });
  };

  const openDiscountModal = () => {
    if (selected.size === 0) { window.alert('할인코드를 발송할 대상을 먼저 선택해 주세요.'); return; }
    setModalOpen(true);
  };

  const handleSent = (template: AlimtalkTemplate) => {
    const now = new Date();
    const sentAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newRows: SendHistoryRow[] = REGULAR_ROWS
      .filter((r) => selected.has(r.no))
      .map((r) => ({
        name: r.name, phone: r.phone, nickname: r.nickname, tone: r.tone,
        userId: r.userId, email: r.email, joinedAt: r.joinedAt, lastLogin: r.lastLogin, loginCount: r.loginCount,
        lastPurchase: r.lastPurchase, marketingAgree: r.marketingAgree, template: template.label, sentAt,
      }));
    setHistory((prev) => [...newRows, ...prev]);
    setSelected(new Set());
  };

  const LinkText = ({ children }: { children: React.ReactNode }) => (
    <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.green} cursor="pointer" whiteSpace="nowrap">{children}</Text>
  );

  return (
    <AdminLayout navActive="LIVE" sidebar={{ items: REGULARS_SIDEBAR_ITEMS }}>
      <Box fontFamily={AFONT} color={colors.gr42} minW="1200px">
        {/* 1. 검색 조건 */}
        <SectionHead title="라이브 단골 검색" />
        <Box data-doc-mark="search" bg="white" border={`1px solid ${colors.grE8}`} borderRadius="12px" p="24px" mb="32px">
          <Flex gap="20px">
            <Box flex="1"><RequiredLabel label="이름" required={false} /><TextInput placeholder="이름 입력" width="100%" /></Box>
            <Box flex="1"><RequiredLabel label="닉네임" required={false} /><TextInput placeholder="닉네임 입력" width="100%" /></Box>
            <Box flex="1"><RequiredLabel label="연락처" required={false} /><TextInput placeholder="연락처 입력" width="100%" /></Box>
          </Flex>
          <Flex justify="center" gap="8px" pt="20px">
            <FilledButton label="초기화" bg={colors.bcSub} />
            <FilledButton label="검색" bg={colors.bcPoint} />
          </Flex>
        </Box>

        {/* 2. 목록 타이틀 */}
        <Flex align="baseline" gap="8px" pb="14px">
          <Text fontFamily={AFONT} fontWeight="700" fontSize="18px" color={colors.gr42} letterSpacing="-0.36px">라이브 단골 리스트</Text>
          <Text fontFamily={AFONT} fontSize="12px" color={colors.gr92}>전체 {REGULAR_ROWS.length}개</Text>
        </Flex>

        {/* 3. 안내 배너 */}
        <Box data-doc-mark="promo" mb="24px">
          <PromoBanner bg="#2A2A2A" h="auto">
            <Flex align="center" gap="24px" py="6px">
              <Flex direction="column" align="flex-start" gap="8px" flexShrink={0}>
                <Flex bg={colors.red} borderRadius="4px" px="6px" py="2px"><Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color="white">LIVE</Text></Flex>
                <Text fontFamily={AFONT} fontWeight="700" fontSize="17px" color="white" lineHeight="1.3">라이브는 실감나게</Text>
                <Flex gap="6px" pt="2px">
                  <FilledButton label="단골 가입 URL 복사" bg={colors.red} />
                  <FilledButton label="바로가기 ›" bg={colors.gr72} />
                </Flex>
              </Flex>
              <Box w="1px" alignSelf="stretch" bg="rgba(255,255,255,0.15)" />
              <Flex direction="column" gap="4px">
                <Text fontFamily={AFONT} fontSize="12px" color="rgba(255,255,255,0.75)">· 라이브 단골 고객에게 할인코드를 발급하고 알림톡으로 발송할 수 있습니다.</Text>
                <Text fontFamily={AFONT} fontSize="12px" color="rgba(255,255,255,0.75)">· 표에서 대상을 선택한 뒤 「할인코드 발송」으로 코드를 발급·발송하세요.</Text>
              </Flex>
            </Flex>
          </PromoBanner>
        </Box>

        {/* 4. 회원 구분 필터 + 정렬 */}
        <Flex data-doc-mark="filter" align="center" pb="14px" gap="10px">
          <FilledButton label="전체" bg={colors.gr42} />
          <OutlineButton label="기존 회원" />
          <OutlineButton label="신규 회원" />
          <HelperText>신규 6 · 기존 5 ⓘ 라이브를 보다가 그 자리에서 가입한 회원을 「신규」로 봅니다.</HelperText>
          <Box flex="1" />
          <SelectBox label="가입순" width="120px" options={['가입순', '이름순']} />
          <SelectBox label="100개씩 보기" width="150px" options={['20개씩 보기', '50개씩 보기', '100개씩 보기']} />
        </Flex>

        {/* 5. 선택 대상 일괄 발송 */}
        <Flex data-doc-mark="actions" align="center" gap="8px" pb="6px" wrap="wrap">
          <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr72}>선택한 대상 {selected.size}명</Text>
          <FilledButton label="알림톡 발송" bg={colors.bcDefault} />
          <OutlineButton label="전체 고객 발송" />
          <FilledButton label="할인코드 발송" bg={colors.red} onClick={openDiscountModal} />
        </Flex>

        {/* 6. 단골 리스트 표 */}
        <Box data-doc-mark="table" pb="4px">
          <DataTable
            columns={[
              { header: ['No'], w: '90px' },
              { header: ['이름'], w: '90px' },
              { header: ['회원 구분'], w: '96px' },
              { header: ['닉네임'], w: '110px' },
              { header: ['연락처'], flex: '1.1' },
              { header: ['총 담은 횟수', '총 구매횟수', '총 구매금액'], flex: '1.4' },
              { header: ['단골 등록일'], w: '190px' },
            ]}
            rows={REGULAR_ROWS.map((r) => [
              <Flex align="center" gap="8px"><LCheck checked={selected.has(r.no)} onChange={() => toggleRow(r.no)} /><Text>{r.no}</Text></Flex>,
              <LinkText>{r.name}</LinkText>,
              <RegularBadge tone={r.tone} />,
              r.nickname,
              <LinkText>{r.phone}</LinkText>,
              <Flex direction="column" gap="2px" align="center"><Text>{r.put}</Text><Text>{r.buy}</Text><Text>{r.amount}</Text></Flex>,
              r.joinedAt,
            ])}
          />
        </Box>

        {/* 7. 페이지 이동 */}
        <Box data-doc-mark="pagination">
          <Pagination />
        </Box>
      </Box>

      {modalOpen && (
        <DiscountCodeModal targetCount={selected.size} history={history} onClose={() => setModalOpen(false)} onSend={handleSent} />
      )}
    </AdminLayout>
  );
}

// ── 할인코드 발송(팝업) — 이 화면 전용 표준 외 조립 소품 ──
// 숫자만 남기는 컨트롤드 입력(원/% 단위 표시용)
function NumField({ value, onChange, unit, placeholder, width = '160px', disabled = false }: {
  value: string; onChange: (v: string) => void; unit: string; placeholder?: string; width?: string; disabled?: boolean;
}) {
  return (
    <Flex align="center" gap="6px" opacity={disabled ? 0.5 : 1} pointerEvents={disabled ? 'none' : 'auto'}>
      <LInput value={value} onChange={(v) => onChange(v.replace(/[^0-9]/g, ''))} placeholder={placeholder} width={width} />
      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">{unit}</Text>
    </Flex>
  );
}
// 메모 — 표준 텍스트영역 컴포넌트 없어 화면 내 임시 조립(디자인시스템 요청 대상)
function MemoInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="메모를 입력하세요"
      rows={3}
      style={{
        width: '100%', maxWidth: '480px', resize: 'vertical', boxSizing: 'border-box',
        border: '1px solid #D7D6D6', borderRadius: '4px', padding: '8px',
        fontFamily: AFONT, fontSize: '12px', color: colors.gr42,
      }}
    />
  );
}
// 카카오 알림톡 도착 카드 — 표준 컴포넌트 없어 화면 내 임시 조립(디자인시스템 요청 대상)
function KakaoGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5C6.98 3.5 3 6.86 3 11c0 2.66 1.7 5 4.28 6.36l-1.02 3.72a.5.5 0 0 0 .75.55l4.2-2.78c.25.02.5.03.79.03 5.02 0 9-3.36 9-7.5S17.02 3.5 12 3.5Z" fill="#3A1D1D" />
    </svg>
  );
}
// 이미지 영역 장식용 아이콘 — 실제 등록 시엔 업로드 이미지로 대체되는 자리 표시
function RibbonGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" style={{ position: 'absolute', right: 8, bottom: 6, opacity: 0.35 }}>
      <path d="M20 4l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L20 22.6l-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2Z" fill="white" />
    </svg>
  );
}
type AlimtalkTemplate = { id: string; type: 'A' | 'B' | 'C'; label: string; title: string; body: string; imageFrom: string; imageTo: string };
const ALIMTALK_TEMPLATES: AlimtalkTemplate[] = [
  {
    id: 'welcome',
    type: 'A',
    label: '할인코드 발급 안내',
    title: '단골고객 안내',
    body: '안녕하세요, 고객님 :)\n라이브 단골 고객님께만 드리는\n특별 할인코드를 보내드려요.\n\n▶ 사용기간 : 발급일로부터 3일\n▶ 사용방법 : 결제 시 코드 입력\n\n지금 바로 확인해보세요!',
    imageFrom: '#7C3AED',
    imageTo: '#DB2777',
  },
  {
    id: 'limited',
    type: 'B',
    label: '한정 할인코드',
    title: '단골고객 안내',
    body: '고객님을 위한\n한정 수량 할인코드가\n도착했습니다.\n\n▶ 대상 : 라이브 단골 고객\n▶ 유효기간 : 발급일로부터 3일\n\n서두르세요, 한정 수량이에요!',
    imageFrom: '#F59E0B',
    imageTo: '#EF4444',
  },
  {
    id: 'thanks',
    type: 'C',
    label: '단골 고객 감사 쿠폰',
    title: '단골고객 안내',
    body: '늘 저희 라이브를\n찾아주시는 고객님께\n감사한 마음을 담았어요.\n\n▶ 전용 할인코드가 발급되었습니다\n▶ 사용기간 : 발급일로부터 3일\n\n소중한 마음, 잊지 않을게요!',
    imageFrom: '#10B981',
    imageTo: '#059669',
  },
];
// 발송내역에서 발송 당시 선택한 템플릿명(라벨)으로 타입(A/B/C)을 역조회
const templateTypeOf = (label: string) => ALIMTALK_TEMPLATES.find((t) => t.label === label)?.type ?? '';
// 발송내역 검색조건 — 알림톡 템플릿 필터 옵션(전체 + 현재 사용 중인 템플릿 타입)
const HISTORY_TEMPLATE_FILTER_OPTIONS = ['전체', ...Array.from(new Set(ALIMTALK_TEMPLATES.map((t) => t.type))).map((t) => `${t}타입`)];
// 발송내역 검색조건 — 처리내역 상태 필터 옵션
const HISTORY_STATUS_FILTER_OPTIONS = ['전체', '발송완료', '실패'];

function AlimtalkCard({ tpl, selected, onSelect }: { tpl: AlimtalkTemplate; selected: boolean; onSelect: () => void }) {
  return (
    <Box as="button" onClick={onSelect} position="relative" w="200px" flexShrink={0} textAlign="left"
      border={`2px solid ${selected ? colors.blue : 'transparent'}`} borderRadius="14px" p="2px" cursor="pointer">
      <Flex position="absolute" top="10px" left="10px" w="16px" h="16px" borderRadius="100px" bg="white"
        border={`1.5px solid ${selected ? colors.blue : colors.grD8}`} align="center" justify="center" zIndex={1}>
        {selected && <Box w="8px" h="8px" borderRadius="100px" bg={colors.blue} />}
      </Flex>
      <Flex position="absolute" top="8px" right="8px" bg={colors.gr42} borderRadius="10px" px="8px" py="3px" zIndex={1}>
        <Text fontFamily={AFONT} fontWeight="800" fontSize="11px" color="white" whiteSpace="nowrap">{tpl.type}타입</Text>
      </Flex>
      <Flex direction="column" align="center" bg={colors.grF8} borderRadius="12px" p="18px 12px 12px">
        <Flex align="center" gap="4px" bg="#FAE100" borderRadius="14px" px="10px" py="4px" mb="12px">
          <KakaoGlyph />
          <Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color="#3A1D1D">알림톡 도착</Text>
        </Flex>
        <Box w="100%" position="relative" bgGradient="to-br" gradientFrom={tpl.imageFrom} gradientTo={tpl.imageTo} borderRadius="10px 10px 0 0" overflow="hidden" p="12px" minH="86px"
          display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="6px">
          <RibbonGlyph />
          {tpl.title.split('\n').map((line, i) => (
            <Text key={`t${i}`} position="relative" fontFamily={AFONT} fontWeight="700" fontSize="13px" color="white" lineHeight="1.5">{line}</Text>
          ))}
        </Box>
        <Box w="100%" bg="#FFFFFF" borderRadius="0 0 10px 10px" p="14px">
          {tpl.body.split('\n').map((line, i) => (
            <Text key={`b${i}`} fontFamily={AFONT} fontSize="11.5px" color={colors.gr42} lineHeight="1.6">{line || ' '}</Text>
          ))}
        </Box>
      </Flex>
    </Box>
  );
}

type SendHistoryRow = {
  name: string; phone: string; nickname: string; tone: 'existing' | 'new';
  userId: string; email: string; joinedAt: string; lastLogin: string; loginCount: string;
  lastPurchase: string; marketingAgree: boolean; template: string; sentAt: string;
};
// 발송내역 탭 검색조건 데모용 과거 발송 샘플(신규 발송은 오늘 날짜로 계속 누적됨)
const SEED_SEND_HISTORY: SendHistoryRow[] = [
  { name: '크리스탈', phone: '010-1334-5678', nickname: '수정님', tone: 'new', userId: 'crystal_s', email: 'crystal.s@example.com', joinedAt: '2026-10-09 13:33:20', lastLogin: '2026-08-11', loginCount: '5회', lastPurchase: '2026-08-10', marketingAgree: false, template: '한정 할인코드', sentAt: '2026-08-20' },
  { name: '태민', phone: '010-1236-5678', nickname: '카이로스', tone: 'existing', userId: 'kairos_t', email: 'kairos.t@example.com', joinedAt: '2026-10-09 13:33:20', lastLogin: '2026-08-05', loginCount: '203회', lastPurchase: '2026-08-05', marketingAgree: false, template: '단골 고객 감사 쿠폰', sentAt: '2026-08-20' },
  { name: '공유', phone: '010-1134-5678', nickname: '도깨비', tone: 'existing', userId: 'gongyu_g', email: 'gongyu.g@example.com', joinedAt: '2026-10-09 13:33:20', lastLogin: '2026-08-24', loginCount: '61회', lastPurchase: '2026-08-19', marketingAgree: true, template: '할인코드 발급 안내', sentAt: '2026-08-24' },
];

// 할인코드 등록 + 알림톡 템플릿 선택 + 발송 팝업 — 「할인코드 발송」/「발송내역」 2개 탭으로 구성
function DiscountCodeModal({ targetCount, history, onClose, onSend }: {
  targetCount: number; history: SendHistoryRow[]; onClose: () => void; onSend: (template: AlimtalkTemplate) => void;
}) {
  const [tab, setTab] = useState<'할인코드 발송' | '발송내역'>('할인코드 발송');
  const [code, setCode] = useState('');
  const [type, setType] = useState<'amount' | 'rate'>('amount');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [env, setEnv] = useState<'all' | 'app' | 'web'>('all');
  const [memo, setMemo] = useState('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [templateError, setTemplateError] = useState(false);

  // 발송내역 — 검색조건(초안 입력값)
  const [historyQDraft, setHistoryQDraft] = useState('');
  const [historyStartDraft, setHistoryStartDraft] = useState('');
  const [historyEndDraft, setHistoryEndDraft] = useState('');
  const [historyTemplateDraft, setHistoryTemplateDraft] = useState('전체');
  const [historyStatusDraft, setHistoryStatusDraft] = useState('전체');
  // 발송내역 — 검색조건(실제 목록에 반영된 값, 「검색」 클릭 시에만 갱신)
  const [historyQ, setHistoryQ] = useState('');
  const [historyStart, setHistoryStart] = useState('');
  const [historyEnd, setHistoryEnd] = useState('');
  const [historyTemplate, setHistoryTemplate] = useState('전체');
  const [historyStatus, setHistoryStatus] = useState('전체');
  const [historyFilterKey, setHistoryFilterKey] = useState(0); // 초기화 시 SelectBox 표시값 리셋용

  const searchHistory = () => {
    setHistoryQ(historyQDraft.trim());
    setHistoryStart(historyStartDraft);
    setHistoryEnd(historyEndDraft);
    setHistoryTemplate(historyTemplateDraft);
    setHistoryStatus(historyStatusDraft);
  };
  const resetHistorySearch = () => {
    setHistoryQDraft(''); setHistoryStartDraft(''); setHistoryEndDraft('');
    setHistoryTemplateDraft('전체'); setHistoryStatusDraft('전체');
    setHistoryQ(''); setHistoryStart(''); setHistoryEnd('');
    setHistoryTemplate('전체'); setHistoryStatus('전체');
    setHistoryFilterKey((k) => k + 1);
  };
  // 기본값(발송일 전체)이라 날짜 조건 없이도 기존 발송 이력이 모두 노출됨. AND 결합.
  const filteredHistory = history.filter((h) => {
    const q = historyQ;
    const matchesQuery = !q || h.name.includes(q) || h.nickname.includes(q) || h.phone.includes(q);
    const matchesStart = !historyStart || h.sentAt >= historyStart;
    const matchesEnd = !historyEnd || h.sentAt <= historyEnd;
    const matchesTemplate = historyTemplate === '전체' || `${templateTypeOf(h.template)}타입` === historyTemplate;
    const matchesStatus = historyStatus === '전체' || historyStatus === '발송완료'; // 현재 이력은 모두 발송완료
    return matchesQuery && matchesStart && matchesEnd && matchesTemplate && matchesStatus;
  });

  const send = () => {
    const noCode = !code.trim();
    const selected = ALIMTALK_TEMPLATES.find((t) => t.id === templateId);
    setCodeError(noCode);
    setTemplateError(!selected);
    if (noCode || !selected) return;
    onSend(selected);
    setTab('발송내역');
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(17,24,39,0.45)" zIndex={1000} display="flex" alignItems="center" justifyContent="center" p="24px" onClick={onClose}>
      <Box bg="white" borderRadius="12px" w="1180px" maxW="96vw" maxH="88vh" overflowY="auto" boxShadow="0 20px 60px rgba(0,0,0,0.3)" onClick={(e) => e.stopPropagation()}>
        <Flex px="24px" py="16px" borderBottom="1px solid #F0F1F3" align="center" justify="space-between">
          <Text fontFamily={AFONT} fontWeight="800" fontSize="17px" color={colors.gr42}>할인코드</Text>
          <Box as="button" onClick={onClose} cursor="pointer"><Text fontSize="18px" color={colors.gr72}>×</Text></Box>
        </Flex>

        <Box px="24px" pt="16px">
          <TabStrip tabs={['할인코드 발송', '발송내역']} active={tab} onChange={(t) => setTab(t as '할인코드 발송' | '발송내역')} />
        </Box>

        <Box px="24px" pt="16px" data-doc-mark="modal-notice">
          <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>
            마케팅 수신을 거부한 회원에게는 할인코드가 자동으로 발송되지 않습니다.
          </Text>
          <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>
            할인코드 수정 및 삭제는 <Text as="span" color={colors.green} textDecoration="underline">[회원 &gt; 할인코드]</Text>에서 가능합니다.
          </Text>
          <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>
            단, 발송·사용된 코드는 수정 및 삭제가 불가능합니다.
          </Text>
          <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.red}>할인코드는 발급일로 부터 3일동안만 유효합니다.</Text>
          <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>
            할인코드 사용내역은 <Text as="span" color={colors.green} textDecoration="underline">[회원&gt;할인코드 사용내역]</Text> 화면에서 확인하실 수 있습니다.
          </Text>
        </Box>

        {tab === '할인코드 발송' ? (
          <Box data-doc-tab="할인코드 발송">
            <Box p="20px 24px 4px" data-doc-mark="modal-form">
              <Section title="할인코드 등록" note>
                <Row label="사용여부">
                  <Flex bg={colors.green} borderRadius="4px" px="10px" py="4px" w="fit-content">
                    <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color="white">ON</Text>
                  </Flex>
                </Row>
                <Row label="할인코드">
                  <LInput value={code} onChange={(v) => setCode(v.replace(/[^0-9A-Za-z가-힣]/g, '').slice(0, 16))} placeholder="영문·숫자·한글로 16자 이내 입력" width="280px" />
                  <HelperText>특수기호·공백 입력 불가 · {code.length}/16자</HelperText>
                  {codeError && <HelperText danger>할인코드를 입력해 주세요.</HelperText>}
                </Row>
                <Row label="할인종류">
                  <Flex align="center" gap="10px" wrap="wrap">
                    <Radio checked={type === 'amount'} label="금액 할인" onClick={() => setType('amount')} />
                    <NumField value={amount} onChange={setAmount} unit="원" placeholder="금액 입력" width="110px" disabled={type !== 'amount'} />
                    <Radio checked={type === 'rate'} label="비율 할인" onClick={() => setType('rate')} />
                    <NumField value={rate} onChange={setRate} unit="%" placeholder="비율을 입력해주세요" width="150px" disabled={type !== 'rate'} />
                    <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">최대 할인 금액</Text>
                    <NumField value={maxAmount} onChange={setMaxAmount} unit="원" placeholder="0" width="100px" disabled={type !== 'rate'} />
                  </Flex>
                  <HelperText>ⓘ 비율 할인은 배송비를 제외한 총 상품 금액 기준입니다.</HelperText>
                </Row>
                <Row label="주문금액 제한" required={false}>
                  <NumField value={minOrder} onChange={setMinOrder} unit="원 이상" placeholder="최소 주문금액" />
                  <HelperText>ⓘ 주문 금액 제한은 배송비를 제외한 총 상품 금액 기준입니다.</HelperText>
                </Row>
                <Row label="사용가능 환경">
                  <Flex align="center" gap="18px">
                    <Radio checked={env === 'all'} label="전체" onClick={() => setEnv('all')} />
                    <Radio checked={env === 'app'} label="APP" onClick={() => setEnv('app')} />
                    <Radio checked={env === 'web'} label="Web(PC/Mobile)" onClick={() => setEnv('web')} />
                  </Flex>
                </Row>
                <Row label="메모" required={false} last>
                  <MemoInput value={memo} onChange={setMemo} />
                </Row>
              </Section>
            </Box>

            <Box px="24px" pt="24px" pb="8px" data-doc-mark="modal-templates">
              <SectionTitle title="알림톡 템플릿 선택" note={false} />
              <Flex gap="14px" wrap="wrap">
                {ALIMTALK_TEMPLATES.map((t) => (
                  <AlimtalkCard key={t.id} tpl={t} selected={templateId === t.id} onSelect={() => { setTemplateId(t.id); setTemplateError(false); }} />
                ))}
              </Flex>
              {templateError && <Box pt="10px"><HelperText danger>발송할 알림톡 템플릿을 선택해 주세요.</HelperText></Box>}
            </Box>

            <Flex data-doc-mark="modal-actions" px="24px" py="16px" borderTop="1px solid #F0F1F3" align="center" justify="space-between" gap="8px">
              <Text fontFamily={AFONT} fontSize="12px" color={colors.gr92}>선택한 대상 {targetCount}명에게 할인코드를 발급·발송합니다.</Text>
              <Flex gap="8px">
                <OutlineButton label="취소" onClick={onClose} />
                <FilledButton label="발송" bg={colors.bcPoint} onClick={send} />
              </Flex>
            </Flex>
          </Box>
        ) : (
          <Box data-doc-tab="발송내역" data-doc-mark="modal-history" p="20px 24px 24px">
            {history.length === 0 ? (
              <Box bg="white" border={`1px dashed ${colors.grD8}`} borderRadius="12px" py="48px" textAlign="center">
                <Text fontFamily={AFONT} fontSize="13px" color={colors.gr92}>발송 내역이 없습니다.</Text>
              </Box>
            ) : (
              <>
                <Box data-doc-mark="history-search" border={`1px solid ${colors.grE8}`} borderRadius="12px" p="18px 20px" mb="16px">
                  <Flex align="flex-end" gap="16px" pb="16px" wrap="wrap">
                    <Box flex="1" minW="220px">
                      <RequiredLabel label="이름 · 닉네임 · 연락처" required={false} />
                      <LInput value={historyQDraft} onChange={setHistoryQDraft} placeholder="이름, 닉네임, 연락처로 검색" width="100%" onEnter={searchHistory} />
                    </Box>
                    <Box>
                      <RequiredLabel label="발송일" required={false} />
                      <Flex align="center" gap="6px">
                        <LInput type="date" value={historyStartDraft} onChange={setHistoryStartDraft} width="150px" />
                        <Text color={colors.gr72}>~</Text>
                        <LInput type="date" value={historyEndDraft} onChange={setHistoryEndDraft} width="150px" />
                      </Flex>
                    </Box>
                    <Box>
                      <RequiredLabel label="알림톡 템플릿" required={false} />
                      <SelectBox key={`tpl-${historyFilterKey}`} label="전체" width="140px" options={HISTORY_TEMPLATE_FILTER_OPTIONS} onSelect={setHistoryTemplateDraft} />
                    </Box>
                    <Box>
                      <RequiredLabel label="처리내역" required={false} />
                      <SelectBox key={`status-${historyFilterKey}`} label="전체" width="120px" options={HISTORY_STATUS_FILTER_OPTIONS} onSelect={setHistoryStatusDraft} />
                    </Box>
                  </Flex>
                  <Flex justify="center" gap="8px">
                    <FilledButton label="초기화" bg={colors.bcSub} onClick={resetHistorySearch} />
                    <FilledButton label="검색" bg={colors.bcPoint} onClick={searchHistory} />
                  </Flex>
                </Box>
                {filteredHistory.length === 0 ? (
                  <Box bg="white" border={`1px dashed ${colors.grD8}`} borderRadius="12px" py="48px" textAlign="center">
                    <Text fontFamily={AFONT} fontSize="13px" color={colors.gr92}>검색 조건에 맞는 발송 내역이 없습니다.</Text>
                  </Box>
                ) : (
                <DataTable
                  columns={[
                    { header: ['이름', '휴대폰번호'], flex: '1.1' },
                    { header: ['닉네임', '회원 구분'], w: '120px' },
                    { header: ['아이디', '이메일'], flex: '1.2' },
                    { header: ['가입일'], w: '150px' },
                    { header: ['최종 로그인 일자', '최근 구매일'], w: '120px' },
                    { header: ['로그인 횟수'], w: '80px' },
                    { header: ['마케팅 수신 동의'], w: '100px' },
                    { header: ['알림톡 템플릿'], w: '120px' },
                    { header: ['처리내역', '발송일'], w: '100px' },
                  ]}
                  rows={filteredHistory.map((h) => [
                    <Flex direction="column" gap="2px" align="center"><Text>{h.name}</Text><Text color={colors.gr92}>{h.phone}</Text></Flex>,
                    <Flex direction="column" gap="4px" align="center"><Text>{h.nickname}</Text><RegularBadge tone={h.tone} /></Flex>,
                    <Flex direction="column" gap="2px" align="center"><Text>{h.userId}</Text><Text color={colors.gr92}>{h.email}</Text></Flex>,
                    h.joinedAt,
                    <Flex direction="column" gap="2px" align="center"><Text>{h.lastLogin}</Text><Text color={colors.gr92}>{h.lastPurchase}</Text></Flex>,
                    h.loginCount,
                    h.marketingAgree ? '동의' : '미동의',
                    <Flex direction="column" gap="2px" align="center"><Text fontFamily={AFONT} fontWeight="700" color={colors.gr42}>{templateTypeOf(h.template)}타입</Text><Text color={colors.gr92}>{h.template}</Text></Flex>,
                    <Flex direction="column" gap="4px" align="center">
                      <Flex bg={colors.green} borderRadius="4px" px="8px" py="3px" w="fit-content"><Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color="white">발송완료</Text></Flex>
                      <Text>{h.sentAt}</Text>
                    </Flex>,
                  ])}
                />
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function DemoScreen() {
  const path = window.location.pathname.replace(/^\/preview\//, '');
  switch (path) {
    case 'live-regulars': return <LiveRegulars />;
    case 'discount-code-send': return <DiscountCodeModal targetCount={3} history={SEED_SEND_HISTORY} onClose={() => {}} onSend={() => {}} />;
    default: return <Screen><Text>알 수 없는 프리뷰: {path}</Text></Screen>;
  }
}
