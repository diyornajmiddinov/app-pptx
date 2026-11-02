/** 181 Oltin soat — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 181, slug: 'oltin-soat', name: "Oltin soat", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'FFE6D4', accent: 'FFF1C7' }, photo: { r: 0.1 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F28C38'],[1,'E3487A']],'d'), grain(0.05)),
  tone: "ilhomli va iliq: orzu va natija, jonli ifoda" });
