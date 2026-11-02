/**
 * 65 Vinil — vinyl records: grooved black discs with coloured centre labels, album sleeves,
 * a tracklist agenda (A1, A2…), Side A / Side B comparison, liner notes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F1EBE1', ink: '1E1B18', muted: '6B635A', black: '141414', sleeve: 'FFFFFF', labels: ['E4572E', '17BEBB', 'FFC914', '76B041', '9C6ADE', 'F78FB3'] };
const F = { head: 'Arial', body: 'Calibri' };

const discSvg = (label) => { let g = ''; for (let r = 190; r > 78; r -= 6) g += `<circle cx="200" cy="200" r="${r}" fill="none" stroke="#2A2A2A" stroke-width="${r % 18 === 0 ? 2 : 1}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="198" fill="#${C.black}"/>${g}
  <path d="M120,70 A160,160 0 0 1 300,90" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="22"/><circle cx="200" cy="200" r="74" fill="#${label}"/><circle cx="200" cy="200" r="8" fill="#${C.bg}"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const disc = async (s, x, y, d, k, txt, fs) => {
    t.img(s, (memo['d' + k] ??= await L.svg(discSvg(C.labels[k % 6]), 400, 400)), x, y, d, d);
    if (txt !== undefined) t.text(s, String(txt), { x: x + d * 0.32, y: y + d * 0.32, w: d * 0.36, h: d * 0.36, fontSize: fs || Math.round(d * 13), bold: true, color: C.ink, align: 'center', valign: 'middle' });
  };
  const sleeve = (s, x, y, w, h, fill = C.sleeve) => t.rect(s, x, y, w, h, fill, { shadow: 0.25, blur: 8, offset: 3, name: 'Sleeve' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u266B   ${meta}`, { x: 0.5, y: 5.25, w: 9.0, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await disc(s, 0.45, 0.33, 0.78, idx, idx, 10);
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.75, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const album = async (s, src, x, y, d, k) => { await disc(s, x + d * 0.42, y + d * 0.04, d * 0.92, k); sleeve(s, x, y, d, d); t.img(s, await L.photo(L.src(src), d - 0.16, d - 0.16), x + 0.08, y + 0.08, d - 0.16, d - 0.16, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await album(s, d.image, 5.1, 0.7, 3.4, 0); else await disc(s, 5.6, 0.7, 3.6, 0);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.labels[0], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.3, h: 2.4, bold: true, fontSize: L.fit(d.title, 4.3, 2.3, 40, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 4.2, h: 0.8, fontSize: 13, color: C.muted });
    t.text(s, [{ text: '\u25B6  ', options: { color: C.labels[0] } }, { text: M.author || '', options: { color: C.ink } }], { x: 0.6, y: 4.4, w: 4.3, h: 0.45, fontSize: 16, bold: true });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await album(s, d.image, 0.55, 1.5, 3.3, 1); para(s, d.text, 5.15, 1.35, 4.3, 3.7); },
    async image(d) { const s = await page(d); para(s, d.text, 0.5, 1.35, 4.2, 3.7); await album(s, d.image, 5.0, 1.5, 3.3, 2); },
    async agenda(d) {
      const s = await page(d), n = d.items.length; sleeve(s, 0.5, 1.35, 9.0, 3.75);
      const rh = Math.min(0.58, 3.45 / n), half = Math.ceil(n / 2);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh, side = i < half ? 'A' : 'B', no = i < half ? i + 1 : i - half + 1;
        t.text(s, `${side}${no}`, { x: 0.75, y, w: 0.7, h: rh, fontSize: 15, bold: true, color: C.labels[i % 6], valign: 'middle' });
        t.text(s, it, { x: 1.5, y, w: 7.0, h: rh, fontSize: 16, color: C.ink, valign: 'middle' });
        t.text(s, '\u266A', { x: 8.75, y, w: 0.5, h: rh, fontSize: 16, color: C.muted, valign: 'middle' });
        if (i < n - 1) t.line(s, 0.75, y + rh, 8.5, 0, 'E6DFD3', 0.75);
      });
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.22, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        sleeve(s, x, 1.35, w, 3.75);
        t.rect(s, x, 1.35, w, 0.95, C.labels[i % 6], { name: 'Cover art' });
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, 1.55, 0.5, 0.5);
        t.text(s, it.h, { x: x + 0.2, y: 2.4, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 17, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 3.0, w: w - 0.4, h: 2.0, fontSize: 13, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 9.0 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.5 + i * cw;
        await disc(s, x + (cw - 1.1) / 2, 1.3, 1.1, i, i + 1, 13);
        t.text(s, st.h, { x: x + 0.05, y: 2.5, w: cw - 0.2, h: 0.55, fontSize: L.fit(st.h, cw - 0.2, 0.55, 16, 11, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, st.t, { x: x + 0.05, y: 3.05, w: cw - 0.2, h: 2.0, fontSize: 13, color: C.muted, align: 'center' });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 9.0 / n, dd = Math.min(2.2, cw - 0.4);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.5 + i * cw + cw / 2;
        await disc(s, cx - dd / 2, 1.3, dd, i * 2);
        t.text(s, x.value, { x: cx - dd * 0.18, y: 1.3 + dd * 0.33, w: dd * 0.36, h: dd * 0.34, fontSize: L.fit(x.value, dd * 0.36, dd * 0.3, 26, 9, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.45 + dd, w: cw - 0.3, h: 0.95, fontSize: 13, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.6, w: 9.0, h: 0.55, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 4.95 - 2.2);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4), k = i ? 1 : 0;
        sleeve(s, x, 1.35, w, 3.75);
        t.oval(s, x + 0.2, 1.5, 0.55, 0.55, C.labels[k]);
        t.text(s, i ? 'B' : 'A', { x: x + 0.2, y: 1.5, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, side.h, { x: x + 0.9, y: 1.5, w: w - 1.1, h: 0.55, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, j) => { t.text(s, '\u266A', { x: x + 0.25, y, w: 0.3, h: 0.3, fontSize: 13, color: C.labels[k] }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[j], fontSize: fs, color: C.ink }); y += rows[j]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await disc(s, 6.6, 1.25, 3.0, 4);
      sleeve(s, 0.6, 1.3, 6.5, 3.0, C.labels[4]);
      t.text(s, L.runs(d.text), { x: 0.9, y: 1.4, w: 5.9, h: 2.8, bold: true, fontSize: L.fit(d.text, 5.9, 2.7, 34, 16, F.head, true), color: 'FFFFFF', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.4, w: 8.9, h: 0.75, fontSize: 12, color: C.muted });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 9.0 / n;
      const wave = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="60">${Array.from({ length: 150 }, (_, k) => { const h = 6 + Math.abs(Math.sin(k * 0.45) * 22 + Math.sin(k * 0.13) * 12); return `<rect x="${k * 6}" y="${30 - h / 2}" width="3" height="${h}" fill="#${C.ink}" opacity="0.55"/>`; }).join('')}</svg>`;
      t.img(s, await L.svg(wave, 900, 60), 0.5, 1.85, 9.0, 0.6);
      d.items.forEach((it, i) => {
        const x = 0.5 + i * cw;
        t.oval(s, x, 1.95, 0.4, 0.4, C.labels[i % 6]);
        t.text(s, it.year, { x, y: 1.3, w: cw - 0.2, h: 0.5, fontSize: L.fit(it.year, cw - 0.3, 0.45, 22, 11, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.25, h: 0.5, fontSize: 15, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.25, h: 1.95, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await disc(s, 0.5, 1.0, 3.2, 5, '\u201C', 40);
      t.text(s, d.text, { x: 4.1, y: 1.0, w: 5.4, h: 2.7, italic: true, bold: true, fontSize: L.fit(d.text, 5.4, 2.6, 30, 15, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 4.1, y: 3.85, w: 5.4, h: 0.45, fontSize: 15, bold: true, color: C.labels[0] });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length; sleeve(s, 0.5, 1.35, 9.0, 3.75);
      const rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.48 + i * rh;
        t.oval(s, 0.7, y + (rh - 0.3) / 2, 0.3, 0.3, C.labels[i % 6]);
        t.text(s, it, { x: 1.15, y, w: 8.2, h: rh, fontSize: 13, color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Vinil', colors: { dk1: C.ink, lt1: C.sleeve, dk2: C.black, lt2: C.bg, accent1: C.labels[0], accent2: C.labels[1], accent3: C.labels[2], accent4: C.labels[3], accent5: C.labels[4], accent6: C.labels[5], hlink: C.labels[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ritmik va ilhomli: har bir qism 'trek' kabi tugal, qisqa sarlavhalar va ravon matn", limits: {}, prefer: 'visual' };
module.exports = { id: 65, slug: 'vinil', name: 'Vinil', category: 'creative', photos: true, build, style: STYLE };
