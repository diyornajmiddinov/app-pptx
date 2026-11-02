/** 183 Kraft — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 183, slug: 'kraft', name: "Kraft", mode: 'left', list: 'cols', num: 'corner', F: { head: 'Courier New', body: 'Calibri' },
  C: { ink: '2E2418', muted: '5E4E3A', accent: '8C3B2A' }, photo: { r: 0.0 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('C8A97E'), grain(0.14,0.6), raw(Array.from({length:40},(_,i)=>`<path d="M${(i*97)%1600},${(i*53)%900} q30,8 60,2" stroke="#8C7050" stroke-width="1.2" fill="none" opacity="0.35"/>`).join(''))),
  tone: "hunarmandona: sodda, amaliy va samimiy" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["cover:u", "fade", "pull:r"], "cover": ["fadeWords", "swingRight"], "mark": "drop", "deco": "drop", "sig": {"title": "fadeDown", "body": "fadeUp", "item": "drop", "image": "drop", "number": "drop", "order": "seq", "stagger": 0.22}, "tempo": 1.2, "kenburns": false};
