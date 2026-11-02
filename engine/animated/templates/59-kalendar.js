/**
 * 59 Kalendar — calendars: a ring-bound wall calendar with the photo on top, tear-off
 * leaves with big red dates for numbers, month grids, a year planner for the timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'ECE7E0', page: 'FFFFFF', red: 'D7263D', ink: '222222', muted: '6E6E6E', ring: '8E8E8E', line: 'E3DED6', blue: '2B59C3' };
const F = { head: 'Arial', body: 'Calibri' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const rings = (s, x, w, y, n) => { for (let k = 0; k < n; k++) { const rx = x + (w / (n + 1)) * (k + 1) - 0.05; t.rect(s, rx, y - 0.16, 0.1, 0.3, C.ring, { r: 0.05, name: 'Ring' }); } };
  // tear-off leaf: red header strip, rings, perforated top line
  const leaf = (s, x, y, w, h, head, k = 0) => {
    t.rect(s, x, y, w, h, C.page, { shadow: 0.18, blur: 6, offset: 2, name: 'Leaf' });
    t.rect(s, x, y, w, 0.5, k % 2 ? C.blue : C.red, { name: 'Leaf header' });
    rings(s, x, w, y, Math.max(2, Math.round(w / 1.1)));
    if (head !== undefined) t.text(s, String(head), { x: x + 0.1, y, w: w - 0.2, h: 0.5, fontSize: L.fit(String(head), w - 0.3, 0.45, 16, 9, F.head, true), bold: true, color: C.page, align: 'center', valign: 'middle' });
  };
  const monthGrid = (s, x, y, w, h, mark) => { // 5 x 7 small dates, one circled
    const cw = w / 7, rh = h / 5;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
      const n = r * 7 + c + 1; if (n > 31) continue;
      if (n === mark) t.oval(s, x + c * cw + cw / 2 - rh * 0.42, y + r * rh + rh * 0.08, rh * 0.84, rh * 0.84, C.red);
      t.text(s, String(n), { x: x + c * cw, y: y + r * rh, w: cw, h: rh, fontSize: Math.max(7, rh * 32), color: n === mark ? C.page : c > 4 ? C.red : C.muted, align: 'center', valign: 'middle', noFit: true });
    }
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    leaf(s, 8.45, 0.35, 1.0, 0.95, TR.slide_l, idx);
    t.text(s, String(idx), { x: 8.45, y: 0.85, w: 1.0, h: 0.45, fontSize: 22, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.38, w: 7.7, h: 0.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.7, 0.75, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const wall = async (s, src, x, y, w, h, mark) => { // wall calendar: photo on top, month grid below
    t.rect(s, x, y, w, h, C.page, { shadow: 0.2, blur: 8, offset: 3, name: 'Wall calendar' });
    rings(s, x, w, y, Math.round(w / 0.45));
    const ph = h * 0.55;
    t.img(s, await L.photo(L.src(src), w - 0.3, ph), x + 0.15, y + 0.2, w - 0.3, ph, { alt: '' });
    monthGrid(s, x + 0.2, y + 0.3 + ph, w - 0.4, h - ph - 0.45, mark);
  };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await wall(s, d.image, 6.2, 0.45, 3.3, 4.55, 14);
    t.text(s, [M.org, M.loc].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: C.red });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.3, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.3, 2.2, 40, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 5.2, h: 0.75, fontSize: 14, color: C.muted });
    leaf(s, 0.6, 4.2, 1.2, 0.85, M.year || '', 0);
    t.text(s, M.author || '', { x: 2.0, y: 4.3, w: 3.9, h: 0.65, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await wall(s, d.image, 0.6, 1.45, 3.6, 3.6, 2); para(s, d.text, 4.65, 1.4, 4.8, 3.65); },
    async image(d) { const s = page(d); para(s, d.text, 0.5, 1.4, 4.7, 3.65); await wall(s, d.image, 5.75, 1.45, 3.6, 3.6, 21); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.15, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.5 + Math.floor(i / per) * 4.5, y = 1.45 + (i % per) * rh;
        leaf(s, x, y, 0.85, rh - 0.15, undefined, i);
        t.text(s, String(i + 1), { x, y: y + 0.45, w: 0.85, h: rh - 0.62, fontSize: 18, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 1.05, y, w: 3.3, h: rh - 0.15, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        leaf(s, x, 1.5, w, 3.55, it.h, i);
        t.img(s, await L.icon(it.icon, i % 2 ? C.blue : C.red, 2), x + 0.2, 2.15, 0.38, 0.38);
        t.text(s, L.pad2(i + 1), { x: x + w - 1.0, y: 2.05, w: 0.8, h: 0.55, fontSize: 24, bold: true, color: C.line, align: 'right' });
        t.text(s, it.t, { x: x + 0.2, y: 2.7, w: w - 0.4, h: 2.2, fontSize: 14, color: C.ink });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 9.0 / n;
      t.rect(s, 0.5, 1.5, 9.0, 0.5, C.page, { name: 'Week strip' });
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * cw;
        t.oval(s, x + 0.12, 1.53, 0.44, 0.44, i === n - 1 ? C.red : C.ink);
        t.text(s, String(i + 1), { x: x + 0.12, y: 1.53, w: 0.44, h: 0.44, fontSize: 14, bold: true, color: C.page, align: 'center', valign: 'middle' });
        if (i) t.line(s, x, 1.55, 0, 0.4, C.line, 1);
        t.text(s, st.h, { x: x + 0.65, y: 1.5, w: cw - 0.75, h: 0.5, fontSize: L.fit(st.h, cw - 0.75, 0.48, 14, 9, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.rect(s, x + 0.05, 2.15, cw - 0.15, 2.9, C.page, { name: 'Day' });
        t.text(s, st.t, { x: x + 0.2, y: 2.25, w: cw - 0.45, h: 2.7, fontSize: 14, color: C.ink });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        leaf(s, px, 1.5, w, 2.6, undefined, i);
        t.text(s, x.value, { x: px + 0.15, y: 2.05, w: w - 0.3, h: 1.0, fontSize: L.fit(x.value, w - 0.3, 0.95, 54, 22, F.head, true), bold: true, color: i % 2 ? C.blue : C.red, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 3.05, w: w - 0.4, h: 0.95, fontSize: 13, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.3, w: 9.0, h: 0.8, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.7, F.body, 0.18, 5.0 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.3);
        leaf(s, x, 1.5, w, 3.55, side.h, i);
        let y = 2.2;
        side.items.forEach((it, k) => { t.rect(s, x + 0.25, y + 0.06, 0.18, 0.18, null, { line: { color: i ? C.blue : C.red, width: 1.5 }, name: 'Check' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      leaf(s, 1.0, 1.45, 8.0, 2.6, undefined, 0);
      t.text(s, L.runs(d.text), { x: 1.3, y: 2.0, w: 7.4, h: 1.95, bold: true, fontSize: L.fit(d.text, 7.4, 1.85, 32, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 4.15, w: 8.0, h: 0.95, fontSize: 13, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.5 + i * (w + gap);
        leaf(s, x, 1.5, w, 3.55, it.year, i);
        t.text(s, it.h, { x: x + 0.2, y: 2.15, w: w - 0.4, h: 0.55, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.75, w: w - 0.4, h: 2.15, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      leaf(s, 1.2, 1.2, 7.6, 3.2, d.author || '', 1);
      t.text(s, d.text, { x: 1.5, y: 1.85, w: 7.0, h: 2.35, italic: true, bold: true, fontSize: L.fit(d.text, 7.0, 2.25, 30, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.rect(s, 0.5, y + (rh - 0.42) / 2, 0.42, 0.42, C.page, { name: 'Date' });
        t.rect(s, 0.5, y + (rh - 0.42) / 2, 0.42, 0.12, i % 2 ? C.blue : C.red, { name: 'Date header' });
        t.text(s, String(i + 1), { x: 0.5, y: y + (rh - 0.42) / 2 + 0.1, w: 0.42, h: 0.32, fontSize: 11, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.1, y, w: 8.4, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Kalendar', colors: { dk1: C.ink, lt1: C.page, dk2: '444444', lt2: C.bg, accent1: C.red, accent2: C.blue, accent3: 'F2A541', accent4: C.ring, accent5: C.muted, accent6: C.line, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "reja va muddatlar tilida: qachon, nima, qanday tartibda; aniq sanalar va bosqichlar", limits: {}, prefer: 'text' };
module.exports = { id: 59, slug: 'kalendar', name: 'Kalendar', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["pull:u", "p14:flip|dir=\"l\"", "fade"], "cover": ["fadeLetters", "peekUp"], "mark": "popIn", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fade", "item": "peekUp", "image": "unfold", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.05, "kenburns": false};
