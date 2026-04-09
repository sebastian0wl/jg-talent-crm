import type { Deal } from '../types'

/**
 * Compute a short hash of the material fields on a deal.
 * Used to detect when deal data has changed since the last scoring.
 * Deterministic: same inputs always produce the same hash.
 */
export function getDealHash(deal: Deal): string {
  const material = {
    value: deal.value,
    stage: deal.stage,
    type: deal.type,
    pipeline: deal.pipeline,
    deliverables: deal.deliverables,
    terms: deal.terms,
    platforms: deal.platforms,
    priority: deal.priority,
    expectedCloseDate: deal.expectedCloseDate,
  }
  const str = JSON.stringify(material)
  // Use TextEncoder for Unicode-safe base64
  const bytes = new TextEncoder().encode(str)
  const binStr = Array.from(bytes, b => String.fromCharCode(b)).join('')
  return btoa(binStr).slice(0, 32)
}
