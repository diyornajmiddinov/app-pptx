/** 186 Neon tuman — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 186, slug: 'neon-tuman', name: "Neon tuman", mode: 'split', list: 'cols', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F3EEFF', muted: 'B7ABD9', accent: '4FF0E0', titleInk: 'FFFFFF' }, photo: { r: 0.08 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('140B26'), blobs([[0,900,380,'7B2FF7',0.7],[1600,0,340,'00C2D1',0.55]],kind==='cover'?150:200), grain(0.05)),
  tone: "zamonaviy va jasur: yangi g'oyalar, dinamik ifoda" });
