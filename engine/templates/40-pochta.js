/**
 * 40 Pochta — vintage mail: airmail-striped postcards, photos as perforated postage stamps
 * with postmarks, typewriter addresses, postmark dates for the timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'EFE7D8', card: 'FFFDF7', ink: '2E2A26', red: 'C0392B', blue: '1F4E8C', gray: '7A7368', line: 'D9CFBE' };
const F = { head: 'Cambria', body: 'Calibri', type: 'Courier New' };

const airmail = (w, h, band = 22) => { // striped border
  let st = ''; for (let x = -h; x < w + h; x += 60) st += `<polygon points="${x},0 ${x + 30},0 ${x + 30 - h},${h} ${x - h},${h}" fill="#${(x / 60) % 2 === 0 ? C.red : C.blue}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><clipPath id="c"><path fill-rule="evenodd" d="M0,0 H${w} V${h} H0 Z M${band},${band} V${h - band} H${w - band} V${band} Z"/></clipPath></defs><g clip-path="url(#c)"><rect width="${w}" height="${h}" fill="#fff"/>${st}</g></svg>`;
};
const postmark = (w, text1, text2) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 2.2}" height="${w}"><g fill="none" stroke="#${C.gray}" stroke-width="4" opacity="0.8">
  <circle cx="${w / 2}" cy="${w / 2}" r="${w / 2 - 4}"/><circle cx="${w / 2}" cy="${w / 2}" r="${w / 2 - 16}"/>
  ${[0, 1, 2, 3].map((k) => `<path d="M${w},${w * 0.3 + k * w * 0.13} q${w * 0.15},-14 ${w * 0.3},0 t${w * 0.3},0 t${w * 0.3},0 t${w * 0.3},0"/>`).join('')}</g>
  <g fill="#${C.gray}" font-family="Courier New" font-weight="bold" text-anchor="middle" opacity="0.85"><text x="${w / 2}" y="${w / 2 - 4}" font-size="${w * 0.17}">${text1}</text><text x="${w / 2}" y="${w / 2 + w * 0.2}" font-size="${w * 0.15}">${text2}</text></g></svg>`;

async function build(content, out) {
  const pres = L.deck({ head: F.head, body: F.body }, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const esc = (s) => String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const memo = {}; const svgImg = async (k, svg, w, h) => (memo[k] ??= await L.svg(svg, w, h));
  const postcard = async (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 8, offset: 3, name: 'Postcard' }); t.img(s, await svgImg(`a${w}${h}`, airmail(Math.round(w * 100), Math.round(h * 100), 14), w * 100, h * 100), x, y, w, h); };
  // postage stamp: white paper with perforations (paper-coloured dots on the edge)
  const stamp = async (s, src, x, y, w, h, bg = C.paper, mark) => {
    t.rect(s, x, y, w, h, 'FFFFFF', { shadow: 0.18, blur: 4, offset: 2, name: 'Stamp' });
    const d = 0.12, nx = Math.floor(w / 0.2), ny = Math.floor(h / 0.2);
    for (let i = 0; i <= nx; i++) { const cx = x + (i * w) / nx; t.oval(s, cx - d / 2, y - d / 2, d, d, bg); t.oval(s, cx - d / 2, y + h - d / 2, d, d, bg); }
    for (let j = 1; j < ny; j++) { const cy = y + (j * h) / ny; t.oval(s, x - d / 2, cy - d / 2, d, d, bg); t.oval(s, x + w - d / 2, cy - d / 2, d, d, bg); }
    if (src) t.img(s, await L.photo(L.src(src), w - 0.36, h - 0.36), x + 0.18, y + 0.18, w - 0.36, h - 0.36, { alt: '' });
    if (mark) t.img(s, await svgImg(`pm${mark.join()}`, postmark(260, esc(mark[0]), esc(mark[1])), 572, 260), x + w * 0.45, y + h * 0.55, 2.0, 0.91);
  };
  const footer = (s) => t.text(s, `${M.topic || ''}  //  ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.type, fontSize: 8.5, color: C.gray });
  let idx = 0;
  const pg = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.img(s, await L.icon('FiMail', C.red, 2), 0.6, 0.48, 0.42, 0.42);
    if (d.title) t.text(s, d.title, { x: 1.2, y: 0.38, w: 7.2, h: 0.65, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.65, 28, 16, F.head, true) });
    t.text(s, `No ${L.pad2(idx)}`, { x: 8.4, y: 0.45, w: 1.0, h: 0.5, fontFace: F.type, fontSize: 13, bold: true, color: C.blue, align: 'right', valign: 'middle' });
    t.line(s, 0.6, 1.12, 8.8, 0, C.line, 1, { dash: 'dash' });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await postcard(s, 0.45, 0.4, 9.1, 4.75);
    t.line(s, 5.25, 0.9, 0, 3.8, C.line, 1.25);
    if (d.image) await stamp(s, d.image, 7.55, 0.85, 1.55, 1.85, C.card, [M.loc || 'POCHTA', M.year || '']);
    t.text(s, kind === 'cover' ? TR.postcard : TR.thanks, { x: 0.85, y: 0.8, w: 4.2, h: 0.3, fontFace: F.type, fontSize: 10, bold: true, color: C.red, charSpacing: 2 });
    const fs = L.fit(d.title, 4.1, 2.1, 36, 20, F.head, true);
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.1, h: 2.2, fontFace: F.head, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.5, w: 4.1, h: 1.0, fontFace: F.head, italic: true, fontSize: 13, color: C.gray });
    const lines = [M.author, M.org, [M.loc, M.year].filter(Boolean).join(', ')].filter(Boolean);
    lines.forEach((ln, k) => { t.text(s, ln, { x: 5.6, y: 3.0 + k * 0.48, w: 3.6, h: 0.4, fontFace: F.type, fontSize: 13, bold: k === 0, color: C.blue, valign: 'bottom' }); t.line(s, 5.6, 3.42 + k * 0.48, 3.6, 0, C.line, 1); });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = await pg(d); await stamp(s, d.image, 0.75, 1.5, 3.6, 3.2, C.paper, [M.loc || '', M.year || '']); para(s, d.text, 4.85, 1.45, 4.55, 3.5); },
    async image(d) { const s = await pg(d); para(s, d.text, 0.6, 1.45, 4.3, 3.5); await stamp(s, d.image, 5.45, 1.5, 3.8, 3.2); },
    async agenda(d) {
      const s = await pg(d); await postcard(s, 0.6, 1.35, 8.8, 3.7);
      const rh = Math.min(0.5, 3.0 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        t.text(s, `${L.pad2(i + 1)}.`, { x: 1.0, y, w: 0.6, h: rh, fontFace: F.type, fontSize: 14, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.65, y, w: 7.3, h: rh, fontFace: F.type, fontSize: 15, color: C.blue, valign: 'middle' });
        t.line(s, 1.65, y + rh - 0.04, 7.3, 0, C.line, 0.75);
      });
    },
    async cards(d) {
      const s = await pg(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.45, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.45);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        await postcard(s, x, 1.45, w, h);
        t.rect(s, x + w - 0.75, 1.68, 0.5, 0.6, [C.red, C.blue][i % 2], { name: 'Mini stamp' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w - 0.64, 1.82, 0.28, 0.28);
        t.text(s, it.h, { x: x + 0.3, y: 2.4, w: w - 0.6, h: 0.42, fontFace: F.head, fontSize: L.fit(it.h, w - 0.6, 0.42, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.3, y: 2.85, w: w - 0.6, h: h - 1.6, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = await pg(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6 + 0.3, 1.85, cw * (n - 1), 0, C.blue, 2, { dash: 'dash' });
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.55, 0.6, 0.6, C.card, { line: { color: C.blue, width: 2 } });
        t.img(s, await L.icon(i === n - 1 ? 'FiMapPin' : 'FiSend', C.blue, 2), x + 0.15, 1.7, 0.3, 0.3);
        t.text(s, `${i + 1}. ${st.h}`, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(`${i + 1}. ${st.h}`, cw - 0.3, 0.5, 16, 11, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 14, 10, F.body), color: C.gray });
      }
    },
    async stats(d) {
      const s = await pg(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw, w = Math.min(2.0, cw - 0.5);
        await stamp(s, null, px + (cw - w) / 2 - 0.15, 1.5, w, 1.7);
        t.rect(s, px + (cw - w) / 2 + 0.03, 1.68, w - 0.36, 1.34, [C.red, C.blue, 'C79A2E'][i % 3], { name: 'Stamp face' });
        t.text(s, x.value, { x: px + (cw - w) / 2 + 0.03, y: 1.68, w: w - 0.36, h: 1.34, fontFace: F.head, fontSize: L.fit(x.value, w - 0.5, 0.8, 36, 16, F.head, true), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.4, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontFace: F.type, fontSize: 10, color: C.gray });
    },
    async compare(d) {
      const s = await pg(d), w = 4.25;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w - 0.8, F.body) : 0))) + 0.18);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3);
        await postcard(s, x, 1.4, w, 3.6);
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 18, bold: true, color: i ? C.blue : C.red });
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, '\u2709', { x: x + 0.35, y, w: 0.3, h: 0.3, fontSize: 12, color: i ? C.blue : C.red }); t.text(s, it, { x: x + 0.7, y, w: w - 1.0, h: rows[k], fontSize: 14, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await pg(d); await postcard(s, 0.9, 1.4, 8.2, 3.5);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.7, w: 7.2, h: 1.7, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.2, 1.6, 32, 18, F.head, true, 1, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.5, y: 3.5, w: 7.0, h: 1.15, fontSize: L.fit(d.caption, 7.0, 1.15, 14, 10, F.body), color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = await pg(d), n = d.items.length, cw = 8.8 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw, dd = Math.min(1.3, cw - 0.4);
        t.oval(s, x, 1.35, dd, dd, null, { line: { color: [C.red, C.blue][i % 2], width: 2.5 } });
        t.oval(s, x + 0.1, 1.45, dd - 0.2, dd - 0.2, null, { line: { color: [C.red, C.blue][i % 2], width: 1 } });
        t.text(s, it.year, { x, y: 1.35, w: dd, h: dd, fontFace: F.type, fontSize: L.fit(it.year, dd - 0.3, 0.5, 20, 10, F.type, true), bold: true, color: [C.red, C.blue][i % 2], align: 'center', valign: 'middle', rotate: -12 });
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.3, w: cw - 0.3, h: 1.65, fontSize: 14, color: C.gray });
      }
    },
    async quote(d) {
      const s = await pg({}); await postcard(s, 0.9, 0.9, 8.2, 3.9);
      t.text(s, d.text, { x: 1.4, y: 1.3, w: 7.2, h: 2.3, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.2, 2.2, 30, 16, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.4, y: 3.8, w: 7.2, h: 0.45, fontFace: F.type, fontSize: 13, bold: true, color: C.blue, align: 'right' });
    },
    async sources(d) {
      const s = await pg(d), n = d.items.length, rh = Math.min(0.56, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 0.6, y, w: 0.55, h: rh, fontFace: F.type, fontSize: 13, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontFace: F.type, fontSize: L.fit(it, 8.2, rh - 0.04, 12, 9, F.type), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Pochta', colors: { dk1: C.ink, lt1: C.card, dk2: '4A433C', lt2: C.paper, accent1: C.red, accent2: C.blue, accent3: 'C79A2E', accent4: C.gray, accent5: C.line, accent6: 'B8AE9C', hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "maktubdek samimiy, lekin aniq: tinglovchiga murojaat qilgandek, qisqa xabarlar", limits: {}, prefer: null };
module.exports = { id: 40, slug: 'pochta', name: 'Pochta', category: 'creative', photos: true, build, style: STYLE };
