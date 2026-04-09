// ── CRM Core: Multi-Pipeline Deal System ──
// 3 pipelines for fundamentally different deal types.
// Each stage has a gate action — the thing that must happen before advancing.

// ── Pipeline Definitions ──

export type PipelineId = 'content' | 'partnership' | 'service'

export type ContentStage =
  | 'Inbound'           // They reached out or we identified opportunity
  | 'Qualifying'        // Evaluating fit — is this worth pursuing? → gate: evaluate deal
  | 'Brief Received'    // Brand sent creative brief / scope defined → gate: receive brief
  | 'Rate Sent'         // We sent pricing based on brief → gate: send rate
  | 'Negotiating'       // Back and forth on terms → gate: respond to counter
  | 'Terms Agreed'      // Both sides agreed on price + scope → gate: confirm terms (auto-sets contractedAt)
  | 'Contract Signed'   // Legal contract executed → gate: sign contract
  | 'Creating'          // Jamey producing content → gate: Jamey delivers draft
  | 'Delivered'         // Content delivered/published → gate: deliver/publish
  | 'Paid'              // Money received → gate: confirm payment
  | 'Lost'              // Dead deal

export type PartnershipStage =
  | 'Inbound'          // Initial contact
  | 'Discovery Call'   // Intro call scheduled or completed → gate: schedule/complete call
  | 'Brief Received'   // Scope/deliverables defined → gate: receive brief/scope
  | 'Proposal Sent'    // We sent a proposal → gate: send proposal
  | 'Negotiating'      // Back and forth on terms → gate: respond to counter
  | 'Terms Agreed'     // Both sides agreed → gate: confirm terms (auto-sets contractedAt)
  | 'Contract Signed'  // Legal contract executed → gate: sign contract
  | 'Active'           // Ongoing partnership → gate: start deliverables
  | 'Renewal'          // Up for renewal → gate: send renewal proposal
  | 'Lost'             // Dead deal

export type ServiceStage =
  | 'Inquiry'          // Client reached out
  | 'Scoping Call'     // Discovery/scoping call → gate: schedule/complete call
  | 'SOW Sent'         // Scope of work sent → gate: send SOW
  | 'Negotiating'      // Back and forth → gate: respond to counter
  | 'Terms Agreed'     // Both sides agreed → gate: confirm terms (auto-sets contractedAt)
  | 'Contract Signed'  // Contract signed → gate: sign contract
  | 'In Progress'      // Work underway → gate: start work
  | 'Delivered'        // Deliverables handed off → gate: deliver work
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
  | 'Workshop'

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
  'Workshop': 'service',
}

// Ordered stages per pipeline (for kanban rendering + progression)
export const PIPELINE_STAGES: Record<PipelineId, string[]> = {
  content: ['Inbound', 'Qualifying', 'Brief Received', 'Rate Sent', 'Negotiating', 'Terms Agreed', 'Contract Signed', 'Creating', 'Delivered', 'Paid'],
  partnership: ['Inbound', 'Discovery Call', 'Brief Received', 'Proposal Sent', 'Negotiating', 'Terms Agreed', 'Contract Signed', 'Active', 'Renewal'],
  service: ['Inquiry', 'Scoping Call', 'SOW Sent', 'Negotiating', 'Terms Agreed', 'Contract Signed', 'In Progress', 'Delivered', 'Paid'],
}

// Stages that auto-set contractedAt to today when entered
export const CONTRACT_STAGES: string[] = ['Terms Agreed', 'Contract Signed', 'Signed']

// Gate actions — what must happen to advance past each stage
export const STAGE_GATES: Record<string, string> = {
  // Content
  'Inbound': 'Evaluate deal fit — run deal scorer',
  'Qualifying': 'Request creative brief from brand',
  'Brief Received': 'Send rate based on brief scope',
  'Rate Sent': 'Wait for response or counter',
  'Negotiating': 'Agree on final terms',
  'Terms Agreed': 'Get contract signed',
  'Contract Signed': 'Jamey creates the content',
  'Creating': 'Deliver content to brand',
  'Delivered': 'Send invoice and confirm payment',
  // Partnership
  'Discovery Call': 'Request brief or scope document',
  'Proposal Sent': 'Respond to counter or confirm',
  'Active': 'Send renewal proposal',
  'Renewal': 'Re-sign or close',
  // Service
  'Inquiry': 'Schedule scoping call',
  'Scoping Call': 'Send scope of work',
  'SOW Sent': 'Negotiate terms',
  'In Progress': 'Deliver final work',
  // Shared
  'Paid': 'Deal complete',
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
  contactId?: string  // DEPRECATED: Use deal_contacts junction table
  pipeline: PipelineId
  stage: string
  type: DealType
  priority: DealPriority
  value?: number          // Single source of truth — estimate until contracted_at is set
  closedValue?: number    // DEPRECATED: Use value + contractedAt
  platforms?: string[]
  deliverables?: string
  terms?: string
  notes?: string
  jameyUsesProduct: boolean
  createdAt: string
  lastActivityAt: string
  expectedCloseDate?: string
  closedAt?: string
  contractedAt?: string   // When value became a real contracted number
  lostReason?: string
  currency?: string
  owner: 'justin' | 'jamey' | 'both'
}

