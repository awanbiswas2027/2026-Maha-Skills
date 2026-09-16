
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { PublicFooter } from './PublicFooter';
import { SkipLink } from './SkipLink';

export const PublicShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
};
