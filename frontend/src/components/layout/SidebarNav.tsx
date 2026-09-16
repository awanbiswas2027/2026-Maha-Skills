
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_CONFIG } from '../../app/navigation';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { useUiStore } from '../../lib/ui-store';
import { ScopeIndicator } from '../common/ScopeIndicator';
import * as Icons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { UserRole } from '../../types';

export const SidebarNav = () => {
  const { t } = useTranslation('shell');
  const { currentPersona } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const role = currentPersona.profile.roles[0] as UserRole;
  const navItems = NAV_CONFIG[role] || [];

  return (
    <aside className={`hidden xl:flex flex-col border-r bg-background transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <ScopeIndicator />
      <nav aria-label={t('nav.main')} className="flex-1 overflow-y-auto py-4">
        <TooltipProvider>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
              return (
                <li key={item.key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium border-l-[3px] border-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                      >
                        {Icon && <Icon className="h-5 w-5 shrink-0" />}
                        {!sidebarCollapsed && <span>{t(`nav.${item.key}`, item.key)}</span>}
                      </NavLink>
                    </TooltipTrigger>
                    {sidebarCollapsed && <TooltipContent side="right">{t(`nav.${item.key}`, item.key)}</TooltipContent>}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>
      <div className="p-4 border-t flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="self-end" aria-label="Toggle Sidebar">
          {sidebarCollapsed ? <Icons.ChevronRight className="h-4 w-4" /> : <Icons.ChevronLeft className="h-4 w-4" />}
        </Button>
        {!sidebarCollapsed && (
          <div className="text-sm">
            <div className="font-medium">{currentPersona.profile.full_name}</div>
            <div className="text-muted-foreground">{t(`persona.${role}`)}</div>
          </div>
        )}
      </div>
    </aside>
  );
};
