/**
 * 63 Chek — till receipts: thermal-paper slips with zigzag torn edges, monospace type,
 * dashed separators, dotted leaders, big totals, a barcode at the bottom.
 * The receipt header carries the organisation, city and year.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'DCE1E6', paper: 'FCFBF7', ink: '2B2B2B', muted: '6D6D6D', red: 'C62828', line: 'BDBDBD' };
const F = { head: 'Courier New', body: 'Courier New' };

const slip = (w, h) => { // receipt with zigzag top and bottom
  const z = 12; let top = '', bot = '';
  for (let x = 0; x <= w; x += z) { top += `L${x},${(x / z) % 2 ? z * 0.7 : 0} `; bot += `L${w - x},${h - ((x / z) % 2 ? z * 0.7 : 0)} `; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M0,0 ${top} L${w},${h} ${bot} Z" fill="#${C.paper}"/></svg>`;
};
const barcode = (w, h, seed) => { let x = seed, b = '', px = 0; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  while (px < w) { const bw = 2 + Math.floor(rnd() * 3) * 2; if (rnd() > 0.35) b += `<rect x="${px}" y="0" width="${bw}" height="${h}" fill="#${C.ink}"/>`; px += bw + 2; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${b}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const receipt = async (s, x, y, w, h) => {
    t.rect(s, x + 0.06, y + 0.08, w, h, '9AA3AD', { t: 60, name: 'Shadow' });
    t.img(s, (memo[`s${w}${h}`] ??= await L.svg(slip(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100)), x, y, w, h);
  };
  const dash = (s, x, y, w) => t.line(s, x, y, w, 0, C.line, 1, { dash: 'dash' });
  const bars = async (s, x, y, w, h, k = 1) => t.img(s, (memo[`b${w}${h}${k}`] ??= await L.svg(barcode(Math.round(w * 100), Math.round(h * 100), 7 + k), w * 100, h * 100)), x, y, w, h);
  const leader = (s, left, right, x, y, w, h, fs = 13, bold = false) => { // "item ........ value"
    t.text(s, left, { x, y, w: w - 1.0, h, fontSize: fs, bold, color: C.ink, valign: 'middle' });
    t.text(s, right, { x: x + w - 1.0, y, w: 1.0, h, fontSize: fs, bold: true, color: C.ink, align: 'right', valign: 'middle' });
  };
  const head = (s, x, y, w) => { // shop header: organisation / city, year
    t.text(s, (M.org || 'SlideAI').toUpperCase(), { x, y, w, h: 0.3, fontSize: 12, bold: true, color: C.ink, align: 'center' });
    t.text(s, [M.loc, M.year].filter(Boolean).join(', '), { x, y: y + 0.3, w, h: 0.22, fontSize: 9, color: C.muted, align: 'center' });
    dash(s, x, y + 0.58, w);
  };
  const footer = (s) => t.text(s, `${M.topic || ''}  ***  ${meta}`, { x: 0.5, y: 5.27, w: 9.0, h: 0.22, fontSize: 8, color: '4F5964' });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.3, w: 7.6, h: 0.75, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.75, 28, 16, 'Arial', true) });
    t.rect(s, 8.3, 0.4, 1.2, 0.55, C.ink, { name: 'Ticket no' });
    t.text(s, `#${String(idx).padStart(4, '0')}`, { x: 8.3, y: 0.4, w: 1.2, h: 0.55, fontSize: 14, bold: true, color: C.paper, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const thermal = async (s, src, x, y, w, h) => t.img(s, await L.photo(L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await receipt(s, 5.9, 0.2, 3.5, 5.0);
    head(s, 6.1, 0.45, 3.1);
    if (d.image) await thermal(s, d.image, 6.25, 1.15, 2.8, 2.05);
    leader(s, M.author || '', '', 6.15, 3.3, 3.0, 0.32, 11, true);
    t.text(s, '= = = = = = = = = = = =', { x: 6.15, y: 3.65, w: 3.0, h: 0.25, fontSize: 10, color: C.muted, align: 'center' });
    await bars(s, 6.45, 4.0, 2.4, 0.55, 3);
    t.text(s, d.title, { x: 0.6, y: 0.7, w: 5.0, h: 2.6, fontFace: 'Arial', bold: true, fontSize: L.fit(d.title, 5.0, 2.5, 42, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 4.9, h: 0.9, fontSize: 13, color: C.muted });
    t.text(s, `>> ${M.author || ''}`, { x: 0.6, y: 4.45, w: 4.9, h: 0.4, fontSize: 15, bold: true, color: C.red });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await receipt(s, 0.6, 1.2, 3.6, 3.95); head(s, 0.8, 1.4, 3.2); await thermal(s, d.image, 0.85, 2.1, 3.1, 2.8); t.text(s, d.text, { x: 4.6, y: 1.3, w: 4.85, h: 3.8, fontSize: L.fit(d.text, 4.85, 3.8, 15, 10, F.body, false, 1.2), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.2 }); },
    async image(d) { const s = page(d); t.text(s, d.text, { x: 0.5, y: 1.3, w: 4.85, h: 3.8, fontSize: L.fit(d.text, 4.85, 3.8, 15, 10, F.body, false, 1.2), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.2 }); await receipt(s, 5.8, 1.2, 3.6, 3.95); head(s, 6.0, 1.4, 3.2); await thermal(s, d.image, 6.05, 2.1, 3.1, 2.8); },
    async agenda(d) {
      const s = page(d), n = d.items.length; await receipt(s, 2.0, 1.15, 6.0, 4.0); head(s, 2.3, 1.35, 5.4);
      const rh = Math.min(0.45, 2.6 / n);
      d.items.forEach((it, i) => leader(s, `${i + 1} x  ${it}`, String(i + 3).padStart(2, '0'), 2.35, 2.05 + i * rh, 5.3, rh, 13));
      dash(s, 2.3, 2.1 + n * rh, 5.4);
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        await receipt(s, x, 1.2, w, 3.95);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + w / 2 - 0.18, 1.45, 0.36, 0.36);
        t.text(s, it.h.toUpperCase(), { x: x + 0.15, y: 1.85, w: w - 0.3, h: 0.6, fontSize: L.fit(it.h.toUpperCase(), w - 0.3, 0.6, 13, 9, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        dash(s, x + 0.15, 2.5, w - 0.3);
        t.text(s, it.t, { x: x + 0.15, y: 2.6, w: w - 0.3, h: 2.05, fontSize: 12, color: C.ink });
        t.text(s, `${String(i + 1).padStart(2, '0')} ***`, { x: x + 0.15, y: 4.7, w: w - 0.3, h: 0.25, fontSize: 9, color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = 3.5 / n;
      d.steps.forEach((st, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `${String(i + 1).padStart(2, '0')}.`, { x: 1.15, y, w: 0.6, h: rh - 0.1, fontSize: 18, bold: true, color: C.red, valign: 'top' });
        t.text(s, st.h.toUpperCase(), { x: 1.8, y, w: 2.4, h: rh - 0.1, fontSize: 12, bold: true, color: C.ink, valign: 'top' });
        t.text(s, st.t, { x: 4.3, y, w: 4.6, h: rh - 0.1, fontSize: 12, color: C.ink, valign: 'top' });
        if (i < n - 1) dash(s, 1.15, y + rh - 0.05, 7.7);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.5 + i * (w + gap);
        await receipt(s, px, 1.2, w, 3.1);
        t.text(s, '\u2211', { x: px + 0.15, y: 1.4, w: w - 0.3, h: 0.35, fontSize: 14, bold: true, color: C.muted, align: 'center' });
        t.text(s, x.value, { x: px + 0.15, y: 1.75, w: w - 0.3, h: 1.0, fontSize: L.fit(x.value, w - 0.3, 0.95, 44, 18, F.head, true), bold: true, color: i === 0 ? C.red : C.ink, align: 'center', valign: 'middle' });
        dash(s, px + 0.15, 2.85, w - 0.3);
        t.text(s, x.label, { x: px + 0.15, y: 2.95, w: w - 0.3, h: 1.15, fontSize: 11, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.45, w: 9.0, h: 0.7, fontSize: 10, color: '4F5964' });
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.6, F.body, 0.15, 4.95 - 2.15);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4);
        await receipt(s, x, 1.2, w, 3.95);
        t.text(s, side.h.toUpperCase(), { x: x + 0.2, y: 1.4, w: w - 0.4, h: 0.5, fontSize: 14, bold: true, color: i ? C.ink : C.red, align: 'center', valign: 'middle' });
        dash(s, x + 0.2, 1.98, w - 0.4);
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, i ? '+' : '-', { x: x + 0.2, y, w: 0.25, h: 0.3, fontSize: 14, bold: true, color: i ? C.ink : C.red }); t.text(s, it, { x: x + 0.45, y, w: w - 0.65, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = page(d); await receipt(s, 1.5, 1.15, 7.0, 4.0); head(s, 1.8, 1.35, 6.4);
      t.text(s, L.runs(d.text), { x: 1.85, y: 2.05, w: 6.3, h: 1.75, fontFace: 'Arial', bold: true, fontSize: L.fit(d.text, 6.3, 1.7, 30, 16, 'Arial', true), color: C.ink, align: 'center', valign: 'middle' });
      dash(s, 1.8, 3.85, 6.4);
      if (d.caption) t.text(s, d.caption, { x: 1.85, y: 3.95, w: 6.3, h: 1.0, fontSize: 11, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = 3.5 / n;
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, it.year, { x: 1.15, y, w: 1.4, h: rh - 0.1, fontSize: 14, bold: true, color: C.red, valign: 'top' });
        t.text(s, it.h.toUpperCase(), { x: 2.6, y, w: 2.1, h: rh - 0.1, fontSize: 12, bold: true, color: C.ink, valign: 'top' });
        t.text(s, it.t, { x: 4.75, y, w: 4.15, h: rh - 0.1, fontSize: 12, color: C.ink, valign: 'top' });
        if (i < n - 1) dash(s, 1.15, y + rh - 0.05, 7.7);
      });
    },
    async quote(d) {
      const s = page({}); await receipt(s, 2.0, 0.6, 6.0, 4.55); head(s, 2.3, 0.8, 5.4);
      t.text(s, `"${d.text}"`, { x: 2.35, y: 1.55, w: 5.3, h: 2.1, bold: true, fontSize: L.fit(d.text, 5.3, 2.0, 22, 12, F.body, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `-- ${d.author} --`, { x: 2.35, y: 3.7, w: 5.3, h: 0.35, fontSize: 12, color: C.muted, align: 'center' });
      await bars(s, 3.6, 4.15, 2.8, 0.55, 5);
    },
    async sources(d) {
      const s = page(d), n = d.items.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 1.15, y, w: 0.55, h: rh, fontSize: 12, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.75, y, w: 7.15, h: rh, fontSize: 12, color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all at the till: a deck's pages must not look alike (L.pages)
  const NIGHT = '2B2B2B', PALE = 'E8E6DF', LED = 'FF5A4F';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 12, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const cap = (s, v, x, y, w, h, o = {}) => { const u = String(v).toUpperCase(); t.text(s, u, { x, y, w, h, bold: true, fontSize: L.fit(u, w, h, o.max || 13, 9, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' }); };
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    t.text(s, d.title, { x: 0.5, y: 0.3, w: 7.6, h: 0.75, fontFace: 'Arial', bold: true, color: C.paper, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.75, 28, 16, 'Arial', true) });
    t.rect(s, 8.3, 0.4, 1.2, 0.55, C.paper, { name: 'Ticket no' });
    t.text(s, `#${String(idx).padStart(4, '0')}`, { x: 8.3, y: 0.4, w: 1.2, h: 0.55, fontSize: 14, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, `${M.topic || ''}  ***  ${meta}`, { x: 0.5, y: 5.27, w: 9.0, h: 0.22, fontSize: 8, color: PALE });
    return s;
  };
  // a coupon: plain paper with a dashed cut line round it and a scissors at the corner
  const coupon = (s, x, y, w, h, fill = C.paper) => { t.rect(s, x, y, w, h, fill, { line: { color: C.muted, width: 1, dashType: 'dash' }, name: 'Coupon' }); };
  const V = {
    image: [
      async (d) => { // a wide slip: the print on top, the words printed under it
        const s = page(d);
        await receipt(s, 0.5, 1.15, 9, 4.0);
        await thermal(s, d.image, 0.72, 1.36, 8.56, 1.75);
        dash(s, 0.72, 3.2, 8.56);
        t.text(s, d.text, { x: 0.75, y: 3.26, w: 8.5, h: 1.72, fontSize: L.fit(d.text, 8.5, 1.72, 13, 10, F.body), color: C.ink, valign: 'middle' });
      },
      async (d) => { // the photo fills the page, one long slip lies across it
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        await receipt(s, 5.05, 0.12, 4.55, 5.0);
        t.text(s, `#${String(idx).padStart(4, '0')}`, { x: 5.25, y: 0.3, w: 4.15, h: 0.26, fontSize: 11, bold: true, color: C.red, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 5.25, y: 0.56, w: 4.15, h: 0.62, fontFace: 'Arial', bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 4.15, 0.6, 18, 11, 'Arial', true) });
        dash(s, 5.25, 1.22, 4.15);
        t.text(s, d.text, { x: 5.25, y: 1.28, w: 4.15, h: 3.2, fontSize: L.fit(d.text, 4.15, 3.2, 12, 10, F.body), color: C.ink, valign: 'middle' });
        await bars(s, 5.95, 4.52, 2.75, 0.4, 2);
        t.rect(s, 0, 5.2, W, 0.32, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // the night counter: the picture in a round stamp, words in white
        const s = nightPage(d), dia = 3.3, x = 6.0, y = 1.5;
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, null, { line: { color: LED, width: 2.5, dashType: 'dash' } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle', gray: true }), x, y, dia, dia, { alt: '' });
        t.text(s, d.text, { x: 0.5, y: 1.35, w: 5.1, h: 3.75, fontSize: L.fit(d.text, 5.1, 3.75, 14, 10, F.body, false, 1.15), color: C.paper, lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // a coupon: words on the long part, the print on the stub past the cut line
        const s = page(d), x = 0.5, y = 1.25, w = 9, h = 3.85, cut = 5.95;
        coupon(s, x, y, w, h);
        t.text(s, d.text, { x: x + 0.2, y: y + 0.12, w: cut - x - 0.4, h: h - 0.24, fontSize: L.fit(d.text, cut - x - 0.4, h - 0.24, 13, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        t.line(s, cut, y, 0, h, C.ink, 1.5, { dash: 'dash' });
        t.text(s, '✂', { x: cut - 0.14, y: y - 0.18, w: 0.3, h: 0.3, fontFace: 'Arial', fontSize: 14, color: C.ink, align: 'center', valign: 'middle', noFit: true });
        await thermal(s, d.image, cut + 0.15, y + 0.15, x + w - cut - 0.3, h - 0.9);
        await bars(s, cut + 0.4, y + h - 0.65, x + w - cut - 0.8, 0.5, 4);
      },
    ],
    cards: [
      async (d) => { // coupons cut out along dashes, two by two
        const s = page(d), n = d.items.length, w = 4.4, h = 1.84;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.27 + Math.floor(i / 2) * (h + 0.14);
          coupon(s, x, y, ww, h);
          t.img(s, await L.icon(it.icon, C.red, 2), x + 0.14, y + 0.12, 0.4, 0.4);
          t.line(s, x + 0.68, y, 0, h, C.line, 1, { dash: 'dash' });
          cap(s, it.h, x + 0.8, y + 0.08, ww - 0.92, 0.36);
          body(s, it.t, x + 0.8, y + 0.48, ww - 0.92, h - 0.56, { max: 12 });
        }
      },
      async (d) => { // slips torn off at different lengths from the top of the roll
        const s = page(d), n = d.items.length, gap = 0.16, w = (9 - gap * (n - 1)) / n;
        t.rect(s, 0.3, 1.15, 9.4, 0.1, C.ink, { name: 'Cutter' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), h = i % 2 ? 3.85 : 3.3, y = 1.25;
          await receipt(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.14, y + 0.16, 0.32, 0.32);
          t.text(s, L.pad2(i + 1), { x: x + w - 0.7, y: y + 0.16, w: 0.55, h: 0.32, fontSize: 13, bold: true, color: C.red, align: 'right', valign: 'middle' });
          cap(s, it.h, x + 0.14, y + 0.54, w - 0.28, 0.5, { max: 12 });
          dash(s, x + 0.14, y + 1.08, w - 0.28);
          body(s, it.t, x + 0.14, y + 1.14, w - 0.28, 3.3 - 1.14 - 0.14, { max: 12 });
        }
      },
      async (d) => { // the night spike: tickets pinned round one round stamp
        const s = nightPage(d), n = d.items.length, w = 3.65, h = 1.84, cy = 3.2;
        const pos = n === 4 ? [[0.5, 1.27], [0.5, 3.25], [5.85, 1.27], [5.85, 3.25]] : [[0.5, 1.27], [0.5, 3.25], [5.85, 2.26]];
        t.oval(s, 4.4, cy - 0.6, 1.2, 1.2, null, { line: { color: LED, width: 2.5, dashType: 'dash' } });
        t.text(s, '#', { x: 4.4, y: cy - 0.6, w: 1.2, h: 1.2, fontSize: 40, bold: true, color: LED, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          await receipt(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.14, y + 0.15, 0.3, 0.3);
          cap(s, it.h, x + 0.52, y + 0.12, w - 0.66, 0.36);
          body(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.64, { max: 12 });
        }
      },
      async (d) => { // the top line printed huge on one receipt, the small print on tickets beside it
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.85 - gap * (n - 1)) / n;
        await receipt(s, 0.5, 1.2, 4.1, 3.95);
        t.img(s, await L.icon(a.icon, C.red, 2), 0.75, 1.42, 0.72, 0.72);
        t.text(s, '01', { x: 3.1, y: 1.42, w: 1.25, h: 0.72, fontSize: 34, bold: true, color: C.red, align: 'right', valign: 'middle' });
        cap(s, a.h, 0.75, 2.2, 3.6, 0.5, { max: 15 });
        dash(s, 0.75, 2.74, 3.6);
        body(s, a.t, 0.75, 2.8, 3.6, 2.15, { max: 13 });
        for (const [i, it] of rest.entries()) {
          const y = 1.25 + i * (h + gap);
          coupon(s, 4.85, y, 4.65, h, C.paper);
          t.text(s, L.pad2(i + 2), { x: 4.95, y, w: 0.5, h, fontSize: 15, bold: true, color: C.red, valign: 'middle' });
          cap(s, it.h, 5.5, y + 0.05, 3.9, 0.32, { max: 12 });
          body(s, it.t, 5.5, y + 0.38, 3.9, h - 0.44, { max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // the tape steps down the page, one slip per step
        const s = page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.14, h = 2.3, dy = (3.93 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, y = 1.2 + i * dy;
          await receipt(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: x + 0.1, y: y + 0.12, w: 0.55, h: 0.48, bold: true, fontSize: 18, color: C.red, valign: 'middle' });
          cap(s, st.h, x + 0.62, y + 0.12, w - 0.7, 0.48, { max: 10 });
          dash(s, x + 0.1, y + 0.63, w - 0.2);
          body(s, st.t, x + 0.1, y + 0.67, w - 0.2, h - 0.8, { max: 11 });
        }
      },
      async (d) => { // the paper roll runs down the middle, its numbers printed on it
        const s = page(d), n = d.steps.length, h = 1.22, w = 4.15, dy = (3.92 - h) / (n - 1), Y = (i) => 1.22 + i * dy;
        await receipt(s, 4.72, 1.14, 0.56, 4.02);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.35 : 0.5, y = Y(i);
          coupon(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: 4.72, y: y + 0.02, w: 0.56, h: 0.42, bold: true, fontSize: 14, color: C.red, align: 'center', valign: 'middle' });
          cap(s, st.h, x + 0.12, y + 0.04, w - 0.24, 0.32, { max: 12 });
          body(s, st.t, x + 0.12, y + 0.38, w - 0.24, h - 0.44, { max: 11 });
        }
      },
      async (d) => { // the night till: tickets go along the top, down, and back along the bottom
        const s = nightPage(d), n = d.steps.length, w = 4.25, h = 1.75, pos = [[0.5, 1.28], [5.25, 1.28], [5.25, 3.38], [0.5, 3.38]];
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          await receipt(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: y + 0.12, w: 0.6, h: 0.42, bold: true, fontSize: 18, color: C.red, valign: 'middle' });
          cap(s, st.h, x + 0.76, y + 0.12, w - 0.9, 0.42);
          body(s, st.t, x + 0.14, y + 0.58, w - 0.28, h - 0.7, { max: 12 });
        }
        const ar = (g, x, y, w0 = 0.46) => t.text(s, g, { x, y, w: w0, h: 0.4, bold: true, fontSize: 18, color: LED, align: 'center', valign: 'middle', noFit: true });
        ar('>>', 4.77, 1.95);
        if (n > 2) ar('v', 7.15, 3.03);
        if (n > 3) ar('<<', 4.77, 4.05);
      },
    ],
    stats: [
      async (d) => { // the bill itself: lines with dotted leaders, the total underneath
        const s = page(d), [a, b, c] = d.stats, x = 1.5, w = 7;
        await receipt(s, x, 1.15, w, 4.0);
        [b, c].forEach((v, i) => {
          const y = 1.33 + i * 0.5;
          const room = w - 2.3;
          t.text(s, v.label, { x: x + 0.2, y, w: room, h: 0.46, fontSize: L.fit(v.label, room, 0.46, 12, 9, F.body), color: C.ink, valign: 'middle' });
          t.text(s, v.value, { x: x + w - 2.1, y, w: 1.9, h: 0.46, bold: true, align: 'right', valign: 'middle', fontSize: L.fit(v.value, 1.88, 0.42, 18, 10, F.body, true), color: C.ink });
          dash(s, x + 0.2, y + 0.47, w - 0.4);
        });
        t.line(s, x + 0.2, 2.37, w - 0.4, 0, C.ink, 1.5); t.line(s, x + 0.2, 2.41, w - 0.4, 0, C.ink, 1.5);
        t.text(s, a.label, { x: x + 0.2, y: 2.46, w: 3.0, h: 1.16, fontSize: L.fit(a.label, 3.0, 1.16, 13, 10, F.body), bold: false, color: C.ink, valign: 'middle' });
        t.text(s, a.value, { x: x + 3.25, y: 2.46, w: 3.55, h: 1.16, bold: true, color: C.red, align: 'right', valign: 'middle', fontSize: L.fit(a.value, 3.5, 1.05, 54, 22, F.body, true) });
        dash(s, x + 0.2, 3.64, w - 0.4);
        if (d.note) t.text(s, d.note, { x: x + 0.2, y: 3.68, w: w - 0.4, h: 1.3, fontSize: L.fit(d.note, w - 0.4, 1.3, 12, 10, F.body), color: C.muted, valign: 'middle' });
      },
      async (d) => { // the till's own display: red figures glowing in the dark
        const s = nightPage(d), w = 2.9, gap = 0.15;
        d.stats.forEach((v, i) => {
          const px = 0.5 + i * (w + gap);
          t.rect(s, px, 1.3, w, 1.35, '0E0E0E', { line: { color: C.muted, width: 1 }, name: 'Display' });
          t.text(s, v.value, { x: px + 0.1, y: 1.3, w: w - 0.2, h: 1.35, bold: true, color: LED, align: 'center', valign: 'middle', fontSize: L.fit(v.value, w - 0.24, 1.2, 40, 16, F.body, true) });
          body(s, v.label, px + 0.05, 2.72, w - 0.1, 0.82, { color: C.paper, align: 'center', max: 12 });
        });
        if (d.note) { t.line(s, 0.5, 3.62, 9, 0, C.muted, 1, { dash: 'dash' }); body(s, d.note, 0.5, 3.7, 9, 1.42, { color: PALE, max: 13, valign: 'middle' }); }
      },
      async (d) => { // one coupon with the big figure, two small ones clipped to it
        const s = page(d), [a, b, c] = d.stats;
        await receipt(s, 0.5, 1.15, 4.6, 4.0);
        t.text(s, a.value, { x: 0.65, y: 1.45, w: 4.3, h: 1.45, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.24, 1.3, 60, 22, F.body, true) });
        dash(s, 0.7, 2.96, 4.2);
        body(s, a.label, 0.7, 3.02, 4.2, 1.0, { align: 'center', max: 13 });
        await bars(s, 1.4, 4.2, 2.8, 0.65, 6);
        [b, c].forEach((v, i) => {
          const px = 5.3 + i * 2.15;
          coupon(s, px, 1.25, 2.05, 1.8);
          t.text(s, v.value, { x: px + 0.08, y: 1.3, w: 1.89, h: 0.82, bold: true, color: i ? C.ink : C.red, align: 'center', valign: 'middle', fontSize: L.fit(v.value, 1.86, 0.74, 24, 11, F.body, true) });
          body(s, v.label, px + 0.08, 2.12, 1.89, 0.9, { align: 'center', max: 10 });
        });
        if (d.note) body(s, d.note, 5.3, 3.18, 4.2, 1.92, { color: '4F5964', max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // one wide slip: minus on the left, plus on the right, reading away from the cut
        const s = page(d), n = Math.max(d.left.items.length, d.right.items.length);
        await receipt(s, 0.5, 1.15, 9, 4.0);
        const tw = 3.75, rh = 3.08 / n;
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.8, a = i ? 'left' : 'right';
          cap(s, side.h, x, 1.36, tw, 0.5, { max: 14, align: a, color: i ? C.ink : C.red });
          side.items.forEach((it, k) => {
            const y = 1.94 + k * rh;
            t.text(s, i ? '+' : '-', { x: i ? 5.1 : 4.6, y, w: 0.3, h: rh - 0.06, fontSize: 16, bold: true, color: i ? C.ink : C.red, align: 'center', valign: 'middle' });
            body(s, it, x, y, tw, rh - 0.06, { align: a, valign: 'middle', max: 12 });
          });
        });
        t.line(s, 5, 1.34, 0, 3.64, C.ink, 1, { dash: 'dash' });
        dash(s, 0.8, 1.88, 8.4);
      },
      async (d) => { // two long coupons one above the other, a black stub for each heading
        const s = page(d), h = 1.84;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.27 + i * (h + 0.14), n = side.items.length, cw = 7.1 / n;
          coupon(s, 0.5, y, 9, h);
          t.rect(s, 0.5, y, 1.9, h, i ? C.ink : C.red, { name: 'Stub' });
          cap(s, side.h, 0.58, y + 0.08, 1.74, h - 0.16, { color: C.paper, align: 'center', max: 12 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, 2.4 + k * cw, y, 0, h, C.line, 1, { dash: 'dash' });
            body(s, it, 2.48 + k * cw, y + 0.06, cw - 0.16, h - 0.12, { valign: 'middle', max: 12 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the night counter: the sentence alone, one small slip with the note
        const s = nightPage(d), w = d.caption ? 5.6 : 9;
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.3, w, h: 3.8, fontFace: 'Arial', bold: true, color: C.paper, valign: 'middle', fontSize: L.fit(d.text, w, 3.7, 36, 18, 'Arial', true) });
        if (d.caption) {
          await receipt(s, 6.4, 1.15, 3.1, 4.0);
          body(s, d.caption, 6.56, 1.32, 2.78, 2.95, { max: 12, valign: 'middle' });
          await bars(s, 6.75, 4.36, 2.4, 0.58, 8);
        }
      },
      async (d) => { // the grand total: a thick double rule, the sentence as the amount due
        const s = page(d), bottom = d.caption ? 3.75 : 5.0;
        t.line(s, 0.5, 1.25, 9, 0, C.ink, 2.5); t.line(s, 0.5, 1.32, 9, 0, C.ink, 2.5);
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.4, w: 9, h: bottom - 1.5, fontFace: 'Arial', bold: true, color: C.red, align: 'right', valign: 'middle', fontSize: L.fit(d.text, 9, bottom - 1.6, 34, 17, 'Arial', true) });
        t.line(s, 0.5, bottom, 9, 0, C.ink, 2.5); t.line(s, 0.5, bottom + 0.07, 9, 0, C.ink, 2.5);
        if (d.caption) { body(s, d.caption, 3.0, 3.92, 6.5, 1.22, { max: 12, align: 'right', color: '4F5964' }); await bars(s, 0.5, 4.05, 2.2, 0.85, 9); }
      },
    ],
    timeline: [
      async (d) => { // a perforated tape across the page, stubs above and below it
        const s = page(d), cy = 3.17, w = 4.42, h = 1.72;
        t.rect(s, 0.3, cy - 0.11, 9.4, 0.22, C.paper, { name: 'Tape' });
        for (let k = 0; k < 42; k++) t.oval(s, 0.4 + k * 0.223, cy - 0.04, 0.08, 0.08, C.bg);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.5 : 5.08, y = up ? cy - 0.14 - h : cy + 0.14;
          await receipt(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.1, w: 1.8, h: 0.34, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(it.year, 1.78, 0.32, 14, 10, F.head, true) });
          cap(s, it.h, x + 2.0, y + 0.1, w - 2.14, 0.34, { max: 11, align: 'right' });
          dash(s, x + 0.14, y + 0.47, w - 0.28);
          body(s, it.t, x + 0.14, y + 0.5, w - 0.28, h - 0.62, { max: 12 });
        }
      },
      async (d) => { // the slips rise from the lower left, each year one step up
        const s = page(d), cw = 2.25, w = cw - 0.14, h = 2.62, Y = (i) => 2.54 - i * 0.44;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, y = Y(i);
          await receipt(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: 0.36, bold: true, color: C.red, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.2, 0.34, 14, 9, F.head, true) });
          cap(s, it.h, x + 0.1, y + 0.46, w - 0.2, 0.32, { max: 10, align: 'center' });
          dash(s, x + 0.1, y + 0.8, w - 0.2);
          body(s, it.t, x + 0.1, y + 0.84, w - 0.2, h - 0.96, { max: 11 });
        }
      },
      async (d) => { // one wide receipt ruled into four columns, the years on a black band
        const s = page(d), cw = 8.4 / 4;
        await receipt(s, 0.5, 1.15, 9, 4.0);
        t.rect(s, 0.8, 1.34, 8.4, 0.46, C.ink, { name: 'Band' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.8 + i * cw;
          t.text(s, it.year, { x: x + 0.05, y: 1.34, w: cw - 0.1, h: 0.46, bold: true, color: C.paper, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.14, 0.42, 14, 10, F.head, true) });
          if (i) t.line(s, x, 1.84, 0, 3.08, C.line, 1, { dash: 'dash' });
          cap(s, it.h, x + 0.08, 1.86, cw - 0.16, 0.46, { max: 11, align: 'center' });
          body(s, it.t, x + 0.08, 2.36, cw - 0.16, 2.56, { max: 12 });
        }
      },
    ],
  };
  R.stats = V.stats.shift(); // the old stats slips looked like the cards slips
  R.timeline = V.timeline.shift(); // the old timeline rows looked like the process rows
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Chek', colors: { dk1: C.ink, lt1: C.paper, dk2: '444444', lt2: C.bg, accent1: C.red, accent2: C.ink, accent3: C.muted, accent4: '4F5964', accent5: C.line, accent6: '8D99A6', hlink: C.red, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "hisob-kitob kabi aniq: band-band sanab o'tish, raqamlar va yakuniy xulosa, ortiqcha so'zsiz", limits: {}, prefer: 'data' };
module.exports = { id: 63, slug: 'chek', name: 'Çek', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["push:u", "wipe:u", "fade"], "cover": ["typeLetters", "wipeWords"], "mark": "appear", "deco": "wipe:d", "sig": {"title": "typeLetters", "body": "wipe:d", "item": "wipe:d", "image": "wipe:d", "number": "appear", "order": "seq", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
