/* ============================================================
 *  docs 시스템 개발 : 김희연 / 2026.06.01
 * ============================================================ */
// 화면 코멘트(피그마식 핀) 저장소 — localStorage 전용.
//  · 좌표는 프리뷰 박스 기준 상대값(0..1) — 해상도/창 크기가 달라도 같은 자리에 핀이 찍힌다.
//  · 팀 실시간 공유가 필요하면 이 파일만 Supabase 등 원격 백엔드로 교체하면 됨(공개 API 동일 유지).
//    공개 API: commentsOf / repliesOf / add / update / remove / subscribe / countOf / getAuthor

export interface DocComment {
  id: string;
  entryId: string;   // 어떤 화면(DocEntry.id)에 찍힌 핀인가
  x: number;         // 0..1 (프리뷰 박스 기준 상대 좌표)
  y: number;         // 0..1
  text: string;
  author: string;
  createdAt: string; // ISO
  updatedAt?: string;
  resolved?: boolean;
  parentId?: string; // 있으면 이 코멘트는 parentId(루트 코멘트)의 답글
  context?: string;  // 작성된 탭/하위 컨텍스트(data-doc-tab). 없으면 화면 전체(모든 탭에 노출)
}

const LS_KEY = 'hydocs-comments';
const LS_AUTHOR = 'hydocs-comment-author';

let cache: DocComment[] = readLocal();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

function readLocal(): DocComment[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const o = raw ? JSON.parse(raw) : [];
    return Array.isArray(o) ? (o as DocComment[]) : [];
  } catch { return []; }
}
function writeLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cache)); } catch { /* 용량 초과 등 무시 */ }
}

// 브라우저 여러 탭 동기화 — 다른 탭에서 저장하면 이 탭 캐시도 갱신.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === LS_KEY) { cache = readLocal(); emit(); }
  });
}

function uid(): string {
  // Math.random 없이도 충돌 안 나게: 시간 + 카운터.
  uid._n = (uid._n + 1) % 1e6;
  return `c${Date.now().toString(36)}${uid._n.toString(36)}`;
}
uid._n = 0;

// ── 조회 ──
export function commentsOf(entryId: string, context?: string): DocComment[] {
  return cache
    .filter((c) => c.entryId === entryId && !c.parentId)
    .filter((c) => context == null || !c.context || c.context === context)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export function repliesOf(parentId: string): DocComment[] {
  return cache
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export function replyCount(parentId: string): number {
  return cache.reduce((n, c) => (c.parentId === parentId ? n + 1 : n), 0);
}
// 화면별 미해결 루트 코멘트 수 — 사이드바 뱃지용
export function countOf(entryId: string): number {
  return cache.reduce((n, c) => (c.entryId === entryId && !c.parentId && !c.resolved ? n + 1 : n), 0);
}

// ── 작성자 ──
export function getAuthor(): string {
  try { return localStorage.getItem(LS_AUTHOR) || ''; } catch { return ''; }
}
export function setAuthor(name: string) {
  try { localStorage.setItem(LS_AUTHOR, name); } catch { /* 무시 */ }
}

// ── 변경 ──
export function addComment(input: Omit<DocComment, 'id' | 'createdAt'>): DocComment {
  const c: DocComment = { ...input, id: uid(), createdAt: new Date().toISOString() };
  cache = [...cache, c];
  writeLocal();
  emit();
  return c;
}
export function updateComment(id: string, patch: Partial<Pick<DocComment, 'text' | 'resolved' | 'x' | 'y'>>) {
  cache = cache.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c));
  writeLocal();
  emit();
}
export function removeComment(id: string) {
  // 루트 삭제 시 답글도 함께 제거.
  cache = cache.filter((c) => c.id !== id && c.parentId !== id);
  writeLocal();
  emit();
}
