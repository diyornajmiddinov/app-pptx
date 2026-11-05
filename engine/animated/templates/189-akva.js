/** 189 Akva — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 189, slug: 'akva', name: "Akva", mode: 'center', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '0E3B43', muted: '4C7178', accent: '0E9AA7' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => (kind === 'deep' ? compose(lin([[0,'0B4A55'],[1,'0E3B43']]), rad(800,450,800,[[0,'14707D',0.55],[1,'0E3B43',0]])) : compose(flat('E6FAF8'), rad(800,450,kind==='cover'?700:900,[[0,'B5EFEA',0.9],[1,'E6FAF8',0]]))),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in clear water: ripples, floating bubbles, a wave for a rule, a river down the page, one deep-water page: a deck's pages must not look alike (L.pages)
    const DEEP = '0B6E7A', PALE = 'D6F5F2', WH = 'FFFFFF';
    const foot = (s, c = C.muted, x = 1.0, w = 8.0, al = 'center') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align: al });
    const open = async (kind, d, o = {}) => { const s = await slide(kind), { x = 1.0, y = 0.3, w = 8.0, h = 0.9, c = C.ink, fc = C.muted, ...rest } = o; if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 14, color: c, align: 'center', valign: 'middle', ...rest }); num(s); foot(s, fc); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, valign: 'top', ...o });
    const ic = async (s, it, x, y, z, c = DEEP) => t.img(s, await L.icon(it.icon, c, 1.75), x, y, z, z);
    const ring = (s, x, y, dd, c = C.accent, wd = 0.75, tr = 0) => t.oval(s, x, y, dd, dd, null, { line: { color: c, width: wd, ...(tr ? { transparency: tr } : {}) }, name: 'Ripple' });
    const sine = (W, H, cyc, ph = 0, n = 120) => Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${((i / n) * W).toFixed(1)},${(H / 2 + (H / 2 - 3) * Math.sin(ph + (i / n) * cyc * 2 * Math.PI)).toFixed(1)}`).join(' ');
    const wave = async (s, x, y, w, c = C.accent, h = 0.14, cyc = 0, sw = 2.5) => { const Wp = Math.round(w * 160), Hp = Math.round(h * 160), cy = cyc || w * 1.1; t.img(s, await k.svg(`w${w}${h}${c}${cy}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${Wp}" height="${Hp}"><path d="${sine(Wp, Hp, cy)}" fill="none" stroke="#${c}" stroke-width="${sw}"/></svg>`, Wp, Hp), x, y, w, h, { alt: '' }); };
    const wavePath = (() => { const pts = Array.from({ length: 61 }, (_, i) => `L${(i / 60).toFixed(4)},${(0.9 + 0.08 * Math.sin((i / 60) * 2 * Math.PI * 2.5)).toFixed(4)}`).join(' '); return `M0,0 H1 ${pts.split(' ').reverse().join(' ')} Z`; })();
    const river = async (s, cx, y, h, c = C.accent, amp = 0.22, cyc = 1.5) => { const Wp = Math.round(amp * 2 * 160) + 8, Hp = Math.round(h * 160); const d = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${(Wp / 2 + (Wp / 2 - 4) * Math.sin((i / 120) * cyc * 2 * Math.PI)).toFixed(1)},${((i / 120) * Hp).toFixed(1)}`).join(' '); t.img(s, await k.svg(`r${h}${c}${cyc}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${Wp}" height="${Hp}"><path d="${d}" fill="none" stroke="#${c}" stroke-width="3"/></svg>`, Wp, Hp), cx - Wp / 320, y, Wp / 160, h, { alt: '' }); };
    const V = {
      image: [
        async (d) => { // the picture hangs from the top of the page, its lower edge a slow wave
          const s = await open('page', {});
          t.img(s, await L.photo(L.src(d.image), 10, 2.85, { mask: { path: wavePath } }), 0, 0, 10, 2.85, { alt: '' });
          k.head(s, d.title, 1.0, 2.85, 8.0, 0.68, { max: 22, min: 13, color: C.ink, align: 'center' });
          p(s, d.text, 1.1, 3.55, 7.8, 1.68, { max: 12.5, ls: 1.1, align: 'center' });
        },
        async (d) => { // a round picture dropped into still water, ripples going out from it
          const s = await slide('page'), cx = 3.0, cy = 2.8, dd = 3.5;
          [3.95, 4.45, 4.95].forEach((D, i) => ring(s, cx - D / 2, cy - D / 2, D, C.accent, 0.75, 25 + i * 22));
          await k.photo(s, d.image, cx - dd / 2, cy - dd / 2, dd, dd, { mask: 'circle' });
          num(s); foot(s, C.muted, 5.5, 3.9);
          k.head(s, d.title, 5.5, 0.55, 3.9, 1.1, { max: 22, min: 13, color: C.ink, align: 'center', valign: 'bottom' });
          await wave(s, 6.75, 1.75, 1.4);
          p(s, d.text, 5.5, 1.98, 3.9, 3.15, { max: 12.5, ls: 1.14, align: 'center' });
        },
        async (d) => { // three bubbles rising, one picture seen through them all
          const s = await open('page', d, { x: 0.7, w: 4.3, y: 0.35, h: 1.1, max: 22, align: 'left', valign: 'bottom' });
          const c3 = (cx, cy, r) => `M${cx - r},${cy} a${r},${r * 15 / 16} 0 1,0 ${2 * r},0 a${r},${r * 15 / 16} 0 1,0 ${-2 * r},0 Z`; // the box is 4.5 x 4.8, so r is scaled to stay round
          t.img(s, await L.photo(L.src(d.image), 4.5, 4.8, { mask: { path: `${c3(0.31, 0.68, 0.3)} ${c3(0.79, 0.47, 0.2)} ${c3(0.5, 0.16, 0.14)}` } }), 5.2, 0.35, 4.5, 4.8, { alt: '' });
          p(s, d.text, 0.7, 1.6, 4.3, 3.55, { max: 13, ls: 1.18 });
        },
        async (d) => { // the page is all picture, a clear pane rounded like a lens of water in the middle
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          foot(s);
          t.rect(s, 1.6, 0.5, 6.8, 4.2, 'E6FAF8', { t: 5, r: 0.25, name: 'Pane' });
          k.head(s, d.title, 2.0, 0.68, 6.0, 0.88, { max: 20, min: 13, color: C.ink, align: 'center' });
          k.txt(s, String(k.idx).padStart(2, '0'), 7.5, 0.6, 0.65, 0.26, { size: 9, color: C.muted, align: 'right' });
          p(s, d.text, 2.0, 1.62, 6.0, 2.95, { max: 13, align: 'center' });
        },
      ],
      cards: [
        async (d) => { // each item a droplet: icon in a ring, words poured under it
          const s = await open('page', d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), cx = x + w / 2;
            ring(s, cx - 0.36, 1.3, 0.72, C.accent, 1);
            await ic(s, it, cx - 0.17, 1.49, 0.34);
            h3(s, it.h, x, 2.1, w, 0.52, { align: 'center' });
            p(s, it.t, x, 2.62, w, 2.5, { max: 12.5, min: 10, ls: 1.12, align: 'center' });
          }
        },
        async (d) => { // long calm rows, a wave drawn under each
          const s = await open('page', d), n = d.items.length, hh = 3.85 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.28 + i * hh;
            await ic(s, it, 1.0, y + 0.08, 0.5);
            h3(s, it.h, 1.7, y + 0.05, 7.3, 0.28, { max: 14.5 });
            p(s, it.t, 1.7, y + 0.34, 7.3, hh - 0.52, { max: 12.5, min: 10, ls: 1.08 });
            if (i < n - 1) await wave(s, 3.5, y + hh - 0.14, 3.0, C.accent, 0.1);
          }
        },
        async (d) => { // the title in a ring at the centre, the items gathered about it like drops
          const s = await slide('page'), n = d.items.length, dd = 2.3, cx = 5, cy = 2.7, w = 3.05;
          ring(s, cx - dd / 2, cy - dd / 2, dd, C.accent, 1.25); ring(s, cx - dd / 2 - 0.15, cy - dd / 2 - 0.15, dd + 0.3, C.accent, 0.5, 50);
          k.head(s, d.title, cx - 0.95, cy - 0.85, 1.9, 1.7, { max: 16, min: 11, color: C.ink, align: 'center' });
          num(s); foot(s);
          const pos = n === 4 ? [[0.5, 0.4, 'right'], [6.45, 0.4, 'left'], [0.5, 3.0, 'right'], [6.45, 3.0, 'left']] : [[0.5, 0.75, 'right'], [6.45, 0.75, 'left'], [3.0, 4.0, 'center']];
          for (const [i, it] of d.items.entries()) {
            const [x, y, al] = pos[i], wide = al === 'center', ww = wide ? 4.0 : w;
            if (wide) { await ic(s, it, x + 0.1, y - 0.02, 0.32); h3(s, it.h, x + 0.5, y, ww - 0.5, 0.3, { max: 13 }); p(s, it.t, x, y + 0.32, ww, 0.9, { max: 11, min: 10, ls: 1.03, align: 'center' }); continue; }
            await ic(s, it, al === 'right' ? x + ww - 0.36 : x, y, 0.36);
            h3(s, it.h, x, y + 0.42, ww, 0.3, { align: al, max: 13 });
            p(s, it.t, x, y + 0.72, ww, (n === 4 ? 1.35 : 2.2), { max: 12, min: 10, ls: 1.06, align: al });
          }
        },
        async (d) => { // floating: columns at different heights, as if on a swell
          const s = await open('page', d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, ys = n === 3 ? [0.45, 0, 0.45] : [0.5, 0, 0.5, 0];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.32 + ys[i];
            await ic(s, it, x, y, 0.38);
            h3(s, it.h, x, y + 0.46, w, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 0.98, w, 5.13 - y - 0.98, { max: 12, min: 10, ls: 1.08 });
          }
          await wave(s, 0, 1.2, 10, C.accent, 0.1, 9, 2);
        },
        async (d) => { // two banks and a current: items set toward the middle line from either side
          const s = await open('page', d), n = d.items.length, w = 3.95, cx = 5, rh = n === 3 ? 1.9 : 1.93;
          await river(s, cx, 1.28, 3.85);
          for (const [i, it] of d.items.entries()) {
            const row = Math.floor(i / 2), r = i % 2 === 1, x = r ? cx + 0.4 : cx - 0.4 - w, al = r ? 'left' : 'right', y = 1.3 + row * rh;
            await ic(s, it, r ? x : x + w - 0.36, y, 0.36);
            h3(s, it.h, r ? x + 0.46 : x, y + 0.03, w - 0.46, 0.34, { align: al, valign: 'middle' });
            p(s, it.t, x, y + 0.44, w, rh - 0.54, { max: 12.5, min: 10, ls: 1.08, align: al });
          }
        },
      ],
      process: [
        async (d) => { // a river winding down the page, a step on each bend
          const s = await open('page', d), n = d.steps.length, bh = n === 4 ? 1.28 : 1.45, dy = (3.85 - bh) / (n - 1), cx = 5, w = 3.85;
          await river(s, cx, 1.28, 3.85, C.accent, 0.26, n / 2);
          d.steps.forEach((st, i) => {
            const y = 1.28 + i * dy, r = i % 2 === 1, x = r ? cx + 0.45 : cx - 0.45 - w, al = r ? 'left' : 'right';
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.3, { align: al, color: DEEP });
            p(s, st.t, x, y + 0.3, w, bh - 0.32, { max: 12, min: 10, ls: 1.06, align: al });
          });
        },
        async (d) => { // a long swell across the page; numbered floats on it, words beneath
          const s = await open('page', d), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          await wave(s, 0, 1.7, 10, C.accent, 0.3, 4, 2.5);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), cx = x + w / 2;
            t.oval(s, cx - 0.3, 1.55, 0.6, 0.6, C.ink);
            k.head(s, String(i + 1), cx - 0.3, 1.55, 0.6, 0.6, { max: 18, color: WH, align: 'center' });
            h3(s, st.h, x, 2.28, w, 0.5, { align: 'center' });
            p(s, st.t, x, 2.8, w, 2.33, { max: 12.5, min: 10, ls: 1.1, align: 'center' });
          });
        },
        async (d) => { // deep water: numbers surface at the left, the words drifting right of them
          const s = await open('deep', d, { c: WH, fc: PALE }), n = d.steps.length, hh = 3.85 / n;
          d.steps.forEach((st, i) => {
            const y = 1.28 + i * hh, zz = Math.min(0.62, hh - 0.2), x = 0.9 + i * (n === 4 ? 0.42 : 0.6);
            ring(s, x, y + 0.04, zz, '7FE7DC', 1);
            k.head(s, String(i + 1), x, y + 0.04, zz, zz, { max: 18, color: '7FE7DC', align: 'center' });
            h3(s, st.h, x + zz + 0.2, y + 0.02, 8.0, 0.28, { color: WH, max: 13.5 });
            p(s, st.t, x + zz + 0.2, y + 0.31, 9.3 - (x + zz + 0.2), hh - 0.38, { color: PALE, max: 12.5, min: 10, ls: 1.06 });
          });
        },
        async (d) => { // falling from level to level, each step spilling over into the next
          const s = await open('page', d), n = d.steps.length, w = n === 4 ? 3.3 : 3.8, dx = (8.8 - w) / (n - 1), dy = n === 4 ? 0.95 : 1.28;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * dx, y = 1.28 + i * dy;
            k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: DEEP } }, { text: st.h, options: { bold: true, color: C.ink } }], x, y, w, 0.28, { max: 13, min: 10.5, font: F.head });
            p(s, st.t, x, y + 0.29, w, dy - 0.32 > 1.05 ? 1.05 : dy - 0.32, { max: 11, min: 10, ls: 1.0 });
            if (i < n - 1) k.txt(s, '↓', x + w + 0.02, y + 0.55, 0.3, 0.34, { size: 15, bold: true, color: C.accent, align: 'center', valign: 'middle' });
          });
        },
      ],
      stats: [
        async (d) => { // one figure at the centre of its ripples, the two others on the edge of them
          const s = await open('page', d), [a, b, c] = d.stats, cx = 5, cy = 2.5;
          [2.45, 3.05, 3.65].forEach((D, i) => ring(s, cx - D / 2, cy - D / 2 + 0.1, D, C.accent, 0.75, 20 + i * 25));
          k.head(s, a.value, cx - 1.1, cy - 0.5, 2.2, 0.8, { max: 42, min: 18, color: DEEP, align: 'center' });
          p(s, a.label, cx - 0.95, cy + 0.32, 1.9, 0.62, { max: 10.5, min: 9.5, align: 'center', ls: 1.0 });
          [[b, 0.7, 'left'], [c, 7.2, 'right']].forEach(([v, x, al]) => {
            k.head(s, v.value, x, 1.72, 2.1, 0.66, { max: 28, min: 14, color: C.ink, align: al, valign: 'bottom' });
            p(s, v.label, x, 2.42, 2.1, 1.0, { max: 12, min: 10, align: al, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 1.3, 4.45, 7.4, 0.75, { max: 10, min: 9, align: 'center', color: C.muted, ls: 1.0 });
        },
        async (d) => { // figure left of the water line, words right of it, stacked like levels
          const s = await open('page', d), rh = d.note ? 0.88 : 1.2;
          await river(s, 4.35, 1.3, rh * 3 - 0.1, C.accent, 0.14, 2);
          d.stats.forEach((v, i) => {
            const y = 1.28 + i * rh;
            k.head(s, v.value, 0.7, y, 3.3, rh - 0.08, { max: 42, min: 16, color: DEEP, align: 'right', valign: 'middle' });
            p(s, v.label, 4.75, y, 4.5, rh - 0.08, { max: 14, min: 10, valign: 'middle', ls: 1.08 });
          });
          if (d.note) p(s, d.note, 1.0, 1.28 + 3 * rh + 0.03, 8.0, 5.2 - (1.28 + 3 * rh + 0.03), { max: 10.5, min: 9, align: 'center', color: C.muted, ls: 1.02 });
        },
      ],
      compare: [
        async (d) => { // two great drops side by side, a list in each
          const s = await open('page', d, { y: 0.15, h: 0.75 }), dd = 4.25, xs = [0.55, 5.2];
          [d.left, d.right].forEach((side, i) => {
            const x = xs[i], tx = x + 0.55, tw = dd - 1.1;
            ring(s, x, 0.95, dd, i ? C.ink : C.accent, 1.25);
            k.head(s, side.h, tx + 0.25, 1.2, tw - 0.5, 0.56, { max: 14.5, min: 11, color: i ? C.ink : DEEP, align: 'center' });
            const { rows, fs } = L.rowsFit([side.items], 14, tw, F.body, 0.08, 2.6);
            let y = 1.8 + Math.max(0, (2.6 - rows.reduce((a, b) => a + b, 0)) / 2);
            side.items.forEach((it, j) => { k.txt(s, it, tx, y, tw, rows[j], { size: fs, color: C.ink, align: 'center' }); y += rows[j]; });
          });
        },
        async (d) => { // one side over the other, parted by a long wave; each list spread across
          const s = await open('page', d), hh = 1.8;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.25 + i * (hh + 0.2), n = side.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
            k.head(s, side.h, 1.0, y, 8.0, 0.36, { max: 16, min: 12, color: i ? C.ink : DEEP, align: 'center', valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 0.6 + j * (w + gap), y + 0.42, w, hh - 0.48, { max: 12.5, min: 10, ls: 1.06, align: 'center' }));
          }
          await wave(s, 0, 3.08, 10, C.accent, 0.14, 8);
        },
      ],
      statement: [
        async (d) => { // the sentence lies in the water, ripples spreading from one corner behind it
          const s = await open('page', d, { y: 0.25, h: 0.65, max: 15, min: 11, c: DEEP });
          [2.2, 3.6, 5.0, 6.4].forEach((D, i) => ring(s, 8.2 - D / 2, 4.1 - D / 2, D, C.accent, 0.75, 45 + i * 12));
          k.head(s, L.runs(d.text), 1.1, 1.0, 7.8, 2.6, { max: 32, min: 16, color: C.ink, align: 'center' });
          if (d.caption) p(s, d.caption, 1.5, 3.68, 7.0, 1.45, { max: 12, min: 10, align: 'center', ls: 1.08 });
        },
        async (d) => { // deep water: pale words, the note under a wave
          const s = await open('deep', d, { y: 0.25, h: 0.65, max: 15, min: 11, c: '7FE7DC', fc: PALE });
          k.head(s, L.runs(d.text), 0.7, 0.95, 8.6, 2.5, { max: 36, min: 18, color: WH, align: 'center' });
          await wave(s, 3.2, 3.52, 3.6, '7FE7DC');
          if (d.caption) p(s, d.caption, 1.4, 3.78, 7.2, 1.38, { max: 12, min: 10, color: PALE, align: 'center', ls: 1.06 });
        },
      ],
      timeline: [
        async (d) => { // a swell through the middle of the page, events above and below it in turn
          const s = await open('page', d), ly = 3.1, w = 3.3, xs = [0.6, 2.5, 4.45, 6.1];
          await wave(s, 0, ly - 0.09, 10, C.accent, 0.18, 7);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.25 : ly + 0.17;
            k.head(s, it.year, x, y, w, 0.32, { max: 16, min: 12, color: DEEP, valign: 'top' });
            h3(s, it.h, x, y + 0.32, w, 0.26, { max: 12 });
            p(s, it.t, x, y + 0.58, w, (up ? ly - 0.15 - y - 0.58 : 5.15 - y - 0.58), { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // each year a bubble rising: lowest at the left, highest at the right
          const s = await open('page', d, { align: 'left', x: 0.6, w: 7.5, y: 0.25, h: 0.8 }), w = 2.1, gap = 0.13, ys = [1.85, 1.55, 1.27, 1.05];
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), y = ys[i], dd = 1.08;
            ring(s, x + (w - dd) / 2, y, dd, C.accent, 1);
            k.head(s, it.year, x + (w - dd) / 2 + 0.03, y + 0.27, dd - 0.06, dd - 0.54, { max: 14, min: 9.5, color: DEEP, align: 'center' });
            h3(s, it.h, x, y + dd + 0.05, w, 0.27, { max: 12, align: 'center' });
            p(s, it.t, x, y + dd + 0.33, w, 5.15 - y - dd - 0.33, { max: 11, min: 10, ls: 1.02, align: 'center' });
          });
        },
        async (d) => { // the years on the middle line, name to the left, words to the right, a wave beneath each
          const s = await open('page', d), hh = 3.85 / 4;
          for (const [i, it] of d.items.entries()) {
            const y = 1.28 + i * hh;
            h3(s, it.h, 0.6, y, 2.75, hh - 0.14, { align: 'right', valign: 'middle', max: 13 });
            k.head(s, it.year, 3.45, y, 1.6, hh - 0.14, { max: 16, min: 11, color: DEEP, align: 'center', valign: 'middle' });
            p(s, it.t, 5.15, y, 4.25, hh - 0.08, { max: 11.5, min: 10, ls: 1.03, valign: 'middle' });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.cards = V.cards.shift(); // nor the first steps and years the columns of the cards; the old four-row cards set their words too small
    return V;
  },
  tone: "tiniq va yengil: sodda, oqimli tushuntirish" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["p14:ripple", "fade", "dissolve"], "cover": ["riseWords", "fadeWords"], "mark": "curveUp", "deco": "riseUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "curveUp", "image": "circle", "number": "curveUp", "order": "seq", "stagger": 0.22}, "tempo": 1.25, "kenburns": true};
