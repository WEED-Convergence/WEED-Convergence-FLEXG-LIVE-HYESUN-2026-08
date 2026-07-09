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
import { TabStrip, StatusBadge, DataTable, MiniButton } from '../components/admin/atoms';
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
type DocCategory = 'Foundation' | 'Components' | 'Patterns';
type DocStatus = 'Stable' | 'Draft' | 'Deprecated';
interface PropRow { name: string; type: string; def?: string; required?: boolean; desc: string }
interface VariantBlock { title: string; desc?: string; render: () => React.ReactNode }
interface Guidelines { do?: string[]; dont?: string[]; a11y?: string[]; note?: string[] }
// code=React(.tsx) · html=클래스 기반 마크업 · css=그 클래스 스타일(Figma 토큰 var(--Fg…))
interface CompEntry {
  name: string; source: string; desc: string; tags: string[]; render: () => React.ReactNode; code: string;
  html?: string; css?: string; props?: PropRow[];
  category?: DocCategory;   // 좌측 대분류(기본 Components)
  status?: DocStatus;       // 상태 뱃지(기본 Stable)
  scope?: string;           // 사용 범위 뱃지(예: 공통 · 어드민) — 미지정 시 area
  variants?: VariantBlock[]; // Variants 섹션(상태/색/사이즈별)
  guidelines?: Guidelines;   // Guidelines 섹션
}
interface AreaGroup { area: string; note?: string; items: CompEntry[] }

// ── 문서용 데모 버튼(FilledButton Variants 프리뷰) — semantic/size/state ──
const BTN_TONE: Record<string, string> = {
  default: colors.bcDefault, primary: colors.bcPoint, secondary: colors.bcSub, success: colors.green, danger: colors.red, warning: '#F79009',
};
const BTN_SIZE: Record<string, { fs: string; p: string; r: string }> = {
  sm: { fs: '12px', p: '6px 12px', r: '6px' }, md: { fs: '13px', p: '8px 16px', r: '7px' }, lg: { fs: '15px', p: '11px 22px', r: '8px' },
};
function DocBtn({ children, tone = 'default', size = 'md', disabled, loading }: { children: React.ReactNode; tone?: string; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; loading?: boolean }) {
  const sz = BTN_SIZE[size];
  const off = disabled || loading;
  return (
    <Box as="button" fontFamily={ADMIN_FONT} fontWeight="700" fontSize={sz.fs} lineHeight="1" color="#fff"
      bg={BTN_TONE[tone] ?? BTN_TONE.default} border="0" borderRadius={sz.r} padding={sz.p} display="inline-flex" alignItems="center" gap="6px"
      cursor={off ? 'not-allowed' : 'pointer'} opacity={off ? 0.45 : 1} pointerEvents={off ? 'none' : undefined} transition="filter 0.12s" _hover={off ? undefined : { filter: 'brightness(0.93)' }}>
      {loading && <Box as="span" w="11px" h="11px" borderRadius="50%" border="2px solid rgba(255,255,255,0.45)" style={{ borderTopColor: '#fff', animation: 'cvspin 0.7s linear infinite' }} />}
      {children}
    </Box>
  );
}
// variant 이름 캡션 + 데모
function VLabel({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Flex direction="column" align="center" gap="8px">
      {children}
      <Text fontFamily="monospace" fontSize="12.5px" color="#A1A1AA">{name}</Text>
    </Flex>
  );
}

