// 주요 컴포넌트 갤러리 (비공개 · /component/yeony)
// 라이브에서 실제로 쓰는 원자 컴포넌트를 앱 영역별로 카드에 배열해 한눈에 본다.
// 프로토타입 제작 시 재사용 컴포넌트 카탈로그 역할. (docs 사이드바엔 노출하지 않음)
import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { colors, FONT as ADMIN_FONT } from '../styles/tokens';
import { AdminLayout } from '../components/admin/AdminLayout';
import { TopNav } from '../components/admin/TopNav';
import { Sidebar } from '../components/admin/Sidebar';
import { Footer } from '../components/admin/Footer';
import {
  FilledButton, OutlineButton, InputBox, SelectBox, Pagination, ListSearch, RequiredLabel,
} from '../components/admin/parts';
import {
  Section, Row, TextInput, NumberWithUnit, HelperText, Radio, Checkbox, Toggle, Segmented, SelectInput, Lit, RightChevron,
} from '../components/admin/formParts';
import { LInput, LCheck, LPager, LDateModal } from '../components/admin/discountUi';
import { TabStrip, StatusBadge, DataTable } from '../components/admin/atoms';
import { SectionHead, StatCard, StatusPill, PillStatCard, InfoCard, SubBox, LabelValueTable, KVColumns, PromoBanner as DashPromoBanner, AdBanner, NoticeList, Stars } from '../components/admin/dashboardAtoms';
import { asset as adminAsset } from '../styles/tokens';
// 송출앱
import { c as bc } from '../broadapp/theme';
import { Toggle as AppToggle } from '../broadapp/frame';
import { AppHeader, AppButton, Dialog, BottomSheet, InfoSheet, IconButton, GearIcon, LogoutIcon, Chevron } from '../broadapp/components';
import { EyeIcon, BagIcon, HeartIcon, MicIcon, VideoIcon, ChatIcon, BannerIcon, BoxIcon, SwitchIcon, NoticeIcon } from '../broadapp/icons';
// 고객뷰어 · 샵
import { LoginCard } from '../viewer/Live';
import { ShopToast } from '../shop/ShopToast';
import { ShareSheet } from '../shop/ShareSheet';

const CHROME = "'Pretendard', system-ui, sans-serif"; // 갤러리 크롬 폰트(컴포넌트 자체는 자기 폰트 유지)

// ── 상태가 필요한 컴포넌트용 미리보기 래퍼 ──
function RadioDemo() {
  const [v, setV] = useState('공개');
  return (
    <Flex gap="14px">
      {['공개', '비공개'].map((o) => <Radio key={o} checked={v === o} label={o} onClick={() => setV(o)} />)}
    </Flex>
  );
}
function CheckboxDemo() {
  const [on, setOn] = useState(true);
  return <Checkbox checked={on} label="동의합니다" onClick={() => setOn((v) => !v)} />;
}
function ToggleDemo() {
  const [on, setOn] = useState(true);
  return <Toggle on={on} onToggle={() => setOn((v) => !v)} />;
}
function SegmentedDemo() {
  const [v, setV] = useState('공통설정');
  return <Segmented options={['공통설정', '개별설정']} active={v} onChange={setV} />;
}
function LInputDemo() {
  const [v, setV] = useState('');
  return <LInput value={v} onChange={setV} placeholder="입력해 보세요" width="200px" />;
}
function LCheckDemo() {
  const [on, setOn] = useState(false);
  return (
    <Flex align="center" gap="8px">
      <LCheck checked={on} onChange={setOn} />
      <Text fontFamily={CHROME} fontSize="12px" color="#424242">동작 체크박스</Text>
    </Flex>
  );
}
function LPagerDemo() {
  const [p, setP] = useState(1);
  return <LPager page={p} totalPages={8} onPage={setP} />;
}
function SectionDemo() {
  return (
    <Box w="100%">
      <Section title="기본 정보" note>
        <Row label="방송명"><TextInput placeholder="방송명을 입력하세요" width="100%" /></Row>
        <Row label="공개 여부" last><RadioDemo /></Row>
      </Section>
    </Box>
  );
}
function TabStripDemo() {
  const [t, setT] = useState('라이브 상품');
  return <TabStrip tabs={['라이브 상품', '라이브 배너', '세컨찬스', '공지', '주문서']} active={t} onChange={setT} />;
}
// LDateModal은 position:fixed(전체 화면)라 박스에 못 가둠 → 클릭해서 여는 트리거 방식.
function LDateModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FilledButton label="날짜 선택 열기" bg={colors.bcPoint} onClick={() => setOpen(true)} />
      {open && <LDateModal value="2026-07-21 20:00" title="방송 시작일시 선택" onConfirm={() => setOpen(false)} onClose={() => setOpen(false)} />}
    </>
  );
}

// ── 송출앱/고객뷰어 프리뷰 헬퍼 ──
// 다크 배경 박스(송출앱 컴포넌트는 검정 화면 위에 얹힘)
function DarkBox({ children }: { children: React.ReactNode }) {
  return <Flex bg={bc.black} borderRadius="10px" p="16px" align="center" gap="12px" wrap="wrap">{children}</Flex>;
}
// 폰 스크린 — 실제 폭(393)으로 렌더, 높이는 오버레이가 온전히 들어가게 넉넉히(잘림 없음).
// 오버레이(position:absolute inset:0)가 이 박스를 채운다.
function MiniScreen({ children, bg = bc.black }: { children: React.ReactNode; bg?: string }) {
  return (
    <Box position="relative" w="393px" h="640px" bg={bg} borderRadius="28px" overflow="hidden" border="1px solid #E5E7EB" flexShrink={0}>
      {children}
    </Box>
  );
}
function AppToggleDemo() {
  const [on, setOn] = useState(true);
  return <AppToggle on={on} onClick={() => setOn((v) => !v)} />;
}
function BottomSheetDemo() {
  return (
    <BottomSheet title="화질 설정" selectedIdx={0} onSelect={() => {}} onClose={() => {}}
      options={[{ t: '자동', d: '네트워크에 맞춰 조절' }, { t: '고화질', d: '1080p 고정' }, { t: '저화질', d: '데이터 절약' }]} />
  );
}

// ── 갤러리 데이터(어드민 원자) ──
interface CompEntry { name: string; source: string; desc: string; tags: string[]; render: () => React.ReactNode; code: string }
interface AreaGroup { area: string; note?: string; items: CompEntry[] }

