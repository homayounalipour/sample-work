import type {TranslationHistoryRecord} from '@/types/history';

export type WeeklyDayData = {
  label: string;
  scans: number;
  translations: number;
};

export type DashboardStats = {
  scansToday: number;
  scansTodayDelta: number;
  scansThisWeek: number;
  scansThisWeekDelta: number;
  translationsDone: number;
  translationsThisWeekDelta: number;
  languagesUsed: number;
  languagesThisWeekDelta: number;
  weeklyChart: WeeklyDayData[];
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isInRange(timestamp: number, start: Date, end: Date): boolean {
  return timestamp >= start.getTime() && timestamp < end.getTime();
}

function countRecordsInRange(
  records: TranslationHistoryRecord[],
  start: Date,
  end: Date,
): number {
  return records.filter(record => isInRange(record.createdAt, start, end))
    .length;
}

function countTranslationBlocksInRange(
  records: TranslationHistoryRecord[],
  start: Date,
  end: Date,
): number {
  return records.reduce((total, record) => {
    if (!isInRange(record.createdAt, start, end)) return total;
    return total + record.translations.length;
  }, 0);
}

function getUniqueLanguages(
  records: TranslationHistoryRecord[],
  start?: Date,
  end?: Date,
): Set<string> {
  const codes = new Set<string>();
  for (const record of records) {
    if (start && end && !isInRange(record.createdAt, start, end)) continue;
    codes.add(record.sourceLangCode);
    codes.add(record.targetLangCode);
  }
  return codes;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildWeeklyChart(
  records: TranslationHistoryRecord[],
  now: Date,
): WeeklyDayData[] {
  const weekStart = startOfWeek(now);

  return WEEKDAY_LABELS.map((label, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    return {
      label,
      scans: countRecordsInRange(records, dayStart, dayEnd),
      translations: countTranslationBlocksInRange(records, dayStart, dayEnd),
    };
  });
}

export function computeDashboardStats(
  records: TranslationHistoryRecord[],
  now: Date = new Date(),
): DashboardStats {
  const todayStart = startOfDay(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const thisWeekStart = startOfWeek(now);
  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(thisWeekStart.getDate() + 7);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const scansToday = countRecordsInRange(records, todayStart, tomorrowStart);
  const scansYesterday = countRecordsInRange(
    records,
    yesterdayStart,
    todayStart,
  );

  const scansThisWeek = countRecordsInRange(
    records,
    thisWeekStart,
    nextWeekStart,
  );
  const scansLastWeek = countRecordsInRange(
    records,
    lastWeekStart,
    thisWeekStart,
  );

  const translationsDone = records.reduce(
    (total, record) => total + record.translations.length,
    0,
  );

  const translationsThisWeek = countTranslationBlocksInRange(
    records,
    thisWeekStart,
    nextWeekStart,
  );
  const translationsLastWeek = countTranslationBlocksInRange(
    records,
    lastWeekStart,
    thisWeekStart,
  );

  const languagesUsed = getUniqueLanguages(records).size;
  const languagesThisWeek = getUniqueLanguages(
    records,
    thisWeekStart,
    nextWeekStart,
  );
  const languagesLastWeek = getUniqueLanguages(
    records,
    lastWeekStart,
    thisWeekStart,
  );

  const newLanguagesThisWeek = [...languagesThisWeek].filter(
    code => !languagesLastWeek.has(code),
  ).length;

  return {
    scansToday,
    scansTodayDelta: scansToday - scansYesterday,
    scansThisWeek,
    scansThisWeekDelta: scansThisWeek - scansLastWeek,
    translationsDone,
    translationsThisWeekDelta: translationsThisWeek - translationsLastWeek,
    languagesUsed,
    languagesThisWeekDelta: newLanguagesThisWeek,
    weeklyChart: buildWeeklyChart(records, now),
  };
}

export function getUserFirstName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  if (displayName?.trim()) {
    return displayName.trim().split(/\s+/)[0] ?? 'there';
  }
  if (email) {
    return email.split('@')[0] ?? 'there';
  }
  return 'there';
}

export function formatDashboardDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
