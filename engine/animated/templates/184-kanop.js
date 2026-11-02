/** 184 Kanop — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 184, slug: 'kanop', name: "Kanop", mode: 'narrow', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '35302A', muted: '6F675C', accent: '8A6D3B' }, photo: { r: 0.02 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('F2ECE0'), raw(Array.from({length:225},(_,i)=>`<line x1="0" y1="${i*4}" x2="1600" y2="${i*4}" stroke="#D9CFBD" stroke-width="1" opacity="0.5"/>`).join('')+Array.from({length:400},(_,i)=>`<line x1="${i*4}" y1="0" x2="${i*4}" y2="900" stroke="#E3DACA" stroke-width="1" opacity="0.35"/>`).join(''))),
  tone: "nafis va tabiiy: sokin, mukammal tanlangan so'zlar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm"], "transitions": ["fade", "pull:l", "dissolve"], "cover": ["fadeWords", "fadeWords"], "mark": "fade", "deco": "fadeRight", "sig": {"title": "fadeRight", "body": "fade", "item": "fadeRight", "image": "fadeRight", "number": "fade", "order": "seq", "stagger": 0.28}, "tempo": 1.45, "kenburns": true};
