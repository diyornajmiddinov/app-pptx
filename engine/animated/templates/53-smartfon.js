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
    t.rect(s, x, y, w, h, out ? '1F5FD6' : C.bubble, { r: 0.22, name: 'Chat bubble' });
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
        t.text(s, it.year, { x: 0.55, y, w: 1.3, h: rh - 0.08, fontSize: L.fit(it.year, 1.28, 0.5, 13, 9, F.head, true), bold: true, color: C.muted, valign: 'middle' });
        bubble(s, `${it.h} \u2014 ${it.t}`, i % 2 ? 2.3 : 1.95, y, 7.15, rh - 0.08, i % 2 === 1, 13);
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
  // ---- further ways to draw a type, every page a screen of the same phone: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const D1 = '1F232C', D2 = '2A2F3A', TXT = 'F2F4F8', SUB = 'B7BECC', BLUE = '1F5FD6', BODY = '4F586A';
  const dark = (d) => { // dark mode
    const s = pres.addSlide(); s.background = { color: C.bezel }; idx++;
    t.text(s, '‹', { x: 0.45, y: 0.33, w: 0.4, h: 0.65, fontSize: 30, color: '6AA2FF', valign: 'middle' });
    t.text(s, d.title, { x: 0.9, y: 0.35, w: 7.4, h: 0.65, bold: true, color: TXT, valign: 'middle', fontSize: L.fit(d.title, 7.4, 0.65, 28, 16, F.head, true) });
    t.rect(s, 8.55, 0.45, 0.9, 0.42, D2, { r: 0.21, name: 'Pill' });
    t.text(s, `${idx}/${content.slides.length}`, { x: 8.55, y: 0.45, w: 0.9, h: 0.42, fontSize: 11, bold: true, color: SUB, align: 'center', valign: 'middle' });
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: SUB });
    return s;
  };
  const appIcon = async (s, x, y, d, k, name) => { t.rect(s, x, y, d, d, ['2F7BFF', '1E9E45', 'D97F00', 'E0234A', '8E5CF7', '008FA8'][k % 6], { r: d * 0.25, name: 'App icon' }); t.img(s, await L.icon(name, 'FFFFFF', 2.25), x + d * 0.22, y + d * 0.22, d * 0.56, d * 0.56); };
  const V = {
    image: [
      async (d) => { // the phone turned on its side, the picture filling its screen
        const s = page(d), x = 0.55, y = 1.25, w = 8.9, h = 2.3;
        t.rect(s, x, y, w, h, C.bezel, { r: 0.28, shadow: 0.25, blur: 14, offset: 4, name: 'Phone' });
        t.img(s, await L.photo(L.src(d.image), w - 0.5, h - 0.2, { mask: { r: 0.16 } }), x + 0.34, y + 0.1, w - 0.5, h - 0.2, { alt: '' });
        t.rect(s, x + 0.11, y + h / 2 - 0.32, 0.12, 0.64, D2, { r: 0.06, name: 'Notch' });
        t.text(s, d.text, { x: 0.6, y: 3.72, w: 8.8, h: 1.44, fontSize: L.fit(d.text, 8.8, 1.44, 15, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // dark mode: words on the black screen, the picture a tall portrait post
        const s = dark(d);
        t.img(s, await L.photo(L.src(d.image), 2.9, 3.86, { mask: { r: 0.18 } }), 6.55, 1.26, 2.9, 3.86, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 1.3, w: 5.55, h: 3.78, fontSize: L.fit(d.text, 5.55, 3.78, 15, 10, F.body, false, 1.25), color: TXT, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the lock screen: picture as wallpaper, one big notification over it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 0.45, 1.75, 9.1, 3.3, C.screen, { r: 0.22, shadow: 0.25, blur: 14, offset: 4, name: 'Notification' });
        t.rect(s, 0.68, 1.95, 0.56, 0.56, C.blue, { r: 0.14, name: 'App icon' });
        t.text(s, String(idx), { x: 0.68, y: 1.95, w: 0.56, h: 0.56, bold: true, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 1.38, y: 1.88, w: 7.95, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.95, 0.68, 22, 13, F.head, true) });
        t.text(s, d.text, { x: 0.7, y: 2.66, w: 8.6, h: 2.28, fontSize: L.fit(d.text, 8.6, 2.28, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.2, W, H - 5.2, C.bezel, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 8.5, color: TXT, valign: 'middle' });
      },
      async (d) => { // a story: round picture in a coloured ring, the words as an incoming message
        const s = page(d), dd = 3.3, x = 0.75, y = 1.48;
        t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, C.pink);
        t.oval(s, x - 0.06, y - 0.06, dd + 0.12, dd + 0.12, C.bg);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.rect(s, 4.5, 1.32, 4.95, 3.8, C.bubble, { r: 0.22, name: 'Chat bubble' });
        t.text(s, d.text, { x: 4.72, y: 1.44, w: 4.5, h: 3.56, fontSize: L.fit(d.text, 4.5, 3.56, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the settings screen: one grouped list, a chevron at each row's end
        const s = page(d), n = d.items.length, h = 3.72 / n;
        card(s, 0.55, 1.32, 8.9, 3.82);
        for (const [i, it] of d.items.entries()) {
          const y = 1.37 + i * h;
          await appIcon(s, 0.75, y + h / 2 - 0.27, 0.54, i, it.icon);
          head(s, it.h, 1.48, y + 0.03, 2.6, h - 0.06, { max: 15 });
          body(s, it.t, 4.15, y + 0.04, 4.7, h - 0.08, { valign: 'middle', color: BODY });
          t.text(s, '›', { x: 8.98, y, w: 0.3, h, fontSize: 22, color: C.muted, valign: 'middle' });
          if (i < n - 1) t.line(s, 1.48, y + h, 7.8, 0, C.line, 0.75);
        }
      },
      async (d) => { // dark mode: widgets on the home screen, two by two
        const s = dark(d), n = d.items.length, w = 4.35, h = 1.82;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.9 : w, x = 0.55 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (h + 0.14);
          card(s, x, y, ww, h, D1);
          await appIcon(s, x + 0.18, y + 0.16, 0.5, i, it.icon);
          head(s, it.h, x + 0.8, y + 0.14, ww - 0.98, 0.54, { color: TXT, max: 15 });
          body(s, it.t, x + 0.18, y + 0.76, ww - 0.36, h - 0.86, { color: SUB });
        }
      },
      async (d) => { // the feed: a masonry of cards that do not end level
        const s = page(d), n = d.items.length, gap = 0.18, w = (8.9 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * (w + gap), y = 1.32 + (i % 2 ? 0.46 : 0), h = i % 2 ? 3.36 : 3.0;
          card(s, x, y, w, h);
          t.rect(s, x, y, w, 0.16, ACC[i % 6], { r: 0.08, name: 'Band' });
          await appIcon(s, x + 0.16, y + 0.28, 0.42, i, it.icon);
          head(s, it.h, x + 0.16, y + 0.76, w - 0.32, 0.56, { max: 14 });
          body(s, it.t, x + 0.16, y + 1.34, w - 0.32, h - 1.44, { color: BODY });
        }
      },
      async (d) => { // the phone stands in the middle, its apps explained on either side
        const s = page(d), n = d.items.length, pw = 1.82, ph = 3.72, cx = 5, py = 1.36, w = 3.2, h = 1.78;
        t.rect(s, cx - pw / 2, py, pw, ph, C.bezel, { r: 0.24, shadow: 0.25, blur: 14, offset: 4, name: 'Phone' });
        t.rect(s, cx - pw / 2 + 0.07, py + 0.07, pw - 0.14, ph - 0.14, C.screen, { r: 0.19, name: 'Screen' });
        t.rect(s, cx - 0.26, py + 0.1, 0.52, 0.1, C.bezel, { r: 0.05, name: 'Notch' });
        for (const [i, it] of d.items.entries()) await appIcon(s, cx - 0.56 + (i % 2) * 0.68, py + 0.5 + Math.floor(i / 2) * 0.88, 0.44 * 1.0, i, it.icon);
        const spots = n === 3 ? [[0.55, 1.36], [0.55, 3.3], [6.25, 2.33]] : [[0.55, 1.36], [6.25, 1.36], [0.55, 3.3], [6.25, 3.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i];
          card(s, x, y, w, h);
          t.oval(s, x + 0.16, y + 0.16, 0.2, 0.2, ACC[i % 6]);
          head(s, it.h, x + 0.44, y + 0.06, w - 0.56, 0.4, { max: 14 });
          body(s, it.t, x + 0.16, y + 0.5, w - 0.32, h - 0.58, { color: BODY });
        }
      },
    ],
    process: [
      async (d) => { // the stepper: dots joined by a line, words directly on the page
        const s = page(d), n = d.steps.length, cw = 8.9 / n;
        t.line(s, 0.55 + 0.28, 1.68, cw * (n - 1), 0, C.line, 3);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * cw, on = i === n - 1;
          t.oval(s, x, 1.4, 0.56, 0.56, on ? C.blue : C.screen, { line: { color: C.blue, width: 2.25 } });
          t.text(s, String(i + 1), { x, y: 1.4, w: 0.56, h: 0.56, bold: true, fontSize: 15, color: on ? 'FFFFFF' : C.blue, align: 'center', valign: 'middle' });
          head(s, st.h, x, 2.12, cw - 0.22, 0.56, { max: 15 });
          body(s, st.t, x, 2.72, cw - 0.22, 2.4, { max: 14, color: BODY });
        }
      },
      async (d) => { // levels unlocked: each card a step higher than the last
        const s = page(d), n = d.steps.length, w = 8.9 / n, low = 3.3, high = 1.34, h = 1.84;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.12;
          if (y + h < 5.05) t.rect(s, x + tw / 2 - 0.03, y + h, 0.06, 5.14 - y - h, C.line, { name: 'Stem' });
          card(s, x, y, tw, h);
          t.oval(s, x + 0.12, y + 0.11, 0.38, 0.38, BLUE);
          t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.11, w: 0.38, h: 0.38, bold: true, fontSize: 12, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.56, y + 0.07, tw - 0.66, 0.46, { max: 13 });
          body(s, st.t, x + 0.12, y + 0.58, tw - 0.24, h - 0.66, { color: BODY });
        }
      },
      async (d) => { // the delivery tracker: one thin line, stops to either side
        const s = page(d), n = d.steps.length, gap = n === 4 ? 0.93 : 1.26, h = n === 4 ? 1.14 : 1.24, w = 4.0, cx = 5;
        t.rect(s, cx - 0.025, 1.34, 0.05, 3.8, C.blue, { name: 'Track' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.34 + i * gap, x = right ? cx + 0.36 : cx - 0.36 - w;
          t.oval(s, cx - 0.21, y + 0.14, 0.42, 0.42, C.blue, { line: { color: C.bg, width: 3 } });
          t.text(s, String(i + 1), { x: cx - 0.21, y: y + 0.14, w: 0.42, h: 0.42, bold: true, fontSize: 12, color: 'FFFFFF', align: 'center', valign: 'middle' });
          card(s, x, y, w, h);
          head(s, st.h, x + 0.16, y + 0.04, w - 0.32, 0.38, { max: 14 });
          body(s, st.t, x + 0.16, y + 0.44, w - 0.32, h - 0.5, { color: BODY });
        }
      },
      async (d) => { // dark mode: a segmented control runs across the top, one tab to a step
        const s = dark(d), n = d.steps.length, cw = 8.9 / n;
        t.rect(s, 0.55, 1.32, 8.9, 0.68, D2, { r: 0.34, name: 'Segments' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * cw, on = i === 0;
          t.rect(s, x + 0.05, 1.37, cw - 0.1, 0.58, on ? BLUE : D1, { r: 0.29, name: 'Tab' });
          t.text(s, String(i + 1), { x: x + 0.05, y: 1.37, w: cw - 0.1, h: 0.58, bold: true, fontSize: 18, color: on ? 'FFFFFF' : SUB, align: 'center', valign: 'middle' });
          if (i) t.line(s, x, 2.22, 0, 2.88, D2, 1);
          head(s, st.h, x + 0.14, 2.18, cw - 0.28, 0.56, { color: TXT, max: 15 });
          body(s, st.t, x + 0.14, 2.8, cw - 0.28, 2.32, { color: SUB, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // the big widget and two small ones, as a home screen lays them out
        const s = page(d), [a, ...rest] = d.stats;
        card(s, 0.55, 1.32, 4.6, 3.82, BLUE);
        t.text(s, a.value, { x: 0.82, y: 1.6, w: 4.06, h: 1.6, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(a.value, 4.0, 1.5, 66, 28, F.head, true) });
        body(s, a.label, 0.82, 3.3, 4.06, 1.6, { color: 'FFFFFF', max: 16 });
        for (const [i, v] of rest.entries()) {
          const x = 5.35 + i * 2.1;
          card(s, x, 1.32, 2.0, 1.82);
          t.oval(s, x + 0.14, 1.44, 0.16, 0.16, ACC[i + 1]);
          t.text(s, v.value, { x: x + 0.14, y: 1.62, w: 1.72, h: 0.6, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(v.value, 1.68, 0.56, 26, 13, F.head, true) });
          body(s, v.label, x + 0.14, 2.24, 1.72, 0.84, { max: 12, color: BODY });
        }
        card(s, 5.35, 3.28, 4.1, 1.86);
        if (d.note) body(s, d.note, 5.53, 3.38, 3.74, 1.66, { valign: 'middle', color: BODY });
      },
      async (d) => { // dark mode: the stocks list, words to the left and figures to the right
        const s = dark(d), h = 0.88;
        card(s, 0.55, 1.3, 8.9, h * 3 + 0.08, D1);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.34 + i * h;
          t.oval(s, 0.78, y + h / 2 - 0.09, 0.18, 0.18, ['34C759', '2F7BFF', 'FF9500'][i]);
          body(s, v.label, 1.1, y + 0.04, 4.9, h - 0.08, { color: TXT, max: 15, valign: 'middle' });
          t.text(s, v.value, { x: 6.1, y, w: 3.1, h, bold: true, color: TXT, align: 'right', valign: 'middle', fontSize: L.fit(v.value, 3.05, h - 0.1, 36, 18, F.head, true) });
          if (i < 2) t.line(s, 1.1, y + h, 8.1, 0, D2, 1);
        }
        if (d.note) body(s, d.note, 0.6, 4.14, 8.8, 0.98, { color: SUB, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // a toggle switch in the middle, the two states mirrored about it
        const s = page(d), w = 3.95, cx = 5;
        t.rect(s, cx - 0.42, 1.38, 0.84, 0.46, C.green, { r: 0.23, name: 'Toggle' });
        t.oval(s, cx + 0.0, 1.42, 0.38, 0.38, C.screen);
        t.line(s, cx, 1.92, 0, 3.2, C.line, 1.5);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.2, 2.95);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.5 : cx - 0.5 - w, a = i ? 'left' : 'right';
          head(s, side.h, x, 1.32, w, 0.58, { align: a, max: 20, color: i ? BLUE : C.muted });
          let y = 2.06;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w, h: rows[j], fontSize: fs, color: C.ink, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two long notifications, one white and one blue
        const s = page(d), h = 1.82;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.12), blue = i === 1, rh = (h - 0.62) / Math.ceil(side.items.length / 2);
          card(s, 0.55, y, 8.9, h, blue ? BLUE : C.screen);
          t.rect(s, 0.75, y + 0.12, 0.36, 0.36, blue ? 'FFFFFF' : C.blue, { r: 0.09, name: 'App icon' });
          head(s, side.h, 1.22, y + 0.08, 8.0, 0.44, { color: blue ? 'FFFFFF' : C.ink, max: 16 });
          side.items.forEach((it, j) => body(s, it, 0.75 + (j % 2) * 4.3, y + 0.56 + Math.floor(j / 2) * rh, 4.15, rh - 0.03, { color: blue ? 'FFFFFF' : C.ink, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // dark mode: the words alone, three typing dots above them
        const s = dark(d);
        for (let k = 0; k < 3; k++) t.oval(s, 0.62 + k * 0.32, 1.4, 0.2, 0.2, ['6AA2FF', C.green, C.orange][k]);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.68, w: 8.8, h: 2.1, bold: true, color: TXT, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.05, 36, 17, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.88, 8.8, 1.26, { color: SUB, max: 14 });
      },
      async (d) => { // an alert dialog in the middle of a dimmed screen
        const s = page(d);
        t.rect(s, 0, 1.15, W, 4.03, '8B93A3', { t: 45, name: 'Dim' });
        card(s, 1.6, 1.3, 6.8, 3.74);
        t.text(s, L.runs(d.text), { x: 1.9, y: 1.4, w: 6.2, h: 1.56, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 6.2, 1.5, 26, 14, F.head, true) });
        if (d.caption) body(s, d.caption, 1.9, 3.0, 6.2, 1.28, { align: 'center', color: BODY, valign: 'middle' });
        t.line(s, 1.6, 4.38, 6.8, 0, C.line, 1);
        t.text(s, '✓', { x: 1.6, y: 4.4, w: 6.8, h: 0.6, bold: true, fontSize: 22, color: C.blue, align: 'center', valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // the slider: a single line with its thumbs, cards above and below
        const s = page(d), axis = 3.22, w = 3.7;
        t.rect(s, 0.55, axis - 0.035, 8.9, 0.07, C.line, { r: 0.03, name: 'Slider' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.55 + (i / 2) * 4.4 : 1.75 + ((i - 1) / 2) * 4.4, top = up ? 1.3 : 3.42, h = 1.72;
          t.oval(s, x + 0.2, axis - 0.13, 0.26, 0.26, up ? C.blue : C.pink, { line: { color: C.screen, width: 2 } });
          card(s, x, top, w, h);
          t.text(s, it.year, { x: x + 0.14, y: top + 0.05, w: 1.5, h: 0.38, bold: true, color: up ? BLUE : 'C81E45', valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.34, 16, 11, F.head, true) });
          head(s, it.h, x + 1.66, top + 0.05, w - 1.8, 0.38, { max: 12 });
          body(s, it.t, x + 0.14, top + 0.46, w - 0.28, h - 0.52, { color: BODY });
        }
      },
      async (d) => { // dark mode: calendar tiles side by side, the year on each tile's tab
        const s = dark(d), cw = 8.9 / 4, ys = [1.3, 1.62, 1.3, 1.62];
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * cw, w = cw - 0.14, y = ys[i], h = 5.14 - y;
          card(s, x, y, w, h, D1);
          t.rect(s, x, y, w, 0.58, D2, { r: 0.14, name: 'Tab' });
          t.oval(s, x + 0.12, y + 0.21, 0.16, 0.16, ['6AA2FF', '34C759', 'FF9500', 'FF5C7C'][i]);
          t.text(s, it.year, { x: x + 0.34, y, w: w - 0.42, h: 0.58, bold: true, color: TXT, valign: 'middle', fontSize: L.fit(it.year, w - 0.46, 0.5, 18, 10, F.head, true) });
          head(s, it.h, x + 0.14, y + 0.64, w - 0.28, 0.44, { color: TXT, max: 14 });
          body(s, it.t, x + 0.14, y + 1.1, w - 0.28, h - 1.2, { color: SUB, max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process page was the same row of cards as the cards page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Smartfon', colors: { dk1: C.ink, lt1: C.screen, dk2: C.bezel, lt2: C.bg, accent1: C.blue, accent2: C.green, accent3: C.orange, accent4: C.pink, accent5: ACC[4], accent6: ACC[5], hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "zamonaviy va suhbatdosh: foydalanuvchiga to'g'ridan-to'g'ri murojaat, qisqa xabarlar kabi", limits: {}, prefer: null };
module.exports = { id: 53, slug: 'smartfon', name: 'Smartfon', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "playful"], "transitions": ["push:l", "push:u", "morph"], "cover": ["springIn", "popOver"], "mark": "popOver", "deco": "riseUp", "sig": {"title": "springIn", "body": "riseUp", "item": "riseSettle", "image": "springIn", "number": "popOver", "order": "seq", "stagger": 0.12}, "tempo": 0.85, "kenburns": false};
