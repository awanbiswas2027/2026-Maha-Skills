import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
  type ThemePreference,
  getStoredPreference,
  setStoredPreference,
  applyTheme,
  subscribeToSystemTheme,
} from '../../lib/theme';

export function ThemeToggle() {
  const { t } = useTranslation();
  const [preference, setPreference] = React.useState<ThemePreference>(() => getStoredPreference());

  React.useEffect(() => {
    applyTheme(preference);
    if (preference === 'system') {
      const unsubscribe = subscribeToSystemTheme(() => {
        applyTheme('system');
      });
      return unsubscribe;
    }
  }, [preference]);

  const handleSelect = (val: string) => {
    const pref = val as ThemePreference;
    setPreference(pref);
    setStoredPreference(pref);
    applyTheme(pref);
  };

  const CurrentIcon = preference === 'dark' ? Moon : preference === 'light' ? Sun : Monitor;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('theme.label')}
          className="text-muted-foreground hover:text-foreground"
        >
          <CurrentIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenu.RadioGroup value={preference} onValueChange={handleSelect}>
            <DropdownMenu.RadioItem
              value="system"
              className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4" />
                </DropdownMenu.ItemIndicator>
              </span>
              <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{t('theme.system')}</span>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="light"
              className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4" />
                </DropdownMenu.ItemIndicator>
              </span>
              <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{t('theme.light')}</span>
            </DropdownMenu.RadioItem>

            <DropdownMenu.RadioItem
              value="dark"
              className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4" />
                </DropdownMenu.ItemIndicator>
              </span>
              <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{t('theme.dark')}</span>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
