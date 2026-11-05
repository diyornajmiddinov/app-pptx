/**
 * 50 Gerbariy — herbarium sheets: aged paper, botanical line drawings of leaves, ferns
 * and sprigs, photos mounted with paper corners, specimen labels for titles and data.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'F2ECD9', ink: '2F2A22', sepia: '7A5C3A', green: '5E7D4F', leaf: 'A9BF8E', label: 'FBF7EA', red: '9E3B2C', line: 'BFAF8A', muted: '6E6252' };
const F = { head: 'Cambria', body: 'Calibri' };

const leaf = (len, ang, x, y, w = 0.32) => { // one leaf with midrib and veins, base at (x, y)
  const L2 = len, wd = len * w;
  let veins = ''; for (let k = 1; k < 5; k++) { const p = (k / 5) * L2; veins += `<path d="M${p},0 L${p + wd * 0.7},${-wd * 0.55} M${p},0 L${p + wd * 0.7},${wd * 0.55}"/>`; }
  return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M0,0 C${L2 * 0.25},${-wd} ${L2 * 0.75},${-wd} ${L2},0 C${L2 * 0.75},${wd} ${L2 * 0.25},${wd} 0,0 Z" fill="#${C.leaf}" fill-opacity="0.75" stroke="#${C.green}" stroke-width="3"/><g stroke="#${C.green}" stroke-width="1.5" fill="none"><path d="M0,0 L${L2},0"/>${veins}</g></g>`;
};
const plantSvg = (kind, w, h) => {
  let g = '';
  if (kind === 'fern') { g += `<path d="M${w * 0.5},${h} C${w * 0.45},${h * 0.6} ${w * 0.55},${h * 0.3} ${w * 0.5},10" fill="none" stroke="#${C.sepia}" stroke-width="4"/>`; for (let k = 0; k < 11; k++) { const y = h - 40 - k * ((h - 60) / 11), len = (w * 0.42) * (1 - k / 13); g += leaf(len, -160 + k * 2, w * 0.5, y, 0.22) + leaf(len, -20 - k * 2, w * 0.5, y + 8, 0.22); } }
  else if (kind === 'sprig') { g += `<path d="M20,${h - 20} C${w * 0.4},${h * 0.7} ${w * 0.6},${h * 0.35} ${w - 30},30" fill="none" stroke="#${C.sepia}" stroke-width="4"/>`; for (let k = 1; k < 7; k++) { const tt = k / 7, x = 20 + (w - 50) * tt, y = h - 20 - (h - 50) * tt; g += leaf(70, k % 2 ? -100 - k * 4 : 10 - k * 4, x, y, 0.4); } }
  else { g += `<path d="M${w / 2},${h - 10} L${w / 2},${h * 0.45}" stroke="#${C.sepia}" stroke-width="5"/>` + leaf(h * 0.6, -90, w / 2, h * 0.5, 0.42); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${g}</svg>`;
};
const paperSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#${C.paper}"/><stop offset="1" stop-color="#E2D6B6"/></radialGradient>
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0.05 0"/></filter></defs>
  <rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" filter="url(#n)"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(paperSvg(), 1600, 900, true);
  const memo = {}; const plant = async (kind, w, h) => (memo[kind + w + h] ??= await L.svg(plantSvg(kind, w, h), w, h));
  const mounted = async (s, src, x, y, w, h) => {
    t.rect(s, x, y, w, h, 'FFFFFF', { shadow: 0.15, blur: 5, offset: 2, name: 'Mount' });
    t.img(s, await L.photo(L.src(src), w - 0.2, h - 0.2), x + 0.1, y + 0.1, w - 0.2, h - 0.2, { alt: '' });
    const c = 0.32; // paper photo corners
    for (const [cx, cy, rot] of [[x - 0.04, y - 0.04, 0], [x + w - c + 0.04, y - 0.04, 90], [x + w - c + 0.04, y + h - c + 0.04, 180], [x - 0.04, y + h - c + 0.04, 270]])
      t.shape(s, 'RIGHT_TRIANGLE', { x: cx, y: cy, w: c, h: c, fill: { color: C.sepia }, rotate: rot + 90, objectName: 'Photo corner' });
  };
  const label = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.label, { line: { color: C.ink, width: 1 }, name: 'Specimen label' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { line: { color: C.ink, width: 0.5 }, name: 'Label line' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.head, italic: true, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.img(s, await plant('sprig', 300, 220), 8.1, 0.15, 1.6, 1.17);
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.42, w: 7.3, h: 0.65, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.3, 0.65, 28, 16, F.head, true) });
    t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.6, y: 0.15, w: 2, h: 0.25, fontFace: F.head, italic: true, fontSize: 10, color: C.red });
    t.line(s, 0.6, 1.12, 2.0, 0, C.sepia, 0.75);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.img(s, await plant('fern', 360, 900), 0.25, 0.25, 1.9, 4.75);
    if (d.image) await mounted(s, d.image, 6.35, 0.55, 3.0, 2.45);
    t.text(s, d.title, { x: 2.3, y: 0.6, w: d.image ? 3.8 : 6.9, h: 2.4, fontFace: F.head, bold: true, fontSize: L.fit(d.title, d.image ? 3.8 : 6.9, 2.3, 38, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 2.3, y: 3.1, w: 3.8, h: 0.9, fontFace: F.head, italic: true, fontSize: 13, color: C.muted });
    label(s, 6.35, 3.3, 3.0, 1.6);
    t.text(s, `${TR.specimen} ${TR.no} ${idx}`, { x: 6.5, y: 3.38, w: 2.7, h: 0.28, fontFace: F.head, italic: true, fontSize: 10, color: C.red });
    [[TR.author_l, M.author], [TR.org_l, M.org], [TR.city_l, [M.loc, M.year].filter(Boolean).join(', ')]].forEach(([k, v], i) =>
      t.text(s, [{ text: `${k}: `, options: { italic: true, color: C.muted } }, { text: v || '\u2014', options: { bold: true, color: C.ink } }], { x: 6.5, y: 3.7 + i * 0.36, w: 2.75, h: 0.34, fontFace: F.head, fontSize: L.fit(`${k}: ${v || ''}`, 2.7, 0.32, 12, 8, F.head) }));
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await mounted(s, d.image, 0.75, 1.5, 3.8, 3.1); para(s, d.text, 5.0, 1.45, 4.4, 3.4); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.45, 4.4, 3.4); await mounted(s, d.image, 5.45, 1.5, 3.8, 3.1); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        t.img(s, await plant('leaf', 120, 160), x, y - 0.05, 0.5, 0.67);
        t.text(s, `${i + 1}.`, { x: x + 0.55, y, w: 0.45, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: x + 1.0, y, w: 3.2, h: 0.6, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        label(s, x, 1.5, w, h);
        t.img(s, await L.icon(it.icon, C.green, 2), x + 0.22, 1.68, 0.36, 0.36);
        t.text(s, `${TR.no} ${i + 1}`, { x: x + w - 1.0, y: 1.68, w: 0.8, h: 0.3, fontFace: F.head, italic: true, fontSize: 10, color: C.red, align: 'right' });
        t.text(s, it.h, { x: x + 0.22, y: 2.15, w: w - 0.44, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.44, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.22, y: 2.6, w: w - 0.44, h: h - 1.2, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.05, 8.8, 0, C.sepia, 2.5);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw, sz = 0.5 + i * (n === 4 ? 0.08 : 0.12);
        t.img(s, await plant('leaf', 120, 160), x + 0.1, 2.05 - sz * 1.33, sz, sz * 1.33);
        t.text(s, `${i + 1}`, { x: x + 0.1 + sz + 0.05, y: 1.45, w: 0.5, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: C.red });
        t.text(s, st.h, { x, y: 2.25, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.7, w: cw - 0.3, h: 2.2, fontSize: L.fit(st.t, cw - 0.3, 2.2, 15, 11, F.body), color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        label(s, px, 1.5, w, 2.6);
        t.text(s, x.value, { x: px + 0.2, y: 1.65, w: w - 0.4, h: 1.25, fontFace: F.head, fontSize: L.fit(x.value, w - 0.4, 1.15, 54, 24, F.head, true), bold: true, color: i === 0 ? C.red : C.green, align: 'center', valign: 'middle' });
        t.line(s, px + w / 2 - 0.5, 2.95, 1.0, 0, C.line, 1);
        t.text(s, x.label, { x: px + 0.2, y: 3.05, w: w - 0.4, h: 0.95, fontFace: F.head, italic: true, fontSize: 13, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.35, w: 8.8, h: 0.5, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.2;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        label(s, x, 1.45, w, 3.45);
        t.text(s, side.h, { x: x + 0.25, y: 1.6, w: w - 0.5, h: 0.5, fontFace: F.head, fontSize: 18, bold: true, italic: true, color: i ? C.green : C.red });
        t.line(s, x + 0.25, 2.1, w - 0.5, 0, C.line, 0.75);
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, '\u2767', { x: x + 0.22, y, w: 0.35, h: 0.32, fontSize: 13, color: C.green }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d);
      t.img(s, await plant('fern', 360, 900), 0.4, 1.2, 1.3, 3.25);
      t.img(s, await plant('fern', 360, 900), 8.3, 1.2, 1.3, 3.25);
      t.text(s, L.runs(d.text), { x: 1.9, y: 1.45, w: 6.2, h: 2.0, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 6.2, 1.9, 34, 18, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.9, y: 3.55, w: 6.2, h: 1.2, fontFace: F.head, italic: true, fontSize: L.fit(d.caption, 6.2, 1.2, 14, 10, F.head), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.3, 8.8, 0, C.sepia, 2.5);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw;
        t.img(s, await plant('leaf', 120, 160), x + 0.05, 1.6, 0.52, 0.7);
        t.text(s, it.year, { x: x + 0.6, y: 1.55, w: cw - 0.7, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.75, 0.55, 24, 12, F.head, true), bold: true, color: C.red, valign: 'middle' });
        t.text(s, it.h, { x, y: 2.5, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 2.95, w: cw - 0.3, h: 1.95, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({});
      t.img(s, await plant('sprig', 300, 220), 0.5, 3.6, 2.2, 1.6);
      t.text(s, d.text, { x: 1.2, y: 1.2, w: 7.6, h: 2.4, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.6, 2.3, 32, 18, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.2, y: 3.75, w: 7.6, h: 0.4, fontFace: F.head, fontSize: 15, color: C.red, align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, `${i + 1}.`, { x: 0.6, y, w: 0.45, h: rh, fontFace: F.head, fontSize: 14, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.05, y, w: 8.35, h: rh, fontFace: F.head, fontSize: L.fit(it, 8.35, rh - 0.04, 14, 10, F.head), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all from the same collector's folio: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const MOSS = '2E3A29', PAPER = 'F2ECD9', PALE = 'DDD8C2';
  const moss = async (d) => { // the dark green folio cover
    const s = pres.addSlide(); s.background = { color: MOSS }; idx++;
    t.img(s, await plant('sprig', 300, 220), 8.1, 0.15, 1.6, 1.17);
    t.text(s, d.title, { x: 0.6, y: 0.42, w: 7.3, h: 0.65, fontFace: F.head, bold: true, color: PAPER, valign: 'middle', fontSize: L.fit(d.title, 7.3, 0.65, 28, 16, F.head, true) });
    t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.6, y: 0.15, w: 2, h: 0.25, fontFace: F.head, italic: true, fontSize: 10, color: C.leaf });
    t.line(s, 0.6, 1.12, 2.0, 0, C.leaf, 0.75);
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.head, italic: true, fontSize: 8.5, color: PALE });
    return s;
  };
  const hleaf = async (s, x, y, w, flip) => t.img(s, (memo['hl' + !!flip] ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="90">${flip ? leaf(225, 180, 232, 45, 0.3) : leaf(225, 0, 8, 45, 0.3)}</svg>`, 240, 90)), x, y, w, w * 0.375);
  const V = {
    image: [
      async (d) => { // a broad plate mounted across the sheet
        const s = await page(d);
        await mounted(s, d.image, 0.65, 1.3, 8.7, 2.05);
        t.text(s, d.text, { x: 0.6, y: 3.55, w: 8.8, h: 1.58, fontSize: L.fit(d.text, 8.8, 1.58, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // the folio cover: a fern along the edge, the plate mounted on the dark board
        const s = await moss(d);
        t.img(s, await plant('fern', 360, 900), 0.2, 1.25, 1.5, 3.75);
        t.text(s, d.text, { x: 1.75, y: 1.3, w: 3.75, h: 3.8, fontSize: L.fit(d.text, 3.75, 3.8, 15, 10, F.body, false, 1.25), color: PAPER, lineSpacingMultiple: 1.25, valign: 'middle' });
        await mounted(s, d.image, 5.85, 1.45, 3.55, 3.35);
      },
      async (d) => { // the field itself fills the page, the collector's label laid on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        label(s, 4.95, 0.35, 4.6, 4.72);
        t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 5.2, y: 0.5, w: 2, h: 0.25, fontFace: F.head, italic: true, fontSize: 10, color: C.red });
        t.text(s, d.title, { x: 5.2, y: 0.76, w: 4.1, h: 0.76, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 4.1, 0.74, 20, 13, F.head, true) });
        t.line(s, 5.2, 1.56, 1.4, 0, C.sepia, 0.75);
        t.text(s, d.text, { x: 5.2, y: 1.64, w: 4.1, h: 3.3, fontSize: L.fit(d.text, 4.1, 3.3, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.18, W, H - 5.18, MOSS, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.24, w: 8.8, h: 0.3, fontFace: F.head, italic: true, fontSize: 8.5, color: PAPER, valign: 'middle' });
      },
      async (d) => { // seen through the naturalist's lens: round glass, brass rim, handle
        const s = await page(d), dd = 3.15, x = 0.7, y = 1.28;
        t.line(s, x + dd * 0.85, y + dd * 0.85, 0.9, 0.9, C.sepia, 11);
        t.oval(s, x - 0.1, y - 0.1, dd + 0.2, dd + 0.2, C.sepia);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.text(s, d.text, { x: 4.85, y: 1.36, w: 4.55, h: 3.72, fontSize: L.fit(d.text, 4.55, 3.72, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a stem down the sheet, one leaf to each entry
        const s = await page(d), n = d.items.length, h = 3.78 / n;
        t.line(s, 0.78, 1.3, 0, 3.8, C.sepia, 3);
        for (const [i, it] of d.items.entries()) {
          const y = 1.32 + i * h, mid = y + h / 2;
          await hleaf(s, 0.8, mid - 0.2, 1.05);
          t.oval(s, 0.54, mid - 0.24, 0.48, 0.48, C.label, { line: { color: C.sepia, width: 1 } });
          t.img(s, await L.icon(it.icon, C.green, 2), 0.65, mid - 0.13, 0.26, 0.26);
          head(s, it.h, 2.0, y + 0.03, 2.5, h - 0.08, { max: 17 });
          body(s, it.t, 4.6, y + 0.04, 4.8, h - 0.1, { valign: 'middle', color: C.ink, max: 14 });
          if (i < n - 1) t.line(s, 2.0, y + h - 0.01, 7.4, 0, C.line, 0.75);
        }
      },
      async (d) => { // the folio cover with paper labels glued on, two by two
        const s = await moss(d), n = d.items.length, w = 4.3, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.12);
          label(s, x, y, ww, h);
          t.img(s, await L.icon(it.icon, C.green, 2), x + 0.2, y + 0.18, 0.34, 0.34);
          head(s, it.h, x + 0.64, y + 0.12, ww - 1.4, 0.46, { max: 15 });
          t.text(s, `${TR.no} ${i + 1}`, { x: x + ww - 0.82, y: y + 0.16, w: 0.62, h: 0.3, fontFace: F.head, italic: true, fontSize: 10, color: C.red, align: 'right' });
          body(s, it.t, x + 0.2, y + 0.62, ww - 0.4, h - 0.72, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // specimens pinned at two heights, each with its leaf on top
        const s = await page(d), n = d.items.length, gap = 0.18, w = (8.8 - gap * (n - 1)) / n, h = 3.02;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.74 + (i % 2 ? 0.36 : 0);
          t.img(s, await plant('leaf', 120, 160), x + w - 0.56, y - 0.54, 0.42, 0.56);
          t.rect(s, x, y, w, h, 'FFFFFF', { shadow: 0.15, blur: 5, offset: 2, name: 'Mount' });
          t.oval(s, x + w / 2 - 0.05, y + 0.08, 0.1, 0.1, C.red);
          t.img(s, await L.icon(it.icon, C.green, 2), x + 0.16, y + 0.2, 0.32, 0.32);
          head(s, it.h, x + 0.16, y + 0.56, w - 0.32, 0.56, { max: 15 });
          body(s, it.t, x + 0.16, y + 1.14, w - 0.32, h - 1.22, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // a botanical plate: the plant in the centre, fine lines out to its notes
        const s = await page(d), n = d.items.length, w = 3.2, h = 1.8, cx = 5;
        t.img(s, await plant('fern', 360, 900), cx - 0.72, 1.28, 1.44, 3.82);
        const spots = n === 3 ? [[0.6, 1.34, 0], [0.6, 3.24, 0], [6.2, 2.3, 1]] : [[0.6, 1.34, 0], [6.2, 1.34, 1], [0.6, 3.24, 0], [6.2, 3.24, 1]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, right] = spots[i], a = right ? 'left' : 'right';
          t.line(s, right ? cx : x + w, y + 0.42, right ? x + w - cx : cx - x - w, 0, C.sepia, 0.75);
          t.oval(s, cx - 0.05, y + 0.37, 0.1, 0.1, C.red);
          t.img(s, await L.icon(it.icon, C.green, 2), right ? x : x + w - 0.3, y + 0.05, 0.3, 0.3);
          head(s, it.h, right ? x + 0.38 : x, y, w - 0.38, 0.4, { align: a, max: 15 });
          body(s, it.t, x, y + 0.48, w, h - 0.52, { align: a, color: C.ink, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // germination: each stage stands higher, its plant a little taller
        const s = await page(d), n = d.steps.length, w = 8.8 / n, h = n === 4 ? 1.86 : 1.92, low = 3.24, high = 1.86;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.12, sz = 0.36 + i * 0.05;
          t.img(s, await plant('leaf', 120, 160), x + 0.14, y - sz * 1.33 + 0.02, sz, sz * 1.33);
          t.text(s, String(i + 1), { x: x + 0.6, y: y - 0.38, w: 0.5, h: 0.36, fontFace: F.head, bold: true, fontSize: 18, color: C.red, valign: 'middle' });
          label(s, x, y, tw, 5.12 - y);
          head(s, st.h, x + 0.14, y + 0.1, tw - 0.28, 0.46, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.58, tw - 0.28, h - 0.68, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // the main stem climbs the middle, a leaf opens to each side in turn
        const s = await page(d), n = d.steps.length, gap = n === 4 ? 0.94 : 1.26, h = n === 4 ? 1.14 : 1.24, w = 3.35, cx = 5;
        t.line(s, cx, 1.28, 0, 3.84, C.sepia, 3.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.32 + i * gap, x = right ? cx + 0.95 : cx - 0.95 - w, a = right ? 'left' : 'right';
          await hleaf(s, right ? cx : cx - 0.88, y + 0.04, 0.88, !right);
          t.text(s, String(i + 1), { x: right ? cx + 0.28 : cx - 0.6, y: y + 0.42, w: 0.32, h: 0.34, fontFace: F.head, bold: true, fontSize: 16, color: C.red, align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.36, { align: a, max: 15 });
          body(s, st.t, x, y + 0.38, w, h - 0.42, { align: a, color: C.ink, max: 13 });
        }
      },
      async (d) => { // the strata of a bed of soil: layers from the surface down, edge to edge
        const s = await page(d), n = d.steps.length, h = 3.82 / n, cols = ['5A6E4B', '4A5C3F', '3C4C34', MOSS];
        for (const [i, st] of d.steps.entries()) {
          const y = 1.3 + i * h;
          t.rect(s, 0, y, W, h, n === 3 ? cols[i + 1] : cols[i], { name: 'Layer' });
          t.text(s, String(i + 1), { x: 0.55, y, w: 0.8, h, fontFace: F.head, bold: true, fontSize: 30, color: PAPER, valign: 'middle' });
          head(s, st.h, 1.35, y + 0.04, 2.7, h - 0.08, { color: PAPER, max: 17 });
          body(s, st.t, 4.2, y + 0.05, 5.2, h - 0.1, { color: PAPER, valign: 'middle', max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // one measurement gets the big label, the sprig beside it
        const s = await page(d), [a, ...rest] = d.stats;
        label(s, 0.6, 1.3, 4.7, 3.8);
        t.img(s, await plant('sprig', 300, 220), 3.55, 1.42, 1.6, 1.17);
        t.text(s, a.value, { x: 0.85, y: 2.2, w: 4.2, h: 1.3, fontFace: F.head, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(a.value, 4.15, 1.25, 60, 26, F.head, true) });
        t.text(s, a.label, { x: 0.85, y: 3.56, w: 4.2, h: 1.36, fontFace: F.head, italic: true, fontSize: L.fit(a.label, 4.2, 1.36, 16, 11, F.head, false, 1, true), color: C.ink });
        for (const [i, v] of rest.entries()) {
          const y = 1.3 + i * 1.12;
          t.text(s, v.value, { x: 5.6, y, w: 3.8, h: 0.6, fontFace: F.head, bold: true, color: C.green, valign: 'middle', fontSize: L.fit(v.value, 3.75, 0.56, 34, 16, F.head, true) });
          body(s, v.label, 5.6, y + 0.6, 3.8, 0.42, { color: C.ink, max: 12 });
          t.line(s, 5.6, y + 1.05, 3.8, 0, C.line, 0.75);
        }
        if (d.note) body(s, d.note, 5.6, 3.6, 3.8, 1.5, { max: 13, valign: 'middle' });
      },
      async (d) => { // the folio cover: three seeds of paper at uneven heights
        const s = await moss(d), cw = 8.8 / 3, dw = 2.5, dh = 1.62;
        for (const [i, v] of d.stats.entries()) {
          const px = 0.6 + i * cw + (cw - dw) / 2, y = 1.3 + (i % 2 ? 0.2 : 0);
          t.oval(s, px, y, dw, dh, PAPER, { line: { color: C.leaf, width: 2 } });
          t.text(s, v.value, { x: px + 0.2, y, w: dw - 0.4, h: dh, fontFace: F.head, bold: true, color: i % 2 ? C.green : C.red, align: 'center', valign: 'middle', fontSize: L.fit(v.value, dw - 0.5, 0.9, 40, 16, F.head, true) });
          t.text(s, v.label, { x: 0.6 + i * cw + 0.15, y: 3.2, w: cw - 0.3, h: 0.76, fontFace: F.head, italic: true, fontSize: L.fit(v.label, cw - 0.3, 0.76, 14, 10, F.head, false, 1, true), color: PAPER, align: 'center' });
        }
        if (d.note) body(s, d.note, 0.6, 4.06, 8.8, 1.06, { color: PALE, align: 'center', max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored about a pressed fern, the notes leaning away from it
        const s = await page(d), w = 3.55, cx = 5;
        t.img(s, await plant('fern', 360, 900), cx - 0.72, 1.28, 1.44, 3.82);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 3.02);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.82 : cx - 0.82 - w, a = i ? 'left' : 'right', col = i ? C.green : C.red;
          t.text(s, side.h, { x, y: 1.32, w, h: 0.56, fontFace: F.head, bold: true, italic: true, color: col, align: a, valign: 'middle', fontSize: L.fit(side.h, w, 0.54, 20, 12, F.head, true, 1, true) });
          t.line(s, x, 1.92, w, 0, C.line, 1);
          let y = 2.04;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: C.ink, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two long sheets, the pale one on the dark one
        const s = await page(d), h = 1.84;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.12), dark = i === 1, rh = (h - 0.22) / Math.ceil(side.items.length / 2);
          if (dark) t.rect(s, 0.6, y, 8.8, h, MOSS, { name: 'Sheet' }); else label(s, 0.6, y, 8.8, h);
          t.img(s, await plant('leaf', 120, 160), 0.78, y + 0.14, 0.42, 0.56);
          t.text(s, side.h, { x: 0.8, y: y + 0.72, w: 2.2, h: h - 0.82, fontFace: F.head, bold: true, italic: true, color: dark ? PAPER : C.red, fontSize: L.fit(side.h, 2.2, h - 0.84, 17, 11, F.head, true, 1, true) });
          t.line(s, 3.12, y + 0.18, 0, h - 0.36, dark ? C.leaf : C.line, 1);
          side.items.forEach((it, j) => body(s, it, 3.3 + (j % 2) * 3.05, y + 0.11 + Math.floor(j / 2) * rh, 2.9, rh - 0.05, { color: dark ? PAPER : C.ink, max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // the folio cover: the words set free, a great sprig to their right
        const s = await moss(d);
        t.img(s, await plant('sprig', 300, 220), 6.35, 2.65, 3.3, 2.42);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.28, w: 6.6, h: 2.3, fontFace: F.head, bold: true, color: PAPER, valign: 'middle', fontSize: L.fit(d.text, 6.6, 2.25, 34, 17, F.head, true) });
        t.line(s, 0.6, 3.66, 1.6, 0, C.leaf, 1.5);
        if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.78, w: 5.7, h: 1.34, fontFace: F.head, italic: true, fontSize: L.fit(d.caption, 5.7, 1.34, 14, 10, F.head, false, 1, true), color: PALE });
      },
      async (d) => { // one fern on the sheet, and its great label beside it
        const s = await page(d);
        t.img(s, await plant('fern', 360, 900), 0.45, 1.25, 1.5, 3.85);
        label(s, 2.25, 1.38, 7.15, 3.66);
        t.text(s, L.runs(d.text), { x: 2.6, y: 1.52, w: 6.45, h: 1.9, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 6.45, 1.85, 28, 15, F.head, true) });
        t.line(s, 2.6, 3.46, 6.45, 0, C.line, 0.75);
        if (d.caption) t.text(s, d.caption, { x: 2.6, y: 3.54, w: 6.45, h: 1.38, fontFace: F.head, italic: true, fontSize: L.fit(d.caption, 6.45, 1.38, 14, 10, F.head, false, 1, true), color: C.muted });
      },
    ],
    timeline: [
      async (d) => { // the stem lies across the sheet, leaves up and down in turn
        const s = await page(d), axis = 3.22, w = 3.65;
        t.line(s, 0, axis, W, 0, C.sepia, 3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.6 + (i / 2) * 4.45 : 1.75 + ((i - 1) / 2) * 4.45, top = up ? 1.26 : 3.46;
          t.img(s, await plant('leaf', 120, 160), x + w - 0.42, up ? axis - 0.58 : axis + 0.02, 0.42, 0.56);
          t.text(s, it.year, { x, y: top, w: 1.65, h: 0.38, fontFace: F.head, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(it.year, 1.6, 0.36, 18, 11, F.head, true) });
          head(s, it.h, x + 1.7, top, w - 2.15, 0.38, { max: 13 });
          body(s, it.t, x, top + 0.4, up ? w - 0.46 : w - 0.46, 1.26, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // the folio cover: four labels stepping down to the right
        const s = await moss(d), h = 0.86;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * 0.34, y = 1.3 + i * 0.96, w = 7.78;
          label(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.18, y, w: 1.6, h, fontFace: F.head, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(it.year, 1.55, 0.6, 22, 11, F.head, true) });
          head(s, it.h, x + 1.84, y + 0.08, 1.7, h - 0.16, { max: 13 });
          body(s, it.t, x + 3.6, y + 0.08, w - 3.76, h - 0.16, { color: C.ink, max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Gerbariy', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.sepia, lt2: C.paper, accent1: C.green, accent2: C.red, accent3: C.sepia, accent4: C.leaf, accent5: C.muted, accent6: C.line, hlink: C.green, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tadqiqotchi kuzatuvi kabi: sinchkov, tasviriy va aniq; ilmiy ehtiyotkorlik bilan", limits: {}, prefer: 'text' };
module.exports = { id: 50, slug: 'gerbariy', name: 'Gerbariy', category: 'academic', photos: true, build, style: STYLE };
