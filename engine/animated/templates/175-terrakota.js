/** 175 Terrakota — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 175, slug: 'terrakota', name: "Terrakota", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFF3E8', muted: 'FBE3D2', accent: 'FFE2B0' }, photo: { r: 0.03 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('B4573B'), grain(0.1)),
  // fired earth: a colonnade of arches, a jar, brick courses, an excavation; heavy capitals, nothing but thin lines added
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const cap = (s, v, x, y, w, h, o = {}) => k.head(s, v.toUpperCase(), x, y, w, h, { max: 28, min: 13, color: TI, spacing: 1.5, valign: 'bottom', ...o });
    const open = async (d, x = 0.7, y = 0.3, w = 8.2, h = 1.25, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) cap(s, d.title, x, y, w, h, o); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 44, min: 14, color: C.accent, valign: 'top', ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.75, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const arch = async (s, x, y, w, h) => { const W = Math.round(w * 100), H = Math.round(h * 100), r = W / 2; t.img(s, await k.svg(`arch${W}x${H}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="M1.5,${H} V${r} A${r - 1.5},${r - 1.5} 0 0 1 ${W - 1.5},${r} V${H}" fill="none" stroke="#${C.accent}" stroke-width="1.5"/></svg>`, W, H), x, y, w, h, { alt: '' }); };
    const V = {
      image: [
        async (d) => { // a colonnade: one picture seen through three arches, the writing on the ground beneath
          const s = await open(d, 0.7, 3.32, 3.0, 1.82, { max: 18, valign: 'top' });
          await k.photo(s, d.image, 0.7, 0.45, 8.3, 2.72, { mask: { path: 'M0,1 V0.46 A0.15,0.46 0 0 1 0.3,0.46 V1 Z M0.35,1 V0.46 A0.15,0.46 0 0 1 0.65,0.46 V1 Z M0.7,1 V0.46 A0.15,0.46 0 0 1 1,0.46 V1 Z' } });
          p(s, d.text, 3.95, 3.3, 5.35, 1.85, { max: 13 });
        },
        async (d) => { // a jar: the picture takes the shape of a big clay vessel
          const s = await open(d, 0.7, 0.4, 4.9, 1.2, { max: 22 });
          await k.photo(s, d.image, 5.9, 0.28, 3.6, 4.92, { mask: { path: 'M0.32,0 H0.68 V0.09 C0.68,0.16 1,0.2 1,0.5 C1,0.8 0.74,1 0.62,1 H0.38 C0.26,1 0,0.8 0,0.5 C0,0.2 0.32,0.16 0.32,0.09 Z' } });
          p(s, d.text, 0.7, 1.7, 4.95, 3.42);
        },
        async (d) => { // a hill of picture rises from the foot of the page, the words on the slope above
          const s = await open(d, 0.7, 0.3, 8.2, 0.82, { max: 22 });
          p(s, d.text, 0.7, 1.18, 8.6, 1.7, { max: 13 });
          await k.photo(s, d.image, 0, 2.92, 10, 2.28, { mask: { path: 'M0,0.34 C0.3,-0.06 0.7,-0.06 1,0.3 V1 H0 Z' } });
        },
        async (d) => { // the picture whole, a band of baked clay across it holding title and words
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 0, 1.05, 10, 3.2, 'B4573B', { name: 'Band' });
          cap(s, d.title, 0.7, 1.2, 3.0, 2.9, { max: 20, valign: 'middle' });
          ln(s, 3.95, 1.25, 0, 2.8);
          p(s, d.text, 4.2, 1.2, 5.1, 2.9, { valign: 'middle', max: 13.5 });
          k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 1.1, 0.6, 0.25, { size: 9, color: C.muted, align: 'right' });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // a wall in running bond: thin-lined bricks, the second course shifted along
          const s = await open(d), n = d.items.length, w = 3.95, H = 1.72;
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, r = i < 2 ? 0 : 1, x = whole ? 1.35 : (r ? 1.35 : 0.7) + (i % 2) * (w + 0.1), y = 1.65 + r * (H + 0.08), ww = whole ? 2 * w + 0.1 : w;
            t.rect(s, x, y, ww, H, null, { line: { color: C.accent, width: 0.5 }, name: 'Brick' });
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + 0.14, y + 0.12, 0.3, 0.3);
            h3(s, it.h, x + 0.54, y + 0.1, ww - 0.68, 0.34, { valign: 'middle', max: 13.5 });
            p(s, it.t, x + 0.14, y + 0.48, ww - 0.28, H - 0.54, { max: 13 });
          }
        },
        async (d) => { // seals pressed in clay: the icon in a ring, centred columns below
          const s = await open(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), D = 0.74, cx = x + w / 2;
            t.oval(s, cx - D / 2, 1.68, D, D, null, { line: { color: C.accent, width: 1 } });
            t.img(s, await L.icon(it.icon, C.accent, 1.75), cx - 0.19, 1.87, 0.38, 0.38);
            h3(s, it.h, x, 2.5, w, 0.52, { align: 'center', max: 14 });
            p(s, it.t, x, 3.03, w, 2.1, { align: 'center', max: 13.5 });
          }
        },
        async (d) => { // an excavation: each layer of the dig narrower than the one above, ruled off
          const s = await open(d), n = d.items.length, H = 3.48 / n, dw = n === 4 ? 0.85 : 1.2;
          d.items.forEach((it, i) => {
            const y = 1.64 + i * H, w = 8.6 - i * dw;
            ln(s, 0.7, y, w, 0, 0.75);
            h3(s, it.h, 0.7, y + 0.05, w, 0.3, { valign: 'middle', max: 14 });
            p(s, it.t, 0.7, y + 0.35, w, H - 0.39, { max: 13, ls: 1.12 });
          });
        },
        async (d) => { // the cornerstone: the first item large, the others leaning on it
          const s = await open(d), n = d.items.length, [a, ...rest] = d.items, H = 3.45 / rest.length;
          t.img(s, await L.icon(a.icon, C.accent, 1.5), 0.7, 1.68, 0.5, 0.5);
          k.head(s, a.h, 0.7, 2.25, 4.0, 0.62, { max: 22, min: 13, color: C.accent, valign: 'top' });
          p(s, a.t, 0.7, 2.9, 4.0, 2.22, { max: 16, min: 11 });
          ln(s, 5.0, 1.7, 0, 3.4, 0.75);
          for (const [i, it] of rest.entries()) {
            const y = 1.68 + i * H;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), 5.25, y + 0.02, 0.28, 0.28);
            h3(s, it.h, 5.63, y, 3.67, 0.32, { valign: 'middle', max: 13.5 });
            p(s, it.t, 5.25, y + 0.34, 4.05, H - 0.38, { max: 12.5, ls: 1.12 });
          }
        },
      ],
      process: [
        async (d) => { // a stair of thin lines climbs to the right, the words under each tread, the title in the free corner above
          const s = await open(d, 0.7, 0.32, d.steps.length === 3 ? 4.9 : 4.3, 1.28, { max: 22, valign: 'top' }), n = d.steps.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, top = n === 4 ? [2.72, 2.3, 1.88, 1.46] : [2.72, 2.08, 1.44];
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = top[i];
            ln(s, x, y, w + (i < n - 1 ? gap : 0), 0, 1);
            if (i < n - 1) ln(s, x + w + gap, top[i + 1], 0, y - top[i + 1], 1);
            k.txt(s, [{ text: `${i + 1}  `, options: { color: C.accent, bold: true } }, { text: st.h, options: { color: C.accent, bold: true } }], x, y + 0.07, w - 0.1, 0.52, { max: 14, min: 10.5, font: F.head });
            p(s, st.t, x, y + 0.6, w - 0.1, 5.12 - y - 0.6, { max: 13, ls: 1.15 });
          });
        },
        async (d) => { // large pale numerals stamped behind the words, in two courses
          const s = await open(d), n = d.steps.length, w = 4.1, H = 1.72;
          d.steps.forEach((st, i) => {
            const whole = n === 3 && i === 2, x = i % 2 ? 5.2 : 0.7, y = 1.64 + (i < 2 ? 0 : H + 0.04), ww = whole ? 8.6 : w;
            t.text(s, String(i + 1), { x, y, w: 1.1, h: H, fontFace: F.head, bold: true, fontSize: 88, color: C.accent, transparency: 72, valign: 'middle', noShrink: true });
            h3(s, st.h, x + 0.72, y + 0.04, ww - 0.72, 0.34, { valign: 'middle' });
            p(s, st.t, x + 0.72, y + 0.4, ww - 0.72, H - 0.45, { max: 13 });
          });
        },
        async (d) => { // a horizon of fired earth: steps stand above and below the line by turns
          const s = await open(d, 0.7, 0.3, 8.2, 0.85, { max: 22 }), n = d.steps.length, ly = 3.14, w = n === 4 ? 4.05 : 3.5, xs = n === 4 ? [0.7, 0.7, 5.25, 5.25] : [0.7, 3.25, 5.8], ox = [0, 0, 0, 0];
          ln(s, 0.7, ly, 8.6, 0, 1.25);
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i] + ox[i], y = up ? 1.28 : ly + 0.12;
            t.rect(s, x, ly - 0.06, 0.12, 0.12, C.accent, { name: 'Peg' });
            k.txt(s, [{ text: `${i + 1}   `, options: { color: C.accent, bold: true } }, { text: st.h, options: { color: C.accent, bold: true } }], x, y, w, 0.34, { max: 14.5, min: 10.5, font: F.head, valign: 'middle' });
            p(s, st.t, x, y + 0.36, w, up ? ly - y - 0.46 : 5.12 - y - 0.36, { max: 13.5 });
          });
        },
        async (d) => { // the title as a heavy pillar on the left, the steps fall down its side with arrows between
          const s = await open(d, 0.7, 0.4, 3.0, 4.7, { max: 28, valign: 'top' }), n = d.steps.length, H = 4.7 / n;
          ln(s, 4.0, 0.45, 0, 4.65, 1.25);
          d.steps.forEach((st, i) => {
            const y = 0.42 + i * H;
            h3(s, `${i + 1}   ${st.h}`, 4.25, y, 5.05, 0.32, { valign: 'middle' });
            p(s, st.t, 4.25, y + 0.33, 5.05, H - (i < n - 1 ? 0.56 : 0.36), { max: 13, ls: 1.12 });
            if (i < n - 1) k.txt(s, '↓', 4.25, y + H - 0.25, 0.4, 0.24, { size: 12, bold: true, color: C.accent, valign: 'middle', ls: 1 });
          });
        },
      ],
      stats: [
        async (d) => { // three stones on one ground line: the figures stand on it, the words lie under it
          const s = await open(d), w = 2.7, gap = 0.25, ly = 3.0;
          ln(s, 0.7, ly, 8.6, 0, 1.25);
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap);
            fig(s, x.value, xx, 1.72, w, 1.24, { max: 50, min: 20, valign: 'bottom' });
            p(s, x.label, xx, ly + 0.08, w, 0.82, { max: 14 });
          });
          if (d.note) p(s, d.note, 0.7, 3.95, 8.6, 1.17, { max: 12.5, color: C.muted });
        },
        async (d) => { // one figure as big as a monument, title small over it, the other two at its foot
          const s = await open(d, 0.7, 0.3, 8.2, 0.5, { max: 15, min: 11, color: C.accent, valign: 'middle' }), [a, ...rest] = d.stats;
          fig(s, a.value, 0.7, 0.75, 5.6, 1.85, { max: 96, min: 30, valign: 'middle' });
          p(s, a.label, 6.5, 0.95, 2.8, 1.55, { max: 15, valign: 'middle' });
          ln(s, 0.7, 2.72, 8.6);
          rest.forEach((x, i) => {
            const xx = 0.7 + i * 4.45;
            k.head(s, x.value, xx, 2.8, 1.95, 0.72, { max: 30, min: 14, color: C.ink, valign: 'middle' });
            p(s, x.label, xx + 2.0, 2.82, 2.15, 0.72, { max: 12, valign: 'middle' });
          });
          if (d.note) p(s, d.note, 0.7, 3.65, 8.6, 1.48, { max: 13, color: C.muted });
        },
        async (d) => { // the title a pillar at the left with the note at its foot, figures in courses beyond a line
          const s = await open(d, 0.7, 0.45, 3.0, 2.3, { max: 16, valign: 'top' }), H = 1.56;
          if (d.note) p(s, d.note, 0.7, 2.85, 3.0, 2.28, { max: 12, color: C.muted, valign: 'bottom', ls: 1.12 });
          ln(s, 4.0, 0.5, 0, 4.6, 1.25);
          d.stats.forEach((x, i) => {
            const y = 0.42 + i * H;
            fig(s, x.value, 4.3, y, 5.0, 0.86, { max: 42, min: 18, valign: 'middle' });
            p(s, x.label, 4.3, y + 0.88, 5.0, 0.62, { max: 14 });
          });
        },
      ],
      compare: [
        async (d) => { // two halves of a broken jar, mirrored about a line
          const s = await open(d, 0.7, 0.3, 8.2, 0.98, { max: 24 }), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.16, 3.05);
          k.head(s, d.left.h, 0.7, 1.36, w, 0.62, { max: 20, min: 12, color: C.ink, align: 'right' });
          k.head(s, d.right.h, 5.35, 1.36, w, 0.62, { max: 20, min: 12, color: C.accent });
          ln(s, 5, 1.4, 0, 3.7, 1);
          let y = 2.06;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two layers of earth: names to the right, items laid across each layer
          const s = await open(d, 0.7, 0.3, 8.2, 0.9, { max: 24 }), H = 1.92;
          [d.left, d.right].forEach((sd, i) => {
            const y = 1.26 + i * H, n = sd.items.length, hh = (H - 0.5) / Math.ceil(n / 2);
            ln(s, 0.7, y, 8.6, 0, i ? 0.75 : 1.25);
            k.head(s, sd.h, 3.5, y + 0.06, 5.8, 0.38, { max: 17, min: 11, color: i ? C.accent : C.ink, align: 'right', valign: 'middle' });
            sd.items.forEach((it, j) => p(s, it, 0.7 + (j % 2) * 4.4, y + 0.46 + Math.floor(j / 2) * hh, 4.2, hh - 0.02, { max: 13.5 }));
          });
        },
      ],
      statement: [
        async (d) => { // a slab of words at the top, the title and note cut in below a line
          const s = await open({}, 0, 0, 0, 0, {}, 'focus');
          k.head(s, L.runs(d.text), 0.7, 0.4, 8.3, 3.05, { max: 40, min: 18, color: C.ink, valign: 'top' });
          ln(s, 0.7, 3.55, 8.6, 0, 1.25);
          cap(s, d.title, 6.0, 3.65, 3.3, 1.48, { max: 14, min: 10, color: C.accent, align: 'right', valign: 'top' });
          if (d.caption) p(s, d.caption, 0.7, 3.65, 5.0, 1.5, { max: 13, color: C.muted });
        },
        async (d) => { // the sentence stands in an arch like a figure in a niche
          const s = await open(d, 0.7, 0.45, 2.6, 1.55, { max: 15, min: 10.5, color: C.accent, valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 0.7, 2.05, 2.6, 3.07, { max: 12, color: C.muted, valign: 'bottom', ls: 1.14 });
          await arch(s, 3.7, 0.3, 5.5, 4.85);
          k.head(s, L.runs(d.text), 4.3, 1.35, 4.3, 3.5, { max: 26, min: 14, color: C.ink, align: 'center' });
        },
      ],
      timeline: [
        async (d) => { // four arches of a colonnade, a year in the crown of each
          const s = await open(d, 0.7, 0.3, 8.2, 0.85, { max: 22 }), gap = 0.14, w = (8.6 - gap * 3) / 4, top = 1.22, H = 3.92;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            await arch(s, x, top, w, H);
            fig(s, it.year, x + 0.2, top + 0.42, w - 0.4, 0.5, { max: 20, min: 11, align: 'center', valign: 'middle' });
            h3(s, it.h, x + 0.15, top + 0.95, w - 0.3, 0.48, { align: 'center', color: C.ink, max: 13 });
            p(s, it.t, x + 0.15, top + 1.45, w - 0.3, H - 1.5, { align: 'center', max: 12.5, ls: 1.12 });
          }
        },
        async (d) => { // the record of a trench: dated layers, large years to the left, a line under each
          const s = await open(d), H = 0.87;
          d.items.forEach((it, i) => {
            const y = 1.64 + i * H;
            ln(s, 0.7, y, 8.6);
            fig(s, it.year, 0.7, y + 0.03, 2.5, H - 0.06, { max: 26, min: 13, valign: 'middle' });
            k.txt(s, [{ text: `${it.h}   `, options: { bold: true, color: C.accent } }, { text: it.t, options: { color: C.ink } }], 3.35, y + 0.05, 5.95, H - 0.09, { max: 13, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // digging down: each date a step lower and further on
          const s = await open(d, 0.7, 0.3, 8.2, 0.85, { max: 22 }), H = 0.98, dx = 1.25, w = 4.85;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * dx, y = 1.22 + i * H;
            ln(s, x, y, w, 0, 0.75);
            k.txt(s, [{ text: `${it.year}   `, options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.accent } }], x, y + 0.05, w, 0.3, { max: 14, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, H - 0.38, { max: 12, ls: 1.1 });
          });
        },
      ],
    };
    // spaced capitals are not measured by the fit, so the long titles of the old pages ran off the top: give them plain measured capitals
    for (const type of ['intro', 'agenda', 'cards', 'compare', 'statement', 'sources']) { const old = R[type]; R[type] = (d) => old({ ...d, title: d.title && d.title.toUpperCase() }); }
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are the columns of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "tuproqdek mustahkam: tabiiy, iliq va ishonchli bayon" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "bold"], "transitions": ["fade", "wipe:u", "dissolve"], "cover": ["riseSettle", "fadeWords"], "mark": "riseSettle", "deco": "wipe:u", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "wipe:u", "image": "wipe:u", "number": "riseSettle", "order": "seq", "stagger": 0.22}, "tempo": 1.2, "kenburns": true};
