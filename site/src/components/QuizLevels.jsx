import React, { useState } from 'react'
import { Lock, ChevronDown, ChevronUp, BookOpen, Cpu, Youtube, ExternalLink, X, ChevronRight } from 'lucide-react'
import Quiz from './Quiz'
import { useProgress } from '../hooks/useProgress'
import { QUIZZES } from '../data/quizzes'
import { DEEP_DIVE } from '../data/deepDive'

const LEVEL_META = [
  {
    level: 1,
    label: 'Level 1 — Foundations',
    description: 'Core concepts and protocol mechanics. Pass (≥70%) to unlock Level 2.',
    headerBg: 'bg-navy-700',
    accentText: 'text-mcyan-400',
    borderColor: 'border-navy-200',
    activeBorder: 'border-navy-700',
    emoji: '📘',
  },
  {
    level: 2,
    label: 'Level 2 — Applied & Edge Cases',
    description: 'Failure modes, calculations, and real-world edge cases. Pass to unlock Level 3.',
    headerBg: 'bg-slate-800',
    accentText: 'text-amber-400',
    borderColor: 'border-slate-200',
    activeBorder: 'border-slate-700',
    emoji: '📙',
  },
  {
    level: 3,
    label: 'Level 3 — Graduate',
    description: 'Textbook-depth. Questions cite chapter and page. AI applications included.',
    headerBg: 'bg-[#0d0d14]',
    accentText: 'text-orange-400',
    borderColor: 'border-slate-200',
    activeBorder: 'border-slate-900',
    emoji: '📕',
  },
]

