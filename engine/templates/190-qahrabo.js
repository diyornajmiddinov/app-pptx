/** 190 Qahrabo — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 190, slug: 'qahrabo', name: "Qahrabo", mode: 'left', list: 'rows', num: 'big', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFF4E0', muted: 'E3C79B', accent: 'FFB547' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('2A1A0C'), rad(kind==='cover'?1200:1500,kind==='cover'?300:100,900,[[0,'8A4E14',0.85],[1,'2A1A0C',0]]), grain(0.06)),
  tone: "iliq va boy: chuqur mazmun, mulohazali bayon" });
