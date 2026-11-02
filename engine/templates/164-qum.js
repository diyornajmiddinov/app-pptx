/** 164 Qum — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 164, slug: 'qum', name: "Qum", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: '3E3326', muted: '7D6B55', accent: 'B5703A' }, photo: { r: 0.02 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F4EADB'],[1,'E8D6BC']]), raw(`<path d="M0,${kind==='cover'?640:760} C400,${kind==='cover'?560:720} 900,${kind==='cover'?720:800} 1600,${kind==='cover'?600:740} L1600,900 L0,900 Z" fill="#DCC5A3" opacity="0.6"/>`), grain(0.07)),
  tone: "issiq va tabiiy: sokin bayon, tabiiy obrazlar, aniq xulosalar" });
