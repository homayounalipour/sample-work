import Avatar from '@/kit/Avatar';
import ProgressBar from '@/kit/ProgressBar';
import {IconLogo} from '@/kit/icons';
import cn from '@/utils/mergeClassNameTailwind';

const NAV_ITEMS = [
  {id: 'dashboard', label: 'Dashboard', icon: '▦'},
  {id: 'new', label: 'New Translation', icon: '✦'},
  {id: 'history', label: 'History', icon: '◷'},
  {id: 'favorites', label: 'Favorites', icon: '♡'},
  {id: 'settings', label: 'Settings', icon: '⚙'},
];

type SidebarProps = {
  activeNav?: string;
  onNavChange?: (id: string) => void;
};

export default function Sidebar({
  activeNav = 'new',
  onNavChange,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-background-subtle px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <IconLogo />
        <div>
          <p className="text-body-md font-semibold text-text">ImageTranslate</p>
          <p className="text-caption text-primary">AI</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange?.(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-body-md transition-colors',
                isActive
                  ? 'bg-primary/15 font-medium text-primary'
                  : 'text-text-subtle hover:bg-surface-subtle hover:text-text',
              )}
            >
              <span className="w-5 text-center text-sm opacity-80">
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 px-2">
        <ProgressBar value={6.5} max={10} showLabel label="Storage" />
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
          <Avatar name="John Doe" size="md" />
          <div className="min-w-0">
            <p className="truncate text-body-md font-medium text-text">
              John Doe
            </p>
            <p className="truncate text-caption text-text-muted">
              john@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
