import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, Award, Clock, ArrowRight, Radio, Home as HomeIcon, Layers, Link as LinkIcon, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical, Factory, DollarSign, Ruler, Droplets, Flame, Map, CheckCircle2, Circle } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { CHAPTERS } from '../data/chapters'
import GifCard from '../components/GifCard'
import TrainingPanel from '../components/TrainingPanel'

const COMMIT_KEY = 'dnp3_committed'
const LAST_VISIT_KEY = 'dnp3_last_visit'
const BANNER_SHOWN_KEY = 'dnp3_banner_shown'

function getFreshStartMessage() {
  const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0', 10)
  const lastBanner = parseInt(localStorage.getItem(BANNER_SHOWN_KEY) || '0', 10)
  const now = Date.now()
  const daysSince = (now - lastVisit) / 86400000
  const hoursSinceBanner = (now - lastBanner) / 3600000
  if (hoursSinceBanner < 48) return null
  const d = new Date()
  const isMonday = d.getDay() === 1
  const isFirstOfMonth = d.getDate() === 1
  if (daysSince >= 5 || isMonday || isFirstOfMonth) {
    localStorage.setItem(BANNER_SHOWN_KEY, String(now))
    if (isMonday) return "New week — engineers who study consistently master protocols 3× faster."
    if (isFirstOfMonth) return "New month, fresh start — what will you finish before it ends?"
    return "Welcome back — pick up where you left off. Your DNP3 progress is exactly where you left it."
  }
  return null
}

const STATS = [
  { icon: BookOpen, label: '10 Chapters', sub: 'From zero to hero' },
  { icon: Zap, label: '30+ Quizzes', sub: 'Test yourself' },
  { icon: Clock, label: '~5 Hours', sub: 'Total study time' },
  { icon: Award, label: 'SCADA Ready', sub: 'Utility & water SCADA' },
]

const ICON_MAP = {
  Home: HomeIcon, Radio, Layers, Link: LinkIcon, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical,
}

