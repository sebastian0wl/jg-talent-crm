import { getDeal, getActionsForDeal, getFulfillmentsForDeal, getActivitiesForDeal, getCompany, getPerson } from '../data/mockData'
import { StatusBadge, DealTypeBadge, PriorityDot, ActionPriorityBadge, ActionStatusBadge, ActionTypeIcon, FulfillmentStatusBadge, ActivityIcon } from './Badges'

interface Props {
  dealId: string
  onClose: () => void
}

export function DealDetail({ dealId, onClose }: Props) {
  const deal = getDeal(dealId)
  if (!deal) return null

  const actions = getActionsForDeal(dealId)
  const fulfillments = getFulfillmentsForDeal(dealId)
  const timeline = getActivitiesForDeal(dealId)
  const company = getCompany(deal.companyId)
  const contact = deal.contactId ? getPerson(deal.contactId) : null

  const value = deal.finalRate ?? deal.pipelineValue ?? deal.quotedRate

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-surface-raised border-l border-border z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface-raised/95 backdrop-blur-sm border-b border-border p-5 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-text-primary truncate">{deal.brand}</h2>
                <PriorityDot priority={deal.priority} />
              </div>
              <p className="text-sm text-text-muted">{deal.name}</p>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl leading-none p-1">
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <StatusBadge status={deal.status} />
            <DealTypeBadge type={deal.dealType} />
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {deal.quotedRate && (
              <div className="bg-surface-overlay rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Quoted</p>
                <p className="text-sm font-semibold text-text-primary">${deal.quotedRate.toLocaleString()}</p>
              </div>
            )}
            {deal.finalRate && (
              <div className="bg-surface-overlay rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Final</p>
                <p className="text-sm font-semibold text-green-400">${deal.finalRate.toLocaleString()}</p>
              </div>
            )}
            {deal.pipelineValue && (
              <div className="bg-surface-overlay rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Pipeline</p>
                <p className="text-sm font-semibold text-text-primary">${deal.pipelineValue.toLocaleString()}</p>
              </div>
            )}
            {value && !deal.quotedRate && !deal.finalRate && !deal.pipelineValue && (
              <div className="bg-surface-overlay rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Value</p>
                <p className="text-sm font-semibold text-text-primary">${value.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Details</h3>
            <div className="space-y-2 text-sm">
              {company && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Company</span>
                  <span className="text-text-primary">{company.name}</span>
                </div>
              )}
              {contact && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Contact</span>
                  <span className="text-text-primary">{contact.name} — {contact.role}</span>
                </div>
              )}
              {deal.contactEmail && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Email</span>
                  <span className="text-text-secondary text-xs">{deal.contactEmail}</span>
                </div>
              )}
              {deal.platforms.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Platforms</span>
                  <span className="text-text-primary">{deal.platforms.join(', ')}</span>
                </div>
              )}
              {deal.firstContact && (
                <div className="flex justify-between">
                  <span className="text-text-muted">First Contact</span>
                  <span className="text-text-primary">{new Date(deal.firstContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {deal.deadline && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Deadline</span>
                  <span className="text-amber-400 font-medium">{new Date(deal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Jamey Uses</span>
                <span className={deal.jameyUsesProduct ? 'text-green-400' : 'text-zinc-500'}>{deal.jameyUsesProduct ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          {deal.deliverables && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Deliverables</h3>
              <p className="text-sm text-text-secondary bg-surface-overlay rounded-lg p-3">{deal.deliverables}</p>
            </div>
          )}

          {/* Key Terms / Strategy */}
          {deal.keyTerms && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Key Terms & Strategy</h3>
              <p className="text-sm text-text-secondary bg-surface-overlay rounded-lg p-3">{deal.keyTerms}</p>
            </div>
          )}

          {/* Notes */}
          {deal.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</h3>
              <p className="text-sm text-text-secondary bg-surface-overlay rounded-lg p-3">{deal.notes}</p>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Actions ({actions.length})</h3>
              <div className="space-y-2">
                {actions.map(action => (
                  <div key={action.id} className="bg-surface-overlay rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <ActionTypeIcon type={action.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{action.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ActionPriorityBadge priority={action.priority} />
                          <ActionStatusBadge status={action.status} />
                          <span className="text-[10px] text-text-muted">{action.owner}</span>
                        </div>
                      </div>
                    </div>
                    {action.notes && (
                      <p className="text-xs text-text-muted pl-8">{action.notes}</p>
                    )}
                    {action.dueDate && (
                      <p className="text-xs text-amber-400 pl-8">Due: {new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fulfillment */}
          {fulfillments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Fulfillment</h3>
              <div className="space-y-2">
                {fulfillments.map(f => (
                  <div key={f.id} className="bg-surface-overlay rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary">{f.projectName}</span>
                      <FulfillmentStatusBadge status={f.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{f.contentType}</span>
                      {f.invoiceAmount && <span className="text-text-secondary">${f.invoiceAmount.toLocaleString()}</span>}
                      {f.invoiceStatus && <span>{f.invoiceStatus}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Activity Timeline</h3>
              <div className="space-y-2">
                {timeline.map(act => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <ActivityIcon type={act.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{act.title}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        {act.source && <span className="ml-2 text-text-muted">via {act.source}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
