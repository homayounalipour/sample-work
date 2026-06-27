import Modal from '@/kit/Modal';
import {IconCheck} from '@/kit/icons';

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
  onViewFile: () => void;
};

export default function ExportModal(props: ExportModalProps) {
  const {onClose, onViewFile, open} = props;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Complete!"
      description="Your translated file has been downloaded successfully."
      primaryAction={{label: 'View File', onClick: onViewFile}}
      secondaryAction={{label: 'Close', onClick: onClose}}
    >
      <div className="flex justify-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
          <IconCheck className="h-8 w-8" />
        </div>
      </div>
    </Modal>
  );
}
