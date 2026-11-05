/** 86 Nota — sheet music: five-line staves, note-head markers, bar lines on cards, a melody across the cover. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FBF8F1', ink: '222222', muted: '5E5E5E', accent: '7B1E3A', pal: ['7B1E3A', '1F3A5F', '3D6B35', 'A35C1A', '4B2E83', '1E6F6F'] };
const staff = (w, n = 5, gap = 14) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${gap * (n - 1) + 4}"><g stroke="#222" stroke-width="1.6">${Array.from({ length: n }, (_, k) => `<line x1="0" y1="${2 + k * gap}" x2="${w}" y2="${2 + k * gap}"/>`).join('')}</g></svg>`;
const melody = () => { const ys = [70, 56, 63, 42, 49, 35, 56, 28, 42, 63]; let g = ''; ys.forEach((y, i) => { const x = 120 + i * 140; g += `<ellipse cx="${x}" cy="${y}" rx="15" ry="11" transform="rotate(-20 ${x} ${y})" fill="#222"/><line x1="${x + 13}" y1="${y}" x2="${x + 13}" y2="${y - 60}" stroke="#222" stroke-width="4"/>`; if (i % 3 === 2) g += `<path d="M${x + 13},${y - 60} q20,10 18,35" fill="none" stroke="#222" stroke-width="4"/>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="130"><g stroke="#222" stroke-width="2">${[28, 42, 56, 70, 84].map((y) => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}<line x1="60" y1="28" x2="60" y2="84" stroke-width="4"/><line x1="1540" y1="28" x2="1540" y2="84" stroke-width="6"/></g>${g}</svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Nota', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  init: async (ctx) => { ctx.mel = await svgOnce(ctx, 'mel', melody(), 1600, 130); },
  bg: (ctx, s, kind) => { s.background = { color: C.bg }; if (kind !== 'hero') ctx.t.img(s, ctx.mel, 0, 4.9, 10, 0.4); },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.4 },
  panel: async (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'D9D2C3', width: 1 }, shadow: 0.1, blur: 5, offset: 2, name: 'Score card' }); if (!o.big) { t.img(s, await svgOnce(ctx, 'st' + Math.round(w * 10), staff(Math.round(w * 100) - 30, 5, 7), Math.round(w * 100) - 30, 32), x + 0.15, y + 0.05, w - 0.3, 0.14); t.line(s, x + 0.15, y + 0.05, 0, 0.14, C.ink, 1.25); t.line(s, x + w - 0.15, y + 0.05, 0, 0.14, C.ink, 2.25); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y + d * 0.15, d, d * 0.72, C.pal[k % 6], { name: 'Note head' }); ctx.t.line(s, x + d * 0.94, y - d * 0.5, 0, d * 0.75, C.pal[k % 6], 2.5); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.15, w: d, h: d * 0.72, fontFace: 'Cambria', fontSize: Math.round(d * 20), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { line: { color: C.ink, width: 1.5 }, name: 'Frame' }); },
  connector: (ctx, s, x, y, w) => { for (let k = 0; k < 3; k++) ctx.t.line(s, x, y - 0.06 + k * 0.06, w, 0, '9A9A9A', 0.75); },
  axis: (ctx, s, x, y, w) => { for (let k = 0; k < 5; k++) ctx.t.line(s, x, y + 0.05 + k * 0.06, w, 0, '9A9A9A', 0.75); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'E2DBCC', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.5, 0.6, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.32, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Cambria';
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const hall = '2A0F1A', hallUp = '431B2B', cream = 'FBF8F1', gold = 'E8C27A', soft = 'D9C9B8';
    const lines = (s, x, y, w, gap = 0.06, c = '9A9A9A', wd = 0.75) => { for (let k = 0; k < 5; k++) t.line(s, x, y + k * gap, w, 0, c, wd); };
    const bare = async (d, night) => { // a page without the melody at its foot
      const s = await newSlide('hero');
      if (night) t.rect(s, 0, 0, 10, 5.625, hall, { name: 'Concert hall' });
      K.marker(ctx, s, 0.5, 0.5, 0.6, ctx.idx, ctx.idx);
      t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: HF, bold: true, color: night ? cream : C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, HF, true) });
      metaFooter({ color: night ? soft : C.muted, y: 5.32, font: HF })(ctx, s);
      return s;
    };
    const keysH = (s, x, y, w, ht) => { const n = 28, kw = w / n; t.rect(s, x, y, w, ht, 'FFFFFF', { line: { color: C.ink, width: 1 }, name: 'Keyboard' }); for (let k = 1; k < n; k++) t.line(s, x + k * kw, y, 0, ht, C.ink, 0.75); for (let k = 0; k < n - 1; k++) if (![2, 6].includes(k % 7)) t.rect(s, x + (k + 1) * kw - kw * 0.3, y, kw * 0.6, ht * 0.6, C.ink, { name: 'Black key' }); };
    const keysV = (s, x, y, w, ht) => { const n = 14, kh = ht / n; t.rect(s, x, y, w, ht, 'FFFFFF', { line: { color: C.ink, width: 1 }, name: 'Keyboard' }); for (let k = 1; k < n; k++) t.line(s, x, y + k * kh, w, 0, C.ink, 0.75); for (let k = 0; k < n - 1; k++) if (![2, 6].includes(k % 7)) t.rect(s, x, y + (k + 1) * kh - kh * 0.3, w * 0.6, kh * 0.6, C.ink, { name: 'Black key' }); };
    const record = async (s, x, y, dd) => { t.oval(s, x, y, dd, dd, '151515', { name: 'Record' }); for (const f of [0.08, 0.16, 0.24]) t.oval(s, x + dd * f, y + dd * f, dd * (1 - 2 * f), dd * (1 - 2 * f), null, { line: { color: '3C3C3C', width: 0.75 } }); };
    const V = {
      image: [
        async (d) => { // the picture is the label of a long-playing record
          const s = await page(d), dd = 3.45, x = 5.85, y = 1.3, pd = 2.25;
          await record(s, x, y, dd);
          t.img(s, await L.photo(L.src(d.image), pd, pd, { mask: 'circle' }), x + (dd - pd) / 2, y + (dd - pd) / 2, pd, pd, { alt: '' });
          t.oval(s, x + dd / 2 - 0.09, y + dd / 2 - 0.09, 0.18, 0.18, C.bg, { line: { color: '151515', width: 1 } });
          body(s, d.text, 0.6, 1.32, 4.95, 3.4, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture fills the page, a sheet of music is laid over it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.22, 10, 0.405, hall, { name: 'Footer band' }); metaFooter({ color: cream, y: 5.32, font: HF })(ctx, s);
          t.rect(s, 0.5, 0.35, 4.6, 4.6, cream, { line: { color: 'D9D2C3', width: 1 }, shadow: 0.3, blur: 8, offset: 3, name: 'Sheet' });
          K.marker(ctx, s, 0.72, 0.68, 0.5, ctx.idx, ctx.idx);
          head(s, d.title, 1.4, 0.5, 3.5, 0.8, { max: 18 }); lines(s, 0.72, 1.36, 4.16, 0.045);
          t.line(s, 0.72, 1.36, 0, 0.18, C.ink, 1.25); t.line(s, 4.88, 1.36, 0, 0.18, C.ink, 2.25);
          body(s, d.text, 0.72, 1.62, 4.16, 3.2, { max: 14, k: 1.1, valign: 'middle' });
        },
        async (d) => { // at the piano: the keyboard runs along the foot of the page instead of the melody
          const s = await bare(d), y = 1.28;
          t.img(s, await L.photo(L.src(d.image), 3.7, 3.08), 5.7, y, 3.7, 3.08, { alt: '' }); t.rect(s, 5.7, y, 3.7, 3.08, null, { line: { color: C.ink, width: 1.5 }, name: 'Frame' });
          body(s, d.text, 0.6, y, 4.85, 3.08, { max: 15, k: 1.15, valign: 'middle' });
          keysH(s, 0, 4.48, 10, 0.72);
        },
        async (d) => { // a fermata over the page: the picture is its arc, the words are the held note
          const s = await page(d), w = 6.1, ht = 1.75, x = 1.95, y = 1.22;
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { path: 'M0,1 C0,0.3 0.22,0 0.5,0 C0.78,0 1,0.3 1,1 Z' } }), x, y, w, ht, { alt: '' });
          t.oval(s, 4.87, y + ht + 0.03, 0.26, 0.26, C.accent);
          body(s, d.text, 0.6, 3.3, 8.8, 1.55, { max: 14, k: 1.05 });
        },
      ],
      cards: [
        async (d) => { // the items are notes at different pitches on one staff, their words hang below
          const s = await page(d), n = d.items.length, cw = 8.8 / n, top = 1.42, gap = 0.17, dd = 0.56;
          lines(s, 0.6, top, 8.8, gap, C.ink, 1); t.line(s, 0.6, top, 0, gap * 4, C.ink, 2); t.line(s, 9.4, top, 0, gap * 4, C.ink, 3);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2, y = top + [0.34, 0.0, 0.17, -0.04][i] - 0.02, c = C.pal[i];
            t.oval(s, cx - dd / 2 - 0.05, y, dd + 0.1, dd * 0.76, c, { line: { color: C.bg, width: 1.5 }, name: 'Note head' }); t.line(s, cx + dd / 2 + 0.03, y - 0.1, 0, 0.32, c, 2.5);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), cx - 0.13, y + dd * 0.38 - 0.13, 0.26, 0.26);
            head(s, it.h, x + 0.1, 2.32, cw - 0.2, 0.5, { max: 15, align: 'center', color: c });
            body(s, it.t, x + 0.1, 2.84, cw - 0.2, 2.0, { max: 14, align: 'center' });
          }
        },
        async (d) => { // piano keys: every item is a white key, black keys stand between them
          const s = await bare(d), n = d.items.length, w = 8.8 / n, top = 1.25, bot = 5.18, bw = 0.42, bh = 0.72;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * w;
            t.rect(s, x, top, w, bot - top, 'FFFFFF', { line: { color: C.ink, width: 1.25 }, name: 'White key' });
            t.img(s, await L.icon(it.icon, C.pal[i], 2), x + w / 2 - 0.2, top + 0.14, 0.4, 0.4);
            head(s, it.h, x + 0.26, top + 0.8, w - 0.42, 0.55, { max: 15, align: 'center' });
            body(s, it.t, x + 0.16, top + 1.38, w - 0.32, bot - top - 1.46, { max: 14, align: 'center' });
          }
          for (let i = 1; i < n; i++) t.rect(s, 0.6 + i * w - bw / 2, top, bw, bh, C.ink, { name: 'Black key' });
        },
        async (d) => { // a chord: the note heads stacked on one stem, each one sounding a row
          const s = await page(d), n = d.items.length, top = 1.28, ht = 3.55, rh = ht / n, dd = 0.56;
          t.line(s, 1.36, top + rh / 2 - 0.1, 0, ht - rh + 0.2, C.ink, 3);
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh, c = C.pal[i], ny = y + rh / 2 - dd * 0.38;
            t.oval(s, 0.72, ny, dd + 0.1, dd * 0.76, c, { name: 'Note head' });
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), 0.92, ny + 0.08, 0.26, 0.26);
            head(s, it.h, 1.6, y + 0.04, 2.5, rh - 0.08, { max: 16, color: c });
            body(s, it.t, 4.2, y + 0.05, 5.2, rh - 0.1, { max: 13.5, valign: 'middle' });
            if (i < n - 1) t.line(s, 1.6, y + rh, 7.8, 0, 'D9D2C3', 0.75);
          }
        },
        async (d) => { // the hall in the dark: a spotlight falls on each player, at different depths of the stage
          const s = await bare(d, true), n = d.items.length, g = 0.14, w = (8.8 - g * (n - 1)) / n, ht = 3.05;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = i % 2 ? 2.12 : 1.5, cx = x + w / 2;
            t.img(s, await svgOnce(ctx, 'spot', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B8" stop-opacity="0.05"/><stop offset="1" stop-color="#FFE9B8" stop-opacity="0.4"/></linearGradient></defs><polygon points="180,0 220,0 400,400 0,400" fill="url(#g)"/></svg>`, 400, 400), x, 1.1, w, y - 1.1);
            t.rect(s, x, y, w, ht, hallUp, { line: { color: gold, width: 1 }, name: 'Stage' });
            t.img(s, await L.icon(it.icon, gold, 2), cx - 0.2, y + 0.12, 0.4, 0.4);
            head(s, it.h, x + 0.12, y + 0.56, w - 0.24, 0.5, { max: 14, color: gold, align: 'center' });
            body(s, it.t, x + 0.12, y + 1.08, w - 0.24, ht - 1.14, { max: 13, color: cream, align: 'center' });
          }
        },
      ],
      process: [
        async (d) => { // beamed notes climbing: the beam rises over the page, each step's words sit under its note
          const s = await page(d), n = d.steps.length, w = 8.8 / n, y0 = 3.0, yN = 1.95, dd = 0.5, beamUp = 1.1;
          const pos = d.steps.map((_, i) => { const x = 0.6 + i * w; return [x, y0 - i * (y0 - yN) / (n - 1)]; });
          const fx = pos[0][0] + dd + 0.02, lx = pos[n - 1][0] + dd + 0.02, fy = pos[0][1] - beamUp, ly = pos[n - 1][1] - beamUp + 0.25, by = Math.min(fy, ly);
          t.shape(s, 'LINE', { x: fx, y: ly, w: lx - fx, h: fy - ly, line: { color: C.ink, width: 6 }, flipV: true, objectName: 'Beam' });
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = pos[i], sx = x + dd + 0.02, tp = fy + (ly - fy) * i / (n - 1);
            t.line(s, sx, tp, 0, y + 0.15 - tp, C.ink, 2.5);
            t.oval(s, x, y, dd + 0.02, dd * 0.72, C.pal[i], { name: 'Note head' });
            t.text(s, String(i + 1), { x, y, w: dd + 0.02, h: dd * 0.72, fontFace: HF, bold: true, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.68, y - 0.08, w - 0.78, 0.5, { max: 14, color: C.pal[i] });
            body(s, st.t, x, y + 0.44, w - 0.14, 4.84 - y - 0.44, { max: 13 });
          }
        },
        async (d) => { // the staff stands upright in the middle, steps on both sides of it
          const s = await page(d), n = d.steps.length, w = 3.95, ch = n === 4 ? 1.62 : 1.6, ys = n === 4 ? [1.28, 1.62, 3.2, 3.24] : [1.28, 2.25, 3.24], my = n === 4 ? [1.55, 2.4, 3.25, 4.1] : [1.9, 2.87, 3.84];
          for (let k = 0; k < 5; k++) t.line(s, 4.76 + k * 0.12, 1.25, 0, 3.62, '7A7A7A', 0.75);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.45 : 0.6, y = ys[i], c = C.pal[i];
            await panel(s, x, y, w, ch, i);
            t.line(s, right ? 5.0 : x + w, my[i] + 0.16, right ? x - 5.0 : 5 - x - w, 0, c, 1.5);
            t.oval(s, 4.75, my[i], 0.5, 0.34, c, { line: { color: C.bg, width: 1.5 }, name: 'Note head' });
            t.text(s, String(i + 1), { x: 4.75, y: my[i], w: 0.5, h: 0.34, fontFace: HF, bold: true, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.15, y + 0.24, w - 0.3, 0.38, { max: 14 });
            body(s, st.t, x + 0.15, y + 0.64, w - 0.3, ch - 0.7, { max: 13 });
          }
        },
        async (d) => { // two systems of a score: every step is a bar, the last ends on the double line
          const s = await page(d), n = d.steps.length, sysH = 1.75, cells = n === 4 ? [[0, 0, 4.4], [1, 0, 4.4], [0, 1, 4.4], [1, 1, 4.4]] : [[0, 0, 4.4], [1, 0, 4.4], [0, 1, 8.8]];
          for (let r = 0; r < 2; r++) { const y = 1.28 + r * 1.8; lines(s, 0.6, y, 8.8, 0.075, C.ink, 0.75); t.line(s, 0.6, y, 0, 0.3, C.ink, 2); }
          for (const [i, st] of d.steps.entries()) {
            const [c, r, w] = cells[i], x = 0.6 + c * 4.4, y = 1.28 + r * 1.8, last = i === n - 1;
            t.line(s, x + w - (last ? 0.05 : 0), y, 0, 0.3, C.ink, last ? 1 : 1.5); if (last) t.line(s, x + w, y, 0, 0.3, C.ink, 3.5);
            t.oval(s, x + 0.22, y + 0.04, 0.34, 0.24, C.pal[i], { name: 'Note head' }); t.line(s, x + 0.55, y - 0.24, 0, 0.4, C.pal[i], 2);
            head(s, `${i + 1}. ${st.h}`, x + 0.14, y + 0.36, w - 0.28, 0.38, { max: 15, color: C.pal[i] });
            body(s, st.t, x + 0.14, y + 0.76, w - 0.28, sysH - 0.82, { max: 13.5 });
          }
        },
      ],
      stats: [
        async (d) => { // three time signatures in three bars: the figure above, its meaning below the line
          const s = await page(d), w = 8.8 / 3, y = 1.32, hh = d.note ? 2.55 : 3.45;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * w, c = C.pal[i];
            lines(s, px, y + 0.12, w, 0.2, 'B5AFA3', 0.75);
            t.text(s, x.value, { x: px + 0.12, y: y + 0.04, w: w - 0.24, h: 0.96, fontFace: HF, bold: true, fontSize: L.fit(x.value, w - 0.24, 0.92, 48, 18, HF, true), color: c, align: 'center', valign: 'middle' });
            t.line(s, px + 0.3, y + 1.1, w - 0.6, 0, c, 2.5);
            body(s, x.label, px + 0.14, y + 1.18, w - 0.28, hh - 1.2, { max: 14, align: 'center', valign: 'top' });
          }
          for (let i = 0; i <= 3; i++) t.line(s, 0.6 + i * w, y + 0.12, 0, 0.8, C.ink, i === 3 ? 3 : 1.25);
          if (d.note) body(s, d.note, 0.6, 3.92, 8.8, 0.92, { max: 12.5, color: C.muted, valign: 'middle' });
        },
        async (d) => { // the tempo marking, written large: a note equals the figure; two lesser marks follow
          const s = await bare(d, true), [a, b, c] = d.stats, hh = d.note ? 2.72 : 3.7;
          t.text(s, '♩', { x: 0.55, y: 1.25, w: 1.15, h: 1.85, fontFace: HF, fontSize: 80, color: gold, align: 'center', valign: 'middle', noFit: true });
          t.text(s, '= ' + a.value, { x: 1.65, y: 1.3, w: 4.0, h: 1.75, fontFace: HF, bold: true, fontSize: L.fit('= ' + a.value, 4.0, 1.7, 60, 26, HF, true), color: cream, valign: 'middle' });
          body(s, a.label, 0.7, 3.12, 4.9, 0.8, { max: 15, color: soft });
          t.line(s, 5.85, 1.35, 0, 2.55, gold, 1);
          for (const [i, x] of [b, c].entries()) {
            const y = 1.32 + i * 1.32;
            t.text(s, '♪', { x: 6.02, y: y + 0.05, w: 0.5, h: 0.65, fontFace: HF, fontSize: 28, color: gold, align: 'center', valign: 'middle', noFit: true });
            t.text(s, x.value, { x: 6.55, y, w: 2.85, h: 0.72, fontFace: HF, bold: true, fontSize: L.fit(x.value, 2.85, 0.7, 32, 16, HF, true), color: cream, valign: 'middle' });
            body(s, x.label, 6.1, y + 0.72, 3.3, 0.5, { max: 12, color: soft });
          }
          if (d.note) { t.line(s, 0.7, 4.05, 8.7, 0, hallUp, 1); body(s, d.note, 0.7, 4.12, 8.7, 1.05, { max: 13, color: soft, valign: 'middle' }); }
        },
      ],
      compare: [
        async (d) => { // the grand staff: the upper hand above, the lower below, one brace joining them
          const s = await page(d), hh = 1.68;
          t.img(s, await svgOnce(ctx, 'brace', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="400"><path d="M50,4 C20,4 30,30 30,60 L30,170 C30,190 20,200 6,200 C20,200 30,210 30,230 L30,340 C30,370 20,396 50,396" fill="none" stroke="#${C.ink}" stroke-width="7"/></svg>`, 60, 400), 0.5, 1.28, 0.36, 3.5);
          t.line(s, 0.9, 1.28, 0, 3.5, C.ink, 2);
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.28 + i * (hh + 0.14), c = C.pal[i ? 1 : 0], n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.58) / rws, w = 4.02;
            t.rect(s, 0.9, y, 8.5, hh, 'FFFFFF', { line: { color: 'D9D2C3', width: 1 }, name: 'Staff' });
            lines(s, 3.6, y + 0.1, 5.65, 0.08, 'B5AFA3', 0.75);
            head(s, side.h, 1.04, y + 0.06, 2.5, 0.46, { max: 17, color: c });
            t.line(s, 9.4, y, 0, hh, C.ink, 3);
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.28, rh, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 1.04 + (j % 2) * (w + 0.12), yy = y + 0.54 + Math.floor(j / 2) * rh;
              t.oval(s, x, yy + rh / 2 - 0.06, 0.17, 0.12, c, { name: 'Note head' });
              t.text(s, v, { x: x + 0.26, y: yy, w: w - 0.28, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
        async (d) => { // a double bar down the middle, two phrases answer each other across it
          const s = await page(d), w = 4.0, n = Math.max(d.left.items.length, d.right.items.length), top = 1.98, av = 2.82, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.14, av);
          t.line(s, 4.95, 1.3, 0, 3.5, C.ink, 1); t.line(s, 5.05, 1.3, 0, 3.5, C.ink, 3);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.3 : 0.7, c = C.pal[i ? 4 : 3];
            lines(s, x, 1.34, w, 0.11, 'C6C0B4', 0.75);
            head(s, side.h, x, 1.36, w, 0.42, { max: 18, color: c, align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) {
              t.text(s, v, { x, y: top + j * rh, w, h: rh, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
            }
          }
          for (let j = 0; j < n; j++) t.oval(s, 4.86, top + j * rh + rh / 2 - 0.1, 0.28, 0.2, C.accent, { name: 'Note head' });
        },
      ],
      statement: [
        async (d) => { // the note is held: a fermata over the words, in a dark hall
          const s = await bare(d, true);
          t.img(s, await svgOnce(ctx, 'ferm', `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="220"><path d="M20,190 C60,20 540,20 580,190 C500,70 100,70 20,190 Z" fill="#${gold}"/><circle cx="300" cy="170" r="28" fill="#${gold}"/></svg>`, 600, 220), 3.6, 1.12, 2.8, 1.02);
          t.text(s, L.runs(d.text), { x: 0.9, y: 2.2, w: 8.2, h: 1.65, fontFace: HF, italic: true, bold: true, fontSize: L.fit(d.text, 8.2, 1.6, 30, 16, HF, true, 1, true), color: cream, align: 'center', valign: 'middle' });
          if (d.caption) body(s, d.caption, 1.3, 3.95, 7.4, 1.2, { max: 13.5, color: soft, align: 'center' });
        },
        async (d) => { // words sung under the melody: a line of notes above, the text as its lyric, the remark in the margin
          const s = await page(d, 'focus');
          t.img(s, ctx.mel, 0.6, 1.42, 5.8, 0.47);
          t.text(s, L.runs(d.text), { x: 0.6, y: 2.05, w: 5.75, h: 2.75, fontFace: HF, bold: true, fontSize: L.fit(d.text, 5.75, 2.7, 30, 16, HF, true), color: C.accent, valign: 'top' });
          t.line(s, 6.62, 1.3, 0, 3.5, C.ink, 1); t.line(s, 6.7, 1.3, 0, 3.5, C.ink, 3);
          if (d.caption) body(s, d.caption, 6.95, 1.3, 2.45, 3.5, { max: 14, valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // a piano roll: keys at the side, each date a note bar further along and lower down
          const s = await bare(d), w = 5.75, hh = 0.88, sx = (9.4 - 1.25 - w) / 3, sy = 0.95, top = 1.26;
          keysV(s, 0.5, top, 0.62, 3.73);
          for (let k = 1; k < 4; k++) t.line(s, 1.25, top + k * sy - 0.035, 8.15, 0, 'E2DBCC', 0.75);
          for (const [i, it] of d.items.entries()) {
            const x = 1.25 + i * sx, y = top + i * sy, c = C.pal[i];
            t.rect(s, x, y, w, hh, 'FFFFFF', { line: { color: c, width: 1.5 }, name: 'Note bar' }); t.rect(s, x, y, 1.15, hh, c, { name: 'Note bar' });
            head(s, it.year, x + 0.05, y + 0.05, 1.05, hh - 0.1, { max: 16, color: 'FFFFFF', align: 'center' });
            head(s, it.h, x + 1.25, y + 0.03, w - 1.33, 0.28, { max: 13, color: c });
            body(s, it.t, x + 1.25, y + 0.31, w - 1.33, hh - 0.33, { max: 12 });
          }
        },
        async (d) => { // the back of the sleeve: a track list with its dates, the record sliding out at the side
          const s = await bare(d, true), rh = 3.82 / 4, top = 1.28;
          await record(s, 0.45, 1.5, 3.0); t.oval(s, 1.3, 2.35, 1.3, 1.3, C.accent); t.oval(s, 1.88, 2.93, 0.14, 0.14, hall);
          t.rect(s, 0, 1.28, 1.6, 3.82, hallUp, { line: { color: gold, width: 1 }, name: 'Sleeve' });
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh;
            t.shape(s, 'ISOSCELES_TRIANGLE', { x: 3.65, y: y + rh / 2 - 0.09, w: 0.18, h: 0.18, rotate: 90, fill: { color: gold }, objectName: 'Play' });
            head(s, it.year, 3.92, y + 0.03, 1.15, rh - 0.06, { max: 16, color: gold });
            head(s, it.h, 5.1, y + 0.03, 4.3, 0.3, { max: 13.5, color: cream });
            body(s, it.t, 5.1, y + 0.33, 4.3, rh - 0.37, { max: 12, color: soft });
            if (i < 3) t.line(s, 3.65, y + rh, 5.75, 0, hallUp, 1);
          }
        },
      ],
    };
    R.image = V.image.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, ctx.mel, 0, 3.75, 10, 0.81);
    if (d.image) await K.photo(ctx, s, d.image, 6.6, 0.55, 2.9, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 5.6, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.7, h: 1.95, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.7, 1.9, 40, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.95, w: 5.6, h: 0.65, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.65, w: 5.6, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted, y: 5.32, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 86, slug: 'nota', name: 'Nota', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ohangdor va ravon: fikrlar bir-biriga ulanib boradigan, ritmli jumlalar", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "playful"], "transitions": ["fade", "push:l", "p14:ripple"], "cover": ["fadeLetters", "swing"], "mark": "bounceDrop", "deco": "slideRight", "sig": {"title": "sweepIn", "body": "fade", "item": "bounceDrop", "image": "wipe:r", "number": "bounceDrop", "order": "seq", "stagger": 0.12}, "tempo": 1.0, "kenburns": false};
