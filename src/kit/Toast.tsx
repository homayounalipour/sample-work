import {Transition} from '@headlessui/react';
import cn from '@/utils/mergeClassNameTailwind';

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  variant?: 'default' | 'success';
};

type ToastProps = {
  toast: ToastItem;
  show: boolean;
  onDismiss: (id: string) => void;
};

export default function Toast(props: ToastProps) {
  const {show, onDismiss, toast} = props;
  return (
    <Transition
      show={show}
      enter="transition duration-200 ease-out"
      enterFrom="opacity-0 translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transition duration-150 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={cn(
          'pointer-events-auto w-full rounded-md border border-border bg-surface p-4 shadow-elevated sm:w-80',
          toast.variant === 'success' && 'border-success/30',
        )}
      >
        <p className="text-body-md font-medium text-text">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-caption text-text-subtle">{toast.message}</p>
        )}
        <button
          type="button"
          className="mt-2 text-caption text-primary hover:underline"
          onClick={() => onDismiss(toast.id)}
        >
          Dismiss
        </button>
      </div>
    </Transition>
  );
}
