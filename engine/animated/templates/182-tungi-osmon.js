/** 182 Tungi osmon — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 182, slug: 'tungi-osmon', name: "Tungi osmon", mode: 'center', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'EEF1FF', muted: 'A9B1D6', accent: 'FFD27A' }, photo: 'circle', rule: false, caps: false, bold: false,
  bg: (kind) => compose(lin([[0,'0A0F2C'],[1,'1E2A5C']]), raw(Array.from({length:120},(_,i)=>`<circle cx="${(i*137)%1600}" cy="${(i*271)%(kind==='page'?500:900)}" r="${1+(i%3)*0.6}" fill="#fff" opacity="${0.25+(i%5)*0.12}"/>`).join(''))),
  // the wide night sky: moon phases, a telescope's round view, a constellation joined by fine lines, an orbit, the arc of the sky; all on the centre line unless the moon pulls it aside
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s) => k.foot(s, { x: 1, w: 8, y: 5.3, size: 7.5, color: C.muted, align: 'center' });
    const open = async (d, x = 1, y = 0.35, w = 8, h = 0.9, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, bold: false, align: 'center', valign: 'bottom', ...o }); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.22, align: 'center', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, bold: false, align: 'center', valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, bold: false, align: 'center', ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.5, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const seg = (s, x1, y1, x2, y2, wt = 0.5) => ln(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), wt, (x2 - x1) * (y2 - y1) < 0 ? { flipV: true } : {});
    const ring = (s, x, y, w, h = w, wt = 0.5) => t.oval(s, x, y, w, h, null, { line: { color: C.accent, width: wt } });
    const star = (s, cx, cy, D = 0.13) => t.oval(s, cx - D / 2, cy - D / 2, D, D, C.accent, { name: 'Star' });
    const phase = async (s, f, x, y, D) => { const rx = Math.abs(1 - 2 * f) * 48; t.img(s, await k.svg(`ph${Math.round(f * 100)}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="#${C.accent}" stroke-width="1"/><path d="M50,2 A48,48 0 0 1 50,98 A${rx.toFixed(1)},48 0 0 ${f < 0.5 ? 0 : 1} 50,2 Z" fill="#${C.accent}"/></svg>`, 200, 200), x, y, D, D, { alt: '' }); };
    const NIGHT = { duo: ['0A0F2C', 'C6D0FF'] };
    const V = {
      image: [
        async (d) => { // the picture in a crescent moon, the words in the dark beside it
          const s = await open(d, 4.2, 0.45, 5.2, 1.05);
          await k.photo(s, d.image, 0.4, 0.35, 4.75, 4.75, { mask: { path: 'M0.72,0.05 A0.5,0.5 0 1 0 0.72,0.95 A0.55,0.55 0 0 1 0.72,0.05 Z' } });
          p(s, d.text, 4.2, 1.6, 5.2, 3.52);
        },
        async (d) => { // through the telescope: the round view, its rings and marks
          const s = await open(d, 0.6, 0.45, 4.3, 1.05);
          const D = 4.7, x = 5.05, y = 0.28, c = 0.32;
          ring(s, x, y, D); await k.photo(s, d.image, x + c, y + c, D - 2 * c, D - 2 * c, { mask: 'circle' });
          [[x + D / 2, y, 0, c * 0.6], [x + D / 2, y + D - c * 0.6, 0, c * 0.6], [x, y + D / 2, c * 0.6, 0], [x + D - c * 0.6, y + D / 2, c * 0.6, 0]].forEach(([a, b, w, h]) => ln(s, a, b, w, h, 0.75));
          p(s, d.text, 0.6, 1.6, 4.3, 3.52);
        },
        async (d) => { // a month of nights: one picture seen through a row of swelling and waning moons
          const s = await open(d, 1, 2.1, 8, 0.7, { max: 22 });
          const rs = [0.2, 0.3, 0.5, 0.3, 0.2], gap = 0.03, total = rs.reduce((a, b) => a + 2 * b, 0) * 2.0 + gap * 4 * 8.6;
          let cx = (8.6 - total) / 2; const parts = rs.map((r) => { const R0 = r * 2.0, X = (cx + R0) / 8.6, rx = R0 / 8.6, ry = r; cx += 2 * R0 + gap * 8.6; return `M${(X - rx).toFixed(4)},0.5 a${rx.toFixed(4)},${ry} 0 1 1 ${(2 * rx).toFixed(4)},0 a${rx.toFixed(4)},${ry} 0 1 1 ${(-2 * rx).toFixed(4)},0 Z`; });
          await k.photo(s, d.image, 0.7, 0.1, 8.6, 2.0, { mask: { path: parts.join(' ') } });
          p(s, d.text, 1, 2.88, 8, 2.28, { max: 13.5 });
        },
        async (d) => { // the picture sunk into the night over the whole page, words floating on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625, NIGHT);
          t.rect(s, 0, 0, 10, 5.625, '0A0F2C', { t: 25, name: 'Night' });
          k.head(s, d.title, 1.5, 0.4, 7, 1.0, { max: 26, min: 14, color: TI, bold: false, align: 'center', valign: 'bottom' });
          star(s, 5, 1.52);
          p(s, d.text, 1.5, 1.68, 7, 3.45, { max: 14.5 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // quiet columns, a fine ring round each icon
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, D = 0.72;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), cx = x + w / 2;
            ring(s, cx - D / 2, 1.48, D);
            t.img(s, await L.icon(it.icon, C.accent, 1.25), cx - 0.19, 1.67, 0.38, 0.38);
            h3(s, it.h, x, 2.28, w, 0.54);
            p(s, it.t, x, 2.84, w, 2.28, { max: 13.5 });
          }
        },
        async (d) => { // an orbit: the title at the centre of a wide ellipse, the items out beyond it
          const s = await open({}), n = d.items.length, w = 3.95, ey = 2.0, eh = 1.55;
          ring(s, 2.6, ey, 4.8, eh); star(s, 2.95, ey + 0.32, 0.16); star(s, 6.95, ey + eh - 0.3, 0.11);
          k.head(s, d.title, 3.25, ey + 0.2, 3.5, eh - 0.4, { max: 18, min: 11, color: TI, bold: false, align: 'center' });
          d.items.forEach((it, i) => {
            const whole = n === 3 && i === 2, up = i < 2, x = whole ? 2 : i % 2 ? 5.35 : 0.7, y = up ? 0.35 : 3.62, ww = whole ? 6 : w;
            h3(s, it.h, x, y, ww, 0.3, { valign: 'middle', max: 14 });
            p(s, it.t, x, y + 0.32, ww, up ? 1.28 : 1.2, { max: 13 });
          });
        },
        async (d) => { // the two sides of the sky about a fine line, each item leaning toward it
          const s = await page(d), n = d.items.length, w = 4.0, H = 1.8;
          ln(s, 5, 1.5, 0, n === 3 ? 1.7 : 3.6);
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, r = i % 2, x = whole ? 2 : r ? 5.25 : 0.75, y = 1.46 + Math.floor(i / 2) * H, ww = whole ? 6 : w, a = whole ? 'center' : r ? 'left' : 'right';
            h3(s, it.h, x, y, ww, 0.32, { align: a, valign: 'middle', max: 14 });
            p(s, it.t, x, y + 0.34, ww, H - 0.4, { align: a, max: 13 });
          }
        },
        async (d) => { // shooting stars: each item further along and lower, a thin trail behind its star
          const s = await open(d, 1, 0.26, 8, 0.72, { max: 22 }), n = d.items.length, H = 4.1 / n, dx = n === 4 ? 1.1 : 1.6, w = 5.1;
          d.items.forEach((it, i) => {
            const x = 0.75 + i * dx, y = 1.05 + i * H;
            ln(s, Math.max(0, x - 1.0), y + 0.16, Math.min(1.0, x) - 0.08);
            star(s, x, y + 0.16);
            h3(s, it.h, x + 0.16, y, w, 0.32, { align: 'left', valign: 'middle', max: 14 });
            p(s, it.t, x + 0.16, y + 0.33, w, H - 0.37, { align: 'left', max: 12.5, ls: 1.12 });
          });
        },
      ],
      process: [
        async (d) => { // the words above; along a line at the foot the moon fills, night by night, step by step
          const s = await page(d), n = d.steps.length, gap = 0.28, w = (8.8 - gap * (n - 1)) / n, D = 0.7, ly = 4.68;
          ln(s, 0.6, ly, 8.8);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), cx = x + w / 2;
            h3(s, `${i + 1}.  ${st.h}`, x, 1.42, w, 0.54, { max: 14 });
            p(s, st.t, x, 1.98, w, 2.22, { max: 13.5 });
            t.oval(s, cx - D / 2, ly - D / 2, D, D, '141C48', { name: 'Sky' });
            await phase(s, (i + 1) / n, cx - D / 2, ly - D / 2, D);
          }
        },
        async (d) => { // a constellation: stars joined down the middle of the page, each step beside its star
          const s = await open(d, 1, 0.22, 8, 0.72, { max: 22 }), n = d.steps.length, H = 4.1 / n, w = 3.75;
          const pos = d.steps.map((_, i) => [i % 2 ? 5.45 : 4.55, 1.1 + i * H + 0.16]);
          pos.slice(1).forEach((q, i) => seg(s, pos[i][0], pos[i][1], q[0], q[1]));
          d.steps.forEach((st, i) => {
            const [cx, cy] = pos[i], l = i % 2 === 0, x = l ? cx - 0.22 - w : cx + 0.22, y = cy - 0.16, a = l ? 'right' : 'left';
            star(s, cx, cy, 0.17);
            h3(s, st.h, x, y, w, 0.32, { align: a, valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.33, w, H - 0.37, { align: a, max: 12.5, ls: 1.12 });
          });
        },
        async (d) => { // the title stands to the left, a thread with numbered rings falls beside it, the steps to its right
          const s = await open(d, 0.6, 0.5, 2.9, 2.6, { max: 26, align: 'right', valign: 'top' }), n = d.steps.length, H = 4.62 / n, D = 0.44, cx = 4.05;
          ln(s, cx, 0.5, 0, 4.62);
          d.steps.forEach((st, i) => {
            const y = 0.5 + i * H;
            t.oval(s, cx - D / 2, y, D, D, '121A44', { line: { color: C.accent, width: 0.75 } });
            k.txt(s, String(i + 1), cx - D / 2, y, D, D, { size: 13, color: C.accent, font: F.head, align: 'center', valign: 'middle', ls: 1 });
            h3(s, st.h, 4.5, y + 0.02, 4.9, 0.36, { align: 'left', valign: 'middle' });
            p(s, st.t, 4.5, y + 0.4, 4.9, H - 0.46, { align: 'left', max: 13.5 });
          });
        },
        async (d) => { // four quarters of the sky about one bright star, the title low on the page
          const s = await open(d, 1, 4.4, 8, 0.75, { max: 22, valign: 'middle' }), n = d.steps.length, w = 4.05, H = 1.98;
          ln(s, 0.7, 2.36, 8.6); ln(s, 5, 0.42, 0, n === 3 ? 1.94 : 3.88);
          star(s, 5, 2.36, 0.2);
          d.steps.forEach((st, i) => {
            const whole = n === 3 && i === 2, x = whole ? 2 : i % 2 ? 5.25 : 0.7, y = i < 2 ? 0.4 : 2.48, ww = whole ? 6 : w;
            h3(s, `${i + 1}.  ${st.h}`, x, y, ww, 0.34, { valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.36, ww, 1.52, { max: 13.5 });
          });
        },
      ],
      stats: [
        async (d) => { // the full moon of a figure at the centre, its two companions out to the sides
          const s = await open(d, 1, 0.2, 8, 0.66, { max: 22 }), [a, b, c] = d.stats, D = 2.75;
          ring(s, 5 - D / 2, 0.92, D, D, 0.75);
          fig(s, a.value, 5 - D / 2 + 0.25, 1.35, D - 0.5, 1.0, { max: 40, min: 18 });
          p(s, a.label, 5 - D / 2 + 0.4, 2.35, D - 0.8, 0.85, { max: 11.5 });
          [[b, 0.7], [c, 6.9]].forEach(([x, xx]) => {
            k.head(s, x.value, xx, 1.45, 2.4, 0.75, { max: 30, min: 14, color: C.ink, bold: false, align: 'center' });
            p(s, x.label, xx, 2.22, 2.4, 0.85, { max: 12.5 });
          });
          if (d.note) p(s, d.note, 1.2, 3.82, 7.6, 1.3, { max: 12.5, color: C.muted });
        },
        async (d) => { // down the centre line: figure to the left, a star, its words to the right
          const s = await page(d), H = d.note ? 0.9 : 1.15;
          ln(s, 5, 1.5, 0, 3 * H - 0.05);
          d.stats.forEach((x, i) => {
            const y = 1.48 + i * H;
            fig(s, x.value, 0.8, y, 3.9, H - 0.08, { max: 36, min: 18, align: 'right' });
            star(s, 5, y + (H - 0.08) / 2, 0.15);
            p(s, x.label, 5.3, y, 3.9, H - 0.08, { align: 'left', valign: 'middle', max: 14 });
          });
          if (d.note) p(s, d.note, 1.2, 4.26, 7.6, 0.88, { max: 12, color: C.muted, ls: 1.12 });
        },
      ],
      compare: [
        async (d) => { // waxing and waning: a half-lit moon at the head of the line, the two sides mirrored
          const s = await page(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.18, 2.9);
          h3(s, d.left.h, 0.6, 1.4, w, 0.58, { max: 19, align: 'right', valign: 'middle', color: C.ink });
          h3(s, d.right.h, 5.45, 1.4, w, 0.58, { max: 19, align: 'left', valign: 'middle' });
          await phase(s, 0.5, 4.8, 1.49, 0.4); ln(s, 5, 1.92, 0, 3.2);
          let y = 2.12;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.45, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // above the horizon and below it, each centred
          const s = await open(d, 1, 0.2, 8, 0.66, { max: 22 }), ly = 3.0;
          ln(s, 0, ly, 10, 0, 0.75);
          [[d.left, 0.92, C.ink], [d.right, ly + 0.06, C.accent]].forEach(([sd, y, c]) => {
            k.head(s, sd.h, 1, y, 8, 0.36, { max: 16, min: 11, color: c, bold: false, align: 'center', valign: 'middle' });
            const hh = 1.62 / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, 1, y + 0.4 + j * hh, 8, hh, { max: 13, valign: 'middle', ls: 1.05 }));
          });
        },
      ],
      statement: [
        async (d) => { // a thin new moon over the sentence, the title under it, the note last
          const s = await open(d, 1, 3.72, 8, 0.4, { max: 14, min: 10.5, color: C.accent, valign: 'middle' }, 'focus');
          await phase(s, 0.2, 4.55, 0.3, 0.9);
          k.head(s, L.runs(d.text), 0.8, 1.25, 8.4, 2.42, { max: 34, min: 16, color: C.ink, bold: false, align: 'center' });
          if (d.caption) p(s, d.caption, 1.3, 4.12, 7.4, 1.04, { max: 11.5, min: 10, color: C.muted, ls: 1.08 });
        },
        async (d) => { // away from the centre for once: the sentence low and to the left, the title and note in the high right sky
          const s = await open(d, 5.6, 0.4, 3.8, 0.5, { max: 14, min: 10.5, color: C.accent, align: 'right', valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 5.6, 0.92, 3.8, 1.72, { align: 'right', max: 11.5, color: C.muted, ls: 1.1 });
          k.head(s, L.runs(d.text), 0.7, 2.2, 7.4, 2.92, { max: 34, min: 16, color: C.ink, bold: false, italic: true, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // the arc of the sky: four stars on it, each with its year, the words hanging below
          const s = await open(d, 1, 0.2, 8, 0.66, { max: 22 }), gap = 0.25, w = (9 - gap * 3) / 4, ys = [1.95, 1.3, 1.3, 1.95];
          t.img(s, await k.svg('sky', `<svg xmlns="http://www.w3.org/2000/svg" width="940" height="110"><path d="M2,108 C200,-30 740,-30 938,108" fill="none" stroke="#${C.accent}" stroke-width="1"/></svg>`, 940, 110), 0.3, 1.0, 9.4, 1.1, { alt: '' });
          d.items.forEach((it, i) => {
            const x = 0.5 + i * (w + gap), y = ys[i];
            fig(s, it.year, x, y + 0.02, w, 0.5, { max: 22, min: 11 });
            h3(s, it.h, x, y + 0.54, w, 0.5, { color: C.ink, max: 13.5 });
            p(s, it.t, x, y + 1.06, w, 5.12 - y - 1.06, { max: 12.5, ls: 1.12 });
          });
        },
        async (d) => { // a line down the page: events to one side and the other, the years held on the line
          const s = await open(d, 1, 0.22, 8, 0.72, { max: 22 }), H = 1.02, w = 3.65;
          ln(s, 5, 1.05, 0, 4.08);
          d.items.forEach((it, i) => {
            const y = 1.06 + i * H, l = i % 2 === 0, x = l ? 5 - 0.72 - w : 5 + 0.72, a = l ? 'right' : 'left';
            t.oval(s, 4.35, y + 0.03, 1.3, 0.34, '10173E', { line: { color: C.accent, width: 0.5 } });
            k.head(s, it.year, 4.4, y + 0.03, 1.2, 0.34, { max: 12, min: 8.5, color: C.accent, bold: false, align: 'center' });
            h3(s, it.h, x, y, w, 0.3, { align: a, valign: 'middle', max: 13.5 });
            p(s, it.t, x, y + 0.31, w, 0.72, { align: a, max: 12, ls: 1.12 });
          });
        },
        async (d) => { // four nights in a month, two and two: the moon's phase, its year, its entry
          const s = await page(d), w = 4.15, H = 1.82, D = 0.62;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + (i % 2) * (w + 0.3), y = 1.42 + Math.floor(i / 2) * H;
            await phase(s, (i + 1) / 4, x, y + 0.02, D);
            fig(s, it.year, x + D + 0.14, y, w - D - 0.14, 0.42, { max: 22, min: 12, align: 'left' });
            h3(s, it.h, x + D + 0.14, y + 0.42, w - D - 0.14, 0.28, { align: 'left', valign: 'middle', color: C.ink, max: 13.5 });
            p(s, it.t, x, y + 0.74, w, H - 0.8, { align: 'left', max: 12.5, ls: 1.12 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process and timeline are the rows of the cards
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "keng ufq: orzuli, sokin va chuqur fikrli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "energetic"], "transitions": ["p14:flythrough|dir=\"in\"", "fade", "p14:vortex|dir=\"l\""], "cover": ["fadeLetters", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "fadeLetters", "body": "fade", "item": "dissolve", "image": "focusIn", "number": "focusIn", "order": "diagonal", "stagger": 0.2}, "tempo": 1.25, "kenburns": true};
