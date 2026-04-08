import { people, getCompany, getDealsForCompany } from '../data/mockData'

interface Props {
  onDealClick: (id: string) => void
}

export function People({ onDealClick }: Props) {
  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">People</h1>
        <p className="text-sm text-text-muted">{people.length} contacts</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th className="text-left text-xs text-text-muted font-medium p-3">Name</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Company</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Role</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Email</th>
              <th className="text-left text-xs text-text-muted font-medium p-3">Deals</th>
            </tr>
          </thead>
          <tbody>
            {people.map(p => {
              const company = getCompany(p.companyId)
              const companyDeals = getDealsForCompany(p.companyId)

              return (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-brand-50/30 cursor-pointer transition-colors"
                  onClick={() => companyDeals[0] && onDealClick(companyDeals[0].id)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-text-primary">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-text-secondary">{company?.name}</td>
                  <td className="p-3 text-text-muted text-xs">{p.role}</td>
                  <td className="p-3 text-text-muted text-xs">{p.email}</td>
                  <td className="p-3 text-text-secondary">{companyDeals.length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
