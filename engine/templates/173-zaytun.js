/** 173 Zaytun — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 173, slug: 'zaytun', name: "Zaytun", mode: 'left', list: 'rows', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: 'F3EEDB', muted: 'C9C3A6', accent: 'E3C565' }, photo: { r: 0.06 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('4B5132'), grain(0.09)),
  tone: "barqaror va tinch: puxta, ishonchli, sodda til" });
