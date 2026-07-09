import { useRef, useState } from 'react';
import { Box, Flex, Image, Input, Text } from '@chakra-ui/react';
import { c, FONT, basset } from '../broadapp/theme';
import { StatusBar, HomeIndicator } from '../broadapp/frame';
import { NoticeIcon } from '../broadapp/icons';

/* ── 공지 카드 (읽기 전용, 펼침형) ── */
function NoticeCard() {
  const [open, setOpen] = useState(false);
  return (
    <Box w="260px">
      <Flex as="button" align="center" gap="6px" w="100%" px="10px" py="6px" bg="rgba(17,17,17,0.7)" backdropFilter="blur(2px)" borderTopRadius="14px" borderBottomRadius={open ? '0' : '14px'} cursor="pointer" onClick={() => setOpen((o) => !o)}>
      <NoticeIcon s={16} />
      <Text flex="1" textAlign="left" fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.35px" color={c.white}>공지</Text>
      <Text fontSize="11px" color={c.white} transform={open ? 'rotate(180deg)' : undefined} transition="transform 0.15s">⌄</Text>
      </Flex>
      {open && (
        <Box bg="rgba(255,255,255,0.88)" borderBottomRadius="14px" p="16px">
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr42} lineHeight="1.6" whiteSpace="pre-line">
            {'😎 공지사항 기능이 추가됬습니다\n\n💰 적립금 : 포토 리뷰 작성 시 현금처럼 쓰는 포인트 2,000P 즉시 적립!\n\n🔔 알림 설정 : 다음 라이브 알림 설정하고 시크릿 할인 코드를 받아보세요!'}
          </Text>
        </Box>
      )}
    </Box>
  );
}

/* ── 인라인 아이콘 ── */
const S = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const ShareIcon = ({ s = 22, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}><circle cx="18" cy="5" r="2.5" stroke={color} strokeWidth="1.7" /><circle cx="6" cy="12" r="2.5" stroke={color} strokeWidth="1.7" /><circle cx="18" cy="19" r="2.5" stroke={color} strokeWidth="1.7" /><path d="M8.2 10.8 15.8 6.3M8.2 13.2l7.6 4.5" stroke={color} strokeWidth="1.7" /></svg>
);
const VolumeIcon = ({ s = 22, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}><path d="M4 9v6h3l5 4V5L7 9H4Z" stroke={color} strokeWidth="1.7" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" stroke={color} strokeWidth="1.7" /></svg>
);
const CloseIcon = ({ s = 22, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}><path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth="2" /></svg>
);
const ChevronRight = ({ s = 16, color = 'rgba(255,255,255,0.7)' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" /></svg>
);
const SendIcon = ({ s = 20, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" {...S}><path d="M4 12 20 4l-6 16-3-7-7-1Z" stroke={color} strokeWidth="1.8" /></svg>
);
const GearMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill={c.red} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke={c.red} strokeWidth="2" strokeLinecap="round" /></svg>
);
const ProductListIcon = ({ s = 30, color = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
    <path d="M5 10 16 5l11 5v8l-11 5L5 18V10Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 10l11 5 11-5M16 15v9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="19.5" cy="19" r="0.9" fill={color} /><path d="M21.5 19h4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="19.5" cy="22" r="0.9" fill={color} /><path d="M21.5 22h4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const HeartFill = ({ s = 30, color = c.red }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M12 20.5s-7.2-4.6-7.2-9.7A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 7.2 3.8c0 5.1-7.2 9.7-7.2 9.7Z" /></svg>
);

type CMsg =
  | { kind: 'admin'; text: string }
  | { kind: 'user'; user: string; text: string; full?: boolean }
  | { kind: 'buy'; user: string }
  | { kind: 'system'; text: string };

const CHAT: CMsg[] = [
  { kind: 'admin', text: '방송종료 얼마 남지 않았습니다!' },
  { kind: 'user', user: '강남언니', text: '와 색감 미쳤다ㅠㅠ 모델분이 입으신 크림색 니트랑 슬랙스 세트로 사고 싶은데, 제키가 165에 상의 55 정도 입는데 프리사이즈면 너무 부해 보이지 않을까요? ', full: true },
  { kind: 'user', user: '오늘만사는사람', text: '사이즈 정사이즈인가요??' },
  { kind: 'user', user: '내통장은텅장', text: '모델분이 입으신 거 너무 예뻐요!!' },
  { kind: 'user', user: '남편몰래쇼핑', text: '세탁기 돌려도 되는 소재인가요?' },
  { kind: 'buy', user: '식사하셨습니까행' },
];

type Step = 'login' | 'info' | 'live' | 'end';

/* ── 우측 컨트롤 아이템 ── */
function RightCtrl({ src, node, h = 30, label, onClick }: { src?: string; node?: React.ReactNode; h?: number; label?: string; onClick?: () => void }) {
  return (
    <Flex as={onClick ? 'button' : undefined} direction="column" align="center" gap="2px" cursor={onClick ? 'pointer' : 'default'} onClick={onClick}>
      <Flex w="40px" h="40px" align="center" justify="center">{node ?? <Image src={basset(src!)} alt="" h={`${h}px`} draggable={false} />}</Flex>
      {label != null && (
        <Text fontFamily={FONT} fontWeight="700" fontSize="10px" letterSpacing="-0.25px" color="#E8E8E8" whiteSpace="nowrap" textShadow="0 1px 2px rgba(0,0,0,0.5)">{label}</Text>
      )}
    </Flex>
  );
}

/* ── 로그인 모달 (자사몰 소셜 로그인) ── */
function LoginBtn({ bg, color, label, glyph, onClick }: { bg: string; color: string; label: string; glyph: React.ReactNode; onClick: () => void }) {
  return (
    <Flex as="button" w="100%" h="52px" align="center" justify="center" gap="8px" bg={bg} borderRadius="10px" cursor="pointer" onClick={onClick}>
      {glyph}
      <Text fontFamily={FONT} fontWeight="700" fontSize="15px" letterSpacing="-0.3px" color={color}>{label}</Text>
    </Flex>
  );
}

export function LoginCard({ onLogin, onClose, oct }: { onLogin: () => void; onClose: () => void; oct?: boolean }) {
  const [dangolChk, setDangolChk] = useState(true); // 10월: 로그인 시 단골맺기 체크박스(기본 체크)
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.45)" align="center" justify="center" zIndex={40} px="20px">
      <Flex direction="column" w="100%" maxW="335px" bg={c.white} borderRadius="20px" p="20px" gap="16px">
        <Flex align="center">
          <Text flex="1" fontFamily={FONT} fontWeight="700" fontSize="18px" letterSpacing="-0.45px" color={c.gr22} textAlign="center" pl="24px">로그인</Text>
          <Flex as="button" w="24px" h="24px" align="center" justify="center" cursor="pointer" onClick={onClose}><CloseIcon s={20} color={c.gr42} /></Flex>
        </Flex>
        <Flex h="150px" bg="#EDEDED" borderRadius="8px" align="center" justify="center" direction="column" gap="2px">
          <Text fontFamily={FONT} fontSize="13px" color={c.gr92}>로그인 유도 팝업 배너</Text>
          <Text fontFamily={FONT} fontSize="12px" color={c.grB8}>560 x Free</Text>
        </Flex>
        <Flex direction="column" gap="10px">
          <LoginBtn bg="#03C75A" color={c.white} label="네이버 로그인" onClick={onLogin} glyph={<Text fontFamily={FONT} fontWeight="800" fontSize="16px" color={c.white}>N</Text>} />
          <LoginBtn bg="#FEE500" color="#191919" label="카카오 1초 로그인" onClick={onLogin} glyph={<Box w="20px" h="20px" borderRadius="5px" bg="#191919" display="flex" alignItems="center" justifyContent="center"><Text fontSize="9px" fontWeight="800" color="#FEE500">TALK</Text></Box>} />
          <LoginBtn bg="#111111" color={c.white} label="Sign in with Apple" onClick={onLogin} glyph={<Text fontSize="16px" color={c.white}></Text>} />
          <LoginBtn bg="#B8AFA4" color={c.white} label="아이디로 로그인" onClick={onLogin} glyph={null} />
        </Flex>
        {oct && (
          <Flex data-doc-mark="f-login-dangol-chk" as="button" align="center" gap="9px" px="2px" cursor="pointer" onClick={() => setDangolChk((v) => !v)}>
            <Flex w="20px" h="20px" borderRadius="5px" align="center" justify="center" flexShrink={0} bg={dangolChk ? c.red : c.white} border={`1.5px solid ${dangolChk ? c.red : c.grD8}`}>
              {dangolChk && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </Flex>
            <Text fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" textAlign="left"><Box as="span" fontWeight="700" color={c.gr22}>단골맺고 혜택받기</Box></Text>
          </Flex>
        )}
        <Flex justify="center" gap="12px">
          <Flex w="40px" h="40px" borderRadius="9999px" bg={c.grF2} align="center" justify="center">📧</Flex>
          <Flex w="40px" h="40px" borderRadius="9999px" bg={c.grF2} align="center" justify="center">📱</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 정보 입력 모달 (이름·닉네임·휴대폰 인증) — 닉네임 미보유 시 1회 등록 ── */
function InfoCard({ onEnter }: { onEnter: (nick: string) => void }) {
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
  const [reqSent, setReqSent] = useState(false);
  const field = {
    border: 'none', bg: c.grF8, borderRadius: '8px', h: '48px', px: '16px', fontFamily: FONT, fontSize: '14px', color: c.gr22,
    _placeholder: { color: c.gr92 }, _focusVisible: { boxShadow: 'none', outline: 'none' },
  } as const;
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.45)" align="center" justify="center" zIndex={40} px="20px">
      <Flex direction="column" w="100%" maxW="335px" bg={c.white} borderRadius="20px" p="24px" gap="16px" align="center">
        <Text fontSize="40px" lineHeight="1">📘</Text>
        <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.gr22} textAlign="center" lineHeight="1.5">
          라이브 입장 전,<br />혜택 알림과 원활한 채팅을 위해<br />정보를 입력해 주세요.
        </Text>
        <Flex direction="column" gap="8px" w="100%">
          <Input {...field} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해 주세요." />
          <Input {...field} data-doc-mark="f-nickname" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="사용하실 닉네임을 입력해 주세요." />
          <Flex gap="8px">
            <Input {...field} flex="1" textAlign="center" defaultValue="010" />
            <Input {...field} flex="1" textAlign="center" placeholder="0000" inputMode="numeric" />
            <Input {...field} flex="1" textAlign="center" placeholder="0000" inputMode="numeric" />
          </Flex>
          {!reqSent ? (
            <Flex as="button" w="100%" h="48px" align="center" justify="center" bg="#4A4A4A" borderRadius="8px" cursor="pointer" onClick={() => setReqSent(true)}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={c.white}>인증번호 요청</Text>
            </Flex>
          ) : (
            <>
              <Flex as="button" w="100%" h="48px" align="center" justify="center" bg="#4A4A4A" borderRadius="8px" cursor="pointer" onClick={() => setReqSent(true)}>
                <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={c.white}>재요청</Text>
              </Flex>
              <Flex gap="8px" align="center">
                <Flex flex="1" h="48px" align="center" px="16px" bg={c.grF8} borderRadius="8px" gap="8px">
                  <Input border="none" bg="transparent" px="0" h="auto" flex="1" fontFamily={FONT} fontSize="14px" color={c.gr22} placeholder="인증번호 입력" _placeholder={{ color: c.gr92 }} _focusVisible={{ boxShadow: 'none' }} />
                  <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="#FF8A00" flexShrink={0}>01:30</Text>
                </Flex>
                <Flex as="button" h="48px" px="14px" align="center" justify="center" bg={c.gr22} borderRadius="8px" cursor="pointer" flexShrink={0}>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={c.white} whiteSpace="nowrap">인증 확인</Text>
                </Flex>
              </Flex>
              <Text fontFamily={FONT} fontSize="12px" color={c.red} px="4px">인증번호를 다시 확인해주세요.</Text>
            </>
          )}
        </Flex>
        <Flex as="button" w="100%" h="56px" align="center" justify="center" bg="#EC4899" borderRadius="12px" cursor="pointer" onClick={() => onEnter(nick)}>
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" color={c.white}>입력하고 라이브 입장하기</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 닉네임 수정 모달 (방송에서 사용하는 닉네임 변경) ── */
function NickEditModal({ current, onSave, onClose }: { current: string; onSave: (v: string) => void; onClose: () => void }) {
  const [v, setV] = useState(current);
  const field = {
    border: 'none', bg: c.grF8, borderRadius: '8px', h: '48px', px: '16px', fontFamily: FONT, fontSize: '14px', color: c.gr22,
    _placeholder: { color: c.gr92 }, _focusVisible: { boxShadow: 'none', outline: 'none' },
  } as const;
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.45)" align="center" justify="center" zIndex={60} px="20px" onClick={onClose}>
      <Flex direction="column" w="100%" maxW="320px" bg={c.white} borderRadius="20px" p="24px" gap="14px" onClick={(e) => e.stopPropagation()}>
        <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.gr22}>닉네임 수정</Text>
        <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr72} lineHeight="1.5">방송 채팅·단골에서 보여질 닉네임이에요. 중복·금칙어는 사용할 수 없어요.</Text>
        <Input {...field} value={v} onChange={(e) => setV(e.target.value)} placeholder="새 닉네임을 입력해 주세요." />
        <Flex gap="8px">
          <Flex as="button" flex="1" h="48px" align="center" justify="center" bg={c.grF2} borderRadius="10px" cursor="pointer" onClick={onClose}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={c.gr42}>취소</Text>
          </Flex>
          <Flex as="button" flex="1" h="48px" align="center" justify="center" bg="#EC4899" borderRadius="10px" cursor="pointer" onClick={() => onSave(v.trim() || current)}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={c.white}>저장</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 단골 등록 완료 토스트 ── */
