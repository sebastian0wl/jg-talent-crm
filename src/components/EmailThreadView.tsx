import { useState } from 'react'
import type { EmailThread } from '../types'

export function EmailThreadView({ thread }: { thread: EmailThread }) {
  const [expanded, setExpanded] = useState(false)
  const latest = thread.messages[0]
  if (!latest) return null

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Preview / Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-surface-muted transition-colors"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            latest.direction === 'inbound' ? 'bg-blue-100 text-blue-600' : 'bg-brand-100 text-brand-700'
          }`}>
            {latest.direction === 'inbound' ? '↓' : '↑'}
          </div>
          <span className="text-xs font-medium text-text-primary truncate flex-1">{latest.subject}</span>
          <svg className={`w-3.5 h-3.5 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-muted pl-7">
          <span>{latest.from.split('@')[0]}@...</span>
          <span>&middot;</span>
          <span>{new Date(latest.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          <span>&middot;</span>
          <span>{thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}</span>
        </div>
      </button>

      {/* Expanded Thread */}
      {expanded && (
        <div className="border-t border-border">
          {thread.messages.map((msg, i) => (
            <div key={msg.id} className={`p-3 ${i > 0 ? 'border-t border-border' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  msg.direction === 'inbound' ? 'bg-blue-100 text-blue-600' : 'bg-brand-100 text-brand-700'
                }`}>
                  {msg.direction === 'inbound' ? '↓' : '↑'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {msg.direction === 'inbound' ? 'From' : 'To'}: {msg.direction === 'inbound' ? msg.from : msg.to}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {new Date(msg.timestamp).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  msg.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-brand-50 text-brand-700'
                }`}>
                  {msg.direction === 'inbound' ? 'Received' : 'Sent'}
                </span>
              </div>
              <div className="bg-surface-muted rounded-lg p-2.5 ml-8">
                <p className="text-xs text-text-secondary whitespace-pre-line leading-relaxed">{msg.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
