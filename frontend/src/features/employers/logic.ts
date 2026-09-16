/**
 * MahaSkills — Employer Portal Business Logic
 * Problem Statement ID: 26134
 *
 * Pure functions for quarter generation, skill need completeness scoring,
 * 2-minute pulse survey progress tracking, and curriculum review submission readiness.
 */

import type { SkillNeed, Survey, CurriculumReview } from './model';

export interface QuarterOption {
  value: string;
  label: string;
  year: number;
  quarter: number;
}

/**
 * Generates an array of selectable fiscal/calendar quarter options starting
 * from the current quarter up to `count` forward quarters (default: 6 quarters).
 */
export function quarterOptions(now: Date = new Date(), count: number = 6): QuarterOption[] {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 to 11
  let currentQuarter = Math.floor(currentMonth / 3) + 1; // 1 to 4
  let year = currentYear;

  const options: QuarterOption[] = [];

  for (let i = 0; i < count; i++) {
    const value = `${year}-Q${currentQuarter}`;
    const label = `Q${currentQuarter} ${year}`;

    options.push({
      value,
      label,
      year,
      quarter: currentQuarter,
    });

    currentQuarter++;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      year++;
    }
  }

  return options;
}

export interface SkillNeedCompletenessResult {
  isComplete: boolean;
  score: number; // 0 to 1
  percentage: number; // 0 to 100
  missingFields: string[];
}

/**
 * Calculates completeness score and identifies missing fields for a draft skill need declaration.
 */
export function skillNeedCompleteness(draft: Partial<SkillNeed> | null | undefined): SkillNeedCompletenessResult {
  if (!draft) {
    return {
      isComplete: false,
      score: 0,
      percentage: 0,
      missingFields: ['quarter', 'jobRole', 'skills', 'headcount', 'district', 'nsqfLevel', 'urgency'],
    };
  }

  const missing: string[] = [];

  if (!draft.quarter || typeof draft.quarter !== 'string' || draft.quarter.trim() === '') {
    missing.push('quarter');
  }

  if (!draft.jobRole || typeof draft.jobRole !== 'string' || draft.jobRole.trim().length < 2) {
    missing.push('jobRole');
  }

  if (!Array.isArray(draft.skills) || draft.skills.length === 0 || draft.skills.every((s) => !s || s.trim() === '')) {
    missing.push('skills');
  }

  if (typeof draft.headcount !== 'number' || isNaN(draft.headcount) || draft.headcount <= 0) {
    missing.push('headcount');
  }

  const hasDistrict = (typeof draft.district === 'string' && draft.district.trim().length > 0) ||
    (typeof draft.districtId === 'number' && draft.districtId > 0);
  if (!hasDistrict) {
    missing.push('district');
  }

  if (typeof draft.nsqfLevel !== 'number' || isNaN(draft.nsqfLevel) || draft.nsqfLevel < 1 || draft.nsqfLevel > 10) {
    missing.push('nsqfLevel');
  }

  const validUrgencies = ['IMMEDIATE', 'QUARTERLY', 'FUTURE'];
  if (!draft.urgency || !validUrgencies.includes(draft.urgency)) {
    missing.push('urgency');
  }

  const totalFields = 7;
  const completedCount = totalFields - missing.length;
  const score = completedCount / totalFields;
  const percentage = Math.round(score * 100);

  return {
    isComplete: missing.length === 0,
    score,
    percentage,
    missingFields: missing,
  };
}

export interface SurveyProgressResult {
  answeredCount: number;
  totalCount: number;
  percentage: number;
  isComplete: boolean;
  unansweredQuestionIds: string[];
}

/**
 * Computes completion progress and lists unanswered questions for a pulse survey.
 */
export function surveyProgress(
  answers: Record<string, unknown> | null | undefined,
  survey: Survey | null | undefined
): SurveyProgressResult {
  if (!survey || !Array.isArray(survey.questions) || survey.questions.length === 0) {
    return {
      answeredCount: 0,
      totalCount: 0,
      percentage: 0,
      isComplete: true,
      unansweredQuestionIds: [],
    };
  }

  const totalCount = survey.questions.length;
  const safeAnswers = answers || {};
  const unansweredQuestionIds: string[] = [];
  let answeredCount = 0;

  for (const question of survey.questions) {
    const ans = safeAnswers[question.id];
    let isAnswered = false;

    if (typeof ans === 'number' && !isNaN(ans) && ans > 0) {
      isAnswered = true;
    } else if (typeof ans === 'string' && ans.trim().length > 0) {
      isAnswered = true;
    } else if (Array.isArray(ans) && ans.length > 0) {
      isAnswered = true;
    }

    if (isAnswered) {
      answeredCount++;
    } else {
      unansweredQuestionIds.push(question.id);
    }
  }

  const percentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 100;
  const isComplete = answeredCount === totalCount;

  return {
    answeredCount,
    totalCount,
    percentage,
    isComplete,
    unansweredQuestionIds,
  };
}

export interface CanSubmitReviewResult {
  canSubmit: boolean;
  reason?: string;
}

/**
 * Validates whether an employer curriculum review draft meets submission criteria.
 * Non-endorsing verdicts require substantive written feedback.
 */
export function canSubmitReview(review: Partial<CurriculumReview> | null | undefined): CanSubmitReviewResult {
  if (!review) {
    return { canSubmit: false, reason: 'employer:validation.syllabus_required' };
  }

  if (!review.draftSyllabusId || review.draftSyllabusId.trim() === '') {
    return { canSubmit: false, reason: 'employer:validation.syllabus_required' };
  }

  const validVerdicts = ['ENDORSED', 'CHANGES_SUGGESTED', 'NOT_RELEVANT'];
  if (!review.verdict || !validVerdicts.includes(review.verdict)) {
    return { canSubmit: false, reason: 'employer:validation.verdict_required' };
  }

  if (review.verdict !== 'ENDORSED') {
    const comment = review.comment ? review.comment.trim() : '';
    if (comment.length < 10) {
      return { canSubmit: false, reason: 'employer:validation.comment_required_for_changes' };
    }
  }

  return { canSubmit: true };
}
