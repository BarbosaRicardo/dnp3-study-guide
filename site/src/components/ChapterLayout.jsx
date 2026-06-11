import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BookOpen, Home, Database, Binary, Cpu, Radio, FileText, Globe, Settings, AlertTriangle, Wrench, Shield, FlaskConical, Clock, HelpCircle, ChevronDown } from 'lucide-react'
import { CHAPTERS, CHAPTER_HOOKS, CHAPTER_RETRIEVAL } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'
import MatrixBadge from './MatrixBadge'

const READ_TIME = {
  intro: 12, layers: 10, datalink: 12, appLayer: 14,
  objects: 12, fc: 10, unsol: 10, security: 12,
  troubleshoot: 12, lab: 20,
}

const CHAPTER_STAKES = {
  intro:        'DNP3 is the protocol utilities actually use. Understanding it is what separates SCADA engineers from operators who just watch screens.',
  layers:       'The protocol stack is not trivia. Every field failure traces to a specific layer. Know which layer is broken before you touch anything.',
  datalink:     'The data link layer is where frames live or die. A bad CRC here and the outstation ignores you silently — no error, just silence.',
  appLayer:     'The application layer is what you actually read and write. Miss a bit in the fragment sequence and your data model falls apart.',
  objects:      'Group and Variation determine what wire format a value takes. Get this wrong and you read voltage as status or vice versa.',
  fc:           'Function codes are the verbs of DNP3. Miss one and you issue a read when you meant to select, or a select when you meant to operate.',
  unsol:        'Unsolicited responses are why DNP3 beats Modbus in real-time utility SCADA. Miss this and you are back to polling 500 substations one at a time.',
  security:     'SA v5 is not optional in critical infrastructure anymore. Engineers who understand it are the ones NERC CIP compliance teams call at 2 AM.',
  troubleshoot: 'A DNP3 engineer who can diagnose silently-dropped events and CRC failures faster than the vendor can becomes irreplaceable.',
  lab:          'You can read DNP3 specs for a week and still be lost on the first real capture. This session is where it becomes permanent.',
}

const ICON_MAP = {
  Home, BookOpen, Database, Binary, Cpu, Radio, FileText, Globe, Settings, AlertTriangle, Wrench, Shield, FlaskConical,
}

