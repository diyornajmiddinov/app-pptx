/** 188 Gorizont — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 188, slug: 'gorizont', name: "Gorizont", mode: 'bottom', list: 'cols', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '1F2937', muted: '5B6575', accent: '2563EB' }, photo: { r: 0.06 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'BFD9F2'],[0.55,'EAF3FB'],[0.56,'FFFFFF'],[1,'FFFFFF']])),
  tone: "istiqbolli: maqsad va yo'l, tiniq va umidli" });
