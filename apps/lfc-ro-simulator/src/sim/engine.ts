/**
 * Simulaatiomoottori: pistekohtainen arviointi (häkki/matalikko) ja
 * prosessiarvojen mallinnus. Sama sääntölogiikka kuin työtilan funktiokentissä.
 */
import { DEPTH, FARMS, ROUTE, FARM_RADIUS_M, SHALLOW_LIMIT_M, Farm } from './data';

const R = 6371000;

export function distM(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Lähin GEBCO-syvysnäyte metreinä (null = maa). */
export function depthAt(lat: number, lon: number): number | null {
  let best: number | null = null;
  let bd = Infinity;
  for (let i = 0; i < DEPTH.rows; i++) {
    const dLat = Math.abs(DEPTH.lat0 + i * DEPTH.dlat - lat) * 111320;
    if (dLat > 3000) continue;
    for (let j = 0; j < DEPTH.cols; j++) {
      const dLon = Math.abs(DEPTH.lon0 + j * DEPTH.dlon - lon) * 55000;
      if (dLon > 3000) continue;
      const v = DEPTH.values[i * DEPTH.cols + j];
      if (v === 32767) continue;
      const d = dLat * dLat + dLon * dLon;
      if (d < bd) {
        bd = d;
        best = v / 10;
      }
    }
  }
  return best;
}

export interface NearestFarm { farm: Farm; distM: number; }

export function nearestFarm(lat: number, lon: number): NearestFarm | null {
  let best: NearestFarm | null = null;
  for (const f of FARMS) {
    const d = distM(lat, lon, f.lat, f.lon);
    if (!best || d < best.distM) best = { farm: f, distM: d };
  }
  return best;
}

export type PointStatus = 'good' | 'caution' | 'farm' | 'shallow';

export interface PointEval {
  status: PointStatus;
  depth: number | null;
  farm: NearestFarm | null;
  inFarmZone: boolean;
  inShallow: boolean;
  reasons: string[];
}

/** Pistekohtainen sopivuusarvio (samat 500 m / 10 m säännöt kuin työtilassa). */
export function evaluatePoint(lat: number, lon: number): PointEval {
  const depth = depthAt(lat, lon);
  const farm = nearestFarm(lat, lon);
  const inFarmZone = !!farm && farm.distM < FARM_RADIUS_M;
  const inShallow = depth !== null && depth < SHALLOW_LIMIT_M && depth > 0;
  const reasons: string[] = [];
  if (inFarmZone && farm) reasons.push(`Fish farm ${farm.farm.name} ${Math.round(farm.distM)} m away (zone ${FARM_RADIUS_M} m)`);
  if (inShallow && depth !== null) reasons.push(`Depth ${depth.toFixed(1)} m < ${SHALLOW_LIMIT_M} m (shallows)`);
  let status: PointStatus = 'good';
  if (inFarmZone) status = 'farm';
  else if (inShallow) status = 'shallow';
  else if (farm && farm.distM < FARM_RADIUS_M * 4) status = 'caution';
  return { status, depth, farm, inFarmZone, inShallow, reasons };
}

export const MAINTENANCE_ACTIONS = [
  'CIP flush',
  'Extended freshwater flush',
  'Prefilter change',
  'Membrane inspection',
  'Normal stop',
] as const;

/** Ennakoivan huollon suositus samalla sääntötaululla kuin funktiokenttä. */
export function recommend(ev: PointEval, volume: number): string[] {
  const acts: string[] = [];
  if (ev.inFarmZone) {
    acts.push('CIP flush');
    acts.push('Extended freshwater flush');
  }
  if (ev.inShallow) {
    acts.push('Extended freshwater flush');
    acts.push('Prefilter change');
  }
  if (volume > 1500 && acts.length > 0) acts.push('Membrane inspection');
  if (acts.length === 0) acts.push('Normal stop');
  return [...new Set(acts)];
}

/** Likaantumisnopeus (%/h) alueen mukaan. */
export function foulingRatePerHour(ev: PointEval, capacity: number): number {
  let rate = 2;
  if (ev.status === 'caution') rate = 5;
  if (ev.status === 'shallow') rate = 9;
  if (ev.status === 'farm') rate = 12;
  return rate * (capacity / 120);
}

/** Reittisimulaatio: kolmen häkin kolmio, nopeus solmuina. */
export function routeStep(lat: number, lon: number, targetIdx: number, speedKn: number, dtS: number): { lat: number; lon: number; targetIdx: number } {
  const target = ROUTE[targetIdx % ROUTE.length];
  const d = distM(lat, lon, target.lat, target.lon);
  const stepM = speedKn * 0.5144 * dtS;
  if (d < Math.max(400, stepM)) {
    return { lat, lon, targetIdx: (targetIdx + 1) % ROUTE.length };
  }
  const f = stepM / d;
  return {
    lat: lat + (target.lat - lat) * f,
    lon: lon + (target.lon - lon) * f,
    targetIdx,
  };
}

export const ROUTE_WAYPOINTS = ROUTE;
