/**
 * 49 Shrift — typography as the picture: giant cropped numerals and letters, heavy
 * headlines, one hot orange accent, monochrome photos, a vertical running footer.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F1EFE8', ink: '0B0B0B', accent: 'FF4D00', ghost: 'D9D5CA', muted: '57534B', white: 'FFFFFF' };
const F = { head: 'Arial', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const ghost = (s, txt, x, y, w, h, fs, color = C.ghost) => t.text(s, txt, { x, y, w, h, fontSize: fs, bold: true, color, valign: 'top', margin: 0 });
  const footer = (s) => t.text(s, `${M.topic || ''}  \u2014  ${meta}`, { x: 9.7 - 2.75, y: 2.81 - 0.11, w: 5.5, h: 0.22, fontSize: L.fit(`${M.topic || ''}  \u2014  ${meta}`, 5.4, 0.2, 7.5, 5.5, F.body, true), bold: true, color: C.muted, align: 'center', rotate: 270 });
  const mono = async (s, src, x, y, w, h) => { t.rect(s, x + 0.18, y + 0.18, w, h, C.accent, { name: 'Accent block' }); t.img(s, await L.photo(L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); };
  const stop = (x) => { const v = String(x).trim(); return /[!?\u2026:]$/.test(v) ? [{ text: v }] : [{ text: v.replace(/\.+$/, '') }, { text: '.', options: { color: C.accent } }]; }; // the orange full stop, never doubled
  let idx = 0;
  const page = (d, num = true) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (num) ghost(s, L.pad2(idx), 6.3, -0.75, 4.0, 3.5, 212);
    if (d.title) {
      t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.2, h: 0.95, bold: true, color: C.ink, valign: 'top', fontSize: L.fit(d.title, 7.2, 0.95, 34, 18, F.head, true), lineSpacingMultiple: 0.9 });
      t.rect(s, 0.6, 0.28, 0.5, 0.07, C.accent, { name: 'Accent' });
    }
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'top' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await mono(s, d.image, 6.55, 0.55, 2.7, 3.2);
    const tw = d.image ? 5.7 : 8.6;
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' / ').toUpperCase(), { x: 0.6, y: 0.5, w: tw, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, stop(d.title), { x: 0.55, y: 0.85, w: tw, h: 3.0, bold: true, fontSize: L.fit(d.title + '.', tw, 2.9, 66, 28, F.head, true, 0.9), color: C.ink, valign: 'top', lineSpacingMultiple: 0.88 });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.0, w: tw, h: 0.6, fontSize: 13, color: C.muted });
    t.text(s, (M.author || '').toUpperCase(), { x: 0.6, y: 4.65, w: tw, h: 0.35, fontSize: 13, bold: true, color: C.ink, charSpacing: 3 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await mono(s, d.image, 0.6, 1.6, 3.8, 3.1); para(s, d.text, 4.95, 1.6, 4.3, 3.4); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.6, 4.2, 3.4); await mono(s, d.image, 5.3, 1.6, 3.9, 3.1); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.15, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.4, y = 1.5 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y: y - 0.1, w: 1.2, h: rh, fontSize: 44, bold: true, color: C.accent, valign: 'top', margin: 0 });
        t.text(s, it, { x: x + 1.25, y, w: 2.9, h: rh - 0.15, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.6 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (w + gap);
        ghost(s, (it.h[0] || '').toUpperCase(), x - 0.05, 1.25, w, 2.2, 150);
        t.rect(s, x, 2.55, 0.35, 0.06, C.accent, { name: 'Accent' });
        t.text(s, it.h, { x, y: 2.7, w, h: 0.5, fontSize: L.fit(it.h, w, 0.5, 18, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.2, w, h: 1.8, fontSize: L.fit(it.t, w, 1.8, 14, 10, F.body), color: C.muted });
      });
    },
    async process(d) {
      const s = page(d, false), n = d.steps.length, cw = 8.6 / n;
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        ghost(s, String(i + 1), x - 0.05, 1.1, cw, 2.0, 130, i === n - 1 ? C.accent : C.ghost);
        t.text(s, st.h, { x, y: 2.85, w: cw - 0.3, h: 0.5, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.35, w: cw - 0.3, h: 1.65, fontSize: L.fit(st.t, cw - 0.3, 1.65, 14, 10, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d, false), n = d.stats.length, cw = 8.6 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px - 0.05, y: 1.45, w: cw - 0.1, h: 1.6, fontSize: L.fit(x.value, cw - 0.2, 1.5, 96, 36, F.head, true), bold: true, color: i === 0 ? C.accent : C.ink, valign: 'bottom', margin: 0 });
        t.text(s, x.label, { x: px, y: 3.2, w: cw - 0.35, h: 1.0, fontSize: 14, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.6, h: 0.45, fontSize: 9.5, color: C.muted });
    },
    async compare(d) {
      const s = page(d, false), w = 4.1;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.2, 4.95 - 2.8);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        ghost(s, i ? 'B' : 'A', x - 0.05, 1.05, 1.6, 1.8, 120, i ? C.accent : C.ghost);
        t.text(s, side.h, { x: x + 1.3, y: 1.7, w: w - 1.3, h: 0.7, fontSize: L.fit(side.h, w - 1.3, 0.7, 22, 14, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
        let y = 2.8;
        side.items.forEach((it, k) => { t.text(s, it, { x, y, w, h: rows[k], fontSize: CFS, color: C.ink }); t.line(s, x, y + rows[k] - 0.06, w, 0, C.ghost, 0.75); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({}, false);
      t.text(s, stop(d.text), { x: 0.55, y: 0.45, w: 8.7, h: 3.3, bold: true, fontSize: L.fit(d.text + '.', 8.7, 3.2, 64, 26, F.head, true, 0.9), color: C.ink, valign: 'top', lineSpacingMultiple: 0.88 });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.95, w: 7.0, h: 1.0, fontSize: L.fit(d.caption, 7.0, 1.0, 14, 10, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d, false), n = d.items.length, cw = 8.6 / n;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x: x - 0.04, y: 1.45, w: cw - 0.1, h: 1.0, fontSize: L.fit(it.year, cw - 0.2, 0.95, 54, 20, F.head, true), bold: true, color: i === n - 1 ? C.accent : C.ink, valign: 'bottom', margin: 0 });
        t.line(s, x, 2.6, cw - 0.25, 0, C.ink, 2);
        t.text(s, it.h, { x, y: 2.75, w: cw - 0.3, h: 0.45, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.2, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({}, false);
      ghost(s, '\u201C', 0.3, -0.9, 3.0, 3.6, 300, C.accent);
      t.text(s, d.text, { x: 1.2, y: 1.3, w: 7.9, h: 2.6, bold: true, fontSize: L.fit(d.text, 7.9, 2.5, 36, 18, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author.toUpperCase(), { x: 1.2, y: 4.05, w: 7.9, h: 0.35, fontSize: 12, bold: true, color: C.accent, charSpacing: 3 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 0.6, h: rh, fontSize: 15, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, type always the picture: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const footC = (s, color) => t.text(s, `${M.topic || ''}  —  ${meta}`, { x: 9.7 - 2.75, y: 2.81 - 0.11, w: 5.5, h: 0.22, fontSize: L.fit(`${M.topic || ''}  —  ${meta}`, 5.4, 0.2, 7.5, 5.5, F.body, true), bold: true, color, align: 'center', rotate: 270 });
  const DIM = '2A2A2A', PALE = 'D6D3CB';
  const poster = (d, bg = C.ink) => { // the inverted page: black (or all orange) with the type turned round
    const dark = bg === C.ink, s = pres.addSlide(); s.background = { color: bg }; idx++;
    ghost(s, L.pad2(idx), 6.3, -0.75, 4.0, 3.5, 212, dark ? DIM : 'E84500');
    if (d.title) {
      t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.2, h: 0.95, bold: true, color: dark ? C.white : C.ink, valign: 'top', fontSize: L.fit(d.title, 7.2, 0.95, 34, 18, F.head, true), lineSpacingMultiple: 0.9 });
      t.rect(s, 0.6, 0.28, 0.5, 0.07, dark ? C.accent : C.ink, { name: 'Accent' });
    }
    footC(s, dark ? PALE : C.ink);
    return s;
  };
  const memo = {};
  const V = {
    image: [
      async (d) => { // a long grey band of picture on its orange block, words set wide beneath
        const s = page(d);
        await mono(s, d.image, 0.6, 1.42, 8.3, 1.8);
        t.text(s, d.text, { x: 0.6, y: 3.56, w: 8.6, h: 1.72, fontSize: L.fit(d.text, 8.6, 1.72, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // black: picture bleeds off the left half, title and text turn white on the right
        const s = pres.addSlide(); s.background = { color: C.ink }; idx++;
        t.img(s, await L.photo(L.src(d.image), 4.4, H, { gray: true }), 0, 0, 4.4, H, { alt: '' });
        t.rect(s, 4.4, 0, 0.12, H, C.accent, { name: 'Accent block' });
        t.rect(s, 4.85, 0.28, 0.5, 0.07, C.accent, { name: 'Accent' });
        t.text(s, d.title, { x: 4.85, y: 0.4, w: 4.4, h: 1.05, bold: true, color: C.white, valign: 'top', fontSize: L.fit(d.title, 4.4, 1.05, 26, 15, F.head, true), lineSpacingMultiple: 0.9 });
        t.text(s, d.text, { x: 4.85, y: 1.6, w: 4.4, h: 3.7, fontSize: L.fit(d.text, 4.4, 3.7, 14, 10, F.body, false, 1.25), color: PALE, lineSpacingMultiple: 1.25 });
        footC(s, PALE);
      },
      async (d) => { // the picture burnt in orange across the page, a black slab of type over its foot
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { duo: [C.ink, C.accent] }), 0, 0, W, H, { alt: '' });
        t.rect(s, 9.45, 0, W - 9.45, H, C.ink, { name: 'Edge' });
        t.rect(s, 0, 2.42, 9.45, H - 2.42, C.ink, { name: 'Slab' });
        t.text(s, d.title, { x: 0.6, y: 2.56, w: 8.5, h: 0.8, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.5, 0.78, 28, 16, F.head, true), lineSpacingMultiple: 0.9 });
        t.text(s, d.text, { x: 0.6, y: 3.42, w: 8.5, h: 1.95, fontSize: L.fit(d.text, 8.5, 1.95, 14, 10, F.body, false, 1.2), color: PALE, lineSpacingMultiple: 1.2 });
        footC(s, PALE);
      },
      async (d) => { // the picture cut as one giant slash
        const s = page(d), x = 0.5, y = 1.4, w = 4.5, h = 3.95, poly = [[0.38, 0], [1, 0], [0.62, 1], [0, 1]];
        t.img(s, (memo.slash ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="450" height="395"><polygon points="171,0 450,0 279,395 0,395" fill="#${C.accent}"/></svg>`, 450, 395)), x + 0.16, y, w, h);
        t.img(s, await L.photo(L.src(d.image), w, h, { gray: true, mask: { poly } }), x, y, w, h, { alt: '' });
        t.text(s, d.text, { x: 5.15, y: 1.5, w: 4.1, h: 3.78, fontSize: L.fit(d.text, 4.1, 3.78, 14, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'bottom' });
      },
    ],
    cards: [
      async (d) => { // heavy rules: columns start at two heights, a black square carries each icon
        const s = page(d), n = d.items.length, gap = 0.22, w = (8.6 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.5 + (i % 2 ? 0.46 : 0);
          t.rect(s, x, y, w, 0.08, i % 2 ? C.accent : C.ink, { name: 'Rule' });
          t.rect(s, x, y + 0.2, 0.56, 0.56, i % 2 ? C.accent : C.ink, { name: 'Square' });
          t.img(s, await L.icon(it.icon, i % 2 ? C.ink : C.white, 2), x + 0.12, y + 0.32, 0.32, 0.32);
          head(s, it.h, x, y + 0.86, w, 0.6, { max: 15 });
          body(s, it.t, x, y + 1.5, w, 5.32 - y - 1.5 - (i % 2 ? 0 : 0.2));
        }
      },
      async (d) => { // black: four fields, the first letter of each burnt in grey behind the words
        const s = poster(d), n = d.items.length, w = 4.2, h = 1.84;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.46 + Math.floor(i / 2) * (h + 0.1);
          t.rect(s, x, y, ww, 0.05, C.accent, { name: 'Rule' });
          ghost(s, (it.h[0] || '').toUpperCase(), x + ww - 1.25, y + 0.02, 1.25, 1.65, 100, DIM);
          head(s, it.h, x, y + 0.14, ww - 1.0, 0.42, { color: C.white, max: 16 });
          body(s, it.t, x, y + 0.6, ww - 0.1, h - 0.66, { color: PALE });
        }
      },
      async (d) => { // one thought set large in black, the others stacked small beside it
        const s = page(d), [a, ...rest] = d.items, h = 3.84 / rest.length;
        t.rect(s, 0.6, 1.46, 4.1, 3.84, C.ink, { name: 'Block' });
        t.img(s, await L.icon(a.icon, C.accent, 2), 0.82, 1.66, 0.5, 0.5);
        head(s, a.h, 0.82, 2.26, 3.66, 1.0, { color: C.white, max: 26, valign: 'middle' });
        body(s, a.t, 0.82, 3.3, 3.66, 1.86, { color: PALE, max: 14 });
        for (const [i, it] of rest.entries()) {
          const y = 1.46 + i * h;
          t.rect(s, 4.95, y, 4.3, 0.05, C.ink, { name: 'Rule' });
          t.img(s, await L.icon(it.icon, C.accent, 2), 4.95, y + 0.14, 0.3, 0.3);
          head(s, it.h, 5.35, y + 0.12, 3.9, 0.36, { max: 14, valign: 'middle' });
          body(s, it.t, 5.35, y + 0.5, 3.9, h - 0.56);
        }
      },
      async (d) => { // a column of numbers set as big as the row will carry
        const s = page(d), n = d.items.length, h = 3.86 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.46 + i * h, fs = Math.min(50, Math.round(h * 48));
          t.rect(s, 0.6, y, 8.65, 0.05, C.ink, { name: 'Rule' });
          t.text(s, L.pad2(i + 1), { x: 0.56, y: y + 0.06, w: 1.45, h: h - 0.1, bold: true, color: C.accent, fontSize: fs, valign: 'middle', margin: 0 });
          head(s, it.h, 2.05, y + 0.1, 2.5, h - 0.16, { max: 17, valign: 'middle' });
          body(s, it.t, 4.65, y + 0.09, 4.1, h - 0.14, { valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.ink, 2), 8.93, y + h / 2 - 0.16, 0.32, 0.32);
        }
      },
    ],
    process: [
      async (d) => { // numerals walking downstairs, a heavy tread under each
        const s = page(d, false), n = d.steps.length, cw = 8.65 / n, dy = n === 4 ? 0.3 : 0.42;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, y = 1.36 + i * dy, w = cw - 0.18;
          t.text(s, String(i + 1), { x: x - 0.03, y: y - 0.06, w, h: 0.98, bold: true, color: i === n - 1 ? C.accent : C.ink, fontSize: 60, valign: 'top', margin: 0 });
          t.rect(s, x, y + 0.94, w, 0.08, C.ink, { name: 'Tread' });
          head(s, st.h, x, y + 1.08, w, 0.5, { max: 14 });
          body(s, st.t, x, y + 1.6, w, 5.32 - y - 1.6);
        }
      },
      async (d) => { // one thick black stroke down the middle, steps cut to either side of it
        const s = page(d, false), n = d.steps.length, gap = n === 4 ? 0.93 : 1.28, h = n === 4 ? 1.2 : 1.32, w = 3.72, cx = 4.92;
        t.rect(s, cx - 0.06, 1.42, 0.12, 3.9, C.ink, { name: 'Stroke' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.44 + i * gap, x = right ? cx + 0.44 : cx - 0.44 - w, a = right ? 'left' : 'right';
          t.rect(s, cx - 0.3, y, 0.6, 0.6, C.accent, { name: 'Number' });
          t.text(s, String(i + 1), { x: cx - 0.3, y, w: 0.6, h: 0.6, bold: true, color: C.ink, fontSize: 24, align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.34, { align: a, max: 15, valign: 'middle' });
          body(s, st.t, x, y + 0.38, w, h - 0.42, { align: a });
        }
      },
      async (d) => { // the whole page goes orange, black type and arrows run across it
        const s = poster(d, C.accent), n = d.steps.length, cw = 8.65 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, w = cw - 0.2;
          t.text(s, String(i + 1), { x: x - 0.03, y: 1.34, w: 0.9, h: 1.2, bold: true, color: C.ink, fontSize: 72, valign: 'top', margin: 0 });
          if (i < n - 1) t.text(s, '→', { x: x + 0.72, y: 1.62, w: w - 0.72, h: 0.6, bold: true, color: C.ink, fontSize: 30, valign: 'middle', align: 'right' });
          t.rect(s, x, 2.56, w, 0.06, C.ink, { name: 'Rule' });
          head(s, st.h, x, 2.7, w, 0.5, { max: 15 });
          body(s, st.t, x, 3.24, w, 2.06, { color: C.ink });
        }
      },
    ],
    stats: [
      async (d) => { // one number as wide as the page, two small ones at its foot
        const s = page(d, false), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: 0.55, y: 1.32, w: 5.5, h: 1.72, bold: true, color: C.accent, valign: 'middle', margin: 0, fontSize: L.fit(a.value, 5.45, 1.66, 110, 40, F.head, true) });
        body(s, a.label, 6.2, 1.5, 3.05, 1.46, { valign: 'middle', color: C.ink, max: 15 });
        t.rect(s, 0.6, 3.1, 8.65, 0.08, C.ink, { name: 'Rule' });
        for (const [i, v] of rest.entries()) {
          const x = 0.6 + i * 2.9;
          t.text(s, v.value, { x, y: 3.24, w: 2.7, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(v.value, 2.65, 0.68, 40, 18, F.head, true) });
          body(s, v.label, x, 3.98, 2.65, 0.9, {});
        }
        if (d.note) body(s, d.note, 6.45, 3.3, 2.8, 2.0, { valign: 'middle', max: 12 });
      },
      async (d) => { // black: numbers ranged right down the page, words ranged left after them
        const s = poster(d), h = 0.92;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.42 + i * h;
          t.text(s, v.value, { x: 0.6, y, w: 4.0, h: h - 0.06, bold: true, color: i ? C.white : C.accent, align: 'right', valign: 'middle', margin: 0, fontSize: L.fit(v.value, 3.95, h - 0.1, 52, 22, F.head, true) });
          t.rect(s, 4.78, y + 0.1, 0.05, h - 0.26, C.accent, { name: 'Rule' });
          body(s, v.label, 5.0, y, 4.25, h - 0.06, { color: PALE, valign: 'middle', max: 15 });
        }
        if (d.note) body(s, d.note, 0.6, 4.28, 8.65, 1.02, { color: PALE, max: 12, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored about one heavy stroke, set from it outward
        const s = page(d, false), w = 3.95, cx = 4.92;
        t.rect(s, cx - 0.05, 1.4, 0.1, 3.92, C.ink, { name: 'Stroke' });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.2, 3.02);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.28 : cx - 0.28 - w, a = i ? 'left' : 'right';
          head(s, side.h, x, 1.4, w, 0.76, { max: 26, align: a, valign: 'middle', color: i ? C.accent : C.ink });
          let y = 2.26;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: C.ink, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two bands of colour, a great A and a great B cut into them
        const s = page(d, false), h = 1.86;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.44 + i * (h + 0.08), dark = !i, rh = (h - 0.56) / Math.ceil(side.items.length / 2), ink = dark ? C.white : C.ink;
          t.rect(s, 0, y, 9.45, h, dark ? C.ink : C.accent, { name: 'Band' });
          t.text(s, i ? 'B' : 'A', { x: 0.5, y: y + 0.08, w: 1.4, h: h - 0.16, bold: true, color: dark ? C.accent : C.ink, fontSize: 90, valign: 'middle', margin: 0 });
          head(s, side.h, 2.0, y + 0.08, 7.0, 0.44, { color: ink, max: 18, valign: 'middle' });
          side.items.forEach((it, j) => body(s, it, 2.0 + (j % 2) * 3.65, y + 0.52 + Math.floor(j / 2) * rh, 3.5, rh - 0.04, { color: dark ? PALE : C.ink, max: 13, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // black: small note up top, the great words sit on the foot of the page
        const s = poster({});
        if (d.caption) body(s, d.caption, 0.6, 0.42, 5.4, 1.2, { color: PALE, max: 13 });
        t.text(s, stop(d.text), { x: 0.55, y: 1.72, w: 8.7, h: 3.55, bold: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.9, fontSize: L.fit(d.text + '.', 8.7, 3.45, 60, 24, F.head, true, 0.9) });
      },
      async (d) => { // all orange: a narrow column of note, the words filling the rest
        const s = poster({}, C.accent);
        t.rect(s, 0.6, 0.45, 0.08, 4.85, C.ink, { name: 'Stroke' });
        if (d.caption) body(s, d.caption, 0.85, 0.45, 2.4, 4.85, { color: C.ink, max: 13, valign: 'bottom' });
        t.text(s, L.runs(d.text), { x: 3.5, y: 0.45, w: 5.75, h: 4.85, bold: true, color: C.ink, valign: 'top', lineSpacingMultiple: 0.9, fontSize: L.fit(d.text, 5.75, 4.75, 50, 22, F.head, true, 0.9) });
      },
    ],
    timeline: [
      async (d) => { // one black stroke across: years stand above it and hang beneath it
        const s = page(d, false), axis = 3.32, w = 3.7;
        t.rect(s, 0, axis - 0.05, 9.45, 0.1, C.ink, { name: 'Stroke' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.6 + (i / 2) * 4.4 : 1.55 + ((i - 1) / 2) * 4.4, top = up ? 1.44 : 3.46;
          t.text(s, it.year, { x, y: top, w, h: 0.5, bold: true, color: up ? C.ink : C.accent, valign: 'middle', margin: 0, fontSize: L.fit(it.year, w, 0.48, 28, 14, F.head, true) });
          head(s, it.h, x, top + 0.5, w, 0.32, { max: 13, valign: 'middle' });
          body(s, it.t, x, top + 0.84, w, up ? 0.98 : 1.0, {});
        }
      },
      async (d) => { // black: years step in to the right, line by line
        const s = poster(d), h = 0.9;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * 0.32, y = 1.46 + i * 0.96, w = 8.65 - i * 0.32;
          t.rect(s, x, y, w, 0.04, C.accent, { name: 'Rule' });
          t.text(s, it.year, { x, y: y + 0.06, w: 2.0, h: h - 0.08, bold: true, color: i === 3 ? C.accent : C.white, valign: 'middle', margin: 0, fontSize: L.fit(it.year, 1.95, h - 0.14, 30, 14, F.head, true) });
          head(s, it.h, x + 2.05, y + 0.08, 1.75, h - 0.12, { color: C.white, max: 13, valign: 'middle' });
          body(s, it.t, x + 3.85, y + 0.08, w - 3.85, h - 0.12, { color: PALE, max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Shrift', colors: { dk1: C.ink, lt1: C.white, dk2: '2A2A2A', lt2: C.bg, accent1: C.accent, accent2: C.ink, accent3: C.muted, accent4: C.ghost, accent5: 'A8A396', accent6: 'FF8A5C', hlink: C.accent, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "qat'iy va ixcham: sarlavhalar 2–5 so'z, kuchli fe'llar, ortiqcha so'zsiz", limits: { title: 40, stmt: 55, card_h: 18 }, prefer: 'data' };
module.exports = { id: 49, slug: 'shrift', name: 'Şrift', category: 'minimalist', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["cut", "wipe:r", "split"], "cover": ["typeLetters", "stretch"], "mark": "appear", "deco": "stretch", "sig": {"title": "typeLetters", "body": "wipeWords", "item": "stretch", "image": "unfold", "number": "stretch", "order": "seq", "stagger": 0.14}, "tempo": 0.9, "kenburns": false};
