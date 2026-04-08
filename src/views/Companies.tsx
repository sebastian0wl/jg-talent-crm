import { companies, getDealsForCompany, getPeopleForCompany, getActivitiesForCompany } from '../data/mockData'

interface Props {
  onDealClick: (id: string) => void
}

export function Companies({ onDealClick }: Props) {
  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Companies</h1>
        <p className="text-sm text-text-muted">{companies.length} companies in your CRM</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th className="text-left text-xs text-text-muted font-medium p-3">Company</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Industry</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Contacts</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Deals</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Total Value</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(co => {
              const coDeals = getDealsForCompany(co.id)
              const coPeople = getPeopleForCompany(co.id)
              const coActivity = getActivitiesForCompany(co.id)
              const totalValue = coDeals.reduce((s, d) => s + (d.closedValue ?? d.value ?? 0), 0)
              const lastAct = coActivity[0]

              return (
                <tr
                  key={co.id}
                  className="border-b border-border hover:bg-brand-50/30 cursor-pointer transition-colors"
                  onClick={() => coDeals[0] && onDealClick(coDeals[0].id)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                        {co.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{co.name}</p>
                        {co.domain && <p className="text-[10px] text-text-muted">{co.domain}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-text-secondary text-xs">{co.industry}</td>
                  <td className="p-3 text-text-secondary">{coPeople.length}</td>
                  <td className="p-3 text-text-secondary">{coDeals.length}</td>
                  <td className="p-3 font-medium text-text-primary">${(totalValue / 1000).toFixed(0)}K</td>
                  <td className="p-3 text-xs text-text-muted">
                    {lastAct ? new Date(lastAct.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
