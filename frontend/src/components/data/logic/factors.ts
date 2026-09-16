export interface FactorInput {
  factor: string;
  label: string;
  contribution: number;
  weight: number;
}

export interface FactorRow extends FactorInput {
  ratio: number;
}

export interface FactorTotal {
  factor: string;
  label: string;
  contribution: number;
  weight: number;
  ratio: number;
}

export interface FactorBreakdownResult {
  rows: FactorRow[];
  total: FactorTotal;
}

/**
 * Transforms factor inputs into display rows with computed ratios (contribution / weight)
 * and calculates the total row.
 * Includes a development assertion when contributions do not equal the reported total.
 */
export function factorRows(
  factorsOrConfig: FactorInput[] | { factors: FactorInput[]; total?: number },
  reportedTotalArg?: number
): FactorBreakdownResult {
  const factors = Array.isArray(factorsOrConfig)
    ? factorsOrConfig
    : factorsOrConfig.factors;

  const reportedTotal = Array.isArray(factorsOrConfig)
    ? reportedTotalArg
    : reportedTotalArg ?? factorsOrConfig.total;

  const sumContributions = factors.reduce((sum, f) => sum + f.contribution, 0);
  const sumWeights = factors.reduce((sum, f) => sum + f.weight, 0);

  if (
    reportedTotal !== undefined &&
    Math.abs(sumContributions - reportedTotal) > 0.001
  ) {
    const isDev =
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.NODE_ENV !== 'production') ||
      (typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV));

    if (isDev) {
      throw new Error(
        `[factors] Dev assertion failed: contributions sum (${sumContributions}) does not match reported total (${reportedTotal})`
      );
    }
  }

  const rows: FactorRow[] = factors.map((f) => ({
    ...f,
    ratio: f.weight > 0 ? f.contribution / f.weight : 0,
  }));

  const total: FactorTotal = {
    factor: 'total',
    label: 'Total',
    contribution: sumContributions,
    weight: sumWeights,
    ratio: sumWeights > 0 ? sumContributions / sumWeights : 0,
  };

  return { rows, total };
}
