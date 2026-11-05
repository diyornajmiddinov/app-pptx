/** 141 Labirint — a MAZE fills the slide; a bright solution path runs through numbered rooms where the ideas sit (snake order, entry ▶ to exit ★). */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F1F7F2', wall: 'B7CDBE', path: 'F26419', ink: '1E2B24', muted: '55665C', room: 'FFFFFF' };
const F = { head: 'Arial', body: 'Calibri' };
const maze = () => { const W = 32, H = 18, c = 50, seen = new Set(), walls = new Set(); let x0 = 11; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { walls.add(`h${x},${y}`); walls.add(`v${x},${y}`); }
  const st = [[0, 0]]; seen.add('0,0'); while (st.length) { const [x, y] = st[st.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [x + a, y + b, a, b]).filter(([a, b]) => a >= 0 && b >= 0 && a < W && b < H && !seen.has(`${a},${b}`));
    if (!nb.length) { st.pop(); continue; } const [nx, ny, a, b] = nb[Math.floor(rnd() * nb.length)]; if (a === 1) walls.delete(`v${nx},${ny}`); if (a === -1) walls.delete(`v${x},${y}`); if (b === 1) walls.delete(`h${nx},${ny}`); if (b === -1) walls.delete(`h${x},${y}`); seen.add(`${nx},${ny}`); st.push([nx, ny]); }
  let g = ''; walls.forEach((w) => { const [x, y] = w.slice(1).split(',').map(Number); g += w[0] === 'h' ? `<line x1="${x * c}" y1="${y * c}" x2="${x * c + c}" y2="${y * c}"/>` : `<line x1="${x * c}" y1="${y * c}" x2="${x * c}" y2="${y * c + c}"/>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#${C.wall}" stroke-width="5" stroke-linecap="round">${g}</g></svg>`; };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const bg = await k.svg('maze', maze(), 1600, 900, true);
  const page = (d) => { const s = k.slide({ data: bg }); if (d.title) { t.rect(s, 0.3, 0.2, Math.min(8.4, L.width(d.title, 24, F.head, true) + 0.6), 0.7, C.room, { name: 'Plate' }); k.head(s, d.title, 0.45, 0.2, 8.0, 0.7, { max: 24, min: 13 }); } t.oval(s, 9.0, 0.25, 0.6, 0.6, C.path); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.6, { size: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' }); t.rect(s, 0.3, 5.26, 9.4, 0.26, C.room, { t: 20, name: 'Plate' }); k.foot(s, { x: 0.4, y: 5.28, w: 9.2, size: 7.5 }); return s; };
  // snake path through rooms: row 1 left→right, row 2 right→left
  const rooms = (s, n, draw) => { const rows = n <= 3 ? 1 : 2, per = Math.ceil(n / rows), w = 9.2 / per - 0.35, h = rows === 1 ? 3.6 : 1.8, pos = [];
    for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = r % 2 ? per - 1 - (i % per) : i % per; pos.push([0.45 + c * (w + 0.35), (rows === 1 ? 1.2 : 1.1) + r * (h + 0.3)]); }
    const pts = [[0, pos[0][1] + h / 2], ...pos.map(([x, y]) => [x + w / 2, y + h / 2]), [10, pos[n - 1][1] + h / 2]];
    for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c2, d2] = pts[i]; t.line(s, Math.min(a, c2), b, Math.abs(c2 - a) || 0.001, 0, C.path, 6); if (d2 !== b) t.line(s, c2, Math.min(b, d2), 0.001, Math.abs(d2 - b), C.path, 6); }
    k.txt(s, '\u25B6', 0.0, pts[0][1] - 0.2, 0.4, 0.4, { size: 16, color: C.path }); k.txt(s, '\u2605', 9.6, pts[pts.length - 1][1] - 0.22, 0.4, 0.44, { size: 18, color: C.path });
    pos.forEach(([x, y], i) => { t.rect(s, x, y, w, h, C.room, { line: { color: C.path, width: 2 }, name: 'Room' }); t.oval(s, x - 0.15, y - 0.15, 0.4, 0.4, C.path); k.txt(s, String(i + 1), x - 0.15, y - 0.15, 0.4, 0.4, { size: 11, bold: true, color: C.ink, align: 'center', valign: 'middle' }); draw(i, x + 0.2, y + 0.12, w - 0.35, h - 0.2); }); };
  const R = {
    async cover(d) { const s = k.slide({ data: bg }); t.rect(s, 0.45, 0.6, 5.3, 4.3, C.room, { line: { color: C.path, width: 3 }, name: 'Room' }); if (d.image) { t.rect(s, 6.3, 0.9, 3.2, 3.2, C.room, { line: { color: C.path, width: 3 }, name: 'Room' }); await k.photo(s, d.image, 6.4, 1.0, 3.0, 3.0); } t.line(s, 5.75, 2.5, 0.55, 0, C.path, 6);
      k.txt(s, k.org3, 0.75, 0.85, 4.8, 0.35, { size: 12, bold: true, color: C.path }); k.head(s, d.title, 0.75, 1.25, 4.8, 2.2, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.75, 3.5, 4.7, 0.7, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.75, 4.25, 4.7, 0.45, { size: 15, bold: true }); t.rect(s, 0.3, 5.26, 9.4, 0.26, C.room, { t: 20, name: 'Plate' }); k.foot(s, { x: 0.45, y: 5.28, size: 7.5 }); },
    async intro(d) { const s = page(d); rooms(s, 2, async () => {}); const w = 9.2 / 2 - 0.35; await k.photo(s, d.image, 0.55, 1.3, w - 0.2, 3.4); k.txt(s, d.text, 0.45 + w + 0.55, 1.3, w - 0.35, 3.4, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rooms(s, d.items.length, (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, h, { max: 16 })); },
    async cards(d) { const s = page(d); rooms(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 14, color: C.path }); k.txt(s, d.items[i].t, x, y + 0.44, w, h - 0.44, { max: 12 }); }); },
    async process(d) { const s = page(d); rooms(s, d.steps.length, (i, x, y, w, h) => { k.head(s, d.steps[i].h, x, y, w, 0.42, { max: 14, color: C.path }); k.txt(s, d.steps[i].t, x, y + 0.44, w, h - 0.44, { max: 12 }); }); },
    async stats(d) { const s = page(d); rooms(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, h * 0.5, { max: 44, min: 16, color: C.path }); k.txt(s, d.stats[i].label, x, y + h * 0.5, w, h * 0.5 - (d.note ? 0.4 : 0), { max: 13 }); }); if (d.note) k.txt(s, d.note, 0.6, 4.4, 8.8, 0.4, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); const w = 4.1, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.3, F.body, 0.1, 3.0); rooms(s, 2, (i, x, y, ww, h) => { const sd = i ? d.right : d.left; k.head(s, sd.h, x, y, ww, 0.45, { max: 15, color: C.path }); let yy = y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, x, yy, ww, rr[j], { size: fs }); yy += rr[j]; }); }); void w; },
    async statement(d) { const s = page(d); rooms(s, 1, (i, x, y, w, h) => { k.head(s, L.runs(d.text), x + 0.3, y, w - 0.6, h * 0.65, { max: 30, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, x + 0.3, y + h * 0.67, w - 0.6, h * 0.3, { max: 12, color: C.muted, align: 'center' }); }); },
    async timeline(d) { const s = page(d); rooms(s, d.items.length, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14, color: C.path }); k.txt(s, d.items[i].t, x, y + 0.44, w, h - 0.44, { max: 12 }); }); },
    async quote(d) { const s = page({}); rooms(s, 1, (i, x, y, w, h) => { k.head(s, `\u201C${d.text}\u201D`, x + 0.3, y, w - 0.6, h - 0.5, { max: 28, min: 14, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, x, y + h - 0.5, w, 0.45, { size: 13, bold: true, color: C.path, align: 'center' }); }); },
    async sources(d) { const s = page(d); rooms(s, 1, (i, x, y, w, h) => { const n = d.items.length, rh = h / n; d.items.forEach((it, j) => k.txt(s, `${j + 1}. ${it}`, x, y + j * rh, w, rh, { max: 12, valign: 'middle' })); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all inside the maze: a deck's pages must not look alike (L.pages)
  const ORG = C.path, NIGHT = '16211B', NW = '35503F', PLT = '0E1712', WH = 'FFFFFF', FOGG = 'CFE0D5';
  const bgN = await k.svg('mazeN', maze().replace(`fill="#${C.bg}"`, `fill="#${NIGHT}"`).replace(`stroke="#${C.wall}"`, `stroke="#${NW}"`), 1600, 900, true);
  const pg = (d, o = {}) => { const s = k.slide({ data: o.night ? bgN : bg }), pl = o.night ? PLT : C.room, ink = o.night ? WH : C.ink; if (d.title && !o.noTitle) { t.rect(s, 0.3, 0.2, Math.min(o.tw ?? 8.4, L.width(d.title, o.max ?? 24, F.head, true) + 0.4), o.th ?? 0.7, pl, { name: 'Plate' }); k.head(s, d.title, 0.45, 0.2, (o.tw ?? 8.4) - 0.3, o.th ?? 0.7, { max: o.max ?? 24, min: 13, color: ink }); } t.oval(s, 9.0, 0.25, 0.6, 0.6, ORG); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.6, { size: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' }); t.rect(s, 0.3, 5.26, 9.4, 0.26, pl, { t: o.night ? 0 : 20, name: 'Plate' }); k.foot(s, { x: 0.4, y: 5.28, w: 9.2, size: 7.5, color: o.night ? FOGG : C.muted }); return s; };
  const path = (s, pts, c = ORG, w = 6) => { for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [e, f] = pts[i]; if (a !== e) t.line(s, Math.min(a, e), b, Math.abs(e - a), 0, c, w); if (b !== f) t.line(s, e, Math.min(b, f), 0, Math.abs(f - b), c, w); } };
  const room = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill ?? C.room, { line: { color: o.line ?? ORG, width: o.lw ?? 2 }, name: 'Room' });
  const badge = (s, x, y, v, dd = 0.4) => { t.oval(s, x, y, dd, dd, ORG); k.txt(s, String(v), x, y, dd, dd, { size: dd > 0.45 ? 15 : 12, bold: true, color: C.ink, align: 'center', valign: 'middle', ls: 1 }); };
  const rings = async (s, x, y, sz, ink = C.ink) => { const r = (rr, gap) => { const a0 = gap * Math.PI / 180, a1 = a0 + 5.6, c = 200; return `<path d="M${c + rr * Math.cos(a0)},${c + rr * Math.sin(a0)} A${rr},${rr} 0 1 1 ${c + rr * Math.cos(a1)},${c + rr * Math.sin(a1)}" fill="none" stroke="#${ink}" stroke-width="9" stroke-linecap="round"/>`; }; t.img(s, await k.svg(`rings${ink}`, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="198" fill="#${C.room}"/>${r(190, 20)}${r(165, 140)}${r(140, 260)}</svg>`, 400, 400), x, y, sz, sz); };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, ls: 1.18, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: 'C2470E', ...o });
  const V = {
    image: [
      async (d) => { // a long room with the picture, the path runs round its end down to the room of words
        const s = pg(d);
        path(s, [[0, 2.1], [0.45, 2.1]]); path(s, [[1.45, 3.0], [1.45, 4.2], [2.3, 4.2]]);
        room(s, 0.45, 1.05, 9.1, 1.98, { lw: 3 });
        await k.photo(s, d.image, 0.5, 1.1, 9.0, 1.88);
        room(s, 2.3, 3.32, 7.25, 1.82);
        bd(s, d.text, 2.45, 3.37, 6.95, 1.72, { valign: 'middle', max: 13.5 });
        k.txt(s, '▶', 0.0, 1.9, 0.4, 0.4, { size: 16, color: ORG });
      },
      async (d) => { // the round heart of a labyrinth holds the picture, rings of wall about it
        const s = pg(d, { tw: 5.0, th: 0.9, max: 22 }), sz = 4.15, x = 5.45, y = 1.0, dd = 2.3;
        await rings(s, x, y, sz);
        await k.photo(s, d.image, x + (sz - dd) / 2, y + (sz - dd) / 2, dd, dd, { mask: 'circle' });
        room(s, 0.45, 1.25, 4.75, 3.9);
        bd(s, d.text, 0.6, 1.3, 4.45, 3.8, { valign: 'middle', ls: 1.25, max: 15 });
      },
      async (d) => { // the maze after dark: the picture is cut to a block of corridors, the words on a dark slab
        const s = pg(d, { night: true }), st = [[0, 0.2], [0.2, 0.2], [0.2, 0], [1, 0], [1, 0.8], [0.8, 0.8], [0.8, 1], [0, 1]];
        await k.photo(s, d.image, 0.45, 1.1, 4.5, 4.0, { mask: { poly: st } });
        t.rect(s, 5.2, 1.1, 4.35, 4.0, PLT, { line: { color: ORG, width: 2 }, name: 'Slab' });
        bd(s, d.text, 5.35, 1.18, 4.05, 3.84, { valign: 'middle', color: WH, max: 14 });
      },
      async (d) => { // the picture fills the page, a white wing of the maze stands at the right
        const s = k.slide(C.room), x = 5.75;
        await k.photo(s, d.image, 0, 0, x, 5.625);
        t.rect(s, x - 0.04, 0, 0.08, 5.625, ORG, { name: 'Wall' });
        k.head(s, d.title || '', x + 0.3, 0.22, 3.0, 1.05, { max: 21, min: 13 });
        t.oval(s, 9.25, 0.25, 0.5, 0.5, ORG); k.txt(s, String(k.idx), 9.25, 0.25, 0.5, 0.5, { size: 13, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        bd(s, d.text, x + 0.3, 1.35, 3.7, 3.85, { valign: 'middle', max: 13 });
        k.foot(s, { x: x + 0.3, y: 5.3, w: 3.7, size: 6.5, color: C.muted });
      },
    ],
    cards: [
      async (d) => { // rooms laid like bricks, the lower row set off from the upper
        const s = pg(d), n = d.items.length, W = 4.3, H = 1.93, pos = n === 4 ? [[0.45, 1.08], [4.95, 1.08], [0.8, 3.2], [5.25, 3.2]] : [[0.45, 1.08], [4.95, 1.08], [2.7, 3.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          room(s, x, y, W, H, { line: i % 2 ? C.ink : ORG });
          t.img(s, await k.icon(it.icon, 'C2470E', 2), x + 0.16, y + 0.14, 0.38, 0.38);
          hd(s, it.h, x + 0.64, y + 0.1, W - 0.8, 0.46);
          bd(s, it.t, x + 0.16, y + 0.62, W - 0.32, H - 0.7, { max: 13 });
        }
      },
      async (d) => { // tall corridors, open at the top, each reaching a different way into the page
        const s = pg(d), n = d.items.length, gap = 0.16, w = (9.1 - gap * (n - 1)) / n, drop = [0.3, 0, 0.42, 0.12];
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * (w + gap), y = 1.05 + drop[i];
          t.rect(s, x, y, w, 5.16 - y, C.room, { name: 'Corridor' });
          t.rect(s, x, y, 0.07, 5.16 - y, C.ink, { name: 'Wall' }); t.rect(s, x + w - 0.07, y, 0.07, 5.16 - y, C.ink, { name: 'Wall' }); t.rect(s, x, 5.1, w, 0.07, C.ink, { name: 'Wall' });
          t.oval(s, x + w / 2 - 0.26, y + 0.08, 0.52, 0.52, ORG);
          t.img(s, await k.icon(it.icon, C.ink, 2), x + w / 2 - 0.15, y + 0.19, 0.3, 0.3);
          hd(s, it.h, x + 0.17, y + 0.64, w - 0.34, 0.56, { align: 'center', max: 14 });
          bd(s, it.t, x + 0.17, y + 1.2, w - 0.34, 5.08 - y - 1.2, { align: 'center', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // one trunk of path down the left, a branch to each row of the page
        const s = pg(d), n = d.items.length, rh = 4.08 / n, tx = 0.75;
        path(s, [[tx, 0.95], [tx, 1.08 + (n - 0.5) * rh]]);
        for (const [i, it] of d.items.entries()) {
          const y = 1.08 + i * rh, c = y + rh / 2;
          path(s, [[tx, c], [1.3, c]]);
          t.oval(s, 1.25, c - 0.32, 0.64, 0.64, ORG); t.img(s, await k.icon(it.icon, C.ink, 2), 1.4, c - 0.16, 0.34, 0.34);
          t.rect(s, 2.05, y + 0.05, 7.5, rh - 0.1, C.room, { name: 'Row' });
          hd(s, it.h, 2.2, y + 0.07, 2.3, rh - 0.14);
          bd(s, it.t, 4.55, y + 0.07, 4.9, rh - 0.14, { valign: 'middle', max: 13, ls: 1.1 });
        }
      },
      async (d) => { // the first room is the great hall at the centre of the walk, the others lead off it
        const s = pg(d), [a, ...rest] = d.items, x = 0.45, y = 1.08, W = 4.5, H = 4.05, m = rest.length, rx = 5.6, rh = H / m;
        rest.forEach((_, i) => path(s, [[x + W, y + (i + 0.5) * rh], [rx, y + (i + 0.5) * rh]]));
        room(s, x, y, W, H, { lw: 4 });
        t.img(s, await k.icon(a.icon, 'C2470E', 1.75), x + 0.25, y + 0.25, 0.7, 0.7);
        hd(s, a.h, x + 0.25, y + 1.05, W - 0.5, 0.75, { max: 22, min: 13 });
        bd(s, a.t, x + 0.25, y + 1.85, W - 0.5, H - 2.0, { max: 15 });
        for (const [i, it] of rest.entries()) {
          const yy = y + i * rh, hh = rh - 0.12;
          room(s, rx, yy, 3.95, hh);
          t.img(s, await k.icon(it.icon, 'C2470E', 2), rx + 0.12, yy + 0.09, 0.32, 0.32);
          hd(s, it.h, rx + 0.52, yy + 0.05, 3.3, 0.4, { max: 14 });
          bd(s, it.t, rx + 0.12, yy + 0.46, 3.72, hh - 0.5, { max: 12, ls: 1.1 });
        }
      },
    ],
    process: [
      async (d) => { // the path climbs in steps from the entry to the star, a room under each step
        const s = pg(d, { tw: 7.4 }), n = d.steps.length, w = 9.1 / n, rise = n === 4 ? 0.43 : 0.62, y0 = 1.16 + (n - 1) * rise, pts = [[0, y0 - 0.1]];
        d.steps.forEach((_, i) => { const x = 0.45 + i * w, y = y0 - i * rise; pts.push([x, y - 0.1], [x + w, y - 0.1]); if (i < n - 1) pts.push([x + w, y - rise - 0.1]); });
        pts.push([10, 1.06]); path(s, pts);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * w, y = y0 - i * rise, h = Math.max(2.5, 5.14 - y - (n === 4 ? 0 : 0));
          room(s, x + 0.05, y, w - 0.14, Math.min(h, 5.14 - y));
          badge(s, x + 0.13, y + 0.1, i + 1);
          hd(s, st.h, x + 0.58, y + 0.06, w - 0.75, 0.5, { max: 14 });
          bd(s, st.t, x + 0.15, y + 0.6, w - 0.34, 5.1 - y - 0.6, { max: 13, ls: 1.12 });
        }
      },
      async (d) => { // a straight corridor down the middle, a room opens to each side by turns
        const s = pg(d), n = d.steps.length, rh = 4.08 / n, w = 4.15;
        path(s, [[5, 0.95], [5, 5.2]]);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.06 + i * rh, right = i % 2 === 1, x = right ? 5.4 : 0.45, dd = Math.min(0.44, rh - 0.16), c = y + rh / 2;
          path(s, [[right ? 5.4 : 4.6, c], [5, c]]);
          room(s, x, y + 0.03, w, rh - 0.08);
          badge(s, 5 - dd / 2, c - dd / 2, i + 1, dd);
          hd(s, st.h, x + 0.14, y + 0.04, w - 0.28, 0.3, { max: 14 });
          bd(s, st.t, x + 0.14, y + 0.34, w - 0.28, rh - 0.41, { max: 12.5, ls: 1.02 });
        }
      },
      async (d) => { // after dark: the path winds up and down between the rooms in one meander
        const s = pg(d, { night: true }), n = d.steps.length, gap = 0.34, w = (9.1 - gap * (n - 1)) / n;
        for (let i = 0; i < n - 1; i++) { const xg = 0.45 + i * (w + gap) + w + gap / 2, top = i % 2 === 0; path(s, [[xg, 1.05], [xg, 5.16]]); path(s, [[xg - w - gap, top ? 1.05 : 5.16], [xg, top ? 1.05 : 5.16]]); }
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * (w + gap), y = 1.15, h = 3.9;
          t.rect(s, x, y, w, h, PLT, { name: 'Room' });
          k.txt(s, String(i + 1), x + 0.15, y + 0.08, 0.8, 0.7, { size: 38, bold: true, font: F.head, color: ORG, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.15, y + 0.82, w - 0.3, 0.56, { color: WH, valign: 'top' });
          bd(s, st.t, x + 0.15, y + 1.4, w - 0.3, h - 1.48, { color: FOGG, max: 13.5 });
        }
      },
      async (d) => { // one loop of path round the page, the steps sit on it in a ring about the star
        const s = pg(d), n = d.steps.length, W = 3.85, H = 1.92, rx = [0.45, 5.7], ry = [1.08, 3.22];
        path(s, [[2.3, 2.0], [7.6, 2.0], [7.6, 4.2], [2.3, 4.2], [2.3, 2.0]]);
        k.txt(s, '★', 4.5, n === 4 ? 2.6 : 2.12, 1.0, 1.0, { size: 44, color: ORG, align: 'center', valign: 'middle', ls: 1 });
        const pos = n === 4 ? [[rx[0], ry[0]], [rx[1], ry[0]], [rx[1], ry[1]], [rx[0], ry[1]]] : [[rx[0], ry[0]], [rx[1], ry[0]], [3.08, ry[1]]];
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          room(s, x, y, W, H);
          badge(s, x + 0.12, y + 0.1, i + 1);
          hd(s, st.h, x + 0.6, y + 0.06, W - 0.72, 0.48, { max: 14 });
          bd(s, st.t, x + 0.14, y + 0.58, W - 0.28, H - 0.64, { max: 13, ls: 1.12 });
        }
      },
    ],
    stats: [
      async (d) => { // the star room at the end of the walk holds the first figure
        const s = pg(d), [a, ...rest] = d.stats, x = 0.45, y = 1.08, W = 4.4, H = 4.05;
        path(s, [[0, 3.1], [x, 3.1]]); path(s, [[x + W, 1.6], [5.3, 1.6]]); path(s, [[x + W, 2.7], [5.3, 2.7]]);
        room(s, x, y, W, H, { line: ORG, lw: 5 });
        k.txt(s, '★', x + W - 0.75, y + 0.1, 0.65, 0.65, { size: 28, color: ORG, align: 'center', valign: 'middle' });
        hd(s, a.value, x + 0.25, y + 0.85, W - 0.5, 1.3, { max: 58, min: 26, color: C.ink });
        bd(s, a.label, x + 0.25, y + 2.2, W - 0.5, 1.6, { max: 15 });
        rest.forEach((v, i) => { const yy = 1.12 + i * 1.1; room(s, 5.3, yy, 4.25, 1.0); hd(s, v.value, 5.42, yy + 0.04, 1.8, 0.92, { max: 28, min: 15 }); bd(s, v.label, 7.28, yy + 0.04, 2.2, 0.92, { valign: 'middle', max: 12, ls: 1.08 }); });
        if (d.note) { room(s, 5.3, 3.34, 4.25, 1.79, { line: C.ink }); bd(s, d.note, 5.42, 3.38, 4.0, 1.71, { valign: 'middle', italic: true, max: 13 }); }
      },
      async (d) => { // three rooms at different heights strung on the path, the note on the wide floor below
        const s = pg(d), w = 2.85, ys = [1.45, 1.08, 1.6], xs = [0.45, 3.58, 6.7], h = 1.9;
        path(s, [[0, 2.3], [10, 2.3]]);
        for (const [i, v] of d.stats.entries()) {
          room(s, xs[i], ys[i], w, h, { lw: 3 });
          hd(s, v.value, xs[i] + 0.12, ys[i] + 0.06, w - 0.24, 0.95, { max: 38, min: 18, color: i === 1 ? C.ink : 'C2470E', align: 'center' });
          bd(s, v.label, xs[i] + 0.12, ys[i] + 1.02, w - 0.24, 0.82, { align: 'center', max: 12.5, ls: 1.08 });
        }
        if (d.note) { t.rect(s, 0.45, 3.72, 9.1, 1.42, C.room, { name: 'Floor' }); bd(s, d.note, 0.65, 3.76, 8.7, 1.34, { valign: 'middle', align: 'center', italic: true, max: 13.5 }); }
      },
      async (d) => { // after dark: figures burn orange on three dark slabs laid one under another
        const s = pg(d, { night: true });
        for (const [i, v] of d.stats.entries()) {
          const y = 1.08 + i * 0.98, x = 0.45 + i * 0.3;
          t.rect(s, x, y, 6.3, 0.9, PLT, { name: 'Slab' });
          hd(s, v.value, x + 0.12, y + 0.02, 2.5, 0.86, { max: 34, min: 16, color: ORG });
          bd(s, v.label, x + 2.7, y + 0.02, 3.5, 0.86, { color: WH, valign: 'middle', max: 12.5, ls: 1.08 });
        }
        if (d.note) { t.rect(s, 7.4, 1.08, 2.15, 4.05, PLT, { line: { color: ORG, width: 2 }, name: 'Slab' }); bd(s, d.note, 7.5, 1.14, 1.95, 3.93, { color: FOGG, valign: 'middle', italic: true, max: 12.5 }); }
      },
    ],
    compare: [
      async (d) => { // the path forks: one branch goes to the upper hall, the other to the lower
        const s = pg(d), rooms2 = [[1.15, 1.06], [1.15, 3.14]];
        path(s, [[0, 3.1], [0.7, 3.1]]); path(s, [[0.7, 2.05], [0.7, 4.15]]); path(s, [[0.7, 2.05], [1.15, 2.05]]); path(s, [[0.7, 4.15], [1.15, 4.15]]);
        k.txt(s, '▶', 0.0, 2.9, 0.4, 0.4, { size: 16, color: ORG });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const [x, y] = rooms2[i], w = 8.4, h = 2.0, m = sd.items.length, rh = (h - 0.12) / m;
          room(s, x, y, w, h, { line: i ? C.ink : ORG, lw: 3 });
          hd(s, sd.h, x + 0.15, y + 0.06, 2.15, h - 0.12, { max: 18, min: 12, color: i ? C.ink : 'C2470E' });
          sd.items.forEach((it, j) => { const yy = y + 0.06 + j * rh; t.rect(s, x + 2.45, yy + rh / 2 - 0.04, 0.08, 0.08, ORG, { name: 'Dot' }); bd(s, it, x + 2.62, yy, w - 2.75, rh, { valign: 'middle', max: 12.5, ls: 1.05 }); });
        }
      },
      async (d) => { // after dark: a wall splits the page, the two rooms read away from it
        const s = pg(d, { night: true });
        t.rect(s, 4.95, 0.98, 0.1, 4.2, ORG, { name: 'Wall' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.15 : 0.35, w = 4.5, a = i ? 'left' : 'right', rh = 3.3 / sd.items.length;
          t.rect(s, x, 1.05, w, 4.08, PLT, { name: 'Room' });
          hd(s, sd.h, x + 0.15, 1.1, w - 0.3, 0.6, { align: a, max: 19, color: ORG });
          sd.items.forEach((it, j) => bd(s, it, x + 0.15, 1.75 + j * rh, w - 0.3, rh - 0.05, { align: a, valign: 'middle', color: WH, max: 13.5 }));
        }
      },
    ],
    statement: [
      async (d) => { // after dark: the path breaks out of the maze and the thought stands in its light
        const s = pg(d, { night: true, max: 18, th: 0.6 });
        t.rect(s, 0.75, 1.08, 8.5, 2.65, PLT, { line: { color: ORG, width: 3 }, name: 'Slab' });
        path(s, [[0, 2.4], [0.75, 2.4]]); path(s, [[9.25, 2.4], [10, 2.4]]);
        k.head(s, L.runs(d.text), 1.0, 1.13, 8.0, 2.55, { max: 30, min: 16, color: WH, align: 'center' });
        if (d.caption) { t.rect(s, 0.75, 3.88, 8.5, 1.28, PLT, { name: 'Slab' }); bd(s, d.caption, 0.95, 3.92, 8.1, 1.2, { color: FOGG, align: 'center', valign: 'middle', max: 13 }); }
      },
      async (d) => { // the round labyrinth and, beside it, the way out written large
        const s = pg(d, { max: 18, th: 0.6 }), sz = 2.95;
        await rings(s, 0.4, 1.0, sz);
        k.txt(s, '★', 0.4 + sz / 2 - 0.5, 1.0 + sz / 2 - 0.5, 1.0, 1.0, { size: 40, color: ORG, align: 'center', valign: 'middle', ls: 1 });
        room(s, 3.75, 1.0, 5.8, 2.95, { lw: 3 });
        path(s, [[3.35, 2.45], [3.75, 2.45]]);
        k.head(s, L.runs(d.text), 3.95, 1.05, 5.4, 2.85, { max: 28, min: 15 });
        if (d.caption) { t.rect(s, 0.45, 4.05, 9.1, 1.13, C.room, { name: 'Floor' }); bd(s, d.caption, 0.6, 4.08, 8.8, 1.07, { valign: 'middle', max: 13 }); }
      },
    ],
    timeline: [
      async (d) => { // the corridor runs across the page, a room above and a room below by turns
        const s = pg(d, { th: 0.62 }), ax = 3.1, xs = [0.4, 2.5, 4.65, 6.55], w = 3.05;
        path(s, [[0, ax], [10, ax]]);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, h = 1.82, y = up ? 0.97 : ax + 0.24;
          path(s, [[x + 0.3, up ? y + h : ax], [x + 0.3, up ? ax : y]], ORG, 4);
          t.rect(s, x, y, w, h, C.room, { line: { color: ORG, width: 2 }, name: 'Room' });
          k.txt(s, [{ text: `${it.year}  `, options: { color: 'C2470E' } }, { text: it.h, options: { color: C.ink } }], x + 0.1, y + 0.03, w - 0.2, 0.38, { bold: true, font: F.head, max: 13, min: 10, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x + 0.1, y + 0.42, w - 0.2, h - 0.46, { max: 12.5, ls: 1.1 });
        }
      },
      async (d) => { // rooms step down the page from the entry, the path turning at each one
        const s = pg(d, { th: 0.62 }), rh = 1.03, dx = 0.85, w = 6.5;
        const pts = [[0, 1.5]]; d.items.forEach((_, i) => { pts.push([0.4 + i * dx - 0.15, 1.5 + i * rh]); if (i < 3) pts.push([0.4 + i * dx - 0.15, 1.5 + (i + 1) * rh]); });
        path(s, pts);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * dx, y = 1.02 + i * rh;
          t.rect(s, x, y, w, rh - 0.08, C.room, { line: { color: ORG, width: 2 }, name: 'Room' });
          hd(s, it.year, x + 0.08, y + 0.02, 1.25, rh - 0.12, { max: 16, min: 10, align: 'center' });
          t.line(s, x + 1.38, y + 0.08, 0, rh - 0.24, ORG, 1.5);
          hd(s, it.h, x + 1.46, y + 0.03, w - 1.56, 0.28, { color: C.ink, max: 13 });
          bd(s, it.t, x + 1.46, y + 0.31, w - 1.56, rh - 0.42, { max: 11.5, ls: 1.02 });
        }
      },
      async (d) => { // after dark: years along an orange rail at the left, each row on its own slab
        const s = pg(d, { night: true }), rh = 4.08 / 4;
        path(s, [[2.1, 0.95], [2.1, 5.18]]);
        for (const [i, it] of d.items.entries()) {
          const y = 1.06 + i * rh;
          hd(s, it.year, 0.3, y, 1.65, rh - 0.08, { color: ORG, max: 17, min: 10, align: 'right' });
          t.oval(s, 2.0, y + rh / 2 - 0.14, 0.2, 0.2, WH);
          t.rect(s, 2.4, y, 7.15, rh - 0.08, PLT, { name: 'Slab' });
          hd(s, it.h, 2.55, y + 0.02, 1.9, rh - 0.12, { color: WH, max: 14 });
          bd(s, it.t, 4.5, y + 0.02, 4.95, rh - 0.12, { color: FOGG, valign: 'middle', max: 12.5, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old rooms on one path were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Labirint', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2F4A3A', lt2: C.bg, accent1: C.path, accent2: '2F855A', accent3: 'F6AE2D', accent4: '86BBD8', accent5: C.muted, accent6: C.wall, hlink: C.path, folHlink: C.muted } });
}
module.exports = { id: 141, slug: 'labirint', name: 'Labirint', category: 'creative', photos: true, build, style: { tone: "muammodan yechimgacha yo'l: har bir qadam keyingisiga olib boradi; aniq va qiziqarli", limits: { card_t4: 110, step_t: 110 }, prefer: null } };
