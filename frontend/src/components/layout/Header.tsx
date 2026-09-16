
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/useAuthStore';
import { DevRoleSwitcher } from '../common/DevRoleSwitcher';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { User, LogOut } from 'lucide-react';

export const Header = () => {
  const { currentPersona, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background border-t-[3px] border-t-primary h-16 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isAuthenticated && <MobileNav />}
        <Link to="/" className="font-bold text-lg tracking-tight">MahaSkills</Link>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
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
