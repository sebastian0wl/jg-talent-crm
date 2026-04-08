import type { DealStatus, DealType, Priority, ActionPriority, ActionStatus, ActionType, FulfillmentStatus, ActivityType } from '../types'

const statusColors: Record<DealStatus, string> = {
  'Prospect': 'bg-zinc-700/50 text-zinc-300',
  'Warm Lead': 'bg-blue-600/20 text-blue-400',
  'Initial Meeting': 'bg-amber-600/20 text-amber-400',
  'Scoping': 'bg-orange-600/20 text-orange-400',
  'Negotiating': 'bg-yellow-600/20 text-yellow-400',
  'Closed Won': 'bg-green-600/20 text-green-400',
  'Closed Lost': 'bg-red-600/20 text-red-400',
  'On Hold': 'bg-zinc-600/20 text-zinc-400',
}

export function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${statusColors[status]}`}>
      {status}
    </span>
  )
}

const typeColors: Record<DealType, string> = {
  'Sponsored Post': 'text-blue-400',
  'Video Production': 'text-purple-400',
  'Education Partnership': 'text-green-400',
  'Ambassador': 'text-pink-400',
  'QRT + Comment': 'text-zinc-400',
  'Creative Direction': 'text-orange-400',
  'Custom': 'text-zinc-400',
}

export function DealTypeBadge({ type }: { type: DealType }) {
  return <span className={`text-[10px] font-medium ${typeColors[type]}`}>{type}</span>
}

export function PriorityDot({ priority }: { priority: Priority }) {
  const color = priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-zinc-500'
  return (
    <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} title={priority} />
  )
}

const actionPriorityColors: Record<ActionPriority, string> = {
  'Urgent': 'bg-red-600/20 text-red-400',
  'This Week': 'bg-amber-600/20 text-amber-400',
  'When Possible': 'bg-zinc-600/20 text-zinc-400',
}

export function ActionPriorityBadge({ priority }: { priority: ActionPriority }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${actionPriorityColors[priority]}`}>
      {priority}
    </span>
  )
}

const actionStatusColors: Record<ActionStatus, string> = {
  'To Do': 'bg-zinc-700/50 text-zinc-300',
  'In Progress': 'bg-blue-600/20 text-blue-400',
  'Waiting': 'bg-amber-600/20 text-amber-400',
  'Done': 'bg-green-600/20 text-green-400',
  'Cancelled': 'bg-zinc-600/20 text-zinc-500',
}

export function ActionStatusBadge({ status }: { status: ActionStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${actionStatusColors[status]}`}>
      {status}
    </span>
  )
}

const actionTypeIcons: Record<ActionType, string> = {
  'Response Draft': '✎',
  'Creative': '◑',
  'Call Prep': '☎',
  'Contract Review': '☰',
  'Follow-Up': '↻',
  'Content Creation': '⬡',
  'Approval': '✓',
  'Research': '⊕',
  'Admin': '⚙',
}

export function ActionTypeIcon({ type }: { type: ActionType }) {
  return (
    <span className="w-6 h-6 rounded-md bg-surface-overlay flex items-center justify-center text-xs text-text-secondary shrink-0">
      {actionTypeIcons[type]}
    </span>
  )
}

const fulfillmentStatusColors: Record<FulfillmentStatus, string> = {
  'Brief Received': 'bg-blue-600/20 text-blue-400',
  'In Production': 'bg-yellow-600/20 text-yellow-400',
  'In Review': 'bg-orange-600/20 text-orange-400',
  'Revisions': 'bg-red-600/20 text-red-400',
  'Approved': 'bg-green-600/20 text-green-400',
  'Posted': 'bg-emerald-600/20 text-emerald-400',
  'Invoiced': 'bg-purple-600/20 text-purple-400',
  'Paid': 'bg-brand-600/20 text-brand-400',
  'Cancelled': 'bg-zinc-600/20 text-zinc-500',
}

export function FulfillmentStatusBadge({ status }: { status: FulfillmentStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${fulfillmentStatusColors[status]}`}>
      {status}
    </span>
  )
}

const activityTypeIcons: Record<ActivityType, string> = {
  'email_in': '↓',
  'email_out': '↑',
  'meeting': '◎',
  'call': '☎',
  'note': '✎',
  'agent_action': '⚡',
}

const activityTypeColors: Record<ActivityType, string> = {
  'email_in': 'bg-blue-600/20 text-blue-400',
  'email_out': 'bg-green-600/20 text-green-400',
  'meeting': 'bg-amber-600/20 text-amber-400',
  'call': 'bg-purple-600/20 text-purple-400',
  'note': 'bg-zinc-600/20 text-zinc-400',
  'agent_action': 'bg-brand-600/20 text-brand-400',
}

export function ActivityIcon({ type }: { type: ActivityType }) {
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${activityTypeColors[type]}`}>
      {activityTypeIcons[type]}
    </span>
  )
}
