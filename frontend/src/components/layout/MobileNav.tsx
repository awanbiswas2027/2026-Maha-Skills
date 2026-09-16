import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_CONFIG } from '../../app/navigation';
import { useAuthStore } from '../../features/auth/useAuthStore';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { UserRole } from '../../types';

export const MobileNav = () => {
  const { t } = useTranslation('shell');
  const { currentPersona } = useAuthStore();
  const [open, setOpen] = useState(false);

  const role = currentPersona.profile.roles[0] as UserRole;
  const navItems = NAV_CONFIG[role] || [];

  return (
    <div className="xl:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
        <Icons.Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-full md:w-80 bg-background p-6 shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">MahaSkills</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <Icons.X className="h-5 w-5" />
              </Button>
            </div>
            <nav aria-label={t('nav.main')} className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
                  return (
                    <li key={item.key}>
                      <NavLink
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium border-l-[3px] border-primary' : 'text-muted-foreground'}`}
                      >
                        {Icon && <Icon className="h-5 w-5 shrink-0" />}
                        <span>{t(`nav.${item.key}`, item.key)}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="pt-6 mt-auto border-t text-sm">
              <div className="font-medium">{currentPersona.profile.full_name}</div>
              <div className="text-muted-foreground">{t(`persona.${role}`)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
