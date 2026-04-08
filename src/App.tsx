import { useState } from 'react'
import './index.css'
import type { ViewId, User } from './types'
import { DataProvider } from './lib/DataContext'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './views/Dashboard'
import { Pipeline } from './views/Pipeline'
import { Actions } from './views/Actions'
import { Companies } from './views/Companies'
import { People } from './views/People'
import { ActivityFeed } from './views/ActivityFeed'
import { Collateral } from './views/Collateral'
import { DealDetail } from './components/DealDetail'

export default function App() {
  const [view, setView] = useState<ViewId>('dashboard')
  const [user, setUser] = useState<User>('justin')
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)

  const openDeal = (id: string) => setSelectedDealId(id)
  const closeDeal = () => setSelectedDealId(null)

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden bg-bg">
        <Sidebar view={view} setView={setView} user={user} setUser={setUser} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {view === 'dashboard' && <Dashboard onDealClick={openDeal} user={user} />}
          {view === 'deals' && <Pipeline onDealClick={openDeal} />}
          {view === 'tasks' && <Actions user={user} onDealClick={openDeal} />}
          {view === 'companies' && <Companies onDealClick={openDeal} />}
          {view === 'people' && <People onDealClick={openDeal} />}
          {view === 'activity' && <ActivityFeed onDealClick={openDeal} />}
          {view === 'collateral' && <Collateral />}
        </main>

        {selectedDealId && <DealDetail dealId={selectedDealId} onClose={closeDeal} />}
      </div>
    </DataProvider>
  )
}
