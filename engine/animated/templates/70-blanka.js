/**
 * 70 Blanka — official form: form number and header lines, labelled fields on rule lines,
 * checkboxes, numbered clauses, a 3x4 photo box, a round organisation seal and a signature.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'FFFFFF', bg: 'EEF0F3', ink: '1F2937', muted: '6B7280', blue: '1E3A8A', line: '9CA3AF', field: 'F3F4F6', seal: '3B4BA8' };
const F = { head: 'Times New Roman', body: 'Calibri' };

const sealSvg = (text, mid) => { const r = 88, chars = [...text.toUpperCase().slice(0, 34)]; let s = '';
  chars.forEach((ch, i) => { const a = -Math.PI / 2 + (i / Math.max(chars.length, 20)) * 2 * Math.PI * 0.95 - Math.PI * 0.45; const x = 100 + r * 0.82 * Math.cos(a), y = 100 + r * 0.82 * Math.sin(a);
    s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Arial" font-size="13" font-weight="bold" fill="#${C.seal}" text-anchor="middle" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})">${ch.replace(/[<&>]/g, '')}</text>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g opacity="0.78"><circle cx="100" cy="100" r="95" fill="none" stroke="#${C.seal}" stroke-width="4"/><circle cx="100" cy="100" r="62" fill="none" stroke="#${C.seal}" stroke-width="2"/>${s}
   <text x="100" y="106" font-family="Arial" font-size="17" font-weight="bold" fill="#${C.seal}" text-anchor="middle">${String(mid).replace(/[<&>]/g, '')}</text></g></svg>`; };
const scribble = () => `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><path d="M10,55 C40,10 60,70 85,35 S120,10 135,50 S170,65 185,30 S230,20 250,45 L290,40" fill="none" stroke="#${C.blue}" stroke-width="3" stroke-linecap="round"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const seal = await L.svg(sealSvg([M.org, M.loc].filter(Boolean).join(' * ') || 'SlideAI', M.year || ''), 200, 200);
  const sign = await L.svg(scribble(), 300, 80);
  const sheet = (s) => t.rect(s, 0.35, 0.18, 9.3, 5.27, C.paper, { shadow: 0.15, blur: 8, offset: 2, line: { color: 'D1D5DB', width: 0.75 }, name: 'Form sheet' });
  const field = (s, label, value, x, y, w, fs = 13) => { t.text(s, label, { x, y, w, h: 0.22, fontSize: 9, color: C.muted }); t.text(s, value || ' ', { x, y: y + 0.2, w, h: 0.32, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' }); t.line(s, x, y + 0.54, w, 0, C.line, 0.75); };
  const box = (s, x, y, d, on = false) => { t.rect(s, x, y, d, d, C.paper, { line: { color: C.ink, width: 1 }, name: 'Checkbox' }); if (on) t.text(s, '\u2713', { x, y: y - 0.02, w: d, h: d, fontSize: Math.round(d * 60), bold: true, color: C.blue, align: 'center', valign: 'middle' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.55, y: 5.12, w: 8.9, h: 0.22, fontSize: 8, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    sheet(s);
    t.text(s, `${TR.form} \u2116 ${idx}`, { x: 7.6, y: 0.3, w: 1.85, h: 0.25, fontSize: 9, italic: true, color: C.muted, align: 'right' });
    if (d.title) t.text(s, d.title.toUpperCase(), { x: 0.6, y: 0.5, w: 8.8, h: 0.6, fontFace: F.head, bold: true, color: C.blue, align: 'center', valign: 'middle', fontSize: L.fit(d.title.toUpperCase(), 8.8, 0.6, 22, 13, F.head, true) });
    t.line(s, 0.6, 1.15, 8.8, 0, C.blue, 1.5); t.line(s, 0.6, 1.2, 8.8, 0, C.blue, 0.5);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 15, 11, F.body, false, 1.35), color: C.ink, lineSpacingMultiple: 1.35, valign: 'top' });
  const photo34 = async (s, src, x, y, w, h) => { t.rect(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, C.paper, { line: { color: C.ink, width: 1 }, name: 'Photo box' }); t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' }); t.img(s, seal, x + w - 0.75, y + h - 0.75, 1.1, 1.1); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    sheet(s);
    t.text(s, (M.org || '').toUpperCase(), { x: 0.6, y: 0.35, w: 8.8, h: 0.3, fontFace: F.head, fontSize: 12, bold: true, color: C.ink, align: 'center' });
    t.line(s, 0.6, 0.7, 8.8, 0, C.blue, 1.5);
    t.text(s, `${TR.form} \u2116 ${idx}`, { x: 0.6, y: 0.78, w: 3, h: 0.25, fontSize: 10, italic: true, color: C.muted });
    if (d.image) await photo34(s, d.image, 7.35, 1.05, 1.85, 2.3);
    t.text(s, d.title.toUpperCase(), { x: 0.6, y: 1.1, w: 6.4, h: 1.75, fontFace: F.head, bold: true, fontSize: L.fit(d.title.toUpperCase(), 6.4, 1.7, 30, 15, F.head, true), color: C.blue, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.9, w: 6.4, h: 0.55, fontSize: 12, italic: true, color: C.muted });
    field(s, TR.author_l, M.author, 0.6, 3.55, 3.4); field(s, TR.org_l, M.org, 4.2, 3.55, 2.8, 11);
    field(s, TR.city_l, M.loc, 0.6, 4.25, 3.4); field(s, TR.year_l, M.year, 4.2, 4.25, 1.4);
    t.text(s, TR.sign, { x: 7.3, y: 4.25, w: 2.0, h: 0.22, fontSize: 9, color: C.muted }); t.img(s, sign, 7.3, 4.3, 1.8, 0.48); t.line(s, 7.3, 4.79, 2.0, 0, C.line, 0.75);
    t.text(s, M.topic || '', { x: 0.6, y: 5.12, w: 8.8, h: 0.22, fontSize: 8, color: C.muted });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo34(s, d.image, 0.75, 1.45, 2.9, 3.4); para(s, d.text, 4.05, 1.45, 5.35, 3.5); },
    async image(d) { const s = page(d); para(s, d.text, 0.65, 1.45, 5.3, 3.5); await photo34(s, d.image, 6.35, 1.45, 2.9, 3.4); },
    async agenda(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        box(s, 0.75, y + (rh - 0.26) / 2, 0.26, i === 0);
        t.text(s, `${i + 1}. ${it}`, { x: 1.2, y, w: 8.1, h: rh, fontSize: 16, color: C.ink, valign: 'middle' });
        t.line(s, 1.2, y + rh - 0.04, 8.1, 0, 'E5E7EB', 0.75);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        t.rect(s, x, 1.4, w, 3.6, C.field, { line: { color: C.line, width: 0.75 }, name: 'Section' });
        t.rect(s, x, 1.4, w, 0.6, C.blue, { name: 'Section head' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.15, 1.53, 0.34, 0.34);
        t.text(s, `${i + 1}. ${it.h}`, { x: x + 0.55, y: 1.4, w: w - 0.65, h: 0.6, fontSize: L.fit(`${i + 1}. ${it.h}`, w - 0.65, 0.58, 13, 9, F.body, true), bold: true, color: 'FFFFFF', valign: 'middle' });
        t.text(s, it.t, { x: x + 0.15, y: 2.1, w: w - 0.3, h: 2.8, fontSize: 13, color: C.ink });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, rh = 3.55 / n;
      d.steps.forEach((st, i) => {
        const y = 1.4 + i * rh;
        t.text(s, `${i + 1}.`, { x: 0.65, y, w: 0.5, h: rh - 0.08, fontFace: F.head, fontSize: 18, bold: true, color: C.blue, valign: 'top' });
        t.text(s, st.h, { x: 1.15, y, w: 2.6, h: rh - 0.08, fontSize: 14, bold: true, color: C.ink, valign: 'top' });
        t.text(s, st.t, { x: 3.85, y, w: 5.5, h: rh - 0.08, fontSize: 13, color: C.ink, valign: 'top' });
        if (i < n - 1) t.line(s, 0.65, y + rh - 0.04, 8.7, 0, 'E5E7EB', 0.75);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        t.text(s, x.label, { x: px, y: 1.4, w, h: 0.95, fontSize: 12, color: C.muted, valign: 'bottom' });
        t.rect(s, px, 2.45, w, 1.35, C.field, { line: { color: C.ink, width: 1 }, name: 'Value field' });
        t.text(s, x.value, { x: px + 0.1, y: 2.45, w: w - 0.2, h: 1.35, fontFace: F.head, fontSize: L.fit(x.value, w - 0.3, 1.2, 48, 20, F.head, true), bold: true, color: C.blue, align: 'center', valign: 'middle' });
      });
      if (d.note) t.text(s, `${TR.basis}: ${d.note}`, { x: 0.6, y: 4.0, w: 8.8, h: 1.0, fontSize: 11, italic: true, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.4;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.6, F.body, 0.12, 5.0 - 2.05);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * w;
        t.rect(s, x, 1.4, w, 0.55, i ? C.blue : C.field, { line: { color: C.line, width: 0.75 }, name: 'Column head' });
        t.text(s, side.h, { x: x + 0.15, y: 1.4, w: w - 0.3, h: 0.55, fontSize: 14, bold: true, color: i ? 'FFFFFF' : C.ink, valign: 'middle' });
        let y = 1.95;
        side.items.forEach((it, k) => { t.rect(s, x, y, w, rows[k], C.paper, { line: { color: C.line, width: 0.75 }, name: 'Cell' }); box(s, x + 0.15, y + 0.08, 0.2, i === 1); t.text(s, it, { x: x + 0.45, y: y + 0.03, w: w - 0.6, h: rows[k] - 0.06, fontSize: fs, color: C.ink, valign: 'middle' }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.9, 1.45, 8.2, 2.3, C.field, { line: { color: C.blue, width: 1.5 }, name: 'Clause' });
      t.text(s, L.runs(d.text), { x: 1.2, y: 1.5, w: 7.6, h: 2.2, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 7.6, 2.1, 30, 15, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      t.img(s, seal, 7.9, 2.9, 1.3, 1.3);
      t.text(s, TR.approved, { x: 0.9, y: 3.85, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: C.seal });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 4.15, w: 6.8, h: 0.9, fontSize: 11, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n;
      t.rect(s, 0.6, 1.4, 1.5, 3.55, C.field, { name: 'Date column' });
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, it.year, { x: 0.7, y, w: 1.3, h: rh, fontFace: F.head, fontSize: L.fit(it.year, 1.3, 0.5, 18, 10, F.head, true), bold: true, color: C.blue, valign: 'middle' });
        t.text(s, it.h, { x: 2.25, y: y + 0.05, w: 2.3, h: rh - 0.1, fontSize: 14, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: 4.65, y: y + 0.05, w: 4.7, h: rh - 0.1, fontSize: 12, color: C.ink, valign: 'middle' });
        t.line(s, 0.6, y + rh, 8.8, 0, C.line, 0.75);
      });
    },
    async quote(d) {
      const s = page({});
      t.text(s, `\u00AB${d.text}\u00BB`, { x: 1.0, y: 1.3, w: 8.0, h: 2.2, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 8.0, 2.1, 30, 15, F.head, false, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      t.text(s, TR.sign, { x: 5.6, y: 3.7, w: 3.0, h: 0.22, fontSize: 9, color: C.muted }); t.img(s, sign, 5.6, 3.8, 1.9, 0.5); t.line(s, 5.6, 4.32, 3.4, 0, C.line, 0.75);
      if (d.author) t.text(s, d.author, { x: 5.6, y: 4.35, w: 3.4, h: 0.35, fontSize: 12, bold: true, color: C.ink });
      t.img(s, seal, 3.9, 3.45, 1.4, 1.4);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      t.text(s, `${TR.basis}:`, { x: 0.65, y: 1.3, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.muted });
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.blue } }, { text: it, options: { color: C.ink } }], { x: 0.75, y: 1.6 + i * rh, w: 8.6, h: rh, fontSize: 13, valign: 'middle' }));
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Blanka', colors: { dk1: C.ink, lt1: C.paper, dk2: C.blue, lt2: C.bg, accent1: C.blue, accent2: C.seal, accent3: 'B91C1C', accent4: C.muted, accent5: C.line, accent6: C.field, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "rasmiy hujjat tili: aniq bandlar, me'yoriy atamalar, betaraf va qisqa", limits: {}, prefer: 'text' };
module.exports = { id: 70, slug: 'blanka', name: 'Blanka', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["cover:d", "fade", "wipe:d"], "cover": ["typeLetters", "fadeWords"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "wipe:r", "body": "fadeWords", "item": "wipe:r", "image": "fade", "number": "popIn", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": false};
