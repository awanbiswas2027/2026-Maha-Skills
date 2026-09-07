import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../auth/useAuthStore';
import { GapHeatmap } from './GapHeatmap';
import { DistrictDetailPanel } from './DistrictDetailPanel';
import { PriorityInterventionsTable } from './PriorityInterventionsTable';
import { MAHARASHTRA_DISTRICTS } from './gapScoringData';
import { DistrictGapAggregate } from '../../types/api';
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export const DashboardView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentPersona } = useAuthStore();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictGapAggregate | null>(
    MAHARASHTRA_DISTRICTS[0]
  );

  const isMarathi = i18n.language === 'mr';

  const userRole = currentPersona.role;
  const userDistrictName = currentPersona.profile.scopes.district_name || 'Pune';
  const userDistrictId = currentPersona.profile.scopes.district_id || 14;

  // Find the district aggregate if district officer
  const scopedDistrict = MAHARASHTRA_DISTRICTS.find(
    (d) => d.id === userDistrictId || d.name_en.toLowerCase().includes(userDistrictName.toLowerCase())
  ) || MAHARASHTRA_DISTRICTS[0];

  // Calculate statewide aggregates
  const totalStateVacancies = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.total_vacancies, 0);
  const totalStateCapacity = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.total_capacity, 0);
  const totalCriticalTrades = MAHARASHTRA_DISTRICTS.reduce((acc, d) => acc + d.critical_trades_count, 0);
  const netShortage = totalStateVacancies - totalStateCapacity;

  return (
    <div className="space-y-6">
      {/* Dynamic Header based on Role */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>
                {userRole === 'DISTRICT_OFFICER'
                  ? `${isMarathi ? 'जिल्हा कार्यकक्ष' : 'District Workbench'} · ${userDistrictName}`
                  : userRole === 'ITI_PRINCIPAL'
                  ? `${isMarathi ? 'आयटीआय कार्यकक्ष' : 'Institute Portal'} · ${currentPersona.profile.scopes.institute_id}`
                  : `${isMarathi ? 'राज्य नियंत्रण कक्ष' : 'State Intelligence Command'} · DSEEI`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {userRole === 'DISTRICT_OFFICER'
                ? `${t('dashboard.district_title', 'District Skill Officer Command Center')} (${userDistrictName})`
                : t('dashboard.statewide_title', 'State Skill Intelligence Command Center')}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {userRole === 'DISTRICT_OFFICER'
                ? t('dashboard.district_subtitle', 'Localized jurisdictional intelligence, institutional intake compliance, and trade deficit monitoring.')
                : t('dashboard.statewide_subtitle', 'Real-time state overview of employer demand, institutional supply, and critical curriculum intervention priorities across 36 districts.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
            >
              <Link to="/gap-analysis">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>{t('dashboard.view_all_districts', 'View Full Heatmap')}</span>
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
            >
              <Link to="/recommendations">
                <span>{isMarathi ? 'अभ्यासक्रम शिफारसी' : 'Curriculum Workbench'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {userRole === 'DISTRICT_OFFICER' ? (
        // District Scoped KPIs
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{userDistrictName} {t('dashboard.kpi_total_vacancies', 'Vacancies')}</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {scopedDistrict.total_vacancies.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">+18% YoY hiring</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_trained_supply', 'ITI Intake Capacity')}</span>
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {scopedDistrict.total_capacity.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-muted-foreground">{scopedDistrict.iti_count} ITIs</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_net_shortage', 'Net Skill Shortage')}</span>
              <TrendingUp className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2 font-mono">
              +{(scopedDistrict.total_vacancies - scopedDistrict.total_capacity).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-rose-600 font-semibold">Immediate deficit</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_critical_trades', 'Critical Gap Trades')}</span>
              <Sparkles className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {scopedDistrict.critical_trades_count}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold">Requires DTP expansion</span>
          </div>
        </div>
      ) : (
        // Statewide Policy Maker KPIs
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_total_vacancies', 'Active Vacancies')}</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {totalStateVacancies.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Across 36 Districts</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_trained_supply', 'Sanctioned Intake')}</span>
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {totalStateCapacity.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-muted-foreground">417+ Govt ITIs</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_net_shortage', 'Net Skill Shortage')}</span>
              <TrendingUp className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2 font-mono">
              +{netShortage.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-rose-600 font-semibold">Statewide Gap</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.kpi_critical_trades', 'Critical Gap Trades')}</span>
              <Sparkles className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-foreground mt-2 font-mono">
              {totalCriticalTrades}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold">In Review Queue</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {userRole === 'DISTRICT_OFFICER' ? (
        // District Officer View: Dedicated District Workbench & Quick Action Cards
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <DistrictDetailPanel district={scopedDistrict} />
            </div>

            <div className="lg:col-span-4 space-y-4">
              {/* Annual District Training Plan Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{isMarathi ? 'जिल्हा प्रशिक्षण योजना (DTP)' : 'Annual District Training Plan'}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isMarathi 
                    ? 'स्थानिक उद्योग मागणीच्या आधारे २०२६-२७ या आर्थिक वर्षाचा प्रशिक्षण आराखडा तयार करा.' 
                    : 'Compile seat intakes, equipment grant deficits, and placement targets for FY 2026-27.'}
                </p>
                <Button asChild size="sm" className="w-full text-xs">
                  <Link to="/district-plans">
                    <span>{isMarathi ? 'जिल्हा आराखडा उघडा' : 'Open Plan Builder'}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>

              {/* Monthly Placement Return Status */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{isMarathi ? 'मासिक प्लेसमेंट रिटर्न स्थिती' : 'Monthly Placement Submissions'}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <div className="flex justify-between">
                    <span>{isMarathi ? 'अहवाल सादर केलेले आयटीआय' : 'Reporting ITIs'}:</span>
                    <strong className="text-foreground">34 / 38 (89%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isMarathi ? 'प्रलंबित संस्था' : 'Pending Submissions'}:</span>
                    <strong className="text-amber-600">4 ITIs</strong>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs">
                  <Link to="/placements/upload">
                    <span>{isMarathi ? 'अहवाल तपासा' : 'Review Institutional Uploads'}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Statewide Policy Maker View: Heatmap + Priority Interventions
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <GapHeatmap
                selectedDistrictId={selectedDistrict?.id}
                onSelectDistrict={(d) => setSelectedDistrict(d)}
              />
            </div>

            <div className="lg:col-span-5">
              <DistrictDetailPanel district={selectedDistrict} />
            </div>
          </div>

          {/* Statewide Priority Interventions */}
          <PriorityInterventionsTable limit={10} />
        </div>
      )}
    </div>
  );
};