const GROUPS: AreaGroup[] = [
  {
    area: '어드민',
    note: 'parts · formParts · discountUi',
    items: [
      { name: 'FilledButton', source: 'admin/parts', category: 'Components', status: 'Stable', scope: '공통',
        desc: '사용자 액션을 실행하는 기본 버튼.\nsemantic 색상으로 액션의 성격(기본·강조·성공·위험)을 구분한다.\n화면에서 가장 눈에 띄어야 하는 주 동작에 사용한다.',
        tags: ['label', 'bg', 'onClick', 'iconLeft', 'iconRight', 'disabled', 'loading', 'size'],
        render: () => (<Flex gap="10px" wrap="wrap"><FilledButton label="생성" bg={colors.bcDefault} /><FilledButton label="검색" bg={colors.bcPoint} /><FilledButton label="등록" bg={colors.green} /><FilledButton label="강제종료" bg={colors.red} /></Flex>),
        variants: [
          { title: 'Default actions', desc: '화면 기본 액션', render: () => (<Flex gap="20px" wrap="wrap"><VLabel name="default"><DocBtn tone="default">생성</DocBtn></VLabel><VLabel name="primary"><DocBtn tone="primary">검색</DocBtn></VLabel><VLabel name="secondary"><DocBtn tone="secondary">초기화</DocBtn></VLabel></Flex>) },
          { title: 'Semantic actions', desc: '의미가 있는 액션', render: () => (<Flex gap="20px" wrap="wrap"><VLabel name="success"><DocBtn tone="success">등록</DocBtn></VLabel><VLabel name="success"><DocBtn tone="success">저장</DocBtn></VLabel><VLabel name="danger"><DocBtn tone="danger">강제종료</DocBtn></VLabel><VLabel name="danger"><DocBtn tone="danger">삭제</DocBtn></VLabel><VLabel name="warning"><DocBtn tone="warning">주의</DocBtn></VLabel></Flex>) },
          { title: 'States', desc: 'disabled · loading', render: () => (<Flex gap="20px" wrap="wrap"><VLabel name="default"><DocBtn tone="primary">기본</DocBtn></VLabel><VLabel name="disabled"><DocBtn tone="primary" disabled>비활성</DocBtn></VLabel><VLabel name="loading"><DocBtn tone="primary" loading>저장 중…</DocBtn></VLabel></Flex>) },
          { title: 'Sizes', desc: 'sm · md · lg', render: () => (<Flex gap="20px" align="center" wrap="wrap"><VLabel name="sm"><DocBtn tone="default" size="sm">Small</DocBtn></VLabel><VLabel name="md"><DocBtn tone="default" size="md">Medium</DocBtn></VLabel><VLabel name="lg"><DocBtn tone="default" size="lg">Large</DocBtn></VLabel></Flex>) },
        ],
        props: [
          { name: 'label', type: 'string', required: true, desc: '버튼에 표시되는 텍스트' },
          { name: 'bg', type: 'ButtonSemantic', def: 'default', desc: 'default · primary · secondary · success · danger · warning' },
          { name: 'onClick', type: '() => void', desc: '클릭 이벤트 핸들러' },
          { name: 'iconLeft', type: 'ReactNode', desc: '좌측 아이콘' },
          { name: 'iconRight', type: 'ReactNode', desc: '우측 아이콘' },
          { name: 'disabled', type: 'boolean', def: 'false', desc: '비활성화 상태' },
          { name: 'loading', type: 'boolean', def: 'false', desc: '로딩(처리 중) 상태 — 스피너 + 클릭 방지' },
          { name: 'size', type: `'sm' | 'md' | 'lg'`, def: 'md', desc: '버튼 크기' },
        ],
        guidelines: {
          do: ['화면당 주요 액션 1개만 primary/success로 강조', '삭제·종료 등 되돌리기 어려운 액션은 danger', '레이블은 동사(등록·저장·삭제)로 명확히'],
          dont: ['한 화면에 강조 버튼(primary)을 여러 개 두지 않기', '취소·닫기 같은 보조 액션에 danger 사용 금지', '아이콘만 있는 버튼에 label 생략 금지'],
          a11y: ['키보드 포커스가 보이도록 focus-visible outline 필수', 'disabled 시 aria-disabled + cursor:not-allowed', 'loading 시 aria-busy=true 로 중복 클릭 방지'],
          note: ['색상은 CSS 변수(var(--Fg…))·semantic 클래스로만 지정(하드코딩 금지)', 'HTML/CSS 탭의 .cv-btn 클래스를 그대로 복사해 퍼블리싱(.NET)에 사용'],
        },
        code: `// bg 에 semantic 값 전달\n<FilledButton label="검색" bg="primary" onClick={search} />\n<FilledButton label="등록" bg="success" />\n<FilledButton label="강제종료" bg="danger" />\n<FilledButton label="저장 중…" bg="primary" loading />\n<FilledButton label="다음" bg="primary" size="lg" iconRight={<RightChevron />} />`,
        html: `<button class="cv-btn cv-btn--primary">검색</button>
<button class="cv-btn cv-btn--success">등록</button>
<button class="cv-btn cv-btn--danger">강제종료</button>
<button class="cv-btn cv-btn--secondary">초기화</button>

<!-- 상태 -->
<button class="cv-btn cv-btn--primary" disabled aria-disabled="true">비활성</button>
<button class="cv-btn cv-btn--primary is-loading" aria-busy="true">
  <span class="cv-btn__spinner" aria-hidden="true"></span>저장 중…
</button>

<!-- 크기 -->
<button class="cv-btn cv-btn--default cv-btn--sm">Small</button>
<button class="cv-btn cv-btn--default cv-btn--lg">Large</button>`,
        css: `.cv-btn{
  display:inline-flex;align-items:center;gap:6px;
  font-family:'Nanum Gothic',sans-serif;font-weight:700;font-size:13px;line-height:1;
  color:var(--FgWh);border:0;border-radius:7px;padding:8px 16px;cursor:pointer;
  transition:filter .12s, box-shadow .12s;
}
.cv-btn:hover{filter:brightness(.93);}
.cv-btn:active{filter:brightness(.86);}
.cv-btn:focus-visible{outline:2px solid var(--FgGreenX);outline-offset:2px;}
.cv-btn:disabled,.cv-btn.is-loading{opacity:.45;cursor:not-allowed;filter:none;}

/* semantic — 성공/위험은 토큰, 그 외는 버튼 팔레트 */
.cv-btn--default{background:#7B858D;}
.cv-btn--primary{background:#596269;}
.cv-btn--secondary{background:#8F8F8F;}
.cv-btn--success{background:var(--FgGreenX);}
.cv-btn--danger{background:var(--FgRed);}
.cv-btn--warning{background:#F79009;}

/* sizes */
.cv-btn--sm{font-size:12px;padding:6px 12px;border-radius:6px;}
.cv-btn--lg{font-size:15px;padding:11px 22px;border-radius:8px;}

/* loading spinner */
.cv-btn__spinner{width:11px;height:11px;border-radius:50%;
  border:2px solid rgba(255,255,255,.45);border-top-color:#fff;
  animation:cv-spin .7s linear infinite;}
@keyframes cv-spin{to{transform:rotate(360deg);}}` },
      { name: 'OutlineButton', source: 'admin/parts', desc: '테두리만 있는 보조 버튼.\n주 버튼보다 낮은 위계의 동작이나 표의 행 단위 액션에 사용한다.', tags: ['label', 'onClick'],
        render: () => (<Flex gap="6px"><OutlineButton label="지급" /><OutlineButton label="차감" /></Flex>),
        code: `<OutlineButton label="지급" onClick={handleGrant} />`,
        html: `<button style="font-family:'Nanum Gothic',sans-serif;font-size:12px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:6px 12px;cursor:pointer;">지급</button>` },
      { name: 'InputBox', source: 'admin/parts', desc: '값이나 안내 문구를 보여주는 표시용 입력 상자.\n실제 입력이 필요 없는 읽기 전용 표현에 사용한다.', tags: ['placeholder', 'value', 'width'],
        render: () => (<Flex direction="column" gap="6px"><InputBox placeholder="검색어 입력" width="200px" /><InputBox value="입력된 값" width="200px" /></Flex>),
        code: `<InputBox placeholder="검색어 입력" width="200px" />`,
        html: `<div style="font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGrB8);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:200px;box-sizing:border-box;">검색어 입력</div>` },
      { name: 'TextInput', source: 'admin/formParts', desc: '한 줄 텍스트를 입력받는 기본 입력 필드. 폼의 일반 텍스트 항목에 사용한다.', tags: ['placeholder', 'defaultValue', 'type', 'width'],
        render: () => <TextInput placeholder="방송명을 입력하세요" width="220px" />,
        code: `<TextInput placeholder="방송명을 입력하세요" width="220px" />`,
        html: `<input type="text" placeholder="방송명을 입력하세요" style="font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:220px;box-sizing:border-box;" />` },
      { name: 'NumberWithUnit', source: 'admin/formParts', desc: '숫자를 입력받고 오른쪽에 단위(원·% 등)를 함께 보여주는 입력 필드.\n금액·비율 입력에 사용한다.', tags: ['unit', 'placeholder', 'width'],
        render: () => (<Flex gap="10px"><NumberWithUnit unit="원" placeholder="0" width="120px" /><NumberWithUnit unit="%" placeholder="0" width="80px" /></Flex>),
        code: `<NumberWithUnit unit="원" placeholder="0" width="120px" />`,
        html: `<div style="display:inline-flex;align-items:center;border:1px solid var(--FgGrE8);border-radius:6px;background:var(--FgWh);width:120px;box-sizing:border-box;font-family:'Nanum Gothic',sans-serif;">
  <input type="number" placeholder="0" style="flex:1;min-width:0;border:0;outline:0;padding:8px 10px;font-size:13px;color:var(--FgGr42);background:transparent;text-align:right;" />
  <span style="padding:0 10px;font-size:13px;color:var(--FgGr72);">원</span>
</div>` },
      { name: 'LInput', source: 'admin/discountUi', desc: '입력값을 상태로 관리하는 제어형 텍스트 입력 필드.\n검색어·실시간 검증 등 값 변화를 다뤄야 할 때 사용한다.', tags: ['value', 'onChange', 'onEnter'],
        render: () => <LInputDemo />,
        code: `const [v, setV] = useState('');\n<LInput value={v} onChange={setV} placeholder="입력해 보세요" />`,
        html: `<input type="text" placeholder="입력해 보세요" style="font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:200px;box-sizing:border-box;" />` },
      { name: 'SelectBox', source: 'admin/parts', desc: '여러 선택지 중 하나를 고르는 드롭다운.\n클릭하면 목록이 펼쳐지며, 필터·정렬 기준 선택 등에 사용한다.', tags: ['label', 'options', 'onSelect'],
        render: () => <SelectBox label="전체" width="140px" options={['전체', '진행중', '종료', { divider: true }, '취소']} />,
        code: `<SelectBox\n  label="전체"\n  options={['전체', '진행중', '종료', { divider: true }, '취소']}\n  onSelect={(v) => setStatus(v)}\n/>`,
        html: `<div style="display:inline-flex;align-items:center;justify-content:space-between;gap:8px;font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:140px;box-sizing:border-box;cursor:pointer;">
  <span>전체</span><span style="color:var(--FgGrB8);">▾</span>
</div>
<!-- 클릭 시 아래로 옵션 목록(ul>li) 펼침 -->` },
      { name: 'SelectInput', source: 'admin/formParts', desc: '선택된 값을 보여주는 표시용 셀렉트.\n상호작용 없이 결과만 나타낼 때 사용한다.', tags: ['label', 'width'],
        render: () => <SelectInput label="정렬 기준" width="140px" />,
        code: `<SelectInput label="정렬 기준" width="140px" />`,
        html: `<div style="display:inline-flex;align-items:center;justify-content:space-between;gap:8px;font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:140px;box-sizing:border-box;cursor:pointer;">
  <span>정렬 기준</span><span style="color:var(--FgGrB8);">▾</span>
</div>` },
      { name: 'Radio', source: 'admin/formParts', desc: '여러 선택지 중 하나만 고르는 라디오 버튼.\n서로 배타적인 옵션 선택에 사용한다.', tags: ['checked', 'label', 'onClick'],
        render: () => <RadioDemo />,
        code: `<Radio checked={v === '공개'} label="공개" onClick={() => setV('공개')} />`,
        html: `<label style="display:inline-flex;align-items:center;gap:6px;font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);cursor:pointer;">
  <span style="width:16px;height:16px;border-radius:50%;border:2px solid var(--FgGreenX);display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;">
    <span style="width:8px;height:8px;border-radius:50%;background:var(--FgGreenX);"></span>
  </span>공개
</label>
<!-- 미선택: 테두리 var(--FgGrB8), 안쪽 점 없음 -->` },
      { name: 'Checkbox', source: 'admin/formParts', desc: '켜짐·꺼짐을 선택하는 체크박스.\n약관 동의나 개별 항목의 선택·해제에 사용한다.', tags: ['checked', 'label', 'onClick'],
        render: () => <CheckboxDemo />,
        code: `<Checkbox checked={on} label="동의합니다" onClick={() => setOn((v) => !v)} />`,
        html: `<label style="display:inline-flex;align-items:center;gap:7px;font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);cursor:pointer;">
  <span style="width:16px;height:16px;border-radius:4px;background:var(--FgGreenX);display:inline-flex;align-items:center;justify-content:center;color:var(--FgWh);font-size:11px;">✓</span>동의합니다
</label>
<!-- 미체크: 배경 var(--FgWh), 테두리 1px var(--FgGrB8), 체크표시 없음 -->` },
      { name: 'LCheck', source: 'admin/discountUi', desc: '선택 상태를 상태값으로 관리하는 제어형 체크박스.\n목록 전체 선택·필터 등 상태 연동이 필요할 때 사용한다.', tags: ['checked', 'onChange', 'size'],
        render: () => <LCheckDemo />,
        code: `<LCheck checked={on} onChange={setOn} />`,
        html: `<!-- 실동작 체크박스(제어형) — 마크업은 정적 체크박스와 동일 -->
<span style="width:18px;height:18px;border-radius:4px;background:var(--FgGreenX);display:inline-flex;align-items:center;justify-content:center;color:var(--FgWh);font-size:12px;cursor:pointer;">✓</span>` },
      { name: 'Toggle', source: 'admin/formParts', desc: '설정의 켜짐·꺼짐을 즉시 전환하는 토글 스위치.\n저장 없이 바로 반영되는 on/off 설정에 사용한다.', tags: ['on', 'onToggle'],
        render: () => <ToggleDemo />,
        code: `<Toggle on={on} onToggle={() => setOn((v) => !v)} />`,
        html: `<button style="width:42px;height:24px;border:0;border-radius:999px;background:var(--FgGreenX);position:relative;cursor:pointer;padding:0;">
  <span style="position:absolute;top:2px;left:20px;width:20px;height:20px;border-radius:50%;background:var(--FgWh);"></span>
</button>
<!-- OFF: background var(--FgGrB8), 손잡이 left:2px -->` },
      { name: 'Segmented', source: 'admin/formParts', desc: '나란히 놓인 옵션 중 하나를 고르는 세그먼트 컨트롤.\n공통·개별 설정처럼 소수의 모드를 전환할 때 사용한다.', tags: ['options', 'active', 'onChange'],
        render: () => <SegmentedDemo />,
        code: `<Segmented options={['공통설정', '개별설정']} active={v} onChange={setV} />`,
        html: `<div style="display:inline-flex;background:var(--FgGrF8);border:1px solid var(--FgGrE8);border-radius:8px;padding:3px;font-family:'Nanum Gothic',sans-serif;">
  <button style="border:0;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;color:var(--FgGr42);background:var(--FgWh);cursor:pointer;">공통설정</button>
  <button style="border:0;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:500;color:var(--FgGr92);background:transparent;cursor:pointer;">개별설정</button>
</div>` },
      { name: 'ListSearch', source: 'admin/parts', desc: '목록 상단의 검색 영역.\n검색어 입력과 검색·초기화 실행을 함께 제공한다.', tags: ['onSearch', 'onReset', 'placeholder'],
        render: () => <ListSearch onSearch={() => {}} onReset={() => {}} />,
        code: `<ListSearch onSearch={(q) => filter(q)} onReset={() => reset()} />`,
        html: `<div style="display:inline-flex;align-items:center;gap:8px;font-family:'Nanum Gothic',sans-serif;">
  <input type="text" placeholder="검색어를 입력하세요" style="font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:240px;box-sizing:border-box;" />
  <button style="font-size:13px;font-weight:700;color:var(--FgWh);background:#3F3F46;border:0;border-radius:6px;padding:8px 16px;cursor:pointer;">검색</button>
  <button style="font-size:13px;color:var(--FgGr42);background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 16px;cursor:pointer;">초기화</button>
</div>` },
      { name: 'RequiredLabel', source: 'admin/parts', desc: '폼 항목의 이름 라벨.\n필수 여부를 아이콘으로 함께 표시한다.', tags: ['label', 'required'],
        render: () => (<Flex direction="column" gap="4px"><RequiredLabel label="방송명" /><RequiredLabel label="메모" required={false} /></Flex>),
        code: `<RequiredLabel label="방송명" />\n<RequiredLabel label="메모" required={false} />`,
        html: `<div style="display:flex;align-items:center;gap:4px;font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr42);">
  <span style="color:var(--FgGreenX);">✓</span>방송명
</div>
<!-- required={false}(필수 아님): 앞 체크 아이콘 없음 -->` },
      { name: 'HelperText', source: 'admin/formParts', desc: '입력 아래 배치하는 보조 설명.\n일반 안내와 오류 경고 두 가지 톤을 가진다.', tags: ['danger'],
        render: () => (<Flex direction="column" gap="4px"><HelperText>기본 안내 문구입니다.</HelperText><HelperText danger>필수값을 입력하세요.</HelperText></Flex>),
        code: `<HelperText>기본 안내 문구입니다.</HelperText>\n<HelperText danger>필수값을 입력하세요.</HelperText>`,
        html: `<p style="margin:0;font-family:'Nanum Gothic',sans-serif;font-size:12px;color:var(--FgGr72);">기본 안내 문구입니다.</p>
<p style="margin:0;font-family:'Nanum Gothic',sans-serif;font-size:12px;color:var(--FgRed);">필수값을 입력하세요.</p>` },
      { name: 'Pagination', source: 'admin/parts', desc: '여러 페이지로 나뉜 목록을 이동하는 페이지네이션(표시용).', tags: [],
        render: () => <Pagination />,
        code: `<Pagination />`,
        html: `<div style="display:inline-flex;align-items:center;gap:4px;font-family:'Nanum Gothic',sans-serif;font-size:13px;">
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr72);border-radius:6px;cursor:pointer;">‹</button>
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGreenX);background:var(--FgGreenX);color:var(--FgWh);border-radius:6px;font-weight:700;cursor:pointer;">1</button>
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr72);border-radius:6px;cursor:pointer;">2</button>
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr72);border-radius:6px;cursor:pointer;">3</button>
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr72);border-radius:6px;cursor:pointer;">›</button>
</div>` },
      { name: 'LPager', source: 'admin/discountUi', desc: '현재 페이지를 상태로 제어하는 실동작 페이지네이션.\n실제 목록 이동과 연동해 사용한다.', tags: ['page', 'totalPages', 'onPage'],
        render: () => <LPagerDemo />,
        code: `const [p, setP] = useState(1);\n<LPager page={p} totalPages={8} onPage={setP} />`,
        html: `<!-- 실동작 페이지네이션(제어형) — 마크업은 정적 Pagination과 동일. 현재 페이지 배경 var(--FgGreenX) -->
<div style="display:inline-flex;align-items:center;gap:4px;font-family:'Nanum Gothic',sans-serif;font-size:13px;">
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGreenX);background:var(--FgGreenX);color:var(--FgWh);border-radius:6px;font-weight:700;cursor:pointer;">1</button>
  <button style="min-width:30px;height:30px;border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr72);border-radius:6px;cursor:pointer;">2</button>
</div>` },
      { name: 'Lit', source: 'admin/formParts', desc: '입력 옆에 붙이는 인라인 텍스트.\n단위나 짧은 설명을 덧붙일 때 사용한다.', tags: [],
        render: () => (<Flex align="center" gap="6px"><NumberWithUnit unit="" placeholder="0" width="80px" /><Lit>회까지 발송</Lit></Flex>),
        code: `<Lit>회까지 발송</Lit>`,
        html: `<span style="font-family:'Nanum Gothic',sans-serif;font-size:13px;color:var(--FgGr72);">회까지 발송</span>` },
      { name: 'RightChevron', source: 'admin/formParts', desc: '버튼 오른쪽에 놓아 다음 단계·진행 방향을 나타내는 화살표 아이콘.', tags: [],
        render: () => (<FilledButton label="다음" bg={colors.bcPoint} iconRight={<RightChevron />} />),
        code: `<FilledButton label="다음" bg={colors.bcPoint} iconRight={<RightChevron />} />`,
        html: `<!-- 버튼 우측 화살표(흰색) -->
<button style="display:inline-flex;align-items:center;gap:6px;font-family:'Nanum Gothic',sans-serif;font-weight:700;font-size:13px;color:var(--FgWh);background:#3F3F46;border:0;border-radius:6px;padding:8px 16px;cursor:pointer;">
  다음 <span style="font-size:14px;">›</span>
</button>` },
      { name: 'TabStrip', source: 'admin/atoms', desc: '같은 영역에서 여러 화면을 전환하는 탭.\n설정·목록의 하위 분류를 오갈 때 사용한다.', tags: ['tabs', 'active', 'onChange'],
        render: () => <TabStripDemo />,
        code: `const [tab, setTab] = useState('라이브 상품');\n<TabStrip tabs={['라이브 상품', '라이브 배너', ...]} active={tab} onChange={setTab} />`,
        html: `<div style="display:inline-flex;background:var(--FgGrF8);border-radius:8px;padding:3px;gap:2px;font-family:'Nanum Gothic',sans-serif;">
  <button style="border:0;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:700;color:var(--FgGreenX);background:var(--FgWh);cursor:pointer;">라이브 상품</button>
  <button style="border:0;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:500;color:var(--FgGr72);background:transparent;cursor:pointer;">라이브 배너</button>
  <button style="border:0;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:500;color:var(--FgGr72);background:transparent;cursor:pointer;">세컨찬스</button>
</div>` },
      { name: 'StatusBadge', source: 'admin/atoms', desc: '라이브 방송의 진행 상태(진행중·대기중·종료)를 한눈에 보여주는 상태 배지.', tags: ['status: live|waiting|ended'],
        render: () => (<Flex gap="28px" align="center"><StatusBadge status="live" /><StatusBadge status="waiting" /><StatusBadge status="ended" /></Flex>),
        code: `<StatusBadge status="live" />     {/* LIVE 빨강 + 진행중 */}\n<StatusBadge status="waiting" />  {/* 대기중 초록 */}\n<StatusBadge status="ended" />`,
        html: `<span style="display:inline-flex;align-items:center;gap:6px;font-family:'Nanum Gothic',sans-serif;">
  <span style="font-weight:700;font-size:11px;color:var(--FgWh);background:var(--FgRed);border-radius:3px;padding:1px 5px;">LIVE</span>
  <span style="font-weight:700;font-size:12px;color:var(--FgRed);">진행중</span>
</span>
<!-- 대기중: <span style="font-weight:700;font-size:12px;color:var(--FgGreenX);">대기중</span> -->
<!-- 종료:   <span style="font-weight:700;font-size:12px;color:var(--FgGr92);">종료</span> -->` },
      { name: 'DataTable', source: 'admin/atoms', category: 'Components', status: 'Stable', scope: '공통',
        desc: '데이터를 행과 열로 정렬해 보여주는 표.\n셀에는 단순 값뿐 아니라 여러 줄 텍스트·상태 배지·액션 버튼을 함께 배치할 수 있다.\n결제 내역·목록 등 복합 데이터를 다룰 때 사용한다.',
        tags: ['columns', 'rows'],
        render: () => (
          <DataTable
            columns={[
              { header: ['이용기간'], w: '104px' }, { header: ['결제 여부'], w: '90px' }, { header: ['유지보수'], w: '100px' },
              { header: ['트래픽'], w: '116px' }, { header: ['SMS'], w: '122px' }, { header: ['LMS'], w: '122px' },
              { header: ['알림톡'], w: '100px' }, { header: ['배송추적'], w: '100px' }, { header: ['조정금액'], w: '86px' },
              { header: ['부가세'], w: '96px' }, { header: ['총 결제금액'], w: '104px' }, { header: ['결제수단', '결제일'], w: '150px' }, { header: ['영수증'], w: '104px' },
            ]}
            rows={[
              ['2025-06', '결제완료', '300,000원',
                <><Box>2,509GB<br />138,024원</Box><MiniButton label="트래픽 내역" /></>,
                <><Box>474건<br />5,214원</Box><MiniButton label="SMS발송 내역" /></>,
                <><Box>547건<br />17,504원</Box><MiniButton label="LMS발송 내역" /></>,
                <Box>50,716건<br />405,728원</Box>, <Box>16,018건<br />192,216원</Box>, '0원', '105,869원',
                <Text as="span" fontWeight="800">1,164,555원</Text>, <Box>가상계좌<br />2025-07-14 11:20:03</Box>, <MiniButton label="영수증 출력" />],
              ['2025-05', '결제완료', '300,000원',
                <><Box>2,509GB<br />138,024원</Box><MiniButton label="트래픽 내역" /></>,
                <><Box>474건<br />5,214원</Box><MiniButton label="SMS발송 내역" /></>,
                <><Box>547건<br />17,504원</Box><MiniButton label="LMS발송 내역" /></>,
                <Box>50,716건<br />405,728원</Box>, <Box>16,018건<br />192,216원</Box>, '0원', '105,869원',
                <Text as="span" fontWeight="800">1,164,555원</Text>, <Box>신용카드<br />120020******6546<br />2024-11-07 11:44:44</Box>, <MiniButton label="영수증 출력" />],
            ]}
          />
        ),
        props: [
          { name: 'columns', type: 'TableColumn[]', required: true, desc: 'header: string[](다중 라인) · flex? · w?(고정 폭)' },
          { name: 'rows', type: 'ReactNode[][]', required: true, desc: '행별 셀 배열 — 문자열 · 다중 라인 · <MiniButton> · 굵은 값 등' },
        ],
        code: `<DataTable\n  columns={[\n    { header: ['이용기간'], w: '104px' },\n    { header: ['트래픽'], w: '116px' },\n    { header: ['총 결제금액'], w: '104px' },\n    { header: ['영수증'], w: '104px' },\n  ]}\n  rows={[\n    ['2025-06',\n      <><Box>2,509GB<br />138,024원</Box><MiniButton label="트래픽 내역" /></>,\n      <b>1,164,555원</b>,\n      <MiniButton label="영수증 출력" onClick={openReceipt} />],\n  ]}\n/>`,
        html: `<div class="cv-table">
  <div class="cv-table__row cv-table__row--head">
    <div class="cv-table__th">이용기간</div>
    <div class="cv-table__th">트래픽</div>
    <div class="cv-table__th">총 결제금액</div>
    <div class="cv-table__th">영수증</div>
  </div>
  <div class="cv-table__row">
    <div class="cv-table__td">2025-06</div>
    <div class="cv-table__td">
      2,509GB<br />138,024원
      <button class="cv-minibtn">트래픽 내역 ›</button>
    </div>
    <div class="cv-table__td"><b>1,164,555원</b></div>
    <div class="cv-table__td"><button class="cv-minibtn">영수증 출력 ›</button></div>
  </div>
</div>`,
        css: `.cv-table{width:max-content;max-width:100%;overflow-x:auto;font-family:'Nanum Gothic',sans-serif;}
.cv-table__row{display:flex;gap:1px;background:var(--FgGrE8);}
.cv-table__row--head{border-top:1px solid #ddd;border-bottom:1px solid #ddd;padding:1px 0;}
.cv-table__row:not(.cv-table__row--head){padding-bottom:1px;}
.cv-table__th{flex:1;min-width:100px;background:var(--FgGrF8);padding:8px;
  display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:12px;letter-spacing:-.24px;color:var(--FgGr72);text-align:center;}
.cv-table__td{flex:1;min-width:100px;background:#fff;padding:12px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  font-size:12px;letter-spacing:-.24px;color:var(--FgGr72);text-align:center;line-height:1.4;}
.cv-table__td b{font-weight:800;}
.cv-minibtn{display:inline-flex;align-items:center;gap:4px;background:#fff;
  border:1px solid #C8C8C8;border-radius:4px;padding:3px 6px 4px;
  font-size:12px;color:var(--FgGr72);cursor:pointer;white-space:nowrap;}
.cv-minibtn:hover{background:var(--FgGrF8);}` },
      { name: 'MiniButton', source: 'admin/atoms', category: 'Components', status: 'Stable', scope: '공통',
        desc: '표 셀 안에서 상세 보기·내역 열람·출력 같은 보조 동작을 실행하는 작은 링크형 버튼.',
        tags: ['label', 'onClick'],
        render: () => (<Flex gap="10px"><MiniButton label="트래픽 내역" /><MiniButton label="SMS발송 내역" /><MiniButton label="영수증 출력" /></Flex>),
        props: [
          { name: 'label', type: 'string', required: true, desc: '버튼 텍스트' },
          { name: 'onClick', type: '() => void', desc: '클릭 이벤트 핸들러' },
        ],
        code: `<MiniButton label="영수증 출력" onClick={openReceipt} />`,
        html: `<button class="cv-minibtn">영수증 출력 ›</button>`,
        css: `.cv-minibtn{display:inline-flex;align-items:center;gap:4px;background:#fff;
  border:1px solid #C8C8C8;border-radius:4px;padding:3px 6px 4px;
  font-family:'Nanum Gothic',sans-serif;font-size:12px;color:var(--FgGr72);cursor:pointer;white-space:nowrap;}
.cv-minibtn:hover{background:var(--FgGrF8);}` },
      { name: 'LDateModal', source: 'admin/discountUi', desc: '날짜와 시각을 함께 고르는 선택 모달.\n방송 시작 일시 등 정확한 시점을 지정할 때 사용한다.', tags: ['value', 'title', 'onConfirm', 'onClose'],
        render: () => <LDateModalDemo />,
        code: `<LDateModal value="2026-07-21 20:00" title="시작일시 선택" onConfirm={setDate} onClose={close} />`,
        html: `<!-- 화면 전체 오버레이 위 달력 모달(구조 요약) -->
<div style="position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
  <div style="background:var(--FgWh);border-radius:12px;padding:20px;width:320px;font-family:'Nanum Gothic',sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
    <div style="font-weight:700;font-size:15px;color:var(--FgGr42);padding-bottom:12px;">방송 시작일시 선택</div>
    <div style="border:1px solid var(--FgGrE8);border-radius:8px;padding:12px;color:var(--FgGr72);font-size:12px;">[달력 그리드 + 시:분 선택]</div>
    <div style="display:flex;justify-content:flex-end;gap:8px;padding-top:14px;">
      <button style="border:1px solid var(--FgGrE8);background:var(--FgWh);color:var(--FgGr42);border-radius:6px;padding:8px 16px;font-size:13px;cursor:pointer;">취소</button>
      <button style="border:0;background:var(--FgGreenX);color:var(--FgWh);border-radius:6px;padding:8px 16px;font-weight:700;font-size:13px;cursor:pointer;">확인</button>
    </div>
  </div>
</div>` },
      { name: 'Section + Row', source: 'admin/formParts', desc: '폼 레이아웃(제목 + 라벨/값 행)', tags: ['title', 'note', 'label', 'required'],
        render: () => <SectionDemo />,
        code: `<Section title="기본 정보">\n  <Row label="방송명"><TextInput /></Row>\n  <Row label="공개 여부" last>{/* ... */}</Row>\n</Section>`,
        html: `<section style="font-family:'Nanum Gothic',sans-serif;">
  <h3 style="font-weight:700;font-size:15px;color:var(--FgGr42);padding-bottom:10px;margin:0;">기본 정보</h3>
  <div style="display:flex;align-items:center;border-top:1px solid var(--FgGrE8);padding:12px 0;">
    <div style="width:140px;font-size:13px;color:var(--FgGr72);">방송명</div>
    <div style="flex:1;"><input type="text" placeholder="방송명을 입력하세요" style="font-size:13px;color:var(--FgGr42);border:1px solid var(--FgGrE8);border-radius:6px;padding:8px 12px;width:100%;box-sizing:border-box;" /></div>
  </div>
  <div style="display:flex;align-items:center;border-top:1px solid var(--FgGrE8);border-bottom:1px solid var(--FgGrE8);padding:12px 0;">
    <div style="width:140px;font-size:13px;color:var(--FgGr72);">공개 여부</div>
    <div style="flex:1;font-size:13px;color:var(--FgGr42);">[공개 / 비공개 라디오]</div>
  </div>
</section>` },
      // ── 대시보드(홈) 구성 컴포넌트 ──
      { name: 'SectionHead', source: 'admin/dashboardAtoms', desc: '대시보드 섹션의 제목 영역.\n안내 문구와 "더보기" 링크를 함께 배치할 수 있다.', tags: ['title', 'helper', 'more'],
        render: () => (<Box w="100%"><SectionHead title="구매후기" helper="ⓘ 최근 30일 기준 집계" more /></Box>),
        code: `<SectionHead title="구매후기" helper="ⓘ 최근 30일 기준 집계" more />`,
        html: `<div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;font-family:'Nanum Gothic',sans-serif;">
  <span style="font-weight:700;font-size:18px;color:var(--FgGr42);letter-spacing:-0.36px;">구매후기</span>
  <span style="font-size:12px;color:var(--FgGr92);">ⓘ 최근 30일 기준 집계</span>
  <span style="flex:1;"></span>
  <button style="font-size:12px;color:var(--FgGr92);background:none;border:0;cursor:pointer;">더보기 ›</button>
</div>` },
      { name: 'StatCard', source: 'admin/dashboardAtoms', desc: '핵심 지표 하나를 라벨과 큰 숫자로 강조하는 카드.\n감소·주의가 필요한 지표는 색으로 구분한다.', tags: ['label', 'value', 'danger'],
        render: () => (<Flex gap="8px"><StatCard label="신규주문" value="1,920" w="130px" /><StatCard label="취소요청" value="17" danger w="130px" /></Flex>),
        code: `<StatCard label="신규주문" value="1,920" />\n<StatCard label="취소요청" value="17" danger />`,
        html: `<div class="cv-statcard">
  <div class="cv-statcard__label">신규주문</div>
  <div class="cv-statcard__box"><span class="cv-statcard__value">1,920</span></div>
</div>

<!-- 감소 지표(취소·반품 등): 카드에 cv-statcard--danger 추가 → 숫자 빨강 -->
<div class="cv-statcard cv-statcard--danger">
  <div class="cv-statcard__label">취소요청</div>
  <div class="cv-statcard__box"><span class="cv-statcard__value">17</span></div>
</div>`,
        css: `.cv-statcard{background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:16px;padding:16px;width:130px;box-sizing:border-box;font-family:'Nanum Gothic',sans-serif;}
.cv-statcard__label{padding-bottom:12px;font-weight:700;font-size:12px;letter-spacing:-0.24px;color:var(--FgGr72);text-align:center;}
.cv-statcard__box{background:var(--FgGrF8);border-radius:12px;padding:17px 0;text-align:center;}
.cv-statcard__value{font-family:Arial,sans-serif;font-weight:700;font-size:20px;letter-spacing:-0.4px;color:var(--FgGr42);}
.cv-statcard--danger .cv-statcard__value{color:var(--FgRed);}` },
      { name: 'StatusPill', source: 'admin/dashboardAtoms', desc: '상태를 색으로 구분해 나타내는 알약형 배지.\n진행중·종료·중지 등 항목의 현재 상태 표시에 사용한다.', tags: ['tone: active|ended|stopped'],
        render: () => (<Flex gap="8px"><StatusPill tone="active">진행중</StatusPill><StatusPill tone="ended">종료</StatusPill><StatusPill tone="stopped">중지</StatusPill></Flex>),
        code: `<StatusPill tone="active">진행중</StatusPill>`,
        html: `<span style="display:inline-flex;align-items:center;justify-content:center;background:var(--FgGreenX);border-radius:24px;padding:4px 10px;font-family:'Nanum Gothic',sans-serif;font-weight:700;font-size:12px;color:var(--FgWh);">진행중</span>
<!-- 종료: background:var(--FgGrB8) · 중지: background:var(--FgRed) -->` },
      { name: 'PillStatCard', source: 'admin/dashboardAtoms', desc: '상태 배지와 건수를 묶어 보여주는 카드.\n진행중·종료처럼 상태별 수량을 나란히 표시할 때 사용한다.', tags: ['tone', 'label', 'value'],
        render: () => (<Flex gap="16px" w="280px"><PillStatCard tone="active" label="진행중" value="8" /><PillStatCard tone="ended" label="종료" value="3" /><PillStatCard tone="stopped" label="중지" value="0" /></Flex>),
        code: `<InfoCard title="캠페인 진행 현황">\n  <Flex gap="16px">\n    <PillStatCard tone="active" label="진행중" value="8" />\n    <PillStatCard tone="ended" label="종료" value="3" />\n  </Flex>\n</InfoCard>`,
        html: `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:88px;font-family:'Nanum Gothic',sans-serif;">
  <span style="background:var(--FgGreenX);border-radius:24px;padding:4px 10px;font-weight:700;font-size:12px;color:var(--FgWh);">진행중</span>
  <div style="width:100%;min-height:52px;background:var(--FgGrF8);border-radius:12px;display:flex;align-items:center;justify-content:center;">
    <span style="font-family:Arial,sans-serif;font-weight:700;font-size:20px;color:var(--FgGr42);">8</span>
  </div>
</div>
<!-- 종료: 알약 background var(--FgGrB8) · 중지: var(--FgRed) -->` },
      { name: 'SubBox', source: 'admin/dashboardAtoms', desc: '카드 안에서 세부 지표를 묶는 보조 박스.\n라벨과 값을 행으로 나열한다.', tags: ['title', 'rows', 'tone'],
        render: () => (<Box w="280px"><SubBox rows={[{ label: '· 이번 달 충전', value: '20,000,000c' }, { label: '· 마진 24.89%', value: '5,124,901원', tone: 'green' }]} /></Box>),
        code: `<SubBox rows={[{ label: '· 이번 달 충전', value: '20,000,000c' }, ...]} />`,
        html: `<div style="background:var(--FgGrF8);border-radius:10px;padding:14px;width:280px;font-family:'Nanum Gothic',sans-serif;">
  <div style="display:flex;justify-content:space-between;gap:8px;padding-bottom:6px;">
    <span style="font-size:12px;color:var(--FgGr72);">· 이번 달 충전</span>
    <span style="font-weight:700;font-size:14px;color:var(--FgGr92);">20,000,000c</span>
  </div>
  <div style="display:flex;justify-content:space-between;gap:8px;">
    <span style="font-size:12px;color:var(--FgGr72);">· 마진 24.89%</span>
    <span style="font-weight:700;font-size:14px;color:var(--FgGreenX);">5,124,901원</span>
  </div>
</div>` },
      { name: 'KVColumns', source: 'admin/dashboardAtoms', desc: '여러 지표를 열로 나누어 요약하는 표.\n열마다 라벨·값 행, 단일 중앙값, 여러 줄 값, 별점 같은 노드 등 형식을 다르게 지정한다.', tags: ['columns', 'rows', 'center', 'lines', 'nodes', 'danger'],
        render: () => (<Box w="100%"><KVColumns columns={[{ header: '회원탈퇴', rows: [['어제', '11', true], ['이번달', '32', true]] }, { header: '총 회원 수', center: '234,902' }, { header: 'SMS', lines: [{ t: '353건', b: true }, { t: '4,589원', b: true }, { t: '(건/13원)' }] }, { header: '별점', nodes: [<Stars key="a" n={5} size={16} />, <Stars key="b" n={3} size={16} />] }, { header: '구매후기 수', lines: [{ t: '2,152', b: true }, { t: '220', b: true }] }]} /></Box>),
        code: `<KVColumns columns={[\n  { header: '회원탈퇴', rows: [['어제', '11', true]] },   // danger=빨강\n  { header: '총 회원 수', center: '234,902' },            // 단일 중앙값\n  { header: 'SMS', lines: [{ t: '353건', b: true }, { t: '(건/13원)' }] }, // 중앙 여러 줄\n  { header: '별점', nodes: [<Stars n={5} size={18} />, <Stars n={3} size={18} />] }, // 임의 노드 스택\n]} />`,
        html: `<!-- 상하 #ddd 선 + 셀 사이 1px 회색(바탕 var(--FgGrE8) 이 gap으로 비침) -->
<div style="display:flex;flex-direction:column;background:var(--FgGrE8);border-top:1px solid #ddd;border-bottom:1px solid #ddd;font-family:'Nanum Gothic',sans-serif;">
  <div style="display:flex;gap:1px;padding-bottom:1px;">
    <div style="flex:1;background:var(--FgGrF8);padding:8px 16px;text-align:center;font-weight:700;font-size:12px;color:var(--FgGr72);">신규가입</div>
    <div style="flex:1;background:var(--FgGrF8);padding:8px 16px;text-align:center;font-weight:700;font-size:12px;color:var(--FgGr72);">회원탈퇴</div>
    <div style="flex:1;background:var(--FgGrF8);padding:8px 16px;text-align:center;font-weight:700;font-size:12px;color:var(--FgGr72);">총 회원 수</div>
  </div>
  <div style="display:flex;gap:1px;">
    <div style="flex:1;background:var(--FgWh);padding:12px 16px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--FgGr72);"><span>어제</span><b>1,453</b></div>
    </div>
    <div style="flex:1;background:var(--FgWh);padding:12px 16px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--FgGr72);"><span>어제</span><b style="color:var(--FgRed);">11</b></div>
    </div>
    <div style="flex:1;background:var(--FgWh);padding:12px 16px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:var(--FgGr42);">234,902</div>
  </div>
</div>` },
      { name: 'InfoCard', source: 'admin/dashboardAtoms', desc: '제목·우측 액션·본문으로 구성하는 기본 카드 컨테이너.\n대시보드의 지표·현황 묶음을 담을 때 사용한다.', tags: ['title', 'action', 'children'],
        render: () => (<Box w="280px"><InfoCard title="캐시 현황" action={<Text fontFamily="monospace" fontSize="11px" color="#29BC25">충전하기 ›</Text>}><Text fontSize="18px" fontWeight="700">18,000,000c</Text></InfoCard></Box>),
        code: `<InfoCard title="캐시 현황" action={<Link>충전하기 ›</Link>}>\n  <Text>18,000,000c</Text>\n</InfoCard>`,
        html: `<div style="display:flex;flex-direction:column;background:var(--FgWh);border:1px solid var(--FgGrE8);border-radius:16px;padding:16px;width:280px;font-family:'Nanum Gothic',sans-serif;">
  <div style="display:flex;align-items:center;padding-bottom:8px;">
    <span style="font-weight:700;font-size:14px;color:var(--FgGr42);">캐시 현황</span>
    <span style="flex:1;"></span>
    <span style="font-size:11px;color:var(--FgGreenX);cursor:pointer;">충전하기 ›</span>
  </div>
  <div style="font-size:18px;font-weight:700;color:var(--FgGr42);">18,000,000c</div>
</div>` },
      { name: 'LabelValueTable', source: 'admin/dashboardAtoms', desc: '제목 아래 라벨과 값을 행으로 나열하는 요약 표.\n캠페인 지표 등 항목-값 쌍을 정리할 때 사용한다.', tags: ['header', 'rows', 'tone'],
        render: () => (<Box w="240px"><LabelValueTable header="구매 목적 캠페인" rows={[{ label: 'ROAS', value: '500%', tone: 'point' }, { label: '구매 금액', value: '1,000,000원' }]} /></Box>),
        code: `<LabelValueTable header="구매 목적 캠페인" rows={[{ label: 'ROAS', value: '500%', tone: 'point' }, ...]} />`,
        html: `<div style="border:1px solid var(--FgGrE8);border-radius:4px;overflow:hidden;width:240px;font-family:'Nanum Gothic',sans-serif;">
  <div style="background:var(--FgGrF8);padding:9px 14px;border-bottom:1px solid var(--FgGrE8);text-align:center;font-weight:700;font-size:13px;color:var(--FgGr42);">구매 목적 캠페인</div>
  <div style="display:flex;justify-content:space-between;gap:10px;padding:8px 14px;">
    <span style="font-size:12px;color:var(--FgGr72);">ROAS</span><span style="font-weight:700;font-size:12px;color:var(--FgGreenX);">500%</span>
  </div>
  <div style="display:flex;justify-content:space-between;gap:10px;padding:8px 14px;">
    <span style="font-size:12px;color:var(--FgGr72);">구매 금액</span><span style="font-weight:700;font-size:12px;color:var(--FgGr42);">1,000,000원</span>
  </div>
</div>` },
      { name: 'AdBanner', source: 'admin/dashboardAtoms', desc: '이미지로 노출하는 홍보 배너.\n광고 항목은 AD 마크로 구분한다.', tags: ['src', 'ad', 'alt'],
        render: () => (<Flex gap="8px" w="100%"><AdBanner w="200px" src={adminAsset('dashboard/banner-1.png')} /><AdBanner w="200px" src={adminAsset('dashboard/banner-4.png')} ad /></Flex>),
        code: `<AdBanner src={asset('dashboard/banner-4.png')} ad />`,
        html: `<div style="position:relative;border-radius:8px;overflow:hidden;width:200px;">
  <img src="/figma-assets/dashboard/banner-4.png" alt="" style="display:block;width:100%;height:auto;" />
  <!-- ad 마크(선택) -->
  <img src="/figma-assets/dashboard/ad-mark.svg" alt="AD" style="position:absolute;top:0;right:0;width:27px;height:20px;" />
</div>` },
      { name: 'PromoBanner', source: 'admin/dashboardAtoms', desc: '색 배경에 문구를 얹는 텍스트형 홍보 배너.\n이미지 없이 짧은 프로모션 메시지를 노출할 때 사용한다.', tags: ['bg', 'badge', 'h'],
        render: () => (<Flex gap="8px"><DashPromoBanner w="150px" bg="#E23C34"><Text fontFamily="'Nanum Gothic', sans-serif" fontSize="12px" fontWeight="700" color="#fff">오픈 준비 끝!</Text></DashPromoBanner><DashPromoBanner w="150px" bg="#6D3BD1" badge="AD"><Text fontFamily="'Nanum Gothic', sans-serif" fontSize="12px" fontWeight="700" color="#fff">SNS활용패키지</Text></DashPromoBanner></Flex>),
        code: `<PromoBanner bg="#E23C34" badge="AD"><Text>...</Text></PromoBanner>`,
        html: `<!-- 배경은 배너별 브랜드색(리터럴). 글자는 var(--FgWh) -->
<div style="position:relative;background:#E23C34;border-radius:8px;padding:12px 16px;width:150px;overflow:hidden;">
  <span style="position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;color:rgba(255,255,255,0.85);background:rgba(0,0,0,0.25);padding:1px 5px;border-radius:3px;">AD</span>
  <span style="font-family:'Nanum Gothic',sans-serif;font-size:12px;font-weight:700;color:var(--FgWh);">SNS활용패키지</span>
</div>` },
      { name: 'NoticeList', source: 'admin/dashboardAtoms', desc: '제목과 날짜로 구성한 공지 목록.\n최신·중요 항목은 굵게 강조한다.', tags: ['items', 'bold'],
        render: () => (<Box w="360px"><NoticeList items={[{ title: '9월 정기 업데이트 소식', date: '2024-09-24', bold: true }, { title: '추석 연휴 휴무 안내', date: '2024-09-06' }, { title: '네이버 단축 URL 서비스 정상화 완료', date: '2024-08-01' }]} /></Box>),
        code: `<NoticeList items={[\n  { title: '9월 정기 업데이트', date: '2024-09-24', bold: true },\n  { title: '추석 연휴 휴무 안내', date: '2024-09-06' },\n]} />`,
        html: `<div style="background:var(--FgGrE8);padding:1px 0;font-family:'Nanum Gothic',sans-serif;">
  <div style="background:var(--FgWh);padding:16px;display:flex;flex-direction:column;gap:6px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="flex:1;min-width:0;font-weight:700;font-size:12px;color:var(--FgGr72);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">9월 정기 업데이트 소식</span>
      <span style="font-size:12px;color:var(--FgGr72);white-space:nowrap;">2024-09-24</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="flex:1;min-width:0;font-size:12px;color:var(--FgGr72);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">추석 연휴 휴무 안내</span>
      <span style="font-size:12px;color:var(--FgGr72);white-space:nowrap;">2024-09-06</span>
    </div>
  </div>
</div>` },
      { name: 'Stars', source: 'admin/dashboardAtoms', desc: '채운 별의 개수로 평점을 표시하는 별점.\n구매후기 등 5점 척도 평가 표현에 사용한다.', tags: ['n', 'size'],
        render: () => (<Flex direction="column" gap="4px"><Stars n={5} size={18} /><Stars n={3} size={18} /><Stars n={1} size={18} /></Flex>),
        code: `<Stars n={5} size={18} />`,
        html: `<div style="display:flex;gap:1px;font-size:18px;line-height:1;">
  <span style="color:#FFB800;">★</span><span style="color:#FFB800;">★</span><span style="color:#FFB800;">★</span>
  <span style="color:#D8D8D8;">★</span><span style="color:#D8D8D8;">★</span>
</div>
<!-- 채운 별 #FFB800, 빈 별 #D8D8D8 (별점 색은 브랜드 고정색) -->` },
    ],
  },
  {
    area: '송출앱',
    note: 'broadapp/components · frame · icons',
    items: [
      { name: 'AppButton', source: 'broadapp/components', desc: '송출 앱의 주요 액션 버튼.\n방송 시작·종료 등 화면 하단 핵심 동작에 사용한다.', tags: ['label', 'tone', 'onClick', 'flex'],
        render: () => (<DarkBox><Box w="150px"><AppButton label="방송 시작" tone="red" /></Box><Box w="120px"><AppButton label="취소" tone="gray" /></Box><Box w="120px"><AppButton label="설정" tone="outlineRed" /></Box></DarkBox>),
        code: `<AppButton label="방송 시작" tone="red" onClick={start} />`,
        html: `<button style="font-family:'Nanum Gothic',sans-serif;font-weight:700;font-size:15px;color:var(--FgWh);background:var(--FgRed);border:0;border-radius:10px;padding:14px 20px;width:150px;cursor:pointer;">방송 시작</button>
<!-- tone: red=var(--FgRed) · dark=#222 · gray=#3A3A3A · outlineRed=투명+빨강 테두리 -->` },
      { name: 'AppHeader', source: 'broadapp/components', desc: '송출 앱 화면 상단의 공통 헤더.\n뒤로가기·로고·우측 액션을 배치한다.', tags: ['onBack', 'right', 'divider'],
        render: () => (<Box w="320px"><DarkBox><Box w="100%"><AppHeader right={<IconButton><GearIcon /></IconButton>} /></Box></DarkBox></Box>),
        code: `<AppHeader onBack={goBack} right={<IconButton><GearIcon /></IconButton>} />` },
      { name: 'Toggle', source: 'broadapp/frame', desc: '송출 앱의 켜짐·꺼짐을 전환하는 토글 스위치.', tags: ['on', 'onClick'],
        render: () => (<DarkBox><AppToggleDemo /></DarkBox>),
        code: `const [on, setOn] = useState(false);\n<Toggle on={on} onClick={() => setOn((v) => !v)} />` },
      { name: 'Chevron', source: 'broadapp/components', desc: '펼침·이동 방향을 나타내는 화살표 아이콘.', tags: ['dir', 'color', 's'],
        render: () => (<DarkBox><Chevron dir="down" color="#fff" /><Chevron dir="right" color="#fff" /></DarkBox>),
        code: `<Chevron dir="right" color="#fff" s={18} />` },
      { name: 'IconButton + 아이콘', source: 'broadapp/icons', desc: '송출 앱에서 쓰는 아이콘 모음과, 이를 감싸는 터치 버튼.\n시청·장바구니·마이크 등 기능을 아이콘으로 제공한다.', tags: ['s', 'color'],
        render: () => (<DarkBox>{[EyeIcon, BagIcon, HeartIcon, MicIcon, VideoIcon, ChatIcon, BannerIcon, BoxIcon, SwitchIcon, NoticeIcon].map((Ic, i) => <Ic key={i} s={22} color="#fff" />)}<GearIcon color="#fff" /><LogoutIcon color="#fff" /></DarkBox>),
        code: `<IconButton onClick={fn}><MicIcon s={22} color="#fff" /></IconButton>` },
      { name: 'Dialog', source: 'broadapp/components', desc: '확인·경고를 위한 모달 다이얼로그.\n방송 종료처럼 되돌리기 어려운 동작 전에 확인을 받는다.', tags: ['warn', 'title', 'body', 'buttons'],
        render: () => (<MiniScreen><Dialog warn title="방송을 종료할까요?" body="종료하면 다시 시작할 수 없습니다." buttons={[{ label: '취소', tone: 'gray' }, { label: '종료', tone: 'red' }]} /></MiniScreen>),
        code: `<Dialog\n  warn\n  title="방송을 종료할까요?"\n  body="종료하면 다시 시작할 수 없습니다."\n  buttons={[\n    { label: '취소', tone: 'gray', onClick: close },\n    { label: '종료', tone: 'red', onClick: end },\n  ]}\n/>` },
      { name: 'BottomSheet', source: 'broadapp/components', desc: '화면 하단에서 올라오는 옵션 선택 시트.\n화질 설정처럼 목록 중 하나를 고를 때 사용한다.', tags: ['title', 'options', 'selectedIdx', 'onSelect', 'onClose'],
        render: () => (<MiniScreen><BottomSheetDemo /></MiniScreen>),
        code: `<BottomSheet\n  title="화질 설정"\n  options={[{ t: '자동', d: '네트워크에 맞춰 조절' }, ...]}\n  selectedIdx={idx}\n  onSelect={setIdx}\n  onClose={close}\n/>` },
      { name: 'InfoSheet', source: 'broadapp/components', desc: '기능 설명을 하단 시트로 안내하는 안내용 바텀시트.\n"?" 도움말을 눌렀을 때 상세 설명을 보여준다.', tags: ['title', 'paras', 'onClose'],
        render: () => (<MiniScreen><InfoSheet title="송출이란?" paras={['휴대폰 화면을 실시간으로 내보내는 기능입니다.', '와이파이 환경을 권장합니다.']} onClose={() => {}} /></MiniScreen>),
        code: `<InfoSheet title="송출이란?" paras={['...', '...']} onClose={close} />` },
    ],
  },
  {
    area: '고객뷰어 · 샵',
    note: 'viewer · shop',
    items: [
      { name: 'LoginCard', source: 'viewer/Live', desc: '소셜 로그인을 유도하는 카드.\n네이버·카카오·애플 로그인을 제공한다.', tags: ['onLogin', 'onClose', 'oct'],
        render: () => (<MiniScreen bg="#EDEDED"><LoginCard onLogin={() => {}} onClose={() => {}} /></MiniScreen>),
        code: `<LoginCard onLogin={login} onClose={close} />` },
      { name: 'ShopToast', source: 'shop/ShopToast', desc: '동작 완료를 잠깐 알리는 하단 토스트.\n장바구니 담기 등 짧은 피드백에 사용한다.', tags: ['text', 'onClose', 'bottom'],
        render: () => (<MiniScreen bg="#F4F5F7"><ShopToast text="장바구니에 담았습니다" onClose={() => {}} /></MiniScreen>),
        code: `<ShopToast text="장바구니에 담았습니다" onClose={close} />` },
      { name: 'ShareSheet', source: 'shop/ShareSheet', desc: '링크를 공유하는 하단 시트.\n주소 복사·카카오·인스타·QR 공유를 제공한다.', tags: ['url', 'onClose', 'showQr'],
        render: () => (<MiniScreen bg="#EDEDED"><ShareSheet url="https://shop.example.com/hub" onClose={() => {}} showQr /></MiniScreen>),
        code: `<ShareSheet url={hubUrl} onClose={close} showQr />` },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

// ── 평면(알파벳순) 컴포넌트 목록 — area 라벨 유지, /components/<slug> 라우팅용 유일 id ──
type FlatEntry = CompEntry & { area: string; id: string };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const ALL: FlatEntry[] = (() => {
  const flat = GROUPS.flatMap((g) => g.items.map((e) => ({ ...e, area: g.area })));
  flat.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const seen = new Map<string, number>();
  return flat.map((e) => {
    const base = slugify(e.name) || 'comp';
    const c = seen.get(base) ?? 0;
    seen.set(base, c + 1);
    // 중복 이름(예: Toggle ×2)은 두 번째부터 소스 파일명으로 유일화
    const id = c === 0 ? base : `${base}-${slugify(e.source.split('/').pop() || String(c))}`;
    return { ...e, id };
  });
})();
const byId = (id: string) => ALL.find((e) => e.id === id);
// area(화면)별 그룹 — 그룹 안에서만 알파벳순(전체를 한 덩어리로 섞지 않음)
const GROUPED: { area: string; items: FlatEntry[] }[] = GROUPS.map((g) => ({
  area: g.area,
  items: ALL.filter((e) => e.area === g.area),
}));

// ── 디자인 토큰 — Figma 변수(get_variable_defs) 이름 그대로 CSS 변수로 ──
// HTML 스니펫은 색을 하드코딩하지 않고 var(--FgGreenX) 처럼 이 토큰을 참조한다.
const TOKENS: { name: string; value: string; use: string }[] = [
  { name: 'FgWh', value: '#FFFFFF', use: '흰색 배경/글자' },
  { name: 'FgGreenX', value: '#29BC25', use: '포인트 초록(등록·활성·강조·마진%)' },
  { name: 'FgRed', value: '#FF2F2F', use: '경고·삭제·취소·감소' },
  { name: 'FgGr22', value: '#222222', use: '가장 진한 텍스트' },
  { name: 'FgGr42', value: '#424242', use: '기본 텍스트/제목' },
  { name: 'FgGr72', value: '#727272', use: '보조 텍스트/라벨' },
  { name: 'FgGr92', value: '#929292', use: '옅은 텍스트/도움말' },
  { name: 'FgGrB8', value: '#B8B8B8', use: '비활성/플레이스홀더/종료' },
  { name: 'FgGrE8', value: '#E8E8E8', use: '테두리/구분선' },
  { name: 'FgGrF8', value: '#F8F8F8', use: '옅은 배경(회색 박스)' },
];
const TOKEN_ID = 'design-tokens';
const LAYOUT_ID = 'admin-layout';   // Patterns — 어드민 레이아웃(LayoutDoc)
const TOKEN_CSS = ':root{\n' + TOKENS.map((t) => `  --${t.name}: ${t.value};`).join('\n') + '\n}';

// 코드 스니펫 블록(복사) — HeroUI식. 가로 스크롤 없이 줄바꿈, 복사 버튼은 헤더로 분리.
function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => {});
  };
  return (
    <Box className="cvcode" bg="#0F1117" borderRadius="10px" overflow="hidden" mt="10px" border="1px solid #1C2030">
      <Flex align="center" px="14px" h="34px" borderBottom="1px solid rgba(255,255,255,0.07)">
        <Text fontFamily="monospace" fontSize="11px" fontWeight="700" color="#7A8090" letterSpacing="0.04em" textTransform="uppercase">{lang}</Text>
        <Box flex="1" />
        <Box as="button" onClick={copy} className="cvcode__copy" display="flex" alignItems="center" gap="5px" px="9px" py="4px" borderRadius="6px" bg="rgba(255,255,255,0.06)" cursor="pointer" transition="background 0.12s, opacity 0.12s" _hover={{ bg: 'rgba(255,255,255,0.16)' }} title="코드 복사">
          <Text fontFamily={CHROME} fontSize="11px" fontWeight="700" color={copied ? '#4ADE80' : '#C7CCD4'}>{copied ? '복사됨' : '복사'}</Text>
        </Box>
      </Flex>
      <Box as="pre" p="14px 16px" m="0" overflowX="auto">
        <Text as="code" fontFamily="monospace" fontSize="12.5px" color="#E6E8EC" lineHeight="1.7" whiteSpace="pre" display="block">{code}</Text>
      </Box>
    </Box>
  );
}


