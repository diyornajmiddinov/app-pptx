/**
 * 51 Akvarel — watercolour: soft pigment washes with ragged, blooming edges on cotton paper,
 * brush-stroke lines, delicate serif titles. Text sits on light washes, never on dark paint.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'FBF8F2', ink: '33302C', muted: '6A645C', washes: ['E8A0A8', 'F4C095', 'A8C3A0', '9CC3DE', 'C3B1E1', 'E8D5A9'] };
const F = { head: 'Cambria', body: 'Calibri' };

const wash = (w, h, color, seed, op = 0.55) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>
  <filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="${seed}"/>
  <feDisplacementMap in="SourceGraphic" scale="${Math.min(w, h) * 0.12}"/><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="e"><feMorphology operator="erode" radius="3"/><feGaussianBlur stdDeviation="6"/></filter></defs>
  <g filter="url(#r)"><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.42}" ry="${h * 0.4}" fill="#${color}" fill-opacity="${op}"/>
  <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.42}" ry="${h * 0.4}" fill="none" stroke="#${color}" stroke-opacity="0.55" stroke-width="${Math.min(w, h) * 0.02}"/>
  <ellipse cx="${w * 0.45}" cy="${h * 0.42}" rx="${w * 0.2}" ry="${h * 0.16}" fill="#${color}" fill-opacity="0.25"/></g></svg>`;
const stroke = (w, h, color, seed) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="r"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${h * 0.45}"/></filter></defs>
  <path d="M${h},${h / 2} C${w * 0.3},${h * 0.2} ${w * 0.7},${h * 0.8} ${w - h},${h / 2}" stroke="#${color}" stroke-width="${h * 0.42}" stroke-linecap="round" stroke-opacity="0.6" fill="none" filter="url(#r)"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const wsh = async (s, x, y, w, h, k, seed = 1, op) => t.img(s, (memo[`w${w}${h}${k}${seed}${op}`] ??= await L.svg(wash(Math.round(w * 100), Math.round(h * 100), C.washes[k % 6], seed, op), w * 100, h * 100)), x, y, w, h);
  const brush = async (s, x, y, w, k, seed = 3) => t.img(s, (memo[`s${w}${k}${seed}`] ??= await L.svg(stroke(Math.round(w * 100), 40, C.washes[k % 6], seed), w * 100, 40)), x, y, w, 0.4);
  const photo = async (s, src, x, y, d, k) => { await wsh(s, x - 0.35, y - 0.3, d + 0.7, d + 0.6, k, 7, 0.6); t.img(s, await L.photo(L.src(src), d, d, { mask: 'circle' }), x, y, d, d, { alt: '' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   ~   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.head, italic: true, fontSize: 9, color: C.muted, align: 'center' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await wsh(s, 0.3, 0.15, 1.1, 1.0, idx, idx);
    t.text(s, String(idx), { x: 0.4, y: 0.3, w: 0.9, h: 0.7, fontFace: F.head, fontSize: 24, italic: true, color: C.ink, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.7, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 30, 16, F.head) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await wsh(s, 5.4, -0.6, 5.2, 4.2, 3, 11, 0.45); await wsh(s, -1.0, 3.3, 4.6, 3.0, 0, 5, 0.4); await wsh(s, 7.6, 3.4, 3.0, 2.6, 2, 9, 0.45);
    if (d.image) await photo(s, d.image, 6.35, 0.85, 2.9, 3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  ~  '), { x: 0.7, y: 0.8, w: 5.3, h: 0.3, fontFace: F.head, italic: true, fontSize: 13, color: C.muted });
    t.text(s, d.title, { x: 0.7, y: 1.15, w: 5.3, h: 2.2, fontFace: F.head, fontSize: L.fit(d.title, 5.3, 2.1, 42, 22, F.head), color: C.ink, valign: 'bottom' });
    await brush(s, 0.6, 3.4, 2.6, 0, 4);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.8, w: 5.2, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.7, y: 4.55, w: 5.2, h: 0.4, fontFace: F.head, italic: true, fontSize: 17, color: C.ink });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photo(s, d.image, 0.95, 1.55, 3.2, 1); para(s, d.text, 4.7, 1.35, 4.7, 3.65); },
    async image(d) { const s = await page(d); para(s, d.text, 0.7, 1.35, 4.6, 3.65); await photo(s, d.image, 5.95, 1.55, 3.2, 4); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.4 + (i % per) * rh;
        await wsh(s, x - 0.1, y - 0.08, 0.85, 0.8, i, i + 2);
        t.text(s, String(i + 1), { x: x - 0.1, y: y - 0.08, w: 0.85, h: 0.8, fontFace: F.head, italic: true, fontSize: 20, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.9, y, w: 3.3, h: 0.66, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.15, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        await wsh(s, x - 0.1, 1.3, w + 0.2, 3.75, i, 20 + i, 0.32);
        t.img(s, await L.icon(it.icon, C.ink, 1.5), x + w / 2 - 0.2, 1.75, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.3, y: 2.25, w: w - 0.6, h: 0.55, fontFace: F.head, fontSize: L.fit(it.h, w - 0.6, 0.55, 18, 12, F.head), color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.t, { x: x + 0.35, y: 2.85, w: w - 0.7, h: 1.75, fontSize: 14, color: C.ink, align: 'center' });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      await brush(s, 0.8, 1.6, 8.4, 5, 8);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await wsh(s, x, 1.35, 0.95, 0.9, i, 30 + i, 0.7);
        t.text(s, String(i + 1), { x, y: 1.35, w: 0.95, h: 0.9, fontFace: F.head, italic: true, fontSize: 22, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.25, h: 0.55, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.25, 0.55, 18, 12, F.head), color: C.ink });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.25, h: 2.0, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await wsh(s, px, 1.3, cw - 0.2, 1.75, i, 40 + i, 0.6);
        t.text(s, x.value, { x: px + 0.2, y: 1.3, w: cw - 0.6, h: 1.75, fontFace: F.head, fontSize: L.fit(x.value, cw - 0.8, 1.2, 54, 24, F.head), color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.1, y: 3.15, w: cw - 0.4, h: 1.1, fontSize: 14, color: C.muted, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.35, w: 8.8, h: 0.65, fontFace: F.head, italic: true, fontSize: 11, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 1.0, F.body, 0.18, 4.75 - 2.35);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4);
        await wsh(s, x - 0.1, 1.3, w + 0.2, 3.7, i ? 3 : 0, 50 + i, 0.3);
        t.text(s, side.h, { x: x + 0.4, y: 1.65, w: w - 0.8, h: 0.55, fontFace: F.head, fontSize: 20, italic: true, color: C.ink, valign: 'middle' });
        let y = 2.35;
        side.items.forEach((it, k) => { t.text(s, '~', { x: x + 0.4, y, w: 0.25, h: 0.3, fontFace: F.head, fontSize: 16, color: C.muted }); t.text(s, it, { x: x + 0.7, y, w: w - 1.0, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await wsh(s, 0.8, 1.2, 8.4, 2.6, 4, 60, 0.4);
      t.text(s, L.runs(d.text), { x: 1.5, y: 1.4, w: 7.0, h: 2.2, fontFace: F.head, fontSize: L.fit(d.text, 7.0, 2.1, 34, 18, F.head), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: 14, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      await brush(s, 0.6, 2.05, 8.8, 2, 12);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.65, fontFace: F.head, italic: true, fontSize: L.fit(it.year, cw - 0.3, 0.6, 28, 13, F.head), color: C.ink, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.25, h: 0.5, fontFace: F.head, fontSize: 17, color: C.ink });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.25, h: 1.9, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await wsh(s, 1.0, 0.8, 8.0, 3.6, 1, 70, 0.35);
      t.text(s, d.text, { x: 1.7, y: 1.2, w: 6.6, h: 2.5, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 6.6, 2.4, 32, 16, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.7, y: 3.85, w: 6.6, h: 0.45, fontFace: F.head, fontSize: 15, color: C.muted, align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.4 + i * rh;
        await wsh(s, 0.55, y + (rh - 0.4) / 2, 0.45, 0.4, i, 80 + i, 0.7);
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      }
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Akvarel', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '4A453F', lt2: C.paper, accent1: C.washes[0], accent2: C.washes[1], accent3: C.washes[2], accent4: C.washes[3], accent5: C.washes[4], accent6: C.washes[5], hlink: '5B7FA6', folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yumshoq va samimiy: ravon, iliq tushuntirish, obrazli lekin aniq", limits: {}, prefer: null };
module.exports = { id: 51, slug: 'akvarel', name: 'Akvarel', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["dissolve", "fade", "p14:reveal|thruBlk=\"0\""], "cover": ["fadeWords", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "focusIn", "body": "fade", "item": "dissolve", "image": "dissolve", "number": "softGrow", "order": "diagonal", "stagger": 0.2}, "tempo": 1.3, "kenburns": true};
