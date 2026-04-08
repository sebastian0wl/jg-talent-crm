import { useMemo } from 'react'
import type { User, PipelineId, Deal } from '../types'
import { PIPELINE_LABELS, PIPELINE_STAGES, PIPELINE_COLORS } from '../types'
import { useData } from '../lib/DataContext'
import { ActivityIcon, TaskPriorityBadge } from '../components/Badges'

interface Props {
  onDealClick: (id: string) => void
  user: User
}

// Final/won stages per pipeline (completed successfully)
const FINAL_STAGES: Record<PipelineId, string[]> = {
  content: ['Paid'],
  partnership: ['Active', 'Renewal'],
  service: ['Paid'],
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function relativeTime(dateStr: string): string {
  const d = daysAgo(dateStr)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

export function Dashboard({ onDealClick, user }: Props) {
  const { deals, tasks, activities, getCompany, getDeal } = useData()

  const analytics = useMemo(() => {
    const now = new Date()
    const active = deals.filter(d => d.stage !== 'Lost' && !d.closedAt)
    const lost = deals.filter(d => d.stage === 'Lost')
    const contracted = deals.filter(d => d.contractedAt)

    // Win rate: deals in final stages vs (final stages + lost)
    const won = deals.filter(d => {
      const pipeline = d.pipeline as PipelineId
      return FINAL_STAGES[pipeline]?.includes(d.stage)
    })
    const closedTotal = won.length + lost.length
    const winRate = closedTotal > 0 ? Math.round((won.length / closedTotal) * 100) : 0

    const totalPipelineValue = active.reduce((s, d) => s + (d.value ?? 0), 0)
    const contractedRevenue = contracted.reduce((s, d) => s + (d.value ?? 0), 0)
    const avgDealSize = active.length > 0 ? totalPipelineValue / active.length : 0

    // Pipeline breakdown
    const pipelines: PipelineId[] = ['content', 'partnership', 'service']
    const pipelineData = pipelines.map(pid => {
      const pDeals = active.filter(d => d.pipeline === pid)
      const value = pDeals.reduce((s, d) => s + (d.value ?? 0), 0)
      return { id: pid, label: PIPELINE_LABELS[pid], deals: pDeals, count: pDeals.length, value, color: PIPELINE_COLORS[pid] }
    })
    const maxPipelineValue = Math.max(...pipelineData.map(p => p.value), 1)

    // Stage distribution per pipeline
    const stageData = pipelines.map(pid => {
      const stages = PIPELINE_STAGES[pid]
      const pDeals = active.filter(d => d.pipeline === pid)
      const stageCounts = stages.map(stage => ({
        stage,
        count: pDeals.filter(d => d.stage === stage).length,
      }))
      const total = pDeals.length || 1
      return { pipeline: pid, label: PIPELINE_LABELS[pid], stages: stageCounts, total, color: PIPELINE_COLORS[pid] }
    })

    // Priority distribution
    const priorities = (['High', 'Medium', 'Low'] as const).map(p => ({
      level: p,
      count: active.filter(d => d.priority === p).length,
    }))

    // Recent activities
    const recentActivities = [...activities]
      .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
      .slice(0, 10)

    // Upcoming tasks (next 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86_400_000)
    const upcomingTasks = tasks
      .filter(t => t.status !== 'Done' && t.status !== 'Cancelled' && t.dueDate)
      .filter(t => {
        const due = new Date(t.dueDate!)
        return due >= now && due <= sevenDaysFromNow
      })
      .sort((a, b) => +new Date(a.dueDate!) - +new Date(b.dueDate!))
      .slice(0, 8)

    // Deals needing attention
    const sevenDaysAgoDate = new Date(now.getTime() - 7 * 86_400_000)
    const stale = active.filter(d => new Date(d.lastActivityAt) < sevenDaysAgoDate)
    const pastDue = active.filter(d => d.expectedCloseDate && new Date(d.expectedCloseDate) < now)
    const earlyStages = ['Inbound', 'Rate Sent', 'Inquiry', 'Scoping Call', 'Discovery Call']
    const highEarly = active.filter(d => d.priority === 'High' && earlyStages.includes(d.stage))

    return {
      active, totalPipelineValue, contractedRevenue, avgDealSize, winRate,
      pipelineData, maxPipelineValue, stageData, priorities,
      recentActivities, upcomingTasks, stale, pastDue, highEarly,
    }
  }, [deals, tasks, activities])

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">
          {user === 'justin' ? "Justin's Dashboard" : "Jamey's Dashboard"}
        </h1>
        <p className="text-sm text-zinc-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <SummaryCard
          label="Total Pipeline"
          value={formatCurrency(analytics.totalPipelineValue)}
          sub={`${analytics.active.length} active deals`}
        />
        <SummaryCard
          label="Contracted Revenue"
          value={formatCurrency(analytics.contractedRevenue)}
          sub="signed deals"
          accent="text-emerald-400"
        />
        <SummaryCard
          label="Active Deals"
          value={String(analytics.active.length)}
          sub="in pipeline"
          accent="text-blue-400"
        />
        <SummaryCard
          label="Win Rate"
          value={`${analytics.winRate}%`}
          sub="closed deals"
          accent="text-violet-400"
        />
        <SummaryCard
          label="Avg Deal Size"
          value={formatCurrency(analytics.avgDealSize)}
          sub="per active deal"
          accent="text-amber-400"
        />
      </div>

      {/* ── Pipeline Breakdown ── */}
      <Section title="Pipeline Breakdown">
        <div className="space-y-3">
          {analytics.pipelineData.map(p => (
            <div key={p.id} className="flex items-center gap-4">
              <div className="w-28 shrink-0">
                <p className="text-sm font-medium text-zinc-200">{p.label}</p>
                <p className="text-xs text-zinc-500">{p.count} deals</p>
              </div>
              <div className="flex-1">
                <div className="h-7 bg-zinc-800 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md flex items-center px-2 transition-all duration-500"
                    style={{
                      width: `${Math.max((p.value / analytics.maxPipelineValue) * 100, 2)}%`,
                      backgroundColor: p.color,
                    }}
                  >
                    {p.value > 0 && (
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        {formatCurrency(p.value)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Stage Distribution + Priority ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stage Distribution */}
        <div className="lg:col-span-2">
          <Section title="Stage Distribution">
            <div className="space-y-4">
              {analytics.stageData.map(p => (
                <div key={p.pipeline}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-zinc-300">{p.label}</p>
                    <p className="text-xs text-zinc-500">{p.total === 1 && p.stages.every(s => s.count === 0) ? 0 : p.stages.reduce((s, st) => s + st.count, 0)} deals</p>
                  </div>
                  <div className="flex h-8 rounded-md overflow-hidden bg-zinc-800">
                    {p.stages.map((s, i) => {
                      if (s.count === 0) return null
                      const pct = (s.count / p.total) * 100
                      const opacity = 0.4 + (i / (p.stages.length - 1)) * 0.6
                      return (
                        <div
                          key={s.stage}
                          className="flex items-center justify-center text-[10px] font-medium text-white border-r border-zinc-900/30 last:border-r-0 relative group cursor-default"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: p.color,
                            opacity,
                          }}
                          title={`${s.stage}: ${s.count}`}
                        >
                          {pct > 8 && <span className="truncate px-1">{s.count}</span>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    {p.stages.filter(s => s.count > 0).map((s) => (
                      <span key={s.stage} className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-sm inline-block"
                          style={{
                            backgroundColor: p.color,
                            opacity: 0.4 + (p.stages.indexOf(s) / (p.stages.length - 1)) * 0.6,
                          }}
                        />
                        {s.stage} ({s.count})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Priority Distribution */}
        <Section title="Priority Distribution">
          <div className="space-y-3">
            {analytics.priorities.map(p => {
              const total = analytics.active.length || 1
              const pct = (p.count / total) * 100
              const colors: Record<string, { bar: string; dot: string }> = {
                High: { bar: 'bg-red-500', dot: 'bg-red-400' },
                Medium: { bar: 'bg-amber-500', dot: 'bg-amber-400' },
                Low: { bar: 'bg-zinc-500', dot: 'bg-zinc-400' },
              }
              const c = colors[p.level]
              return (
                <div key={p.level}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                      <span className="text-sm text-zinc-300">{p.level}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-200">{p.count}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
                      style={{ width: `${Math.max(pct, p.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      </div>

      {/* ── Activity Feed + Upcoming Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity Feed */}
        <Section title="Recent Activity" subtitle="Last 10">
          <div className="space-y-1">
            {analytics.recentActivities.length === 0 && (
              <p className="text-sm text-zinc-500 py-4 text-center">No activities yet</p>
            )}
            {analytics.recentActivities.map(act => {
              const deal = act.dealId ? getDeal(act.dealId) : null
              const company = act.companyId ? getCompany(act.companyId) : null
              return (
                <button
                  key={act.id}
                  onClick={() => act.dealId && onDealClick(act.dealId)}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
                >
                  <ActivityIcon type={act.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 truncate">{act.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {deal && <span className="text-[10px] text-blue-400 truncate">{deal.name}</span>}
                      {company && <span className="text-[10px] text-zinc-500 truncate">{company.name}</span>}
                      <span className="text-[10px] text-zinc-600 shrink-0">{relativeTime(act.timestamp)}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Upcoming Tasks */}
        <Section title="Upcoming Tasks" subtitle="Next 7 days">
          <div className="space-y-1">
            {analytics.upcomingTasks.length === 0 && (
              <p className="text-sm text-zinc-500 py-4 text-center">No upcoming tasks</p>
            )}
            {analytics.upcomingTasks.map(t => {
              const deal = t.dealId ? getDeal(t.dealId) : null
              return (
                <button
                  key={t.id}
                  onClick={() => t.dealId && onDealClick(t.dealId)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-zinc-200 truncate flex-1 mr-2">{t.title}</p>
                    <TaskPriorityBadge priority={t.priority} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    {deal && <span className="text-blue-400">{deal.name}</span>}
                    <span className="capitalize">{t.assignee}</span>
                    {t.dueDate && (
                      <span>
                        {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </Section>
      </div>

      {/* ── Deals Needing Attention ── */}
      <Section title="Deals Needing Attention">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stale Deals */}
          <AttentionColumn
            label="No Activity 7+ Days"
            icon="&#9888;"
            iconColor="text-amber-400"
            deals={analytics.stale}
            onDealClick={onDealClick}
            getCompany={getCompany}
            renderMeta={(d: Deal) => `Last: ${relativeTime(d.lastActivityAt)}`}
          />
          {/* Past Due */}
          <AttentionColumn
            label="Past Expected Close"
            icon="&#9200;"
            iconColor="text-red-400"
            deals={analytics.pastDue}
            onDealClick={onDealClick}
            getCompany={getCompany}
            renderMeta={(d: Deal) =>
              d.expectedCloseDate
                ? `Due: ${new Date(d.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : ''
            }
          />
          {/* High Priority Early Stage */}
          <AttentionColumn
            label="High Priority, Early Stage"
            icon="&#9733;"
            iconColor="text-violet-400"
            deals={analytics.highEarly}
            onDealClick={onDealClick}
            getCompany={getCompany}
            renderMeta={(d: Deal) => d.stage}
          />
        </div>
      </Section>
    </div>
  )
}

// ── Sub-components ──

function SummaryCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent?: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ?? 'text-zinc-100'}`}>{value}</p>
      <p className="text-xs text-zinc-500">{sub}</p>
    </div>
  )
}

function Section({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        {subtitle && <span className="text-[10px] text-zinc-600">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

function AttentionColumn({ label, icon, iconColor, deals, onDealClick, getCompany, renderMeta }: {
  label: string
  icon: string
  iconColor: string
  deals: Deal[]
  onDealClick: (id: string) => void
  getCompany: (id: string) => { name: string } | undefined
  renderMeta: (d: Deal) => string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-sm ${iconColor}`} dangerouslySetInnerHTML={{ __html: icon }} />
        <p className="text-xs font-medium text-zinc-400">{label}</p>
        <span className="text-[10px] text-zinc-600 ml-auto">{deals.length}</span>
      </div>
      {deals.length === 0 && (
        <p className="text-[11px] text-zinc-600 py-2 text-center">None -- looking good</p>
      )}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {deals.slice(0, 6).map(d => {
          const company = getCompany(d.companyId)
          return (
            <button
              key={d.id}
              onClick={() => onDealClick(d.id)}
              className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              <p className="text-xs text-zinc-200 truncate">{d.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {company && <span className="text-[10px] text-zinc-500 truncate">{company.name}</span>}
                <span className="text-[10px] text-zinc-600">{renderMeta(d)}</span>
                {d.value && <span className="text-[10px] text-zinc-500 ml-auto">{formatCurrency(d.value)}</span>}
              </div>
            </button>
          )
        })}
        {deals.length > 6 && (
          <p className="text-[10px] text-zinc-600 text-center pt-1">+{deals.length - 6} more</p>
        )}
      </div>
    </div>
  )
}
