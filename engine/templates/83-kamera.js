/** 83 Kamera — camera viewfinder: rule-of-thirds grid, focus brackets, REC dot, timecode, battery. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '111214', ink: 'F5F5F5', muted: 'B0B3B8', accent: 'FF3B30', pal: ['FFD60A', 'FF3B30', '32D74B', '64D2FF', 'FF9F0A', 'BF5AF2'] };
const thirds = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#fff" stroke-opacity="0.08" stroke-width="2"><line x1="533" y1="0" x2="533" y2="900"/><line x1="1066" y1="0" x2="1066" y2="900"/><line x1="0" y1="300" x2="1600" y2="300"/><line x1="0" y1="600" x2="1600" y2="600"/></g></svg>`;
const corners = (t, s, x, y, w, h, c = 'FFFFFF', k = 0.2, wt = 1.75) => { for (const [px, py, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { t.line(s, Math.min(px, px + sx * k), py, k, 0, c, wt); t.line(s, px, Math.min(py, py + sy * k), 0, k, c, wt); } };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kamera', C, C.pal), layout: { agenda: 'twoCol', cards: 'rows', process: 'list', stats: 'tiles', timeline: 'line' },
  area: { x: 0.7, y: 1.4, w: 8.6, h: 3.5 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', thirds(), 1600, 900, true) }; corners(ctx.t, s, 0.25, 0.2, 9.5, 5.2, 'FFFFFF', 0.35, 2); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '1E2024', { t: 10, name: 'Panel' }); corners(ctx.t, s, x, y, w, h, o.big ? C.pal[0] : 'FFFFFF', 0.16, 1.5); },
  marker: (ctx, s, x, y, d, k, label) => { corners(ctx.t, s, x, y, d, d, C.pal[k % 6], d * 0.3, 1.75); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: C.pal[k % 6], align: 'center', valign: 'middle' }); else ctx.t.oval(s, x + d * 0.4, y + d * 0.4, d * 0.2, d * 0.2, C.pal[k % 6]); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); corners(ctx.t, s, x + w * 0.35, y + h * 0.3, w * 0.3, h * 0.4, C.pal[0], 0.18, 1.75); },
  axis: (ctx, s, x, y, w) => { ctx.t.line(s, x, y + 0.17, w, 0, '5A5E66', 1.5); for (let k = 0; k <= 40; k++) ctx.t.line(s, x + k * w / 40, y + 0.17 - (k % 5 ? 0.05 : 0.1), 0, k % 5 ? 0.05 : 0.1, '5A5E66', 1); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '33363C', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.oval(s, 0.6, 0.48, 0.18, 0.18, C.accent); t.text(s, `REC  00:${String(ctx.idx).padStart(2, '0')}:24`, { x: 0.85, y: 0.4, w: 2.2, h: 0.32, fontFace: 'Courier New', fontSize: 11, bold: true, color: C.ink }); t.rect(s, 8.75, 0.45, 0.55, 0.24, null, { line: { color: C.ink, width: 1.25 }, name: 'Battery' }); t.rect(s, 8.79, 0.49, 0.36, 0.16, C.pal[2], { name: 'Charge' }); if (d.title) t.text(s, d.title, { x: 0.6, y: 0.75, w: 8.8, h: 0.6, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.6, 26, 15, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, x: 0.7, w: 8.6, y: 5.0, font: 'Courier New', size: 8 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.pal[0], valueColor: (i) => C.pal[i % 6],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const pal = C.pal, yel = pal[0], rec = C.accent, film = '0A0A0C', cell = '1E2024', mono = 'Courier New';
    const tc = (s, v, x, y, w, c = yel, o = {}) => t.text(s, v, { x, y, w, h: o.h || 0.28, fontFace: mono, bold: true, color: c, align: o.align, valign: 'middle', fontSize: L.fit(v, w, o.h || 0.28, o.max || 12, 8, mono, true) });
    const stripH = async (s, x, y, w, ht) => { let g = ''; for (let k = 0; k < 64; k++) g += `<rect x="${k * 25 + 7}" y="8" width="12" height="16" rx="2"/><rect x="${k * 25 + 7}" y="176" width="12" height="16" rx="2"/>`; t.img(s, await svgOnce(ctx, 'stripH', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="200"><rect width="1600" height="200" fill="#${film}"/><g fill="#EDEDED">${g}</g></svg>`, 1600, 200), x, y, w, ht); };
    const stripV = async (s, x, y, w, ht) => { let g = ''; for (let k = 0; k < 40; k++) g += `<rect x="6" y="${k * 25 + 7}" width="16" height="12" rx="2"/><rect x="98" y="${k * 25 + 7}" width="16" height="12" rx="2"/>`; t.img(s, await svgOnce(ctx, 'stripV', `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="1000"><rect width="120" height="1000" fill="#${film}"/><g fill="#EDEDED">${g}</g></svg>`, 120, 1000), x, y, w, ht); };
    const clap = async (s, x, y, w, ht) => { let g = ''; for (let k = 0; k < 16; k++) g += `<polygon points="${k * 80},0 ${k * 80 + 40},0 ${k * 80 + 70},100 ${k * 80 + 30},100" fill="#F5F5F5"/>`; t.img(s, await svgOnce(ctx, 'clap', `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="100"><rect width="1280" height="100" fill="#111"/>${g}</svg>`, 1280, 100), x, y, w, ht); };
    const iris = (d) => { const P = []; for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + Math.PI / 8; P.push([0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)]); } return P; };
    const lens = (s, cx, cy, r) => { for (const [k, c] of [[1, '2A2C31'], [0.86, '17181B'], [0.68, '26282D']]) t.oval(s, cx - r * k, cy - r * k, r * 2 * k, r * 2 * k, c, { line: { color: '4A4E56', width: 1 } }); };
    const V = {
      image: [
        async (d) => { // through the viewfinder: the whole page is the shot, the words on a dark overlay inside the frame
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 4.92, 10, 0.705, '000000', { t: 15, name: 'Footer band' });
          corners(t, s, 0.25, 0.2, 9.5, 4.65, 'FFFFFF', 0.35, 2);
          t.rect(s, 5.3, 0.45, 4.1, 4.2, cell, { t: 8, name: 'Overlay' }); corners(t, s, 5.3, 0.45, 4.1, 4.2, yel, 0.2, 1.75);
          t.oval(s, 5.5, 0.62, 0.15, 0.15, rec); tc(s, `REC  00:${String(ctx.idx).padStart(2, '0')}:24`, 5.72, 0.56, 2.4, C.ink);
          head(s, d.title, 5.5, 0.85, 3.7, 0.82, { max: 20 });
          body(s, d.text, 5.5, 1.7, 3.7, 2.85, { max: 13, k: 1.08, valign: 'middle' });
          K.footer(ctx, s);
        },
        async (d) => { // the picture seen down the lens: an eight-bladed iris inside the barrel rings
          const s = await page(d), dia = 3.05, x = 5.95, y = 1.62, cx = x + dia / 2, cy = y + dia / 2;
          lens(s, cx, cy, dia / 2 + 0.2);
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: { poly: iris() } }), x, y, dia, dia, { alt: '' });
          body(s, d.text, 0.7, 1.45, 4.75, 3.45, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // a strip of film across the page: three frames of the same shot, the words below
          const s = await page(d), src = L.src(d.image), y = 1.38, ht = 1.95, fw = 3.1, gap = 0.08, x0 = 0.3, P = ['west', 'centre', 'east'];
          await stripH(s, 0, y, 10, ht);
          for (let k = 0; k < 3; k++) t.img(s, await L.photo(src, fw, ht - 0.42, { position: P[k] }), x0 + k * (fw + gap), y + 0.21, fw, ht - 0.42, { alt: '' });
          body(s, d.text, 0.7, 3.4, 8.6, 1.52, { max: 14, k: 1.06, valign: 'middle' });
        },
        async (d) => { // composed on the thirds: the picture takes two of them, its grid and focus box on it, the words the third
          const s = await page(d), x = 3.85, y = 1.42, w = 5.45, ht = 3.5;
          t.img(s, await L.photo(L.src(d.image), w, ht), x, y, w, ht, { alt: '' });
          for (const k of [1, 2]) { t.line(s, x + (k * w) / 3, y, 0, ht, 'FFFFFF', 0.75, { t: 35 }); t.line(s, x, y + (k * ht) / 3, w, 0, 'FFFFFF', 0.75, { t: 35 }); }
          corners(t, s, x + w * 0.56, y + ht * 0.22, w * 0.28, ht * 0.42, yel, 0.18, 2);
          body(s, d.text, 0.7, 1.42, 2.95, 3.5, { max: 14, k: 1.08, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // a contact print: a white sheet with black frames, a frame number under each corner
          const s = await page(d), n = d.items.length, X = 0.6, Y = 1.4, W2 = 8.8, H2 = 3.52, w = 4.26, hh = 1.66;
          t.rect(s, X, Y, W2, H2, 'F2F2EE', { name: 'Contact print' });
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? W2 - 0.2 : w, x = X + 0.1 + (i % 2) * (w + 0.08), y = Y + 0.08 + Math.floor(i / 2) * (hh + 0.04);
            t.rect(s, x, y, ww, hh, film, { name: 'Frame' });
            tc(s, `${String(i + 1).padStart(2, '0')}A`, x + ww - 0.62, y + 0.07, 0.55, yel, { align: 'right', max: 10 });
            t.img(s, await L.icon(it.icon, yel, 2), x + 0.12, y + 0.1, 0.32, 0.32);
            head(s, it.h, x + 0.52, y + 0.06, ww - 1.18, 0.38, { max: 14 });
            body(s, it.t, x + 0.14, y + 0.48, ww - 0.28, hh - 0.54, { max: 13 });
          }
        },
        async (d) => { // subjects in focus: only brackets around them, each at its own height in the frame
          const s = await page(d), n = d.items.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, hh = 3.12;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 1.8 : 1.42, c = pal[[0, 3, 2, 4][i]];
            corners(t, s, x, y, w, hh, c, 0.26, 2);
            t.img(s, await L.icon(it.icon, c, 1.75), x + w / 2 - 0.24, y + 0.16, 0.48, 0.48);
            head(s, it.h, x + 0.14, y + 0.68, w - 0.28, 0.5, { align: 'center', color: c, max: 15 });
            body(s, it.t, x + 0.16, y + 1.2, w - 0.32, hh - 1.32, { align: 'center' });
          }
        },
        async (d) => { // the lens at the centre: its rings, an item on each corner of the shot
          const s = await page(d), n = d.items.length, cx = 5, cy = n === 3 ? 2.2 : 3.15, r = 0.82, w = 3.45, hh = 1.68, P = n === 3 ? [[0.7, 1.4, w, hh, 'left'], [5.85, 1.4, w, hh, 'right'], [1.8, 3.42, 6.4, 1.5, 'center']] : [[0.7, 1.4, w, hh, 'left'], [5.85, 1.4, w, hh, 'right'], [0.7, 3.24, w, hh, 'left'], [5.85, 3.24, w, hh, 'right']];
          lens(s, cx, cy, r); t.oval(s, cx - 0.22, cy - 0.22, 0.44, 0.44, '0D2A35'); t.oval(s, cx - 0.14, cy - 0.17, 0.12, 0.09, 'FFFFFF', { t: 40 });
          for (const [i, it] of d.items.entries()) {
            const [x, y, ww, hg, a] = P[i], ix = a === 'right' ? x + ww - 0.4 : a === 'center' ? x + ww / 2 - 0.2 : x, c = pal[[0, 3, 2, 4][i]];
            t.img(s, await L.icon(it.icon, c, 2), ix, y + 0.02, 0.4, 0.4);
            const hx = a === 'left' ? x + 0.5 : x, hw = a === 'center' ? ww : ww - 0.5;
            head(s, it.h, hx, y + (a === 'center' ? 0.42 : 0.02), hw, 0.4, { align: a, color: c });
            body(s, it.t, x, y + (a === 'center' ? 0.84 : 0.46), ww, hg - (a === 'center' ? 0.84 : 0.46), { align: a, max: 13 });
          }
        },
        async (d) => { // a storyboard: a drawn frame with its icon, the words as the caption beneath
          const s = await page(d), n = d.items.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, fh = 1.15;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = 1.42;
            t.rect(s, x, y, w, fh, 'F2F2EE', { name: 'Storyboard frame' });
            t.line(s, x, y, w, fh, 'BDBDB8', 0.75); t.line(s, x, y, w, fh, 'BDBDB8', 0.75, { flipV: true });
            t.oval(s, x + w / 2 - 0.34, y + fh / 2 - 0.34, 0.68, 0.68, film);
            t.img(s, await L.icon(it.icon, yel, 2), x + w / 2 - 0.19, y + fh / 2 - 0.19, 0.38, 0.38);
            head(s, it.h, x, y + fh + 0.06, w, 0.46, { color: yel, max: 15 });
            body(s, it.t, x, y + fh + 0.54, w, 4.92 - y - fh - 0.54, { max: 14 });
          }
        },
      ],
      process: [
        async (d) => { // a film strip wound through the gate: a numbered frame for each step
          const s = await page(d), n = d.steps.length, cw = 8.6 / n;
          await stripH(s, 0, 1.42, 10, 0.98);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.7 + i * cw;
            t.rect(s, x + 0.1, 1.57, cw - 0.2, 0.68, pal[[0, 3, 2, 4][i]], { name: 'Frame' });
            t.text(s, String(i + 1), { x: x + 0.1, y: 1.57, w: cw - 0.2, h: 0.68, bold: true, fontSize: 28, color: film, align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.08, 2.48, cw - 0.16, 0.5, { align: 'center', color: pal[[0, 3, 2, 4][i]] });
            body(s, st.t, x + 0.1, 2.98, cw - 0.2, 1.94, { align: 'center' });
          }
        },
        async (d) => { // the editing timeline: a clip on each track, each starting later, a playhead running over them
          const s = await page(d), n = d.steps.length, rh = 3.48 / n, w = n === 4 ? 5.5 : 6.2, dx = (8.05 - w) / (n - 1);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.44 + i * rh, x = 1.35 + i * dx, c = pal[[0, 3, 2, 4][i]], hg = rh - 0.1;
            tc(s, `V${i + 1}`, 0.7, y, 0.5, C.muted, { h: hg, max: 13 });
            t.rect(s, 1.25, y, 8.15, hg, cell, { name: 'Track' });
            t.rect(s, x, y, w, hg, c, { name: 'Clip' });
            head(s, st.h, x + 0.14, y + 0.02, w - 0.28, 0.28, { color: film, max: 13 });
            body(s, st.t, x + 0.14, y + 0.3, w - 0.28, hg - 0.33, { color: film, max: 12.5 });
          }
          t.line(s, 1.29, 1.38, 0, 3.54, rec, 2, { name: 'Playhead' }); t.shape(s, 'ISOSCELES_TRIANGLE', { x: 1.19, y: 1.34, w: 0.2, h: 0.14, flipV: true, fill: { color: rec }, objectName: 'Playhead cap' });
        },
        async (d) => { // clapperboards: one slate for each take, the number chalked large
          const s = await page(d), n = d.steps.length, gap = 0.16, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.7 + i * (w + gap), y = 1.42;
            await clap(s, x, y, w, 0.26);
            t.rect(s, x, y + 0.26, w, 3.24, film, { line: { color: '5A5E66', width: 1 }, name: 'Slate' });
            t.text(s, String(i + 1).padStart(2, '0'), { x: x + 0.14, y: y + 0.32, w: 1.0, h: 0.62, fontFace: mono, bold: true, fontSize: 30, color: yel, valign: 'middle', noFit: true });
            t.line(s, x + 0.14, y + 0.97, w - 0.28, 0, '5A5E66', 1);
            head(s, st.h, x + 0.14, y + 1.02, w - 0.28, 0.5, { max: 14 });
            body(s, st.t, x + 0.14, y + 1.54, w - 0.28, 1.9, { max: 14, color: 'E0E0E0' });
          }
        },
        async (d) => { // zooming in: frame inside frame, a step for each, a line from every frame to its words
          const s = await page(d), n = d.steps.length, W0 = 3.5, H0 = 3.45, x0 = 0.7, y0 = 1.44, rh = 3.45 / n, cx = x0 + W0 / 2, cy = y0 + H0 / 2;
          for (const [i, st] of d.steps.entries()) {
            const k = 1 - i * (0.75 / n), w = W0 * k, hg = H0 * k, x = cx - w / 2, y = cy - hg / 2, c = pal[[0, 3, 2, 4][i]], ry = y0 + i * rh, my = ry + rh / 2;
            corners(t, s, x, y, w, hg, c, 0.24, 2.25);
            t.line(s, x + w, Math.min(my, y + 0.02), 4.45 - x - w, Math.abs(my - y - 0.02), c, 0.75, { flipV: my < y + 0.02 });
            t.text(s, String(i + 1), { x: x + 0.05, y: y + 0.03, w: 0.3, h: 0.28, bold: true, fontSize: 12, color: c, align: 'center', valign: 'middle' });
            head(s, st.h, 4.5, ry + 0.02, 4.9, 0.32, { color: c });
            body(s, st.t, 4.5, ry + 0.34, 4.9, rh - 0.4, { max: 13.5 });
          }
        },
      ],
      stats: [
        async (d) => { // three lenses seen from the front: the figure sits in the glass, the words below
          const s = await page(d), cw = 8.6 / 3, dia = 1.92, y = 1.4;
          for (const [i, x] of d.stats.entries()) {
            const cx = 0.7 + (i + 0.5) * cw, c = pal[[0, 3, 2][i]];
            lens(s, cx, y + dia / 2, dia / 2);
            t.oval(s, cx - 0.62, y + dia / 2 - 0.62, 1.24, 1.24, film, { line: { color: c, width: 2 } });
            t.text(s, x.value, { x: cx - 0.55, y: y + dia / 2 - 0.34, w: 1.1, h: 0.68, bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.06, 0.6, 26, 11, 'Arial', true) });
            body(s, x.label, cx - cw / 2 + 0.12, y + dia + 0.08, cw - 0.24, 0.6, { align: 'center', max: 13 });
          }
          if (d.note) { t.line(s, 0.7, 4.03, 8.6, 0, '5A5E66', 1); body(s, d.note, 0.7, 4.08, 8.6, 0.86, { color: C.muted, valign: 'middle', max: 12.5 }); }
        },
        async (d) => { // focus locked on the main figure: yellow brackets close in on it, the others stay at the edge of the shot
          const s = await page(d), [a, ...rest] = d.stats;
          corners(t, s, 0.7, 1.42, 5.1, 3.45, yel, 0.42, 3); corners(t, s, 1.3, 1.82, 3.9, 1.45, yel, 0.2, 1.5);
          t.text(s, a.value, { x: 1.4, y: 1.87, w: 3.7, h: 1.35, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.6, 1.3, 58, 24, 'Arial', true) });
          body(s, a.label, 1.3, 3.36, 3.9, 1.3, { align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.42 + i * 1.02, c = pal[[3, 2][i]];
            t.text(s, x.value, { x: 6.1, y, w: 3.2, h: 0.52, bold: true, color: c, valign: 'middle', fontSize: L.fit(x.value, 3.15, 0.48, 26, 14, 'Arial', true) });
            body(s, x.label, 6.1, y + 0.52, 3.2, 0.42, { max: 12.5 });
          }
          if (d.note) body(s, d.note, 6.1, 3.5, 3.2, 1.4, { color: C.muted, valign: 'middle', max: 12 });
        },
      ],
      compare: [
        async (d) => { // two cameras, one split screen: a REC tally on each side, the rows meet at the cut
          const s = await page(d), w = 3.85;
          t.line(s, 5, 1.42, 0, 3.48, 'FFFFFF', 1.5, { name: 'Cut' });
          t.oval(s, 4.62, 1.57, 0.16, 0.16, rec); t.oval(s, 5.22, 1.57, 0.16, 0.16, pal[2]);
          head(s, d.left.h, 0.7, 1.42, 3.8, 0.46, { align: 'right', max: 18, color: yel }); head(s, d.right.h, 5.5, 1.42, 3.8, 0.46, { max: 18, color: pal[3] });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.24, 2.85);
          let y = 2.03;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.75, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.4, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // two reels of film laid one above the other: the heading in the first frame, an item in each of the rest
          const s = await page(d), hh = 1.72;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.4 + i * (hh + 0.06), n = side.items.length, fw = 2.0, cw = (9.7 - fw - 0.35) / n, c = i ? pal[3] : yel;
            await stripH(s, 0, y, 10, hh);
            t.rect(s, 0.2, y + 0.2, fw, hh - 0.4, c, { name: 'Title frame' });
            head(s, side.h, 0.3, y + 0.24, fw - 0.2, hh - 0.48, { color: film, align: 'center', max: 16 });
            for (const [k, it] of side.items.entries()) {
              const x = 0.2 + fw + 0.1 + k * cw;
              t.rect(s, x, y + 0.2, cw - 0.08, hh - 0.4, cell, { name: 'Frame' });
              body(s, it, x + 0.1, y + 0.24, cw - 0.28, hh - 0.48, { valign: 'middle', max: 13.5 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the clapperboard: the thought chalked on the slate, the note beside it
          const s = await page(d);
          await clap(s, 0.7, 1.42, 5.75, 0.38);
          t.rect(s, 0.7, 1.8, 5.75, 3.1, film, { line: { color: '5A5E66', width: 1 }, name: 'Slate' });
          t.text(s, L.runs(d.text), { x: 0.95, y: 1.9, w: 5.25, h: 2.9, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 5.25, 2.85, 30, 15, 'Arial', true) });
          if (d.caption) body(s, d.caption, 6.75, 1.42, 2.55, 3.48, { valign: 'middle', max: 14 });
        },
        async (d) => { // cinema letterbox: the thought in the focus box, the note as a subtitle on the black bar below
          const s = await page(d, 'focus');
          corners(t, s, 1.1, 1.42, 7.8, 2.25, yel, 0.3, 2.5);
          t.text(s, L.runs(d.text), { x: 1.4, y: 1.5, w: 7.2, h: 2.1, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 7.2, 2.05, 34, 16, 'Arial', true) });
          t.rect(s, 0, 3.82, 10, 1.12, '000000', { name: 'Letterbox' });
          if (d.caption) body(s, d.caption, 0.9, 3.88, 8.2, 1.0, { color: pal[0], align: 'center', valign: 'middle', max: 13 });
        },
      ],
      timeline: [
        async (d) => { // a strip of film hangs down the page: each year is on a frame, the words to either side
          const s = await page(d), w = 3.7;
          await stripV(s, 4.65, 1.38, 0.7, 3.56);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.42 + Math.floor(i / 2) * 1.76 + (right ? 0.26 : 0), x = right ? 5.6 : 0.7, a = right ? 'left' : 'right';
            t.rect(s, 4.8, y + (right ? 0.2 : 0.04), 0.4, 0.42, pal[[0, 3, 2, 4][i]], { name: 'Frame' });
            tc(s, it.year, x, y, w, pal[[0, 3, 2, 4][i]], { align: a, h: 0.36, max: 16 });
            head(s, it.h, x, y + 0.36, w, 0.28, { align: a, max: 13 });
            body(s, it.t, x, y + 0.66, w, 1.02, { align: a, max: 13 });
          }
        },
        async (d) => { // four shots on the monitor wall: the year stands as timecode in the corner of each, set one a little off the next
          const s = await page(d), w = 4.15, hh = 1.66;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + (i % 2) * (w + 0.3) + (i < 2 ? 0 : 0), y = 1.42 + Math.floor(i / 2) * (hh + 0.14), c = pal[[0, 3, 2, 4][i]];
            t.rect(s, x, y, w, hh, cell, { line: { color: '33363C', width: 1 }, name: 'Monitor' });
            t.rect(s, x, y, 0.07, hh, c, { name: 'Tally' });
            t.oval(s, x + 0.17, y + 0.15, 0.12, 0.12, c);
            tc(s, it.year, x + 0.34, y + 0.07, 1.35, c, { max: 13 });
            head(s, it.h, x + 1.72, y + 0.05, w - 1.82, 0.32, { max: 13, align: 'right' });
            body(s, it.t, x + 0.2, y + 0.42, w - 0.34, hh - 0.5, { max: 13.5 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original list looked like the cards rows
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' }); t.rect(s, 0, 0, 10, 5.625, '000000', { t: 45, name: 'Scrim' }); }
    if (d.image) t.rect(s, 0, 2.35, 10, 3.275, '000000', { t: 35, name: 'Title ground' }); // the title sat straight on the photo
    corners(t, s, 0.25, 0.2, 9.5, 5.2, 'FFFFFF', 0.35, 2.5); corners(t, s, 4.3, 2.1, 1.4, 1.4, C.pal[0], 0.25, 2);
    t.oval(s, 0.6, 0.48, 0.18, 0.18, C.accent); t.text(s, 'REC  00:00:00', { x: 0.85, y: 0.4, w: 2.2, h: 0.32, fontFace: 'Courier New', fontSize: 11, bold: true, color: C.ink });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 2.45, w: 8.0, h: 0.3, fontSize: 11, bold: true, color: C.pal[0], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 2.75, w: 8.8, h: 1.35, bold: true, fontSize: L.fit(d.title, 8.8, 1.3, 40, 20, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.1, w: 7.0, h: 0.5, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.55, w: 7.0, h: 0.4, fontSize: 15, bold: true, color: C.ink });
    metaFooter({ color: C.muted, x: 0.6, w: 8.8, y: 5.0, font: 'Courier New', size: 8 })(ctx, s);
  },
};
module.exports = { id: 83, slug: 'kamera', name: 'Kamera', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "reportaj kabi: kadrdagi fakt, aniq tafsilot va qisqa sharh", limits: {}, prefer: 'visual' } };
