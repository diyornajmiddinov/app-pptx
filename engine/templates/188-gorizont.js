/** 188 Gorizont — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 188, slug: 'gorizont', name: "Gorizont", mode: 'bottom', list: 'cols', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '1F2937', muted: '5B6575', accent: '2563EB' }, photo: { r: 0.06 }, rule: false, caps: false, bold: true,
  bg: (kind) => { const at = { high: 0.28, low: 0.78, mid: 0.55, far: 0.12 }[kind] ?? 0.55; if (kind === 'dusk') return compose(lin([[0,'1E3A5F'],[0.72,'27518A'],[0.721,'0F2238'],[1,'0F2238']])); return compose(lin([[0,'BFD9F2'],[at,'EAF3FB'],[at + 0.01,'FFFFFF'],[1,'FFFFFF']])); },
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, under an open sky: the horizon line moves up and down the page, the sun, the road and the way ahead give the shapes: a deck's pages must not look alike (L.pages)
    const NAVY = '1D4ED8', MIST = 'DCE9F7', WH = 'FFFFFF';
    const foot = (s, x = 0.7, w = 8.6, c = C.muted, al = 'left') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align: al });
    const open = async (kind, d, x = 0.7, y = 0.4, w = 7.3, h = 0.85, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 14, color: C.ink, valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const ic = async (s, it, x, y, z, c = C.accent) => t.img(s, await L.icon(it.icon, c, 1.75), x, y, z, z);
    const line = (s, x, y, w, h = 0, c = C.accent, wd = 1) => t.line(s, x, y, w, h, c, wd);
    const dot = (s, x, y, r = 0.07, c = C.accent) => t.oval(s, x - r, y - r, r * 2, r * 2, c);
    const V = {
      image: [
        async (d) => { // the picture is the sun, half risen over a low horizon; the words in the sky above and beside it
          const s = await slide('low');
          num(s); foot(s);
          t.img(s, await L.photo(L.src(d.image), 5.0, 2.5, { mask: { path: 'M0,1 C0,0.42 0.22,0 0.5,0 C0.78,0 1,0.42 1,1 Z' } }), 4.5, 1.89, 5.0, 2.5, { alt: '' });
          k.head(s, d.title, 0.7, 0.4, 7.3, 0.9, { max: 26, min: 14, color: C.ink, valign: 'top' });
          p(s, d.text, 0.7, 1.4, 3.65, 2.95, { max: 12.5, ls: 1.14 });
        },
        async (d) => { // a broad landscape from edge to edge, cut along its bottom by a clean horizon
          const s = await slide('mid');
          await k.photo(s, d.image, 0, 0, 10, 3.09);
          k.head(s, d.title, 0.7, 3.22, 3.0, 1.95, { max: 22, min: 13, color: C.ink, valign: 'top' });
          p(s, d.text, 3.95, 3.22, 5.35, 2.0, { max: 12.5, ls: 1.12 });
          foot(s);
        },
        async (d) => { // a tall window on the left, looking out from the ground up to the sky
          const s = await open('far', d, 4.0, 0.72, 5.3, 1.05, { valign: 'top', max: 24 });
          await k.photo(s, d.image, 0.7, 0.45, 2.95, 4.65, { mask: { r: 0.06 } });
          p(s, d.text, 4.0, 1.85, 5.3, 3.25);
        },
        async (d) => { // the picture fills the view, a pane of sky hung high in it
          const s = await slide('mid');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          foot(s);
          t.rect(s, 4.4, 0.45, 5.1, 4.3, 'EAF3FB', { t: 6, r: 0.06, name: 'Pane' });
          k.head(s, d.title, 4.7, 0.62, 4.1, 0.95, { max: 20, min: 13, color: C.ink, valign: 'top' });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.1, 0.55, 1.25, 0.26, { size: 9, color: C.muted, align: 'right' });
          p(s, d.text, 4.7, 1.62, 4.5, 3.0, { max: 12.5, ls: 1.12 });
        },
      ],
      cards: [
        async (d) => { // icons standing on the horizon like things seen far off, the words below the line
          const s = await slide('high'), n = d.items.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n, hy = 1.575;
          k.head(s, d.title, 0.7, 0.25, 7.3, 0.72, { max: 24, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            await ic(s, it, x, hy - 0.52, 0.48);
            h3(s, it.h, x, hy + 0.14, w, 0.55, { max: 15 });
            p(s, it.t, x, hy + 0.7, w, 5.12 - hy - 0.7, { max: 13, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // the way leads off: every item a little further toward the right and a little smaller
          const s = await open('far', d), n = d.items.length, hh = 3.7 / n, dx = n === 4 ? 0.75 : 1.1;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + (n - 1 - i) * dx, y = 1.4 + i * hh, z = 0.42;
            await ic(s, it, x, y + 0.02, z);
            h3(s, it.h, x + z + 0.14, y, 7.2 - z, 0.28);
            p(s, it.t, x + z + 0.14, y + 0.3, 8.6 - (x - 0.7) - z - 0.14, hh - 0.36, { max: 12, min: 10, ls: 1.08 });
          }
        },
        async (d) => { // two above the horizon, the rest below it, a single dot marking the place where it divides
          const s = await slide('mid'), n = d.items.length, w = 4.05, hy = 3.09;
          k.head(s, d.title, 0.7, 0.25, 7.3, 0.78, { max: 24, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          for (const [i, it] of d.items.entries()) {
            const low = i >= 2, wide = n === 3 && i === 2, x = wide ? 2.975 : 0.7 + (i % 2) * (w + 0.5), y = low ? hy + 0.14 : 1.08;
            await ic(s, it, x, y + 0.02, 0.36);
            h3(s, it.h, x + 0.48, y + 0.02, w - 0.48, 0.36, { valign: 'middle' });
            p(s, it.t, x, y + 0.44, w, (low ? 5.14 - y : hy - y) - 0.48, { max: 12.5, min: 10, ls: 1.08 });
          }
        },
        async (d) => { // the title alone in a tall sky at the left, the items walking down the right
          const s = await slide('page'), n = d.items.length, hh = 4.6 / n;
          k.head(s, d.title, 0.7, 0.55, 3.0, 2.3, { max: 28, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          line(s, 4.0, 0.55, 0, 4.55, C.accent, 1);
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * hh;
            dot(s, 4.0, y + 0.14);
            h3(s, it.h, 4.3, y, 3.7, 0.3);
            await ic(s, it, 8.92, y, 0.34);
            p(s, it.t, 4.3, y + 0.32, 5.0, hh - 0.4, { max: 12.5, min: 10, ls: 1.08 });
          }
        },
      ],
      process: [
        async (d) => { // a road to the vanishing point: the first step wide and near at the foot, the last narrow and far at the top
          const s = await slide('high'), n = d.steps.length, hw = (y) => 1.75 + (y - 1.575) * (2.6 / 3.55), hh = 3.55 / n;
          k.head(s, d.title, 0.7, 0.3, 7.3, 0.95, { max: 26, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          t.line(s, 5 + hw(1.575), 1.575, hw(5.125) - hw(1.575), 3.55, C.accent, 1);
          t.line(s, 5 - hw(5.125), 1.575, hw(5.125) - hw(1.575), 3.55, C.accent, 1, { flipV: true });
          d.steps.forEach((st, i) => {
            const y = 1.62 + (n - 1 - i) * hh, w = 2 * hw(y) - 0.3;
            h3(s, `${i + 1}.  ${st.h}`, 5 - w / 2, y, w, 0.26, { max: 13, align: 'center', color: C.accent });
            p(s, st.t, 5 - w / 2, y + 0.26, w, hh - 0.3, { max: 11.5, min: 10, ls: 1.03, align: 'center' });
          });
        },
        async (d) => { // numbers rise out of the horizon, the steps go below the line
          const s = await slide('page'), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n, hy = 3.09;
          k.head(s, d.title, 0.7, 0.3, 7.3, 0.85, { max: 26, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 1.75, w, 1.32, { max: 88, min: 40, valign: 'bottom' });
            h3(s, st.h, x, hy + 0.1, w, 0.5, { max: 13.5 });
            p(s, st.t, x, hy + 0.58, w, 5.14 - hy - 0.58, { max: 11.5, min: 10, ls: 1.04 });
          });
        },
        async (d) => { // a flight path: the steps climb from bottom left to the top right, a small dot at each
          const s = await open('page', d, 0.7, 0.3, 5.0, 1.0, { valign: 'top' }), n = d.steps.length, dx = n === 4 ? 2.2 : 2.95, dy = n === 4 ? 0.58 : 0.75, w = dx - 0.2;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * dx, y = 3.3 - i * dy;
            dot(s, x + 0.07, y);
            if (i < n - 1) t.line(s, x + 0.07, y - dy, dx, dy, C.accent, 1, { flipV: true, dash: 'sysDash' });
            h3(s, `${i + 1}. ${st.h}`, x, y + 0.12, w, 0.5, { max: 12.5 });
            p(s, st.t, x, y + (n === 4 ? 0.62 : 0.42), w, 1.34, { max: 11, min: 10, ls: 1.04 });
          });
        },
        async (d) => { // evening: a dark page, the steps in the night sky over a low horizon
          const s = await slide('dusk'), n = d.steps.length, hh = 2.85 / n;
          k.head(s, d.title, 0.7, 0.25, 7.3, 0.85, { max: 26, min: 14, color: WH, valign: 'middle' });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: MIST, align: 'right', spacing: 1 });
          foot(s, 0.7, 8.6, MIST);
          d.steps.forEach((st, i) => {
            const y = 1.15 + i * hh;
            k.head(s, String(i + 1), 0.7, y, 0.6, Math.min(0.7, hh - 0.06), { max: 34, color: '93C5FD', valign: 'top' });
            h3(s, st.h, 1.35, y + 0.02, 7.9, 0.27, { color: WH, max: 13 });
            p(s, st.t, 1.35, y + 0.29, 7.9, hh - 0.33, { color: 'DBE7F5', max: 12, min: 10, ls: 1.03 });
          });
        },
      ],
      stats: [
        async (d) => { // one figure as large as the sky, resting on the horizon; two more on the ground below
          const s = await slide('page'), [a, ...rest] = d.stats, hy = 3.09;
          k.head(s, d.title, 0.7, 0.25, 7.3, 0.62, { max: 20, min: 13, color: C.ink, valign: 'top' }); num(s); foot(s);
          big(s, a.value, 0.7, 0.9, 5.4, 2.15, { max: 96, min: 34, valign: 'bottom' });
          p(s, a.label, 6.3, 1.5, 3.0, 1.5, { max: 14, min: 10.5, valign: 'bottom' });
          rest.forEach((v, i) => {
            const x = 0.7 + i * 2.85;
            k.head(s, v.value, x, hy + 0.22, 2.7, 0.58, { max: 28, min: 14, color: C.ink, valign: 'top' });
            p(s, v.label, x, hy + 0.84, 2.7, 1.15, { max: 12.5, min: 10, ls: 1.08 });
          });
          if (d.note) p(s, d.note, 6.4, hy + 0.14, 2.9, 1.95, { max: 11, min: 9.5, color: C.muted, ls: 1.05 });
        },
        async (d) => { // three heights above a high horizon: the figures step down into the white
          const s = await open('high', d, 0.7, 0.25, 7.3, 0.85), rh = d.note ? 0.82 : 1.1;
          d.stats.forEach((v, i) => {
            const y = 1.68 + i * rh;
            k.head(s, v.value, 0.7, y, 3.3, rh - 0.08, { max: 40, min: 16, color: C.accent, align: 'right', valign: 'middle' });
            line(s, 4.2, y + 0.08, 0, rh - 0.24, C.accent, 1);
            p(s, v.label, 4.4, y, 4.9, rh - 0.08, { max: 14, min: 10, valign: 'middle', ls: 1.08 });
          });
          if (d.note) p(s, d.note, 0.7, 1.68 + 3 * rh + 0.02, 8.6, 5.15 - (1.68 + 3 * rh + 0.02), { max: 10.5, min: 9.5, color: C.muted, ls: 1.03 });
        },
      ],
      compare: [
        async (d) => { // sky and ground: the first list above the horizon, the second below it
          const s = await slide('page'), hy = 3.09;
          k.head(s, d.title, 0.7, 0.2, 7.3, 0.52, { max: 18, min: 12, color: C.ink, valign: 'top' }); num(s); foot(s);
          [[d.left, 0.78, hy - 0.8, C.ink], [d.right, hy + 0.1, 5.14 - hy - 0.12, C.accent]].forEach(([side, y, hh, c]) => {
            k.head(s, side.h, 0.7, y, 2.25, hh, { max: 17, min: 12, color: c, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 3.15 + (j % 2) * 3.15, y + Math.floor(j / 2) * (hh / 2), 3.0, hh / 2 - 0.03, { max: 12.5, min: 10, ls: 1.05 }));
          });
        },
        async (d) => { // two roads from one point: the sides lean apart from a shared line, each set toward it
          const s = await open('high', d, 0.7, 0.25, 7.3, 0.85), w = 3.5, cx = 5, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 2.72);
          line(s, cx, 1.68, 0, 3.45, C.accent, 1);
          k.head(s, d.left.h, cx - 0.3 - w, 1.7, w, 0.55, { max: 17, min: 12, color: C.ink, align: 'right', valign: 'top' });
          k.head(s, d.right.h, cx + 0.3, 1.7, w, 0.55, { max: 17, min: 12, color: C.accent, valign: 'top' });
          let y = 2.34;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.3 - w, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // the sentence fills the sky over a very low horizon; the note on the strip of ground
          const s = await open('low', d, 0.7, 0.3, 7.3, 0.55, { max: 14, min: 11, color: C.accent, valign: 'top' });
          k.head(s, L.runs(d.text), 0.7, 0.9, 8.6, 3.35, { max: 38, min: 18, color: C.ink, valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.7, 4.47, 8.6, 0.8, { max: 10.5, min: 9, color: C.muted, ls: 1.0 });
        },
        async (d) => { // night over the plain: pale words high in a dark sky, the note under the horizon
          const s = await slide('dusk');
          k.head(s, d.title, 0.7, 0.3, 7.3, 0.5, { max: 14, min: 11, color: '93C5FD', valign: 'top' });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: MIST, align: 'right', spacing: 1 });
          k.head(s, L.runs(d.text), 1.0, 1.2, 8.0, 2.4, { max: 32, min: 16, color: WH, align: 'center', valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.9, 4.1, 8.2, 1.15, { max: 11, min: 9.5, color: 'DBE7F5', align: 'center', ls: 1.03 });
          foot(s, 0.7, 8.6, MIST, 'center');
        },
      ],
      timeline: [
        async (d) => { // the years stand on the horizon, the events hang below; a dot where each stands
          const s = await slide('page'), w = 2.05, gap = 0.13, hy = 3.09;
          k.head(s, d.title, 0.7, 0.3, 7.3, 0.85, { max: 26, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 2.3, w, 0.72, { max: 26, min: 12, color: C.accent, valign: 'bottom' });
            h3(s, it.h, x, hy + 0.08, w, 0.28, { max: 12 });
            p(s, it.t, x, hy + 0.37, w, 5.15 - hy - 0.37, { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // the way behind and the way ahead: past years in the sky at the left, later ones lower at the right
          const s = await open('far', d, 0.7, 0.25, 7.3, 0.85), w = 4.05, hh = 1.82;
          d.items.forEach((it, i) => {
            const col = i % 2, row = i > 1 ? 1 : 0, x = 0.7 + col * (w + 0.5), y = 1.25 + row * hh + (col ? 0.32 : 0);
            k.head(s, it.year, x, y, w, 0.38, { max: 19, min: 12, color: C.accent, valign: 'top' });
            h3(s, it.h, x, y + 0.38, w, 0.26, { max: 12.5 });
            p(s, it.t, x, y + 0.64, w, hh - 0.72 , { max: 12, min: 10, ls: 1.04 });
          });
        },
        async (d) => { // a road down the page: a dashed centre line, years on either side as the road goes on
          const s = await open('far', d, 0.7, 0.25, 7.3, 0.85), cx = 5, w = 4.0, bh = 1.3, dy = (3.85 - bh) / 3;
          t.line(s, cx, 1.25, 0, 3.85, C.accent, 1.5, { dash: 'dash' });
          d.items.forEach((it, i) => {
            const y = 1.25 + i * dy, r = i % 2 === 1, x = r ? cx + 0.25 : cx - 0.25 - w, al = r ? 'left' : 'right';
            k.head(s, it.year, x, y, w, 0.34, { max: 17, min: 12, color: C.accent, align: al, valign: 'top' });
            h3(s, it.h, x, y + 0.34, w, 0.25, { max: 12, align: al });
            p(s, it.t, x, y + 0.59, w, bh - 0.6, { max: 11.5, min: 10, ls: 1.03, align: al });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // nor the first steps and years the columns of the cards
    return V;
  },
  tone: "istiqbolli: maqsad va yo'l, tiniq va umidli" });
