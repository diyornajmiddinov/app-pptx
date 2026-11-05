/**
 * 69 HUD — sci-fi head-up display: dark cockpit glass with scan lines, cyan corner
 * brackets instead of boxes, radar circles, tick-mark gauges, amber alerts.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '05121C', cyan: '3EE6FF', dim: '1C6E80', amber: 'FFB547', red: 'FF4D5E', text: 'D8F6FF', muted: '7FB5C4' };
const F = { head: 'Arial', body: 'Calibri', mono: 'Courier New' };

const scanSvg = () => { let l = ''; for (let y = 0; y < 900; y += 6) l += `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#0A2433"/><stop offset="1" stop-color="#${C.bg}"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/><g stroke="#${C.cyan}" stroke-opacity="0.05" stroke-width="2">${l}</g></svg>`; };
const radarSvg = () => { let t = ''; for (let a = 0; a < 360; a += 10) { const r1 = a % 30 ? 182 : 170, x1 = 200 + r1 * Math.cos(a * Math.PI / 180), y1 = 200 + r1 * Math.sin(a * Math.PI / 180), x2 = 200 + 192 * Math.cos(a * Math.PI / 180), y2 = 200 + 192 * Math.sin(a * Math.PI / 180); t += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><g fill="none" stroke="#${C.cyan}"><circle cx="200" cy="200" r="192" stroke-width="2" stroke-opacity="0.8"/><circle cx="200" cy="200" r="130" stroke-opacity="0.35"/><circle cx="200" cy="200" r="70" stroke-opacity="0.35"/><line x1="8" y1="200" x2="392" y2="200" stroke-opacity="0.3"/><line x1="200" y1="8" x2="200" y2="392" stroke-opacity="0.3"/><g stroke-width="2" stroke-opacity="0.8">${t}</g></g><path d="M200,200 L200,8 A192,192 0 0 1 336,64 Z" fill="#${C.cyan}" fill-opacity="0.12"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(scanSvg(), 1600, 900, true), radar = await L.svg(radarSvg(), 400, 400);
  // corner brackets around a region (no full box): the HUD's way of framing
  const brackets = (s, x, y, w, h, c = C.cyan, k = 0.22, glass = true) => {
    for (const [px, py, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
      t.line(s, Math.min(px, px + sx * k), py, k, 0, c, 2); t.line(s, px, Math.min(py, py + sy * k), 0, k, c, 2);
    }
    if (glass) t.rect(s, x, y, w, h, '0B2A3A', { t: 55, name: 'Glass' });
  };
  const hex = (s, x, y, d, c, txt) => { t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: C.bg }, line: { color: c, width: 1.75 }, objectName: 'Hex' }); t.text(s, String(txt), { x, y, w: d, h: d * 0.88, fontFace: F.mono, fontSize: Math.round(d * 24), bold: true, color: c, align: 'center', valign: 'middle' }); };
  const footer = (s) => { t.line(s, 0.5, 5.2, 9.0, 0, C.dim, 0.75); t.text(s, `${M.topic || ''}  //  ${meta}`.toUpperCase(), { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontFace: F.mono, fontSize: 7.5, color: C.muted }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.text(s, `// ${L.pad2(idx)}`, { x: 0.5, y: 0.3, w: 1.0, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: C.amber });
    if (d.title) t.text(s, d.title.toUpperCase(), { x: 0.5, y: 0.58, w: 8.2, h: 0.6, bold: true, color: C.text, valign: 'middle', charSpacing: 1, fontSize: L.fit(d.title.toUpperCase(), 7.6, 0.6, 24, 13, F.head, true) });
    for (let k = 0; k < 6; k++) t.rect(s, 0.5 + k * 0.32, 1.22, 0.26, 0.05, k < 4 ? C.cyan : C.dim, { name: 'Segment' });
    t.oval(s, 9.05, 0.38, 0.32, 0.32, null, { line: { color: C.cyan, width: 1.25 } }); t.oval(s, 9.15, 0.48, 0.12, 0.12, C.amber);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 15, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });
  const scope = async (s, src, x, y, w, h) => {
    t.img(s, await L.photo(L.src(src), w, h, { duo: ['04202C', '7FEFFF'] }), x, y, w, h, { alt: '' });
    brackets(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.cyan, 0.22, false);
    t.line(s, x + w / 2 - 0.3, y + h / 2, 0.6, 0, C.amber, 1.25); t.line(s, x + w / 2, y + h / 2 - 0.3, 0, 0.6, C.amber, 1.25);
  };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.img(s, radar, 5.75, 0.55, 3.9, 3.9);
    if (d.image) { t.img(s, await L.photo(L.src(d.image), 2.1, 2.1, { mask: 'circle', duo: ['04202C', '7FEFFF'] }), 6.65, 1.45, 2.1, 2.1, { alt: '' }); }
    t.text(s, `SYS // ${[M.org, M.loc, M.year].filter(Boolean).join(' // ')}`.toUpperCase(), { x: 0.6, y: 0.6, w: 5.0, h: 0.3, fontFace: F.mono, fontSize: 10, bold: true, color: C.amber });
    t.text(s, d.title.toUpperCase(), { x: 0.6, y: 0.95, w: 5.0, h: 2.3, bold: true, charSpacing: 1, fontSize: L.fit(d.title.toUpperCase(), 4.8, 2.2, 36, 18, F.head, true), color: C.text, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.9, h: 0.8, fontSize: 13, color: C.muted });
    brackets(s, 0.6, 4.3, 4.2, 0.55, C.amber, 0.15);
    t.text(s, `> ${M.author || ''}`, { x: 0.75, y: 4.3, w: 4.0, h: 0.55, fontFace: F.mono, fontSize: 14, bold: true, color: C.amber, valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await scope(s, d.image, 0.65, 1.6, 3.8, 3.3); brackets(s, 4.85, 1.5, 4.6, 3.5); para(s, d.text, 5.05, 1.6, 4.2, 3.3); },
    async image(d) { const s = page(d); brackets(s, 0.55, 1.5, 4.6, 3.5); para(s, d.text, 0.75, 1.6, 4.2, 3.3); await scope(s, d.image, 5.6, 1.6, 3.8, 3.3); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.55 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.55 + (i % per) * rh;
        hex(s, x, y, 0.62, i % 3 === 2 ? C.amber : C.cyan, L.pad2(i + 1));
        t.text(s, it.toUpperCase(), { x: x + 0.8, y, w: 3.45, h: 0.55, fontSize: 13, bold: true, color: C.text, valign: 'middle', charSpacing: 1 });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap);
        brackets(s, x, 1.5, w, 3.5, i === 0 ? C.amber : C.cyan);
        t.img(s, await L.icon(it.icon, i === 0 ? C.amber : C.cyan, 2), x + 0.2, 1.68, 0.4, 0.4);
        t.text(s, `[${L.pad2(i + 1)}]`, { x: x + w - 0.8, y: 1.7, w: 0.65, h: 0.35, fontFace: F.mono, fontSize: 11, color: C.muted, align: 'right' });
        t.text(s, it.h.toUpperCase(), { x: x + 0.2, y: 2.2, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h.toUpperCase(), w - 0.4, 0.6, 14, 10, F.head, true), bold: true, color: C.text, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.85, w: w - 0.4, h: 2.05, fontSize: 13, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.9 / n;
      d.steps.forEach((st, i) => {
        const x = 0.55 + i * cw;
        hex(s, x, 1.5, 0.75, i === n - 1 ? C.amber : C.cyan, i + 1);
        if (i < n - 1) t.text(s, '\u25B8\u25B8\u25B8', { x: x + 0.8, y: 1.55, w: cw - 0.9, h: 0.55, fontSize: 14, color: C.dim, align: 'center', valign: 'middle' });
        t.text(s, st.h.toUpperCase(), { x, y: 2.35, w: cw - 0.2, h: 0.55, fontSize: L.fit(st.h.toUpperCase(), cw - 0.2, 0.55, 14, 10, F.head, true), bold: true, color: C.text, valign: 'middle' });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.2, h: 2.1, fontSize: 13, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.9 / n, dd = Math.min(2.1, cw - 0.5);
      d.stats.forEach((x, i) => {
        const cx = 0.55 + i * cw + cw / 2;
        t.img(s, radar, cx - dd / 2, 1.45, dd, dd);
        t.text(s, x.value, { x: cx - dd / 2 + 0.25, y: 1.45 + dd * 0.3, w: dd - 0.5, h: dd * 0.4, fontFace: F.mono, fontSize: L.fit(x.value, dd - 0.6, dd * 0.35, 36, 14, F.mono, true), bold: true, color: i === 0 ? C.amber : C.cyan, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.55 + dd, w: cw - 0.3, h: 0.95, fontSize: 12, color: C.text, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.55, y: 4.55, w: 8.9, h: 0.6, fontFace: F.mono, fontSize: 9, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 4.95 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.55 + i * (w + 0.3), c = i ? C.cyan : C.amber;
        brackets(s, x, 1.5, w, 3.55, c);
        t.text(s, side.h.toUpperCase(), { x: x + 0.25, y: 1.62, w: w - 0.5, h: 0.55, fontSize: 15, bold: true, color: c, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, '\u25B8', { x: x + 0.25, y, w: 0.25, h: 0.3, fontSize: 12, color: c }); t.text(s, it, { x: x + 0.5, y, w: w - 0.7, h: rows[k], fontSize: fs, color: C.text }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      t.img(s, radar, 3.0, 1.2, 4.0, 4.0);
      brackets(s, 1.0, 1.75, 8.0, 2.0, C.amber);
      t.text(s, L.runs(d.text.toUpperCase()), { x: 1.3, y: 1.8, w: 7.4, h: 1.9, bold: true, fontSize: L.fit(d.text.toUpperCase(), 7.2, 1.8, 30, 14, F.head, true), color: C.text, align: 'center', valign: 'middle' });
      if (d.caption) { t.rect(s, 1.0, 3.9, 8.0, 1.2, C.bg, { name: 'Caption ground' }); t.text(s, d.caption, { x: 1.1, y: 3.95, w: 7.8, h: 1.1, fontSize: 12, color: C.text, align: 'center', valign: 'middle' }); }
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.9 / n;
      t.line(s, 0.55, 2.15, 8.9, 0, C.cyan, 1.5);
      for (let k = 0; k <= 44; k++) t.line(s, 0.55 + k * (8.9 / 44), 2.15 - (k % 4 ? 0.06 : 0.12), 0, k % 4 ? 0.06 : 0.12, C.cyan, 1);
      d.items.forEach((it, i) => {
        const x = 0.55 + i * cw;
        t.text(s, it.year, { x, y: 1.45, w: cw - 0.2, h: 0.5, fontFace: F.mono, fontSize: L.fit(it.year, cw - 0.3, 0.45, 22, 11, F.mono, true), bold: true, color: i === n - 1 ? C.amber : C.cyan, valign: 'bottom' });
        t.shape(s, 'ISOSCELES_TRIANGLE', { x, y: 2.25, w: 0.2, h: 0.16, fill: { color: C.amber }, objectName: 'Marker' });
        t.text(s, it.h.toUpperCase(), { x, y: 2.55, w: cw - 0.25, h: 0.5, fontSize: 13, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.25, h: 2.0, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      brackets(s, 1.0, 1.0, 8.0, 3.4, C.cyan);
      t.text(s, `"${d.text}"`, { x: 1.4, y: 1.2, w: 7.2, h: 2.4, fontFace: F.mono, bold: true, fontSize: L.fit(d.text, 7.2, 2.3, 24, 13, F.mono, true), color: C.text, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `// ${d.author}`.toUpperCase(), { x: 1.4, y: 3.75, w: 7.2, h: 0.4, fontFace: F.mono, fontSize: 12, bold: true, color: C.amber, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.text(s, `[${L.pad2(i + 1)}]`, { x: 0.55, y, w: 0.6, h: rh, fontFace: F.mono, fontSize: 11, bold: true, color: C.amber, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.25, h: rh, fontSize: 13, color: C.text, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all on the cockpit glass: a deck's pages must not look alike (L.pages)
  const INK = C.bg, PALE = 'DDF3F8', DEEP = '0B4A5C', DUO = ['04202C', '7FEFFF'];
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: o.font || F.body, fontSize: L.fit(v, w, h, o.max || 13, 10, o.font || F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => { const u = String(v).toUpperCase(); t.text(s, u, { x, y, w, h, bold: true, fontSize: L.fit(u, w, h, o.max || 14, 10, F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' }); };
  const mono = (s, v, x, y, w, h, o = {}) => t.text(s, String(v), { x, y, w, h, fontFace: F.mono, bold: true, fontSize: L.fit(String(v), w, h, o.max || 22, o.min || 10, F.mono, true), color: o.color || C.cyan, align: o.align, valign: o.valign || 'middle' });
  // daylight mode: the glass turned pale, dark instruments on it
  const dayPage = (d) => {
    const s = pres.addSlide(); s.background = { color: PALE }; idx++;
    t.text(s, `// ${L.pad2(idx)}`, { x: 0.5, y: 0.3, w: 1.0, h: 0.3, fontFace: F.mono, fontSize: 11, bold: true, color: '9A5B00' });
    const u = d.title.toUpperCase();
    t.text(s, u, { x: 0.5, y: 0.58, w: 8.2, h: 0.6, bold: true, color: INK, valign: 'middle', charSpacing: 1, fontSize: L.fit(u, 7.6, 0.6, 24, 13, F.head, true) });
    for (let k = 0; k < 6; k++) t.rect(s, 0.5 + k * 0.32, 1.22, 0.26, 0.05, k < 4 ? DEEP : '8DB6C2', { name: 'Segment' });
    t.oval(s, 9.05, 0.38, 0.32, 0.32, null, { line: { color: DEEP, width: 1.25 } }); t.oval(s, 9.15, 0.48, 0.12, 0.12, '9A5B00');
    t.line(s, 0.5, 5.2, 9.0, 0, DEEP, 0.75);
    t.text(s, `${M.topic || ''}  //  ${meta}`.toUpperCase(), { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontFace: F.mono, fontSize: 7.5, color: DEEP });
    return s;
  };
  const vRuler = (s, x, y, h, n = 30, c = C.cyan) => { t.line(s, x, y, 0, h, c, 1.5); for (let k = 0; k <= n; k++) t.line(s, x - (k % 5 ? 0.05 : 0.11), y + (k * h) / n, k % 5 ? 0.05 : 0.11, 0, c, 1); };
  const hRuler = (s, x, y, w, n = 44, c = C.cyan) => { t.line(s, x, y, w, 0, c, 1.5); for (let k = 0; k <= n; k++) t.line(s, x + (k * w) / n, y - (k % 4 ? 0.05 : 0.11), 0, k % 4 ? 0.05 : 0.11, c, 1); };
  const P = (v) => Math.round(v * 100);
  const wires = async (s, list, c = C.dim, wd = 1.5) => t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${list.map((pts) => `<path d="M${pts.map(([a, b]) => `${P(a)},${P(b)}`).join(' L')}" fill="none" stroke="#${c}" stroke-width="${wd * 1.4}"/>`).join('')}</svg>`, 1000, 563), 0, 0, W, H);
  const V = {
    image: [
      async (d) => { // the forward view, wide, the readout under it
        const s = page(d);
        await scope(s, d.image, 0.65, 1.46, 8.7, 1.72);
        t.text(s, d.text, { x: 0.65, y: 3.38, w: 8.7, h: 1.74, fontSize: L.fit(d.text, 8.7, 1.74, 15, 10, F.body, false, 1.1), color: C.text, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // the view fills the canopy, an instrument panel hangs over it
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { duo: DUO }), 0, 0, W, H, { alt: '' });
        t.rect(s, 4.95, 0.3, 4.75, 4.75, C.bg, { t: 8, name: 'Panel' });
        brackets(s, 4.95, 0.3, 4.75, 4.75, C.cyan, 0.3, false);
        t.text(s, `// ${L.pad2(idx)}`, { x: 5.15, y: 0.42, w: 1.0, h: 0.28, fontFace: F.mono, fontSize: 11, bold: true, color: C.amber });
        head(s, d.title, 5.15, 0.7, 4.35, 0.62, { max: 16 });
        t.text(s, d.text, { x: 5.15, y: 1.38, w: 4.35, h: 3.56, fontSize: L.fit(d.text, 4.35, 3.56, 14, 10, F.body, false, 1.15), color: C.text, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.16, W, 0.36, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // the radar scope: the picture is what the sweep has found
        const s = page(d), dd = 3.7, x = 0.55, y = 1.4, in0 = dd * 0.14, id = dd - 2 * in0;
        t.img(s, radar, x, y, dd, dd);
        t.img(s, await L.photo(L.src(d.image), id, id, { mask: 'circle', duo: DUO }), x + in0, y + in0, id, id, { alt: '' });
        t.line(s, x + dd + 0.02, y + dd / 2, 0.36, 0, C.amber, 1.5);
        t.text(s, d.text, { x: 4.75, y: 1.4, w: 4.75, h: 3.7, fontSize: L.fit(d.text, 4.75, 3.7, 15, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // target lock: a six-sided crop, a ruler running beside the words
        const s = page(d), w = 4.1, h = 3.55, x = 5.4, y = 1.48, Q = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
        vRuler(s, 0.72, 1.46, 3.62, 30, C.dim);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: Q }, duo: DUO }), x, y, w, h, { alt: '' });
        await wires(s, [Q.concat([Q[0]]).map(([a, b]) => [x + a * w, y + b * h])], C.amber, 2);
        t.line(s, x + w / 2 - 0.3, y + h / 2, 0.6, 0, C.amber, 1.25); t.line(s, x + w / 2, y + h / 2 - 0.3, 0, 0.6, C.amber, 1.25);
        t.text(s, d.text, { x: 0.95, y: 1.42, w: 4.3, h: 3.7, fontSize: L.fit(d.text, 4.3, 3.7, 15, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the target list: no frames, only lines and a ruler down the side
        const s = page(d), n = d.items.length, y0 = 1.42, h = 3.7 / n;
        vRuler(s, 0.65, y0, 3.7);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h, c = i === 0 ? C.amber : C.cyan;
          if (i) t.line(s, 0.85, y, 8.65, 0, C.dim, 0.75, { dash: 'dash' });
          mono(s, `[${L.pad2(i + 1)}]`, 0.85, y, 0.72, h, { color: C.muted, max: 12 });
          t.img(s, await L.icon(it.icon, c, 2), 1.6, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, 2.08, y + 0.05, 2.4, h - 0.1, { color: c });
          body(s, it.t, 4.6, y + 0.05, 4.9, h - 0.1, { color: C.text, valign: 'middle' });
        }
      },
      async (d) => { // the radar in the middle, contacts bracketed round it
        const s = page(d), n = d.items.length, w = 3.4, h = 1.74, dd = 1.7, cx = 5, cy = 3.27;
        const pos = n === 4 ? [[0.55, 1.42], [0.55, 3.38], [6.05, 1.42], [6.05, 3.38]] : [[0.55, 1.42], [0.55, 3.38], [6.05, 2.4]];
        await wires(s, pos.map(([x, y]) => [[x < 5 ? x + w : x, y + h / 2], [x < 5 ? cx - 0.5 : cx + 0.5, y + h / 2], [cx, cy]]));
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.bg);
        t.img(s, radar, cx - dd / 2, cy - dd / 2, dd, dd);
        t.oval(s, cx - 0.08, cy - 0.08, 0.16, 0.16, C.amber);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i], c = i === 0 ? C.amber : C.cyan;
          brackets(s, x, y, w, h, c, 0.18);
          t.img(s, await L.icon(it.icon, c, 2), x + 0.14, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.52, y + 0.06, w - 0.66, 0.38, { max: 13 });
          body(s, it.t, x + 0.14, y + 0.48, w - 0.28, h - 0.54);
        }
      },
      async (d) => { // daylight mode: dark instruments on pale glass, two by two
        const s = dayPage(d), n = d.items.length, w = 4.4, h = 1.78;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.4 + Math.floor(i / 2) * (h + 0.12);
          t.rect(s, x, y, ww, h, 'FFFFFF', { name: 'Tile' });
          brackets(s, x, y, ww, h, DEEP, 0.2, false);
          t.oval(s, x + 0.16, y + 0.18, 0.6, 0.6, DEEP);
          t.img(s, await L.icon(it.icon, PALE, 2), x + 0.3, y + 0.32, 0.32, 0.32);
          head(s, it.h, x + 0.92, y + 0.12, ww - 1.06, 0.42, { color: INK });
          body(s, it.t, x + 0.92, y + 0.56, ww - 1.06, h - 0.64, { color: INK });
        }
      },
      async (d) => { // the primary target in amber, secondary contacts down the side
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.72 - gap * (n - 1)) / n;
        brackets(s, 0.55, 1.4, 4.0, 3.72, C.amber, 0.34);
        t.oval(s, 0.8, 1.62, 0.9, 0.9, null, { line: { color: C.amber, width: 1.5 } });
        t.img(s, await L.icon(a.icon, C.amber, 2), 1.02, 1.84, 0.46, 0.46);
        mono(s, '[01]', 3.2, 1.62, 1.1, 0.5, { color: C.amber, max: 16, align: 'right' });
        head(s, a.h, 0.8, 2.62, 3.5, 0.56, { max: 17, color: C.amber });
        body(s, a.t, 0.8, 3.22, 3.5, 1.76, { color: C.text, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.4 + i * (h + gap);
          brackets(s, 4.8, y, 4.7, h, C.cyan, 0.14);
          t.img(s, await L.icon(it.icon, C.cyan, 2), 4.94, y + 0.08, 0.3, 0.3);
          head(s, it.h, 5.34, y + 0.04, 4.05, 0.38, { max: 13 });
          body(s, it.t, 4.94, y + 0.44, 4.45, h - 0.5);
        }
      },
    ],
    process: [
      async (d) => { // the descent: each stage bracketed one level below the last
        const s = page(d), n = d.steps.length, cw = 8.95 / n, w = cw - 0.14, h = 2.0, dy = (3.74 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * cw, y = 1.38 + i * dy, c = i === n - 1 ? C.amber : C.cyan;
          brackets(s, x, y, w, h, c, 0.16);
          hex(s, x + 0.08, y + 0.08, 0.46, c, i + 1);
          head(s, st.h, x + 0.6, y + 0.06, w - 0.68, 0.46, { max: 11 });
          body(s, st.t, x + 0.1, y + 0.56, w - 0.2, h - 0.62, { color: C.text });
        }
      },
      async (d) => { // the altitude tape up the middle, stages to port and starboard
        const s = page(d), n = d.steps.length, h = 1.2, w = 4.05, dy = (3.74 - h) / (n - 1), Y = (i) => 1.38 + i * dy;
        vRuler(s, 5.05, 1.38, 3.74, 36);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.45 : 0.5, y = Y(i), c = i === n - 1 ? C.amber : C.cyan;
          brackets(s, x, y, w, h, c, 0.14);
          hex(s, 4.78, y + 0.02, 0.54, c, i + 1);
          head(s, st.h, x + 0.14, y + 0.05, w - 0.28, 0.34, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.42, w - 0.28, h - 0.48, { color: C.text });
        }
      },
      async (d) => { // the pitch ladder: centred rungs narrowing towards the goal
        const s = page(d), n = d.steps.length, gap = 0.1, h = (3.72 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const w = 8.9 - i * 0.55, x = 5 - w / 2, y = 1.4 + i * (h + gap), c = i === n - 1 ? C.amber : C.cyan;
          t.rect(s, x, y, w, h, '0B2A3A', { t: 35, name: 'Rung' });
          t.line(s, x, y, 0.5, 0, c, 2); t.line(s, x + w - 0.5, y, 0.5, 0, c, 2); t.line(s, x, y, 0, 0.14, c, 2); t.line(s, x + w, y, 0, 0.14, c, 2);
          mono(s, L.pad2(i + 1), x + 0.14, y, 0.6, h, { color: c, max: 20 });
          head(s, st.h, x + 0.8, y + 0.05, 2.2, h - 0.1, { max: 13 });
          body(s, st.t, x + 3.08, y + 0.05, w - 3.24, h - 0.1, { color: C.text, valign: 'middle' });
        }
      },
    ],
    stats: [
      async (d) => { // the primary reading fills the big dial, two small readouts beside it
        const s = page(d), [a, b, c] = d.stats, dd = 3.7, x = 0.55, y = 1.4;
        t.img(s, radar, x, y, dd, dd);
        mono(s, a.value, x + 0.55, y + 0.86, dd - 1.1, 1.1, { color: C.amber, max: 40, min: 16, align: 'center' });
        body(s, a.label, x + 0.8, y + 2.0, dd - 1.6, 0.9, { color: C.text, align: 'center', max: 12 });
        [b, c].forEach((v, i) => {
          const yy = 1.42 + i * 1.08;
          brackets(s, 4.6, yy, 4.9, 0.98, C.cyan, 0.14);
          mono(s, v.value, 4.74, yy, 2.0, 0.98, { max: 24, min: 12 });
          body(s, v.label, 6.8, yy + 0.05, 2.6, 0.88, { color: C.text, valign: 'middle', max: 12 });
        });
        if (d.note) body(s, d.note, 4.6, 3.6, 4.9, 1.5, { font: F.mono, valign: 'middle', max: 11 });
      },
      async (d) => { // daylight mode: a printed status report, big figures on dark tabs
        const s = dayPage(d), w = d.note ? 5.85 : 9;
        d.stats.forEach((v, i) => {
          const y = 1.4 + i * 1.26;
          t.rect(s, 0.5, y, 2.7, 1.14, INK, { name: 'Readout' });
          mono(s, v.value, 0.56, y, 2.58, 1.14, { color: i ? C.cyan : C.amber, max: 30, min: 13, align: 'center' });
          t.rect(s, 3.2, y, w - 2.7, 1.14, 'FFFFFF', { name: 'Label' });
          body(s, v.label, 3.34, y + 0.05, w - 2.98, 1.04, { color: INK, valign: 'middle', max: 14 });
        });
        if (d.note) { brackets(s, 6.6, 1.4, 2.9, 3.66, DEEP, 0.24, false); body(s, d.note, 6.76, 1.52, 2.58, 3.42, { color: INK, valign: 'middle', max: 13 }); }
      },
    ],
    compare: [
      async (d) => { // two sectors reading away from one centre line, amber and cyan
        const s = page(d), tw = 4.0;
        vRuler(s, 5, 1.4, 3.72, 36, C.dim);
        for (const [i, side] of [d.left, d.right].entries()) {
          const c = i ? C.cyan : C.amber, a = i ? 'left' : 'right', x = i ? 5.3 : 0.55, n = side.items.length, rh = 3.0 / n;
          head(s, side.h, x, 1.4, tw, 0.6, { color: c, max: 17, align: a });
          t.rect(s, i ? x : x + tw - 1.2, 2.02, 1.2, 0.04, c, { name: 'Mark' });
          side.items.forEach((it, k) => {
            const y = 2.12 + k * rh;
            t.text(s, i ? '▸' : '◂', { x: i ? 5.08 : 4.72, y, w: 0.2, h: rh - 0.04, fontSize: 12, color: c, align: 'center', valign: 'middle', noFit: true });
            body(s, it, x, y, tw, rh - 0.04, { color: C.text, align: a, valign: 'middle', max: 14 });
          });
        }
      },
      async (d) => { // two bracketed bands, one above the other, each point a cell of its own
        const s = page(d), h = 1.76;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.4 + i * (h + 0.2), c = i ? C.cyan : C.amber, n = side.items.length, cw = 6.65 / n;
          brackets(s, 0.55, y, 8.9, h, c, 0.22);
          head(s, side.h, 0.72, y + 0.1, 1.95, h - 0.2, { color: c, max: 14 });
          side.items.forEach((it, k) => {
            const x = 2.72 + k * cw;
            t.line(s, x, y + 0.2, 0, h - 0.4, c, 1);
            body(s, it, x + 0.1, y + 0.08, cw - 0.2, h - 0.16, { color: C.text, valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // master alert: a full amber bar across the glass, hazard marks at its ends
        const s = page(d), bh = 2.25, u = d.text.toUpperCase();
        t.rect(s, 0, 1.42, W, bh, C.amber, { name: 'Alert' });
        for (const x0 of [0, 9.4]) for (let k = 0; k < 4; k++) t.shape(s, 'PARALLELOGRAM', { x: x0 + 0.02, y: 1.42 + k * (bh / 4) + 0.08, w: 0.56, h: bh / 4 - 0.16, fill: { color: INK }, objectName: 'Hazard' });
        t.text(s, L.runs(u), { x: 0.8, y: 1.48, w: 8.4, h: bh - 0.12, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(u, 8.4, bh - 0.2, 30, 15, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.78, 8.8, 1.34, { font: F.mono, color: C.text, max: 12, align: 'center', valign: 'middle' });
      },
      async (d) => { // great brackets round the whole view, the thought typed left, a small radar
        const s = page(d), u = d.text.toUpperCase();
        brackets(s, 0.5, 1.4, 9, 3.72, C.cyan, 0.5, false);
        t.img(s, radar, 7.5, 3.25, 1.8, 1.8);
        t.text(s, L.runs(u), { x: 0.8, y: 1.5, w: 8.4, h: 1.72, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(u, 8.4, 1.66, 28, 14, F.head, true) });
        if (d.caption) body(s, `> ${d.caption}`, 0.8, 3.3, 6.5, 1.72, { font: F.mono, color: C.amber, max: 12 });
      },
    ],
    timeline: [
      async (d) => { // a time ruler across the middle, events bracketed above and below it
        const s = page(d), cy = 3.26, w = 4.35, h = 1.62, xs = [1.1, 3.4, 5.8, 8.1];
        hRuler(s, 0.5, cy + 0.06, 9);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.5 : 5.15, y = up ? cy - 0.2 - h : cy + 0.2, c = i === 3 ? C.amber : C.cyan;
          t.shape(s, 'ISOSCELES_TRIANGLE', { x: xs[i] - 0.1, y: cy + 0.05, w: 0.2, h: 0.14, fill: { color: C.amber }, objectName: 'Marker' });
          brackets(s, x, y, w, h, c, 0.16);
          mono(s, it.year, x + 0.14, y + 0.05, 1.8, 0.38, { color: c, max: 16 });
          head(s, it.h, x + 2.0, y + 0.05, w - 2.14, 0.38, { max: 11, align: 'right' });
          body(s, it.t, x + 0.14, y + 0.47, w - 0.28, h - 0.53, { color: C.text });
        }
      },
      async (d) => { // the flight path: a climbing line, each waypoint with its log under it
        const s = page(d), cw = 2.24, X = (i) => 0.55 + i * cw, Y = (i) => 2.72 - i * 0.44, w = cw - 0.14;
        await wires(s, [d.items.map((_, i) => [X(i) + 0.1, Y(i) + 0.1])], C.amber, 2);
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i);
          t.oval(s, x, y, 0.2, 0.2, C.bg, { line: { color: C.amber, width: 2 } });
          mono(s, it.year, x, y + 0.24, w, 0.32, { max: 15, min: 9 });
          head(s, it.h, x, y + 0.56, w, 0.34, { max: 11 });
          body(s, it.t, x, y + 0.92, w, 5.14 - (y + 0.92), { color: C.text, max: 13 });
        }
      },
      async (d) => { // daylight mode: a printed flight plan, dark year tabs over white columns
        const s = dayPage(d), cw = 9 / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, w = cw - 0.08;
          t.rect(s, x, 1.4, w, 0.6, INK, { name: 'Year tab' });
          mono(s, it.year, x + 0.06, 1.4, w - 0.12, 0.6, { color: i === 3 ? C.amber : C.cyan, max: 18, align: 'center' });
          t.rect(s, x, 2.0, w, 3.1, 'FFFFFF', { name: 'Column' });
          head(s, it.h, x + 0.12, 2.06, w - 0.24, 0.44, { color: INK, max: 12 });
          body(s, it.t, x + 0.12, 2.54, w - 0.24, 2.5, { color: INK });
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline columns looked like the process columns
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI HUD', colors: { dk1: C.bg, lt1: C.text, dk2: '0B2A3A', lt2: C.muted, accent1: C.cyan, accent2: C.amber, accent3: C.red, accent4: C.dim, accent5: '6CF0C2', accent6: 'A68BFF', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "operativ hisobot: holat, ko'rsatkich, keyingi harakat; qisqa, aniq, buyruq ohangida", limits: { title: 45, card_h: 20, step_h: 20, event_h: 16 }, prefer: 'data' };
module.exports = { id: 69, slug: 'hud', name: 'HUD', category: 'creative', photos: true, build, style: STYLE };
