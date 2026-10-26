/**
 * The desktop editor. Everything the user does is drawn at once from the local model; the matching
 * operation is queued and saved to the .pptx in the background (one operation = one server version,
 * so local undo/redo and the server's version list stay in step).
 *
 * Changes the browser cannot finish alone (new slides, new / replaced images, duplicates, slide background)
 * wait for the server's answer, which carries the new ids and pictures.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { api } from './api.js';
import { t } from './i18n.js';
import { fromDOM } from './textdom.js';
import SlideView from './SlideView.jsx';

const IN = 914400;            // EMU per inch
const MIN = IN / 10;          // smallest box
const FONTS = ['Arial', 'Calibri', 'Cambria', 'Georgia', 'Montserrat', 'Roboto', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Courier New'];
const clone = (x) => structuredClone(x);
const textOf = (e) => e?.kind === 'table' || e?.kind === 'shape' || e?.kind === 'text';

function caretAt(x, y) {
  const sel = window.getSelection();
  let range = null;
  if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(x, y);
  else if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p) { range = document.createRange(); range.setStart(p.offsetNode, p.offset); }
  }
  if (range) { sel.removeAllRanges(); sel.addRange(range); }
}

function selectAll(root) {
  const r = document.createRange(); r.selectNodeContents(root);
  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
}

/** paragraphs read back from the page + the model's paragraphs -> new model paragraphs */
function merge(old, parsed) {
  return parsed.map((p) => {
    const base = old[p.src] || old.at(-1) || { level: 0, marL: 0, indent: 0, bullet: null, end: p.end };
    const out = { ...base, src: p.src, align: p.align, runs: p.runs, end: { ...base.end, ...p.end } };
    if (p.bullet !== undefined) {
      out.bullet = p.bullet ? (base.bullet || { char: '•', size: 1 }) : null;
      out._buset = p.bullet;
      if (p.bullet && !base.marL) { out.marL = 342900; out.indent = -342900; }
    }
    return out;
  });
}

const sameText = (a, b) => JSON.stringify(a.map((p) => [p.align, p.runs, p.bullet ?? null])) === JSON.stringify(b.map((p) => [p.align, p.runs, p._buset ?? (p.bullet ? true : null)]));

function Btn({ title, onClick, active, disabled, children, wide }) {
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      className={`grid h-8 ${wide ? 'px-2.5' : 'w-8'} shrink-0 place-items-center rounded-md text-[13px] font-medium transition-colors
        ${active ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'} disabled:opacity-35 disabled:hover:bg-transparent`}>
      {children}
    </button>
  );
}
const Sep = () => <span className="mx-1 h-6 w-px shrink-0 bg-slate-200" />;

