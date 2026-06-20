import type Tesseract from 'tesseract.js';
import type {OcrRecognizeOptions} from '@/lib/providers/types';

type ProgressHandler = (progress: {status: string; progress: number}) => void;

type PooledWorker = {
  inner: Tesseract.Worker;
  progress: {current?: ProgressHandler};
};

type PoolRecognizeOptions = OcrRecognizeOptions & {
  signal?: AbortSignal;
};

type QueuedJob = {
  languages: string;
  onProgress?: ProgressHandler;
  resolve: (worker: PooledWorker) => void;
  reject: (error: Error) => void;
  signal?: AbortSignal;
};

type LanguagePool = {
  available: PooledWorker[];
  busy: Set<PooledWorker>;
  creating: number;
};

function resolvePoolSize(): number {
  if (typeof navigator === 'undefined') return 2;
  return Math.min(4, Math.max(1, (navigator.hardwareConcurrency ?? 2) - 1));
}

const poolSize = resolvePoolSize();
const pools = new Map<string, LanguagePool>();
const waitQueue: QueuedJob[] = [];
let cleanupRegistered = false;

function getLanguagePool(languages: string): LanguagePool {
  let pool = pools.get(languages);
  if (!pool) {
    pool = {available: [], busy: new Set(), creating: 0};
    pools.set(languages, pool);
  }
  return pool;
}

function totalWorkers(): number {
  let count = 0;
  for (const pool of pools.values()) {
    count += pool.available.length + pool.busy.size + pool.creating;
  }
  return count;
}

function registerCleanup(): void {
  if (cleanupRegistered || typeof window === 'undefined') return;
  cleanupRegistered = true;

  window.addEventListener('beforeunload', () => {
    void terminateAllWorkers();
  });
}

async function createWorker(languages: string): Promise<PooledWorker> {
  const {createWorker: createTesseractWorker} = await import('tesseract.js');
  const progress: PooledWorker['progress'] = {current: undefined};

  const inner = await createTesseractWorker(languages, 1, {
    logger: message => {
      if (message.status === 'recognizing text') {
        progress.current?.({
          status: message.status,
          progress: Math.round((message.progress ?? 0) * 100),
        });
      }
    },
  });

  return {inner, progress};
}

function rejectJob(job: QueuedJob, error: Error): void {
  job.reject(error);
}

function dequeueWaitingJobs(): void {
  while (waitQueue.length > 0) {
    const job = waitQueue[0];
    if (job.signal?.aborted) {
      waitQueue.shift();
      rejectJob(job, new DOMException('Aborted', 'AbortError'));
      continue;
    }

    const pool = getLanguagePool(job.languages);
    if (pool.available.length > 0) {
      waitQueue.shift();
      const worker = pool.available.pop()!;
      pool.busy.add(worker);
      job.resolve(worker);
      return;
    }

    if (totalWorkers() < poolSize) {
      waitQueue.shift();
      void spawnWorkerForJob(job);
      return;
    }

    break;
  }
}

async function spawnWorkerForJob(job: QueuedJob): Promise<void> {
  const pool = getLanguagePool(job.languages);
  pool.creating += 1;

  try {
    const worker = await createWorker(job.languages);
    pool.busy.add(worker);
    job.resolve(worker);
  } catch (error) {
    job.reject(
      error instanceof Error ? error : new Error('Failed to create OCR worker'),
    );
  } finally {
    pool.creating -= 1;
    dequeueWaitingJobs();
  }
}

function acquireWorker(
  languages: string,
  signal?: AbortSignal,
): Promise<PooledWorker> {
  registerCleanup();

  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }

  return new Promise((resolve, reject) => {
    const job: QueuedJob = {languages, resolve, reject, signal};

    const onAbort = () => {
      const index = waitQueue.indexOf(job);
      if (index >= 0) waitQueue.splice(index, 1);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, {once: true});

    const pool = getLanguagePool(languages);
    if (pool.available.length > 0) {
      const worker = pool.available.pop()!;
      pool.busy.add(worker);
      signal?.removeEventListener('abort', onAbort);
      resolve(worker);
      return;
    }

    if (totalWorkers() < poolSize) {
      void spawnWorkerForJob(job).finally(() => {
        signal?.removeEventListener('abort', onAbort);
      });
      return;
    }

    waitQueue.push(job);
  });
}

function releaseWorker(worker: PooledWorker, languages: string): void {
  worker.progress.current = undefined;
  const pool = getLanguagePool(languages);
  pool.busy.delete(worker);
  pool.available.push(worker);
  dequeueWaitingJobs();
}

async function discardWorker(
  worker: PooledWorker,
  languages: string,
): Promise<void> {
  worker.progress.current = undefined;
  const pool = getLanguagePool(languages);
  pool.busy.delete(worker);
  pool.available = pool.available.filter(w => w !== worker);

  try {
    await worker.inner.terminate();
  } catch {
    // Worker may already be terminated.
  }

  dequeueWaitingJobs();
}

export async function terminateAllWorkers(): Promise<void> {
  const workers: PooledWorker[] = [];

  for (const pool of pools.values()) {
    workers.push(...pool.available, ...pool.busy);
    pool.available = [];
    pool.busy.clear();
    pool.creating = 0;
  }

  pools.clear();
  waitQueue.length = 0;

  await Promise.allSettled(workers.map(worker => worker.inner.terminate()));
}

export async function recognizeWithPool(
  imageSource: string | File | Blob,
  languages: string,
  options?: PoolRecognizeOptions,
): Promise<unknown> {
  const worker = await acquireWorker(languages, options?.signal);
  worker.progress.current = options?.onProgress;

  try {
    const {data} = await worker.inner.recognize(
      imageSource,
      {},
      {blocks: true, text: true},
    );
    releaseWorker(worker, languages);
    return data;
  } catch (error) {
    await discardWorker(worker, languages);
    throw error;
  }
}
