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
        const x = 0.6 + i * cw, sz = 0.55 + i * 0.12;
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Gerbariy', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.sepia, lt2: C.paper, accent1: C.green, accent2: C.red, accent3: C.sepia, accent4: C.leaf, accent5: C.muted, accent6: C.line, hlink: C.green, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tadqiqotchi kuzatuvi kabi: sinchkov, tasviriy va aniq; ilmiy ehtiyotkorlik bilan", limits: {}, prefer: 'text' };
module.exports = { id: 50, slug: 'gerbariy', name: 'Gerbariy', category: 'academic', photos: true, build, style: STYLE };
