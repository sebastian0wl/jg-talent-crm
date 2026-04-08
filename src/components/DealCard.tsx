import type { Deal } from '../types'
import { STAGE_GATES } from '../types'
import { StageBadge, PriorityBadge, PipelineBadge } from './Badges'
import { getCompany, getTasksForDeal } from '../data/mockData'

interface Props {
  deal: Deal
  onClick: (id: string) => void
}

export function DealCard({ deal, onClick }: Props) {
  const company = getCompany(deal.companyId)
  const openTasks = getTasksForDeal(deal.id).filter(t => t.status !== 'Done' && t.status !== 'Cancelled')
  const daysSince = Math.floor((Date.now() - new Date(deal.lastActivityAt).getTime()) / 86400000)
  const gate = STAGE_GATES[deal.stage]

  return (
    <button
      onClick={() => onClick(deal.id)}
      className="w-full text-left p-3.5 rounded-xl bg-surface border border-border hover:border-brand-300 hover:shadow-sm transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-text-primary truncate group-hover:text-brand-700 transition-colors">
            {company?.name ?? deal.name}
          </h3>
          <p className="text-[11px] text-text-muted truncate">{deal.type}</p>
        </div>
        <PriorityBadge priority={deal.priority} />
      </div>

      {/* Value + Stage */}
      <div className="flex items-center gap-1.5 mb-2">
        <StageBadge stage={deal.stage} pipeline={deal.pipeline} />
        {deal.value && (
          <span className="text-[11px] font-semibold text-text-primary">
            ${(deal.value / 1000).toFixed(0)}K
          </span>
        )}
      </div>

      {/* Next action gate */}
      {gate && (
        <div className="bg-surface-muted rounded-md px-2 py-1.5 mb-2">
          <p className="text-[10px] text-text-muted">Next step</p>
          <p className="text-[11px] text-text-secondary font-medium">{gate}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-text-muted">
        <div className="flex items-center gap-2">
          {openTasks.length > 0 && (
            <span className="text-brand-600 font-medium">{openTasks.length} task{openTasks.length !== 1 ? 's' : ''}</span>
          )}
          {deal.platforms && deal.platforms.length > 0 && (
            <span>{deal.platforms.join(', ')}</span>
          )}
        </div>
        <span className={daysSince > 7 ? 'text-red-500 font-medium' : ''}>
          {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
        </span>
      </div>
    </button>
  )
}
