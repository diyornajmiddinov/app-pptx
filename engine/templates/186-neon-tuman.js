/** 186 Neon tuman — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 186, slug: 'neon-tuman', name: "Neon tuman", mode: 'split', list: 'cols', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F3EEFF', muted: 'B7ABD9', accent: '4FF0E0', titleInk: 'FFFFFF' }, photo: { r: 0.08 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('140B26'), blobs([[0,900,380,'7B2FF7',0.7],[1600,0,340,'00C2D1',0.55]],kind==='cover'?150:200), grain(0.05)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in neon fog: a beam across the dark, rings of light, slanted and sliced pictures in two glow colours: a deck's pages must not look alike (L.pages)
    const VI = 'C79BFF', BG = '140B26', duo = ['1A0D33', '4FF0E0'];
    const foot = (s, x = 0.6, w = 8.8, al = 'left') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted, align: al });
    const nb = (s, x, y, al = 'right', size = 22) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.0, 0.45, { size, bold: true, font: F.head, color: C.accent, align: al, valign: 'top', ls: 1 }); // the template's large page number, moved clear of each composition
    const open = async (d, x = 0.6, y = 0.3, w = 7.7, h = 0.95, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 14, color: C.titleInk, valign: 'middle', ...o }); nb(s, 8.4, 0.3); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.titleInk, valign: 'top', ...o });
    const glow = (s, x, y, w, h = 0, c = C.accent, wd = 1.25) => t.line(s, x, y, w, h, c, wd);
    const ring = (s, x, y, dd, c = C.accent, wd = 1.25) => t.oval(s, x, y, dd, dd, null, { line: { color: c, width: wd }, name: 'Ring' });
    const ic = async (s, it, x, y, z, c = C.accent) => t.img(s, await L.icon(it.icon, c, 1.75), x, y, z, z);
    const V = {
      image: [
        async (d) => { // the picture cut on a slant and lit in one colour, running off the top right
          const s = await slide('page');
          foot(s, 0.6, 3.4);
          t.img(s, await L.photo(L.src(d.image), 6.1, 5.625, { duo, mask: { poly: [[0.24, 0], [1, 0], [1, 1], [0, 1]] } }), 3.9, 0, 6.1, 5.625, { alt: '' });
          k.head(s, d.title, 0.6, 0.45, 4.1, 1.15, { max: 24, min: 14, color: C.titleInk, valign: 'top' });
          p(s, d.text, 0.6, 1.7, 3.55, 3.45, { max: 12.5, ls: 1.15 });
          k.txt(s, String(k.idx).padStart(2, '0'), 8.4, 0.3, 1.0, 0.45, { size: 22, bold: true, font: F.head, color: BG, align: 'right', valign: 'top', ls: 1 });
        },
        async (d) => { // a round picture with a second ring of light slipping off it
          const s = await open(d, 5.0, 0.3, 3.4, 1.3, { max: 22, valign: 'bottom' });
          await k.photo(s, d.image, 0.45, 0.65, 4.2, 4.2, { mask: 'circle' });
          ring(s, 0.7, 0.45, 4.2);
          ring(s, 0.2, 1.0, 4.2, VI, 0.75);
          p(s, d.text, 5.0, 1.75, 4.4, 3.4, { max: 13, ls: 1.2 });
        },
        async (d) => { // the picture fills the screen, deep in fog; the words rise from the bottom
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.img(s, await L.scrim(BG, 0.3, 0.97), 0, 0, 10, 5.625);
          nb(s, 8.4, 0.3);
          k.head(s, d.title, 0.6, 1.85, 8.8, 0.8, { max: 28, min: 15, color: 'FFFFFF', valign: 'bottom' });
          glow(s, 0.6, 2.75, 1.4);
          k.txt(s, d.text, 0.6, 2.87, 8.8, 2.3, { max: 13.5, min: 10, color: 'FFFFFF', ls: 1.2 });
          k.foot(s, { x: 0.6, w: 8.8, y: 5.3, size: 7.5, color: 'E6DEFA' });
        },
        async (d) => { // the picture across the top, sliced into bands of unequal width like a bad signal
          const s = await open({}, 0, 0, 0, 0);
          t.img(s, await L.photo(L.src(d.image), 10, 2.75, { mask: { path: 'M0,0 H0.17 V1 H0 Z M0.185,0 H0.3 V1 H0.185 Z M0.315,0 H0.56 V1 H0.315 Z M0.575,0 H0.645 V1 H0.575 Z M0.66,0 H0.88 V1 H0.66 Z M0.895,0 H1 V1 H0.895 Z' } }), 0, 0, 10, 2.75, { alt: '' });
          k.head(s, d.title, 0.6, 2.95, 3.1, 2.15, { max: 22, min: 13, color: C.titleInk, valign: 'top' });
          p(s, d.text, 3.95, 2.95, 5.45, 2.2, { max: 13, ls: 1.15 });
        },
      ],
      cards: [
        async (d) => { // the split as it is: a numeral, a name and the words at a size that reads
          const s = await page(d), n = d.items.length, hh = 4.6 / n;
          d.items.forEach((it, i) => {
            const y = 0.45 + i * hh;
            k.head(s, String(i + 1).padStart(2, '0'), 4.15, y, 0.7, 0.36, { max: 18, color: C.accent, valign: 'top' });
            h3(s, it.h, 4.85, y + 0.02, 4.55, 0.3, { max: 14 });
            p(s, it.t, 4.85, y + 0.34, 4.55, hh - 0.42, { max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // falling down a slant across the whole page, the icons in the light
          const s = await open(d), n = d.items.length, hh = 3.8 / n, dx = n === 4 ? 0.85 : 1.25, w = 6.0;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * dx, y = 1.35 + i * hh, z = Math.min(0.42, hh - 0.2);
            await ic(s, it, x, y + 0.02, z);
            h3(s, it.h, x + z + 0.15, y, w - z - 0.15, 0.28, { max: 14 });
            p(s, it.t, x + z + 0.15, y + 0.3, w - z - 0.15, hh - 0.36, { max: 12, min: 10, ls: 1.1 });
          }
        },
        async (d) => { // title at the side as always, the items in two columns that slide past each other
          const s = await page(d), w = 2.5, gap = 0.25, n = d.items.length, hh = 2.1;
          for (const [i, it] of d.items.entries()) {
            const col = i % 2, x = 4.15 + col * (w + gap), y = (col ? 1.0 : 0.5) + Math.floor(i / 2) * (hh + 0.02) + (n === 3 && col ? 0.55 : 0);
            await ic(s, it, x, y, 0.36);
            h3(s, it.h, x, y + 0.42, w, 0.3, { max: 13 });
            p(s, it.t, x, y + 0.72, w, hh - 0.78, { max: 12, min: 10, ls: 1.08 });
          }
        },
        async (d) => { // the title held in a ring of light, the items bending round it
          const s = await open({}), n = d.items.length, cx = 2.25, cy = 2.75, rr = 1.72, R2 = 2.35, hh = 4.6 / n;
          ring(s, cx - rr, cy - rr, rr * 2);
          k.head(s, d.title, cx - 1.3, cy - 1.15, 2.6, 2.3, { max: 22, min: 13, color: C.titleInk, align: 'center' });
          for (const [i, it] of d.items.entries()) {
            const y = 0.55 + i * hh, my = y + hh / 2 - 0.1, off = Math.sqrt(Math.max(0, R2 * R2 - (my - cy) * (my - cy))), x = cx + off + 0.25, z = 0.34;
            await ic(s, it, x, y + 0.04, z);
            h3(s, it.h, x + z + 0.12, y + 0.02, 9.4 - x - z - 0.12, 0.28, { max: 13.5 });
            p(s, it.t, x + z + 0.12, y + 0.32, 9.4 - x - z - 0.12, hh - 0.38, { max: 12, min: 10, ls: 1.08 });
          }
        },
        async (d) => { // wide columns over the whole page, each under a line of a different length
          const s = await open(d), n = d.items.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            glow(s, x, 1.55, w * (0.35 + 0.65 * ((i + 1) / n)), 0, i % 2 ? VI : C.accent, 2);
            await ic(s, it, x, 1.72, 0.5, i % 2 ? VI : C.accent);
            h3(s, it.h, x, 2.32, w, 0.55, { max: 15 });
            p(s, it.t, x, 2.88, w, 2.25, { max: 13, min: 10, ls: 1.12 });
          }
        },
      ],
      process: [
        async (d) => { // one straight beam climbing the page, a step hanging under each point of light
          const s = await open(d, 0.6, 0.3, 6.2, 1.0), n = d.steps.length, dx = n === 4 ? 2.25 : 3.0, dy = n === 4 ? 0.62 : 0.85, w = dx - 0.2, y0 = 3.2, x0 = 0.6;
          const sl = dy / dx, yR = y0 - (10 - x0) * sl; t.line(s, 0, yR, 10, 10 * sl, C.accent, 1.25, { flipV: true });
          d.steps.forEach((st, i) => {
            const x = x0 + i * dx, y = y0 - i * dy;
            t.oval(s, x - 0.07, y - 0.07, 0.14, 0.14, C.accent);
            k.head(s, String(i + 1), x + 0.05, y + 0.1, 0.4, 0.32, { max: 17, color: C.accent, valign: 'top' });
            h3(s, st.h, x + 0.42, y + 0.12, w - 0.42, 0.32, { max: 12.5 });
            p(s, st.t, x + 0.05, y + 0.46, w - 0.05, n === 4 ? 1.45 : 1.3, { max: 12, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // rings that grow from step to step, the words beneath them
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), dd = 0.62 + i * (0.6 / (n - 1)), cy = 2.0;
            ring(s, x, cy - dd / 2, dd, i % 2 ? VI : C.accent);
            k.head(s, String(i + 1), x, cy - dd / 2, dd, dd, { max: 18 + i * 3, color: C.titleInk, align: 'center' });
            h3(s, st.h, x, 2.72, w, 0.5, { max: 13.5 });
            p(s, st.t, x, 3.24, w, 1.9, { max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // the split turned round: the steps at the left, the title large at the right in the cold light
          const s = await slide('page'), n = d.steps.length, hh = 4.6 / n;
          k.head(s, d.title, 6.5, 0.55, 2.9, 3.2, { max: 30, min: 14, color: C.titleInk, align: 'right', valign: 'top' });
          nb(s, 8.4, 4.1, 'right', 32); foot(s, 0.6, 5.3);
          d.steps.forEach((st, i) => {
            const y = 0.5 + i * hh;
            k.head(s, String(i + 1), 0.6, y, 0.7, 0.72, { max: 36, color: i % 2 ? VI : C.accent, valign: 'top' });
            h3(s, st.h, 1.3, y + 0.03, 4.8, 0.3);
            p(s, st.t, 1.3, y + 0.34, 4.8, hh - 0.42, { max: 12.5, min: 10, ls: 1.1 });
          });
          glow(s, 6.3, 0.55, 0, 4.55, VI, 0.75);
        },
        async (d) => { // a filament down the middle, the steps lit on either side of it in turn
          const s = await open(d), n = d.steps.length, bh = n === 4 ? 1.32 : 1.5, dy = (3.75 - bh) / (n - 1), cx = 5, w = 4.0;
          glow(s, cx, 1.38, 0, 3.75);
          d.steps.forEach((st, i) => {
            const y = 1.36 + i * dy, r = i % 2 === 1, x = r ? cx + 0.28 : cx - 0.28 - w, al = r ? 'left' : 'right';
            t.oval(s, cx - 0.07, y + 0.07, 0.14, 0.14, r ? VI : C.accent);
            h3(s, `${i + 1}  ${st.h}`, x, y + 0.02, w, 0.3, { align: al, max: 13.5, color: r ? VI : C.accent });
            p(s, st.t, x, y + 0.33, w, bh - 0.35, { max: 12.5, min: 10, ls: 1.08, align: al });
          });
        },
      ],
      stats: [
        async (d) => { // three figures falling down a slant, each trailing its words
          const s = await open(d), rh = d.note ? 0.82 : 1.15, dx = 1.1;
          d.stats.forEach((v, i) => {
            const x = 0.6 + i * dx, y = 1.35 + i * rh;
            k.head(s, v.value, x, y, 2.9, rh - 0.05, { max: 38, min: 16, color: i % 2 ? VI : C.accent, valign: 'middle' });
            p(s, v.label, x + 3.0, y, 8.8 - i * dx - 3.0 , rh - 0.05, { max: 13.5, min: 10, valign: 'middle', ls: 1.08 });
          });
          if (d.note) p(s, d.note, 0.6, 1.35 + 3 * rh + 0.03, 8.8, 5.15 - (1.35 + 3 * rh + 0.03), { max: 11, min: 9.5, color: C.muted, ls: 1.05 });
        },
        async (d) => { // one figure lights the room; the other two are small in the corner of it
          const s = await open(d), [a, ...rest] = d.stats;
          k.head(s, a.value, 0.6, 1.35, 8.8, 1.95, { max: 120, min: 40, color: C.accent, align: 'center', valign: 'middle' });
          p(s, a.label, 0.6, 3.38, 3.2, 0.72, { max: 13.5, min: 10.5, ls: 1.08 });
          if (d.note) p(s, d.note, 0.6, 4.12, 3.2, 1.03, { max: 10.5, min: 9.5, color: C.muted, ls: 1.03 });
          rest.forEach((v, i) => {
            const y = 3.38 + i * 0.86;
            k.head(s, v.value, 4.0, y, 1.9, 0.78, { max: 24, min: 12, color: VI, valign: 'top' });
            p(s, v.label, 5.9, y + 0.02, 3.5, 0.78, { max: 12, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // three rings of light, a figure in each; the words under them
          const s = await open(d), dd = 2.05, gap = 0.9;
          d.stats.forEach((v, i) => {
            const x = 0.95 + i * (dd + gap), y = 1.3;
            ring(s, x, y, dd, i === 1 ? VI : C.accent);
            k.head(s, v.value, x + 0.1, y + 0.45, dd - 0.2, dd - 0.9, { max: 34, min: 14, color: C.titleInk, align: 'center' });
            p(s, v.label, x - 0.35, y + dd + 0.06, dd + 0.7, 0.62, { max: 12, min: 10, align: 'center', ls: 1.05 });
          });
          if (d.note) p(s, d.note, 0.9, 4.1, 8.2, 1.05, { max: 11, min: 9.5, align: 'center', color: C.muted, ls: 1.05 });
        },
      ],
      compare: [
        async (d) => { // the two colours of light, either side of a filament, mirrored
          const s = await open(d), w = 4.0, cx = 5, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 3.0);
          k.head(s, d.left.h, cx - 0.3 - w, 1.32, w, 0.6, { max: 20, min: 13, color: C.accent, align: 'right', valign: 'top' });
          k.head(s, d.right.h, cx + 0.3, 1.32, w, 0.6, { max: 20, min: 13, color: VI, valign: 'top' });
          glow(s, cx, 1.38, 0, 3.75);
          let y = 2.02;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.3 - w, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // the title at the side, the two lists stacked on the right, one light above the other
          const s = await page(d), hh = 2.28;
          [d.left, d.right].forEach((side, i) => {
            const y = 0.5 + i * hh, c = i ? VI : C.accent;
            glow(s, 4.15, y + 0.04, 0, hh - 0.2, c, 2);
            k.head(s, side.h, 4.32, y, 5.05, 0.38, { max: 16, min: 12, color: c, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 4.32 + (j % 2) * 2.6, y + 0.42 + Math.floor(j / 2) * 0.84, 2.45, 0.8, { max: 12, min: 10, ls: 1.05 }));
          });
        },
      ],
      statement: [
        async (d) => { // the sentence low across the whole dark, the first light over it; title and note small above
          const s = await open(d, 0.6, 0.3, 2.9, 1.3, { max: 14, min: 11, color: C.accent, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.65, 0.3, 4.6, 1.3, { max: 11, min: 9.5, color: C.muted, ls: 1.05 });
          glow(s, 0.6, 1.72, 8.8, 0, C.accent, 1.25);
          k.head(s, L.runs(d.text), 0.6, 1.82, 8.8, 3.3, { max: 40, min: 18, color: 'FFFFFF', valign: 'bottom' });
        },
        async (d) => { // held between two tall filaments in the middle of the page
          const s = await open(d, 1.5, 0.25, 7.0, 0.6, { max: 14, min: 11, color: VI, align: 'center' });
          glow(s, 0.85, 1.0, 0, 4.1, C.accent, 2); glow(s, 9.15, 1.0, 0, 4.1, VI, 2);
          k.head(s, L.runs(d.text), 1.2, 1.0, 7.6, 2.65, { max: 32, min: 16, color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (d.caption) p(s, d.caption, 1.6, 3.75, 6.8, 1.35, { max: 12, min: 10, color: C.ink, align: 'center', ls: 1.08 });
        },
      ],
      timeline: [
        async (d) => { // a beam across, years lit on it, events above and below in turn
          const s = await open(d), ly = 3.22, w = 3.3, xs = [0.6, 2.5, 4.45, 6.1];
          glow(s, 0, ly, 10);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.36 : ly + 0.12, c = up ? C.accent : VI;
            t.oval(s, x, ly - 0.06, 0.12, 0.12, c);
            k.head(s, it.year, x, y, w, 0.34, { max: 17, min: 12, color: c, valign: 'top' });
            h3(s, it.h, x, y + 0.34, w, 0.27, { max: 12.5 });
            p(s, it.t, x, y + 0.62, w, ly - 1.36 - 0.72, { max: 11.5, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // the split kept: the words of each row at the left of its column, the year large against the right edge
          const s = await page(d), hh = 4.6 / 4;
          d.items.forEach((it, i) => {
            const y = 0.45 + i * hh;
            k.head(s, it.year, 7.5, y, 1.9, hh - 0.08, { max: 34, min: 14, color: i % 2 ? VI : C.accent, align: 'right', valign: 'middle' });
            h3(s, it.h, 4.15, y + 0.03, 3.25, 0.28, { max: 13 });
            p(s, it.t, 4.15, y + 0.32, 3.25, hh - 0.36, { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // four windows at uneven heights across the page, the year glowing at the head of each
          const s = await open(d), w = 2.05, gap = 0.2, dy = [0.38, 0, 0.38, 0];
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), y = 1.38 + dy[i], c = i % 2 ? VI : C.accent;
            glow(s, x, y, 0, 5.12 - y, c, 1.5);
            k.head(s, it.year, x + 0.12, y - 0.03, w - 0.12, 0.42, { max: 19, min: 12, color: c, valign: 'top' });
            h3(s, it.h, x + 0.12, y + 0.4, w - 0.12, 0.5, { max: 12.5 });
            p(s, it.t, x + 0.12, y + 0.92, w - 0.12, 5.14 - y - 0.92, { max: 12, min: 10, ls: 1.05 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.stats = V.stats.shift(); R.cards = V.cards.shift(); // nor the first steps, years and figures the rows of the cards; the old rows set their words too small
    return V;
  },
  tone: "zamonaviy va jasur: yangi g'oyalar, dinamik ifoda" });
