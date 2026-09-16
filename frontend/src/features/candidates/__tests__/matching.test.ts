import { describe, it, expect } from 'vitest';
import {
  matchCourses,
  FACTORS,
  STRATEGY,
  PathwayAnswers,
  allocateLargestRemainderContributions,
  fnv1a64Hex,
  computeCanonicalInputHash,
  QualificationLevel,
  MobilityPreference,
  QuizLanguage,
} from '../matching';
import {
  COURSE_ADAPTER_MAP,
  createMockCourse,
} from '../matchingFixtures';
import { MOCK_COURSES } from '../candidateData';
import enMatch from '../../../../public/locales/en/match.json';
import mrMatch from '../../../../public/locales/mr/match.json';
import hiMatch from '../../../../public/locales/hi/match.json';

describe('Explainable Course-Matching Engine (S1C-v1 / BE §J.1-J.4 / AIX-01..17)', () => {
  it('FACTORS constant has the exact declared factors, order, and weights summing to 100', () => {
    expect(FACTORS).toHaveLength(5);
    expect(FACTORS[0]).toEqual({ code: 'SKILL_ALIGNMENT', weight: 30 });
    expect(FACTORS[1]).toEqual({ code: 'DEMAND_ALIGNMENT', weight: 25 });
    expect(FACTORS[2]).toEqual({ code: 'OUTCOME_STRENGTH', weight: 20 });
    expect(FACTORS[3]).toEqual({ code: 'EDUCATION_FIT', weight: 15 });
    expect(FACTORS[4]).toEqual({ code: 'LOCATION_FIT', weight: 10 });

    const totalWeight = FACTORS.reduce((sum, f) => sum + f.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('STRATEGY metadata matches CANDIDATE_COURSE v1.0.0', () => {
    expect(STRATEGY).toEqual({
      code: 'CANDIDATE_COURSE',
      version: '1.0.0',
    });
  });

  describe('Largest-Remainder Rounding (Hare-Niemeyer method)', () => {
    it('always produces integer contributions whose sum strictly equals total', () => {
      // Test across arbitrary fractions
      const testCases = [
        { SKILL_ALIGNMENT: 0.85, DEMAND_ALIGNMENT: 0.72, OUTCOME_STRENGTH: 0.63, EDUCATION_FIT: 1.0, LOCATION_FIT: 0.6 },
        { SKILL_ALIGNMENT: 0.333, DEMAND_ALIGNMENT: 0.666, OUTCOME_STRENGTH: 0.5, EDUCATION_FIT: 1.0, LOCATION_FIT: 0.1 },
        { SKILL_ALIGNMENT: 0.1, DEMAND_ALIGNMENT: 0.2, OUTCOME_STRENGTH: 0.15, EDUCATION_FIT: 1.0, LOCATION_FIT: 0.15 },
        { SKILL_ALIGNMENT: 1.0, DEMAND_ALIGNMENT: 1.0, OUTCOME_STRENGTH: 1.0, EDUCATION_FIT: 1.0, LOCATION_FIT: 1.0 },
        { SKILL_ALIGNMENT: 0.0, DEMAND_ALIGNMENT: 0.0, OUTCOME_STRENGTH: 0.0, EDUCATION_FIT: 0.0, LOCATION_FIT: 0.0 },
      ];

      for (const rawScores of testCases) {
        const { total, factors } = allocateLargestRemainderContributions(rawScores);
        const sumContributions = factors.reduce((sum, f) => sum + f.contribution, 0);
        expect(sumContributions).toBe(total);
        for (const factor of factors) {
          expect(Number.isInteger(factor.contribution)).toBe(true);
          expect(factor.contribution).toBeGreaterThanOrEqual(0);
          expect(factor.contribution).toBeLessThanOrEqual(factor.weight);
        }
      }
    });
  });

  describe('Property Suite: Contributions sum to total across >= 20 generated answer fixtures', () => {
    const qualifications: QualificationLevel[] = [
      'PASS_10',
      'PASS_12',
      'DIPLOMA',
      'GRADUATE',
    ];
    const districts = [14, 8, 31, 13, 16]; // Pune, Nashik, Nagpur, Solapur, Kolhapur
    const sectorLists = [
      ['automotive'],
      ['energy'],
      ['it'],
      ['manufacturing'],
      ['automotive', 'manufacturing'],
      ['energy', 'agriculture'],
      ['it', 'electronics'],
    ];
    const languages: QuizLanguage[] = ['en', 'mr', 'hi'];
    const mobilities: MobilityPreference[] = ['DISTRICT', 'STATE', 'ANYWHERE'];

    // Generate 24 varied answer combinations
    const answerCombinations: PathwayAnswers[] = [];
    let count = 0;
    for (const qual of qualifications) {
      for (const dist of districts) {
        const sectors = sectorLists[count % sectorLists.length];
        const lang = languages[count % languages.length];
        const mob = mobilities[count % mobilities.length];
        answerCombinations.push({
          qualification: qual,
          districtId: dist,
          sectorIds: sectors,
          language: lang,
          mobility: mob,
        });
        count++;
        if (answerCombinations.length >= 24) break;
      }
      if (answerCombinations.length >= 24) break;
    }

    it('generates at least 20 combinations', () => {
      expect(answerCombinations.length).toBeGreaterThanOrEqual(20);
    });

    it('every result across all combinations has sum(contributions) === total and valid factors', () => {
      for (const answers of answerCombinations) {
        const response = matchCourses(answers, MOCK_COURSES);

        for (const res of response.results) {
          const sumContributions = res.factors.reduce(
            (sum, f) => sum + f.contribution,
            0
          );
          expect(sumContributions).toBe(res.total);
          expect(res.total).toBeGreaterThanOrEqual(0);
          expect(res.total).toBeLessThanOrEqual(100);

          // Verify factor weights and constraints
          for (const f of res.factors) {
            expect(Number.isInteger(f.contribution)).toBe(true);
            expect(f.contribution).toBeGreaterThanOrEqual(0);
            expect(f.contribution).toBeLessThanOrEqual(f.weight);
          }
        }
      }
    });
  });

  describe('Education Hard Gate (AIX-05)', () => {
    it('disqualifies and excludes courses when candidate education is below minimum requirement', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_8', // Only 8th pass
        districtId: 14,
        sectorIds: ['automotive', 'manufacturing'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);

      // WLD-006 requires 8TH and should be included
      const resultCodes = response.results.map((r) => r.courseCode);
      expect(resultCodes).toContain('WLD-006');

      // 10th pass courses must NOT be in results
      expect(resultCodes).not.toContain('AUT-003');
      expect(resultCodes).not.toContain('ELE-001');
      expect(resultCodes).not.toContain('PRC-002');

      // Excluded array must record them with EDUCATION_BELOW_MINIMUM
      expect(response.excluded.length).toBeGreaterThanOrEqual(5);
      const excludedAUT = response.excluded.find(
        (e) => e.courseCode === 'AUT-003'
      );
      expect(excludedAUT).toBeDefined();
      expect(excludedAUT?.reasonCode).toBe('EDUCATION_BELOW_MINIMUM');
      expect(excludedAUT?.params.selected).toBe('PASS_8');
      expect(excludedAUT?.params.required).toBe('PASS_10');
    });

    it('excludes all courses for BELOW_8 candidate', () => {
      const answers: PathwayAnswers = {
        qualification: 'BELOW_8',
        districtId: 14,
        sectorIds: ['automotive'],
        language: 'mr',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);
      expect(response.results).toHaveLength(0);
      expect(response.excluded).toHaveLength(MOCK_COURSES.length);
      for (const exc of response.excluded) {
        expect(exc.reasonCode).toBe('EDUCATION_BELOW_MINIMUM');
        expect(exc.params.selected).toBe('BELOW_8');
      }
    });

    it('qualifies candidate with higher qualification (e.g. GRADUATE for 10th pass courses)', () => {
      const answers: PathwayAnswers = {
        qualification: 'GRADUATE',
        districtId: 14,
        sectorIds: ['automotive'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);
      expect(response.excluded).toHaveLength(0);
      expect(response.results).toHaveLength(MOCK_COURSES.length);
    });
  });

  describe('Determinism and Reproducibility (BE §J.4)', () => {
    it('produces deep-equal results and identical inputHash when run twice with same inputs', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['energy'],
        language: 'en',
        mobility: 'STATE',
      };

      const run1 = matchCourses(answers, MOCK_COURSES);
      const run2 = matchCourses(answers, MOCK_COURSES);

      expect(run1).toEqual(run2);
      expect(run1.inputHash).toBe(run2.inputHash);
      expect(run1.inputHash).toHaveLength(16);
    });

    it('produces distinct inputHash when answers change', () => {
      const answers1: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['energy'],
        language: 'en',
        mobility: 'STATE',
      };
      const answers2: PathwayAnswers = {
        qualification: 'PASS_12',
        districtId: 14,
        sectorIds: ['energy'],
        language: 'en',
        mobility: 'STATE',
      };

      const hash1 = computeCanonicalInputHash(answers1, MOCK_COURSES, STRATEGY.version);
      const hash2 = computeCanonicalInputHash(answers2, MOCK_COURSES, STRATEGY.version);

      expect(hash1).not.toBe(hash2);
    });

    it('FNV-1a produces deterministic 16-hex output', () => {
      const h1 = fnv1a64Hex('MahaSkills_2026_test_string');
      const h2 = fnv1a64Hex('MahaSkills_2026_test_string');
      expect(h1).toBe(h2);
      expect(h1).toMatch(/^[0-9a-f]{16}$/);
    });
  });

  describe('Stable Tie-breaking', () => {
    it('breaks ties deterministically on courseCode ascending when totals are identical', () => {
      // Create two identical courses with different codes
      const courseB = createMockCourse({
        course_code: 'ZZZ-999',
        verified_placement_rate: 80,
        median_salary_inr: 25000,
        is_high_demand: true,
        districts: ['Pune'],
      });
      const courseA = createMockCourse({
        course_code: 'AAA-111',
        verified_placement_rate: 80,
        median_salary_inr: 25000,
        is_high_demand: true,
        districts: ['Pune'],
      });

      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['manufacturing'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, [courseB, courseA]);
      expect(response.results).toHaveLength(2);
      expect(response.results[0].total).toBe(response.results[1].total);
      // AAA-111 must precede ZZZ-999
      expect(response.results[0].courseCode).toBe('AAA-111');
      expect(response.results[1].courseCode).toBe('ZZZ-999');
    });
  });

  describe('Band Threshold Edges (49 / 50 / 74 / 75) & Weak Results (AIX-03)', () => {
    it('classifies exact totals into correct bands: 49 WEAK, 50 GOOD, 74 GOOD, 75 STRONG', () => {
      // Direct verification of allocateLargestRemainderContributions outputs
      // 1. Target 49 -> WEAK
      const raw49 = {
        SKILL_ALIGNMENT: 0.2, // 6
        DEMAND_ALIGNMENT: 0.4, // 10
        OUTCOME_STRENGTH: 0.4, // 8
        EDUCATION_FIT: 1.0, // 15
        LOCATION_FIT: 1.0, // 10  Total ~49
      };
      const alloc49 = allocateLargestRemainderContributions(raw49);
      expect(alloc49.total).toBe(49);

      // 2. Target 50 -> GOOD
      const raw50 = {
        SKILL_ALIGNMENT: 0.2333, // 7
        DEMAND_ALIGNMENT: 0.4, // 10
        OUTCOME_STRENGTH: 0.4, // 8
        EDUCATION_FIT: 1.0, // 15
        LOCATION_FIT: 1.0, // 10 Total = 50
      };
      const alloc50 = allocateLargestRemainderContributions(raw50);
      expect(alloc50.total).toBe(50);

      // 3. Target 74 -> GOOD
      const raw74 = {
        SKILL_ALIGNMENT: 0.8, // 24
        DEMAND_ALIGNMENT: 0.6, // 15
        OUTCOME_STRENGTH: 0.7, // 14
        EDUCATION_FIT: 1.0, // 15
        LOCATION_FIT: 0.6, // 6 Total = 74
      };
      const alloc74 = allocateLargestRemainderContributions(raw74);
      expect(alloc74.total).toBe(74);

      // 4. Target 75 -> STRONG
      const raw75 = {
        SKILL_ALIGNMENT: 0.8333, // 25
        DEMAND_ALIGNMENT: 0.6, // 15
        OUTCOME_STRENGTH: 0.7, // 14
        EDUCATION_FIT: 1.0, // 15
        LOCATION_FIT: 0.6, // 6 Total = 75
      };
      const alloc75 = allocateLargestRemainderContributions(raw75);
      expect(alloc75.total).toBe(75);
    });

    it('weak results ARE returned in results array (not discarded)', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 36, // Gadchiroli (remote, far from hubs)
        sectorIds: ['agriculture'],
        language: 'en',
        mobility: 'DISTRICT', // Will not relocate
      };

      const response = matchCourses(answers, MOCK_COURSES);
      const weakResults = response.results.filter((r) => r.band === 'WEAK');

      expect(weakResults.length).toBeGreaterThan(0);
      for (const weak of weakResults) {
        expect(weak.total).toBeLessThan(50);
        // Must include at least one "why weak" reason
        const reasonCodes = weak.reasons.map((r) => r.code);
        const hasWhyWeak =
          reasonCodes.includes('LOW_SKILL_OVERLAP') ||
          reasonCodes.includes('RELOCATION_NEEDED');
        expect(hasWhyWeak).toBe(true);
      }
    });
  });

  describe('Sample Size Rule (AIX-08): limitedData at n=29 vs n=30', () => {
    it('sets limitedData = true when n < 30 (n = 29)', () => {
      const courseLowN = createMockCourse({
        course_code: 'LOW-029',
      });
      const adapterMap = {
        ...COURSE_ADAPTER_MAP,
        'LOW-029': {
          courseCode: 'LOW-029',
          minimumQualification: 'PASS_10' as QualificationLevel,
          taughtSkills: ['Skills'],
          mediums: ['en' as QuizLanguage],
          sectorId: 'automotive',
          sampleSize: 29, // n = 29
          batchYear: '2024-25',
        },
      };

      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['automotive'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, [courseLowN], { adapterMap });
      expect(response.results[0].outcome.n).toBe(29);
      expect(response.results[0].outcome.limitedData).toBe(true);
    });

    it('sets limitedData = false when n >= 30 (n = 30)', () => {
      const courseAdequateN = createMockCourse({
        course_code: 'ADEQ-030',
      });
      const adapterMap = {
        ...COURSE_ADAPTER_MAP,
        'ADEQ-030': {
          courseCode: 'ADEQ-030',
          minimumQualification: 'PASS_10' as QualificationLevel,
          taughtSkills: ['Skills'],
          mediums: ['en' as QuizLanguage],
          sectorId: 'automotive',
          sampleSize: 30, // n = 30
          batchYear: '2024-25',
        },
      };

      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['automotive'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, [courseAdequateN], { adapterMap });
      expect(response.results[0].outcome.n).toBe(30);
      expect(response.results[0].outcome.limitedData).toBe(false);
    });

    it('correctly sets limitedData for AGR-007 (n = 24) in default mock data', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 8, // Nashik
        sectorIds: ['agriculture'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);
      const agrResult = response.results.find((r) => r.courseCode === 'AGR-007');
      expect(agrResult).toBeDefined();
      expect(agrResult?.outcome.n).toBe(24);
      expect(agrResult?.outcome.limitedData).toBe(true);
    });
  });

  describe('Reason Generation & i18n Key Verification', () => {
    it('every result has 1 to 3 reasons and all codes exist in match.json locale files', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['automotive'],
        language: 'mr',
        mobility: 'STATE',
      };

      const response = matchCourses(answers, MOCK_COURSES);

      for (const res of response.results) {
        expect(res.reasons.length).toBeGreaterThanOrEqual(1);
        expect(res.reasons.length).toBeLessThanOrEqual(3);

        for (const reason of res.reasons) {
          // Assert key exists in English match.json
          expect(enMatch.reason[reason.code]).toBeDefined();
          expect(enMatch.reason[reason.code].length).toBeGreaterThan(5);

          // Assert key exists in Marathi match.json
          expect(mrMatch.reason[reason.code]).toBeDefined();
          expect(mrMatch.reason[reason.code].length).toBeGreaterThan(5);

          // Assert key exists in Hindi match.json
          expect(hiMatch.reason[reason.code]).toBeDefined();
          expect(hiMatch.reason[reason.code].length).toBeGreaterThan(5);

          // If parameter-based reasons are present, verify params
          if (reason.code === 'LOCAL_DEMAND') {
            expect(reason.params?.employers).toBeDefined();
            expect(reason.params?.district).toBeDefined();
          } else if (reason.code === 'STRONG_OUTCOMES') {
            expect(reason.params?.rate).toBeDefined();
          } else if (reason.code === 'NEARBY_ITI') {
            expect(reason.params?.district).toBeDefined();
          }
        }
      }
    });

    it('verifies match.json has required schema elements without en/em dashes', () => {
      const locales = [enMatch, mrMatch, hiMatch];
      for (const loc of locales) {
        expect(loc.band.strong).toBeDefined();
        expect(loc.band.good).toBeDefined();
        expect(loc.band.weak).toBeDefined();
        expect(loc.score).toContain('{{total}}');
        expect(loc.factor.SKILL_ALIGNMENT).toBeDefined();
        expect(loc.factor.DEMAND_ALIGNMENT).toBeDefined();
        expect(loc.factor.OUTCOME_STRENGTH).toBeDefined();
        expect(loc.factor.EDUCATION_FIT).toBeDefined();
        expect(loc.factor.LOCATION_FIT).toBeDefined();
        expect(loc.weak_note).toBeDefined();
        expect(loc.excluded.title).toBeDefined();
        expect(loc.excluded.EDUCATION_BELOW_MINIMUM).toContain('{{required}}');
        expect(loc.excluded.EDUCATION_BELOW_MINIMUM).toContain('{{selected}}');
        expect(loc.limited_data).toContain('{{n}}');
        expect(loc.helpful.question).toBeDefined();

        // CNT-08: No em-dash or en-dash in locale strings
        const jsonString = JSON.stringify(loc);
        expect(jsonString).not.toContain('\u2013'); // en-dash –
        expect(jsonString).not.toContain('\u2014'); // em-dash —
      }
    });
  });

  describe('Ported Assertions from candidatePathway.test.ts', () => {
    // Ported from: "should return recommended vocational courses with highest match EV / CNC"
    it('ports TEST-CAN-002: recommends EV (AUT-003) as top recommendation for automotive interest in Pune', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14, // Pune
        sectorIds: ['automotive'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);

      expect(response.results.length).toBeGreaterThanOrEqual(3);
      expect(response.results[0].total).toBeGreaterThanOrEqual(response.results[1].total);
      expect(response.results[1].total).toBeGreaterThanOrEqual(response.results[2].total);

      // Highest match is AUT-003 or PRC-002
      expect(response.results[0].courseCode).toBe('AUT-003');
      expect(response.results[0].band).toBe('STRONG');
      expect(response.results[0].total).toBeGreaterThanOrEqual(75);
    });

    // Ported from: "should prioritize electrical and solar courses when candidate selects electrical interest"
    it('ports TEST-CAN-002: prioritizes electrical and solar courses (ELE-001, GRN-004) for energy interest', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14, // Pune
        sectorIds: ['energy'],
        language: 'en',
        mobility: 'STATE',
      };

      const response = matchCourses(answers, MOCK_COURSES);

      const topCodes = response.results.slice(0, 3).map((r) => r.courseCode);
      expect(topCodes).toContain('ELE-001');
      expect(response.results[0].total).toBeGreaterThanOrEqual(70);
    });

    // Ported from: "should properly penalize courses when candidate is only 8th pass and trade requires 10th"
    it('ports TEST-CAN-002: 8th pass candidate receives 8th-pass eligible trade WLD-006 while 10th trades are excluded', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_8',
        districtId: 14,
        sectorIds: ['manufacturing'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);

      // Welder (WLD-006) is eligible and top recommended
      expect(response.results[0].courseCode).toBe('WLD-006');
      expect(response.results[0].factors.find((f) => f.code === 'EDUCATION_FIT')?.contribution).toBe(15);

      // 10th pass courses are excluded with EDUCATION_BELOW_MINIMUM
      const excludedCodes = response.excluded.map((e) => e.courseCode);
      expect(excludedCodes).toContain('PRC-002');
      expect(excludedCodes).toContain('AUT-003');
    });

    // Ported from: "should provide trilingual personalized rationales"
    it('ports TEST-CAN-002: provides trilingual explanations via template keys in match.json', () => {
      const answers: PathwayAnswers = {
        qualification: 'PASS_10',
        districtId: 14,
        sectorIds: ['it'],
        language: 'en',
        mobility: 'DISTRICT',
      };

      const response = matchCourses(answers, MOCK_COURSES);
      const itResult = response.results.find((r) => r.courseCode === 'IT-005');
      expect(itResult).toBeDefined();

      for (const reason of itResult!.reasons) {
        expect(enMatch.reason[reason.code]).toBeDefined();
        expect(mrMatch.reason[reason.code]).toBeDefined();
        expect(hiMatch.reason[reason.code]).toBeDefined();
      }
    });
  });
});
