/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// 프리뷰용 샘플 화면 — 실제 프로젝트에선 이 자리에 진짜 앱 화면이 들어간다.
// 핵심: 설명 패널과 매칭할 영역에 data-doc-mark="키" 를 달면 번호 마커가 자동으로 얹힌다.
//       탭 있는 화면은 data-doc-tab 으로 탭 컨텍스트를 표시한다.
import { Box, Flex, Text } from '@chakra-ui/react';
// 대시보드(홈) — 표준 컴포넌트 조합
import { AdminLayout } from '../components/admin/AdminLayout';
import { SectionHead, StatCard, InfoCard, PillStatCard, KVColumns, AdBanner, NoticeList, Stars } from '../components/admin/dashboardAtoms';
import { colors, FONT as AFONT, asset } from '../styles/tokens';

const FONT = "'Pretendard', system-ui, sans-serif"; // 화면 콘텐츠 폰트 — 전체 프리텐다드 통일

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100dvh" bg="#F7F8FA" fontFamily={FONT} color="#1F2937" p="28px">
      <Box maxW="900px" mx="auto">{children}</Box>
    </Box>
  );
}

function Field({ label, value, mark }: { label: string; value: string; mark?: string }) {
  return (
    <Box data-doc-mark={mark} bg="#fff" border="1px solid #E5E7EB" borderRadius="10px" p="14px 16px" mb="12px">
      <Text fontSize="12px" fontWeight="700" color="#6B7280" mb="6px">{label}</Text>
      <Text fontSize="15px" color="#111827">{value}</Text>
    </Box>
  );
}

