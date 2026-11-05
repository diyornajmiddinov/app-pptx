/** 82 Kasseta — audio cassettes: J-card inserts with retro stripes, tape reels as markers, a big cassette cover. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '2B2D42', ink: 'F7F3E9', muted: 'C9C3B6', accent: 'FF8C42', card: 'FFF6E5', dark: '1C1D2B', pal: ['FF8C42', 'FFD166', '06D6A0', '118AB2', 'EF476F', 'B388EB'] };
const reel = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#2F2F3A" stroke="#555" stroke-width="4"/><circle cx="100" cy="100" r="62" fill="#${c}"/>${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="94" y="46" width="12" height="20" fill="#FFF6E5" transform="rotate(${a} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="30" fill="#FFF6E5"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kasseta', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  // J-card: cream insert with two retro stripes at the top
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.card, { r: 0.05, shadow: 0.35, blur: 6, offset: 3, name: 'J-card' }); if (!o.big) { t.rect(s, x, y + 0.12, w, 0.09, C.pal[k % 6], { name: 'Stripe' }); t.rect(s, x, y + 0.24, w, 0.06, C.pal[(k + 1) % 6], { name: 'Stripe' }); } },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'r' + (k % 6), reel(C.pal[k % 6]), 200, 200), x, y, d, d); if (d >= 1.5 && label === '') ctx.t.oval(s, x + d * 0.14, y + d * 0.14, d * 0.72, d * 0.72, C.card); /* a big reel carries a stats value: give it a clear hub */ if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.35, y: y + d * 0.35, w: d * 0.3, h: d * 0.3, fontSize: Math.max(8, Math.round(d * 13)), bold: true, color: C.dark, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.card, { r: 0.05, name: 'Cover' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '8D6E5A', 3),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.33, 0.75, ctx.idx, ''); t.text(s, `${ctx.idx % 2 ? 'A' : 'B'}${ctx.idx}`, { x: 1.3, y: 0.35, w: 0.7, h: 0.72, fontFace: 'Courier New', fontSize: 16, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 2.0, y: 0.35, w: 7.45, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.45, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => '2B2D42', subPanel: () => '5A5560', markerText: () => C.dark, authorColor: 'B4462A', compareHead: (i) => (i ? '118AB2' : 'B4462A'),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const card = C.card, dark = C.dark, navy = '2B2D42', tape = '8D6E5A', pal = ['FF8C42', 'FFD166', '06D6A0', '5CC8E8', 'EF476F', 'B388EB'], rust = 'B4462A', teal = '0C6C8C', sub = '5A5560', RET = ['FF8C42', 'FFD166', '06D6A0', '118AB2'];
    const reel = (s, x, y, d, k = 0) => marker(s, x, y, d, k, '');
    const shell = async (s, x, y, w, ht, o = {}) => { // a cassette: dark shell, cream label, a window with two reels
      const win = o.win ?? Math.min(0.6, ht * 0.28), lh = ht - win - 0.26;
      t.rect(s, x, y, w, ht, dark, { r: 0.08, shadow: 0.35, blur: 7, offset: 3, name: 'Cassette' });
      t.rect(s, x + 0.1, y + 0.1, w - 0.2, lh, card, { r: 0.04, name: 'Label' });
      const wy = y + ht - win - 0.06, ww = Math.min(w - 0.5, win * 3.8), wx = x + (w - ww) / 2;
      t.rect(s, wx, wy, ww, win, '3A3B4F', { r: 0.14, name: 'Window' });
      await reel(s, wx + 0.04, wy + 0.02, win - 0.04, o.k ?? 0); await reel(s, wx + ww - win, wy + 0.02, win - 0.04, (o.k ?? 0) + 3);
      return { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: lh };
    };
    const stripes = async (s, x, y, w, ht) => RET.forEach((c, k) => t.rect(s, x, y + (k * ht) / 4, w, ht / 4 - 0.01, c, { name: 'Stripe' }));
    const trackId = (i) => `${i % 2 ? 'B' : 'A'}${i + 1}`;
    const V = {
      image: [
        async (d) => { // a boombox: the picture on the tape door, a speaker on either side, a handle above
          const s = await page(d), x = 0.6, y = 1.3, w = 8.8, ht = 2.1, sp = 1.7;
          t.line(s, 3.0, 1.18, 4.0, 0, '8A8DA3', 3.5); t.line(s, 3.0, 1.18, 0, 0.14, '8A8DA3', 3.5); t.line(s, 7.0, 1.18, 0, 0.14, '8A8DA3', 3.5);
          t.rect(s, x, y, w, ht, dark, { r: 0.1, shadow: 0.4, blur: 8, offset: 3, name: 'Boombox' });
          for (const px of [x + 0.2, x + w - 0.2 - sp]) { t.oval(s, px, y + 0.2, sp, sp, '3A3B4F', { line: { color: '8A8DA3', width: 2 } }); t.oval(s, px + 0.4, y + 0.6, sp - 0.8, sp - 0.8, '14151F', { line: { color: pal[0], width: 1.5 } }); }
          const pw = w - 2 * sp - 0.8;
          t.img(s, await L.photo(L.src(d.image), pw, ht - 0.3), x + sp + 0.4, y + 0.15, pw, ht - 0.3, { alt: '' });
          t.rect(s, x + sp + 0.4, y + 0.15, pw, ht - 0.3, null, { line: { color: '8A8DA3', width: 1.5 }, name: 'Door' });
          body(s, d.text, 0.6, 3.48, 8.8, 1.65, { max: 14.5, k: 1.08, valign: 'middle' });
        },
        async (d) => { // the page is the picture, a tape insert is pinned over it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.15, 10, 0.475, navy, { name: 'Footer band' });
          t.rect(s, 0.45, 0.35, 4.95, 4.55, card, { r: 0.05, shadow: 0.45, blur: 8, offset: 3, name: 'J-card' });
          await stripes(s, 0.45, 0.47, 4.95, 0.28);
          head(s, d.title, 0.7, 0.8, 4.45, 0.82, { color: navy, max: 20 });
          body(s, d.text, 0.7, 1.65, 4.45, 3.15, { color: navy, max: 14, k: 1.1, valign: 'middle' });
          K.footer(ctx, s);
        },
        async (d) => { // the picture is the label of a tape: the shell around it, its two reels turning below
          const s = await page(d), a = await shell(s, 5.0, 1.28, 4.4, 3.8, { win: 0.92, k: 0 });
          t.img(s, await L.photo(L.src(d.image), a.w - 0.2, a.h - 0.2), a.x + 0.1, a.y + 0.1, a.w - 0.2, a.h - 0.2, { alt: '' });
          body(s, d.text, 0.6, 1.3, 4.1, 3.75, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // a great tape reel: the picture is wound in its hub, the tape runs off to a cream sleeve
          const s = await page(d), dia = 3.1, x = 0.72, y = 1.55, cx = x + dia / 2, cy = y + dia / 2;
          t.line(s, cx, y - 0.18, 3.45, 0, tape, 4, { name: 'Tape' });
          t.oval(s, x - 0.2, y - 0.2, dia + 0.4, dia + 0.4, '2F2F3A', { line: { color: '77798E', width: 3 } });
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          t.oval(s, cx - 0.2, cy - 0.2, 0.4, 0.4, card, { line: { color: dark, width: 2 } });
          t.rect(s, 4.45, 1.3, 4.95, 3.75, card, { r: 0.05, shadow: 0.35, blur: 6, offset: 3, name: 'Sleeve' });
          body(s, d.text, 4.65, 1.42, 4.55, 3.52, { color: navy, max: 14.5, k: 1.12, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // the track list on the inside of the sleeve: a line for each item
          const s = await page(d), n = d.items.length, rh = 3.45 / n;
          t.rect(s, 0.6, 1.25, 8.8, 3.85, card, { r: 0.04, shadow: 0.35, blur: 6, offset: 3, name: 'Track list' });
          await stripes(s, 0.6, 1.33, 8.8, 0.16);
          for (const [i, it] of d.items.entries()) {
            const y = 1.56 + i * rh;
            t.text(s, trackId(i), { x: 0.75, y, w: 0.55, h: rh, fontFace: 'Courier New', bold: true, fontSize: 15, color: rust, valign: 'middle' });
            t.img(s, await L.icon(it.icon, navy, 2), 1.32, y + rh / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, 1.77, y + 0.03, 2.35, rh - 0.06, { color: navy, max: 14 });
            body(s, it.t, 4.2, y + 0.03, 5.05, rh - 0.06, { color: sub, valign: 'middle', max: 13.5 });
            if (i < n - 1) t.line(s, 0.75, y + rh, 8.5, 0, 'D8CFB8', 0.75);
          }
        },
        async (d) => { // a shelf of tapes: each item is written on its own cassette label
          const s = await page(d), n = d.items.length, w = 4.32, hh = 1.86;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.16), y = 1.24 + Math.floor(i / 2) * (hh + 0.08), a = await shell(s, x, y, ww, hh, { win: 0.34, k: i });
            t.rect(s, a.x, a.y, a.w, 0.06, pal[i % 6], { name: 'Stripe' });
            t.img(s, await L.icon(it.icon, navy, 2), a.x + 0.1, a.y + 0.1, 0.28, 0.28);
            head(s, it.h, a.x + 0.44, a.y + 0.07, a.w - 0.55, 0.34, { color: navy, max: 13 });
            body(s, it.t, a.x + 0.12, a.y + 0.42, a.w - 0.24, a.h - 0.45, { color: navy, max: 12.5 });
          }
        },
        async (d) => { // the retro stripes run across the top and each turns down into its own item
          const s = await page(d), n = d.items.length, cw = 8.8 / n, sh = 0.1;
          for (let k = 0; k < n; k++) {
            const y = 1.22 + k * sh, x = 0.6 + k * cw + 0.06;
            t.rect(s, x, y, 10 - x, sh - 0.015, pal[k], { name: 'Stripe' });
            t.rect(s, x, y, 0.09, 5.05 - y, pal[k], { name: 'Stripe' });
          }
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw + 0.26, w = cw - 0.36, top = 1.72;
            t.img(s, await L.icon(it.icon, pal[i], 2), x, top, 0.44, 0.44);
            head(s, it.h, x, top + 0.5, w, 0.5, { color: pal[i], max: 15 });
            body(s, it.t, x, top + 1.03, w, 2.3, { max: 14 });
          }
        },
        async (d) => { // sleeves at two heights, a reel clipped on top of each
          const s = await page(d), n = d.items.length, gap = 0.16, w = (8.8 - gap * (n - 1)) / n, hh = 2.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 2.12 : 1.72;
            await panel(s, x, y, w, hh, i);
            await reel(s, x + w / 2 - 0.36, y - 0.42, 0.72, i);
            t.img(s, await L.icon(it.icon, navy, 2), x + w - 0.42, y + 0.36, 0.28, 0.28);
            head(s, it.h, x + 0.14, y + 0.34, w - 0.58, 0.46, { color: navy, max: 14 });
            body(s, it.t, x + 0.14, y + 0.82, w - 0.28, hh - 0.9, { color: sub, max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // the tape path: from one reel to the other past a head for each step
          const s = await page(d), n = d.steps.length, y = 1.5, x0 = 1.65, x1 = 8.35, cw = 8.8 / n;
          await reel(s, 0.45, 1.18, 1.25, 0); await reel(s, 8.3, 1.18, 1.25, 3);
          t.line(s, x0 - 0.1, y + 0.3, x1 - x0 + 0.2, 0, tape, 5, { name: 'Tape' });
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2;
            t.rect(s, cx - 0.27, y + 0.01, 0.54, 0.58, card, { r: 0.05, line: { color: dark, width: 1.5 }, name: 'Tape head' });
            t.text(s, String(i + 1), { x: cx - 0.27, y: y + 0.01, w: 0.54, h: 0.58, bold: true, fontSize: 16, color: navy, align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.08, 2.52, cw - 0.16, 0.5, { align: 'center', color: pal[i], max: 15 });
            body(s, st.t, x + 0.12, 3.04, cw - 0.24, 2.05, { align: 'center' });
          }
        },
        async (d) => { // the keys of a tape deck: pressed one after the other, each stands higher than the last
          const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.33 : 0.46, SYM = ['◀◀', '▶', '▶▶', '■'];
          t.rect(s, 0.45, 4.92, 9.1, 0.18, dark, { name: 'Deck' });
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.26 + (n - 1 - i) * rise;
            t.rect(s, x, y, w, 4.94 - y, 'E6E3DA', { r: 0.05, line: { color: '8A8DA3', width: 1.25 }, name: 'Deck key' });
            t.rect(s, x, y, w, 0.1, pal[i], { name: 'Key band' });
            t.text(s, `${i + 1}  ${SYM[i]}`, { x: x + 0.14, y: y + 0.13, w: w - 0.28, h: 0.4, fontFace: 'Arial', bold: true, fontSize: 17, color: rust, valign: 'middle', noFit: true });
            head(s, st.h, x + 0.14, y + 0.55, w - 0.28, 0.46, { color: navy, max: 14 });
            body(s, st.t, x + 0.14, y + 1.03, w - 0.28, 4.94 - y - 1.1, { color: sub, max: 14 });
          }
        },
        async (d) => { // the tape hangs down the middle of the page: a reel on it for each step, left and right in turn
          const s = await page(d), n = d.steps.length, w = 3.75;
          t.rect(s, 4.96, 1.18, 0.08, 3.92, tape, { name: 'Tape' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, y = n === 3 && i === 1 ? 2.22 : 1.28 + Math.floor(i / 2) * 1.92 + (right ? 0.3 : 0), x = right ? 5.65 : 0.6, a = right ? 'left' : 'right';
            const ry = y + (right && n === 4 ? 0.48 : 0);
            await reel(s, 4.62, ry, 0.76, i);
            t.text(s, String(i + 1), { x: 4.62, y: ry, w: 0.76, h: 0.76, bold: true, fontSize: 12, color: dark, align: 'center', valign: 'middle' });
            head(s, st.h, x, y, w, 0.42, { align: a, color: pal[i], max: 15 });
            body(s, st.t, x, y + 0.44, w, 1.2, { align: a, max: 13.5 });
          }
        },
      ],
      stats: [
        async (d) => { // three cassettes: the figure on the label, the words under the tape
          const s = await page(d), gap = 0.2, w = (8.8 - gap * 2) / 3;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * (w + gap), a = await shell(s, px, 1.25, w, 1.8, { win: 0.42, k: i });
            t.rect(s, a.x, a.y, a.w, 0.06, pal[i], { name: 'Stripe' });
            t.text(s, x.value, { x: a.x + 0.05, y: a.y + 0.08, w: a.w - 0.1, h: a.h - 0.1, bold: true, color: rust, align: 'center', valign: 'middle', fontSize: L.fit(x.value, a.w - 0.2, a.h - 0.2, 36, 16, 'Arial', true) });
            body(s, x.label, px + 0.08, 3.13, w - 0.16, 0.62, { align: 'center', max: 14 });
          }
          if (d.note) { await stripes(s, 0, 3.82, 10, 0.1); body(s, d.note, 0.6, 3.98, 8.8, 1.1, { color: C.muted, align: 'center', valign: 'middle', max: 13 }); }
        },
        async (d) => { // side A plays the main figure on a long sleeve, side B the other two
          const s = await page(d), [a, ...rest] = d.stats;
          t.rect(s, 0.6, 1.28, 4.45, 3.8, card, { r: 0.05, shadow: 0.35, blur: 6, offset: 3, name: 'Sleeve' });
          await stripes(s, 0.6, 1.4, 4.45, 0.32);
          t.text(s, a.value, { x: 0.8, y: 1.82, w: 4.05, h: 1.35, bold: true, color: rust, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.95, 1.3, 58, 24, 'Arial', true) });
          body(s, a.label, 1.05, 3.22, 3.55, 1.6, { color: navy, align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.3 + i * 1.08;
            await reel(s, 5.3, y, 0.96, i + 1);
            t.text(s, x.value, { x: 6.35, y: y + 0.02, w: 3.05, h: 0.5, bold: true, color: pal[i + 1], valign: 'middle', fontSize: L.fit(x.value, 3.0, 0.46, 26, 14, 'Arial', true) });
            body(s, x.label, 6.35, y + 0.52, 3.05, 0.46, { max: 12.5 });
          }
          if (d.note) body(s, d.note, 5.3, 3.5, 4.1, 1.56, { color: C.muted, valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // the two sides of the same tape: a great A and B stand back to back on a line of tape
          const s = await page(d), w = 3.75;
          t.rect(s, 4.96, 1.18, 0.08, 3.92, tape, { name: 'Tape' });
          const side = (x, c, l) => { t.oval(s, x, 1.25, 0.7, 0.7, c); t.text(s, l, { x, y: 1.25, w: 0.7, h: 0.7, bold: true, fontSize: 24, color: dark, align: 'center', valign: 'middle' }); };
          side(4.05, pal[0], 'A'); side(5.25, pal[2], 'B');
          head(s, d.left.h, 0.6, 1.3, 3.35, 0.6, { align: 'right', max: 18, color: pal[0] }); head(s, d.right.h, 6.05, 1.3, 3.35, 0.6, { max: 18, color: pal[2] });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.24, 2.92);
          let y = 2.12;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.95, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.3, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // two long tapes one above the other: the side letter and heading first, then the tracks
          const s = await page(d), hh = 1.84;
          for (const [i, sd] of [d.left, d.right].entries()) {
            const y = 1.26 + i * (hh + 0.08), n = sd.items.length, cw = 6.6 / n;
            t.rect(s, 0.6, y, 8.8, hh, dark, { r: 0.08, name: 'Cassette' }); t.rect(s, 2.68, y + 0.1, 6.62, hh - 0.2, card, { r: 0.04, name: 'Label' });
            t.oval(s, 0.72, y + 0.1, 0.56, 0.56, pal[i ? 2 : 0]); t.text(s, i ? 'B' : 'A', { x: 0.72, y: y + 0.1, w: 0.56, h: 0.56, bold: true, fontSize: 20, color: dark, align: 'center', valign: 'middle' });
            head(s, sd.h, 0.72, y + 0.7, 1.86, hh - 0.8, { color: pal[i ? 2 : 0], max: 16, valign: 'top' });
            for (const [k, it] of sd.items.entries()) {
              const x = 2.68 + k * cw;
              if (k) t.line(s, x, y + 0.2, 0, hh - 0.4, 'D8CFB8', 1);
              body(s, it, x + 0.12, y + 0.14, cw - 0.24, hh - 0.28, { color: navy, valign: 'middle', max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the thought written on the label of one big tape, the note on its sleeve beside it
          const s = await page(d), a = await shell(s, 0.6, 1.25, 6.05, 3.85, { win: 0.82, k: 0 });
          await stripes(s, a.x, a.y + 0.1, a.w, 0.26);
          t.text(s, L.runs(d.text), { x: a.x + 0.25, y: a.y + 0.42, w: a.w - 0.5, h: a.h - 0.5, fontFace: 'Arial', bold: true, color: navy, valign: 'middle', fontSize: L.fit(d.text, a.w - 0.5, a.h - 0.55, 26, 13, 'Arial', true) });
          if (d.caption) body(s, d.caption, 6.95, 1.35, 2.45, 3.65, { valign: 'middle', max: 14 });
        },
        async (d) => { // only the stripes of the sleeve, right across the page: the thought above them, the note below
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 8.8, h: 2.1, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.05, 36, 16, 'Arial', true) });
          await stripes(s, 0, 3.38, 10, 0.4);
          if (d.caption) body(s, d.caption, 0.6, 3.88, 8.8, 1.22, { color: C.muted, valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // the tape counter: each year rolls up in a black window, the stripes run past behind
          const s = await page(d), cw = 2.2;
          await stripes(s, 0, 1.52, 10, 0.34);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, w = cw - 0.25;
            t.rect(s, x, 1.28, w, 0.82, '101018', { r: 0.06, line: { color: '8A8DA3', width: 1.5 }, name: 'Counter' });
            t.text(s, it.year, { x: x + 0.05, y: 1.28, w: w - 0.1, h: 0.82, fontFace: 'Courier New', bold: true, color: pal[1], align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.15, 0.6, 22, 11, 'Courier New', true) });
            head(s, it.h, x, 2.24, cw - 0.15, 0.48, { color: pal[0], max: 14 });
            body(s, it.t, x, 2.74, cw - 0.2, 2.34, { max: 14 });
          }
        },
        async (d) => { // a stack of tapes seen edge on: the year on the coloured end of each spine
          const s = await page(d), rh = 3.85 / 4;
          for (const [i, it] of d.items.entries()) {
            const y = 1.25 + i * rh, hg = rh - 0.08;
            t.rect(s, 0.6, y, 8.8, hg, card, { r: 0.04, name: 'Spine' });
            t.rect(s, 0.6, y, 1.75, hg, pal[i], { r: 0.04, name: 'Spine end' });
            t.text(s, it.year, { x: 0.65, y, w: 1.65, h: hg, bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.55, 0.6, 18, 10, 'Arial', true) });
            head(s, it.h, 2.5, y + 0.03, 2.15, hg - 0.06, { color: navy, max: 14 });
            body(s, it.t, 4.7, y + 0.03, 4.6, hg - 0.06, { color: sub, valign: 'middle', max: 13 });
          }
        },
        async (d) => { // the tape comes off the reel and wanders across the page: each year sits on a loop of it
          const s = await page(d), w = 3.05, cw = 2.2, ty = 3.17;
          t.img(s, await svgOnce(ctx, 'loose', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="80"><path d="M0,40 C130,0 270,80 400,40 S660,0 800,40 S1060,80 1200,40 S1460,0 1600,40" fill="none" stroke="#${tape}" stroke-width="7"/></svg>`, 1600, 80), 0, ty - 0.25, 10, 0.5);
          for (const [i, it] of d.items.entries()) {
            const up = i % 2 === 1, cx = 0.6 + (i + 0.5) * cw, x = Math.max(0.6, Math.min(9.4 - w, cx - w / 2)), y = up ? 1.28 : 3.56;
            await reel(s, cx - 0.26, ty - 0.26, 0.52, i);
            t.text(s, [{ text: it.year + '   ', options: { color: pal[i], bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.42, fontFace: 'Arial', align: 'center', valign: 'middle', fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.4, 15, 9, 'Arial', true) });
            body(s, it.t, x, y + 0.44, w, 1.08, { align: 'center', max: 13 });
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
    t.rect(s, 0.5, 0.55, 9.0, 4.4, C.dark, { r: 0.2, shadow: 0.4, blur: 10, offset: 4, name: 'Cassette' });
    t.rect(s, 0.85, 0.8, 8.3, 2.6, C.card, { r: 0.08, name: 'Label' });
    ['FF8C42', 'FFD166', '06D6A0', '118AB2'].forEach((c, k) => t.rect(s, 0.85, 0.95 + k * 0.1, 8.3, 0.07, c, { name: 'Stripe' }));
    t.text(s, d.title, { x: 1.1, y: 1.35, w: d.image ? 5.3 : 7.8, h: 1.45, bold: true, fontSize: L.fit(d.title, d.image ? 5.3 : 7.8, 1.4, 34, 16, 'Arial', true), color: '2B2D42', valign: 'middle' });
    t.text(s, `${M.author || ''}   \u2022   ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, { x: 1.1, y: 2.85, w: d.image ? 5.3 : 7.8, h: 0.4, fontSize: 12, bold: true, color: 'B4462A' });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 2.4, 2.25), 6.55, 1.05, 2.4, 2.25, { alt: '' });
    t.rect(s, 2.6, 3.55, 4.8, 1.15, '3A3B4F', { r: 0.5, name: 'Window' });
    await K.marker(ctx, s, 2.85, 3.6, 1.05, 0, ''); await K.marker(ctx, s, 6.1, 3.6, 1.05, 3, '');
    if (d.subtitle) t.text(s, d.subtitle, { x: 3.95, y: 3.6, w: 2.1, h: 1.05, fontSize: 9, color: C.muted, align: 'center', valign: 'middle' });
    metaFooter({ color: C.muted, y: 5.15 })(ctx, s);
  },
};
module.exports = { id: 82, slug: 'kasseta', name: 'Kasseta', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "nostalgik va samimiy: hikoya kabi oqim, A va B tomonlari kabi aniq bo'limlar", limits: {}, prefer: null } };
