/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// 프리뷰용 실제 화면 — FLEXG 운영 모바일 앱(1인 사장님/운영자용).
// 핵심: 설명 패널과 매칭할 영역에 data-doc-mark="키" 를 달면 번호 마커가 자동으로 얹힌다.
//       탭 있는 화면은 data-doc-tab 으로 탭 컨텍스트를 표시한다.
import { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
// 모바일 앱 chrome — deep import 금지, 디자인시스템 공개 배럴로만 소비.
import { StatusBar, HomeIndicator, TextField, FieldLabel, AppButton, BackArrow, Chevron, colors, asset } from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif"; // 앱 콘텐츠 폰트 — 전체 프리텐다드 통일

// ── FLEXG 로고(원본 워드마크 이미지) — tone에 따라 밝은/어두운 배경 대응(라이트=흰색, 다크=검정) ──
// 흰색 원본(투명 배경)을 CSS filter로 톤 제어: 다크 배경엔 흰색, 라이트 배경엔 검정.
function FlexgLogo({ tone = 'dark', h = 22 }: { tone?: 'dark' | 'light'; h?: number }) {
  const filter = tone === 'light' ? 'brightness(0) invert(1)' : 'brightness(0)';
  return <img src={asset('flexg-logo-wordmark.png')} alt="FLEXG" style={{ height: `${h}px`, width: 'auto', display: 'block', filter }} />;
}

// ── 경량 폰 셸 — 393px 폭 + 상태바 + (선택)하단 영역 + 홈 인디케이터. 전체 높이 노출(스크롤 클리핑 없음) ──
// topBg: 상태바 스트립 배경(기본 screenBg) · bottomBg: 홈 인디케이터 배경(기본 screenBg) · barTone: 홈 바 톤(기본 statusTone)
function PhoneShell({ children, screenBg = '#FFFFFF', statusTone = 'dark', topBg, bottom, bottomBg, barTone }: {
  children: React.ReactNode; screenBg?: string; statusTone?: 'light' | 'dark'; topBg?: string; bottom?: React.ReactNode; bottomBg?: string; barTone?: 'light' | 'dark';
}) {
  const tbg = topBg ?? screenBg;
  const bbg = bottomBg ?? screenBg;
  const bar = (barTone ?? statusTone) === 'light' ? '#FFFFFF' : '#141414';
  return (
    <Flex minH="100dvh" bg="#E9EBEF" align="flex-start" justify="center" py="32px" px="20px" fontFamily={FONT}>
      {/* 상·하 라운딩된 폰 카드. 콘텐츠 영역(flex 1)만 position relative → 바텀시트 딤/시트가 이 영역에만 국한되어 하단 메뉴바는 항상 보임 */}
      <Box w="393px" minH="852px" display="flex" flexDirection="column" bg={screenBg} borderRadius="44px" overflow="hidden" boxShadow="0 24px 60px rgba(17,24,39,0.16), 0 0 0 1px rgba(17,24,39,0.06)">
        <Box bg={tbg}><StatusBar tone={statusTone} /></Box>
        <Box flex="1" position="relative">{children}</Box>
        {bottom}
        <HomeIndicator bg={bbg} bar={bar} />
      </Box>
    </Flex>
  );
}

// ── 하단 탭바 (홈·주문·통계·상품·MY) — 전 앱 화면 공통. PhoneShell의 bottom 슬롯에 주입 ──
// ※ 모바일 표준 탭바 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
type TabKey = 'home' | 'order' | 'stat' | 'product' | 'my';
function TabIcon({ k, color }: { k: TabKey; color: string }) {
  const p = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (k) {
    case 'home': return <svg {...p}><path d="M4 11 12 4l8 7" /><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" /></svg>;
    case 'order': return <svg {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9.5 4h5v2.5h-5z" /><path d="M9 11h6M9 14.5h4" /></svg>;
    case 'stat': return <svg {...p}><path d="M6 20v-6M12 20V5M18 20v-9" /></svg>;
    case 'product': return <svg {...p}><path d="M6.5 8h11l-1 11.2A1.5 1.5 0 0 1 15 20.5H9A1.5 1.5 0 0 1 7.5 19.2L6.5 8Z" /><path d="M9.2 9V7.2a2.8 2.8 0 0 1 5.6 0V9" /></svg>;
    case 'my': return <svg {...p}><circle cx="12" cy="12" r="8.4" /><circle cx="12" cy="10" r="2.6" /><path d="M7.4 17.6a4.7 4.7 0 0 1 9.2 0" /></svg>;
  }
}
function BottomTabBar({ active }: { active: TabKey }) {
  const items: { k: TabKey; label: string; href: string }[] = [
    { k: 'home', label: '홈', href: '/preview/dashboard' },
    { k: 'order', label: '주문', href: '/preview/order-list' },
    { k: 'stat', label: '통계', href: '/preview/stat-hub' },
    { k: 'product', label: '상품', href: '/preview/product-list' },
    { k: 'my', label: 'MY', href: '/preview/my-account' },
  ];
  return (
    <Flex bg="#fff" borderTop={`1px solid ${colors.grE8}`} pt="9px" pb="4px" px="6px">
      {items.map((it) => {
        const on = it.k === active;
        const col = on ? colors.gr22 : colors.grB8;
        return (
          <a key={it.k} href={it.href} style={{ flex: 1, textDecoration: 'none' }}>
            <Flex direction="column" align="center" gap="4px" cursor="pointer">
              <TabIcon k={it.k} color={col} />
              <Text fontFamily={FONT} fontSize="10px" fontWeight={on ? '700' : '500'} letterSpacing="-0.2px" color={col}>{it.label}</Text>
            </Flex>
          </a>
        );
      })}
    </Flex>
  );
}

// ── 세그먼트 탭(대표/부계정 · 오늘/어제 등) ──
function Segmented({ tabs, active, onChange, markId }: { tabs: string[]; active: number; onChange: (i: number) => void; markId?: string }) {
  return (
    <Flex data-doc-mark={markId} bg={colors.grF2} borderRadius="10px" p="4px" gap="4px">
      {tabs.map((t, i) => (
        <Flex key={i} as="button" flex="1" h="40px" align="center" justify="center" borderRadius="8px" cursor="pointer"
          bg={i === active ? '#fff' : 'transparent'} boxShadow={i === active ? '0 1px 3px rgba(17,24,39,0.10)' : 'none'}
          onClick={() => onChange(i)}>
          <Text fontFamily={FONT} fontWeight={i === active ? '700' : '500'} fontSize="14px" letterSpacing="-0.3px" color={i === active ? colors.gr22 : colors.gr92}>{t}</Text>
        </Flex>
      ))}
    </Flex>
  );
}

// ============================================================
//  M_CMMN_P001 — 스플래시
// ============================================================
function Splash() {
  return (
    <PhoneShell screenBg="#141414" statusTone="light">
      <Flex data-doc-mark="brand" minH="700px" align="center" justify="center" direction="column">
        <FlexgLogo tone="light" h={44} />
      </Flex>
    </PhoneShell>
  );
}

// ============================================================
//  M_CMMN_P002 — 로그인 (대표계정 / 부계정 탭)
// ============================================================
function Login() {
  const [tab, setTab] = useState(0); // 0=대표계정, 1=부계정
  const [rep, setRep] = useState('owner@flexg.shop');
  const [ownerId, setOwnerId] = useState('owner@flexg.shop');
  const [subId, setSubId] = useState('');
  const [pw, setPw] = useState('••••••••');
  return (
    <PhoneShell screenBg="#FFFFFF" statusTone="dark">
      <Box px="24px" pt="20px" pb="40px">
        {/* 1. 브랜드 + 인사 카피 */}
        <Box data-doc-mark="intro" pt="12px" pb="34px">
          <FlexgLogo tone="dark" h={20} />
          <Text fontFamily={FONT} fontWeight="800" fontSize="24px" letterSpacing="-0.6px" color={colors.gr22} pt="28px">운영은 멈추지 않도록</Text>
          <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.35px" color={colors.gr92} pt="8px">언제 어디서나 FLEXG 운영 환경에 연결하세요</Text>
        </Box>

        {/* 2. 계정 유형 탭 */}
        <Box pb="22px">
          <Segmented tabs={['대표계정', '부계정']} active={tab} onChange={setTab} markId="tabs" />
        </Box>

        {/* 3. 입력 필드 — 대표계정 2필드 / 부계정 3필드 */}
        <Flex data-doc-mark="form" direction="column" gap="16px">
          {tab === 0 ? (
            <>
              <Box>
                <FieldLabel>아이디</FieldLabel>
                <Box pt="8px"><TextField value={ownerId} onChange={setOwnerId} placeholder="아이디를 입력하세요" /></Box>
              </Box>
              <Box>
                <FieldLabel>비밀번호</FieldLabel>
                <Box pt="8px"><TextField value={pw} onChange={setPw} placeholder="비밀번호를 입력하세요" /></Box>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <FieldLabel>대표 아이디</FieldLabel>
                <Box pt="8px"><TextField value={rep} onChange={setRep} placeholder="대표 아이디를 입력하세요" /></Box>
              </Box>
              <Box>
                <FieldLabel>부계정 아이디</FieldLabel>
                <Box pt="8px"><TextField value={subId} onChange={setSubId} placeholder="부계정 아이디를 입력하세요" /></Box>
              </Box>
              <Box>
                <FieldLabel>비밀번호</FieldLabel>
                <Box pt="8px"><TextField value={pw} onChange={setPw} placeholder="비밀번호를 입력하세요" /></Box>
              </Box>
            </>
          )}
        </Flex>

        {/* 4. 로그인 + 비밀번호 찾기 */}
        <Box data-doc-mark="actions" pt="26px">
          <AppButton label="로그인" tone="dark" />
          <Flex justify="center" pt="18px">
            <Text as="button" fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" color={colors.gr72} textDecoration="underline" cursor="pointer" onClick={() => { window.location.href = '/preview/password-reset'; }}>비밀번호를 잊으셨나요?</Text>
          </Flex>
        </Box>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_CMMN_P003 — 비밀번호 재설정 (로그인 > 비밀번호 찾기)
// ============================================================
function PasswordReset() {
  const [email, setEmail] = useState('owner@flexg.shop');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  return (
    <PhoneShell screenBg="#FFFFFF" statusTone="dark">
      {/* 헤더 — 뒤로가기(로그인 복귀) */}
      <Box px="14px" pt="2px" pb="6px">
        <Flex align="center" h="44px">
          <BackArrow color="#141414" onClick={() => window.history.back()} />
        </Flex>
      </Box>
      <Box px="24px" pt="8px" pb="40px">
        {/* 1. 안내 */}
        <Box data-doc-mark="intro" pb="28px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="24px" letterSpacing="-0.6px" color={colors.gr22}>비밀번호 재설정</Text>
          <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.35px" color={colors.gr92} pt="10px" lineHeight="1.5">가입 시 등록한 아이디(이메일)로 인증한 뒤 새 비밀번호를 설정하세요.</Text>
        </Box>

        <Flex direction="column" gap="22px">
          {/* 2. 아이디(이메일) 인증 요청 */}
          <Box data-doc-mark="account">
            <FieldLabel>아이디(이메일)</FieldLabel>
            <Box pt="8px"><TextField value={email} onChange={setEmail} placeholder="가입한 아이디(이메일)를 입력하세요" /></Box>
            <Box pt="10px"><AppButton label="인증코드 받기" tone="gray" h="48px" radius="8px" /></Box>
          </Box>

          {/* 3. 인증코드 확인 */}
          <Box data-doc-mark="verify">
            <FieldLabel>인증코드</FieldLabel>
            <Box pt="8px"><TextField value={code} onChange={setCode} placeholder="메일로 받은 인증번호 6자리" /></Box>
            <Flex justify="space-between" align="center" pt="8px">
              <Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>남은 시간 03:00</Text>
              <Text as="button" fontFamily={FONT} fontSize="12px" color={colors.gr72} textDecoration="underline" cursor="pointer">인증코드 재전송</Text>
            </Flex>
          </Box>

          {/* 4. 새 비밀번호 설정 */}
          <Box data-doc-mark="newpw">
            <FieldLabel>새 비밀번호</FieldLabel>
            <Box pt="8px"><TextField value={pw} onChange={setPw} placeholder="새 비밀번호를 입력하세요" /></Box>
            <Box pt="14px"><FieldLabel>새 비밀번호 확인</FieldLabel></Box>
            <Box pt="8px"><TextField value={pw2} onChange={setPw2} placeholder="새 비밀번호를 다시 입력하세요" /></Box>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} pt="8px">영문·숫자 포함 8자 이상</Text>
          </Box>
        </Flex>

        {/* 5. 변경 + 로그인 복귀 */}
        <Box data-doc-mark="submit" pt="28px">
          <AppButton label="비밀번호 변경" tone="dark" />
          <Flex justify="center" pt="18px">
            <Text as="button" fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" color={colors.gr72} textDecoration="underline" cursor="pointer" onClick={() => window.history.back()}>로그인으로 돌아가기</Text>
          </Flex>
        </Box>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_HOME_P001 — 메인 대시보드 / M_HOME_P002 — 알림
//  ※ 모바일 카드·차트·리스트 표준 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
// ============================================================
// ※ 경고/주의 톤 — FLEXG 토큰 미제공(디자인시스템 요청 대상). 프로토타입 임시 값.
const WARN = { bg: '#FFF7EC', border: '#FBE4C0', accent: '#C9861E', accentDark: '#9A5B10' };

function UpTri({ color = colors.green }: { color?: string }) {
  return <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ display: 'block' }}><path d="M5 2l3.6 6H1.4L5 2Z" fill={color} /></svg>;
}
function HeaderIcon({ k }: { k: 'calendar' | 'bell' | 'user' }) {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#FFFFFF', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (k === 'calendar') return <svg {...p}><rect x="4" y="5" width="16" height="16" rx="2.5" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (k === 'bell') return <svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
  return <svg {...p}><circle cx="12" cy="8.5" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>;
}
function TodoIcon({ k }: { k: 'cs' | 'box' | 'stock' }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: WARN.accentDark, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (k === 'cs') return <svg {...p}><path d="M4 5h16v11H9l-4 3v-3H4z" /></svg>;
  if (k === 'box') return <svg {...p}><path d="M4 8 12 4l8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" /></svg>;
  return <svg {...p}><path d="M12 4 3 19h18L12 4Z" /><path d="M12 10v4M12 17h.01" /></svg>;
}

// 섹션 헤더(제목 + 선택 "전체 →" 링크 · href 있으면 해당 프리뷰로 이동)
function HomeHead({ title, more, href }: { title: string; more?: boolean; href?: string }) {
  return (
    <Flex align="center" pb="12px">
      <Text fontFamily={FONT} fontWeight="800" fontSize="16px" letterSpacing="-0.4px" color={colors.gr22}>{title}</Text>
      <Box flex="1" />
      {more && <a href={href} style={{ textDecoration: 'none' }}><Text as="span" fontFamily={FONT} fontSize="12px" color={colors.gr92} cursor="pointer">전체 →</Text></a>}
    </Flex>
  );
}

// 앱 상단 검정 헤더(뒤로가기 + 가운데 제목 + 선택 우측 액션) — 서브/목록 화면 공통
function AppTopBar({ title, right, back = true }: { title: string; right?: React.ReactNode; back?: boolean }) {
  return (
    <Box bg="#141414" px="14px" pt="2px" pb="14px">
      <Flex align="center" h="44px">
        {back ? <BackArrow onClick={() => window.history.back()} /> : <Box w="28px" flexShrink={0} />}
        <Text flex="1" textAlign="center" fontFamily={FONT} fontWeight="800" fontSize="17px" letterSpacing="-0.4px" color="#fff">{title}</Text>
        <Box w="28px" display="flex" justifyContent="flex-end" flexShrink={0}>{right}</Box>
      </Flex>
    </Box>
  );
}

// 주문 상태 뱃지 — 입금확인/배송준비/배송중/배송완료/주문취소 (주문 목록·상세 공통)
const ORDER_STATUS: Record<string, { bg: string; fg: string }> = {
  '입금확인': { bg: '#E9F0FE', fg: colors.blue },
  '배송준비': { bg: WARN.bg, fg: WARN.accentDark },
  '배송중': { bg: '#EAF7EA', fg: '#1E8F1B' },
  '배송완료': { bg: colors.grF2, fg: colors.gr72 },
  '주문취소': { bg: '#FDECEC', fg: colors.red },
};
function StatusBadge({ s }: { s: string }) {
  const t = ORDER_STATUS[s] ?? { bg: colors.grF2, fg: colors.gr72 };
  return (
    <Flex bg={t.bg} borderRadius="6px" px="7px" py="3px" align="center" flexShrink={0}>
      <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={t.fg} whiteSpace="nowrap">{s}</Text>
    </Flex>
  );
}

// 순위 뱃지 — 상위 3위 강조(다크), 이하 회색
function RankBadge({ n }: { n: number }) {
  const top = n <= 3;
  return (
    <Flex w="22px" h="22px" align="center" justify="center" borderRadius="7px" bg={top ? colors.gr22 : colors.grF2} flexShrink={0}>
      <Text fontFamily={FONT} fontWeight="800" fontSize="12px" color={top ? '#fff' : colors.gr72}>{n}</Text>
    </Flex>
  );
}

// 시간대별 매출 추이 — 선택 탭(오늘/어제)이 검정 실선 + 현재 마커, 나머지는 회색 점선(비교)
function SalesChart({ sel }: { sel: number }) {
  const today = '6,72 42,66 78,62 114,50 150,46 186,36 222,32 258,22 292,14';
  const yest = '6,80 42,78 78,73 114,66 150,62 186,55 222,51 258,45 292,40';
  const primary = sel === 0 ? today : yest;
  const reference = sel === 0 ? yest : today;
  const markerTop = sel === 0 ? '16px' : '56px'; // 실선 마지막 점 y(오늘 14 / 어제 40) × 1.5625
  return (
    <Box>
      <Box position="relative" h="150px">
        <svg viewBox="0 0 298 96" width="100%" height="150" preserveAspectRatio="none">
          <polyline points={reference} fill="none" stroke={colors.grD8} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <polyline points={primary} fill="none" stroke={colors.gr22} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <Box position="absolute" right="6px" top={markerTop} w="10px" h="10px" borderRadius="full" bg={colors.gr22} border="2px solid #fff" boxShadow="0 0 0 1px rgba(0,0,0,0.15)" />
      </Box>
      <Flex justify="space-between" pt="6px" px="2px">
        {['0시', '6시', '12시', '18시', '지금'].map((t) => <Text key={t} fontFamily={FONT} fontSize="10px" color={colors.gr92}>{t}</Text>)}
      </Flex>
    </Box>
  );
}

function Dashboard() {
  const [chartSel, setChartSel] = useState(0); // 0=오늘, 1=어제
  const todo: { k: 'cs' | 'box' | 'stock'; t: string; v: string; danger?: boolean }[] = [
    { k: 'cs', t: '미답변 CS 문의', v: '7건', danger: true },
    { k: 'box', t: '신규 주문 배송준비', v: '15건' },
    { k: 'stock', t: '재고 부족 임박', v: '3개' },
  ];
  const kpi: [string, string, string, string][] = [
    ['오늘 주문', '47', '건', '12건'],
    ['신규 회원', '23', '명', '8명'],
  ];
  const status: [string, string][] = [['입금확인', '8'], ['배송준비', '15'], ['배송중', '22'], ['배송완료', '112'], ['주문취소', '3']];
  const best: [string, string][] = [['리프드 머그컵', '12건'], ['코튼 토트백 블랙', '9건'], ['원목 도마&접시 세트', '6건']];
  const recent: [string, string, string, string][] = [
    ['#2563EB', 'WTE260521-00000010', '리프드 머그컵 외 2', '126,400원'],
    [WARN.accent, 'WTE260520-00000032', '코튼 토트백 블랙', '32,800원'],
    [colors.green, 'WTE260520-00000031', '원목 도마&접시 세트 외 3', '78,000원'],
    [colors.grB8, 'WTE260520-00000030', '향초 스칸디 그레이', '54,200원'],
    [colors.red, 'WTE260520-00000029', '리넨 쿠션 커버', '21,500원'],
  ];

  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      {/* 헤더(검정) — 로고 + 상점명 + 아이콘 */}
      <Box bg="#141414" px="20px" pt="4px" pb="18px">
        <Flex align="flex-start" justify="space-between">
          <Box>
            <FlexgLogo tone="light" h={18} />
            <Text fontFamily={FONT} fontSize="12px" color="rgba(255,255,255,0.7)" pt="9px">위드소프트</Text>
          </Box>
          <Flex gap="16px" pt="2px">
            <a href="/preview/notifications" style={{ display: 'inline-flex', cursor: 'pointer' }}><HeaderIcon k="bell" /></a>
          </Flex>
        </Flex>
      </Box>

      <Box px="16px" pt="18px" pb="26px">
        {/* 1. 지금 처리할 일 */}
        <Box data-doc-mark="todo" bg={WARN.bg} border={`1px solid ${WARN.border}`} borderRadius="14px" p="14px 16px" mb="20px">
          <Flex align="center" pb="12px">
            <Flex align="center" gap="6px">
              <TodoIcon k="stock" />
              <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.3px" color={WARN.accentDark}>지금 처리할 일</Text>
            </Flex>
            <Box flex="1" />
            <a href="/preview/todo-all" style={{ textDecoration: 'none' }}><Text as="span" fontFamily={FONT} fontSize="12px" color={WARN.accent} cursor="pointer">전체 →</Text></a>
          </Flex>
          <Flex direction="column" gap="10px">
            {todo.map((r) => (
              <Flex key={r.t} align="center" gap="8px">
                <TodoIcon k={r.k} />
                <Text fontFamily={FONT} fontSize="13px" color={colors.gr42}>{r.t}</Text>
                <Box flex="1" />
                <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={r.danger ? colors.red : colors.gr22}>{r.v}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* 2. 오늘 매출 */}
        <Box data-doc-mark="sales" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="18px">
          <Text fontFamily={FONT} fontSize="13px" color={colors.gr72}>오늘 매출</Text>
          <Flex align="flex-end" gap="3px" pt="4px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="28px" letterSpacing="-0.8px" color={colors.gr22} lineHeight="1">2,847,500</Text>
            <Text fontFamily={FONT} fontWeight="700" fontSize="16px" color={colors.gr22} pb="2px">원</Text>
          </Flex>
          <Flex align="center" gap="5px" pt="7px">
            <UpTri />
            <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.green}>18.4%</Text>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>전일 동시간 대비</Text>
          </Flex>
        </Box>

        {/* 3. 보조 KPI 2종 */}
        <Flex data-doc-mark="kpi" gap="10px" mb="20px">
          {kpi.map(([label, val, unit, delta]) => (
            <Box key={label} flex="1" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="14px 16px">
              <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} pb="8px">{label}</Text>
              <Flex align="flex-end" gap="2px">
                <Text fontFamily={FONT} fontWeight="800" fontSize="22px" letterSpacing="-0.6px" color={colors.gr22} lineHeight="1">{val}</Text>
                <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} pb="1px">{unit}</Text>
              </Flex>
              <Flex align="center" gap="3px" pt="7px">
                <UpTri />
                <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={colors.green}>{delta}</Text>
              </Flex>
            </Box>
          ))}
        </Flex>

        {/* 4. 주문 상태 5단계 */}
        <Box data-doc-mark="status" mb="20px">
          <HomeHead title="주문 상태" />
          <Flex gap="6px">
            {status.map(([l, v]) => {
              const danger = l === '주문취소';
              return (
                <Flex key={l} flex="1" direction="column" align="center" gap="4px" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="10px" py="11px">
                  <Text fontFamily={FONT} fontWeight="800" fontSize="16px" color={danger ? colors.red : colors.gr22} lineHeight="1">{v}</Text>
                  <Text fontFamily={FONT} fontSize="10px" letterSpacing="-0.3px" color={danger ? colors.red : colors.gr92} whiteSpace="nowrap">{l}</Text>
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* 5. 시간대별 매출 차트 */}
        <Box data-doc-mark="chart" mb="22px" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <Flex align="center" pb="8px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="15px" letterSpacing="-0.3px" color={colors.gr22}>시간대별 매출</Text>
            <Box flex="1" />
            <Flex bg={colors.grF2} borderRadius="8px" p="3px" gap="2px">
              {['오늘', '어제'].map((t, i) => (
                <Flex key={t} as="button" onClick={() => setChartSel(i)} px="12px" py="5px" borderRadius="6px" bg={i === chartSel ? colors.gr22 : 'transparent'} align="center" cursor="pointer">
                  <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={i === chartSel ? '#fff' : colors.gr92}>{t}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <SalesChart sel={chartSel} />
        </Box>

        {/* 6. 오늘 BEST Top 3 */}
        <Box data-doc-mark="best" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="20px">
          <HomeHead title="오늘 BEST" more href="/preview/best-all" />
          <Flex direction="column" gap="12px">
            {best.map(([name, cnt], i) => (
              <a key={name} href="/preview/product-detail" style={{ textDecoration: 'none', display: 'block' }}>
                <Flex align="center" gap="12px" cursor="pointer">
                  <Flex w="20px" h="20px" align="center" justify="center" borderRadius="6px" bg={i === 0 ? colors.gr22 : colors.grF2} flexShrink={0}>
                    <Text fontFamily={FONT} fontWeight="800" fontSize="11px" color={i === 0 ? '#fff' : colors.gr72}>{i + 1}</Text>
                  </Flex>
                  <Text fontFamily={FONT} fontSize="14px" color={colors.gr42} flex="1" minW="0" truncate>{name}</Text>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr22}>{cnt}</Text>
                </Flex>
              </a>
            ))}
          </Flex>
        </Box>

        {/* 7. 최근 주문 최대 5건 */}
        <Box data-doc-mark="recent" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <HomeHead title="최근 주문" more href="/preview/recent-all" />
          <Flex direction="column" gap="12px">
            {recent.map(([dot, no, name, amt]) => (
              <a key={no} href="/preview/order-detail" style={{ textDecoration: 'none', display: 'block' }}>
                <Flex align="center" gap="9px" cursor="pointer">
                  <Box w="7px" h="7px" borderRadius="full" bg={dot} flexShrink={0} />
                  <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} flexShrink={0}>{no}</Text>
                  <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} flex="1" minW="0" truncate>{name}</Text>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr22} flexShrink={0}>{amt}</Text>
                </Flex>
              </a>
            ))}
          </Flex>
        </Box>
      </Box>
    </PhoneShell>
  );
}

// ── 알림 카드 아이콘(경고/주문/안내) ──
function NotifIcon({ k }: { k: 'alert' | 'order' | 'info' }) {
  const map = { alert: { bg: '#FDECEC', fg: colors.red }, order: { bg: '#E9F0FE', fg: colors.blue }, info: { bg: colors.grF2, fg: colors.gr72 } }[k];
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: map.fg, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const icon = k === 'alert'
    ? <svg {...p}><path d="M12 4 3 19h18L12 4Z" /><path d="M12 10v4M12 17h.01" /></svg>
    : k === 'order'
      ? <svg {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v2.5H9z" /><path d="M8.5 11h7M8.5 14.5h5" /></svg>
      : <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></svg>;
  return <Flex w="34px" h="34px" borderRadius="10px" bg={map.bg} align="center" justify="center" flexShrink={0}>{icon}</Flex>;
}
function NotifCard({ item, readAll }: { item: { k: 'alert' | 'order' | 'info'; title: string; body: string; time: string; unread: boolean; link: string }; readAll: boolean }) {
  return (
    <a href={item.link} style={{ textDecoration: 'none', display: 'block' }}>
      <Box position="relative" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="14px" cursor="pointer">
        <Flex gap="12px" align="flex-start">
          <NotifIcon k={item.k} />
          <Box flex="1" minW="0" pr="12px">
            {/* 제목 행 — 우측에 시간(타이틀과 같은 높이) */}
            <Flex align="center" gap="8px">
              <Text fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.3px" color={colors.gr22} flex="1" minW="0" truncate>{item.title}</Text>
              {item.time && <Text fontFamily={FONT} fontSize="11px" color={colors.grB8} flexShrink={0}>{item.time}</Text>}
            </Flex>
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} pt="3px" lineHeight="1.4">{item.body}</Text>
          </Box>
        </Flex>
        {/* 미읽음 점 — 우측 상단 모서리(시간과 테두리 사이) */}
        {item.unread && !readAll && <Box position="absolute" top="14px" right="14px" w="7px" h="7px" borderRadius="full" bg={colors.blue} />}
      </Box>
    </a>
  );
}

function Notifications() {
  const [readAll, setReadAll] = useState(false);
  const today: { k: 'alert' | 'order' | 'info'; title: string; body: string; time: string; unread: boolean; link: string }[] = [
    { k: 'alert', title: '취소요청 급증', body: '최근 1시간 취소요청 3건 발생', time: '5분 전', unread: true, link: '/preview/order-list?status=주문취소' },
    { k: 'order', title: '신규 주문 #0241', body: '리프드 머그컵 외 2건 / 126,400원', time: '12분 전', unread: true, link: '/preview/order-detail' },
    { k: 'order', title: '주문 #0240 결제 완료', body: '코튼 토트백 블랙 / 32,800원', time: '1시간 전', unread: false, link: '/preview/order-detail' },
  ];
  const yest: { k: 'alert' | 'order' | 'info'; title: string; body: string; time: string; unread: boolean; link: string }[] = [
    { k: 'info', title: '시스템 점검 안내', body: '05/15 02:00~03:00 점검 예정', time: '어제', unread: false, link: '/preview/notice-detail' },
  ];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      {/* 헤더(검정) — 뒤로가기 + 알림 + 모두 읽음 */}
      <Box bg="#141414" px="14px" pt="2px" pb="14px">
        <Flex align="center" h="44px">
          <BackArrow onClick={() => window.history.back()} />
          <Text flex="1" textAlign="center" fontFamily={FONT} fontWeight="800" fontSize="17px" letterSpacing="-0.4px" color="#fff">알림</Text>
          <Text data-doc-mark="readall" as="button" onClick={() => setReadAll(true)} fontFamily={FONT} fontSize="13px" color="rgba(255,255,255,0.75)" cursor="pointer" pr="6px">모두 읽음</Text>
        </Flex>
      </Box>

      <Box px="16px" pt="18px" pb="26px">
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr92} pb="10px">오늘</Text>
        <Flex data-doc-mark="list" direction="column" gap="10px" pb="22px">
          {today.map((it) => <NotifCard key={it.title} item={it} readAll={readAll} />)}
        </Flex>
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr92} pb="10px">어제</Text>
        <Flex direction="column" gap="10px">
          {yest.map((it) => <NotifCard key={it.title} item={it} readAll={readAll} />)}
        </Flex>
      </Box>
    </PhoneShell>
  );
}

