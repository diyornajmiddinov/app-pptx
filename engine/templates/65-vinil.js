/**
 * 65 Vinil — vinyl records: grooved black discs with coloured centre labels, album sleeves,
 * a tracklist agenda (A1, A2…), Side A / Side B comparison, liner notes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F1EBE1', ink: '1E1B18', muted: '6B635A', black: '141414', sleeve: 'FFFFFF', labels: ['E4572E', '17BEBB', 'FFC914', '76B041', '9C6ADE', 'F78FB3'] };
const F = { head: 'Arial', body: 'Calibri' };

const discSvg = (label) => { let g = ''; for (let r = 190; r > 78; r -= 6) g += `<circle cx="200" cy="200" r="${r}" fill="none" stroke="#2A2A2A" stroke-width="${r % 18 === 0 ? 2 : 1}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="198" fill="#${C.black}"/>${g}
  <path d="M120,70 A160,160 0 0 1 300,90" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="22"/><circle cx="200" cy="200" r="74" fill="#${label}"/><circle cx="200" cy="200" r="8" fill="#${C.bg}"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const disc = async (s, x, y, d, k, txt, fs) => {
    t.img(s, (memo['d' + k] ??= await L.svg(discSvg(C.labels[k % 6]), 400, 400)), x, y, d, d);
    if (txt !== undefined) t.text(s, String(txt), { x: x + d * 0.32, y: y + d * 0.32, w: d * 0.36, h: d * 0.36, fontSize: fs || Math.round(d * 13), bold: true, color: C.ink, align: 'center', valign: 'middle' });
  };
  const sleeve = (s, x, y, w, h, fill = C.sleeve) => t.rect(s, x, y, w, h, fill, { shadow: 0.25, blur: 8, offset: 3, name: 'Sleeve' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u266B   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await disc(s, 0.45, 0.33, 0.78, idx, idx, 10);
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.75, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const album = async (s, src, x, y, d, k) => { await disc(s, x + d * 0.42, y + d * 0.04, d * 0.92, k); sleeve(s, x, y, d, d); t.img(s, await L.photo(L.src(src), d - 0.16, d - 0.16), x + 0.08, y + 0.08, d - 0.16, d - 0.16, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await album(s, d.image, 5.1, 0.7, 3.4, 0); else await disc(s, 5.6, 0.7, 3.6, 0);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.labels[0], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.3, h: 2.4, bold: true, fontSize: L.fit(d.title, 4.3, 2.3, 40, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 4.2, h: 0.8, fontSize: 13, color: C.muted });
    t.text(s, [{ text: '\u25B6  ', options: { color: C.labels[0] } }, { text: M.author || '', options: { color: C.ink } }], { x: 0.6, y: 4.4, w: 4.3, h: 0.45, fontSize: 16, bold: true });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await album(s, d.image, 0.55, 1.5, 3.3, 1); para(s, d.text, 5.15, 1.35, 4.3, 3.7); },
    async image(d) { const s = await page(d); para(s, d.text, 0.5, 1.35, 4.2, 3.7); await album(s, d.image, 5.0, 1.5, 3.3, 2); },
    async agenda(d) {
      const s = await page(d), n = d.items.length; sleeve(s, 0.5, 1.35, 9.0, 3.75);
      const rh = Math.min(0.58, 3.45 / n), half = Math.ceil(n / 2);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh, side = i < half ? 'A' : 'B', no = i < half ? i + 1 : i - half + 1;
        t.text(s, `${side}${no}`, { x: 0.75, y, w: 0.7, h: rh, fontSize: 15, bold: true, color: C.labels[i % 6], valign: 'middle' });
        t.text(s, it, { x: 1.5, y, w: 7.0, h: rh, fontSize: 16, color: C.ink, valign: 'middle' });
        t.text(s, '\u266A', { x: 8.75, y, w: 0.5, h: rh, fontSize: 16, color: C.muted, valign: 'middle' });
        if (i < n - 1) t.line(s, 0.75, y + rh, 8.5, 0, 'E6DFD3', 0.75);
      });
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.22, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        sleeve(s, x, 1.35, w, 3.75);
        t.rect(s, x, 1.35, w, 0.95, C.labels[i % 6], { name: 'Cover art' });
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, 1.55, 0.5, 0.5);
        t.text(s, it.h, { x: x + 0.2, y: 2.4, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 17, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 3.0, w: w - 0.4, h: 2.0, fontSize: 13, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 9.0 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.5 + i * cw;
        await disc(s, x + (cw - 1.1) / 2, 1.3, 1.1, i, i + 1, 13);
        t.text(s, st.h, { x: x + 0.05, y: 2.5, w: cw - 0.2, h: 0.55, fontSize: L.fit(st.h, cw - 0.2, 0.55, 16, 11, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, st.t, { x: x + 0.05, y: 3.05, w: cw - 0.2, h: 2.0, fontSize: 13, color: C.muted, align: 'center' });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 9.0 / n, dd = Math.min(2.2, cw - 0.4);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.5 + i * cw + cw / 2;
        await disc(s, cx - dd / 2, 1.3, dd, i * 2);
        t.text(s, x.value, { x: cx - dd * 0.18, y: 1.3 + dd * 0.33, w: dd * 0.36, h: dd * 0.34, fontSize: L.fit(x.value, dd * 0.36, dd * 0.3, 26, 9, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.45 + dd, w: cw - 0.3, h: 0.95, fontSize: 13, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.6, w: 9.0, h: 0.55, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 4.95 - 2.2);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4), k = i ? 1 : 0;
        sleeve(s, x, 1.35, w, 3.75);
        t.oval(s, x + 0.2, 1.5, 0.55, 0.55, C.labels[k]);
        t.text(s, i ? 'B' : 'A', { x: x + 0.2, y: 1.5, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, side.h, { x: x + 0.9, y: 1.5, w: w - 1.1, h: 0.55, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, j) => { t.text(s, '\u266A', { x: x + 0.25, y, w: 0.3, h: 0.3, fontSize: 13, color: C.labels[k] }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[j], fontSize: fs, color: C.ink }); y += rows[j]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await disc(s, 6.6, 1.25, 3.0, 4);
      sleeve(s, 0.6, 1.3, 6.5, 3.0, C.labels[4]);
      t.text(s, L.runs(d.text), { x: 0.9, y: 1.4, w: 5.9, h: 2.8, bold: true, fontSize: L.fit(d.text, 5.9, 2.7, 34, 16, F.head, true), color: 'FFFFFF', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.4, w: 8.9, h: 0.75, fontSize: 12, color: C.muted });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 9.0 / n;
      const wave = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="60">${Array.from({ length: 150 }, (_, k) => { const h = 6 + Math.abs(Math.sin(k * 0.45) * 22 + Math.sin(k * 0.13) * 12); return `<rect x="${k * 6}" y="${30 - h / 2}" width="3" height="${h}" fill="#${C.ink}" opacity="0.55"/>`; }).join('')}</svg>`;
      t.img(s, await L.svg(wave, 900, 60), 0.5, 1.85, 9.0, 0.6);
      d.items.forEach((it, i) => {
        const x = 0.5 + i * cw;
        t.oval(s, x, 1.95, 0.4, 0.4, C.labels[i % 6]);
        t.text(s, it.year, { x, y: 1.3, w: cw - 0.2, h: 0.5, fontSize: L.fit(it.year, cw - 0.3, 0.45, 22, 11, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.25, h: 0.5, fontSize: 15, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.25, h: 1.95, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await disc(s, 0.5, 1.0, 3.2, 5, '\u201C', 40);
      t.text(s, d.text, { x: 4.1, y: 1.0, w: 5.4, h: 2.7, italic: true, bold: true, fontSize: L.fit(d.text, 5.4, 2.6, 30, 15, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 4.1, y: 3.85, w: 5.4, h: 0.45, fontSize: 15, bold: true, color: C.labels[0] });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length; sleeve(s, 0.5, 1.35, 9.0, 3.75);
      const rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.48 + i * rh;
        t.oval(s, 0.7, y + (rh - 0.3) / 2, 0.3, 0.3, C.labels[i % 6]);
        t.text(s, it, { x: 1.15, y, w: 8.2, h: rh, fontSize: 13, color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all in the record shop: a deck's pages must not look alike (L.pages)
  const NIGHT = '141414', MIST = 'D9D2C6';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const nightPage = async (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    await disc(s, 0.45, 0.33, 0.78, idx, idx, 10);
    t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.75, bold: true, color: C.sleeve, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.75, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ♫   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: MIST });
    return s;
  };
  const code = (i, n) => { const half = Math.ceil(n / 2); return i < half ? `A${i + 1}` : `B${i - half + 1}`; };
  const V = {
    image: [
      async (d) => { // on the turntable: the picture spins on the platter, the arm rests on it
        const s = await page(d), x = 0.5, y = 1.35, w = 4.5, h = 3.75, D0 = 3.3, px = x + 0.18, py = y + 0.22;
        t.rect(s, x, y, w, h, NIGHT, { r: 0.08, name: 'Plinth' });
        t.oval(s, px - 0.06, py - 0.06, D0 + 0.12, D0 + 0.12, '333333');
        t.img(s, await L.photo(L.src(d.image), D0, D0, { mask: 'circle' }), px, py, D0, D0, { alt: '' });
        t.oval(s, px + D0 / 2 - 0.07, py + D0 / 2 - 0.07, 0.14, 0.14, C.bg);
        t.oval(s, x + w - 0.48, y + 0.14, 0.34, 0.34, 'B0B0B0');
        s.addShape(t.S.LINE, { x: x + w - 1.1, y: y + 0.3, w: 0.8, h: 1.3, flipH: true, flipV: false, line: { color: 'D8D8D8', width: 3 }, objectName: 'Tone arm' });
        t.text(s, d.text, { x: 5.25, y: 1.35, w: 4.25, h: 3.75, fontSize: L.fit(d.text, 4.25, 3.75, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the cover blown up to the whole page, the liner notes laid over it
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        sleeve(s, 5.0, 0.3, 4.65, 4.72);
        await disc(s, 5.15, 0.42, 0.72, idx, idx, 9);
        t.text(s, d.title, { x: 6.0, y: 0.42, w: 3.5, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 3.5, 0.7, 18, 12, F.head, true) });
        t.text(s, d.text, { x: 5.2, y: 1.24, w: 4.25, h: 3.68, fontSize: L.fit(d.text, 4.25, 3.68, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.18, W, 0.34, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // black room: an open gatefold, the picture across both halves, words beneath
        const s = await nightPage(d), x = 0.5, y = 1.28, w = 9, h = 2.2;
        t.img(s, await L.photo(L.src(d.image), w, h), x, y, w, h, { alt: '' });
        t.rect(s, x + w / 2 - 0.04, y, 0.08, h, '000000', { t: 45, name: 'Gatefold crease' });
        t.text(s, d.text, { x: 0.6, y: 3.6, w: 8.8, h: 1.55, fontSize: L.fit(d.text, 8.8, 1.55, 14, 10, F.body, false, 1.1), color: C.sleeve, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // the crate: the picture is the sleeve pulled forward, colours of the others behind it
        const s = await page(d), dd = 3.5, x = 5.7, y = 1.4;
        for (let k = 3; k >= 1; k--) t.rect(s, x + k * 0.12 - 0.35, y - k * 0.03 + 0.05, dd, dd, C.labels[k], { name: 'Sleeve behind' });
        sleeve(s, x - 0.35, y + 0.05, dd, dd);
        t.img(s, await L.photo(L.src(d.image), dd - 0.14, dd - 0.14), x - 0.28, y + 0.12, dd - 0.14, dd - 0.14, { alt: '' });
        t.text(s, d.text, { x: 0.5, y: 1.35, w: 4.6, h: 3.75, fontSize: L.fit(d.text, 4.6, 3.75, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the track list on the back of the sleeve
        const s = await page(d), n = d.items.length, y0 = 1.35, h = 3.75 / n;
        sleeve(s, 0.5, y0, 9, 3.75);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h;
          if (i) t.line(s, 0.7, y, 8.6, 0, 'E6DFD3', 1);
          t.text(s, code(i, n), { x: 0.68, y, w: 0.6, h, bold: true, fontSize: 16, color: C.ink, valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.ink, 2), 1.34, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, 1.8, y + 0.05, 2.45, h - 0.1, { max: 14 });
          body(s, it.t, 4.35, y + 0.05, 5.0, h - 0.1, { valign: 'middle', color: C.ink });
        }
      },
      async (d) => { // a big record in the middle, the sleeves laid out round it
        const s = await page(d), n = d.items.length, w = 3.55, h = 1.8, dd = 2.1, cy = 3.22;
        await disc(s, 5 - dd / 2, cy - dd / 2, dd, 4);
        const pos = n === 4 ? [[0.5, 1.32], [0.5, 3.28], [5.95, 1.32], [5.95, 3.28]] : [[0.5, 1.32], [0.5, 3.28], [5.95, 2.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          sleeve(s, x, y, w, h);
          t.rect(s, i < 2 ? x + w - 0.1 : x, y, 0.1, h, C.labels[i], { name: 'Spine' });
          const tx = x + (i < 2 ? 0.14 : 0.24);
          t.img(s, await L.icon(it.icon, C.ink, 2), tx, y + 0.12, 0.3, 0.3);
          head(s, it.h, tx + 0.38, y + 0.08, w - 0.72, 0.38, { max: 13 });
          body(s, it.t, tx, y + 0.5, w - 0.38, h - 0.58, { color: C.ink });
        }
      },
      async (d) => { // black room: bright sleeves, two by two, a record slipping from each
        const s = await nightPage(d), n = d.items.length, w = 4.4, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, C.labels[i], { name: 'Sleeve' });
          t.oval(s, x + 0.14, y + 0.18, 0.66, 0.66, NIGHT);
          t.img(s, await L.icon(it.icon, C.sleeve, 2), x + 0.3, y + 0.34, 0.34, 0.34);
          head(s, it.h, x + 0.95, y + 0.1, ww - 1.08, 0.46, { max: 14 });
          body(s, it.t, x + 0.95, y + 0.6, ww - 1.08, h - 0.68, { color: C.ink });
        }
      },
      async (d) => { // the hit single gets the big record, the B-sides line up beside it
        const s = await page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.14, h = (3.74 - gap * (n - 1)) / n, dd = 1.9;
        await disc(s, 0.5, 1.32, dd, 0);
        t.img(s, await L.icon(a.icon, C.ink, 2), 0.5 + dd / 2 - 0.2, 1.32 + dd / 2 - 0.2, 0.4, 0.4);
        head(s, a.h, 2.5, 1.5, 1.9, 1.5, { max: 16 });
        body(s, a.t, 0.5, 3.3, 3.9, 1.8, { color: C.ink, max: 14 });
        for (const [i, it] of rest.entries()) {
          const y = 1.33 + i * (h + gap), k = i + 1;
          sleeve(s, 4.7, y, 4.8, h);
          await disc(s, 4.82, y + h / 2 - 0.3, 0.6, k);
          head(s, it.h, 5.55, y + 0.05, 3.85, 0.36, { max: 13 });
          body(s, it.t, 5.55, y + 0.42, 3.85, h - 0.48, { color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // sleeves step down the page, the record sliding out of each one
        const s = await page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.14, h = 2.0, dy = (3.75 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, y = 1.33 + i * dy;
          sleeve(s, x, y, w, h);
          t.rect(s, x, y, w, 0.5, C.labels[i], { name: 'Cover art' });
          t.text(s, String(i + 1), { x: x + 0.1, y, w: 0.4, h: 0.5, bold: true, fontSize: 20, color: C.ink, valign: 'middle' });
          head(s, st.h, x + 0.48, y, w - 0.56, 0.5, { max: 12 });
          body(s, st.t, x + 0.1, y + 0.56, w - 0.2, h - 0.62, { color: C.ink });
        }
      },
      async (d) => { // the record seen from above, steps sitting along its edge like tracks
        const s = await page(d), n = d.steps.length, R0 = 1.9, cy = 3.2, rh = 3.74 / n, Y = (i) => 1.33 + i * rh;
        t.img(s, await L.svg(discSvg(C.labels[3]), 400, 400), -R0, cy - R0 - 0.05, R0 * 2, R0 * 2);
        for (const [i, st] of d.steps.entries()) {
          const y = Y(i), dy = y + rh / 2 - cy, x = Math.sqrt(Math.max(0.2, (R0 + 0.12) ** 2 - dy * dy)) + 0.04, c = C.labels[i], dd = Math.min(0.5, rh - 0.12);
          t.oval(s, x, y + rh / 2 - dd / 2, dd, dd, c);
          t.text(s, String(i + 1), { x, y: y + rh / 2 - dd / 2, w: dd, h: dd, bold: true, fontSize: 14, color: C.ink, align: 'center', valign: 'middle' });
          const tx = x + dd + 0.14, tw = 9.5 - tx;
          head(s, st.h, tx, y + 0.03, tw, 0.32, { max: 14 });
          body(s, st.t, tx, y + 0.35, tw, rh - 0.4, { color: C.ink });
        }
      },
      async (d) => { // black room: a pile of records up the middle, steps out to either side
        const s = await nightPage(d), n = d.steps.length, h = 1.2, w = 4.1, dy = (3.78 - h) / (n - 1), Y = (i) => 1.3 + i * dy;
        t.rect(s, 4.97, 1.3, 0.06, 3.78, 'B0B0B0', { name: 'Spindle' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.4 : 0.5, y = Y(i), c = C.labels[i];
          await disc(s, 4.68, y, 0.64, i, i + 1, 9);
          t.rect(s, x, y, w, h, '262626', { name: 'Liner' });
          t.rect(s, right ? x : x + w - 0.07, y, 0.07, h, c, { name: 'Spine' });
          const tx = x + (right ? 0.18 : 0.1);
          head(s, st.h, tx, y + 0.05, w - 0.28, 0.34, { color: c, max: 14 });
          body(s, st.t, tx, y + 0.4, w - 0.28, h - 0.46, { color: MIST });
        }
      },
    ],
    stats: [
      async (d) => { // a gold-record award: one figure framed large, two small discs beside it
        const s = await page(d), [a, b, c] = d.stats;
        t.rect(s, 0.5, 1.33, 4.8, 3.76, NIGHT, { name: 'Frame' });
        t.rect(s, 0.62, 1.45, 4.56, 3.52, C.labels[2], { name: 'Award' });
        t.text(s, a.value, { x: 0.8, y: 1.6, w: 4.2, h: 1.75, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.1, 1.6, 66, 26, F.head, true) });
        body(s, a.label, 0.95, 3.42, 3.9, 1.4, { color: C.ink, align: 'center', max: 16 });
        for (const [i, x] of [b, c].entries()) {
          const y = 1.33 + i * 1.18, dd = 1.1;
          await disc(s, 5.5, y, dd, i * 2 + 1);
          head(s, x.value, 6.72, y + 0.04, 2.78, 0.5, { max: 22 });
          body(s, x.label, 6.72, y + 0.54, 2.78, 0.56, { max: 12, color: C.ink });
        }
        if (d.note) body(s, d.note, 5.5, 3.72, 4.0, 1.38, { max: 13, valign: 'middle' });
      },
      async (d) => { // black room: the chart run, big coloured figures in rows, note on the right
        const s = await nightPage(d), w = d.note ? 5.8 : 9;
        d.stats.forEach((x, i) => {
          const y = 1.3 + i * 1.28, c = C.labels[[2, 1, 5][i]];
          t.rect(s, 0.5, y, 0.1, 1.14, c, { name: 'Spine' });
          t.text(s, x.value, { x: 0.75, y, w: 2.75, h: 1.14, bold: true, color: c, valign: 'middle', fontSize: L.fit(x.value, 2.7, 1.0, 40, 18, F.head, true) });
          body(s, x.label, 3.55, y + 0.06, w - 3.05, 1.02, { color: C.sleeve, valign: 'middle', max: 14 });
        });
        if (d.note) { t.rect(s, 6.6, 1.3, 2.9, 3.7, '262626', { name: 'Liner' }); body(s, d.note, 6.76, 1.42, 2.58, 3.46, { color: MIST, valign: 'middle', max: 14 }); }
      },
    ],
    compare: [
      async (d) => { // side A and side B, the record between them, each reading away from it
        const s = await page(d), y0 = 1.3, h = 3.8, dd = 1.5, tw = 3.55;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5 : 0, a = i ? 'left' : 'right', k = i ? 1 : 0, n = side.items.length, rh = 3.0 / n, tx = i ? 5.95 : 0.5;
          t.rect(s, x, y0, 5, h, C.labels[k], { name: 'Side' });
          head(s, side.h, tx, y0 + 0.14, tw, 0.56, { align: a, max: 17 });
          side.items.forEach((it, j) => body(s, it, tx, y0 + 0.74 + j * rh, tw, rh - 0.05, { color: C.ink, align: a, valign: 'middle', max: 14 }));
        }
        await disc(s, 5 - dd / 2, y0 + h / 2 - dd / 2, dd, 2, '⇄', 14);
      },
      async (d) => { // two long sleeves, a record label for the side, a cell for each point
        const s = await page(d), h = 1.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.32 + i * (h + 0.14), n = side.items.length, cw = 5.3 / n, k = i ? 4 : 3;
          sleeve(s, 0.5, y, 9, h);
          await disc(s, 0.6, y + 0.2, 1.4, k, i ? 'B' : 'A', 14);
          head(s, side.h, 2.1, y + 0.1, 1.95, h - 0.2, { max: 16 });
          side.items.forEach((it, j) => {
            const x = 4.15 + j * cw;
            t.rect(s, x, y + 0.14, 0.04, h - 0.28, C.labels[k], { name: 'Rule' });
            body(s, it, x + 0.1, y + 0.08, cw - 0.16, h - 0.16, { color: C.ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // black room: a huge record slides off the edge behind the words
        const s = await nightPage(d), dd = 4.6, cap = !!d.caption, tw = 6.3;
        t.img(s, await L.svg(discSvg(C.labels[0]), 400, 400), 7.0, 0.85, dd, dd);
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.25, w: tw, h: cap ? 2.4 : 3.85, bold: true, color: C.sleeve, valign: 'middle', fontSize: L.fit(d.text, tw, cap ? 2.3 : 3.7, 34, 17, F.head, true) });
        if (cap) body(s, d.caption, 0.5, 3.75, tw, 1.38, { color: MIST, max: 13 });
      },
      async (d) => { // sleeve-art stripes down the side, the thought in plain type beside them
        const s = await page(d), bottom = d.caption ? 3.55 : 5.05;
        [0, 2, 1, 4, 5].forEach((k, j) => t.rect(s, 0.5 + j * 0.3, 1.32, 0.3, 3.76, C.labels[k], { name: 'Stripe' }));
        t.text(s, L.runs(d.text), { x: 2.3, y: 1.32, w: 7.2, h: bottom - 1.32, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 7.2, bottom - 1.4, 32, 16, F.head, true) });
        if (d.caption) { t.line(s, 2.3, 3.62, 7.2, 0, C.ink, 1.5); body(s, d.caption, 2.3, 3.7, 7.2, 1.38, { max: 14, color: C.muted }); }
      },
    ],
    timeline: [
      async (d) => { // black room: records climbing the wall, a year on each one's label side
        const s = await nightPage(d), cw = 2.25, dd = 0.8;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, y = 2.66 - i * 0.44, w = cw - 0.15;
          await disc(s, x, y, dd, i);
          t.text(s, it.year, { x: x + dd + 0.06, y, w: w - dd - 0.06, h: dd, bold: true, color: C.labels[i], valign: 'middle', fontSize: L.fit(it.year, w - dd - 0.06, dd - 0.1, 17, 9, F.head, true) });
          head(s, it.h, x, y + dd + 0.04, w, 0.34, { color: C.sleeve, max: 13 });
          body(s, it.t, x, y + dd + 0.38, w, 5.15 - (y + dd + 0.38), { color: MIST, max: 13 });
        }
      },
      async (d) => { // colour bands across the page, like the edge of a stack of LPs
        const s = await page(d), y0 = 1.33, rh = 3.76 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, c = C.labels[(i * 2 + 1) % 6];
          t.rect(s, 0, y, W, rh - 0.05, c, { name: 'Band' });
          t.text(s, it.year, { x: 0.5, y, w: 1.75, h: rh - 0.05, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(it.year, 1.7, 0.6, 22, 11, F.head, true) });
          head(s, it.h, 2.35, y + 0.03, 2.2, rh - 0.11, { max: 14 });
          body(s, it.t, 4.65, y + 0.03, 4.85, rh - 0.11, { color: C.ink, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Vinil', colors: { dk1: C.ink, lt1: C.sleeve, dk2: C.black, lt2: C.bg, accent1: C.labels[0], accent2: C.labels[1], accent3: C.labels[2], accent4: C.labels[3], accent5: C.labels[4], accent6: C.labels[5], hlink: C.labels[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ritmik va ilhomli: har bir qism 'trek' kabi tugal, qisqa sarlavhalar va ravon matn", limits: {}, prefer: 'visual' };
module.exports = { id: 65, slug: 'vinil', name: 'Vinil', category: 'creative', photos: true, build, style: STYLE };
