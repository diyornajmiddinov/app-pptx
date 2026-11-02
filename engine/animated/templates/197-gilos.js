/** 197 Gilos — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 197, slug: 'gilos', name: "Gilos", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'F6C6D2', accent: 'FFD1DC' }, photo: { r: 0.2 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'9B1B3A'],[1,'D23C5A']],'d'), grain(0.05)),
  tone: "ehtirosli va ko'rkam: qisqa, ta'sirli jumlalar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "elegant"], "transitions": ["fade", "p14:ripple", "p14:flip|dir=\"r\""], "cover": ["bounceDrop", "riseWords"], "mark": "bounceDrop", "deco": "drop", "sig": {"title": "bounceDrop", "body": "fadeUp", "item": "drop", "image": "springIn", "number": "bounceDrop", "order": "seq", "stagger": 0.18}, "tempo": 1.05, "kenburns": true};
