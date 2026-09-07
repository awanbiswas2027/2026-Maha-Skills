import { describe, it, expect } from 'vitest';
import { 
  calculateNormalizedGap, 
  isStructurallyOversupplied, 
  getSeverityLevel, 
  MAHARASHTRA_DISTRICTS,
  MOCK_GAP_SCORES,
  MOCK_OVERSUPPLY_ALERTS
} from '../gapScoringData';

describe('Algorithmic Gap Scoring & Oversupply Engine (Slice 4 / TEST-GAP-001, TEST-GAP-002)', () => {
  describe('Gap Score Formula (TEST-GAP-001 / REQ-GAP-01)', () => {
    it('should compute normalized gap score between 0.0 and 100.0', () => {
      // High demand (1200), trend 1.2, trained capacity 400, placement rate 80% (0.80)
      // effective_demand = 1440, effective_supply = 320, raw_gap = 1120
      // normalized = (1120 / 1000) * 100 = 112 -> capped at 100.0
      const gap = calculateNormalizedGap(1200, 1.2, 400, 80, 1000.0);
      expect(gap).toBe(100.0);
    });

    it('should correctly calculate moderate gap score within bounds', () => {
      // Demand 800, trend 1.0, capacity 500, placement 60%
      // effective_demand = 800, effective_supply = 300, raw_gap = 500
      // normalized = (500 / 1000) * 100 = 50.0
      const gap = calculateNormalizedGap(800, 1.0, 500, 60, 1000.0);
      expect(gap).toBe(50.0);
    });

    it('should floor at 0.0 when supply exceeds demand', () => {
      // Demand 200, capacity 800, placement 90%
      // raw_gap = 200 - 720 = -520 -> floored at 0.0
      const gap = calculateNormalizedGap(200, 1.0, 800, 90, 1000.0);
      expect(gap).toBe(0.0);
    });

    it('should assign correct severity levels', () => {
      expect(getSeverityLevel(85.0)).toBe('CRITICAL');
      expect(getSeverityLevel(75.0)).toBe('CRITICAL');
      expect(getSeverityLevel(68.5)).toBe('HIGH');
      expect(getSeverityLevel(60.0)).toBe('HIGH');
      expect(getSeverityLevel(48.0)).toBe('MODERATE');
      expect(getSeverityLevel(40.0)).toBe('MODERATE');
      expect(getSeverityLevel(25.0)).toBe('LOW');
      expect(getSeverityLevel(0.0)).toBe('LOW');
    });
  });

  describe('Structural Oversupply Heuristic (TEST-GAP-002 / REQ-GAP-02)', () => {
    it('should trigger oversupply alert when placement < 25% and demand < 20th percentile for >= 2 quarters', () => {
      const isOversupplied = isStructurallyOversupplied(18.5, 12, 3);
      expect(isOversupplied).toBe(true);
    });

    it('should not flag oversupply when placement rate is >= 25%', () => {
      const isOversupplied = isStructurallyOversupplied(28.0, 10, 2);
      expect(isOversupplied).toBe(false);
    });

    it('should not flag oversupply when demand is >= 20th percentile', () => {
      const isOversupplied = isStructurallyOversupplied(20.0, 25, 2);
      expect(isOversupplied).toBe(false);
    });

    it('should not flag oversupply if consecutive quarters is less than 2', () => {
      const isOversupplied = isStructurallyOversupplied(15.0, 10, 1);
      expect(isOversupplied).toBe(false);
    });
  });

  describe('Maharashtra 36 Districts Data Integrity', () => {
    it('should contain all 36 administrative districts of Maharashtra', () => {
      expect(MAHARASHTRA_DISTRICTS).toHaveLength(36);
    });

    it('should cover all 6 administrative divisions', () => {
      const divisions = new Set(MAHARASHTRA_DISTRICTS.map(d => d.division));
      expect(divisions.size).toBe(6);
      expect(divisions).toContain('Konkan');
      expect(divisions).toContain('Pune');
      expect(divisions).toContain('Nashik');
      expect(divisions).toContain('Chhatrapati Sambhajinagar');
      expect(divisions).toContain('Nagpur');
      expect(divisions).toContain('Amravati');
    });

    it('should have complete trilingual names for all districts', () => {
      MAHARASHTRA_DISTRICTS.forEach(d => {
        expect(d.name_en).toBeTruthy();
        expect(d.name_mr).toBeTruthy();
        expect(d.name_hi).toBeTruthy();
        expect(d.code).toHaveLength(3);
        expect(d.total_vacancies).toBeGreaterThan(0);
        expect(d.total_capacity).toBeGreaterThan(0);
      });
    });

    it('should validate mock gap scores have valid references', () => {
      expect(MOCK_GAP_SCORES.length).toBeGreaterThan(0);
      MOCK_GAP_SCORES.forEach(item => {
        expect(item.gap_score).toBeGreaterThanOrEqual(0);
        expect(item.gap_score).toBeLessThanOrEqual(100);
        expect(item.qp_code).toMatch(/^[A-Z]{3}\/Q\d{4}$/);
      });
    });

    it('should validate mock oversupply alerts meet the criteria', () => {
      expect(MOCK_OVERSUPPLY_ALERTS.length).toBeGreaterThan(0);
      MOCK_OVERSUPPLY_ALERTS.forEach(alert => {
        expect(alert.placement_rate).toBeLessThan(25);
        expect(alert.local_demand_percentile).toBeLessThan(20);
        expect(alert.consecutive_quarters).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
