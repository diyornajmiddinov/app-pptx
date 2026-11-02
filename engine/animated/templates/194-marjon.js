/** 194 Marjon — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 194, slug: 'marjon', name: "Marjon", mode: 'narrow', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'FFE1D6', accent: 'FFF3B0' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FF7A64'],[1,'F25C54']]), grain(0.04)),
  tone: "jonli va samimiy: hissiyotli, qisqa iboralar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "calm"], "transitions": ["p14:ripple", "fade", "p14:gallery|dir=\"l\""], "cover": ["springIn", "riseWords"], "mark": "springIn", "deco": "curveUp", "sig": {"title": "springIn", "body": "fadeUp", "item": ["curveUp", "curveDown"], "image": "springIn", "number": "springIn", "order": "alternate", "stagger": 0.2}, "tempo": 1.15, "kenburns": true};
