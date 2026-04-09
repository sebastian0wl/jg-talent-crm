import type { Deal, Company, Person, Task, Activity, Attachment, DealScore } from '../types'

// ── Context types for the AI assistant ──

export interface DataFreshness {
  dealAge: string
  lastEmailAge: string | null
  lastActivityAge: string | null
  hasBrief: boolean
  hasContract: boolean
  taskCount: number
  openTaskCount: number
  confidenceLevel: 'high' | 'medium' | 'low'
  caveats: string[]
}

export interface DealContext {
  deal: Deal
  company: Company | undefined
  contacts: Person[]
  tasks: Task[]
  recentActivities: Activity[]
  attachments: Attachment[]
  score: DealScore | null
  freshness: DataFreshness
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function hoursSince(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
}

function calculateFreshness(
  deal: Deal,
  activities: Activity[],
  attachments: Attachment[],
  tasks: Task[],
): DataFreshness {
  const dealActivities = activities.filter(a => a.dealId === deal.id)
  const dealAttachments = attachments.filter(a => a.dealId === deal.id)
  const dealTasks = tasks.filter(t => t.dealId === deal.id)

  // Find latest email activity
  const latestEmail = dealActivities
    .filter(a => a.type === 'email_sent' || a.type === 'email_received')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

  // Find latest activity of any type
  const latestActivity = dealActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

  const hasBrief = dealAttachments.some(a => a.fileType === 'brief')
  const hasContract = dealAttachments.some(a => a.fileType === 'contract')
  const openTaskCount = dealTasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled').length

  // Calculate caveats
  const caveats: string[] = []
  if (!latestEmail) {
    caveats.push('No email history found for this deal')
  } else if (hoursSince(latestEmail.timestamp) > 48) {
    caveats.push(`Last email was ${timeAgo(latestEmail.timestamp)} — may be outdated`)
  }
  if (!hasBrief) caveats.push('No brief uploaded — scope details may be incomplete')
  if (!hasContract) caveats.push('No contract on file')
  if (latestActivity && hoursSince(latestActivity.timestamp) > 168) {
    caveats.push('No activity in 7+ days — deal may need attention')
  }
  if (dealTasks.length === 0) caveats.push('No tasks tracked for this deal')

  // Confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'high'
  if (caveats.length >= 3) confidenceLevel = 'low'
  else if (caveats.length >= 1) confidenceLevel = 'medium'

  return {
    dealAge: timeAgo(deal.createdAt),
    lastEmailAge: latestEmail ? timeAgo(latestEmail.timestamp) : null,
    lastActivityAge: latestActivity ? timeAgo(latestActivity.timestamp) : null,
    hasBrief,
    hasContract,
    taskCount: dealTasks.length,
    openTaskCount,
    confidenceLevel,
    caveats,
  }
}

export function buildDealContext(
  deal: Deal,
  company: Company | undefined,
  contacts: Person[],
  tasks: Task[],
  activities: Activity[],
  attachments: Attachment[],
  score: DealScore | null,
): DealContext {
  return {
    deal: { ...deal },
    company,
    contacts,
    tasks: tasks.filter(t => t.dealId === deal.id),
    recentActivities: activities
      .filter(a => a.dealId === deal.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20),
    attachments: attachments.filter(a => a.dealId === deal.id),
    score,
    freshness: calculateFreshness(deal, activities, attachments, tasks),
  }
}
