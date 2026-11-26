const fs = require('fs');
let s = fs.readFileSync('src/components/ProcessView.tsx', 'utf8');
let n = 0;
const R = (a, b) => { if (!s.includes(a)) { console.error('EI:', JSON.stringify(a.slice(0, 80))); process.exit(1); } s = s.split(a).join(b); n++; };

/* ================================================================
   1. CIP-pumpun siipi: vaihda epavakaa kaaripolku vakaisiin viivoihin
   ================================================================ */
R(`    <g className={sim.cipRunning ? 'lfc-spin' : ''} style={{ transformOrigin: '540px 406px' }}>
    {[0, 120, 240].map((a) => (
      <path key={a} d="M540,406 L547,399 A9.5,9.5 0 0 1 547,413 Z" fill="#7bd389" opacity="0.85" transform={\`rotate(\${a} 540 406)\`} />
    ))}
  </g>`,
`    <g className={sim.cipRunning ? 'lfc-spin' : ''} style={{ transformOrigin: '540px 406px' }}>
    {[0, 120, 240].map((a) => (
      <rect key={a} x="538" y="394" width="4" height="12" rx="2" fill="#7bd389" opacity="0.85" transform={\`rotate(\${a} 540 406)\`} />
    ))}
  </g>`);

/* ================================================================
   2. Tekstien luettavuus: isotenna pienia teksteja, lisaa tilaa
   ================================================================ */

// patruunanimet C1-C4: isompi + enemman tilaa
R('fontSize="8" fill="#8e9ab8">C{i * 2 + j + 1}</text>', 'fontSize="9" fill="#a0aec8">C{i * 2 + j + 1}</text>');

// laitenimet: tarkista etta eivat ole paallekain
R('fontSize="7.5" fill="#8e9ab8">HPP 1 · APP</text>', 'fontSize="8" fill="#a0aec8" letterSpacing="0.3">HPP 1</text>');
R('fontSize="7.5" fill="#8e9ab8">HPP 2 · APP</text>', 'fontSize="8" fill="#a0aec8" letterSpacing="0.3">HPP 2</text>');

// iSave-nimet
R('fontSize="7" fill="#8e9ab8">iSAVE 1</text>', 'fontSize="8" fill="#a0aec8" letterSpacing="0.3">iSAVE 1</text>');
R('fontSize="8" fill="#8e9ab8">iSAVE 2</text>', 'fontSize="8" fill="#a0aec8" letterSpacing="0.3">iSAVE 2</text>');

// drum filter / auto filter
R('fontSize="9" fill="#8e9ab8">drum filter</text>', 'fontSize="9" fill="#a0aec8">drum filter</text>');
R('fontSize="9" fill="#8e9ab8">auto filter</text>', 'fontSize="9" fill="#a0aec8">auto filter</text>');

// CIP-laitteiden nimet
R('fontSize="9" fill="#8e9ab8">CIP TANK</text>', 'fontSize="9" fill="#a0aec8" letterSpacing="0.5">CIP TANK</text>');
R('fontSize="9" fill="#8e9ab8">CIP PUMP</text>', 'fontSize="9" fill="#a0aec8" letterSpacing="0.5">CIP PUMP</text>');
R('fontSize="9" fill="#8e9ab8">CIP FILTER</text>', 'fontSize="9" fill="#a0aec8" letterSpacing="0.5">CIP FILTER</text>');

// RO STACK -nimet
R('fontWeight="700" fill="#cdd6ea">RO STACK {li + 1}</text>', 'fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">RO STACK {li + 1}</text>');

// brine out / CIP return
R('fontSize="10" fill="#8e9ab8">brine out</text>', 'fontSize="10" fill="#a0aec8" letterSpacing="0.5">brine out</text>');
R('fontSize="7" fill="#7da98c">CIP return</text>', 'fontSize="8" fill="#7da98c" letterSpacing="0.5">CIP return</text>');

// syotto/ulos-kyltit
R('fontSize="7" fill="#4aa3e0">feed in</text>', 'fontSize="8" fill="#4aa3e0" fontWeight="600">feed in</text>');
R('fontSize="7" fill="#63b8ec">HP out</text>', 'fontSize="8" fill="#63b8ec" fontWeight="600">HP out</text>');
R('fontSize="7" fill="#8e9ab8">brine in</text>', 'fontSize="8" fill="#a0aec8">brine in</text>');

// NaOH / mixer
R('fontSize="6.5" fill="#8e9ab8">mixer</text>', 'fontSize="7.5" fill="#a0aec8">mixer</text>');
R('fontSize="7" fill="#8e9ab8">NaOH 1</text>', 'fontSize="8" fill="#a0aec8">NaOH 1</text>');
R('fontSize="6.5" fill="#8e9ab8">NaOH 2</text>', 'fontSize="8" fill="#a0aec8">NaOH 2</text>');

// SEAWATER
R("fill=\"#cdd6ea\" fontSize=\"12\" fontWeight=\"700\">SEAWATER</text>", 'fill="#e2e8f0" fontSize="12" fontWeight="700" letterSpacing="0.5">SEAWATER</text>');
R('fontSize="11" fill="#8e9ab8">depth', 'fontSize="10" fill="#a0aec8">depth');

// FW TANK
R('fontSize="8" fill="#8e9ab8">FW TANK</text>', 'fontSize="9" fill="#a0aec8" letterSpacing="0.5">FW TANK</text>');

// mittarien sisaiset tekstit (Gauge-komponentissa)
R("fontSize=\"9\" fill=\"#8e9ab8\" letterSpacing=\"1\">{tag}</text>", 'fontSize="9" fill=\"#a0aec8\" letterSpacing=\"0.5\">{tag}</text>');

/* ================================================================
   3. Tilaa teksteille: siirra tarvittaessa
   ================================================================ */

// HPP 1 -nimi: enemman tilaa pumpusta
R('<text x="517" y="228"', '<text x="517" y="230"');

// iSave 1 -nimi ylempna
R('<text x="570" y="124"', '<text x="570" y="123"');

// iSave 2 -nimi alempana
R('<text x="570" y="326"', '<text x="570" y="330"');

// CIP otsikko
R('<text x="530" y="368"', '<text x="530" y="366"');

fs.writeFileSync('src/components/ProcessView.tsx', s);
console.log('CIP-siipi + tekstien luettavuus + tilaa,', n, 'korvausta');