function FollowDoneToast() {
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.55)" align="center" justify="center" direction="column" gap="16px" zIndex={50} pointerEvents="none">
      <Flex w="64px" h="64px" borderRadius="9999px" bg={c.red} align="center" justify="center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Flex>
      <Flex direction="column" align="center" gap="6px">
        <Text fontFamily={FONT} fontWeight="800" fontSize="18px" letterSpacing="-0.45px" color={c.white}>단골 등록 완료!</Text>
        <Text fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" color="rgba(255,255,255,0.85)">라이브 알림을 가장 먼저 보내드릴게요.</Text>
      </Flex>
    </Flex>
  );
}

/* ── 단골 해제 확인 모달 ── */
function UnfollowModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.5)" align="center" justify="center" zIndex={50} px="32px">
      <Flex direction="column" w="100%" maxW="320px" bg={c.white} borderRadius="16px" p="20px" gap="16px" align="center">
        <Flex direction="column" gap="6px" align="center" textAlign="center">
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.gr22}>정말 단골을 해제하시겠어요?</Text>
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr72} lineHeight="1.5">단골을 해제하면 라이브 알림과 단골 전용 소식을<br />더 이상 받아볼 수 없습니다.</Text>
        </Flex>
        <Flex gap="8px" w="100%">
          <Flex as="button" flex="1" h="48px" align="center" justify="center" bg={c.grE8} borderRadius="10px" cursor="pointer" onClick={onCancel}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="15px" letterSpacing="-0.4px" color={c.gr72}>취소</Text>
          </Flex>
          <Flex as="button" flex="1" h="48px" align="center" justify="center" bg="#EC4899" borderRadius="10px" cursor="pointer" onClick={onConfirm}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="15px" letterSpacing="-0.4px" color={c.white}>해제하기</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

/* ── 공유 모달 (앱 자체 공유 레이어) ── */
function ShareItem({ bg, glyph, label, onClick, gradient }: { bg?: string; glyph: React.ReactNode; label: string; onClick: () => void; gradient?: string }) {
  return (
    <Flex as="button" direction="column" align="center" gap="6px" w="64px" cursor="pointer" onClick={onClick}>
      <Flex w="52px" h="52px" borderRadius="9999px" bg={bg} style={gradient ? { background: gradient } : undefined} align="center" justify="center">{glyph}</Flex>
      <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr42} whiteSpace="nowrap">{label}</Text>
    </Flex>
  );
}

function ShareModal({ onClose, onCopy }: { onClose: () => void; onCopy: () => void }) {
  return (
    <Flex position="absolute" inset="0" bg="rgba(0,0,0,0.5)" align="center" justify="center" direction="column" gap="20px" zIndex={50} px="24px">
      <Flex direction="column" w="100%" maxW="320px" bg={c.white} borderRadius="20px" p="24px" gap="20px" align="center">
        <Flex direction="column" gap="4px" align="center" textAlign="center">
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.gr22}>친구나 지인에게 공유하고 싶으신가요?</Text>
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr72} lineHeight="1.5">URL 복사 or SNS 아이콘을 눌러<br />공유할 수 있습니다.</Text>
        </Flex>
        <Flex direction="column" gap="14px" align="center">
          <Flex gap="10px" justify="center">
            <ShareItem bg="#FEE500" label="카카오톡" onClick={onClose} glyph={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 4.5c-4.5 0-8 2.7-8 6 0 2.1 1.5 4 3.8 5l-.8 2.9 3.2-1.9c.6.1 1.2.1 1.8.1 4.5 0 8-2.7 8-6s-3.5-6-8-6Z" fill="#191919" /></svg>
            } />
            <ShareItem bg="#1877F2" label="페이스북" onClick={onClose} glyph={<Text fontFamily="Georgia, serif" fontWeight="800" fontSize="26px" color={c.white} lineHeight="1">f</Text>} />
            <ShareItem gradient="linear-gradient(45deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)" label="인스타그램" onClick={onClose} glyph={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" /><circle cx="17" cy="7" r="1.1" fill="#fff" /></svg>
            } />
          </Flex>
          <Flex gap="10px" justify="center">
            <ShareItem bg="#34C759" label="SMS" onClick={onClose} glyph={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H9l-4 3v-3H4V5Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8 10h8M8 13h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
            } />
            <ShareItem bg="#EFEFEF" label="URL 복사" onClick={onCopy} glyph={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 8h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke={c.gr42} strokeWidth="1.7" /><path d="M5 16a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" stroke={c.gr42} strokeWidth="1.7" /></svg>
            } />
          </Flex>
        </Flex>
      </Flex>
      <Flex as="button" w="46px" h="46px" borderRadius="9999px" bg="rgba(255,255,255,0.92)" align="center" justify="center" cursor="pointer" onClick={onClose}>
        <CloseIcon s={22} color={c.gr42} />
      </Flex>
    </Flex>
  );
}

/* ── 수량 스텝 버튼 ── */
function QtyStepBtn({ sign, onClick }: { sign: string; onClick: () => void }) {
  return (
    <Flex as="button" w="34px" h="34px" align="center" justify="center" cursor="pointer" onClick={onClick}>
      <Text fontFamily={FONT} fontWeight="500" fontSize="18px" color={c.gr42} lineHeight="1">{sign}</Text>
    </Flex>
  );
}

/* ── 상품 이미지 여러 컷 (프로토 데모 갤러리) ── */
const PRODUCT_GALLERY = ['live-product.png', 'home-products.png', 'live-bg.png'];

/* 썸네일 우하단 배지 — 여러 컷(2장 이상)이면 "여러 장(장수)" 표시, 1장이면 돋보기(확대) */
function ZoomBadge({ count = 1 }: { count?: number }) {
  if (count > 1) {
    return (
      <Flex position="absolute" right="3px" bottom="3px" h="16px" px="4px" gap="2px" borderRadius="9999px" bg="rgba(0,0,0,0.62)" align="center" justify="center" pointerEvents="none">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.2" stroke="#fff" strokeWidth="1.2" /><path d="M2 8.5V2.2A0.8 0.8 0 012.8 1.4H8.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" /></svg>
        <Text fontFamily={FONT} fontWeight="700" fontSize="9px" color="#fff" lineHeight="1">{count}</Text>
      </Flex>
    );
  }
  return (
    <Flex position="absolute" right="3px" bottom="3px" w="16px" h="16px" borderRadius="9999px" bg="rgba(0,0,0,0.55)" align="center" justify="center" pointerEvents="none">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.2" stroke="#fff" strokeWidth="1.3" /><path d="M7.6 7.6L10 10" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" /></svg>
    </Flex>
  );
}

