import { useState, useMemo } from 'react'
import type { User, TaskPriority, TaskStatus } from '../types'
import { tasks, getDeal, getCompany } from '../data/mockData'
import { TaskPriorityBadge, TaskStatusBadge, StageBadge, PipelineBadge } from '../components/Badges'
import { SearchInput, FilterDropdown, EmptyState } from '../components/TableControls'

interface Props {
  user: User
  onDealClick: (id: string) => void
}

type SortField = 'priority' | 'status' | 'deadline' | 'staleness' | 'company'
type ViewMode = 'list' | 'board'

const priorityOrder: TaskPriority[] = ['Urgent', 'High', 'Normal', 'Low']
const statusOrder: TaskStatus[] = ['To Do', 'In Progress', 'Waiting', 'Done', 'Cancelled']

function getPriorityIndex(p: TaskPriority) { return priorityOrder.indexOf(p) }
function getStatusIndex(s: TaskStatus) { return statusOrder.indexOf(s) }

export function Actions({ user, onDealClick }: Props) {
  const [activeTab, setActiveTab] = useState<'justin' | 'jamey' | 'agent'>('justin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('priority')
  const [showCompleted, setShowCompleted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Enriched tasks with deal/company data
  const enriched = useMemo(() => tasks.map(t => {
    const deal = t.dealId ? getDeal(t.dealId) : null
    const company = deal ? getCompany(deal.companyId) : t.companyId ? getCompany(t.companyId) : null
    const staleness = deal ? Math.floor((Date.now() - new Date(deal.lastActivityAt).getTime()) / 86400000) : 0
    return { ...t, deal, company, staleness }
  }), [])

  // Filter by tab
  const tabTasks = useMemo(() => {
    if (activeTab === 'agent') return enriched.filter(t => t.assignee === 'agent')
    return enriched.filter(t => t.assignee === activeTab || t.assignee === ('both' as any))
  }, [enriched, activeTab])

  // Filter options
  const statusOptions = useMemo(() => {
    const counts = new Map<string, number>()
    tabTasks.forEach(t => counts.set(t.status, (counts.get(t.status) || 0) + 1))
    return statusOrder.filter(s => counts.has(s)).map(s => ({ value: s, label: s, count: counts.get(s) || 0 }))
  }, [tabTasks])

  const priorityOptions = useMemo(() => {
    const counts = new Map<string, number>()
    tabTasks.forEach(t => counts.set(t.priority, (counts.get(t.priority) || 0) + 1))
    return priorityOrder.filter(p => counts.has(p)).map(p => ({ value: p, label: p, count: counts.get(p) || 0 }))
  }, [tabTasks])

  // Apply filters
  const filtered = useMemo(() => {
    let result = tabTasks
    if (!showCompleted) result = result.filter(t => t.status !== 'Done' && t.status !== 'Cancelled')
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.company?.name.toLowerCase().includes(q) ||
        t.deal?.name.toLowerCase().includes(q)
      )
    }
    if (statusFilter) result = result.filter(t => t.status === statusFilter)
    if (priorityFilter) result = result.filter(t => t.priority === priorityFilter)
    return result
  }, [tabTasks, search, statusFilter, priorityFilter, showCompleted])

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortField) {
        case 'priority': return getPriorityIndex(a.priority) - getPriorityIndex(b.priority)
        case 'status': return getStatusIndex(a.status) - getStatusIndex(b.status)
        case 'deadline': {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return +new Date(a.dueDate) - +new Date(b.dueDate)
        }
        case 'staleness': return b.staleness - a.staleness
        case 'company': return (a.company?.name || 'zzz').localeCompare(b.company?.name || 'zzz')
        default: return 0
      }
    })
  }, [filtered, sortField])

  // Counts for tabs
  const justinCount = enriched.filter(t => (t.assignee === 'justin' || t.assignee === ('both' as any)) && t.status !== 'Done' && t.status !== 'Cancelled').length
  const jameyCount = enriched.filter(t => (t.assignee === 'jamey' || t.assignee === ('both' as any)) && t.status !== 'Done' && t.status !== 'Cancelled').length
  const agentCount = enriched.filter(t => t.assignee === 'agent' && t.status !== 'Done' && t.status !== 'Cancelled').length

  // Board view groups
  const boardGroups = useMemo(() => {
    const groups: Record<string, typeof sorted> = {}
    statusOrder.forEach(s => { groups[s] = [] })
    sorted.forEach(t => {
      if (!groups[t.status]) groups[t.status] = []
      groups[t.status].push(t)
    })
    return groups
  }, [sorted])

  return (
    <div className="p-6 max-w-5xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Tasks</h1>
          <p className="text-sm text-text-muted">What needs to happen, by who</p>
        </div>
        {/* View toggle */}
        <div className="flex gap-1 bg-surface-muted p-0.5 rounded-lg">
          <button onClick={() => setViewMode('list')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>
            List
          </button>
          <button onClick={() => setViewMode('board')} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted'}`}>
            Board
          </button>
        </div>
      </div>

      {/* Persona Tabs */}
      <div className="flex gap-1 bg-surface-muted p-0.5 rounded-lg w-fit">
        {([
          ['justin', 'Justin', justinCount],
          ['jamey', 'Jamey', jameyCount],
          ['agent', 'Agent', agentCount],
        ] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === key ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
        <div className="w-full sm:w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." />
        </div>
        <FilterDropdown label="Status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        <FilterDropdown label="Priority" options={priorityOptions} value={priorityFilter} onChange={setPriorityFilter} />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">Sort:</span>
          {([
            ['priority', 'Priority'],
            ['deadline', 'Deadline'],
            ['staleness', 'Staleness'],
            ['status', 'Status'],
            ['company', 'Company'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortField(key)}
              className={`px-2 py-1 text-[10px] rounded-md transition-colors ${
                sortField === key ? 'bg-brand-50 text-brand-700 font-medium' : 'text-text-muted hover:text-text-secondary hover:bg-surface-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
          <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} className="rounded border-border text-brand-500 focus:ring-brand-200" />
          Show completed
        </label>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        sorted.length === 0 ? <EmptyState message="No tasks match your filters." /> : (
          <div className="space-y-2">
            {sorted.map(t => {
              const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done' && t.status !== 'Cancelled'
              return (
                <button
                  key={t.id}
                  onClick={() => t.dealId && onDealClick(t.dealId)}
                  className="w-full text-left p-4 rounded-xl bg-white border border-border hover:border-brand-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-text-primary">{t.title}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <TaskPriorityBadge priority={t.priority} />
                      <TaskStatusBadge status={t.status} />
                    </div>
                  </div>

                  {t.deal && t.company && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-brand-600">{t.company.name}</span>
                      <PipelineBadge pipeline={t.deal.pipeline} />
                      <StageBadge stage={t.deal.stage} pipeline={t.deal.pipeline} />
                    </div>
                  )}

                  {t.description && (
                    <p className="text-xs text-text-muted line-clamp-2 mb-1.5">{t.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-text-muted">
                    <span className="capitalize">{t.assignee}</span>
                    {t.dueDate && (
                      <span className={overdue ? 'text-red-500 font-semibold' : ''}>
                        {overdue ? 'OVERDUE — ' : 'Due '}
                        {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {t.staleness > 0 && (
                      <span className={t.staleness > 7 ? 'text-red-500 font-medium' : ''}>
                        {t.staleness}d since last touch
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )
      )}

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {statusOrder.map(status => {
            const items = boardGroups[status] || []
            if (items.length === 0 && !showCompleted && (status === 'Done' || status === 'Cancelled')) return null
            return (
              <div key={status} className="w-[240px] sm:w-[280px] shrink-0">
                <div className="bg-surface-muted rounded-xl">
                  <div className="px-3 py-2.5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-text-primary">{status}</h3>
                      <span className="text-[10px] text-text-muted bg-white px-1.5 py-0.5 rounded-full">{items.length}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 min-h-[120px]">
                    {items.map(t => {
                      const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done' && t.status !== 'Cancelled'
                      return (
                        <button
                          key={t.id}
                          onClick={() => t.dealId && onDealClick(t.dealId)}
                          className="w-full text-left p-3 rounded-xl bg-white border border-border hover:border-brand-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <p className="text-xs font-medium text-text-primary line-clamp-2">{t.title}</p>
                            <TaskPriorityBadge priority={t.priority} />
                          </div>
                          {t.company && (
                            <p className="text-[10px] text-brand-600 font-medium mb-1">{t.company.name}</p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-text-muted">
                            <span className="capitalize">{t.assignee}</span>
                            {t.dueDate && (
                              <span className={overdue ? 'text-red-500 font-medium' : ''}>
                                {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                    {items.length === 0 && (
                      <div className="flex items-center justify-center h-16 text-xs text-text-muted">Empty</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
