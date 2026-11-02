/** 161 Tong — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 161, slug: 'tong', name: "Tong", mode: 'left', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '2D2A32', muted: '6B6470', accent: 'C8553D' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FCE8DC'],[1,'E9E3F4']]), kind==='cover' ? blobs([[1350,180,260,'F9B9A3',0.9],[1500,520,220,'D8CCF2',0.8]],140) : blobs([[1550,880,260,'F6CDBE',0.6]],150), grain(0.05)),
  tone: "tong kabi yumshoq va ochiq: sodda gaplar, bir slaydda bir fikr" });