// 섹션 제목(상세 페이지 내부 앵커) — 넘버링 + 제목 + 선택 설명
function SecHead({ id, num, children, note }: { id: string; num?: number; children: React.ReactNode; note?: string }) {
  return (
    <Box id={id} data-anchor={id} scrollMarginTop="20px" pt="42px" pb="14px">
      <Flex align="center" gap="10px">
        {num != null && <Text fontFamily="monospace" fontSize="15px" fontWeight="700" color={colors.green} lineHeight="1" mt="2px">{String(num).padStart(2, '0')}</Text>}
        <Text fontFamily={CHROME} fontSize="21px" fontWeight="800" color="#18181B" letterSpacing="-0.01em">{children}</Text>
      </Flex>
      {note && <Text fontFamily={CHROME} fontSize="14.5px" color="#71717A" pt="4px" pl={num != null ? '30px' : '0'}>{note}</Text>}
    </Box>
  );
}

// 상태 뱃지 톤
const STATUS_TONE: Record<DocStatus, { bg: string; fg: string; dot: string }> = {
  Stable: { bg: '#ECFDF3', fg: '#067647', dot: '#17B26A' },
  Draft: { bg: '#FEF7EC', fg: '#B54708', dot: '#F79009' },
  Deprecated: { bg: '#FEF3F2', fg: '#B42318', dot: '#F04438' },
};
// 상태 뱃지(점 + 라벨)
function StatusChip({ status }: { status: DocStatus }) {
  const t = STATUS_TONE[status];
  return (
    <Flex align="center" gap="5px" bg={t.bg} px="8px" py="3px" borderRadius="100px" flexShrink={0}>
      <Box w="6px" h="6px" borderRadius="50%" bg={t.dot} />
      <Text fontFamily={CHROME} fontSize="13px" fontWeight="700" color={t.fg}>{status}</Text>
    </Flex>
  );
}
// 사용 범위 뱃지(중립 회색)
function ScopeChip({ children }: { children: React.ReactNode }) {
  return <Text fontFamily={CHROME} fontSize="13px" fontWeight="700" color="#3F3F46" bg="#F4F4F5" border="1px solid #E4E4E7" px="9px" py="2px" borderRadius="6px" flexShrink={0}>{children}</Text>;
}

