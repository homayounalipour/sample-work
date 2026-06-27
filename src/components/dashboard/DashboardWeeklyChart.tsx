import type {WeeklyDayData} from '@/lib/dashboard/stats';
import {IconBarChart} from '@/components/dashboard/icons';

type DashboardWeeklyChartProps = {
  data: WeeklyDayData[];
};

export default function DashboardWeeklyChart(props: DashboardWeeklyChartProps) {
  const {data} = props;

  const maxValue = Math.max(
    1,
    ...data.flatMap(day => [day.scans, day.translations]),
  );

  return (
    <section className="rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center gap-2 text-body-md font-semibold text-text">
        <IconBarChart className="h-4 w-4 text-info" aria-hidden />
        <span className="pt-2">This week at a glance</span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-caption text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden />
          Scans
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-success" aria-hidden />
          Translations
        </span>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
        {data.map(day => (
          <div key={day.label} className="flex flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end justify-center gap-1 sm:h-32">
              <div
                className="w-2.5 rounded-t-sm bg-primary sm:w-3"
                style={{height: `${(day.scans / maxValue) * 100}%`}}
                title={`${day.scans} scans`}
              />
              <div
                className="w-2.5 rounded-t-sm bg-success sm:w-3"
                style={{height: `${(day.translations / maxValue) * 100}%`}}
                title={`${day.translations} translations`}
              />
            </div>
            <span className="text-caption text-text-muted">{day.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
