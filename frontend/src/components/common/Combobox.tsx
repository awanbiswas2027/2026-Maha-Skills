import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface ComboboxOption {
  value: string;
  labelEn: string;
  labelMr?: string;
  code?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  ariaLabel?: string;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  ariaLabel = 'Select an option',
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  // Bilingual filtering logic
  const filteredOptions = options.filter((opt) => {
    const q = searchQuery.toLowerCase();
    const matchEn = opt.labelEn.toLowerCase().includes(q);
    const matchMr = opt.labelMr ? opt.labelMr.includes(q) : false;
    const matchCode = opt.code ? opt.code.toLowerCase().includes(q) : false;
    return matchEn || matchMr || matchCode;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn('w-full justify-between h-11 lg:h-10 text-left font-normal', className)}
        >
          {selectedOption ? (
            <span className="truncate">
              {selectedOption.code && (
                <span className="font-mono text-xs text-muted-foreground mr-2">
                  {selectedOption.code}
                </span>
              )}
              {selectedOption.labelEn}
              {selectedOption.labelMr && ` (${selectedOption.labelMr})`}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <div role="status" aria-live="polite" className="sr-only">
            {filteredOptions.length} results available
          </div>
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.code && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {opt.code}
                        </span>
                      )}
                      <span>{opt.labelEn}</span>
                      {opt.labelMr && (
                        <span className="text-xs text-muted-foreground font-devanagari">
                          {opt.labelMr}
                        </span>
                      )}
                    </div>
                    {value === opt.value && <Check className="h-4 w-4 shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
