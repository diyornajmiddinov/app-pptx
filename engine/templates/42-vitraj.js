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
    if (txt !== undefined) t.text(s, String(txt), { x, y, w: d, h: d, fontFace: F.head, fontSize: fs || Math.round(d * 26), bold: true, color: k % 6 === 3 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
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
        t.img(s, await L.icon(it.icon, i % 6 === 3 ? C.ink : 'FFFFFF', 2.5), x + 0.33, 2.05, 0.24, 0.24);
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
  // ---- further ways to draw a type, in glass and lead: a deck's pages must not look alike (L.pages)
  const X0 = 0.85, X1 = 9.45, FW = X1 - X0, Y1 = 5.12, G = C.glass, WHITE = 'FFFFFF', DEEP = [G[0], G[1], G[2], G[4]], CLEAR = 'FFFDF6';
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const glass = (w, h, k) => svgG(`g${w}${h}${k}`, () => glassSvg(Math.round(w * 100), Math.round(h * 100), 44, 5 + k, [G[k % 6], G[(k + 1) % 6], G[(k + 2) % 6]]), w * 100, h * 100);
  const memo2 = {}; const svgG = async (key, fn, w, h) => (memo2[key] ??= await L.svg(fn(), w, h));
  const ARCH = 'M0,1 L0,0.3 A0.5,0.3 0 0 1 1,0.3 L1,1 Z', FAN = 'M0,1 A0.5,1 0 0 1 1,1 Z';
  const archLine = (w, h, fill = 'none') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M4,${h - 4} L4,${h * 0.3} A${w / 2 - 4},${h * 0.3 - 4} 0 0 1 ${w - 4},${h * 0.3} L${w - 4},${h - 4} Z" fill="${fill}" stroke="#${C.lead}" stroke-width="8"/></svg>`;
  const fanLine = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M4,${h - 3} A${w / 2 - 4},${h - 6} 0 0 1 ${w - 4},${h - 3} Z" fill="none" stroke="#${C.lead}" stroke-width="8"/>${[0.25, 0.5, 0.75].map((f) => `<line x1="${w / 2}" y1="${h}" x2="${w * f}" y2="${f === 0.5 ? 0 : h * 0.16}" stroke="#${C.lead}" stroke-width="5"/>`).join('')}</svg>`;
  const ringGlass = (D, k) => { let g = ''; const n = 24, R0 = D / 2 - 5, R1 = D * 0.36; for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n, b = ((i + 1) * 2 * Math.PI) / n, p = (r, q) => `${(D / 2 + r * Math.cos(q)).toFixed(1)},${(D / 2 + r * Math.sin(q)).toFixed(1)}`; g += `<polygon points="${p(R1, a)} ${p(R0, a)} ${p(R0, b)} ${p(R1, b)}" fill="#${G[(i + k) % 6]}" stroke="#${C.lead}" stroke-width="5"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}">${g}</svg>`; };
  const leadStrip = (s) => { t.rect(s, 0, 5.12, W, 0.505, C.lead, { name: 'Lead strip' }); t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.12, w: 8.8, h: 0.505, fontSize: 9, color: 'E8DFC8', valign: 'middle' }); };
  const V = {
    image: [
      async (d) => { // a fanlight over a door: the picture in a half round, the words on the pane under it
        const s = page(d), w = 7.0, h = 2.0, x = 1.65, y = 1.08;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { path: FAN } }), x, y, w, h, { alt: d.title });
        t.img(s, await L.svg(fanLine(700, 200), 700, 200), x, y, w, h);
        pane(s, X0, 3.14, FW, 1.98, CLEAR);
        para(s, d.text, X0 + 0.22, 3.2, FW - 0.44, 1.86);
      },
      async (d) => { // three lancets, one picture across their arches, the words at their side
        const s = page(d), w = 1.56, h = 3.8, g = 0.12, x0 = 4.65, y = 1.26;
        for (const [i, pos] of ['left', 'centre', 'right'].entries()) {
          const x = x0 + i * (w + g);
          t.img(s, await L.photo(L.src(d.image), w, h, { mask: { path: ARCH }, position: pos }), x, y, w, h, { alt: i ? '' : d.title });
          t.img(s, await svgG('lanc', () => archLine(156, 380), 156, 380), x, y, w, h);
        }
        para(s, d.text, X0, 1.28, 3.55, 3.76);
      },
      async (d) => { // the rose window: a wheel of glass, the picture at its hub
        const s = page(d), D = 3.84, x = 0.72, y = 1.22, hub = D * 0.72 + 0.04;
        t.img(s, await svgG('rose', () => ringGlass(384, 0), 384, 384), x, y, D, D);
        t.oval(s, x + D / 2 - hub / 2 - 0.02, y + D / 2 - hub / 2 - 0.02, hub + 0.04, hub + 0.04, C.lead);
        t.img(s, await L.photo(L.src(d.image), hub - 0.06, hub - 0.06, { mask: 'circle' }), x + D / 2 - hub / 2 + 0.03, y + D / 2 - hub / 2 + 0.03, hub - 0.06, hub - 0.06, { alt: d.title });
        pane(s, 4.78, 1.3, 4.67, 3.7, CLEAR);
        para(s, d.text, 5.0, 1.38, 4.23, 3.54);
      },
      async (d) => { // the whole page is the window: clear panes set into the coloured glass
        const s = pres.addSlide(); s.background = { data: full }; idx++;
        pane(s, 0.45, 0.42, 4.75, 4.42);
        roundel(s, 0.68, 0.6, 0.56, idx, idx, 14);
        head(s, d.title, 1.36, 0.58, 3.65, 0.62, { max: 18 });
        para(s, d.text, 0.72, 1.3, 4.22, 3.4);
        pane(s, 5.42, 0.42, 4.14, 4.42, C.lead);
        t.img(s, await L.photo(L.src(d.image), 3.96, 4.24), 5.51, 0.51, 3.96, 4.24, { alt: d.title });
        leadStrip(s);
      },
    ],
    cards: [
      async (d) => { // long panes: a block of one colour of glass at the head of each, icon in it
        const s = page(d), n = d.items.length, g = 0.1, h = (3.8 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.3 + i * (h + g);
          pane(s, X0, y, FW, h, CLEAR);
          t.rect(s, X0, y, 1.1, h, DEEP[i], { line: { color: C.lead, width: 4.5 }, name: 'Glass' });
          t.img(s, await L.icon(it.icon, WHITE, 2.5), X0 + 0.37, y + h / 2 - 0.18, 0.36, 0.36);
          head(s, it.h, X0 + 1.26, y + 0.06, FW - 1.42, 0.32);
          body(s, it.t, X0 + 1.26, y + 0.38, FW - 1.42, h - 0.44, { max: 13.5 });
        }
      },
      async (d) => { // gothic arches side by side, set at two heights, the words on clear glass
        const s = page(d), n = d.items.length, g = 0.14, w = (FW - g * (n - 1)) / n, h = 3.52;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.22 + (i % 2 ? 0.34 : 0);
          t.img(s, await svgG(`ar${n}`, () => archLine(Math.round(w * 100), Math.round(h * 100), `#${CLEAR}`), w * 100, h * 100), x, y, w, h);
          const r = 0.62;
          roundel(s, x + w / 2 - r / 2, y + 0.28, r, DEEP[i] === G[4] ? 4 : [0, 1, 2][i]);
          t.img(s, await L.icon(it.icon, WHITE, 2.5), x + w / 2 - 0.15, y + 0.44, 0.3, 0.3);
          head(s, it.h, x + 0.14, y + 1.0, w - 0.28, 0.5, { align: 'center', max: 14 });
          body(s, it.t, x + 0.14, y + 1.52, w - 0.28, h - 1.64, { align: 'center', max: 13.5 });
        }
      },
      async (d) => { // the wheel: a roundel at the hub, heavy leads out to a pane for each idea
        const s = page(d), n = d.items.length, cx = 5.15, cy = 3.2, w = 3.3, left = 2, right = n - left, hL = 1.9, hR = 3.8 / right, D = 1.06;
        const spot = (i) => (i < left ? [X0, 1.3 + i * hL, hL - 0.14] : [X1 - w, 1.3 + (i - left) * hR, hR - 0.14]);
        d.items.forEach((_, i) => { const [x, y, h] = spot(i), tall = h > 2, my = tall ? cy : y + h / 2, ex = i < left ? x + w : x, up = my < cy; t.line(s, Math.min(ex, cx), Math.min(my, cy), Math.abs(cx - ex), Math.abs(my - cy), C.lead, 4, { flipV: (ex < cx) !== up }); });
        roundel(s, cx - D / 2, cy - D / 2, D, 0, '✦', 24);
        for (const [i, it] of d.items.entries()) {
          const [x, y, h] = spot(i), tall = h > 2, hh = tall ? 1.76 : h, top = tall ? cy - hh / 2 : y;
          pane(s, x, top, w, hh, CLEAR);
          t.img(s, await L.icon(it.icon, DEEP[i], 2.25), x + 0.14, top + 0.12, 0.28, 0.28);
          head(s, it.h, x + 0.5, top + 0.08, w - 0.62, 0.36, { max: 13 });
          body(s, it.t, x + 0.14, top + 0.46, w - 0.28, hh - 0.54, { max: 13 });
        }
      },
      async (d) => { // one great pane of blue glass, the smaller clear panes beside it
        const s = page(d), [a, ...rest] = d.items, g = 0.1, h = (3.8 - g * (rest.length - 1)) / rest.length;
        t.rect(s, X0, 1.3, 4.2, 3.8, G[1], { line: { color: C.lead, width: 4.5 }, name: 'Blue glass' });
        t.oval(s, X0 + 0.24, 1.54, 0.86, 0.86, CLEAR, { line: { color: C.lead, width: 3.5 } });
        t.img(s, await L.icon(a.icon, G[1], 2.5), X0 + 0.48, 1.78, 0.38, 0.38);
        head(s, a.h, X0 + 1.26, 1.54, 2.78, 0.86, { color: WHITE, max: 19 });
        body(s, a.t, X0 + 0.26, 2.56, 3.68, 2.4, { color: WHITE, max: 16 });
        for (const [i, it] of rest.entries()) {
          const y = 1.3 + i * (h + g);
          pane(s, 5.2, y, 4.25, h, CLEAR);
          t.img(s, await L.icon(it.icon, DEEP[(i + 2) % 4], 2.25), 5.34, y + 0.12, 0.28, 0.28);
          head(s, it.h, 5.7, y + 0.08, 3.62, 0.36, { max: 14 });
          body(s, it.t, 5.34, y + 0.46, 3.98, h - 0.54, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a lead bar down the middle: a glass roundel at each joint, steps left and right
        const s = page(d), n = d.steps.length, y0 = 1.26, h = 3.84 / n, cx = 5.15, B = 0.52;
        t.rect(s, cx - 0.04, y0 + h / 2, 0.08, h * (n - 1), C.lead, { name: 'Lead' });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.55, w = 3.9, al = left ? 'right' : 'left';
          roundel(s, cx - B / 2, y + h / 2 - B / 2, B, i, i + 1, 14);
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        });
      },
      async (d) => { // clear panes stepping down, a roundel leaded onto the corner of each
        const s = page(d), n = d.steps.length, g = 0.1, h = (3.82 - g * (n - 1)) / n, w = n === 3 ? 7.0 : 6.7, dx = (FW - w) / (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * dx, y = 1.28 + i * (h + g), B = Math.min(0.66, h - 0.16);
          pane(s, x, y, w, h, CLEAR);
          roundel(s, x + 0.12, y + (h - B) / 2, B, i, i + 1, 16);
          head(s, st.h, x + B + 0.26, y + 0.05, w - B - 0.4, 0.3, { max: 14 });
          body(s, st.t, x + B + 0.26, y + 0.35, w - B - 0.4, h - 0.41, { max: 13 });
        });
      },
      async (d) => { // tall lights of deep colour, side by side, rising to the right
        const s = page(d), n = d.steps.length, g = 0.08, w = (FW - g * (n - 1)) / n, drop = n === 3 ? 0.4 : 0.28;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g), y = 1.28 + (n - 1 - i) * drop, h = Y1 - y;
          t.rect(s, x, y, w, h, DEEP[i], { line: { color: C.lead, width: 4.5 }, name: 'Glass light' });
          t.text(s, String(i + 1), { x: x + 0.14, y: y + 0.06, w: 0.6, h: 0.6, fontFace: F.head, bold: true, fontSize: 30, color: WHITE, valign: 'middle' });
          head(s, st.h, x + 0.14, y + 0.66, w - 0.28, 0.5, { color: WHITE, max: 14, valign: 'top' });
          body(s, st.t, x + 0.14, y + 1.18, w - 0.28, h - 1.26, { color: WHITE, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one great roundel; two smaller to its right
        const s = page(d), [a, ...rest] = d.stats, D = 2.5, D2 = 1.14;
        roundel(s, X0, 1.28, D, 1);
        t.text(s, a.value, { x: X0 + 0.25, y: 1.28, w: D - 0.5, h: D, fontFace: F.head, bold: true, fontSize: L.fit(a.value, D - 0.5, 1.0, 44, 22, F.head, true), color: WHITE, align: 'center', valign: 'middle' });
        body(s, a.label, X0 + D + 0.16, 1.5, 1.72, 2.05, { max: 14, valign: 'middle' });
        rest.forEach((q, i) => {
          const y = 1.28 + i * 1.28;
          roundel(s, 5.45, y, D2, i ? 2 : 0);
          t.text(s, q.value, { x: 5.55, y, w: D2 - 0.2, h: D2, fontFace: F.head, bold: true, fontSize: L.fit(q.value, D2 - 0.22, 0.6, 22, 12, F.head, true), color: WHITE, align: 'center', valign: 'middle' });
          body(s, q.label, 6.72, y + 0.02, 2.73, D2 - 0.04, { max: 14, valign: 'middle' });
        });
        if (d.note) { pane(s, X0, 3.98, FW, 1.14, CLEAR); body(s, d.note, X0 + 0.18, 4.04, FW - 0.36, 1.02, { max: 13.5, valign: 'middle' }); }
      },
      async (d) => { // three long leaded bars: colour holds the figure, clear glass the words
        const s = page(d), h = 0.84, g = 0.08;
        d.stats.forEach((q, i) => {
          const y = 1.28 + i * (h + g);
          pane(s, X0, y, FW, h, CLEAR);
          t.rect(s, X0, y, 2.9, h, [G[1], G[0], G[2]][i], { line: { color: C.lead, width: 4.5 }, name: 'Glass' });
          t.text(s, q.value, { x: X0 + 0.1, y, w: 2.7, h, fontFace: F.head, bold: true, fontSize: L.fit(q.value, 2.7, h - 0.14, 30, 16, F.head, true), color: WHITE, align: 'center', valign: 'middle' });
          body(s, q.label, X0 + 3.08, y + 0.05, FW - 3.24, h - 0.1, { max: 15, valign: 'middle' });
        });
        if (d.note) body(s, d.note, X0, 4.1, FW, 1.0, { max: 13.5, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two clear panes mirrored about a tall strip of coloured glass
        const s = page(d), w = 3.5, y0 = 1.9, avail = 3.1, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        pane(s, X0, 1.26, 3.82, 3.86, CLEAR); pane(s, X1 - 3.82, 1.26, 3.82, 3.86, CLEAR);
        t.img(s, await glass(0.96, 3.86, 2), 4.67, 1.26, 0.96, 3.86);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.8 : 1.0, al = i ? 'left' : 'right';
          head(s, side.h, x, 1.34, w, 0.5, { color: G[i ? 1 : 0], align: al, max: 17 });
          let y = y0;
          fit.rows.forEach((rh0, k) => { const rh = rh0 + extra; if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.ink, align: al, valign: 'middle' }); y += rh; });
        });
      },
      async (d) => { // two transoms one over the other: a colour block names each, clear glass carries the items
        const s = page(d), bh = 1.84, g = 0.12;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.28 + i * (bh + g), n = side.items.length, x0 = 3.15, cw = (X1 - 0.1 - x0) / n;
          pane(s, X0, y, FW, bh, CLEAR);
          t.rect(s, X0, y, 2.14, bh, G[i ? 1 : 0], { line: { color: C.lead, width: 4.5 }, name: 'Glass' });
          head(s, side.h, X0 + 0.14, y + 0.1, 1.86, bh - 0.2, { color: WHITE, max: 16 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.08, y, 0, bh, C.lead, 2);
            body(s, it, x0 + k * cw, y + 0.1, cw - 0.18, bh - 0.2, { valign: 'middle', max: 13.5 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the great rose: the sentence at the hub of a wheel, the note on a low pane at its side
        const s = page(d), D = 3.9, x = 5.55, y = 1.2, hub = D * 0.72 + 0.02;
        t.img(s, await svgG('roseS', () => ringGlass(390, 2), 390, 390), x, y, D, D);
        t.oval(s, x + D / 2 - hub / 2, y + D / 2 - hub / 2, hub, hub, C.pane, { line: { color: C.lead, width: 3.5 } });
        const tw = hub * 0.8, th = hub * 0.72;
        t.text(s, L.runs(d.text), { x: x + D / 2 - tw / 2, y: y + D / 2 - th / 2, w: tw, h: th, fontFace: F.head, bold: true, fontSize: L.fit(d.text, tw, th, 22, 11, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
        if (d.caption) { pane(s, X0, 2.0, 4.5, 2.5, CLEAR); body(s, d.caption, X0 + 0.2, 2.08, 4.1, 2.34, { max: 15, valign: 'middle' }); }
      },
      async (d) => { // night in the nave: dark lead page, glass burning in a band above and below the words
        const s = pres.addSlide(); s.background = { color: C.lead }; idx++;
        roundel(s, 0.6, 0.3, 0.56, idx, idx, 14);
        if (d.title) head(s, d.title, 1.34, 0.3, 8.1, 0.56, { color: 'F6EFDD', max: 24 });
        t.img(s, await glass(10, 0.3, 1), 0, 0.96, W, 0.3);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.36, w: 8.8, h: 2.08, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 8.8, 2.02, 34, 18, F.head, true), color: 'F6EFDD', valign: 'middle' });
        t.img(s, await glass(10, 0.3, 4), 0, 3.5, W, 0.3);
        if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.86, w: 8.8, h: 1.2, fontSize: L.fit(d.caption, 8.8, 1.18, 15, 10, F.body), color: 'F6EFDD', valign: 'middle' });
        t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.75, y: 5.25, w: 8.7, h: 0.25, fontSize: 8.5, color: 'E8DFC8', align: 'right' });
      },
    ],
    timeline: [
      async (d) => { // a lead bar across the page, a diamond of glass for each date, panes up and down
        const s = page(d), ly = 3.2, w = 4.0, xs = [X0, 1.2, 5.25, 5.45], px = [1.5, 3.7, 6.0, 8.2], D = 0.4;
        t.rect(s, X0, ly - 0.04, FW, 0.08, C.lead, { name: 'Lead' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], h = 1.58, y = up ? 1.28 : 3.5, col = G[[1, 0, 2, 4][i]];
          pane(s, x, y, w, h, CLEAR);
          t.shape(s, 'DIAMOND', { x: px[i] - D / 2, y: ly - D / 2, w: D, h: D, fill: { color: col }, line: { color: C.lead, width: 3 }, objectName: 'Glass' });
          t.text(s, it.year, { x: x + 0.14, y: y + 0.07, w: 1.45, h: 0.34, fontFace: F.head, bold: true, fontSize: L.fit(it.year, 1.45, 0.32, 15, 10.5, F.head, true), color: col, valign: 'middle' });
          head(s, it.h, x + 1.62, y + 0.07, w - 1.76, 0.34, { max: 13, align: 'right' });
          body(s, it.t, x + 0.14, y + 0.44, w - 0.28, h - 0.5, { max: 13 });
        });
      },
      async (d) => { // four panes two by two, leaded with a cross, a date on a block of glass at each corner
        const s = page(d), w = 4.2, h = 1.84, g = 0.2, gy = 0.12;
        d.items.forEach((it, i) => {
          const x = X0 + (i % 2) * (w + g), y = 1.28 + (i >> 1) * (h + gy), col = DEEP[i];
          pane(s, x, y, w, h, CLEAR);
          t.rect(s, x, y, 1.5, 0.5, col, { line: { color: C.lead, width: 4 }, name: 'Glass' });
          t.text(s, it.year, { x: x + 0.04, y, w: 1.42, h: 0.5, fontFace: F.head, bold: true, fontSize: L.fit(it.year, 1.34, 0.44, 15, 10.5, F.head, true), color: WHITE, align: 'center', valign: 'middle' });
          head(s, it.h, x + 1.6, y + 0.06, w - 1.74, 0.42, { max: 14 });
          body(s, it.t, x + 0.16, y + 0.58, w - 0.32, h - 0.66, { max: 13.5 });
        });
      },
      async (d) => { // one wide window of four lights: a band of glass with the dates, mullions down
        const s = page(d), cw = FW / 4, y = 1.3, h = 3.82, bh = 0.72;
        pane(s, X0, y, FW, h, CLEAR);
        d.items.forEach((it, i) => {
          const x = X0 + i * cw, col = DEEP[i];
          t.rect(s, x, y, cw, bh, col, { line: { color: C.lead, width: 4.5 }, name: 'Glass' });
          if (i) t.line(s, x, y, 0, h, C.lead, 4.5);
          t.text(s, it.year, { x: x + 0.06, y, w: cw - 0.12, h: bh, fontFace: F.head, bold: true, fontSize: L.fit(it.year, cw - 0.18, bh - 0.16, 22, 11, F.head, true), color: WHITE, align: 'center', valign: 'middle' });
          head(s, it.h, x + 0.14, y + bh + 0.08, cw - 0.28, 0.5, { max: 14, align: 'center', valign: 'top' });
          body(s, it.t, x + 0.14, y + bh + 0.6, cw - 0.28, h - bh - 0.68, { max: 13.5, align: 'center' });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old timeline read as the process page: a lead line, a mark, columns
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Vitraj', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.lead, lt2: C.pane, accent1: C.glass[0], accent2: C.glass[1], accent3: C.glass[2], accent4: C.glass[3], accent5: C.glass[4], accent6: C.glass[5], hlink: C.glass[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tantanali va yorqin: har bir fikr alohida 'oyna' kabi aniq ajratilgan, qisqa va obrazli", limits: {}, prefer: null };
module.exports = { id: 42, slug: 'vitraj', name: 'Vitraj', category: 'creative', photos: true, build, style: STYLE };