// M_HOME_P006 — 공지 상세(알림의 공지/시스템 안내 진입)
function NoticeDetail() {
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      <AppTopBar title="공지" />
      <Box px="16px" pt="16px" pb="26px">
        <Box data-doc-mark="notice" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="18px">
          <Flex align="center" gap="8px" pb="12px">
            <Flex bg={colors.grF2} borderRadius="6px" px="8px" py="2px"><Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={colors.gr72}>시스템</Text></Flex>
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>2026-05-14</Text>
          </Flex>
          <Text fontFamily={FONT} fontWeight="800" fontSize="17px" color={colors.gr22} pb="14px">시스템 점검 안내</Text>
          <Text fontFamily={FONT} fontSize="14px" color={colors.gr42} lineHeight="1.75" whiteSpace="pre-line">{'안녕하세요, FLEXG입니다.\n보다 안정적인 서비스 제공을 위해 아래 일정으로 시스템 점검을 진행합니다.\n\n· 점검 일시 : 2026-05-15 02:00 ~ 03:00\n· 점검 내용 : 서버 안정화 및 기능 개선\n\n점검 시간 동안 앱 이용이 일시 중단될 수 있습니다. 이용에 참고 부탁드립니다.'}</Text>
        </Box>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_HOME_P003 처리할 일 전체 / P004 오늘 BEST 전체 / P005 최근 주문 전체
//  (대시보드 각 카드의 "전체 →" 목적지 · 상품/주문 데이터는 예시)
//  ※ 리스트·카드는 모바일 표준 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
// ============================================================

// M_HOME_P003 — 처리할 일 전체
function TodoAll() {
  const groups: { mark: string; k: 'cs' | 'box' | 'stock'; label: string; count: string; danger?: boolean; rows: [string, string][] }[] = [
    { mark: 'cs', k: 'cs', label: '미답변 CS 문의', count: '7건', danger: true, rows: [
      ['#0241 배송 언제 도착하나요?', '12분 전'], ['#0238 사이즈 교환 가능한가요?', '1시간 전'], ['#0235 색상 문의드립니다', '3시간 전'],
    ] },
    { mark: 'ship', k: 'box', label: '신규 주문 배송준비', count: '15건', rows: [
      ['#0240 코튼 토트백 블랙', '32,800원'], ['#0237 원목 도마&접시 세트 외 3', '78,000원'], ['#0233 리넨 쿠션 커버 외 1', '43,000원'],
    ] },
    { mark: 'stock', k: 'stock', label: '재고 부족 임박', count: '3개', rows: [
      ['리프드 머그컵', '재고 8'], ['향초 스칸디 그레이', '재고 5'], ['라탄 미니 트레이', '재고 2'],
    ] },
  ];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      <AppTopBar title="처리할 일" />
      <Box px="16px" pt="18px" pb="26px">
        <Flex direction="column" gap="14px">
          {groups.map((g) => (
            <Box key={g.mark} data-doc-mark={g.mark} bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
              <Flex align="center" gap="6px" pb="12px">
                <TodoIcon k={g.k} />
                <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22}>{g.label}</Text>
                <Box flex="1" />
                <Text fontFamily={FONT} fontWeight="800" fontSize="13px" color={g.danger ? colors.red : WARN.accentDark}>{g.count}</Text>
              </Flex>
              <Flex direction="column" gap="11px">
                {g.rows.map(([t, s]) => (
                  <Flex key={t} align="center" gap="10px">
                    <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} flex="1" minW="0" truncate>{t}</Text>
                    <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr72} flexShrink={0}>{s}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </PhoneShell>
  );
}

// M_HOME_P004 — 오늘 BEST 전체
function BestAll() {
  const items: [string, string, string][] = [
    ['리프드 머그컵', '1,516,800원', '12건'],
    ['코튼 토트백 블랙', '295,200원', '9건'],
    ['원목 도마&접시 세트', '468,000원', '6건'],
    ['향초 스칸디 그레이', '271,000원', '5건'],
    ['리넨 쿠션 커버', '107,500원', '5건'],
    ['라탄 미니 트레이', '76,000원', '4건'],
    ['세라믹 화병 아이보리', '114,000원', '3건'],
    ['오크 원목 코스터 4P', '54,000원', '3건'],
    ['무지 린넨 앞치마', '43,600원', '2건'],
    ['골드 커트러리 세트', '98,000원', '2건'],
  ];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      <AppTopBar title="오늘 BEST" />
      <Box px="16px" pt="18px" pb="26px">
        <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} pb="12px">오늘 09:00 기준 · 판매 건수순</Text>
        <Box data-doc-mark="rank" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <Flex direction="column" gap="14px">
            {items.map(([name, amt, cnt], i) => (
              <a key={name} href="/preview/product-detail" style={{ textDecoration: 'none', display: 'block' }}>
                <Flex align="center" gap="12px" cursor="pointer">
                  <RankBadge n={i + 1} />
                  <Box w="44px" h="44px" borderRadius="10px" bg={colors.grF2} flexShrink={0} />
                  <Box flex="1" minW="0">
                    <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr22} truncate>{name}</Text>
                    <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} pt="2px">{amt}</Text>
                  </Box>
                  <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} flexShrink={0}>{cnt}</Text>
                </Flex>
              </a>
            ))}
          </Flex>
        </Box>
      </Box>
    </PhoneShell>
  );
}

// M_HOME_P005 — 최근 주문 전체
function RecentAll() {
  const orders: [string, string, string, string, string][] = [
    ['입금확인', 'WTE260521-00000010', '리프드 머그컵 외 2', '126,400원', '14:48'],
    ['배송준비', 'WTE260520-00000032', '코튼 토트백 블랙', '32,800원', '13:18'],
    ['배송중', 'WTE260520-00000031', '원목 도마&접시 세트 외 3', '78,000원', '11:45'],
    ['주문취소', 'WTE260520-00000030', '향초 스칸디 그레이', '54,200원', '10:22'],
    ['배송완료', 'WTE260520-00000029', '리넨 쿠션 커버', '21,500원', '10:22'],
    ['배송완료', 'WTE260519-00000028', '라탄 미니 트레이 외 1', '58,000원', '09:40'],
    ['배송중', 'WTE260519-00000027', '세라믹 화병 아이보리', '38,000원', '09:02'],
    ['배송준비', 'WTE260519-00000026', '오크 원목 코스터 4P', '18,000원', '08:31'],
    ['입금확인', 'WTE260518-00000025', '무지 린넨 앞치마', '21,800원', '21:14'],
    ['배송완료', 'WTE260518-00000024', '골드 커트러리 세트', '49,000원', '19:53'],
  ];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="home" />}>
      <AppTopBar title="최근 주문" />
      <Box px="16px" pt="18px" pb="26px">
        <Flex data-doc-mark="list" direction="column" gap="10px">
          {orders.map(([st, no, name, amt, time]) => (
            <a key={no} href="/preview/order-detail" style={{ textDecoration: 'none', display: 'block' }}>
              <Box bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="14px" cursor="pointer">
                <Flex align="center" gap="8px" pb="9px">
                  <StatusBadge s={st} />
                  <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>{no}</Text>
                  <Box flex="1" />
                  <Text fontFamily={FONT} fontSize="11px" color={colors.grB8}>{time}</Text>
                </Flex>
                <Flex align="center" gap="8px">
                  <Text fontFamily={FONT} fontSize="14px" color={colors.gr42} flex="1" minW="0" truncate>{name}</Text>
                  <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} flexShrink={0}>{amt}</Text>
                </Flex>
              </Box>
            </a>
          ))}
        </Flex>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_ORDR_P001 주문 목록 / M_ORDR_P002 주문 상세
