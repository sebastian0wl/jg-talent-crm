import type { Persona, ActionPriority } from '../types'
import { actions, getDeal } from '../data/mockData'
import { ActionPriorityBadge, ActionStatusBadge, ActionTypeIcon, StatusBadge } from '../components/Badges'

interface Props {
  persona: Persona
  onDealClick: (id: string) => void
}

const priorityOrder: ActionPriority[] = ['Urgent', 'This Week', 'When Possible']

export function Actions({ persona, onDealClick }: Props) {
  const ownerFilter = persona === 'justin' ? ['Justin', 'Both'] : ['Jamey', 'Both']
  const myActions = actions
    .filter(a => ownerFilter.includes(a.owner) && a.status !== 'Done' && a.status !== 'Cancelled')
    .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))

  const otherOwner = persona === 'justin' ? 'Jamey' : 'Justin'
  const otherActions = actions
    .filter(a => a.owner === otherOwner && a.status !== 'Done' && a.status !== 'Cancelled')
    .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))

  const agentActions = actions
    .filter(a => a.owner === 'Agent' && a.status !== 'Done' && a.status !== 'Cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="p-6 max-w-5xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Actions</h1>
        <p className="text-sm text-text-muted mt-0.5">Everything that needs to happen, sorted by who does it</p>
      </div>

      {/* My Actions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            {persona === 'justin' ? "Justin's Actions" : "Jamey's Actions"}
          </h2>
          <span className="text-xs text-text-muted bg-surface-overlay px-2 py-0.5 rounded-full">{myActions.length}</span>
        </div>
        <ActionList actions={myActions} onDealClick={onDealClick} />
      </section>

      {/* Other Person's Actions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">{otherOwner}'s Actions</h2>
          <span className="text-xs text-text-muted bg-surface-overlay px-2 py-0.5 rounded-full">{otherActions.length}</span>
        </div>
        <ActionList actions={otherActions} onDealClick={onDealClick} muted />
      </section>

      {/* Agent Actions */}
      {agentActions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-brand-400">Agent Queue</h2>
            <span className="text-xs text-text-muted bg-surface-overlay px-2 py-0.5 rounded-full">{agentActions.length}</span>
          </div>
          <ActionList actions={agentActions} onDealClick={onDealClick} muted />
        </section>
      )}
    </div>
  )
}

function ActionList({ actions: items, onDealClick, muted }: {
  actions: typeof actions
  onDealClick: (id: string) => void
  muted?: boolean
}) {
  if (items.length === 0) {
    return <p className="text-sm text-text-muted bg-surface-raised border border-border rounded-lg p-4">All clear. No open actions.</p>
  }

  return (
    <div className="space-y-2">
      {items.map(action => {
        const deal = action.dealId ? getDeal(action.dealId) : null
        const isOverdue = action.dueDate && new Date(action.dueDate) < new Date()

        return (
          <button
            key={action.id}
            onClick={() => action.dealId && onDealClick(action.dealId)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              muted
                ? 'bg-surface-raised border-border-subtle hover:border-border'
                : 'bg-surface-raised border-border hover:border-brand-500/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <ActionTypeIcon type={action.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium truncate ${muted ? 'text-text-secondary' : 'text-text-primary'}`}>
                    {action.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <ActionPriorityBadge priority={action.priority} />
                    <ActionStatusBadge status={action.status} />
                  </div>
                </div>

                {deal && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-brand-400">{deal.brand}</span>
                    <StatusBadge status={deal.status} />
                  </div>
                )}

                {action.notes && (
                  <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{action.notes}</p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span>{action.type}</span>
                  <span>{action.source}</span>
                  {action.dueDate && (
                    <span className={isOverdue ? 'text-red-400 font-medium' : ''}>
                      {isOverdue ? 'OVERDUE — ' : 'Due '}
                      {new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
