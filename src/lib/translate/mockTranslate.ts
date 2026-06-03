import type {OcrBlock, TranslationBlock} from '@/types/types';

const DEMO_MAP: Record<string, string> = {
  渋谷駅: 'Shibuya Sta.',
  渋谷駅前: 'In front of Shibuya Station',
  中央通り: 'Chuo-dori St.',
  駅: 'Station',
  通り: 'Street',
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function translateLine(text: string, targetCode: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (DEMO_MAP[trimmed]) return DEMO_MAP[trimmed];

  for (const [key, value] of Object.entries(DEMO_MAP)) {
    if (trimmed.includes(key)) {
      return trimmed.replace(key, value);
    }
  }

  if (targetCode === 'en') {
    return `[EN] ${trimmed}`;
  }

  return `[${targetCode.toUpperCase()}] ${trimmed}`;
}

export async function mockTranslateBlocks(
  blocks: OcrBlock[],
  targetCode: string,
): Promise<TranslationBlock[]> {
  await delay(400 + Math.random() * 400);

  return blocks.map(block => ({
    id: block.id,
    text: translateLine(block.text, targetCode),
  }));
}
