import {useEffect, useMemo, useState} from 'react';
import Modal from '@/kit/Modal';
import IconButton from '@/kit/IconButton';
import Badge from '@/kit/Badge';
import {IconStar} from '@/kit/icons';
import {getLanguageByCode, SUPPORTED_LANGUAGES} from '@/constants/languages';
import {getHistoryBlobs} from '@/lib/history/translationHistoryStore';
import type {TranslationHistoryRecord} from '@/types/history';
import cn from '@/utils/mergeClassNameTailwind';

type HistoryDetailModalProps = {
  record: TranslationHistoryRecord | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
};

export default function HistoryDetailModal(props: HistoryDetailModalProps) {
  const {record, open, onClose, onToggleFavorite} = props;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !record) {
      setImageUrl(null);
      return;
    }

    let active = true;
    let objectUrl: string | null = null;

    void getHistoryBlobs(record.id).then(blobs => {
      const blob = blobs.translated ?? blobs.original;
      if (!active || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, record]);

  const translationPairs = useMemo(() => {
    if (!record) return [];

    const ocrMap = new Map(
      record.ocrBlocks.map(block => [block.id, block.text]),
    );
    return record.translations.map(translation => ({
      id: translation.id,
      source: ocrMap.get(translation.id) ?? '',
      target: translation.text,
    }));
  }, [record]);

  if (!record) return null;

  const sourceLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.sourceLangCode,
  );
  const targetLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.targetLangCode,
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record.originalFileName}
      description={`${sourceLang.name} → ${targetLang.name}`}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              {sourceLang.flag} {sourceLang.code.toUpperCase()}
            </Badge>
            <span className="text-caption text-text-muted">→</span>
            <Badge>
              {targetLang.flag} {targetLang.code.toUpperCase()}
            </Badge>
          </div>
          <IconButton
            aria-label={
              record.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            variant="ghost"
            className={cn(
              record.isFavorite && 'text-warning hover:text-warning',
            )}
            onClick={() => onToggleFavorite(record.id)}
          >
            <IconStar filled={record.isFavorite} />
          </IconButton>
        </div>

        {imageUrl ? (
          <div className="overflow-hidden rounded-md border border-border bg-background-muted">
            <img
              src={imageUrl}
              alt={`Translated ${record.originalFileName}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-md border border-border bg-background-muted text-body-md text-text-muted">
            Loading image…
          </div>
        )}

        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border bg-background-subtle p-3">
          {translationPairs.length === 0 ? (
            <p className="text-body-md text-text-muted">
              No translation blocks.
            </p>
          ) : (
            translationPairs.map(pair => (
              <div
                key={pair.id}
                className="rounded-sm border border-border bg-surface p-3"
              >
                <p className="text-caption text-text-muted">{pair.source}</p>
                <p className="mt-1 text-body-md text-text">{pair.target}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
