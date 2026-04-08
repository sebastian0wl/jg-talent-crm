import type { DealStatus } from '../types'
import { deals } from '../data/mockData'
import { DealCard } from '../components/DealCard'

interface Props {
  onDealClick: (id: string) => void
}

const columns: { status: DealStatus; color: string }[] = [
  { status: 'Prospect', color: 'border-zinc-600' },
  { status: 'Warm Lead', color: 'border-blue-500' },
  { status: 'Initial Meeting', color: 'border-amber-500' },
  { status: 'Scoping', color: 'border-orange-500' },
  { status: 'Negotiating', color: 'border-yellow-500' },
  { status: 'Closed Won', color: 'border-green-500' },
]

export function Pipeline({ onDealClick }: Props) {
  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Deal Pipeline</h1>
        <p className="text-sm text-text-muted mt-0.5">Kanban view — drag mentally, click to open</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colDeals = deals.filter(d => d.status === col.status)
          const colValue = colDeals.reduce((sum, d) => sum + (d.pipelineValue ?? d.finalRate ?? 0), 0)

          return (
            <div key={col.status} className="w-72 shrink-0">
              <div className={`border-t-2 ${col.color} rounded-t-lg bg-surface-raised border-x border-b border-border rounded-b-xl`}>
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{col.status}</h3>
                    <span className="text-xs text-text-muted bg-surface-overlay px-2 py-0.5 rounded-full">
                      {colDeals.length}
                    </span>
                  </div>
                  {colValue > 0 && (
                    <p className="text-xs text-text-muted mt-0.5">${(colValue / 1000).toFixed(0)}K</p>
                  )}
                </div>

                <div className="p-2 space-y-2 min-h-[200px]">
                  {colDeals.map(deal => (
                    <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
                  ))}
                  {colDeals.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-text-muted">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Closed Lost / On Hold */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {(['Closed Lost', 'On Hold'] as DealStatus[]).map(status => {
          const statusDeals = deals.filter(d => d.status === status)
          if (statusDeals.length === 0) return null
          return (
            <div key={status} className="bg-surface-raised border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-text-muted mb-3">{status} ({statusDeals.length})</h3>
              <div className="space-y-2">
                {statusDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} onClick={onDealClick} compact />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
