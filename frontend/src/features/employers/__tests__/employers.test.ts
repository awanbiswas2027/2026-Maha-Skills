/**
 * MahaSkills — Employer Portal Logic & Validation Test Suite
 * Problem Statement ID: 26134
 *
 * Tests GSTIN structural validation and Luhn mod-36 checksum, fiscal quarter generation,
 * skill need completeness scoring, 2-minute pulse survey progress tracking,
 * curriculum review submission readiness, and Zod schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateGstinCheckDigit,
  validateGSTIN,
  gstinSchema,
  skillNeedSchema,
  surveySubmissionSchema,
  curriculumReviewSchema,
} from '../schemas';
import {
  quarterOptions,
  skillNeedCompleteness,
  surveyProgress,
  canSubmitReview,
} from '../logic';
import {
  MOCK_GSTIN_SAMPLES,
  MOCK_SKILL_NEEDS,
  MOCK_SURVEYS,
  MOCK_CURRICULUM_REVIEWS,
} from '../fixtures';
import type { SkillNeed } from '../model';

describe('GSTIN Luhn Mod-36 Validator', () => {
  it('correctly calculates the 15th check digit for valid Indian GSTIN prefixes', () => {
    // Maharashtra: 27AAPFU0939F1Z -> V
    expect(calculateGstinCheckDigit('27AAPFU0939F1Z')).toBe('V');

    // Maharashtra Enterprise: 27AAACT2727Q1Z -> W
    expect(calculateGstinCheckDigit('27AAACT2727Q1Z')).toBe('W');

    // Delhi: 07AAAAA0000A1Z -> 4
    expect(calculateGstinCheckDigit('07AAAAA0000A1Z')).toBe('4');

    // Gujarat: 24AAACW3000P1Z -> H
    expect(calculateGstinCheckDigit('24AAACW3000P1Z')).toBe('H');

    // Karnataka: 29AABCT1332L1Z -> A
    expect(calculateGstinCheckDigit('29AABCT1332L1Z')).toBe('A');
  });

  it('validates all specimen valid GSTINs across multiple states', () => {
    for (const specimen of MOCK_GSTIN_SAMPLES.valid) {
      const res = validateGSTIN(specimen.gstin);
      expect(res.isValid).toBe(true);
      expect(res.stateCode).toBe(specimen.code);
      expect(res.checkDigit).toBe(specimen.gstin[14]);
      expect(res.error).toBeUndefined();
    }
  });

  it('handles case-insensitivity and leading/trailing whitespace gracefully', () => {
    const res = validateGSTIN('  27aapfu0939f1zv  ');
    expect(res.isValid).toBe(true);
    expect(res.stateCode).toBe('27');
    expect(res.checkDigit).toBe('V');
  });

  it('rejects empty or non-string inputs', () => {
    expect(validateGSTIN('').isValid).toBe(false);
    expect(validateGSTIN('   ').isValid).toBe(false);
    // @ts-expect-error testing invalid type
    expect(validateGSTIN(null).isValid).toBe(false);
    // @ts-expect-error testing invalid type
    expect(validateGSTIN(undefined).isValid).toBe(false);
  });

  it('rejects GSTINs with invalid length', () => {
    const tooShort = validateGSTIN('27AAPFU0939F1Z');
    expect(tooShort.isValid).toBe(false);
    expect(tooShort.error).toBe('employer:gstin.error_length');

    const tooLong = validateGSTIN('27AAPFU0939F1ZV99');
    expect(tooLong.isValid).toBe(false);
    expect(tooLong.error).toBe('employer:gstin.error_length');
  });

  it('rejects invalid state codes (below 01 or above 38)', () => {
    const state00 = validateGSTIN('00AAPFU0939F1ZV');
    expect(state00.isValid).toBe(false);
    expect(state00.error).toBe('employer:gstin.error_state_code');

    const state39 = validateGSTIN('39AAPFU0939F1ZV');
    expect(state39.isValid).toBe(false);
    expect(state39.error).toBe('employer:gstin.error_state_code');

    const stateAlpha = validateGSTIN('MHAAPFU0939F1ZV');
    expect(stateAlpha.isValid).toBe(false);
    expect(stateAlpha.error).toBe('employer:gstin.error_state_code');
  });

  it('rejects malformed PAN structures', () => {
    // 3rd to 7th characters must be letters; here '12345' is numeric
    const invalidPan = validateGSTIN('27123450939F1ZV');
    expect(invalidPan.isValid).toBe(false);
    expect(invalidPan.error).toBe('employer:gstin.error_pan_format');

    // 8th to 11th must be digits; here 'ABCD' is letters
    const invalidPanDigits = validateGSTIN('27AAPFUABCDX1ZV');
    expect(invalidPanDigits.isValid).toBe(false);
    expect(invalidPanDigits.error).toBe('employer:gstin.error_pan_format');
  });

  it('rejects invalid 13th entity character or 14th character that is not Z', () => {
    // 14th character must be 'Z'
    const notZ = validateGSTIN('27AAPFU0939F1AV');
    expect(notZ.isValid).toBe(false);
    expect(notZ.error).toBe('employer:gstin.error_fourteenth_z');
  });

  it('detects checksum mismatch when 15th check digit is tampered', () => {
    // Original check digit is 'V'; here we use '0'
    const tampered = validateGSTIN('27AAPFU0939F1Z0');
    expect(tampered.isValid).toBe(false);
    expect(tampered.error).toBe('employer:gstin.error_checksum_mismatch');
    expect(tampered.checkDigit).toBe('0');
  });

  it('throws an error in calculateGstinCheckDigit if prefix is not exactly 14 chars', () => {
    expect(() => calculateGstinCheckDigit('SHORT')).toThrow(/Expected 14 characters/);
    expect(() => calculateGstinCheckDigit('27AAPFU0939F1ZV')).toThrow(/Expected 14 characters/);
  });
});

describe('Fiscal Quarter Options Generator', () => {
  it('generates the default 6 sequential quarters from given date', () => {
    // Mid Q3 2026: August 15, 2026
    const fixedDate = new Date('2026-08-15T12:00:00Z');
    const options = quarterOptions(fixedDate, 6);

    expect(options).toHaveLength(6);
    expect(options[0]).toEqual({
      value: '2026-Q3',
      label: 'Q3 2026',
      year: 2026,
      quarter: 3,
    });
    expect(options[1]).toEqual({
      value: '2026-Q4',
      label: 'Q4 2026',
      year: 2026,
      quarter: 4,
    });
    // Seamless rollover into next year
    expect(options[2]).toEqual({
      value: '2027-Q1',
      label: 'Q1 2027',
      year: 2027,
      quarter: 1,
    });
    expect(options[3]).toEqual({
      value: '2027-Q2',
      label: 'Q2 2027',
      year: 2027,
      quarter: 2,
    });
    expect(options[4]).toEqual({
      value: '2027-Q3',
      label: 'Q3 2027',
      year: 2027,
      quarter: 3,
    });
    expect(options[5]).toEqual({
      value: '2027-Q4',
      label: 'Q4 2027',
      year: 2027,
      quarter: 4,
    });
  });

  it('handles Q1 start date correctly', () => {
    const q1Date = new Date('2026-02-01T00:00:00Z');
    const options = quarterOptions(q1Date, 4);

    expect(options).toHaveLength(4);
    expect(options[0].value).toBe('2026-Q1');
    expect(options[3].value).toBe('2026-Q4');
  });

  it('handles Q4 start date rollover to next year', () => {
    const q4Date = new Date('2026-11-20T00:00:00Z');
    const options = quarterOptions(q4Date, 3);

    expect(options[0].value).toBe('2026-Q4');
    expect(options[1].value).toBe('2027-Q1');
    expect(options[2].value).toBe('2027-Q2');
  });
});

describe('Skill Need Completeness Scoring', () => {
  it('returns 0 score and all missing fields for empty or undefined draft', () => {
    const emptyRes = skillNeedCompleteness(null);
    expect(emptyRes.isComplete).toBe(false);
    expect(emptyRes.score).toBe(0);
    expect(emptyRes.percentage).toBe(0);
    expect(emptyRes.missingFields).toHaveLength(7);
  });

  it('returns 100% and isComplete = true for a fully specified skill need', () => {
    const completeNeed = MOCK_SKILL_NEEDS[0];
    const res = skillNeedCompleteness(completeNeed);

    expect(res.isComplete).toBe(true);
    expect(res.score).toBe(1);
    expect(res.percentage).toBe(100);
    expect(res.missingFields).toHaveLength(0);
  });

  it('accurately identifies partial completion and missing fields', () => {
    const partialDraft: Partial<SkillNeed> = {
      quarter: '2026-Q3',
      jobRole: 'EV Powertrain Assembly Technician',
      headcount: 50,
      urgency: 'IMMEDIATE',
    };

    const res = skillNeedCompleteness(partialDraft);
    expect(res.isComplete).toBe(false);
    expect(res.missingFields).toContain('skills');
    expect(res.missingFields).toContain('district');
    expect(res.missingFields).toContain('nsqfLevel');
    expect(res.score).toBeCloseTo(4 / 7);
    expect(res.percentage).toBe(57);
  });

  it('rejects invalid field values during completeness check', () => {
    const invalidValues: Partial<SkillNeed> = {
      quarter: '', // empty
      jobRole: 'A', // too short
      skills: [], // empty array
      headcount: 0, // <= 0
      district: '',
      nsqfLevel: 15, // > 10
      // @ts-expect-error invalid urgency
      urgency: 'WHENEVER',
    };

    const res = skillNeedCompleteness(invalidValues);
    expect(res.isComplete).toBe(false);
    expect(res.missingFields).toHaveLength(7);
  });
});

describe('Pulse Survey Progress Calculation', () => {
  const survey = MOCK_SURVEYS[0]; // 4 questions

  it('returns 0 progress when no answers are provided', () => {
    const res = surveyProgress({}, survey);
    expect(res.totalCount).toBe(4);
    expect(res.answeredCount).toBe(0);
    expect(res.percentage).toBe(0);
    expect(res.isComplete).toBe(false);
    expect(res.unansweredQuestionIds).toHaveLength(4);
  });

  it('handles null survey or empty survey questions safely', () => {
    const res = surveyProgress({}, null);
    expect(res.totalCount).toBe(0);
    expect(res.isComplete).toBe(true);
  });

  it('calculates progress accurately for partial responses', () => {
    const partialAnswers = {
      q1_hv_readiness: 5,
      q2_diagnostic_tooling: 'can_bus',
    };

    const res = surveyProgress(partialAnswers, survey);
    expect(res.totalCount).toBe(4);
    expect(res.answeredCount).toBe(2);
    expect(res.percentage).toBe(50);
    expect(res.isComplete).toBe(false);
    expect(res.unansweredQuestionIds).toEqual(['q3_top_skill_deficits', 'q4_apprentice_willingness']);
  });

  it('reports 100% and isComplete = true when all questions are answered', () => {
    const fullAnswers = {
      q1_hv_readiness: 4,
      q2_diagnostic_tooling: 'can_bus',
      q3_top_skill_deficits: ['hv_insulation', 'crimping'],
      q4_apprentice_willingness: 5,
    };

    const res = surveyProgress(fullAnswers, survey);
    expect(res.totalCount).toBe(4);
    expect(res.answeredCount).toBe(4);
    expect(res.percentage).toBe(100);
    expect(res.isComplete).toBe(true);
    expect(res.unansweredQuestionIds).toHaveLength(0);
  });
});

describe('Curriculum Review Submission Readiness', () => {
  it('disallows submission when review is missing or lacks syllabus id', () => {
    expect(canSubmitReview(null).canSubmit).toBe(false);
    expect(canSubmitReview({}).canSubmit).toBe(false);
    expect(canSubmitReview({ draftSyllabusId: '' }).canSubmit).toBe(false);
  });

  it('disallows submission without a valid verdict', () => {
    const res = canSubmitReview({
      draftSyllabusId: 'syl_123',
    });
    expect(res.canSubmit).toBe(false);
    expect(res.reason).toBe('employer:validation.verdict_required');
  });

  it('allows submission of ENDORSED verdict without requiring a lengthy comment', () => {
    const endorsed = canSubmitReview({
      draftSyllabusId: 'syl_123',
      verdict: 'ENDORSED',
      comment: '',
    });
    expect(endorsed.canSubmit).toBe(true);
  });

  it('requires at least 10 characters of feedback when suggesting changes or declining relevance', () => {
    const tooBrief = canSubmitReview({
      draftSyllabusId: 'syl_123',
      verdict: 'CHANGES_SUGGESTED',
      comment: 'Bad',
    });
    expect(tooBrief.canSubmit).toBe(false);
    expect(tooBrief.reason).toBe('employer:validation.comment_required_for_changes');

    const adequate = canSubmitReview({
      draftSyllabusId: 'syl_123',
      verdict: 'CHANGES_SUGGESTED',
      comment: 'Requires additional practical sessions on battery isolation safety.',
    });
    expect(adequate.canSubmit).toBe(true);
  });

  it('validates mock curriculum review fixtures against submission readiness', () => {
    for (const rev of MOCK_CURRICULUM_REVIEWS) {
      expect(canSubmitReview(rev).canSubmit).toBe(true);
    }
  });
});

describe('Employer Zod Validation Schemas', () => {
  it('gstinSchema validates and normalizes valid GSTINs', () => {
    const parsed = gstinSchema.parse(' 27aapfu0939f1zv ');
    expect(parsed).toBe('27AAPFU0939F1ZV');
  });

  it('gstinSchema rejects invalid GSTIN inputs', () => {
    expect(() => gstinSchema.parse('27AAPFU0939F1Z0')).toThrow();
    expect(() => gstinSchema.parse('')).toThrow();
  });

  it('skillNeedSchema validates correct declaration payload', () => {
    const sample = MOCK_SKILL_NEEDS[0];
    const parsed = skillNeedSchema.parse(sample);
    expect(parsed.jobRole).toBe(sample.jobRole);
    expect(parsed.headcount).toBe(120);
  });

  it('skillNeedSchema rejects invalid headcount or missing skills', () => {
    expect(() =>
      skillNeedSchema.parse({
        quarter: '2026-Q3',
        jobRole: 'Technician',
        skills: [],
        headcount: -5,
        district: 'Pune',
        nsqfLevel: 4,
        urgency: 'IMMEDIATE',
      })
    ).toThrow();
  });

  it('surveySubmissionSchema validates structured survey answers', () => {
    const payload = {
      surveyId: 'srv_ev_pulse_2026_q3',
      answers: {
        q1: 5,
        q2: 'can_bus',
        q3: ['opt_a', 'opt_b'],
      },
    };
    const parsed = surveySubmissionSchema.parse(payload);
    expect(parsed.surveyId).toBe('srv_ev_pulse_2026_q3');
  });

  it('curriculumReviewSchema enforces comment length for CHANGES_SUGGESTED', () => {
    const valid = {
      draftSyllabusId: 'syl_101',
      verdict: 'CHANGES_SUGGESTED',
      comment: 'Please add 20 hours of hands-on calibration lab time.',
    };
    expect(() => curriculumReviewSchema.parse(valid)).not.toThrow();

    const invalid = {
      draftSyllabusId: 'syl_101',
      verdict: 'CHANGES_SUGGESTED',
      comment: 'Fix it',
    };
    expect(() => curriculumReviewSchema.parse(invalid)).toThrow();
  });
});
