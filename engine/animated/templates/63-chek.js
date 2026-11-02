/**
 * 63 Chek — till receipts: thermal-paper slips with zigzag torn edges, monospace type,
 * dashed separators, dotted leaders, big totals, a barcode at the bottom.
 * The receipt header carries the organisation, city and year.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'DCE1E6', paper: 'FCFBF7', ink: '2B2B2B', muted: '6D6D6D', red: 'C62828', line: 'BDBDBD' };
const F = { head: 'Courier New', body: 'Courier New' };

const slip = (w, h) => { // receipt with zigzag top and bottom
  const z = 12; let top = '', bot = '';
  for (let x = 0; x <= w; x += z) { top += `L${x},${(x / z) % 2 ? z * 0.7 : 0} `; bot += `L${w - x},${h - ((x / z) % 2 ? z * 0.7 : 0)} `; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M0,0 ${top} L${w},${h} ${bot} Z" fill="#${C.paper}"/></svg>`;
};
const barcode = (w, h, seed) => { let x = seed, b = '', px = 0; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  while (px < w) { const bw = 2 + Math.floor(rnd() * 3) * 2; if (rnd() > 0.35) b += `<rect x="${px}" y="0" width="${bw}" height="${h}" fill="#${C.ink}"/>`; px += bw + 2; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${b}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const receipt = async (s, x, y, w, h) => {
    t.rect(s, x + 0.06, y + 0.08, w, h, '9AA3AD', { t: 60, name: 'Shadow' });
    t.img(s, (memo[`s${w}${h}`] ??= await L.svg(slip(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100)), x, y, w, h);
  };
  const dash = (s, x, y, w) => t.line(s, x, y, w, 0, C.line, 1, { dash: 'dash' });
  const bars = async (s, x, y, w, h, k = 1) => t.img(s, (memo[`b${w}${h}${k}`] ??= await L.svg(barcode(Math.round(w * 100), Math.round(h * 100), 7 + k), w * 100, h * 100)), x, y, w, h);
  const leader = (s, left, right, x, y, w, h, fs = 13, bold = false) => { // "item ........ value"
    t.text(s, left, { x, y, w: w - 1.0, h, fontSize: fs, bold, color: C.ink, valign: 'middle' });
    t.text(s, right, { x: x + w - 1.0, y, w: 1.0, h, fontSize: fs, bold: true, color: C.ink, align: 'right', valign: 'middle' });
  };
  const head = (s, x, y, w) => { // shop header: organisation / city, year
    t.text(s, (M.org || 'SlideAI').toUpperCase(), { x, y, w, h: 0.3, fontSize: 12, bold: true, color: C.ink, align: 'center' });
    t.text(s, [M.loc, M.year].filter(Boolean).join(', '), { x, y: y + 0.3, w, h: 0.22, fontSize: 9, color: C.muted, align: 'center' });
    dash(s, x, y + 0.58, w);
  };
  const footer = (s) => t.text(s, `${M.topic || ''}  ***  ${meta}`, { x: 0.5, y: 5.27, w: 9.0, h: 0.22, fontSize: 8, color: '4F5964' });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.3, w: 7.6, h: 0.75, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.75, 28, 16, 'Arial', true) });
    t.rect(s, 8.3, 0.4, 1.2, 0.55, C.ink, { name: 'Ticket no' });
    t.text(s, `#${String(idx).padStart(4, '0')}`, { x: 8.3, y: 0.4, w: 1.2, h: 0.55, fontSize: 14, bold: true, color: C.paper, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const thermal = async (s, src, x, y, w, h) => t.img(s, await L.photo(L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await receipt(s, 5.9, 0.2, 3.5, 5.0);
    head(s, 6.1, 0.45, 3.1);
    if (d.image) await thermal(s, d.image, 6.25, 1.15, 2.8, 2.05);
    leader(s, M.author || '', '', 6.15, 3.3, 3.0, 0.32, 11, true);
    t.text(s, '= = = = = = = = = = = =', { x: 6.15, y: 3.65, w: 3.0, h: 0.25, fontSize: 10, color: C.muted, align: 'center' });
    await bars(s, 6.45, 4.0, 2.4, 0.55, 3);
    t.text(s, d.title, { x: 0.6, y: 0.7, w: 5.0, h: 2.6, fontFace: 'Arial', bold: true, fontSize: L.fit(d.title, 5.0, 2.5, 42, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 4.9, h: 0.9, fontSize: 13, color: C.muted });
    t.text(s, `>> ${M.author || ''}`, { x: 0.6, y: 4.45, w: 4.9, h: 0.4, fontSize: 15, bold: true, color: C.red });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await receipt(s, 0.6, 1.2, 3.6, 3.95); head(s, 0.8, 1.4, 3.2); await thermal(s, d.image, 0.85, 2.1, 3.1, 2.8); t.text(s, d.text, { x: 4.6, y: 1.3, w: 4.85, h: 3.8, fontSize: L.fit(d.text, 4.85, 3.8, 15, 10, F.body, false, 1.2), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.2 }); },
    async image(d) { const s = page(d); t.text(s, d.text, { x: 0.5, y: 1.3, w: 4.85, h: 3.8, fontSize: L.fit(d.text, 4.85, 3.8, 15, 10, F.body, false, 1.2), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.2 }); await receipt(s, 5.8, 1.2, 3.6, 3.95); head(s, 6.0, 1.4, 3.2); await thermal(s, d.image, 6.05, 2.1, 3.1, 2.8); },
    async agenda(d) {
      const s = page(d), n = d.items.length; await receipt(s, 2.0, 1.15, 6.0, 4.0); head(s, 2.3, 1.35, 5.4);
      const rh = Math.min(0.45, 2.6 / n);
      d.items.forEach((it, i) => leader(s, `${i + 1} x  ${it}`, String(i + 3).padStart(2, '0'), 2.35, 2.05 + i * rh, 5.3, rh, 13));
      dash(s, 2.3, 2.1 + n * rh, 5.4);
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap);
        await receipt(s, x, 1.2, w, 3.95);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + w / 2 - 0.18, 1.45, 0.36, 0.36);
        t.text(s, it.h.toUpperCase(), { x: x + 0.15, y: 1.85, w: w - 0.3, h: 0.6, fontSize: L.fit(it.h.toUpperCase(), w - 0.3, 0.6, 13, 9, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        dash(s, x + 0.15, 2.5, w - 0.3);
        t.text(s, it.t, { x: x + 0.15, y: 2.6, w: w - 0.3, h: 2.05, fontSize: 12, color: C.ink });
        t.text(s, `${String(i + 1).padStart(2, '0')} ***`, { x: x + 0.15, y: 4.7, w: w - 0.3, h: 0.25, fontSize: 9, color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = 3.5 / n;
      d.steps.forEach((st, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `${String(i + 1).padStart(2, '0')}.`, { x: 1.15, y, w: 0.6, h: rh - 0.1, fontSize: 18, bold: true, color: C.red, valign: 'top' });
        t.text(s, st.h.toUpperCase(), { x: 1.8, y, w: 2.4, h: rh - 0.1, fontSize: 12, bold: true, color: C.ink, valign: 'top' });
        t.text(s, st.t, { x: 4.3, y, w: 4.6, h: rh - 0.1, fontSize: 12, color: C.ink, valign: 'top' });
        if (i < n - 1) dash(s, 1.15, y + rh - 0.05, 7.7);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.5 + i * (w + gap);
        await receipt(s, px, 1.2, w, 3.1);
        t.text(s, '\u2211', { x: px + 0.15, y: 1.4, w: w - 0.3, h: 0.35, fontSize: 14, bold: true, color: C.muted, align: 'center' });
        t.text(s, x.value, { x: px + 0.15, y: 1.75, w: w - 0.3, h: 1.0, fontSize: L.fit(x.value, w - 0.3, 0.95, 44, 18, F.head, true), bold: true, color: i === 0 ? C.red : C.ink, align: 'center', valign: 'middle' });
        dash(s, px + 0.15, 2.85, w - 0.3);
        t.text(s, x.label, { x: px + 0.15, y: 2.95, w: w - 0.3, h: 1.15, fontSize: 11, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.45, w: 9.0, h: 0.7, fontSize: 10, color: '4F5964' });
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.6, F.body, 0.15, 4.95 - 2.15);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.4);
        await receipt(s, x, 1.2, w, 3.95);
        t.text(s, side.h.toUpperCase(), { x: x + 0.2, y: 1.4, w: w - 0.4, h: 0.5, fontSize: 14, bold: true, color: i ? C.ink : C.red, align: 'center', valign: 'middle' });
        dash(s, x + 0.2, 1.98, w - 0.4);
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, i ? '+' : '-', { x: x + 0.2, y, w: 0.25, h: 0.3, fontSize: 14, bold: true, color: i ? C.ink : C.red }); t.text(s, it, { x: x + 0.45, y, w: w - 0.65, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = page(d); await receipt(s, 1.5, 1.15, 7.0, 4.0); head(s, 1.8, 1.35, 6.4);
      t.text(s, L.runs(d.text), { x: 1.85, y: 2.05, w: 6.3, h: 1.75, fontFace: 'Arial', bold: true, fontSize: L.fit(d.text, 6.3, 1.7, 30, 16, 'Arial', true), color: C.ink, align: 'center', valign: 'middle' });
      dash(s, 1.8, 3.85, 6.4);
      if (d.caption) t.text(s, d.caption, { x: 1.85, y: 3.95, w: 6.3, h: 1.0, fontSize: 11, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = 3.5 / n;
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, it.year, { x: 1.15, y, w: 1.4, h: rh - 0.1, fontSize: 14, bold: true, color: C.red, valign: 'top' });
        t.text(s, it.h.toUpperCase(), { x: 2.6, y, w: 2.1, h: rh - 0.1, fontSize: 12, bold: true, color: C.ink, valign: 'top' });
        t.text(s, it.t, { x: 4.75, y, w: 4.15, h: rh - 0.1, fontSize: 12, color: C.ink, valign: 'top' });
        if (i < n - 1) dash(s, 1.15, y + rh - 0.05, 7.7);
      });
    },
    async quote(d) {
      const s = page({}); await receipt(s, 2.0, 0.6, 6.0, 4.55); head(s, 2.3, 0.8, 5.4);
      t.text(s, `"${d.text}"`, { x: 2.35, y: 1.55, w: 5.3, h: 2.1, bold: true, fontSize: L.fit(d.text, 5.3, 2.0, 22, 12, F.body, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `-- ${d.author} --`, { x: 2.35, y: 3.7, w: 5.3, h: 0.35, fontSize: 12, color: C.muted, align: 'center' });
      await bars(s, 3.6, 4.15, 2.8, 0.55, 5);
    },
    async sources(d) {
      const s = page(d), n = d.items.length; await receipt(s, 0.9, 1.15, 8.2, 4.0);
      const rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 1.15, y, w: 0.55, h: rh, fontSize: 12, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.75, y, w: 7.15, h: rh, fontSize: 12, color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Chek', colors: { dk1: C.ink, lt1: C.paper, dk2: '444444', lt2: C.bg, accent1: C.red, accent2: C.ink, accent3: C.muted, accent4: '4F5964', accent5: C.line, accent6: '8D99A6', hlink: C.red, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "hisob-kitob kabi aniq: band-band sanab o'tish, raqamlar va yakuniy xulosa, ortiqcha so'zsiz", limits: {}, prefer: 'data' };
module.exports = { id: 63, slug: 'chek', name: 'Chek', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["push:u", "wipe:u", "fade"], "cover": ["typeLetters", "wipeWords"], "mark": "appear", "deco": "wipe:d", "sig": {"title": "typeLetters", "body": "wipe:d", "item": "wipe:d", "image": "wipe:d", "number": "appear", "order": "seq", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
