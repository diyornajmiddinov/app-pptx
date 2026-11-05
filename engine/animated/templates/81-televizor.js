/** 81 Televizor — retro TV: striped wallpaper, wooden TV cabinets with glowing CRT screens, channel knobs. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'E9D8B4', ink: '3B2A1E', muted: '6E5743', accent: 'C1440E', wood: '8B5A2B', screen: '17262A', pal: ['C1440E', '2A9D8F', 'E9C46A', '8B5A2B', '5E548E', 'E76F51'] };
const paper = () => { let st = ''; for (let x = 0; x < 1600; x += 80) st += `<rect x="${x}" y="0" width="40" height="900" fill="#E1CDA3"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${st}</svg>`; };
const scan = (w, h) => { let l = ''; for (let y = 0; y < h; y += 6) l += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="#9FFFB0" stroke-opacity="0.05">${l}</g><ellipse cx="${w * 0.3}" cy="${h * 0.2}" rx="${w * 0.35}" ry="${h * 0.12}" fill="#fff" opacity="0.05"/></svg>`; };
const bars = () => `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="120">${['C0C0C0', 'C0C000', '00C0C0', '00C000', 'C000C0', 'C00000', '0000C0'].map((c, i) => `<rect x="${i * 100}" y="0" width="100" height="120" fill="#${c}"/>`).join('')}</svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Televizor', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', paper(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.wood, { r: 0.12, shadow: 0.3, blur: 6, offset: 3, name: 'Cabinet' }); t.rect(s, x + 0.1, y + 0.1, w - 0.2, h - 0.2, C.screen, { r: 0.18, name: 'Screen' }); t.img(s, await svgOnce(ctx, `sc${Math.round(w * 10)}x${Math.round(h * 10)}`, scan(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100), x + 0.1, y + 0.1, w - 0.2, h - 0.2); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, '3B2A1E', { line: { color: 'D9C29A', width: 2 } }); ctx.t.oval(s, x + d * 0.2, y + d * 0.2, d * 0.6, d * 0.6, C.pal[k % 6]); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t, L } = ctx; h -= 0.25; /* the cabinet's lower edge ran over the footer */ t.rect(s, x - 0.15, y - 0.15, w + 0.3, h + 0.5, C.wood, { r: 0.12, shadow: 0.3, blur: 6, offset: 3, name: 'Cabinet' }); t.img(s, await L.photo(L.src(src), w, h, { mask: { r: 0.1 } }), x, y, w, h, { alt: '' }); for (let k = 0; k < 2; k++) t.oval(s, x + w - 0.6 + k * 0.3, y + h + 0.06, 0.2, 0.2, 'D9C29A'); },
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.5, 0.38, 1.1, 0.62, C.screen, { r: 0.1, name: 'Channel' }); t.text(s, `CH ${String(ctx.idx).padStart(2, '0')}`, { x: 0.5, y: 0.38, w: 1.1, h: 0.62, fontFace: 'Courier New', fontSize: 14, bold: true, color: '7CFC8A', align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.8, y: 0.35, w: 7.65, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.65, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => 'E8F5E9', subPanel: () => 'B5DDB9', markerText: () => 'FFFFFF', authorColor: '9FFFB0', valueColor: () => '7CFC8A', compareHead: () => 'FFE08A',
  bullet: (ctx, s, x, y, k) => ctx.t.oval(s, x, y, 0.14, 0.14, k ? '7CFC8A' : 'FFE08A'),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const green = '7CFC8A', pale = 'E8F5E9', amber = 'FFE08A', knob = 'D9C29A', guide = '1F3A5F', guide2 = '2A4A75', room = '1C1410', BARS = ['E9C46A', '2A9D8F', 'E76F51', '5E548E', 'C1440E', '8B5A2B'], onBar = (c) => (c === 'E9C46A' ? C.ink : 'FFFFFF');
    const tv = async (s, x, y, w, h2, o = {}) => { // a wooden set: the screen, and a strip of knobs at its side if there is room
      const strip = o.knobs ? 0.46 : 0, sw = w - 0.22 - strip, sh = h2 - 0.22;
      t.rect(s, x, y, w, h2, C.wood, { r: 0.1, shadow: 0.3, blur: 6, offset: 3, name: 'Cabinet' });
      t.rect(s, x + 0.11, y + 0.11, sw, sh, C.screen, { r: 0.14, name: 'Screen' });
      t.img(s, await svgOnce(ctx, `sc${Math.round(sw * 10)}x${Math.round(sh * 10)}`, scan(Math.round(sw * 100), Math.round(sh * 100)), sw * 100, sh * 100), x + 0.11, y + 0.11, sw, sh);
      if (o.knobs) { for (let k = 0; k < 3; k++) { const d = 0.28; t.oval(s, x + w - strip - 0.02 + (strip - d) / 2, y + 0.2 + k * Math.min(0.5, (h2 - 0.4) / 3), d, d, knob, { line: { color: '3B2A1E', width: 1.25 } }); } }
      return { x: x + 0.11, y: y + 0.11, w: sw, h: sh };
    };
    const ears = (s, x, y, a = 0.55, b = 0.42) => { t.line(s, x - a, y - b, a, b, '3B2A1E', 2); t.line(s, x, y - b, a, b, '3B2A1E', 2, { flipV: true }); t.oval(s, x - 0.09, y - 0.06, 0.18, 0.12, '3B2A1E'); };
    const barsImg = (key) => svgOnce(ctx, 'bars', bars(), 700, 120);
    const channel = (s, x, y, w, h2, i) => { t.rect(s, x, y, w, h2, C.screen, { r: 0.06, name: 'Channel' }); t.text(s, `CH ${String(i + 1).padStart(2, '0')}`, { x, y, w, h: h2, fontFace: 'Courier New', bold: true, fontSize: 12, color: green, align: 'center', valign: 'middle' }); };
    const V = {
      image: [
        async (d) => { // a big set on the wall: the picture is on, rabbit ears on top, knobs at its side
          const s = await page(d), x = 5.05, y = 1.72, w = 4.35, ht = 3.3, strip = 0.48, pw = w - 0.22 - strip, ph = ht - 0.22;
          ears(s, x + w / 2, y);
          t.rect(s, x, y, w, ht, C.wood, { r: 0.12, shadow: 0.35, blur: 8, offset: 3, name: 'Cabinet' });
          t.img(s, await L.photo(L.src(d.image), pw, ph, { mask: { r: 0.14 } }), x + 0.11, y + 0.11, pw, ph, { alt: '' });
          for (let k = 0; k < 3; k++) t.oval(s, x + w - 0.42, y + 0.28 + k * 0.5, 0.32, 0.32, knob, { line: { color: '3B2A1E', width: 1.25 } });
          t.rect(s, x + w - 0.42, y + ht - 0.85, 0.32, 0.65, '6E4620', { name: 'Speaker' });
          body(s, d.text, 0.6, 1.4, 4.1, 3.6, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // the whole page is the screen: test bars across the top of a dark caption box
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.15, 10, 0.475, C.wood, { name: 'Cabinet edge' });
          t.rect(s, 4.9, 0.35, 4.75, 4.55, C.screen, { t: 5, r: 0.1, name: 'Screen box' });
          t.img(s, await barsImg(), 5.05, 0.5, 4.45, 0.2);
          channel(s, 5.05, 0.82, 0.95, 0.4, ctx.idx - 1);
          head(s, d.title, 6.1, 0.76, 3.4, 0.76, { color: amber, max: 18 });
          body(s, d.text, 5.1, 1.58, 4.35, 3.2, { color: pale, max: 14, k: 1.1, valign: 'middle' });
          metaFooter({ color: 'FFF3DD' })(ctx, s);
        },
        async (d) => { // the test card: bars and a grid, the picture in the middle circle
          const s = await page(d), x = 0.6, y = 1.32, w = 4.55, ht = 3.72; let g = '';
          for (let k = 1; k < 12; k++) g += `<line x1="${k * 40}" y1="0" x2="${k * 40}" y2="400"/>`; for (let k = 1; k < 10; k++) g += `<line x1="0" y1="${k * 40}" x2="480" y2="${k * 40}"/>`;
          t.rect(s, x - 0.08, y - 0.08, w + 0.16, ht + 0.16, C.wood, { r: 0.06, name: 'Cabinet' });
          t.img(s, await svgOnce(ctx, 'grid', `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="400"><rect width="480" height="400" fill="#4A4A4A"/><g stroke="#EDEDED" stroke-width="2">${g}</g></svg>`, 480, 400, true), x, y, w, ht);
          t.img(s, await barsImg(), x, y + ht - 0.6, w, 0.6);
          const dia = 2.85;
          t.oval(s, x + w / 2 - dia / 2 - 0.06, y + 0.14, dia + 0.12, dia + 0.12, 'FFFFFF');
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x + w / 2 - dia / 2, y + 0.2, dia, dia, { alt: '' });
          body(s, d.text, 5.5, 1.35, 3.9, 3.65, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // lights out in the living room: only the set is glowing
          const s = await newSlide('focus'), x = 5.15, y = 1.32, w = 4.2, ht = 3.3;
          t.rect(s, 0, 0, 10, 5.625, room, { name: 'Dark room' });
          t.img(s, await svgOnce(ctx, 'glow', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="700"><defs><radialGradient id="g"><stop offset="0" stop-color="#9FE8FF" stop-opacity="0.42"/><stop offset="1" stop-color="#9FE8FF" stop-opacity="0"/></radialGradient></defs><ellipse cx="400" cy="350" rx="400" ry="350" fill="url(#g)"/></svg>`, 800, 700), x - 1.6, y - 1.2, w + 3.2, ht + 2.4);
          t.rect(s, x - 0.12, y - 0.12, w + 0.24, ht + 0.24, '4A2E14', { r: 0.1, name: 'Cabinet' });
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { r: 0.14 } }), x, y, w, ht, { alt: '' });
          t.rect(s, 0.5, 0.38, 1.1, 0.62, C.screen, { r: 0.1, name: 'Channel' });
          t.text(s, `CH ${String(ctx.idx).padStart(2, '0')}`, { x: 0.5, y: 0.38, w: 1.1, h: 0.62, fontFace: 'Courier New', fontSize: 14, bold: true, color: green, align: 'center', valign: 'middle' });
          t.text(s, d.title, { x: 1.8, y: 0.35, w: 7.65, h: 0.72, bold: true, color: 'F5EAD8', valign: 'middle', fontSize: L.fit(d.title, 7.65, 0.72, 28, 16, 'Arial', true) });
          body(s, d.text, 0.6, 1.35, 4.2, 3.6, { color: 'F5EAD8', max: 15, k: 1.18, valign: 'middle' });
          metaFooter({ color: 'CDBDA6' })(ctx, s);
        },
      ],
      cards: [
        async (d) => { // a wall of sets in a shop window: every item has its own screen and knobs
          const s = await page(d), n = d.items.length, w = 4.32, hh = 1.78;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.16), y = 1.32 + Math.floor(i / 2) * (hh + 0.1);
            const a = await tv(s, x, y, ww, hh, { knobs: true });
            t.img(s, await L.icon(it.icon, amber, 2), a.x + 0.15, a.y + 0.12, 0.32, 0.32);
            head(s, it.h, a.x + 0.55, a.y + 0.08, a.w - 0.7, 0.4, { color: amber });
            body(s, it.t, a.x + 0.17, a.y + 0.5, a.w - 0.34, a.h - 0.58, { color: pale, max: 13 });
          }
        },
        async (d) => { // the TV listings: a blue guide grid, a channel cell then the programme
          const s = await page(d), n = d.items.length, rh = 3.68 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.32 + i * rh, hg = rh - 0.05;
            t.rect(s, 0.6, y, 8.8, hg, i % 2 ? guide2 : guide, { name: 'Guide row' });
            channel(s, 0.68, y + 0.08, 0.95, hg - 0.16, i);
            t.img(s, await L.icon(it.icon, amber, 2), 1.77, y + hg / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, 2.2, y + 0.04, 2.35, hg - 0.08, { color: amber, max: 14 });
            body(s, it.t, 4.65, y + 0.04, 4.6, hg - 0.08, { color: 'FFFFFF', valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // a remote control in the middle of the page: a button for each item, a beam out to its words
          const s = await page(d), n = d.items.length, w = 3.6, cx = 5, top = 1.3, ht = 3.75, step = ht / (n + 0.6);
          t.rect(s, cx - 0.5, top, 1.0, ht, '2E2A28', { r: 0.14, shadow: 0.35, blur: 6, offset: 3, name: 'Remote' });
          t.oval(s, cx - 0.06, top + 0.08, 0.12, 0.12, C.accent);
          for (const [i, it] of d.items.entries()) {
            const by = top + 0.32 + i * step, right = i % 2 === 1, cyy = by + 0.28, x = right ? 5.8 : 0.6, a = right ? 'left' : 'right', bh = n === 4 ? 1.72 : 1.7, y = n === 3 && i === 2 ? 3.3 : 1.32 + Math.floor(i / 2) * 1.88 + (right ? 0.14 : 0);
            t.line(s, right ? cx + 0.3 : x + w, Math.min(cyy, y + 0.24), right ? x - cx - 0.3 : cx - 0.3 - x - w, Math.abs(cyy - y - 0.24), C.accent, 1, { dash: 'sysDot', flipV: right ? cyy > y + 0.24 : cyy < y + 0.24 });
            t.oval(s, cx - 0.28, by, 0.56, 0.56, C.pal[[1, 0, 2, 4][i]], { line: { color: 'FFFFFF', width: 1 } });
            t.img(s, await L.icon(it.icon, i === 2 ? C.ink : 'FFFFFF', 2), cx - 0.14, by + 0.14, 0.28, 0.28);
            head(s, it.h, x, y, w, 0.45, { align: a, color: C.accent });
            body(s, it.t, x, y + 0.47, w, bh - 0.47, { align: a, max: 13.5 });
          }
        },
        async (d) => { // colour test bars the height of the page, each one an item
          const s = await page(d), n = d.items.length, w = 8.8 / n, y = 1.28, b = 5.08, cols = BARS.slice(0, n);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * w, ink = onBar(cols[i]), yy = y + (i % 2 ? 0.28 : 0);
            t.rect(s, x, yy, w, b - yy, cols[i], { name: 'Test bar' });
            t.img(s, await L.icon(it.icon, ink, 2), x + 0.16, yy + 0.15, 0.44, 0.44);
            head(s, it.h, x + 0.16, yy + 0.64, w - 0.32, 0.5, { color: ink, max: 15 });
            body(s, it.t, x + 0.16, yy + 1.17, w - 0.32, b - yy - 1.27, { color: ink });
          }
        },
      ],
      process: [
        async (d) => { // the channel dial: a great knob at the left, its numbers round it, a line from each to a step
          const s = await page(d), n = d.steps.length, dia = 2.7, x = 0.55, y = 1.75, cx = x + dia / 2, cy = y + dia / 2, rh = 3.68 / n; let tk = '';
          for (let k = 0; k < 24; k++) tk += `<line x1="150" y1="6" x2="150" y2="${k % 2 ? 18 : 26}" transform="rotate(${k * 15} 150 150)"/>`;
          t.img(s, await svgOnce(ctx, 'dial', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><circle cx="150" cy="150" r="146" fill="#${C.wood}"/><g stroke="#FFF3DD" stroke-width="3">${tk}</g><circle cx="150" cy="150" r="100" fill="#${knob}" stroke="#3B2A1E" stroke-width="4"/><rect x="142" y="56" width="16" height="94" fill="#${C.accent}"/><circle cx="150" cy="150" r="26" fill="#3B2A1E"/></svg>`, 300, 300), x, y, dia, dia);
          for (const [i, st] of d.steps.entries()) {
            const ry = 1.32 + i * rh, my = ry + rh / 2 - 0.26;
            await marker(s, 3.45, my, 0.52, i, i + 1);
            t.line(s, 3.15, ry + rh / 2, 0.3, 0, '3B2A1E', 1);
            head(s, st.h, 4.08, ry + 0.02, 5.32, 0.34, { color: C.accent, max: 15 });
            body(s, st.t, 4.08, ry + 0.36, 5.32, rh - 0.42, { max: 13.5 });
          }
          t.line(s, 3.15, 1.32 + rh / 2, 0, rh * (n - 1), '3B2A1E', 1);
        },
        async (d) => { // the broadcast: a mast at the left, a wave runs out across the page through every step
          const s = await page(d), n = d.steps.length, cw = 8.0 / n;
          t.shape(s, 'ISOSCELES_TRIANGLE', { x: 0.45, y: 1.32, w: 0.8, h: 1.05, fill: { type: 'none' }, line: { color: '3B2A1E', width: 2 }, objectName: 'Mast' }); t.line(s, 0.85, 1.32, 0, 1.05, '3B2A1E', 2);
          t.img(s, await svgOnce(ctx, 'sig', `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="70"><path d="M0,35 ${Array.from({ length: 30 }, (_, k) => `q25,${k % 2 ? 50 : -50} 50,0`).join(' ')}" fill="none" stroke="#${C.accent}" stroke-width="4"/></svg>`, 1500, 70), 1.0, 1.62, 8.5, 0.42);
          for (const [i, st] of d.steps.entries()) {
            const x = 1.3 + i * cw, cx = x + cw / 2;
            await marker(s, cx - 0.38, 1.45, 0.76, i, i + 1);
            head(s, st.h, x + 0.06, 2.3, cw - 0.12, 0.5, { align: 'center', color: C.accent });
            body(s, st.t, x + 0.1, 2.82, cw - 0.2, 2.22, { align: 'center' });
          }
        },
        async (d) => { // sets piled one step higher each time, as in a shop: the last one tuned in
          const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.34 : 0.48;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.32 + (n - 1 - i) * rise, a = await tv(s, x, y, w, 5.08 - y);
            if (i === n - 1) t.oval(s, x + w - 0.34, y + 0.2, 0.14, 0.14, green);
            await marker(s, a.x + 0.08, a.y + 0.06, 0.44, i, i + 1);
            head(s, st.h, a.x + 0.6, a.y + 0.03, a.w - 0.9, 0.52, { color: amber, max: 13 });
            body(s, st.t, a.x + 0.12, a.y + 0.6, a.w - 0.24, a.h - 0.66, { color: pale, max: 13.5 });
          }
        },
        async (d) => { // a studio panel with its row of lamps: below each lamp a cream cue card
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          t.rect(s, 0.6, 1.3, 8.8, 0.72, '2E2A28', { r: 0.06, name: 'Studio panel' });
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2, lit = i === n - 1;
            t.oval(s, cx - 0.27, 1.39, 0.54, 0.54, lit ? C.accent : C.pal[1], { line: { color: 'FFFFFF', width: 1.5 } });
            t.text(s, String(i + 1), { x: cx - 0.27, y: 1.39, w: 0.54, h: 0.54, bold: true, fontSize: 15, color: 'FFFFFF', align: 'center', valign: 'middle' });
            t.line(s, cx, 2.02, 0, 0.14, '3B2A1E', 1.5);
            t.rect(s, x + 0.06, 2.16, cw - 0.12, 2.92, 'FBF4E2', { line: { color: 'CDB98E', width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Cue card' });
            head(s, st.h, x + 0.17, 2.22, cw - 0.34, 0.5, { color: C.accent, max: 15 });
            body(s, st.t, x + 0.17, 2.74, cw - 0.34, 2.28, { max: 16 });
          }
        },
      ],
      stats: [
        async (d) => { // the colour bars of the test signal: a figure across each band
          const s = await page(d), w = 8.8 / 3, y = 1.32, hh = d.note ? 2.45 : 3.7;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * w, c = BARS[i], ink = onBar(c);
            t.rect(s, px, y, w, hh, c, { name: 'Test bar' });
            t.text(s, x.value, { x: px + 0.1, y: y + 0.15, w: w - 0.2, h: 1.1, bold: true, color: ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.25, 1.05, 44, 18, 'Arial', true) });
            body(s, x.label, px + 0.2, y + 1.3, w - 0.4, hh - 1.4, { color: ink, align: 'center', max: 15 });
          }
          if (d.note) { t.img(s, await barsImg(), 0.6, y + hh, 8.8, 0.14); body(s, d.note, 0.6, y + hh + 0.22, 8.8, 5.06 - y - hh - 0.22, { max: 13.5, valign: 'middle', align: 'center' }); }
        },
        async (d) => { // one big set is showing the main figure; two knobs read the others, the note on the card below
          const s = await page(d), [a, ...rest] = d.stats;
          ears(s, 2.65, 1.7);
          const sc = await tv(s, 0.6, 1.7, 4.1, 3.35, { knobs: true });
          t.text(s, a.value, { x: sc.x + 0.1, y: sc.y + 0.25, w: sc.w - 0.2, h: 1.3, bold: true, color: green, align: 'center', valign: 'middle', fontSize: L.fit(a.value, sc.w - 0.3, 1.25, 52, 20, 'Arial', true) });
          body(s, a.label, sc.x + 0.25, sc.y + 1.6, sc.w - 0.5, sc.h - 1.72, { color: pale, align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.35 + i * 1.12, dd = 1.02;
            t.oval(s, 4.98, y, dd, dd, C.wood, { line: { color: '3B2A1E', width: 2 } }); t.oval(s, 5.08, y + 0.1, dd - 0.2, dd - 0.2, knob);
            t.text(s, x.value, { x: 5.1, y: y + 0.26, w: dd - 0.24, h: 0.5, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.28, 0.42, 17, 9, 'Arial', true) });
            body(s, x.label, 6.15, y + 0.08, 3.25, 0.86, { valign: 'middle', max: 14 });
          }
          if (d.note) { t.rect(s, 4.98, 3.62, 4.42, 1.43, 'FBF4E2', { line: { color: 'CDB98E', width: 1 }, name: 'Card' }); body(s, d.note, 5.1, 3.68, 4.18, 1.31, { valign: 'middle', max: 13 }); }
        },
      ],
      compare: [
        async (d) => { // one screen split in two: two channels side by side, a bright line between them
          const s = await page(d), w = 3.75, a = await tv(s, 0.5, 1.28, 9.0, 3.8);
          t.line(s, 5, a.y + 0.05, 0, a.h - 0.1, green, 1.5);
          head(s, d.left.h, a.x + 0.2, a.y + 0.1, w + 0.02, 0.55, { align: 'right', max: 18, color: amber }); head(s, d.right.h, 5.2, a.y + 0.1, w, 0.55, { max: 18, color: green });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.22, 2.68);
          let y = a.y + 0.75;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: a.x + 0.2, y, w, h: rh, fontSize: fs, color: pale, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.2, y, w, h: rh, fontSize: fs, color: pale });
            y += rh;
          }
        },
        async (d) => { // two pages of the listings magazine, one above the other: a headline bar, then the columns
          const s = await page(d), hh = 1.82;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.32 + i * (hh + 0.08), n = side.items.length, cw = 8.8 / n, c = i ? C.pal[1] : C.accent;
            t.rect(s, 0.6, y, 8.8, hh, 'FBF4E2', { line: { color: 'CDB98E', width: 1 }, name: 'Magazine' });
            t.rect(s, 0.6, y, 8.8, 0.46, c, { name: 'Headline' });
            head(s, side.h, 0.78, y + 0.02, 8.4, 0.42, { color: 'FFFFFF', max: 17 });
            for (const [k, it] of side.items.entries()) {
              const x = 0.6 + k * cw;
              if (k) t.line(s, x, y + 0.56, 0, hh - 0.66, 'CDB98E', 1);
              body(s, it, x + 0.14, y + 0.52, cw - 0.28, hh - 0.6, { valign: 'middle', max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the announcer first, then the signal: the note above, the thought on the black band between two sets of bars
          const s = await page(d, 'focus');
          if (d.caption) body(s, d.caption, 0.8, 1.22, 8.4, 1.06, { align: 'center', valign: 'middle', max: 14 });
          t.img(s, await barsImg(), 0, 2.36, 10, 0.26);
          t.rect(s, 0, 2.62, 10, 2.2, C.screen, { name: 'Black band' });
          t.text(s, L.runs(d.text), { x: 0.7, y: 2.72, w: 8.6, h: 2.0, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 8.6, 1.95, 34, 16, 'Arial', true) });
          t.img(s, await barsImg(), 0, 4.82, 10, 0.26);
        },
        async (d) => { // the thought in green on the old set, the note on a card leaning beside it
          const s = await page(d);
          ears(s, 3.2, 1.72, 0.5, 0.32);
          const a = await tv(s, 0.6, 1.72, 5.45, 3.35, { knobs: true });
          t.text(s, L.runs(d.text), { x: a.x + 0.25, y: a.y + 0.15, w: a.w - 0.5, h: a.h - 0.3, fontFace: 'Arial', bold: true, color: green, valign: 'middle', fontSize: L.fit(d.text, a.w - 0.5, a.h - 0.35, 26, 13, 'Arial', true) });
          if (d.caption) { t.rect(s, 6.35, 1.72, 3.05, 3.35, 'FBF4E2', { line: { color: 'CDB98E', width: 1 }, shadow: 0.2, blur: 5, offset: 3, name: 'Card' }); body(s, d.caption, 6.5, 1.82, 2.75, 3.15, { valign: 'middle', max: 13.5 }); }
        },
      ],
      timeline: [
        async (d) => { // the evening's schedule: a time bar on top, a blue programme block below each year
          const s = await page(d), cw = 8.8 / 4;
          t.rect(s, 0.6, 1.32, 8.8, 0.62, C.screen, { name: 'Time bar' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw;
            t.text(s, it.year, { x, y: 1.32, w: cw, h: 0.62, fontFace: 'Courier New', bold: true, color: green, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.15, 0.5, 19, 10, 'Courier New', true) });
            if (i) t.line(s, x, 1.32, 0, 0.62, '4A6A5A', 1);
            t.rect(s, x + 0.03, 1.98, cw - 0.06, 3.08, i % 2 ? guide2 : guide, { name: 'Programme' });
            head(s, it.h, x + 0.14, 2.03, cw - 0.28, 0.5, { color: amber, max: 14 });
            body(s, it.t, x + 0.14, 2.55, cw - 0.28, 2.45, { color: 'FFFFFF' });
          }
        },
        async (d) => { // the set through the years: a small set each year with the date on its screen
          const s = await page(d), cw = 2.2;
          t.rect(s, 0.3, 2.52, 9.4, 0.08, '3B2A1E', { name: 'Shelf' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, tw = 1.75, th = 1.02, a = await tv(s, x + 0.08, 1.5, tw, th);
            ears(s, x + 0.08 + tw / 2, 1.5, 0.3, 0.16);
            t.text(s, it.year, { x: a.x + 0.05, y: a.y, w: a.w - 0.1, h: a.h, fontFace: 'Courier New', bold: true, color: green, align: 'center', valign: 'middle', fontSize: L.fit(it.year, a.w - 0.15, 0.55, 18, 9, 'Courier New', true) });
            head(s, it.h, x, 2.66, cw - 0.15, 0.46, { max: 14, color: C.accent });
            body(s, it.t, x, 3.13, cw - 0.2, 1.92, { max: 14 });
          }
        },
        async (d) => { // the aerial mast up the page: a crossbar at each year, the entries to either side
          const s = await page(d), w = 3.9;
          t.line(s, 5, 1.2, 0, 3.88, '3B2A1E', 3);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.32 + Math.floor(i / 2) * 1.84 + (right ? 0.32 : 0), x = right ? 5.45 : 0.65, a = right ? 'left' : 'right', bw = 0.9;
            t.line(s, 5 - bw / 2, y + 0.18, bw, 0, '3B2A1E', 2.5); t.oval(s, 4.9, y + 0.08, 0.2, 0.2, C.pal[[1, 0, 4, 2][i]], { line: { color: 'FFFFFF', width: 1 } });
            head(s, it.year, x, y, w, 0.38, { align: a, color: C.accent, max: 18 });
            head(s, it.h, x, y + 0.38, w, 0.28, { align: a, max: 13 });
            body(s, it.t, x, y + 0.68, w, 1.02, { align: a, max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // the original panels of both looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.line(s, 7.0, 0.3, 0.6, 0.55, '3B2A1E', 2, { flipV: true }); t.line(s, 7.6, 0.3, 0.6, 0.55, '3B2A1E', 2);
    t.rect(s, 5.9, 0.85, 3.6, 3.6, C.wood, { r: 0.15, shadow: 0.35, blur: 8, offset: 3, name: 'TV' });
    t.rect(s, 6.1, 1.05, 3.2, 2.6, C.screen, { r: 0.25, name: 'Screen' });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 3.0, 2.4, { mask: { r: 0.12 } }), 6.2, 1.15, 3.0, 2.4, { alt: '' });
    else t.img(s, await svgOnce(ctx, 'bars', bars(), 700, 120), 6.2, 1.6, 3.0, 1.2);
    for (let k = 0; k < 3; k++) K.marker(ctx, s, 6.3 + k * 0.45, 3.8, 0.35, k, '');
    t.img(s, await svgOnce(ctx, 'bars', bars(), 700, 120), 0.6, 0.6, 2.4, 0.3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 1.0, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.35, w: 5.0, h: 2.0, bold: true, fontSize: L.fit(d.title, 5.0, 1.95, 38, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 5.0, h: 0.7, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 81, slug: 'televizor', name: 'Televizor', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ko'rsatuv boshlovchisi kabi: tomoshabinga murojaat, qiziqarli va tushunarli", limits: {}, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "technical"], "transitions": ["zoom:out", "cut", "p14:flash"], "cover": ["zoomIn", "stretch"], "mark": "appear", "deco": "unfold", "sig": {"title": "unfold", "body": "fade", "item": "zoomIn", "image": "unfold", "number": "appear", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
