import type { User, PipelineId } from '../types'
import { PIPELINE_LABELS, PIPELINE_STAGES } from '../types'
import { deals, tasks, activities, deliverables } from '../data/mockData'
import { ActivityIcon, TaskPriorityBadge } from '../components/Badges'
import { getDeal } from '../data/mockData'

interface Props {
  onDealClick: (id: string) => void
  user: User
}

export function Dashboard({ onDealClick, user }: Props) {
  const active = deals.filter(d => d.stage !== 'Lost' && !d.closedAt)
  const won = deals.filter(d => d.closedValue)
  const totalPipeline = active.reduce((s, d) => s + (d.value ?? 0), 0)
  const totalClosed = won.reduce((s, d) => s + (d.closedValue ?? 0), 0)
  const openTasks = tasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled')
  const myTasks = openTasks.filter(t => t.assignee === user || t.assignee === ('both' as any))
  const urgentTasks = myTasks.filter(t => t.priority === 'Urgent')
  const overdueTasks = openTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done')
  const awaitingPay = deliverables.filter(d => d.invoiceStatus === 'Invoiced' || d.invoiceStatus === 'Overdue')
  const awaitingTotal = awaitingPay.reduce((s, d) => s + (d.invoiceAmount ?? 0), 0)

  const recentActivity = [...activities].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)).slice(0, 8)

  // Pipeline breakdown
  const pipelines: PipelineId[] = ['content', 'partnership', 'service']

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          {user === 'justin' ? "Justin's Dashboard" : "Jamey's Dashboard"}
        </h1>
        <p className="text-sm text-text-muted">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <KPI label="Active Pipeline" value={`$${(totalPipeline / 1000).toFixed(0)}K`} sub={`${active.length} deals`} />
        <KPI label="Closed Revenue" value={`$${(totalClosed / 1000).toFixed(0)}K`} sub={`${won.length} won`} color="text-brand-600" />
        <KPI label="My Tasks" value={String(myTasks.length)} sub={`${urgentTasks.length} urgent`} color={urgentTasks.length > 0 ? 'text-red-600' : undefined} />
        <KPI label="Overdue" value={String(overdueTasks.length)} sub="past due" color={overdueTasks.length > 0 ? 'text-red-600' : undefined} />
        <KPI label="Awaiting Payment" value={`$${(awaitingTotal / 1000).toFixed(0)}K`} sub={`${awaitingPay.length} invoices`} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Snapshots */}
        <div className="col-span-2 space-y-4">
          {pipelines.map(pid => {
            const pDeals = active.filter(d => d.pipeline === pid)
            if (pDeals.length === 0) return null
            const stages = PIPELINE_STAGES[pid]
            const pValue = pDeals.reduce((s, d) => s + (d.value ?? 0), 0)

            return (
              <div key={pid} className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary">{PIPELINE_LABELS[pid]}</h3>
                  <span className="text-xs text-text-muted">{pDeals.length} deals — ${(pValue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex gap-1">
                  {stages.map(stage => {
                    const count = pDeals.filter(d => d.stage === stage).length
                    return (
                      <div key={stage} className="flex-1 text-center">
                        <div className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                          count > 0 ? 'bg-brand-100 text-brand-800' : 'bg-gray-50 text-gray-300'
                        }`}>
                          {count > 0 ? count : ''}
                        </div>
                        <p className="text-[8px] text-text-muted mt-1 leading-tight truncate">{stage}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Urgent Tasks */}
          <div className="bg-white border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              {urgentTasks.length > 0 ? 'Urgent' : 'Next Up'}
            </h3>
            <div className="space-y-2">
              {(urgentTasks.length > 0 ? urgentTasks : myTasks.slice(0, 5)).map(t => {
                const deal = t.dealId ? getDeal(t.dealId) : null
                return (
                  <button
                    key={t.id}
                    onClick={() => t.dealId && onDealClick(t.dealId)}
                    className="w-full text-left p-2.5 rounded-lg bg-surface-muted hover:bg-brand-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-medium text-text-primary truncate flex-1">{t.title}</p>
                      <TaskPriorityBadge priority={t.priority} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      {deal && <span className="text-brand-600">{deals.find(d => d.id === t.dealId)?.name?.split(' ')[0]}</span>}
                      <span className="capitalize">{t.assignee}</span>
                      {t.dueDate && <span>Due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map(act => (
                <button
                  key={act.id}
                  onClick={() => act.dealId && onDealClick(act.dealId)}
                  className="w-full text-left flex items-start gap-2 p-1.5 rounded-lg hover:bg-surface-muted transition-colors"
                >
                  <ActivityIcon type={act.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate">{act.title}</p>
                    <p className="text-[10px] text-text-muted">
                      {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPI({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color ?? 'text-text-primary'}`}>{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
    </div>
  )
}
