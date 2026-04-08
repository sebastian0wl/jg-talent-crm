import { useState, useMemo } from 'react'
import { useData } from '../lib/DataContext'
import { SearchInput, FilterDropdown, SortHeader, useSort, ResultCount, EmptyState } from '../components/TableControls'

interface Props {
  onDealClick: (id: string) => void
}

type SortKey = 'name' | 'company' | 'role' | 'email' | 'deals'

export function People({ onDealClick }: Props) {
  const { people, companies, getCompany, getDealsForCompany } = useData()
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const { sortKey, sortDir, toggleSort } = useSort<SortKey>('name')

  const enriched = useMemo(() => people.map(p => {
    const company = getCompany(p.companyId)
    const companyDeals = getDealsForCompany(p.companyId)
    return { ...p, company, companyDeals, dealCount: companyDeals.length }
  }), [people, getCompany, getDealsForCompany])

  // Company options
  const companyOptions = useMemo(() =>
    companies
      .map(c => ({ value: c.id, label: c.name, count: people.filter(p => p.companyId === c.id).length }))
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count),
  [companies, people])

  // Filter + search
  const filtered = useMemo(() => {
    let result = enriched
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q) ||
        p.company?.name.toLowerCase().includes(q)
      )
    }
    if (companyFilter) result = result.filter(p => p.companyId === companyFilter)
    return result
  }, [enriched, search, companyFilter])

  // Sort
  const sorted = useMemo(() => {
    if (!sortDir) return filtered
    const mult = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'name': return mult * a.name.localeCompare(b.name)
        case 'company': return mult * (a.company?.name || '').localeCompare(b.company?.name || '')
        case 'role': return mult * (a.role || '').localeCompare(b.role || '')
        case 'email': return mult * (a.email || '').localeCompare(b.email || '')
        case 'deals': return mult * (a.dealCount - b.dealCount)
        default: return 0
      }
    })
  }, [filtered, sortKey, sortDir])

  return (
    <div className="p-6 max-w-5xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">People</h1>
        <p className="text-sm text-text-muted">{people.length} contacts</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="w-full sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search contacts..." />
        </div>
        <FilterDropdown label="Company" options={companyOptions} value={companyFilter} onChange={setCompanyFilter} />
        <div className="flex-1" />
        <ResultCount filtered={sorted.length} total={people.length} />
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-x-auto">
        {sorted.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <SortHeader label="Name" active={sortKey === 'name'} dir={sortKey === 'name' ? sortDir : null} onSort={() => toggleSort('name')} />
                <SortHeader label="Company" active={sortKey === 'company'} dir={sortKey === 'company' ? sortDir : null} onSort={() => toggleSort('company')} />
                <SortHeader label="Role" active={sortKey === 'role'} dir={sortKey === 'role' ? sortDir : null} onSort={() => toggleSort('role')} />
                <SortHeader label="Email" active={sortKey === 'email'} dir={sortKey === 'email' ? sortDir : null} onSort={() => toggleSort('email')} />
                <SortHeader label="Deals" active={sortKey === 'deals'} dir={sortKey === 'deals' ? sortDir : null} onSort={() => toggleSort('deals')} />
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-brand-50/30 cursor-pointer transition-colors"
                  onClick={() => p.companyDeals[0] && onDealClick(p.companyDeals[0].id)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-text-primary">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-text-secondary">{p.company?.name}</td>
                  <td className="p-3 text-text-muted text-xs">{p.role}</td>
                  <td className="p-3 text-text-muted text-xs">{p.email}</td>
                  <td className="p-3 text-text-secondary">{p.dealCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
