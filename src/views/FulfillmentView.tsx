import type { FulfillmentStatus } from '../types'
import { fulfillments, getDeal } from '../data/mockData'
import { FulfillmentStatusBadge } from '../components/Badges'

interface Props {
  onDealClick: (id: string) => void
}

const statusFlow: FulfillmentStatus[] = [
  'Brief Received', 'In Production', 'In Review', 'Revisions', 'Approved', 'Posted', 'Invoiced', 'Paid'
]

export function FulfillmentView({ onDealClick }: Props) {
  const totalInvoiced = fulfillments
    .filter(f => f.invoiceStatus === 'Invoiced' || f.invoiceStatus === 'Overdue')
    .reduce((sum, f) => sum + (f.invoiceAmount ?? 0), 0)
  const totalPaid = fulfillments
    .filter(f => f.invoiceStatus === 'Paid')
    .reduce((sum, f) => sum + (f.invoiceAmount ?? 0), 0)

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Fulfillment Tracker</h1>
        <p className="text-sm text-text-muted mt-0.5">Content production, invoicing, and payment tracking</p>
      </div>

      {/* Money Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-raised border border-border rounded-xl p-4">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Projects</p>
          <p className="text-2xl font-bold text-text-primary">{fulfillments.length}</p>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl p-4">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Awaiting Payment</p>
          <p className="text-2xl font-bold text-purple-400">${(totalInvoiced / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-surface-raised border border-border rounded-xl p-4">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Collected</p>
          <p className="text-2xl font-bold text-green-400">${(totalPaid / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusFlow.map(status => {
          const items = fulfillments.filter(f => f.status === status)
          return (
            <div key={status} className="w-56 shrink-0">
              <div className="bg-surface-raised border border-border rounded-xl">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-text-primary">{status}</h3>
                  <span className="text-xs text-text-muted">{items.length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {items.map(f => {
                    const deal = getDeal(f.dealId)
                    return (
                      <button
                        key={f.id}
                        onClick={() => onDealClick(f.dealId)}
                        className="w-full text-left p-3 rounded-lg bg-surface-card border border-border hover:border-brand-500/40 transition-colors"
                      >
                        <p className="text-xs font-medium text-text-primary truncate">{f.projectName}</p>
                        {deal && <p className="text-[10px] text-brand-400 mt-0.5">{deal.brand}</p>}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-muted">
                          <span>{f.contentType}</span>
                          {f.invoiceAmount && <span>${f.invoiceAmount.toLocaleString()}</span>}
                        </div>
                        {f.contentDueDate && (
                          <p className="text-[10px] text-amber-400 mt-1">
                            Due {new Date(f.contentDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </button>
                    )
                  })}
                  {items.length === 0 && (
                    <div className="flex items-center justify-center h-16 text-[10px] text-text-muted">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table View */}
      {fulfillments.length > 0 && (
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted font-medium p-3">Project</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Status</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Type</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Invoice</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Payment</th>
                <th className="text-left text-xs text-text-muted font-medium p-3">Usage</th>
              </tr>
            </thead>
            <tbody>
              {fulfillments.map(f => {
                const deal = getDeal(f.dealId)
                return (
                  <tr
                    key={f.id}
                    onClick={() => onDealClick(f.dealId)}
                    className="border-b border-border-subtle hover:bg-surface-overlay cursor-pointer transition-colors"
                  >
                    <td className="p-3">
                      <p className="text-text-primary font-medium">{f.projectName}</p>
                      {deal && <p className="text-xs text-text-muted">{deal.brand}</p>}
                    </td>
                    <td className="p-3"><FulfillmentStatusBadge status={f.status} /></td>
                    <td className="p-3 text-text-secondary">{f.contentType}</td>
                    <td className="p-3">
                      {f.invoiceAmount && <span className="text-text-primary">${f.invoiceAmount.toLocaleString()}</span>}
                      {f.invoiceStatus && <span className={`ml-2 text-xs ${f.invoiceStatus === 'Paid' ? 'text-green-400' : f.invoiceStatus === 'Overdue' ? 'text-red-400' : 'text-text-muted'}`}>{f.invoiceStatus}</span>}
                    </td>
                    <td className="p-3 text-xs text-text-muted">
                      {f.paymentDue && new Date(f.paymentDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3 text-xs text-text-muted">
                      {f.usageRights}
                      {f.usageExpiry && <span className="ml-1">exp. {new Date(f.usageExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
