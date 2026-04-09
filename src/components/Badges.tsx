import type { DealPriority, TaskPriority, TaskStatus, PipelineId, ActivityType } from '../types'
import { PIPELINE_LABELS } from '../types'

// ── Deal Stage Badge (color based on pipeline) ──
const pipelineStageColors: Record<PipelineId, string> = {
  content: 'bg-blue-50 text-blue-700 border-blue-200',
  partnership: 'bg-purple-50 text-purple-700 border-purple-200',
  service: 'bg-amber-50 text-amber-700 border-amber-200',
  education: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function StageBadge({ stage, pipeline }: { stage: string; pipeline: PipelineId }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${pipelineStageColors[pipeline]}`}>
      {stage}
    </span>
  )
}

// ── Pipeline Badge ──
const pipelineBadgeColors: Record<PipelineId, string> = {
  content: 'bg-blue-100 text-blue-800',
  partnership: 'bg-purple-100 text-purple-800',
  service: 'bg-amber-100 text-amber-800',
  education: 'bg-emerald-100 text-emerald-800',
}

export function PipelineBadge({ pipeline }: { pipeline: PipelineId }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${pipelineBadgeColors[pipeline]}`}>
      {PIPELINE_LABELS[pipeline]}
    </span>
  )
}

// ── Priority ──
const dealPriorityColors: Record<DealPriority, string> = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-gray-100 text-gray-600',
}

export function PriorityBadge({ priority }: { priority: DealPriority }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${dealPriorityColors[priority]}`}>
      {priority}
    </span>
  )
}

const taskPriorityColors: Record<TaskPriority, string> = {
  Urgent: 'bg-red-100 text-red-700 border border-red-200',
  High: 'bg-orange-50 text-orange-700',
  Normal: 'bg-gray-100 text-gray-600',
  Low: 'bg-gray-50 text-gray-500',
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${taskPriorityColors[priority]}`}>
      {priority}
    </span>
  )
}

// ── Task Status ──
const taskStatusColors: Record<TaskStatus, string> = {
  'To Do': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-50 text-blue-700',
  'Waiting': 'bg-amber-50 text-amber-700',
  'Done': 'bg-green-50 text-green-700',
  'Cancelled': 'bg-gray-50 text-gray-400',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${taskStatusColors[status]}`}>
      {status}
    </span>
  )
}

// ── Activity Icons ──
const activityConfig: Record<ActivityType, { icon: string; color: string }> = {
  email_sent: { icon: '↑', color: 'bg-green-100 text-green-600' },
  email_received: { icon: '↓', color: 'bg-blue-100 text-blue-600' },
  meeting: { icon: '◎', color: 'bg-amber-100 text-amber-600' },
  call: { icon: '☎', color: 'bg-purple-100 text-purple-600' },
  note: { icon: '✎', color: 'bg-gray-100 text-gray-600' },
  task_created: { icon: '☑', color: 'bg-brand-100 text-brand-700' },
  stage_change: { icon: '→', color: 'bg-indigo-100 text-indigo-600' },
  agent_alert: { icon: '⚡', color: 'bg-orange-100 text-orange-600' },
}

export function ActivityIcon({ type }: { type: ActivityType }) {
  const cfg = activityConfig[type]
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${cfg.color}`}>
      {cfg.icon}
    </span>
  )
}
