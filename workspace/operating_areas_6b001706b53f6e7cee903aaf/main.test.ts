import { describe, expect, it } from 'vitest';
import { suitability, limitingFactor } from './functions';

describe('suitability', () => {
  it('clean deep area far from farms scores high', () => {
    const r = suitability({ turbidity: 0.5, algaeRisk: 'Low', pollution: 'Low', salinity: 33, temperature: 9, farmDistance: 5000, shallowPct: 0 });
    expect(r).toBeGreaterThanOrEqual(95);
  });
  it('area within 500 m of a fish farm is capped unfavorable', () => {
    const r = suitability({ turbidity: 0.5, algaeRisk: 'Low', pollution: 'Low', salinity: 33, temperature: 9, farmDistance: 300, shallowPct: 0 });
    expect(r).toBeLessThanOrEqual(34);
    expect(r).toBeLessThan(40);
  });
  it('shallow-dominated area (>40% under 10 m) is capped unfavorable', () => {
    const r = suitability({ turbidity: 1, algaeRisk: 'Low', pollution: 'Low', salinity: 33, temperature: 9, farmDistance: 5000, shallowPct: 70 });
    expect(r).toBeLessThanOrEqual(34);
  });
  it('high algae and turbidity drag the score but keep >= 40 when alone', () => {
    const r = suitability({ turbidity: 4, algaeRisk: 'Medium', pollution: 'Low', salinity: 33, temperature: 9, farmDistance: 5000, shallowPct: 10 });
    expect(r).toBeGreaterThanOrEqual(40);
    expect(r).toBeLessThan(90);
  });
  it('null inputs do not throw and do not cap the score', () => {
    const r = suitability({ turbidity: null, algaeRisk: null, pollution: undefined, salinity: null, temperature: null, farmDistance: null, shallowPct: null });
    expect(typeof r).toBe('number');
    expect(r).toBe(100);
  });
});

describe('limitingFactor', () => {
  it('names the fish farm when within 500 m', () => {
    expect(limitingFactor({ farmDistance: 250, shallowPct: 80, algaeRisk: 'High', turbidity: 9, pollution: 'Low' })).toBe('fish farm');
  });
  it('names shallow water next', () => {
    expect(limitingFactor({ farmDistance: 900, shallowPct: 55, algaeRisk: 'Low', turbidity: 1, pollution: 'Low' })).toBe('shallow water');
  });
  it('names algae, turbidity and pollution in order', () => {
    expect(limitingFactor({ farmDistance: 900, shallowPct: 5, algaeRisk: 'High', turbidity: 1, pollution: 'Low' })).toBe('algae');
    expect(limitingFactor({ farmDistance: 900, shallowPct: 5, algaeRisk: 'Low', turbidity: 8, pollution: 'Low' })).toBe('turbidity');
    expect(limitingFactor({ farmDistance: 900, shallowPct: 5, algaeRisk: 'Low', turbidity: 1, pollution: 'High' })).toBe('pollution');
  });
  it('returns null when nothing penalises', () => {
    expect(limitingFactor({ farmDistance: 2000, shallowPct: 5, algaeRisk: 'Low', turbidity: 1, pollution: 'Low' })).toBeNull();
  });
});
