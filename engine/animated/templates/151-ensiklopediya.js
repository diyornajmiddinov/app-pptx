/** 151 Ensiklopediya — an encyclopedia ARTICLE page: serif article title with a hairline, an INFOBOX on the right, a contents box, section headings, wikitables and numbered references with carets. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '202122', muted: '54595D', link: '0645AD', box: 'F8F9FA', border: 'A2A9B1', head: 'EAECF0' };
const F = { head: 'Georgia', body: 'Arial' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const header = (s, title) => { k.head(s, title || '', 0.4, 0.2, 8.6, 0.6, { max: 26, min: 14, bold: false, color: C.ink, valign: 'bottom' }); t.line(s, 0.4, 0.86, 9.2, 0, C.border, 0.75); k.txt(s, `${k.M.org || 'SlideAI'} \u2022 ${k.idx}`, 0.4, 0.9, 6.0, 0.25, { size: 8.5, italic: true, color: C.muted }); };
  const infobox = async (s, x, y, w, h, title, photo, rows) => { t.rect(s, x, y, w, h, C.box, { line: { color: C.border, width: 0.75 }, name: 'Infobox' }); t.rect(s, x, y, w, 0.4, 'CEDFF2', { name: 'Infobox head' }); k.txt(s, title, x + 0.05, y, w - 0.1, 0.4, { max: 11, bold: true, align: 'center', valign: 'middle' }); let yy = y + 0.48; if (photo) { await k.photo(s, photo, x + 0.12, yy, w - 0.24, (w - 0.24) * 0.75); yy += (w - 0.24) * 0.75 + 0.1; } const rh = Math.min(0.42, (y + h - yy - 0.05) / Math.max(1, rows.length)); rows.forEach(([a, b], i) => { t.line(s, x + 0.08, yy + i * rh, w - 0.16, 0, C.border, 0.4); k.txt(s, a, x + 0.1, yy + i * rh, w * 0.38, rh, { max: 9, bold: true, valign: 'middle' }); k.txt(s, b || '', x + w * 0.4, yy + i * rh, w * 0.58, rh, { max: 9, valign: 'middle', color: C.link }); }); };
  const section = (s, title, x, y, w) => { k.head(s, title, x, y, w, 0.38, { max: 15, bold: false, color: C.ink, valign: 'bottom' }); t.line(s, x, y + 0.4, w, 0, C.border, 0.5); };
  const metaRows = () => [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]];
  const page = (d) => { const s = k.slide(C.bg); header(s, d.title); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const wikitable = (s, x, y, w, heads, rows2, widths) => { const n = rows2.length, rh = (5.15 - y - 0.38) / n; t.rect(s, x, y, w, 0.38, C.head, { line: { color: C.border, width: 0.5 }, name: 'Th' }); let cx = x; heads.forEach((h2, c) => { k.txt(s, h2, cx + 0.06, y, widths[c] - 0.12, 0.38, { max: 10, bold: true, valign: 'middle', align: 'center' }); cx += widths[c]; }); rows2.forEach((r, i) => { const yy = y + 0.38 + i * rh; t.rect(s, x, yy, w, rh, i % 2 ? C.box : 'FFFFFF', { line: { color: C.border, width: 0.5 }, name: 'Tr' }); let cx2 = x; r.forEach((cell, c) => { if (c) t.line(s, cx2, yy, 0, rh, C.border, 0.5); k.txt(s, cell, cx2 + 0.06, yy, widths[c] - 0.12, rh, { max: 11, valign: 'middle', bold: c === 0 && heads.length > 2 }); cx2 += widths[c]; }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); header(s, d.title); k.txt(s, [{ text: d.title, options: { bold: true } }, { text: ` \u2014 ${d.subtitle || ''}` }], 0.4, 1.3, 5.8, 2.0, { max: 15, min: 10, ls: 1.35 }); section(s, k.TR.topic.replace(':', ''), 0.4, 3.4, 5.8); k.txt(s, k.M.topic || '', 0.4, 3.85, 5.8, 1.1, { max: 12, color: C.link }); await infobox(s, 6.5, 1.2, 3.1, 3.95, k.M.author || d.title, d.image, metaRows()); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); k.txt(s, d.text, 0.4, 1.3, 5.8, 3.85, { max: 15, min: 10, ls: 1.4 }); await infobox(s, 6.5, 1.2, 3.1, 3.95, d.title, d.image, metaRows().slice(0, 2)); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); const n = d.items.length, h = 0.5 + n * 0.42; t.rect(s, 0.4, 1.3, 4.6, h, C.box, { line: { color: C.border, width: 0.75 }, name: 'Contents' }); k.txt(s, d.title, 0.55, 1.33, 4.3, 0.4, { size: 12, bold: true, align: 'center', valign: 'middle' }); d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}  `, options: { color: C.ink } }, { text: it, options: { color: C.link } }], 0.6, 1.78 + i * 0.42, 4.3, 0.42, { max: 13, valign: 'middle' })); k.txt(s, k.M.topic || '', 5.3, 1.3, 4.3, 3.8, { max: 13, italic: true, color: C.muted, valign: 'middle' }); },
    async cards(d) { const s = page(d), n = d.items.length, cols = n > 3 ? 2 : 1, rws = Math.ceil(n / cols), w = 9.2 / cols - 0.2, h = 4.0 / rws; d.items.forEach((it, i) => { const x = 0.4 + (i % cols) * (w + 0.4), y = 1.2 + Math.floor(i / cols) * h; section(s, it.h, x, y, w); k.txt(s, it.t, x, y + 0.48, w, h - 0.55, { max: 13, ls: 1.3 }); }); },
    async process(d) { const s = page(d), n = d.steps.length, cols = n > 3 ? 2 : 1, rws = Math.ceil(n / cols), w = 9.2 / cols - 0.2, h = 4.0 / rws; d.steps.forEach((st, i) => { const x = 0.4 + (i % cols) * (w + 0.4), y = 1.2 + Math.floor(i / cols) * h; section(s, `${i + 1}. ${st.h}`, x, y, w); k.txt(s, st.t, x, y + 0.48, w, h - 0.55, { max: 13, ls: 1.3 }); }); },
    async stats(d) { const s = page(d); wikitable(s, 0.4, 1.25, 9.2, ['', ''], [...d.stats.map((v) => [v.value, v.label]), ...(d.note ? [['\u2020', d.note]] : [])], [2.6, 6.6]); },
    async compare(d) { const s = page(d); const n = Math.max(d.left.items.length, d.right.items.length); wikitable(s, 0.4, 1.25, 9.2, [d.left.h, d.right.h], Array.from({ length: n }, (_, i) => [d.left.items[i] || '', d.right.items[i] || '']), [4.6, 4.6]); },
    async statement(d) { const s = page(d); t.rect(s, 0.6, 1.4, 0.06, 2.3, C.border, { name: 'Blockquote' }); k.head(s, L.runs(d.text), 0.85, 1.35, 8.6, 2.4, { max: 26, min: 13, bold: false }); if (d.caption) k.txt(s, d.caption, 0.85, 3.85, 8.6, 1.25, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); wikitable(s, 0.4, 1.25, 9.2, ['', '', ''], d.items.map((it) => [it.year, it.h, it.t]), [1.2, 2.4, 5.6]); },
    async quote(d) { const s = page({ title: d.author || '' }); k.txt(s, '\u201C', 0.6, 1.2, 1.0, 1.2, { size: 80, color: C.border, font: F.head }); k.head(s, d.text, 1.4, 1.45, 7.8, 2.6, { max: 26, min: 13, italic: true, bold: false }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.4, 4.15, 7.8, 0.45, { size: 13, color: C.link }); },
    async sources(d) { const s = page(d); const n = d.items.length, rh = 3.85 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. ^ `, options: { color: C.link, bold: true } }, { text: it }], 0.4, 1.25 + i * rh, 9.2, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: the web article, the printed volume on cream paper, the same article in night mode (L.pages)
  const CREAM = 'F6F1E3', SEPIA = '3B2F20', RUST = '8C3B1E', RULE = 'B8A98A', NIGHT = '101418', PANEL = '1E2530', NLINK = '88ABFF', NTEXT = 'EAECF0', NMUTE = 'A2A9B1', EDGE = '3A4454', TINTS = ['CEDFF2', 'F2D5DE', 'D3EFDD', 'F5E9C6'];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.18, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, bold: false, ...o });
  const volume = (d) => { const s = k.slide(CREAM); k.head(s, d.title || '', 0.7, 0.2, 8.6, 0.56, { max: 22, min: 13, color: SEPIA, align: 'center' }); t.line(s, 0.5, 0.82, 9.0, 0, SEPIA, 1.5); t.line(s, 0.5, 0.87, 9.0, 0, SEPIA, 0.5); k.foot(s, { x: 0.5, y: 5.32, w: 8.0, size: 7.5, color: '6B5C46' }); k.txt(s, String(k.idx), 8.7, 5.28, 0.8, 0.26, { size: 10, bold: true, font: F.head, color: SEPIA, align: 'right', valign: 'middle' }); return s; };
  const dark = (d) => { const s = k.slide(NIGHT); k.head(s, d.title || '', 0.4, 0.2, 8.4, 0.6, { max: 24, min: 14, bold: false, color: NTEXT, valign: 'bottom' }); t.line(s, 0.4, 0.86, 9.2, 0, EDGE, 0.75); k.txt(s, String(k.idx), 8.9, 0.42, 0.7, 0.4, { size: 11, italic: true, color: NMUTE, align: 'right', valign: 'bottom' }); k.foot(s, { y: 5.32, size: 7.5, color: NMUTE }); return s; };
  const half = (str) => { const w = String(str).split(' '), m = Math.ceil(w.length / 2); return [w.slice(0, m).join(' '), w.slice(m).join(' ')]; };
  const V = {
    image: [
      async (d) => { // a wide plate at the head of the column, the article set in two columns beneath it
        const s = page(d), [a, b] = half(d.text);
        await k.photo(s, d.image, 0.4, 1.2, 9.2, 2.1);
        t.rect(s, 0.4, 1.2, 9.2, 2.1, null, { line: { color: C.border, width: 0.75 }, name: 'Thumb' });
        bd(s, a, 0.4, 3.42, 4.45, 1.8, { max: 12.5 }); bd(s, b, 5.15, 3.42, 4.45, 1.8, { max: 12.5 });
        t.line(s, 5.0, 3.46, 0, 1.7, C.border, 0.5);
      },
      async (d) => { // the framed thumbnail stands at the left of the article with its small enlarge mark
        const s = page(d), x = 0.4, y = 1.25, w = 4.7, h = 3.9;
        t.rect(s, x, y, w, h, C.box, { line: { color: C.border, width: 0.75 }, name: 'Thumb frame' });
        await k.photo(s, d.image, x + 0.1, y + 0.1, w - 0.2, h - 0.52);
        t.rect(s, x + w - 0.36, y + h - 0.32, 0.22, 0.2, 'FFFFFF', { line: { color: C.border, width: 0.75 }, name: 'Enlarge' });
        k.txt(s, d.title || '', x + 0.12, y + h - 0.38, w - 0.6, 0.32, { max: 9.5, min: 7.5, color: C.muted, valign: 'middle', ls: 1 });
        bd(s, d.text, 5.35, y, 4.25, h, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // night mode: the picture runs off the right edge, the article in light words
        const s = dark(d);
        await k.photo(s, d.image, 5.6, 0.95, 4.4, 4.25);
        bd(s, d.text, 0.4, 1.05, 4.9, 4.1, { color: NTEXT, max: 13.5, valign: 'middle' });
      },
      async (d) => { // the printed volume: an engraving in an oval, the page-wide text around its side
        const s = volume(d);
        t.oval(s, 0.6, 1.08, 4.0, 4.05, null, { line: { color: SEPIA, width: 2.25 }, name: 'Plate' });
        t.img(s, await L.photo(L.src(d.image), 3.76, 3.81, { mask: 'circle', duo: [SEPIA, CREAM] }), 0.72, 1.2, 3.76, 3.81, { alt: '' });
        bd(s, d.text, 4.95, 1.05, 4.55, 4.1, { font: F.head, color: SEPIA, max: 12, valign: 'middle', ls: 1.2 });
      },
    ],
    cards: [
      async (d) => { // the portal page: boxes with coloured head bars, 2x2 or three tall ones
        const s = page(d), n = d.items.length, cols = n === 4 ? 2 : 3, w = (9.2 - 0.18 * (cols - 1)) / cols, H2 = n === 4 ? 1.92 : 3.92;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + (i % cols) * (w + 0.18), y = 1.22 + Math.floor(i / cols) * (H2 + 0.1);
          t.rect(s, x, y, w, H2, C.box, { line: { color: C.border, width: 0.75 }, name: 'Portal box' });
          t.rect(s, x, y, w, 0.44, TINTS[i], { line: { color: C.border, width: 0.75 }, name: 'Portal head' });
          t.img(s, await k.icon(it.icon, C.ink, 2), x + 0.1, y + 0.09, 0.26, 0.26);
          hd(s, it.h, x + 0.44, y, w - 0.5, 0.44, { max: 13, min: 10.5, bold: true, color: C.ink, font: F.body });
          bd(s, it.t, x + 0.14, y + 0.54, w - 0.28, H2 - 0.62, { max: n === 4 ? 12 : 14, ls: 1.25 });
        }
      },
      async (d) => { // the navbox at the foot of an article: a shaded heading cell, its text on the same row
        const s = page(d), n = d.items.length, y0 = 1.25, rh = 3.92 / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          t.rect(s, 0.4, y, 9.2, rh, i % 2 ? 'F8F9FA' : 'FFFFFF', { line: { color: C.border, width: 0.5 }, name: 'Row' });
          t.rect(s, 0.4, y, 3.0, rh, 'CCCCFF', { line: { color: C.border, width: 0.5 }, name: 'Row head' });
          t.img(s, await k.icon(it.icon, C.link, 2), 0.53, y + rh / 2 - 0.16, 0.32, 0.32);
          hd(s, it.h, 0.95, y + 0.02, 2.38, rh - 0.04, { max: 14, min: 11, bold: true, font: F.body, color: C.ink });
          bd(s, it.t, 3.55, y + 0.02, 5.9, rh - 0.04, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // the printed volume: columns between hairlines, each entry opening on a large initial
        const s = volume(d), n = d.items.length, w = 9.0 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w;
          if (i) t.line(s, x, 1.05, 0, 4.1, RULE, 0.75);
          k.txt(s, String(it.h || '').charAt(0).toUpperCase(), x + 0.16, 1.0, w - 0.3, 0.86, { size: 46, font: F.head, color: RUST, valign: 'middle', ls: 1 });
          hd(s, it.h, x + 0.16, 1.88, w - 0.3, 0.6, { max: 13.5, min: 10.5, bold: true, color: SEPIA, valign: 'top' });
          bd(s, it.t, x + 0.16, 2.52, w - 0.3, 2.65, { font: F.head, color: SEPIA, max: 11.5 });
        }
      },
      async (d) => { // night mode: a knowledge map, the topic in the middle and linked articles around it
        const s = dark(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.08 : 2.5;
        const spots = n === 4 ? [[0.4, 1.02, 3.65, 1.98], [5.95, 1.02, 3.65, 1.98], [0.4, 3.17, 3.65, 2.02], [5.95, 3.17, 3.65, 2.02]] : [[0.4, 1.02, 3.65, 2.3], [5.95, 1.02, 3.65, 2.3], [2.2, 3.62, 5.6, 1.58]];
        for (const [i, [x, y, w, h]] of spots.entries()) { const mid = n === 3 && i === 2, ex = mid ? cx : (i % 2 ? x : x + w), ey = mid ? y : y + h / 2; t.line(s, Math.min(cx, ex), Math.min(cy, ey), Math.abs(ex - cx) || 0.001, Math.abs(ey - cy) || 0.001, NLINK, 1, { flipV: (ex - cx) * (ey - cy) < 0 }); }
        t.oval(s, cx - 0.62, cy - 0.62, 1.24, 1.24, PANEL, { line: { color: NLINK, width: 1.5 }, name: 'Node' });
        k.txt(s, '¶', cx - 0.62, cy - 0.62, 1.24, 1.24, { size: 40, font: F.head, color: NLINK, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, PANEL, { line: { color: EDGE, width: 0.75 }, name: 'Preview' });
          t.img(s, await k.icon(it.icon, NLINK, 2), x + 0.13, y + 0.1, 0.3, 0.3);
          hd(s, it.h, x + 0.52, y + 0.05, w - 0.62, 0.4, { color: NLINK, max: 14 });
          bd(s, it.t, x + 0.14, y + 0.5, w - 0.28, h - 0.56, { color: NTEXT, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // the contents box at the left lists the steps, the sections follow at the right
        const s = page(d), n = d.steps.length, y0 = 1.25, H2 = 3.92, rh = H2 / n, boxH = 0.5 + n * 0.5;
        t.rect(s, 0.4, y0, 2.95, boxH, C.box, { line: { color: C.border, width: 0.75 }, name: 'Contents' });
        k.txt(s, '☰', 0.5, y0 + 0.05, 2.75, 0.4, { size: 13, color: C.muted, align: 'center', valign: 'middle' });
        for (const [i, st] of d.steps.entries()) {
          k.txt(s, [{ text: `${i + 1}  `, options: { color: C.ink } }, { text: st.h, options: { color: C.link } }], 0.55, y0 + 0.47 + i * 0.5, 2.7, 0.48, { max: 11.5, min: 10, valign: 'middle', ls: 1 });
          const y = y0 + i * rh;
          k.head(s, `${i + 1}  ${st.h}`, 3.65, y, 5.95, 0.36, { max: 14, min: 11.5, bold: false, valign: 'bottom' });
          t.line(s, 3.65, y + 0.38, 5.95, 0, C.border, 0.5);
          bd(s, st.t, 3.65, y + 0.42, 5.95, rh - 0.46, { max: 12.5 });
        }
      },
      async (d) => { // a flow diagram from the article: boxes step down, elbow arrows join them
        const s = page(d), n = d.steps.length, w = n === 4 ? 2.16 : 2.9, gap = (9.2 - n * w) / (n - 1), dy = n === 4 ? 0.52 : 0.72, h = 5.2 - 1.22 - (n - 1) * dy;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * (w + gap), y = 1.22 + i * dy;
          if (i < n - 1) { t.line(s, x + w, y + 0.3, gap / 2, 0, C.link, 1.5); t.line(s, x + w + gap / 2, y + 0.3, 0, dy, C.link, 1.5); t.line(s, x + w + gap / 2, y + 0.3 + dy, gap / 2, 0, C.link, 1.5); }
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: C.link, width: 1 }, name: 'Flow box' });
          t.rect(s, x, y, w, 0.6, 'CEDFF2', { line: { color: C.link, width: 1 }, name: 'Flow head' });
          k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.link } }, { text: st.h, options: { bold: true } }], x + 0.1, y, w - 0.2, 0.6, { max: 12.5, min: 10, valign: 'middle', ls: 1 });
          bd(s, st.t, x + 0.12, y + 0.68, w - 0.24, h - 0.74, { max: 12 });
        }
      },
      async (d) => { // the printed volume: a numbered figure down the middle, the text alternating on either side
        const s = volume(d), n = d.steps.length, y0 = 1.02, rh = 4.15 / n, cx = 5;
        t.line(s, cx, y0 + 0.1, 0, 3.95, SEPIA, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? cx + 0.45 : 0.5, w = 4.05, a = right ? 'left' : 'right', dd = 0.5, my = y + rh / 2 - dd / 2;
          t.oval(s, cx - dd / 2, my, dd, dd, CREAM, { line: { color: SEPIA, width: 1.5 }, name: 'Figure' });
          k.txt(s, String(i + 1), cx - dd / 2, my, dd, dd, { size: 15, font: F.head, bold: true, color: RUST, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.34, { max: 13, bold: true, color: SEPIA, align: a });
          bd(s, st.t, x, y + 0.38, w, rh - 0.4, { font: F.body, color: SEPIA, max: 12.5, align: a });
        }
      },
      async (d) => { // the breadcrumb trail: one chevron band across the page, the text under each crumb
        const s = page(d), n = d.steps.length, w = 9.6 / n, y = 1.3, h = 0.95;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.2 + i * w, fill = i % 2 ? 'B6D0EC' : 'CEDFF2', W2 = Math.round((w + 0.2) * 100);
          t.img(s, await k.svg(`crumb${n}${i % 2}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="95"><polygon points="0,0 ${W2 - 28},0 ${W2},47 ${W2 - 28},95 0,95 ${i ? '28,47' : '0,47'}" fill="#${fill}"/></svg>`, W2, 95), x, y, w + 0.2, h);
          k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.link } }, { text: st.h, options: { bold: true } }], x + 0.34, y, w - 0.5, h, { max: 13, min: 10, valign: 'middle', ls: 1 });
          bd(s, st.t, x + 0.3, y + h + 0.15, w - 0.42, 5.18 - y - h - 0.15, { max: 13.5, ls: 1.25 });
        }
      },
    ],
    stats: [
      async (d) => { // the lead figure opens the article, the other two go in the infobox at the side
        const s = page(d), [a, ...rest] = d.stats, x = 6.2, w = 3.4;
        hd(s, a.value, 0.4, 1.25, 5.45, 1.5, { max: 70, min: 28, bold: true, color: C.link });
        bd(s, a.label, 0.4, 2.8, 5.45, 0.65, { max: 15, min: 11 });
        if (d.note) { t.line(s, 0.4, 3.6, 5.45, 0, C.border, 0.5); bd(s, d.note, 0.4, 3.68, 5.45, 1.48, { max: 12, color: C.muted }); }
        t.rect(s, x, 1.25, w, 3.9, C.box, { line: { color: C.border, width: 0.75 }, name: 'Infobox' });
        t.rect(s, x, 1.25, w, 0.4, 'CEDFF2', { name: 'Infobox head' });
        k.txt(s, 'ℹ', x, 1.25, w, 0.4, { size: 14, bold: true, align: 'center', valign: 'middle', font: F.head });
        rest.forEach((v, i) => { const y = 1.75 + i * 1.7; if (i) t.line(s, x + 0.1, y - 0.04, w - 0.2, 0, C.border, 0.5); hd(s, v.value, x + 0.15, y, w - 0.3, 0.85, { max: 34, min: 16, color: C.ink, align: 'center' }); bd(s, v.label, x + 0.15, y + 0.87, w - 0.3, 0.72, { max: 12, align: 'center', color: C.muted }); });
      },
      async (d) => { // the printed volume: three figures in columns, a dagger note at the foot of the page
        const s = volume(d), w = 3;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w;
          if (i) t.line(s, x, 1.15, 0, 2.5, RULE, 0.75);
          hd(s, v.value, x + 0.15, 1.2, w - 0.3, 1.25, { max: 38, min: 18, bold: true, color: RUST, align: 'center' });
          t.line(s, x + 1, 2.52, w - 2, 0, SEPIA, 1);
          bd(s, v.label, x + 0.2, 2.62, w - 0.4, 1.0, { font: F.head, color: SEPIA, max: 12, align: 'center', italic: true });
        }
        if (d.note) { t.line(s, 0.5, 3.85, 3.0, 0, SEPIA, 0.75); k.txt(s, [{ text: '†  ', options: { bold: true, color: RUST } }, { text: d.note }], 0.5, 3.93, 9.0, 1.24, { max: 12, min: 10, color: SEPIA, ls: 1.2 }); }
      },
      async (d) => { // night mode: tiles at uneven heights, like previews opened over the page
        const s = dark(d), w = 2.95, gap = 0.175, tops = [1.35, 1.02, 1.6];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * (w + gap), y = tops[i], h = 2.5;
          t.rect(s, x, y, w, h, PANEL, { line: { color: EDGE, width: 0.75 }, name: 'Preview' });
          t.rect(s, x, y, 0.07, h, NLINK, { name: 'Edge' });
          hd(s, v.value, x + 0.22, y + 0.15, w - 0.36, 1.2, { max: 36, min: 18, bold: true, color: NLINK });
          bd(s, v.label, x + 0.22, y + 1.4, w - 0.36, h - 1.5, { color: NTEXT, max: 12.5 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.2, 9.2, 1.0, { color: NMUTE, max: 12.5, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the printed volume: two mirrored columns about a double rule
        const s = volume(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 4.05, F.body, 0.12, 3.35);
        t.line(s, 4.96, 1.05, 0, 4.1, SEPIA, 1); t.line(s, 5.04, 1.05, 0, 4.1, SEPIA, 1);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.65, w = 4.05, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.02, w, 0.6, { max: 18, min: 12, bold: true, color: RUST, align: a });
          let y = 1.72; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: SEPIA, align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // two notice boxes stacked, each with its coloured side bar, the lines across
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.25 : 1.25, h = 1.9, n = sd.items.length, c = i ? '14866D' : 'B32424', x0 = 2.75, w = (9.5 - x0) / n;
          t.rect(s, 0.4, y, 9.2, h, C.box, { line: { color: C.border, width: 0.75 }, name: 'Notice' });
          t.rect(s, 0.4, y, 0.12, h, c, { name: 'Notice bar' });
          hd(s, sd.h, 0.65, y + 0.1, 1.95, h - 0.2, { max: 17, min: 12, bold: true, color: c });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.2, 0, h - 0.4, C.border, 0.5); bd(s, it, x + 0.1, y + 0.08, w - 0.18, h - 0.16, { max: 12.5, valign: 'middle' }); });
        }
      },
    ],
    statement: [
      async (d) => { // the printed volume: a centred saying between ornaments, its note set in two columns
        const s = volume(d), [a, b] = half(d.caption || '');
        k.txt(s, '❦', 3.5, 0.95, 3.0, 0.42, { size: 18, color: RUST, align: 'center', valign: 'middle', ls: 1 });
        k.head(s, L.runs(d.text), 0.9, 1.38, 8.2, 2.05, { max: 26, min: 14, bold: false, italic: true, color: SEPIA, align: 'center' });
        k.txt(s, '❦', 3.5, 3.42, 3.0, 0.36, { size: 14, color: RUST, align: 'center', valign: 'middle', ls: 1 });
        if (d.caption) { bd(s, a, 0.5, 3.85, 4.35, 1.32, { color: SEPIA, max: 12 }); bd(s, b, 5.15, 3.85, 4.35, 1.32, { color: SEPIA, max: 12 }); }
      },
      async (d) => { // night mode: the sentence large on the dark screen, the note in a panel on the right
        const s = dark(d);
        k.head(s, L.runs(d.text), 0.4, 1.05, 5.5, 4.1, { max: 32, min: 16, bold: false, color: NTEXT });
        if (d.caption) { t.rect(s, 6.2, 1.15, 3.4, 3.9, PANEL, { line: { color: EDGE, width: 0.75 }, name: 'Note' }); t.rect(s, 6.2, 1.15, 3.4, 0.07, NLINK, { name: 'Edge' }); bd(s, d.caption, 6.4, 1.32, 3.0, 3.62, { color: NMUTE, max: 13, valign: 'middle', ls: 1.22 }); }
      },
    ],
    timeline: [
      async (d) => { // the revision history: a thin line of dots down the left, each edit on a row
        const s = page(d), y0 = 1.25, rh = 3.92 / 4;
        t.line(s, 0.62, y0 + 0.2, 0, rh * 3 + 0.25, C.border, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          t.oval(s, 0.52, y + rh / 2 - 0.1, 0.2, 0.2, C.link);
          hd(s, it.year, 0.9, y, 1.45, rh - 0.06, { max: 16, min: 11, color: C.link });
          k.txt(s, it.h, 2.4, y, 2.1, rh - 0.06, { max: 13, min: 10.5, bold: true, valign: 'middle' });
          bd(s, it.t, 4.6, y, 5.0, rh - 0.06, { valign: 'middle', max: 12 });
          if (i) t.line(s, 0.9, y - 0.03, 8.7, 0, 'EAECF0', 0.75);
        }
      },
      async (d) => { // the printed volume: a ruled axis across the page, entries above and below it in turn
        const s = volume(d), ay = 3.08, w = 3.3, step = 1.9;
        t.line(s, 0.5, ay, 9.0, 0, SEPIA, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * step, up = i % 2 === 0, y = up ? 1.0 : ay + 0.1, h = up ? ay - 1.06 : 5.2 - y;
          t.line(s, x, up ? y + 0.05 : ay, 0, up ? ay - y - 0.05 : h - 0.1, RULE, 1);
          t.oval(s, x - 0.07, ay - 0.07, 0.14, 0.14, RUST);
          hd(s, it.year, x + 0.1, y, 1.3, 0.42, { max: 15, min: 10.5, bold: true, color: RUST });
          hd(s, it.h, x + 1.42, y, w - 1.42, 0.42, { max: 12, min: 10, bold: true, color: SEPIA });
          bd(s, it.t, x + 0.1, y + 0.44, w - 0.05, h - 0.48, { color: SEPIA, max: 12 });
        }
      },
      async (d) => { // night mode: four columns climbing year by year, the year large at the head of each
        const s = dark(d), w = 2.3;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, y = 1.0 + (3 - i) * 0.34;
          if (i) t.line(s, x, y + 0.05, 0, 5.15 - y - 0.05, EDGE, 0.75);
          hd(s, it.year, x + 0.14, y, w - 0.24, 0.62, { max: 22, min: 13, bold: true, color: NLINK });
          t.rect(s, x + 0.14, y + 0.65, 0.5, 0.05, NLINK, { name: 'Tick' });
          hd(s, it.h, x + 0.14, y + 0.75, w - 0.24, 0.5, { max: 13, color: NTEXT, valign: 'top' });
          bd(s, it.t, x + 0.14, y + 1.27, w - 0.24, 5.18 - y - 1.27, { color: NMUTE, max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards and process were one page, and so were the old stats, compare and timeline tables
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Ensiklopediya', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '202122', lt2: C.box, accent1: C.link, accent2: '3366CC', accent3: 'B32424', accent4: '14866D', accent5: C.muted, accent6: C.border, hlink: C.link, folHlink: '0B0080' } });
}
module.exports = { id: 151, slug: 'ensiklopediya', name: 'Ensiklopediya', category: 'academic', photos: true, build, style: { tone: "ensiklopedik maqola: betaraf, faktlarga asoslangan, aniq ta'rif va manbalar bilan", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["p14:flip|dir=\"l\"", "fade", "pull:l"], "cover": ["fadeLetters", "riseWords"], "mark": "fade", "deco": "fade", "sig": {"title": "riseWords", "body": "fadeWords", "item": "fadeUp", "image": "fade", "number": "fade", "order": "seq", "stagger": 0.22}, "tempo": 1.2, "kenburns": false};
