import type {
  OcrProvider,
  OcrProviderId,
  ProviderOption,
} from '@/lib/providers/types';
import {tesseractProvider} from '@/lib/ocr/providers/tesseract';

const OCR_PROVIDERS: Record<OcrProviderId, OcrProvider> = {
  tesseract: tesseractProvider,
};

export const OCR_PROVIDER_OPTIONS: ProviderOption<OcrProviderId>[] =
  Object.values(OCR_PROVIDERS).map(provider => ({
    id: provider.id,
    name: provider.name,
    description: provider.description,
  }));

export function getOcrProvider(id: OcrProviderId = 'tesseract'): OcrProvider {
  const provider = OCR_PROVIDERS[id];
  if (!provider) {
    throw new Error(`Unknown OCR provider: ${id}`);
  }

  return provider;
}

export function listOcrProviders(): OcrProvider[] {
  return Object.values(OCR_PROVIDERS);
}
