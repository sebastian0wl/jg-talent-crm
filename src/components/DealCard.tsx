import type { Deal } from '../types'
import { StatusBadge, PriorityDot, DealTypeBadge } from './Badges'

interface Props {
  deal: Deal
  onClick: (id: string) => void
  compact?: boolean
}

export function DealCard({ deal, onClick, compact }: Props) {
  const daysSinceContact = deal.firstContact
    ? Math.floor((Date.now() - new Date(deal.firstContact).getTime()) / 86400000)
    : null

  const value = deal.finalRate ?? deal.pipelineValue ?? deal.quotedRate

  if (compact) {
    return (
      <button
        onClick={() => onClick(deal.id)}
        className="w-full text-left p-3 rounded-lg bg-surface-card border border-border hover:border-brand-500/40 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-text-primary truncate">{deal.brand}</span>
          <PriorityDot priority={deal.priority} />
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <DealTypeBadge type={deal.dealType} />
          {value && <span className="text-text-secondary">${(value / 1000).toFixed(0)}K</span>}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick(deal.id)}
      className="w-full text-left p-4 rounded-xl bg-surface-card border border-border hover:border-brand-500/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-400 transition-colors">
            {deal.brand}
          </h3>
          <p className="text-xs text-text-muted truncate mt-0.5">{deal.name}</p>
        </div>
        <PriorityDot priority={deal.priority} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <DealTypeBadge type={deal.dealType} />
        <StatusBadge status={deal.status} />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-text-muted">
          {value && (
            <span className="text-text-secondary font-medium">
              ${value.toLocaleString()}
            </span>
          )}
          {deal.platforms.length > 0 && (
            <span>{deal.platforms.join(', ')}</span>
          )}
        </div>
        {daysSinceContact !== null && (
          <span className={`${daysSinceContact > 7 ? 'text-red-400' : 'text-text-muted'}`}>
            {daysSinceContact}d ago
          </span>
        )}
      </div>

      {deal.actionIds.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-subtle">
          <span className="text-xs text-brand-400">{deal.actionIds.length} action{deal.actionIds.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </button>
  )
}
