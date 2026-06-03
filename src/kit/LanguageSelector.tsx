import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import cn from '@/utils/mergeClassNameTailwind';
import {IconChevronDown} from './icons';

export type LanguageOption = {
  code: string;
  name: string;
  flag: string;
};

type LanguageSelectorProps = {
  value: LanguageOption;
  options: LanguageOption[];
  onChange: (value: LanguageOption) => void;
  className?: string;
  disabled?: boolean;
};

export default function LanguageSelector({
  value,
  options,
  onChange,
  className,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={cn('relative', className)}>
        <ListboxButton
          className={cn(
            'flex h-10 w-full min-w-35 items-center gap-2 rounded-md border border-border bg-background px-3 text-body-md text-text transition-colors',
            'hover:border-border-strong focus-visible:ring-2 focus-visible:ring-primary',
            disabled && 'opacity-50',
          )}
        >
          <span className="text-base leading-none">{value.flag}</span>
          <span className="flex-1 truncate text-left">{value.name}</span>
          <IconChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 mt-1 max-h-60 w-(--button-width) overflow-auto rounded-md border border-border bg-surface py-1 shadow-elevated focus:outline-none"
        >
          {options.map(option => (
            <ListboxOption
              key={option.code}
              value={option}
              className="cursor-pointer px-3 py-2 text-body-md text-text data-focus:bg-primary/15 data-selected:text-primary"
            >
              <span className="mr-2">{option.flag}</span>
              {option.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
