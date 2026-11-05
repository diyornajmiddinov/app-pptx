/** 142 Tarkib — a food NUTRITION LABEL: heavy black frame, giant bold heading, thick and thin rules, item name left and bold value right. Pure black on white. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'EDEDE8', label: 'FFFFFF', ink: '000000', muted: '333333' };
const F = { head: 'Arial', body: 'Arial' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const frame = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.label, { line: { color: C.ink, width: 2.5 }, name: 'Label' }); };
  const rule = (s, x, y, w, wt) => t.rect(s, x, y, w, wt, C.ink, { name: 'Rule' });
  // a label: heading, serving line, thick rule, then rows
  const label = (s, x, y, w, h, title, sub) => { frame(s, x, y, w, h); k.head(s, title || '', x + 0.12, y + 0.06, w - 0.24, 0.62, { max: 30, min: 13 }); rule(s, x + 0.12, y + 0.72, w - 0.24, 0.02); k.txt(s, sub || '', x + 0.12, y + 0.76, w - 0.24, 0.26, { size: 9, bold: true, valign: 'middle' }); rule(s, x + 0.12, y + 1.04, w - 0.24, 0.1); return { x: x + 0.12, y: y + 1.2, w: w - 0.24, h: h - 1.3 }; };
  const rows = (s, b, n, draw) => { const rh = b.h / n; for (let i = 0; i < n; i++) { const y = b.y + i * rh; draw(i, b.x, y, b.w, rh); if (i < n - 1) rule(s, b.x, y + rh - 0.01, b.w, i === 0 ? 0.04 : 0.012); } };
  const sub = () => [k.M.author, k.M.org].filter(Boolean).join(' \u2022 ');
  const page = (d) => { const s = k.slide(C.bg); k.foot(s, { y: 5.3, size: 7.5, color: C.muted }); return s; };
  const big = (d) => (sTitle) => sTitle;
  const R = {
    async cover(d) { const s = page(d); const b = label(s, 0.5, 0.35, 5.2, 4.8, d.title, sub()); k.txt(s, d.subtitle || '', b.x, b.y, b.w, 1.6, { max: 13 }); rule(s, b.x, b.y + 1.7, b.w, 0.05); [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]].forEach(([a, v], i) => { k.txt(s, a, b.x, b.y + 1.8 + i * 0.42, 2.0, 0.4, { size: 11, bold: true, valign: 'middle' }); k.txt(s, v || '', b.x + 2.0, b.y + 1.8 + i * 0.42, b.w - 2.0, 0.4, { max: 11, align: 'right', valign: 'middle' }); }); if (d.image) { frame(s, 6.1, 0.35, 3.4, 4.8); await k.photo(s, d.image, 6.2, 0.45, 3.2, 4.6, { gray: true }); } },
    async intro(d) { const s = page(d); const b = label(s, 0.4, 0.3, 5.6, 4.85, d.title, sub()); k.txt(s, d.text, b.x, b.y, b.w, b.h, { max: 15, min: 10, ls: 1.3 }); frame(s, 6.3, 0.3, 3.3, 4.85); await k.photo(s, d.image, 6.4, 0.4, 3.1, 4.65, { gray: true }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); const b = label(s, 1.5, 0.3, 7.0, 4.85, d.title, `${d.items.length}`); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i], x, y, w - 0.8, h, { max: 16 }); k.txt(s, `${i + 1}`, x + w - 0.8, y, 0.8, h, { size: 15, bold: true, align: 'right', valign: 'middle' }); }); },
    async cards(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, 2.6, h, { max: 15 }); k.txt(s, d.items[i].t, x + 2.75, y, w - 2.75, h, { max: 12, valign: 'middle' }); }); },
    async process(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, 2.8, h, { max: 15 }); k.txt(s, d.steps[i].t, x + 2.95, y, w - 2.95, h, { max: 12, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); const b = label(s, 1.2, 0.3, 7.6, 4.85, d.title, sub()); const n = d.stats.length + (d.note ? 1 : 0); rows(s, b, n, (i, x, y, w, h) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 9, valign: 'middle' }); k.txt(s, d.stats[i].label, x, y, w - 2.3, h, { max: 14, bold: i === 0, valign: 'middle' }); k.head(s, d.stats[i].value, x + w - 2.2, y, 2.2, h, { max: 34, min: 14, align: 'right' }); }); },
    async compare(d) { const s = page(d); [d.left, d.right].forEach((sd, i) => { const b = label(s, 0.4 + i * 4.7, 0.3, 4.5, 4.85, sd.h, d.title); const { rows: rr, fs } = rowsFit([sd.items], 13, b.w, F.body, 0.1, b.h); let y = b.y; sd.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: fs, valign: 'middle' }); y += rr[j]; if (j < sd.items.length - 1) rule(s, b.x, y - 0.01, b.w, 0.012); }); }); },
    async statement(d) { const s = page(d); const b = label(s, 1.0, 0.3, 8.0, 4.85, d.title, sub()); k.head(s, L.runs(d.text), b.x, b.y, b.w, 2.3, { max: 30, min: 14 }); rule(s, b.x, b.y + 2.4, b.w, 0.06); if (d.caption) k.txt(s, d.caption, b.x, b.y + 2.5, b.w, b.h - 2.5, { max: 11 }); },
    async timeline(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, 1.2, h, { max: 18, min: 10 }); k.head(s, d.items[i].h, x + 1.3, y, 2.2, h, { max: 13 }); k.txt(s, d.items[i].t, x + 3.6, y, w - 3.6, h, { max: 11, valign: 'middle' }); }); },
    async quote(d) { const s = page(d); const b = label(s, 1.0, 0.3, 8.0, 4.85, d.author || '', ''); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h, { max: 26, min: 13, italic: true }); },
    async sources(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, `${d.items.length}`); rows(s, b, d.items.length, (i, x, y, w, h) => k.txt(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover; void big;
  // ---- further ways to draw a type, all off the same packet: a deck's pages must not look alike (L.pages)
  const K = C.ink, W = C.label, G = C.bg, GR = 'BDBDB8', LT = 'E0E0DA';
  const pg = (d, o = {}) => { const s = k.slide(o.bg || G), ink = o.ink || K; if (d.title && !o.noTitle) { k.head(s, d.title, o.x ?? 0.4, o.y ?? 0.18, o.w ?? 8.3, o.h ?? 0.72, { max: o.max ?? 28, min: 14, color: ink }); } k.txt(s, String(k.idx).padStart(2, '0'), o.nx ?? 8.85, 0.2, 0.75, 0.5, { size: 20, bold: true, color: ink, align: 'right' }); k.foot(s, { x: o.fx ?? 0.4, y: 5.32, w: o.fw ?? 9.2, size: 7.5, color: o.foot || C.muted }); return s; };
  const blk = (d, o = {}) => pg(d, { bg: K, ink: W, foot: GR, ...o });
  const heavy = (s, x, y, w, c = K, wt = 0.09) => t.rect(s, x, y, w, wt, c, { name: 'Rule' });
  const thin = (s, x, y, w, c = K) => t.rect(s, x, y, w, 0.014, c, { name: 'Rule' });
  const bars = async (s, x, y, w, h, c = K, vert = false) => { const n = vert ? Math.round(h * 40) : Math.round(w * 40); let a = 5, g = '', px = 0; while (px < n * 4 - 8) { a = (a * 73 + 41) % 1009; const bw = 2 + (a % 4) * 3; g += vert ? `<rect x="0" y="${px}" width="100" height="${bw}" fill="#${c}"/>` : `<rect x="${px}" y="0" width="${bw}" height="100" fill="#${c}"/>`; px += bw + 3 + (a % 3) * 3; } t.img(s, await k.svg(`bars${n}${c}${vert}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${vert ? 100 : n * 4}" height="${vert ? n * 4 : 100}" preserveAspectRatio="none">${g}</svg>`, vert ? 100 : n * 4, vert ? n * 4 : 100), x, y, w, h); };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13.5, min: 10, ls: 1.18, color: K, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: K, ...o });
  const V = {
    image: [
      async (d) => { // the picture across the top of one tall panel, heavy rule, then the words
        const s = pg({}), x = 0.4, wd = 9.2;
        frame(s, x, 0.25, wd, 5.0);
        await k.photo(s, d.image, x + 0.1, 0.35, wd - 0.2, 2.2, { gray: true });
        k.head(s, d.title || '', x + 0.15, 2.58, wd - 0.3 - 0.8, 0.62, { max: 26, min: 14 });
        heavy(s, x + 0.12, 3.2, wd - 0.24);
        bd(s, d.text, x + 0.15, 3.32, wd - 0.3, 1.86, { valign: 'middle' });
      },
      async (d) => { // black page: a round sticker of picture, white words, a barcode in the corner
        const s = blk(d, { w: 4.9, h: 1.05, max: 24 }), dd = 3.6, x = 5.6, y = 0.9;
        t.oval(s, x - 0.1, y - 0.1, dd + 0.2, dd + 0.2, W);
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle', gray: true });
        await bars(s, 7.9, 4.65, 1.7, 0.5, W);
        heavy(s, 0.4, 1.32, 4.9, W);
        bd(s, d.text, 0.4, 1.5, 4.9, 3.7, { color: W, valign: 'middle', ls: 1.28, max: 15 });
      },
      async (d) => { // the picture fills the page, a white label is stuck over it
        const s = k.slide(K), x = 5.05, y = 0.3, wd = 4.6, h = 4.8;
        await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
        frame(s, x, y, wd, h);
        k.head(s, d.title || '', x + 0.15, y + 0.06, wd - 0.3, 1.0, { max: 24, min: 14 });
        heavy(s, x + 0.12, y + 1.08, wd - 0.24);
        bd(s, d.text, x + 0.15, y + 1.22, wd - 0.3, h - 1.3, { valign: 'middle', max: 12.5 });
        t.rect(s, 0, 5.27, 10, 0.355, K, { name: 'Foot band' }); k.foot(s, { x: 0.4, y: 5.33, w: 8.2, size: 7.5, color: W });
        k.txt(s, String(k.idx).padStart(2, '0'), 8.85, 5.29, 0.75, 0.3, { size: 12, bold: true, color: W, align: 'right', valign: 'middle' });
      },
      async (d) => { // the picture poured into the shape of a bottle
        const s = pg(d, { x: 3.65, w: 5.1, h: 1.05, fx: 3.65, fw: 5.95 }), bot = 'M0.36,0 L0.64,0 L0.64,0.13 C0.64,0.22 0.92,0.25 0.92,0.4 L0.92,1 L0.08,1 L0.08,0.4 C0.08,0.25 0.36,0.22 0.36,0.13 Z';
        t.img(s, await L.photo(L.src(d.image), 3.1, 5.05, { mask: { path: bot }, gray: true }), 0.3, 0.3, 3.1, 5.05, { alt: '' });
        heavy(s, 3.65, 1.25, 5.95);
        bd(s, d.text, 3.65, 1.42, 5.95, 3.78, { valign: 'middle', ls: 1.28, max: 15 });
      },
    ],
    cards: [
      async (d) => { // a shelf of small packets: each its own little label
        const s = pg(d), n = d.items.length, gap = 0.16, w = (9.2 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap), y = 1.0, h = 4.2;
          frame(s, x, y, w, h);
          t.img(s, await k.icon(it.icon, K, 2), x + 0.13, y + 0.12, 0.44, 0.44);
          heavy(s, x + 0.1, y + 0.64, w - 0.2);
          hd(s, it.h, x + 0.13, y + 0.76, w - 0.26, 0.62, { valign: 'top', max: 15 });
          thin(s, x + 0.1, y + 1.4, w - 0.2);
          bd(s, it.t, x + 0.13, y + 1.46, w - 0.26, h - 1.54, { max: 13 });
        }
      },
      async (d) => { // black page: cells under thick white rules, no frames at all
        const s = blk(d), n = d.items.length, Wd = 4.45, H = 1.98, pos = n === 4 ? [[0.4, 1.05, Wd], [5.15, 1.05, Wd], [0.4, 3.15, Wd], [5.15, 3.15, Wd]] : [[0.4, 1.05, Wd], [5.15, 1.05, Wd], [0.4, 3.15, 9.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i];
          heavy(s, x, y, w, W, 0.11);
          t.img(s, await k.icon(it.icon, W, 2), x, y + 0.2, 0.4, 0.4);
          hd(s, it.h, x + 0.52, y + 0.17, w - 0.55, 0.46, { color: W, max: 16 });
          bd(s, it.t, x, y + 0.68, w, H - 0.74, { color: W, max: 13.5 });
        }
      },
      async (d) => { // round black stickers laid out of line, words beside each
        const s = pg(d), n = d.items.length, dd = 0.96, pos = n === 4 ? [[0.4, 1.05], [5.1, 1.5], [0.4, 3.05], [5.1, 3.5]] : [[0.4, 1.05], [5.1, 1.75], [0.4, 3.35]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i], w = 3.45;
          t.oval(s, x, y + 0.04, dd, dd, K);
          t.img(s, await k.icon(it.icon, W, 1.75), x + 0.26, y + 0.3, 0.44, 0.44);
          hd(s, it.h, x + dd + 0.13, y, w, 0.4, { max: 15 });
          bd(s, it.t, x + dd + 0.13, y + 0.42, w, 1.2, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // coupons torn along a dashed line: a black stub with the icon, the words on the slip
        const s = pg(d), n = d.items.length, rh = 4.15 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.0 + i * rh, x = 0.4 + (i % 2) * 0.3, w = 8.9, h = rh - 0.12;
          t.rect(s, x, y, 1.0, h, K, { name: 'Stub' });
          t.img(s, await k.icon(it.icon, W, 2), x + 0.31, y + h / 2 - 0.19, 0.38, 0.38);
          t.rect(s, x + 1.0, y, w - 1.0, h, W, { line: { color: K, width: 1, dashType: 'dash' }, name: 'Slip' });
          hd(s, it.h, x + 1.12, y + 0.04, 2.45, h - 0.08);
          bd(s, it.t, x + 3.65, y + 0.04, w - 3.75, h - 0.08, { valign: 'middle', max: 13, ls: 1.1 });
        }
      },
    ],
    process: [
      async (d) => { // solid blocks climb to the right, black at the top
        const s = pg(d, { w: 6.4, h: 0.68, max: 24 }), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.36 : 0.5, y0 = 1.0 + (n - 1) * rise, fills = n === 4 ? [W, LT, GR, K] : [W, GR, K];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise, f = fills[i], ink = f === K ? W : K;
          t.rect(s, x, y, w, 5.26 - y, f, { line: { color: K, width: 1.5 }, name: 'Block' });
          k.txt(s, String(i + 1), x + 0.18, y + 0.05, 0.8, 0.6, { size: 32, bold: true, font: F.head, color: ink, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.18, y + 0.68, w - 0.34, 0.54, { color: ink, max: 14, valign: 'top' });
          bd(s, st.t, x + 0.18, y + 1.24, w - 0.34, 5.22 - y - 1.24, { color: ink, max: 13, ls: 1.12 });
        }
      },
      async (d) => { // one thick rule down the middle, marks along it, steps either side by turns
        const s = pg(d), n = d.steps.length, rh = 4.15 / n, w = 4.1;
        t.rect(s, 4.94, 0.98, 0.12, 4.22, K, { name: 'Spine' });
        for (const [i, st] of d.steps.entries()) {
          const y = 1.02 + i * rh, right = i % 2 === 1, x = right ? 5.45 : 0.45, a = right ? 'left' : 'right', c = y + rh / 2, dd = Math.min(0.5, rh - 0.14);
          t.oval(s, 5 - dd / 2, c - dd / 2, dd, dd, K, { line: { color: G, width: 3 } });
          k.txt(s, String(i + 1), 5 - dd / 2, c - dd / 2, dd, dd, { size: 14, bold: true, color: W, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.34, { align: a, max: 14 });
          bd(s, st.t, x, y + 0.37, w, rh - 0.42, { align: a, max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // black page: enormous numerals, each column under its own white rule
        const s = blk(d), n = d.steps.length, w = 9.2 / n;
        heavy(s, 0.4, 1.02, 9.2, W, 0.12);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          k.txt(s, String(i + 1), x, 1.16, w - 0.2, 1.2, { size: 72, bold: true, font: F.head, color: W, valign: 'middle', ls: 1 });
          thin(s, x, 2.38, w - 0.2, W);
          hd(s, st.h, x, 2.42, w - 0.2, 0.58, { color: W, valign: 'middle' });
          bd(s, st.t, x, 3.02, w - 0.2, 2.18, { color: W, max: 13 });
        }
      },
      async (d) => { // a big barcode stands down the right side, the steps read as lines with huge digits
        const s = pg(d, { w: 7.2, nx: 7.0 , fw: 7.7 }), n = d.steps.length, rh = 4.15 / n;
        await bars(s, 8.2, 0, 1.8, 5.625, K, true);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.0 + i * rh;
          heavy(s, 0.4, y, 7.5, K, i ? 0.03 : 0.09);
          k.txt(s, String(i + 1), 0.4, y + 0.05, 0.95, rh - 0.1, { size: 44, bold: true, font: F.head, color: K, valign: 'middle', align: 'center', ls: 1 });
          hd(s, st.h, 1.45, y + 0.07, 6.45, 0.32, { max: 14 });
          bd(s, st.t, 1.45, y + 0.4, 6.45, rh - 0.46, { max: 12.5, ls: 1.08 });
        }
      },
    ],
    stats: [
      async (d) => { // the top line of a facts panel: one enormous figure, two lesser ones under it
        const s = pg({}), [a, ...rest] = d.stats, x = 0.4, y = 0.25, w = 5.7, h = 4.98;
        frame(s, x, y, w, h);
        k.head(s, d.title || '', x + 0.14, y + 0.06, w - 0.28, 0.75, { max: 22, min: 13 });
        heavy(s, x + 0.12, y + 0.84, w - 0.24, K, 0.14);
        hd(s, a.value, x + 0.14, y + 1.0, w - 0.28, 1.15, { max: 66, min: 30 });
        bd(s, a.label, x + 0.14, y + 2.15, w - 0.28, 0.5, { bold: true, max: 13 });
        rest.forEach((v, i) => { const yy = y + 2.72 + i * 1.08; heavy(s, x + 0.12, yy, w - 0.24, K, 0.05); hd(s, v.value, x + w - 2.25, yy + 0.08, 2.1, 0.95, { max: 32, min: 16, align: 'right' }); bd(s, v.label, x + 0.14, yy + 0.08, w - 2.5, 0.95, { valign: 'middle', max: 12.5 }); });
        if (d.note) bd(s, d.note, 6.4, 0.9, 3.2, 3.3, { valign: 'middle', italic: true, max: 14 });
        await bars(s, 6.4, 4.35, 3.2, 0.85);
      },
      async (d) => { // three black price stickers, words beneath, the note on a strip of tape
        const s = pg(d), w = 9.2 / 3, dd = 2.0;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          t.oval(s, cx - dd / 2, 0.98, dd, dd, K);
          hd(s, v.value, cx - dd / 2 + 0.14, 1.38, dd - 0.28, 1.2, { max: 34, min: 15, color: W, align: 'center' });
          bd(s, v.label, x + 0.12, 3.02, w - 0.24, 0.72, { align: 'center', max: 12.5, ls: 1.08 });
        }
        t.rect(s, 0, 3.82, 10, 1.42, W, { name: 'Tape' }); heavy(s, 0, 3.82, 10, K, 0.05);
        if (d.note) bd(s, d.note, 0.6, 3.92, 8.8, 1.26, { valign: 'middle', italic: true, align: 'center', max: 13.5 });
      },
      async (d) => { // three panels side by side, black, white and grey, a figure on each
        const s = pg(d), w = 10 / 3, fills = [K, W, GR];
        for (const [i, v] of d.stats.entries()) {
          const x = i * w, ink = fills[i] === K ? W : K;
          t.rect(s, x, 0.98, w, 3.05, fills[i], { name: 'Panel' });
          hd(s, v.value, x + 0.25, 1.15, w - 0.5, 1.3, { color: ink, max: 42, min: 20 });
          heavy(s, x + 0.25, 2.48, w - 0.5, ink, 0.05);
          bd(s, v.label, x + 0.25, 2.6, w - 0.5, 1.3, { color: ink, max: 14 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.1, 9.2, 1.14, { valign: 'middle', italic: true, max: 13.5 });
      },
    ],
    compare: [
      async (d) => { // the page is cut in half, black against white, the sides read away from the cut
        const s = k.slide(W);
        t.rect(s, 0, 0, 5, 5.625, K, { name: 'Half' });
        k.head(s, d.title || '', 0.4, 0.18, 4.3, 0.92, { max: 20, min: 12, color: W });
        k.txt(s, String(k.idx).padStart(2, '0'), 8.85, 0.2, 0.75, 0.5, { size: 20, bold: true, color: K, align: 'right' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', ink = i ? K : W, rh = 3.2 / sd.items.length;
          hd(s, sd.h, x, 1.12, w, 0.58, { color: ink, align: a, max: 20 });
          heavy(s, x, 1.72, w, ink);
          sd.items.forEach((it, j) => bd(s, it, x, 1.88 + j * rh, w, rh - 0.05, { color: ink, align: a, valign: 'middle', max: 13.5 }));
        }
        k.foot(s, { x: 5.35, y: 5.32, w: 4.25, size: 7, color: C.muted });
      },
      async (d) => { // one panel, two bands: the first headed in black, the second on a heavy rule
        const s = pg({}), x = 0.4, w = 9.2;
        frame(s, x, 0.25, w, 4.98);
        k.head(s, d.title || '', x + 0.14, 0.3, w - 1.1, 0.62, { max: 24, min: 13 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 0.98 + i * 2.1, h = 2.05, m = sd.items.length, rows = Math.ceil(m / 2), rh = (h - 0.56) / rows, rw = (w - 0.45) / 2;
          t.rect(s, x + 0.1, y, w - 0.2, 0.46, K, { name: 'Head' });
          hd(s, sd.h, x + 0.22, y, w - 0.44, 0.46, { color: W, max: 16 });
          sd.items.forEach((it, j) => { const xx = x + 0.15 + (j % 2) * (rw + 0.15), yy = y + 0.5 + Math.floor(j / 2) * rh; bd(s, it, xx, yy, rw, rh, { valign: 'middle', max: 12.5, ls: 1.08 }); if (j >= 2) thin(s, xx, yy, rw, GR); });
        }
      },
    ],
    statement: [
      async (d) => { // black page: the thought in huge white type, a heavy rule, the small print
        const s = blk(d, { max: 18, h: 0.55 });
        k.head(s, L.runs(d.text), 0.4, 0.85, 9.2, 2.72, { max: 38, min: 18, color: W });
        heavy(s, 0.4, 3.62, 9.2, W, 0.12);
        if (d.caption) bd(s, d.caption, 0.4, 3.82, 9.2, 1.4, { color: W, max: 13.5 });
      },
      async (d) => { // no panel: bare type on the paper, the small print and a barcode side by side below
        const s = pg(d, { max: 18, h: 0.55 });
        heavy(s, 0.4, 0.82, 9.2, K, 0.16);
        k.head(s, L.runs(d.text), 0.4, 1.02, 9.2, 2.55, { max: 34, min: 17 });
        thin(s, 0.4, 3.6, 9.2);
        if (d.caption) bd(s, d.caption, 0.4, 3.68, 6.7, 1.55, { max: 13 });
        await bars(s, 7.4, 3.78, 2.2, 1.3);
      },
    ],
    timeline: [
      async (d) => { // a printed table in one frame: four columns, the year heavy on top of each
        const s = pg(d, { h: 0.68 }), x = 0.4, y = 0.95, wd = 9.2, h = 4.28, w = wd / 4;
        frame(s, x, y, wd, h);
        for (const [i, it] of d.items.entries()) {
          const cx = x + i * w;
          if (i) t.line(s, cx, y, 0, h, K, 1);
          t.rect(s, cx, y, w, 0.72, K, { line: { color: W, width: 0.5 }, name: 'Head' });
          hd(s, it.year, cx + 0.1, y, w - 0.2, 0.72, { color: W, max: 20, min: 11, align: 'center' });
          hd(s, it.h, cx + 0.12, y + 0.8, w - 0.24, 0.56, { max: 14, valign: 'top' });
          bd(s, it.t, cx + 0.12, y + 1.38, w - 0.24, h - 1.46, { max: 13 });
        }
      },
      async (d) => { // black page: years in big white type, a heavy rule over each line
        const s = blk(d, { h: 0.68 }), rh = 4.2 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 0.98 + i * rh;
          heavy(s, 0.4, y, 9.2, W, i ? 0.03 : 0.1);
          hd(s, it.year, 0.4, y + 0.08, 2.85, rh - 0.14, { color: W, max: 28, min: 13 });
          hd(s, it.h, 3.35, y + 0.08, 2.0, rh - 0.14, { color: W, max: 14 });
          bd(s, it.t, 5.45, y + 0.08, 4.15, rh - 0.14, { color: W, valign: 'middle', max: 12, ls: 1.08 });
        }
      },
      async (d) => { // one thick line through the middle of the page, slips above and below it by turns
        const s = pg(d, { h: 0.68 }), ax = 3.13, xs = [0.4, 2.5, 4.65, 6.55], w = 3.05;
        heavy(s, 0, ax - 0.05, 10, K, 0.1);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, h = 1.92, y = up ? 0.98 : ax + 0.22;
          t.rect(s, x, up ? y + h : ax, 0.05, 0.22, K, { name: 'Stem' });
          t.rect(s, x, y, w, h, W, { line: { color: K, width: 1.25 }, name: 'Slip' });
          hd(s, `${it.year}`, x + 0.1, y + 0.03, w - 0.2, 0.36, { max: 16, min: 11 });
          hd(s, it.h, x + 0.1, y + 0.38, w - 0.2, 0.3, { max: 12.5 });
          thin(s, x + 0.1, y + 0.7, w - 0.2);
          bd(s, it.t, x + 0.1, y + 0.75, w - 0.2, h - 0.8, { max: 12.5, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old facts rows were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Tarkib', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '222222', lt2: C.bg, accent1: '000000', accent2: '555555', accent3: '888888', accent4: 'BBBBBB', accent5: C.muted, accent6: 'DDDDDD', hlink: '000000', folHlink: C.muted } });
}
module.exports = { id: 142, slug: 'tarkib', name: 'Tarkib', category: 'minimalist', photos: true, build, style: { tone: "tarkib yorlig'i kabi: band nomi va qiymati, quruq va aniq; ortiqcha so'zsiz", limits: { title: 45 }, prefer: 'data' } };
