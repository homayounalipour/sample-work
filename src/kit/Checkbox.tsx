import cn from '@/utils/mergeClassNameTailwind';
import {IconCheck} from './icons';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const {checked, onChange, label, disabled, className} = props;
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border transition-colors',
          checked
            ? 'border-primary bg-primary text-white'
            : 'border-border bg-background hover:border-border-strong',
        )}
      >
        {checked && <IconCheck className="h-3 w-3" />}
      </button>
      {label && <span className="text-body-md text-text">{label}</span>}
    </label>
  );
}