/* ── 상품 이미지 확대 뷰어 (풀스크린 · 여러 컷 스와이프 · 탭 확대) ── */
function ProductZoom({ imgs, start, onClose }: { imgs: string[]; start: number; onClose: () => void }) {
  const [idx, setIdx] = useState(start);
  const [zoomed, setZoomed] = useState(false); // 탭 시 2배 확대 토글
  const touchX = useRef<number | null>(null);
  const go = (d: number) => { setZoomed(false); setIdx((i) => Math.min(imgs.length - 1, Math.max(0, i + d))); };
  return (
    <Flex position="absolute" inset="0" zIndex={60} direction="column" bg="rgba(0,0,0,0.94)" style={{ animation: 'fadeIn 0.18s ease-out' }}>
      {/* 상단바: 카운트 + 닫기 */}
      <Flex h="52px" align="center" justify="space-between" px="18px" flexShrink={0}>
        <Text fontFamily={FONT} fontWeight="700" fontSize="13px" color="rgba(255,255,255,0.9)">{idx + 1} / {imgs.length}</Text>
        <Box as="button" cursor="pointer" onClick={onClose} p="4px">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M17 5L5 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
        </Box>
      </Flex>

      {/* 이미지 영역 — 좌우 스와이프로 컷 이동, 탭으로 확대 */}
      <Box
        data-doc-mark="f-viewer-zoom-view"
        flex="1"
        minH="0"
        position="relative"
        overflow="hidden"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null || zoomed) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 40) go(-1); else if (dx < -40) go(1);
          touchX.current = null;
        }}
      >
        <Flex position="absolute" inset="0" align="center" justify="center" onClick={() => setZoomed((z) => !z)} cursor={zoomed ? 'zoom-out' : 'zoom-in'}>
          <Image
            src={basset(imgs[idx])}
            alt=""
            maxW="100%"
            maxH="100%"
            objectFit="contain"
            draggable={false}
            style={{ transform: zoomed ? 'scale(2)' : 'scale(1)', transition: 'transform 0.22s ease-out' }}
          />
        </Flex>

        {/* 좌우 이동 버튼 (여러 컷일 때) */}
        {imgs.length > 1 && !zoomed && (
          <>
            {idx > 0 && (
              <Box as="button" position="absolute" left="8px" top="50%" transform="translateY(-50%)" w="34px" h="34px" borderRadius="9999px" bg="rgba(0,0,0,0.4)" cursor="pointer" onClick={() => go(-1)}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M20 11l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Box>
            )}
            {idx < imgs.length - 1 && (
              <Box as="button" position="absolute" right="8px" top="50%" transform="translateY(-50%)" w="34px" h="34px" borderRadius="9999px" bg="rgba(0,0,0,0.4)" cursor="pointer" onClick={() => go(1)}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M14 11l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 하단 도트 인디케이터 */}
      {imgs.length > 1 && (
        <Flex h="40px" align="center" justify="center" gap="6px" flexShrink={0}>
          {imgs.map((_, i) => (
            <Box key={i} w={i === idx ? '18px' : '6px'} h="6px" borderRadius="9999px" bg={i === idx ? '#fff' : 'rgba(255,255,255,0.4)'} transition="all 0.2s" cursor="pointer" onClick={() => { setZoomed(false); setIdx(i); }} />
          ))}
        </Flex>
      )}
      <Text fontFamily={FONT} fontSize="11px" color="rgba(255,255,255,0.45)" textAlign="center" pb="10px">이미지를 탭하면 확대 · 좌우로 넘겨 더 보기</Text>
    </Flex>
  );
}

/* ── 상품담기 바텀시트 (아래에서 위로) ── */
function AddCartSheet({ onClose, onAddCart, payMode, oct, onZoom }: { onClose: () => void; onAddCart: () => void; payMode: 'live' | 'after'; oct?: boolean; onZoom: (start?: number) => void }) {
  const MAX_QTY = 5; // 10월(oct): 최대구매수량(데모) — + 캡 + 도달 시 안내 노출(담기 버튼은 활성 유지)
  const [qty, setQty] = useState(1);
  const atMax = !!oct && qty >= MAX_QTY;
  const won = (n: number) => n.toLocaleString('en-US');
  const optionPrice = 13000 * qty;
  const productAmount = 160000 * qty;
  const shipping = 3000;
  const total = productAmount + shipping;
  return (
    <Flex position="absolute" inset="0" zIndex={45} direction="column" justify="flex-end">
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.5)" onClick={onClose} />
      <Box position="relative" bg={c.white} borderTopRadius="20px" px="20px" pt="10px" pb="20px" boxShadow="0 -8px 24px rgba(0,0,0,0.2)" style={{ animation: 'sheetUp 0.26s ease-out' }}>
        <Flex justify="center" pb="14px"><Box w="40px" h="4px" borderRadius="100px" bg={c.grD8} /></Flex>

        {/* 상품 헤더 */}
        <Flex gap="12px" align="center" pb="16px">
          <Box as="button" position="relative" flexShrink={0} cursor="zoom-in" onClick={() => onZoom(0)}>
            <Image src={basset('live-product.png')} alt="" w="56px" h="56px" borderRadius="10px" objectFit="cover" draggable={false} />
            <ZoomBadge count={PRODUCT_GALLERY.length} />
          </Box>
          <Text flex="1" fontFamily={FONT} fontWeight="600" fontSize="14px" letterSpacing="-0.35px" color={c.gr22} lineHeight="1.4">베르사체 아이리시 폼 No.7 하이브리드 특가 50% 특별세일 제품 (완전정품)</Text>
        </Flex>
        <Box h="1px" bg={c.grE8} />

        {/* 옵션 + 수량 */}
        <Box bg={c.grF8} borderRadius="10px" p="14px" mt="16px">
          <Text fontFamily={FONT} fontWeight="500" fontSize="13px" letterSpacing="-0.3px" color={c.gr42} pb="10px">베르사체 아이리시 폼 No.7 하이브리드 특가 50%</Text>
          <Flex align="center" justify="space-between">
            <Flex data-doc-mark="f-cart-maxqty-qty" align="center" border={`1px solid ${c.grD8}`} borderRadius="8px" bg={c.white}>
              <QtyStepBtn sign="−" onClick={() => setQty((q) => Math.max(1, q - 1))} />
              <Text w="34px" textAlign="center" fontFamily={FONT} fontWeight="600" fontSize="14px" color={c.gr22}>{qty}</Text>
              <QtyStepBtn sign="+" onClick={() => setQty((q) => (oct ? Math.min(MAX_QTY, q + 1) : q + 1))} />
            </Flex>
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.35px" color={c.gr22}>{won(optionPrice)}원</Text>
          </Flex>
          {atMax && (
            <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.28px" color={c.gr72} pt="8px" textAlign="right">최대 {MAX_QTY}개까지 구매 가능합니다</Text>
          )}
        </Box>

        {/* 금액 */}
        <Flex direction="column" gap="8px" pt="16px">
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color={c.gr72} textAlign="right">상품금액 {won(productAmount)}원 + 배송비 {won(shipping)}원</Text>
          <Flex justify="space-between" align="baseline">
            <Text fontFamily={FONT} fontWeight="600" fontSize="14px" letterSpacing="-0.35px" color={c.gr42}>총 상품금액</Text>
            <Text fontFamily={FONT} fontWeight="800" fontSize="20px" letterSpacing="-0.5px" color="#EC4899">
              {won(total)} <Box as="span" fontSize="14px">원</Box>
            </Text>
          </Flex>
        </Flex>

        {payMode === 'live' ? (
          <>
            <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.28px" color="#E0457E" textAlign="center" pt="14px" lineHeight="1.5">
              ⓘ 방송 중 담아두고, 담은상품에서 한 번에 결제합니다. 추가 구매 시 배송비가 매번 부과됩니다.
            </Text>
            <Flex as="button" mt="10px" w="100%" h="52px" align="center" justify="center" bg="#EC4899" borderRadius="12px" cursor="pointer" onClick={onAddCart}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.white}>장바구니 담기</Text>
            </Flex>
          </>
        ) : (
          <Flex as="button" mt="18px" w="100%" h="52px" align="center" justify="center" bg="#EC4899" borderRadius="12px" cursor="pointer" onClick={onAddCart}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.white}>상품 담기</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

/* ── 담은상품(내 장바구니) 바텀시트 ── */
type CartOpt = { l: string; v: string };
type MyItem = { id: string; badge?: string; name: string; opts: CartOpt[] };
const LONG = '베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7';
const NORMAL_ITEMS: MyItem[] = [
  { id: 'n1', badge: '[B]', name: LONG, opts: [{ l: '· 상품구성 :', v: '옵션명 : 옵션 1' }, { l: '· 추가상품 :', v: '희망배송일자 : 2025년 12월 25일 / 옵션명 : 옵션(+20000)' }] },
  { id: 'n2', badge: '[A상품]', name: LONG, opts: [{ l: '· 상품구성 :', v: '옵션명 : 옵션' }, { l: '· 추가상품 :', v: '희망배송일자 : 2025년 12월 25일 / 옵션명 : 옵션(+20000)' }] },
];
const BUNDLE_GROUPS: { group: string; items: MyItem[] }[] = [
  { group: 'Bundle Product Group Name', items: [{ id: 'b1', name: LONG, opts: [{ l: '· 배송비 :', v: '3,000원' }] }, { id: 'b2', name: LONG, opts: [] }] },
];

function OptionBox({ item, open, onToggle }: { item: MyItem; open: boolean; onToggle: () => void }) {
  return (
    <Box w="100%" borderRadius="4px" overflow="hidden">
      <Flex direction="column" gap="6px" bg="#F9F9F9" p="12px">
        {open &&
          item.opts.map((o, i) => (
            <Flex key={i} gap="6px" align="flex-start">
              <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color="#727272" flexShrink={0}>{o.l}</Text>
              <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#111">{o.v}</Text>
            </Flex>
          ))}
        <Flex gap="6px" align="center">
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color="#727272" flexShrink={0}>· 주문수량 :</Text>
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#111">1개</Text>
        </Flex>
      </Flex>
      {item.opts.length > 0 && (
        <Flex as="button" h="28px" w="100%" align="center" justify="center" gap="2px" bg="#F2F2F2" borderTop="1px solid #E8E8E8" cursor="pointer" onClick={onToggle}>
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color="#929292">{open ? '옵션 접기' : '옵션 보기'}</Text>
          <Text fontSize="9px" color="#929292" transform={open ? 'rotate(180deg)' : undefined}>⌄</Text>
        </Flex>
      )}
    </Box>
  );
}

function MyItemRow({ item, open, onToggle, onRemove, onZoom }: { item: MyItem; open: boolean; onToggle: () => void; onRemove: () => void; onZoom: (start?: number) => void }) {
  return (
    <Flex direction="column" gap="8px">
      <Box position="relative">
        <Flex gap="12px" align="flex-start">
          <Box as="button" position="relative" flexShrink={0} cursor="zoom-in" onClick={() => onZoom(0)}>
            <Image src={basset('live-product.png')} alt="" w="80px" h="80px" borderRadius="8px" objectFit="cover" draggable={false} />
            <ZoomBadge count={PRODUCT_GALLERY.length} />
          </Box>
          <Flex direction="column" flex="1" minW="0" gap="6px" pt="2px" pr="98px">
            <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={c.gr22} lineHeight="1.4" style={clamp2}>
              {item.badge && <Box as="span" fontWeight="700">{item.badge}</Box>}
              {item.name}
            </Text>
            <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.28px" color={c.gr22}>1,234,567원</Text>
          </Flex>
        </Flex>
        <Flex as="button" position="absolute" right="0" top="52px" w="90px" h="28px" align="center" justify="center" bg={c.white} border="1px solid #D8D8D8" borderRadius="4px" cursor="pointer" onClick={onRemove}>
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#424242">담기 취소</Text>
        </Flex>
      </Box>
      <OptionBox item={item} open={open} onToggle={onToggle} />
    </Flex>
  );
}

function SummaryBox({ free, lines }: { free?: string; lines: { l: string; v: string; freeVal?: boolean }[] }) {
  return (
    <Flex direction="column" gap="8px" bg="#F9F9F9" borderRadius="4px" px="8px" py="12px">
      {free && <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.4px" color="#FF7200">{free}</Text>}
      {lines.map((ln, i) => (
        <Flex key={i} justify="space-between" align="center">
          <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.4px" color="#727272">{ln.l}</Text>
          <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.4px" color={ln.freeVal ? '#FF7200' : c.gr22}>{ln.v}</Text>
        </Flex>
      ))}
    </Flex>
  );
}

function MyCartSheet({ onClose, startEmpty, payMode, payBlocked, onZoom }: { onClose: () => void; startEmpty?: boolean; payMode: 'live' | 'after'; payBlocked?: boolean; onZoom: (start?: number) => void }) {
  const [normal, setNormal] = useState<MyItem[]>(startEmpty ? [] : NORMAL_ITEMS);
  const [bundles, setBundles] = useState(startEmpty ? [] : BUNDLE_GROUPS);
  const [open, setOpen] = useState<Record<string, boolean>>({ n2: true });
  const toggle = (id: string) => setOpen((m) => ({ ...m, [id]: !m[id] }));
  const count = normal.length + bundles.reduce((a, g) => a + g.items.length, 0);
  const empty = count === 0;

  return (
    <Flex position="absolute" inset="0" zIndex={44} direction="column" justify="flex-end">
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.5)" onClick={onClose} />
      <Flex direction="column" position="relative" bg={c.white} borderTopRadius="32px" maxH="78%" boxShadow="0 -8px 24px rgba(0,0,0,0.2)" style={{ animation: 'sheetUp 0.26s ease-out' }}>
        <Flex justify="center" pt="10px" pb="16px" flexShrink={0}><Box w="48px" h="4px" borderRadius="100px" bg="#E5E6EB" /></Flex>
        <Box px="24px" pb="12px" flexShrink={0}>
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.32px" color={c.gr22}>
            담은상품 <Box as="span" color="#FF2F2F">{count}</Box>
          </Text>
        </Box>

        {empty ? (
          <Flex flex="1" minH="160px" align="center" justify="center" pb="60px">
            <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.3px" color="#929292">담은 상품이 없습니다</Text>
          </Flex>
        ) : (
          <Box flex="1" minH="0" overflowY="auto" pb="20px">
            {/* 일반상품 */}
            {normal.length > 0 && (
              <Box px="24px" pb="24px">
                <Text fontFamily={FONT} fontWeight="600" fontSize="14px" letterSpacing="-0.35px" color={c.gr22} pb="16px">일반상품</Text>
                <Flex direction="column" gap="20px">
                  {normal.map((it) => (
                    <MyItemRow key={it.id} item={it} open={!!open[it.id]} onToggle={() => toggle(it.id)} onRemove={() => setNormal((a) => a.filter((x) => x.id !== it.id))} onZoom={onZoom} />
                  ))}
                </Flex>
                <Box pt="16px">
                  <SummaryBox free="일반상품 50,000원 이상 구매 시 무료배송" lines={[{ l: '· 일반 상품 금액', v: '2,469,134원' }, { l: '· 예상 배송비', v: '6,000원' }]} />
                </Box>
              </Box>
            )}
            {/* 묶음상품 */}
            {bundles.map((g, gi) => (
              <Box key={g.group}>
                <Box h="8px" bg="#F2F2F2" />
                <Box px="24px" py="24px">
                  <Flex align="center" gap="6px" pb="16px">
                    <Flex bg="#3C763D" px="4px" pt="1px" borderRadius="6px" align="center" flexShrink={0}>
                      <Text fontFamily={FONT} fontWeight="700" fontSize="11px" letterSpacing="-0.22px" color={c.white}>묶음</Text>
                    </Flex>
                    <Text fontFamily={FONT} fontWeight="600" fontSize="14px" letterSpacing="-0.35px" color={c.gr22} truncate>{g.group}</Text>
                  </Flex>
                  <Flex direction="column" gap="20px">
                    {g.items.map((it) => (
                      <MyItemRow key={it.id} item={it} open={!!open[it.id]} onToggle={() => toggle(it.id)} onRemove={() => setBundles((arr) => arr.map((gg, j) => (j === gi ? { ...gg, items: gg.items.filter((x) => x.id !== it.id) } : gg)).filter((gg) => gg.items.length > 0))} onZoom={onZoom} />
                    ))}
                  </Flex>
                  <Box pt="16px">
                    <SummaryBox lines={[{ l: '· 상품 금액', v: '2,469,134원' }, { l: '· 배송비', v: '3,000원' }]} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* 하단 결제 — 방송 중 결제 허용 시 일괄 결제, 아니면 종료 후 발송 안내 */}
        {!empty && (
          <Box px="24px" pt="12px" pb="16px" flexShrink={0} borderTop="1px solid #F0F0F0">
            {payMode === 'live' ? (
              payBlocked ? (
                <Box data-doc-mark="f-payment-block">
                  <Flex w="100%" h="52px" align="center" justify="center" bg="#E5E6EB" borderRadius="12px" cursor="not-allowed">
                    <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color="#9AA0A8">품절</Text>
                  </Flex>
                  <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.28px" color="#E0457E" textAlign="center" pt="8px" lineHeight="1.5">ⓘ 현재 품절되어 구매하실 수 없습니다.</Text>
                </Box>
              ) : (
                <Flex data-doc-mark="f-live-pay" as="button" w="100%" h="52px" align="center" justify="center" bg="#EC4899" borderRadius="12px" cursor="pointer" onClick={() => { window.location.href = '/shop/order'; }}>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.4px" color={c.white}>일괄 결제하기 ({count}건)</Text>
                </Flex>
              )
            ) : (
              <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.3px" color="#929292" textAlign="center" lineHeight="1.5">방송 종료 후 담은 상품의 결제 링크가 카카오톡으로 발송됩니다.</Text>
            )}
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

/* ── 판매상품 리스트 바텀시트 ── */
type CartProd = { id: number; name: string; soldOut: boolean; group?: boolean };
const NM_S = '베르사체 아이리시 폼 No.7';
const NM_L = '베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7 베르사체 아이리시 폼 No.7';
const CART_PRODUCTS: CartProd[] = [
  { id: 0, name: NM_S, soldOut: false },
  { id: 1, name: NM_L, soldOut: false, group: true },
  { id: 2, name: NM_L, soldOut: true },
  { id: 3, name: NM_L, soldOut: true },
  { id: 4, name: NM_L, soldOut: false },
  { id: 5, name: NM_L, soldOut: false },
  { id: 6, name: NM_S, soldOut: false },
  { id: 7, name: NM_L, soldOut: true },
  { id: 8, name: NM_L, soldOut: false },
  { id: 9, name: NM_S, soldOut: false },
  { id: 10, name: NM_L, soldOut: false },
  { id: 11, name: NM_L, soldOut: false },
];
const clamp2 = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' };

function CartListSheet({ onClose, onAddCart, onSecondChance, onZoom }: { onClose: () => void; onAddCart: () => void; onSecondChance: () => void; onZoom: (start?: number) => void }) {
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  return (
    <Flex position="absolute" inset="0" zIndex={44} direction="column" justify="flex-end">
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.5)" onClick={onClose} />
      <Flex direction="column" position="relative" bg={c.white} borderTopRadius="32px" maxH="74%" px="24px" pb="20px" boxShadow="0 -8px 24px rgba(0,0,0,0.2)" style={{ animation: 'sheetUp 0.26s ease-out' }}>
        <Flex justify="center" pt="10px" pb="20px" flexShrink={0}><Box w="48px" h="4px" borderRadius="100px" bg="#E5E6EB" /></Flex>

        {/* 헤더 */}
        <Flex direction="column" gap="8px" flexShrink={0} pb="20px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="16px" letterSpacing="-0.32px" color={c.gr22}>
            판매상품 <Box as="span" color="#FF2F2F">{CART_PRODUCTS.length}</Box>
          </Text>
          <Flex h="25px" w="100%" align="center" justify="center" bg="#FFEEEE" borderRadius="4px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#FF2F2F">라이브 중에만 구매 가능한 가격입니다.</Text>
          </Flex>
        </Flex>

        {/* 리스트 */}
        <Box flex="1" minH="0" overflowY="auto">
          <Flex direction="column" gap="12px">
            {CART_PRODUCTS.map((p) => {
              const isApplied = !!applied[p.id];
              const nameColor = p.soldOut ? '#727272' : c.gr22;
              const priceColor = p.soldOut ? '#929292' : undefined;
              return (
                <Box key={p.id} position="relative" w="100%" pb="12px" borderBottom="1px solid #E8E8E8">
                  <Flex gap="12px" align="flex-start">
                    {/* 썸네일 80 — 탭하면 확대 */}
                    <Box as="button" position="relative" w="80px" h="80px" borderRadius="8px" overflow="hidden" flexShrink={0} bg="#FF4A4A" cursor="zoom-in" onClick={() => onZoom(0)}>
                      <Image src={basset('live-product.png')} alt="" w="80px" h="80px" objectFit="cover" draggable={false} />
                      {!p.soldOut && <ZoomBadge count={PRODUCT_GALLERY.length} />}
                      {p.soldOut && (
                        <Flex position="absolute" inset="0" bg="rgba(255,255,255,0.8)" align="center" justify="center">
                          <Flex bg="rgba(34,34,34,0.6)" px="4px" pb="1px" borderRadius="2px" align="center" backdropFilter="blur(2px)">
                            <Text fontFamily={FONT} fontWeight="600" fontSize="12px" letterSpacing="-0.3px" color={c.white}>품절</Text>
                          </Flex>
                        </Flex>
                      )}
                    </Box>

                    {/* 내용 */}
                    <Flex direction="column" flex="1" minW="0" gap="4px" pt="4px" pr="98px">
                      <Flex align="flex-start" gap="4px">
                        {p.group && (
                          <Flex bg="#3C763D" px="4px" pt="1px" borderRadius="4px" align="center" flexShrink={0}>
                            <Text fontFamily={FONT} fontWeight="700" fontSize="11px" letterSpacing="-0.22px" color={c.white}>묶음</Text>
                          </Flex>
                        )}
                        <Text flex="1" minW="0" fontFamily={FONT} fontSize="12px" letterSpacing="-0.24px" color={nameColor} lineHeight="1.4" style={clamp2}>
                          {p.name}
                        </Text>
                      </Flex>
                      <Flex gap="4px" align="baseline">
                        <Text fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.28px" color={priceColor ?? '#FF2F2F'}>32%</Text>
                        <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.28px" color={priceColor ?? c.gr22}>1,234,567원</Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* 버튼 (우측 하단 고정) */}
                  <Box position="absolute" right="0" bottom="12px">
                    {!p.soldOut ? (
                      <Flex as="button" w="90px" h="28px" align="center" justify="center" bg={c.gr22} borderRadius="4px" cursor="pointer" onClick={onAddCart}>
                        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={c.white}>상품담기</Text>
                      </Flex>
                    ) : isApplied ? (
                      <Flex w="90px" h="28px" align="center" justify="center" bg="#FFF0E8" borderRadius="4px">
                        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color="#FF5900">알림 신청 완료</Text>
                      </Flex>
                    ) : (
                      <Flex as="button" w="90px" h="28px" align="center" justify="center" bg="#FF5900" borderRadius="4px" cursor="pointer" onClick={() => { setApplied((m) => ({ ...m, [p.id]: true })); onSecondChance(); }}>
                        <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={c.white}>세컨찬스</Text>
                      </Flex>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

/* ── 완료 토스트 (하단 흰 시트 + 상단 체크 배지) — 주문완료/세컨찬스 공용 ── */
function DoneToast({ title, sub, color = c.red }: { title: string; sub?: string; color?: string }) {
  return (
    <Flex position="absolute" left="0" right="0" bottom="0" zIndex={50} justify="center" pointerEvents="none">
      <Box position="relative" w="100%" bg={c.white} borderTopRadius="24px" pt="36px" pb="40px" px="24px" boxShadow="0 -8px 24px rgba(0,0,0,0.18)" style={{ animation: 'sheetUp 0.26s ease-out' }}>
        <Flex position="absolute" top="-26px" left="50%" transform="translateX(-50%)" w="52px" h="52px" borderRadius="9999px" bg={color} align="center" justify="center" boxShadow={`0 4px 12px ${color}66`}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Flex>
        <Flex direction="column" align="center" gap="6px">
          <Text fontFamily={FONT} fontWeight="700" fontSize="18px" letterSpacing="-0.45px" color={c.gr22}>{title}</Text>
          {sub && <Text fontFamily={FONT} fontSize="13px" letterSpacing="-0.3px" color={c.gr72}>{sub}</Text>}
        </Flex>
      </Box>
    </Flex>
  );
}

/** 방송 종료 — 라이브가 끝나면 노출되는 마지막 화면(검정 배경 + 안내 + 후속 메뉴) */
const END_ROWS = [
  { icon: 'viewer-end-order.png', w: '31px', h: '44px', label: '주문서 보러가기', href: '/shop/order' },
  { icon: 'viewer-end-clock.png', w: '33px', h: '40px', label: '세컨찬스 목록보기', href: '/shop/second-chance' },
  { icon: 'viewer-end-shop.png', w: '48px', h: '32px', label: '쇼핑몰 바로가기', href: '/shop' },
  { icon: 'viewer-end-bell.png', w: '46px', h: '32px', label: '단골맺고 알림받기', href: '/shop/dangol' },
];
// 결제 방식 해석: ?pay= 우선 → 없으면 어드민이 저장한 flexg_pay_mode → 기본 after
// (프로토타입 배선 — 백엔드 대체. 미설정 시 after라 7월 기존 동작 그대로)
function resolvePayMode(params: URLSearchParams): 'live' | 'after' {
  const p = params.get('pay');
  if (p === 'live') return 'live';
  if (p === 'after') return 'after';
  try { return localStorage.getItem('flexg_pay_mode') === 'live' ? 'live' : 'after'; } catch { return 'after'; }
}

function EndScreen() {
  // 방송 중 결제를 이미 한 경우: "주문서 보러가기" 대신 "주문내역 보기"
  const payLive = resolvePayMode(new URLSearchParams(window.location.search)) === 'live';
  const rows = END_ROWS.map((r, i) => (i === 0 && payLive ? { ...r, label: '주문내역 보기' } : r));
  // 닫기 → 직전 목록(들어온 화면)으로 복귀, 이력 없으면 쇼핑몰 홈으로 폴백 (VOC: 종료 후 직전 목록 복귀)
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/shop';
  };
  return (
    <Box position="relative" w="100%" h="100%" overflow="hidden" bg="#000">
      <Flex direction="column" position="relative" zIndex={1} h="100%">
        <StatusBar tone="light" />

        {/* 헤더: 제목 + 로고 + 닫기 */}
        <Flex h="56px" align="center" px="16px" gap="8px" flexShrink={0}>
          <Flex flex="1" minW="0" align="center" gap="8px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="18px" letterSpacing="-0.45px" color={c.white} truncate maxW="150px">판매는 불티나게 플렉스지ㅇㅁㄴㅇ</Text>
            <Image src={basset('flexg-logo.svg')} alt="FLEXG" h="9px" />
          </Flex>
          <Box as="button" cursor="pointer" onClick={goBack}><CloseIcon /></Box>
        </Flex>

        {/* LIVE + 카운트 */}
        <Flex direction="column" gap="6px" px="16px" pt="2px" flexShrink={0}>
          <Flex align="center" gap="6px">
            <Flex bg={c.red} px="4px" pt="3px" pb="2px" borderRadius="6px" align="center">
              <Text fontFamily={FONT} fontWeight="800" fontSize="11px" letterSpacing="2.2px" color={c.white}>LIVE</Text>
            </Flex>
            <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.28px" color={c.white} truncate>놓칠 수 없는 무신사 브랜드 최대 80% 할인</Text>
          </Flex>
          <Flex align="center" gap="8px">
            <Flex align="center" gap="3px"><Image src={basset('live-viewers.svg')} alt="" w="12px" h="11px" /><Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={c.white}>2,450</Text></Flex>
            <Flex align="center" gap="3px"><Image src={basset('live-comments.svg')} alt="" w="13px" h="9px" /><Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={c.white}>1,123</Text></Flex>
          </Flex>
        </Flex>

        {/* 중앙: 종료 안내 + 후속 메뉴 */}
        <Flex flex="1" minH="0" direction="column" justify="center" align="center" px="24px" gap="40px">
          <Flex direction="column" align="center" gap="4px" w="100%">
            <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={c.white} textAlign="center">라이브가 종료되었습니다.</Text>
            <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.28px" color="#D8D8D8" textAlign="center">시청해주셔서 감사합니다</Text>
          </Flex>
          <Flex data-doc-mark="f-viewer-end-return" direction="column" gap="12px" w="100%">
            {rows.map((r, i) => (
              <Flex data-doc-mark={i === 0 ? 'f-live-pay' : undefined} as="button" key={r.label} align="center" gap="12px" w="100%" px="36px" py="8px" bg="#1A1A1A" border="1px solid rgba(255,255,255,0.12)" borderRadius="8px" cursor="pointer" onClick={() => { window.location.href = r.href; }}>
                <Flex w="48px" h="48px" align="center" justify="center" flexShrink={0}>
                  <Image src={basset(r.icon)} alt="" w={r.w} h={r.h} objectFit="contain" draggable={false} />
                </Flex>
                <Text flex="1" textAlign="left" fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.28px" color={c.white}>{r.label}</Text>
                <ChevronRight />
              </Flex>
            ))}
          </Flex>
        </Flex>

        <HomeIndicator bg="transparent" bar={c.white} />
      </Flex>
    </Box>
  );
}

/** 라이브 링크 호출 오류 — 잘못된/종료된 링크 진입 시 빈 화면 대신 안내 + 쇼핑몰 이동 */
const ERR_COPY = {
  notfound: { title: '방송을 찾을 수 없어요', sub: '잘못된 링크이거나 삭제된 방송입니다.' },
  ended: { title: '종료된 라이브예요', sub: '이미 종료된 방송 링크입니다.\n다른 라이브와 혜택을 만나보세요.' },
};
function ErrorScreen({ kind }: { kind: 'notfound' | 'ended' }) {
  const m = ERR_COPY[kind];
  return (
    <Box position="relative" w="100%" h="100%" overflow="hidden" bg="#000">
      <Flex direction="column" position="relative" zIndex={1} h="100%">
        <StatusBar tone="light" />
        <Flex h="56px" align="center" px="16px" flexShrink={0}>
          <Image src={basset('flexg-logo.svg')} alt="FLEXG" h="10px" />
        </Flex>
        <Flex flex="1" minH="0" direction="column" justify="center" align="center" px="32px" gap="24px">
          <Flex w="64px" h="64px" align="center" justify="center" borderRadius="100px" border="2px solid rgba(255,255,255,0.3)" flexShrink={0}>
            <Text fontFamily={FONT} fontWeight="800" fontSize="34px" color="rgba(255,255,255,0.85)">!</Text>
          </Flex>
          <Flex direction="column" align="center" gap="6px">
            <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={c.white} textAlign="center">{m.title}</Text>
            <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.28px" color="#D8D8D8" textAlign="center" whiteSpace="pre-line" lineHeight="1.5">{m.sub}</Text>
          </Flex>
          <Flex data-doc-mark="f-viewer-end-return" direction="column" gap="10px" w="100%" maxW="320px">
            <Flex as="button" align="center" justify="center" h="50px" w="100%" bg={c.red} borderRadius="12px" cursor="pointer" onClick={() => { window.location.href = '/shop'; }}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="15px" color={c.white}>쇼핑몰 바로가기</Text>
            </Flex>
            <Flex as="button" align="center" justify="center" h="46px" w="100%" bg="transparent" border="1px solid rgba(255,255,255,0.3)" borderRadius="12px" cursor="pointer" onClick={() => window.location.reload()}>
              <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={c.white}>다시 시도</Text>
            </Flex>
          </Flex>
        </Flex>
        <HomeIndicator bg="transparent" bar={c.white} />
      </Flex>
    </Box>
  );
}

/** 고객뷰어 라이브 시청 — 진입 시 로그인/정보입력 후 시청 (채팅·좋아요·장바구니·단골맺기) */
export function ViewerLive() {
  const params = new URLSearchParams(window.location.search);
  const embed = params.get('embed') === '1'; // 관제 콘솔 미러 — 폰 chrome·엔드유저 컨트롤(공유/닫기/음소거·단골/장바구니/상품목록·채팅입력) 숨김
  const nickParam = params.get('nick'); // 'set'(보유) | 'edit'(수정 모달) | null(미보유)
  const initStep = (['login', 'info', 'live', 'end'] as const).find((s) => s === params.get('step')) ?? (nickParam === 'edit' ? 'live' : 'login');
  const dan = params.get('dan'); // done | off
  const payMode: 'live' | 'after' = resolvePayMode(params); // 방송 중 즉시결제 / 종료 후 결제 (?pay= → flexg_pay_mode → after)
  const payBlocked = params.get('payblock') === '1'; // 판매자 결제 차단 → 결제 버튼 비활성
  const oct = params.get('oct') === '1'; // 10월 VOC 게이트(기본 OFF) — 미전달 시 7·8월 동작 byte-identical
  const [step, setStep] = useState<Step>(initStep);
  const [nickname, setNickname] = useState(nickParam === 'set' || nickParam === 'edit' ? '구도하' : '');
  const [showNickEdit, setShowNickEdit] = useState(nickParam === 'edit');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(4567);
  const [followed, setFollowed] = useState(dan === 'on' || dan === 'done' || dan === 'off');
  const [followDone, setFollowDone] = useState(dan === 'done');
  const [unfollowAsk, setUnfollowAsk] = useState(dan === 'off');
  const [showShare, setShowShare] = useState(params.get('share') === '1');
  const [showCart, setShowCart] = useState(params.get('cart') === '1');
  const [showCartList, setShowCartList] = useState(params.get('cart') === 'list' || params.get('cart') === 'sc');
  const [cartOrigin, setCartOrigin] = useState<'bar' | 'list'>('bar'); // 상품담기를 연 출처(10월: 닫으면 이 출처로 복귀)
  const [followAskClosed, setFollowAskClosed] = useState(false); // 10월: 비단골 라이브 진입 단골맺기 안내 레이어 닫음 여부
  const [showMyCart, setShowMyCart] = useState(params.get('cart') === 'my' || params.get('cart') === 'my0');
  const [done, setDone] = useState<{ title: string; sub?: string; color: string } | null>(
    params.get('cart') === 'done' ? { title: '주문 완료!', sub: '방송 종료 후 구매 URL이 카카오톡으로 발송됩니다.', color: c.red } : null,
  );
  const [scDone, setScDone] = useState(params.get('cart') === 'sc');
  const [toast, setToast] = useState('');
  const [zoom, setZoom] = useState<number | null>(params.get('zoom') === '1' ? 0 : null); // 상품 이미지 확대 뷰어(시작 컷 인덱스, ?zoom=1 자동 오픈)

  const secondChance = () => {
    setScDone(true);
    window.setTimeout(() => setScDone(false), 2200);
  };

  const showDone = (d: { title: string; sub?: string; color: string }) => {
    setShowCart(false);
    if (oct && cartOrigin === 'list') setShowCartList(true); // 10월: 목록에서 연 경우 담은 뒤에도 목록으로 복귀
    setDone(d);
    window.setTimeout(() => setDone(null), 2400);
  };
  // 담기: 방송 종료 후 결제(주문서/결제링크 카톡 발송)
  const addToCart = () =>
    showDone(payMode === 'live'
      ? { title: '장바구니에 담았어요', sub: '방송 종료 후 결제 링크가 카카오톡으로 발송됩니다.', color: c.red }
      : { title: '주문 완료!', sub: '방송 종료 후 구매 URL이 카카오톡으로 발송됩니다.', color: c.red });
  // 지금 결제: 즉시 결제가 아니라 주문서(결제 화면)로 이동

  const copyUrl = () => {
    const url = 'https://link.shop.url/live/flexg';
    try {
      navigator.clipboard?.writeText(url);
    } catch {
      /* ignore */
    }
    setShowShare(false);
    setToast('URL이 복사되었습니다.');
    window.setTimeout(() => setToast(''), 1600);
  };

  const onFollow = () => {
    if (followed) {
      setUnfollowAsk(true);
      return;
    }
    setFollowed(true);
    setFollowDone(true);
    window.setTimeout(() => setFollowDone(false), 1800);
  };

  const send = () => {
    const v = chatInput.trim();
    if (!v) return;
    setMessages((arr) => [...arr, { user: nickname || '나', text: v }]);
    setChatInput('');
  };
  const like = () => {
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
  };

  const chatOff = params.get('chat') === 'off';
  const micOff = params.get('mic') === 'off';
  const camOff = params.get('cam') === 'off';
  const pauseParam = params.get('pause');
  const paused = pauseParam === 'on'; // 방송 중 일시정지
  const waiting = pauseParam === 'before'; // 방송 시작 전·대기 (일시정지 대신 홍보)
  const promoOff = waiting && params.get('promo') === 'off'; // 운영자 대기화면 홍보 미등록 → 기본 슬로건 폴백
  const blackout = camOff || paused || waiting; // 카메라 꺼짐·일시중지·대기 시 영상 대신 검정 배경
  const allChat: CMsg[] = [
    ...CHAT,
    ...messages.map((m) => ({ kind: 'user' as const, user: m.user, text: m.text, full: false })),
    ...(chatOff ? [{ kind: 'system' as const, text: '관리자가 채팅 기능을 비활성화 했습니다' }] : []),
  ];

  const linkErr = params.get('err'); // notfound | ended — 라이브 링크 호출 오류 상태
  if (linkErr === 'notfound' || linkErr === 'ended') return <ErrorScreen kind={linkErr} />;
  if (step === 'end') return <EndScreen />;

  return (
    <Box position="relative" w="100%" h="100%" overflow="hidden">
      {blackout ? (
        <Box position="absolute" inset="0" bg="#000" />
      ) : (
        <Image src={basset('live-bg.png')} alt="" position="absolute" inset="0" w="100%" h="100%" objectFit="cover" />
      )}
      <Box position="absolute" top="0" left="0" right="0" h="200px" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))' }} />
      <Box position="absolute" bottom="0" left="0" right="0" h="440px" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))' }} />

      <Flex direction="column" position="relative" zIndex={1} h="100%">
        {!embed && <StatusBar tone="light" />}

        {/* 헤더: 제목 + 로고 + 공유/음소거/닫기 (embed=관제 미러에선 액션 버튼 숨김) */}
        <Flex h="56px" align="center" px="16px" gap="8px" flexShrink={0} pt={embed ? '10px' : undefined}>
          <Flex flex="1" minW="0" align="center" gap="8px">
            <Text fontFamily={FONT} fontWeight="800" fontSize="18px" letterSpacing="-0.45px" color={c.white} truncate maxW="150px">판매는 불티나게 플렉스지ㅇㅁㄴㅇ</Text>
            <Image src={basset('flexg-logo.svg')} alt="FLEXG" h="9px" />
          </Flex>
          {!embed && (
            <Flex align="center" gap="12px" flexShrink={0}>
              <Box as="button" cursor="pointer" onClick={() => setShowShare(true)}><ShareIcon /></Box>
              <Box as="button" cursor="pointer"><VolumeIcon /></Box>
              <Box data-doc-mark="f-viewer-close-nav" as="button" cursor="pointer" onClick={() => { window.location.href = payMode === 'live' ? '/shop/order' : '/shop'; }}><CloseIcon /></Box>
            </Flex>
          )}
        </Flex>

        {/* 공지 + 카운트 + 공지 카드 (대기 중에는 숨김 — 방송 시작 전이라 LIVE·시청자수 미노출) */}
        {!waiting && (
        <Flex direction="column" gap="8px" px="16px" pt="2px" flexShrink={0}>
          <Flex direction="column" gap="6px">
            <Flex align="center" gap="6px">
              <Flex bg={c.red} px="4px" pt="3px" pb="2px" borderRadius="6px" align="center">
                <Text fontFamily={FONT} fontWeight="800" fontSize="11px" letterSpacing="2.2px" color={c.white}>LIVE</Text>
              </Flex>
              <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.28px" color={c.white} truncate>놓칠 수 없는 무신사 브랜드 최대 80% 할인</Text>
            </Flex>
            <Flex align="center" gap="8px">
              <Flex align="center" gap="3px"><Image src={basset('live-viewers.svg')} alt="" w="12px" h="11px" /><Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={c.white}>2,450</Text></Flex>
              <Flex align="center" gap="3px"><Image src={basset('live-comments.svg')} alt="" w="13px" h="9px" /><Text fontFamily={FONT} fontWeight="700" fontSize="12px" color={c.white}>1,123</Text></Flex>
            </Flex>
          </Flex>
          <NoticeCard />
        </Flex>
        )}

        {/* 본문: 채팅 + 프로모/상품/입력 + 우측 컨트롤 (대기 중에는 숨기고 검정 + 홍보 오버레이만) */}
        {waiting ? (
          <Box flex="1" minH="0" />
        ) : (
        <Flex flex="1" minH="0" gap="12px" align="stretch" px="16px" pb="8px">
          <Flex direction="column" flex="1" minW="0" minH="0" gap="8px">
            {/* 채팅 — 남은 공간 채우고 하단 정렬 (입력창 숨김 시 자동 확장) */}
            <Flex flex="1" minH="0" direction="column" justify="flex-end" overflow="hidden" gap="6px">
              {/* 고정공지 — 채팅 메시지 바로 위(하단)에 고정 (관제 콘솔 뷰어 미러와 동일 위치) */}
              <Flex data-doc-mark="f-viewer-pinned" bg="rgba(0,0,0,0.55)" border="1px solid rgba(255,200,0,0.55)" borderRadius="6px" px="9px" py="6px" align="center" gap="6px" flexShrink={0} style={{ backdropFilter: 'blur(4px)' }}>
                <Text fontSize="11px">📌</Text>
                <Text fontFamily={FONT} fontWeight="700" fontSize="11.5px" color={c.white} flex="1" minW="0" truncate>지금 1번 상품 30% 쿠폰 적용 중!</Text>
              </Flex>
              <Flex direction="column" gap="3px" align="flex-start" w="100%" maxH="100%" overflow="hidden">
            {allChat.map((m, i) => {
              if (m.kind === 'buy') {
                return (
                  <Flex key={i} gap="4px" align="flex-start" maxW="100%" bg="rgba(0,0,0,0.4)" border="1px solid rgba(255,255,255,0.05)" borderRadius="4px" px="5px" py="3px" backdropFilter="blur(4px)">
                    <Flex bg={c.red} borderRadius="4px" px="4px" pb="1px" align="center" flexShrink={0}>
                      <Text fontFamily={FONT} fontWeight="700" fontSize="11px" color={c.white}>구매</Text>
                    </Flex>
                    <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.22px" color={c.white} lineHeight="1.4">
                      <Box as="span" fontWeight="600">{m.user}</Box>
                      <Box as="span" color="rgba(255,255,255,0.8)">님이 상품을 구매하였습니다.</Box>
                    </Text>
                  </Flex>
                );
              }
              if (m.kind === 'system') {
                return (
                  <Flex key={i} gap="4px" align="flex-start" maxW="100%" bg="rgba(0,0,0,0.4)" border="1px solid rgba(255,255,255,0.05)" borderRadius="4px" px="5px" py="3px" backdropFilter="blur(4px)">
                    <Flex gap="2px" align="center" flexShrink={0}><GearMini /><Text fontFamily={FONT} fontWeight="700" fontSize="11px" letterSpacing="-0.22px" color={c.red}>시스템</Text></Flex>
                    <Text fontFamily={FONT} fontWeight="700" fontSize="11px" letterSpacing="-0.22px" color={c.white} lineHeight="1.4">{m.text}</Text>
                  </Flex>
                );
              }
              const admin = m.kind === 'admin';
              const full = m.kind === 'user' && m.full;
              return (
                <Flex key={i} gap="4px" align={full ? 'flex-start' : 'center'} w={full ? '100%' : 'auto'} maxW="100%" bg={admin ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)'} border="1px solid rgba(255,255,255,0.05)" borderRadius="4px" px="5px" py="3px" backdropFilter="blur(4px)">
                  <Text fontFamily={FONT} fontWeight="700" fontSize="11px" letterSpacing="-0.22px" color={admin ? '#FFC833' : 'rgba(255,255,255,0.8)'} whiteSpace="nowrap" flexShrink={0}>{admin ? 'Admin Name' : m.user}</Text>
                  <Text fontFamily={FONT} fontWeight={admin ? '700' : '600'} fontSize="11px" letterSpacing="-0.22px" color={c.white} lineHeight="1.4" flex={full ? '1' : undefined} whiteSpace={full ? 'normal' : 'nowrap'}>{m.text}</Text>
                </Flex>
              );
            })}
              </Flex>
            </Flex>

            {/* 프로모 배너 */}
              <Flex h="71px" flexShrink={0} borderRadius="12px" align="center" justify="space-between" pl="16px" pr="16px" style={{ background: 'linear-gradient(to right, rgba(32,32,31,0.9), rgba(19,19,19,0.9))', backdropFilter: 'blur(12px)' }} boxShadow="0px 20px 25px -5px rgba(0,0,0,0.1)">
                <Flex direction="column" gap="2px" minW="0">
                  <Flex align="center" gap="4px">
                    <Flex bg="#F94F8B" px="4px" borderRadius="2px" flexShrink={0}><Text fontFamily={FONT} fontWeight="600" fontSize="10px" color={c.white}>깜짝선물</Text></Flex>
                    <Text fontFamily={FONT} fontWeight="600" fontSize="10px" letterSpacing="-0.25px" color="rgba(255,255,255,0.6)">RIGHT NOW</Text>
                  </Flex>
                  <Text fontFamily={FONT} fontSize="12px" color={c.white} lineHeight="1.35">라이브 시청자분들께만 쏘는 <Box as="span" fontWeight="700">시크릿 혜택!</Box></Text>
                </Flex>
                <Image src={basset('promo-gift.png')} alt="" w="60px" h="48px" objectFit="contain" flexShrink={0} />
              </Flex>

              {/* 상품 바 (상품담기) — 확대 오버레이가 열리면 마커는 오버레이로 넘겨 가림 방지 */}
              <Flex data-doc-mark={zoom === null ? 'f-viewer-zoom' : undefined} gap="8px" align="center" bg={c.white} borderRadius="8px" p="8px" flexShrink={0} boxShadow="0px 2px 1px rgba(0,0,0,0.16)">
                <Box as="button" position="relative" flexShrink={0} cursor="zoom-in" onClick={() => setZoom(0)}>
                  <Image src={basset('live-product.png')} alt="" w="40px" h="40px" borderRadius="8px" objectFit="cover" draggable={false} />
                  <ZoomBadge count={PRODUCT_GALLERY.length} />
                </Box>
                <Flex direction="column" gap="2px" flex="1" minW="0">
                  <Text fontFamily={FONT} fontSize="12px" color={c.gr22} truncate>베르사체 아이리시 폼 No.7</Text>
                  <Flex gap="4px" align="baseline">
                    <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={c.red}>32%</Text>
                    <Text fontFamily={FONT} fontWeight="700" fontSize="14px" color={c.gr22}>12,234,567원</Text>
                  </Flex>
                </Flex>
                <Flex as="button" w="90px" h="28px" align="center" justify="center" bg={c.gr22} borderRadius="4px" cursor="pointer" flexShrink={0} onClick={() => { setCartOrigin('bar'); setShowCart(true); }}>
                  <Text fontFamily={FONT} fontWeight="700" fontSize="12px" letterSpacing="-0.24px" color={c.white}>상품담기</Text>
                </Flex>
              </Flex>

              {/* 닉네임 표시 + 수정 — 채팅 가능 시 항상 노출(닉네임 없으면 설정 유도). embed(관제 미러)에선 숨김 */}
              {!embed && !chatOff && (
                <Flex data-doc-mark="f-nickname" align="center" gap="6px" flexShrink={0} pl="6px" pb="2px">
                  {nickname ? (
                    <>
                      <Text fontFamily={FONT} fontSize="11px" letterSpacing="-0.25px" color="rgba(255,255,255,0.85)"><Box as="span" fontWeight="700">{nickname}</Box>님으로 채팅 중</Text>
                      <Text as="button" fontFamily={FONT} fontSize="11px" fontWeight="700" color={c.white} textDecoration="underline" cursor="pointer" onClick={() => setShowNickEdit(true)}>수정</Text>
                    </>
                  ) : (
                    <Text as="button" fontFamily={FONT} fontSize="11px" fontWeight="700" color={c.white} textDecoration="underline" cursor="pointer" onClick={() => setShowNickEdit(true)}>닉네임 설정하기</Text>
                  )}
                </Flex>
              )}

              {/* 채팅 입력 (채팅 비활성화 시 숨김 · embed 관제 미러에선 숨김 — 운영자는 콘솔 채팅 사용) */}
              {!embed && !chatOff && (
                <Flex data-doc-mark="f-viewer-end-return" h="44px" flexShrink={0} align="center" px="16px" gap="8px" bg="rgba(0,0,0,0.45)" border="1px solid rgba(255,255,255,0.12)" borderRadius="9999px" backdropFilter="blur(4px)">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} onFocus={(e) => { const el = e.currentTarget; try { setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250); } catch { /* iOS 키보드 노출 시 입력창을 화면 안으로 */ } }} placeholder="실시간 채팅에 참여하세요!" border="none" bg="transparent" px="0" h="auto" flex="1" fontFamily={FONT} fontSize="13px" color={c.white} _placeholder={{ color: 'rgba(255,255,255,0.6)' }} _focusVisible={{ boxShadow: 'none', outline: 'none' }} />
                  <Box as="button" cursor="pointer" onClick={send} flexShrink={0}><SendIcon /></Box>
                </Flex>
              )}
            </Flex>

            {/* 우측 컨트롤: 단골맺기·장바구니·상품목록·좋아요 (embed=관제 미러에선 숨김 — 엔드유저 액션) */}
            {!embed && (
            <Flex direction="column" justify="flex-end" align="center" w="44px" flexShrink={0} gap="14px" pb="2px">
              <RightCtrl src={followed ? 'viewer-follow-on.svg' : 'viewer-follow.svg'} h={32} label={followed ? '단골' : '단골맺기'} onClick={onFollow} />
              <RightCtrl src="viewer-cart.svg" h={32} onClick={() => setShowMyCart(true)} />
              <RightCtrl node={<ProductListIcon s={32} />} onClick={() => setShowCartList(true)} />
              <RightCtrl node={liked ? <HeartFill s={31} /> : <Image src={basset('viewer-heart.svg')} alt="" h="30px" draggable={false} />} label={likeCount.toLocaleString('en-US')} onClick={like} />
              {followed && <RightCtrl src="viewer-talk.svg" h={32} />}
            </Flex>
            )}
          </Flex>
        )}

        {!embed && <HomeIndicator bg="transparent" bar={c.white} />}
      </Flex>

      {showMyCart && <MyCartSheet onClose={() => setShowMyCart(false)} startEmpty={params.get('cart') === 'my0'} payMode={payMode} payBlocked={payBlocked} onZoom={(s = 0) => setZoom(s)} />}
      {showCartList && <CartListSheet onClose={() => setShowCartList(false)} onAddCart={() => { setCartOrigin('list'); if (oct) setShowCartList(false); setShowCart(true); }} onSecondChance={secondChance} onZoom={(s = 0) => setZoom(s)} />}
      {showCart && <AddCartSheet onClose={() => { setShowCart(false); if (oct && cartOrigin === 'list') setShowCartList(true); }} onAddCart={addToCart} payMode={payMode} oct={oct} onZoom={(s = 0) => setZoom(s)} />}
      {zoom !== null && <ProductZoom imgs={PRODUCT_GALLERY} start={zoom} onClose={() => setZoom(null)} />}
      {done && <DoneToast title={done.title} sub={done.sub} color={done.color} />}
      {scDone && <DoneToast title="세컨찬스가 신청되었습니다" color="#FF5900" />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} onCopy={copyUrl} />}
      {followDone && <FollowDoneToast />}
      {unfollowAsk && <UnfollowModal onCancel={() => setUnfollowAsk(false)} onConfirm={() => { setFollowed(false); setUnfollowAsk(false); }} />}

      {toast && (
        <Flex position="absolute" bottom="90px" left="0" right="0" justify="center" zIndex={60} pointerEvents="none">
          <Flex bg="rgba(0,0,0,0.8)" px="20px" py="12px" borderRadius="12px">
            <Text fontFamily={FONT} fontWeight="600" fontSize="14px" color={c.white}>{toast}</Text>
          </Flex>
        </Flex>
      )}

      {/* 마이크 꺼짐 — 송출자가 마이크를 끄면 중앙에 노출 */}
      {micOff && (
        <Flex position="absolute" left="50%" top="calc(50% - 75.5px)" transform="translate(-50%, -50%)" zIndex={55} direction="column" align="center" gap="4px" w="180px" px="40px" py="16px" borderRadius="12px" border="2px solid rgba(255,255,255,0.2)" bg="rgba(17,17,17,0.9)" backdropFilter="blur(2px)" boxShadow="0px 4px 2px rgba(0,0,0,0.3)" pointerEvents="none">
          <Image src={basset('viewer-mic-off.svg')} alt="" w="30px" h="32px" />
          <Text fontFamily={FONT} fontWeight="500" fontSize="18px" letterSpacing="-0.27px" color={c.white}>마이크 꺼짐</Text>
        </Flex>
      )}

      {/* 카메라 꺼짐 — 송출자가 카메라를 끄면 영상이 검정으로 바뀌고 중앙에 노출 */}
      {camOff && (
        <Flex position="absolute" left="50%" top="calc(50% - 75.5px)" transform="translate(-50%, -50%)" zIndex={55} direction="column" align="center" gap="4px" w="180px" px="40px" py="16px" borderRadius="12px" border="2px solid rgba(255,255,255,0.2)" bg="rgba(17,17,17,0.9)" backdropFilter="blur(2px)" boxShadow="0px 4px 2px rgba(0,0,0,0.3)" pointerEvents="none">
          <Image src={basset('viewer-camera-off.svg')} alt="" w="40px" h="40px" />
          <Text fontFamily={FONT} fontWeight="500" fontSize="18px" letterSpacing="-0.36px" color={c.white}>카메라 꺼짐</Text>
        </Flex>
      )}

      {/* 방송 시작 전·대기 — 검정 배경 + 운영자 등록 빅배너(카드) + 문구 + 단골 CTA(미등록 시 기본 슬로건) */}
      {waiting && (
        <Flex position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" zIndex={55} direction="column" align="center" gap="16px" w="300px" maxW="86%" pointerEvents="none">
          {!promoOff ? (
            // 빅배너 카드 — 높이 고정 + cover로 긴 배너·가로 배너 모두 카드 안에 크롭(오버플로 방지)
            <Image data-doc-mark="f-waiting-promo" src={basset('wait-promo-sample.jpg')} alt="대기화면 홍보 배너" w="100%" h="200px" objectFit="cover" borderRadius="14px" boxShadow="0px 8px 24px rgba(0,0,0,0.45)" draggable={false} />
          ) : (
            // 운영자 미등록 시에도 빈 화면이 아니라 기본 브랜드 배너를 노출(대기화면은 필수 노출)
            <Flex data-doc-mark="f-waiting-promo" w="100%" h="200px" borderRadius="14px" align="center" justify="center" direction="column" gap="12px" bgImage="linear-gradient(135deg, #2A2A2E, #4A1E22)" boxShadow="0px 8px 24px rgba(0,0,0,0.45)" border="1px solid rgba(255,255,255,0.08)">
              <Flex align="center" gap="6px" bg={c.red} borderRadius="9999px" px="13px" py="5px">
                <Box w="6px" h="6px" borderRadius="9999px" bg={c.white} />
                <Text fontFamily={FONT} fontWeight="800" fontSize="13px" letterSpacing="0.06em" color={c.white}>LIVE</Text>
              </Flex>
              <Text fontFamily={FONT} fontWeight="700" fontSize="15px" letterSpacing="-0.3px" color="rgba(255,255,255,0.85)">방송 준비 중</Text>
            </Flex>
          )}
          <Flex direction="column" align="center" gap="4px" w="100%">
            <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={c.white} textAlign="center" w="100%">
              {promoOff ? '라이브는 실감나게!' : '오늘 밤 9시, 단독 특가 LIVE'}
            </Text>
            <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.28px" color="#D8D8D8" textAlign="center" w="100%">
              {followed
                ? `${nickname || '고객'}님, 곧 만나요! 오늘 단골 전용 혜택을 준비했어요 🎁`
                : promoOff
                  ? '곧 방송이 시작됩니다. 잠시만 기다려 주세요.'
                  : '단골 맺고 시작 전 비밀 쿠폰 받아가세요!'}
            </Text>
          </Flex>
          {/* 단골 CTA — 미단골: 단골맺기 버튼 / 이미 단골: 알림 ON 기대감 안내 */}
          {followed ? (
            <Flex align="center" gap="6px" bg="rgba(255,255,255,0.12)" border="1px solid rgba(255,255,255,0.25)" borderRadius="9999px" px="14px" py="7px">
              <Image src={basset('viewer-follow-on.svg')} alt="" h="15px" draggable={false} />
              <Text fontFamily={FONT} fontWeight="700" fontSize="13px" letterSpacing="-0.26px" color={c.white}>단골 알림 ON · 시작하면 알려드릴게요</Text>
            </Flex>
          ) : (
            <Flex as="button" onClick={onFollow} pointerEvents="auto" align="center" justify="center" gap="6px" bg={c.red} borderRadius="9999px" px="22px" py="11px" cursor="pointer" boxShadow="0px 6px 16px rgba(255,47,47,0.4)">
              <Image src={basset('viewer-follow.svg')} alt="" h="16px" draggable={false} />
              <Text fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.28px" color={c.white}>단골맺고 알림받기</Text>
            </Flex>
          )}
        </Flex>
      )}

      {/* 방송 일시중지 — 영상이 검정으로 바뀌고 중앙에 안내 문구 노출 */}
      {paused && (
        <Flex position="absolute" left="50%" top="calc(50% - 141.5px)" transform="translate(-50%, -50%)" zIndex={55} direction="column" align="center" gap="4px" w="327px" maxW="90%" pointerEvents="none">
          <Text fontFamily={FONT} fontWeight="700" fontSize="20px" letterSpacing="-0.4px" color={c.white} textAlign="center" w="100%">방송이 일시 중지되었습니다.</Text>
          <Text fontFamily={FONT} fontSize="14px" letterSpacing="-0.28px" color="#D8D8D8" textAlign="center" w="100%">잠시만 기다려 주시면 곧 돌아오겠습니다.</Text>
        </Flex>
      )}

      {step === 'login' && <LoginCard onLogin={() => setStep(nickname ? 'live' : 'info')} onClose={() => setStep('live')} oct={oct} />}

      {/* 7월: 비단골로 라이브 진입 시 단골맺기 안내 레이어(이미 단골이면 미노출 · 콘솔 미러(embed)엔 숨김 · 대기(방송 시작 전)엔 미노출) */}
      {step === 'live' && !waiting && !followed && !embed && !followAskClosed && (
        <Flex data-doc-mark="f-login-dangol-layer" position="absolute" left="14px" right="14px" bottom="120px" zIndex={38} direction="column" gap="10px" bg="rgba(17,17,17,0.82)" borderRadius="14px" px="16px" py="14px" style={{ backdropFilter: 'blur(4px)', animation: 'sheetUp 0.26s ease-out' }}>
          <Flex align="flex-start" gap="8px">
            <Box flex="1" minW="0">
              <Text fontFamily={FONT} fontWeight="800" fontSize="14px" letterSpacing="-0.3px" color={c.white}>단골 맺고 라이브 알림 받기 🔔</Text>
              <Text fontFamily={FONT} fontSize="12px" letterSpacing="-0.28px" color="rgba(255,255,255,0.78)" pt="3px">다음 방송·단골 전용 혜택을 가장 먼저 받아보세요.</Text>
            </Box>
            <Flex as="button" w="22px" h="22px" align="center" justify="center" flexShrink={0} cursor="pointer" onClick={() => setFollowAskClosed(true)}><CloseIcon s={16} color="rgba(255,255,255,0.7)" /></Flex>
          </Flex>
          <Flex as="button" h="42px" align="center" justify="center" bg="#FF2F2F" borderRadius="10px" cursor="pointer" onClick={() => { onFollow(); setFollowAskClosed(true); }}>
            <Text fontFamily={FONT} fontWeight="700" fontSize="14px" letterSpacing="-0.28px" color={c.white}>단골맺기</Text>
          </Flex>
        </Flex>
      )}
      {step === 'info' && <InfoCard onEnter={(nick) => { setNickname(nick || '게스트'); setStep('live'); }} />}
      {showNickEdit && <NickEditModal current={nickname} onSave={(v) => { setNickname(v); setShowNickEdit(false); }} onClose={() => setShowNickEdit(false)} />}
    </Box>
  );
}
