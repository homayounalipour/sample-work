import {useState} from 'react';
import Link from 'next/link';
import HistoryDetailModal from '@/components/HistoryDetailModal';
import HistoryItemCard from '@/components/HistoryItemCard';
import Button from '@/kit/Button';
import {routes} from '@/constants/routes';
import type {TranslationHistoryRecord} from '@/types/history';

type HistoryListProps = {
  records: TranslationHistoryRecord[];
  emptyTitle?: string;
  emptyDescription?: string;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HistoryList(props: HistoryListProps) {
  const {
    records,
    emptyTitle = 'No translations yet',
    emptyDescription = 'Apply or export a translation to save it here.',
    onToggleFavorite,
    onDelete,
  } = props;
  const [selectedRecord, setSelectedRecord] =
    useState<TranslationHistoryRecord | null>(null);

  if (records.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-h4 text-text">{emptyTitle}</p>
        <p className="max-w-md text-body-md text-text-subtle">
          {emptyDescription}
        </p>
        <Link href={routes.app.new}>
          <Button>Start a new translation</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {records.map(record => (
          <HistoryItemCard
            key={record.id}
            record={record}
            onSelect={setSelectedRecord}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
          />
        ))}
      </div>

      <HistoryDetailModal
        record={selectedRecord}
        open={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}