const GROUPS: AreaGroup[] = [
  {
    area: '어드민',
    note: 'parts · formParts · discountUi',
    items: [
      { name: 'FilledButton', source: 'admin/parts', desc: '3-레이어 베벨 채움 버튼. bg로 semantic 색 지정(기본/포인트/서브/등록=초록/삭제=빨강)', tags: ['label', 'bg', 'onClick', 'iconLeft/Right'],
        render: () => (<Flex gap="6px" wrap="wrap"><FilledButton label="생성" bg={colors.bcDefault} /><FilledButton label="검색" bg={colors.bcPoint} /><FilledButton label="초기화" bg={colors.bcSub} /><FilledButton label="등록" bg={colors.green} /><FilledButton label="강제종료" bg={colors.red} /></Flex>),
        code: `<FilledButton label="생성" bg={colors.bcDefault} />   {/* 기본 */}\n<FilledButton label="검색" bg={colors.bcPoint} />     {/* 포인트 */}\n<FilledButton label="등록" bg={colors.green} />       {/* 등록 */}\n<FilledButton label="강제종료" bg={colors.red} />     {/* 삭제/경고 */}` },
      { name: 'OutlineButton', source: 'admin/parts', desc: '흰 배경 보조 버튼(행 액션)', tags: ['label', 'onClick'],
        render: () => (<Flex gap="6px"><OutlineButton label="지급" /><OutlineButton label="차감" /></Flex>),
        code: `<OutlineButton label="지급" onClick={handleGrant} />` },
      { name: 'InputBox', source: 'admin/parts', desc: '정적 입력 박스(값/placeholder 표시용)', tags: ['placeholder', 'value', 'width'],
        render: () => (<Flex direction="column" gap="6px"><InputBox placeholder="검색어 입력" width="200px" /><InputBox value="입력된 값" width="200px" /></Flex>),
        code: `<InputBox placeholder="검색어 입력" width="200px" />` },
      { name: 'TextInput', source: 'admin/formParts', desc: '실제 타이핑 입력 필드', tags: ['placeholder', 'defaultValue', 'type', 'width'],
        render: () => <TextInput placeholder="방송명을 입력하세요" width="220px" />,
        code: `<TextInput placeholder="방송명을 입력하세요" width="220px" />` },
      { name: 'NumberWithUnit', source: 'admin/formParts', desc: '숫자 입력 + 접미 단위', tags: ['unit', 'placeholder', 'width'],
        render: () => (<Flex gap="10px"><NumberWithUnit unit="원" placeholder="0" width="120px" /><NumberWithUnit unit="%" placeholder="0" width="80px" /></Flex>),
        code: `<NumberWithUnit unit="원" placeholder="0" width="120px" />` },
      { name: 'LInput', source: 'admin/discountUi', desc: '실동작 입력(제어형 value/onChange)', tags: ['value', 'onChange', 'onEnter'],
        render: () => <LInputDemo />,
        code: `const [v, setV] = useState('');\n<LInput value={v} onChange={setV} placeholder="입력해 보세요" />` },
      { name: 'SelectBox', source: 'admin/parts', desc: '클릭하면 열리는 드롭다운', tags: ['label', 'options', 'onSelect'],
        render: () => <SelectBox label="전체" width="140px" options={['전체', '진행중', '종료', { divider: true }, '취소']} />,
        code: `<SelectBox\n  label="전체"\n  options={['전체', '진행중', '종료', { divider: true }, '취소']}\n  onSelect={(v) => setStatus(v)}\n/>` },
      { name: 'SelectInput', source: 'admin/formParts', desc: '정적 셀렉트(표시용)', tags: ['label', 'width'],
        render: () => <SelectInput label="정렬 기준" width="140px" />,
        code: `<SelectInput label="정렬 기준" width="140px" />` },
      { name: 'Radio', source: 'admin/formParts', desc: '단일 선택 라디오', tags: ['checked', 'label', 'onClick'],
        render: () => <RadioDemo />,
        code: `<Radio checked={v === '공개'} label="공개" onClick={() => setV('공개')} />` },
      { name: 'Checkbox', source: 'admin/formParts', desc: '단일 체크박스(시안 룩)', tags: ['checked', 'label', 'onClick'],
        render: () => <CheckboxDemo />,
        code: `<Checkbox checked={on} label="동의합니다" onClick={() => setOn((v) => !v)} />` },
      { name: 'LCheck', source: 'admin/discountUi', desc: '실동작 체크박스(제어형)', tags: ['checked', 'onChange', 'size'],
        render: () => <LCheckDemo />,
        code: `<LCheck checked={on} onChange={setOn} />` },
      { name: 'Toggle', source: 'admin/formParts', desc: 'OFF/ON 토글 스위치', tags: ['on', 'onToggle'],
        render: () => <ToggleDemo />,
        code: `<Toggle on={on} onToggle={() => setOn((v) => !v)} />` },
      { name: 'Segmented', source: 'admin/formParts', desc: '2택 세그먼트 토글', tags: ['options', 'active', 'onChange'],
        render: () => <SegmentedDemo />,
        code: `<Segmented options={['공통설정', '개별설정']} active={v} onChange={setV} />` },
      { name: 'ListSearch', source: 'admin/parts', desc: '목록 검색(입력+검색/초기화, Enter)', tags: ['onSearch', 'onReset', 'placeholder'],
        render: () => <ListSearch onSearch={() => {}} onReset={() => {}} />,
        code: `<ListSearch onSearch={(q) => filter(q)} onReset={() => reset()} />` },
      { name: 'RequiredLabel', source: 'admin/parts', desc: '필수항목 라벨(체크 아이콘)', tags: ['label', 'required'],
        render: () => (<Flex direction="column" gap="4px"><RequiredLabel label="방송명" /><RequiredLabel label="메모" required={false} /></Flex>),
        code: `<RequiredLabel label="방송명" />\n<RequiredLabel label="메모" required={false} />` },
      { name: 'HelperText', source: 'admin/formParts', desc: '도움말/경고 문구', tags: ['danger'],
        render: () => (<Flex direction="column" gap="4px"><HelperText>기본 안내 문구입니다.</HelperText><HelperText danger>필수값을 입력하세요.</HelperText></Flex>),
        code: `<HelperText>기본 안내 문구입니다.</HelperText>\n<HelperText danger>필수값을 입력하세요.</HelperText>` },
      { name: 'Pagination', source: 'admin/parts', desc: '정적 페이지네이션(표시용)', tags: [],
        render: () => <Pagination />,
        code: `<Pagination />` },
      { name: 'LPager', source: 'admin/discountUi', desc: '실동작 페이지네이션(제어형)', tags: ['page', 'totalPages', 'onPage'],
        render: () => <LPagerDemo />,
        code: `const [p, setP] = useState(1);\n<LPager page={p} totalPages={8} onPage={setP} />` },
      { name: 'Lit', source: 'admin/formParts', desc: '인라인 문구(단위·설명 텍스트)', tags: [],
        render: () => (<Flex align="center" gap="6px"><NumberWithUnit unit="" placeholder="0" width="80px" /><Lit>회까지 발송</Lit></Flex>),
        code: `<Lit>회까지 발송</Lit>` },
      { name: 'RightChevron', source: 'admin/formParts', desc: '버튼 우측 화살표(›) — 흰색', tags: [],
        render: () => (<FilledButton label="다음" bg={colors.bcPoint} iconRight={<RightChevron />} />),
        code: `<FilledButton label="다음" bg={colors.bcPoint} iconRight={<RightChevron />} />` },
      { name: 'TabStrip', source: 'admin/atoms', desc: '탭 스트립(활성=흰 배경 + 초록 글씨). 설정 탭바 패턴', tags: ['tabs', 'active', 'onChange'],
        render: () => <TabStripDemo />,
        code: `const [tab, setTab] = useState('라이브 상품');\n<TabStrip tabs={['라이브 상품', '라이브 배너', ...]} active={tab} onChange={setTab} />` },
      { name: 'StatusBadge', source: 'admin/atoms', desc: '라이브 진행 상태 배지(진행중/대기중/종료)', tags: ['status: live|waiting|ended'],
        render: () => (<Flex gap="28px" align="center"><StatusBadge status="live" /><StatusBadge status="waiting" /><StatusBadge status="ended" /></Flex>),
        code: `<StatusBadge status="live" />     {/* LIVE 빨강 + 진행중 */}\n<StatusBadge status="waiting" />  {/* 대기중 초록 */}\n<StatusBadge status="ended" />` },
      { name: 'DataTable', source: 'admin/atoms', desc: '2줄 헤더 + 행/셀 테이블(방송 목록 패턴)', tags: ['columns', 'rows'],
        render: () => (
          <DataTable
            columns={[{ header: ['라이브', '진행 상태'], w: '110px' }, { header: ['방송명'], w: '160px' }, { header: ['결제금액'], w: '110px' }]}
            rows={[
              [<StatusBadge status="live" />, '여름 특가 라이브', '₩ 9,240,000'],
              [<StatusBadge status="waiting" />, '신상 입고 방송', '₩ 0'],
              [<StatusBadge status="ended" />, '지난 앵콜전', '₩ 3,180,000'],
            ]}
          />
        ),
        code: `<DataTable\n  columns={[{ header: ['라이브', '진행 상태'], w: '110px' }, { header: ['방송명'] }, ...]}\n  rows={[[<StatusBadge status="live" />, '여름 특가 라이브', '₩ 9,240,000'], ...]}\n/>` },
      { name: 'LDateModal', source: 'admin/discountUi', desc: '날짜·시각 선택 모달(달력 + 시:분)', tags: ['value', 'title', 'onConfirm', 'onClose'],
        render: () => <LDateModalDemo />,
        code: `<LDateModal value="2026-07-21 20:00" title="시작일시 선택" onConfirm={setDate} onClose={close} />` },
      { name: 'Section + Row', source: 'admin/formParts', desc: '폼 레이아웃(제목 + 라벨/값 행)', tags: ['title', 'note', 'label', 'required'],
        render: () => <SectionDemo />,
        code: `<Section title="기본 정보">\n  <Row label="방송명"><TextInput /></Row>\n  <Row label="공개 여부" last>{/* ... */}</Row>\n</Section>` },
      // ── 대시보드(홈) 구성 컴포넌트 ──
      { name: 'SectionHead', source: 'admin/dashboardAtoms', desc: '섹션 제목(18px) + 인라인 안내문(ⓘ …) + more=우측 "더보기 ›" 링크', tags: ['title', 'helper', 'more'],
        render: () => (<Box w="100%"><SectionHead title="구매후기" helper="ⓘ 최근 30일 기준 집계" more /></Box>),
        code: `<SectionHead title="구매후기" helper="ⓘ 최근 30일 기준 집계" more />` },
      { name: 'StatCard', source: 'admin/dashboardAtoms', desc: '지표 카드(라벨 + 회색 박스 안 큰 숫자 Arial). danger면 숫자 빨강', tags: ['label', 'value', 'danger'],
        render: () => (<Flex gap="8px"><StatCard label="신규주문" value="1,920" w="130px" /><StatCard label="취소요청" value="17" danger w="130px" /></Flex>),
        code: `<StatCard label="신규주문" value="1,920" />\n<StatCard label="취소요청" value="17" danger />` },
      { name: 'StatusPill', source: 'admin/dashboardAtoms', desc: '상태 알약(진행중 초록/종료 회색/중지 빨강)', tags: ['tone: active|ended|stopped'],
        render: () => (<Flex gap="8px"><StatusPill tone="active">진행중</StatusPill><StatusPill tone="ended">종료</StatusPill><StatusPill tone="stopped">중지</StatusPill></Flex>),
        code: `<StatusPill tone="active">진행중</StatusPill>` },
      { name: 'PillStatCard', source: 'admin/dashboardAtoms', desc: '상태 알약 + 숫자 카드(상태별 건수). InfoCard 안에 넣어 씀', tags: ['tone', 'label', 'value'],
        render: () => (<Flex gap="16px" w="280px"><PillStatCard tone="active" label="진행중" value="8" /><PillStatCard tone="ended" label="종료" value="3" /><PillStatCard tone="stopped" label="중지" value="0" /></Flex>),
        code: `<InfoCard title="캠페인 진행 현황">\n  <Flex gap="16px">\n    <PillStatCard tone="active" label="진행중" value="8" />\n    <PillStatCard tone="ended" label="종료" value="3" />\n  </Flex>\n</InfoCard>` },
      { name: 'SubBox', source: 'admin/dashboardAtoms', desc: '회색 서브 박스(제목? + · 라벨-값 행). 매출 카드 세부 지표', tags: ['title', 'rows', 'tone'],
        render: () => (<Box w="280px"><SubBox rows={[{ label: '· 이번 달 충전', value: '20,000,000c' }, { label: '· 마진 24.89%', value: '5,124,901원', tone: 'green' }]} /></Box>),
        code: `<SubBox rows={[{ label: '· 이번 달 충전', value: '20,000,000c' }, ...]} />` },
      { name: 'KVColumns', source: 'admin/dashboardAtoms', desc: '다중 열 요약표. 열 타입 4종: rows=[라벨,값,danger?] 행 · center=단일 중앙값 · lines=중앙 여러 줄(b=굵게) · nodes=임의 노드 스택(별점 등, 옆 열과 행 정렬)', tags: ['columns', 'rows', 'center', 'lines', 'nodes', 'danger'],
        render: () => (<Box w="100%"><KVColumns columns={[{ header: '회원탈퇴', rows: [['어제', '11', true], ['이번달', '32', true]] }, { header: '총 회원 수', center: '234,902' }, { header: 'SMS', lines: [{ t: '353건', b: true }, { t: '4,589원', b: true }, { t: '(건/13원)' }] }, { header: '별점', nodes: [<Stars key="a" n={5} size={16} />, <Stars key="b" n={3} size={16} />] }, { header: '구매후기 수', lines: [{ t: '2,152', b: true }, { t: '220', b: true }] }]} /></Box>),
        code: `<KVColumns columns={[\n  { header: '회원탈퇴', rows: [['어제', '11', true]] },   // danger=빨강\n  { header: '총 회원 수', center: '234,902' },            // 단일 중앙값\n  { header: 'SMS', lines: [{ t: '353건', b: true }, { t: '(건/13원)' }] }, // 중앙 여러 줄\n  { header: '별점', nodes: [<Stars n={5} size={18} />, <Stars n={3} size={18} />] }, // 임의 노드 스택\n]} />` },
      { name: 'InfoCard', source: 'admin/dashboardAtoms', desc: '카드 컨테이너(제목 + 우측 액션 + 본문)', tags: ['title', 'action', 'children'],
        render: () => (<Box w="280px"><InfoCard title="캐시 현황" action={<Text fontFamily="monospace" fontSize="11px" color="#29BC25">충전하기 ›</Text>}><Text fontSize="18px" fontWeight="700">18,000,000c</Text></InfoCard></Box>),
        code: `<InfoCard title="캐시 현황" action={<Link>충전하기 ›</Link>}>\n  <Text>18,000,000c</Text>\n</InfoCard>` },
      { name: 'LabelValueTable', source: 'admin/dashboardAtoms', desc: '라벨-값 표(헤더 + 행, 값 색상 지정)', tags: ['header', 'rows', 'tone'],
        render: () => (<Box w="240px"><LabelValueTable header="구매 목적 캠페인" rows={[{ label: 'ROAS', value: '500%', tone: 'point' }, { label: '구매 금액', value: '1,000,000원' }]} /></Box>),
        code: `<LabelValueTable header="구매 목적 캠페인" rows={[{ label: 'ROAS', value: '500%', tone: 'point' }, ...]} />` },
      { name: 'AdBanner', source: 'admin/dashboardAtoms', desc: '광고/홍보 이미지 배너(이미지 + 선택 AD 마크). 대시보드 상단 배너 행', tags: ['src', 'ad', 'alt'],
        render: () => (<Flex gap="8px" w="100%"><AdBanner w="200px" src={adminAsset('dashboard/banner-1.png')} /><AdBanner w="200px" src={adminAsset('dashboard/banner-4.png')} ad /></Flex>),
        code: `<AdBanner src={asset('dashboard/banner-4.png')} ad />` },
      { name: 'PromoBanner', source: 'admin/dashboardAtoms', desc: '프로모 배너 카드(컬러 배경 + 문구 + 뱃지). 이미지 없이 텍스트 배너용', tags: ['bg', 'badge', 'h'],
        render: () => (<Flex gap="8px"><DashPromoBanner w="150px" bg="#E23C34"><Text fontFamily="'Nanum Gothic', sans-serif" fontSize="12px" fontWeight="700" color="#fff">오픈 준비 끝!</Text></DashPromoBanner><DashPromoBanner w="150px" bg="#6D3BD1" badge="AD"><Text fontFamily="'Nanum Gothic', sans-serif" fontSize="12px" fontWeight="700" color="#fff">SNS활용패키지</Text></DashPromoBanner></Flex>),
        code: `<PromoBanner bg="#E23C34" badge="AD"><Text>...</Text></PromoBanner>` },
      { name: 'NoticeList', source: 'admin/dashboardAtoms', desc: '공지 목록 — 흰 박스(상하 회색선) 안 [제목 … 날짜] 행. bold=true면 그 줄 제목 굵게(항목 사이 구분선 없음)', tags: ['items', 'bold'],
        render: () => (<Box w="360px"><NoticeList items={[{ title: '9월 정기 업데이트 소식', date: '2024-09-24', bold: true }, { title: '추석 연휴 휴무 안내', date: '2024-09-06' }, { title: '네이버 단축 URL 서비스 정상화 완료', date: '2024-08-01' }]} /></Box>),
        code: `<NoticeList items={[\n  { title: '9월 정기 업데이트', date: '2024-09-24', bold: true },\n  { title: '추석 연휴 휴무 안내', date: '2024-09-06' },\n]} />` },
      { name: 'Stars', source: 'admin/dashboardAtoms', desc: '별점(채운 별 n개, 금색). size로 크기 지정(기본 14px)', tags: ['n', 'size'],
        render: () => (<Flex direction="column" gap="4px"><Stars n={5} size={18} /><Stars n={3} size={18} /><Stars n={1} size={18} /></Flex>),
        code: `<Stars n={5} size={18} />` },
    ],
  },
  {
    area: '송출앱',
    note: 'broadapp/components · frame · icons',
    items: [
      { name: 'AppButton', source: 'broadapp/components', desc: '앱 주요 버튼(red/dark/gray/outlineRed)', tags: ['label', 'tone', 'onClick', 'flex'],
        render: () => (<DarkBox><Box w="150px"><AppButton label="방송 시작" tone="red" /></Box><Box w="120px"><AppButton label="취소" tone="gray" /></Box><Box w="120px"><AppButton label="설정" tone="outlineRed" /></Box></DarkBox>),
        code: `<AppButton label="방송 시작" tone="red" onClick={start} />` },
      { name: 'AppHeader', source: 'broadapp/components', desc: '앱 공통 헤더(뒤로가기 + 로고 + 우측 액션)', tags: ['onBack', 'right', 'divider'],
        render: () => (<Box w="320px"><DarkBox><Box w="100%"><AppHeader right={<IconButton><GearIcon /></IconButton>} /></Box></DarkBox></Box>),
        code: `<AppHeader onBack={goBack} right={<IconButton><GearIcon /></IconButton>} />` },
      { name: 'Toggle', source: 'broadapp/frame', desc: 'ON=빨강/우, OFF=회색/좌 토글', tags: ['on', 'onClick'],
        render: () => (<DarkBox><AppToggleDemo /></DarkBox>),
        code: `const [on, setOn] = useState(false);\n<Toggle on={on} onClick={() => setOn((v) => !v)} />` },
      { name: 'Chevron', source: 'broadapp/components', desc: '방향 화살표(down/right)', tags: ['dir', 'color', 's'],
        render: () => (<DarkBox><Chevron dir="down" color="#fff" /><Chevron dir="right" color="#fff" /></DarkBox>),
        code: `<Chevron dir="right" color="#fff" s={18} />` },
      { name: 'IconButton + 아이콘', source: 'broadapp/icons', desc: '앱 아이콘 세트(터치 버튼으로 감쌈)', tags: ['s', 'color'],
        render: () => (<DarkBox>{[EyeIcon, BagIcon, HeartIcon, MicIcon, VideoIcon, ChatIcon, BannerIcon, BoxIcon, SwitchIcon, NoticeIcon].map((Ic, i) => <Ic key={i} s={22} color="#fff" />)}<GearIcon color="#fff" /><LogoutIcon color="#fff" /></DarkBox>),
        code: `<IconButton onClick={fn}><MicIcon s={22} color="#fff" /></IconButton>` },
      { name: 'Dialog', source: 'broadapp/components', desc: '경고/확인 다이얼로그(모달)', tags: ['warn', 'title', 'body', 'buttons'],
        render: () => (<MiniScreen><Dialog warn title="방송을 종료할까요?" body="종료하면 다시 시작할 수 없습니다." buttons={[{ label: '취소', tone: 'gray' }, { label: '종료', tone: 'red' }]} /></MiniScreen>),
        code: `<Dialog\n  warn\n  title="방송을 종료할까요?"\n  body="종료하면 다시 시작할 수 없습니다."\n  buttons={[\n    { label: '취소', tone: 'gray', onClick: close },\n    { label: '종료', tone: 'red', onClick: end },\n  ]}\n/>` },
      { name: 'BottomSheet', source: 'broadapp/components', desc: '옵션 선택 바텀시트', tags: ['title', 'options', 'selectedIdx', 'onSelect', 'onClose'],
        render: () => (<MiniScreen><BottomSheetDemo /></MiniScreen>),
        code: `<BottomSheet\n  title="화질 설정"\n  options={[{ t: '자동', d: '네트워크에 맞춰 조절' }, ...]}\n  selectedIdx={idx}\n  onSelect={setIdx}\n  onClose={close}\n/>` },
      { name: 'InfoSheet', source: 'broadapp/components', desc: '안내(? 툴팁) 바텀시트', tags: ['title', 'paras', 'onClose'],
        render: () => (<MiniScreen><InfoSheet title="송출이란?" paras={['휴대폰 화면을 실시간으로 내보내는 기능입니다.', '와이파이 환경을 권장합니다.']} onClose={() => {}} /></MiniScreen>),
        code: `<InfoSheet title="송출이란?" paras={['...', '...']} onClose={close} />` },
    ],
  },
  {
    area: '고객뷰어 · 샵',
    note: 'viewer · shop',
    items: [
      { name: 'LoginCard', source: 'viewer/Live', desc: '로그인 유도 카드(네이버·카카오·애플)', tags: ['onLogin', 'onClose', 'oct'],
        render: () => (<MiniScreen bg="#EDEDED"><LoginCard onLogin={() => {}} onClose={() => {}} /></MiniScreen>),
        code: `<LoginCard onLogin={login} onClose={close} />` },
      { name: 'ShopToast', source: 'shop/ShopToast', desc: '하단 토스트(짧은 완료 피드백)', tags: ['text', 'onClose', 'bottom'],
        render: () => (<MiniScreen bg="#F4F5F7"><ShopToast text="장바구니에 담았습니다" onClose={() => {}} /></MiniScreen>),
        code: `<ShopToast text="장바구니에 담았습니다" onClose={close} />` },
      { name: 'ShareSheet', source: 'shop/ShareSheet', desc: '공유 시트(주소 복사·카카오·인스타·QR)', tags: ['url', 'onClose', 'showQr'],
        render: () => (<MiniScreen bg="#EDEDED"><ShareSheet url="https://shop.example.com/hub" onClose={() => {}} showQr /></MiniScreen>),
        code: `<ShareSheet url={hubUrl} onClose={close} showQr />` },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

// 앵커 id — 그룹/컴포넌트로 스크롤
const areaId = (area: string) => `area-${area}`;
const compId = (name: string) => `comp-${name.replace(/[^a-zA-Z0-9가-힣]+/g, '-')}`;
// 그룹 경계를 넘어 이어지는 연속 번호
const numberOf = (gi: number, ii: number) => GROUPS.slice(0, gi).reduce((n, g) => n + g.items.length, 0) + ii + 1;

// 번호 배지
function NumBadge({ n, size = 22 }: { n: number; size?: number }) {
  return (
    <Flex w={`${size}px`} h={`${size}px`} flexShrink={0} align="center" justify="center" borderRadius="50%" bg="#3F3F46">
      <Text fontFamily={CHROME} fontSize="11px" fontWeight="800" color="#fff" lineHeight="1">{n}</Text>
    </Flex>
  );
}

// 코드 스니펫 블록(복사) — HeroUI식. 가로 스크롤 없이 줄바꿈, 복사 버튼은 헤더로 분리.
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => {});
  };
  return (
    <Box bg="#0F1117" borderRadius="9px" overflow="hidden" mt="10px">
      <Flex align="center" px="12px" h="30px" borderBottom="1px solid rgba(255,255,255,0.08)">
        <Text fontFamily="monospace" fontSize="10.5px" fontWeight="700" color="#6B7280">tsx</Text>
        <Box flex="1" />
        <Box as="button" onClick={copy} px="8px" py="3px" borderRadius="6px" bg="rgba(255,255,255,0.08)" cursor="pointer" _hover={{ bg: 'rgba(255,255,255,0.16)' }}>
          <Text fontFamily={CHROME} fontSize="10.5px" fontWeight="700" color={copied ? '#4ADE80' : '#C7CCD4'}>{copied ? '복사됨' : '복사'}</Text>
        </Box>
      </Flex>
      <Box as="pre" p="11px 14px" m="0" overflowX="hidden">
        <Text as="code" fontFamily="monospace" fontSize="11.5px" color="#E6E8EC" lineHeight="1.75" whiteSpace="pre-wrap" wordBreak="break-word" display="block">{code}</Text>
      </Box>
    </Box>
  );
}

