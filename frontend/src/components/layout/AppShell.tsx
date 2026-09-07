import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { UserRole } from '../../types';
import { 
  BarChart3, 
  Layers, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  MapPin, 
  UploadCloud, 
  Settings, 
  Shield 
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
}

export const AppShell: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { currentPersona } = useAuthStore();
  const isMarathi = i18n.language === 'mr';

  const allNavigation: NavItem[] = [
    { 
      name: t('nav.dashboard', 'डॅशबोर्ड'), 
      href: '/dashboard', 
      icon: BarChart3, 
      allowedRoles: ['POLICY_MAKER', 'DISTRICT_OFFICER', 'ITI_PRINCIPAL', 'ADMIN'] 
    },
    { 
      name: t('nav.gap_analysis', 'कौशल्य तूट'), 
      href: '/gap-analysis', 
      icon: TrendingUp, 
      allowedRoles: ['POLICY_MAKER', 'DISTRICT_OFFICER', 'ADMIN'] 
    },
    { 
      name: t('nav.recommendations', 'अभ्यासक्रम सुधारणा'), 
      href: '/recommendations', 
      icon: FileText, 
      allowedRoles: ['POLICY_MAKER', 'SSC_REVIEWER', 'EMPLOYER', 'ADMIN'] 
    },
    { 
      name: t('nav.taxonomy', 'वर्गीकरण'), 
      href: '/taxonomy', 
      icon: Layers, 
      allowedRoles: ['POLICY_MAKER', 'SSC_REVIEWER', 'ADMIN'] 
    },
    { 
      name: t('nav.placements', 'प्लेसमेंट अपलोड'), 
      href: '/placements/upload', 
      icon: UploadCloud, 
      allowedRoles: ['ITI_PRINCIPAL', 'DISTRICT_OFFICER', 'ADMIN'] 
    },
    { 
      name: t('nav.district_plans', 'जिल्हा आराखडे'), 
      href: '/district-plans', 
      icon: MapPin, 
      allowedRoles: ['POLICY_MAKER', 'DISTRICT_OFFICER', 'ITI_PRINCIPAL', 'ADMIN'] 
    },
    { 
      name: t('nav.employer', 'नियोक्ता कक्ष'), 
      href: '/employer', 
      icon: Briefcase, 
      allowedRoles: ['EMPLOYER', 'ADMIN'] 
    },
    { 
      name: t('nav.admin', 'प्रशासन'), 
      href: '/admin', 
      icon: Settings, 
      allowedRoles: ['ADMIN'] 
    },
  ];

  // Filter navigation items based on current active persona role
  const visibleNav = allNavigation.filter(item => 
    item.allowedRoles.includes(currentPersona.role)
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        {/* Role-Aware Sidebar */}
        <aside className="w-64 border-r border-border bg-card p-4 hidden md:flex flex-col justify-between">
          <div>
            {/* Scope / Jurisdiction Indicator */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Shield className="h-3.5 w-3.5" />
                <span>{isMarathi ? currentPersona.label_mr : currentPersona.label_en}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {currentPersona.profile.scopes.district_name || (isMarathi ? 'सर्व ३६ जिल्हे (राज्यव्यापी)' : 'All 36 Districts (Statewide)')}
              </p>
            </div>

            <nav className="space-y-1">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
            <span className="font-semibold">{currentPersona.profile.full_name}</span>
            <div className="truncate text-muted-foreground/80">{currentPersona.profile.email}</div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main id="main-content" className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
