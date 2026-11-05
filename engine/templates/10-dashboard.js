/**
 * 10 Dashboard — dark product/analytics UI: panels, colour-coded chips, KPI cards,
 * roadmap-style timeline, Calibri.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '0F172A', panel: '1E293B', border: '334155', text: 'E2E8F0', muted: '94A3B8', sky: '38BDF8', green: '34D399', amber: 'FBBF24', rose: 'FB7185', violet: 'A78BFA' };
const F = { head: 'Calibri', body: 'Calibri' };
const ACC = [C.sky, C.green, C.amber, C.rose, C.violet, C.sky];

const gridSvg = () => {
  const g = []; for (let x = 0; x <= 1600; x += 50) g.push(`<line x1="${x}" y1="0" x2="${x}" y2="900"/>`); for (let y = 0; y <= 900; y += 50) g.push(`<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="r" cx="80%" cy="30%" r="70%"><stop offset="0" stop-color="#1D3B6B"/><stop offset="1" stop-color="#${C.bg}"/></radialGradient></defs><rect width="1600" height="900" fill="url(#r)"/><g stroke="#FFFFFF" stroke-opacity="0.045">${g.join('')}</g></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const grid = await L.svg(gridSvg(), 1600, 900, true);
  const total = content.slides.length; let idx = 0;
  const panel = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, C.panel, { r: 0.1, line: { color: o.border || C.border, width: 0.75 }, name: 'Panel' });
  const chip = (s, x, y, d, color) => t.rect(s, x, y, d, d, color, { r: d * 0.25, t: 80, name: 'Chip' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    [C.rose, C.amber, C.green].forEach((c, k) => t.oval(s, 0.5 + k * 0.2, 0.62, 0.11, 0.11, c));
    t.text(s, d.title, { x: 1.2, y: 0.35, w: 6.6, h: 0.65, fontFace: F.head, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 6.6, 0.65, 26, 18, F.head, true) });
    t.rect(s, 8.3, 0.47, 1.2, 0.4, C.panel, { r: 0.2, line: { color: C.border, width: 0.75 }, name: 'Page chip' });
    t.text(s, `${L.pad2(idx)} / ${L.pad2(total)}`, { x: 8.3, y: 0.47, w: 1.2, h: 0.4, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' });
    t.line(s, 0.5, 1.12, 9.0, 0, C.border, 0.75, { name: 'Header rule' });
    return s;
  };
  const hero = (d) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    const bars = [1.4, 2.1, 1.7, 2.8, 2.3, 3.4];
    bars.forEach((h, k) => t.rect(s, 6.1 + k * 0.55, 4.6 - h, 0.36, h, ACC[k % 5], { r: 0.08, t: k === 5 ? 0 : 35, name: 'Bar' }));
    t.line(s, 5.9, 4.75, 3.6, 0, C.border, 1);
    const fs = L.fit(d.title, 5.0, 2.2, 46, 28, F.head, true), th = L.height(d.title, fs, 5.0, F.head, true);
    [C.rose, C.amber, C.green].forEach((c, k) => t.oval(s, 0.6 + k * 0.22, Math.max(0.6, 3.65 - th - 0.4), 0.12, 0.12, c));
    t.text(s, d.title, { x: 0.6, y: 1.45, w: 5.0, h: 2.2, fontFace: F.head, bold: true, fontSize: fs, color: C.text, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.85, w: 4.8, h: 1.1, fontSize: 16, color: C.muted });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), cols = 3, rws = Math.ceil(d.items.length / cols), w = (9.0 - 0.5) / 3, h = (3.75 - 0.25 * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = 0.5 + (i % cols) * (w + 0.25), y = 1.4 + Math.floor(i / cols) * (h + 0.25);
        panel(s, x, y, w, h);
        chip(s, x + 0.25, y + 0.25, 0.5, ACC[i]);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: ACC[i], align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.25, y: y + 0.9, w: w - 0.5, h: h - 1.05, fontSize: 17, bold: true, color: C.text });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.75, 18, 13, F.head, true)));
      const hh = Math.max(...d.items.map((it) => L.height(it.h, hfs, w - 0.5, F.head, true)));
      const h = Math.min(3.75, 1.4 + hh + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap), y = 1.4;
        panel(s, x, y, w, h);
        chip(s, x + 0.25, y + 0.25, 0.6, ACC[i]);
        t.img(s, await L.icon(it.icon, ACC[i], 2), x + 0.4, y + 0.4, 0.3, 0.3);
        t.text(s, it.h, { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: hh + 0.05, fontSize: hfs, bold: true, color: C.text });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.15 + hh, w: w - 0.5, h: h - 1.3 - hh, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.45, w = (9.0 - gap * (n - 1)) / n, h = 2.6;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.5 + i * (w + gap), y = 1.6;
        panel(s, x, y, w, h, { border: i === n - 1 ? ACC[i] : C.border });
        t.text(s, `${L.pad2(i + 1)}`, { x: x + 0.25, y: y + 0.25, w: 1, h: 0.3, fontSize: 12, bold: true, color: ACC[i] });
        t.text(s, st.h, { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.4, fontSize: L.fit(st.h, w - 0.5, 0.4, 18, 12, F.head, true), bold: true, color: C.text });
        t.text(s, st.t, { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: h - 1.2, fontSize: 14, color: C.muted });
        if (i < n - 1) t.img(s, await L.icon('FiChevronRight', C.muted, 2.5), x + w + 0.07, y + h / 2 - 0.15, 0.3, 0.3);
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        panel(s, px, 1.45, w, 2.55);
        t.text(s, x.label, { x: px + 0.3, y: 1.7, w: w - 0.6, h: 0.75, fontSize: 14, color: C.muted });
        t.text(s, x.value, { x: px + 0.3, y: 2.45, w: w - 0.6, h: 1.0, fontSize: L.fit(x.value, w - 0.6, 1.0, 52, 28, F.head, true), bold: true, color: ACC[i], valign: 'bottom' });
        t.rect(s, px + 0.3, 3.65, w - 0.6, 0.07, ACC[i], { r: 0.035, name: 'Accent bar' });
      });
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.3, w: 9.0, h: 0.5, fontSize: 14, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.375, h = 3.6;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 1.0, F.body) : 0))));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.5 + i * (w + 0.25), col = i ? C.rose : C.green;
        panel(s, x, 1.4, w, h);
        t.rect(s, x + 0.3, 1.65, 0.12, 0.12, col, { r: 0.06, name: 'Status' });
        t.text(s, side.h, { x: x + 0.55, y: 1.55, w: w - 0.8, h: 0.35, fontSize: 18, bold: true, color: C.text, valign: 'middle' });
        let y = 2.2;
        for (const [k, it] of side.items.entries()) {
          t.img(s, await L.icon(i ? 'FiAlertTriangle' : 'FiCheckCircle', col, 2), x + 0.3, y + 0.02, 0.22, 0.22);
          t.text(s, it, { x: x + 0.7, y, w: w - 1.0, h: rows[k] + 0.05, fontSize: 15, color: C.text });
          y += rows[k] + 0.22;
        }
      }
    },
    async statement(d) {
      const s = page(d);
      panel(s, 0.5, 1.45, 9.0, 3.4);
      chip(s, 0.85, 1.8, 0.6, C.sky);
      t.img(s, await L.icon('FiZap', C.sky, 2), 1.0, 1.95, 0.3, 0.3);
      const fs = L.fit(d.text, 8.2, 1.3, 36, 22, F.head, true);
      t.text(s, L.runs(d.text), { x: 0.85, y: 2.6, w: 8.2, h: 1.3, fontSize: fs, bold: true, color: C.text, valign: 'top' });
      if (d.caption) t.text(s, d.caption, { x: 0.85, y: 4.0, w: 8.0, h: 0.75, fontSize: 15, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.75 / n, tx = 2.0, tw = 7.5, seg = tw / n;
      for (let k = 0; k <= n; k++) t.line(s, tx + k * seg, 1.35, 0, 3.75, C.border, 0.5, { dash: 'dash' });
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, it.year, { x: 0.5, y, w: 1.35, h: 0.42, fontSize: L.fit(it.year, 1.35, 0.42, 18, 11, F.head, true), bold: true, color: ACC[i], valign: 'middle' });
        const bx = tx + i * seg + 0.05, bw = Math.min(seg * 1.6, tw - i * seg) - 0.1;
        t.rect(s, bx, y + 0.02, bw, 0.38, ACC[i], { r: 0.1, t: 15, name: 'Roadmap bar' });
        t.text(s, it.h, { x: bx + 0.12, y: y + 0.02, w: bw - 0.2, h: 0.38, fontSize: 14, bold: true, color: C.bg, valign: 'middle' });
        const ty = y + 0.45, dw = Math.max(bw, 4.4), dx = Math.min(bx, 9.5 - dw);
        t.text(s, it.t, { x: dx, y: ty, w: dw, h: rh - 0.5, fontSize: 14, color: C.muted, align: dx < bx ? 'right' : 'left' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: grid }; idx++;
      panel(s, 1.0, 1.0, 8.0, 3.6);
      const fs = L.fit(d.text, 6.8, 1.9, 30, 18, F.head, false, 1, true);
      t.text(s, '\u201C', { x: 1.5, y: 1.15, w: 1, h: 0.9, fontSize: 72, bold: true, color: C.sky, fontFace: 'Arial' });
      t.text(s, d.text, { x: 1.6, y: 1.9, w: 6.8, h: 1.95, fontSize: fs, italic: true, color: C.text, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.6, y: 3.95, w: 6.8, h: 0.4, fontSize: 14, color: C.sky });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      panel(s, 0.5, 1.4, 4.3, 3.6); await PH(s, d.image, 0.62, 1.52, 4.06, 3.36, { mask: { r: 0.08 } });
      panel(s, 5.05, 1.4, 4.45, 3.6);
      t.text(s, d.text, { x: 5.3, y: 1.55, w: 3.95, h: 3.3, fontSize: L.fit(d.text, 3.95, 3.3, 15, 11, F.body, false, 1.25), color: C.text, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      panel(s, 0.5, 1.4, 4.2, 3.6);
      chip(s, 0.75, 1.62, 0.45, C.sky);
      t.text(s, d.text, { x: 0.75, y: 2.2, w: 3.7, h: 2.65, fontSize: L.fit(d.text, 3.7, 2.65, 15, 11, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2 });
      panel(s, 4.95, 1.4, 4.55, 3.6); await PH(s, d.image, 5.07, 1.52, 4.31, 3.36, { mask: { r: 0.08 } });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.7 / n);
      panel(s, 0.5, 1.35, 9.0, rh * n + 0.2);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        chip(s, 0.7, y + (rh - 0.36) / 2, 0.36, ACC[i % 5]);
        t.text(s, String(i + 1), { x: 0.7, y: y + (rh - 0.36) / 2, w: 0.36, h: 0.36, fontSize: 11, bold: true, color: ACC[i % 5], align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.1, h: rh, fontSize: L.fit(it, 8.1, rh - 0.04, 14, 10, F.body), color: C.text, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.rect(s, 5.9, 0.85, 3.7, 4.05, C.panel, { r: 0.12, line: { color: C.border, width: 0.75 }, name: 'Panel' }); await PH(s, d.image, 6.0, 0.95, 3.5, 3.85, { mask: { r: 0.08 } }); },
    closing: async (s, d) => { t.rect(s, 5.9, 0.85, 3.7, 4.05, C.panel, { r: 0.12, line: { color: C.border, width: 0.75 }, name: 'Panel' }); await PH(s, d.image, 6.0, 0.95, 3.5, 3.85, { mask: { r: 0.08 } }); },
  });
  // ---- further ways to draw a type, in this template's product-UI world (windows, kanban, pipeline, terminal, diff, light theme): a deck's pages must not look alike (L.pages)
  const Y0 = 1.35, Y1 = 5.08, LT = { bg: 'F1F5F9', panel: 'FFFFFF', border: 'CBD5E1', text: '0F172A', muted: '475569' }, ACL = ['0284C7', '059669', 'B45309', 'E11D48'];
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' });
  const lightPage = (d) => { // the same app in its light theme
    d._light = true;
    const s = pres.addSlide(); s.background = { color: LT.bg }; idx++;
    [C.rose, C.amber, C.green].forEach((c, k) => t.oval(s, 0.5 + k * 0.2, 0.62, 0.11, 0.11, c));
    t.text(s, d.title, { x: 1.2, y: 0.35, w: 6.6, h: 0.65, fontFace: F.head, bold: true, color: LT.text, valign: 'middle', fontSize: L.fit(d.title, 6.6, 0.65, 26, 18, F.head, true) });
    t.rect(s, 8.3, 0.47, 1.2, 0.4, LT.panel, { r: 0.2, line: { color: LT.border, width: 0.75 }, name: 'Page chip' });
    t.text(s, `${L.pad2(idx)} / ${L.pad2(total)}`, { x: 8.3, y: 0.47, w: 1.2, h: 0.4, fontSize: 11, color: LT.muted, align: 'center', valign: 'middle' });
    t.line(s, 0.5, 1.12, 9.0, 0, LT.border, 0.75, { name: 'Header rule' });
    return s;
  };
  const card = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill || LT.panel, { r: 0.1, line: { color: o.border || LT.border, width: 0.75 }, name: 'Panel' });
  const windowBar = (s, x, y, w, h = 0.32, o = {}) => { // the title strip of an app window
    [C.rose, C.amber, C.green].forEach((c, k) => t.oval(s, x + 0.15 + k * 0.16, y + h / 2 - 0.045, 0.09, 0.09, c));
    t.rect(s, x + 0.8, y + h / 2 - 0.07, Math.min(w - 1.0, 2.6), 0.14, o.pill || C.border, { r: 0.07, name: 'Address bar' });
    t.line(s, x, y + h, w, 0, o.line || C.border, 0.75, { name: 'Window rule' });
  };
  const chipIcon = async (s, x, y, d, ic, col) => { chip(s, x, y, d, col); t.img(s, await L.icon(ic, col, 2), x + d * 0.24, y + d * 0.24, d * 0.52, d * 0.52); };
  const V = {
    image: [
      async (d) => { // an app window: the picture is its viewport, the words a console under it
        const s = page(d);
        panel(s, 0.5, Y0, 9.0, 3.7);
        windowBar(s, 0.5, Y0, 9.0);
        await PH(s, d.image, 0.62, Y0 + 0.4, 8.76, 1.72, { mask: { r: 0.06 } });
        t.text(s, d.text, { x: 0.72, y: Y0 + 2.18, w: 8.56, h: 1.46, fontSize: L.fit(d.text, 8.56, 1.46, 14, 10, F.body, false, 1.1), color: C.text, lineSpacingMultiple: 1.1 });
      },
      async (d) => { // the picture fills the canvas under the app bar, a floating panel over it
        const s = page(d);
        await PH(s, d.image, 0, 1.13, W, H - 1.13);
        t.rect(s, 0.5, 1.5, 4.5, 3.4, C.panel, { r: 0.1, t: 6, line: { color: C.sky, width: 1 }, name: 'Floating panel' });
        t.text(s, d.text, { x: 0.72, y: 1.62, w: 4.06, h: 3.16, fontSize: L.fit(d.text, 4.06, 3.16, 14, 10, F.body, false, 1.15), color: C.text, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.16, W, H - 5.16, C.bg, { name: 'Footer band' });
      },
      async (d) => { // light theme: a profile card with a round avatar
        const s = lightPage(d), dd = 2.9;
        card(s, 0.5, Y0 + 0.05, 9.0, 3.55);
        t.rect(s, 0.5, Y0 + 0.05, 3.9, 3.55, ACL[0], { r: 0.1, name: 'Profile side' });
        t.oval(s, 0.98, Y0 + 0.37, dd + 0.04, dd + 0.04, 'FFFFFF');
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), 1.0, Y0 + 0.39, dd, dd, { alt: '' });
        t.text(s, d.text, { x: 4.7, y: Y0 + 0.2, w: 4.55, h: 3.25, fontSize: L.fit(d.text, 4.55, 3.25, 14, 10, F.body, false, 1.2), color: LT.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // an editor: icon rail, canvas, inspector
        const s = page(d), rail = ['FiImage', 'FiLayers', 'FiSliders', 'FiSearch'];
        panel(s, 0.5, Y0, 0.6, 3.7);
        for (const [k, ic] of rail.entries()) { if (!k) chip(s, 0.6, Y0 + 0.15, 0.4, C.sky); t.img(s, await L.icon(ic, k ? C.muted : C.sky, 2), 0.68, Y0 + 0.23 + k * 0.56, 0.24, 0.24); }
        await PH(s, d.image, 1.25, Y0, 4.55, 3.7, { mask: { r: 0.06 } });
        panel(s, 5.95, Y0, 3.55, 3.7);
        t.rect(s, 6.15, Y0 + 0.2, 0.7, 0.07, C.sky, { r: 0.035, name: 'Accent bar' });
        t.text(s, d.text, { x: 6.15, y: Y0 + 0.36, w: 3.15, h: 3.22, fontSize: L.fit(d.text, 3.15, 3.22, 13, 10, F.body, false, 1.1), color: C.text, lineSpacingMultiple: 1.1 });
      },
    ],
    cards: [
      async (d) => { // one list panel, rows with chips and a status dot
        const s = page(d), n = d.items.length, h = (Y1 - Y0 - 0.1) / n;
        panel(s, 0.5, Y0, 9.0, Y1 - Y0);
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + 0.05 + i * h;
          await chipIcon(s, 0.72, y + (h - 0.5) / 2, 0.5, it.icon, ACC[i]);
          head(s, it.h, 1.4, y + 0.04, 2.45, h - 0.08, { max: 16 });
          body(s, it.t, 4.0, y + 0.05, 5.0, h - 0.1, { valign: 'middle', max: 13 });
          t.oval(s, 9.15, y + h / 2 - 0.05, 0.1, 0.1, ACC[i]);
          if (i < n - 1) t.line(s, 0.72, y + h, 8.56, 0, C.border, 0.5);
        }
      },
      async (d) => { // tiles two by two, a coloured strip on the left of each
        const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap) / 2, h = (Y1 - Y0 - gap) / 2;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = 0.5 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? 9.0 : w;
          panel(s, x, y, ww, h);
          t.rect(s, x + 0.08, y + 0.2, 0.06, h - 0.4, ACC[i], { r: 0.03, name: 'Status strip' });
          t.img(s, await L.icon(it.icon, ACC[i], 2), x + 0.3, y + 0.17, 0.3, 0.3);
          head(s, it.h, x + 0.72, y + 0.13, ww - 0.95, 0.38, { max: 16 });
          body(s, it.t, x + 0.3, y + 0.58, ww - 0.55, h - 0.68, { max: 13 });
        }
      },
      async (d) => { // light theme: notifications at staggered heights
        const s = lightPage(d), n = d.items.length, gap = 0.18, w = (9.0 - gap * (n - 1)) / n, h = 3.2;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), y = i % 2 ? 1.84 : Y0;
          card(s, x, y, w, h);
          t.rect(s, x, y, w, 0.08, ACL[i], { name: 'Top strip' });
          t.img(s, await L.icon(it.icon, ACL[i], 2), x + 0.2, y + 0.24, 0.32, 0.32);
          head(s, it.h, x + 0.2, y + 0.62, w - 0.4, 0.55, { max: 15, color: LT.text, valign: 'top' });
          body(s, it.t, x + 0.2, y + 1.18, w - 0.4, h - 1.28, { color: LT.muted, max: 13 });
        }
      },
      async (d) => { // a service map: one central node wired to the others
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, md = 1.1, w = 3.4, h = 1.74;
        const spots = n === 4 ? [[0.5, Y0], [W - 0.5 - w, Y0], [0.5, Y1 - h], [W - 0.5 - w, Y1 - h]] : [[0.5, Y0], [W - 0.5 - w, cy - h / 2], [0.5, Y1 - h]];
        for (const [x, y] of spots.slice(0, n)) { const ax = x > cx ? x : x + w, ay = y + h / 2; t.line(s, Math.min(ax, cx), Math.min(ay, cy), Math.abs(ax - cx), 0, C.border, 1, { dash: 'dash', name: 'Wire' }); t.line(s, cx, Math.min(ay, cy), 0, Math.abs(cy - ay), C.border, 1, { dash: 'dash', name: 'Wire' }); }
        t.oval(s, cx - md / 2, cy - md / 2, md, md, C.panel, { line: { color: C.sky, width: 2 }, name: 'Node' });
        t.oval(s, cx - 0.2, cy - 0.2, 0.4, 0.4, C.sky);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i];
          panel(s, x, y, w, h, { border: ACC[i] });
          t.img(s, await L.icon(it.icon, ACC[i], 2), x + 0.18, y + 0.14, 0.28, 0.28);
          head(s, it.h, x + 0.56, y + 0.1, w - 0.72, 0.36, { max: 15 });
          body(s, it.t, x + 0.18, y + 0.5, w - 0.36, h - 0.58, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a kanban board: a lane per step, a card in each lane
        const s = page(d), n = d.steps.length, gap = 0.16, w = (9.0 - gap * (n - 1)) / n, h = Y1 - Y0;
        d.steps.forEach((st, i) => {
          const x = 0.5 + i * (w + gap);
          t.rect(s, x, Y0, w, h, '16213A', { r: 0.08, line: { color: C.panel, width: 0.75 }, name: 'Lane' });
          t.oval(s, x + 0.16, Y0 + 0.19, 0.12, 0.12, ACC[i]);
          t.text(s, L.pad2(i + 1), { x: x + 0.36, y: Y0 + 0.08, w: 0.6, h: 0.34, fontSize: 13, bold: true, color: ACC[i], valign: 'middle' });
          t.rect(s, x + w - 0.5, Y0 + 0.14, 0.34, 0.22, ACC[i], { r: 0.11, t: 75, name: 'Badge' });
          panel(s, x + 0.1, Y0 + 0.5 + (i % 2) * 0.28, w - 0.2, h - 0.86, { border: C.border });
          head(s, st.h, x + 0.22, Y0 + 0.58 + (i % 2) * 0.28, w - 0.44, 0.55, { max: 14, valign: 'top' });
          body(s, st.t, x + 0.22, Y0 + 1.15 + (i % 2) * 0.28, w - 0.44, h - 1.6, { max: 14 });
        });
      },
      async (d) => { // a build pipeline: nodes on one rail, the last one done
        const s = page(d), n = d.steps.length, cw = 9.0 / n, ly = 1.85, dd = 0.56;
        t.rect(s, 0.5 + cw / 2, ly - 0.03, cw * (n - 1), 0.06, C.border, { name: 'Rail' });
        for (const [i, st] of d.steps.entries()) {
          const cx = 0.5 + i * cw + cw / 2, last = i === n - 1;
          t.oval(s, cx - dd / 2, ly - dd / 2, dd, dd, last ? C.green : C.panel, { line: { color: ACC[i], width: 2 }, name: 'Node' });
          if (last) t.img(s, await L.icon('FiCheck', C.bg, 3), cx - 0.15, ly - 0.15, 0.3, 0.3);
          else t.text(s, String(i + 1), { x: cx - dd / 2, y: ly - dd / 2, w: dd, h: dd, fontSize: 16, bold: true, color: ACC[i], align: 'center', valign: 'middle' });
          head(s, st.h, cx - cw / 2 + 0.12, 2.3, cw - 0.24, 0.55, { max: 16, align: 'center' });
          body(s, st.t, cx - cw / 2 + 0.12, 2.88, cw - 0.24, Y1 - 2.9, { align: 'center', max: 14 });
        }
      },
      async (d) => { // a terminal window: each step a prompt and its output
        const s = page(d), n = d.steps.length, h = (Y1 - Y0 - 0.45) / n;
        t.rect(s, 0.5, Y0, 9.0, Y1 - Y0, '0B1220', { r: 0.08, line: { color: C.border, width: 0.75 }, name: 'Terminal' });
        windowBar(s, 0.5, Y0, 9.0);
        d.steps.forEach((st, i) => {
          const y = Y0 + 0.4 + i * h;
          t.text(s, `${i + 1} >`, { x: 0.7, y, w: 0.55, h: 0.3, fontSize: 14, bold: true, color: C.green, valign: 'middle' });
          head(s, st.h, 1.3, y, 8.0, 0.3, { color: C.green, max: 15 });
          body(s, st.t, 1.3, y + 0.31, 8.0, h - 0.34, { color: C.text, max: 13 });
        });
      },
      async (d) => { // light theme: release levels climbing
        const s = lightPage(d), n = d.steps.length, gap = 0.1, w = (9.0 - gap * (n - 1)) / n, rise = n === 4 ? 0.26 : 0.36, top = Y0 + rise * (n - 1);
        d.steps.forEach((st, i) => {
          const x = 0.5 + i * (w + gap), y = top - i * rise, h = Y1 - y;
          card(s, x, y, w, h);
          t.rect(s, x, y, w, 0.42, ACL[i], { name: 'Step head' });
          t.text(s, L.pad2(i + 1), { x: x + 0.15, y, w: w - 0.3, h: 0.42, fontSize: 15, bold: true, color: 'FFFFFF', valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.48, w - 0.3, 0.5, { max: 15, color: LT.text });
          body(s, st.t, x + 0.15, y + 1.0, w - 0.3, h - 1.08, { color: LT.muted, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // a leading KPI in a large panel, two small ones stacked beside it
        const s = page(d), [a, ...rest] = d.stats, h = d.note ? 2.88 : Y1 - Y0;
        panel(s, 0.5, Y0, 5.1, h, { border: C.sky });
        await chipIcon(s, 0.75, Y0 + 0.22, 0.42, 'FiActivity', C.sky);
        t.text(s, a.value, { x: 0.75, y: Y0 + 0.65, w: 4.6, h: h - 1.6, bold: true, color: C.sky, valign: 'middle', fontSize: L.fit(a.value, 4.6, h - 1.65, 72, 30, F.head, true) });
        body(s, a.label, 0.75, Y0 + h - 0.92, 4.6, 0.8, { color: C.text, max: 15 });
        rest.forEach((x, i) => {
          const rh = (h - 0.16) / 2, y = Y0 + i * (rh + 0.16), col = i ? C.amber : C.green;
          panel(s, 5.75, y, 3.75, rh);
          t.text(s, x.value, { x: 5.97, y: y + 0.08, w: 3.3, h: rh * 0.52, bold: true, color: col, valign: 'middle', fontSize: L.fit(x.value, 3.3, rh * 0.5, 36, 18, F.head, true) });
          body(s, x.label, 5.97, y + 0.1 + rh * 0.52, 3.3, rh * 0.48 - 0.16, { max: 13 });
        });
        if (d.note) body(s, d.note, 0.5, Y0 + h + 0.1, 9.0, Y1 - Y0 - h - 0.1, { max: 13 });
      },
      async (d) => { // light theme: a metrics table, the figure right-aligned at the end of each row
        const s = lightPage(d), rh = d.note ? 0.86 : 1.2, h = 3 * rh;
        card(s, 0.5, Y0, 9.0, h);
        d.stats.forEach((x, i) => {
          const y = Y0 + i * rh;
          t.oval(s, 0.75, y + rh / 2 - 0.08, 0.16, 0.16, ACL[i]);
          body(s, x.label, 1.1, y + 0.05, 5.2, rh - 0.1, { color: LT.text, valign: 'middle', max: 15 });
          t.text(s, x.value, { x: 6.45, y: y + 0.04, w: 2.8, h: rh - 0.08, bold: true, color: ACL[i], align: 'right', valign: 'middle', fontSize: L.fit(x.value, 2.75, rh - 0.12, 40, 20, F.head, true) });
          if (i < 2) t.line(s, 0.75, y + rh, 8.5, 0, LT.border, 0.75);
        });
        if (d.note) body(s, d.note, 0.5, Y0 + h + 0.1, 9.0, Y1 - Y0 - h - 0.1, { color: LT.muted, max: 13 });
      },
      async (d) => { // solid signal tiles, the middle one dropped a level
        const s = page(d), gap = 0.2, w = (9.0 - 2 * gap) / 3, h = d.note ? 2.45 : 3.0;
        d.stats.forEach((x, i) => {
          const px = 0.5 + i * (w + gap), y = Y0 + (i === 1 ? 0.25 : 0), col = [C.sky, C.amber, C.green][i];
          t.rect(s, px, y, w, h, col, { r: 0.1, name: 'Signal tile' });
          t.text(s, x.value, { x: px + 0.2, y: y + 0.18, w: w - 0.4, h: 1.1, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(x.value, w - 0.4, 1.05, 50, 24, F.head, true) });
          t.line(s, px + 0.2, y + 1.32, w - 0.4, 0, C.bg, 1);
          body(s, x.label, px + 0.2, y + 1.42, w - 0.4, h - 1.52, { color: C.bg, max: 14 });
        });
        if (d.note) body(s, d.note, 0.5, Y0 + h + 0.33, 9.0, Y1 - Y0 - h - 0.33, { max: 13 });
      },
    ],
    compare: [
      async (d) => { // a code diff: the removed block above, the added one below
        const s = page(d), h = (Y1 - Y0 - 0.12) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.12), col = i ? C.green : C.rose, tint = i ? '12312F' : '3A1C2C', n = side.items.length;
          t.rect(s, 0.5, y, 9.0, h, tint, { r: 0.08, line: { color: col, width: 0.75 }, name: 'Diff block' });
          t.text(s, i ? '+' : '−', { x: 0.62, y: y + 0.1, w: 0.4, h: h - 0.2, fontSize: 30, bold: true, color: col, align: 'center', valign: 'middle' });
          head(s, side.h, 1.08, y + 0.1, 2.0, h - 0.2, { color: col, max: 16 });
          t.line(s, 3.2, y + 0.14, 0, h - 0.28, col, 0.75);
          const rh = (h - 0.14) / n;
          side.items.forEach((it, k) => {
            t.text(s, i ? '+' : '−', { x: 3.32, y: y + 0.07 + k * rh, w: 0.2, h: rh - 0.02, fontSize: 12, bold: true, color: col, valign: 'middle' });
            body(s, it, 3.56, y + 0.07 + k * rh, 5.82, rh - 0.02, { color: C.text, valign: 'middle', max: 13 });
          });
        }
      },
      async (d) => { // light theme: a switch between two settings, sides mirrored
        const s = lightPage(d), w = 3.85, cx = W / 2, avail = Y1 - 2.15;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.2, avail);
        t.rect(s, cx - 0.42, Y0 + 0.08, 0.84, 0.42, ACL[0], { r: 0.21, name: 'Switch' });
        t.oval(s, cx + 0.03, Y0 + 0.13, 0.32, 0.32, 'FFFFFF');
        t.line(s, cx, Y0 + 0.62, 0, Y1 - Y0 - 0.62, LT.border, 1, { name: 'Axis' });
        head(s, d.left.h, 0.5, Y0 + 0.05, w, 0.5, { color: ACL[3], align: 'right', max: 20 });
        head(s, d.right.h, 5.65, Y0 + 0.05, w, 0.5, { color: ACL[1], max: 20 });
        let y = 2.15;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.5, y, w, h: rows[k], fontSize: fs, color: LT.text, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.65, y, w, h: rows[k], fontSize: fs, color: LT.text });
          t.oval(s, cx - 0.06, y + 0.05, 0.12, 0.12, ACL[0]);
          y += Math.max(rows[k], Math.min(0.72, avail / rows.length));
        }
      },
    ],
    statement: [
      async (d) => { // a full-width alert banner across the page, its details under it
        const s = page(d), hh = d.caption ? 2.25 : 3.4;
        t.rect(s, 0, Y0, W, hh, C.sky, { name: 'Alert banner' });
        t.img(s, await L.icon('FiZap', C.bg, 2.5), 0.5, Y0 + hh / 2 - 0.3, 0.6, 0.6);
        t.text(s, L.runs(d.text), { x: 1.35, y: Y0 + 0.1, w: 8.15, h: hh - 0.2, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(d.text, 8.15, hh - 0.25, 36, 20, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: 1.35, y: Y0 + hh + 0.12, w: 8.15, h: Y1 - Y0 - hh - 0.14, fontSize: L.fit(d.caption, 8.15, Y1 - Y0 - hh - 0.14, 15, 10, F.body), color: C.text });
      },
      async (d) => { // light theme: the thought on the canvas, the note in the inspector panel
        const s = lightPage(d);
        t.rect(s, 0.5, Y0 + 0.1, 0.08, 3.4, ACL[0], { r: 0.04, name: 'Accent bar' });
        t.text(s, L.runs(d.text), { x: 0.8, y: Y0, w: 5.1, h: Y1 - Y0, bold: true, color: LT.text, valign: 'middle', fontSize: L.fit(d.text, 5.1, Y1 - Y0 - 0.1, 34, 18, F.head, true) });
        card(s, 6.2, Y0, 3.3, Y1 - Y0);
        chip(s, 6.42, Y0 + 0.22, 0.5, ACL[0]);
        t.img(s, await L.icon('FiInfo', ACL[0], 2), 6.54, Y0 + 0.34, 0.26, 0.26);
        if (d.caption) t.text(s, d.caption, { x: 6.42, y: Y0 + 0.84, w: 2.86, h: Y1 - Y0 - 0.96, fontSize: L.fit(d.caption, 2.86, Y1 - Y0 - 0.96, 14, 10, F.body), color: LT.muted });
      },
    ],
    timeline: [
      async (d) => { // the changelog: version pills on a feed line, entries in one panel
        const s = page(d), n = d.items.length, rh = (Y1 - Y0 - 0.1) / n, lx = 2.1;
        panel(s, 0.5, Y0, 9.0, Y1 - Y0);
        t.line(s, lx, Y0 + 0.2, 0, Y1 - Y0 - 0.4, C.border, 1, { name: 'Feed line' });
        d.items.forEach((it, i) => {
          const y = Y0 + 0.05 + i * rh;
          t.rect(s, 0.7, y + 0.1, 1.2, 0.34, ACC[i], { r: 0.17, t: 80, name: 'Pill' });
          t.text(s, it.year, { x: 0.72, y: y + 0.1, w: 1.16, h: 0.34, bold: true, color: ACC[i], align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.1, 0.3, 14, 10, F.head, true) });
          t.oval(s, lx - 0.08, y + 0.19, 0.16, 0.16, ACC[i]);
          head(s, it.h, lx + 0.28, y + 0.04, 6.9, 0.32, { max: 15 });
          body(s, it.t, lx + 0.28, y + 0.36, 6.9, rh - 0.4, { max: 13 });
        });
      },
      async (d) => { // light theme: milestones pinned above and below one rail
        const s = lightPage(d), ly = (Y0 + Y1) / 2, ch = 1.62;
        t.rect(s, 0.5, ly - 0.03, 9.0, 0.06, LT.border, { name: 'Rail' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, cw = 4.4, x = i < 2 ? 0.5 : 5.1, y = up ? ly - 0.14 - ch : ly + 0.14;
          card(s, x, y, cw, ch);
          const px = up ? x + 0.2 : x + cw - 0.8;
          t.oval(s, px, ly - 0.09, 0.18, 0.18, ACL[i]);
          t.line(s, px + 0.09, up ? y + ch : ly, 0, 0.14, ACL[i], 1, { name: 'Pin' });
          t.text(s, it.year, { x: x + 0.15, y: y + 0.08, w: 1.5, h: 0.36, bold: true, color: ACL[i], valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.34, 18, 11, F.head, true) });
          head(s, it.h, x + 1.65, y + 0.08, cw - 1.8, 0.36, { max: 15, color: LT.text });
          body(s, it.t, x + 0.15, y + 0.48, cw - 0.3, ch - 0.54, { color: LT.muted, max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process (panels in a row) read like the cards page
  R.stats = V.stats.shift(); // the old stats (three panels) too
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (_t, _s, d) => ({ x: 0.5, y: 5.22, w: 9.0, h: 0.25, color: d._light ? LT.muted : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Dashboard', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.sky, accent2: C.green, accent3: C.amber, accent4: C.rose, accent5: C.violet, accent6: C.border, hlink: C.sky, folHlink: C.violet } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "analitik: ko'rsatkichlar, raqamlar, natijaga yo'naltirilgan", "limits": {}, "prefer": "data"};
module.exports = { id: 10, slug: 'dashboard', name: 'Dashboard', category: 'business', build, style: STYLE };
