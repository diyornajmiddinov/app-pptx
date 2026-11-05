/** 159 Pleer — a VIDEO PLAYER: a big screen with a play button, a scrub bar split into CHAPTERS (one per idea), and a chapter list panel on the right with thumbnails. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0F0F0F', screen: '1C1C1C', panel: '181818', ink: 'F1F1F1', muted: 'AAAAAA', red: 'FF0033', track: '3F3F3F' };
const F = { head: 'Arial', body: 'Arial' };
const SX = 0.3, SY = 0.3, SW = 6.2, SH = 3.5;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const play = (s, cx, cy, d = 0.8) => { t.oval(s, cx - d / 2, cy - d / 2, d, d, '000000', { t: 40 }); t.shape(s, 'ISOSCELES_TRIANGLE', { x: cx - d * 0.15, y: cy - d * 0.22, w: d * 0.44, h: d * 0.44, rotate: 90, fill: { color: 'FFFFFF' }, objectName: 'Play' }); };
  // scrub bar with n chapter segments; cur = active chapter
  const scrub = (s, n, cur) => { const y = SY + SH + 0.12, w = SW, seg = w / n; for (let i = 0; i < n; i++) t.rect(s, SX + i * seg + 0.02, y, seg - 0.04, 0.07, i <= cur ? C.red : C.track, { name: 'Chapter' }); t.oval(s, SX + (cur + 0.6) * seg - 0.08, y - 0.045, 0.16, 0.16, C.red); k.txt(s, `\u25B6  \u25AE\u25AE  \u{1F50A}   ${cur + 1} / ${n}`, SX, y + 0.12, 3.5, 0.3, { size: 9, color: C.muted, valign: 'middle' }); };
  const screen = (s) => t.rect(s, SX, SY, SW, SH, C.screen, { r: 0.06, name: 'Screen' });
  const titleUnder = (s, title) => { if (title) k.head(s, title, SX, SY + SH + 0.5, SW, 0.55, { max: 18, min: 11, color: C.ink, valign: 'top' }); k.txt(s, `${k.M.author || ''} \u2022 ${k.M.org || ''}`, SX, SY + SH + 1.02, SW, 0.28, { max: 9, color: C.muted }); };
  // chapter list panel on the right
  const chapters = (s, list, cur) => { t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Chapters' }); const n = list.length, rh = 4.8 / n; list.forEach(([h2, tx], i) => { const y = SY + 0.1 + i * rh; if (i === cur) t.rect(s, 6.8, y, 2.85, rh - 0.04, '2A2A2A', { r: 0.04, name: 'Active' }); t.rect(s, 6.88, y + 0.06, 0.62, Math.min(0.42, rh - 0.16), i === cur ? C.red : C.track, { r: 0.03, name: 'Thumb' }); k.txt(s, String(i + 1).padStart(2, '0'), 6.88, y + 0.06, 0.62, Math.min(0.42, rh - 0.16), { size: 10, bold: true, color: C.ink, align: 'center', valign: 'middle' }); k.txt(s, [{ text: h2, options: { bold: true, color: C.ink } }, ...(tx ? [{ text: '\n' + tx, options: { color: C.muted } }] : [])], 7.58, y, 2.02, rh - 0.04, { max: 10, min: 7, valign: 'middle', ls: 1.1 }); }); };
  const page = (d) => { const s = k.slide(C.bg); screen(s); return s; };
  const foot = (s) => k.foot(s, { x: SX, y: 5.32, w: 9.4, size: 7, color: '777777' });
  // main screen shows the first item large; panel lists all (chapter 1 active)
  const feature = (s, h2, tx, d, list) => { k.head(s, h2, SX + 0.4, SY + 0.35, SW - 0.8, 0.7, { max: 26, min: 14, color: C.ink }); k.txt(s, tx || '', SX + 0.4, SY + 1.1, SW - 0.8, SH - 1.3, { max: 15, min: 9.5, color: 'DDDDDD', ls: 1.3 }); scrub(s, list.length, 0); titleUnder(s, d.title); chapters(s, list, 0); foot(s); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); screen(s); if (d.image) await k.photo(s, d.image, SX, SY, SW, SH, { mask: { r: 0.06 } }); play(s, SX + SW / 2, SY + SH / 2, 1.0); scrub(s, 5, 0); k.head(s, d.title, SX, SY + SH + 0.5, SW, 0.6, { max: 20, min: 12, color: C.ink, valign: 'top' }); k.txt(s, `${k.M.author || ''} \u2022 ${k.org3}`, SX, SY + SH + 1.1, SW, 0.3, { max: 10, color: C.muted });
      t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.subtitle || k.M.topic || '', 6.95, SY + 0.2, 2.6, 4.6, { max: 13, color: 'DDDDDD', valign: 'top' }); foot(s); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, SX, SY, SW, SH, { mask: { r: 0.06 } }); play(s, SX + SW / 2, SY + SH / 2); scrub(s, 4, 0); titleUnder(s, d.title); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.text, 6.95, SY + 0.15, 2.6, 4.7, { max: 12, min: 8.5, color: 'DDDDDD', ls: 1.25, valign: 'top' }); foot(s); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); play(s, SX + SW / 2, SY + SH / 2, 1.1); scrub(s, d.items.length, 0); titleUnder(s, d.title); chapters(s, d.items.map((it) => [it, '']), 0); foot(s); },
    async cards(d) { const s = page(d); feature(s, d.items[0].h, d.items[0].t, d, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); feature(s, `1. ${d.steps[0].h}`, d.steps[0].t, d, d.steps.map((st) => [st.h, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = (SW - 0.6) / n; d.stats.forEach((v, i) => { k.head(s, v.value, SX + 0.3 + i * w, SY + 0.6, w - 0.1, 1.2, { max: 44, min: 16, color: i ? C.ink : C.red, align: 'center' }); k.txt(s, v.label, SX + 0.3 + i * w, SY + 1.9, w - 0.1, 1.4, { max: 12, color: C.muted, align: 'center' }); }); scrub(s, n, n - 1); titleUnder(s, d.title); chapters(s, [...d.stats.map((v) => [v.value, v.label]), ...(d.note ? [['\u2020', d.note]] : [])], 0); foot(s); },
    async compare(d) { const s = page(d), w = SW / 2 - 0.35, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, SH - 0.75); [d.left, d.right].forEach((sd, i) => { const x = SX + 0.25 + i * (w + 0.2); k.head(s, sd.h, x, SY + 0.15, w, 0.45, { max: 15, color: i ? C.ink : C.red }); let y = SY + 0.65; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: 'DDDDDD' }); y += rr[j]; }); }); t.line(s, SX + SW / 2, SY + 0.2, 0, SH - 0.4, C.track, 1); scrub(s, 2, 1); titleUnder(s, d.title); chapters(s, [[d.left.h, ''], [d.right.h, '']], 0); foot(s); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), SX + 0.4, SY + 0.3, SW - 0.8, SH - 0.6, { max: 28, min: 13, color: C.ink, align: 'center' }); scrub(s, 3, 1); titleUnder(s, d.title); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.caption || '', 6.95, SY + 0.15, 2.6, 4.7, { max: 12, color: C.muted, valign: 'middle' }); foot(s); },
    async timeline(d) { const s = page(d); feature(s, `${d.items[0].year} \u2022 ${d.items[0].h}`, d.items[0].t, d, d.items.map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, SX + 0.4, SY + 0.3, SW - 0.8, SH - 0.6, { max: 26, min: 13, italic: true, color: C.ink, align: 'center' }); scrub(s, 3, 2); titleUnder(s, d.author || ''); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); foot(s); },
    async sources(d) { const s = page(d); play(s, SX + SW / 2, SY + SH / 2, 0.9); scrub(s, d.items.length, d.items.length - 1); titleUnder(s, d.title); chapters(s, d.items.map((it) => [it, '']), d.items.length - 1); foot(s); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: full screen with subtitles, the phone, the video grid, live chat, the editor's tracks, the light theme (L.pages)
  const LIGHT = 'FFFFFF', LINK = '065FD4', GREY = 'F2F2F2', LINE = 'D9D9D9', SOFT = '606060', DEEPRED = 'C4002B', CLIP = '8A1230', CLIP2 = '14507A', RAIL = '272727';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, color: 'DDDDDD', ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, ...o });
  const tri = (s, x, y, w, c = 'FFFFFF') => t.shape(s, 'ISOSCELES_TRIANGLE', { x, y, w, h: w, rotate: 90, fill: { color: c }, objectName: 'Play' });
  const logo = (s, x, y) => { t.rect(s, x, y, 0.56, 0.4, C.red, { r: 0.09, name: 'Logo' }); tri(s, x + 0.19, y + 0.11, 0.18); };
  const head = (s, d, ink, mute) => { logo(s, 0.3, 0.27); if (d.title) k.head(s, d.title, 1.0, 0.14, 8.0, 0.66, { max: 22, min: 12, color: ink }); k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.14, 0.7, 0.66, { size: 12, bold: true, color: mute, align: 'right', valign: 'middle' }); };
  const dark = (d) => { const s = k.slide(C.bg); head(s, d, C.ink, C.muted); k.foot(s, { x: 0.3, y: 5.34, w: 9.4, size: 7, color: C.muted }); return s; };
  const light = (d) => { const s = k.slide(LIGHT); head(s, d, '0F0F0F', SOFT); t.line(s, 0, 0.86, 10, 0, LINE, 0.75); k.foot(s, { x: 0.3, y: 5.34, w: 9.4, size: 7, color: SOFT }); return s; };
  const seek = (s, x, y, w, f, c = C.red, r = C.track) => { t.rect(s, x, y, w, 0.06, r, { name: 'Track' }); t.rect(s, x, y, w * f, 0.06, c, { name: 'Played' }); t.oval(s, x + w * f - 0.08, y - 0.05, 0.16, 0.16, c, { name: 'Knob' }); };
  const thumb = async (s, x, y, w, h, icon, n, c = C.screen) => { t.rect(s, x, y, w, h, c, { r: 0.06, name: 'Thumb' }); const q = Math.min(0.5, h * 0.5); t.img(s, await k.icon(icon, C.ink, 1.75), x + w / 2 - q / 2, y + h / 2 - q / 2, q, q); t.rect(s, x, y + h - 0.06, w * n, 0.06, C.red, { name: 'Watched' }); };
  const V = {
    image: [
      async (d) => { // full screen: the picture to the edges, the words as subtitles on black, the seek bar under them
        const s = k.slide(C.bg), y = 3.5;
        await k.photo(s, d.image, 0, 0, 10, 3.6);
        t.rect(s, 0, 0, 10, 0.72, '000000', { t: 25, name: 'Top shade' });
        k.head(s, d.title || '', 0.3, 0.05, 8.5, 0.62, { max: 20, min: 12, color: 'FFFFFF' });
        k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.05, 0.7, 0.62, { size: 12, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle' });
        t.rect(s, 0, y, 10, 5.625 - y, '000000', { name: 'Subtitles' });
        bd(s, d.text, 0.6, y + 0.08, 8.8, 1.48, { color: 'FFFFFF', max: 13, align: 'center', valign: 'middle' });
        seek(s, 0.3, 5.14, 9.4, 0.45);
        k.foot(s, { x: 0.3, y: 5.34, w: 9.4, size: 7, color: C.muted });
      },
      async (d) => { // picture in picture: the words fill the page, the video floats small at the corner
        const s = dark(d), x = 5.75, y = 2.55, w = 3.95, h = 2.6;
        bd(s, d.text, 0.3, 1.0, 5.2, 4.2, { max: 13.5, valign: 'middle', color: C.ink });
        t.rect(s, x - 0.04, y - 0.04, w + 0.08, h + 0.08, C.track, { r: 0.08, shadow: 0.5, blur: 8, offset: 3, name: 'Window' });
        await k.photo(s, d.image, x, y, w, h, { mask: { r: 0.06 } });
        play(s, x + w / 2, y + h / 2, 0.7);
        seek(s, x + 0.12, y + h - 0.18, w - 0.24, 0.3);
        t.rect(s, x, 1.05, w, 1.3, C.panel, { r: 0.06, name: 'Bar' });
        for (let i = 0; i < 3; i++) t.rect(s, x + 0.2, 1.25 + i * 0.32, (w - 0.4) * [1, 0.72, 0.5][i], 0.14, C.track, { r: 0.03, name: 'Line' });
      },
      async (d) => { // light theme: an upright phone plays the picture, the description beside it
        const s = light(d), x = 0.8, y = 0.98, w = 2.4, h = 4.28;
        t.rect(s, x - 0.08, y - 0.06, w + 0.16, h + 0.12, '0F0F0F', { r: 0.14, name: 'Phone' });
        await k.photo(s, d.image, x, y, w, h, { mask: { r: 0.08 } });
        play(s, x + w / 2, y + h / 2, 0.75);
        seek(s, x + 0.12, y + h - 0.16, w - 0.24, 0.55);
        bd(s, d.text, 3.75, 1.0, 5.9, 4.2, { color: '0F0F0F', max: 13.5, valign: 'middle' });
      },
      async (d) => { // the channel's round picture with its live ring, the words in the grey description box
        const s = dark(d), dd = 3.35, x = 0.45, y = 1.3;
        t.oval(s, x - 0.13, y - 0.13, dd + 0.26, dd + 0.26, C.red, { name: 'Ring' });
        t.oval(s, x - 0.05, y - 0.05, dd + 0.1, dd + 0.1, C.bg, { name: 'Gap' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.rect(s, 4.25, 1.0, 5.45, 4.2, RAIL, { r: 0.08, name: 'Description' });
        bd(s, d.text, 4.5, 1.12, 4.95, 3.96, { max: 13.5, valign: 'middle', color: C.ink });
      },
    ],
    cards: [
      async (d) => { // the watch page: the first idea plays large on the screen, the others wait in the side column
        const s = dark(d), [a, ...rest] = d.items, n = d.items.length, x = 0.3, y = 1.0, w = 5.6, h = 3.95, rh = 4.2 / rest.length;
        t.rect(s, x, y, w, h, C.screen, { r: 0.06, name: 'Screen' });
        t.img(s, await k.icon(a.icon, C.red, 1.75), x + 0.3, y + 0.28, 0.62, 0.62);
        hd(s, a.h, x + 1.05, y + 0.26, w - 1.3, 0.66, { max: 20, min: 13 });
        bd(s, a.t, x + 0.3, y + 1.08, w - 0.6, h - 1.4, { max: 15, min: 11, ls: 1.25 });
        seek(s, x + 0.15, y + h - 0.2, w - 0.3, 0.3);
        for (const [i, it] of rest.entries()) {
          const yy = y + i * rh, hh = rh - 0.08;
          t.rect(s, 6.1, yy, 3.6, hh, C.panel, { r: 0.05, name: 'Up next' });
          t.img(s, await k.icon(it.icon, C.muted, 2), 6.22, yy + 0.08, 0.3, 0.3);
          hd(s, it.h, 6.6, yy + 0.03, 3.0, 0.38, { max: 13 });
          bd(s, it.t, 6.22, yy + 0.44, 3.36, hh - 0.48, { max: 12 });
        }
      },
      async (d) => { // the home page in light theme: a thumbnail on top of each video, its title and words under
        const s = light(d), n = d.items.length, gap = 0.18, w = (9.4 - gap * (n - 1)) / n, tones = [C.screen, '3A1B24', '13293D', '2B2B12'];
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * (w + gap);
          await thumb(s, x, 1.05, w, 1.32, it.icon, 0.3 + i * 0.17, tones[i]);
          hd(s, it.h, x, 2.42, w, 0.54, { color: '0F0F0F', max: 13.5, valign: 'top' });
          bd(s, it.t, x, 2.98, w, 2.25, { color: SOFT, max: 13 });
        }
      },
      async (d) => { // the queue: rows with a small thumbnail, the one now playing lit, a play mark beside it
        const s = dark(d), n = d.items.length, y0 = 1.0, rh = 4.22 / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, h = rh - 0.08, on = i === 0;
          t.rect(s, 0.3, y, 9.4, h, on ? '2A2A2A' : C.panel, { r: 0.06, name: 'Row' });
          if (on) tri(s, 0.42, y + h / 2 - 0.09, 0.18, C.red); else k.txt(s, String(i + 1), 0.38, y, 0.3, h, { size: 11, color: C.muted, align: 'center', valign: 'middle' });
          await thumb(s, 0.75, y + 0.08, 1.45, h - 0.16, it.icon, on ? 0.55 : 0, C.track);
          hd(s, it.h, 2.35, y + 0.03, 2.5, h - 0.06);
          bd(s, it.t, 4.95, y + 0.03, 4.6, h - 0.06, { valign: 'middle', max: 12 });
        }
      },
      async (d) => { // the end screen: next videos gather round the replay button
        const s = dark(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.08 : 2.5, dd = 1.3, spots = n === 4 ? [[0.3, 1.0, 3.65, 2.0], [6.05, 1.0, 3.65, 2.0], [0.3, 3.16, 3.65, 2.04], [6.05, 3.16, 3.65, 2.04]] : [[0.3, 1.0, 3.65, 2.35], [6.05, 1.0, 3.65, 2.35], [1.8, 3.55, 6.4, 1.65]];
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.red, { name: 'Replay' });
        k.txt(s, '↻', cx - dd / 2, cy - dd / 2, dd, dd, { size: 40, font: 'Arial', color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, C.screen, { r: 0.08, line: { color: C.track, width: 1 }, name: 'Next' });
          t.img(s, await k.icon(it.icon, C.red, 2), x + 0.14, y + 0.1, 0.32, 0.32);
          hd(s, it.h, x + 0.55, y + 0.05, w - 0.65, 0.42);
          bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.58, { max: 12.5 });
        }
      },
      async (d) => { // live chat in light theme: speech bubbles from an avatar, turn by turn from each side
        const s = light(d), n = d.items.length, y0 = 0.98, rh = 4.28 / n, w = 7.6, dd = 0.62;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, h = rh - 0.1, ax = right ? 9.7 - dd : 0.3, x = right ? ax - 0.14 - w : ax + dd + 0.14;
          t.oval(s, ax, y + h / 2 - dd / 2, dd, dd, right ? LINK : C.red, { name: 'Avatar' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), ax + dd / 2 - 0.16, y + h / 2 - 0.16, 0.32, 0.32);
          t.rect(s, x, y, w, h, right ? 'E8F0FE' : GREY, { r: 0.12, name: 'Bubble' });
          hd(s, it.h, x + 0.18, y + 0.04, w - 0.36, 0.34, { color: right ? LINK : DEEPRED, max: 13 });
          bd(s, it.t, x + 0.18, y + 0.38, w - 0.36, h - 0.42, { color: '0F0F0F', max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // one wide seek bar over the whole page, a chapter for each step, the words under it
        const s = dark(d), n = d.steps.length, w = 9.4 / n, y = 1.42;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.3 + i * w;
          t.rect(s, x + 0.03, y, w - 0.06, 0.14, i < n - 1 ? C.red : C.track, { name: 'Chapter' });
          t.oval(s, x + 0.03, y - 0.3, 0.72, 0.72, i < n - 1 ? C.red : C.track, { name: 'Mark' });
          k.txt(s, String(i + 1), x + 0.03, y - 0.3, 0.72, 0.72, { size: 20, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.06, 1.95, w - 0.2, 0.55, { valign: 'top' });
          bd(s, st.t, x + 0.06, 2.52, w - 0.2, 2.7, { max: 13.5 });
        }
      },
      async (d) => { // light theme: preview frames climb the page, each lit further along
        const s = light(d), n = d.steps.length, gap = 0.12, w = (9.4 - gap * (n - 1)) / n, rise = n === 4 ? 0.3 : 0.42;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.3 + i * (w + gap), y = 1.0 + (n - 1 - i) * rise, h = 5.24 - y;
          t.rect(s, x, y, w, 0.68, '0F0F0F', { name: 'Frame' });
          tri(s, x + 0.14, y + 0.24, 0.2);
          k.txt(s, String(i + 1), x + w - 0.7, y, 0.58, 0.68, { size: 24, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle', ls: 1 });
          t.rect(s, x, y + 0.68, w * (i + 1) / n, 0.06, C.red, { name: 'Played' });
          t.rect(s, x, y + 0.74, w, h - 0.74, GREY, { name: 'Panel' });
          hd(s, st.h, x + 0.12, y + 0.78, w - 0.24, 0.5, { color: '0F0F0F', max: 13, valign: 'top' });
          bd(s, st.t, x + 0.12, y + 1.3, w - 0.24, h - 1.38, { color: '333333', max: 12.5 });
        }
      },
      async (d) => { // the loading ring: dots run round a circle, one numbered for each step, the steps listed beside it
        const s = dark(d), n = d.steps.length, dd = 3.4, x = 0.55, y = 1.35, r = dd / 2, cx = x + r, cy = y + r, rh = 4.2 / n;
        for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; t.oval(s, cx + Math.cos(a) * r - 0.04, cy + Math.sin(a) * r - 0.04, 0.08, 0.08, C.track, { name: 'Dot' }); }
        play(s, cx, cy, 1.2);
        for (const [i, st] of d.steps.entries()) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / n, y2 = 1.0 + i * rh;
          t.oval(s, cx + Math.cos(a) * r - 0.28, cy + Math.sin(a) * r - 0.28, 0.56, 0.56, C.red, { name: 'Step' });
          k.txt(s, String(i + 1), cx + Math.cos(a) * r - 0.28, cy + Math.sin(a) * r - 0.28, 0.56, 0.56, { size: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, `${i + 1}  ${st.h}`, 4.65, y2 + 0.02, 5.05, 0.36);
          bd(s, st.t, 4.65, y2 + 0.39, 5.05, rh - 0.42, { max: 12.5 });
        }
      },
      async (d) => { // a red playhead runs down the middle of the page, steps at either hand of it
        const s = dark(d), n = d.steps.length, y0 = 0.98, rh = 4.26 / n, cx = 5, w = 4.1;
        t.rect(s, cx - 0.02, y0, 0.04, 4.26, C.red, { name: 'Playhead' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? cx + 0.38 : cx - 0.38 - w, a = right ? 'left' : 'right', dd = 0.5, my = y + rh / 2 - dd / 2;
          t.oval(s, cx - dd / 2, my, dd, dd, C.red, { name: 'Mark' });
          k.txt(s, String(i + 1), cx - dd / 2, my, dd, dd, { size: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.34, { align: a, max: 13.5 });
          bd(s, st.t, x, y + 0.37, w, rh - 0.4, { align: a, max: 12 });
        }
      },
    ],
    stats: [
      async (d) => { // three small players at uneven heights, a figure on every screen, the note along the foot
        const s = dark(d), w = 3.0, gap = 0.2, tops = [1.2, 0.98, 1.34];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.3 + i * (w + gap), y = tops[i];
          t.rect(s, x, y, w, 1.55, C.screen, { r: 0.05, name: 'Screen' });
          hd(s, v.value, x + 0.12, y + 0.1, w - 0.24, 1.15, { max: 34, min: 18, color: i ? C.ink : C.red, align: 'center' });
          seek(s, x + 0.12, y + 1.36, w - 0.24, 1); // the same on all three: a bar must not read as a measure of the figure
          bd(s, v.label, x + 0.04, y + 1.62, w - 0.08, 0.62, { color: C.ink, max: 12.5 });
        }
        if (d.note) { t.rect(s, 0.3, 4.0, 9.4, 1.22, C.panel, { r: 0.05, name: 'Panel' }); bd(s, d.note, 0.48, 4.03, 9.04, 1.16, { valign: 'middle', max: 13 }); }
      },
      async (d) => { // the counter fills the screen: one figure huge over the player, two more below it, the note on the panel
        const s = dark(d), [a, b, c] = d.stats;
        t.rect(s, 0.3, 1.0, 6.2, 2.5, C.screen, { r: 0.06, name: 'Screen' });
        hd(s, a.value, 0.55, 1.08, 5.7, 1.4, { max: 60, min: 26, color: C.red, align: 'center' });
        bd(s, a.label, 0.6, 2.5, 5.6, 0.68, { align: 'center', max: 14, min: 11 });
        seek(s, 0.45, 3.32, 5.9, 1);
        [[b, 0.3], [c, 3.5]].forEach(([v, x]) => { hd(s, v.value, x, 3.62, 3.0, 0.72, { max: 28, min: 15 }); bd(s, v.label, x, 4.36, 3.0, 0.82, { color: C.muted, max: 12 }); });
        if (d.note) { t.rect(s, 6.75, 1.0, 2.95, 4.18, C.panel, { r: 0.06, name: 'Panel' }); bd(s, d.note, 6.92, 1.12, 2.61, 3.94, { valign: 'middle', max: 13 }); }
      },
      async (d) => { // light theme: the like, watch and share pills, each figure in its rounded button
        const s = light(d), ic = ['FiThumbsUp', 'FiEye', 'FiShare2'], rh = 1.03;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.02 + i * rh;
          t.rect(s, 0.3, y + 0.06, 4.1, rh - 0.14, GREY, { r: 0.4, name: 'Pill' });
          t.img(s, await k.icon(ic[i], i ? '0F0F0F' : DEEPRED, 2), 0.58, y + rh / 2 - 0.2, 0.36, 0.36);
          hd(s, v.value, 1.1, y + 0.08, 3.1, rh - 0.18, { max: 30, min: 16, color: i ? '0F0F0F' : DEEPRED });
          bd(s, v.label, 4.65, y + 0.04, 5.05, rh - 0.1, { color: '0F0F0F', valign: 'middle', max: 14 });
        }
        if (d.note) { t.line(s, 0.3, 4.12, 9.4, 0, LINE, 0.75); bd(s, d.note, 0.3, 4.16, 9.4, 1.08, { color: SOFT, valign: 'middle', max: 12.5 }); }
      },
    ],
    compare: [
      async (d) => { // before and after: a slider handle parts the page into dark and light, sides mirrored
        const s = dark(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 4.0, F.body, 0.14, 3.2);
        t.rect(s, 5, 0.9, 5, 4.72, LIGHT, { name: 'After' });
        t.rect(s, 4.98, 0.9, 0.04, 4.72, C.red, { name: 'Slider' });
        t.oval(s, 4.68, 2.85, 0.64, 0.64, C.red, { name: 'Handle' });
        k.txt(s, '◂▸', 4.68, 2.85, 0.64, 0.64, { size: 13, bold: true, font: 'Arial', color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.5 : 0.5, w = 4.0, a = i ? 'left' : 'right', ink = i ? '0F0F0F' : C.ink;
          hd(s, sd.h, x, 0.98, w, 0.56, { max: 18, min: 12, color: i ? DEEPRED : 'FF6680', align: a });
          let y = 1.66; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: ink, align: a, ls: 1, font: F.body }); y += rr[j]; });
        }
      },
      async (d) => { // the editor's two tracks: a head at the left, each line a clip along its track
        const s = dark(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.12 : 1.0, h = 2.04, n = sd.items.length, x0 = 2.3, w = (9.7 - x0) / n, c = i ? CLIP2 : CLIP;
          t.rect(s, 0.3, y, 9.4, h, RAIL, { name: 'Track' });
          t.rect(s, 0.3, y, 1.9, h, C.panel, { line: { color: C.track, width: 0.75 }, name: 'Track head' });
          hd(s, sd.h, 0.4, y + 0.08, 1.7, h - 0.16, { max: 15, min: 11, color: i ? '7CC4F5' : 'FF8FA3' });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.rect(s, x + 0.03, y + 0.12, w - 0.06, h - 0.24, c, { r: 0.05, name: 'Clip' }); bd(s, it, x + 0.12, y + 0.16, w - 0.24, h - 0.32, { color: 'FFFFFF', valign: 'middle', max: 12 }); });
        }
        t.rect(s, 2.23, 0.92, 0.04, 4.3, 'FFFFFF', { name: 'Playhead' });
      },
    ],
    statement: [
      async (d) => { // one subtitle on the black screen, wide as the page, the note under a seek bar
        const s = dark(d);
        k.head(s, L.runs(d.text), 0.6, 1.0, 8.8, 2.4, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
        seek(s, 0.3, 3.55, 9.4, 0.72);
        if (d.caption) bd(s, d.caption, 0.8, 3.72, 8.4, 1.5, { color: C.muted, align: 'center', valign: 'middle', max: 13 });
      },
      async (d) => { // the whole left of the page in red with a great play mark, the note on white
        const s = k.slide(LIGHT), w = 6.1;
        t.rect(s, 0, 0, w, 5.625, DEEPRED, { name: 'Red side' });
        if (d.title) k.head(s, d.title, 0.4, 0.2, w - 0.8, 0.7, { max: 16, min: 11, color: 'FFFFFF' });
        k.head(s, L.runs(d.text), 0.4, 1.0, w - 0.8, 3.0, { max: 28, min: 15, color: 'FFFFFF' });
        tri(s, 0.45, 4.2, 0.6);
        k.foot(s, { x: 1.2, y: 5.34, w: 4.7, size: 7, color: 'FFFFFF' });
        k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.2, 0.7, 0.5, { size: 12, bold: true, color: SOFT, align: 'right', valign: 'middle' });
        if (d.caption) bd(s, d.caption, 6.4, 0.8, 3.3, 4.3, { color: '0F0F0F', valign: 'middle', max: 13.5, ls: 1.25 });
      },
    ],
    timeline: [
      async (d) => { // the seek bar across the middle: the years are its chapters, events over and under it in turn
        const s = dark(d), ay = 3.02, w = 3.5, step = 1.96;
        t.rect(s, 0, ay, 10, 0.1, C.red, { name: 'Seek' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * step, up = i % 2 === 0, y = up ? 0.95 : ay + 0.24, h = up ? ay - 1.0 : 5.26 - y;
          t.oval(s, x, ay - 0.06, 0.22, 0.22, 'FFFFFF', { name: 'Knob' });
          t.rect(s, x, y, w, h, C.panel, { r: 0.05, name: 'Preview' });
          hd(s, it.year, x + 0.1, y + 0.04, 1.35, 0.36, { color: 'FF6680', max: 14 });
          hd(s, it.h, x + 1.46, y + 0.04, w - 1.54, 0.36, { max: 11.5, min: 10 });
          bd(s, it.t, x + 0.1, y + 0.42, w - 0.2, h - 0.46, { max: 11.5 });
        }
      },
      async (d) => { // light theme: the description's timestamps, blue links opening every line
        const s = light(d), rh = 4.28 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 0.96 + i * rh;
          hd(s, it.year, 0.3, y, 1.7, rh - 0.04, { color: LINK, max: 17, min: 11 });
          hd(s, it.h, 2.05, y, 2.3, rh - 0.04, { color: '0F0F0F', max: 13.5 });
          bd(s, it.t, 4.45, y, 5.25, rh - 0.04, { color: SOFT, valign: 'middle', max: 12.5 });
          if (i < 3) t.line(s, 0.3, y + rh - 0.02, 9.4, 0, LINE, 0.75);
        }
      },
      async (d) => { // progress rings in a row, more of each one played, the year inside it and the event below
        const s = dark(d), w = 9.4 / 4, dd = 1.5;
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * w, cx = x + w / 2, f = (i + 1) / 4, r = 66, a = f * 2 * Math.PI - 0.0001, ex = 75 + r * Math.sin(a), ey = 75 - r * Math.cos(a);
          t.img(s, await k.svg(`pring${i}`, `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><circle cx="75" cy="75" r="${r}" fill="none" stroke="#${C.track}" stroke-width="9"/><path d="M75,9 A${r},${r} 0 ${f > 0.5 ? 1 : 0} 1 ${ex.toFixed(2)},${ey.toFixed(2)}" fill="none" stroke="#${C.red}" stroke-width="9"/></svg>`, 150, 150), cx - dd / 2, 0.98, dd, dd);
          hd(s, it.year, cx - 0.58, 1.33, 1.16, 0.8, { max: 14, min: 9.5, align: 'center' });
          hd(s, it.h, x + 0.08, 2.54, w - 0.16, 0.5, { align: 'center', max: 13 });
          bd(s, it.t, x + 0.08, 3.06, w - 0.16, 2.16, { align: 'center', max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.cards = V.cards.shift(); // the old cards, process and timeline were one page, a big first item and a chapter list in tiny type; the old stats too
  R.process = V.process.shift();
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Pleer', colors: { dk1: C.bg, lt1: C.ink, dk2: C.screen, lt2: C.muted, accent1: C.red, accent2: '3EA6FF', accent3: 'FFD600', accent4: '00C853', accent5: C.muted, accent6: C.track, hlink: '3EA6FF', folHlink: C.muted } });
}
module.exports = { id: 159, slug: 'pleer', name: 'Pleer', category: 'business', photos: true, build, style: { tone: "video darslik: boblarga bo'lingan, har bob qisqa sarlavha va lo'nda izoh bilan", limits: { card_t4: 100, step_t: 100, event_t: 90 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "technical"], "transitions": ["zoom", "fade", "cut"], "cover": ["focusIn", "stretch"], "mark": "popIn", "deco": "stretch", "sig": {"title": "focusIn", "body": "fade", "item": "stretch", "image": "zoomIn", "number": "popIn", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": true};
