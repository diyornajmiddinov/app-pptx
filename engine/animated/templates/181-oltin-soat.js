/** 181 Oltin soat — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 181, slug: 'oltin-soat', name: "Oltin soat", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'FFE6D4', accent: 'FFF1C7' }, photo: { r: 0.1 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F28C38'],[1,'E3487A']],'d'), grain(0.05)),
  tone: "ilhomli va iliq: orzu va natija, jonli ifoda" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "dissolve", "p14:pan|dir=\"u\""], "cover": ["riseWords", "fadeLetters"], "mark": "riseUp", "deco": "splitH", "sig": {"title": "riseWords", "body": "fade", "item": "riseUp", "image": "splitH", "number": "riseSettle", "order": "seq", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
