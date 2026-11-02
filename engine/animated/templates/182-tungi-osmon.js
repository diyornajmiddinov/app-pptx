/** 182 Tungi osmon — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 182, slug: 'tungi-osmon', name: "Tungi osmon", mode: 'center', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'EEF1FF', muted: 'A9B1D6', accent: 'FFD27A' }, photo: 'circle', rule: false, caps: false, bold: false,
  bg: (kind) => compose(lin([[0,'0A0F2C'],[1,'1E2A5C']]), raw(Array.from({length:120},(_,i)=>`<circle cx="${(i*137)%1600}" cy="${(i*271)%(kind==='page'?500:900)}" r="${1+(i%3)*0.6}" fill="#fff" opacity="${0.25+(i%5)*0.12}"/>`).join(''))),
  tone: "keng ufq: orzuli, sokin va chuqur fikrli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "energetic"], "transitions": ["p14:flythrough|dir=\"in\"", "fade", "p14:vortex|dir=\"l\""], "cover": ["fadeLetters", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "fadeLetters", "body": "fade", "item": "dissolve", "image": "focusIn", "number": "focusIn", "order": "diagonal", "stagger": 0.2}, "tempo": 1.25, "kenburns": true};