// ── 대시보드(홈) — Figma 기준, 표준 컴포넌트 조합 ──
// DatAI 표 컬럼 비율(헤더/본문 공용) — minmax(0,…)로 콘텐츠가 열 폭을 못 밀게 해 세로선 정확히 일치
const DATAI_COLS = 'minmax(0,1fr) minmax(0,1.1fr) minmax(0,1.1fr) minmax(0,1.4fr) minmax(0,2.4fr)';
// 매출 카드용 헬퍼(이 화면 전용 소품)
const QIcon = () => (
  <Flex w="16px" h="16px" align="center" justify="center" borderRadius="100px" bg={colors.grE8} flexShrink={0}>
    <Text fontFamily={AFONT} fontSize="10px" fontWeight="700" color={colors.gr92} lineHeight="1">?</Text>
  </Flex>
);
const STag = ({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'gray' }) => (
  <Flex bg={tone === 'green' ? colors.green : colors.grB8} borderRadius="4px" px="5px" pt="1px" pb="2px" align="center" flexShrink={0}>
    <Text fontFamily={AFONT} fontSize="12px" color="white" whiteSpace="nowrap">{children}</Text>
  </Flex>
);
// 매출/마진 큰 행 — (선택)태그 + 라벨 + (선택)% + 값
function BigRow({ tag, label, pct, value, big }: { tag?: React.ReactNode; label: string; pct?: string; value: string; big?: boolean }) {
  return (
    <Flex align="center" gap="8px" w="100%">
      {tag}
      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} flexShrink={0}>{label}</Text>
      <Box flex="1" />
      {pct && <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.green}>{pct}</Text>}
      <Text fontFamily={big ? 'Arial, sans-serif' : AFONT} fontWeight="700" fontSize={big ? '17px' : '13px'} color={colors.gr42}>{value}</Text>
    </Flex>
  );
}
// 회색 서브박스(제목/? 선택) + BigRow들
function SalesSub({ title, q, note, children, fill }: { title?: React.ReactNode; q?: boolean; note?: string; children: React.ReactNode; fill?: boolean }) {
  return (
    <Box bg={colors.grF8} borderRadius="10px" p="14px" h={fill ? '100%' : undefined}>
      {(title || note) && (
        <Flex align="center" gap="4px" pb="8px">
          {title && <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr42}>{title}</Text>}
          {q && <QIcon />}
          {note && <Text fontFamily={AFONT} fontSize="10px" color={colors.gr92} whiteSpace="nowrap">{note}</Text>}
        </Flex>
      )}
      <Flex direction="column" gap="7px">{children}</Flex>
    </Box>
  );
}
function Dashboard() {
  return (
    <AdminLayout navActive="home" sidebar={{ title: '홈', items: [{ label: '대시보드', active: true }] }}>
      <Box fontFamily={AFONT} color={colors.gr42} minW="1360px">
        {/* 1. 인사 + 프로모 배너 (Figma 17:1977 — 실제 배너 이미지) */}
        <Flex data-doc-mark="promo" gap="8px" pb="40px" align="center">
          {/* 인사 타이틀 */}
          <Flex direction="column" justify="center" gap="4px" pr="16px" flexShrink={0}>
            <Box>
              <Text fontFamily={AFONT} fontSize="18px" lineHeight="1.4" color={colors.gr42} whiteSpace="nowrap">오늘도 플렉스지와</Text>
              <Text fontFamily={AFONT} fontSize="18px" lineHeight="1.4" color={colors.gr42} whiteSpace="nowrap">판매는 불티나게</Text>
            </Box>
            <Box h="1px" w="100%" bg={colors.green} />
            <Flex gap="4px" align="center">
              <Text fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18px" color={colors.green} letterSpacing="-0.36px">2025.05.02</Text>
              <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr42}>금요일</Text>
            </Flex>
          </Flex>
          {/* 배너 6종 (실제 이미지). 4·5·6은 AD 마크 */}
          {[['banner-1', false], ['banner-2', false], ['banner-3', false], ['banner-4', true], ['banner-5', true], ['banner-6', true]].map(([name, ad], i) => (
            <AdBanner key={i} flex="1" src={asset(`dashboard/${name}.png`)} ad={ad as boolean} alt="" />
          ))}
        </Flex>

        {/* 2. 오늘의 할 일 (Figma 17:2012) */}
        <Box data-doc-mark="todo" pb="40px">
          <SectionHead title="오늘의 할 일" helper="ⓘ 최근 30일 기준으로 집계된 주문 상태별 건 수입니다." />
          <Flex gap="8px" bg="white" align="stretch">
            {[
              ['미입금확인', '340'], ['신규주문', '1,920'], ['배송준비', '425'], ['배송중', '979'], ['배송완료', '17,654'],
              ['취소요청', '0', true], ['반품요청', '17', true], ['교환요청', '6', true], ['미답변 상품문의', '17'],
            ].map(([l, v, d], i) => <StatCard key={i} label={l as string} value={v as string} danger={!!d} />)}
          </Flex>
        </Box>

        {/* 3. CRM 현황 (Figma 17:2061) — 2열 그룹: [CRM 현황] [어제의 CRM 지표] */}
        <Flex data-doc-mark="crm" pb="40px" gap="16px" align="stretch">
          {/* 좌측 그룹: CRM 현황 (캠페인 + 캐시) */}
          <Flex direction="column" flex="1.15" minW="0">
            <SectionHead title="CRM 현황" />
            <Flex gap="16px" align="stretch">
              {/* 캠페인 진행 현황 — 숫자 박스가 카드(=캐시 서브박스) 높이만큼 채움 */}
              <InfoCard title="캠페인 진행 현황" titleSize="12px" titleColor={colors.gr72} flex="1">
                <Flex h="100%" gap="16px">
                  <PillStatCard tone="active" label="진행중" value="8" />
                  <PillStatCard tone="ended" label="종료" value="3" />
                  <PillStatCard tone="stopped" label="중지" value="0" />
                </Flex>
              </InfoCard>
              {/* 캐시 현황 — 같은 높이로 채우고, 서브박스가 남는 높이를 채움 */}
              <InfoCard w="340px" title="캐시 현황" titleSize="12px" titleColor={colors.gr72}
                action={<Flex as="button" align="center" gap="3px" cursor="pointer"><Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color={colors.green}>충전하기</Text><Text fontSize="11px" color={colors.green} lineHeight="1">›</Text></Flex>}>
                <Flex direction="column" h="100%">
                  <Flex align="center" gap="6px" pt="4px" pb="12px">
                    <img src={asset('dashboard/cash.svg')} alt="" width={22} height={22} style={{ display: 'block' }} />
                    <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} whiteSpace="nowrap">잔여 캐시</Text>
                    <Text flex="1" textAlign="right" fontFamily={AFONT} fontSize="16px" fontWeight="700" color={colors.gr42}>18,000,000c</Text>
                  </Flex>
                  <Box flex="1" bg={colors.grF8} borderRadius="10px" p="16px">
                    <Flex justify="space-between" gap="8px" pb="8px">
                      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>· 이번 달 충전</Text>
                      <Text fontFamily={AFONT} fontSize="14px" color={colors.gr92}>20,000,000c</Text>
                    </Flex>
                    <Flex justify="space-between" gap="8px">
                      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>· 이번 달 지출</Text>
                      <Text fontFamily={AFONT} fontSize="14px" color={colors.gr92}>23,000,000c</Text>
                    </Flex>
                  </Box>
                </Flex>
              </InfoCard>
            </Flex>
          </Flex>
          {/* 우측 그룹: 어제의 CRM 지표 — 표가 캠페인 높이에 맞춰 늘어남(셀 여백 균등) */}
          <Flex direction="column" flex="1" minW="0">
            <SectionHead title="어제의 CRM 지표" />
            <Box flex="1" minH="0">
              <KVColumns columns={[
                { header: '구매 목적 캠페인', rows: [['ROAS', '500%'], ['구매 금액', '1,000,000원'], ['지출 캐시', '200,000c']] },
                { header: '회원가입 목적 캠페인', rows: [['회원가입 전환율', '3%'], ['회원가입 전환 수', '500건'], ['노출 수', '30,000,000건']] },
                { header: 'APP설치 목적 캠페인', rows: [['APP설치 전환율', '3%'], ['APP설치 수', '500건'], ['지출 캐시', '30,000,000건'], ['CPI', '1,000원']] },
              ]} />
            </Box>
          </Flex>
        </Flex>

        {/* 쇼핑몰 현황 */}
        <SectionHead title="쇼핑몰 현황" />
        <Flex data-doc-mark="shop" gap="14px" pb="10px" pt="6px" align="flex-start">
          <Box flex="1" minW="0">
            {/* ① DatAI 실시간 표 — 헤더/본문 동일 grid 컬럼(minmax(0,…)로 콘텐츠 영향 차단 → 세로선 정확히 일치) */}
            <Flex direction="column" bg={colors.grE8} borderTop="1px solid #ddd" borderBottom="1px solid #ddd">
              <Box display="grid" gridTemplateColumns={DATAI_COLS} gap="1px" pb="1px">
                {[
                  { t: 'DAU', q: true },
                  { t: '방문수 (UV)', s: 'ⓘ 최근 30분 기준 by DatAI' },
                  { t: '페이지뷰 (PV)', s: 'ⓘ 최근 30분 기준 by DatAI' },
                  { t: '실시간 유입기기', s: 'ⓘ 최근 30분 기준 by DatAI' },
                  { t: '실시간 인기 페이지', s: 'ⓘ 최근 30분 기준 by DatAI' },
                ].map((h, i) => (
                  <Flex key={i} minW="0" bg={colors.grF8} px="12px" py="10px" direction="column" align="center" gap="2px">
                    <Flex align="center" gap="3px">
                      <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr72} whiteSpace="nowrap">{h.t}</Text>
                      {h.q && <Flex w="14px" h="14px" align="center" justify="center" borderRadius="100px" bg={colors.grD8}><Text fontSize="9px" color="white" lineHeight="1">?</Text></Flex>}
                    </Flex>
                    {h.s && <Text fontFamily={AFONT} fontSize="10px" color={colors.gr92} whiteSpace="nowrap">{h.s}</Text>}
                  </Flex>
                ))}
              </Box>
              <Box display="grid" gridTemplateColumns={DATAI_COLS} gap="1px">
                {['2,980', '12,980', '42,280'].map((v, i) => (
                  <Flex key={i} minW="0" bg="white" px="12px" py="20px" align="center" justify="center">
                    <Text fontFamily="Arial, sans-serif" fontWeight="700" fontSize="26px" letterSpacing="-0.4px" color={colors.gr42}>{v}</Text>
                  </Flex>
                ))}
                <Flex minW="0" bg="white" px="16px" py="16px" direction="column" justify="center" gap="6px">
                  {[['Mobile Web', '80.50%'], ['Mobile APP', '9.50%'], ['Desktop', '1.05%']].map(([l, v], i) => (
                    <Flex key={i} align="center" gap="8px">
                      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} flex="1">{l}</Text>
                      <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr42}>{v}</Text>
                    </Flex>
                  ))}
                </Flex>
                <Flex minW="0" bg="white" px="16px" py="16px" direction="column" justify="center" gap="4px">
                  {[
                    ['1. 불티나게 파는 메가오더샵', '272'],
                    ['2. 충주 황금 사과 다이어트 직빵 골드 1박스', '113'],
                    ['3. 첫 수확! 새콤달콤 제주 극조생 감귤 4.5KG 한…', '108'],
                    ['4. 불티나게 파는 메가오더샵 | 주문목록 / 배송조회', '52'],
                    ['5. 보리로 만든 달디단 알밤 호떡, 건강에도 간식에…', '51'],
                    ['6. 미켈란 식빵 40개x1박스!', '11'],
                  ].map(([t, c], i) => (
                    <Flex key={i} align="center" gap="10px">
                      <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72} flex="1" minW="0" truncate>{t}</Text>
                      <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr42} flexShrink={0}>{c}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Flex>
            <Flex justify="flex-end" pt="8px" pb="14px">
              <Text fontFamily={AFONT} fontSize="11px" color={colors.gr92}>마지막 업데이트 <Box as="span" fontWeight="700" color={colors.green}>2024-10-05 19:30</Box></Text>
            </Flex>
            {/* ② 신규가입 / 회원탈퇴 / 총 회원 수 / APP 설치 */}
            <KVColumns columns={[
              { header: '신규가입', rows: [['어제', '1,453'], ['지난주', '2,368'], ['이번달', '5,084']] },
              { header: '회원탈퇴', rows: [['어제', '11', true], ['지난주', '23', true], ['이번달', '32', true]] },
              { header: '총 회원 수', center: '234,902' },
              { header: 'APP 설치 디바이스 수', rows: [['iOS', '4,235'], ['AOS', '24,605']] },
            ]} />
            <Box h="10px" />
            {/* ③ 리워드 지급 건 / 포인트 / 결제 금액 / 취소·반품 */}
            <KVColumns columns={[
              { header: '리워드 지급 건', rows: [['어제', '4'], ['지난주', '8'], ['이번달', '10']] },
              { header: '리워드 지급 포인트', rows: [['어제', '2,000'], ['지난주', '4,000'], ['이번달', '5,000']] },
              { header: '결제 금액', rows: [['어제', '30,199,712'], ['지난주', '104,827,235'], ['이번달', '123,168,036']] },
              { header: '취소/반품 금액', rows: [['어제', '1,486,764', true], ['지난주', '5,399,183', true], ['이번달', '4,436,801', true]] },
            ]} />
          </Box>
          {/* 매출 현황 카드 (Figma 17:2425) — 2열 + 하단 배너 */}
          <Box w="580px" flexShrink={0}>
            <Flex gap="16px" align="stretch">
              {/* 좌: 오늘의 매출 현황 */}
              <InfoCard flex="1" title="오늘의 매출 현황" action={<QIcon />}>
                <Text fontFamily={AFONT} fontWeight="700" fontSize="11px" color={colors.green} pb="10px">마지막 업데이트 2025-05-01 19:00:08</Text>
                <Flex direction="column" gap="6px">
                  <BigRow tag={<STag>현재 19:00</STag>} label="매출" value="20,589,080원" big />
                  <BigRow label="마진" pct="24.89%" value="5,124,901원" />
                  <Box h="4px" />
                  <BigRow tag={<STag tone="gray">어제 19:00</STag>} label="매출" value="20,589,080원" big />
                  <BigRow label="마진" pct="24.89%" value="5,124,901원" />
                </Flex>
                <Box h="12px" />
                <SalesSub title={<>지난 1개월 매주 <Box as="span" color={colors.green}>토요일</Box> 평균</>} q>
                  <BigRow label="· 매출 (현재)" value="8,550,515원" big />
                  <BigRow label="· 마진 (현재)" pct="23.35%" value="1,902,802원" />
                  <BigRow label="· 매출 (일)" value="9,641,880원" big />
                  <BigRow label="· 마진 (일)" pct="23.44%" value="2,259,745원" />
                </SalesSub>
                <Box h="8px" />
                <SalesSub title="오늘의 예상 매출" note="ⓘ 일 평균 매출 대비">
                  <BigRow label="· 예상 매출" value="23,217,015원" big />
                  <BigRow label="· 예상 마진" pct="24.98%" value="5,799,413원" />
                </SalesSub>
              </InfoCard>
              {/* 우: 어제의 매출 + 이번달 예상 */}
              <Flex direction="column" gap="16px" flex="1">
                <InfoCard title="어제의 매출 현황" action={<QIcon />}>
                  <Text fontFamily={AFONT} fontSize="11px" color={colors.gr92} pb="10px" textAlign="right">ⓘ 이번 달 누적 매출 97,644,174원</Text>
                  <Flex direction="column" gap="8px">
                    <BigRow tag={<STag>어제</STag>} label="매출" value="28,700,096원" big />
                    <BigRow tag={<STag>어제</STag>} label="마진" pct="24.16%" value="6,932,691원" />
                  </Flex>
                  <Box h="12px" />
                  <SalesSub>
                    <BigRow label="· 총 구매 건 수" value="1,770건" />
                    <BigRow label="· 구매 전환율" value="3.74%" />
                    <BigRow label="· 평균 구매 상품 수" value="1,000개" />
                    <BigRow label="· 객단가" value="16,214원" />
                  </SalesSub>
                </InfoCard>
                <InfoCard flex="1" title="이번달 예상 매출액" action={<QIcon />}>
                  <Flex direction="column" h="100%">
                    <Text fontFamily={AFONT} fontSize="11px" color={colors.gr92} pb="10px">ⓘ 일 평균 매출 24,411,043.50원 유지시</Text>
                    <Flex align="center" gap="8px" pb="12px">
                      <Text fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.green}>24.22%</Text>
                      <Box flex="1" />
                      <Text fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20px" color={colors.gr42}>756,742,349원</Text>
                    </Flex>
                    <Box flex="1" minH="0">
                      <SalesSub fill>
                        <BigRow label="· 지난 달 매출" value="352,892,021원" />
                        <BigRow label="· 마진" pct="22.47%" value="79,280,850원" />
                      </SalesSub>
                    </Box>
                  </Flex>
                </InfoCard>
              </Flex>
            </Flex>
            <Flex justify="center" pt="14px">
              <Text fontFamily={AFONT} fontSize="12px" color={colors.gr72}>쇼핑몰 매출 현황을 한 눈에 확인해 보세요! <Box as="button" fontWeight="700" color={colors.green} cursor="pointer">자세히보기</Box></Text>
            </Flex>
          </Box>
        </Flex>

        {/* 유료서비스 현황 */}
        <SectionHead title="유료서비스 현황" helper="ⓘ 이번 달에 청구 예정인 유료서비스 이용현황입니다." />
        {/* 표가 우측 배너(480×130) 높이까지 채워 두 영역 높이 동일 */}
        <Flex data-doc-mark="paid" gap="16px" pb="30px" pt="6px" align="stretch">
          <Box flex="1" minW="0" display="flex" flexDirection="column">
            <Box flex="1" minH="0">
              <KVColumns
                columns={[
                  { header: 'SMS', lines: [{ t: '353건', b: true }, { t: '4,589원', b: true }, { t: '(건/13원)' }] },
                  { header: 'LMS', lines: [{ t: '273건', b: true }, { t: '10,647원', b: true }, { t: '(건/39원)' }] },
                  { header: '알림톡', lines: [{ t: '20,704건', b: true }, { t: '248,448원', b: true }, { t: '(건/12원)' }] },
                  { header: '트래픽', lines: [{ t: '매월말 별도 신청' }] },
                  { header: '총 이용금액', lines: [{ t: '263,684원', b: true }] },
                ]}
              />
            </Box>
          </Box>
          <AdBanner src={asset('dashboard/promo-shopapp.png')} w="480px" alt="쇼핑몰앱 제작 안내" />
        </Flex>

        {/* 구매후기 · 상품문의 · 공지사항 (Figma 17:2557) — 3열(565/565/480), 표 3종 · 세 영역 높이 동일(표가 남는 높이 채움) */}
        <Flex data-doc-mark="reviews" gap="16px" align="stretch" pb="10px">
          {/* 구매후기 — 별점 5줄 / 구매후기 수 5줄 */}
          <Flex direction="column" flex="565" minW="0">
            <SectionHead title="구매후기" helper="ⓘ 최근 30일 기준 집계" more />
            <Box flex="1" minH="0">
              <KVColumns columns={[
                { header: '별점', nodes: [5, 4, 3, 2, 1].map((s) => <Stars key={s} n={s} size={18} />) },
                { header: '구매후기 수', nodes: ['2,152', '526', '220', '76', '111'].map((v) => (
                  <Text key={v} fontFamily={AFONT} fontWeight="700" fontSize="12px" color={colors.gr72} letterSpacing="-0.24px">{v}</Text>
                )) },
              ]} />
            </Box>
          </Flex>
          {/* 상품문의 — 답변여부(보통) / 게시글 수(굵게) */}
          <Flex direction="column" flex="565" minW="0">
            <SectionHead title="상품문의" helper="ⓘ 최근 30일 기준 집계" more />
            <Box flex="1" minH="0">
              <KVColumns columns={[
                { header: '답변여부', lines: [{ t: '미답변' }, { t: '답변완료' }] },
                { header: '게시글 수', lines: [{ t: '11', b: true }, { t: '338', b: true }] },
              ]} />
            </Box>
          </Flex>
          {/* 플렉스지 공지사항 — 첫 줄 굵게 */}
          <Flex direction="column" flex="480" minW="0">
            <SectionHead title="플렉스지 공지사항" more />
            <Box flex="1" minH="0">
              <NoticeList items={[
                { title: '영세/중소 사업자 대상 신용카드 수수료 변경 안내', date: '2022-02-07', bold: true },
                { title: '[업데이트 릴리즈 2024.09.2] 9월 정기 업데이트 소식', date: '2024-09-24' },
                { title: '추석 연휴 휴무 및 정상 근무 안내', date: '2024-09-06' },
                { title: '데이터 센터 이전에 따른 서비스 일시 중단 안내', date: '2024-08-19' },
                { title: '[업데이트 릴리즈 2024.08.06] 8월 정기 업데이트 소식', date: '2024-08-06' },
                { title: '네이버 단축 URL 서비스 정상화 완료', date: '2024-08-01' },
              ]} />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </AdminLayout>
  );
}

