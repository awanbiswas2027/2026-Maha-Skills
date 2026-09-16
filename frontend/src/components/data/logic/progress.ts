export type ProgressTone = 'danger' | 'neutral' | 'success';

/**
 * Returns progress tone based on COL-03 thresholds:
 * < 25%: 'danger'
 * 25% to < 62%: 'neutral'
 * >= 62%: 'success'
 */
export function progressTone(rate: number): ProgressTone {
  if (rate < 25) {
    return 'danger';
  }
  if (rate < 62) {
    return 'neutral';
  }
  return 'success';
}

export interface MeterAriaProps {
  role: 'meter';
  'aria-valuenow': number;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuetext': string;
}

/**
 * Generates ARIA attributes for a progress meter element (role="meter").
 */
export function meterAria(
  value: number,
  target?: number,
  max: number = 100
): MeterAriaProps {
  const formattedVal = Math.round(value * 10) / 10;
  const ariaValueText =
    target !== undefined
      ? `${formattedVal}% (target ${target}%)`
      : `${formattedVal}%`;

  return {
    role: 'meter',
    'aria-valuenow': formattedVal,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuetext': ariaValueText,
  };
}
