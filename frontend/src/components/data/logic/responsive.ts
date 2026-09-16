export type ChartVariant = 'default' | 'lead';

/**
 * Determines whether a data table should switch to card rendering on mobile viewports.
 * Returns true if viewport width is less than 768px and a mobile card renderer is provided (TBL-21).
 */
export function shouldRenderCards(
  width: number,
  hasCardRenderer: boolean
): boolean {
  return width < 768 && Boolean(hasCardRenderer);
}

/**
 * Returns fixed chart height in pixels:
 * - 240px below 768px viewport width
 * - 280px for 'default' variant at 768px+
 * - 360px for 'lead' variant at 768px+
 */
export function chartHeight(
  width: number,
  variant: ChartVariant = 'default'
): number {
  if (width < 768) {
    return 240;
  }
  return variant === 'lead' ? 360 : 280;
}
