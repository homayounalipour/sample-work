import {get, set, del, keys} from 'idb-keyval';
import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';
import {
  createThumbnail,
  getImageDimensions,
} from '@/lib/history/createThumbnail';
import type {
  HistoryBlobs,
  SaveHistoryEntryInput,
  TranslationHistoryRecord,
} from '@/types/history';

const INDEX_KEY = 'translation-app-history-index';

export const EMPTY_HISTORY_SNAPSHOT: TranslationHistoryRecord[] = [];

const listeners = new Set<() => void>();

let cachedSnapshot: TranslationHistoryRecord[] = EMPTY_HISTORY_SNAPSHOT;
let cacheInitialized = false;

function blobKey(id: string, kind: 'original' | 'translated' | 'thumbnail') {
  return `history:${id}:${kind}`;
}

function notifySubscribers() {
  listeners.forEach(listener => listener());
}

function sortRecords(
  records: TranslationHistoryRecord[],
): TranslationHistoryRecord[] {
  return [...records].sort((a, b) => b.createdAt - a.createdAt);
}

async function loadIndexFromDb(): Promise<TranslationHistoryRecord[]> {
  if (typeof window === 'undefined') return [];

  const stored = await get<TranslationHistoryRecord[]>(INDEX_KEY);
  if (!Array.isArray(stored)) return [];

  return sortRecords(
    stored.filter(
      (record): record is TranslationHistoryRecord =>
        typeof record?.id === 'string' &&
        typeof record.createdAt === 'number' &&
        typeof record.sourceLangCode === 'string' &&
        typeof record.targetLangCode === 'string',
    ),
  );
}

async function syncCacheFromDb(): Promise<TranslationHistoryRecord[]> {
  cachedSnapshot = await loadIndexFromDb();
  cacheInitialized = true;
  return cachedSnapshot;
}

export function getHistorySnapshot(): TranslationHistoryRecord[] {
  if (typeof window === 'undefined') return EMPTY_HISTORY_SNAPSHOT;

  if (!cacheInitialized) {
    void syncCacheFromDb().then(() => notifySubscribers());
    return cachedSnapshot;
  }

  return cachedSnapshot;
}

export function getHistoryServerSnapshot(): TranslationHistoryRecord[] {
  return EMPTY_HISTORY_SNAPSHOT;
}

export async function refreshHistoryCache(): Promise<
  TranslationHistoryRecord[]
> {
  cachedSnapshot = await loadIndexFromDb();
  cacheInitialized = true;
  notifySubscribers();
  return cachedSnapshot;
}

async function writeIndex(records: TranslationHistoryRecord[]) {
  const sorted = sortRecords(records);
  await set(INDEX_KEY, sorted);
  cachedSnapshot = sorted;
  cacheInitialized = true;
  notifySubscribers();
}

async function deleteBlobKeys(id: string) {
  await Promise.all([
    del(blobKey(id, 'original')),
    del(blobKey(id, 'translated')),
    del(blobKey(id, 'thumbnail')),
  ]);
}

async function trimToMaxEntries(records: TranslationHistoryRecord[]) {
  const maxEntries = DEFAULT_APP_CONFIG.history.maxEntries;
  if (records.length <= maxEntries) return records;

  const sorted = sortRecords(records);
  const toRemove = sorted.slice(maxEntries);

  await Promise.all(
    toRemove.map(async record => {
      await deleteBlobKeys(record.id);
    }),
  );

  return sorted.slice(0, maxEntries);
}

export async function saveHistoryEntry(
  input: SaveHistoryEntryInput,
): Promise<TranslationHistoryRecord> {
  if (typeof window === 'undefined') {
    throw new Error('History storage is only available in the browser');
  }

  const id = input.id ?? crypto.randomUUID();
  const existingRecords = await loadIndexFromDb();
  const existing = existingRecords.find(record => record.id === id);

  const thumbnail = await createThumbnail(input.translatedBlob);

  const writes: Promise<void>[] = [
    set(blobKey(id, 'translated'), input.translatedBlob),
    set(blobKey(id, 'thumbnail'), thumbnail),
  ];

  if (input.originalFile) {
    writes.push(set(blobKey(id, 'original'), input.originalFile));
  }

  await Promise.all(writes);

  const record: TranslationHistoryRecord = {
    id,
    createdAt: existing?.createdAt ?? Date.now(),
    sourceLangCode: input.sourceLangCode,
    targetLangCode: input.targetLangCode,
    originalFileName: input.originalFileName,
    ocrBlocks: input.ocrBlocks,
    translations: input.translations,
    isFavorite: input.isFavorite ?? existing?.isFavorite ?? false,
    hasTranslatedImage: true,
  };

  const nextRecords = await trimToMaxEntries([
    record,
    ...existingRecords.filter(item => item.id !== id),
  ]);

  await writeIndex(nextRecords);
  return record;
}

export async function toggleHistoryFavorite(
  id: string,
): Promise<TranslationHistoryRecord | null> {
  const records = await loadIndexFromDb();
  const index = records.findIndex(record => record.id === id);
  if (index === -1) return null;

  const updated: TranslationHistoryRecord = {
    ...records[index],
    isFavorite: !records[index].isFavorite,
  };

  const nextRecords = [...records];
  nextRecords[index] = updated;
  await writeIndex(nextRecords);
  return updated;
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const records = await loadIndexFromDb();
  await deleteBlobKeys(id);
  await writeIndex(records.filter(record => record.id !== id));
}

export async function getHistoryBlobs(id: string): Promise<HistoryBlobs> {
  const [original, translated, thumbnail] = await Promise.all([
    get<Blob>(blobKey(id, 'original')),
    get<Blob>(blobKey(id, 'translated')),
    get<Blob>(blobKey(id, 'thumbnail')),
  ]);

  return {
    original: original ?? null,
    translated: translated ?? null,
    thumbnail: thumbnail ?? null,
  };
}

export function getFavoriteRecords(): TranslationHistoryRecord[] {
  return getHistorySnapshot().filter(record => record.isFavorite);
}

export async function getThumbnailUrl(id: string): Promise<string | null> {
  const minWidth = DEFAULT_APP_CONFIG.history.thumbnailMaxWidth;
  let thumbnail = await get<Blob>(blobKey(id, 'thumbnail'));

  if (thumbnail) {
    const {width} = await getImageDimensions(thumbnail);
    if (width >= minWidth) {
      return URL.createObjectURL(thumbnail);
    }
  }

  const translated = await get<Blob>(blobKey(id, 'translated'));
  if (!translated) {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }

  thumbnail = await createThumbnail(translated);
  await set(blobKey(id, 'thumbnail'), thumbnail);
  return URL.createObjectURL(thumbnail);
}

export function subscribeHistory(callback: () => void): () => void {
  listeners.add(callback);

  if (typeof window !== 'undefined' && !cacheInitialized) {
    void syncCacheFromDb().then(() => callback());
  }

  return () => {
    listeners.delete(callback);
  };
}

export async function clearAllHistory(): Promise<void> {
  const allKeys = await keys();
  const historyKeys = allKeys.filter(
    key =>
      typeof key === 'string' &&
      (key === INDEX_KEY || key.startsWith('history:')),
  );

  await Promise.all(historyKeys.map(key => del(key)));
  cachedSnapshot = EMPTY_HISTORY_SNAPSHOT;
  cacheInitialized = true;
  notifySubscribers();
}
