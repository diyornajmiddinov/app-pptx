/**
 * 135 Fasad — a classical building FACADE: the title sits on a triangular pediment, columns divide the front
 * into bays, each idea lives in a bay under an arched window; lists become floors of the building.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'EAF2F8', stone: 'E8DFCE', stone2: 'D6C8AE', ink: '2E2A24', muted: '5F574C', win: '5B7C99', accent: '8A5A44' };
const F = { head: 'Times New Roman', body: 'Calibri' };
const BX = 0.4, BW = 9.2, BY = 1.35, BH = 3.65;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const pediment = async (s, title) => { t.img(s, await k.svg('ped', `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="100"><polygon points="0,100 460,4 920,100" fill="#${C.stone}" stroke="#${C.stone2}" stroke-width="4"/><polygon points="60,92 460,14 860,92" fill="none" stroke="#${C.stone2}" stroke-width="2"/></svg>`, 920, 100), BX, 0.18, BW, 1.0);
    t.rect(s, BX, 1.18, BW, 0.17, C.stone2, { name: 'Entablature' }); k.head(s, title || '', 2.2, 0.55, 5.6, 0.55, { max: 20, min: 11, align: 'center', font: F.head, spacing: 2 }); };
  const base = (s) => { t.rect(s, BX, BY, BW, BH, C.stone, { name: 'Wall' }); t.rect(s, BX - 0.15, BY + BH, BW + 0.3, 0.12, C.stone2, { name: 'Stylobate' }); };
  const column = (s, x) => { t.rect(s, x, BY, 0.22, BH, 'F3ECDD', { name: 'Column' }); for (let f = 0; f < 3; f++) t.line(s, x + 0.05 + f * 0.06, BY + 0.12, 0, BH - 0.24, C.stone2, 0.5); t.rect(s, x - 0.05, BY, 0.32, 0.1, C.stone2, { name: 'Capital' }); };
  const window = (s, x, y, w, h) => { t.rect(s, x, y + w / 2, w, h - w / 2, C.win, { name: 'Window' }); t.shape(s, 'CHORD', { x, y, w, h: w, fill: { color: C.win }, angleRange: [180, 0], objectName: 'Arch' }); };
  const page = async (d) => { const s = k.slide(C.sky); await pediment(s, (d.title || '').toUpperCase()); base(s); k.txt(s, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][k.idx - 1] || String(k.idx), 4.5, 0.82, 1.0, 0.3, { size: 10, bold: true, color: C.accent, align: 'center', font: F.head }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const bays = (s, n, draw) => { const w = BW / n; for (let i = 0; i <= n; i++) column(s, BX + i * w - (i === n ? 0.22 : i ? 0.11 : 0)); for (let i = 0; i < n; i++) { const x = BX + i * w + 0.3, ww = w - 0.6; window(s, x + ww / 2 - 0.3, BY + 0.2, 0.6, 0.7); draw(i, x, BY + 1.0, ww, BH - 1.1); } };
  const floors = (s, n, draw) => { const rh = BH / n; for (let i = 0; i < n; i++) { const y = BY + i * rh; if (i) t.line(s, BX, y, BW, 0, C.stone2, 2); for (let w2 = 0; w2 < 2; w2++) t.rect(s, BX + 0.25 + w2 * 0.45, y + 0.1, 0.32, rh - 0.2, C.win, { name: 'Window' }); draw(i, BX + 1.25, y, BW - 1.5, rh); } };
  const R = {
    async cover(d) { const s = k.slide(C.sky); await pediment(s, (k.M.org || '').toUpperCase()); base(s); [0, 1, 2, 3].forEach((i) => column(s, BX + i * (BW / 3) - (i === 3 ? 0.22 : i ? 0.11 : 0)));
      if (d.image) await k.photo(s, d.image, BX + BW / 3 * 2 + 0.3, BY + 0.3, BW / 3 - 0.6, BH - 0.6, { mask: { path: 'M0,0.3 A0.5,0.3 0 0 1 1,0.3 L1,1 L0,1 Z' } });
      k.head(s, d.title, BX + 0.4, BY + 0.3, BW / 3 * 2 - 0.8, 2.2, { max: 34, min: 16, font: F.head, align: 'center' }); if (d.subtitle) k.txt(s, d.subtitle, BX + 0.4, BY + 2.5, BW / 3 * 2 - 0.8, 0.6, { max: 12, color: C.muted, align: 'center' }); k.txt(s, [k.M.author, [k.M.loc, k.M.year].filter(Boolean).join(', ')].filter(Boolean).join('  \u2022  '), BX + 0.4, BY + 3.05, BW / 3 * 2 - 0.8, 0.45, { size: 13, bold: true, align: 'center', color: C.accent }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); },
    async intro(d) { const s = await page(d); [0, 1, 2].forEach((i) => column(s, BX + i * BW / 2 - (i === 2 ? 0.22 : i ? 0.11 : 0))); await k.photo(s, d.image, BX + 0.35, BY + 0.2, BW / 2 - 0.7, BH - 0.4, { mask: { path: 'M0,0.25 A0.5,0.25 0 0 1 1,0.25 L1,1 L0,1 Z' } }); k.txt(s, d.text, BX + BW / 2 + 0.3, BY + 0.2, BW / 2 - 0.6, BH - 0.4, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 17, font: F.head })); },
    async cards(d) { const s = await page(d); bays(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, align: 'center', font: F.head }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: 'center' }); }); },
    async process(d) { const s = await page(d); bays(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, align: 'center', font: F.head }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: 'center' }); }); },
    async stats(d) { const s = await page(d); bays(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 0.95, { max: 40, min: 16, align: 'center', color: C.accent, font: F.head }); k.txt(s, d.stats[i].label, x, y + 1.0, w, h - 1.0 - (d.note ? 0.45 : 0), { max: 12, align: 'center' }); }); if (d.note) k.txt(s, d.note, BX + 0.3, BY + BH - 0.5, BW - 0.6, 0.45, { max: 8.5, color: C.muted, align: 'center' }); },
    async compare(d) { const s = await page(d); const w = BW / 2 - 0.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.1, BH - 0.75); [0, 1, 2].forEach((i) => column(s, BX + i * BW / 2 - (i === 2 ? 0.22 : i ? 0.11 : 0)));
      [d.left, d.right].forEach((sd, i) => { const x = BX + i * BW / 2 + 0.35; k.head(s, sd.h, x, BY + 0.12, w, 0.5, { max: 17, align: 'center', font: F.head, color: C.accent }); let y = BY + 0.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); t.rect(s, BX + 0.6, BY + 0.35, BW - 1.2, 2.2, 'F3ECDD', { line: { color: C.stone2, width: 2 }, name: 'Plaque' }); k.head(s, L.runs(d.text), BX + 0.85, BY + 0.4, BW - 1.7, 2.1, { max: 28, min: 14, align: 'center', font: F.head }); if (d.caption) k.txt(s, d.caption, BX + 0.6, BY + 2.65, BW - 1.2, 0.9, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => { const it = d.items[d.items.length - 1 - i]; k.head(s, it.year, x, y, 1.2, h, { max: 20, min: 11, color: C.accent, font: F.head }); k.head(s, it.h, x + 1.3, y, 2.2, h, { max: 14 }); k.txt(s, it.t, x + 3.6, y, w - 3.6, h, { max: 12, valign: 'middle' }); }); },
    async quote(d) { const s = await page({}); t.rect(s, BX + 2.8, BY + 1.3, 3.6, BH - 1.3, C.win, { name: 'Door' }); k.head(s, `\u201C${d.text}\u201D`, BX + 0.5, BY + 0.15, BW - 1.0, 1.1, { max: 22, min: 11, italic: true, align: 'center', font: F.head }); if (d.author) k.txt(s, d.author, BX + 2.8, BY + 2.1, 3.6, 0.5, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
    async sources(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in the same stone: a deck's pages must not look alike (L.pages)
  const DUSK = '16222E', DUSK2 = '22303F', LAMP = 'F4C95D', MARBLE = 'F3ECDD', FOG = 'CBD5DF', ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX'];
  const rom = () => ROM[k.idx - 1] || String(k.idx);
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, font: F.head, ...o });
  const arch = async (s, x, y, w, h, col, o = {}) => { const W0 = Math.round(w * 100), H0 = Math.round(h * 100), r = W0 / 2; t.img(s, await k.svg(`arch${W0}-${H0}-${col}-${o.line || ''}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W0}" height="${H0}"><path d="M2,${H0} L2,${r} A${r - 2},${r - 2} 0 0 1 ${W0 - 2},${r} L${W0 - 2},${H0} Z" fill="#${col}"${o.line ? ` stroke="#${o.line}" stroke-width="3"` : ''}/></svg>`, W0, H0), x, y, w, h); };
  const col = (s, x, y, h, w = 0.24, c = MARBLE, fl = C.stone2) => { t.rect(s, x, y, w, h, c, { name: 'Column' }); for (let f = 1; f < 4; f++) t.line(s, x + f * w / 4, y + 0.1, 0, h - 0.2, fl, 0.5); t.rect(s, x - 0.05, y, w + 0.1, 0.09, fl, { name: 'Capital' }); t.rect(s, x - 0.05, y + h - 0.09, w + 0.1, 0.09, fl, { name: 'Base' }); };
  const pg = (d, o = {}) => { // a cornice under the title; o.night = the building after dusk, windows lit
    const n = !!o.night, s = k.slide(n ? DUSK : (o.wall ? C.stone : C.sky)), tb = o.title || {};
    if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.2, tb.w ?? 8.3, tb.h ?? 0.68, { max: tb.max ?? 24, min: 13, font: F.head, color: n ? 'FFFFFF' : C.ink });
    k.txt(s, rom(), 8.6, 0.2, 1.0, 0.68, { size: 14, bold: true, font: F.head, color: n ? LAMP : C.accent, align: 'right', valign: 'middle' });
    if (!o.noCornice) { t.rect(s, 0, 0.9, 10, 0.08, n ? DUSK2 : C.stone2, { name: 'Cornice' }); }
    k.foot(s, { y: 5.32, size: 7.5, align: 'center', x: o.fx ?? 0.6, w: o.fw ?? 8.8, ...(n ? { color: FOG } : {}) });
    return s;
  };
  const stone = (s, x, y, w, h, o = {}) => { t.rect(s, x, y, w, h, o.fill ?? MARBLE, { line: { color: o.line ?? C.stone2, width: o.lw ?? 2 }, name: 'Plaque' }); if (o.inner !== false) t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { line: { color: o.line ?? C.stone2, width: 0.75 }, name: 'Moulding' }); };
  const V = {
    image: [
      async (d) => { // the view through an arcade: one picture behind three arches in the wall
        const s = pg(d, { wall: true }), W0 = 9.2, H0 = 2.5, a = 0.31, g = 0.035;
        let p = ''; for (let i = 0; i < 3; i++) { const x0 = i * (a + g), x1 = x0 + a, r = a / 2; p += `M${x0},1 L${x0},${0.5} A${r},0.5 0 0 1 ${x1},0.5 L${x1},1 Z `; }
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: p } }), 0.4, 1.06, W0, H0, { alt: '' });
        t.rect(s, 0.25, 3.56, 9.5, 0.08, C.stone2, { name: 'Sill' });
        bd(s, d.text, 0.4, 3.68, 9.2, 1.58, { max: 13, valign: 'middle', ls: 1.08 });
      },
      async (d) => { // the picture fills the page, a carved plaque hangs over it on a stone plinth
        const s = k.slide(DUSK), px = 4.7, pw = 4.9;
        await k.photo(s, d.image, 0, 0, 10, 5.25);
        t.rect(s, 0, 5.25, 10, 0.375, C.stone2, { name: 'Plinth' });
        stone(s, px, 0.32, pw, 4.65, { line: C.accent });
        k.head(s, d.title || '', px + 0.24, 0.42, pw - 1.2, 0.96, { max: 20, min: 13, font: F.head });
        k.txt(s, rom(), px + pw - 0.95, 0.42, 0.72, 0.5, { size: 13, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' });
        t.line(s, px + 0.24, 1.42, pw - 0.48, 0, C.accent, 1);
        bd(s, d.text, px + 0.24, 1.5, pw - 0.48, 3.38, { max: 13.5, color: C.ink });
        k.foot(s, { y: 5.34, size: 7.5, align: 'center', color: C.ink });
      },
      async (d) => { // a round oculus in a plain wall, a moulded ring around the picture
        const s = pg(d, { wall: true, title: { x: 5.3, w: 3.3, h: 1.0, y: 0.18, max: 20 }, noCornice: true, fx: 5.3, fw: 4.3 }), D = 4.4, x = 0.45, y = 0.56;
        t.oval(s, x - 0.14, y - 0.14, D + 0.28, D + 0.28, C.stone2); t.oval(s, x - 0.06, y - 0.06, D + 0.12, D + 0.12, MARBLE);
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle' }), x, y, D, D, { alt: '' });
        t.line(s, 5.3, 1.22, 4.3, 0, C.accent, 1);
        bd(s, d.text, 5.3, 1.3, 4.3, 3.92, { max: 13.5, ls: 1.2 });
      },
      async (d) => { // dusk: a tall doorway stands open, the picture lit inside it
        const s = pg(d, { night: true, title: { w: 4.6, h: 0.72 }, noCornice: true, fw: 4.8, fx: 0.4 }), W0 = 3.8, H0 = 5.1, x = 5.6, y = 0.3;
        await arch(s, x - 0.16, y - 0.16, W0 + 0.32, H0 + 0.16, C.stone2);
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: `M0,1 L0,${W0 / 2 / H0} A0.5,${W0 / 2 / H0} 0 0 1 1,${W0 / 2 / H0} L1,1 Z` } }), x, y, W0, H0, { alt: '' });
        t.rect(s, 0, 5.28, 10, 0.05, C.stone2, { name: 'Step' });
        bd(s, d.text, 0.4, 1.1, 4.8, 4.08, { color: 'FFFFFF', max: 13.5, ls: 1.2 });
      },
    ],
    cards: [
      async (d) => { // the storeys of a palace: each idea a floor, a sign in the arched window at its end
        const s = pg(d, { wall: true }), n = d.items.length, y0 = 0.98, rh = (5.24 - y0) / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, wh = Math.min(rh - 0.14, 0.92), ww = 0.72;
          if (i) t.rect(s, 0, y - 0.03, 10, 0.06, C.stone2, { name: 'Floor' });
          await arch(s, 0.55, y + (rh - wh) / 2, ww, wh, C.win);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), 0.55 + ww / 2 - 0.15, y + (rh - wh) / 2 + wh * 0.42, 0.3, 0.3);
          hd(s, it.h, 1.55, y + 0.06, 8.05, 0.38, { color: C.accent, max: 16 });
          bd(s, it.t, 1.55, y + 0.44, 8.05, rh - 0.5, { max: 13.5, color: C.ink, ls: 1.08 });
        }
      },
      async (d) => { // dusk: tall windows glow in the dark front, each with its idea in the lit glass
        const s = pg(d, { night: true }), n = d.items.length, w = 9.2 / n, y = 1.08, H = 4.12;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.08, ww = w - 0.16, r = ww / 2;
          await arch(s, x, y, ww, H, 'FBEFCB', { line: LAMP });
          t.img(s, await k.icon(it.icon, C.accent, 2), x + r - 0.2, y + 0.22, 0.4, 0.4);
          hd(s, it.h, x + 0.14, y + r * 0.72 + 0.28, ww - 0.28, 0.54, { align: 'center', max: 14, color: C.ink });
          bd(s, it.t, x + 0.14, y + r * 0.72 + 0.84, ww - 0.28, H - r * 0.72 - 0.92, { align: 'center', color: C.ink, max: 12.5 });
        }
      },
      async (d) => { // coffered panels in the wall, each framed by mouldings, set in a row or two by two
        const s = pg(d), n = d.items.length;
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.52 : 2.96, h = n === 4 ? 2.0 : 4.12, x = 0.4 + (n === 4 ? i % 2 : i) * (w + (n === 4 ? 0.16 : 0.16)), y = 1.08 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.12);
          stone(s, x, y, w, h);
          if (n === 4) { t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.18, y + 0.16, 0.36, 0.36); hd(s, it.h, x + 0.64, y + 0.12, w - 0.82, 0.44, { max: 14 }); t.line(s, x + 0.18, y + 0.58, w - 0.36, 0, C.stone2, 1); bd(s, it.t, x + 0.18, y + 0.64, w - 0.36, h - 0.74, { max: 13, color: C.ink }); }
          else { t.img(s, await k.icon(it.icon, C.accent, 1.75), x + w / 2 - 0.3, y + 0.24, 0.6, 0.6); hd(s, it.h, x + 0.18, y + 0.92, w - 0.36, 0.56, { align: 'center' }); t.line(s, x + w / 2 - 0.5, y + 1.5, 1.0, 0, C.stone2, 1.25); bd(s, it.t, x + 0.2, y + 1.58, w - 0.4, h - 1.7, { align: 'center', color: C.ink }); }
        }
      },
      async (d) => { // a domed pavilion in the middle, carrying the title; the ideas live in its two wings
        const s = k.slide(C.sky), n = d.items.length, pw = 2.5, px = 5 - pw / 2, w = 3.2, spots = n === 4 ? [[0, 0.56], [0, 2.88], [1, 0.56], [1, 2.88]] : [[0, 0.56], [0, 2.88], [1, 1.72]], hh = 2.26;
        t.rect(s, 0.2, 5.08, 9.6, 0.14, C.stone2, { name: 'Stylobate' });
        t.rect(s, 0.3, 0.46, 9.4, 4.62, C.stone, { name: 'Wings' });
        t.img(s, await k.svg('dome', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="130"><path d="M4,130 A146,126 0 0 1 296,130 Z" fill="#${C.win}"/><rect x="146" y="0" width="8" height="10" fill="#${C.accent}"/></svg>`, 300, 130), px - 0.1, 0.1, pw + 0.2, 1.02);
        t.rect(s, px, 1.12, pw, 3.96, MARBLE, { line: { color: C.stone2, width: 1.5 }, name: 'Pavilion' });
        col(s, px + 0.06, 1.12, 3.96, 0.2); col(s, px + pw - 0.26, 1.12, 3.96, 0.2);
        k.head(s, d.title || '', px + 0.34, 1.3, pw - 0.68, 2.3, { max: 20, min: 12, font: F.head, align: 'center', color: C.ink });
        k.txt(s, rom(), px + 0.34, 3.9, pw - 0.68, 0.5, { size: 16, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 6.42 : 0.38, a = side ? 'left' : 'right';
          t.img(s, await k.icon(it.icon, C.accent, 2), side ? x : x + w - 0.34, y + 0.02, 0.34, 0.34);
          hd(s, it.h, side ? x + 0.42 : x, y, w - 0.42, 0.42, { align: a, max: 13.5 });
          bd(s, it.t, x, y + 0.46, w, hh - 0.5, { align: a, color: C.ink, max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5, align: 'center' });
      },
    ],
    process: [
      async (d) => { // a grand stair climbing to the right: each flight a block of stone, its words cut in it
        const s = pg(d, { title: { w: 6.0, h: 0.68 }, noCornice: true }), n = d.steps.length, w = 10 / n, tops = n === 4 ? [2.5, 2.0, 1.5, 1.0] : [2.34, 1.67, 1.0], tones = [MARBLE, C.stone, 'E0D5BF', C.stone2];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = tops[n === 4 ? i : i];
          t.rect(s, x, y, w, 5.625 - y, tones[n === 4 ? i : i + 1], { name: 'Flight' }); t.rect(s, x, y, w, 0.07, C.accent, { name: 'Tread' });
          k.txt(s, ROM[i], x + 0.2, y + 0.12, 0.8, 0.42, { size: 20, bold: true, font: F.head, color: C.accent, valign: 'middle' });
          hd(s, st.h, x + 0.2, y + 0.54, w - 0.36, 0.54, { valign: 'top', max: 14, color: C.ink });
          bd(s, st.t, x + 0.2, y + 1.08, w - 0.36, 5.24 - y - 1.08, { color: C.ink, max: 12.5 });
        }
      },
      async (d) => { // built from the ground up: the first step is the foundation at the foot, the last the top floor
        const s = pg(d, { wall: true }), n = d.steps.length, y0 = 0.98, rh = (5.24 - y0) / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 5.24 - (i + 1) * rh, f = i === 0;
          if (f) t.rect(s, 0, y, 10, rh + 0.385, C.stone2, { name: 'Foundation' });
          else t.rect(s, 0, y + rh - 0.03, 10, 0.06, C.stone2, { name: 'Floor' });
          t.oval(s, 0.5, y + rh / 2 - 0.29, 0.58, 0.58, C.accent);
          k.txt(s, ROM[i], 0.5, y + rh / 2 - 0.29, 0.58, 0.58, { size: 13, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, 1.3, y + 0.06, 8.3, 0.36, { color: f ? C.ink : C.accent, max: 15 });
          bd(s, st.t, 1.3, y + 0.42, 8.3, rh - 0.48, { color: C.ink, max: 13.5, ls: 1.08 });
        }
      },
      async (d) => { // an enfilade: door behind door, each smaller, the words under each threshold
        const s = pg(d), n = d.steps.length, w = 9.2 / n, base = 2.46, hs = n === 4 ? [1.42, 1.22, 1.02, 0.82] : [1.42, 1.14, 0.86];
        t.rect(s, 0, base, 10, 0.06, C.stone2, { name: 'Threshold' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, h = hs[i], dw = h * 0.68;
          await arch(s, x, base - h, dw, h, C.win);
          k.txt(s, ROM[i], x, base - h * 0.62, dw, h * 0.6, { size: 15, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (i < n - 1) t.line(s, x + dw + 0.08, base - 0.3, w - dw - 0.16, 0, C.accent, 1.5, { dash: 'dash' });
          hd(s, st.h, x, base + 0.12, w - 0.16, 0.54, { valign: 'top', color: C.accent, max: 14 });
          bd(s, st.t, x, base + 0.68, w - 0.16, 5.24 - base - 0.68, { max: 13, color: C.ink });
        }
      },
      async (d) => { // dusk: one column rises through the page, the steps stand on its two sides by turns
        const s = pg(d, { night: true }), n = d.steps.length, cx = 5, y0 = 1.08, rh = (5.14 - y0) / n, w = 4.1;
        col(s, cx - 0.2, 1.02, 4.2, 0.4, 'B8AE99', '8D8471');
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.46 - w : cx + 0.46, a = left ? 'right' : 'left', hh = Math.min(rh * 1.7, 5.22 - y);
          t.oval(s, cx - 0.24, y, 0.48, 0.48, LAMP); k.txt(s, ROM[i], cx - 0.24, y, 0.48, 0.48, { size: 12, bold: true, font: F.head, color: DUSK, align: 'center', valign: 'middle' });
          hd(s, st.h, x, y, w, 0.38, { color: LAMP, align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: 'FFFFFF', align: a, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // the entablature carries the figures, a column stands under each with its meaning beside it
        const s = pg(d, { noCornice: true }), w = 9.2 / 3, fy = 0.94, fh = 1.14, by = d.note ? 3.54 : 5.1;
        t.rect(s, 0.4, fy, 9.2, fh, C.stone, { line: { color: C.stone2, width: 2 }, name: 'Frieze' });
        t.rect(s, 0.4, by, 9.2, 0.1, C.stone2, { name: 'Stylobate' });
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w;
          if (i) { t.line(s, x, fy, 0, fh, C.stone2, 2); }
          k.head(s, v.value, x + 0.1, fy + 0.06, w - 0.2, fh - 0.12, { max: 40, min: 18, font: F.head, color: C.accent, align: 'center', ls: 1 });
          col(s, x + 0.16, fy + fh, by - fy - fh, 0.24);
          bd(s, v.label, x + 0.54, fy + fh + 0.1, w - 0.68, by - fy - fh - 0.2, { valign: 'middle', max: 14, color: C.ink });
        }
        if (d.note) bd(s, d.note, 0.4, 3.72, 9.2, 1.5, { color: C.muted, align: 'center', max: 14, valign: 'middle' });
      },
      async (d) => { // dusk: a triumphal arch, the lead figure in its opening, the others carved on its piers
        const s = pg(d, { night: true }), [a, ...rest] = d.stats, x = 0.4, y = 1.06, W0 = 9.2, H0 = d.note ? 3.16 : 4.14, op = 3.9, ox = x + (W0 - op) / 2;
        t.rect(s, x, y, W0, H0, C.stone, { name: 'Arch' });
        await arch(s, ox, y + 0.16, op, H0 - 0.16, DUSK);
        k.head(s, a.value, ox + 0.32, y + 0.74, op - 0.64, 1.04, { max: 46, min: 20, font: F.head, color: LAMP, align: 'center', ls: 1 });
        bd(s, a.label, ox + 0.5, y + 1.8, op - 1.0, H0 - 1.86, { color: 'FFFFFF', align: 'center', max: 13 });
        rest.forEach((v, i) => { const px = i ? ox + op + 0.1 : x + 0.1, pw = (W0 - op) / 2 - 0.2;
          k.head(s, v.value, px, y + 0.3, pw, 0.84, { max: 30, min: 15, font: F.head, color: C.accent, align: 'center', ls: 1 });
          t.line(s, px + 0.5, y + 1.16, pw - 1, 0, C.stone2, 1.5);
          bd(s, v.label, px + 0.05, y + 1.22, pw - 0.1, H0 - 1.3, { color: C.ink, align: 'center', max: 13 }); });
        if (d.note) bd(s, d.note, 0.4, 4.3, 9.2, 0.94, { color: FOG, italic: true, align: 'center', max: 12.5, valign: 'middle' });
      },
      async (d) => { // three round medallions set in the wall, a ribbon of words under each
        const s = pg(d, { wall: true }), w = 9.2 / 3, D = 1.96, y = 1.1;
        for (const [i, v] of d.stats.entries()) {
          const c = 0.4 + i * w + w / 2;
          t.oval(s, c - D / 2, y, D, D, MARBLE, { line: { color: C.accent, width: 3 } }); t.oval(s, c - D / 2 + 0.1, y + 0.1, D - 0.2, D - 0.2, null, { line: { color: C.stone2, width: 1.25 } });
          k.head(s, v.value, c - D / 2 + 0.16, y + 0.56, D - 0.32, D - 1.12, { max: 28, min: 14, font: F.head, color: C.accent, align: 'center', ls: 1 });
          bd(s, v.label, c - w / 2 + 0.16, y + D + 0.08, w - 0.32, 0.72, { color: C.ink, align: 'center', max: 13 });
        }
        if (d.note) { t.rect(s, 0, 3.96, 10, 0.06, C.stone2, { name: 'Floor' }); bd(s, d.note, 0.4, 4.08, 9.2, 1.14, { color: C.muted, align: 'center', max: 13, valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // a door in the middle of the front: two wings mirror each other across it
        const s = pg(d, { wall: true }), cx = 5, dw = 0.74, w = 3.9, top = 1.68, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.18, 5.22 - top);
        await arch(s, cx - dw / 2, 1.06, dw, 4.16, C.win);
        k.head(s, d.left.h, cx - dw / 2 - 0.2 - w, 1.06, w, 0.54, { max: 18, min: 12, font: F.head, color: C.accent, align: 'right' });
        k.head(s, d.right.h, cx + dw / 2 + 0.2, 1.06, w, 0.54, { max: 18, min: 12, font: F.head, color: C.accent });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          if (d.left.items[j]) k.txt(s, d.left.items[j], cx - dw / 2 - 0.2 - w, y, w, rr[j], { size: fs, align: 'right', color: C.ink, ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], cx + dw / 2 + 0.2, y, w, rr[j], { size: fs, color: C.ink, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // two storeys of one house: a pale piano nobile over a dark rusticated ground floor
        const s = pg(d), H = 2.08, y1 = 0.98, y2 = y1 + H;
        t.rect(s, 0, y1, 10, H, C.stone, { name: 'Upper storey' }); t.rect(s, 0, y2, 10, 5.22 - y2, DUSK2, { name: 'Ground floor' }); t.rect(s, 0, y2 - 0.04, 10, 0.08, C.accent, { name: 'String course' });
        [[d.left, y1, C.accent, C.ink, C.win], [d.right, y2 + 0.04, LAMP, 'FFFFFF', LAMP]].forEach(([sd, y, c, ink, wc]) => {
          k.head(s, sd.h, 0.4, y + 0.06, 9.2, 0.4, { max: 17, min: 12, font: F.head, color: c });
          const n = sd.items.length, w = 9.2 / n;
          sd.items.forEach((it, j) => { const x = 0.4 + j * w; t.rect(s, x, y + 0.54, 0.12, 1.36, wc, { r: 0.05, name: 'Slit' }); bd(s, it, x + 0.22, y + 0.5, w - 0.36, H - 0.62, { color: ink, max: 12.5, valign: 'middle', ls: 1.08 }); });
        });
      },
    ],
    statement: [
      async (d) => { // dusk: a great pediment floats above, the sentence stands in lamplight under it
        const s = k.slide(DUSK);
        t.img(s, await k.svg('pedN', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="120"><polygon points="20,118 500,4 980,118" fill="#${C.stone2}"/><polygon points="90,108 500,18 910,108" fill="#${C.stone}"/></svg>`, 1000, 120), 0, 0.1, 10, 1.2);
        k.head(s, d.title || '', 2.7, 0.56, 4.6, 0.66, { max: 16, min: 11, font: F.head, color: C.ink, align: 'center' });
        t.rect(s, 0.2, 1.3, 9.6, 0.08, C.stone2, { name: 'Entablature' });
        k.txt(s, rom(), 8.8, 0.3, 0.9, 0.4, { size: 13, bold: true, font: F.head, color: LAMP, align: 'right', valign: 'middle' });
        k.head(s, L.runs(d.text), 0.8, 1.48, 8.4, 2.2, { max: 30, min: 15, font: F.head, color: LAMP, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.8, 3.74, 8.4, 1.48, { color: 'FFFFFF', align: 'center', max: 13 });
        k.foot(s, { y: 5.32, size: 7.5, align: 'center', color: FOG });
      },
      async (d) => { // the dedication stone: the sentence cut large in marble, the note in the arched niche beside it
        const s = pg(d, { wall: true }), nx = 6.95, nw = 2.65;
        stone(s, 0.4, 1.08, 6.35, 4.14, { line: C.accent, lw: 3 });
        k.head(s, L.runs(d.text), 0.72, 1.28, 5.71, 3.74, { max: 30, min: 15, font: F.head, align: 'center', color: C.ink });
        await arch(s, nx, 1.08, nw, 4.14, DUSK2);
        if (d.caption) bd(s, d.caption, nx + 0.2, 2.1, nw - 0.4, 3.04, { color: 'FFFFFF', max: 12.5, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // a Doric frieze: each year in its metope, triglyphs between, each event hanging below
        const s = pg(d, { noCornice: true }), w = 9.2 / 4, fy = 0.94, fh = 0.76;
        t.rect(s, 0.4, fy, 9.2, fh, C.stone, { line: { color: C.stone2, width: 2 }, name: 'Frieze' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          if (i) for (let g = 0; g < 3; g++) t.rect(s, x - 0.13 + g * 0.09, fy + 0.02, 0.06, fh - 0.04, C.stone2, { name: 'Triglyph' });
          k.head(s, it.year, x + 0.18, fy, w - 0.36, fh, { max: 18, min: 10.5, font: F.head, color: C.accent, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.12, fy + fh + 0.12, w - 0.24, 0.4, { max: 14, align: 'center' });
          bd(s, it.t, x + 0.12, fy + fh + 0.54, w - 0.24, 5.22 - fy - fh - 0.54, { color: C.ink, max: 13, align: 'center' });
        }
      },
      async (d) => { // dusk: one lit string-course runs across the front, events above and below it by turns
        const s = pg(d, { night: true }), ya = 3.04, w = 4.35;
        t.rect(s, 0, ya - 0.04, 10, 0.08, LAMP, { name: 'String course' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75;
          await arch(s, xn, up ? ya - 0.42 : ya + 0.04, 0.26, 0.38, LAMP);
          k.head(s, it.year, xn + 0.32, up ? ya - 0.4 : ya + 0.06, 1.85, 0.34, { max: 14, min: 10, font: F.head, color: LAMP });
          if (up) { hd(s, it.h, x, 1.0, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, 1.36, w, ya - 0.48 - 1.36, { color: FOG, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.48, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, ya + 0.84, w, 5.24 - ya - 0.84, { color: FOG, max: 12.5 }); }
        }
      },
      async (d) => { // masonry: four great blocks laid in courses, the upper pair offset from the lower as in a wall
        const s = pg(d, { wall: true }), h = 2.04;
        const pos = [[0.4, 1.06, 5.2], [5.66, 1.06, 3.94], [0.4, 3.18, 3.94], [4.4, 3.18, 5.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = pos[i];
          t.rect(s, x, y, ww, h, MARBLE, { line: { color: C.stone2, width: 2 }, name: 'Block' });
          k.head(s, it.year, x + 0.16, y + 0.06, ww - 0.32, 0.5, { max: 22, min: 12, font: F.head, color: C.accent, ls: 1 });
          hd(s, it.h, x + 0.16, y + 0.56, ww - 0.32, 0.34, { max: 14 });
          bd(s, it.t, x + 0.16, y + 0.92, ww - 0.32, h - 0.98, { color: C.ink, max: 13, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Fasad', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '4A4036', lt2: C.sky, accent1: C.accent, accent2: C.win, accent3: C.stone2, accent4: 'B08D57', accent5: C.muted, accent6: C.stone, hlink: C.win, folHlink: C.muted } });
}
module.exports = { id: 135, slug: 'fasad', name: 'Fasad', category: 'academic', photos: true, build, style: { tone: "poydevor va ustunlar: tayanch tamoyillar, mustahkam dalillar, salobatli til", limits: { card_t4: 100, step_t: 100 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["p14:doors|dir=\"vert\"", "p14:window|dir=\"vert\"", "fade"], "cover": ["riseWords", "split"], "mark": "peekUp", "deco": "wipe:u", "sig": {"title": "wipe:u", "body": "fade", "item": "peekUp", "image": "split", "number": "peekUp", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": true};
