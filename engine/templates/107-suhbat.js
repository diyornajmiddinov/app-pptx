/**
 * 107 Suhbat — magazine interview: a headline and byline, then question/answer pairs in two newspaper-like
 * columns marked with big "?" glyphs, a portrait photo with a name caption, pull quotes across the page.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1A1A1A', muted: '5C5C5C', accent: 'D7263D', rule: 'E0E0E0' };
const F = { head: 'Arial', body: 'Cambria' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.bg); t.rect(s, 0.5, 0.3, 0.12, 0.62, C.accent, { name: 'Mark' }); if (d.title) k.head(s, d.title, 0.75, 0.25, 7.9, 0.72, { max: 26, min: 14 }); k.txt(s, String(k.idx), 8.8, 0.3, 0.7, 0.62, { size: 20, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' }); t.line(s, 0.5, 1.05, 9.0, 0, C.ink, 1.25); k.foot(s, { y: 5.27, font: F.head }); return s; };
  // question/answer pair: big "?" then bold question, answer in serif under it
  const qa = (s, q, a, x, y, w, h) => { k.txt(s, '?', x, y - 0.05, 0.45, 0.6, { size: 30, bold: true, font: F.head, color: C.accent }); k.txt(s, q, x + 0.45, y, w - 0.45, 0.5, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle' }); k.txt(s, a, x + 0.45, y + 0.52, w - 0.45, h - 0.58, { max: 13, min: 10, ls: 1.3 }); };
  const grid2 = (s, list) => { const n = list.length, per = Math.ceil(n / 2), w = 4.3, h = 3.9 / per; t.line(s, 5.0, 1.25, 0, 3.8, C.rule, 0.75); list.forEach(([q, a], i) => qa(s, q, a, 0.5 + Math.floor(i / per) * 4.7, 1.25 + (i % per) * h, w, h)); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { await k.photo(s, d.image, 6.0, 0, 4.0, 4.9); t.rect(s, 6.0, 4.9, 4.0, 0.725, C.ink, { name: 'Caption bar' }); k.txt(s, k.M.author || '', 6.15, 4.9, 3.7, 0.45, { size: 13, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' }); k.txt(s, k.org3, 6.15, 5.3, 3.7, 0.3, { size: 9, color: 'CCCCCC', font: F.head }); }
      k.txt(s, '\u201C', 0.4, 0.2, 1.4, 1.5, { size: 120, bold: true, font: F.head, color: C.accent });
      k.head(s, d.title, 0.55, 1.4, 5.1, 2.3, { max: 40, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.55, 3.75, 5.0, 0.8, { max: 14, italic: true, color: C.muted });
      if (!d.image) k.txt(s, `${k.M.author || ''} \u2022 ${k.org3}`, 0.55, 4.6, 5.0, 0.4, { size: 12, bold: true, font: F.head });
      k.foot(s, { y: 5.27, w: 5.2, font: F.head }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 6.2, 1.25, 3.3, 3.75); t.rect(s, 6.2, 4.65, 3.3, 0.35, C.ink, { name: 'Caption' }); k.txt(s, k.M.author || '', 6.3, 4.65, 3.1, 0.35, { size: 10, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
      const words = d.text.split(' '); k.txt(s, [{ text: words[0] + ' ', options: { bold: true, font: F.head } }, { text: words.slice(1).join(' ') }], 0.5, 1.25, 5.4, 3.75, { max: 16, min: 10, ls: 1.4 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.5, 1.25, 3.3, 3.75); k.txt(s, d.text, 4.1, 1.25, 5.4, 3.75, { max: 16, min: 10, ls: 1.4 }); },
    async agenda(d) { const s = page(d), n = d.items.length, rh = 3.85 / n; d.items.forEach((it, i) => { const y = 1.2 + i * rh; k.txt(s, `?${i + 1}`, 0.5, y, 0.8, rh, { size: Math.min(22, rh * 30), bold: true, font: F.head, color: C.accent, valign: 'middle' }); k.txt(s, it, 1.35, y, 8.1, rh, { max: 18, font: F.head, bold: true, valign: 'middle' }); if (i < n - 1) t.line(s, 1.35, y + rh, 8.15, 0, C.rule, 0.75); }); },
    async cards(d) { const s = page(d); grid2(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); grid2(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 9.0 / n; d.stats.forEach((v, i) => { const x = 0.5 + i * w; if (i) t.line(s, x - 0.1, 1.35, 0, 2.6, C.rule, 0.75); k.head(s, v.value, x, 1.3, w - 0.3, 1.4, { max: 60, min: 22, color: i === 0 ? C.accent : C.ink }); k.txt(s, v.label, x, 2.8, w - 0.3, 1.2, { max: 14, italic: true, color: C.muted }); });
      if (d.note) k.txt(s, d.note, 0.5, 4.25, 9.0, 0.75, { max: 11, color: C.muted, font: F.head }); },
    async compare(d) { const s = page(d), w = 4.25, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.2, F.body, 0.14, 3.15);
      [d.left, d.right].forEach((sd, i) => { const x = 0.5 + i * (w + 0.5); t.oval(s, x, 1.3, 0.5, 0.5, i ? C.ink : C.accent); k.txt(s, i ? 'B' : 'A', x, 1.3, 0.5, 0.5, { size: 16, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, sd.h, x + 0.65, 1.3, w - 0.65, 0.5, { max: 17 }); let y = 1.95; sd.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, x + 0.1, y, w - 0.2, rr[j], { size: fs }); y += rr[j]; }); }); t.line(s, 5.0, 1.3, 0, 3.7, C.rule, 0.75); },
    async statement(d) { const s = page(d); t.line(s, 0.5, 1.45, 9.0, 0, C.accent, 3); k.head(s, `\u201C${d.text}\u201D`, 0.8, 1.6, 8.4, 2.1, { max: 36, min: 16, italic: true, align: 'center' }); t.line(s, 0.5, 3.85, 9.0, 0, C.accent, 3); if (d.caption) k.txt(s, d.caption, 0.8, 3.95, 8.4, 1.05, { max: 13, align: 'center', color: C.muted }); },
    async timeline(d) { const s = page(d); grid2(s, d.items.map((it) => [`${it.year}: ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', 0.4, 0.95, 1.5, 1.6, { size: 140, bold: true, font: F.head, color: C.accent }); k.head(s, d.text, 1.6, 1.4, 7.6, 2.5, { max: 34, min: 16, italic: true, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.6, 4.0, 7.6, 0.45, { size: 15, bold: true, font: F.head, color: C.accent }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.8 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.accent } }, { text: it }], 0.5, 1.2 + i * rh, 9.0, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in the magazine's interview: a deck's pages must not look alike (L.pages)
  const INK = '141414', SOFT = 'F4F1F0', GREY = 'C9C9C9';
  const night = (d) => { // the black spread of the magazine
    const s = k.slide(INK);
    t.rect(s, 0.5, 0.3, 0.12, 0.62, C.accent, { name: 'Mark' });
    if (d.title) k.head(s, d.title, 0.75, 0.25, 7.9, 0.72, { max: 26, min: 14, color: 'FFFFFF' });
    k.txt(s, String(k.idx), 8.8, 0.3, 0.7, 0.62, { size: 20, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' });
    t.line(s, 0.5, 1.05, 9.0, 0, 'FFFFFF', 1.25);
    k.foot(s, { y: 5.27, font: F.head, color: GREY });
    return s;
  };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.22, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle', ls: 1.05, ...o });
  const halves = (str) => { const mid = str.length / 2; let cut = str.indexOf('. ', Math.round(mid * 0.7)); if (cut < 0 || cut > mid * 1.3) { cut = str.lastIndexOf(' ', Math.round(mid)); return cut < 0 ? [str, ''] : [str.slice(0, cut), str.slice(cut + 1)]; } return [str.slice(0, cut + 1), str.slice(cut + 2)]; };
  const tail = (dir, color) => k.svg(`tail${dir}${color}`, `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><polygon points="${{ l: '60,0 60,60 0,30', r: '0,0 0,60 60,30', b: '0,0 60,0 12,60' }[dir]}" fill="#${color}"/></svg>`, 60, 60);
  const bubble = async (s, x, y, w, h, color, dir, at = 0.3) => { // a speech bubble with its tail
    t.rect(s, x, y, w, h, color, { r: 0.12, name: 'Bubble' });
    if (dir === 'l') t.img(s, await tail('l', color), x - 0.2, y + h * at - 0.12, 0.22, 0.24);
    if (dir === 'r') t.img(s, await tail('r', color), x + w - 0.02, y + h * at - 0.12, 0.22, 0.24);
    if (dir === 'b') t.img(s, await tail('b', color), x + w * at, y + h - 0.02, 0.38, 0.34);
  };
  const V = {
    image: [
      async (d) => { // the picture bleeds off the left of the spread, the story beside it
        const s = k.slide(C.bg), x = 4.95, w = 4.55;
        await k.photo(s, d.image, 0, 0, 4.55, 5.625);
        t.rect(s, x, 0.3, 0.12, 0.62, C.accent, { name: 'Mark' });
        k.head(s, d.title || '', x + 0.25, 0.25, w - 1.0, 0.72, { max: 22, min: 13 });
        k.txt(s, String(k.idx), 8.9, 0.3, 0.6, 0.62, { size: 20, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' });
        t.line(s, x, 1.05, w, 0, C.ink, 1.25);
        const words = d.text.split(' ');
        k.txt(s, [{ text: words[0] + ' ', options: { bold: true, fontFace: F.head } }, { text: words.slice(1).join(' ') }], x, 1.2, w, 3.95, { max: 15, min: 10, ls: 1.32 });
        k.foot(s, { x, y: 5.27, w, font: F.head });
      },
      async (d) => { // the picture fills the spread, a black column of words is laid in it
        const s = page(d);
        await k.photo(s, d.image, 0, 1.05, 10, 4.17);
        t.rect(s, 4.3, 1.05, 5.2, 4.17, INK, { name: 'Column' });
        t.rect(s, 4.3, 1.05, 5.2, 0.07, C.accent, { name: 'Edge' });
        bd(s, d.text, 4.55, 1.22, 4.7, 3.9, { max: 14, color: 'FFFFFF', valign: 'middle', ls: 1.28 });
      },
      async (d) => { // black spread: a round portrait, a great question mark over the words
        const s = night(d), dd = 3.55, x = 0.6, y = 1.32;
        t.oval(s, x - 0.1, y - 0.1, dd + 0.2, dd + 0.2, C.accent);
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle' });
        k.txt(s, '?', x + dd - 0.5, y + dd - 1.0, 0.95, 0.95, { size: 54, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
        bd(s, d.text, 4.65, 1.25, 4.85, 3.85, { max: 14, color: 'FFFFFF', valign: 'middle', ls: 1.3 });
      },
      async (d) => { // a tall picture splits two newspaper columns
        const s = page(d), [a, b] = halves(d.text), w = 3.05, pw = 2.5, px = 5 - pw / 2, fs = Math.min(L.fit(a, w, 3.85, 13, 10, F.body, false, 1.25), L.fit(b || a, w, 3.85, 13, 10, F.body, false, 1.25));
        await k.photo(s, d.image, px, 1.2, pw, 3.92);
        t.rect(s, px, 4.77, pw, 0.35, C.accent, { name: 'Caption' });
        k.txt(s, k.M.author || '', px + 0.1, 4.77, pw - 0.2, 0.35, { max: 10, min: 7, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
        bd(s, a, 0.5, 1.22, w, 3.88, { size: fs, ls: 1.25 });
        bd(s, b, 9.5 - w, 1.22, w, 3.88, { size: fs, ls: 1.25 });
      },
    ],
    cards: [
      async (d) => { // the talk itself: bubbles from either side by turns
        const s = page(d), n = d.items.length, h = 3.85 / n, w = 7.25;
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, y = 1.2 + i * h, bx = right ? 0.5 : 1.45, cx = right ? 8.85 : 0.5, fill = right ? INK : SOFT, ink = right ? 'FFFFFF' : C.ink;
          t.oval(s, cx, y + (h - 0.08) / 2 - 0.3, 0.6, 0.6, right ? C.accent : INK);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), cx + 0.15, y + (h - 0.08) / 2 - 0.15, 0.3, 0.3);
          await bubble(s, bx, y, w + 0.8, h - 0.08, fill, right ? 'r' : 'l', 0.5);
          hd(s, it.h, bx + 0.2, y + 0.04, w + 0.4, 0.34, { color: right ? 'FFFFFF' : C.accent, max: 13.5 });
          bd(s, it.t, bx + 0.2, y + 0.38, w + 0.4, h - 0.5, { color: ink, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the guests: a round portrait, a black name caption, their words under it
        const s = page(d), n = d.items.length, w = 9.0 / n, dd = 1.0;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, cw = w - 0.2, cx = x + cw / 2;
          t.oval(s, cx - dd / 2, 1.2, dd, dd, i % 2 ? C.accent : SOFT);
          t.img(s, await k.icon(it.icon, i % 2 ? 'FFFFFF' : C.accent, 1.75), cx - 0.25, 1.45, 0.5, 0.5);
          t.rect(s, x, 2.12, cw, 0.56, INK, { name: 'Caption' });
          hd(s, it.h, x + 0.08, 2.12, cw - 0.16, 0.56, { color: 'FFFFFF', max: 13, min: 10, align: 'center' });
          bd(s, it.t, x + 0.02, 2.78, cw - 0.04, 2.34, { max: 13, align: 'center' });
        }
      },
      async (d) => { // black spread: questions hung at different heights, a red mark on each
        const s = night(d), n = d.items.length, w = 9.0 / n, lift = n === 4 ? [0.32, 0, 0.42, 0.1] : [0.35, 0, 0.5];
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, y = 1.22 + lift[i];
          k.txt(s, '?', x, y - 0.06, 0.45, 0.62, { size: 32, bold: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
          t.img(s, await k.icon(it.icon, GREY, 1.75), x + w - 0.62, y + 0.08, 0.34, 0.34);
          hd(s, it.h, x, y + 0.56, w - 0.2, 0.56, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, it.t, x, y + 1.14, w - 0.2, 5.12 - y - 1.14, { color: 'E2E2E2', max: 12.5 });
          if (i) t.line(s, x - 0.1, 1.28, 0, 3.8, '444444', 0.75);
        }
      },
      async (d) => { // the lead answer in a red block, the others as a sidebar
        const s = page(d), [a, ...rest] = d.items, h = 3.92 / rest.length;
        t.rect(s, 0.5, 1.2, 4.3, 3.92, C.accent, { name: 'Lead' });
        t.img(s, await k.icon(a.icon, 'FFFFFF', 1.75), 0.75, 1.42, 0.62, 0.62);
        hd(s, a.h, 0.75, 2.12, 3.8, 0.72, { color: 'FFFFFF', max: 22, min: 14, valign: 'top' });
        bd(s, a.t, 0.75, 2.88, 3.8, 2.14, { color: 'FFFFFF', max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.2 + i * h;
          if (i) t.line(s, 5.1, y - 0.02, 4.4, 0, C.rule, 0.75);
          k.txt(s, '?', 5.1, y, 0.42, 0.5, { size: 26, bold: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
          hd(s, it.h, 5.55, y + 0.02, 3.95, 0.46, { max: 14 });
          bd(s, it.t, 5.55, y + 0.5, 3.95, h - 0.56, { max: 12.5, ls: 1.15 });
        }
      },
    ],
    process: [
      async (d) => { // the talk moves on: each step lower, a red flag with its number
        const s = page(d), n = d.steps.length, w = 9.0 / n, drop = n === 4 ? 0.38 : 0.55;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w, y = 1.22 + i * drop;
          t.rect(s, x, y, 0.62, 0.52, C.accent, { name: 'Flag' });
          k.txt(s, String(i + 1), x, y, 0.62, 0.52, { size: 20, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          t.line(s, x + 0.62, y + 0.52, w - 0.76, 0, C.ink, 1);
          hd(s, st.h, x, y + 0.58, w - 0.16, 0.56, { max: 14, valign: 'top' });
          bd(s, st.t, x, y + 1.14, w - 0.16, 5.12 - y - 1.14, { max: 12.5 });
        }
      },
      async (d) => { // black spread: great numerals joined by a line of red arrows
        const s = night(d), n = d.steps.length, w = 9.0 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w;
          k.txt(s, String(i + 1), x, 1.15, 0.9, 1.0, { size: 58, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle', ls: 1 });
          if (i < n - 1) { t.line(s, x + 0.82, 1.65, w - 1.1, 0, C.accent, 2); k.txt(s, '›', x + w - 0.4, 1.4, 0.3, 0.42, { size: 26, bold: true, color: C.accent, align: 'center', valign: 'middle', ls: 1, font: 'Arial' }); }
          hd(s, st.h, x, 2.2, w - 0.2, 0.56, { color: C.accent, max: 14, valign: 'top' });
          bd(s, st.t, x, 2.78, w - 0.2, 2.34, { color: 'FFFFFF', max: 13 });
        }
      },
      async (d) => { // a red thread down the page, bubbles speak toward it from both sides
        const s = page(d), n = d.steps.length, per = Math.ceil(n / 2), cx = 5, w = 3.95, h = 3.9 / per;
        t.rect(s, cx - 0.03, 1.15, 0.06, 4.0, C.accent, { name: 'Thread' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.2 + Math.floor(i / 2) * h + (right ? 0.62 : 0), hh = Math.min(h - 0.1, 5.12 - y), x = right ? cx + 0.42 : cx - 0.42 - w;
          await bubble(s, x, y, w, hh, right ? INK : SOFT, right ? 'l' : 'r', 0.28);
          t.oval(s, cx - 0.22, y + hh * 0.28 - 0.22, 0.44, 0.44, C.accent);
          k.txt(s, String(i + 1), cx - 0.22, y + hh * 0.28 - 0.22, 0.44, 0.44, { size: 14, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.15, y + 0.05, w - 0.3, 0.4, { color: right ? 'FFFFFF' : C.accent, max: 13.5 });
          bd(s, st.t, x + 0.15, y + 0.46, w - 0.3, hh - 0.52, { color: right ? 'FFFFFF' : C.ink, max: 12, ls: 1.12 });
        }
      },
      async (d) => { // four corners of the spread, red squares and arrows leading round
        const s = page(d), n = d.steps.length, w = 4.3, h = 1.88, spot = n === 3 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]], arrows = n === 3 ? ['→', '↓'] : ['→', '↓', '←'];
        for (const [i, st] of d.steps.entries()) {
          const [c, r] = spot[i], wide = n === 3 && i === 2, ww = wide ? 9.0 : w, x = 0.5 + c * (w + 0.4), y = 1.22 + r * (h + 0.08);
          t.rect(s, x, y, 0.72, 0.72, r ? INK : C.accent, { name: 'Number' });
          k.txt(s, String(i + 1), x, y, 0.72, 0.72, { size: 26, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.86, y, ww - 0.86 - (i < n - 1 ? 0.35 : 0), 0.72, { max: 15 });
          bd(s, st.t, x, y + 0.8, ww, h - 0.84, { ls: 1.18 });
          if (i < n - 1) k.txt(s, arrows[i], x + ww - 0.34, y + 0.14, 0.34, 0.44, { size: 18, bold: true, color: C.accent, align: 'right', valign: 'middle', font: 'Arial', ls: 1 });
        }
      },
    ],
    stats: [
      async (d) => { // black spread: one figure shouted across the page, two more beside it
        const s = night(d), [a, ...rest] = d.stats;
        k.txt(s, a.value, 0.5, 1.15, 5.7, 1.85, { size: L.fit(a.value, 5.6, 1.75, 96, 34, F.head, true), bold: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
        bd(s, a.label, 0.5, 3.02, 5.5, 0.62, { color: 'FFFFFF', max: 16, italic: true });
        t.line(s, 6.4, 1.3, 0, 2.3, '555555', 0.75);
        rest.forEach((v, i) => { const y = 1.25 + i * 1.2;
          hd(s, v.value, 6.65, y, 2.85, 0.65, { max: 32, min: 16, color: 'FFFFFF' });
          bd(s, v.label, 6.65, y + 0.65, 2.85, 0.5, { color: GREY, max: 12, italic: true }); });
        if (d.note) bd(s, d.note, 0.5, 3.74, 9.0, 1.38, { color: GREY, max: 13, font: F.head, valign: 'middle' });
      },
      async (d) => { // the figures are spoken: three bubbles at different heights
        const s = page(d), w = 2.78, fills = [C.accent, INK, SOFT], inks = ['FFFFFF', 'FFFFFF', C.ink], ys = [1.25, 1.55, 1.25];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * (w + 0.33), y = ys[i], h = 1.15;
          await bubble(s, x, y, w, h, fills[i], 'b', 0.16);
          hd(s, v.value, x + 0.12, y + 0.05, w - 0.24, h - 0.1, { max: 36, min: 18, color: inks[i], align: 'center' });
          bd(s, v.label, x + 0.78, y + h + 0.06, w - 0.82, 0.78, { max: 12.5, italic: true });
        }
        if (d.note) { t.line(s, 0.5, 3.92, 9.0, 0, C.ink, 1); bd(s, d.note, 0.5, 4.0, 9.0, 1.12, { max: 13, color: C.muted, font: F.head, valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // two speakers face each other across the spread, a great letter on each
        const s = page(d);
        t.rect(s, 0, 1.05, 5, 4.17, INK, { name: 'Speaker A' }); t.rect(s, 5, 1.05, 5, 4.17, C.accent, { name: 'Speaker B' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.5, w = 4.15, a = i ? 'left' : 'right', n = sd.items.length, rh = 3.08 / n;
          k.txt(s, i ? 'B' : 'A', i ? 5.3 : 3.95, 1.1, 0.75, 0.9, { size: 46, bold: true, font: F.head, color: i ? INK : C.accent, align: a, valign: 'middle', ls: 1 });
          hd(s, sd.h, i ? x + 0.72 : x, 1.15, w - 0.72, 0.8, { color: 'FFFFFF', max: 18, min: 12, align: a });
          sd.items.forEach((it, j) => bd(s, it, x, 2.02 + j * rh, w, rh - 0.06, { color: 'FFFFFF', align: a, valign: 'middle', max: 13, ls: 1.15 }));
        }
      },
      async (d) => { // one above the other: a lettered disc, then points in a row of little bubbles
        const s = page(d), h = 1.9;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.22 + i * (h + 0.1), n = sd.items.length, x0 = 2.45, gap = 0.14, w = (9.5 - x0 - (n - 1) * gap) / n, fill = i ? INK : SOFT;
          t.oval(s, 0.5, y + 0.02, 0.56, 0.56, i ? INK : C.accent);
          k.txt(s, i ? 'B' : 'A', 0.5, y + 0.02, 0.56, 0.56, { size: 16, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, sd.h, 0.5, y + 0.64, 1.8, h - 0.7, { max: 15, min: 11, valign: 'top' });
          for (const [j, it] of sd.items.entries()) {
            const x = x0 + j * (w + gap);
            await bubble(s, x, y, w, h - 0.06, fill, j ? null : 'l', 0.2);
            bd(s, it, x + 0.1, y + 0.06, w - 0.2, h - 0.18, { color: i ? 'FFFFFF' : C.ink, valign: 'middle', max: 12.5, ls: 1.12 });
          }
        }
      },
    ],
    statement: [
      async (d) => { // black spread: an enormous red mark, the words in white italics
        const s = night(d);
        k.txt(s, '“', 0.35, 0.95, 1.8, 2.2, { size: 150, bold: true, font: F.head, color: C.accent, ls: 1 });
        k.txt(s, L.runs(d.text), 2.0, 1.25, 7.5, 2.4, { size: L.fit(d.text, 7.5, 2.35, 34, 17, F.head, true, 1.1), bold: true, italic: true, font: F.head, color: 'FFFFFF', valign: 'middle', ls: 1.1 });
        if (d.caption) bd(s, d.caption, 2.0, 3.78, 7.5, 1.34, { color: GREY, max: 13.5 });
      },
      async (d) => { // the thought in one great bubble, its note a narrow sidebar beside it
        const s = page(d);
        await bubble(s, 0.5, 1.22, 6.1, 3.45, C.accent, 'b', 0.12);
        k.txt(s, L.runs(d.text), 0.85, 1.35, 5.4, 3.18, { size: L.fit(d.text, 5.4, 3.1, 36, 17, F.head, true, 1.1), bold: true, font: F.head, color: 'FFFFFF', valign: 'middle', ls: 1.1 });
        t.line(s, 6.95, 1.25, 0, 3.87, C.ink, 1.25);
        if (d.caption) bd(s, d.caption, 7.15, 1.25, 2.35, 3.87, { max: 14, color: C.muted, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // dispatches: four columns under black date strips
        const s = page(d), w = 2.25;
        t.rect(s, 0, 1.25, 10, 0.72, INK, { name: 'Strip' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w;
          hd(s, it.year, x, 1.25, w - 0.15, 0.72, { color: i === 3 ? C.accent : 'FFFFFF', max: 20, min: 12 });
          hd(s, it.h, x, 2.07, w - 0.2, 0.56, { max: 14, color: C.accent, valign: 'top' });
          bd(s, it.t, x, 2.65, w - 0.2, 2.47, { max: 13 });
          if (i) t.line(s, x - 0.1, 2.1, 0, 2.95, C.rule, 0.75);
        }
      },
      async (d) => { // black spread: a line through time, events above and below by turns
        const s = night(d), mid = 3.15, step = 1.82, w = 3.5;
        t.line(s, 0, mid, 10, 0, C.accent, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * step, up = i % 2 === 0, y = up ? 1.18 : mid + 0.14, h = up ? mid - 0.12 - y : 5.15 - y;
          t.oval(s, x, mid - 0.1, 0.2, 0.2, 'FFFFFF');
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: 'FFFFFF' } }], x, y, w, 0.4, { font: F.head, bold: true, max: 14, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x, y + 0.42, w, h - 0.44, { color: 'E2E2E2', max: 12.5, ls: 1.15 });
        }
      },
      async (d) => { // the transcript: date, speaker and words, line by ruled line
        const s = page(d), rh = 3.88 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.2 + i * rh;
          if (i) t.line(s, 0.5, y, 9.0, 0, C.rule, 0.75);
          t.rect(s, 0.5, y + 0.14, 1.62, rh - 0.28, i % 2 ? INK : C.accent, { name: 'Date' });
          hd(s, it.year, 0.55, y + 0.14, 1.52, rh - 0.28, { color: 'FFFFFF', max: 17, min: 10.5, align: 'center' });
          hd(s, it.h, 2.3, y + 0.06, 2.3, rh - 0.12, { max: 14 });
          bd(s, it.t, 4.7, y + 0.06, 4.8, rh - 0.12, { valign: 'middle', max: 12.5, ls: 1.12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old question-and-answer grid was the same page for cards, process and timeline
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Suhbat', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: 'F5F5F5', accent1: C.accent, accent2: C.ink, accent3: '2E86AB', accent4: 'F6AE2D', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 107, slug: 'suhbat', name: 'Suhbat', category: 'creative', photos: true, build, style: { tone: "intervyu shakli: kartochka sarlavhalari savol kabi, matn esa aniq javob; jonli va ochiq", limits: {}, prefer: 'text' } };
