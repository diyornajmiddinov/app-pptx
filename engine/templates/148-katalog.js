/** 148 Katalog — a library CARD CATALOGUE: an oak cabinet of drawers with brass label holders and pulls; ideas are typed on index cards (ruled, red top line) inside the drawers. */
const { kit, L, rowsFit } = require('../free.js');
const C = { oak: 'A9713F', oak2: '8A5A31', brass: 'C9A646', card: 'FFFDF4', ink: '262016', muted: '5E5341', red: 'C0392B', rule: 'B9D4EE' };
const F = { head: 'Courier New', body: 'Courier New' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const grain = async (s) => t.img(s, await k.svg('oak', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.oak}"/>${Array.from({ length: 60 }, (_, i) => `<path d="M0,${i * 15 + 5} C400,${i * 15 + (i % 3) * 6} 1000,${i * 15 + 12} 1600,${i * 15 + 4}" fill="none" stroke="#${C.oak2}" stroke-opacity="0.35" stroke-width="2"/>`).join('')}</svg>`, 1600, 900, true), 0, 0, 10, 5.625);
  // drawer front: frame, brass label holder (label text), pull; returns the index-card area
  const drawer = (s, x, y, w, h, label) => { t.rect(s, x, y, w, h, C.oak2, { line: { color: '5C3A1E', width: 1.5 }, shadow: 0.3, blur: 3, offset: 2, name: 'Drawer' }); t.rect(s, x + w / 2 - 0.75, y + 0.1, 1.5, 0.42, C.brass, { r: 0.04, name: 'Label holder' }); t.rect(s, x + w / 2 - 0.65, y + 0.14, 1.3, 0.34, C.card, { name: 'Label' }); k.txt(s, label, x + w / 2 - 0.65, y + 0.14, 1.3, 0.34, { max: 10, min: 6.5, bold: true, align: 'center', valign: 'middle', font: F.head }); t.oval(s, x + w / 2 - 0.15, y + h - 0.3, 0.3, 0.2, C.brass); };
  const card = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.25, blur: 3, offset: 1, name: 'Index card' }); t.line(s, x, y + 0.42, w, 0, C.red, 1.25); for (let ly = y + 0.7; ly < y + h - 0.1; ly += 0.28) t.line(s, x, ly, w, 0, C.rule, 0.5); t.oval(s, x + w / 2 - 0.06, y + h - 0.2, 0.12, 0.12, 'E0D8C0'); };
  const page = async (d) => { const s = k.slide(C.oak); await grain(s); t.rect(s, 0.35, 0.18, 9.3, 0.75, C.oak2, { name: 'Cabinet top' }); if (d.title) k.head(s, d.title, 0.55, 0.18, 7.8, 0.75, { max: 22, min: 12, color: C.card, font: F.head }); k.txt(s, `${k.idx}`, 8.6, 0.18, 0.9, 0.75, { size: 18, bold: true, color: C.brass, align: 'right', valign: 'middle', font: F.head }); k.foot(s, { y: 5.32, size: 7.5, color: 'F3E3C8', font: F.body }); return s; };
  // cards standing in a row: header on the red line, text on the rules
  const cards = (s, n, draw) => { const gap = 0.2, w = (9.3 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.35 + i * (w + gap); card(s, x, 1.1, w, 4.05); draw(i, x + 0.12, 1.1, w - 0.24, 4.05); } };
  const R = {
    async cover(d) { const s = k.slide(C.oak); await grain(s); [0, 1, 2].forEach((r) => [0, 1].forEach((c) => drawer(s, 6.0 + c * 1.85, 0.4 + r * 1.55, 1.75, 1.45, [k.M.year, k.M.loc, (k.M.org || '').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 6), (k.M.author || '').split(' ')[0], 'A\u2013K', 'L\u2013Z'][r * 2 + c] || ''))); card(s, 0.5, 0.6, 5.1, 4.3); if (d.image) await k.photo(s, d.image, 3.75, 1.2, 1.65, 1.9, { gray: true });
      k.txt(s, `${k.M.year || ''}  ${k.M.org || ''}`, 0.65, 0.65, 4.8, 0.35, { size: 10, color: C.red, font: F.head }); k.head(s, d.title, 0.65, 1.15, d.image ? 3.0 : 4.8, 2.3, { max: 26, min: 12, font: F.head, valign: 'top' }); k.txt(s, d.subtitle || '', 0.65, 3.5, 4.8, 0.7, { max: 11, color: C.muted, font: F.head }); k.txt(s, k.M.author || '', 0.65, 4.25, 4.8, 0.4, { size: 13, bold: true, font: F.head }); k.foot(s, { y: 5.32, size: 7.5, color: 'F3E3C8', font: F.body }); },
    async intro(d) { const s = await page(d); card(s, 0.35, 1.1, 3.6, 4.05); await k.photo(s, d.image, 0.5, 1.6, 3.3, 3.2, { gray: true }); card(s, 4.15, 1.1, 5.5, 4.05); k.txt(s, d.text, 4.3, 1.6, 5.2, 3.45, { max: 13, min: 9.5, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); const n = d.items.length, cols = Math.min(3, n), rws = Math.ceil(n / cols), w = (9.3 - 0.15 * (cols - 1)) / cols, h = (4.1 - 0.15 * (rws - 1)) / rws; d.items.forEach((it, i) => { const x = 0.35 + (i % cols) * (w + 0.15), y = 1.1 + Math.floor(i / cols) * (h + 0.15); drawer(s, x, y, w, h, `${i + 1}`); k.head(s, it, x + 0.2, y + 0.6, w - 0.4, h - 0.95, { max: 15, color: C.card, font: F.head, align: 'center' }); }); },
    async cards(d) { const s = await page(d); cards(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 13, font: F.head }); k.txt(s, d.items[i].t, x, y + 0.5, w, h - 0.75, { max: 11, ls: 1.25 }); }); },
    async process(d) { const s = await page(d); cards(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 13, font: F.head }); k.txt(s, d.steps[i].t, x, y + 0.5, w, h - 0.75, { max: 11, ls: 1.25 }); }); },
    async stats(d) { const s = await page(d); cards(s, d.stats.length, (i, x, y, w, h) => { k.txt(s, `\u2116 ${i + 1}`, x, y, w, 0.42, { size: 10, color: C.red, valign: 'middle' }); k.head(s, d.stats[i].value, x, y + 0.55, w, 1.1, { max: 40, min: 16, align: 'center', font: F.head }); k.txt(s, d.stats[i].label, x, y + 1.7, w, h - 1.95 - (d.note ? 0.5 : 0), { max: 11, align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.5, 4.55, 9.0, 0.45, { max: 8.5, color: C.muted }); },
    async compare(d) { const s = await page(d); const w = 4.55, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 11, w - 0.3, F.body, 0.1, 3.2); [d.left, d.right].forEach((sd, i) => { const x = 0.35 + i * 4.75; card(s, x, 1.1, w, 4.05); k.head(s, sd.h, x + 0.12, 1.1, w - 0.24, 0.42, { max: 13, font: F.head, color: i ? '1F4E79' : C.red }); let y = 1.6; sd.items.forEach((it, j) => { k.txt(s, it, x + 0.15, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); card(s, 1.2, 1.1, 7.6, 4.05); k.head(s, L.runs(d.text), 1.45, 1.6, 7.1, 2.3, { max: 24, min: 12, font: F.head, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.45, 3.95, 7.1, 1.0, { max: 10, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); cards(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.42, { max: 16, min: 10, font: F.head, color: C.red }); k.head(s, d.items[i].h, x, y + 0.5, w, 0.4, { max: 12, font: F.head }); k.txt(s, d.items[i].t, x, y + 0.95, w, h - 1.2, { max: 11 }); }); },
    async quote(d) { const s = await page({}); card(s, 1.2, 1.1, 7.6, 4.05); k.head(s, `"${d.text}"`, 1.45, 1.6, 7.1, 2.7, { max: 22, min: 11, font: F.head, align: 'center' }); if (d.author) k.txt(s, `-- ${d.author}`, 1.45, 4.35, 7.1, 0.4, { size: 12, bold: true, align: 'right', color: C.red }); },
    async sources(d) { const s = await page(d); card(s, 0.6, 1.1, 8.8, 4.05); const n = d.items.length, rh = 3.45 / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, 0.75, 1.55 + i * rh, 8.5, rh, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, drawer by drawer through the same cabinet: a deck's pages must not look alike (L.pages)
  const CD = C.card, OD = C.oak2, DEEP = '5C3A1E', BLUE = '1F4E79', CR = 'F3E3C8';
  const plain = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill ?? CD, { shadow: 0.25, blur: 3, offset: 1, name: 'Index card', ...(o.rotate ? { rotate: o.rotate } : {}) });
  const label = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.brass, { r: 0.04, name: 'Label holder' }); t.rect(s, x + 0.07, y + 0.05, w - 0.14, h - 0.1, CD, { name: 'Label' }); };
  const pull = (s, cx, y, w = 0.42) => t.oval(s, cx - w / 2, y, w, w * 0.55, C.brass);
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 12.5, min: 10, ls: 1.14, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 13, min: 10, font: F.head, ...o });
  const V = {
    image: [
      async (d) => { // one wide card: words typed on its rules, the picture clipped to its corner
        const s = await page(d);
        card(s, 0.35, 1.08, 9.3, 4.1);
        hd(s, `${k.idx}.`, 0.5, 1.08, 2.0, 0.42, { color: C.red });
        t.rect(s, 5.72, 1.28, 3.7, 3.6, 'FFFFFF', { shadow: 0.25, blur: 3, offset: 1.5, name: 'Print' });
        await k.photo(s, d.image, 5.82, 1.38, 3.5, 3.4, { gray: true });
        t.rect(s, 7.3, 1.14, 0.34, 0.3, C.brass, { r: 0.04, name: 'Clip' });
        bd(s, d.text, 0.5, 1.56, 5.05, 3.52, { valign: 'middle' });
      },
      async (d) => { // the picture sits in a long brass holder, the words on a card pulled out below it
        const s = await page(d);
        t.rect(s, 0.35, 1.08, 9.3, 2.05, C.brass, { r: 0.05, name: 'Holder' });
        await k.photo(s, d.image, 0.45, 1.16, 9.1, 1.89, { gray: true });
        pull(s, 1.0, 3.17); pull(s, 9.0, 3.17);
        plain(s, 0.65, 3.42, 8.7, 1.78);
        bd(s, d.text, 0.82, 3.47, 8.36, 1.68, { valign: 'middle' });
      },
      async (d) => { // on the cabinet side: a round picture in a brass ring, a card of words pinned beside it
        const s = await page(d), dd = 3.85, x = 0.4, y = 1.18;
        t.oval(s, x - 0.08, y - 0.08, dd + 0.16, dd + 0.16, C.brass, { line: { color: DEEP, width: 1.5 } });
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle', gray: true });
        plain(s, 4.55, 1.12, 5.1, 4.04);
        t.oval(s, 7.0, 1.2, 0.18, 0.18, C.red);
        bd(s, d.text, 4.72, 1.42, 4.76, 3.68, { valign: 'middle' });
      },
      async (d) => { // the picture fills the page, one card laid across it a little crooked
        const s = k.slide(C.oak), x = 4.5, y = 0.45, w = 5.1, h = 4.45;
        await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
        plain(s, x, y, w, h, { rotate: 1.2 });
        t.line(s, x + 0.08, y + 0.72, w - 0.16, 0, C.red, 1.25);
        k.head(s, d.title || '', x + 0.2, y + 0.08, w - 1.05, 0.62, { max: 15, min: 10, font: F.head });
        k.txt(s, `${k.idx}`, x + w - 0.75, y + 0.08, 0.55, 0.62, { size: 15, bold: true, color: C.red, align: 'right', valign: 'middle' });
        bd(s, d.text, x + 0.2, y + 0.8, w - 0.4, h - 0.9, { valign: 'middle', max: 11.5 });
        t.rect(s, 0, 5.27, 10, 0.355, OD, { name: 'Foot band' }); k.foot(s, { x: 0.4, y: 5.33, w: 9.2, size: 7.5, color: CR, font: F.body });
      },
    ],
    cards: [
      async (d) => { // dividers filed one behind another: a tab rises from each, always further along
        const s = await page(d), n = d.items.length, rh = 4.05 / n, tabw = 3.35;
        for (const [i, it] of d.items.entries()) {
          const y = 1.12 + i * rh, tx = 0.45 + i * ((9.1 - tabw) / (n - 1)), fill = i % 2 ? 'FAF2DC' : CD;
          t.rect(s, tx, y, tabw, 0.36, fill, { r: 0.05, line: { color: 'B7A67F', width: 0.75 }, name: 'Tab' });
          t.rect(s, 0.35, y + 0.34, 9.3, rh - 0.32 + (i === n - 1 ? -0.04 : 0.32), fill, { line: { color: 'B7A67F', width: 0.75 }, name: 'Divider' });
          t.img(s, await k.icon(it.icon, C.red, 2), tx + 0.08, y + 0.05, 0.26, 0.26);
          hd(s, it.h, tx + 0.38, y + 0.01, tabw - 0.44, 0.34, { max: 12, color: C.red });
          bd(s, it.t, 0.55, y + 0.38, 8.9, rh - 0.42, { valign: 'middle', max: 12, ls: 1.05 });
        }
      },
      async (d) => { // the drawer fronts themselves: heading on the brass label, the words on the dark oak
        const s = await page(d), n = d.items.length, W = 4.58, H = 1.98, pos = n === 4 ? [[0.35, 1.08, W], [5.07, 1.08, W], [0.35, 3.16, W], [5.07, 3.16, W]] : [[0.35, 1.08, W], [5.07, 1.08, W], [0.35, 3.16, 9.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i], lw = 3.5;
          t.rect(s, x, y, w, H, OD, { line: { color: DEEP, width: 1.5 }, shadow: 0.3, blur: 3, offset: 2, name: 'Drawer' });
          label(s, x + (w - lw) / 2, y + 0.08, lw, 0.46);
          t.img(s, await k.icon(it.icon, C.red, 2), x + (w - lw) / 2 + 0.12, y + 0.16, 0.28, 0.28);
          hd(s, it.h, x + (w - lw) / 2 + 0.44, y + 0.12, lw - 0.55, 0.38, { max: 11.5 });
          bd(s, it.t, x + 0.15, y + 0.6, w - 0.3, H - 0.72, { color: CR, max: 12, align: 'center' });
          pull(s, x + w / 2, y + H - 0.16, 0.3);
        }
      },
      async (d) => { // cards laid loose on the cabinet top, each at a slightly different slant and height
        const s = await page(d), n = d.items.length, gap = 0.14, w = (9.3 - gap * (n - 1)) / n, drop = [0.32, 0, 0.42, 0.1], rot = [-0.8, 0.7, -0.5, 0.9];
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * (w + gap), y = 1.1 + drop[i], h = 3.6;
          plain(s, x, y, w, h, { rotate: rot[i] });
          t.line(s, x + 0.08, y + 0.46, w - 0.16, 0, C.red, 1);
          t.img(s, await k.icon(it.icon, C.red, 2), x + 0.1, y + 0.08, 0.3, 0.3);
          hd(s, it.h, x + 0.12, y + 0.5, w - 0.24, 0.6, { valign: 'top', max: 12 });
          bd(s, it.t, x + 0.12, y + 1.12, w - 0.24, h - 1.2, { max: 11.5 });
        }
      },
      async (d) => { // one large card fills the page, a typed entry to each ruled block, the rod hole at its foot
        const s = k.slide(CD), n = d.items.length, rh = 4.2 / n;
        t.line(s, 0, 0.92, 10, 0, C.red, 1.5);
        k.head(s, d.title || '', 0.45, 0.18, 7.9, 0.72, { max: 21, min: 12, font: F.head });
        k.txt(s, `${k.idx}`, 8.6, 0.18, 0.95, 0.72, { size: 18, bold: true, color: C.red, align: 'right', valign: 'middle', font: F.head });
        for (let y = 1.2; y < 5.2; y += 0.28) t.line(s, 0, y, 10, 0, C.rule, 0.5);
        for (const [i, it] of d.items.entries()) {
          const y = 0.98 + i * rh;
          t.img(s, await k.icon(it.icon, BLUE, 2), 0.45, y + 0.1, 0.36, 0.36);
          hd(s, it.h, 0.95, y + 0.04, 8.6, 0.38, { color: BLUE, max: 14 });
          bd(s, it.t, 0.95, y + 0.44, 8.6, rh - 0.5, { max: 12.5 });
        }
        t.oval(s, 4.9, 5.2, 0.2, 0.2, 'E0D8C0');
        k.foot(s, { x: 0.45, y: 5.32, w: 4.2, size: 7, font: F.body, color: C.muted });
      },
    ],
    process: [
      async (d) => { // cards pulled up out of the drawer, each standing higher than the one before
        const s = await page(d), n = d.steps.length, w = 9.3 / n, rise = n === 4 ? 0.34 : 0.48, y0 = 1.1 + (n - 1) * rise;
        t.rect(s, 0, 4.92, 10, 0.3, DEEP, { name: 'Drawer lip' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w, y = y0 - i * rise, h = 4.96 - y;
          plain(s, x + 0.04, y, w - 0.1, h);
          t.line(s, x + 0.04, y + 0.46, w - 0.1, 0, C.red, 1);
          k.txt(s, String(i + 1), x + 0.14, y + 0.02, 0.5, 0.44, { size: 20, bold: true, color: C.red, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.14, y + 0.5, w - 0.3, 0.56, { valign: 'top', max: 12 });
          bd(s, st.t, x + 0.14, y + 1.06, w - 0.3, h - 1.12, { max: 11.5, ls: 1.08 });
        }
        t.rect(s, 0, 4.92, 10, 0.3, DEEP, { name: 'Drawer lip' }); label(s, 4.3, 4.96, 1.4, 0.22);
      },
      async (d) => { // the brass rod runs down the page, a card threaded on it for each step, left and right by turns
        const s = await page(d), n = d.steps.length, rh = 4.08 / n, w = 4.3;
        t.rect(s, 4.95, 0.95, 0.1, 4.27, C.brass, { name: 'Rod' });
        for (const [i, st] of d.steps.entries()) {
          const y = 1.08 + i * rh, right = i % 2 === 1, x = right ? 5.3 : 0.4, c = y + rh / 2, dd = Math.min(0.5, rh - 0.14), h = rh - 0.08;
          plain(s, x, y, w, h);
          t.oval(s, 5 - dd / 2, c - dd / 2, dd, dd, C.brass, { line: { color: DEEP, width: 1 } });
          k.txt(s, String(i + 1), 5 - dd / 2, c - dd / 2, dd, dd, { size: 14, bold: true, color: C.ink, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.12, y + 0.01, w - 0.24, 0.26, { max: 11, color: C.red });
          bd(s, st.t, x + 0.12, y + 0.27, w - 0.24, h - 0.29, { max: 11, ls: 1.0 });
        }
      },
      async (d) => { // the dark inside of the cabinet: brass number plates in a row, words in cream below them
        const s = await page(d), n = d.steps.length, w = 9.3 / n;
        t.rect(s, 0.35, 1.08, 9.3, 4.12, DEEP, { name: 'Inside' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w;
          label(s, x + 0.14, 1.2, 0.95, 0.7);
          k.txt(s, String(i + 1), x + 0.14, 1.2, 0.95, 0.7, { size: 28, bold: true, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.14, 2.0, w - 0.28, 0.6, { color: C.brass, valign: 'top', max: 12 });
          bd(s, st.t, x + 0.14, 2.62, w - 0.28, 2.52, { color: CD, max: 12 });
        }
      },
      async (d) => { // a big brass pull at the centre, cards at the corners numbered round it
        const s = await page(d), n = d.steps.length, W = 3.8, H = 1.97, pos = n === 4 ? [[0.35, 1.08], [5.85, 1.08], [5.85, 3.2], [0.35, 3.2]] : [[0.35, 1.08], [5.85, 2.14], [0.35, 3.2]];
        t.oval(s, 4.25, 2.45, 1.5, 1.5, C.brass, { line: { color: DEEP, width: 2 } }); t.oval(s, 4.55, 2.75, 0.9, 0.9, OD, { line: { color: DEEP, width: 1 } });
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          plain(s, x, y, W, H);
          t.line(s, x, y + 0.44, W, 0, C.red, 1);
          k.txt(s, `${i + 1}.`, x + 0.1, y, 0.45, 0.44, { size: 15, bold: true, color: C.red, valign: 'middle' });
          hd(s, st.h, x + 0.55, y + 0.02, W - 0.65, 0.4, { max: 11.5 });
          bd(s, st.t, x + 0.12, y + 0.5, W - 0.24, H - 0.56, { max: 11.5, ls: 1.08 });
        }
      },
    ],
    stats: [
      async (d) => { // one card with the first figure typed large, two smaller drawers with the others, a slip for the note
        const s = await page(d), [a, ...rest] = d.stats;
        card(s, 0.35, 1.08, 4.6, 4.12);
        hd(s, a.value, 0.55, 1.65, 4.2, 1.35, { max: 48, min: 22, color: C.red, align: 'center' });
        bd(s, a.label, 0.6, 3.1, 4.1, 1.5, { align: 'center', max: 12.5 });
        rest.forEach((v, i) => { const y = 1.08 + i * 1.04; t.rect(s, 5.1, y, 4.55, 0.96, OD, { line: { color: DEEP, width: 1.25 }, name: 'Drawer' }); label(s, 5.2, y + 0.14, 1.95, 0.68); hd(s, v.value, 5.25, y + 0.14, 1.85, 0.68, { max: 20, min: 12, align: 'center' }); bd(s, v.label, 7.25, y + 0.05, 2.32, 0.86, { color: CR, valign: 'middle', max: 11, ls: 1.02 }); });
        plain(s, 5.1, 3.2, 4.55, 2.0);
        if (d.note) bd(s, d.note, 5.24, 3.26, 4.27, 1.88, { valign: 'middle', italic: true, max: 11.5, color: C.muted });
      },
      async (d) => { // three brass holders carry the figures on the oak, the names in cream below, a card for the note
        const s = await page(d), w = 3.1, lh = 1.1;
        t.rect(s, 0.35, 1.08, 9.3, 2.6, OD, { line: { color: DEEP, width: 1.5 }, name: 'Drawer' });
        for (const [i, v] of d.stats.entries()) {
          const x = 0.35 + i * w;
          label(s, x + 0.2, 1.22, w - 0.4, lh);
          hd(s, v.value, x + 0.3, 1.27, w - 0.6, lh - 0.1, { max: 30, min: 15, align: 'center' });
          bd(s, v.label, x + 0.2, 2.42, w - 0.4, 0.82, { color: CR, align: 'center', max: 11.5, ls: 1.05 });
          pull(s, x + w / 2, 3.38, 0.34);
        }
        plain(s, 0.35, 3.82, 9.3, 1.38);
        if (d.note) bd(s, d.note, 0.5, 3.86, 9.0, 1.3, { valign: 'middle', italic: true, max: 12, color: C.muted });
      },
      async (d) => { // a blank-ruled accounts card: lines with a blue figure at the end
        const s = await page(d);
        card(s, 0.8, 1.14, 8.4, 4.06);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.6 + i * 0.84;
          bd(s, v.label, 0.98, y, 4.7, 0.78, { valign: 'middle', max: 12 });
          hd(s, v.value, 5.75, y, 3.27, 0.78, { max: 30, min: 15, align: 'right', color: BLUE });
          t.line(s, 0.95, y + 0.8, 8.1, 0, C.ink, 0.75);
        }
        if (d.note) bd(s, d.note, 0.98, 4.13, 8.04, 1.03, { valign: 'middle', italic: true, max: 11.5, color: C.muted });
      },
    ],
    compare: [
      async (d) => { // two dark drawers opened toward each other, the words reading away from the brass strip
        const s = await page(d);
        t.rect(s, 0.3, 1.08, 4.6, 4.12, DEEP, { line: { color: C.brass, width: 1 }, name: 'Drawer' }); t.rect(s, 5.1, 1.08, 4.6, 4.12, DEEP, { line: { color: C.brass, width: 1 }, name: 'Drawer' });
        t.rect(s, 4.92, 1.0, 0.16, 4.28, C.brass, { name: 'Strip' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.25 : 0.42, w = 4.33, a = i ? 'left' : 'right', rh = 3.35 / sd.items.length;
          hd(s, sd.h, x, 1.14, w, 0.56, { color: C.brass, align: a, max: 14 });
          sd.items.forEach((it, j) => bd(s, it, x, 1.76 + j * rh, w, rh - 0.05, { color: CD, align: a, valign: 'middle', max: 12 }));
        }
      },
      async (d) => { // two wide cards filed one over the other, a tab at the head of each in its own ink
        const s = await page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.06 + i * 2.1, h = 1.68, c = i ? BLUE : C.red, tx = i ? 5.6 : 0.5, m = sd.items.length, rows = Math.ceil(m / 2), rw = 4.45, rh = (h - 0.08) / rows;
          t.rect(s, tx, y, 3.9, 0.34, c, { r: 0.05, name: 'Tab' });
          hd(s, sd.h, tx + 0.1, y, 3.7, 0.34, { color: CD, max: 12 });
          plain(s, 0.35, y + 0.32, 9.3, h);
          sd.items.forEach((it, j) => bd(s, it, 0.5 + (j % 2) * (rw + 0.1), y + 0.36 + Math.floor(j / 2) * rh, rw, rh, { valign: 'middle', max: 11.5, ls: 1.05 }));
        }
      },
    ],
    statement: [
      async (d) => { // a great dark drawer front: the thought in cream, the note on a card slipped under its label
        const s = await page(d);
        t.rect(s, 0.35, 1.08, 9.3, 2.7, DEEP, { line: { color: C.brass, width: 2 }, name: 'Drawer' });
        k.head(s, L.runs(d.text), 0.7, 1.15, 8.6, 2.55, { max: 26, min: 14, color: CD, font: F.head, align: 'center' });
        pull(s, 5, 3.86, 0.5);
        if (d.caption) { plain(s, 0.65, 4.14, 8.7, 1.06); bd(s, d.caption, 0.8, 4.17, 8.4, 1.0, { valign: 'middle', align: 'center', max: 11, ls: 1.02 }); }
      },
      async (d) => { // the librarian's rubber stamp struck across a card, in red
        const s = await page(d);
        card(s, 0.35, 1.2, 9.3, 4.0);
        t.rect(s, 0.85, 1.72, 8.3, 2.2, null, { line: { color: C.red, width: 3 }, rotate: -1.3, name: 'Stamp' });
        k.head(s, L.runs(d.text), 1.1, 1.8, 7.8, 2.04, { max: 24, min: 13, color: C.red, font: F.head, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.6, 4.02, 8.8, 1.12, { valign: 'middle', max: 11, ls: 1.02, align: 'center', color: C.muted });
      },
    ],
    timeline: [
      async (d) => { // the date-due slip: a tall table of stamps, each year struck in its own box
        const s = await page(d), rh = 4.1 / 4;
        plain(s, 0.35, 1.08, 9.3, 4.12);
        t.line(s, 2.65, 1.08, 0, 4.12, C.red, 1);
        for (const [i, it] of d.items.entries()) {
          const y = 1.08 + i * rh;
          if (i) t.line(s, 0.35, y, 9.3, 0, C.rule, 1);
          t.rect(s, 0.48, y + 0.14, 2.03, rh - 0.28, null, { line: { color: BLUE, width: 1.5 }, rotate: i % 2 ? -1 : 1, name: 'Stamp' });
          hd(s, it.year, 0.55, y + 0.14, 1.89, rh - 0.28, { color: BLUE, max: 14, align: 'center' });
          hd(s, it.h, 2.8, y + 0.04, 6.7, 0.3, { max: 12 });
          bd(s, it.t, 2.8, y + 0.34, 6.7, rh - 0.38, { max: 11.5, ls: 1.02 });
        }
      },
      async (d) => { // four drawers along the foot of the page, a year on each label, a card standing in each
        const s = await page(d), w = 9.3 / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * w;
          plain(s, x + 0.1, 1.08, w - 0.2, 3.45);
          t.line(s, x + 0.1, 1.5, w - 0.2, 0, C.red, 1);
          hd(s, it.h, x + 0.2, 1.1, w - 0.4, 0.4, { max: 11.5 });
          bd(s, it.t, x + 0.2, 1.56, w - 0.4, 2.92, { max: 12 });
          t.rect(s, x, 4.5, w - 0.02, 0.72, OD, { line: { color: DEEP, width: 1.5 }, name: 'Drawer' });
          label(s, x + 0.2, 4.56, w - 0.42, 0.42);
          hd(s, it.year, x + 0.28, 4.6, w - 0.58, 0.34, { max: 12, align: 'center', color: C.red });
          pull(s, x + w / 2, 5.04, 0.24);
        }
      },
      async (d) => { // one brass rod across the page, cards threaded on it, hanging above and below by turns
        const s = await page(d), ax = 3.15, xs = [0.4, 2.5, 4.6, 6.5], w = 3.1, h = 1.9;
        t.rect(s, 0, ax - 0.04, 10, 0.08, C.brass, { name: 'Rod' });
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? 1.08 : ax + 0.17;
          plain(s, x, y, w, h);
          t.line(s, x + 0.3, up ? y + h : ax, 0, up ? ax - y - h : y - ax, DEEP, 1.5);
          hd(s, it.year, x + 0.1, y + 0.02, w - 0.2, 0.3, { color: C.red, max: 13 });
          hd(s, it.h, x + 0.1, y + 0.32, w - 0.2, 0.28, { max: 11 });
          bd(s, it.t, x + 0.1, y + 0.6, w - 0.2, h - 0.64, { max: 11, ls: 1.02 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old row of index cards was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Katalog', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.oak2, lt2: C.card, accent1: C.red, accent2: C.brass, accent3: '1F4E79', accent4: C.oak, accent5: C.muted, accent6: C.rule, hlink: '1F4E79', folHlink: C.muted } });
}
module.exports = { id: 148, slug: 'katalog', name: 'Katalog', category: 'academic', photos: true, build, style: { tone: "kutubxona kartotekasi: tasniflangan, aniq yozuvlar; ilmiy va ixcham", limits: { card_t4: 110, step_t: 110 }, prefer: 'text' } };
