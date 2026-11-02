/** 172 Bordo — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 172, slug: 'bordo', name: "Bordo", mode: 'split', list: 'cols', num: 'big', F: { head: 'Times New Roman', body: 'Georgia' },
  C: { ink: 'F7E9E4', muted: 'D7B3AC', accent: 'F0C27B' }, photo: { r: 0.0 }, rule: false, caps: true, bold: false,
  bg: (kind) => compose(flat('5A1621'), rad(0,0,1300,[[0,'7A2331',0.8],[1,'5A1621',0]]), grain(0.06)),
  tone: "salobatli va ko'rkam: tanlangan so'zlar, nafis bayon" });
