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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Aql xaritasi', colors: { dk1: C.ink, lt1: C.white, dk2: C.core, lt2: C.bg, accent1: C.br[0], accent2: C.br[1], accent3: C.br[2], accent4: C.br[3], accent5: C.br[4], accent6: C.br[5], hlink: C.br[0], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tizimli fikrlash: markaziy g'oya va unga bog'langan tarmoqlar, kalit so'zlar bilan aniq", limits: {}, prefer: null };
module.exports = { id: 57, slug: 'aql-xaritasi', name: 'Aql xaritasi', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "elegant"], "transitions": ["morph", "fade", "p14:ripple"], "cover": ["focusIn", "popOver"], "mark": "popOver", "deco": "stretch", "sig": {"title": "focusIn", "body": "fade", "item": ["curveUp", "curveDown"], "image": "popOver", "number": "popOver", "order": "centerOut", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
