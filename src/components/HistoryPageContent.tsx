'use client';

import {HeaderTitle} from '@/kit/HeaderTitle';
import HistoryList from '@/components/HistoryList';
import {useTranslationHistory} from '@/hooks/useTranslationHistory';

export default function HistoryPageContent() {
  const {records, toggleFavorite, removeEntry} = useTranslationHistory();

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
      <HeaderTitle
        title="History"
        description="Browse your previous translations."
      />
      <div className="mt-6 flex-1">
        <HistoryList
          records={records}
          onToggleFavorite={id => {
            void toggleFavorite(id);
          }}
          onDelete={id => {
            void removeEntry(id);
          }}
        />
      </div>
    </div>
  );
}