//  ※ 리스트·상세 KV표는 모바일 표준 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
// ============================================================

// 가로 스크롤 컨테이너 — 스크롤바 숨김 + 마우스/터치 드래그로 좌우 이동(데스크톱 클릭-드래그 지원).
// 드래그로 스크롤한 경우 자식(탭)의 클릭은 무시해 오클릭 방지.
function HScroll({ children, mark, px = '16px', pb }: { children: React.ReactNode; mark?: string; px?: string; pb?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef({ down: false, x: 0, left: 0, moved: false });
  return (
    <Box
      ref={ref}
      data-doc-mark={mark}
      overflowX="auto"
      px={px}
      pb={pb}
      css={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' }, touchAction: 'pan-x', cursor: 'grab' }}
      onPointerDown={(e) => { const el = ref.current; if (!el) return; st.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false }; }}
      onPointerMove={(e) => { const el = ref.current; if (!el || !st.current.down) return; const dx = e.clientX - st.current.x; if (Math.abs(dx) > 4) st.current.moved = true; el.scrollLeft = st.current.left - dx; }}
      onPointerUp={() => { st.current.down = false; }}
      onPointerCancel={() => { st.current.down = false; }}
      onClickCapture={(e) => { if (st.current.moved) { e.stopPropagation(); e.preventDefault(); st.current.moved = false; } }}
    >
      {children}
    </Box>
  );
}

// 주문 카드(목록) — 상태 뱃지 + 주문번호/시각 + 상품/금액 + 주문자/결제수단 + 상세보기
function OrderCard({ st, no, time, name, amt, buyer, pay }: { st: string; no: string; time: string; name: string; amt: string; buyer: string; pay: string }) {
  return (
    <Box bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="14px">
      <Flex align="center" gap="8px" pb="10px">
        <StatusBadge s={st} />
        <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>{no}</Text>
        <Box flex="1" />
        <Text fontFamily={FONT} fontSize="11px" color={colors.grB8}>{time}</Text>
      </Flex>
      <Flex align="center" gap="8px" pb="10px">
        <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr22} flex="1" minW="0" truncate>{name}</Text>
        <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} flexShrink={0}>{amt}</Text>
      </Flex>
      <Flex align="center" gap="8px" pb="12px">
        <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>{buyer}</Text>
        <Box w="1px" h="10px" bg={colors.grD8} />
        <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>{pay}</Text>
      </Flex>
      <a href="/preview/order-detail" style={{ textDecoration: 'none' }}>
        <Flex h="40px" border={`1px solid ${colors.grE8}`} borderRadius="9px" align="center" justify="center" cursor="pointer">
          <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr72}>상세보기</Text>
        </Flex>
      </a>
    </Box>
  );
}

function OrderList() {
  const tabs: [string, string][] = [['전체', '122'], ['입금확인', '8'], ['배송준비', '15'], ['배송중', '22'], ['주문취소', '3'], ['배송완료', '112']];
  // 딥링크(?status=주문취소 등) — 해당 상태 탭 선택 + 뒤로가기 버튼 노출
  const paramIdx = tabs.findIndex(([l]) => l === new URLSearchParams(window.location.search).get('status'));
  const [tab, setTab] = useState(paramIdx >= 0 ? paramIdx : 0);
  const showBack = paramIdx >= 0;
  const [dateOpen, setDateOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState('2026.05.20 (수)');
  const ORDER_SORT = ['최신순', '과거순', '금액 높은순', '금액 낮은순'];
  const [sortSel, setSortSel] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const orders: { st: string; no: string; time: string; name: string; amt: string; buyer: string; pay: string }[] = [
    { st: '입금확인', no: 'WTE260521-00000010', time: '14:48', name: '리프드 머그컵 외 2', amt: '126,400원', buyer: '김*서 · 010-****-7821', pay: '무통장입금' },
    { st: '배송준비', no: 'WTE260520-00000032', time: '13:18', name: '코튼 토트백 블랙', amt: '32,800원', buyer: '박*훈 · 010-****-3456', pay: '카드결제' },
    { st: '배송중', no: 'WTE260520-00000031', time: '11:45', name: '원목 도마&접시 세트 외 3', amt: '126,400원', buyer: '이*영 · 010-****-9012', pay: '카드결제' },
    { st: '주문취소', no: 'WTE260520-00000030', time: '10:22', name: '향초 스칸디 그레이', amt: '54,200원', buyer: '김*욱 · 010-****-4537', pay: '카드결제' },
    { st: '배송완료', no: 'WTE260520-00000029', time: '10:22', name: '리넨 쿠션 커버', amt: '21,500원', buyer: '박*우 · 010-****-5445', pay: '무통장입금' },
    { st: '배송완료', no: 'WTE260519-00000028', time: '09:40', name: '라탄 미니 트레이 외 1', amt: '58,000원', buyer: '최*라 · 010-****-2210', pay: '카드결제' },
    { st: '배송중', no: 'WTE260519-00000027', time: '09:02', name: '세라믹 화병 아이보리', amt: '38,000원', buyer: '정*훈 · 010-****-8845', pay: '카드결제' },
    { st: '배송준비', no: 'WTE260519-00000026', time: '08:31', name: '오크 원목 코스터 4P', amt: '18,000원', buyer: '유*하 · 010-****-3390', pay: '무통장입금' },
    { st: '입금확인', no: 'WTE260518-00000025', time: '21:14', name: '무지 린넨 앞치마', amt: '21,800원', buyer: '한*지 · 010-****-6677', pay: '무통장입금' },
  ];
  const activeLabel = tabs[tab][0];
  const filtered = activeLabel === '전체' ? orders : orders.filter((o) => o.st === activeLabel);
  const amtNum = (s: string) => parseInt(s.replace(/[^\d]/g, ''), 10);
  const shown = [...filtered].sort((a, b) =>
    sortSel === 0 ? b.no.localeCompare(a.no) : sortSel === 1 ? a.no.localeCompare(b.no) : sortSel === 2 ? amtNum(b.amt) - amtNum(a.amt) : amtNum(a.amt) - amtNum(b.amt));
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="order" />}>
      {/* 헤더(검정) — 주문 + 날짜 + 캘린더 */}
      <Box bg="#141414" px="16px" pt="4px" pb="16px">
        <Flex align="center" gap="10px">
          {showBack && <BackArrow onClick={() => window.history.back()} />}
          <Box>
            <Text fontFamily={FONT} fontWeight="800" fontSize="20px" letterSpacing="-0.4px" color="#fff">주문</Text>
            <Text fontFamily={FONT} fontSize="12px" color="rgba(255,255,255,0.7)" pt="6px">{dateLabel}</Text>
          </Box>
          <Box flex="1" />
          <Box as="button" onClick={() => setDateOpen(true)} cursor="pointer"><HeaderIcon k="calendar" /></Box>
        </Flex>
      </Box>

      <Box pt="16px" pb="26px">
        {/* 상태 탭(한 줄 · 스크롤바 숨김 · 마우스/터치 드래그 스크롤 · 좌우 여백 16px = 리스트와 일치) */}
        <HScroll mark="tabs" pb="16px">
          <Flex gap="8px" w="max-content">
            {tabs.map(([l, c], i) => {
              const on = i === tab;
              return (
                <Flex key={l} as="button" onClick={() => setTab(i)} align="center" gap="5px" h="34px" px="14px" borderRadius="999px" flexShrink={0} cursor="pointer"
                  bg={on ? colors.gr22 : '#fff'} border={on ? 'none' : `1px solid ${colors.grE8}`}>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={on ? '#fff' : colors.gr72}>{l}</Text>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={on ? 'rgba(255,255,255,0.7)' : colors.grB8}>{c}</Text>
                </Flex>
              );
            })}
          </Flex>
        </HScroll>

        <Box px="16px">
          {/* 요약 */}
          <Flex data-doc-mark="summary" gap="10px" mb="18px">
            {[['총 주문', '160건'], ['합계 금액', '8,420,300원']].map(([l, v]) => (
              <Box key={l} flex="1" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="14px 16px">
                <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} pb="6px">{l}</Text>
                <Text fontFamily={FONT} fontWeight="800" fontSize="18px" letterSpacing="-0.5px" color={colors.gr22}>{v}</Text>
              </Box>
            ))}
          </Flex>

          {/* 정렬 */}
          <Flex data-doc-mark="sort" align="center" pb="12px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22}>주문 목록</Text>
            <Box flex="1" />
            <Flex as="button" onClick={() => setSortOpen(true)} align="center" gap="2px" cursor="pointer">
              <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>{ORDER_SORT[sortSel]}</Text>
              <Chevron dir="down" s={16} color={colors.gr72} />
            </Flex>
          </Flex>

          {/* 목록 — 선택 상태만 노출 */}
          <Flex data-doc-mark="list" direction="column" gap="12px">
            {shown.length > 0
              ? shown.map((o) => <OrderCard key={o.no} {...o} />)
              : <Text fontFamily={FONT} fontSize="13px" color={colors.gr92} textAlign="center" py="40px">해당 상태의 주문이 없습니다.</Text>}
          </Flex>
        </Box>
      </Box>
      {dateOpen && (
        <SheetPortal onClose={() => setDateOpen(false)}>
          <DatePickerSheet onApply={(l) => { setDateLabel(l); setDateOpen(false); }} />
        </SheetPortal>
      )}
      {sortOpen && (
        <SheetPortal onClose={() => setSortOpen(false)}>
          <SortSheet options={ORDER_SORT} sel={sortSel} onApply={(i) => { setSortSel(i); setSortOpen(false); }} />
        </SheetPortal>
      )}
    </PhoneShell>
  );
}

// 상세 섹션 카드(제목 + 선택 우측 액션 + 본문)
function DSection({ title, mark, action, children }: { title: string; mark?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box data-doc-mark={mark} bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
      <Flex align="center" pb="12px">
        <Text fontFamily={FONT} fontWeight="800" fontSize="15px" letterSpacing="-0.3px" color={colors.gr22}>{title}</Text>
        <Box flex="1" />
        {action}
      </Flex>
      {children}
    </Box>
  );
}
// 라벨-값 행 — 값 우측 정렬, 긴 값은 줄바꿈
function KVRow({ l, v, tone, strong }: { l: string; v: string; tone?: 'red' | 'green'; strong?: boolean }) {
  const col = tone === 'red' ? colors.red : tone === 'green' ? '#1E8F1B' : colors.gr42;
  return (
    <Flex align="flex-start" justify="space-between" gap="16px" py="5px">
      <Text fontFamily={FONT} fontSize="13px" color={colors.gr72} flexShrink={0}>{l}</Text>
      <Text fontFamily={FONT} fontWeight={strong ? '800' : '600'} fontSize="13px" color={col} textAlign="right" lineHeight="1.5">{v}</Text>
    </Flex>
  );
}
const HRule = () => <Box h="1px" bg={colors.grF2} my="10px" />;

function OrderDetail() {
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="order" />}>
      <AppTopBar title="주문 상세" />
      <Box px="16px" pt="16px" pb="26px">
        {/* 주문 상품 */}
        <Box data-doc-mark="product" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
          <Flex align="center" pb="10px">
            <StatusBadge s="입금확인" />
            <Box flex="1" />
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>2026.05.21 14:48</Text>
          </Flex>
          <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} pb="14px">WTE260521-00000010</Text>
          <Box borderTop={`1px solid ${colors.grF2}`} pt="14px">
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} pb="12px">주문 상품 · 총 1건</Text>
            <Flex gap="12px" pb="14px">
              <Box w="56px" h="56px" borderRadius="10px" bg={colors.grF2} flexShrink={0} />
              <Box flex="1" minW="0">
                <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr22}>체리 크롬 테리 후드 집업</Text>
                <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} pt="3px">스카이</Text>
                <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pt="3px">부가세: 과세 · STE41701394</Text>
              </Box>
            </Flex>
            <Box borderTop={`1px solid ${colors.grF2}`} pt="12px">
              <KVRow l="주문 상품" v="2개" />
              <KVRow l="상품금액" v="40,000원" />
              <KVRow l="할인 적용" v="-10,000원" tone="red" />
              <KVRow l="결제금액" v="30,000원" strong />
            </Box>
          </Box>
        </Box>

        {/* 결제 정보 */}
        <DSection title="결제 정보" mark="payment">
          <KVRow l="결제수단" v="무통장" />
          <KVRow l="결제여부" v="입금완료" tone="green" />
          <KVRow l="입금처리" v="2026-05-21 14:48:37" />
          <KVRow l="입금자명" v="김민서" />
          <KVRow l="입금계좌" v="신한 110-424-254234" />
          <KVRow l="현금영수증" v="미신청" />
        </DSection>

        {/* 결제 금액 */}
        <DSection title="결제 금액" mark="amount">
          <KVRow l="총 상품 금액" v="40,000원" />
          <KVRow l="배송비" v="0원" />
          <KVRow l="도서산간" v="0원" />
          <KVRow l="쿠폰 할인" v="0원" />
          <KVRow l="할인코드" v="-10,000원" tone="red" />
          <KVRow l="포인트 / 즉시 / APP 할인" v="0원" />
          <Box borderTop={`1px solid ${colors.grF2}`} mt="8px" pt="8px">
            <KVRow l="최종 결제 금액" v="30,000원" strong />
          </Box>
        </DSection>

        {/* 주문 정보 */}
        <DSection title="주문 정보" mark="orderinfo"
          action={<Text as="button" fontFamily={FONT} fontSize="12px" fontWeight="700" color={colors.gr72} cursor="pointer">자세히 보기</Text>}>
          <KVRow l="주문번호" v="WTE260521-00000010" />
          <KVRow l="주문일시" v="2026-05-21 14:48:37" />
          <KVRow l="주문상태" v="입금확인" />
          <KVRow l="선물상태" v="-" />
        </DSection>

        {/* 주문자 및 배송지 */}
        <DSection title="주문자 및 배송지" mark="delivery">
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr42} pb="4px">주문자</Text>
          <KVRow l="이름" v="김민서 (등급 할인 1%)" />
          <KVRow l="연락처" v="010-4567-7821" />
          <HRule />
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr42} pb="4px">수령인</Text>
          <KVRow l="이름" v="강문구" />
          <KVRow l="연락처" v="010-5922-8637" />
          <KVRow l="배송지" v="(08594) 서울 금천구 가산디지털1로 5 (가산동, 대륭테크노타운 20차) 456" />
          <KVRow l="배송 요청사항" v="배송 전 연락주세요." />
          <KVRow l="택배사 / 송장번호" v="미등록" />
        </DSection>

        {/* CS · 주문취소/반품/교환 요청 */}
        <DSection title="CS · 주문취소 / 반품 / 교환 요청" mark="cs">
          <KVRow l="주문자 요청" v="반품 요청" tone="red" />
          <KVRow l="요청일" v="2026-04-16 10:38:11" />
          <KVRow l="처리상태" v="처리완료" />
          <KVRow l="사유" v="상품에 결함이 있음" />
          <KVRow l="취소내용" v="결함이 있어서 반품하고 싶어요" />
          <KVRow l="환불 계좌번호" v="신한은행 110366267349000 (예금주 김민서)" />
          <KVRow l="회수 주소" v="(08594) 서울 금천구 가산디지털1로 5 (가산동, 대륭테크노타운 20차) 456" />
          <KVRow l="첨부 사진" v="확인하기" />
          <Box bg={colors.grF8} borderRadius="10px" p="12px 14px" mt="10px">
            <KVRow l="상품명" v="체리 크롬 테리 후드 집업" />
            <KVRow l="옵션" v="스카이" />
            <KVRow l="추가상품여부" v="-" />
            <KVRow l="주문수량" v="2" />
            <KVRow l="반품 / 교환요청 수량" v="1" />
          </Box>
        </DSection>

        {/* CS · 부분취소 내역 */}
        <DSection title="CS · 부분취소 내역" mark="partial">
          <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} textAlign="center" py="12px">부분취소 처리 내역이 없습니다.</Text>
        </DSection>

        {/* CS · 반품/교환 사진 요청 리스트 */}
        <DSection title="CS · 반품 / 교환 사진 요청 리스트" mark="photos">
          <Text fontFamily={FONT} fontSize="12px" color={colors.gr92} textAlign="center" py="12px">반품 / 교환 사진 요청 내역이 없습니다.</Text>
        </DSection>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_STAT_P001~P009 통계 (허브 + 매출현황 + 분류별 7종) + 바텀시트(상세/필터)
//  ※ 차트·리스트·바텀시트는 모바일 표준 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
//  데이터는 예시(임의 생성)
// ============================================================
const won = (n: number) => Math.round(n).toLocaleString('en-US') + '원';
function stdDetail(s: number): [string, string, boolean?][] {
  return [
    ['상품금액', won(s * 1.15)],
    ['할인금액', won(s * 0.09)],
    ['결제금액', won(s)],
    ['결제건수', Math.round(s / 40000).toLocaleString('en-US')],
    ['취소금액(부분취소)', won(s * 0.04)],
    ['정산금액', won(s * 0.97), true],
    ['공급가액', won(s * 0.72)],
    ['PG수수료', won(s * 0.03)],
    ['판매이익', won(s * 0.17), true],
  ];
}

