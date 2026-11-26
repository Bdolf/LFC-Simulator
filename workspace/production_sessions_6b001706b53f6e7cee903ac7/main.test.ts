import { describe, expect, it } from 'vitest';
import { foulingRisk, maintenanceRecommendation } from './functions';

describe('foulingRisk', () => {
  it('clean area with small volume stays low', () => {
    const r = foulingRisk({ volume: 200, capacity: 100, turbidity: 0.5, algaeRisk: 'Low', farmDistance: 5000, shallowPct: 0 });
    expect(r).toBeLessThan(15);
  });
  it('fish-farm area with big volume is critical', () => {
    const r = foulingRisk({ volume: 2000, capacity: 150, turbidity: 3, algaeRisk: 'High', farmDistance: 200, shallowPct: 10 });
    expect(r).toBeGreaterThanOrEqual(75);
    expect(r).toBeLessThanOrEqual(100);
  });
  it('exposure grows with volume but is capped', () => {
    const a = foulingRisk({ volume: 500, capacity: 100, turbidity: 2, algaeRisk: 'Low', farmDistance: 5000, shallowPct: 0 });
    const b = foulingRisk({ volume: 5000, capacity: 100, turbidity: 2, algaeRisk: 'Low', farmDistance: 5000, shallowPct: 0 });
    expect(b).toBeGreaterThan(a);
    const c = foulingRisk({ volume: 50000, capacity: 100, turbidity: 2, algaeRisk: 'Low', farmDistance: 5000, shallowPct: 0 });
    expect(c).toBeLessThanOrEqual(100);
  });
  it('null inputs give the base value without throwing', () => {
    const r = foulingRisk({ volume: null, capacity: null, turbidity: null, algaeRisk: null, farmDistance: null, shallowPct: null });
    expect(r).toBe(5);
  });
});

describe('maintenanceRecommendation', () => {
  it('fish farm proximity recommends CIP + extended flush', () => {
    const r = maintenanceRecommendation({ volume: 800, turbidity: 1, algaeRisk: 'Low', farmDistance: 300, shallowPct: 0 });
    expect(r).toBe('CIP flush + Extended freshwater flush');
  });
  it('shallow area recommends flush + prefilter', () => {
    const r = maintenanceRecommendation({ volume: 800, turbidity: 2, algaeRisk: 'Low', farmDistance: 2000, shallowPct: 60 });
    expect(r).toBe('Extended freshwater flush + Prefilter change');
  });
  it('big volume in bad water escalates to membrane inspection', () => {
    const r = maintenanceRecommendation({ volume: 2000, turbidity: 1, algaeRisk: 'Low', farmDistance: 300, shallowPct: 0 });
    expect(r).toContain('Membrane inspection');
  });
  it('clean area recommends a normal stop', () => {
    const r = maintenanceRecommendation({ volume: 300, turbidity: 0.5, algaeRisk: 'Low', farmDistance: 5000, shallowPct: 0 });
    expect(r).toBe('Normal stop');
  });
  it('null inputs do not throw', () => {
    const r = maintenanceRecommendation({ volume: null, turbidity: null, algaeRisk: null, farmDistance: null, shallowPct: null });
    expect(r).toBe('Normal stop');
  });
});
