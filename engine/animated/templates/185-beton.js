/** 185 Beton — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 185, slug: 'beton', name: "Beton", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Arial' },
  C: { ink: '1E1E1E', muted: '5C5C5C', accent: 'D94F30' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => { const base = kind === 'dark' ? compose(flat('2B2B2B'), grain(0.2,0.55)) : null; if (base) return base; return compose(flat('B9B7B2'), grain(0.22,0.55), blobs([[1500,100,300,'CFCDC8',0.7]],160), kind === 'half' ? raw('<rect y="225" width="800" height="675" fill="#2B2B2B"/>') : raw('')); },
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in poured concrete: blunt capitals, grey pictures, slabs and bricks, a shaft, a dark basement page: a deck's pages must not look alike (L.pages)
    const WH = 'F2F1EE', GR = 'C9C7C2', SLAB = 'B9B7B2', RUST = '9E2F17';
    const up = (v) => String(v || '').toUpperCase();
    const foot = (s, x = 0.7, w = 8.7, c = C.muted, al = 'right') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align: al });
    const n2 = () => String(k.idx).padStart(2, '0');
    const open = async (d, x = 3.1, y = 0.45, w = 6.3, h = 0.9, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, up(d.title), x, y, w, h, { max: 24, min: 13, color: C.ink, align: 'right', valign: 'bottom', spacing: 1, ...o }); num(s); foot(s); return s; };
    const dark = async (d, x = 0.7, y = 0.45, w = 8.6, h = 0.9, o = {}) => { const s = await slide('dark'); if (d.title) k.head(s, up(d.title), x, y, w, h, { max: 24, min: 13, color: WH, valign: 'bottom', spacing: 1, ...o }); k.txt(s, n2(), 9.05, 0.18, 0.6, 0.3, { size: 9, color: GR, align: 'right' }); foot(s, 0.7, 8.7, GR); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.18, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, up(v), x, y, w, h, { max: 13, min: 10, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 70, min: 18, color: C.accent, ...o });
    const rule = (s, x, y, w, h = 0, c = C.ink, wd = 1.5) => t.line(s, x, y, w, h, c, wd);
    const ic = async (s, it, x, y, z, c = C.ink) => t.img(s, await L.icon(it.icon, c, 2.25), x, y, z, z);
    const V = {
      image: [
        async (d) => { // a grey slab of picture across the top, the title cast beside the words under it
          const s = await open({});
          await k.photo(s, d.image, 0, 0, 10, 2.7, { gray: true });
          k.head(s, up(d.title), 0.7, 2.9, 3.1, 2.2, { max: 20, min: 12, color: C.ink, valign: 'top', spacing: 1 });
          p(s, d.text, 4.05, 2.9, 5.35, 2.25, { max: 13 });
        },
        async (d) => { // half the page grey picture to the edges, the words set hard right
          const s = await open(d, 5.35, 0.45, 4.05, 1.25, { max: 20 });
          await k.photo(s, d.image, 0, 0, 5.0, 5.625, { gray: true });
          rule(s, 5.0, 0, 0, 5.625, C.accent, 2.5);
          p(s, d.text, 5.35, 1.85, 4.05, 3.3, { align: 'right', max: 13 });
        },
        async (d) => { // the basement: a window of picture in a dark wall, at the right; the words at the left
          const s = await dark(d, 0.7, 0.45, 4.1, 1.25, { max: 20 });
          await k.photo(s, d.image, 5.2, 0.55, 4.1, 4.5);
          p(s, d.text, 0.7, 1.85, 4.1, 3.25, { color: WH, max: 13 });
        },
        async (d) => { // the picture fills the wall, a slab of concrete hung on it; the footer on bare concrete below
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2, { gray: true });
          foot(s);
          t.rect(s, 3.3, 2.35, 6.7, 2.85, SLAB, { name: 'Slab' });
          k.head(s, up(d.title), 3.55, 2.45, 5.2, 0.7, { max: 16, min: 11, color: C.ink, valign: 'top', spacing: 1 });
          k.txt(s, n2(), 8.9, 2.47, 0.8, 0.28, { size: 10, bold: true, color: C.ink, align: 'right' });
          p(s, d.text, 3.55, 3.18, 6.15, 1.95, { max: 12.5, ls: 1.12 });
        },
      ],
      cards: [
        async (d) => { // numbers stencilled large at the right edge, the words set hard against them
          const s = await open(d), n = d.items.length, hh = 3.56 / n;
          d.items.forEach((it, i) => {
            const y = 1.5 + i * hh;
            big(s, String(i + 1).padStart(2, '0'), 8.15, y, 1.25, hh - 0.08, { max: 40, min: 20, align: 'right', valign: 'top' });
            h3(s, it.h, 0.7, y + 0.03, 7.25, 0.27, { align: 'right' });
            p(s, it.t, 1.2, y + 0.31, 6.75, hh - 0.38, { max: 12.5, min: 10, ls: 1.1, align: 'right' });
          });
        },
        async (d) => { // brick bond: the second course set half a brick along the first
          const s = await open(d), n = d.items.length, w = n === 3 ? 4.1 : 3.85, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const row = i < 2 ? 0 : 1, x = row ? (n === 3 ? 2.95 : (i === 2 ? 1.6 : 5.45)) : (i ? 9.3 - w : 0.7), y = 1.52 + row * (hh + 0.06);
            rule(s, x, y, w);
            await ic(s, it, x, y + 0.1, 0.3);
            h3(s, it.h, x + 0.4, y + 0.1, w - 0.4, 0.32, { valign: 'middle' });
            p(s, it.t, x, y + 0.48, w, hh - 0.52, { max: 12.5, min: 10, ls: 1.1 });
          }
        },
        async (d) => { // heavy names at the left, the words at the right, a rule poured under each row
          const s = await open(d), n = d.items.length, hh = 3.56 / n;
          d.items.forEach((it, i) => {
            const y = 1.5 + i * hh;
            k.head(s, up(it.h), 0.7, y + 0.03, 3.5, hh - 0.14, { max: 18, min: 11, color: C.ink, valign: 'top' });
            p(s, it.t, 4.4, y + 0.03, 5.0, hh - 0.14, { max: 13, min: 10, ls: 1.1, align: 'right' });
            if (i < n - 1) rule(s, 0.7, y + hh - 0.05, 8.7, 0, C.ink, 0.75);
          });
        },
        async (d) => { // the basement: icons in orange, the list in pale capitals in a grid
          const s = await dark(d), n = d.items.length, w = 4.05, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.7 + (i % 2) * (w + 0.5), y = 1.52 + Math.floor(i / 2) * (hh + 0.06), ww = wide ? 8.6 : w;
            await ic(s, it, x, y + 0.02, 0.42, 'FF7A55');
            h3(s, it.h, x + 0.56, y + 0.02, ww - 0.56, 0.42, { color: WH, valign: 'middle' });
            p(s, it.t, x, y + 0.52, ww, hh - 0.56, { color: GR, max: 12.5, min: 10, ls: 1.1 });
          }
        },
        async (d) => { // one load-bearing item, the others stacked against it
          const s = await open(d), [a, ...rest] = d.items, hh = 3.55 / rest.length;
          await ic(s, a, 0.7, 1.55, 0.95, C.accent);
          k.head(s, up(a.h), 0.7, 2.6, 3.6, 0.72, { max: 20, min: 12, color: C.ink, valign: 'top' });
          p(s, a.t, 0.7, 3.35, 3.6, 1.72, { max: 13.5, min: 10, ls: 1.12 });
          rule(s, 4.6, 1.55, 0, 3.5);
          for (const [i, it] of rest.entries()) {
            const y = 1.5 + i * hh;
            h3(s, it.h, 4.85, y + 0.03, 4.5, 0.3);
            p(s, it.t, 4.85, y + 0.34, 4.5, hh - 0.4, { max: 12.5, min: 10, ls: 1.1 });
          }
        },
      ],
      process: [
        async (d) => { // a conveyor: two-figure stencils, an arrow from each column to the next
          const s = await open(d), n = d.steps.length, gap = 0.42, w = (8.7 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1).padStart(2, '0'), x, 1.45, w, 0.95, { max: 52, valign: 'top' });
            if (i < n - 1) k.txt(s, '→', x + w + 0.03, 1.72, gap - 0.06, 0.4, { size: 16, bold: true, color: C.ink, align: 'center', valign: 'middle' });
            rule(s, x, 2.42, w);
            h3(s, st.h, x, 2.5, w, 0.5);
            p(s, st.t, x, 3.02, w, 2.08, { max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // stairs poured upward: a tread and a riser to every step, the highest at the right
          const s = await open(d), n = d.steps.length, gap = 0.12, w = (8.7 - gap * (n - 1)) / n, dy = n === 4 ? 0.38 : 0.5, y0 = 1.45 + (n - 1) * dy;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = y0 - i * dy;
            rule(s, x, y, w + (i < n - 1 ? gap : 0), 0, C.ink, 2);
            if (i < n - 1) rule(s, x + w + gap, y - dy, 0, dy, C.ink, 2);
            k.head(s, String(i + 1), x, y + 0.04, 0.42, 0.42, { max: 22, color: RUST, valign: 'top' });
            h3(s, st.h, x + 0.42, y + 0.07, w - 0.5, 0.5, { max: 11.5 });
            p(s, st.t, x, y + 0.6, w - 0.08, 5.1 - y - 0.6, { max: 12, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // the title stencilled up the wall, the steps climbing the shaft beside it
          const s = await open({}), n = d.steps.length, hh = 4.6 / n, H = 4.55;
          k.txt(s, up(d.title), 1.15 - H / 2, 0.55 + H / 2 - 0.65, H, 1.3, { max: 20, min: 13, bold: true, font: F.head, color: C.ink, rotate: 270, align: 'left', valign: 'middle', ls: 1.05, spacing: 1 });
          rule(s, 2.1, 0.55, 0, 4.55);
          d.steps.forEach((st, i) => {
            const y = 0.55 + (n - 1 - i) * hh;
            big(s, String(i + 1), 2.3, y, 0.75, Math.min(0.85, hh - 0.08), { max: 40, valign: 'top' });
            h3(s, st.h, 3.1, y + 0.03, 6.0, 0.3);
            p(s, st.t, 3.1, y + 0.34, 5.9, hh - 0.42, { max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // the basement again: one pale line across, steps above and below it in turn
          const s = await dark(d), n = d.steps.length, ly = 3.3, w = n === 4 ? 3.2 : 3.6, xs = n === 4 ? [0.7, 2.6, 4.5, 6.1] : [0.7, 3.2, 5.7];
          rule(s, 0, ly, 10, 0, GR, 1);
          d.steps.forEach((st, i) => {
            const x = xs[i], top = i % 2 === 0, y = top ? 1.48 : ly + 0.12;
            t.line(s, x, top ? ly - 0.14 : ly, 0, 0.14, 'FF7A55', 2);
            k.head(s, String(i + 1).padStart(2, '0'), x, y, 0.6, 0.34, { max: 17, color: 'FF7A55', valign: 'top' });
            h3(s, st.h, x + 0.62, y + 0.04, w - 0.62, 0.3, { color: WH, max: 12 });
            p(s, st.t, x, y + 0.38, w, ly - 1.48 - 0.48, { color: GR, max: 12, min: 10, ls: 1.08 });
          });
        },
      ],
      stats: [
        async (d) => { // one figure stamped across the whole slab, the rest small to its right below
          const s = await open(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.35, 8.7, 1.85, { max: 110, min: 40, valign: 'middle', align: 'right' });
          p(s, a.label, 0.7, 3.25, 3.0, 0.72, { max: 13, min: 10.5, ls: 1.08 });
          if (d.note) p(s, d.note, 0.7, 4.0, 3.0, 1.1, { max: 10, min: 9.5, ls: 1.03, color: C.ink });
          rest.forEach((v, i) => {
            const x = 3.95 + i * 2.8;
            k.head(s, v.value, x, 3.25, 2.6, 0.6, { max: 28, min: 14, color: C.ink, valign: 'top' });
            p(s, v.label, x, 3.88, 2.6, 1.2, { max: 12.5, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // the basement: figures stacked in orange down the right, their words set toward them
          const s = await dark(d, 0.7, 0.45, 8.6, 0.9, { align: 'right' }), rh = d.note ? 0.84 : 1.12;
          d.stats.forEach((v, i) => {
            const y = 1.5 + i * rh;
            p(s, v.label, 0.7, y, 5.0, rh - 0.1, { color: WH, align: 'right', valign: 'middle', max: 14 });
            rule(s, 5.85, y + 0.05, 0, rh - 0.2, GR, 1);
            k.head(s, v.value, 6.0, y, 3.3, rh - 0.1, { max: 40, min: 16, color: 'FF7A55', align: 'right', valign: 'middle' });
          });
          if (d.note) p(s, d.note, 0.7, 1.5 + 3 * rh + 0.05, 8.6, 5.1 - (1.5 + 3 * rh + 0.05), { max: 10.5, min: 9.5, color: GR, ls: 1.05, align: 'right' });
        },
        async (d) => { // three pillars of equal height, the figure on top of each, the note along the foot
          const s = await open(d), w = 2.7, gap = 0.3;
          d.stats.forEach((v, i) => {
            const x = 0.7 + i * (w + gap);
            rule(s, x, 1.55, 0, 2.4);
            k.head(s, v.value, x + 0.14, 1.5, w - 0.14, 1.0, { max: 42, min: 16, color: C.accent, valign: 'top' });
            p(s, v.label, x + 0.14, 2.55, w - 0.14, 1.4, { max: 13, min: 10.5, ls: 1.1 });
          });
          if (d.note) p(s, d.note, 0.7, 4.1, 8.7, 1.0, { max: 11, min: 9.5, ls: 1.08, color: C.ink, align: 'right' });
        },
      ],
      compare: [
        async (d) => { // half a basement: the first side on the dark half, the other on bare concrete
          const s = await slide('half'), w = 4.0, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 2.6);
          k.head(s, up(d.title), 3.1, 0.3, 6.3, 0.95, { max: 24, min: 13, color: C.ink, align: 'right', valign: 'middle', spacing: 1 }); num(s);
          k.foot(s, { x: 5.4, w: 4.0, y: 5.3, size: 7.5, color: C.muted, align: 'right' });
          k.head(s, up(d.left.h), 0.5, 1.55, w, 0.55, { max: 16, min: 11, color: 'FF7A55', valign: 'top' });
          k.head(s, up(d.right.h), 5.4, 1.55, w, 0.55, { max: 16, min: 11, color: C.ink, valign: 'top' });
          let y = 2.2;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.5, y, w, rh, { size: fs, color: WH });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.4, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two floors: heading on the right of each, its list running across, one slab between
          const s = await open(d), hh = 1.74;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.5 + i * (hh + 0.08);
            k.head(s, up(side.h), 6.9, y + 0.05, 2.5, hh - 0.14, { max: 17, min: 11, color: i ? RUST : C.ink, align: 'right', valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 0.7 + (j % 2) * 3.05, y + 0.05 + Math.floor(j / 2) * 0.82, 2.85, 0.78, { max: 12, min: 10, ls: 1.08 }));
            if (!i) rule(s, 0.7, y + hh + 0.04, 8.7, 0, C.ink, 2);
          });
        },
      ],
      statement: [
        async (d) => { // the sentence in capitals, as big as the wall allows; title and note cut small beneath
          const s = await open({});
          k.head(s, L.runs(up(d.text)), 0.7, 0.45, 8.7, 3.2, { max: 34, min: 16, color: C.ink, align: 'right', valign: 'top' });
          rule(s, 0.7, 3.75, 8.7, 0, C.accent, 2.5);
          k.head(s, up(d.title), 0.7, 3.85, 2.9, 1.25, { max: 13, min: 10.5, color: C.ink, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.8, 3.85, 5.6, 1.28, { max: 11.5, min: 9.5, ls: 1.08, align: 'right' });
        },
        async (d) => { // the basement: pale words on the dark wall, an orange rule at their side
          const s = await dark({});
          k.head(s, up(d.title), 0.7, 0.42, 8.0, 0.6, { max: 15, min: 11, color: 'FF7A55', valign: 'top', spacing: 1 });
          rule(s, 0.7, 1.15, 0, 3.95, 'FF7A55', 2.5);
          k.head(s, L.runs(d.text), 1.0, 1.1, 8.3, 2.5, { max: 32, min: 16, color: WH, valign: 'middle' });
          if (d.caption) p(s, d.caption, 1.0, 3.7, 7.0, 1.42, { max: 12, min: 10, color: GR, ls: 1.1 });
        },
      ],
      timeline: [
        async (d) => { // a core down the page, the years cast on either side of it in turn
          const s = await open(d), cx = 5, w = 3.95, bh = 1.32, dy = (3.6 - bh) / 3;
          rule(s, cx, 1.5, 0, 3.6, C.ink, 2);
          d.items.forEach((it, i) => {
            const y = 1.47 + i * dy, r = i % 2 === 1, x = r ? cx + 0.22 : cx - 0.22 - w, al = r ? 'left' : 'right';
            t.line(s, r ? cx : cx - 0.14, y + 0.17, 0.14, 0, C.accent, 2);
            k.head(s, it.year, x, y, w, 0.36, { max: 18, min: 12, color: RUST, align: al, valign: 'middle' });
            h3(s, it.h, x, y + 0.36, w, 0.25, { align: al, max: 11.5 });
            p(s, it.t, x, y + 0.62, w, bh - 0.64, { max: 11.5, min: 10, ls: 1.05, align: al });
          });
        },
        async (d) => { // the basement: the years huge along the top of the wall, the words hung beneath them
          const s = await dark(d), w = 2.05, gap = 0.13;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 1.45, w, 0.8, { max: 30, min: 12, color: 'FF7A55', valign: 'bottom' });
            rule(s, x, 2.3, w, 0, GR, 1);
            h3(s, it.h, x, 2.38, w, 0.46, { color: WH, max: 12 });
            p(s, it.t, x, 2.86, w, 2.24, { color: GR, max: 12, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // floors going down from right to left, each year further out along the slab
          const s = await open(d), hh = 3.6 / 4, w = 4.9;
          d.items.forEach((it, i) => {
            const x = 9.4 - w - i * 1.25, y = 1.47 + i * hh;
            rule(s, x, y + 0.02, w, 0, C.ink, 1);
            k.head(s, it.year, x + w - 1.6, y + 0.06, 1.6, 0.3, { max: 13.5, min: 10, color: RUST, align: 'right', valign: 'top' });
            h3(s, it.h, x, y + 0.08, w - 1.7, 0.26, { max: 11.5 });
            p(s, it.t, x, y + 0.36, w, hh - 0.38, { max: 11, min: 10, ls: 1.03 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.stats = V.stats.shift(); R.cards = V.cards.shift(); // nor the first steps, years and figures the rows of the cards; the old narrow rows set their words too small
    return V;
  },
  tone: "industrial va lo'nda: qisqa, kuchli, aniq" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "technical"], "transitions": ["cut", "split:h", "fade"], "cover": ["stretch", "stretch"], "mark": "appear", "deco": "stretch", "sig": {"title": "stretch", "body": "fade", "item": "unfold", "image": "stretch", "number": "appear", "order": "seq", "stagger": 0.18}, "tempo": 1.05, "kenburns": false};
