/**
 * 08 Academic — university lecture: burgundy and gold, Century Schoolbook,
 * a navigation sidebar with progress, tables for data, formula box.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', burg: '7A1F2B', ink: '1D1D1F', panel: 'F4F1EE', gold: 'A8844F', muted: '5F5A57', rule: 'DDD6D0', cream: 'E9D9BC' };
const F = { head: 'Century Schoolbook', body: 'Calibri' };
const X = 2.9, CW = 6.5;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const total = content.slides.length;
  const nav = content.slides.filter((d) => !['cover', 'closing', 'quote'].includes(d.type)).map((d) => d.title);
  let idx = 0;

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.rect(s, 0, 0, 2.4, H, C.panel, { name: 'Sidebar' });
    t.text(s, content.slides[0].title, { x: 0.4, y: 0.45, w: 1.7, h: 0.75, fontFace: F.head, bold: true, fontSize: L.fit(content.slides[0].title, 1.7, 0.75, 12, 9, F.head, true), color: C.burg });
    // show at most 8 entries, a window around the current slide; long titles get an ellipsis
    const ci = Math.max(0, nav.indexOf(d.title)), start = Math.max(0, Math.min(ci - 3, nav.length - 8));
    const shown = nav.slice(start, start + 8), rh = 0.4;
    const clip = (txt, bold) => { if (L.width(txt, 10, F.body, bold) <= 1.7) return txt; let s2 = txt; while (s2.length > 3 && L.width(s2 + '\u2026', 10, F.body, bold) > 1.7) s2 = s2.slice(0, -1); return s2.trimEnd() + '\u2026'; };
    shown.forEach((n, k) => {
      const cur = start + k === ci, y = 1.4 + k * rh;
      if (cur) t.rect(s, 0.4, y + rh / 2 - 0.05, 0.1, 0.1, C.burg, { name: 'Current' });
      t.text(s, clip(n, cur), { x: 0.6, y, w: 1.75, h: rh, fontSize: 10, bold: cur, color: cur ? C.burg : C.muted, valign: 'middle' });
    });
    t.line(s, 0.4, 5.0, 1.6, 0, C.rule, 2, { name: 'Progress track' });
    t.line(s, 0.4, 5.0, (1.6 * idx) / total, 0, C.burg, 2, { name: 'Progress' });
    t.text(s, `${idx} / ${total}`, { x: 0.4, y: 5.1, w: 1.6, h: 0.25, fontSize: 9, color: C.muted });
    t.text(s, d.title, { x: X, y: 0.4, w: CW, h: 0.8, fontFace: F.head, bold: true, color: C.burg, valign: 'middle', fontSize: L.fit(d.title, CW, 0.8, 26, 18, F.head, true) });
    return s;
  };
  const tableOpts = (y, colW) => ({ x: X, y, w: CW, colW, fontFace: F.body, fontSize: 14, color: C.ink, valign: 'middle', margin: [0.08, 0.15, 0.08, 0.15], border: { type: 'solid', pt: 0.75, color: C.rule } });
  const th = (text) => ({ text, options: { bold: true, color: 'FFFFFF', fill: { color: C.burg }, fontFace: F.head } });

  const hero = (d) => {
    const s = pres.addSlide(); s.background = { color: C.burg }; idx++;
    t.oval(s, 0.7, 0.7, 1.3, 1.3, null, { line: { color: C.gold, width: 2 } });
    t.oval(s, 0.8, 0.8, 1.1, 1.1, null, { line: { color: C.gold, width: 0.75 } });
    t.text(s, d.title.trim().charAt(0).toUpperCase(), { x: 0.7, y: 0.7, w: 1.3, h: 1.3, fontFace: F.head, fontSize: 44, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    const fs = L.fit(d.title, 8.4, 1.7, 42, 26, F.head, true);
    t.text(s, d.title, { x: 0.7, y: 2.2, w: 8.4, h: 1.75, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', valign: 'bottom' });
    t.line(s, 0.7, 4.15, 8.6, 0, C.gold, 1, { name: 'Rule' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 4.3, w: 8.0, h: 0.95, fontSize: 16, color: C.cream });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), rh = Math.min(0.62, 3.7 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, `${i + 1}.`, { x: X, y, w: 0.5, h: rh, fontFace: F.head, fontSize: 18, bold: true, color: C.burg, valign: 'middle' });
        t.text(s, it, { x: X + 0.55, y, w: CW - 0.55, h: rh, fontFace: F.head, fontSize: 18, valign: 'middle' });
        t.line(s, X, y + rh, CW, 0, C.rule, 0.5, { dash: 'sysDot' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, rh = (3.6 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const y = 1.4 + i * (rh + gap);
        t.rect(s, X, y, CW, rh, C.panel, { name: 'Definition' });
        t.text(s, it.h, { x: X + 0.3, y, w: 1.9, h: rh, fontFace: F.head, fontSize: L.fit(it.h, 1.9, rh - 0.1, 17, 12, F.head, true), bold: true, color: C.burg, valign: 'middle' });
        t.text(s, it.t, { x: X + 2.4, y, w: CW - 2.7, h: rh, fontSize: 14, valign: 'middle' });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, rh = 3.6 / n, dd = 0.5;
      t.line(s, X + dd / 2, 1.45 + dd / 2, 0, rh * (n - 1), C.rule, 1.5, { name: 'Connector' });
      d.steps.forEach((st, i) => {
        const y = 1.45 + i * rh;
        t.oval(s, X, y, dd, dd, C.burg);
        t.text(s, String(i + 1), { x: X, y, w: dd, h: dd, fontFace: F.head, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: X + 0.8, y: y - 0.02, w: CW - 0.8, h: 0.34, fontFace: F.head, fontSize: 16, bold: true });
        t.text(s, st.t, { x: X + 0.8, y: y + 0.36, w: CW - 0.8, h: rh - 0.42, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d);
      const rows = [[th(TR.indicator), th(TR.note)], ...d.stats.map((x) => [
        { text: L.runs(x.value, {}), options: { fontFace: F.head, fontSize: 26, bold: true, color: C.burg } },
        { text: L.runs(x.label, {}), options: { fontSize: 15 } }])];
      s.addTable(rows, { ...tableOpts(1.45, [2.0, CW - 2.0]), rowH: [0.45, ...d.stats.map(() => 0.8)] });
      if (d.note) t.text(s, d.note, { x: X, y: 4.6, w: CW, h: 0.45, fontSize: 13, italic: true, color: C.muted });
    },
    async compare(d) {
      const s = page(d), n = Math.max(d.left.items.length, d.right.items.length);
      const rows = [[th(d.left.h), th(d.right.h)]];
      for (let k = 0; k < n; k++) rows.push([{ text: L.runs(d.left.items[k] || '') }, { text: L.runs(d.right.items[k] || '') }]);
      s.addTable(rows, { ...tableOpts(1.45, [CW / 2, CW / 2]), rowH: 0.55, fill: { color: 'FFFFFF' } });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, CW - 0.8, 0.9, 34, 20, F.body, true);
      t.rect(s, X, 1.5, CW, 1.6, 'FFFFFF', { line: { color: C.gold, width: 1.5 }, name: 'Formula box' });
      t.rect(s, X + 0.08, 1.58, CW - 0.16, 1.44, null, { line: { color: C.gold, width: 0.5 }, name: 'Inner border' });
      t.text(s, L.runs(d.text), { x: X + 0.4, y: 1.5, w: CW - 0.8, h: 1.6, fontSize: fs, bold: true, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: X, y: 3.35, w: CW, h: 1.3, fontFace: F.head, italic: true, fontSize: 15, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.6 / n, lx = X + 1.25;
      t.line(s, lx, 1.55, 0, rh * (n - 1), C.rule, 1.5, { name: 'Axis' });
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, it.year, { x: X, y: y - 0.02, w: 1.0, h: 0.38, fontFace: F.head, fontSize: L.fit(it.year, 1.0, 0.38, 18, 11, F.head, true), bold: true, color: C.burg });
        t.oval(s, lx - 0.08, y + 0.03, 0.16, 0.16, C.gold);
        t.text(s, it.h, { x: lx + 0.35, y: y - 0.02, w: CW - 1.6, h: 0.34, fontFace: F.head, fontSize: 15, bold: true });
        t.text(s, it.t, { x: lx + 0.35, y: y + 0.32, w: CW - 1.6, h: rh - 0.36, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.panel }; idx++;
      const fs = L.fit(d.text, 7.0, 2.4, 30, 18, F.head, false, 1, true);
      t.text(s, '\u201C', { x: 0.7, y: 0.6, w: 1.3, h: 1.6, fontFace: F.head, fontSize: 140, color: C.burg });
      t.text(s, d.text, { x: 2.1, y: 0.95, w: 7.0, h: 2.75, fontFace: F.head, italic: true, fontSize: fs, valign: 'bottom' });
      t.line(s, 2.1, 3.95, 0.6, 0, C.gold, 2);
      if (d.author) t.text(s, d.author, { x: 2.1, y: 4.1, w: 7.0, h: 0.4, fontSize: 14, color: C.muted });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      t.rect(s, X, 1.4, 2.95, 3.4, null, { line: { color: C.gold, width: 1.5 }, name: 'Frame' });
      await PH(s, d.image, X + 0.08, 1.48, 2.79, 3.24);
      t.text(s, d.text, { x: X + 3.2, y: 1.4, w: CW - 3.2, h: 3.4, fontSize: L.fit(d.text, CW - 3.2, 3.4, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: X, y: 1.4, w: 3.15, h: 3.4, fontSize: L.fit(d.text, 3.15, 3.4, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      t.rect(s, X + 3.4, 1.4, CW - 3.4, 3.4, null, { line: { color: C.gold, width: 1.5 }, name: 'Frame' });
      await PH(s, d.image, X + 3.48, 1.48, CW - 3.56, 3.24);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, `${i + 1}.`, { x: X, y, w: 0.45, h: rh, fontFace: F.head, fontSize: 14, bold: true, color: C.burg, valign: 'middle' });
        t.text(s, it, { x: X + 0.5, y, w: CW - 0.5, h: rh, fontSize: L.fit(it, CW - 0.5, rh - 0.04, 13, 9, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.rect(s, 6.5, 0.55, 2.95, 1.55, null, { line: { color: C.gold, width: 1.5 }, name: 'Frame' }); await PH(s, d.image, 6.57, 0.62, 2.81, 1.41); },
    closing: async (s, d) => { t.rect(s, 6.5, 0.55, 2.95, 1.55, null, { line: { color: C.gold, width: 1.5 }, name: 'Frame' }); await PH(s, d.image, 6.57, 0.62, 2.81, 1.41); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'cover' || type === 'closing' ? { x: 0.7, y: 5.2, w: 8.6, h: 0.25, color: C.cream } : type === 'quote' ? { x: 2.1, y: 5.15, w: 7.3, h: 0.25, color: C.muted } : { x: X, y: 5.15, w: CW, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Academic', colors: { dk1: C.ink, lt1: C.bg, dk2: C.burg, lt2: C.panel, accent1: C.burg, accent2: C.gold, accent3: C.muted, accent4: C.cream, accent5: '9E4A55', accent6: C.rule, hlink: C.burg, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "akademik ma'ruza: ta'riflar, atamalar va ilmiy aniqlik", "limits": {"intro": 360}, "prefer": "text"};
module.exports = { id: 8, slug: 'academic', name: 'Akademik', category: 'academic', build, style: STYLE };
