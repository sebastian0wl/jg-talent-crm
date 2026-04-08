import type { ViewId, User } from '../types'
import { tasks } from '../data/mockData'

const sections = [
  {
    label: 'OVERVIEW',
    items: [
      { id: 'dashboard' as ViewId, label: 'Dashboard', icon: '⊞' },
      { id: 'activity' as ViewId, label: 'Activity', icon: '↻' },
    ],
  },
  {
    label: 'PIPELINE',
    items: [
      { id: 'deals' as ViewId, label: 'Deals', icon: '◈' },
      { id: 'tasks' as ViewId, label: 'Tasks', icon: '☑' },
    ],
  },
  {
    label: 'CONTACTS',
    items: [
      { id: 'companies' as ViewId, label: 'Companies', icon: '⌂' },
      { id: 'people' as ViewId, label: 'People', icon: '⊙' },
    ],
  },
]

interface Props {
  view: ViewId
  setView: (v: ViewId) => void
  user: User
  setUser: (u: User) => void
}

export function Sidebar({ view, setView, user, setUser }: Props) {
  const myTasks = tasks.filter(t =>
    t.status !== 'Done' && t.status !== 'Cancelled' &&
    (t.assignee === user || t.assignee === ('both' as any))
  )
  const urgentCount = myTasks.filter(t => t.priority === 'Urgent').length

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold">JG</div>
          <div>
            <h1 className="text-sm font-semibold text-text-primary leading-none">Talent CRM</h1>
            <p className="text-[10px] text-text-muted mt-0.5">Jamey Gannon</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map(section => (
          <div key={section.label} className="mb-1">
            <p className="px-4 py-1.5 text-[10px] font-semibold text-text-muted tracking-wider">{section.label}</p>
            {section.items.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-[13px] transition-colors ${
                  view === item.id
                    ? 'bg-brand-50 text-brand-700 font-medium border-r-2 border-brand-500'
                    : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                }`}
              >
                <span className="text-sm opacity-60">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'tasks' && urgentCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{urgentCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* User switcher */}
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-text-muted mb-1.5 px-1">Logged in as</p>
        <div className="flex gap-1">
          {(['justin', 'jamey'] as User[]).map(u => (
            <button
              key={u}
              onClick={() => setUser(u)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                user === u
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary'
              }`}
            >
              {u === 'justin' ? 'Justin' : 'Jamey'}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
