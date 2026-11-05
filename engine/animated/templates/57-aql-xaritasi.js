/**
 * 57 Aql xaritasi — mind map: a central idea with coloured branches drawn as smooth
 * curves, ideas as rounded nodes, sources as a branching tree.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F7F9FC', core: '22303C', ink: '1F2933', muted: '5F6B7A', white: 'FFFFFF', br: ['5B8DEF', 'F2994A', '27AE60', 'EB5757', '9B51E0', '2D9CDB'] };
const F = { head: 'Arial', body: 'Calibri' };

// smooth branches: [x1, y1, x2, y2, colour] in inches
const curvesSvg = (list, wdt = 3.5) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${list.map(([a, b, c, d, col]) => {
  const ax = a * 100, ay = b * 100, cx = c * 100, cy = d * 100, mx = (ax + cx) / 2;
  return `<path d="M${ax},${ay} C${mx},${ay} ${mx},${cy} ${cx},${cy}" fill="none" stroke="#${col}" stroke-width="${wdt * 2}" stroke-linecap="round" stroke-opacity="0.85"/>`; }).join('')}</svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const curves = async (s, list, w) => t.img(s, await L.svg(curvesSvg(list, w), 1000, 563), 0, 0, W, H);
  const node = (s, x, y, w, h, col, fill = C.white) => t.rect(s, x, y, w, h, fill, { r: Math.min(0.25, h / 2), line: { color: col, width: 2 }, shadow: 0.1, blur: 6, offset: 2, name: 'Node' });
  const core = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.core, { r: Math.min(0.3, h / 2), shadow: 0.2, blur: 8, offset: 3, name: 'Central idea' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.oval(s, 0.5, 0.42, 0.5, 0.5, C.br[idx % 6]);
    t.text(s, String(idx), { x: 0.5, y: 0.42, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.2, y: 0.35, w: 8.3, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.3, 0.65, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photoNode = async (s, src, x, y, w, h, col) => { node(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, col); t.img(s, await L.photo(L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const cx = 3.0, cy = 2.75;
    const leaves = [[M.author, 6.3, 0.75], [M.org, 6.9, 1.85], [M.loc, 6.9, 3.3], [M.year, 6.3, 4.35]].filter((l) => l[0]);
    await curves(s, [...leaves.map(([, x, y], i) => [cx + 2.2, cy, x, y + 0.25, C.br[i]]), ...(d.image ? [[cx - 0.6, cy + 1.15, 1.4, 4.05, C.br[4]]] : [])], 4);
    core(s, cx - 2.3, cy - 1.15, 4.6, 2.3);
    t.text(s, d.title, { x: cx - 2.1, y: cy - 1.05, w: 4.2, h: 1.55, bold: true, fontSize: L.fit(d.title, 4.2, 1.5, 32, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: cx - 2.1, y: cy + 0.5, w: 4.2, h: 0.55, fontSize: 11, color: 'C9D3DE', align: 'center', valign: 'top' });
    leaves.forEach(([txt, x, y], i) => { node(s, x, y, 2.6, 0.5, C.br[i]); t.text(s, txt, { x: x + 0.15, y, w: 2.3, h: 0.5, fontSize: 13, bold: i === 0, color: C.ink, valign: 'middle' }); });
    if (d.image) await photoNode(s, d.image, 1.45, 4.0, 1.9, 1.05, C.br[4]);
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await curves(s, [[4.2, 3.2, 4.9, 3.2, C.br[0]]], 4); await photoNode(s, d.image, 0.7, 1.55, 3.5, 3.3, C.br[0]); node(s, 4.9, 1.4, 4.6, 3.6, C.br[0]); para(s, d.text, 5.15, 1.55, 4.1, 3.3); },
    async image(d) { const s = page(d); await curves(s, [[5.05, 3.2, 5.75, 3.2, C.br[2]]], 4); node(s, 0.45, 1.4, 4.6, 3.6, C.br[2]); para(s, d.text, 0.7, 1.55, 4.1, 3.3); await photoNode(s, d.image, 5.85, 1.55, 3.5, 3.3, C.br[2]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, cx = 5.0, cy = 3.15;
      const pos = d.items.map((_, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [cx + 3.25 * Math.cos(a), cy + 1.55 * Math.sin(a)]; });
      await curves(s, pos.map(([x, y], i) => [cx, cy, x, y, C.br[i % 6]]), 3.5);
      core(s, cx - 1.1, cy - 0.38, 2.2, 0.76);
      t.text(s, d.title || '', { x: cx - 1.05, y: cy - 0.38, w: 2.1, h: 0.76, bold: true, fontSize: 16, color: C.white, align: 'center', valign: 'middle' });
      d.items.forEach((it, i) => { const [x, y] = pos[i]; node(s, x - 1.25, y - 0.3, 2.5, 0.6, C.br[i % 6]); t.text(s, it, { x: x - 1.15, y: y - 0.3, w: 2.3, h: 0.6, fontSize: 13, bold: true, color: C.ink, align: 'center', valign: 'middle' }); });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, top = 1.35, avail = 3.75, gap = 0.12, h = (avail - gap * (n - 1)) / n;
      await curves(s, d.items.map((_, i) => [2.55, 3.2, 3.2, top + i * (h + gap) + h / 2, C.br[i % 6]]), 3.5);
      core(s, 0.45, 2.75, 2.1, 0.9);
      t.text(s, d.title || '', { x: 0.55, y: 2.75, w: 1.9, h: 0.9, bold: true, fontSize: 13, color: C.white, align: 'center', valign: 'middle' });
      for (const [i, it] of d.items.entries()) {
        const y = top + i * (h + gap);
        node(s, 3.2, y, 6.3, h, C.br[i % 6]);
        t.img(s, await L.icon(it.icon, C.br[i % 6], 2), 3.38, y + h / 2 - 0.18, 0.36, 0.36);
        t.text(s, it.h, { x: 3.9, y: y + 0.05, w: 1.75, h: h - 0.1, fontSize: L.fit(it.h, 1.75, h - 0.1, 15, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: 5.75, y: y + 0.05, w: 3.6, h: h - 0.1, fontSize: 13, color: C.muted, valign: 'middle' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 9.0 / n;
      await curves(s, d.steps.slice(1).map((_, i) => [0.5 + i * cw + cw - 0.3, 1.75, 0.5 + (i + 1) * cw + 0.15, 1.75, C.br[i % 6]]), 3);
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * cw;
        node(s, x + 0.05, 1.4, cw - 0.3, 0.7, C.br[i % 6], C.br[i % 6]);
        t.text(s, `${i + 1}. ${st.h}`, { x: x + 0.15, y: 1.4, w: cw - 0.5, h: 0.7, fontSize: L.fit(`${i + 1}. ${st.h}`, cw - 0.5, 0.65, 15, 10, F.head, true), bold: true, color: C.white, align: 'center', valign: 'middle' });
        node(s, x + 0.05, 2.3, cw - 0.3, 2.75, C.br[i % 6]);
        t.text(s, st.t, { x: x + 0.2, y: 2.4, w: cw - 0.6, h: 2.55, fontSize: 14, color: C.ink });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 9.0 / n;
      await curves(s, d.stats.map((_, i) => [5.0, 1.75, 0.5 + i * cw + cw / 2, 2.4, C.br[i % 6]]), 3);
      core(s, 3.9, 1.3, 2.2, 0.6);
      t.text(s, d.title || '', { x: 3.95, y: 1.3, w: 2.1, h: 0.6, bold: true, fontSize: 12, color: C.white, align: 'center', valign: 'middle' });
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * cw;
        node(s, px + 0.1, 2.4, cw - 0.4, 2.0, C.br[i % 6]);
        t.text(s, x.value, { x: px + 0.2, y: 2.45, w: cw - 0.6, h: 1.0, fontSize: L.fit(x.value, cw - 0.7, 0.95, 44, 20, F.head, true), bold: true, color: C.br[i % 6], align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 3.45, w: cw - 0.6, h: 0.9, fontSize: 13, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.5, w: 9.0, h: 0.65, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.9, F.body, 0.2, 5.0 - 2.25);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4), col = C.br[i ? 1 : 0];
        core(s, x, 1.35, w, 0.6);
        t.text(s, side.h, { x: x + 0.2, y: 1.35, w: w - 0.4, h: 0.6, fontSize: 16, bold: true, color: C.white, valign: 'middle' });
        let y = 2.25; const lines = [];
        side.items.forEach((it, k) => { lines.push([x + 0.25, 1.95, x + 0.55, y + Math.min(0.2, rows[k] / 2), col]); node(s, x + 0.55, y, w - 0.55, rows[k] - 0.08, col); t.text(s, it, { x: x + 0.7, y: y + 0.02, w: w - 0.85, h: rows[k] - 0.12, fontSize: fs, color: C.ink, valign: 'middle' }); y += rows[k]; });
        await curves(s, lines, 2.5);
      }
    },
    async statement(d) {
      const s = page(d);
      await curves(s, [[2.0, 2.65, 0.6, 1.6, C.br[0]], [8.0, 2.65, 9.4, 1.6, C.br[1]], [2.0, 2.65, 0.6, 3.9, C.br[2]], [8.0, 2.65, 9.4, 3.9, C.br[3]]], 3);
      core(s, 1.6, 1.4, 6.8, 2.5);
      t.text(s, L.runs(d.text), { x: 1.9, y: 1.5, w: 6.2, h: 2.3, bold: true, fontSize: L.fit(d.text, 6.2, 2.2, 32, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 4.05, w: 8.0, h: 1.05, fontSize: 13, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.0 / n;
      await curves(s, d.items.slice(1).map((_, i) => [0.5 + i * cw + cw - 0.35, 1.7, 0.5 + (i + 1) * cw + 0.05, 1.7, C.br[i % 6]]), 3);
      d.items.forEach((it, i) => {
        const x = 0.5 + i * cw;
        node(s, x + 0.05, 1.4, cw - 0.4, 0.6, C.br[i % 6], C.br[i % 6]);
        t.text(s, it.year, { x: x + 0.1, y: 1.4, w: cw - 0.5, h: 0.6, fontSize: L.fit(it.year, cw - 0.55, 0.55, 20, 10, F.head, true), bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.05, y: 2.15, w: cw - 0.25, h: 0.5, fontSize: 15, bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.05, y: 2.65, w: cw - 0.25, h: 2.4, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      await curves(s, [[5.0, 3.9, 5.0, 4.6, C.br[4]]], 3);
      core(s, 1.3, 1.1, 7.4, 2.8);
      t.text(s, d.text, { x: 1.6, y: 1.2, w: 6.8, h: 2.6, italic: true, bold: true, fontSize: L.fit(d.text, 6.8, 2.5, 30, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.author) { node(s, 3.4, 4.5, 3.2, 0.5, C.br[4]); t.text(s, d.author, { x: 3.5, y: 4.5, w: 3.0, h: 0.5, fontSize: 13, bold: true, color: C.ink, align: 'center', valign: 'middle' }); }
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      await curves(s, d.items.map((_, i) => [0.75, 1.3, 1.15, 1.4 + i * rh + rh / 2, C.br[i % 6]]), 2.5);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        node(s, 1.15, y + 0.04, 8.35, rh - 0.08, C.br[i % 6]);
        t.text(s, it, { x: 1.3, y: y + 0.04, w: 8.1, h: rh - 0.08, fontSize: 13, color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all on one thinking map: a deck's pages must not look alike (L.pages)
  const NIGHT = '2F3F4E', MIST = 'D5DEE8';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const flow = async (s, list, wd = 3) => t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${list.map(([p, col]) => `<path d="${p}" fill="none" stroke="#${col}" stroke-width="${wd * 2}" stroke-linecap="round" stroke-opacity="0.85"/>`).join('')}</svg>`, 1000, 563), 0, 0, W, H);
  const P = (v) => Math.round(v * 100);
  const down = (a, b, c, d) => `M${P(a)},${P(b)} C${P(a)},${P((b + d) / 2)} ${P(c)},${P((b + d) / 2)} ${P(c)},${P(d)}`; // leaves and arrives vertically
  const elbow = (a, b, c, d) => `M${P(a)},${P(b)} Q${P(c)},${P(b)} ${P(c)},${P(d)}`; // leaves sideways, arrives from above
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: C.core }; idx++;
    t.oval(s, 0.5, 0.42, 0.5, 0.5, C.white);
    t.text(s, String(idx), { x: 0.5, y: 0.42, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.core, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 1.2, y: 0.35, w: 8.3, h: 0.65, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.3, 0.65, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: MIST });
    return s;
  };
  const num = (s, n, x, y, d, col, ink = C.white) => { t.oval(s, x, y, d, d, col); t.text(s, String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 34), bold: true, color: ink, align: 'center', valign: 'middle' }); };
  const V = {
    image: [
      async (d) => { // the picture is the central idea, three branches carry it to the words
        const s = page(d), D = 3.3, cy = 3.15;
        await curves(s, [[3.6, cy, 4.75, 2.0, C.br[0]], [3.6, cy, 4.75, cy, C.br[1]], [3.6, cy, 4.75, 4.3, C.br[2]]], 4);
        t.oval(s, 0.45, cy - D / 2 - 0.1, D + 0.2, D + 0.2, C.white, { line: { color: C.core, width: 3 } });
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle' }), 0.55, cy - D / 2, D, D, { alt: '' });
        node(s, 4.75, 1.35, 4.75, 3.65, C.br[0]);
        t.text(s, d.text, { x: 4.98, y: 1.45, w: 4.3, h: 3.45, fontSize: L.fit(d.text, 4.3, 3.45, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // a wide picture node with one leaf hanging from it
        const s = page(d);
        await flow(s, [[down(5, 3.25, 5, 3.6), C.br[1]]], 5);
        await photoNode(s, d.image, 0.58, 1.28, 8.84, 1.9, C.br[1]);
        node(s, 1.1, 3.55, 7.8, 1.55, C.br[1]);
        t.text(s, d.text, { x: 1.3, y: 3.6, w: 7.4, h: 1.45, fontSize: L.fit(d.text, 7.4, 1.45, 15, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, the idea floats over it as one node
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 4.75, 0.3, 4.95, 4.75, C.core, { r: 0.25, shadow: 0.3, blur: 10, offset: 3, name: 'Central idea' });
        num(s, idx, 5.0, 0.52, 0.5, C.white, C.core);
        t.text(s, d.title, { x: 5.62, y: 0.42, w: 3.85, h: 0.75, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 3.85, 0.75, 20, 13, F.head, true) });
        t.text(s, d.text, { x: 5.0, y: 1.3, w: 4.45, h: 3.6, fontSize: L.fit(d.text, 4.45, 3.6, 14, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0.3, 5.17, 9.4, 0.34, C.bg, { r: 0.12, name: 'Footer' }); footer(s);
      },
      async (d) => { // night map: a six-sided picture with threads going off the page
        const s = nightPage(d), w = 4.1, h = 3.55, x = 5.45, y = 1.42;
        await curves(s, [[8.9, 1.9, 10.2, 1.2, C.br[1]], [9.3, 3.2, 10.2, 3.2, C.br[2]], [8.9, 4.5, 10.2, 5.0, C.br[0]]], 3);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]] } }), x, y, w, h, { alt: '' });
        t.rect(s, 0.5, 1.5, 0.07, 3.4, C.br[1], { name: 'Thread' });
        t.text(s, d.text, { x: 0.75, y: 1.42, w: 4.4, h: 3.6, fontSize: L.fit(d.text, 4.4, 3.6, 15, 10, F.body, false, 1.2), color: C.white, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the classic map: a hub in the middle, ideas round it
        const s = page(d), n = d.items.length, w = 3.45, h = 1.85, cy = 3.2;
        const pos = n === 4 ? [[0.5, 1.3], [0.5, 3.25], [6.05, 1.3], [6.05, 3.25]] : [[0.5, 1.3], [0.5, 3.25], [6.05, 2.28]];
        await curves(s, pos.map(([x, y], i) => [5, cy, x < 5 ? x + w : x, y + h / 2, C.br[i]]), 3.5);
        t.oval(s, 4.35, cy - 0.65, 1.3, 1.3, C.core);
        t.img(s, await L.icon('FiShare2', C.white, 2), 4.72, cy - 0.28, 0.56, 0.56);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          node(s, x, y, w, h, C.br[i]);
          t.img(s, await L.icon(it.icon, C.br[i], 2), x + 0.16, y + 0.12, 0.34, 0.34);
          head(s, it.h, x + 0.6, y + 0.06, w - 0.75, 0.46, { max: 14 });
          body(s, it.t, x + 0.16, y + 0.56, w - 0.32, h - 0.64, { max: 13 });
        }
      },
      async (d) => { // ideas hang from one bough, at uneven lengths
        const s = page(d), n = d.items.length, cw = 9 / n, w = cw - 0.16, h = 2.95;
        const X = (i) => 0.5 + i * cw + 0.08, Y = (i) => 1.5 + (i % 2) * 0.62;
        await flow(s, d.items.map((_, i) => [down(5, 1.18, X(i) + w / 2, Y(i)), C.br[i]]));
        t.rect(s, 3.6, 1.1, 2.8, 0.14, C.core, { r: 0.07, name: 'Bough' });
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i);
          node(s, x, y, w, h, C.br[i]);
          t.img(s, await L.icon(it.icon, C.br[i], 2), x + 0.14, y + 0.12, 0.36, 0.36);
          head(s, it.h, x + 0.14, y + 0.54, w - 0.28, 0.5, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.08, w - 0.28, h - 1.16, { max: 13 });
        }
      },
      async (d) => { // night map: lit tiles, two by two
        const s = nightPage(d), n = d.items.length, w = 4.4, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, NIGHT, { r: 0.14, name: 'Tile' });
          t.oval(s, x + 0.16, y + 0.18, 0.62, 0.62, C.br[i]);
          t.img(s, await L.icon(it.icon, C.core, 2.2), x + 0.3, y + 0.32, 0.34, 0.34);
          head(s, it.h, x + 0.95, y + 0.1, ww - 1.1, 0.48, { color: C.white });
          body(s, it.t, x + 0.95, y + 0.6, ww - 1.1, h - 0.68, { color: MIST });
        }
      },
      async (d) => { // the first idea is the big one, the rest branch out of it
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.8 - gap * (n - 1)) / n, Y = (i) => 1.3 + i * (h + gap);
        await curves(s, rest.map((_, i) => [4.3, 3.2, 5.1, Y(i) + h / 2, C.br[(i + 1) % 6]]), 3.5);
        t.rect(s, 0.5, 1.3, 3.9, 3.8, C.core, { r: 0.25, name: 'Central idea' });
        t.img(s, await L.icon(a.icon, C.white, 2), 0.75, 1.52, 0.66, 0.66);
        head(s, a.h, 0.75, 2.26, 3.4, 0.7, { color: C.white, max: 20 });
        body(s, a.t, 0.75, 3.0, 3.4, 1.95, { color: MIST, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = Y(i), col = C.br[(i + 1) % 6];
          node(s, 5.1, y, 4.4, h, col);
          t.img(s, await L.icon(it.icon, col, 2), 5.26, y + 0.1, 0.3, 0.3);
          head(s, it.h, 5.66, y + 0.05, 3.7, 0.4, { max: 13 });
          body(s, it.t, 5.26, y + 0.46, 4.1, h - 0.52, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // thought runs down a staircase of nodes
        const s = page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.14, h = n === 4 ? 1.85 : 1.95, dy = (3.85 - h) / (n - 1);
        const X = (i) => 0.5 + i * cw, Y = (i) => 1.25 + i * dy;
        await flow(s, d.steps.slice(1).map((_, i) => [elbow(X(i) + w, Y(i) + 0.26, X(i + 1) + 0.9, Y(i + 1)), C.br[i]]));
        for (const [i, st] of d.steps.entries()) {
          const x = X(i), y = Y(i);
          node(s, x, y, w, h, C.br[i]);
          num(s, i + 1, x + 0.12, y + 0.1, 0.38, C.core);
          head(s, st.h, x + 0.58, y + 0.05, w - 0.68, 0.5, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.58, w - 0.26, h - 0.64);
        }
      },
      async (d) => { // a thread swings from side to side, bar by bar
        const s = page(d), n = d.steps.length, gap = 0.2, h = (3.82 - gap * (n - 1)) / n, w = 7.7;
        const X = (i) => 0.5 + (i % 2) * 1.3, Y = (i) => 1.28 + i * (h + gap);
        await flow(s, d.steps.slice(1).map((_, i) => [i % 2 ? elbow(X(i), Y(i) + h / 2, 1.15, Y(i + 1)) : elbow(X(i) + w, Y(i) + h / 2, 8.85, Y(i + 1)), C.br[i]]), 3.5);
        for (const [i, st] of d.steps.entries()) {
          const x = X(i), y = Y(i);
          node(s, x, y, w, h, C.br[i]);
          num(s, i + 1, x + 0.14, y + h / 2 - 0.22, 0.44, C.core);
          head(s, st.h, x + 0.72, y + 0.05, 2.2, h - 0.1, { max: 14 });
          body(s, st.t, x + 3.0, y + 0.05, w - 3.15, h - 0.1, { valign: 'middle', color: C.ink });
        }
      },
      async (d) => { // night map: a stem up the middle, steps leaf out to both sides
        const s = nightPage(d), n = d.steps.length, h = 1.25, w = 4.1, dy = (3.84 - h) / (n - 1), Y = (i) => 1.26 + i * dy;
        t.rect(s, 4.97, 1.26, 0.06, 3.84, C.white, { name: 'Stem' });
        await flow(s, d.steps.map((_, i) => [i % 2 ? down(5, Y(i) + 0.3, 5.5, Y(i) + 0.62) : down(5, Y(i) + 0.3, 4.5, Y(i) + 0.62), C.br[i]]));
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.4 : 0.5, y = Y(i);
          t.rect(s, x, y, w, h, NIGHT, { r: 0.14, line: { color: C.br[i], width: 1.5 }, name: 'Leaf' });
          num(s, i + 1, 4.8, y + 0.02, 0.4, C.br[i], C.core);
          head(s, st.h, x + 0.16, y + 0.06, w - 0.32, 0.36, { color: C.white, max: 14 });
          body(s, st.t, x + 0.16, y + 0.44, w - 0.32, h - 0.5, { color: MIST });
        }
      },
    ],
    stats: [
      async (d) => { // one figure is the central idea, the others grow from it
        const s = page(d), [a, b, c] = d.stats, h = d.note ? 1.15 : 1.8, gap = 0.12;
        await curves(s, [[4.4, 3.2, 5.3, 1.3 + h / 2, C.br[1]], [4.4, 3.2, 5.3, 1.3 + h + gap + h / 2, C.br[2]]], 3.5);
        t.rect(s, 0.5, 1.3, 4.0, 3.8, C.core, { r: 0.25, name: 'Central idea' });
        t.text(s, a.value, { x: 0.7, y: 1.55, w: 3.6, h: 1.6, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.6, 1.5, 66, 24, F.head, true) });
        body(s, a.label, 0.8, 3.25, 3.4, 1.5, { color: MIST, align: 'center', max: 15 });
        [b, c].forEach((x, i) => {
          const y = 1.3 + i * (h + gap), col = C.br[i + 1];
          node(s, 5.3, y, 4.2, h, col);
          t.text(s, x.value, { x: 5.42, y, w: 1.75, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.7, 0.8, 30, 14, F.head, true) });
          body(s, x.label, 7.25, y + 0.06, 2.15, h - 0.12, { valign: 'middle', max: 12 });
        });
        if (d.note) body(s, d.note, 5.3, 3.86, 4.2, 1.24, { max: 11, valign: 'middle', color: C.ink });
      },
      async (d) => { // night map: three bubbles strung on a thread
        const s = nightPage(d), D = 1.72, xs = [1.0, 4.14, 7.28], ys = [1.25, 1.62, 1.25];
        await curves(s, [[xs[0] + D - 0.1, ys[0] + D / 2, xs[1] + 0.1, ys[1] + D / 2, C.br[0]], [xs[1] + D - 0.1, ys[1] + D / 2, xs[2] + 0.1, ys[2] + D / 2, C.br[2]]], 3);
        d.stats.forEach((x, i) => {
          t.oval(s, xs[i], ys[i], D, D, NIGHT, { line: { color: C.br[[0, 1, 2][i]], width: 3 } });
          t.text(s, x.value, { x: xs[i] + 0.12, y: ys[i], w: D - 0.24, h: D, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(x.value, D - 0.3, 0.8, 30, 13, F.head, true) });
          body(s, x.label, xs[i] - 0.45, ys[i] + D + 0.04, D + 0.9, 0.62, { color: MIST, align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 0.5, 4.12, 9, 1.0, { color: C.white, max: 12, align: 'center', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // one root, two wings: the sides mirror each other
        const s = page(d), w = 3.55, top = 1.92, avail = 3.18, cy = 3.48;
        const col = [C.br[0], C.br[3]], lay = [d.left, d.right].map((sd) => { const rh = avail / sd.items.length; return sd.items.map((_, k) => top + k * rh + rh / 2); });
        await curves(s, [...lay[0].map((y) => [5, cy, 0.5 + w, y, col[0]]), ...lay[1].map((y) => [5, cy, 9.5 - w, y, col[1]])], 3);
        t.oval(s, 4.62, cy - 0.38, 0.76, 0.76, C.core);
        t.text(s, '⇄', { x: 4.62, y: cy - 0.38, w: 0.76, h: 0.76, fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle' });
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 9.5 - w : 0.5, rh = avail / side.items.length, a = i ? 'left' : 'right';
          t.rect(s, x, 1.28, w, 0.54, C.core, { r: 0.2, name: 'Wing head' });
          head(s, side.h, x + 0.18, 1.28, w - 0.36, 0.54, { color: C.white, align: a, max: 15 });
          side.items.forEach((it, k) => {
            const y = top + k * rh;
            node(s, x, y + 0.04, w, rh - 0.08, col[i]);
            body(s, it, x + 0.14, y + 0.07, w - 0.28, rh - 0.14, { color: C.ink, align: a, valign: 'middle', max: 13 });
          });
        }
      },
      async (d) => { // two boughs, one above the other, ideas strung along each
        const s = page(d), h = 1.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.2), col = C.br[i ? 2 : 4], n = side.items.length, x0 = 3.0, cw = 6.5 / n;
          t.line(s, 2.4, y + h / 2, 7, 0, col, 3);
          t.rect(s, 0.5, y, 2.25, h, C.core, { r: 0.2, name: 'Bough head' });
          head(s, side.h, 0.65, y + 0.08, 1.95, h - 0.16, { color: C.white, align: 'center', max: 16 });
          side.items.forEach((it, k) => {
            node(s, x0 + k * cw, y, cw - 0.12, h, col);
            body(s, it, x0 + k * cw + 0.1, y + 0.06, cw - 0.32, h - 0.12, { color: C.ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // night map: the thought stands alone, a side branch carries the note
        const s = nightPage(d), w = d.caption ? 5.5 : 9;
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.3, w, h: 3.75, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, w, 3.6, 36, 17, F.head, true) });
        if (d.caption) {
          await curves(s, [[6.05, 3.2, 6.65, 1.9, C.br[1]], [6.05, 3.2, 6.65, 3.2, C.br[2]], [6.05, 3.2, 6.65, 4.5, C.br[0]]], 3);
          t.rect(s, 6.65, 1.35, 2.85, 3.65, NIGHT, { r: 0.18, line: { color: C.br[1], width: 1.5 }, name: 'Leaf' });
          body(s, d.caption, 6.82, 1.45, 2.52, 3.45, { color: MIST, valign: 'middle', max: 14 });
        }
      },
      async (d) => { // a seed on the left, the thought and its note as two shoots
        const s = page(d), h = d.caption ? 2.25 : 3.8;
        await curves(s, [[1.5, 3.2, 2.5, 1.3 + h / 2, C.br[4]], ...(d.caption ? [[1.5, 3.2, 2.5, 4.35, C.br[2]]] : [])], 4);
        t.oval(s, 0.5, 2.55, 1.3, 1.3, C.core);
        t.img(s, await L.icon('FiZap', C.white, 2), 0.87, 2.92, 0.56, 0.56);
        t.rect(s, 2.5, 1.3, 7, h, C.white, { r: 0.22, line: { color: C.br[4], width: 4 }, name: 'Thought' });
        t.text(s, L.runs(d.text), { x: 2.8, y: 1.38, w: 6.4, h: h - 0.16, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 6.4, h - 0.2, 30, 15, F.head, true) });
        if (d.caption) { node(s, 2.5, 3.72, 7, 1.38, C.br[2]); body(s, d.caption, 2.72, 3.78, 6.56, 1.26, { valign: 'middle', max: 14 }); }
      },
    ],
    timeline: [
      async (d) => { // a time thread across the page, events leaf off above and below it
        const s = page(d), cy = 3.2, w = 2.75, X = (i) => 0.5 + i * 2.083;
        const wave = `M50,${P(cy)} ` + Array.from({ length: 9 }, (_, k) => `Q${50 + k * 100 + 50},${P(cy) + (k % 2 ? 9 : -9)} ${50 + (k + 1) * 100},${P(cy)}`).join(' ');
        await flow(s, [[wave, C.core]], 2.5);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = X(i), h = 1.68, y = up ? cy - 0.24 - h : cy + 0.24, col = C.br[i];
          t.line(s, x + 0.4, up ? y + h : cy, 0, 0.24, col, 2.5);
          t.oval(s, x + 0.3, cy - 0.1, 0.2, 0.2, col, { line: { color: C.white, width: 1.5 } });
          node(s, x, y, w, h, col);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.05, w: w - 0.28, h: 0.36, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(it.year, w - 0.28, 0.34, 18, 11, F.head, true) });
          head(s, it.h, x + 0.14, y + 0.4, w - 0.28, 0.3, { max: 13, color: C.muted });
          body(s, it.t, x + 0.14, y + 0.72, w - 0.28, h - 0.78, { color: C.ink, max: 12 });
        }
      },
      async (d) => { // a half-circle idea on the page edge, the years sit round its rim
        const s = page(d), cy = 3.2, R0 = 2.15, rh = 0.95, Y = (i) => 1.3 + i * rh, X = (i) => Math.sqrt((R0 + 0.12) ** 2 - (Y(i) + rh / 2 - cy) ** 2);
        t.oval(s, -R0, cy - R0 + 0.02, R0 * 2, R0 * 2 - 0.04, C.core);
        t.img(s, await L.icon('FiClock', C.white, 2), 0.3, cy - 0.4, 0.8, 0.8);
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i), col = C.br[i];
          t.rect(s, x, y + 0.2, 1.15, 0.5, C.white, { r: 0.2, line: { color: col, width: 2.5 }, name: 'Year' });
          t.text(s, it.year, { x: x + 0.04, y: y + 0.2, w: 1.07, h: 0.5, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.0, 0.44, 16, 9, F.head, true) });
          const tx = x + 1.3, tw = 9.5 - tx;
          head(s, it.h, tx, y + 0.02, tw, 0.28, { max: 14 });
          body(s, it.t, tx, y + 0.31, tw, rh - 0.36, { max: 12 });
        }
      },
      async (d) => { // night map: an idea growing up a rising branch
        const s = nightPage(d), cw = 2.25, w = cw - 0.14, h = 2.32, X = (i) => 0.5 + i * cw, Y = (i) => 2.72 - i * 0.48;
        await curves(s, d.items.slice(1).map((_, i) => [X(i) + 0.86, Y(i) + 0.3, X(i + 1), Y(i + 1) + 0.3, C.br[i]]), 3);
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i);
          t.rect(s, x, y, 0.92, 0.6, C.br[i], { r: 0.16, name: 'Year' });
          t.text(s, it.year, { x: x + 0.03, y, w: 0.86, h: 0.6, bold: true, color: C.core, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 0.8, 0.54, 15, 8, F.head, true) });
          head(s, it.h, x, y + 0.66, w, 0.42, { color: C.white, max: 13 });
          body(s, it.t, x, y + 1.08, w, 5.12 - (y + 1.08), { color: MIST, max: 12 });
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline columns looked like the process columns
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Aql xaritasi', colors: { dk1: C.ink, lt1: C.white, dk2: C.core, lt2: C.bg, accent1: C.br[0], accent2: C.br[1], accent3: C.br[2], accent4: C.br[3], accent5: C.br[4], accent6: C.br[5], hlink: C.br[0], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tizimli fikrlash: markaziy g'oya va unga bog'langan tarmoqlar, kalit so'zlar bilan aniq", limits: {}, prefer: null };
module.exports = { id: 57, slug: 'aql-xaritasi', name: 'Aql xaritasi', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "elegant"], "transitions": ["morph", "fade", "p14:ripple"], "cover": ["focusIn", "popOver"], "mark": "popOver", "deco": "stretch", "sig": {"title": "focusIn", "body": "fade", "item": ["curveUp", "curveDown"], "image": "popOver", "number": "popOver", "order": "centerOut", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
