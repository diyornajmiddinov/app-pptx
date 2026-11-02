/** 165 Moviy — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 165, slug: 'moviy', name: "Moviy", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F2F7FF', muted: 'B9CCE6', accent: '8FD3FF' }, photo: { r: 0.06 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('0E2A5A'), rad(kind==='cover'?300:120, kind==='cover'?150:80, kind==='cover'?1100:900, [[0,'2F6FD6',0.85],[1,'0E2A5A',0]]), grain(0.05)),
  tone: "chuqur va ishonchli: aniq dalillar, xotirjam ohang" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:ripple", "morph"], "cover": ["focusIn", "riseWords"], "mark": "focusIn", "deco": "softGrow", "sig": {"title": "focusIn", "body": "fadeUp", "item": "softGrow", "image": "circle", "number": "focusIn", "order": "centerOut", "stagger": 0.22}, "tempo": 1.25, "kenburns": true};
