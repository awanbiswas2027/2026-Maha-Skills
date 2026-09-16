import { CourseItem } from '../../types/api';
import {
  COURSE_ADAPTER_MAP,
  CourseAdapterData,
  DISTRICT_ID_TO_NAME,
} from './matchingFixtures';

export type QualificationLevel =
  | 'BELOW_8'
  | 'PASS_8'
  | 'PASS_10'
  | 'PASS_12'
  | 'DIPLOMA'
  | 'GRADUATE';

export type MobilityPreference = 'DISTRICT' | 'STATE' | 'ANYWHERE';

export type QuizLanguage = 'mr' | 'hi' | 'en';

export interface PathwayAnswers {
  qualification: QualificationLevel;
  districtId: number;
  sectorIds: string[]; // 1–3
  language: QuizLanguage;
  mobility: MobilityPreference;
}

export const FACTORS = [
  { code: 'SKILL_ALIGNMENT', weight: 30 },
  { code: 'DEMAND_ALIGNMENT', weight: 25 },
  { code: 'OUTCOME_STRENGTH', weight: 20 },
  { code: 'EDUCATION_FIT', weight: 15 },
  { code: 'LOCATION_FIT', weight: 10 },
] as const;

export type FactorCode = (typeof FACTORS)[number]['code'];

export const STRATEGY = {
  code: 'CANDIDATE_COURSE',
  version: '1.0.0',
} as const;

export interface FactorContribution {
  code: FactorCode;
  weight: number;
  contribution: number; // int 0..weight
}

export type MatchReasonCode =
  | 'EDUCATION_MATCH'
  | 'SECTOR_INTEREST'
  | 'LOCAL_DEMAND'
  | 'STRONG_OUTCOMES'
  | 'NEARBY_ITI'
  | 'RELOCATION_NEEDED'
  | 'LOW_SKILL_OVERLAP';

export interface MatchReason {
  code: MatchReasonCode;
  params?: Record<string, string | number>;
}

export interface MatchOutcome {
  placementRate: number;
  n: number;
  batchYear: string;
  limitedData: boolean;
}

export type MatchBand = 'STRONG' | 'GOOD' | 'WEAK';

export interface MatchResult {
  courseCode: string;
  total: number; // 0–100 int
  band: MatchBand;
  factors: FactorContribution[];
  reasons: MatchReason[]; // 1–3
  outcome: MatchOutcome;
}

export interface Exclusion {
  courseCode: string;
  reasonCode: 'EDUCATION_BELOW_MINIMUM';
  params: {
    required: string;
    selected: string;
  };
}

export interface MatchCourseResponse {
  results: MatchResult[];
  excluded: Exclusion[];
  inputHash: string;
  strategy: {
    code: string;
    version: string;
  };
}

export interface MatchingContext {
  districtNameById?: Record<number, string>;
  districtEmployers?: Record<string, number>;
  adapterMap?: Record<string, CourseAdapterData>;
}

const QUALIFICATION_RANK: Record<QualificationLevel, number> = {
  BELOW_8: 0,
  PASS_8: 1,
  PASS_10: 2,
  PASS_12: 3,
  DIPLOMA: 4,
  GRADUATE: 5,
};

const MINIMUM_EDUCATION_TO_QUAL: Record<
  CourseItem['minimum_education'],
  QualificationLevel
> = {
  '8TH': 'PASS_8',
  '10TH': 'PASS_10',
  '12TH': 'PASS_12',
  GRADUATE: 'GRADUATE',
};

/**
 * 64-bit FNV-1a hash algorithm returning a 16-character hex string.
 * Completely deterministic and free of external or platform crypto dependencies.
 */
export function fnv1a64Hex(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * prime) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, '0');
}

/**
 * Canonical JSON hashing of answers, strategy version, and course codes.
 */
export function computeCanonicalInputHash(
  answers: PathwayAnswers,
  courses: CourseItem[],
  strategyVersion: string
): string {
  const canonicalObject = {
    answers: {
      districtId: answers.districtId,
      language: answers.language,
      mobility: answers.mobility,
      qualification: answers.qualification,
      sectorIds: [...answers.sectorIds].sort(),
    },
    courseCodes: courses.map((c) => c.course_code).sort(),
    strategyVersion,
  };
  return fnv1a64Hex(JSON.stringify(canonicalObject));
}

/**
 * Largest-remainder (Hare-Niemeyer) rounding method.
 * Ensures the sum of factor contributions exactly equals the target integer total.
 */
