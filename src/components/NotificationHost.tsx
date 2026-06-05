import Toast, {ToastItem} from '@/kit/Toast';

type NotificationHostProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export default function NotificationHost(props: NotificationHostProps) {
  const {onDismiss, toasts} = props;
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} show onDismiss={onDismiss} />
      ))}
    </div>
  );
}
