import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Compass, BookOpen, GraduationCap } from 'lucide-react';

export const CandidateShell: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <Header />
      <main id="main-content" className="flex-1 container max-w-4xl py-6 px-4">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card flex justify-around py-2 md:hidden">
        <Link to="/candidate/courses" className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
          <BookOpen className="h-5 w-5" />
          <span>{t('nav.courses', 'कोर्सेस')}</span>
        </Link>
        <Link to="/candidate/pathway" className="flex flex-col items-center text-xs text-primary font-medium">
          <Compass className="h-5 w-5" />
          <span>{t('nav.pathway', 'दिशा')}</span>
        </Link>
        <Link to="/candidate/dashboard" className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
          <GraduationCap className="h-5 w-5" />
          <span>{t('nav.dashboard', 'माझे कोर्सेस')}</span>
        </Link>
      </nav>
    </div>
  );
};
