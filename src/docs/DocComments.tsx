/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  commentsOf, repliesOf, subscribe, addComment, updateComment, removeComment,
  getAuthor, setAuthor,
} from './commentStore';

// DocComments가 쓰는 테마 색 부분집합 — DocsShell의 Theme와 호환.
export interface CommentTheme {
  panel: string; border: string; borderSoft: string; text: string; textSub: string;
  textMuted: string; hover: string; searchBg: string; accent: string; onAccent: string;
}

const PIN = '#2563EB';          // 코멘트 핀 색(마커 분홍과 구분)
const PIN_RESOLVED = '#9CA3AF'; // 해결됨

// 코멘트 작성 모드 커서 — 번호 없는 말풍선 아이콘(피그마식). 핫스팟은 꼬리 끝(8,28).
const CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32"><path d="M6 4h20a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H15l-7 5v-5H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="${PIN}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
const COMMENT_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(CURSOR_SVG)}") 8 28, crosshair`;

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch { return ''; }
}

interface Props {
  entryId: string;
  t: CommentTheme;
  active: boolean;                          // 코멘트 보기(핀 표시 + 핀 클릭해 스레드 열기) on/off
  placing: boolean;                         // 새 핀 배치 모드(빈 화면 클릭=새 코멘트). active(보기)와 분리.
  openId: string | null;                    // 펼쳐 본 코멘트(목록↔핀 연동 위해 부모가 관리)
  setOpenId: (id: string | null) => void;
  activeContext: string;                    // iframe에서 현재 활성 탭(data-doc-tab). 핀을 이 탭 코멘트로 한정. 탭 없는 화면은 ''.
}

