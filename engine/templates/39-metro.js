/**
 * 39 Metro — transit map: thick coloured metro lines with 45-degree turns, stations,
 * interchanges and station signs; the agenda, process and timeline become metro lines.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '1C1C1C', muted: '666666', sign: '1C2B4A', gray: 'D0D0D0', lines: ['E53935', '1E88E5', '43A047', 'FB8C00', '8E24AA', 'FDD835'] };
const F = { head: 'Arial', body: 'Arial' };
const LW = 0.14; // line width (inches)

const mapSvg = () => { // decorative network for the cover
  const ln = (pts, col) => `<polyline points="${pts}" fill="none" stroke="#${col}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>`;
  const st = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#1C1C1C" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
   ${ln('40,180 300,180 520,400 860,400', C.lines[0])}${ln('200,40 200,520 420,740 860,740', C.lines[1])}${ln('40,620 300,620 520,400 520,60', C.lines[2])}${ln('660,860 660,400 860,200', C.lines[3])}
   ${st(200, 180)}${st(300, 180)}${st(520, 400)}${st(660, 400)}${st(200, 520)}${st(420, 740)}${st(300, 620)}${st(520, 60)}${st(660, 740)}${st(860, 200)}
   <circle cx="520" cy="400" r="26" fill="#fff" stroke="#1C1C1C" stroke-width="7"/></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const map = await L.svg(mapSvg(), 900, 900);
  const station = (s, cx, cy, d = 0.32, inter = false) => {
    t.oval(s, cx - d / 2, cy - d / 2, d, d, 'FFFFFF', { line: { color: C.ink, width: inter ? 3 : 2.25 } });
    if (inter) t.oval(s, cx - d / 2 + 0.07, cy - d / 2 + 0.07, d - 0.14, d - 0.14, null, { line: { color: C.ink, width: 1.25 } });
  };
  const hLine = (s, x, y, w, col) => t.rect(s, x, y - LW / 2, w, LW, col, { r: LW / 2, name: 'Metro line' });
  const vLine = (s, x, y, h, col) => t.rect(s, x - LW / 2, y, LW, h, col, { r: LW / 2, name: 'Metro line' });
  const badge = (s, x, y, d, col, txt) => { t.oval(s, x, y, d, d, col); t.text(s, txt, { x, y, w: d, h: d, fontSize: Math.round(d * 30), bold: true, color: col === C.lines[5] ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); };
  const footer = (s) => {
    t.rect(s, 0, 5.25, W, 0.375, C.sign, { name: 'Sign strip' });
    C.lines.slice(0, 4).forEach((c, k) => t.oval(s, 0.45 + k * 0.22, 5.355, 0.16, 0.16, c));
    t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 1.4, y: 5.25, w: 8.2, h: 0.375, fontSize: 9, color: 'FFFFFF', valign: 'middle' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const col = C.lines[idx % 5];
    badge(s, 0.55, 0.4, 0.6, col, 'M');
    t.text(s, TR.stop(idx), { x: 8.2, y: 0.45, w: 1.25, h: 0.5, fontSize: 11, bold: true, color: C.muted, align: 'right', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 6.8, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 6.8, 0.65, 28, 16, F.head, true) });
    hLine(s, 0.55, 1.18, 8.9, col);
    footer(s);
    return s;
  };
  const photo = async (s, src, x, y, w, h, col) => { t.rect(s, x, y, w, h, col, { r: 0.2, name: 'Photo frame' }); t.img(s, await L.photo(L.src(src), w - 0.2, h - 0.2, { mask: { r: 0.14 } }), x + 0.1, y + 0.1, w - 0.2, h - 0.2, { alt: '' }); };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.img(s, map, 5.3, 0.35, 4.5, 4.5);
    if (d.image) await photo(s, d.image, 6.1, 1.3, 2.6, 2.0, C.ink);
    badge(s, 0.6, 0.55, 0.7, C.lines[0], 'M');
    t.text(s, [M.org, M.loc].filter(Boolean).join(' \u2022 '), { x: 1.45, y: 0.55, w: 3.8, h: 0.7, fontSize: 13, bold: true, color: C.muted, valign: 'middle' });
    const fs = L.fit(d.title, 4.6, 2.0, 40, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 1.4, w: 4.6, h: 2.1, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 4.5, h: 0.75, fontSize: 13, color: C.muted });
    t.rect(s, 0.6, 4.45, 3.6, 0.5, C.sign, { r: 0.08, name: 'Sign' });
    t.text(s, `${M.author || ''}  ${M.year || ''}`, { x: 0.75, y: 4.45, w: 3.4, h: 0.5, fontSize: 13, bold: true, color: 'FFFFFF', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.6, 1.5, 4.0, 3.4, C.lines[1]); para(s, d.text, 4.95, 1.5, 4.45, 3.4); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.5, 4.3, 3.4); await photo(s, d.image, 5.25, 1.5, 4.15, 3.4, C.lines[2]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n, x = 1.1;
      vLine(s, x, 1.55 + rh / 2, rh * (n - 1), C.lines[1]);
      d.items.forEach((it, i) => {
        const cy = 1.5 + i * rh + rh / 2;
        station(s, x, cy, 0.34, i === 0 || i === n - 1);
        t.text(s, it, { x: x + 0.4, y: cy - 0.25, w: 7.5, h: 0.5, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      hLine(s, 0.6 + w / 2, 1.85, (w + gap) * (n - 1), C.lines[3]);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        badge(s, x + w / 2 - 0.3, 1.55, 0.6, C.lines[i % 5], '');
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2.25), x + w / 2 - 0.15, 1.7, 0.3, 0.3);
        t.text(s, it.h, { x, y: 2.35, w, h: 0.45, fontSize: L.fit(it.h, w, 0.45, 17, 12, F.head, true), bold: true, color: C.ink, align: 'center' });
        t.text(s, it.t, { x, y: 2.85, w, h: 2.1, fontSize: L.fit(it.t, w, 2.1, 14, 10, F.body), color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      hLine(s, 0.6 + cw / 2, 1.95, cw * (n - 1), C.lines[0]);
      d.steps.forEach((st, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        station(s, cx, 1.95, 0.4, i === n - 1);
        t.text(s, `${i + 1}`, { x: cx - 0.5, y: 1.4, w: 1, h: 0.3, fontSize: 12, bold: true, color: C.lines[0], align: 'center' });
        t.text(s, st.h, { x: cx - cw / 2 + 0.1, y: 2.35, w: cw - 0.2, h: 0.45, fontSize: L.fit(st.h, cw - 0.2, 0.45, 16, 11, F.head, true), bold: true, color: C.ink, align: 'center' });
        t.text(s, st.t, { x: cx - cw / 2 + 0.1, y: 2.85, w: cw - 0.2, h: 2.1, fontSize: L.fit(st.t, cw - 0.2, 2.1, 14, 10, F.body), color: C.muted, align: 'center' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw, col = C.lines[i % 5];
        t.rect(s, px, 1.55, cw - 0.3, 1.5, col, { r: 0.12, name: 'Station sign' });
        t.text(s, x.value, { x: px + 0.2, y: 1.55, w: cw - 0.7, h: 1.5, fontSize: L.fit(x.value, cw - 0.8, 1.0, 48, 22, F.head, true), bold: true, color: col === C.lines[5] ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.2, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.2;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.75, F.body) : 0))) + 0.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4), col = C.lines[i ? 1 : 0];
        badge(s, x, 1.45, 0.5, col, i ? 'B' : 'A');
        t.text(s, side.h, { x: x + 0.65, y: 1.45, w: w - 0.7, h: 0.5, fontSize: 18, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.2; const top = y;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.6, y, w: w - 0.7, h: rows[k], fontSize: 15, color: C.ink }); y += rows[k]; });
        vLine(s, x + 0.25, top + 0.12, y - top - rows[rows.length - 1] + 0.01, col);
        let yy = top; side.items.forEach((_, k) => { station(s, x + 0.25, yy + 0.13, 0.26); yy += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.5, 8.8, 2.2, C.sign, { r: 0.12, name: 'Sign' });
      t.text(s, L.runs(d.text), { x: 0.95, y: 1.6, w: 8.1, h: 2.0, fontSize: L.fit(d.text, 8.1, 1.9, 34, 18, F.head, true), bold: true, color: 'FFFFFF', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.9, w: 8.8, h: 1.1, fontSize: L.fit(d.caption, 8.8, 1.1, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      hLine(s, 0.6 + cw / 2, 2.35, cw * (n - 1), C.lines[2]);
      d.items.forEach((it, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        t.text(s, it.year, { x: cx - cw / 2, y: 1.5, w: cw, h: 0.6, fontSize: L.fit(it.year, cw - 0.2, 0.55, 24, 12, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'bottom' });
        station(s, cx, 2.35, 0.36, i === n - 1);
        t.text(s, it.h, { x: cx - cw / 2 + 0.1, y: 2.75, w: cw - 0.2, h: 0.42, fontSize: 16, bold: true, color: C.ink, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.1, y: 3.2, w: cw - 0.2, h: 1.8, fontSize: 14, color: C.muted, align: 'center' });
      });
    },
    async quote(d) {
      const s = page({});
      t.rect(s, 0.8, 1.2, 8.4, 3.0, C.sign, { r: 0.15, name: 'Sign' });
      C.lines.slice(0, 5).forEach((c, k) => t.oval(s, 1.1 + k * 0.3, 1.45, 0.2, 0.2, c));
      t.text(s, d.text, { x: 1.15, y: 1.8, w: 7.7, h: 1.8, fontSize: L.fit(d.text, 7.7, 1.75, 28, 16, F.head, true), bold: true, color: 'FFFFFF', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.15, y: 3.6, w: 7.7, h: 0.4, fontSize: 13, color: 'C7D0E0' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n, x = 0.95;
      vLine(s, x, 1.5 + rh / 2, rh * (n - 1), C.lines[4]);
      d.items.forEach((it, i) => {
        const cy = 1.5 + i * rh + rh / 2;
        station(s, x, cy, 0.28);
        t.text(s, it, { x: x + 0.35, y: cy - rh / 2, w: 8.1, h: rh, fontSize: L.fit(it, 8.1, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Metro', colors: { dk1: C.ink, lt1: C.bg, dk2: C.sign, lt2: 'F2F2F2', accent1: C.lines[0], accent2: C.lines[1], accent3: C.lines[2], accent4: C.lines[3], accent5: C.lines[4], accent6: C.lines[5], hlink: C.lines[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'l xaritasi kabi: aniq bosqichlar va keyingi qadamlar, qisqa ko'rsatkichli iboralar", limits: {}, prefer: null };
module.exports = { id: 39, slug: 'metro', name: 'Metro', category: 'business', photos: true, build, style: STYLE };
