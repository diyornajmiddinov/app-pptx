/** 199 Tun yarmi — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// midnight: a clock's ticks, one hairline at twelve, the rare white page of day (160 px = 1 inch)
const ticks = (cx, cy, r, c) => Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2, L = i % 5 ? 12 : 34, W = i % 5 ? 1.5 : 3; return `<path d="M${(cx + r * Math.sin(a)).toFixed(1)},${(cy - r * Math.cos(a)).toFixed(1)} L${(cx + (r - L) * Math.sin(a)).toFixed(1)},${(cy - (r - L) * Math.cos(a)).toFixed(1)}" stroke="#${c}" stroke-width="${W}"/>`; }).join('');
const NIGHT = () => [flat('050505'), grain(0.09)];
module.exports = B({ id: 199, slug: 'tun-yarmi', name: "Tun yarmi", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F5F5F5', muted: '9E9E9E', accent: 'FFFFFF' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => kind === 'day' ? compose(flat('F2F2F2'))
    : kind === 'face' ? compose(...NIGHT(), raw(ticks(800, 450, 270, 'BDBDBD')))
    : kind === 'faceL' ? compose(...NIGHT(), raw(ticks(-140, 450, 520, '8A8A8A')))
    : kind === 'faceP' ? compose(...NIGHT(), raw(ticks(420, 450, 335, 'BDBDBD')))
    : kind === 'ruler' ? compose(...NIGHT(), raw(Array.from({ length: 73 }, (_, i) => `<path d="M${96 + i * 19.4},${300} V${300 + (i % 18 === 0 ? 34 : i % 6 === 0 ? 20 : 9)}" stroke="#BDBDBD" stroke-width="${i % 18 === 0 ? 3 : 1.5}"/>`).join('')))
    : kind === 'half' ? compose(...NIGHT(), raw('<rect x="800" width="800" height="900" fill="#F2F2F2"/>'))
    : compose(...NIGHT()),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const W = C.ink, G = 'B5B5B5', M = C.muted, K = '0A0A0A', KG = '4A4A4A', U = (v) => (v || '').toUpperCase();
    const open = async (kind = 'page', c = M, x = 0.6, w = 7.4) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, x, y, c = W, size = 32) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.2, size / 58, { size, bold: true, color: c, font: F.head, align: 'right' });
    const T = (s, v, x, y, w, h, o = {}) => k.head(s, U(v), x, y, w, h, { max: 22, min: 11.5, color: W, valign: 'top', spacing: 2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, U(v), x, y, w, h, { max: 12.5, min: 10, color: W, valign: 'top', spacing: 1, ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: G, ls: 1.2, ...o });
    const V = {
      image: [
        async (d) => { // the whole page is a dark print of the picture
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['050505', '5A5A5A'] });
          k.foot(s, { x: 0.6, w: 7.4, y: 5.3, size: 7.5, color: W });
          no(s, 8.2, 0.3);
          T(s, d.title, 0.6, 0.45, 6.9, 1.5, { max: 28 });
          t.line(s, 0.6, 2.05, 8.8, 0, W, 0.5);
          p(s, d.text, 0.6, 2.2, 6.2, 2.95, { color: W, max: 14 });
        },
        async (d) => { // the picture at twelve o'clock's far side: a grey wall on the right, a narrow column of words
          const s = await open('page', M, 0.6, 3.2); no(s, 3.8, 5.2, M, 13);
          await k.photo(s, d.image, 5.6, 0, 4.4, 5.625, { gray: true });
          T(s, d.title, 0.6, 0.6, 4.4, 1.5, {});
          p(s, d.text, 0.6, 2.2, 4.4, 2.95);
        },
        async (d) => { // day breaks in: a white page, the picture in its colour
          const s = await open('day', KG); no(s, 8.2, 0.3, K);
          await k.photo(s, d.image, 0.6, 0.45, 5.0, 2.95);
          T(s, d.title, 0.6, 3.55, 5.0, 1.6, { color: K });
          p(s, d.text, 6.0, 0.95, 3.4, 4.2, { color: K });
        },
        async (d) => { // the picture is a clock face, ringed by its minutes
          const s = await open('faceP', M, 5.6, 2.6); no(s, 8.2, 5.2, M, 13);
          await k.photo(s, d.image, 0.95, 1.2, 3.2, 3.2, { mask: 'circle', gray: true });
          T(s, d.title, 5.6, 0.5, 3.8, 1.35, { max: 20 });
          t.line(s, 5.6, 1.92, 3.8, 0, W, 0.5);
          p(s, d.text, 5.6, 2.05, 3.8, 3.1);
        },
      ],
      cards: [
        async (d) => { // weight at the foot of the page, the night left empty above
          const s = await open(), n = d.items.length, gap = 0.34, w = (8.8 - gap * (n - 1)) / n;
          T(s, d.title, 0.6, 0.45, 7.4, 1.1, { max: 22 });
          no(s, 8.2, 0.3);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), n4 = n === 4, y = n4 ? 2.1 : 2.55;
            t.line(s, x, y - 0.1, w, 0, W, 0.5);
            t.img(s, await L.icon(it.icon, W, 1.25), x, y, 0.3, 0.3);
            h3(s, it.h, x, y + 0.36, w, 0.48);
            p(s, it.t, x, y + 0.86, w, 5.17 - y - 0.86, { max: 12 });
          }
        },
        async (d) => { // a clock: the title at its centre, each item at its hour
          const s = await open('face'), n = d.items.length;
          T(s, d.title, 3.75, 2.1, 2.5, 1.45, { max: 14, min: 10.5, align: 'center', valign: 'middle', spacing: 1 });
          const spots = n === 4 ? [[0.5, 0.45, 'right'], [7.05, 0.45, 'left'], [7.05, 3.15, 'left'], [0.5, 3.15, 'right']] : [[0.5, 0.45, 'right'], [7.05, 1.7, 'left'], [0.5, 3.15, 'right']];
          for (const [i, it] of d.items.entries()) {
            const [x, y, align] = spots[i], w = 2.45;
            t.img(s, await L.icon(it.icon, W, 1.25), align === 'right' ? x + w - 0.3 : x, y, 0.3, 0.3);
            h3(s, it.h, x, y + 0.36, w, 0.46, { align });
            p(s, it.t, x, y + 0.82, w, 1.2, { align, max: 11.5, ls: 1.15 });
          }
          no(s, 8.2, 5.2, M, 13);
        },
        async (d) => { // the white page: heavy black heads across, thin ruled columns under them
          const s = await open('day', KG), n = d.items.length, gap = 0.34, w = (8.8 - gap * (n - 1)) / n; no(s, 8.2, 0.3, K);
          T(s, d.title, 0.6, 0.45, 7.4, 0.95, { color: K, max: 24 });
          t.line(s, 0.6, 1.55, 8.8, 0, K, 1.5);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.img(s, await L.icon(it.icon, K, 1.5), x, 1.72, 0.42, 0.42);
            h3(s, it.h, x, 2.26, w, 0.5, { color: K });
            p(s, it.t, x, 2.78, w, 2.38, { color: KG, max: 13 });
          }
        },
        async (d) => { // full-width rows and hairlines, the title big and alone at the bottom left
          const s = await open(), n = d.items.length, rh = 3.45 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 0.3 + i * rh;
            t.line(s, 0.6, y, 8.8, 0, M, 0.5);
            k.txt(s, String(i + 1).padStart(2, '0'), 0.6, y + 0.08, 0.6, 0.3, { size: 11, bold: true, color: W, font: F.head });
            h3(s, it.h, 1.25, y + 0.08, 2.65, rh - 0.14);
            p(s, it.t, 4.05, y + 0.08, 5.35, rh - 0.12, { max: 12 });
          }
          t.line(s, 0.6, 3.75, 8.8, 0, M, 0.5);
          T(s, d.title, 0.6, 3.88, 7.4, 1.3, { max: 26, valign: 'bottom' });
          no(s, 8.2, 4.5, W);
        },
      ],
      process: [
        async (d) => { // the second hand's scale: big figures on a line, words beneath
          const s = await open('ruler'), n = d.steps.length, gap = 0.34, w = (8.76 - gap * (n - 1)) / n; 
          T(s, d.title, 0.6, 0.3, 7.4, 0.68, { max: 18 });
          no(s, 8.2, 0.3);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            k.head(s, String(i + 1), x, 0.98, w, 0.84, { max: 48, min: 30, color: W, valign: 'bottom' });
            h3(s, st.h, x, 2.2, w, 0.48);
            p(s, st.t, x, 2.7, w, 2.46);
          });
        },
        async (d) => { // the line at twelve: a single hairline down the middle, steps on either side
          const s = await open(), n = d.steps.length, hh = 3.8 / n;
          T(s, d.title, 0.6, 0.3, 7.4, 0.8, { max: 20 });
          no(s, 8.2, 0.3);
          t.line(s, 5, 1.2, 0, 3.95, W, 0.5);
          d.steps.forEach((st, i) => {
            const y = 1.3 + i * hh, left = i % 2 === 0, x = left ? 0.6 : 5.75, al = left ? 'right' : 'left';
            k.head(s, String(i + 1), left ? 4.5 : 5.12, y - 0.02, 0.4, 0.4, { max: 18, min: 14, color: W, align: left ? 'right' : 'left', valign: 'top' });
            h3(s, st.h, left ? 0.6 : 5.6, y, 3.8, 0.3, { align: al });
            p(s, st.t, left ? 0.6 : 5.6, y + 0.3, 3.8, 0.84, { align: al, max: 12 });
          });
        },
        async (d) => { // the white page: down a staircase to the lower right
          const s = await open('day', KG), n = d.steps.length, sx = n === 4 ? 1.55 : 2.1, sy = n === 4 ? 0.93 : 1.22, w = n === 4 ? 4.15 : 4.5;
          T(s, d.title, 0.6, 0.35, 7.2, 0.8, { color: K, max: 20 });
          no(s, 8.2, 0.3, K);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sx, y = 1.28 + i * sy;
            t.line(s, x, y, w, 0, K, 1.25);
            h3(s, `${i + 1}   ${st.h}`, x, y + 0.06, w, 0.28, { color: K });
            p(s, st.t, x, y + 0.34, w, sy - 0.38, { color: KG, max: 11.5, ls: 1.1 });
          });
        },
        async (d) => { // a vast dial rising from the left, the steps set against its minutes
          const s = await open('faceL', M, 3.6, 4.6), n = d.steps.length, hh = 3.9 / n;
          T(s, d.title, 3.3, 0.3, 4.9, 0.85, { max: 18, align: 'left' });
          no(s, 8.2, 0.3);
          const cx = -140 / 160, cy = 450 / 160, RR = 520 / 160;
          d.steps.forEach((st, i) => {
            const y = 1.25 + i * hh, mid = y + hh / 2, x = cx + Math.sqrt(RR * RR - Math.pow(mid - cy, 2)) + 0.3, w = 9.4 - x;
            k.head(s, String(i + 1), x, y, 0.5, 0.5, { max: 24, min: 16, color: W, valign: 'top' });
            h3(s, st.h, x + 0.5, y + 0.03, w - 0.5, 0.3);
            p(s, st.t, x + 0.5, y + 0.33, w - 0.5, hh - 0.37, { max: 12 });
          });
        },
      ],
      stats: [
        async (d) => { // one figure the size of the page, the rest small beneath it
          const s = await open(), [a, b, c] = d.stats;
          k.head(s, a.value, 0.6, 0.25, 8.8, 2.3, { max: 138, min: 48, color: W, valign: 'middle' });
          t.line(s, 0.6, 2.62, 8.8, 0, W, 0.5);
          p(s, a.label, 0.6, 2.72, 2.8, 0.9, { color: W, max: 13 });
          [b, c].forEach((x, i) => { const xx = 3.7 + i * 2.95; k.head(s, x.value, xx, 2.7, 2.75, 0.45, { max: 22, min: 13, color: W, valign: 'top' }); p(s, x.label, xx, 3.17, 2.75, 0.55, { max: 11 }); });
          if (d.note) p(s, d.note, 3.7, 3.75, 5.7, 1.42, { max: 11, min: 9.5, valign: 'bottom' });
          T(s, d.title, 0.6, 3.75, 2.8, 1.42, { max: 14, min: 10.5, valign: 'bottom', spacing: 1 });
          no(s, 8.2, 0.2, M, 13);
        },
        async (d) => { // the white page, three black figures hanging from one rule
          const s = await open('day', KG);
          T(s, d.title, 0.6, 0.4, 7.4, 0.95, { color: K, max: 24 });
          no(s, 8.2, 0.3, K);
          t.line(s, 0.6, 1.5, 8.8, 0, K, 1.5);
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * 3.0;
            if (i) t.line(s, xx - 0.12, 1.5, 0, 2.15, K, 0.5);
            k.head(s, x.value, xx, 1.62, 2.75, 1.12, { max: 46, min: 22, color: K });
            p(s, x.label, xx, 2.78, 2.7, 0.85, { color: KG, max: 13 });
          });
          if (d.note) p(s, d.note, 0.6, 3.82, 8.8, 1.35, { color: KG, max: 12, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // figures flush to the right of a hairline, their words to its left
          const s = await open();
          T(s, d.title, 0.6, 0.3, 7.4, 0.75, { max: 20 });
          no(s, 8.2, 0.3);
          t.line(s, 5.05, 1.15, 0, 2.95, W, 0.5);
          d.stats.forEach((x, i) => {
            const y = 1.15 + i * 1.0;
            p(s, x.label, 0.6, y, 4.2, 0.92, { align: 'right', valign: 'middle', max: 14 });
            k.head(s, x.value, 5.3, y, 4.1, 0.92, { max: 46, min: 22, color: W });
          });
          if (d.note) p(s, d.note, 0.6, 4.2, 8.8, 0.98, { max: 11.5, min: 9.5 });
        },
      ],
      compare: [
        async (d) => { // night and day: the page is cut at the middle
          const s = await open('half', M, 0.6, 3.9);
          T(s, d.title, 0.6, 0.4, 3.9, 1.15, { max: 18 });
          no(s, 8.2, 0.25, K, 28);
          const side = (sd, x, y0, c, b) => {
            h3(s, sd.h, x, y0, 3.9, 0.5, { color: c, max: 15, min: 11, valign: 'middle' });
            const hh = (5.15 - y0 - 0.6) / sd.items.length;
            sd.items.forEach((it, j) => { t.line(s, x, y0 + 0.56 + j * hh, 3.9, 0, c, 0.5); p(s, it, x, y0 + 0.62 + j * hh, 3.9, hh - 0.1, { color: b, max: 14, min: 10.5 }); });
          };
          side(d.left, 0.6, 1.6, W, W);
          side(d.right, 5.5, 1.0, K, K);
        },
        async (d) => { // a ledger across the page, one hairline, grey over white
          const s = await open();
          T(s, d.title, 0.6, 0.28, 7.4, 0.7, { max: 18 });
          no(s, 8.2, 0.28);
          const lay = (sd, y, c, b) => {
            h3(s, sd.h, 0.6, y, 2.4, 1.85, { color: c, max: 15, min: 11 });
            sd.items.forEach((it, j) => p(s, it, 3.2 + (j % 2) * 3.2, y + (j >> 1) * 0.96, 3.0, 0.9, { color: b, max: 13, min: 10.5 }));
          };
          lay(d.left, 1.12, G, G);
          t.line(s, 0.6, 3.1, 8.8, 0, W, 0.5);
          lay(d.right, 3.24, W, W);
        },
      ],
      statement: [
        async (d) => { // nothing but type: caps, huge, hard to the top
          const s = await open();
          k.head(s, L.runs(U(d.text)), 0.6, 0.35, 8.8, 3.4, { max: 42, min: 18, color: W, valign: 'top' });
          t.line(s, 0.6, 3.85, 8.8, 0, W, 0.5);
          T(s, d.title, 0.6, 3.95, 2.8, 1.2, { max: 12, min: 10, spacing: 1, color: G });
          if (d.caption) p(s, d.caption, 3.7, 3.95, 4.5, 1.22, { max: 11.5, min: 9.5 });
          no(s, 8.2, 4.45, W, 40);
        },
        async (d) => { // the white page: words low and black, a large emptiness above
          const s = await open('day', KG);
          no(s, 8.2, 0.3, K);
          T(s, d.title, 0.6, 0.45, 3.2, 1.1, { max: 12, min: 10, color: K, spacing: 1 });
          if (d.caption) p(s, d.caption, 4.0, 0.45, 4.1, 1.75, { color: KG, max: 12 });
          k.head(s, L.runs(d.text), 0.6, 2.3, 8.8, 2.85, { max: 38, min: 18, color: K, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // a scale of minutes across the page, a year on each long mark
          const s = await open('ruler'), w = 1.98, sx = 2.2;
          T(s, d.title, 0.6, 0.3, 7.4, 0.68, { max: 18 });
          no(s, 8.2, 0.3);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * sx;
            k.head(s, it.year, x, 1.1, w, 0.74, { max: 26, min: 14, color: W, valign: 'bottom' });
            h3(s, it.h, x, 2.25, w, 0.34);
            p(s, it.t, x, 2.6, w, 2.56, { max: 12.5 });
          });
        },
        async (d) => { // the white page: a rail on the left, years set against it
          const s = await open('day', KG), rh = 0.96;
          T(s, d.title, 0.6, 0.3, 7.4, 0.8, { color: K, max: 20 });
          no(s, 8.2, 0.3, K);
          t.line(s, 3.2, 1.22, 0, 3.9, K, 1.25);
          d.items.forEach((it, i) => {
            const y = 1.22 + i * rh;
            k.head(s, it.year, 0.6, y, 2.45, rh - 0.1, { max: 24, min: 13, color: K, valign: 'top' });
            t.line(s, 3.2, y + 0.02, 0.18, 0, K, 1.25);
            h3(s, it.h, 3.5, y, 5.9, 0.28, { color: K });
            p(s, it.t, 3.5, y + 0.28, 5.9, rh - 0.33, { color: KG, max: 12 });
          });
        },
        async (d) => { // pendulums: hairlines falling from the top, each year at a different depth
          const s = await open(), w = 1.96, sx = 2.2, ys = [0.95, 1.65, 1.05, 1.8];
          T(s, d.title, 0.75, 0.22, 7.4, 0.55, { max: 15, min: 11 });
          no(s, 8.2, 0.2, M, 13);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * sx, y = ys[i];
            t.line(s, x, 0.8, 0, y - 0.8 + 0.12, W, 0.5);
            k.head(s, it.year, x + 0.1, y, w - 0.1, 0.46, { max: 20, min: 12, color: W, valign: 'top' });
            h3(s, it.h, x + 0.1, y + 0.48, w - 0.1, 0.46);
            p(s, it.t, x + 0.1, y + 0.95, w - 0.1, 5.17 - y - 0.95, { max: 12 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the rows of the cards
    R.stats = V.stats.shift(); // nor the first numbers
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "jiddiy va aniq: ortiqchasiz, kuchli ta'kidlar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["fade", "p14:flythrough|dir=\"in\"", "dissolve"], "cover": ["fadeLetters", "fadeLetters"], "mark": "focusIn", "deco": "fade", "sig": {"title": "fadeLetters", "body": "fade", "item": "focusIn", "image": "dissolve", "number": "focusIn", "order": "together", "stagger": 0.22}, "tempo": 1.35, "kenburns": true};
