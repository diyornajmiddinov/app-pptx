/**
 * minimal.js — 161+ minimalist family: the BACKGROUND carries the design; slides use only type, photos and at most
 * one hairline. A template = background generator + palette + fonts + one of 7 compositions:
 *   left | center | bottom | right | split | top | narrow
 * Background helpers: lin, rad, blobs (blurred colour fields), grain (paper/film noise), flat, raw, compose.
 */
const L = require('./lib.js');
const { kit } = require('./free.js');
let gid = 0;
const compose = (...ls) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs>${ls.map((l) => l.d).join('')}</defs>${ls.map((l) => l.b).join('')}</svg>`;
const stops = (st) => st.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="#${c}" stop-opacity="${op}"/>`).join('');
const lin = (st, dir = 'v') => { const id = 'g' + gid++, c = { v: [0, 0, 0, 1], h: [0, 0, 1, 0], d: [0, 0, 1, 1], d2: [1, 0, 0, 1] }[dir]; return { d: `<linearGradient id="${id}" x1="${c[0]}" y1="${c[1]}" x2="${c[2]}" y2="${c[3]}">${stops(st)}</linearGradient>`, b: `<rect width="1600" height="900" fill="url(#${id})"/>` }; };
const rad = (cx, cy, r, st) => { const id = 'r' + gid++; return { d: `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops(st)}</radialGradient>`, b: `<rect width="1600" height="900" fill="url(#${id})"/>` }; };
const blobs = (list, blur = 120) => { const id = 'b' + gid++; return { d: `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>`, b: `<g filter="url(#${id})">${list.map(([x, y, r, c, o = 1]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#${c}" opacity="${o}"/>`).join('')}</g>` }; };
const grain = (op = 0.07, f = 0.85) => { const id = 'n' + gid++; return { d: `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`, b: `<rect width="1600" height="900" filter="url(#${id})" opacity="${op}"/>` }; };
const flat = (c) => ({ d: '', b: `<rect width="1600" height="900" fill="#${c}"/>` });
const raw = (b, d = '') => ({ d, b });
const MODES = {
  left: { T: [0.7, 0.45, 8.6, 0.9, 'left', 'bottom'], A: [0.7, 1.55, 8.6, 3.5] },
  center: { T: [1.0, 0.45, 8.0, 0.9, 'center', 'bottom'], A: [1.0, 1.55, 8.0, 3.5], c: true },
  bottom: { T: [0.7, 4.05, 8.6, 0.95, 'left', 'top'], A: [0.7, 0.45, 8.6, 3.35] },
  right: { T: [3.1, 0.45, 6.3, 0.9, 'right', 'bottom'], A: [3.1, 1.55, 6.3, 3.5] },
  split: { T: [0.6, 0.6, 3.0, 3.4, 'left', 'top'], A: [4.15, 0.55, 5.25, 4.5] },
  top: { T: [0.7, 0.3, 8.6, 1.4, 'left', 'bottom'], A: [0.7, 1.95, 8.6, 3.1], big: true },
  narrow: { T: [2.2, 0.4, 5.6, 0.85, 'center', 'bottom'], A: [2.2, 1.45, 5.6, 3.6], c: true },
};

async function run(content, out, K) {
  const C = K.C, F = K.F, M = MODES[K.mode], k = kit(content, F, C), { t } = k;
  const [ax, ay, aw, ah] = M.A, al = M.c ? 'center' : 'left', TI = C.titleInk || C.ink;
  const cache = {};
  const pm = () => (K.photo && K.photo.r === 0 ? {} : { mask: K.photo || { r: 0.08 } }); // r: 0 = square crop, no mask
  const bg = async (kind) => { const v = K.variants ? (k.idx % K.variants) : 0, key = kind + v; return (cache[key] ??= await L.svg(K.bg(kind, v), 1600, 900, true)); };
  const slide = async (kind) => { const s = k.slide('FFFFFF'); s.background = { data: await bg(kind) }; return s; };
  const num = (s) => { const n = String(k.idx).padStart(2, '0'); if (K.num === 'fraction') k.txt(s, `${n} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: C.muted, align: 'right', font: F.body, spacing: 1 }); else if (K.num === 'big') k.txt(s, n, K.mode === 'split' ? 0.6 : 8.4, K.mode === 'split' ? 4.1 : 0.2, 1.4, 0.75, { size: 32, bold: true, color: C.accent, font: F.head, align: K.mode === 'split' ? 'left' : 'right' }); else if (K.num !== 'none') k.txt(s, n, 9.05, 0.18, 0.6, 0.3, { size: 9, color: C.muted, align: 'right', font: F.body }); };
  const page = async (d, kind = 'page') => { const s = await slide(kind); const [x, y, w, h, a, va] = M.T; if (d.title) k.head(s, K.caps ? d.title.toUpperCase() : d.title, x, y, w, h, { max: K.mode === 'split' ? (K.caps ? 22 : 32) : M.big ? 40 : 28, min: 13, color: TI, align: a, valign: va, spacing: K.caps ? 2 : 0, bold: K.bold !== false }); num(s); k.foot(s, { x: ax, w: aw, y: 5.3, size: 7.5, color: C.muted, align: al }); return s; };
  const hair = (s, x, y, w) => { if (K.rule) t.line(s, x, y, w, 0, C.rule || C.muted, 0.5, { t: 50 }); };
  // text-only rows; stacked when the area is narrow or centred
  const rows = (s, list, o = {}) => { const n = list.length, rh = ah / n, stack = M.c || aw < 6.6 || o.stack, nw = o.nw ?? 0.65; list.forEach((it, i) => { const y = ay + i * rh;
    if (M.c) { k.txt(s, [...(it.n != null ? [{ text: `${it.n}   `, options: { color: C.accent, bold: true } }] : []), { text: it.h, options: { bold: true, color: C.ink } }], ax, y, aw, it.t ? 0.42 : rh, { max: it.t ? 15 : 18, min: 10, align: 'center', valign: it.t ? 'top' : 'middle', font: F.head }); if (it.t) k.txt(s, it.t, ax, y + 0.44, aw, rh - 0.5, { max: 12.5, min: 8.5, color: C.muted, align: 'center' }); }
    else { const x = ax + (it.n != null ? nw : 0), w = aw - (it.n != null ? nw : 0); if (it.n != null) k.txt(s, String(it.n), ax, y, nw, Math.min(rh, 0.42), { max: o.nmax || 13, min: 9, bold: true, color: C.accent, font: F.head });
      if (!it.t) k.head(s, it.h, x, y, w, rh, { max: o.hmax || 19, color: C.ink, valign: 'top' }); else if (stack) { k.head(s, it.h, x, y, w, 0.42, { max: 15, color: C.ink, valign: 'top' }); k.txt(s, it.t, x, y + 0.44, w, rh - 0.5, { max: 12.5, min: 8.5, color: C.muted }); } else { k.head(s, it.h, x, y, 2.55, rh - 0.08, { max: 15, color: C.ink, valign: 'top' }); k.txt(s, it.t, x + 2.7, y, w - 2.7, rh - 0.08, { max: 13, min: 8.5, color: C.muted }); } }
    if (i < n - 1) hair(s, ax, y + rh - 0.05, aw); }); };
  const cols = (s, list, o = {}) => { const n = list.length, gap = 0.4, w = (aw - gap * (n - 1)) / n; if (w < 1.75) return rows(s, list.map((it) => (it.v != null ? { n: it.v, h: it.t } : it)), { nw: 1.9, nmax: 30, hmax: 15, ...o }); /* stats: the value goes in the number column */ list.forEach((it, i) => { const x = ax + i * (w + gap); let y = ay; if (it.v != null) { k.head(s, it.v, x, y, w, 1.25, { max: 56, min: 18, color: C.accent, align: al, valign: 'top' }); y += 1.3; } else if (it.n != null) { k.txt(s, String(it.n), x, y, w, 0.45, { max: 22, min: 10, bold: true, color: C.accent, font: F.head, align: al }); y += 0.55; } if (it.h) { k.head(s, it.h, x, y, w, 0.55, { max: 16, color: C.ink, align: al, valign: 'top' }); y += 0.6; } k.txt(s, it.t || '', x, y, w, ay + ah - y - (o.foot || 0), { max: 13, min: 8.5, color: C.muted, align: al }); }); };
  const list = (s, items, o) => (K.list === 'cols' ? cols(s, items, o) : rows(s, items, o));
  const photoBox = () => (aw >= 6.6 ? { p: [ax + aw - aw * 0.4, ay, aw * 0.4, ah], tx: [ax, ay, aw * 0.6 - 0.4, ah] } : { p: [ax, ay, aw, 1.95], tx: [ax, ay + 2.15, aw, ah - 2.15] });
  const R = {
    async cover(d) { const s = await slide('cover'), CI = C.coverInk || TI;
      if (K.mode === 'split') { if (d.image) await k.photo(s, d.image, 4.15, 0.55, 5.25, 4.45, pm()); k.txt(s, k.org3, 0.6, 0.7, 3.0, 0.6, { max: 11, color: C.accent, bold: true }); k.head(s, K.caps ? d.title.toUpperCase() : d.title, 0.6, 1.35, 3.0, 2.3, { max: K.caps ? 22 : 30, min: 13, color: CI, valign: 'top', bold: K.bold !== false }); k.txt(s, d.subtitle || '', 0.6, 3.7, 3.0, 0.6, { max: 11, color: C.muted }); k.txt(s, k.M.author || '', 0.6, 4.4, 3.0, 0.4, { max: 14, bold: true, color: CI }); }
      else if (M.c) { if (d.image) await k.photo(s, d.image, 4.25, 0.45, 1.5, 1.5, { mask: 'circle' }); k.txt(s, k.org3, 1.0, 2.1, 8.0, 0.3, { size: 11, color: C.accent, align: 'center', spacing: 2, bold: true }); k.head(s, d.title, 1.0, 2.45, 8.0, 1.5, { max: 40, min: 18, color: CI, align: 'center', bold: K.bold !== false }); k.txt(s, d.subtitle || '', 1.5, 3.95, 7.0, 0.55, { max: 13, color: C.muted, align: 'center' }); k.txt(s, k.M.author || '', 1.0, 4.5, 8.0, 0.4, { size: 15, bold: true, color: CI, align: 'center' }); }
      else { const low = K.mode === 'bottom'; if (d.image) await k.photo(s, d.image, 6.45, 0.6, 3.0, low ? 2.9 : 3.95, pm()); k.txt(s, k.org3, 0.7, low ? 1.9 : 0.75, 5.4, 0.3, { size: 11, color: C.accent, spacing: 2, bold: true }); k.head(s, d.title, 0.7, low ? 2.25 : 1.1, 5.5, low ? 1.95 : 2.3, { max: 42, min: 18, color: CI, valign: low ? 'bottom' : 'top', bold: K.bold !== false }); k.txt(s, d.subtitle || '', 0.7, low ? 4.25 : 3.5, 5.3, 0.6, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.7, low ? 4.8 : 4.25, 5.3, 0.4, { size: 15, bold: true, color: CI }); }
      k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted, align: M.c ? 'center' : 'left' }); },
    async intro(d) { const s = await page(d), b = photoBox(); await k.photo(s, d.image, ...b.p, pm()); k.txt(s, d.text, ...b.tx, { max: 16, min: 9.5, color: C.ink, ls: 1.4, valign: 'middle', align: M.c && aw < 6.6 ? 'center' : 'left' }); },
    async image(d) { const s = await page(d), b = photoBox(); if (aw >= 6.6) { await k.photo(s, d.image, ax, ay, aw * 0.4, ah, pm()); k.txt(s, d.text, ax + aw * 0.4 + 0.4, ay, aw * 0.6 - 0.4, ah, { max: 16, min: 9.5, color: C.ink, ls: 1.4, valign: 'middle' }); } else { await k.photo(s, d.image, ...b.p, pm()); k.txt(s, d.text, ...b.tx, { max: 15, min: 9.5, color: C.ink, ls: 1.35, valign: 'middle', align: M.c ? 'center' : 'left' }); } },
    async agenda(d) { const s = await page(d); rows(s, d.items.map((it, i) => ({ n: String(i + 1).padStart(2, '0'), h: it }))); },
    async cards(d) { const s = await page(d); list(s, d.items.map((it, i) => ({ n: String(i + 1).padStart(2, '0'), h: it.h, t: it.t }))); },
    async process(d) { const s = await page(d); list(s, d.steps.map((st, i) => ({ n: `${i + 1}`, h: st.h, t: st.t }))); },
    async stats(d) { const s = await page(d); if (aw >= 6.6 || M.c) cols(s, d.stats.map((v) => ({ v: v.value, t: v.label })), { foot: d.note ? 0.6 : 0 }); else rows(s, d.stats.map((v) => ({ n: v.value, h: v.label })), { nw: 1.9, nmax: 30, hmax: 15 }); if (d.note) k.txt(s, d.note, ax, ay + ah - 0.5, aw, 0.5, { max: 10, color: C.muted, align: al, valign: 'bottom' }); },
    async compare(d) { const s = await page(d), gap = 0.5, w = (aw - gap) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.12, ah - 0.7); [d.left, d.right].forEach((sd, i) => { const x = ax + i * (w + gap); k.head(s, sd.h, x, ay, w, 0.5, { max: 17, color: C.accent, align: al, valign: 'top' }); hair(s, x, ay + 0.55, w); let y = ay + 0.68; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: C.ink, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d, 'focus'); k.head(s, L.runs(d.text), ax, ay, aw, ah * 0.7, { max: 40, min: 16, color: TI === C.ink ? C.ink : C.ink, align: al, valign: 'middle', bold: K.bold !== false }); if (d.caption) k.txt(s, d.caption, ax, ay + ah * 0.72, aw, ah * 0.28, { max: 13, color: C.muted, align: al }); },
    async timeline(d) { const s = await page(d); if (K.list === 'cols' && aw >= 6.6) cols(s, d.items.map((it) => ({ n: it.year, h: it.h, t: it.t }))); else rows(s, d.items.map((it) => ({ n: it.year, h: it.h, t: it.t })), { nw: 1.05, nmax: 15 }); },
    async quote(d) { const s = await page({}, 'focus'); k.head(s, `\u201C${d.text}\u201D`, ax, ay, aw, ah * 0.75, { max: 34, min: 15, italic: true, bold: false, color: C.ink, align: al, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, ax, ay + ah * 0.78, aw, 0.45, { size: 14, color: C.accent, align: al, bold: true }); },
    async sources(d) { const s = await page(d); rows(s, d.items.map((it, i) => ({ n: `${i + 1}.`, h: it })), { hmax: 12.5, nw: 0.45 }); },
  };
  R.closing = R.cover;
  // a template's own further ways to draw a type: a deck's pages must not look alike (L.pages)
  const draw = L.pages(R, K.ways ? K.ways({ k, t, L, C, F, TI, slide, page, num, hair }, R) : {});
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI ' + K.name, colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.ink, lt2: 'F5F5F5', accent1: C.accent, accent2: C.muted, accent3: C.accent, accent4: C.muted, accent5: C.accent, accent6: C.muted, hlink: C.accent, folHlink: C.muted } });
}
const rowsFit = L.rowsFit;
const B = (K) => ({ id: K.id, slug: K.slug, name: K.name, category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: K.tone, limits: K.limits || {}, prefer: K.prefer || null } });
module.exports = { B, compose, lin, rad, blobs, grain, flat, raw };
