/**
 * 27 Kitob — an open book on a desk: every slide is a two-page spread with gutter shadow,
 * running heads (topic / author line), page numbers, photo plates with figure captions.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { desk: '3A2E25', paper: 'FBF7EE', edge: 'E4DAC6', ink: '2B2118', blue: '23395B', muted: '6B5E4E', rule: 'CDBFA5' };
const F = { head: 'Times New Roman', body: 'Times New Roman' };
const PY = 0.3, PH = 5.0, LX = 0.35, RX = 5.05, PW = 4.6, IN = 0.45; // page geometry
const gutterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="10"><defs><linearGradient id="g"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0.22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="200" height="10" fill="url(#g)"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const gutter = await L.svg(gutterSvg, 200, 10);
  let page = 0;

  // returns content boxes for the left and right pages
  const spread = (opts = {}) => {
    const s = pres.addSlide(); s.background = { color: C.desk };
    for (const k of [3, 2, 1]) { t.rect(s, LX - 0.03 * k, PY + 0.03 * k, PW, PH, C.edge, { name: 'Page edge' }); t.rect(s, RX + 0.03 * k, PY + 0.03 * k, PW, PH, C.edge, { name: 'Page edge' }); }
    t.rect(s, LX, PY, PW, PH, C.paper, { name: 'Left page' }); t.rect(s, RX, PY, PW, PH, C.paper, { name: 'Right page' });
    t.img(s, gutter, LX + PW - 0.45, PY, 1.0, PH);
    page += 2;
    if (!opts.bare) {
      t.text(s, M.topic || '', { x: LX + IN, y: PY + 0.18, w: PW - 2 * IN, h: 0.25, fontSize: 9, italic: true, color: C.muted });
      t.text(s, meta, { x: RX + IN, y: PY + 0.18, w: PW - 2 * IN, h: 0.25, fontSize: 9, italic: true, color: C.muted, align: 'right' });
      t.text(s, String(page - 1), { x: LX + IN, y: PY + PH - 0.4, w: 1, h: 0.25, fontSize: 10, color: C.muted });
      t.text(s, String(page), { x: RX + PW - IN - 1, y: PY + PH - 0.4, w: 1, h: 0.25, fontSize: 10, color: C.muted, align: 'right' });
    }
    const box = (x) => ({ x: x + IN, y: PY + 0.6, w: PW - 2 * IN, h: PH - 1.15 });
    return { s, A: box(LX), B: box(RX) };
  };
  const chapter = (s, b, label, title) => {
    t.text(s, label, { x: b.x, y: b.y, w: b.w, h: 0.28, fontSize: 11, italic: true, color: C.blue });
    t.text(s, title, { x: b.x, y: b.y + 0.3, w: b.w, h: 0.75, fontSize: L.fit(title, b.w, 0.72, 24, 15, F.head, true), bold: true, color: C.ink, valign: 'top' });
    t.line(s, b.x, b.y + 1.12, 0.8, 0, C.rule, 1);
    return b.y + 1.3;
  };
  let fig = 0;
  const plate = async (s, b, img, caption, h = b.h - 0.45) => {
    fig++;
    t.rect(s, b.x, b.y, b.w, h, 'FFFFFF', { line: { color: C.rule, width: 0.75 }, name: 'Plate' });
    t.img(s, await L.photo(img, b.w - 0.16, h - 0.16), b.x + 0.08, b.y + 0.08, b.w - 0.16, h - 0.16, { alt: caption });
    t.text(s, [{ text: TR.figure(fig), options: { bold: true } }, { text: caption, options: {} }], { x: b.x, y: b.y + h + 0.06, w: b.w, h: 0.32, fontSize: 10, italic: true, color: C.muted });
  };
  let chap = 0;
  const std = (d) => { const sp = spread(); chap++; const y = chapter(sp.s, sp.A, TR.chapter(chap), d.title); return { ...sp, y }; };

  const R = {
    async cover(d) {
      const { s, A, B } = spread();
      await plate(s, A, L.src(d.image), d.title, A.h - 0.4);
      t.text(s, M.org || '', { x: B.x, y: B.y + 0.1, w: B.w, h: 0.3, fontSize: 13, bold: true, color: C.blue, align: 'center' });
      t.line(s, B.x + B.w / 2 - 0.6, B.y + 0.5, 1.2, 0, C.rule, 1);
      t.text(s, d.title, { x: B.x, y: B.y + 0.7, w: B.w, h: 1.6, fontSize: L.fit(d.title, B.w, 1.55, 30, 18, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.subtitle) t.text(s, d.subtitle, { x: B.x, y: B.y + 2.35, w: B.w, h: 0.75, fontSize: 12, italic: true, color: C.muted, align: 'center' });
      t.text(s, M.author || '', { x: B.x, y: B.y + 3.15, w: B.w, h: 0.3, fontSize: 14, bold: true, color: C.ink, align: 'center' });
      t.text(s, [M.loc, M.year].filter(Boolean).join(' \u2014 '), { x: B.x, y: B.y + 3.5, w: B.w, h: 0.3, fontSize: 12, color: C.muted, align: 'center' });
    },
    async intro(d) {
      const { s, A, B } = spread();
      const y = chapter(s, A, TR.preface, d.title);
      t.text(s, d.text, { x: A.x, y, w: A.w, h: A.y + A.h - y, fontSize: L.fit(d.text, A.w, A.y + A.h - y, 14, 10, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, align: 'justify' });
      await plate(s, B, L.src(d.image), d.title);
    },
    async agenda(d) {
      const { s, A, B } = spread();
      const y = chapter(s, A, TR.contents, d.title), half = Math.ceil(d.items.length / 2);
      const row = (b, yy, it, i, rh) => {
        t.text(s, `${i + 1}.`, { x: b.x, y: yy, w: 0.4, h: rh, fontSize: 15, bold: true, color: C.blue, valign: 'middle' });
        t.text(s, it, { x: b.x + 0.45, y: yy, w: b.w - 0.45, h: rh, fontSize: 15, color: C.ink, valign: 'middle' });
        t.line(s, b.x + 0.45, yy + rh - 0.05, b.w - 0.45, 0, C.rule, 0.5, { dash: 'sysDot' });
      };
      const rhA = (A.y + A.h - y) / half;
      d.items.slice(0, half).forEach((it, i) => row(A, y + i * Math.min(0.62, rhA), it, i, Math.min(0.62, rhA)));
      d.items.slice(half).forEach((it, i) => row(B, B.y + 0.2 + i * 0.62, it, i + half, 0.62));
    },
    async image(d) {
      const { s, A, B } = spread();
      await plate(s, A, L.src(d.image), d.title);
      chap++; const y = chapter(s, B, TR.chapter(chap), d.title);
      t.text(s, d.text, { x: B.x, y, w: B.w, h: B.y + B.h - y, fontSize: L.fit(d.text, B.w, B.y + B.h - y, 14, 10, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, align: 'justify' });
    },
    async cards(d) {
      const { s, A, B, y } = std(d);
      const boxes = d.items.map((it, i) => (i === 0 ? { b: A, y0: y } : { b: B, y0: B.y + (i - 1) * ((B.h) / Math.max(1, d.items.length - 1)) }));
      const restH = B.h / Math.max(1, d.items.length - 1);
      d.items.forEach((it, i) => {
        const { b, y0 } = boxes[i], h = i === 0 ? A.y + A.h - y : restH - 0.1;
        t.text(s, String(i + 1), { x: b.x, y: y0, w: 0.5, h: 0.6, fontSize: 32, bold: true, color: C.blue });
        t.text(s, it.h, { x: b.x + 0.55, y: y0 + 0.02, w: b.w - 0.55, h: 0.35, fontSize: 15, bold: true, color: C.ink });
        t.text(s, it.t, { x: b.x + 0.55, y: y0 + 0.37, w: b.w - 0.55, h: Math.min(h - 0.4, 1.2), fontSize: L.fit(it.t, b.w - 0.55, Math.min(h - 0.4, 1.2), 13, 10, F.body), color: C.muted });
      });
    },
    async process(d) {
      const { s, A, B, y } = std(d), n = d.steps.length, inA = Math.min(2, n - Math.ceil(n / 2)) || 1;
      const place = (b, y0, list, start, h) => list.forEach((st, k) => {
        const yy = y0 + k * h;
        t.text(s, TR.qstep(start + k + 1), { x: b.x, y: yy, w: b.w, h: 0.26, fontSize: 11, italic: true, color: C.blue });
        t.text(s, st.h, { x: b.x, y: yy + 0.26, w: b.w, h: 0.34, fontSize: 15, bold: true, color: C.ink });
        t.text(s, st.t, { x: b.x, y: yy + 0.6, w: b.w, h: h - 0.68, fontSize: L.fit(st.t, b.w, h - 0.7, 13, 10, F.body), color: C.muted });
      });
      const a = d.steps.slice(0, inA), r = d.steps.slice(inA);
      place(A, y, a, 0, (A.y + A.h - y) / a.length);
      place(B, B.y, r, inA, B.h / Math.max(1, r.length));
    },
    async stats(d) {
      const { s, A, B, y } = std(d);
      if (d.note) t.text(s, d.note, { x: A.x, y, w: A.w, h: 1.2, fontSize: 12, italic: true, color: C.muted });
      const rh = B.h / d.stats.length;
      d.stats.forEach((x, i) => {
        const yy = B.y + i * rh;
        t.text(s, x.value, { x: B.x, y: yy, w: 1.45, h: rh - 0.1, fontSize: L.fit(x.value, 1.45, rh - 0.2, 38, 18, F.head, true), bold: true, color: C.blue, valign: 'middle' });
        t.text(s, x.label, { x: B.x + 1.55, y: yy, w: B.w - 1.55, h: rh - 0.1, fontSize: 13, color: C.ink, valign: 'middle' });
        if (i < d.stats.length - 1) t.line(s, B.x, yy + rh - 0.05, B.w, 0, C.rule, 0.5);
      });
    },
    async compare(d) {
      const { s, A, B, y } = std(d);
      const col = (b, y0, side, accent) => {
        t.text(s, side.h, { x: b.x, y: y0, w: b.w, h: 0.4, fontSize: 16, bold: true, italic: true, color: accent });
        side.items.forEach((it, k) => { t.text(s, `\u2014 ${it}`, { x: b.x, y: y0 + 0.5 + k * 0.5, w: b.w, h: 0.48, fontSize: L.fit(it, b.w - 0.3, 0.46, 14, 10, F.body), color: C.ink }); });
      };
      col(A, y, d.left, C.muted); col(B, B.y + 0.2, d.right, C.blue);
    },
    async statement(d) {
      const { s, A, B, y } = std(d);
      if (d.caption) t.text(s, d.caption, { x: A.x, y, w: A.w, h: A.y + A.h - y, fontSize: L.fit(d.caption, A.w, A.y + A.h - y, 14, 10, F.body, false, 1.3), color: C.muted, lineSpacingMultiple: 1.3 });
      t.text(s, '\u2766', { x: B.x, y: B.y + 0.3, w: B.w, h: 0.5, fontSize: 24, color: C.rule, align: 'center' });
      t.text(s, L.runs(d.text), { x: B.x, y: B.y + 0.9, w: B.w, h: 2.4, fontSize: L.fit(d.text, B.w, 2.3, 26, 16, F.head, false, 1, true), italic: true, color: C.ink, align: 'center', valign: 'middle' });
    },
    async timeline(d) {
      const { s, A, B, y } = std(d), half = Math.ceil(d.items.length / 2);
      const col = (b, y0, list, h) => {
        t.line(s, b.x + 0.75, y0 + 0.1, 0, h * (list.length - 1) + 0.2, C.rule, 1);
        list.forEach((it, k) => {
          const yy = y0 + k * h;
          t.text(s, it.year, { x: b.x, y: yy, w: 0.65, h: 0.3, fontSize: 13, bold: true, color: C.blue });
          t.oval(s, b.x + 0.7, yy + 0.08, 0.1, 0.1, C.blue);
          t.text(s, it.h, { x: b.x + 0.95, y: yy, w: b.w - 0.95, h: 0.3, fontSize: 14, bold: true, color: C.ink });
          t.text(s, it.t, { x: b.x + 0.95, y: yy + 0.3, w: b.w - 0.95, h: h - 0.35, fontSize: L.fit(it.t, b.w - 0.95, h - 0.38, 12, 9, F.body), color: C.muted });
        });
      };
      col(A, y, d.items.slice(0, half), (A.y + A.h - y) / half);
      col(B, B.y, d.items.slice(half), B.h / Math.max(1, d.items.length - half));
    },
    async quote(d) {
      const { s, A, B } = spread();
      t.text(s, '\u2766', { x: A.x, y: A.y + 1.4, w: A.w, h: 1.0, fontSize: 54, color: C.rule, align: 'center' });
      t.text(s, d.text, { x: B.x, y: B.y + 0.4, w: B.w, h: 2.6, fontSize: L.fit(d.text, B.w, 2.5, 24, 14, F.head, false, 1, true), italic: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: B.x, y: B.y + 3.2, w: B.w, h: 0.35, fontSize: 12, color: C.muted, align: 'center' });
    },
    async sources(d) {
      const { s, A, B } = spread();
      const y = chapter(s, A, TR.references, d.title), half = Math.min(d.items.length, 3);
      const list = (b, y0, items, start, h) => items.forEach((it, k) => t.text(s, `${start + k + 1}. ${it}`, { x: b.x, y: y0 + k * h, w: b.w, h: h - 0.05, fontSize: L.fit(`${start + k + 1}. ${it}`, b.w, h - 0.08, 12, 9, F.body), color: C.ink }));
      list(A, y, d.items.slice(0, half), 0, (A.y + A.h - y) / half);
      list(B, B.y, d.items.slice(half), half, Math.min(1.0, B.h / Math.max(1, d.items.length - half)));
    },
    async closing(d) {
      const { s, A, B } = spread();
      await plate(s, A, L.src(d.image), d.title);
      t.text(s, d.title, { x: B.x, y: B.y + 0.5, w: B.w, h: 1.4, fontSize: L.fit(d.title, B.w, 1.35, 28, 16, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.subtitle) t.text(s, d.subtitle, { x: B.x, y: B.y + 2.0, w: B.w, h: 0.4, fontSize: 13, italic: true, color: C.muted, align: 'center' });
      t.line(s, B.x + B.w / 2 - 0.6, B.y + 2.6, 1.2, 0, C.rule, 1);
      t.text(s, M.author || '', { x: B.x, y: B.y + 2.8, w: B.w, h: 0.3, fontSize: 14, bold: true, color: C.ink, align: 'center' });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: B.x, y: B.y + 3.12, w: B.w, h: 0.3, fontSize: 12, color: C.muted, align: 'center' });
    },
  };
  // ---- further ways to draw a type, all around the book: a deck's pages must not look alike (L.pages)
  const GOLD = 'D8B65C', CLOTH = '1B2D49', RED = '8C2F27', GREEN = '2F4A3A';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', italic: o.italic });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.25), color: o.color || C.ink, lineSpacingMultiple: 1.25, valign: o.valign || 'top', align: o.align });
  const halves = (v, f = 0.5) => { const k = v.indexOf(' ', Math.floor(v.length * f)); return k < 0 ? [v, ''] : [v.slice(0, k), v.slice(k + 1)]; };
  // one large folio sheet, no fold: atlas, chronicle
  const folio = (d) => {
    const s = pres.addSlide(); s.background = { color: C.desk }; page += 2;
    for (const k of [3, 2, 1]) t.rect(s, 0.35 + 0.03 * k, PY + 0.03 * k, 9.3, PH, C.edge, { name: 'Page edge' });
    t.rect(s, 0.35, PY, 9.3, PH, C.paper, { name: 'Sheet' });
    t.text(s, M.topic || '', { x: 0.8, y: 4.92, w: 4.0, h: 0.25, fontSize: 9, italic: true, color: C.muted });
    t.text(s, `${meta}   ·   ${page}`, { x: 4.4, y: 4.92, w: 4.8, h: 0.25, fontSize: 9, italic: true, color: C.muted, align: 'right' });
    if (d.title) t.text(s, d.title, { x: 0.8, y: 0.42, w: 8.4, h: 0.62, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 8.4, 0.6, 24, 16, F.head, true) });
    return s;
  };
  // the closed book: blue cloth, gold stamping
  const cloth = (d) => {
    const s = pres.addSlide(); s.background = { color: C.desk }; page += 2;
    t.rect(s, 0.68, 0.28, 8.8, 5.12, '12203A', { name: 'Board edge' });
    t.rect(s, 0.6, 0.2, 8.8, 5.12, CLOTH, { name: 'Cloth' });
    t.rect(s, 0.6, 0.2, 0.34, 5.12, '14233A', { name: 'Hinge' });
    t.rect(s, 1.1, 0.34, 8.15, 4.84, null, { line: { color: GOLD, width: 1.25 }, name: 'Gold rule' });
    t.rect(s, 1.17, 0.41, 8.01, 4.7, null, { line: { color: GOLD, width: 0.5 }, name: 'Gold rule' });
    t.text(s, `${M.topic || ''}   ·   ${meta}   ·   ${page}`, { x: 1.35, y: 4.8, w: 7.65, h: 0.25, fontSize: 9, italic: true, color: GOLD, align: 'center' });
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.5, w: 7.6, h: 0.56, bold: true, color: GOLD, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.54, 22, 15, F.head, true) });
    return s;
  };
  // the bare desk, things laid out on it
  const desk = (d) => {
    const s = pres.addSlide(); s.background = { color: C.desk }; page += 2;
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.2, w: 9, h: 0.68, bold: true, color: C.paper, valign: 'middle', fontSize: L.fit(d.title, 9, 0.66, 26, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ·   ${meta}   ·   ${page}`, { x: 0.5, y: 5.27, w: 9, h: 0.24, fontSize: 9, italic: true, color: C.edge, align: 'right', valign: 'middle' });
    return s;
  };
  const V = {
    image: [
      async (d) => { // a plate across both pages, the words running below on either side of the fold
        const { s, A, B } = spread(), ph = 2.3, [a, b] = halves(d.text);
        t.img(s, await L.photo(L.src(d.image), 8.4, ph), A.x, PY + 0.5, B.x + B.w - A.x, ph, { alt: d.title });
        t.img(s, gutter, LX + PW - 0.45, PY + 0.5, 1.0, ph);
        t.rect(s, A.x, PY + 0.5 + ph - 0.46, 5.4, 0.46, C.paper, { name: 'Label' });
        t.text(s, d.title, { x: A.x + 0.1, y: PY + 0.5 + ph - 0.46, w: 5.2, h: 0.46, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 5.2, 0.44, 17, 12, F.head, true) });
        longText(s, a, A.x, 3.2, A.w, 1.62, { max: 13, align: 'justify' });
        longText(s, b, B.x, 3.2, B.w, 1.62, { max: 13, align: 'justify' });
      },
      async (d) => { // a round vignette on the right page, the chapter opens with a great initial
        const { s, A, B } = spread(), y = chapter(s, A, TR.chapter(++chap), d.title), dia = 3.0, vx = B.x + (B.w - dia) / 2, vy = B.y + 0.2;
        t.text(s, d.text.slice(0, 1), { x: A.x, y: y - 0.06, w: 0.62, h: 0.75, fontSize: 44, bold: true, color: C.blue });
        longText(s, d.text.slice(1), A.x + 0.6, y, A.w - 0.6, A.y + A.h - y, { max: 12.5 });
        t.oval(s, vx - 0.1, vy - 0.1, dia + 0.2, dia + 0.2, null, { line: { color: C.rule, width: 1 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), vx, vy, dia, dia, { alt: d.title });
        t.text(s, '❦', { x: B.x, y: vy + dia + 0.14, w: B.w, h: 0.4, fontSize: 18, color: C.rule, align: 'center', valign: 'middle' });
      },
      async (d) => { // on the blue cover: a picture let into the cloth, the words stamped beside it
        const s = cloth({}), x = 1.45, y = 0.72, w = 3.5, h = 3.9;
        t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, GOLD, { name: 'Gold frame' });
        t.img(s, await L.photo(L.src(d.image), w, h), x, y, w, h, { alt: d.title });
        t.text(s, d.title, { x: 5.25, y: 0.62, w: 3.75, h: 1.0, bold: true, color: GOLD, valign: 'middle', fontSize: L.fit(d.title, 3.75, 0.98, 22, 15, F.head, true) });
        t.line(s, 5.25, 1.66, 0.9, 0, GOLD, 1);
        longText(s, d.text, 5.25, 1.78, 3.75, 2.92, { color: C.paper, max: 13 });
      },
      async (d) => { // a photograph held by paper corners; the text goes on over the fold and under it
        const { s, A, B } = spread(), y = chapter(s, A, TR.chapter(++chap), d.title), w = B.w, ph = 2.0, [a, b] = halves(d.text, 0.5);
        longText(s, a, A.x, y, A.w, A.y + A.h - y, { max: 13, align: 'justify' });
        t.rect(s, B.x, B.y, w, ph, 'FFFFFF', { shadow: 0.2, name: 'Print' });
        t.img(s, await L.photo(L.src(d.image), w - 0.2, ph - 0.2), B.x + 0.1, B.y + 0.1, w - 0.2, ph - 0.2, { alt: d.title });
        for (const [cx, cy, pts] of [[B.x - 0.04, B.y - 0.04, '0,0 100,0 0,100'], [B.x + w - 0.3, B.y - 0.04, '0,0 100,0 100,100'], [B.x - 0.04, B.y + ph - 0.3, '0,0 100,100 0,100'], [B.x + w - 0.3, B.y + ph - 0.3, '100,0 100,100 0,100']])
          t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><polygon points="${pts}" fill="#${C.muted}"/></svg>`, 100, 100), cx, cy, 0.34, 0.34);
        longText(s, b, B.x, B.y + ph + 0.12, B.w, B.h - ph - 0.12, { max: 13, align: 'justify' });
      },
    ],
    cards: [
      async (d) => { // the contents page: dots lead each heading to its number
        const s = folio(d), n = d.items.length, h = 3.72 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.1 + i * h, hw = Math.min(5.6, L.width(it.h, 15, F.head, true) + 0.15);
          t.img(s, await L.icon(it.icon, C.blue, 1.5), 0.8, y + 0.05, 0.3, 0.3);
          head(s, it.h, 1.25, y + 0.02, 5.8, 0.36, { max: 15 });
          t.line(s, 1.3 + hw, y + 0.3, 8.75 - 1.3 - hw, 0, C.rule, 1.25, { dash: 'sysDot' });
          t.text(s, String(i + 1), { x: 8.8, y: y + 0.02, w: 0.4, h: 0.36, fontSize: 16, bold: true, color: C.blue, align: 'right', valign: 'middle' });
          body(s, it.t, 1.25, y + 0.4, 7.4, h - 0.46, { color: C.muted, max: 13 });
        }
      },
      async (d) => { // library cards laid on the desk, red rule, a hole for the rod
        const s = desk(d), n = d.items.length, w = 4.4, h = 2.0;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 0.98 + Math.floor(i / 2) * (h + 0.12) + (i % 2 ? 0.06 : 0);
          t.rect(s, x, y, ww, h, C.paper, { shadow: 0.3, name: 'Card' });
          t.line(s, x, y + 0.5, ww, 0, RED, 1);
          t.oval(s, x + ww / 2 - 0.07, y + h - 0.2, 0.14, 0.14, C.desk, { name: 'Hole' });
          t.img(s, await L.icon(it.icon, C.blue, 1.75), x + 0.15, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.55, y + 0.06, ww - 0.7, 0.4, { max: 15 });
          body(s, it.t, x + 0.2, y + 0.58, ww - 0.4, h - 0.82, { max: 13 });
        }
      },
      async (d) => { // volumes standing on a shelf, of different heights, a subject on each
        const s = desk(d), n = d.items.length, g = 0.1, w = (9 - g * (n - 1)) / n, base = 5.08, fills = [C.blue, RED, GREEN, CLOTH], tops = [1.05, 1.35, 1.0, 1.28];
        t.rect(s, 0, base, W, 0.14, '1E1610', { name: 'Shelf' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + g), y = tops[i], h = base - y;
          t.rect(s, x, y, w, h, fills[i], { name: 'Volume' });
          for (const py of [y + 0.1, base - 0.14]) t.rect(s, x, py, w, 0.04, GOLD, { name: 'Gold band' });
          t.img(s, await L.icon(it.icon, GOLD, 1.5), x + w / 2 - 0.2, y + 0.24, 0.4, 0.4);
          head(s, it.h, x + 0.14, y + 0.7, w - 0.28, 0.54, { color: GOLD, align: 'center', max: 14 });
          body(s, it.t, x + 0.14, y + 1.26, w - 0.28, h - 1.46, { color: C.paper, align: 'center', max: 12.5 });
        }
      },
      async (d) => { // gold stamped on the cover, cell by cell
        const s = cloth(d), n = d.items.length, w = 3.85, h = 1.78;
        t.line(s, 1.4, 1.08, 7.6, 0, GOLD, 0.5);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 7.65 : w, x = 1.35 + (i % 2) * 3.95, y = 1.12 + Math.floor(i / 2) * h;
          t.oval(s, x + 0.05, y + 0.12, 0.56, 0.56, null, { line: { color: GOLD, width: 1 } });
          t.img(s, await L.icon(it.icon, GOLD, 1.5), x + 0.19, y + 0.26, 0.28, 0.28);
          head(s, it.h, x + 0.72, y + 0.1, ww - 0.82, 0.4, { color: GOLD, max: 15 });
          body(s, it.t, x + 0.72, y + 0.52, ww - 0.82, h - 0.6, { color: C.paper, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // a folio set in columns with Roman numerals over them
        const s = folio(d), n = d.steps.length, cw = 8.4 / n;
        t.line(s, 0.8, 1.08, 8.4, 0, C.ink, 1.25);
        d.steps.forEach((st, i) => {
          const x = 0.8 + i * cw;
          if (i) t.line(s, x, 1.2, 0, 3.55, C.rule, 0.75);
          t.text(s, L.ROMAN[i] || String(i + 1), { x: x + 0.1, y: 1.15, w: cw - 0.2, h: 0.62, fontSize: 30, bold: true, color: C.blue, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.14, 1.78, cw - 0.28, 0.56, { align: 'center', max: 15, valign: 'top' });
          body(s, st.t, x + 0.14, 2.36, cw - 0.28, 2.42, { align: 'center', max: 13 });
        });
      },
      async (d) => { // the ribbon runs down the fold, the steps taking turns on the two pages
        const { s, A, B } = spread(), y = chapter(s, A, TR.chapter(++chap), d.title), n = d.steps.length;
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="510"><polygon points="0,0 30,0 30,510 15,490 0,510" fill="#${RED}"/></svg>`, 30, 510), 4.9, PY - 0.06, 0.2, 5.1);
        const lh = (A.y + A.h - y) / Math.ceil(n / 2), rh = (B.h - 0.55) / Math.max(1, Math.floor(n / 2));
        d.steps.forEach((st, i) => {
          const left = i % 2 === 0, k = Math.floor(i / 2), yy = left ? y + k * lh : B.y + (n === 3 ? 1.2 : 0.3) + k * rh, h = left ? lh : rh, b = left ? A : B;
          t.oval(s, 4.82, yy + 0.02, 0.36, 0.36, RED, { line: { color: C.paper, width: 1.5 } });
          t.text(s, String(i + 1), { x: 4.82, y: yy + 0.02, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: C.paper, align: 'center', valign: 'middle' });
          head(s, st.h, b.x, yy, b.w, 0.34, { align: left ? 'right' : 'left', max: 14 });
          body(s, st.t, b.x, yy + 0.35, b.w, n === 3 && !left ? 1.5 : h - 0.4, { align: left ? 'right' : 'left', color: C.muted, max: 13 });
        });
      },
      async (d) => { // a pile of books on the desk, each lying a little askew from the one below
        const s = desk(d), n = d.steps.length, g = 0.07, h = (4.2 - g * (n - 1)) / n, fills = [RED, C.blue, GREEN, CLOTH], off = [0.8, 0.35, 0.6, 0];
        d.steps.forEach((st, i) => {
          const y = 0.98 + i * (h + g), x = 0.5 + off[n === 3 ? i + 1 : i], w = 8.4;
          t.rect(s, x, y, w, h, fills[i], { r: 0.03, name: 'Book' });
          for (const px of [x + 0.14, x + 0.86]) t.rect(s, px, y, 0.05, h, GOLD, { name: 'Gold band' });
          t.text(s, String(i + 1), { x: x + 0.2, y, w: 0.65, h, fontSize: 24, bold: true, color: GOLD, align: 'center', valign: 'middle' });
          head(s, st.h, x + 1.05, y + 0.05, 2.3, h - 0.1, { color: GOLD, max: 15 });
          body(s, st.t, x + 3.45, y + 0.05, w - 3.6, h - 0.1, { color: C.paper, max: 12.5, valign: 'middle' });
        });
      },
      async (d) => { // the thumb index: tabs step down the edge of the sheet, the text steps in with them
        const s = folio(d), n = d.steps.length, h = 3.68 / n, dx = n === 3 ? 0.5 : 0.36;
        d.steps.forEach((st, i) => {
          const y = 1.1 + i * h, x = 0.8 + i * dx, w = 8.05 - 3 * 0.36;
          t.rect(s, 9.32, y + 0.04, 0.48, h - 0.1, [C.blue, RED, GREEN, CLOTH][i], { name: 'Tab' });
          t.text(s, String(i + 1), { x: 9.32, y: y + 0.04, w: 0.48, h: h - 0.1, fontSize: 16, bold: true, color: C.paper, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.02, w, 0.34, { max: 15 });
          body(s, st.t, x, y + 0.37, w, h - 0.44, { color: C.muted, max: 13 });
          if (i < n - 1) t.line(s, x, y + h - 0.04, w, 0, C.rule, 0.5);
        });
      },
    ],
    stats: [
      async (d) => { // the big figure stamped in gold on the cover
        const s = cloth(d), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: 1.45, y: 1.12, w: 7.3, h: 1.4, bold: true, color: GOLD, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 7.3, 1.35, 76, 36, F.head, true) });
        body(s, a.label, 1.9, 2.52, 6.4, 0.42, { color: C.paper, align: 'center', max: 14 });
        t.line(s, 1.45, 3.0, 7.3, 0, GOLD, 0.5);
        rest.forEach((x, i) => {
          const px = 1.45 + i * 2.5;
          t.text(s, x.value, { x: px, y: 3.06, w: 2.35, h: 0.72, bold: true, color: GOLD, valign: 'middle', fontSize: L.fit(x.value, 2.35, 0.68, 30, 16, F.head, true) });
          body(s, x.label, px, 3.78, 2.3, 0.9, { color: C.paper, max: 12 });
        });
        if (d.note) { t.line(s, 6.4, 3.12, 0, 1.55, GOLD, 0.5); body(s, d.note, 6.5, 3.08, 2.55, 1.64, { color: C.paper, max: 10.5, italic: true, valign: 'middle' }); }
      },
      async (d) => { // three figures in columns, an ornament over each, the note as a footnote under a short rule
        const s = folio(d), cw = 8.4 / 3;
        d.stats.forEach((x, i) => {
          const px = 0.8 + i * cw;
          t.text(s, '❦', { x: px, y: 1.06, w: cw, h: 0.36, fontSize: 16, color: C.rule, align: 'center', valign: 'middle' });
          t.text(s, x.value, { x: px + 0.1, y: 1.42, w: cw - 0.2, h: 1.0, bold: true, color: C.blue, align: 'center', valign: 'middle', fontSize: L.fit(x.value, cw - 0.2, 0.95, 46, 24, F.head, true) });
          body(s, x.label, px + 0.2, 2.44, cw - 0.4, 0.8, { align: 'center', italic: true, max: 14 });
        });
        if (d.note) {
          t.line(s, 0.8, 3.42, 1.6, 0, C.ink, 0.75);
          t.text(s, '*', { x: 0.8, y: 3.48, w: 0.2, h: 0.3, fontSize: 12, color: C.muted });
          body(s, d.note, 1.0, 3.5, 8.2, 1.32, { color: C.muted, max: 12 });
        }
      },
    ],
    compare: [
      async (d) => { // the two pages answer one another, lines set away from the fold
        const { s, A, B } = spread();
        t.text(s, d.title, { x: A.x, y: PY + 0.42, w: A.w, h: 0.58, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, A.w, 0.56, 20, 12, F.head, true) });
        [[A, d.left, 'right', C.muted], [B, d.right, 'left', C.blue]].forEach(([b, side, align, col]) => {
          t.text(s, side.h, { x: b.x, y: 1.32, w: b.w, h: 0.42, bold: true, italic: true, color: col, align, valign: 'middle', fontSize: L.fit(side.h, b.w, 0.4, 17, 12, F.head, true, 1, true) });
          t.line(s, b.x, 1.76, b.w, 0, C.rule, 1);
          const n = side.items.length, rh = 2.92 / n;
          side.items.forEach((it, k) => body(s, it, b.x, 1.84 + k * rh, b.w, rh - 0.04, { align, max: 13.5, valign: 'middle' }));
        });
      },
      async (d) => { // a folio ruled into two tables, one above the other
        const s = folio(d), bh = 1.78;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.06 + i * (bh + 0.06), n = side.items.length, x0 = 2.75, cw = (9.2 - x0) / n, col = i ? C.blue : C.muted;
          t.line(s, 0.8, y, 8.4, 0, C.ink, i ? 0.75 : 1.25);
          t.text(s, side.h, { x: 0.8, y: y + 0.08, w: 1.8, h: bh - 0.16, bold: true, italic: true, color: col, valign: 'middle', fontSize: L.fit(side.h, 1.8, bh - 0.2, 18, 12, F.head, true, 1, true) });
          side.items.forEach((it, k) => {
            t.line(s, x0 + k * cw - 0.08, y + 0.14, 0, bh - 0.28, C.rule, 0.75);
            body(s, it, x0 + k * cw + 0.04, y + 0.08, cw - 0.2, bh - 0.16, { max: 13.5, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the line stamped in gold on the cover, an ornament above
        const s = cloth({});
        t.text(s, '❦', { x: 1.4, y: 0.5, w: 7.6, h: 0.5, fontSize: 24, color: GOLD, align: 'center', valign: 'middle' });
        if (d.title) t.text(s, d.title, { x: 1.6, y: 1.0, w: 7.2, h: 0.32, italic: true, color: GOLD, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.3, 14, 10, F.head, false, 1, true) });
        t.text(s, L.runs(d.text), { x: 1.6, y: 1.36, w: 7.2, h: 1.95, bold: true, color: C.paper, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 7.2, 1.9, 30, 18, F.head, true) });
        if (d.caption) body(s, d.caption, 2.0, 3.42, 6.4, 1.3, { color: C.edge, align: 'center', italic: true, max: 13 });
      },
      async (d) => { // an epigraph: the sheet nearly empty, the words kept to the right, a great ornament to the left
        const s = folio({});
        t.text(s, '❦', { x: 0.7, y: 1.3, w: 2.5, h: 2.6, fontSize: 110, color: C.edge, align: 'center', valign: 'middle' });
        if (d.title) t.text(s, d.title, { x: 3.3, y: 0.55, w: 5.9, h: 0.36, bold: true, color: C.blue, align: 'right', valign: 'middle', fontSize: L.fit(d.title, 5.9, 0.34, 14, 10, F.head, true) });
        t.text(s, L.runs(d.text), { x: 3.3, y: 0.98, w: 5.9, h: 2.25, italic: true, color: C.ink, align: 'right', valign: 'middle', fontSize: L.fit(d.text, 5.9, 2.2, 28, 18, F.head, false, 1, true) });
        t.line(s, 7.6, 3.3, 1.6, 0, C.rule, 1);
        if (d.caption) body(s, d.caption, 3.3, 3.4, 5.9, 1.42, { color: C.muted, align: 'right', max: 12.5 });
      },
    ],
    timeline: [
      async (d) => { // annals: year in the margin, ruled from edge to edge of the sheet
        const s = folio(d), h = 0.92;
        t.line(s, 2.35, 1.08, 0, 4 * h - 0.1, C.ink, 0.75);
        d.items.forEach((it, i) => {
          const y = 1.08 + i * h;
          if (i) t.line(s, 0.8, y - 0.03, 8.4, 0, C.rule, 0.5);
          t.text(s, it.year, { x: 0.8, y, w: 1.45, h: h - 0.06, bold: true, color: C.blue, valign: 'middle', fontSize: L.fit(it.year, 1.45, h - 0.15, 24, 13, F.head, true) });
          head(s, it.h, 2.5, y, 2.0, h - 0.06, { max: 15 });
          body(s, it.t, 4.6, y, 4.6, h - 0.06, { color: C.muted, max: 12.5, valign: 'middle' });
        });
      },
      async (d) => { // a ribbon laid across both pages, events above and under it
        const { s, A, B } = spread(), ly = 2.78;
        t.text(s, d.title, { x: A.x, y: PY + 0.36, w: A.w, h: 0.5, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, A.w, 0.48, 19, 12, F.head, true) });
        t.rect(s, LX, ly - 0.07, 2 * PW + 0.1, 0.14, RED, { name: 'Ribbon' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, b = i < 2 ? A : B, y = up ? 1.24 : ly + 0.2;
          t.rect(s, b.x + (i % 2 ? 2.0 : 0.3), ly - 0.13, 0.26, 0.26, C.paper, { line: { color: RED, width: 2 }, name: 'Stud' });
          t.text(s, it.year, { x: b.x, y, w: 1.3, h: 0.32, bold: true, color: C.blue, valign: 'middle', fontSize: L.fit(it.year, 1.3, 0.3, 16, 11, F.head, true) });
          head(s, it.h, b.x + 1.32, y, b.w - 1.32, 0.32, { max: 14 });
          body(s, it.t, b.x, y + 0.34, b.w, up ? 0.86 : 1.2, { color: C.muted, max: 12 });
        });
      },
      async (d) => { // the card drawer on the desk: each year on a tab, the tabs step across
        const s = desk(d), h = 1.0, tw = 1.45;
        d.items.forEach((it, i) => {
          const y = 1.0 + i * h, tx = 0.5 + i * 2.5, ch = h - 0.3;
          t.rect(s, tx, y, tw, 0.28, C.edge, { name: 'Tab' });
          t.text(s, it.year, { x: tx, y, w: tw, h: 0.28, bold: true, color: C.blue, align: 'center', valign: 'middle', fontSize: L.fit(it.year, tw - 0.1, 0.26, 14, 10, F.head, true) });
          t.rect(s, 0.5, y + 0.28, 9, ch + 0.02, C.paper, { name: 'Card' });
          head(s, it.h, 0.68, y + 0.3, 2.2, ch - 0.04, { max: 15 });
          body(s, it.t, 3.0, y + 0.3, 6.35, ch - 0.04, { color: C.muted, max: 12.5, valign: 'middle' });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.process = V.process.shift(); // the old ones read as the cards page: a chapter head, then rows
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Kitob', colors: { dk1: C.ink, lt1: C.paper, dk2: C.desk, lt2: C.edge, accent1: C.blue, accent2: C.muted, accent3: C.rule, accent4: '5C7499', accent5: 'A8957A', accent6: C.edge, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "kitob uslubi: ravon, bir-biriga bog'langan, to'liqroq gaplar", "limits": {"intro": 380, "image_text": 300}, "prefer": "text"};
module.exports = { id: 27, slug: 'kitob', name: 'Kitob', category: 'academic', photos: true, build, style: STYLE };
