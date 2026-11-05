/**
 * 12 Brutalist — neo-brutalism: loud yellow, thick black outlines, hard offset shadows,
 * sticker-like boxes, Courier New labels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFE45C', ink: '000000', pink: 'FF6FB5', cyan: '5CE1E6', white: 'FFFFFF', gray: '333333' };
const F = { head: 'Arial', body: 'Arial', mono: 'Courier New' };

async function build(content, out) {
  const pres = L.deck({ head: F.head, body: F.body }, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const hard = (s, x, y, w, h, fill, off = 0.09) => {
    t.rect(s, x + off, y + off, w, h, C.ink, { name: 'Hard shadow' });
    t.rect(s, x, y, w, h, fill, { line: { color: C.ink, width: 2.5 }, name: 'Box' });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const fs = L.fit(d.title, 7.4, 0.62, 26, 16, F.head, true), tw = Math.min(7.6, L.width(d.title, fs, F.head, true) + 0.5);
    hard(s, 0.6, 0.4, tw, 0.75, C.white);
    t.text(s, d.title, { x: 0.85, y: 0.4, w: tw - 0.4, h: 0.75, fontSize: fs, bold: true, valign: 'middle' });
    t.rect(s, 8.7, 0.45, 0.7, 0.62, C.ink, { name: 'Page' });
    t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.62, fontFace: F.mono, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
    return s;
  };
  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: kind === 'cover' ? C.bg : C.pink }; idx++;
    const TW = d.image ? 5.6 : 8.6, fs = L.fit(d.title, TW, 2.6, 58, 30, F.head, true, 0.92);
    t.text(s, d.title, { x: 0.6, y: 0.5, w: TW, h: 2.75, fontSize: fs, bold: true, valign: 'bottom', lineSpacingMultiple: 0.92 });
    if (d.subtitle) {
      const sh = L.height(d.subtitle, 16, 5.4, F.body);
      hard(s, 0.6, 3.6, 5.9, sh + 0.45, kind === 'cover' ? C.pink : C.white);
      t.text(s, d.subtitle, { x: 0.85, y: 3.6, w: 5.4, h: sh + 0.45, fontSize: 16, bold: true, valign: 'middle' });
    }
    hard(s, 7.6, 3.55, 1.5, 1.5, C.cyan);
    t.img(s, await L.icon(kind === 'cover' ? 'FiArrowDownRight' : 'FiCheck', C.ink, 2.5), 7.95, 3.9, 0.8, 0.8);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.12, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.55 + (i % per) * rh;
        hard(s, x, y, 4.15, rh - 0.3, C.white, 0.07);
        t.rect(s, x, y, 0.75, rh - 0.3, C.ink, { name: 'Number' });
        t.text(s, L.pad2(i + 1), { x, y, w: 0.75, h: rh - 0.3, fontFace: F.mono, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.05, h: rh - 0.3, fontSize: 17, bold: true, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, fills = [C.white, C.pink, C.cyan, C.white];
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.45, 19, 13, F.head, true)));
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        hard(s, x, 1.6, w, h, fills[i % 4]);
        t.img(s, await L.icon(it.icon, C.ink, 2.5), x + 0.25, 1.85, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.25, y: 2.45, w: w - 0.5, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, it.t, { x: x + 0.25, y: 2.95, w: w - 0.5, h: h - 1.5, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.45, w = (8.7 - gap * (n - 1)) / n, h = 3.0;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, w - 0.4, 0.45, 18, 12, F.head, true)));
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * (w + gap);
        hard(s, x, 1.65, w, h, i === n - 1 ? C.pink : C.white);
        t.text(s, L.pad2(i + 1), { x: x + 0.2, y: 1.8, w: w - 0.4, h: 0.6, fontFace: F.mono, fontSize: 30, bold: true });
        t.text(s, st.h, { x: x + 0.2, y: 2.5, w: w - 0.4, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, st.t, { x: x + 0.2, y: 3.0, w: w - 0.4, h: 1.55, fontSize: 14, color: C.gray });
        if (i < n - 1) t.img(s, await L.icon('FiArrowRight', C.ink, 3), x + w + 0.06, 3.0, 0.32, 0.32);
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.35, w = (8.7 - gap * (n - 1)) / n, fills = [C.pink, C.cyan, C.white];
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        hard(s, px, 1.65, w, 2.5, fills[i % 3]);
        t.text(s, x.value, { x: px + 0.3, y: 1.85, w: w - 0.6, h: 1.05, fontSize: L.fit(x.value, w - 0.6, 1.0, 54, 28, F.head, true), bold: true, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.3, y: 3.0, w: w - 0.6, h: 1.0, fontFace: F.mono, fontSize: 14, bold: true });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.7, h: 0.55, fontFace: F.mono, fontSize: 13 });
    },
    async compare(d) {
      const s = page(d), w = 4.15, h = 3.35, y = 1.6;
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.85, F.body, 0, h - 0.85 - 0.12 - 0.18 * (nr - 1));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        hard(s, x, y, w, h, C.white);
        t.rect(s, x, y, w, 0.6, i ? C.pink : C.ink, { line: { color: C.ink, width: 2.5 }, name: 'Header' });
        t.text(s, side.h, { x: x + 0.25, y, w: w - 0.5, h: 0.6, fontSize: 18, bold: true, color: i ? C.ink : C.white, valign: 'middle' });
        let yy = y + 0.85;
        side.items.forEach((it, k) => {
          t.text(s, '\u2192', { x: x + 0.25, y: yy, w: 0.35, h: 0.3, fontFace: F.mono, fontSize: 15, bold: true });
          t.text(s, it, { x: x + 0.6, y: yy, w: w - 0.85, h: rows[k] + 0.05, fontSize: CFS });
          yy += rows[k] + 0.18;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, 7.6, 1.5, 38, 22, F.head, true);
      hard(s, 0.6, 1.6, 8.6, 2.1, C.white, 0.12);
      t.text(s, L.runs(d.text), { x: 1.1, y: 1.6, w: 7.6, h: 2.1, fontSize: fs, bold: true, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.0, w: 8.4, h: 1.0, fontFace: F.mono, fontSize: 14, bold: true });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.7 / n, ly = 2.6;
      t.rect(s, 0.6, ly - 0.05, 8.7, 0.1, C.ink, { name: 'Bar' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, bw = Math.min(cw - 0.3, L.width(it.year, 18, F.mono, true) + 0.4);
        hard(s, x, 1.65, bw, 0.55, i % 2 ? C.cyan : C.pink, 0.06);
        t.text(s, it.year, { x, y: 1.65, w: bw, h: 0.55, fontFace: F.mono, fontSize: 18, bold: true, align: 'center', valign: 'middle' });
        t.rect(s, x + 0.1, ly - 0.15, 0.3, 0.3, C.white, { line: { color: C.ink, width: 2.5 }, name: 'Point' });
        t.text(s, it.h, { x, y: 2.95, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true });
        t.text(s, it.t, { x, y: 3.4, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.pink }; idx++;
      const fs = L.fit(d.text, 7.6, 2.3, 34, 20, F.head, true);
      hard(s, 0.6, 0.8, 8.6, 3.2, C.white, 0.12);
      t.text(s, '\u201C', { x: 0.9, y: 0.85, w: 1, h: 1, fontSize: 80, bold: true, fontFace: F.head });
      t.text(s, d.text, { x: 1.1, y: 1.4, w: 7.6, h: 2.4, fontSize: fs, bold: true, valign: 'middle' });
      if (d.author) {
        const aw = Math.min(8.6, L.width(d.author, 14, F.mono, true) + 0.5);
        t.rect(s, 0.6, 4.35, aw, 0.5, C.ink, { name: 'Author' });
        t.text(s, d.author, { x: 0.85, y: 4.35, w: aw - 0.4, h: 0.5, fontFace: F.mono, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
      }
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      hard(s, 0.6, 1.6, 4.0, 3.3, C.white); await PH(s, d.image, 0.72, 1.72, 3.76, 3.06);
      hard(s, 4.95, 1.6, 4.45, 3.3, C.white);
      t.text(s, d.text, { x: 5.2, y: 1.75, w: 3.95, h: 3.0, fontSize: L.fit(d.text, 3.95, 3.0, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      hard(s, 0.6, 1.6, 4.3, 3.3, C.cyan);
      t.text(s, d.text, { x: 0.85, y: 1.75, w: 3.8, h: 3.0, fontSize: L.fit(d.text, 3.8, 3.0, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      hard(s, 5.25, 1.6, 4.15, 3.3, C.white); await PH(s, d.image, 5.37, 1.72, 3.91, 3.06);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.rect(s, 0.6, y + 0.04, 0.5, rh - 0.12, C.ink, { name: 'Number' });
        t.text(s, String(i + 1), { x: 0.6, y: y + 0.04, w: 0.5, h: rh - 0.12, fontFace: F.mono, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { hard(s, 6.5, 0.5, 2.9, 2.75, C.white); await PH(s, d.image, 6.62, 0.62, 2.66, 2.51); },
    closing: async (s, d) => { hard(s, 6.5, 0.5, 2.9, 2.75, C.white); await PH(s, d.image, 6.62, 0.62, 2.66, 2.51); },
  });
  // ---- further ways to draw a type, in this template's sticker world (hard shadows, tape, bursts, loud colour pages): a deck's pages must not look alike (L.pages)
  const Y0 = 1.5, Y1 = 5.1, X0 = 0.6, CW = 8.7;
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: o.font || F.body, bold: o.bold, fontSize: L.fit(txt, w, h, o.max || 14, 10, o.font || F.body, !!o.bold), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontFace: o.font || F.head, fontSize: L.fit(txt, w, h, o.max || 17, 11, o.font || F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const hardC = (s, x, y, w, h, fill, shadow, off = 0.09, line = C.ink) => { t.rect(s, x + off, y + off, w, h, shadow, { name: 'Hard shadow' }); t.rect(s, x, y, w, h, fill, { line: { color: line, width: 2.5 }, name: 'Box' }); };
  const loud = (d, color) => { const s = page(d); s.background = { color }; if (color === C.ink) { d._ink = C.white; t.rect(s, 8.7, 0.45, 0.7, 0.62, C.bg, { name: 'Page' }); t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.62, fontFace: F.mono, fontSize: 18, bold: true, align: 'center', valign: 'middle' }); } return s; };
  const titleOn = (s, d) => { const fs = L.fit(d.title, 7.4, 0.62, 26, 16, F.head, true), tw = Math.min(7.6, L.width(d.title, fs, F.head, true) + 0.5); hard(s, 0.6, 0.4, tw, 0.75, C.white); t.text(s, d.title, { x: 0.85, y: 0.4, w: tw - 0.4, h: 0.75, fontSize: fs, bold: true, valign: 'middle' }); t.rect(s, 8.7, 0.45, 0.7, 0.62, C.ink, { name: 'Page' }); t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.62, fontFace: F.mono, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' }); };
  const burst = (s, x, y, d, fill) => { t.shape(s, 'STAR_12_POINT', { x: x + 0.07, y: y + 0.07, w: d, h: d, fill: { color: C.ink }, objectName: 'Burst shadow' }); t.shape(s, 'STAR_12_POINT', { x, y, w: d, h: d, fill: { color: fill }, line: { color: C.ink, width: 2.5 }, objectName: 'Burst' }); };
  const tape = async (s, x, y, w, h) => { const a = []; for (let k = -2; k < w * 10 + 2; k += 2) a.push(`<path d="M${k * 40},${h * 100} L${(k + 1) * 40},0 L${(k + 2) * 40},0 L${(k + 1) * 40},${h * 100} Z" fill="#000"/>`); t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * 100}" height="${h * 100}"><rect width="100%" height="100%" fill="#${C.bg}"/>${a.join('')}</svg>`, w * 100, h * 100), x, y, w, h, { alt: '' }); };
  const V = {
    image: [
      async (d) => { // a big print with a text sticker slapped over its corner, a strip of tape on top
        const s = page(d);
        hard(s, X0, Y0, 5.9, 3.45, C.white);
        await PH(s, d.image, X0 + 0.1, Y0 + 0.1, 5.7, 3.25);
        t.rect(s, X0 + 0.25, Y0 - 0.14, 1.3, 0.3, C.pink, { line: { color: C.ink, width: 2 }, rotate: 356, name: 'Tape' });
        hard(s, 5.0, 2.0, 4.3, 2.95, C.cyan);
        t.text(s, d.text, { x: 5.18, y: 2.1, w: 3.94, h: 2.75, fontSize: L.fit(d.text, 3.94, 2.75, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // the picture is the whole page, stickers on top, a black tape carries the footer
        d._ink = C.white;
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H);
        titleOn(s, d);
        hard(s, 0.6, 2.0, 5.3, 3.0, C.white);
        t.text(s, d.text, { x: 0.8, y: 2.1, w: 4.9, h: 2.8, fontSize: L.fit(d.text, 4.9, 2.8, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        t.rect(s, 0, 5.22, W, H - 5.22, C.ink, { name: 'Footer tape' });
      },
      async (d) => { // a pink page: the picture is a round badge with a thick ring and a burst stuck on it
        const s = loud(d, C.pink), dd = 3.35, x = 5.95, y = 1.5;
        t.oval(s, x + 0.1, y + 0.1, dd, dd, C.ink);
        t.oval(s, x, y, dd, dd, C.white, { line: { color: C.ink, width: 3 }, name: 'Badge' });
        t.img(s, await L.photo(L.src(d.image), dd - 0.2, dd - 0.2, { mask: 'circle' }), x + 0.1, y + 0.1, dd - 0.2, dd - 0.2, { alt: '' });
        burst(s, x - 0.35, y + 2.2, 1.0, C.bg);
        t.img(s, await L.icon('FiStar', C.ink, 2.5), x - 0.03, y + 2.52, 0.36, 0.36);
        hard(s, X0, 1.55, 5.0, 3.35, C.white);
        t.text(s, d.text, { x: X0 + 0.2, y: 1.65, w: 4.6, h: 3.15, fontSize: L.fit(d.text, 4.6, 3.15, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // a strip of picture across the whole page between hazard tapes, the words under it
        const s = page(d);
        await tape(s, 0, 1.38, W, 0.16);
        await PH(s, d.image, 0, 1.54, W, 1.45);
        await tape(s, 0, 2.99, W, 0.16);
        t.rect(s, X0, 3.3, CW, 1.82, C.ink, { name: 'Box' });
        t.text(s, d.text, { x: X0 + 0.2, y: 3.36, w: CW - 0.4, h: 1.7, fontSize: L.fit(d.text, CW - 0.4, 1.7, 14, 10, F.body, false, 1.1), color: C.white, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // one long sticker, a black strip holds the icons, thick rules part the rows
        const s = page(d), n = d.items.length, H0 = Y1 - Y0 - 0.1, h = H0 / n;
        hard(s, X0, Y0, CW, H0, C.white);
        t.rect(s, X0, Y0, 0.95, H0, C.ink, { name: 'Strip' });
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h;
          t.img(s, await L.icon(it.icon, [C.bg, C.pink, C.cyan, C.white][i], 2.5), X0 + 0.28, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, X0 + 1.12, y + 0.04, 2.35, h - 0.08, { max: 16 });
          body(s, it.t, X0 + 3.55, y + 0.05, CW - 3.7, h - 0.1, { color: C.ink, valign: 'middle', max: 13 });
          if (i < n - 1) t.rect(s, X0 + 0.95, y + h - 0.02, CW - 0.95, 0.04, C.ink, { name: 'Rule' });
        }
      },
      async (d) => { // a mosaic: one tall sticker holds the first item, the rest packed beside it
        const s = page(d), n = d.items.length, gap = 0.22, H0 = Y1 - Y0 - 0.09, [a, ...rest] = d.items, lw = 3.3, rx = X0 + lw + gap, rw = CW - lw - gap, h = (H0 - gap) / 2, fills = [C.white, C.cyan, C.white];
        hard(s, X0, Y0, lw, H0, C.pink);
        t.img(s, await L.icon(a.icon, C.ink, 2.5), X0 + 0.22, Y0 + 0.22, 0.56, 0.56);
        head(s, a.h, X0 + 0.22, Y0 + 0.92, lw - 0.44, 0.7, { max: 20, valign: 'top' });
        body(s, a.t, X0 + 0.22, Y0 + 1.65, lw - 0.44, H0 - 1.8, { color: C.ink, max: 15 });
        for (const [k, it] of rest.entries()) {
          const row = n === 3 ? k : (k === 0 ? 0 : 1), col = n === 4 && k === 2 ? 1 : 0, ww = n === 3 || k === 0 ? rw : (rw - gap) / 2, x = rx + col * (ww + gap), y = Y0 + row * (h + gap);
          hard(s, x, y, ww, h, fills[k], 0.07);
          t.img(s, await L.icon(it.icon, C.ink, 2.5), x + 0.14, y + 0.12, 0.28, 0.28);
          head(s, it.h, x + 0.5, y + 0.08, ww - 0.62, 0.36, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.48, ww - 0.28, h - 0.54, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // a black page: stickers at two heights, pink shadows
        const s = loud(d, C.ink), n = d.items.length, gap = 0.24, w = (CW - gap * (n - 1)) / n, h = 3.05, fills = [C.bg, C.white, C.cyan, C.white];
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 1.95 : Y0;
          hardC(s, x, y, w, h, fills[i], C.pink, 0.09);
          t.img(s, await L.icon(it.icon, C.ink, 2.5), x + 0.16, y + 0.16, 0.34, 0.34);
          head(s, it.h, x + 0.16, y + 0.56, w - 0.32, 0.55, { max: 14, valign: 'top' });
          body(s, it.t, x + 0.16, y + 1.12, w - 0.32, h - 1.2, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // a burst in the middle, boxes pinned at its points
        const s = page(d), n = d.items.length, w = 3.45, h = 1.68, cx = X0 + CW / 2, cy = (Y0 + Y1) / 2;
        const spots = n === 4 ? [[X0, Y0], [X0 + CW - w, Y0], [X0, Y1 - h - 0.09], [X0 + CW - w, Y1 - h - 0.09]] : [[X0, Y0], [X0 + CW - w, cy - h / 2], [X0, Y1 - h - 0.09]];
        t.rect(s, X0 + 1, cy - 0.05, CW - 2, 0.1, C.ink, { name: 'Bar' });
        burst(s, cx - 0.85, cy - 0.85, 1.7, C.pink);
        t.img(s, await L.icon('FiZap', C.ink, 2.5), cx - 0.28, cy - 0.28, 0.56, 0.56);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i];
          hard(s, x, y, w, h, i % 2 ? C.cyan : C.white, 0.07);
          t.img(s, await L.icon(it.icon, C.ink, 2.5), x + 0.14, y + 0.1, 0.28, 0.28);
          head(s, it.h, x + 0.5, y + 0.06, w - 0.62, 0.36, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.46, w - 0.28, h - 0.5, { color: C.ink, max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // boxes falling down a staircase, each hanging off the one above
        const s = page(d), n = d.steps.length, gap = 0.1, h = (Y1 - Y0 - gap * (n - 1) - 0.09) / n, shift = n === 4 ? 0.5 : 0.75, w = CW - shift * (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * shift, y = Y0 + i * (h + gap);
          hard(s, x, y, w, h, [C.white, C.cyan, C.pink, C.white][i], 0.07);
          t.text(s, L.pad2(i + 1), { x: x + 0.12, y, w: 0.72, h, fontFace: F.mono, bold: true, fontSize: 24, valign: 'middle' });
          head(s, st.h, x + 0.85, y + 0.03, 2.05, h - 0.06, { max: 14 });
          body(s, st.t, x + 3.0, y + 0.03, w - 3.1, h - 0.06, { color: C.ink, valign: 'middle', max: 12 });
        });
      },
      async (d) => { // one thick black spine, boxes jutting out from each side
        const s = page(d), n = d.steps.length, cx = X0 + CW / 2, w = 3.85, gap = 0.45;
        t.rect(s, cx - 0.06, Y0, 0.12, Y1 - Y0, C.ink, { name: 'Spine' });
        const rh = (Y1 - Y0) / n, bh = Math.max(rh + 0.32, 1.28);
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Math.min(Y0 + i * rh, Y1 - bh - 0.09), x = right ? cx + gap : cx - gap - w;
          t.rect(s, right ? cx : x + w, y + bh / 2 - 0.05, gap, 0.1, C.ink, { name: 'Link' });
          hard(s, x, y, w, bh, right ? C.white : C.cyan, 0.07);
          t.rect(s, cx - 0.24, y + bh / 2 - 0.24, 0.48, 0.48, C.pink, { line: { color: C.ink, width: 2.5 }, name: 'Point' });
          t.text(s, String(i + 1), { x: cx - 0.24, y: y + bh / 2 - 0.24, w: 0.48, h: 0.48, fontFace: F.mono, bold: true, fontSize: 16, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.05, w - 0.3, 0.34, { max: 14 });
          body(s, st.t, x + 0.15, y + 0.4, w - 0.3, bh - 0.45, { color: C.ink, max: 12 });
        });
      },
      async (d) => { // a pink page: an arrow-signs convoy, each sign pointing at the next, a box hanging from it
        const s = loud(d, C.pink), n = d.steps.length, w = CW / n, by = 2.45;
        d.steps.forEach((st, i) => {
          const x = X0 + i * w;
          t.rect(s, x + 0.05, by, w - 0.18, Y1 - by - 0.09, C.white, { line: { color: C.ink, width: 2.5 }, name: 'Box' });
          body(s, st.t, x + 0.17, by + 0.14, w - 0.42, Y1 - by - 0.32, { color: C.ink, max: 13 });
        });
        for (let i = n - 1; i >= 0; i--) {
          const x = X0 + i * w, st = d.steps[i];
          t.shape(s, 'PENTAGON', { x: x + 0.05, y: 1.5, w: w + 0.02, h: 0.95, fill: { color: i % 2 ? C.cyan : C.bg }, line: { color: C.ink, width: 2.5 }, objectName: 'Sign' });
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: 1.52, w: 0.6, h: 0.3, fontFace: F.mono, bold: true, fontSize: 13, valign: 'middle' });
          head(s, st.h, x + 0.14, 1.8, w - 0.38, 0.6, { max: 14, valign: 'top' });
        }
      },
      async (d) => { // a printout from the terminal: one black box, a mono line per step
        const s = page(d), n = d.steps.length, y0 = Y0, h = Y1 - Y0 - 0.09, rh = (h - 0.2) / n;
        hardC(s, X0, y0, CW, h, C.ink, C.pink, 0.1);
        d.steps.forEach((st, i) => {
          const y = y0 + 0.1 + i * rh;
          t.text(s, `${L.pad2(i + 1)} →`, { x: X0 + 0.2, y, w: 0.85, h: 0.32, fontFace: F.mono, fontSize: 14, bold: true, color: C.pink, valign: 'middle' });
          head(s, st.h, X0 + 1.1, y, CW - 1.3, 0.32, { font: F.mono, color: C.bg, max: 15 });
          body(s, st.t, X0 + 1.1, y + 0.33, CW - 1.3, rh - 0.36, { font: F.mono, color: C.white, max: 12 });
        });
      },
    ],
    stats: [
      async (d) => { // one enormous sticker, two small ones stacked by it
        const s = page(d), [a, ...rest] = d.stats, h = d.note ? 2.72 : Y1 - Y0 - 0.09;
        hard(s, X0, Y0, 5.0, h, C.pink, 0.12);
        t.text(s, a.value, { x: X0 + 0.25, y: Y0 + 0.1, w: 4.5, h: h - 1.0, bold: true, valign: 'middle', fontSize: L.fit(a.value, 4.5, h - 1.05, 80, 30, F.head, true) });
        body(s, a.label, X0 + 0.25, Y0 + h - 0.85, 4.5, 0.75, { font: F.mono, bold: true, color: C.ink, max: 13 });
        rest.forEach((x, i) => {
          const rh = (h - 0.18) / 2, y = Y0 + i * (rh + 0.18), px = X0 + 5.3;
          hard(s, px, y, CW - 5.3, rh, i ? C.cyan : C.white, 0.07);
          t.text(s, x.value, { x: px + 0.15, y: y + 0.05, w: CW - 5.6, h: rh * 0.5, bold: true, valign: 'middle', fontSize: L.fit(x.value, CW - 5.6, rh * 0.48, 32, 18, F.head, true) });
          body(s, x.label, px + 0.15, y + rh * 0.52, CW - 5.6, rh * 0.46, { color: C.ink, max: 12 });
        });
        if (d.note) body(s, d.note, X0, Y0 + h + 0.18, CW, Y1 - Y0 - h - 0.14, { font: F.mono, color: C.ink, max: 12 });
      },
      async (d) => { // a cyan page: three bursts at uneven heights, tags under them
        const s = loud(d, C.cyan), cw = CW / 3, dd = d.note ? 1.72 : 2.05;
        d.stats.forEach((x, i) => {
          const cx = X0 + i * cw + cw / 2, y = 1.42 + (i === 1 ? 0.14 : 0);
          burst(s, cx - dd / 2, y, dd, [C.bg, C.pink, C.white][i]);
          t.text(s, x.value, { x: cx - dd * 0.32, y, w: dd * 0.64, h: dd, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd * 0.6, dd * 0.4, 30, 13, F.head, true) });
          body(s, x.label, cx - cw / 2 + 0.15, y + dd + 0.06, cw - 0.3, d.note ? 0.52 : 0.95, { font: F.mono, bold: true, color: C.ink, align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, X0, 4.2, CW, 0.9, { color: C.ink, align: 'center', max: 12 });
      },
      async (d) => { // a black page: the scoreboard, figures on yellow plates
        const s = loud(d, C.ink), rh = d.note ? 0.9 : 1.15;
        d.stats.forEach((x, i) => {
          const y = Y0 + i * rh;
          t.rect(s, X0, y, 3.6, rh - 0.14, C.bg, { name: 'Plate' });
          t.text(s, x.value, { x: X0 + 0.1, y, w: 3.4, h: rh - 0.14, fontFace: F.mono, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 3.35, rh - 0.2, 40, 18, F.mono, true) });
          body(s, x.label, X0 + 3.85, y, CW - 3.85, rh - 0.14, { color: C.white, valign: 'middle', max: 16, bold: true });
          t.rect(s, X0 + 3.85, y + rh - 0.1, CW - 3.85, 0.04, C.pink, { name: 'Bar' });
        });
        if (d.note) body(s, d.note, X0, Y0 + 3 * rh + 0.04, CW, Y1 - Y0 - 3 * rh - 0.02, { font: F.mono, color: C.bg, max: 12 });
      },
    ],
    compare: [
      async (d) => { // two heavy boxes butted together, mirrored, a burst on the seam
        const s = page(d), w = CW / 2, h = Y1 - Y0 - 0.1, tw = w - 0.75, cx = X0 + w;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, tw, F.body, 0.16, h - 0.85);
        t.rect(s, X0 + 0.1, Y0 + 0.1, CW, h, C.ink, { name: 'Hard shadow' });
        t.rect(s, X0, Y0, w, h, C.pink, { line: { color: C.ink, width: 2.5 }, name: 'Box' }); t.rect(s, cx, Y0, w, h, C.cyan, { line: { color: C.ink, width: 2.5 }, name: 'Box' });
        head(s, d.left.h, X0 + 0.2, Y0 + 0.14, tw, 0.5, { align: 'right', max: 20 }); head(s, d.right.h, cx + 0.55, Y0 + 0.14, tw, 0.5, { max: 20 });
        const av = h - 0.85; let y = Y0 + 0.74;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: X0 + 0.2, y, w: tw, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.55, y, w: tw, h: rows[k], fontSize: fs, color: C.ink });
          y += Math.max(rows[k], Math.min(0.7, av / rows.length));
        }
        burst(s, cx - 0.45, Y0 + h / 2 - 0.45, 0.9, C.bg);
        t.text(s, '≠', { x: cx - 0.45, y: Y0 + h / 2 - 0.45, w: 0.9, h: 0.9, bold: true, fontSize: 22, align: 'center', valign: 'middle' });
      },
      async (d) => { // two stacked bands: a white sticker above, a black one below, each with a tab
        const s = page(d), h = (Y1 - Y0 - 0.34) / 2;
        [d.left, d.right].forEach((side, i) => {
          const y = Y0 + i * (h + 0.2), dark = i === 1, ink = dark ? C.white : C.ink, n = side.items.length, rh = (h - 0.14) / n;
          hardC(s, X0, y, CW, h, dark ? C.ink : C.white, dark ? C.pink : C.ink, 0.08);
          t.rect(s, X0, y, 2.5, h, dark ? C.pink : C.cyan, { line: { color: C.ink, width: 2.5 }, name: 'Tab' });
          head(s, side.h, X0 + 0.15, y + 0.08, 2.2, h - 0.16, { max: 17 });
          side.items.forEach((it, k) => {
            t.text(s, '→', { x: X0 + 2.66, y: y + 0.07 + k * rh, w: 0.3, h: rh - 0.02, fontFace: F.mono, bold: true, fontSize: 13, color: ink, valign: 'middle' });
            body(s, it, X0 + 3.0, y + 0.07 + k * rh, CW - 3.15, rh - 0.02, { color: ink, valign: 'middle', max: 13 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // a black page: the words shout in yellow, the note on a pink sticker
        const s = loud(d, C.ink), hh = d.caption ? 2.15 : 3.5;
        t.text(s, L.runs(d.text), { x: X0, y: 1.42, w: CW, h: hh, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(d.text, CW, hh - 0.05, 44, 22, F.head, true) });
        if (d.caption) { hardC(s, X0, 3.68, CW, 1.34, C.pink, C.white, 0.07); t.text(s, d.caption, { x: X0 + 0.18, y: 3.73, w: CW - 0.36, h: 1.24, fontFace: F.mono, bold: true, fontSize: L.fit(d.caption, CW - 0.36, 1.24, 13, 10, F.mono, true), valign: 'middle' }); }
      },
      async (d) => { // a cyan page: a burst shouts beside the words, hazard tape under them, the note below
        const s = loud(d, C.cyan), hh = d.caption ? 1.98 : 3.1;
        burst(s, 7.65, 1.45, 1.7, C.pink);
        t.text(s, '!', { x: 7.65, y: 1.45, w: 1.7, h: 1.7, bold: true, fontSize: 48, align: 'center', valign: 'middle' });
        t.text(s, L.runs(d.text), { x: X0, y: 1.42, w: 6.85, h: hh, bold: true, valign: 'middle', fontSize: L.fit(d.text, 6.85, hh - 0.04, 36, 18, F.head, true) });
        await tape(s, 0, 1.46 + hh, W, 0.18);
        if (d.caption) t.text(s, d.caption, { x: X0, y: 1.72 + hh, w: CW, h: Y1 - 1.72 - hh + 0.1, fontSize: L.fit(d.caption, CW, Y1 - 1.72 - hh + 0.1, 14, 10, F.body), color: C.ink });
      },
    ],
    timeline: [
      async (d) => { // a ladder: a thick rail, year tags, sticker rows stepping aside
        const s = page(d), n = d.items.length, rh = (Y1 - Y0 - 0.06) / n, lx = 2.05;
        t.rect(s, lx - 0.06, Y0, 0.12, Y1 - Y0, C.ink, { name: 'Rail' });
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.rect(s, X0, y + 0.1, 1.3, 0.42, C.ink, { name: 'Year tag' });
          t.text(s, it.year, { x: X0 + 0.04, y: y + 0.1, w: 1.22, h: 0.42, fontFace: F.mono, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.2, 0.4, 15, 9, F.mono, true) });
          t.rect(s, lx - 0.13, y + 0.2, 0.26, 0.26, i % 2 ? C.cyan : C.pink, { line: { color: C.ink, width: 2.5 }, name: 'Point' });
          hard(s, lx + 0.35, y + 0.02, X0 + CW - lx - 0.35, rh - 0.12, C.white, 0.06);
          head(s, it.h, lx + 0.48, y + 0.04, 6.3, 0.28, { max: 14 });
          body(s, it.t, lx + 0.48, y + 0.32, X0 + CW - lx - 0.6, rh - 0.44, { color: C.ink, max: 12 });
        });
      },
      async (d) => { // a black page: towers of stickers, each date's tower stands taller
        const s = loud(d, C.ink), n = d.items.length, gap = 0.18, w = (CW - gap * (n - 1)) / n, fills = [C.white, C.cyan, C.pink, C.bg];
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + gap), y = 2.0 - i * 0.16, h = Y1 - y - 0.05;
          t.rect(s, x, y, w, h, fills[i], { line: { color: C.ink, width: 2.5 }, name: 'Tower' });
          t.rect(s, x, y, w, 0.5, C.ink, { line: { color: fills[i], width: 2.5 }, name: 'Tower top' });
          t.text(s, it.year, { x: x + 0.05, y, w: w - 0.1, h: 0.5, fontFace: F.mono, bold: true, color: fills[i], align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.15, 0.45, 18, 10, F.mono, true) });
          head(s, it.h, x + 0.12, y + 0.56, w - 0.24, 0.42, { max: 14 });
          body(s, it.t, x + 0.12, y + 1.0, w - 0.24, h - 1.08, { color: C.ink, max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process (sticker columns) read like the cards page
  R.stats = V.stats.shift(); // the old stats (three sticker boxes) too
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (_t, _s, d) => ({ x: 0.6, y: 5.28, w: 8.8, h: 0.22, color: d._ink || C.ink, fontFace: 'Courier New' }));
  return L.save(pres, out, { name: 'SlideAI Brutalist', colors: { dk1: C.ink, lt1: C.white, dk2: C.gray, lt2: C.bg, accent1: C.pink, accent2: C.cyan, accent3: C.bg, accent4: C.ink, accent5: C.gray, accent6: 'FFF3A8', hlink: C.ink, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "o'tkir va to'g'ridan-to'g'ri: shiorga o'xshash qisqa iboralar", "limits": {"card_h": 18, "card_t4": 60}};
module.exports = { id: 12, slug: 'brutalist', name: 'Brutalist', category: 'creative', build, style: STYLE };
