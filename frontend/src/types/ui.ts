/**
 * Shared UI Enums and Types for MahaSkills
 * Spec: uiux.md §25, §7.3, §20
 */

export type GapSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export type WorkflowStatus =
  | 'DRAFT'
  | 'SSC_REVIEW'
  | 'DSEEI_APPROVAL'
  | 'UNDER_REVIEW'
  | 'VALIDATING'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'COMPLETED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'FAILED';

export type EmptyStateType =
  | 'first-use'
  | 'no-results'
  | 'not-ready'
  | 'not-applicable'
  | 'cleared';

export type GoodDirection = 'up' | 'down';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
