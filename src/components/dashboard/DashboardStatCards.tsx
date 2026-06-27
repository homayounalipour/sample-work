import type {ReactNode} from 'react';
import type {DashboardStats} from '@/lib/dashboard/stats';
import {
  IconCalendarClock,
  IconGlobe,
  IconScan,
  IconTranslate,
  IconTrendUp,
} from '@/components/dashboard/icons';
import cn from '@/utils/mergeClassNameTailwind';

type DashboardStatCardsProps = {
  stats: DashboardStats;
};

type StatCardConfig = {
  label: string;
  value: number;
  delta: number;
  deltaLabel: string;
  icon: ReactNode;
  accentClass: string;
  iconBgClass: string;
};

function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return '0';
}

export default function DashboardStatCards(props: DashboardStatCardsProps) {
  const {stats} = props;

  const cards: StatCardConfig[] = [
    {
      label: 'OCR scans today',
      value: stats.scansToday,
      delta: stats.scansTodayDelta,
      deltaLabel: 'vs yesterday',
      icon: <IconScan className="h-4 w-4" />,
      accentClass: 'border-t-primary',
      iconBgClass: 'bg-primary/15 text-primary',
    },
    {
      label: 'Scans this week',
      value: stats.scansThisWeek,
      delta: stats.scansThisWeekDelta,
      deltaLabel: 'vs last week',
      icon: <IconCalendarClock className="h-4 w-4" />,
      accentClass: 'border-t-success',
      iconBgClass: 'bg-success/15 text-success',
    },
    {
      label: 'Translations done',
      value: stats.translationsDone,
      delta: stats.translationsThisWeekDelta,
      deltaLabel: 'this week',
      icon: <IconTranslate className="h-4 w-4" />,
      accentClass: 'border-t-warning',
      iconBgClass: 'bg-warning/15 text-warning',
    },
    {
      label: 'Languages used',
      value: stats.languagesUsed,
      delta: stats.languagesThisWeekDelta,
      deltaLabel: 'new this week',
      icon: <IconGlobe className="h-4 w-4" />,
      accentClass: 'border-t-[rgb(236,72,153)]',
      iconBgClass: 'bg-[rgb(236,72,153)]/15 text-[rgb(236,72,153)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <article
          key={card.label}
          className={cn(
            'rounded-(--radius-lg) border border-border border-t-2 bg-surface p-4',
            card.accentClass,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-caption font-medium uppercase tracking-wide text-text-muted">
              {card.label}
            </p>
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-sm)',
                card.iconBgClass,
              )}
            >
              {card.icon}
            </span>
          </div>

          <p className="mt-3 text-h2 font-semibold text-text">{card.value}</p>

          <p className="mt-2 flex items-center gap-1 text-caption text-text-muted">
            <IconTrendUp
              className={cn(
                'h-3.5 w-3.5',
                card.delta >= 0 ? 'text-success' : 'text-error',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'font-medium',
                card.delta >= 0 ? 'text-success' : 'text-error',
              )}
            >
              {formatDelta(card.delta)}
            </span>
            <span>{card.deltaLabel}</span>
          </p>
        </article>
      ))}
    </div>
  );
}
