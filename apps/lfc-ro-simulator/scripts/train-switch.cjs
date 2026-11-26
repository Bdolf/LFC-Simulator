const fs = require('fs');
let s = fs.readFileSync('src/components/ProcessView.tsx', 'utf8');
let n = 0;
const R = (a, b) => { if (!s.includes(a)) { console.error('EI:', JSON.stringify(a.slice(0, 70))); process.exit(1); } s = s.split(a).join(b); n++; };

/* lisaa train2Active-muuttuja komponentin alkuun */
R('  const producing = sim.producing;',
  '  const producing = sim.producing;\n  // vain yksi linja kun kapasiteetti <= 63 m3/h\n  const train2Active = sim.capacity > 63;\n  const t2pipe = train2Active ? pipe : \'#3a4f6b\';\n  const t2dim = train2Active ? 1 : 0.35;');

/* === LINJA 2 elementit: himmenna kun ei aktiivinen === */

/* C4 -> HPP 2 viivat */
R('<line x1="446" y1="232" x2="466" y2="232" stroke={pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="446" y1="232" x2="466" y2="232" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');
R('<line x1="466" y1="232" x2="466" y2="252" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="466" y1="232" x2="466" y2="252" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');
R('<line x1="466" y1="252" x2="500" y2="252" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="466" y1="252" x2="500" y2="252" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');

/* C4 virtausanimaatio: vain kun train2 aktiivinen */
R('{producing && <line x1="448" y1="232" x2="464" y2="232" stroke="#bfe6ff" strokeWidth="1.8" strokeDasharray="10 18" className="lfc-flow" />}',
  '{producing && train2Active && <line x1="448" y1="232" x2="464" y2="232" stroke="#bfe6ff" strokeWidth="1.8" strokeDasharray="10 18" className="lfc-flow" />}');
R('{producing && <line x1="466" y1="254" x2="498" y2="254" stroke="#bfe6ff" strokeWidth="1.8" strokeDasharray="10 18" className="lfc-flow" />}',
  '{producing && train2Active && <line x1="466" y1="254" x2="498" y2="254" stroke="#bfe6ff" strokeWidth="1.8" strokeDasharray="10 18" className="lfc-flow" />}');

/* HPP 2: ulkonako ja pyorinta */
R('<rect x="532" y="240" width="35" height="24" rx="7" fill="url(#boxG)" stroke={producing ? \'#4aa3e0\' : \'#3f5a7d\'} strokeWidth="1.4" />',
  '<rect x="532" y="240" width="35" height="24" rx="7" fill="url(#boxG)" stroke={producing && train2Active ? \'#4aa3e0\' : \'#3f5a7d\'} strokeWidth="1.4" opacity={t2dim} />');
R("<g className={producing ? 'lfc-spin' : ''} style={{ transformOrigin: '560px 252px' }}>",
  "<g className={producing && train2Active ? 'lfc-spin' : ''} style={{ transformOrigin: '560px 252px', opacity: t2dim }}>");

/* HPP 2 ulosviivat */
R('<line x1="567" y1="252" x2="640" y2="252" stroke={pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="567" y1="252" x2="640" y2="252" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');
R('<line x1="640" y1="252" x2="640" y2="282" stroke={pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="640" y1="252" x2="640" y2="282" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');

/* iSave 2 ulkoasu */
R('<rect x="545" y="282" width="51" height="30" rx="12" fill="url(#boxG)" stroke={producing ? \'#7fd8f2\' : \'#3f5a7d\'} strokeWidth="1.4" />',
  '<rect x="545" y="282" width="51" height="30" rx="12" fill="url(#boxG)" stroke={producing && train2Active ? \'#7fd8f2\' : \'#3f5a7d\'} strokeWidth="1.4" opacity={t2dim} />');
R("<g className={producing ? 'lfc-spin' : ''} style={{ transformOrigin: '570px 297px' }}>",
  "<g className={producing && train2Active ? 'lfc-spin' : ''} style={{ transformOrigin: '570px 297px', opacity: t2dim }}>");

/* iSave 2 HP-ulos */
R('<line x1="596" y1="304" x2="640" y2="304" stroke={pipe} strokeWidth="5" strokeLinecap="square" />',
  '<line x1="596" y1="304" x2="640" y2="304" stroke={t2pipe} strokeWidth="5" strokeLinecap="square" />');