function ChapterBattery({ status, nextChapter }) {
  const cells = [
    { key: 'level1Passed', label: 'L1' },
    { key: 'level2Passed', label: 'L2' },
    { key: 'level3Passed', label: 'L3' },
    { key: 'level4Passed', label: 'Field' },
  ]
  const filled = cells.filter((c) => status[c.key]).length
  const isComplete = filled === 4

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      {/* Battery body */}
      <div className="flex items-center gap-0">
        {/* Main battery rectangle */}
        <div
          className="relative flex rounded-xl overflow-hidden"
          style={{
            width: 260,
            height: 52,
            border: isComplete ? '1.5px solid rgba(74,222,128,0.6)' : '1.5px solid rgba(255,255,255,0.14)',
            boxShadow: isComplete ? '0 0 18px rgba(74,222,128,0.3)' : 'none',
            background: 'rgba(0,0,0,0.35)',
            transition: 'all 0.5s ease',
          }}
        >
          {/* 4 cells */}
          {cells.map((cell, i) => (
            <div
              key={cell.key}
              className="flex-1 flex items-center justify-center relative"
              style={{
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                background: status[cell.key] ? 'rgba(74,222,128,0.28)' : 'transparent',
                transition: 'background 0.4s ease',
              }}
            >
              {!isComplete && (
                <span
                  className="text-xs font-bold"
                  style={{
                    color: status[cell.key] ? '#86efac' : 'rgba(255,255,255,0.18)',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {cell.label}
                </span>
              )}
            </div>
          ))}

          {/* Left-to-right charging sweep — clipped to filled zone only */}
          {filled > 0 && !isComplete && (
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${(filled / 4) * 100}%`, zIndex: 10 }}
            >
              <motion.div
                className="absolute inset-y-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.6) 50%, transparent 100%)',
                  width: '50%',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
              />
            </div>
          )}

          {/* Completed: full green pulse + label */}
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{
                background: [
                  'rgba(74,222,128,0.18)',
                  'rgba(74,222,128,0.38)',
                  'rgba(74,222,128,0.18)',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ zIndex: 10 }}
            >
              <span
                className="text-xs font-black tracking-widest uppercase"
                style={{
                  color: '#4ade80',
                  letterSpacing: '0.18em',
                  textShadow: '0 0 12px rgba(74,222,128,0.7)',
                }}
              >
                ✓ Completed
              </span>
            </motion.div>
          )}
        </div>

        {/* Battery nub */}
        <div
          className="rounded-r-md"
          style={{
            width: 8,
            height: 22,
            background: isComplete ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.12)',
            marginLeft: 2,
            transition: 'background 0.5s ease',
          }}
        />
      </div>

      {/* Next Up card — shown when complete */}
      {isComplete && nextChapter && (
        <Link
          to={nextChapter.path}
          className="flex items-center gap-3 w-full max-w-sm px-5 py-4 rounded-2xl transition-all hover:scale-[1.02] mt-2"
          style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          <div className="flex-1">
            <div className="text-xs mb-0.5" style={{ color: 'rgba(74,222,128,0.6)' }}>Next Up</div>
            <div className="font-bold text-white text-sm">{nextChapter.label}</div>
          </div>
          <ChevronRight size={18} style={{ color: 'rgba(74,222,128,0.6)' }} />
        </Link>
      )}
    </div>
  )
}

export default function ChapterLayout({ chapterId, title, children, prev, next }) {
  const { markChapterVisited, markChapterComplete, getChapterStatus } = useProgress()
  const navigate = useNavigate()
  const status = getChapterStatus(chapterId)
  const [retrievalChapter, setRetrievalChapter] = useState(null)
  const [retrievalRevealed, setRetrievalRevealed] = useState(false)

  const chapter = CHAPTERS.find((c) => c.id === chapterId)
  const ChIcon = ICON_MAP[chapter?.icon] || BookOpen
  const prevChapter = prev ? CHAPTERS.find((c) => c.id === prev) : null
  const nextChapter = next ? CHAPTERS.find((c) => c.id === next) : null

  useEffect(() => {
    markChapterVisited(chapterId)
    localStorage.setItem(`ch_visited_${chapterId}`, String(Date.now()))

    // Spaced retrieval: find a chapter visited 5+ days ago and surface a retrieval prompt
    const fiveDaysMs = 5 * 86400000
    const now = Date.now()
    const stale = CHAPTERS.filter(c => c.id !== 'home' && c.id !== chapterId && CHAPTER_RETRIEVAL[c.id]).filter(c => {
      const ts = parseInt(localStorage.getItem(`ch_visited_${c.id}`) || '0', 10)
      return ts > 0 && (now - ts) >= fiveDaysMs
    })
    if (stale.length > 0) {
      setRetrievalChapter(stale[Math.floor(Math.random() * stale.length)])
    }

    window.scrollTo(0, 0)
  }, [chapterId])

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      if (e.key === 'ArrowLeft' && prevChapter) navigate(prevChapter.path)
      if (e.key === 'ArrowRight' && nextChapter) navigate(nextChapter.path)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prevChapter, nextChapter])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl mx-auto py-8 px-4 pb-24"
      >
        {/* Chapter header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium mb-3" style={{ color: 'rgba(45,212,191,0.7)' }}>
            <span>SCADA Training</span>
            <span className="text-slate-600">›</span>
            <span className="text-slate-500">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(0,210,160,0.2), rgba(6,182,212,0.15))', border: '1px solid rgba(0,210,160,0.3)' }}>
              <ChIcon size={28} style={{ color: '#2dd4bf' }} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight">{title}</h1>
              {READ_TIME[chapterId] && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={11} style={{ color: 'rgba(45,212,191,0.5)' }} />
                  <span className="text-xs" style={{ color: 'rgba(45,212,191,0.5)' }}>~{READ_TIME[chapterId]} min read</span>
                </div>
              )}
            </div>
          </div>
          {CHAPTER_STAKES[chapterId] && (
            <p className="mt-3 text-sm italic leading-relaxed" style={{ color: 'rgba(45,212,191,0.55)' }}>
              {CHAPTER_STAKES[chapterId]}
            </p>
          )}
          <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,210,160,0.7), rgba(6,182,212,0.4), transparent)' }} />
        </div>

        {/* Company skills-matrix coverage — the survey material this chapter teaches */}
        <MatrixBadge chapterId={chapterId} />

        {/* Spaced retrieval banner — only when a chapter was visited 5+ days ago */}
        {retrievalChapter && CHAPTER_RETRIEVAL[retrievalChapter.id] && (
          <div className="rounded-xl p-4 mb-2" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={13} style={{ color: '#a78bfa' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                Retrieval Check — {retrievalChapter.label}
              </span>
              <span className="text-xs" style={{ color: 'rgba(167,139,250,0.5)' }}>It's been a while</span>
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-2">{CHAPTER_RETRIEVAL[retrievalChapter.id].q}</p>
            <AnimatePresence>
              {retrievalRevealed ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm font-mono"
                  style={{ color: '#4ade80' }}
                >
                  {CHAPTER_RETRIEVAL[retrievalChapter.id].a}
                </motion.p>
              ) : (
                <button
                  onClick={() => setRetrievalRevealed(true)}
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: 'rgba(167,139,250,0.7)' }}
                >
                  <ChevronDown size={12} /> Reveal answer
                </button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Opening hook — question before content */}
        {CHAPTER_HOOKS[chapterId] && (
          <div className="rounded-xl p-4 mb-2" style={{ background: 'rgba(45,212,191,0.05)', border: '1px solid rgba(45,212,191,0.15)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <HelpCircle size={13} style={{ color: 'rgba(45,212,191,0.6)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(45,212,191,0.5)' }}>Think First</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(45,212,191,0.75)' }}>{CHAPTER_HOOKS[chapterId]}</p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6 text-slate-300 leading-relaxed">
          {children}
        </div>

        {/* Battery completion widget */}
        <ChapterBattery status={status} nextChapter={nextChapter} />

      </motion.div>

      {/* Sticky bottom nav bar */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 flex items-center justify-between px-4 h-14"
        style={{ background: 'rgba(8,8,18,0.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {prevChapter ? (
          <Link
            to={prevChapter.path}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors group"
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform flex-shrink-0" />
            <span className="hidden sm:block truncate max-w-[160px]">{prevChapter.label}</span>
            <span className="sm:hidden">Prev</span>
          </Link>
        ) : <div />}

        <div className="text-xs font-medium text-slate-600 truncate mx-3 text-center flex-1">{title}</div>

        {nextChapter ? (
          <Link
            to={nextChapter.path}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors text-right group"
          >
            <span className="hidden sm:block truncate max-w-[160px]">{nextChapter.label}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </Link>
        ) : <div />}
      </div>
    </>
  )
}
