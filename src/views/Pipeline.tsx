import { useState, useRef } from 'react'
import type { PipelineId, Deal } from '../types'
import { PIPELINE_LABELS, PIPELINE_STAGES, PIPELINE_COLORS } from '../types'
import { deals as initialDeals } from '../data/mockData'
import { DealCard } from '../components/DealCard'

interface Props {
  onDealClick: (id: string) => void
}

export function Pipeline({ onDealClick }: Props) {
  const [activePipeline, setActivePipeline] = useState<PipelineId>('content')
  const [dealState, setDealState] = useState<Deal[]>(initialDeals)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const dragCounter = useRef<Record<string, number>>({})

  const pipelines: PipelineId[] = ['content', 'partnership', 'service']
  const pipelineDeals = dealState.filter(d => d.pipeline === activePipeline && d.stage !== 'Lost')
  const stages = PIPELINE_STAGES[activePipeline]
  const totalValue = pipelineDeals.reduce((s, d) => s + (d.value ?? 0), 0)
  const lostDeals = dealState.filter(d => d.pipeline === activePipeline && d.stage === 'Lost')

  const handleDragStart = (dealId: string) => {
    setDragId(dealId)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setDropTarget(null)
    dragCounter.current = {}
  }

  const handleDragEnter = (stage: string) => {
    dragCounter.current[stage] = (dragCounter.current[stage] || 0) + 1
    setDropTarget(stage)
  }

  const handleDragLeave = (stage: string) => {
    dragCounter.current[stage] = (dragCounter.current[stage] || 0) - 1
    if (dragCounter.current[stage] <= 0) {
      dragCounter.current[stage] = 0
      if (dropTarget === stage) setDropTarget(null)
    }
  }

  const handleDrop = (targetStage: string) => {
    if (!dragId) return
    setDealState(prev =>
      prev.map(d =>
        d.id === dragId
          ? { ...d, stage: targetStage, lastActivityAt: new Date().toISOString() }
          : d
      )
    )
    setDragId(null)
    setDropTarget(null)
    dragCounter.current = {}
  }

  const draggedDeal = dragId ? dealState.find(d => d.id === dragId) : null

  return (
    <div className="p-6">
      {/* Pipeline Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Deal Pipeline</h1>
          <p className="text-sm text-text-muted">{pipelineDeals.length} deals — ${(totalValue / 1000).toFixed(0)}K total value</p>
        </div>
        <div className="flex gap-1 bg-surface-muted p-1 rounded-lg overflow-x-auto">
          {pipelines.map(pid => (
            <button
              key={pid}
              onClick={() => setActivePipeline(pid)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activePipeline === pid
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: PIPELINE_COLORS[pid] }} />
              {PIPELINE_LABELS[pid]}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban — horizontal scroll on all sizes, cards stack naturally */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
        {stages.map(stage => {
          const stageDeals = pipelineDeals.filter(d => d.stage === stage)
          const stageValue = stageDeals.reduce((s, d) => s + (d.value ?? 0), 0)
          const isOver = dropTarget === stage && dragId !== null
          const isDragSource = draggedDeal?.stage === stage

          return (
            <div
              key={stage}
              className="w-[220px] sm:w-[260px] shrink-0"
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
              onDragEnter={() => handleDragEnter(stage)}
              onDragLeave={() => handleDragLeave(stage)}
              onDrop={(e) => { e.preventDefault(); handleDrop(stage) }}
            >
              <div className={`bg-surface-muted rounded-xl transition-all duration-200 ${
                isOver && !isDragSource ? 'ring-2 ring-brand-400 ring-offset-1 bg-brand-50/30' : ''
              }`}>
                <div className="px-3 py-2.5 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-text-primary">{stage}</h3>
                    <span className="text-[10px] text-text-muted bg-white px-1.5 py-0.5 rounded-full">{stageDeals.length}</span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-[10px] text-text-muted mt-0.5">${(stageValue / 1000).toFixed(0)}K</p>
                  )}
                </div>
                <div className="p-2 space-y-2 min-h-[160px]">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing transition-opacity duration-150 ${
                        dragId === deal.id ? 'opacity-40' : ''
                      }`}
                    >
                      <DealCard deal={deal} onClick={onDealClick} />
                    </div>
                  ))}
                  {stageDeals.length === 0 && !isOver && (
                    <div className="flex items-center justify-center h-20 text-xs text-text-muted">Empty</div>
                  )}
                  {stageDeals.length === 0 && isOver && !isDragSource && (
                    <div className="flex items-center justify-center h-20 text-xs text-brand-500 font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lost deals */}
      {lostDeals.length > 0 && (
        <div className="mt-6 bg-white border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-text-muted mb-2">Lost ({lostDeals.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lostDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
