import type { DealContext } from './dealContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export interface DealAssistantPayload {
  dealId: string
  question: string
  context: DealContext
  history: { role: string; content: string }[]
}

export interface ProposedAction {
  id: string
  type: 'update_deal' | 'create_task' | 'move_stage' | 'add_note'
  label: string
  reasoning: string
  confidence: 'high' | 'medium' | 'low'
  payload: Record<string, unknown>
  status: 'pending' | 'approved' | 'rejected'
}

export interface DealAssistantResponse {
  content: string
  contextAudit?: {
    confidenceLevel: 'high' | 'medium' | 'low'
    caveats: string[]
  }
  proposedActions?: ProposedAction[]
}

export async function callDealAssistant(payload: DealAssistantPayload): Promise<DealAssistantResponse> {
  if (!SUPABASE_URL) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const res = await fetch(`${SUPABASE_URL}/functions/v1/deal-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Edge Function error: ${res.status}`)
  }

  return res.json()
}