// 통계 허브 카테고리 아이콘
function StatCatIcon({ k }: { k: string }) {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: colors.gr42, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (k) {
    case 'sales': return <svg {...p}><path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6" /></svg>;
    case 'channel': return <svg {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>;
    case 'signup': return <svg {...p}><circle cx="9" cy="8" r="3.2" /><path d="M4 19a5 5 0 0 1 10 0M17 8v6M14 11h6" /></svg>;
    case 'inflow': return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" /></svg>;
    case 'product': return <svg {...p}><path d="M6.5 8h11l-1 11.2A1.5 1.5 0 0 1 15 20.5H9A1.5 1.5 0 0 1 7.5 19.2L6.5 8Z" /><path d="M9.2 9V7.2a2.8 2.8 0 0 1 5.6 0V9" /></svg>;
    case 'option': return <svg {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>;
    case 'staff': return <svg {...p}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>;
    default: return <svg {...p}><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /></svg>;
  }
}
function FilterIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" /></svg>;
}
function StatHeader({ title, onFilter }: { title: string; onFilter?: () => void }) {
  return <AppTopBar title={title} right={onFilter ? <Box as="button" onClick={onFilter} cursor="pointer"><FilterIcon /></Box> : undefined} />;
}
// 기간 필터 칩 — 클릭 시 Date Picker 바텀시트
function DateChip() {
  const [label, setLabel] = useState('2025.07.01 ~ 2025.07.31');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Flex as="button" onClick={() => setOpen(true)} align="center" gap="8px" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="10px" px="14px" py="10px" mb="16px" w="fit-content" cursor="pointer">
        <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>기간</Text>
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr42}>{label}</Text>
        <Chevron dir="down" s={14} color={colors.gr92} />
      </Flex>
      {open && (
        <SheetPortal onClose={() => setOpen(false)}>
          <DatePickerSheet onApply={(l) => { setLabel(l); setOpen(false); }} />
        </SheetPortal>
      )}
    </>
  );
}
function StatSummary({ rows, mark }: { rows: [string, string, boolean?, ('red' | 'green')?][]; mark?: string }) {
  return (
    <Box data-doc-mark={mark} bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="16px">
      <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} pb="8px">매출 요약</Text>
      {rows.map(([l, v, strong, tone], i) => <KVRow key={i} l={l} v={v} strong={strong} tone={tone} />)}
    </Box>
  );
}
function RankRow({ n, name, value, onClick }: { n: number; name: string; value: string; onClick?: () => void }) {
  return (
    <Flex as="button" onClick={onClick} align="center" gap="12px" w="100%" py="11px" textAlign="left" cursor={onClick ? 'pointer' : 'default'} borderBottom={`1px solid ${colors.grF2}`}>
      <RankBadge n={n} />
      <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} flex="1" minW="0" truncate>{name}</Text>
      <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr22} flexShrink={0}>{value}</Text>
      {onClick && <Chevron dir="right" s={16} color={colors.grB8} />}
    </Flex>
  );
}
function DonutChart({ segs }: { segs: [string, number, string][] }) {
  const R = 42, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <Flex align="center" gap="22px">
      <svg width="116" height="116" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
        <g transform="rotate(-90 60 60)">
          {segs.map((seg, i) => {
            const pct = seg[1], color = seg[2], len = (pct / 100) * C;
            const el = <circle key={i} cx="60" cy="60" r={R} fill="none" stroke={color} strokeWidth="17" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />;
            off += len;
            return el;
          })}
        </g>
      </svg>
      <Flex direction="column" gap="9px" flex="1">
        {segs.map((seg, i) => (
          <Flex key={i} align="center" gap="8px">
            <Box w="10px" h="10px" borderRadius="3px" bg={seg[2]} flexShrink={0} />
            <Text fontFamily={FONT} fontSize="12px" color={colors.gr72} flex="1">{seg[0]}</Text>
            <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr22}>{seg[1]}%</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <Box pb="12px">
      <Flex justify="space-between" pb="6px">
        <Text fontFamily={FONT} fontSize="12px" color={colors.gr72}>{label}</Text>
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr22}>{value}</Text>
      </Flex>
      <Box h="8px" borderRadius="4px" bg={colors.grF2} overflow="hidden">
        <Box h="100%" w={`${pct}%`} bg={color} borderRadius="4px" />
      </Box>
    </Box>
  );
}

// ── 바텀시트 카드 ──
function SheetShell({ children }: { children: React.ReactNode }) {
  return (
    <Box bg="#fff" borderTopRadius="22px" boxShadow="0 -8px 24px rgba(0,0,0,0.18)" overflow="hidden">
      <Flex justify="center" pt="10px" pb="2px"><Box w="40px" h="4px" borderRadius="999px" bg={colors.grD8} /></Flex>
      {children}
    </Box>
  );
}
function DetailSheetCard({ name, rows, onClose, mark }: { name: string; rows: [string, string, boolean?][]; onClose?: () => void; mark?: string }) {
  return (
    <SheetShell>
      <Box data-doc-mark={mark} px="20px" pt="8px" pb="20px">
        <Text fontFamily={FONT} fontWeight="800" fontSize="16px" color={colors.gr22} pb="12px">{name}</Text>
        <Box>{rows.map(([l, v, strong], i) => <KVRow key={i} l={l} v={v} strong={strong} tone={l === '판매이익' ? 'green' : undefined} />)}</Box>
        <Box pt="16px"><AppButton label="확인" tone="dark" onClick={onClose} h="46px" radius="10px" /></Box>
      </Box>
    </SheetShell>
  );
}
function CheckBox({ on }: { on: boolean }) {
  return (
    <Flex w="18px" h="18px" borderRadius="5px" align="center" justify="center" flexShrink={0} bg={on ? colors.blue : '#fff'} border={on ? 'none' : `1.5px solid ${colors.grD8}`}>
      {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>}
    </Flex>
  );
}
// 필터 바텀시트 — 체크박스 선택/해제 가능
function FilterSheetCard({ groups, onClose, mark }: { groups: { title: string; opts: string[]; checked: string[] }[]; onClose?: () => void; mark?: string }) {
  const [state, setState] = useState<Set<string>[]>(() => groups.map((g) => new Set(g.checked)));
  const toggle = (gi: number, opt: string) => setState((prev) => prev.map((s, i) => {
    if (i !== gi) return s;
    const g = groups[i];
    // '전체' 클릭 → 그룹 전체 선택/해제
    if (opt === '전체') return s.has('전체') ? new Set<string>() : new Set(g.opts);
    const ns = new Set(s);
    if (ns.has(opt)) ns.delete(opt); else ns.add(opt);
    // 개별 항목이 모두 선택되면 '전체'도 체크, 아니면 해제
    const others = g.opts.filter((o) => o !== '전체');
    if (others.every((o) => ns.has(o))) ns.add('전체'); else ns.delete('전체');
    return ns;
  }));
  const reset = () => setState(groups.map(() => new Set<string>()));
  return (
    <SheetShell>
      <Box data-doc-mark={mark}>
        <Flex align="center" px="20px" pt="8px" pb="12px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="18px" color={colors.gr22}>필터</Text>
          <Box flex="1" />
          <Text as="button" onClick={reset} fontFamily={FONT} fontSize="13px" color={colors.gr92} cursor="pointer">초기화</Text>
        </Flex>
        <Box px="20px" pb="12px" maxH="340px" overflowY="auto">
          {groups.map((g, gi) => (
            <Box key={g.title} pb="14px">
              <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr92} pb="10px">{g.title}</Text>
              <Flex wrap="wrap">
                {g.opts.map((o) => (
                  <Flex key={o} as="button" onClick={() => toggle(gi, o)} w="50%" align="center" gap="8px" pb="11px" cursor="pointer" textAlign="left">
                    <CheckBox on={state[gi].has(o)} />
                    <Text fontFamily={FONT} fontSize="13px" color={colors.gr42}>{o}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          ))}
        </Box>
        <Flex gap="8px" px="20px" pt="12px" pb="20px" borderTop={`1px solid ${colors.grF2}`}>
          <AppButton label="취소" tone="gray" flex="1" onClick={onClose} h="46px" radius="10px" />
          <AppButton label="적용" tone="dark" flex="1" onClick={onClose} h="46px" radius="10px" />
        </Flex>
      </Box>
    </SheetShell>
  );
}
// Date Picker 바텀시트 — 프리셋 칩 + 월 칩 + 월 캘린더(범위 하이라이트)
function DPChip({ label, on, onClick, flex }: { label: string; on: boolean; onClick: () => void; flex?: string }) {
  return (
    <Flex as="button" onClick={onClick} flex={flex} align="center" justify="center" h="32px" px="6px" borderRadius="8px" cursor="pointer"
      bg={on ? colors.gr22 : '#fff'} border={on ? 'none' : `1px solid ${colors.grE8}`}>
      <Text fontFamily={FONT} fontWeight={on ? '700' : '500'} fontSize="12px" color={on ? '#fff' : colors.gr42} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}
const dkey = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const fmtDate = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
// 프리셋/월 라벨 → [시작일, 종료일] (기준일 = 2025-07-31)
function rangeForPreset(label: string): [Date, Date] {
  const Y = 2025;
  if (/^\d+월$/.test(label)) { const m = parseInt(label, 10) - 1; return [new Date(Y, m, 1), new Date(Y, m + 1, 0)]; }
  switch (label) {
    case '오늘': return [new Date(Y, 6, 31), new Date(Y, 6, 31)];
    case '어제': return [new Date(Y, 6, 30), new Date(Y, 6, 30)];
    case '주간': { const s = new Date(Y, 6, 31); s.setDate(s.getDate() - s.getDay()); const e = new Date(s); e.setDate(s.getDate() + 6); return [s, e]; }
    case '당월': return [new Date(Y, 6, 1), new Date(Y, 6, 31)];
    case '전월': return [new Date(Y, 5, 1), new Date(Y, 5, 30)];
    case '올해': return [new Date(Y, 0, 1), new Date(Y, 11, 31)];
    case '1분기': return [new Date(Y, 0, 1), new Date(Y, 2, 31)];
    case '2분기': return [new Date(Y, 3, 1), new Date(Y, 5, 30)];
    case '3분기': return [new Date(Y, 6, 1), new Date(Y, 8, 30)];
    case '4분기': return [new Date(Y, 9, 1), new Date(Y, 11, 31)];
    case '상반기': return [new Date(Y, 0, 1), new Date(Y, 5, 30)];
    case '하반기': return [new Date(Y, 6, 1), new Date(Y, 11, 31)];
    default: return [new Date(Y, 6, 1), new Date(Y, 6, 31)];
  }
}
function DayGrid({ year, month, sKey, eKey, onPick }: { year: number; month: number; sKey: number; eKey: number; onPick: (d: Date) => void }) {
  const first = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const prevDays = new Date(year, month - 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const dn = i - first + 1;
    const inMonth = dn >= 1 && dn <= days;
    const label = dn < 1 ? prevDays + dn : dn > days ? dn - days : dn;
    return { dn, inMonth, label };
  });
  return (
    <Box>
      <Flex pb="6px">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <Box key={d} flex="1" textAlign="center"><Text fontFamily={FONT} fontSize="12px" color={colors.gr92}>{d}</Text></Box>
        ))}
      </Flex>
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)">
        {cells.map((c, i) => {
          if (!c.inMonth) return <Flex key={i} h="38px" align="center" justify="center"><Text fontFamily={FONT} fontSize="13px" color={colors.grB8}>{c.label}</Text></Flex>;
          const k = year * 10000 + month * 100 + c.dn;
          const inR = k >= sKey && k <= eKey;
          const start = k === sKey, end = k === eKey, edge = start || end;
          const radius = start && end ? '8px' : start ? '8px 0 0 8px' : end ? '0 8px 8px 0' : '0';
          return (
            <Flex key={i} as="button" onClick={() => onPick(new Date(year, month - 1, c.dn))} h="38px" align="center" justify="center" cursor="pointer"
              bg={edge ? colors.blue : inR ? '#E9F0FE' : 'transparent'} borderRadius={radius}>
              <Text fontFamily={FONT} fontWeight={edge ? '700' : '500'} fontSize="13px" color={edge ? '#fff' : colors.gr22}>{c.label}</Text>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
function DatePickerSheet({ onApply, mark }: { onApply: (label: string) => void; mark?: string }) {
  const P1 = ['오늘', '어제', '주간', '당월', '전월', '올해'];
  const P2 = ['1분기', '2분기', '3분기', '4분기', '상반기', '하반기'];
  const [preset, setPreset] = useState('당월');
  const [ym, setYm] = useState({ y: 2025, m: 7 });
  const [range, setRange] = useState<{ s: Date; e: Date }>({ s: new Date(2025, 6, 1), e: new Date(2025, 6, 31) });
  const [selecting, setSelecting] = useState(false);
  const prev = () => setYm((s) => (s.m === 1 ? { y: s.y - 1, m: 12 } : { y: s.y, m: s.m - 1 }));
  const next = () => setYm((s) => (s.m === 12 ? { y: s.y + 1, m: 1 } : { y: s.y, m: s.m + 1 }));
  // 프리셋/월 클릭 → 범위 선택 + 시작 월로 캘린더 이동
  const applyPreset = (label: string) => {
    const [s, e] = rangeForPreset(label);
    setRange({ s, e }); setSelecting(false); setPreset(label); setYm({ y: s.getFullYear(), m: s.getMonth() + 1 });
  };
  // 캘린더 직접 클릭 → 1클릭 시작, 2클릭 종료(범위)
  const onPick = (d: Date) => {
    setPreset('');
    if (!selecting) { setRange({ s: d, e: d }); setSelecting(true); }
    else { setSelecting(false); setRange((r) => (dkey(d) >= dkey(r.s) ? { s: r.s, e: d } : { s: d, e: r.s })); }
  };
  const apply = () => onApply(dkey(range.s) === dkey(range.e) ? fmtDate(range.s) : `${fmtDate(range.s)} ~ ${fmtDate(range.e)}`);
  return (
    <SheetShell>
      <Box data-doc-mark={mark} px="16px" pt="8px" pb="20px" maxH="70vh" overflowY="auto">
        <Flex gap="5px" pb="8px">
          {P1.map((l) => <DPChip key={l} label={l} on={preset === l} onClick={() => applyPreset(l)} flex="1" />)}
        </Flex>
        <Flex gap="5px" pb="10px">
          {P2.map((l) => <DPChip key={l} label={l} on={preset === l} onClick={() => applyPreset(l)} flex="1" />)}
        </Flex>
        <Flex gap="5px" pb="6px">
          {[1, 2, 3, 4, 5, 6].map((m) => <DPChip key={m} label={`${m}월`} on={preset === `${m}월`} onClick={() => applyPreset(`${m}월`)} flex="1" />)}
        </Flex>
        <Flex gap="5px" pb="12px">
          {[7, 8, 9, 10, 11, 12].map((m) => <DPChip key={m} label={`${m}월`} on={preset === `${m}월`} onClick={() => applyPreset(`${m}월`)} flex="1" />)}
        </Flex>
        <Flex align="center" justify="space-between" py="6px">
          <Flex as="button" onClick={prev} w="30px" h="30px" align="center" justify="center" border={`1px solid ${colors.grE8}`} borderRadius="8px" cursor="pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.gr42} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg></Flex>
          <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={colors.gr22}>{ym.y}년 {ym.m}월</Text>
          <Flex as="button" onClick={next} w="30px" h="30px" align="center" justify="center" border={`1px solid ${colors.grE8}`} borderRadius="8px" cursor="pointer"><Chevron dir="right" s={16} color={colors.gr42} /></Flex>
        </Flex>
        <DayGrid year={ym.y} month={ym.m} sKey={dkey(range.s)} eKey={dkey(range.e)} onPick={onPick} />
        <Flex justify="flex-end" pt="14px">
          <Box w="96px"><AppButton label="적용" tone="dark" onClick={apply} h="44px" radius="10px" /></Box>
        </Flex>
      </Box>
    </SheetShell>
  );
}
// 바텀시트 오버레이 — 콘텐츠 영역(PhoneShell의 flex 1, position relative) 안에만 배치(absolute).
//  · 딤·시트가 콘텐츠 영역에 국한 → 하단 메뉴바(탭바)는 딤/시트에 가려지지 않고 항상 보임.
//  · 시트는 콘텐츠 영역 하단(=탭바 바로 위)에 도킹.
function SheetPortal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <Box position="absolute" inset="0" zIndex={60}>
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.45)" onClick={onClose} />
      <Box position="absolute" left="0" right="0" bottom="0">{children}</Box>
    </Box>
  );
}

// ── 통계 데이터(예시) ──
type StatItem = { name: string; sales: number; detail?: [string, string, boolean?][] };
type StatCfg = {
  title: string;
  charts?: { bars: [string, number, number][]; donut: [string, number, string][] };
  summary?: [string, string, boolean?, ('red' | 'green')?][];
  listTitle: string;
  items: StatItem[];
  filterGroups?: { title: string; opts: string[]; checked: string[] }[];
};
const STAT_HUB: { id: string; label: string; icon: string }[] = [
  { id: 'sales', label: '매출 현황', icon: 'sales' },
  { id: 'channel', label: '채널별 매출', icon: 'channel' },
  { id: 'signup', label: '가입경로별 매출', icon: 'signup' },
  { id: 'inflow', label: '유입경로별 매출', icon: 'inflow' },
  { id: 'product', label: '상품별 매출', icon: 'product' },
  { id: 'option', label: '옵션별 매출', icon: 'option' },
  { id: 'staff', label: '담당자별 매출', icon: 'staff' },
  { id: 'supplier', label: '공급사별 매출', icon: 'supplier' },
];
const TAX = { title: '과세구분', opts: ['전체', '과세', '면세'], checked: ['전체'] };
const PAYG = { title: '결제수단', opts: ['전체', '신용카드', '휴대폰결제', '가상계좌', '무통장입금', '카카오페이', '네이버페이', '페이코', '토스페이'], checked: ['전체', '신용카드', '네이버페이'] };
const ORDG = { title: '주문상태', opts: ['전체', '입금확인', '미입금', '배송준비', '배송중', '배송완료', '반품중', '교환중', '주문취소'], checked: ['전체', '배송중'] };
const STAT: Record<string, StatCfg> = {
  channel: {
    title: '채널별 매출',
    charts: {
      bars: [['채널 외 직접', 3700000, 100], ['페이스북', 3150000, 85], ['인스타그램', 1900000, 51]],
      donut: [['채널 외 직접', 43.2, colors.gr22], ['페이스북', 36.0, colors.green], ['인스타그램', 21.7, WARN.accent]],
    },
    listTitle: '상품 매출 순위',
    items: [{ name: '채널 외 직접', sales: 3700000 }, { name: '페이스북', sales: 3150000 }, { name: '인스타그램', sales: 1900000 }],
    filterGroups: [TAX, PAYG, ORDG, { title: '채널 선택', opts: ['전체', '페이스북', '채널 외 직접', '인스타그램'], checked: ['전체'] }],
  },
  signup: {
    title: '가입경로별 매출',
    listTitle: '가입경로별 누적 매출 통계',
    items: [
      { name: '메타', sales: 83765200, detail: [['가입자 수', '1,240'], ['구매 수', '1,237'], ['매출', '83,765,200원'], ['마진', '47,422,493원'], ['평균 객단가', '67,716원', true]] },
      { name: 'GFA(트)', sales: 33236700 }, { name: '네이버 GFA(P)', sales: 12136400 }, { name: '당근', sales: 4412000 }, { name: '카카오', sales: 1869200 }, { name: 'GFA(이모디)', sales: 538200 },
    ],
  },
  inflow: {
    title: '유입경로별 매출',
    summary: [['전체 판매금액', '13,755,600원 (476)', true]],
    listTitle: '유입경로별 매출',
    items: [{ name: 'APP', sales: 13755600 }, { name: '카카오톡', sales: 6479200 }, { name: '인스타그램', sales: 2102200 }, { name: '페이스북', sales: 1723800 }, { name: '네이버앱', sales: 1288300 }, { name: '기타', sales: 1178400 }],
    filterGroups: [{ title: '상품상태', opts: ['전체', '판매중', '준비중', '완전품절', '일시품절'], checked: ['전체', '준비중'] }],
  },
  product: {
    title: '상품별 매출',
    summary: [
      ['판매수량', '43,253'], ['상품금액', '1,472,435,540원'], ['할인금액', '6,302,500원'], ['상품금액(할인후)', '1,466,133,040원'],
      ['배송비', '51,144,800원'], ['결제금액', '1,517,277,840원', true], ['공급가', '639,972,973원'], ['마진', '826,160,067원'],
      ['PG수수료', '61,472,797원'], ['부가세', '7,253,613원'], ['수익', '818,906,454원', true],
    ],
    listTitle: '상품 리스트',
    items: [{ name: '후기1등*찰진등심 선별상품 1kg박스', sales: 454429000 }, { name: '품질이 더 좋아진 완숙 1kg', sales: 140454800 }, { name: '인기상품 제품시-프리미엄 델리코슈', sales: 34423000 }, { name: '좋은동심만 골라먹는 힘아이 도톰', sales: 56092600 }, { name: '도매원가마차 국대 사장의 온다', sales: 27947700 }],
    filterGroups: [TAX],
  },
  option: {
    title: '옵션별 매출',
    summary: [['판매수량', '43,253'], ['상품금액', '1,472,435,540원'], ['할인금액', '6,302,500원'], ['결제금액', '1,517,277,840원', true], ['공급가', '639,972,973원'], ['마진', '826,160,067원'], ['수익', '818,906,454원', true]],
    listTitle: '옵션 리스트',
    items: [{ name: '후기1등*찰진등심 1kg박스 (감칠맛 비법숙성)', sales: 454429000 }, { name: '품질이 더 좋아진 완숙 1kg', sales: 140454800 }, { name: '프리미엄 델리코슈 500g팩', sales: 34423000 }],
  },
  staff: {
    title: '담당자별 매출',
    listTitle: '담당자별 매출 리스트',
    items: [
      { name: '김지우', sales: 185200000, detail: [['상품금액', '185,200,000원'], ['할인금액', '800,000원'], ['상품금액(할인후)', '184,400,000원'], ['결제금액', '183,210,000원', true], ['공급가액', '77,500,000원'], ['PG수수료', '7,430,000원'], ['판매이익', '91,400,000원', true]] },
      { name: '박민혼', sales: 172500000 }, { name: '이서연', sales: 163000000 }, { name: '최도윤', sales: 156000000 }, { name: '정하윤', sales: 150500000 }, { name: '강현우', sales: 146300000 }, { name: '윤서준', sales: 143200000 },
    ],
  },
  supplier: {
    title: '공급사별 매출',
    listTitle: '공급사별 매출 리스트',
    items: [{ name: '로커스 · 황성 살베기한우 8kg박스', sales: 1188800 }, { name: '안산 · 통안심속살 1kg', sales: 23125000 }, { name: '안산 · 선별특가할인 특s', sales: 63022300 }, { name: '안산 · 오늘만 추가할인', sales: 24325000 }, { name: '안산 · 특s BOX', sales: 71487000 }, { name: '안산 · 프리미엄 셋트', sales: 660300 }],
    filterGroups: [TAX, PAYG],
  },
};

// M_STAT_P001 — 통계 허브
function StatHub() {
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="stat" />}>
      <Box bg="#141414" px="20px" pt="4px" pb="16px">
        <Text fontFamily={FONT} fontWeight="800" fontSize="20px" color="#fff">통계</Text>
      </Box>
      <Box px="16px" pt="18px" pb="26px">
        <Flex data-doc-mark="grid" wrap="wrap" gap="12px">
          {STAT_HUB.map((c) => (
            <a key={c.id} href={`/preview/stat-${c.id}`} style={{ textDecoration: 'none', width: 'calc(50% - 6px)' }}>
              <Flex direction="column" gap="12px" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" cursor="pointer">
                <Flex w="40px" h="40px" borderRadius="12px" bg={colors.grF8} align="center" justify="center"><StatCatIcon k={c.icon} /></Flex>
                <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr22}>{c.label}</Text>
              </Flex>
            </a>
          ))}
        </Flex>
      </Box>
    </PhoneShell>
  );
}

