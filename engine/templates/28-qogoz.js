/**
 * 28 Qog'oz — layered paper-cut: stacked wavy paper layers in lilac shades with soft
 * shadows, photos cut with wavy edges, paper cards that cast shadows.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { l1: 'F4F0FB', l2: 'DCD0F4', l3: 'BFA9EA', l4: '9B7FD8', l5: '7457BF', l6: '4C3394', ink: '2A1E52', white: 'FFFFFF', muted: '5E5480' };
const F = { head: 'Calibri', body: 'Calibri' };

function wavesSvg(w, h, layers, top) { // stacked waves with shadow
  let out = '';
  layers.forEach((col, i) => {
    const y = top + i * ((h - top) / (layers.length + 0.6)), a = 22 + i * 6, ph = i * 1.3;
    let d = `M0,${h} L0,${y}`;
    for (let x = 0; x <= w; x += 20) d += ` L${x},${(y + a * Math.sin(x / (w / (2.2 + i * 0.4)) * Math.PI + ph)).toFixed(1)}`;
    d += ` L${w},${h} Z`;
    out += `<path d="${d}" fill="#000" opacity="0.12" transform="translate(0 -6)" filter="url(#b)"/><path d="${d}" fill="#${col}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b"><feGaussianBlur stdDeviation="6"/></filter></defs>${out}</svg>`;
}
const WAVY = 'M0,0.06 C0.25,0 0.5,0.12 0.75,0.05 C0.88,0.02 0.95,0.04 1,0.06 L1,0.94 C0.75,1 0.5,0.88 0.25,0.95 C0.12,0.98 0.05,0.96 0,0.94 Z';

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const cover = await L.svg(wavesSvg(1600, 900, [C.l2, C.l3, C.l4, C.l5, C.l6], 500), 1600, 900);
  const foot = await L.svg(wavesSvg(1600, 150, [C.l3, C.l5], 20), 1600, 150);
  let idx = 0;

  const footer = (s) => {
    t.img(s, foot, 0, H - 0.85, W, 0.85);
    t.text(s, M.topic || '', { x: 0.6, y: 5.25, w: 4.6, h: 0.25, fontSize: 9, bold: true, color: C.white });
    t.text(s, meta, { x: 4.6, y: 5.25, w: 4.8, h: 0.25, fontSize: 9, color: C.white, align: 'right' });
  };
  const paper = (s, x, y, w, h, fill = C.white) => t.rect(s, x, y, w, h, fill, { r: 0.25, shadow: 0.18, blur: 14, offset: 4, shadowColor: '2A1E52', name: 'Paper' });
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.l1 }; idx++;
    paper(s, 0.6, 0.45, 0.6, 0.55, C.l5);
    t.text(s, L.pad2(idx), { x: 0.6, y: 0.45, w: 0.6, h: 0.55, fontSize: 14, bold: true, color: C.white, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.4, w: 8.0, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 28, 18, F.head, true) });
    footer(s);
    return s;
  };
  const wavyPhoto = async (s, img, x, y, w, h, alt) => t.img(s, await L.photo(img, w, h, { mask: { path: WAVY } }), x, y, w, h, { alt });

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.l1 }; idx++;
      t.img(s, cover, 0, 0, W, H);
      await wavyPhoto(s, L.src(d.image), 5.6, 0.45, 3.9, 2.9, d.title);
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.6, y: 0.5, w: 4.6, h: 0.3, fontSize: 12, bold: true, color: C.l5 });
      const fs = L.fit(d.title, 4.8, 1.5, 40, 22, F.head, true);
      t.text(s, d.title, { x: 0.6, y: 0.85, w: 4.8, h: 1.55, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.45, w: 4.6, h: 0.6, fontSize: 12, color: C.muted });
      t.text(s, M.author || '', { x: 0.6, y: 4.8, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.white });
    },
    async intro(d) {
      const s = page(d);
      await wavyPhoto(s, L.src(d.image), 0.6, 1.25, 4.0, 3.4, d.title);
      paper(s, 4.95, 1.25, 4.45, 3.4);
      t.text(s, d.text, { x: 5.2, y: 1.4, w: 3.95, h: 3.1, fontSize: L.fit(d.text, 3.95, 3.1, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.3 + (i % per) * rh;
        paper(s, x, y, 4.2, rh - 0.2);
        t.oval(s, x + 0.18, y + (rh - 0.2 - 0.5) / 2, 0.5, 0.5, [C.l3, C.l4, C.l5][i % 3]);
        t.text(s, String(i + 1), { x: x + 0.18, y: y + (rh - 0.2 - 0.5) / 2, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.2, h: rh - 0.2, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d);
      await wavyPhoto(s, L.src(d.image), 4.9, 1.2, 4.5, 3.5, d.title);
      paper(s, 0.6, 1.25, 4.0, 3.4, C.l2);
      t.text(s, d.text, { x: 0.85, y: 1.4, w: 3.5, h: 3.1, fontSize: L.fit(d.text, 3.5, 3.1, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.35, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        paper(s, x, 1.3, w, h);
        t.oval(s, x + 0.25, 1.52, 0.62, 0.62, [C.l4, C.l5, C.l6, C.l3][i % 4]);
        t.img(s, await L.icon(it.icon, C.white, 2), x + 0.41, 1.68, 0.3, 0.3);
        t.text(s, it.h, { x: x + 0.25, y: 2.3, w: w - 0.5, h: 0.42, fontSize: L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.25, y: 2.75, w: w - 0.5, h: h - 1.55, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n, fills = [C.l2, C.l3, C.l4, C.l5];
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap), y = 1.3 + i * 0.12, f = fills[Math.min(3, i)], fg = i >= 2 ? C.white : C.ink;
        paper(s, x, y, w, 3.1, f);
        t.text(s, L.pad2(i + 1), { x: x + 0.22, y: y + 0.2, w: w - 0.44, h: 0.55, fontSize: 26, bold: true, color: fg });
        t.text(s, st.h, { x: x + 0.22, y: y + 0.8, w: w - 0.44, h: 0.62, fontSize: L.fit(st.h, w - 0.44, 0.6, 16, 11, F.head, true), bold: true, color: fg });
        t.text(s, st.t, { x: x + 0.22, y: y + 1.45, w: w - 0.44, h: 1.5, fontSize: L.fit(st.t, w - 0.44, 1.5, 14, 11, F.body), color: fg });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        paper(s, px + 0.1, 1.45, w - 0.2, 2.5, C.l2); paper(s, px, 1.35, w - 0.2, 2.5);
        t.text(s, x.value, { x: px + 0.25, y: 1.5, w: w - 0.7, h: 1.1, fontSize: L.fit(x.value, w - 0.7, 1.0, 52, 26, F.head, true), bold: true, color: C.l5, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.25, y: 2.7, w: w - 0.7, h: 1.0, fontSize: 14, color: C.ink });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.15, w: 8.8, h: 0.4, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.85, F.body, 0.2, 4.85 - 2.1);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fill = i ? C.l5 : C.white, fg = i ? C.white : C.ink;
        paper(s, x, 1.3, w, 3.35, fill);
        t.text(s, side.h, { x: x + 0.3, y: 1.45, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: i ? C.l2 : C.l5 });
        let y = 2.1;
        side.items.forEach((it, k) => { t.oval(s, x + 0.32, y + 0.07, 0.14, 0.14, i ? C.l2 : C.l4); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: CFS, color: fg }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      paper(s, 1.0, 1.35, 8.0, 3.2, C.l6);
      const fs = L.fit(d.text, 7.0, 1.5, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 1.5, y: 1.5, w: 7.0, h: 1.7, fontSize: fs, bold: true, color: C.white, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.6, y: 3.3, w: 6.8, h: 1.1, fontSize: L.fit(d.caption, 6.8, 1.1, 14, 10, F.body), color: C.l2, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (w + gap), y = 1.3 + (n - 1 - i) * 0.15;
        paper(s, x, y, w, 3.3 - (n - 1 - i) * 0.15, [C.l2, C.l3, C.l4, C.l5][Math.min(3, i)]);
        const fg = i >= 2 ? C.white : C.ink;
        t.text(s, it.year, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.6, fontSize: L.fit(it.year, w - 0.4, 0.55, 28, 14, F.head, true), bold: true, color: fg });
        t.text(s, it.h, { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: 0.4, fontSize: 15, bold: true, color: fg });
        t.text(s, it.t, { x: x + 0.2, y: y + 1.22, w: w - 0.4, h: 1.75, fontSize: L.fit(it.t, w - 0.4, 1.7, 14, 10, F.body), color: fg });
      });
    },
    async quote(d) {
      const s = page({});
      paper(s, 1.2, 0.85, 7.6, 3.4);
      t.text(s, '\u201C', { x: 1.5, y: 0.9, w: 1, h: 1, fontSize: 80, bold: true, color: C.l4 });
      t.text(s, d.text, { x: 1.8, y: 1.5, w: 6.4, h: 1.9, fontSize: L.fit(d.text, 6.4, 1.8, 28, 16, F.head, true), bold: true, color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.8, y: 3.55, w: 6.4, h: 0.4, fontSize: 14, color: C.l5, bold: true });
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      paper(s, 0.6, 1.25, 8.8, 3.4);
      const rh = Math.min(0.52, 3.1 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, `${i + 1}`, { x: 0.85, y, w: 0.35, h: rh, fontSize: 13, bold: true, color: C.l5, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.l1 }; idx++;
      t.img(s, cover, 0, 0, W, H);
      await wavyPhoto(s, L.src(d.image), 0.6, 0.5, 3.6, 2.7, d.title);
      const fs = L.fit(d.title, 4.8, 1.5, 38, 22, F.head, true);
      t.text(s, d.title, { x: 4.6, y: 0.6, w: 4.8, h: 1.6, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 4.6, y: 2.3, w: 4.8, h: 0.5, fontSize: 14, color: C.muted });
      t.text(s, M.author || '', { x: 0.6, y: 4.55, w: 6, h: 0.4, fontSize: 16, bold: true, color: C.white });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', ') + '   |   ' + (M.topic || ''), { x: 0.6, y: 4.95, w: 8.8, h: 0.3, fontSize: 11, color: C.l2 });
    },
  };
  // ---- further ways to draw a type, all cut from paper: a deck's pages must not look alike (L.pages)
  const ON = (f) => ([C.l5, C.l6].includes(f) ? C.white : C.ink);
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 12, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const chip = (s, x, y, f = C.l5, fg = C.white) => { paper(s, x, y, 0.6, 0.55, f); t.text(s, L.pad2(idx), { x, y, w: 0.6, h: 0.55, fontSize: 14, bold: true, color: fg, align: 'center', valign: 'middle' }); };
  const bare = (bg = C.l1) => { const s = pres.addSlide(); s.background = { color: bg }; idx++; return s; };
  const footText = (s, color = C.white) => { t.text(s, M.topic || '', { x: 0.6, y: 5.25, w: 4.6, h: 0.25, fontSize: 9, bold: true, color }); t.text(s, meta, { x: 4.6, y: 5.25, w: 4.8, h: 0.25, fontSize: 9, color, align: 'right' }); };
  // the dark sheet at the back of the stack
  const night = (d) => { const s = bare(C.l6); footer(s); chip(s, 0.6, 0.45, C.l3, C.ink); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.4, w: 8.0, h: 0.65, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 28, 18, F.head, true) }); return s; };
  const shadow = () => '<filter id="b"><feGaussianBlur stdDeviation="5"/></filter>';
  // discs of paper one on another, a hole cut through the stack
  const rings = (s, cx, cy, list) => { for (const [dia, f] of list) t.rect(s, cx - dia / 2, cy - dia / 2, dia, dia, f, { r: dia / 2, shadow: 0.2, blur: 10, offset: 3, shadowColor: '2A1E52', name: 'Paper ring' }); };
  // a ribbon of paper running across the page
  const ribbon = (w, h, col, amp = 0.3, waves = 2) => { let d = ''; for (let x = 0; x <= w; x += 10) d += `${x ? 'L' : 'M'}${x},${(h / 2 + (h / 2 - 16) * amp * 2 * Math.sin((x / w) * waves * 2 * Math.PI)).toFixed(1)} `; return L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${shadow()}</defs><path d="${d}" fill="none" stroke="#000" stroke-opacity="0.15" stroke-width="20" transform="translate(0 5)" filter="url(#b)"/><path d="${d}" fill="none" stroke="#${col}" stroke-width="16" stroke-linecap="round"/></svg>`, w, h); };
  const ribbonY = (x, w, y, h, amp = 0.3, waves = 2) => y + h / 2 + (h / 2 - 0.16) * amp * 2 * Math.sin((x / w) * waves * 2 * Math.PI);
  // one sheet with a wavy edge
  const wavySheet = (col, w = 500, h = 563) => { let e = ''; for (let y = 0; y <= h; y += 10) { const x = w - 26 + 20 * Math.sin((y / h) * 3 * Math.PI); e += `L${x.toFixed(1)},${y} `; } return L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${shadow()}</defs><path d="M0,0 ${e} L0,${h} Z" fill="#000" opacity="0.2" transform="translate(5 0)" filter="url(#b)"/><path d="M0,0 ${e} L0,${h} Z" fill="#${col}"/></svg>`, w, h); };
  const BLOB = 'M0.5,0.03 C0.72,0 0.9,0.12 0.96,0.32 C1,0.52 0.98,0.72 0.82,0.88 C0.68,1 0.42,1 0.24,0.92 C0.06,0.82 0,0.62 0.03,0.42 C0.06,0.2 0.26,0.06 0.5,0.03 Z';
  const blobBack = (col) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 1 1"><path d="${BLOB}" fill="#${col}"/></svg>`, 400, 400);
  const V = {
    image: [
      async (d) => { // the picture is torn along the top of a white sheet
        const s = bare(), ph = 2.7;
        footer(s);
        t.img(s, await L.photo(L.src(d.image), W, ph, { mask: { path: 'M0,0 L1,0 L1,0.86 C0.8,1 0.6,0.82 0.4,0.94 C0.25,1 0.1,0.88 0,0.94 Z' } }), 0, 0, W, ph, { alt: d.title });
        paper(s, 0.6, 2.32, 8.8, 2.42);
        chip(s, 0.8, 2.48);
        head(s, d.title, 1.55, 2.44, 7.65, 0.62, { max: 22 });
        longText(s, d.text, 0.85, 3.1, 8.3, 1.56, { max: 13.5 });
      },
      async (d) => { // the dark sheet with a hole cut through the stack: the picture lies at its bottom
        const s = night(d), cx = 7.15, cy = 3.0, dia = 2.65;
        rings(s, cx, cy, [[3.7, C.l5], [3.3, C.l4], [2.95, C.l3]]);
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), cx - dia / 2, cy - dia / 2, dia, dia, { alt: d.title });
        longText(s, d.text, 0.6, 1.25, 4.6, 3.45, { color: C.white, max: 14, valign: 'middle' });
      },
      async (d) => { // the whole picture behind, one dark sheet with a wavy edge over it
        const s = bare();
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.img(s, await wavySheet(C.l6), 0, 0, 5.4, H);
        chip(s, 0.6, 0.42, C.l3, C.ink);
        t.text(s, d.title, { x: 1.4, y: 0.35, w: 3.5, h: 1.05, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 3.5, 1.0, 24, 16, F.head, true) });
        longText(s, d.text, 0.6, 1.5, 4.25, 3.15, { color: C.white, max: 13.5 });
        t.img(s, foot, 0, H - 0.85, W, 0.85);
        footText(s);
      },
      async (d) => { // a cut-out shape of picture on two shapes of paper
        const s = page(d), w = 4.0, h = 3.5, x = 0.75, y = 1.2;
        t.img(s, await blobBack(C.l3), x - 0.18, y - 0.1, w, h);
        t.img(s, await blobBack(C.l2), x + 0.22, y + 0.12, w, h);
        t.img(s, await L.photo(L.src(d.image), w - 0.25, h - 0.25, { mask: { path: BLOB } }), x + 0.06, y + 0.02, w - 0.25, h - 0.25, { alt: d.title });
        longText(s, d.text, 5.1, 1.25, 4.3, 3.4, { valign: 'middle', max: 14 });
      },
    ],
    cards: [
      async (d) => { // the dark sheet: lit tiles lying on it, two by two
        const s = night(d), n = d.items.length, w = 4.3, h = 1.62, fills = [C.white, C.l2, C.l3, C.white];
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.2 + Math.floor(i / 2) * (h + 0.14);
          paper(s, x, y, ww, h, fills[i]);
          t.oval(s, x + 0.2, y + 0.2, 0.58, 0.58, C.l5);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.35, y + 0.35, 0.28, 0.28);
          head(s, it.h, x + 0.95, y + 0.14, ww - 1.15, 0.42, { max: 16 });
          body(s, it.t, x + 0.95, y + 0.57, ww - 1.15, h - 0.67, { max: 13, color: C.ink });
        }
      },
      async (d) => { // strips of paper laid in a stack, each a shade deeper
        const s = page(d), n = d.items.length, g = -0.04, h = (3.6 - g * (n - 1)) / n, fills = [C.l1, C.l2, C.l3, C.l5];
        for (let i = n - 1; i >= 0; i--) {
          const it = d.items[i], y = 1.15 + i * (h + g), f = fills[n === 3 && i === 2 ? 3 : i], fg = ON(f);
          paper(s, 0.6, y, 8.8, h, f === C.l1 ? C.white : f);
          t.img(s, await L.icon(it.icon, f === C.l5 ? C.white : C.l5, 2), 0.85, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, 1.45, y + 0.06, 2.7, h - 0.12, { color: fg, max: 16 });
          body(s, it.t, 4.25, y + 0.06, 5.0, h - 0.12, { color: fg, max: 13.5, valign: 'middle' });
        }
      },
      async (d) => { // arched doors cut in paper, of different heights
        const s = page(d), n = d.items.length, g = 0.14, w = (8.8 - g * (n - 1)) / n, base = 4.74, fills = [C.l2, C.l3, C.l2, C.l3], tops = [1.3, 1.12, 1.42, 1.18];
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + g), y = tops[i], h = base - y, r = w / 2;
          t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="${Math.round(h * 100)}"><path d="M0,${h * 100} L0,${r * 100} A${r * 100},${r * 100} 0 0 1 ${w * 100},${r * 100} L${w * 100},${h * 100} Z" fill="#${fills[i]}"/></svg>`, Math.round(w * 100), Math.round(h * 100)), x, y, w, h);
          t.oval(s, x + r - 0.3, y + 0.28, 0.6, 0.6, C.l6);
          t.img(s, await L.icon(it.icon, C.white, 2), x + r - 0.15, y + 0.43, 0.3, 0.3);
          head(s, it.h, x + 0.14, y + 0.94, w - 0.28, 0.5, { align: 'center', max: 15 });
          body(s, it.t, x + 0.14, y + 1.46, w - 0.28, h - 1.52, { align: 'center', max: 12.5, color: C.ink });
        }
      },
      async (d) => { // a well cut through the sheets, the title at its bottom, cards round its rim
        const s = bare(), n = d.items.length, cw = 3.2, ch = 1.9, cx = 5, cy = n === 3 ? 1.65 : 2.5;
        footer(s);
        rings(s, cx, cy, [[3.1, C.l3], [2.72, C.l4], [2.36, C.l5], [2.02, C.l6]]);
        t.text(s, d.title, { x: cx - 0.8, y: cy - 0.72, w: 1.6, h: 1.44, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 1.6, 1.4, 17, 11, F.head, true) });
        const spots = n === 3 ? [[0.4, 0.45, cw, ch], [6.4, 0.45, cw, ch], [1.9, 3.12, 6.2, 1.6]] : [[0.4, 0.42, cw, ch], [6.4, 0.42, cw, ch], [0.4, 2.76, cw, ch], [6.4, 2.76, cw, ch]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          paper(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.l5, 2), x + 0.2, y + 0.16, 0.32, 0.32);
          head(s, it.h, x + 0.62, y + 0.1, w - 0.8, 0.44, { max: 15 });
          body(s, it.t, x + 0.2, y + 0.58, w - 0.4, h - 0.68, { max: 12.5, color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // a ribbon rolls across, the numbers ride on it, the words hang below
        const s = page(d), n = d.steps.length, cw = 8.8 / n, ry = 1.1, rh = 1.2, waves = n === 3 ? 1.5 : 2;
        t.img(s, await ribbon(1000, 120, C.l4, 0.3, waves), 0, ry, W, rh);
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, cx = x + cw / 2 - 0.05, cy = ribbonY(cx, W, ry, rh, 0.3, waves);
          t.rect(s, cx - 0.33, cy - 0.33, 0.66, 0.66, C.l6, { r: 0.33, shadow: 0.2, blur: 8, offset: 2, shadowColor: '2A1E52', name: 'Disc' });
          t.text(s, String(i + 1), { x: cx - 0.33, y: cy - 0.33, w: 0.66, h: 0.66, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, x, 2.4, cw - 0.12, 0.52, { align: 'center', max: 15 });
          body(s, st.t, x, 2.94, cw - 0.12, 1.78, { align: 'center', max: 13, color: C.ink });
        });
      },
      async (d) => { // on the dark sheet a ribbon falls down the middle, the steps by turns to either side
        const s = night(d), n = d.steps.length, y0 = 1.15, h = 3.6 / n, rw = 0.9;
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="360"><path d="${Array.from({ length: 37 }, (_, k) => `${k ? 'L' : 'M'}${(45 + 24 * Math.sin((k / 36) * 3 * Math.PI)).toFixed(1)},${k * 10}`).join(' ')}" fill="none" stroke="#${C.l4}" stroke-width="10"/></svg>`, 90, 360), 5 - rw / 2, y0, rw, 3.6);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, cy = y + h / 2, left = i % 2 === 0, x = left ? 0.6 : 5.65, w = 3.75, cx = 5 + 0.24 * Math.sin(((cy - y0) / 3.6) * 3 * Math.PI);
          t.oval(s, cx - 0.26, cy - 0.26, 0.52, 0.52, C.l2);
          t.text(s, String(i + 1), { x: cx - 0.26, y: cy - 0.26, w: 0.52, h: 0.52, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.34, { color: C.l2, align: left ? 'right' : 'left', max: 15 });
          body(s, st.t, x, y + 0.37, w, h - 0.42, { color: C.white, align: left ? 'right' : 'left', max: 12.5 });
        });
      },
      async (d) => { // cut paper stairs rising out of the waves
        const s = page(d), n = d.steps.length, g = 0.04, w = (8.8 - g * (n - 1)) / n, rise = n === 3 ? 0.5 : 0.34, fills = [C.l2, C.l3, C.l4, C.l6], base = 4.76;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * (w + g), y = 1.14 + (n - 1 - i) * rise, f = fills[n === 3 && i === 2 ? 3 : i], fg = ON(f), h = base - y;
          t.rect(s, x, y, w, h, f, { shadow: 0.16, blur: 10, offset: 3, shadowColor: '2A1E52', name: 'Stair' });
          t.text(s, L.pad2(i + 1), { x: x + 0.16, y: y + 0.05, w: 1, h: 0.46, fontSize: 22, bold: true, color: fg, valign: 'middle' });
          head(s, st.h, x + 0.16, y + 0.5, w - 0.32, 0.5, { color: fg, max: 14, valign: 'top' });
          body(s, st.t, x + 0.16, y + 1.0, w - 0.32, h - 1.06, { color: fg, max: 12.5 });
        });
      },
    ],
    stats: [
      async (d) => { // the big number at the bottom of a well, two smaller on tabs beside it
        const s = page(d), [a, ...rest] = d.stats, cx = 2.75, cy = 2.95;
        rings(s, cx, cy, [[3.45, C.l2], [3.1, C.l3], [2.75, C.l5], [2.4, C.l6]]);
        t.text(s, a.value, { x: cx - 1.05, y: cy - 0.72, w: 2.1, h: 0.86, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 2.1, 0.8, 44, 22, F.head, true) });
        body(s, a.label, cx - 0.92, cy + 0.14, 1.84, 0.68, { color: C.white, align: 'center', max: 11 });
        rest.forEach((x, i) => {
          const y = 1.22 + i * 1.02;
          paper(s, 4.95, y, 4.45, 0.9);
          t.text(s, x.value, { x: 5.12, y, w: 1.85, h: 0.9, bold: true, color: C.l5, valign: 'middle', fontSize: L.fit(x.value, 1.85, 0.85, 28, 16, F.head, true) });
          body(s, x.label, 7.02, y + 0.03, 2.25, 0.84, { color: C.ink, max: 12, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 4.95, 3.28, 4.45, 1.4, { max: 11.5, valign: 'middle' });
      },
      async (d) => { // three layers of paper hills, a figure on each, the note on the last
        const s = bare(), w = 1600, h = 760;
        const hills = await L.svg(wavesSvg(w, h, [C.l2, C.l3, C.l6], 10), w, h);
        t.img(s, hills, 0, H - 4.75, W, 4.75);
        chip(s, 0.6, 0.15);
        t.text(s, d.title, { x: 1.4, y: 0.1, w: 8.0, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 26, 17, F.head, true) });
        const ys = [1.12, 2.22, 3.48];
        d.stats.forEach((x, i) => {
          const fg = i === 2 ? C.white : C.ink, y = ys[i];
          t.text(s, x.value, { x: 0.8 + i * 0.9, y, w: 3.0, h: 0.75, bold: true, color: fg, valign: 'middle', fontSize: L.fit(x.value, 3.0, 0.7, 38, 20, F.head, true) });
          body(s, x.label, 3.9 + i * 0.9, y + 0.03, 3.9, 0.7, { color: fg, max: 13, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 0.8, 4.22, 8.4, 0.98, { color: C.l1, max: 11.5, valign: 'middle' });
        footText(s);
      },
    ],
    compare: [
      async (d) => { // one sheet over another, joined on a wavy seam, lines mirror across it
        const s = page(d), y = 1.14, h = 3.62;
        t.rect(s, 0, y, W, h, C.l6, { name: 'Under sheet' });
        t.img(s, await wavySheet(C.white, 520, 362), 0, y, 5.2, h);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.6, w = 3.95, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.9) / n, fg = i ? C.white : C.ink;
          head(s, side.h, x, y + 0.14, w, 0.55, { color: i ? C.l2 : C.l5, align, max: 20 });
          side.items.forEach((it, k) => body(s, it, x, y + 0.76 + k * rh, w, rh - 0.05, { color: fg, align, max: 14, valign: 'middle' }));
        });
      },
      async (d) => { // two wide sheets, the second lying on the first and pushed aside
        const s = page(d), bh = 1.76;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.14 + i * (bh - 0.0), x = i ? 1.0 : 0.6, w = 8.4, f = i ? C.l5 : C.white, fg = ON(f), n = side.items.length, x0 = x + 2.05, cw = (x + w - 0.1 - x0) / n;
          paper(s, x, y, w, bh - 0.02, f);
          head(s, side.h, x + 0.2, y + 0.1, 1.72, bh - 0.22, { color: i ? C.l2 : C.l5, max: 19 });
          side.items.forEach((it, k) => {
            t.line(s, x0 + k * cw - 0.06, y + 0.24, 0, bh - 0.5, i ? C.l3 : C.l2, 1);
            body(s, it, x0 + k * cw + 0.04, y + 0.1, cw - 0.18, bh - 0.22, { color: fg, max: 13, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the sentence at the bottom of a deep cut
        const s = bare(), cx = 3.2, cy = 2.65;
        rings(s, cx, cy, [[5.9, C.l2], [5.3, C.l3], [4.75, C.l4], [4.25, C.l5], [3.85, C.l6]]);
        footer(s);
        t.text(s, L.runs(d.text), { x: cx - 1.55, y: cy - 1.3, w: 3.1, h: 2.6, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 3.1, 2.55, 24, 14, F.head, true) });
        chip(s, 6.5, 0.55);
        if (d.title) head(s, d.title, 6.5, 1.15, 2.95, 0.95, { max: 18, valign: 'top' });
        if (d.caption) body(s, d.caption, 6.5, 2.12, 2.95, 2.58, { max: 12.5, color: C.muted });
      },
      async (d) => { // hills fill the lower half, the sentence stands in the sky
        const s = bare();
        t.img(s, await L.svg(wavesSvg(1600, 900, [C.l3, C.l6], 460), 1600, 900), 0, 0, W, H);
        chip(s, 0.6, 0.4);
        if (d.title) t.text(s, d.title, { x: 1.4, y: 0.4, w: 8.0, h: 0.55, bold: true, color: C.l5, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.52, 16, 11, F.head, true) });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.0, w: 8.8, h: 1.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.8, 1.7, 34, 20, F.head, true) });
        if (d.caption) body(s, d.caption, 1.5, 4.1, 7.9, 1.1, { color: C.white, max: 12.5, valign: 'middle' });
        footText(s);
      },
    ],
    timeline: [
      async (d) => { // events to both sides of a paper ribbon
        const s = page(d), ry = 2.4, rh = 0.82, nodes = [1.3, 3.7, 6.1, 8.5];
        t.img(s, await ribbon(1000, 82, C.l4, 0.2, 2), 0, ry, W, rh);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, y = up ? 1.12 : ry + rh + 0.02, w = 4.2, cy = ribbonY(nodes[i], W, ry, rh, 0.2, 2);
          t.rect(s, nodes[i] - 0.14, cy - 0.14, 0.28, 0.28, C.l6, { r: 0.14, shadow: 0.2, blur: 6, offset: 2, shadowColor: '2A1E52', name: 'Disc' });
          t.text(s, it.year, { x, y, w: 1.35, h: 0.36, bold: true, color: C.l5, valign: 'middle', fontSize: L.fit(it.year, 1.35, 0.34, 20, 12, F.head, true) });
          head(s, it.h, x + 1.4, y, w - 1.4, 0.36, { max: 15 });
          body(s, it.t, x, y + 0.38, w, up ? 0.9 : 1.1, { max: 12.5, color: C.ink });
        });
      },
      async (d) => { // the dark sheet: a pale tab for each year
        const s = night(d), h = 0.8;
        d.items.forEach((it, i) => {
          const y = 1.17 + i * (h + 0.07);
          paper(s, 0.6, y + 0.08, 1.75, h - 0.16, C.l2);
          t.text(s, it.year, { x: 0.65, y: y + 0.08, w: 1.65, h: h - 0.16, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.55, h - 0.25, 22, 12, F.head, true) });
          head(s, it.h, 2.55, y, 2.4, h, { color: C.white, max: 16 });
          body(s, it.t, 5.0, y, 4.4, h, { color: C.l1, max: 12.5, valign: 'middle' });
        });
      },
      async (d) => { // discs of paper at two heights, the year cut in each
        const s = page(d), cw = 2.2, dia = 1.2;
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw, cx = x + cw / 2 - 0.08, top = 1.14 + (i % 2 ? 0.34 : 0);
          rings(s, cx, top + dia / 2, [[dia, C.l3], [dia - 0.2, i % 2 ? C.l5 : C.l6]]);
          t.text(s, it.year, { x: cx - dia / 2 + 0.12, y: top, w: dia - 0.24, h: dia, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, dia - 0.3, 0.7, 20, 11, F.head, true) });
          const y = top + dia + 0.05;
          head(s, it.h, x, y, cw - 0.16, 0.34, { align: 'center', max: 15 });
          body(s, it.t, x, y + 0.36, cw - 0.16, 4.74 - y - 0.36, { align: 'center', max: 12.5, color: C.ink });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: "SlideAI Qog'oz", colors: { dk1: C.ink, lt1: C.white, dk2: C.l6, lt2: C.l1, accent1: C.l5, accent2: C.l4, accent3: C.l3, accent4: C.l6, accent5: C.muted, accent6: C.l2, hlink: C.l5, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "yumshoq, do'stona va tushunarli", "limits": {}};
module.exports = { id: 28, slug: 'qogoz', name: "Qoğoz", category: 'creative', photos: true, build, style: STYLE };
