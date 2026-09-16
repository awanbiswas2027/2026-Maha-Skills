/**
 * MahaSkills — Employer Portal Domain Models
 * Problem Statement ID: 26134
 *
 * Types for employer industrial skill needs declarations, rapid 2-minute
 * pulse surveys, syllabus validation reviews, and GSTIN verification.
 */

export type SkillNeedUrgency = 'IMMEDIATE' | 'QUARTERLY' | 'FUTURE';

export interface SkillNeed {
  id: string;
  quarter: string;
  jobRole: string;
  skills: string[];
  headcount: number;
  district: string;
  districtId?: number;
  nsqfLevel: number;
  urgency: SkillNeedUrgency;
  createdAt?: string;
}

export type SurveyQuestionType = 'rating' | 'single' | 'multi';

export interface SurveyQuestionOption {
  label: string;
  value: string;
}

export interface SurveyQuestion {
  id: string;
  sequence: number;
  prompt: string;
  promptMr?: string;
  promptHi?: string;
  type: SurveyQuestionType;
  options?: SurveyQuestionOption[];
  minRating?: number;
  maxRating?: number;
  required?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  titleMr?: string;
  titleHi?: string;
  description?: string;
  sectorId?: number;
  sectorName?: string;
  questions: SurveyQuestion[];
  estimatedMinutes: number;
  opensAt: string;
  closesAt: string;
}

export type SurveyAnswerValue = number | string | string[];

export type SurveyAnswers = Record<string, SurveyAnswerValue>;

export type CurriculumReviewVerdict = 'ENDORSED' | 'CHANGES_SUGGESTED' | 'NOT_RELEVANT';

export interface CurriculumReview {
  id?: string;
  draftSyllabusId: string;
  draftTitle?: string;
  courseCode?: string;
  verdict: CurriculumReviewVerdict;
  comment: string;
  reviewerOrganization?: string;
  submittedAt?: string;
}

export interface GSTINValidationResult {
  isValid: boolean;
  error?: string;
  stateCode?: string;
  pan?: string;
  entityCode?: string;
  checkDigit?: string;
}

export const SKILL_NEED_URGENCY_I18N: Record<SkillNeedUrgency, string> = {
  IMMEDIATE: 'employer:urgency.immediate',
  QUARTERLY: 'employer:urgency.quarterly',
  FUTURE: 'employer:urgency.future',
};

export const CURRICULUM_REVIEW_VERDICT_I18N: Record<CurriculumReviewVerdict, string> = {
  ENDORSED: 'employer:review.verdict_endorsed',
  CHANGES_SUGGESTED: 'employer:review.verdict_changes_suggested',
  NOT_RELEVANT: 'employer:review.verdict_not_relevant',
};
