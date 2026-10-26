/**
 * 30 Asalari — honeycomb: hexagon photos, hexagon markers and a faint honeycomb pattern,
 * warm amber and honey with near-black.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { amber: 'F4A300', honey: 'FFD27A', dark: '2B2B2B', light: 'FFF8EB', white: 'FFFFFF', brown: '7A5200', muted: '6B6255' };
const F = { head: 'Calibri', body: 'Calibri' };
const HEXR = 0.866; // height/width of a flat-top hexagon

function combSvg(w, h, color, op) {
  const r = 34, dx = r * 1.5, dy = r * Math.sqrt(3); let p = '';
  for (let c = 0; c * dx < w + r; c++) for (let rr = 0; rr * dy < h + dy; rr++) {
    const cx = c * dx, cy = rr * dy + (c % 2 ? dy / 2 : 0);
    p += `<polygon points="${[0, 60, 120, 180, 240, 300].map((a) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' ')}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-width="2" stroke-opacity="${op}">${p}</g></svg>`;
}

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const combLight = await L.svg(combSvg(600, 600, C.amber, 0.35), 600, 600);
  const combDark = await L.svg(combSvg(1600, 900, C.amber, 0.18), 1600, 900);
  let idx = 0;
  const hex = (s, x, y, w, fill, o = {}) => s.addShape(t.S.HEXAGON, { x, y, w, h: w * HEXR, fill: fill ? { color: fill } : { type: 'none' }, line: o.line || { type: 'none' }, objectName: 'Hexagon' });
  const hexPhoto = async (s, img, x, y, w, alt) => t.img(s, await L.photo(img, w, w * HEXR, { mask: 'hex' }), x, y, w, w * HEXR, { alt });
  const footer = (s, dark) => {
    t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 4.6, h: 0.25, fontSize: 9, bold: true, color: dark ? C.honey : C.brown });
    t.text(s, meta, { x: 4.6, y: 5.2, w: 4.8, h: 0.25, fontSize: 9, color: dark ? 'BFB6A6' : C.muted, align: 'right' });
  };
  const page = (d, bg = C.light) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg === C.dark;
    t.img(s, combLight, 7.6, -0.6, 3.0, 3.0);
    hex(s, 0.55, 0.42, 0.72, C.amber);
    t.text(s, L.pad2(idx), { x: 0.55, y: 0.42, w: 0.72, h: 0.72 * HEXR, fontSize: 15, bold: true, color: C.dark, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.5, y: 0.38, w: 6.6, h: 0.7, bold: true, color: dark ? C.white : C.dark, valign: 'middle', fontSize: L.fit(d.title, 6.6, 0.7, 28, 16, F.head, true) });
    footer(s, dark);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
      t.img(s, combDark, 0, 0, W, H);
      await hexPhoto(s, L.src(d.image), 5.2, 0.55, 4.3, d.title);
      hex(s, 4.75, 3.55, 1.0, C.amber); hex(s, 8.85, 3.95, 0.7, C.honey);
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  |  '), { x: 0.6, y: 0.6, w: 4.4, h: 0.3, fontSize: 12, bold: true, color: C.amber });
      const fs = L.fit(d.title, 4.3, 2.3, 42, 22, F.head, true);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.3, h: 2.4, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 4.0, h: 0.8, fontSize: 13, color: 'BFB6A6' });
      t.text(s, M.author || '', { x: 0.6, y: 4.55, w: 4.0, h: 0.35, fontSize: 15, bold: true, color: C.honey });
    },
    async intro(d) {
      const s = page(d);
      await hexPhoto(s, L.src(d.image), 0.5, 1.35, 4.0, d.title);
      t.text(s, d.text, { x: 4.85, y: 1.35, w: 4.55, h: 3.6, fontSize: L.fit(d.text, 4.55, 3.6, 16, 11, F.body, false, 1.25), color: C.dark, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.35 + (i % per) * rh;
        hex(s, x, y + 0.05, 0.7, i % 2 ? C.honey : C.amber);
        t.text(s, String(i + 1), { x, y: y + 0.05, w: 0.7, h: 0.7 * HEXR, fontSize: 16, bold: true, color: C.dark, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.9, y, w: 3.4, h: 0.7, fontSize: 17, bold: true, color: C.dark, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d);
      await hexPhoto(s, L.src(d.image), 5.2, 1.1, 4.3, d.title);
      hex(s, 4.75, 3.9, 0.8, C.amber);
      t.text(s, d.text, { x: 0.6, y: 1.35, w: 4.2, h: 3.6, fontSize: L.fit(d.text, 4.2, 3.6, 15, 11, F.body, false, 1.25), color: C.dark, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.7;
        t.rect(s, x, y, w, h, C.white, { line: { color: C.honey, width: 1 }, name: 'Card' });
        hex(s, x + 0.25, y - 0.35, 0.8, i % 2 ? C.dark : C.amber);
        t.img(s, await L.icon(it.icon, i % 2 ? C.amber : C.dark, 2), x + 0.48, y - 0.18, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.25, y: y + 0.55, w: w - 0.5, h: 0.42, fontSize: L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true), bold: true, color: C.dark });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: h - 1.1, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, hw = 0.9;
      t.line(s, 0.6 + hw / 2, 1.35 + hw * HEXR / 2, cw * (n - 1), 0, C.honey, 3);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        hex(s, x, 1.35, hw, i === n - 1 ? C.dark : C.amber);
        t.text(s, String(i + 1), { x, y: 1.35, w: hw, h: hw * HEXR, fontSize: 20, bold: true, color: i === n - 1 ? C.amber : C.dark, align: 'center', valign: 'middle' });
        const hfs = Math.min(...d.steps.map((q) => L.fit(q.h, cw - 0.3, 0.75, 17, 12, F.head, true)));
        const hh = Math.max(...d.steps.map((q) => L.height(q.h, hfs, cw - 0.3, F.head, true)));
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.3, h: hh + 0.05, fontSize: hfs, bold: true, color: C.dark });
        t.text(s, st.t, { x, y: 2.5 + hh, w: cw - 0.3, h: 2.4 - hh, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, hw = 1.95;
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        hex(s, cx - hw / 2, 1.3, hw, [C.amber, C.dark, C.honey][i % 3]);
        t.text(s, x.value, { x: cx - hw / 2 + 0.2, y: 1.3, w: hw - 0.4, h: hw * HEXR, fontSize: L.fit(x.value, hw - 0.6, 0.8, 40, 18, F.head, true), bold: true, color: i % 3 === 1 ? C.amber : C.dark, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.15, w: cw - 0.4, h: 0.95, fontSize: 14, color: C.dark, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.8, F.body) : 0))) + 0.22);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fill = i ? C.dark : C.white, fg = i ? C.white : C.dark;
        t.rect(s, x, 1.35, w, 3.55, fill, { line: { color: C.honey, width: 1 }, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.3, y: 1.5, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: i ? C.amber : C.brown });
        let y = 2.15;
        side.items.forEach((it, k) => { hex(s, x + 0.3, y + 0.05, 0.2, C.amber); t.text(s, it, { x: x + 0.65, y, w: w - 0.8, h: rows[k], fontSize: 15, color: fg }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      hex(s, 0.4, 1.55, 3.3, C.amber);
      hex(s, 2.9, 3.55, 1.0, C.dark);
      const fs = L.fit(d.text, 5.4, 1.8, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 4.0, y: 1.4, w: 5.4, h: 2.0, fontSize: fs, bold: true, color: C.dark, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 4.0, y: 3.55, w: 5.4, h: 1.3, fontSize: L.fit(d.caption, 5.4, 1.3, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.35;
      t.line(s, 0.6, ly, 8.8, 0, C.honey, 3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.6, fontSize: L.fit(it.year, cw - 0.3, 0.55, 28, 14, F.head, true), bold: true, color: C.brown, valign: 'bottom' });
        hex(s, x, ly - 0.17, 0.4, i % 2 ? C.dark : C.amber);
        t.text(s, it.h, { x, y: 2.7, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.dark });
        t.text(s, it.t, { x, y: 3.15, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({}, C.dark);
      t.img(s, combDark, 0, 0, W, H);
      hex(s, 0.6, 1.3, 1.0, C.amber);
      t.text(s, '\u201C', { x: 0.6, y: 1.3, w: 1.0, h: 0.87, fontSize: 54, bold: true, color: C.dark, align: 'center', valign: 'middle' });
      const fs = L.fit(d.text, 7.4, 2.4, 34, 20, F.head, true);
      t.text(s, d.text, { x: 2.0, y: 1.2, w: 7.4, h: 2.6, fontSize: fs, bold: true, color: C.white, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.0, y: 3.95, w: 7.4, h: 0.4, fontSize: 15, color: C.honey, bold: true });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        hex(s, 0.6, y + (rh - 0.38 * HEXR) / 2, 0.38, C.amber);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.38 * HEXR) / 2, w: 0.38, h: 0.38 * HEXR, fontSize: 11, bold: true, color: C.dark, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: L.fit(it, 8.25, rh - 0.05, 14, 10, F.body), color: C.dark, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
      t.img(s, combDark, 0, 0, W, H);
      await hexPhoto(s, L.src(d.image), 0.5, 0.6, 4.3, d.title);
      hex(s, 4.1, 3.65, 0.9, C.amber);
      const fs = L.fit(d.title, 4.3, 1.8, 40, 22, F.head, true);
      t.text(s, d.title, { x: 5.2, y: 0.9, w: 4.3, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.2, y: 2.95, w: 4.2, h: 0.5, fontSize: 14, color: 'BFB6A6' });
      t.text(s, M.author || '', { x: 5.2, y: 3.7, w: 4.2, h: 0.35, fontSize: 15, bold: true, color: C.honey });
      footer(s, true);
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Asalari', colors: { dk1: C.dark, lt1: C.white, dk2: '3D3D3D', lt2: C.light, accent1: C.amber, accent2: C.honey, accent3: C.brown, accent4: C.dark, accent5: C.muted, accent6: 'FFE7B3', hlink: C.brown, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tizimli; mehnat va hamkorlik ohangi, aniq", "limits": {}};
module.exports = { id: 30, slug: 'asalari', name: 'Asalari', category: 'business', photos: true, build, style: STYLE };
