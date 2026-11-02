/**
 * 46 Suzani — Uzbek suzani embroidery: crimson floral medallions (oy-palak) on cream
 * linen, embroidered vine borders, photos framed inside the medallion's heart.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { linen: 'F7EFDF', crimson: 'A3182C', wine: '6E0F1F', gold: 'D9A441', indigo: '2B3A67', green: '4C7A4C', ink: '2A1A14', muted: '7A6355', panel: 'FBF6EC' };
const F = { head: 'Cambria', body: 'Calibri' };

// medallion (viewBox 400): scalloped outer ring, teardrop petals, dot ring, hollow heart of radius `core`
const medallion = (core = 0.42, pal = [C.crimson, C.wine, C.gold, C.indigo, C.green]) => {
  const [a, b, c, d, e] = pal, R = 200, petals = 16; let p = '', dots = '', sc = '';
  for (let k = 0; k < petals; k++) { const ang = (k / petals) * 360; p += `<path d="M200,${R - 190} C228,${R - 150} 222,${R - 115} 200,${R - 98} C178,${R - 115} 172,${R - 150} 200,${R - 190} Z" fill="#${k % 2 ? a : b}" transform="rotate(${ang} 200 200)"/><circle cx="200" cy="${R - 140}" r="7" fill="#${c}" transform="rotate(${ang} 200 200)"/>`; }
  for (let k = 0; k < 28; k++) { const ang = (k / 28) * 2 * Math.PI; dots += `<circle cx="${(200 + 92 * Math.cos(ang)).toFixed(1)}" cy="${(200 + 92 * Math.sin(ang)).toFixed(1)}" r="5" fill="#${d}"/>`; }
  for (let k = 0; k < 24; k++) { const ang = (k / 24) * 2 * Math.PI; sc += `<circle cx="${(200 + 192 * Math.cos(ang)).toFixed(1)}" cy="${(200 + 192 * Math.sin(ang)).toFixed(1)}" r="9" fill="#${e}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="194" fill="none" stroke="#${e}" stroke-width="4"/>${sc}${p}${dots}
    <circle cx="200" cy="200" r="${R * core + 6}" fill="#${a}"/><circle cx="200" cy="200" r="${R * core}" fill="#${C.linen}"/></svg>`;
};
const vine = (w, h) => { // embroidered border: wavy stem, leaves and small flowers
  let path = `M0,${h / 2}`, leaves = '', flowers = '';
  for (let x = 0, k = 0; x < w; x += 80, k++) {
    path += ` q40,${k % 2 ? 18 : -18} 80,0`;
    const y = h / 2 + (k % 2 ? 9 : -9);
    leaves += `<ellipse cx="${x + 40}" cy="${y + (k % 2 ? 12 : -12)}" rx="16" ry="6" fill="#${C.green}" transform="rotate(${k % 2 ? 30 : -30} ${x + 40} ${y})"/>`;
    if (k % 2 === 0) flowers += `<circle cx="${x + 80}" cy="${h / 2}" r="11" fill="#${C.crimson}"/><circle cx="${x + 80}" cy="${h / 2}" r="4" fill="#${C.gold}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${path}" fill="none" stroke="#${C.green}" stroke-width="4"/>${leaves}${flowers}</svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const med = async (core, pal) => (memo[core + String(pal)] ??= await L.svg(medallion(core, pal), 400, 400));
  const vineImg = await L.svg(vine(1600, 50), 1600, 50);
  const palAlt = [C.indigo, '1F2A4D', C.gold, C.crimson, C.green];
  // medallion with a photo (or a number / value) in its heart
  const medal = async (s, x, y, dd, { src, text, fs, alt } = {}) => {
    const core = 0.42;
    t.img(s, await med(core, alt ? palAlt : undefined), x, y, dd, dd);
    const cd = dd * core, cx = x + (dd - cd) / 2, cy = y + (dd - cd) / 2;
    if (src) t.img(s, await L.photo(L.src(src), cd, cd, { mask: 'circle' }), cx, cy, cd, cd, { alt: '' });
    if (text !== undefined) t.text(s, String(text), { x: cx, y: cy, w: cd, h: cd, fontFace: F.head, fontSize: fs || Math.round(cd * 30), bold: true, color: C.wine, align: 'center', valign: 'middle' });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted, align: 'center' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.linen }; idx++;
    t.img(s, vineImg, 0, 0.08, W, 0.31);
    await medal(s, 0.5, 0.5, 0.82, { text: idx, fs: 12 });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.55, w: 8.0, h: 0.7, fontFace: F.head, bold: true, color: C.wine, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const panel = (s, x, y, w, h, col = C.crimson) => t.rect(s, x, y, w, h, C.panel, { line: { color: col, width: 1.5 }, name: 'Panel' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.linen }; idx++;
    t.img(s, vineImg, 0, 0.08, W, 0.31); t.img(s, vineImg, 0, 4.95, W, 0.31);
    await medal(s, 5.35, 0.45, 4.45, { src: d.image });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 4.6, h: 0.3, fontSize: 12, bold: true, color: C.indigo });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.7, h: 2.3, fontFace: F.head, bold: true, fontSize: L.fit(d.title, 4.7, 2.2, 40, 22, F.head, true), color: C.wine, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 4.6, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.3, w: 4.6, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.crimson });
    t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.32, w: 8.8, h: 0.22, fontSize: 8, color: C.muted, align: 'center' });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await medal(s, 0.6, 1.4, 3.6, { src: d.image }); para(s, d.text, 4.6, 1.45, 4.8, 3.5); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.45, 4.6, 3.5); await medal(s, 5.7, 1.4, 3.6, { src: d.image, alt: true }); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        await medal(s, x, y - 0.08, 0.78, { text: i + 1, fs: 12, alt: i % 2 === 1 });
        t.text(s, it, { x: x + 0.95, y, w: 3.3, h: 0.62, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        panel(s, x, 1.5, w, h, i % 2 ? C.indigo : C.crimson);
        await medal(s, x + 0.12, 1.6, 0.8, { alt: i % 2 === 1 });
        t.img(s, await L.icon(it.icon, i % 2 ? C.indigo : C.crimson, 2.5), x + 0.41, 1.89, 0.22, 0.22);
        t.text(s, it.h, { x: x + 1.0, y: 1.6, w: w - 1.15, h: 0.8, fontFace: F.head, fontSize: L.fit(it.h, w - 1.15, 0.8, 16, 11, F.head, true), bold: true, color: C.wine, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.55, w: w - 0.4, h: h - 1.15, fontSize: 14, color: C.ink });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      t.img(s, vineImg, 0.6, 1.73, 8.8, 0.3);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await medal(s, x, 1.35, 1.05, { text: i + 1, fs: 16, alt: i % 2 === 1 });
        t.text(s, st.h, { x, y: 2.55, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.wine });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 15, 11, F.body), color: C.ink });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(2.3, cw - 0.4);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.6 + i * cw + cw / 2;
        await medal(s, cx - dd / 2, 1.3, dd, { text: x.value, fs: L.fit(x.value, dd * 0.42 - 0.05, dd * 0.3, 30, 12, F.head, true), alt: i % 2 === 1 });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.4 + dd, w: cw - 0.3, h: 0.85, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.6, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.indigo : C.crimson;
        panel(s, x, 1.45, w, 3.45, col);
        t.rect(s, x, 1.45, w, 0.55, col, { name: 'Header' });
        t.text(s, side.h, { x: x + 0.2, y: 1.45, w: w - 0.4, h: 0.55, fontFace: F.head, fontSize: 17, bold: true, color: C.linen, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.text(s, '\u273F', { x: x + 0.2, y, w: 0.35, h: 0.32, fontSize: 13, color: col }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d);
      await medal(s, 0.5, 1.6, 1.6); await medal(s, 7.9, 1.6, 1.6, { alt: true });
      t.text(s, L.runs(d.text), { x: 2.3, y: 1.4, w: 5.4, h: 2.0, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 5.4, 1.9, 32, 18, F.head, true), color: C.wine, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.6, w: 8.0, h: 1.2, fontSize: L.fit(d.caption, 8.0, 1.2, 14, 10, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      t.img(s, vineImg, 0.6, 2.2, 8.8, 0.3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.45, w: cw - 0.2, h: 0.65, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 13, F.head, true), bold: true, color: i % 2 ? C.indigo : C.crimson, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.7, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.wine });
        t.text(s, it.t, { x, y: 3.15, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.ink });
      });
    },
    async quote(d) {
      const s = await page({});
      await medal(s, 0.6, 1.2, 2.9, { text: '\u201C', fs: 54 });
      t.text(s, d.text, { x: 3.9, y: 1.2, w: 5.5, h: 2.4, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 5.5, 2.3, 30, 16, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 3.9, y: 3.75, w: 5.5, h: 0.4, fontSize: 15, bold: true, color: C.crimson });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, '\u273F', { x: 0.6, y, w: 0.4, h: rh, fontSize: 16, color: i % 2 ? C.indigo : C.crimson, valign: 'middle' });
        t.text(s, it, { x: 1.05, y, w: 8.35, h: rh, fontSize: L.fit(it, 8.35, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Suzani', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.wine, lt2: C.linen, accent1: C.crimson, accent2: C.indigo, accent3: C.gold, accent4: C.green, accent5: C.wine, accent6: C.muted, hlink: C.indigo, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "milliy va iliq: hurmatli, ravon o'zbek nutqi; madaniy merosga ehtirom bilan, lekin aniq faktlar", limits: { card_h: 20 }, prefer: null };
module.exports = { id: 46, slug: 'suzani', name: 'Suzani', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["p14:reveal|thruBlk=\"1\"", "fade", "p14:doors|dir=\"vert\""], "cover": ["fadeLetters", "riseWords"], "mark": "wheel4", "deco": "wheel", "sig": {"title": "riseWords", "body": "fade", "item": "wheel", "image": "circle", "number": "wheel4", "order": "centerOut", "stagger": 0.2}, "tempo": 1.25, "kenburns": true};
