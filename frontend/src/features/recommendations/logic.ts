import { UserRole } from '../../types';
import {
  Decision,
  DecisionInput,
  DecisionResult,
  Dossier,
  GovernanceTier,
  Recommendation,
  RecommendationType,
  SlaStatusResult,
  TransitionRecord,
  WorkflowState,
  WorkflowStepItem,
} from './model';

/**
 * Transition table exactly matching Backend Architecture Specification §H.1.
 * DRAFT -> SSC_REVIEW (submit)
 * SSC_REVIEW -> CHANGES_REQUESTED (request changes)
 * SSC_REVIEW -> REJECTED (reject)
 * SSC_REVIEW -> DSEEI_APPROVAL (approve)
 * CHANGES_REQUESTED -> DRAFT (revise)
 * DSEEI_APPROVAL -> PUBLISHED (approve)
 * DSEEI_APPROVAL -> REJECTED (reject)
 * DSEEI_APPROVAL -> CHANGES_REQUESTED (request changes)
 * PUBLISHED, REJECTED are terminal.
 */
export const BE_H1_TRANSITIONS: Record<
  WorkflowState,
  Partial<Record<Decision | 'submit' | 'revise', WorkflowState>>
> = {
  DRAFT: {
    submit: 'SSC_REVIEW',
  },
  SSC_REVIEW: {
    APPROVE: 'DSEEI_APPROVAL',
    REQUEST_CHANGES: 'CHANGES_REQUESTED',
    REJECT: 'REJECTED',
  },
  CHANGES_REQUESTED: {
    revise: 'DRAFT',
  },
  DSEEI_APPROVAL: {
    APPROVE: 'PUBLISHED',
    REQUEST_CHANGES: 'CHANGES_REQUESTED',
    REJECT: 'REJECTED',
  },
  PUBLISHED: {},
  REJECTED: {},
};

/**
 * Standard statutory SLA working day allowances (Mon-Fri).
 * Note: Statutory holiday calendars are currently excluded in v1; standard 5-day work week is assumed.
 */
export const SLA_WORKING_DAYS = {
  SSC_REVIEW: 14,
  DSEEI_APPROVAL: 7,
} as const;

/**
 * Determines governance tier per OQ-05:
 * - High-impact: RETIRE_COURSE, DEVELOP_QUALIFICATION require DSEEI Joint Secretary approval.
 * - Minor elective: ADD_MODULE requires SSC Technical Committee ratification only.
 * - UPDATE_UNIT: Follows BE §H.1 requiring DSEEI_APPROVAL.
 */
export function governanceTier(type: RecommendationType): GovernanceTier {
  if (type === 'ADD_MODULE') {
    return 'SSC_RATIFICATION';
  }
  return 'DSEEI_APPROVAL';
}

/**
 * Calculates next state given recommendation state, decision, and recommendation type.
 * Takes into account tiered governance: SSC ratification publishes ADD_MODULE directly.
 */
export function getNextState(
  rec: Recommendation,
  decision: Decision
): WorkflowState | null {
  if (rec.state === 'SSC_REVIEW') {
    if (decision === 'APPROVE') {
      return governanceTier(rec.type) === 'SSC_RATIFICATION'
        ? 'PUBLISHED'
        : 'DSEEI_APPROVAL';
    }
    if (decision === 'REQUEST_CHANGES') {
      return 'CHANGES_REQUESTED';
    }
    if (decision === 'REJECT') {
      return 'REJECTED';
    }
  }

  if (rec.state === 'DSEEI_APPROVAL') {
    if (decision === 'APPROVE') {
      return 'PUBLISHED';
    }
    if (decision === 'REQUEST_CHANGES') {
      return 'CHANGES_REQUESTED';
    }
    if (decision === 'REJECT') {
      return 'REJECTED';
    }
  }

  return null;
}

/**
 * Checks allowed decisions for a given actor role and sector scope.
 * - Terminal states (PUBLISHED, REJECTED) have no allowed decisions.
 * - Role must match rec.current_step_role.
 * - SSC reviewer can only decide on recommendations in their assigned sectors.
 * - POLICY_MAKER only at DSEEI step.
 */
export function allowedDecisions(
  rec: Recommendation,
  role: UserRole | string,
  userSectorIds?: number[]
): Decision[] {
  if (rec.state === 'PUBLISHED' || rec.state === 'REJECTED') {
    return [];
  }

  if (!rec.current_step_role || rec.current_step_role !== role) {
    return [];
  }

  if (rec.state === 'SSC_REVIEW') {
    if (role !== 'SSC_REVIEWER') {
      return [];
    }
    if (userSectorIds !== undefined && !userSectorIds.includes(rec.sector_id)) {
      return [];
    }
    return ['APPROVE', 'REQUEST_CHANGES', 'REJECT'];
  }

  if (rec.state === 'DSEEI_APPROVAL') {
    if (role !== 'POLICY_MAKER') {
      return [];
    }
    return ['APPROVE', 'REQUEST_CHANGES', 'REJECT'];
  }

  return [];
}

