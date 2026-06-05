import {Switch} from '@headlessui/react';
import cn from '@/utils/mergeClassNameTailwind';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function Toggle(props: ToggleProps) {
  const {checked, onChange, label, disabled, className} = props;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          checked ? 'bg-primary' : 'bg-background-muted',
          disabled && 'opacity-50',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </Switch>
      {label && <span className="text-body-md text-text">{label}</span>}
    </div>
  );
}
