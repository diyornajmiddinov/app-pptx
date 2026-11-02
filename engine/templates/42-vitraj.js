/**
 * 42 Vitraj — stained glass: jewel-toned glass cells held by black lead lines, cream
 * "clear glass" panes for text, numbers in coloured glass roundels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { lead: '1A1A1A', pane: 'F6EFDD', ink: '231F1A', muted: '6B6253', glass: ['B5172F', '1F4FA3', '1E8C5A', 'E3A21A', '6B3FA0', '1B8A8F'] };
const F = { head: 'Cambria', body: 'Calibri' };

const glassSvg = (w, h, cell, seed, palette = C.glass) => {
  let x0 = seed; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, P = [];
  for (let j = 0; j <= rows; j++) { P[j] = []; for (let i = 0; i <= cols; i++) { const edge = i === 0 || j === 0 || i === cols || j === rows; P[j][i] = [i * cell + (edge ? 0 : (rnd() - 0.5) * cell * 0.7), j * cell + (edge ? 0 : (rnd() - 0.5) * cell * 0.7)]; } }
  let g = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i], tri = (i + j) % 2 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]];
    for (const q of tri) g += `<polygon points="${q.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="#${palette[Math.floor(rnd() * palette.length)]}" fill-opacity="${(0.72 + rnd() * 0.25).toFixed(2)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#F3E3B8"/><g stroke="#${C.lead}" stroke-width="7" stroke-linejoin="round">${g}</g><rect width="${w}" height="${h}" fill="none" stroke="#${C.lead}" stroke-width="14"/></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const full = await L.svg(glassSvg(1600, 900, 120, 7), 1600, 900, true);
  const band = await L.svg(glassSvg(80, 900, 55, 3), 80, 900);
  const memo = {}; const strip = async (w, k) => (memo[w + ':' + k] ??= await L.svg(glassSvg(Math.round(w * 100), 50, 40, 11 + k, [C.glass[k % 6], C.glass[(k + 1) % 6]]), w * 100, 50));
  const pane = (s, x, y, w, h, fill = C.pane) => t.rect(s, x, y, w, h, fill, { line: { color: C.lead, width: 4.5 }, name: 'Pane' });
  const roundel = (s, x, y, d, k, txt, fs) => {
    t.oval(s, x, y, d, d, C.glass[k % 6], { line: { color: C.lead, width: 3.5 } });
    t.oval(s, x + d * 0.18, y + d * 0.12, d * 0.3, d * 0.18, 'FFFFFF', { t: 65 }); // highlight on the glass
    if (txt !== undefined) t.text(s, String(txt), { x, y, w: d, h: d, fontFace: F.head, fontSize: fs || Math.round(d * 26), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
  };
  const leaded = async (s, src, x, y, w, h) => { t.rect(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, C.lead, { name: 'Lead frame' }); t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.75, y: 5.25, w: 8.7, h: 0.25, fontSize: 8.5, color: C.muted, align: 'right' });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.pane }; idx++;
    t.img(s, band, 0, 0, 0.42, H);
    roundel(s, 0.75, 0.38, 0.6, idx, idx, 15);
    if (d.title) t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.6, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.6, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: full }; idx++;
    pane(s, 0.6, 0.6, d.image ? 5.5 : 8.8, 4.25);
    if (d.image) { pane(s, 6.4, 0.6, 3.0, 4.25, C.lead); t.img(s, await L.photo(L.src(d.image), 2.8, 4.05), 6.5, 0.7, 2.8, 4.05, { alt: '' }); }
    const tw = d.image ? 4.8 : 8.0;
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.95, y: 0.85, w: tw, h: 0.3, fontSize: 12, bold: true, color: C.glass[0] });
    t.text(s, d.title, { x: 0.95, y: 1.2, w: tw, h: 2.1, fontFace: F.head, bold: true, fontSize: L.fit(d.title, tw, 2.0, 40, 22, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.95, y: 3.4, w: tw, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.95, y: 4.2, w: tw, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.glass[1] });
    t.rect(s, 0, 5.12, W, 0.505, C.lead, { name: 'Lead strip' });
    t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.12, w: 8.8, h: 0.505, fontSize: 9, color: 'E8DFC8', valign: 'middle' });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await leaded(s, d.image, 0.85, 1.45, 3.9, 3.4); para(s, d.text, 5.1, 1.4, 4.35, 3.5); },
    async image(d) { const s = page(d); para(s, d.text, 0.8, 1.4, 4.2, 3.5); await leaded(s, d.image, 5.35, 1.45, 4.05, 3.4); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.85 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        roundel(s, x, y, 0.62, i, i + 1, 16);
        t.text(s, it, { x: x + 0.8, y, w: 3.4, h: 0.62, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.6 - gap * (n - 1)) / n;
      const h = Math.min(3.5, 1.95 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.85 + i * (w + gap);
        pane(s, x, 1.45, w, h, 'FFFDF6');
        t.img(s, await strip(w, i), x, 1.45, w, 0.3);
        t.rect(s, x, 1.45, w, 0.3, null, { line: { color: C.lead, width: 4.5 }, name: 'Lead' });
        roundel(s, x + 0.2, 1.92, 0.5, i);
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2.5), x + 0.33, 2.05, 0.24, 0.24);
        t.text(s, it.h, { x: x + 0.2, y: 2.5, w: w - 0.4, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.2, y: 2.95, w: w - 0.4, h: h - 1.6, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.6 / n;
      t.line(s, 0.85 + 0.4, 1.85, cw * (n - 1), 0, C.lead, 4);
      d.steps.forEach((st, i) => {
        const x = 0.85 + i * cw;
        roundel(s, x, 1.45, 0.8, i, i + 1, 20);
        t.text(s, st.h, { x, y: 2.45, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 15, 11, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.6 / n, dd = Math.min(1.9, cw - 0.6);
      d.stats.forEach((x, i) => {
        const cx = 0.85 + i * cw + cw / 2;
        roundel(s, cx - dd / 2, 1.4, dd, i * 2);
        t.text(s, x.value, { x: cx - dd / 2 + 0.15, y: 1.4, w: dd - 0.3, h: dd, fontFace: F.head, fontSize: L.fit(x.value, dd - 0.45, 0.8, 38, 16, F.head, true), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.55 + dd, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.85, y: 4.6, w: 8.6, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.3);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.85 + i * (w + 0.3);
        pane(s, x, 1.45, w, 3.45, 'FFFDF6');
        t.img(s, await strip(w, i ? 1 : 0), x, 1.45, w, 0.3);
        t.rect(s, x, 1.45, w, 0.3, null, { line: { color: C.lead, width: 4.5 }, name: 'Lead' });
        t.text(s, side.h, { x: x + 0.2, y: 1.75, w: w - 0.4, h: 0.45, fontFace: F.head, fontSize: 17, bold: true, color: C.glass[i ? 1 : 0], valign: 'middle' });
        let y = 2.3;
        side.items.forEach((it, k) => { roundel(s, x + 0.25, y + 0.04, 0.22, i ? 1 : 0); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = pres.addSlide(); s.background = { data: full }; idx++;
      pane(s, 1.0, 1.0, 8.0, 3.4);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.2, w: 7.2, h: 1.9, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 7.2, 1.8, 34, 18, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.4, y: 3.15, w: 7.2, h: 1.1, fontSize: L.fit(d.caption, 7.2, 1.1, 14, 10, F.body), color: C.muted, align: 'center' });
      t.rect(s, 0, 5.12, W, 0.505, C.lead, { name: 'Lead strip' });
      t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.12, w: 8.8, h: 0.505, fontSize: 9, color: 'E8DFC8', valign: 'middle' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.6 / n;
      t.line(s, 0.85, 2.3, 8.6, 0, C.lead, 4);
      d.items.forEach((it, i) => {
        const x = 0.85 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.55, 24, 12, F.head, true), bold: true, color: C.glass[i % 6], valign: 'bottom' });
        t.shape(s, 'DIAMOND', { x, y: 2.1, w: 0.4, h: 0.4, fill: { color: C.glass[i % 6] }, line: { color: C.lead, width: 3 }, objectName: 'Glass' });
        t.text(s, it.h, { x, y: 2.7, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.15, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: full }; idx++;
      pane(s, 1.0, 0.9, 8.0, 3.7);
      t.text(s, '\u201C', { x: 1.3, y: 0.95, w: 1.0, h: 1.1, fontFace: F.head, fontSize: 80, bold: true, color: C.glass[0] });
      t.text(s, d.text, { x: 1.6, y: 1.5, w: 6.8, h: 2.2, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 6.8, 2.1, 30, 16, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.6, y: 3.8, w: 6.8, h: 0.4, fontSize: 14, bold: true, color: C.glass[1], align: 'center' });
      t.rect(s, 0, 5.12, W, 0.505, C.lead, { name: 'Lead strip' });
      t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.12, w: 8.8, h: 0.505, fontSize: 9, color: 'E8DFC8', valign: 'middle' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.rect(s, 0.85, y + (rh - 0.32) / 2, 0.32, 0.32, C.glass[i % 6], { line: { color: C.lead, width: 2.5 }, name: 'Glass' });
        t.text(s, it, { x: 1.35, y, w: 8.1, h: rh, fontSize: L.fit(it, 8.1, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Vitraj', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.lead, lt2: C.pane, accent1: C.glass[0], accent2: C.glass[1], accent3: C.glass[2], accent4: C.glass[3], accent5: C.glass[4], accent6: C.glass[5], hlink: C.glass[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tantanali va yorqin: har bir fikr alohida 'oyna' kabi aniq ajratilgan, qisqa va obrazli", limits: {}, prefer: null };
module.exports = { id: 42, slug: 'vitraj', name: 'Vitraj', category: 'creative', photos: true, build, style: STYLE };
