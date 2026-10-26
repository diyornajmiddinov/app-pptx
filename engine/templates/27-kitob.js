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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Kitob', colors: { dk1: C.ink, lt1: C.paper, dk2: C.desk, lt2: C.edge, accent1: C.blue, accent2: C.muted, accent3: C.rule, accent4: '5C7499', accent5: 'A8957A', accent6: C.edge, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "kitob uslubi: ravon, bir-biriga bog'langan, to'liqroq gaplar", "limits": {"intro": 380, "image_text": 300}, "prefer": "text"};
module.exports = { id: 27, slug: 'kitob', name: 'Kitob', category: 'academic', photos: true, build, style: STYLE };
