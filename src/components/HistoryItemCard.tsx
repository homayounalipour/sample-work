import {useState} from 'react';
import Badge from '@/kit/Badge';
import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import Modal from '@/kit/Modal';
import {IconStar, IconTrash} from '@/kit/icons';
import {getLanguageByCode, SUPPORTED_LANGUAGES} from '@/constants/languages';
import {useThumbnailUrl} from '@/hooks/useThumbnailUrl';
import type {TranslationHistoryRecord} from '@/types/history';
import cn from '@/utils/mergeClassNameTailwind';
import {formatRelativeDate} from '@/utils/formatRelativeDate';

type HistoryItemCardProps = {
  record: TranslationHistoryRecord;
  onSelect: (record: TranslationHistoryRecord) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HistoryItemCard(props: HistoryItemCardProps) {
  const {record, onSelect, onToggleFavorite, onDelete} = props;
  const thumbnailUrl = useThumbnailUrl(record.id);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(record.id);
    setDeleteConfirmOpen(false);
  };

  const sourceLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.sourceLangCode,
  );
  const targetLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.targetLangCode,
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-(--radius-lg) border border-border bg-surface transition-shadow hover:shadow-elevated">
      <button
        type="button"
        onClick={() => onSelect(record)}
        className="relative aspect-4/3 w-full overflow-hidden bg-background-muted"
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={record.originalFileName}
            decoding="async"
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-caption text-text-muted">
            Loading preview…
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center  justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-md font-medium text-text">
              {record.originalFileName}
            </p>
            <p className="mt-1 text-caption text-text-muted">
              {formatRelativeDate(record.createdAt)}
            </p>
          </div>
          <IconButton
            aria-label={
              record.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            size="sm"
            variant="ghost"
            className={cn(
              record.isFavorite && 'text-warning hover:text-warning',
            )}
            onClick={() => onToggleFavorite(record.id)}
          >
            <IconStar filled={record.isFavorite} />
          </IconButton>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>{sourceLang.flag}</Badge>
          <span className="text-caption text-text-muted">→</span>
          <Badge>{targetLang.flag}</Badge>
          <Badge variant="completed">
            {record.translations.length} block
            {record.translations.length === 1 ? '' : 's'}
          </Badge>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-10"
            onClick={() => onSelect(record)}
          >
            View details
          </Button>
          <button
            type="button"
            className={cn(
              'flex  items-center gap-2.5 px-3 py-2 text-left text-body-md text-error rounded-md',
              'bg-error/10',
            )}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete translation?"
        description={`Are you sure you want to delete "${record.originalFileName}"? This action cannot be undone.`}
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setDeleteConfirmOpen(false),
        }}
        primaryAction={{
          label: 'Delete',
          onClick: handleConfirmDelete,
        }}
      />
    </article>
  );
}
