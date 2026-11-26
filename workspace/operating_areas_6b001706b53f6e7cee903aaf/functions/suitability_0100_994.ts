/**
 * Field function for: Suitability (0–100)
 * Field name: Suitability (0–100)
 * Field ID: 6b0017b06645d8f4a4908994
 */

interface Dependencies {
  algaeRisk: string;
  farmDistance: number;
  pollution: string;
  salinity: number;
  shallowPct: number;
  temperature: number;
  turbidity: number;
}

export function suitability_0100_994(dep: Dependencies): any {
  // Water-production suitability 0-100; hard penalties for fish-farm proximity (<500 m) and shallows (>40% <10 m)
  let score = 100;
  const num = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));
  const turb = num(dep.turbidity);
  if (turb !== null && turb > 2) score -= Math.min(35, (turb - 2) * 4);
  if (dep.algaeRisk === "High") score -= 25;
  else if (dep.algaeRisk === "Medium") score -= 10;
  if (dep.pollution === "High") score -= 25;
  else if (dep.pollution === "Medium") score -= 10;
  const sal = num(dep.salinity);
  if (sal !== null && sal < 28) score -= 10;
  if (sal !== null && sal > 36) score -= 5;
  const t = num(dep.temperature);
  if (t !== null && t < 4) score -= 10;
  else if (t !== null && t > 16) score -= 10;
  const farmD = num(dep.farmDistance);
  const shallow = num(dep.shallowPct);
  if (farmD !== null && farmD < 500) score = Math.min(score, 34);
  if (shallow !== null && shallow > 40) score = Math.min(score, 34);
  if (score < 0) score = 0;
  return Math.round(score);
}