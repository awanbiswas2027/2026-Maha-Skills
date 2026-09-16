import { describe, it, expect } from 'vitest';
import { factorRows, FactorInput } from '../factors';

describe('factor breakdown logic', () => {
  const sampleFactors: FactorInput[] = [
    { factor: 'aptitude', label: 'Aptitude Match', contribution: 27, weight: 30 },
    { factor: 'interest', label: 'Interest Alignment', contribution: 18, weight: 20 },
    { factor: 'location', label: 'District Proximity', contribution: 15, weight: 20 },
    { factor: 'demand', label: 'Market Demand', contribution: 10, weight: 15 },
    { factor: 'capacity', label: 'ITI Capacity', contribution: 12, weight: 15 },
  ];

  it('computes ratio for each row and total row', () => {
    const result = factorRows(sampleFactors);

    expect(result.rows).toHaveLength(5);
    expect(result.rows[0].ratio).toBeCloseTo(27 / 30, 4);
    expect(result.rows[1].ratio).toBeCloseTo(18 / 20, 4);

    // Sum of contributions: 27 + 18 + 15 + 10 + 12 = 82
    // Sum of weights: 30 + 20 + 20 + 15 + 15 = 100
    expect(result.total.contribution).toBe(82);
    expect(result.total.weight).toBe(100);
    expect(result.total.ratio).toBeCloseTo(0.82, 4);
    expect(result.total.label).toBe('Total');
  });

  it('handles zero weight without division by zero', () => {
    const factors: FactorInput[] = [
      { factor: 'zero_weight', label: 'Zero Weight', contribution: 0, weight: 0 },
    ];
    const result = factorRows(factors);
    expect(result.rows[0].ratio).toBe(0);
    expect(result.total.ratio).toBe(0);
  });

  it('passes when reportedTotal equals contributions sum', () => {
    expect(() => factorRows(sampleFactors, 82)).not.toThrow();
  });

  it('throws in dev/test when reportedTotal differs from contributions sum', () => {
    // Reported total is 90, but actual sum is 82
    expect(() => factorRows(sampleFactors, 90)).toThrow(
      /contributions sum \(82\) does not match reported total \(90\)/
    );
  });

  it('supports configuration object input with total', () => {
    const result = factorRows({
      factors: sampleFactors,
      total: 82,
    });
    expect(result.total.contribution).toBe(82);
  });
});
