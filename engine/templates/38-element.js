/**
 * 38 Element — periodic table: every idea becomes an element tile (atomic number,
 * symbol, name), colour-coded by "group", with lab-style labels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F7F7F4', ink: '1B1F2A', muted: '626B7A', line: 'DADDE3', white: 'FFFFFF', groups: ['FF6B6B', 'FFB547', '4ECDC4', '7B8CDE', 'B983FF', '6BCB77'] };
const F = { head: 'Arial', body: 'Arial' };
const symbolOf = (text) => { // "Daromad solig'i" -> "Ds"; "QQS" -> "Qq"
  const w = String(text).replace(/[^A-Za-z\u0400-\u04FF ]/g, '').split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  const a = w[0][0].toUpperCase(), b = w[1] ? w[1][0].toLowerCase() : (w[0][1] || '').toLowerCase();
  return a + b;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  // element tile: number top-left, symbol centre, name bottom, optional mass top-right
  const tile = (s, x, y, d, { num, sym, name, mass, color }) => {
    t.rect(s, x, y, d, d, color, { line: { color: C.ink, width: 1.25 }, name: 'Element tile' });
    t.text(s, String(num), { x: x + 0.07, y: y + 0.05, w: d / 2, h: d * 0.2, fontSize: Math.max(8, d * 10), bold: true, color: C.ink });
    if (mass) t.text(s, mass, { x: x + d / 2, y: y + 0.05, w: d / 2 - 0.07, h: d * 0.2, fontSize: Math.max(7, d * 8), color: C.ink, align: 'right' });
    t.text(s, sym, { x, y: y + d * 0.18, w: d, h: d * 0.5, fontSize: L.fit(sym, d - 0.15, d * 0.48, d * 40, 10, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
    if (name) t.text(s, name, { x: x + 0.05, y: y + d * 0.7, w: d - 0.1, h: d * 0.26, fontSize: L.fit(name, d - 0.1, d * 0.24, Math.max(7, d * 9), 6, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
  };
  const footer = (s) => {
    t.line(s, 0.6, 5.12, 8.8, 0, C.line, 0.75);
    t.text(s, M.topic || '', { x: 0.6, y: 5.18, w: 4.4, h: 0.25, fontSize: 9, bold: true, color: C.ink });
    t.text(s, meta, { x: 4.6, y: 5.18, w: 4.8, h: 0.25, fontSize: 9, color: C.muted, align: 'right' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.title) {
      tile(s, 0.6, 0.35, 0.75, { num: idx, sym: symbolOf(d.title), color: C.groups[idx % 6] });
      t.text(s, d.title, { x: 1.55, y: 0.35, w: 7.9, h: 0.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 28, 16, F.head, true) });
    }
    footer(s);
    return s;
  };
  const framed = async (s, src, x, y, w, h, color) => { t.rect(s, x, y, w, h, color, { line: { color: C.ink, width: 1.25 }, name: 'Frame' }); t.img(s, await L.photo(L.src(src), w - 0.24, h - 0.24), x + 0.12, y + 0.12, w - 0.24, h - 0.24, { alt: '' }); };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const words = d.title.split(/\s+/).filter((w) => w.length > 2).slice(0, 4);
    words.forEach((w, i) => tile(s, 0.6 + i * 1.1, 0.6, 1.0, { num: i + 1, sym: symbolOf(w), name: w, color: C.groups[i % 6] }));
    if (d.image) await framed(s, d.image, 6.2, 0.6, 3.2, 3.0, C.groups[3]);
    const fs = L.fit(d.title, 5.3, 1.5, 38, 20, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 1.8, w: 5.3, h: 1.6, bold: true, fontSize: fs, color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 5.3, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, [{ text: M.author || '', options: { bold: true, color: C.ink } }, { text: `   ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, options: { color: C.muted } }], { x: 0.6, y: 4.4, w: 8.8, h: 0.35, fontSize: 13 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await framed(s, d.image, 0.6, 1.4, 4.0, 3.45, C.groups[2]); para(s, d.text, 4.95, 1.4, 4.45, 3.45); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.4, 4.3, 3.45); await framed(s, d.image, 5.25, 1.4, 4.15, 3.45, C.groups[4]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, dd = Math.min(1.35, (8.8 - 0.2 * (n - 1)) / n);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (dd + 0.2);
        tile(s, x, 1.5, dd, { num: i + 1, sym: symbolOf(it), color: C.groups[i % 6] });
        t.text(s, it, { x: x - 0.05, y: 1.6 + dd, w: dd + 0.1, h: 0.9, fontSize: L.fit(it, dd + 0.1, 0.9, 14, 9, F.head, true), bold: true, color: C.ink, align: 'center' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, rh = (3.6 - 0.15 * (n - 1)) / n, dd = Math.min(rh, 0.95);
      const hx = 0.6 + dd + 0.3, hw = 3.3 - hx; // headings end before the connector line (3.4) and the text (3.65)
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, hw, dd, 17, 10, F.head, true))); // one size for all headings
      d.items.forEach((it, i) => {
        const y = 1.35 + i * (rh + 0.15);
        tile(s, 0.6, y, dd, { num: i + 1, sym: symbolOf(it.h), color: C.groups[i % 6] });
        t.text(s, it.h, { x: hx, y, w: hw, h: dd, fontSize: hfs, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: 3.65, y, w: 5.75, h: dd, fontSize: L.fit(it.t, 5.75, dd, 15, 10, F.body), color: C.muted, valign: 'middle' });
        t.line(s, 3.4, y + dd / 2, 0.15, 0, C.line, 1);
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, dd = 1.15;
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        tile(s, x, 1.45, dd, { num: i + 1, sym: symbolOf(st.h), name: st.h, color: C.groups[i % 6] });
        if (i < n - 1) t.text(s, '\u2192', { x: x + dd, y: 1.45, w: cw - dd, h: dd, fontSize: 26, bold: true, color: C.muted, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.75, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 16, 11, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.2, w: cw - 0.3, h: 1.75, fontSize: L.fit(st.t, cw - 0.3, 1.75, 14, 10, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(1.9, cw - 0.6);
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        tile(s, cx - dd / 2, 1.4, dd, { num: i + 1, sym: x.value, color: C.groups[(i * 2) % 6] });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 1.55 + dd, w: cw - 0.4, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.55, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.2;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.75, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4), col = C.groups[i ? 2 : 0];
        tile(s, x, 1.35, 0.7, { num: i + 1, sym: symbolOf(side.h), color: col });
        t.text(s, side.h, { x: x + 0.85, y: 1.35, w: w - 0.9, h: 0.7, fontSize: 19, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, k) => { t.rect(s, x, y + 0.04, 0.24, 0.24, col, { line: { color: C.ink, width: 0.75 }, name: 'Mini tile' }); t.text(s, it, { x: x + 0.4, y, w: w - 0.45, h: rows[k], fontSize: 15, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      tile(s, 0.7, 1.45, 2.3, { num: idx, sym: '!', name: d.title, color: C.groups[4] });
      t.text(s, L.runs(d.text), { x: 3.4, y: 1.4, w: 6.0, h: 1.9, fontSize: L.fit(d.text, 6.0, 1.8, 34, 20, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 3.4, y: 3.45, w: 6.0, h: 1.4, fontSize: L.fit(d.caption, 6.0, 1.4, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, dd = 1.0;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        tile(s, x, 1.4, dd, { num: i + 1, sym: symbolOf(it.h), mass: it.year, color: C.groups[(i + 1) % 6] });
        t.text(s, it.year, { x: x + dd + 0.1, y: 1.4, w: cw - dd - 0.2, h: dd, fontSize: L.fit(it.year, cw - dd - 0.25, 0.5, 22, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.9, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      tile(s, 0.8, 1.2, 1.6, { num: '\u201C', sym: '\u201C\u201D', name: TR.quote, color: C.groups[1] });
      t.text(s, d.text, { x: 2.8, y: 1.1, w: 6.6, h: 2.5, fontSize: L.fit(d.text, 6.6, 2.4, 30, 18, F.head, true), bold: true, color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.8, y: 3.7, w: 6.6, h: 0.4, fontSize: 14, color: C.muted });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.rect(s, 0.6, y + (rh - 0.42) / 2, 0.42, 0.42, C.groups[i % 6], { line: { color: C.ink, width: 0.75 }, name: 'Mini tile' });
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.42) / 2, w: 0.42, h: 0.42, fontSize: 11, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontSize: L.fit(it, 8.2, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Element', colors: { dk1: C.ink, lt1: C.white, dk2: '343A48', lt2: C.bg, accent1: C.groups[0], accent2: C.groups[1], accent3: C.groups[2], accent4: C.groups[3], accent5: C.groups[4], accent6: C.groups[5], hlink: C.groups[3], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ilmiy-ommabop: tushunchalarni element kabi aniq ta'riflab ber, qisqa va lo'nda", limits: { agenda_item: 26 }, prefer: 'data' };
module.exports = { id: 38, slug: 'element', name: 'Element', category: 'academic', photos: true, build, style: STYLE };
