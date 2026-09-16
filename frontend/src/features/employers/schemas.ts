/**
 * MahaSkills — Employer Portal Validation Schemas & GSTIN Validator
 * Problem Statement ID: 26134
 *
 * Implements official GSTIN structural and Luhn mod-36 check digit validation,
 * as well as Zod validation schemas for skill needs, pulse surveys, and curriculum reviews.
 */

import { z } from 'zod';
import type { GSTINValidationResult } from './model';

const GSTIN_CHAR_SET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Calculates the official GSTIN 15th check digit for a 14-character GSTIN prefix
 * using the Luhn mod-36 algorithm.
 */
export function calculateGstinCheckDigit(first14: string): string {
  if (first14.length !== 14) {
    throw new Error(`Expected 14 characters for GSTIN check digit calculation, got ${first14.length}`);
  }

  const upper = first14.toUpperCase();
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const char = upper[i];
    const val = GSTIN_CHAR_SET.indexOf(char);
    if (val === -1) {
      throw new Error(`Invalid alphanumeric character '${char}' at index ${i}`);
    }

    const factor = i % 2 === 0 ? 1 : 2;
    const product = val * factor;
    const quotient = Math.floor(product / 36);
    const remainder = product % 36;
    sum += quotient + remainder;
  }

  const remainder36 = sum % 36;
  const checkDigitIndex = (36 - remainder36) % 36;
  return GSTIN_CHAR_SET[checkDigitIndex];
}

/**
 * Validates an Indian Goods and Services Tax Identification Number (GSTIN):
 * 1. Must be exactly 15 characters long.
 * 2. Positions 1-2: Valid State/UT code (01 to 38).
 * 3. Positions 3-12: Valid PAN format (5 letters, 4 numbers, 1 letter).
 * 4. Position 13: Entity code (1-9 or A-Z).
 * 5. Position 14: Default character 'Z'.
 * 6. Position 15: Check digit matching Luhn mod-36 algorithm.
 */
export function validateGSTIN(gstin: string): GSTINValidationResult {
  if (!gstin || typeof gstin !== 'string') {
    return { isValid: false, error: 'employer:gstin.error_empty' };
  }

  const trimmed = gstin.trim().toUpperCase();

  if (trimmed.length !== 15) {
    return { isValid: false, error: 'employer:gstin.error_length' };
  }

  // State Code (01-38)
  const stateCodeStr = trimmed.slice(0, 2);
  const stateCode = parseInt(stateCodeStr, 10);
  if (isNaN(stateCode) || stateCode < 1 || stateCode > 38 || !/^\d{2}$/.test(stateCodeStr)) {
    return { isValid: false, error: 'employer:gstin.error_state_code', stateCode: stateCodeStr };
  }

  // PAN Format (5 letters, 4 numbers, 1 letter)
  const pan = trimmed.slice(2, 12);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan)) {
    return { isValid: false, error: 'employer:gstin.error_pan_format', stateCode: stateCodeStr, pan };
  }

  // 13th Character (Entity Code: 1-9 or A-Z)
  const entityCode = trimmed[12];
  if (!/^[1-9A-Z]$/.test(entityCode)) {
    return { isValid: false, error: 'employer:gstin.error_entity_code', stateCode: stateCodeStr, pan, entityCode };
  }

  // 14th Character (Default 'Z')
  if (trimmed[13] !== 'Z') {
    return { isValid: false, error: 'employer:gstin.error_fourteenth_z', stateCode: stateCodeStr, pan, entityCode };
  }

  // 15th Character (Check Digit)
  const expectedCheckDigit = calculateGstinCheckDigit(trimmed.slice(0, 14));
  const actualCheckDigit = trimmed[14];

  if (actualCheckDigit !== expectedCheckDigit) {
    return {
      isValid: false,
      error: 'employer:gstin.error_checksum_mismatch',
      stateCode: stateCodeStr,
      pan,
      entityCode,
      checkDigit: actualCheckDigit,
    };
  }

  return {
    isValid: true,
    stateCode: stateCodeStr,
    pan,
    entityCode,
    checkDigit: actualCheckDigit,
  };
}

export const gstinSchema = z
  .string()
  .min(1, 'employer:validation.gstin_required')
  .transform((v) => v.trim().toUpperCase())
  .refine((val) => validateGSTIN(val).isValid, {
    message: 'employer:validation.gstin_invalid',
  });

export const skillNeedSchema = z.object({
  id: z.string().optional(),
  quarter: z.string().min(1, 'employer:validation.quarter_required'),
  jobRole: z.string().min(2, 'employer:validation.job_role_required'),
  skills: z.array(z.string().min(1)).min(1, 'employer:validation.skills_required'),
  headcount: z.number().int().min(1, 'employer:validation.headcount_min'),
  district: z.string().min(1, 'employer:validation.district_required'),
  districtId: z.number().int().optional(),
  nsqfLevel: z.number().int().min(1).max(10, 'employer:validation.nsqf_level_range'),
  urgency: z.enum(['IMMEDIATE', 'QUARTERLY', 'FUTURE']),
  createdAt: z.string().optional(),
});

export const surveyAnswerValueSchema = z.union([
  z.number().int().min(1).max(5),
  z.string().min(1),
  z.array(z.string()).min(1),
]);

export const surveySubmissionSchema = z.object({
  surveyId: z.string().min(1, 'employer:validation.survey_id_required'),
  answers: z.record(surveyAnswerValueSchema),
});

export const curriculumReviewSchema = z
  .object({
    id: z.string().optional(),
    draftSyllabusId: z.string().min(1, 'employer:validation.syllabus_required'),
    draftTitle: z.string().optional(),
    courseCode: z.string().optional(),
    verdict: z.enum(['ENDORSED', 'CHANGES_SUGGESTED', 'NOT_RELEVANT']),
    comment: z.string(),
    reviewerOrganization: z.string().optional(),
    submittedAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.verdict !== 'ENDORSED' && (!data.comment || data.comment.trim().length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['comment'],
        message: 'employer:validation.comment_required_for_changes',
      });
    }
  });
