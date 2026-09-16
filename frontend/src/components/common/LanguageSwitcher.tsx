import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Globe } from 'lucide-react';

export const resolveHtmlLang = (i18nLanguage: string | undefined): string => {
  if (!i18nLanguage) return 'en';
  const lang = i18nLanguage.split('-')[0].toLowerCase();
  if (['en', 'mr', 'hi'].includes(lang)) {
    return lang;
  }
  return 'en';
};

export const useHtmlLang = (i18n: import('i18next').i18n) => {
  useEffect(() => {
    const syncLang = () => {
      document.documentElement.lang = resolveHtmlLang(i18n.language);
    };

    syncLang();
    i18n.on('languageChanged', syncLang);
    i18n.on('initialized', syncLang);

    return () => {
      i18n.off('languageChanged', syncLang);
      i18n.off('initialized', syncLang);
    };
  }, [i18n]);
};

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('shell');
  useHtmlLang(i18n);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getActiveClasses = (lng: string) => {
    return i18n.language === lng 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
      : '';
  };

  return (
    <>
      <div className="hidden sm:flex" role="group" aria-label={t('shell.language', 'Language')}>
        <Button 
          variant={i18n.language === 'en' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => changeLanguage('en')} 
          aria-pressed={i18n.language === 'en'} 
          className={getActiveClasses('en')}
          lang="en"
        >
          English
        </Button>
        <Button 
          variant={i18n.language === 'mr' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => changeLanguage('mr')} 
          aria-pressed={i18n.language === 'mr'} 
          className={getActiveClasses('mr')}
          lang="mr"
        >
          मराठी
        </Button>
        <Button 
          variant={i18n.language === 'hi' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => changeLanguage('hi')} 
          aria-pressed={i18n.language === 'hi'} 
          className={getActiveClasses('hi')}
          lang="hi"
        >
          हिंदी
        </Button>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Language"><Globe className="h-5 w-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLanguage('en')} lang="en">English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('mr')} lang="mr">मराठी</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('hi')} lang="hi">हिंदी</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
