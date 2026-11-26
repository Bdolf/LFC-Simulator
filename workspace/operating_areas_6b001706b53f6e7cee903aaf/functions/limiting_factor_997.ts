/**
 * Field function for: Limiting factor
 * Field name: Limiting factor
 * Field ID: 6b0017b06645d8f4a4908997
 */

interface Dependencies {
  algaeRisk: string;
  farmDistance: number;
  pollution: string;
  shallowPct: number;
  turbidity: number;
}

export function limiting_factor_997(dep: Dependencies): any {
  // Dominant reason when suitability is low; null when no significant penalty
  const num = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));
  const farmD = num(dep.farmDistance);
  if (farmD !== null && farmD < 500) return "fish farm";
  const shallow = num(dep.shallowPct);
  if (shallow !== null && shallow > 40) return "shallow water";
  if (dep.algaeRisk === "High") return "algae";
  const turb = num(dep.turbidity);
  if (turb !== null && turb > 6) return "turbidity";
  if (dep.pollution === "High") return "pollution";
  return null;
}