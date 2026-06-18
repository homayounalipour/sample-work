import {DEFAULT_APP_CONFIG, type AppConfig} from '@/lib/config/defaults';
import type {OcrProviderId, TranslationProviderId} from '@/lib/providers/types';
import {parseNumber} from '@/utils/parseNumber';
import {parseEnumValue} from '@/utils/parseEnumValue';

const OCR_PROVIDER_IDS = [
  'tesseract',
] as const satisfies readonly OcrProviderId[];
const TRANSLATION_PROVIDER_IDS = [
  'mymemory',
] as const satisfies readonly TranslationProviderId[];

export function getServerConfig(): AppConfig {
  return {
    ocr: {
      provider: parseEnumValue(
        process.env.OCR_PROVIDER,
        OCR_PROVIDER_IDS,
        DEFAULT_APP_CONFIG.ocr.provider,
      ),
      defaultLanguages:
        process.env.OCR_LANGUAGES?.trim() ||
        DEFAULT_APP_CONFIG.ocr.defaultLanguages,
      minConfidence: parseNumber(
        process.env.OCR_MIN_CONFIDENCE,
        DEFAULT_APP_CONFIG.ocr.minConfidence,
      ),
    },
    translation: {
      provider: parseEnumValue(
        process.env.TRANSLATION_PROVIDER,
        TRANSLATION_PROVIDER_IDS,
        DEFAULT_APP_CONFIG.translation.provider,
      ),
      batchDelayMs: parseNumber(
        process.env.TRANSLATION_BATCH_DELAY_MS,
        DEFAULT_APP_CONFIG.translation.batchDelayMs,
      ),
    },
    defaults: {
      sourceLang:
        process.env.DEFAULT_SOURCE_LANG?.trim() ||
        DEFAULT_APP_CONFIG.defaults.sourceLang,
      targetLang:
        process.env.DEFAULT_TARGET_LANG?.trim() ||
        DEFAULT_APP_CONFIG.defaults.targetLang,
    },
    export: {
      format: DEFAULT_APP_CONFIG.export.format,
      quality: DEFAULT_APP_CONFIG.export.quality,
    },
  };
}
