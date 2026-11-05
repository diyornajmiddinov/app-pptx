/**
 * 05 Gradient — bold creative look: sunset-to-violet gradients, floating white cards,
 * gradient badges and tiles.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '1E1B3A', muted: '6B6880', coral: 'FF5F6D', orange: 'FFA45B', violet: '8E54E9', blue: '4776E6', soft: 'F4F1FB' };
const F = { head: 'Arial', body: 'Arial' };
const G = { main: [C.coral, C.violet], warm: [C.coral, C.orange], cool: [C.violet, C.blue] };

const gradRect = (w, h, [a, b], r = 0, angle = 135) => {
  const rad = (angle * Math.PI) / 180, x2 = 0.5 + Math.cos(rad) / 2, y2 = 0.5 + Math.sin(rad) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="${1 - x2}" y1="${1 - y2}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient></defs><rect width="${w}" height="${h}" rx="${r}" fill="url(#g)"/></svg>`;
};
const heroSvg = (pair) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${pair[0]}"/><stop offset="1" stop-color="#${pair[1]}"/></linearGradient>
  <filter id="b"><feGaussianBlur stdDeviation="40"/></filter></defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <circle cx="1330" cy="250" r="300" fill="#FFFFFF" opacity="0.10"/><circle cx="1480" cy="760" r="190" fill="#FFFFFF" opacity="0.08"/>
  <circle cx="1180" cy="560" r="410" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="3"/>
  <circle cx="260" cy="980" r="260" fill="#FFFFFF" opacity="0.07" filter="url(#b)"/></svg>`;
const blobSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${C.coral}"/><stop offset="1" stop-color="#${C.violet}"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="30"/></filter></defs><circle cx="300" cy="300" r="220" fill="url(#g)" filter="url(#b)" opacity="0.9"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const img = {};
  const cached = async (k, fn) => (img[k] ??= await fn());
  const hero = (k) => cached('hero' + k, () => L.svg(heroSvg(G[k]), 1600, 900, true));
  const grad = (w, h, k, r) => cached(`g${w}${h}${k}${r}`, () => L.svg(gradRect(Math.round(w * 100), Math.round(h * 100), G[k], r * 100), w * 100, h * 100));
  const blob = () => cached('blob', () => L.svg(blobSvg, 600, 600));

  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, await blob(), 8.1, -1.35, 3.0, 3.0);
    t.text(s, d.title, { x: 0.65, y: 0.42, w: 7.2, h: 0.85, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.85, 30, 20, F.head, true) });
    s.slideNumber = { x: 0.65, y: 5.12, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: C.muted, align: 'left' };
    return s;
  };
  const card = (s, x, y, w, h) => t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.18, shadow: 0.13, blur: 18, offset: 4, shadowColor: '5B3FA0', name: 'Card' });
  const badge = async (s, x, y, d, k = 'main') => t.img(s, await grad(d, d, k, d / 2), x, y, d, d);

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { data: await hero('main') };
      const fs = L.fit(d.title, 6.4, 2.5, 54, 32, F.head, true, 0.95), th = L.height(d.title, fs, 6.4, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.7, y: 3.35 - 2.6, w: 6.4, h: 2.6, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.6, w: 5.8, h: 1.0, fontSize: 18, color: 'FFFFFF', transparency: 10 });
    },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.65 + Math.floor(i / per) * 4.45, y = 1.55 + (i % per) * rh;
        card(s, x, y, 4.2, rh - 0.22);
        await badge(s, x + 0.22, y + (rh - 0.22 - 0.5) / 2, 0.5, i < per ? 'main' : 'cool');
        t.text(s, String(i + 1), { x: x + 0.22, y: y + (rh - 0.22 - 0.5) / 2, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.1, h: rh - 0.22, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      if (d.items.length > 3) { // 2 x 2 white cards, badge on the left
        const s = await page(d), w = 4.2, rws = Math.ceil(d.items.length / 2), h = (3.4 - 0.3 * (rws - 1)) / rws, keys = ['warm', 'main', 'cool', 'main'];
        for (const [i, it] of d.items.entries()) {
          const x = 0.65 + (i % 2) * (w + 0.3), y = 1.55 + Math.floor(i / 2) * (h + 0.3);
          card(s, x, y, w, h);
          await badge(s, x + 0.25, y + 0.25, 0.62, keys[i % 4]);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.41, y + 0.41, 0.3, 0.3);
          t.text(s, it.h, { x: x + 1.1, y: y + 0.22, w: w - 1.35, h: 0.4, fontSize: L.fit(it.h, w - 1.35, 0.4, 17, 12, F.head, true), bold: true, color: C.ink });
          t.text(s, it.t, { x: x + 1.1, y: y + 0.65, w: w - 1.35, h: h - 0.8, fontSize: 14, color: C.muted });
        }
        return;
      }
      const s = await page(d), n = d.items.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.45, 19, 13, F.head, true)));
      const h = Math.min(3.4, 1.85 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.35);
      const keys = ['warm', 'main', 'cool', 'main'];
      for (const [i, it] of d.items.entries()) {
        const x = 0.65 + i * (w + gap), y = 1.55;
        card(s, x, y, w, h);
        await badge(s, x + 0.3, y + 0.32, 0.72, keys[i % 4]);
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.49, y + 0.51, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: 0.45, fontSize: hfs, bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.8, w: w - 0.6, h: h - 1.95, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.7 / n, by = 1.95;
      t.img(s, await grad(8.7, 0.14, 'main', 0.07), 0.65, by + 0.23, 8.7, 0.14);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.45, 18, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.65 + i * cw;
        t.oval(s, x, by, 0.6, 0.6, 'FFFFFF', { line: { color: i % 2 ? C.violet : C.coral, width: 3 } });
        t.text(s, String(i + 1), { x, y: by, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: i % 2 ? C.violet : C.coral, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: by + 0.9, w: cw - 0.3, h: 0.45, fontSize: hfs, bold: true, color: C.ink });
        t.text(s, st.t, { x, y: by + 1.4, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, keys = ['warm', 'main', 'cool'];
      for (const [i, x] of d.stats.entries()) {
        const px = 0.65 + i * (w + gap);
        t.rect(s, px, 1.6, w, 2.5, 'FFFFFF', { r: 0.2, shadow: 0.18, blur: 18, offset: 5, shadowColor: '5B3FA0', name: 'Tile shadow' });
        t.img(s, await grad(w, 2.5, keys[i % 3], 0.2), px, 1.6, w, 2.5);
        t.text(s, x.value, { x: px + 0.35, y: 1.8, w: w - 0.7, h: 1.05, fontSize: L.fit(x.value, w - 0.7, 1.0, 54, 30, F.head, true), bold: true, color: 'FFFFFF', valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.35, y: 2.95, w: w - 0.7, h: 1.0, fontSize: 15, color: 'FFFFFF' });
      }
      if (d.note) t.text(s, d.note, { x: 0.65, y: 4.4, w: 8.7, h: 0.5, fontSize: 14, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.2, h = 3.4, y = 1.55, n = Math.max(d.left.items.length, d.right.items.length);
      const rowsAt = (fs) => Array.from({ length: n }, (_, k) => Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], fs, w - 1.0, F.body) : 0))));
      let fs = 15; while (fs > 12 && rowsAt(fs).reduce((a, b) => a + b + 0.2, 0) > h - 1.2) fs--;
      const rows = rowsAt(fs);
      card(s, 0.65, y, w, h);
      t.rect(s, 5.15, y, w, h, 'FFFFFF', { r: 0.18, shadow: 0.18, blur: 18, offset: 4, shadowColor: '5B3FA0', name: 'Shadow' });
      t.img(s, await grad(w, h, 'main', 0.18), 5.15, y, w, h);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = i ? 5.15 : 0.65, fg = i ? 'FFFFFF' : C.ink;
        t.text(s, side.h, { x: x + 0.4, y: y + 0.35, w: w - 0.8, h: 0.5, fontSize: 21, bold: true, color: i ? 'FFFFFF' : C.coral });
        let yy = y + 1.05;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.42, yy + 0.08, 0.11, 0.11, i ? 'FFFFFF' : C.violet);
          t.text(s, it, { x: x + 0.7, y: yy, w: w - 1.0, h: rows[k] + 0.05, fontSize: fs, color: fg });
          yy += rows[k] + 0.2;
        });
      }
    },
    async statement(d) {
      d._first = true;
      const s = pres.addSlide(); s.background = { data: await hero('cool') };
      const fs = L.fit(d.text, 8.0, 1.6, 44, 26, F.head, true), th = L.height(d.text, fs, 8.0, F.head, true);
      t.text(s, d.title, { x: 1.0, y: 1.2, w: 8.0, h: 0.4, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', transparency: 15 });
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.75, w: 8.0, h: 1.9, fontSize: fs, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.8, y: 3.8, w: 6.4, h: 1.2, fontSize: 16, color: 'FFFFFF', align: 'center' });
      s.slideNumber = { x: 0.65, y: 5.12, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: 'FFFFFF' };
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.7 / n, ly = 2.55;
      t.img(s, await grad(8.7, 0.06, 'main', 0.03), 0.65, ly - 0.03, 8.7, 0.06);
      for (const [i, it] of d.items.entries()) {
        const x = 0.65 + i * cw;
        t.text(s, it.year, { x, y: 1.55, w: cw - 0.2, h: 0.7, fontSize: L.fit(it.year, cw - 0.3, 0.65, 30, 16, F.head, true), bold: true, color: [C.coral, C.violet, C.blue, C.coral][i % 4], valign: 'bottom' });
        await badge(s, x, ly - 0.16, 0.32, i % 2 ? 'cool' : 'warm');
        t.text(s, it.h, { x, y: 2.95, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.4, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.soft };
      t.img(s, await blob(), -1.4, 1.2, 4.2, 4.2);
      const fs = L.fit(d.text, 6.4, 2.4, 34, 20, F.head, true), th = L.height(d.text, fs, 6.4, F.head, true);
      const bottom = (H + th) / 2 + 0.2;
      t.text(s, '\u201C', { x: 2.6, y: bottom - th - 1.15, w: 1.2, h: 1.2, fontSize: 110, bold: true, color: C.coral, fontFace: 'Arial' });
      t.text(s, d.text, { x: 2.75, y: bottom - 2.6, w: 6.4, h: 2.6, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 2.75, y: bottom + 0.25, w: 6.4, h: 0.4, fontSize: 16, color: C.violet, bold: true });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { data: await hero('main') };
      const fs = L.fit(d.title, 7.6, 2.2, 50, 30, F.head, true);
      t.text(s, d.title, { x: 0.7, y: 0.9, w: 7.6, h: 2.4, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.7, y: 3.6, w: 6.0, h: 1.0, fontSize: 18, color: 'FFFFFF' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = await page(d);
      t.rect(s, 0.65, 1.55, 4.0, 3.35, 'FFFFFF', { r: 0.2, shadow: 0.15, blur: 18, offset: 4, shadowColor: '5B3FA0', name: 'Shadow' });
      await PH(s, d.image, 0.65, 1.55, 4.0, 3.35, { mask: { r: 0.2 } });
      t.text(s, d.text, { x: 5.0, y: 1.55, w: 4.4, h: 3.35, fontSize: L.fit(d.text, 4.4, 3.35, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = await page(d);
      card(s, 0.65, 1.55, 4.1, 3.35);
      t.text(s, d.text, { x: 0.95, y: 1.75, w: 3.5, h: 2.95, fontSize: L.fit(d.text, 3.5, 2.95, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      t.rect(s, 5.05, 1.55, 4.3, 3.35, 'FFFFFF', { r: 0.2, shadow: 0.15, blur: 18, offset: 4, shadowColor: '5B3FA0', name: 'Shadow' });
      await PH(s, d.image, 5.05, 1.55, 4.3, 3.35, { mask: { r: 0.2 } });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.oval(s, 0.65, y + (rh - 0.36) / 2, 0.36, 0.36, i % 2 ? C.violet : C.coral);
        t.text(s, String(i + 1), { x: 0.65, y: y + (rh - 0.36) / 2, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontSize: L.fit(it, 8.2, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.oval(s, 7.2, 1.15, 2.6, 2.6, null, { line: { color: 'FFFFFF', width: 3 } }); await PH(s, d.image, 7.3, 1.25, 2.4, 2.4, { mask: 'circle' }); },
  });
  // ---- further ways to draw a type, in sunset gradients and floating cards: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const para = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const gblock = async (s, x, y, w, h, k = 'main', r = 0.18) => t.img(s, await grad(w, h, k, r), x, y, w, h);
  const warm = async (d, k = 'cool') => { d._warm = true; const s = pres.addSlide(); s.background = { data: await hero(k) }; t.text(s, d.title, { x: 0.65, y: 0.42, w: 8.7, h: 0.85, fontFace: F.head, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.7, 0.85, 30, 20, F.head, true) }); return s; };
  const keys = ['main', 'cool', 'main', 'cool'], tones = [C.coral, C.violet, C.blue, C.orange];
  const iconIn = async (s, x, y, d2, ic, k) => { await badge(s, x, y, d2, k); t.img(s, await L.icon(ic, 'FFFFFF', 2), x + d2 * 0.27, y + d2 * 0.27, d2 * 0.46, d2 * 0.46); };
  const V = {
    image: [
      async (d) => { // a wide rounded picture with a gradient edge, the text under it
        const s = await page(d);
        await gblock(s, 0.59, 1.34, 8.82, 1.97, 'main', 0.2);
        await PH(s, d.image, 0.65, 1.4, 8.7, 1.85, { mask: { r: 0.2 } });
        para(s, d.text, 0.65, 3.45, 8.7, 1.6, { max: 14 });
      },
      async (d) => { // on the gradient: a round picture, white words
        const s = await warm(d, 'main');
        t.oval(s, 5.72, 1.28, 3.66, 3.66, null, { line: { color: 'FFFFFF', width: 4 } });
        t.img(s, await L.photo(L.src(d.image), 3.5, 3.5, { mask: 'circle' }), 5.8, 1.36, 3.5, 3.5, { alt: '' });
        para(s, d.text, 0.65, 1.4, 4.75, 3.5, { color: 'FFFFFF', valign: 'middle' });
      },
      async (d) => { // the picture fills the page, one white card floats on it
        d._warm = true;
        const s = pres.addSlide();
        await PH(s, d.image, 0, 0, W, H);
        await gblock(s, 0, 5.0, W, 0.625, 'main', 0);
        card(s, 4.75, 0.45, 4.7, 4.3);
        head(s, d.title, 5.0, 0.6, 4.2, 0.95, { max: 24 });
        para(s, d.text, 5.0, 1.6, 4.2, 3.0, { max: 14 });
      },
      async (d) => { // a gradient block with the words, the picture overlapping its edge
        const s = await page(d);
        await gblock(s, 0.65, 1.5, 6.0, 3.45, 'cool', 0.2);
        para(s, d.text, 0.9, 1.65, 4.3, 3.15, { color: 'FFFFFF', valign: 'middle', max: 14 });
        await PH(s, d.image, 5.45, 1.3, 3.9, 3.0, { mask: { r: 0.2 } });
      },
    ],
    cards: [
      async (d) => { // whole tiles of gradient, white words
        const s = await page(d), n = d.items.length, gap = 0.2, w = (8.7 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.65 + i * (w + gap);
          await gblock(s, x, 1.45, w, 3.5, keys[i]);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.2, 1.65, 0.45, 0.45);
          head(s, it.h, x + 0.2, 2.2, w - 0.4, 0.6, { color: 'FFFFFF' });
          body(s, it.t, x + 0.2, 2.85, w - 0.4, 2.0, { color: 'FFFFFF' });
        }
      },
      async (d) => { // long pills, one under another
        const s = await page(d), n = d.items.length, h = 3.55 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.42 + i * h;
          card(s, 0.65, y, 8.7, h - 0.14);
          await iconIn(s, 0.82, y + (h - 0.14 - 0.54) / 2, 0.54, it.icon, keys[i]);
          head(s, it.h, 1.55, y, 2.4, h - 0.14, { max: 15 });
          body(s, it.t, 4.05, y + 0.04, 5.1, h - 0.22, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // on the gradient: white cards at two heights
        const s = await warm(d), n = d.items.length, gap = 0.18, w = (8.7 - gap * (n - 1)) / n, h = 2.95;
        for (const [i, it] of d.items.entries()) {
          const x = 0.65 + i * (w + gap), y = i % 2 ? 2.05 : 1.35;
          card(s, x, y, w, h);
          await iconIn(s, x + 0.16, y + 0.16, 0.5, it.icon, keys[i]);
          head(s, it.h, x + 0.16, y + 0.72, w - 0.32, 0.5, { max: 14 });
          body(s, it.t, x + 0.16, y + 1.24, w - 0.32, h - 1.32, { max: 12.5 });
        }
      },
      async (d) => { // big open circles of colour, the words under each
        const s = await page(d), n = d.items.length, cw = 8.7 / n, r = 1.15;
        for (const [i, it] of d.items.entries()) {
          const x = 0.65 + i * cw, cx = x + cw / 2 - r / 2;
          await iconIn(s, cx, 1.35, r, it.icon, keys[i]);
          head(s, it.h, x + 0.1, 2.58, cw - 0.2, 0.5, { align: 'center' });
          body(s, it.t, x + 0.1, 3.1, cw - 0.2, 1.9, { align: 'center' });
        }
      },
    ],
    process: [
      async (d) => { // steps rising to the right, gradient bars under the words
        const s = await page(d), n = d.steps.length, gap = 0.12, w = (8.7 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.65 + i * (w + gap), y = 2.15 - i * (n === 4 ? 0.26 : 0.36);
          await gblock(s, x, y, w, 5.0 - y, keys[i]);
          t.text(s, String(i + 1), { x: x + 0.15, y: y + 0.06, w: 0.7, h: 0.55, bold: true, fontSize: 26, color: 'FFFFFF', valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.62, w - 0.3, 0.5, { color: 'FFFFFF', max: 14 });
          body(s, st.t, x + 0.15, y + 1.14, w - 0.3, 5.0 - y - 1.22, { color: 'FFFFFF', max: 12.5 });
        }
      },
      async (d) => { // a gradient thread down the left, a card per step
        const s = await page(d), n = d.steps.length, h = 3.55 / n;
        await gblock(s, 1.0, 1.5, 0.08, 3.3, 'main', 0.04);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.42 + i * h;
          await badge(s, 0.76, y + (h - 0.14 - 0.56) / 2, 0.56, keys[i]);
          t.text(s, String(i + 1), { x: 0.76, y: y + (h - 0.14 - 0.56) / 2, w: 0.56, h: 0.56, bold: true, fontSize: 15, color: 'FFFFFF', align: 'center', valign: 'middle' });
          card(s, 1.55, y, 7.8, h - 0.14);
          head(s, st.h, 1.75, y + 0.02, 2.3, h - 0.18, { max: 14 });
          body(s, st.t, 4.1, y + 0.04, 5.1, h - 0.22, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // on the warm gradient: chevrons, the words beneath in white
        const s = await warm(d, 'main'), n = d.steps.length, cw = 8.7 / n;
        d.steps.forEach((st, i) => {
          const x = 0.65 + i * cw;
          t.shape(s, 'CHEVRON', { x, y: 1.4, w: cw + 0.1, h: 0.85, fill: { color: 'FFFFFF' }, objectName: 'Chevron' });
          t.text(s, String(i + 1), { x: x + 0.3, y: 1.4, w: cw - 0.4, h: 0.85, bold: true, fontSize: 22, color: C.coral, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.08, 2.4, cw - 0.25, 0.55, { color: 'FFFFFF' });
          body(s, st.t, x + 0.08, 3.0, cw - 0.25, 2.05, { color: 'FFFFFF' });
        });
      },
    ],
    stats: [
      async (d) => { // a great gradient disc for the first figure
        const s = await page(d), [a, ...rest] = d.stats, r = 3.45;
        await badge(s, 0.75, 1.45, r, 'main');
        t.text(s, a.value, { x: 1.05, y: 2.0, w: r - 0.6, h: 1.15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, r - 0.7, 1.05, 50, 22, F.head, true) });
        body(s, a.label, 1.3, 3.2, r - 1.1, 1.0, { color: 'FFFFFF', align: 'center', max: 13 });
        rest.forEach((v, i) => { const y = 1.5 + i * 1.08; head(s, v.value, 4.65, y, 4.7, 0.55, { max: 30, color: tones[i + 1] }); body(s, v.label, 4.65, y + 0.55, 4.7, 0.46, { max: 12, color: C.ink }); });
        if (d.note) body(s, d.note, 4.65, 3.72, 4.7, 1.25, { max: 11 });
      },
      async (d) => { // figures on gradient plates, reading across
        const s = await page(d), rh = d.note ? 0.92 : 1.15;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.42 + i * rh;
          await gblock(s, 0.65, y, 3.2, rh - 0.12, keys[i], 0.14);
          t.text(s, v.value, { x: 0.75, y, w: 3.0, h: rh - 0.12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(v.value, 2.9, rh - 0.2, 34, 16, F.head, true) });
          body(s, v.label, 4.1, y, 5.25, rh - 0.12, { valign: 'middle', color: C.ink, max: 16 });
        }
        if (d.note) body(s, d.note, 0.65, 4.2, 8.7, 0.85, { max: 11 });
      },
    ],
    compare: [
      async (d) => { // half gradient, half white card
        const s = await page(d), w = 4.35;
        await gblock(s, 0.65, 1.45, w, 3.5, 'cool');
        card(s, 0.65 + w, 1.45, w, 3.5);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = 0.65 + i * w, n = side.items.length, rh = 2.65 / n, ink = i ? C.ink : 'FFFFFF';
          head(s, side.h, x + 0.25, 1.55, w - 0.5, 0.55, { color: i ? C.coral : 'FFFFFF', max: 18 });
          side.items.forEach((it, k) => body(s, it, x + 0.25, 2.2 + k * rh, w - 0.5, rh - 0.05, { color: ink }));
        }
      },
      async (d) => { // mirrored about one gradient pill
        const s = await page(d), w = 3.8, cx = 5;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.22, 2.8);
        await gblock(s, cx - 0.05, 1.45, 0.1, 3.5, 'main', 0.05);
        head(s, d.left.h, 0.65, 1.42, w, 0.55, { align: 'right', color: C.coral, max: 19 }); head(s, d.right.h, 5.55, 1.42, w, 0.55, { color: C.violet, max: 19 });
        let y = 2.1;
        rows.forEach((rh, k) => {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.65, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.55, y, w, h: rh, fontSize: fs, color: C.ink });
          y += rh;
        });
      },
    ],
    statement: [
      async (d) => { // a gradient block fills the left, the note on white to its right
        const s = await page(d);
        await gblock(s, 0.65, 1.42, 5.9, 3.55, 'main');
        t.text(s, L.runs(d.text), { x: 0.95, y: 1.55, w: 5.3, h: 3.3, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 5.3, 3.2, 34, 16, F.head, true) });
        if (d.caption) body(s, d.caption, 6.85, 1.5, 2.5, 3.4, { valign: 'middle', max: 14, color: C.ink });
      },
      async (d) => { // on the warm gradient, the words at the top, the note on a white card
        const s = await warm(d, 'main');
        t.text(s, L.runs(d.text), { x: 0.65, y: 1.3, w: 8.7, h: 2.15, bold: true, color: 'FFFFFF', valign: 'top', fontSize: L.fit(d.text, 8.7, 2.1, 38, 17, F.head, true) });
        if (d.caption) { card(s, 3.2, 3.55, 6.15, 1.45); body(s, d.caption, 3.4, 3.62, 5.75, 1.3, { valign: 'middle', max: 13, color: C.ink }); }
      },
    ],
    timeline: [
      async (d) => { // a gradient spine down the middle
        const s = await page(d), cx = 5;
        await gblock(s, cx - 0.04, 1.42, 0.08, 3.55, 'main', 0.04);
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, y = 1.38 + Math.floor(i / 2) * 1.85 + (right ? 0.4 : 0), x = right ? cx + 0.4 : 0.65, w = 3.95, a = right ? 'left' : 'right';
          await badge(s, cx - 0.15, y + 0.06, 0.3, keys[i]);
          t.text(s, [{ text: it.year + '  ', options: { color: tones[i], bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.42, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.4, 15, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.44, w, 1.2, { align: a, max: 13 });
        }
      },
      async (d) => { // four cards, each with the year on a coloured head
        const s = await page(d), w = 4.25, h = 1.72;
        for (const [i, it] of d.items.entries()) {
          const x = 0.65 + (i % 2) * (w + 0.2), y = 1.4 + Math.floor(i / 2) * (h + 0.1);
          card(s, x, y, w, h);
          await gblock(s, x, y, 1.3, h, keys[i]);
          t.text(s, it.year, { x: x + 0.05, y, w: 1.2, h, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.1, h - 0.3, 22, 10, F.head, true) });
          head(s, it.h, x + 1.42, y + 0.06, w - 1.54, 0.4, { max: 14 });
          body(s, it.t, x + 1.42, y + 0.48, w - 1.54, h - 0.54, { max: 12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => ({ x: 1.2, y: 5.12, w: 8.2, h: 0.25, color: ['cover', 'closing'].includes(type) || d._warm || (type === 'statement' && d._first) ? 'FFFFFF' : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Gradient', colors: { dk1: C.ink, lt1: C.bg, dk2: '3B2A6B', lt2: C.soft, accent1: C.coral, accent2: C.violet, accent3: C.blue, accent4: C.orange, accent5: C.muted, accent6: 'D9D2F0', hlink: C.violet, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "ijodiy va energiyali; qisqa, jozibali iboralar", "limits": {"card_t4": 65}};
module.exports = { id: 5, slug: 'gradient', name: 'Gradient', category: 'creative', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "playful"], "transitions": ["p14:ripple", "morph", "zoom"], "cover": ["popOver", "springIn"], "mark": "popOver", "deco": "softGrow", "sig": {"title": "springIn", "body": "fadeUp", "item": "popOver", "image": "springIn", "number": "popOver", "order": "diagonal", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
