
import { Outlet, NavLink } from 'react-router-dom';
import { Header } from './Header';
import { SkipLink } from './SkipLink';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { NAV_CONFIG } from '../../app/navigation';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CandidateShell = () => {
  const { t } = useTranslation('shell');
  const navItems = NAV_CONFIG['CANDIDATE'] || [];

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none max-w-4xl mx-auto w-full px-4 py-4 md:px-6 md:py-6">
          <Outlet />
        </main>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-[56px] pb-[env(safe-area-inset-bottom)] bg-background border-t flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
            return (
              <NavLink
                key={item.key}
                to={item.href}
                className={({ isActive }) => `flex flex-col items-center justify-center w-[44px] h-[44px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="text-xs truncate w-full text-center mt-1">{t(`nav.${item.key}`, item.key)}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </AuthGuard>
  );
};
