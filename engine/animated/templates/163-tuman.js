/** 163 Tuman — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 163, slug: 'tuman', name: "Tuman", mode: 'narrow', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '3A3F44', muted: '7A8188', accent: '5C6B73' }, photo: { r: 0.04 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('EEF0F1'), blobs([[300,250,380,'FFFFFF',0.95],[1250,650,420,'FFFFFF',0.9],[800,450,300,'DDE1E4',0.6]],kind==='cover'?110:160), grain(0.04)),
  tone: "tumandagi aniqlik: sokin, vazmin, keraksiz so'zlarsiz" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm"], "transitions": ["dissolve", "fade", "morph"], "cover": ["fadeWords", "fadeWords"], "mark": "dissolve", "deco": "dissolve", "sig": {"title": "fadeWords", "body": "dissolve", "item": "dissolve", "image": "dissolve", "number": "dissolve", "order": "together", "stagger": 0.3}, "tempo": 1.5, "kenburns": true};
