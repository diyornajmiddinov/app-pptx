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
  // ---- further ways to draw a type, all on this old desktop: a deck's pages must not look alike (L.pages)
  const MONO = 'Courier New', GREEN = '33FF33', CYAN = '55FFFF', LEMON = 'FFFF55', BLUE = '0000AA';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: o.font || F.body, fontSize: L.fit(v, w, h, o.max || 13, 10, o.font || F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontFace: o.font || F.head, fontSize: L.fit(v, w, h, o.max || 14, 10, o.font || F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const well = (s, v, x, y, w, h, o = {}) => { bevel(s, x, y, w, h, C.field, true); body(s, v, x + 0.1, y + 0.05, w - 0.2, h - 0.1, o); };
  const name = (d) => `${L.pad2(idx)} - ${d.title}`;
  const deskPage = (d) => { const s = pres.addSlide(); s.background = { color: C.desk }; idx++; win(s, 0.25, 0.2, 9.5, 0.47, name(d)); taskbar(s); return s; };
  const consolePage = (d) => { const s = page(d); bevel(s, 0.45, 0.8, 9.1, 4.15, '000000', true); return s; };
  const folder = (s, x, y, w = 0.32, h = 0.24) => { t.rect(s, x, y + h * 0.18, w, h * 0.82, C.yellow, { line: { color: C.darker, width: 0.75 }, name: 'Folder' }); t.rect(s, x, y, w * 0.45, h * 0.22, C.yellow, { line: { color: C.darker, width: 0.75 }, name: 'Folder tab' }); };
  const V = {
    image: [
      async (d) => { // the paint program: toolbox down the side, the picture as canvas
        const s = page(d), tools = ['FiEdit2', 'FiSquare', 'FiCircle', 'FiScissors', 'FiDroplet', 'FiType', 'FiMinus', 'FiSearch'];
        bevel(s, 0.45, 0.8, 0.82, 4.15);
        for (const [k, ic] of tools.entries()) { const x = 0.5 + (k % 2) * 0.36, y = 0.88 + Math.floor(k / 2) * 0.38; bevel(s, x, y, 0.34, 0.34, C.face, k === 0); t.img(s, await L.icon(ic, C.ink, 2), x + 0.07, y + 0.07, 0.2, 0.2); }
        ['000000', C.navy, 'C00000', '008000', C.yellow, C.light].forEach((c, k) => t.rect(s, 0.52 + (k % 2) * 0.36, 2.55 + Math.floor(k / 2) * 0.32, 0.32, 0.28, c, { line: { color: C.darker, width: 0.75 }, name: 'Paint' }));
        bevel(s, 1.35, 0.8, 8.2, 2.1, C.field, true);
        t.img(s, await L.photo(L.src(d.image), 8.08, 1.98), 1.41, 0.86, 8.08, 1.98, { alt: '' });
        well(s, d.text, 1.35, 3.0, 8.2, 1.95, { max: 14 });
      },
      async (d) => { // the photo is the wallpaper, one window open on it
        const s = pres.addSlide(); s.background = { color: C.desk }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, 5.25), 0, 0, W, 5.25, { alt: '' });
        win(s, 4.75, 0.3, 5.0, 4.7, name(d));
        well(s, d.text, 4.87, 0.75, 4.76, 4.13, { max: 14 });
        taskbar(s);
      },
      async (d) => { // the green console behind, the picture viewer open on top of it
        const s = consolePage(d);
        t.text(s, d.text, { x: 0.6, y: 0.95, w: 4.75, h: 3.85, fontFace: MONO, fontSize: L.fit(d.text, 4.75, 3.85, 13, 10, MONO), color: GREEN, valign: 'middle' });
        await viewer(s, d.image, 5.5, 1.05, 3.9, 3.6, `${TR.image_file}.bmp`);
      },
      async (d) => { // three panes: the folder tree, the words, a small preview
        const s = page(d);
        bevel(s, 0.45, 0.8, 1.45, 4.15, C.field, true);
        for (let k = 0; k < 7; k++) { const y = 0.95 + k * 0.54, x = 0.58 + (k % 3) * 0.22; if (k === 2) t.rect(s, 0.5, y - 0.07, 1.35, 0.42, C.navy, { name: 'Selected' }); folder(s, x, y, 0.42, 0.28); }
        well(s, d.text, 2.0, 0.8, 4.2, 4.15, { max: 13 });
        bevel(s, 6.3, 0.8, 3.25, 4.15, C.field, true);
        t.img(s, await L.photo(L.src(d.image), 3.13, 4.03), 6.36, 0.86, 3.13, 4.03, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // the file list in details view, first line selected
        const s = page(d), n = d.items.length, y0 = 1.12, rh = 3.78 / n;
        bevel(s, 0.45, 0.8, 9.1, 4.15, C.field, true);
        bevel(s, 0.5, 0.84, 3.1, 0.26); bevel(s, 3.6, 0.84, 5.9, 0.26);
        t.text(s, '▲', { x: 3.28, y: 0.84, w: 0.28, h: 0.26, fontSize: 8, color: C.darker, align: 'center', valign: 'middle', noFit: true });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, sel = i === 0;
          if (sel) t.rect(s, 0.5, y, 9.0, rh - 0.03, C.navy, { name: 'Selected row' });
          t.img(s, await L.icon(it.icon, sel ? C.light : C.navy, 2), 0.62, y + rh / 2 - 0.17, 0.32, 0.32);
          head(s, it.h, 1.05, y + 0.03, 2.45, rh - 0.09, { color: sel ? C.light : C.ink, max: 14 });
          body(s, it.t, 3.68, y + 0.03, 5.72, rh - 0.09, { color: sel ? C.light : C.ink, valign: 'middle' });
        }
      },
      async (d) => { // the control panel: large icons on raised tiles
        const s = page(d), n = d.items.length, w = 4.47, h = 1.98;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9.1 : w, x = 0.45 + (i % 2) * (w + 0.16), y = 0.8 + Math.floor(i / 2) * (h + 0.19);
          bevel(s, x, y, ww, h);
          bevel(s, x + 0.14, y + 0.3, 0.92, 0.92, C.field, true);
          t.img(s, await L.icon(it.icon, C.navy, 2), x + 0.32, y + 0.48, 0.56, 0.56);
          head(s, it.h, x + 1.2, y + 0.1, ww - 1.32, 0.42);
          body(s, it.t, x + 1.2, y + 0.54, ww - 1.32, h - 0.62);
        }
      },
      async (d) => { // the command prompt: a line typed for each idea
        const s = consolePage(d), n = d.items.length, rh = 3.85 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 0.95 + i * rh;
          t.img(s, await L.icon(it.icon, GREEN, 2), 0.62, y + 0.03, 0.26, 0.26);
          head(s, `> ${it.h}`, 1.0, y, 8.4, 0.32, { font: MONO, color: LEMON, max: 14 });
          body(s, it.t, 1.0, y + 0.33, 8.4, rh - 0.38, { font: MONO, color: GREEN, max: 12 });
        }
      },
      async (d) => { // a properties dialog: tabs on top, one open, the others shown as group boxes
        const s = page(d), n = d.items.length, tw = 9.1 / n, [a, ...rest] = d.items, gw = (8.8 - 0.14 * (rest.length - 1)) / rest.length;
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * tw, on = i === 0;
          bevel(s, x, on ? 0.8 : 0.87, tw - 0.03, on ? 0.46 : 0.39, on ? C.light : C.face);
          t.img(s, await L.icon(it.icon, C.navy, 2), x + 0.08, 0.92, 0.26, 0.26);
          head(s, it.h, x + 0.38, 0.87, tw - 0.46, 0.39, { color: C.ink, max: 12 });
        }
        bevel(s, 0.45, 1.26, 9.1, 3.69, C.light);
        t.img(s, await L.icon(a.icon, C.navy, 2), 0.65, 1.42, 0.72, 0.72);
        body(s, a.t, 1.55, 1.38, 7.8, 0.86, { valign: 'middle', max: 14 });
        for (const [i, it] of rest.entries()) {
          const x = 0.6 + i * (gw + 0.14);
          t.rect(s, x, 2.48, gw, 2.35, null, { line: { color: C.dark, width: 1 }, name: 'Group box' });
          t.img(s, await L.icon(it.icon, C.navy, 2), x + 0.1, 2.58, 0.3, 0.3);
          head(s, it.h, x + 0.46, 2.55, gw - 0.54, 0.36, { max: 12 });
          body(s, it.t, x + 0.1, 2.96, gw - 0.2, 1.8);
        }
      },
    ],
    process: [
      async (d) => { // bare desktop: small windows opening one after another, down the screen
        const s = deskPage(d), n = d.steps.length, cw = 9.5 / n, w = cw - 0.1, h = 2.2, dy = (5.15 - 0.78 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.25 + i * cw, y = 0.78 + i * dy;
          bevel(s, x, y, w, h);
          t.rect(s, x + 0.05, y + 0.05, w - 0.1, 0.42, C.navy, { name: 'Title bar' });
          head(s, `${i + 1}. ${st.h}`, x + 0.12, y + 0.05, w - 0.24, 0.42, { color: C.light, max: 12 });
          well(s, st.t, x + 0.08, y + 0.53, w - 0.16, h - 0.61);
        }
      },
      async (d) => { // a scrollbar is the spine, its thumb stops at each step
        const s = page(d), n = d.steps.length, top = 1.1, bot = 4.65, h = 1.22, dy = (bot - top - h + 0.28) / (n - 1);
        bevel(s, 4.83, top, 0.34, bot - top, 'E4E4E4', true);
        bevel(s, 4.83, 0.8, 0.34, 0.3); t.text(s, '▲', { x: 4.83, y: 0.8, w: 0.34, h: 0.3, fontSize: 9, color: C.ink, align: 'center', valign: 'middle', noFit: true });
        bevel(s, 4.83, bot, 0.34, 0.3); t.text(s, '▼', { x: 4.83, y: bot, w: 0.34, h: 0.3, fontSize: 9, color: C.ink, align: 'center', valign: 'middle', noFit: true });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.32 : 0.45, y = 0.8 + i * dy, w = 4.23, ty = top + 0.03 + i * ((bot - top - 0.46) / (n - 1));
          t.line(s, right ? 5.17 : 4.68, y + 0.25, 0.15, 0, C.navy, 1.5);
          bevel(s, x, y, w, h, C.field, true);
          head(s, st.h, x + 0.12, y + 0.06, w - 0.24, 0.32);
          body(s, st.t, x + 0.12, y + 0.4, w - 0.24, h - 0.46);
          bevel(s, 4.83, ty, 0.34, 0.4);
          t.text(s, String(i + 1), { x: 4.83, y: ty, w: 0.34, h: 0.4, bold: true, fontSize: 13, color: C.navy, align: 'center', valign: 'middle' });
        }
      },
      async (d) => { // a folder tree: every step opens inside the one before
        const s = page(d), n = d.steps.length, rh = 3.95 / n;
        bevel(s, 0.45, 0.8, 9.1, 4.15, C.field, true);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.62 + i * 0.42, y = 0.9 + i * rh, hasKid = i < n - 1;
          if (hasKid) t.line(s, x + 0.08, y + 0.12, 0, rh - 0.02, C.dark, 1, { dash: 'sysDot' });
          if (i) t.line(s, x - 0.34, y + 0.1, 0.34, 0, C.dark, 1, { dash: 'sysDot' });
          t.rect(s, x, y + 0.03, 0.16, 0.16, C.light, { line: { color: C.dark, width: 0.75 }, name: 'Expander' });
          t.text(s, hasKid ? '−' : '+', { x, y: y + 0.03, w: 0.16, h: 0.16, fontSize: 9, bold: true, color: C.ink, align: 'center', valign: 'middle', noFit: true });
          folder(s, x + 0.24, y, 0.32, 0.24);
          t.rect(s, x + 0.62, y - 0.02, 3.2, 0.3, i === n - 1 ? C.navy : C.light, { name: 'Label' });
          head(s, `${i + 1}. ${st.h}`, x + 0.68, y - 0.02, 3.1, 0.3, { color: i === n - 1 ? C.light : C.ink, max: 13 });
          body(s, st.t, x + 0.68, y + 0.3, 9.42 - x - 0.68, rh - 0.36, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // the calculator holds the main figure, two gauges beside it
        const s = page(d), [a, b, c] = d.stats, keys = [7, 8, 9, 4, 5, 6, 1, 2, 3];
        bevel(s, 0.45, 0.8, 4.7, 4.15);
        bevel(s, 0.6, 0.93, 4.4, 1.25, 'C8E4C0', true);
        t.text(s, a.value, { x: 0.7, y: 0.93, w: 4.2, h: 1.25, fontFace: MONO, bold: true, color: C.ink, align: 'right', valign: 'middle', fontSize: L.fit(a.value, 4.1, 1.1, 54, 22, MONO, true) });
        body(s, a.label, 0.6, 2.26, 4.4, 0.72, { valign: 'middle', max: 13 });
        keys.forEach((k, j) => { const x = 0.6 + (j % 3) * 0.52, y = 3.04 + Math.floor(j / 3) * 0.61; bevel(s, x, y, 0.47, 0.54); t.text(s, String(k), { x, y, w: 0.47, h: 0.54, fontSize: 12, bold: true, color: C.navy, align: 'center', valign: 'middle' }); });
        keys.forEach((_, j) => { if (j > 2) return; const x = 2.2 + j * 0.95; for (let r = 0; r < 3; r++) { const y = 3.04 + r * 0.61; bevel(s, x, y, 0.85, 0.54, r === 2 && j === 2 ? 'C00000' : C.face); t.text(s, ['/', '*', '%', '-', '+', '\u00B1', '.', '0', '='][r * 3 + j], { x, y, w: 0.85, h: 0.54, fontSize: 12, bold: true, color: r === 2 && j === 2 ? C.light : C.navy, align: 'center', valign: 'middle' }); } });
        [b, c].forEach((x, i) => {
          const y = 0.8 + i * 1.12;
          bevel(s, 5.3, y, 4.25, 1.04);
          bevel(s, 5.4, y + 0.1, 1.85, 0.84, '000000', true);
          t.text(s, x.value, { x: 5.44, y: y + 0.1, w: 1.77, h: 0.84, fontFace: MONO, bold: true, color: GREEN, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.7, 0.7, 26, 11, MONO, true) });
          body(s, x.label, 7.35, y + 0.06, 2.1, 0.92, { valign: 'middle', max: 12 });
        });
        if (d.note) well(s, d.note, 5.3, 3.06, 4.25, 1.89, { max: 13, valign: 'middle' });
      },
      async (d) => { // the console prints its report
        const s = consolePage(d), rh = d.note ? 0.86 : 1.28;
        d.stats.forEach((x, i) => {
          const y = 0.95 + i * rh;
          t.text(s, x.value, { x: 0.65, y, w: 3.0, h: rh - 0.08, fontFace: MONO, bold: true, color: i ? GREEN : LEMON, valign: 'middle', fontSize: L.fit(x.value, 2.95, rh - 0.14, 34, 14, MONO, true) });
          body(s, x.label, 3.8, y, 5.6, rh - 0.08, { font: MONO, color: GREEN, valign: 'middle', max: 13 });
          t.line(s, 0.65, y + rh - 0.04, 8.75, 0, '1E8C1E', 0.75, { dash: 'dash' });
        });
        if (d.note) body(s, `> ${d.note}`, 0.65, 3.6, 8.75, 1.26, { font: MONO, color: LEMON, valign: 'middle', max: 12 });
      },
    ],
    compare: [
      async (d) => { // two blue file panels, each reading away from the copy arrows between them
        const s = page(d), w = 4.25;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.45, a = i ? 'left' : 'right', n = side.items.length, rh = 3.42 / n;
          t.rect(s, x, 0.8, w, 4.15, BLUE, { line: { color: CYAN, width: 2 }, name: 'Panel' });
          t.rect(s, x + 0.08, 0.88, w - 0.16, 3.99, null, { line: { color: CYAN, width: 0.75 }, name: 'Panel rule' });
          head(s, side.h, x + 0.2, 0.92, w - 0.4, 0.5, { color: LEMON, align: a, font: MONO, max: 15 });
          side.items.forEach((it, k) => { const y = 1.44 + k * rh; t.line(s, x + 0.08, y, w - 0.16, 0, CYAN, 0.5); body(s, it, x + 0.2, y + 0.03, w - 0.4, rh - 0.06, { color: C.light, align: a, valign: 'middle', font: MONO, max: 12 }); });
        }
        ['\u25BA', '\u25C4'].forEach((g, k) => { bevel(s, 4.77, 2.42 + k * 0.5, 0.46, 0.42); t.text(s, g, { x: 4.77, y: 2.42 + k * 0.5, w: 0.46, h: 0.42, fontSize: 12, color: C.navy, align: 'center', valign: 'middle', noFit: true }); });
      },
      async (d) => { // two windows stacked, one field per point
        const s = page(d), h = 2.0;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 0.8 + i * (h + 0.15), n = side.items.length, cw = 8.9 / n;
          win(s, 0.45, y, 9.1, h, side.h);
          side.items.forEach((it, k) => well(s, it, 0.55 + k * cw, y + 0.46, cw - 0.08, h - 0.56, { max: 12, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // the blue screen: nothing else on the machine matters now
        const s = pres.addSlide(); s.background = { color: C.navy }; idx++;
        t.rect(s, 1.5, 0.4, 7.0, 0.38, C.face, { name: 'Label' });
        t.text(s, d.title, { x: 1.58, y: 0.4, w: 6.84, h: 0.38, bold: true, fontFace: MONO, color: C.navy, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 6.84, 0.36, 13, 10, MONO, true) });
        const bottom = d.caption ? 3.6 : 5.0;
        t.text(s, L.runs(d.text), { x: 0.7, y: 1.0, w: 8.6, h: bottom - 1.0, bold: true, fontFace: MONO, color: C.light, valign: 'middle', fontSize: L.fit(d.text, 8.6, bottom - 1.1, 30, 15, MONO, true) });
        if (d.caption) body(s, d.caption, 0.7, 3.72, 8.6, 1.35, { font: MONO, color: C.light, max: 12 });
        taskbar(s);
      },
      async (d) => { // notepad: the thought typed big, a small message box over the corner
        const s = page(d), bh = d.caption ? 2.25 : 4.15;
        bevel(s, 0.45, 0.8, 9.1, 4.15, C.field, true);
        t.text(s, L.runs(d.text), { x: 0.7, y: 0.9, w: 8.6, h: bh - 0.2, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.6, bh - 0.25, 32, 16, F.head, true) });
        if (d.caption) {
          win(s, 3.4, 3.1, 6.05, 1.75, TR.message);
          t.oval(s, 3.55, 3.68, 0.5, 0.5, C.navy); t.text(s, 'i', { x: 3.55, y: 3.68, w: 0.5, h: 0.5, fontFace: 'Times New Roman', fontSize: 20, bold: true, italic: true, color: C.light, align: 'center', valign: 'middle' });
          body(s, d.caption, 4.2, 3.5, 5.15, 1.28, { valign: 'middle', max: 12 });
        }
      },
    ],
    timeline: [
      async (d) => { // the date slider: four stops on a groove, a box above or below each
        const s = page(d), xs = [1.2, 3.4, 5.85, 8.05], cy = 2.875, w = 4.47, h = 1.85;
        bevel(s, 0.6, cy - 0.04, 8.8, 0.08, C.dark, true);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.45 : 5.08, y = up ? 0.8 : 3.1, yr = up ? y + h : cy;
          bevel(s, xs[i] - 0.09, cy - 0.17, 0.18, 0.34);
          t.line(s, xs[i], yr, 0, up ? cy - 0.17 - yr : y - cy, C.navy, 1.25);
          bevel(s, x, y, w, h, C.field, true);
          t.rect(s, x + 0.06, y + 0.06, 1.4, 0.32, C.navy, { name: 'Year' });
          t.text(s, it.year, { x: x + 0.08, y: y + 0.06, w: 1.36, h: 0.32, bold: true, color: C.light, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.3, 0.3, 13, 9, F.head, true) });
          head(s, it.h, x + 1.56, y + 0.06, w - 1.66, 0.32, { max: 13 });
          body(s, it.t, x + 0.1, y + 0.44, w - 0.2, h - 0.5);
        }
      },
      async (d) => { // the taskbar stood on end: a button per year, the first one pressed
        const s = page(d), rh = 4.15 / 4;
        bevel(s, 0.45, 0.8, 1.7, 4.15);
        for (const [i, it] of d.items.entries()) {
          const y = 0.8 + i * rh;
          bevel(s, 0.52, y + 0.08, 1.56, rh - 0.16, C.face, i === 0);
          t.text(s, it.year, { x: 0.58, y: y + 0.08, w: 1.44, h: rh - 0.16, bold: true, color: i === 0 ? C.navy : C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.38, 0.5, 15, 10, F.head, true) });
          bevel(s, 2.25, y + 0.04, 7.3, rh - 0.08);
          head(s, it.h, 2.38, y + 0.08, 7.05, 0.3, { max: 13 });
          body(s, it.t, 2.38, y + 0.38, 7.05, rh - 0.46, { max: 13 });
        }
      },
      async (d) => { // bare desktop: four windows tiled across the screen
        const s = deskPage(d), w = 4.68, h = 2.15;
        for (const [i, it] of d.items.entries()) {
          const x = 0.25 + (i % 2) * (w + 0.14), y = 0.77 + Math.floor(i / 2) * (h + 0.1);
          win(s, x, y, w, h, `${it.year}  -  ${it.h}`);
          well(s, it.t, x + 0.1, y + 0.45, w - 0.2, h - 0.55, { max: 14, valign: 'middle' });
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline columns looked like the process columns
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Retro OS', colors: { dk1: C.ink, lt1: C.light, dk2: C.navy, lt2: C.face, accent1: C.navy, accent2: C.desk, accent3: '008000', accent4: 'C00000', accent5: C.dark, accent6: C.yellow, hlink: C.navy, folHlink: C.dark } });
}
/** Uslub pasporti */
const STYLE = { tone: "aniq va texnik, biroz o'yinqaroq: tizim xabarlari kabi qisqa va tushunarli", limits: {}, prefer: null };
module.exports = { id: 60, slug: 'retro-os', name: 'Retro OS', category: 'creative', photos: true, build, style: STYLE };
