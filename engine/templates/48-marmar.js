/**
 * 48 Marmar — marble and brass: veined white marble, fine brass double lines, serif type,
 * photos in tall rounded-top niches, brass ring numbers. Calm, expensive, architectural.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { marble: 'F4F2EE', brass: 'B08A4E', ink: '2B2826', muted: '5E574F', blush: 'EADCD2', white: 'FFFFFF' };
const F = { head: 'Cambria', body: 'Calibri' };
const NICHE = { path: 'M0,1 L0,0.32 C0,0.14 0.22,0 0.5,0 C0.78,0 1,0.14 1,0.32 L1,1 Z' };

const marbleSvg = (seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs>
  <filter id="v" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.011" numOctaves="5" seed="${seed}"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
  <feComponentTransfer><feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0.05 0.22 0.05 0 0 0 0 0 0 0 0 0 0"/></feComponentTransfer></filter></defs>
  <rect width="1600" height="900" fill="#${C.marble}"/><rect width="1600" height="900" filter="url(#v)" fill="#9A938A" opacity="0.55"/></svg>`;
const nicheLine = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M3,${h} L3,${h * 0.32} C3,${h * 0.14} ${w * 0.22},3 ${w / 2},3 C${w * 0.78},3 ${w - 3},${h * 0.14} ${w - 3},${h * 0.32} L${w - 3},${h}" fill="none" stroke="#${C.brass}" stroke-width="3"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bgA = await L.svg(marbleSvg(3), 1600, 900, true), bgB = await L.svg(marbleSvg(11), 1600, 900, true);
  const memo = {};
  const niche = async (s, src, x, y, w, h) => {
    t.img(s, await L.photo(L.src(src), w, h, { mask: NICHE }), x, y, w, h, { alt: '' });
    t.img(s, (memo[`n${w}${h}`] ??= await L.svg(nicheLine(Math.round((w + 0.24) * 100), Math.round((h + 0.12) * 100)), (w + 0.24) * 100, (h + 0.12) * 100)), x - 0.12, y - 0.12, w + 0.24, h + 0.12);
  };
  const ring = (s, x, y, d, txt, fs) => { t.oval(s, x, y, d, d, null, { line: { color: C.brass, width: 1 } }); t.oval(s, x + 0.05, y + 0.05, d - 0.1, d - 0.1, null, { line: { color: C.brass, width: 0.5 } }); if (txt !== undefined) t.text(s, String(txt), { x, y, w: d, h: d, fontFace: F.head, fontSize: fs || Math.round(d * 24), color: C.brass, align: 'center', valign: 'middle' }); };
  const dbl = (s, x, y, w) => { t.line(s, x, y, w, 0, C.brass, 1); t.line(s, x, y + 0.05, w, 0, C.brass, 0.5); };
  const footer = (s) => { dbl(s, 0.6, 5.08, 8.8); t.text(s, `${M.topic || ''}   \u00B7   ${meta}`, { x: 0.6, y: 5.18, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted, align: 'center', charSpacing: 1 }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: idx % 2 ? bgA : bgB }; idx++;
    ring(s, 0.6, 0.42, 0.55, idx, 13);
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.0, h: 0.65, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 30, 16, F.head) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.35), color: C.ink, lineSpacingMultiple: 1.35, valign: 'middle' });
  const card = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.white, { t: 25, line: { color: C.brass, width: 0.75 }, name: 'Card' }); t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { line: { color: C.brass, width: 0.4 }, name: 'Inner line' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bgA }; idx++;
    if (d.image) await niche(s, d.image, 6.4, 0.75, 2.8, 3.85);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('   \u00B7   ').toUpperCase(), { x: 0.7, y: 0.85, w: 5.4, h: 0.3, fontSize: 10, color: C.brass, charSpacing: 3 });
    t.text(s, d.title, { x: 0.7, y: 1.25, w: 5.4, h: 2.1, fontFace: F.head, fontSize: L.fit(d.title, 5.4, 2.0, 42, 22, F.head), color: C.ink, valign: 'bottom' });
    dbl(s, 0.7, 3.5, 1.6);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.65, w: 5.3, h: 0.7, fontFace: F.head, italic: true, fontSize: 14, color: C.muted });
    t.text(s, (M.author || '').toUpperCase(), { x: 0.7, y: 4.45, w: 5.3, h: 0.35, fontSize: 11, bold: true, color: C.ink, charSpacing: 3 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await niche(s, d.image, 0.85, 1.4, 3.2, 3.45); para(s, d.text, 4.6, 1.4, 4.8, 3.45); },
    async image(d) { const s = page(d); para(s, d.text, 0.7, 1.4, 4.7, 3.45); await niche(s, d.image, 6.05, 1.4, 3.2, 3.45); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.4 / per);
      d.items.forEach((it, i) => {
        const x = 0.8 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        ring(s, x, y, 0.6, i + 1, 15);
        t.text(s, it, { x: x + 0.8, y, w: 3.4, h: 0.6, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + gap);
        card(s, x, 1.45, w, h);
        t.img(s, await L.icon(it.icon, C.brass, 1.5), x + w / 2 - 0.2, 1.7, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.25, y: 2.25, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.5, 0.45, 17, 12, F.head), color: C.ink, align: 'center' });
        t.text(s, it.t, { x: x + 0.25, y: 2.75, w: w - 0.5, h: h - 1.4, fontSize: 14, color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.6 / n;
      t.line(s, 0.7 + 0.35, 1.8, cw * (n - 1), 0, C.brass, 0.75);
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * cw;
        t.oval(s, x, 1.45, 0.7, 0.7, C.marble);
        ring(s, x, 1.45, 0.7, i + 1, 17);
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.5, 18, 12, F.head), color: C.ink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 15, 11, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.6 / n;
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * cw;
        if (i) t.line(s, px - 0.05, 1.6, 0, 2.4, C.brass, 0.5);
        t.text(s, x.value, { x: px, y: 1.45, w: cw - 0.3, h: 1.4, fontFace: F.head, fontSize: L.fit(x.value, cw - 0.4, 1.3, 60, 26, F.head), color: C.ink, align: 'center', valign: 'middle' });
        dbl(s, px + cw / 2 - 0.5, 2.95, 0.7);
        t.text(s, x.label, { x: px + 0.1, y: 3.1, w: cw - 0.5, h: 0.95, fontSize: 14, color: C.muted, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.4, w: 8.6, h: 0.45, fontFace: F.head, italic: true, fontSize: 10.5, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.35);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * (w + 0.3);
        card(s, x, 1.4, w, 3.45);
        t.text(s, side.h, { x: x + 0.3, y: 1.6, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 19, color: i ? C.brass : C.ink, align: 'center' });
        dbl(s, x + w / 2 - 0.4, 2.15, 0.8);
        let y = 2.35;
        side.items.forEach((it, k) => { t.shape(s, 'DIAMOND', { x: x + 0.35, y: y + 0.09, w: 0.11, h: 0.11, fill: { color: C.brass }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      dbl(s, 2.0, 1.55, 6.0);
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.7, w: 8.0, h: 1.9, fontFace: F.head, fontSize: L.fit(d.text, 8.0, 1.8, 36, 20, F.head), color: C.ink, align: 'center', valign: 'middle' });
      dbl(s, 2.0, 3.7, 6.0);
      if (d.caption) t.text(s, d.caption, { x: 1.3, y: 3.9, w: 7.4, h: 1.0, fontSize: L.fit(d.caption, 7.4, 1.0, 14, 10, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.6 / n;
      dbl(s, 0.7, 2.3, 8.6);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.7, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.65, 30, 14, F.head), color: C.brass, valign: 'bottom' });
        t.shape(s, 'DIAMOND', { x, y: 2.21, w: 0.22, h: 0.22, fill: { color: C.marble }, line: { color: C.brass, width: 1 }, objectName: 'Marker' });
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 17, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      t.text(s, '\u201C', { x: 4.4, y: 0.8, w: 1.2, h: 1.0, fontFace: F.head, fontSize: 72, color: C.brass, align: 'center' });
      t.text(s, d.text, { x: 1.2, y: 1.7, w: 7.6, h: 2.2, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.6, 2.1, 32, 18, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author.toUpperCase(), { x: 1.2, y: 4.05, w: 7.6, h: 0.35, fontSize: 11, bold: true, color: C.brass, align: 'center', charSpacing: 3 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, L.ROMAN[i] || String(i + 1), { x: 0.7, y, w: 0.6, h: rh, fontFace: F.head, fontSize: 14, color: C.brass, valign: 'middle' });
        t.text(s, it, { x: 1.35, y, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Marmar', colors: { dk1: C.ink, lt1: C.white, dk2: '4A4540', lt2: C.marble, accent1: C.brass, accent2: C.blush, accent3: C.muted, accent4: '8C857C', accent5: 'C9B48E', accent6: 'D9D3CA', hlink: C.brass, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ulug'vor va vazmin: kam so'z, salmoqli fikr, nafis va ishonchli ohang", limits: { stmt: 60, card_t4: 65 }, prefer: null };
module.exports = { id: 48, slug: 'marmar', name: 'Marmar', category: 'minimalist', photos: true, build, style: STYLE };
