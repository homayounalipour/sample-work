import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Label,
} from '@headlessui/react';
import cn from '@/utils/mergeClassNameTailwind';
import {IconCheck, IconChevronDown} from './icons';

export type SelectOption<T extends string = string> = {
  id: T;
  name: string;
  description?: string;
};

type SelectProps<T extends string> = {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
};

export default function Select<T extends string>(props: SelectProps<T>) {
  const {label, value, options, onChange, disabled = false, className} = props;
  const selected =
    options.find(option => option.id === value) ?? options[0] ?? null;

  if (!selected) return null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Listbox
        value={selected}
        onChange={option => onChange(option.id)}
        disabled={disabled}
        by="id"
      >
        {label && (
          <Label className="text-body-md  font-medium text-text">{label}</Label>
        )}
        <div className="relative">
          <ListboxButton
            className={cn(
              'flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-body-md text-text transition-colors',
              'hover:border-border-strong focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              disabled && 'opacity-50',
            )}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {selected.name}
            </span>
            <IconChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
          </ListboxButton>
          <ListboxOptions
            portal={false}
            modal={false}
            className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-elevated focus:outline-none"
          >
            {options.map(option => (
              <ListboxOption
                key={option.id}
                value={option}
                className="group flex cursor-pointer items-center gap-2 px-3 py-2 text-body-md text-text data-focus:bg-primary/15 data-selected:text-primary"
              >
                <IconCheck className="h-4 w-4 shrink-0 text-primary opacity-0 group-data-selected:opacity-100" />
                <span className="truncate">{option.name}</span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      {selected.description && (
        <p className="text-caption text-text-muted">{selected.description}</p>
      )}
    </div>
  );
}