export function allocateLargestRemainderContributions(
  rawScores: Record<FactorCode, number>
): { total: number; factors: FactorContribution[] } {
  const rawContributions = FACTORS.map((f, index) => {
    const raw = Math.min(1.0, Math.max(0.0, rawScores[f.code])) * f.weight;
    const floor = Math.floor(raw);
    const remainder = raw - floor;
    return {
      code: f.code,
      weight: f.weight,
      index,
      raw,
      floor,
      remainder,
      contribution: floor,
    };
  });

  const unroundedSum = rawContributions.reduce((acc, c) => acc + c.raw, 0);
  const targetTotal = Math.min(100, Math.max(0, Math.round(unroundedSum)));
  const currentFloorSum = rawContributions.reduce((acc, c) => acc + c.floor, 0);
  const deficit = targetTotal - currentFloorSum;

  // Sort remainder descending, breaking ties deterministically by factor index
  const sortedByRemainder = [...rawContributions].sort((a, b) => {
    if (Math.abs(b.remainder - a.remainder) > 1e-9) {
      return b.remainder - a.remainder;
    }
    return a.index - b.index;
  });

  for (let i = 0; i < deficit; i++) {
    if (i < sortedByRemainder.length) {
      const item = sortedByRemainder[i];
      if (item.contribution < item.weight) {
        item.contribution += 1;
      }
    }
  }

  // Restore fixed order
  rawContributions.sort((a, b) => a.index - b.index);

  const factors: FactorContribution[] = rawContributions.map((c) => ({
    code: c.code,
    weight: c.weight,
    contribution: c.contribution,
  }));

  return { total: targetTotal, factors };
}

/**
 * Normalizes sector identifiers to match user quiz choices.
 */
function normalizeSector(sector: string): string {
  const s = sector.toLowerCase();
  if (s.includes('auto') || s.includes('mobility') || s.includes('ev') || s.includes('machin')) {
    return 'automotive';
  }
  if (s.includes('energy') || s.includes('power') || s.includes('solar')) {
    return 'energy';
  }
  if (s.includes('it') || s.includes('computer') || s.includes('digital')) {
    return 'it';
  }
  if (s.includes('weld') || s.includes('fabrication') || s.includes('manufacturing') || s.includes('capital')) {
    return 'manufacturing';
  }
  if (s.includes('agri') || s.includes('food')) {
    return 'agriculture';
  }
  if (s.includes('electron') || s.includes('iot')) {
    return 'electronics';
  }
  return s;
}

/**
 * Pure, deterministic, explainable course matching engine.
 * Computes factor contributions, determines exclusions, bands, and top reasons.
 */