export default function Editor({ docId, onClose, onFatal }) {
  const [model, setModel] = useState(null);
  const [cur, setCur] = useState(0);                  // slide index
  const [sel, setSel] = useState(null);               // selected element id
  const [editing, setEditing] = useState(null);       // { id, cell?: "r:c" }
  const [drag, setDrag] = useState(null);             // live box while moving / resizing
  const [pending, setPending] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [fmt, setFmt] = useState({});                 // toolbar state while typing
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });

  const modelRef = useRef(null); modelRef.current = model;
  const version = useRef(0);
  const past = useRef([]), future = useRef([]);
  const queue = useRef(Promise.resolve());
  const roots = useMemo(() => new Map(), []);
  const canvasRef = useRef(null);
  const savedRange = useRef(null);
  const fileInput = useRef(null), replaceInput = useRef(null);
  const colorTimer = useRef(null);
  const later = (fn) => { clearTimeout(colorTimer.current); colorTimer.current = setTimeout(fn, 350); }; // colour pickers fire on every move

  const say = useCallback((key) => { setToast(t(key)); clearTimeout(say.timer); say.timer = setTimeout(() => setToast(null), 3500); }, []);

  const load = useCallback(async () => {
    const m = await api.doc(docId);
    version.current = m.version; past.current = []; future.current = [];
    setModel(m); setCur((c) => Math.min(c, m.slides.length - 1));
    return m;
  }, [docId]);

  useEffect(() => { load().catch((e) => onFatal(e.key)); }, [load, onFatal]);

  const fail = useCallback((e) => {
    if (e?.key === 'expired') { onFatal('expired'); return; }
    say(e?.key === 'lastSlide' ? 'lastSlide' : 'saveError');
    queue.current = Promise.resolve();
    load().catch((err) => onFatal(err.key));
  }, [load, onFatal, say]);

  /** queue a server call; failures reload the document from the server */
  const enqueue = useCallback((fn) => {
    setPending((n) => n + 1);
    queue.current = queue.current.then(fn).then((r) => { if (r?.version) version.current = r.version; })
      .catch(fail).finally(() => setPending((n) => n - 1));
    return queue.current;
  }, [fail]);

  /** optimistic change: draw now, save in the background */
  const act = useCallback((mutate, ops) => {
    const prev = modelRef.current;
    const next = clone(prev); mutate(next);
    past.current.push(prev); if (past.current.length > 30) past.current.shift(); future.current = [];
    setModel(next);
    enqueue(() => api.ops(docId, version.current, ops, false).then((r) => ({ ...r })));
  }, [docId, enqueue]);

  /** change that needs the server's answer (new ids / pictures) */
  const actFull = useCallback(async (ops, after) => {
    setBusy(true);
    try {
      await queue.current;
      const prev = modelRef.current;
      const m = await api.ops(docId, version.current, ops, true);
      past.current.push(prev); if (past.current.length > 30) past.current.shift(); future.current = [];
      version.current = m.version; setModel(m); after?.(m);
    } catch (e) { fail(e); } finally { setBusy(false); }
  }, [docId, fail]);

  const slide = model?.slides[cur];
  const elOf = (m, id) => m.slides[cur].elements.find((e) => e.id === id);
  const selected = slide && sel != null ? slide.elements.find((e) => e.id === sel) : null;

  // canvas scale: the slide fits the free space
  useLayoutEffect(() => {
    const el = canvasRef.current; if (!el) return undefined;
    const ro = new ResizeObserver(([en]) => setCanvasSize({ w: en.contentRect.width, h: en.contentRect.height }));
    ro.observe(el); return () => ro.disconnect();
  }, [model != null]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = model ? Math.min((canvasSize.w - 48) / model.width, (canvasSize.h - 48) / model.height) : 1;

  // ---------------------------------------------------------------- text editing
  const rootKey = (ed) => (ed.cell ? `${ed.id}:${ed.cell}` : String(ed.id));
  const fitOf = (e) => e?.text?.body?.scale || 1;

  const commitEdit = useCallback(() => {
    const ed = editing; if (!ed) return;
    const root = roots.get(rootKey(ed));
    setEditing(null); savedRange.current = null;
    if (!root) return;
    root.contentEditable = 'false';
    const m = modelRef.current; const e = m.slides[cur].elements.find((x) => x.id === ed.id);
    if (!e) return;
    if (ed.cell) {
      const [r, c] = ed.cell.split(':').map(Number);
      const cell = e.table.rows[r].cells[c];
      const parsed = merge(cell.paragraphs, fromDOM(root, s, 1));
      if (sameText(cell.paragraphs, parsed)) { setModel(clone(m)); return; }
      act((n) => { n.slides[cur].elements.find((x) => x.id === ed.id).table.rows[r].cells[c].paragraphs = parsed; },
        [{ op: 'cell_runs', slide: cur + 1, id: ed.id, r, c, paragraphs: parsed }]);
    } else {
      const parsed = merge(e.text.paragraphs, fromDOM(root, s, fitOf(e)));
      if (sameText(e.text.paragraphs, parsed) && !e._newText) { setModel(clone(m)); return; }
      act((n) => { const x = n.slides[cur].elements.find((y) => y.id === ed.id); x.text.paragraphs = parsed; delete x._newText; delete x.emptyPh; },
        [{ op: 'text_runs', slide: cur + 1, id: ed.id, paragraphs: parsed }]);
    }
  }, [editing, roots, cur, s, act]);

  const startEdit = useCallback((id, cell, point) => {
    const m = modelRef.current; const e = elOf(m, id);
    if (!e || !textOf(e) || (e.kind === 'table' && !cell)) return;
    if (!cell && !e.text) { // a shape without text: give it an empty centred text body first
      const n = clone(m); const x = elOf(n, id);
      x.text = { paragraphs: [{ src: 0, level: 0, align: 'center', marL: 0, indent: 0, bullet: null, runs: [], end: { sz: 18, color: '#000000', font: 'Calibri' } }],
        body: { lIns: 91440, tIns: 45720, rIns: 91440, bIns: 45720, anchor: 'ctr', wrap: true, scale: 1 } };
      x._newText = true; setModel(n);
    }
    setSel(id); setEditing({ id, cell, point });
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  // focus the text and put the caret where the user clicked
  useLayoutEffect(() => {
    if (!editing) return;
    const root = roots.get(rootKey(editing));
    if (!root) return;
    const e = elOf(modelRef.current, editing.id);
    if (e?.emptyPh && !editing.cell) { root.querySelectorAll('.ed-p span').forEach((x) => x.remove()); }
    root.contentEditable = 'true';
    root.focus();
    if (editing.point) caretAt(editing.point.x, editing.point.y); else selectAll(root);
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  // toolbar state follows the caret while typing
  useEffect(() => {
    const onSel = () => {
      if (!editing) return;
      const root = roots.get(rootKey(editing));
      const sl = window.getSelection();
      if (!root || !sl.rangeCount || !root.contains(sl.anchorNode)) return;
      savedRange.current = sl.getRangeAt(0).cloneRange();
      const node = sl.anchorNode.nodeType === 3 ? sl.anchorNode.parentElement : sl.anchorNode;
      const cs = getComputedStyle(node);
      const e = elOf(modelRef.current, editing.id);
      setFmt({
        b: document.queryCommandState('bold'), i: document.queryCommandState('italic'), u: document.queryCommandState('underline'),
        s: document.queryCommandState('strikeThrough'), font: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
        sz: Math.round(parseFloat(cs.fontSize) / (12700 * s * (editing.cell ? 1 : fitOf(e))) * 2) / 2, align: cs.textAlign,
      });
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, [editing, roots, s]); // eslint-disable-line react-hooks/exhaustive-deps

  /** run a formatting command on the selection (typing) or on the whole selected element */
  const format = useCallback((fn) => {
    if (editing) {
      const root = roots.get(rootKey(editing));
      root.focus();
      if (savedRange.current) { const sl = window.getSelection(); sl.removeAllRanges(); sl.addRange(savedRange.current); }
      document.execCommand('styleWithCSS', false, true);
      fn(root, false);
      return;
    }
    const e = selected; if (!e?.text) return;
    const root = roots.get(String(e.id)); if (!root) return;
    root.contentEditable = 'true'; root.focus(); selectAll(root);
    document.execCommand('styleWithCSS', false, true);
    fn(root, true);
    const parsed = merge(e.text.paragraphs, fromDOM(root, s, fitOf(e)));
    root.contentEditable = 'false'; window.getSelection().removeAllRanges();
    act((n) => { elOf(n, e.id).text.paragraphs = parsed; }, [{ op: 'text_runs', slide: cur + 1, id: e.id, paragraphs: parsed }]);
  }, [editing, roots, selected, s, act, cur]); // eslint-disable-line react-hooks/exhaustive-deps

  const cmd = (name, value) => format(() => document.execCommand(name, false, value));
  const fontSize = (pt) => format((root, whole) => {
    const e = elOf(modelRef.current, editing?.id ?? sel);
    const px = `${(pt * 12700 * s * (editing?.cell ? 1 : fitOf(e))).toFixed(2)}px`;
    document.execCommand('fontSize', false, '7');
    root.querySelectorAll('font[size="7"]').forEach((f) => { const sp = document.createElement('span'); sp.style.fontSize = px; sp.append(...f.childNodes); f.replaceWith(sp); });
    root.querySelectorAll('[style*="xxx-large"]').forEach((x) => { x.style.fontSize = px; });
    if (whole) root.querySelectorAll('.ed-p').forEach((p) => { p.style.fontSize = px; });
  });
  const toggleBullets = () => format((root, whole) => {
    const sl = window.getSelection();
    const ps = [...root.querySelectorAll('.ed-p')].filter((p) => whole || (sl.rangeCount && sl.getRangeAt(0).intersectsNode(p)));
    const on = !ps.every((p) => p.dataset.bullet);
    ps.forEach((p) => {
      p.dataset.buset = on ? '1' : '0';
      if (on) {
        p.dataset.bullet = '•';
        if (!parseFloat(p.style.paddingLeft)) { p.style.paddingLeft = `${342900 * s}px`; p.style.textIndent = `${-342900 * s}px`; }
        p.style.setProperty('--bu-w', `${342900 * s}px`);
      } else delete p.dataset.bullet;
    });
  });

  // ---------------------------------------------------------------- element actions
  const op1 = (o) => ({ slide: cur + 1, id: sel, ...o });
  const del = () => { if (!selected) return; const id = sel; setSel(null); act((n) => { n.slides[cur].elements = n.slides[cur].elements.filter((e) => e.id !== id); }, [op1({ op: 'delete', id })]); };
  const order = (where) => {
    if (!selected) return;
    act((n) => {
      const list = n.slides[cur].elements; const i = list.findIndex((e) => e.id === sel); const [x] = list.splice(i, 1);
      if (where === 'front') list.push(x); else list.unshift(x);
    }, [op1({ op: 'order', where })]);
  };
  const setFill = (color) => { if (!selected) return; act((n) => { elOf(n, sel).fill = color ? { color, alpha: 1 } : null; }, [op1({ op: 'fill', color })]); };
  const duplicate = () => selected && actFull([op1({ op: 'duplicate' })], (m) => setSel(m.slides[cur].elements.at(-1)?.id ?? null));
  const addText = () => actFull([{ op: 'add_text', slide: cur + 1, text: t('newText') }], (m) => {
    const id = Math.max(...m.slides[cur].elements.map((e) => e.id)); setSel(id); setTimeout(() => setEditing({ id }), 0);
  });
  const uploadImage = async (file, replaceId) => {
    if (!file) return;
    setBusy(true);
    try {
      const { upload } = await api.upload(docId, file);
      await actFull([replaceId ? { op: 'image', slide: cur + 1, id: replaceId, upload } : { op: 'add_image', slide: cur + 1, upload }],
        (m) => setSel(replaceId ?? Math.max(...m.slides[cur].elements.map((e) => e.id))));
    } catch (e) { say(e.key || 'badImage'); } finally { setBusy(false); }
  };

  // slides
  const addSlide = () => actFull([{ op: 'slide_add', after: cur + 1 }], () => { setCur(cur + 1); setSel(null); });
  const dupSlide = (i) => actFull([{ op: 'slide_duplicate', slide: i + 1 }], () => { setCur(i + 1); setSel(null); });
  const delSlide = (i) => {
    if (model.slides.length < 2) { say('lastSlide'); return; }
    act((n) => { n.slides.splice(i, 1); n.slides.forEach((x, k) => { x.n = k + 1; }); }, [{ op: 'slide_delete', slide: i + 1 }]);
    setCur(Math.max(0, Math.min(i, model.slides.length - 2))); setSel(null);
  };
  const moveSlide = (from, to) => {
    if (from === to || to < 0 || to >= model.slides.length) return;
    act((n) => { const [x] = n.slides.splice(from, 1); n.slides.splice(to, 0, x); n.slides.forEach((y, k) => { y.n = k + 1; }); },
      [{ op: 'slide_move', slide: from + 1, to: to + 1 }]);
    setCur(to);
  };
  const hideSlide = (i) => act((n) => { n.slides[i].hidden = !n.slides[i].hidden; }, [{ op: 'slide_hide', slide: i + 1, hidden: !model.slides[i].hidden }]);
  const setBg = (color) => actFull([{ op: 'bg', slide: cur + 1, color }]);
  const setNotes = (text) => { if (text !== slide.notes) act((n) => { n.slides[cur].notes = text; }, [{ op: 'notes', slide: cur + 1, text }]); };

  const undo = useCallback(() => {
    if (editing) { commitEdit(); return; }
    if (!past.current.length) return;
    future.current.push(modelRef.current); setModel(past.current.pop()); setSel(null);
    enqueue(() => api.undo(docId));
  }, [editing, commitEdit, enqueue, docId]);
  const redo = useCallback(() => {
    if (!future.current.length) return;
    past.current.push(modelRef.current); setModel(future.current.pop()); setSel(null);
    enqueue(() => api.redo(docId));
  }, [enqueue, docId]);

  // ---------------------------------------------------------------- mouse: select, move, resize, rotate
  const toEmu = (px) => px / s;
  const onElementDown = (ev) => {
    const target = ev.target.closest('[data-eid]');
    if (!target) return;
    const id = Number(target.dataset.eid);
    const cell = ev.target.closest('[data-cell]')?.dataset.cell;
    if (editing && editing.id === id) {
      if (!editing.cell || editing.cell === cell) return; // inside the text being edited: the browser moves the caret
      commitEdit(); startEdit(id, cell, { x: ev.clientX, y: ev.clientY }); return; // another cell of the same table
    }
    if (editing) commitEdit();
    const e = slide.elements.find((x) => x.id === id);
    const was = sel === id;
    setSel(id);
    ev.preventDefault();
    const start = { x: ev.clientX, y: ev.clientY, box: { x: e.x, y: e.y, w: e.w, h: e.h }, moved: false };
    const move = (m) => {
      const dx = toEmu(m.clientX - start.x), dy = toEmu(m.clientY - start.y);
      if (!start.moved && Math.hypot(m.clientX - start.x, m.clientY - start.y) < 3) return;
      start.moved = true;
      setDrag({ id, x: start.box.x + dx, y: start.box.y + dy });
    };
    const up = (u) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      if (start.moved) {
        const x = Math.round(start.box.x + toEmu(u.clientX - start.x)), y = Math.round(start.box.y + toEmu(u.clientY - start.y));
        setDrag(null);
        act((n) => { const el = elOf(n, id); el.x = x; el.y = y; }, [{ op: 'move', slide: cur + 1, id, x, y }]);
      } else if (was && textOf(e)) {
        startEdit(id, e.kind === 'table' ? cell : undefined, { x: u.clientX, y: u.clientY });
      }
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
  const onDouble = (ev) => {
    const target = ev.target.closest('[data-eid]'); if (!target) return;
    const id = Number(target.dataset.eid); const e = slide.elements.find((x) => x.id === id);
    if (!textOf(e) || (editing && editing.id === id)) return;
    startEdit(id, e.kind === 'table' ? ev.target.closest('[data-cell]')?.dataset.cell : undefined, { x: ev.clientX, y: ev.clientY });
  };
  const onHandle = (ev, dir) => {
    ev.stopPropagation(); ev.preventDefault();
    const e = selected; const keep = e.kind === 'picture' && dir.length === 2;
    const start = { x: ev.clientX, y: ev.clientY, b: { x: e.x, y: e.y, w: e.w, h: e.h } };
    const calc = (m) => {
      const dx = toEmu(m.clientX - start.x), dy = toEmu(m.clientY - start.y);
      let { x, y, w, h } = start.b;
      if (dir.includes('e')) w = Math.max(MIN, w + dx);
      if (dir.includes('s')) h = Math.max(MIN, h + dy);
      if (dir.includes('w')) { const nw = Math.max(MIN, w - dx); x += w - nw; w = nw; }
      if (dir.includes('n')) { const nh = Math.max(MIN, h - dy); y += h - nh; h = nh; }
      if (keep || m.shiftKey) { // keep the proportions
        const r = start.b.h / start.b.w;
        if (Math.abs(w - start.b.w) * r > Math.abs(h - start.b.h)) { const nh = w * r; if (dir.includes('n')) y += h - nh; h = nh; }
        else { const nw = h / r; if (dir.includes('w')) x += w - nw; w = nw; }
      }
      return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
    };
    const move = (m) => setDrag({ id: e.id, ...calc(m) });
    const up = (u) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      const b = calc(u); setDrag(null);
      if (b.w === e.w && b.h === e.h && b.x === e.x && b.y === e.y) return;
      act((n) => {
        const el = elOf(n, e.id); const fx = b.w / el.w, fy = b.h / el.h; Object.assign(el, b);
        if (el.table) { el.table.cols = el.table.cols.map((c) => c * fx); el.table.rows.forEach((r) => { r.h *= fy; }); }
      }, [{ op: 'move', slide: cur + 1, id: e.id, ...b }]);
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
  const onRotate = (ev) => {
    ev.stopPropagation(); ev.preventDefault();
    const e = selected; const box = canvasRef.current.querySelector(`[data-eid="${e.id}"]`).getBoundingClientRect();
    const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    const angle = (m) => { let a = (Math.atan2(m.clientY - cy, m.clientX - cx) * 180) / Math.PI + 90; if (m.shiftKey) a = Math.round(a / 15) * 15; return Math.round(((a % 360) + 360) % 360); };
    const move = (m) => setDrag({ id: e.id, rot: angle(m) });
    const up = (u) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      const rot = angle(u); setDrag(null);
      act((n) => { elOf(n, e.id).rot = rot; }, [{ op: 'rotate', slide: cur + 1, id: e.id, rot }]);
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  // ---------------------------------------------------------------- keyboard
  useEffect(() => {
    const onKey = (ev) => {
      const mod = ev.ctrlKey || ev.metaKey;
      if (editing) {
        if (ev.key === 'Escape') { ev.preventDefault(); commitEdit(); }
        return;
      }
      if (ev.target.closest?.('input, textarea, select')) return;
      if (mod && ev.key.toLowerCase() === 'z') { ev.preventDefault(); if (ev.shiftKey) redo(); else undo(); return; }
      if (mod && ev.key.toLowerCase() === 'y') { ev.preventDefault(); redo(); return; }
      if (!selected) return;
      if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); del(); }
      else if (mod && ev.key.toLowerCase() === 'd') { ev.preventDefault(); duplicate(); }
      else if (ev.key === 'Escape') setSel(null);
      else if (ev.key === 'Enter' && textOf(selected) && selected.kind !== 'table') { ev.preventDefault(); startEdit(sel); }
      else if (ev.key.startsWith('Arrow')) {
        ev.preventDefault();
        const step = ev.shiftKey ? IN / 4 : IN / 40;
        const dx = ev.key === 'ArrowLeft' ? -step : ev.key === 'ArrowRight' ? step : 0, dy = ev.key === 'ArrowUp' ? -step : ev.key === 'ArrowDown' ? step : 0;
        const x = Math.round(selected.x + dx), y = Math.round(selected.y + dy);
        act((n) => { const el = elOf(n, sel); el.x = x; el.y = y; }, [op1({ op: 'move', x, y })]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => { // warn before closing the tab while changes are still being saved
    const h = (e) => { if (pending > 0) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h);
  }, [pending]);

  const finish = async (fn) => { if (editing) commitEdit(); setBusy(true); await queue.current; setBusy(false); fn(); };

  if (!model) return <div className="grid h-screen place-items-center text-slate-500">{t('loading')}</div>;

  const overrides = drag ? { [drag.id]: Object.fromEntries(Object.entries(drag).filter(([k]) => k !== 'id')) } : null;
  const live = selected && drag?.id === selected.id ? { ...selected, ...drag } : selected;
  const thumbS = 150 / model.width;
  const isText = !!(selected?.text || editing);
  const f0 = selected?.text?.paragraphs?.[0]?.runs?.[0] || selected?.text?.paragraphs?.[0]?.end || {};
  const shown = editing ? fmt : { b: f0.b, i: f0.i, u: f0.u, s: f0.s, font: f0.font, sz: f0.sz, align: selected?.text?.paragraphs?.[0]?.align };

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-800">
      {/* top bar */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3">
        <button type="button" onClick={() => finish(onClose)} className="rounded-md px-2 py-1 text-[13px] font-medium text-slate-600 hover:bg-slate-100">← {t('docs')}</button>
        <button type="button" title={t('rename')} onClick={async () => {
          const name = window.prompt(t('rename'), model.name);
          if (name && name.trim() && name !== model.name) { try { const m = await api.rename(docId, name.trim()); setModel((x) => ({ ...x, name: m.name })); } catch (e) { say(e.key); } }
        }} className="max-w-[30vw] truncate rounded-md px-2 py-1 text-[15px] font-semibold hover:bg-slate-100">{model.name}</button>
        <span className="text-[12px] text-slate-400" aria-live="polite">{pending > 0 || busy ? t('saving') : `✓ ${t('saved')}`}</span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => finish(() => { window.location.href = api.downloadUrl(docId); })}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium hover:bg-slate-50">{t('download')}</button>
          <button type="button" onClick={() => finish(async () => { try { await api.send(docId); say('sent'); } catch (e) { say(e.key); } })}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-blue-700">{t('send')}</button>
        </div>
      </header>

      {/* toolbar */}
      <div className="flex h-11 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-slate-200 bg-white px-2">
        <Btn title={t('undo')} onClick={undo} disabled={!past.current.length && !editing}>↶</Btn>
        <Btn title={t('redo')} onClick={redo} disabled={!future.current.length}>↷</Btn>
        <Sep />
        <Btn wide title={t('addText')} onClick={addText}>＋ {t('addText')}</Btn>
        <Btn wide title={t('addImage')} onClick={() => fileInput.current.click()}>＋ {t('addImage')}</Btn>
        <Btn wide title={t('addSlide')} onClick={addSlide}>＋ {t('addSlide')}</Btn>
        <Sep />
        <select title={t('font')} disabled={!isText} value={shown.font || ''} onChange={(e) => cmd('fontName', e.target.value)}
          className="h-8 w-36 shrink-0 rounded-md border border-slate-200 bg-white px-1.5 text-[13px] disabled:opacity-35">
          {[...new Set([shown.font, ...FONTS].filter(Boolean))].map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>
        <Btn title={t('fontSize')} disabled={!isText} onClick={() => fontSize(Math.max(4, (shown.sz || 18) - 2))}>A−</Btn>
        <input title={t('fontSize')} disabled={!isText} key={`${sel}-${shown.sz}`} defaultValue={shown.sz || ''} inputMode="decimal"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = parseFloat(e.target.value); if (v > 0) fontSize(v); } }}
          className="h-8 w-12 shrink-0 rounded-md border border-slate-200 text-center text-[13px] disabled:opacity-35" />
        <Btn title={t('fontSize')} disabled={!isText} onClick={() => fontSize((shown.sz || 18) + 2)}>A+</Btn>
        <Btn title={t('bold')} disabled={!isText} active={shown.b} onClick={() => cmd('bold')}><b>B</b></Btn>
        <Btn title={t('italic')} disabled={!isText} active={shown.i} onClick={() => cmd('italic')}><i className="font-serif">I</i></Btn>
        <Btn title={t('underline')} disabled={!isText} active={shown.u} onClick={() => cmd('underline')}><u>U</u></Btn>
        <Btn title={t('strike')} disabled={!isText} active={shown.s} onClick={() => cmd('strikeThrough')}><s>S</s></Btn>
        <label title={t('color')} className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-md hover:bg-slate-100 ${isText ? '' : 'pointer-events-none opacity-35'}`}>
          <span className="text-[14px] font-bold underline decoration-[3px] decoration-red-500">A</span>
          <input type="color" className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => { const v = e.target.value; if (editing) cmd('foreColor', v); else later(() => cmd('foreColor', v)); }} />
        </label>
        <Sep />
        {[['left', 'justifyLeft', 'alignL', '⯇'], ['center', 'justifyCenter', 'alignC', '≡'], ['right', 'justifyRight', 'alignR', '⯈'], ['justify', 'justifyFull', 'alignJ', '☰']].map(([a, c, k, icon]) => (
          <Btn key={a} title={t(k)} disabled={!isText} active={shown.align === a || (a === 'left' && shown.align === 'start')} onClick={() => cmd(c)}>{icon}</Btn>
        ))}
        <Btn title={t('bullets')} disabled={!isText} onClick={toggleBullets}>•≡</Btn>
        <Sep />
        <label title={selected ? t('fill') : t('bg')} className={`relative flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[13px] hover:bg-slate-100 ${selected && !['shape', 'text'].includes(selected.kind) ? 'pointer-events-none opacity-35' : ''}`}>
          <span className="h-4 w-4 rounded border border-slate-300" style={{ background: (selected ? selected.fill?.color : slide.bg) || '#ffffff' }} />
          {selected ? t('fill') : t('bg')}
          <input type="color" key={`${cur}-${sel}`} className="absolute inset-0 cursor-pointer opacity-0" defaultValue={(selected ? selected.fill?.color : slide.bg) || '#ffffff'}
            onChange={(e) => { const v = e.target.value; later(() => (selected ? setFill(v) : setBg(v))); }} />
        </label>
        <Btn wide title={t('noFill')} disabled={!selected || !['shape', 'text'].includes(selected.kind)} onClick={() => setFill(null)}>⊘</Btn>
        {selected?.kind === 'picture' && <Btn wide title={t('replaceImage')} onClick={() => replaceInput.current.click()}>🖼 {t('replaceImage')}</Btn>}
        <Sep />
        <Btn title={t('front')} disabled={!selected} onClick={() => order('front')}>⇡</Btn>
        <Btn title={t('back')} disabled={!selected} onClick={() => order('back')}>⇣</Btn>
        <Btn title={t('duplicate')} disabled={!selected} onClick={duplicate}>⧉</Btn>
        <Btn title={t('remove')} disabled={!selected} onClick={del}>🗑</Btn>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => { uploadImage(e.target.files[0]); e.target.value = ''; }} />
        <input ref={replaceInput} type="file" accept="image/*" hidden onChange={(e) => { uploadImage(e.target.files[0], sel); e.target.value = ''; }} />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* slides */}
        <aside className="w-[200px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-2">
          {model.slides.map((sl, i) => (
            <div key={`${sl.n}-${sl.layer}`} draggable onDragStart={(e) => e.dataTransfer.setData('text/slide', String(i))}
              onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); moveSlide(Number(e.dataTransfer.getData('text/slide')), i); }}
              className="group mb-2 flex gap-1.5">
              <span className="w-4 pt-1 text-right text-[11px] tabular-nums text-slate-400">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => { if (editing) commitEdit(); setCur(i); setSel(null); }}
                  className={`block overflow-hidden rounded border-2 ${i === cur ? 'border-blue-500' : 'border-transparent hover:border-slate-300'} ${sl.hidden ? 'opacity-40' : ''}`}>
                  <div className="pointer-events-none"><SlideView slide={sl} width={model.width} height={model.height} s={thumbS} docId={docId} /></div>
                </button>
                {i === cur && (
                  <div className="mt-1 flex flex-wrap gap-0.5 text-[11px]">
                    <button type="button" onClick={() => moveSlide(i, i - 1)} disabled={i === 0} className="rounded px-1 hover:bg-slate-100 disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveSlide(i, i + 1)} disabled={i === model.slides.length - 1} className="rounded px-1 hover:bg-slate-100 disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => dupSlide(i)} className="rounded px-1 hover:bg-slate-100">{t('dupSlide')}</button>
                    <button type="button" onClick={() => hideSlide(i)} className="rounded px-1 hover:bg-slate-100">{sl.hidden ? t('show') : t('hide')}</button>
                    <button type="button" onClick={() => delSlide(i)} className="rounded px-1 text-red-600 hover:bg-red-50">{t('delSlide')}</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </aside>

        {/* canvas */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div ref={canvasRef} className="relative grid min-h-0 flex-1 place-items-center overflow-hidden"
            onPointerDown={(e) => { if (!e.target.closest('[data-eid], [data-handle]')) { if (editing) commitEdit(); setSel(null); } }}>
            <div className="shadow-lg ring-1 ring-black/5" onPointerDown={onElementDown} onDoubleClick={onDouble}
              onPaste={(e) => { if (!editing) return; e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }}>
              <SlideView slide={slide} width={model.width} height={model.height} s={s} docId={docId} interactive editing={editing} roots={roots} overrides={overrides}>
                {live && (
                  <div className="pointer-events-none absolute" data-handle
                    style={{ left: live.x * s, top: live.y * s, width: live.w * s, height: live.h * s, transform: live.rot ? `rotate(${live.rot}deg)` : undefined }}>
                    <div className={`absolute inset-0 ${editing ? 'outline-dashed outline-1 outline-blue-500' : 'outline outline-2 outline-blue-500'}`} />
                    {!editing && ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((d) => (
                      <span key={d} data-handle onPointerDown={(ev) => onHandle(ev, d)}
                        className="pointer-events-auto absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-blue-600 bg-white"
                        style={{ left: d.includes('w') ? 0 : d.includes('e') ? '100%' : '50%', top: d.includes('n') ? 0 : d.includes('s') ? '100%' : '50%',
                          cursor: `${d}-resize` }} />
                    ))}
                    {!editing && live.kind !== 'table' && (
                      <span data-handle onPointerDown={onRotate} title="↻"
                        className="pointer-events-auto absolute left-1/2 top-[-22px] h-3 w-3 -translate-x-1/2 cursor-grab rounded-full border border-blue-600 bg-white" />
                    )}
                  </div>
                )}
              </SlideView>
            </div>
            {busy && <div className="absolute right-3 top-3 rounded-md bg-slate-800/80 px-2.5 py-1 text-[12px] text-white">{t('saving')}</div>}
            {toast && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] text-white shadow-lg">{toast}</div>}
          </div>
          <textarea key={`${cur}-${slide.notes}`} defaultValue={slide.notes} placeholder={t('notes')} onBlur={(e) => setNotes(e.target.value)}
            className="h-20 shrink-0 resize-none border-t border-slate-200 bg-white px-4 py-2 text-[13px] outline-none" />
          <p className="shrink-0 truncate border-t border-slate-100 bg-white px-4 py-1 text-[11px] text-slate-400">{t('hint')}</p>
        </main>
      </div>
    </div>
  );
}
