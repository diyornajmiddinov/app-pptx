/** 143 Pasport — a passport page: guilloche wave background, ideas stamped as VISA STAMPS in different inks and shapes; the cover carries a photo and a machine-readable zone (<<<). */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'EEF4EE', ink: '1E2A3A', muted: '55606E', inks: ['6A1B9A', 'C62828', '1565C0', '2E7D32', 'AD5800', '00695C'] };
const F = { head: 'Arial', body: 'Calibri' };
const guil = () => { let g = ''; for (let k2 = 0; k2 < 26; k2++) { let d = `M0,${30 + k2 * 34}`; for (let x = 0; x <= 1600; x += 20) d += ` L${x},${(30 + k2 * 34 + 14 * Math.sin(x / 60 + k2 * 0.7)).toFixed(1)}`; g += `<path d="${d}" fill="none" stroke="#9FC3A8" stroke-width="1.2" opacity="0.6"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.paper}"/>${g}</svg>`; };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const bg = await k.svg('g', guil(), 1600, 900, true);
  // stamp: double border (rect or oval) in an ink colour, header in caps, year line, text
  const stamp = (s, x, y, w, h, i, oval) => { const c = C.inks[i % 6], o = { line: { color: c, width: 2.25 }, name: 'Stamp' }; if (oval) { t.oval(s, x, y, w, h, 'FFFFFF', { ...o, t: 30 }); t.oval(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { line: { color: c, width: 0.75 } }); } else { t.rect(s, x, y, w, h, 'FFFFFF', { ...o, t: 30, r: 0.08 }); t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { r: 0.06, line: { color: c, width: 0.75 }, name: 'Stamp' }); } return c; };
  const page = (d) => { const s = k.slide({ data: bg }); t.rect(s, 0, 0, 10, 0.95, 'DCE8DD', { name: 'Header' }); if (d.title) k.head(s, d.title.toUpperCase(), 0.4, 0.15, 7.6, 0.65, { max: 20, min: 11, spacing: 1 }); k.txt(s, `\u2116 ${String(k.idx).padStart(3, '0')}`, 8.1, 0.15, 1.5, 0.65, { size: 14, bold: true, color: C.inks[1], align: 'right', valign: 'middle', font: 'Courier New' }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  // staggered stamp grid
  const stamps = (s, n, draw) => { const cols = n <= 3 ? n : n === 4 ? 2 : 3, rws = Math.ceil(n / cols), w = 9.0 / cols - 0.3, h = 4.05 / rws - 0.25; for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols), x = 0.5 + c * (w + 0.3) + (r % 2 ? 0.12 : 0), y = 1.15 + r * (h + 0.25) + (c % 2 ? 0.1 : 0), ov = n <= 3 && i === 1; const col = stamp(s, x, y, w, h, i, ov); draw(i, x + (ov ? w * 0.19 : 0.2), y + (ov ? h * 0.16 : 0.15), w - (ov ? w * 0.38 : 0.4), h - (ov ? h * 0.32 : 0.3), col); } };
  const R = {
    async cover(d) { const s = k.slide({ data: bg }); t.rect(s, 0.4, 0.4, 9.2, 4.8, 'FFFFFF', { t: 40, line: { color: '9FC3A8', width: 1 }, name: 'Page' }); if (d.image) await k.photo(s, d.image, 0.7, 0.8, 2.3, 2.9, { gray: true });
      k.txt(s, (k.M.org || '').toUpperCase(), 3.3, 0.7, 6.0, 0.35, { size: 11, bold: true, color: C.inks[2], spacing: 2 }); k.head(s, d.title, 3.3, 1.1, 6.0, 1.9, { max: 30, min: 15, valign: 'top' }); k.txt(s, d.subtitle || '', 3.3, 3.0, 6.0, 0.7, { max: 12, color: C.muted });
      const mrz = (str) => (str.toUpperCase().replace(/[^A-Z0-9]/g, '<') + '<'.repeat(44)).slice(0, 44); k.txt(s, `P<UZB${mrz(k.M.author || 'SLIDEAI')}`.slice(0, 44) + '\n' + mrz(`${k.M.year || ''}${k.M.loc || ''}`), 0.7, 4.0, 8.6, 0.85, { size: 14, font: 'Courier New', bold: true, color: C.ink, valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); stamp(s, 0.5, 1.2, 3.6, 3.9, 0, false); await k.photo(s, d.image, 0.7, 1.4, 3.2, 3.5, { gray: true }); k.txt(s, d.text, 4.5, 1.2, 5.1, 3.9, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); stamps(s, d.items.length, (i, x, y, w, h, c) => { k.txt(s, String(i + 1).padStart(2, '0'), x, y, w, 0.45, { size: 16, bold: true, color: c, font: 'Courier New' }); k.head(s, d.items[i].toUpperCase(), x, y + 0.45, w, h - 0.45, { max: 14, color: c, valign: 'top' }); }); },
    async cards(d) { const s = page(d); stamps(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h.toUpperCase(), x, y, w, 0.42, { max: 13, color: c }); k.txt(s, d.items[i].t, x, y + 0.44, w, h - 0.44, { max: 12 }); }); },
    async process(d) { const s = page(d); stamps(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`.toUpperCase(), x, y, w, 0.42, { max: 13, color: c }); k.txt(s, d.steps[i].t, x, y + 0.44, w, h - 0.44, { max: 12 }); }); },
    async stats(d) { const s = page(d); stamps(s, d.stats.length, (i, x, y, w, h, c) => { k.head(s, d.stats[i].value, x, y, w, h * 0.5, { max: 40, min: 16, color: c, align: 'center' }); k.txt(s, d.stats[i].label, x, y + h * 0.52, w, h * 0.48 - (d.note ? 0.25 : 0), { max: 12, align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.5, 4.95, 9.0, 0.32, { max: 8, color: C.muted }); },
    async compare(d) { const s = page(d), w = 4.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.4, F.body, 0.1, 3.1); [d.left, d.right].forEach((sd, i) => { const c = stamp(s, 0.45 + i * 4.75, 1.15 + i * 0.1, w, 3.95, i ? 2 : 1, false); k.head(s, sd.h.toUpperCase(), 0.65 + i * 4.75, 1.3 + i * 0.1, w - 0.4, 0.45, { max: 14, color: c }); let y = 1.85 + i * 0.1; sd.items.forEach((it, j) => { k.txt(s, it, 0.65 + i * 4.75, y, w - 0.4, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const c = stamp(s, 1.5, 1.3, 7.0, 2.6, 0, true); k.head(s, L.runs(d.text), 2.4, 1.6, 5.2, 2.0, { max: 24, min: 12, align: 'center', color: c }); if (d.caption) k.txt(s, d.caption, 1.0, 4.05, 8.0, 1.1, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); stamps(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, w, 0.45, { max: 20, min: 11, color: c, font: 'Courier New' }); k.head(s, d.items[i].h.toUpperCase(), x, y + 0.47, w, 0.4, { max: 12, color: c }); k.txt(s, d.items[i].t, x, y + 0.88, w, h - 0.88, { max: 11 }); }); },
    async quote(d) { const s = page({}); const c = stamp(s, 1.0, 1.2, 8.0, 3.8, 3, false); k.head(s, `\u201C${d.text}\u201D`, 1.4, 1.4, 7.2, 2.8, { max: 26, min: 13, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author.toUpperCase(), 1.4, 4.3, 7.2, 0.45, { size: 13, bold: true, color: c, align: 'center' }); },
    async sources(d) { const s = page(d); const c = stamp(s, 0.5, 1.15, 9.0, 4.0, 2, false); const n = d.items.length, rh = 3.7 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: c } }, { text: it }], 0.75, 1.3 + i * rh, 8.5, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, leaf by leaf through the same passport: a deck's pages must not look alike (L.pages)
  const COVER = '1F3A2C', GOLD = 'D9B95B', PALE = 'F1EAD2', WH = 'FFFFFF', HB = 'DCE8DD', CM = 'Courier New';
  const mrz = (str, n = 44) => (String(str).toUpperCase().replace(/[^A-Z0-9]/g, '<') + '<'.repeat(n)).slice(0, n);
  const pg = (d, o = {}) => { const s = k.slide({ data: bg }); if (!o.noHead) t.rect(s, 0, 0, o.hw ?? 10, 0.95, HB, { name: 'Header' }); if (d.title) k.head(s, d.title.toUpperCase(), 0.4, 0.15, (o.hw ?? 10) - 2.4, 0.65, { max: 20, min: 11, spacing: 1 }); k.txt(s, `№ ${String(k.idx).padStart(3, '0')}`, (o.hw ?? 10) - 1.9, 0.15, 1.5, 0.65, { size: 14, bold: true, color: C.inks[1], align: 'right', valign: 'middle', font: CM }); k.foot(s, { x: o.fx ?? 0.6, y: 5.32, w: o.fw ?? 8.8, size: 7.5 }); return s; };
  const crest = (s, cx, cy, dd) => { t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, null, { line: { color: GOLD, width: 2.5 } }); t.oval(s, cx - dd * 0.36, cy - dd * 0.36, dd * 0.72, dd * 0.72, null, { line: { color: GOLD, width: 0.75 } }); t.line(s, cx - dd / 2, cy, dd, 0, GOLD, 0.75); t.oval(s, cx - dd * 0.16, cy - dd / 2, dd * 0.32, dd, null, { line: { color: GOLD, width: 0.75 } }); };
  const cover = (d, o = {}) => { const s = k.slide(COVER); t.rect(s, 0.18, 0.18, 9.64, 5.26, null, { line: { color: GOLD, width: 1 }, name: 'Tooling' }); if (d.title) k.head(s, d.title.toUpperCase(), o.x ?? 0.45, 0.28, o.w ?? 7.4, 0.7, { max: 19, min: 11, spacing: 1, color: GOLD }); k.txt(s, `№ ${String(k.idx).padStart(3, '0')}`, 8.05, 0.28, 1.5, 0.7, { size: 14, bold: true, color: GOLD, align: 'right', valign: 'middle', font: CM }); k.foot(s, { x: 0.45, y: 5.2, w: 9.1, size: 7.5, color: PALE }); return s; };
  const round = (s, x, y, dd, i, fill = 'FFFFFF') => { const c = C.inks[i % 6]; t.oval(s, x, y, dd, dd, fill, { line: { color: c, width: 2.5 } }); t.oval(s, x + 0.06, y + 0.06, dd - 0.12, dd - 0.12, null, { line: { color: c, width: 0.75 } }); return c; };
  const zone = (s, y, str, h = 0.62) => { t.rect(s, 0, y, 10, h, 'FFFFFF', { t: 15, name: 'MRZ' }); k.txt(s, `P<UZB${mrz(str, 49)}`, 0.4, y, 9.2, h, { size: 15, bold: true, font: CM, valign: 'middle', color: C.ink, ls: 1 }); };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, ls: 1.18, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 11, ...o });
  const V = {
    image: [
      async (d) => { // the data page: portrait at the left, words beside it, the machine-readable zone below
        const s = pg(d);
        stamp(s, 0.4, 1.08, 2.85, 3.3, 2, false);
        await k.photo(s, d.image, 0.52, 1.2, 2.61, 3.06, { gray: true });
        bd(s, d.text, 3.5, 1.08, 6.1, 3.3, { valign: 'middle', ls: 1.28, max: 15 });
        zone(s, 4.55, d.title || 'SLIDEAI');
      },
      async (d) => { // the picture is struck as a great round stamp at the right
        const s = pg(d), dd = 3.95, x = 5.7, y = 1.15;
        round(s, x - 0.1, y - 0.1, dd + 0.2, 1);
        await k.photo(s, d.image, x + 0.08, y + 0.08, dd - 0.16, dd - 0.16, { mask: 'circle' });
        bd(s, d.text, 0.4, 1.15, 5.0, 4.0, { valign: 'middle', ls: 1.28, max: 15 });
      },
      async (d) => { // the green cover: the picture set in gilt tooling, the words in pale ink
        const s = cover(d), x = 0.45, y = 1.08, w = 4.5, h = 3.95;
        t.rect(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, null, { line: { color: GOLD, width: 2.5 }, name: 'Tooling' });
        await k.photo(s, d.image, x, y, w, h);
        crest(s, 9.05, 4.55, 0.8);
        bd(s, d.text, 5.25, 1.08, 4.3, 3.95, { color: PALE, valign: 'middle', max: 13.5 });
      },
      async (d) => { // the picture fills the page, a visa sticker is pasted over it
        const s = k.slide(C.paper), x = 3.5, y = 0.45, w = 6.1, h = 4.6;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x, y, w, h, C.paper, { line: { color: C.inks[0], width: 2.5 }, name: 'Visa' });
        t.rect(s, x, y, w, 0.9, C.inks[0], { name: 'Visa head' });
        k.head(s, (d.title || '').toUpperCase(), x + 0.2, y + 0.06, w - 1.6, 0.78, { max: 17, min: 11, spacing: 1, color: WH });
        k.txt(s, `№ ${String(k.idx).padStart(3, '0')}`, x + w - 1.35, y + 0.06, 1.2, 0.78, { size: 13, bold: true, color: WH, align: 'right', valign: 'middle', font: CM });
        bd(s, d.text, x + 0.2, y + 1.0, w - 0.4, h - 1.08, { valign: 'middle', max: 13.5 });
        t.rect(s, 0, 5.27, 10, 0.355, COVER, { name: 'Foot band' }); k.foot(s, { x: 0.4, y: 5.33, w: 9.2, size: 7.5, color: PALE });
      },
    ],
    cards: [
      async (d) => { // a row of round entry stamps, an icon struck in each, the words written under
        const s = pg(d), n = d.items.length, w = 9.2 / n, dd = 1.3;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2, c = round(s, cx - dd / 2, 1.08 + (i % 2) * 0.12, dd, i * 2 + 1);
          t.img(s, await k.icon(it.icon, c, 1.75), cx - 0.3, 1.43 + (i % 2) * 0.12, 0.6, 0.6);
          hd(s, it.h.toUpperCase(), x + 0.06, 2.55, w - 0.12, 0.58, { color: c, align: 'center' });
          bd(s, it.t, x + 0.06, 3.15, w - 0.12, 2.08, { align: 'center', max: 13 });
        }
      },
      async (d) => { // visa stickers: an ink band across the head of each
        const s = pg(d), n = d.items.length, W = 4.5, H = 1.98, pos = n === 4 ? [[0.4, 1.08, W], [5.1, 1.08, W], [0.4, 3.2, W], [5.1, 3.2, W]] : [[0.4, 1.08, W], [5.1, 1.08, W], [0.4, 3.2, 9.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i], c = C.inks[(i * 2 + 2) % 6];
          t.rect(s, x, y, w, H, WH, { line: { color: c, width: 1.5 }, name: 'Visa' });
          t.rect(s, x, y, w, 0.52, c, { name: 'Visa head' });
          t.img(s, await k.icon(it.icon, WH, 2), x + 0.13, y + 0.1, 0.32, 0.32);
          hd(s, it.h.toUpperCase(), x + 0.55, y + 0.02, w - 0.7, 0.48, { color: WH });
          bd(s, it.t, x + 0.15, y + 0.6, w - 0.3, H - 0.68, { max: 13.5 });
        }
      },
      async (d) => { // the green cover: lines of the register in gilt, a serial number to each
        const s = cover(d), n = d.items.length, rh = 3.98 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.08 + i * rh;
          if (i) t.line(s, 0.45, y, 9.1, 0, GOLD, 0.5, { dash: 'dash' });
          k.txt(s, String(i + 1).padStart(2, '0'), 0.45, y, 0.7, rh, { size: 20, bold: true, font: CM, color: GOLD, valign: 'middle' });
          t.img(s, await k.icon(it.icon, GOLD, 1.75), 1.2, y + rh / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h.toUpperCase(), 1.75, y + 0.04, 2.5, rh - 0.08, { color: PALE, max: 13.5 });
          bd(s, it.t, 4.35, y + 0.04, 5.2, rh - 0.08, { color: PALE, valign: 'middle', max: 13, ls: 1.1 });
        }
      },
      async (d) => { // the open book: two leaves and the sewn gutter between them, ideas written on each leaf
        const s = pg({}, { noHead: true }), n = d.items.length, per = Math.ceil(n / 2);
        t.rect(s, 4.86, 0, 0.28, 5.625, '9FC3A8', { t: 40, name: 'Gutter' }); t.line(s, 5, 0, 0, 5.625, C.ink, 1, { dash: 'dash' });
        k.head(s, (d.title || '').toUpperCase(), 0.4, 0.15, 4.2, 0.85, { max: 17, min: 11, spacing: 1 });
        for (const [i, it] of d.items.entries()) {
          const right = i >= per, col = right ? d.items.length - per : per, j = right ? i - per : i, y0 = right ? 0.95 : 1.15, H = 5.18 - y0, h = H / col, x = right ? 5.4 : 0.4, c = C.inks[(i * 2 + 1) % 6];
          t.img(s, await k.icon(it.icon, c, 2), x, y0 + j * h + 0.04, 0.38, 0.38);
          hd(s, it.h.toUpperCase(), x + 0.48, y0 + j * h, 3.7, 0.46, { color: c });
          bd(s, it.t, x, y0 + j * h + 0.5, 4.2, h - 0.58, { max: 13.5 });
        }
      },
    ],
    process: [
      async (d) => { // a dashed route climbs over the leaves, a dated stamp under each leg of the journey
        const s = pg(d), n = d.steps.length, w = 9.2 / n, rise = n === 4 ? 0.28 : 0.4, y0 = 1.12 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, y = y0 - i * rise, c = stamp(s, x + 0.05, y, w - 0.14, 5.2 - y, i * 2 + 1, false);
          if (i < n - 1) t.line(s, x + w - 0.3, y - rise + 0.2, 0.45, rise, C.ink, 1.25, { dash: 'dash', flipV: true });
          k.txt(s, String(i + 1).padStart(2, '0'), x + 0.2, y + 0.1, 0.9, 0.45, { size: 20, bold: true, font: CM, color: c, valign: 'middle' });
          hd(s, st.h.toUpperCase(), x + 0.2, y + 0.55, w - 0.42, 0.56, { color: c, valign: 'top', max: 13 });
          bd(s, st.t, x + 0.2, y + 1.12, w - 0.42, 5.1 - y - 1.12, { max: 13, ls: 1.12 });
        }
      },
      async (d) => { // the perforated number runs down the middle, steps turn out from it by turns
        const s = pg(d), n = d.steps.length, rh = 4.2 / n, w = 4.1; let g = '';
        for (let y = 0; y < 42; y++) g += `<circle cx="8" cy="${y * 10 + 5}" r="2.6" fill="#${C.ink}"/>`;
        t.img(s, await k.svg('perf', `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="420">${g}</svg>`, 16, 420), 4.92, 1.0, 0.16, 4.2);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.0 + i * rh, right = i % 2 === 1, x = right ? 5.5 : 0.4, a = right ? 'left' : 'right', dd = Math.min(0.56, rh - 0.12), c = round(s, 5 - dd / 2, y + (rh - dd) / 2, dd, i * 2 + 1);
          k.txt(s, String(i + 1), 5 - dd / 2, y + (rh - dd) / 2, dd, dd, { size: 14, bold: true, font: CM, color: c, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x, y + 0.03, w, 0.34, { color: c, align: a, max: 13 });
          bd(s, st.t, x, y + 0.38, w, rh - 0.42, { align: a, max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the green cover: serial numbers stand in columns under one gilt line
        const s = cover(d), n = d.steps.length, w = 9.1 / n;
        t.line(s, 0.45, 1.05, 9.1, 0, GOLD, 2);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * w;
          if (i) t.line(s, x - 0.08, 1.2, 0, 3.8, GOLD, 0.5, { dash: 'dash' });
          k.txt(s, String(i + 1).padStart(2, '0'), x + 0.04, 1.12, w - 0.2, 0.9, { size: 44, bold: true, font: CM, color: GOLD, valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x + 0.04, 2.05, w - 0.24, 0.6, { color: PALE, valign: 'top', max: 13 });
          bd(s, st.t, x + 0.04, 2.68, w - 0.24, 2.4, { color: PALE, max: 13.5 });
        }
      },
      async (d) => { // the globe at the centre, ports of call around it
        const s = pg(d), n = d.steps.length, dd = 2.2, cx = 5, cy = 3.12, W = 3.05, H = 1.92, ink = '9FC3A8', pos = n === 4 ? [[0.4, 1.12, 0], [6.55, 1.12, 1], [6.55, 3.25, 1], [0.4, 3.25, 0]] : [[0.4, 1.12, 0], [6.55, 2.2, 1], [0.4, 3.25, 0]];
        t.img(s, await k.svg('globe', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><g fill="none" stroke="#${C.inks[2]}" stroke-width="3"><circle cx="150" cy="150" r="146" fill="#FFFFFF"/><ellipse cx="150" cy="150" rx="55" ry="146"/><ellipse cx="150" cy="150" rx="105" ry="146"/><line x1="4" y1="150" x2="296" y2="150"/><path d="M26,74 H274 M26,226 H274"/></g></svg>`, 300, 300), cx - dd / 2, cy - dd / 2, dd, dd);
        void ink;
        for (const [i, st] of d.steps.entries()) {
          const [x, y, right] = pos[i], a = right ? 'left' : 'right', c = C.inks[(i * 2 + 1) % 6], bx = right ? x : x + W - 0.48;
          round(s, bx, y, 0.48, i * 2 + 1);
          k.txt(s, String(i + 1), bx, y, 0.48, 0.48, { size: 13, bold: true, font: CM, color: c, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), right ? x + 0.55 : x, y, W - 0.55, 0.48, { color: c, align: a, max: 12.5 });
          bd(s, st.t, x, y + 0.52, W, H - 0.56, { align: a, max: 12.5, ls: 1.1 });
        }
      },
    ],
    stats: [
      async (d) => { // one great round stamp for the first figure, smaller boxed stamps for the others
        const s = pg(d), [a, ...rest] = d.stats, dd = 3.95, x = 0.45, y = 1.15, c = round(s, x, y, dd, 1);
        hd(s, a.value, x + 0.45, y + 0.8, dd - 0.9, 1.15, { max: 50, min: 22, color: c, align: 'center', font: CM });
        bd(s, a.label, x + 0.6, y + 2.0, dd - 1.2, 1.0, { align: 'center', max: 13, ls: 1.08 });
        rest.forEach((v, i) => { const yy = 1.12 + i * 1.12, cc = stamp(s, 4.75, yy, 4.85, 1.02, i ? 5 : 2, false); hd(s, v.value, 4.92, yy + 0.08, 2.0, 0.86, { max: 26, min: 14, color: cc, font: CM }); bd(s, v.label, 6.95, yy + 0.08, 2.5, 0.86, { valign: 'middle', max: 12, ls: 1.05 }); });
        if (d.note) bd(s, d.note, 4.75, 3.42, 4.85, 1.76, { valign: 'middle', italic: true, max: 13.5 });
      },
      async (d) => { // the figures entered on a form: dotted lines and a value set in type
        const s = pg(d);
        t.rect(s, 0.4, 1.08, 9.2, 3.05, WH, { t: 25, line: { color: C.ink, width: 1 }, name: 'Form' });
        for (const [i, v] of d.stats.entries()) {
          const y = 1.12 + i * 1.0;
          if (i) t.line(s, 0.4, y - 0.01, 9.2, 0, C.ink, 0.75, { dash: 'sysDot' });
          k.txt(s, `0${i + 1}`, 0.55, y, 0.55, 0.96, { size: 13, bold: true, font: CM, color: C.inks[2], valign: 'middle' });
          bd(s, v.label, 1.15, y, 4.4, 0.96, { valign: 'middle', max: 13.5 });
          hd(s, v.value, 5.7, y, 3.75, 0.96, { max: 36, min: 18, align: 'right', font: CM, color: C.inks[(i * 2 + 1) % 6] });
        }
        if (d.note) bd(s, d.note, 0.4, 4.18, 9.2, 1.08, { valign: 'middle', italic: true, max: 13.5 });
      },
      async (d) => { // the green cover: three gilt-ruled panels, the note along the foot
        const s = cover(d), w = 9.1 / 3;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.45 + i * w, pw = w - 0.14;
          t.rect(s, x, 1.08, pw, 2.5, null, { line: { color: GOLD, width: 1.5 }, name: 'Panel' });
          crest(s, x + pw / 2, 1.42, 0.42);
          hd(s, v.value, x + 0.12, 1.68, pw - 0.24, 0.95, { color: GOLD, max: 36, min: 18, align: 'center', font: CM });
          bd(s, v.label, x + 0.15, 2.65, pw - 0.3, 0.88, { color: PALE, align: 'center', max: 12.5, ls: 1.08 });
        }
        if (d.note) bd(s, d.note, 0.45, 3.66, 9.1, 1.48, { color: PALE, valign: 'middle', italic: true, align: 'center', max: 13.5 });
      },
    ],
    compare: [
      async (d) => { // departure and arrival: the green cover on the left, the open leaf on the right, sides mirrored
        const s = pg({}, { noHead: true, fx: 5.35, fw: 4.25 });
        t.rect(s, 0, 0, 5, 5.625, COVER, { name: 'Cover half' });
        k.head(s, (d.title || '').toUpperCase(), 0.4, 0.2, 4.3, 0.85, { max: 16, min: 11, spacing: 1, color: GOLD });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', rh = 3.5 / sd.items.length, ink = i ? C.ink : PALE;
          k.head(s, `${i ? '>>> ' : ''}${sd.h.toUpperCase()}${i ? '' : ' <<<'}`, x, 1.05, w, 0.56, { max: 15, min: 11, align: a, color: i ? C.inks[1] : GOLD });
          sd.items.forEach((it, j) => bd(s, it, x, 1.68 + j * rh, w, rh - 0.05, { align: a, valign: 'middle', color: ink, max: 13.5 }));
        }
      },
      async (d) => { // two bands, each under a head in its own ink
        const s = pg(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.04 + i * 2.14, h = 2.08, c = C.inks[i ? 2 : 1], m = sd.items.length, rows = Math.ceil(m / 2), rh = (h - 0.5) / rows, rw = 4.35;
          t.rect(s, 0, y, 10, h, WH, { t: 25, name: 'Band' }); t.rect(s, 0, y, 10, 0.44, c, { name: 'Band head' });
          hd(s, sd.h.toUpperCase(), 0.4, y, 9.2, 0.44, { color: WH, max: 14, spacing: 1 });
          sd.items.forEach((it, j) => bd(s, it, 0.4 + (j % 2) * (rw + 0.5), y + 0.48 + Math.floor(j / 2) * rh, rw, rh, { valign: 'middle', max: 13, ls: 1.1 }));
        }
      },
    ],
    statement: [
      async (d) => { // the green cover: the crest, the thought below it in gold
        const s = cover(d, { w: 7.4 });
        crest(s, 5, 1.55, 0.95);
        k.head(s, L.runs(d.text), 0.9, 2.1, 8.2, 1.75, { max: 27, min: 15, color: GOLD, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.9, 3.88, 8.2, 1.25, { color: PALE, align: 'center', valign: 'middle', max: 13 });
      },
      async (d) => { // one square red stamp struck a little askew, the machine line along the foot
        const s = pg(d), c = C.inks[1];
        t.rect(s, 0.75, 1.15, 8.5, 2.2, WH, { t: 30, line: { color: c, width: 3.5 }, rotate: -1.2, name: 'Stamp' }); t.rect(s, 0.85, 1.25, 8.3, 2.0, null, { line: { color: c, width: 1 }, rotate: -1.2, name: 'Stamp' });
        k.head(s, L.runs(d.text), 1.1, 1.3, 7.8, 1.9, { max: 26, min: 15, color: c, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.6, 3.48, 8.8, 1.1, { valign: 'middle', align: 'center', max: 12.5 });
        zone(s, 4.66, d.title || 'SLIDEAI', 0.56);
      },
    ],
    timeline: [
      async (d) => { // a dashed route across the leaf, the stamps of each period above and below it by turns
        const s = pg(d), ax = 3.15, xs = [0.4, 2.5, 4.65, 6.55], w = 3.05, h = 1.92;
        t.line(s, 0, ax, 10, 0, C.ink, 1.5, { dash: 'dash' });
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? 1.02 : ax + 0.2, c = stamp(s, x, y, w, h, i * 2 + 1, false);
          t.oval(s, x + 0.25, ax - 0.08, 0.16, 0.16, c);
          hd(s, it.year, x + 0.15, y + 0.1, w - 0.3, 0.36, { color: c, font: CM, max: 16 });
          hd(s, it.h.toUpperCase(), x + 0.15, y + 0.45, w - 0.3, 0.28, { color: c, max: 11.5, min: 10 });
          bd(s, it.t, x + 0.15, y + 0.74, w - 0.3, h - 0.82, { max: 12, ls: 1.08 });
        }
      },
      async (d) => { // the register of travels: a table of entries, the year in type at the left
        const s = pg(d), rh = 4.12 / 4;
        t.rect(s, 0.4, 1.06, 9.2, 4.14, WH, { t: 25, line: { color: C.ink, width: 1 }, name: 'Table' });
        t.line(s, 2.45, 1.06, 0, 4.14, C.ink, 0.75); t.line(s, 4.55, 1.06, 0, 4.14, C.ink, 0.75);
        for (const [i, it] of d.items.entries()) {
          const y = 1.06 + i * rh;
          if (i) t.line(s, 0.4, y, 9.2, 0, C.ink, 0.75);
          hd(s, it.year, 0.48, y, 1.9, rh, { font: CM, color: C.inks[(i * 2 + 1) % 6], max: 16, align: 'center', min: 10 });
          hd(s, it.h.toUpperCase(), 2.55, y + 0.03, 1.9, rh - 0.06, { max: 12 });
          bd(s, it.t, 4.65, y + 0.03, 4.85, rh - 0.06, { valign: 'middle', max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the green cover: the periods cascade down from left to right under gilt lines
        const s = cover(d), rh = 1.0, dx = 1.1;
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * dx, y = 1.05 + i * rh, w = 9.55 - x;
          t.line(s, x, y, w, 0, GOLD, 1.5);
          hd(s, it.year, x, y + 0.04, 1.65, rh - 0.1, { color: GOLD, font: CM, max: 15, min: 10 });
          hd(s, it.h.toUpperCase(), x + 1.7, y + 0.04, w - 1.7, 0.3, { color: PALE, max: 11.5, min: 10 });
          bd(s, it.t, x + 1.7, y + 0.34, w - 1.7, rh - 0.38, { color: PALE, max: 11.5, ls: 1.02 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old staggered stamps were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Pasport', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2F4F3A', lt2: C.paper, accent1: C.inks[0], accent2: C.inks[1], accent3: C.inks[2], accent4: C.inks[3], accent5: C.inks[4], accent6: C.inks[5], hlink: C.inks[2], folHlink: C.muted } });
}
module.exports = { id: 143, slug: 'pasport', name: 'Pasport', category: 'creative', photos: true, build, style: { tone: "sayohat va tajriba: har bir band yangi 'muhr' — qisqa, aniq, esda qoladigan", limits: { card_h: 22, step_h: 22 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["p14:flip|dir=\"r\"", "fade", "cover:l"], "cover": ["typeLetters", "fadeLetters"], "mark": "popOver", "deco": "fade", "sig": {"title": "fadeLetters", "body": "typeLetters", "item": "fadeUp", "image": "fade", "number": "popOver", "order": "seq", "stagger": 0.18}, "tempo": 1.05, "kenburns": false};
