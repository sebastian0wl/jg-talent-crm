import { useState } from 'react'
import './index.css'
import type { ViewName, Persona } from './types'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './views/Dashboard'
import { Pipeline } from './views/Pipeline'
import { Actions } from './views/Actions'
import { FulfillmentView } from './views/FulfillmentView'
import { ActivityFeed } from './views/ActivityFeed'
import { DealDetail } from './components/DealDetail'

export default function App() {
  const [view, setView] = useState<ViewName>('dashboard')
  const [persona, setPersona] = useState<Persona>('justin')
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

  const openDeal = (id: string) => setSelectedDealId(id)
  const closeDeal = () => setSelectedDealId(null)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar view={view} setView={setView} persona={persona} setPersona={setPersona} />

      <main className="flex-1 overflow-y-auto">
        {view === 'dashboard' && <Dashboard onDealClick={openDeal} persona={persona} />}
        {view === 'pipeline' && <Pipeline onDealClick={openDeal} />}
        {view === 'actions' && <Actions persona={persona} onDealClick={openDeal} />}
        {view === 'fulfillment' && <FulfillmentView onDealClick={openDeal} />}
        {view === 'activity' && <ActivityFeed onDealClick={openDeal} />}
      </main>

      {selectedDealId && (
        <DealDetail dealId={selectedDealId} onClose={closeDeal} />
      )}
    </div>
  )
}