export function matchCourses(
  answers: PathwayAnswers,
  courses: CourseItem[],
  context: MatchingContext = {}
): MatchCourseResponse {
  const adapterMap = context.adapterMap || COURSE_ADAPTER_MAP;
  const districtNameById = context.districtNameById || DISTRICT_ID_TO_NAME;
  const candidateDistrictName =
    districtNameById[answers.districtId] || 'Pune';

  const candidateRank = QUALIFICATION_RANK[answers.qualification];
  const inputHash = computeCanonicalInputHash(
    answers,
    courses,
    STRATEGY.version
  );

  const results: MatchResult[] = [];
  const excluded: Exclusion[] = [];

  for (const course of courses) {
    const adapter = adapterMap[course.course_code];
    const requiredQualification: QualificationLevel =
      adapter?.minimumQualification ||
      MINIMUM_EDUCATION_TO_QUAL[course.minimum_education] ||
      'PASS_10';

    const requiredRank = QUALIFICATION_RANK[requiredQualification];

    // Education Fit Gate (AIX-05)
    // If candidate's education is below minimum, EDUCATION_FIT is 0 and course is excluded
    if (candidateRank < requiredRank) {
      excluded.push({
        courseCode: course.course_code,
        reasonCode: 'EDUCATION_BELOW_MINIMUM',
        params: {
          required: requiredQualification,
          selected: answers.qualification,
        },
      });
      continue;
    }

    // 1. EDUCATION_FIT: 1.0 (Full marks since candidate satisfies prerequisite)
    const educationScore = 1.0;

    // 2. SKILL_ALIGNMENT (weight 30)
    const normalizedCourseSector = normalizeSector(
      adapter?.sectorId || course.sector_name
    );
    const candidateSectorsNormalized = answers.sectorIds.map((s) =>
      normalizeSector(s)
    );

    const isSectorMatch =
      candidateSectorsNormalized.includes(normalizedCourseSector) ||
      answers.sectorIds.some((s) =>
        course.sector_name.toLowerCase().includes(s.toLowerCase())
      );

    let skillScore = 0.2; // Baseline low overlap
    if (isSectorMatch) {
      skillScore = 0.85;
      if (course.is_high_demand) {
        skillScore += 0.08;
      }
      if (adapter?.mediums.includes(answers.language)) {
        skillScore += 0.07;
      }
    } else {
      if (course.is_high_demand) {
        skillScore += 0.05;
      }
    }
    skillScore = Math.min(1.0, Math.max(0.0, skillScore));

    // 3. DEMAND_ALIGNMENT (weight 25)
    let employersCount = 0;
    if (adapter?.hiringEmployersCountByDistrict) {
      employersCount =
        adapter.hiringEmployersCountByDistrict[candidateDistrictName] || 0;
    } else if (context.districtEmployers) {
      employersCount = context.districtEmployers[candidateDistrictName] || 0;
    } else if (course.is_high_demand) {
      employersCount = 20;
    }

    let demandScore = course.is_high_demand ? 0.78 : 0.52;
    if (employersCount >= 20) {
      demandScore += 0.18;
    } else if (employersCount >= 10) {
      demandScore += 0.12;
    } else if (employersCount > 0) {
      demandScore += 0.06;
    }
    demandScore = Math.min(1.0, Math.max(0.0, demandScore));

    // 4. OUTCOME_STRENGTH (weight 20)
    const placementRatio = Math.min(
      1.0,
      Math.max(0.0, course.verified_placement_rate / 100)
    );
    const salaryRatio = Math.min(
      1.0,
      Math.max(0.0, course.median_salary_inr / 30000)
    );
    const outcomeScore = Math.min(
      1.0,
      Math.max(0.0, 0.7 * placementRatio + 0.3 * salaryRatio)
    );

    // 5. LOCATION_FIT (weight 10)
    const inHomeDistrict = course.districts.some(
      (d) => d.toLowerCase() === candidateDistrictName.toLowerCase()
    );

    let locationScore = 0.1;
    if (inHomeDistrict) {
      locationScore = 1.0;
    } else {
      if (answers.mobility === 'DISTRICT') {
        locationScore = 0.15;
      } else if (answers.mobility === 'STATE') {
        locationScore = 0.6; // Matches §19.2 "6 of 10" relocation pattern
      } else if (answers.mobility === 'ANYWHERE') {
        locationScore = 0.85;
      }
    }
    locationScore = Math.min(1.0, Math.max(0.0, locationScore));

    // Largest-Remainder integer rounding
    const { total, factors } = allocateLargestRemainderContributions({
      SKILL_ALIGNMENT: skillScore,
      DEMAND_ALIGNMENT: demandScore,
      OUTCOME_STRENGTH: outcomeScore,
      EDUCATION_FIT: educationScore,
      LOCATION_FIT: locationScore,
    });

    // Band determination (AIX-03)
    const band: MatchBand =
      total >= 75 ? 'STRONG' : total >= 50 ? 'GOOD' : 'WEAK';

    // Outcome metadata
    const sampleSize = adapter?.sampleSize ?? 100;
    const batchYear = adapter?.batchYear ?? '2024-25';
    const outcome: MatchOutcome = {
      placementRate: course.verified_placement_rate,
      n: sampleSize,
      batchYear,
      limitedData: sampleSize < 30, // AIX-08
    };

    // Reasons calculation (AIX-06)
    // 1 to 3 reasons ordered by contribution; weak matches must include at least one why-weak reason
    const reasons: MatchReason[] = [];

    if (band === 'WEAK') {
      // Weak match reasons: must include at least one "why weak" reason
      if (!isSectorMatch) {
        reasons.push({ code: 'LOW_SKILL_OVERLAP' });
      }
      if (!inHomeDistrict) {
        reasons.push({
          code: 'RELOCATION_NEEDED',
          params: { district: candidateDistrictName },
        });
      }
      // If neither triggered, supply LOW_SKILL_OVERLAP as fallback why-weak
      if (reasons.length === 0) {
        reasons.push({ code: 'LOW_SKILL_OVERLAP' });
      }

      // Add positive notes if space permits
      if (reasons.length < 3 && educationScore > 0) {
        reasons.push({ code: 'EDUCATION_MATCH' });
      }
      if (reasons.length < 3 && course.verified_placement_rate >= 70) {
        reasons.push({
          code: 'STRONG_OUTCOMES',
          params: { rate: course.verified_placement_rate },
        });
      }
    } else {
      // Strong or Good match reasons
      if (isSectorMatch) {
        reasons.push({ code: 'SECTOR_INTEREST' });
      }
      if (employersCount > 0) {
        reasons.push({
          code: 'LOCAL_DEMAND',
          params: {
            employers: employersCount,
            district: candidateDistrictName,
          },
        });
      }
      if (course.verified_placement_rate >= 70 && reasons.length < 3) {
        reasons.push({
          code: 'STRONG_OUTCOMES',
          params: { rate: course.verified_placement_rate },
        });
      }
      if (inHomeDistrict && reasons.length < 3) {
        reasons.push({
          code: 'NEARBY_ITI',
          params: { district: candidateDistrictName },
        });
      }
      if (reasons.length < 3) {
        reasons.push({ code: 'EDUCATION_MATCH' });
      }
    }

    results.push({
      courseCode: course.course_code,
      total,
      band,
      factors,
      reasons: reasons.slice(0, 3),
      outcome,
    });
  }

  // Stable sort: total desc, then courseCode asc (stable, no randomness)
  results.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    return a.courseCode.localeCompare(b.courseCode);
  });

  // Excluded sorted stably by courseCode
  excluded.sort((a, b) => a.courseCode.localeCompare(b.courseCode));

  return {
    results,
    excluded,
    inputHash,
    strategy: { ...STRATEGY },
  };
}
