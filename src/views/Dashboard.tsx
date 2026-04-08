import type { Persona, DealStatus } from '../types'
import { deals, actions, fulfillments } from '../data/mockData'
import { DealCard } from '../components/DealCard'

interface Props {
  onDealClick: (id: string) => void
  persona: Persona
}

export function Dashboard({ onDealClick, persona }: Props) {
  const activeDeals = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.status))
  const closedWon = deals.filter(d => d.status === 'Closed Won')
  const totalPipeline = activeDeals.reduce((sum, d) => sum + (d.pipelineValue ?? 0), 0)
  const totalClosed = closedWon.reduce((sum, d) => sum + (d.finalRate ?? 0), 0)
  const openActions = actions.filter(a => a.status !== 'Done' && a.status !== 'Cancelled')
  const myActions = openActions.filter(a =>
    persona === 'justin' ? (a.owner === 'Justin' || a.owner === 'Both') : (a.owner === 'Jamey' || a.owner === 'Both')
  )
  const urgentActions = myActions.filter(a => a.priority === 'Urgent')
  const overdueActions = openActions.filter(a => a.dueDate && new Date(a.dueDate) < new Date())
  const awaitingPayment = fulfillments.filter(f => f.invoiceStatus === 'Invoiced' || f.invoiceStatus === 'Overdue')
  const awaitingTotal = awaitingPayment.reduce((sum, f) => sum + (f.invoiceAmount ?? 0), 0)

  // Funnel data
  const funnelStages: DealStatus[] = ['Prospect', 'Warm Lead', 'Initial Meeting', 'Scoping', 'Negotiating', 'Closed Won']
  const funnelData = funnelStages.map(status => ({
    status,
    count: deals.filter(d => d.status === status).length,
    value: deals.filter(d => d.status === status).reduce((sum, d) => sum + (d.pipelineValue ?? d.finalRate ?? 0), 0),
  }))
  const maxCount = Math.max(...funnelData.map(d => d.count), 1)

  const funnelColors: Record<string, string> = {
    'Prospect': 'bg-zinc-600',
    'Warm Lead': 'bg-blue-500',
    'Initial Meeting': 'bg-amber-500',
    'Scoping': 'bg-orange-500',
    'Negotiating': 'bg-yellow-500',
    'Closed Won': 'bg-green-500',
  }

  // Deals needing attention
  const needsAction = activeDeals.filter(d => {
    const dealActions = actions.filter(a => a.dealId === d.id && a.status !== 'Done' && a.status !== 'Cancelled')
    return dealActions.length === 0 && d.status !== 'On Hold'
  })

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            {persona === 'justin' ? "Justin's Dashboard" : "Jamey's Dashboard"}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        <KPI label="Pipeline Value" value={`$${(totalPipeline / 1000).toFixed(0)}K`} sub={`${activeDeals.length} active deals`} />
        <KPI label="Closed Revenue" value={`$${(totalClosed / 1000).toFixed(0)}K`} sub={`${closedWon.length} deals won`} accent="green" />
        <KPI label="My Actions" value={String(myActions.length)} sub={`${urgentActions.length} urgent`} accent={urgentActions.length > 0 ? 'red' : undefined} />
        <KPI label="Overdue" value={String(overdueActions.length)} sub="past due date" accent={overdueActions.length > 0 ? 'red' : undefined} />
        <KPI label="Awaiting Payment" value={`$${(awaitingTotal / 1000).toFixed(0)}K`} sub={`${awaitingPayment.length} invoices`} accent="purple" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="col-span-2 bg-surface-raised border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Pipeline Funnel</h2>
          <div className="space-y-2.5">
            {funnelData.map(stage => (
              <div key={stage.status} className="flex items-center gap-3">
                <span className="w-28 text-xs text-text-muted text-right shrink-0">{stage.status}</span>
                <div className="flex-1 h-7 bg-surface-overlay rounded-md overflow-hidden relative">
                  <div
                    className={`h-full rounded-md transition-all ${funnelColors[stage.status] ?? 'bg-zinc-600'}`}
                    style={{ width: `${Math.max((stage.count / maxCount) * 100, 8)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white mix-blend-difference">
                    {stage.count} deal{stage.count !== 1 ? 's' : ''} — ${(stage.value / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent / My Actions */}
        <div className="bg-surface-raised border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            {urgentActions.length > 0 ? 'Urgent Actions' : 'Next Up'}
          </h2>
          <div className="space-y-2">
            {(urgentActions.length > 0 ? urgentActions : myActions.slice(0, 5)).map(action => (
              <button
                key={action.id}
                onClick={() => action.dealId && onDealClick(action.dealId)}
                className="w-full text-left p-2.5 rounded-lg bg-surface-overlay hover:bg-surface-card border border-transparent hover:border-border transition-colors"
              >
                <p className="text-xs font-medium text-text-primary truncate">{action.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-medium ${
                    action.priority === 'Urgent' ? 'text-red-400' : action.priority === 'This Week' ? 'text-amber-400' : 'text-zinc-400'
                  }`}>{action.priority}</span>
                  <span className="text-[10px] text-text-muted">{action.owner}</span>
                  {action.dueDate && (
                    <span className="text-[10px] text-text-muted">
                      Due {new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Needing Attention */}
      {needsAction.length > 0 && (
        <div className="bg-surface-raised border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-red-400 mb-3">Deals With No Actions — Need Attention</h2>
          <div className="grid grid-cols-3 gap-3">
            {needsAction.map(deal => (
              <DealCard key={deal.id} deal={deal} onClick={onDealClick} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KPI({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  const valueColor = accent === 'green' ? 'text-green-400' : accent === 'red' ? 'text-red-400' : accent === 'purple' ? 'text-brand-400' : 'text-text-primary'
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-4">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-text-muted mt-0.5">{sub}</p>
    </div>
  )
}
