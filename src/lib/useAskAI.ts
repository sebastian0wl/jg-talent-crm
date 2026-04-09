import { useState, useCallback } from 'react'
import { useData } from './DataContext'
import { useScoring } from './useScoring'
import { buildDealContext } from './dealContext'
import { callDealAssistant, type ProposedAction, type DealAssistantResponse } from './edgeFunctions'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  contextAudit?: {
    confidenceLevel: 'high' | 'medium' | 'low'
    caveats: string[]
  }
  proposedActions?: ProposedAction[]
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useAskAI(dealId: string) {
  const {
    getDeal, getCompany, getContactsForDeal,
    tasks, activities, attachments,
    updateDeal, createTask, createActivity,
  } = useData()
  const { score } = useScoring(dealId)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text: string) => {
    const deal = getDeal(dealId)
    if (!deal) return

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      // Build context
      const company = getCompany(deal.companyId)
      const contacts = getContactsForDeal(dealId)
      const context = buildDealContext(deal, company, contacts, tasks, activities, attachments, score ?? null)

      // Build message history for the API
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response: DealAssistantResponse = await callDealAssistant({
        dealId,
        question: text,
        context,
        history,
      })

      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        contextAudit: response.contextAudit,
        proposedActions: response.proposedActions,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      // Gracefully handle when Edge Function is not deployed
      const errorMessage = (err instanceof Error && err.message === 'SUPABASE_NOT_CONFIGURED')
        ? 'The AI assistant requires a Supabase Edge Function to be deployed. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, then deploy the deal-assistant Edge Function.'
        : (err instanceof Error && err.message.includes('Edge Function error'))
          ? 'The deal-assistant Edge Function is not responding. Make sure it\'s deployed with: npx supabase functions deploy deal-assistant'
          : 'Unable to reach the AI assistant. Please check your connection and try again.'

      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
        contextAudit: {
          confidenceLevel: 'low',
          caveats: ['AI service unavailable — response is a system message, not AI-generated'],
        },
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [dealId, getDeal, getCompany, getContactsForDeal, tasks, activities, attachments, score, messages, updateDeal, createTask, createActivity])

  const approveAction = useCallback(async (messageId: string, actionId: string) => {
    const deal = getDeal(dealId)
    if (!deal) return

    // Find the action
    const message = messages.find(m => m.id === messageId)
    const action = message?.proposedActions?.find(a => a.id === actionId)
    if (!action) return

    try {
      switch (action.type) {
        case 'update_deal':
          await updateDeal(dealId, action.payload as Partial<typeof deal>)
          break
        case 'move_stage':
          await updateDeal(dealId, { stage: action.payload.stage as string })
          break
        case 'create_task':
          await createTask({
            title: action.payload.title as string,
            description: action.payload.description as string | undefined,
            status: 'To Do',
            priority: (action.payload.priority as 'Urgent' | 'High' | 'Normal' | 'Low') ?? 'Normal',
            assignee: (action.payload.assignee as 'justin' | 'jamey' | 'agent') ?? 'justin',
            dealId,
            dueDate: action.payload.dueDate as string | undefined,
            createdBy: 'agent',
          })
          break
        case 'add_note':
          await createActivity({
            type: 'note',
            title: action.payload.title as string ?? 'AI-suggested note',
            description: action.payload.content as string,
            dealId,
            createdBy: 'agent',
            timestamp: new Date().toISOString(),
          })
          break
      }

      // Update the action status in state
      setMessages(prev => prev.map(m => {
        if (m.id !== messageId) return m
        return {
          ...m,
          proposedActions: m.proposedActions?.map(a =>
            a.id === actionId ? { ...a, status: 'approved' as const } : a
          ),
        }
      }))
    } catch {
      // If the action fails, we don't change status
    }
  }, [dealId, getDeal, messages, updateDeal, createTask, createActivity])

  const dismissAction = useCallback((messageId: string, actionId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m
      return {
        ...m,
        proposedActions: m.proposedActions?.map(a =>
          a.id === actionId ? { ...a, status: 'rejected' as const } : a
        ),
      }
    }))
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    approveAction,
    dismissAction,
  }
}
