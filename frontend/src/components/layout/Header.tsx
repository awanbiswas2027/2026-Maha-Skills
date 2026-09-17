import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { DevRoleSwitcher } from '../common/DevRoleSwitcher';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { currentPersona, isAuthenticated, logout } = useAuthStore();
  const { t } = useTranslation(['shell', 'translation']);

  const brandName = t('translation:brand.name', 'MahaSkills');
  const shortBrandName = t('shell.brand.short', 'MahaSkills');
  const deptName = t('translation:app.dept', 'महाराष्ट्र शासन · कौशल्य विभाग');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background border-t-[3px] border-t-primary h-16 px-3 sm:px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {isAuthenticated && <MobileNav />}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <svg
            width={32}
            height={32}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={brandName}
            className="shrink-0"
          >
            <title>{brandName}</title>
            <rect x="4" y="18" width="6" height="12" rx="1.5" fill="hsl(var(--primary))" />
            <rect x="13" y="11" width="6" height="19" rx="1.5" fill="hsl(var(--primary))" />
            <rect x="22" y="6" width="6" height="24" rx="1.5" fill="hsl(var(--primary))" />
            <polygon points="25,0 28,3 25,6 22,3" fill="hsl(var(--accent))" />
          </svg>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold leading-snug text-foreground hidden sm:block">
              {brandName}
            </span>
            <span className="text-base font-bold leading-snug text-foreground sm:hidden truncate">
              {shortBrandName}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block leading-snug">
              {deptName}
            </span>
          </div>
        </Link>
      </div>
      
      <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-4 shrink-0">
        <div className="hidden md:block flex-1 max-w-sm mx-4">
           {/* Global search placeholder */}
        </div>
        <LanguageSwitcher />
        <DevRoleSwitcher />
        
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{currentPersona.profile.full_name}</div>
                <div className="text-muted-foreground">{currentPersona.label_en}</div>
              </div>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
