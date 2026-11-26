const fs = require('fs');
let s = fs.readFileSync('src/sim/store.ts', 'utf8');
let n = 0;
const R = (a, b) => { if (!s.includes(a)) { console.error('EI:', JSON.stringify(a.slice(0, 70))); process.exit(1); } s = s.split(a).join(b); n++; };

/* 1) fouling: ei enaa passiivista laskua tuotannon ulkopuolella */
R(`    } else {
      fouling = Math.max(0, fouling - (0.4 * dtS) / 3600);
      tankLevel = Math.max(0, tankLevel - (0.8 * dtS) / 3600);
    }`,
`    } else {
      // ei passiivista fouling-laskua — fouling pysyy kunnes CIP pesee sen pois
      tankLevel = Math.max(0, tankLevel - (0.8 * dtS) / 3600);
    }
    // CIP kaynnissa: fouling putoaa nopeasti (~40%/min) kunnes 2-5% tasolla
    if (s.cipRunning && !s.producing) {
      const floor = 2 + Math.sin(t * 0.7) * 1.5; // 0.5-3.5% vaihtelu
      fouling = Math.max(floor, fouling - (40 * dtS) / 60);
    }`);

/* 2) fouling >= 80: lisaa banneri (vain kerran per ylitys) */
R(`  setRecommendation: (r) => set({ pendingRecommendation: r }),`,
`  setRecommendation: (r) => set({ pendingRecommendation: r }),
  foulingAlerted: false,`);

/* 3) rajapintaan foulingAlerted */
R(`  pendingRecommendation: string[] | null;
  lastTickAt: number;`,
`  pendingRecommendation: string[] | null;
  foulingAlerted: boolean;
  lastTickAt: number;`);

fs.writeFileSync('src/sim/store.ts', s);
console.log('fouling-kayttaytyminen muutettu,', n, 'korvausta');
