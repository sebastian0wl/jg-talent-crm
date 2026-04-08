import { useState, useRef, useEffect } from 'react'

// ── Search Input ──
export function SearchInput({ value, onChange, placeholder = 'Search...' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs">
          ×
        </button>
      )}
    </div>
  )
}

// ── Filter Dropdown ──
export function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: { value: string; label: string; count?: number }[]; value: string; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const activeOption = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
          value ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-border text-text-secondary hover:border-gray-300'
        }`}
      >
        <span>{value ? activeOption?.label || value : label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-30 min-w-[160px] py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-muted transition-colors ${!value ? 'text-brand-600 font-medium' : 'text-text-secondary'}`}
          >
            All {label}
          </button>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-muted transition-colors flex items-center justify-between ${
                value === opt.value ? 'text-brand-600 font-medium' : 'text-text-secondary'
              }`}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && <span className="text-text-muted">{opt.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sortable Column Header ──
export type SortDir = 'asc' | 'desc' | null

export function SortHeader({ label, active, dir, onSort, className = '' }: {
  label: string; active: boolean; dir: SortDir; onSort: () => void; className?: string
}) {
  return (
    <th className={`text-left text-xs font-medium p-3 cursor-pointer select-none hover:text-text-primary transition-colors group ${className} ${active ? 'text-brand-700' : 'text-text-muted'}`} onClick={onSort}>
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}>
          {dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : '↕'}
        </span>
      </div>
    </th>
  )
}

// ── Sort hook ──
export function useSort<K extends string>(defaultKey: K, defaultDir: SortDir = 'asc') {
  const [sortKey, setSortKey] = useState<K>(defaultKey)
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir)

  const toggleSort = (key: K) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return { sortKey, sortDir, toggleSort }
}

// ── Result count ──
export function ResultCount({ filtered, total }: { filtered: number; total: number }) {
  if (filtered === total) return null
  return <span className="text-xs text-text-muted">{filtered} of {total}</span>
}

// ── Empty state ──
export function EmptyState({ message = 'No results match your filters.' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-text-muted">
      {message}
    </div>
  )
}
