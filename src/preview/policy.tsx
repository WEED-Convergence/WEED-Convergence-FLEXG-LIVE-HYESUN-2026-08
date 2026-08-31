// 할인코드 정책 — 신규 독립 화면. 다른 화면(screens.tsx·discountCode2.tsx·discountCodeUsage.tsx 등)은
// 전혀 건드리지 않고 이 파일 + main.tsx의 라우팅 한 줄 + catalog.ts의 신규 엔트리 한 개(모두 추가만)로만 연결한다.
// 상단 네비(GNB)·좌측 사이드바(LNB) 없이, 할인코드 발급·발송 관련 운영 정책을 표 1개로만 보여주는 화면.
import { Box, Text } from '@chakra-ui/react';
import { DataTable, colors } from '../design-system';

const FONT = "'Pretendard', system-ui, sans-serif";

const POLICY_ROWS: { no: number; item: string; content: string }[] = [
  { no: 1, item: '유효기간', content: '발급일로부터 3일간만 유효' },
  { no: 2, item: '사용안함', content: '관리자가 할인코드를 "사용안함"으로 설정하면, 고객이 해당 코드를 입력했을 때 쇼핑몰(주문/결제 페이지)에 "사용할 수 없는 코드입니다" 안내 메시지 노출. 할인코드 수정 및 삭제는 [회원>할인코드] 화면에서 가능. 단, 이미 발송되었거나 고객이 사용한 할인코드는 수정 및 삭제 불가능' },
  { no: 3, item: '사용 완료 코드', content: '이미 사용한 코드는 삭제 안됨' },
  { no: 4, item: '삭제 처리 방식', content: '삭제 경우 리스트에서는 사라지지만 DB에서는 로그남기기(CS대응)' },
  { no: 5, item: '자동 만료', content: '3일 지나면 자동으로 만료 처리되게' },
  { no: 6, item: '수신거부 회원 제외', content: '마케팅 수신 거부한 사람한테는 자동으로 발송 안 되게' },
  { no: 7, item: '야간 발송 제한', content: '밤 9시~아침 8시에는 발송 안 되게(브랜드메시지 기준)' },
  { no: 8, item: '발송 결과 기록', content: '발송 성공/실패 여부 회원별로 남겨야 함' },
  { no: 9, item: '처리 로그', content: '누가 언제 코드 발급했는지, 삭제했는지 로그 남기기' },
];

export function Policy() {
  return (
    <Box fontFamily={FONT} color={colors.gr42} bg="white" minH="100dvh" p="40px">
      <Text fontFamily={FONT} fontWeight="700" fontSize="20px" color={colors.gr42} pb="16px">할인코드 정책</Text>
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
  );
}
