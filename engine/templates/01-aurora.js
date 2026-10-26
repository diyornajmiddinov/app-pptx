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
      const w = 4.15, cfs = L.colSize(d, w - 1.0, 1.6 + 3.35 - 2.5 - 0.1, 0.2, F.body), rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 1.0, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * 4.45;
        glass(s, x, 1.6, w, 3.35, i ? { border: C.cyan, bw: 1.25 } : {});
        t.text(s, side.h, { x: x + 0.35, y: 1.85, w: w - 0.7, h: 0.45, fontSize: 20, bold: true, color: i ? C.cyan : C.ink, fontFace: F.head });
        let y = 2.5;
        side.items.forEach((it, k) => {
          const h = rows[k];
          t.oval(s, x + 0.38, y + 0.1, 0.08, 0.08, i ? C.cyan : C.muted);
          t.text(s, it, { x: x + 0.6, y, w: w - 1.0, h: h + 0.05, fontSize: cfs });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  L.stamp(SL, content, () => ({ x: 0.7, y: 5.15, w: 7.9, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Aurora', colors: { dk1: C.bg, lt1: C.ink, dk2: '1A2238', lt2: C.muted, accent1: C.cyan, accent2: C.violet, accent3: C.pink, accent4: '06B6D4', accent5: '7C3AED', accent6: 'A9B4CB', hlink: C.cyan, folHlink: C.violet } });
}

/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "zamonaviy, texnologik va ilhomlantiruvchi; qisqa, aniq jumlalar", "limits": {}};
module.exports = { id: 1, slug: 'aurora', name: 'Aurora', category: 'creative', build, style: STYLE };
