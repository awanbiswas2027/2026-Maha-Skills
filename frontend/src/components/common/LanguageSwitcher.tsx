
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('shell');
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <>
      <div className="hidden sm:flex" role="group" aria-label={t('shell.language')}>
        <Button variant={i18n.language === 'en' ? 'default' : 'ghost'} size="sm" onClick={() => changeLanguage('en')} aria-pressed={i18n.language === 'en'} lang="en">English</Button>
        <Button variant={i18n.language === 'mr' ? 'default' : 'ghost'} size="sm" onClick={() => changeLanguage('mr')} aria-pressed={i18n.language === 'mr'} lang="mr">?????</Button>
        <Button variant={i18n.language === 'hi' ? 'default' : 'ghost'} size="sm" onClick={() => changeLanguage('hi')} aria-pressed={i18n.language === 'hi'} lang="hi">?????</Button>
      </div>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Language"><Globe className="h-5 w-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLanguage('en')} lang="en">English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('mr')} lang="mr">?????</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('hi')} lang="hi">?????</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
