'use client';

import {useState} from 'react';
import Link from 'next/link';
import HistoryDetailModal from '@/components/HistoryDetailModal';
import {
  IconClock,
  IconExternalLink,
  IconQuote,
} from '@/components/dashboard/icons';
import Badge from '@/kit/Badge';
import Button from '@/kit/Button';
import {getLanguageByCode, SUPPORTED_LANGUAGES} from '@/constants/languages';
import {routes} from '@/constants/routes';
import {useThumbnailUrl} from '@/hooks/useThumbnailUrl';
import type {TranslationHistoryRecord} from '@/types/history';
import {formatDashboardRelativeTime} from '@/utils/formatDashboardRelativeTime';

type DashboardRecentActivityProps = {
  records: TranslationHistoryRecord[];
  onToggleFavorite: (id: string) => void;
};

type ActivityRowProps = {
  record: TranslationHistoryRecord;
  onSelect: (record: TranslationHistoryRecord) => void;
};

function getActivitySnippet(record: TranslationHistoryRecord): string {
  return (
    record.translations.at(-1)?.text ?? record.ocrBlocks.at(-1)?.text ?? ''
  );
}

function ActivityRow(props: ActivityRowProps) {
  const {record, onSelect} = props;
  const thumbnailUrl = useThumbnailUrl(record.id);

  const sourceLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.sourceLangCode,
  );
  const targetLang = getLanguageByCode(
    SUPPORTED_LANGUAGES,
    record.targetLangCode,
  );
  const snippet = getActivitySnippet(record);

  return (
    <button
      type="button"
      onClick={() => onSelect(record)}
      className="flex w-full gap-3 rounded-md p-2 text-left transition-colors hover:bg-surface-subtle"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background-muted">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-caption text-text-muted">
            …
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-body-md font-medium text-text">
            {record.originalFileName}
          </p>
          <span className="shrink-0 text-caption text-text-muted">
            {formatDashboardRelativeTime(record.createdAt)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="new" className="px-2 py-0 text-[11px]">
            OCR
          </Badge>
          <span className="text-caption text-text-muted">
            {sourceLang.flag} {sourceLang.name}
          </span>
          <span className="text-caption text-text-muted" aria-hidden>
            →
          </span>
          <span className="text-caption text-text-muted">
            {targetLang.flag} {targetLang.name}
          </span>
        </div>

        {snippet ? (
          <p className="mt-1.5 flex items-start gap-1 text-caption text-text-subtle">
            <IconQuote
              className="mt-0.5 h-3 w-3 shrink-0 text-text-muted"
              aria-hidden
            />
            <span className="line-clamp-1">{snippet}</span>
          </p>
        ) : null}
      </div>
    </button>
  );
}

export default function DashboardRecentActivity(
  props: DashboardRecentActivityProps,
) {
  const {records, onToggleFavorite} = props;
  const [selectedRecord, setSelectedRecord] =
    useState<TranslationHistoryRecord | null>(null);

  const recentRecords = records.slice(0, 3);

  const liveRecord = selectedRecord
    ? (records.find(record => record.id === selectedRecord.id) ?? null)
    : null;

  return (
    <section className="flex h-full flex-col rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-center gap-2">
          <IconClock className="h-4 w-4 text-info" aria-hidden />
          <span className="text-body-md font-semibold text-text pt-1">
            Recent activity
          </span>
        </div>
        <Link
          href={routes.app.history}
          className="flex items-center gap-1 text-caption font-medium text-info hover:underline"
        >
          <span className="pt-1">View all</span>
          <IconExternalLink className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {recentRecords.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <p className="text-body-md text-text-subtle">No activity yet</p>
          <p className="max-w-xs text-caption text-text-muted">
            Upload an image and translate it to see your recent work here.
          </p>
          <Link href={routes.app.new}>
            <Button className="h-6" size="sm">
              Start a new translation
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-border">
          {recentRecords.map(record => (
            <ActivityRow
              key={record.id}
              record={record}
              onSelect={setSelectedRecord}
            />
          ))}
        </div>
      )}

      <HistoryDetailModal
        record={liveRecord}
        open={liveRecord !== null}
        onClose={() => setSelectedRecord(null)}
        onToggleFavorite={onToggleFavorite}
      />
    </section>
  );
}