// 프리뷰 박스(=부모) 위에 깔리는 코멘트 오버레이.
// 부모 Box는 position:relative 여야 하며, 이 컴포넌트는 inset:0으로 덮는다.
// active=false면 핀을 아예 그리지 않아 화면이 깨끗(보기/안보기 = [코멘트] 토글).
export function DocComments({ entryId, t, active, placing, openId, setOpenId, activeContext }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [, bump] = useState(0);
  // store 변경 시 리렌더 → 매 렌더에서 최신 코멘트를 직접 읽음
  useEffect(() => subscribe(() => bump((n) => n + 1)), []);
  const comments = commentsOf(entryId);
  // 탭별 노출: context가 있는 핀은 그 탭이 활성일 때만, context 없는(기존/단일화면) 핀은 항상 노출
  const shown = comments.filter((c) => !c.context || c.context === activeContext);

  const [editId, setEditId] = useState<string | null>(null);     // 수정 중
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null); // 새 핀 위치
  const [text, setText] = useState('');
  const [replyText, setReplyText] = useState(''); // 답글 입력
  const [author, setAuthorState] = useState(getAuthor());
  // 핀 드래그 — 끌어서 위치 이동. moved=임계 넘게 움직였는지(클릭과 구분).
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; moved: boolean } | null>(null);

  // 다른 코멘트를 펼치면 수정중/답글입력 정리
  useEffect(() => { setEditId(null); setText(''); setReplyText(''); }, [openId]);
  // 화면이 바뀌면 작성중/수정중 정리(openId는 부모가 화면 전환 시 리셋)
  useEffect(() => { setEditId(null); setDraft(null); setText(''); }, [entryId]);
  // 보기를 끄면 핀이 사라지므로 작성중/펼침도 모두 닫음
  useEffect(() => { if (!active) { setDraft(null); setEditId(null); setOpenId(null); } }, [active, setOpenId]);
  // 배치 모드를 끄면 작성 중이던 새 핀 취소(스레드 보기는 유지)
  useEffect(() => { if (!placing) setDraft(null); }, [placing]);

  const closeAll = () => { setOpenId(null); setEditId(null); setDraft(null); setText(''); };

  // 빈 캔버스 클릭 — 열린 팝오버가 있으면 닫기만, 없으면 새 핀 배치
  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (openId || editId || draft) { closeAll(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setText('');
    setDraft({ x, y });
  };

  // 핀 드래그(포인터 캡처) — 끌면 위치 이동(저장), 거의 안 움직이면 클릭(팝오버 토글).
  const relXY = (clientX: number, clientY: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return null;
    return { x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)), y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)), rect };
  };
  const onPinDown = (e: React.PointerEvent, c: { id: string; x: number; y: number }) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag({ id: c.id, x: c.x, y: c.y, moved: false });
  };
  const onPinMove = (e: React.PointerEvent, c: { id: string; x: number; y: number }) => {
    if (!drag || drag.id !== c.id) return;
    const r = relXY(e.clientX, e.clientY);
    if (!r) return;
    const moved = drag.moved || Math.abs(r.x - c.x) * r.rect.width > 3 || Math.abs(r.y - c.y) * r.rect.height > 3;
    setDrag({ id: c.id, x: r.x, y: r.y, moved });
  };
  const onPinUp = (e: React.PointerEvent, c: { id: string; x: number; y: number }) => {
    if (!drag || drag.id !== c.id) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (drag.moved) updateComment(c.id, { x: drag.x, y: drag.y });
    else { setEditId(null); setText(''); setDraft(null); setOpenId(openId === c.id ? null : c.id); }
    setDrag(null);
  };

  // 팝오버를 화면(viewport) 좌표로 배치 — 부모의 overflow:hidden에 안 잘리게 fixed 사용.
  const anchorStyle = (x: number, y: number): React.CSSProperties => {
    const root = rootRef.current;
    const rect = root?.getBoundingClientRect();
    const W = 320, H = 200, M = 8;
    const px = (rect?.left ?? 0) + x * (rect?.width ?? 0);
    const py = (rect?.top ?? 0) + y * (rect?.height ?? 0);
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = px + 16;
    if (left + W + M > vw) left = px - W - 16;     // 오른쪽 공간 부족 → 왼쪽으로
    if (left < M) left = M;
    let top = py - 12;
    if (top + H + M > vh) top = vh - H - M;
    if (top < M) top = M;
    return { position: 'fixed', left, top, width: W, zIndex: 2147483646 };
  };

  const saveDraft = () => {
    const body = text.trim();
    if (!body || !draft) { setDraft(null); return; }
    const name = author.trim() || '익명';
    setAuthor(name);
    addComment({ entryId, x: draft.x, y: draft.y, text: body, author: name, context: activeContext || undefined });
    setDraft(null); setText('');
  };

  const saveEdit = (id: string) => {
    const body = text.trim();
    if (!body) { setEditId(null); return; }
    updateComment(id, { text: body });
    setEditId(null); setText('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${t.border}`,
    background: t.searchBg, color: t.text, fontSize: 13, padding: '8px 10px', fontFamily: 'inherit',
    outline: 'none', resize: 'vertical',
  };

  const open = comments.find((c) => c.id === openId);
  const replies = open ? repliesOf(open.id) : [];
  const submitReply = () => {
    const body = replyText.trim();
    if (!body || !open) return;
    const name = author.trim() || '익명';
    setAuthor(name);
    addComment({ entryId, x: open.x, y: open.y, text: body, author: name, parentId: open.id, context: open.context });
    setReplyText('');
  };

  return (
    <Box ref={rootRef} position="absolute" inset="0" zIndex={20} pointerEvents="none">
      {/* 배치 모드일 때만 클릭 캡처 레이어(아래) — 핀은 그 위라 항상 클릭됨. 보기 모드에선 깔지 않아 캔버스 클릭으로 핀이 안 생김 */}
      {placing && (
        <Box position="absolute" inset="0" pointerEvents="auto" style={{ cursor: COMMENT_CURSOR }} onClick={onCanvasClick} />
      )}

      {/* 저장된 핀들 — 코멘트 모드일 때만, 현재 탭에 속한 것만 표시 */}
      {active && shown.map((c, i) => {
        const isOpen = c.id === openId;
        const dragging = drag?.id === c.id;
        const px = dragging ? drag!.x : c.x;
        const py = dragging ? drag!.y : c.y;
        return (
          <Flex
            key={c.id}
            position="absolute"
            left={`${px * 100}%`}
            top={`${py * 100}%`}
            transform="translate(-50%, -50%)"
            align="center"
            justify="center"
            w="24px"
            h="24px"
            borderRadius="50% 50% 50% 2px"
            bg={c.resolved ? PIN_RESOLVED : PIN}
            border="2px solid #fff"
            boxShadow={dragging ? '0 4px 12px rgba(0,0,0,0.5)' : '0 1px 5px rgba(0,0,0,0.4)'}
            cursor={dragging ? 'grabbing' : 'grab'}
            pointerEvents="auto"
            touchAction="none"
            opacity={c.resolved && !isOpen ? 0.75 : 1}
            outline={isOpen ? `2px solid ${PIN}` : undefined}
            outlineOffset="1px"
            zIndex={dragging ? 1 : undefined}
            onPointerDown={(e) => onPinDown(e, c)}
            onPointerMove={(e) => onPinMove(e, c)}
            onPointerUp={(e) => onPinUp(e, c)}
            title={`${c.text}  (드래그로 이동)`}
          >
            <Text fontSize="11px" fontWeight="800" color="#fff" lineHeight="1">{c.resolved ? '✓' : i + 1}</Text>
          </Flex>
        );
      })}

      {/* 열어 본 코멘트 팝오버 */}
      {open && (
        <Box pointerEvents="auto" style={anchorStyle(open.x, open.y)} maxH="72vh" overflowY="auto" bg={t.panel} border={`1px solid ${t.border}`} borderRadius="12px" boxShadow="0 8px 28px rgba(0,0,0,0.28)" p="14px">
          <Flex align="center" gap="8px" pb="8px">
            <Box w="8px" h="8px" borderRadius="100px" bg={open.resolved ? PIN_RESOLVED : PIN} flexShrink={0} />
            <Text fontSize="12px" fontWeight="800" color={t.text}>{open.author}</Text>
            <Text fontSize="11px" color={t.textMuted}>{fmtTime(open.updatedAt ?? open.createdAt)}</Text>
            {open.resolved && <Text fontSize="9px" fontWeight="800" color="#fff" bg={PIN_RESOLVED} px="5px" py="1px" borderRadius="4px">해결됨</Text>}
            {open.context && <Text fontSize="9px" fontWeight="800" color="#fff" bg={PIN} px="5px" py="1px" borderRadius="4px" whiteSpace="nowrap">📍 {open.context}</Text>}
            <Box flex="1" />
            <Box as="button" onClick={() => setOpenId(null)} cursor="pointer" title="닫기"><Text fontSize="13px" color={t.textMuted}>✕</Text></Box>
          </Flex>

          {editId === open.id ? (
            <>
              <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={3} style={inputStyle} />
              <Flex gap="6px" pt="8px" justify="flex-end">
                <Box as="button" onClick={() => { setEditId(null); setText(''); }} px="12px" py="6px" borderRadius="7px" border={`1px solid ${t.border}`} cursor="pointer"><Text fontSize="12px" color={t.textSub}>취소</Text></Box>
                <Box as="button" onClick={() => saveEdit(open.id)} px="12px" py="6px" borderRadius="7px" bg={t.accent} cursor="pointer"><Text fontSize="12px" fontWeight="700" color={t.onAccent}>저장</Text></Box>
              </Flex>
            </>
          ) : (
            <>
              <Text fontSize="13px" color={t.textSub} lineHeight="1.6" whiteSpace="pre-wrap">{open.text}</Text>
              <Flex gap="6px" pt="12px" align="center">
                <Box as="button" onClick={() => updateComment(open.id, { resolved: !open.resolved })} px="10px" py="6px" borderRadius="7px" border={`1px solid ${t.border}`} cursor="pointer" _hover={{ bg: t.hover }}>
                  <Text fontSize="12px" fontWeight="700" color={t.textSub}>{open.resolved ? '↩ 해결 취소' : '✓ 해결'}</Text>
                </Box>
                <Box as="button" onClick={() => { setText(open.text); setEditId(open.id); }} px="10px" py="6px" borderRadius="7px" border={`1px solid ${t.border}`} cursor="pointer" _hover={{ bg: t.hover }}>
                  <Text fontSize="12px" color={t.textSub}>수정</Text>
                </Box>
                <Box flex="1" />
                <Box as="button" onClick={() => { if (window.confirm('이 코멘트와 답글을 삭제할까요?')) { removeComment(open.id); setOpenId(null); } }} px="10px" py="6px" borderRadius="7px" cursor="pointer" _hover={{ bg: t.hover }}>
                  <Text fontSize="12px" color="#DC2626">삭제</Text>
                </Box>
              </Flex>

              {/* 답글 스레드 */}
              <Box pt="12px" mt="10px" borderTop={`1px solid ${t.borderSoft}`}>
                {replies.length > 0 && (
                  <Flex direction="column" gap="9px" pb="10px">
                    {replies.map((r) => (
                      <Flex key={r.id} gap="7px" align="flex-start">
                        <Box w="5px" h="5px" mt="6px" borderRadius="100px" bg={t.textMuted} flexShrink={0} />
                        <Box flex="1" minW="0">
                          <Flex align="center" gap="6px">
                            <Text fontSize="11.5px" fontWeight="700" color={t.text} truncate>{r.author}</Text>
                            <Text fontSize="10px" color={t.textMuted}>{fmtTime(r.createdAt)}</Text>
                            <Box flex="1" />
                            <Box as="button" onClick={() => { if (window.confirm('답글을 삭제할까요?')) removeComment(r.id); }} cursor="pointer" title="답글 삭제"><Text fontSize="10px" color={t.textMuted} _hover={{ color: '#DC2626' }}>삭제</Text></Box>
                          </Flex>
                          <Text fontSize="12.5px" color={t.textSub} lineHeight="1.5" whiteSpace="pre-wrap">{r.text}</Text>
                        </Box>
                      </Flex>
                    ))}
                  </Flex>
                )}
                <Flex direction="column" gap="6px">
                  <input value={author} onChange={(e) => setAuthorState(e.target.value)} placeholder="작성자 이름"
                    style={{ ...inputStyle, padding: '7px 10px' }} />
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="답글 달기…  (Enter 등록, Shift+Enter 줄바꿈)" rows={2}
                    style={inputStyle}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(); } }} />
                  <Flex justify="flex-end">
                    <Box as="button" onClick={submitReply} px="14px" py="6px" borderRadius="7px" bg={t.accent} cursor="pointer">
                      <Text fontSize="12px" fontWeight="700" color={t.onAccent} whiteSpace="nowrap">등록</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* 새 핀 작성 — 임시 마커 + 컴포저 */}
      {draft && (
        <>
          <Flex position="absolute" left={`${draft.x * 100}%`} top={`${draft.y * 100}%`} transform="translate(-50%, -50%)" align="center" justify="center" w="24px" h="24px" borderRadius="50% 50% 50% 2px" bg={PIN} border="2px solid #fff" boxShadow="0 1px 5px rgba(0,0,0,0.4)" pointerEvents="none">
            <Text fontSize="12px" fontWeight="800" color="#fff" lineHeight="1">+</Text>
          </Flex>
          <Box pointerEvents="auto" style={anchorStyle(draft.x, draft.y)} bg={t.panel} border={`1px solid ${t.border}`} borderRadius="12px" boxShadow="0 8px 28px rgba(0,0,0,0.28)" p="14px">
            <Text fontSize="12px" fontWeight="800" color={t.text} pb="8px">새 코멘트</Text>
            <input value={author} onChange={(e) => setAuthorState(e.target.value)} placeholder="작성자 이름" style={{ ...inputStyle, marginBottom: 8 }} />
            <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="코멘트를 입력하세요…" rows={3} style={inputStyle}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') saveDraft(); }} />
            <Flex gap="6px" pt="8px" justify="flex-end">
              <Box as="button" onClick={() => { setDraft(null); setText(''); }} px="12px" py="6px" borderRadius="7px" border={`1px solid ${t.border}`} cursor="pointer"><Text fontSize="12px" color={t.textSub}>취소</Text></Box>
              <Box as="button" onClick={saveDraft} px="12px" py="6px" borderRadius="7px" bg={t.accent} cursor="pointer"><Text fontSize="12px" fontWeight="700" color={t.onAccent}>저장</Text></Box>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  );
}
