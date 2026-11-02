/**
 * 60 Retro OS — a 1990s desktop: teal desktop, grey bevelled windows with navy title bars,
 * Explorer lists, setup-wizard steps, message boxes, a taskbar with Start button and clock.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { desk: '008080', face: 'C0C0C0', light: 'FFFFFF', dark: '808080', darker: '404040', navy: '000080', ink: '000000', field: 'FFFFFF', yellow: 'FFFF99' };
const F = { head: 'Arial', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bevel = (s, x, y, w, h, fill = C.face, sunken = false) => { // classic 3D edge
    t.rect(s, x, y, w, h, fill, { name: sunken ? 'Sunken' : 'Raised' });
    const a = sunken ? C.dark : C.light, b = sunken ? C.light : C.darker;
    t.line(s, x, y, w, 0, a, 1.5); t.line(s, x, y, 0, h, a, 1.5); t.line(s, x, y + h, w, 0, b, 1.5); t.line(s, x + w, y, 0, h, b, 1.5);
  };
  const win = (s, x, y, w, h, title) => {
    bevel(s, x, y, w, h);
    t.rect(s, x + 0.05, y + 0.05, w - 0.1, 0.32, C.navy, { name: 'Title bar' });
    t.text(s, title || '', { x: x + 0.15, y: y + 0.05, w: w - 1.2, h: 0.32, fontSize: L.fit(title || ' ', w - 1.2, 0.3, 13, 9, F.head, true), bold: true, color: C.light, valign: 'middle' });
    ['_', '\u25A1', '\u00D7'].forEach((g, k) => { bevel(s, x + w - 0.95 + k * 0.29, y + 0.09, 0.25, 0.23); t.text(s, g, { x: x + w - 0.95 + k * 0.29, y: y + 0.09, w: 0.25, h: 0.23, fontSize: 9, bold: true, color: C.ink, align: 'center', valign: 'middle', noFit: true }); });
  };
  const taskbar = (s) => {
    bevel(s, 0, 5.25, W, 0.375);
    bevel(s, 0.06, 5.3, 0.8, 0.28); t.text(s, '\u229E Start', { x: 0.06, y: 5.3, w: 0.8, h: 0.28, fontSize: 10, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, `${M.topic || ''}  |  ${meta}`, { x: 1.0, y: 5.3, w: 7.6, h: 0.28, fontSize: 8.5, color: C.ink, valign: 'middle' });
    bevel(s, 8.75, 5.3, 1.18, 0.28, C.face, true); t.text(s, M.year || '', { x: 8.75, y: 5.3, w: 1.18, h: 0.28, fontSize: 10, color: C.ink, align: 'center', valign: 'middle' });
  };
  let idx = 0;
  // every content slide is one big window on the desktop
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.desk }; idx++;
    win(s, 0.25, 0.2, 9.5, 4.95, d.title ? `${L.pad2(idx)} - ${d.title}` : L.pad2(idx));
    taskbar(s);
    return s;
  };
  const field = (s, txt, x, y, w, h, fs = 14) => { bevel(s, x, y, w, h, C.field, true); t.text(s, txt, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.16, fontSize: fs, color: C.ink, valign: 'top', lineSpacingMultiple: 1.15 }); };
  const viewer = async (s, src, x, y, w, h, name) => { win(s, x, y, w, h, name); bevel(s, x + 0.1, y + 0.45, w - 0.2, h - 0.55, C.field, true); t.img(s, await L.photo(L.src(src), w - 0.3, h - 0.65), x + 0.15, y + 0.5, w - 0.3, h - 0.65, { alt: '' }); };
  const button = (s, txt, x, y, w, h) => { bevel(s, x, y, w, h); t.text(s, txt, { x, y, w, h, fontSize: 11, color: C.ink, align: 'center', valign: 'middle' }); };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.desk }; idx++;
    [M.author, M.org, M.loc].filter(Boolean).forEach((lab, k) => {
      t.rect(s, 0.35, 0.3 + k * 0.95, 0.5, 0.42, C.yellow, { line: { color: C.darker, width: 1 }, name: 'Folder' });
      t.text(s, lab, { x: 0.05, y: 0.75 + k * 0.95, w: 1.1, h: 0.4, fontSize: 9, color: C.light, align: 'center', valign: 'top' });
    });
    win(s, 1.45, 0.45, d.image ? 4.9 : 8.1, 4.2, `${kind === 'cover' ? TR.deck_file : TR.end_file}.ppt`);
    t.text(s, d.title, { x: 1.7, y: 1.0, w: (d.image ? 4.9 : 8.1) - 0.5, h: 2.0, bold: true, fontSize: L.fit(d.title, (d.image ? 4.9 : 8.1) - 0.5, 1.9, 34, 18, F.head, true), color: C.ink, valign: 'middle' });
    if (d.subtitle) field(s, d.subtitle, 1.7, 3.1, (d.image ? 4.9 : 8.1) - 0.5, 0.85, 12);
    button(s, 'OK', 1.7, 4.1, 1.1, 0.35);
    t.text(s, M.author || '', { x: 2.95, y: 4.1, w: 3.2, h: 0.35, fontSize: 12, bold: true, color: C.navy, valign: 'middle' });
    if (d.image) await viewer(s, d.image, 6.55, 0.85, 3.2, 3.0, `${TR.image_file}.bmp`);
    taskbar(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await viewer(s, d.image, 0.45, 0.75, 4.2, 4.2, `${TR.image_file}.bmp`); field(s, d.text, 4.85, 0.8, 4.7, 4.15, 14); },
    async image(d) { const s = page(d); field(s, d.text, 0.45, 0.8, 4.7, 4.15, 14); await viewer(s, d.image, 5.35, 0.75, 4.2, 4.2, `${TR.image_file}.bmp`); },
    async agenda(d) {
      const s = page(d), n = d.items.length; bevel(s, 0.45, 0.8, 9.1, 4.15, C.field, true);
      const rh = Math.min(0.6, 3.9 / n);
      d.items.forEach((it, i) => {
        const y = 0.95 + i * rh;
        if (i === 0) t.rect(s, 0.55, y, 8.9, rh, C.navy, { name: 'Selected row' });
        t.rect(s, 0.7, y + (rh - 0.3) / 2, 0.38, 0.3, C.yellow, { line: { color: C.darker, width: 1 }, name: 'Folder' });
        t.text(s, `${i + 1}. ${it}`, { x: 1.25, y, w: 8.1, h: rh, fontSize: 15, color: i === 0 ? C.light : C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.15, w = (9.1 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.45 + i * (w + gap);
        bevel(s, x, 0.8, w, 4.15, C.face, true); bevel(s, x + 0.03, 0.83, w - 0.06, 4.09);
        t.img(s, await L.icon(it.icon, C.navy, 2), x + 0.15, 0.95, 0.38, 0.38);
        t.text(s, it.h, { x: x + 0.6, y: 0.9, w: w - 0.7, h: 0.55, fontSize: L.fit(it.h, w - 0.7, 0.5, 14, 9, F.head, true), bold: true, color: C.navy, valign: 'middle' });
        field(s, it.t, x + 0.12, 1.55, w - 0.24, 3.25, 13);
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 9.1 / n;
      bevel(s, 0.45, 0.8, 9.1, 0.4, C.field, true);
      for (let k = 0; k < 24; k++) if (k < Math.round(24 * (n - 0.5) / n)) t.rect(s, 0.52 + k * 0.375, 0.86, 0.32, 0.28, C.navy, { name: 'Progress' });
      d.steps.forEach((st, i) => {
        const x = 0.45 + i * cw;
        t.text(s, `${i + 1}. ${st.h}`, { x, y: 1.3, w: cw - 0.15, h: 0.55, fontSize: L.fit(`${i + 1}. ${st.h}`, cw - 0.15, 0.5, 14, 9, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        field(s, st.t, x, 1.9, cw - 0.15, 2.5, 13);
        button(s, i < n - 1 ? TR.next : TR.finish, x + cw - 1.35, 4.5, 1.2, 0.35);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.2, w = (9.1 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.45 + i * (w + gap);
        bevel(s, px, 0.8, w, 3.2, C.face, true); bevel(s, px + 0.03, 0.83, w - 0.06, 3.14);
        bevel(s, px + 0.2, 1.0, w - 0.4, 1.3, '000000', true);
        t.text(s, x.value, { x: px + 0.25, y: 1.0, w: w - 0.5, h: 1.3, fontFace: 'Courier New', fontSize: L.fit(x.value, w - 0.6, 1.1, 48, 20, 'Courier New', true), bold: true, color: '33FF33', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 2.45, w: w - 0.4, h: 1.4, fontSize: 13, color: C.ink, align: 'center' });
      });
      if (d.note) field(s, d.note, 0.45, 4.15, 9.1, 0.8, 11);
    },
    async compare(d) {
      const s = page(d), w = 4.45;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.6, F.body, 0.15, 4.85 - 1.4);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.45 + i * (w + 0.2);
        t.text(s, side.h, { x, y: 0.8, w, h: 0.45, fontSize: 15, bold: true, color: C.navy, valign: 'middle' });
        bevel(s, x, 1.3, w, 3.65, C.field, true);
        let y = 1.4;
        side.items.forEach((it, k) => { t.text(s, i ? '\u2714' : '\u2716', { x: x + 0.12, y, w: 0.3, h: 0.3, fontSize: 12, bold: true, color: i ? '008000' : 'C00000' }); t.text(s, it, { x: x + 0.45, y, w: w - 0.6, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      win(s, 1.3, 1.0, 7.4, 3.6, TR.message);
      t.oval(s, 1.6, 1.7, 0.7, 0.7, C.navy); t.text(s, 'i', { x: 1.6, y: 1.7, w: 0.7, h: 0.7, fontFace: 'Times New Roman', fontSize: 28, bold: true, italic: true, color: C.light, align: 'center', valign: 'middle' });
      t.text(s, L.runs(d.text), { x: 2.55, y: 1.55, w: 5.9, h: 1.55, bold: true, fontSize: L.fit(d.text, 5.9, 1.5, 28, 14, F.head, true), color: C.ink, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 2.55, y: 3.1, w: 5.9, h: 0.9, fontSize: 12, color: C.ink });
      button(s, 'OK', 4.45, 4.1, 1.1, 0.35);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.1 / n;
      d.items.forEach((it, i) => {
        const x = 0.45 + i * cw;
        bevel(s, x, 0.8, cw - 0.12, 0.5, C.navy);
        t.text(s, it.year, { x, y: 0.8, w: cw - 0.12, h: 0.5, fontSize: L.fit(it.year, cw - 0.3, 0.45, 18, 10, F.head, true), bold: true, color: C.light, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 1.4, w: cw - 0.12, h: 0.5, fontSize: 14, bold: true, color: C.ink, valign: 'middle' });
        field(s, it.t, x, 1.95, cw - 0.12, 3.0, 13);
      });
    },
    async quote(d) {
      const s = page({});
      field(s, `\u201C${d.text}\u201D\n\n\u2014 ${d.author || ''}`, 0.45, 0.8, 9.1, 4.15, L.fit(d.text, 8.6, 3.0, 26, 14, F.body));
    },
    async sources(d) {
      const s = page(d), n = d.items.length; bevel(s, 0.45, 0.8, 9.1, 4.15, C.field, true);
      const rh = Math.min(0.62, 3.9 / n);
      d.items.forEach((it, i) => t.text(s, [{ text: `[${i + 1}] `, options: { bold: true, color: C.navy } }, { text: it, options: { color: C.ink } }], { x: 0.6, y: 0.95 + i * rh, w: 8.8, h: rh, fontSize: 14, valign: 'middle' }));
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Retro OS', colors: { dk1: C.ink, lt1: C.light, dk2: C.navy, lt2: C.face, accent1: C.navy, accent2: C.desk, accent3: '008000', accent4: 'C00000', accent5: C.dark, accent6: C.yellow, hlink: C.navy, folHlink: C.dark } });
}
/** Uslub pasporti */
const STYLE = { tone: "aniq va texnik, biroz o'yinqaroq: tizim xabarlari kabi qisqa va tushunarli", limits: {}, prefer: null };
module.exports = { id: 60, slug: 'retro-os', name: 'Retro OS', category: 'creative', photos: true, build, style: STYLE };
