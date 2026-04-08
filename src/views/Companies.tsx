import { useState, useMemo } from 'react'
import { useData } from '../lib/DataContext'
import { SearchInput, FilterDropdown, SortHeader, useSort, ResultCount, EmptyState } from '../components/TableControls'

interface Props {
  onDealClick: (id: string) => void
}

type SortKey = 'name' | 'industry' | 'contacts' | 'deals' | 'value' | 'lastActivity'

export function Companies({ onDealClick }: Props) {
  const { companies, getDealsForCompany, getPeopleForCompany, getActivitiesForCompany } = useData()
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const { sortKey, sortDir, toggleSort } = useSort<SortKey>('name')

  // Pre-compute derived data
  const enriched = useMemo(() => companies.map(co => {
    const coDeals = getDealsForCompany(co.id)
    const coPeople = getPeopleForCompany(co.id)
    const coActivity = getActivitiesForCompany(co.id)
    const totalValue = coDeals.reduce((s, d) => s + (d.closedValue ?? d.value ?? 0), 0)
    const lastAct = coActivity[0]
    return { ...co, coDeals, coPeople, totalValue, lastAct, contactCount: coPeople.length, dealCount: coDeals.length }
  }), [companies, getDealsForCompany, getPeopleForCompany, getActivitiesForCompany])

  // Industry options
  const industries = useMemo(() => {
    const map = new Map<string, number>()
    enriched.forEach(c => { if (c.industry) map.set(c.industry, (map.get(c.industry) || 0) + 1) })
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([v, count]) => ({ value: v, label: v, count }))
  }, [enriched])

  // Filter + search
  const filtered = useMemo(() => {
    let result = enriched
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.domain?.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q))
    }
    if (industryFilter) result = result.filter(c => c.industry === industryFilter)
    return result
  }, [enriched, search, industryFilter])

  // Sort
  const sorted = useMemo(() => {
    if (!sortDir) return filtered
    const mult = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'name': return mult * a.name.localeCompare(b.name)
        case 'industry': return mult * (a.industry || '').localeCompare(b.industry || '')
        case 'contacts': return mult * (a.contactCount - b.contactCount)
        case 'deals': return mult * (a.dealCount - b.dealCount)
        case 'value': return mult * (a.totalValue - b.totalValue)
        case 'lastActivity': {
          const aTime = a.lastAct ? +new Date(a.lastAct.timestamp) : 0
          const bTime = b.lastAct ? +new Date(b.lastAct.timestamp) : 0
          return mult * (aTime - bTime)
        }
        default: return 0
      }
    })
  }, [filtered, sortKey, sortDir])

  return (
    <div className="p-6 max-w-5xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Companies</h1>
        <p className="text-sm text-text-muted">{companies.length} companies in your CRM</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="w-full sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search companies..." />
        </div>
        <FilterDropdown label="Industry" options={industries} value={industryFilter} onChange={setIndustryFilter} />
        <div className="flex-1" />
        <ResultCount filtered={sorted.length} total={companies.length} />
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-x-auto">
        {sorted.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <SortHeader label="Company" active={sortKey === 'name'} dir={sortKey === 'name' ? sortDir : null} onSort={() => toggleSort('name')} />
                <SortHeader label="Industry" active={sortKey === 'industry'} dir={sortKey === 'industry' ? sortDir : null} onSort={() => toggleSort('industry')} />
                <SortHeader label="Contacts" active={sortKey === 'contacts'} dir={sortKey === 'contacts' ? sortDir : null} onSort={() => toggleSort('contacts')} />
                <SortHeader label="Deals" active={sortKey === 'deals'} dir={sortKey === 'deals' ? sortDir : null} onSort={() => toggleSort('deals')} />
                <SortHeader label="Total Value" active={sortKey === 'value'} dir={sortKey === 'value' ? sortDir : null} onSort={() => toggleSort('value')} />
                <SortHeader label="Last Activity" active={sortKey === 'lastActivity'} dir={sortKey === 'lastActivity' ? sortDir : null} onSort={() => toggleSort('lastActivity')} />
              </tr>
            </thead>
            <tbody>
              {sorted.map(co => (
                <tr
                  key={co.id}
                  className="border-b border-border hover:bg-brand-50/30 cursor-pointer transition-colors"
                  onClick={() => co.coDeals[0] && onDealClick(co.coDeals[0].id)}
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
                  <td className="p-3 text-text-secondary">{co.contactCount}</td>
                  <td className="p-3 text-text-secondary">{co.dealCount}</td>
                  <td className="p-3 font-medium text-text-primary">${(co.totalValue / 1000).toFixed(0)}K</td>
                  <td className="p-3 text-xs text-text-muted">
                    {co.lastAct ? new Date(co.lastAct.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