// M_STAT_P002 — 매출 현황
function SalesStatus() {
  const rank: [string, string][] = [
    ['리프드 머그컵 외 2', '1,586,400원'], ['코튼 토트백 블랙', '932,200원'], ['원목 도마 세트', '878,650원'], ['코튼 토트백 브라운', '786,420원'], ['원목 그릇 세트', '672,900원'],
    ['코튼 토트백 블랙', '608,500원'], ['원목 도마 세트', '596,300원'], ['코튼 토트백 브라운', '586,400원'], ['원목 그릇 세트', '412,800원'], ['리프드 머그컵 250ml', '298,200원'],
  ];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="stat" />}>
      <AppTopBar title="매출 현황" />
      <Box px="16px" pt="16px" pb="26px">
        <DateChip />
        <Box data-doc-mark="status" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} pb="8px">매출 현황</Text>
          <KVRow l="매출 (현재)" v="1,586,400원" strong />
          <KVRow l="마진 (현재)" v="786,400원" tone="green" />
          <HRule />
          <KVRow l="매출 (어제)" v="1,386,400원" strong />
          <KVRow l="마진 (어제)" v="786,400원" tone="green" />
        </Box>
        <Box data-doc-mark="expect" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} pb="4px">이번달 예상 매출액</Text>
          <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pb="10px">일 평균 매출 210,124원 유지 시</Text>
          <Flex align="baseline" gap="6px" pb="10px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="24px" letterSpacing="-0.6px" color={colors.gr22}>756,742,349원</Text>
            <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.green}>24.22%</Text>
          </Flex>
          <Box bg={colors.grF8} borderRadius="10px" p="14px">
            <KVRow l="지난 달 매출" v="352,892,021원" />
            <KVRow l="마진" v="79,280,850원" tone="green" />
          </Box>
        </Box>
        <Box data-doc-mark="trend" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
          <Flex align="center" pb="8px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22}>5월 일 매출 추이</Text>
            <Box flex="1" />
            <Flex bg={colors.grF2} borderRadius="8px" p="3px" gap="2px">
              {['전기', '전년'].map((t, i) => (
                <Flex key={t} px="12px" py="5px" borderRadius="6px" bg={i === 0 ? colors.gr22 : 'transparent'} align="center">
                  <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={i === 0 ? '#fff' : colors.gr92}>{t}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <SalesChart sel={0} />
        </Box>
        <Box data-doc-mark="rank" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} pb="4px">상품 매출 순위</Text>
          {rank.map(([n, v], i) => <RankRow key={i} n={i + 1} name={n} value={v} />)}
        </Box>
      </Box>
    </PhoneShell>
  );
}

// 분류별 매출 페이지(채널·가입경로·유입경로·상품·옵션·담당자·공급사 공통)
function CategoryStat({ cfg }: { cfg: StatCfg }) {
  const [detailIdx, setDetailIdx] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const barColors = [colors.gr22, colors.green, WARN.accent];
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="stat" />}>
      <StatHeader title={cfg.title} onFilter={cfg.filterGroups ? () => setFilterOpen(true) : undefined} />
      <Box px="16px" pt="16px" pb="26px">
        <DateChip />
        {cfg.charts && (
          <Box data-doc-mark="chart" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="16px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} pb="12px">매출 상위 채널 Top {cfg.charts.bars.length}</Text>
            {cfg.charts.bars.map(([l, v, pct], i) => <BarRow key={l} label={l} value={won(v)} pct={pct} color={barColors[i % 3]} />)}
            <HRule />
            <Text fontFamily={FONT} fontWeight="800" fontSize="14px" color={colors.gr22} pb="14px" pt="2px">매출 상위 채널 비중</Text>
            <DonutChart segs={cfg.charts.donut} />
          </Box>
        )}
        {cfg.summary && <StatSummary rows={cfg.summary} mark="summary" />}
        <Box data-doc-mark="list" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} pb="4px">{cfg.listTitle}</Text>
          {cfg.items.map((it, i) => <RankRow key={it.name} n={i + 1} name={it.name} value={won(it.sales)} onClick={() => setDetailIdx(i)} />)}
        </Box>
      </Box>
      {detailIdx != null && (
        <SheetPortal onClose={() => setDetailIdx(null)}>
          <DetailSheetCard name={cfg.items[detailIdx].name} rows={cfg.items[detailIdx].detail ?? stdDetail(cfg.items[detailIdx].sales)} onClose={() => setDetailIdx(null)} />
        </SheetPortal>
      )}
      {filterOpen && cfg.filterGroups && (
        <SheetPortal onClose={() => setFilterOpen(false)}>
          <FilterSheetCard groups={cfg.filterGroups} onClose={() => setFilterOpen(false)} />
        </SheetPortal>
      )}
    </PhoneShell>
  );
}

// 분류별 매출 바텀시트(상세/필터) — 문서용 라우트: 페이지 딤 + 시트 오픈
function CategorySheet({ cfg, kind }: { cfg: StatCfg; kind: 'detail' | 'filter' }) {
  const it = cfg.items[0];
  const [open, setOpen] = useState(true);
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="stat" />}>
      <StatHeader title={cfg.title} onFilter={kind === 'filter' ? () => setOpen(true) : undefined} />
      <Box px="16px" pt="16px" pb="26px">
        <DateChip />
        {cfg.summary && <StatSummary rows={cfg.summary} />}
        <Box bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22} pb="4px">{cfg.listTitle}</Text>
          {cfg.items.slice(0, 4).map((x, i) => <RankRow key={x.name} n={i + 1} name={x.name} value={won(x.sales)} onClick={kind === 'detail' ? () => setOpen(true) : undefined} />)}
        </Box>
      </Box>
      {open && (
        <SheetPortal onClose={() => setOpen(false)}>
          {kind === 'detail'
            ? <DetailSheetCard name={it.name} rows={it.detail ?? stdDetail(it.sales)} onClose={() => setOpen(false)} mark="detail" />
            : <FilterSheetCard groups={cfg.filterGroups ?? []} onClose={() => setOpen(false)} mark="filter" />}
        </SheetPortal>
      )}
    </PhoneShell>
  );
}

// ============================================================
//  M_PROD_P001 상품 목록 / M_PROD_P002 상품 상세
//  ※ 카드·리스트·정렬시트는 모바일 표준 컴포넌트 미비 — 프로토타입 임시 조립(디자인시스템 요청 대상)
//  데이터는 예시(임의 생성)
// ============================================================
function RadioDot({ on }: { on: boolean }) {
  return (
    <Flex w="20px" h="20px" borderRadius="999px" align="center" justify="center" flexShrink={0} border={`1.5px solid ${on ? colors.blue : colors.grD8}`}>
      {on && <Box w="10px" h="10px" borderRadius="999px" bg={colors.blue} />}
    </Flex>
  );
}
function SearchIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>;
}
const SALE_STATUS: Record<string, string> = { '판매중': colors.green, '일시품절': WARN.accent, '완전품절': colors.red, '준비중': colors.blue };
function SaleBadge({ s }: { s: string }) {
  const c = SALE_STATUS[s] ?? colors.gr72;
  return (
    <Flex align="center" gap="5px">
      <Box w="6px" h="6px" borderRadius="999px" bg={c} />
      <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={c}>{s}</Text>
    </Flex>
  );
}
function Tag({ label, tone }: { label: string; tone: 'blue' | 'pink' | 'gray' }) {
  const map = tone === 'pink' ? { bg: '#FDECEC', fg: colors.red } : tone === 'gray' ? { bg: colors.grF2, fg: colors.gr72 } : { bg: '#EAF2FF', fg: colors.blue };
  return <Flex bg={map.bg} borderRadius="6px" px="8px" py="3px" flexShrink={0}><Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={map.fg} whiteSpace="nowrap">{label}</Text></Flex>;
}
function NoBadge({ no }: { no: number }) {
  return <Flex bg={colors.grF2} borderRadius="6px" px="8px" py="3px"><Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={colors.gr72}>No.{no}</Text></Flex>;
}

type Product = { no: number; status: string; name: string; code: string; supplier: string; tags: { label: string; tone: 'blue' | 'pink' | 'gray' }[]; orders: number; likes: number; stock: number; stockTotal: number; price: number; prevPrice: number; taxFree: boolean; margin: number; listed: boolean; reviews: number; reg: string; mod: string };
const PRODUCTS: Product[] = [
  { no: 288, status: '판매중', name: '*입점기념 60% 할인 탑브랜드한우-한우 갈비살1등급', code: 'SME86870248', supplier: '에이스코리아', tags: [{ label: '조건부 무료배송', tone: 'blue' }], orders: 264, likes: 12, stock: 370, stockTotal: 394, price: 27800, prevPrice: 65000, taxFree: true, margin: 49.64, listed: true, reviews: 120, reg: '2026-06-08', mod: '2026-06-12' },
  { no: 287, status: '일시품절', name: '신상품(주태기름이 붙어있는 고소한 버전) - 통안심속살 1kg 대용량(지방손질 선택가능)', code: 'SME1890539', supplier: '안산', tags: [{ label: '조건부 무료배송', tone: 'blue' }, { label: '선물하기', tone: 'pink' }], orders: 58, likes: 5, stock: 0, stockTotal: 397, price: 32000, prevPrice: 69800, taxFree: true, margin: 56.25, listed: false, reviews: 8, reg: '2026-06-04', mod: '2026-06-09' },
  { no: 286, status: '완전품절', name: '(한우고등급 대폭락)1+등급 눈꽃등심 찐원가판매 / 1.5만원추가할인특가(설향한우…)', code: 'SME85306925', supplier: '안산', tags: [{ label: '무료배송', tone: 'blue' }], orders: 1099, likes: 111, stock: 0, stockTotal: 72, price: 24800, prevPrice: 98000, taxFree: true, margin: 51.61, listed: false, reviews: 340, reg: '2026-02-06', mod: '2026-05-21' },
  { no: 285, status: '준비중', name: '(주7일 매일배송)1팩9900원*횡성한우 1++등급 국거리(다용도 세절상품: 국거리…)', code: 'SME88516567', supplier: '에이스코리아', tags: [{ label: '고정배송비', tone: 'blue' }, { label: '선물하기', tone: 'pink' }], orders: 24989, likes: 227, stock: 580, stockTotal: 580, price: 9900, prevPrice: 24000, taxFree: false, margin: 49.46, listed: false, reviews: 15, reg: '2026-06-01', mod: '2026-06-16' },
];
const SORT_OPTS = ['최근 등록순', '최근 수정순', '판매가 높은순', '판매가 낮은순', '주문수 높은순', '주문수 낮은순', '찜하기 높은순', '찜하기 낮은순', '마진율 높은순', '마진율 낮은순', '구매후기 많은순'];
const SORT_CMP: ((a: Product, b: Product) => number)[] = [
  (a, b) => b.reg.localeCompare(a.reg), (a, b) => b.mod.localeCompare(a.mod),
  (a, b) => b.price - a.price, (a, b) => a.price - b.price,
  (a, b) => b.orders - a.orders, (a, b) => a.orders - b.orders,
  (a, b) => b.likes - a.likes, (a, b) => a.likes - b.likes,
  (a, b) => b.margin - a.margin, (a, b) => a.margin - b.margin,
  (a, b) => b.reviews - a.reviews,
];

function ProductCard({ p }: { p: Product }) {
  return (
    <a href="/preview/product-detail" style={{ textDecoration: 'none', display: 'block' }}>
      <Box bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" cursor="pointer">
        <Flex align="center" justify="space-between" pb="12px">
          <NoBadge no={p.no} />
          <SaleBadge s={p.status} />
        </Flex>
        <Flex gap="12px" pb="12px">
          <Box w="56px" h="56px" borderRadius="10px" bg={colors.grF2} flexShrink={0} />
          <Box flex="1" minW="0">
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={colors.gr22} lineHeight="1.4" css={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2', overflow: 'hidden' }}>{p.name}</Text>
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pt="5px">{p.code} · {p.supplier}</Text>
          </Box>
        </Flex>
        <Flex gap="6px" pb="12px" wrap="wrap">{p.tags.map((t) => <Tag key={t.label} label={t.label} tone={t.tone} />)}</Flex>
        <Flex borderTop={`1px solid ${colors.grF2}`} borderBottom={`1px solid ${colors.grF2}`} py="10px" mb="12px">
          {([['주문수', `${p.orders.toLocaleString('en-US')}개`, false], ['찜하기', `${p.likes}개`, false], ['재고', `${p.stock}/${p.stockTotal}`, p.stock === 0]] as [string, string, boolean][]).map(([l, v, danger], i) => (
            <Flex key={l} direction="column" align="center" gap="4px" flex="1" borderLeft={i ? `1px solid ${colors.grF2}` : undefined}>
              <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>{l}</Text>
              <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={danger ? colors.red : colors.gr22}>{v}</Text>
            </Flex>
          ))}
        </Flex>
        <Flex justify="space-between" align="flex-end">
          <Box>
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pb="3px">판매가</Text>
            <Flex align="center" gap="6px">
              <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.gr22}>{won(p.price)}</Text>
              <Text fontFamily={FONT} fontSize="12px" color={colors.grB8} textDecoration="line-through">{won(p.prevPrice)}</Text>
              <Flex bg={colors.grF2} borderRadius="4px" px="5px" py="1px"><Text fontFamily={FONT} fontSize="11px" color={colors.gr72}>면세</Text></Flex>
            </Flex>
          </Box>
          <Box textAlign="right">
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pb="3px">마진율</Text>
            <Text fontFamily={FONT} fontWeight="800" fontSize="15px" color={colors.green}>{p.margin}%</Text>
          </Box>
        </Flex>
        <Flex justify="space-between" pt="10px">
          <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>목록 노출 · {p.listed ? '보임' : '숨김'}</Text>
          <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>등록 {p.reg} · 수정 {p.mod}</Text>
        </Flex>
      </Box>
    </a>
  );
}
function SortSheet({ options = SORT_OPTS, sel, onApply, mark }: { options?: string[]; sel: number; onApply: (i: number) => void; mark?: string }) {
  const [pick, setPick] = useState(sel);
  return (
    <SheetShell>
      <Box data-doc-mark={mark} px="20px" pt="8px" pb="20px" maxH="70vh" overflowY="auto">
        <Text fontFamily={FONT} fontWeight="800" fontSize="18px" color={colors.gr22} pb="8px">정렬</Text>
        {options.map((o, i) => (
          <Flex key={o} as="button" onClick={() => setPick(i)} align="center" gap="12px" w="100%" py="12px" textAlign="left" cursor="pointer" borderBottom={`1px solid ${colors.grF2}`}>
            <RadioDot on={i === pick} />
            <Text fontFamily={FONT} fontWeight={i === pick ? '700' : '500'} fontSize="14px" color={i === pick ? colors.gr22 : colors.gr42} flex="1">{o}</Text>
          </Flex>
        ))}
        <Box pt="16px"><AppButton label="적용" tone="dark" onClick={() => onApply(pick)} h="46px" radius="10px" /></Box>
      </Box>
    </SheetShell>
  );
}