// ── SVG 아이콘(이모지 대신) — stroke 색만 지정 ──
const IcoCheck = ({ c }: { c: string }) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const IcoX = ({ c }: { c: string }) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);
const IcoInfo = ({ c }: { c: string }) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>);
const IcoChevR = ({ c }: { c: string }) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>);
const IcoMenu = ({ c }: { c: string }) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>);

// Guidelines 블록 — 권장/금지/접근성/참고
function GuideBlock({ g }: { g: Guidelines }) {
  const rows: { key: string; label: string; ico: React.ReactNode; color: string; items?: string[] }[] = [
    { key: 'do', label: '사용해야 하는 경우', ico: <IcoCheck c="#067647" />, color: '#067647', items: g.do },
    { key: 'dont', label: '사용하면 안 되는 경우', ico: <IcoX c="#B42318" />, color: '#B42318', items: g.dont },
    { key: 'a11y', label: '접근성', ico: <IcoInfo c="#3538CD" />, color: '#3538CD', items: g.a11y },
    { key: 'note', label: '기획 · 퍼블리싱 참고', ico: <IcoChevR c="#71717A" />, color: '#71717A', items: g.note },
  ].filter((r) => r.items && r.items.length);
  return (
    <Flex direction="column" gap="10px">
      {rows.map((r) => (
        <Box key={r.key} border="1px solid #E4E4E7" borderRadius="10px" p="14px 16px" bg="#fff">
          <Flex align="center" gap="8px" pb="8px">
            <Flex w="20px" h="20px" align="center" justify="center" borderRadius="6px" bg={`${r.color}14`}>{r.ico}</Flex>
            <Text fontFamily={CHROME} fontSize="15px" fontWeight="700" color="#18181B">{r.label}</Text>
          </Flex>
          <Flex direction="column" gap="6px" pl="28px">
            {(r.items ?? []).map((it, i) => (
              <Text key={i} fontFamily={CHROME} fontSize="14.5px" color="#52525B" lineHeight="1.55" position="relative" _before={{ content: '"·"', position: 'absolute', left: '-12px', color: '#A1A1AA' }}>{it}</Text>
            ))}
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}

// 상세 페이지에 존재하는 섹션 목록(우측 목차·스크롤스파이 공용)
function sectionsFor(e: FlatEntry): { id: string; label: string }[] {
  const s: { id: string; label: string }[] = [{ id: 'sec-preview', label: 'Preview' }];
  if (e.variants && e.variants.length) s.push({ id: 'sec-variants', label: 'Variants' });
  s.push({ id: 'sec-props', label: 'Props' });
  s.push({ id: 'sec-usage', label: 'Usage' });
  if (e.guidelines) s.push({ id: 'sec-guidelines', label: 'Guidelines' });
  return s;
}

// Props 표 — props 있으면 표, 없으면 tags를 prop 이름 목록으로 대체(honest fallback)
function PropsTable({ e }: { e: FlatEntry }) {
  if (e.props && e.props.length) {
    const cols = ['0 0 128px', '0 0 150px', '0 0 78px', '0 0 92px', '1'];
    return (
      <Box border="1px solid #E4E4E7" borderRadius="10px" overflowX="auto">
        <Box minW="720px">
          <Flex bg="#FAFAFA" borderBottom="1px solid #E4E4E7">
            {['Prop', 'Type', 'Default', 'Required', 'Description'].map((h, i) => (
              <Box key={h} flex={cols[i]} minW="0" px="14px" py="9px" borderLeft={i ? '1px solid #EEEEF0' : undefined}>
                <Text fontFamily={CHROME} fontSize="11.5px" fontWeight="800" color="#3F3F46" letterSpacing="0.02em" whiteSpace="nowrap">{h}</Text>
              </Box>
            ))}
          </Flex>
          {e.props.map((p, ri) => (
            <Flex key={p.name} borderTop={ri ? '1px solid #F1F1F3' : undefined} align="stretch">
              <Box flex={cols[0]} minW="0" px="14px" py="10px">
                <Text fontFamily="monospace" fontSize="12px" fontWeight="700" color="#18181B" wordBreak="break-word">{p.name}</Text>
              </Box>
              <Box flex={cols[1]} minW="0" px="14px" py="10px" borderLeft="1px solid #F1F1F3">
                <Text fontFamily="monospace" fontSize="11.5px" color="#7C3AED" wordBreak="break-word">{p.type}</Text>
              </Box>
              <Box flex={cols[2]} minW="0" px="14px" py="10px" borderLeft="1px solid #F1F1F3">
                <Text fontFamily="monospace" fontSize="11.5px" color={p.def ? '#71717A' : '#C7CCD4'} wordBreak="break-word">{p.def ?? '—'}</Text>
              </Box>
              <Box flex={cols[3]} minW="0" px="14px" py="10px" borderLeft="1px solid #F1F1F3">
                {p.required
                  ? <Text fontFamily={CHROME} fontSize="11px" fontWeight="700" color="#B42318" bg="#FEF3F2" px="6px" py="1px" borderRadius="5px" w="fit-content">필수</Text>
                  : <Text fontFamily={CHROME} fontSize="11.5px" color="#C7CCD4">—</Text>}
              </Box>
              <Box flex={cols[4]} minW="0" px="14px" py="10px" borderLeft="1px solid #F1F1F3">
                <Text fontFamily={CHROME} fontSize="12.5px" color="#52525B" lineHeight="1.55" whiteSpace="pre-line">{p.desc}</Text>
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
    );
  }
  // fallback — tags를 prop 이름 칩으로
  return e.tags.length ? (
    <Flex gap="5px" wrap="wrap">
      {e.tags.map((tg) => (
        <Text key={tg} fontFamily="monospace" fontSize="11px" color="#6B7280" bg="#F1F1F4" px="8px" py="3px" borderRadius="6px">{tg}</Text>
      ))}
      <Text fontFamily={CHROME} fontSize="11.5px" color="#B0B4BB" alignSelf="center" pl="2px">· 상세 props 준비중</Text>
    </Flex>
  ) : (
    <Text fontFamily={CHROME} fontSize="12px" color="#B0B4BB">props 없음</Text>
  );
}

// 사용법 — React(.tsx) | HTML | CSS 탭. HTML=클래스 마크업, CSS=그 스타일(Figma 토큰 var(--Fg…))
function UsageTabs({ e }: { e: FlatEntry }) {
  const [lang, setLang] = useState<'react' | 'html' | 'css'>('react');
  const hasHtml = !!e.html;
  return (
    <Box>
      <Flex bg="#F1F1F4" borderRadius="8px" p="3px" gap="2px" w="fit-content" mb="2px">
        {([['react', 'React (.tsx)'], ['html', 'HTML'], ['css', 'CSS']] as const).map(([k, label]) => {
          const on = lang === k;
          return (
            <Box as="button" key={k} onClick={() => setLang(k)} px="12px" py="5px" borderRadius="6px" cursor="pointer"
              bg={on ? '#fff' : 'transparent'} boxShadow={on ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'}>
              <Text fontFamily={CHROME} fontSize="13.5px" fontWeight="700" color={on ? '#111827' : '#9CA3AF'}>{label}</Text>
            </Box>
          );
        })}
      </Flex>
      {lang === 'react' && <CodeBlock code={e.code} lang="tsx" />}
      {lang === 'html' && (hasHtml
        ? <CodeBlock code={e.html as string} lang="html" />
        : <Box mt="10px" p="14px 16px" bg="#FFF7ED" border="1px solid #FED7AA" borderRadius="9px"><Text fontFamily={CHROME} fontSize="12px" color="#9A3412">이 컴포넌트의 HTML/CSS 예시는 준비중입니다. (React 탭 참고)</Text></Box>)}
      {lang === 'css' && (e.css
        ? <><CodeBlock code={e.css} lang="css" /><Text fontFamily={CHROME} fontSize="12.5px" color="#9CA3AF" pt="8px">색상은 디자인 토큰 <Box as="span" fontFamily="monospace" color="#6B7280">var(--Fg…)</Box> 참조 — 토큰 <Box as="span" fontFamily="monospace" color="#6B7280">:root</Box> CSS는 좌측 <Box as="span" fontWeight="700" color="#6B7280">디자인 토큰</Box> 페이지에서 복사.</Text></>
        : <Box mt="10px" p="14px 16px" bg="#FFF7ED" border="1px solid #FED7AA" borderRadius="9px"><Text fontFamily={CHROME} fontSize="12px" color="#9A3412">CSS 예시는 준비중입니다.</Text></Box>)}
    </Box>
  );
}

// 디자인 토큰 페이지 — 색 스와치 + 복사용 :root CSS
function TokenPage({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <Box ref={scrollRef} flex="1" minW="0" overflowY="auto">
      <Box maxW="900px" mx="auto" px="32px" py="26px">
        <Flex align="center" gap="9px" pb="6px" wrap="wrap">
          <Text fontFamily={CHROME} fontSize="28px" fontWeight="800" color="#111827">디자인 토큰</Text>
          <Text fontFamily="monospace" fontSize="14px" color="#9CA3AF">Figma variables → CSS 변수</Text>
        </Flex>
        <Text fontFamily={CHROME} fontSize="15.5px" color="#4B5563" lineHeight="1.7" pb="8px">
          Figma 변수명 그대로 CSS 변수(<Box as="span" fontFamily="monospace">--FgGreenX</Box> 등)로 제공. HTML 코드는 색을 하드코딩하지 말고 이 토큰을 <Box as="span" fontFamily="monospace">var(--…)</Box> 로 참조한다. 아래 <Box as="span" fontFamily="monospace">:root</Box> CSS를 프로젝트에 한 번 포함하면 됨.
        </Text>

        <SecHead id="sec-preview" num={1}>색상 토큰</SecHead>
        <Box border="1px solid #E5E7EB" borderRadius="9px" overflow="hidden">
          <Flex bg="#F4F5F7">
            {['', '토큰(CSS 변수)', 'HEX', '용도'].map((h, i) => (
              <Box key={i} flex={['0 0 52px', '0 0 180px', '0 0 100px', '1'][i]} px="12px" py="8px" borderLeft={i ? '1px solid #EAECEF' : undefined}>
                <Text fontFamily={CHROME} fontSize="11.5px" fontWeight="800" color="#374151">{h}</Text>
              </Box>
            ))}
          </Flex>
          {TOKENS.map((t) => (
            <Flex key={t.name} borderTop="1px solid #F0F1F3" align="center">
              <Box flex="0 0 52px" px="12px" py="8px">
                <Box w="26px" h="26px" borderRadius="6px" bg={t.value} border="1px solid #E5E7EB" />
              </Box>
              <Box flex="0 0 180px" px="12px" py="8px" borderLeft="1px solid #F0F1F3">
                <Text fontFamily="monospace" fontSize="12px" fontWeight="700" color="#111827">--{t.name}</Text>
              </Box>
              <Box flex="0 0 100px" px="12px" py="8px" borderLeft="1px solid #F0F1F3">
                <Text fontFamily="monospace" fontSize="12px" color="#6B7280">{t.value}</Text>
              </Box>
              <Box flex="1" minW="0" px="12px" py="8px" borderLeft="1px solid #F0F1F3">
                <Text fontFamily={CHROME} fontSize="12px" color="#4B5563">{t.use}</Text>
              </Box>
            </Flex>
          ))}
        </Box>

        <SecHead id="sec-usage" num={2}>토큰 CSS (복사해서 한 번 포함)</SecHead>
        <CodeBlock code={TOKEN_CSS} lang="css" />
        <Box h="40px" />
      </Box>
    </Box>
  );
}

// 미리보기 카드 — "Preview" 라벨 + 흰 카드
function PreviewCard({ children, note, minH = '128px' }: { children: React.ReactNode; note?: string; minH?: string }) {
  return (
    <Box border="1px solid #E4E4E7" borderRadius="12px" overflow="hidden" bg="#fff">
      <Flex align="center" gap="8px" px="16px" h="38px" borderBottom="1px solid #F1F1F3" bg="#FAFAFA">
        <Text fontFamily={CHROME} fontSize="13.5px" fontWeight="700" color="#71717A" letterSpacing="0.03em" textTransform="uppercase">Preview</Text>
        {note && <Text fontFamily={CHROME} fontSize="13.5px" color="#A1A1AA">{note}</Text>}
      </Flex>
      <Flex px="28px" py="30px" align="center" gap="14px" wrap="wrap" minH={minH} style={{ backgroundImage: 'radial-gradient(#EDEDF0 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        {children}
      </Flex>
    </Box>
  );
}

// 컴포넌트 상세 페이지 — Header / Preview / Variants / Props / Usage / Guidelines
function ComponentPage({ e, scrollRef }: { e: FlatEntry; scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const scope = e.scope ?? e.area;
  const secNum: Record<string, number> = {};
  sectionsFor(e).forEach((s, i) => { secNum[s.id] = i + 1; });
  return (
    <Box ref={scrollRef} flex="1" minW="0" overflowY="auto">
      <Box maxW="1080px" mx="auto" px="44px" py="34px">
        {/* Header */}
        <Flex align="center" gap="9px" pb="10px" wrap="wrap">
          <Text fontFamily={CHROME} fontSize="32px" fontWeight="800" color="#18181B" letterSpacing="-0.02em">{e.name}</Text>
          <StatusChip status={e.status ?? 'Stable'} />
          <ScopeChip>{scope}</ScopeChip>
          <Text fontFamily="monospace" fontSize="14px" color="#A1A1AA">{e.source}</Text>
        </Flex>
        <Text fontFamily={CHROME} fontSize="16px" fontWeight="700" color="#3F3F46" lineHeight="1.7" whiteSpace="pre-line">{e.desc}</Text>

        {/* Preview */}
        <SecHead id="sec-preview" num={secNum['sec-preview']}>Preview</SecHead>
        <PreviewCard note="실제 컴포넌트 렌더">{e.render()}</PreviewCard>

        {/* Variants */}
        {e.variants && e.variants.length > 0 && (
          <>
            <SecHead id="sec-variants" num={secNum['sec-variants']} note="상태 · 색상 · 크기별 변형">Variants</SecHead>
            <Flex direction="column" gap="24px">
              {e.variants.map((v) => (
                <Box key={v.title}>
                  <Flex align="baseline" gap="8px" pb="10px">
                    <Text fontFamily={CHROME} fontSize="15px" fontWeight="700" color="#27272A">{v.title}</Text>
                    {v.desc && <Text fontFamily={CHROME} fontSize="14px" color="#A1A1AA">{v.desc}</Text>}
                  </Flex>
                  <PreviewCard minH="0">{v.render()}</PreviewCard>
                </Box>
              ))}
            </Flex>
          </>
        )}

        {/* Props */}
        <SecHead id="sec-props" num={secNum['sec-props']} note={e.props?.length ? undefined : '주요 prop 이름'}>Props</SecHead>
        <PropsTable e={e} />

        {/* Usage */}
        <SecHead id="sec-usage" num={secNum['sec-usage']} note="React · HTML · CSS — 복사해서 사용">Usage</SecHead>
        <UsageTabs e={e} />

        {/* Guidelines */}
        {e.guidelines && (
          <>
            <SecHead id="sec-guidelines" num={secNum['sec-guidelines']}>Guidelines</SecHead>
            <GuideBlock g={e.guidelines} />
          </>
        )}
        <Box h="56px" />
      </Box>
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

// URL(/components/<slug>)에서 현재 항목 id 파싱(없거나 무효면 첫 항목)
function currentIdFromPath(): string {
  const m = window.location.pathname.match(/^\/components\/([^/?#]+)/);
  const id = m ? decodeURIComponent(m[1]) : '';
  return (id === TOKEN_ID || id === LAYOUT_ID || byId(id)) ? id : (ALL[0]?.id ?? '');
}

export function ComponentGallery() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string>(() => currentIdFromPath());
  const [active, setActive] = useState<string>('sec-preview');
  const [query, setQuery] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  // 뒤로/앞으로 가기 → URL 동기화
  useEffect(() => {
    const onPop = () => setSelectedId(currentIdFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 상세 섹션 스크롤스파이(선택 바뀔 때 재관찰 · 레이아웃뷰 제외)
  useEffect(() => {
    if (selectedId === LAYOUT_ID) return;
    const root = scrollRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-anchor]'));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((en) => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.getAttribute('data-anchor') || '');
      },
      { root, rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selectedId]);

  const select = (id: string) => {
    setSelectedId(id);
    setActive('sec-preview');
    setNavOpen(false);
    if (window.location.pathname !== `/components/${id}`) window.history.pushState({}, '', `/components/${id}`);
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const goSec = (id: string) => scrollRef.current?.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isToken = selectedId === TOKEN_ID;
  const isLayout = selectedId === LAYOUT_ID;
  const selected = byId(selectedId) ?? ALL[0];
  const q = query.trim().toLowerCase();
  const match = (e: FlatEntry) => !q || e.name.toLowerCase().includes(q) || e.area.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q));
  const groups = GROUPED.map((g) => ({ ...g, items: g.items.filter(match) })).filter((g) => g.items.length);
  const tokenMatches = !q || 'foundation 디자인 토큰 design tokens'.includes(q);
  const layoutMatches = !q || 'patterns 어드민 레이아웃 admin layout'.includes(q);
  const rail: { id: string; label: string }[] = isToken
    ? [{ id: 'sec-preview', label: '색상 토큰' }, { id: 'sec-usage', label: '토큰 CSS' }]
    : sectionsFor(selected);

  const NavRow = ({ id, label, swatch }: { id: string; label: string; swatch?: boolean }) => {
    const on = id === selectedId;
    return (
      <Flex as="button" w="100%" align="center" gap="8px" pl="14px" pr="10px" py="6px" textAlign="left" borderRadius="7px"
        onClick={() => select(id)} cursor="pointer" position="relative" _hover={{ bg: on ? '#F4F4F5' : '#FAFAFA' }} bg={on ? '#F4F4F5' : 'transparent'}>
        {on && <Box position="absolute" left="-6px" top="6px" bottom="6px" w="3px" borderRadius="2px" bg="#18181B" />}
        {swatch && <Box w="12px" h="12px" borderRadius="3px" flexShrink={0} style={{ background: 'linear-gradient(135deg,#29BC25,#FF2F2F)' }} />}
        <Text fontFamily={CHROME} fontSize="14.5px" fontWeight={on ? '700' : '500'} color={on ? '#18181B' : '#52525B'} flex="1" minW="0" truncate>{label}</Text>
      </Flex>
    );
  };
  const CatLabel = ({ children }: { children: React.ReactNode }) => (
    <Text px="14px" pt="18px" pb="6px" fontFamily={CHROME} fontSize="13px" fontWeight="800" color="#A1A1AA" letterSpacing="0.06em" textTransform="uppercase">{children}</Text>
  );

  const sidebar = (
    <Flex direction="column" h="100%" minH="0">
      <Box p="12px 12px 8px" flexShrink={0}>
        <LInput value={query} onChange={setQuery} placeholder="컴포넌트 검색…" width="100%" />
      </Box>
      <Box flex="1" overflowY="auto" px="6px" pb="24px">
        {tokenMatches && (<><CatLabel>Foundation</CatLabel><NavRow id={TOKEN_ID} label="디자인 토큰" swatch /></>)}
        {groups.length > 0 && <CatLabel>Components</CatLabel>}
        {groups.map((g) => (
          <Box key={g.area} pb="4px">
            <Text px="14px" pt="8px" pb="3px" fontFamily={CHROME} fontSize="12.5px" fontWeight="700" color="#C4C4CC">{g.area} · {g.items.length}</Text>
            {g.items.map((e) => <NavRow key={e.id} id={e.id} label={e.name} />)}
          </Box>
        ))}
        {layoutMatches && (<><CatLabel>Patterns</CatLabel><NavRow id={LAYOUT_ID} label="어드민 레이아웃" /></>)}
        {groups.length === 0 && !tokenMatches && !layoutMatches && <Text px="14px" py="10px" fontSize="12px" color="#B0B4BB">검색 결과 없음</Text>}
      </Box>
    </Flex>
  );

  return (
    <Flex direction="column" h="100dvh" bg="#F6F6F7" fontFamily={CHROME}>
      <style>{'@keyframes cvspin{to{transform:rotate(360deg)}}'}</style>
      {/* 헤더 */}
      <Flex align="center" gap="10px" px="20px" h="56px" bg="#fff" borderBottom="1px solid #E4E4E7" flexShrink={0} zIndex={20}>
        <Box as="button" display={{ base: 'flex', lg: 'none' }} onClick={() => setNavOpen((v) => !v)} w="32px" h="32px" alignItems="center" justifyContent="center" borderRadius="8px" border="1px solid #E4E4E7" cursor="pointer" _hover={{ bg: '#F4F4F5' }}>
          <IcoMenu c="#52525B" />
        </Box>
        <Box as="button" onClick={() => { window.location.href = '/docs'; }} display="flex" alignItems="center" gap="4px" px="10px" h="30px" borderRadius="8px" border="1px solid #E4E4E7" cursor="pointer" _hover={{ bg: '#F4F4F5' }} title="문서로 돌아가기">
          <Text fontSize="14.5px" fontWeight="700" color="#52525B">← CONVERGENCE Docs.</Text>
        </Box>
        <Text fontSize="18px" fontWeight="800" color="#18181B" letterSpacing="-0.01em">컴포넌트 표준</Text>
        <Box flex="1" />
        <Text fontSize="14px" fontWeight="700" color="#A1A1AA" display={{ base: 'none', sm: 'block' }}>{TOTAL} components</Text>
      </Flex>

      <Flex flex="1" minH="0" position="relative">
        {/* 좌측 사이드바 — 데스크톱 고정 */}
        <Box w="248px" flexShrink={0} bg="#fff" borderRight="1px solid #E4E4E7" display={{ base: 'none', lg: 'block' }}>{sidebar}</Box>
        {/* 모바일 오버레이 */}
        {navOpen && (
          <Box display={{ base: 'block', lg: 'none' }}>
            <Box position="absolute" inset="0" bg="rgba(0,0,0,0.3)" zIndex={30} onClick={() => setNavOpen(false)} />
            <Box position="absolute" left="0" top="0" bottom="0" w="270px" bg="#fff" borderRight="1px solid #E4E4E7" zIndex={31} boxShadow="4px 0 24px rgba(0,0,0,0.12)">{sidebar}</Box>
          </Box>
        )}

        {/* 중앙 */}
        {isLayout ? <LayoutDoc /> : isToken ? <TokenPage key="tokens" scrollRef={scrollRef} /> : <ComponentPage key={selected.id} e={selected} scrollRef={scrollRef} />}

        {/* 우측 목차 — 레이아웃뷰 제외 · 1280 이하 숨김 */}
        {!isLayout && (
          <Box w="220px" flexShrink={0} py="34px" px="20px" borderLeft="1px solid #E4E4E7" bg="#fff" display={{ base: 'none', xl: 'block' }}>
            <Text fontFamily={CHROME} fontSize="13px" fontWeight="800" color="#A1A1AA" letterSpacing="0.05em" pb="14px">이 페이지</Text>
            <Flex direction="column" gap="1px">
              {rail.map((s, i) => {
                const on = active === s.id;
                return (
                  <Flex as="button" key={s.id} w="100%" align="baseline" gap="8px" textAlign="left" onClick={() => goSec(s.id)} cursor="pointer" position="relative" pl="12px" py="4px">
                    {on && <Box position="absolute" left="0" top="4px" bottom="4px" w="2px" borderRadius="2px" bg="#18181B" />}
                    <Text fontFamily="monospace" fontSize="12px" fontWeight="700" color={colors.green} flexShrink={0}>{String(i + 1).padStart(2, '0')}</Text>
                    <Text fontFamily={CHROME} fontSize="14.5px" fontWeight={on ? '700' : '500'} color={on ? '#18181B' : '#A1A1AA'}>{s.label}</Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