// 컴포넌트 한 줄 — 상단 헤더[번호 + 이름 + 소스] · 본문[미리보기 | 설명+코드]
function CompRow({ e, num }: { e: CompEntry; num: number }) {
  return (
    <Box id={compId(e.name)} data-anchor={compId(e.name)} scrollMarginTop="16px"
      border="1px solid #E5E7EB" borderRadius="12px" overflow="hidden" bg="#fff">
      {/* 헤더: 번호 + 이름 + 소스 */}
      <Flex align="center" gap="10px" px="16px" py="11px" borderBottom="1px solid #F0F1F3">
        <NumBadge n={num} />
        <Text fontFamily={CHROME} fontSize="15px" fontWeight="800" color="#111827">{e.name}</Text>
        <Text fontFamily="monospace" fontSize="11px" color="#9CA3AF">{e.source}</Text>
      </Flex>
      {/* 본문 */}
      <Flex align="stretch">
        {/* 왼쪽: 미리보기 */}
        <Flex flex="1" minW="0" bg="#FBFBFC" px="24px" py="22px" align="center" gap="10px" wrap="wrap">
          {e.render()}
        </Flex>
        {/* 오른쪽: 설명 + 코드 */}
        <Box w="460px" flexShrink={0} borderLeft="1px solid #EEF0F3" p="16px 18px">
          <Text fontFamily={CHROME} fontSize="12.5px" color="#4B5563" lineHeight="1.65" pb={e.tags.length ? '10px' : '0'}>{e.desc}</Text>
          {e.tags.length > 0 && (
            <Flex gap="4px" wrap="wrap">
              {e.tags.map((tg) => (
                <Text key={tg} fontFamily="monospace" fontSize="10.5px" color="#6B7280" bg="#F1F1F4" px="6px" py="2px" borderRadius="5px">{tg}</Text>
              ))}
            </Flex>
          )}
          <CodeBlock code={e.code} />
        </Box>
      </Flex>
    </Box>
  );
}

