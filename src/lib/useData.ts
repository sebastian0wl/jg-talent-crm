import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, USE_SUPABASE } from './supabase'
import type { Deal, Task, Activity, Company, Person, Attachment, AttachmentType, ExtractionStatus, DealContact, PersonCompany } from '../types'
import {
  companies as mockCompanies,
  people as mockPeople,
  deals as mockDeals,
  tasks as mockTasks,
  activities as mockActivities,
} from '../data/mockData'

// ── Generic helpers ──

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

// Snake_case ↔ camelCase converters for Supabase ↔ TS types
function snakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    result[camel] = val
  }
  return result
}

function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    const snake = key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
    result[snake] = val
  }
  return result
}

// Helper to safely call supabase (avoids null checks everywhere)
function sb() {
  return supabase!
}

// ── Deals ──

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('deals').select('*').then(({ data }) => {
      if (data) setDeals((data as any[]).map(d => snakeToCamel(d) as unknown as Deal))
      setLoading(false)
    })

    // Realtime subscription
    const channel = sb().channel('deals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setDeals(prev => prev.map(d => d.id === (payload.new as any).id ? snakeToCamel(payload.new as Record<string, unknown>) as unknown as Deal : d))
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setDeals(prev => [...prev, snakeToCamel(payload.new as Record<string, unknown>) as unknown as Deal])
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setDeals(prev => prev.filter(d => d.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const updateDeal = useCallback(async (id: string, updates: Partial<Deal>) => {
    // Auto-set contractedAt when deal enters Terms Agreed or Contract Signed
    const contractStages = ['Terms Agreed', 'Contract Signed', 'Signed']
    if (updates.stage && contractStages.includes(updates.stage)) {
      const deal = deals.find(d => d.id === id)
      if (deal && !deal.contractedAt) {
        updates = { ...updates, contractedAt: new Date().toISOString() }
      }
    }

    // Optimistic update
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastActivityAt: new Date().toISOString() } : d))

    if (USE_SUPABASE && supabase) {
      const snakeUpdates = camelToSnake(updates as Record<string, unknown>)
      snakeUpdates.last_activity_at = new Date().toISOString()
      await (sb().from('deals') as any).update(snakeUpdates).eq('id', id)
    }
  }, [deals])

  const createDeal = useCallback(async (deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivityAt'>) => {
    const newDeal: Deal = {
      ...deal,
      id: generateId('d'),
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    }
    setDeals(prev => [...prev, newDeal])

    if (USE_SUPABASE && supabase) {
      await (sb().from('deals') as any).insert(camelToSnake(newDeal as unknown as Record<string, unknown>))
    }
    return newDeal
  }, [])

  return { deals, loading, updateDeal, createDeal, setDeals }
}

// ── Tasks ──

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('tasks').select('*').then(({ data }) => {
      if (data) setTasks((data as any[]).map(t => snakeToCamel(t) as unknown as Task))
      setLoading(false)
    })

    const channel = sb().channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setTasks(prev => prev.map(t => t.id === (payload.new as any).id ? snakeToCamel(payload.new as Record<string, unknown>) as unknown as Task : t))
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setTasks(prev => [...prev, snakeToCamel(payload.new as Record<string, unknown>) as unknown as Task])
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setTasks(prev => prev.filter(t => t.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

    if (USE_SUPABASE && supabase) {
      await (sb().from('tasks') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId('t'),
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, newTask])

    if (USE_SUPABASE && supabase) {
      await (sb().from('tasks') as any).insert(camelToSnake(newTask as unknown as Record<string, unknown>))
    }
    return newTask
  }, [])

  return { tasks, loading, updateTask, createTask, setTasks }
}

// ── Activities ──

