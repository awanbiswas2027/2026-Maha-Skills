
import { useTranslation } from 'react-i18next';
import { DistrictGapAggregate } from '../../types/api';
import { MAHARASHTRA_DISTRICTS } from './gapScoringData';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface GapHeatmapProps {
  selectedDistrictId?: number;
  onSelectDistrict: (district: DistrictGapAggregate) => void;
  filterDivision?: string;
  filterSeverity?: string;
}

export const GapHeatmap: React.FC<GapHeatmapProps> = ({
  selectedDistrictId,
  onSelectDistrict,
  filterDivision = 'ALL',
  filterSeverity = 'ALL',
}) => {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const isHindi = i18n.language === 'hi';

  // Group districts by Division
  const divisions = ['Konkan', 'Pune', 'Nashik', 'Chhatrapati Sambhajinagar', 'Nagpur', 'Amravati'] as const;

  const getDistrictName = (d: DistrictGapAggregate) => {
    return isMarathi ? d.name_mr : isHindi ? d.name_hi : d.name_en;
  };

  const getSeverityBgClass = (severity: string, isSelected: boolean) => {
    switch (severity) {
      case 'CRITICAL':
        return isSelected
          ? 'bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-2'
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 hover:bg-rose-100';
      case 'HIGH':
        return isSelected
          ? 'bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-2'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-100';
      case 'MODERATE':
        return isSelected
          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2'
          : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-100';
      case 'LOW':
      default:
        return isSelected
          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-100';
    }
  };

  const getBadgeClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'MODERATE':
        return 'bg-indigo-500 text-white';
      case 'LOW':
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const filteredDistricts = MAHARASHTRA_DISTRICTS.filter((d) => {
    if (filterDivision !== 'ALL' && d.division !== filterDivision) return false;
    if (filterSeverity !== 'ALL' && d.severity_level !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="font-bold text-base text-foreground">
            {t('gap.tab_heatmap', 'District Gap Heatmap')} (36 {isMarathi ? 'जिल्हे' : 'Districts'})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('gap.select_district_prompt', 'Click any district block on the heatmap to view local trade breakdown and institutional capacities.')}
          </p>
        </div>

        {/* Severity Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-rose-500" />
            <span className="text-muted-foreground">{t('gap.severity_critical', 'Critical (≥75)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-amber-500" />
            <span className="text-muted-foreground">{t('gap.severity_high', 'High (60-74)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-indigo-500" />
            <span className="text-muted-foreground">{t('gap.severity_moderate', 'Moderate (40-59)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span className="text-muted-foreground">{t('gap.severity_low', 'Low (<40)')}</span>
          </div>
        </div>
      </div>

      {/* Grid grouped by Division */}
      <div className="space-y-4">
        {divisions.map((divisionName) => {
          const divisionDistricts = filteredDistricts.filter((d) => d.division === divisionName);
          if (divisionDistricts.length === 0) return null;

          return (
            <div key={divisionName} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground border-b border-border/60 pb-1">
                <span>{divisionName} {isMarathi ? 'विभाग' : 'Division'}</span>
                <span className="text-[11px] font-normal">{divisionDistricts.length} {isMarathi ? 'जिल्हे' : 'districts'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                {divisionDistricts.map((district) => {
                  const isSelected = selectedDistrictId === district.id;

                  return (
                    <button
                      key={district.id}
                      onClick={() => onSelectDistrict(district)}
                      className={`relative rounded-lg border p-2.5 text-left transition-all flex flex-col justify-between ${getSeverityBgClass(
                        district.severity_level,
                        isSelected
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-1 w-full">
                        <span className="font-bold text-xs truncate">
                          {getDistrictName(district)}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-extrabold ${getBadgeClass(
                            district.severity_level
                          )}`}
                        >
                          {district.average_gap_score.toFixed(0)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] opacity-90">
                        <span>{district.total_vacancies.toLocaleString('en-IN')} {isMarathi ? 'पदे' : 'vacancies'}</span>
                        {district.has_oversupply_alert && (
                          <span title="Oversupply Alert">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-white">
                          <ChevronRight className="h-2 w-2 rotate-90" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
