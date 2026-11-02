/** 175 Terrakota — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 175, slug: 'terrakota', name: "Terrakota", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFF3E8', muted: 'F1CBB3', accent: 'FFE2B0' }, photo: { r: 0.03 }, rule: false, caps: true, bold: true,
  bg: (kind) => compose(flat('B4573B'), grain(0.1)),
  tone: "tuproqdek mustahkam: tabiiy, iliq va ishonchli bayon" });
