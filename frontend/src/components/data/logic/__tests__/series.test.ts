import { describe, it, expect } from 'vitest';
import {
  MAX_SERIES,
  assignSeriesColors,
  splitPartialSegments,
  forecastBands,
} from '../series';

describe('series logic', () => {
  it('defines MAX_SERIES as 6', () => {
    expect(MAX_SERIES).toBe(6);
  });

  describe('assignSeriesColors', () => {
    it('assigns tokens chart-1..6 in order without collision', () => {
      const keys = ['distA', 'distB', 'distC'];
      const result = assignSeriesColors(keys);

      expect(result.distA.token).toBe('chart-1');
      expect(result.distA.dashed).toBe(false);

      expect(result.distB.token).toBe('chart-2');
      expect(result.distB.dashed).toBe(false);

      expect(result.distC.token).toBe('chart-3');
      expect(result.distC.dashed).toBe(false);
    });

    it('assigns focal key to chart-1 and benchmarks to chart-6 with dashed stroke', () => {
      const keys = ['peer1', 'myDistrict', 'peer2', 'stateAverage'];
      const result = assignSeriesColors(keys, {
        focalKey: 'myDistrict',
        benchmarkKeys: ['stateAverage'],
      });

      // Focal entity must be chart-1
      expect(result.myDistrict.token).toBe('chart-1');
      expect(result.myDistrict.dashed).toBe(false);

      // Benchmark entity must be chart-6 with dashed stroke
      expect(result.stateAverage.token).toBe('chart-6');
      expect(result.stateAverage.dashed).toBe(true);

      // Remaining keys get remaining tokens
      expect(result.peer1.token).toBe('chart-2');
      expect(result.peer1.dashed).toBe(false);

      expect(result.peer2.token).toBe('chart-3');
      expect(result.peer2.dashed).toBe(false);
    });

    it('throws in dev/test when series count exceeds MAX_SERIES (6)', () => {
      const keys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];
      expect(() => assignSeriesColors(keys)).toThrow(
        /Cannot display more than 6 series/
      );
    });
  });

  describe('splitPartialSegments', () => {
    it('returns empty segments for empty array', () => {
      const result = splitPartialSegments([], () => false);
      expect(result.complete).toEqual([]);
      expect(result.partial).toEqual([]);
    });

    it('returns all complete points when none are partial', () => {
      const points = [{ x: 1, p: false }, { x: 2, p: false }];
      const result = splitPartialSegments(points, (pt) => pt.p);

      expect(result.complete).toEqual(points);
      expect(result.partial).toEqual([]);
    });

    it('returns all partial points when all are partial', () => {
      const points = [{ x: 1, p: true }, { x: 2, p: true }];
      const result = splitPartialSegments(points, (pt) => pt.p);

      expect(result.complete).toEqual([]);
      expect(result.partial).toEqual(points);
    });

    it('connects partial segment smoothly to preceding complete point (VIZ-19)', () => {
      const p1 = { period: 'Jun 2026', value: 50, isPartial: false };
      const p2 = { period: 'Jul 2026', value: 55, isPartial: false };
      const p3 = { period: 'Aug 2026', value: 60, isPartial: true };
      const p4 = { period: 'Sep 2026', value: 62, isPartial: true };

      const points = [p1, p2, p3, p4];
      const result = splitPartialSegments(points, 'isPartial');

      // Complete line runs from p1 to p2
      expect(result.complete).toEqual([p1, p2]);

      // Partial line connects from p2 to p3 and p4
      expect(result.partial).toEqual([p2, p3, p4]);

      // Array destructuring works as well
      const [complete, partial] = result;
      expect(complete).toEqual([p1, p2]);
      expect(partial).toEqual([p2, p3, p4]);
    });
  });

  describe('forecastBands', () => {
    it('applies default 15% confidence interval for forecast points', () => {
      const points = [
        { period: '2026-06', value: 100, isForecast: false },
        { period: '2026-07', value: 100, isForecast: true },
      ];

      const bands = forecastBands(points);

      // Historical point has no band
      expect(bands[0].lower).toBeNull();
      expect(bands[0].upper).toBeNull();
      expect(bands[0].forecastRange).toBeNull();

      // Forecast point has 15% band (85 to 115)
      expect(bands[1].lower).toBe(85);
      expect(bands[1].upper).toBe(115);
      expect(bands[1].forecastRange).toEqual([85, 115]);
      expect(bands[1].band).toEqual([85, 115]);
    });

    it('respects explicit lower and upper bounds if provided', () => {
      const points = [
        { period: '2026-08', value: 80, lower: 72, upper: 88, isForecast: true },
      ];

      const bands = forecastBands(points);
      expect(bands[0].lower).toBe(72);
      expect(bands[0].upper).toBe(88);
      expect(bands[0].forecastRange).toEqual([72, 88]);
    });

    it('handles numeric arrays', () => {
      const bands = forecastBands([50, 100]);
      expect(bands).toHaveLength(2);
      expect(bands[0].value).toBe(50);
      expect(bands[0].lower).toBeNull();
    });
  });
});
