/** 178 Kofe — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 178, slug: 'kofe', name: "Kofe", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: 'F5EADC', muted: 'CDB59B', accent: 'E7B77A' }, photo: { r: 0.06 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'3B2618'],[1,'6B4A33']],'d'), grain(0.07)),
  // a talk over coffee: the menu board with its dotted leaders, a receipt, cup rings, words in speech bubbles, sepia pictures
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 0.7, y = 4.05, w = 8.6, h = 0.95, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: TI, valign: 'top', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.22, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.75, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const dots = (s, x, y, w) => { if (w > 0.1) t.line(s, x, y, w, 0, C.muted, 1, { dash: 'sysDot' }); };
    const ring = (s, x, y, D, wt = 0.75) => t.oval(s, x, y, D, D, null, { line: { color: C.accent, width: wt } });
    const SEPIA = { duo: ['2A190F', 'F5EADC'] };
    const bubble = async (s, x, y, w, h) => { const W = Math.round(w * 100), H = Math.round(h * 100), b = H - 24, r = 14, tx = 60; t.img(s, await k.svg(`bub${W}x${H}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="M${r},1.5 H${W - r} Q${W - 1.5},1.5 ${W - 1.5},${r} V${b - r} Q${W - 1.5},${b} ${W - r},${b} H${tx + 28} L${tx},${H - 2} V${b} H${r} Q1.5,${b} 1.5,${b - r} V${r} Q1.5,1.5 ${r},1.5 Z" fill="none" stroke="#${C.accent}" stroke-width="1.5"/></svg>`, W, H), x, y, w, h, { alt: '' }); };
    const V = {
      image: [
        async (d) => { // a cup seen from above: the round picture in its saucer
          const s = await open(d, 0.7, 3.95, 4.4, 1.2, { max: 22 });
          ring(s, 5.3, 0.55, 4.3); await k.photo(s, d.image, 5.55, 0.8, 3.8, 3.8, { mask: 'circle' });
          p(s, d.text, 0.7, 0.5, 4.4, 3.38);
        },
        async (d) => { // an old sepia print down the left edge of the page
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 3.6, 5.625, SEPIA);
          k.head(s, d.title, 3.95, 3.95, 5.35, 1.2, { max: 24, min: 14, color: TI, valign: 'top' });
          p(s, d.text, 3.95, 0.5, 5.35, 3.35, { valign: 'bottom' });
          num(s); foot(s, 3.95, 5.35);
        },
        async (d) => { // the picture speaks: cut as a speech bubble
          const s = await open(d);
          await k.photo(s, d.image, 0.7, 0.32, 4.8, 3.6, { mask: { path: 'M0.05,0 H0.95 Q1,0 1,0.07 V0.78 Q1,0.85 0.95,0.85 H0.32 L0.14,1 V0.85 H0.05 Q0,0.85 0,0.78 V0.07 Q0,0 0.05,0 Z' } });
          p(s, d.text, 5.8, 0.5, 3.5, 3.45);
        },
        async (d) => { // the picture whole above, a dark-roast band takes the lower half for title and words
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 0, 2.5, 10, 2.7, '3B2618', { t: 8, name: 'Roast' });
          k.head(s, d.title, 0.7, 2.62, 2.8, 2.45, { max: 22, min: 13, color: TI, valign: 'top' });
          p(s, d.text, 3.75, 2.62, 5.55, 2.48, { max: 13.5 });
          k.txt(s, String(k.idx).padStart(2, '0'), 9.3, 2.52, 0.55, 0.2, { size: 8.5, color: C.muted, align: 'right', ls: 1 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // the menu board: each dish, its dotted leader, its number; a line of description
          const s = await open(d), n = d.items.length, H = 3.52 / n;
          d.items.forEach((it, i) => {
            const y = 0.42 + i * H, fs = 15, tw = Math.min(L.width(it.h, fs, F.head) * 1.08, 7.2);
            k.head(s, it.h, 0.7, y, tw + 0.1, 0.32, { size: fs, color: C.accent, valign: 'middle' });
            dots(s, 0.7 + tw + 0.18, y + 0.22, 8.6 - tw - 0.7);
            k.txt(s, String(i + 1).padStart(2, '0'), 8.75, y, 0.55, 0.32, { size: 13, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle', ls: 1 });
            p(s, it.t, 0.7, y + 0.34, 8.6, H - 0.4, { max: 13.5, ls: 1.14 });
          });
        },
        async (d) => { // turns in a talk: thin bubbles to the left and to the right by turns
          const s = await open(d, 0.7, 4.2, 8.6, 0.85, { max: 22 }), n = d.items.length, H = 3.78 / n, w = 6.1;
          for (const [i, it] of d.items.entries()) {
            const l = i % 2 === 0, x = l ? 0.7 : 3.2, y = 0.3 + i * H;
            t.rect(s, x, y, w, H - 0.08, null, { r: 0.1, line: { color: C.accent, width: 0.5 }, name: 'Bubble' });
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x + 0.12, y + 0.08, 0.26, 0.26);
            h3(s, it.h, x + 0.46, y + 0.05, w - 0.6, 0.3, { valign: 'middle', max: 13 });
            p(s, it.t, x + 0.14, y + 0.35, w - 0.28, H - 0.08 - 0.38, { max: 12.5, ls: 1.08 });
          }
        },
        async (d) => { // cups on two tables: a ring round each icon, the right-hand table a little lower
          const s = await open(d), n = d.items.length, w = 4.05, H = 1.62, D = 0.72;
          for (const [i, it] of d.items.entries()) {
            const r = i % 2, x = r ? 5.25 : 0.7, y = 0.4 + Math.floor(i / 2) * (H + 0.08) + (r ? 0.26 : 0);
            ring(s, x, y, D); ring(s, x + 0.06, y + 0.06, D - 0.12, 0.5);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x + 0.2, y + 0.2, 0.32, 0.32);
            h3(s, it.h, x + D + 0.14, y, w - D - 0.14, 0.34, { valign: 'middle', max: 14 });
            p(s, it.t, x + D + 0.14, y + 0.36, w - D - 0.14, H - 0.4, { max: 13, ls: 1.14 });
          }
        },
        async (d) => { // the receipt: a tall thin slip on the right with dashed tear lines, the title beside it
          const s = await open(d, 0.7, 2.0, 3.3, 3.1, { max: 30, valign: 'bottom' }), n = d.items.length, X = 4.5, Y = 0.34, W = 4.85, Hh = 4.82, H = Hh / n;
          t.rect(s, X, Y, W, Hh, null, { line: { color: C.accent, width: 0.5 }, name: 'Receipt' });
          for (const [i, it] of d.items.entries()) {
            const y = Y + i * H;
            if (i) t.line(s, X, y, W, 0, C.accent, 0.5, { dash: 'dash' });
            t.img(s, await L.icon(it.icon, C.accent, 1.5), X + 0.14, y + 0.1, 0.26, 0.26);
            h3(s, it.h, X + 0.48, y + 0.07, W - 0.62, 0.32, { valign: 'middle', max: 13.5 });
            p(s, it.t, X + 0.14, y + 0.4, W - 0.28, H - 0.44, { max: 12.5, ls: 1.12 });
          }
        },
      ],
      process: [
        async (d) => { // the slow drip: one line falling down the page, the steps to either side of it
          const s = await open(d, 0.7, 4.22, 8.6, 0.85, { max: 22 }), n = d.steps.length, H = 3.88 / n, w = 4.05, cx = 5;
          ln(s, cx, 0, 0, 4.14, 0.75);
          d.steps.forEach((st, i) => {
            const y = 0.28 + i * H, l = i % 2 === 0, x = l ? cx - 0.28 - w : cx + 0.28, a = l ? 'right' : 'left';
            t.oval(s, cx - 0.07, y + 0.08, 0.14, 0.14, C.accent);
            h3(s, `${st.h}`, x, y, w, 0.3, { align: a, valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.32, w, Math.min(n === 4 ? 0.85 : 1.1, 4.16 - y - 0.32), { align: a, max: 13, ls: 1.12 });
          });
        },
        async (d) => { // cup rings left on the table, each a number; the words beneath
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, D = 0.95;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 0.38;
            ring(s, x, y, D, 1); ring(s, x + 0.09, y + 0.05, D - 0.1, 0.5);
            k.txt(s, String(i + 1), x, y, D, D, { size: 22, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
            h3(s, st.h, x, 1.4, w, 0.52, { color: C.ink, max: 14 });
            p(s, st.t, x, 1.94, w, 2.04, { max: 13.5 });
          });
        },
        async (d) => { // the words pile up on the counter, the numbers set on its edge just above the title
          const s = await open(d, 0.7, 4.3, 8.6, 0.82, { max: 24 }), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ly = 3.72;
          ln(s, 0.7, ly, 8.6, 0, 1);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, st.h, x, 0.42, w, 0.52, { max: 14 });
            p(s, st.t, x, 0.96, w, ly - 1.02, { max: 13.5, valign: 'top' });
            fig(s, String(i + 1), x, ly + 0.05, w, 0.46, { max: 24, valign: 'middle' });
          });
        },
        async (d) => { // a large figure leaning against each step, two and two
          const s = await open(d), n = d.steps.length, w = 4.15, H = 1.74;
          d.steps.forEach((st, i) => {
            const whole = n === 3 && i === 2, x = i % 2 ? 5.15 : 0.7, y = 0.38 + (i < 2 ? 0 : H + 0.04), ww = whole ? 8.6 : w;
            fig(s, String(i + 1), x, y - 0.06, 0.7, 0.92, { max: 54, min: 30, valign: 'top' });
            h3(s, st.h, x + 0.75, y, ww - 0.75, 0.34, { valign: 'middle' });
            p(s, st.t, x + 0.75, y + 0.36, ww - 0.75, H - 0.4, { max: 13.5, ls: 1.14 });
          });
        },
      ],
      stats: [
        async (d) => { // the price list: words, dotted leader, figure flush right
          const s = await open(d), H = d.note ? 0.86 : 1.14;
          d.stats.forEach((x, i) => {
            const y = 0.42 + i * H, vw = 2.9, fs = 14.5, tw = Math.min(L.width(x.label, fs, F.body) * 1.05, 5.4);
            p(s, x.label, 0.7, y, 5.5, H - 0.08, { max: fs, min: 11, valign: 'bottom' });
            dots(s, 0.7 + tw + 0.1, y + H - 0.18, Math.max(0, 8.6 - tw - vw - 0.15));
            fig(s, x.value, 9.3 - vw, y, vw, H - 0.08, { max: 34, min: 18, align: 'right', valign: 'bottom' });
          });
          if (d.note) p(s, d.note, 0.7, 3.04, 8.6, 0.92, { max: 12.5, color: C.muted });
        },
        async (d) => { // the large figure in a large cup, the two others beside it
          const s = await open(d), [a, ...rest] = d.stats, D = 3.5;
          ring(s, 0.7, 0.34, D, 1); ring(s, 0.82, 0.46, D - 0.24, 0.5);
          fig(s, a.value, 1.15, 1.0, D - 0.9, 1.15, { max: 46, min: 20, align: 'center' });
          p(s, a.label, 1.3, 2.15, D - 1.2, 0.85, { align: 'center', max: 12.5 });
          rest.forEach((x, i) => {
            const y = 0.42 + i * 1.08;
            k.head(s, x.value, 4.6, y, 4.7, 0.6, { max: 30, min: 15, color: C.ink, valign: 'bottom' });
            p(s, x.label, 4.6, y + 0.62, 4.7, 0.42, { max: 13 });
          });
          if (d.note) p(s, d.note, 4.6, 2.62, 4.7, 1.36, { max: 12, color: C.muted, ls: 1.12 });
        },
        async (d) => { // a slow slope: each figure lower and further along, the note in the free corner
          const s = await open(d), w = 2.7, dx = 2.95;
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * dx, y = 0.38 + i * 0.86;
            ln(s, xx, y, w, 0, 0.75);
            fig(s, x.value, xx, y + 0.04, w, 0.72, { max: 36, min: 18, align: 'left' });
            p(s, x.label, xx, y + 0.78, w, 0.72, { max: 13 });
          });
          if (d.note) p(s, d.note, 0.7, 2.0, 2.75, 1.97, { max: 12, color: C.muted, valign: 'bottom', ls: 1.1 });
        },
      ],
      compare: [
        async (d) => { // two speakers: one bubble high on the left, its answer lower on the right
          const s = await open(d, 0.7, 4.2, 8.6, 0.85, { max: 22 }), w = 6.2, H = 1.82;
          [[d.left, 0.7, 0.3, C.ink], [d.right, 3.1, 2.26, C.accent]].forEach(([sd, x, y, c]) => {
            t.rect(s, x, y, w, H, null, { r: 0.1, line: { color: C.accent, width: 0.5 }, name: 'Bubble' });
            k.head(s, sd.h, x + 0.16, y + 0.06, w - 0.32, 0.32, { max: 14.5, min: 11, color: c, valign: 'middle' });
            const hh = (H - 0.46) / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, x + 0.16, y + 0.4 + j * hh, w - 0.32, hh, { max: 12, valign: 'middle', ls: 1.02 }));
          });
        },
        async (d) => { // across the table: for once the title is on top, the two sides face each other about a line
          const s = await open(d, 0.7, 0.32, 8.2, 0.72, { max: 24, valign: 'middle' }), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.18, 3.3);
          k.head(s, d.left.h, 0.7, 1.12, w, 0.6, { max: 20, min: 12, color: C.ink, align: 'right' });
          k.head(s, d.right.h, 5.35, 1.12, w, 0.6, { max: 20, min: 12, color: C.accent });
          ln(s, 5, 1.15, 0, 3.97, 1);
          let y = 1.82;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // said aloud: the sentence in a great speech bubble, title and note under it
          const s = await open(d, 6.3, 3.68, 3.0, 1.44, { max: 15, min: 10.5, color: C.accent, align: 'right' }, 'focus');
          await bubble(s, 0.7, 0.35, 8.6, 3.25);
          k.head(s, L.runs(d.text), 1.05, 0.5, 7.9, 2.55, { max: 36, min: 17, color: C.ink, align: 'center' });
          if (d.caption) p(s, d.caption, 0.7, 3.68, 5.3, 1.44, { max: 12.5, color: C.muted, ls: 1.14 });
        },
        async (d) => { // a cup left on the page and the sentence beside it, the note low
          const s = await open(d, 0.7, 0.4, 4.0, 0.42, { max: 14, min: 11, color: C.accent, valign: 'middle' }, 'focus');
          ring(s, 6.65, 1.1, 3.05, 1); ring(s, 6.77, 1.16, 2.85, 0.5);
          k.head(s, L.runs(d.text), 0.7, 0.9, 5.75, 2.85, { max: 32, min: 16, color: C.ink, bold: false, italic: true });
          if (d.caption) p(s, d.caption, 0.7, 3.85, 5.4, 1.28, { max: 12.5, color: C.muted, ls: 1.14 });
        },
      ],
      timeline: [
        async (d) => { // the regulars' book: year at the left, a rule, the entry beside it
          const s = await open(d, 0.7, 4.25, 8.6, 0.85, { max: 22 }), H = 0.96;
          d.items.forEach((it, i) => {
            const y = 0.32 + i * H;
            fig(s, it.year, 0.7, y, 2.15, H - 0.08, { max: 26, min: 13, align: 'left' });
            ln(s, 3.0, y + 0.04, 0, H - 0.16, 0.75);
            h3(s, it.h, 3.2, y, 6.1, 0.28, { max: 13.5, valign: 'middle' });
            p(s, it.t, 3.2, y + 0.3, 6.1, H - 0.34, { max: 12.5, ls: 1.1 });
          });
        },
        async (d) => { // cooling down: the columns start further down the page, one after another
          const s = await open(d, 0.7, 4.28, 8.6, 0.82, { max: 22 }), gap = 0.26, w = (8.6 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = 0.32 + i * 0.26;
            fig(s, it.year, x, y, w, 0.5, { max: 24, min: 12, align: 'left' });
            h3(s, it.h, x, y + 0.52, w, 0.46, { color: C.ink, max: 13.5 });
            p(s, it.t, x, y + 1.0, w, 4.2 - y - 1.0, { max: 13, ls: 1.12 });
          });
        },
        async (d) => { // the conversation crosses a table edge: two entries over it, two under it
          const s = await open(d, 0.7, 4.3, 8.6, 0.8, { max: 22 }), ly = 2.2, w = 4.1;
          ln(s, 0.7, ly, 8.6, 0, 1);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = i < 2 ? 0.7 : 5.2, y = up ? 0.36 : ly + 0.1;
            ring(s, x, ly - 0.08, 0.16, 1);
            k.txt(s, [{ text: `${it.year}   `, options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.ink } }], x, y, w, 0.34, { max: 14.5, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, up ? ly - y - 0.46 : 4.26 - y - 0.36, { max: 13.5 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are the columns of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "samimiy suhbat: iliq, bemalol, tushunarli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "dissolve", "pull:u"], "cover": ["riseWords", "fadeWords"], "mark": "curveUp", "deco": "curveUp", "sig": {"title": "riseWords", "body": "fade", "item": "curveUp", "image": "dissolve", "number": "curveUp", "order": "seq", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