function ProductList() {
  const [sortSel, setSortSel] = useState(0);
  const [rev, setRev] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const shown = [...PRODUCTS].sort(SORT_CMP[sortSel]);
  if (rev) shown.reverse();
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="product" />}>
      <Box bg="#141414" px="20px" pt="2px" pb="14px">
        <Flex align="center" h="44px" gap="8px">
          <Flex align="baseline" gap="6px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="17px" color="#fff">상품</Text>
            <Text fontFamily={FONT} fontSize="13px" color="rgba(255,255,255,0.7)">1,247개</Text>
          </Flex>
          <Box flex="1" />
          <a href="/preview/product-search" style={{ display: 'inline-flex', cursor: 'pointer' }}><SearchIcon /></a>
          <Box as="button" onClick={() => setFilterOpen(true)} cursor="pointer"><FilterIcon /></Box>
        </Flex>
      </Box>
      <Box px="16px" pt="16px" pb="26px">
        <Flex data-doc-mark="sort" align="center" pb="14px">
          <Flex as="button" onClick={() => setSortOpen(true)} align="center" gap="4px" cursor="pointer">
            <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color={colors.gr42}>{SORT_OPTS[sortSel]}</Text>
            <Chevron dir="down" s={16} color={colors.gr72} />
          </Flex>
          <Box flex="1" />
          <Text as="button" onClick={() => setRev((v) => !v)} fontFamily={FONT} fontSize="12px" color={colors.gr92} textDecoration="underline" cursor="pointer">역순으로 재정렬하기</Text>
        </Flex>
        <Flex data-doc-mark="list" direction="column" gap="12px">
          {shown.map((p) => <ProductCard key={p.no} p={p} />)}
        </Flex>
      </Box>
      {sortOpen && (
        <SheetPortal onClose={() => setSortOpen(false)}>
          <SortSheet sel={sortSel} onApply={(i) => { setSortSel(i); setSortOpen(false); }} />
        </SheetPortal>
      )}
      {filterOpen && (
        <SheetPortal onClose={() => setFilterOpen(false)}>
          <FilterSheetCard groups={PROD_FILTER} onClose={() => setFilterOpen(false)} />
        </SheetPortal>
      )}
    </PhoneShell>
  );
}

// 상품 필터 그룹(상태·배송·과세·결제수단·선물하기) — 필터 바텀시트 공용
const PROD_FILTER = [
  { title: '상품상태', opts: ['전체', '판매중', '일시품절', '완전품절', '준비중'], checked: ['전체'] },
  { title: '배송형태', opts: ['전체', '무료배송', '조건부 무료배송', '고정배송비'], checked: ['전체'] },
  { title: '과세구분', opts: ['전체', '과세', '면세'], checked: ['전체'] },
  { title: '결제수단', opts: ['전체', '신용카드', '휴대폰', '가상계좌', '무통장입금', '카카오페이', '네이버페이', '페이코', '토스페이'], checked: ['전체', '신용카드'] },
  { title: '선물하기', opts: ['선물하기 허용', '선물하기 비허용'], checked: ['선물하기 허용'] },
];

// M_PROD_P003 — 상품 검색(상품명/상품코드)
function ProductSearch() {
  const [q, setQ] = useState('');
  const results = q.trim() ? PRODUCTS.filter((p) => p.name.includes(q) || p.code.toLowerCase().includes(q.toLowerCase())) : PRODUCTS;
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="product" />}>
      <Box bg="#141414" px="14px" pt="2px" pb="14px">
        <Flex align="center" gap="10px" h="44px">
          <BackArrow onClick={() => window.history.back()} />
          <Flex flex="1" align="center" gap="8px" bg="rgba(255,255,255,0.14)" borderRadius="10px" px="12px" h="40px">
            <SearchIcon />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="상품명 또는 상품코드 검색"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: FONT }} />
          </Flex>
        </Flex>
      </Box>
      <Box data-doc-mark="search" px="16px" pt="16px" pb="26px">
        {results.length ? (
          <Flex direction="column" gap="12px">{results.map((p) => <ProductCard key={p.no} p={p} />)}</Flex>
        ) : (
          <Text fontFamily={FONT} fontSize="13px" color={colors.gr92} textAlign="center" py="40px">검색 결과가 없습니다.</Text>
        )}
      </Box>
    </PhoneShell>
  );
}

// M_PROD_P004 — 상품 필터(문서용: 목록 딤 + 필터 바텀시트)
function ProductFilterView() {
  const [open, setOpen] = useState(true);
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="product" />}>
      <Box bg="#141414" px="20px" pt="2px" pb="14px">
        <Flex align="center" h="44px" gap="8px">
          <Flex align="baseline" gap="6px"><Text fontFamily={FONT} fontWeight="800" fontSize="17px" color="#fff">상품</Text><Text fontFamily={FONT} fontSize="13px" color="rgba(255,255,255,0.7)">1,247개</Text></Flex>
          <Box flex="1" />
          <SearchIcon /><Box as="button" onClick={() => setOpen(true)} cursor="pointer"><FilterIcon /></Box>
        </Flex>
      </Box>
      <Box px="16px" pt="16px" pb="26px">
        {PRODUCTS.slice(0, 1).map((p) => <Box key={p.no} pb="12px"><ProductCard p={p} /></Box>)}
      </Box>
      {open && (
        <SheetPortal onClose={() => setOpen(false)}>
          <FilterSheetCard groups={PROD_FILTER} onClose={() => setOpen(false)} mark="filter" />
        </SheetPortal>
      )}
    </PhoneShell>
  );
}

const PROD_CATS = ['TOP > 설향한우 > 한우 구이용', 'TOP > 국대급 베스트 상품전', 'TOP > 베스트 30', 'TOP > 오늘의 국대급 특가상품', 'TOP > 설향한우 > 설향작 명품관', 'TOP > 국대한우 특가전 > 국대급 대박특가전', 'TOP > 국대한우 특가전 > 2~4만원대'];
const PAYMENTS: [string, boolean][] = [['신용카드', true], ['휴대폰', true], ['가상계좌', true], ['무통장입금', true], ['카카오페이', true], ['페이코', false], ['네이버페이', true], ['페이유', false], ['애플페이', true], ['토스페이', false], ['내통장결제', false]];
function ProductDetail() {
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="product" />}>
      <AppTopBar title="상품 상세" />
      <Box px="16px" pt="16px" pb="26px">
        {/* 상품 요약 */}
        <Box data-doc-mark="head" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="16px" mb="12px">
          <Flex align="center" justify="space-between" pb="12px">
            <NoBadge no={288} />
            <SaleBadge s="판매중" />
          </Flex>
          <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={colors.gr22} lineHeight="1.4" pb="14px">*입점기념 60% 할인 탑브랜드한우-한우 갈비살1등급</Text>
          <Flex gap="12px" pb="12px">
            <Box w="64px" h="64px" borderRadius="10px" bg={colors.grF2} flexShrink={0} />
            <Flex flex="1" minW="0" justify="space-between" align="flex-end">
              <Box>
                <Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pb="3px">판매가</Text>
                <Flex align="center" gap="6px"><Text fontFamily={FONT} fontWeight="800" fontSize="18px" color={colors.gr22}>27,800원</Text><Text fontFamily={FONT} fontSize="12px" color={colors.grB8} textDecoration="line-through">65,000원</Text></Flex>
              </Box>
              <Box textAlign="right"><Text fontFamily={FONT} fontSize="11px" color={colors.gr92} pb="3px">마진율</Text><Text fontFamily={FONT} fontWeight="800" fontSize="18px" color={colors.green}>49.64%</Text></Box>
            </Flex>
          </Flex>
          <Flex gap="6px" pb="12px"><Tag label="조건부 무료배송" tone="blue" /><Tag label="면세" tone="gray" /></Flex>
          <Flex justify="space-between">
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>목록 노출 · 보임</Text>
            <Text fontFamily={FONT} fontSize="11px" color={colors.gr92}>등록 2026-06-08 · 수정 2026-06-12</Text>
          </Flex>
        </Box>

        <DSection title="상품 정보" mark="meta">
          <KVRow l="상품코드" v="SME95875754" />
          <KVRow l="공급사" v="에이스코리아" />
        </DSection>

        <DSection title="카테고리" mark="category">
          <Flex direction="column" gap="8px">
            {PROD_CATS.map((c) => <Text key={c} fontFamily={FONT} fontSize="13px" color={colors.gr42} lineHeight="1.5">{c}</Text>)}
          </Flex>
        </DSection>

        <DSection title="부연 설명 · 연관 검색어" mark="desc">
          <KVRow l="부연 설명" v="3팩이상 무료배송" />
          <KVRow l="연관 검색어" v="27800" />
        </DSection>

        <DSection title="결제수단" mark="payment">
          <Flex wrap="wrap">
            {PAYMENTS.map(([l, on]) => (
              <Flex key={l} w="33.33%" align="center" gap="7px" pb="12px">
                <CheckBox on={on} />
                <Text fontFamily={FONT} fontSize="12px" color={on ? colors.gr42 : colors.grB8}>{l}</Text>
              </Flex>
            ))}
          </Flex>
        </DSection>

        <DSection title="가격 정보" mark="price">
          <KVRow l="공급가격" v="14,000원" />
          <KVRow l="판매가격" v="27,800원" strong />
          <KVRow l="이전 판매가격" v="65,000원" />
        </DSection>

        <DSection title="상품 메모" mark="memo">
          <Box bg={colors.grF8} borderRadius="10px" p="12px 14px">
            <Text fontFamily={FONT} fontSize="13px" color={colors.gr42} lineHeight="1.6">1등급 한우 갈비살 200g / 1+ 한우 갈비살 200g</Text>
          </Box>
        </DSection>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  M_MYPG_P001 내 계정 / M_MYPG_P002 푸시 알림
//  ※ 프로필 카드·설정 행·토글은 프로토타입 임시 조립(디자인시스템 요청 대상)
// ============================================================
// 토글 스위치(ON = 파랑) — 디자인 규칙상 선택색 blue
function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <Flex as="button" onClick={onClick} w="44px" h="26px" borderRadius="999px" p="3px" align="center" justify={on ? 'flex-end' : 'flex-start'} bg={on ? colors.blue : colors.grD8} cursor="pointer" flexShrink={0}>
      <Box w="20px" h="20px" borderRadius="999px" bg="#fff" boxShadow="0 1px 2px rgba(0,0,0,0.2)" />
    </Flex>
  );
}

function MyAccount() {
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="my" />}>
      <AppTopBar title="내 계정" back={false} />
      <Box px="16px" pt="16px" pb="26px">
        {/* 계정 프로필 */}
        <Box data-doc-mark="profile" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" p="18px" mb="22px">
          <Text fontFamily={FONT} fontWeight="800" fontSize="18px" color={colors.gr22} pb="10px">위드소프트</Text>
          <Flex align="center" gap="8px" pb="12px">
            <Text fontFamily={FONT} fontSize="13px" color={colors.gr72}>최고 관리자</Text>
            <Flex bg={colors.gr22} borderRadius="6px" px="8px" py="2px"><Text fontFamily={FONT} fontWeight="700" fontSize="11px" color="#fff">대표계정</Text></Flex>
          </Flex>
          <Text fontFamily={FONT} fontSize="13px" color={colors.blue} textDecoration="underline">owner@flexg.shop</Text>
        </Box>

        {/* 설정 */}
        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={colors.gr92} pb="10px" pl="2px">설정</Text>
        <a href="/preview/push-settings" style={{ textDecoration: 'none', display: 'block' }}>
          <Flex data-doc-mark="settings" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" px="16px" py="16px" align="center" cursor="pointer">
            <Text fontFamily={FONT} fontSize="14px" color={colors.gr22} flex="1">푸시 알림</Text>
            <Chevron dir="right" s={18} color={colors.grB8} />
          </Flex>
        </a>

        {/* 로그아웃 */}
        <Box data-doc-mark="logout" pt="22px">
          <a href="/preview/login" style={{ textDecoration: 'none', display: 'block' }}>
            <Flex h="52px" border={`1px solid ${colors.grE8}`} borderRadius="12px" align="center" justify="center" cursor="pointer">
              <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={colors.red}>로그아웃</Text>
            </Flex>
          </a>
        </Box>
      </Box>
    </PhoneShell>
  );
}

function PushSettings() {
  const items = ['서비스 알림 여부', '쇼핑몰 주요 공지', '오늘 매출 브리핑', '어제 매출 브리핑', '지난주 매출 및 전환율 낮은 상품', '어제의 CRM 지표 브리핑'];
  const [on, setOn] = useState([true, true, true, false, true, false]);
  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
  return (
    <PhoneShell screenBg="#F4F5F7" statusTone="light" topBg="#141414" bottomBg="#fff" barTone="dark" bottom={<BottomTabBar active="my" />}>
      <AppTopBar title="푸시 알림" />
      <Box px="16px" pt="16px" pb="26px">
        <Box data-doc-mark="list" bg="#fff" border={`1px solid ${colors.grE8}`} borderRadius="14px" overflow="hidden">
          {items.map((it, i) => (
            <Flex key={it} align="center" gap="12px" px="16px" py="16px" borderTop={i ? `1px solid ${colors.grF2}` : undefined}>
              <Text fontFamily={FONT} fontSize="14px" color={colors.gr42} flex="1">{it}</Text>
              <Switch on={on[i]} onClick={() => toggle(i)} />
            </Flex>
          ))}
        </Box>
      </Box>
    </PhoneShell>
  );
}

// ============================================================
//  개요(Overview) — FLEXG 운영 모바일 앱 소개(협업 개발자/디자이너용, Pretendard)
// ============================================================
const OV_SECTIONS = [
  { id: 'overview', n: '01', t: '개요 · 배경' },
  { id: 'goal', n: '02', t: '목적' },
  { id: 'metric', n: '03', t: '성공 기준' },
  { id: 'scope', n: '04', t: '범위' },
  { id: 'screen', n: '05', t: '화면 구성' },
  { id: 'flow', n: '06', t: '주요 사용자 플로우' },
  { id: 'user', n: '07', t: '대상 사용자 · 권한' },
  { id: 'note', n: '08', t: '참고 사항' },
];

// ── 기능정의서 데이터 (전체 화면) — Domain / 화면ID / 1Depth / 2Depth / Element / Function / Comment ──
interface FSRow { el: string; fn: string; cm?: string }
interface FSScreen { domain: string; code: string; d1: string; d2: string; rows: FSRow[] }

// 통계 분류별 페이지·바텀시트는 형태가 균일 → 제너레이터로 생성
const statPageRows = (name: string, o: { chart?: boolean; summary?: boolean; filter?: boolean }): FSRow[] => {
  const rows: FSRow[] = [{ el: '기간 필터', fn: `상단 기간 필터 기준으로 ${name} 집계`, cm: '통계 허브에서 진입' }];
  if (o.chart) rows.push({ el: '매출 차트', fn: '매출 상위 항목 가로 바 차트 + 비중 도넛 차트' });
  if (o.summary) rows.push({ el: '매출 요약', fn: '판매수량·상품금액·할인·결제금액·공급가·마진·수익 요약' });
  rows.push({ el: `${name} 순위`, fn: `${name} 순위(정산금액 내림차순), 항목 터치 시 상세 바텀시트`, cm: '정산금액 내림차순' });
  if (o.filter) rows.push({ el: '필터', fn: '우상단 필터 아이콘 → 다중 조건으로 목록 좁힘' });
  return rows;
};
const detailSheetRows: FSRow[] = [
  { el: '정산 상세', fn: '상품금액·할인·결제·취소·정산금액·공급가·PG수수료·판매이익 등 상세 내역', cm: '[확인]·외부 터치 시 닫힘' },
];
const filterSheetRows: FSRow[] = [
  { el: '필터 조건', fn: '과세구분·결제수단·주문상태·항목 등 다중 조건 체크박스', cm: '전체 선택 시 하위 자동 체크' },
  { el: '초기화 · 적용', fn: '[초기화]로 조건 해제 · [적용] 시 부모 목록 재조회', cm: '취소/외부 터치 시 미반영 닫힘' },
];
const statCat = (code: string, d2: string, o: { chart?: boolean; summary?: boolean; filter?: boolean }): FSScreen => ({ domain: 'STAT', code, d1: '통계', d2, rows: statPageRows(d2, o) });
const statDetail = (code: string, d2: string): FSScreen => ({ domain: 'STAT', code, d1: '통계', d2: `${d2} 상세`, rows: detailSheetRows });
const statFilter = (code: string, d2: string): FSScreen => ({ domain: 'STAT', code, d1: '통계', d2: `${d2} 필터`, rows: filterSheetRows });