// ── Deal Contacts (M:N junction) ──
export type DealContactRole = 'primary' | 'decision_maker' | 'creative_lead' | 'finance' | 'legal' | 'contact'

export interface DealContact {
  id: string
  dealId: string
  personId: string
  role: DealContactRole
  isPrimary: boolean
  notes?: string
}

// ── Person-Company (M:N junction) ──
export interface PersonCompany {
  id: string
  personId: string
  companyId: string
  role?: string
  isPrimary: boolean
}

// ── Activity-People (M:N junction) ──
export interface ActivityPerson {
  id: string
  activityId: string
  personId: string
}

// ── Activity-Deals (M:N junction) ──
export interface ActivityDeal {
  id: string
  activityId: string
  dealId: string
}

// ── Attachments ──
export type AttachmentType = 'brief' | 'contract' | 'invoice' | 'deliverable' | 'proposal' | 'rate_card' | 'other'

export interface Attachment {
  id: string
  dealId?: string
  companyId?: string
  fileType: AttachmentType
  fileName: string
  fileSize?: number
  mimeType?: string
  storagePath: string
  publicUrl?: string
  description?: string
  uploadedBy?: 'justin' | 'jamey' | 'agent' | 'system'
  createdAt: string
}

// ── Company Relationships ──
export type CompanyRelationType = 'parent_subsidiary' | 'agency_client' | 'partner' | 'reseller'

export interface CompanyRelationship {
  id: string
  parentCompanyId: string
  childCompanyId: string
  relationshipType: CompanyRelationType
  notes?: string
}

// ── Tags ──
export interface Tag {
  id: string
  name: string
  color?: string
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

// ── Deal Evaluator (9-Dimension Scorecard) ──

export type ScoreGrade = 'S' | 'A' | 'B' | 'C' | 'D'

export const SCORE_DIMENSIONS = [
  'Cash Value',
  'Brand Prestige',
  'Distribution',
  'Audience Match',
  'Education Funnel',
  'Relationship Compound',
  'Creative Value',
  'Time Cost',
  'Strategic Timing',
] as const

export type ScoreDimension = typeof SCORE_DIMENSIONS[number]

export interface DimensionScore {
  dimension: ScoreDimension
  grade: ScoreGrade
  reasoning: string
}

export interface UpgradeMove {
  dimension: ScoreDimension
  currentGrade: ScoreGrade
  potentialGrade: ScoreGrade
  move: string
}

export interface ViabilityPath {
  name: string          // "Current Deal" | "Reframed" | "Dream Version"
  label: string         // "Path A" | "Path B" | "Path C"
  overallGrade: ScoreGrade
  verdict: 'not worth it' | 'marginal' | 'viable' | 'strong' | 'no-brainer'
  changes: string[]
  whatMakesItWork?: string
  whatHoldsItBack?: string
}

export interface DealScore {
  dealId: string
  overallGrade: ScoreGrade
  dimensions: DimensionScore[]
  upgradeMoves: UpgradeMove[]
  viabilityPaths: ViabilityPath[]
  positioningAngles: string[]
  recommendation: string
  evaluatedAt: string
}

// ── Email Thread (for activity detail) ──

export interface EmailMessage {
  id: string
  from: string
  to: string
  subject: string
  body: string
  timestamp: string
  direction: 'inbound' | 'outbound'
}

export interface EmailThread {
  activityId: string
  dealId: string
  messages: EmailMessage[]
}

// ── App ──
export type User = 'justin' | 'jamey'
export type ViewId = 'dashboard' | 'deals' | 'companies' | 'people' | 'tasks' | 'activity' | 'collateral'
