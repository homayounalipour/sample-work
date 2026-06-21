'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import type {LanguageOption} from '@/kit/LanguageSelector';
import type {ToastItem} from '@/kit/Toast';
import {
  DEFAULT_SOURCE_CODE,
  DEFAULT_TARGET_CODE,
  getAlternateLanguage,
  getLanguageByCode,
  getTargetLanguages,
  SUPPORTED_LANGUAGES,
} from '@/constants/languages';
import {runOcrJob} from '@/lib/ocr/runOcr';
import {detectLanguageFromText} from '@/lib/translate/detectLanguage';
import {translateBlocks} from '@/lib/translate/translateBlocks';
import {composeTranslatedImage} from '@/lib/image/composeTranslatedImage';
import {downloadBlob} from '@/lib/image/downloadBlob';
import {
  getExportFilename,
  type ExportFormat,
} from '@/lib/image/exportFormat';
import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';
import {useUserSettings} from '@/hooks/useUserSettings';
import type {OcrBlock, TranslationBlock, WorkflowStatus} from '@/types/types';

const MAX_TOASTS = 4;

export function useTranslationWorkflow() {
  const {settings} = useUserSettings();
  const [status, setStatus] = useState<WorkflowStatus>('idle');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrBlocks, setOcrBlocks] = useState<OcrBlock[]>([]);
  const [translations, setTranslations] = useState<TranslationBlock[]>([]);
  const [sourceLang, setSourceLangState] = useState<LanguageOption>(() =>
    getLanguageByCode(SUPPORTED_LANGUAGES, DEFAULT_SOURCE_CODE),
  );
  const [targetLang, setTargetLangState] = useState<LanguageOption>(() =>
    getLanguageByCode(SUPPORTED_LANGUAGES, DEFAULT_TARGET_CODE),
  );
  const [ocrProgress, setOcrProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [lastExportedUrl, setLastExportedUrl] = useState<string | null>(null);
  const exportedBlobRef = useRef<Blob | null>(null);
  const lastExportedUrlRef = useRef<string | null>(null);
  const sourceLangRef = useRef(sourceLang);

  useEffect(() => {
    sourceLangRef.current = sourceLang;
  }, [sourceLang]);

  const setSourceLang = useCallback((lang: LanguageOption) => {
    setSourceLangState(lang);
    setTargetLangState(prev => {
      if (prev.code === lang.code) {
        return getAlternateLanguage(SUPPORTED_LANGUAGES, lang.code, lang);
      }

      const validTargets = getTargetLanguages(SUPPORTED_LANGUAGES, lang);
      if (validTargets.some(target => target.code === prev.code)) {
        return prev;
      }

      return getAlternateLanguage(SUPPORTED_LANGUAGES, lang.code, lang);
    });
  }, []);

  const setTargetLang = useCallback((lang: LanguageOption) => {
    setTargetLangState(lang);
    setSourceLangState(prev =>
      prev.code === lang.code
        ? getAlternateLanguage(SUPPORTED_LANGUAGES, lang.code)
        : prev,
    );
  }, []);

  const addToast = useCallback((title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev =>
      [{id, title, message, variant: 'success' as const}, ...prev].slice(
        0,
        MAX_TOASTS,
      ),
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (previewUrl && previewUrl !== imageUrl)
        URL.revokeObjectURL(previewUrl);
      if (lastExportedUrlRef.current) {
        URL.revokeObjectURL(lastExportedUrlRef.current);
      }
    };
  }, [imageUrl, previewUrl]);

  const runOcrPipeline = useCallback(
    async (url: string, languageHint?: string) => {
      setStatus('ocr_running');
      setOcrProgress(0);
      setError(null);

      try {
        const blocks = await runOcrJob({
          id: 'single',
          imageSource: url,
          providerId: settings.ocrProvider,
          options: {
            language: languageHint ?? sourceLangRef.current.code,
            minConfidence: settings.ocrMinConfidence,
            onProgress: progress => setOcrProgress(progress.progress),
          },
        });

        setOcrBlocks(blocks);

        if (blocks.length > 0) {
          const detected = detectLanguageFromText(
            blocks.map(block => block.text).join(' '),
          );
          setSourceLang(getLanguageByCode(SUPPORTED_LANGUAGES, detected));
          addToast(
            'OCR complete',
            `Found ${blocks.length} text block${blocks.length === 1 ? '' : 's'}.`,
          );
        } else {
          addToast('No text found', 'No readable text was detected in this image.');
        }

        setStatus('ocr_done');
      } catch {
        setError('OCR failed. Please try another image or retry.');
        setStatus('uploaded');
      }
    },
    [addToast, setSourceLang, settings.ocrMinConfidence, settings.ocrProvider],
  );

  const onFileSelect = useCallback(
    (file: File) => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setImageFile(file);
      setImageUrl(url);
      setPreviewUrl(null);
      setOcrBlocks([]);
      setTranslations([]);
      setRotation(0);
      setFlipH(false);
      setZoom(100);
      setStatus('uploaded');
      setError(null);
      addToast('Image uploaded', file.name);
      void runOcrPipeline(url);
    },
    [imageUrl, previewUrl, runOcrPipeline, addToast],
  );

  const onUploadError = useCallback((message: string) => {
    setError(message);
  }, []);

  const onTranslate = useCallback(async () => {
    if (ocrBlocks.length === 0) return;
    setStatus('translating');
    setError(null);

    try {
      const result = await translateBlocks(
        ocrBlocks,
        sourceLang.code,
        targetLang.code,
        settings.translationProvider,
      );
      setTranslations(result);
      setStatus('translated');
      addToast('Translation completed', `${result.length} blocks translated.`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Translation failed. Please try again.',
      );
      setStatus('ocr_done');
    }
  }, [
    ocrBlocks,
    sourceLang.code,
    targetLang.code,
    settings.translationProvider,
    addToast,
  ]);

  const onApply = useCallback(async () => {
    if (!imageUrl || translations.length === 0) return;
    setStatus('applying');
    setError(null);

    try {
      const blob = await composeTranslatedImage({
        imageUrl,
        blocks: ocrBlocks,
        translations,
      });
      const url = URL.createObjectURL(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      exportedBlobRef.current = blob;
      setStatus('applied');
      addToast('Translation applied', 'Preview updated with overlay text.');
    } catch {
      setError('Failed to apply translation on image.');
      setStatus('translated');
    }
  }, [imageUrl, previewUrl, ocrBlocks, translations, addToast]);

  const onExport = useCallback(async () => {
    setStatus('exporting');
    setError(null);

    try {
      let blob: Blob | null = null;

      if (exportFormat === 'png' && exportedBlobRef.current) {
        blob = exportedBlobRef.current;
      } else if (imageUrl) {
        blob = await composeTranslatedImage({
          imageUrl,
          blocks: ocrBlocks,
          translations,
          format: exportFormat,
          quality: DEFAULT_APP_CONFIG.export.quality,
        });
        if (exportFormat === 'png') {
          exportedBlobRef.current = blob;
        }
      }

      if (!blob) throw new Error('Nothing to export');

      downloadBlob(blob, getExportFilename(exportFormat));

      if (lastExportedUrlRef.current) {
        URL.revokeObjectURL(lastExportedUrlRef.current);
      }
      const exportedUrl = URL.createObjectURL(blob);
      lastExportedUrlRef.current = exportedUrl;
      setLastExportedUrl(exportedUrl);

      setExportModalOpen(true);
      setStatus('done');
      addToast('Export complete', 'Your translated file was downloaded.');
    } catch {
      setError('Export failed. Translate your image first.');
      setStatus(previewUrl ? 'applied' : 'translated');
    }
  }, [
    imageUrl,
    ocrBlocks,
    translations,
    exportFormat,
    previewUrl,
    addToast,
  ]);

  const swapLanguages = useCallback(() => {
    const nextSource = targetLang;
    const validTargets = getTargetLanguages(SUPPORTED_LANGUAGES, nextSource);
    const nextTarget =
      validTargets.find(language => language.code === sourceLang.code) ??
      getAlternateLanguage(SUPPORTED_LANGUAGES, nextSource.code, nextSource);

    setSourceLangState(nextSource);
    setTargetLangState(nextTarget);
  }, [sourceLang, targetLang]);

  const replaceImage = useCallback(() => {
    setStatus('idle');
    setImageFile(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageUrl(null);
    setPreviewUrl(null);
    setOcrBlocks([]);
    setTranslations([]);
    exportedBlobRef.current = null;
    if (lastExportedUrlRef.current) {
      URL.revokeObjectURL(lastExportedUrlRef.current);
      lastExportedUrlRef.current = null;
    }
    setLastExportedUrl(null);
  }, [imageUrl, previewUrl]);

  const retryOcr = useCallback(() => {
    if (imageUrl) void runOcrPipeline(imageUrl, sourceLang.code);
  }, [imageUrl, runOcrPipeline, sourceLang.code]);

  const clearError = useCallback(() => setError(null), []);

  const displayUrl = previewUrl ?? imageUrl;

  return {
    status,
    imageFile,
    displayUrl,
    ocrBlocks,
    translations,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    ocrProgress,
    error,
    exportModalOpen,
    setExportModalOpen,
    exportFormat,
    setExportFormat,
    lastExportedUrl,
    toasts,
    rotation,
    flipH,
    zoom,
    setZoom,
    rotate: () => setRotation(r => (r + 90) % 360),
    toggleFlip: () => setFlipH(f => !f),
    onFileSelect,
    onUploadError,
    onTranslate,
    onApply,
    onExport,
    swapLanguages,
    replaceImage,
    retryOcr,
    clearError,
    dismissToast,
    languages: SUPPORTED_LANGUAGES,
  };
}
