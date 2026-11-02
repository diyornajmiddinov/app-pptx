/** 176 Siyoh — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 176, slug: 'siyoh', name: "Siyoh", mode: 'narrow', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: 'E9EEF7', muted: '9AA8C2', accent: '8FB3FF' }, photo: { r: 0.06 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('0B1020'), rad(1500,900,900,[[0,'1C2B55',0.9],[1,'0B1020',0]]), grain(0.05)),
  tone: "chuqur mulohaza: sokin, falsafiy, ravon jumlalar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["fade", "wipe:r", "dissolve"], "cover": ["fadeLetters", "typeLetters"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "fadeLetters", "body": "wipeWords", "item": "wipe:r", "image": "dissolve", "number": "fade", "order": "seq", "stagger": 0.24}, "tempo": 1.3, "kenburns": false};
