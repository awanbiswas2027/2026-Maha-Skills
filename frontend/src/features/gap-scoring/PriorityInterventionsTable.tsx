import React from 'react';
import { useTranslation } from 'react-i18next';
import { GapScoreItem } from '../../types/api';
import { MOCK_GAP_SCORES } from './gapScoringData';
import { ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

interface PriorityInterventionsTableProps {
  items?: GapScoreItem[];
  limit?: number;
}

export const PriorityInterventionsTable: React.FC<PriorityInterventionsTableProps> = ({
  items = MOCK_GAP_SCORES,
  limit = 10,
}) => {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  const sortedItems = [...items]
    .sort((a, b) => b.gap_score - a.gap_score)
    .slice(0, limit);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'MODERATE':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10 text-rose-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-base text-foreground">
              {t('dashboard.priority_trades_title', 'Top 10 Urgent Trade Shortages in Maharashtra')}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            NCVET / DVET Action Queue
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {t('dashboard.priority_trades_subtitle', 'Ranked by standardized algorithmic gap score index requiring immediate seat expansion or NCVET syllabus modernization.')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/60 border-b border-border text-muted-foreground font-semibold">
            <tr>
              <th className="p-3 text-center w-12">{t('gap.rank', '#')}</th>
              <th className="p-3">{t('gap.trade_role', 'Trade / NSQF Job Role')}</th>
              <th className="p-3">{t('common.district', 'District')}</th>
              <th className="p-3 text-center">{t('gap.demand', 'Demand')}</th>
              <th className="p-3 text-center">{t('gap.capacity', 'Capacity')}</th>
              <th className="p-3 text-center">{t('common.placement_rate', 'Placement')}</th>
              <th className="p-3 text-center">{t('gap.score', 'Gap Score')}</th>
              <th className="p-3 text-center">{t('gap.severity', 'Severity')}</th>
              <th className="p-3 text-right">{t('gap.action', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedItems.map((item, index) => {
              const tradeTitle = isMarathi
                ? item.job_role_title_mr
                : isHindi
                ? item.job_role_title_hi
                : item.job_role_title_en;

              const districtName = isMarathi
                ? item.district_name_mr
                : isHindi
                ? item.district_name_hi
                : item.district_name_en;

              return (
                <tr key={item.id} className="hover:bg-muted/25 transition-colors">
                  <td className="p-3 text-center font-bold text-muted-foreground">
                    #{index + 1}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-foreground">{tradeTitle}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.sector_name} · <span className="font-mono">{item.qp_code}</span> (NSQF {item.nsqf_level})
                    </div>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {districtName}
                  </td>
                  <td className="p-3 text-center font-bold text-foreground">
                    {item.demand_count.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center text-muted-foreground">
                    {item.trained_capacity.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center font-semibold text-emerald-700 dark:text-emerald-400">
                    {item.placement_rate}%
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-extrabold text-xs text-foreground">
                      {item.gap_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${getSeverityBadge(
                        item.severity_level
                      )}`}
                    >
                      {item.trend_direction === 'RISING' && (
                        <TrendingUp className="h-2.5 w-2.5" />
                      )}
                      <span>{item.severity_level}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] gap-1 px-2.5 hover:border-primary/60"
                    >
                      <Link to="/recommendations">
                        <span>{t('gap.review_recommendation', 'Review')}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
