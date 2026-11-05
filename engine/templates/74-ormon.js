/** 74 O'rmon — forest: layered pine silhouettes, tree-ring slices as markers, a treeline footer. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EEF3E6', ink: '1E3D2F', muted: '4F6B5A', accent: '2F7A4A', paper: 'FAF8F1', pal: ['2F7A4A', '7A5230', '4C7F56', 'A0763F', '1E3D2F', '6B9A5B'] };
const pines = (w, h, base, n, color, seed, minH, maxH) => { let x0 = seed, p = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let k = 0; k < n; k++) { const cx = (k / n) * w + rnd() * 40, th = minH + rnd() * (maxH - minH), tw = th * 0.42; p += `<polygon points="${cx},${base - th} ${cx + tw / 2},${base} ${cx - tw / 2},${base}"/>`; }
  return `<g fill="#${color}">${p}<rect x="0" y="${base - 2}" width="${w}" height="${h - base + 2}"/></g>`; };
const band = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="160">${pines(1600, 160, 80, 46, '6B9A5B', 3, 40, 75)}${pines(1600, 160, 110, 40, '3E6B4C', 7, 45, 90)}${pines(1600, 160, 140, 34, '1E3D2F', 11, 50, 105)}</svg>`;
const forest = (h, top) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}">${pines(1600, h, top + 60, 40, '6B9A5B', 3, 80, 160)}${pines(1600, h, top + 120, 34, '3E6B4C', 7, 90, 190)}${pines(1600, h, top + 180, 28, '1E3D2F', 11, 100, 220)}</svg>`;
const ringSvg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#B98A57" stroke="#7A5230" stroke-width="6"/>${[78, 62, 48, 34, 22].map((r, i) => `<circle cx="${100 + i}" cy="${100 - i}" r="${r}" fill="none" stroke="#8E6439" stroke-width="2.5" opacity="0.6"/>`).join('')}<circle cx="100" cy="100" r="58" fill="#${c}" opacity="0.92"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme("O'rmon", C, C.pal), layout: { agenda: 'list', cards: 'rows', process: 'row', stats: 'tiles', timeline: 'line' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.2 },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'hero' ? 'E3EDD8' : C.bg }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'hero', forest(900, 690), 1600, 900), 0, 0, 10, 5.625); else ctx.t.img(s, await svgOnce(ctx, 'line', band(), 1600, 160), 0, 4.625, 10, 1.0); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, C.paper, { r: 0.08, line: { color: 'C9D8BC', width: 1 }, shadow: 0.15, blur: 6, offset: 2, name: 'Card' }); if (!o.big) ctx.t.rect(s, x, y, 0.08, h, C.pal[k % 6], { name: 'Bark' }); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'r' + (k % 6), ringSvg(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, C.ink, { r: 0.1, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '7A5230', 3),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, '7A5230', 3),
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9D8BC', 0.75),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: 'E3EDD8', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Cambria', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const moss = 'E3EDD8', wood = '7A5230', soil = '4A3322', night = '16302A', foot = () => metaFooter({ color: moss, y: 5.3 });
    const treeline = async (s) => t.img(s, await svgOnce(ctx, 'line', band(), 1600, 160), 0, 4.625, 10, 1.0);
    const dark = async (d, c = night) => { // a page under the canopy at night, or down in the soil
      const s = await newSlide('focus');
      t.rect(s, 0, 0, 10, 5.625, c, { name: 'Dark' }); await treeline(s);
      await K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx);
      if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, fontFace: 'Cambria', bold: true, color: moss, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Cambria', true) });
      foot()(ctx, s); return s;
    };
    const fir = async (s, x, y, w, h2, c = C.accent) => t.img(s, await svgOnce(ctx, 'fir' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect x="135" y="340" width="30" height="60" fill="#${wood}"/><polygon points="150,0 240,130 60,130" fill="#${c}"/><polygon points="150,70 270,230 30,230" fill="#${c}"/><polygon points="150,160 300,345 0,345" fill="#${c}"/></svg>`, 300, 400), x, y, w, h2);
    const crown = async (s, x, y, w, h2, c) => t.img(s, await svgOnce(ctx, 'crown' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect x="134" y="200" width="32" height="100" fill="#${wood}"/><circle cx="150" cy="120" r="115" fill="#${c}"/><circle cx="85" cy="150" r="70" fill="#${c}"/><circle cx="215" cy="150" r="70" fill="#${c}"/></svg>`, 300, 300), x, y, w, h2);
    const slice = async (s, x, y, d, k = 0) => t.img(s, await svgOnce(ctx, 'r' + (k % 6), ringSvg(C.pal[k % 6]), 200, 200), x, y, d, d);
    const plank = async (s, x, y, w, h2, dir) => { // a trail sign: a plank with a point
      t.img(s, await svgOnce(ctx, 'plank' + dir, `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="300" viewBox="0 0 840 300">${dir > 0 ? '' : '<g transform="translate(840,0) scale(-1,1)">'}<path d="M0,0 L740,0 L840,150 L740,300 L0,300 Z" fill="#${wood}"/><g stroke="#5E3E22" stroke-width="3" fill="none"><path d="M0,70 C200,55 450,85 740,66"/><path d="M0,150 C260,165 520,135 800,150"/><path d="M0,232 C220,220 480,248 740,232"/></g>${dir > 0 ? '' : '</g>'}</svg>`, 840, 300), x, y, w, h2);
    };
    const V = {
      image: [
        async (d) => { // the picture is the heart of a sawn trunk, age rings round it
          const s = await page(d), dia = 2.95, x = 6.0, y = 1.33;
          t.oval(s, x - 0.32, y - 0.32, dia + 0.64, dia + 0.64, '8E6439', { line: { color: wood, width: 3 } });
          t.oval(s, x - 0.22, y - 0.22, dia + 0.44, dia + 0.44, 'B98A57'); t.oval(s, x - 0.11, y - 0.11, dia + 0.22, dia + 0.22, null, { line: { color: '8E6439', width: 2 } });
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          body(s, d.text, 0.6, 1.28, 4.85, 3.3, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // the page is the picture, a treeline stands before it and a paper note hangs on it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.1, 10, 0.525, C.ink, { name: 'Forest floor' }); await treeline(s);
          await panel(s, 0.45, 0.35, 5.2, 4.45, 0);
          head(s, d.title, 0.75, 0.47, 4.7, 0.9, { max: 22, color: C.accent });
          body(s, d.text, 0.75, 1.4, 4.7, 3.3, { max: 15, k: 1.12, valign: 'middle' });
          foot()(ctx, s);
        },
        async (d) => { // the picture grows in the shape of a fir, three tiers on a trunk
          const s = await page(d), w = 3.5, ht = 3.75;
          t.rect(s, 2.1, 4.3, 0.42, 0.55, wood, { name: 'Trunk' });
          const F = [[0.5, 0], [0.74, 0.3], [0.63, 0.3], [0.89, 0.62], [0.74, 0.62], [1, 1], [0, 1], [0.26, 0.62], [0.11, 0.62], [0.37, 0.3], [0.26, 0.3]];
          t.img(s, await svgOnce(ctx, 'firedge', `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="750"><polygon points="${F.map(([a, b]) => `${a * 700},${b * 750}`).join(' ')}" fill="#${C.ink}"/></svg>`, 700, 750), 0.43, 0.93, w + 0.24, ht + 0.2);
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { poly: F } }), 0.55, 1.05, w, ht, { alt: '' });
          body(s, d.text, 4.45, 1.3, 4.95, 3.3, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // a night page, the picture is a single great leaf
          const s = await dark(d), w = 4.0, ht = 3.4;
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { path: 'M0,1 C0,0.3 0.35,0 1,0 C1,0.7 0.65,1 0,1 Z' } }), 5.4, 1.2, w, ht, { alt: '' });
          t.line(s, 5.4, 1.25, 4.0, 3.35, '6B9A5B', 1.5, { flipV: true, name: 'Leaf rib' });
          body(s, d.text, 0.6, 1.28, 4.6, 3.3, { max: 15, k: 1.18, color: moss, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // a broad-leaved tree for each item, its words in the shade below
          const s = await page(d), n = d.items.length, cw = 8.8 / n, sz = 1.28, G = ['2F7A4A', '4C7F56', '6B9A5B', '2F7A4A'];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw;
            await crown(s, x + cw / 2 - sz / 2, 1.14, sz, sz, G[i]);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + cw / 2 - 0.2, 1.38, 0.4, 0.4);
            head(s, it.h, x + 0.08, 2.44, cw - 0.16, 0.46, { align: 'center', color: C.accent });
            body(s, it.t, x + 0.12, 2.91, cw - 0.24, 1.72, { align: 'center' });
          }
        },
        async (d) => { // a signpost on the trail: planks point both ways from one post
          const s = await page(d), n = d.items.length, hh = 1.6;
          t.rect(s, 4.9, 1.15, 0.2, 3.6, '5E3E22', { name: 'Post' });
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, right = i % 2 === 1, ww = wide ? 8.8 : 4.25, x = wide ? 0.6 : right ? 5.15 : 0.6, y = 1.25 + Math.floor(i / 2) * (hh + 0.12), dir = right || wide ? 1 : -1, ix = dir > 0 ? x + 0.22 : x + 0.55;
            await plank(s, x, y, ww, hh, dir);
            t.img(s, await L.icon(it.icon, 'FAF0DC', 2), ix, y + 0.14, 0.34, 0.34);
            head(s, it.h, ix + 0.45, y + 0.09, ww - 1.25, 0.44, { color: 'FAF0DC' });
            body(s, it.t, ix, y + 0.54, ww - 0.85, hh - 0.62, { color: 'FAF0DC', max: 13 });
          }
        },
        async (d) => { // stumps at two heights: a sawn ring on top of a paper card
          const s = await page(d), n = d.items.length, gap = 0.16, w = (8.8 - gap * (n - 1)) / n, hh = 2.75;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 1.9 : 1.55;
            await panel(s, x, y, w, hh, i, { big: true });
            await slice(s, x + w / 2 - 0.41, y - 0.38, 0.82, i);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w / 2 - 0.17, y - 0.14, 0.34, 0.34);
            head(s, it.h, x + 0.14, y + 0.5, w - 0.28, 0.46, { align: 'center', max: 14 });
            body(s, it.t, x + 0.16, y + 0.97, w - 0.32, hh - 1.05, { align: 'center', max: 13 });
          }
        },
        async (d) => { // the forest at night: fireflies over dark columns of words
          const s = await dark(d), n = d.items.length, cw = 8.8 / n;
          for (const [a, b, r] of [[0.8, 1.2, 0.07], [3.4, 1.15, 0.05], [5.3, 1.32, 0.08], [7.2, 1.18, 0.06], [9.4, 1.4, 0.05], [2.1, 1.42, 0.04], [8.2, 1.5, 0.04]]) { t.oval(s, a - r, b - r, r * 3, r * 3, 'F4E27A', { t: 70 }); t.oval(s, a, b, r, r, 'F4E27A'); }
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw;
            t.rect(s, x + 0.05, 1.68, 0.05, 2.9, '6B9A5B', { name: 'Stem' });
            t.img(s, await L.icon(it.icon, 'F4E27A', 2), x + 0.24, 1.7, 0.42, 0.42);
            head(s, it.h, x + 0.24, 2.17, cw - 0.38, 0.52, { color: 'F4E27A', max: 15 });
            body(s, it.t, x + 0.24, 2.72, cw - 0.38, 1.88, { color: moss });
          }
        },
      ],
      process: [
        async (d) => { // up the hillside: each step higher, its fir taller than the last
          const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.28 : 0.36;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.32 + (n - 1 - i) * rise, b = 4.68, fh = 0.32 + i * 0.09;
            await panel(s, x, y, w, b - y, i, { big: true });
            await fir(s, x + w - 0.5, y - fh + 0.28, 0.38, fh);
            await marker(s, x + 0.12, y + 0.1, 0.5, i, i + 1);
            head(s, st.h, x + 0.14, y + 0.62, w - 0.28, 0.45, { max: 14, color: C.accent });
            body(s, st.t, x + 0.14, y + 1.08, w - 0.28, b - y - 1.14, { max: 13 });
          }
        },
        async (d) => { // the trunk of one tree: every step sits on a branch
          const s = await page(d), n = d.steps.length;
          t.rect(s, 4.86, 1.15, 0.28, 3.55, wood, { name: 'Trunk' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, y = n === 3 && i === 1 ? 2.1 : 1.22 + Math.floor(i / 2) * 1.74 + (right ? 0.26 : 0), x = right ? 6.1 : 0.6, w = 3.3, a = right ? 'left' : 'right';
            t.line(s, right ? 5.14 : 4.3, y + 0.3, 0.56, 0, wood, 3, { name: 'Branch' });
            await marker(s, right ? 5.42 : 4.0, y + 0.02, 0.56, i, i + 1);
            head(s, st.h, x, y, w, 0.4, { align: a, color: C.accent });
            body(s, st.t, x, y + 0.42, w, 1.18, { align: a, max: 13 });
          }
        },
        async (d) => { // under the ground: one root goes down and parts, a step at the end of each strand
          const s = await dark(d, soil), n = d.steps.length, cw = 8.8 / n;
          let p = ''; for (let i = 0; i < n; i++) { const ex = 60 + (i + 0.5) * cw * 100; p += `<path d="M500,0 C500,50 ${ex},20 ${ex},100"/>`; }
          t.img(s, await svgOnce(ctx, 'roots' + n, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="100"><g fill="none" stroke="#B98A57" stroke-width="5">${p}</g></svg>`, 1000, 100), 0, 1.1, 10, 0.72);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw;
            await marker(s, x + cw / 2 - 0.34, 1.78, 0.68, i, i + 1);
            head(s, st.h, x + 0.08, 2.48, cw - 0.16, 0.48, { align: 'center', max: 15, color: 'E7C79A' });
            body(s, st.t, x + 0.12, 2.97, cw - 0.24, 1.64, { align: 'center', color: 'F6EBDD' });
          }
        },
      ],
      stats: [
        async (d) => { // three sawn slices of trunk
          const s = await page(d), cw = 8.8 / 3, dia = 1.78;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - dia) / 2;
            await slice(s, px, 1.2, dia, i);
            t.text(s, x.value, { x: px + dia * 0.24, y: 1.2 + dia * 0.3, w: dia * 0.52, h: dia * 0.4, fontFace: 'Cambria', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia * 0.52, 0.55, 26, 9, 'Cambria', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, 3.02, cw - 0.24, 0.62, { align: 'center', max: 13 });
          }
          if (d.note) body(s, d.note, 0.6, 3.66, 8.8, 0.92, { color: C.muted, align: 'center', valign: 'middle', max: 13 });
        },
        async (d) => { // the old tree: one wide slice carries the chief number, two boards hang beside it
          const s = await page(d), [a, ...rest] = d.stats, dia = 3.2;
          await slice(s, 0.6, 1.2, dia, 0);
          t.text(s, a.value, { x: 1.35, y: 2.1, w: 1.7, h: 0.75, fontFace: 'Cambria', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 1.62, 0.7, 40, 14, 'Cambria', true) });
          body(s, a.label, 3.95, 1.25, 5.45, 0.5, { valign: 'middle', max: 15, color: C.accent });
          for (const [i, x] of rest.entries()) {
            const y = 1.8 + i * 0.85;
            await plank(s, 3.95, y, 5.45, 0.76, 1);
            t.text(s, x.value, { x: 4.1, y, w: 1.65, h: 0.76, fontFace: 'Cambria', bold: true, color: 'FAF0DC', valign: 'middle', align: 'center', fontSize: L.fit(x.value, 1.6, 0.6, 24, 12, 'Cambria', true) });
            body(s, x.label, 5.8, y + 0.05, 3.1, 0.66, { color: 'FAF0DC', valign: 'middle', max: 12 });
          }
          if (d.note) body(s, d.note, 3.95, 3.53, 5.45, 1.08, { color: C.muted, valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // sun and shade on either side of one trunk
          const s = await page(d), w = 3.75;
          t.rect(s, 0.45, 1.2, 4.42, 3.45, 'F6F0C8', { r: 0.08, name: 'Sunlit side' }); t.rect(s, 5.13, 1.2, 4.42, 3.45, C.ink, { r: 0.08, name: 'Shaded side' });
          t.rect(s, 4.87, 1.1, 0.26, 3.6, wood, { name: 'Trunk' });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.2, 2.55);
          head(s, d.left.h, 0.6, 1.28, w + 0.05, 0.5, { align: 'right', max: 18, color: C.pal[1] }); head(s, d.right.h, 5.3, 1.28, w + 0.05, 0.5, { max: 18, color: 'B8D8A0' });
          let y = 1.86;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.65, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.3, y, w, h: rh, fontSize: fs, color: moss });
            y += rh;
          }
        },
        async (d) => { // above the ground and below it: firs on the grass, roots in the soil
          const s = await page(d), gy = 2.92;
          t.rect(s, 0, gy, 10, 1.78, soil, { name: 'Soil' }); t.rect(s, 0, gy - 0.06, 10, 0.1, C.accent, { name: 'Grass' });
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = i ? gy + 0.08 : 1.2, n = side.items.length, cw = 8.8 / n, ink = i ? 'F6EBDD' : C.ink;
            head(s, side.h, 0.6, y, 7.5, 0.42, { max: 17, color: i ? 'E7C79A' : C.accent });
            for (const [k, it] of side.items.entries()) {
              const x = 0.6 + k * cw;
              if (i) t.line(s, x + 0.04, gy + 0.5, 0, 1.0, 'B98A57', 2); else await fir(s, x, 1.68, 0.3, 0.42);
              body(s, it, x + (i ? 0.14 : 0.36), y + 0.46, cw - (i ? 0.26 : 0.46), i ? 1.2 : 1.1, { color: ink, max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // night, a full moon over the trees, the thought in its light
          const s = await dark(d);
          t.oval(s, 7.55, 1.2, 1.7, 1.7, 'F4EBC4'); t.oval(s, 7.35, 1.0, 2.1, 2.1, 'F4EBC4', { t: 88 });
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 6.7, h: 2.1, fontFace: 'Cambria', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 6.7, 2.05, 32, 15, 'Cambria', true) });
          if (d.caption) body(s, d.caption, 0.6, 3.38, 8.8, 1.22, { color: moss, valign: 'middle', max: 14 });
        },
        async (d) => { // a felled log: the thought along its side, the rings at its end
          const s = await page(d);
          t.rect(s, 1.3, 1.25, 8.1, 2.05, wood, { r: 0.1, name: 'Log' });
          for (const y of [1.45, 2.95]) t.line(s, 2.5, y, 6.7, 0, '5E3E22', 1.5);
          await slice(s, 0.5, 1.2, 2.15, 1);
          t.text(s, L.runs(d.text), { x: 2.85, y: 1.5, w: 6.3, h: 1.45, fontFace: 'Cambria', bold: true, color: 'FAF0DC', valign: 'middle', fontSize: L.fit(d.text, 6.3, 1.42, 26, 13, 'Cambria', true) });
          if (d.caption) body(s, d.caption, 2.85, 3.42, 6.55, 1.2, { valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // age rings: each year is one ring of the trunk, drawn out to its row
          const s = await page(d), cx = 2.25, cy = 2.92, rh = 0.86, R4 = [1.65, 1.26, 0.87, 0.48], F = ['7A5230', 'A0763F', 'B98A57', 'D8B98A'];
          for (const [i] of d.items.entries()) t.oval(s, cx - R4[i], cy - R4[i], R4[i] * 2, R4[i] * 2, F[i], { line: { color: '5E3E22', width: 1.25 } });
          for (const [i, it] of d.items.entries()) {
            const y = 1.24 + i * rh, ry = y + 0.32, a = (i - 1.5) * 0.46, px = cx + R4[i] * Math.cos(a) - 0.05, py = cy + R4[i] * Math.sin(a);
            t.oval(s, px - 0.06, py - 0.06, 0.12, 0.12, 'FAF8F1', { line: { color: C.ink, width: 1 } });
            t.line(s, px, Math.min(py, ry), 4.15 - px, Math.abs(py - ry), C.ink, 0.75, { flipV: py > ry });
            head(s, it.year, 4.2, y, 1.3, 0.62, { color: C.accent, max: 17 });
            head(s, it.h, 5.55, y - 0.02, 3.85, 0.27, { max: 13 });
            body(s, it.t, 5.55, y + 0.25, 3.85, rh - 0.28, { max: 13 });
          }
        },
        async (d) => { // a winding trail: a plank with the year stands by the path at each stop
          const s = await page(d), cw = 2.2;
          t.img(s, await svgOnce(ctx, 'trail', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="80"><path d="M0,28 C120,76 200,76 280,44 S440,4 540,40 S760,80 1000,24" fill="none" stroke="#${wood}" stroke-width="5" stroke-dasharray="16 11"/></svg>`, 1000, 80), 0, 1.3, 10, 0.75);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, y = i % 2 ? 1.2 : 1.42;
            await plank(s, x, y, cw - 0.2, 0.6, 1);
            t.text(s, it.year, { x: x + 0.08, y, w: cw - 0.55, h: 0.6, fontFace: 'Cambria', bold: true, color: 'FAF0DC', align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.6, 0.5, 18, 10, 'Cambria', true) });
            head(s, it.h, x, 2.1, cw - 0.16, 0.46, { max: 14, color: C.accent });
            body(s, it.t, x, 2.57, cw - 0.2, 2.05, { max: 14 });
          }
        },
        async (d) => { // a fence of split boards: the year is cut at the top of each
          const s = await page(d), gap = 0.12, w = (8.8 - gap * 3) / 4, top = 1.28, hh = 3.42;
          t.rect(s, 0.3, 3.9, 9.4, 0.14, '5E3E22', { name: 'Rail' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.img(s, await svgOnce(ctx, 'board', `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="340"><path d="M0,28 L105,0 L210,28 L210,340 L0,340 Z" fill="#${wood}"/><g stroke="#5E3E22" stroke-width="2" fill="none"><path d="M40,30 C30,140 52,240 38,340"/><path d="M172,30 C182,130 160,240 176,340"/></g></svg>`, 210, 340), x, top, w, hh);
            head(s, it.year, x + 0.1, top + 0.24, w - 0.2, 0.44, { align: 'center', color: 'F4E2B6', max: 19 });
            head(s, it.h, x + 0.1, top + 0.68, w - 0.2, 0.46, { align: 'center', color: 'FAF0DC', max: 14 });
            body(s, it.t, x + 0.13, top + 1.16, w - 0.26, hh - 1.24, { color: 'FAF0DC', align: 'center' });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.timeline = V.timeline.shift(); // the original line of years looked like the process row
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.rect(s, 6.3, 0.55, 3.2, 2.6, C.ink, { r: 0.1, name: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 3.04, 2.44, { mask: { r: 0.06 } }), 6.38, 0.63, 3.04, 2.44, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.55, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.5, h: 1.75, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.5, 1.7, 38, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.7, w: 5.4, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.3, w: 5.4, h: 0.4, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: 'E3EDD8', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 74, slug: 'ormon', name: "Örmon", category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "o'sish va ildizlar tili: sabab, rivojlanish va barqarorlik; sokin, asosli", limits: {}, prefer: 'text' } };
