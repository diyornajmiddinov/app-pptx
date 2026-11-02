/** 177 Pushti — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 177, slug: 'pushti', name: "Pushti", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '5A1E2E', muted: '8E5B68', accent: 'B83B5E' }, photo: { r: 0.2 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FDE7EC'],[1,'F8D3DC']])),
  tone: "mehrli va yumshoq: g'amxo'rlik, iliq va sodda til" });
