// Stand-in illustrations for the demo decks (real photos come from Pexels on the server).
const sharp = require('sharp');
const fs = require('fs');
const W = 1600, H = 1000;
const sky = (a, b) => `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sky)"/>`;
let seed = 3; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const scenes = {
  skyline() {
    let b = '';
    for (let x = 0; x < W; ) { const w = 90 + rnd() * 140, h = 250 + rnd() * 480; const c = ['2C3E5C', '34496B', '24344F', '3D5378'][Math.floor(rnd() * 4)];
      b += `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="#${c}"/>`;
      for (let wy = H - h + 30; wy < H - 30; wy += 42) for (let wx = x + 14; wx < x + w - 24; wx += 30) if (rnd() > 0.45) b += `<rect x="${wx}" y="${wy}" width="14" height="22" fill="#F6D58E" opacity="${0.5 + rnd() * 0.5}"/>`;
      x += w + 8; }
    return `${sky('F2A65A', 'F7D9B0')}<circle cx="1200" cy="330" r="120" fill="#FFE7B8"/>${b}`;
  },
  coins() {
    let c = '';
    [[380, 6], [620, 10], [860, 14], [1100, 19]].forEach(([x, n]) => { for (let i = 0; i < n; i++) { const y = 880 - i * 34; c += `<ellipse cx="${x}" cy="${y + 14}" rx="105" ry="30" fill="#A87A1E"/><rect x="${x - 105}" y="${y - 14}" width="210" height="28" fill="#C9962B"/><ellipse cx="${x}" cy="${y - 14}" rx="105" ry="30" fill="#E8BC4F"/>`; } });
    return `${sky('1F3B4D', '3C6E71')}<ellipse cx="760" cy="930" rx="760" ry="60" fill="#163040"/>${c}<path d="M300,420 C600,380 900,260 1300,140" stroke="#9EE6C7" stroke-width="14" fill="none"/><polygon points="1300,140 1250,135 1285,180" fill="#9EE6C7"/>`;
  },
  chart() {
    let g = '';
    for (let y = 200; y < 900; y += 100) g += `<line x1="200" y1="${y}" x2="1450" y2="${y}" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3"/>`;
    const hs = [180, 260, 230, 380, 470, 560, 690];
    hs.forEach((h, i) => (g += `<rect x="${260 + i * 170}" y="${880 - h}" width="110" height="${h}" rx="10" fill="#${i === hs.length - 1 ? 'F4B942' : '6FB1C8'}"/>`));
    return `${sky('0E2A3B', '1D4E63')}${g}<polyline points="315,680 485,600 655,630 825,480 995,390 1165,300 1335,170" fill="none" stroke="#FFFFFF" stroke-width="10"/>`;
  },
  document() {
    let l = ''; for (let y = 330; y < 820; y += 46) l += `<rect x="560" y="${y}" width="${380 + rnd() * 180}" height="14" rx="7" fill="#C9D2DC"/>`;
    return `${sky('D9E4EC', 'B6C8D6')}<rect x="480" y="160" width="640" height="760" rx="18" fill="#FFFFFF"/><rect x="560" y="230" width="420" height="34" rx="10" fill="#2E4A62"/>${l}<circle cx="980" cy="800" r="88" fill="none" stroke="#C0392B" stroke-width="12"/><circle cx="980" cy="800" r="60" fill="none" stroke="#C0392B" stroke-width="5"/><rect x="1120" y="420" width="34" height="420" rx="12" fill="#2E4A62" transform="rotate(22 1137 630)"/>`;
  },
  road() {
    return `${sky('7FB3D5', 'E8F1F5')}<polygon points="0,620 1600,560 1600,1000 0,1000" fill="#7A9A5B"/><polygon points="0,700 1600,640 1600,1000 0,1000" fill="#5E7F43"/><polygon points="700,575 900,575 1350,1000 250,1000" fill="#4A4A4A"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${793 - i * 3}" y="${600 + i * 80}" width="${14 + i * 6}" height="${30 + i * 14}" fill="#F2F2F2"/>`).join('')}<circle cx="1260" cy="230" r="90" fill="#FFF3C4"/>`;
  },
  calculator() {
    let k = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) k += `<rect x="${640 + c * 92}" y="${470 + r * 92}" width="72" height="72" rx="14" fill="#${c === 3 ? 'E67E22' : '3A4A5A'}"/>`;
    return `${sky('2D3E50', '52677D')}<rect x="600" y="220" width="400" height="660" rx="36" fill="#1F2A36"/><rect x="640" y="270" width="320" height="140" rx="12" fill="#B9D7C3"/><text x="930" y="370" font-family="Arial" font-size="80" font-weight="bold" text-anchor="end" fill="#1F2A36">12%</text>${k}`;
  },
};
(async () => {
  fs.mkdirSync(__dirname + '/img', { recursive: true });
  for (const [name, fn] of Object.entries(scenes)) {
    await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${fn()}</svg>`)).jpeg({ quality: 88 }).toFile(`${__dirname}/img/${name}.jpg`);
  }
  console.log(fs.readdirSync(__dirname + '/img'));
})();
