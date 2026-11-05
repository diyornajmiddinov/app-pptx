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
  // ---- further ways to draw a type, all on the calendar: a deck's pages must not look alike (L.pages)
  const NIGHT = '222222', CARD = '333333', MIST = 'DDD8D0', BANDS = [C.red, NIGHT, C.blue, '444444'];
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    leaf(s, 8.45, 0.35, 1.0, 0.95, TR.slide_l, idx);
    t.text(s, String(idx), { x: 8.45, y: 0.85, w: 1.0, h: 0.45, fontSize: 22, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 0.5, y: 0.38, w: 7.7, h: 0.75, bold: true, color: C.page, valign: 'middle', fontSize: L.fit(d.title, 7.7, 0.75, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: MIST });
    return s;
  };
  // flip-calendar tile: dark card split by a hinge line
  const flipTile = (s, v, x, y, w, h, o = {}) => {
    t.rect(s, x, y, w, h, o.fill || CARD, { r: 0.05, name: 'Flip tile' });
    t.text(s, String(v), { x: x + 0.05, y, w: w - 0.1, h, bold: true, color: o.color || C.page, align: 'center', valign: 'middle', fontSize: L.fit(String(v), w - 0.14, h * 0.8, o.max || 40, 9, F.head, true) });
    t.rect(s, x, y + h / 2 - 0.01, w, 0.02, o.hinge || NIGHT, { name: 'Hinge' });
  };
  const circled = (s, x, y, d, col = C.red, w = 2.5) => t.oval(s, x, y, d, d, null, { line: { color: col, width: w } });
  const V = {
    image: [
      async (d) => { // the big wall calendar: a landscape photo on top, the words where the dates would be
        const s = page(d), x = 0.5, y = 1.42, w = 9, h = 3.68;
        t.rect(s, x, y, w, h, C.page, { shadow: 0.2, blur: 8, offset: 3, name: 'Wall calendar' });
        rings(s, x, w, y, 16);
        t.img(s, await L.photo(L.src(d.image), w - 0.3, 1.75), x + 0.15, y + 0.2, w - 0.3, 1.75, { alt: '' });
        t.text(s, d.text, { x: x + 0.25, y: y + 2.02, w: w - 0.5, h: 1.6, fontSize: L.fit(d.text, w - 0.5, 1.6, 15, 10, F.body), color: C.ink, valign: 'middle' });
      },
      async (d) => { // the photo is the wall, one big leaf hangs on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        leaf(s, 5.05, 0.42, 4.55, 4.6, undefined, idx);
        t.text(s, d.title, { x: 5.2, y: 0.42, w: 3.65, h: 0.5, bold: true, color: C.page, valign: 'middle', fontSize: L.fit(d.title, 3.65, 0.48, 16, 10, F.head, true) });
        t.text(s, String(idx), { x: 8.85, y: 0.42, w: 0.65, h: 0.5, bold: true, fontSize: 18, color: C.page, align: 'right', valign: 'middle' });
        t.text(s, d.text, { x: 5.25, y: 1.02, w: 4.15, h: 3.9, fontSize: L.fit(d.text, 4.15, 3.9, 15, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.2, W, 0.32, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // night: the year as a wheel, twelve marks round a round photo
        const s = nightPage(d), dia = 3.1, x = 0.85, y = 1.72, cx = x + dia / 2, cy = y + dia / 2;
        for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6, r = dia / 2 + 0.2; t.oval(s, cx + r * Math.cos(a) - 0.06, cy + r * Math.sin(a) - 0.06, 0.12, 0.12, k === 3 ? C.red : C.ring); }
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        t.text(s, d.text, { x: 4.7, y: 1.5, w: 4.8, h: 3.6, fontSize: L.fit(d.text, 4.8, 3.6, 15, 10, F.body, false, 1.2), color: C.page, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // a month page: the photo covers a block of days, the words another
        const s = page(d), x0 = 0.5, y0 = 1.4, cw = 9 / 7, rh = 0.74;
        t.rect(s, x0, y0, 9, rh * 5, C.page, { name: 'Month' });
        for (let c = 0; c <= 7; c++) t.line(s, x0 + c * cw, y0, 0, rh * 5, C.line, 1);
        for (let r = 0; r <= 5; r++) t.line(s, x0, y0 + r * rh, 9, 0, C.line, 1);
        for (let c = 0; c < 7; c++) t.text(s, String(c + 1), { x: x0 + c * cw + 0.08, y: y0 + 0.04, w: 0.5, h: 0.3, fontSize: 13, bold: true, color: c > 4 ? C.red : C.muted });
        t.img(s, await L.photo(L.src(d.image), cw * 3, rh * 4), x0 + cw * 4, y0 + rh, cw * 3, rh * 4, { alt: '' });
        t.text(s, d.text, { x: x0 + 0.14, y: y0 + rh + 0.06, w: cw * 4 - 0.28, h: rh * 4 - 0.12, fontSize: L.fit(d.text, cw * 4 - 0.28, rh * 4 - 0.12, 14, 10, F.body), color: C.ink, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a ruled diary page with a red margin
        const s = page(d), n = d.items.length, y0 = 1.4, h = 3.7 / n;
        t.rect(s, 0.5, y0, 9, 3.7, C.page, { name: 'Diary page' });
        t.rect(s, 1.28, y0, 0.03, 3.7, C.red, { name: 'Margin' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h;
          if (i) t.line(s, 0.5, y, 9, 0, C.line, 1);
          t.img(s, await L.icon(it.icon, i % 2 ? C.blue : C.red, 2), 0.72, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, 1.5, y + 0.05, 2.5, h - 0.1, { max: 15 });
          body(s, it.t, 4.1, y + 0.05, 5.25, h - 0.1, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // small month sheets, one date circled on each
        const s = page(d), n = d.items.length, w = 4.4, h = 1.75;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.42 + Math.floor(i / 2) * (h + 0.18);
          t.rect(s, x, y, ww, h, C.page, { shadow: 0.15, blur: 5, offset: 2, name: 'Sheet' });
          t.rect(s, x, y, 1.5, 0.3, i % 2 ? C.blue : C.red, { name: 'Sheet head' });
          t.img(s, await L.icon(it.icon, C.page, 2), x + 0.64, y + 0.04, 0.22, 0.22);
          monthGrid(s, x + 0.05, y + 0.36, 1.4, h - 0.42, 5 + i * 8);
          head(s, it.h, x + 1.62, y + 0.08, ww - 1.75, 0.4, { max: 14 });
          body(s, it.t, x + 1.62, y + 0.5, ww - 1.75, h - 0.58, { max: 13 });
        }
      },
      async (d) => { // night: leaves on a dark wall, hung at different heights
        const s = nightPage(d), n = d.items.length, gap = 0.2, w = (9 - gap * (n - 1)) / n, h = 3.05;
        t.rect(s, 0, 1.46, W, 0.03, C.ring, { name: 'Wire' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), y = 1.5 + (i % 2) * 0.55;
          t.line(s, x + w / 2, 1.47, 0, y - 1.47, C.ring, 1.5);
          leaf(s, x, y, w, h, undefined, i);
          t.img(s, await L.icon(it.icon, C.page, 2), x + 0.14, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.14, y + 0.56, w - 0.28, 0.55, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.14, w - 0.28, h - 1.22, { max: 13 });
        }
      },
      async (d) => { // today's big red leaf, the coming days stacked beside it
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.14, h = (3.68 - gap * (n - 1)) / n;
        t.rect(s, 0.5, 1.42, 3.8, 3.68, C.red, { shadow: 0.2, blur: 8, offset: 3, name: 'Today' });
        rings(s, 0.5, 3.8, 1.42, 4);
        t.img(s, await L.icon(a.icon, C.page, 2), 0.75, 1.72, 0.7, 0.7);
        t.text(s, '01', { x: 2.5, y: 1.62, w: 1.6, h: 0.95, fontSize: 48, bold: true, color: C.page, align: 'right', valign: 'middle' });
        head(s, a.h, 0.75, 2.62, 3.3, 0.6, { color: C.page, max: 18 });
        body(s, a.t, 0.75, 3.25, 3.3, 1.72, { color: C.page, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.42 + i * (h + gap);
          t.rect(s, 4.5, y, 5, h, C.page, { name: 'Day' });
          t.rect(s, 4.5, y, 0.82, h, i % 2 ? C.red : C.blue, { name: 'Date' });
          t.text(s, L.pad2(i + 2), { x: 4.5, y: y + h / 2 - 0.4, w: 0.82, h: 0.4, fontSize: 18, bold: true, color: C.page, align: 'center', valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.page, 2), 4.79, y + h / 2 + 0.03, 0.24, 0.24);
          head(s, it.h, 5.45, y + 0.05, 3.95, 0.36, { max: 13 });
          body(s, it.t, 5.45, y + 0.42, 3.95, h - 0.48, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // leaves falling down a staircase, each date circled
        const s = page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.14, h = 2.05, dy = (3.62 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, y = 1.48 + i * dy;
          leaf(s, x, y, w, h, undefined, i);
          t.text(s, String(i + 1), { x: x + 0.1, y, w: 0.4, h: 0.5, bold: true, fontSize: 18, color: C.page, valign: 'middle' });
          t.text(s, st.h, { x: x + 0.46, y, w: w - 0.54, h: 0.5, bold: true, color: C.page, valign: 'middle', fontSize: L.fit(st.h, w - 0.54, 0.48, 13, 9, F.head, true) });
          body(s, st.t, x + 0.12, y + 0.56, w - 0.24, h - 0.62, { max: 13 });
        }
      },
      async (d) => { // an open planner: steps pass from page to page across the rings
        const s = page(d), n = d.steps.length, top = 1.4, H0 = 3.72, h = 1.2, dy = (H0 - h - 0.1) / (n - 1);
        t.rect(s, 0.5, top, 4.42, H0, C.page, { name: 'Left page' }); t.rect(s, 5.08, top, 4.42, H0, C.page, { name: 'Right page' });
        for (let k = 0; k < 9; k++) t.rect(s, 4.8, top + 0.14 + k * 0.4, 0.4, 0.09, C.ring, { r: 0.04, name: 'Ring' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.3 : 0.65, y = top + 0.05 + i * dy, w = 4.05, col = right ? C.blue : C.red;
          t.oval(s, x, y + 0.04, 0.44, 0.44, col);
          t.text(s, String(i + 1), { x, y: y + 0.04, w: 0.44, h: 0.44, bold: true, fontSize: 14, color: C.page, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.54, y + 0.04, w - 0.54, 0.44, { max: 14 });
          body(s, st.t, x + 0.54, y + 0.48, w - 0.54, h - 0.5, { max: 12 });
        }
      },
      async (d) => { // the days as full-width coloured bands, a flip digit on each
        const s = page(d), n = d.steps.length, y0 = 1.4, h = 3.72 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h, col = BANDS[i], th = Math.min(0.72, h - 0.16);
          t.rect(s, 0, y, W, h - 0.04, col, { name: 'Band' });
          flipTile(s, i + 1, 0.5, y + (h - 0.04 - th) / 2, 0.7, th, { fill: C.page, color: C.ink, hinge: C.ring, max: 28 });
          head(s, st.h, 1.45, y + 0.05, 2.6, h - 0.14, { color: C.page, max: 15 });
          body(s, st.t, 4.2, y + 0.05, 5.3, h - 0.14, { color: C.page, valign: 'middle' });
        }
      },
    ],
    stats: [
      async (d) => { // one big tear-off date, two smaller ones behind it
        const s = page(d), [a, b, c] = d.stats;
        leaf(s, 0.5, 1.5, 4.4, 3.58, undefined, 0);
        t.text(s, a.value, { x: 0.65, y: 2.05, w: 4.1, h: 1.6, bold: true, color: C.red, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.0, 1.5, 72, 28, F.head, true) });
        body(s, a.label, 0.85, 3.7, 3.7, 1.25, { align: 'center', max: 15 });
        [b, c].forEach((x, i) => {
          const px = 5.1 + i * 2.25;
          leaf(s, px, 1.5, 2.15, 1.95, undefined, i + 1);
          t.text(s, x.value, { x: px + 0.08, y: 2.0, w: 1.99, h: 0.68, bold: true, color: i ? C.red : C.blue, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.92, 0.65, 30, 14, F.head, true) });
          body(s, x.label, px + 0.1, 2.68, 1.95, 0.72, { align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 5.1, 3.6, 4.4, 1.5, { color: C.muted, max: 13, valign: 'middle' });
      },
      async (d) => { // red-pen circles walking down the page, words beside each
        const s = page(d), D0 = 1.05, xs = [0.5, 1.5, 2.5];
        d.stats.forEach((x, i) => {
          const y = 1.4 + i * 1.22, px = xs[i];
          t.oval(s, px, y, D0, D0, C.page);
          circled(s, px, y, D0, i % 2 ? C.blue : C.red, 3);
          t.text(s, x.value, { x: px + 0.06, y, w: D0 - 0.12, h: D0, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, D0 - 0.16, 0.5, 22, 11, F.head, true) });
          body(s, x.label, px + D0 + 0.14, y + 0.08, 2.75, D0 - 0.16, { valign: 'middle', max: 14 });
        });
        if (d.note) { t.rect(s, 6.8, 1.45, 2.7, 3.6, C.page, { shadow: 0.15, blur: 5, offset: 2, name: 'Note' }); rings(s, 6.8, 2.7, 1.45, 3); body(s, d.note, 6.95, 1.65, 2.4, 3.3, { color: C.ink, max: 14, valign: 'middle' }); }
      },
      async (d) => { // night: a flip clock, three great tiles
        const s = nightPage(d), w = 2.86, gap = 0.21;
        d.stats.forEach((x, i) => {
          const px = 0.5 + i * (w + gap);
          flipTile(s, x.value, px, 1.45, w, 1.5, { max: 50, fill: CARD });
          body(s, x.label, px, 3.02, w, 0.75, { color: C.page, align: 'center', max: 14 });
        });
        if (d.note) { t.rect(s, 0.5, 3.86, 9, 0.03, C.red, { name: 'Rule' }); body(s, d.note, 0.5, 3.96, 9, 1.16, { color: MIST, max: 13, valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // two facing months, red and blue, the rings between them
        const s = page(d), y0 = 1.4, h = 3.72;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5 : 0, col = i ? C.blue : C.red, a = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.72) / n, tx = i ? 5.42 : 0.5, tw = 4.08;
          t.rect(s, x, y0, 5, h, col, { name: 'Month' });
          head(s, side.h, tx, y0 + 0.08, tw, 0.56, { color: C.page, align: a, max: 18 });
          t.rect(s, tx, y0 + 0.66, tw, 0.02, C.page, { name: 'Rule' });
          side.items.forEach((it, k) => body(s, it, tx, y0 + 0.72 + k * rh, tw, rh - 0.04, { color: C.page, align: a, valign: 'middle', max: 14 }));
        }
        for (let k = 0; k < 9; k++) t.rect(s, 4.8, y0 + 0.14 + k * 0.4, 0.4, 0.09, C.bg, { r: 0.04, name: 'Ring' });
      },
      async (d) => { // two week strips, one above the other, one day cell per point
        const s = page(d), h = 1.74;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.42 + i * (h + 0.2), col = i ? C.blue : C.red, n = side.items.length, cw = 6.95 / n;
          t.rect(s, 0.5, y, 2.05, h, col, { name: 'Week' });
          rings(s, 0.5, 2.05, y, 2);
          head(s, side.h, 0.62, y + 0.1, 1.81, h - 0.2, { color: C.page, align: 'center', max: 16 });
          side.items.forEach((it, k) => {
            const x = 2.55 + k * cw;
            t.rect(s, x, y, cw, h, C.page, { line: { color: C.line, width: 1 }, name: 'Day' });
            t.text(s, String(k + 1), { x: x + 0.1, y: y + 0.04, w: 0.4, h: 0.26, fontSize: 12, bold: true, color: col });
            body(s, it, x + 0.1, y + 0.32, cw - 0.2, h - 0.38, { max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // night: the wall bare, one thought with rings across the top
        const s = nightPage(d), bottom = d.caption ? 3.9 : 5.1;
        for (let k = 0; k < 20; k++) t.rect(s, 0.5 + k * 0.472, 1.34, 0.1, 0.22, C.ring, { r: 0.05, name: 'Ring' });
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.62, w: 9, h: bottom - 1.62, bold: true, color: C.page, valign: 'middle', fontSize: L.fit(d.text, 9, bottom - 1.7, 36, 17, F.head, true) });
        if (d.caption) { t.rect(s, 0.5, 3.96, 1.2, 0.05, C.red, { name: 'Rule' }); body(s, d.caption, 0.5, 4.06, 9, 1.08, { color: MIST, max: 14 }); }
      },
      async (d) => { // the date itself: a month with one day ringed, the thought beside it
        const s = page(d);
        t.rect(s, 0.5, 1.42, 3.5, 3.68, C.page, { shadow: 0.2, blur: 8, offset: 3, name: 'Month' });
        t.rect(s, 0.5, 1.42, 3.5, 0.5, C.red, { name: 'Month head' });
        rings(s, 0.5, 3.5, 1.42, 4);
        monthGrid(s, 0.65, 2.05, 3.2, 2.9, 17);
        t.text(s, L.runs(d.text), { x: 4.3, y: 1.42, w: 5.2, h: d.caption ? 2.2 : 3.68, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.2, d.caption ? 2.15 : 3.6, 30, 15, F.head, true) });
        if (d.caption) { t.rect(s, 4.3, 3.68, 0.05, 1.42, C.red, { name: 'Rule' }); body(s, d.caption, 4.47, 3.68, 5.03, 1.42, { color: C.muted, valign: 'middle', max: 13 }); }
      },
    ],
    timeline: [
      async (d) => { // a year planner: years on the top strip, events pinned in two lanes
        const s = page(d), cw = 9 / 4, lane = (i) => 2.0 + (i % 2) * 1.58;
        d.items.forEach((it, i) => {
          const x = 0.5 + i * cw, col = i % 2 ? C.blue : C.red, y = lane(i), h = 1.52;
          t.rect(s, x, 1.42, cw - 0.03, 0.46, col, { name: 'Year' });
          t.text(s, it.year, { x: x + 0.05, y: 1.42, w: cw - 0.13, h: 0.46, bold: true, color: C.page, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.2, 0.42, 17, 10, F.head, true) });
          t.line(s, x + (i % 2 ? 1.2 : 0.2), 1.88, 0, y - 1.88, col, 1.5, { dash: 'dash' });
          const w = i === 3 ? cw - 0.03 : cw + 0.8;
          t.rect(s, x, y, w, h, C.page, { shadow: 0.15, blur: 5, offset: 2, name: 'Event' });
          head(s, it.h, x + 0.14, y + 0.04, w - 0.28, 0.34, { max: 13 });
          body(s, it.t, x + 0.14, y + 0.38, w - 0.28, h - 0.42, { max: 13 });
        });
      },
      async (d) => { // the year wheel: a round clock of twelve marks, an event at each corner
        const s = page(d), cx = 5, cy = 3.25, r = 0.72, w = 3.45, h = 1.76;
        const pos = [[0.5, 1.42], [6.05, 1.42], [6.05, 3.34], [0.5, 3.34]];
        for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6, q = r + 0.2; t.oval(s, cx + q * Math.cos(a) - 0.05, cy + q * Math.sin(a) - 0.05, 0.1, 0.1, k % 3 ? C.ring : C.red); }
        t.oval(s, cx - r, cy - r, 2 * r, 2 * r, C.red);
        t.img(s, await L.icon('FiCalendar', C.page, 2), cx - 0.3, cy - 0.3, 0.6, 0.6);
        d.items.forEach((it, i) => {
          const [x, y] = pos[i], col = i % 2 ? C.blue : C.red;
          t.rect(s, x, y, w, h, C.page, { shadow: 0.15, blur: 5, offset: 2, name: 'Season' });
          t.rect(s, x, y, 1.2, 0.42, col, { name: 'Year' });
          t.text(s, it.year, { x: x + 0.04, y, w: 1.12, h: 0.42, bold: true, color: C.page, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.06, 0.4, 15, 9, F.head, true) });
          head(s, it.h, x + 1.3, y + 0.03, w - 1.38, 0.38, { max: 13 });
          body(s, it.t, x + 0.14, y + 0.48, w - 0.28, h - 0.54, { max: 13 });
        });
      },
      async (d) => { // night: flip tiles climb a dark wall year by year
        const s = nightPage(d), cw = 2.25, X = (i) => 0.5 + i * cw, Y = (i) => 2.82 - i * 0.48;
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i), w = cw - 0.15;
          flipTile(s, it.year, x, y, w, 0.62, { max: 20, fill: i === 3 ? C.red : CARD, hinge: NIGHT });
          head(s, it.h, x, y + 0.66, w, 0.36, { color: C.page, max: 13 });
          body(s, it.t, x, y + 1.02, w, 5.14 - (y + 1.02), { color: MIST, max: 12 });
        }
      },
    ],
  };
  R.stats = V.stats.shift(); // the old stats leaves looked like the cards leaves
  R.timeline = V.timeline.shift(); // the old timeline leaves did too
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Kalendar', colors: { dk1: C.ink, lt1: C.page, dk2: '444444', lt2: C.bg, accent1: C.red, accent2: C.blue, accent3: 'F2A541', accent4: C.ring, accent5: C.muted, accent6: C.line, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "reja va muddatlar tilida: qachon, nima, qanday tartibda; aniq sanalar va bosqichlar", limits: {}, prefer: 'text' };
module.exports = { id: 59, slug: 'kalendar', name: 'Kalendar', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["pull:u", "p14:flip|dir=\"l\"", "fade"], "cover": ["fadeLetters", "peekUp"], "mark": "popIn", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fade", "item": "peekUp", "image": "unfold", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.05, "kenburns": false};
