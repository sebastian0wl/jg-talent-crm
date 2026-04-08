// ── CRM Core: Multi-Pipeline Deal System ──
// 3 pipelines for fundamentally different deal types.
// Each stage has a gate action — the thing that must happen before advancing.

// ── Pipeline Definitions ──

export type PipelineId = 'content' | 'partnership' | 'service'

export type ContentStage =
  | 'Inbound'         // They reached out or we identified opportunity
  | 'Rate Sent'       // We sent pricing/rate card → gate: send rate
  | 'Terms Agreed'    // Both sides agreed on price + scope → gate: confirm terms
  | 'Brief Received'  // Brand sent creative brief → gate: receive brief
  | 'Content Created' // Jamey produced the content → gate: Jamey delivers draft
  | 'In Review'       // Brand is reviewing → gate: submit for review
  | 'Published'       // Content is live → gate: publish/post
  | 'Invoiced'        // Invoice sent → gate: send invoice
  | 'Paid'            // Money received → gate: confirm payment
  | 'Lost'            // Dead deal

export type PartnershipStage =
  | 'Inbound'          // Initial contact
  | 'Discovery Call'   // Intro call scheduled or completed → gate: schedule/complete call
  | 'Proposal Sent'    // We sent a proposal → gate: send proposal
  | 'Negotiating'      // Back and forth on terms → gate: respond to counter
  | 'Contract Review'  // Legal/contract review → gate: review contract
  | 'Signed'           // Deal signed → gate: sign contract
  | 'Active'           // Ongoing partnership → gate: start deliverables
  | 'Renewal'          // Up for renewal → gate: send renewal proposal
  | 'Lost'             // Dead deal

export type ServiceStage =
  | 'Inquiry'          // Client reached out
  | 'Scoping Call'     // Discovery/scoping call → gate: schedule/complete call
  | 'SOW Sent'         // Scope of work sent → gate: send SOW
  | 'Signed'           // Contract signed → gate: sign contract
  | 'In Progress'      // Work underway → gate: start work
  | 'Delivered'        // Deliverables handed off → gate: deliver work
  | 'Invoiced'         // Invoice sent → gate: send invoice
  | 'Paid'             // Paid → gate: confirm payment
  | 'Lost'             // Dead deal

export type DealStage = ContentStage | PartnershipStage | ServiceStage

// What the user sees as deal type
export type DealType =
  | 'Sponsored Post'
  | 'Sponsored Video'
  | 'QRT + Comment'
  | 'Brand Ambassador'
  | 'Affiliate'
  | 'Education Partnership'
  | 'Creative Direction'
  | 'Brand Design'
  | 'Consulting'
  | 'Speaking'

// Map deal types → pipelines
export const DEAL_TYPE_PIPELINE: Record<DealType, PipelineId> = {
  'Sponsored Post': 'content',
  'Sponsored Video': 'content',
  'QRT + Comment': 'content',
  'Brand Ambassador': 'partnership',
  'Affiliate': 'partnership',
  'Education Partnership': 'partnership',
  'Creative Direction': 'service',
  'Brand Design': 'service',
  'Consulting': 'service',
  'Speaking': 'service',
}

// Ordered stages per pipeline (for kanban rendering + progression)
export const PIPELINE_STAGES: Record<PipelineId, string[]> = {
  content: ['Inbound', 'Rate Sent', 'Terms Agreed', 'Brief Received', 'Content Created', 'In Review', 'Published', 'Invoiced', 'Paid'],
  partnership: ['Inbound', 'Discovery Call', 'Proposal Sent', 'Negotiating', 'Contract Review', 'Signed', 'Active', 'Renewal'],
  service: ['Inquiry', 'Scoping Call', 'SOW Sent', 'Signed', 'In Progress', 'Delivered', 'Invoiced', 'Paid'],
}

// Gate actions — what must happen to advance past each stage
export const STAGE_GATES: Record<string, string> = {
  // Content
  'Inbound': 'Send rate card or pricing',
  'Rate Sent': 'Agree on price and scope',
  'Terms Agreed': 'Receive creative brief from brand',
  'Brief Received': 'Jamey creates the content',
  'Content Created': 'Submit content for brand review',
  'In Review': 'Publish or post the content',
  'Published': 'Send invoice',
  'Invoiced': 'Confirm payment received',
  // Partnership
  'Discovery Call': 'Send proposal',
  'Proposal Sent': 'Respond to counter or confirm',
  'Negotiating': 'Send contract for review',
  'Contract Review': 'Sign contract',
  'Signed': 'Begin deliverables',
  'Active': 'Send renewal proposal',
  'Renewal': 'Re-sign or close',
  // Service
  'Inquiry': 'Schedule scoping call',
  'Scoping Call': 'Send scope of work',
  'SOW Sent': 'Sign contract',
  'In Progress': 'Deliver final work',
  'Delivered': 'Send invoice',
}

export const PIPELINE_LABELS: Record<PipelineId, string> = {
  content: 'Content Deals',
  partnership: 'Partnerships',
  service: 'Services',
}

export const PIPELINE_COLORS: Record<PipelineId, string> = {
  content: '#3b82f6',
  partnership: '#8b5cf6',
  service: '#f59e0b',
}

// ── Companies ──
export interface Company {
  id: string
  name: string
  domain?: string
  industry?: string
  notes?: string
}

// ── People ──
export interface Person {
  id: string
  name: string
  email?: string
  role?: string
  companyId: string
  notes?: string
}

// ── Deals ──
export type DealPriority = 'High' | 'Medium' | 'Low'

export interface Deal {
  id: string
  name: string
  companyId: string
  contactId?: string
  pipeline: PipelineId
  stage: string
  type: DealType
  priority: DealPriority
  value?: number
  closedValue?: number
  platforms?: string[]
  deliverables?: string
  terms?: string
  notes?: string
  jameyUsesProduct: boolean
  createdAt: string
  lastActivityAt: string
  expectedCloseDate?: string
  closedAt?: string
  owner: 'justin' | 'jamey' | 'both'
}

// ── Tasks ──
export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Done' | 'Cancelled'
export type TaskPriority = 'Urgent' | 'High' | 'Normal' | 'Low'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee: 'justin' | 'jamey' | 'agent'
  dealId?: string
  companyId?: string
  dueDate?: string
  createdAt: string
  createdBy: 'justin' | 'jamey' | 'agent'
}

// ── Activities ──
export type ActivityType = 'email_sent' | 'email_received' | 'meeting' | 'call' | 'note' | 'task_created' | 'stage_change' | 'agent_alert'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  dealId?: string
  companyId?: string
  personId?: string
  createdBy: 'justin' | 'jamey' | 'agent' | 'system'
  timestamp: string
}

// ── Deliverables ──
export type DeliverableStatus = 'Not Started' | 'In Progress' | 'In Review' | 'Revisions' | 'Approved' | 'Published'
export type InvoiceStatus = 'Not Invoiced' | 'Invoiced' | 'Paid' | 'Overdue'

export interface Deliverable {
  id: string
  title: string
  dealId: string
  status: DeliverableStatus
  contentType: string
  dueDate?: string
  publishDate?: string
  invoiceAmount?: number
  invoiceStatus: InvoiceStatus
}

// ── App ──
export type User = 'justin' | 'jamey'
export type ViewId = 'dashboard' | 'deals' | 'companies' | 'people' | 'tasks' | 'activity'