// ── 항목 상세(팝업) ──
function ItemDetail() {
  return (
    <Box minH="100dvh" bg="rgba(17,24,39,0.35)" fontFamily={FONT} display="flex" alignItems="center" justifyContent="center" p="24px">
      <Box w="100%" maxW="520px" bg="#fff" borderRadius="16px" overflow="hidden" boxShadow="0 20px 60px rgba(0,0,0,0.3)">
        <Flex px="22px" py="16px" borderBottom="1px solid #F0F1F3" align="center">
          <Text fontSize="17px" fontWeight="800">항목 상세</Text>
        </Flex>
        <Box p="22px">
          {/* 1. 기본 정보 */}
          <Box data-doc-mark="form">
            <Field label="항목명" value="신규 캠페인 A" />
            <Field label="상태" value="진행중" />
            <Field label="담당자" value="김희연" />
          </Box>
        </Box>
        {/* 2. 하단 액션 */}
        <Flex data-doc-mark="actions" px="22px" py="16px" borderTop="1px solid #F0F1F3" justify="flex-end" gap="8px">
          <Flex px="16px" h="40px" border="1px solid #E5E7EB" borderRadius="9px" align="center" fontSize="14px" color="#DC2626">삭제</Flex>
          <Flex px="16px" h="40px" border="1px solid #E5E7EB" borderRadius="9px" align="center" fontSize="14px">닫기</Flex>
          <Flex px="20px" h="40px" bg="#3F3F46" color="#fff" borderRadius="9px" align="center" fontWeight="700" fontSize="14px">저장</Flex>
        </Flex>
      </Box>
    </Box>
  );
}

