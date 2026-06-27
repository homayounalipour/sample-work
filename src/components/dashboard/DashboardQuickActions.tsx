import type {ReactNode} from 'react';
import Link from 'next/link';
import {IconArrowRight} from '@/kit/icons';
import {
  IconHistoryBrowse,
  IconLightning,
  IconUploadImage,
} from '@/components/dashboard/icons';
import {routes} from '@/constants/routes';
import cn from '@/utils/mergeClassNameTailwind';

type DashboardQuickActionsProps = {
  totalScans: number;
};

type ActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary';
};

function ActionCard(props: ActionCardProps) {
  const {href, title, description, icon, variant = 'secondary'} = props;
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-4 rounded-(--radius-lg) p-4 transition-colors',
        isPrimary
          ? 'bg-primary text-white hover:bg-primary-hover'
          : 'border border-border bg-surface-subtle hover:bg-surface',
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-md)',
          isPrimary
            ? 'bg-white/15 text-white'
            : 'bg-background-muted text-text-subtle',
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-body-md font-semibold',
            isPrimary ? 'text-white' : 'text-text',
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            'mt-0.5 block text-caption',
            isPrimary ? 'text-white/80' : 'text-text-muted',
          )}
        >
          {description}
        </span>
      </span>

      <IconArrowRight
        className={cn(
          'h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5',
          isPrimary ? 'text-white/80' : 'text-text-muted',
        )}
        aria-hidden
      />
    </Link>
  );
}

export default function DashboardQuickActions(
  props: DashboardQuickActionsProps,
) {
  const {totalScans} = props;

  return (
    <section className="rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center gap-2 text-body-md font-semibold text-text">
        <IconLightning className="h-4 w-4 text-info" aria-hidden />
        <span className="pt-1">Quick actions</span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <ActionCard
          href={routes.app.new}
          variant="primary"
          title="Upload image for OCR"
          description="Extract text from PNG, JPG, WEBP — then translate instantly"
          icon={<IconUploadImage className="h-5 w-5" />}
        />
        <ActionCard
          href={routes.app.history}
          title="Browse history"
          description={`View all ${totalScans} scan${totalScans === 1 ? '' : 's'} and exports`}
          icon={<IconHistoryBrowse className="h-5 w-5" />}
        />
      </div>
    </section>
  );
}
