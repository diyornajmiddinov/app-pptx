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
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: 12, color: C.muted, align: 'center' });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI HUD', colors: { dk1: C.bg, lt1: C.text, dk2: '0B2A3A', lt2: C.muted, accent1: C.cyan, accent2: C.amber, accent3: C.red, accent4: C.dim, accent5: '6CF0C2', accent6: 'A68BFF', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "operativ hisobot: holat, ko'rsatkich, keyingi harakat; qisqa, aniq, buyruq ohangida", limits: { title: 45, card_h: 20, step_h: 20, event_h: 16 }, prefer: 'data' };
module.exports = { id: 69, slug: 'hud', name: 'HUD', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "energetic"], "transitions": ["zoom", "p14:switch|dir=\"r\"", "cut"], "cover": ["typeLetters", "stretch"], "mark": "zoomIn", "deco": "stretch", "sig": {"title": "stretch", "body": "typeLetters", "item": "zoomIn", "image": "box", "number": "zoomIn", "order": "centerOut", "stagger": 0.1}, "tempo": 0.85, "kenburns": false};
