/**
 * 01 Aurora — dark tech look: blurred aurora light, frosted-glass panels, cyan accent.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '0B1020', ink: 'F5F7FB', muted: 'A9B4CB', cyan: '22D3EE', violet: '8B5CF6', pink: 'EC4899' };
const F = { head: 'Arial', body: 'Arial' };

function auroraSvg(kind) {
  const blobs = {
    cover: [[1260, 170, 340, '7C3AED', 0.9], [1500, 720, 270, '06B6D4', 0.8], [930, 860, 230, 'EC4899', 0.55]],
    content: [[1540, -40, 260, '7C3AED', 0.45], [-60, 960, 240, '06B6D4', 0.35]],
    center: [[160, 120, 280, '7C3AED', 0.6], [1460, 820, 300, '06B6D4', 0.55], [1350, 80, 160, 'EC4899', 0.35]],
  }[kind];
  const grid = [];
  for (let x = 80; x < 1600; x += 80) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="900"/>`);
  for (let y = 60; y < 900; y += 80) grid.push(`<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs><filter id="b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="120"/></filter></defs>
  <rect width="1600" height="900" fill="#${C.bg}"/>
  <g filter="url(#b)">${blobs.map(([x, y, r, c, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#${c}" opacity="${o}"/>`).join('')}</g>
  <g stroke="#FFFFFF" stroke-opacity="0.035" stroke-width="1">${grid.join('')}</g></svg>`;
}
const lineSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1720" height="8"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="1720" height="8" rx="4" fill="url(#g)"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const art = { cover: await L.svg(auroraSvg('cover'), 1600, 900, true), content: await L.svg(auroraSvg('content'), 1600, 900, true), center: await L.svg(auroraSvg('center'), 1600, 900, true) };
  const gline = await L.svg(lineSvg, 1720, 8);

  const slide = (kind) => { const s = pres.addSlide(); s.background = { data: art[kind] }; return s; };
  const num = (s) => { s.slideNumber = { x: 8.9, y: 5.12, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: C.muted, align: 'right' }; };
  const glass = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, 'FFFFFF', { t: 92, r: 0.14, line: { color: o.border || 'FFFFFF', width: o.bw || 0.75, transparency: o.border ? 0 : 80 }, name: 'Glass panel' });
  const title = (s, text) => t.text(s, text, { x: 0.7, y: 0.45, w: 8.6, h: 0.8, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(text, 8.6, 0.8, 30, 20, F.head, true) });
  const dot = (s, cx, cy) => { t.oval(s, cx - 0.18, cy - 0.18, 0.36, 0.36, C.cyan, { t: 75 }); t.oval(s, cx - 0.08, cy - 0.08, 0.16, 0.16, C.cyan); };

  const R = {
    async cover(d) {
      const s = slide('cover');
      const fs = L.fit(d.title, 6.0, 2.3, 50, 30, F.head, true, 0.95), th = L.height(d.title, fs, 6.0, F.head, true, 0.95);
      const sh = d.subtitle ? L.height(d.subtitle, 17, 5.6, F.body) : 0, y = (H - th - 0.35 - sh) / 2;
      t.rect(s, 0.7, y - 0.45, 0.6, 0.06, C.cyan, { name: 'Accent' });
      t.text(s, d.title, { x: 0.7, y: y - 1, w: 6.0, h: th + 1.05, fontFace: F.head, bold: true, fontSize: fs, lineSpacingMultiple: 0.95, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: y + th + 0.35, w: 5.6, h: sh + 0.05, fontSize: 17, color: C.muted });
    },
    async agenda(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const per = Math.ceil(d.items.length / 2), rh = Math.min(1.08, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.55 + (i % per) * rh;
        glass(s, x, y, 4.2, rh - 0.2);
        t.text(s, L.pad2(i + 1), { x: x + 0.3, y, w: 0.7, h: rh - 0.2, fontSize: 20, bold: true, color: C.cyan, valign: 'middle', fontFace: F.head });
        t.text(s, it, { x: x + 1.05, y, w: 2.95, h: rh - 0.2, fontSize: 16, valign: 'middle' });
      });
    },
    async cards(d) {
      if (d.items.length > 3) { // 2 x 2 glass panels, icon on the left
        const s = slide('content'); num(s); title(s, d.title);
        const w = 4.15, rws = Math.ceil(d.items.length / 2), h = (3.4 - 0.3 * (rws - 1)) / rws;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + (i % 2) * (w + 0.3), y = 1.55 + Math.floor(i / 2) * (h + 0.3);
          glass(s, x, y, w, h);
          t.oval(s, x + 0.3, y + 0.3, 0.6, 0.6, C.cyan, { t: 82 });
          t.img(s, await L.icon(it.icon, C.cyan, 1.75), x + 0.44, y + 0.44, 0.32, 0.32);
          t.text(s, it.h, { x: x + 1.15, y: y + 0.28, w: w - 1.4, h: 0.4, fontSize: 17, bold: true, fontFace: F.head });
          t.text(s, it.t, { x: x + 1.15, y: y + 0.7, w: w - 1.35, h: h - 0.75, fontSize: L.fit(it.t, w - 1.35, h - 0.8, 14, 12, F.body), color: C.muted });
        }
        return;
      }
      const s = slide('content'); num(s); title(s, d.title);
      const n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
      const h = Math.min(3.35, 1.7 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.4);
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.45, 18, 13, F.head, true)));
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + gap), y = 1.6;
        glass(s, x, y, w, h);
        t.oval(s, x + 0.3, y + 0.3, 0.64, 0.64, C.cyan, { t: 82 });
        t.img(s, await L.icon(it.icon, C.cyan, 1.75), x + 0.45, y + 0.45, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.2, w: w - 0.6, h: 0.45, fontSize: hfs, bold: true, fontFace: F.head });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.7, w: w - 0.6, h: h - 1.9, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const n = d.steps.length, cw = 8.6 / n, ly = 2.55;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.45, 18, 12, F.head, true)));
      t.img(s, gline, 0.7, ly - 0.02, 8.6, 0.04);
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * cw;
        t.text(s, L.pad2(i + 1), { x, y: 1.55, w: cw - 0.3, h: 0.7, fontSize: 36, bold: true, color: i === n - 1 ? C.violet : C.cyan, fontFace: F.head, valign: 'bottom' });
        dot(s, x + 0.18, ly);
        t.text(s, st.h, { x, y: 2.9, w: cw - 0.3, h: 0.45, fontSize: hfs, bold: true, fontFace: F.head });
        t.text(s, st.t, { x, y: 3.4, w: cw - 0.35, h: 1.5, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const n = d.stats.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * (w + gap);
        glass(s, px, 1.6, w, 2.55);
        t.text(s, x.value, { x: px + 0.35, y: 1.85, w: w - 0.7, h: 1.0, fontSize: L.fit(x.value, w - 0.7, 1.0, 52, 30, F.head, true), bold: true, color: C.cyan, fontFace: F.head, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.35, y: 3.0, w: w - 0.7, h: 1.0, fontSize: 15, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.45, w: 8.6, h: 0.5, fontSize: 14, italic: true, color: C.muted });
    },
    async compare(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const w = 4.15, { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 1.0, F.body, 0, 4.85 - 2.5 - 0.2 * Math.max(d.left.items.length, d.right.items.length));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * 4.45;
        glass(s, x, 1.6, w, 3.35, i ? { border: C.cyan, bw: 1.25 } : {});
        t.text(s, side.h, { x: x + 0.35, y: 1.85, w: w - 0.7, h: 0.45, fontSize: 20, bold: true, color: i ? C.cyan : C.ink, fontFace: F.head });
        let y = 2.5;
        side.items.forEach((it, k) => {
          const h = rows[k];
          t.oval(s, x + 0.38, y + 0.1, 0.08, 0.08, i ? C.cyan : C.muted);
          t.text(s, it, { x: x + 0.6, y, w: w - 1.0, h: h + 0.05, fontSize: CFS });
          y += h + 0.2;
        });
      });
    },
    async statement(d) {
      const s = slide('center'); num(s);
      const fs = L.fit(d.text, 8.2, 1.6, 40, 24, F.head, true), th = L.height(d.text, fs, 8.2, F.head, true);
      const ch = d.caption ? L.height(d.caption, 16, 6.6, F.body) : 0, y = (H - (0.6 + th + 0.35 + ch)) / 2;
      t.text(s, d.title, { x: 0.9, y, w: 8.2, h: 0.4, fontSize: 14, bold: true, color: C.cyan, align: 'center' });
      t.text(s, L.runs(d.text), { x: 0.9, y: y + 0.6, w: 8.2, h: th + 0.05, fontSize: fs, bold: true, align: 'center', fontFace: F.head, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.7, y: y + 0.95 + th, w: 6.6, h: ch + 0.05, fontSize: 16, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const n = d.items.length, cw = 8.6 / n, ly = 2.45;
      t.img(s, gline, 0.7, ly - 0.02, 8.6, 0.04);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * cw;
        t.text(s, it.year, { x, y: 1.5, w: cw - 0.2, h: 0.65, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 16, F.head, true), bold: true, color: C.cyan, valign: 'bottom', fontFace: F.head });
        dot(s, x + 0.18, ly);
        t.text(s, it.h, { x, y: 2.8, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true, fontFace: F.head });
        t.text(s, it.t, { x, y: 3.25, w: cw - 0.35, h: 1.7, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = slide('center');
      const fs = L.fit(d.text, 7.8, 1.9, 32, 20, F.body, false), th = L.height(d.text, fs, 7.8, F.body);
      const y = (H - (0.9 + th + 0.5)) / 2;
      t.text(s, '\u201C', { x: 4.4, y: y - 0.35, w: 1.2, h: 1.2, fontSize: 96, bold: true, color: C.cyan, align: 'center', fontFace: 'Arial' });
      t.text(s, d.text, { x: 1.1, y: y + 0.85 - 1, w: 7.8, h: th + 1.05, fontSize: fs, italic: true, align: 'center', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 1.1, y: y + 1.1 + th, w: 7.8, h: 0.4, fontSize: 15, color: C.cyan, align: 'center' });
    },
    async closing(d) {
      const s = slide('center');
      const fs = L.fit(d.title, 8.0, 1.6, 50, 30, F.head, true), th = L.height(d.title, fs, 8.0, F.head, true);
      const sh = d.subtitle ? L.height(d.subtitle, 17, 6.6, F.body) : 0, y = (H - th - 0.3 - sh) / 2;
      t.text(s, d.title, { x: 1.0, y: y - 1, w: 8.0, h: th + 1.05, fontSize: fs, bold: true, align: 'center', fontFace: F.head, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.7, y: y + th + 0.3, w: 6.6, h: sh + 0.05, fontSize: 17, color: C.muted, align: 'center' });
    },
  };

  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = slide('content'); num(s); title(s, d.title);
      glass(s, 0.7, 1.5, 4.0, 3.45); await PH(s, d.image, 0.82, 1.62, 3.76, 3.21, { mask: { r: 0.12 } });
      t.text(s, d.text, { x: 5.0, y: 1.5, w: 4.4, h: 3.45, fontSize: L.fit(d.text, 4.4, 3.45, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = slide('content'); num(s); title(s, d.title);
      t.rect(s, 0.7, 1.6, 0.06, 3.2, C.cyan, { name: 'Accent' });
      t.text(s, d.text, { x: 0.95, y: 1.5, w: 4.0, h: 3.45, fontSize: L.fit(d.text, 4.0, 3.45, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      glass(s, 5.3, 1.5, 4.0, 3.45); await PH(s, d.image, 5.42, 1.62, 3.76, 3.21, { mask: { r: 0.12 } });
    },
    async sources(d) {
      const s = slide('content'); num(s); title(s, d.title);
      const n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.7, y, w: 0.6, h: rh, fontSize: 14, bold: true, color: C.cyan, valign: 'middle' });
        t.text(s, it, { x: 1.35, y, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.rect(s, 6.95, 0.85, 2.55, 3.95, 'FFFFFF', { t: 88, r: 0.2, line: { color: 'FFFFFF', width: 0.75, transparency: 70 } }); await PH(s, d.image, 7.05, 0.95, 2.35, 3.75, { mask: { r: 0.16 } }); },
  });
  // ---- further ways to draw a type, in glass and aurora light: a deck's pages must not look alike (L.pages)
  const page = (d, kind = 'content') => { const s = slide(kind); num(s); title(s, d.title); return s; };
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const para = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: o.valign || 'top' });
  const glow = async (s, x, y, d, ic, c = C.cyan) => { t.oval(s, x - 0.09, y - 0.09, d + 0.18, d + 0.18, c, { t: 80 }); t.oval(s, x, y, d, d, C.bg, { line: { color: c, width: 1.5 } }); t.img(s, await L.icon(ic, c, 2), x + d * 0.28, y + d * 0.28, d * 0.44, d * 0.44); };
  const V = {
    image: [
      async (d) => { // the picture across the page, a line of light under it
        const s = page(d);
        await PH(s, d.image, 0.7, 1.3, 8.6, 1.9, { mask: { r: 0.08 } });
        t.img(s, gline, 0.7, 3.27, 8.6, 0.04);
        para(s, d.text, 0.7, 3.42, 8.6, 1.62, { max: 14 });
      },
      async (d) => { // a pane of glass laid over a large picture
        const s = page(d);
        await PH(s, d.image, 0.7, 1.35, 5.6, 3.65, { mask: { r: 0.08 } });
        t.rect(s, 5.0, 1.75, 4.3, 2.9, C.bg, { t: 8, r: 0.14, line: { color: C.cyan, width: 1 }, name: 'Glass panel' });
        para(s, d.text, 5.22, 1.9, 3.86, 2.6, { max: 14, valign: 'middle' });
      },
      async (d) => { // the picture fills the page under a dark veil
        const s = slide('content'); num(s);
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0, 0, W, H, C.bg, { t: 30, name: 'Veil' });
        head(s, d.title, 0.7, 0.55, 8.6, 1.0, { max: 32 });
        t.img(s, gline, 0.7, 1.58, 3, 0.04);
        para(s, d.text, 0.7, 1.8, 6.4, 3.2, { max: 16 });
      },
      async (d) => { // a round picture in rings of light
        const s = page(d, 'center'), r = 3.3, x = 0.95, y = 1.5;
        for (const [k, c] of [[0.34, C.violet], [0.17, C.cyan]]) t.oval(s, x - k, y - k, r + 2 * k, r + 2 * k, null, { line: { color: c, width: 1 } });
        t.img(s, await L.photo(L.src(d.image), r, r, { mask: 'circle' }), x, y, r, r, { alt: '' });
        para(s, d.text, 4.95, 1.45, 4.35, 3.5, { valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a hub: lines of light from one glowing node to every item
        const s = page(d, 'center'), n = d.items.length, hub = [5, 3.2], spots = n === 4 ? [[0.7, 1.4], [6.0, 1.4], [0.7, 3.3], [6.0, 3.3]] : [[0.7, 1.4], [6.0, 2.35], [0.7, 3.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > 5, ex = right ? x : x + 3.3, ey = y + 0.8;
          t.line(s, Math.min(ex, hub[0]), Math.min(ey, hub[1]), Math.abs(ex - hub[0]), Math.abs(ey - hub[1]), C.cyan, 1, { t: 40, flipV: (ex < hub[0]) !== (ey < hub[1]) });
          await glow(s, right ? x + 0.05 : x + 2.8, y + 0.04, 0.42, it.icon, i % 2 ? C.violet : C.cyan);
          head(s, it.h, right ? x + 0.62 : x, y, 2.68, 0.5, { align: right ? 'left' : 'right' });
          body(s, it.t, x, y + 0.55, 3.3, 1.25, { align: right ? 'left' : 'right', max: 13 });
        }
        t.oval(s, hub[0] - 0.5, hub[1] - 0.5, 1, 1, C.cyan, { t: 75 }); t.oval(s, hub[0] - 0.22, hub[1] - 0.22, 0.44, 0.44, C.cyan);
      },
      async (d) => { // rows on a single long pane
        const s = page(d), n = d.items.length, h = 3.6 / n;
        glass(s, 0.7, 1.38, 8.6, 3.62);
        for (const [i, it] of d.items.entries()) {
          const y = 1.38 + i * h;
          await glow(s, 0.95, y + (h - 0.5) / 2, 0.5, it.icon, i % 2 ? C.violet : C.cyan);
          head(s, it.h, 1.7, y, 2.4, h, { max: 15 });
          body(s, it.t, 4.2, y + 0.05, 4.9, h - 0.1, { valign: 'middle', max: 13 });
          if (i < n - 1) t.line(s, 1.7, y + h, 7.4, 0, 'FFFFFF', 0.5, { t: 80 });
        }
      },
      async (d) => { // panes hanging at two heights
        const s = page(d), n = d.items.length, gap = 0.18, w = (8.6 - gap * (n - 1)) / n, h = 2.95;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * (w + gap), y = i % 2 ? 2.05 : 1.3;
          glass(s, x, y, w, h, { border: i % 2 ? C.violet : C.cyan, bw: 1 });
          t.img(s, await L.icon(it.icon, i % 2 ? C.violet : C.cyan, 2), x + 0.18, y + 0.2, 0.36, 0.36);
          head(s, it.h, x + 0.18, y + 0.62, w - 0.36, 0.5, { max: 14 });
          body(s, it.t, x + 0.18, y + 1.14, w - 0.36, h - 1.22, { max: 12.5 });
        }
      },
      async (d) => { // no glass at all: icons burn on the dark, words beneath
        const s = page(d, 'center'), n = d.items.length, cw = 8.6 / n;
        t.img(s, gline, 0.7, 2.18, 8.6, 0.04);
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * cw;
          await glow(s, x + 0.08, 1.45, 0.62, it.icon, i % 2 ? C.pink : C.cyan);
          head(s, it.h, x + 0.08, 2.32, cw - 0.25, 0.55);
          body(s, it.t, x + 0.08, 2.9, cw - 0.25, 2.1);
        }
      },
    ],
    process: [
      async (d) => { // a beam down the left edge, steps lit along it
        const s = page(d), n = d.steps.length, h = 3.6 / n;
        t.line(s, 0.95, 1.5, 0, 3.4, C.cyan, 1.5, { t: 40 });
        d.steps.forEach((st, i) => {
          const y = 1.38 + i * h;
          t.oval(s, 0.72, y + 0.04, 0.46, 0.46, C.bg, { line: { color: C.cyan, width: 1.5 } });
          t.text(s, String(i + 1), { x: 0.72, y: y + 0.04, w: 0.46, h: 0.46, bold: true, fontSize: 13, color: C.cyan, align: 'center', valign: 'middle' });
          head(s, st.h, 1.4, y, 7.9, 0.4);
          body(s, st.t, 1.4, y + 0.42, 7.9, h - 0.48, { max: 13 });
        });
      },
      async (d) => { // a rising signal: each pane a little higher than the one before
        const s = page(d), n = d.steps.length, gap = 0.14, w = (8.6 - gap * (n - 1)) / n;
        d.steps.forEach((st, i) => {
          const x = 0.7 + i * (w + gap), y = 2.1 - i * (n === 4 ? 0.26 : 0.38), h = 5.0 - y;
          glass(s, x, y, w, h);
          t.rect(s, x + 0.15, y + 0.12, w - 0.3, 0.05, i === n - 1 ? C.pink : C.cyan, { name: 'Signal' });
          head(s, `${i + 1}. ${st.h}`, x + 0.15, y + 0.22, w - 0.3, 0.55, { max: 14 });
          body(s, st.t, x + 0.15, y + 0.8, w - 0.3, h - 0.88, { max: 12.5 });
        });
      },
      async (d) => { // a circuit: out along the top and back along the bottom
        const s = page(d, 'center'), n = d.steps.length, w = 4.2, h = 1.72;
        d.steps.forEach((st, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, x = wide ? 0.7 : 0.7 + (i < 2 ? i : 3 - i) * (w + 0.2), y = 1.35 + (i < 2 ? 0 : h + 0.14), last = i === n - 1;
          t.rect(s, x, y, ww, h, last ? C.cyan : 'FFFFFF', { t: last ? 0 : 92, r: 0.14, line: { color: C.cyan, width: 1, transparency: last ? 0 : 50 }, name: 'Glass panel' });
          head(s, `${i + 1}  ${st.h}`, x + 0.2, y + 0.1, ww - 0.4, 0.5, { max: 15, color: last ? C.bg : C.cyan });
          body(s, st.t, x + 0.2, y + 0.62, ww - 0.4, h - 0.7, { max: 13, color: last ? C.bg : C.ink });
        });
      },
    ],
    stats: [
      async (d) => { // one number in great glowing rings, the others to its right
        const s = page(d, 'center'), [a, ...rest] = d.stats, r = 3.3, x = 0.85, y = 1.42;
        t.oval(s, x, y, r, r, C.cyan, { t: 90, line: { color: C.cyan, width: 1.5 } });
        t.text(s, a.value, { x: x + 0.3, y: y + 0.65, w: r - 0.6, h: 1.1, bold: true, color: C.cyan, align: 'center', valign: 'middle', fontSize: L.fit(a.value, r - 0.7, 1, 46, 20, F.head, true) });
        body(s, a.label, x + 0.55, y + 1.8, r - 1.1, 0.95, { align: 'center', color: C.ink, max: 12 });
        rest.forEach((v, i) => {
          const py = 1.42 + i * 1.12;
          head(s, v.value, 4.65, py, 4.65, 0.58, { max: 30, color: i ? C.pink : C.violet });
          body(s, v.label, 4.65, py + 0.58, 4.65, 0.46, { max: 12, color: C.ink });
        });
        if (d.note) body(s, d.note, 4.65, 3.75, 4.65, 1.25, { max: 11 });
      },
      async (d) => { // readings, one per line, value at the far right
        const s = page(d), rh = d.note ? 0.92 : 1.15;
        d.stats.forEach((v, i) => {
          const y = 1.38 + i * rh;
          body(s, v.label, 0.7, y, 5.3, rh - 0.1, { valign: 'middle', color: C.ink, max: 15 });
          head(s, v.value, 6.1, y, 3.2, rh - 0.1, { max: 38, color: C.cyan, align: 'right' });
          t.img(s, gline, 0.7, y + rh - 0.06, 8.6, 0.03);
        });
        if (d.note) body(s, d.note, 0.7, 4.2, 8.6, 0.85, { max: 11 });
      },
    ],
    compare: [
      async (d) => { // mirrored about a beam of light
        const s = page(d, 'center'), w = 3.85, cx = 5;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.2, 2.85);
        t.line(s, cx, 1.38, 0, 3.6, C.cyan, 1.5);
        head(s, d.left.h, 0.7, 1.35, w, 0.55, { align: 'right', color: C.pink, max: 19 }); head(s, d.right.h, 5.45, 1.35, w, 0.55, { color: C.cyan, max: 19 });
        let y = 2.02;
        rows.forEach((rh, k) => {
          dot(s, cx, y + 0.12);
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.7, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.45, y, w, h: rh, fontSize: fs, color: C.ink });
          y += rh;
        });
      },
      async (d) => { // two wide panes, one above the other
        const s = page(d), h = 1.74;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.35 + i * (h + 0.14), c = i ? C.cyan : C.pink;
          glass(s, 0.7, y, 8.6, h, { border: c, bw: 1 });
          head(s, side.h, 0.92, y + 0.1, 2.0, h - 0.2, { color: c, max: 17 });
          side.items.forEach((it, k) => body(s, it, 3.1 + (k % 2) * 3.1, y + 0.1 + Math.floor(k / 2) * 0.78, 2.95, 0.74, { color: C.ink, max: 13 }));
        }
      },
    ],
    statement: [
      async (d) => { // the note in a narrow pane on the left, the thought large on the right
        const s = page(d, 'center');
        glass(s, 0.7, 1.4, 2.9, 3.6);
        if (d.caption) body(s, d.caption, 0.9, 1.55, 2.5, 3.3, { valign: 'middle', max: 13, color: C.ink });
        t.text(s, L.runs(d.text), { x: 3.95, y: 1.4, w: 5.35, h: 3.6, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.35, 3.5, 34, 16, F.head, true) });
      },
      async (d) => { // the thought across the sky, the note low and to the right
        const s = page(d, 'cover');
        t.text(s, L.runs(d.text), { x: 0.7, y: 1.3, w: 8.6, h: 2.15, bold: true, color: C.ink, valign: 'top', fontSize: L.fit(d.text, 8.6, 2.1, 38, 17, F.head, true) });
        t.img(s, gline, 4.5, 3.52, 4.8, 0.04);
        if (d.caption) body(s, d.caption, 4.5, 3.65, 4.8, 1.4, { color: C.ink, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // a beam down the middle, events to either side
        const s = page(d, 'center'), cx = 5;
        t.line(s, cx, 1.38, 0, 3.62, C.cyan, 1.5);
        d.items.forEach((it, i) => {
          const right = i % 2 === 1, y = 1.35 + Math.floor(i / 2) * 1.85 + (right ? 0.4 : 0), x = right ? cx + 0.35 : 0.7, w = 3.95, a = right ? 'left' : 'right';
          dot(s, cx, y + 0.2);
          t.text(s, [{ text: it.year + '  ', options: { color: C.cyan, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.42, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.4, 15, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.44, w, 1.2, { align: a, max: 13 });
        });
      },
      async (d) => { // four panes, the year glowing in each
        const s = page(d), w = 4.2, h = 1.74;
        d.items.forEach((it, i) => {
          const x = 0.7 + (i % 2) * (w + 0.2), y = 1.35 + Math.floor(i / 2) * (h + 0.14);
          glass(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.1, y, w: 1.3, h, bold: true, color: i % 2 ? C.violet : C.cyan, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.2, h - 0.3, 24, 10, F.head, true) });
          t.line(s, x + 1.45, y + 0.2, 0, h - 0.4, 'FFFFFF', 0.5, { t: 70 });
          head(s, it.h, x + 1.58, y + 0.08, w - 1.72, 0.4, { max: 14 });
          body(s, it.t, x + 1.58, y + 0.5, w - 1.72, h - 0.58, { max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  L.stamp(SL, content, () => ({ x: 0.7, y: 5.15, w: 7.9, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Aurora', colors: { dk1: C.bg, lt1: C.ink, dk2: '1A2238', lt2: C.muted, accent1: C.cyan, accent2: C.violet, accent3: C.pink, accent4: '06B6D4', accent5: '7C3AED', accent6: 'A9B4CB', hlink: C.cyan, folHlink: C.violet } });
}

/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "zamonaviy, texnologik va ilhomlantiruvchi; qisqa, aniq jumlalar", "limits": {}};
module.exports = { id: 1, slug: 'aurora', name: 'Aurora', category: 'creative', build, style: STYLE };
