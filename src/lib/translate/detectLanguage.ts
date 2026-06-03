const JAPANESE_REGEX = /[\u3040-\u30FF\u4E00-\u9FFF]/;
const KOREAN_REGEX = /[\uAC00-\uD7AF]/;
const CHINESE_REGEX = /[\u4E00-\u9FFF]/;
const ARABIC_REGEX = /[\u0600-\u06FF]/;
const PERSIAN_REGEX = /[\u06A9\u06AF\u06CC]/;

export function detectLanguageFromText(text: string): string {
  const sample = text.slice(0, 500);
  if (!sample.trim()) return 'en';

  if (JAPANESE_REGEX.test(sample)) return 'ja';
  if (KOREAN_REGEX.test(sample)) return 'ko';
  if (ARABIC_REGEX.test(sample) || PERSIAN_REGEX.test(sample)) {
    return PERSIAN_REGEX.test(sample) ? 'fa' : 'ar';
  }
  if (CHINESE_REGEX.test(sample)) return 'zh';

  return 'en';
}
