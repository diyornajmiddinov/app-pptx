/** 196 Soya — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 196, slug: 'soya', name: "Soya", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '2A2A2A', muted: '6A6A6A', accent: 'A06A3F' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('F7F5F2'), raw('<polygon points="0,0 700,0 0,900" fill="#E6E2DC" opacity="0.8"/><polygon points="0,0 420,0 0,560" fill="#DCD7CF" opacity="0.6"/>'), blobs([[0,0,200,'F7F5F2',0.4]],60)),
  tone: "yorug'lik va soya: muhim va ikkinchi darajalini ajratadigan bayon" });
