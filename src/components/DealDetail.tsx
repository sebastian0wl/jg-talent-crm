import { useState, useCallback } from 'react'
import { STAGE_GATES, PIPELINE_STAGES, ATTACHMENT_TYPE_META, type TaskStatus, type TaskPriority, type AttachmentType, type Attachment } from '../types'
import { useData } from '../lib/DataContext'
import { getEmailThreadForDeal, getEmailThread } from '../data/scores'
import { useScoring } from '../lib/useScoring'
import { StageBadge, PipelineBadge, PriorityBadge, ActivityIcon } from './Badges'
import { DealScoreCard } from './DealScoreCard'
import { EmailThreadView } from './EmailThreadView'
import { AskAI } from './AskAI'
import DocumentViewer from './DocumentViewer'

interface Props {
  dealId: string
  onClose: () => void
}

export function DealDetail({ dealId, onClose }: Props) {
  const { getDeal, getCompany, getPerson, getTasksForDeal, getActivitiesForDeal, updateDeal, updateTask, createTask, people, companies } = useData()
  const { score, isStale, isScoring, rescore } = useScoring(dealId)
  const [tab, setTab] = useState<'overview' | 'score'>('overview')
  const [showAskAI, setShowAskAI] = useState(false)

  const deal = getDeal(dealId)
  if (!deal) return null

  const company = getCompany(deal.companyId)
  const contact = deal.contactId ? getPerson(deal.contactId) : null
  const tasks = getTasksForDeal(dealId)
  const timeline = getActivitiesForDeal(dealId)
  const stages = PIPELINE_STAGES[deal.pipeline]
  const currentIdx = stages.indexOf(deal.stage)
  const gate = STAGE_GATES[deal.stage]
  const emailThreads = getEmailThreadForDeal(dealId)

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className={`fixed inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 bg-white md:border-l border-border z-50 flex shadow-xl transition-[width] duration-300 ease-in-out ${showAskAI ? 'md:w-[960px]' : 'md:w-[540px]'}`}>
        {/* Deal Content */}
        <div className={`flex-1 min-w-0 overflow-y-auto ${showAskAI ? 'md:w-[540px] md:shrink-0' : 'w-full'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border p-5 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-text-primary">{company?.name}</h2>
                <EditablePriorityBadge priority={deal.priority} onSave={(p) => updateDeal(dealId, { priority: p as any })} />
              </div>
              <EditableText
                value={deal.name}
                onSave={(v) => updateDeal(dealId, { name: v })}
                className="text-sm text-text-muted"
              />
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary text-xl p-1 rounded-lg hover:bg-surface-muted">×</button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <PipelineBadge pipeline={deal.pipeline} />
            <EditableStage deal={deal} stages={stages} onSave={(s) => updateDeal(dealId, { stage: s })} />
            <span className="text-xs text-text-muted">{deal.type}</span>
          </div>

          {/* Tab bar + Ask AI */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-1 flex-1 bg-surface-muted rounded-lg p-0.5">
              <button
                onClick={() => setTab('overview')}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                  tab === 'overview' ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setTab('score')}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                  tab === 'score'
                    ? 'bg-white text-text-primary shadow-sm'
                    : score ? 'text-text-muted hover:text-text-secondary' : 'text-text-muted/50 cursor-not-allowed'
                }`}
                disabled={!score}
              >
                Score{score ? ` (${score.overallGrade})` : ''}
              </button>
            </div>
            <button
              onClick={() => setShowAskAI(true)}
              className="shrink-0 flex items-center gap-1.5 text-xs font-medium bg-brand-50 hover:bg-brand-100 text-brand-600 px-3 py-1.5 rounded-lg transition-colors border border-brand-200"
              title="Ask AI about this deal"
            >
              <span className="text-sm">&#10024;</span>
              Ask AI
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Score Tab */}
          {tab === 'score' && score && (
            <DealScoreCard score={score} isStale={isStale} isScoring={isScoring} onRescore={rescore} />
          )}

          {tab === 'overview' && <>
          {/* Stage Progress */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Pipeline Progress</h3>
            <div className="flex gap-1 flex-wrap md:flex-nowrap">
              {stages.map((s, i) => (
                <button
                  key={s}
                  className="flex-1 min-w-[40px] cursor-pointer group"
                  title={`Move to ${s}`}
                  onClick={() => updateDeal(dealId, { stage: s })}
                >
                  <div className={`h-1.5 rounded-full transition-colors ${
                    i < currentIdx ? 'bg-brand-500' :
                    i === currentIdx ? 'bg-brand-400' :
                    'bg-gray-200 group-hover:bg-brand-200'
                  }`} />
                  <p className={`text-[9px] mt-1 truncate ${i === currentIdx ? 'text-brand-700 font-semibold' : 'text-text-muted'}`}>
                    {s}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Gate Action */}
          {gate && (
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider mb-0.5">To advance this deal</p>
              <p className="text-sm text-brand-800 font-medium">{gate}</p>
            </div>
          )}

          {/* Value */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`rounded-lg p-3 ${deal.contractedAt ? 'bg-green-50' : 'bg-surface-muted'}`}>
              <p className={`text-[10px] uppercase tracking-wider ${deal.contractedAt ? 'text-green-700' : 'text-text-muted'}`}>
                {deal.contractedAt ? 'Contracted Value' : 'Est. Value'}
              </p>
              <EditableNumber
                value={deal.value ?? 0}
                onSave={(v) => updateDeal(dealId, { value: v })}
                prefix="$"
                className={`text-lg font-bold ${deal.contractedAt ? 'text-green-700' : 'text-text-primary'}`}
              />
              {deal.contractedAt && (
                <p className="text-[10px] text-green-600 mt-0.5">
                  Signed {new Date(deal.contractedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            <div className="bg-surface-muted rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Expected Close</p>
              <EditableDate
                value={deal.expectedCloseDate ?? ''}
                onSave={(v) => updateDeal(dealId, { expectedCloseDate: v || undefined })}
                className="text-sm font-semibold text-text-primary"
              />
            </div>
            <div className="bg-surface-muted rounded-lg p-3">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Currency</p>
              <p className="text-sm font-semibold text-text-primary">{deal.currency ?? 'USD'}</p>
            </div>
          </div>

          {/* Documents */}
          <DocumentsSection dealId={dealId} />

          {/* Details */}
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              {/* Contact — relational dropdown from People */}
              <EditableSelect
                label="Contact"
                value={deal.contactId ?? ''}
                options={[
                  { value: '', label: 'No contact' },
                  ...people
                    .filter(p => p.companyId === deal.companyId)
                    .map(p => ({ value: p.id, label: `${p.name}${p.role ? ` — ${p.role}` : ''}` })),
                  // Also show all people if company doesn't have contacts
                  ...(people.filter(p => p.companyId === deal.companyId).length === 0
                    ? people.map(p => {
                        const co = getCompany(p.companyId)
                        return { value: p.id, label: `${p.name}${co ? ` (${co.name})` : ''}` }
                      })
                    : []),
                ]}
                onSave={(v) => updateDeal(dealId, { contactId: v || undefined })}
                displayValue={contact ? `${contact.name} — ${contact.role ?? ''}` : 'Select contact...'}
              />
              {contact?.email && <Row label="Email" value={contact.email} />}

              {/* Company — relational dropdown */}
              <EditableSelect
                label="Company"
                value={deal.companyId}
                options={companies.map(c => ({ value: c.id, label: c.name }))}
                onSave={(v) => updateDeal(dealId, { companyId: v })}
                displayValue={company?.name ?? 'Select company...'}
              />

              {/* Platforms — editable text */}
              <EditablePlatforms
                platforms={deal.platforms ?? []}
                onSave={(p) => updateDeal(dealId, { platforms: p })}
              />

              <EditableSelect
                label="Owner"
                value={deal.owner}
                options={[
                  { value: 'justin', label: 'Justin' },
                  { value: 'jamey', label: 'Jamey' },
                  { value: 'both', label: 'Justin & Jamey' },
                ]}
                onSave={(v) => updateDeal(dealId, { owner: v as 'justin' | 'jamey' | 'both' })}
              />

              {/* Jamey Uses — toggle */}
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-text-muted">Jamey Uses</span>
                <button
                  onClick={() => updateDeal(dealId, { jameyUsesProduct: !deal.jameyUsesProduct })}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                    deal.jameyUsesProduct
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {deal.jameyUsesProduct ? 'Yes' : 'No'}
                </button>
              </div>

              <Row label="Created" value={new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
            </div>
          </div>

          {/* Deliverables */}
          <EditableSection
            label="Deliverables"
            value={deal.deliverables ?? ''}
            onSave={(v) => updateDeal(dealId, { deliverables: v })}
          />

          {/* Terms & Strategy */}
          <EditableSection
            label="Terms & Strategy"
            value={deal.terms ?? ''}
            onSave={(v) => updateDeal(dealId, { terms: v })}
          />

          {/* Notes */}
          <EditableSection
            label="Notes"
            value={deal.notes ?? ''}
            onSave={(v) => updateDeal(dealId, { notes: v })}
            placeholder="Add notes..."
          />

          {/* Tasks */}
          <TasksSection
            tasks={tasks}
            dealId={dealId}
            onUpdateTask={updateTask}
            onCreateTask={createTask}
          />

          {/* Email Threads */}
          {emailThreads.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email History ({emailThreads.length})</h3>
              <div className="space-y-2">
                {emailThreads.map(thread => (
                  <EmailThreadView key={thread.activityId} thread={thread} />
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Activity</h3>
              <div className="space-y-2">
                {timeline.map(act => {
                  const actThread = (act.type === 'email_sent' || act.type === 'email_received') ? getEmailThread(act.id) : null
                  return (
                    <div key={act.id}>
                      <div className="flex items-start gap-2.5">
                        <ActivityIcon type={act.type} />
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">{act.title}</p>
                          <p className="text-xs text-text-muted">
                            {new Date(act.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            <span className="ml-1.5 capitalize">{act.createdBy}</span>
                          </p>
                        </div>
                      </div>
                      {actThread && (
                        <div className="ml-7 mt-1.5">
                          <EmailThreadView thread={actThread} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          </>}
        </div>
      </div>{/* end deal content */}

      {/* Ask AI Panel — inline beside deal detail */}
      {showAskAI && (
        <AskAI dealId={dealId} onClose={() => setShowAskAI(false)} inline />
      )}
      </div>{/* end outer flex container */}
    </>
  )
}

// ── Inline Editing Components ──

function EditableText({ value, onSave, className = '' }: { value: string; onSave: (v: string) => void; className?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (!editing) {
    return (
      <span
        className={`${className} cursor-pointer hover:bg-brand-50 hover:text-brand-700 rounded px-1 -mx-1 transition-colors`}
        onClick={() => { setDraft(value); setEditing(true) }}
        title="Click to edit"
      >
        {value || 'Click to add...'}
      </span>
    )
  }
  return (
    <input
      autoFocus
      className={`${className} bg-white border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200 w-full`}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { setEditing(false); if (draft !== value) onSave(draft) }}
      onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } else if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
    />
  )
}

function EditableNumber({ value, onSave, prefix = '', className = '' }: { value: number; onSave: (v: number) => void; prefix?: string; className?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  if (!editing) {
    return (
      <span
        className={`${className} cursor-pointer hover:bg-brand-50 hover:text-brand-700 rounded px-1 -mx-1 transition-colors`}
        onClick={() => { setDraft(String(value)); setEditing(true) }}
        title="Click to edit"
      >
        {prefix}{value.toLocaleString()}
      </span>
    )
  }
  return (
    <div className="flex items-center gap-1">
      {prefix && <span className={className}>{prefix}</span>}
      <input
        autoFocus
        type="number"
        className="bg-white border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200 w-28 text-sm font-bold"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); const n = parseInt(draft); if (!isNaN(n) && n !== value) onSave(n) }}
        onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } else if (e.key === 'Escape') { setEditing(false); setDraft(String(value)) } }}
      />
    </div>
  )
}

function EditableDate({ value, onSave, className = '' }: { value: string; onSave: (v: string) => void; className?: string }) {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <span
        className={`${className} cursor-pointer hover:bg-brand-50 hover:text-brand-700 rounded px-1 -mx-1 transition-colors`}
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        {value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Set date...'}
      </span>
    )
  }
  return (
    <input
      autoFocus
      type="date"
      className="bg-white border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200 text-sm"
      defaultValue={value}
      onBlur={(e) => { setEditing(false); if (e.target.value !== value) onSave(e.target.value) }}
      onKeyDown={e => { if (e.key === 'Escape') setEditing(false) }}
    />
  )
}

function EditablePriorityBadge({ priority, onSave }: { priority: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <span onClick={() => setEditing(true)} className="cursor-pointer" title="Click to change priority">
        <PriorityBadge priority={priority as any} />
      </span>
    )
  }
  return (
    <select
      autoFocus
      className="text-xs border border-brand-300 rounded px-1 py-0.5 outline-none ring-1 ring-brand-200"
      value={priority}
      onChange={e => { onSave(e.target.value); setEditing(false) }}
      onBlur={() => setEditing(false)}
    >
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  )
}

function EditableStage({ deal, stages, onSave }: { deal: { stage: string; pipeline: string }; stages: string[]; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <span onClick={() => setEditing(true)} className="cursor-pointer" title="Click to change stage">
        <StageBadge stage={deal.stage} pipeline={deal.pipeline as any} />
      </span>
    )
  }
  return (
    <select
      autoFocus
      className="text-xs border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200"
      value={deal.stage}
      onChange={e => { onSave(e.target.value); setEditing(false) }}
      onBlur={() => setEditing(false)}
    >
      {stages.map(s => <option key={s} value={s}>{s}</option>)}
      <option value="Lost">Lost</option>
    </select>
  )
}

function EditablePlatforms({ platforms, onSave }: { platforms: string[]; onSave: (v: string[]) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(platforms.join(', '))

  return (
    <div className="flex justify-between py-1 border-b border-border">
      <span className="text-text-muted">Platforms</span>
      {editing ? (
        <input
          autoFocus
          className="text-xs border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200 w-40 text-right"
          value={draft}
          placeholder="X, YouTube, IG..."
          onChange={e => setDraft(e.target.value)}
          onBlur={() => {
            setEditing(false)
            const newPlatforms = draft.split(',').map(s => s.trim()).filter(Boolean)
            if (JSON.stringify(newPlatforms) !== JSON.stringify(platforms)) onSave(newPlatforms)
          }}
          onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setEditing(false); setDraft(platforms.join(', ')) } }}
        />
      ) : (
        <span
          className="text-text-primary cursor-pointer hover:text-brand-600 transition-colors"
          onClick={() => { setDraft(platforms.join(', ')); setEditing(true) }}
          title="Click to edit"
        >
          {platforms.length > 0 ? platforms.join(', ') : <span className="text-text-muted italic">Add platforms...</span>}
        </span>
      )}
    </div>
  )
}

function EditableSelect({ label, value, options, onSave, displayValue }: { label: string; value: string; options: { value: string; label: string }[]; onSave: (v: string) => void; displayValue?: string }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex justify-between py-1 border-b border-border">
      <span className="text-text-muted">{label}</span>
      {editing ? (
        <select
          autoFocus
          className="text-xs border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200 max-w-[220px]"
          value={value}
          onChange={e => { onSave(e.target.value); setEditing(false) }}
          onBlur={() => setEditing(false)}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <span
          className="text-text-primary cursor-pointer hover:text-brand-600 transition-colors text-right max-w-[60%] truncate"
          onClick={() => setEditing(true)}
          title="Click to edit"
        >
          {displayValue ?? options.find(o => o.value === value)?.label ?? value}
        </span>
      )}
    </div>
  )
}

function EditableSection({ label, value, onSave, placeholder = 'Click to add...' }: { label: string; value: string; onSave: (v: string) => void; placeholder?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{label}</h3>
      {editing ? (
        <textarea
          autoFocus
          className="w-full text-sm text-text-secondary bg-white border border-brand-300 rounded-lg p-3 outline-none ring-1 ring-brand-200 resize-y min-h-[80px]"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { setEditing(false); if (draft !== value) onSave(draft) }}
          onKeyDown={e => {
            if (e.key === 'Escape') { setEditing(false); setDraft(value) }
            if (e.key === 'Enter' && e.metaKey) { e.currentTarget.blur() }
          }}
        />
      ) : (
        <p
          className="text-sm text-text-secondary bg-surface-muted rounded-lg p-3 cursor-pointer hover:bg-brand-50 hover:text-brand-700 transition-colors min-h-[40px]"
          onClick={() => { setDraft(value); setEditing(true) }}
          title="Click to edit"
        >
          {value || <span className="text-text-muted italic">{placeholder}</span>}
        </p>
      )}
    </div>
  )
}

// ── Tasks Section with inline editing ──

function TasksSection({ tasks, dealId, onUpdateTask, onCreateTask }: {
  tasks: ReturnType<ReturnType<typeof useData>['getTasksForDeal']>
  dealId: string
  onUpdateTask: (id: string, updates: any) => Promise<void>
  onCreateTask: (task: any) => Promise<any>
}) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = useCallback(async () => {
    if (!newTitle.trim()) return
    await onCreateTask({
      title: newTitle.trim(),
      status: 'To Do' as TaskStatus,
      priority: 'Normal' as TaskPriority,
      assignee: 'justin' as const,
      dealId,
      createdBy: 'justin' as const,
    })
    setNewTitle('')
    setAdding(false)
  }, [newTitle, dealId, onCreateTask])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Tasks ({tasks.length})</h3>
        <button
          onClick={() => setAdding(true)}
          className="text-[10px] text-brand-600 hover:text-brand-700 font-medium"
        >
          + Add Task
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map(t => (
          <EditableTaskCard key={t.id} task={t} onUpdate={onUpdateTask} />
        ))}
        {adding && (
          <div className="bg-white border-2 border-brand-300 rounded-lg p-3">
            <input
              autoFocus
              className="w-full text-sm font-medium text-text-primary outline-none placeholder-text-muted"
              placeholder="Task title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') { setAdding(false); setNewTitle('') }
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleAdd} className="text-xs bg-brand-500 text-white px-2.5 py-1 rounded-md hover:bg-brand-600">Save</button>
              <button onClick={() => { setAdding(false); setNewTitle('') }} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
            </div>
          </div>
        )}
        {tasks.length === 0 && !adding && (
          <p className="text-xs text-text-muted italic">No tasks yet</p>
        )}
      </div>
    </div>
  )
}

function EditableTaskCard({ task: t, onUpdate }: { task: any; onUpdate: (id: string, updates: any) => Promise<void> }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(t.title)
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState(t.description || '')

  const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Waiting', 'Done', 'Cancelled']
  const priorityOptions: TaskPriority[] = ['Urgent', 'High', 'Normal', 'Low']
  const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done' && t.status !== 'Cancelled'

  return (
    <div className="bg-surface-muted rounded-lg p-3">
      <div className="flex items-start justify-between mb-1">
        {editingTitle ? (
          <input
            autoFocus
            className="text-sm font-medium text-text-primary flex-1 bg-white border border-brand-300 rounded px-1.5 py-0.5 outline-none ring-1 ring-brand-200"
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={() => { setEditingTitle(false); if (titleDraft !== t.title) onUpdate(t.id, { title: titleDraft }) }}
            onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setEditingTitle(false); setTitleDraft(t.title) } }}
          />
        ) : (
          <p
            className="text-sm font-medium text-text-primary flex-1 cursor-pointer hover:text-brand-600"
            onClick={() => { setTitleDraft(t.title); setEditingTitle(true) }}
          >
            {t.title}
          </p>
        )}
        <select
          className="text-[10px] ml-2 bg-transparent border-none outline-none cursor-pointer"
          value={t.priority}
          onChange={e => onUpdate(t.id, { priority: e.target.value })}
        >
          {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <select
          className="text-[10px] bg-transparent border-none outline-none cursor-pointer font-medium"
          value={t.status}
          onChange={e => onUpdate(t.id, { status: e.target.value })}
        >
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-text-muted capitalize">{t.assignee}</span>
        <input
          type="date"
          className={`text-[10px] bg-transparent border-none outline-none cursor-pointer ${overdue ? 'text-red-500 font-medium' : 'text-text-muted'}`}
          value={t.dueDate || ''}
          onChange={e => onUpdate(t.id, { dueDate: e.target.value || undefined })}
        />
      </div>
      {editingDesc ? (
        <textarea
          autoFocus
          className="w-full text-xs text-text-muted mt-1.5 bg-white border border-brand-300 rounded p-1.5 outline-none ring-1 ring-brand-200 resize-y min-h-[40px]"
          value={descDraft}
          onChange={e => setDescDraft(e.target.value)}
          onBlur={() => { setEditingDesc(false); if (descDraft !== (t.description || '')) onUpdate(t.id, { description: descDraft }) }}
          onKeyDown={e => { if (e.key === 'Escape') { setEditingDesc(false); setDescDraft(t.description || '') }; if (e.key === 'Enter' && e.metaKey) e.currentTarget.blur() }}
        />
      ) : (
        <p
          className="text-xs text-text-muted mt-1.5 cursor-pointer hover:text-brand-600"
          onClick={() => { setDescDraft(t.description || ''); setEditingDesc(true) }}
        >
          {t.description || <span className="italic">Add description...</span>}
        </p>
      )}
    </div>
  )
}

