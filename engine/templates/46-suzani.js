/**
 * 46 Suzani — Uzbek suzani embroidery: crimson floral medallions (oy-palak) on cream
 * linen, embroidered vine borders, photos framed inside the medallion's heart.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { linen: 'F7EFDF', crimson: 'A3182C', wine: '6E0F1F', gold: 'D9A441', indigo: '2B3A67', green: '4C7A4C', ink: '2A1A14', muted: '7A6355', panel: 'FBF6EC' };
const F = { head: 'Cambria', body: 'Calibri' };

// medallion (viewBox 400): scalloped outer ring, teardrop petals, dot ring, hollow heart of radius `core`
const medallion = (core = 0.42, pal = [C.crimson, C.wine, C.gold, C.indigo, C.green]) => {
  const [a, b, c, d, e] = pal, R = 200, petals = 16; let p = '', dots = '', sc = '';
  for (let k = 0; k < petals; k++) { const ang = (k / petals) * 360; p += `<path d="M200,${R - 190} C228,${R - 150} 222,${R - 115} 200,${R - 98} C178,${R - 115} 172,${R - 150} 200,${R - 190} Z" fill="#${k % 2 ? a : b}" transform="rotate(${ang} 200 200)"/><circle cx="200" cy="${R - 140}" r="7" fill="#${c}" transform="rotate(${ang} 200 200)"/>`; }
  for (let k = 0; k < 28; k++) { const ang = (k / 28) * 2 * Math.PI; dots += `<circle cx="${(200 + 92 * Math.cos(ang)).toFixed(1)}" cy="${(200 + 92 * Math.sin(ang)).toFixed(1)}" r="5" fill="#${d}"/>`; }
  for (let k = 0; k < 24; k++) { const ang = (k / 24) * 2 * Math.PI; sc += `<circle cx="${(200 + 192 * Math.cos(ang)).toFixed(1)}" cy="${(200 + 192 * Math.sin(ang)).toFixed(1)}" r="9" fill="#${e}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="194" fill="none" stroke="#${e}" stroke-width="4"/>${sc}${p}${dots}
    <circle cx="200" cy="200" r="${R * core + 6}" fill="#${a}"/><circle cx="200" cy="200" r="${R * core}" fill="#${C.linen}"/></svg>`;
};
const vine = (w, h) => { // embroidered border: wavy stem, leaves and small flowers
  let path = `M0,${h / 2}`, leaves = '', flowers = '';
  for (let x = 0, k = 0; x < w; x += 80, k++) {
    path += ` q40,${k % 2 ? 18 : -18} 80,0`;
    const y = h / 2 + (k % 2 ? 9 : -9);
    leaves += `<ellipse cx="${x + 40}" cy="${y + (k % 2 ? 12 : -12)}" rx="16" ry="6" fill="#${C.green}" transform="rotate(${k % 2 ? 30 : -30} ${x + 40} ${y})"/>`;
    if (k % 2 === 0) flowers += `<circle cx="${x + 80}" cy="${h / 2}" r="11" fill="#${C.crimson}"/><circle cx="${x + 80}" cy="${h / 2}" r="4" fill="#${C.gold}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${path}" fill="none" stroke="#${C.green}" stroke-width="4"/>${leaves}${flowers}</svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const med = async (core, pal) => (memo[core + String(pal)] ??= await L.svg(medallion(core, pal), 400, 400));
  const vineImg = await L.svg(vine(1600, 50), 1600, 50);
  const palAlt = [C.indigo, '1F2A4D', C.gold, C.crimson, C.green];
  // medallion with a photo (or a number / value) in its heart
  const medal = async (s, x, y, dd, { src, text, fs, alt } = {}) => {
    const core = 0.42;
    t.img(s, await med(core, alt ? palAlt : undefined), x, y, dd, dd);
    const cd = dd * core, cx = x + (dd - cd) / 2, cy = y + (dd - cd) / 2;
    if (src) t.img(s, await L.photo(L.src(src), cd, cd, { mask: 'circle' }), cx, cy, cd, cd, { alt: '' });
    if (text !== undefined) t.text(s, String(text), { x: cx, y: cy, w: cd, h: cd, fontFace: F.head, fontSize: fs || Math.round(cd * 30), bold: true, color: C.wine, align: 'center', valign: 'middle' });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted, align: 'center' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.linen }; idx++;
    t.img(s, vineImg, 0, 0.08, W, 0.31);
    await medal(s, 0.5, 0.5, 0.82, { text: idx, fs: 12 });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.55, w: 8.0, h: 0.7, fontFace: F.head, bold: true, color: C.wine, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const panel = (s, x, y, w, h, col = C.crimson) => t.rect(s, x, y, w, h, C.panel, { line: { color: col, width: 1.5 }, name: 'Panel' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.linen }; idx++;
    t.img(s, vineImg, 0, 0.08, W, 0.31); t.img(s, vineImg, 0, 4.95, W, 0.31);
    await medal(s, 5.35, 0.45, 4.45, { src: d.image });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 4.6, h: 0.3, fontSize: 12, bold: true, color: C.indigo });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.7, h: 2.3, fontFace: F.head, bold: true, fontSize: L.fit(d.title, 4.7, 2.2, 40, 22, F.head, true), color: C.wine, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 4.6, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.3, w: 4.6, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.crimson });
    t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.32, w: 8.8, h: 0.22, fontSize: 8, color: C.muted, align: 'center' });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await medal(s, 0.6, 1.4, 3.6, { src: d.image }); para(s, d.text, 4.6, 1.45, 4.8, 3.5); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.45, 4.6, 3.5); await medal(s, 5.7, 1.4, 3.6, { src: d.image, alt: true }); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        await medal(s, x, y - 0.08, 0.78, { text: i + 1, fs: 12, alt: i % 2 === 1 });
        t.text(s, it, { x: x + 0.95, y, w: 3.3, h: 0.62, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        panel(s, x, 1.5, w, h, i % 2 ? C.indigo : C.crimson);
        await medal(s, x + 0.12, 1.6, 0.8, { alt: i % 2 === 1 });
        t.img(s, await L.icon(it.icon, i % 2 ? C.indigo : C.crimson, 2.5), x + 0.41, 1.89, 0.22, 0.22);
        t.text(s, it.h, { x: x + 1.0, y: 1.6, w: w - 1.15, h: 0.8, fontFace: F.head, fontSize: L.fit(it.h, w - 1.15, 0.8, 16, 11, F.head, true), bold: true, color: C.wine, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.55, w: w - 0.4, h: h - 1.15, fontSize: 14, color: C.ink });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      t.img(s, vineImg, 0.6, 1.73, 8.8, 0.3);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await medal(s, x, 1.35, 1.05, { text: i + 1, fs: 16, alt: i % 2 === 1 });
        t.text(s, st.h, { x, y: 2.55, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.wine });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 15, 11, F.body), color: C.ink });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(2.3, cw - 0.4);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.6 + i * cw + cw / 2;
        await medal(s, cx - dd / 2, 1.3, dd, { text: x.value, fs: L.fit(x.value, dd * 0.42 - 0.05, dd * 0.3, 30, 12, F.head, true), alt: i % 2 === 1 });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.4 + dd, w: cw - 0.3, h: 0.85, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.6, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.indigo : C.crimson;
        panel(s, x, 1.45, w, 3.45, col);
        t.rect(s, x, 1.45, w, 0.55, col, { name: 'Header' });
        t.text(s, side.h, { x: x + 0.2, y: 1.45, w: w - 0.4, h: 0.55, fontFace: F.head, fontSize: 17, bold: true, color: C.linen, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.text(s, '\u273F', { x: x + 0.2, y, w: 0.35, h: 0.32, fontSize: 13, color: col }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d);
      await medal(s, 0.5, 1.6, 1.6); await medal(s, 7.9, 1.6, 1.6, { alt: true });
      t.text(s, L.runs(d.text), { x: 2.3, y: 1.4, w: 5.4, h: 2.0, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 5.4, 1.9, 32, 18, F.head, true), color: C.wine, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.6, w: 8.0, h: 1.2, fontSize: L.fit(d.caption, 8.0, 1.2, 14, 10, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      t.img(s, vineImg, 0.6, 2.2, 8.8, 0.3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.45, w: cw - 0.2, h: 0.65, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 13, F.head, true), bold: true, color: i % 2 ? C.indigo : C.crimson, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.7, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.wine });
        t.text(s, it.t, { x, y: 3.15, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.ink });
      });
    },
    async quote(d) {
      const s = await page({});
      await medal(s, 0.6, 1.2, 2.9, { text: '\u201C', fs: 54 });
      t.text(s, d.text, { x: 3.9, y: 1.2, w: 5.5, h: 2.4, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 5.5, 2.3, 30, 16, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 3.9, y: 3.75, w: 5.5, h: 0.4, fontSize: 15, bold: true, color: C.crimson });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, '\u273F', { x: 0.6, y, w: 0.4, h: rh, fontSize: 16, color: i % 2 ? C.indigo : C.crimson, valign: 'middle' });
        t.text(s, it, { x: 1.05, y, w: 8.35, h: rh, fontSize: L.fit(it, 8.35, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all stitched on the same cloth: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.wine, align: o.align, valign: o.valign || 'middle' });
  const stitches = async (s, x, y, w, c = C.gold) => t.img(s, (memo['st' + c] ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="40">${Array.from({ length: 40 }, (_, k) => `<polygon points="${k * 40 + 20},4 ${k * 40 + 34},20 ${k * 40 + 20},36 ${k * 40 + 6},20" fill="#${c}"/><circle cx="${k * 40}" cy="20" r="3.5" fill="#${c}"/>`).join('')}</svg>`, 1600, 40)), x, y, w, w / 40);
  const vineV = async (s, cx, cy, len) => s.addImage({ data: (memo.vv ??= await L.svg(vine(640, 50), 640, 50)), x: cx - len / 2, y: cy - 0.15, w: len, h: 0.3, rotate: 90, altText: '' });
  const archSvg = (w, h, line, fill) => { const m = 5, a = Math.min(w * 0.42, h * 0.34), p = (o) => `M${m + o},${h - m - o} L${m + o},${a + o} C${m + o},${a * 0.4 + o} ${w * 0.3},${a * 0.22 + o} ${w / 2},${m + o} C${w * 0.7},${a * 0.22 + o} ${w - m - o},${a * 0.4 + o} ${w - m - o},${a + o} L${w - m - o},${h - m - o} Z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${p(0)}" fill="#${fill}" stroke="#${line}" stroke-width="5"/><path d="${p(11)}" fill="none" stroke="#${C.gold}" stroke-width="2.5" stroke-dasharray="7 6"/></svg>`; };
  const arch = async (s, x, y, w, h, line = C.crimson, fill = C.panel) => t.img(s, (memo[`a${w}${h}${line}${fill}`] ??= await L.svg(archSvg(Math.round(w * 100), Math.round(h * 100), line, fill), w * 100, h * 100)), x, y, w, h);
  const wine = async (d) => { // the wine-red cloth, gold thread instead of the green vine
    const s = pres.addSlide(); s.background = { color: C.wine }; idx++;
    await stitches(s, 0, 0.14, W);
    await medal(s, 0.5, 0.5, 0.82, { text: idx, fs: 12 });
    t.text(s, d.title, { x: 1.45, y: 0.55, w: 8.0, h: 0.7, fontFace: F.head, bold: true, color: C.linen, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: 'E9D9C4', align: 'center' });
    return s;
  };
  const SOFT = 'F0E3CF';
  const V = {
    image: [
      async (d) => { // the picture stands in a mihrab arch
        const s = await page(d), x = 6.05, y = 1.32, w = 3.2, h = 3.75;
        await arch(s, x - 0.1, y - 0.06, w + 0.2, h + 0.12);
        t.img(s, await L.photo(L.src(d.image), w - 0.3, h - 0.3, { mask: { path: 'M0,1 L0,.33 C0,.14 .3,.08 .5,0 C.7,.08 1,.14 1,.33 L1,1 Z' } }), x + 0.15, y + 0.18, w - 0.3, h - 0.3, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 1.38, w: 5.05, h: 3.65, fontSize: L.fit(d.text, 5.05, 3.65, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // wine cloth: a long strip of picture between two rows of gold stitches
        const s = await wine(d);
        await stitches(s, 0, 1.3, W);
        t.img(s, await L.photo(L.src(d.image), W, 1.9), 0, 1.52, W, 1.9, { alt: '' });
        await stitches(s, 0, 3.44, W);
        t.text(s, d.text, { x: 0.6, y: 3.72, w: 8.8, h: 1.42, fontSize: L.fit(d.text, 8.8, 1.42, 15, 10, F.body, false, 1.15), color: C.linen, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // the picture is the wall, a piece of linen hangs on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 4.3, 0, 5.2, 5.2, C.linen, { line: { color: C.crimson, width: 2 }, name: 'Linen' });
        t.img(s, vineImg, 4.3, 0.1, 5.2, 0.24);
        await medal(s, 4.45, 0.45, 0.8, { text: idx, fs: 12 });
        t.text(s, d.title, { x: 5.32, y: 0.45, w: 4.0, h: 0.8, fontFace: F.head, bold: true, color: C.wine, valign: 'middle', fontSize: L.fit(d.title, 4.0, 0.8, 22, 13, F.head, true) });
        t.text(s, d.text, { x: 4.6, y: 1.35, w: 4.6, h: 3.7, fontSize: L.fit(d.text, 4.6, 3.7, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.2, W, H - 5.2, C.wine, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 8.5, color: C.linen, align: 'center', valign: 'middle' });
      },
      async (d) => { // the centre field of a cloth: picture with a medallion at each corner
        const s = await page(d), x = 0.95, y = 1.72, w = 4.1, h = 2.95, m = 0.8;
        t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.crimson, { name: 'Field' });
        t.img(s, await L.photo(L.src(d.image), w, h), x, y, w, h, { alt: '' });
        for (const [a, b, alt] of [[0, 0, 0], [1, 0, 1], [0, 1, 1], [1, 1, 0]]) await medal(s, x - 0.42 + a * w - (a ? -0.04 : 0), y - 0.42 + b * h - (b ? -0.04 : 0), m, { alt: !!alt });
        t.text(s, d.text, { x: 5.75, y: 1.38, w: 3.65, h: 3.68, fontSize: L.fit(d.text, 3.65, 3.68, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // arches in a row, the inner two a little lower, like a colonnade
        const s = await page(d), n = d.items.length, gap = 0.18, w = (8.8 - gap * (n - 1)) / n, h = 3.45;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.34 + (i % 2 ? 0.28 : 0), col = i % 2 ? C.indigo : C.crimson;
          await arch(s, x, y, w, h, col);
          t.img(s, await L.icon(it.icon, col, 2.25), x + w / 2 - 0.17, y + 0.42, 0.34, 0.34);
          head(s, it.h, x + 0.2, y + 0.82, w - 0.4, 0.56, { align: 'center', max: 15 });
          body(s, it.t, x + 0.22, y + 1.4, w - 0.44, h - 1.56, { align: 'center', max: 13 });
        }
      },
      async (d) => { // wine cloth: linen patches two by two, the third of three lies wide
        const s = await wine(d), n = d.items.length, w = 4.3, h = 1.76;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.36 + Math.floor(i / 2) * (h + 0.1);
          t.rect(s, x, y, ww, h, C.panel, { line: { color: C.gold, width: 2 }, name: 'Patch' });
          await medal(s, x + 0.08, y + 0.08, 0.78, { alt: i % 2 === 1 });
          t.img(s, await L.icon(it.icon, i % 2 ? C.indigo : C.crimson, 2.5), x + 0.36, y + 0.36, 0.22, 0.22);
          head(s, it.h, x + 0.94, y + 0.12, ww - 1.06, 0.7, { max: 15 });
          body(s, it.t, x + 0.2, y + 0.88, ww - 0.36, h - 0.94, { max: 13 });
        }
      },
      async (d) => { // the oy-palak in the middle, its words laid around it
        const s = await page(d), n = d.items.length, dd = 2.35, w = 3.1, h = 1.78;
        await medal(s, 5 - dd / 2, 3.2 - dd / 2, dd, { alt: true });
        const spots = n === 3 ? [[0.6, 1.36, 'right'], [0.6, 3.26, 'right'], [6.3, 2.31, 'left']] : [[0.6, 1.36, 'right'], [6.3, 1.36, 'left'], [0.6, 3.26, 'right'], [6.3, 3.26, 'left']];
        for (const [i, it] of d.items.entries()) {
          const [x, y, a] = spots[i], col = i % 2 ? C.indigo : C.crimson, right = a === 'right';
          t.img(s, await L.icon(it.icon, col, 2.25), right ? x + w - 0.32 : x, y + 0.03, 0.32, 0.32);
          head(s, it.h, right ? x : x + 0.4, y, w - 0.4, 0.4, { align: a, max: 15 });
          t.rect(s, x, y + 0.42, w, 0.02, col, { name: 'Thread' });
          body(s, it.t, x, y + 0.5, w, h - 0.54, { align: a, max: 13 });
        }
      },
      async (d) => { // a stem down the page, a flower to each line
        const s = await page(d), n = d.items.length, h = 3.74 / n, dd = Math.min(0.86, h - 0.04);
        await vineV(s, 1.03, 3.2, 3.76);
        for (const [i, it] of d.items.entries()) {
          const y = 1.34 + i * h;
          await medal(s, 1.03 - dd / 2, y + (h - dd) / 2, dd, { alt: i % 2 === 1 });
          t.img(s, await L.icon(it.icon, i % 2 ? C.indigo : C.crimson, 2.5), 1.03 - 0.12, y + h / 2 - 0.12, 0.24, 0.24);
          head(s, it.h, 1.7, y + 0.03, 2.6, h - 0.08, { max: 17 });
          body(s, it.t, 4.4, y + 0.04, 5.0, h - 0.1, { valign: 'middle', max: 14 });
        }
      },
    ],
    process: [
      async (d) => { // patches sewn down a slope, a medallion leading each
        const s = await page(d), n = d.steps.length, dy = n === 4 ? 0.95 : 1.26, dx = n === 4 ? 0.82 : 1.2, h = dy - 0.1, w = 5.95, dd = Math.min(0.85, h);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * dx, y = 1.34 + i * dy, col = i % 2 ? C.indigo : C.crimson;
          panel(s, x + dd / 2, y, w, h, col);
          await medal(s, x, y + (h - dd) / 2, dd, { text: i + 1, fs: 13, alt: i % 2 === 1 });
          head(s, st.h, x + dd + 0.1, y + 0.02, w - dd / 2 - 0.25, 0.32, { max: 14 });
          body(s, st.t, x + dd + 0.1, y + 0.34, w - dd / 2 - 0.25, h - 0.38, { max: 13 });
        }
      },
      async (d) => { // a climbing vine in the middle, steps leaf out to either side
        const s = await page(d), n = d.steps.length, gap = n === 4 ? 0.88 : 1.22, h = n === 4 ? 1.2 : 1.3, w = 3.95, cx = 5;
        await vineV(s, cx, 3.2, 3.76);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.34 + i * gap, x = right ? cx + 0.46 : cx - 0.46 - w, a = right ? 'left' : 'right', col = right ? C.indigo : C.crimson;
          await medal(s, cx - 0.4, y + 0.02, 0.8, { text: i + 1, fs: 12, alt: right });
          head(s, st.h, x, y, w, 0.36, { align: a, max: 15, color: col });
          body(s, st.t, x, y + 0.38, w, h - 0.42, { align: a, max: 13 });
        }
      },
      async (d) => { // the cloth itself: long strips sewn side by side, as a suzani is made
        const s = await page(d), n = d.steps.length, w = W / n, cols = [C.crimson, C.indigo, C.wine, '1F2A4D'];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, l = i ? 0.2 : 0.45, r = i === n - 1 ? 0.45 : 0.2;
          t.rect(s, x, 1.36, w, 3.76, cols[i], { name: 'Strip' });
          if (i) t.line(s, x, 1.36, 0, 3.76, C.gold, 2.5, { dash: 'dash' });
          await medal(s, x + l, 1.46, 0.86, { text: i + 1, fs: 13 });
          head(s, st.h, x + l, 2.36, w - l - r, 0.6, { color: C.linen, max: 16 });
          body(s, st.t, x + l, 2.98, w - l - r, 2.06, { color: SOFT, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // one number in the heart of a great medallion
        const s = await page(d), [a, ...rest] = d.stats, dd = 3.0, x = 0.6, y = 1.3, core = 0.48;
        t.img(s, await med(core), x, y, dd, dd);
        const cd = dd * core;
        t.text(s, a.value, { x: x + (dd - cd) / 2 + 0.03, y: y + (dd - cd) / 2, w: cd - 0.06, h: cd, fontFace: F.head, bold: true, color: C.wine, align: 'center', valign: 'middle', fontSize: L.fit(a.value, cd - 0.12, 0.8, 30, 13, F.head, true) });
        body(s, a.label, 0.5, 4.32, 3.2, 0.78, { align: 'center', max: 14, valign: 'middle' });
        for (const [i, v] of rest.entries()) {
          const yy = 1.42 + i * 1.18, col = i ? C.indigo : C.crimson;
          t.text(s, v.value, { x: 4.1, y: yy, w: 2.4, h: 0.98, fontFace: F.head, bold: true, color: col, valign: 'middle', fontSize: L.fit(v.value, 2.35, 0.9, 40, 18, F.head, true) });
          body(s, v.label, 6.6, yy, 2.8, 0.98, { valign: 'middle', max: 14 });
          t.img(s, vineImg, 4.1, yy + 0.99, 5.3, 0.16);
        }
        if (d.note) body(s, d.note, 4.1, 3.84, 5.3, 1.26, { max: 13, color: C.muted, valign: 'middle' });
      },
      async (d) => { // wine cloth: three lines in gold thread, one above another
        const s = await wine(d), h = 0.94;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.34 + i * h;
          t.text(s, '✿', { x: 0.6, y, w: 0.5, h: h - 0.12, fontSize: 22, color: C.gold, valign: 'middle' });
          t.text(s, v.value, { x: 1.15, y, w: 3.1, h: h - 0.12, fontFace: F.head, bold: true, color: C.gold, valign: 'middle', fontSize: L.fit(v.value, 3.05, h - 0.16, 40, 20, F.head, true) });
          body(s, v.label, 4.4, y, 5.0, h - 0.12, { valign: 'middle', color: C.linen, max: 15 });
          await stitches(s, 0.6, y + h - 0.1, 8.8);
        }
        if (d.note) body(s, d.note, 0.6, 4.2, 8.8, 0.92, { color: SOFT, max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored: a vine between the two sides, their words lean away from it
        const s = await page(d), w = 3.95, cx = 5;
        await vineV(s, cx, 3.2, 3.76);
        await medal(s, cx - 0.42, 1.3, 0.84, { alt: true });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.34, F.body, 0.16, 2.9);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.5 : cx - 0.5 - w, a = i ? 'left' : 'right', col = i ? C.indigo : C.crimson;
          head(s, side.h, x, 1.36, w, 0.56, { max: 20, align: a, color: col });
          t.rect(s, x, 1.94, w, 0.03, col, { name: 'Thread' });
          let y = 2.12;
          side.items.forEach((it, j) => {
            t.text(s, '✿', { x: i ? x : x + w - 0.26, y, w: 0.26, h: 0.28, fontSize: 12, color: col, align: a });
            t.text(s, it, { x: i ? x + 0.34 : x, y, w: w - 0.34, h: rows[j], fontSize: fs, color: C.ink, align: a });
            y += rows[j];
          });
        }
      },
      async (d) => { // two lengths of cloth, crimson over indigo
        const s = await page(d), h = 1.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.36 + i * (h + 0.1), col = i ? C.indigo : C.crimson, rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          t.rect(s, 0, y, W, h, col, { name: 'Length' });
          await medal(s, 0.4, y + 0.14, 0.72);
          head(s, side.h, 0.4, y + 0.88, 2.3, h - 0.94, { color: C.linen, max: 16, valign: 'top' });
          t.line(s, 2.85, y + 0.14, 0, h - 0.28, C.gold, 1.5, { dash: 'dash' });
          side.items.forEach((it, j) => body(s, it, 3.05 + (j % 2) * 3.25, y + 0.1 + Math.floor(j / 2) * rh, 3.05, rh - 0.05, { color: SOFT, max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // wine cloth: the words beside one great medallion
        const s = await wine(d), dd = 3.5;
        await medal(s, 6.0, 1.42, dd, { alt: true });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.36, w: 5.1, h: 2.3, fontFace: F.head, bold: true, color: C.linen, valign: 'middle', fontSize: L.fit(d.text, 5.1, 2.25, 30, 15, F.head, true) });
        await stitches(s, 0.6, 3.72, 5.1);
        if (d.caption) body(s, d.caption, 0.6, 3.96, 5.1, 1.18, { color: SOFT, max: 13 });
      },
      async (d) => { // inside the arch: words above, the note in the niche below them
        const s = await page(d), x = 1.75, w = 6.5, y = 1.26, h = 3.9;
        await arch(s, x, y, w, h);
        await medal(s, 0.5, 2.6, 1.05); await medal(s, 8.45, 2.6, 1.05, { alt: true });
        t.text(s, L.runs(d.text), { x: x + 0.5, y: y + 0.82, w: w - 1.0, h: 1.62, fontFace: F.head, bold: true, color: C.wine, align: 'center', valign: 'middle', fontSize: L.fit(d.text, w - 1.0, 1.58, 26, 14, F.head, true) });
        if (d.caption) body(s, d.caption, x + 0.5, y + 2.5, w - 1.0, 1.24, { align: 'center', color: C.muted, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // the vine runs across the page, years flower above and below it
        const s = await page(d), axis = 3.22, w = 3.65;
        t.img(s, vineImg, 0, axis - 0.15, W, 0.3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.6 + (i / 2) * 4.5 : 1.75 + ((i - 1) / 2) * 4.5, col = up ? C.crimson : C.indigo, top = up ? 1.34 : 3.5;
          t.oval(s, x + 0.1, axis - 0.13, 0.26, 0.26, C.gold, { line: { color: col, width: 2 } });
          t.text(s, it.year, { x, y: top, w: 1.5, h: 0.36, fontFace: F.head, bold: true, color: col, valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.34, 18, 11, F.head, true) });
          head(s, it.h, x + 1.55, top, w - 1.55, 0.36, { max: 13 });
          body(s, it.t, x, top + 0.38, w, 1.22, { max: 13 });
        }
      },
      async (d) => { // wine cloth: a gold thread, the years hang from it on gold beads
        const s = await wine(d), n = d.items.length, cw = 8.8 / n;
        t.line(s, 0, 1.68, W, 0, C.gold, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, w = cw - 0.2, y = i % 2 ? 2.46 : 2.14, ew = Math.min(1.72, w);
          t.oval(s, x, 1.38, ew, 0.62, C.gold, { line: { color: C.linen, width: 1.5 } });
          t.text(s, it.year, { x: x + 0.1, y: 1.38, w: ew - 0.2, h: 0.62, fontFace: F.head, bold: true, color: C.wine, align: 'center', valign: 'middle', fontSize: L.fit(it.year, ew - 0.28, 0.4, 16, 10, F.head, true) });
          t.line(s, x + 0.2, 2.0, 0, y - 2.0, C.gold, 1.5, { dash: 'dash' });
          head(s, it.h, x + 0.3, y, w - 0.3, 0.42, { color: C.linen, max: 14 });
          body(s, it.t, x + 0.3, y + 0.44, w - 0.3, 5.14 - y - 0.44, { color: SOFT, max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Suzani', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.wine, lt2: C.linen, accent1: C.crimson, accent2: C.indigo, accent3: C.gold, accent4: C.green, accent5: C.wine, accent6: C.muted, hlink: C.indigo, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "milliy va iliq: hurmatli, ravon o'zbek nutqi; madaniy merosga ehtirom bilan, lekin aniq faktlar", limits: { card_h: 20 }, prefer: null };
module.exports = { id: 46, slug: 'suzani', name: 'Suzani', category: 'creative', photos: true, build, style: STYLE };
