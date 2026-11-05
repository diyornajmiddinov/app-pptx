/**
 * 113 Chorak — a big QUARTER CIRCLE anchored in the top-left corner holds the number and title; all content
 * is pushed to the right-hand column. On photo slides the quarter itself becomes the photo.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { q: 'E85D04', q2: 'FAA307', ink: '1C1917', muted: '57534E', bg: 'FFFBF5', rule: 'E7E0D6' };
const F = { head: 'Arial', body: 'Calibri' };
const X = 3.45, W = 6.05, Y = 0.45, Hc = 4.6;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const quarter = async (s, r, fill) => t.img(s, await k.svg(`q${r}${fill}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${r * 100}" height="${r * 100}"><path d="M0,0 L${r * 100},0 A${r * 100},${r * 100} 0 0 1 0,${r * 100} Z" fill="#${fill}"/></svg>`, r * 100, r * 100), 0, 0, r, r);
  const QM = { path: 'M0,0 L1,0 A1,1 0 0 1 0,1 Z' };
  const page = async (d, photo) => { const s = k.slide(C.bg);
    if (photo) await k.photo(s, photo, 0, 0, 3.2, 3.2, { mask: QM }); else await quarter(s, 3.2, C.q);
    t.oval(s, 8.9, 4.75, 1.6, 1.6, null, { line: { color: C.q2, width: 2 } });
    if (!photo) { k.txt(s, String(k.idx).padStart(2, '0'), 0.3, 0.25, 1.2, 0.6, { size: 26, bold: true, font: F.head, color: '370617' }); k.head(s, d.title || '', 0.3, 0.85, 2.1, 1.35, { max: 20, min: 11, color: 'FFFFFF', valign: 'top' }); }
    else { k.head(s, d.title || '', X, Y, W, 0.6, { max: 22, min: 13, color: C.q }); }
    k.foot(s, { x: X, w: W - 0.6, y: 5.27 }); return s; };
  const list = (s, n, draw, y0 = Y, h = Hc) => { const rh = h / n; for (let i = 0; i < n; i++) { const y = y0 + i * rh; draw(i, y, rh); if (i < n - 1) t.line(s, X, y + rh, W, 0, C.rule, 0.75); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, 0, 0, 5.4, 5.4, { mask: QM }); else await quarter(s, 5.4, C.q);
      t.oval(s, 8.6, 4.4, 2.2, 2.2, null, { line: { color: C.q2, width: 2 } });
      k.txt(s, k.org3, 5.4, 0.6, 4.1, 0.6, { max: 12, bold: true, color: C.q });
      k.head(s, d.title, 5.4, 1.25, 4.1, 2.3, { max: 34, min: 16, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 5.4, 3.6, 4.0, 0.75, { max: 12, color: C.muted });
      k.txt(s, k.M.author || '', 5.4, 4.4, 3.3, 0.45, { size: 15, bold: true, color: C.q }); k.foot(s, { x: 5.4, w: 3.2, y: 5.15, size: 7.5 }); },
    async intro(d) { const s = await page(d, d.image); k.txt(s, d.text, X, Y + 0.75, W, Hc - 0.75, { max: 16, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = await page(d, d.image); k.txt(s, d.text, X, Y + 0.75, W, Hc - 0.75, { max: 16, min: 10, ls: 1.35, valign: 'middle' }); },
    async agenda(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { k.txt(s, String(i + 1).padStart(2, '0'), X, y, 0.8, rh, { size: 20, bold: true, font: F.head, color: C.q, valign: 'middle' }); k.head(s, d.items[i], X + 0.85, y, W - 0.85, rh, { max: 18 }); }); },
    async cards(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.h, X, y + 0.04, 2.0, rh - 0.08, { max: 15, color: C.q }); k.txt(s, it.t, X + 2.15, y + 0.04, W - 2.15, rh - 0.08, { max: 13, valign: 'middle' }); }); },
    async process(d) { const s = await page(d); list(s, d.steps.length, (i, y, rh) => { const st = d.steps[i]; t.oval(s, X, y + rh / 2 - 0.22, 0.44, 0.44, i === d.steps.length - 1 ? C.q : C.q2); k.txt(s, String(i + 1), X, y + rh / 2 - 0.22, 0.44, 0.44, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, st.h, X + 0.6, y + 0.04, 1.9, rh - 0.08, { max: 15 }); k.txt(s, st.t, X + 2.6, y + 0.04, W - 2.6, rh - 0.08, { max: 13, color: C.muted, valign: 'middle' }); }); },
    async stats(d) { const s = await page(d); const n = d.stats.length + (d.note ? 1 : 0); list(s, n, (i, y, rh) => { if (i === d.stats.length) return k.txt(s, d.note, X, y, W, rh, { max: 11, italic: true, color: C.muted, valign: 'middle' }); const v = d.stats[i]; k.head(s, v.value, X, y, 2.4, rh, { max: 44, min: 18, color: i === 0 ? C.q : C.ink }); k.txt(s, v.label, X + 2.55, y, W - 2.55, rh, { max: 14, valign: 'middle' }); }); },
    async compare(d) { const s = await page(d), w = (W - 0.3) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.25, F.body, 0.12, Hc - 0.75);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.3); k.head(s, sd.h, x, Y, w, 0.55, { max: 17, color: i ? C.ink : C.q }); t.line(s, x, Y + 0.6, w, 0, i ? C.ink : C.q, 1.5); let y = Y + 0.72; sd.items.forEach((it, j) => { k.txt(s, '\u25E3', x, y, 0.25, 0.3, { size: 10, color: C.q2 }); k.txt(s, it, x + 0.25, y, w - 0.25, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); k.head(s, L.runs(d.text), X, Y, W, 2.8, { max: 36, min: 16, valign: 'bottom' }); t.rect(s, X, Y + 2.95, 0.9, 0.08, C.q, { name: 'Accent' }); if (d.caption) k.txt(s, d.caption, X, Y + 3.15, W, Hc - 3.2, { max: 13, color: C.muted }); },
    async timeline(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.year, X, y, 1.3, rh, { max: 20, min: 11, color: C.q }); k.head(s, it.h, X + 1.4, y + 0.04, 1.9, rh - 0.08, { max: 14 }); k.txt(s, it.t, X + 3.4, y + 0.04, W - 3.4, rh - 0.08, { max: 12, color: C.muted, valign: 'middle' }); }); },
    async quote(d) { const s = await page({ title: '\u201C\u201D' }); k.head(s, d.text, X, Y + 0.3, W, 3.3, { max: 30, min: 15, italic: true, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X, Y + 3.7, W, 0.45, { size: 14, bold: true, color: C.q }); },
    async sources(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.q } }, { text: d.items[i] }], X, y, W, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all cut from the same quarter circle: a deck's pages must not look alike (L.pages)
  const DK = '370617', RED = '9D0208', CREAM = 'FFE8CC', SVG = (b) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562">${b}</svg>`;
  const P4 = { tl: (r) => `M0,0 L${r},0 A${r},${r} 0 0 1 0,${r} Z`, tr: (r) => `M1000,0 L${1000 - r},0 A${r},${r} 0 0 0 1000,${r} Z`, bl: (r) => `M0,562 L${r},562 A${r},${r} 0 0 0 0,${562 - r} Z`, br: (r) => `M1000,562 L${1000 - r},562 A${r},${r} 0 0 1 1000,${562 - r} Z` };
  const big = async (s, at, r, fill) => t.img(s, await k.svg(`big${at}${r}${fill}`, SVG(`<path d="${P4[at](r * 100)}" fill="#${fill}"/>`), 1000, 562), 0, 0, 10, 5.625); // a quarter of any size in any corner, kept on the slide
  const tile = async (s, x, y, r, at, fill) => { const R0 = Math.round(r * 100), d = { tl: `M0,0 L${R0},0 A${R0},${R0} 0 0 1 0,${R0} Z`, tr: `M${R0},0 L0,0 A${R0},${R0} 0 0 0 ${R0},${R0} Z`, bl: `M0,${R0} L${R0},${R0} A${R0},${R0} 0 0 0 0,0 Z`, br: `M${R0},${R0} L0,${R0} A${R0},${R0} 0 0 1 ${R0},0 Z` }[at]; t.img(s, await k.svg(`t${R0}${at}${fill}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${R0}" height="${R0}"><path d="${d}" fill="#${fill}"/></svg>`, R0, R0), x, y, r, r); };
  const no = (s, x, y, color = C.q, size = 22, w = 0.9) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, w, 0.5, { size, bold: true, font: F.head, color, valign: 'middle' });
  // the slim head: a small quarter with the number, the title beside it
  const top = async (s, d, o = {}) => { await tile(s, 0, 0, 0.92, 'tl', o.fill || C.q); k.txt(s, String(k.idx).padStart(2, '0'), 0.1, 0.1, 0.6, 0.4, { size: 15, bold: true, font: F.head, color: DK, valign: 'middle' }); k.head(s, d.title || '', 1.05, 0.14, o.w || 8.45, 0.72, { max: 24, min: 13, color: o.color || C.ink }); };
  const lit = (s, c, o = {}) => k.foot(s, { x: o.x ?? 0.6, w: o.w ?? 8.8, y: 5.27, color: c });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const V = {
    image: [
      async (d) => { // the picture is a great quarter leaning into the far corner, words in the open cream
        const s = k.slide(C.bg); await k.photo(s, d.image, 5.55, 1.175, 4.45, 4.45, { mask: { path: 'M1,1 L0,1 A1,1 0 0 1 1,0 Z' } });
        no(s, 0.5, 0.3); k.head(s, d.title || '', 0.5, 0.82, 5.2, 0.95, { max: 26, min: 14, valign: 'top' }); t.rect(s, 0.5, 1.84, 0.9, 0.07, C.q, { name: 'Accent' });
        bd(s, d.text, 0.5, 2.0, 5.0, 3.15, { max: 14, color: C.ink, ls: 1.25 }); k.foot(s, { x: 0.5, w: 4.8, y: 5.27 }); },
      async (d) => { // picture over the whole slide, a quarter of deep maroon carries the words
        const s = k.slide(DK); await k.photo(s, d.image, 0, 0, 10, 5.625); await big(s, 'tl', 6.05, DK);
        no(s, 0.35, 0.2, C.q2); k.head(s, d.title || '', 0.35, 0.68, 4.75, 0.9, { max: 21, min: 13, color: 'FFFFFF', valign: 'top' }); bd(s, d.text, 0.35, 1.62, 4.05, 2.85, { max: 12, color: CREAM, ls: 1.18 });
        t.rect(s, 6.1, 5.2, 3.9, 0.425, DK, { name: 'Foot band' }); k.foot(s, { x: 6.2, w: 3.7, y: 5.3, color: CREAM, size: 7.5 }); },
      async (d) => { // a round picture with one quarter cut away; the cut holds the number
        const s = k.slide(C.bg), D = 4.5, x = 5.2, y = 0.55; await k.photo(s, d.image, x, y, D, D, { mask: { path: 'M0.5,0.5 L0.5,0 A0.5,0.5 0 1 1 0,0.5 Z' } });
        await tile(s, x + 0.03, y + 0.03, D / 2 - 0.09, 'br', C.q); k.txt(s, String(k.idx).padStart(2, '0'), x + 0.75, y + 1.15, 1.3, 0.9, { size: 34, bold: true, font: F.head, color: DK, align: 'right', valign: 'middle' });
        k.head(s, d.title || '', 0.5, 0.4, 4.5, 1.05, { max: 25, min: 14, valign: 'top' }); bd(s, d.text, 0.5, 1.5, 4.45, 3.65, { max: 14, color: C.ink, ls: 1.25, valign: 'middle' }); k.foot(s, { x: 0.5, w: 4.5, y: 5.27 }); },
      async (d) => { // after dark: the picture sits as a quarter in the low left corner of a maroon page
        const s = k.slide(DK); await k.photo(s, d.image, 0, 2.125, 3.5, 3.5, { mask: { path: 'M0,1 L1,1 A1,1 0 0 0 0,0 Z' } }); await tile(s, 9.1, 0, 0.9, 'tr', C.q);
        no(s, 0.5, 0.35, C.q2, 30, 1.4); k.head(s, d.title || '', 0.5, 0.95, 3.1, 1.1, { max: 19, min: 13, color: 'FFFFFF', valign: 'top' });
        bd(s, d.text, 3.85, 0.55, 5.35, 4.55, { max: 14, color: CREAM, ls: 1.3, valign: 'middle' }); k.foot(s, { x: 3.85, w: 5.65, y: 5.27, color: C.q2 }); },
    ],
    cards: [
      async (d) => { // four cells round the centre of the page, each with a quarter turned towards it
        const s = k.slide(C.bg), n = d.items.length, cw = 4.65, ch = n === 3 ? 2.42 : 2.08, y0 = n === 3 ? 0.28 : 1.0, P = [[0.3, y0], [5.05, y0], [0.3, y0 + ch + 0.08], [5.05, y0 + ch + 0.08]], at = ['br', 'bl', 'tr', 'tl'];
        if (n === 3) { await tile(s, 0.3, 0.28, 1.1, 'tl', C.q); k.txt(s, String(k.idx).padStart(2, '0'), 0.4, 0.34, 0.8, 0.5, { size: 18, bold: true, font: F.head, color: DK }); k.head(s, d.title || '', 1.5, 0.42, 3.4, 1.9, { max: 24, min: 14, valign: 'top' }); } else await top(s, d);
        const cells = n === 3 ? [P[1], P[2], P[3]] : P, ats = n === 3 ? at.slice(1) : at;
        for (const [i, it] of d.items.entries()) { const [x, y] = cells[i], a = ats[i], r = 0.72, qx = a === 'br' || a === 'tr' ? x + cw - r : x, qy = a === 'br' || a === 'bl' ? y + ch - r : y;
          t.rect(s, x, y, cw, ch, 'FFFFFF', { line: { color: C.rule, width: 0.75 }, name: 'Cell' }); await tile(s, qx, qy, r, a, i % 2 ? C.q2 : C.q); t.img(s, await k.icon(it.icon, DK, 2), qx + (a === 'br' || a === 'tr' ? 0.34 : 0.08), qy + (a === 'br' || a === 'bl' ? 0.34 : 0.08), 0.3, 0.3);
          const tx = x + 0.18, tw = cw - 0.36, inset = a === 'tl' ? 0.82 : 0;
          hd(s, it.h, tx + inset, y + 0.1, tw - inset - (a === 'tr' ? 0.72 : 0), 0.5, { max: 15, color: RED }); const low = a === 'bl' ? 0.62 : 0; bd(s, it.t, x + 0.18 + low, y + 0.72 - (a === 'br' || a === 'bl' ? 0.1 : 0), cw - 0.36 - low - (a === 'br' ? 0.62 : 0), ch - 0.82, { max: 13, color: C.ink }); }
        k.foot(s, { y: 5.32, x: 0.3, w: 9.4, size: 7.5 }); },
      async (d) => { // the first idea fills the big quarter, the others wait in the column beside it
        const s = k.slide(C.bg), [a, ...rest] = d.items, n = rest.length; await big(s, 'tl', 5.55, C.q);
        t.img(s, await k.icon(a.icon, DK, 2), 0.35, 0.3, 0.46, 0.46); hd(s, a.h, 0.95, 0.25, 2.9, 0.56, { max: 18, color: DK }); k.txt(s, a.t, 0.35, 0.95, 3.45, 2.5, { max: 14, min: 10, color: DK, bold: true, ls: 1.2 });
        k.head(s, d.title || '', 5.75, 0.25, 3.0, 0.95, { max: 20, min: 13, align: 'left' }); no(s, 8.8, 0.3, C.q, 20, 0.8);
        const y0 = 1.3, rh = 3.85 / n; for (const [i, it] of rest.entries()) { const y = y0 + i * rh; t.img(s, await k.icon(it.icon, C.q, 2), 5.75, y + 0.06, 0.34, 0.34); hd(s, it.h, 6.2, y + 0.02, 3.3, 0.42, { color: C.ink }); bd(s, it.t, 6.2, y + 0.46, 3.3, rh - 0.52); if (i) t.line(s, 5.75, y - 0.02, 3.75, 0, C.rule, 0.75); }
        k.foot(s, { x: 5.75, w: 3.75, y: 5.27, size: 7 }); },
      async (d) => { // the ideas ride one great arc swung from the corner, each hanging from the curve
        const s = k.slide(C.bg), n = d.items.length, RR = 5.05; await quarter(s, 3.05, C.q);
        t.img(s, await k.svg('arc505', SVG(`<path d="M${RR * 100},0 A${RR * 100},${RR * 100} 0 0 1 0,${RR * 100}" fill="none" stroke="#${C.q2}" stroke-width="2.5"/>`), 1000, 562), 0, 0, 10, 5.625);
        k.txt(s, String(k.idx).padStart(2, '0'), 0.25, 0.2, 1.2, 0.5, { size: 22, bold: true, font: F.head, color: DK }); k.head(s, d.title || '', 0.25, 0.72, 2.1, 1.3, { max: 17, min: 11, color: DK, valign: 'top' });
        const rh = 4.9 / n; for (const [i, it] of d.items.entries()) { const y = 0.14 + i * rh, cy = y + 0.26, cx = Math.sqrt(RR * RR - cy * cy), x = cx + 0.42;
          t.oval(s, cx - 0.22, cy - 0.22, 0.44, 0.44, C.q, { line: { color: C.bg, width: 2 } }); t.img(s, await k.icon(it.icon, DK, 2), cx - 0.13, cy - 0.13, 0.26, 0.26);
          hd(s, it.h, x, y, 9.55 - x, 0.4, { color: C.ink, max: 14 }); bd(s, it.t, x, y + 0.42, 9.55 - x, rh - 0.5, { max: 12.5 }); }
        k.foot(s, { x: 5.2, w: 3.7, y: 5.32, size: 7 }); },
      async (d) => { // dark page: uneven tiles step down it, their corners rounded by a quarter
        const s = k.slide(DK), n = d.items.length, w = (9.3 - 0.15 * (n - 1)) / n, drop = n === 3 ? [0, 0.32, 0.64] : [0, 0.28, 0.56, 0.28]; await big(s, 'br', 2.2, RED);
        no(s, 0.35, 0.25, C.q2, 22); k.head(s, d.title || '', 1.25, 0.2, 8.35, 0.62, { max: 24, min: 13, color: 'FFFFFF' });
        for (const [i, it] of d.items.entries()) { const x = 0.35 + i * (w + 0.15), y = 1.0 + drop[i], h = 3.55; t.rect(s, x, y, w, h, 'FFF6EA', { name: 'Tile' }); await tile(s, x + w - 0.8, y, 0.8, 'tr', i % 2 ? C.q2 : C.q); t.img(s, await k.icon(it.icon, DK, 2), x + w - 0.38, y + 0.08, 0.3, 0.3); hd(s, it.h, x + 0.14, y + 0.12, w - 0.95, 0.72, { color: RED, valign: 'top', max: 14 }); bd(s, it.t, x + 0.14, y + 0.9, w - 0.28, h - 1.0, { color: C.ink, max: 12.5 }); }
        k.foot(s, { x: 0.35, w: 9.3, y: 5.3, size: 7, color: CREAM }); },
    ],
    process: [
      async (d) => { // a disc of quarters at the centre of the page, the steps round it clockwise
        const s = k.slide(C.bg), n = d.steps.length, cx = 5, cy = 3.05, r = 0.95, deg = 360 / n; await top(s, d);
        let g = ''; for (let i = 0; i < n; i++) { const a0 = (i * deg - 90 - (n === 4 ? 45 : 0)) * Math.PI / 180, a1 = ((i + 1) * deg - 90 - (n === 4 ? 45 : 0)) * Math.PI / 180; g += `<path d="M100,100 L${100 + 96 * Math.cos(a0)},${100 + 96 * Math.sin(a0)} A96,96 0 0 1 ${100 + 96 * Math.cos(a1)},${100 + 96 * Math.sin(a1)} Z" fill="#${[C.q, C.q2, RED, DK][i]}" stroke="#${C.bg}" stroke-width="3"/>`; }
        t.img(s, await k.svg(`pie${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">${g}</svg>`, 200, 200), cx - r, cy - r, 2 * r, 2 * r);
        const BX = n === 4 ? [[0.45, 1.05, 3.3, 'right'], [6.25, 1.05, 3.3, 'left'], [6.25, 3.3, 3.3, 'left'], [0.45, 3.3, 3.3, 'right']] : [[6.25, 1.05, 3.3, 'left'], [2.6, 4.08, 4.8, 'center'], [0.45, 1.05, 3.3, 'right']];
        const NM = n === 3 ? [[0.45, -0.25], [0, 0.5], [-0.45, -0.25]] : [[-0.45, -0.45], [0.45, -0.45], [0.45, 0.45], [-0.45, 0.45]];
        d.steps.forEach((st, i) => { const [x, y, w, al] = BX[i], [mx, my] = NM[i]; k.txt(s, String(i + 1), cx + mx - 0.2, cy + my - 0.2, 0.4, 0.4, { size: 15, bold: true, font: F.head, color: i < 2 ? DK : 'FFFFFF', align: 'center', valign: 'middle', ls: 1 }); hd(s, `${i + 1}. ${st.h}`, x, y, w, 0.42, { align: al, color: RED }); bd(s, st.t, x, y + 0.44, w, n === 3 && i === 1 ? 0.72 : 1.3, { align: al, max: 12.5, ls: 1.15 }); });
        k.foot(s, { x: 0.45, w: 9.1, y: 5.32, size: 7, align: 'center' }); },
      async (d) => { // quarter-nosed steps going down the page, one under and past the last
        const s = k.slide(C.bg), n = d.steps.length, h = (4.15 - 0.08 * (n - 1)) / n, dx = n === 4 ? 0.62 : 0.85; await top(s, d);
        for (const [i, st] of d.steps.entries()) { const x = 0.4 + i * dx, y = 1.02 + i * (h + 0.08), w = 9.55 - x - (n - 1 - i) * dx * 0.55; await tile(s, x, y, h, 'br', i === n - 1 ? C.q : C.q2); k.txt(s, String(i + 1), x + h * 0.22, y + h * 0.2, h * 0.72, h * 0.72, { size: 22, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle', ls: 1 }); hd(s, st.h, x + h + 0.14, y, w - h - 0.14, 0.36, { color: C.ink, max: 14 }); bd(s, st.t, x + h + 0.14, y + 0.36, w - h - 0.14, h - 0.36, { max: 12, ls: 1.12 }); }
        k.foot(s, { x: 0.4, w: 3.8, y: 5.32, size: 7 }); },
      async (d) => { // a row of scallops, every quarter pushing into the next; the words hang below them
        const s = k.slide(C.bg), n = d.steps.length, w = 9.4 / n, r = Math.min(w, 1.5); await top(s, d);
        for (const [i, st] of d.steps.entries()) { const x = 0.3 + i * w, c = [C.q, C.q2, CREAM, C.q][i]; t.rect(s, x, 1.02, w, r, CREAM, { t: 45, name: 'Bed' }); await tile(s, x, 1.02, r, 'tl', c); k.txt(s, String(i + 1), x + 0.1, 1.08, 0.6, 0.6, { size: 24, bold: true, font: F.head, color: DK, valign: 'middle', ls: 1 }); hd(s, st.h, x + 0.1, 1.08 + r, w - 0.25, 0.56, { color: C.ink, max: 15 }); bd(s, st.t, x + 0.1, 1.66 + r, w - 0.25, 5.16 - (1.66 + r), { max: 13 }); }
        k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5 }); },
      async (d) => { // a dark page with a spine: steps change sides on the way down
        const s = k.slide(DK), n = d.steps.length, cx = 5, y0 = 1.05, gap = 2.67 / (n - 1); no(s, 0.4, 0.25, C.q2, 22); k.head(s, d.title || '', 1.3, 0.2, 8.3, 0.65, { max: 24, min: 13, color: 'FFFFFF' });
        t.line(s, cx, y0, 0, 4.1, C.q2, 2); d.steps.forEach((st, i) => { const my = y0 + i * gap, L0 = i % 2 === 0; t.oval(s, cx - 0.2, my, 0.4, 0.4, i === n - 1 ? C.q : C.q2); k.txt(s, String(i + 1), cx - 0.2, my, 0.4, 0.4, { size: 13, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle', ls: 1 }); const x = L0 ? 0.5 : 5.35, w = 4.15, al = L0 ? 'right' : 'left', by = my; hd(s, st.h, x, by, w, 0.4, { color: C.q2, align: al }); bd(s, st.t, x, by + 0.42, w, 1.02, { color: CREAM, align: al, max: 12.5, ls: 1.15 }); });
        k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5, color: CREAM }); },
    ],
    stats: [
      async (d) => { // the lead figure stands in a great quarter rising from the low corner, its two partners on the right
        const s = k.slide(C.bg), [a, ...rest] = d.stats; await big(s, 'bl', 5.4, C.q); k.txt(s, String(k.idx).padStart(2, '0'), 0.45, 0.2, 0.9, 0.45, { size: 18, bold: true, font: F.head, color: C.q });
        k.head(s, a.value, 0.3, 2.0, 3.5, 1.35, { max: 60, min: 24, color: DK }); k.txt(s, a.label, 0.3, 3.4, 3.2, 0.85, { max: 13, color: DK, bold: true, ls: 1.15 });
        k.head(s, d.title || '', 5.55, 0.25, 4.0, 0.9, { max: 22, min: 13, valign: 'top' }); rest.forEach((v, i) => { const y = 1.25 + i * 1.28; hd(s, v.value, 5.55, y, 1.85, 1.15, { max: 30, min: 16, color: i ? C.ink : RED }); bd(s, v.label, 7.45, y, 2.1, 1.15, { valign: 'middle', max: 12 }); t.line(s, 5.55, y + 1.2, 4.0, 0, C.rule, 0.75); });
        if (d.note) bd(s, d.note, 5.55, 3.85, 4.0, 1.35, { italic: true, max: 11.5, ls: 1.15 }); k.foot(s, { x: 0.3, w: 5.0, y: 5.32, size: 7, color: DK }); },
      async (d) => { // three equal quarters, each turned its own way, a figure inside and its name beneath
        const s = k.slide(C.bg), W3 = 3.1; await top(s, d); const at = ['tl', 'tr', 'tl'], cols = [C.q, DK, C.q2];
        for (const [i, v] of d.stats.entries()) { const x = 0.35 + i * W3, r = 2.0, qx = at[i] === 'tr' ? x + W3 - 0.2 - r : x; await tile(s, qx, 1.02, r, at[i], cols[i]); const dark = i === 1; k.head(s, v.value, at[i] === 'tr' ? qx + 0.42 : x + 0.05, 1.08, 1.5, 0.95, { max: 28, min: 15, color: dark ? 'FFFFFF' : DK, align: at[i] === 'tr' ? 'right' : 'left' }); bd(s, v.label, x + 0.05, 3.08, W3 - 0.3, 0.72, { color: C.ink, max: 12.5, ls: 1.12 }); }
        if (d.note) { t.line(s, 0.4, 3.86, 9.2, 0, C.q, 1.25); bd(s, d.note, 0.4, 3.94, 9.2, 1.22, { italic: true, max: 13, valign: 'middle' }); } k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5 }); },
      async (d) => { // figures in lights on the dark page, a quarter arcing in behind them
        const s = k.slide(DK); await big(s, 'tr', 4.7, RED); no(s, 0.45, 0.25, C.q2, 22); k.head(s, d.title || '', 1.35, 0.2, 7.6, 0.68, { max: 24, min: 13, color: 'FFFFFF' });
        const w = 3.0; d.stats.forEach((v, i) => { const x = 0.45 + i * (w + 0.05), y = 1.15 + i * 0.28; k.head(s, v.value, x, y, w - 0.2, 0.95, { max: 42, min: 18, color: i === 0 ? C.q2 : 'FFFFFF' }); t.rect(s, x, y + 0.98, 0.8, 0.05, C.q, { name: 'Accent' }); bd(s, v.label, x, y + 1.08, w - 0.25, 0.72, { color: CREAM, max: 12 }); });
        if (d.note) bd(s, d.note, 0.45, 3.82, 9.1, 1.32, { italic: true, color: CREAM, max: 13, valign: 'bottom', ls: 1.15 }); k.foot(s, { x: 0.45, w: 9.1, y: 5.3, size: 7.5, color: CREAM }); },
    ],
    compare: [
      async (d) => { // two quarters face each other from the top corners, the lists mirrored under them
        const s = k.slide(C.bg); await big(s, 'tl', 2.4, C.q); await big(s, 'tr', 2.4, DK); k.txt(s, String(k.idx).padStart(2, '0'), 4.5, 0.12, 1.0, 0.45, { size: 18, bold: true, font: F.head, color: C.q, align: 'center' }); k.head(s, d.title || '', 2.65, 0.6, 4.7, 0.9, { max: 21, min: 13, align: 'center', valign: 'top' });
        hd(s, d.left.h, 0.22, 0.2, 1.68, 1.2, { color: DK, max: 15, valign: 'top' }); hd(s, d.right.h, 8.1, 0.2, 1.68, 1.2, { color: 'FFFFFF', max: 15, align: 'right', valign: 'top' });
        const w = 4.1, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.14, 2.7); t.line(s, 5, 2.45, 0, 2.7, C.rule, 1.25);
        [d.left, d.right].forEach((sd, i) => { const x = i ? 5.25 : 0.65; let y = 2.47; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: i ? 'left' : 'right', color: C.ink }); y += rr[j]; }); }); k.foot(s, { x: 0.65, w: 8.7, y: 5.3, size: 7.5, align: 'center' }); },
      async (d) => { // two wide bands one over the other, a quarter holding each side's name
        const s = k.slide(C.bg); await top(s, d); for (const [i, sd] of [d.left, d.right].entries()) { const y = i ? 3.12 : 1.02, h = 2.02, f = i ? DK : 'FFE3C2', ink = i ? CREAM : C.ink, r = 2.02; t.rect(s, 0, y, 10, h, f, { name: 'Band' }); await tile(s, 0, y, r, 'tl', i ? C.q2 : C.q); hd(s, sd.h, 0.14, y + 0.08, 1.45, 1.05, { color: DK, max: 14, valign: 'top' }); const n = sd.items.length, x0 = 2.15, w = (9.7 - x0) / n; sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.25, 0, h - 0.5, i ? C.q2 : C.q, 1); k.txt(s, it, x + 0.12, y + 0.1, w - 0.22, h - 0.2, { max: 13, color: ink, valign: 'middle', ls: 1.15 }); }); }
        k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5 }); },
    ],
    statement: [
      async (d) => { // a maroon page with one line in big white, a bright quarter in the low corner
        const s = k.slide(DK); await big(s, 'br', 2.7, C.q); no(s, 0.55, 0.3, C.q2, 20); if (d.title) k.txt(s, d.title, 1.4, 0.3, 8.0, 0.5, { max: 13, bold: true, color: C.q2, valign: 'middle' });
        k.head(s, L.runs(d.text), 0.55, 0.95, 8.8, 2.3, { max: 34, min: 18, color: 'FFFFFF', valign: 'top' }); if (d.caption) bd(s, d.caption, 0.55, 3.35, 6.5, 1.75, { color: CREAM, max: 13, ls: 1.2 }); k.foot(s, { x: 0.55, w: 6.7, y: 5.3, color: CREAM, size: 7.5 }); },
      async (d) => { // the thought fills the great quarter itself, its note outside the curve
        const s = k.slide(C.bg); await big(s, 'tl', 6.2, C.q); k.txt(s, String(k.idx).padStart(2, '0'), 0.4, 0.22, 0.8, 0.42, { size: 16, bold: true, font: F.head, color: DK, valign: 'middle' }); if (d.title) k.txt(s, d.title, 1.15, 0.22, 3.6, 0.42, { max: 12, bold: true, color: DK, valign: 'middle' });
        k.head(s, L.runs(d.text), 0.4, 0.78, 4.1, 3.15, { max: 26, min: 15, color: DK, valign: 'top' }); if (d.caption) { t.rect(s, 6.45, 1.5, 0.9, 0.07, C.q, { name: 'Accent' }); bd(s, d.caption, 6.45, 1.68, 3.1, 3.4, { max: 13, ls: 1.25 }); } k.foot(s, { x: 6.1, w: 3.5, y: 5.32, size: 6.5 }); },
    ],
    timeline: [
      async (d) => { // the axis across the page: events take turns above and below it, the year on a small quarter
        const s = k.slide(C.bg), ax = 3.05; await top(s, d); t.line(s, 0.35, ax, 9.3, 0, C.ink, 2);
        for (const [i, it] of d.items.entries()) { const up = i % 2 === 0, X = 0.35 + i * 2.1, w = [3.95, 3.95, 4.6, 3.0][i], y = up ? 1.0 : ax + 0.55; await tile(s, X, up ? ax - 0.5 : ax, 0.5, up ? 'bl' : 'tl', i % 2 ? C.q2 : C.q); hd(s, it.year, X + 0.56, up ? ax - 0.5 : ax + 0.04, 1.5, 0.46, { color: RED, max: 18, min: 12 }); hd(s, it.h, X, y, w, 0.38, { color: C.ink, max: 14 }); bd(s, it.t, X, y + 0.38, w, up ? 1.1 : 1.15, { max: 12, ls: 1.12 }); }
        k.foot(s, { x: 0.35, w: 9.3, y: 5.32, size: 7 }); },
      async (d) => { // the years climb: rising blocks, the newest tallest, each topped by a quarter-round shoulder
        const s = k.slide(C.bg), w = 2.28, H = [2.55, 3.0, 3.45, 3.9], fills = ['FFE3C2', 'FFD199', C.q2, C.q], base = 5.18; k.txt(s, String(k.idx).padStart(2, '0'), 0.4, 0.2, 0.9, 0.5, { size: 22, bold: true, font: F.head, color: C.q }); k.head(s, d.title || '', 0.4, 0.72, 6.6, 0.72, { max: 22, min: 13, valign: 'top' });
        for (const [i, it] of d.items.entries()) { const x = 0.4 + i * (w + 0.03), y = base - H[i], W2 = Math.round(w * 100), H2 = Math.round(H[i] * 100); t.img(s, await k.svg(`blk${i}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><path d="M0,0 L${W2 - 60},0 A60,60 0 0 1 ${W2},60 L${W2},${H2} L0,${H2} Z" fill="#${fills[i]}"/></svg>`, W2, H2), x, y, w, H[i]); k.head(s, it.year, x + 0.12, y + 0.06, w - 0.7, 0.5, { max: 18, min: 12, color: DK }); hd(s, it.h, x + 0.12, y + 0.56, w - 0.24, 0.5, { color: DK, max: 13, valign: 'top' }); k.txt(s, it.t, x + 0.12, y + 1.06, w - 0.24, H[i] - 1.12, { max: 12, min: 10, color: DK, ls: 1.1 }); }
        k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5 }); },
      async (d) => { // night ledger: years in lights in a zigzag, first to last from corner to corner
        const s = k.slide(DK); await big(s, 'tl', 1.05, C.q); k.txt(s, String(k.idx).padStart(2, '0'), 0.1, 0.1, 0.6, 0.4, { size: 15, bold: true, font: F.head, color: DK, valign: 'middle' }); k.head(s, d.title || '', 1.2, 0.18, 8.3, 0.7, { max: 24, min: 13, color: 'FFFFFF' });
        const w = 2.2, gap = 0.1; d.items.forEach((it, i) => { const x = 0.4 + i * (w + gap), y = i % 2 ? 1.5 : 1.05; k.head(s, it.year, x, y, w, 0.62, { max: 28, min: 13, color: C.q2 }); t.line(s, x, y + 0.66, w - 0.1, 0, C.q, 1.5); hd(s, it.h, x, y + 0.74, w - 0.1, 0.52, { color: 'FFFFFF', max: 13, valign: 'top' }); bd(s, it.t, x, y + 1.28, w - 0.1, 5.15 - y - 1.28 - (i % 2 ? 0 : 0.45), { color: CREAM, max: 12, ls: 1.12 }); });
        k.foot(s, { x: 0.4, w: 9.2, y: 5.3, size: 7.5, color: CREAM }); },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Chorak', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '370617', lt2: C.bg, accent1: C.q, accent2: C.q2, accent3: 'DC2F02', accent4: '9D0208', accent5: C.muted, accent6: C.rule, hlink: C.q, folHlink: C.muted } });
}
module.exports = { id: 113, slug: 'chorak', name: 'Çorak', category: 'creative', photos: true, build, style: { tone: "ixcham va dinamik: qisqa sarlavha, aniq bandlar", limits: { title: 40 }, prefer: null } };
