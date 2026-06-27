'use client';

import {HeaderTitle} from '@/kit/HeaderTitle';
import HistoryList from '@/components/HistoryList';
import {useTranslationHistory} from '@/hooks/useTranslationHistory';

export default function FavoritesPageContent() {
  const {favorites, toggleFavorite, removeEntry} = useTranslationHistory();

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
      <HeaderTitle
        title="Favorites"
        description="Quick access to your saved translations."
      />
      <div className="mt-6 flex-1">
        <HistoryList
          records={favorites}
          emptyTitle="No favorites yet"
          emptyDescription="Star a translation in History to save it here."
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
