/** 73 Muz — ice: frost crystals, frosted glass panels, hexagonal ice markers, cold blues. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EAF6FC', ink: '12324A', muted: '4F7590', accent: '2E86C1', pal: ['2E86C1', '5DADE2', '1B4F72', '85C1E9', '2874A6', 'AED6F1'] };
const flake = (op = 0.5) => { let g = ''; for (let k = 0; k < 6; k++) g += `<g transform="rotate(${k * 60} 100 100)"><line x1="100" y1="100" x2="100" y2="10"/><line x1="100" y1="40" x2="80" y2="22"/><line x1="100" y1="40" x2="120" y2="22"/><line x1="100" y1="65" x2="85" y2="52"/><line x1="100" y1="65" x2="115" y2="52"/></g>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g stroke="#5DADE2" stroke-width="5" stroke-linecap="round" opacity="${op}">${g}</g></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Muz', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  init: async (ctx) => { ctx.flake = await svgOnce(ctx, 'flake', flake(0.45), 200, 200); },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'page' ? C.bg : 'DDF0FA' }; ctx.t.img(s, ctx.flake, 8.6, -0.35, 1.7, 1.7); ctx.t.img(s, ctx.flake, -0.4, 4.4, 1.3, 1.3); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { t: 20, r: 0.12, line: { color: '9ED8F0', width: 1.5 }, shadow: 0.12, blur: 8, offset: 2, shadowColor: '5DADE2', name: 'Frosted glass' }); if (!o.big) ctx.t.rect(s, x + 0.12, y + 0.08, w * 0.35, 0.05, 'FFFFFF', { name: 'Glint' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: C.pal[k % 6] }, line: { color: 'FFFFFF', width: 1.5 }, objectName: 'Ice' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d * 0.88, fontSize: Math.round(d * 24), bold: true, color: k % 2 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); }, // odd palette entries are pale: white digits vanished on them
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'FFFFFF', { r: 0.14, line: { color: '9ED8F0', width: 2 }, name: 'Frost frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); ctx.t.img(s, ctx.flake, x + w - 0.55, y - 0.3, 0.8, 0.8); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.38, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 7.2, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.7, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => (i % 2 ? C.ink : 'FFFFFF'), authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const deep = '12324A', sea = '1B4F72', pale = 'D4ECF7', rim = '9ED8F0', snow = 'F2FAFF';
    const hex = (s, x, y, w, h2, fill, ln = 'FFFFFF') => t.shape(s, 'HEXAGON', { x, y, w, h: h2, fill: { color: fill }, line: { color: ln, width: 1.5 }, objectName: 'Crystal' });
    const hexIcon = async (s, x, y, d, ic, k) => { hex(s, x, y, d, d * 0.88, C.pal[[0, 2, 4][k % 3]]); t.img(s, await L.icon(ic, 'FFFFFF', 2), x + d * 0.3, y + d * 0.24, d * 0.4, d * 0.4); };
    const night = async (d) => { // the polar night: same crystals on a dark page
      const s = await newSlide('focus');
      t.rect(s, 0, 0, 10, 5.625, deep, { name: 'Polar night' }); t.img(s, ctx.flake, 7.7, -0.7, 3.0, 3.0);
      K.marker(ctx, s, 0.5, 0.38, 0.72, ctx.idx, ctx.idx);
      if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 7.2, h: 0.7, bold: true, color: snow, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.7, 28, 16, 'Arial', true) });
      metaFooter({ color: 'AED6F1' })(ctx, s); return s;
    };
    const icicle = async (s, x, y, w, h2, c) => t.img(s, await svgOnce(ctx, 'ice' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><polygon points="0,0 200,0 118,290 100,300 82,290" fill="#${c}"/><polygon points="24,0 62,0 96,250" fill="#fff" opacity="0.35"/></svg>`, 200, 300), x, y, w, h2);
    const wave = async (s, y, c = '5DADE2') => t.img(s, await svgOnce(ctx, 'wave' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="30"><path d="M0,15 ${Array.from({ length: 20 }, (_, k) => `q40,${k % 2 ? 22 : -22} 80,0`).join(' ')}" fill="none" stroke="#${c}" stroke-width="5"/></svg>`, 1600, 30), 0, y, 10, 0.19);
    const V = {
      image: [
        async (d) => { // one big crystal: the picture cut as a hexagon, a flake on its corner
          const s = await page(d), w = 4.5, ht = 3.75, x = 0.5, y = 1.28, H6 = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
          hex(s, x - 0.08, y - 0.07, w + 0.16, ht + 0.14, 'FFFFFF', rim);
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { poly: H6 } }), x, y, w, ht, { alt: '' });
          t.img(s, ctx.flake, x + w - 0.9, y + ht - 1.0, 1.0, 1.0);
          body(s, d.text, 5.25, 1.35, 4.15, 3.65, { max: 15, k: 1.2, valign: 'middle' });
        },
        async (d) => { // icicles: the picture hangs from the top edge of the page, its lower edge drips
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 3.9, 4.75, { mask: { path: 'M0,0 L1,0 L1,0.84 L0.91,0.97 L0.82,0.8 L0.7,1 L0.58,0.8 L0.47,0.95 L0.34,0.79 L0.22,1 L0.12,0.82 L0.05,0.93 L0,0.82 Z' } }), 6.1, 0, 3.9, 4.75, { alt: '' });
          K.marker(ctx, s, 0.5, 0.38, 0.72, ctx.idx, ctx.idx);
          t.text(s, d.title, { x: 1.4, y: 0.3, w: 4.4, h: 0.85, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 4.4, 0.85, 24, 13, 'Arial', true) });
          body(s, d.text, 0.6, 1.4, 5.2, 3.65, { max: 15, k: 1.2 });
          K.footer(ctx, s);
        },
        async (d) => { // the whole page is the picture seen through a pane of frosted glass
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.2, 10, 0.425, deep, { name: 'Footer band' });
          t.rect(s, 5.0, 0.35, 4.6, 4.6, 'FFFFFF', { t: 7, r: 0.12, line: { color: rim, width: 1.5 }, shadow: 0.25, blur: 10, offset: 3, name: 'Frosted pane' });
          t.img(s, ctx.flake, 8.75, 0.42, 0.75, 0.75);
          head(s, d.title, 5.25, 0.5, 3.5, 0.95, { max: 21, color: C.accent });
          body(s, d.text, 5.25, 1.5, 4.1, 3.3, { max: 15, k: 1.12, valign: 'middle' });
          metaFooter({ color: 'D4ECF7' })(ctx, s);
        },
        async (d) => { // polar night: the picture is an ice shard, slanted, the words glow beside it
          const s = await night(d), w = 4.5;
          t.img(s, await L.photo(L.src(d.image), w, 3.85, { mask: { poly: [[0.2, 0], [1, 0], [0.8, 1], [0, 1]] } }), 5.05, 1.22, w, 3.85, { alt: '' });
          body(s, d.text, 0.6, 1.35, 4.65, 3.6, { max: 15, k: 1.2, color: snow, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // an icicle under the ledge for each item, of two lengths
          const s = await page(d), n = d.items.length, cw = 8.8 / n;
          t.rect(s, 0, 1.2, 10, 0.12, 'FFFFFF', { line: { color: rim, width: 1 }, name: 'Ledge' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, ih = i % 2 ? 1.2 : 0.95, c = C.pal[[0, 4, 2][i % 3]];
            await icicle(s, x + cw / 2 - 0.46, 1.3, 0.92, ih, c);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + cw / 2 - 0.17, 1.37, 0.34, 0.34);
            head(s, it.h, x + 0.08, 2.55, cw - 0.16, 0.5, { align: 'center', color: C.accent });
            body(s, it.t, x + 0.12, 3.07, cw - 0.24, 2.0, { align: 'center' });
          }
        },
        async (d) => { // a crystal lattice: four nodes joined by fine lines, no boxes
          const s = await page(d), n = d.items.length, w = 4.3, hh = 1.85, D = 0.98;
          t.line(s, 1.09, 1.8, 4.5, 0, rim, 1.5); t.line(s, 1.09, 1.8, 0, 1.9, rim, 1.5); if (n === 4) { t.line(s, 5.6, 1.8, 0, 1.9, rim, 1.5); t.line(s, 1.09, 3.7, 4.5, 0, rim, 1.5); }
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.35 + Math.floor(i / 2) * (hh + 0.05);
            await hexIcon(s, x, y, D, it.icon, i);
            head(s, it.h, x + 1.12, y, ww - 1.2, 0.42, { color: C.accent, max: 16 });
            body(s, it.t, x + 1.12, y + 0.44, ww - 1.2, hh - 0.56, { max: 13.5 });
          }
        },
        async (d) => { // a snowflake at the centre, an item on the end of each arm
          const s = await page(d), n = d.items.length, w = 3.45, hh = 1.72, cx = 5, cy = n === 3 ? 2.2 : 3.2;
          const spots = n === 3 ? [[0.6, 1.3, w, hh], [5.95, 1.3, w, hh], [2.3, 3.72, 5.4, 1.34]] : [[0.6, 1.3, w, hh], [5.95, 1.3, w, hh], [0.6, 3.32, w, hh], [5.95, 3.32, w, hh]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, ww, hg] = spots[i];
            t.line(s, Math.min(cx, x + ww / 2), Math.min(cy, y + hg / 2), Math.abs(cx - x - ww / 2), Math.abs(cy - y - hg / 2), rim, 1.5, { flipV: (x + ww / 2 - cx) * (y + hg / 2 - cy) < 0 });
            await panel(s, x, y, ww, hg, i);
            await hexIcon(s, x + 0.14, y + 0.13, 0.5, it.icon, i);
            head(s, it.h, x + 0.72, y + 0.1, ww - 0.85, 0.5, { max: 14 });
            body(s, it.t, x + 0.16, y + 0.63, ww - 0.32, hg - 0.7, { max: 13 });
          }
          t.oval(s, cx - 0.72, cy - 0.72, 1.44, 1.44, 'FFFFFF', { line: { color: rim, width: 1.5 } }); t.img(s, ctx.flake, cx - 0.62, cy - 0.62, 1.24, 1.24);
        },
        async (d) => { // a glacier cut through: bands from pale snow at the top to old blue ice at the bottom
          const s = await page(d), n = d.items.length, rh = 3.85 / n, cols = n === 4 ? [pale, 'AED6F1', '5DADE2', sea] : [pale, '5DADE2', sea];
          for (const [i, it] of d.items.entries()) {
            const y = 1.25 + i * rh, dark = i === n - 1, ink = dark ? snow : deep;
            t.rect(s, 0, y, 10, rh, cols[i], { name: 'Ice layer' });
            t.img(s, await L.icon(it.icon, ink, 2), 0.65, y + rh / 2 - 0.2, 0.4, 0.4);
            head(s, it.h, 1.25, y + 0.05, 2.5, rh - 0.1, { color: ink, max: 15 });
            body(s, it.t, 3.9, y + 0.05, 5.5, rh - 0.1, { color: ink, valign: 'middle', max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // a chain of crystals, each grown on the last
          const s = await page(d), n = d.steps.length, cw = 8.8 / n, W6 = 1.5, H6 = 1.32;
          t.line(s, 0.6 + cw / 2, 2.0, cw * (n - 1), 0, C.accent, 3);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw, y = 1.34;
            hex(s, x + cw / 2 - W6 / 2, y, W6, H6, C.pal[[0, 4, 2, 3][i % 4]]);
            t.text(s, String(i + 1), { x: x + cw / 2 - W6 / 2, y, w: W6, h: H6, fontFace: 'Arial', bold: true, fontSize: 32, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.08, 2.75, cw - 0.16, 0.5, { align: 'center', max: 15, color: C.accent });
            body(s, st.t, x + 0.12, 3.27, cw - 0.24, 1.8, { align: 'center' });
          }
        },
        async (d) => { // a glacier sliding downhill: glass blocks stepping down to the right
          const s = await page(d), n = d.steps.length, w = n === 4 ? 5.3 : 6.0, rh = 3.78 / n, dx = (8.8 - w) / (n - 1);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * dx, y = 1.28 + i * rh, hg = rh - 0.08;
            await panel(s, x, y, w, hg, i, { big: true });
            await marker(s, x + 0.12, y + (hg - 0.5) / 2, 0.56, i, i + 1);
            head(s, st.h, x + 0.82, y + 0.03, w - 0.95, 0.3, { max: 14, color: C.accent });
            body(s, st.t, x + 0.82, y + 0.32, w - 0.95, hg - 0.34, { max: 13 });
          }
        },
        async (d) => { // the northern lights over the night: the steps stand under a band of light
          const s = await night(d), n = d.steps.length, cw = 8.8 / n;
          t.img(s, await svgOnce(ctx, 'aurora', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="220"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DE2C9" stop-opacity="0"/><stop offset="0.6" stop-color="#5DE2C9" stop-opacity="0.55"/><stop offset="1" stop-color="#5DADE2" stop-opacity="0.9"/></linearGradient></defs><path d="M0,200 C300,120 500,210 800,150 S1300,110 1600,180 L1600,0 L0,0 Z" fill="url(#a)"/></svg>`, 1600, 220), 0, 1.0, 10, 1.1);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw;
            await marker(s, x + cw / 2 - 0.38, 1.72, 0.76, i, i + 1);
            head(s, st.h, x + 0.08, 2.48, cw - 0.16, 0.55, { align: 'center', max: 15, color: 'AED6F1' });
            body(s, st.t, x + 0.12, 3.05, cw - 0.24, 2.05, { align: 'center', color: snow });
          }
        },
        async (d) => { // a drilled ice core stood on end: one segment for each step
          const s = await page(d), n = d.steps.length, rh = 3.8 / n;
          t.rect(s, 0.7, 1.25, 0.9, 3.85, 'FFFFFF', { r: 0.12, line: { color: rim, width: 2 }, name: 'Ice core' });
          for (const [i, st] of d.steps.entries()) {
            const y = 1.25 + i * rh;
            t.rect(s, 0.76, y + 0.05, 0.78, rh - 0.1, C.pal[[3, 1, 0, 2][i % 4]], { r: 0.06, name: 'Core segment' });
            t.text(s, String(i + 1), { x: 0.76, y: y + 0.05, w: 0.78, h: rh - 0.1, bold: true, fontSize: 22, color: i % 4 === 0 ? deep : 'FFFFFF', align: 'center', valign: 'middle' });
            t.line(s, 1.6, y + rh / 2, 0.3, 0, rim, 1.5);
            head(s, st.h, 2.0, y + 0.04, 2.4, rh - 0.08, { max: 15 });
            body(s, st.t, 4.5, y + 0.04, 4.9, rh - 0.08, { valign: 'middle', max: 13.5 });
          }
        },
      ],
      stats: [
        async (d) => { // the iceberg: one number shows above the water, the rest lie under it
          const s = await page(d), [a, ...rest] = d.stats, wl = 2.82;
          t.img(s, await svgOnce(ctx, 'berg', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="640"><polygon points="500,250 640,100 760,20 880,70 1010,130 1140,250" fill="#FFFFFF" stroke="#9ED8F0" stroke-width="4"/><rect y="250" width="1600" height="390" fill="#${sea}"/><polygon points="300,250 1320,250 1500,410 1320,640 280,640 90,420" fill="#${deep}"/></svg>`, 1600, 640), 0, 1.25, 10, 3.9);
          t.text(s, a.value, { x: 3.45, y: 1.85, w: 3.1, h: 0.88, bold: true, color: C.accent, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 2.7, 0.85, 40, 18, 'Arial', true) });
          body(s, a.label, 0.6, 1.72, 2.65, 1.0, { valign: 'middle', align: 'right' });
          for (const [i, x] of rest.entries()) {
            const px = 1.4 + i * 3.7;
            t.text(s, x.value, { x: px, y: 2.95, w: 3.5, h: 0.62, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(x.value, 3.4, 0.58, 30, 16, 'Arial', true) });
            body(s, x.label, px, 3.56, 3.5, 0.5, { color: 'D4ECF7', align: 'center', max: 13 });
          }
          if (d.note) body(s, d.note, 1.4, 4.1, 7.2, 0.95, { color: 'AED6F1', align: 'center', valign: 'middle', max: 12 });
        },
        async (d) => { // blocks of ice on a slope, each a number and its words
          const s = await page(d), hh = d.note ? 0.9 : 1.18;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * 0.75, y = 1.28 + i * (hh + 0.1);
            await panel(s, px, y, 7.3, hh, i, { big: true });
            t.text(s, x.value, { x: px + 0.2, y, w: 2.5, h: hh, bold: true, color: C.pal[[0, 4, 2][i]], align: 'center', valign: 'middle', fontSize: L.fit(x.value, 2.4, hh - 0.2, 34, 16, 'Arial', true) });
            t.line(s, px + 2.85, y + 0.15, 0, hh - 0.3, rim, 1.5);
            body(s, x.label, px + 3.05, y + 0.08, 4.05, hh - 0.16, { valign: 'middle', max: 15 });
          }
          if (d.note) { t.img(s, ctx.flake, 0.55, 4.28, 0.65, 0.65); body(s, d.note, 1.3, 4.25, 8.1, 0.82, { color: C.muted, valign: 'middle', max: 12 }); }
        },
      ],
      compare: [
        async (d) => { // ice and open water: the two halves meet along a crack
          const s = await page(d), w = 3.5;
          t.rect(s, 0, 1.22, 5, 3.88, 'FFFFFF', { t: 15, name: 'Ice' });
          t.img(s, await svgOnce(ctx, 'floe', `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="400"><polygon points="60,0 560,0 560,400 30,400 70,330 20,260 66,190 26,120 72,60" fill="#${sea}"/></svg>`, 560, 400), 4.7, 1.22, 5.3, 3.88);
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.22, 2.9);
          head(s, d.left.h, 0.6, 1.3, 4.0, 0.55, { max: 18, color: C.accent }); head(s, d.right.h, 5.55, 1.3, 3.85, 0.55, { max: 18, color: 'AED6F1' });
          let y = 1.98;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) { hex(s, 0.6, y + 0.02, 0.24, 0.21, C.accent); t.text(s, d.left.items[k], { x: 0.98, y, w, h: rh, fontSize: fs, color: C.ink }); }
            if (d.right.items[k]) { t.oval(s, 5.55, y + 0.03, 0.2, 0.2, '85C1E9'); t.text(s, d.right.items[k], { x: 5.9, y, w, h: rh, fontSize: fs, color: snow }); }
            y += rh;
          }
        },
        async (d) => { // above the water and below it, a waterline between them
          const s = await page(d), hh = 1.94;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.22 + i * hh, ink = i ? snow : deep, n = side.items.length;
            t.rect(s, 0, y, 10, hh, i ? sea : 'FFFFFF', { t: i ? 0 : 15, name: i ? 'Water' : 'Air' });
            head(s, side.h, 0.6, y + 0.08, 8.8, 0.42, { max: 17, color: i ? 'AED6F1' : C.accent });
            for (const [k, it] of side.items.entries()) {
              const x = 0.6 + (k % 2) * 4.5, ww = n === 3 && k === 2 ? 8.8 : 4.3, yy = y + 0.53 + Math.floor(k / 2) * 0.68;
              hex(s, x, yy + 0.03, 0.2, 0.18, i ? '85C1E9' : C.accent);
              body(s, it, x + 0.3, yy, ww - 0.3, 0.64, { color: ink, max: 15 });
            }
          }
          await wave(s, 3.07, '85C1E9');
        },
      ],
      statement: [
        async (d) => { // polar night: a large flake and the thought in clear white
          const s = await night({ title: d.title });
          t.img(s, ctx.flake, 6.75, 1.5, 3.5, 3.5);
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 6.2, h: 2.35, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 6.2, 2.3, 32, 15, 'Arial', true) });
          t.rect(s, 0.6, 3.73, 1.2, 0.05, '5DADE2', { name: 'Glint' });
          if (d.caption) body(s, d.caption, 0.6, 3.87, 6.2, 1.25, { color: 'D4ECF7', max: 13 });
        },
        async (d) => { // the thought inside one great crystal, the note outside it
          const s = await page(d, 'focus');
          hex(s, 0.5, 1.2, 5.6, 3.95, C.pal[2], rim);
          t.text(s, L.runs(d.text), { x: 1.5, y: 1.75, w: 3.6, h: 2.85, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 3.6, 2.8, 26, 13, 'Arial', true) });
          if (d.caption) body(s, d.caption, 6.4, 1.45, 3.0, 3.4, { valign: 'middle', max: 14 });
        },
      ],
      timeline: [
        async (d) => { // a crack in the ice runs down the page, years to either side
          const s = await page(d), w = 3.95;
          t.img(s, await svgOnce(ctx, 'crack', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="500"><polyline points="30,0 18,60 42,120 20,190 40,260 16,330 44,400 28,500" fill="none" stroke="#2E86C1" stroke-width="5"/></svg>`, 60, 500), 4.8, 1.25, 0.4, 3.85);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.3 + Math.floor(i / 2) * 1.88 + (right ? 0.28 : 0), x = right ? 5.45 : 0.6, a = right ? 'left' : 'right';
            hex(s, 4.72, y + (right ? 0.25 : 0.04), 0.56, 0.49, C.pal[[0, 4, 2, 3][i]]);
            head(s, it.year, x, y, w, 0.36, { align: a, color: C.accent, max: 18 });
            head(s, it.h, x, y + 0.36, w, 0.3, { align: a, max: 13 });
            body(s, it.t, x, y + 0.68, w, 1.02, { align: a, max: 13 });
          }
        },
        async (d) => { // a slope of ice crystals, sliding down year after year
          const s = await page(d), cw = 8.8 / 4, W6 = 1.34, H6 = 0.92, dy = 0.2;
          t.line(s, 0.6 + cw / 2, 1.76, cw * 3, dy * 3, C.pal[3], 3);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, y = 1.3 + i * dy;
            hex(s, x + cw / 2 - W6 / 2, y, W6, H6, C.pal[[0, 4, 2, 0][i]]);
            t.text(s, it.year, { x: x + cw / 2 - W6 / 2 + 0.2, y, w: W6 - 0.4, h: H6, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, W6 - 0.42, 0.6, 18, 9, 'Arial', true) });
            head(s, it.h, x + 0.06, y + H6 + 0.05, cw - 0.12, 0.45, { align: 'center', max: 14, color: C.accent });
            body(s, it.t, x + 0.1, y + H6 + 0.52, cw - 0.2, 5.08 - y - H6 - 0.52, { align: 'center' });
          }
        },
        async (d) => { // four frosted window panes, the year etched as a crystal in each corner
          const s = await page(d), w = 4.3, hh = 1.8;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (hh + 0.15);
            await panel(s, x, y, w, hh, i, { big: true });
            hex(s, x + 0.12, y + 0.12, 1.32, 0.86, C.pal[[0, 4, 2, 0][i]]);
            t.text(s, it.year, { x: x + 0.3, y: y + 0.12, w: 0.96, h: 0.86, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, 0.94, 0.6, 17, 9, 'Arial', true) });
            head(s, it.h, x + 1.55, y + 0.14, w - 1.7, 0.42, { max: 15, color: C.accent });
            body(s, it.t, x + 1.55, y + 0.58, w - 1.7, hh - 0.7, { max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // the original panels of both looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, ctx.flake, 5.2, 0.1, 5.2, 5.2);
    if (d.image) { t.shape(s, 'HEXAGON', { x: 6.2, y: 1.0, w: 3.3, h: 2.9, fill: { color: 'FFFFFF' }, line: { color: '9ED8F0', width: 2 }, objectName: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 3.0, 2.64, { mask: { poly: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]] } }), 6.35, 1.13, 3.0, 2.64, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2744  '), { x: 0.6, y: 0.65, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.3, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.3, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 5.2, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.2, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 73, slug: 'muz', name: 'Muz', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sovuqqon va aniq: faktlar, raqamlar va tiniq xulosalar, ortiqcha his-tuyg'usiz", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["p14:shred|pattern=\"rectangle\" dir=\"in\"", "dissolve", "fade"], "cover": ["focusIn", "fadeLetters"], "mark": "diamond", "deco": "focusIn", "sig": {"title": "focusIn", "body": "fade", "item": "diamond", "image": "focusIn", "number": "diamond", "order": "centerOut", "stagger": 0.16}, "tempo": 1.15, "kenburns": false};
