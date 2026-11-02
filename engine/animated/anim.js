/**
 * anim.js — turns a finished deck into an animated one: PowerPoint entrance animations and slide transitions.
 *
 * The templates draw as usual (pptxgenjs has no animations). Before the file is written, every slide's objects are
 * read by their geometry: background and footer stay still; the title comes first; a card and everything inside it
 * enter together; the rest enter in reading order, one after another. After pptxgenjs writes the file, each slide's
 * XML gets <p:transition> and <p:timing> (the format PowerPoint itself writes).
 *
 * A template's own motion is its `anim` (in animated/templates/NN-*.js):
 *   { transition: 'morph' | 'fade' | 'push:u' | 'wipe:r' | 'cover:l' | 'split' | 'circle' | 'zoom' | 'p14:reveal' ...,
 *     speed: 'slow' | 'med' | 'fast', tempo: 1 (x durations), stagger: 0.2 (s between groups),
 *     title, body, item, image, number, deco: effect names (see EFFECTS), kenburns: true (photos drift slowly),
 *     types: { cover: { title: 'split' }, stats: { item: 'growIn' } ... }  per slide type }
 */
const JSZip = require('jszip');

const W = 10, H = 5.625;
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// ---------------------------------------------------------------- reading a slide
function plainText(o) {
  if (typeof o.text === 'string') return o.text;
  if (Array.isArray(o.text)) return o.text.map((r) => (r && r.text) || '').join('');
  return '';
}

