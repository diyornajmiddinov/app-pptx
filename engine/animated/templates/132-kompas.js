/**
 * 132 Kompas — a compass rose in the middle of the slide; ideas are placed at the cardinal (and intercardinal)
 * directions around it, marked ↑ → ↓ ←. Classic red-and-black needle on warm white, teal accents.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FBF8F3', ink: '1A1A1A', muted: '5E5A54', red: 'C8102E', teal: '0F766E', ring: 'B9B2A6' };
const F = { head: 'Georgia', body: 'Calibri' };
const CX = 5.0, CY = 3.1;
const rose = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><g transform="translate(200 200)"><circle r="190" fill="none" stroke="#B9B2A6" stroke-width="3"/><circle r="160" fill="none" stroke="#B9B2A6" stroke-width="1.5"/>
  ${Array.from({ length: 72 }, (_, i) => `<line x1="0" y1="-190" x2="0" y2="${i % 6 ? -180 : -170}" stroke="#8C857A" stroke-width="2" transform="rotate(${i * 5})"/>`).join('')}
  <polygon points="0,-150 18,-18 0,0 -18,-18" fill="#C8102E"/><polygon points="0,150 18,18 0,0 -18,18" fill="#1A1A1A"/><polygon points="150,0 18,18 0,0 18,-18" fill="#1A1A1A"/><polygon points="-150,0 -18,18 0,0 -18,-18" fill="#1A1A1A"/>
  <polygon points="0,-150 -18,-18 0,0" fill="#8F0B20"/><g transform="rotate(45)" opacity="0.55"><polygon points="0,-100 12,-12 0,0 -12,-12" fill="#0F766E"/><polygon points="0,100 12,12 0,0 -12,12" fill="#0F766E"/><polygon points="100,0 12,12 0,0 12,-12" fill="#0F766E"/><polygon points="-100,0 -12,12 0,0 -12,-12" fill="#0F766E"/></g><circle r="10" fill="#FBF8F3" stroke="#1A1A1A" stroke-width="3"/></g></svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const drawRose = async (s, cx = CX, cy = CY, d = 1.6) => t.img(s, await k.svg('rose', rose, 400, 400), cx - d / 2, cy - d / 2, d, d);
  // direction slots: N, E, S, W (4); N, SE, SW (3); 6 around (NW, N, NE, SW, S, SE)
  const SL = { N: [2.2, 0.95, 5.6, 1.25, 'center', '\u2191'], S: [2.2, 3.9, 5.6, 1.3, 'center', '\u2193'], E: [5.95, 2.2, 3.65, 1.65, 'left', '\u2192'], W: [0.4, 2.2, 3.65, 1.65, 'right', '\u2190'],
    NW: [0.4, 0.95, 3.55, 1.25, 'right', '\u2196'], NE: [6.05, 0.95, 3.55, 1.25, 'left', '\u2197'], SW: [0.4, 3.9, 3.55, 1.3, 'right', '\u2199'], SE: [6.05, 3.9, 3.55, 1.3, 'left', '\u2198'] };
  const order = (n) => (n <= 2 ? ['W', 'E'] : n === 3 ? ['N', 'SE', 'SW'] : n === 4 ? ['N', 'E', 'S', 'W'] : ['NW', 'NE', 'E', 'SE', 'SW', 'W'].slice(0, n));
  const around = async (s, n, draw) => { await drawRose(s); order(n).forEach((key, i) => { const [x, y, w, h, al, arrow] = SL[key]; k.txt(s, arrow, al === 'right' ? x + w - 0.35 : al === 'left' ? x : x + w / 2 - 0.17, y - 0.02, 0.35, 0.35, { size: 15, bold: true, color: i % 2 ? C.teal : C.red, align: 'center' }); draw(i, al === 'center' ? x : al === 'left' ? x + 0.4 : x, y, al === 'center' ? w : w - 0.4, h, al); }); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.22, 7.6, 0.6, { max: 22, min: 12, italic: true }); k.txt(s, `${k.idx}\u00B0`, 8.6, 0.22, 1.0, 0.6, { size: 18, bold: true, color: C.red, align: 'right', valign: 'middle', font: F.head }); t.line(s, 0.4, 0.86, 9.2, 0, C.ring, 0.75); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await drawRose(s, 7.3, 2.8, 4.2); if (d.image) await k.photo(s, d.image, 6.4, 1.9, 1.8, 1.8, { mask: 'circle' });
      k.txt(s, k.org3, 0.5, 0.6, 4.6, 0.35, { size: 12, bold: true, color: C.teal }); k.head(s, d.title, 0.5, 1.0, 4.6, 2.4, { max: 36, min: 18, italic: true, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.5, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.5, 0.45, { size: 15, bold: true, color: C.red }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.2, 3.5, 3.5, { mask: 'circle' }); await drawRose(s, 3.75, 4.35, 1.3); k.txt(s, d.text, 4.6, 1.1, 5.0, 4.0, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y + 0.3, w, h - 0.3, { max: 15, align: al, valign: 'top' })); },
    async cards(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, d.items[i].h, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.items[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async process(d) { const s = page(d); await around(s, d.steps.length, (i, x, y, w, h, al) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.steps[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async stats(d) { const s = page(d); await around(s, d.stats.length, (i, x, y, w, h, al) => { k.head(s, d.stats[i].value, x, y + 0.25, w, 0.65, { max: 34, min: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.stats[i].label, x, y + 0.9, w, h - 0.9, { max: 12, align: al }); }); if (d.note) k.txt(s, d.note, 6.6, 4.5, 3.0, 0.65, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await drawRose(s, CX, CY, 1.4); const w = 3.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, 3.4);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.95 : 0.45, al = i ? 'left' : 'right'; k.head(s, `${i ? '' : '\u2190 '}${sd.h}${i ? ' \u2192' : ''}`, x, 1.05, w, 0.45, { max: 16, align: al, color: i ? C.teal : C.red }); let y = 1.6; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await drawRose(s, CX, 3.75, 1.4); k.head(s, L.runs(d.text), 0.6, 0.95, 8.8, 1.9, { max: 28, min: 14, italic: true, align: 'center' }); if (d.caption) { k.txt(s, d.caption, 0.4, 3.0, 3.6, 2.1, { max: 12, color: C.muted, align: 'right', valign: 'middle' }); } },
    async timeline(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.items[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async quote(d) { const s = page({}); await drawRose(s, 2.3, 3.0, 3.2); k.head(s, `\u201C${d.text}\u201D`, 4.3, 1.1, 5.3, 2.9, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.3, 4.1, 5.3, 0.45, { size: 14, bold: true, color: C.red }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.15 / n; d.items.forEach((it, i) => { const y = 1.0 + i * rh; k.txt(s, ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199'][i % 6], 0.4, y, 0.4, rh, { size: 14, bold: true, color: i % 2 ? C.teal : C.red, valign: 'middle' }); k.txt(s, it, 0.85, y, 8.75, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the navigator's chart: a deck's pages must not look alike (L.pages)
  const NIGHT = '0E2A3B', FOG = 'C4D3DC', GOLD = 'E9C46A', AQUA = '7FE3D4', HAIR = 'DDD6CA', LINE2 = '2A4A5E';
  const ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 11, ...o });
  const ring = async (s, cx, cy, dd, col = C.ring, o = {}) => { let g = `<circle cx="200" cy="200" r="192" fill="${o.fill ? '#' + o.fill : 'none'}" stroke="#${col}" stroke-width="3"/><circle cx="200" cy="200" r="160" fill="none" stroke="#${col}" stroke-width="1.5"/>`; for (let i = 0; i < 72; i++) g += `<line x1="200" y1="8" x2="200" y2="${i % 6 ? 20 : 34}" stroke="#${col}" stroke-width="2" transform="rotate(${i * 5} 200 200)"/>`; t.img(s, await k.svg(`ring${col}${o.fill || ''}`, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">${g}</svg>`, 400, 400), cx - dd / 2, cy - dd / 2, dd, dd); };
  const chartNet = async (s, col) => { let g = ''; for (let x = 125; x < 1000; x += 125) g += `<line x1="${x}" y1="0" x2="${x}" y2="563" stroke="#${col}" stroke-width="1"/>`; for (let y = 94; y < 563; y += 94) g += `<line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="#${col}" stroke-width="1"/>`; t.img(s, await k.svg('net' + col, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625); };
  const nightPage = async (d, o = {}) => { const s = k.slide(NIGHT), tb = o.title || {}; await chartNet(s, LINE2); if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.22, tb.w ?? 7.6, tb.h ?? 0.6, { max: tb.max ?? 22, min: 12, italic: true, color: 'FFFFFF' }); k.txt(s, `${k.idx}°`, 8.6, 0.22, 1.0, 0.6, { size: 18, bold: true, color: GOLD, align: 'right', valign: 'middle', font: F.head }); k.foot(s, { y: 5.32, size: 7.5, align: 'center', color: FOG }); return s; };
  const wp = (s, v, x, y, dd, f, ink = 'FFFFFF') => { t.oval(s, x, y, dd, dd, f); k.txt(s, String(v), x, y, dd, dd, { size: Math.round(dd * 34), bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const seg = (s, x1, y1, x2, y2, col, w = 1.5, dash = 'dash') => t.line(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), col, w, { ...(dash ? { dash } : {}), flipV: (x2 - x1) * (y2 - y1) < 0 });
  const needle = async (s, cx, cy, sz, deg, col) => t.img(s, await k.svg(`needle${deg}${col}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g transform="rotate(${deg} 100 100)"><polygon points="100,8 128,100 100,192 72,100" fill="#${col}" opacity="0.28"/><polygon points="100,8 128,100 72,100" fill="#${col}"/></g></svg>`, 200, 200), cx - sz / 2, cy - sz / 2, sz, sz);
  const V = {
    image: [
      async (d) => { // the picture as a strip of chart: meridians run over it, a small rose in its corner
        const s = page(d), py = 0.96, ph = 2.3;
        await k.photo(s, d.image, 0.4, py, 9.2, ph);
        for (let i = 1; i < 6; i++) t.line(s, 0.4 + i * 9.2 / 6, py, 0, ph, 'FFFFFF', 0.5, { dash: 'dash' });
        t.oval(s, 8.2, py + 0.14, 1.26, 1.26, C.bg); await drawRose(s, 8.83, py + 0.77, 1.16);
        bd(s, d.text, 0.4, py + ph + 0.1, 9.2, 5.26 - py - ph - 0.1, { max: 13, valign: 'middle', ls: 1.12 });
      },
      async (d) => { // the picture fills the page, a parchment card with a rose lies upon it
        const s = k.slide(NIGHT), px = 4.45, pw = 5.15;
        await k.photo(s, d.image, 0, 0, 10, 5.27);
        t.rect(s, 0, 5.27, 10, 0.355, NIGHT, { name: 'Band' });
        t.rect(s, px, 0.35, pw, 4.6, C.bg, { shadow: 0.35, line: { color: C.ring, width: 0.75 }, name: 'Card' });
        k.head(s, d.title || '', px + 0.22, 0.42, pw - 1.3, 0.96, { max: 20, min: 12, italic: true });
        k.txt(s, `${k.idx}°`, px + pw - 1.02, 0.42, 0.85, 0.5, { size: 16, bold: true, color: C.red, align: 'right', valign: 'middle', font: F.head });
        t.line(s, px + 0.22, 1.42, pw - 0.44, 0, C.ring, 0.75);
        bd(s, d.text, px + 0.22, 1.5, pw - 0.44, 3.38, { max: 13.5 });
        await drawRose(s, 0.95, 4.45, 1.1);
        k.foot(s, { y: 5.35, size: 7.5, align: 'center', color: FOG });
      },
      async (d) => { // the picture cut to the four points of the rose, a graduated ring round it
        const s = page(d), D = 4.5, cx = 7.3, cy = 3.08, a = 0.36, b = 0.64;
        await ring(s, cx, cy, D);
        const inner = 3.9;
        t.img(s, await L.photo(L.src(d.image), inner, inner, { mask: { poly: [[0.5, 0], [b, a], [1, 0.5], [b, b], [0.5, 1], [a, b], [0, 0.5], [a, a]] } }), cx - inner / 2, cy - inner / 2, inner, inner, { alt: '' });
        bd(s, d.text, 0.4, 1.0, 4.5, 4.2, { max: 14, ls: 1.22, valign: 'middle' });
      },
      async (d) => { // night: half a great ring rises at the page's right edge, the picture inside it
        const s = await nightPage(d, { title: { w: 5.0, h: 0.92 } }), H0 = 5.625, W0 = H0 / 2, x = 10 - W0;
        await ring(s, 10, H0 / 2, H0 + 0.3, GOLD);
        const r = 2.45;
        t.img(s, await L.photo(L.src(d.image), r, 2 * r, { mask: { path: 'M1,0 A1,0.5 0 0 0 1,1 Z' } }), 10 - r, H0 / 2 - r, r, 2 * r, { alt: '' });
        bd(s, d.text, 0.4, 1.2, 6.2, 3.98, { max: 14, color: 'FFFFFF', ls: 1.22, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a log of bearings: each idea has its own direction, an arrow in a small ring at the line's head
        const s = page(d), n = d.items.length, y0 = 0.96, rh = (5.2 - y0) / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, c = i % 2 ? C.teal : C.red;
          if (i) t.line(s, 0.4, y, 9.2, 0, HAIR, 0.75);
          await ring(s, 0.82, y + rh / 2, 0.76, c);
          await needle(s, 0.82, y + rh / 2, 0.58, 45 + i * 90, c);
          t.img(s, await k.icon(it.icon, c, 2), 1.4, y + 0.1, 0.32, 0.32);
          hd(s, it.h, 1.8, y + 0.06, 7.8, 0.38, { color: c, max: 15 });
          bd(s, it.t, 1.4, y + 0.46, 8.2, rh - 0.5, { max: 13.5 });
        }
      },
      async (d) => { // a voyage on the chart: a dashed course joins the ports, each idea anchored at its own
        const s = page(d), n = d.items.length, w = 9.2 / n, drop = n === 4 ? [0.5, 0, 0.42, 0.08] : [0.42, 0, 0.3], dd = 0.56, y0 = 1.02;
        const pts = d.items.map((_, i) => [0.4 + i * w + w / 2, y0 + drop[i] + dd / 2]);
        for (let i = 0; i < n - 1; i++) seg(s, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], C.red, 1.75);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, y = y0 + drop[i], c = i % 2 ? C.teal : C.red;
          t.oval(s, x + w / 2 - dd / 2, y, dd, dd, c); t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + w / 2 - 0.15, y + 0.13, 0.3, 0.3);
          hd(s, it.h, x + 0.06, y + dd + 0.06, w - 0.14, 0.56, { align: 'center', color: c, valign: 'top' });
          bd(s, it.t, x + 0.06, y + dd + 0.64, w - 0.14, 5.22 - y - dd - 0.64, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // night: half a rose at the left edge, the ideas sit along the curve of its ring
        const s = await nightPage(d), n = d.items.length, cy = 3.08, y0 = 0.96, rh = (5.2 - y0) / n, R0 = 2.2;
        await drawRose(s, 0.1, cy, 3.3); await ring(s, 0.1, cy, 4.4, GOLD);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, mid = y + rh / 2, dx = Math.sqrt(Math.max(0, R0 * R0 - (mid - cy) * (mid - cy))), x = 0.1 + dx + 0.28, c = i % 2 ? AQUA : GOLD, w = 9.6 - x - 0.5;
          t.img(s, await k.icon(it.icon, c, 2), x, y + 0.08, 0.36, 0.36);
          hd(s, it.h, x + 0.46, y + 0.06, w, 0.38, { color: c, max: 14.5 });
          bd(s, it.t, x + 0.46, y + 0.44, w, rh - 0.48, { color: 'FFFFFF', max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the four quarters of the horizon: axes cross the page, one idea to each quarter
        const s = page(d), n = d.items.length, cx = 5, cy = 3.05, w = 4.3, hh = 1.94, spots = [[0, 0], [1, 0], [0, 1], [1, 1]];
        t.line(s, 0.4, cy, 9.2, 0, C.ring, 1); t.line(s, cx, 0.96, 0, 4.24, C.ring, 1);
        if (n === 3) await drawRose(s, 7.3, 4.12, 1.92);
        for (const [i, it] of d.items.entries()) {
          const [sx, sy] = spots[i], x = sx ? cx + 0.15 : 0.4, y = 1.0 + sy * (cy - 1.0 + 0.04), c = i % 2 ? C.teal : C.red;
          await needle(s, sx ? x + w - 0.18 : x + 0.18, y + 0.18, 0.36, [315, 45, 225, 135][i], c);
          t.img(s, await k.icon(it.icon, c, 2), sx ? x : x + 0.4, y + 0.02, 0.32, 0.32);
          hd(s, it.h, sx ? x + 0.4 : x + 0.8, y, w - 1.2, 0.38, { color: c, max: 14.5 });
          bd(s, it.t, x, y + 0.42, w, hh - 0.46, { max: 13 });
        }
        t.oval(s, cx - 0.09, cy - 0.09, 0.18, 0.18, C.red);
      },
    ],
    process: [
      async (d) => { // the course bends over the page in a long arc, a numbered waypoint at each stage, words beneath
        const s = page(d), n = d.steps.length, w = 9.2 / n, dd = 0.56, P = 100;
        t.img(s, await k.svg('arc', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="130"><path d="M0,120 Q500,-60 1000,120" fill="none" stroke="#${C.red}" stroke-width="3" stroke-dasharray="10 10"/></svg>`, 1000, 130), 0, 0.95, 10, 1.3);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, c = x + w / 2, u = c / 10, y = 0.95 + (2 * u * (1 - u) * -60 + (u * u + (1 - u) * (1 - u)) * 120) / 100;
          wp(s, i + 1, c - dd / 2, y - dd / 2, dd, i % 2 ? C.teal : C.red);
          hd(s, st.h, x + 0.06, 2.3, w - 0.14, 0.56, { align: 'center', valign: 'top', color: i % 2 ? C.teal : C.red });
          bd(s, st.t, x + 0.06, 2.88, w - 0.14, 2.34, { align: 'center', max: 13 });
        }
      },
      async (d) => { // the bearing runs south-east: each stage a little further down and further on
        const s = page(d), n = d.steps.length, y0 = 0.98, rh = (5.2 - y0) / n, ind = n === 4 ? 0.82 : 1.1, dd = 0.46, x0 = 0.45;
        seg(s, x0 + dd / 2, y0 + dd / 2, x0 + dd / 2 + (n - 1) * ind, y0 + dd / 2 + (n - 1) * rh, C.teal, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const x = x0 + i * ind, y = y0 + i * rh, xx = x + dd + 0.16, ww = 9.6 - xx;
          wp(s, i + 1, x, y, dd, i % 2 ? C.teal : C.red);
          t.rect(s, xx - 0.02, y, ww + 0.02, rh - 0.02, C.bg, { name: 'Back' });
          hd(s, st.h, xx, y, ww, 0.34, { color: i % 2 ? C.teal : C.red });
          bd(s, st.t, xx, y + 0.36, ww, rh - 0.42, { max: 12.5, ls: 1.08 });
        }
        await drawRose(s, 1.2, 4.3, 1.2);
      },
      async (d) => { // night: the course tacks between two latitudes, a waypoint at each turn
        const s = await nightPage(d), n = d.steps.length, w = 3.6, sx = (9.2 - w) / (n - 1), ys = [1.02, 3.14], hh = 2.0;
        t.line(s, 0, 3.06, 10, 0, GOLD, 1, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * sx, y = ys[i % 2], c = i % 2 ? AQUA : GOLD;
          t.rect(s, x, y, w, hh, '173B50', { name: 'Leg' });
          wp(s, i + 1, x + 0.1, y + 0.09, 0.42, c, NIGHT);
          hd(s, st.h, x + 0.62, y + 0.06, w - 0.72, 0.48, { color: c });
          bd(s, st.t, x + 0.14, y + 0.58, w - 0.28, hh - 0.64, { color: 'FFFFFF', max: 12.5 });
        }
      },
      async (d) => { // the page's left side is a red panel with the rose; stages read down the right, each with its heading
        const s = k.slide(C.bg), n = d.steps.length, y0 = 0.32, rh = (5.22 - y0) / n, PW = 3.3;
        t.rect(s, 0, 0, PW, 5.625, C.red, { name: 'Panel' });
        k.txt(s, `${k.idx}°`, 0.4, 0.3, 1.2, 0.4, { size: 18, bold: true, color: 'FFFFFF', font: F.head });
        k.head(s, d.title || '', 0.4, 0.78, PW - 0.72, 2.15, { max: 22, min: 13, italic: true, color: 'FFFFFF', valign: 'top' });
        t.oval(s, 0.85, 3.2, 1.6, 1.6, C.bg); await drawRose(s, 1.65, 4.0, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, c = i % 2 ? C.teal : C.red;
          k.txt(s, ARROWS[(i * 2) % 8 + 0], PW + 0.22, y, 0.4, 0.4, { size: 18, bold: true, font: 'Arial', color: c, align: 'center', valign: 'middle' });
          k.txt(s, String(i + 1), PW + 0.22, y + 0.4, 0.4, 0.34, { size: 13, bold: true, font: F.head, color: C.muted, align: 'center', valign: 'middle' });
          hd(s, st.h, PW + 0.74, y, 5.6, 0.38, { color: c, max: 14.5 });
          bd(s, st.t, PW + 0.74, y + 0.4, 5.6, rh - 0.46, { max: 13 });
          if (i < n - 1) t.line(s, PW + 0.25, y + rh - 0.03, 6.1, 0, HAIR, 0.75);
        }
        k.foot(s, { x: PW + 0.25, y: 5.32, w: 6.1, size: 7.5 });
      },
    ],
    stats: [
      async (d) => { // three graduated dials stand in a row, each holding a number
        const s = page(d), w = 9.2 / 3, D = 2.1, cy = 2.08;
        for (const [i, v] of d.stats.entries()) {
          const c = 0.4 + i * w + w / 2, col = i === 1 ? C.teal : C.red;
          await ring(s, c, cy, D);
          k.head(s, v.value, c - D / 2 + 0.24, cy - 0.38, D - 0.48, 0.76, { max: 26, min: 13, color: col, align: 'center', ls: 1 });
          bd(s, v.label, c - w / 2 + 0.14, cy + D / 2 + 0.08, w - 0.28, 0.72, { align: 'center', max: 13 });
        }
        if (d.note) { t.line(s, 0.4, 4.0, 9.2, 0, C.ring, 0.75); bd(s, d.note, 0.4, 4.06, 9.2, 1.16, { color: C.muted, max: 13, align: 'center', valign: 'middle' }); }
      },
      async (d) => { // night: the lead number at the heart of a great ring, two others like distant marks beside it
        const s = await nightPage(d), [a, ...rest] = d.stats, cx = 2.75, cy = 3.08, D = 4.1;
        await ring(s, cx, cy, D, GOLD);
        k.head(s, a.value, cx - 1.5, cy - 0.78, 3.0, 0.98, { max: 44, min: 20, color: GOLD, align: 'center', ls: 1 });
        bd(s, a.label, cx - 1.25, cy + 0.2, 2.5, 0.82, { color: 'FFFFFF', align: 'center', max: 13 });
        for (const [i, v] of rest.entries()) {
          const y = 1.02 + i * 1.26;
          await needle(s, 5.34, y + 0.32, 0.4, i ? 135 : 45, AQUA);
          k.head(s, v.value, 5.6, y, 4.0, 0.64, { max: 30, min: 16, color: AQUA });
          bd(s, v.label, 5.6, y + 0.64, 4.0, 0.56, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) bd(s, d.note, 5.6, 3.56, 4.0, 1.64, { color: FOG, italic: true, max: 12.5 });
      },
      async (d) => { // the compass tape as on a ship's bridge: a graduated strip, numbers read off under its marks
        const s = page(d), w = 9.2 / 3, y = 1.0, H = 0.62;
        t.rect(s, 0, y, 10, H, C.ink, { name: 'Tape' });
        for (let i = 0; i <= 100; i++) t.line(s, i * 0.1, y, 0, i % 5 ? 0.12 : 0.26, 'FFFFFF', 0.75);
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w;
          t.rect(s, x, y + H - 0.04, 0.18, 0.2, C.red, { name: 'Mark' });
          k.head(s, v.value, x, y + H + 0.22, w - 0.15, 1.02, { max: 42, min: 18, color: i === 1 ? C.teal : C.red });
          bd(s, v.label, x, y + H + 1.26, w - 0.2, 0.74, { max: 13.5 });
        }
        if (d.note) bd(s, d.note, 0.4, 3.72, 9.2, 1.48, { color: C.muted, italic: true, max: 14, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // north and south of one line: two bands, the rose sitting on the line between them
        const s = page(d), H = 2.04, ya = 3.06;
        t.rect(s, 0, ya, 10, 5.2 - ya + 0.0, NIGHT, { name: 'South' });
        [[d.left, 0.94, C.ink, C.red, '↑ '], [d.right, ya + 0.06, 'FFFFFF', GOLD, '↓ ']].forEach(([sd, y, ink, c, ar]) => {
          k.head(s, `${ar}${sd.h}`, 0.4, y + 0.02, 7.5, 0.42, { max: 16, min: 12, color: c });
          const n = sd.items.length, w = 8.0 / n;
          sd.items.forEach((it, j) => bd(s, it, 0.4 + j * w, y + 0.5, w - 0.16, H - 0.6, { color: ink, max: 12.5, ls: 1.1 }));
        });
        t.oval(s, 8.55, ya - 0.62, 1.24, 1.24, C.bg); await drawRose(s, 9.17, ya, 1.14);
      },
      async (d) => { // a great needle stands up the page: dark water on one side of it, parchment on the other
        const s = k.slide(C.bg), W0 = 4.95, w = 3.9, top = 1.72, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.18, 5.2 - top);
        t.rect(s, 0, 0, W0 + 0.05, 5.625, NIGHT, { name: 'Water' });
        t.img(s, await k.svg('needle', `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="900"><polygon points="40,0 80,450 40,450" fill="#${C.red}"/><polygon points="40,0 0,450 40,450" fill="#8F0B20"/><polygon points="40,900 80,450 40,450" fill="#1A1A1A"/><polygon points="40,900 0,450 40,450" fill="#444"/></svg>`, 80, 900), W0 - 0.2, 0, 0.5, 5.625);
        k.head(s, d.title || '', 0.4, 0.22, 4.0, 0.76, { max: 20, min: 12, italic: true, color: 'FFFFFF' });
        k.txt(s, `${k.idx}°`, 8.6, 0.22, 1.0, 0.6, { size: 18, bold: true, color: C.red, align: 'right', valign: 'middle', font: F.head });
        [d.left, d.right].forEach((sd, i) => { const x = i ? 5.55 : 0.4, c = i ? C.teal : GOLD, ink = i ? C.ink : 'FFFFFF';
          k.head(s, `${i ? '' : '← '}${sd.h}${i ? ' →' : ''}`, x, 1.08, w, 0.5, { max: 16, min: 12, color: c }); let y = top;
          sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: ink, ls: 1 }); y += rr[j]; }); });
        k.foot(s, { x: 5.55, y: 5.32, w: 4.05, size: 7 });
      },
    ],
    statement: [
      async (d) => { // night: the sentence inside a vast graduated ring that runs off the page
        const s = await nightPage(d);
        await ring(s, 5, 3.0, 6.6, LINE2);
        k.head(s, L.runs(d.text), 1.1, 1.05, 7.8, 2.45, { max: 30, min: 15, italic: true, color: 'FFFFFF', align: 'center' });
        t.line(s, 4.3, 3.58, 1.4, 0, GOLD, 2);
        if (d.caption) bd(s, d.caption, 1.1, 3.68, 7.8, 1.52, { color: FOG, align: 'center', max: 13 });
      },
      async (d) => { // the rose at its largest, the sentence set beside it in the red of the north point
        const s = page(d), D = 4.25;
        await drawRose(s, 2.5, 3.08, D);
        k.head(s, L.runs(d.text), 4.85, 0.98, 4.75, 2.4, { max: 26, min: 14, italic: true, color: C.red });
        if (d.caption) { t.line(s, 4.85, 3.44, 4.75, 0, C.ring, 0.75); bd(s, d.caption, 4.85, 3.5, 4.75, 1.72, { color: C.muted, max: 13 }); }
      },
    ],
    timeline: [
      async (d) => { // the years read along a strip of chart, as a ship logs its noon positions
        const s = page(d), w = 9.2 / 4, y = 1.0, H = 0.56;
        t.rect(s, 0, y, 10, H, C.teal, { name: 'Strip' });
        for (let i = 0; i <= 100; i++) t.line(s, i * 0.1, y, 0, i % 5 ? 0.06 : 0.12, 'FFFFFF', 0.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          k.head(s, it.year, x, y + 0.08, w - 0.1, H - 0.1, { max: 17, min: 11, color: 'FFFFFF', ls: 1 });
          t.line(s, x, y + H, 0, 3.6, HAIR, 1);
          hd(s, it.h, x + 0.1, y + H + 0.1, w - 0.22, 0.4, { color: C.red, max: 13.5 });
          bd(s, it.t, x + 0.1, y + H + 0.52, w - 0.22, 5.22 - y - H - 0.52, { max: 13 });
        }
      },
      async (d) => { // night: one latitude line across the chart, events above and below it by turns
        const s = await nightPage(d), ya = 3.06, w = 4.35;
        t.line(s, 0, ya, 10, 0, GOLD, 1.75);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75;
          t.shape(s, 'DIAMOND', { x: xn, y: ya - 0.12, w: 0.24, h: 0.24, fill: { color: up ? GOLD : AQUA }, objectName: 'Mark' });
          k.head(s, it.year, xn + 0.28, up ? ya - 0.38 : ya + 0.06, 1.85, 0.32, { max: 14, min: 10, color: up ? GOLD : AQUA });
          if (up) { hd(s, it.h, x, 0.96, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, 1.32, w, ya - 0.44 - 1.32, { color: FOG, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.42, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, ya + 0.78, w, 5.22 - ya - 0.78, { color: FOG, max: 12.5 }); }
        }
      },
      async (d) => { // the meridian runs down the middle, a point of the compass at each year, sides by turns
        const s = page(d), cx = 5, y0 = 0.98, rh = 0.98, w = 4.0;
        t.line(s, cx, 0.9, 0, 4.3, C.ring, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.3 - w : cx + 0.3, a = left ? 'right' : 'left', c = left ? C.red : C.teal, th = Math.min(2 * rh - 0.72, 5.22 - y - 0.66);
          t.shape(s, 'DIAMOND', { x: cx - 0.15, y: y + 0.02, w: 0.3, h: 0.3, fill: { color: c }, objectName: 'Mark' });
          k.head(s, it.year, x, y - 0.02, w, 0.34, { max: 15, min: 10, color: c, align: a });
          hd(s, it.h, x, y + 0.32, w, 0.32, { align: a, max: 13 });
          bd(s, it.t, x, y + 0.66, w, th, { align: a, max: 12, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Kompas', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.bg, accent1: C.red, accent2: C.teal, accent3: '8F0B20', accent4: 'B08D57', accent5: C.muted, accent6: C.ring, hlink: C.teal, folHlink: C.muted } });
}
module.exports = { id: 132, slug: 'kompas', name: 'Kompas', category: 'business', photos: true, build, style: { tone: "strategik yo'nalish: har bir band bitta yo'nalish yoki tanlov; aniq va mo'ljalli", limits: { card_t4: 100, card_t3: 110, step_t: 100, event_t: 100, side_item: 50 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["wheel", "circle", "fade"], "cover": ["spinIn", "focusIn"], "mark": "spinIn", "deco": "wheel", "sig": {"title": "focusIn", "body": "fade", "item": ["arcLeft", "arcRight"], "image": "wheel", "number": "spinIn", "order": "alternate", "stagger": 0.18}, "tempo": 1.1, "kenburns": true};
