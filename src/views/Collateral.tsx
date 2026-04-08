import { collateral, audienceStats, rateCard, keyStats, demographics } from '../data/collateral'

const typeIcons: Record<string, string> = {
  'media-kit': '📋',
  'deck': '📊',
  'case-study': '📝',
  'rate-card': '💰',
  'template': '📄',
  'one-pager': '📃',
}

const typeLabels: Record<string, string> = {
  'media-kit': 'Media Kit',
  'deck': 'Pitch Deck',
  'case-study': 'Case Study',
  'rate-card': 'Rate Card',
  'template': 'Template',
  'one-pager': 'One-Pager',
}

export function Collateral() {
  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Collateral & Sales Assets</h1>
        <p className="text-sm text-text-muted">Media kits, pitch decks, rate cards, and key stats for outreach</p>
      </div>

      {/* Quick Stats Cards */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Key Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total Reach" value={keyStats.totalReach} />
          <StatCard label="Course Students" value={keyStats.courseStudents} sub="across 2 cohorts" />
          <StatCard label="Course Revenue" value={keyStats.courseRevenue} />
          <StatCard label="Maven Rating" value={keyStats.courseRating} sub="#1 Design, #1 Marketing" />
          <StatCard label="X Impressions (12mo)" value={keyStats.xImpressions12mo} />
          <StatCard label="X Engagement Rate" value={keyStats.xEngagementRate} />
          <StatCard label="Freelance Revenue" value={keyStats.freelanceRevenue} sub="60+ startups" />
          <StatCard label="Google" value={keyStats.googleRanking} />
        </div>
      </div>

      {/* Audience Stats */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Audience Breakdown</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-3 text-xs font-semibold text-text-muted">Platform</th>
                <th className="text-left p-3 text-xs font-semibold text-text-muted">Followers</th>
                <th className="text-left p-3 text-xs font-semibold text-text-muted">Notes</th>
              </tr>
            </thead>
            <tbody>
              {audienceStats.map(s => (
                <tr key={s.platform} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-text-primary">{s.platform}</td>
                  <td className="p-3 font-semibold text-brand-600">{s.followers}</td>
                  <td className="p-3 text-xs text-text-muted">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Top Country</p>
            <p className="text-sm font-semibold text-text-primary">{demographics.topCountry}</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Age Range</p>
            <p className="text-sm font-semibold text-text-primary">{demographics.ageRange}</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">iOS Users</p>
            <p className="text-sm font-semibold text-text-primary">{demographics.ios}</p>
          </div>
          <div className="bg-surface-muted rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Non-Follower Reach</p>
            <p className="text-sm font-semibold text-text-primary">{demographics.nonFollowerReach}</p>
          </div>
        </div>
      </div>

      {/* Rate Card */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Partnership Rate Card</h2>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left p-3 text-xs font-semibold text-text-muted">Offering</th>
                <th className="text-right p-3 text-xs font-semibold text-text-muted">Price</th>
              </tr>
            </thead>
            <tbody>
              {rateCard.map(r => (
                <tr key={r.offering} className="border-b border-border last:border-0 hover:bg-brand-50/30 transition-colors">
                  <td className="p-3 text-text-primary">{r.offering}</td>
                  <td className="p-3 text-right font-semibold text-brand-600">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous Partners */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Previous Brand Partners</h2>
        <div className="flex flex-wrap gap-2">
          {keyStats.previousPartners.map(p => (
            <span key={p} className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-text-primary">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Collateral Files */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Documents & Decks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collateral.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-border rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all block"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{typeIcons[item.type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded-full font-medium">
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-text-muted">
                    <span>Updated {new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-brand-500">↗ Open</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-border rounded-xl p-3">
      <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-text-primary mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-text-muted">{sub}</p>}
    </div>
  )
}
