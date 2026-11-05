/** 75 Okean — deep sea: blue depth gradient, light rays, rising bubbles, translucent aqua panels. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '07304A', ink: 'E6F6FF', muted: '9CC9E0', accent: '3FD0C9', pal: ['3FD0C9', 'FF7F6B', '5AB0FF', 'FFD166', '7FE3A9', 'B39DFF'] };
const sea = (seed) => { let x0 = seed, b = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 40; i++) { const r = 3 + rnd() * 14; b += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${r.toFixed(1)}" fill="none" stroke="#BFEFFF" stroke-opacity="${(0.15 + rnd() * 0.3).toFixed(2)}" stroke-width="2"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E5C7E"/><stop offset="1" stop-color="#03182A"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="25"/></filter></defs>
  <rect width="1600" height="900" fill="url(#g)"/><g filter="url(#b)" opacity="0.28" fill="#BFEFFF"><polygon points="300,0 420,0 700,900 520,900"/><polygon points="800,0 880,0 1100,900 980,900"/><polygon points="1250,0 1330,0 1480,900 1380,900"/></g>${b}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Okean', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'list', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'bg' + (kind === 'page' ? 1 : 2), sea(kind === 'page' ? 5 : 9), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h) => ctx.t.rect(s, x, y, w, h, '0F5E7A', { t: 35, r: 0.16, line: { color: '6FD6E8', width: 1 }, name: 'Water panel' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { t: 10, line: { color: 'FFFFFF', width: 1.5 } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.14, d * 0.26, d * 0.16, 'FFFFFF', { t: 45 }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '06263A', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { r: 0.12, line: { color: '6FD6E8', width: 2 }, name: 'Frame' }); for (const [a, b, r] of [[0.85, 0.25, 0.16], [0.9, 0.12, 0.09], [0.8, 0.07, 0.06]]) ctx.t.oval(s, x + w * a, y + h * b, r, r, null, { line: { color: 'FFFFFF', width: 1.25 } }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.36, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '06263A', authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.accent, align: o.align, valign: o.valign || 'middle' });
    const brass = 'D4A94E', abyss = '031827', dk = '06263A', foam = 'E6F6FF', pal = C.pal;
    const bubble = (s, x, y, d, c = pal[0], tr = 10) => { t.oval(s, x, y, d, d, c, { t: tr, line: { color: 'FFFFFF', width: 1.5 } }); t.oval(s, x + d * 0.18, y + d * 0.13, d * 0.26, d * 0.16, 'FFFFFF', { t: 45 }); };
    const iconBub = async (s, x, y, d, ic, k) => { bubble(s, x, y, d, pal[k % 6]); t.img(s, await L.icon(ic, dk, 2), x + d * 0.27, y + d * 0.27, d * 0.46, d * 0.46); };
    const crest = async (s, y, ht, c, key = 'a', op = 1) => t.img(s, await svgOnce(ctx, 'crest' + key + c, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="100"><path d="M0,40 ${Array.from({ length: 16 }, (_, k) => `q50,${k % 2 ? 34 : -34} 100,0`).join(' ')} L1600,100 L0,100 Z" fill="#${c}" fill-opacity="${op}"/></svg>`, 1600, 100), 0, y, 10, ht);
    const chain = (s, x, y, ht, c = 'BFEFFF') => { const n = Math.floor(ht / 0.22); for (let k = 0; k < n; k++) t.oval(s, x - 0.07, y + k * 0.22, 0.14, 0.26, null, { line: { color: c, width: 1.5 } }); };
    const anchor = async (s, x, y, d, c = 'BFEFFF') => t.img(s, await L.icon('FiAnchor', c, 2), x, y, d, d);
    const V = {
      image: [
        async (d) => { // a porthole in a brass rim: the picture is what you see outside the hull
          const s = await page(d), dia = 3.3, x = 0.8, y = 1.45, cx = x + dia / 2, cy = y + dia / 2, rr = dia / 2 + 0.11;
          t.oval(s, x - 0.22, y - 0.22, dia + 0.44, dia + 0.44, brass, { line: { color: '8E6F2A', width: 2 } });
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.39; t.oval(s, cx + rr * Math.cos(a) - 0.05, cy + rr * Math.sin(a) - 0.05, 0.1, 0.1, '6B5216'); }
          body(s, d.text, 4.85, 1.3, 4.55, 3.75, { max: 15, k: 1.22, valign: 'middle' });
        },
        async (d) => { // the page is the picture, a pane of deep water rests on it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.15, 10, 0.475, abyss, { name: 'Footer band' });
          t.rect(s, 4.85, 0.35, 4.8, 4.55, dk, { t: 8, r: 0.16, line: { color: '6FD6E8', width: 1.25 }, name: 'Deep water pane' });
          head(s, d.title, 5.1, 0.47, 4.3, 0.95, { max: 22 });
          body(s, d.text, 5.1, 1.45, 4.3, 3.3, { max: 15, k: 1.12, valign: 'middle' });
          for (const [a, b, r] of [[4.55, 4.3, 0.18], [4.3, 3.8, 0.11], [4.5, 3.4, 0.07]]) t.oval(s, a, b, r, r, null, { line: { color: 'FFFFFF', width: 1.25 } });
          K.footer(ctx, s);
        },
        async (d) => { // the surface: the picture above, its lower edge a wave, the words under the water
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 10, 2.3, { mask: { path: 'M0,0 L1,0 L1,0.82 C0.9,0.7 0.8,0.72 0.7,0.84 S0.5,1 0.4,0.84 S0.2,0.68 0.1,0.82 S0.02,0.92 0,0.86 Z' } }), 0, 1.08, 10, 2.3, { alt: '' });
          body(s, d.text, 0.6, 3.42, 8.8, 1.68, { max: 15, k: 1.1, valign: 'middle' });
        },
        async (d) => { // rising bubbles: one large and two small, the same picture in each
          const s = await page(d), src = L.src(d.image), B = [[5.85, 1.75, 3.0], [8.1, 1.22, 1.15], [5.2, 1.22, 0.85]];
          for (const [i, [x, y, dd]] of B.entries()) {
            t.img(s, await L.photo(src, dd, dd, { mask: 'circle', position: ['centre', 'north', 'east'][i] }), x, y, dd, dd, { alt: '' });
            t.oval(s, x, y, dd, dd, null, { line: { color: 'BFEFFF', width: 2 } }); t.oval(s, x + dd * 0.17, y + dd * 0.1, dd * 0.22, dd * 0.13, 'FFFFFF', { t: 45 });
          }
          await panel(s, 0.6, 1.35, 4.4, 3.7, 0);
          body(s, d.text, 0.8, 1.5, 4.0, 3.4, { max: 15, k: 1.12, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // depth zones: each item lies deeper than the one before, a sounding line runs down them
          const s = await page(d), n = d.items.length, rh = 3.85 / n, Z = n === 4 ? ['0F7690', '0E6484', '094666', '052A45'] : ['0F7690', '094666', '052A45'];
          for (const [i, it] of d.items.entries()) {
            const y = 1.22 + i * rh;
            t.rect(s, 0, y, 10, rh, Z[i], { name: 'Depth zone' });
            await iconBub(s, 0.72, y + (rh - 0.56) / 2, 0.56, it.icon, i);
            head(s, it.h, 1.5, y + 0.05, 2.5, rh - 0.1, { color: foam });
            body(s, it.t, 4.1, y + 0.05, 5.3, rh - 0.1, { valign: 'middle', max: 13.5 });
          }
          t.line(s, 1.0, 1.1, 0, 0.3, 'BFEFFF', 1.5);
        },
        async (d) => { // a sonar screen: rings spread from the middle, each item is a blip
          const s = await page(d), n = d.items.length, cx = 5, cy = 3.15, w = 3.2;
          for (const r of [0.45, 1.0, 1.55, 1.9]) t.oval(s, cx - r, cy - r, r * 2, r * 2, null, { line: { color: C.accent, width: 1, transparency: 45 } });
          t.line(s, cx, 1.25, 0, 3.8, C.accent, 0.75, { t: 60 }); t.line(s, 3.1, cy, 3.8, 0, C.accent, 0.75, { t: 60 });
          bubble(s, cx - 0.17, cy - 0.17, 0.34, C.accent, 0);
          const spots = n === 3 ? [[0.6, 1.28, w, 1.75, 'left'], [6.2, 1.28, w, 1.75, 'right'], [2.3, 3.56, 5.4, 1.5, 'center']] : [[0.6, 1.28, w, 1.75, 'left'], [6.2, 1.28, w, 1.75, 'right'], [0.6, 3.3, w, 1.75, 'left'], [6.2, 3.3, w, 1.75, 'right']];
          for (const [i, it] of d.items.entries()) {
            const [x, y, ww, hg, a] = spots[i], ix = a === 'right' ? x + ww - 0.5 : a === 'left' ? x : x + ww / 2 - 0.25;
            await iconBub(s, ix, y, 0.5, it.icon, i);
            head(s, it.h, a === 'left' ? x + 0.6 : x, y + (a === 'center' ? 0.5 : 0.04), a === 'center' ? ww : ww - 0.6, a === 'center' ? 0.3 : 0.44, { align: a, color: pal[i % 6] });
            body(s, it.t, x, y + (a === 'center' ? 0.8 : 0.54), ww, a === 'center' ? 0.72 : hg - 0.56, { align: a, max: 13 });
          }
        },
        async (d) => { // a yellow submarine: a porthole for each item, its words beneath the hull
          const s = await page(d), n = d.items.length, cw = 8.4 / n;
          t.rect(s, 6.9, 1.12, 1.1, 0.3, 'E6B84A', { r: 0.05, name: 'Tower' }); t.rect(s, 7.35, 1.05, 0.08, 0.12, 'E6B84A', { name: 'Periscope' });
          t.rect(s, 0.8, 1.38, 8.8, 1.05, pal[3], { r: 0.5, name: 'Hull' }); t.shape(s, 'ISOSCELES_TRIANGLE', { x: 0.25, y: 1.62, w: 0.9, h: 0.55, rotate: 90, fill: { color: 'E6B84A' }, objectName: 'Screw' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.8 + i * cw, cx = x + cw / 2;
            t.oval(s, cx - 0.4, 1.5, 0.8, 0.8, dk, { line: { color: brass, width: 3.5 } });
            t.img(s, await L.icon(it.icon, foam, 2), cx - 0.2, 1.7, 0.4, 0.4);
            head(s, it.h, x + 0.04, 2.55, cw - 0.08, 0.48, { align: 'center', color: pal[3] });
            body(s, it.t, x + 0.1, 3.05, cw - 0.2, 2.02, { align: 'center' });
          }
        },
        async (d) => { // four rock pools: water panels, each with a coloured bubble breaking out of the corner
          const s = await page(d), n = d.items.length, w = 4.25, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.42 + Math.floor(i / 2) * (hh + 0.14);
            await panel(s, x, y, ww, hh, i);
            await iconBub(s, x - 0.16, y - 0.16, 0.74, it.icon, i);
            head(s, it.h, x + 0.68, y + 0.06, ww - 0.85, 0.46, { color: pal[i % 6] });
            body(s, it.t, x + 0.68, y + 0.55, ww - 0.88, hh - 0.63, { max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // up from the deep: the steps rise like bubbles, each larger and higher
          const s = await page(d), n = d.steps.length, gap = 0.12, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.33 : 0.45;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.32 + (n - 1 - i) * rise, b = 5.08, dd = 0.5 + i * 0.07;
            await panel(s, x, y, w, b - y, i);
            await marker(s, x + 0.15, y + 0.12, dd, i, i + 1);
            head(s, st.h, x + 0.15, y + 0.18 + dd, w - 0.3, 0.44, { max: 14, color: pal[i % 6] });
            body(s, st.t, x + 0.15, y + 0.64 + dd, w - 0.3, b - y - 0.72 - dd, { max: 13 });
          }
        },
        async (d) => { // an anchor chain down the page, a step to either side at each link
          const s = await page(d), n = d.steps.length;
          chain(s, 5, 1.22, 3.3); await anchor(s, 4.72, 4.5, 0.56);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, y = n === 3 && i === 1 ? 2.2 : 1.28 + Math.floor(i / 2) * 1.78 + (right ? 0.3 : 0), x = right ? 5.6 : 0.6, w = 3.8, a = right ? 'left' : 'right';
            await marker(s, 4.7, y + (right && n === 4 ? 0.32 : 0), 0.6, i, i + 1);
            head(s, st.h, x, y, w, 0.42, { align: a, color: pal[i % 6] });
            body(s, st.t, x, y + 0.44, w, 1.14, { align: a, max: 13 });
          }
        },
        async (d) => { // buoys riding the swell, each step's words hanging on a line beneath
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          t.rect(s, 0, 1.1, 10, 0.55, 'BFEFFF', { t: 78, name: 'Air' });
          await crest(s, 1.48, 0.62, '0E5C7E', 'b');
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2, by = 1.12 + (i % 2 ? 0.13 : 0);
            t.line(s, cx, by + 0.6, 0, 2.3 - by - 0.45, 'BFEFFF', 1.25, { dash: 'sysDot' });
            await marker(s, cx - 0.33, by, 0.66, i, i + 1);
            head(s, st.h, x + 0.08, 2.4, cw - 0.16, 0.5, { align: 'center', max: 15, color: pal[i % 6] });
            body(s, st.t, x + 0.12, 2.92, cw - 0.24, 2.14, { align: 'center' });
          }
        },
      ],
      stats: [
        async (d) => { // one great bubble takes the lead number, two small ones float up beside it
          const s = await page(d), [a, ...rest] = d.stats, dia = 3.25;
          bubble(s, 0.6, 1.5, dia, pal[0], 12);
          t.text(s, a.value, { x: 0.9, y: 2.15, w: dia - 0.6, h: 1.0, bold: true, color: dk, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dia - 0.65, 0.95, 48, 18, 'Arial', true) });
          body(s, a.label, 1.15, 3.15, dia - 1.1, 0.95, { color: dk, align: 'center', max: 13 });
          for (const [i, x] of rest.entries()) {
            const y = 1.3 + i * 1.28, px = 4.25 + i * 0.5, dd = 1.2;
            bubble(s, px, y, dd, pal[i ? 3 : 1], 8);
            t.text(s, x.value, { x: px + 0.12, y: y + 0.32, w: dd - 0.24, h: dd - 0.64, bold: true, color: dk, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.27, 0.5, 22, 11, 'Arial', true) });
            body(s, x.label, px + dd + 0.15, y + 0.15, 9.4 - px - dd - 0.15, 0.9, { valign: 'middle', max: 14 });
          }
          if (d.note) body(s, d.note, 4.25, 3.92, 5.15, 1.15, { color: C.muted, valign: 'middle', max: 12.5 });
        },
        async (d) => { // three breakers: tiles whose tops are waves, the note in the calm below
          const s = await page(d), gap = 0.18, w = (8.8 - gap * 2) / 3, y = 1.22, hh = d.note ? 2.65 : 3.7;
          const tile = await svgOnce(ctx, 'breaker', `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500"><path d="M0,60 C100,0 200,0 300,40 S500,90 600,30 L600,500 L0,500 Z" fill="#0F6E8E" fill-opacity="0.8" stroke="#6FD6E8" stroke-width="3"/></svg>`, 600, 500);
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * (w + gap);
            t.img(s, tile, px, y, w, hh);
            t.text(s, x.value, { x: px + 0.15, y: y + 0.42, w: w - 0.3, h: 1.0, bold: true, color: pal[[3, 0, 1][i]], align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.35, 0.95, 42, 18, 'Arial', true) });
            body(s, x.label, px + 0.2, y + 1.45, w - 0.4, hh - 1.55, { align: 'center', max: 14 });
          }
          if (d.note) body(s, d.note, 0.6, 3.95, 8.8, 1.12, { color: C.muted, valign: 'middle', align: 'center', max: 13 });
        },
      ],
      compare: [
        async (d) => { // over the surface and under it: bright air above, deep water below, a wave between
          const s = await page(d), hh = 1.92, y0 = 1.22;
          t.rect(s, 0, y0, 10, hh + 0.1, 'D9F5F7', { name: 'Air' });
          t.rect(s, 0, y0 + hh, 10, hh - 0.04, abyss, { name: 'Depth' });
          await crest(s, y0 + hh - 0.1, 0.3, abyss, 'c');
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = i ? y0 + hh + 0.14 : y0 + 0.05, n = side.items.length, cw = 8.8 / n, ink = i ? foam : dk;
            head(s, side.h, 0.6, y, 8.8, 0.42, { max: 17, color: i ? pal[0] : '0A6E7E' });
            for (const [k, it] of side.items.entries()) {
              const x = 0.6 + k * cw;
              t.oval(s, x, y + 0.98, 0.16, 0.16, i ? pal[0] : '0A6E7E');
              body(s, it, x + 0.24, y + 0.46, cw - 0.36, 1.2, { color: ink, max: 16, valign: 'middle' });
            }
          }
        },
        async (d) => { // two divers on one chain: the rows answer each other across it, bubbles between
          const s = await page(d), w = 3.85;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.24, 2.95);
          chain(s, 5, 1.25, 3.85);
          head(s, d.left.h, 0.6, 1.28, w, 0.55, { align: 'right', max: 18, color: pal[1] }); head(s, d.right.h, 5.55, 1.28, w, 0.55, { max: 18, color: pal[0] });
          let y = 2.0;
          for (const [k, rh] of rows.entries()) {
            bubble(s, 4.87, y, 0.26, pal[k % 2 ? 0 : 1], 5);
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.55, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
      ],
      statement: [
        async (d) => { // the thought in one great bubble, the note beside it in clear water
          const s = await page(d, 'focus'), dia = 3.85, x = 0.65, y = 1.22;
          bubble(s, x, y, dia, pal[0], 8);
          t.text(s, L.runs(d.text), { x: x + 0.65, y: y + 0.65, w: dia - 1.3, h: dia - 1.3, fontFace: 'Arial', bold: true, color: dk, align: 'center', valign: 'middle', fontSize: L.fit(d.text, dia - 1.3, dia - 1.35, 26, 12, 'Arial', true) });
          for (const [a, b, r] of [[4.6, 1.3, 0.3], [4.95, 1.7, 0.16]]) t.oval(s, a, b, r, r, null, { line: { color: 'FFFFFF', width: 1.25 } });
          if (d.caption) body(s, d.caption, 5.1, 2.0, 4.3, 3.0, { valign: 'middle', max: 15 });
        },
        async (d) => { // a shaft of light falls on the thought, the note lies in a dark trench to the right
          const s = await page(d);
          t.img(s, await svgOnce(ctx, 'shaft', `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="420"><polygon points="240,0 460,0 700,420 0,420" fill="#BFEFFF" fill-opacity="0.2"/></svg>`, 700, 420), 0, 1.0, 6.6, 4.15);
          t.text(s, L.runs(d.text), { x: 0.75, y: 1.65, w: 5.1, h: 3.0, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 5.1, 2.95, 32, 16, 'Arial', true) });
          t.rect(s, 6.55, 1.2, 3.45, 3.92, abyss, { t: 15, name: 'Trench' });
          if (d.caption) body(s, d.caption, 6.8, 1.35, 2.75, 3.62, { color: foam, valign: 'middle', max: 14 });
        },
      ],
      timeline: [
        async (d) => { // a current running across the page: the years drift above and below it
          const s = await page(d), w = 3.1, cy = 3.2, cw = 2.2;
          t.img(s, await svgOnce(ctx, 'current', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="60"><path d="M0,30 C130,0 270,60 400,30 S670,0 800,30 S1070,60 1200,30 S1450,10 1540,30" fill="none" stroke="#3FD0C9" stroke-width="5"/><polygon points="1540,12 1600,30 1540,48" fill="#3FD0C9"/></svg>`, 1600, 60), 0, cy - 0.19, 10, 0.38);
          for (const [i, it] of d.items.entries()) {
            const up = i % 2 === 1, cx = 0.6 + (i + 0.5) * cw, x = Math.max(0.6, Math.min(9.4 - w, cx - w / 2)), y = up ? 1.28 : 3.56;
            bubble(s, cx - 0.14, cy - 0.14, 0.28, pal[i % 6], 0);
            t.text(s, [{ text: it.year + '   ', options: { color: pal[i % 6], bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.42, fontFace: 'Arial', valign: 'middle', align: 'center', fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.4, 15, 9, 'Arial', true) });
            body(s, it.t, x, y + 0.44, w, 1.08, { align: 'center', max: 13 });
          }
        },
        async (d) => { // a dive: each year lies deeper down, a dotted line follows the descent
          const s = await page(d), gap = 0.1, w = (8.8 - gap * 3) / 4, dy = 0.24, hh = 3.05;
          t.line(s, 0.6 + w / 2, 1.5, (w + gap) * 3, dy * 3, 'BFEFFF', 1.25, { dash: 'sysDash' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.26 + i * dy, F = ['14829C', '0E6484', '094666', '052A45'];
            t.rect(s, x, y + 0.24, w, hh - 0.24 - (i * 0), F[i], { r: 0.1, name: 'Depth' });
            bubble(s, x + w / 2 - 0.24, y, 0.48, pal[i], 0);
            head(s, it.year, x + 0.1, y + 0.5, w - 0.2, 0.42, { align: 'center', color: pal[i], max: 18 });
            head(s, it.h, x + 0.1, y + 0.92, w - 0.2, 0.36, { align: 'center', color: foam, max: 13 });
            const bh = Math.min(hh - 1.33, 5.1 - y - 1.33);
            body(s, it.t, x + 0.12, y + 1.3, w - 0.24, bh, { align: 'center', max: 13 });
          }
        },
        async (d) => { // the ship's log: a dry paper page on the water, ruled and written by hand
          const s = await page(d), rh = 0.88, ink = '20323E', paper = 'F2EAD3';
          t.rect(s, 0.6, 1.25, 8.8, 3.85, paper, { r: 0.05, shadow: 0.4, blur: 8, offset: 3, name: 'Log page' });
          t.line(s, 2.4, 1.3, 0, 3.75, 'C75A48', 1.25);
          for (const [i, it] of d.items.entries()) {
            const y = 1.33 + i * rh + 0.04;
            head(s, it.year, 0.75, y, 1.55, rh - 0.08, { color: 'A63A2B', max: 17, align: 'center' });
            head(s, it.h, 2.55, y, 2.1, rh - 0.08, { color: ink, max: 14 });
            body(s, it.t, 4.7, y, 4.55, rh - 0.08, { color: ink, valign: 'middle', max: 13 });
            if (i < 3) t.line(s, 0.75, y + rh - 0.04, 8.5, 0, 'B8AE93', 0.75);
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.timeline = V.timeline.shift(); // the original panels looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.15, 0.7, 3.3, 3.5);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.3, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.3, 2.2, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 5.2, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 5.2, h: 0.45, fontSize: 16, bold: true, color: C.pal[1] });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 75, slug: 'okean', name: 'Okean', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "chuqur va sokin: mavzuning qatlamlarini ochib boruvchi, ravon tushuntirish", limits: {}, prefer: null } };
