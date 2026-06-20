'use client';

import Alert from '@/kit/Alert';
import UploadZone from '@/kit/UploadZone';
import {useTranslationWorkflow} from '@/hooks/useTranslationWorkflow';
import ExportModal from './ExportModal';
import ImageViewer from './ImageViewer';
import NotificationHost from './NotificationHost';
import OcrResultsPanel from './OcrResultsPanel';
import TranslationHeader from './TranslationHeader';
import TranslationPanel from './TranslationPanel';

export default function TranslationWorkspace() {
  const workflow = useTranslationWorkflow();
  const hasImage = Boolean(workflow.displayUrl);
  const isOcrRunning = workflow.status === 'ocr_running';

  return (
    <>
      <TranslationHeader
        onExport={workflow.onExport}
        exportDisabled={!hasImage || workflow.translations.length === 0}
        isExporting={workflow.status === 'exporting'}
      />

      {workflow.error && (
        <div className="px-4 pb-2 sm:px-6">
          <Alert
            variant="error"
            title={workflow.error}
            onClose={workflow.clearError}
          />
          {workflow.status === 'uploaded' && (
            <button
              type="button"
              className="mt-2 text-caption text-primary hover:underline"
              onClick={workflow.retryOcr}
            >
              Retry OCR
            </button>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 pt-2 sm:p-6 sm:pt-2">
        {!hasImage ? (
          <UploadZone
            onFileSelect={workflow.onFileSelect}
            onError={workflow.onUploadError}
            className="min-h-64 flex-1 sm:min-h-100"
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto xl:flex-row xl:overflow-hidden">
            <div className="flex min-h-64 min-w-0 flex-1 sm:min-h-80 xl:min-h-0">
              <ImageViewer
                imageUrl={workflow.displayUrl}
                zoom={workflow.zoom}
                onZoomChange={workflow.setZoom}
                rotation={workflow.rotation}
                flipH={workflow.flipH}
                onRotate={workflow.rotate}
                onFlip={workflow.toggleFlip}
                onReplace={workflow.replaceImage}
                isLoading={isOcrRunning || workflow.status === 'applying'}
                loadingLabel={
                  isOcrRunning
                    ? `Running OCR… ${workflow.ocrProgress}%`
                    : 'Applying translation…'
                }
              />
            </div>
            <div className="flex shrink-0 flex-col gap-4 md:flex-row xl:contents">
              <OcrResultsPanel
                blocks={workflow.ocrBlocks}
                isLoading={isOcrRunning}
                progress={workflow.ocrProgress}
                hasImage={hasImage}
              />
              <TranslationPanel
                sourceLang={workflow.sourceLang}
                targetLang={workflow.targetLang}
                languages={workflow.languages}
                onSourceChange={workflow.setSourceLang}
                onTargetChange={workflow.setTargetLang}
                onSwap={workflow.swapLanguages}
                translations={workflow.translations}
                onTranslate={workflow.onTranslate}
                onApply={workflow.onApply}
                isTranslating={workflow.status === 'translating'}
                isApplying={workflow.status === 'applying'}
                translateDisabled={
                  workflow.ocrBlocks.length === 0 || isOcrRunning
                }
                applyDisabled={
                  workflow.translations.length === 0 ||
                  workflow.status === 'translating'
                }
              />
            </div>
          </div>
        )}
      </div>

      <NotificationHost
        toasts={workflow.toasts}
        onDismiss={workflow.dismissToast}
      />
      <ExportModal
        open={workflow.exportModalOpen}
        onClose={() => workflow.setExportModalOpen(false)}
        onViewFile={() => {
          if (workflow.displayUrl) window.open(workflow.displayUrl, '_blank');
          workflow.setExportModalOpen(false);
        }}
      />
    </>
  );
}