// Slide-out drawer for deep-dive resources
function ResourceDrawer({ resources, level, onClose }) {
  const [expandedExcerpt, setExpandedExcerpt] = useState(null)
  const isL3 = level === 3
  const bg = isL3 ? 'bg-[#0d0d14]' : level === 2 ? 'bg-slate-900' : 'bg-navy-700'
  const accent = isL3 ? 'text-orange-400' : level === 2 ? 'text-amber-400' : 'text-mcyan-400'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className={`${bg} px-4 py-4 flex items-center justify-between flex-shrink-0`}>
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest ${accent}`}>Dig Deeper</div>
            <div className="text-white font-semibold text-sm mt-0.5">Level {level} Resources</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white p-4 space-y-3">
          {(!resources || resources.length === 0) && (
            <p className="text-slate-400 text-sm text-center py-8">Resources coming soon.</p>
          )}
          {resources?.map((r, i) => (
            <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
              {r.type === 'youtube' && (
                <a
                  href={r.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 hover:bg-red-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Youtube size={18} className="text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wide">YouTube</div>
                    <div className="text-sm text-slate-700 font-medium leading-tight truncate group-hover:text-red-700">{r.title}</div>
                  </div>
                  <ExternalLink size={14} className="text-slate-300 flex-shrink-0" />
                </a>
              )}
              {r.type === 'doc' && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">Documentation</div>
                    <div className="text-sm text-slate-700 font-medium leading-tight">{r.title}</div>
                  </div>
                  <ExternalLink size={14} className="text-slate-300 flex-shrink-0" />
                </a>
              )}
              {r.type === 'book' && (
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">Textbook</div>
                      <div className="text-sm text-slate-700 font-semibold leading-tight">{r.title}</div>
                    </div>
                  </div>
                  <div className="mt-2 ml-12 text-xs text-slate-500">
                    {r.chapter}
                    {r.page && <span className="ml-1 text-orange-500 font-medium">· p. {r.page}</span>}
                  </div>
                </div>
              )}
              {r.type === 'whitepaper' && (
                <div>
                  <button
                    onClick={() => setExpandedExcerpt(expandedExcerpt === i ? null : i)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-bold text-purple-600 uppercase tracking-wide">White Paper / Journal</div>
                      <div className="text-sm text-slate-700 font-medium leading-tight">{r.title}</div>
                    </div>
                    {expandedExcerpt === i
                      ? <ChevronUp size={14} className="text-slate-400 flex-shrink-0" />
                      : <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  {expandedExcerpt === i && (
                    <div className="border-t border-purple-100 p-3 bg-purple-50">
                      {r.excerpt && (
                        <p className="text-xs text-slate-600 leading-relaxed italic mb-2">"{r.excerpt}"</p>
                      )}
                      {r.citation && (
                        <p className="text-xs text-purple-600 font-medium">{r.citation}</p>
                      )}
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                        >
                          Read full paper <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
              {r.type === 'dataset' && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 hover:bg-green-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cpu size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-green-600 uppercase tracking-wide">Dataset / AI Resource</div>
                    <div className="text-sm text-slate-700 font-medium leading-tight">{r.title}</div>
                    {r.description && <div className="text-xs text-slate-400 mt-0.5 leading-tight">{r.description}</div>}
                  </div>
                  <ExternalLink size={14} className="text-slate-300 flex-shrink-0" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function LevelCard({ meta, questions, chapterId, locked, passed }) {
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { level, label, description, headerBg, accentText, borderColor, activeBorder, emoji } = meta

  const resources = DEEP_DIVE[chapterId]?.[`level${level}`] || []

  return (
    <>
      <div className={`border-2 ${open ? activeBorder : borderColor} rounded-2xl overflow-hidden transition-colors`}>
        <button
          onClick={() => !locked && setOpen((o) => !o)}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
            locked ? 'opacity-60 cursor-not-allowed bg-white' :
            open ? `${headerBg}` : 'bg-white hover:bg-slate-50'
          }`}
        >
          <span className="text-lg leading-none flex-shrink-0">{locked ? '🔒' : passed ? '✅' : emoji}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm ${open ? 'text-white' : 'text-slate-800'}`}>{label}</div>
            <div className={`text-xs mt-0.5 leading-snug ${open ? accentText : 'text-slate-500'}`}>{description}</div>
          </div>
          {!locked && (
            open
              ? <ChevronUp size={18} className="text-white flex-shrink-0" />
              : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
          )}
          {locked && <Lock size={14} className="text-slate-400 flex-shrink-0" />}
        </button>

        {!locked && open && (
          <div className="border-t border-slate-100">
            {/* Passed banner */}
            {passed && resources.length > 0 && (
              <div className={`px-4 py-2 flex items-center justify-between ${
                level === 3 ? 'bg-orange-50' : level === 2 ? 'bg-amber-50' : 'bg-green-50'
              }`}>
                <span className="text-xs text-slate-600 font-medium">
                  ✅ Level {level} passed
                </span>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white ${
                    level === 3 ? 'bg-orange-600' : level === 2 ? 'bg-amber-600' : 'bg-mblue-600'
                  }`}
                >
                  Dig Deeper
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            <div className="p-4">
              {questions && questions.length > 0 ? (
                <Quiz chapterId={chapterId} questions={questions} level={level} />
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  <div className="text-3xl mb-2">🚧</div>
                  <div className="font-medium">Level {level} questions are being prepared.</div>
                  <div className="text-xs mt-1">Check back soon.</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {drawerOpen && (
        <ResourceDrawer
          resources={resources}
          level={level}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  )
}

export default function QuizLevels({ chapterId }) {
  const { getChapterStatus } = useProgress()
  const status = getChapterStatus(chapterId)
  const data = QUIZZES[chapterId]

  if (!data) return null

  const isLegacy = Array.isArray(data)
  const levels = {
    level1: isLegacy ? data : (data.level1 || []),
    level2: isLegacy ? [] : (data.level2 || []),
    level3: isLegacy ? [] : (data.level3?.questions || []),
  }

  const locked = [
    false,
    !status.level1Passed,
    !status.level2Passed,
  ]

  const passed = [
    status.level1Passed,
    status.level2Passed,
    status.level3Passed,
  ]

  return (
    <div className="my-8 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Knowledge Levels</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {LEVEL_META.map((meta, i) => (
        <LevelCard
          key={meta.level}
          meta={meta}
          questions={levels[`level${meta.level}`]}
          chapterId={chapterId}
          locked={locked[i]}
          passed={passed[i]}
        />
      ))}
    </div>
  )
}