/** objects of one slide with geometry: [{ o, k, x, y, w, h, kind: 'text' | 'shape' | 'image' | 'line', fs, txt }] */
const inch = (v) => (v == null ? null : v > 100 ? v / 914400 : v); // tables keep EMU
function items(slide) {
  return (slide._slideObjects || []).map((o, k) => {
    const op = o.options || {}, table = o._type === 'table';
    const x = inch(num(op.x)), y = inch(num(op.y)), w = inch(num(op.w)), h = inch(num(op.h)) ?? (table ? Math.max(0.5, H - 0.6 - (y || 0)) : null);
    if (x == null || y == null || w == null || h == null) return null;
    const txt = plainText(o).trim();
    const kind = table ? 'table' : o._type === 'image' ? 'image' : o.shape === 'line' || h === 0 || w === 0 ? 'line' : txt ? 'text' : 'shape';
    return { o, k, x, y, w, h, kind, fs: op.fontSize || 0, txt };
  }).filter(Boolean);
}
const norm = (t) => String(t || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

const area = (e) => Math.abs(e.w * e.h);
const inside = (a, b, pad = 0.02) => { // is a's centre inside b?
  const cx = a.x + a.w / 2, cy = a.y + a.h / 2;
  return cx >= b.x - pad && cx <= b.x + b.w + pad && cy >= b.y - pad && cy <= b.y + b.h + pad;
};

/**
 * Who enters when. Returns groups in order: [{ role: 'title'|'body'|'item'|'image'|'number', els: [...] }].
 * Still (not animated): background (≥ 55% of the slide), footer line and page number, hairlines across the slide.
 */
function plan(slide, type, d = {}, idx = -1) {
  const els = items(slide);
  const still = new Set();
  for (const e of els) {
    const footer = e.y >= 4.85 && e.h <= 0.55 && (e.kind !== 'image' || area(e) < 0.2);
    const pageNo = e.kind === 'text' && e.fs && e.fs <= 11 && e.h <= 0.5 && ((e.y < 0.6 || e.y > 4.8) && e.txt.length <= 12 || e.y + e.h < 0.62); // page no., running head
    const big = (e.kind === 'shape' || e.kind === 'image') && area(e) >= W * H * 0.55;
    const rail = e.kind !== 'text' && e.kind !== 'image' && (e.w >= W * 0.9 || e.h >= H * 0.9); // full-width / full-height bands
    const edgeStrip = e.kind === 'shape' && ((e.w <= 0.25 && e.h >= 2) || (e.h <= 0.25 && e.w >= 4)); // decorative rules
    const corner = e.y < 0.9 || e.y + e.h > 4.95 || e.x > 8.4 || e.x + e.w < 0.9;
    const slideNo = e.kind === 'text' && idx >= 0 && corner && /^0?\d{1,2}$/.test(e.txt) && Number(e.txt) === idx + 1 && e.fs <= 40; // "03" badge
    if (footer || pageNo || big || rail || edgeStrip || slideNo) still.add(e);
  }
  for (const e of [...still]) if (e.kind === 'text' && /^0?\d{1,2}$/.test(e.txt)) // the page-number badge's plate too
    els.filter((b) => b.kind === 'shape' && area(b) < 1.5 && inside(e, b)).forEach((b) => still.add(b));
  for (const b of els) if (b.kind === 'shape' && !still.has(b) && area(b) < 1.5) // ...and its shadow
    for (const e of [...still]) if (e.kind === 'shape' && area(e) < 1.5) {
      const ov = Math.max(0, Math.min(b.x + b.w, e.x + e.w) - Math.max(b.x, e.x)) * Math.max(0, Math.min(b.y + b.h, e.y + e.h) - Math.max(b.y, e.y));
      if (ov >= 0.5 * area(b)) still.add(b);
    }
  // many rules on one slide are a pattern (grid, ruled paper): they stay; a few long ones are axes, drawn first
  const lines = els.filter((e) => e.kind === 'line' && !still.has(e));
  if (lines.length >= 6) lines.filter((e) => e.w >= 1 || e.h >= 1).forEach((e) => still.add(e));
  let live = els.filter((e) => !still.has(e));

  // title: the box holding the slide's title text; else the largest type in the upper part (cover: anywhere)
  const texts = live.filter((e) => e.kind === 'text' && e.fs);
  const want = norm(d.title);
  const exact = want.length >= 2 ? texts.filter((e) => norm(e.txt) === want || (norm(e.txt).length > 3 && want.startsWith(norm(e.txt)))) : [];
  const cand = texts.filter((e) => (type === 'cover' || type === 'closing' ? true : e.y < 2.2) && e.fs >= 18);
  const title = exact.sort((a, b) => b.fs - a.fs)[0] || cand.sort((a, b) => b.fs - a.fs || a.y - b.y)[0];
  const groups = [];
  if (title) {
    const near = live.filter((e) => e !== title && e.kind !== 'text' && area(e) < 1.2 && !inside(e, { x: 0, y: 2.6, w: W, h: 3 })
      && Math.abs(e.y - (title.y + title.h)) < 0.35 && e.x < title.x + title.w && e.x + e.w > title.x); // its underline / marker
    groups.push({ role: 'title', els: [title, ...near] });
    live = live.filter((e) => e !== title && !near.includes(e));
  }

  // containers: shapes that hold other objects (cards, panels); each one enters with its content
  // (a text box as large as its badge belongs to the badge: a number in a circle)
  const fits = (e, b) => e !== b && inside(e, b) && (area(e) < area(b) || (e.kind === 'text' && b.kind === 'shape' && area(e) <= area(b) * 1.6));
  const boxes = live.filter((e) => (e.kind === 'shape' || e.kind === 'image') && area(e) >= 0.04)
    .filter((b) => live.some((e) => fits(e, b)))
    .sort((a, b) => area(a) - area(b));
  const owner = new Map();
  for (const e of live) {
    if (boxes.includes(e) && !boxes.some((b) => b !== e && area(b) > area(e) && inside(e, b))) continue;
    const b = boxes.find((bx) => fits(e, bx));
    if (b) owner.set(e, b);
  }
  const top = (b) => { let r = b; while (owner.has(r)) r = owner.get(r); return r; };
  const byBox = new Map();
  for (const e of live) { const r = owner.has(e) ? top(e) : e; (byBox.get(r) || byBox.set(r, []).get(r)).push(e); }
  let rest = [...byBox.entries()].map(([r, list]) => ({ anchor: r, els: list.includes(r) ? list : [r, ...list] }));

  // loose objects stacked in one column (icon, heading, text) enter together
  const loose = rest.filter((g) => g.els.length === 1 && g.anchor.kind !== 'image');
  const merged = new Set();
  for (const a of loose) for (const b of loose) {
    if (a === b || merged.has(b) || merged.has(a)) continue;
    const A = a.anchor, B = b.anchor, ov = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
    const head = A.kind !== 'text' || (A.fs && B.fs && A.fs > B.fs); // a heading (or icon) over its text, not two list items
    if (head && ov > 0.6 * Math.min(A.w, B.w) && B.y >= A.y && B.y - (A.y + A.h) < 0.18 && B.y - (A.y + A.h) > -0.05) { a.els.push(...b.els); merged.add(b); }
  }
  rest = rest.filter((g) => !merged.has(g));

  const bb = (g) => { const x = Math.min(...g.els.map((e) => e.x)), y = Math.min(...g.els.map((e) => e.y));
    return { x, y, r: Math.max(...g.els.map((e) => e.x + e.w)), b: Math.max(...g.els.map((e) => e.y + e.h)) }; };
  const join = (pairs) => { // merge groups a, b when pairs(a, b) says so
    for (let changed = true; changed;) {
      changed = false;
      outer: for (const a of rest) for (const b of rest) if (a !== b && pairs(a, b)) { a.els.push(...b.els); rest = rest.filter((g) => g !== b); changed = true; break outer; }
    }
  };
  const small = (g) => g.els.length <= 4 && !g.els.some((e) => e.kind === 'table' || e.kind === 'line' || (e.kind === 'image' && area(e) >= 1.2));
  // long rules and axes are drawn first, right after the title
  const axes = rest.filter((g) => g.els.length === 1 && g.els[0].kind === 'line' && (g.els[0].w >= 3 || g.els[0].h >= 2.5));
  rest = rest.filter((g) => !axes.includes(g));
  // a row: a number badge and its text side by side
  join((a, b) => { if (!small(a) || !small(b)) return false; const A = bb(a), B = bb(b);
    const badge = A.r - A.x <= 0.9 && A.b - A.y <= 1.0;
    const level = Math.abs((A.y + A.b) / 2 - (B.y + B.b) / 2) < 0.2 || Math.abs(A.y - B.y) < 0.12;
    return badge && level && B.x >= A.r - 0.02 && B.x - A.r < 0.6; });
  // a shadow, frame or plate behind a card enters with the card
  const ovArea = (A, B) => Math.max(0, Math.min(A.r, B.r) - Math.max(A.x, B.x)) * Math.max(0, Math.min(A.b, B.b) - Math.max(A.y, B.y));
  join((a, b) => { if (b.els.some((e) => e.kind === 'text' || e.kind === 'table') || !a.els.some((e) => e.kind === 'text')) return false;
    const A = bb(a), B = bb(b), bArea = (B.r - B.x) * (B.b - B.y);
    return bArea > 0 && ovArea(A, B) >= 0.4 * bArea; });
  // timelines and steps drawn without boxes: three or more columns, each column (year, heading, text, dot) enters as one
  const colKey = (g) => { const B = bb(g); return Math.round(((B.x + B.r) / 2) / 0.4); };
  const sameCol = (a, b) => { const A = bb(a), B = bb(b), ov = Math.min(A.r, B.r) - Math.max(A.x, B.x);
    if (A.r - A.x > W * 0.45 || B.r - B.x > W * 0.45) return false; // a note across the slide is not a column
    return ov >= 0.5 * Math.min(A.r - A.x, B.r - B.x) || colKey(a) === colKey(b); };
  const flow = ['timeline', 'process', 'cards', 'stats'].includes(type) && new Set(rest.filter(small).map(colKey)).size >= 3
    && rest.filter(small).length > new Set(rest.filter(small).map(colKey)).size; // columns made of several pieces
  if (flow) join((a, b) => small(a) && small(b) && sameCol(a, b));

  // order: reading order by rows (0.45 in bands), then left to right; a list in 2+ columns goes column by column
  const box = (g) => { const B = bb(g); return { x: B.x, y: B.y }; };
  const wordy = rest.filter((g) => g.els.some((e) => e.kind === 'text'));
  const lefts = [...new Set(wordy.map((g) => Math.round(box(g).x / 0.4)))];
  const listCols = lefts.length >= 2 && lefts.length <= 3 && lefts.every((l) => wordy.filter((g) => Math.round(box(g).x / 0.4) === l).length >= 2)
    && (type === 'agenda' || type === 'sources' || type === 'compare');
  const across = ['timeline', 'process', 'cards', 'stats'].includes(type) && new Set(wordy.map(colKey)).size >= 3;
  const wide = (g) => { const B = bb(g); return B.r - B.x > W * 0.45; };
  rest.sort((a, b) => { const A = box(a), B = box(b);
    if (flow || across) return wide(a) - wide(b) || A.x - B.x || A.y - B.y; // left to right, whichever side of the axis; a note last
    return listCols ? Math.round(A.x / 0.4) - Math.round(B.x / 0.4) || A.y - B.y : Math.round(A.y / 0.45) - Math.round(B.y / 0.45) || A.x - B.x; });
  if (axes.length) rest.unshift({ els: axes.flatMap((g) => g.els), axis: true });
  // never more than 8 steps after the title: neighbours enter together
  while (rest.length > 8) {
    let best = 1, gap = Infinity;
    for (let i = 1; i < rest.length; i++) { if (rest[i].axis || rest[i - 1].axis) continue; const A = bb(rest[i - 1]), B = bb(rest[i]), d = Math.hypot(A.x - B.x, A.y - B.y); if (d < gap) { gap = d; best = i; } }
    if (gap === Infinity) break;
    rest[best - 1].els.push(...rest[best].els); rest.splice(best, 1);
  }
  const many = rest.filter((g) => g.els.some((e) => e.kind === 'text')).length >= 3;
  for (const g of rest) {
    const img = g.els.find((e) => e.kind === 'image' && area(e) >= 1.2);
    const isNum = type === 'stats' && g.els.some((e) => e.kind === 'text' && e.fs >= 24 && e.txt.length <= 12);
    const role = g.axis ? 'axis' : img && g.els.filter((e) => e.kind === 'text').length === 0 ? 'image' : isNum ? 'number'
      : g.els.some((e) => e.kind === 'table') ? 'body' : many ? 'item' : g.els.some((e) => e.kind === 'text') ? 'body' : 'deco';
    groups.push({ role, els: g.els });
  }
  return { groups, still };
}

// ---------------------------------------------------------------- effects (entrance unless said otherwise)
// each: (spid, dur ms, idf) -> behaviours XML; idf() hands out the timing node ids
const tgt = (spid) => `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>`;
const set = (spid, idf) => `<p:set><p:cBhvr><p:cTn id="${idf()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`;
const filt = (spid, dur, idf, f) => `<p:animEffect transition="in" filter="${f}"><p:cBhvr><p:cTn id="${idf()}" dur="${dur}"/>${tgt(spid)}</p:cBhvr></p:animEffect>`;
/** a property animated through keyframes [[tm 0..100000, value]...]; strVal formulas (#ppt_x...) or fltVal numbers */
const keys = (spid, dur, idf, attr, kf, ease = 'decel') => `<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="${idf()}" dur="${dur}" fill="hold"${ease === 'decel' ? ' decel="100000"' : ease === 'both' ? ' accel="40000" decel="60000"' : ''}/>${tgt(spid)}<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>${kf.map(([tm, v]) => `<p:tav tm="${tm}"><p:val>${typeof v === 'number' ? `<p:fltVal val="${v}"/>` : `<p:strVal val="${v}"/>`}</p:val></p:tav>`).join('')}</p:tavLst></p:anim>`;
const prop = (spid, dur, idf, attr, from, to, ease = 'decel') => keys(spid, dur, idf, attr, [[0, from], [100000, to]], ease);
const off = (base, d) => (d ? `#${base}${d > 0 ? '+' : '-'}${Math.abs(d)}` : `#${base}`);
const move = (dx, dy, f = 'fade') => (spid, dur, idf) => set(spid, idf) + (f ? filt(spid, dur, idf, f) : '')
  + (dx ? prop(spid, dur, idf, 'ppt_x', off('ppt_x', dx), '#ppt_x') : '') + (dy ? prop(spid, dur, idf, 'ppt_y', off('ppt_y', dy), '#ppt_y') : '');
const scale = (from, f = 'fade') => (spid, dur, idf) => set(spid, idf) + (f ? filt(spid, dur, idf, f) : '')
  + prop(spid, dur, idf, 'ppt_w', from === 0 ? '0' : `#ppt_w*${from}`, '#ppt_w') + prop(spid, dur, idf, 'ppt_h', from === 0 ? '0' : `#ppt_h*${from}`, '#ppt_h');
const overshoot = (from, over) => (spid, dur, idf) => set(spid, idf) + filt(spid, Math.round(dur * 0.6), idf, 'fade')
  + ['ppt_w', 'ppt_h'].map((a) => keys(spid, dur, idf, a, [[0, from === 0 ? '0' : `#${a}*${from}`], [62000, `#${a}*${over}`], [100000, `#${a}`]], 'none')).join('');
const settle = (dx, dy, f = 'fade') => (spid, dur, idf) => set(spid, idf) + (f ? filt(spid, Math.round(dur * 0.5), idf, f) : '')
  + (dx ? keys(spid, dur, idf, 'ppt_x', [[0, off('ppt_x', dx)], [70000, off('ppt_x', -dx * 0.06)], [100000, '#ppt_x']], 'none') : '')
  + (dy ? keys(spid, dur, idf, 'ppt_y', [[0, off('ppt_y', dy)], [70000, off('ppt_y', -dy * 0.06)], [100000, '#ppt_y']], 'none') : '');
const turn = (from, kf) => (spid, dur, idf) => set(spid, idf) + filt(spid, Math.round(dur * 0.5), idf, 'fade')
  + keys(spid, dur, idf, 'style.rotation', kf || [[0, from], [100000, 0]]);
const path = (d) => (spid, dur, idf) => set(spid, idf) + filt(spid, Math.round(dur * 0.6), idf, 'fade')
  + `<p:animMotion origin="layout" path="${d} E" pathEditMode="relative" ptsTypes=""><p:cBhvr><p:cTn id="${idf()}" dur="${dur}" fill="hold" decel="100000"/>${tgt(spid)}<p:attrNameLst><p:attrName>ppt_x</p:attrName><p:attrName>ppt_y</p:attrName></p:attrNameLst></p:cBhvr></p:animMotion>`;
const filter = (f) => (spid, dur, idf) => set(spid, idf) + filt(spid, dur, idf, f);

/** name -> [presetID, presetSubtype, behaviours, iterate] (presetID is what PowerPoint's Animation pane shows) */
const EFFECTS = {
  appear: [1, 0, (s, d, i) => set(s, i)], fade: [10, 0, filter('fade')], dissolve: [9, 0, filter('dissolve')],
  fadeUp: [42, 0, move(0, 0.08)], fadeDown: [47, 0, move(0, -0.08)], fadeLeft: [42, 0, move(0.06, 0)], fadeRight: [42, 0, move(-0.06, 0)],
  flyUp: [2, 4, move(0, 1.1, null)], flyDown: [2, 1, move(0, -1.1, null)], flyLeft: [2, 2, move(1.1, 0, null)], flyRight: [2, 8, move(-1.1, 0, null)],
  riseUp: [2, 4, move(0, 0.3)], sinkDown: [2, 1, move(0, -0.3)], slideLeft: [2, 2, move(0.25, 0)], slideRight: [2, 8, move(-0.25, 0)],
  'wipe:r': [22, 8, filter('wipe(left)')], 'wipe:l': [22, 2, filter('wipe(right)')], 'wipe:u': [22, 1, filter('wipe(down)')], 'wipe:d': [22, 4, filter('wipe(up)')],
  split: [16, 21, filter('barn(outVertical)')], splitH: [16, 26, filter('barn(outHorizontal)')], splitIn: [16, 37, filter('barn(inVertical)')],
  circle: [6, 32, filter('circle(out)')], diamond: [8, 32, filter('diamond(out)')], plus: [13, 32, filter('plus(out)')], box: [4, 32, filter('box(out)')],
  wheel: [21, 1, filter('wheel(1)')], wheel4: [21, 4, filter('wheel(4)')], wedge: [20, 0, filter('wedge')],
  blinds: [3, 10, filter('blinds(horizontal)')], blindsV: [3, 5, filter('blinds(vertical)')], checker: [5, 10, filter('checkerboard(across)')],
  strips: [18, 12, filter('strips(downRight)')], bars: [14, 10, filter('randombar(horizontal)')],
  zoomIn: [53, 16, scale(0)], growIn: [53, 16, scale(0.7)], softGrow: [53, 16, scale(0.92)], popIn: [53, 16, scale(1.15)], focusIn: [53, 16, scale(1.08)],
  stretch: [17, 10, (s, d, i) => set(s, i) + filt(s, d, i, 'fade') + prop(s, d, i, 'ppt_w', '0', '#ppt_w')],
  unfold: [17, 5, (s, d, i) => set(s, i) + filt(s, d, i, 'fade') + prop(s, d, i, 'ppt_h', '0', '#ppt_h')],
  drop: [2, 1, move(0, -0.4)],
  popOver: [53, 16, overshoot(0, 1.12)], springIn: [53, 16, overshoot(0.6, 1.06)],
  bounceDrop: [26, 0, settle(0, -0.6)], riseSettle: [2, 4, settle(0, 0.2)], swingLeft: [2, 2, settle(-0.5, 0)], swingRight: [2, 8, settle(0.5, 0)],
  spinIn: [15, 0, (s, d, i) => turn(-90)(s, d, i) + prop(s, d, i, 'ppt_w', '#ppt_w*0.4', '#ppt_w') + prop(s, d, i, 'ppt_h', '#ppt_h*0.4', '#ppt_h')],
  swing: [45, 0, turn(0, [[0, -14], [55000, 5], [80000, -2], [100000, 0]])],
  curveUp: [42, 0, path('M -0.12 0.16 C -0.08 0.04 -0.03 0.0 0 0')], curveDown: [47, 0, path('M 0.12 -0.16 C 0.08 -0.04 0.03 0.0 0 0')],
  arcLeft: [2, 2, path('M 0.18 0.1 C 0.1 -0.06 0.04 0 0 0')], arcRight: [2, 8, path('M -0.18 0.1 C -0.1 -0.06 -0.04 0 0 0')],
  sweepIn: [22, 8, (s, d, i) => set(s, i) + filt(s, d, i, 'wipe(left)') + prop(s, d, i, 'ppt_x', '#ppt_x-0.05', '#ppt_x')],
  peekUp: [22, 1, (s, d, i) => set(s, i) + filt(s, d, i, 'wipe(down)') + prop(s, d, i, 'ppt_y', '#ppt_y+0.04', '#ppt_y')],
  typeLetters: [1, 0, (s, d, i) => set(s, i), 'lt'], fadeLetters: [10, 0, filter('fade'), 'lt'], fadeWords: [10, 0, filter('fade'), 'wd'],
  riseWords: [42, 0, move(0, 0.05), 'wd'], wipeWords: [22, 8, filter('wipe(left)'), 'wd'],
};
const EMPH = { // emphasis, played after the entrance
  kenburns: (s, d, i) => `<p:animScale><p:cBhvr><p:cTn id="${i()}" dur="${d}" fill="hold" decel="50000"/>${tgt(s)}</p:cBhvr><p:by x="107000" y="107000"/></p:animScale>`,
  pulse: (s, d, i) => `<p:animScale><p:cBhvr><p:cTn id="${i()}" dur="260" autoRev="1" fill="hold"/>${tgt(s)}</p:cBhvr><p:by x="110000" y="110000"/></p:animScale>`,
};

// ---------------------------------------------------------------- slide transitions
const TR = {
  fade: '<p:fade/>', cut: '<p:cut/>', dissolve: '<p:dissolve/>', circle: '<p:circle/>', diamond: '<p:diamond/>', plus: '<p:plus/>', zoom: '<p:zoom/>',
  'push:u': '<p:push dir="u"/>', 'push:d': '<p:push dir="d"/>', 'push:l': '<p:push dir="l"/>', 'push:r': '<p:push dir="r"/>',
  'wipe:r': '<p:wipe dir="r"/>', 'wipe:l': '<p:wipe dir="l"/>', 'wipe:u': '<p:wipe dir="u"/>', 'wipe:d': '<p:wipe dir="d"/>',
  'cover:l': '<p:cover dir="l"/>', 'cover:u': '<p:cover dir="u"/>', 'pull:l': '<p:pull dir="l"/>', split: '<p:split orient="vert" dir="out"/>',
  'split:h': '<p:split orient="horz" dir="out"/>', blinds: '<p:blinds dir="horz"/>', checker: '<p:checker dir="horz"/>', wheel: '<p:wheel spokes="1"/>',
  randomBar: '<p:randomBar dir="vert"/>', strips: '<p:strips dir="rd"/>', wedge: '<p:wedge/>', newsflash: '<p:newsflash/>',
};
// PowerPoint 2010 transitions (p14): written with a fade fallback for viewers without them
const P14T = new Set(['vortex', 'switch', 'flip', 'ripple', 'honeycomb', 'prism', 'doors', 'window', 'ferris', 'gallery', 'conveyor', 'pan', 'glitter',
  'warp', 'flythrough', 'flash', 'shred', 'reveal', 'wheelReverse']);
const P14 = 'http://schemas.microsoft.com/office/powerpoint/2010/main', P159 = 'http://schemas.microsoft.com/office/powerpoint/2015/09/main';
const MC = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
function transitionXml(name, speed = 'med') {
  const ms = { fast: 500, med: 750, slow: 1000 }[speed] || 750;
  if (!name || name === 'none') return '';
  const fallback = `<mc:Fallback><p:transition spd="${speed}"><p:fade/></p:transition></mc:Fallback>`;
  if (name === 'morph') {
    return `<mc:AlternateContent xmlns:mc="${MC}"><mc:Choice xmlns:p159="${P159}" Requires="p159"><p:transition spd="slow" xmlns:p14="${P14}" p14:dur="${Math.max(ms, 900)}"><p159:morph option="byObject"/></p:transition></mc:Choice>${fallback}</mc:AlternateContent>`;
  }
  if (name.startsWith('p14:')) {
    const [el, attr] = name.slice(4).split('|');
    if (!P14T.has(el)) return `<p:transition spd="${speed}"><p:fade/></p:transition>`;
    return `<mc:AlternateContent xmlns:mc="${MC}"><mc:Choice xmlns:p14="${P14}" Requires="p14"><p:transition spd="${speed}" p14:dur="${ms}"><p14:${el}${attr ? ` ${attr}` : ''}/></p:transition></mc:Choice>${fallback}</mc:AlternateContent>`;
  }
  return `<p:transition spd="${speed}">${TR[name] || TR.fade}</p:transition>`;
}

// ---------------------------------------------------------------- timing XML
function timingXml(steps, buildIds) {
  let id = 3;
  const idf = () => ++id;
  const pars = steps.map((st, n) => {
    const [preset, sub, fn, iter] = EFFECTS[st.effect] || EFFECTS.fade;
    const ctn = idf();
    const body = fn(st.spid, st.dur, idf);
    const it = iter && st.text && st.iterPct ? `<p:iterate type="${iter}"><p:tmPct val="${st.iterPct}"/></p:iterate>` : '';
    const em = st.emph && EMPH[st.emph] ? `<p:par><p:cTn id="${idf()}" presetID="6" presetClass="emph" presetSubtype="0" fill="hold" nodeType="withEffect"><p:stCondLst><p:cond delay="${st.delay + st.span}"/></p:stCondLst><p:childTnLst>${EMPH[st.emph](st.spid, st.emphDur, idf)}</p:childTnLst></p:cTn></p:par>` : '';
    return `<p:par><p:cTn id="${ctn}" presetID="${preset}" presetClass="entr" presetSubtype="${sub}" fill="hold"${st.text ? ' grpId="0"' : ''} nodeType="${n === 0 ? 'afterEffect' : 'withEffect'}"><p:stCondLst><p:cond delay="${st.delay}"/></p:stCondLst>${it}<p:childTnLst>${body}</p:childTnLst></p:cTn></p:par>${em}`;
  }).join('');
  const bld = buildIds.length ? `<p:bldLst>${buildIds.map((s) => `<p:bldP spid="${s}" grpId="0"/>`).join('')}</p:bldLst>` : '';
  return `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst><p:par><p:cTn id="${idf()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${pars}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>${bld}</p:timing>`;
}

module.exports = { plan, transitionXml, timingXml, EFFECTS, EMPH, TR };
