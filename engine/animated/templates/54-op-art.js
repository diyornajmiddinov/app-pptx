/**
 * 54 Op-art — optical art: hypnotic black-and-white concentric rings and wave stripes,
 * one signal red, crisp white reading panels with heavy black outlines.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { black: '0A0A0A', white: 'FFFFFF', red: 'FF2D3C', gray: '6B6B6B', paper: 'F6F6F4' };
const F = { head: 'Arial', body: 'Arial' };

const rings = (w, h, cx, cy, step) => { let r = ''; const max = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)); for (let k = Math.ceil(max / step); k > 0; k--) r += `<circle cx="${cx}" cy="${cy}" r="${k * step}" fill="#${k % 2 ? C.black : C.white}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${r}</svg>`; };
const waves = (w, h, n, amp, vertical) => { let p = ''; const band = (vertical ? w : h) / n;
  for (let k = 0; k < n; k += 2) { let d = ''; const len = vertical ? h : w; for (let u = 0; u <= len; u += 10) { const off = Math.sin(u / 60) * amp * (1 + 0.5 * Math.sin(k / 3)); const a = k * band + off, b = (k + 1) * band + off; d += vertical ? `${u === 0 ? 'M' : 'L'}${a.toFixed(1)},${u}` : `${u === 0 ? 'M' : 'L'}${u},${a.toFixed(1)}`; }
    for (let u = len; u >= 0; u -= 10) { const off = Math.sin(u / 60) * amp * (1 + 0.5 * Math.sin(k / 3)); const b = (k + 1) * band + off; d += vertical ? `L${b.toFixed(1)},${u}` : `L${u},${b.toFixed(1)}`; } p += `<path d="${d}Z" fill="#${C.black}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${p}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const band = await L.svg(waves(90, 900, 9, 10, true), 90, 900), full = await L.svg(waves(1600, 900, 40, 18, false), 1600, 900, true);
  const memo = {}; const target = async (d) => (memo['t' + d] ??= await L.svg(rings(200, 200, 100, 100, 100 / 6), 200, 200));
  const panel = (s, x, y, w, h, fill = C.white) => t.rect(s, x, y, w, h, fill, { line: { color: C.black, width: 2.5 }, name: 'Panel' });
  const footer = (s, inv) => t.text(s, `${M.topic || ''}   /   ${meta}`, { x: 0.9, y: 5.25, w: 8.5, h: 0.22, fontSize: 8, bold: true, color: inv ? C.white : C.gray });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.img(s, band, 0, 0, 0.56, H);
    t.text(s, L.pad2(idx), { x: 8.6, y: 0.35, w: 0.85, h: 0.6, fontSize: 22, bold: true, color: C.red, align: 'right', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.9, y: 0.35, w: 7.6, h: 0.7, bold: true, color: C.black, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.7, 30, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.black, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h) => { panel(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, C.black); t.img(s, await L.photo(L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.white }; idx++;
    t.img(s, await L.svg(rings(900, 900, 450, 450, 30), 900, 900), 5.0, 0, 5.625, H);
    if (d.image) { t.oval(s, 6.21, 1.21, 3.2, 3.2, C.white, { line: { color: C.black, width: 3 } }); t.img(s, await L.photo(L.src(d.image), 3.0, 3.0, { mask: 'circle', gray: true }), 6.31, 1.31, 3.0, 3.0, { alt: '' }); }
    t.rect(s, 0, 0, 5.0, H, C.white, { name: 'Text side' }); t.line(s, 5.0, 0, 0, H, C.black, 3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' / ').toUpperCase(), { x: 0.6, y: 0.6, w: 4.1, h: 0.3, fontSize: 11, bold: true, color: C.red, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.1, h: 2.4, bold: true, fontSize: L.fit(d.title, 4.1, 2.3, 40, 20, F.head, true), color: C.black, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.55, w: 4.1, h: 0.85, fontSize: 13, color: C.gray });
    t.rect(s, 0.6, 4.5, 4.1, 0.5, C.black, { name: 'Author bar' });
    t.text(s, M.author || '', { x: 0.75, y: 4.5, w: 3.9, h: 0.5, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
    t.text(s, `${M.topic || ''}`, { x: 0.6, y: 5.2, w: 4.1, h: 0.25, fontSize: 8, bold: true, color: C.gray });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 1.0, 1.45, 3.7, 3.45); para(s, d.text, 5.0, 1.35, 4.45, 3.65); },
    async image(d) { const s = page(d); para(s, d.text, 0.9, 1.35, 4.4, 3.65); await photo(s, d.image, 5.65, 1.45, 3.75, 3.45); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.15, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.95 + Math.floor(i / per) * 4.3, y = 1.4 + (i % per) * rh;
        t.img(s, await target(), x, y, 0.62, 0.62);
        t.oval(s, x + 0.16, y + 0.16, 0.3, 0.3, C.white);
        t.text(s, String(i + 1), { x: x + 0.16, y: y + 0.16, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: C.red, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.8, y, w: 3.3, h: 0.62, fontSize: 16, bold: true, color: C.black, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.22, w = (8.55 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.9 + i * (w + gap);
        panel(s, x, 1.4, w, 3.6);
        t.img(s, await L.svg(waves(Math.round(w * 100), 50, 6, 4, false), w * 100, 50), x, 1.4, w, 0.5);
        t.rect(s, x, 1.4, w, 0.5, null, { line: { color: C.black, width: 2.5 }, name: 'Band' });
        t.text(s, it.h, { x: x + 0.2, y: 2.0, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 17, 12, F.head, true), bold: true, color: i % 2 ? C.red : C.black, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.65, w: w - 0.4, h: 2.2, fontSize: 14, color: C.black });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.55 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.9 + i * cw;
        t.img(s, await target(), x, 1.35, 0.95, 0.95);
        t.oval(s, x + 0.25, 1.6, 0.45, 0.45, i === n - 1 ? C.red : C.white, { line: { color: C.black, width: 1.5 } });
        t.text(s, String(i + 1), { x: x + 0.25, y: 1.6, w: 0.45, h: 0.45, fontSize: 15, bold: true, color: i === n - 1 ? C.white : C.black, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.45, w: cw - 0.25, h: 0.55, fontSize: L.fit(st.h, cw - 0.25, 0.55, 17, 12, F.head, true), bold: true, color: C.black, valign: 'middle' });
        t.text(s, st.t, { x, y: 3.05, w: cw - 0.25, h: 1.95, fontSize: 14, color: C.gray });
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (8.55 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.9 + i * (w + gap), inv = i === 1;
        panel(s, px, 1.4, w, 2.85, inv ? C.black : C.white);
        t.text(s, x.value, { x: px + 0.2, y: 1.55, w: w - 0.4, h: 1.25, fontSize: L.fit(x.value, w - 0.4, 1.15, 54, 24, F.head, true), bold: true, color: inv ? C.white : i === 0 ? C.red : C.black, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 2.85, w: w - 0.4, h: 1.25, fontSize: 13, color: inv ? 'DDDDDD' : C.gray, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.9, y: 4.4, w: 8.55, h: 0.7, fontSize: 11, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.7, F.body, 0.2, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.9 + i * (w + 0.25), inv = i === 1, fg = inv ? C.white : C.black;
        panel(s, x, 1.4, w, 3.6, inv ? C.black : C.white);
        t.text(s, side.h, { x: x + 0.3, y: 1.55, w: w - 0.6, h: 0.55, fontSize: 19, bold: true, color: inv ? C.white : C.red, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.rect(s, x + 0.3, y + 0.08, 0.14, 0.14, inv ? C.white : C.black, { name: 'Bullet' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[k], fontSize: fs, color: fg }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = pres.addSlide(); s.background = { data: full }; idx++;
      panel(s, 1.0, 1.0, 8.0, 3.5);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.2, w: 7.2, h: 1.9, bold: true, fontSize: L.fit(d.text, 7.2, 1.8, 34, 18, F.head, true), color: C.black, align: 'center', valign: 'middle' });
      t.rect(s, 4.6, 3.15, 0.8, 0.08, C.red, { name: 'Accent' });
      if (d.caption) t.text(s, d.caption, { x: 1.4, y: 3.3, w: 7.2, h: 1.05, fontSize: 13, color: C.gray, align: 'center' });
      t.rect(s, 0, 5.2, W, 0.425, C.black, { name: 'Strip' }); footer(s, true);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.55 / n;
      t.line(s, 0.9, 2.05, 8.55, 0, C.black, 3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.9 + i * cw;
        t.img(s, await target(), x, 1.75, 0.6, 0.6);
        t.text(s, it.year, { x: x + 0.7, y: 1.3, w: cw - 0.8, h: 0.5, fontSize: L.fit(it.year, cw - 0.85, 0.45, 22, 11, F.head, true), bold: true, color: i % 2 ? C.red : C.black, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.55, w: cw - 0.25, h: 0.5, fontSize: 16, bold: true, color: C.black });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.25, h: 1.95, fontSize: 14, color: C.gray });
      }
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: full }; idx++;
      panel(s, 1.0, 1.0, 8.0, 3.5, C.black);
      t.text(s, d.text, { x: 1.4, y: 1.2, w: 7.2, h: 2.4, bold: true, fontSize: L.fit(d.text, 7.2, 2.3, 30, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author.toUpperCase(), { x: 1.4, y: 3.75, w: 7.2, h: 0.4, fontSize: 12, bold: true, color: C.red, align: 'center', charSpacing: 2 });
      t.rect(s, 0, 5.2, W, 0.425, C.black, { name: 'Strip' }); footer(s, true);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.rect(s, 0.9, y + (rh - 0.3) / 2, 0.3, 0.3, i % 2 ? C.red : C.black, { name: 'Num' });
        t.text(s, String(i + 1), { x: 0.9, y: y + (rh - 0.3) / 2, w: 0.3, h: 0.3, fontSize: 10, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.4, y, w: 8.0, h: rh, fontSize: 14, color: C.black, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, always black against white: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || '3A3A3A', align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 11, F.head, true), color: o.color || C.black, align: o.align, valign: o.valign || 'middle' });
  const invPage = (d) => { // the page turned to black
    const s = pres.addSlide(); s.background = { color: C.black }; idx++;
    t.img(s, band, 0, 0, 0.56, H);
    t.text(s, L.pad2(idx), { x: 8.6, y: 0.35, w: 0.85, h: 0.6, fontSize: 22, bold: true, color: C.red, align: 'right', valign: 'middle' });
    t.text(s, d.title, { x: 0.9, y: 0.35, w: 7.6, h: 0.7, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.7, 30, 16, F.head, true) });
    footer(s, true);
    return s;
  };
  const strip = async (x, w, h, n = 8, amp = 6) => (memo[`wv${w}${h}${n}`] ??= await L.svg(waves(Math.round(w * 100), Math.round(h * 100), n, amp, false), w * 100, h * 100));
  const bigRings = async () => (memo.big ??= await L.svg(rings(900, 900, 450, 450, 36), 900, 900));
  const SLATS = { path: Array.from({ length: 15 }, (_, k) => { const a = (k * 2) / 29, b = (k * 2 + 1) / 29; return `M${a},0 L${b},0 L${b},1 L${a},1 Z`; }).join(' ') };
  const iconTarget = async (s, x, y, d, name, red) => {
    t.img(s, await target(), x, y, d, d);
    t.oval(s, x + d * 0.2, y + d * 0.2, d * 0.6, d * 0.6, red ? C.red : C.white, { line: { color: C.black, width: 1.25 } });
    t.img(s, await L.icon(name, C.black, 2.25), x + d * 0.32, y + d * 0.32, d * 0.36, d * 0.36);
  };
  const V = {
    image: [
      async (d) => { // a long grey plate, a wave ribbon running under it
        const s = page(d);
        await photo(s, d.image, 0.96, 1.26, 8.43, 1.9);
        t.img(s, await strip(0, 8.55, 0.2, 4, 2), 0.9, 3.24, 8.55, 0.2);
        t.text(s, d.text, { x: 0.9, y: 3.54, w: 8.55, h: 1.62, fontSize: L.fit(d.text, 8.55, 1.62, 14, 10, F.body, false, 1.2), color: C.black, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // black page: picture in the bull's eye of great rings
        const s = invPage(d), dd = 3.82, x = 5.62, y = 1.26, c = 2.5;
        t.img(s, await bigRings(), x, y, dd, dd);
        t.oval(s, x + (dd - c) / 2 - 0.05, y + (dd - c) / 2 - 0.05, c + 0.1, c + 0.1, C.white);
        t.img(s, await L.photo(L.src(d.image), c, c, { mask: 'circle', gray: true }), x + (dd - c) / 2, y + (dd - c) / 2, c, c, { alt: '' });
        t.text(s, d.text, { x: 0.9, y: 1.3, w: 4.45, h: 3.78, fontSize: L.fit(d.text, 4.45, 3.78, 15, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // a grey picture fills the page, one heavy white panel lies on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { gray: true }), 0, 0, W, H, { alt: '' });
        panel(s, 0.45, 0.4, 5.3, 4.5);
        t.text(s, L.pad2(idx), { x: 0.65, y: 0.5, w: 0.8, h: 0.62, fontSize: 22, bold: true, color: C.red, valign: 'middle' });
        t.text(s, d.title, { x: 1.42, y: 0.5, w: 4.15, h: 0.72, bold: true, color: C.black, valign: 'middle', fontSize: L.fit(d.title, 4.15, 0.7, 20, 13, F.head, true) });
        t.text(s, d.text, { x: 0.7, y: 1.3, w: 4.8, h: 3.48, fontSize: L.fit(d.text, 4.8, 3.48, 15, 10, F.body, false, 1.2), color: C.black, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.2, W, H - 5.2, C.black, { name: 'Strip' }); footer(s, true);
      },
      async (d) => { // the picture seen through black slats: it flickers like a Riley
        const s = page(d), x = 0.9, y = 1.26, w = 4.7, h = 3.86;
        t.rect(s, x, y, w, h, C.black, { name: 'Slats ground' });
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: SLATS, gray: true }), x, y, w, h, { alt: '' });
        t.text(s, d.text, { x: 5.85, y: 1.3, w: 3.6, h: 3.78, fontSize: L.fit(d.text, 3.6, 3.78, 14, 10, F.body, false, 1.2), color: C.black, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a column of targets, an icon in the eye of each, heavy rules between
        const s = page(d), n = d.items.length, h = 3.84 / n, dd = Math.min(0.86, h - 0.08);
        for (const [i, it] of d.items.entries()) {
          const y = 1.28 + i * h;
          await iconTarget(s, 0.9, y + (h - dd) / 2, dd, it.icon, i === 0);
          head(s, it.h, 1.95, y + 0.03, 2.55, h - 0.06, { max: 16 });
          body(s, it.t, 4.6, y + 0.04, 4.85, h - 0.08, { valign: 'middle' });
          if (i < n - 1) t.line(s, 1.95, y + h, 7.5, 0, C.black, 2);
        }
      },
      async (d) => { // black page: white-edged cells two by two
        const s = invPage(d), n = d.items.length, w = 4.17, h = 1.82;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.55 : w, x = 0.9 + (i % 2) * (w + 0.21), y = 1.3 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, null, { line: { color: C.white, width: 2 }, name: 'Cell' });
          t.rect(s, x + 0.16, y + 0.16, 0.5, 0.5, i % 2 ? C.white : C.red, { name: 'Icon block' });
          t.img(s, await L.icon(it.icon, C.black, 2.25), x + 0.27, y + 0.27, 0.28, 0.28);
          head(s, it.h, x + 0.8, y + 0.14, ww - 0.96, 0.54, { color: C.white, max: 15 });
          body(s, it.t, x + 0.16, y + 0.78, ww - 0.32, h - 0.88, { color: 'E2E2E2' });
        }
      },
      async (d) => { // a chequer on the move: black and white tiles at two heights
        const s = page(d), n = d.items.length, gap = 0.1, w = (8.55 - gap * (n - 1)) / n, h = 3.3;
        for (const [i, it] of d.items.entries()) {
          const x = 0.9 + i * (w + gap), y = 1.3 + (i % 2 ? 0.52 : 0), dark = i % 2 === 0;
          panel(s, x, y, w, h, dark ? C.black : C.white);
          t.img(s, await L.icon(it.icon, dark ? C.white : C.black, 2.25), x + 0.18, y + 0.18, 0.36, 0.36);
          head(s, it.h, x + 0.18, y + 0.62, w - 0.36, 0.56, { color: dark ? C.white : C.red, max: 15 });
          body(s, it.t, x + 0.18, y + 1.22, w - 0.36, h - 1.32, { color: dark ? 'E2E2E2' : C.black });
        }
      },
      async (d) => { // the great eye in the middle, panels pressed against it at the corners
        const s = page(d), n = d.items.length, dd = 3.2, cx = 5.18, cy = 3.2, w = 3.4, h = 1.8;
        t.img(s, await bigRings(), cx - dd / 2, cy - dd / 2, dd, dd);
        t.oval(s, cx - 0.32, cy - 0.32, 0.64, 0.64, C.red, { line: { color: C.black, width: 2.5 } });
        const spots = n === 3 ? [[0.9, 1.32], [0.9, 3.3], [6.05, 2.31]] : [[0.9, 1.32], [6.05, 1.32], [0.9, 3.3], [6.05, 3.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i];
          panel(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.black, 2.25), x + 0.14, y + 0.12, 0.3, 0.3);
          head(s, it.h, x + 0.52, y + 0.06, w - 0.64, 0.42, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.6, { color: C.black });
        }
      },
    ],
    process: [
      async (d) => { // staircase: each panel higher, a wave pillar carrying it
        const s = page(d), n = d.steps.length, w = 8.55 / n, low = 3.28, high = 1.28, h = 1.86;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.9 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.1;
          if (y + h < 5.05) t.img(s, band, x + tw / 2 - 0.22, y + h, 0.44, 5.14 - y - h);
          panel(s, x, y, tw, h, i === n - 1 ? C.black : C.white);
          const dark = i === n - 1;
          t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.06, w: 0.5, h: 0.48, bold: true, fontSize: 24, color: C.red, valign: 'middle' });
          head(s, st.h, x + 0.56, y + 0.06, tw - 0.66, 0.48, { max: 13, color: dark ? C.white : C.black });
          body(s, st.t, x + 0.12, y + 0.58, tw - 0.24, h - 0.66, { color: dark ? 'E2E2E2' : C.black });
        }
      },
      async (d) => { // a wavering column down the page, steps pulled out to its sides
        const s = page(d), n = d.steps.length, gap = n === 4 ? 0.93 : 1.26, h = n === 4 ? 1.1 : 1.2, w = 3.72, cx = 5.18;
        t.img(s, band, cx - 0.22, 1.24, 0.44, 3.92);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.3 + i * gap, x = right ? cx + 0.52 : cx - 0.52 - w, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.3, y + 0.04, 0.6, 0.6, i === n - 1 ? C.red : C.white, { line: { color: C.black, width: 2.5 } });
          t.text(s, String(i + 1), { x: cx - 0.3, y: y + 0.04, w: 0.6, h: 0.6, bold: true, fontSize: 18, color: C.black, align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.36, { align: a, max: 15 });
          body(s, st.t, x, y + 0.38, w, h - 0.42, { align: a });
        }
      },
      async (d) => { // black page: arrows in white and red drive across the top
        const s = invPage(d), n = d.steps.length, cw = 8.55 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.9 + i * cw;
          t.shape(s, 'PENTAGON', { x, y: 1.32, w: cw - 0.04, h: 1.02, fill: { color: i % 2 ? C.red : C.white }, objectName: 'Arrow' });
          t.text(s, String(i + 1), { x: x + 0.1, y: 1.32, w: 0.44, h: 1.02, bold: true, fontSize: 22, color: C.black, valign: 'middle' });
          head(s, st.h, x + 0.52, 1.36, cw - 0.98, 0.94, { max: 13 });
          body(s, st.t, x + 0.08, 2.5, cw - 0.28, 2.62, { color: C.white, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // one number in the eye of the rings, two more ranged beside them
        const s = page(d), [a, ...rest] = d.stats, dd = 3.82, x = 0.9, y = 1.28, c = 2.5;
        t.img(s, await bigRings(), x, y, dd, dd);
        t.oval(s, x + (dd - c) / 2, y + (dd - c) / 2, c, c, C.white, { line: { color: C.black, width: 2.5 } });
        t.text(s, a.value, { x: x + (dd - c) / 2 + 0.2, y: y + (dd - c) / 2 + 0.28, w: c - 0.4, h: 0.82, bold: true, color: C.red, align: 'center', valign: 'middle', fontSize: L.fit(a.value, c - 0.5, 0.78, 44, 18, F.head, true) });
        body(s, a.label, x + (dd - c) / 2 + 0.3, y + (dd - c) / 2 + 1.12, c - 0.6, 0.95, { align: 'center', max: 12, color: C.black });
        for (const [i, v] of rest.entries()) {
          const yy = 1.3 + i * 1.14;
          t.text(s, v.value, { x: 5.0, y: yy, w: 4.45, h: 0.62, bold: true, color: C.black, valign: 'middle', fontSize: L.fit(v.value, 4.4, 0.58, 36, 18, F.head, true) });
          body(s, v.label, 5.0, yy + 0.62, 4.45, 0.42, { max: 12 });
          t.rect(s, 5.0, yy + 1.06, 4.45, 0.05, C.black, { name: 'Rule' });
        }
        if (d.note) body(s, d.note, 5.0, 3.62, 4.45, 1.5, { max: 12, valign: 'middle', color: C.gray });
      },
      async (d) => { // black page: three lines ruled in white, the first number red
        const s = invPage(d), h = 0.92;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.3 + i * h;
          t.text(s, v.value, { x: 0.9, y, w: 3.6, h: h - 0.08, bold: true, color: i ? C.white : C.red, valign: 'middle', fontSize: L.fit(v.value, 3.55, h - 0.12, 46, 20, F.head, true) });
          body(s, v.label, 4.65, y, 4.8, h - 0.08, { color: 'E2E2E2', max: 15, valign: 'middle' });
          t.rect(s, 0.9, y + h - 0.06, 8.55, 0.03, C.white, { name: 'Rule' });
        }
        if (d.note) body(s, d.note, 0.9, 4.14, 8.55, 1.0, { color: 'E2E2E2', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the page split white and black, the words mirrored about the seam
        const s = page(d), w = 3.75, cx = 5.18;
        t.rect(s, cx, 1.2, W - cx, 3.96, C.black, { name: 'Black half' });
        t.rect(s, 0.56, 1.2, cx - 0.56, 3.96, C.white, { name: 'White half' });
        t.oval(s, cx - 0.2, 1.42, 0.4, 0.4, C.red, { line: { color: C.white, width: 2 } });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 3.0);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.32 : cx - 0.32 - w, a = i ? 'left' : 'right';
          head(s, side.h, x, 1.3, w, 0.62, { align: a, max: 19, color: i ? C.white : C.black });
          let y = 2.04;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: i ? C.white : C.black, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // white band over black band, a red tag naming each
        const s = page(d), h = 1.84;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.1), dark = i === 1, rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          panel(s, 0.9, y, 8.55, h, dark ? C.black : C.white);
          t.rect(s, 0.9, y + 0.3, 2.4, h - 0.6, C.red, { name: 'Tag' });
          head(s, side.h, 1.0, y + 0.34, 2.2, h - 0.68, { max: 16 });
          side.items.forEach((it, j) => body(s, it, 3.48 + (j % 2) * 3.0, y + 0.1 + Math.floor(j / 2) * rh, 2.85, rh - 0.05, { color: dark ? C.white : C.black, max: 13, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // black page: words flush left, the rings looming on the right
        const s = invPage(d), dd = 4.0;
        t.img(s, await bigRings(), W - dd + 0.8, 1.14, dd, dd);
        t.text(s, L.runs(d.text), { x: 0.9, y: 1.28, w: 5.15, h: 2.4, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.15, 2.35, 30, 15, F.head, true) });
        t.rect(s, 0.9, 3.76, 0.8, 0.08, C.red, { name: 'Accent' });
        if (d.caption) body(s, d.caption, 0.9, 3.92, 5.15, 1.22, { color: 'E2E2E2' });
      },
      async (d) => { // on white: the words at full width, the waves rolling in underneath
        const s = page(d);
        t.text(s, L.runs(d.text), { x: 0.9, y: 1.24, w: 8.55, h: 1.84, bold: true, color: C.black, valign: 'middle', fontSize: L.fit(d.text, 8.55, 1.8, 34, 17, F.head, true) });
        t.rect(s, 0.9, 3.14, 0.8, 0.08, C.red, { name: 'Accent' });
        if (d.caption) body(s, d.caption, 0.9, 3.28, 8.55, 0.86, { max: 13 });
        t.img(s, await strip(0, 8.55, 0.94, 10, 7), 0.9, 4.2, 8.55, 0.94);
        t.rect(s, 0.9, 4.2, 8.55, 0.94, null, { line: { color: C.black, width: 2.5 }, name: 'Band' });
      },
    ],
    timeline: [
      async (d) => { // one thick line, targets on it, years above and below in turn
        const s = page(d), axis = 3.22, w = 3.6;
        t.rect(s, 0.56, axis - 0.03, W - 0.56, 0.06, C.black, { name: 'Line' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.9 + (i / 2) * 4.35 : 2.0 + ((i - 1) / 2) * 4.35, top = up ? 1.26 : 3.56;
          t.img(s, await target(), x, axis - 0.24, 0.48, 0.48);
          t.text(s, it.year, { x, y: top, w: 1.6, h: 0.42, bold: true, color: up ? C.black : C.red, valign: 'middle', fontSize: L.fit(it.year, 1.55, 0.4, 20, 11, F.head, true) });
          head(s, it.h, x + 1.65, top, w - 1.65, 0.42, { max: 13 });
          body(s, it.t, x, top + 0.44, w, up ? 1.22 : 1.14, {});
        }
      },
      async (d) => { // black page: white bars stepping to the right, a year cut into each
        const s = invPage(d), h = 0.86;
        for (const [i, it] of d.items.entries()) {
          const x = 0.9 + i * 0.28, y = 1.3 + i * 0.96, w = 7.71;
          t.rect(s, x, y, w, h, C.white, { name: 'Bar' });
          t.rect(s, x, y, 1.66, h, i === 3 ? C.red : '2A2A2A', { line: { color: C.white, width: 2 }, name: 'Year block' });
          t.text(s, it.year, { x: x + 0.06, y, w: 1.54, h, bold: true, color: i === 3 ? C.black : C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.48, 0.6, 20, 10, F.head, true) });
          head(s, it.h, x + 1.78, y + 0.05, 1.72, h - 0.1, { max: 13 });
          body(s, it.t, x + 3.56, y + 0.05, w - 3.68, h - 0.1, { max: 12, color: C.black, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Op-art', colors: { dk1: C.black, lt1: C.white, dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.black, accent3: C.gray, accent4: 'BDBDBD', accent5: '8A8A8A', accent6: 'E0E0E0', hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "keskin va aniq: qora-oq mantiq, qarama-qarshiliklar ochiq ko'rsatilgan, ixcham", limits: {}, prefer: null };
module.exports = { id: 54, slug: 'op-art', name: 'Op-art', category: 'minimalist', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "technical"], "transitions": ["wheel", "circle", "cut"], "cover": ["wheel", "zoomIn"], "mark": "wheel", "deco": "circle", "sig": {"title": "zoomIn", "body": "fade", "item": "circle", "image": "wheel", "number": "wheel", "order": "centerOut", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
