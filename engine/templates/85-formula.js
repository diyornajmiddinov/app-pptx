/** 85 Formula — mathematics: graph paper, coordinate axes with a plotted curve, points as markers, f(x) labels. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFFFFF', ink: '1A2B4C', muted: '56657F', accent: 'E74C3C', pal: ['E74C3C', '2E86C1', '27AE60', '8E44AD', 'F39C12', '16A085'] };
const grid = () => { let g = ''; for (let x = 0; x <= 1600; x += 32) g += `<line x1="${x}" y1="0" x2="${x}" y2="900" stroke-width="${x % 160 ? 1 : 2}"/>`; for (let y = 0; y <= 900; y += 32) g += `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke-width="${y % 160 ? 1 : 2}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#fff"/><g stroke="#D6E6F5">${g}</g></svg>`; };
const plot = () => { let d = 'M60,300'; for (let x = 60; x <= 760; x += 10) d += ` L${x},${(300 - Math.sin((x - 60) / 70) * 110 - (x - 60) * 0.18).toFixed(1)}`; let p = 'M60,330'; for (let x = 60; x <= 760; x += 10) p += ` L${x},${(330 - ((x - 410) ** 2) / 2200 * -1 - 40).toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420"><g stroke="#1A2B4C" stroke-width="3" fill="#1A2B4C"><line x1="40" y1="380" x2="780" y2="380"/><line x1="60" y1="400" x2="60" y2="20"/><polygon points="780,372 796,380 780,388"/><polygon points="52,22 60,6 68,22"/></g><path d="${d}" fill="none" stroke="#E74C3C" stroke-width="5"/><path d="${p}" fill="none" stroke="#2E86C1" stroke-width="4" stroke-dasharray="12 8"/><text x="770" y="410" font-family="Cambria" font-size="28" font-style="italic" fill="#1A2B4C">x</text><text x="72" y="30" font-family="Cambria" font-size="28" font-style="italic" fill="#1A2B4C">y</text></svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Formula', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'grid', grid(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: o.big ? C.ink : 'AFC8E0', width: o.big ? 1.5 : 1 }, shadow: 0.08, blur: 4, offset: 1, name: 'Card' }); },
  marker: (ctx, s, x, y, d, k, label) => { const c = C.pal[k % 6]; ctx.t.line(s, x, y + d / 2, d, 0, c, 1); ctx.t.line(s, x + d / 2, y, 0, d, c, 1); ctx.t.oval(s, x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5, c); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, fontFace: 'Cambria', fontSize: Math.max(8, Math.round(d * 15)), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t } = ctx; t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); t.line(s, x, y + h + 0.08, w, 0, C.ink, 1.5); t.line(s, x - 0.08, y, 0, h, C.ink, 1.5); for (let k = 0; k <= 10; k++) { t.line(s, x + k * w / 10, y + h + 0.08, 0, 0.08, C.ink, 1); t.line(s, x - 0.16, y + k * h / 10, 0.08, 0, C.ink, 1); } },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.ink, 1.5),
  axis: (ctx, s, x, y, w) => { ctx.t.line(s, x, y + 0.17, w, 0, C.ink, 1.5); ctx.t.text(s, 't', { x: x + w - 0.2, y: y + 0.2, w: 0.3, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 14, color: C.ink }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'AFC8E0', 0.75),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, k ? '\u2234' : '\u2235', { x: x - 0.05, y: y - 0.1, w: 0.3, h: 0.3, fontFace: 'Cambria', fontSize: 14, bold: true, color: C.pal[k ? 1 : 0] }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, [{ text: 'f', options: { italic: true } }, { text: `(${ctx.idx})` }], { x: 0.5, y: 0.35, w: 0.95, h: 0.72, fontFace: 'Cambria', fontSize: 22, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.95, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Cambria';
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const board = '14233F', boardUp = '1E3157', chalk = 'F2F6FA', soft = 'B7C6DA', sun = 'FFB84D', sky = '7FD1F5', dk = ['C0392B', '2471A3', '1E8449', '7D3C98'], line = 'AFC8E0';
    const sheet = (s, x, y, w, ht) => t.rect(s, x, y, w, ht, 'FFFFFF', { name: 'Paper' });
    const arrowR = (s, x, y, w, c = C.ink, wd = 1.5) => { t.line(s, x, y, w, 0, c, wd); t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + w - 0.04, y: y - 0.07, w: 0.14, h: 0.14, rotate: 90, fill: { color: c }, objectName: 'Arrow' }); };
    const arrowU = (s, x, y, ht, c = C.ink, wd = 1.5) => { t.line(s, x, y, 0, ht, c, wd); t.shape(s, 'ISOSCELES_TRIANGLE', { x: x - 0.07, y: y - 0.1, w: 0.14, h: 0.14, fill: { color: c }, objectName: 'Arrow' }); };
    const it = (s, v, x, y, w, ht, o = {}) => t.text(s, v, { x, y, w, h: ht, fontFace: HF, italic: true, fontSize: o.size || 18, bold: !!o.bold, color: o.color || C.ink, align: o.align || 'center', valign: 'middle' });
    const brace = async (s, x, y, w, ht, c, flip) => t.img(s, await svgOnce(ctx, 'br' + c + (flip ? 'r' : 'l'), `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="400"><path d="${flip ? 'M10,4 C40,4 30,30 30,60 L30,170 C30,190 40,200 54,200 C40,200 30,210 30,230 L30,340 C30,370 40,396 10,396' : 'M50,4 C20,4 30,30 30,60 L30,170 C30,190 20,200 6,200 C20,200 30,210 30,230 L30,340 C30,370 20,396 50,396'}" fill="none" stroke="#${c}" stroke-width="5"/></svg>`, 60, 400), x, y, w, ht);
    const bracket = (s, x, y, ht, c, right) => { t.line(s, x, y, 0, ht, c, 2.5); t.line(s, right ? x - 0.16 : x, y, 0.16, 0, c, 2.5); t.line(s, right ? x - 0.16 : x, y + ht, 0.16, 0, c, 2.5); };
    const dark = (d) => async () => { const s = await newSlide('focus'); t.rect(s, 0, 0, 10, 5.625, board, { name: 'Blackboard' }); t.text(s, [{ text: 'f', options: { italic: true } }, { text: `(${ctx.idx})` }], { x: 0.5, y: 0.35, w: 0.95, h: 0.72, fontFace: HF, fontSize: 22, bold: true, color: sun, valign: 'middle' }); t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, fontFace: HF, bold: true, color: chalk, valign: 'middle', fontSize: L.fit(d.title, 7.95, 0.72, 28, 16, HF, true) }); metaFooter({ color: soft, font: HF })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // the picture is the area under a curve, on its own axes
          const s = await page(d), x = 5.0, y = 1.3, w = 4.4, ht = 3.62, curve = 'M0,0.5 C0.18,0.02 0.34,0.04 0.5,0.38 S0.82,0.82 1,0.08';
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { path: curve + ' L1,1 L0,1 Z' } }), x, y, w, ht, { alt: '' });
          t.img(s, await svgOnce(ctx, 'crv', `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="724" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${curve}" fill="none" stroke="#${C.accent}" stroke-width="0.008"/></svg>`, 880, 724), x, y, w, ht);
          arrowR(s, x - 0.1, y + ht, w + 0.2); arrowU(s, x, y - 0.02, ht + 0.1);
          it(s, 'x', x + w + 0.02, y + ht - 0.32, 0.3, 0.3, { size: 14 }); it(s, 'y', x + 0.08, y - 0.1, 0.3, 0.3, { size: 14 });
          sheet(s, 0.6, 1.35, 4.05, 3.65); body(s, d.text, 0.72, 1.42, 3.82, 3.5, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture over the whole page, a blackboard on the wall
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.17, 10, 0.455, board, { name: 'Footer band' }); metaFooter({ color: chalk, font: HF })(ctx, s);
          t.rect(s, 0.45, 0.4, 4.7, 4.5, board, { line: { color: '8A6A3F', width: 4 }, name: 'Blackboard' });
          t.text(s, [{ text: 'f', options: { italic: true } }, { text: `(${ctx.idx})` }], { x: 0.7, y: 0.55, w: 0.9, h: 0.65, fontFace: HF, fontSize: 20, bold: true, color: sun, valign: 'middle' });
          head(s, d.title, 1.55, 0.5, 3.45, 0.78, { color: chalk, max: 18 }); t.line(s, 0.7, 1.32, 4.2, 0, soft, 1);
          body(s, d.text, 0.7, 1.42, 4.2, 3.35, { color: chalk, max: 14, k: 1.1, valign: 'middle' });
        },
        async (d) => { // the unit circle: axes through the round picture, the radius and its angle
          const s = await page(d), dia = 3.3, cx = 2.55, cy = 3.18, r = dia / 2;
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), cx - r, cy - r, dia, dia, { alt: '' });
          t.oval(s, cx - r, cy - r, dia, dia, null, { line: { color: C.ink, width: 1.75 } });
          arrowR(s, cx - r - 0.25, cy, dia + 0.45); arrowU(s, cx, cy - r - 0.08, dia + 0.25);
          t.shape(s, 'LINE', { x: cx, y: cy - r * 0.707, w: r * 0.707, h: r * 0.707, line: { color: C.accent, width: 2.5 }, flipV: true, objectName: 'Radius' });
          t.oval(s, cx + r * 0.707 - 0.07, cy - r * 0.707 - 0.07, 0.14, 0.14, C.accent);
          sheet(s, 4.85, 1.35, 4.55, 3.65); body(s, d.text, 4.97, 1.42, 4.32, 3.5, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // a matrix with two rows: the picture above, the words below, in one pair of brackets
          const s = await page(d);
          bracket(s, 0.6, 1.28, 3.8, C.ink); bracket(s, 9.4, 1.28, 3.8, C.ink, true);
          t.img(s, await L.photo(L.src(d.image), 8.4, 1.85), 0.8, 1.38, 8.4, 1.85, { alt: '' });
          sheet(s, 0.8, 3.3, 8.4, 1.7); body(s, d.text, 0.88, 3.33, 8.24, 1.65, { max: 14, k: 1.08, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // the four quadrants of a plane, the third item takes the whole lower half when there are three
          const s = await page(d), n = d.items.length, cx = 5, cy = 3.18, W2 = 4.2, H2 = 1.72;
          const cell = n === 4 ? [[5.2, 1.34, W2, H2], [0.6, 1.34, W2, H2], [0.6, cy + 0.14, W2, H2], [5.2, cy + 0.14, W2, H2]] : [[5.2, 1.34, W2, H2], [0.6, 1.34, W2, H2], [0.6, cy + 0.14, 8.8, H2]];
          arrowR(s, 0.45, cy, 9.05); arrowU(s, cx, 1.28, 3.7);
          for (const [i, c] of d.items.entries()) {
            const [x, y, w, ht] = cell[i];
            sheet(s, x, y, w, ht);
            t.oval(s, x + 0.1, y + 0.08, 0.5, 0.5, C.pal[i]); t.img(s, await L.icon(c.icon, 'FFFFFF', 2), x + 0.22, y + 0.2, 0.26, 0.26);
            head(s, c.h, x + 0.7, y + 0.08, w - 0.8, 0.5, { max: 15 });
            body(s, c.t, x + 0.12, y + 0.66, w - 0.24, ht - 0.72, { max: 13 });
          }
        },
        async (d) => { // a system of equations: one brace holds all the lines
          const s = await page(d), n = d.items.length, top = 1.32, ht = 3.72, rh = ht / n;
          sheet(s, 1.1, top, 8.3, ht);
          await brace(s, 0.55, top, 0.52, ht, C.ink);
          for (const [i, c] of d.items.entries()) {
            const y = top + i * rh;
            t.img(s, await L.icon(c.icon, C.pal[i], 2), 1.25, y + rh / 2 - 0.2, 0.4, 0.4);
            head(s, c.h, 1.85, y + 0.04, 2.35, rh - 0.08, { max: 15 });
            it(s, '=', 4.2, y, 0.4, rh, { size: 20, color: C.accent });
            body(s, c.t, 4.65, y + 0.05, 4.65, rh - 0.1, { max: 13, valign: 'middle' });
            if (i < n - 1) t.line(s, 1.25, y + rh, 8.05, 0, line, 0.75);
          }
        },
        async (d) => { // points on a curve, each card hangs below its point at its own height
          const s = await page(d), n = d.items.length, g = 0.14, w = (8.8 - g * (n - 1)) / n, ch = 2.78;
          const ys = n === 4 ? [2.3, 1.72, 1.72, 2.3] : [2.3, 1.72, 2.3], pts = ys.map((y, i) => [0.6 + i * (w + g) + w / 2, y - 0.25]);
          let dd = `M${(pts[0][0] - 0.5) * 100},${(pts[0][1] + 0.3) * 100}`; pts.forEach(([a, b], i) => { if (i) { const [p, q] = pts[i - 1]; dd += ` C${(p + (a - p) / 2) * 100},${q * 100 - (i === n - 1 || i === 1 ? 0 : 40)} ${(p + (a - p) / 2) * 100},${b * 100 - (i === n - 1 || i === 1 ? 0 : 40)} ${a * 100},${b * 100}`; } else dd += ` L${a * 100},${b * 100}`; });
          dd += ` L${(pts[n - 1][0] + 0.5) * 100},${(pts[n - 1][1] + 0.3) * 100}`;
          t.img(s, await svgOnce(ctx, 'hang' + n, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300"><path d="${dd}" fill="none" stroke="#${C.accent}" stroke-width="4"/></svg>`, 1000, 300), 0, 0, 10, 3);
          for (const [i, c] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = ys[i], [px, py] = pts[i];
            t.line(s, px, py, 0, y - py, C.ink, 1, { dash: 'dash' });
            await panel(s, x, y, w, ch, i, {});
            t.oval(s, px - 0.25, py - 0.25, 0.5, 0.5, C.pal[i], { line: { color: 'FFFFFF', width: 1.5 } }); t.img(s, await L.icon(c.icon, 'FFFFFF', 2), px - 0.13, py - 0.13, 0.26, 0.26);
            head(s, c.h, x + 0.12, y + 0.28, w - 0.24, 0.5, { max: 14, align: 'center' });
            body(s, c.t, x + 0.12, y + 0.8, w - 0.24, ch - 0.86, { max: 13, align: 'center' });
          }
        },
        async (d) => { // fractions on the blackboard: the heading over the bar, the words under it
          const s = await dark(d)(), n = d.items.length, g = 0.3, w = (8.8 - g * (n - 1)) / n, cols = [sun, sky, 'F7A1B5', 'A8E6A1'];
          for (const [i, c] of d.items.entries()) {
            const x = 0.6 + i * (w + g), col = cols[i];
            t.img(s, await L.icon(c.icon, col, 2), x + w / 2 - 0.25, 1.32, 0.5, 0.5);
            head(s, c.h, x, 1.9, w, 0.72, { max: 16, color: chalk, align: 'center', valign: 'bottom' });
            t.line(s, x, 2.7, w, 0, col, 2.5);
            body(s, c.t, x, 2.82, w, 2.25, { max: 14, color: 'DCE5F0', align: 'center' });
            if (i < n - 1) it(s, '+', x + w, 2.45, g, 0.5, { size: 20, color: soft });
          }
        },
      ],
      process: [
        async (d) => { // a step function: each tread higher than the last, closed point on the left, open on the right
          const s = await page(d), n = d.steps.length, base = 5.08, w = 8.65 / n, y0 = 2.98, yN = 1.42;
          arrowR(s, 0.55, base, 8.95); arrowU(s, 0.6, 1.26, 3.88);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.72 + i * w, y = y0 - i * (y0 - yN) / (n - 1), c = C.pal[i];
            t.line(s, x, y, w - 0.08, 0, c, 3);
            t.oval(s, x - 0.08, y - 0.08, 0.16, 0.16, c);
            if (i < n - 1) t.oval(s, x + w - 0.16, y - 0.08, 0.16, 0.16, 'FFFFFF', { line: { color: c, width: 2 } });
            const tt = y + 0.1;
            sheet(s, x + 0.02, tt, w - 0.16, 1.92);
            head(s, `${i + 1}. ${st.h}`, x + 0.05, tt, w - 0.22, 0.5, { max: 14 });
            body(s, st.t, x + 0.05, tt + 0.52, w - 0.22, 1.38, { max: 13 });
          }
        },
        async (d) => { // the y axis up the middle, the steps on both sides of it at its ticks
          const s = await page(d), n = d.steps.length, ch = 1.68, w = 4.1, ys = n === 4 ? [3.42, 2.9, 1.34, 1.34 + 0.0] : [3.4, 2.36, 1.32];
          arrowU(s, 5, 1.28, 3.84);
          const my = n === 4 ? [4.72, 3.82, 2.92, 2.02] : [4.3, 3.2, 2.1];
          const yy = n === 4 ? [3.38, 3.38, 1.32, 1.32] : ys;
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.25 : 0.65, y = yy[i], m = n === 4 ? [4.22, 3.82, 2.16, 1.76][i] : my[i];
            sheet(s, x, y, w, ch); t.rect(s, right ? x : x + w - 0.05, y, 0.05, ch, C.pal[i], { name: 'Edge' });
            t.line(s, right ? 5 : x + w, m, 0.25, 0, C.pal[i], 1.5);
            await marker(s, 5 - 0.19, m - 0.19, 0.38, i, '');
            head(s, `${i + 1}. ${st.h}`, x + 0.12, y + 0.05, w - 0.24, 0.45, { max: 14, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.12, y + 0.52, w - 0.24, ch - 0.58, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a derivation on one sheet: therefore signs, equation numbers in the margin, the square at the end
          const s = await page(d), n = d.steps.length, top = 1.3, ht = 3.75, rh = ht / n;
          await panel(s, 0.6, top, 8.8, ht, 0, { big: true });
          for (const [i, st] of d.steps.entries()) {
            const y = top + i * rh;
            it(s, i ? '∴' : '∵', 0.72, y, 0.5, rh, { size: 22, color: C.accent, bold: true });
            head(s, st.h, 1.25, y + 0.04, 2.3, rh - 0.08, { max: 15 });
            body(s, st.t, 3.65, y + 0.05, 4.95, rh - 0.1, { max: 13, valign: 'middle' });
            it(s, `(${i + 1})`, 8.65, y, 0.62, rh, { size: 14, color: C.muted, align: 'right' });
            if (i < n - 1) t.line(s, 1.25, y + rh, 7.95, 0, line, 0.75);
          }
          t.rect(s, 9.13, top + ht - 0.22, 0.14, 0.14, C.ink, { name: 'End of proof' });
        },
      ],
      stats: [
        async (d) => { // three lines aligned on their equals signs
          const s = await page(d), hh = d.note ? 2.85 : 3.75, rh = hh / 3;
          sheet(s, 0.6, 1.3, 8.8, hh);
          for (const [i, x] of d.stats.entries()) {
            const y = 1.3 + i * rh;
            it(s, [{ text: 'x' }, { text: String(i + 1), options: { subscript: true } }], 0.7, y, 0.8, rh, { size: 26, color: C.pal[i] });
            it(s, '=', 1.5, y, 0.5, rh, { size: 26, color: C.muted });
            t.text(s, x.value, { x: 2.05, y, w: 2.9, h: rh, fontFace: HF, bold: true, fontSize: L.fit(x.value, 2.9, rh - 0.1, 42, 20, HF, true), color: C.ink, valign: 'middle' });
            body(s, x.label, 5.05, y + 0.05, 4.25, rh - 0.1, { max: 15, valign: 'middle' });
            if (i < 2) t.line(s, 0.7, y + rh, 8.6, 0, line, 0.75);
          }
          if (d.note) { t.rect(s, 0.6, 4.2, 8.8, 0.88, 'FFFFFF', { line: { color: C.accent, width: 1 }, name: 'Note' }); body(s, d.note, 0.72, 4.23, 8.56, 0.82, { max: 12, valign: 'middle', color: C.muted }); }
        },
        async (d) => { // the answer circled on the blackboard, the working beside it
          const s = await dark(d)(), [a, b, c] = d.stats, hh = d.note ? 2.72 : 3.7;
          t.oval(s, 0.6, 1.3, 4.5, hh, null, { line: { color: sun, width: 3 }, name: 'Answer ring' });
          t.text(s, a.value, { x: 0.95, y: 1.3 + hh * 0.14, w: 3.8, h: hh * 0.46, fontFace: HF, bold: true, fontSize: L.fit(a.value, 3.8, hh * 0.44, 60, 24, HF, true), color: sun, align: 'center', valign: 'middle' });
          body(s, a.label, 1.3, 1.3 + hh * 0.6, 3.1, hh * 0.28, { max: 13, color: chalk, align: 'center' });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * (hh / 2 + 0.02), col = i ? 'F7A1B5' : sky, cw = 3.95;
            t.text(s, x.value, { x: 5.45, y: y + 0.04, w: cw, h: hh / 2 * 0.5, fontFace: HF, bold: true, fontSize: L.fit(x.value, cw, hh / 2 * 0.48, 32, 16, HF, true), color: col, valign: 'bottom' });
            t.line(s, 5.45, y + hh / 2 * 0.56, cw, 0, col, 2);
            body(s, x.label, 5.45, y + hh / 2 * 0.6, cw, hh / 2 * 0.38, { max: 12.5, color: chalk });
          }
          if (d.note) body(s, d.note, 0.6, 4.12, 8.8, 0.96, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // reflection in the y axis: one side the mirror image of the other
          const s = await page(d), w = 4.05, n = Math.max(d.left.items.length, d.right.items.length), top = 1.98, av = 3.08, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.1, 'Calibri', 0.14, av);
          sheet(s, 0.6, 1.3, 8.8, 3.8); arrowU(s, 5, 1.32, 3.72);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.2 : 0.75, c = i ? C.pal[1] : C.pal[0];
            head(s, side.h, x, 1.34, w, 0.56, { max: 19, color: c, align: i ? 'left' : 'right' });
            t.line(s, x, 1.92, w, 0, c, 2);
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w, h: rh, fontSize: fs, color: C.ink, align: i ? 'left' : 'right', valign: 'middle' });
          }
          for (let j = 0; j < n; j++) t.line(s, 4.92, top + j * rh + rh / 2, 0.16, 0, C.ink, 1.5);
        },
        async (d) => { // two sets, one above the other, each written out in its braces
          const s = await page(d), hh = 1.82;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.3 + i * (hh + 0.12), c = dk[i], n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.16) / rws, w = 3.05;
            t.rect(s, 0.6, y, 8.8, hh, 'FFFFFF', { line: { color: line, width: 1 }, name: 'Set' }); t.rect(s, 0.6, y, 2.2, hh, c, { name: 'Set name' });
            head(s, side.h, 0.72, y + 0.1, 1.96, hh - 0.2, { max: 18, color: 'FFFFFF' });
            await brace(s, 2.84, y + 0.08, 0.2, hh - 0.16, c); await brace(s, 9.14, y + 0.08, 0.2, hh - 0.16, c, true);
            const fs = Math.min(...side.items.map((v) => L.fit(v, w, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) t.text(s, v, { x: 3.03 + (j % 2) * (w + 0.1), y: y + 0.08 + Math.floor(j / 2) * rh, w, h: rh, fontSize: fs, color: C.ink, valign: 'middle' });
          }
        },
      ],
      statement: [
        async (d) => { // a great integral sign chalked on the board, the claim beside it
          const s = await dark(d)();
          t.text(s, '∫', { x: 0.45, y: 0.95, w: 1.5, h: 3.95, fontFace: HF, fontSize: 170, color: sun, align: 'center', valign: 'middle', noFit: true });
          t.text(s, L.runs(d.text), { x: 2.05, y: 1.3, w: 7.35, h: 2.2, fontFace: HF, bold: true, fontSize: L.fit(d.text, 7.35, 2.15, 30, 16, HF, true), color: chalk, valign: 'middle' });
          t.line(s, 2.05, 3.58, 7.35, 0, soft, 1);
          if (d.caption) body(s, d.caption, 2.05, 3.68, 7.35, 1.4, { max: 14, color: 'DCE5F0' });
        },
        async (d) => { // a theorem written over its own graph: a tall column of words, the curve climbing beside it
          const s = await page(d, 'focus');
          sheet(s, 0.6, 1.3, 5.5, 3.8); t.rect(s, 0.6, 1.3, 0.08, 3.8, C.accent, { name: 'Theorem edge' });
          t.text(s, L.runs(d.text), { x: 0.85, y: 1.36, w: 5.1, h: 3.66, fontFace: HF, bold: true, fontSize: L.fit(d.text, 5.1, 3.6, 30, 16, HF, true), color: C.ink, valign: 'middle' });
          t.img(s, await svgOnce(ctx, 'plot', plot(), 800, 420), 6.3, 1.25, 3.2, 1.68);
          if (d.caption) { sheet(s, 6.35, 3.0, 3.05, 2.1); body(s, d.caption, 6.42, 3.03, 2.91, 2.04, { max: 13 }); }
        },
      ],
      timeline: [
        async (d) => { // a wave: the crests with their words under them, the troughs with theirs above
          const s = await page(d), cw = 2.2, topY = 1.42, botY = 4.92;
          let p = ''; for (let k = 0; k < 4; k++) { const a = 0.6 + (k + 0.5) * cw; p += k ? ` S${(a - cw / 2) * 100},${(k % 2 ? botY + 0.25 : topY - 0.25) * 100} ${a * 100},${(k % 2 ? botY : topY) * 100}` : `M${a * 100 - 90},${(topY + 0.5) * 100} Q${a * 100 - 40},${topY * 100} ${a * 100},${topY * 100}`; }
          t.img(s, await svgOnce(ctx, 'wave', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562"><path d="${p}" fill="none" stroke="#${C.pal[1]}" stroke-width="4"/></svg>`, 1000, 562), 0, 0, 10, 5.62);
          for (const [i, c] of d.items.entries()) {
            const up = i % 2 === 0, x = 0.6 + i * cw, px = x + cw / 2, py = up ? topY : botY, by = up ? 1.62 : 3.0;
            sheet(s, x + 0.17, by, cw - 0.34, 1.82);
            t.oval(s, px - 0.1, py - 0.1, 0.2, 0.2, C.pal[i], { line: { color: 'FFFFFF', width: 1.5 } });
            head(s, c.year, x + 0.19, by + 0.02, cw - 0.38, 0.36, { max: 17, color: dk[i], align: 'center' });
            head(s, c.h, x + 0.19, by + 0.38, cw - 0.38, 0.3, { max: 13, align: 'center' });
            body(s, c.t, x + 0.19, by + 0.68, cw - 0.38, 1.12, { max: 12, align: 'center' });
          }
        },
        async (d) => { // a straight line falling across the page, a card at each point on it
          const s = await page(d), w = 4.4, hh = 0.92, sx = (8.8 - w) / 3, sy = 0.95;
          t.shape(s, 'LINE', { x: 0.75, y: 1.5, w: 8.5, h: 3.4, line: { color: C.accent, width: 2.5, dashType: 'dash' }, objectName: 'Line' });
          for (const [i, c] of d.items.entries()) {
            const x = 0.6 + i * sx, y = 1.3 + i * sy;
            t.rect(s, x, y, w, hh, 'FFFFFF', { line: { color: C.pal[i], width: 1.5 }, name: 'Point' });
            t.rect(s, x, y, 0.95, hh, C.pal[i] === 'F39C12' ? 'B9770E' : dk[i], { name: 'Year' });
            head(s, c.year, x + 0.03, y + 0.05, 0.89, hh - 0.1, { max: 15, color: 'FFFFFF', align: 'center' });
            head(s, c.h, x + 1.03, y + 0.02, w - 1.1, 0.26, { max: 12.5 });
            body(s, c.t, x + 1.03, y + 0.28, w - 1.1, hh - 0.3, { max: 11 });
          }
        },
      ],
    };
    R.image = V.image.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, await svgOnce(ctx, 'plot', plot(), 800, 420), 5.0, 0.55, 4.7, 2.47);
    if (d.image) await K.photo(ctx, s, d.image, 6.85, 3.2, 2.5, 1.6);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.3, h: 2.3, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.3, 2.2, 36, 18, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.3, h: 0.75, fontSize: 12, color: C.muted });
    t.text(s, [{ text: 'f(x) = ', options: { italic: true, color: C.muted } }, { text: M.author || '', options: { bold: true, color: C.ink } }], { x: 0.6, y: 4.2, w: 4.3, h: 0.45, fontFace: 'Cambria', fontSize: 16 });
    metaFooter({ color: C.muted, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 85, slug: 'formula', name: 'Formula', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "matematik aniqlik: ta'rif, bog'liqlik va isbotga o'xshash mantiqiy ketma-ketlik", limits: {}, prefer: 'data' } };
