/**
 * 48 Marmar — marble and brass: veined white marble, fine brass double lines, serif type,
 * photos in tall rounded-top niches, brass ring numbers. Calm, expensive, architectural.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { marble: 'F4F2EE', brass: 'B08A4E', ink: '2B2826', muted: '5E574F', blush: 'EADCD2', white: 'FFFFFF' };
const F = { head: 'Cambria', body: 'Calibri' };
const NICHE = { path: 'M0,1 L0,0.32 C0,0.14 0.22,0 0.5,0 C0.78,0 1,0.14 1,0.32 L1,1 Z' };

const marbleSvg = (seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs>
  <filter id="v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.011" numOctaves="5" seed="${seed}"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
  <feComponentTransfer><feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0.05 0.22 0.05 0 0 0 0 0 0 0 0 0 0"/></feComponentTransfer></filter></defs>
  <rect width="1600" height="900" fill="#${C.marble}"/><rect width="1600" height="900" filter="url(#v)" fill="#9A938A" opacity="0.55"/></svg>`;
const nicheLine = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M3,${h} L3,${h * 0.32} C3,${h * 0.14} ${w * 0.22},3 ${w / 2},3 C${w * 0.78},3 ${w - 3},${h * 0.14} ${w - 3},${h * 0.32} L${w - 3},${h}" fill="none" stroke="#${C.brass}" stroke-width="3"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bgA = await L.svg(marbleSvg(3), 1600, 900, true), bgB = await L.svg(marbleSvg(11), 1600, 900, true);
  const memo = {};
  const niche = async (s, src, x, y, w, h) => {
    t.img(s, await L.photo(L.src(src), w, h, { mask: NICHE }), x, y, w, h, { alt: '' });
    t.img(s, (memo[`n${w}${h}`] ??= await L.svg(nicheLine(Math.round((w + 0.24) * 100), Math.round((h + 0.12) * 100)), (w + 0.24) * 100, (h + 0.12) * 100)), x - 0.12, y - 0.12, w + 0.24, h + 0.12);
  };
  const ring = (s, x, y, d, txt, fs) => { t.oval(s, x, y, d, d, null, { line: { color: C.brass, width: 1 } }); t.oval(s, x + 0.05, y + 0.05, d - 0.1, d - 0.1, null, { line: { color: C.brass, width: 0.5 } }); if (txt !== undefined) t.text(s, String(txt), { x, y, w: d, h: d, fontFace: F.head, fontSize: fs || Math.round(d * 24), color: C.brass, align: 'center', valign: 'middle' }); };
  const dbl = (s, x, y, w) => { t.line(s, x, y, w, 0, C.brass, 1); t.line(s, x, y + 0.05, w, 0, C.brass, 0.5); };
  const footer = (s) => { dbl(s, 0.6, 5.08, 8.8); t.text(s, `${M.topic || ''}   \u00B7   ${meta}`, { x: 0.6, y: 5.18, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted, align: 'center', charSpacing: 1 }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: idx % 2 ? bgA : bgB }; idx++;
    ring(s, 0.6, 0.42, 0.55, idx, 13);
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.0, h: 0.65, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 30, 16, F.head) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.35), color: C.ink, lineSpacingMultiple: 1.35, valign: 'middle' });
  const card = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.white, { t: 25, line: { color: C.brass, width: 0.75 }, name: 'Card' }); t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { line: { color: C.brass, width: 0.4 }, name: 'Inner line' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bgA }; idx++;
    if (d.image) await niche(s, d.image, 6.4, 0.75, 2.8, 3.85);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('   \u00B7   ').toUpperCase(), { x: 0.7, y: 0.85, w: 5.4, h: 0.3, fontSize: 10, color: C.brass, charSpacing: 3 });
    t.text(s, d.title, { x: 0.7, y: 1.25, w: 5.4, h: 2.1, fontFace: F.head, fontSize: L.fit(d.title, 5.4, 2.0, 42, 22, F.head), color: C.ink, valign: 'bottom' });
    dbl(s, 0.7, 3.5, 1.6);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.65, w: 5.3, h: 0.7, fontFace: F.head, italic: true, fontSize: 14, color: C.muted });
    t.text(s, (M.author || '').toUpperCase(), { x: 0.7, y: 4.45, w: 5.3, h: 0.35, fontSize: 11, bold: true, color: C.ink, charSpacing: 3 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await niche(s, d.image, 0.85, 1.4, 3.2, 3.45); para(s, d.text, 4.6, 1.4, 4.8, 3.45); },
    async image(d) { const s = page(d); para(s, d.text, 0.7, 1.4, 4.7, 3.45); await niche(s, d.image, 6.05, 1.4, 3.2, 3.45); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.4 / per);
      d.items.forEach((it, i) => {
        const x = 0.8 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        ring(s, x, y, 0.6, i + 1, 15);
        t.text(s, it, { x: x + 0.8, y, w: 3.4, h: 0.6, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + gap);
        card(s, x, 1.45, w, h);
        t.img(s, await L.icon(it.icon, C.brass, 1.5), x + w / 2 - 0.2, 1.7, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.25, y: 2.25, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.5, 0.45, 17, 12, F.head), color: C.ink, align: 'center' });
        t.text(s, it.t, { x: x + 0.25, y: 2.75, w: w - 0.5, h: h - 1.4, fontSize: 14, color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.6 / n;
      t.line(s, 0.7 + 0.35, 1.8, cw * (n - 1), 0, C.brass, 0.75);
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * cw;
        t.oval(s, x, 1.45, 0.7, 0.7, C.marble);
        ring(s, x, 1.45, 0.7, i + 1, 17);
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.5, 18, 12, F.head), color: C.ink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 15, 11, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.6 / n;
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * cw;
        if (i) t.line(s, px - 0.05, 1.6, 0, 2.4, C.brass, 0.5);
        t.text(s, x.value, { x: px, y: 1.45, w: cw - 0.3, h: 1.4, fontFace: F.head, fontSize: L.fit(x.value, cw - 0.4, 1.3, 60, 26, F.head), color: C.ink, align: 'center', valign: 'middle' });
        dbl(s, px + cw / 2 - 0.5, 2.95, 0.7);
        t.text(s, x.label, { x: px + 0.1, y: 3.1, w: cw - 0.5, h: 0.95, fontSize: 14, color: C.muted, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.4, w: 8.6, h: 0.45, fontFace: F.head, italic: true, fontSize: 10.5, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.35);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * (w + 0.3);
        card(s, x, 1.4, w, 3.45);
        t.text(s, side.h, { x: x + 0.3, y: 1.6, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 19, color: i ? C.brass : C.ink, align: 'center' });
        dbl(s, x + w / 2 - 0.4, 2.15, 0.8);
        let y = 2.35;
        side.items.forEach((it, k) => { t.shape(s, 'DIAMOND', { x: x + 0.35, y: y + 0.09, w: 0.11, h: 0.11, fill: { color: C.brass }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      dbl(s, 2.0, 1.55, 6.0);
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.7, w: 8.0, h: 1.9, fontFace: F.head, fontSize: L.fit(d.text, 8.0, 1.8, 36, 20, F.head), color: C.ink, align: 'center', valign: 'middle' });
      dbl(s, 2.0, 3.7, 6.0);
      if (d.caption) t.text(s, d.caption, { x: 1.3, y: 3.9, w: 7.4, h: 1.0, fontSize: L.fit(d.caption, 7.4, 1.0, 14, 10, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.6 / n;
      dbl(s, 0.7, 2.3, 8.6);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.7, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.65, 30, 14, F.head), color: C.brass, valign: 'bottom' });
        t.shape(s, 'DIAMOND', { x, y: 2.21, w: 0.22, h: 0.22, fill: { color: C.marble }, line: { color: C.brass, width: 1 }, objectName: 'Marker' });
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 17, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      t.text(s, '\u201C', { x: 4.4, y: 0.8, w: 1.2, h: 1.0, fontFace: F.head, fontSize: 72, color: C.brass, align: 'center' });
      t.text(s, d.text, { x: 1.2, y: 1.7, w: 7.6, h: 2.2, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.6, 2.1, 32, 18, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author.toUpperCase(), { x: 1.2, y: 4.05, w: 7.6, h: 0.35, fontSize: 11, bold: true, color: C.brass, align: 'center', charSpacing: 3 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, L.ROMAN[i] || String(i + 1), { x: 0.7, y, w: 0.6, h: rh, fontFace: F.head, fontSize: 14, color: C.brass, valign: 'middle' });
        t.text(s, it, { x: 1.35, y, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all cut from the same quarry: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const IVORY = 'EFE9DF', STONE = 'CFC6B8', BLACK = '1F1C1A';
  const bgDark = await L.svg(marbleSvg(7).replace(`fill="#${C.marble}"`, `fill="#${BLACK}"`).replace('fill="#9A938A" opacity="0.55"', 'fill="#B8AFA2" opacity="0.5"'), 1600, 900, true);
  const nero = (d) => { // the black marble room
    const s = pres.addSlide(); s.background = { data: bgDark }; idx++;
    ring(s, 0.6, 0.42, 0.55, idx, 13);
    t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.0, h: 0.65, fontFace: F.head, color: IVORY, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 30, 16, F.head) });
    dbl(s, 0.6, 5.08, 8.8);
    t.text(s, `${M.topic || ''}   ·   ${meta}`, { x: 0.6, y: 5.18, w: 8.8, h: 0.25, fontSize: 8.5, color: STONE, align: 'center', charSpacing: 1 });
    return s;
  };
  const arch = async (s, x, y, w, h) => { t.img(s, (memo[`n${w}${h}`] ??= await L.svg(nicheLine(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100)), x, y, w, h); t.line(s, x - 0.06, y + h, w + 0.12, 0, C.brass, 1); };
  const TRIPLE = { path: [0, 1, 2].map((k) => { const a = 0.3134, x = k * (a + 0.03); return `M${x},1 L${x},0.3 C${x},0.12 ${x + a * 0.2},0 ${x + a / 2},0 C${x + a * 0.8},0 ${x + a},0.12 ${x + a},0.3 L${x + a},1 Z`; }).join(' ') };
  const V = {
    image: [
      async (d) => { // a long frieze of picture between brass lines
        const s = page(d);
        dbl(s, 0.7, 1.28, 8.6);
        t.img(s, await L.photo(L.src(d.image), 8.6, 1.9), 0.7, 1.42, 8.6, 1.9, { alt: '' });
        dbl(s, 0.7, 3.4, 8.6);
        t.text(s, d.text, { x: 0.7, y: 3.56, w: 8.6, h: 1.42, fontSize: L.fit(d.text, 8.6, 1.42, 15, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // black marble: the picture seen through a round oculus in a brass ring
        const s = nero(d), dd = 3.4, x = 5.85, y = 1.4;
        t.oval(s, x - 0.13, y - 0.13, dd + 0.26, dd + 0.26, null, { line: { color: C.brass, width: 1.5 } });
        t.oval(s, x - 0.06, y - 0.06, dd + 0.12, dd + 0.12, null, { line: { color: C.brass, width: 0.5 } });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.text(s, d.text, { x: 0.7, y: 1.35, w: 4.7, h: 3.6, fontSize: L.fit(d.text, 4.7, 3.6, 15, 10, F.body, false, 1.3), color: IVORY, lineSpacingMultiple: 1.3, valign: 'middle' });
      },
      async (d) => { // the picture is the wall, a slab of marble is set in it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 0.5, 0.45, 5.2, 4.3, C.marble, { line: { color: C.brass, width: 1 }, name: 'Slab' });
        t.rect(s, 0.57, 0.52, 5.06, 4.16, null, { line: { color: C.brass, width: 0.5 }, name: 'Inner line' });
        ring(s, 0.75, 0.68, 0.5, idx, 12);
        t.text(s, d.title, { x: 1.38, y: 0.62, w: 4.1, h: 0.62, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 4.1, 0.62, 20, 13, F.head) });
        t.text(s, d.text, { x: 0.8, y: 1.34, w: 4.6, h: 3.26, fontSize: L.fit(d.text, 4.6, 3.26, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.1, W, H - 5.1, BLACK, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   ·   ${meta}`, { x: 0.6, y: 5.15, w: 8.8, h: 0.35, fontSize: 8.5, color: IVORY, align: 'center', valign: 'middle', charSpacing: 1 });
      },
      async (d) => { // one picture seen through a triple arcade
        const s = page(d), w = 5.3, h = 3.5, x = 0.7, y = 1.35;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: TRIPLE }), x, y, w, h, { alt: '' });
        t.line(s, x - 0.08, y + h + 0.02, w + 0.16, 0, C.brass, 1.25);
        t.text(s, d.text, { x: 6.3, y: 1.35, w: 3.05, h: 3.55, fontSize: L.fit(d.text, 3.05, 3.55, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a colonnade: each thought stands in its own niche
        const s = page(d), n = d.items.length, gap = 0.16, w = +((8.6 - gap * (n - 1)) / n).toFixed(2), h = 3.62;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * (w + gap), y = 1.3;
          await arch(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.brass, 1.5), x + w / 2 - 0.18, y + 0.34, 0.36, 0.36);
          head(s, it.h, x + 0.16, y + 0.8, w - 0.32, 0.6, { align: 'center', max: 15 });
          body(s, it.t, x + 0.16, y + 1.44, w - 0.32, h - 1.52, { align: 'center', max: 13 });
        }
      },
      async (d) => { // black marble: brass-edged plaques set two by two
        const s = nero(d), n = d.items.length, w = 4.2, h = 1.74;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, x = 0.7 + (i % 2) * (w + 0.2), y = 1.28 + Math.floor(i / 2) * (h + 0.1);
          t.rect(s, x, y, ww, h, null, { line: { color: C.brass, width: 1 }, name: 'Plaque' });
          t.rect(s, x + 0.06, y + 0.06, ww - 0.12, h - 0.12, null, { line: { color: C.brass, width: 0.4 }, name: 'Inner line' });
          t.img(s, await L.icon(it.icon, C.brass, 1.5), x + 0.2, y + 0.2, 0.42, 0.42);
          head(s, it.h, x + 0.76, y + 0.14, ww - 0.96, 0.54, { color: IVORY, max: 16 });
          body(s, it.t, x + 0.2, y + 0.72, ww - 0.4, h - 0.82, { color: STONE, max: 13 });
        }
      },
      async (d) => { // an inscription: Roman numerals cut large, ruled in brass
        const s = page(d), n = d.items.length, h = 3.66 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.3 + i * h;
          t.text(s, L.ROMAN[i] || String(i + 1), { x: 0.7, y, w: 1.0, h: h - 0.06, fontFace: F.head, fontSize: 34, color: C.brass, valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.brass, 1.5), 1.72, y + (h - 0.34) / 2, 0.34, 0.34);
          head(s, it.h, 2.2, y + 0.04, 2.5, h - 0.1, { max: 17 });
          body(s, it.t, 4.8, y + 0.05, 4.5, h - 0.12, { valign: 'middle', max: 14 });
          if (i < n - 1) t.line(s, 0.7, y + h - 0.02, 8.6, 0, C.brass, 0.5);
        }
      },
      async (d) => { // a rotunda seen from above, thoughts in the four bays
        const s = page(d), n = d.items.length, dd = 2.3, cx = 5, cy = 3.12, w = 3.05, h = 1.72;
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.white, { t: 30, line: { color: C.brass, width: 1.25 } });
        t.oval(s, cx - dd / 2 + 0.12, cy - dd / 2 + 0.12, dd - 0.24, dd - 0.24, null, { line: { color: C.brass, width: 0.5 } });
        t.oval(s, cx - 0.5, cy - 0.5, 1.0, 1.0, C.blush, { line: { color: C.brass, width: 1 } });
        t.shape(s, 'DIAMOND', { x: cx - 0.17, y: cy - 0.17, w: 0.34, h: 0.34, fill: { color: C.brass }, objectName: 'Keystone' });
        const spots = n === 3 ? [[0.7, 1.3, 'right'], [0.7, 3.2, 'right'], [6.25, 2.25, 'left']] : [[0.7, 1.3, 'right'], [6.25, 1.3, 'left'], [0.7, 3.2, 'right'], [6.25, 3.2, 'left']];
        for (const [i, it] of d.items.entries()) {
          const [x, y, a] = spots[i], right = a === 'right';
          t.img(s, await L.icon(it.icon, C.brass, 1.5), right ? x + w - 0.32 : x, y + 0.04, 0.32, 0.32);
          head(s, it.h, right ? x : x + 0.4, y, w - 0.4, 0.42, { align: a, max: 15 });
          t.line(s, x, y + 0.45, w, 0, C.brass, 0.75);
          body(s, it.t, x, y + 0.52, w, h - 0.56, { align: a, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a grand stair: slabs of pale stone rising to the right
        const s = page(d), n = d.steps.length, w = 8.6 / n, bot = 5.0, rise = n === 4 ? 0.5 : 0.66;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.7 + i * w, y = n === 3 ? 3.05 - i * rise : 3.02 - i * 0.42;
          t.rect(s, x, y, w, bot - y, C.white, { t: 20, line: { color: C.brass, width: 0.75 }, name: 'Stair' });
          t.rect(s, x, y, w, 0.05, C.brass, { name: 'Tread' });
          t.text(s, L.ROMAN[i] || String(i + 1), { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.38, fontFace: F.head, fontSize: 18, color: C.brass, valign: 'middle' });
          head(s, st.h, x + 0.12, y + 0.46, w - 0.24, 0.42, { max: 14 });
          body(s, st.t, x + 0.12, y + 0.9, w - 0.24, bot - y - 0.96, { max: 13 });
        }
      },
      async (d) => { // a slender column in the middle, the steps set against it left and right
        const s = page(d), n = d.steps.length, gap = n === 4 ? 0.88 : 1.2, h = n === 4 ? 1.1 : 1.22, w = 3.9, cx = 5;
        t.line(s, cx - 0.03, 1.3, 0, 3.68, C.brass, 1); t.line(s, cx + 0.03, 1.3, 0, 3.68, C.brass, 0.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.3 + i * gap, x = right ? cx + 0.45 : cx - 0.45 - w, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.28, y + 0.02, 0.56, 0.56, C.marble);
          ring(s, cx - 0.28, y + 0.02, 0.56, i + 1, 14);
          head(s, st.h, x, y, w, 0.38, { align: a, max: 16 });
          body(s, st.t, x, y + 0.4, w, h - 0.44, { align: a, max: 13 });
        }
      },
      async (d) => { // slabs of black marble inlaid side by side, numerals in brass
        const s = page(d), n = d.steps.length, gap = 0.1, w = (8.6 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.7 + i * (w + gap);
          t.rect(s, x, 1.3, w, 3.66, BLACK, { line: { color: C.brass, width: 1 }, name: 'Slab' });
          t.text(s, L.pad2(i + 1), { x: x + 0.18, y: 1.38, w: w - 0.36, h: 0.72, fontFace: F.head, fontSize: 34, color: C.brass, valign: 'middle' });
          head(s, st.h, x + 0.18, 2.12, w - 0.36, 0.56, { color: IVORY, max: 15 });
          t.line(s, x + 0.18, 2.72, 0.6, 0, C.brass, 1);
          body(s, st.t, x + 0.18, 2.82, w - 0.36, 2.06, { color: STONE, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // the leading number has a niche to itself
        const s = page(d), [a, ...rest] = d.stats, x = 0.75, y = 1.28, w = 3.5, h = 3.65;
        await arch(s, x, y, w, h);
        t.text(s, a.value, { x: x + 0.3, y: y + 0.82, w: w - 0.6, h: 1.2, fontFace: F.head, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, w - 0.7, 1.1, 56, 24, F.head) });
        dbl(s, x + w / 2 - 0.4, y + 2.08, 0.8);
        body(s, a.label, x + 0.35, y + 2.24, w - 0.7, 1.28, { align: 'center', max: 14 });
        for (const [i, v] of rest.entries()) {
          const yy = 1.32 + i * 1.08;
          t.text(s, v.value, { x: 4.75, y: yy, w: 2.2, h: 0.92, fontFace: F.head, color: C.brass, valign: 'middle', fontSize: L.fit(v.value, 2.15, 0.85, 38, 18, F.head) });
          body(s, v.label, 7.0, yy, 2.3, 0.92, { valign: 'middle', max: 13, color: C.ink });
          t.line(s, 4.75, yy + 0.98, 4.55, 0, C.brass, 0.5);
        }
        if (d.note) t.text(s, d.note, { x: 4.75, y: 3.56, w: 4.55, h: 1.38, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 4.55, 1.38, 13, 10, F.head, false, 1, true), color: C.muted, valign: 'middle' });
      },
      async (d) => { // black marble: three great brass rings, a number struck in each
        const s = nero(d), cw = 8.6 / 3, dd = 1.9;
        for (const [i, v] of d.stats.entries()) {
          const px = 0.7 + i * cw + (cw - dd) / 2, py = 1.26;
          ring(s, px, py, dd);
          t.text(s, v.value, { x: px + 0.14, y: py, w: dd - 0.28, h: dd, fontFace: F.head, color: IVORY, align: 'center', valign: 'middle', fontSize: L.fit(v.value, dd - 0.34, 0.9, 36, 15, F.head) });
          body(s, v.label, 0.7 + i * cw + 0.15, py + dd + 0.08, cw - 0.3, 0.68, { align: 'center', color: STONE, max: 13 });
        }
        if (d.note) t.text(s, d.note, { x: 0.9, y: 4.04, w: 8.2, h: 0.94, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 8.2, 0.9, 13, 10, F.head, false, 1, true), color: STONE, align: 'center', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored on a brass seam, the words leaning away from it
        const s = page(d), w = 3.95, cx = 5;
        t.line(s, cx - 0.03, 1.3, 0, 3.66, C.brass, 1); t.line(s, cx + 0.03, 1.3, 0, 3.66, C.brass, 0.5);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.18, 2.86);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.3 : cx - 0.3 - w, a = i ? 'left' : 'right';
          head(s, side.h, x, 1.32, w, 0.56, { max: 21, align: a, color: i ? C.brass : C.ink });
          dbl(s, i ? x : x + w - 1.2, 1.92, 1.2);
          let y = 2.1;
          side.items.forEach((it, j) => {
            t.shape(s, 'DIAMOND', { x: cx - 0.08, y: y + 0.05, w: 0.16, h: 0.16, fill: { color: C.brass }, line: { color: C.marble, width: 1 }, objectName: 'Stud' });
            t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: C.ink, align: a });
            y += rows[j];
          });
        }
      },
      async (d) => { // white stone over black stone, two courses of a wall
        const s = page(d), h = 1.76;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.28 + i * (h + 0.1), dark = i === 1, rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          t.rect(s, 0.7, y, 8.6, h, dark ? BLACK : C.white, { t: dark ? 0 : 20, line: { color: C.brass, width: 1 }, name: 'Course' });
          head(s, side.h, 0.9, y + 0.15, 2.3, h - 0.3, { color: dark ? IVORY : C.ink, max: 19 });
          t.line(s, 3.32, y + 0.2, 0, h - 0.4, C.brass, 0.75);
          side.items.forEach((it, j) => body(s, it, 3.5 + (j % 2) * 2.95, y + 0.1 + Math.floor(j / 2) * rh, 2.75, rh - 0.05, { color: dark ? STONE : C.ink, max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // black marble: cut flush left beside one tall brass line
        const s = nero(d);
        t.line(s, 0.74, 1.35, 0, 3.55, C.brass, 2); t.line(s, 0.82, 1.35, 0, 3.55, C.brass, 0.5);
        t.text(s, L.runs(d.text), { x: 1.1, y: 1.3, w: 8.2, h: 2.3, fontFace: F.head, color: IVORY, valign: 'middle', fontSize: L.fit(d.text, 8.2, 2.25, 36, 18, F.head) });
        if (d.caption) t.text(s, d.caption, { x: 1.1, y: 3.72, w: 8.2, h: 1.2, fontFace: F.head, italic: true, fontSize: L.fit(d.caption, 8.2, 1.2, 14, 10, F.head, false, 1, true), color: STONE });
      },
      async (d) => { // the note waits in a niche, the thought stands free beside it
        const s = page(d), x = 0.75, y = 1.28, w = 3.1, h = 3.65;
        t.rect(s, x + 0.03, y + 1.3, w - 0.06, h - 1.3, C.blush, { t: 40, name: 'Niche ground' });
        await arch(s, x, y, w, h);
        t.shape(s, 'DIAMOND', { x: x + w / 2 - 0.12, y: y + 0.55, w: 0.24, h: 0.24, fill: { color: C.brass }, objectName: 'Stud' });
        if (d.caption) body(s, d.caption, x + 0.26, y + 1.0, w - 0.52, 2.56, { align: 'center', max: 13, valign: 'middle', color: C.ink });
        t.text(s, L.runs(d.text), { x: 4.3, y: 1.35, w: 5.0, h: 3.5, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.0, 3.45, 34, 18, F.head) });
      },
    ],
    timeline: [
      async (d) => { // a brass axis, years set above and below it in turn
        const s = page(d), axis = 3.1, w = 3.6;
        dbl(s, 0.7, axis, 8.6);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.7 + (i / 2) * 4.4 : 1.85 + ((i - 1) / 2) * 4.4, top = up ? 1.26 : 3.32;
          t.shape(s, 'DIAMOND', { x: x + 0.04, y: axis - 0.09, w: 0.22, h: 0.22, fill: { color: C.marble }, line: { color: C.brass, width: 1 }, objectName: 'Marker' });
          t.text(s, it.year, { x, y: top, w: 1.55, h: 0.42, fontFace: F.head, color: C.brass, valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.38, 22, 11, F.head) });
          head(s, it.h, x + 1.6, top, w - 1.6, 0.42, { max: 14 });
          body(s, it.t, x, top + 0.44, w, 1.2, { max: 13 });
        }
      },
      async (d) => { // black marble: four plaques step down to the right
        const s = nero(d), h = 0.84;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * 0.3, y = 1.26 + i * 0.93, w = 7.7;
          t.rect(s, x, y, w, h, null, { line: { color: C.brass, width: 1 }, name: 'Plaque' });
          t.text(s, it.year, { x: x + 0.14, y, w: 1.55, h, fontFace: F.head, color: C.brass, valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.7, 24, 12, F.head) });
          t.line(s, x + 1.75, y + 0.12, 0, h - 0.24, C.brass, 0.5);
          head(s, it.h, x + 1.86, y + 0.05, 1.75, h - 0.1, { color: IVORY, max: 14 });
          body(s, it.t, x + 3.68, y + 0.05, w - 3.82, h - 0.1, { color: STONE, max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Marmar', colors: { dk1: C.ink, lt1: C.white, dk2: '4A4540', lt2: C.marble, accent1: C.brass, accent2: C.blush, accent3: C.muted, accent4: '8C857C', accent5: 'C9B48E', accent6: 'D9D3CA', hlink: C.brass, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ulug'vor va vazmin: kam so'z, salmoqli fikr, nafis va ishonchli ohang", limits: { stmt: 60, card_t4: 65 }, prefer: null };
module.exports = { id: 48, slug: 'marmar', name: 'Marmar', category: 'minimalist', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant"], "transitions": ["dissolve", "morph", "fade"], "cover": ["fadeLetters", "fadeWords"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "fadeLetters", "body": "fadeWords", "item": "softGrow", "image": "dissolve", "number": "focusIn", "order": "together", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
