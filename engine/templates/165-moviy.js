/** 165 Moviy — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 165, slug: 'moviy', name: "Moviy", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F2F7FF', muted: 'B9CCE6', accent: '8FD3FF' }, photo: { r: 0.06 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('0E2A5A'), rad(kind==='cover'?300:120, kind==='cover'?150:80, kind==='cover'?1100:900, [[0,'2F6FD6',0.85],[1,'0E2A5A',0]]), grain(0.05)),
  tone: "chuqur va ishonchli: aniq dalillar, xotirjam ohang" });
