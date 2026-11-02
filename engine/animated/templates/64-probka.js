/**
 * 64 Probka — cork pin board: index cards and polaroids pinned with coloured push-pins,
 * red string linking ideas like an investigation board, paper strips for titles.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { cork: 'C59B63', ink: '2A2A2A', muted: '5E5A54', card: 'FFFDF7', yellow: 'FFF3A6', string: 'C62828', pins: ['E53935', '1E88E5', 'FDD835', '43A047', '8E24AA', 'FB8C00'] };
const F = { head: 'Arial', body: 'Calibri' };

const corkSvg = () => { let d = '', x = 3; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 2600; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(1 + rnd() * 3).toFixed(1)}" fill="#${rnd() > 0.5 ? '9E7340' : 'E0BC86'}" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.cork}"/>${d}<rect width="1600" height="900" fill="none" stroke="#7A5530" stroke-width="28"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(corkSvg(), 1600, 900, true);
  const pin = (s, cx, cy, k) => { t.oval(s, cx - 0.11, cy - 0.11, 0.22, 0.22, C.pins[k % 6], { line: { color: '00000033'.slice(0, 6), width: 0.5 } }); t.oval(s, cx - 0.06, cy - 0.08, 0.07, 0.06, 'FFFFFF'); };
  // paper card: slightly rotated paper (text stays straight so it can auto-fit), a pin at the top
  const card = (s, x, y, w, h, k, fill = C.card, rot = 0) => { t.rect(s, x, y, w, h, fill, { rotate: rot, shadow: 0.35, blur: 6, offset: 3, name: 'Card' }); pin(s, x + w / 2, y + 0.12, k); };
  const strings = (s, pts) => { for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, d] = pts[i]; s.addShape(t.S.LINE, { x: Math.min(a, c), y: Math.min(b, d), w: Math.abs(c - a) || 0.001, h: Math.abs(d - b) || 0.001, flipV: (c - a) * (d - b) < 0, line: { color: C.string, width: 1.5 }, objectName: 'String' }); } };
  const polaroid = async (s, src, x, y, w, h, k, rot = 0) => { t.rect(s, x, y, w, h, 'FFFFFF', { rotate: rot, shadow: 0.35, blur: 6, offset: 3, name: 'Polaroid' }); t.img(s, await L.photo(L.src(src), w - 0.24, h - 0.62), x + 0.12, y + 0.14, w - 0.24, h - 0.62, { alt: '' }); pin(s, x + w / 2, y + 0.1, k); };
  const strip = (s, txt, x, y, w, h, fs) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.3, blur: 5, offset: 2, name: 'Title strip' }); pin(s, x + 0.2, y + h / 2, 0); t.text(s, txt, { x: x + 0.45, y, w: w - 0.6, h, bold: true, fontSize: fs, color: C.ink, valign: 'middle' }); };
  const footer = (s) => { t.rect(s, 0.35, 5.2, 9.3, 0.28, C.card, { t: 15, name: 'Label' }); t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.45, y: 5.2, w: 9.1, h: 0.28, fontSize: 8.5, color: C.muted, valign: 'middle' }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.title) strip(s, d.title, 0.4, 0.3, Math.min(8.0, L.width(d.title, 24, F.head, true) + 1.0), 0.75, L.fit(d.title, 7.3, 0.7, 24, 14, F.head, true));
    card(s, 8.75, 0.3, 0.85, 0.75, idx, C.yellow);
    t.text(s, String(idx), { x: 8.75, y: 0.38, w: 0.85, h: 0.67, fontSize: 20, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const note = (s, txt, x, y, w, h, k, fill = C.card) => { card(s, x, y, w, h, k, fill); t.text(s, txt, { x: x + 0.2, y: y + 0.3, w: w - 0.4, h: h - 0.4, fontSize: L.fit(txt, w - 0.4, h - 0.4, 15, 10, F.body, false, 1.25), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.25 }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await polaroid(s, d.image, 6.3, 0.5, 3.1, 3.3, 1, 3);
    card(s, 0.6, 0.6, 5.3, 3.1, 0);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 0.85, w: 4.8, h: 0.3, fontSize: 11, bold: true, color: C.string });
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.8, h: 1.85, bold: true, fontSize: L.fit(d.title, 4.8, 1.8, 36, 18, F.head, true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.0, w: 4.8, h: 0.6, fontSize: 12, color: C.muted });
    card(s, 1.2, 4.0, 3.8, 0.8, 3, C.yellow);
    t.text(s, M.author || '', { x: 1.3, y: 4.15, w: 3.6, h: 0.6, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await polaroid(s, d.image, 0.6, 1.35, 3.6, 3.65, 1, -2); note(s, d.text, 4.6, 1.35, 4.9, 3.65, 2); strings(s, [[2.4, 1.45], [7.05, 1.47]]); },
    async image(d) { const s = page(d); note(s, d.text, 0.45, 1.35, 4.9, 3.65, 3); await polaroid(s, d.image, 5.75, 1.35, 3.6, 3.65, 4, 2); strings(s, [[2.9, 1.47], [7.55, 1.45]]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, cols = 3, rws = Math.ceil(n / cols), w = 2.85, h = (3.65 - 0.2 * (rws - 1)) / rws;
      const pts = [];
      d.items.forEach((it, i) => {
        const x = 0.55 + (i % cols) * (w + 0.2), y = 1.35 + Math.floor(i / cols) * (h + 0.2);
        card(s, x, y, w, h, i, i % 2 ? C.yellow : C.card); (pts[Math.floor(i / cols)] ??= []).push([x + w / 2, y + 0.12]);
        t.text(s, `${i + 1}`, { x: x + 0.15, y: y + 0.25, w: 0.5, h: h - 0.35, fontSize: 26, bold: true, color: C.string, valign: 'middle' });
        t.text(s, it, { x: x + 0.7, y: y + 0.25, w: w - 0.85, h: h - 0.35, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
      });
      pts.forEach((row) => strings(s, row)); // string runs along each row of cards, never across the text
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n, pts = [];
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap), y = 1.35 + (i % 2) * 0.15;
        card(s, x, y, w, 3.5, i, i % 2 ? C.yellow : C.card, i % 2 ? 1.5 : -1.5); pts.push([x + w / 2, y + 0.12]);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + 0.35, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 16, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: y + 1.45, w: w - 0.4, h: 1.9, fontSize: 13, color: C.muted });
      }
      strings(s, pts);
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap), y = 1.35 + (i % 2 ? 0.25 : 0);
        card(s, x, y, w, 3.4, i); pts.push([x + w / 2, y + 0.12]);
        t.text(s, String(i + 1), { x: x + 0.2, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 28, bold: true, color: C.string });
        t.text(s, st.h, { x: x + 0.2, y: y + 0.95, w: w - 0.4, h: 0.55, fontSize: L.fit(st.h, w - 0.4, 0.55, 15, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.2, y: y + 1.5, w: w - 0.4, h: 1.8, fontSize: 13, color: C.muted });
      });
      strings(s, pts);
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.35, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        card(s, px, 1.4, w, 2.9, i, i === 1 ? C.yellow : C.card); pts.push([px + w / 2, 1.52]);
        t.text(s, x.value, { x: px + 0.15, y: 1.65, w: w - 0.3, h: 1.2, fontSize: L.fit(x.value, w - 0.3, 1.1, 54, 22, F.head, true), bold: true, color: C.string, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 2.9, w: w - 0.4, h: 1.3, fontSize: 13, color: C.ink, align: 'center' });
      });
      strings(s, pts);
      if (d.note) { card(s, 0.5, 4.45, 9.0, 0.65, 5); t.text(s, d.note, { x: 0.7, y: 4.55, w: 8.6, h: 0.5, fontSize: 10, color: C.muted, valign: 'middle' }); }
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 5.0 - 2.15);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.4);
        card(s, x, 1.35, w, 3.75, i, i ? C.yellow : C.card);
        t.text(s, side.h, { x: x + 0.25, y: 1.55, w: w - 0.5, h: 0.55, fontSize: 17, bold: true, color: i ? C.ink : C.string, valign: 'middle' });
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, '\u2022', { x: x + 0.25, y, w: 0.25, h: 0.3, fontSize: 16, bold: true, color: C.string }); t.text(s, it, { x: x + 0.5, y, w: w - 0.7, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      });
      strings(s, [[2.65, 1.47], [7.35, 1.47]]);
    },
    async statement(d) {
      const s = page(d);
      card(s, 1.0, 1.35, 8.0, 2.6, 0, C.yellow);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.6, w: 7.2, h: 2.2, bold: true, fontSize: L.fit(d.text, 7.2, 2.1, 34, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) { card(s, 2.0, 4.1, 6.0, 1.0, 1); t.text(s, d.caption, { x: 2.2, y: 4.3, w: 5.6, h: 0.75, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' }); }
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.items.forEach((it, i) => {
        const x = 0.5 + i * (w + gap), y = 1.4 + (i % 2) * 0.2;
        card(s, x, y, w, 3.5, i); pts.push([x + w / 2, y + 0.12]);
        t.text(s, it.year, { x: x + 0.15, y: y + 0.3, w: w - 0.3, h: 0.55, fontSize: L.fit(it.year, w - 0.3, 0.5, 22, 11, F.head, true), bold: true, color: C.string, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.15, y: y + 0.9, w: w - 0.3, h: 0.5, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.t, { x: x + 0.15, y: y + 1.45, w: w - 0.3, h: 1.95, fontSize: 13, color: C.muted, align: 'center' });
      });
      strings(s, pts);
    },
    async quote(d) {
      const s = page({});
      card(s, 1.3, 1.0, 7.4, 3.4, 4);
      t.text(s, `\u201C${d.text}\u201D`, { x: 1.7, y: 1.35, w: 6.6, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 6.6, 2.2, 30, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.7, y: 3.75, w: 6.6, h: 0.45, fontSize: 14, bold: true, color: C.string, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length; card(s, 0.6, 1.3, 8.8, 3.8, 2);
      const rh = Math.min(0.56, 3.35 / n);
      for (let k = 0; k < n; k++) t.line(s, 0.8, 1.6 + (k + 1) * rh, 8.4, 0, 'B3D4F2', 0.75);
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.string } }, { text: it, options: { color: C.ink } }], { x: 0.85, y: 1.6 + i * rh, w: 8.3, h: rh, fontSize: 13, valign: 'middle' }));
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Probka', colors: { dk1: C.ink, lt1: C.card, dk2: '6B4A28', lt2: C.yellow, accent1: C.string, accent2: C.pins[1], accent3: C.pins[2], accent4: C.pins[3], accent5: C.pins[4], accent6: C.pins[5], hlink: C.pins[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tergovchi kabi: dalillar, sabab-oqibat bog'lanishlari va xulosa; qisqa va ishonchli", limits: {}, prefer: null };
module.exports = { id: 64, slug: 'probka', name: 'Probka', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "calm"], "transitions": ["cover:u", "fade", "p14:gallery|dir=\"l\""], "cover": ["swingRight", "drop"], "mark": "drop", "deco": "drop", "sig": {"title": "drop", "body": "fadeUp", "item": "swing", "image": "swingLeft", "number": "drop", "order": "diagonal", "stagger": 0.14}, "tempo": 1.05, "kenburns": false};
