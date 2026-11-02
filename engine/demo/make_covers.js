/**
 * make_covers.js — one illustration per template for the gallery previews, so 200 previews do not share one picture.
 * Each picture is drawn in the template's own colours (read from its file) with a scene that suits its name:
 * Kosmos gets planets, Okean waves, Samarqand domes and arches, DNK a helix, Vinil a record, and so on.
 *   node demo/make_covers.js              -> demo/covers/<id>.svg and demo/covers/<id>.jpg (1600x1000)
 * Then demo/make_previews.sh draws each template's cover slide with its picture.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1600, H = 1000;
const DIR = path.join(__dirname, 'covers');

// ---------------------------------------------------------------- colours
const hexes = (src) => [...new Set((src.match(/['"#]([0-9A-Fa-f]{6})['"]/g) || []).map((m) => m.replace(/['"#]/g, '').toUpperCase()))];
const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const [r, g, b] = rgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const sat = (h) => { const c = rgb(h); const mx = Math.max(...c), mn = Math.min(...c); return mx ? (mx - mn) / mx : 0; };
const mix = (a, b, t) => rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase();

function palette(src) {
  const all = hexes(src).filter((h) => !['FFFFFF', '000000'].includes(h));
  const by = (f) => [...all].sort((a, b) => f(b) - f(a));
  const accents = by(sat).filter((h) => sat(h) > 0.25 && lum(h) > 0.18 && lum(h) < 0.9);
  const darks = by((h) => -lum(h)), lights = by(lum);
  const A = accents.length ? accents : ['4F7CAC', 'E07A5F', '81B29A'];
  const a = (i) => A[i % A.length];
  const dark = darks[0] && lum(darks[0]) < 0.35 ? darks[0] : '1E2A3A';
  const light = lights[0] && lum(lights[0]) > 0.75 ? lights[0] : 'F3EFE6';
  return { a1: a(0), a2: a(1), a3: a(2), a4: a(3), dark, light, mid: mix(dark, a(0), 0.45) };
}

// ---------------------------------------------------------------- helpers
const lg = (id, c1, c2, vertical = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="#${c1}"/><stop offset="1" stop-color="#${c2}"/></linearGradient>`;
const rg = (id, c1, c2, o2 = 0) => `<radialGradient id="${id}"><stop offset="0" stop-color="#${c1}"/><stop offset="1" stop-color="#${c2}" stop-opacity="${o2}"/></radialGradient>`;
const bg = (c1, c2, v = true) => `<defs>${lg('bg', c1, c2, v)}</defs><rect width="${W}" height="${H}" fill="url(#bg)"/>`;
const range = (n) => Array.from({ length: n }, (_, i) => i);
const ridge = (r, base, amp, n, c, op = 1) => { let d = `M0,${H} L0,${base}`; for (let i = 0; i <= n; i++) d += ` L${(i * W) / n},${base - r() * amp}`; return `<path d="${d} L${W},${H} Z" fill="#${c}" opacity="${op}"/>`; };

// ---------------------------------------------------------------- scenes: (P, r) -> svg body
const S = {
  skyline(P, r) {
    let b = ''; for (let x = -20; x < W;) { const w = 80 + r() * 150, h = 220 + r() * 520, c = [P.dark, P.mid, mix(P.dark, P.a2, 0.3)][Math.floor(r() * 3)];
      b += `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="#${c}"/>`;
      for (let y = H - h + 28; y < H - 30; y += 40) for (let wx = x + 12; wx < x + w - 22; wx += 28) if (r() > 0.5) b += `<rect x="${wx}" y="${y}" width="13" height="20" fill="#${P.a1}" opacity="${0.4 + r() * 0.6}"/>`;
      x += w + 6; }
    return `${bg(P.a2, P.light)}<circle cx="${300 + r() * 1000}" cy="${220 + r() * 120}" r="110" fill="#${P.light}" opacity="0.85"/>${b}`;
  },
  mountains(P, r) { return `${bg(P.light, P.a1)}<circle cx="${400 + r() * 800}" cy="260" r="120" fill="#${P.a3}" opacity="0.8"/>${ridge(r, 520, 300, 7, P.mid, 0.55)}${ridge(r, 650, 260, 9, P.a2, 0.75)}${ridge(r, 800, 180, 12, P.dark)}`; },
  waves(P, r) {
    const wave = (y, a, c, op) => { let d = `M0,${y}`; for (let x = 0; x <= W; x += 100) d += ` Q${x + 50},${y - a * (0.6 + r() * 0.8)} ${x + 100},${y}`; return `<path d="${d} L${W},${H} L0,${H} Z" fill="#${c}" opacity="${op}"/>`; };
    return `${bg(P.light, P.a1)}<circle cx="${1200 - r() * 600}" cy="250" r="100" fill="#${P.a3}"/>${wave(560, 50, P.a2, 0.5)}${wave(660, 60, P.mid, 0.7)}${wave(780, 70, P.dark, 0.9)}${wave(890, 50, P.dark, 1)}`;
  },
  dunes(P, r) {
    const dune = (y, c) => `<path d="M0,${y + 80} C${300 + r() * 200},${y - 120} ${700 + r() * 200},${y + 120} ${W},${y - 40} L${W},${H} L0,${H} Z" fill="#${c}"/>`;
    return `${bg(P.a3, P.light)}<circle cx="${1150 + r() * 200}" cy="300" r="140" fill="#${P.a1}" opacity="0.9"/>${dune(560, mix(P.a1, P.light, 0.4))}${dune(700, P.a1)}${dune(840, P.mid)}`;
  },
  forest(P, r) {
    let t = ''; for (let k = 0; k < 3; k++) for (let x = -40; x < W; x += 70 + r() * 60) { const h = 260 + r() * 260 + k * 60, y = 660 + k * 120, c = [P.mid, P.a2, P.dark][k];
      t += `<polygon points="${x},${y} ${x + h * 0.22},${y - h} ${x + h * 0.44},${y}" fill="#${c}" opacity="${0.6 + k * 0.2}"/>`; }
    return `${bg(P.light, mix(P.light, P.a1, 0.5))}<circle cx="${400 + r() * 800}" cy="220" r="100" fill="#${P.a3}" opacity="0.7"/>${t}<rect y="900" width="${W}" height="100" fill="#${P.dark}"/>`;
  },
  space(P, r) {
    let s = ''; range(160).forEach(() => (s += `<circle cx="${r() * W}" cy="${r() * H}" r="${r() * 2.6 + 0.6}" fill="#FFFFFF" opacity="${0.4 + r() * 0.6}"/>`));
    const x = 500 + r() * 600, y = 420 + r() * 200;
    return `${bg(P.dark, mix(P.dark, P.a2, 0.4))}<defs>${rg('pl', P.a1, P.a2, 1)}</defs>${s}<circle cx="${x}" cy="${y}" r="230" fill="url(#pl)"/><ellipse cx="${x}" cy="${y}" rx="400" ry="70" fill="none" stroke="#${P.a3}" stroke-width="16" transform="rotate(-18 ${x} ${y})"/><circle cx="${x + 520}" cy="${y - 260}" r="55" fill="#${P.light}" opacity="0.9"/>`;
  },
  arches(P, r) {
    let a = ''; const n = 5, w = W / n;
    range(n).forEach((i) => { const x = i * w + 30, aw = w - 60; a += `<path d="M${x},${H} L${x},520 Q${x},330 ${x + aw / 2},260 Q${x + aw},330 ${x + aw},520 L${x + aw},${H} Z" fill="#${i % 2 ? P.a2 : P.a1}"/><path d="M${x + 40},${H} L${x + 40},560 Q${x + 40},410 ${x + aw / 2},355 Q${x + aw - 40},410 ${x + aw - 40},560 L${x + aw - 40},${H} Z" fill="#${P.dark}" opacity="0.85"/>`; });
    return `${bg(P.light, mix(P.light, P.a3, 0.4))}<ellipse cx="800" cy="250" rx="200" ry="190" fill="#${P.a3}"/><rect x="560" y="240" width="480" height="40" fill="#${P.mid}"/>${a}`;
  },
  ornament(P, r) {
    let o = ''; for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) { const cx = 140 + x * 265 + (y % 2) * 130, cy = 130 + y * 250, c = [P.a1, P.a2, P.a3][(x + y) % 3];
      o += `<circle cx="${cx}" cy="${cy}" r="95" fill="#${c}"/>${range(8).map((k) => `<ellipse cx="${cx}" cy="${cy - 70}" rx="20" ry="45" fill="#${P.light}" transform="rotate(${k * 45} ${cx} ${cy})"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="30" fill="#${P.dark}"/>`; }
    return `${bg(P.dark, P.mid)}${o}`;
  },
  molecules(P, r) {
    const pts = range(14).map(() => [150 + r() * 1300, 120 + r() * 760]); let m = '';
    pts.forEach((p, i) => pts.slice(i + 1).forEach((q) => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 380) m += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#${P.light}" stroke-width="10" opacity="0.6"/>`; }));
    pts.forEach((p, i) => (m += `<circle cx="${p[0]}" cy="${p[1]}" r="${40 + r() * 45}" fill="#${[P.a1, P.a2, P.a3][i % 3]}"/>`));
    return `${bg(P.dark, P.mid, false)}${m}`;
  },
  dna(P, r) {
    let d = ''; for (let i = 0; i < 26; i++) { const x = 100 + i * 55, y1 = 500 + Math.sin(i / 2.2) * 260, y2 = 500 - Math.sin(i / 2.2) * 260;
      d += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#${P.light}" stroke-width="8" opacity="0.5"/><circle cx="${x}" cy="${y1}" r="22" fill="#${P.a1}"/><circle cx="${x}" cy="${y2}" r="22" fill="#${P.a2}"/>`; }
    return `${bg(P.dark, mix(P.dark, P.a1, 0.35), false)}${d}`;
  },
  circuit(P, r) {
    let c = ''; range(26).forEach(() => { let x = Math.round(r() * 16) * 100, y = Math.round(r() * 10) * 100, d = `M${x},${y}`;
      range(4).forEach((k) => { if (k % 2) y += (r() > 0.5 ? 1 : -1) * 100 * Math.ceil(r() * 3); else x += (r() > 0.5 ? 1 : -1) * 100 * Math.ceil(r() * 3); d += ` L${x},${y}`; });
      c += `<path d="${d}" fill="none" stroke="#${P.a1}" stroke-width="8" opacity="0.8"/><circle cx="${x}" cy="${y}" r="16" fill="#${P.a2}"/>`; });
    return `${bg(P.dark, mix(P.dark, P.a3, 0.25))}${c}<rect x="620" y="330" width="360" height="340" rx="20" fill="#${P.mid}" stroke="#${P.a1}" stroke-width="10"/><rect x="700" y="410" width="200" height="180" fill="#${P.a3}" opacity="0.8"/>`;
  },
  pixels(P, r) {
    let p = ''; const s = 80; for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) { const v = r(); if (v < 0.45 + (y / H) * 0.4) p += `<rect x="${x + 4}" y="${y + 4}" width="${s - 8}" height="${s - 8}" fill="#${[P.a1, P.a2, P.a3, P.mid][Math.floor(v * 10) % 4]}" opacity="${0.5 + v / 2}"/>`; }
    return `${bg(P.dark, P.dark)}${p}`;
  },
  bars(P, r) {
    let g = ''; for (let y = 200; y < 900; y += 100) g += `<line x1="160" y1="${y}" x2="1460" y2="${y}" stroke="#${P.light}" stroke-opacity="0.18" stroke-width="3"/>`;
    const hs = range(8).map((i) => 160 + i * 70 + r() * 120), pts = [];
    hs.forEach((h, i) => { const x = 220 + i * 160; g += `<rect x="${x}" y="${880 - h}" width="100" height="${h}" rx="10" fill="#${i === 7 ? P.a2 : P.a1}"/>`; pts.push(`${x + 50},${840 - h}`); });
    return `${bg(P.dark, P.mid)}${g}<polyline points="${pts.join(' ')}" fill="none" stroke="#${P.a3}" stroke-width="10"/>`;
  },
  donut(P, r) {
    let a = 0, d = ''; const parts = range(5).map(() => 0.1 + r()), sum = parts.reduce((x, y) => x + y);
    parts.forEach((p, i) => { const b = a + (p / sum) * Math.PI * 2, R = 330, cx = 560, cy = 500, x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a), x2 = cx + R * Math.cos(b), y2 = cy + R * Math.sin(b);
      d += `<path d="M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${b - a > Math.PI ? 1 : 0} 1 ${x2},${y2} Z" fill="#${[P.a1, P.a2, P.a3, P.mid, P.a4][i]}"/>`; a = b; });
    const leg = range(4).map((i) => `<rect x="1060" y="${300 + i * 110}" width="60" height="60" rx="10" fill="#${[P.a1, P.a2, P.a3, P.mid][i]}"/><rect x="1150" y="${315 + i * 110}" width="${180 + r() * 160}" height="28" rx="14" fill="#${P.dark}" opacity="0.35"/>`).join('');
    return `${bg(P.light, mix(P.light, P.a1, 0.2))}${d}<circle cx="560" cy="500" r="160" fill="#${P.light}"/>${leg}`;
  },
  books(P, r) {
    let b = '', x = 120; while (x < 1480) { const w = 60 + r() * 70, h = 420 + r() * 300, c = [P.a1, P.a2, P.a3, P.mid, P.dark][Math.floor(r() * 5)];
      b += `<rect x="${x}" y="${860 - h}" width="${w}" height="${h}" rx="6" fill="#${c}"/><rect x="${x + 12}" y="${900 - h}" width="${w - 24}" height="14" fill="#${P.light}" opacity="0.7"/><rect x="${x + 12}" y="${940 - h}" width="${w - 24}" height="8" fill="#${P.light}" opacity="0.5"/>`; x += w + 8; }
    return `${bg(P.light, mix(P.light, P.a3, 0.3))}${b}<rect y="860" width="${W}" height="40" fill="#${P.dark}"/><rect y="900" width="${W}" height="100" fill="#${mix(P.dark, P.light, 0.3)}"/>`;
  },
  leaves(P, r) {
    let l = ''; range(26).forEach(() => { const x = r() * W, y = r() * H, s = 0.6 + r() * 1.4, a = r() * 360, c = [P.a1, P.a2, P.mid, P.a3][Math.floor(r() * 4)];
      l += `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0,0 C60,-90 160,-90 220,0 C160,90 60,90 0,0 Z" fill="#${c}" opacity="0.9"/><line x1="0" y1="0" x2="220" y2="0" stroke="#${P.light}" stroke-width="5" opacity="0.6"/></g>`; });
    return `${bg(P.light, mix(P.light, P.a1, 0.25))}${l}`;
  },
  geometric(P, r) {
    const shapes = range(9).map((i) => { const x = r() * 1400 + 100, y = r() * 800 + 100, s = 120 + r() * 220, c = [P.a1, P.a2, P.a3, P.dark][i % 4];
      return i % 3 === 0 ? `<circle cx="${x}" cy="${y}" r="${s / 2}" fill="#${c}"/>` : i % 3 === 1 ? `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="#${c}" transform="rotate(${r() * 40} ${x} ${y})"/>` : `<polygon points="${x},${y - s / 2} ${x + s / 2},${y + s / 2} ${x - s / 2},${y + s / 2}" fill="#${c}"/>`; }).join('');
    return `${bg(P.light, P.light)}${shapes}<line x1="0" y1="${300 + r() * 400}" x2="${W}" y2="${300 + r() * 400}" stroke="#${P.dark}" stroke-width="12"/>`;
  },
  rings(P, r) {
    const cx = 500 + r() * 600, cy = 400 + r() * 200;
    return `${bg(P.dark, P.mid, false)}${range(14).map((i) => `<circle cx="${cx}" cy="${cy}" r="${60 + i * 55}" fill="none" stroke="#${[P.a1, P.a2, P.a3][i % 3]}" stroke-width="${10 + (i % 3) * 6}" opacity="${1 - i * 0.05}"/>`).join('')}`;
  },
  topo(P, r) {
    let t = ''; const cx = 700 + r() * 300, cy = 450 + r() * 150;
    range(16).forEach((i) => { let d = ''; for (let k = 0; k <= 36; k++) { const a = (k / 36) * Math.PI * 2, R = 40 + i * 48 + Math.sin(a * 3 + i) * 22 + Math.cos(a * 5) * 14; d += `${k ? 'L' : 'M'}${cx + Math.cos(a) * R * 1.5},${cy + Math.sin(a) * R} `; }
      t += `<path d="${d}Z" fill="none" stroke="#${i % 4 === 0 ? P.a1 : P.mid}" stroke-width="${i % 4 === 0 ? 6 : 3}" opacity="0.85"/>`; });
    return `${bg(P.light, mix(P.light, P.a3, 0.2))}${t}<circle cx="${cx}" cy="${cy}" r="18" fill="#${P.a2}"/>`;
  },
  isometric(P, r) {
    let c = ''; const cube = (x, y, s, c1, c2, c3) => `<polygon points="${x},${y} ${x + s},${y - s / 2} ${x + 2 * s},${y} ${x + s},${y + s / 2}" fill="#${c1}"/><polygon points="${x},${y} ${x + s},${y + s / 2} ${x + s},${y + 1.5 * s} ${x},${y + s}" fill="#${c2}"/><polygon points="${x + s},${y + s / 2} ${x + 2 * s},${y} ${x + 2 * s},${y + s} ${x + s},${y + 1.5 * s}" fill="#${c3}"/>`;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) if (r() > 0.3) { const s = 110, x = 260 + col * 2 * s - row * s, y = 300 + row * s / 2 + col * 0 + row * 60; c += cube(x, y - r() * 80, s, P.a1, P.mid, P.dark); }
    return `${bg(P.light, mix(P.light, P.a2, 0.25))}${c}`;
  },
  aurora(P, r) {
    return `<defs>${lg('bg', P.dark, mix(P.dark, P.a2, 0.3))}${rg('b1', P.a1, P.a1)}${rg('b2', P.a2, P.a2)}${rg('b3', P.a3, P.a3)}<filter id="f"><feGaussianBlur stdDeviation="60"/></filter></defs><rect width="${W}" height="${H}" fill="url(#bg)"/><g filter="url(#f)" opacity="0.85"><ellipse cx="${300 + r() * 300}" cy="${300 + r() * 200}" rx="420" ry="220" fill="url(#b1)"/><ellipse cx="${900 + r() * 300}" cy="${400 + r() * 200}" rx="460" ry="240" fill="url(#b2)"/><ellipse cx="${700 + r() * 300}" cy="${700 + r() * 100}" rx="380" ry="200" fill="url(#b3)"/></g>`;
  },
  stripes(P, r) {
    let s = ''; range(9).forEach((i) => { let d = `M0,${120 + i * 100}`; for (let x = 0; x <= W; x += 200) d += ` Q${x + 100},${120 + i * 100 + (r() - 0.5) * 160} ${x + 200},${120 + i * 100}`; s += `<path d="${d}" fill="none" stroke="#${[P.a1, P.a2, P.a3][i % 3]}" stroke-width="${26 + r() * 30}" stroke-linecap="round" opacity="0.9"/>`; });
    return `${bg(P.light, P.light)}${s}`;
  },
  lowpoly(P, r) {
    let t = ''; const cols = 9, rows = 6, pts = range(rows + 1).map((y) => range(cols + 1).map((x) => [x * (W / cols) + (x % cols ? (r() - 0.5) * 120 : 0), y * (H / rows) + (y % rows ? (r() - 0.5) * 120 : 0)]));
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const a = pts[y][x], b = pts[y][x + 1], c = pts[y + 1][x], d = pts[y + 1][x + 1], k = (x + y) / (cols + rows);
      t += `<polygon points="${a} ${b} ${c}" fill="#${mix(P.a1, P.dark, k * 0.8 + r() * 0.15)}"/><polygon points="${b} ${d} ${c}" fill="#${mix(P.a2, P.dark, k * 0.7 + r() * 0.2)}"/>`; }
    return t;
  },
  network(P, r) {
    const c = [800, 500], nodes = range(9).map((i) => { const a = (i / 9) * Math.PI * 2 + r() * 0.3, R = 280 + r() * 160; return [c[0] + Math.cos(a) * R * 1.4, c[1] + Math.sin(a) * R]; });
    let n = ''; nodes.forEach((p, i) => { n += `<line x1="${c[0]}" y1="${c[1]}" x2="${p[0]}" y2="${p[1]}" stroke="#${P.mid}" stroke-width="8"/>`; const q = [p[0] + (r() - 0.5) * 300, p[1] + (r() - 0.5) * 200]; n += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#${P.mid}" stroke-width="4" opacity="0.6"/><circle cx="${q[0]}" cy="${q[1]}" r="20" fill="#${P.a3}"/>`; });
    nodes.forEach((p, i) => (n += `<circle cx="${p[0]}" cy="${p[1]}" r="${46 + r() * 20}" fill="#${i % 2 ? P.a1 : P.a2}"/>`));
    return `${bg(P.light, mix(P.light, P.a1, 0.15))}${n}<circle cx="${c[0]}" cy="${c[1]}" r="110" fill="#${P.dark}"/>`;
  },
  sunrise(P, r) {
    const rays = range(18).map((i) => { const a = Math.PI + (i / 17) * Math.PI; return `<line x1="800" y1="760" x2="${800 + Math.cos(a) * 1200}" y2="${760 + Math.sin(a) * 1200}" stroke="#${P.light}" stroke-width="22" opacity="0.18"/>`; }).join('');
    return `${bg(P.a2, P.a1)}${rays}<circle cx="800" cy="760" r="260" fill="#${P.light}" opacity="0.9"/><circle cx="800" cy="760" r="200" fill="#${P.a3}"/>${ridge(r, 820, 70, 8, P.mid, 0.9)}<rect y="900" width="${W}" height="100" fill="#${P.dark}"/>`;
  },
  snow(P, r) {
    const flake = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="#${P.light}" stroke-width="7" stroke-linecap="round">${range(6).map((k) => `<g transform="rotate(${k * 60})"><line x1="0" y1="0" x2="0" y2="-90"/><line x1="0" y1="-55" x2="-22" y2="-75"/><line x1="0" y1="-55" x2="22" y2="-75"/></g>`).join('')}</g>`;
    return `${bg(P.a1, P.dark)}${ridge(r, 800, 200, 6, mix(P.light, P.a1, 0.3), 0.9)}${range(16).map(() => flake(r() * W, r() * 650, 0.4 + r() * 0.9)).join('')}`;
  },
  coffee(P, r) {
    const steam = range(3).map((i) => `<path d="M${700 + i * 90},380 C${660 + i * 90},300 ${760 + i * 90},260 ${700 + i * 90},180" fill="none" stroke="#${P.light}" stroke-width="14" stroke-linecap="round" opacity="0.6"/>`).join('');
    return `${bg(P.a1, P.dark)}<ellipse cx="800" cy="800" rx="460" ry="90" fill="#${P.light}" opacity="0.85"/><path d="M520,420 L1080,420 L1020,780 Q800,840 580,780 Z" fill="#${P.light}"/><path d="M1070,500 Q1220,500 1200,620 Q1180,720 1040,700" fill="none" stroke="#${P.light}" stroke-width="34"/><ellipse cx="800" cy="425" rx="280" ry="38" fill="#${P.mid}"/>${steam}`;
  },
  vinyl(P, r) {
    const cx = 900, cy = 500;
    return `${bg(P.a1, P.a2, false)}<circle cx="${cx}" cy="${cy}" r="400" fill="#141414"/>${range(12).map((i) => `<circle cx="${cx}" cy="${cy}" r="${170 + i * 18}" fill="none" stroke="#2A2A2A" stroke-width="3"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="140" fill="#${P.a3}"/><circle cx="${cx}" cy="${cy}" r="14" fill="#141414"/><path d="M${cx - 380},${cy - 120} Q${cx - 300},${cy - 380} ${cx - 40},${cy - 400}" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="0.15"/>${range(5).map((i) => `<text x="${150 + i * 60}" y="${260 + (i % 2) * 120}" font-size="120" fill="#${P.light}" opacity="0.8" font-family="DejaVu Sans">♪</text>`).join('')}`;
  },
  film(P, r) {
    const strip = (y, rot) => `<g transform="rotate(${rot} 800 ${y})"><rect x="-200" y="${y - 140}" width="2000" height="280" fill="#151515"/>${range(22).map((i) => `<rect x="${-180 + i * 95}" y="${y - 125}" width="50" height="30" rx="6" fill="#${P.light}"/><rect x="${-180 + i * 95}" y="${y + 95}" width="50" height="30" rx="6" fill="#${P.light}"/>`).join('')}${range(7).map((i) => `<rect x="${-100 + i * 290}" y="${y - 80}" width="250" height="160" fill="#${[P.a1, P.a2, P.a3, P.mid][i % 4]}"/>`).join('')}</g>`;
    return `${bg(P.dark, P.mid)}${strip(380, -8)}${strip(720, 6)}`;
  },
  flowers(P, r) {
    let f = ''; range(9).forEach(() => { const x = 100 + r() * 1400, y = 150 + r() * 650, s = 0.6 + r() * 0.9, c = [P.a1, P.a2, P.a3][Math.floor(r() * 3)];
      f += `<line x1="${x}" y1="${y}" x2="${x + (r() - 0.5) * 80}" y2="${H}" stroke="#${P.mid}" stroke-width="${10 * s}"/><g transform="translate(${x} ${y}) scale(${s})">${range(10).map((k) => `<ellipse cx="0" cy="-80" rx="34" ry="80" fill="#${c}" transform="rotate(${k * 36})"/>`).join('')}<circle r="58" fill="#${P.dark}"/></g>`; });
    return `${bg(P.light, mix(P.light, P.a1, 0.2))}${f}`;
  },
  marble(P, r) {
    let v = ''; range(7).forEach((i) => { const y0 = r() * H; let d = `M-100,${y0}`; for (let x = 0; x <= W + 200; x += 400) d += ` S${x + 200},${y0 + (r() - 0.5) * 500} ${x + 400},${y0 + (r() - 0.5) * 300}`;
      v += `<path d="${d}" fill="none" stroke="#${i % 2 ? P.mid : P.a1}" stroke-width="${3 + r() * 10}" opacity="${0.25 + r() * 0.3}"/>`; });
    return `${bg(P.light, mix(P.light, P.mid, 0.18), false)}<defs><filter id="f"><feGaussianBlur stdDeviation="5"/></filter></defs><g filter="url(#f)">${v}</g><circle cx="${500 + r() * 600}" cy="${380 + r() * 240}" r="170" fill="#${P.a1}" opacity="0.92"/><circle cx="${500 + r() * 600}" cy="${380 + r() * 240}" r="90" fill="#${P.dark}" opacity="0.85"/>`;
  },
  synthwave(P, r) {
    let g = ''; for (let i = 0; i < 14; i++) { const y = 620 + i * i * 3; g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#${P.a1}" stroke-width="3" opacity="0.8"/>`; }
    for (let x = -1600; x <= 3200; x += 160) g += `<line x1="800" y1="600" x2="${x}" y2="${H}" stroke="#${P.a1}" stroke-width="3" opacity="0.8"/>`;
    const bands = range(6).map((i) => `<rect x="520" y="${420 + i * 34}" width="560" height="${10 + i * 3}" fill="#${P.dark}"/>`).join('');
    return `${bg(P.dark, mix(P.dark, P.a2, 0.5))}<defs>${lg('sun', P.a3, P.a2)}</defs><circle cx="800" cy="440" r="280" fill="url(#sun)"/>${bands}<rect y="600" width="${W}" height="400" fill="#${P.dark}"/>${g}`;
  },
  gears(P, r) {
    const gear = (x, y, R, n, c) => `<g transform="translate(${x} ${y})">${range(n).map((k) => `<rect x="-${R * 0.12}" y="-${R + 34}" width="${R * 0.24}" height="${R * 0.5}" rx="6" fill="#${c}" transform="rotate(${(k * 360) / n})"/>`).join('')}<circle r="${R}" fill="#${c}"/><circle r="${R * 0.38}" fill="#${P.light}"/></g>`;
    return `${bg(P.light, mix(P.light, P.mid, 0.2))}${gear(600, 480, 230, 12, P.a1)}${gear(1000, 330, 140, 9, P.a2)}${gear(1070, 700, 120, 8, P.dark)}`;
  },
  road(P, r) {
    return `${bg(P.a1, P.light)}<circle cx="${300 + r() * 1000}" cy="230" r="90" fill="#${P.light}"/>${ridge(r, 560, 120, 6, P.mid, 0.8)}<polygon points="0,640 ${W},600 ${W},${H} 0,${H}" fill="#${P.a2}"/><polygon points="740,600 860,600 1400,${H} 200,${H}" fill="#${P.dark}"/>${range(6).map((i) => `<rect x="${795 - i * 4}" y="${620 + i * 66}" width="${10 + i * 8}" height="${24 + i * 12}" fill="#${P.light}"/>`).join('')}`;
  },
  checker(P, r) {
    let c = ''; const s = 120; for (let y = 0; y < 6; y++) for (let x = 0; x < 9; x++) c += `<rect x="${260 + x * s}" y="${140 + y * s}" width="${s}" height="${s}" fill="#${(x + y) % 2 ? P.dark : P.light}"/>`;
    const piece = (x, y, col) => `<circle cx="${x}" cy="${y}" r="44" fill="#${col}"/><circle cx="${x}" cy="${y}" r="28" fill="none" stroke="#${P.light}" stroke-width="4" opacity="0.5"/>`;
    return `${bg(P.mid, P.dark)}<rect x="230" y="110" width="${9 * s + 60}" height="${6 * s + 60}" fill="#${P.a3}"/>${c}${range(7).map(() => piece(320 + Math.floor(r() * 9) * s, 200 + Math.floor(r() * 6) * s, r() > 0.5 ? P.a1 : P.a2)).join('')}`;
  },
  envelope(P, r) {
    const env = (x, y, s, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-260" y="-170" width="520" height="340" rx="14" fill="#${P.light}"/><path d="M-260,-170 L0,40 L260,-170" fill="none" stroke="#${c}" stroke-width="14"/><rect x="150" y="-140" width="80" height="96" fill="#${c}"/></g>`;
    return `${bg(P.a1, P.a2, false)}${env(520, 420, 1, -8, P.dark)}${env(1080, 560, 0.85, 7, P.mid)}<path d="M200,860 C500,700 900,980 1400,760" fill="none" stroke="#${P.light}" stroke-width="6" stroke-dasharray="22 18" opacity="0.7"/>`;
  },
  bulb(P, r) {
    const rays = range(10).map((i) => { const a = -Math.PI + (i / 9) * Math.PI; return `<line x1="${800 + Math.cos(a) * 300}" y1="${420 + Math.sin(a) * 300}" x2="${800 + Math.cos(a) * 400}" y2="${420 + Math.sin(a) * 400}" stroke="#${P.a2}" stroke-width="18" stroke-linecap="round"/>`; }).join('');
    return `${bg(P.dark, P.mid)}${rays}<circle cx="800" cy="420" r="230" fill="#${P.a1}"/><rect x="700" y="620" width="200" height="130" rx="20" fill="#${P.light}"/><rect x="720" y="770" width="160" height="40" rx="14" fill="#${P.light}" opacity="0.8"/>`;
  },
  puzzle(P, r) {
    let p = ''; const s = 260; for (let y = 0; y < 4; y++) for (let x = 0; x < 7; x++) { const X = 30 + x * s, Y = 0 + y * s, c = [P.a1, P.a2, P.a3, P.mid][(x * 3 + y) % 4];
      p += `<path d="M${X},${Y} h${s * 0.38} a${s * 0.12},${s * 0.12} 0 1 1 ${s * 0.24},0 h${s * 0.38} v${s * 0.38} a${s * 0.12},${s * 0.12} 0 1 0 0,${s * 0.24} v${s * 0.38} h-${s} Z" fill="#${c}" stroke="#${P.dark}" stroke-width="6" ${r() > 0.85 ? `transform="translate(${(r() - 0.5) * 60} ${(r() - 0.5) * 60})"` : ''}/>`; }
    return `${bg(P.dark, P.dark)}${p}`;
  },
  balloons(P, r) {
    let b = ''; range(5).forEach(() => { const x = 150 + r() * 1300, y = 180 + r() * 500, s = 0.5 + r() * 0.8, c = [P.a1, P.a2, P.a3][Math.floor(r() * 3)];
      b += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,-200 C140,-200 170,-60 90,40 L40,110 L-40,110 L-90,40 C-170,-60 -140,-200 0,-200 Z" fill="#${c}"/><path d="M0,-200 C50,-200 60,-60 30,40 L15,110 L-15,110 L-30,40 C-60,-60 -50,-200 0,-200 Z" fill="#${P.light}" opacity="0.35"/><rect x="-30" y="140" width="60" height="50" rx="6" fill="#${P.dark}"/></g>`; });
    return `${bg(P.light, mix(P.light, P.a1, 0.35))}${b}`;
  },
  bokeh(P, r) {
    return `${bg(P.dark, P.mid, false)}${range(40).map(() => `<circle cx="${r() * W}" cy="${r() * H}" r="${20 + r() * 110}" fill="#${[P.a1, P.a2, P.a3][Math.floor(r() * 3)]}" opacity="${0.15 + r() * 0.45}"/>`).join('')}`;
  },
  compass(P, r) {
    return `${bg(P.light, mix(P.light, P.a3, 0.3))}${S.topo(P, r).replace(/<defs>.*?<\/defs><rect[^>]*>/, '')}<g transform="translate(1150 330)"><circle r="190" fill="#${P.dark}"/><circle r="165" fill="none" stroke="#${P.light}" stroke-width="6"/><polygon points="0,-150 32,0 0,150 -32,0" fill="#${P.a1}"/><polygon points="0,-150 32,0 -32,0" fill="#${P.a2}"/></g>`;
  },
  rocket(P, r) {
    let s = ''; range(90).forEach(() => (s += `<circle cx="${r() * W}" cy="${r() * H}" r="${r() * 3 + 1}" fill="#FFFFFF" opacity="${0.3 + r() * 0.6}"/>`));
    return `${bg(P.dark, P.mid)}${s}<g transform="translate(800 520) rotate(35)"><path d="M0,-300 C110,-180 110,80 70,180 L-70,180 C-110,80 -110,-180 0,-300 Z" fill="#${P.light}"/><circle cy="-80" r="50" fill="#${P.a1}"/><path d="M-70,100 L-160,230 L-60,190 Z M70,100 L160,230 L60,190 Z" fill="#${P.a2}"/><path d="M-50,190 L0,330 L50,190 Z" fill="#${P.a3}"/></g>`;
  },
};

// ---------------------------------------------------------------- which scene suits which template
const BY_SLUG = [
  [/aurora/, 'aurora'], [/samarqand|fasad/, 'arches'], [/suzani|atlas|vitraj/, 'ornament'], [/kosmos|osmon|tun-yarmi/, 'space'],
  [/okean|dengiz|akva|moviy/, 'waves'], [/sahro|qum|kraft/, 'dunes'], [/ormon|eco/, 'forest'], [/gerbariy|yashil-choy|zaytun|pista|yalpiz|akvarel/, 'leaves'],
  [/tog|muzlik/, 'mountains'], [/shahar|metro|corporate/, 'skyline'], [/^muz$|qor/, 'snow'], [/dnk/, 'dna'],
  [/molekula|laboratoriya|element|formula/, 'molecules'], [/plata|terminal|hud|hologramma/, 'circuit'], [/piksel|bloklar|retro-os|konstruktor/, 'pixels'],
  [/dashboard|dinamika|jadval|tablo|gant/, 'bars'], [/radial|venn|op-art|doira|termal/, 'rings'], [/topo|karta/, 'topo'], [/kompas/, 'compass'],
  [/izometrik|quti|bento/, 'isometric'], [/sintveyv|neon|graffiti/, 'synthwave'], [/kitob|javon|ensiklopediya|lugat|katalog|academic|qolyozma|editorial/, 'books'],
  [/vinil|nota|kasseta|pleer|efir/, 'vinyl'], [/kino|kamera|fotolab|fotojurnal|galereya|televizor|titrlar/, 'film'], [/kofe/, 'coffee'],
  [/kungaboqar|shaftoli|gilos|pushti|marjon|probka|stiker/, 'flowers'], [/marmar|beton|metall|grafit|luxe/, 'marble'], [/asboblar|zinapoya/, 'gears'],
  [/poyezd|ilon-yol|yol-belgilari|gorizont|ufq/, 'road'], [/tong|shom|oltin-soat|qahrabo|terrakota|oltin-kesim/, 'sunrise'],
  [/aql-xaritasi|orgimchak|zanjir|shajara|wireframe/, 'network'], [/bauhaus|mondrian|memfis|swiss|komiks|asalari|brutalist/, 'geometric'],
  [/shaxmat|nard|domino/, 'checker'], [/pochta|maktub|telegramma|chipta|banknota|pasport|blanka|chek/, 'envelope'], [/pazl|tangram|krossvord|labirint/, 'puzzle'],
  [/origami|prizma|piramida|kesim/, 'lowpoly'], [/lupa|piktogramma|smartfon/, 'bulb'], [/tarkib|kvadrant|chorak|kanban/, 'donut'],
];
const ROTATION = Object.keys(S);

async function main() {
  fs.mkdirSync(DIR, { recursive: true });
  const files = fs.readdirSync(path.join(__dirname, '..', 'templates')).filter((f) => f.endsWith('.js')).sort();
  const used = {};
  let k = 0;
  for (const f of files) {
    const id = parseInt(f, 10), slug = f.replace(/^\d+-|\.js$/g, ''), src = fs.readFileSync(path.join(__dirname, '..', 'templates', f), 'utf8');
    let scene = (BY_SLUG.find(([re]) => re.test(slug)) || [])[1];
    if (!scene) { // no theme in the name: the scene used least so far, so neighbours differ
      scene = ROTATION.slice().sort((a, b) => (used[a] || 0) - (used[b] || 0) || ((ROTATION.indexOf(a) - k + 99) % ROTATION.length) - ((ROTATION.indexOf(b) - k + 99) % ROTATION.length))[0];
      k++;
    }
    used[scene] = (used[scene] || 0) + 1;
    let seed = id * 7919 + 13; const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const P = palette(src);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${S[scene](P, r)}</svg>`;
    fs.writeFileSync(path.join(DIR, `${id}.svg`), svg);
    await sharp(Buffer.from(svg), { density: 72 }).resize(W, H).jpeg({ quality: 86 }).toFile(path.join(DIR, `${id}.jpg`));
    console.log(id, slug, scene);
  }
  console.error(JSON.stringify(used));
}
main().catch((e) => { console.error(e); process.exit(1); });
