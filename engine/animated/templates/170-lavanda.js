/** 170 Lavanda — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 170, slug: 'lavanda', name: "Lavanda", mode: 'narrow', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '2E2A3D', muted: '6E6882', accent: '7C5CBF' }, photo: { r: 0.2 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(lin([[0,'EFEAFB'],[1,'DCD3F3']],'d'), grain(0.04)),
  tone: "nafis va mayin: o'ylangan, ravon jumlalar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "dissolve", "p14:reveal|thruBlk=\"1\""], "cover": ["fadeLetters", "riseWords"], "mark": "fadeUp", "deco": "curveUp", "sig": {"title": "fadeLetters", "body": "fadeWords", "item": "curveUp", "image": "focusIn", "number": "fadeUp", "order": "seq", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
