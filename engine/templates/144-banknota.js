/** 144 Banknota — every slide is a BANKNOTE: guilloche rosettes and an ornamental border, red serial number, denomination (slide number) in the corners, a portrait oval for photos, engraved serif type. */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'F2EFE3', ink: '1F3D33', muted: '4E6359', line: '6E9283', red: 'B3261E' };
const F = { head: 'Times New Roman', body: 'Times New Roman' };
const ros = (r) => { let g = ''; for (let i = 0; i < 36; i++) g += `<ellipse cx="100" cy="100" rx="${r}" ry="${r * 0.35}" transform="rotate(${i * 5} 100 100)" fill="none" stroke="#6E9283" stroke-width="0.8" opacity="0.7"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">${g}</svg>`; };
const border = () => { let g = '<rect x="10" y="10" width="1580" height="880" rx="30" fill="none" stroke="#1F3D33" stroke-width="6"/><rect x="34" y="34" width="1532" height="832" rx="22" fill="none" stroke="#6E9283" stroke-width="2"/>'; for (let x = 50; x < 1560; x += 16) g += `<circle cx="${x}" cy="22" r="5" fill="none" stroke="#6E9283"/><circle cx="${x}" cy="878" r="5" fill="none" stroke="#6E9283"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#F2EFE3"/>${g}</svg>`; };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const bg = await k.svg('b', border(), 1600, 900, true), rose = await k.svg('r', ros(95), 200, 200);
  const corners = (s) => { [[0.3, 0.25], [8.85, 0.25], [0.3, 4.55], [8.85, 4.55]].forEach(([x, y]) => { t.img(s, rose, x - 0.1, y - 0.1, 1.05, 1.05); k.txt(s, String(k.idx), x, y, 0.85, 0.85, { size: 26, bold: true, color: C.ink, align: 'center', valign: 'middle' }); }); };
  const serial = (s) => k.txt(s, `AA ${String(k.idx * 7919).padStart(7, '0')}`, 1.3, 0.35, 2.5, 0.35, { size: 12, bold: true, color: C.red, font: 'Courier New' });
  const page = (d) => { const s = k.slide({ data: bg }); corners(s); serial(s); if (d.title) k.head(s, d.title.toUpperCase(), 1.3, 0.7, 7.4, 0.6, { max: 22, min: 12, align: 'center', spacing: 2 }); t.line(s, 3.0, 1.32, 4.0, 0, C.line, 1); k.foot(s, { x: 1.3, w: 7.4, y: 5.12, size: 7.5, align: 'center' }); return s; };
  const X = 1.3, W = 7.4, Y = 1.45, Hc = 3.55;
  // fields separated by small rosettes
  const fields = (s, n, draw) => { const w = W / n; for (let i = 0; i < n; i++) { const x = X + i * w; if (i) t.img(s, rose, x - 0.25, Y + Hc / 2 - 0.25, 0.5, 0.5); draw(i, x + 0.15, Y, w - 0.3, Hc); } };
  const R = {
    async cover(d) { const s = k.slide({ data: bg }); corners(s); serial(s); t.img(s, rose, 2.6, 0.6, 4.5, 4.5); t.rect(s, 1.25, 0.95, 4.95, 3.6, C.paper, { t: 12, name: 'Ground' }); if (d.image) { t.oval(s, 6.3, 1.0, 2.4, 3.2, C.paper, { line: { color: C.ink, width: 3 } }); await k.photo(s, d.image, 6.4, 1.1, 2.2, 3.0, { mask: 'circle', duo: ['1F3D33', 'F2EFE3'] }); }
      k.txt(s, (k.M.org || '').toUpperCase(), 1.3, 1.0, 4.8, 0.4, { size: 13, bold: true, spacing: 3 }); k.head(s, d.title.toUpperCase(), 1.3, 1.5, 4.9, 2.0, { max: 28, min: 14, spacing: 1 }); k.txt(s, d.subtitle || '', 1.3, 3.5, 4.8, 0.6, { max: 12, italic: true, color: C.muted }); k.txt(s, k.M.author || '', 1.3, 4.1, 4.8, 0.4, { size: 15, italic: true }); k.foot(s, { x: 1.3, w: 7.4, y: 5.12, size: 7.5, align: 'center' }); },
    async intro(d) { const s = page(d); t.oval(s, X, Y, 2.8, Hc, C.paper, { line: { color: C.ink, width: 3 } }); await k.photo(s, d.image, X + 0.1, Y + 0.1, 2.6, Hc - 0.2, { mask: 'circle', duo: ['1F3D33', 'F2EFE3'] }); k.txt(s, d.text, X + 3.1, Y, W - 3.1, Hc, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d), n = d.items.length, rh = Hc / n; d.items.forEach((it, i) => { const y = Y + i * rh; k.txt(s, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1, X, y, 0.8, rh, { size: 15, bold: true, color: C.red, valign: 'middle' }); k.head(s, it, X + 0.85, y, W - 0.85, rh, { max: 16, bold: false }); }); },
    async cards(d) { const s = page(d); fields(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.55, { max: 15, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.6, w, h - 0.6, { max: 12, align: 'center', color: C.muted }); }); },
    async process(d) { const s = page(d); fields(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.55, { max: 15, align: 'center' }); k.txt(s, d.steps[i].t, x, y + 0.6, w, h - 0.6, { max: 12, align: 'center', color: C.muted }); }); },
    async stats(d) { const s = page(d); fields(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y + 0.2, w, 1.2, { max: 44, min: 16, align: 'center', color: i ? C.ink : C.red }); k.txt(s, d.stats[i].label, x, y + 1.5, w, h - 1.5 - (d.note ? 0.5 : 0), { max: 12, align: 'center', italic: true }); }); if (d.note) k.txt(s, d.note, X, Y + Hc - 0.45, W, 0.45, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), w = W / 2 - 0.35, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.1, Hc - 0.55); t.img(s, rose, 4.75, Y + Hc / 2 - 0.25, 0.5, 0.5); [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.7); k.head(s, sd.h, x, Y, w, 0.45, { max: 16, align: 'center', color: i ? C.ink : C.red }); let y = Y + 0.55; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: 'center' }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.img(s, rose, 3.6, Y - 0.15, 2.8, 2.8); k.head(s, L.runs(d.text), X, Y, W, 2.6, { max: 28, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, X, Y + 2.7, W, 0.85, { max: 11, align: 'center', italic: true, color: C.muted }); },
    async timeline(d) { const s = page(d); fields(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.55, { max: 22, min: 11, align: 'center', color: C.red }); k.head(s, d.items[i].h, x, y + 0.58, w, 0.42, { max: 13, align: 'center' }); k.txt(s, d.items[i].t, x, y + 1.02, w, h - 1.02, { max: 11, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({}); t.img(s, rose, 3.6, Y - 0.15, 2.8, 2.8); k.head(s, `\u201C${d.text}\u201D`, X, Y, W, 2.8, { max: 26, min: 13, italic: true, bold: false, align: 'center' }); if (d.author) k.txt(s, d.author, X, Y + 2.9, W, 0.45, { size: 14, italic: true, color: C.red, align: 'center' }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = Hc / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, X, Y + i * rh, W, rh, { max: 12, valign: 'middle', align: 'center' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, engraved on the same note, front and back: a deck's pages must not look alike (L.pages)
  const INK = C.ink, RED = C.red, PAPER = C.paper, BUFF = 'E6E1CC', PGOLD = 'DCC98F', LN = C.line, ROM = ['I', 'II', 'III', 'IV'];
  const bgD = await k.svg('bD', border().replace('fill="#F2EFE3"', 'fill="#1F3D33"').replace(/stroke="#1F3D33"/g, 'stroke="#DCC98F"').replace(/stroke="#6E9283"/g, 'stroke="#6E9283"'), 1600, 900, true);
  const pg = (d, o = {}) => { const dk = !!o.dark, s = k.slide({ data: dk ? bgD : bg }), ink = dk ? PAPER : INK; if (d.title) k.head(s, d.title.toUpperCase(), o.x ?? 0.5, o.y ?? 0.33, o.w ?? 7.95, 0.68, { max: 20, min: 12, spacing: 1.5, color: ink, align: o.a || 'center' }); t.img(s, rose, 8.62, 0.26, 0.95, 0.95); k.txt(s, String(k.idx), 8.67, 0.31, 0.85, 0.85, { size: 24, bold: true, color: ink, align: 'center', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.5, y: 5.12, w: o.fw ?? 6.3, size: 7.5, color: dk ? PAPER : C.muted }); k.txt(s, `AA ${String(k.idx * 7919).padStart(7, '0')}`, o.sx ?? 7.5, 5.08, 2.0, 0.26, { size: 11, bold: true, font: 'Courier New', color: dk ? PGOLD : RED, align: 'right', valign: 'middle' }); return s; };
  const dark = (d, o = {}) => pg(d, { dark: true, ...o });
  const seal = async (s, x, y, dd, c = RED) => { let p = ''; for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24, r = i % 2 ? 100 : 91; p += `${100 + r * Math.cos(a)},${100 + r * Math.sin(a)} `; } t.img(s, await k.svg(`seal${c}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${p}" fill="#${c}"/><circle cx="100" cy="100" r="80" fill="none" stroke="#fff" stroke-width="2" opacity="0.8"/></svg>`, 200, 200), x, y, dd, dd); };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10.5, ls: 1.15, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const panel = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill ?? BUFF, { r: 0.08, line: { color: o.line ?? INK, width: o.lw ?? 1 }, name: 'Coupon' });
  const V = {
    image: [
      async (d) => { // the portrait oval stands at the right on a great rosette, words at the left
        const s = pg(d, { w: 4.9, a: 'left' }), x = 5.75, y = 1.15, w = 2.85, h = 3.85;
        t.img(s, rose, x - 0.7, y - 0.25, 4.3, 4.3);
        t.oval(s, x, y, w, h, PAPER, { line: { color: INK, width: 3 } });
        await k.photo(s, d.image, x + 0.1, y + 0.1, w - 0.2, h - 0.2, { mask: 'circle', duo: ['1F3D33', 'F2EFE3'] });
        bd(s, d.text, 0.5, 1.15, 4.45, 3.85, { valign: 'middle', ls: 1.25, max: 15, color: INK });
      },
      async (d) => { // a wide engraved vignette across the note, the words beneath it
        const s = pg(d);
        t.rect(s, 0.48, 1.08, 9.04, 2.1, null, { line: { color: INK, width: 2 }, name: 'Vignette' });
        await k.photo(s, d.image, 0.53, 1.13, 8.94, 2.0, { duo: ['1F3D33', 'F2EFE3'] });
        bd(s, d.text, 0.55, 3.26, 8.9, 1.76, { valign: 'middle', color: INK, align: 'center', max: 14 });
      },
      async (d) => { // the back of the note: dark ink, the picture in a rounded frame, pale words
        const s = dark(d, { w: 7.95 }), x = 0.5, y = 1.15, w = 4.3, h = 3.85;
        t.rect(s, x - 0.05, y - 0.05, w + 0.1, h + 0.1, null, { r: 0.1, line: { color: PGOLD, width: 2 }, name: 'Frame' });
        await k.photo(s, d.image, x, y, w, h, { mask: { r: 0.08 } });
        bd(s, d.text, 5.1, 1.15, 4.4, 3.85, { color: PAPER, valign: 'middle', max: 14.5, ls: 1.22 });
      },
      async (d) => { // the picture fills the note in one ink, a paper cartouche in the middle
        const s = k.slide({ data: bg }), x = 2.15, y = 0.42, w = 5.7, h = 4.8;
        await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['1F3D33', 'C9D6C9'] });
        t.rect(s, x, y, w, h, PAPER, { r: 0.1, line: { color: INK, width: 3 }, name: 'Cartouche' });
        t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { r: 0.08, line: { color: LN, width: 1 }, name: 'Cartouche' });
        k.head(s, (d.title || '').toUpperCase(), x + 0.3, y + 0.14, w - 0.6, 0.72, { max: 17, min: 11, spacing: 1.5, align: 'center' });
        t.line(s, x + 1.6, y + 0.88, w - 3.2, 0, LN, 1);
        bd(s, d.text, x + 0.3, y + 0.94, w - 0.6, h - 1.42, { valign: 'middle', align: 'center', color: INK, max: 13.5 });
        k.foot(s, { x: x + 0.3, y: y + h - 0.42, w: w - 0.6, size: 7, align: 'center', color: C.muted });
        k.txt(s, String(k.idx), 0.3, 0.3, 0.9, 0.7, { size: 26, bold: true, color: PAPER, align: 'center', valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // coupons printed on buff, one rosette in the corner of each
        const s = pg(d), n = d.items.length, W = 4.42, H = 1.88, pos = n === 4 ? [[0.5, 1.12, W], [5.08, 1.12, W], [0.5, 3.12, W], [5.08, 3.12, W]] : [[0.5, 1.12, W], [5.08, 1.12, W], [0.5, 3.12, 9.0]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i];
          panel(s, x, y, w, H);
          t.img(s, rose, x + 0.08, y + 0.06, 0.62, 0.62);
          t.img(s, await k.icon(it.icon, RED, 2), x + 0.24, y + 0.22, 0.3, 0.3);
          hd(s, it.h, x + 0.8, y + 0.1, w - 0.95, 0.52);
          bd(s, it.t, x + 0.18, y + 0.72, w - 0.36, H - 0.78, { max: 13.5, color: INK });
        }
      },
      async (d) => { // notes laid out in a fan: each slips out from under the last, serial at its edge
        const s = pg(d), n = d.items.length, rh = 3.92 / n, dx = 0.3;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * dx, y = 1.1 + i * rh, w = 9.0 - (n - 1) * dx, h = rh - 0.08;
          panel(s, x, y, w, h, { fill: i % 2 ? PAPER : BUFF, lw: 1.25 });
          t.oval(s, x + 0.1, y + h / 2 - 0.3, 0.6, 0.6, PAPER, { line: { color: INK, width: 1.5 } });
          t.img(s, await k.icon(it.icon, INK, 2), x + 0.24, y + h / 2 - 0.16, 0.32, 0.32);
          hd(s, it.h, x + 0.82, y + 0.03, 2.2, h - 0.06, { max: 14 });
          bd(s, it.t, x + 3.1, y + 0.03, w - 3.25, h - 0.06, { valign: 'middle', color: INK, max: 13, ls: 1.08 });
        }
      },
      async (d) => { // the back of the note: columns of pale type, a seal of gold above each
        const s = dark(d), n = d.items.length, w = 9.0 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2;
          if (i) t.line(s, x, 1.2, 0, 3.75, PGOLD, 0.5);
          await seal(s, cx - 0.42, 1.12, 0.84, 'B79A4E');
          t.img(s, await k.icon(it.icon, INK, 2), cx - 0.18, 1.36, 0.36, 0.36);
          hd(s, it.h, x + 0.1, 2.02, w - 0.2, 0.56, { color: PGOLD, align: 'center' });
          bd(s, it.t, x + 0.1, 2.6, w - 0.2, 2.42, { color: PAPER, align: 'center', max: 13.5 });
        }
      },
      async (d) => { // a security thread parts the note: one idea in the great oval, the others beyond the thread
        const s = pg(d), [a, ...rest] = d.items, h = 3.85 / rest.length, tx = 5.25;
        for (let y = 1.1; y < 5.0; y += 0.26) t.rect(s, tx - 0.03, y, 0.06, 0.15, RED, { name: 'Thread' });
        t.oval(s, 0.5, 1.1, 4.5, 3.95, BUFF, { line: { color: INK, width: 2.5 } });
        t.img(s, await k.icon(a.icon, RED, 1.75), 2.5, 1.32, 0.5, 0.5);
        hd(s, a.h, 1.05, 1.84, 3.4, 0.5, { align: 'center', max: 16 });
        bd(s, a.t, 1.1, 2.36, 3.3, 2.0, { align: 'center', color: INK, max: 13.5 });
        for (const [i, it] of rest.entries()) {
          const y = 1.12 + i * h;
          t.img(s, await k.icon(it.icon, RED, 2), 5.5, y + 0.04, 0.34, 0.34);
          hd(s, it.h, 5.95, y, 3.55, 0.42);
          bd(s, it.t, 5.5, y + 0.44, 4.0, h - 0.5, { color: INK, max: 13, ls: 1.1 });
        }
      },
    ],
    process: [
      async (d) => { // rising denominations: frames climb to the right, a Roman numeral heads each
        const s = pg(d, { w: 5.8, a: 'left' }), n = d.steps.length, w = 9.0 / n, rise = n === 4 ? 0.1 : 0.2, y0 = 1.15 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w, y = y0 - i * rise - (i === n - 1 && n === 4 ? 0 : 0), bh = 5.02 - y;
          panel(s, x + 0.04, y, w - 0.1, bh, { fill: i === n - 1 ? PAPER : BUFF, lw: 1 + i * 0.5 });
          k.txt(s, ROM[i], x + 0.16, y + 0.06, w - 0.34, 0.6, { size: 26, bold: true, color: RED, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.14, y + 0.68, w - 0.3, 0.52, { align: 'center', max: 14, valign: 'top' });
          bd(s, st.t, x + 0.14, y + 1.22, w - 0.3, 4.98 - y - 1.22, { color: INK, align: 'center', max: 13 });
        }
      },
      async (d) => { // the security thread runs down the middle, a red seal on it at every step
        const s = pg(d), n = d.steps.length, rh = 3.9 / n, w = 3.95, dd = Math.min(0.62, rh - 0.12);
        for (let y = 1.1; y < 5.0; y += 0.22) t.rect(s, 4.97, y, 0.06, 0.13, RED, { name: 'Thread' });
        for (const [i, st] of d.steps.entries()) {
          const y = 1.1 + i * rh, right = i % 2 === 1, x = right ? 5.5 : 0.55, a = right ? 'left' : 'right';
          await seal(s, 5 - dd / 2, y + (rh - dd) / 2, dd);
          k.txt(s, ROM[i], 5 - dd / 2, y + (rh - dd) / 2, dd, dd, { size: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.34, { align: a, max: 15 });
          bd(s, st.t, x, y + 0.37, w, rh - 0.42, { align: a, color: INK, max: 13, ls: 1.08 });
        }
      },
      async (d) => { // the back of the note: one engraved ribbon of arrows across it, the words below
        const s = dark(d), n = d.steps.length, w = 9.0 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w;
          t.shape(s, 'PENTAGON', { x: x + 0.02, y: 1.12, w: w - 0.04, h: 0.7, fill: { color: i % 2 ? PGOLD : PAPER }, line: { color: INK, width: 1 }, objectName: 'Ribbon' });
          k.txt(s, ROM[i], x + 0.1, 1.12, w - 0.45, 0.7, { size: 22, bold: true, color: INK, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.08, 1.92, w - 0.2, 0.56, { color: PGOLD, valign: 'top' });
          bd(s, st.t, x + 0.08, 2.5, w - 0.2, 2.52, { color: PAPER, max: 14 });
        }
      },
      async (d) => { // the great rosette at the centre, the steps set round it clockwise
        const s = pg(d), n = d.steps.length, dd = 2.55, cx = 5, cy = 3.08, W = 3.1, H = 1.9, pos = n === 4 ? [[0.5, 1.12, 0], [6.4, 1.12, 1], [6.4, 3.12, 1], [0.5, 3.12, 0]] : [[0.5, 1.12, 0], [6.4, 2.12, 1], [0.5, 3.12, 0]];
        t.img(s, rose, cx - dd / 2, cy - dd / 2, dd, dd);
        t.oval(s, cx - 0.45, cy - 0.45, 0.9, 0.9, PAPER, { line: { color: INK, width: 2 } });
        k.txt(s, String(n), cx - 0.45, cy - 0.45, 0.9, 0.9, { size: 26, bold: true, color: RED, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, st] of d.steps.entries()) {
          const [x, y, right] = pos[i], a = right ? 'left' : 'right';
          k.txt(s, `${ROM[i]}.`, right ? x : x + W - 0.55, y, 0.55, 0.42, { size: 18, bold: true, color: RED, align: a, valign: 'middle' });
          hd(s, st.h, right ? x + 0.58 : x, y, W - 0.58, 0.42, { align: a });
          bd(s, st.t, x, y + 0.44, W, H - 0.48, { align: a, color: INK, max: 13, ls: 1.1 });
        }
      },
    ],
    stats: [
      async (d) => { // the denomination: the first figure huge on its rosette, the other two as lesser values
        const s = pg(d), [a, ...rest] = d.stats, dd = 3.9, x = 0.45, y = 1.08;
        t.img(s, rose, x, y, dd, dd); t.oval(s, x + 0.5, y + 0.6, dd - 1.0, dd - 1.2, PAPER, { line: { color: INK, width: 1.5 } });
        hd(s, a.value, x + 0.65, y + 0.85, dd - 1.3, 1.05, { max: 46, min: 22, color: RED, align: 'center' });
        bd(s, a.label, x + 0.85, y + 1.95, dd - 1.7, 0.75, { align: 'center', color: INK, max: 13 });
        rest.forEach((v, i) => { const yy = 1.1 + i * 1.0; hd(s, v.value, 4.6, yy, 2.1, 0.92, { max: 32, min: 17 }); bd(s, v.label, 6.75, yy, 2.75, 0.92, { valign: 'middle', color: INK, max: 13, ls: 1.08 }); t.line(s, 4.6, yy + 0.95, 4.9, 0, LN, 1); });
        if (d.note) bd(s, d.note, 4.6, 3.2, 4.9, 1.82, { valign: 'middle', italic: true, max: 13.5 });
      },
      async (d) => { // three treasury seals in red, figures reversed out of them
        const s = pg(d), w = 3.0, dd = 1.95;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2;
          await seal(s, cx - dd / 2, 1.05, dd);
          hd(s, v.value, cx - 0.72, 1.55, 1.44, 0.95, { max: 28, min: 14, color: 'FFFFFF', align: 'center' });
          bd(s, v.label, x + 0.12, 3.04, w - 0.24, 0.72, { align: 'center', italic: true, color: INK, max: 13, ls: 1.05 });
        }
        if (d.note) { t.line(s, 3.0, 3.8, 4.0, 0, LN, 1); bd(s, d.note, 0.6, 3.85, 8.8, 1.18, { align: 'center', valign: 'middle', max: 13.5 }); }
      },
      async (d) => { // the back of the note: an account of three lines, gold figures to the right
        const s = dark(d);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.12 + i * 0.95;
          t.line(s, 0.5, y, 9.0, 0, PGOLD, i ? 0.5 : 2);
          bd(s, v.label, 0.5, y + 0.04, 5.5, 0.86, { color: PAPER, valign: 'middle', italic: true, max: 15 });
          hd(s, v.value, 6.1, y + 0.04, 3.4, 0.86, { color: PGOLD, max: 40, min: 20, align: 'right' });
        }
        t.line(s, 0.5, 3.97, 9.0, 0, PGOLD, 2);
        if (d.note) bd(s, d.note, 0.5, 4.02, 9.0, 1.02, { color: PAPER, valign: 'middle', max: 13 });
      },
    ],
    compare: [
      async (d) => { // the note cut in two: front on the left, back on the right, sides mirrored about a rosette
        const s = pg(d, { fw: 4.2 , sx: 7.5 });
        t.rect(s, 5, 1.05, 4.72, 3.98, INK, { r: 0.05, name: 'Back' });
        t.img(s, rose, 4.55, 2.6, 0.9, 0.9);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.45 : 0.45, w = 4.05, a = i ? 'left' : 'right', rh = 3.25 / sd.items.length, ink = i ? PAPER : INK;
          hd(s, sd.h, x, 1.1, w, 0.55, { align: a, max: 18, color: i ? PGOLD : RED });
          sd.items.forEach((it, j) => bd(s, it, i ? x : x - 0.1, 1.7 + j * rh, i ? w : w - 0.2, rh - 0.05, { align: a, valign: 'middle', color: ink, max: 13.5 }));
        }
      },
      async (d) => { // two notes one above the other, a red label at the head of the first and an ink one on the second
        const s = pg(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.08 + i * 2.0, h = 1.92, c = i ? INK : RED, m = sd.items.length, rows = Math.ceil(m / 2), rh = (h - 0.12) / rows, rw = 3.3;
          panel(s, 0.5, y, 9.0, h, { line: c, lw: 1.5 });
          t.rect(s, 0.5, y, 2.1, h, c, { r: 0.08, name: 'Label' });
          hd(s, sd.h, 0.6, y + 0.08, 1.9, h - 0.16, { color: PAPER, align: 'center', max: 17, min: 12 });
          sd.items.forEach((it, j) => bd(s, it, 2.72 + (j % 2) * (rw + 0.1), y + 0.06 + Math.floor(j / 2) * rh, rw, rh, { valign: 'middle', color: INK, max: 13, ls: 1.08 }));
        }
      },
    ],
    statement: [
      async (d) => { // the back of the note: the thought in pale type over a great rosette
        const s = dark(d, { w: 7.95 });
        t.img(s, rose, 6.75, 1.05, 2.7, 2.7);
        k.head(s, L.runs(d.text), 0.55, 1.1, 6.05, 2.6, { max: 30, min: 16, color: PAPER });
        if (d.caption) bd(s, d.caption, 0.55, 3.8, 8.9, 1.24, { color: PGOLD, valign: 'middle', italic: true, max: 13.5 });
      },
      async (d) => { // a pledge printed in a ribbon, witnessed by a red seal at its end
        const s = pg(d), rb = [[0, 0], [1, 0], [0.97, 0.5], [1, 1], [0, 1], [0.03, 0.5]], w = 9.0, h = 2.45;
        t.img(s, await k.svg('ribbon', `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="245"><polygon points="${rb.map(([a, b]) => `${a * 900},${b * 245}`).join(' ')}" fill="#${BUFF}" stroke="#${INK}" stroke-width="3"/></svg>`, 900, 245), 0.5, 1.1, w, h);
        k.head(s, L.runs(d.text), 1.0, 1.16, 8.0, 2.33, { max: 26, min: 15, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.55, 3.62, 7.2, 1.42, { valign: 'middle', color: INK, italic: true, max: 13.5 });
        await seal(s, 8.05, 3.62, 1.4);
      },
    ],
    timeline: [
      async (d) => { // four coins along one line, a year on each, the words under them
        const s = pg(d), w = 9.0 / 4, dd = 1.22, y = 1.12;
        t.line(s, 0.45, y + dd / 2, 9.1, 0, INK, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2;
          t.oval(s, cx - dd / 2, y, dd, dd, i % 2 ? PGOLD : BUFF, { line: { color: INK, width: 2.25 } });
          t.oval(s, cx - dd / 2 + 0.06, y + 0.06, dd - 0.12, dd - 0.12, null, { line: { color: INK, width: 0.5 } });
          hd(s, it.year, cx - 0.52, y + 0.3, 1.04, 0.62, { max: 15, min: 10, align: 'center', color: RED });
          hd(s, it.h, x + 0.06, y + dd + 0.06, w - 0.14, 0.5, { max: 14, align: 'center' });
          bd(s, it.t, x + 0.06, y + dd + 0.56, w - 0.14, 5.02 - y - dd - 0.56, { align: 'center', color: INK, max: 13 });
        }
      },
      async (d) => { // a bank ledger: years in red, double rule at the head
        const s = pg(d), rh = 3.75 / 4;
        t.line(s, 0.5, 1.08, 9.0, 0, INK, 2); t.line(s, 0.5, 1.13, 9.0, 0, INK, 0.5); t.line(s, 2.75, 1.13, 0, 3.8, LN, 1);
        for (const [i, it] of d.items.entries()) {
          const y = 1.18 + i * rh;
          if (i) t.line(s, 0.5, y, 9.0, 0, LN, 0.75);
          hd(s, it.year, 0.5, y + 0.02, 2.15, rh - 0.04, { color: RED, max: 21, min: 12 });
          hd(s, it.h, 2.88, y + 0.02, 2.1, rh - 0.04, { max: 14 });
          bd(s, it.t, 5.05, y + 0.02, 4.45, rh - 0.04, { valign: 'middle', color: INK, max: 13, ls: 1.08 });
        }
      },
      async (d) => { // the back of the note: four quarters about a rosette
        const s = dark(d), cx = 5, cy = 3.08, W = 4.0;
        t.line(s, 0.5, cy, 9.0, 0, PGOLD, 0.75); t.line(s, cx, 1.1, 0, 3.95, PGOLD, 0.75);
        t.oval(s, cx - 0.37, cy - 0.37, 0.74, 0.74, INK); t.img(s, rose, cx - 0.42, cy - 0.42, 0.84, 0.84);
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? 5.45 : 0.5, y = i < 2 ? 1.1 : 3.14;
          hd(s, it.year, x, y, 1.7, 0.5, { color: PGOLD, max: 22, min: 12 });
          hd(s, it.h, x + 1.72, y, W - 1.72, 0.5, { color: PAPER, max: 14 });
          bd(s, it.t, x, y + 0.52, W - (i < 2 ? 0 : 0), i < 2 ? 1.36 : 1.34, { color: PAPER, max: 13.5, ls: 1.1 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old fields between rosettes were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Banknota', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.ink, lt2: C.paper, accent1: C.red, accent2: C.line, accent3: '8C6D2C', accent4: '3B6E8F', accent5: C.muted, accent6: 'C9D6C9', hlink: C.red, folHlink: C.muted } });
}
module.exports = { id: 144, slug: 'banknota', name: 'Banknota', category: 'luxury', photos: true, build, style: { tone: "qiymat va ishonch: iqtisodiy natijalar, aniq raqamlar, salobatli til", limits: { card_t4: 100, step_t: 100 }, prefer: 'data' } };