R('<line x1="640" y1="304" x2="640" y2="282" stroke={pipe} strokeWidth="5" strokeLinecap="square" />',
  '<line x1="640" y1="304" x2="640" y2="282" stroke={t2pipe} strokeWidth="5" strokeLinecap="square" />');

/* Stack 2 syottoviiva */
R('<line x1="640" y1="282" x2="668" y2="282" stroke={pipe} strokeWidth="6" strokeLinecap="square" />',
  '<line x1="640" y1="282" x2="668" y2="282" stroke={t2pipe} strokeWidth="6" strokeLinecap="square" />');
R('<polygon points="668,282 660,278 660,286" fill={pipe} />',
  '<polygon points="668,282 660,278 660,286" fill={t2pipe} />');

/* T-piste */
R('<circle cx="640" cy="282" r="4" fill="#63b8ec" opacity={producing ? 0.9 : 0.4} />',
  '<circle cx="640" cy="282" r="4" fill={train2Active ? "#63b8ec" : "#5a6478"} opacity={producing && train2Active ? 0.9 : 0.4} />');

/* HPP 2 ja iSave 2 tekstit: lisaa STANDBY */
R('<text x="517" y="230" textAnchor="middle" fontSize="8" fill="#a0aec8" letterSpacing="0.3">HPP 2</text>',
  '<text x="517" y="230" textAnchor="middle" fontSize="8" fill={train2Active ? "#a0aec8" : "#5a6478"} letterSpacing="0.3">HPP 2{!train2Active && \' · STANDBY\'}</text>');
R('<text x="570" y="330" textAnchor="middle" fontSize="8" fill="#a0aec8" letterSpacing="0.3">iSAVE 2</text>',
  '<text x="570" y="330" textAnchor="middle" fontSize="8" fill={train2Active ? "#a0aec8" : "#5a6478"} letterSpacing="0.3">iSAVE 2{!train2Active && \' · STANDBY\'}</text>');

/* Linja 2 flow-animaatiot: vain kun aktiivinen */
R(`    {producing && (
      <g stroke="#c9f0fc" strokeWidth="1.2" strokeDasharray="8 16" className="lfc-flow">
        <line x1="569" y1="252" x2="638" y2="252" />
        <line x1="598" y1="304" x2="638" y2="304" />
        {/* LP-feed iSaveen */}
        <line x1="480" y1="297" x2="543" y2="297" stroke="#7fc8e8" />
      </g>
    )}`,
`    {producing && train2Active && (
      <g stroke="#c9f0fc" strokeWidth="1.2" strokeDasharray="8 16" className="lfc-flow">
        <line x1="569" y1="252" x2="638" y2="252" />
        <line x1="598" y1="304" x2="638" y2="304" />
        {/* LP-feed iSaveen */}
        <line x1="480" y1="297" x2="543" y2="297" stroke="#7fc8e8" />
      </g>
    )}`);

/* Stack 2 ulos: himmenna permeaatti */
R('<line x1="818" y1={ry + 46} x2="866" y2={ry + 46} stroke={permPipe} strokeWidth="4.5" strokeLinecap="square" />',
  '<line x1="818" y1={ry + 46} x2="866" y2={ry + 46} stroke={ry > 200 && !train2Active ? \'#3a5a70\' : permPipe} strokeWidth="4.5" strokeLinecap="square" />');

/* Stack 2 nimi: lisaa STANDBY */
R('fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">RO STACK {li + 1}</text>',
  'fontWeight="700" fill={li === 1 && !train2Active ? \'#5a6478\' : \'#e2e8f0\'} letterSpacing="0.5">RO STACK {li + 1}{li === 1 && !train2Active && \' · STANDBY\'}</text>');

/* Permeaatti flow: stack 2 vain kun aktiivinen */
R('<line x1="820" y1="282" x2="864" y2="282" />',
  '{train2Active && <line x1="820" y1="282" x2="864" y2="282" />}');

/* NaOH 2 + sekoitin 2: himmenna kun standby */
R('<rect x="826" y="272" width="20" height="20" rx="4" fill="url(#boxG)" stroke={producing ? \'#7fd8f2\' : \'#3f5a7d\'} strokeWidth="1.4" />',
  '<rect x="826" y="272" width="20" height="20" rx="4" fill="url(#boxG)" stroke={producing && train2Active ? \'#7fd8f2\' : \'#3f5a7d\'} strokeWidth="1.4" opacity={train2Active ? 1 : 0.3} />');

fs.writeFileSync('src/components/ProcessView.tsx', s);
console.log('kapasiteettiperusteinen linjavaihto,', n, 'korvausta');
