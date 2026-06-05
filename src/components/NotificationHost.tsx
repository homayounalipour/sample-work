import Toast, {ToastItem} from '@/kit/Toast';

type NotificationHostProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export default function NotificationHost(props: NotificationHostProps) {
  const {onDismiss, toasts} = props;
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} show onDismiss={onDismiss} />
      ))}
    </div>
  );
}
