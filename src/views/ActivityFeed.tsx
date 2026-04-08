import { useState, useMemo } from 'react'
import type { ActivityType } from '../types'
import { activities, getDeal, getCompany, getPerson } from '../data/mockData'
import { ActivityIcon } from '../components/Badges'
import { SearchInput, FilterDropdown, ResultCount, EmptyState } from '../components/TableControls'

interface Props {
  onDealClick: (id: string) => void
}

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  email_sent: 'Email Sent',
  email_received: 'Email Received',
  meeting: 'Meeting',
  call: 'Call',
  note: 'Note',
  task_created: 'Task Created',
  stage_change: 'Stage Change',
  agent_alert: 'Agent Alert',
}

export function ActivityFeed({ onDealClick }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [creatorFilter, setCreatorFilter] = useState('')

  const sorted = useMemo(() =>
    [...activities].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp)),
  [])

  // Type options with counts
  const typeOptions = useMemo(() => {
    const map = new Map<string, number>()
    activities.forEach(a => map.set(a.type, (map.get(a.type) || 0) + 1))
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([v, count]) => ({ value: v, label: ACTIVITY_TYPE_LABELS[v as ActivityType] || v, count }))
  }, [])

  // Creator options
  const creatorOptions = useMemo(() => {
    const set = new Set(activities.map(a => a.createdBy))
    return [...set].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))
  }, [])

  // Filter + search
  const filtered = useMemo(() => {
    let result = sorted
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a => {
        const deal = a.dealId ? getDeal(a.dealId) : null
        const company = deal ? getCompany(deal.companyId) : a.companyId ? getCompany(a.companyId) : null
        return a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          company?.name.toLowerCase().includes(q)
      })
    }
    if (typeFilter) result = result.filter(a => a.type === typeFilter)
    if (creatorFilter) result = result.filter(a => a.createdBy === creatorFilter)
    return result
  }, [sorted, search, typeFilter, creatorFilter])

  // Group by date
  const grouped = useMemo(() =>
    filtered.reduce<Record<string, typeof activities>>((acc, act) => {
      const date = new Date(act.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      if (!acc[date]) acc[date] = []
      acc[date].push(act)
      return acc
    }, {}),
  [filtered])

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Activity Feed</h1>
        <p className="text-sm text-text-muted">Emails, meetings, calls, notes, agent actions — everything logged</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="w-full sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search activities..." />
        </div>
        <FilterDropdown label="Type" options={typeOptions} value={typeFilter} onChange={setTypeFilter} />
        <FilterDropdown label="By" options={creatorOptions} value={creatorFilter} onChange={setCreatorFilter} />
        <div className="flex-1" />
        <ResultCount filtered={filtered.length} total={activities.length} />
      </div>

      {/* Feed */}
      {filtered.length === 0 ? <EmptyState /> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 sticky top-0 bg-bg py-1 z-10">{date}</h3>
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
      )}
    </div>
  )
}
