/**
 * Field function for: Maintenance recommendation
 * Field name: Maintenance recommendation
 * Field ID: 6b0017b06645d8f4a490899d
 */

interface Dependencies {
  algaeRisk: string | null;
  farmDistance: number | null;
  shallowPct: number | null;
  turbidity: number | null;
  volume: number;
}

export function maintenance_recommendation_99d(dep: Dependencies): any {
  // Rule table: farm proximity -> CIP + extended flush; shallows -> prefilter + flush; algae -> CIP; heavy volume escalates
  const num = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));
  const farmD = num(dep.farmDistance);
  const shallow = num(dep.shallowPct);
  const turb = num(dep.turbidity);
  const volume = num(dep.volume);
  const acts = [];
  if (farmD !== null && farmD < 500) {
    acts.push("CIP flush");
    acts.push("Extended freshwater flush");
  }
  if (shallow !== null && shallow > 40) {
    acts.push("Extended freshwater flush");
    acts.push("Prefilter change");
  }
  if (dep.algaeRisk === "High") acts.push("CIP flush");
  if (turb !== null && turb > 5) acts.push("Prefilter change");
  if (volume !== null && volume > 1500 && acts.length > 0) acts.push("Membrane inspection");
  // dedupe preserving order
  const seen = {};
  const out = [];
  for (let i = 0; i < acts.length; i++) {
    if (!seen[acts[i]]) {
      seen[acts[i]] = 1;
      out.push(acts[i]);
    }
  }
  if (out.length === 0) return "Normal stop";
  return out.join(" + ");
}