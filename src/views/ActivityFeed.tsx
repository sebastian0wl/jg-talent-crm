import { activities, getDeal, getCompany, getPerson } from '../data/mockData'
import { ActivityIcon } from '../components/Badges'

interface Props {
  onDealClick: (id: string) => void
}

export function ActivityFeed({ onDealClick }: Props) {
  const sorted = [...activities].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))

  const grouped = sorted.reduce<Record<string, typeof activities>>((acc, act) => {
    const date = new Date(act.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(act)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Activity Feed</h1>
        <p className="text-sm text-text-muted">Emails, meetings, calls, notes, agent actions — everything logged</p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 sticky top-0 bg-bg py-1">{date}</h3>
            <div className="space-y-1">
              {items.map(act => {
                const deal = act.dealId ? getDeal(act.dealId) : null
                const company = act.companyId ? getCompany(act.companyId) : null
                const person = act.personId ? getPerson(act.personId) : null

                return (
                  <button
                    key={act.id}
                    onClick={() => act.dealId && onDealClick(act.dealId)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-border transition-all"
                  >
                    <ActivityIcon type={act.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{act.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                        {deal && <span className="text-brand-600 font-medium">{company?.name}</span>}
                        {person && <span>{person.name}</span>}
                        <span>{new Date(act.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                        <span className="capitalize">{act.createdBy}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
