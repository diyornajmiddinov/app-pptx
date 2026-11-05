/**
 * 14 Klinika — clean, calm, medical/healthcare look: white and mint, teal pills,
 * very round shapes, plus-sign motif, Calibri.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', teal: '0E9F8E', mint: 'E7F6F3', deep: '0B3B3C', gray: '5F7272', coral: 'F28B6B', line: 'CFE7E2' };
const F = { head: 'Calibri', body: 'Calibri' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const pill = (s, x, y, w, h, fill, o = {}) => t.rect(s, x, y, w, h, fill, { r: h / 2, ...o, name: o.name || 'Pill' });
  const plus = (s, x, y, d, color) => t.shape(s, 'MATH_PLUS', { x, y, w: d, h: d, fill: { color }, objectName: 'Plus' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    pill(s, 0.6, 0.45, 0.75, 0.34, C.mint);
    t.text(s, L.pad2(idx), { x: 0.6, y: 0.45, w: 0.75, h: 0.34, fontSize: 12, bold: true, color: C.teal, align: 'center', valign: 'middle' });
    plus(s, 8.75, 0.4, 0.32, C.mint); plus(s, 9.1, 0.65, 0.2, C.teal);
    t.text(s, d.title, { x: 0.6, y: 0.88, w: 8.6, h: 0.72, fontFace: F.head, bold: true, color: C.deep, valign: 'middle', fontSize: L.fit(d.title, 8.6, 0.72, 28, 20, F.head, true) });
    return s;
  };
  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.rect(s, 5.6, 0.5, 3.9, 4.6, C.mint, { r: 0.45, name: 'Panel' });
    t.oval(s, 6.45, 1.35, 2.2, 2.2, C.teal);
    plus(s, 7.0, 1.9, 1.1, 'FFFFFF');
    pill(s, 6.05, 4.0, 1.6, 0.4, C.teal, { t: 0 }); pill(s, 7.8, 4.0, 1.2, 0.4, C.coral);
    plus(s, 8.75, 0.85, 0.35, C.teal);
    const fs = L.fit(d.title, 4.6, 2.3, 44, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.6, h: 2.45, fontSize: fs, bold: true, color: C.deep, valign: 'bottom' });
    t.rect(s, 0.6, 3.55, 0.8, 0.08, C.teal, { r: 0.04, name: 'Accent' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.8, w: 4.6, h: 1.2, fontSize: 16, color: C.gray });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(0.95, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.8 + (i % per) * rh;
        pill(s, x, y, 4.2, rh - 0.22, C.mint);
        t.oval(s, x + 0.1, y + 0.08, rh - 0.38, rh - 0.38, C.teal);
        t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.08, w: rh - 0.38, h: rh - 0.38, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + rh - 0.1, y, w: 4.2 - rh, h: rh - 0.22, fontSize: 17, color: C.deep, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.42, 18, 13, F.head, true)));
      const h = Math.min(3.25, 1.6 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.8;
        t.rect(s, x, y, w, h, C.mint, { r: 0.28, name: 'Card' });
        t.oval(s, x + 0.3, y + 0.3, 0.68, 0.68, 'FFFFFF');
        t.img(s, await L.icon(it.icon, C.teal, 2), x + 0.47, y + 0.47, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: 0.42, fontSize: hfs, bold: true, color: C.deep });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.6, w: w - 0.6, h: h - 1.75, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, w - 0.9, 0.5, 17, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap);
        pill(s, x, 1.85, w, 0.62, i === n - 1 ? C.coral : C.teal);
        t.oval(s, x + 0.08, 1.93, 0.46, 0.46, 'FFFFFF');
        t.text(s, String(i + 1), { x: x + 0.08, y: 1.93, w: 0.46, h: 0.46, fontSize: 15, bold: true, color: i === n - 1 ? C.coral : C.teal, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: x + 0.65, y: 1.85, w: w - 0.8, h: 0.62, fontSize: hfs, bold: true, color: 'FFFFFF', valign: 'middle' });
        t.text(s, st.t, { x: x + 0.1, y: 2.75, w: w - 0.2, h: 2.0, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        t.rect(s, px, 1.85, w, 2.3, i === 1 ? C.teal : C.mint, { r: 0.28, name: 'Stat' });
        t.text(s, x.value, { x: px + 0.35, y: 2.0, w: w - 0.7, h: 1.0, fontSize: L.fit(x.value, w - 0.7, 1.0, 48, 26, F.head, true), bold: true, color: i === 1 ? 'FFFFFF' : C.teal, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.35, y: 3.1, w: w - 0.7, h: 0.95, fontSize: 15, color: i === 1 ? 'FFFFFF' : C.deep });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.5, fontSize: 14, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.15, y = 1.8;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 1.0, F.body, 0, h - 1.05 - 0.18 * Math.max(d.left.items.length, d.right.items.length));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), fg = i ? 'FFFFFF' : C.deep;
        t.rect(s, x, y, w, h, i ? C.teal : C.mint, { r: 0.28, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.25, w: w - 0.7, h: 0.45, fontSize: 19, bold: true, color: fg });
        let yy = y + 0.9;
        for (const [k, it] of side.items.entries()) {
          t.oval(s, x + 0.35, yy + 0.01, 0.26, 0.26, i ? 'FFFFFF' : C.teal);
          t.img(s, await L.icon('FiCheck', i ? C.teal : 'FFFFFF', 3), x + 0.4, yy + 0.06, 0.16, 0.16);
          t.text(s, it, { x: x + 0.75, y: yy, w: w - 1.0, h: rows[k] + 0.05, fontSize: CFS, color: fg });
          yy += rows[k] + 0.18;
        }
      }
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.85, 8.8, 2.9, C.mint, { r: 0.35, name: 'Band' });
      t.oval(s, 1.0, 2.25, 0.8, 0.8, C.teal); plus(s, 1.17, 2.42, 0.46, 'FFFFFF');
      const fs = L.fit(d.text, 7.0, 1.2, 32, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 2.1, y: 2.05, w: 7.0, h: 1.3, fontSize: fs, bold: true, color: C.deep, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 2.1, y: 3.45, w: 6.9, h: 1.1, fontSize: 15, color: C.gray });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.15;
      t.line(s, 0.6, ly, 8.8, 0, C.line, 3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, pw = Math.min(cw - 0.3, L.width(it.year, 15, F.head, true) + 0.45);
        pill(s, x, ly - 0.2, pw, 0.4, i === n - 1 ? C.coral : C.teal);
        t.text(s, it.year, { x, y: ly - 0.2, w: pw, h: 0.4, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true, color: C.deep });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.mint }; idx++;
      plus(s, 8.4, 0.6, 0.6, C.teal); plus(s, 9.05, 1.2, 0.3, C.coral);
      const fs = L.fit(d.text, 7.4, 2.3, 32, 20, F.head, false), th = L.height(d.text, fs, 7.4, F.head);
      t.text(s, '\u201C', { x: 0.7, y: 4.0 - th - 1.0, w: 1, h: 1, fontSize: 90, bold: true, color: C.coral, fontFace: 'Arial' });
      t.text(s, d.text, { x: 0.8, y: 1.5, w: 7.4, h: 2.5, fontSize: fs, color: C.deep, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.8, y: 4.25, w: 7.4, h: 0.4, fontSize: 16, bold: true, color: C.teal });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.8, 4.0, 3.15, { mask: { r: 0.3 } });
      t.rect(s, 4.9, 1.8, 4.5, 3.15, C.mint, { r: 0.3, name: 'Panel' });
      t.text(s, d.text, { x: 5.2, y: 1.95, w: 3.9, h: 2.85, fontSize: L.fit(d.text, 3.9, 2.85, 15, 10, F.body, false, 1.25), color: C.deep, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.8, 4.3, 3.15, C.mint, { r: 0.3, name: 'Panel' });
      plus(s, 0.9, 2.05, 0.35, C.teal);
      t.text(s, d.text, { x: 0.9, y: 2.55, w: 3.7, h: 2.25, fontSize: L.fit(d.text, 3.7, 2.25, 15, 10, F.body, false, 1.2), color: C.deep, lineSpacingMultiple: 1.2 });
      await PH(s, d.image, 5.2, 1.8, 4.2, 3.15, { mask: { r: 0.3 } });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        pill(s, 0.6, y + 0.04, 8.8, rh - 0.1, C.mint);
        t.oval(s, 0.68, y + 0.08, rh - 0.18, rh - 0.18, C.teal);
        t.text(s, String(i + 1), { x: 0.68, y: y + 0.08, w: rh - 0.18, h: rh - 0.18, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: 0.68 + rh, y, w: 8.6 - rh, h: rh, fontSize: L.fit(it, 8.6 - rh, rh - 0.08, 13, 10, F.body), color: C.deep, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 5.6, 0.5, 3.9, 4.6, { mask: { r: 0.45 } }); },
    closing: async (s, d) => { await PH(s, d.image, 5.6, 0.5, 3.9, 4.6, { mask: { r: 0.45 } }); },
  });
  // ---- further ways to draw a type, in this template's clinic world (capsules, crosses, thermometer, heartbeat, the deep-teal night ward): a deck's pages must not look alike (L.pages)
  const X0 = 0.6, CW = 8.8, Y0 = 1.72, Y1 = 5.08, WH = 'FFFFFF', SOFT = 'D5EEEA';
  const CROSS = [[0.33, 0], [0.67, 0], [0.67, 0.33], [1, 0.33], [1, 0.67], [0.67, 0.67], [0.67, 1], [0.33, 1], [0.33, 0.67], [0, 0.67], [0, 0.33], [0.33, 0.33]];
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontSize: L.fit(txt, w, h, o.max || 17, 11, F.head, true), color: o.color || C.deep, align: o.align, valign: o.valign || 'middle' });
  const ward = (d) => { // the night ward: deep teal, the same pills and crosses
    d._night = true;
    const s = pres.addSlide(); s.background = { color: C.deep }; idx++;
    pill(s, 0.6, 0.45, 0.75, 0.34, C.teal);
    t.text(s, L.pad2(idx), { x: 0.6, y: 0.45, w: 0.75, h: 0.34, fontSize: 12, bold: true, color: WH, align: 'center', valign: 'middle' });
    plus(s, 8.75, 0.4, 0.32, C.teal); plus(s, 9.1, 0.65, 0.2, C.coral);
    t.text(s, d.title, { x: 0.6, y: 0.88, w: 8.6, h: 0.72, fontFace: F.head, bold: true, color: WH, valign: 'middle', fontSize: L.fit(d.title, 8.6, 0.72, 28, 20, F.head, true) });
    return s;
  };
  const dot = async (s, x, y, dd, ic, fill = WH, ink = C.teal) => { t.oval(s, x, y, dd, dd, fill); t.img(s, await L.icon(ic, ink, 2), x + dd * 0.25, y + dd * 0.25, dd * 0.5, dd * 0.5); };
  const numDot = (s, x, y, dd, n, fill = C.teal, ink = WH) => { t.oval(s, x, y, dd, dd, fill); t.text(s, String(n), { x, y, w: dd, h: dd, bold: true, fontSize: Math.round(dd * 30), color: ink, align: 'center', valign: 'middle' }); };
  const pulse = (w, h, col) => { const m = h / 2, u = w / 20; let p = `M0,${m}`; for (let k = 0; k < 4; k++) { const a = k * 5 * u; p += ` L${a + u},${m} L${a + 1.4 * u},${m - h * 0.1} L${a + 1.8 * u},${m} L${a + 2.2 * u},${m} L${a + 2.5 * u},${h * 0.06} L${a + 2.9 * u},${h * 0.94} L${a + 3.2 * u},${m} L${a + 5 * u},${m}`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${p}" fill="none" stroke="#${col}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`; };
  const V = {
    image: [
      async (d) => { // a capsule across the page holds the picture, the words beneath
        const s = page(d), ph = 1.72;
        await PH(s, d.image, X0, Y0, CW, ph, { mask: { r: ph / 2 } });
        t.oval(s, 8.5, Y0 + ph - 0.62, 0.8, 0.8, C.coral);
        plus(s, 8.67, Y0 + ph - 0.45, 0.46, WH);
        t.text(s, d.text, { x: X0 + 0.1, y: Y0 + ph + 0.2, w: CW - 0.2, h: Y1 - Y0 - ph - 0.2, fontSize: L.fit(d.text, CW - 0.2, Y1 - Y0 - ph - 0.22, 14, 10, F.body, false, 1.1), color: C.deep, lineSpacingMultiple: 1.1 });
      },
      async (d) => { // the night ward: a round picture with a teal ring
        const s = ward(d), dd = 3.1;
        t.oval(s, X0 - 0.08, Y0 - 0.0, dd + 0.16, dd + 0.16, C.teal);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), X0, Y0 + 0.08, dd, dd, { alt: '' });
        plus(s, X0 + dd - 0.2, Y0 + 0.15, 0.42, C.coral);
        t.text(s, d.text, { x: 4.15, y: Y0, w: 5.25, h: Y1 - Y0, fontSize: L.fit(d.text, 5.25, Y1 - Y0, 15, 10, F.body, false, 1.2), color: WH, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, the words on a rounded card
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0.45, 0.35, 5.5, 4.7, WH, { r: 0.35, name: 'Card' });
        pill(s, 0.75, 0.6, 0.75, 0.34, C.mint);
        t.text(s, L.pad2(idx), { x: 0.75, y: 0.6, w: 0.75, h: 0.34, fontSize: 12, bold: true, color: C.teal, align: 'center', valign: 'middle' });
        plus(s, 5.3, 0.62, 0.3, C.teal);
        t.text(s, d.title, { x: 0.75, y: 1.0, w: 4.9, h: 0.85, bold: true, color: C.deep, valign: 'middle', fontSize: L.fit(d.title, 4.9, 0.82, 24, 16, F.head, true) });
        t.text(s, d.text, { x: 0.75, y: 1.9, w: 4.9, h: 3.0, fontSize: L.fit(d.text, 4.9, 3.0, 14, 10, F.body, false, 1.15), color: C.deep, lineSpacingMultiple: 1.15 });
        t.rect(s, 0, 5.16, W, H - 5.16, WH, { name: 'Footer band' });
      },
      async (d) => { // the picture cut as the medical cross, the words on a mint panel
        const s = page(d), dd = 3.4, x = 6.05, y = Y0 - 0.03;
        t.rect(s, X0, Y0 + 0.5, 6.3, 2.3, C.mint, { r: 0.3, name: 'Panel' });
        t.text(s, d.text, { x: X0 + 0.28, y: Y0 + 0.58, w: 4.85, h: 2.14, fontSize: L.fit(d.text, 4.85, 2.14, 14, 10, F.body, false, 1.15), color: C.deep, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: { poly: CROSS } }), x, y, dd, dd, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // capsules stacked like a pill strip, a white round icon in each
        const s = page(d), n = d.items.length, gap = 0.12, h = (Y1 - Y0 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * (h + gap), dd = h - 0.2;
          t.rect(s, X0, y, CW, h, i % 2 ? C.mint : 'F2FAF8', { r: Math.min(h / 2, 0.4), line: { color: C.line, width: 0.75 }, name: 'Capsule' });
          await dot(s, X0 + 0.12, y + 0.1, dd, it.icon, C.teal, WH);
          head(s, it.h, X0 + 0.28 + dd, y + 0.05, 2.25, h - 0.1, { max: 16 });
          body(s, it.t, X0 + 2.75 + dd, y + 0.04, CW - 3.0 - dd, h - 0.08, { valign: 'middle', color: C.deep, max: 13 });
        }
      },
      async (d) => { // soft tiles two by two, teal and mint in turn
        const s = page(d), n = d.items.length, gap = 0.22, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w, dark = i === 0 || i === 3, ink = dark ? WH : C.deep;
          t.rect(s, x, y, ww, h, dark ? C.teal : C.mint, { r: 0.28, name: 'Tile' });
          await dot(s, x + 0.2, y + 0.16, 0.42, it.icon, WH, C.teal);
          head(s, it.h, x + 0.74, y + 0.16, ww - 0.95, 0.42, { color: ink, max: 16 });
          body(s, it.t, x + 0.22, y + 0.64, ww - 0.44, h - 0.72, { color: ink, max: 13 });
        }
      },
      async (d) => { // the night ward: rounded cards at two heights
        const s = ward(d), n = d.items.length, gap = 0.18, w = (CW - gap * (n - 1)) / n, h = 2.95;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 2.12 : Y0;
          t.rect(s, x, y, w, h, WH, { r: 0.25, name: 'Card' });
          await dot(s, x + 0.18, y + 0.18, 0.48, it.icon, C.mint, C.teal);
          head(s, it.h, x + 0.18, y + 0.72, w - 0.36, 0.52, { max: 15, valign: 'top' });
          body(s, it.t, x + 0.18, y + 1.26, w - 0.36, h - 1.36, { color: C.deep, max: 13 });
        }
      },
      async (d) => { // a great cross in a circle, the items around it
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, md = 1.6, w = 3.2;
        t.oval(s, cx - md / 2 - 0.16, cy - md / 2 - 0.16, md + 0.32, md + 0.32, C.mint);
        t.oval(s, cx - md / 2, cy - md / 2, md, md, C.teal);
        plus(s, cx - 0.45, cy - 0.45, 0.9, WH);
        const hh = (Y1 - Y0 - 0.15) / 2;
        const spots = n === 4 ? [[X0, Y0], [W - X0 - w, Y0], [X0, Y0 + hh + 0.15], [W - X0 - w, Y0 + hh + 0.15]] : [[X0, Y0], [W - X0 - w, cy - hh / 2], [X0, Y0 + hh + 0.15]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          await dot(s, right ? x : x + w - 0.44, y + 0.02, 0.44, it.icon, C.mint, C.teal);
          head(s, it.h, right ? x + 0.54 : x, y + 0.02, w - 0.54, 0.44, { align: a, max: 16 });
          body(s, it.t, x, y + 0.5, w, hh - 0.52, { align: a, max: 13, color: C.deep });
        }
      },
    ],
    process: [
      async (d) => { // a thermometer down the left: the mercury's numbered marks, the steps beside
        const s = page(d), n = d.steps.length, rh = (Y1 - Y0) / n, tw = 0.62, x = X0 + 0.2;
        t.rect(s, x, Y0, tw, Y1 - Y0, C.mint, { r: tw / 2, name: 'Thermometer' });
        t.rect(s, x + 0.17, Y0 + 0.18, tw - 0.34, Y1 - Y0 - 0.36, C.teal, { r: (tw - 0.34) / 2, name: 'Mercury' });
        d.steps.forEach((st, i) => {
          const y = Y0 + i * rh, dd = 0.46, last = i === n - 1;
          numDot(s, x + (tw - dd) / 2, y + (rh - dd) / 2, dd, i + 1, last ? C.coral : WH, last ? WH : C.teal);
          t.line(s, x + tw + 0.08, y + rh / 2, 0.32, 0, C.line, 1.5, { name: 'Mark' });
          head(s, st.h, x + tw + 0.5, y + 0.04, 7.2, 0.36, { max: 17 });
          body(s, st.t, x + tw + 0.5, y + 0.42, 7.2, rh - 0.46, { max: 14 });
        });
      },
      async (d) => { // recovery climbing: rounded tiles rising, the last one coral
        const s = page(d), n = d.steps.length, gap = 0.14, w = (CW - gap * (n - 1)) / n, rise = n === 4 ? 0.24 : 0.34, top = Y0 + rise * (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + gap), y = top - i * rise, last = i === n - 1, h = Y1 - y, ink = last ? WH : C.deep;
          t.rect(s, x, y, w, h, last ? C.coral : C.mint, { r: 0.22, name: 'Step' });
          numDot(s, x + 0.16, y + 0.14, 0.44, i + 1, WH, last ? C.coral : C.teal);
          head(s, st.h, x + 0.16, y + 0.62, w - 0.32, 0.5, { max: 15, valign: 'top', color: ink });
          body(s, st.t, x + 0.16, y + 1.14, w - 0.32, h - 1.22, { color: ink, max: 13 });
        });
      },
      async (d) => { // the night ward: a heartbeat line runs through the numbers
        const s = ward(d), n = d.steps.length, cw = CW / n, ly = 2.2, img = await L.svg(pulse(880, 90, '7FCFC3'), 1760, 180);
        t.img(s, img, X0, ly - 0.45, CW, 0.9, { alt: '' });
        d.steps.forEach((st, i) => {
          const cx = X0 + i * cw + cw / 2;
          numDot(s, cx - 0.24, ly - 0.24, 0.48, i + 1, i === n - 1 ? C.coral : WH, i === n - 1 ? WH : C.teal);
          head(s, st.h, cx - cw / 2 + 0.1, 2.72, cw - 0.2, 0.5, { max: 16, color: WH, align: 'center' });
          body(s, st.t, cx - cw / 2 + 0.1, 3.25, cw - 0.2, Y1 - 3.25, { color: SOFT, align: 'center', max: 14 });
        });
      },
    ],
    stats: [
      async (d) => { // one figure in a large teal circle, the others on plates beside it
        const s = page(d), [a, ...rest] = d.stats, dd = d.note ? 2.5 : 3.2, x = X0, y = Y0 + 0.04;
        t.oval(s, x, y, dd, dd, C.teal);
        t.text(s, a.value, { x: x + 0.25, y: y + dd * 0.2, w: dd - 0.5, h: dd * 0.34, bold: true, color: WH, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd - 0.55, dd * 0.32, 52, 22, F.head, true) });
        body(s, a.label, x + 0.42, y + dd * 0.56, dd - 0.84, dd * 0.28, { color: WH, align: 'center', max: 13 });
        const rx = x + dd + 0.3, rw = 9.4 - rx, rh = (dd - 0.14) / 2;
        rest.forEach((v, i) => {
          const yy = y + i * (rh + 0.14);
          t.rect(s, rx, yy, rw, rh, C.mint, { r: 0.25, name: 'Plate' });
          t.text(s, v.value, { x: rx + 0.22, y: yy + 0.06, w: 2.2, h: rh - 0.12, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(v.value, 2.15, rh - 0.16, 36, 18, F.head, true) });
          body(s, v.label, rx + 2.5, yy + 0.05, rw - 2.68, rh - 0.1, { color: C.deep, valign: 'middle', max: 14 });
        });
        if (d.note) body(s, d.note, X0, y + dd + 0.08, CW, Y1 - y - dd - 0.06, { max: 13 });
      },
      async (d) => { // the night ward: white rings at stepped heights
        const s = ward(d), cw = CW / 3, dd = d.note ? 1.42 : 1.75;
        d.stats.forEach((v, i) => {
          const cx = X0 + i * cw + cw / 2, y = Y0 + (i === 1 ? 0.14 : 0), col = i === 1 ? C.coral : C.teal;
          t.oval(s, cx - dd / 2, y, dd, dd, WH, { line: { color: col, width: 4 }, name: 'Ring' });
          t.text(s, v.value, { x: cx - dd / 2 + 0.1, y, w: dd - 0.2, h: dd, bold: true, color: col, align: 'center', valign: 'middle', fontSize: L.fit(v.value, dd - 0.25, dd * 0.5, 32, 14, F.head, true) });
          body(s, v.label, cx - cw / 2 + 0.15, y + dd + 0.08, cw - 0.3, d.note ? 0.6 : 1.1, { color: SOFT, align: 'center', max: 14 });
        });
        if (d.note) body(s, d.note, X0, 4.0, CW, Y1 - 4.0, { color: SOFT, align: 'center', max: 13 });
      },
      async (d) => { // three upright capsules, two-tone like a real pill
        const s = page(d), gap = 0.32, w = (CW - 2 * gap) / 3, h = d.note ? 2.55 : Y1 - Y0, r = Math.min(w / 2, 0.7);
        d.stats.forEach((v, i) => {
          const x = X0 + i * (w + gap), mid = Y0 + h * 0.46;
          t.rect(s, x, Y0, w, h, C.mint, { r, name: 'Capsule' });
          t.rect(s, x, Y0, w, h * 0.46 + r, i === 1 ? C.coral : C.teal, { r, name: 'Capsule top' });
          t.rect(s, x, mid, w, r, C.mint, { name: 'Capsule band' });
          t.text(s, v.value, { x: x + 0.2, y: Y0 + 0.1, w: w - 0.4, h: h * 0.46 - 0.12, bold: true, color: WH, align: 'center', valign: 'middle', fontSize: L.fit(v.value, w - 0.45, h * 0.4, 44, 22, F.head, true) });
          body(s, v.label, x + 0.32, mid + 0.1, w - 0.64, h * 0.54 - 0.28, { color: C.deep, align: 'center', max: 14 });
        });
        if (d.note) body(s, d.note, X0, Y0 + h + 0.1, CW, Y1 - Y0 - h - 0.1, { max: 13 });
      },
    ],
    compare: [
      async (d) => { // mirrored about a tall capsule with a cross at its centre
        const s = page(d), w = 3.85, cx = W / 2, avail = Y1 - 2.35;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.18, avail);
        t.rect(s, cx - 0.28, Y0, 0.56, Y1 - Y0, C.mint, { r: 0.28, name: 'Capsule' });
        t.oval(s, cx - 0.28, (Y0 + Y1) / 2 - 0.28, 0.56, 0.56, C.teal);
        plus(s, cx - 0.17, (Y0 + Y1) / 2 - 0.17, 0.34, WH);
        pill(s, cx - 0.42 - w, Y0, w, 0.5, C.teal); pill(s, cx + 0.42, Y0, w, 0.5, C.coral);
        head(s, d.left.h, cx - 0.42 - w + 0.2, Y0, w - 0.4, 0.5, { color: WH, align: 'right', max: 17 }); head(s, d.right.h, cx + 0.62, Y0, w - 0.4, 0.5, { color: WH, max: 17 });
        let y = 2.35;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: cx - 0.42 - w, y, w, h: rows[k], fontSize: fs, color: C.deep, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.42, y, w, h: rows[k], fontSize: fs, color: C.deep });
          y += Math.max(rows[k], Math.min(0.68, avail / rows.length));
        }
      },
      async (d) => { // two stacked rounded bands: mint above, teal below
        const s = page(d), h = (Y1 - Y0 - 0.16) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.16), dark = i === 1, ink = dark ? WH : C.deep, n = side.items.length, rh = (h - 0.16) / n;
          t.rect(s, X0, y, CW, h, dark ? C.teal : C.mint, { r: 0.28, name: 'Band' });
          t.oval(s, X0 + 0.18, y + h / 2 - 0.25, 0.5, 0.5, WH);
          if (dark) plus(s, X0 + 0.28, y + h / 2 - 0.15, 0.3, C.teal); else t.rect(s, X0 + 0.28, y + h / 2 - 0.04, 0.3, 0.08, C.teal, { name: 'Minus' });
          head(s, side.h, X0 + 0.82, y + 0.08, 2.05, h - 0.16, { color: ink, max: 17 });
          side.items.forEach((it, k) => {
            const yy = y + 0.08 + k * rh;
            t.oval(s, X0 + 3.05, yy + rh / 2 - 0.05, 0.1, 0.1, dark ? WH : C.teal);
            body(s, it, X0 + 3.25, yy, CW - 3.5, rh - 0.02, { color: ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the night ward: the words large, crosses drifting beside them
        const s = ward(d), hh = d.caption ? 2.05 : 3.2;
        plus(s, 8.2, Y0 + 0.1, 0.95, C.teal); plus(s, 7.7, Y0 + 1.0, 0.42, C.coral);
        t.text(s, L.runs(d.text), { x: X0, y: Y0, w: 6.95, h: hh, bold: true, color: WH, valign: 'middle', fontSize: L.fit(d.text, 6.95, hh - 0.05, 34, 18, F.head, true) });
        if (d.caption) { t.rect(s, X0, Y0 + hh + 0.06, 0.8, 0.07, C.coral, { r: 0.035, name: 'Accent' }); t.text(s, d.caption, { x: X0, y: Y0 + hh + 0.2, w: CW, h: Y1 - Y0 - hh - 0.2, fontSize: L.fit(d.caption, CW, Y1 - Y0 - hh - 0.2, 15, 10, F.body), color: SOFT }); }
      },
      async (d) => { // a doctor's note: a large teal card for the words, a mint one for the details
        const s = page(d);
        t.rect(s, X0, Y0, 5.7, Y1 - Y0, C.teal, { r: 0.35, name: 'Card' });
        plus(s, X0 + 0.3, Y0 + 0.28, 0.42, WH);
        t.text(s, L.runs(d.text), { x: X0 + 0.32, y: Y0 + 0.75, w: 5.06, h: Y1 - Y0 - 0.95, bold: true, color: WH, valign: 'middle', fontSize: L.fit(d.text, 5.06, Y1 - Y0 - 1.0, 30, 16, F.head, true) });
        t.rect(s, 6.5, Y0 + 0.3, 2.9, Y1 - Y0 - 0.3, C.mint, { r: 0.28, name: 'Card' });
        if (d.caption) t.text(s, d.caption, { x: 6.7, y: Y0 + 0.5, w: 2.5, h: Y1 - Y0 - 0.7, fontSize: L.fit(d.caption, 2.5, Y1 - Y0 - 0.7, 14, 10, F.body), color: C.deep });
      },
    ],
    timeline: [
      async (d) => { // a patient's chart: year pills down a soft line, entries beside
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 1.35;
        t.rect(s, lx - 0.03, Y0 + 0.1, 0.06, Y1 - Y0 - 0.2, C.line, { name: 'Line' });
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh, last = i === n - 1;
          pill(s, X0, y + 0.06, 1.5, 0.38, last ? C.coral : C.teal);
          t.text(s, it.year, { x: X0 + 0.05, y: y + 0.06, w: 1.4, h: 0.38, bold: true, color: WH, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.32, 0.34, 15, 10, F.head, true) });
          head(s, it.h, 2.35, y + 0.02, 7.05, 0.34, { max: 16 });
          body(s, it.t, 2.35, y + 0.36, 7.05, rh - 0.4, { max: 13 });
        });
      },
      async (d) => { // a soft band across the page, cross marks on it, events above and below by turns
        const s = page(d), ly = (Y0 + Y1) / 2, w = 3.95, xs = [X0, X0 + 0.85, 5.0, 5.45], cell = 1.38;
        t.rect(s, X0, ly - 0.11, CW, 0.22, C.mint, { r: 0.11, name: 'Band' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? ly - 0.17 - cell : ly + 0.17;
          plus(s, x + 0.05, ly - 0.17, 0.34, i === 3 ? C.coral : C.teal);
          t.text(s, [{ text: it.year + '  ', options: { color: i === 3 ? C.coral : C.teal, bold: true } }, { text: it.h, options: { color: C.deep, bold: true } }], { x: x + 0.07, y, w: w - 0.07, h: 0.36, fontSize: L.fit(`${it.year}  ${it.h}`, w - 0.1, 0.34, 16, 11, F.head, true), valign: 'middle' });
          body(s, it.t, x + 0.07, y + 0.37, w - 0.07, cell - 0.39, { max: 13, color: C.deep });
        });
      },
      async (d) => { // the night ward: a round year sits on the shoulder of each card
        const s = ward(d), n = d.items.length, gap = 0.14, w = (CW - gap * (n - 1)) / n, dd = 0.92, top = Y0 + 0.4, h = Y1 - top;
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + gap), last = i === n - 1;
          t.rect(s, x, top, w, h, last ? C.teal : '164F50', { r: 0.2, name: 'Card' });
          t.oval(s, x + (w - dd) / 2, top - dd * 0.5, dd, dd, last ? C.coral : WH, { line: { color: C.deep, width: 3 }, name: 'Year' });
          t.text(s, it.year, { x: x + (w - dd) / 2 + 0.04, y: top - dd * 0.5, w: dd - 0.08, h: dd, bold: true, color: last ? WH : C.teal, align: 'center', valign: 'middle', fontSize: L.fit(it.year, dd - 0.1, dd * 0.56, 17, 9, F.head, true) });
          head(s, it.h, x + 0.12, top + dd * 0.52, w - 0.24, 0.42, { color: WH, align: 'center', max: 14 });
          body(s, it.t, x + 0.14, top + dd * 0.52 + 0.44, w - 0.28, h - dd * 0.52 - 0.5, { color: SOFT, align: 'center', max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.stats = V.stats.shift(); // the old stats (three mint panels) read like the cards page
  R.timeline = V.timeline.shift(); // the old timeline (pills over a column of text) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (_t, _s, d) => ({ x: 0.6, y: 5.22, w: 8.8, h: 0.25, color: d._night ? SOFT : C.gray }));
  return L.save(pres, out, { name: 'SlideAI Klinika', colors: { dk1: C.deep, lt1: C.bg, dk2: '1F5556', lt2: C.mint, accent1: C.teal, accent2: C.coral, accent3: C.gray, accent4: '7FCFC3', accent5: C.line, accent6: 'B5E3DB', hlink: C.teal, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "xotirjam, ishonchli; sodda va tushunarli tushuntirish", "limits": {}};
module.exports = { id: 14, slug: 'klinika', name: 'Klinika', category: 'minimalist', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:gallery|dir=\"l\"", "dissolve"], "cover": ["focusIn", "fadeWords"], "mark": "plus", "deco": "fadeUp", "sig": {"title": "focusIn", "body": "fadeUp", "item": "fadeUp", "image": "softGrow", "number": "plus", "order": "seq", "stagger": 0.16}, "tempo": 1.05, "kenburns": false};
