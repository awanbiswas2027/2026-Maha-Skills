import { describe, it, expect } from 'vitest';
import { statusBadgeSpec } from '../StatusBadge';
import { severitySpec } from '../SeverityBadge';
import { deltaTone } from '../MetricStrip';
import { fieldAria } from '../FormField';
import type { IconButtonProps } from '../../ui/icon-button';
import type { WorkflowStatus, GapSeverity } from '../../../types/ui';

describe('StatusBadge logic (statusBadgeSpec)', () => {
  const allStatuses: WorkflowStatus[] = [
    'DRAFT',
    'SSC_REVIEW',
    'DSEEI_APPROVAL',
    'UNDER_REVIEW',
    'VALIDATING',
    'CHANGES_REQUESTED',
    'APPROVED',
    'PUBLISHED',
    'COMPLETED',
    'ACTIVE',
    'REJECTED',
    'FAILED',
  ];

  it('maps every WorkflowStatus to a valid variant, glyph, and labelKey', () => {
    for (const status of allStatuses) {
      const spec = statusBadgeSpec(status);
      expect(spec.variant).toBeDefined();
      expect(spec.glyph).toBeDefined();
      expect(spec.labelKey).toBe(`status.${status.toLowerCase()}`);
      expect(spec.className).toBeDefined();
    }
  });

  it('assigns correct subtle tokens and glyphs per §25.2 spec', () => {
    expect(statusBadgeSpec('DRAFT')).toMatchObject({
      variant: 'neutral',
      glyph: 'none',
      className: expect.stringContaining('bg-muted'),
    });

    expect(statusBadgeSpec('SSC_REVIEW')).toMatchObject({
      variant: 'info',
      glyph: 'Info',
      className: expect.stringContaining('bg-info-subtle'),
    });

    expect(statusBadgeSpec('CHANGES_REQUESTED')).toMatchObject({
      variant: 'warning',
      glyph: 'TriangleAlert',
      className: expect.stringContaining('bg-warning-subtle'),
    });

    expect(statusBadgeSpec('APPROVED')).toMatchObject({
      variant: 'success',
      glyph: 'CircleCheck',
      className: expect.stringContaining('bg-success-subtle'),
    });

    expect(statusBadgeSpec('REJECTED')).toMatchObject({
      variant: 'danger',
      glyph: 'OctagonAlert',
      className: expect.stringContaining('bg-danger-subtle'),
    });
  });

  it('pairs every subtle background with its subtle-foreground (C004 contrast fix)', () => {
    const testStatus = {
      info: 'UNDER_REVIEW',
      success: 'APPROVED',
      warning: 'CHANGES_REQUESTED',
      danger: 'REJECTED'
    } as const;
    
    for (const tone of ['info', 'success', 'warning', 'danger'] as const) {
      const spec = statusBadgeSpec(testStatus[tone] as WorkflowStatus);
      expect(spec.className).toContain(`bg-${tone}-subtle`);
      expect(spec.className).toContain(`text-${tone}-subtle-foreground`);
    }
  });
});

describe('SeverityBadge logic (severitySpec & GAP-01)', () => {
  const severities: GapSeverity[] = ['LOW', 'MEDIUM', 'HIGH'];

  it('maps each severity to gap tokens and GAP-01 glyphs', () => {
    for (const s of severities) {
      const spec = severitySpec(s);
      expect(spec.bgClass).toBe(`bg-gap-${s.toLowerCase()}`);
      expect(spec.textClass).toBe(`text-gap-${s.toLowerCase()}-foreground`);
      expect(spec.labelKey).toBe(`gap.severity.${s.toLowerCase()}`);
    }

    expect(severitySpec('LOW').glyph).toBe('none');
    expect(severitySpec('MEDIUM').glyph).toBe('TriangleAlert');
    expect(severitySpec('HIGH').glyph).toBe('OctagonAlert');
  });
});

describe('MetricStrip deltaTone (COL-02)', () => {
  it('handles up-good direction', () => {
    expect(deltaTone(100, 'up')).toBe('success');
    expect(deltaTone(-50, 'up')).toBe('destructive');
    expect(deltaTone(0, 'up')).toBe('neutral');
  });

  it('handles down-good direction (e.g. gap shortage / attrition)', () => {
    expect(deltaTone(-50, 'down')).toBe('success');
    expect(deltaTone(100, 'down')).toBe('destructive');
    expect(deltaTone(0, 'down')).toBe('neutral');
  });
});

describe('FormField fieldAria (FRM-05..09)', () => {
  it('wires aria-required when required is true', () => {
    const res = fieldAria('email-field', { required: true });
    expect(res['aria-required']).toBe(true);
    expect(res['aria-invalid']).toBeUndefined();
    expect(res['aria-describedby']).toBeUndefined();
  });

  it('wires aria-invalid and error ID when error is present', () => {
    const res = fieldAria('name-field', { error: 'Required field' });
    expect(res['aria-invalid']).toBe(true);
    expect(res['aria-describedby']).toBe('name-field-error');
  });

  it('wires helper ID when helper is present', () => {
    const res = fieldAria('phone-field', { helper: 'Format: 10 digits' });
    expect(res['aria-describedby']).toBe('phone-field-helper');
  });

  it('combines error and helper IDs in aria-describedby', () => {
    const res = fieldAria('user-field', {
      error: 'Invalid format',
      helper: 'Enter alphanumeric',
    });
    expect(res['aria-invalid']).toBe(true);
    expect(res['aria-describedby']).toBe('user-field-error user-field-helper');
  });
});

describe('IconButton type contract', () => {
  it('requires label prop at TypeScript compile time', () => {
    const validProps: IconButtonProps = {
      label: 'Close dialog',
      icon: null,
    };
    expect(validProps.label).toBe('Close dialog');

    // @ts-expect-error - label is mandatory per spec
    const invalidProps: IconButtonProps = {
      icon: null,
    };
    expect(invalidProps).toBeDefined();
  });
});
