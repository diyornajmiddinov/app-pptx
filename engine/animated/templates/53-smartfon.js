/**
 * 53 Smartfon — mobile app UI: phone mock-ups with the photo as a post, settings-style
 * agenda rows with chevrons, widget stats, chat bubbles for statements and quotes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'EEF1F6', bezel: '111318', screen: 'FFFFFF', ink: '1D2433', muted: '6B7385', blue: '2F7BFF', green: '34C759', orange: 'FF9500', pink: 'FF2D55', bubble: 'E6E9F0', line: 'DDE1E8' };
const F = { head: 'Arial', body: 'Calibri' };
const ACC = [C.blue, C.green, C.orange, C.pink, '8E5CF7', '00B8D9'];

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const card = (s, x, y, w, h, fill = C.screen) => t.rect(s, x, y, w, h, fill, { r: 0.18, shadow: 0.12, blur: 10, offset: 2, shadowColor: '5A6478', name: 'App card' });
  // phone frame with an app header and the photo as a post
  const phone = async (s, src, x, y, h, caption) => {
    const w = h * 0.52;
    t.rect(s, x, y, w, h, C.bezel, { r: 0.32, shadow: 0.25, blur: 14, offset: 4, name: 'Phone' });
    t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, C.screen, { r: 0.26, name: 'Screen' });
    t.rect(s, x + w / 2 - 0.35, y + 0.12, 0.7, 0.12, C.bezel, { r: 0.06, name: 'Notch' });
    t.oval(s, x + 0.22, y + 0.38, 0.32, 0.32, C.blue);
    t.text(s, (M.author || 'SlideAI').split(' ')[0], { x: x + 0.6, y: y + 0.38, w: w - 0.8, h: 0.32, fontSize: 10, bold: true, color: C.ink, valign: 'middle' });
    const ph = w - 0.16;
    t.img(s, await L.photo(L.src(src), ph, ph * 1.05), x + 0.08, y + 0.8, ph, ph * 1.05, { alt: '' });
    t.text(s, '\u2665  \u25CB  \u27A4', { x: x + 0.22, y: y + 0.85 + ph * 1.05, w: w - 0.4, h: 0.3, fontSize: 12, color: C.ink });
    if (caption) t.text(s, caption, { x: x + 0.22, y: y + 1.15 + ph * 1.05, w: w - 0.44, h: h - 1.35 - ph * 1.05, fontSize: 9, color: C.muted });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.text(s, '\u2039', { x: 0.45, y: 0.33, w: 0.4, h: 0.65, fontSize: 30, color: C.blue, valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.9, y: 0.35, w: 7.4, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.4, 0.65, 28, 16, F.head, true) });
    t.rect(s, 8.55, 0.45, 0.9, 0.42, C.screen, { r: 0.21, name: 'Pill' });
    t.text(s, `${idx}/${content.slides.length}`, { x: 8.55, y: 0.45, w: 0.9, h: 0.42, fontSize: 11, bold: true, color: C.muted, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const bubble = (s, txt, x, y, w, h, out = false, fs = 15) => {
    t.rect(s, x, y, w, h, out ? C.blue : C.bubble, { r: 0.22, name: 'Chat bubble' });
    t.text(s, txt, { x: x + 0.25, y: y + 0.12, w: w - 0.5, h: h - 0.24, fontSize: fs, color: out ? 'FFFFFF' : C.ink, valign: 'middle' });
  };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await phone(s, d.image, 6.9, 0.3, 4.75, d.subtitle);
    t.rect(s, 0.6, 0.65, 2.6, 0.4, C.screen, { r: 0.2, name: 'Pill' });
    t.text(s, [M.org, M.year].filter(Boolean).join(' \u2022 '), { x: 0.6, y: 0.65, w: 2.6, h: 0.4, fontSize: 11, bold: true, color: C.blue, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 0.6, y: 1.25, w: 5.8, h: 2.1, bold: true, fontSize: L.fit(d.title, 5.8, 2.0, 42, 22, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 5.6, h: 0.75, fontSize: 14, color: C.muted });
    t.rect(s, 0.6, 4.35, 3.4, 0.55, C.blue, { r: 0.27, name: 'Button' });
    t.text(s, [M.author, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 4.35, w: 3.4, h: 0.55, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await phone(s, d.image, 0.9, 1.15, 3.95); card(s, 3.4, 1.35, 6.05, 3.65); para(s, d.text, 3.7, 1.5, 5.45, 3.35); },
    async image(d) { const s = page(d); card(s, 0.55, 1.35, 6.05, 3.65); para(s, d.text, 0.85, 1.5, 5.45, 3.35); await phone(s, d.image, 7.0, 1.15, 3.95); },
    async agenda(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      card(s, 0.55, 1.35, 8.9, rh * n + 0.1);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.rect(s, 0.75, y + (rh - 0.38) / 2, 0.38, 0.38, ACC[i % 6], { r: 0.1, name: 'Icon' });
        t.text(s, String(i + 1), { x: 0.75, y: y + (rh - 0.38) / 2, w: 0.38, h: 0.38, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.3, y, w: 7.4, h: rh, fontSize: 16, color: C.ink, valign: 'middle' });
        t.text(s, '\u203A', { x: 8.9, y, w: 0.4, h: rh, fontSize: 22, color: C.muted, valign: 'middle' });
        if (i < n - 1) t.line(s, 1.3, y + rh, 8.0, 0, C.line, 0.75);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.22, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap);
        card(s, x, 1.35, w, 3.65);
        t.rect(s, x + 0.2, 1.55, 0.55, 0.55, ACC[i % 6], { r: 0.14, name: 'App icon' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2.25), x + 0.33, 1.68, 0.29, 0.29);
        t.text(s, it.h, { x: x + 0.2, y: 2.25, w: w - 0.4, h: 0.55, fontSize: L.fit(it.h, w - 0.4, 0.55, 17, 12, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.85, w: w - 0.4, h: 2.0, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.9 / n;
      d.steps.forEach((st, i) => {
        const x = 0.55 + i * cw;
        card(s, x, 1.35, cw - 0.2, 3.65);
        for (let k = 0; k < n; k++) t.oval(s, x + 0.25 + k * 0.22, 1.6, 0.13, 0.13, k === i ? C.blue : C.line);
        t.text(s, `${i + 1}`, { x: x + 0.2, y: 1.9, w: 0.8, h: 0.6, fontSize: 30, bold: true, color: C.blue });
        t.text(s, st.h, { x: x + 0.2, y: 2.55, w: cw - 0.6, h: 0.55, fontSize: L.fit(st.h, cw - 0.6, 0.55, 16, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.2, y: 3.15, w: cw - 0.6, h: 1.7, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (8.9 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.55 + i * (w + gap);
        card(s, px, 1.35, w, 2.9);
        t.oval(s, px + 0.25, 1.55, 0.22, 0.22, ACC[i % 6]);
        t.text(s, x.value, { x: px + 0.25, y: 1.85, w: w - 0.5, h: 1.15, fontSize: L.fit(x.value, w - 0.5, 1.05, 48, 22, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, x.label, { x: px + 0.25, y: 3.05, w: w - 0.5, h: 1.05, fontSize: 13, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.35, w: 8.8, h: 0.75, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 1.0, F.body, 0.32, 4.95 - 2.0);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.55 + i * (w + 0.3);
        t.text(s, side.h, { x, y: 1.35, w, h: 0.5, fontSize: 16, bold: true, color: i ? C.blue : C.muted, align: i ? 'right' : 'left' });
        let y = 2.0;
        side.items.forEach((it, k) => { const bw = Math.min(w, L.width(it, fs, F.body) + 0.6); bubble(s, it, i ? x + w - bw : x, y, bw, rows[k] - 0.1, i === 1, fs); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      bubble(s, d.text, 1.0, 1.45, 7.0, 2.0, true, L.fit(d.text, 6.5, 1.75, 30, 16, F.body, true));
      if (d.caption) bubble(s, d.caption, 2.6, 3.6, 6.8, 1.35, false, 13);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.65 / n;
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, it.year, { x: 0.55, y, w: 1.4, h: 0.35, fontSize: 11, bold: true, color: C.muted });
        bubble(s, `${it.h} \u2014 ${it.t}`, i % 2 ? 2.3 : 0.55, y + 0.3, 7.15, rh - 0.38, i % 2 === 1, 13);
      });
    },
    async quote(d) {
      const s = page({});
      card(s, 1.5, 1.2, 7.0, 3.0);
      t.rect(s, 1.75, 1.45, 0.55, 0.55, C.green, { r: 0.14, name: 'App icon' });
      t.text(s, '\u201C', { x: 1.75, y: 1.45, w: 0.55, h: 0.55, fontSize: 26, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      t.text(s, d.author || '', { x: 2.45, y: 1.45, w: 5.8, h: 0.55, fontSize: 13, bold: true, color: C.ink, valign: 'middle' });
      t.text(s, d.text, { x: 1.75, y: 2.15, w: 6.5, h: 1.85, fontSize: L.fit(d.text, 6.5, 1.8, 26, 14, F.body), color: C.ink, valign: 'top' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      card(s, 0.55, 1.35, 8.9, rh * n + 0.1);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, '\u2197', { x: 0.75, y, w: 0.35, h: rh, fontSize: 14, bold: true, color: C.blue, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.05, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
        if (i < n - 1) t.line(s, 1.2, y + rh, 8.05, 0, C.line, 0.75);
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Smartfon', colors: { dk1: C.ink, lt1: C.screen, dk2: C.bezel, lt2: C.bg, accent1: C.blue, accent2: C.green, accent3: C.orange, accent4: C.pink, accent5: ACC[4], accent6: ACC[5], hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "zamonaviy va suhbatdosh: foydalanuvchiga to'g'ridan-to'g'ri murojaat, qisqa xabarlar kabi", limits: {}, prefer: null };
module.exports = { id: 53, slug: 'smartfon', name: 'Smartfon', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "playful"], "transitions": ["push:l", "push:u", "morph"], "cover": ["springIn", "popOver"], "mark": "popOver", "deco": "riseUp", "sig": {"title": "springIn", "body": "riseUp", "item": "riseSettle", "image": "springIn", "number": "popOver", "order": "seq", "stagger": 0.12}, "tempo": 0.85, "kenburns": false};