export function useActivities() {
  const [activityList, setActivities] = useState<Activity[]>(mockActivities)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('activities').select('*').order('timestamp', { ascending: false }).then(({ data }) => {
      if (data) setActivities((data as any[]).map(a => snakeToCamel(a) as unknown as Activity))
      setLoading(false)
    })

    const channel = sb().channel('activities-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
        if (payload.new) {
          setActivities(prev => [snakeToCamel(payload.new as Record<string, unknown>) as unknown as Activity, ...prev])
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const createActivity = useCallback(async (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId('a'),
    }
    setActivities(prev => [newActivity, ...prev])

    if (USE_SUPABASE && supabase) {
      await (sb().from('activities') as any).insert(camelToSnake(newActivity as unknown as Record<string, unknown>))
    }
    return newActivity
  }, [])

  return { activities: activityList, loading, createActivity }
}

// ── Companies ──

export function useCompanies() {
  const [companyList, setCompanies] = useState<Company[]>(mockCompanies)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('companies').select('*').then(({ data }) => {
      if (data) setCompanies((data as any[]).map(c => snakeToCamel(c) as unknown as Company))
      setLoading(false)
    })
  }, [])

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))

    if (USE_SUPABASE && supabase) {
      await (sb().from('companies') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  return { companies: companyList, loading, updateCompany }
}

// ── People ──

export function usePeople() {
  const [personList, setPeople] = useState<Person[]>(mockPeople)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('people').select('*').then(({ data }) => {
      if (data) setPeople((data as any[]).map(p => snakeToCamel(p) as unknown as Person))
      setLoading(false)
    })
  }, [])

  const updatePerson = useCallback(async (id: string, updates: Partial<Person>) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))

    if (USE_SUPABASE && supabase) {
      await (sb().from('people') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  return { people: personList, loading, updatePerson }
}

// ── Attachments ──
// NOTE: The Supabase Storage bucket 'deal-attachments' must be created in the
// Supabase dashboard (Storage > New bucket > name: "deal-attachments", public: true).
// Without this bucket, uploads will fail.

const STORAGE_BUCKET = 'deal-attachments'

export function useAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('attachments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setAttachments((data as any[]).map(a => snakeToCamel(a) as unknown as Attachment))
      setLoading(false)
    })

    // Realtime subscription (INSERT, UPDATE, DELETE)
    const channel = sb().channel('attachments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attachments' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          setAttachments(prev => [snakeToCamel(payload.new as Record<string, unknown>) as unknown as Attachment, ...prev])
        } else if (payload.eventType === 'UPDATE' && payload.new) {
          setAttachments(prev => prev.map(a => a.id === (payload.new as any).id ? snakeToCamel(payload.new as Record<string, unknown>) as unknown as Attachment : a))
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setAttachments(prev => prev.filter(a => a.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const uploadFile = useCallback(async (
    file: File,
    dealId: string,
    fileType: AttachmentType,
    companyId?: string,
    onProgress?: (percent: number) => void,
    description?: string,
  ): Promise<Attachment | null> => {
    const id = generateId('att')
    const storagePath = `deals/${dealId}/${fileType}/${file.name}`

    // Optimistic: signal upload started
    onProgress?.(0)

    if (USE_SUPABASE && supabase) {
      // Upload to Supabase Storage
      const { error: uploadError } = await sb().storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true, // overwrite if same name
        })

      if (uploadError) {
        console.error('Storage upload failed:', uploadError)
        return null
      }

      onProgress?.(50)

      // Get the public URL
      const { data: urlData } = sb().storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath)

      const publicUrl = urlData?.publicUrl ?? undefined

      // Insert record into attachments table
      const newAttachment: Attachment = {
        id,
        dealId,
        companyId,
        fileType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storagePath,
        publicUrl,
        description,
        uploadedBy: 'justin',
        createdAt: new Date().toISOString(),
        sourceType: 'file',
        extractionStatus: 'pending',
      }

      const { error: insertError } = await (sb().from('attachments') as any)
        .insert(camelToSnake(newAttachment as unknown as Record<string, unknown>))

      if (insertError) {
        console.error('Attachment record insert failed:', insertError)
        // Clean up uploaded file
        await sb().storage.from(STORAGE_BUCKET).remove([storagePath])
        return null
      }

      onProgress?.(100)

      // Optimistic add to local state (realtime will also fire, but this is faster)
      setAttachments(prev => [newAttachment, ...prev])
      return newAttachment
    }

    // Mock mode: create local-only attachment
    const mockAttachment: Attachment = {
      id,
      dealId,
      companyId,
      fileType,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath,
      publicUrl: undefined,
      uploadedBy: 'justin',
      createdAt: new Date().toISOString(),
    }
    setAttachments(prev => [mockAttachment, ...prev])
    onProgress?.(100)
    return mockAttachment
  }, [])

  const attachUrl = useCallback(async (
    url: string,
    dealId: string,
    fileType: AttachmentType,
    fileName: string,
    description?: string,
    companyId?: string,
  ): Promise<Attachment | null> => {
    const id = generateId('att')

    const newAttachment: Attachment = {
      id,
      dealId,
      companyId,
      fileType,
      fileName,
      storagePath: undefined,
      publicUrl: url,
      description,
      uploadedBy: 'justin',
      createdAt: new Date().toISOString(),
      sourceType: 'url',
      extractionStatus: 'pending',
    }

    if (USE_SUPABASE && supabase) {
      const { error } = await (sb().from('attachments') as any)
        .insert(camelToSnake(newAttachment as unknown as Record<string, unknown>))
      if (error) {
        console.error('URL attachment insert failed:', error)
        return null
      }
    }

    setAttachments(prev => [newAttachment, ...prev])
    return newAttachment
  }, [])

  const deleteAttachment = useCallback(async (attachment: Attachment) => {
    // Optimistic removal
    setAttachments(prev => prev.filter(a => a.id !== attachment.id))

    if (USE_SUPABASE && supabase) {
      // Only delete from storage if there's an actual stored file
      if (attachment.storagePath) {
        await sb().storage.from(STORAGE_BUCKET).remove([attachment.storagePath])
      }
      // Delete record
      await (sb().from('attachments') as any).delete().eq('id', attachment.id)
    }
  }, [])

  const updateAttachment = useCallback(async (id: string, updates: Partial<Attachment>) => {
    setAttachments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))

    if (USE_SUPABASE && supabase) {
      await (sb().from('attachments') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  // Client-side text extraction for supported file types
  const extractText = useCallback(async (attachment: Attachment): Promise<string | null> => {
    // Mark as extracting
    await updateAttachment(attachment.id, { extractionStatus: 'extracting' as ExtractionStatus })

    try {
      // For text-based files: fetch and read directly
      const textMimes = ['text/plain', 'text/markdown', 'text/csv', 'text/html', 'application/json']
      const textExts = ['.txt', '.md', '.csv', '.json', '.html', '.htm']
      const isTextFile = textMimes.some(m => attachment.mimeType?.startsWith(m)) ||
        textExts.some(ext => attachment.fileName.toLowerCase().endsWith(ext))

      if (isTextFile && attachment.publicUrl) {
        const resp = await fetch(attachment.publicUrl)
        const text = await resp.text()
        await updateAttachment(attachment.id, { extractedText: text, extractionStatus: 'done' as ExtractionStatus })
        return text
      }

      // For PDFs and other binary formats: mark as needing server-side extraction
      // (Future: add pdf.js or edge function extraction here)
      if (attachment.mimeType === 'application/pdf') {
        await updateAttachment(attachment.id, { extractionStatus: 'pending' as ExtractionStatus })
        return null
      }

      // Images and unsupported types
      await updateAttachment(attachment.id, { extractionStatus: 'skipped' as ExtractionStatus })
      return null
    } catch (err) {
      console.error('Text extraction failed:', err)
      await updateAttachment(attachment.id, { extractionStatus: 'failed' as ExtractionStatus })
      return null
    }
  }, [updateAttachment])

  const getAttachmentsForDeal = useCallback((dealId: string) => {
    return attachments.filter(a => a.dealId === dealId)
  }, [attachments])

  return { attachments, loading, uploadFile, attachUrl, deleteAttachment, updateAttachment, extractText, getAttachmentsForDeal }
}

// ── Deal Contacts (junction table) ──

export function useDealContacts() {
  const [dealContacts, setDealContacts] = useState<DealContact[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('deal_contacts').select('*').then(({ data }) => {
      if (data) setDealContacts((data as any[]).map(d => snakeToCamel(d) as unknown as DealContact))
      setLoading(false)
    })

    const channel = sb().channel('deal-contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deal_contacts' }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setDealContacts(prev => prev.map(dc => dc.id === (payload.new as any).id ? snakeToCamel(payload.new as Record<string, unknown>) as unknown as DealContact : dc))
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setDealContacts(prev => [...prev, snakeToCamel(payload.new as Record<string, unknown>) as unknown as DealContact])
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setDealContacts(prev => prev.filter(dc => dc.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const addDealContact = useCallback(async (link: Omit<DealContact, 'id'>) => {
    const newLink: DealContact = { ...link, id: generateId('dc') }
    setDealContacts(prev => [...prev, newLink])

    if (USE_SUPABASE && supabase) {
      await (sb().from('deal_contacts') as any).insert(camelToSnake(newLink as unknown as Record<string, unknown>))
    }
    return newLink
  }, [])

  const updateDealContact = useCallback(async (id: string, updates: Partial<DealContact>) => {
    setDealContacts(prev => prev.map(dc => dc.id === id ? { ...dc, ...updates } : dc))

    if (USE_SUPABASE && supabase) {
      await (sb().from('deal_contacts') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  const removeDealContact = useCallback(async (id: string) => {
    setDealContacts(prev => prev.filter(dc => dc.id !== id))

    if (USE_SUPABASE && supabase) {
      await (sb().from('deal_contacts') as any).delete().eq('id', id)
    }
  }, [])

  return { dealContacts, loading, addDealContact, updateDealContact, removeDealContact }
}

// ── Person Companies (junction table) ──

export function usePersonCompanies() {
  const [personCompanies, setPersonCompanies] = useState<PersonCompany[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!USE_SUPABASE || !supabase) return
    setLoading(true)
    sb().from('person_companies').select('*').then(({ data }) => {
      if (data) setPersonCompanies((data as any[]).map(d => snakeToCamel(d) as unknown as PersonCompany))
      setLoading(false)
    })

    const channel = sb().channel('person-companies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'person_companies' }, (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new) {
          setPersonCompanies(prev => prev.map(pc => pc.id === (payload.new as any).id ? snakeToCamel(payload.new as Record<string, unknown>) as unknown as PersonCompany : pc))
        } else if (payload.eventType === 'INSERT' && payload.new) {
          setPersonCompanies(prev => [...prev, snakeToCamel(payload.new as Record<string, unknown>) as unknown as PersonCompany])
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setPersonCompanies(prev => prev.filter(pc => pc.id !== (payload.old as any).id))
        }
      })
      .subscribe()

    return () => { sb().removeChannel(channel) }
  }, [])

  const addPersonCompany = useCallback(async (link: Omit<PersonCompany, 'id'>) => {
    const newLink: PersonCompany = { ...link, id: generateId('pc') }
    setPersonCompanies(prev => [...prev, newLink])

    if (USE_SUPABASE && supabase) {
      await (sb().from('person_companies') as any).insert(camelToSnake(newLink as unknown as Record<string, unknown>))
    }
    return newLink
  }, [])

  const updatePersonCompany = useCallback(async (id: string, updates: Partial<PersonCompany>) => {
    setPersonCompanies(prev => prev.map(pc => pc.id === id ? { ...pc, ...updates } : pc))

    if (USE_SUPABASE && supabase) {
      await (sb().from('person_companies') as any).update(camelToSnake(updates as Record<string, unknown>)).eq('id', id)
    }
  }, [])

  const removePersonCompany = useCallback(async (id: string) => {
    setPersonCompanies(prev => prev.filter(pc => pc.id !== id))

    if (USE_SUPABASE && supabase) {
      await (sb().from('person_companies') as any).delete().eq('id', id)
    }
  }, [])

  return { personCompanies, loading, addPersonCompany, updatePersonCompany, removePersonCompany }
}

// ── Inline Edit Hook ──

export function useInlineEdit<T>(
  initialValue: T,
  onSave: (value: T) => void | Promise<void>,
) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState<T>(initialValue)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) inputRef.current.select()
    }
  }, [editing])

  const startEditing = useCallback(() => setEditing(true), [])

  const save = useCallback(() => {
    setEditing(false)
    if (value !== initialValue) {
      onSave(value)
    }
  }, [value, initialValue, onSave])

  const cancel = useCallback(() => {
    setEditing(false)
    setValue(initialValue)
  }, [initialValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      save()
    } else if (e.key === 'Escape') {
      cancel()
    }
  }, [save, cancel])

  return {
    editing,
    value,
    setValue,
    inputRef,
    startEditing,
    save,
    cancel,
    handleKeyDown,
  }
}
