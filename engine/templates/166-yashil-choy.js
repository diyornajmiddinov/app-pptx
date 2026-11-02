/** 166 Yashil choy — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 166, slug: 'yashil-choy', name: "Yashil choy", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '22332A', muted: '5D6F64', accent: '4E7A5A' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('DCE5D3'), blobs([[150,780,300,'C7D6BB',0.9]],120), grain(0.08)),
  tone: "osoyishta va tabiiy: sog'lom muvozanat, sodda tushuntirish" });