// ── 어드민 기본 레이아웃 문서(표준) ──
// 실제 컴포넌트를 실제 크기로 패널별 렌더 + 규격 표.
function PanelBlock({ id, n, name, source, spec, children, scrollX, frameH }: {
  id?: string; n: number; name: string; source: string; spec: string; children: React.ReactNode; scrollX?: boolean; frameH?: string;
}) {
  return (
    <Box id={id} data-anchor={id} scrollMarginTop="12px" border="1px solid #E5E7EB" borderRadius="12px" overflow="hidden" bg="#fff" mb="16px">
      <Flex align="center" gap="10px" px="16px" py="11px" borderBottom="1px solid #F0F1F3">
        <Flex w="22px" h="22px" flexShrink={0} align="center" justify="center" borderRadius="50%" bg="#3F3F46"><Text fontFamily={CHROME} fontSize="11px" fontWeight="800" color="#fff">{n}</Text></Flex>
        <Text fontFamily={CHROME} fontSize="15px" fontWeight="800" color="#111827">{name}</Text>
        <Text fontFamily="monospace" fontSize="11px" color="#9CA3AF">{source}</Text>
        <Box flex="1" />
        <Text fontFamily="monospace" fontSize="11px" color="#6B7280">{spec}</Text>
      </Flex>
      <Box bg="#F4F5F7" p="16px">
        <Box borderRadius="8px" overflow="hidden" border="1px solid #E5E7EB" bg="#fff" h={frameH} overflowY={frameH ? 'auto' : undefined} overflowX={scrollX ? 'auto' : undefined}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
// 표준 본문 예시 — 제목 → 검색 → 테이블 → 페이지네이션
function SampleAdminBody() {
  return (
    <Box>
      <Flex align="baseline" gap="8px" pb="12px">
        <Text fontFamily={ADMIN_FONT} fontWeight="700" fontSize="18px" color={colors.gr42}>라이브 방송 관리</Text>
        <Text fontFamily={ADMIN_FONT} fontSize="12px" color={colors.gr92}>전체 <Box as="span" fontWeight="700" color={colors.gr42}>16</Box>개</Text>
      </Flex>
      <Box pb="16px"><ListSearch onSearch={() => {}} onReset={() => {}} /></Box>
      <DataTable
        columns={[{ header: ['라이브', '진행 상태'], w: '120px' }, { header: ['방송명'], w: '200px' }, { header: ['결제금액'], w: '130px' }, { header: ['관리'], w: '110px' }]}
        rows={[
          [<StatusBadge status="live" />, '여름 특가 라이브', '₩ 9,240,000', <OutlineButton label="상세보기" />],
          [<StatusBadge status="waiting" />, '신상 입고 방송', '₩ 0', <OutlineButton label="상세보기" />],
          [<StatusBadge status="ended" />, '지난 앵콜전', '₩ 3,180,000', <OutlineButton label="상세보기" />],
        ]}
      />
      <Pagination />
    </Box>
  );
}
function DocTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <Box border="1px solid #E5E7EB" borderRadius="9px" overflow="hidden" mb="20px">
      <Flex bg="#F4F5F7">
        {head.map((h, i) => (
          <Box key={i} flex={i === 0 ? '0 0 150px' : '1'} px="12px" py="8px" borderLeft={i ? '1px solid #EAECEF' : undefined}>
            <Text fontFamily={CHROME} fontSize="11.5px" fontWeight="800" color="#374151">{h}</Text>
          </Box>
        ))}
      </Flex>
      {rows.map((r, ri) => (
        <Flex key={ri} borderTop="1px solid #F0F1F3">
          {r.map((cell, ci) => (
            <Box key={ci} flex={ci === 0 ? '0 0 150px' : '1'} px="12px" py="8px" borderLeft={ci ? '1px solid #F0F1F3' : undefined}>
              <Text fontFamily={ci === 0 ? 'monospace' : CHROME} fontSize="12px" fontWeight={ci === 0 ? '700' : '400'} color={ci === 0 ? '#111827' : '#4B5563'} lineHeight="1.55" whiteSpace="pre-line">{cell}</Text>
            </Box>
          ))}
        </Flex>
      ))}
    </Box>
  );
}
function DocH({ id, children }: { id?: string; children: React.ReactNode }) {
  return <Text id={id} data-anchor={id} scrollMarginTop="12px" fontFamily={CHROME} fontSize="14px" fontWeight="800" color="#111827" pb="10px" pt="6px">{children}</Text>;
}

