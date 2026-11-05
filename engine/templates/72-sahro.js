/** 72 Sahro — desert: layered dunes in warm sand tones, a low sun, caravan-path connectors. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F6E7C8', ink: '4A2E1A', muted: '7D5B3F', accent: 'C2512A', tile: 'FBF1DD', pal: ['E07A3F', 'C2512A', 'D9A35F', 'A66A3B', 'E9C48A', '7D5B3F'] };
const dunes = (h = 900, top = 560) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEFD9"/><stop offset="1" stop-color="#F6E0B8"/></linearGradient></defs>
  <rect width="1600" height="${h}" fill="url(#sky)"/><circle cx="1220" cy="${top - 120}" r="120" fill="#F0A35E" opacity="0.85"/>
  <path d="M0,${top} C300,${top - 90} 600,${top + 40} 900,${top - 40} S1400,${top - 60} 1600,${top - 10} L1600,${h} L0,${h} Z" fill="#E9C48A"/>
  <path d="M0,${top + 110} C350,${top + 30} 700,${top + 160} 1100,${top + 70} S1500,${top + 90} 1600,${top + 80} L1600,${h} L0,${h} Z" fill="#D9A35F"/>
  <path d="M0,${top + 230} C400,${top + 170} 800,${top + 260} 1600,${top + 190} L1600,${h} L0,${h} Z" fill="#C07F3E"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Sahro', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: async (ctx, s, kind) => { s.background = kind === 'page' ? { color: C.bg } : { data: await svgOnce(ctx, 'hero', dunes(), 1600, 900, true) }; if (kind === 'page') ctx.t.img(s, await svgOnce(ctx, 'band', dunes(140, 70), 1600, 140), 0, 4.75, 10, 0.875); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, o.big ? 'FFF7E8' : C.tile, { r: 0.18, line: { color: 'E2B979', width: 1.25 }, shadow: 0.15, blur: 6, offset: 2, name: 'Sandstone' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FBEFD9', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FBF1DD', { r: 0.2, shadow: 0.2, blur: 8, offset: 3, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.08 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9965C', 2, { dash: 'dash' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, 'C9965C', 2.5, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, `${ctx.idx}`, { x: 0.5, y: 0.35, w: 0.75, h: 0.7, fontFace: 'Cambria', fontSize: 30, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.3, y: 0.35, w: 8.15, h: 0.7, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.15, 0.7, 28, 16, 'Cambria', true) }); },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.4 },
  footer: metaFooter({ color: 'FFF7E8', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker, photo } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri'), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, fontSize: L.fit(v, w, h2, o.max || 16, 11, 'Cambria', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const iconDot = async (s, x, y, d, ic, k) => { t.oval(s, x, y, d, d, C.pal[k % 4], { line: { color: 'FBEFD9', width: 2 } }); t.img(s, await L.icon(ic, 'FFFFFF', 2), x + d * 0.27, y + d * 0.27, d * 0.46, d * 0.46); };
    const road = async (s, x, y, w, ht) => t.img(s, await svgOnce(ctx, 'road', `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="80"><path d="M4,60 C150,-10 280,110 440,40 S730,-10 876,50" fill="none" stroke="#C9965C" stroke-width="5" stroke-dasharray="14 10"/></svg>`, 880, 80), x, y, w, ht);
    const V = {
      image: [
        async (d) => { // the words first, then a picture whose upper edge is a dune
          const s = await page(d);
          t.text(s, d.text, { x: 0.6, y: 1.25, w: 8.8, h: 1.65, fontSize: L.fit(d.text, 8.8, 1.65, 15, 10, 'Calibri', false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
          t.img(s, await L.photo(L.src(d.image), 10, 2.75, { mask: { path: 'M0,0.2 C0.2,0 0.45,0.28 0.7,0.08 S0.92,0.1 1,0.16 L1,1 L0,1 Z' } }), 0, 2.88, 10, 2.75, { alt: '' });
          t.rect(s, 0, 5.22, 10, 0.405, C.accent, { name: 'Footer band' });
          metaFooter({ color: 'FFF7E8', y: 5.3 })(ctx, s);
        },
        async (d) => { // the picture takes the place of the low sun, over the dunes
          const s = await page(d, 'focus'), dia = 3.3;
          t.oval(s, 6.05 - 0.14, 1.35 - 0.14, dia + 0.28, dia + 0.28, 'F0A35E');
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), 6.05, 1.35, dia, dia, { alt: '' });
          await panel(s, 0.6, 1.35, 5.0, 3.6, 2);
          t.text(s, d.text, { x: 0.8, y: 1.5, w: 4.6, h: 3.3, fontSize: L.fit(d.text, 4.6, 3.3, 15, 10, 'Calibri', false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        },
        async (d) => { // the picture fills the page, a sandstone slab on it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.22, 10, 0.405, C.accent, { name: 'Footer band' });
          await panel(s, 5.1, 0.35, 4.5, 4.65, 2);
          head(s, d.title, 5.35, 0.5, 4.0, 0.95, { max: 22, color: C.accent });
          t.text(s, d.text, { x: 5.35, y: 1.5, w: 4.0, h: 3.35, fontSize: L.fit(d.text, 4.0, 3.35, 14, 10, 'Calibri', false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
          metaFooter({ color: 'FFF7E8', y: 5.3 })(ctx, s);
        },
        async (d) => { // a domed window, the words straight on the sand
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 3.1, 3.7, { mask: { path: 'M0,1 L0,0.48 C0,0.2 0.25,0 0.5,0 C0.75,0 1,0.2 1,0.48 L1,1 Z' } }), 6.3, 1.3, 3.1, 3.7, { alt: '' });
          t.text(s, d.text, { x: 0.6, y: 1.35, w: 5.3, h: 3.4, fontSize: L.fit(d.text, 5.3, 3.4, 16, 10, 'Calibri', false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // the caravan road: stops along a curve, their words under it
          const s = await page(d), n = d.items.length, cw = 8.8 / n;
          await road(s, 0.6, 1.5, 8.8, 0.8);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, y = i % 2 ? 1.75 : 1.32;
            await iconDot(s, x + cw / 2 - 0.36, y, 0.72, it.icon, i);
            head(s, it.h, x + 0.1, 2.55, cw - 0.2, 0.5, { align: 'center' });
            body(s, it.t, x + 0.1, 3.07, cw - 0.2, 1.9, { align: 'center' });
          }
        },
        async (d) => { // a long sandstone wall, rows cut in it
          const s = await page(d), n = d.items.length, hh = 3.55 / n;
          await panel(s, 0.6, 1.35, 8.8, 3.6, 0);
          for (const [i, it] of d.items.entries()) {
            const y = 1.38 + i * hh;
            await iconDot(s, 0.8, y + (hh - 0.58) / 2, 0.58, it.icon, i);
            head(s, it.h, 1.55, y + 0.04, 2.5, hh - 0.08, { max: 15 });
            body(s, it.t, 4.15, y + 0.06, 5.05, hh - 0.12, { valign: 'middle', color: C.ink, max: 13 });
            if (i < n - 1) t.line(s, 1.55, y + hh, 7.65, 0, 'C9965C', 1, { dash: 'dash' });
          }
        },
        async (d) => { // tiles standing at two heights on the open dunes
          const s = await page(d, 'focus'), n = d.items.length, gap = 0.15, w = (8.8 - gap * (n - 1)) / n, hh = 2.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 2.05 : 1.25;
            await panel(s, x, y, w, hh, i);
            await iconDot(s, x + 0.14, y + 0.14, 0.56, it.icon, i);
            head(s, it.h, x + 0.14, y + 0.74, w - 0.28, 0.5, { max: 14 });
            body(s, it.t, x + 0.14, y + 1.26, w - 0.28, hh - 1.32, { color: C.ink, max: 12.5 });
          }
        },
        async (d) => { // a camp: a tent over every item
          const s = await page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.shape(s, 'ISOSCELES_TRIANGLE', { x, y: 1.3, w, h: 1.25, fill: { color: C.pal[i % 4] }, objectName: 'Tent' });
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w / 2 - 0.2, 1.98, 0.4, 0.4);
            t.rect(s, x, 2.55, w, 2.45, C.tile, { line: { color: 'E2B979', width: 1 }, name: 'Tent body' });
            head(s, it.h, x + 0.12, 2.6, w - 0.24, 0.5, { max: 14, align: 'center' });
            body(s, it.t, x + 0.12, 3.12, w - 0.24, 1.83, { align: 'center', max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // dunes rising one behind another
          const s = await page(d), n = d.steps.length, gap = 0.08, w = (8.8 - gap * (n - 1)) / n, cols = ['E9C48A', 'D9A35F', 'C2512A', '7D5B3F'], off = n === 4 ? 0 : 1;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), y = 2.15 - i * (n === 4 ? 0.28 : 0.42), c = cols[i + off], dark = i + off >= 2, ink = dark ? 'FFF7E8' : C.ink;
            t.rect(s, x, y, w, 5.05 - y, c, { r: 0.2, name: 'Dune' });
            t.text(s, String(i + 1), { x: x + 0.15, y: y + 0.08, w: 0.6, h: 0.5, fontFace: 'Cambria', bold: true, fontSize: 24, color: ink });
            head(s, st.h, x + 0.15, y + 0.56, w - 0.3, 0.5, { max: 14, color: ink });
            body(s, st.t, x + 0.15, y + 1.08, w - 0.3, 5 - (y + 1.08), { color: ink, max: 13 });
          });
        },
        async (d) => { // a path going down the page, no walls
          const s = await page(d), n = d.steps.length, hh = 3.5 / n;
          t.line(s, 0.95, 1.5, 0, 3.2, 'C9965C', 2.5, { dash: 'dash' });
          d.steps.forEach((st, i) => {
            const y = 1.33 + i * hh;
            marker(s, 0.65, y + 0.04, 0.6, i, i + 1);
            head(s, st.h, 1.5, y, 7.9, 0.38, { color: C.accent });
            body(s, st.t, 1.5, y + 0.38, 7.9, hh - 0.42, { color: C.ink, max: 13 });
          });
        },
        async (d) => { // oases on a loop: out along the top, back along the bottom
          const s = await page(d), n = d.steps.length, w = 4.3, hh = 1.7;
          t.line(s, 4.9, 2.2, 0.2, 0, 'C9965C', 3); t.line(s, 7.3, 3.06, 0, 0.12, 'C9965C', 3);
          d.steps.forEach((st, i) => {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = wide ? 0.6 : 0.6 + (i < 2 ? i : 3 - i) * (w + 0.2), y = 1.35 + (i < 2 ? 0 : hh + 0.12), hot = i === n - 1;
            t.rect(s, x, y, ww, hh, hot ? C.accent : C.tile, { r: 0.14, line: { color: 'E2B979', width: 1 }, name: 'Oasis' });
            marker(s, x + 0.14, y + 0.12, 0.54, i, i + 1);
            head(s, st.h, x + 0.8, y + 0.12, ww - 0.95, 0.54, { max: 15, color: hot ? 'FFF7E8' : C.ink });
            body(s, st.t, x + 0.18, y + 0.72, ww - 0.36, hh - 0.78, { color: hot ? 'FFF7E8' : C.ink, max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // three suns
          const s = await page(d), n = d.stats.length, cw = 8.8 / n, dia = 2.1;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - dia) / 2;
            t.shape(s, 'SUN', { x: px, y: 1.25, w: dia, h: dia, fill: { color: 'F0A35E' }, objectName: 'Sun' });
            t.text(s, x.value, { x: px + 0.5, y: 1.25 + 0.5, w: dia - 1.0, h: dia - 1.0, fontFace: 'Cambria', bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 1.05, 0.6, 24, 10, 'Cambria', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, 3.35, cw - 0.24, 0.65, { align: 'center', color: C.ink, max: 13 });
          }
          if (d.note) body(s, d.note, 0.6, 4.02, 8.8, 0.7, { max: 11, align: 'center' });
        },
        async (d) => { // one number on dark rock, the others beside it
          const s = await page(d), [a, ...rest] = d.stats;
          t.rect(s, 0.6, 1.35, 3.9, 3.65, C.ink, { r: 0.16, name: 'Rock' });
          t.text(s, a.value, { x: 0.75, y: 1.6, w: 3.6, h: 1.4, fontFace: 'Cambria', bold: true, color: 'F0A35E', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.5, 1.3, 54, 22, 'Cambria', true) });
          body(s, a.label, 1.0, 3.1, 3.1, 1.6, { color: 'FFF7E8', align: 'center' });
          rest.forEach((x, i) => {
            const y = 1.35 + i * 1.1;
            t.text(s, x.value, { x: 4.8, y, w: 4.6, h: 0.56, fontFace: 'Cambria', bold: true, color: C.accent, valign: 'middle', fontSize: L.fit(x.value, 4.6, 0.52, 30, 16, 'Cambria', true) });
            body(s, x.label, 4.8, y + 0.56, 4.6, 0.46, { color: C.ink, max: 12 });
          });
          if (d.note) body(s, d.note, 4.8, 3.6, 4.6, 1.15, { max: 11 });
        },
      ],
      compare: [
        async (d) => { // day and night in the desert
          const s = await page(d), w = 4.4;
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = 0.6 + i * w, night = i === 1, n = side.items.length, rh = 2.55 / n, ink = night ? 'FBEFD9' : C.ink;
            t.rect(s, x, 1.3, w, 3.7, night ? C.ink : 'F3CE93', { name: night ? 'Night' : 'Day' });
            t.oval(s, x + 0.2, 1.46, 0.46, 0.46, night ? 'FBEFD9' : 'E07A3F');
            if (night) t.oval(s, x + 0.32, 1.42, 0.42, 0.42, C.ink);
            head(s, side.h, x + 0.8, 1.42, w - 1.0, 0.55, { color: ink, max: 18 });
            side.items.forEach((it, k) => body(s, it, x + 0.25, 2.2 + k * rh, w - 0.5, rh - 0.05, { color: ink, max: 14 }));
          }
        },
        async (d) => { // two wings round a marked road
          const s = await page(d), w = 3.8, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, 'Calibri', 0.2, 2.9);
          head(s, d.left.h, 0.6, 1.3, w, 0.55, { align: 'right', color: C.accent, max: 18 }); head(s, d.right.h, 5.6, 1.3, w, 0.55, { color: C.pal[3], max: 18 });
          t.line(s, cx, 1.35, 0, 3.6, 'C9965C', 2.5, { dash: 'dash' });
          let y = 1.98;
          rows.forEach((rh, k) => {
            t.oval(s, cx - 0.1, y + 0.03, 0.2, 0.2, C.pal[k % 4]);
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.6, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // words in the open sky, the note on the sand below
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 5.6, h: 2.15, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.6, 2.1, 32, 15, 'Cambria', true) });
          if (d.caption) { await panel(s, 0.6, 3.45, 8.8, 1.6, 2); body(s, d.caption, 0.85, 3.55, 8.3, 1.4, { color: C.ink, valign: 'middle', max: 14 }); }
        },
        async (d) => { // dark rock with the thought cut in it, a sun above the note
          const s = await page(d);
          t.rect(s, 0.6, 1.3, 5.7, 3.7, C.ink, { r: 0.16, name: 'Rock' });
          t.text(s, L.runs(d.text), { x: 0.9, y: 1.45, w: 5.1, h: 3.4, fontFace: 'Cambria', bold: true, color: 'FBEFD9', valign: 'middle', fontSize: L.fit(d.text, 5.1, 3.3, 32, 15, 'Cambria', true) });
          t.oval(s, 6.65, 1.35, 0.8, 0.8, 'F0A35E');
          if (d.caption) body(s, d.caption, 6.65, 2.3, 2.75, 2.45, { color: C.ink, max: 13 });
        },
      ],
      timeline: [
        async (d) => { // the road down the middle, years to either side
          const s = await page(d), cx = 5;
          t.line(s, cx, 1.35, 0, 3.65, 'C9965C', 2.5, { dash: 'dash' });
          d.items.forEach((it, i) => {
            const right = i % 2 === 1, y = 1.32 + Math.floor(i / 2) * 1.85 + (right ? 0.35 : 0), x = right ? cx + 0.4 : 0.6, w = 4.0, a = right ? 'left' : 'right';
            t.oval(s, cx - 0.17, y + 0.08, 0.34, 0.34, C.pal[i % 4], { line: { color: 'FBEFD9', width: 2 } });
            t.text(s, [{ text: it.year + '  ', options: { color: C.accent, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.46, fontFace: 'Cambria', fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.42, 16, 10, 'Cambria', true), align: a, valign: 'middle' });
            body(s, it.t, x, y + 0.47, w, 1.22, { align: a, max: 13, color: C.ink });
          });
        },
        async (d) => { // a caravan register: years on coloured stones, one row each
          const s = await page(d), n = d.items.length, hh = 3.62 / n;
          d.items.forEach((it, i) => {
            const y = 1.36 + i * hh;
            t.rect(s, 0.6, y, 1.6, hh - 0.08, C.pal[i % 4], { r: 0.1, name: 'Stone' });
            t.text(s, it.year, { x: 0.65, y, w: 1.5, h: hh - 0.08, fontFace: 'Cambria', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.4, hh - 0.2, 20, 10, 'Cambria', true) });
            head(s, it.h, 2.4, y, 2.2, hh - 0.08, { max: 15 });
            body(s, it.t, 4.7, y + 0.03, 4.7, hh - 0.14, { valign: 'middle', color: C.ink, max: 13 });
            if (i < n - 1) t.line(s, 2.4, y + hh - 0.04, 7, 0, 'C9965C', 1, { dash: 'dash' });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.oval(s, 6.65, 0.75, 2.9, 2.9, 'FBEFD9'); t.img(s, await L.photo(L.src(d.image), 2.7, 2.7, { mask: 'circle' }), 6.75, 0.85, 2.7, 2.7, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.55, w: 5.6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.8, h: 1.9, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.8, 1.8, 40, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.85, w: 5.6, h: 0.65, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.5, w: 5.6, h: 0.4, fontFace: 'Cambria', fontSize: 17, bold: true, color: C.accent });
    metaFooter({ color: 'FFF7E8', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 72, slug: 'sahro', name: 'Sahro', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sabrli va keng nafasli: yo'l, manzil, bosqich obrazlari; iliq va aniq", limits: {}, prefer: null } };
