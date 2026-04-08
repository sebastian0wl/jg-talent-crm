import { useState } from 'react'
import type { PipelineId } from '../types'
import { PIPELINE_LABELS, PIPELINE_STAGES, PIPELINE_COLORS } from '../types'
import { deals } from '../data/mockData'
import { DealCard } from '../components/DealCard'

interface Props {
  onDealClick: (id: string) => void
}

export function Pipeline({ onDealClick }: Props) {
  const [activePipeline, setActivePipeline] = useState<PipelineId>('content')
  const pipelines: PipelineId[] = ['content', 'partnership', 'service']

  const pipelineDeals = deals.filter(d => d.pipeline === activePipeline && d.stage !== 'Lost')
  const stages = PIPELINE_STAGES[activePipeline]
  const totalValue = pipelineDeals.reduce((s, d) => s + (d.value ?? 0), 0)

  const lostDeals = deals.filter(d => d.pipeline === activePipeline && d.stage === 'Lost')

  return (
    <div className="p-6">
      {/* Pipeline Tabs */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Deal Pipeline</h1>
          <p className="text-sm text-text-muted">{pipelineDeals.length} deals — ${(totalValue / 1000).toFixed(0)}K total value</p>
        </div>
        <div className="flex gap-1 bg-surface-muted p-1 rounded-lg">
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

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageDeals = pipelineDeals.filter(d => d.stage === stage)
          const stageValue = stageDeals.reduce((s, d) => s + (d.value ?? 0), 0)

          return (
            <div key={stage} className="w-[260px] shrink-0">
              <div className="bg-surface-muted rounded-xl">
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
                    <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-text-muted">Empty</div>
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
          <div className="grid grid-cols-3 gap-2">
            {lostDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
