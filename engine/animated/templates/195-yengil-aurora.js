/** 195 Yengil aurora — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// the light itself moves: curtains along the top, a glow low on the page or down one side, a night sky, a ribbon and a rising arc (160 px = 1 inch)
const RISE = (x) => 540 - 365 * Math.pow(Math.max(0, (x - 120) / 1200), 1.7); // the arc of the dawn, in px
const line = (f, c, w = 2, dy = 0) => `<path d="M${Array.from({ length: 41 }, (_, i) => `${i * 40},${(f(i * 40) + dy).toFixed(1)}`).join(' L')}" fill="none" stroke="#${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const WAVE = (x) => 464 + 34 * Math.sin((x / 1600) * Math.PI * 3);
module.exports = B({ id: 195, slug: 'yengil-aurora', name: "Yengil aurora", mode: 'left', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1E2A30', muted: '5A6A70', accent: '2F9E8F' }, photo: { r: 0.12 }, rule: false, caps: false, bold: true,
  bg: (kind) => kind === 'night' ? compose(lin([[0,'0E2230'],[1,'132A3C']]), blobs([[260,0,270,'2F9E8F',0.55],[800,0,240,'3A6FB0',0.5],[1380,20,260,'6E4FB0',0.5]],110))
    : kind === 'low' ? compose(flat('FAFCFC'), blobs([[250,920,260,'B9F0D8',0.95],[850,960,260,'BFD9FF',0.95],[1400,920,260,'E4D2FF',0.95]],120))
    : kind === 'side' ? compose(flat('FAFCFC'), blobs([[1620,80,250,'B9F0D8',0.95],[1650,460,250,'BFD9FF',0.95],[1620,860,250,'E4D2FF',0.95]],110))
    : kind === 'pair' ? compose(flat('FAFCFC'), blobs([[120,520,380,'CFF5E4',0.95],[1480,520,380,'E4D2FF',0.95]],130))
    : kind === 'stack' ? compose(flat('FAFCFC'), blobs([[300,260,300,'CFF5E4',0.9],[1300,250,300,'CFF5E4',0.7],[300,760,300,'DCCFFA',0.9],[1300,760,300,'DCCFFA',0.7]],140))
    : kind === 'rise' ? compose(flat('FAFCFC'), blobs([[1500,60,260,'CFF5E4',0.85]],130), raw(line(RISE, '2F9E8F', 3)))
    : kind === 'ribbon' ? compose(flat('FAFCFC'), raw(line(WAVE, '2F9E8F', 2, -7) + line(WAVE, '3A6FB0', 2) + line(WAVE, '7A5AB8', 2, 7)))
    : kind === 'ring' ? compose(flat('FAFCFC'), raw(['B9F0D8','BFD9FF','E4D2FF'].map((c, i) => `<circle cx="1250" cy="610" r="${330 + i * 42}" fill="none" stroke="#${c}" stroke-width="16"/>`).join('')))
    : compose(flat('FAFCFC'), blobs(kind==='cover'?[[300,150,300,'B9F0D8'],[900,100,280,'BFD9FF'],[1450,250,260,'E4D2FF']]:[[200,0,260,'CFF5E4',0.8],[1500,0,260,'D6E6FF',0.8]],140)),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const I = C.ink, M = C.muted, TRI = ['1F7A6E', '2F62A8', '6E4FB0', '137C96'], NI = 'F2FBF8', NM = 'C4DADC', GLOW = ['7FE8C9', '9CC4FF', 'C9B2FF', '8BE3F0'];
    const open = async (kind = 'page', c = M, x = 0.7, w = 8.6) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, c = M) => k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: c, align: 'right', font: F.body, spacing: 1 });
    const T = (s, v, x = 0.7, y = 0.38, w = 8.6, h = 0.95, o = {}) => k.head(s, v, x, y, w, h, { max: 28, min: 14, color: I, valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: I, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: M, ls: 1.25, ...o });
    const V = {
      image: [
        async (d) => { // the night sky, a large picture sliding off the right edge
          const s = await open('night', NM, 0.7, 3.9); no(s, NI);
          await k.photo(s, d.image, 5.05, 0.75, 4.95, 4.1, { mask: { r: 0.25 } });
          T(s, d.title, 0.7, 0.5, 4.0, 1.3, { color: NI, valign: 'top', max: 24 });
          p(s, d.text, 0.7, 1.9, 4.0, 3.25, { color: NM });
        },
        async (d) => { // a round picture nested in rings of soft colour
          const s = await open('ring', M, 0.7, 4.4); no(s);
          await k.photo(s, d.image, 6.0, 1.75, 3.62, 3.62, { mask: 'circle' });
          T(s, d.title, 0.7, 0.42, 5.4, 1.2, { valign: 'top', max: 26 });
          p(s, d.text, 0.7, 1.72, 4.65, 3.42, { color: I, max: 13.5 });
        },
        async (d) => { // words in two columns up top, a calm wide picture beneath
          const s = await open('low'); no(s);
          T(s, d.title, 0.7, 0.45, 3.0, 2.6, { valign: 'top', max: 26 });
          p(s, d.text, 3.95, 0.5, 5.35, 2.6, { color: I });
          await k.photo(s, d.image, 0.7, 3.25, 8.6, 1.92, { mask: { r: 0.2 } });
        },
        async (d) => { // a tall rounded picture on the left, light gathering at the right edge
          const s = await open('side', M, 4.4, 4.9); no(s);
          await k.photo(s, d.image, 0.7, 0.45, 3.3, 4.7, { mask: { r: 0.25 } });
          T(s, d.title, 4.4, 0.5, 4.9, 1.25, { color: TRI[0] });
          p(s, d.text, 4.4, 1.88, 4.9, 3.28, { color: I });
        },
      ],
      cards: [
        async (d) => { // bricks: an upper course to the left, a lower course shifted right
          const s = await open(), n = d.items.length, w = 3.85; no(s);
          T(s, d.title);
          const spots = [[0.7, 1.5], [4.75, 1.5], [1.6, 3.35], [5.45, 3.35]];
          if (n === 3) spots[2] = [2.72, 3.35];
          for (const [i, it] of d.items.entries()) {
            const [x, y] = spots[i];
            t.img(s, await L.icon(it.icon, TRI[i], 1.75), x, y, 0.38, 0.38);
            h3(s, it.h, x + 0.48, y, w - 0.48, 0.38, { color: TRI[i], valign: 'middle' });
            p(s, it.t, x, y + 0.44, w, 1.32, { max: 12.5 });
          }
        },
        async (d) => { // long quiet rows, a short bar of colour opening each
          const s = await open('low'), n = d.items.length, rh = 3.6 / n; no(s);
          T(s, d.title);
          d.items.forEach((it, i) => {
            const y = 1.52 + i * rh;
            t.line(s, 0.7, y + 0.04, 0, rh - 0.2, TRI[i], 3);
            h3(s, it.h, 0.92, y, 2.7, rh - 0.12, { color: TRI[i], max: 15 });
            p(s, it.t, 3.8, y, 5.5, rh - 0.1, { color: I, max: 12.5 });
          });
        },
        async (d) => { // the night page: the columns stand under the curtains of light
          const s = await open('night', NM), n = d.items.length, gap = 0.34, w = (8.6 - gap * (n - 1)) / n; no(s, NI);
          T(s, d.title, 1.3, 0.4, 7.4, 1.0, { color: NI, align: 'center', valign: 'middle' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            t.img(s, await L.icon(it.icon, GLOW[i], 1.5), x + w / 2 - 0.3, 1.55, 0.6, 0.6);
            h3(s, it.h, x, 2.28, w, 0.5, { color: GLOW[i], align: 'center' });
            p(s, it.t, x, 2.8, w, 2.35, { color: NI, align: 'center', max: 12.5 });
          }
        },
        async (d) => { // one item in the light, the rest in a column at the edge
          const s = await open('side', M, 0.7, 4.7), [a, ...rest] = d.items, rh = 3.65 / rest.length; no(s);
          T(s, d.title, 0.7, 0.4, 8.6, 0.9);
          t.img(s, await L.icon(a.icon, TRI[0], 1.5), 0.7, 1.5, 0.75, 0.75);
          k.head(s, a.h, 0.7, 2.32, 4.6, 0.62, { max: 22, min: 13, color: TRI[0], valign: 'top' });
          p(s, a.t, 0.7, 2.98, 4.6, 2.18, { color: I, max: 15, min: 11 });
          for (const [i, it] of rest.entries()) {
            const y = 1.5 + i * rh;
            t.img(s, await L.icon(it.icon, TRI[i + 1], 1.75), 5.75, y, 0.3, 0.3);
            h3(s, it.h, 6.15, y, 3.15, 0.3, { color: TRI[i + 1], valign: 'middle', max: 13 });
            p(s, it.t, 5.75, y + 0.33, 3.55, rh - 0.38, { max: 11.5 });
          }
        },
      ],
      process: [
        async (d) => { // the sun's path at dawn: steps climb the arc
          const s = await open('rise'), n = d.steps.length, w = n === 4 ? 2.02 : 2.62, xs = n === 4 ? [0.75, 2.92, 5.09, 7.26] : [0.75, 3.6, 6.45], top = n === 4 ? 6.3 : 5.4; no(s);
          T(s, d.title, 0.7, 0.38, top, 1.2, { valign: 'top', max: 26 });
          d.steps.forEach((st, i) => {
            const x = xs[i], y = RISE((x + 0.1) * 160) / 160;
            t.oval(s, x, y - 0.09, 0.2, 0.2, TRI[i]);
            h3(s, `${i + 1}  ${st.h}`, x, y + 0.2, w, 0.46, { color: TRI[i], max: 13 });
            p(s, st.t, x, y + 0.66, w, 1.2, { color: I, max: 12, ls: 1.15 });
          });
        },
        async (d) => { // three threads of light run through the page, steps above and below them
          const s = await open('ribbon'), n = d.steps.length, w = 3.95; no(s);
          T(s, d.title, 0.7, 0.3, 8.6, 0.85);
          const xs = n === 4 ? [0.7, 1.55, 5.0, 5.75] : [0.7, 3.0, 5.35];
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.25 : 3.35, cy = WAVE((x + 0.1) * 160) / 160;
            t.oval(s, x + 0.02, cy - 0.11, 0.22, 0.22, TRI[i]);
            h3(s, `${i + 1}  ${st.h}`, x, y, Math.min(w, 9.3 - x), 0.32, { color: TRI[i] });
            p(s, st.t, x, y + 0.33, Math.min(w, 9.3 - x), up ? 1.0 : 1.45, { color: I, max: 12.5 });
          });
        },
        async (d) => { // the night page: a gentle cascade toward the lower right
          const s = await open('night', NM), n = d.steps.length, hh = 3.7 / n, sx = n === 4 ? 0.85 : 1.2; no(s, NI);
          T(s, d.title, 0.7, 0.3, 7.5, 0.95, { color: NI });
          d.steps.forEach((st, i) => {
            const y = 1.42 + i * hh, x = 0.7 + i * sx, w = 6.0;
            k.head(s, String(i + 1), x, y, 0.55, hh - 0.08, { max: 34, min: 22, color: GLOW[i], valign: 'top' });
            h3(s, st.h, x + 0.58, y + 0.02, w - 0.58, 0.3, { color: GLOW[i] });
            p(s, st.t, x + 0.58, y + 0.32, w - 0.58, hh - 0.36, { color: NI, max: 12 });
          });
        },
        async (d) => { // the title holds the left, a rail of dots leads down the right
          const s = await open('side', M, 0.7, 2.9), n = d.steps.length, hh = 4.72 / n; no(s);
          T(s, d.title, 0.7, 0.45, 3.1, 3.2, { valign: 'top', max: 28 });
          t.line(s, 4.25, 0.55, 0, 4.5, M, 0.75);
          d.steps.forEach((st, i) => {
            const y = 0.45 + i * hh;
            t.oval(s, 4.13, y + 0.04, 0.24, 0.24, TRI[i]);
            h3(s, st.h, 4.6, y, 4.7, 0.32, { color: TRI[i], valign: 'middle' });
            p(s, st.t, 4.6, y + 0.34, 4.7, hh - 0.4, { color: I, max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // the night page, the leading figure glowing, two small ones under the note
          const s = await open('night', NM), [a, ...rest] = d.stats; no(s, NI);
          T(s, d.title, 0.7, 0.3, 7.5, 0.85, { color: NI, max: 24 });
          k.head(s, a.value, 0.7, 1.3, 5.3, 1.95, { max: 88, min: 40, color: GLOW[0] });
          p(s, a.label, 0.7, 3.3, 4.9, 0.72, { color: NI, max: 15, min: 11 });
          rest.forEach((x, i) => {
            const y = 1.42 + i * 1.3;
            k.head(s, x.value, 6.3, y, 3.0, 0.62, { max: 32, min: 16, color: GLOW[i + 1], valign: 'top' });
            p(s, x.label, 6.3, y + 0.62, 3.0, 0.62, { color: NI, max: 12 });
          });
          if (d.note) p(s, d.note, 0.7, 4.08, 8.6, 1.08, { color: NM, max: 11.5, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // the title and the note on the left, the figures stepping down the right in their colours
          const s = await open('stack', M, 0.7, 3.5); no(s);
          T(s, d.title, 0.7, 0.45, 3.5, 2.0, { valign: 'top', max: 26 });
          if (d.note) p(s, d.note, 0.7, 2.6, 3.5, 2.55, { color: I, valign: 'bottom', max: 12, min: 10, ls: 1.2 });
          d.stats.forEach((x, i) => {
            const y = 0.5 + i * 1.58;
            k.head(s, x.value, 4.75, y, 4.55, 0.92, { max: 54, min: 24, color: TRI[i], valign: 'bottom' });
            p(s, x.label, 4.75, y + 0.95, 4.55, 0.55, { color: I, max: 13, min: 10.5 });
          });
        },
      ],
      compare: [
        async (d) => { // two glows facing each other, the sides reading out from the middle
          const s = await open('pair'), w = 3.95; no(s);
          T(s, d.title, 0.7, 0.32, 8.6, 0.9, { align: 'center' });
          k.head(s, d.left.h, 0.7, 1.35, w, 0.5, { max: 19, min: 12, color: TRI[0], align: 'right' });
          k.head(s, d.right.h, 5.35, 1.35, w, 0.5, { max: 19, min: 12, color: TRI[2] });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.24, 3.15);
          let y = 2.0;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: I, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: I });
            y += rh;
          });
        },
        async (d) => { // a green dusk above, a violet one below: each band a heading and its list
          const s = await open('stack'); no(s);
          T(s, d.title, 0.7, 0.3, 7.6, 0.72, { max: 22 });
          const band = (sd, y, c) => {
            k.head(s, sd.h, 0.7, y, 2.35, 1.95, { max: 22, min: 13, color: c, valign: 'top' });
            sd.items.forEach((it, j) => p(s, it, 3.25 + (j % 2) * 3.1, y + (j >> 1) * 1.0, 2.95, 0.94, { color: I, max: 13, min: 10.5 }));
          };
          band(d.left, 1.15, TRI[0]);
          band(d.right, 3.2, TRI[2]);
        },
      ],
      statement: [
        async (d) => { // under the night sky, the words large on the left, the caption tucked below
          const s = await open('night', NM); no(s, NI);
          k.head(s, d.title, 0.7, 0.48, 7.0, 0.45, { max: 15, min: 11, color: GLOW[0], valign: 'top' });
          k.head(s, L.runs(d.text), 0.7, 1.05, 8.6, 2.75, { max: 38, min: 18, color: NI, valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.7, 3.92, 7.2, 1.25, { color: NM, max: 12.5 });
        },
        async (d) => { // low on the page, the glow under the words; the caption hangs top right
          const s = await open('low'); no(s);
          k.head(s, d.title, 0.7, 0.5, 3.4, 1.4, { max: 18, min: 12, color: TRI[0], valign: 'top' });
          if (d.caption) p(s, d.caption, 4.6, 0.52, 4.7, 1.75, { max: 12.5 });
          k.head(s, L.runs(d.text), 0.7, 2.35, 8.6, 2.82, { max: 36, min: 17, color: I, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // a low horizon: four points of colour, the columns of years above it
          const s = await open('low'), w = 1.98, gap = 0.227, ly = 4.92; no(s);
          T(s, d.title, 0.7, 0.36, 8.6, 0.95);
          t.line(s, 0.7, ly, 8.6, 0, M, 0.75);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 1.48, w, 0.6, { max: 26, min: 14, color: TRI[i], valign: 'bottom' });
            h3(s, it.h, x, 2.14, w, 0.32, { max: 13 });
            p(s, it.t, x, 2.48, w, 2.34, { color: I, max: 12.5 });
            t.oval(s, x, ly - 0.09, 0.18, 0.18, TRI[i]);
          });
        },
        async (d) => { // four quiet rooms, the year large and tinted in the corner of each
          const s = await open(), w = 4.15, hh = 1.76; no(s);
          T(s, d.title, 0.7, 0.3, 8.6, 0.82);
          d.items.forEach((it, i) => {
            const x = 0.7 + (i % 2) * (w + 0.3), y = 1.22 + (i >> 1) * (hh + 0.1);
            k.head(s, it.year, x, y, 1.55, hh - 0.1, { max: 25, min: 13, color: TRI[i], valign: 'top' });
            h3(s, it.h, x + 1.65, y, w - 1.65, 0.46, { max: 13 });
            p(s, it.t, x + 1.65, y + 0.46, w - 1.65, hh - 0.52, { max: 12, color: I });
          });
        },
        async (d) => { // the night page: a central line, events to either side of it in turn
          const s = await open('night', NM), rh = 0.96; no(s, NI);
          T(s, d.title, 1.3, 0.25, 7.4, 0.85, { color: NI, align: 'center' });
          t.line(s, 5, 1.22, 0, 3.92, NI, 0.75);
          d.items.forEach((it, i) => {
            const y = 1.22 + i * rh, left = i % 2 === 0;
            t.oval(s, 4.91, y + 0.08, 0.18, 0.18, GLOW[i]);
            k.head(s, it.year, left ? 5.25 : 1.75, y, 3.0, rh - 0.1, { max: 26, min: 14, color: GLOW[i], align: left ? 'left' : 'right', valign: 'top' });
            const x = left ? 0.7 : 5.25, al = left ? 'right' : 'left';
            h3(s, it.h, x, y, 4.05, 0.3, { color: NI, align: al, max: 13 });
            p(s, it.t, x, y + 0.3, 4.05, rh - 0.34, { color: NM, align: al, max: 11.5, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the columns of the cards
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "yangi tong: optimistik, aniq va tartibli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["dissolve", "fade", "morph"], "cover": ["fadeWords", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "focusIn", "body": "fade", "item": "arcRight", "image": "dissolve", "number": "focusIn", "order": "diagonal", "stagger": 0.24}, "tempo": 1.35, "kenburns": true};
