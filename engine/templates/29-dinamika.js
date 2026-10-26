/**
 * 29 Dinamika — motion and energy: everything leans forward. Slanted photo cut-outs,
 * parallelogram chips and bands, bold italic type, charcoal with electric orange.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { char: '1E1F24', char2: '2B2D33', orange: 'FF5A1F', white: 'FFFFFF', gray: '8E9097', light: 'F2F2F4', line: 'DADBE0' };
const F = { head: 'Arial', body: 'Arial' };
const SLANT = (k = 0.16) => ({ poly: [[k, 0], [1, 0], [1 - k, 1], [0, 1]] });

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;
  const para = (s, x, y, w, h, fill, adj = 0.25) => s.addShape(t.S.PARALLELOGRAM, { x, y, w, h, fill: { color: fill }, line: { type: 'none' }, objectName: 'Slant', adjusting: adj });
  const footer = (s, dark, left = M.topic || '') => {
    t.rect(s, 0, 5.15, W, 0.475, dark ? C.char2 : C.char, { name: 'Footer bar' });
    para(s, 0.35, 5.15, 0.9, 0.475, C.orange);
    const room = Math.min(4.2, 9.4 - Math.min(4.4, L.width(meta, 9, F.body)) - 0.3 - 1.45); // one line, never under the author line
    t.text(s, L.clip(left, room, 0.25, 9, F.body, true, true), { x: 1.45, y: 5.15, w: room, h: 0.475, fontSize: 9, bold: true, italic: true, color: C.white, valign: 'middle', noShrink: true });
    t.text(s, meta, { x: 5.0, y: 5.15, w: 4.4, h: 0.475, fontSize: 9, color: 'C9CACE', align: 'right', valign: 'middle' });
  };
  const page = (d, bg = C.light) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg === C.char;
    para(s, 0.5, 0.45, 0.85, 0.5, bg === C.orange ? C.char : C.orange);
    t.text(s, L.pad2(idx), { x: 0.5, y: 0.45, w: 0.85, h: 0.5, fontSize: 15, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.65, bold: true, italic: true, color: dark ? C.white : C.char, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.65, 28, 16, F.head, true, 1, true) });
    footer(s, dark);
    return s;
  };
  const slantPhoto = async (s, img, x, y, w, h, alt, k) => t.img(s, await L.photo(img, w, h, { mask: SLANT(k) }), x, y, w, h, { alt });

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.char }; idx++;
      await slantPhoto(s, L.src(d.image), 4.3, 0, 5.7, 5.15, d.title, 0.2);
      para(s, 3.75, 0, 1.6, 5.15, C.orange, 0.35);
      const org = [M.org, M.loc, M.year].filter(Boolean).join('  /  ');
      t.text(s, org, { x: 0.6, y: 0.45, w: 3.0, h: 0.5, fontSize: L.fit(org, 3.0, 0.5, 11, 8, F.head, true, 1, true), bold: true, italic: true, color: C.orange, valign: 'top' });
      const fs = L.fit(d.title, 3.9, 2.4, 40, 22, F.head, true, 0.95, true);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 3.9, h: 2.5, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 3.4, h: 0.85, fontSize: 12, color: 'C9CACE' });
      footer(s, true, M.author || '');
    },
    async intro(d) {
      const s = page(d);
      await slantPhoto(s, L.src(d.image), 0.5, 1.25, 4.3, 3.65, d.title, 0.14);
      t.text(s, d.text, { x: 5.05, y: 1.3, w: 4.4, h: 3.55, fontSize: L.fit(d.text, 4.4, 3.55, 15, 11, F.body, false, 1.25), color: C.char, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.3 + (i % per) * rh;
        para(s, x, y + 0.08, 4.1, rh - 0.25, C.white, 0.12);
        t.text(s, L.pad2(i + 1), { x: x + 0.3, y: y + 0.08, w: 0.8, h: rh - 0.25, fontSize: 22, bold: true, italic: true, color: C.orange, valign: 'middle' });
        t.text(s, it, { x: x + 1.1, y: y + 0.08, w: 2.8, h: rh - 0.25, fontSize: 16, bold: true, color: C.char, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d, C.char);
      await slantPhoto(s, L.src(d.image), 4.5, 1.15, 5.0, 3.8, d.title, 0.16);
      t.rect(s, 0.6, 1.4, 0.08, 3.3, C.orange, { name: 'Accent' });
      t.text(s, d.text, { x: 0.9, y: 1.35, w: 3.75, h: 3.4, fontSize: L.fit(d.text, 3.75, 3.4, 15, 11, F.body, false, 1.25), color: 'E4E4E6', lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.5, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.4);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        t.rect(s, x, 1.35, w, h, C.white, { name: 'Card' });
        para(s, x + 0.2, 1.2, 0.9, 0.42, i % 2 ? C.char : C.orange);
        t.text(s, L.pad2(i + 1), { x: x + 0.2, y: 1.2, w: 0.9, h: 0.42, fontSize: 13, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
        t.img(s, await L.icon(it.icon, C.orange, 2), x + w - 0.6, 1.5, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.25, y: 1.95, w: w - 0.5, h: 0.45, fontSize: L.fit(it.h, w - 0.5, 0.45, 17, 12, F.head, true, 1, true), bold: true, italic: true, color: C.char });
        t.text(s, it.t, { x: x + 0.25, y: 2.45, w: w - 0.5, h: h - 1.2, fontSize: 14, color: '55575E' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, shades = ['FFB08F', 'FF8A5C', C.orange, C.char];
      const col = (i) => shades[Math.round((i * (shades.length - 1)) / Math.max(1, n - 1))];
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.75, 17, 12, F.head, true, 1, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.3, F.head, true, 1, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        para(s, x, 1.35, cw + 0.05, 0.75, col(i), 0.3);
        t.text(s, L.pad2(i + 1), { x: x + 0.3, y: 1.35, w: cw - 0.6, h: 0.75, fontSize: 24, bold: true, italic: true, color: C.white, valign: 'middle' });
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.3, h: hh + 0.05, fontSize: hfs, bold: true, italic: true, color: C.char });
        t.text(s, st.t, { x, y: 2.5 + hh, w: cw - 0.3, h: 2.4 - hh, fontSize: 14, color: '55575E' });
      });
    },
    async stats(d) {
      const s = page(d, C.char), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.6, 1.3, 70, 30, F.head, true, 1, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        para(s, px, 1.5, 0.35, 1.3, C.orange, 0.4);
        t.text(s, x.value, { x: px + 0.45, y: 1.4, w: cw - 0.6, h: 1.45, fontSize: vfs, bold: true, italic: true, color: C.white, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.45, y: 3.0, w: cw - 0.7, h: 1.0, fontSize: 14, color: 'C9CACE' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.8, h: 0.45, fontSize: 10, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.0;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.5, F.body) : 0))) + 0.22);
      para(s, 4.55, 1.3, 0.6, 3.6, C.orange, 0.5);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.4 : 0.6;
        t.text(s, side.h, { x, y: 1.3, w, h: 0.5, fontSize: 20, bold: true, italic: true, color: i ? C.orange : C.char });
        let y = 2.0;
        side.items.forEach((it, k) => { para(s, x, y + 0.07, 0.22, 0.16, i ? C.orange : C.char, 0.4); t.text(s, it, { x: x + 0.4, y, w: w - 0.5, h: rows[k], fontSize: 15, color: C.char }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({ title: d.title }, C.orange);
      const fs = L.fit(d.text, 8.4, 2.0, 40, 22, F.head, true, 1, true);
      t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 8.4, h: 2.2, fontSize: fs, bold: true, italic: true, color: C.char, valign: 'bottom' });
      para(s, 0.6, 3.7, 1.4, 0.14, C.char, 0.5);
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.95, w: 8.2, h: 1.0, fontSize: L.fit(d.caption, 8.2, 1.0, 14, 10, F.body), color: C.char });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.3;
      t.rect(s, 0.6, ly - 0.03, 8.8, 0.06, C.char, { name: 'Axis' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.3, w: cw - 0.2, h: 0.75, fontSize: L.fit(it.year, cw - 0.3, 0.7, 32, 14, F.head, true, 1, true), bold: true, italic: true, color: i % 2 ? C.orange : C.char, valign: 'bottom' });
        para(s, x, ly - 0.15, 0.55, 0.3, C.orange, 0.4);
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, italic: true, color: C.char });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: '55575E' });
      });
    },
    async quote(d) {
      const s = page({}, C.char);
      const fs = L.fit(d.text, 7.8, 2.4, 36, 20, F.head, true, 1, true);
      para(s, 0.6, 1.2, 0.35, 2.8, C.orange, 0.4);
      t.text(s, d.text, { x: 1.2, y: 1.1, w: 7.8, h: 2.9, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.2, y: 4.15, w: 7.8, h: 0.4, fontSize: 15, color: C.orange, bold: true });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.3 + i * rh;
        para(s, 0.6, y + (rh - 0.36) / 2, 0.6, 0.36, i % 2 ? C.char : C.orange, 0.3);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.36) / 2, w: 0.6, h: 0.36, fontSize: 12, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.4, y, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.05, 14, 10, F.body), color: C.char, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.char }; idx++;
      await slantPhoto(s, L.src(d.image), 0, 0, 5.6, 5.15, d.title, 0.2);
      para(s, 4.6, 0, 1.4, 5.15, C.orange, 0.35);
      const fs = L.fit(d.title, 3.6, 2.0, 38, 20, F.head, true, 1, true);
      t.text(s, d.title, { x: 5.9, y: 0.8, w: 3.6, h: 2.1, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.9, y: 3.05, w: 3.5, h: 0.6, fontSize: 13, color: 'C9CACE' });
      t.text(s, M.author || '', { x: 5.9, y: 3.85, w: 3.5, h: 0.35, fontSize: 14, bold: true, italic: true, color: C.orange });
      footer(s, true);
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Dinamika', colors: { dk1: C.char, lt1: C.white, dk2: C.char2, lt2: C.light, accent1: C.orange, accent2: C.char, accent3: C.gray, accent4: 'FFB08F', accent5: C.line, accent6: 'FF8A5C', hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "harakatli, motivatsion: fe'l bilan boshlanuvchi qisqa iboralar", "limits": {}};
module.exports = { id: 29, slug: 'dinamika', name: 'Dinamika', category: 'business', photos: true, build, style: STYLE };
