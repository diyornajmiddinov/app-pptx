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
      t.img(s, seal, 7.95, 3.8, 1.2, 1.2);
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
  // ---- further ways to draw a type, all in the office file: a deck's pages must not look alike (L.pages)
  const PALE = 'DCE3F5', RULE = 'E5E7EB';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const serif = (s, v, x, y, w, h, o = {}) => t.text(s, String(v), { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(String(v), w, h, o.max || 18, o.min || 10, F.head, true), color: o.color || C.blue, align: o.align, valign: o.valign || 'middle' });
  // the blue folder: the file's cover seen from outside, no paper sheet
  const folderPage = (d) => {
    const s = pres.addSlide(); s.background = { color: C.blue }; idx++;
    t.text(s, `${TR.form} № ${idx}`, { x: 7.6, y: 0.2, w: 1.85, h: 0.25, fontSize: 9, italic: true, color: PALE, align: 'right' });
    const u = d.title.toUpperCase();
    t.text(s, u, { x: 0.6, y: 0.42, w: 8.8, h: 0.62, fontFace: F.head, bold: true, color: C.paper, align: 'center', valign: 'middle', fontSize: L.fit(u, 8.8, 0.6, 22, 13, F.head, true) });
    t.line(s, 0.6, 1.08, 8.8, 0, C.paper, 1.5); t.line(s, 0.6, 1.13, 8.8, 0, C.paper, 0.5);
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8, color: PALE });
    return s;
  };
  const ring = (s, x, y, dd, c = C.seal) => { t.oval(s, x, y, dd, dd, C.paper, { line: { color: c, width: 2.5 } }); t.oval(s, x + 0.06, y + 0.06, dd - 0.12, dd - 0.12, null, { line: { color: c, width: 0.75 } }); };
  const tab = (s, v, x, y, w, h = 0.3) => { t.rect(s, x, y, w, h, C.blue, { name: 'Section tab' }); head(s, v, x + 0.1, y, w - 0.2, h, { color: C.paper, max: 12 }); };
  const V = {
    image: [
      async (d) => { // a photograph pasted across the sheet, stamped, the clause under it
        const s = page(d);
        t.rect(s, 0.6, 1.3, 8.8, 1.85, C.paper, { line: { color: C.ink, width: 1 }, name: 'Photo box' });
        t.img(s, await L.photo(L.src(d.image), 8.68, 1.73), 0.66, 1.36, 8.68, 1.73, { alt: '' });
        t.img(s, seal, 8.3, 2.5, 1.1, 1.1);
        t.text(s, d.text, { x: 0.65, y: 3.26, w: 7.55, h: 1.8, fontSize: L.fit(d.text, 7.55, 1.8, 14, 10, F.body), color: C.ink, valign: 'middle' });
      },
      async (d) => { // the photo fills the desk, the form sheet lies on top of it
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 4.95, 0.18, 4.75, 5.27, C.paper, { shadow: 0.3, blur: 8, offset: 3, line: { color: 'D1D5DB', width: 0.75 }, name: 'Form sheet' });
        t.text(s, `${TR.form} № ${idx}`, { x: 7.6, y: 0.26, w: 1.9, h: 0.24, fontSize: 9, italic: true, color: C.muted, align: 'right' });
        const u = d.title.toUpperCase();
        t.text(s, u, { x: 5.15, y: 0.5, w: 4.35, h: 0.64, fontFace: F.head, bold: true, color: C.blue, valign: 'middle', fontSize: L.fit(u, 4.35, 0.62, 16, 11, F.head, true) });
        t.line(s, 5.15, 1.18, 4.35, 0, C.blue, 1.5);
        t.text(s, d.text, { x: 5.15, y: 1.26, w: 4.35, h: 3.56, fontSize: L.fit(d.text, 4.35, 3.56, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        t.rect(s, 0, 4.86, 4.95, 0.66, C.paper, { name: 'Footer ground' }); t.rect(s, 4.95, 4.86, 4.75, 0.59, C.paper, { name: 'Footer ground' });
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.3, y: 4.92, w: 9.2, h: 0.5, fontSize: 8, color: C.muted, valign: 'middle' });
      },
      async (d) => { // the blue folder: a round portrait with a seal rim, the words in white
        const s = folderPage(d), dia = 3.2, x = 6.1, y = 1.55;
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, C.paper);
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 1.3, w: 5.05, h: 3.8, fontSize: L.fit(d.text, 5.05, 3.8, 15, 10, F.body, false, 1.2), color: C.paper, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // an identity card: the 3x4 photo, the clause on rule lines, a signature below
        const s = page(d), ph = 2.75;
        await photo34(s, d.image, 7.15, 1.42, 2.1, ph);
        t.text(s, d.text, { x: 0.65, y: 1.3, w: 6.1, h: 2.98, fontSize: L.fit(d.text, 6.1, 2.98, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        t.line(s, 0.65, 4.32, 6.1, 0, C.blue, 1);
        box(s, 0.65, 4.48, 0.26, true); box(s, 1.05, 4.48, 0.26, false);
        t.text(s, TR.sign, { x: 3.2, y: 4.38, w: 2.6, h: 0.2, fontSize: 9, color: C.muted });
        t.img(s, sign, 3.2, 4.48, 1.8, 0.48); t.line(s, 3.2, 4.98, 3.55, 0, C.line, 0.75);
      },
    ],
    cards: [
      async (d) => { // sections of a form, each with a blue tab, two by two
        const s = page(d), n = d.items.length, w = 4.3, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.1);
          t.rect(s, x, y + 0.12, ww, h - 0.12, C.paper, { line: { color: C.line, width: 0.75 }, name: 'Section' });
          tab(s, `${i + 1}. ${it.h}`, x, y, Math.min(3.3, ww), 0.34);
          t.img(s, await L.icon(it.icon, C.blue, 2), x + 0.12, y + 0.52, 0.42, 0.42);
          body(s, it.t, x + 0.68, y + 0.44, ww - 0.82, h - 0.5);
        }
      },
      async (d) => { // the round seal in the middle, the clauses it certifies round it
        const s = page(d), n = d.items.length, w = 3.45, h = 1.78, cy = 3.2, dd = 1.5;
        const pos = n === 4 ? [[0.6, 1.32], [0.6, 3.24], [5.95, 1.32], [5.95, 3.24]] : [[0.6, 1.32], [0.6, 3.24], [5.95, 2.28]];
        t.img(s, seal, 5 - dd / 2, cy - dd / 2, dd, dd);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          t.rect(s, x, y, w, h, C.field, { line: { color: C.line, width: 0.75 }, name: 'Clause' });
          t.img(s, await L.icon(it.icon, C.blue, 2), x + 0.12, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.5, y + 0.06, w - 0.62, 0.38, { max: 13, color: C.blue });
          body(s, it.t, x + 0.12, y + 0.48, w - 0.24, h - 0.54);
        }
      },
      async (d) => { // the blue folder: file cards standing at different heights, a tab on each
        const s = folderPage(d), n = d.items.length, gap = 0.14, w = (8.8 - gap * (n - 1)) / n, h = 3.25;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.3 + (i % 2) * 0.52;
          t.rect(s, x, y, w, h, C.paper, { name: 'File card' });
          t.img(s, await L.icon(it.icon, C.blue, 2), x + 0.14, y + 0.12, 0.36, 0.36);
          serif(s, L.pad2(i + 1), x + w - 0.75, y + 0.12, 0.6, 0.36, { align: 'right' });
          t.line(s, x + 0.14, y + 0.54, w - 0.28, 0, C.blue, 1);
          head(s, it.h, x + 0.14, y + 0.58, w - 0.28, 0.5, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.1, w - 0.28, h - 1.18);
        }
      },
      async (d) => { // the main clause with its sub-clauses indented under it: 1, 1.1, 1.2
        const s = page(d), [a, ...rest] = d.items, n = rest.length, top = 2.5, h = (5.08 - top) / n;
        t.rect(s, 0.6, 1.32, 8.8, 1.1, C.blue, { name: 'Main clause' });
        t.img(s, await L.icon(a.icon, C.paper, 2), 0.78, 1.56, 0.6, 0.6);
        head(s, a.h, 1.55, 1.36, 2.3, 1.02, { color: C.paper, max: 15 });
        body(s, a.t, 3.95, 1.36, 5.3, 1.02, { color: C.paper, valign: 'middle', max: 13 });
        t.line(s, 1.05, 2.42, 0, h * (n - 0.5) + 0.08, C.blue, 1.5);
        for (const [i, it] of rest.entries()) {
          const y = top + i * h, my = y + h / 2;
          t.line(s, 1.05, my, 0.4, 0, C.blue, 1.5);
          serif(s, `1.${i + 1}`, 1.5, y, 0.6, h, { max: 15 });
          t.img(s, await L.icon(it.icon, C.blue, 2), 2.12, my - 0.14, 0.28, 0.28);
          head(s, it.h, 2.5, y + 0.04, 2.3, h - 0.08, { max: 13 });
          body(s, it.t, 4.85, y + 0.04, 4.55, h - 0.08, { valign: 'middle' });
          if (i < n - 1) t.line(s, 1.5, y + h, 7.9, 0, RULE, 0.75);
        }
      },
    ],
    process: [
      async (d) => { // the routing slip: each office signs one step lower down the sheet
        const s = page(d), n = d.steps.length, cw = 8.8 / n, w = cw - 0.14, h = 2.02, dy = (3.76 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, y = 1.32 + i * dy;
          t.rect(s, x, y, w, h, i === n - 1 ? C.field : C.paper, { line: { color: i === n - 1 ? C.blue : C.line, width: i === n - 1 ? 1.5 : 0.75 }, name: 'Stage' });
          box(s, x + 0.1, y + 0.13, 0.26, i < n - 1);
          serif(s, `${i + 1}.`, x + 0.42, y + 0.06, 0.36, 0.4, { max: 15 });
          head(s, st.h, x + 0.78, y + 0.04, w - 0.86, 0.46, { max: 11 });
          body(s, st.t, x + 0.1, y + 0.54, w - 0.2, h - 0.6, { max: 12 });
        }
      },
      async (d) => { // one line of checkboxes down the middle, offices on both sides of it
        const s = page(d), n = d.steps.length, h = 1.2, w = 4.05, dy = (3.76 - h) / (n - 1), Y = (i) => 1.32 + i * dy;
        t.line(s, 5, 1.32, 0, 3.76, C.blue, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.35 : 0.6, y = Y(i);
          t.line(s, right ? 5.2 : 4.65, y + 0.24, 0.15, 0, C.blue, 1.5);
          t.rect(s, x, y, w, h, C.field, { line: { color: C.line, width: 0.75 }, name: 'Office' });
          box(s, 4.8, y + 0.04, 0.4, false);
          serif(s, i + 1, 4.8, y + 0.04, 0.4, 0.4, { max: 15, align: 'center' });
          head(s, st.h, x + 0.12, y + 0.05, w - 0.24, 0.34, { color: C.blue, max: 13 });
          body(s, st.t, x + 0.12, y + 0.42, w - 0.24, h - 0.48, { max: 12 });
        }
      },
      async (d) => { // the blue folder: arrow labels in a row, the white instructions under each
        const s = folderPage(d), n = d.steps.length, cw = 8.8 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, w = cw - 0.1;
          t.shape(s, 'PENTAGON', { x, y: 1.32, w: cw - 0.03, h: 0.84, fill: { color: C.paper }, objectName: 'Label' });
          serif(s, `${i + 1}.`, x + 0.08, 1.32, 0.38, 0.84, { max: 17 });
          head(s, st.h, x + 0.46, 1.34, cw - 0.86, 0.8, { max: 12, color: C.blue });
          body(s, st.t, x + 0.06, 2.3, w - 0.1, 2.8, { color: C.paper, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // one total in a heavy double frame, sealed, two minor fields beside it
        const s = page(d), [a, b, c] = d.stats;
        t.rect(s, 0.6, 1.32, 4.9, 3.76, C.paper, { line: { color: C.blue, width: 3 }, name: 'Total' });
        t.rect(s, 0.68, 1.4, 4.74, 3.6, null, { line: { color: C.blue, width: 0.75 }, name: 'Inner rule' });
        serif(s, a.value, 0.85, 1.52, 4.4, 1.5, { max: 60, min: 24, align: 'center' });
        body(s, a.label, 0.95, 3.05, 3.15, 1.85, { valign: 'middle', max: 15 });
        t.img(s, seal, 4.08, 3.5, 1.3, 1.3);
        [b, c].forEach((x, i) => {
          const y = 1.32 + i * 1.12, w = 3.75;
          t.text(s, x.label, { x: 5.65, y, w, h: 0.46, fontSize: L.fit(x.label, w, 0.46, 11, 9, F.body), color: C.muted, valign: 'bottom' });
          serif(s, x.value, 5.65, y + 0.48, w, 0.5, { max: 24 });
          t.line(s, 5.65, y + 1.0, w, 0, C.line, 0.75);
        });
        if (d.note) body(s, `${TR.basis}: ${d.note}`, 5.65, 3.6, 3.75, 1.48, { color: C.muted, max: 12, valign: 'middle' });
      },
      async (d) => { // three round stamps, off the line, the note in small type under them
        const s = page(d), dd = 1.72, xs = [1.05, 4.14, 7.23], ys = [1.3, 1.56, 1.3];
        d.stats.forEach((x, i) => {
          ring(s, xs[i], ys[i], dd);
          serif(s, x.value, xs[i] + 0.15, ys[i], dd - 0.3, dd, { max: 28, min: 12, align: 'center', color: C.seal });
          body(s, x.label, xs[i] - 0.45, ys[i] + dd + 0.04, dd + 0.9, 0.56, { align: 'center', max: 12 });
        });
        if (d.note) { t.line(s, 0.6, 3.98, 8.8, 0, C.blue, 1); body(s, `${TR.basis}: ${d.note}`, 0.6, 4.04, 8.8, 1.04, { color: C.muted, valign: 'middle', max: 12 }); }
      },
    ],
    compare: [
      async (d) => { // a register open in two: row numbers in the middle, each side reads outward
        const s = page(d), n = Math.max(d.left.items.length, d.right.items.length), rh = 3.14 / n, cw = 3.95;
        t.rect(s, 0.6, 1.32, cw, 0.6, C.blue, { name: 'Head' }); t.rect(s, 5.45, 1.32, cw, 0.6, C.seal, { name: 'Head' });
        t.rect(s, 4.55, 1.32, 0.9, 3.76, C.field, { line: { color: C.line, width: 0.75 }, name: 'Numbers' });
        head(s, d.left.h, 0.75, 1.32, cw - 0.3, 0.6, { color: C.paper, align: 'right', max: 15 });
        head(s, d.right.h, 5.6, 1.32, cw - 0.3, 0.6, { color: C.paper, max: 15 });
        for (let k = 0; k < n; k++) {
          const y = 1.92 + k * rh;
          serif(s, k + 1, 4.55, y, 0.9, rh, { align: 'center', max: 18 });
          t.rect(s, 0.6, y, cw, rh, C.paper, { line: { color: C.line, width: 0.75 }, name: 'Cell' });
          t.rect(s, 5.45, y, cw, rh, C.paper, { line: { color: C.line, width: 0.75 }, name: 'Cell' });
          if (d.left.items[k]) body(s, d.left.items[k], 0.72, y + 0.04, cw - 0.24, rh - 0.08, { align: 'right', valign: 'middle' });
          if (d.right.items[k]) body(s, d.right.items[k], 5.57, y + 0.04, cw - 0.24, rh - 0.08, { valign: 'middle' });
        }
      },
      async (d) => { // part A above part B: a tab, then one ticked field per point
        const s = page(d), h = 1.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.32 + i * (h + 0.14), n = side.items.length, cw = 8.8 / n;
          tab(s, side.h, 0.6, y, 4.2, 0.36);
          t.rect(s, 0.6, y + 0.36, 8.8, h - 0.36, i ? C.field : C.paper, { line: { color: C.line, width: 0.75 }, name: 'Part' });
          side.items.forEach((it, k) => {
            const x = 0.6 + k * cw;
            if (k) t.line(s, x, y + 0.36, 0, h - 0.36, C.line, 0.75);
            box(s, x + 0.1, y + 0.47, 0.22, i === 1);
            body(s, it, x + 0.4, y + 0.42, cw - 0.5, h - 0.48, { valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the blue folder: the ruling alone in white type, a stamp in the corner
        const s = folderPage(d), bottom = d.caption ? 3.72 : 5.1, tw = 7.5;
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: tw, h: bottom - 1.25, fontFace: F.head, bold: true, color: C.paper, valign: 'middle', fontSize: L.fit(d.text, tw, bottom - 1.35, 34, 17, F.head, true) });
        t.oval(s, 8.1, 1.32, 1.3, 1.3, C.paper); t.img(s, seal, 8.1, 1.32, 1.3, 1.3);
        if (d.caption) { t.line(s, 0.6, 3.78, 8.8, 0, C.paper, 0.75); body(s, d.caption, 0.6, 3.86, 8.8, 1.26, { color: PALE, max: 13 }); }
      },
      async (d) => { // a decree: a blue margin rule, the words large, the signature and stamp under
        const s = page(d), bottom = d.caption ? 3.3 : 4.2;
        t.rect(s, 0.6, 1.32, 0.06, 3.74, C.blue, { name: 'Margin rule' });
        t.text(s, L.runs(d.text), { x: 0.85, y: 1.3, w: 8.5, h: bottom - 1.3, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.5, bottom - 1.4, 30, 15, F.head, true) });
        if (d.caption) body(s, d.caption, 0.85, 3.36, 8.5, 0.98, { color: C.muted, max: 12 });
        t.text(s, TR.sign, { x: 5.4, y: 4.34, w: 2.0, h: 0.2, fontSize: 9, color: C.muted });
        t.img(s, sign, 5.4, 4.46, 1.9, 0.5); t.line(s, 5.4, 4.98, 2.6, 0, C.line, 0.75);
        t.img(s, seal, 8.15, 4.0, 1.15, 1.15);
      },
    ],
    timeline: [
      async (d) => { // a double-ruled date line, fields above and below it
        const s = page(d), cy = 3.2, w = 4.3, h = 1.66;
        t.line(s, 0.6, cy - 0.02, 8.8, 0, C.blue, 1.5); t.line(s, 0.6, cy + 0.03, 8.8, 0, C.blue, 0.5);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.1, y = up ? cy - 0.12 - h : cy + 0.14;
          t.rect(s, x, y, w, h, up ? C.field : C.paper, { line: { color: C.line, width: 0.75 }, name: 'Entry' });
          serif(s, it.year, x + 0.12, y + 0.05, 1.8, 0.36, { max: 16 });
          head(s, it.h, x + 1.98, y + 0.05, w - 2.1, 0.36, { max: 12, align: 'right' });
          body(s, it.t, x + 0.12, y + 0.46, w - 0.24, h - 0.52);
        }
      },
      async (d) => { // date stamps climbing the sheet, an entry written under each
        const s = page(d), cw = 2.2, dd = 0.82;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, y = 2.62 - i * 0.43, w = cw - 0.14;
          ring(s, x, y, dd);
          serif(s, it.year, x + 0.07, y, dd - 0.14, dd, { max: 13, min: 8, align: 'center', color: C.seal });
          head(s, it.h, x, y + dd + 0.02, w, 0.34, { max: 12 });
          body(s, it.t, x, y + dd + 0.36, w, 5.08 - (y + dd + 0.36), { max: 12 });
        }
      },
      async (d) => { // the blue folder: four file cards laid in a row, the year on each
        const s = folderPage(d), cw = 8.8 / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, w = cw - 0.1;
          t.rect(s, x, 1.32, w, 3.78, C.paper, { name: 'File card' });
          serif(s, it.year, x + 0.08, 1.36, w - 0.16, 0.58, { max: 20, align: 'center' });
          t.line(s, x + 0.12, 1.96, w - 0.24, 0, C.blue, 1.5); t.line(s, x + 0.12, 2.0, w - 0.24, 0, C.blue, 0.5);
          head(s, it.h, x + 0.12, 2.04, w - 0.24, 0.42, { max: 13 });
          body(s, it.t, x + 0.12, 2.48, w - 0.24, 2.56);
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline rows looked like the process rows
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Blanka', colors: { dk1: C.ink, lt1: C.paper, dk2: C.blue, lt2: C.bg, accent1: C.blue, accent2: C.seal, accent3: 'B91C1C', accent4: C.muted, accent5: C.line, accent6: C.field, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "rasmiy hujjat tili: aniq bandlar, me'yoriy atamalar, betaraf va qisqa", limits: {}, prefer: 'text' };
module.exports = { id: 70, slug: 'blanka', name: 'Blanka', category: 'academic', photos: true, build, style: STYLE };
