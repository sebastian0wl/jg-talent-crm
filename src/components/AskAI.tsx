import { useState, useRef, useEffect, useCallback } from 'react'
import { useData } from '../lib/DataContext'
import { useScoring } from '../lib/useScoring'
import { useAskAI, type ChatMessage } from '../lib/useAskAI'
import { buildDealContext, type DataFreshness } from '../lib/dealContext'
import type { ProposedAction } from '../lib/edgeFunctions'

interface Props {
  dealId: string
  onClose: () => void
  inline?: boolean
}

// ── Main Component ──

export function AskAI({ dealId, onClose, inline }: Props) {
  const {
    getDeal, getCompany, getContactsForDeal,
    tasks, activities, attachments,
  } = useData()
  const { score } = useScoring(dealId)
  const { messages, isLoading, sendMessage, approveAction, dismissAction } = useAskAI(dealId)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const deal = getDeal(dealId)
  const company = deal ? getCompany(deal.companyId) : undefined

  // Calculate freshness for the banner
  const freshness = deal
    ? buildDealContext(deal, company, getContactsForDeal(dealId), tasks, activities, attachments, score ?? null).freshness
    : null

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    setInput('')
    sendMessage(trimmed)
  }, [input, isLoading, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  if (!deal) return null

  // Inline mode: rendered inside the DealDetail flex container
  if (inline) {
    return (
      <div className="flex flex-col border-l border-border bg-white animate-slide-in-right" style={{ width: 420, minWidth: 320 }}>
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">&#10024;</span>
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Ask AI</h2>
                <p className="text-xs text-text-muted truncate max-w-[260px]">
                  {deal.name} &middot; {company?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-lg p-1 rounded-lg hover:bg-surface-muted transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Context Audit Banner */}
        {freshness && <ContextBanner freshness={freshness} />}

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && <EmptyState dealName={deal.name} />}
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onApprove={(actionId) => approveAction(msg.id, actionId)}
              onDismiss={(actionId) => dismissAction(msg.id, actionId)}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </div>

        {/* Input Bar */}
        <div className="shrink-0 border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this deal..."
              className="flex-1 text-sm bg-surface-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 text-text-primary placeholder:text-text-muted/60 transition-shadow"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="shrink-0 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-[10px] text-text-muted/50 mt-1.5 text-center">
            AI may not have complete context. Always verify critical details.
          </p>
        </div>

        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0.8; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.25s ease-out;
          }
        `}</style>
      </div>
    )
  }

  // Standalone overlay mode (fallback for mobile / non-inline use)
  return (
    <>
      <div className="fixed inset-0 bg-black/10 z-[60]" onClick={onClose} />
      <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[420px] bg-white border-l border-border z-[70] flex flex-col shadow-2xl animate-slide-in-right">
        <div className="shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">&#10024;</span>
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Ask AI</h2>
                <p className="text-xs text-text-muted truncate max-w-[260px]">
                  {deal.name} &middot; {company?.name}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-lg p-1 rounded-lg hover:bg-surface-muted transition-colors">&times;</button>
          </div>
        </div>
        {freshness && <ContextBanner freshness={freshness} />}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && <EmptyState dealName={deal.name} />}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} onApprove={(actionId) => approveAction(msg.id, actionId)} onDismiss={(actionId) => dismissAction(msg.id, actionId)} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
        <div className="shrink-0 border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about this deal..." className="flex-1 text-sm bg-surface-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 text-text-primary placeholder:text-text-muted/60 transition-shadow" disabled={isLoading} />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="shrink-0 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">Send</button>
          </div>
          <p className="text-[10px] text-text-muted/50 mt-1.5 text-center">AI may not have complete context. Always verify critical details.</p>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.8; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </>
  )
}

// ── Context Audit Banner ──

function ContextBanner({ freshness }: { freshness: DataFreshness }) {
  const confidenceColor = {
    high: 'text-emerald-600 bg-emerald-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-red-600 bg-red-50',
  }[freshness.confidenceLevel]

  return (
    <div className="shrink-0 px-4 py-2 border-b border-border bg-surface-muted/50">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
        {/* Deal data */}
        <StatusPill icon="&#9989;" label="Deal data" detail="live" />

        {/* Emails */}
        {freshness.lastEmailAge ? (
          <StatusPill
            icon={hoursBetween(freshness.lastEmailAge) > 24 ? '&#9888;&#65039;' : '&#9989;'}
            label="Emails"
            detail={freshness.lastEmailAge}
          />
        ) : (
          <StatusPill icon="&#10060;" label="No emails" />
        )}

        {/* Tasks */}
        <StatusPill
          icon={freshness.taskCount > 0 ? '&#9989;' : '&#9888;&#65039;'}
          label={`${freshness.taskCount} task${freshness.taskCount !== 1 ? 's' : ''}`}
          detail={freshness.openTaskCount > 0 ? `${freshness.openTaskCount} open` : undefined}
        />

        {/* Brief */}
        {freshness.hasBrief
          ? <StatusPill icon="&#9989;" label="Brief" />
          : <StatusPill icon="&#10060;" label="No brief" />
        }

        {/* Contract */}
        {freshness.hasContract
          ? <StatusPill icon="&#9989;" label="Contract" />
          : <StatusPill icon="&#10060;" label="No contract" />
        }
      </div>

      {/* Confidence */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${confidenceColor}`}>
          Confidence: {freshness.confidenceLevel.charAt(0).toUpperCase() + freshness.confidenceLevel.slice(1)}
        </span>
        {freshness.caveats.length > 0 && (
          <span className="text-[10px] text-text-muted">
            &middot; {freshness.caveats.length} caveat{freshness.caveats.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

function StatusPill({ icon, label, detail }: { icon: string; label: string; detail?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-text-muted whitespace-nowrap">
      <span dangerouslySetInnerHTML={{ __html: icon }} />
      <span className="font-medium text-text-secondary">{label}</span>
      {detail && <span className="text-text-muted">({detail})</span>}
    </span>
  )
}

function hoursBetween(ageStr: string): number {
  // Parse "6h ago", "2d ago", etc. to approximate hours
  const match = ageStr.match(/^(\d+)(m|h|d|mo)\s+ago$/)
  if (!match) return 0
  const val = parseInt(match[1])
  switch (match[2]) {
    case 'm': return val / 60
    case 'h': return val
    case 'd': return val * 24
    case 'mo': return val * 30 * 24
    default: return 0
  }
}

// ── Empty State ──

function EmptyState({ dealName }: { dealName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
        <span className="text-2xl">&#10024;</span>
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">Deal Intelligence</h3>
      <p className="text-xs text-text-muted max-w-[280px] leading-relaxed">
        Ask questions about <span className="font-medium text-text-secondary">{dealName}</span> and
        get insights based on your deal data, activities, and documents.
      </p>
      <div className="mt-4 space-y-1.5">
        {[
          'What should I do next with this deal?',
          'Summarize the latest activity',
          'Are there any red flags?',
          'Draft a follow-up strategy',
        ].map(q => (
          <p key={q} className="text-[11px] text-brand-500 italic">&ldquo;{q}&rdquo;</p>
        ))}
      </div>
    </div>
  )
}

// ── Message Bubble ──

function MessageBubble({
  message,
  onApprove,
  onDismiss,
}: {
  message: ChatMessage
  onApprove: (actionId: string) => void
  onDismiss: (actionId: string) => void
}) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] space-y-2`}>
        {/* Bubble */}
        <div
          className={`text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
            isUser
              ? 'bg-brand-500 text-white rounded-br-md'
              : 'bg-surface-muted text-text-primary border border-border rounded-bl-md'
          }`}
        >
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
          ))}
        </div>

        {/* Context audit on AI messages */}
        {!isUser && message.contextAudit && message.contextAudit.caveats.length > 0 && (
          <div className="px-1">
            {message.contextAudit.caveats.map((c, i) => (
              <p key={i} className="text-[10px] text-amber-600 flex items-start gap-1">
                <span className="shrink-0 mt-0.5">&#9888;&#65039;</span>
                <span>{c}</span>
              </p>
            ))}
          </div>
        )}

        {/* Proposed Actions */}
        {!isUser && message.proposedActions && message.proposedActions.length > 0 && (
          <div className="space-y-2 mt-1">
            {message.proposedActions.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onApprove={() => onApprove(action.id)}
                onDismiss={() => onDismiss(action.id)}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] px-1 ${isUser ? 'text-right text-text-muted/60' : 'text-text-muted/60'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

// ── Action Card ──

function ActionCard({
  action,
  onApprove,
  onDismiss,
}: {
  action: ProposedAction
  onApprove: () => void
  onDismiss: () => void
}) {
  const borderColor = {
    high: 'border-l-emerald-500',
    medium: 'border-l-amber-500',
    low: 'border-l-red-500',
  }[action.confidence]

  const badgeColor = {
    high: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-red-50 text-red-700',
  }[action.confidence]

  const typeIcon = {
    update_deal: '&#9998;',
    create_task: '&#9745;',
    move_stage: '&#10132;',
    add_note: '&#128221;',
  }[action.type]

  if (action.status === 'approved') {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2`}>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600 text-xs">&#10003;</span>
          <span className="text-xs font-medium text-emerald-700">Applied</span>
          <span className="text-xs text-emerald-600">&mdash; {action.label}</span>
        </div>
      </div>
    )
  }

  if (action.status === 'rejected') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 opacity-50`}>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-xs">&#10005;</span>
          <span className="text-xs text-gray-500 line-through">{action.label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-border border-l-4 ${borderColor} rounded-lg px-3 py-2.5 shadow-sm`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs" dangerouslySetInnerHTML={{ __html: typeIcon }} />
            <span className="text-xs font-semibold text-text-primary">{action.label}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeColor}`}>
              {action.confidence}
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-snug">{action.reasoning}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={onApprove}
          className="text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md transition-colors"
        >
          Approve &#10003;
        </button>
        <button
          onClick={onDismiss}
          className="text-[11px] font-medium bg-gray-50 hover:bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md transition-colors"
        >
          Dismiss &#10005;
        </button>
      </div>
    </div>
  )
}

// ── Typing Indicator ──

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface-muted border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-text-muted">Thinking...</span>
      </div>
    </div>
  )
}
