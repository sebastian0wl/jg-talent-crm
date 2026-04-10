import { useState } from 'react'
import type { Attachment, AiAnalysis } from '../types'
import { ATTACHMENT_TYPE_META } from '../types'

interface DocumentViewerProps {
  doc: Attachment
  onClose: () => void
  onExtract?: () => void
}

type ViewTab = 'preview' | 'extracted' | 'analysis'

export default function DocumentViewer({ doc, onClose, onExtract }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>('preview')
  const meta = ATTACHMENT_TYPE_META[doc.fileType] ?? ATTACHMENT_TYPE_META.other
  const isUrl = Boolean(doc.sourceType === 'url' || (!doc.storagePath && doc.publicUrl))

  const hasExtractedText = !!doc.extractedText
  const hasAnalysis = !!doc.aiAnalysis
  const isExtracting = doc.extractionStatus === 'extracting'
  const extractionFailed = doc.extractionStatus === 'failed'

  // Determine if we can embed the content
  const isPdf = doc.mimeType === 'application/pdf' || doc.fileName.toLowerCase().endsWith('.pdf')
  const isImage = Boolean(doc.mimeType?.startsWith('image/'))
  const isText = Boolean(doc.mimeType?.startsWith('text/') || ['.txt', '.md', '.csv', '.json'].some(ext => doc.fileName.toLowerCase().endsWith(ext)))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[90vw] max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg flex-shrink-0">{meta.icon}</span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">{doc.fileName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-500">{meta.label}</span>
                {isUrl && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">URL</span>}
                {doc.fileSize && <span className="text-[10px] text-gray-500">{formatSize(doc.fileSize)}</span>}
                <ExtractionBadge status={doc.extractionStatus} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {doc.publicUrl && (
              <a
                href={doc.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Open Original
              </a>
            )}
            {onExtract && !hasExtractedText && !isExtracting && doc.extractionStatus !== 'skipped' && (
              <button
                onClick={onExtract}
                className="text-[11px] px-2.5 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Extract Text
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 px-5 flex-shrink-0">
          <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
            Preview
          </TabButton>
          <TabButton active={activeTab === 'extracted'} onClick={() => setActiveTab('extracted')} disabled={!hasExtractedText && !isExtracting}>
            Extracted Text {hasExtractedText && <span className="ml-1 text-[9px] bg-green-100 text-green-700 px-1 rounded">Done</span>}
          </TabButton>
          <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} disabled={!hasAnalysis}>
            AI Analysis {hasAnalysis && <span className="ml-1 text-[9px] bg-purple-100 text-purple-700 px-1 rounded">Ready</span>}
          </TabButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'preview' && (
            <PreviewPanel doc={doc} isPdf={isPdf} isImage={isImage} isText={isText} isUrl={isUrl} />
          )}
          {activeTab === 'extracted' && (
            <ExtractedTextPanel doc={doc} isExtracting={isExtracting} extractionFailed={extractionFailed} />
          )}
          {activeTab === 'analysis' && (
            <AnalysisPanel analysis={doc.aiAnalysis} />
          )}
        </div>

        {/* Description footer */}
        {doc.description && (
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <p className="text-[11px] text-gray-600"><span className="font-medium">Description:</span> {doc.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ──

function TabButton({ active, onClick, disabled, children }: { active: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center ${
        active
          ? 'border-brand-600 text-brand-700'
          : disabled
            ? 'border-transparent text-gray-300 cursor-not-allowed'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

function ExtractionBadge({ status }: { status?: string }) {
  if (!status || status === 'pending') return null
  const styles: Record<string, string> = {
    extracting: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    skipped: 'bg-gray-100 text-gray-500',
  }
  const labels: Record<string, string> = {
    extracting: 'Extracting...',
    done: 'Extracted',
    failed: 'Failed',
    skipped: 'N/A',
  }
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}

function PreviewPanel({ doc, isPdf, isImage, isText, isUrl }: { doc: Attachment; isPdf: boolean; isImage: boolean; isText: boolean; isUrl: boolean }) {
  if (!doc.publicUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No preview available — file has no public URL
      </div>
    )
  }

  // PDF: embed in iframe
  if (isPdf) {
    return <iframe src={doc.publicUrl} className="w-full h-full border-0" title={doc.fileName} />
  }

  // Image: show inline
  if (isImage) {
    return (
      <div className="flex items-center justify-center h-full p-6 bg-gray-50">
        <img src={doc.publicUrl} alt={doc.fileName} className="max-w-full max-h-full object-contain rounded shadow" />
      </div>
    )
  }

  // Text files that have been extracted: show the text
  if (isText && doc.extractedText) {
    return (
      <pre className="p-5 text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">{doc.extractedText}</pre>
    )
  }

  // URL attachments: embed in iframe
  if (isUrl) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-blue-600 truncate flex-1">{doc.publicUrl}</span>
          <a href={doc.publicUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-700 font-medium hover:underline flex-shrink-0">
            Open in new tab
          </a>
        </div>
        <iframe src={doc.publicUrl} className="flex-1 w-full border-0" title={doc.fileName} sandbox="allow-same-origin allow-scripts" />
      </div>
    )
  }

  // Fallback: link to open
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <span className="text-4xl">{ATTACHMENT_TYPE_META[doc.fileType]?.icon ?? '📎'}</span>
      <p className="text-sm">Preview not available for this file type</p>
      <a href={doc.publicUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
        Open file in new tab
      </a>
    </div>
  )
}

function ExtractedTextPanel({ doc, isExtracting, extractionFailed }: { doc: Attachment; isExtracting: boolean; extractionFailed: boolean }) {
  if (isExtracting) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-xs">Extracting text from document...</p>
      </div>
    )
  }

  if (extractionFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-red-400">
        <p className="text-sm font-medium">Extraction failed</p>
        <p className="text-xs text-gray-400">This file type may not be supported for automatic extraction</p>
      </div>
    )
  }

  if (!doc.extractedText) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
        <p className="text-sm">No extracted text yet</p>
        <p className="text-xs">Click "Extract Text" to process this document</p>
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Extracted Content</span>
        <span className="text-[10px] text-gray-400">{doc.extractedText.length.toLocaleString()} characters</span>
      </div>
      <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        {doc.extractedText}
      </pre>
    </div>
  )
}

function AnalysisPanel({ analysis }: { analysis?: AiAnalysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
        <p className="text-sm">No AI analysis yet</p>
        <p className="text-xs">Analysis runs after text extraction is complete</p>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-4">
      {analysis.summary && (
        <div>
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Summary</h4>
          <p className="text-xs text-gray-800 leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      {analysis.documentType && (
        <div>
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Document Type</h4>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{analysis.documentType}</span>
        </div>
      )}

      {analysis.keyTerms && analysis.keyTerms.length > 0 && (
        <div>
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Key Terms</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keyTerms.map((term, i) => (
              <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{term}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.dealFieldSuggestions && Object.keys(analysis.dealFieldSuggestions).length > 0 && (
        <div>
          <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Suggested Deal Updates</h4>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
            {Object.entries(analysis.dealFieldSuggestions).map(([field, value]) => (
              <div key={field} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-amber-800 capitalize">{field.replace(/_/g, ' ')}:</span>
                <span className="text-amber-700">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.confidence !== undefined && (
        <div className="pt-2 border-t border-gray-200">
          <span className="text-[10px] text-gray-400">Confidence: {Math.round(analysis.confidence * 100)}%</span>
        </div>
      )}
    </div>
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
