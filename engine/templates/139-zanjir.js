/**
 * 139 Zanjir — a golden CHAIN on deep navy: every idea is written inside a chain link, links interlock left to
 * right (or top to bottom for long lists); a pendant hangs from the cover chain.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0E1A2B', ink: 'F4EBD0', muted: 'B9AE8E', gold: 'D4A84B', gold2: 'F2D27A', dark: '0E1A2B' };
const F = { head: 'Georgia', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const link = (s, x, y, w, h, i) => { t.rect(s, x, y, w, h, null, { r: Math.min(w, h) / 2, line: { color: i % 2 ? C.gold : C.gold2, width: 9 }, name: 'Link' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { r: Math.min(w, h) / 2 - 0.06, line: { color: 'FFF4C2', width: 1, transparency: 50 }, name: 'Shine' }); };
  // horizontal chain: links overlap by `ov`; text inside each link
  const hChain = (s, n, draw, y = 1.35, h = 3.6) => { const ov = 0.35, w = (9.3 + ov * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.35 + i * (w - ov); link(s, x, y + (i % 2 ? 0.25 : 0), w, h - 0.25, i); draw(i, x + 0.45, y + 0.5 + (i % 2 ? 0.25 : 0), w - 0.9, h - 1.05); } };
  const vChain = (s, n, draw) => { const ov = 0.18, h = (3.95 + ov * (n - 1)) / n; for (let i = 0; i < n; i++) { const y = 1.15 + i * (h - ov), x = 0.6 + (i % 2) * 0.35; link(s, x, y, 8.6, h, i); draw(i, x + 0.4, y + 0.12, 7.8, h - 0.24); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.2, 0.75, { max: 26, min: 14, color: C.ink, bold: false, italic: true }); k.txt(s, String(k.idx), 8.9, 0.25, 0.7, 0.75, { size: 20, font: F.head, color: C.gold, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); for (let i = 0; i < 7; i++) link(s, 0.2 + i * 1.35, 0.35 + (i % 2) * 0.1, 1.7, 0.75, i); t.line(s, 6.95, 1.1, 0, 0.6, C.gold, 3); if (d.image) { t.oval(s, 5.65, 1.7, 2.6, 2.6, null, { line: { color: C.gold, width: 9 } }); await k.photo(s, d.image, 5.8, 1.85, 2.3, 2.3, { mask: 'circle' }); }
      k.txt(s, k.org3, 0.5, 1.5, 5.0, 0.35, { size: 12, bold: true, color: C.gold }); k.head(s, d.title, 0.5, 1.9, 5.0, 2.0, { max: 34, min: 16, color: C.ink, italic: true, bold: false, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.95, 4.9, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.55, 4.9, 0.45, { size: 15, bold: true, color: C.gold2 }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); },
    async intro(d) { const s = page(d); link(s, 0.35, 1.2, 4.0, 3.9, 0); await k.photo(s, d.image, 0.65, 1.5, 3.4, 3.3, { mask: { r: 0.6 } }); link(s, 4.0, 1.4, 5.6, 3.5, 1); k.txt(s, d.text, 4.45, 1.7, 4.7, 2.9, { max: 14, min: 9.5, color: C.ink, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); vChain(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}.  ${d.items[i]}`, x, y, w, h, { max: 16, color: C.ink, bold: false })); },
    async cards(d) { const s = page(d); hChain(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 14, color: C.gold2, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.52, { max: 12, color: C.ink, align: 'center' }); }); },
    async process(d) { const s = page(d); hChain(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.5, { max: 14, color: C.gold2, align: 'center' }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.52, { max: 12, color: C.ink, align: 'center' }); }); },
    async stats(d) { const s = page(d); hChain(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y + 0.1, w, 1.0, { max: 40, min: 16, color: C.gold2, align: 'center' }); k.txt(s, d.stats[i].label, x, y + 1.15, w, h - 1.15, { max: 12, color: C.ink, align: 'center' }); }, 1.15, d.note ? 3.35 : 3.8); if (d.note) k.txt(s, d.note, 0.4, 4.6, 9.2, 0.55, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), w = 4.0, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.6, F.body, 0.08, 2.45); hChain(s, 2, (i, x, y, ww, h) => { const sd = i ? d.right : d.left; k.head(s, sd.h, x, y, ww, 0.45, { max: 15, color: C.gold2, align: 'center' }); let yy = y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, x + 0.1, yy, ww - 0.2, rr[j], { size: fs, color: C.ink }); yy += rr[j]; }); }); void w; },
    async statement(d) { const s = page(d); link(s, 0.8, 1.3, 8.4, 2.6, 0); k.head(s, L.runs(d.text), 1.3, 1.5, 7.4, 2.2, { max: 28, min: 14, color: C.ink, align: 'center', italic: true, bold: false }); if (d.caption) k.txt(s, d.caption, 0.8, 4.05, 8.4, 1.1, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); hChain(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.5, { max: 20, min: 11, color: C.gold2, align: 'center' }); k.head(s, d.items[i].h, x, y + 0.52, w, 0.42, { max: 13, color: C.ink, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.96, w, h - 0.96, { max: 11, color: C.muted, align: 'center' }); }); },
    async quote(d) { const s = page({}); link(s, 0.8, 1.1, 8.4, 3.2, 1); k.head(s, `\u201C${d.text}\u201D`, 1.3, 1.35, 7.4, 2.3, { max: 26, min: 13, italic: true, bold: false, color: C.ink, align: 'center' }); if (d.author) k.txt(s, d.author, 1.3, 3.65, 7.4, 0.4, { size: 13, bold: true, color: C.gold, align: 'center' }); },
    async sources(d) { const s = page(d); vChain(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all forged in the same gold: a deck's pages must not look alike (L.pages)
  const NAVY = C.bg, PLATE = '1B2E47', CREAM = C.ink, GOLD = C.gold, GL = C.gold2;
  const chain = async (s, x, y, len, vert = false, col = GOLD) => { const n = Math.round(len * 100), th = 24, p = 26; let g = ''; for (let a = 2, i = 0; a < n - 30; a += p, i++) g += i % 2 ? (vert ? `<rect x="${th / 2 - 2.5}" y="${a}" width="5" height="34" rx="2.5" fill="#${col}"/>` : `<rect x="${a}" y="${th / 2 - 2.5}" width="34" height="5" rx="2.5" fill="#${col}"/>`) : (vert ? `<rect x="3" y="${a}" width="18" height="34" rx="9" fill="none" stroke="#${col}" stroke-width="4"/>` : `<rect x="${a}" y="3" width="34" height="18" rx="9" fill="none" stroke="#${col}" stroke-width="4"/>`); const W = vert ? th : n, H = vert ? n : th; t.img(s, await k.svg(`ch${n}${vert}${col}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${g}</svg>`, W, H), vert ? x - 0.12 : x, vert ? y : y - 0.12, vert ? 0.24 : len, vert ? len : 0.24); };
  const ring = (s, x, y, dd, fill = null, col = GOLD, wt = 6) => t.oval(s, x, y, dd, dd, fill, { line: { color: col, width: wt }, name: 'Ring' });
  const poly = async (s, pts, fill, x, y, w, h) => { const W = Math.round(w * 100), H = Math.round(h * 100); t.img(s, await k.svg(`pl${pts}${fill}${W}x${H}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${pts.map(([a, b]) => `${a * W},${b * H}`).join(' ')}" fill="#${fill}"/></svg>`, W, H), x, y, w, h); };
  const pg = (d, o = {}) => { const s = k.slide(o.bg || NAVY), ink = o.ink || CREAM; if (d.title) k.head(s, d.title, o.x ?? 0.4, o.y ?? 0.22, o.w ?? 8.2, o.h ?? 0.75, { max: o.max ?? 25, min: 13, color: ink, bold: false, italic: true }); k.txt(s, String(k.idx), o.nx ?? 8.9, 0.25, 0.7, 0.6, { size: 18, font: F.head, color: o.num || GOLD, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.4, y: 5.32, w: o.fw ?? 9.2, size: 7.5, color: o.foot || C.muted }); return s; };
  const gold = (d, o = {}) => pg(d, { bg: GOLD, ink: NAVY, num: NAVY, foot: NAVY, ...o });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, ls: 1.18, color: CREAM, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, bold: false, italic: true, color: GL, ...o });
  const num = (s, v, x, y, w, h, o = {}) => k.txt(s, String(v), x, y, w, h, { size: 17, font: F.head, italic: true, color: GL, align: 'center', valign: 'middle', ls: 1, ...o });
  const V = {
    image: [
      async (d) => { // the picture hangs as a locket on a chain from the top edge
        const s = pg(d, { w: 4.5, h: 1.05 , fw: 4.6, max: 24 }), dd = 3.85, x = 5.3, y = 1.05;
        await chain(s, x + dd / 2, 0, y + 0.02, true);
        ring(s, x - 0.1, y - 0.1, dd + 0.2, NAVY, GL, 9);
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle' });
        bd(s, d.text, 0.4, 1.4, 4.55, 3.8, { valign: 'middle', ls: 1.28 , max: 15 });
      },
      async (d) => { // the picture across the page, one heavy chain closes it off above the words
        const s = pg({}, {}), h = 2.85;
        await k.photo(s, d.image, 0, 0, 10, h);
        await chain(s, 0, h, 10, false, GL);
        k.head(s, d.title || '', 0.4, h + 0.17, 8.3, 0.55, { max: 22, min: 13, color: CREAM, bold: false, italic: true });
        k.txt(s, String(k.idx), 8.9, h + 0.17, 0.7, 0.55, { size: 18, font: F.head, color: GOLD, align: 'right', valign: 'middle' });
        bd(s, d.text, 0.4, h + 0.75, 9.2, 1.65, { valign: 'middle' });
      },
      async (d) => { // a full-height strip of picture at the right edge, a chain runs down its side
        const s = pg(d, { w: 5.7, h: 0.95, nx: 5.5, fw: 5.8 }), x = 6.65;
        await k.photo(s, d.image, x, 0, 10 - x, 5.625);
        t.rect(s, x - 0.09, 0, 0.18, 5.625, NAVY, { name: 'Edge' });
        await chain(s, x, 0, 5.625, true, GL);
        t.line(s, 0.4, 1.28, 2.2, 0, GOLD, 1.5);
        bd(s, d.text, 0.4, 1.42, 5.8, 3.78, { valign: 'middle', ls: 1.28, max: 15 });
      },
      async (d) => { // gold page: the picture is a cut stone, words engraved in navy
        const s = gold(d, { x: 5.0, w: 3.75, h: 1.05, fx: 5.0, fw: 4.6 }), oct = [[0.29, 0], [0.71, 0], [1, 0.29], [1, 0.71], [0.71, 1], [0.29, 1], [0, 0.71], [0, 0.29]];
        await poly(s, oct, NAVY, 0.25, 0.55, 4.5, 4.5);
        await k.photo(s, d.image, 0.37, 0.67, 4.26, 4.26, { mask: { poly: oct } });
        bd(s, d.text, 5.0, 1.4, 4.6, 3.8, { color: NAVY, valign: 'middle', ls: 1.28, max: 15 });
      },
    ],
    cards: [
      async (d) => { // medallions threaded on one chain, an idea under each
        const s = pg(d), n = d.items.length, w = 9.2 / n, dd = 0.95, y = 1.15;
        await chain(s, 0, y + dd / 2, 10);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, c = x + w / 2;
          ring(s, c - dd / 2, y, dd, NAVY, GL, 5);
          t.img(s, await k.icon(it.icon, GL, 1.75), c - 0.22, y + dd / 2 - 0.22, 0.44, 0.44);
          hd(s, it.h, x + 0.08, y + dd + 0.1, w - 0.16, 0.58, { align: 'center' });
          bd(s, it.t, x + 0.08, y + dd + 0.72, w - 0.16, 5.2 - y - dd - 0.72, { align: 'center', max: 13 });
        }
      },
      async (d) => { // engraved plates with a rivet at each corner
        const s = pg(d), n = d.items.length, W = 4.5, H = 1.95, boxes = n === 4 ? [[0.4, 1.12], [5.1, 1.12], [0.4, 3.2], [5.1, 3.2]] : [[0.4, 1.12], [5.1, 1.12], [0.4, 3.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = boxes[i], w = n === 3 && i === 2 ? 9.2 : W;
          t.rect(s, x, y, w, H, PLATE, { line: { color: GOLD, width: 1 }, name: 'Plate' });
          [[x + 0.07, y + 0.07], [x + w - 0.17, y + 0.07], [x + 0.07, y + H - 0.17], [x + w - 0.17, y + H - 0.17]].forEach(([a, b]) => t.oval(s, a, b, 0.1, 0.1, GOLD));
          t.img(s, await k.icon(it.icon, GL, 1.75), x + 0.25, y + 0.2, 0.42, 0.42);
          hd(s, it.h, x + 0.8, y + 0.15, w - 1.05, 0.52);
          bd(s, it.t, x + 0.25, y + 0.72, w - 0.5, H - 0.85, { max: 13 });
        }
      },
      async (d) => { // tags of cream card hang from a bar, each on its own length of chain
        const s = pg(d), n = d.items.length, gap = 0.2, w = (9.2 - gap * (n - 1)) / n, drop = [0.15, 0.5, 0.25, 0.6];
        t.rect(s, 0.2, 1.0, 9.6, 0.06, GL, { name: 'Bar' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap), y = 1.05 + drop[i] + 0.18, c = x + w / 2;
          await chain(s, c, 1.05, drop[i] + 0.3, true);
          t.rect(s, x, y, w, 5.2 - y, CREAM, { name: 'Tag' });
          t.oval(s, c - 0.09, y + 0.1, 0.18, 0.18, NAVY);
          t.img(s, await k.icon(it.icon, '8C6D2C', 2), x + 0.12, y + 0.1, 0.32, 0.32);
          hd(s, it.h, x + 0.14, y + 0.42, w - 0.28, 0.54, { color: NAVY, max: 14, valign: 'top' });
          bd(s, it.t, x + 0.14, y + 0.98, w - 0.28, 5.16 - y - 0.98, { color: NAVY, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // a gold slab with the title at the left, the ideas listed beside it along a chain
        const s = pg({}, { fx: 3.75, fw: 5.85, nx: 8.9 }), n = d.items.length, rh = 4.8 / n, x = 3.75;
        t.rect(s, 0, 0, 3.2, 5.625, GOLD, { name: 'Slab' });
        k.head(s, d.title || '', 0.35, 0.45, 2.55, 3.0, { max: 28, min: 15, color: NAVY, bold: false, italic: true, valign: 'top' });
        await chain(s, 3.2, 0, 5.625, true, GL);
        for (const [i, it] of d.items.entries()) {
          const y = 0.4 + i * rh;
          t.img(s, await k.icon(it.icon, GL, 1.75), x, y + 0.03, 0.4, 0.4);
          hd(s, it.h, x + 0.52, y, 4.5, 0.46);
          bd(s, it.t, x + 0.52, y + 0.46, 5.3, rh - 0.54, { max: 13, ls: 1.12 });
        }
      },
    ],
    process: [
      async (d) => { // links climb to the right as a stair, each step's words under its link
        const s = pg(d, { h: 0.7 }), n = d.steps.length, w = 9.2 / n, rise = n === 4 ? 0.34 : 0.48, y0 = 1.1 + (n - 1) * rise, lk = [w - 0.5, 0.5];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, y = y0 - i * rise;
          if (i < n - 1) t.line(s, x + lk[0], y - rise + 0.25, 0.55, rise, GOLD, 3, { flipV: true });
          t.rect(s, x, y, lk[0], lk[1], PLATE, { r: 0.25, line: { color: i % 2 ? GOLD : GL, width: 5 }, name: 'Link' });
          hd(s, `${i + 1}`, x, y, lk[0], lk[1], { align: 'center', max: 18 });
          hd(s, st.h, x, y + 0.6, w - 0.18, 0.56, { valign: 'top', max: 15 });
          bd(s, st.t, x, y + 1.16, w - 0.18, 5.2 - y - 1.16, { max: 13, ls: 1.12 });
        }
      },
      async (d) => { // the chain as a spine down the page, steps fall left and right of it
        const s = pg(d), n = d.steps.length, rh = 4.1 / n, w = 4.1, mk = Math.min(0.62, rh - 0.14);
        await chain(s, 5, 1.05, 4.15, true);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.08 + i * rh, right = i % 2 === 1, x = right ? 5.5 : 0.4, a = right ? 'left' : 'right';
          ring(s, 5 - mk / 2, y + (rh - mk) / 2, mk, NAVY, GL, 4);
          num(s, i + 1, 5 - mk / 2, y + (rh - mk) / 2, mk, mk);
          hd(s, st.h, x, y + 0.02, w, 0.36, { align: a, max: 15 });
          bd(s, st.t, x, y + 0.38, w, rh - 0.42, { align: a, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // one great ring with stations on it, the steps stand around it in turn
        const s = pg(d), n = d.steps.length, dd = 2.5, cx = 5, cy = 3.2, W = 2.9, H = 1.9;
        ring(s, cx - dd / 2, cy - dd / 2, dd, PLATE, GOLD, 9);
        ring(s, cx - dd / 2 + 0.2, cy - dd / 2 + 0.2, dd - 0.4, null, GL, 1);
        const pos = n === 4 ? [[0.4, 1.15, 0, -0.71, -0.71], [6.7, 1.15, 1, 0.71, -0.71], [6.7, 3.25, 1, 0.71, 0.71], [0.4, 3.25, 0, -0.71, 0.71]] : [[0.4, 1.15, 0, -0.71, -0.71], [6.7, 2.2, 1, 1, 0], [0.4, 3.25, 0, -0.71, 0.71]];
        for (const [i, st] of d.steps.entries()) {
          const [x, y, right, ax, ay] = pos[i], a = right ? 'left' : 'right', mx = cx + ax * dd / 2 - 0.27, my = cy + ay * dd / 2 - 0.27;
          t.oval(s, mx, my, 0.54, 0.54, GL);
          num(s, i + 1, mx, my, 0.54, 0.54, { color: NAVY, bold: true, italic: false, size: 16 });
          hd(s, st.h, x, y, W, 0.5, { align: a });
          bd(s, st.t, x, y + 0.52, W, H - 0.54, { align: a, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // gold page: words above, below them one navy chain of numbered links
        const s = gold(d), n = d.steps.length, ov = 0.28, w = (9.2 + ov * (n - 1)) / n, cw = 9.2 / n, y = 4.1;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * cw, lx = 0.4 + i * (w - ov);
          t.rect(s, lx, y + (i % 2 ? 0.1 : 0), w, 0.92, null, { r: 0.46, line: { color: NAVY, width: 8 }, name: 'Link' });
          num(s, i + 1, lx, y + (i % 2 ? 0.1 : 0), w, 0.92, { color: NAVY, size: 26 });
          hd(s, st.h, x + 0.05, 1.08, cw - 0.25, 0.58, { color: NAVY, valign: 'top', bold: true });
          bd(s, st.t, x + 0.05, 1.68, cw - 0.25, 2.3, { color: NAVY, max: 13.5 });
        }
      },
    ],
    stats: [
      async (d) => { // the first figure stands inside one great ring, the two others on the links beside it
        const s = pg(d), [a, ...rest] = d.stats, dd = 3.85, x = 0.45, y = 1.2;
        ring(s, x, y, dd, PLATE, GL, 10);
        hd(s, a.value, x + 0.4, y + 0.75, dd - 0.8, 1.15, { max: 50, min: 24, align: 'center' });
        bd(s, a.label, x + 0.6, y + 1.95, dd - 1.2, 0.95, { align: 'center', max: 13, ls: 1.1 });
        await chain(s, x + dd, y + dd / 2, 0.5);
        rest.forEach((v, i) => { const yy = 1.2 + i * 1.1; hd(s, v.value, 4.95, yy, 2.0, 1.0, { max: 32, min: 16 }); bd(s, v.label, 7.05, yy, 2.55, 1.0, { valign: 'middle', max: 13 }); t.line(s, 4.95, yy + 1.04, 4.65, 0, GOLD, 0.75); });
        if (d.note) bd(s, d.note, 4.95, 3.5, 4.65, 1.7, { color: C.muted, italic: true, valign: 'middle', max: 13 });
      },
      async (d) => { // gold page: figures in a ruled ledger, the value to the right of its words
        const s = gold(d);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.08 + i * 1.04;
          t.rect(s, 0.4, y, 9.2, 0.03, NAVY, { name: 'Rule' });
          bd(s, v.label, 0.4, y + 0.08, 5.5, 0.88, { color: NAVY, valign: 'middle', max: 15 });
          hd(s, v.value, 6.0, y + 0.06, 3.6, 0.92, { color: NAVY, max: 46, min: 22, align: 'right' });
        }
        t.rect(s, 0.4, 4.2, 9.2, 0.03, NAVY, { name: 'Rule' });
        if (d.note) bd(s, d.note, 0.4, 4.26, 9.2, 0.98, { color: NAVY, italic: true, valign: 'middle', max: 13 });
      },
      async (d) => { // three gold ingots stacked in a pyramid, the note beside them
        const s = pg(d), bar = [[0.07, 0], [0.93, 0], [1, 1], [0, 1]], W = 3.2, H = 1.92, pos = [[5.0, 1.12], [3.3, 3.2], [6.55, 3.2]];
        for (const [i, v] of d.stats.entries()) {
          const [x, y] = pos[i];
          await poly(s, bar, i === 0 ? GL : GOLD, x, y, W, H);
          hd(s, v.value, x + 0.3, y + 0.08, W - 0.6, 0.92, { color: NAVY, max: 36, min: 18, align: 'center' });
          bd(s, v.label, x + 0.28, y + 1.0, W - 0.56, 0.86, { color: NAVY, align: 'center', max: 12, ls: 1.1 });
        }
        if (d.note) bd(s, d.note, 0.4, 1.2, 2.65, 3.9, { valign: 'middle', italic: true, max: 13.5 });
      },
    ],
    compare: [
      async (d) => { // the chain divides the page, the two sides read away from it
        const s = pg(d);
        await chain(s, 5, 1.05, 4.15, true, GL);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', rh = 3.3 / sd.items.length;
          hd(s, sd.h, x, 1.1, w, 0.6, { align: a, max: 20 });
          sd.items.forEach((it, j) => { const y = 1.8 + j * rh; bd(s, it, x, y, w, rh - 0.05, { align: a, valign: 'middle', max: 13.5 }); t.oval(s, i ? 5.13 : 4.77, y + rh / 2 - 0.08, 0.1, 0.1, GL); });
        }
      },
      async (d) => { // one gold band over one dark band, a chain holds them together
        const s = pg(d, { h: 0.68 });
        t.rect(s, 0, 1.0, 10, 2.08, GOLD, { name: 'Band' }); t.rect(s, 0, 3.08, 10, 2.14, PLATE, { name: 'Band' });
        await chain(s, 0, 3.08, 10, false, GL);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.22 : 1.06, h = 1.92, ink = i ? CREAM : NAVY, m = sd.items.length, per = 2, rw = 3.5, rows = Math.ceil(m / per), rh = h / rows;
          hd(s, sd.h, 0.4, y, 2.05, h, { color: i ? GL : NAVY, max: 20, min: 12, bold: !i });
          sd.items.forEach((it, j) => bd(s, it, 2.6 + (j % per) * (rw + 0.1), y + Math.floor(j / per) * rh, rw, rh - 0.04, { color: ink, valign: 'middle', max: 13, ls: 1.1 }));
        }
      },
    ],
    statement: [
      async (d) => { // the whole page is gold, the thought in large navy italic, a chain along the foot of it
        const s = gold(d, { max: 18, h: 0.55 });
        k.head(s, L.runs(d.text), 0.6, 0.85, 8.8, 2.65, { max: 34, min: 17, color: NAVY, bold: false, italic: true, align: 'center' });
        await chain(s, 2, 3.62, 6, false, NAVY);
        if (d.caption) bd(s, d.caption, 0.8, 3.8, 8.4, 1.42, { color: NAVY, align: 'center', valign: 'middle', max: 13.5 });
      },
      async (d) => { // the clasp: a thought beside a closed ring with a chain running from it to the edge
        const s = pg(d, { max: 18, h: 0.55 }), dd = 2.2;
        await chain(s, 7.2 + dd - 0.05, 2.25, 0.85, false, GL);
        ring(s, 7.2, 1.15, dd, PLATE, GL, 12);
        ring(s, 7.2 + 0.72, 1.15 + 0.72, dd - 1.44, NAVY, GOLD, 4);
        k.head(s, L.runs(d.text), 0.4, 0.92, 6.5, 2.7, { max: 30, min: 16, color: CREAM, bold: false, italic: true });
        if (d.caption) { t.line(s, 0.4, 3.72, 9.2, 0, GOLD, 1); bd(s, d.caption, 0.4, 3.82, 9.2, 1.4, { color: C.muted, max: 13.5 }); }
      },
    ],
    timeline: [
      async (d) => { // a chain across the page, the years hang above and below it by turns
        const s = pg(d, { h: 0.72 }), ax = 3.16, xs = [0.4, 2.55, 4.65, 6.5], w = 3.1;
        await chain(s, 0, ax, 10);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? 1.0 : ax + 0.42;
          ring(s, x, ax - 0.18, 0.36, NAVY, GL, 3);
          t.line(s, x + 0.18, up ? ax - 0.42 : ax + 0.18, 0, 0.24, GOLD, 1.5);
          k.txt(s, [{ text: `${it.year}  `, options: { color: GL } }, { text: it.h, options: { color: CREAM } }], x, y, w, 0.38, { font: F.head, italic: true, max: 14, min: 10, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x, y + 0.4, w - 0.1, up ? ax - 0.42 - y - 0.42 : 1.22, { max: 12, ls: 1.12 });
        }
      },
      async (d) => { // a chain down the left, one link with its year on it for each row
        const s = pg(d, { x: 2.65, w: 6.0, fx: 2.65, fw: 6.95 }), rh = 4.1 / 4, cx = 0.95;
        await chain(s, cx, 0, 5.625, true);
        for (const [i, it] of d.items.entries()) {
          const y = 1.08 + i * rh;
          t.rect(s, 0.25, y + 0.14, 1.4 + 0.75, rh - 0.28, PLATE, { r: 0.28, line: { color: GL, width: 4 }, name: 'Link' });
          hd(s, it.year, 0.4, y + 0.14, 1.85, rh - 0.28, { align: 'center', max: 15, min: 10 });
          hd(s, it.h, 2.65, y + 0.03, 6.9, 0.36, { color: CREAM, max: 15 });
          bd(s, it.t, 2.65, y + 0.4, 6.95, rh - 0.44, { max: 12.5, ls: 1.1, color: C.muted });
        }
      },
      async (d) => { // gold page, four periods in quarters about a small ring at the centre
        const s = gold(d, { h: 0.72 }), cx = 5, cy = 3.15, W = 4.25;
        t.line(s, 0.4, cy, 9.2, 0, NAVY, 1.5); t.line(s, cx, 1.05, 0, 4.15, NAVY, 1.5);
        ring(s, cx - 0.2, cy - 0.2, 0.4, GOLD, NAVY, 5);
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? 5.35 : 0.4, y = i < 2 ? 1.08 : 3.27;
          hd(s, it.year, x, y, 1.75, 0.55, { color: NAVY, max: 22, min: 12 });
          hd(s, it.h, x + 1.8, y, W - 1.8, 0.55, { color: NAVY, bold: true, max: 14 });
          bd(s, it.t, x, y + 0.58, W, 1.36, { color: NAVY, max: 13, ls: 1.12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old chain of tall links was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Zanjir', colors: { dk1: C.dark, lt1: C.ink, dk2: '1B2E47', lt2: C.muted, accent1: C.gold, accent2: C.gold2, accent3: '8C6D2C', accent4: '5B8DB8', accent5: C.muted, accent6: 'FFF4C2', hlink: C.gold2, folHlink: C.muted } });
}
module.exports = { id: 139, slug: 'zanjir', name: 'Zanjir', category: 'luxury', photos: true, build, style: { tone: "uzviylik: har bir bo'g'in oldingisiga bog'langan; izchil, mustahkam mantiq", limits: { card_t4: 90, card_t3: 120, step_t: 90, event_t: 80 }, prefer: null } };
