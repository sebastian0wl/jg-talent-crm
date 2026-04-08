import { STAGE_GATES, PIPELINE_STAGES } from '../types'
import { getDeal, getCompany, getPerson, getTasksForDeal, getActivitiesForDeal } from '../data/mockData'
import { StageBadge, PipelineBadge, PriorityBadge, TaskPriorityBadge, TaskStatusBadge, ActivityIcon } from './Badges'

interface Props {
  dealId: string
  onClose: () => void
}

export function DealDetail({ dealId, onClose }: Props) {
  const deal = getDeal(dealId)
  if (!deal) return null

  const company = getCompany(deal.companyId)
  const contact = deal.contactId ? getPerson(deal.contactId) : null
  const tasks = getTasksForDeal(dealId)
  const timeline = getActivitiesForDeal(dealId)
  const stages = PIPELINE_STAGES[deal.pipeline]
  const currentIdx = stages.indexOf(deal.stage)
  const gate = STAGE_GATES[deal.stage]

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[540px] bg-white md:border-l border-border z-50 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border p-5 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-text-primary">{company?.name}</h2>
                <PriorityBadge priority={deal.priority} />
              </div>
              <p className="text-sm text-text-muted">{deal.name}</p>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl p-1 rounded-lg hover:bg-surface-muted">×</button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <PipelineBadge pipeline={deal.pipeline} />
            <StageBadge stage={deal.stage} pipeline={deal.pipeline} />
            <span className="text-xs text-text-muted">{deal.type}</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Stage Progress */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Pipeline Progress</h3>
            <div className="flex gap-1 flex-wrap md:flex-nowrap">
              {stages.map((s, i) => (
                <div key={s} className="flex-1 min-w-[40px]" title={s}>
                  <div className={`h-1.5 rounded-full ${
                    i < currentIdx ? 'bg-brand-500' :
                    i === currentIdx ? 'bg-brand-400' :
                    'bg-gray-200'
                  }`} />
                  <p className={`text-[9px] mt-1 truncate ${i === currentIdx ? 'text-brand-700 font-semibold' : 'text-text-muted'}`}>
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Action */}
          {gate && (
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider mb-0.5">To advance this deal</p>
              <p className="text-sm text-brand-800 font-medium">{gate}</p>
            </div>
          )}

          {/* Value */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {deal.value && (
              <div className="bg-surface-muted rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Value</p>
                <p className="text-lg font-bold text-text-primary">${deal.value.toLocaleString()}</p>
              </div>
            )}
            {deal.closedValue && (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-[10px] text-green-700 uppercase tracking-wider">Closed</p>
                <p className="text-lg font-bold text-green-700">${deal.closedValue.toLocaleString()}</p>
              </div>
            )}
            {deal.expectedCloseDate && (
              <div className="bg-surface-muted rounded-lg p-3">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Expected Close</p>
                <p className="text-sm font-semibold text-text-primary">{new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              {contact && <Row label="Contact" value={`${contact.name} — ${contact.role}`} />}
              {contact?.email && <Row label="Email" value={contact.email} />}
              {deal.platforms && deal.platforms.length > 0 && <Row label="Platforms" value={deal.platforms.join(', ')} />}
              <Row label="Owner" value={deal.owner === 'both' ? 'Justin & Jamey' : deal.owner === 'justin' ? 'Justin' : 'Jamey'} />
              <Row label="Jamey Uses" value={deal.jameyUsesProduct ? 'Yes' : 'No'} accent={deal.jameyUsesProduct} />
              <Row label="Created" value={new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
            </div>
          </div>

          {/* Deliverables */}
          {deal.deliverables && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Deliverables</h3>
              <p className="text-sm text-text-secondary bg-surface-muted rounded-lg p-3">{deal.deliverables}</p>
            </div>
          )}

          {/* Terms & Strategy */}
          {deal.terms && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Terms & Strategy</h3>
              <p className="text-sm text-text-secondary bg-surface-muted rounded-lg p-3">{deal.terms}</p>
            </div>
          )}

          {deal.notes && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Notes</h3>
              <p className="text-sm text-text-secondary bg-surface-muted rounded-lg p-3">{deal.notes}</p>
            </div>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tasks ({tasks.length})</h3>
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="bg-surface-muted rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-text-primary flex-1">{t.title}</p>
                      <TaskPriorityBadge priority={t.priority} />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TaskStatusBadge status={t.status} />
                      <span className="text-text-muted capitalize">{t.assignee}</span>
                      {t.dueDate && (
                        <span className={`${new Date(t.dueDate) < new Date() && t.status !== 'Done' ? 'text-red-500 font-medium' : 'text-text-muted'}`}>
                          Due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    {t.description && <p className="text-xs text-text-muted mt-1.5">{t.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Activity</h3>
              <div className="space-y-2">
                {timeline.map(act => (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <ActivityIcon type={act.type} />
                    <div>
                      <p className="text-sm text-text-primary">{act.title}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        <span className="ml-1.5 capitalize">{act.createdBy}</span>
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

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-1 border-b border-border last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={accent ? 'text-brand-600 font-medium' : 'text-text-primary'}>{value}</span>
    </div>
  )
}