const HERO_OPTIONS = [
  { id: 'MdPZFGgDL3PC8',        caption: `When Class 1 events back up and nobody is polling.`,             tooltip: `DNP3 event classes define polling priority. Class 1 is highest. If the master stops polling, the outstation event buffer fills and old events get silently dropped. DNP3 doesn't complain — it just forgets. Your historian will never know that breaker tripped.` },
  { id: '3o7qE4opCd6f1NJeuY',   caption: `Select-Before-Operate. DNP3 makes you commit twice.`,           tooltip: `DNP3 requires two messages to execute a control: SELECT confirms intent, OPERATE executes. A single bit flip or race condition can't accidentally open a breaker. This wasn't paranoia — it was written after a real substation incident involving a mis-addressed control.` },
  { id: 'feqkVgjJpYtjy',        caption: `IIN1.6: Device Restart detected. Time sync required.`,          tooltip: `Every DNP3 response carries 16 IIN health flags. IIN1.6 means the device just rebooted. Any data from before the restart may be stale. Miss this flag and your historian timestamps wrong values, silently, until someone notices the SCADA screen is wrong.` },
  { id: 'XIqCQx02E1U9W',        caption: `48-bit millisecond UTC timestamps. DNP3 doesn't forget.`,       tooltip: `DNP3 timestamps have 48-bit millisecond precision — enough to represent dates until the year 10889. After Y2K, the engineers who wrote this standard decided they weren't getting caught with an overflow problem again. Reasonable, honestly.` },
  { id: 'l46Cy1rHbQ92uuLXa',    caption: `RS-485, TCP/IP, fiber, radio — DNP3 runs on all of it.`,       tooltip: `DNP3 was designed in 1993 for RS-485 serial. The same application-layer frame format now runs on TCP/IP, fiber, radio, and power-line carrier. Same protocol, different transport. This is what protocol independence looks like in practice.` },
]
export default function Home() {
  const { overallProgress, getChapterStatus, reset } = useProgress()
  const [heroIdx] = useState(() => Math.floor(Math.random() * HERO_OPTIONS.length))
  const [committed, setCommitted] = useState(() => !!localStorage.getItem(COMMIT_KEY))
  const [freshMsg] = useState(() => getFreshStartMessage())
  const [streak] = useState(() => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const lastDate = localStorage.getItem('dnp3_streak_date') || ''
      const cur = parseInt(localStorage.getItem('dnp3_streak') || '0', 10)
      if (lastDate === today) return cur
      const next = lastDate === yesterday ? cur + 1 : 1
      localStorage.setItem('dnp3_streak', String(next))
      localStorage.setItem('dnp3_streak_date', today)
      return next
    } catch { return 1 }
  })
  const prog = overallProgress()

  // Track last visit for Fresh Start Effect
  useState(() => { localStorage.setItem(LAST_VISIT_KEY, String(Date.now())) })

  const chaptersOnly = CHAPTERS.filter(c => c.id !== 'home')

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  function handleCommit() {
    localStorage.setItem(COMMIT_KEY, '1')
    setCommitted(true)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto py-10 px-4 space-y-10"
    >
      {/* Fresh Start Effect banner */}
      {freshMsg && (
        <motion.div variants={item}
          className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <span style={{ color: '#fbbf24' }}>↺</span>
          <span style={{ color: 'rgba(245,158,11,0.8)' }}>{freshMsg}</span>
        </motion.div>
      )}

      {/* Hero */}
      <motion.div variants={item} className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-amber-400 leading-tight mb-4">
              DNP3 Protocol<br />
              <span className="text-amber-400">Made Simple.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              The protocol that utilities actually use — event-driven, timestamp-aware,
              and approximately 300% more complicated than Modbus for good reason.
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/intro" className="btn-primary flex items-center gap-2">
                {prog.visited > 0 ? 'Continue Learning' : 'Start Learning'} <ArrowRight size={16} />
              </Link>
              {prog.pct > 0 && (
                <Link to="/lab" className="btn-secondary">
                  Practice Lab
                </Link>
              )}
            </div>

            {!committed && prog.visited === 0 && (
              <button
                onClick={handleCommit}
                className="mt-4 flex items-center gap-2 text-sm transition-all hover:opacity-90"
                style={{ color: 'rgba(245,158,11,0.6)' }}
              >
                <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: 'rgba(245,158,11,0.4)' }} />
                I commit to finishing this course
              </button>
            )}
            {committed && prog.visited === 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'rgba(245,158,11,0.55)' }}>
                <CheckCircle2 size={14} style={{ color: '#fbbf24' }} />
                <span>Committed. Chapter 1 is waiting.</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <GifCard gifId={HERO_OPTIONS[heroIdx].id} caption={HERO_OPTIONS[heroIdx].caption} tooltip={HERO_OPTIONS[heroIdx].tooltip} side="right" />
          </div>
        </div>
      </motion.div>

      {/* Progress — always shown */}
      <motion.div variants={item} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {streak > 1 && (
          <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>🔥</span>
            <span className="font-bold text-sm" style={{ color: '#f97316' }}>{streak}-day streak</span>
            <span className="text-xs" style={{ color: 'rgba(249,115,22,0.45)' }}>
              {streak >= 7 ? '— elite consistency' : streak >= 3 ? '— keep the chain going' : "— don't break it"}
            </span>
          </div>
        )}
        {prog.visited === 0 ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200 mb-1">Your Learning Journey</div>
              <div className="text-sm text-slate-500">10 chapters · ~5 hours · starts with one click</div>
            </div>
            <Link to="/intro" className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
              Begin Ch 1 <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-100">
                {prog.pct >= 80 ? 'Almost there — keep going' : prog.pct >= 40 ? "Good momentum — don't stop now" : "You've started — finish what you started"}
              </h3>
              <button onClick={reset} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Reset</button>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                initial={{ width: 0 }}
                animate={{ width: `${prog.pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{prog.visited}/{prog.total} chapters read</span>
              <span className="font-bold text-amber-400">{prog.pct}% complete</span>
              <span className="text-slate-500">{prog.quizzes}/{prog.total} quizzes passed</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="card text-center">
            <div className="w-10 h-10 bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <s.icon size={20} className="text-amber-400" />
            </div>
            <div className="font-bold text-amber-400">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Why DNP3 */}
      <motion.div
        variants={item}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2"><Zap size={20} className="flex-shrink-0" /> Why DNP3 Matters in 2026</h2>
            <ul className="text-sm text-slate-300 space-y-1.5 list-none">
              <li className="flex items-center gap-2"><Factory size={13} className="flex-shrink-0" /> Standard protocol for electric utilities, water treatment, and oil & gas SCADA</li>
              <li className="flex items-center gap-2"><Radio size={13} className="flex-shrink-0" /> Event-driven — outstations report data as it changes, not just when polled</li>
              <li className="flex items-center gap-2"><Clock size={13} className="flex-shrink-0" /> 48-bit timestamps on every event — critical for post-incident reconstruction</li>
              <li className="flex items-center gap-2"><Shield size={13} className="flex-shrink-0" /> Secure Authentication v5 (IEC 62351-5) — built-in crypto, not bolted on</li>
              <li className="flex items-center gap-2"><DollarSign size={13} className="flex-shrink-0" /> If you work in utility SCADA, DNP3 is not optional knowledge</li>
            </ul>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-5xl font-black text-amber-400" style={{ textShadow: '0 0 24px rgba(245,158,11,0.5)' }}>IEEE</div>
            <div className="text-amber-200/60 text-sm">1815-2012</div>
<div className="text-xs text-amber-200/40 mt-1 flex items-center gap-1">The DNP3 standard <Ruler size={11} className="flex-shrink-0" /></div>
          </div>
        </div>
      </motion.div>

      {/* Chapter grid — 4-dot progress */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-400">Chapters</h2>
          {prog.visited > 0 && (
            <span className="text-xs text-slate-500">
              {chaptersOnly.filter(ch => getChapterStatus(ch.id).visited).length} of {chaptersOnly.length} visited
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chaptersOnly.map((ch) => {
            const ChIcon = ICON_MAP[ch.icon] || BookOpen
            const status = getChapterStatus(ch.id)
            const allFour = status.level1Passed && status.level2Passed && status.level3Passed && status.level4Passed
            return (
              <Link
                key={ch.id}
                to={ch.path}
                className="card flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: allFour
                      ? 'rgba(74,222,128,0.15)'
                      : status.visited
                        ? 'rgba(245,158,11,0.12)'
                        : 'rgba(245,158,11,0.06)',
                  }}>
                  <ChIcon size={20} style={{ color: allFour ? '#4ade80' : '#fbbf24' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                    {ch.label}
                  </div>
                  {status.visited && (
                    <div className="flex items-center gap-1 mt-1">
                      {[
                        { key: 'level1Passed', color: '#34d399' },
                        { key: 'level2Passed', color: '#fbbf24' },
                        { key: 'level3Passed', color: '#f87171' },
                        { key: 'level4Passed', color: '#4ade80' },
                      ].map((dot) => (
                        <div
                          key={dot.key}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: status[dot.key] ? dot.color : 'rgba(255,255,255,0.12)' }}
                        />
                      ))}
                      <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {allFour ? 'complete' : 'in progress'}
                      </span>
                    </div>
                  )}
                </div>
                {allFour
                  ? <CheckCircle2 size={16} style={{ color: '#4ade80' }} className="flex-shrink-0" />
                  : <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                }
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* More Training */}
      <motion.div variants={item}>
        <TrainingPanel course="dnp3" />
      </motion.div>

      {/* Footer motivator — loss framing when in progress */}
      <motion.div variants={item} className="text-center py-4">
        {prog.visited > 0 && prog.pct < 100 ? (
          <p className="text-slate-400 text-sm italic">
            "{chaptersOnly.length - prog.visited} chapters left to finish. Don't leave them unread."
          </p>
        ) : prog.pct === 100 ? (
          <p className="text-slate-400 text-sm italic">
            "You finished. DNP3 is the protocol that runs the grid. You now understand it better than most."
          </p>
        ) : (
          <p className="text-slate-400 text-sm italic">
            "DNP3 was designed by utilities, for utilities. It assumes you have bad comms links,
            unreliable clocks, and events that matter. Respect that and you'll be fine."
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
