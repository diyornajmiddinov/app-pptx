/** 89 Graffiti — street art: concrete wall, paste-up posters, paint splats as markers, dripping paint underline. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '8C8C88', ink: '1A1A1A', muted: '3E3E3E', accent: 'FF2E63', poster: 'F5F2EA', pal: ['FF2E63', '08D9D6', 'FFD32D', '7CFF4F', 'A259FF', 'FF8A00'] };
const wall = () => { let d = '', x0 = 11; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 1800; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(0.8 + rnd() * 2.2).toFixed(1)}" fill="#${rnd() > 0.5 ? '6E6E6A' : 'A6A6A0'}" opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${d}<g stroke="#6E6E6A" stroke-width="3" opacity="0.5"><line x1="0" y1="300" x2="1600" y2="300"/><line x1="0" y1="600" x2="1600" y2="600"/><line x1="530" y1="0" x2="530" y2="900"/><line x1="1070" y1="0" x2="1070" y2="900"/></g></svg>`; };
const splat = (c, seed) => { let x0 = seed, p = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const pts = []; for (let k = 0; k < 16; k++) { const a = (k / 16) * 2 * Math.PI, r = 70 + rnd() * 28; pts.push(`${(100 + r * Math.cos(a)).toFixed(0)},${(100 + r * Math.sin(a)).toFixed(0)}`); }
  for (let k = 0; k < 6; k++) { const a = rnd() * 2 * Math.PI, r = 92 + rnd() * 8; p += `<circle cx="${(100 + r * Math.cos(a)).toFixed(0)}" cy="${(100 + r * Math.sin(a)).toFixed(0)}" r="${(4 + rnd() * 6).toFixed(0)}" fill="#${c}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${pts.join(' ')}" fill="#${c}"/>${p}</svg>`; };
const drip = (w, c) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="80"><rect x="0" y="0" width="${w}" height="16" rx="8" fill="#${c}"/>${Array.from({ length: Math.floor(w / 60) }, (_, k) => `<rect x="${20 + k * 60 + (k % 3) * 9}" y="8" width="9" height="${20 + (k * 37) % 50}" rx="4.5" fill="#${c}"/>`).join('')}</svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, caps: true, theme: theme('Graffiti', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'wall', wall(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, C.poster, { rotate: o.big ? 0 : (k % 2 ? 0.8 : -0.8), shadow: 0.35, blur: 4, offset: 2, name: 'Poster' }); ctx.t.rect(s, x - 0.05, y - 0.05, 0.6, 0.18, 'FFFFFF', { t: 35, rotate: -20, name: 'Paste' }); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'sp' + (k % 6), splat(C.pal[k % 6], 7 + k), 200, 200), x - d * 0.1, y - d * 0.1, d * 1.2, d * 1.2); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.poster, { rotate: -1, shadow: 0.35, blur: 4, offset: 2, name: 'Poster' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.3, 0.72, ctx.idx, ctx.idx); if (d.title) { const T = d.title.toUpperCase(), fs = L.fit(T, 8.0, 0.65, 28, 15, 'Arial', true); t.text(s, T, { x: 1.4, y: 0.32, w: 8.05, h: 0.68, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: fs }); t.img(s, await svgOnce(ctx, 'drip' + (ctx.idx % 6), drip(600, C.pal[ctx.idx % 6]), 600, 80), 1.4, 1.0, Math.min(6, L.width(T, fs, 'Arial', true)), 0.35); } },
  footer: metaFooter({ color: C.ink, size: 8 }),
  onBgMuted: C.ink, onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial', P = C.poster;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => { const T = String(v).toUpperCase(); t.text(s, T, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(T, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' }); };
    const night = '141416', tar = '26262A', chalk = 'F4F4F0', soft = 'C8C8C2', deep = ['C70F45', '067F7D', '8A6D00', '2C8A0E', '6B2BC9', 'B85F00'];
    const poster = (s, x, y, w, ht, rot = 0, c = P) => t.rect(s, x, y, w, ht, c, { rotate: rot, shadow: 0.35, blur: 4, offset: 2, name: 'Poster' });
    const tape = (s, x, y, rot = -18) => t.rect(s, x, y, 0.62, 0.17, 'FFFFFF', { t: 30, rotate: rot, name: 'Tape' });
    const dripImg = async (s, x, y, w, ht, c) => t.img(s, await svgOnce(ctx, 'dr' + c, drip(600, c), 600, 80), x, y, w, ht);
    const sp = async (s, x, y, dd, k) => { t.img(s, await svgOnce(ctx, 'sp' + (k % 6), splat(C.pal[k % 6], 7 + k), 200, 200), x, y, dd, dd); };
    const dark = async (d) => { const s = await newSlide('focus'); t.rect(s, 0, 0, 10, 5.625, night, { name: 'Black wall' }); await K.title(ctx, s, d); metaFooter({ color: soft, size: 8 })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // the picture torn out of a bigger poster and pasted over a splat
          const s = await page(d), x = 5.0, y = 1.42, w = 4.4, ht = 3.6, torn = [[0.02, 0.03], [0.14, 0], [0.28, 0.04], [0.44, 0.01], [0.6, 0.04], [0.78, 0], [0.99, 0.03], [0.97, 0.22], [1, 0.42], [0.97, 0.62], [1, 0.82], [0.98, 0.98], [0.82, 0.96], [0.64, 1], [0.46, 0.96], [0.3, 1], [0.12, 0.96], [0.01, 0.98], [0.03, 0.76], [0, 0.56], [0.03, 0.36], [0, 0.18]];
          await sp(s, 7.9, 1.15, 1.75, 0); await sp(s, 4.55, 3.85, 1.35, 2);
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { poly: torn } }), x, y, w, ht, { alt: '' });
          poster(s, 0.6, 1.5, 4.15, 3.5, -0.6); tape(s, 2.3, 1.42);
          body(s, d.text, 0.78, 1.62, 3.8, 3.28, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // the picture fills the wall, a block of black paint over one side
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.17, 10, 0.455, night, { name: 'Footer band' }); metaFooter({ color: chalk, size: 8 })(ctx, s);
          t.rect(s, 5.0, 0, 5, 5.17, night, { t: 8, name: 'Black paint' });
          await sp(s, 5.1, 0.25, 0.72, ctx.idx); t.text(s, String(ctx.idx), { x: 5.1, y: 0.25, w: 0.72, h: 0.72, bold: true, fontSize: 18, color: C.ink, align: 'center', valign: 'middle' });
          head(s, d.title, 5.95, 0.2, 3.75, 0.82, { max: 18, color: chalk });
          await dripImg(s, 5.95, 1.0, 3.3, 0.3, C.pal[1]);
          body(s, d.text, 5.3, 1.45, 4.4, 3.55, { max: 14, color: chalk, k: 1.12, valign: 'middle' });
        },
        async (d) => { // the picture sprayed through a round stencil, a great splat behind it
          const s = await page(d), dd = 3.0, x = 1.1, y = 1.72;
          await sp(s, x - 0.75, y - 0.72, dd + 1.5, 4);
          t.oval(s, x - 0.06, y - 0.06, dd + 0.12, dd + 0.12, night);
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
          poster(s, 5.15, 1.5, 4.3, 3.52, 0.6); tape(s, 7.0, 1.42, 12);
          body(s, d.text, 5.33, 1.62, 3.94, 3.3, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // a long strip across the bricks, gaffer tape at both ends, the words on a poster under it
          const s = await page(d), y = 1.45, ht = 1.6;
          t.img(s, await L.photo(L.src(d.image), 8.8, ht), 0.6, y, 8.8, ht, { alt: '' });
          t.rect(s, 0.35, y + 0.1, 0.8, 0.26, night, { rotate: -24, name: 'Gaffer tape' }); t.rect(s, 8.85, y + ht - 0.34, 0.8, 0.26, night, { rotate: -24, name: 'Gaffer tape' });
          poster(s, 0.6, 3.18, 8.8, 1.92);
          body(s, d.text, 0.76, 3.23, 8.48, 1.82, { max: 14, k: 1.08, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // posters pasted in a pile, each with a colour tag, none of them quite straight
          const s = await page(d), n = d.items.length, g = 0.1, top = 1.42, rh = (3.7 - g * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const y = top + i * (rh + g), x = 0.6 + (i % 2 ? 0.28 : 0), w = 8.52;
            poster(s, x, y, w, rh, i % 2 ? 0.3 : -0.3);
            t.rect(s, x, y, 0.82, rh, C.pal[i], { name: 'Tag' });
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.23, y + rh / 2 - 0.18, 0.36, 0.36);
            head(s, it.h, x + 0.95, y + 0.05, 2.5, rh - 0.1, { max: 14 });
            body(s, it.t, x + 3.55, y + 0.06, w - 3.7, rh - 0.12, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // name stickers slapped on a wall: colour across the top, the heading written in it
          const s = await page(d), n = d.items.length, g = 0.16, w = (8.8 - g) / 2, ht = 1.78, y2 = 1.42 + ht + g, cell = n === 4 ? [[0.6, 1.42, w, ht], [0.6 + w + g, 1.42, w, ht], [0.6, y2, w, ht], [0.6 + w + g, y2, w, ht]] : [[0.6, 1.42, w, 2 * ht + g], [0.6 + w + g, 1.42, w, ht], [0.6 + w + g, y2, w, ht]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw, ch] = cell[i], tall = ch > 2, bar = tall ? 1.0 : 0.56;
            t.rect(s, x, y, cw, ch, C.pal[i], { r: 0.1, shadow: 0.35, blur: 4, offset: 2, name: 'Sticker' });
            t.rect(s, x + 0.07, y + bar, cw - 0.14, ch - bar - 0.07, 'FFFFFF', { r: 0.05, name: 'Sticker field' });
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.14, y + bar / 2 - (tall ? 0.24 : 0.17), tall ? 0.48 : 0.34, tall ? 0.48 : 0.34);
            head(s, it.h, x + (tall ? 0.74 : 0.56), y + 0.05, cw - (tall ? 0.84 : 0.66), bar - 0.1, { max: tall ? 19 : 14 });
            body(s, it.t, x + 0.18, y + bar + 0.08, cw - 0.36, ch - bar - 0.22, { max: tall ? 16 : 13, k: tall ? 1.15 : undefined });
          }
        },
        async (d) => { // after dark: tags in neon on a black wall, thrown up at different heights
          const s = await dark(d), n = d.items.length, g = 0.18, w = (8.8 - g * (n - 1)) / n, ht = 3.0, c = [C.pal[0], C.pal[1], C.pal[2], C.pal[3]];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = i % 2 ? 2.1 : 1.42;
            t.rect(s, x, y, w, ht, tar, { line: { color: c[i], width: 2.5 }, name: 'Tag' });
            t.img(s, await L.icon(it.icon, c[i], 2), x + 0.16, y + 0.14, 0.42, 0.42);
            head(s, it.h, x + 0.14, y + 0.6, w - 0.28, 0.6, { max: 14, color: c[i] });
            body(s, it.t, x + 0.14, y + 1.22, w - 0.28, ht - 1.3, { max: 13, color: chalk });
          }
        },
        async (d) => { // one huge splat on the wall, paste-ups stuck around it
          const s = await page(d), n = d.items.length, cw = 3.45, ch = 1.74, cell = n === 4 ? [[0.6, 1.4], [5.95, 1.4], [0.6, 3.34], [5.95, 3.34]] : [[0.6, 1.4], [5.95, 2.37], [0.6, 3.34]];
          await sp(s, 3.35, 1.55, 3.3, 2);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            poster(s, x, y, cw, ch, i % 2 ? 0.7 : -0.7); tape(s, x + cw / 2 - 0.3, y - 0.07, i % 2 ? 10 : -10);
            await sp(s, x + 0.08, y + 0.08, 0.5, i);
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.21, y + 0.21, 0.24, 0.24);
            head(s, it.h, x + 0.62, y + 0.1, cw - 0.74, 0.46, { max: 13 });
            body(s, it.t, x + 0.16, y + 0.6, cw - 0.32, ch - 0.68, { max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // arrows rollered straight on the wall, the words on posters under them
          const s = await page(d), n = d.steps.length, w = 8.8 / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * w;
            t.shape(s, 'PENTAGON', { x, y: 1.45, w: w - 0.04, h: 0.95, fill: { color: C.pal[i] }, line: { color: C.ink, width: 2 }, objectName: 'Painted arrow' });
            head(s, st.h, x + 0.14, 1.5, w - 0.62, 0.85, { max: 14 });
            poster(s, x + 0.04, 2.55, w - 0.16, 2.53, i % 2 ? 0.5 : -0.5);
            t.text(s, String(i + 1), { x: x + 0.14, y: 2.58, w: 0.6, h: 0.5, bold: true, fontSize: 24, color: deep[i] });
            body(s, st.t, x + 0.14, 3.08, w - 0.36, 1.96, { max: 14 });
          }
        },
        async (d) => { // paint running down the wall, a splat at each step, posters left and right
          const s = await page(d), n = d.steps.length, w = 4.0, ch = 1.68, ys = n === 4 ? [1.42, 1.62, 3.4, 3.42] : [1.42, 2.4, 3.4], my = n === 4 ? [1.55, 2.42, 3.3, 4.17] : [1.95, 2.92, 3.9];
          t.rect(s, 4.91, 1.38, 0.18, 3.72, C.accent, { r: 0.08, name: 'Paint run' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.4 : 0.6, y = ys[i];
            poster(s, x, y, w, ch, right ? 0.4 : -0.4);
            await marker(s, 4.72, my[i], 0.56, i + 1, i + 1);
            head(s, st.h, x + 0.16, y + 0.08, w - 0.32, 0.46, { max: 14, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.16, y + 0.56, w - 0.32, ch - 0.62, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // posters climbing a stair, each pasted higher than the last, one colour band on each
          const s = await page(d), n = d.steps.length, g = 0.1, w = (8.8 - g * (n - 1)) / n, y0 = 2.9, yN = 1.42, floor = 5.1;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g), y = y0 - i * (y0 - yN) / (n - 1);
            poster(s, x, y, w, floor - y);
            t.rect(s, x, y, w, 0.5, C.pal[i], { name: 'Band' });
            t.text(s, String(i + 1), { x: x + 0.08, y, w: 0.42, h: 0.5, bold: true, fontSize: 20, color: C.ink, valign: 'middle' });
            head(s, st.h, x + 0.46, y + 0.02, w - 0.52, 0.46, { max: 12 });
            body(s, st.t, x + 0.12, y + 0.58, w - 0.24, floor - y - 0.64, { max: 13 });
          }
        },
        async (d) => { // stencilled numbers, huge, sprayed on black; the words beside them
          const s = await dark(d), n = d.steps.length, top = 1.4, rh = 3.72 / n;
          for (const [i, st] of d.steps.entries()) {
            const y = top + i * rh, c = C.pal[i];
            t.text(s, String(i + 1), { x: 0.6, y, w: 1.0, h: rh, bold: true, fontSize: Math.min(58, Math.round(rh * 62)), color: c, align: 'center', valign: 'middle', noFit: true });
            head(s, st.h, 1.75, y + 0.05, 2.5, rh - 0.1, { max: 15, color: c });
            body(s, st.t, 4.35, y + 0.06, 5.05, rh - 0.12, { max: 13.5, color: chalk, valign: 'middle' });
            if (i < n - 1) t.line(s, 0.6, y + rh, 8.8, 0, '4A4A4E', 1.5, { dash: 'dash' });
          }
        },
      ],
      stats: [
        async (d) => { // three strokes of a paint roller, a figure on each, torn labels beneath
          const s = await page(d), w = 8.8 / 3 - 0.08, ty = d.note ? 1.42 : 1.6;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * (w + 0.12), y = ty + [0, 0.22, 0.06][i], c = [0, 1, 2][i];
            t.rect(s, px, y, w, 1.28, C.pal[c], { rotate: [-1.2, 0.8, -0.6][i], name: 'Paint stroke' });
            t.text(s, x.value, { x: px + 0.1, y, w: w - 0.2, h: 1.28, bold: true, fontSize: L.fit(x.value, w - 0.2, 1.2, 50, 20, HF, true), color: C.ink, align: 'center', valign: 'middle' });
            poster(s, px + 0.15, y + 1.34, w - 0.3, 0.72);
            body(s, x.label, px + 0.24, y + 1.37, w - 0.48, 0.66, { max: 13, align: 'center', valign: 'middle' });
          }
          if (d.note) { t.rect(s, 0.6, 3.95, 8.8, 1.15, night, { name: 'Note' }); body(s, d.note, 0.76, 3.98, 8.48, 1.09, { max: 13, color: chalk, valign: 'middle' }); }
        },
        async (d) => { // one figure thrown up huge on black, running paint under it, two smaller tags
          const s = await dark(d), [a, b, c] = d.stats;
          t.text(s, a.value, { x: 0.6, y: 1.42, w: 5.3, h: 1.3, bold: true, fontSize: L.fit(a.value, 5.3, 1.25, 76, 28, HF, true), color: C.pal[2], valign: 'middle' });
          await dripImg(s, 0.6, 2.75, 5.0, 0.46, C.pal[2]);
          body(s, a.label, 0.6, 3.25, 5.0, 0.72, { max: 15, color: chalk });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.42 + i * 1.3, col = C.pal[i ? 0 : 1];
            t.rect(s, 6.15, y, 3.25, 1.2, tar, { line: { color: col, width: 2 }, name: 'Tag' });
            t.text(s, x.value, { x: 6.27, y: y + 0.06, w: 3.0, h: 0.55, bold: true, fontSize: L.fit(x.value, 3.0, 0.53, 28, 16, HF, true), color: col, valign: 'middle' });
            body(s, x.label, 6.27, y + 0.62, 3.0, 0.52, { max: 12, color: chalk });
          }
          if (d.note) body(s, d.note, 0.6, 4.05, 8.8, 1.05, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // the wall painted in two halves, the crews facing each other across the line
          const s = await page(d), w = 3.95, n = Math.max(d.left.items.length, d.right.items.length), top = 2.1, av = 2.92, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.1, 'Calibri', 0.14, av);
          t.rect(s, 0.6, 1.42, 4.4, 3.68, C.pal[0], { name: 'Paint' }); t.rect(s, 5.0, 1.42, 4.4, 3.68, C.pal[1], { name: 'Paint' });
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.28 : 0.78;
            head(s, side.h, x, 1.48, w, 0.56, { max: 17, align: i ? 'left' : 'right' });
            t.line(s, x, 2.05, w, 0, C.ink, 2.5);
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w, h: rh, fontSize: fs, color: C.ink, align: i ? 'left' : 'right', valign: 'middle' });
          }
          t.rect(s, 4.93, 1.42, 0.14, 3.68, night, { name: 'Line' });
        },
        async (d) => { // two long paste-ups, one over the other, a black tag holds each name
          const s = await page(d), hh = 1.78;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.42 + i * (hh + 0.14), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.16) / rws, w = 3.2, c = C.pal[i ? 3 : 2];
            poster(s, 0.6, y, 8.8, hh, i ? 0.3 : -0.3);
            t.rect(s, 0.6, y, 2.0, hh, night, { name: 'Black tag' });
            head(s, side.h, 0.7, y + 0.1, 1.8, hh - 0.2, { max: 16, color: c });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.22, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 2.75 + (j % 2) * (w + 0.05), yy = y + 0.08 + Math.floor(j / 2) * rh;
              t.oval(s, x, yy + rh / 2 - 0.07, 0.14, 0.14, deep[i ? 3 : 2]);
              t.text(s, v, { x: x + 0.21, y: yy, w: w - 0.22, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // sprayed across the black wall, paint running off the last line
          const s = await dark(d);
          const T = d.text.toUpperCase();
          t.text(s, T, { x: 0.6, y: 1.45, w: 8.8, h: 2.1, bold: true, fontSize: L.fit(T, 8.8, 2.05, 34, 16, HF, true), color: C.pal[1], valign: 'middle' });
          await dripImg(s, 0.6, 3.55, 6.0, 0.5, C.pal[1]);
          if (d.caption) body(s, d.caption, 0.6, 4.08, 8.8, 1.02, { max: 13, color: chalk, valign: 'middle' });
        },
        async (d) => { // a slab of yellow rolled on the bricks, the remark stuck at its side on a scrap
          const s = await page(d, 'focus');
          t.rect(s, 0.45, 1.42, 6.1, 3.68, C.pal[2], { rotate: -0.8, name: 'Yellow paint' });
          const T = d.text.toUpperCase();
          t.text(s, T, { x: 0.72, y: 1.55, w: 5.55, h: 3.4, bold: true, fontSize: L.fit(T, 5.55, 3.35, 30, 15, HF, true), color: C.ink, valign: 'middle' });
          await sp(s, 8.2, 1.02, 1.45, 0);
          if (d.caption) { poster(s, 6.75, 1.9, 2.75, 3.2, 1); tape(s, 7.8, 1.82, 8); body(s, d.caption, 6.88, 2.0, 2.5, 3.0, { max: 14, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a run of paint across the wall, dates on paste-ups above and below it in turn
          const s = await page(d), up = 1.4, dn = 3.42, hh = 1.56, cw = 4.05, ty = 3.03;
          t.rect(s, 0, ty, 10, 0.3, C.accent, { name: 'Paint run' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.45 + (above ? 0 : 0.3), y = above ? up : dn;
            poster(s, x, y, cw, hh, above ? -0.4 : 0.4);
            await marker(s, above ? x + 0.06 : x + cw - 0.56, ty - 0.1, 0.5, i + 1, '');
            t.rect(s, x, y, 1.45, 0.42, night, { name: 'Year tag' });
            head(s, it.year, x + 0.04, y, 1.37, 0.42, { max: 14, color: C.pal[(i + 1) % 6], align: 'center' });
            head(s, it.h, x + 1.53, y + 0.02, cw - 1.6, 0.38, { max: 12 });
            body(s, it.t, x + 0.12, y + 0.46, cw - 0.24, hh - 0.5, { max: 13 });
          }
        },
        async (d) => { // a course of bricks painted red, the upper row offset from the lower
          const s = await page(d), brick = 'A63D2B', ht = 1.78, w = 4.0;
          const cell = [[0.6, 1.42], [4.72, 1.42], [1.28, 3.32], [5.4, 3.32]];
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            t.rect(s, x, y, w, ht, brick, { line: { color: 'D9D5C8', width: 3 }, name: 'Brick' });
            head(s, it.year, x + 0.15, y + 0.08, 1.45, 0.46, { max: 18, color: C.pal[2] });
            head(s, it.h, x + 1.62, y + 0.08, w - 1.75, 0.46, { max: 12, color: 'FFFFFF' });
            body(s, it.t, x + 0.15, y + 0.58, w - 0.3, ht - 0.66, { max: 14, color: 'FFFFFF' });
          }
        },
        async (d) => { // tags climbing the wall from low left to high right
          const s = await page(d), w = 5.2, hh = 0.88, sx = (8.8 - w) / 3, sy = 0.93, bot = 5.1 - hh;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * sx, y = bot - i * sy;
            poster(s, x, y, w, hh);
            t.rect(s, x, y, 1.15, hh, C.pal[i], { name: 'Tag' });
            head(s, it.year, x + 0.03, y + 0.05, 1.09, hh - 0.1, { max: 14, align: 'center' });
            head(s, it.h, x + 1.25, y + 0.02, w - 1.33, 0.27, { max: 12 });
            body(s, it.t, x + 1.25, y + 0.29, w - 1.33, hh - 0.31, { max: 12 });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.3, 0.8, 3.0, 3.4);
    await K.marker(ctx, s, 5.4, 3.6, 1.3, 2, ''); await K.marker(ctx, s, 8.6, 0.25, 1.0, 0, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' // ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.ink });
    const T = d.title.toUpperCase();
    t.text(s, T, { x: 0.6, y: 1.0, w: 5.4, h: 2.3, bold: true, fontSize: L.fit(T, 5.4, 2.2, 42, 20, 'Arial', true), color: 'FFFFFF', valign: 'bottom' });
    t.img(s, await svgOnce(ctx, 'dripH', drip(600, C.accent), 600, 80), 0.6, 3.35, 4.2, 0.55);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.95, w: 5.0, h: 0.5, fontSize: 12, color: C.ink });
    t.text(s, `${M.author || ''}`.toUpperCase(), { x: 0.6, y: 4.45, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.ink, size: 8 })(ctx, s);
  },
};
module.exports = { id: 89, slug: 'graffiti', name: 'Graffiti', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ko'cha ovozi: dadil, qisqa, shiorlarga yaqin; lekin hurmatli va faktlarga tayangan", limits: { title: 40, card_h: 18, step_h: 18 }, prefer: 'visual' } };
