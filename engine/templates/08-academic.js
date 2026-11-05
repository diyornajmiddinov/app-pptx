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
  // ---- further ways to draw a type, in this template's lecture-hall world (seal, sections, figures, bookshelf): a deck's pages must not look alike (L.pages)
  const BB = 5.0, B0 = 1.4; // the column between the title and the footer
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top', italic: o.italic });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.burg, align: o.align, valign: o.valign || 'middle' });
  const hall = (d) => { // the burgundy lecture hall: the sidebar stays, the working side turns dark
    d._night = true;
    const s = page(d);
    t.rect(s, 2.4, 0, W - 2.4, H, C.burg, { name: 'Dark side' });
    t.text(s, d.title, { x: X, y: 0.4, w: CW, h: 0.8, fontFace: F.head, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, CW, 0.8, 26, 18, F.head, true) });
    t.line(s, X, 1.24, CW, 0, C.gold, 1, { name: 'Gold rule' });
    return s;
  };
  const seal = (s, x, y, d, fill = C.burg, ring = C.gold) => { // the double ring of the title page
    t.oval(s, x, y, d, d, fill, { line: { color: ring, width: 1.75 }, name: 'Seal' });
    t.oval(s, x + d * 0.08, y + d * 0.08, d * 0.84, d * 0.84, null, { line: { color: ring, width: 0.6 }, name: 'Seal ring' });
  };
  const sealNum = (s, x, y, d, n, fill, ring, ink = 'FFFFFF') => { seal(s, x, y, d, fill, ring); t.text(s, String(n), { x, y, w: d, h: d, fontFace: F.head, bold: true, fontSize: Math.round(d * 30), color: ink, align: 'center', valign: 'middle' }); };
  const qed = (s, x, y, c = C.burg) => t.rect(s, x, y, 0.14, 0.14, c, { name: 'End mark' });
  const V = {
    image: [
      async (d) => { // a plate across the column, the text set under it like a figure's commentary
        const s = page(d), ph = 1.85;
        t.rect(s, X, B0 - 0.06, CW, ph, null, { line: { color: C.gold, width: 1.5 }, name: 'Frame' });
        await PH(s, d.image, X + 0.07, B0 + 0.01, CW - 0.14, ph - 0.14);
        t.rect(s, X, B0 + ph + 0.06, 0.05, BB - B0 - ph - 0.1, C.burg, { name: 'Margin rule' });
        t.text(s, d.text, { x: X + 0.2, y: B0 + ph + 0.04, w: CW - 0.2, h: BB - B0 - ph - 0.06, fontSize: L.fit(d.text, CW - 0.2, BB - B0 - ph - 0.08, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // the picture takes the whole working side; title and text sit on paper laid over it
        d._night = false;
        const s = page(d);
        await PH(s, d.image, 2.4, 0, W - 2.4, H);
        t.rect(s, X - 0.15, 0.32, CW + 0.3, 0.92, 'FFFFFF', { name: 'Title paper' });
        t.text(s, d.title, { x: X, y: 0.36, w: CW, h: 0.84, fontFace: F.head, bold: true, color: C.burg, valign: 'middle', fontSize: L.fit(d.title, CW, 0.82, 26, 18, F.head, true) });
        t.rect(s, X + 2.0, 2.05, CW - 1.85, 2.9, 'FFFFFF', { line: { color: C.gold, width: 1.5 }, name: 'Paper' });
        t.text(s, d.text, { x: X + 2.2, y: 2.15, w: CW - 2.25, h: 2.7, fontSize: L.fit(d.text, CW - 2.25, 2.7, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 2.4, 5.08, W - 2.4, H - 5.08, 'FFFFFF', { name: 'Footer band' });
      },
      async (d) => { // the dark hall: the picture is struck like the university seal
        const s = hall(d), dd = 3.3, x = X, y = 1.5;
        t.oval(s, x - 0.09, y - 0.09, dd + 0.18, dd + 0.18, null, { line: { color: C.gold, width: 1.75 }, name: 'Seal ring' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.text(s, d.text, { x: x + dd + 0.3, y: 1.45, w: CW - dd - 0.3, h: 3.5, fontSize: L.fit(d.text, CW - dd - 0.3, 3.5, 14, 10, F.body, false, 1.15), color: 'FFFFFF', lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // a tall window of the old hall on panelled paper
        const s = page(d), wx = X + 4.05, ww = 2.45, wy = 1.3, wh = 3.7, arch = 'M0,1 L0,0.33 C0,0.15 0.25,0.03 0.5,0 C0.75,0.03 1,0.15 1,0.33 L1,1 Z';
        t.rect(s, X, 1.9, CW, 3.1, C.panel, { name: 'Panel' });
        t.text(s, '§', { x: X + 0.2, y: 1.98, w: 0.5, h: 0.5, fontFace: F.head, bold: true, fontSize: 24, color: C.gold });
        t.text(s, d.text, { x: X + 0.2, y: 2.42, w: 3.65, h: 2.5, fontSize: L.fit(d.text, 3.65, 2.5, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1 });
        const px = Math.round(ww * 100), py = Math.round(wh * 100), sv = 'M4,' + (py - 2) + ' L4,' + Math.round(py * 0.33) + ' C4,' + Math.round(py * 0.15) + ' ' + Math.round(px * 0.25) + ',' + Math.round(py * 0.03) + ' ' + Math.round(px * 0.5) + ',3 C' + Math.round(px * 0.75) + ',' + Math.round(py * 0.03) + ' ' + (px - 4) + ',' + Math.round(py * 0.15) + ' ' + (px - 4) + ',' + Math.round(py * 0.33) + ' L' + (px - 4) + ',' + (py - 2) + ' Z';
        t.img(s, await L.photo(L.src(d.image), ww, wh, { mask: { path: arch } }), wx, wy, ww, wh, { alt: '' });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}"><path d="${sv}" fill="none" stroke="#${C.gold}" stroke-width="4"/></svg>`, px * 2, py * 2), wx, wy, ww, wh, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // index cards two by two, burgundy edge on top
        const s = page(d), n = d.items.length, gap = 0.18, w = (CW - gap) / 2, h = 1.72;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X + (i % 2) * (w + gap), y = B0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w;
          t.rect(s, x, y, ww, h, C.panel, { name: 'Index card' });
          t.rect(s, x, y, ww, 0.05, C.burg, { name: 'Card edge' });
          t.img(s, await L.icon(it.icon, C.burg, 2), x + 0.15, y + 0.17, 0.28, 0.28);
          head(s, it.h, x + 0.52, y + 0.13, ww - 0.65, 0.36, { max: 14 });
          body(s, it.t, x + 0.15, y + 0.54, ww - 0.3, h - 0.6, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // columns, each under its own seal
        const s = page(d), n = d.items.length, gap = 0.16, w = (CW - gap * (n - 1)) / n, dd = 0.8;
        t.line(s, X + w / 2, B0 + dd / 2, CW - w, 0, C.gold, 1, { name: 'Link' });
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap);
          seal(s, x + (w - dd) / 2, B0, dd);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + (w - 0.34) / 2, B0 + (dd - 0.34) / 2, 0.34, 0.34);
          head(s, it.h, x, B0 + dd + 0.08, w, 0.55, { max: 14, align: 'center' });
          body(s, it.t, x, B0 + dd + 0.66, w, BB - B0 - dd - 0.68, { align: 'center', max: 13 });
          if (i) t.line(s, x - gap / 2, B0 + dd + 0.15, 0, 2.5, C.rule, 0.75);
        }
      },
      async (d) => { // the dark hall: sheets pinned at two heights
        const s = hall(d), n = d.items.length, gap = 0.14, w = (CW - gap * (n - 1)) / n, h = 3.05;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap), y = i % 2 ? 1.95 : 1.42;
          t.rect(s, x, y, w, h, 'FFFFFF', { name: 'Sheet' });
          t.rect(s, x, y, w, 0.05, C.gold, { name: 'Sheet edge' });
          t.img(s, await L.icon(it.icon, C.burg, 2), x + 0.13, y + 0.16, 0.28, 0.28);
          head(s, it.h, x + 0.13, y + 0.48, w - 0.24, 0.55, { max: 13 });
          body(s, it.t, x + 0.13, y + 1.05, w - 0.24, h - 1.1, { color: C.ink, max: 12 });
        }
      },
      async (d) => { // a seal in the middle, the items round it joined by a cross of rules
        const s = page(d), n = d.items.length, cx = X + CW / 2, cy = 3.18, md = 1.16, w = 2.5;
        t.line(s, X + w + 0.02, cy, CW - 2 * w - 0.04, 0, C.gold, 1, { name: 'Cross' });
        t.line(s, cx, B0, 0, BB - B0, C.gold, 1, { name: 'Cross' });
        seal(s, cx - md / 2, cy - md / 2, md);
        t.text(s, '§', { x: cx - md / 2, y: cy - md / 2, w: md, h: md, fontFace: F.head, bold: true, fontSize: 34, color: 'FFFFFF', align: 'center', valign: 'middle' });
        const spots = n === 4 ? [[X, B0], [X + CW - w, B0], [X, 3.28], [X + CW - w, 3.28]] : [[X, B0], [X + CW - w, 2.33], [X, 3.28]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.gold, 2), right ? x : x + w - 0.28, y + 0.02, 0.28, 0.28);
          head(s, it.h, right ? x + 0.36 : x, y, w - 0.36, 0.32, { align: a, max: 14 });
          body(s, it.t, x, y + 0.36, w, 1.34, { align: a, max: 13, color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // a proof: premises joined by arrows, closed with the end mark
        const s = page(d), n = d.steps.length, gap = 0.3, w = (CW - gap * (n - 1)) / n, y = 1.5, h = 3.4;
        d.steps.forEach((st, i) => {
          const x = X + i * (w + gap), last = i === n - 1;
          t.rect(s, x, y, w, h, last ? C.panel : 'FFFFFF', { line: { color: last ? C.burg : C.rule, width: last ? 1.5 : 1 }, name: 'Premise' });
          t.text(s, L.pad2(i + 1), { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.55, fontFace: F.head, bold: true, fontSize: 26, color: C.gold, valign: 'middle' });
          head(s, st.h, x + 0.12, y + 0.65, w - 0.24, 0.6, { max: 14, valign: 'top' });
          body(s, st.t, x + 0.12, y + 1.27, w - 0.24, h - 1.62, { color: C.ink, max: 12 });
          if (last) qed(s, x + w - 0.26, y + h - 0.26);
          else t.text(s, '⇒', { x: x + w, y: y + h / 2 - 0.2, w: gap, h: 0.4, fontFace: F.body, bold: true, fontSize: 16, color: C.burg, align: 'center', valign: 'middle' });
        });
      },
      async (d) => { // the academic ladder: each degree stands higher than the last
        const s = page(d), n = d.steps.length, gap = 0.08, w = (CW - gap * (n - 1)) / n, top = 2.05, rise = n === 4 ? 0.22 : 0.3;
        t.line(s, X, BB, CW, 0, C.burg, 2, { name: 'Ground' });
        d.steps.forEach((st, i) => {
          const x = X + i * (w + gap), y = top - i * rise, last = i === n - 1;
          t.rect(s, x, y, w, BB - y, last ? C.burg : C.panel, { name: 'Degree' });
          t.rect(s, x, y, w, 0.06, last ? C.gold : C.burg, { name: 'Degree edge' });
          t.text(s, String(i + 1), { x: x + 0.13, y: y + 0.1, w: 0.6, h: 0.42, fontFace: F.head, bold: true, fontSize: 22, color: last ? C.cream : C.gold, valign: 'middle' });
          head(s, st.h, x + 0.13, y + 0.52, w - 0.24, 0.55, { max: 13, valign: 'top', color: last ? 'FFFFFF' : C.burg });
          body(s, st.t, x + 0.13, y + 1.08, w - 0.24, BB - y - 1.14, { color: last ? 'FFFFFF' : C.ink, max: 12 });
        });
      },
      async (d) => { // the dark hall: an argument that turns back on itself, two by two
        const s = hall(d), n = d.steps.length, gap = 0.3, w = (CW - gap) / 2, h = 1.62, y0 = 1.42;
        const spot = (i) => (i < 2 ? [X + i * (w + gap), y0] : [X + (n === 3 ? 0 : (3 - i) * (w + gap)), y0 + h + 0.24]);
        d.steps.forEach((st, i) => {
          const [x, y] = spot(i), ww = n === 3 && i === 2 ? CW : w;
          t.rect(s, x, y, ww, h, 'FFFFFF', { name: 'Sheet' });
          sealNum(s, x + 0.12, y + 0.1, 0.42, i + 1, C.burg, C.gold);
          head(s, st.h, x + 0.64, y + 0.1, ww - 0.75, 0.42, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.56, ww - 0.28, h - 0.6, { color: C.ink, max: 13 });
        });
        t.text(s, '→', { x: X + w, y: y0 + h / 2 - 0.2, w: gap, h: 0.4, fontFace: F.body, bold: true, fontSize: 16, color: C.gold, align: 'center', valign: 'middle' });
        if (n === 4) t.text(s, '←', { x: X + w, y: y0 + h + 0.24 + h / 2 - 0.2, w: gap, h: 0.4, fontFace: F.body, bold: true, fontSize: 16, color: C.gold, align: 'center', valign: 'middle' });
        const dx = n === 4 ? X + w + gap + w / 2 : X + CW / 2;
        t.text(s, '↓', { x: dx - 0.2, y: y0 + h - 0.02, w: 0.4, h: 0.28, fontFace: F.body, bold: true, fontSize: 14, color: C.gold, align: 'center', valign: 'middle' });
      },
    ],
    stats: [
      async (d) => { // the leading figure in the great seal, the other two ruled like footnotes
        const s = page(d), [a, ...rest] = d.stats, dd = d.note ? 2.2 : 2.5;
        seal(s, X, B0 + 0.02, dd);
        t.text(s, a.value, { x: X + 0.25, y: B0 + 0.02, w: dd - 0.5, h: dd, fontFace: F.head, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd - 0.55, 1, 44, 20, F.head, true) });
        body(s, a.label, X, B0 + dd + 0.08, dd, d.note ? 0.66 : 1.0, { align: 'center', color: C.ink, max: 13 });
        rest.forEach((x, i) => {
          const y = B0 + 0.02 + i * 1.28;
          t.line(s, X + 2.85, y, CW - 2.85, 0, C.burg, 1.5, { name: 'Rule' });
          t.text(s, x.value, { x: X + 2.85, y: y + 0.06, w: CW - 2.85, h: 0.56, fontFace: F.head, bold: true, color: C.burg, valign: 'middle', fontSize: L.fit(x.value, CW - 2.85, 0.56, 30, 16, F.head, true) });
          body(s, x.label, X + 2.85, y + 0.62, CW - 2.85, 0.56, { color: C.ink, max: 13 });
        });
        if (d.note) t.text(s, d.note, { x: X, y: 4.42, w: CW, h: 0.62, fontFace: F.head, italic: true, fontSize: L.fit(d.note, CW, 0.62, 12, 10, F.head, false, 1, true), color: C.muted });
      },
      async (d) => { // the dark hall: three marks in rings at stepped heights
        const s = hall(d), cw = CW / 3, dd = 1.5, top = d.note ? 1.36 : 1.45, drop = 0.16;
        d.stats.forEach((x, i) => {
          const cx = X + i * cw + cw / 2, y = top + (i === 1 ? drop : 0);
          t.oval(s, cx - dd / 2, y, dd, dd, null, { line: { color: C.gold, width: 1.75 }, name: 'Ring' });
          t.oval(s, cx - dd / 2 + 0.09, y + 0.09, dd - 0.18, dd - 0.18, null, { line: { color: C.gold, width: 0.6 }, name: 'Ring' });
          t.text(s, x.value, { x: cx - dd / 2 + 0.14, y, w: dd - 0.28, h: dd, fontFace: F.head, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.32, 0.8, 30, 14, F.head, true) });
          body(s, x.label, cx - cw / 2 + 0.1, y + dd + 0.1, cw - 0.2, d.note ? 0.82 : 1.2, { color: C.cream, align: 'center', max: 13 });
        });
        if (d.note) { t.line(s, X, 4.08, CW, 0, C.gold, 0.75); t.text(s, d.note, { x: X, y: 4.14, w: CW, h: 0.86, fontFace: F.head, italic: true, fontSize: L.fit(d.note, CW, 0.86, 12, 10, F.head, false, 1, true), color: C.cream }); }
      },
    ],
    compare: [
      async (d) => { // two theses mirrored round a rule, a seal on the axis
        const s = page(d), w = 3.0, cx = X + CW / 2, dd = 0.5;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 3.0);
        t.line(s, cx, B0, 0, BB - B0, C.gold, 1.25, { name: 'Axis' });
        seal(s, cx - dd / 2, B0 - 0.02, dd, 'FFFFFF');
        t.text(s, '≠', { x: cx - dd / 2, y: B0 - 0.02, w: dd, h: dd, fontFace: F.body, bold: true, fontSize: 17, color: C.burg, align: 'center', valign: 'middle' });
        head(s, d.left.h, X, B0, w - 0.1, 0.46, { align: 'right', max: 16 }); head(s, d.right.h, cx + 0.35, B0, w - 0.1, 0.46, { max: 16, color: C.gold });
        let y = 2.0;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: X, y, w, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.25, y, w, h: rows[k], fontSize: fs, color: C.ink });
          y += Math.max(rows[k], Math.min(0.72, 3.0 / rows.length));
        }
      },
      async (d) => { // two stacked bands: the plain sheet above, burgundy beneath, a page's heading on the spine
        const s = page(d), h = 1.74, sp = 1.5;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = B0 + i * (h + 0.12), night = i === 1, n = side.items.length, ink = night ? 'FFFFFF' : C.ink;
          t.rect(s, X, y, CW, h, night ? C.burg : C.panel, { name: 'Band' });
          head(s, side.h, X + 0.12, y + 0.1, sp - 0.2, h - 0.2, { max: 15, color: night ? C.cream : C.burg });
          t.line(s, X + sp, y + 0.14, 0, h - 0.28, C.gold, 1);
          const rh = (h - 0.16) / n;
          side.items.forEach((it, k) => {
            const yy = y + 0.08 + k * rh;
            t.rect(s, X + sp + 0.13, yy + 0.05, 0.08, 0.08, C.gold, { name: 'Bullet' });
            body(s, it, X + sp + 0.3, yy, CW - sp - 0.4, rh - 0.02, { color: ink, max: 12 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the dark hall: a section mark and the thought in large type
        const s = hall(d);
        t.text(s, '§', { x: X - 0.05, y: 1.32, w: 1.0, h: 1.3, fontFace: F.head, bold: true, fontSize: 72, color: C.gold });
        t.text(s, L.runs(d.text), { x: X + 1.0, y: 1.42, w: CW - 1.0, h: d.caption ? 2.05 : 3.4, fontFace: F.head, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, CW - 1.0, d.caption ? 2.0 : 3.3, 30, 16, F.head, true) });
        if (d.caption) { t.line(s, X + 1.0, 3.56, 0.8, 0, C.gold, 1.5); t.text(s, d.caption, { x: X + 1.0, y: 3.64, w: CW - 1.0, h: 1.36, fontSize: L.fit(d.caption, CW - 1.0, 1.36, 13, 10, F.body), color: C.cream }); }
      },
      async (d) => { // a theorem on the page, with its footnote ruled off at the foot
        const s = page(d), fh = d.caption ? 1.05 : 0, bh = 3.55 - fh - 0.1;
        t.rect(s, X, B0 + 0.05, 0.1, bh, C.burg, { name: 'Margin bar' });
        t.text(s, L.runs(d.text), { x: X + 0.32, y: B0, w: CW - 0.32, h: bh + 0.1, fontFace: F.head, italic: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, CW - 0.4, bh, 28, 16, F.head, false, 1, true) });
        qed(s, X + CW - 0.14, B0 + bh - 0.1);
        if (d.caption) {
          t.line(s, X, BB - fh, 1.6, 0, C.burg, 1, { name: 'Footnote rule' });
          t.text(s, d.caption, { x: X, y: BB - fh + 0.06, w: CW, h: fh - 0.06, fontSize: L.fit(d.caption, CW, fh - 0.08, 12, 10, F.body), color: C.muted });
        }
      },
    ],
    timeline: [
      async (d) => { // a ruler across the column, each date a tick, the events under it
        const s = page(d), n = d.items.length, cw = CW / n, ly = 2.05;
        t.line(s, X, ly, CW, 0, C.burg, 2, { name: 'Axis' });
        d.items.forEach((it, i) => {
          const x = X + i * cw;
          t.text(s, it.year, { x, y: B0, w: cw - 0.12, h: 0.55, fontFace: F.head, bold: true, color: C.burg, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.14, 0.5, 20, 11, F.head, true) });
          t.line(s, x, ly - 0.09, 0, 0.3, C.burg, 2, { name: 'Tick' });
          head(s, it.h, x + 0.0, ly + 0.26, cw - 0.14, 0.52, { max: 14, valign: 'top', color: C.ink });
          body(s, it.t, x, ly + 0.8, cw - 0.14, BB - ly - 0.82, { max: 12 });
        });
      },
      async (d) => { // a central spine, events to either side, like a chronological table folded open
        const s = page(d), cx = X + CW / 2, w = 2.95;
        t.line(s, cx, B0, 0, BB - B0, C.gold, 2, { name: 'Spine' });
        d.items.forEach((it, i) => {
          const right = i % 2 === 1, y = B0 + Math.floor(i / 2) * 1.82 + (right ? 0.34 : 0), x = right ? cx + 0.3 : X, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.09, y + 0.09, 0.18, 0.18, right ? C.gold : C.burg);
          t.text(s, [{ text: it.year + '  ', options: { color: C.gold, bold: true } }, { text: it.h, options: { color: C.burg, bold: true } }], { x, y, w: w - 0.05, h: 0.36, fontFace: F.head, fontSize: L.fit(`${it.year}  ${it.h}`, w - 0.05, 0.34, 14, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.38, w - 0.05, 1.08, { align: a, max: 13, color: C.ink });
        });
      },
      async (d) => { // a shelf of the library: each period one standing volume, spines of unequal height
        const s = page(d), n = d.items.length, gap = 0.07, w = (CW - gap * (n - 1)) / n, tones = [C.burg, '5C1620', '8A2C39', '4A1119'], tops = [1.72, 1.42, 1.6, 1.46];
        t.rect(s, X - 0.1, BB, CW + 0.2, 0.07, C.gold, { name: 'Shelf' });
        d.items.forEach((it, i) => {
          const x = X + i * (w + gap), y = tops[i % 4];
          t.rect(s, x, y, w, BB - y, tones[i % 4], { name: 'Volume' });
          t.rect(s, x, y + 0.1, w, 0.03, C.gold, { name: 'Band' }); t.rect(s, x, y + 0.62, w, 0.03, C.gold, { name: 'Band' });
          t.text(s, it.year, { x: x + 0.08, y: y + 0.15, w: w - 0.16, h: 0.45, fontFace: F.head, bold: true, color: C.cream, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.18, 0.42, 18, 11, F.head, true) });
          head(s, it.h, x + 0.1, y + 0.7, w - 0.2, 0.5, { color: 'FFFFFF', max: 13, valign: 'top' });
          body(s, it.t, x + 0.1, y + 1.22, w - 0.2, BB - y - 1.28, { color: 'F4E9D8', max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline (dots on a vertical line) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'cover' || type === 'closing' ? { x: 0.7, y: 5.2, w: 8.6, h: 0.25, color: C.cream } : d._night ? { x: X, y: 5.15, w: CW, h: 0.25, color: C.cream } : type === 'quote' ? { x: 2.1, y: 5.15, w: 7.3, h: 0.25, color: C.muted } : { x: X, y: 5.15, w: CW, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Academic', colors: { dk1: C.ink, lt1: C.bg, dk2: C.burg, lt2: C.panel, accent1: C.burg, accent2: C.gold, accent3: C.muted, accent4: C.cream, accent5: '9E4A55', accent6: C.rule, hlink: C.burg, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "akademik ma'ruza: ta'riflar, atamalar va ilmiy aniqlik", "limits": {"intro": 360}, "prefer": "text"};
module.exports = { id: 8, slug: 'academic', name: 'Akademik', category: 'academic', build, style: STYLE };
