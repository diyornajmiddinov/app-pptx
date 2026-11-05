/** 156 Telegramma — an old TELEGRAM form: printed beige form with red rules and field labels, ideas typed on pasted paper TAPE strips ending in ■, a round date stamp. */
const { kit, L, rowsFit } = require('../free.js');
const C = { form: 'F3E9D2', red: 'B23A2E', ink: '1E1E1E', tape: 'FFFFFF', muted: '6B5E4B', stamp: '3B4BA8' };
const F = { head: 'Courier New', body: 'Courier New' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const form = (s) => { t.rect(s, 0.3, 0.2, 9.4, 5.2, C.form, { line: { color: C.red, width: 1.5 }, name: 'Form' }); t.rect(s, 0.4, 0.3, 9.2, 0.6, null, { line: { color: C.red, width: 0.75 }, name: 'Head box' }); t.line(s, 0.4, 1.0, 9.2, 0, C.red, 2); t.line(s, 0.4, 1.05, 9.2, 0, C.red, 0.5); };
  const stampDate = (s, x, y) => { t.oval(s, x, y, 1.0, 1.0, null, { line: { color: C.stamp, width: 2 } }); t.oval(s, x + 0.08, y + 0.08, 0.84, 0.84, null, { line: { color: C.stamp, width: 0.75 } }); k.txt(s, `${k.M.year || ''}\n${String(k.idx).padStart(2, '0')}`, x, y, 1.0, 1.0, { size: 10, bold: true, color: C.stamp, align: 'center', valign: 'middle' }); };
  // paper tape strip pasted on the form with typed text
  const tape = (s, x, y, w, h, txt, o = {}) => { t.rect(s, x, y, w, h, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' }); k.txt(s, [{ text: String(txt).toUpperCase() }, { text: '  \u25A0', options: { color: C.red } }], x + 0.08, y, w - 0.16, h, { max: o.max || 12, min: 8, valign: 'middle', ls: 1.1, bold: !!o.bold }); };
  const page = (d) => { const s = k.slide('D9CDB4'); form(s); k.txt(s, (k.M.org || '').toUpperCase(), 0.5, 0.3, 4.5, 0.6, { max: 11, bold: true, color: C.red, valign: 'middle' }); if (d.title) tape(s, 4.6, 0.38, 3.8, 0.45, d.title, { max: 12, bold: true }); stampDate(s, 8.5, 0.12); k.foot(s, { x: 0.5, y: 5.12, w: 9.0, size: 7.5, color: C.muted }); return s; };
  // rows: field label (red, small) + tape strip
  const rows = (s, list, label) => { const n = list.length, rh = 3.85 / n; list.forEach((txt, i) => { const y = 1.2 + i * rh; k.txt(s, label(i), 0.5, y, 1.1, rh, { size: 9, color: C.red, valign: 'middle', bold: true }); t.line(s, 1.6, y + rh - 0.03, 7.9, 0, C.red, 0.4, { dash: 'dash' }); tape(s, 1.7 + (i % 2) * 0.08, y + 0.05, 7.7 - (i % 2) * 0.08, rh - 0.12, txt); }); };
  const R = {
    async cover(d) { const s = page({}); const F2 = [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]]; tape(s, 0.6, 1.3, 8.8, 1.3, d.title, { max: 22, bold: true }); if (d.subtitle) tape(s, 0.6, 2.75, 6.2, 0.55, d.subtitle, { max: 11 }); F2.forEach(([a, v], i) => { k.txt(s, String(a).toUpperCase(), 0.6, 3.5 + i * 0.4, 1.6, 0.38, { size: 9, bold: true, color: C.red, valign: 'middle' }); t.line(s, 2.2, 3.5 + i * 0.4 + 0.36, 4.6, 0, C.red, 0.4); k.txt(s, v || '', 2.25, 3.5 + i * 0.4, 4.5, 0.38, { max: 12, valign: 'middle' }); }); if (d.image) await k.photo(s, d.image, 7.1, 2.75, 2.3, 2.25, { gray: true }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.25, 3.0, 3.8, { gray: true }); tape(s, 3.85, 1.3, 5.6, 3.7, d.text, { max: 13 }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items, (i) => `${String(i + 1).padStart(2, '0')}`); },
    async cards(d) { const s = page(d); rows(s, d.items.map((it) => `${it.h}: ${it.t}`), (i) => d.items[i].h.slice(0, 12).toUpperCase()); },
    async process(d) { const s = page(d); rows(s, d.steps.map((st) => `${st.h}: ${st.t}`), (i) => `${i + 1}.`); },
    async stats(d) { const s = page(d); rows(s, [...d.stats.map((v) => `${v.value} \u2014 ${v.label}`), ...(d.note ? [d.note] : [])], (i) => (i < d.stats.length ? `#${i + 1}` : '\u2020')); },
    async compare(d) { const s = page(d), w = 4.35; [d.left, d.right].forEach((sd, i) => { const x = 0.55 + i * 4.6; k.txt(s, sd.h.toUpperCase(), x, 1.15, w, 0.4, { max: 12, bold: true, color: C.red }); const { rows: rr } = rowsFit([sd.items], 11, w - 0.3, F.body, 0.12, 3.4); let y = 1.6; sd.items.forEach((it, j) => { tape(s, x, y, w, rr[j] - 0.06, it, { max: 11 }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); tape(s, 0.8, 1.4, 8.4, 2.2, d.text, { max: 22, bold: true }); if (d.caption) tape(s, 1.5, 3.85, 7.0, 0.95, d.caption, { max: 11 }); },
    async timeline(d) { const s = page(d); rows(s, d.items.map((it) => `${it.h}: ${it.t}`), (i) => d.items[i].year); },
    async quote(d) { const s = page({}); tape(s, 0.8, 1.4, 8.4, 2.5, `"${d.text}"`, { max: 20 }); if (d.author) k.txt(s, `-- ${d.author.toUpperCase()}`, 0.8, 4.1, 8.4, 0.45, { size: 13, bold: true, color: C.red, align: 'right' }); },
    async sources(d) { const s = page(d); rows(s, d.items, (i) => `[${i + 1}]`); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: telegraph poles and wire, punched tape, slips, envelopes, round stamps, the blue carbon copy (L.pages)
  const CARBON = '232B5E', ICE = 'D5DBF7', KRAFT = 'C9A876', DESK = 'D9CDB4', POLE = '5A4630', SLIP = 'FBF5E6';
  const up = (v) => String(v).toUpperCase();
  const ty = (s, v, x, y, w, h, o = {}) => k.txt(s, up(v), x, y, w, h, { max: 12, min: 10, ls: 1.1, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, up(v), x, y, w, h, { max: 13, min: 10, color: C.red, ls: 1.05, ...o });
  const strip = (s, x, y, w, h, v, o = {}) => { t.rect(s, x, y, w, h, o.fill || C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' }); k.txt(s, [{ text: up(v), ...(o.bold ? { options: { bold: true } } : {}) }, { text: '  ■', options: { color: C.red, ...(o.bold ? { bold: true } : {}) } }], x + 0.09, y + 0.02, w - 0.18, h - 0.04, { max: o.max || 12, min: o.min || 10, valign: 'middle', ls: 1.08, bold: !!o.bold, color: C.ink }); };
  const cut = (v, n) => { const words = String(v).split(' '), per = Math.ceil(String(v).length / n), out = ['']; for (const w of words) { if (out[out.length - 1].length + w.length + 1 > per && out.length < n) out.push(w); else out[out.length - 1] += (out[out.length - 1] ? ' ' : '') + w; } return out; };
  const carbon = (d) => { const s = k.slide(CARBON); t.rect(s, 0.3, 0.2, 9.4, 5.2, null, { line: { color: ICE, width: 1 }, name: 'Form edge' }); t.line(s, 0.4, 1.0, 9.2, 0, ICE, 1.5); if (d.title) k.txt(s, up(d.title), 0.5, 0.3, 7.8, 0.62, { max: 15, min: 10.5, bold: true, color: 'FFFFFF', valign: 'middle', ls: 1.05 }); t.oval(s, 8.65, 0.28, 0.66, 0.66, null, { line: { color: ICE, width: 1.5 } }); k.txt(s, String(k.idx).padStart(2, '0'), 8.65, 0.28, 0.66, 0.66, { size: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.foot(s, { x: 0.5, y: 5.12, w: 9.0, size: 7.5, color: ICE }); return s; };
  const ring = (s, x, y, dd, c = C.stamp) => { t.oval(s, x, y, dd, dd, null, { line: { color: c, width: 2.5 }, name: 'Stamp' }); t.oval(s, x + 0.08, y + 0.08, dd - 0.16, dd - 0.16, null, { line: { color: c, width: 0.75 }, name: 'Stamp' }); };
  const slip = (s, x, y, w, h, head = 0.44) => { t.rect(s, x, y, w, h, SLIP, { shadow: 0.2, blur: 3, offset: 2, line: { color: C.red, width: 0.75 }, name: 'Slip' }); t.rect(s, x, y, w, head, C.red, { name: 'Slip head' }); };
  const poles = (s, xs, wy, top = wy - 0.22, bot = 5.0) => { xs.forEach((x) => { t.rect(s, x - 0.04, top, 0.08, bot - top, POLE, { name: 'Pole' }); t.rect(s, x - 0.28, wy - 0.03, 0.56, 0.07, POLE, { name: 'Crossarm' }); }); };
  const punch = async (s, x, y, w, h) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let o = ''; for (let i = 8; i < W2 - 6; i += 12) { o += `<circle cx="${i}" cy="${H2 / 2}" r="2.5" fill="#${DESK}"/>`; if ((i * 7) % 5 < 3) o += `<circle cx="${i}" cy="${H2 * 0.24}" r="4" fill="#${DESK}"/>`; if ((i * 11) % 7 < 3) o += `<circle cx="${i}" cy="${H2 * 0.76}" r="4" fill="#${DESK}"/>`; } t.img(s, await k.svg(`punch${W2}-${H2}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect width="${W2}" height="${H2}" fill="#FFFFFF"/>${o}</svg>`, W2, H2), x, y, w, h); };
  const envelope = async (s, x, y, w, h, key) => { t.rect(s, x, y, w, h, KRAFT, { shadow: 0.25, blur: 4, offset: 2, name: 'Envelope' }); t.img(s, await k.svg(`flap${key}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="60"><polygon points="0,0 ${Math.round(w * 100)},0 ${Math.round(w * 50)},58" fill="#B8945F"/></svg>`, Math.round(w * 100), 60), x, y, w, 0.6); };
  const V = {
    image: [
      async (d) => { // the message goes out in strips pasted one under another, the picture glued beside them
        const s = page(d), lines = cut(d.text, 4), x = 0.55, w = 5.45, rh = 3.82 / 4;
        for (const [i, ln] of lines.entries()) strip(s, x + (i % 2) * 0.06, 1.2 + i * rh, w - (i % 2) * 0.06, rh - 0.08, ln, { max: 11.5 });
        await k.photo(s, d.image, 6.2, 1.22, 3.25, 3.78, { gray: true });
        t.rect(s, 6.2, 1.22, 3.25, 3.78, null, { line: { color: C.red, width: 1 }, name: 'Glued edge' });
      },
      async (d) => { // the picture slides out of a brown envelope, the words typed on its front
        const s = k.slide(DESK), x = 0.5, w = 9.0, y = 2.55, h = 2.72;
        await k.photo(s, d.image, 1.3, 0.2, 7.4, 2.5, { gray: true });
        t.rect(s, x, y, w, h, KRAFT, { shadow: 0.25, blur: 4, offset: 2, name: 'Envelope' });
        strip(s, 1.0, 0.32, 8.0, 0.5, d.title || '', { bold: true, max: 13 });
        ty(s, d.text, x + 0.3, y + 0.08, w - 0.6, h - 0.16, { valign: 'middle', max: 11.5 });
        k.foot(s, { x: 0.5, y: 5.33, w: 9.0, size: 7.5, color: C.muted });
      },
      async (d) => { // a blue carbon: the picture faint as a copy, the words on a white sheet laid over it
        const s = k.slide(CARBON), x = 5.1, w = 4.55;
        await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['1B2350', 'B9C4F2'] });
        t.rect(s, x, 0.3, w, 4.9, C.tape, { shadow: 0.3, blur: 4, offset: 2, name: 'Sheet' });
        t.rect(s, x, 0.3, w, 0.1, C.red, { name: 'Sheet band' });
        k.txt(s, up(d.title || ''), x + 0.2, 0.45, w - 0.4, 0.75, { max: 13, min: 10.5, bold: true, color: C.red, valign: 'middle', ls: 1.05 });
        ty(s, d.text, x + 0.2, 1.22, w - 0.4, 3.9, { valign: 'middle', max: 11 });
        t.rect(s, 0, 5.3, 10, 0.325, CARBON, { name: 'Foot band' }); k.foot(s, { x: 0.5, y: 5.34, w: 9.0, size: 7.5, color: ICE });
      },
      async (d) => { // the picture inside a round postmark, its dashed rim printed in blue
        const s = page(d), dd = 3.7, x = 5.8, y = 1.25;
        ring(s, x - 0.14, y - 0.14, dd + 0.28);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', duo: ['2A3580', 'EFEBDD'] }), x, y, dd, dd, { alt: '' });
        ty(s, d.text, 0.55, 1.15, 5.0, 3.95, { valign: 'middle', max: 11.5 });
      },
    ],
    cards: [
      async (d) => { // small telegram slips: 2x2, or three tall ones
        const s = page(d), n = d.items.length, cols = n === 4 ? 2 : 3, gap = 0.16, w = (8.96 - gap * (cols - 1)) / cols, H2 = n === 4 ? 1.87 : 3.84;
        for (const [i, it] of d.items.entries()) {
          const x = 0.52 + (i % cols) * (w + gap), y = 1.2 + Math.floor(i / cols) * (H2 + 0.1);
          slip(s, x, y, w, H2);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + 0.1, y + 0.07, 0.3, 0.3);
          hd(s, it.h, x + 0.47, y, w - 0.55, 0.44, { color: 'FFFFFF', max: 12.5 });
          ty(s, it.t, x + 0.13, y + 0.52, w - 0.26, H2 - 0.6, { max: n === 4 ? 11 : 12.5 });
        }
      },
      async (d) => { // telegraph poles across the land: a wire runs over the page, each idea under its own pole
        const s = page(d), n = d.items.length, w = 8.96 / n, xs = d.items.map((_, i) => 0.52 + w * (i + 0.5)), wy = 1.42;
        t.line(s, 0.4, wy, 9.2, 0, POLE, 1.25); t.line(s, 0.4, wy + 0.09, 9.2, 0, POLE, 1.25);
        poles(s, xs, wy, wy - 0.17, 2.14);
        for (const [i, it] of d.items.entries()) {
          const x = 0.52 + i * w, cx = xs[i];
          t.oval(s, cx - 0.27, 1.82, 0.54, 0.54, C.tape, { line: { color: C.red, width: 1.5 }, name: 'Insulator' });
          t.img(s, await k.icon(it.icon, C.red, 2), cx - 0.15, 1.94, 0.3, 0.3);
          hd(s, it.h, x + 0.07, 2.4, w - 0.14, 0.5, { align: 'center' });
          ty(s, it.t, x + 0.07, 2.92, w - 0.14, 2.14, { align: 'center', max: 12 });
        }
      },
      async (d) => { // the carbon copy: typed blocks in white, each set further in than the last
        const s = carbon(d), n = d.items.length, rh = 3.96 / n, dx = n === 4 ? 0.5 : 0.75, w = 7.4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * dx, y = 1.1 + i * rh;
          t.line(s, x, y + 0.04, 0, rh - 0.12, ICE, 2);
          t.img(s, await k.icon(it.icon, ICE, 2), x + 0.13, y + 0.04, 0.3, 0.3);
          hd(s, it.h, x + 0.5, y + 0.01, w - 0.55, 0.36, { color: 'FFFFFF', max: 13 });
          ty(s, it.t, x + 0.15, y + 0.38, w - 0.2, rh - 0.44, { color: ICE, max: 11.5 });
        }
      },
      async (d) => { // the telegraph office: lines fan out of a central stamp to each slip of tape
        const s = page(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.1 : 2.45, dd = 1.22;
        const spots = n === 4 ? [[0.52, 1.18, 3.5, 1.86], [5.98, 1.18, 3.5, 1.86], [0.52, 3.15, 3.5, 1.9], [5.98, 3.15, 3.5, 1.9]] : [[0.52, 1.18, 3.5, 2.2], [5.98, 1.18, 3.5, 2.2], [1.9, 3.48, 6.2, 1.56]];
        for (const [i, [x, y, w, h]] of spots.entries()) { const mid = n === 3 && i === 2, ex = mid ? cx : (i % 2 ? x : x + w), ey = mid ? y : y + h / 2; t.line(s, Math.min(cx, ex), Math.min(cy, ey), Math.abs(ex - cx) || 0.001, Math.abs(ey - cy) || 0.001, C.red, 1.25, { dash: 'dash', flipV: (ex - cx) * (ey - cy) < 0 }); }
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.form);
        ring(s, cx - dd / 2, cy - dd / 2, dd);
        k.txt(s, '■', cx - dd / 2, cy - dd / 2, dd, dd, { size: 26, color: C.red, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' });
          t.img(s, await k.icon(it.icon, C.stamp, 2), x + 0.1, y + 0.08, 0.3, 0.3);
          hd(s, it.h, x + 0.47, y + 0.03, w - 0.55, 0.42);
          ty(s, it.t, x + 0.12, y + 0.5, w - 0.24, h - 0.56, { max: 11 });
        }
      },
    ],
    process: [
      async (d) => { // a punched tape runs over the form; a mark on it for each step, the words typed beneath
        const s = page(d), n = d.steps.length, w = 8.96 / n;
        await punch(s, 0.3, 1.25, 9.4, 0.74);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.52 + i * w, cx = x + w / 2;
          t.oval(s, cx - 0.36, 1.26, 0.72, 0.72, C.red, { name: 'Mark' });
          k.txt(s, String(i + 1), cx - 0.36, 1.26, 0.72, 0.72, { size: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          t.line(s, cx, 1.98, 0, 0.14, C.red, 1);
          hd(s, st.h, x + 0.06, 2.14, w - 0.12, 0.52, { align: 'center' });
          ty(s, st.t, x + 0.06, 2.68, w - 0.12, 2.38, { align: 'center', max: 12 });
        }
      },
      async (d) => { // relay stations down one wire: a stamped number on it, the message tape off to either side
        const s = page(d), n = d.steps.length, y0 = 1.15, rh = 3.92 / n, cx = 5, w = 4.22;
        t.line(s, cx, y0 + 0.05, 0, 3.8, POLE, 2);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? cx + 0.34 : cx - 0.34 - w, dd = 0.56, my = y + rh / 2 - dd / 2;
          t.oval(s, cx - dd / 2, my, dd, dd, C.form); ring(s, cx - dd / 2, my, dd);
          k.txt(s, String(i + 1), cx - dd / 2, my, dd, dd, { size: 14, bold: true, color: C.stamp, align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, x, y + 0.03, w, rh - 0.08, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' });
          hd(s, st.h, x + 0.09, y + 0.03, w - 0.18, 0.25, { max: 11 });
          ty(s, st.t, x + 0.09, y + 0.28, w - 0.18, rh - 0.32, { max: 11 });
        }
      },
      async (d) => { // slips climbing the form: the step's number spelled out in dots across its head
        const s = page(d), n = d.steps.length, gap = 0.1, w = (8.96 - gap * (n - 1)) / n, rise = n === 4 ? 0.3 : 0.42;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.52 + i * (w + gap), y = 1.18 + (n - 1 - i) * rise, h = 5.06 - y;
          slip(s, x, y, w, h);
          for (let j = 0; j <= i; j++) t.oval(s, x + 0.12 + j * 0.2, y + 0.14, 0.15, 0.15, 'FFFFFF', { name: 'Dot' });
          k.txt(s, String(i + 1), x + w - 0.5, y, 0.42, 0.44, { size: 16, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.12, y + 0.48, w - 0.24, 0.5);
          ty(s, st.t, x + 0.12, y + 1.0, w - 0.24, h - 1.06, { max: 12 });
        }
      },
      async (d) => { // the carbon route sheet: boxed numbers on an arrow, down the left of the page
        const s = carbon(d), n = d.steps.length, y0 = 1.1, rh = 3.98 / n;
        t.line(s, 0.88, y0 + 0.2, 0, 3.45, ICE, 2);
        k.txt(s, '▼', 0.73, 4.72, 0.3, 0.3, { size: 12, color: ICE, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, by = y + rh / 2 - 0.26;
          t.rect(s, 0.62, by, 0.52, 0.52, CARBON, { line: { color: ICE, width: 1.5 }, name: 'Box' });
          k.txt(s, String(i + 1), 0.62, by, 0.52, 0.52, { size: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, 1.4, y + 0.02, 2.9, rh - 0.06, { color: 'FFFFFF', max: 13 });
          ty(s, st.t, 4.4, y + 0.02, 5.1, rh - 0.06, { color: ICE, valign: 'middle', max: 11 });
          if (i < n - 1) t.line(s, 1.4, y + rh - 0.02, 8.1, 0, '4A5490', 0.75, { dash: 'dash' });
        }
      },
    ],
    stats: [
      async (d) => { // one figure on a wide tape in heavy type, two short tapes under it, the note on a slip
        const s = page(d), [a, b, c] = d.stats;
        t.rect(s, 0.55, 1.2, 5.3, 2.1, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' });
        hd(s, a.value, 0.7, 1.24, 5.0, 1.15, { max: 48, min: 22, color: C.red });
        ty(s, a.label, 0.7, 2.4, 5.0, 0.84, { valign: 'middle', max: 11.5 });
        [[b, 0.55], [c, 3.25]].forEach(([v, x]) => { t.rect(s, x, 3.42, 2.6, 1.62, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' }); hd(s, v.value, x + 0.1, 3.45, 2.4, 0.66, { max: 22, min: 13, color: C.stamp }); ty(s, v.label, x + 0.1, 4.11, 2.4, 0.9, { max: 10.5, min: 9.5 }); });
        if (d.note) { slip(s, 6.05, 1.2, 3.4, 3.84, 0.2); ty(s, d.note, 6.17, 1.45, 3.16, 3.52, { valign: 'middle', max: 12 }); }
      },
      async (d) => { // three round date stamps in a row, the figure inside the rim
        const s = page(d), dd = 2.05, w = 8.96 / 3;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.52 + i * w, cx = x + w / 2;
          ring(s, cx - dd / 2, 1.18, dd);
          k.head(s, v.value, cx - 0.82, 1.6, 1.64, 1.2, { max: 22, min: 13, color: C.stamp, align: 'center' });
          ty(s, v.label, x + 0.08, 3.27, w - 0.16, 0.72, { align: 'center', max: 10.5, min: 9.5 });
        }
        if (d.note) strip(s, 0.55, 4.02, 8.9, 1.02, d.note, { max: 11.5 });
      },
      async (d) => { // the carbon ledger: figures large and white in rows, the note typed beneath a dashed rule
        const s = carbon(d), rh = 0.96;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.08 + i * rh;
          k.txt(s, `#${i + 1}`, 0.5, y, 0.6, rh - 0.05, { size: 12, bold: true, color: ICE, valign: 'middle' });
          k.head(s, v.value, 1.15, y, 3.2, rh - 0.05, { max: 32, min: 16, color: 'FFFFFF' });
          ty(s, v.label, 4.45, y, 5.05, rh - 0.05, { color: ICE, valign: 'middle', max: 12 });
          t.line(s, 0.5, y + rh - 0.02, 9.0, 0, '4A5490', 0.75, { dash: 'dash' });
        }
        if (d.note) ty(s, d.note, 0.5, 3.98, 9.0, 1.1, { color: 'FFFFFF', valign: 'middle', max: 11.5 });
      },
    ],
    compare: [
      async (d) => { // the page torn in half along a perforated line: the form on one side, its carbon on the other
        const s = k.slide(DESK), { rows: rr, fs } = rowsFit([d.left.items.map(up), d.right.items.map(up)], 12, 4.0, F.body, 0.12, 3.1);
        t.rect(s, 0.3, 0.2, 4.7, 5.2, C.form, { line: { color: C.red, width: 1.5 }, name: 'Form' });
        t.rect(s, 5.0, 0.2, 4.7, 5.2, CARBON, { name: 'Carbon' });
        t.line(s, 5, 0.2, 0, 5.2, C.tape, 2, { dash: 'sysDash' });
        strip(s, 0.55, 0.3, 8.0, 0.55, d.title || '', { bold: true, max: 12.5 });
        ring(s, 8.72, 0.24, 0.68, ICE); k.txt(s, String(k.idx).padStart(2, '0'), 8.72, 0.24, 0.68, 0.68, { size: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.7, w = 4.0, a = i ? 'left' : 'right', ink = i ? 'FFFFFF' : C.ink;
          k.txt(s, up(sd.h), x, 1.1, w, 0.5, { max: 13, min: 10.5, bold: true, color: i ? ICE : C.red, align: a, valign: 'middle', ls: 1.05 });
          let y = 1.7; sd.items.forEach((it, j) => { k.txt(s, up(it), x, y, w, rr[j], { size: fs, color: ink, align: a, ls: 1 }); y += rr[j]; });
        }
        k.foot(s, { x: 5.3, y: 5.12, w: 4.2, size: 7, color: ICE });
      },
      async (d) => { // two slips one above the other, a red head down the side, the lines across each
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.14 : 1.18, h = 1.88, n = sd.items.length, x0 = 2.75, w = (9.42 - x0) / n, c = i ? C.stamp : C.red;
          t.rect(s, 0.52, y, 8.96, h, SLIP, { shadow: 0.2, blur: 3, offset: 2, line: { color: c, width: 0.75 }, name: 'Slip' });
          t.rect(s, 0.52, y, 2.05, h, c, { name: 'Slip side' });
          hd(s, sd.h, 0.62, y + 0.08, 1.85, h - 0.16, { color: 'FFFFFF', max: 12.5 });
          sd.items.forEach((it, j) => { const x = x0 + j * w; if (j) t.line(s, x - 0.04, y + 0.16, 0, h - 0.32, c, 0.5, { dash: 'dash' }); ty(s, it, x, y + 0.05, w - 0.08, h - 0.1, { valign: 'middle', max: 11, min: 9.5 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the carbon: the note on a white strip at the head, one sentence in heavy type filling the rest
        const s = carbon(d);
        if (d.caption) { t.rect(s, 0.6, 1.14, 8.8, 1.3, C.tape, { name: 'Tape' }); ty(s, d.caption, 0.75, 1.18, 8.5, 1.22, { valign: 'middle', max: 11 }); }
        k.txt(s, [{ text: up(d.text), options: { bold: true } }, { text: '  \u25A0', options: { color: 'FF8A7E', bold: true } }], 0.6, 2.55, 8.8, 2.5, { max: 26, min: 14, bold: true, color: 'FFFFFF', valign: 'middle', font: F.head, ls: 1.1 });
      },
      async (d) => { // the urgent wire: a red slab across the form with the sentence reversed out of it
        const s = page(d);
        t.rect(s, 4.05, 1.25, 5.65, 3.75, C.red, { name: 'Urgent slab' });
        k.txt(s, up(d.text), 4.25, 1.33, 5.25, 3.6, { max: 21, min: 13, bold: true, color: 'FFFFFF', valign: 'middle', font: F.head, ls: 1.1 });
        if (d.caption) ty(s, d.caption, 0.55, 1.25, 3.3, 3.75, { valign: 'middle', max: 11.5 });
      },
    ],
    timeline: [
      async (d) => { // the wire across the land: years on plates on four poles, the events above and below it
        const s = page(d), wy = 3.1, w = 3.4, step = 1.85, xs = [0, 1, 2, 3].map((i) => 0.62 + i * step);
        t.line(s, 0.4, wy, 9.2, 0, POLE, 1.5); t.line(s, 0.4, wy + 0.08, 9.2, 0, POLE, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up2 = i % 2 === 0, y = up2 ? 1.14 : wy + 0.2, h = up2 ? wy - 1.2 : 5.06 - y;
          t.rect(s, x, y + (up2 ? h - 0.05 : -0.12), 0.07, 0.17, POLE, { name: 'Pole' });
          t.rect(s, x, y, w, h, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' });
          hd(s, it.year, x + 0.1, y + 0.03, 1.3, 0.34, { max: 12, min: 9.5 });
          hd(s, it.h, x + 1.42, y + 0.03, w - 1.5, 0.34, { max: 10.5, min: 9.5, color: C.ink });
          ty(s, it.t, x + 0.1, y + 0.38, w - 0.2, h - 0.42, { max: 10.5 });
        }
      },
      async (d) => { // a ruled table on the form, red grid lines, year then name then words
        const s = page(d), y0 = 1.2, rh = 3.82 / 4, x = 0.52, W2 = 8.96, c1 = 1.55, c2 = 2.4;
        t.rect(s, x, y0, W2, 3.82, C.tape, { line: { color: C.red, width: 1.25 }, name: 'Table' });
        t.line(s, x + c1, y0, 0, 3.82, C.red, 0.75); t.line(s, x + c1 + c2, y0, 0, 3.82, C.red, 0.75);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) t.line(s, x, y, W2, 0, C.red, 0.75);
          hd(s, it.year, x + 0.08, y, c1 - 0.14, rh, { max: 12, min: 9.5 });
          hd(s, it.h, x + c1 + 0.1, y, c2 - 0.18, rh, { color: C.ink, max: 11.5 });
          ty(s, it.t, x + c1 + c2 + 0.1, y + 0.02, W2 - c1 - c2 - 0.18, rh - 0.04, { valign: 'middle', max: 10.5, min: 9.5 });
        }
      },
      async (d) => { // four brown envelopes on the desk: the year in the corner stamp, the event on the front
        const s = k.slide(DESK), gap = 0.14, w = (9.3 - gap * 3) / 4;
        strip(s, 0.35, 0.22, 8.2, 0.62, d.title || '', { bold: true, max: 14 });
        t.oval(s, 8.8, 0.15, 0.8, 0.8, DESK); ring(s, 8.8, 0.15, 0.8);
        k.txt(s, String(k.idx).padStart(2, '0'), 8.8, 0.15, 0.8, 0.8, { size: 13, bold: true, color: C.stamp, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * (w + gap), y = 1.1 + (i % 2) * 0.16, h = 5.16 - y;
          await envelope(s, x, y, w, h, 'e');
          t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, SLIP, { name: 'Label' });
          t.rect(s, x + 0.08, y + 0.08, w - 0.16, 0.56, C.red, { name: 'Label head' });
          hd(s, it.year, x + 0.14, y + 0.08, w - 0.28, 0.56, { color: 'FFFFFF', max: 14, align: 'center' });
          hd(s, it.h, x + 0.16, y + 0.68, w - 0.32, 0.48, { color: C.ink, max: 11.5 });
          ty(s, it.t, x + 0.16, y + 1.18, w - 0.32, h - 1.32, { max: 11 });
        }
        k.foot(s, { x: 0.35, y: 5.33, w: 9.3, size: 7.5, color: C.muted });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same rows of tape
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Telegramma', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A3226', lt2: C.form, accent1: C.red, accent2: C.stamp, accent3: '8C6D2C', accent4: '4F6D7A', accent5: C.muted, accent6: 'D9CDB4', hlink: C.stamp, folHlink: C.muted } });
}
module.exports = { id: 156, slug: 'telegramma', name: 'Telegramma', category: 'business', photos: true, build, style: { tone: "telegraf uslubi: o'ta ixcham, faqat eng muhim so'zlar, har gap alohida xabar", limits: { title: 40 }, prefer: 'text' } };
