'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import type {LanguageOption} from '@/kit/LanguageSelector';
import type {ToastItem} from '@/kit/Toast';
import {getLanguageByCode, LANGUAGES} from '@/constants/languages';
import {detectLanguageFromText} from '@/lib/translate/detectLanguage';
import {mockTranslateBlocks} from '@/lib/translate/mockTranslate';
import {runOcr} from '@/lib/ocr/runOcr';
import {composeTranslatedImage} from '@/lib/image/composeTranslatedImage';
import {downloadBlob} from '@/lib/image/downloadBlob';
import type {OcrBlock, TranslationBlock, WorkflowStatus} from '@/types/types';

const MAX_TOASTS = 4;

export function useTranslationWorkflow() {
  const [status, setStatus] = useState<WorkflowStatus>('idle');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrBlocks, setOcrBlocks] = useState<OcrBlock[]>([]);
  const [translations, setTranslations] = useState<TranslationBlock[]>([]);
  const [sourceLang, setSourceLang] = useState<LanguageOption>(
    () => LANGUAGES[1],
  );
  const [targetLang, setTargetLang] = useState<LanguageOption>(
    () => LANGUAGES[0],
  );
  const [ocrProgress, setOcrProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [zoom, setZoom] = useState(100);
  const exportedBlobRef = useRef<Blob | null>(null);

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
    };
  }, [imageUrl, previewUrl]);

  const runOcrPipeline = useCallback(
    async (url: string) => {
      setStatus('ocr_running');
      setOcrProgress(0);
      setError(null);
      try {
        const blocks = await runOcr(url, p => setOcrProgress(p.progress));
        setOcrBlocks(blocks);
        if (blocks.length > 0) {
          const detected = detectLanguageFromText(
            blocks.map(b => b.text).join(' '),
          );
          setSourceLang(getLanguageByCode(detected));
        }
        setStatus('ocr_done');
        addToast(
          'OCR complete',
          `Found ${blocks.length} text block${blocks.length === 1 ? '' : 's'}.`,
        );
      } catch {
        setError('OCR failed. Please try another image or retry.');
        setStatus('uploaded');
      }
    },
    [addToast],
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
      const result = await mockTranslateBlocks(ocrBlocks, targetLang.code);
      setTranslations(result);
      setStatus('translated');
      addToast('Translation completed', `${result.length} blocks translated.`);
    } catch {
      setError('Translation failed. Please try again.');
      setStatus('ocr_done');
    }
  }, [ocrBlocks, targetLang.code, addToast]);

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
      let blob = exportedBlobRef.current;
      if (!blob && imageUrl) {
        blob = await composeTranslatedImage({
          imageUrl,
          blocks: ocrBlocks,
          translations,
        });
        exportedBlobRef.current = blob;
      }
      if (!blob) throw new Error('Nothing to export');
      downloadBlob(blob, 'translated-image.png');
      setExportModalOpen(true);
      setStatus('done');
      addToast('Export complete', 'Your translated image was downloaded.');
    } catch {
      setError('Export failed. Apply translation first.');
      setStatus('applied');
    }
  }, [imageUrl, ocrBlocks, translations, addToast]);

  const swapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
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
  }, [imageUrl, previewUrl]);

  const retryOcr = useCallback(() => {
    if (imageUrl) void runOcrPipeline(imageUrl);
  }, [imageUrl, runOcrPipeline]);

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
    languages: LANGUAGES,
  };
}
