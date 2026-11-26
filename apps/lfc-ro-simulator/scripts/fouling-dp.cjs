const fs = require('fs');
let s = fs.readFileSync('src/sim/store.ts', 'utf8');
let n = 0;
const R = (a, b) => { if (!s.includes(a)) { console.error('EI:', JSON.stringify(a.slice(0, 70))); process.exit(1); } s = s.split(a).join(b); n++; };

/* ================================================================
   1) Storeen: abollDp (AquaBoll delta P) tracked + foulingAlerted
   ================================================================ */
R('  fouling: number;\n  volume: number;',
  '  fouling: number;\n  abollDp: number;\n  volume: number;');

R('  pendingRecommendation: string[] | null;\n  lastTickAt: number;',
  '  pendingRecommendation: string[] | null;\n  foulingAlerted: boolean;\n  lastTickAt: number;');

R('  fouling: 8,\n  volume: 0,',
  '  fouling: 8,\n  abollDp: 0.2,\n  volume: 0,');

R('  pendingRecommendation: null,\n  lastTickAt: Date.now(),',
  '  pendingRecommendation: null,\n  foulingAlerted: false,\n  lastTickAt: Date.now(),');

/* ================================================================
   2) Tick: fouling + abollDp kuntoon
   ================================================================ */
R(`    if (s.producing) {
      const rate = foulingRatePerHour(ev, cap);
      fouling = Math.min(100, fouling + (rate * dtS) / 3600);
      volume = volume + (cap * dtS) / 3600;
      tankLevel = Math.min(100, tankLevel + (cap / 500) * dtS / 60);
    } else {
      fouling = Math.max(0, fouling - (0.4 * dtS) / 3600);
      tankLevel = Math.max(0, tankLevel - (0.8 * dtS) / 3600);
    }`,
`    if (s.producing) {
      // AquaBoll dp nousee veden laadun mukaan (0.03-0.12 bar/h)
      const dpRate = ev.status === 'farm' ? 0.12 : ev.status === 'shallow' ? 0.08 : ev.status === 'caution' ? 0.05 : 0.03;
      abollDp = Math.min(1.2, abollDp + (dpRate * dtS) / 3600 * (cap / 120));
      // fouling: perusnopeus x delta P -kerroin (korkea dp nopeuttaa)
      const dpMultiplier = abollDp > 0.6 ? 1.5 : abollDp > 0.4 ? 1.2 : 1.0;
      const rate = foulingRatePerHour(ev, cap) * dpMultiplier;
      fouling = Math.min(100, fouling + (rate * dtS) / 3600);
      volume = volume + (cap * dtS) / 3600;
      tankLevel = Math.min(100, tankLevel + (cap / 500) * dtS / 60);
      // fouling >= 80: lisaa CIP-suositus-banneri (vain kerran)
      if (fouling >= 80 && !get().foulingAlerted) {
        set({ foulingAlerted: true });
        get().pushBanner({
          id: 'fouling-80',
          type: 'Fouling factor',
          severity: 'Critical',
          message: 'Fouling factor reached 80%. Stop production and run CIP flush to reset.',
        });
      }
    } else {
      // ei passiivista fouling-laskua — fouling pysyy kunnes CIP pesee sen pois
      tankLevel = Math.max(0, tankLevel - (0.8 * dtS) / 3600);
    }
    // CIP kaynnissa (ei tuotantoa): fouling ja abollDp putoavat nopeasti
    if (s.cipRunning && !s.producing) {
      const floor = 2 + Math.sin(Date.now() / 900) * 1.5; // 0.5-3.5% vaihtelu
      fouling = Math.max(floor, fouling - (40 * dtS) / 60);
      abollDp = Math.max(0.15, abollDp - (0.3 * dtS) / 60);
      // nollaa alert kun fouling taas matala
      if (fouling < 50 && get().foulingAlerted) {
        set({ foulingAlerted: false });
      }
    }`);

/* ================================================================
   3) abollDp patchiin
   ================================================================ */
R('    patch.fouling = fouling;\n    patch.volume = volume;',
  '    patch.fouling = fouling;\n    patch.abollDp = abollDp;\n    patch.volume = volume;');

/* ================================================================
   4) tagien AT501 jne. — lisaa abollDp
   ================================================================ */
// ei tarvi muuttaa — abollDp on suoraan storesta

/* ================================================================
   5) rajapintaan abollDp
   ================================================================ */
R('  fouling: number;\n  abollDp: number;\n  volume: number;\n  naohLiters',
  '  fouling: number;\n  abollDp: number;\n  volume: number;\n  naohLiters');

fs.writeFileSync('src/sim/store.ts', s);
console.log('fouling + abollDp logiikka,', n, 'korvausta');
