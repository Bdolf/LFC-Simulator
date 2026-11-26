const fs = require('fs');
let s = fs.readFileSync('src/components/ProcessView.tsx', 'utf8');
let n = 0;
const R = (a, b) => { if (!s.includes(a)) { console.error('EI:', JSON.stringify(a.slice(0, 60))); process.exit(1); } s = s.split(a).join(b); n++; };

/* ---- putkien viivakoko pienemmaksi: 10 -> 6, 8 -> 5 ---- */

/* C2/C4 -> HPP (nakyvat syottolinjat) */
R('stroke={pipe} strokeWidth="10"', 'stroke={pipe} strokeWidth="6" strokeLinejoin="round"');
R('stroke="#8fa3b8" strokeWidth="2" />', 'stroke="#8fa3b8" strokeWidth="1.5" />');

/* esikasittelyputket (rumppu, AquaBoll, jakaaja) */
R('strokeWidth="10"', 'strokeWidth="6" strokeLinejoin="round"');
R('strokeWidth="9"', 'strokeWidth="5" strokeLinejoin="round"');
R('strokeWidth="8"', 'strokeWidth="5" strokeLinejoin="round"');
R('strokeWidth="7"', 'strokeWidth="4.5" strokeLinejoin="round"');

/* permeaatti */
R('stroke={permPipe} strokeWidth="5" strokeLinejoin="round"', 'stroke={permPipe} strokeWidth="4"');
s = s.split('stroke={permPipe} strokeWidth="5"').join('stroke={permPipe} strokeWidth="4"');
s = s.split('stroke={permPipe} strokeWidth="8"').join('stroke={permPipe} strokeWidth="4.5"');

/* LP-syottohaarat (siniset) */
R('stroke="#4aa3e0" strokeWidth="4"', 'stroke="#4aa3e0" strokeWidth="3"');
R('stroke="#4aa3e0" strokeWidth="3.5"', 'stroke="#4aa3e0" strokeWidth="3"');

/* CIP-annos (vihreä) */
R('stroke="#7bd389" strokeWidth="5" strokeDasharray="10 7"', 'stroke="#7bd389" strokeWidth="3.5" strokeDasharray="10 7"');
R('stroke="#7bd389" strokeWidth="8" strokeLinecap="round"', 'stroke="#7bd389" strokeWidth="5" strokeLinecap="round"');

/* CIP-paluu */
R('stroke="#4a7d63" strokeWidth="4" strokeDasharray="6 5"', 'stroke="#4a7d63" strokeWidth="3" strokeDasharray="6 5"');

/* brine-putket */
R('stroke="#4a5470" strokeWidth="5" strokeDasharray="7 5"', 'stroke="#4a5470" strokeWidth="3.5" strokeDasharray="7 5"');
R('stroke="#4a5470" strokeWidth="6" strokeDasharray="8 6"', 'stroke="#4a5470" strokeWidth="4" strokeDasharray="8 6"');
R('stroke="#4a5470" strokeWidth="5" opacity', 'stroke="#4a5470" strokeWidth="3.5" opacity');

/* flow-animaatiot ohuemmiksi */
R('stroke="#bfe6ff" strokeWidth="2.4"', 'stroke="#bfe6ff" strokeWidth="1.8"');
R('stroke="#c9f0fc" strokeWidth="1.5"', 'stroke="#c9f0fc" strokeWidth="1.2"');
R('stroke="#d2f5d8" strokeWidth="2.4"', 'stroke="#d2f5d8" strokeWidth="1.8"');

fs.writeFileSync('src/components/ProcessView.tsx', s);
console.log('putkien viivakoot pienennetty,', n, 'korvausta');
