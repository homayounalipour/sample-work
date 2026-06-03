'use client';

import cn from '@/utils/mergeClassNameTailwind';

export type TabItem = {id: string; label: string};

type TabsProps = {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

export default function Tabs({tabs, activeId, onChange, className}: TabsProps) {
  return (
    <div className={cn('flex gap-6 border-b border-border', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative pb-3 text-body-md font-medium transition-colors',
            activeId === tab.id
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
              : 'text-text-muted hover:text-text-subtle',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
