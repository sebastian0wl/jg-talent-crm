import type { User, TaskPriority } from '../types'
import { tasks, getDeal, getCompany } from '../data/mockData'
import { TaskPriorityBadge, TaskStatusBadge, StageBadge } from '../components/Badges'

interface Props {
  user: User
  onDealClick: (id: string) => void
}

const priorityOrder: TaskPriority[] = ['Urgent', 'High', 'Normal', 'Low']

export function Actions({ user, onDealClick }: Props) {
  const open = tasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled')
  const mine = open.filter(t => t.assignee === user || t.assignee === ('both' as any)).sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))
  const other = open.filter(t => t.assignee !== user && t.assignee !== 'agent' && t.assignee !== ('both' as any)).sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))
  const agentTasks = open.filter(t => t.assignee === 'agent')

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Tasks</h1>
        <p className="text-sm text-text-muted">What needs to happen, by who</p>
      </div>

      <Section title={`${user === 'justin' ? "Justin" : "Jamey"}'s Tasks`} count={mine.length} tasks={mine} onDealClick={onDealClick} />
      <Section title={`${user === 'justin' ? "Jamey" : "Justin"}'s Tasks`} count={other.length} tasks={other} onDealClick={onDealClick} muted />
      {agentTasks.length > 0 && <Section title="Agent Queue" count={agentTasks.length} tasks={agentTasks} onDealClick={onDealClick} muted />}
    </div>
  )
}

function Section({ title, count, tasks: items, onDealClick, muted }: {
  title: string; count: number; tasks: typeof tasks; onDealClick: (id: string) => void; muted?: boolean
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-sm font-semibold ${muted ? 'text-text-muted' : 'text-text-primary'}`}>{title}</h2>
        <span className="text-xs text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">{count}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-text-muted bg-white border border-border rounded-lg p-4">All clear.</p>
      ) : (
        <div className="space-y-2">
          {items.map(t => {
            const deal = t.dealId ? getDeal(t.dealId) : null
            const company = deal ? getCompany(deal.companyId) : null
            const overdue = t.dueDate && new Date(t.dueDate) < new Date()

            return (
              <button
                key={t.id}
                onClick={() => t.dealId && onDealClick(t.dealId)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  muted ? 'bg-white border-border hover:border-gray-300' : 'bg-white border-border hover:border-brand-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className={`text-sm font-medium ${muted ? 'text-text-secondary' : 'text-text-primary'}`}>{t.title}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TaskPriorityBadge priority={t.priority} />
                    <TaskStatusBadge status={t.status} />
                  </div>
                </div>

                {deal && company && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-brand-600">{company.name}</span>
                    <StageBadge stage={deal.stage} pipeline={deal.pipeline} />
                  </div>
                )}

                {t.description && (
                  <p className="text-xs text-text-muted line-clamp-2 mb-1.5">{t.description}</p>
                )}

                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span className="capitalize">{t.assignee}</span>
                  <span>by {t.createdBy}</span>
                  {t.dueDate && (
                    <span className={overdue ? 'text-red-500 font-semibold' : ''}>
                      {overdue ? 'OVERDUE — ' : 'Due '}
                      {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
