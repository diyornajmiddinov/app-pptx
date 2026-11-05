/**
 * 51 Akvarel — watercolour: soft pigment washes with ragged, blooming edges on cotton paper,
 * brush-stroke lines, delicate serif titles. Text sits on light washes, never on dark paint.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'FBF8F2', ink: '33302C', muted: '6A645C', washes: ['E8A0A8', 'F4C095', 'A8C3A0', '9CC3DE', 'C3B1E1', 'E8D5A9'] };
const F = { head: 'Cambria', body: 'Calibri' };

const wash = (w, h, color, seed, op = 0.55) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>
  <filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="${seed}"/>
  <feDisplacementMap in="SourceGraphic" scale="${Math.min(w, h) * 0.12}"/><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="e"><feMorphology operator="erode" radius="3"/><feGaussianBlur stdDeviation="6"/></filter></defs>
  <g filter="url(#r)"><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.42}" ry="${h * 0.4}" fill="#${color}" fill-opacity="${op}"/>
  <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.42}" ry="${h * 0.4}" fill="none" stroke="#${color}" stroke-opacity="0.55" stroke-width="${Math.min(w, h) * 0.02}"/>
  <ellipse cx="${w * 0.45}" cy="${h * 0.42}" rx="${w * 0.2}" ry="${h * 0.16}" fill="#${color}" fill-opacity="0.25"/></g></svg>`;
const stroke = (w, h, color, seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="r"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${h * 0.45}"/></filter></defs>
  <path d="M${h},${h / 2} C${w * 0.3},${h * 0.2} ${w * 0.7},${h * 0.8} ${w - h},${h / 2}" stroke="#${color}" stroke-width="${h * 0.42}" stroke-linecap="round" stroke-opacity="0.6" fill="none" filter="url(#r)"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const wsh = async (s, x, y, w, h, k, seed = 1, op) => t.img(s, (memo[`w${w}${h}${k}${seed}${op}`] ??= await L.svg(wash(Math.round(w * 100), Math.round(h * 100), C.washes[k % 6], seed, op), w * 100, h * 100)), x, y, w, h);
  const brush = async (s, x, y, w, k, seed = 3) => t.img(s, (memo[`s${w}${k}${seed}`] ??= await L.svg(stroke(Math.round(w * 100), 40, C.washes[k % 6], seed), w * 100, 40)), x, y, w, 0.4);
  const photo = async (s, src, x, y, d, k) => { await wsh(s, x - 0.35, y - 0.3, d + 0.7, d + 0.6, k, 7, 0.6); t.img(s, await L.photo(L.src(src), d, d, { mask: 'circle' }), x, y, d, d, { alt: '' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   ~   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.head, italic: true, fontSize: 9, color: C.muted, align: 'center' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await wsh(s, 0.3, 0.15, 1.1, 1.0, idx, idx);
    t.text(s, String(idx), { x: 0.4, y: 0.3, w: 0.9, h: 0.7, fontFace: F.head, fontSize: 24, italic: true, color: C.ink, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.7, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 30, 16, F.head) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await wsh(s, 5.4, -0.6, 5.2, 4.2, 3, 11, 0.45); await wsh(s, -1.0, 3.3, 4.6, 3.0, 0, 5, 0.4); await wsh(s, 7.6, 3.4, 3.0, 2.6, 2, 9, 0.45);
    if (d.image) await photo(s, d.image, 6.35, 0.85, 2.9, 3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  ~  '), { x: 0.7, y: 0.8, w: 5.3, h: 0.3, fontFace: F.head, italic: true, fontSize: 13, color: C.muted });
    t.text(s, d.title, { x: 0.7, y: 1.15, w: 5.3, h: 2.2, fontFace: F.head, fontSize: L.fit(d.title, 5.3, 2.1, 42, 22, F.head), color: C.ink, valign: 'bottom' });
    await brush(s, 0.6, 3.4, 2.6, 0, 4);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.8, w: 5.2, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.7, y: 4.55, w: 5.2, h: 0.4, fontFace: F.head, italic: true, fontSize: 17, color: C.ink });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photo(s, d.image, 0.95, 1.55, 3.2, 1); para(s, d.text, 4.7, 1.35, 4.7, 3.65); },
    async image(d) { const s = await page(d); para(s, d.text, 0.7, 1.35, 4.6, 3.65); await photo(s, d.image, 5.95, 1.55, 3.2, 4); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.4 + (i % per) * rh;
        await wsh(s, x - 0.1, y - 0.08, 0.85, 0.8, i, i + 2);
        t.text(s, String(i + 1), { x: x - 0.1, y: y - 0.08, w: 0.85, h: 0.8, fontFace: F.head, italic: true, fontSize: 20, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.9, y, w: 3.3, h: 0.66, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.15, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        await wsh(s, x - 0.1, 1.3, w + 0.2, 3.75, i, 20 + i, 0.32);
        t.img(s, await L.icon(it.icon, C.ink, 1.5), x + w / 2 - 0.2, 1.75, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.3, y: 2.25, w: w - 0.6, h: 0.55, fontFace: F.head, fontSize: L.fit(it.h, w - 0.6, 0.55, 18, 12, F.head), color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.t, { x: x + 0.35, y: 2.85, w: w - 0.7, h: 1.75, fontSize: 14, color: C.ink, align: 'center' });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      await brush(s, 0.8, 1.6, 8.4, 5, 8);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await wsh(s, x, 1.35, 0.95, 0.9, i, 30 + i, 0.7);
        t.text(s, String(i + 1), { x, y: 1.35, w: 0.95, h: 0.9, fontFace: F.head, italic: true, fontSize: 22, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.25, h: 0.55, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.25, 0.55, 18, 12, F.head), color: C.ink });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.25, h: 2.0, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await wsh(s, px, 1.3, cw - 0.2, 1.75, i, 40 + i, 0.6);
        t.text(s, x.value, { x: px + 0.2, y: 1.3, w: cw - 0.6, h: 1.75, fontFace: F.head, fontSize: L.fit(x.value, cw - 0.8, 1.2, 54, 24, F.head), color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.1, y: 3.15, w: cw - 0.4, h: 1.1, fontSize: 14, color: C.muted, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.35, w: 8.8, h: 0.65, fontFace: F.head, italic: true, fontSize: 11, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 1.0, F.body, 0.18, 4.75 - 2.35);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4);
        await wsh(s, x - 0.1, 1.3, w + 0.2, 3.7, i ? 3 : 0, 50 + i, 0.3);
        t.text(s, side.h, { x: x + 0.4, y: 1.65, w: w - 0.8, h: 0.55, fontFace: F.head, fontSize: 20, italic: true, color: C.ink, valign: 'middle' });
        let y = 2.35;
        side.items.forEach((it, k) => { t.text(s, '~', { x: x + 0.4, y, w: 0.25, h: 0.3, fontFace: F.head, fontSize: 16, color: C.muted }); t.text(s, it, { x: x + 0.7, y, w: w - 1.0, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await wsh(s, 0.8, 1.2, 8.4, 2.6, 4, 60, 0.4);
      t.text(s, L.runs(d.text), { x: 1.5, y: 1.4, w: 7.0, h: 2.2, fontFace: F.head, fontSize: L.fit(d.text, 7.0, 2.1, 34, 18, F.head), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: 14, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      await brush(s, 0.6, 2.05, 8.8, 2, 12);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.65, fontFace: F.head, italic: true, fontSize: L.fit(it.year, cw - 0.3, 0.6, 28, 13, F.head), color: C.ink, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.25, h: 0.5, fontFace: F.head, fontSize: 17, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.25, h: 1.9, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await wsh(s, 1.0, 0.8, 8.0, 3.6, 1, 70, 0.35);
      t.text(s, d.text, { x: 1.7, y: 1.2, w: 6.6, h: 2.5, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 6.6, 2.4, 32, 16, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.7, y: 3.85, w: 6.6, h: 0.45, fontFace: F.head, fontSize: 15, color: C.muted, align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.4 + i * rh;
        await wsh(s, 0.55, y + (rh - 0.4) / 2, 0.45, 0.4, i, 80 + i, 0.7);
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      }
    },
  };
  // ---- further ways to draw a type, all still wet on the same paper: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head), color: C.ink, align: o.align, italic: !!o.italic, valign: o.valign || 'middle' });
  const BLOB = { path: 'M.02,.2 C.1,.02 .3,.06 .5,.03 C.7,0 .92,.02 .98,.2 C1,.4 .99,.7 .97,.85 C.9,1 .6,.96 .45,.98 C.25,1 .08,1 .03,.82 C0,.6 0,.4 .02,.2 Z' };
  const DROP = { path: 'M.5,0 C.68,.28 .95,.48 .95,.7 C.95,.9 .75,1 .5,1 C.25,1 .05,.9 .05,.7 C.05,.48 .32,.28 .5,0 Z' };
  const sheet = async (s, x, y, w, h, k, seed = 1, op = 0.4) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100);
    t.img(s, (memo[`r${W2}${H2}${k}${seed}${op}`] ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><defs><filter id="r" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${Math.min(W2, H2) * 0.07}"/><feGaussianBlur stdDeviation="1.5"/></filter></defs><g filter="url(#r)"><rect x="${W2 * 0.02}" y="${H2 * 0.05}" width="${W2 * 0.96}" height="${H2 * 0.9}" rx="${Math.min(W2, H2) * 0.08}" fill="#${C.washes[k % 6]}" fill-opacity="${op}" stroke="#${C.washes[k % 6]}" stroke-opacity="0.6" stroke-width="3"/></g></svg>`, W2, H2)), x, y, w, h); };
  const vbrush = async (s, cx, cy, len, k, seed = 5) => s.addImage({ data: (memo[`vb${len}${k}${seed}`] ??= await L.svg(stroke(Math.round(len * 100), 40, C.washes[k % 6], seed), len * 100, 40)), x: cx - len / 2, y: cy - 0.2, w: len, h: 0.4, rotate: 90, altText: '' });
  const wet = async (d, bg = 'E4EEF4', k = 3) => { // the whole sheet flooded with one pale colour
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    await wsh(s, 6.6, -0.8, 4.2, 2.6, k, 90 + k, 0.35);
    await wsh(s, 0.3, 0.15, 1.1, 1.0, k + 1, idx, 0.7);
    t.text(s, String(idx), { x: 0.4, y: 0.3, w: 0.9, h: 0.7, fontFace: F.head, fontSize: 24, italic: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.7, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 30, 16, F.head) });
    footer(s);
    return s;
  };
  const V = {
    image: [
      async (d) => { // the picture itself laid in as a wide wash with soft edges
        const s = await page(d);
        await sheet(s, 0.45, 1.16, 9.1, 2.42, 3, 11, 0.45);
        t.img(s, await L.photo(L.src(d.image), 8.6, 2.12, { mask: BLOB }), 0.7, 1.3, 8.6, 2.12, { alt: '' });
        t.text(s, d.text, { x: 0.7, y: 3.68, w: 8.6, h: 1.46, fontSize: L.fit(d.text, 8.6, 1.46, 15, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // the sheet flooded pale blue, the picture a tall blot
        const s = await wet(d), w = 3.6, h = 3.85;
        await wsh(s, 5.45, 1.05, w + 0.8, h + 0.3, 4, 13, 0.55);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: BLOB }), 5.85, 1.22, w, h, { alt: '' });
        t.text(s, d.text, { x: 0.7, y: 1.3, w: 4.75, h: 3.8, fontSize: L.fit(d.text, 4.75, 3.8, 15, 10, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, a sheet of cotton paper lies across it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 0.45, 2.1, 9.1, 3.08, C.paper, { name: 'Sheet' });
        await wsh(s, 0.55, 2.16, 0.9, 0.82, idx, idx, 0.7);
        t.text(s, String(idx), { x: 0.55, y: 2.16, w: 0.9, h: 0.82, fontFace: F.head, fontSize: 20, italic: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 1.5, y: 2.2, w: 7.85, h: 0.74, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.85, 0.72, 24, 14, F.head) });
        t.text(s, d.text, { x: 0.7, y: 3.0, w: 8.6, h: 2.1, fontSize: L.fit(d.text, 8.6, 2.1, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.18, W, H - 5.18, C.paper, { name: 'Foot band' });
        footer(s);
      },
      async (d) => { // one great drop, about to fall
        const s = await page(d), w = 3.5, h = 3.95;
        await wsh(s, 0.1, 1.5, 4.5, 3.75, 3, 17, 0.6);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: DROP }), 0.6, 1.15, w, h, { alt: '' });
        t.text(s, d.text, { x: 4.7, y: 1.3, w: 4.7, h: 3.8, fontSize: L.fit(d.text, 4.7, 3.8, 15, 10, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // one dab of colour to each line, a stroke of the brush between them
        const s = await page(d), n = d.items.length, h = 3.8 / n, dd = Math.min(1.0, h);
        for (const [i, it] of d.items.entries()) {
          const y = 1.3 + i * h;
          await wsh(s, 0.55, y + (h - dd) / 2, dd + 0.1, dd, i, 100 + i, 0.75);
          t.img(s, await L.icon(it.icon, C.ink, 1.5), 0.55 + (dd + 0.1) / 2 - 0.17, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, 1.8, y + 0.03, 2.55, h - 0.1, { max: 18 });
          body(s, it.t, 4.45, y + 0.04, 4.95, h - 0.12, { valign: 'middle', color: C.muted });
          if (i < n - 1) await brush(s, 1.7, y + h - 0.2, 7.7, i + 1, 40 + i);
        }
      },
      async (d) => { // the sheet flooded rose, four soft sheets of colour on it
        const s = await wet(d, 'F7E8E6', 0), n = d.items.length, w = 4.4, h = 1.88;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * w, y = 1.28 + Math.floor(i / 2) * h, k = [2, 3, 5, 4][i];
          await sheet(s, x, y, ww, h, k, 110 + i, 0.5);
          t.img(s, await L.icon(it.icon, C.ink, 1.5), x + 0.28, y + 0.24, 0.34, 0.34);
          head(s, it.h, x + 0.72, y + 0.18, ww - 1.0, 0.46, { max: 16 });
          body(s, it.t, x + 0.28, y + 0.68, ww - 0.56, h - 0.88, { max: 13 });
        }
      },
      async (d) => { // sheets hung to dry at two heights
        const s = await page(d), n = d.items.length, gap = 0.04, w = +((9.0 - gap * (n - 1)) / n).toFixed(2), h = 3.26;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), y = 1.22 + (i % 2 ? 0.58 : 0);
          await sheet(s, x, y, w, h, i + 2, 120 + i, 0.42);
          t.img(s, await L.icon(it.icon, C.ink, 1.5), x + 0.26, y + 0.26, 0.34, 0.34);
          head(s, it.h, x + 0.26, y + 0.64, w - 0.52, 0.56, { max: 15 });
          body(s, it.t, x + 0.26, y + 1.22, w - 0.52, h - 1.46, { max: 13 });
        }
      },
      async (d) => { // the painter's palette in the middle, a thought at each well
        const s = await page(d), n = d.items.length, w = 3.1, h = 1.82, cx = 5, cy = 3.2;
        await wsh(s, cx - 1.42, cy - 1.32, 2.84, 2.64, 5, 130, 0.65);
        const ring = [[0, -0.62, 0], [0.62, -0.2, 1], [0.4, 0.5, 2], [-0.4, 0.5, 3], [-0.62, -0.2, 4]];
        for (const [a, b, k] of ring) await wsh(s, cx + a - 0.36, cy + b - 0.34, 0.72, 0.68, k, 131 + k, 0.9);
        const spots = n === 3 ? [[0.55, 1.32, 0], [0.55, 3.22, 0], [6.35, 2.27, 1]] : [[0.55, 1.32, 0], [6.35, 1.32, 1], [0.55, 3.22, 0], [6.35, 3.22, 1]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, right] = spots[i], a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.ink, 1.5), right ? x : x + w - 0.32, y + 0.04, 0.32, 0.32);
          head(s, it.h, right ? x + 0.4 : x, y, w - 0.4, 0.4, { align: a, max: 16 });
          body(s, it.t, x, y + 0.46, w, h - 0.5, { align: a, max: 13, color: C.muted });
        }
      },
    ],
    process: [
      async (d) => { // the colour runs downhill: sheets slide down to the right
        const s = await page(d), n = d.steps.length, dy = n === 4 ? 0.95 : 1.26, dx = n === 4 ? 0.74 : 1.1, h = dy + 0.03, w = 6.6;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * dx, y = 1.24 + i * dy;
          await sheet(s, x, y, w, h, i, 140 + i, 0.48);
          t.text(s, String(i + 1), { x: x + 0.2, y, w: 0.6, h, fontFace: F.head, italic: true, fontSize: 26, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.86, y + 0.09, w - 1.1, 0.32, { max: 15 });
          body(s, st.t, x + 0.86, y + 0.41, w - 1.1, h - 0.5, { max: 13 });
        }
      },
      async (d) => { // one wet stroke down the centre, steps to left and right
        const s = await page(d), n = d.steps.length, gap = n === 4 ? 0.94 : 1.26, h = n === 4 ? 1.12 : 1.22, w = 3.8, cx = 5;
        await vbrush(s, cx, 3.2, 3.9, 3);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.3 + i * gap, x = right ? cx + 0.55 : cx - 0.55 - w, a = right ? 'left' : 'right';
          await wsh(s, cx - 0.42, y - 0.02, 0.84, 0.78, i, 150 + i, 0.8);
          t.text(s, String(i + 1), { x: cx - 0.42, y: y - 0.02, w: 0.84, h: 0.78, fontFace: F.head, italic: true, fontSize: 20, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.36, { align: a, max: 16 });
          body(s, st.t, x, y + 0.38, w, h - 0.42, { align: a, max: 13, color: C.muted });
        }
      },
      async (d) => { // the sheet flooded green: blooms and words zigzag along a brush line
        const s = await wet(d, 'E9F1E5', 2), n = d.steps.length, axis = 3.2, cw = 8.8 / n;
        await brush(s, 0.5, axis - 0.2, 9.0, 2, 60);
        for (const [i, st] of d.steps.entries()) {
          const up = i % 2 === 0, x = 0.6 + i * cw, w = n === 4 ? 2.95 : 3.6, top = up ? 1.28 : 3.46, xx = Math.min(x, 9.4 - w);
          await wsh(s, xx + 0.02, axis - 0.42, 0.9, 0.84, i + 3, 160 + i, 0.85);
          t.text(s, String(i + 1), { x: xx + 0.02, y: axis - 0.42, w: 0.9, h: 0.84, fontFace: F.head, italic: true, fontSize: 22, color: C.ink, align: 'center', valign: 'middle' });
          if (up) { head(s, st.h, xx, top, w, 0.38, { max: 15 }); body(s, st.t, xx, top + 0.4, w, 1.08, { max: 13 }); }
          else { head(s, st.h, xx, top + 0.06, w, 0.38, { max: 15 }); body(s, st.t, xx, top + 0.46, w, 1.18, { max: 13 }); }
        }
      },
    ],
    stats: [
      async (d) => { // one great bloom for the leading number, two small ones beside it
        const s = await page(d), [a, ...rest] = d.stats;
        await wsh(s, 0.2, 1.05, 5.2, 4.2, 0, 170, 0.6);
        t.text(s, a.value, { x: 0.9, y: 1.75, w: 3.8, h: 1.3, fontFace: F.head, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.7, 1.2, 60, 26, F.head) });
        body(s, a.label, 1.3, 3.08, 3.0, 1.02, { align: 'center' });
        for (const [i, v] of rest.entries()) {
          const y = 1.28 + i * 1.18, k = i ? 3 : 2;
          await wsh(s, 5.3, y - 0.06, 2.1, 1.2, k, 171 + i, 0.75);
          t.text(s, v.value, { x: 5.55, y: y - 0.06, w: 1.6, h: 1.2, fontFace: F.head, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(v.value, 1.5, 0.7, 28, 13, F.head) });
          body(s, v.label, 7.45, y, 1.95, 1.08, { valign: 'middle', max: 13, color: C.muted });
        }
        if (d.note) t.text(s, d.note, { x: 5.4, y: 3.72, w: 4.0, h: 1.38, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 4.0, 1.38, 13, 10, F.head, false, 1, true), color: C.muted, valign: 'middle' });
      },
      async (d) => { // the sheet flooded violet: numbers each underlined by the brush
        const s = await wet(d, 'EEE9F6', 4), h = 0.98;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.26 + i * h;
          t.text(s, v.value, { x: 0.7, y, w: 3.6, h: h - 0.26, fontFace: F.head, italic: true, color: C.ink, valign: 'bottom', fontSize: L.fit(v.value, 3.55, h - 0.3, 44, 20, F.head, false, 1, true) });
          await brush(s, 0.55, y + h - 0.34, 3.8, i, 180 + i);
          body(s, v.label, 4.6, y + 0.04, 4.8, h - 0.14, { valign: 'middle', max: 15 });
        }
        if (d.note) t.text(s, d.note, { x: 0.7, y: 4.26, w: 8.7, h: 0.86, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 8.7, 0.86, 13, 10, F.head, false, 1, true), color: C.muted, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored either side of a wet stroke, rose to the left, blue to the right
        const s = await page(d), w = 3.95, cx = 5;
        await vbrush(s, cx, 3.2, 3.9, 5);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 2.85);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.3 : cx - 0.3 - w, a = i ? 'left' : 'right';
          await wsh(s, i ? x - 0.18 : x + w - 3.0 + 0.18, 1.14, 3.0, 0.9, i ? 3 : 0, 190 + i, 0.7);
          head(s, side.h, x, 1.26, w, 0.66, { align: a, max: 21, italic: true });
          let y = 2.2;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: C.ink, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two washes laid one over the other across the page
        const s = await page(d), h = 1.94;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.22 + i * h, rh = (h - 0.4) / Math.ceil(side.items.length / 2);
          await sheet(s, 0.35, y, 9.3, h, i ? 3 : 1, 200 + i, 0.48);
          head(s, side.h, 0.7, y + 0.2, 2.3, h - 0.4, { max: 19, italic: true });
          side.items.forEach((it, j) => body(s, it, 3.15 + (j % 2) * 3.1, y + 0.2 + Math.floor(j / 2) * rh, 2.95, rh - 0.05, { max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // the sheet flooded sand: words flush left, a bloom spreading from the corner
        const s = await wet(d, 'F6EFDD', 5);
        await wsh(s, 6.3, 2.5, 4.4, 3.4, 1, 210, 0.5);
        await wsh(s, 7.5, 3.2, 2.4, 2.1, 0, 211, 0.55);
        t.text(s, L.runs(d.text), { x: 0.7, y: 1.3, w: 7.2, h: 2.4, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 7.2, 2.35, 36, 18, F.head) });
        await brush(s, 0.55, 3.66, 2.8, 1, 212);
        if (d.caption) t.text(s, d.caption, { x: 0.7, y: 4.02, w: 6.6, h: 1.12, fontFace: F.head, italic: true, fontSize: L.fit(d.caption, 6.6, 1.12, 13, 10, F.head, false, 1, true), color: C.muted });
      },
      async (d) => { // a thin column of note on its own wash, the words on bare paper beside it
        const s = await page(d);
        await sheet(s, 0.45, 1.2, 3.3, 3.95, 4, 220, 0.42);
        if (d.caption) body(s, d.caption, 0.75, 1.5, 2.7, 3.35, { max: 13, valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 4.1, y: 1.3, w: 5.3, h: 3.1, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.3, 3.05, 34, 18, F.head) });
        await brush(s, 4.0, 4.45, 5.4, 4, 221);
      },
    ],
    timeline: [
      async (d) => { // years float as blooms on a slow wave, their words beneath
        const s = await page(d), cw = 8.8 / 4, off = [0, 0.34, 0.1, 0.44];
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, y = 1.18 + off[i], w = cw - 0.12;
          await wsh(s, x - 0.08, y, w + 0.16, 1.06, i, 230 + i, 0.8);
          t.text(s, it.year, { x: x + 0.14, y, w: w - 0.28, h: 1.06, fontFace: F.head, italic: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.42, 0.6, 22, 11, F.head) });
          head(s, it.h, x, y + 1.08, w, 0.42, { max: 15 });
          body(s, it.t, x, y + 1.52, w, 5.14 - y - 1.52, { max: 13, color: C.muted });
        }
      },
      async (d) => { // the sheet flooded peach: dabs step down the page, a year in each
        const s = await wet(d, 'FBEEDF', 1), h = 0.95;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * 0.36, y = 1.24 + i * h;
          await wsh(s, x, y, 1.9, h, i + 2, 240 + i, 0.85);
          t.text(s, it.year, { x: x + 0.2, y, w: 1.5, h, fontFace: F.head, italic: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.35, 0.6, 19, 10, F.head) });
          head(s, it.h, x + 1.98, y + 0.06, 1.75, h - 0.12, { max: 15 });
          body(s, it.t, x + 3.8, y + 0.06, 8.9 - i * 0.36 - 3.8 + 0.0, h - 0.12, { max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Akvarel', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '4A453F', lt2: C.paper, accent1: C.washes[0], accent2: C.washes[1], accent3: C.washes[2], accent4: C.washes[3], accent5: C.washes[4], accent6: C.washes[5], hlink: '5B7FA6', folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yumshoq va samimiy: ravon, iliq tushuntirish, obrazli lekin aniq", limits: {}, prefer: null };
module.exports = { id: 51, slug: 'akvarel', name: 'Akvarel', category: 'creative', photos: true, build, style: STYLE };