const FUNC_SPEC: FSScreen[] = [
  // ── 공통(인증) ──
  { domain: 'CMMN', code: 'M_CMMN_P001', d1: '공통', d2: '스플래시', rows: [
    { el: '로고 이미지', fn: '앱 실행 시 FLEXG 로고를 화면 중앙에 노출' },
    { el: '자동 전환', fn: '최소 노출 시간(약 1.5~2초) 경과 후 다음 화면으로 자동 이동', cm: '토큰 유효 시 메인 / 무효·없음 시 로그인' },
    { el: '네트워크 상태 체크', fn: '미연결 시 안내 문구 노출 및 재시도', cm: '오프라인 예외 처리' },
    { el: '강제 업데이트 체크', fn: '업데이트 필요 시 업데이트 모달 노출 후 스토어 이동', cm: '강제 업데이트 플래그' },
  ] },
  { domain: 'CMMN', code: 'M_CMMN_P002', d1: '공통', d2: '로그인', rows: [
    { el: '로고', fn: '좌상단 FLEXG 로고 노출' },
    { el: '타이틀 / 서브타이틀', fn: '"운영은 멈추지 않도록" 안내 문구 노출', cm: '정적 텍스트' },
    { el: '계정 유형 탭', fn: '대표계정 / 부계정 선택, 선택값에 따라 로그인 대상 전환', cm: 'Default : 대표계정' },
    { el: '아이디 입력 필드', fn: '아이디 입력(자동 소문자 변환), placeholder 노출, 유효성 검사', cm: '형식 오류 시 안내' },
    { el: '비밀번호 입력 필드', fn: '입력값 마스킹 처리, 유효성 검사', cm: '8자 이상(영문+숫자)' },
    { el: '로그인 버튼', fn: '인증 성공 시 메인 대시보드로 이동', cm: '부계정 5회 실패 시 10분 잠금' },
    { el: '비밀번호 찾기', fn: '비밀번호 재설정 화면으로 진입', cm: 'M_CMMN_P003' },
  ] },
  { domain: 'CMMN', code: 'M_CMMN_P003', d1: '공통', d2: '비밀번호 재설정', rows: [
    { el: '뒤로가기', fn: '헤더 좌상단 뒤로가기 → 로그인 화면 복귀', cm: 'M_CMMN_P002' },
    { el: '안내', fn: '화면 제목 + 재설정 절차 안내 문구' },
    { el: '아이디(이메일) 입력', fn: '가입한 아이디(이메일) 입력, [인증코드 받기]로 메일 발송', cm: '미가입/형식 오류 시 안내' },
    { el: '인증코드 확인', fn: '인증번호 6자리 입력, 유효시간 3분 + 재전송', cm: '시간 초과·불일치 시 안내' },
    { el: '새 비밀번호 설정', fn: '새 비밀번호 + 확인 입력(마스킹)', cm: '영문·숫자 포함 8자 이상 · 일치 필수' },
    { el: '비밀번호 변경', fn: '[비밀번호 변경] → 완료 후 로그인 이동' },
  ] },
  // ── 홈 ──
  { domain: 'HOME', code: 'M_HOME_P001', d1: '홈', d2: '메인 대시보드', rows: [
    { el: '헤더 알림 아이콘', fn: '미읽음 개수 뱃지 노출, 터치 시 알림 센터 이동', cm: 'M_HOME_P002' },
    { el: '지금 처리할 일', fn: '미답변 CS·배송준비·재고 부족을 최우선 노출, 터치 시 딥링크', cm: '0건이면 카드 숨김' },
    { el: '오늘 매출', fn: '오늘 매출 + 전일 동시간 대비 증감률', cm: '마감 예상치는 참고용' },
    { el: '보조 KPI', fn: '오늘 주문·신규 회원 수, 전일 대비 증감' },
    { el: '주문 상태 5단계', fn: '입금확인/배송준비/배송중/배송완료/주문취소 건수, 터치 시 목록', cm: '주문취소 강조(빨강)' },
    { el: '시간대별 매출 차트', fn: '오늘 vs 어제 추이 라인 차트 + 현재 시점 마커', cm: '5분 마이크로배치 갱신' },
    { el: '오늘 BEST Top 3', fn: '판매 건수 상위 3종, 전체 시 BEST 전체 이동', cm: 'M_HOME_P004' },
    { el: '최근 주문', fn: '최근 주문 최대 5건, 카드 터치 시 주문 상세', cm: 'M_HOME_P005' },
    { el: 'Pull-to-refresh', fn: '당겨서 강제 갱신', cm: '1차 조회 전용(편집 비활성)' },
  ] },
  { domain: 'HOME', code: 'M_HOME_P002', d1: '홈', d2: '알림', rows: [
    { el: '알림 카드 목록', fn: '아이콘+제목+본문+시간, 미읽음 우측 점, 오늘·어제 날짜 그룹' },
    { el: '카드 탭 이동', fn: '유형별 해당 화면으로 딥링크', cm: '경고→주문목록 / 주문→주문상세 / 안내→공지상세' },
    { el: '모두 읽음', fn: '전체 알림 읽음 처리' },
  ] },
  { domain: 'HOME', code: 'M_HOME_P006', d1: '홈', d2: '공지 상세', rows: [
    { el: '공지 헤더', fn: '유형 태그·등록일·제목 노출' },
    { el: '공지 본문', fn: '점검 일시·내용 등 공지 본문 노출' },
  ] },
  { domain: 'HOME', code: 'M_HOME_P003', d1: '홈', d2: '처리할 일 전체', rows: [
    { el: '미답변 CS 문의', fn: '최신순 나열(주문번호·문의·경과), 터치 시 CS 상세' },
    { el: '배송준비 주문', fn: '배송준비 주문 나열, 터치 시 주문 상세' },
    { el: '재고 부족 임박', fn: '잔여 10개 이하 상품 나열, 터치 시 상품 상세', cm: '재고 임박 기준 10개' },
  ] },
  { domain: 'HOME', code: 'M_HOME_P004', d1: '홈', d2: '오늘 BEST 전체', rows: [
    { el: '베스트셀러 순위', fn: '순위+이미지+상품명+매출+판매 건수', cm: '상위 3위 강조 / 오늘 판매 건수 기준' },
    { el: '항목 탭 이동', fn: '상품 상세로 이동', cm: '상품 데이터 예시' },
  ] },
  { domain: 'HOME', code: 'M_HOME_P005', d1: '홈', d2: '최근 주문 전체', rows: [
    { el: '주문 목록', fn: '상태 뱃지+주문번호+시간+대표 상품+금액, 최신순' },
    { el: '카드 탭 이동', fn: '주문 상세로 이동', cm: '주문 데이터 예시' },
  ] },
  // ── 주문 ──
  { domain: 'ORDR', code: 'M_ORDR_P001', d1: '주문', d2: '주문 목록', rows: [
    { el: '상태 탭 6종', fn: '전체/입금확인/배송준비/배송중/주문취소/배송완료 + 건수, 터치 시 필터', cm: '한 줄 좌우 스크롤(스크롤바 미표시)' },
    { el: '기간 필터', fn: '우상단 캘린더 → 데이트피커, 선택 시 타이틀·목록 반영', cm: '기본 오늘 / 최대 2년' },
    { el: '요약 대시보드', fn: '총 주문 건수·합계 금액', cm: '천 단위 콤마' },
    { el: '정렬', fn: '최신순(기본)/과거순/금액 높은순/금액 낮은순' },
    { el: '주문 목록', fn: '상태 뱃지·주문번호·시각·상품명·금액·주문자·연락처·결제수단', cm: '개인정보 마스킹' },
    { el: '상세보기', fn: '주문 상세로 이동', cm: 'M_ORDR_P002' },
    { el: '무한 스크롤', fn: '하단 도달 시 자동 추가 로드', cm: '페이지당 20건' },
  ] },
  { domain: 'ORDR', code: 'M_ORDR_P002', d1: '주문', d2: '주문 상세', rows: [
    { el: '주문 상품', fn: '이미지·상품명·옵션·부가세·코드·수량·상품금액·할인·결제금액' },
    { el: '결제 정보', fn: '결제수단·입금처리 일시·입금자명·계좌·현금영수증', cm: '무통장만 입금자/계좌 노출' },
    { el: '결제 금액', fn: '상품금액·배송비·도서산간·쿠폰·포인트·최종 결제금액', cm: '도서산간 0원도 항목 노출' },
    { el: '주문 정보', fn: '주문번호·일시·상태·선물상태, 자세히 보기 시 변경내역 모달' },
    { el: '주문자 및 배송지', fn: '주문자·수령인·배송지·요청사항·택배사/송장번호' },
    { el: 'CS 요청', fn: '취소/반품/교환 유형·사유·환불계좌·회수주소, 첨부 사진 모달' },
    { el: '부분취소 내역', fn: '부분취소 처리 내역 리스트', cm: '없으면 빈 상태 안내' },
    { el: '사진 요청 리스트', fn: '반품/교환 사진 요청 내역', cm: '없으면 빈 상태 안내' },
  ] },
  // ── 통계 ──
  { domain: 'STAT', code: 'M_STAT_P001', d1: '통계', d2: '통계 허브', rows: [
    { el: '카테고리 그리드', fn: '매출현황·채널·가입경로·유입경로·상품·옵션·담당자·공급사 8개 카드' },
    { el: '카드 이동', fn: '카드 터치 시 해당 통계 화면 이동' },
  ] },
  { domain: 'STAT', code: 'M_STAT_P002', d1: '통계', d2: '매출 현황', rows: [
    { el: '매출 현황', fn: '매출·마진 현재/어제 비교' },
    { el: '이번달 예상 매출액', fn: '일 평균 매출 유지 시 예상 매출/마진', cm: '지난 달 대비 표기' },
    { el: '일 매출 추이', fn: '일자별 매출 추이 라인 차트', cm: '전기 vs 전년 비교 토글' },
    { el: '상품 매출 순위', fn: '상품별 매출 TOP 10' },
  ] },
  statCat('M_STAT_P003', '채널별 매출', { chart: true, filter: true }),
  statDetail('M_STAT_B001', '채널별 매출'),
  statFilter('M_STAT_B002', '채널별 매출'),
  statCat('M_STAT_P004', '가입경로별 매출', {}),
  statDetail('M_STAT_B003', '가입경로별 매출'),
  statCat('M_STAT_P005', '유입경로별 매출', { summary: true, filter: true }),
  statDetail('M_STAT_B004', '유입경로별 매출'),
  statFilter('M_STAT_B005', '유입경로별 매출'),
  statCat('M_STAT_P006', '상품별 매출', { summary: true, filter: true }),
  statDetail('M_STAT_B006', '상품별 매출'),
  statFilter('M_STAT_B007', '상품별 매출'),
  statCat('M_STAT_P007', '옵션별 매출', { summary: true }),
  statDetail('M_STAT_B008', '옵션별 매출'),
  statCat('M_STAT_P008', '담당자별 매출', {}),
  statDetail('M_STAT_B009', '담당자별 매출'),
  statCat('M_STAT_P009', '공급사별 매출', {}),
  statDetail('M_STAT_B010', '공급사별 매출'),
  statFilter('M_STAT_B011', '공급사별 매출'),
  // ── 상품 ──
  { domain: 'PROD', code: 'M_PROD_P001', d1: '상품', d2: '상품 목록', rows: [
    { el: '검색 아이콘', fn: '우상단 검색 아이콘 → 상품 검색 진입', cm: 'M_PROD_P003' },
    { el: '필터 아이콘', fn: '우상단 필터 아이콘 → 필터 바텀시트', cm: 'M_PROD_P004' },
    { el: '정렬 · 역순', fn: '정렬 11종 + 「역순으로 재정렬」', cm: '새로고침 없이 즉시 재정렬' },
    { el: '상품 카드', fn: '넘버링·판매상태 뱃지·배송 태그·주문수·찜·재고·가격·마진율·등록일' },
    { el: '카드 이동', fn: '카드 터치 시 상품 상세로 이동', cm: 'M_PROD_P002' },
  ] },
  { domain: 'PROD', code: 'M_PROD_P002', d1: '상품', d2: '상품 상세', rows: [
    { el: '상품 요약', fn: 'No·판매상태·상품명·이미지·판매가/이전가·마진율·태그·등록일' },
    { el: '상품 정보', fn: '상품 식별 코드·담당 입점 공급사 명칭' },
    { el: '카테고리', fn: '연결된 복수 카테고리 경로 전체' },
    { el: '부연 설명 · 연관 검색어', fn: '배송/혜택 문구·내부 검색 최적화 키워드' },
    { el: '결제수단', fn: '사용 가능 결제수단 활성/비활성 현황' },
    { el: '가격 정보', fn: '공급가격·판매가격·이전 판매가격' },
    { el: '상품 메모', fn: '관리자 내부 운영/검수용 메모' },
  ] },
  { domain: 'PROD', code: 'M_PROD_P003', d1: '상품', d2: '상품 검색', rows: [
    { el: '검색 필드', fn: '상품명 또는 상품코드(부분 일치) 입력, 입력 즉시 필터링', cm: '결과 없으면 빈 상태 안내' },
    { el: '검색 결과', fn: '조건에 맞는 상품 결과 카드 목록' },
  ] },
  { domain: 'PROD', code: 'M_PROD_P004', d1: '상품', d2: '상품 필터', rows: [
    { el: '필터 조건', fn: '상품상태·배송형태·과세구분·결제수단·선물하기 다중 선택', cm: '전체 선택 시 하위 자동 체크' },
    { el: '초기화 · 적용', fn: '[초기화] 조건 해제 · [적용] 시 목록 재조회', cm: '취소/외부 터치 시 미반영 닫힘' },
  ] },
  // ── MY ──
  { domain: 'MYPG', code: 'M_MYPG_P001', d1: 'MY', d2: '내 계정', rows: [
    { el: '계정 프로필', fn: '상호명·이름/계정 등급 태그·로그인 이메일' },
    { el: '푸시 알림 진입', fn: '알림 설정 화면으로 진입(우측 화살표)', cm: 'M_MYPG_P002' },
    { el: '로그아웃', fn: '세션 종료 후 로그인 화면으로 이동', cm: 'M_CMMN_P002' },
  ] },
  { domain: 'MYPG', code: 'M_MYPG_P002', d1: 'MY', d2: '푸시 알림', rows: [
    { el: '알림 설정 목록', fn: '서비스 알림·공지·매출 브리핑·CRM 지표 등 6종 ON/OFF' },
    { el: '즉시 저장', fn: '토글 변경 즉시 실시간 저장', cm: '저장 버튼 없음' },
  ] },
];