/**
 * Validates complete evidence package before leaving DRAFT (BE §H.1 guard).
 * Requires: trigger rule, reasons, sources, uplift percentage and basis, affected districts.
 * If dossier is supplied, requires demand trend, top employers, comparables, and affected districts.
 */
export function hasCompleteEvidence(
  rec: Recommendation,
  dossier?: Dossier
): boolean {
  if (!rec.trigger_rule || rec.trigger_rule.trim().length === 0) {
    return false;
  }

  if (!rec.reasons || rec.reasons.length === 0) {
    return false;
  }

  if (!rec.sources || rec.sources.length === 0) {
    return false;
  }

  if (!rec.district_ids || rec.district_ids.length === 0) {
    return false;
  }

  if (typeof rec.estimated_uplift_pct !== 'number' || rec.estimated_uplift_pct < 0) {
    return false;
  }

  if (!rec.uplift_basis || rec.uplift_basis.trim().length === 0) {
    return false;
  }

  if (dossier) {
    if (!dossier.demand_trend_12m || dossier.demand_trend_12m.length === 0) {
      return false;
    }
    if (!dossier.top_employers || dossier.top_employers.length === 0) {
      return false;
    }
    if (!dossier.comparable_courses || dossier.comparable_courses.length === 0) {
      return false;
    }
    if (!dossier.affected_districts || dossier.affected_districts.length === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Calculates working days between two dates (Mon-Fri only).
 * Note: Does not include public holidays.
 * Returns negative if due date is in the past.
 */
export function calculateWorkingDaysLeft(
  slaDueAt: string | Date,
  now: string | Date = new Date()
): number {
  const targetDate = new Date(slaDueAt);
  const currentDate = new Date(now);

  const start = new Date(
    Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  );
  const due = new Date(
    Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  );

  if (start.getTime() === due.getTime()) {
    if (currentDate.getTime() > targetDate.getTime()) {
      return -1;
    }
    return 0;
  }

  if (start.getTime() < due.getTime()) {
    let count = 0;
    const cur = new Date(start);
    while (cur.getTime() < due.getTime()) {
      cur.setUTCDate(cur.getUTCDate() + 1);
      const day = cur.getUTCDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
    }
    return count;
  }

  let overdueCount = 0;
  const cur = new Date(due);
  while (cur.getTime() < start.getTime()) {
    cur.setUTCDate(cur.getUTCDate() + 1);
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) {
      overdueCount++;
    }
  }
  return -Math.max(1, overdueCount);
}

/**
 * Helper to compute an SLA deadline working days in advance (Mon-Fri).
 */
export function calculateSlaDueDate(
  startDate: string | Date = new Date(),
  workingDays: number = SLA_WORKING_DAYS.SSC_REVIEW
): string {
  const date = new Date(startDate);
  let added = 0;
  while (added < workingDays) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return date.toISOString();
}

/**
 * Evaluates SLA status and tone:
 * - 'danger' if overdue (workingDaysLeft < 0)
 * - 'warning' if <= 2 working days left
 * - 'neutral' if > 2 working days left
 */
export function slaStatus(
  rec: Recommendation,
  now: string | Date = new Date()
): SlaStatusResult {
  const workingDaysLeft = calculateWorkingDaysLeft(rec.sla_due_at, now);

  if (workingDaysLeft < 0) {
    return {
      tone: 'danger',
      workingDaysLeft,
    };
  }

  if (workingDaysLeft <= 2) {
    return {
      tone: 'warning',
      workingDaysLeft,
    };
  }

  return {
    tone: 'neutral',
    workingDaysLeft,
  };
}

/**
 * Checks if recommendation is stale based on generation timestamp and revalidation window (default 56 days).
 */
export function isStale(
  rec: Recommendation,
  now: string | Date = new Date(),
  windowDays = 56
): boolean {
  const gen = new Date(rec.generated_at).getTime();
  const current = new Date(now).getTime();
  const diffDays = (current - gen) / (1000 * 60 * 60 * 24);
  return diffDays > windowDays;
}

/**
 * Generates workflow stepper steps and states based on governance tier and current state.
 */
export function workflowSteps(rec: Recommendation): WorkflowStepItem[] {
  const isSscOnly = governanceTier(rec.type) === 'SSC_RATIFICATION';

  const baseSteps: Array<{ id: string; labelKey: string; targetState: WorkflowState }> = isSscOnly
    ? [
        { id: 'draft', labelKey: 'recommendations:stepper.draft', targetState: 'DRAFT' },
        { id: 'ssc_review', labelKey: 'recommendations:stepper.ssc_review', targetState: 'SSC_REVIEW' },
        { id: 'published', labelKey: 'recommendations:stepper.published', targetState: 'PUBLISHED' },
      ]
    : [
        { id: 'draft', labelKey: 'recommendations:stepper.draft', targetState: 'DRAFT' },
        { id: 'ssc_review', labelKey: 'recommendations:stepper.ssc_review', targetState: 'SSC_REVIEW' },
        { id: 'dseei_approval', labelKey: 'recommendations:stepper.dseei_approval', targetState: 'DSEEI_APPROVAL' },
        { id: 'published', labelKey: 'recommendations:stepper.published', targetState: 'PUBLISHED' },
      ];

  const stateOrder = isSscOnly
    ? ['DRAFT', 'SSC_REVIEW', 'PUBLISHED']
    : ['DRAFT', 'SSC_REVIEW', 'DSEEI_APPROVAL', 'PUBLISHED'];

  let activeIndex = stateOrder.indexOf(rec.state);

  if (rec.state === 'CHANGES_REQUESTED') {
    activeIndex = stateOrder.indexOf('SSC_REVIEW');
  } else if (rec.state === 'REJECTED') {
    activeIndex = rec.current_step_role === 'POLICY_MAKER' ? stateOrder.indexOf('DSEEI_APPROVAL') : stateOrder.indexOf('SSC_REVIEW');
  }

  return baseSteps.map((step, idx) => {
    let state: 'current' | 'done' | 'upcoming';
    if (rec.state === 'PUBLISHED') {
      state = 'done';
    } else if (idx < activeIndex) {
      state = 'done';
    } else if (idx === activeIndex) {
      state = 'current';
    } else {
      state = 'upcoming';
    }
    return {
      id: step.id,
      labelKey: step.labelKey,
      state,
    };
  });
}

/**
 * Applies a review decision to a recommendation.
 * Enforces all server-side transition guards:
 * 1. Terminality: PUBLISHED and REJECTED accept no transitions.
 * 2. Concurrency: If-Match on version; mismatch produces CONFLICT.
 * 3. Role/Step Guard: role must match current_step_role and sector assignment.
 * 4. Comment: REJECT and REQUEST_CHANGES require non-empty comment.
 * 5. Evidence: Must satisfy complete evidence requirement.
 */
export function applyDecision(
  rec: Recommendation,
  decision: Decision,
  options: DecisionInput,
  dossier?: Dossier
): DecisionResult {
  // 1. Terminal check
  if (rec.state === 'PUBLISHED' || rec.state === 'REJECTED') {
    return { ok: false, error: 'ALREADY_DECIDED' };
  }

  // 2. Concurrency check
  if (options.ifMatchVersion !== rec.version) {
    return { ok: false, error: 'CONFLICT' };
  }

  // 3. Step and Role authorization guard
  const allowed = allowedDecisions(rec, options.role, options.userSectorIds);
  if (!allowed.includes(decision)) {
    return { ok: false, error: 'NOT_YOUR_STEP' };
  }

  // 4. Comment requirement guard
  if (decision === 'REJECT' || decision === 'REQUEST_CHANGES') {
    if (!options.comment || options.comment.trim().length === 0) {
      return { ok: false, error: 'COMMENT_REQUIRED' };
    }
  }

  // 5. Evidence completeness guard
  if (!hasCompleteEvidence(rec, dossier)) {
    return { ok: false, error: 'EVIDENCE_INCOMPLETE' };
  }

  // 6. Compute next state
  const nextState = getNextState(rec, decision);
  if (!nextState) {
    return { ok: false, error: 'NOT_YOUR_STEP' };
  }

  let nextRole: 'SSC_REVIEWER' | 'POLICY_MAKER' | null = null;
  let nextSlaDueAt = rec.sla_due_at;

  if (nextState === 'DSEEI_APPROVAL') {
    nextRole = 'POLICY_MAKER';
    nextSlaDueAt = calculateSlaDueDate(new Date(), SLA_WORKING_DAYS.DSEEI_APPROVAL);
  } else if (nextState === 'SSC_REVIEW') {
    nextRole = 'SSC_REVIEWER';
    nextSlaDueAt = calculateSlaDueDate(new Date(), SLA_WORKING_DAYS.SSC_REVIEW);
  }

  const transition: TransitionRecord = {
    id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recommendation_id: rec.id,
    from_state: rec.state,
    to_state: nextState,
    decision,
    actor_role: (options.role as UserRole) || 'SYSTEM',
    actor_id: options.actorId,
    comment: options.comment?.trim(),
    transitioned_at: new Date().toISOString(),
  };

  const next: Recommendation = {
    ...rec,
    state: nextState,
    current_step_role: nextRole,
    version: rec.version + 1,
    sla_due_at: nextSlaDueAt,
  };

  return {
    ok: true,
    next,
    transition,
  };
}
