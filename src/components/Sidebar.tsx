import type { ViewName, Persona } from '../types'

const navItems: { id: ViewName; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◎' },
  { id: 'pipeline', label: 'Pipeline', icon: '◈' },
  { id: 'actions', label: 'Actions', icon: '◉' },
  { id: 'fulfillment', label: 'Fulfillment', icon: '◇' },
  { id: 'activity', label: 'Activity', icon: '◆' },
]

interface Props {
  view: ViewName
  setView: (v: ViewName) => void
  persona: Persona
  setPersona: (p: Persona) => void
}

export function Sidebar({ view, setView, persona, setPersona }: Props) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface-raised flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h1 className="text-sm font-semibold tracking-wide text-brand-400">JG TALENT CRM</h1>
        <p className="text-xs text-text-muted mt-0.5">Jamey Gannon</p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              view === item.id
                ? 'bg-brand-600/15 text-brand-400 font-medium'
                : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <label className="text-xs text-text-muted block mb-1.5">Viewing as</label>
        <div className="flex gap-1">
          {(['justin', 'jamey'] as Persona[]).map(p => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                persona === p
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-overlay text-text-secondary hover:text-text-primary'
              }`}
            >
              {p === 'justin' ? 'Justin' : 'Jamey'}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
