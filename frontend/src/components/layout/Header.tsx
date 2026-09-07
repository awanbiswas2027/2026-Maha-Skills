import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, UserCircle } from 'lucide-react';
import { DevRoleSwitcher } from '../common/DevRoleSwitcher';
import { useAuthStore } from '../../features/auth/useAuthStore';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentPersona } = useAuthStore();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white font-bold text-lg shadow-sm">
            म
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-primary">
              {t('app.title', 'महास्किल्स')}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t('app.dept', 'महाराष्ट्र शासन · कौशल्य विभाग')}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Dev Role Switcher */}
          <DevRoleSwitcher />

          {/* Language Switcher */}
          <div className="flex items-center rounded-md border border-border bg-card p-1 text-xs">
            <Globe className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <button
              onClick={() => toggleLanguage('mr')}
              className={`px-2 py-0.5 rounded ${i18n.language === 'mr' ? 'bg-primary text-white font-medium' : 'hover:bg-muted'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-2 py-0.5 rounded ${i18n.language === 'en' ? 'bg-primary text-white font-medium' : 'hover:bg-muted'}`}
            >
              English
            </button>
            <button
              onClick={() => toggleLanguage('hi')}
              className={`px-2 py-0.5 rounded ${i18n.language === 'hi' ? 'bg-primary text-white font-medium' : 'hover:bg-muted'}`}
            >
              हिंदी
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground border-l border-border pl-3">
            <UserCircle className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{currentPersona.profile.full_name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
