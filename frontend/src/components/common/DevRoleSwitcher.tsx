
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, PRESET_PERSONAS } from '../../features/auth/useAuthStore';
import { UserRole } from '../../types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { NAV_CONFIG } from '../../app/navigation';

export const DevRoleSwitcher = () => {
  const { t } = useTranslation('shell');
  const { currentPersona, switchPersona } = useAuthStore();
  const navigate = useNavigate();

  if (!import.meta.env.DEV) return null;

  const handleSwitch = (role: UserRole) => {
    switchPersona(role);
    const homeRoute = NAV_CONFIG[role][0].href;
    navigate(homeRoute);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" title="Development Persona & Role Switcher">
          Dev: {t(`persona.${currentPersona.role}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(PRESET_PERSONAS) as UserRole[]).map(role => (
          <DropdownMenuItem key={role} onClick={() => handleSwitch(role)}>
            {t(`persona.${role}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