function DocumentsSection({ dealId }: { dealId: string }) {
  const { uploadFile, attachUrl, deleteAttachment, extractText, getAttachmentsForDeal, getDeal } = useData()
  const docs = getAttachmentsForDeal(dealId)
  const deal = getDeal(dealId)
  const companyId = deal?.companyId

  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState<'file' | 'url'>('file')
  const [fileType, setFileType] = useState<AttachmentType>('brief')
  const [description, setDescription] = useState('')
  const [urlValue, setUrlValue] = useState('')
  const [urlName, setUrlName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [viewingDoc, setViewingDoc] = useState<Attachment | null>(null)
  const fileInputId = `doc-upload-${dealId}`

  const resetForm = () => {
    setShowForm(false)
    setMode('file')
    setFileType('brief')
    setDescription('')
    setUrlValue('')
    setUrlName('')
    setError(null)
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    setProgress(0)
    const result = await uploadFile(file, dealId, fileType, companyId, (pct) => setProgress(pct), description || undefined)
    if (!result) setError('Upload failed.')
    else resetForm()
    setUploading(false)
  }, [dealId, fileType, companyId, description, uploadFile])

  const handleUrlAttach = useCallback(async () => {
    if (!urlValue.trim()) { setError('URL is required'); return }
    const name = urlName.trim() || urlValue.replace(/^https?:\/\//, '').slice(0, 60)
    setUploading(true)
    setError(null)
    const result = await attachUrl(urlValue.trim(), dealId, fileType, name, description || undefined, companyId)
    if (!result) setError('Failed to attach URL.')
    else resetForm()
    setUploading(false)
  }, [dealId, fileType, companyId, description, urlValue, urlName, attachUrl])

  const formatSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Documents</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-[11px] text-brand-600 hover:text-brand-700 font-medium"
          >
            + Add
          </button>
        )}
      </div>

      {/* Existing documents list */}
      {docs.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {docs.map(doc => (
            <DocumentRow key={doc.id} doc={doc} onDelete={() => deleteAttachment(doc)} onClick={() => setViewingDoc(doc)} formatSize={formatSize} />
          ))}
        </div>
      )}

      {docs.length === 0 && !showForm && (
        <p className="text-[11px] text-text-muted italic mb-3">No documents yet</p>
      )}

      {/* Add document form */}
      {showForm && (
        <div className="border border-border rounded-lg p-3 space-y-2.5 bg-surface-muted">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-white rounded-md p-0.5 border border-border">
            <button
              onClick={() => setMode('file')}
              className={`flex-1 text-[11px] py-1 rounded ${mode === 'file' ? 'bg-brand-600 text-white' : 'text-text-muted hover:text-text-primary'}`}
            >
              Upload File
            </button>
            <button
              onClick={() => setMode('url')}
              className={`flex-1 text-[11px] py-1 rounded ${mode === 'url' ? 'bg-brand-600 text-white' : 'text-text-muted hover:text-text-primary'}`}
            >
              Attach URL
            </button>
          </div>

          {/* Type selector */}
          <select
            value={fileType}
            onChange={e => setFileType(e.target.value as AttachmentType)}
            className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-text-primary"
          >
            {(Object.entries(ATTACHMENT_TYPE_META) as [AttachmentType, { label: string; icon: string }][]).map(([key, meta]) => (
              <option key={key} value={key}>{meta.icon} {meta.label}</option>
            ))}
          </select>

          {/* Description */}
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-text-primary placeholder:text-text-muted"
          />

          {mode === 'file' ? (
            /* File upload area */
            uploading ? (
              <div className="border border-brand-300 bg-brand-50 rounded-lg p-3 text-center">
                <div className="w-full bg-brand-100 rounded-full h-1.5">
                  <div className="bg-brand-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-brand-600 mt-1">Uploading... {progress}%</p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-300'
                }`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0])
                }}
                onClick={() => document.getElementById(fileInputId)?.click()}
              >
                <input
                  id={fileInputId}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.md,.csv"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                    e.target.value = ''
                  }}
                />
                <p className="text-xs text-text-muted">Drop file or click to upload</p>
              </div>
            )
          ) : (
            /* URL input */
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://..."
                value={urlValue}
                onChange={e => setUrlValue(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-text-primary placeholder:text-text-muted"
              />
              <input
                type="text"
                placeholder="Display name (optional)"
                value={urlName}
                onChange={e => setUrlName(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-text-primary placeholder:text-text-muted"
              />
              <button
                onClick={handleUrlAttach}
                disabled={uploading || !urlValue.trim()}
                className="w-full text-xs font-medium py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
              >
                Attach URL
              </button>
            </div>
          )}

          {error && <p className="text-[10px] text-red-500">{error}</p>}

          <button onClick={resetForm} className="text-[11px] text-text-muted hover:text-text-primary w-full text-center">
            Cancel
          </button>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewer
          doc={viewingDoc}
          onClose={() => setViewingDoc(null)}
          onExtract={() => extractText(viewingDoc)}
        />
      )}
    </div>
  )
}

function DocumentRow({ doc, onDelete, onClick, formatSize }: { doc: Attachment; onDelete: () => void; onClick: () => void; formatSize: (b?: number) => string }) {
  const meta = ATTACHMENT_TYPE_META[doc.fileType] ?? ATTACHMENT_TYPE_META.other
  const isUrl = doc.sourceType === 'url' || (!doc.storagePath && !!doc.publicUrl)
  const hasExtraction = doc.extractionStatus === 'done'

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white group hover:border-brand-200 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <span className="text-base flex-shrink-0">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-brand-600 hover:text-brand-700 truncate" title={doc.fileName}>
            {doc.fileName}
          </span>
          {isUrl && <span className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded flex-shrink-0">URL</span>}
          {hasExtraction && <span className="text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded flex-shrink-0">Extracted</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-text-muted">{meta.label}</span>
          {doc.fileSize ? <span className="text-[10px] text-text-muted">{formatSize(doc.fileSize)}</span> : null}
          {doc.description && <span className="text-[10px] text-text-muted truncate" title={doc.description}>- {doc.description}</span>}
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 text-xs p-1 rounded hover:bg-red-50 flex-shrink-0"
        title="Remove"
      >
        &times;
      </button>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-1 border-b border-border last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={accent ? 'text-brand-600 font-medium' : 'text-text-primary'}>{value}</span>
    </div>
  )
}
