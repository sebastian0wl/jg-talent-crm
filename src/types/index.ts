// ── CRM Entity Types ──

export type DealStatus = 'Prospect' | 'Warm Lead' | 'Initial Meeting' | 'Scoping' | 'Negotiating' | 'Closed Won' | 'Closed Lost' | 'On Hold'
export type DealType = 'Sponsored Post' | 'Video Production' | 'Education Partnership' | 'Ambassador' | 'QRT + Comment' | 'Creative Direction' | 'Custom'
export type Priority = 'High' | 'Medium' | 'Low'
export type Platform = 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Maven'

export type ActionStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Done' | 'Cancelled'
export type ActionType = 'Response Draft' | 'Creative' | 'Call Prep' | 'Contract Review' | 'Follow-Up' | 'Content Creation' | 'Approval' | 'Research' | 'Admin'
export type ActionPriority = 'Urgent' | 'This Week' | 'When Possible'
export type ActionOwner = 'Justin' | 'Jamey' | 'Agent' | 'Both'
export type ActionSource = 'Agent - Inbound Scanner' | 'Agent - Follow-Up' | 'Agent - Outbound Tracker' | 'Agent - Briefing' | 'Manual - Justin' | 'Manual - Jamey'

export type FulfillmentStatus = 'Brief Received' | 'In Production' | 'In Review' | 'Revisions' | 'Approved' | 'Posted' | 'Invoiced' | 'Paid' | 'Cancelled'
export type ContentType = 'X Post' | 'Short-form Video' | 'YouTube' | 'Tutorial Series' | 'Workshop' | 'Course Module' | 'QRT' | 'Creative Direction' | 'Custom'
export type InvoiceStatus = 'Not Invoiced' | 'Invoiced' | 'Paid' | 'Overdue'
export type UsageRights = 'Organic Only' | 'Plus Paid Media' | 'Plus Whitelisting' | 'Plus Both'

export type ActivityType = 'email_in' | 'email_out' | 'meeting' | 'call' | 'note' | 'agent_action'

// ── Core Entities ──

export interface Company {
  id: string
  name: string
  domain?: string
  industry?: string
  dealCount: number
  totalRevenue: number
}

export interface Person {
  id: string
  name: string
  email?: string
  role?: string
  companyId: string
  avatar?: string
}

export interface Deal {
  id: string
  name: string
  brand: string
  companyId: string
  contactId?: string
  contactEmail?: string
  agencyContact?: string
  status: DealStatus
  dealType: DealType
  priority: Priority
  platforms: Platform[]
  quotedRate?: number
  finalRate?: number
  pipelineValue?: number
  deliverables?: string
  keyTerms?: string
  notes?: string
  jameyUsesProduct: boolean
  firstContact?: string
  deadline?: string
  actionIds: string[]
  fulfillmentIds: string[]
}

export interface Action {
  id: string
  title: string
  dealId?: string
  type: ActionType
  priority: ActionPriority
  status: ActionStatus
  owner: ActionOwner
  source: ActionSource
  dueDate?: string
  notes?: string
  createdAt: string
}

export interface Fulfillment {
  id: string
  projectName: string
  dealId: string
  status: FulfillmentStatus
  contentType: ContentType
  contentDueDate?: string
  postingDate?: string
  contentLink?: string
  brandReviewer?: string
  revisionRound: number
  invoiceAmount?: number
  invoiceStatus: InvoiceStatus
  invoiceDate?: string
  paymentDue?: string
  usageRights?: UsageRights
  usageExpiry?: string
  notes?: string
  createdAt: string
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  dealId?: string
  companyId?: string
  personId?: string
  timestamp: string
  source?: string
}

// ── App State ──

export type Persona = 'justin' | 'jamey'
export type ViewName = 'dashboard' | 'pipeline' | 'actions' | 'fulfillment' | 'companies' | 'people' | 'activity'
