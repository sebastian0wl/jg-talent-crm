import { createContext, useContext, type ReactNode } from 'react'
import type { Deal, Task, Activity, Company, Person, Attachment, AttachmentType, DealContact, PersonCompany } from '../types'
import { useDeals, useTasks, useActivities, useCompanies, usePeople, useAttachments, useDealContacts, usePersonCompanies } from './useData'
import {
  getCompany as mockGetCompany,
  getPerson as mockGetPerson,
  getDeal as mockGetDeal,
} from '../data/mockData'

interface DataContextValue {
  // Data
  deals: Deal[]
  tasks: Task[]
  activities: Activity[]
  companies: Company[]
  people: Person[]

  // Mutations
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>
  createDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivityAt'>) => Promise<Deal>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>
  createActivity: (activity: Omit<Activity, 'id'>) => Promise<Activity>
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>
  updatePerson: (id: string, updates: Partial<Person>) => Promise<void>

  // Attachments
  attachments: Attachment[]
  uploadFile: (file: File, dealId: string, fileType: AttachmentType, companyId?: string, onProgress?: (percent: number) => void) => Promise<Attachment | null>
  deleteAttachment: (attachment: Attachment) => Promise<void>
  getAttachmentsForDeal: (dealId: string) => Attachment[]

  // Junction table data
  dealContacts: DealContact[]
  personCompanies: PersonCompany[]

  // Junction table mutations
  addDealContact: (link: Omit<DealContact, 'id'>) => Promise<DealContact>
  updateDealContact: (id: string, updates: Partial<DealContact>) => Promise<void>
  removeDealContact: (id: string) => Promise<void>
  addPersonCompany: (link: Omit<PersonCompany, 'id'>) => Promise<PersonCompany>
  updatePersonCompany: (id: string, updates: Partial<PersonCompany>) => Promise<void>
  removePersonCompany: (id: string) => Promise<void>

  // Lookups
  getCompany: (id: string) => Company | undefined
  getPerson: (id: string) => Person | undefined
  getDeal: (id: string) => Deal | undefined
  getDealsForCompany: (companyId: string) => Deal[]
  getPeopleForCompany: (companyId: string) => Person[]
  getContactsForDeal: (dealId: string) => Person[]
  getCompaniesForPerson: (personId: string) => Company[]
  getTasksForDeal: (dealId: string) => Task[]
  getActivitiesForDeal: (dealId: string) => Activity[]
  getActivitiesForCompany: (companyId: string) => Activity[]

  // Loading
  loading: boolean
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { deals, loading: dealsLoading, updateDeal, createDeal } = useDeals()
  const { tasks, loading: tasksLoading, updateTask, createTask } = useTasks()
  const { activities, loading: activitiesLoading, createActivity } = useActivities()
  const { companies, loading: companiesLoading, updateCompany } = useCompanies()
  const { people, loading: peopleLoading, updatePerson } = usePeople()
  const { attachments, loading: attachmentsLoading, uploadFile, deleteAttachment, getAttachmentsForDeal } = useAttachments()
  const { dealContacts, loading: dealContactsLoading, addDealContact, updateDealContact, removeDealContact } = useDealContacts()
  const { personCompanies, loading: personCompaniesLoading, addPersonCompany, updatePersonCompany, removePersonCompany } = usePersonCompanies()

  const loading = dealsLoading || tasksLoading || activitiesLoading || companiesLoading || peopleLoading || attachmentsLoading || dealContactsLoading || personCompaniesLoading

  // Lookup functions that work against current state
  const getCompany = (id: string) => companies.find(c => c.id === id) ?? mockGetCompany(id)
  const getPerson = (id: string) => people.find(p => p.id === id) ?? mockGetPerson(id)
  const getDeal = (id: string) => deals.find(d => d.id === id) ?? mockGetDeal(id)
  const getDealsForCompany = (cid: string) => deals.filter(d => d.companyId === cid)

  // Junction-aware: merge deprecated FK with junction table data
  const getPeopleForCompany = (cid: string) => {
    const fkPeople = people.filter(p => p.companyId === cid)
    const junctionPersonIds = personCompanies.filter(pc => pc.companyId === cid).map(pc => pc.personId)
    const junctionPeople = people.filter(p => junctionPersonIds.includes(p.id))
    // Merge, deduplicate by id
    const merged = new Map<string, Person>()
    for (const p of [...fkPeople, ...junctionPeople]) merged.set(p.id, p)
    return Array.from(merged.values())
  }

  // New junction lookups
  const getContactsForDeal = (dealId: string) => {
    const contactPersonIds = dealContacts.filter(dc => dc.dealId === dealId).map(dc => dc.personId)
    const junctionPeople = people.filter(p => contactPersonIds.includes(p.id))
    // Fallback: also include deprecated contactId if present
    const deal = deals.find(d => d.id === dealId)
    if (deal?.contactId) {
      const fallbackPerson = people.find(p => p.id === deal.contactId)
      if (fallbackPerson && !junctionPeople.some(p => p.id === fallbackPerson.id)) {
        junctionPeople.push(fallbackPerson)
      }
    }
    return junctionPeople
  }

  const getCompaniesForPerson = (personId: string) => {
    const junctionCompanyIds = personCompanies.filter(pc => pc.personId === personId).map(pc => pc.companyId)
    const junctionCompanies = companies.filter(c => junctionCompanyIds.includes(c.id))
    // Fallback: also include deprecated companyId FK
    const person = people.find(p => p.id === personId)
    if (person?.companyId) {
      const fallbackCompany = companies.find(c => c.id === person.companyId)
      if (fallbackCompany && !junctionCompanies.some(c => c.id === fallbackCompany.id)) {
        junctionCompanies.push(fallbackCompany)
      }
    }
    return junctionCompanies
  }

  const getTasksForDeal = (did: string) => tasks.filter(t => t.dealId === did)
  const getActivitiesForDeal = (did: string) => activities.filter(a => a.dealId === did).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
  const getActivitiesForCompany = (cid: string) => activities.filter(a => a.companyId === cid).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))

  return (
    <DataContext.Provider value={{
      deals, tasks, activities, companies, people,
      updateDeal, createDeal, updateTask, createTask, createActivity,
      updateCompany, updatePerson,
      attachments, uploadFile, deleteAttachment, getAttachmentsForDeal,
      dealContacts, addDealContact, updateDealContact, removeDealContact,
      personCompanies, addPersonCompany, updatePersonCompany, removePersonCompany,
      getCompany, getPerson, getDeal,
      getDealsForCompany, getPeopleForCompany, getContactsForDeal, getCompaniesForPerson,
      getTasksForDeal, getActivitiesForDeal, getActivitiesForCompany,
      loading,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
