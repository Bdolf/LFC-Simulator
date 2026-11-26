/**
 * Field function for: Fouling risk (0–100)
 * Field name: Fouling risk (0–100)
 * Field ID: 6b0017b06645d8f4a490899a
 */

interface Dependencies {
  algaeRisk: string | null;
  capacity: number;
  farmDistance: number | null;
  shallowPct: number | null;
  turbidity: number | null;
  volume: number;
}

export function fouling_risk_0100_99a(dep: Dependencies): any {
  // Fouling risk 0-100 from area water quality × exposure (produced volume)
  const num = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));
  const turb = num(dep.turbidity);
  const farmD = num(dep.farmDistance);
  const shallow = num(dep.shallowPct);
  const volume = num(dep.volume);
  let base = 5;
  if (turb !== null && turb > 1) base += Math.min(30, (turb - 1) * 3);
  if (dep.algaeRisk === "High") base += 25;
  else if (dep.algaeRisk === "Medium") base += 10;
  if (farmD !== null && farmD < 500) base += 35;
  if (shallow !== null && shallow > 40) base += 20;
  let exposure = 1;
  if (volume !== null) exposure = 1 + Math.min(0.5, volume / 4000);
  const risk = Math.round(base * exposure);
  if (risk < 0) return 0;
  if (risk > 100) return 100;
  return risk;
}