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
      // where each caption's text really is, so the dashed grid lines can stop around it
      const boxes = d.items.map((it, i) => {
        const y = 1.4 + i * rh, bx = tx + i * seg + 0.05, bw = Math.min(seg * 1.6, tw - i * seg) - 0.1;
        const dw = Math.max(bw, 4.4), dx = Math.min(bx, 9.5 - dw), right = dx < bx;
        const tw1 = Math.min(dw, L.width(it.t, 14, F.body)), th = L.height(it.t, 14, dw, F.body);
        const x0 = right ? dx + dw - tw1 : dx;
        return { x0: x0 - 0.08, x1: x0 + tw1 + 0.08, y0: y + 0.45, y1: y + 0.45 + th + 0.08 };
      });
      for (let k = 0; k <= n; k++) {
        const x = tx + k * seg;
        const cuts = boxes.filter((b) => b.x0 < x && x < b.x1).sort((a, b) => a.y0 - b.y0);
        let y = 1.35;
        for (const b of cuts) { if (b.y0 > y) t.line(s, x, y, 0, b.y0 - y, C.border, 0.5, { dash: 'dash' }); y = Math.max(y, b.y1); }
        if (y < 5.1) t.line(s, x, y, 0, 5.1 - y, C.border, 0.5, { dash: 'dash' });
      }
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.5, y: 5.22, w: 9.0, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Dashboard', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.sky, accent2: C.green, accent3: C.amber, accent4: C.rose, accent5: C.violet, accent6: C.border, hlink: C.sky, folHlink: C.violet } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "analitik: ko'rsatkichlar, raqamlar, natijaga yo'naltirilgan", "limits": {}, "prefer": "data"};
module.exports = { id: 10, slug: 'dashboard', name: 'Dashboard', category: 'business', build, style: STYLE };
