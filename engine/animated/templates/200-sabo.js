/** 200 Sabo — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 200, slug: 'sabo', name: "Sabo", mode: 'top', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '1F3346', muted: '5E7385', accent: '3D7EAA' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'EAF4FB'],[1,'FFFFFF']]), raw(Array.from({length:6},(_,i)=>`<path d="M0,${700+i*30} C400,${660+i*30} 1000,${760+i*30} 1600,${690+i*30}" fill="none" stroke="#B9D6EA" stroke-width="2" opacity="${0.7-i*0.1}"/>`).join(''))),
  tone: "yengil shabada: ravon, bemalol, aniq" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "energetic"], "transitions": ["p14:pan|dir=\"l\"", "fade", "push:r"], "cover": ["sweepIn", "riseWords"], "mark": "swingRight", "deco": "fadeRight", "sig": {"title": "sweepIn", "body": "fadeRight", "item": "swingRight", "image": "slideRight", "number": "swingRight", "order": "cascade", "stagger": 0.2}, "tempo": 1.15, "kenburns": true};
