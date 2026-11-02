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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Op-art', colors: { dk1: C.black, lt1: C.white, dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.black, accent3: C.gray, accent4: 'BDBDBD', accent5: '8A8A8A', accent6: 'E0E0E0', hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "keskin va aniq: qora-oq mantiq, qarama-qarshiliklar ochiq ko'rsatilgan, ixcham", limits: {}, prefer: null };
module.exports = { id: 54, slug: 'op-art', name: 'Op-art', category: 'minimalist', photos: true, build, style: STYLE };
