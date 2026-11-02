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
  const page = (d) => { const s = k.slide({ data: bg }); if (d.title) { t.rect(s, 0.3, 0.2, Math.min(8.4, L.width(d.title, 24, F.head, true) + 0.6), 0.7, C.room, { name: 'Plate' }); k.head(s, d.title, 0.45, 0.2, 8.0, 0.7, { max: 24, min: 13 }); } t.oval(s, 9.0, 0.25, 0.6, 0.6, C.path); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.6, { size: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); t.rect(s, 0.3, 5.26, 9.4, 0.26, C.room, { t: 20, name: 'Plate' }); k.foot(s, { x: 0.4, y: 5.28, w: 9.2, size: 7.5 }); return s; };
  // snake path through rooms: row 1 left→right, row 2 right→left
  const rooms = (s, n, draw) => { const rows = n <= 3 ? 1 : 2, per = Math.ceil(n / rows), w = 9.2 / per - 0.35, h = rows === 1 ? 3.6 : 1.8, pos = [];
    for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = r % 2 ? per - 1 - (i % per) : i % per; pos.push([0.45 + c * (w + 0.35), (rows === 1 ? 1.2 : 1.1) + r * (h + 0.3)]); }
    const pts = [[0, pos[0][1] + h / 2], ...pos.map(([x, y]) => [x + w / 2, y + h / 2]), [10, pos[n - 1][1] + h / 2]];
    for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c2, d2] = pts[i]; t.line(s, Math.min(a, c2), b, Math.abs(c2 - a) || 0.001, 0, C.path, 6); if (d2 !== b) t.line(s, c2, Math.min(b, d2), 0.001, Math.abs(d2 - b), C.path, 6); }
    k.txt(s, '\u25B6', 0.0, pts[0][1] - 0.2, 0.4, 0.4, { size: 16, color: C.path }); k.txt(s, '\u2605', 9.6, pts[pts.length - 1][1] - 0.22, 0.4, 0.44, { size: 18, color: C.path });
    pos.forEach(([x, y], i) => { t.rect(s, x, y, w, h, C.room, { line: { color: C.path, width: 2 }, name: 'Room' }); t.oval(s, x - 0.15, y - 0.15, 0.4, 0.4, C.path); k.txt(s, String(i + 1), x - 0.15, y - 0.15, 0.4, 0.4, { size: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); draw(i, x + 0.2, y + 0.12, w - 0.35, h - 0.2); }); };
  const R = {
    async cover(d) { const s = k.slide({ data: bg }); t.rect(s, 0.45, 0.6, 5.3, 4.3, C.room, { line: { color: C.path, width: 3 }, name: 'Room' }); if (d.image) { t.rect(s, 6.3, 0.9, 3.2, 3.2, C.room, { line: { color: C.path, width: 3 }, name: 'Room' }); await k.photo(s, d.image, 6.4, 1.0, 3.0, 3.0); } t.line(s, 5.75, 2.5, 0.55, 0, C.path, 6);
      k.txt(s, k.org3, 0.75, 0.85, 4.8, 0.35, { size: 12, bold: true, color: C.path }); k.head(s, d.title, 0.75, 1.25, 4.8, 2.2, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.75, 3.5, 4.7, 0.7, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.75, 4.25, 4.7, 0.45, { size: 15, bold: true }); k.foot(s, { x: 0.45, y: 5.28, size: 7.5 }); },
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
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Labirint', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2F4A3A', lt2: C.bg, accent1: C.path, accent2: '2F855A', accent3: 'F6AE2D', accent4: '86BBD8', accent5: C.muted, accent6: C.wall, hlink: C.path, folHlink: C.muted } });
}
module.exports = { id: 141, slug: 'labirint', name: 'Labirint', category: 'creative', photos: true, build, style: { tone: "muammodan yechimgacha yo'l: har bir qadam keyingisiga olib boradi; aniq va qiziqarli", limits: { card_t4: 110, step_t: 110 }, prefer: null } };
