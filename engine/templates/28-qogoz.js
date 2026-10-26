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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.85, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fill = i ? C.l5 : C.white, fg = i ? C.white : C.ink;
        paper(s, x, 1.3, w, 3.35, fill);
        t.text(s, side.h, { x: x + 0.3, y: 1.45, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: i ? C.l2 : C.l5 });
        let y = 2.1;
        side.items.forEach((it, k) => { t.oval(s, x + 0.32, y + 0.07, 0.14, 0.14, i ? C.l2 : C.l4); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: 15, color: fg }); y += rows[k]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: "SlideAI Qog'oz", colors: { dk1: C.ink, lt1: C.white, dk2: C.l6, lt2: C.l1, accent1: C.l5, accent2: C.l4, accent3: C.l3, accent4: C.l6, accent5: C.muted, accent6: C.l2, hlink: C.l5, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "yumshoq, do'stona va tushunarli", "limits": {}};
module.exports = { id: 28, slug: 'qogoz', name: "Qog'oz", category: 'creative', photos: true, build, style: STYLE };
