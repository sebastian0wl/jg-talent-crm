import { useState } from 'react'
import type { DealScore, ScoreGrade, DimensionScore, UpgradeMove, ViabilityPath } from '../types'

const GRADE_CONFIG: Record<ScoreGrade, { color: string; bg: string; border: string; bar: string }> = {
  S: { color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', bar: 'bg-violet-500' },
  A: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  B: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' },
  C: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' },
  D: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500' },
}

const GRADE_VALUE: Record<ScoreGrade, number> = { S: 100, A: 80, B: 60, C: 40, D: 20 }

const VERDICT_STYLE: Record<string, { color: string; bg: string }> = {
  'no-brainer': { color: 'text-violet-700', bg: 'bg-violet-50' },
  'strong': { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  'viable': { color: 'text-blue-700', bg: 'bg-blue-50' },
  'marginal': { color: 'text-amber-700', bg: 'bg-amber-50' },
  'not worth it': { color: 'text-red-700', bg: 'bg-red-50' },
}

function GradeBadge({ grade, size = 'md' }: { grade: ScoreGrade; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = GRADE_CONFIG[grade]
  const sizeClass = size === 'lg' ? 'w-10 h-10 text-lg' : size === 'md' ? 'w-7 h-7 text-sm' : 'w-5 h-5 text-[10px]'
  return (
    <span className={`inline-flex items-center justify-center rounded-md font-bold ${sizeClass} ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
      {grade}
    </span>
  )
}

function DimensionRow({ dim, expanded, onToggle }: { dim: DimensionScore; expanded: boolean; onToggle: () => void }) {
  const cfg = GRADE_CONFIG[dim.grade]
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={onToggle} className="w-full flex items-center gap-2 py-2 px-1 hover:bg-surface-muted transition-colors text-left">
        <GradeBadge grade={dim.grade} size="sm" />
        <span className="flex-1 text-xs font-medium text-text-primary">{dim.dimension}</span>
        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${GRADE_VALUE[dim.grade]}%` }} />
        </div>
        <svg className={`w-3 h-3 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-1 pb-2.5 pl-8">
          <p className="text-xs text-text-secondary leading-relaxed">{dim.reasoning}</p>
        </div>
      )}
    </div>
  )
}

function UpgradeMoveCard({ move }: { move: UpgradeMove }) {
  return (
    <div className="bg-surface-muted rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-medium text-text-muted">{move.dimension}</span>
        <GradeBadge grade={move.currentGrade} size="sm" />
        <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <GradeBadge grade={move.potentialGrade} size="sm" />
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{move.move}</p>
    </div>
  )
}

function ViabilityPathCard({ path }: { path: ViabilityPath }) {
  const vs = VERDICT_STYLE[path.verdict] || VERDICT_STYLE['viable']
  return (
    <div className="border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <GradeBadge grade={path.overallGrade} size="sm" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-text-primary">{path.label}: {path.name}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${vs.bg} ${vs.color}`}>
          {path.verdict}
        </span>
      </div>
      <ul className="space-y-0.5 mb-2">
        {path.changes.map((c, i) => (
          <li key={i} className="text-xs text-text-secondary flex gap-1.5">
            <span className="text-brand-500 mt-0.5">+</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
      {path.whatMakesItWork && (
        <p className="text-[10px] text-emerald-700 bg-emerald-50 rounded px-2 py-1 mb-1">{path.whatMakesItWork}</p>
      )}
      {path.whatHoldsItBack && (
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1">{path.whatHoldsItBack}</p>
      )}
    </div>
  )
}

export function DealScoreCard({ score }: { score: DealScore }) {
  const [expandedDim, setExpandedDim] = useState<string | null>(null)
  const [section, setSection] = useState<'dimensions' | 'upgrades' | 'paths'>('dimensions')

  return (
    <div>
      {/* Overall Grade + Recommendation */}
      <div className="flex items-start gap-3 mb-4">
        <GradeBadge grade={score.overallGrade} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary mb-0.5">Deal Score</p>
          <p className="text-xs text-text-secondary leading-relaxed">{score.recommendation}</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-3 bg-surface-muted rounded-lg p-0.5">
        {([
          ['dimensions', '9 Dimensions'],
          ['upgrades', `Upgrades (${score.upgradeMoves.length})`],
          ['paths', `Paths (${score.viabilityPaths.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key as typeof section)}
            className={`flex-1 text-[10px] font-medium py-1.5 rounded-md transition-colors ${
              section === key ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dimensions */}
      {section === 'dimensions' && (
        <div className="border border-border rounded-lg overflow-hidden">
          {score.dimensions.map(dim => (
            <DimensionRow
              key={dim.dimension}
              dim={dim}
              expanded={expandedDim === dim.dimension}
              onToggle={() => setExpandedDim(expandedDim === dim.dimension ? null : dim.dimension)}
            />
          ))}
        </div>
      )}

      {/* Upgrade Moves */}
      {section === 'upgrades' && (
        <div className="space-y-2">
          {score.upgradeMoves.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">No upgrade moves — all dimensions are A or S</p>
          ) : (
            score.upgradeMoves.map((m, i) => <UpgradeMoveCard key={i} move={m} />)
          )}
        </div>
      )}

      {/* Viability Paths */}
      {section === 'paths' && (
        <div className="space-y-2">
          {score.viabilityPaths.map((p, i) => <ViabilityPathCard key={i} path={p} />)}
        </div>
      )}

      {/* Positioning Angles */}
      {score.positioningAngles.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">Positioning Angles</p>
          <div className="space-y-1">
            {score.positioningAngles.map((angle, i) => (
              <p key={i} className="text-xs text-text-secondary bg-surface-muted rounded-lg px-2.5 py-1.5 italic">
                {angle}
              </p>
            ))}
          </div>
        </div>
      )}

      <p className="text-[9px] text-text-muted mt-3">
        Evaluated {new Date(score.evaluatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}
