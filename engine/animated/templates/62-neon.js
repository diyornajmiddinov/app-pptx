/**
 * 62 Neon — neon signs on a dark brick wall: glowing tube outlines in pink, cyan, yellow
 * and green, dark sign boards for text, a glowing frame around the photo.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { wall: '2A1C1D', mortar: '170E0F', board: '120C0E', text: 'F5EEF0', muted: 'B8A9AE', neon: ['FF3EA5', '2DE2E6', 'FFE66D', '7CFF6B', 'B88CFF', 'FF9A3C'] };
const F = { head: 'Arial', body: 'Calibri' };

const brickSvg = () => { let b = '', x0 = 7; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let r = 0; r < 19; r++) for (let c = -1; c < 14; c++) { const x = c * 124 + (r % 2 ? 62 : 0), y = r * 48, v = Math.round(rnd() * 14) - 7;
    const col = [0x2a + v, 0x1c + v, 0x1d + v].map((n) => Math.max(0, n).toString(16).padStart(2, '0')).join('');
    b += `<rect x="${x + 3}" y="${y + 3}" width="118" height="42" rx="3" fill="#${col}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.mortar}"/>${b}<rect width="1600" height="900" fill="#000" opacity="0.25"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(brickSvg(), 1600, 900, true);
  const glow = (c) => ({ glow: { size: 8, opacity: 0.6, color: c } });
  // neon tube: coloured outline with a pale core line inside
  const tube = (s, x, y, w, h, c, r = 0.12) => { t.rect(s, x, y, w, h, null, { r, line: { color: c, width: 3.5 }, name: 'Neon tube' }); t.rect(s, x + 0.02, y + 0.02, w - 0.04, h - 0.04, null, { r, line: { color: 'FFFFFF', width: 0.75, transparency: 40 }, name: 'Tube core' }); };
  const board = (s, x, y, w, h, c) => { t.rect(s, x, y, w, h, C.board, { r: 0.12, t: 12, name: 'Sign board' }); tube(s, x, y, w, h, c); };
  const ring = (s, x, y, d, c, n) => { t.oval(s, x, y, d, d, C.board, { line: { color: c, width: 3.5 } }); t.text(s, String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: c, align: 'center', valign: 'middle', ...glow(c) }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    ring(s, 0.5, 0.38, 0.65, C.neon[idx % 6], idx);
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.1, h: 0.65, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.65, 28, 16, F.head, true), ...glow(C.neon[idx % 6]) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h, c) => { tube(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, c, 0.15); t.img(s, await L.photo(L.src(src), w, h, { mask: { r: 0.08 } }), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await photo(s, d.image, 6.25, 0.75, 3.15, 3.0, C.neon[1]);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.6, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.neon[2], charSpacing: 2, ...glow(C.neon[2]) });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.4, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.4, 2.2, 42, 20, F.head, true), color: C.text, valign: 'bottom', ...glow(C.neon[0]) });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 5.3, h: 0.75, fontSize: 13, color: C.muted });
    board(s, 0.6, 4.25, 4.0, 0.6, C.neon[0]);
    t.text(s, M.author || '', { x: 0.75, y: 4.25, w: 3.7, h: 0.6, fontSize: 15, bold: true, color: C.neon[0], valign: 'middle', ...glow(C.neon[0]) });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.7, 1.55, 3.7, 3.2, C.neon[0]); board(s, 4.85, 1.4, 4.6, 3.65, C.neon[1]); para(s, d.text, 5.1, 1.55, 4.1, 3.35); },
    async image(d) { const s = page(d); board(s, 0.55, 1.4, 4.6, 3.65, C.neon[2]); para(s, d.text, 0.8, 1.55, 4.1, 3.35); await photo(s, d.image, 5.6, 1.55, 3.75, 3.2, C.neon[3]); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.45 + (i % per) * rh;
        ring(s, x, y, 0.62, C.neon[i % 6], i + 1);
        t.text(s, it, { x: x + 0.8, y, w: 3.45, h: 0.62, fontSize: 16, bold: true, color: C.text, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.22, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap), c = C.neon[i % 6];
        board(s, x, 1.4, w, 3.65, c);
        t.img(s, await L.icon(it.icon, c, 2), x + 0.22, 1.6, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.22, y: 2.12, w: w - 0.44, h: 0.6, fontSize: L.fit(it.h, w - 0.44, 0.6, 17, 11, F.head, true), bold: true, color: c, valign: 'middle', ...glow(c) });
        t.text(s, it.t, { x: x + 0.22, y: 2.75, w: w - 0.44, h: 2.15, fontSize: 14, color: C.text });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.9 / n;
      t.line(s, 0.55 + 0.35, 1.8, cw * (n - 1), 0, C.neon[1], 2.5, { dash: 'dash' });
      d.steps.forEach((st, i) => {
        const x = 0.55 + i * cw, c = C.neon[i % 6];
        ring(s, x, 1.45, 0.7, c, i + 1);
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.25, h: 0.55, fontSize: L.fit(st.h, cw - 0.25, 0.55, 17, 11, F.head, true), bold: true, color: c, valign: 'middle' });
        board(s, x, 2.95, cw - 0.25, 2.1, c);
        t.text(s, st.t, { x: x + 0.15, y: 3.05, w: cw - 0.55, h: 1.9, fontSize: 13, color: C.text });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (8.9 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.55 + i * (w + gap), c = C.neon[i % 6];
        board(s, px, 1.45, w, 2.75, c);
        t.text(s, x.value, { x: px + 0.2, y: 1.6, w: w - 0.4, h: 1.25, fontSize: L.fit(x.value, w - 0.4, 1.15, 54, 24, F.head, true), bold: true, color: c, align: 'center', valign: 'middle', ...glow(c) });
        t.text(s, x.label, { x: px + 0.2, y: 2.9, w: w - 0.4, h: 1.2, fontSize: 13, color: C.text, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.55, y: 4.35, w: 8.9, h: 0.75, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.9 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.55 + i * (w + 0.2), c = C.neon[i ? 1 : 0];
        board(s, x, 1.4, w, 3.65, c);
        t.text(s, side.h, { x: x + 0.3, y: 1.55, w: w - 0.6, h: 0.55, fontSize: 18, bold: true, color: c, valign: 'middle', ...glow(c) });
        let y = 2.2;
        side.items.forEach((it, k) => { t.oval(s, x + 0.3, y + 0.08, 0.15, 0.15, c); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: fs, color: C.text }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      board(s, 0.9, 1.35, 8.2, 2.6, C.neon[4]);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.45, w: 7.4, h: 2.4, bold: true, fontSize: L.fit(d.text, 7.4, 2.3, 36, 18, F.head, true), color: C.text, align: 'center', valign: 'middle', ...glow(C.neon[4]) });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 4.1, w: 8.2, h: 1.0, fontSize: 13, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.9 / n;
      t.line(s, 0.55, 2.2, 8.9, 0, C.neon[2], 3);
      d.items.forEach((it, i) => {
        const x = 0.55 + i * cw, c = C.neon[i % 6];
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.65, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 12, F.head, true), bold: true, color: c, valign: 'bottom', ...glow(c) });
        t.oval(s, x, 2.08, 0.24, 0.24, c);
        t.text(s, it.h, { x, y: 2.5, w: cw - 0.25, h: 0.5, fontSize: 16, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.0, w: cw - 0.25, h: 2.05, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      tube(s, 1.0, 1.0, 8.0, 3.4, C.neon[0], 0.3);
      t.text(s, d.text, { x: 1.4, y: 1.2, w: 7.2, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 7.2, 2.2, 32, 16, F.head, true), color: C.text, align: 'center', valign: 'middle', ...glow(C.neon[0]) });
      if (d.author) t.text(s, d.author, { x: 1.4, y: 3.6, w: 7.2, h: 0.45, fontSize: 15, bold: true, color: C.neon[2], align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      board(s, 0.55, 1.4, 8.9, rh * n + 0.15, C.neon[1]);
      d.items.forEach((it, i) => {
        const y = 1.47 + i * rh;
        t.text(s, String(i + 1), { x: 0.7, y, w: 0.4, h: rh, fontSize: 15, bold: true, color: C.neon[i % 6], valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.15, h: rh, fontSize: 13, color: C.text, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Neon', colors: { dk1: C.board, lt1: C.text, dk2: C.wall, lt2: C.muted, accent1: C.neon[0], accent2: C.neon[1], accent3: C.neon[2], accent4: C.neon[3], accent5: C.neon[4], accent6: C.neon[5], hlink: C.neon[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "jonli va yorqin: shahar ritmi, qisqa va esda qoladigan iboralar", limits: {}, prefer: 'visual' };
module.exports = { id: 62, slug: 'neon', name: 'Neon', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "bold"], "transitions": ["p14:flash", "cut", "fade"], "cover": ["fadeLetters", "typeLetters"], "mark": "appear", "deco": "fade", "sig": {"title": "fadeLetters", "body": "fade", "item": "dissolve", "image": "fade", "number": "appear", "order": "together", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
