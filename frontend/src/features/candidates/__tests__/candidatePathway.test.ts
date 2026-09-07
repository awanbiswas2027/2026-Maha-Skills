import { describe, it, expect } from 'vitest';
import { calculateRecommendations, MOCK_COURSES } from '../candidateData';
import { PathwayQuizAnswers } from '../../../types/api';

describe('PathwayQuiz Recommendation Algorithm (TEST-CAN-002 / REQ-CAN-02)', () => {
  it('should return exactly top 3 recommended vocational courses', () => {
    const answers: PathwayQuizAnswers = {
      education: '10TH',
      interest: 'AUTOMOTIVE_EV',
      workEnvironment: 'SMART_FACTORY',
      districtPreference: 'PUNE_NASHIK_HUB',
      durationPreference: 'SHORT_12M',
    };

    const recommendations = calculateRecommendations(answers, MOCK_COURSES);

    expect(recommendations).toHaveLength(3);
    // Highest match should be EV or CNC Precision
    expect(recommendations[0].matchScore).toBeGreaterThanOrEqual(recommendations[1].matchScore);
    expect(recommendations[1].matchScore).toBeGreaterThanOrEqual(recommendations[2].matchScore);
    expect(recommendations[0].course.course_code).toBe('AUT-003');
  });

  it('should prioritize electrical and solar courses when candidate selects electrical interest', () => {
    const answers: PathwayQuizAnswers = {
      education: '10TH',
      interest: 'ELECTRICAL_ENERGY',
      workEnvironment: 'OUTDOOR_FIELD',
      districtPreference: 'HOME_DISTRICT',
      durationPreference: 'FLEXIBLE',
    };

    const recommendations = calculateRecommendations(answers, MOCK_COURSES);

    expect(recommendations).toHaveLength(3);
    const codes = recommendations.map(r => r.course.course_code);
    expect(codes).toContain('ELE-001');
    expect(recommendations[0].matchScore).toBeGreaterThanOrEqual(70);
  });

  it('should properly penalize courses when candidate is only 8th pass and trade requires 10th', () => {
    const answers: PathwayQuizAnswers = {
      education: '8TH',
      interest: 'PRECISION_MACHINES',
      workEnvironment: 'HANDS_ON_WORKSHOP',
      districtPreference: 'HOME_DISTRICT',
      durationPreference: 'SHORT_12M',
    };

    const recommendations = calculateRecommendations(answers, MOCK_COURSES);

    expect(recommendations).toHaveLength(3);
    // Welder (WLD-006) accepts 8th pass and should be boosted
    expect(recommendations[0].course.course_code).toBe('WLD-006');
    expect(recommendations[0].highlight_traits).toContain('8th Pass Eligible');
  });

  it('should provide trilingual personalized rationales', () => {
    const answers: PathwayQuizAnswers = {
      education: '10TH',
      interest: 'COMPUTERS_DIGITAL',
      workEnvironment: 'INDOOR_OFFICE',
      districtPreference: 'PUNE_NASHIK_HUB',
      durationPreference: 'SHORT_12M',
    };

    const recommendations = calculateRecommendations(answers, MOCK_COURSES);

    recommendations.forEach(rec => {
      expect(rec.rationale_en).toBeDefined();
      expect(rec.rationale_en.length).toBeGreaterThan(10);
      expect(rec.rationale_mr).toBeDefined();
      expect(rec.rationale_mr.length).toBeGreaterThan(10);
      expect(rec.rationale_hi).toBeDefined();
      expect(rec.rationale_hi.length).toBeGreaterThan(10);
    });
  });
});
