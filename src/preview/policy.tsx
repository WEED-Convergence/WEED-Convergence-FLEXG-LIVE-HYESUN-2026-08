// 정책 — 신규 독립 화면. 기존 screens.tsx·discountCode2.tsx·discountCodeUsage.tsx는 전혀 건드리지 않고
// 이 파일 + main.tsx의 라우팅 한 줄 + catalog.ts의 신규 엔트리 한 개(모두 추가만)로만 연결한다.
// 등록/수정/검색 등 기능 없이, 할인코드 발급·발송 관련 운영 정책을 표 1개로만 보여주는 화면.
import { Box, Text } from '@chakra-ui/react';
import { AdminLayout, DataTable, colors } from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif";

// 실제 서비스(어드민 › 회원) LNB 구성을 참고해 재현 — 할인코드2·할인코드 사용내역 화면과 동일 목록,
// 「정책」을 목록 최상단에 추가하고 이 화면에서 활성 처리
const SIDEBAR_ITEMS = [
  { label: '정책', active: true },
  { label: '회원목록' },
  { label: '회원등급' },
  { label: '회원가입 현황', sub: [{ label: '회원가입 현황' }, { label: '채널별 회원가입 현황' }] },
  { label: '포인트 및 리워드' },
  { label: '포인트 사용내역' },
  { label: '리워드 현황', sub: [{ label: '리워드 매출 현황' }, { label: '리워드 회원가입 현황' }, { label: '리워드 App설치 현황' }] },
  { label: '할인코드' },
  { label: '할인코드 사용내역' },
  { label: '쿠폰목록' },
  { label: '대량 쿠폰 자동 발급', badge: true },
  { label: '쿠폰코드', sub: [{ label: '쿠폰코드 목록' }, { label: '쿠폰코드 대량발급' }] },
  { label: '쿠폰 사용내역' },
  { label: '추첨 이벤트' },
  { label: '개인정보보호 배상책임보험' },
];

const POLICY_ROWS: { no: number; item: string; content: string }[] = [
  { no: 1, item: '유효기간', content: '발급일로부터 3일간만 유효' },
  { no: 2, item: '회원별 회수', content: '회원별로 할인코드 회수(강제 무효화) 가능해야 함' },
  { no: 3, item: '사용 완료 코드', content: '이미 사용한 코드는 회수 안 되고, 취소만 가능(주문이랑 얽혀있어서)' },
  { no: 4, item: '삭제 처리 방식', content: '완전 삭제는 하지 말고 "사용안함" 상태로만 바꾸기(CS 대응 시 이력 확인 필요)' },
  { no: 5, item: '자동 만료', content: '3일 지나면 자동으로 만료 처리되게(사람이 매번 확인 안 해도 되도록)' },
  { no: 6, item: '수신거부 회원 제외', content: '마케팅 수신 거부한 사람한테는 자동으로 발송 안 되게' },
  { no: 7, item: '야간 발송 제한', content: '밤 9시~아침 8시에는 발송 안 되게(브랜드메시지 기준)' },
  { no: 8, item: '발송 결과 기록', content: '발송 성공/실패 여부 회원별로 남겨야 함' },
  { no: 9, item: '처리 로그', content: '누가 언제 코드 발급했는지, 회수했는지 로그 남기기' },
];

export function Policy() {
  return (
    <AdminLayout navActive="회원" sidebar={{ title: '회원', items: SIDEBAR_ITEMS }}>
      <Box fontFamily={FONT} color={colors.gr42} minW="1200px">
        <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="16px">정책</Text>
        <Box data-doc-mark="table">
          <DataTable
            columns={[
              { header: ['번호'], w: '70px' },
              { header: ['정책 항목'], w: '180px' },
              { header: ['내용'], flex: '1' },
            ]}
            rows={POLICY_ROWS.map((r) => [
              r.no,
              <Text fontWeight="700" color={colors.gr42}>{r.item}</Text>,
              r.content,
            ])}
          />
        </Box>
      </Box>
    </AdminLayout>
  );
}