const LY_SECTIONS: { id: string; label: string }[] = [
  { id: 'ly-all', label: '전체 조합 (AdminLayout)' },
  { id: 'ly-top', label: '① 상단 패널 (TopNav)' },
  { id: 'ly-side', label: '② 좌측 패널 (Sidebar)' },
  { id: 'ly-body', label: '③ 본문 영역' },
  { id: 'ly-footer', label: '④ 푸터 (Footer)' },
  { id: 'ly-spec', label: '영역 규격' },
  { id: 'ly-props', label: 'AdminLayout Props' },
  { id: 'ly-order', label: '본문 표준 구성 순서' },
  { id: 'ly-usage', label: '사용법' },
];

function LayoutDoc() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-anchor]'));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.getAttribute('data-anchor') || '');
      },
      { root, rootMargin: '0px 0px -75% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const goTo = (id: string) => scrollRef.current?.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const usage = `// 홈(대시보드) — 상단 네비 홈 활성 + 홈 › 대시보드 사이드바
<AdminLayout navActive="home" sidebar={{ title: '홈', items: [{ label: '대시보드', active: true }] }}>
  <DashboardBody />
</AdminLayout>

// 목록 화면(예: LIVE) — 해당 메뉴 활성 + 본문 표준 구성
<AdminLayout navActive="LIVE">
  <PageTitle count={16}>라이브 방송 관리</PageTitle>
  <ListSearch onSearch={filter} onReset={reset} />
  <DataTable columns={cols} rows={rows} />
  <Pagination />
</AdminLayout>`;

  return (
    <Flex h="100%" minH="0">
      {/* 좌측 바로가기 목차 */}
      <Box w="240px" flexShrink={0} bg="#fff" borderRight="1px solid #E5E7EB" overflowY="auto" py="16px">
        <Text px="18px" pb="8px" fontSize="13px" fontWeight="800" color="#111827">어드민 레이아웃</Text>
        {LY_SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <Flex as="button" key={s.id} w="100%" align="center" gap="7px" pl="18px" pr="10px" py="6px" textAlign="left"
              onClick={() => goTo(s.id)} cursor="pointer" position="relative" _hover={{ bg: '#F4F5F7' }} bg={on ? '#F1F1F4' : 'transparent'}>
              {on && <Box position="absolute" left="0" top="4px" bottom="4px" w="3px" borderRadius="2px" bg="#3F3F46" />}
              <Text fontSize="12.5px" fontWeight={on ? '700' : '500'} color={on ? '#111827' : '#6B7280'} truncate>{s.label}</Text>
            </Flex>
          );
        })}
      </Box>

      {/* 우측 콘텐츠(스크롤 컨테이너) */}
      <Box ref={scrollRef} flex="1" minW="0" overflowY="auto">
        <Box maxW="1500px" mx="auto" px="28px" py="26px" fontFamily={CHROME}>
          <Flex align="center" gap="8px" pb="2px">
            <Text fontSize="20px" fontWeight="800" color="#111827">어드민 기본 레이아웃</Text>
            <Text fontFamily="monospace" fontSize="12px" color="#9CA3AF">admin/AdminLayout</Text>
            <Text fontSize="10px" fontWeight="800" color="#0369A1" bg="#E0F2FE" px="7px" py="2px" borderRadius="100px">표준</Text>
          </Flex>
          <Text fontSize="13px" color="#4B5563" lineHeight="1.7" pb="18px">
            새 어드민 화면은 <Box as="span" fontWeight="700" color="#111827">반드시 AdminLayout으로 감싼다.</Box> 상단 네비 + 좌측 사이드바 + 본문 + 푸터의 표준 셸이 자동 보장된다. 프로토타입도 이 골격 위에 본문만 채운다.
          </Text>

          {/* 전체 조합 — 홈(대시보드) 컨텍스트 */}
          <PanelBlock id="ly-all" n={0} name="전체 조합 (AdminLayout)" source="admin/AdminLayout" spec="홈(대시보드) · 실제 크기 · 프레임 내부 스크롤" frameH="580px" scrollX>
            <Box minW="1440px">
              <AdminLayout navActive="home" sidebar={{ title: '홈', items: [{ label: '대시보드', active: true }] }}><SampleAdminBody /></AdminLayout>
            </Box>
          </PanelBlock>
          <Text fontSize="11.5px" color="#9CA3AF" pb="22px">↑ 홈 화면 기준 — 상단 네비는 홈 아이콘 활성, 좌측 사이드바는 홈 메뉴. 실제 대시보드: <Box as="button" onClick={() => window.open('/docs/dashboard', '_blank')} fontFamily="monospace" color="#2563EB" textDecoration="underline" cursor="pointer">/docs/dashboard ↗</Box></Text>

          {/* ① 상단 패널 — 홈 활성 */}
          <PanelBlock id="ly-top" n={1} name="상단 패널 (TopNav)" source="admin/TopNav" spec="높이 50px · active='home' → 홈 활성" scrollX>
            <Box minW="1440px"><TopNav active="home" /></Box>
          </PanelBlock>
          {/* ② 좌측 패널 — 홈 메뉴 */}
          <PanelBlock id="ly-side" n={2} name="좌측 패널 (Sidebar)" source="admin/Sidebar" spec="너비 238px · 홈 › 대시보드(활성)" frameH="420px">
            <Sidebar title="홈" items={[{ label: '대시보드', active: true }]} />
          </PanelBlock>
          {/* ③ 본문 영역 */}
          <PanelBlock id="ly-body" n={3} name="본문 영역 (표준 구성)" source="content · px20 pt20 pb40" spec="폭 가변">
            <Box p="20px" minW="820px"><SampleAdminBody /></Box>
          </PanelBlock>
          {/* ④ 푸터 */}
          <PanelBlock id="ly-footer" n={4} name="푸터 (Footer)" source="admin/Footer" spec="높이 100px · 상단 보더 #D8D8D8" scrollX>
            <Box minW="900px"><Footer /></Box>
          </PanelBlock>

          <DocH id="ly-spec">① ~ ④ 영역 규격</DocH>
          <DocTable
            head={['영역', '규격', '비고']}
            rows={[
              ['상단 네비', '높이 50px · sticky top · z-index 100 · 배경 #25282A', '좌측 My Shop 238px · 활성 메뉴 초록(4px 하단선). 홈 화면은 홈 아이콘 활성(active=\'home\')'],
              ['사이드바', '너비 238px · 배경 #25282A', '2뎁스 메뉴 h32/pl20 · 3뎁스 h30/pl36 · 활성 초록 accent(4px)'],
              ['본문', '패딩 좌우 20 · 상 20 · 하 40 · 폭 가변(flex)', '넓은 테이블은 본문 안에서 자체 가로 스크롤'],
              ['푸터', '높이 100px · 상단 보더 #D8D8D8', 'WEEDSOFT 로고 + 고객센터 문구'],
            ]}
          />

          <DocH id="ly-props">AdminLayout Props</DocH>
          <DocTable
            head={['prop', '기본값 · 설명']}
            rows={[
              ['navActive', "'home'(홈 아이콘) | 'LIVE' 등 메뉴 라벨 — 상단 네비 활성"],
              ['sidebar', '{ title, items } — 미지정 시 경로 기반 기본(LIVE) 메뉴'],
              ['contentPx / Pt / Pb', '20px / 20px / 40px — 본문 패딩'],
              ['fullHeight', 'false — true면 푸터·패딩 없이 본문이 뷰포트를 채우고 내부 스크롤(고정 셸 화면용)'],
            ]}
          />

          <DocH id="ly-order">본문 표준 구성 순서</DocH>
          <DocTable
            head={['순서', '요소 · 사용 컴포넌트']}
            rows={[
              ['1', '페이지 제목(18px·bold·#424242) + 전체 건수'],
              ['2', '안내/도움말 문구(12px·#727272) + 우측 [N개씩 보기] 셀렉트'],
              ['3', '검색 영역 — ListSearch / SearchArea'],
              ['4', '테이블 — DataTable(2줄 헤더 회색 + 행/셀)'],
              ['5', '페이지네이션 — Pagination / LPager'],
            ]}
          />

          <DocH id="ly-usage">사용법</DocH>
          <CodeBlock code={usage} />
          <Box h="30px" />
        </Box>
      </Box>
    </Flex>
  );
}

export function ComponentGallery() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string>('');
  const [tab, setTab] = useState<'components' | 'layout'>('components');

  // 스크롤 위치에 따라 활성 컴포넌트 추적(목차 하이라이트)
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-anchor]'));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.getAttribute('data-anchor') || '');
      },
      { root, rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (id: string) => {
    const root = scrollRef.current;
    root?.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Flex direction="column" h="100dvh" bg="#EEF0F3" fontFamily={CHROME}>
      {/* 헤더 */}
      <Flex align="center" gap="10px" px="24px" h="60px" bg="#fff" borderBottom="1px solid #E5E7EB" flexShrink={0} zIndex={5}>
        <Box as="button" onClick={() => { window.location.href = '/docs'; }} display="flex" alignItems="center" gap="4px" px="10px" h="30px" borderRadius="8px" border="1px solid #E5E7EB" cursor="pointer" _hover={{ bg: '#F4F5F7' }} title="문서로 돌아가기">
          <Text fontSize="12.5px" fontWeight="700" color="#6B7280">← CONVERGENCE Docs.</Text>
        </Box>
        <Text fontSize="18px" fontWeight="800" color="#111827">CONVERGENCE 컴포넌트 표준</Text>
        {/* 탭 */}
        <Flex ml="8px" bg="#F1F1F4" borderRadius="9px" p="3px" gap="2px">
          {([['components', '주요 컴포넌트'], ['layout', '어드민 레이아웃']] as const).map(([k, label]) => (
            <Box as="button" key={k} onClick={() => setTab(k)} px="14px" py="6px" borderRadius="7px" cursor="pointer"
              bg={tab === k ? '#fff' : 'transparent'} boxShadow={tab === k ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'}>
              <Text fontSize="12.5px" fontWeight="800" color={tab === k ? '#111827' : '#6B7280'}>{label}</Text>
            </Box>
          ))}
        </Flex>
        <Box flex="1" />
        <Text fontSize="12px" fontWeight="700" color="#9CA3AF">{tab === 'components' ? `${TOTAL}개` : '표준 셸'}</Text>
      </Flex>

      {tab === 'layout' ? (
        <Box flex="1" minH="0"><LayoutDoc /></Box>
      ) : (
      <Flex flex="1" minH="0">
        {/* 좌측 그룹 목차 */}
        <Box w="240px" flexShrink={0} bg="#fff" borderRight="1px solid #E5E7EB" overflowY="auto" py="16px">
          {GROUPS.map((g, gi) => (
            <Box key={g.area} pb="10px">
              <Box as="button" w="100%" textAlign="left" px="18px" py="6px" onClick={() => goTo(areaId(g.area))} cursor="pointer">
                <Text fontSize="13px" fontWeight="800" color="#111827">{g.area} <Box as="span" fontWeight="600" color="#B0B4BB">· {g.items.length}</Box></Text>
              </Box>
              {g.items.map((e, ii) => {
                const on = active === compId(e.name);
                const num = numberOf(gi, ii);
                return (
                  <Flex as="button" key={e.name} w="100%" align="center" gap="7px" pl="16px" pr="10px" py="5px" textAlign="left"
                    onClick={() => goTo(compId(e.name))} cursor="pointer" position="relative" _hover={{ bg: '#F4F5F7' }} bg={on ? '#F1F1F4' : 'transparent'}>
                    {on && <Box position="absolute" left="0" top="4px" bottom="4px" w="3px" borderRadius="2px" bg="#3F3F46" />}
                    <Text fontFamily="monospace" fontSize="10.5px" fontWeight="700" color={on ? '#3F3F46' : '#B0B4BB'} w="16px" flexShrink={0} textAlign="right">{num}</Text>
                    <Text fontSize="12.5px" fontWeight={on ? '700' : '500'} color={on ? '#111827' : '#6B7280'} truncate>{e.name}</Text>
                  </Flex>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* 우측 콘텐츠(스크롤 컨테이너) */}
        <Box ref={scrollRef} flex="1" minW="0" overflowY="auto">
          <Box maxW="1400px" mx="auto" px="28px" py="24px">
            {GROUPS.map((g, gi) => (
              <Box key={g.area} pb="34px">
                <Flex id={areaId(g.area)} scrollMarginTop="12px" align="baseline" gap="10px" pb="14px">
                  <Text fontSize="16px" fontWeight="800" color="#111827">{g.area}</Text>
                  {g.note && <Text fontFamily="monospace" fontSize="12px" color="#9CA3AF">{g.note}</Text>}
                  <Text fontSize="12px" color="#9CA3AF">· {g.items.length}개</Text>
                </Flex>
                <Flex direction="column" gap="12px">
                  {g.items.map((e, ii) => <CompRow key={e.name} e={e} num={numberOf(gi, ii)} />)}
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
      </Flex>
      )}
    </Flex>
  );
}
