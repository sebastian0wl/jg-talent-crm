import { useState, useEffect, useCallback, useRef } from 'react'
import type { DealScore } from '../types'
import { useData } from './DataContext'
import { evaluateDeal } from './scoringEngine'
import { getDealHash } from './dealHash'
import { getDealScore as getStaticScore } from '../data/scores'

interface ScoringState {
  score: DealScore | undefined
  isStale: boolean
  isScoring: boolean
  rescore: () => void
}

// In-memory cache: dealId -> { score, hash }
const scoreCache = new Map<string, { score: DealScore; hash: string }>()

/**
 * React hook that provides live deal scoring.
 *
 * - On first load, checks the in-memory cache, then falls back to static seed data.
 * - Computes a hash of the deal's material fields and compares to the cached hash.
 * - If different, marks the score as stale.
 * - rescore() recalculates using the scoring engine.
 * - Auto-scores on first load if no cached or seed score exists.
 */
export function useScoring(dealId: string): ScoringState {
  const { getDeal, getCompany, getDealsForCompany } = useData()

  const deal = getDeal(dealId)
  const company = deal ? getCompany(deal.companyId) : undefined

  // Count past deals with same company (excluding current deal)
  const pastDealCount = deal
    ? getDealsForCompany(deal.companyId).filter(d => d.id !== dealId).length
    : 0

  const [score, setScore] = useState<DealScore | undefined>(() => {
    // Check in-memory cache first
    const cached = scoreCache.get(dealId)
    if (cached) return cached.score
    // Fall back to static seed
    return getStaticScore(dealId) ?? undefined
  })

  const [isScoring, setIsScoring] = useState(false)

  // Compute current hash
  const currentHash = deal ? getDealHash(deal) : ''

  // Determine staleness
  const cachedEntry = scoreCache.get(dealId)
  const isStale = !!deal && !!score && (
    cachedEntry ? cachedEntry.hash !== currentHash : true
  )

  // Rescore function
  const rescore = useCallback(() => {
    if (!deal) return

    setIsScoring(true)

    // Use a microtask to allow the loading state to render
    Promise.resolve().then(() => {
      const newScore = evaluateDeal(deal, company, undefined, pastDealCount)
      const hash = getDealHash(deal)

      scoreCache.set(dealId, { score: newScore, hash })
      setScore(newScore)
      setIsScoring(false)
    })
  }, [deal, company, pastDealCount, dealId])

  // Auto-score on first load if no score exists
  const hasAutoScored = useRef(false)
  useEffect(() => {
    if (!hasAutoScored.current && deal && !score) {
      hasAutoScored.current = true
      rescore()
    }
  }, [deal, score, rescore])

  return { score, isStale, isScoring, rescore }
}
