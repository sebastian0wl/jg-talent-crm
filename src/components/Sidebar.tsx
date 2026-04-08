import type { ViewId, User } from '../types'
import { useData } from '../lib/DataContext'

const navItems: { id: ViewId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'activity', label: 'Activity', icon: '↻' },
  { id: 'deals', label: 'Deals', icon: '◈' },
  { id: 'tasks', label: 'Tasks', icon: '☑' },
  { id: 'companies', label: 'Companies', icon: '⌂' },
  { id: 'people', label: 'People', icon: '⊙' },
  { id: 'collateral', label: 'Collateral', icon: '◎' },
]

const sections = [
  { label: 'OVERVIEW', items: ['dashboard', 'activity'] },
  { label: 'PIPELINE', items: ['deals', 'tasks'] },
  { label: 'CONTACTS', items: ['companies', 'people'] },
  { label: 'CONTENT', items: ['collateral'] },
]

interface Props {
  view: ViewId
  setView: (v: ViewId) => void
  user: User
  setUser: (u: User) => void
}

export function Sidebar({ view, setView, user, setUser }: Props) {
  const { tasks } = useData()
  const myTasks = tasks.filter(t =>
    t.status !== 'Done' && t.status !== 'Cancelled' &&
    (t.assignee === user || t.assignee === ('both' as unknown as string))
  )
  const urgentCount = myTasks.filter(t => t.priority === 'Urgent').length

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-surface flex-col h-screen">
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold">JG</div>
            <div>
              <h1 className="text-sm font-semibold text-text-primary leading-none">Talent CRM</h1>
              <p className="text-[10px] text-text-muted mt-0.5">Jamey Gannon</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {sections.map(section => (
            <div key={section.label} className="mb-1">
              <p className="px-4 py-1.5 text-[10px] font-semibold text-text-muted tracking-wider">{section.label}</p>
              {section.items.map(itemId => {
                const item = navItems.find(n => n.id === itemId)!
                return (
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
                )
              })}
            </div>
          ))}
        </nav>

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

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-30 flex items-center justify-around px-1 py-1 safe-area-pb">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[52px] transition-colors ${
              view === item.id
                ? 'text-brand-600'
                : 'text-text-muted'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[9px] font-medium">{item.label}</span>
            {item.id === 'tasks' && urgentCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{urgentCount}</span>
            )}
          </button>
        ))}
        {/* User avatar / switcher */}
        <button
          onClick={() => setUser(user === 'justin' ? 'jamey' : 'justin')}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg"
        >
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
            {user === 'justin' ? 'J' : 'JG'}
          </span>
          <span className="text-[9px] font-medium text-text-muted">{user === 'justin' ? 'Justin' : 'Jamey'}</span>
        </button>
      </nav>
    </>
  )
}
