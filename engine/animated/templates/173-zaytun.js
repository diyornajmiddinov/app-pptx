/** 173 Zaytun — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 173, slug: 'zaytun', name: "Zaytun", mode: 'left', list: 'rows', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: 'F3EEDB', muted: 'C9C3A6', accent: 'E3C565' }, photo: { r: 0.06 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('4B5132'), grain(0.09)),
  // an olive grove kept like a farm ledger: orchard rows, terraces, a trunk with branches, steady rules, olives for pictures
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x, y, w, h, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: TI, valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.22, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, valign: 'top', ...o });
    const rule = (s, x, y, w, h = 0, wt = 0.5) => t.line(s, x, y, w, h, C.accent, wt);
    const V = {
      image: [
        async (d) => { // the ground: a band of picture along the foot of the page, the writing above it like a terrace
          const s = await open(d, 0.7, 0.45, 3.1, 2.35, { max: 26, valign: 'top' });
          p(s, d.text, 4.05, 0.5, 5.2, 2.5, { max: 13 });
          await k.photo(s, d.image, 0, 3.12, 10, 2.08);
        },
        async (d) => { // one great olive: the picture in an upright oval
          const s = await open(d, 4.3, 0.5, 5.0, 1.05);
          await k.photo(s, d.image, 0.7, 0.42, 3.15, 4.72, { mask: 'circle' });
          rule(s, 4.3, 1.62, 5.0);
          p(s, d.text, 4.3, 1.75, 5.0, 3.38);
        },
        async (d) => { // a row of trees: one picture seen through four upright pills
          const s = await open(d, 0.7, 0.45, 3.6, 1.15);
          await k.photo(s, d.image, 4.65, 0.55, 4.65, 4.55, { mask: { path: 'M0,0.11 A0.11,0.11 0 0 1 0.22,0.11 V0.89 A0.11,0.11 0 0 1 0,0.89 Z M0.26,0.11 A0.11,0.11 0 0 1 0.48,0.11 V0.89 A0.11,0.11 0 0 1 0.26,0.89 Z M0.52,0.11 A0.11,0.11 0 0 1 0.74,0.11 V0.89 A0.11,0.11 0 0 1 0.52,0.89 Z M0.78,0.11 A0.11,0.11 0 0 1 1,0.11 V0.89 A0.11,0.11 0 0 1 0.78,0.89 Z' } });
          rule(s, 0.7, 1.68, 3.6);
          p(s, d.text, 0.7, 1.8, 3.6, 3.33);
        },
        async (d) => { // the whole picture, an olive page laid over its left side
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 0, 0, 5.5, 5.2, '4B5132', { name: 'Page' });
          k.head(s, d.title, 0.7, 0.45, 4.3, 1.1, { max: 24, min: 13, color: TI, valign: 'bottom' });
          k.txt(s, String(k.idx).padStart(2, '0'), 4.75, 0.14, 0.6, 0.25, { size: 9, color: C.muted, align: 'right' });
          rule(s, 0.7, 1.63, 4.3);
          p(s, d.text, 0.7, 1.75, 4.45, 3.35, { max: 14 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // the ledger's columns, a firm rule over each, the icon at its corner
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            rule(s, x, 1.6, w, 0, 1.5);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, 1.72, 0.38, 0.38);
            h3(s, it.h, x, 2.2, w, 0.55);
            p(s, it.t, x, 2.78, w, 2.34, { max: 13.5 });
          }
        },
        async (d) => { // the plot divided in four by a cross of rules; a third plot takes the whole lower half
          const s = await page(d), n = d.items.length, w = 4.05;
          rule(s, 0.7, 3.32, 8.6); rule(s, 5, 1.55, 0, n === 3 ? 1.65 : 3.55);
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, x = i % 2 ? 5.25 : 0.7, y = i < 2 ? 1.5 : 3.42, ww = whole ? 8.6 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y + 0.02, 0.32, 0.32);
            h3(s, it.h, x + 0.42, y, ww - 0.42, 0.36, { valign: 'middle' });
            p(s, it.t, x, y + 0.4, ww, 1.34, { max: 13 });
          }
        },
        async (d) => { // the title stands alone as a tree on the left, the items are its branches
          const s = await open(d, 0.7, 0.5, 3.0, 2.5, { max: 32, valign: 'top' }), n = d.items.length, H = 4.6 / n;
          rule(s, 4.0, 0.55, 0, 4.55, 1);
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * H;
            rule(s, 4.0, y + 0.18, 0.25, 0, 1);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), 4.3, y, 0.34, 0.34);
            h3(s, it.h, 4.75, y, 4.55, 0.36, { valign: 'middle' });
            p(s, it.t, 4.75, y + 0.38, 4.55, H - 0.44, { max: 13.5 });
          }
        },
        async (d) => { // the crown of a tree: one on top, then two, then one
          const s = await page(d), n = d.items.length, w = 3.95, H = n === 4 ? 1.2 : 1.8, at = n === 4 ? [[3.0, 0], [0.7, 1], [5.35, 1], [3.0, 2]] : [[3.0, 0], [0.7, 1], [5.35, 1]];
          at.forEach(([x, r], i) => {
            const it = d.items[i], y = 1.48 + r * H;
            h3(s, it.h, x, y, w, 0.3, { align: 'center', valign: 'middle', max: 14 });
            p(s, it.t, x, y + 0.31, w, H - 0.35, { align: 'center', max: 13 });
          });
        },
      ],
      process: [
        async (d) => { // a long rule with a tick where each stage begins, numerals under the ticks
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ly = 1.6;
          rule(s, 0.7, ly, 8.6, 0, 1);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            rule(s, x, ly - 0.08, 0, 0.16, 1);
            fig(s, String(i + 1), x, ly + 0.08, w, 0.72, { max: 38 });
            h3(s, st.h, x, ly + 0.82, w, 0.52);
            p(s, st.t, x, ly + 1.36, w, 5.12 - ly - 1.36, { max: 13.5 });
          });
        },
        async (d) => { // a trunk at the left, branches of different lengths reaching out to the steps in turn
          const s = await page(d), n = d.steps.length, H = 3.58 / n, x0 = 0.95, w = 5.3;
          rule(s, x0, 1.55, 0, 3.55, 1.25);
          d.steps.forEach((st, i) => {
            const y = 1.53 + i * H, far = i % 2 === 1, x = far ? 4.0 : 1.5;
            rule(s, x0, y + 0.16, x - x0 - 0.1, 0, 0.75);
            t.oval(s, x0 - 0.06, y + 0.1, 0.12, 0.12, C.accent);
            h3(s, `${i + 1}   ${st.h}`, x, y, w, 0.32, { valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.33, w, H - 0.36, { max: 12, ls: 1.12 });
          });
        },
        async (d) => { // growth from the soil: the first step at the bottom, the last at the top, the title on the far side
          const s = await open(d, 6.75, 0.5, 2.55, 3.0, { max: 24, valign: 'top' }), n = d.steps.length, H = 4.6 / n;
          rule(s, 0.7, 5.1, 5.75, 0, 1.25);
          d.steps.forEach((st, i) => {
            const y = 0.5 + (n - 1 - i) * H;
            fig(s, String(i + 1), 0.7, y, 0.75, H - 0.06, { max: 36, valign: 'middle' });
            h3(s, st.h, 1.5, y + 0.02, 4.95, 0.32, { valign: 'middle' });
            p(s, st.t, 1.5, y + 0.34, 4.95, H - 0.4, { max: 13, ls: 1.15 });
          });
        },
        async (d) => { // the columns stand high and low in turn, as the rows of a sloping orchard
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 2.05 : 1.5;
            rule(s, x, y, w, 0, 0.75);
            k.txt(s, [{ text: `${i + 1}  `, options: { color: C.accent, bold: true, fontSize: 18 } }], x, y + 0.04, w, 0.38, { size: 18, font: F.head, valign: 'middle', ls: 1 });
            h3(s, st.h, x, y + 0.43, w, 0.52, { color: C.ink });
            p(s, st.t, x, y + 0.96, w, 5.12 - y - 0.96, { max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // an account: label to the left, the figure flush right, a rule under each line
          const s = await page(d), H = d.note ? 0.92 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.52 + i * H;
            p(s, x.label, 0.7, y, 4.9, H - 0.08, { valign: 'middle', max: 15 });
            fig(s, x.value, 5.8, y, 3.5, H - 0.08, { max: 40, min: 18, align: 'right', valign: 'middle' });
            rule(s, 0.7, y + H - 0.03, 8.6);
          });
          if (d.note) p(s, d.note, 0.7, 4.34, 8.6, 0.8, { color: C.muted, max: 12 });
        },
        async (d) => { // one number stands apart like an old tree, two young ones at its side
          const s = await page(d), [a, ...rest] = d.stats;
          fig(s, a.value, 0.7, 1.42, 5.3, 1.6, { max: 80, min: 28, valign: 'middle' });
          p(s, a.label, 0.7, 3.05, 5.2, 0.62, { max: 15 });
          if (d.note) p(s, d.note, 0.7, 3.74, 5.2, 1.38, { max: 12, color: C.muted });
          rule(s, 6.25, 1.55, 0, 3.55, 1);
          rest.forEach((x, i) => {
            const y = 1.52 + i * 1.82;
            k.head(s, x.value, 6.5, y, 2.8, 0.82, { max: 34, min: 16, color: C.ink, valign: 'bottom' });
            p(s, x.label, 6.5, y + 0.86, 2.8, 0.82, { max: 13 });
          });
        },
      ],
      compare: [
        async (d) => { // two terraces, one above the other: the name on the left, the list running across
          const s = await page(d), H = 1.76;
          [d.left, d.right].forEach((sd, i) => {
            const y = 1.52 + i * (H + 0.06);
            rule(s, 0.7, y, 8.6, 0, i ? 0.75 : 1.25);
            k.head(s, sd.h, 0.7, y + 0.1, 2.3, H - 0.16, { max: 20, min: 12, color: i ? C.accent : C.ink, valign: 'top' });
            const hh = (H - 0.14) / Math.ceil(sd.items.length / 2);
            sd.items.forEach((it, j) => p(s, it, 3.2 + (j % 2) * 3.15, y + 0.1 + Math.floor(j / 2) * hh, 2.95, hh - 0.03, { max: 13.5 }));
          });
        },
        async (d) => { // a balance sheet: the two sides meet at a centre line, each pair on its own ruled row
          const s = await page(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.18, 2.88);
          k.head(s, d.left.h, 0.7, 1.45, w, 0.55, { max: 20, min: 12, color: C.ink, align: 'right' });
          k.head(s, d.right.h, 5.35, 1.45, w, 0.55, { max: 20, min: 12, color: C.accent });
          rule(s, 5, 1.5, 0, 3.6, 1);
          let y = 2.1;
          rows.forEach((rh, j) => {
            rule(s, 0.7, y, 8.6);
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y + 0.06, w, rh - 0.06, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y + 0.06, w, rh - 0.06, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // the title on a long rule above, the sentence settled low, the note up at the right
          const s = await open(d, 0.7, 0.42, 5.6, 0.48, { max: 15, min: 11, color: C.accent }, 'focus');
          rule(s, 0.7, 0.96, 8.6, 0, 1);
          k.head(s, L.runs(d.text), 0.7, 1.1, 5.75, 4.02, { max: 34, min: 16, color: C.ink, valign: 'bottom' });
          if (d.caption) p(s, d.caption, 6.75, 1.1, 2.55, 4.02, { max: 12.5, color: C.muted, ls: 1.15 });
        },
        async (d) => { // the margin holds the title and the note, the sentence fills the field beyond the upright
          const s = await open(d, 0.7, 0.5, 2.55, 1.3, { max: 18, min: 11, color: C.accent, valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 0.7, 1.85, 2.55, 3.27, { max: 12, color: C.muted, ls: 1.15, valign: 'bottom' });
          rule(s, 3.5, 0.55, 0, 4.55, 1);
          k.head(s, L.runs(d.text), 3.8, 0.5, 5.5, 4.6, { max: 38, min: 18, color: C.ink });
        },
      ],
      timeline: [
        async (d) => { // four plots, a year large at the left of each
          const s = await page(d), w = 4.15, H = 1.78;
          d.items.forEach((it, i) => {
            const x = 0.7 + (i % 2) * (w + 0.3), y = 1.5 + Math.floor(i / 2) * H;
            rule(s, x, y, w);
            fig(s, it.year, x, y + 0.06, w, 0.48, { max: 24, min: 12, valign: 'middle' });
            h3(s, it.h, x, y + 0.54, w, 0.3, { color: C.ink, max: 14, valign: 'middle' });
            p(s, it.t, x, y + 0.85, w, H - 0.9, { max: 12.5, ls: 1.12 });
          });
        },
        async (d) => { // years grow from a ground line, each column standing taller than the last
          const s = await page(d), gap = 0.28, w = (8.6 - gap * 3) / 4, ly = 4.5;
          rule(s, 0.7, ly, 8.6, 0, 1.25);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = 2.1 - i * 0.2;
            h3(s, it.h, x, y, w, 0.5, { max: 14 });
            p(s, it.t, x, y + 0.52, w, ly - y - 0.58, { max: 12.5, ls: 1.12 });
            fig(s, it.year, x, ly + 0.08, w, 0.55, { max: 26, min: 12, valign: 'middle' });
          });
        },
        async (d) => { // the years up the trunk in the middle: what happened to one side, what it meant to the other
          const s = await page(d), H = 0.9;
          d.items.forEach((it, i) => {
            const y = 1.52 + i * H;
            h3(s, it.h, 0.7, y, 2.75, H - 0.06, { align: 'right', valign: 'middle', max: 15, color: C.ink });
            fig(s, it.year, 3.6, y, 1.5, H - 0.06, { max: 20, min: 10, align: 'center', valign: 'middle' });
            p(s, it.t, 5.25, y, 4.05, H - 0.04, { max: 12.5, valign: 'middle', ls: 1.1 });
            if (i) rule(s, 0.7, y - 0.03, 8.6);
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process and timeline are the rows of the cards
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "barqaror va tinch: puxta, ishonchli, sodda til" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:pan|dir=\"u\"", "dissolve"], "cover": ["riseWords", "fadeWords"], "mark": "swing", "deco": "riseUp", "sig": {"title": "riseWords", "body": "fade", "item": "riseSettle", "image": "peekUp", "number": "swing", "order": "seq", "stagger": 0.24}, "tempo": 1.3, "kenburns": true};
