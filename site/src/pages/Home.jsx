import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, Award, Clock, ArrowRight, Radio, Home as HomeIcon, Layers, Link as LinkIcon, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical, Factory, DollarSign, Ruler, Droplets, Flame, Map } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { CHAPTERS } from '../data/chapters'
import GifCard from '../components/GifCard'
import TrainingPanel from '../components/TrainingPanel'

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
  { id: '3o7TKF1fSIs1R19B8k',   caption: `Select-Before-Operate. DNP3 makes you commit twice.`,           tooltip: `DNP3 requires two messages to execute a control: SELECT confirms intent, OPERATE executes. A single bit flip or race condition can't accidentally open a breaker. This wasn't paranoia — it was written after a real substation incident involving a mis-addressed control.` },
  { id: 'feqkVgjJpYtjy',        caption: `IIN1.6: Device Restart detected. Time sync required.`,          tooltip: `Every DNP3 response carries 16 IIN health flags. IIN1.6 means the device just rebooted. Any data from before the restart may be stale. Miss this flag and your historian timestamps wrong values, silently, until someone notices the SCADA screen is wrong.` },
  { id: 'XIqCQx02E1U9W',        caption: `48-bit millisecond UTC timestamps. DNP3 doesn't forget.`,       tooltip: `DNP3 timestamps have 48-bit millisecond precision — enough to represent dates until the year 10889. After Y2K, the engineers who wrote this standard decided they weren't getting caught with an overflow problem again. Reasonable, honestly.` },
  { id: 'l46Cy1rHbQ92uuLXa',    caption: `RS-485, TCP/IP, fiber, radio — DNP3 runs on all of it.`,       tooltip: `DNP3 was designed in 1993 for RS-485 serial. The same application-layer frame format now runs on TCP/IP, fiber, radio, and power-line carrier. Same protocol, different transport. This is what protocol independence looks like in practice.` },
]
export default function Home() {
  const { overallProgress, reset } = useProgress()
  const [heroIdx] = useState(() => Math.floor(Math.random() * HERO_OPTIONS.length))
  const prog = overallProgress()

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto py-10 px-4 space-y-10"
    >
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
                Start Learning <ArrowRight size={16} />
              </Link>
              {prog.pct > 0 && (
                <Link to="/lab" className="btn-secondary">
                  Practice Lab
                </Link>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <GifCard gifId={HERO_OPTIONS[heroIdx].id} caption={HERO_OPTIONS[heroIdx].caption} tooltip={HERO_OPTIONS[heroIdx].tooltip} side="right" />
          </div>
        </div>
      </motion.div>

      {/* Progress bar (if started) */}
      {prog.pct > 0 && (
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-amber-400">Your Progress</h3>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-red-400 transition-colors">Reset</button>
          </div>
          <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${prog.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>{prog.visited}/{prog.total} chapters read</span>
            <span className="font-bold text-amber-400">{prog.pct}% complete</span>
            <span>{prog.quizzes}/{prog.total} quizzes passed</span>
          </div>
        </motion.div>
      )}

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

      {/* Chapter grid */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-amber-400 mb-4">Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHAPTERS.filter((c) => c.id !== 'home').map((ch) => {
            const ChIcon = ICON_MAP[ch.icon] || BookOpen
            return (
              <Link
                key={ch.id}
                to={ch.path}
                className="card flex items-center gap-4 hover:border-amber-500/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <ChIcon size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-amber-400 group-hover:text-amber-400 transition-colors">
                    {ch.label}
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* More Training */}
      <motion.div variants={item}>
        <TrainingPanel course="dnp3" />
      </motion.div>

      {/* Footer motivator */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-slate-400 text-sm italic">
          "DNP3 was designed by utilities, for utilities. It assumes you have bad comms links,
          unreliable clocks, and events that matter. Respect that and you'll be fine."
        </p>
      </motion.div>
    </motion.div>
  )
}
