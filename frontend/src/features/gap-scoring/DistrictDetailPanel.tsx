import React from 'react';
import { useTranslation } from 'react-i18next';
import { DistrictGapAggregate } from '../../types/api';
import { MOCK_GAP_SCORES, MOCK_OVERSUPPLY_ALERTS } from './gapScoringData';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

interface DistrictDetailPanelProps {
  district: DistrictGapAggregate | null;
}

export const DistrictDetailPanel: React.FC<DistrictDetailPanelProps> = ({ district }) => {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  if (!district) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card">
        <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
        <h4 className="font-bold text-sm text-foreground">
          {t('gap.district_inspector', 'District Detail Inspector')}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {t('gap.select_district_prompt', 'Click any district block on the heatmap to view local trade breakdown and institutional capacities.')}
        </p>
      </div>
    );
  }

  const districtName = isMarathi
    ? district.name_mr
    : isHindi
    ? district.name_hi
    : district.name_en;

  // Filter granular trades for this district
  const districtTrades = MOCK_GAP_SCORES.filter((g) => g.district_id === district.id);

  // Filter oversupply alerts for this district
  const districtOversupply = MOCK_OVERSUPPLY_ALERTS.filter(
    (o) => o.district_name.toLowerCase() === district.name_en.toLowerCase()
  );

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'MODERATE':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'LOW':
      default:
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const netShortage = Math.max(0, district.total_vacancies - district.total_capacity);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
            <span>{district.division} {isMarathi ? 'विभाग' : 'Division'}</span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground">
            {districtName} ({district.code})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {district.iti_count} {isMarathi ? 'शासकीय व अनुदानित संस्था' : 'Government & Aided ITIs'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-extrabold ${getSeverityBadgeClass(
              district.severity_level
            )}`}
          >
            <Sparkles className="h-3 w-3" />
            <span>{district.severity_level} GAP ({district.average_gap_score.toFixed(1)})</span>
          </span>
        </div>
      </div>

      {/* Vacancies vs Capacity Metrics */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-muted/40 border border-border p-3">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>{t('dashboard.kpi_total_vacancies', 'Vacancies')}</span>
          </div>
          <div className="text-lg font-extrabold text-foreground mt-1">
            {district.total_vacancies.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="rounded-lg bg-muted/40 border border-border p-3">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-amber-600" />
            <span>{t('dashboard.kpi_trained_supply', 'Capacity')}</span>
          </div>
          <div className="text-lg font-extrabold text-foreground mt-1">
            {district.total_capacity.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="rounded-lg bg-muted/40 border border-border p-3">
          <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-rose-600" />
            <span>{t('dashboard.kpi_net_shortage', 'Net Shortage')}</span>
          </div>
          <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            +{netShortage.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Structural Oversupply Warning Alert */}
      {districtOversupply.length > 0 && (
        <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-2 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{t('gap.oversupply_warning', 'Warning: Structural Oversupply Detected')}</span>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
            {t('gap.oversupply_desc', 'Placement rate < 25% and local hiring demand < 20th percentile for ≥ 2 consecutive quarters.')}
          </p>
          {districtOversupply.map((alert) => (
            <div key={alert.id} className="mt-2 rounded bg-background/80 border border-amber-200 dark:border-amber-900 p-2.5 text-xs space-y-1">
              <div className="font-semibold text-foreground">{alert.trade_title}</div>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-[11px]">
                <span>{t('common.placement_rate', 'Placement')}: <strong className="text-rose-600">{alert.placement_rate}%</strong></span>
                <span>{t('gap.capacity', 'Intake')}: <strong>{alert.intake_capacity} seats</strong></span>
                <span className="text-amber-700 dark:text-amber-300 font-semibold">
                  {t('gap.recommended_reduction', 'Action')}: -{alert.recommended_reduction_percent}% seats
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Granular Trades Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-foreground">
            {isMarathi ? 'जिल्ह्यातील प्राधान्य ट्रेड्स' : 'Priority Local Trade Shortages'}
          </h4>
          <span className="text-[11px] text-muted-foreground">
            {districtTrades.length} {isMarathi ? 'ट्रेड्स नोंदवले' : 'recorded trades'}
          </span>
        </div>

        {districtTrades.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-2.5">{t('gap.trade_role', 'Trade / NSQF Job Role')}</th>
                  <th className="p-2.5 text-center">{t('gap.demand', 'Demand')}</th>
                  <th className="p-2.5 text-center">{t('gap.capacity', 'Supply')}</th>
                  <th className="p-2.5 text-center">{t('gap.score', 'Gap Score')}</th>
                  <th className="p-2.5 text-right">{t('gap.action', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {districtTrades.map((trade) => {
                  const tradeTitle = isMarathi
                    ? trade.job_role_title_mr
                    : isHindi
                    ? trade.job_role_title_hi
                    : trade.job_role_title_en;

                  return (
                    <tr key={trade.id} className="hover:bg-muted/20">
                      <td className="p-2.5">
                        <div className="font-semibold text-foreground">{tradeTitle}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {trade.qp_code} · NSQF {trade.nsqf_level}
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-semibold text-foreground">
                        {trade.demand_count}
                      </td>
                      <td className="p-2.5 text-center text-muted-foreground">
                        {trade.trained_capacity}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSeverityBadgeClass(
                            trade.severity_level
                          )}`}
                        >
                          {trade.gap_score}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] gap-1 px-2"
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
        ) : (
          <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground bg-muted/20">
            <ShieldCheck className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
            <span>
              {isMarathi 
                ? 'या जिल्ह्यात सर्व ट्रेड्सची क्षमता संतुलित आहे.' 
                : 'All surveyed trades currently operating within standard equilibrium.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
