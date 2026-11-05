/**
 * 105 Chiziqlar — the slide is a stack of FULL-WIDTH horizontal bands: the title is the top band, every item
 * is its own band in a navy-to-aqua scale, numbers sit at the left edge. No cards, no columns.
 */
const { kit, L, rowsFit } = require('../free.js');
const B = [['0B132B', 'FFFFFF'], ['1C2541', 'FFFFFF'], ['3A506B', 'FFFFFF'], ['5BC0BE', '0B132B'], ['9FF4EA', '0B132B'], ['D8FBF6', '0B132B']];
const C = { ink: '0B132B', muted: '3A506B', accent: '5BC0BE' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const top = (s, d) => { t.rect(s, 0, 0, 10, 1.05, B[0][0], { name: 'Title band' }); k.head(s, d.title || '', 0.5, 0.12, 8.2, 0.8, { max: 28, min: 14, color: 'FFFFFF' }); k.txt(s, String(k.idx).padStart(2, '0'), 8.8, 0.12, 0.8, 0.8, { size: 22, bold: true, color: B[3][0], align: 'right', valign: 'middle' }); };
  const bottom = (s) => { t.rect(s, 0, 5.25, 10, 0.375, B[5][0], { name: 'Foot band' }); k.foot(s, { y: 5.3, color: C.muted }); };
  const bands = (s, n, draw, y0 = 1.05, y1 = 5.25) => { const h = (y1 - y0) / n; for (let i = 0; i < n; i++) { const [bg, fg] = B[Math.min(5, 1 + Math.round(i * 4 / Math.max(1, n - 1)))]; t.rect(s, 0, y0 + i * h, 10, h, bg, { name: 'Band' }); draw(i, y0 + i * h, h, fg); } };
  const page = (d) => { const s = k.slide('FFFFFF'); top(s, d); return s; };
  const R = {
    async cover(d) { const s = k.slide('FFFFFF'); bands(s, 5, () => {}, 0, 5.625); if (d.image) await k.photo(s, d.image, 6.0, 0.55, 3.5, 3.4);
      k.txt(s, k.org3, 0.5, 0.25, 5.3, 0.6, { size: 12, bold: true, color: B[3][0], valign: 'middle' });
      k.head(s, d.title, 0.5, 1.15, 5.3, 2.1, { max: 40, min: 18, color: 'FFFFFF', valign: 'middle' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.4, 5.3, 0.8, { max: 13, color: B[0][0], valign: 'middle' });
      k.txt(s, k.M.author || '', 0.5, 4.5, 5.3, 0.6, { size: 16, bold: true, color: B[0][0], valign: 'middle' }); k.foot(s, { y: 5.3, color: B[1][0] }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0, 1.05, 10, 1.9); t.rect(s, 0, 2.95, 10, 2.3, B[5][0], { name: 'Band' }); k.txt(s, d.text, 0.5, 3.05, 9.0, 2.1, { max: 15, min: 10, valign: 'middle', ls: 1.3 }); bottom(s); },
    async image(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 2.3, B[4][0], { name: 'Band' }); k.txt(s, d.text, 0.5, 1.15, 9.0, 2.1, { max: 15, min: 10, valign: 'middle', ls: 1.3 }); await k.photo(s, d.image, 0, 3.35, 10, 1.9); bottom(s); },
    async agenda(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { k.txt(s, String(i + 1).padStart(2, '0'), 0.5, y, 1.0, h, { size: Math.min(26, h * 36), bold: true, color: fg, valign: 'middle' }); k.head(s, d.items[i], 1.6, y, 7.9, h, { max: 20, color: fg }); }); bottom(s); },
    async cards(d) { const s = page(d); for (const [i, it] of d.items.entries()); const n = d.items.length; bands(s, n, (i, y, h, fg) => { const it = d.items[i]; k.head(s, it.h, 1.3, y + 0.05, 2.6, h - 0.1, { max: 17, color: fg }); k.txt(s, it.t, 4.1, y + 0.05, 5.4, h - 0.1, { max: 14, color: fg, valign: 'middle' }); });
      for (const [i, it] of d.items.entries()) { const h = 4.2 / n, fg = B[Math.min(5, 1 + Math.round(i * 4 / Math.max(1, n - 1)))][1]; t.img(s, await k.icon(it.icon, fg, 2), 0.55, 1.05 + i * h + h / 2 - 0.2, 0.4, 0.4); } bottom(s); },
    async process(d) { const s = page(d); bands(s, d.steps.length, (i, y, h, fg) => { const st = d.steps[i]; k.txt(s, `${i + 1} \u25B6`, 0.5, y, 1.0, h, { size: 20, bold: true, color: fg, valign: 'middle' }); k.head(s, st.h, 1.6, y + 0.05, 2.5, h - 0.1, { max: 16, color: fg }); k.txt(s, st.t, 4.3, y + 0.05, 5.2, h - 0.1, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
    async stats(d) { const s = page(d), n = d.stats.length + (d.note ? 1 : 0); bands(s, n, (i, y, h, fg) => { if (i === d.stats.length) return k.txt(s, d.note, 0.5, y, 9.0, h, { max: 12, color: fg, italic: true, valign: 'middle' }); const v = d.stats[i]; k.head(s, v.value, 0.5, y, 3.2, h, { max: 44, min: 18, color: fg }); k.txt(s, v.label, 3.9, y, 5.6, h, { max: 16, color: fg, valign: 'middle' }); }); bottom(s); },
    async compare(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 0.6, B[2][0], { name: 'Band' }); k.head(s, d.left.h, 0.5, 1.05, 4.3, 0.6, { max: 17, color: 'FFFFFF' }); k.head(s, d.right.h, 5.25, 1.05, 4.3, 0.6, { max: 17, color: 'FFFFFF' });
      const n = Math.max(d.left.items.length, d.right.items.length); bands(s, n, (i, y, h, fg) => { if (d.left.items[i]) k.txt(s, d.left.items[i], 0.5, y, 4.3, h, { max: 14, color: fg, valign: 'middle' }); if (d.right.items[i]) k.txt(s, d.right.items[i], 5.25, y, 4.3, h, { max: 14, color: fg, valign: 'middle' }); t.line(s, 5.0, y + 0.1, 0, h - 0.2, fg, 1); }, 1.65); bottom(s); },
    async statement(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 0.5, B[4][0], { name: 'Band' }); t.rect(s, 0, 1.55, 10, 2.4, B[1][0], { name: 'Band' }); k.head(s, L.runs(d.text), 0.6, 1.65, 8.8, 2.2, { max: 38, min: 18, color: 'FFFFFF', align: 'center' }); t.rect(s, 0, 3.95, 10, 1.3, B[5][0], { name: 'Band' }); if (d.caption) k.txt(s, d.caption, 0.6, 4.0, 8.8, 1.2, { max: 13, align: 'center', valign: 'middle' }); bottom(s); },
    async timeline(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { const it = d.items[i]; k.head(s, it.year, 0.5, y, 1.6, h, { max: 26, min: 12, color: fg }); k.head(s, it.h, 2.25, y + 0.05, 2.4, h - 0.1, { max: 16, color: fg }); k.txt(s, it.t, 4.8, y + 0.05, 4.7, h - 0.1, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
    async quote(d) { const s = k.slide('FFFFFF'); bands(s, 3, () => {}, 0, 5.625); t.rect(s, 0, 1.6, 10, 2.4, B[0][0], { name: 'Band' }); k.head(s, `\u201C${d.text}\u201D`, 0.7, 1.7, 8.6, 2.2, { max: 32, min: 15, italic: true, color: 'FFFFFF', align: 'center' }); if (d.author) k.txt(s, d.author, 0.7, 4.2, 8.6, 0.5, { size: 15, bold: true, color: B[0][0], align: 'center', valign: 'middle' }); k.foot(s, { y: 5.3, color: B[1][0] }); },
    async sources(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { k.txt(s, [{ text: `${i + 1}   `, options: { bold: true } }, { text: d.items[i] }], 0.5, y, 9.0, h, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all built from full-width bands: a deck's pages must not look alike (L.pages)
  const NAVY = B[0][0], PALE = B[5][0], AQUA = B[3][0], tone = (i, n) => B[Math.min(5, 1 + Math.round(i * 4 / Math.max(1, n - 1)))];
  const night = (d) => { const s = page(d); t.rect(s, 0, 1.05, 10, 4.2, NAVY, { name: 'Night' }); t.rect(s, 0, 1.03, 10, 0.05, AQUA, { name: 'Edge' }); return s; };
  const bd = (s, v, x, y, w, h, color, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color, ...o });
  const hd = (s, v, x, y, w, h, color, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color, ...o });
  const num = (s, v, x, y, w, h, size, color, o = {}) => k.txt(s, String(v), x, y, w, h, { size, bold: true, font: F.head, color, valign: 'middle', ls: 1, ...o });
  const slant = async (key, colors, w, h, lean) => k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${colors.map(([c, x0, x1]) => `<polygon points="${x0 + lean},0 ${x1 + lean},0 ${x1},${h} ${x0},${h}" fill="#${c}"/>`).join('')}</svg>`, w, h);
  const V = {
    image: [
      async (d) => { // the picture is sliced into slats of stepping length
        const s = page(d);
        t.rect(s, 0, 1.05, 10, 4.2, PALE, { name: 'Field' });
        await k.photo(s, d.image, 5.1, 1.05, 4.9, 4.2, { mask: { path: 'M0.28,0H1V0.19H0.28Z M0.14,0.2H1V0.39H0.14Z M0,0.4H1V0.59H0Z M0.14,0.6H1V0.79H0.14Z M0.28,0.8H1V1H0.28Z' } });
        bd(s, d.text, 0.5, 1.2, 4.4, 3.9, B[0][0], { max: 15, valign: 'middle', ls: 1.28 });
        bottom(s);
      },
      async (d) => { // the picture fills the page, a dark band of words runs across it
        const s = page(d);
        await k.photo(s, d.image, 0, 1.05, 10, 4.2);
        t.rect(s, 0, 2.18, 10, 0.06, AQUA, { name: 'Edge' });
        t.rect(s, 0, 2.24, 10, 2.2, B[1][0], { name: 'Band' });
        bd(s, d.text, 0.5, 2.32, 9.0, 2.04, 'FFFFFF', { max: 15, valign: 'middle', ls: 1.2 });
        bottom(s);
      },
      async (d) => { // night: stripes of the scale run behind a round picture
        const s = night(d), dia = 3.65, x = 5.95, y = 1.33;
        [B[2][0], AQUA, B[4][0], PALE].forEach((c, i) => t.rect(s, 4.9, 1.45 + i * 0.86, 5.1, 0.6, c, { name: 'Stripe' }));
        await k.photo(s, d.image, x, y, dia, dia, { mask: 'circle' });
        bd(s, d.text, 0.5, 1.2, 4.2, 3.9, 'FFFFFF', { max: 15, valign: 'middle', ls: 1.28 });
        bottom(s);
      },
      async (d) => { // the band leans over: the picture cut on a tilt at the left, thin stripes along its edge
        const s = page(d);
        await k.photo(s, d.image, 0, 1.05, 6, 4.2, { mask: { poly: [[0, 0], [0.76, 0], [0.58, 1], [0, 1]] } });
        t.img(s, await slant('tilt', [[B[2][0], 0, 15], [AQUA, 25, 55], [PALE, 65, 110]], 240, 420, 108), 3.55, 1.05, 2.4, 4.2);
        bd(s, d.text, 6.0, 1.2, 3.6, 3.9, NAVY, { max: 15, valign: 'middle', ls: 1.25 });
        bottom(s);
      },
    ],
    cards: [
      async (d) => { // two thick bands, each carrying two ideas side by side
        const s = page(d), n = d.items.length, h = 2.1, rows = [B[1], B[5]];
        for (let r = 0; r < 2; r++) t.rect(s, 0, 1.05 + r * h, 10, h, rows[r][0], { name: 'Band' });
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9.0 : 4.25, x = 0.5 + (i % 2) * 4.75, r = Math.floor(i / 2), y = 1.05 + r * h, fg = rows[r][1];
          t.img(s, await k.icon(it.icon, r ? B[2][0] : AQUA, 2), x, y + 0.16, 0.38, 0.38);
          hd(s, it.h, x + 0.5, y + 0.1, ww - 0.5, 0.5, fg);
          bd(s, it.t, x, y + 0.66, ww, h - 0.76, fg);
          if (i === 1 || i === 3) t.line(s, 5.0, y + 0.2, 0, h - 0.4, r ? B[3][0] : B[2][0], 1);
        }
        bottom(s);
      },
      async (d) => { // ribbons pulled in from either edge by turns, each a little longer
        const s = page(d), n = d.items.length, h = 4.2 / n, base = n === 4 ? 6.6 : 7.0;
        t.rect(s, 0, 1.05, 10, 4.2, PALE, { name: 'Field' });
        for (const [i, it] of d.items.entries()) {
          const w = base + i * 0.75, right = i % 2 === 1, x = right ? 10 - w : 0, y = 1.05 + i * h, [bg, fg] = B[1 + Math.min(i, 2)], gap = i < n - 1 ? 0.07 : 0, tx = x + (right ? 0.35 : 0.5), tw = w - 0.85;
          t.rect(s, x, y, w, h - gap, bg, { name: 'Ribbon' });
          t.img(s, await k.icon(it.icon, i > 1 ? fg : AQUA, 2), tx, y + (h - gap) / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, tx + 0.55, y + 0.05, tw - 0.55, 0.42, fg, { max: 15 });
          bd(s, it.t, tx + 0.55, y + 0.47, tw - 0.55, h - gap - 0.52, fg, { max: 13 });
        }
        bottom(s);
      },
      async (d) => { // night: items step left and right across thin stripes of light
        const s = night(d), n = d.items.length, h = 4.2 / n, w = 5.3;
        for (const [i, it] of d.items.entries()) {
          const y = 1.05 + i * h, right = i % 2 === 1, x = right ? 9.5 - w : 0.5;
          if (i) t.rect(s, 0, y - 0.02, 10, 0.04, B[2][0], { name: 'Stripe' });
          t.img(s, await k.icon(it.icon, AQUA, 1.75), right ? 0.9 : 8.65, y + h / 2 - 0.3, 0.6, 0.6);
          hd(s, it.h, x, y + 0.08, w, 0.42, 'FFFFFF', { align: right ? 'right' : 'left' });
          bd(s, it.t, x, y + 0.5, w, h - 0.56, 'E7F4F3', { align: right ? 'right' : 'left', max: 13 });
        }
        bottom(s);
      },
      async (d) => { // one band of icons, one of names, one of words: read down the page
        const s = page(d), n = d.items.length, w = 9.0 / n;
        t.rect(s, 0, 1.05, 10, 0.95, AQUA, { name: 'Icon band' });
        t.rect(s, 0, 2.0, 10, 0.75, B[1][0], { name: 'Name band' });
        t.rect(s, 0, 2.75, 10, 2.5, PALE, { name: 'Word band' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w;
          t.img(s, await k.icon(it.icon, NAVY, 2), x, 1.27, 0.5, 0.5);
          hd(s, it.h, x, 2.03, w - 0.2, 0.7, 'FFFFFF', { max: 15 });
          bd(s, it.t, x, 2.88, w - 0.2, 2.28, NAVY, { max: 14 });
        }
        bottom(s);
      },
    ],
    process: [
      async (d) => { // each step's band starts further along and runs off the right edge
        const s = page(d), n = d.steps.length, h = 4.2 / n, shift = n === 4 ? 1.15 : 1.5;
        t.rect(s, 0, 1.05, 10, 4.2, 'FFFFFF', { name: 'Field' });
        for (const [i, st] of d.steps.entries()) {
          const x = i * shift, y = 1.05 + i * h, [bg, fg] = tone(i, n), tx = x + 1.2, tw = 9.6 - tx;
          t.rect(s, x, y, 10 - x, h, bg, { name: 'Band' });
          num(s, i + 1, x + 0.3, y, 0.8, h, 30, fg);
          hd(s, st.h, tx, y + 0.06, tw, 0.42, fg, { max: 15 });
          bd(s, st.t, tx, y + 0.48, tw, h - 0.54, fg, { max: 13 });
        }
        bottom(s);
      },
      async (d) => { // a chain of arrows in one band, the words on the pale band below
        const s = page(d), n = d.steps.length, w = 9.6 / n;
        t.rect(s, 0, 1.05, 10, 1.3, NAVY, { name: 'Arrow band' });
        t.rect(s, 0, 2.35, 10, 2.9, PALE, { name: 'Word band' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.2 + i * w, [bg, fg] = B[Math.min(4, 2 + i)];
          t.shape(s, 'PENTAGON', { x, y: 1.2, w: w - 0.05, h: 1.0, fill: { color: bg }, objectName: 'Arrow' });
          num(s, i + 1, x + 0.14, 1.2, 0.45, 1.0, 22, fg);
          hd(s, st.h, x + 0.58, 1.24, w - 1.1, 0.92, fg, { max: 13, min: 10 });
          bd(s, st.t, x + 0.2, 2.5, w - 0.42, 2.65, NAVY);
        }
        bottom(s);
      },
      async (d) => { // night: one thick band snakes across the page and comes back
        const s = night(d), n = d.steps.length, top = 2, w = 3.95;
        t.img(s, await k.svg('snake', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420"><path d="M-20,104 H800 A106,106 0 0 1 800,316 H-20" fill="none" stroke="#${B[2][0]}" stroke-width="182"/></svg>`, 1000, 420), 0, 1.05, 10, 4.2);
        for (const [i, st] of d.steps.entries()) {
          const row = i < top ? 0 : 1, y = row ? 3.3 : 1.18, pos = row ? (n === 4 ? 3 - i : 0) : i, wide = n === 3 && i === 2, ww = wide ? 8.2 : w, x = 0.45 + pos * (w + 0.2);
          num(s, i + 1, x, y, 0.55, 0.45, 24, AQUA);
          hd(s, st.h, x + 0.58, y, ww - 0.58, 0.45, 'FFFFFF', { max: 15 });
          bd(s, st.t, x, y + 0.48, ww, 1.2, 'FFFFFF', { max: 13 });
        }
        k.txt(s, '↷', 9.18, 2.86, 0.6, 0.6, { size: 26, bold: true, color: AQUA, font: 'Arial', align: 'center', valign: 'middle' });
        bottom(s);
      },
      async (d) => { // the seam between name and words moves right from band to band
        const s = page(d), n = d.steps.length, h = 4.2 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.05 + i * h, seam = 3.0 + i * (n === 4 ? 0.62 : 0.9), [bg, fg] = B[1 + Math.min(i, 2)];
          t.rect(s, 0, y, 10, h, i % 2 ? 'FFFFFF' : PALE, { name: 'Band' });
          t.shape(s, 'PENTAGON', { x: 0, y, w: seam, h, fill: { color: bg }, objectName: 'Name' });
          num(s, i + 1, 0.4, y, 0.6, h, 26, i > 1 ? fg : AQUA);
          hd(s, st.h, 1.0, y + 0.06, seam - 1.45, h - 0.12, fg, { max: 15 });
          bd(s, st.t, seam + 0.2, y + 0.05, 9.6 - seam - 0.2, h - 0.1, NAVY, { max: 13, valign: 'middle' });
        }
        bottom(s);
      },
    ],
    stats: [
      async (d) => { // night: one great figure, the other two on a pair of thin bands
        const s = night(d), [a, ...rest] = d.stats;
        k.txt(s, a.value, 0.5, 1.15, 5.2, 1.7, { size: L.fit(a.value, 5.1, 1.6, 88, 30, F.head, true), bold: true, font: F.head, color: AQUA, valign: 'middle', ls: 1 });
        bd(s, a.label, 0.5, 2.85, 5.0, 0.7, 'FFFFFF', { max: 16 });
        rest.forEach((v, i) => { const y = 1.2 + i * 1.2, [bg, fg] = B[i ? 3 : 2];
          t.rect(s, 5.9, y, 4.1, 1.1, bg, { name: 'Band' });
          hd(s, v.value, 6.1, y + 0.03, 3.75, 0.6, fg, { max: 28, min: 15 });
          bd(s, v.label, 6.1, y + 0.62, 3.75, 0.46, fg, { max: 11.5 }); });
        if (d.note) bd(s, d.note, 0.5, 3.7, 9.0, 1.45, 'E7F4F3', { max: 13, italic: true, valign: 'middle' });
        bottom(s);
      },
      async (d) => { // figures on one fat aqua band, their names on the next, the note on the last
        const s = page(d), w = 9.0 / 3;
        t.rect(s, 0, 1.05, 10, 1.55, AQUA, { name: 'Figure band' });
        t.rect(s, 0, 2.6, 10, 1.0, B[1][0], { name: 'Name band' });
        t.rect(s, 0, 3.6, 10, 1.65, PALE, { name: 'Note band' });
        d.stats.forEach((v, i) => { const x = 0.5 + i * w;
          hd(s, v.value, x, 1.12, w - 0.2, 1.4, NAVY, { max: 50, min: 22 });
          bd(s, v.label, x, 2.66, w - 0.25, 0.88, 'FFFFFF', { max: 13.5, valign: 'middle' }); });
        if (d.note) bd(s, d.note, 0.5, 3.7, 9.0, 1.45, NAVY, { max: 14, italic: true, valign: 'middle' });
        bottom(s);
      },
      async (d) => { // the bands lean: three slanted panes, a figure in each
        const s = page(d), lean = 0.55, w = 3.45, h = 3.0;
        t.rect(s, 0, 1.05, 10, 4.2, PALE, { name: 'Field' });
        t.img(s, await slant('panes', [[B[1][0], -60, 300], [B[2][0], 310, 670], [AQUA, 680, 1040]], 1000, 300, lean * 100), 0, 1.05, 10, h);
        d.stats.forEach((v, i) => { const x = [0.3, 3.7, 7.4][i], tw = [2.6, 2.9, 2.4][i], fg = i === 2 ? NAVY : 'FFFFFF';
          hd(s, v.value, x, 1.2, tw, 1.05, fg, { max: 42, min: 20 });
          bd(s, v.label, x, 2.28, tw, 1.65, fg, { max: 13 }); });
        if (d.note) bd(s, d.note, 0.5, 4.12, 9.0, 1.05, NAVY, { max: 13, italic: true, valign: 'middle' });
        bottom(s);
      },
    ],
    compare: [
      async (d) => { // each side's bands bleed off its own edge, a white gutter between
        const s = page(d), g = 0.14;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5 + g : 0, w = 5 - g, a = i ? 'left' : 'right', n = sd.items.length, tx = i ? x + 0.3 : 0.4, tw = w - 0.7, rh = (4.2 - 0.72) / n;
          t.rect(s, x, 1.05, w, 0.72, i ? AQUA : B[1][0], { name: 'Head band' });
          hd(s, sd.h, tx, 1.05, tw, 0.72, i ? NAVY : 'FFFFFF', { max: 20, min: 12, align: a });
          sd.items.forEach((it, j) => { const y = 1.77 + j * rh, f = i ? [PALE, B[4][0]][j % 2] : [B[2][0], B[1][0]][j % 2];
            t.rect(s, x, y, w, rh, f, { name: 'Band' });
            bd(s, it, tx, y + 0.03, tw, rh - 0.06, i ? NAVY : 'FFFFFF', { align: a, valign: 'middle' }); });
        }
        bottom(s);
      },
      async (d) => { // a dark storey above a pale one, the points standing in a row in each
        const s = page(d), h = 2.1;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.05 + i * h, n = sd.items.length, x0 = 2.75, w = (9.6 - x0) / n, f = i ? PALE : B[1][0], ink = i ? NAVY : 'FFFFFF';
          t.rect(s, 0, y, 10, h, f, { name: 'Storey' });
          hd(s, sd.h, 0.5, y + 0.1, 2.0, h - 0.2, i ? B[2][0] : AQUA, { max: 20, min: 12 });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.rect(s, x, y + 0.22, w - 0.14, 0.06, i ? B[2][0] : AQUA, { name: 'Tick' }); bd(s, it, x, y + 0.36, w - 0.14, h - 0.5, ink, { max: 13 }); });
        }
        bottom(s);
      },
      async (d) => { // night: the two sides zip together, band by band from either edge
        const s = night(d), w = 6.3, nl = d.left.items.length, nr = d.right.items.length, m = Math.max(nl, nr), rh = (4.2 - 0.66) / (2 * m);
        hd(s, d.left.h, 0.5, 1.1, 4.3, 0.56, AQUA, { max: 18, min: 12 });
        hd(s, d.right.h, 5.2, 1.1, 4.3, 0.56, B[4][0], { max: 18, min: 12, align: 'right' });
        for (let j = 0; j < m; j++) {
          const y = 1.71 + j * 2 * rh;
          if (d.left.items[j]) { t.rect(s, 0, y, w, rh - 0.04, B[2][0], { name: 'Left band' }); bd(s, d.left.items[j], 0.5, y, w - 0.7, rh - 0.04, 'FFFFFF', { valign: 'middle', max: 12.5 }); }
          if (d.right.items[j]) { t.rect(s, 10 - w, y + rh, w, rh - 0.04, B[4][0], { name: 'Right band' }); bd(s, d.right.items[j], 10 - w + 0.2, y + rh, w - 0.7, rh - 0.04, NAVY, { valign: 'middle', align: 'right', max: 12.5 }); }
        }
        bottom(s);
      },
    ],
    statement: [
      async (d) => { // night: a flag of scale stripes at the edge, the words beside it
        const s = night(d);
        B.slice(1).forEach(([c], i) => t.rect(s, 0, 1.05 + i * 0.84, 1.15, 0.84, c, { name: 'Stripe' }));
        k.head(s, L.runs(d.text), 1.55, 1.2, 7.95, 2.45, { max: 36, min: 18, color: 'FFFFFF' });
        if (d.caption) { t.rect(s, 1.55, 3.7, 1.2, 0.05, AQUA, { name: 'Rule' }); bd(s, d.caption, 1.55, 3.82, 7.95, 1.33, 'E7F4F3', { max: 14 }); }
        bottom(s);
      },
      async (d) => { // the band points forward: the thought rides a great arrow
        const s = page(d);
        t.shape(s, 'PENTAGON', { x: 0, y: 1.22, w: 9.75, h: 2.45, fill: { color: AQUA }, objectName: 'Arrow' });
        k.head(s, L.runs(d.text), 0.5, 1.3, 8.1, 2.3, { max: 36, min: 18, color: NAVY });
        if (d.caption) bd(s, d.caption, 0.5, 3.82, 8.6, 1.33, B[2][0], { max: 14, valign: 'middle' });
        bottom(s);
      },
    ],
    timeline: [
      async (d) => { // the years share one coloured band, the story hangs under each
        const s = page(d), w = 2.5, c = [B[1], B[2], B[3], B[4]];
        for (const [i, it] of d.items.entries()) {
          const x = i * w;
          t.rect(s, x, 1.05, w, 0.95, c[i][0], { name: 'Year band' });
          hd(s, it.year, x + 0.25, 1.05, w - 0.4, 0.95, c[i][1], { max: 24, min: 13 });
          hd(s, it.h, x + 0.25, 2.1, w - 0.4, 0.56, NAVY, { max: 14 });
          bd(s, it.t, x + 0.25, 2.68, w - 0.42, 2.48, C.muted, { max: 13.5 });
        }
        bottom(s);
      },
      async (d) => { // night: the years stand on a central post, stories to either side by turns
        const s = night(d), rh = 1.05;
        for (const [i, it] of d.items.entries()) {
          const y = 1.05 + i * rh, right = i % 2 === 1, x = right ? 5.82 : 0.3, a = right ? 'left' : 'right';
          t.rect(s, right ? 5 : 0, y + 0.04, 5, rh - 0.08, B[1][0], { name: 'Band' });
          t.rect(s, 4.25, y + 0.04, 1.5, rh - 0.08, AQUA, { name: 'Year' });
          hd(s, it.year, 4.28, y + 0.04, 1.44, rh - 0.08, NAVY, { max: 16, min: 10.5, align: 'center' });
          hd(s, it.h, x, y + 0.06, 3.88, 0.3, 'FFFFFF', { max: 13, min: 10.5, align: a });
          bd(s, it.t, x, y + 0.36, 3.88, rh - 0.4, 'E7F4F3', { max: 11, min: 10, ls: 1.15, align: a });
        }
        bottom(s);
      },
      async (d) => { // scale bands again, but the year looms at the far edge, past a slanted seam
        const s = page(d), rh = 1.05;
        for (const [i, it] of d.items.entries()) {
          const y = 1.05 + i * rh, [bg, fg] = B[1 + i];
          t.rect(s, 0, y, 10, rh, i % 2 ? 'FFFFFF' : PALE, { name: 'Band' });
          t.rect(s, 7.3, y, 2.7, rh, bg, { name: 'Year end' });
          hd(s, it.year, 7.45, y, 2.4, rh, fg, { max: 26, min: 13, align: 'right' });
          hd(s, it.h, 0.5, y + 0.05, 6.6, 0.36, NAVY, { max: 14 });
          bd(s, it.t, 0.5, y + 0.41, 6.6, rh - 0.46, C.muted, { max: 12.5 });
        }
        bottom(s);
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old rows of each of these looked like the card rows
  R.stats = V.stats.shift();
  R.compare = V.compare.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Chiziqlar', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: B[1][0], lt2: B[5][0], accent1: B[3][0], accent2: B[2][0], accent3: B[4][0], accent4: '1C2541', accent5: C.muted, accent6: 'D8FBF6', hlink: B[3][0], folHlink: C.muted } });
}
module.exports = { id: 105, slug: 'chiziqlar', name: 'Çiziqlar', category: 'business', photos: true, build, style: { tone: "tartibli va ravshan: har bir band bitta to'liq fikr, ketma-ket va izchil", limits: {}, prefer: null } };