// 기능정의서 표 — rowspan·직사각 셀·구분선, 참조 포맷과 동일. 폭이 넓어 가로 스크롤 컨테이너로 감쌈.
function FuncSpecTable() {
  const bd = '1px solid #DBDBE0';
  const thick = '2px solid #ADADB4';
  const cols: { h: string; w?: string }[] = [
    { h: 'Domain', w: '64px' }, { h: '화면ID', w: '110px' }, { h: '1Depth', w: '58px' }, { h: '2Depth', w: '104px' },
    { h: 'Element', w: '148px' }, { h: 'Function' }, { h: 'Comment', w: '176px' },
  ];
  const th: React.CSSProperties = { background: '#37373D', color: '#fff', fontSize: '12.5px', fontWeight: 700, padding: '11px 12px', textAlign: 'center', whiteSpace: 'nowrap' };
  const idc: React.CSSProperties = { border: bd, padding: '9px 10px', fontSize: '12px', textAlign: 'center', verticalAlign: 'middle', color: '#3F3F46', background: '#fff', lineHeight: 1.5 };
  const elc: React.CSSProperties = { border: bd, borderLeft: thick, padding: '9px 12px', fontSize: '12.5px', fontWeight: 700, color: '#27272A', verticalAlign: 'top', lineHeight: 1.55, wordBreak: 'keep-all', background: '#fff' };
  const fnc: React.CSSProperties = { border: bd, padding: '9px 12px', fontSize: '12.5px', color: '#3F3F46', verticalAlign: 'top', lineHeight: 1.6, wordBreak: 'keep-all', background: '#fff' };
  const cmc: React.CSSProperties = { border: bd, padding: '9px 12px', fontSize: '12px', color: '#71717A', verticalAlign: 'top', lineHeight: 1.55, wordBreak: 'keep-all', background: '#fff' };
  return (
    <Box overflowX="auto" border={bd} bg="#fff">
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1040px', tableLayout: 'fixed' }}>
        <colgroup>{cols.map((c, i) => <col key={i} style={{ width: c.w }} />)}</colgroup>
        <thead>
          <tr>{cols.map((c, i) => <th key={c.h} style={{ ...th, borderLeft: i === 4 ? thick : (i ? '1px solid #4B4B52' : undefined) }}>{c.h}</th>)}</tr>
        </thead>
        <tbody>
          {FUNC_SPEC.map((s) => s.rows.map((r, ri) => (
            <tr key={s.code + ri}>
              {ri === 0 && <>
                <td rowSpan={s.rows.length} style={{ ...idc, borderTop: thick, fontWeight: 700, whiteSpace: 'nowrap' }}>{s.domain}</td>
                <td rowSpan={s.rows.length} style={{ ...idc, borderTop: thick, fontFamily: 'monospace', fontSize: '11.5px', whiteSpace: 'nowrap' }}>{s.code}</td>
                <td rowSpan={s.rows.length} style={{ ...idc, borderTop: thick, whiteSpace: 'nowrap' }}>{s.d1}</td>
                <td rowSpan={s.rows.length} style={{ ...idc, borderTop: thick, fontWeight: 700, wordBreak: 'keep-all' }}>{s.d2}</td>
              </>}
              <td style={{ ...elc, borderTop: ri === 0 ? thick : bd }}>{r.el}</td>
              <td style={{ ...fnc, borderTop: ri === 0 ? thick : bd }}>{r.fn}</td>
              <td style={{ ...cmc, borderTop: ri === 0 ? thick : bd }}>{r.cm || ''}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </Box>
  );
}

// 기능정의서 — 좌측 트리의 독립 메뉴(전체 화면 기능정의 표를 담은 단독 문서 페이지)
function FuncSpec() {
  const OFONT = "'Pretendard', system-ui, sans-serif";
  const GREEN = '#29BC25';
  return (
    <Box minH="100dvh" bg="#F6F6F7" fontFamily={OFONT} color="#18181B">
      <Box bg="#fff" borderBottom="1px solid #E4E4E7" px="48px" py="40px">
        <Box maxW="1180px" mx="auto">
          <Flex gap="8px" pb="14px" wrap="wrap">
            <Text as="span" bg={GREEN} color="#fff" fontSize="13px" fontWeight={800} borderRadius="7px" px="11px" py="5px">FLEXG</Text>
            <Text as="span" bg="#F1F1F3" color="#3F3F46" fontSize="13px" fontWeight={700} borderRadius="7px" px="11px" py="5px">모바일 앱</Text>
          </Flex>
          <Text fontSize="30px" fontWeight={800} letterSpacing="-0.02em" pb="10px">기능정의서</Text>
          <Text fontSize="15px" color="#52525B" lineHeight="1.7" maxW="860px">
            전체 화면(25 화면 · 12 모달)의 화면별 구성 요소(Element)와 기능·비고를 한 표로 정의. Domain · 화면ID · 1Depth · 2Depth 기준으로 정렬.
          </Text>
        </Box>
      </Box>
      <Box px="48px" py="36px" maxW="1180px" mx="auto">
        <FuncSpecTable />
      </Box>
    </Box>
  );
}

function Overview() {
  const OFONT = "'Pretendard', system-ui, sans-serif";
  const GREEN = '#29BC25';
  const [active, setActive] = useState(OV_SECTIONS[0].id);

  // 스크롤 스파이 — 현재 보이는 섹션을 목차에서 하이라이트
  useEffect(() => {
    const els = OV_SECTIONS.map((s) => document.getElementById('ovsec-' + s.id)).filter(Boolean) as HTMLElement[];
    // 관찰자 콜백은 '변경된' 엔트리만 주므로, 전체 가시 상태를 누적 기록한 뒤 DOM 순서상 첫 가시 섹션을 활성으로.
    const visible: Record<string, boolean> = {};
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { visible[e.target.id] = e.isIntersecting; });
        const first = els.find((el) => visible[el.id]);
        if (first) setActive(first.id.replace('ovsec-', ''));
      },
      { rootMargin: '0px 0px -68% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // 클릭 시 즉시 강조 + 해당 영역으로 이동(관찰자가 이후 보정)
  const go = (id: string) => {
    setActive(id);
    document.getElementById('ovsec-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const meta = [
    { k: '서비스', v: 'FLEXG' },
    { k: '플랫폼', v: '모바일 앱 (iOS·Android)' },
    { k: '화면 수', v: '25 화면 + 12 모달' },
    { k: '상태', v: '작성 완료' },
    { k: '작성자', v: '컨버전스 이하연' },
    { k: '버전', v: 'V1.0' },
  ];
  const goals: { t: string; d: string }[] = [
    { t: '진입 즉시 상황 파악', d: '로그인 직후 진입하는 홈에서 오늘 매출·주문 상태·처리할 일을 3초 안에 인지.' },
    { t: '처리 누락 방지', d: '미답변 CS·신규 주문·재고 부족 등 즉시 대응할 항목을 「지금 처리할 일」로 상단에 모음.' },
    { t: '한 손 딥링크 이동', d: '요약 항목에서 한 번의 탭으로 주문 상세·상품 상세·통계 분류로 바로 이동.' },
    { t: '어디서나 운영', d: '매장 밖에서도 매출·통계·주문을 확인하고 CS·재고에 대응하는 모바일 운영 콘솔.' },
  ];
  const metricRows = [
    ['진입 후 오늘 할 일 인지 시간', '3초 이내'],
    ['미답변 CS 24시간 처리율', '90% 이상'],
    ['홈 → 상세(주문·상품·통계) 이동률', '방문의 60% 이상'],
  ];
  const scopeRows: { in: boolean; t: string; d: string }[] = [
    { in: true, t: '1차', d: '정보 확인(조회) — 인증 · 홈(대시보드·알림·공지) · 주문(목록·상세) · 통계(허브·매출현황·분류별) · 상품(목록·상세·검색·필터) · MY(내 계정·푸시 알림)' },
    { in: false, t: '2차', d: '데이터 등록·수정·삭제(상품 등록·주문 처리·설정 변경 등) · 결제/정산 실집행 · 권한 관리 등 고도화' },
  ];
  const screenAreas: [string, string, string][] = [
    ['인증', '앱 진입 시 토큰 검증 후 대시보드/로그인 분기, 대표·부계정 로그인', '스플래시 · 로그인'],
    ['홈', '가장 자주 보는 정보를 압축 배치한 진입 허브 + 알림·공지', '메인 대시보드 · 알림 · 공지'],
    ['주문', '상태·기간별 주문 흐름 파악과 개별 주문의 결제·배송·CS 통합 조회', '주문 목록 · 주문 상세'],
    ['통계', '매출/주문/회원/트래픽 4카테고리 진입 + 채널·경로·상품·담당자 등 분류별 매출', '통계 허브 · 매출현황 · 분류별 매출'],
    ['상품', '등록 상품의 판매 상태·재고·성과 조회와 상세·검색·필터', '상품 목록 · 상세 · 검색 · 필터'],
    ['MY', '로그인 계정 정보 확인과 앱 설정(푸시 알림 수신) 제어', '내 계정 · 푸시 알림'],
  ];
  const flowSteps = [
    '앱 진입 시 스플래시가 토큰을 검증 — 유효하면 메인 대시보드, 만료/없음이면 로그인으로 분기.',
    '로그인(대표·부계정)에 성공하면 메인 대시보드로 즉시 이동.',
    '홈 상단 「지금 처리할 일」에서 미답변 CS·신규 주문·재고 부족을 확인하고 해당 화면으로 딥링크.',
    '주문 목록에서 상태·기간으로 좁힌 뒤 주문 상세로 들어가 결제·배송·CS 내역을 확인.',
    '통계 허브에서 카테고리를 골라 분류별 매출을 조회하고, MY에서 알림 수신을 관리.',
  ];
  const userRows: [string, string, string][] = [
    ['대표계정(최고 관리자)', '앱 전체 기능', '일상 모니터링 · 주문/CS 대응 · 통계 확인 · 설정'],
    ['부계정(운영 담당자)', '허용된 권한 스코프', '위임받은 범위 내 주문·상품·통계 확인 및 대응'],
    ['미인증(로그아웃 상태)', '로그인 화면만', '대표/부계정으로 인증 후 진입'],
  ];
  const notes = [
    '1차 런칭은 정보 확인(조회) 전용. 데이터 등록·수정·삭제는 2차 고도화 범위.',
    '지표는 실시간 항목(주문 상태·처리할 일)과 집계 항목(매출·통계)의 갱신 주기가 다름(홈 30초 폴링).',
    '「PC 반영 필요」로 표시된 화면(메인 대시보드·통계 등)은 어드민(PC)에도 대응 예정.',
    '오프라인 시 마지막 동기화 데이터 + 안내 배너를 노출.',
  ];

  const label = { fontSize: '13px', fontWeight: 800, color: GREEN, letterSpacing: '0.02em' } as const;
  const th = { fontSize: '12.5px', fontWeight: 800, color: '#71717A', letterSpacing: '0.01em' } as const;

  const Sec = ({ id, n, t, children }: { id: string; n: string; t: string; children: React.ReactNode }) => (
    <Box id={'ovsec-' + id} pt="58px" scrollMarginTop="24px">
      <Flex align="center" gap="10px" pb="14px">
        <Text fontFamily="monospace" fontSize="16px" fontWeight={700} color={GREEN}>{n}</Text>
        <Text fontSize="21px" fontWeight={800} letterSpacing="-0.01em">{t}</Text>
      </Flex>
      {children}
    </Box>
  );

  // 문서형 표 — 라운드 없이 직사각, 셀은 문자열 또는 노드
  const DTable = ({ cols, rows }: { cols: { h: string; w?: string }[]; rows: React.ReactNode[][] }) => (
    <Box bg="#fff" border="1px solid #E8E8EA" overflow="hidden">
      <Flex bg="#F7F7F8" borderBottom="1px solid #EAEAEC">
        {cols.map((c, i) => (
          <Box key={i} flex={c.w ? undefined : '1'} w={c.w} flexShrink={c.w ? 0 : undefined} px="16px" py="11px" borderLeft={i ? '1px solid #EAEAEC' : undefined}>
            <Text {...th}>{c.h}</Text>
          </Box>
        ))}
      </Flex>
      {rows.map((r, ri) => (
        <Flex key={ri} borderTop={ri ? '1px solid #F0F0F2' : undefined} align="stretch">
          {r.map((cell, ci) => (
            <Box key={ci} flex={cols[ci].w ? undefined : '1'} w={cols[ci].w} flexShrink={cols[ci].w ? 0 : undefined} px="16px" py="13px" borderLeft={ci ? '1px solid #F0F0F2' : undefined}>
              {typeof cell === 'string' ? <Text fontSize="14px" color="#3F3F46" lineHeight="1.65">{cell}</Text> : cell}
            </Box>
          ))}
        </Flex>
      ))}
    </Box>
  );

  return (
    <Box minH="100dvh" bg="#F6F6F7" fontFamily={OFONT} color="#18181B">
      {/* ── 표지: 제목 + 메타 + CTA ── */}
      <Box bg="#fff" borderBottom="1px solid #E4E4E7" px="48px" py="46px">
        <Box maxW="1180px" mx="auto">
          <Flex justify="space-between" align="flex-start" gap="24px" wrap="wrap" pb="26px">
            <Box>
              <Text {...label} pb="14px">프로토타입 개요</Text>
              <Flex gap="8px" pb="16px" wrap="wrap">
                <Text as="span" bg={GREEN} color="#fff" fontSize="13px" fontWeight={800} borderRadius="7px" px="11px" py="5px">FLEXG</Text>
                <Text as="span" bg="#F1F1F3" color="#3F3F46" fontSize="13px" fontWeight={700} borderRadius="7px" px="11px" py="5px">모바일 앱</Text>
              </Flex>
              <Text fontSize="34px" fontWeight={800} letterSpacing="-0.02em" pb="14px">FLEXG 모바일 앱</Text>
              <Text fontSize="16px" color="#52525B" lineHeight="1.7" maxW="820px">
                1인 사장님·운영자가 로그인 직후 매출·주문·통계·상품을 폰 한 화면에서 확인하고, 오늘 처리할 일로 바로 이동하는 모바일 운영 콘솔.
              </Text>
            </Box>
          </Flex>

          <Flex bg="#FAFAFA" border="1px solid #ECECEE" overflow="hidden" wrap="wrap">
            {meta.map((m, i) => (
              <Box key={m.k} flex="1 1 150px" px="18px" py="14px" borderLeft={i === 0 ? undefined : '1px solid #ECECEE'}>
                <Text fontSize="12px" fontWeight={700} color="#A1A1AA" pb="5px">{m.k}</Text>
                <Text fontSize="14.5px" fontWeight={700} color="#27272A">{m.v}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ── 본문(좌) + 플로팅 목차(우) ── */}
      <Box px="48px" pt="6px" pb="56px" maxW="1180px" mx="auto">
        <Flex gap="48px" align="flex-start">
          <Box flex="1" minW="0">
            <Sec id="overview" n="01" t="개요 · 배경">
              <Text fontSize="15px" color="#3F3F46" lineHeight="1.9" whiteSpace="pre-line">
                {'1인 사장님·운영자는 이동 중에도 매출을 확인하고 주문·고객 문의 상황을 파악해야 한다. 그동안 이 정보는 PC 어드민의 여러 메뉴에 흩어져 있어, 매장 밖에서는 상황을 제때 확인하기 어려웠다.\n\nFLEXG 모바일 앱은 로그인 직후 첫 화면에서 「지금 매장이 어떤 상태인지」와 「먼저 확인해야 할 것이 무엇인지」를 한눈에 보여준다. 요약 지표로 전체 흐름을 파악하고, 각 항목에서 주문·상품·통계 상세로 바로 이동해 어디서나 확인한다.\n\n1차 런칭은 이 「정보 확인(조회)」에 집중한다. 데이터 등록·수정·삭제(상품 등록, 주문 처리, 설정 변경 등)는 2차 고도화에서 제공한다.'}
              </Text>
            </Sec>

            <Sec id="goal" n="02" t="목적">
              <Flex direction="column" gap="14px">
                {goals.map((g) => (
                  <Flex key={g.t} align="flex-start" gap="12px">
                    <Box mt="7px" w="6px" h="6px" borderRadius="full" bg={GREEN} flexShrink={0} />
                    <Box>
                      <Text fontSize="15px" fontWeight={800} color="#27272A" pb="2px">{g.t}</Text>
                      <Text fontSize="14px" color="#52525B" lineHeight="1.7">{g.d}</Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Sec>

            <Sec id="metric" n="03" t="성공 기준">
              <Text fontSize="14px" color="#71717A" lineHeight="1.7" pb="14px">이 앱이 잘 작동하는지 판단하는 기준(예시 목표치).</Text>
              <DTable
                cols={[{ h: '지표' }, { h: '목표', w: '220px' }]}
                rows={metricRows.map((r) => [
                  <Text key="a" fontSize="14px" fontWeight={700} color="#27272A" lineHeight="1.6">{r[0]}</Text>,
                  <Text key="b" fontSize="14px" color="#3F3F46" fontWeight={700} lineHeight="1.6">{r[1]}</Text>,
                ])}
              />
            </Sec>

            <Sec id="scope" n="04" t="범위">
              <DTable
                cols={[{ h: '구분', w: '110px' }, { h: '내용' }]}
                rows={scopeRows.map((s) => [
                  <Flex key="a" h="100%" align="center">
                    <Text as="span" fontSize="12px" fontWeight={800} borderRadius="6px" px="9px" py="4px" bg={s.in ? '#EAF8EA' : '#F3F3F5'} color={s.in ? '#1E8F1B' : '#71717A'}>{s.t}</Text>
                  </Flex>,
                  s.d,
                ])}
              />
            </Sec>

            <Sec id="screen" n="05" t="화면 구성">
              <Text fontSize="14px" color="#71717A" lineHeight="1.7" pb="14px">앱은 6개 영역(하단 탭 기준)으로 구성된다.</Text>
              <DTable
                cols={[{ h: '영역', w: '120px' }, { h: '설명' }, { h: '주요 화면', w: '210px' }]}
                rows={screenAreas.map((a) => [
                  <Text key="a" fontSize="14px" fontWeight={800} color="#18181B" lineHeight="1.55">{a[0]}</Text>,
                  a[1],
                  <Text key="c" fontSize="13px" color="#71717A" lineHeight="1.6">{a[2]}</Text>,
                ])}
              />
              <a href="/docs/login" target="_top" style={{ textDecoration: 'none', display: 'block' }}>
                <Flex mt="10px" bg="#fff" border="1px solid #E8E8EA" px="18px" py="15px" align="center" gap="14px" _hover={{ bg: '#FAFAFA' }} transition="background .12s">
                  <Box flex="1">
                    <Text fontSize="14px" fontWeight={800} color="#18181B" pb="3px">로그인 화면 미리보기</Text>
                    <Text fontSize="13px" color="#71717A">인증 화면부터 문서 프리뷰로 열기</Text>
                  </Box>
                  <Text fontSize="17px" color={GREEN} fontWeight={700}>→</Text>
                </Flex>
              </a>
            </Sec>

            <Sec id="flow" n="06" t="주요 사용자 플로우">
              <Flex direction="column" gap="12px">
                {flowSteps.map((s, i) => (
                  <Flex key={i} align="flex-start" gap="14px">
                    <Flex w="24px" h="24px" flexShrink={0} align="center" justify="center" borderRadius="full" bg="#EAF8EA" mt="1px">
                      <Text fontSize="12px" fontWeight={800} color="#1E8F1B">{i + 1}</Text>
                    </Flex>
                    <Text fontSize="15px" color="#3F3F46" lineHeight="1.7" pt="2px">{s}</Text>
                  </Flex>
                ))}
              </Flex>
            </Sec>

            <Sec id="user" n="07" t="대상 사용자 · 권한">
              <DTable
                cols={[{ h: '역할', w: '190px' }, { h: '접근 범위', w: '180px' }, { h: '주요 사용' }]}
                rows={userRows.map((u) => [
                  <Text key="a" fontSize="14px" fontWeight={800} color="#18181B" lineHeight="1.55">{u[0]}</Text>,
                  <Text key="b" fontSize="14px" color="#3F3F46" lineHeight="1.6">{u[1]}</Text>,
                  u[2],
                ])}
              />
            </Sec>

            <Sec id="note" n="08" t="참고 사항">
              <Box bg="#FBFBFC" border="1px solid #EDEDEF" p="18px 20px">
                <Flex direction="column" gap="10px">
                  {notes.map((n, i) => (
                    <Flex key={i} align="flex-start" gap="10px">
                      <Box mt="8px" w="5px" h="5px" borderRadius="full" bg="#C4C4C8" flexShrink={0} />
                      <Text fontSize="14px" color="#52525B" lineHeight="1.7">{n}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Sec>
          </Box>

          {/* 플로팅 목차 */}
          <Box as="aside" w="212px" flexShrink={0} display={{ base: 'none', lg: 'block' }} position="sticky" top="24px" alignSelf="flex-start">
            <Box bg="#fff" border="1px solid #ECECEE" borderRadius="12px" p="14px 12px" boxShadow="0 1px 3px rgba(0,0,0,0.04)">
              <Text fontSize="11px" fontWeight={800} color="#A1A1AA" letterSpacing="0.06em" pb="10px" pl="8px">이 페이지</Text>
              <Flex direction="column" gap="1px">
                {OV_SECTIONS.map((s) => {
                  const on = active === s.id;
                  return (
                    <Flex as="button" key={s.id} onClick={() => go(s.id)} align="center" gap="9px" w="100%"
                      px="8px" py="7px" borderRadius="7px" cursor="pointer" bg={on ? '#F1FAF1' : 'transparent'}
                      _hover={{ bg: on ? '#F1FAF1' : '#F6F6F7' }} transition="background .12s" textAlign="left">
                      <Text fontFamily="monospace" fontSize="11px" fontWeight={700} color={on ? GREEN : '#C4C4C8'}>{s.n}</Text>
                      <Text fontSize="13px" fontWeight={on ? 700 : 500} color={on ? '#18181B' : '#71717A'}>{s.t}</Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

// 라우트 → 화면 매핑
export function DemoScreen() {
  const path = window.location.pathname.replace(/^\/preview\//, '');
  switch (path) {
    case 'funcspec': return <FuncSpec />;
    case 'overview': return <Overview />;
    case 'splash': return <Splash />;
    case 'login': return <Login />;
    case 'password-reset': return <PasswordReset />;
    case 'dashboard': return <Dashboard />;
    case 'notifications': return <Notifications />;
    case 'notice-detail': return <NoticeDetail />;
    case 'todo-all': return <TodoAll />;
    case 'best-all': return <BestAll />;
    case 'recent-all': return <RecentAll />;
    case 'order-list': return <OrderList />;
    case 'order-detail': return <OrderDetail />;
    case 'stat-hub': return <StatHub />;
    case 'stat-sales': return <SalesStatus />;
    case 'product-list': return <ProductList />;
    case 'product-detail': return <ProductDetail />;
    case 'product-search': return <ProductSearch />;
    case 'product-filter': return <ProductFilterView />;
    case 'my-account': return <MyAccount />;
    case 'push-settings': return <PushSettings />;
    default: {
      const m = path.match(/^stat-([a-z]+)(?:-(detail|filter))?$/);
      if (m && STAT[m[1]]) {
        if (m[2] === 'detail') return <CategorySheet cfg={STAT[m[1]]} kind="detail" />;
        if (m[2] === 'filter') return <CategorySheet cfg={STAT[m[1]]} kind="filter" />;
        return <CategoryStat cfg={STAT[m[1]]} />;
      }
      return <Flex minH="100dvh" align="center" justify="center" fontFamily={FONT}><Text>알 수 없는 프리뷰: {path}</Text></Flex>;
    }
  }
}
