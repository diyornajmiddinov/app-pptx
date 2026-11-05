/** 152 Retsept — a RECIPE CARD on a gingham tablecloth: card with a handwritten-style title, a facts row (author, place, year), ingredients as a checklist, method as numbered steps, a yellow chef's tip note. */
const { kit, L, rowsFit } = require('../free.js');
const C = { cloth: 'D64545', card: 'FFFBF0', ink: '3A2A1E', muted: '6D5A49', accent: 'C0392B', tip: 'FFE58A', line: 'E9D9BF', green: '5A8F3E' };
const F = { head: 'Georgia', body: 'Calibri' };
const gingham = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#FFFFFF"/>${Array.from({ length: 40 }, (_, i) => `<rect x="${i * 40}" y="0" width="20" height="900" fill="#D64545" opacity="0.45"/>`).join('')}${Array.from({ length: 23 }, (_, i) => `<rect x="0" y="${i * 40}" width="1600" height="20" fill="#D64545" opacity="0.45"/>`).join('')}</svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const card = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.35, blur: 8, offset: 3, name: 'Recipe card' }); t.rect(s, x, y + 0.85, w, 0.03, C.accent, { name: 'Rule' }); };
  const facts = (s, x, y, w) => { const f = [['FiUser', k.M.author], ['FiMapPin', k.M.loc], ['FiCalendar', k.M.year]]; const cw = w / 3; return Promise.all(f.map(async ([ic, v], i) => { t.img(s, await k.icon(ic, C.accent, 2), x + i * cw, y + 0.04, 0.22, 0.22); k.txt(s, L.clip(v || '', cw - 0.32, 0.3, 8, F.body), x + i * cw + 0.28, y, cw - 0.32, 0.3, { max: 9, min: 7, color: C.muted, valign: 'middle' }); })); };
  const page = async (d) => { const s = k.slide({ data: await k.svg('g', gingham, 1600, 900, true) }); card(s, 0.35, 0.2, 9.3, 5.0); if (d.title) k.head(s, d.title, 0.6, 0.25, 6.0, 0.62, { max: 24, min: 13, italic: true, color: C.ink }); await facts(s, 6.7, 0.42, 2.8); k.foot(s, { x: 0.6, y: 4.9, w: 8.8, size: 7.5 }); return s; };
  const X = 0.6, W = 8.8, Y = 1.2, Hc = 3.6;
  const steps = (s, list) => { const n = list.length, cols = n > 4 ? 2 : 1, per = Math.ceil(n / cols), w = W / cols - 0.2, rh = Hc / per; list.forEach(([h2, tx], i) => { const x = X + Math.floor(i / per) * (w + 0.4), y = Y + (i % per) * rh; t.oval(s, x, y + 0.04, 0.38, 0.38, C.accent); k.txt(s, String(i + 1), x, y + 0.04, 0.38, 0.38, { size: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.txt(s, [{ text: h2, options: { bold: true } }, { text: tx ? '  ' + tx : '' }], x + 0.5, y, w - 0.5, rh - 0.05, { max: 13, min: 9, ls: 1.25, valign: 'top' }); }); };
  const R = {
    async cover(d) { const s = k.slide({ data: await k.svg('g', gingham, 1600, 900, true) }); card(s, 0.5, 0.45, 5.6, 4.7); k.txt(s, k.org3, 0.75, 0.55, 5.1, 0.3, { size: 11, bold: true, color: C.accent }); k.head(s, d.title, 0.75, 1.42, 5.1, 1.88, { max: 32, min: 15, italic: true, valign: 'top' }); k.txt(s, d.subtitle || '', 0.75, 3.35, 5.1, 0.8, { max: 12, color: C.muted }); await facts(s, 0.75, 4.35, 5.1);
      if (d.image) { t.oval(s, 6.45, 0.9, 3.3, 3.3, 'FFFFFF', { shadow: 0.35, blur: 8, offset: 3 }); await k.photo(s, d.image, 6.6, 1.05, 3.0, 3.0, { mask: 'circle' }); } k.foot(s, { x: 0.75, y: 4.85, w: 5.1, size: 7 }); },
    async intro(d) { const s = await page(d); t.oval(s, X, Y, 3.4, 3.4, 'FFFFFF', { line: { color: C.line, width: 2 } }); await k.photo(s, d.image, X + 0.15, Y + 0.15, 3.1, 3.1, { mask: 'circle' }); k.txt(s, d.text, X + 3.7, Y, W - 3.7, Hc, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d), n = d.items.length, rh = Hc / n; d.items.forEach((it, i) => { const y = Y + i * rh; t.rect(s, X, y + rh / 2 - 0.12, 0.24, 0.24, 'FFFFFF', { line: { color: C.green, width: 1.5 }, name: 'Checkbox' }); k.txt(s, '\u2713', X, y + rh / 2 - 0.16, 0.26, 0.3, { size: 13, bold: true, color: C.green }); k.head(s, it, X + 0.45, y, W - 0.45, rh, { max: 16, bold: false }); t.line(s, X + 0.45, y + rh - 0.04, W - 0.45, 0, C.line, 0.75, { dash: 'dash' }); }); },
    async cards(d) { const s = await page(d); steps(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = await page(d); steps(s, d.steps.map((st) => [st.h, st.t])); },
    async stats(d) { const s = await page(d), n = d.stats.length, w = W / n, icons = ['FiClock', 'FiUsers', 'FiThermometer']; for (const [i, v] of d.stats.entries()) { const x = X + i * w; t.img(s, await k.icon(icons[i % 3], C.accent, 1.5), x + w / 2 - 0.35, Y, 0.7, 0.7); k.head(s, v.value, x + 0.1, Y + 0.8, w - 0.2, 0.9, { max: 40, min: 16, align: 'center', color: C.accent, italic: true }); k.txt(s, v.label, x + 0.1, Y + 1.75, w - 0.2, 1.15, { max: 12, align: 'center' }); } if (d.note) { t.rect(s, X, Y + 3.0, W, 0.6, C.tip, { name: 'Tip' }); k.txt(s, d.note, X + 0.15, Y + 3.0, W - 0.3, 0.6, { max: 10, valign: 'middle' }); } },
    async compare(d) { const s = await page(d), w = W / 2 - 0.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.35, F.body, 0.1, Hc - 0.55); [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.4); k.head(s, sd.h, x, Y, w, 0.45, { max: 17, italic: true, color: i ? C.green : C.accent }); let y = Y + 0.55; sd.items.forEach((it, j) => { k.txt(s, i ? '\u2713' : '\u2022', x, y, 0.3, 0.3, { size: 12, bold: true, color: i ? C.green : C.accent }); k.txt(s, it, x + 0.3, y, w - 0.35, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); t.rect(s, 1.3, Y + 0.1, 7.4, 2.6, C.tip, { rotate: -1.2, shadow: 0.2, blur: 4, offset: 2, name: 'Tip note' }); k.head(s, L.runs(d.text), 1.6, Y + 0.25, 6.8, 2.3, { max: 26, min: 13, italic: true, align: 'center' }); if (d.caption) k.txt(s, d.caption, X, Y + 2.85, W, 0.8, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); steps(s, d.items.map((it) => [`${it.year} \u2014 ${it.h}.`, it.t])); },
    async quote(d) { const s = await page({}); t.rect(s, 1.3, Y + 0.1, 7.4, 2.9, C.tip, { rotate: 1, shadow: 0.2, blur: 4, offset: 2, name: 'Tip note' }); k.head(s, `\u201C${d.text}\u201D`, 1.6, Y + 0.25, 6.8, 2.2, { max: 24, min: 12, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.6, Y + 2.5, 6.8, 0.4, { size: 13, bold: true, color: C.accent, align: 'center' }); },
    async sources(d) { const s = await page(d); steps(s, d.items.map((it) => ['', it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in the kitchen: the chalk menu board, the wooden table, the cookbook, the cake (L.pages)
  const BOARD = '2B3531', CHALK = 'F2EFE6', CHALKY = 'F6D76B', CHALKP = 'F4B3A8', CHALKM = 'BFC8C1', OAK = '8A5A33', DGREEN = '3F6F2A', CHOC = '6B3F2A';
  const wood = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#A06C3F"/>${Array.from({ length: 6 }, (_, i) => `<rect y="${i * 150}" width="1600" height="147" fill="#${i % 2 ? '9A663A' : 'A87446'}"/><rect y="${i * 150 + 147}" width="1600" height="3" fill="#6E4524"/><path d="M0,${i * 150 + 50} C400,${i * 150 + 30} 900,${i * 150 + 95} 1600,${i * 150 + 60}" fill="none" stroke="#8A5A33" stroke-width="2" opacity="0.6"/>`).join('')}</svg>`;
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, italic: true, ...o });
  // the bare table: a paper strip for the title, one under the footer, nothing else
  const table = async (d, kind = 'g') => { const s = kind === 'g' ? k.slide({ data: await k.svg('g', gingham, 1600, 900, true) }) : k.slide({ data: await k.svg('wood', wood, 1600, 900, true) }); t.rect(s, 0, 0.18, 10, 0.72, C.card, { shadow: 0.3, blur: 5, offset: 2, name: 'Title strip' }); hd(s, d.title || '', 0.5, 0.2, 9.0, 0.68, { max: 22, min: 13, color: C.ink }); t.rect(s, 0, 5.29, 10, 0.34, C.card, { name: 'Foot strip' }); k.foot(s, { x: 0.5, y: 5.34, w: 9.0, size: 7.5 }); return s; };
  // the chalkboard in its wooden frame
  const board = (d) => { const s = k.slide(BOARD); t.rect(s, 0.05, 0.05, 9.9, 5.525, null, { line: { color: OAK, width: 8 }, name: 'Frame' }); hd(s, d.title || '', 0.45, 0.22, 9.1, 0.62, { max: 24, min: 13, color: CHALK }); t.line(s, 0.45, 0.88, 9.1, 0, CHALKM, 1, { dash: 'dash' }); k.foot(s, { x: 0.45, y: 5.26, w: 9.1, size: 7.5, color: CHALKM }); return s; };
  const plate = (s, x, y, dd) => { t.oval(s, x, y, dd, dd, 'FFFFFF', { line: { color: 'D8CDB8', width: 1.5 }, name: 'Plate', }); t.oval(s, x + dd * 0.08, y + dd * 0.08, dd * 0.84, dd * 0.84, 'FFFFFF', { line: { color: 'E9E0CE', width: 1 }, name: 'Well' }); };
  const fork = (s, x, y, h) => { t.rect(s, x, y + 0.5, 0.07, h - 0.5, 'C9CDD1', { name: 'Fork' }); t.rect(s, x - 0.09, y + 0.34, 0.25, 0.2, 'C9CDD1', { name: 'Fork' }); [-0.09, -0.005, 0.08].forEach((dx) => t.rect(s, x + dx, y, 0.05, 0.36, 'C9CDD1', { name: 'Tine' })); };
  const knife = (s, x, y, h) => { t.rect(s, x, y, 0.15, h * 0.5, 'C9CDD1', { r: 0.05, name: 'Blade' }); t.rect(s, x + 0.03, y + h * 0.5, 0.09, h * 0.5, '8A8F94', { name: 'Handle' }); };
  const half = (str) => { const w = String(str).split(' '), m = Math.ceil(w.length / 2); return [w.slice(0, m).join(' '), w.slice(m).join(' ')]; };
  const V = {
    image: [
      async (d) => { // the dish across the head of the card, its description beneath
        const s = await page(d);
        await k.photo(s, d.image, X, Y, W, 1.8);
        t.rect(s, X, Y, W, 1.8, null, { line: { color: C.line, width: 1.5 }, name: 'Picture edge' });
        bd(s, d.text, X, Y + 1.88, W, 1.8, { max: 13, valign: 'middle' });
      },
      async (d) => { // an open cookbook lying on the table: picture on one page, words on the other
        const s = k.slide({ data: await k.svg('wood', wood, 1600, 900, true) }), x = 0.45, y = 0.3, w = 9.1, h = 4.88;
        t.rect(s, x, y, w, h, C.card, { shadow: 0.45, blur: 8, offset: 4, name: 'Open book' });
        t.line(s, x + w / 2, y, 0, h, C.line, 2.5);
        await k.photo(s, d.image, x + 0.2, y + 0.2, w / 2 - 0.4, h - 0.4);
        hd(s, d.title || '', x + w / 2 + 0.25, y + 0.14, w / 2 - 0.5, 0.82, { max: 18, min: 12, color: C.accent });
        bd(s, d.text, x + w / 2 + 0.25, y + 1.02, w / 2 - 0.5, h - 1.15, { max: 13 });
        t.rect(s, 0, 5.29, 10, 0.34, C.card, { name: 'Foot strip' }); k.foot(s, { x: 0.5, y: 5.34, w: 9.0, size: 7.5 });
      },
      async (d) => { // the picture is the whole table, a small recipe card lies on it
        const s = k.slide(C.card), x = 5.85, y = 0.35, w = 3.8, h = 4.9;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x, y, w, h, C.card, { shadow: 0.45, blur: 8, offset: 3, name: 'Recipe card' });
        hd(s, d.title || '', x + 0.2, y + 0.08, w - 0.4, 0.8, { max: 17, min: 12 });
        t.rect(s, x, y + 0.92, w, 0.03, C.accent, { name: 'Rule' });
        bd(s, d.text, x + 0.2, y + 1.0, w - 0.4, h - 1.35, { max: 12.5, valign: 'middle' });
        k.foot(s, { x: x + 0.2, y: y + h - 0.3, w: w - 0.4, size: 6.5 });
      },
      async (d) => { // on the chalkboard the dish hangs as a round plate, the words in chalk at its side
        const s = board(d), dd = 3.85, x = 5.75, y = 1.1;
        t.oval(s, x - 0.08, y - 0.08, dd + 0.16, dd + 0.16, null, { line: { color: CHALK, width: 2.5, dashType: 'sysDash' }, name: 'Chalk ring' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        bd(s, d.text, 0.5, 1.05, 4.95, 4.1, { color: CHALK, max: 13.5, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // index cards laid on the cloth at uneven heights, each with a red top line
        const s = await table(d), n = d.items.length, gap = 0.16, w = (9.3 - gap * (n - 1)) / n, drop = [0.32, 0, 0.26, 0.05], h = 3.92;
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * (w + gap), y = 1.0 + drop[i];
          t.rect(s, x, y, w, h, C.card, { shadow: 0.35, blur: 6, offset: 3, name: 'Index card' });
          t.rect(s, x, y + 0.72, w, 0.03, C.accent, { name: 'Rule' });
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.16, y + 0.17, 0.38, 0.38);
          hd(s, it.h, x + 0.16, y + 0.8, w - 0.3, 0.58, { max: 14, min: 10.5, color: C.ink, valign: 'top' });
          bd(s, it.t, x + 0.16, y + 1.42, w - 0.3, h - 1.55, { color: C.muted, max: 13 });
        }
      },
      async (d) => { // the shopping list: a ticked box, a little picture and a dotted line under each row
        const s = await page(d), n = d.items.length, rh = 3.62 / n;
        for (const [i, it] of d.items.entries()) {
          const y = Y + i * rh, m = y + rh / 2;
          t.rect(s, X, m - 0.14, 0.28, 0.28, 'FFFFFF', { line: { color: C.green, width: 1.5 }, name: 'Checkbox' });
          k.txt(s, '✓', X, m - 0.19, 0.3, 0.34, { size: 15, bold: true, color: C.green });
          t.img(s, await k.icon(it.icon, C.accent, 2), X + 0.45, m - 0.17, 0.34, 0.34);
          hd(s, it.h, X + 0.92, y, 2.6, rh - 0.08, { max: 15, min: 11, color: C.ink });
          bd(s, it.t, X + 3.6, y, W - 3.6, rh - 0.08, { valign: 'middle', max: 13 });
          if (i < n - 1) t.line(s, X, y + rh - 0.04, W, 0, C.line, 1, { dash: 'dash' });
        }
      },
      async (d) => { // today's menu on the board: chalk crossing lines, 2x2 or three columns
        const s = board(d), n = d.items.length, cols = n === 4 ? 2 : 3, w = 9.1 / cols, H2 = n === 4 ? 2.1 : 4.2, inks = [CHALKY, CHALKP, CHALK, CHALKY];
        if (n === 4) { t.line(s, 5, 1.05, 0, 4.1, CHALKM, 1, { dash: 'dash' }); t.line(s, 0.45, 3.08, 9.1, 0, CHALKM, 1, { dash: 'dash' }); } else [1, 2].forEach((c) => t.line(s, 0.45 + c * w, 1.05, 0, 4.1, CHALKM, 1, { dash: 'dash' }));
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + (i % cols) * w + 0.16, y = 1.0 + Math.floor(i / cols) * H2 + 0.08, ww = w - 0.32;
          t.img(s, await k.icon(it.icon, inks[i], 1.75), x, y + 0.03, n === 4 ? 0.4 : 0.6, n === 4 ? 0.4 : 0.6);
          if (n === 4) { hd(s, it.h, x + 0.5, y, ww - 0.5, 0.46, { color: inks[i], max: 16 }); bd(s, it.t, x, y + 0.54, ww, H2 - 0.66, { color: CHALK, max: 13 }); }
          else { hd(s, it.h, x, y + 0.72, ww, 0.7, { color: inks[i], max: 17, valign: 'top' }); bd(s, it.t, x, y + 1.48, ww, H2 - 1.6, { color: CHALK, max: 14 }); }
        }
      },
      async (d) => { // the place setting: a plate in the middle of the table, notes laid round it
        const s = await table(d, 'w'), n = d.items.length, dd = 1.9, cx = 5, cy = n === 4 ? 3.1 : 2.2, spots = n === 4 ? [[0.3, 1.02, 3.55, 2.0], [6.15, 1.02, 3.55, 2.0], [0.3, 3.18, 3.55, 2.02], [6.15, 3.18, 3.55, 2.02]] : [[0.3, 1.05, 3.55, 2.45], [6.15, 1.05, 3.55, 2.45], [1.5, 3.42, 7.0, 1.76]];
        plate(s, cx - dd / 2, cy - dd / 2, dd);
        fork(s, cx - dd / 2 - 0.05, cy - 0.68, 1.3); knife(s, cx + dd / 2 - 0.1, cy - 0.68, 1.3);
        t.img(s, await k.icon('FiHeart', C.accent, 1.75), cx - 0.3, cy - 0.3, 0.6, 0.6);
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, i % 2 ? C.card : 'FFF3C9', { shadow: 0.35, blur: 5, offset: 2, name: 'Note' });
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.14, y + 0.1, 0.32, 0.32);
          hd(s, it.h, x + 0.54, y + 0.05, w - 0.66, 0.42, { color: C.ink, max: 14 });
          bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.6, { max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // the cake: each step a layer, wider towards the plate, a cherry on the very top
        const s = await table(d), n = d.steps.length, y0 = 1.18, rh = (5.22 - y0) / n, fills = n === 4 ? ['F4D9A7', 'F2B5A8', CHOC, 'D9A05B'] : ['F4D9A7', 'F2B5A8', CHOC], inks = n === 4 ? [C.ink, C.ink, 'FFFFFF', C.ink] : [C.ink, C.ink, 'FFFFFF'];
        t.oval(s, 4.82, 0.93, 0.36, 0.36, C.accent, { name: 'Cherry' });
        for (const [i, st] of d.steps.entries()) {
          const w = 6.2 + i * (3.2 / (n - 1)), x = 5 - w / 2, y = y0 + i * rh;
          t.rect(s, x, y, w, rh - 0.03, fills[i], { r: 0.08, shadow: 0.25, blur: 3, offset: 1, name: 'Layer' });
          k.txt(s, String(i + 1), x + 0.14, y, 0.5, rh - 0.03, { size: 26, bold: true, italic: true, font: F.head, color: inks[i], valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.7, y + 0.05, w - 0.9, 0.34, { color: inks[i], max: 14, valign: 'top' });
          bd(s, st.t, x + 0.7, y + 0.4, w - 0.9, rh - 0.46, { color: inks[i], max: 12.5 });
        }
      },
      async (d) => { // a kebab skewer down the table: each step a piece on it, a note at the side
        const s = await table(d, 'w'), n = d.steps.length, y0 = 1.0, rh = 4.25 / n, tones = [[C.accent, 'FFFFFF'], [DGREEN, 'FFFFFF'], ['E6A23C', C.ink], [CHOC, 'FFFFFF']];
        t.rect(s, 4.96, 0.92, 0.08, 4.34, 'E9E2D2', { name: 'Skewer' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, w = 4.3, x = right ? 5.45 : 0.25, dd = 0.72, my = y + rh / 2 - dd / 2;
          t.oval(s, 5 - dd / 2, my, dd, dd, tones[i][0], { name: 'Piece' });
          k.txt(s, String(i + 1), 5 - dd / 2, my, dd, dd, { size: 20, bold: true, font: F.head, color: tones[i][1], align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, x, y + 0.03, w, rh - 0.09, C.card, { shadow: 0.35, blur: 5, offset: 2, name: 'Note' });
          hd(s, st.h, x + 0.14, y + 0.04, w - 0.28, 0.3, { color: C.accent, max: 13 });
          bd(s, st.t, x + 0.14, y + 0.34, w - 0.28, rh - 0.4, { max: 12.5 });
        }
      },
      async (d) => { // the method in chalk: rings joined by an arrow, columns of words under them
        const s = board(d), n = d.steps.length, w = 9.1 / n, cy = 1.5, inks = [CHALKY, CHALKP, CHALK, CHALKY];
        t.line(s, 0.9, cy, 8.3, 0, CHALKM, 1.5, { dash: 'dash' });
        k.txt(s, '▸', 9.1, cy - 0.2, 0.4, 0.4, { size: 18, color: CHALKM, valign: 'middle', ls: 1 });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * w + 0.12, ww = w - 0.26, dd = 0.84;
          t.oval(s, x, cy - dd / 2, dd, dd, BOARD, { line: { color: inks[i], width: 2.5 }, name: 'Chalk ring' });
          k.txt(s, String(i + 1), x, cy - dd / 2, dd, dd, { size: 26, bold: true, italic: true, font: F.head, color: inks[i], align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, 2.02, ww, 0.6, { color: inks[i], max: 15, valign: 'top' });
          bd(s, st.t, x, 2.65, ww, 2.5, { color: CHALK, max: 13.5 });
        }
      },
      async (d) => { // yellow tip notes stuck on the card, each a little higher than the last
        const s = await page(d), n = d.steps.length, gap = 0.14, w = (W - gap * (n - 1)) / n, rise = n === 4 ? 0.3 : 0.42, h = 3.62 - (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * (w + gap), y = Y + (n - 1 - i) * rise;
          t.rect(s, x, y, w, h, C.tip, { rotate: i % 2 ? 0.5 : -0.5, shadow: 0.2, blur: 4, offset: 2, name: 'Tip note' });
          k.txt(s, String(i + 1), x + 0.13, y + 0.06, 0.55, 0.5, { size: 24, bold: true, italic: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.13, y + 0.56, w - 0.26, 0.5, { color: C.ink, max: 13, min: 10.5, valign: 'top' });
          bd(s, st.t, x + 0.13, y + 1.08, w - 0.26, h - 1.16, { max: 12 });
        }
      },
    ],
    stats: [
      async (d) => { // the special of the day on the board: one figure large, the two others listed beside it
        const s = board(d), [a, ...rest] = d.stats;
        hd(s, a.value, 0.5, 1.02, 5.2, 1.65, { max: 72, min: 26, color: CHALKY });
        bd(s, a.label, 0.5, 2.7, 5.2, 0.62, { color: CHALK, max: 15, min: 11 });
        t.line(s, 5.95, 1.1, 0, 2.3, CHALKM, 1, { dash: 'dash' });
        rest.forEach((v, i) => { const y = 1.02 + i * 1.2; hd(s, v.value, 6.2, y, 3.3, 0.66, { max: 32, min: 16, color: i ? CHALKP : CHALK }); bd(s, v.label, 6.2, y + 0.66, 3.3, 0.5, { color: CHALKM, max: 12 }); });
        if (d.note) { t.line(s, 0.5, 3.5, 9.0, 0, CHALKM, 1, { dash: 'dash' }); bd(s, d.note, 0.5, 3.58, 9.0, 1.6, { color: CHALK, valign: 'middle', max: 14 }); }
      },
      async (d) => { // the facts panel on a food packet: heavy black rules, the figures flush right; the tip beside it
        const s = await table(d), x = 0.5, w = 6.0, y0 = 1.08, rh = 1.2;
        t.rect(s, x, y0, w, 4.08, 'FFFFFF', { line: { color: '111111', width: 2 }, name: 'Facts panel' });
        t.rect(s, x + 0.12, y0 + 0.14, w - 0.24, 0.12, '111111', { name: 'Heavy rule' });
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + 0.32 + i * rh;
          if (i) t.line(s, x + 0.12, y, w - 0.24, 0, '111111', 1);
          bd(s, v.label, x + 0.18, y + 0.05, 3.1, rh - 0.1, { color: '111111', valign: 'middle', max: 13 });
          k.head(s, v.value, x + 3.35, y + 0.05, w - 3.53, rh - 0.1, { max: 30, min: 16, color: '111111', align: 'right', font: F.body });
        }
        if (d.note) { t.rect(s, 6.8, 1.3, 2.9, 3.6, C.tip, { rotate: 1.2, shadow: 0.25, blur: 5, offset: 2, name: 'Tip note' }); bd(s, d.note, 7.0, 1.45, 2.5, 3.3, { valign: 'middle', max: 13.5 }); }
      },
    ],
    compare: [
      async (d) => { // salt and pepper: the page parts into a red half and a green half, the two sides mirrored
        const s = await table(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, 4.1, F.body, 0.12, 3.15);
        t.rect(s, 0, 0.9, 5, 4.39, C.accent, { name: 'Side' }); t.rect(s, 5, 0.9, 5, 4.39, DGREEN, { name: 'Side' });
        t.oval(s, 4.62, 2.72, 0.76, 0.76, C.card, { name: 'Middle' });
        k.txt(s, '↔', 4.62, 2.72, 0.76, 0.76, { size: 22, bold: true, font: F.body, color: C.ink, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.5 : 0.4, w = 4.1, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.0, w, 0.6, { max: 19, min: 12, color: 'FFFFFF', align: a });
          let y = 1.72; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: 'FFFFFF', align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // on the card, one note above the other, each with its lines side by side
        const s = await page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? Y + 1.87 : Y, h = 1.77, n = sd.items.length, x0 = X + 1.9, w = (W - 1.9) / n, c = i ? C.green : C.accent;
          t.rect(s, X, y, W, h, i ? 'EAF2DF' : C.tip, { name: 'Note' });
          hd(s, sd.h, X + 0.12, y + 0.08, 1.68, h - 0.16, { max: 16, min: 11, color: i ? DGREEN : C.accent });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.2, 0, h - 0.4, c, 1, { dash: 'dash' }); bd(s, it, x + 0.09, y + 0.06, w - 0.16, h - 0.12, { valign: 'middle', max: 12.5 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the day's saying written large across the board
        const s = board(d);
        hd(s, L.runs(d.text), 0.6, 1.02, 8.8, 2.55, { max: 32, min: 15, color: CHALKY, align: 'center' });
        if (d.caption) { t.line(s, 3.2, 3.62, 3.6, 0, CHALKM, 1.5, { dash: 'dash' }); bd(s, d.caption, 0.8, 3.7, 8.4, 1.48, { color: CHALK, align: 'center', valign: 'middle', max: 13.5 }); }
      },
      async (d) => { // the sentence is served on a plate, knife and fork at its sides, the note on a card
        const s = await table(d, 'w'), dd = 4.15, x = 0.65, y = 1.03;
        plate(s, x, y, dd);
        fork(s, 0.22, y + 0.6, 2.9); knife(s, x + dd + 0.08, y + 0.6, 2.9);
        hd(s, L.runs(d.text), x + 0.55, y + 0.65, dd - 1.1, dd - 1.3, { max: 22, min: 13, color: C.ink, align: 'center' });
        if (d.caption) { t.rect(s, 5.3, 1.4, 4.4, 3.4, C.card, { shadow: 0.35, blur: 6, offset: 3, name: 'Note' }); t.rect(s, 5.3, 1.4, 4.4, 0.08, C.accent, { name: 'Rule' }); bd(s, d.caption, 5.5, 1.56, 4.0, 3.12, { valign: 'middle', max: 14, ls: 1.22 }); }
      },
    ],
    timeline: [
      async (d) => { // the cookbook's coloured index tabs: a year stuck out from the card's edge at each row
        const s = await page(d), rh = 3.62 / 4, tabs = [C.accent, DGREEN, CHOC, '9C5A1F'];
        for (const [i, it] of d.items.entries()) {
          const y = Y + i * rh;
          t.rect(s, 0.1, y + 0.05, 1.7, rh - 0.1, tabs[i], { r: 0.05, name: 'Tab' });
          hd(s, it.year, 0.18, y + 0.05, 1.56, rh - 0.1, { color: 'FFFFFF', max: 17, min: 10.5, align: 'center', italic: false });
          hd(s, it.h, 1.95, y, 2.15, rh - 0.04, { color: C.ink, max: 14, min: 10.5 });
          bd(s, it.t, 4.2, y, 5.25, rh - 0.04, { valign: 'middle', max: 12.5 });
          if (i < 3) t.line(s, 1.95, y + rh - 0.02, 7.5, 0, C.line, 0.75);
        }
      },
      async (d) => { // plates along a green runner on the table, a year on each, the event on a card below
        const s = await table(d, 'w'), w = 2.3, gap = 0.1, dd = 1.5;
        t.rect(s, 0, 1.12, 10, 1.28, DGREEN, { name: 'Runner' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * (w + gap), cx = x + w / 2;
          plate(s, cx - dd / 2, 1.0, dd);
          hd(s, it.year, cx - 0.58, 1.2, 1.16, 1.1, { max: 17, min: 10, color: C.accent, align: 'center', italic: false });
          t.rect(s, x, 2.6, w, 2.6, C.card, { shadow: 0.35, blur: 5, offset: 2, name: 'Card' });
          hd(s, it.h, x + 0.14, 2.65, w - 0.28, 0.54, { color: C.ink, max: 13.5, min: 10.5 });
          bd(s, it.t, x + 0.14, 3.22, w - 0.28, 1.94, { max: 12.5 });
        }
      },
      async (d) => { // a chalk line across the board, the years in turn over and under it
        const s = board(d), ay = 3.05, w = 3.3, step = 1.9;
        t.line(s, 0.45, ay, 9.1, 0, CHALK, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * step, up = i % 2 === 0, y = up ? 1.0 : ay + 0.14, h = up ? ay - 1.1 : 5.2 - y;
          t.oval(s, x - 0.02, ay - 0.1, 0.2, 0.2, up ? CHALKY : CHALKP);
          hd(s, it.year, x, y, 1.3, 0.42, { max: 16, min: 10.5, color: up ? CHALKY : CHALKP, italic: false });
          hd(s, it.h, x + 1.32, y, w - 1.32, 0.42, { max: 12.5, min: 10, color: CHALK });
          bd(s, it.t, x, y + 0.44, w, h - 0.48, { color: CHALK, max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process and timeline were the same list of numbered steps
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Retsept', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '5A3E2B', lt2: C.card, accent1: C.accent, accent2: C.green, accent3: 'E6A23C', accent4: C.tip, accent5: C.muted, accent6: C.line, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 152, slug: 'retsept', name: 'Retsept', category: 'creative', photos: true, build, style: { tone: "amaliy qo'llanma: nima kerak, qanday qilinadi, natija; sodda va iliq", limits: {}, prefer: null } };
