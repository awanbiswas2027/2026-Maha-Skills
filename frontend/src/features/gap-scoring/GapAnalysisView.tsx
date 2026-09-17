import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GapHeatmap } from './GapHeatmap';
import { DistrictDetailPanel } from './DistrictDetailPanel';
import { PriorityInterventionsTable } from './PriorityInterventionsTable';
import { MAHARASHTRA_DISTRICTS, MOCK_OVERSUPPLY_ALERTS } from './gapScoringData';
import { DistrictGapAggregate } from '../../types/api';
import { 
  BarChart3, 
  Map, 
  Sparkles, 
  AlertTriangle, 
  Download 
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export const GapAnalysisView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictGapAggregate | null>(
    MAHARASHTRA_DISTRICTS[0] // Default to Pune
  );
  const [activeTab, setActiveTab] = useState<'heatmap' | 'priorities' | 'oversupply'>('heatmap');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const isMarathi = i18n.language === 'mr';

  const divisions = ['Konkan', 'Pune', 'Nashik', 'Chhatrapati Sambhajinagar', 'Nagpur', 'Amravati'];

  const handleExportBrief = () => {
    // Generate CSV export of current gap rankings
    const rows = [
      ['District Code', 'District Name', 'Division', 'Vacancies', 'Capacity', 'Gap Score', 'Severity'],
      ...MAHARASHTRA_DISTRICTS.map((d) => [
        d.code,
        d.name_en,
        d.division,
        d.total_vacancies.toString(),
        d.total_capacity.toString(),
        d.average_gap_score.toString(),
        d.severity_level,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mahaskills_gap_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{isMarathi ? 'साप्ताहिक अल्गोरिदम तूट निर्देशांक' : 'Weekly Algorithmic Gap Score Index'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t('gap.page_title', 'Statewide Skill Gap Heatmap')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {t('gap.page_subtitle', 'Weekly algorithmic gap score index mapping industrial hiring intensity against ITI training capacities across 36 districts.')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportBrief}
              className="gap-2 text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('dashboard.download_report', 'Export CSV')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Analytical Tabs & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>{t('gap.tab_heatmap', 'District Gap Heatmap')}</span>
          </button>

          <button
            onClick={() => setActiveTab('priorities')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === 'priorities'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('gap.tab_priorities', 'Priority Interventions')}</span>
          </button>

          <button
            onClick={() => setActiveTab('oversupply')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === 'oversupply'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{t('gap.tab_oversupply', 'Oversupply Alerts')} ({MOCK_OVERSUPPLY_ALERTS.length})</span>
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'heatmap' && (
          <div className="flex items-center gap-2">
            <select
              value={filterDivision}
              onChange={(e) => setFilterDivision(e.target.value)}
              className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('gap.filter_division', 'All Divisions')}</option>
              {divisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('gap.filter_severity', 'All Severities')}</option>
              <option value="CRITICAL">Critical (≥75)</option>
              <option value="HIGH">High (60-74)</option>
              <option value="MODERATE">Moderate (40-59)</option>
              <option value="LOW">Low (&lt;40)</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Heatmap & District Inspector Split */}
      {activeTab === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <GapHeatmap
              selectedDistrictId={selectedDistrict?.id}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              filterDivision={filterDivision}
              filterSeverity={filterSeverity}
            />
          </div>

          <div className="lg:col-span-5">
            <DistrictDetailPanel district={selectedDistrict} />
          </div>
        </div>
      )}

      {/* Tab 2: Priority Interventions Table */}
      {activeTab === 'priorities' && (
        <PriorityInterventionsTable limit={10} />
      )}

      {/* Tab 3: Structural Oversupply Table */}
      {activeTab === 'oversupply' && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>{t('gap.tab_oversupply', 'Structural Oversupply Alerts')}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('gap.oversupply_desc', 'Placement rate < 25% and local hiring demand < 20th percentile for ≥ 2 consecutive quarters.')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/60 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">{t('common.district', 'District')}</th>
                  <th className="p-3">{t('gap.trade_role', 'Trade Title')}</th>
                  <th className="p-3 text-center">{t('common.placement_rate', 'Placement Rate')}</th>
                  <th className="p-3 text-center">{isMarathi ? 'मागणी पर्सेंटाइल' : 'Demand Percentile'}</th>
                  <th className="p-3 text-center">{isMarathi ? 'तिमाही कालावधी' : 'Consecutive Quarters'}</th>
                  <th className="p-3 text-center">{t('gap.capacity', 'Intake')}</th>
                  <th className="p-3 text-right">{t('gap.recommended_reduction', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_OVERSUPPLY_ALERTS.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{alert.district_name}</td>
                    <td className="p-3 font-medium text-foreground">{alert.trade_title}</td>
                    <td className="p-3 text-center font-bold text-rose-600 dark:text-rose-400">
                      {alert.placement_rate}%
                    </td>
                    <td className="p-3 text-center text-muted-foreground">
                      &lt; {alert.local_demand_percentile}th %tile
                    </td>
                    <td className="p-3 text-center font-semibold text-foreground">
                      {alert.consecutive_quarters} quarters
                    </td>
                    <td className="p-3 text-center text-muted-foreground">
                      {alert.intake_capacity} seats
                    </td>
                    <td className="p-3 text-right font-bold text-amber-700 dark:text-amber-300">
                      Reduce -{alert.recommended_reduction_percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
