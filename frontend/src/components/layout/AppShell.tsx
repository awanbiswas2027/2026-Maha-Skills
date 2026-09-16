
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { SkipLink } from './SkipLink';
import { AuthGuard } from '../../features/auth/AuthGuard';

export const AppShell = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <SkipLink />
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <SidebarNav />
          <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto outline-none">
            <div className="max-w-content mx-auto px-4 py-4 md:px-6 md:py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
