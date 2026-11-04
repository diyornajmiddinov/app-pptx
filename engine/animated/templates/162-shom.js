/** 162 Shom — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 162, slug: 'shom', name: "Şom", mode: 'center', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'FFF4EC', muted: 'E9C9D6', accent: 'FFB38A' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin(kind==='cover' ? [[0,'1E1B4B'],[0.55,'6B2E6E'],[1,'D9576B']] : [[0,'221D52'],[1,'4B2463']]), kind==='page' ? raw('') : blobs([[800,900,420,'F08A5D',0.55]],160), grain(0.06)),
  tone: "kechki osoyishtalik: mulohazali, ravon va qisqa iboralar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["dissolve", "fade", "p14:pan|dir=\"d\""], "cover": ["fadeWords", "fadeLetters"], "mark": "fade", "deco": "sinkDown", "sig": {"title": "fadeDown", "body": "fade", "item": "fadeDown", "image": "dissolve", "number": "fade", "order": "reverse", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