// ── 뷰어 홈 ──
function Viewer() {
  return (
    <Box minH="100dvh" bg="#fff" fontFamily={FONT} color="#111827">
      {/* 1. 히어로 배너 */}
      <Box data-doc-mark="hero" h="240px" bgGradient="linear(to-r, #6D28D9, #DB2777)" bg="#7C3AED" display="flex" alignItems="flex-end" p="28px">
        <Box><Text color="#fff" fontSize="13px" opacity={0.85} mb="6px">오늘의 라이브</Text><Text color="#fff" fontSize="28px" fontWeight="800">여름 특가 라이브 방송</Text></Box>
      </Box>
      {/* 2. 콘텐츠 카드 */}
      <Box p="24px">
        <Text fontSize="18px" fontWeight="800" mb="16px">추천 콘텐츠</Text>
        <Flex data-doc-mark="grid" gap="16px" flexWrap="wrap">
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} w="calc(50% - 8px)" bg="#F7F8FA" border="1px solid #EEF0F3" borderRadius="14px" overflow="hidden">
              <Box h="120px" bg="#E5E7EB" />
              <Box p="14px"><Text fontSize="15px" fontWeight="700" mb="4px">콘텐츠 {i}</Text><Text fontSize="13px" color="#6B7280">한 줄 설명이 들어갑니다</Text></Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

// 라우트 → 화면 매핑
export function DemoScreen() {
  const path = window.location.pathname.replace(/^\/preview\//, '');
  switch (path) {
    case 'dashboard': return <Dashboard />;
    case 'item-detail': return <ItemDetail />;
    case 'viewer': return <Viewer />;
    default: return <Screen><Text>알 수 없는 프리뷰: {path}</Text></Screen>;
  }
}
