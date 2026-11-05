/**
 * 108 Lug'at — a dictionary page: guide words in the top corners, two justified columns of ENTRIES
 * (bold headword, ◆ sense marks), a column rule, small engravings as figures. Cover = cloth binding with gold stamping.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FBFAF6', ink: '1E1E1E', muted: '5F5F5F', accent: '8B1A1A', cloth: '13294B', gold: 'C9A227', rule: 'BDB8AE' };
const F = { head: 'Cambria', body: 'Cambria' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d, first = '', last = '') => { const s = k.slide(C.paper); k.txt(s, first, 0.6, 0.22, 3.0, 0.3, { size: 10, bold: true, italic: true, color: C.muted }); k.txt(s, last, 6.4, 0.22, 3.0, 0.3, { size: 10, bold: true, italic: true, color: C.muted, align: 'right' }); t.line(s, 0.6, 0.55, 8.8, 0, C.ink, 1);
    if (d.title) k.txt(s, [{ text: d.title, options: { bold: true } }, { text: '  \u2014  ', options: { color: C.muted } }, { text: `${k.idx}`, options: { color: C.accent, bold: true } }], 0.6, 0.62, 8.8, 0.55, { max: 22, min: 13, font: F.head, valign: 'middle' });
    k.foot(s, { y: 5.27, align: 'center', font: F.head, size: 8 }); return s; };
  // two-column flow of entries: each entry = bold headword + text, entries split evenly
  const entries = (s, list) => { const n = list.length, per = Math.ceil(n / 2), w = 4.2, top = 1.3, hh = 3.85 / per; t.line(s, 5.0, top, 0, 3.85, C.rule, 0.75);
    list.forEach(([hw, body], i) => k.txt(s, [{ text: hw, options: { bold: true, color: C.accent } }, { text: '  \u25C6  ', options: { color: C.muted } }, { text: body }], 0.6 + Math.floor(i / per) * 4.6, top + (i % per) * hh, w, hh - 0.06, { max: 14, min: 10, ls: 1.25, align: 'justify' })); };
  const R = {
    async cover(d) { const s = k.slide(C.cloth); t.rect(s, 0.45, 0.35, 9.1, 4.85, null, { line: { color: C.gold, width: 2 }, name: 'Gold frame' }); t.rect(s, 0.6, 0.5, 8.8, 4.55, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
      if (d.image) { t.oval(s, 3.95, 0.75, 2.1, 2.1, C.gold); await k.photo(s, d.image, 4.03, 0.83, 1.94, 1.94, { mask: 'circle', duo: ['13294B', 'E8D9A8'] }); }
      k.head(s, d.title.toUpperCase(), 1.0, d.image ? 2.95 : 1.4, 8.0, 1.2, { max: 32, min: 16, align: 'center', color: C.gold, spacing: 2 });
      k.txt(s, [k.M.author, k.org3].filter(Boolean).join('\n'), 1.5, d.image ? 4.2 : 3.2, 7.0, 0.75, { max: 12, align: 'center', color: 'E8D9A8', valign: 'middle' }); k.foot(s, { y: 5.27, align: 'center', color: '8A9BB8', size: 7.5 }); },
    async intro(d) { const s = page(d, '', ''); await k.photo(s, d.image, 6.4, 1.35, 3.0, 2.6, { gray: true }); k.txt(s, `${k.TR.caption}. ${d.title}`, 6.4, 4.0, 3.0, 0.3, { size: 9, italic: true, color: C.muted, align: 'center' }); k.txt(s, d.text, 0.6, 1.3, 5.5, 3.85, { max: 15, min: 10, ls: 1.3, align: 'justify' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.35, 3.0, 2.6, { gray: true }); k.txt(s, `${k.TR.caption}. ${d.title}`, 0.6, 4.0, 3.0, 0.3, { size: 9, italic: true, color: C.muted, align: 'center' }); k.txt(s, d.text, 3.9, 1.3, 5.5, 3.85, { max: 15, min: 10, ls: 1.3, align: 'justify' }); },
    async agenda(d) { const s = page(d, d.items[0], d.items[d.items.length - 1]); entries(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d, d.items[0].h, d.items[d.items.length - 1].h); entries(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d, d.steps[0].h, d.steps[d.steps.length - 1].h); entries(s, d.steps.map((st, i) => [`${st.h} ${i + 1}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 8.8 / n; d.stats.forEach((v, i) => { const x = 0.6 + i * w; if (i) t.line(s, x - 0.1, 1.35, 0, 2.5, C.rule, 0.75); k.head(s, v.value, x, 1.3, w - 0.3, 1.2, { max: 48, min: 18, color: C.accent }); k.txt(s, v.label, x, 2.55, w - 0.3, 1.2, { max: 13, italic: true }); });
      if (d.note) k.txt(s, `\u2020 ${d.note}`, 0.6, 4.15, 8.8, 0.9, { max: 11, color: C.muted }); },
    async compare(d) { const s = page(d, d.left.h, d.right.h), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.1, 3.3); t.line(s, 5.0, 1.3, 0, 3.85, C.rule, 0.75);
      [d.left, d.right].forEach((sd, i) => { const x = 0.6 + i * 4.6; k.txt(s, sd.h, x, 1.3, w, 0.45, { size: 16, bold: true, color: C.accent }); let y = 1.8; sd.items.forEach((it, j) => { k.txt(s, `${j + 1}) ${it}`, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 1.0, 1.45, 8.0, 2.1, { max: 32, min: 16, italic: true, align: 'center' }); t.line(s, 3.5, 3.7, 3.0, 0, C.accent, 1); if (d.caption) k.txt(s, d.caption, 1.0, 3.85, 8.0, 1.1, { max: 13, align: 'center', color: C.muted }); },
    async timeline(d) { const s = page(d, d.items[0].year, d.items[d.items.length - 1].year); entries(s, d.items.map((it) => [`${it.year}. ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, 1.0, 1.4, 8.0, 2.3, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.0, 3.85, 8.0, 0.45, { size: 14, align: 'center', color: C.accent, bold: true }); },
    async sources(d) { const s = page(d); entries(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all inside the bound dictionary: a deck's pages must not look alike (L.pages)
  const CREAM = 'E8D9A8', SLATE = '8A9BB8', SPINES = [C.cloth, C.accent, '4F6D7A', C.gold];
  const cloth = (d, first = '', last = '') => { // the binding itself: cloth with a thin gold frame
    const s = k.slide(C.cloth);
    t.rect(s, 0.28, 0.1, 9.44, 5.42, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
    k.txt(s, first, 0.6, 0.2, 3.0, 0.3, { size: 10, bold: true, italic: true, color: CREAM });
    k.txt(s, last, 6.4, 0.2, 3.0, 0.3, { size: 10, bold: true, italic: true, color: CREAM, align: 'right' });
    t.line(s, 0.6, 0.53, 8.8, 0, C.gold, 1);
    if (d.title) k.txt(s, [{ text: d.title, options: { bold: true, color: C.gold } }, { text: '  —  ', options: { color: CREAM } }, { text: `${k.idx}`, options: { color: 'FFFFFF', bold: true } }], 0.6, 0.6, 8.8, 0.55, { max: 22, min: 13, font: F.head, valign: 'middle', color: C.gold });
    k.foot(s, { y: 5.25, align: 'center', font: F.head, size: 8, color: CREAM });
    return s;
  };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.2, ...o });
  const hw = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 11, bold: true, color: C.accent, valign: 'middle', font: F.head, ls: 1.05, ...o });
  const part = (str, r = 0.5) => { const at = Math.round(str.length * r); let cut = str.indexOf('. ', Math.round(at * 0.75)); if (cut < 0 || cut > at * 1.25) { cut = str.lastIndexOf(' ', at); return cut < 0 ? [str, ''] : [str.slice(0, cut), str.slice(cut + 1)]; } return [str.slice(0, cut + 1), str.slice(cut + 2)]; };
  const fig = (s, x, y, w) => k.txt(s, `${k.TR.caption}. ${k.idx}`, x, y, w, 0.24, { size: 9, italic: true, color: C.muted, align: 'center' });
  const gutter = (s, x, y, h) => k.svg('gutter', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="60" height="10" fill="url(#g)"/></svg>`, 60, 10).then((g) => t.img(s, g, x - 0.2, y, 0.4, h));
  const ribbon = (color) => k.svg(`rib${color}`, `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="400"><polygon points="0,0 60,0 60,400 30,366 0,400" fill="#${color}"/></svg>`, 60, 400);
  const V = {
    image: [
      async (d) => { // a wide engraved plate, the entry in two justified columns under it
        const s = page(d), [a, b] = part(d.text), w = 4.2, fs = Math.min(L.fit(a, w, 1.72, 13, 10, F.body, false, 1.2), L.fit(b || a, w, 1.72, 13, 10, F.body, false, 1.2));
        t.rect(s, 0.6, 1.24, 8.8, 1.86, null, { line: { color: C.rule, width: 0.75 }, name: 'Plate' });
        await k.photo(s, d.image, 0.66, 1.3, 8.68, 1.74, { gray: true });
        t.line(s, 5.0, 3.28, 0, 1.9, C.rule, 0.75);
        bd(s, a, 0.6, 3.25, w, 1.95, { size: fs, align: 'justify' }); bd(s, b, 5.2, 3.25, w, 1.95, { size: fs, align: 'justify' });
      },
      async (d) => { // a full-page plate, with a loose leaf of the entry lying on it
        const s = k.slide(C.paper);
        await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
        t.rect(s, 4.75, 0.28, 4.95, 5.345, C.paper, { shadow: 0.3, blur: 8, offset: 3, name: 'Leaf' });
        t.line(s, 5.0, 0.62, 4.45, 0, C.ink, 1);
        k.txt(s, [{ text: d.title || '', options: { bold: true } }, { text: '  —  ', options: { color: C.muted } }, { text: `${k.idx}`, options: { color: C.accent, bold: true } }], 5.0, 0.68, 4.45, 0.62, { max: 18, min: 12, font: F.head, valign: 'middle' });
        bd(s, d.text, 5.0, 1.36, 4.45, 3.82, { max: 13.5, align: 'justify' });
        k.foot(s, { x: 4.9, y: 5.27, w: 4.65, align: 'center', font: F.head, size: 7 });
      },
      async (d) => { // the binding: a medallion stamped in gold, the words beside it
        const s = cloth(d), dd = 3.3, x = 0.75, y = 1.42;
        t.oval(s, x - 0.09, y - 0.09, dd + 0.18, dd + 0.18, C.gold);
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle', duo: [C.cloth, CREAM] });
        bd(s, d.text, 4.5, 1.25, 4.9, 3.85, { max: 14, color: 'FFFFFF', valign: 'middle', align: 'justify', ls: 1.28 });
      },
      async (d) => { // a small figure set into the second column, the text flowing round it
        const s = page(d), w = 4.2, [a, b] = part(d.text, 0.68), fs = Math.min(L.fit(a, w, 3.82, 13.5, 10, F.body, false, 1.25), L.fit(b || a, w, 1.72, 13.5, 10, F.body, false, 1.25));
        t.line(s, 5.0, 1.3, 0, 3.85, C.rule, 0.75);
        bd(s, a, 0.6, 1.3, w, 3.85, { size: fs, align: 'justify', ls: 1.25 });
        await k.photo(s, d.image, 5.2, 1.32, w, 1.8, { gray: true });
        fig(s, 5.2, 3.14, w);
        bd(s, b, 5.2, 3.42, w, 1.74, { size: fs, align: 'justify', ls: 1.25 });
      },
    ],
    cards: [
      async (d) => { // the thumb index: red tabs cut into the fore-edge, one for each entry
        const s = page(d, d.items[0].h, d.items[d.items.length - 1].h), n = d.items.length, h = 3.85 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.3 + i * h, tw = 0.72;
          t.rect(s, 10 - tw, y + 0.04, tw, h - 0.08, i % 2 ? C.cloth : C.accent, { name: 'Thumb tab' });
          t.img(s, await k.icon(it.icon, i % 2 ? C.gold : 'FFFFFF', 2), 10 - tw + 0.2, y + h / 2 - 0.16, 0.32, 0.32);
          hw(s, it.h, 0.6, y + 0.04, 2.45, h - 0.08);
          bd(s, it.t, 3.15, y + 0.04, 5.9, h - 0.08, { valign: 'middle', align: 'justify', max: 13 });
          if (i) t.line(s, 0.6, y, 8.45, 0, C.rule, 0.5);
        }
      },
      async (d) => { // the binding: gold-ruled plaques, two by two
        const s = cloth(d, d.items[0].h, d.items[d.items.length - 1].h), n = d.items.length, w = 4.3, h = 1.9;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.2 + Math.floor(i / 2) * (h + 0.08);
          t.rect(s, x, y, ww, h, null, { line: { color: C.gold, width: 0.75 }, name: 'Plaque' });
          t.img(s, await k.icon(it.icon, C.gold, 2), x + 0.15, y + 0.14, 0.34, 0.34);
          hw(s, it.h, x + 0.6, y + 0.08, ww - 0.75, 0.48, { color: C.gold });
          bd(s, it.t, x + 0.15, y + 0.6, ww - 0.3, h - 0.68, { color: 'FFFFFF', max: 13 });
        }
      },
      async (d) => { // volumes on a shelf: each spine a different height, its name stamped upright
        const s = page(d), n = d.items.length, w = 8.8 / n, floor = 5.1, sw = 0.56, hts = n === 4 ? [3.75, 3.35, 3.65, 3.2] : [3.75, 3.3, 3.6];
        t.rect(s, 0.45, floor, 9.1, 0.06, C.ink, { name: 'Shelf' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * w, h = hts[i], y = floor - h, c = SPINES[i % 4], ink = i % 4 === 3 ? C.cloth : C.gold, labelH = h - 0.5, tx = x + sw + 0.12, tw = w - sw - 0.25;
          t.rect(s, x, y, sw, h, c, { name: 'Spine' });
          t.line(s, x, y + 0.12, sw, 0, ink, 1); t.line(s, x, floor - 0.12, sw, 0, ink, 1);
          t.img(s, await k.icon(it.icon, ink, 2), x + 0.15, y + 0.2, 0.26, 0.26);
          t.text(s, it.h, { x: x + sw / 2 - (labelH - 0.1) / 2, y: y + 0.5 + (labelH - 0.6) / 2 - 0.2, w: labelH - 0.1, h: 0.4, rotate: 270, fontFace: F.head, bold: true, fontSize: L.fit(it.h, labelH - 0.3, 0.36, 13, 9, F.head, true), color: i % 4 === 3 ? C.cloth : 'FFFFFF', valign: 'middle', align: 'center' });
          bd(s, it.t, tx, floor - 3.72, tw, 3.62, { max: 13, valign: 'bottom' });
        }
      },
      async (d) => { // a root word in the centre, its derivatives branching to the corners
        const s = page(d, d.items[0].h, d.items[d.items.length - 1].h), n = d.items.length, cx = 5, cy = n === 3 ? 2.2 : 3.2, w = 3.55, h = 1.75, spot = (i) => (n === 3 ? [[0.6, 1.28, 'left'], [5.85, 1.28, 'left'], [2.1, 3.4, 'center']] : [[0.6, 1.28, 'left'], [5.85, 1.28, 'left'], [0.6, 3.38, 'left'], [5.85, 3.38, 'left']])[i];
        const line = (x, y) => { const lx = Math.min(x, cx), ly = Math.min(y, cy); t.line(s, lx, ly, Math.abs(x - cx), Math.abs(y - cy), C.rule, 1, ((x - cx) * (y - cy) < 0) ? { flipV: true } : {}); };
        for (const [i] of d.items.entries()) { const [x, y] = spot(i); line(n === 3 && i === 2 ? cx : x + (x < cx ? w : 0), n === 3 && i === 2 ? y : y + 0.3); }
        t.oval(s, cx - 0.42, cy - 0.42, 0.84, 0.84, C.accent);
        k.txt(s, '◆', cx - 0.42, cy - 0.42, 0.84, 0.84, { size: 22, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1, font: 'Arial' });
        for (const [i, it] of d.items.entries()) {
          const [x, y, al] = spot(i), ww = al === 'center' ? 5.8 : w;
          t.rect(s, x, y, ww, h, C.paper, { name: 'Clear' });
          t.img(s, await k.icon(it.icon, C.accent, 2), al === 'center' ? x + ww / 2 - 0.15 : x, y + 0.04, 0.3, 0.3);
          hw(s, it.h, al === 'center' ? x : x + 0.38, al === 'center' ? y + 0.34 : y, al === 'center' ? ww : ww - 0.38, 0.38, { align: al, max: 14 });
          bd(s, it.t, x, y + (al === 'center' ? 0.72 : 0.42), ww, h - (al === 'center' ? 0.74 : 0.44), { align: al === 'center' ? 'center' : 'justify', max: 12.5, ls: 1.15 });
        }
      },
    ],
    process: [
      async (d) => { // a pedigree of the word: each step descends from the one before
        const s = page(d, d.steps[0].h, d.steps[d.steps.length - 1].h), n = d.steps.length, h = 3.85 / n, ind = n === 4 ? 0.7 : 1.05;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * ind, y = 1.3 + i * h;
          if (i) { t.line(s, x - ind + 0.2, y - h + 0.46, 0, h - 0.24, C.accent, 1); t.line(s, x - ind + 0.2, y + 0.22, ind - 0.2, 0, C.accent, 1); }
          t.oval(s, x, y + 0.02, 0.42, 0.42, C.accent);
          k.txt(s, String(i + 1), x, y + 0.02, 0.42, 0.42, { size: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1, font: F.head });
          hw(s, st.h, x + 0.52, y, 9.4 - x - 0.52, 0.42);
          bd(s, st.t, x + 0.52, y + 0.42, 9.4 - x - 0.52, h - 0.46, { max: 12.5, align: 'justify', ls: 1.15 });
        }
      },
      async (d) => { // the binding: a gold line carries stamped numerals across the cover
        const s = cloth(d, d.steps[0].h, d.steps[d.steps.length - 1].h), n = d.steps.length, w = 8.8 / n, dd = 0.7;
        t.line(s, 0.6 + w / 2, 1.58, w * (n - 1), 0, C.gold, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, c = x + w / 2;
          t.oval(s, c - dd / 2, 1.58 - dd / 2, dd, dd, C.cloth, { line: { color: C.gold, width: 1.5 } });
          k.txt(s, String(i + 1), c - dd / 2, 1.58 - dd / 2, dd, dd, { size: 22, bold: true, color: C.gold, align: 'center', valign: 'middle', ls: 1, font: F.head });
          hw(s, st.h, x + 0.08, 2.02, w - 0.16, 0.56, { color: 'FFFFFF', align: 'center', max: 14 });
          bd(s, st.t, x + 0.08, 2.62, w - 0.16, 2.5, { color: CREAM, align: 'center', max: 13 });
        }
      },
      async (d) => { // leaves fanned across the desk, a page number in each corner
        const s = page(d, d.steps[0].h, d.steps[d.steps.length - 1].h), n = d.steps.length, ow = 0.1, w = (8.8 + (n - 1) * ow) / n, y0 = 1.3;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * (w - ow), y = y0 + i * 0.1, h = 3.82 - i * 0.1;
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: C.rule, width: 0.5 }, shadow: 0.2, blur: 5, offset: 2, name: 'Leaf' });
          k.txt(s, String(i + 1), x + w - 0.72, y + 0.05, 0.5, 0.48, { size: 22, bold: true, italic: true, color: C.accent, align: 'right', valign: 'middle', ls: 1 });
          hw(s, st.h, x + 0.16, y + 0.08, w - 0.9, 0.62, { max: 13.5, min: 10.5, valign: 'top' });
          t.line(s, x + 0.16, y + 0.72, w - 0.32, 0, C.rule, 0.5);
          bd(s, st.t, x + 0.16, y + 0.8, w - 0.38, h - 0.9, { max: 12.5 });
        }
      },
      async (d) => { // a table of forms, double-ruled above and below
        const s = page(d, d.steps[0].h, d.steps[d.steps.length - 1].h), n = d.steps.length, y0 = 1.32, H0 = 3.8, h = H0 / n;
        for (const yy of [y0, y0 + H0]) { t.line(s, 0.6, yy, 8.8, 0, C.ink, 1); t.line(s, 0.6, yy + (yy === y0 ? 0.04 : -0.04), 8.8, 0, C.ink, 0.4); }
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h;
          if (i) t.line(s, 0.6, y, 8.8, 0, C.rule, 0.5);
          k.txt(s, ['I', 'II', 'III', 'IV'][i], 0.6, y, 0.7, h, { size: 18, bold: true, color: C.accent, valign: 'middle', font: F.head, ls: 1 });
          hw(s, st.h, 1.3, y + 0.05, 2.5, h - 0.1, { color: C.ink, max: 14 });
          k.txt(s, i < n - 1 ? '→' : '◆', 3.8, y, 0.4, h, { size: 15, color: C.accent, align: 'center', valign: 'middle', ls: 1, font: 'Arial' });
          bd(s, st.t, 4.3, y + 0.05, 5.1, h - 0.1, { valign: 'middle', max: 12.5, ls: 1.15, align: 'justify' });
        }
      },
    ],
    stats: [
      async (d) => { // the figure as a headword: great red value, its sense, lesser senses, a dagger note
        const s = page(d), [a, ...rest] = d.stats;
        k.txt(s, a.value, 0.6, 1.2, 4.4, 1.2, { size: L.fit(a.value, 4.3, 1.1, 66, 24, F.head, true), bold: true, color: C.accent, valign: 'middle', font: F.head, ls: 1 });
        k.txt(s, [{ text: '◆  ', options: { color: C.muted } }, { text: a.label }], 0.6, 2.42, 4.2, 0.85, { max: 16, min: 11, italic: true, ls: 1.2 });
        t.line(s, 5.2, 1.3, 0, 2.0, C.rule, 0.75);
        rest.forEach((v, i) => { const y = 1.3 + i * 1.02;
          k.txt(s, `${i + 1})`, 5.4, y, 0.4, 0.5, { size: 13, bold: true, color: C.muted, valign: 'middle' });
          k.txt(s, v.value, 5.8, y, 3.6, 0.5, { size: L.fit(v.value, 3.6, 0.48, 26, 14, F.head, true), bold: true, color: C.ink, valign: 'middle', font: F.head, ls: 1 });
          bd(s, v.label, 5.8, y + 0.5, 3.6, 0.5, { italic: true, max: 12 }); });
        if (d.note) { t.line(s, 0.6, 3.5, 2.0, 0, C.ink, 0.75); k.txt(s, `†  ${d.note}`, 0.6, 3.58, 8.8, 1.5, { max: 13, min: 10, color: C.muted, ls: 1.2 }); }
      },
      async (d) => { // the binding: three gold-stamped labels at different heights
        const s = cloth(d), w = 2.75, ys = [1.45, 1.2, 1.45];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.6 + i * (w + 0.275), y = ys[i], h = 2.35;
          t.rect(s, x, y, w, h, null, { line: { color: C.gold, width: 2 }, name: 'Label' }); t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { line: { color: C.gold, width: 0.75 }, name: 'Label' });
          k.txt(s, v.value, x + 0.2, y + 0.2, w - 0.4, 1.0, { size: L.fit(v.value, w - 0.45, 0.95, 38, 16, F.head, true), bold: true, color: C.gold, align: 'center', valign: 'middle', font: F.head, ls: 1 });
          t.line(s, x + w / 2 - 0.4, y + 1.24, 0.8, 0, C.gold, 0.75);
          bd(s, v.label, x + 0.2, y + 1.3, w - 0.4, 0.92, { color: 'FFFFFF', align: 'center', italic: true, max: 12.5 });
        }
        if (d.note) bd(s, d.note, 0.6, 3.92, 8.8, 1.22, { color: CREAM, max: 13, align: 'center', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the book lies open on the binding: two pages, a dark fold between
        const s = cloth(d, d.left.h, d.right.h), y = 1.18, h = 3.98;
        t.rect(s, 0.5, y, 4.5, h, C.paper, { name: 'Page' }); t.rect(s, 5, y, 4.5, h, C.paper, { name: 'Page' });
        await gutter(s, 5, y, h);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.7, w = 4.0, n = sd.items.length, rh = (h - 0.78) / n;
          k.txt(s, sd.h, x, y + 0.1, w, 0.5, { max: 17, min: 12, bold: true, color: C.accent, valign: 'middle', align: i ? 'left' : 'right', font: F.head });
          t.line(s, x, y + 0.62, w, 0, C.rule, 0.75);
          sd.items.forEach((it, j) => k.txt(s, `${j + 1}) ${it}`, x, y + 0.7 + j * rh, w, rh - 0.04, { max: 13, min: 10, valign: 'middle', ls: 1.15, align: i ? 'left' : 'right' }));
        }
      },
      async (d) => { // two entries one under the other, parted by a printer's ornament
        const s = page(d, d.left.h, d.right.h), mid = 3.22;
        t.line(s, 0.6, mid, 3.8, 0, C.rule, 0.75); t.line(s, 5.6, mid, 3.8, 0, C.rule, 0.75);
        k.txt(s, '◆ ◆ ◆', 4.4, mid - 0.15, 1.2, 0.3, { size: 11, color: C.accent, align: 'center', valign: 'middle', ls: 1, font: 'Arial' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? mid + 0.12 : 1.28, h = 1.82, n = sd.items.length, w = 3.2, x0 = 2.75, rows = Math.ceil(n / 2), rh = h / rows;
          t.rect(s, 0.6, y + 0.04, 0.07, h - 0.1, i ? C.cloth : C.accent, { name: 'Mark' });
          hw(s, sd.h, 0.78, y, 1.85, h - 0.04, { max: 16, min: 11, color: i ? C.cloth : C.accent });
          sd.items.forEach((it, j) => { const lone = n === 3 && j === 2, x = x0 + (j % 2) * (w + 0.25); k.txt(s, `${j + 1}) ${it}`, x, y + Math.floor(j / 2) * rh, lone ? 2 * w + 0.25 : w, rh - 0.04, { max: 12.5, min: 10, valign: 'middle', ls: 1.12 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the binding: the thought is stamped in gold on a label, the note beside it
        const s = cloth(d);
        t.rect(s, 0.6, 1.25, 5.7, 3.85, null, { line: { color: C.gold, width: 2 }, name: 'Stamp' }); t.rect(s, 0.7, 1.35, 5.5, 3.65, null, { line: { color: C.gold, width: 0.75 }, name: 'Stamp' });
        k.txt(s, L.runs(d.text), 0.95, 1.5, 5.0, 3.35, { size: L.fit(d.text, 5.0, 3.3, 32, 15, F.head, true, 1.1), bold: true, color: C.gold, align: 'center', valign: 'middle', font: F.head, ls: 1.1 });
        if (d.caption) bd(s, d.caption, 6.6, 1.25, 2.8, 3.85, { color: CREAM, max: 13.5, valign: 'middle' });
      },
      async (d) => { // the ribbon marks this page: the thought beside it, a dagger note below
        const s = page(d);
        t.img(s, await ribbon(C.accent), 0.14, 0, 0.32, 3.0);
        k.txt(s, L.runs(d.text), 0.6, 1.3, 7.2, 2.15, { size: L.fit(d.text, 7.2, 2.1, 34, 16, F.head, true, 1.12), bold: true, italic: true, valign: 'middle', font: F.head, ls: 1.12 });
        if (d.caption) { t.line(s, 0.6, 3.55, 2.0, 0, C.ink, 0.75); k.txt(s, `†  ${d.caption}`, 0.6, 3.63, 7.2, 1.5, { max: 14, min: 10, color: C.muted, ls: 1.22, align: 'justify' }); }
      },
    ],
    timeline: [
      async (d) => { // editions: cloth labels mounting year by year, the account under each
        const s = page(d, d.items[0].year, d.items[3].year), w = 2.2;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * w, y = 1.3 + (3 - i) * 0.22;
          t.rect(s, x, y, w - 0.14, 0.52, C.cloth, { line: { color: C.gold, width: 1 }, name: 'Edition' });
          k.txt(s, it.year, x + 0.06, y, w - 0.26, 0.52, { size: L.fit(it.year, w - 0.3, 0.48, 18, 10.5, F.head, true), bold: true, color: C.gold, align: 'center', valign: 'middle', font: F.head, ls: 1 });
          hw(s, it.h, x, y + 0.56, w - 0.16, 0.52, { max: 13.5, valign: 'top' });
          bd(s, it.t, x, y + 1.08, w - 0.16, 5.15 - y - 1.08, { max: 12.5, ls: 1.15 });
        }
      },
      async (d) => { // the binding: a gold thread, the years stamped above and below by turns
        const s = cloth(d, d.items[0].year, d.items[3].year), mid = 3.12, step = 1.6, w = 3.05;
        t.line(s, 0.45, mid, 9.1, 0, C.gold, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * step, up = i % 2 === 0, y = up ? 1.16 : mid + 0.14, h = up ? mid - 0.1 - y : 5.15 - y;
          t.shape(s, 'DIAMOND', { x: x, y: mid - 0.11, w: 0.22, h: 0.22, fill: { color: C.gold }, objectName: 'Mark' });
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, color: C.gold } }, { text: it.h, options: { bold: true, color: 'FFFFFF' } }], x, y, w, 0.42, { font: F.head, bold: true, max: 14, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x, y + 0.44, w, h - 0.46, { color: CREAM, max: 12.5, ls: 1.15 });
        }
      },
      async (d) => { // the red ribbon runs down the page, entries to each side, outdented years
        const s = page(d, d.items[0].year, d.items[3].year), cx = 5, w = 3.95, rh = 1.9;
        t.img(s, await ribbon(C.accent), cx - 0.13, 1.25, 0.26, 3.9);
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, x = right ? cx + 0.3 : cx - 0.3 - w, y = 1.28 + Math.floor(i / 2) * rh + (right ? 0.2 : 0), a = right ? 'left' : 'right';
          k.txt(s, it.year, x, y, w, 0.44, { size: L.fit(it.year, w, 0.42, 22, 12, F.head, true), bold: true, italic: true, color: C.accent, align: a, valign: 'middle', font: F.head, ls: 1 });
          hw(s, it.h, x, y + 0.42, w, 0.32, { color: C.ink, max: 13.5, align: a });
          bd(s, it.t, x, y + 0.74, w, rh - 0.84 - (right ? 0.1 : 0), { align: a, max: 12.5, ls: 1.15 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old two-column entries were the same page for cards, process and timeline
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: "SlideAI Lug'at", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.cloth, lt2: C.paper, accent1: C.accent, accent2: C.cloth, accent3: C.gold, accent4: '4F6D7A', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 108, slug: 'lugat', name: "Luğat", category: 'academic', photos: true, build, style: { tone: "lug'at maqolasi kabi: aniq ta'riflar, atamalar va izohlar; ixcham va ilmiy", limits: {}, prefer: 'text' } };
