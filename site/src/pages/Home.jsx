import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, Award, Clock, ArrowRight, Radio } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'
import { CHAPTERS } from '../data/chapters'
import GifCard from '../components/GifCard'

const STATS = [
  { icon: BookOpen, label: '10 Chapters', sub: 'From zero to hero' },
  { icon: Zap, label: '30+ Quizzes', sub: 'Test yourself' },
  { icon: Clock, label: '~5 Hours', sub: 'Total study time' },
  { icon: Award, label: 'SCADA Ready', sub: 'Utility & water SCADA' },
]

export default function Home() {
  const { overallProgress, reset } = useProgress()
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
        <div className="inline-flex items-center gap-2 bg-mblue-50 text-mblue-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-mblue-200">
          <Radio size={12} />
          SCADA Automation Engineer Training
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-navy-700 leading-tight mb-4">
              DNP3 Protocol<br />
              <span className="text-mblue-600">Made Simple.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
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
            <GifCard gifKey="robot" caption="Your future outstation 🏭" side="right" />
          </div>
        </div>
      </motion.div>

      {/* Progress bar (if started) */}
      {prog.pct > 0 && (
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-navy-700">Your Progress</h3>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-mred-400 transition-colors">Reset</button>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-mblue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${prog.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>{prog.visited}/{prog.total} chapters read</span>
            <span className="font-bold text-mblue-600">{prog.pct}% complete</span>
            <span>{prog.quizzes}/{prog.total} quizzes passed</span>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="card text-center">
            <div className="w-10 h-10 bg-mblue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <s.icon size={20} className="text-mblue-600" />
            </div>
            <div className="font-bold text-navy-700">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Why DNP3 */}
      <motion.div variants={item} className="bg-gradient-to-r from-navy-700 to-mblue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">⚡ Why DNP3 Matters in 2026</h2>
            <ul className="text-sm text-blue-100 space-y-1 list-none">
              <li>🏭 Standard protocol for electric utilities, water treatment, and oil & gas SCADA</li>
              <li>📡 Event-driven — outstations report data as it changes, not just when polled</li>
              <li>🕐 48-bit timestamps on every event — critical for post-incident reconstruction</li>
              <li>🔒 Secure Authentication v5 (IEC 62351-5) — built-in crypto, not bolted on</li>
              <li>💰 If you work in utility SCADA, DNP3 is not optional knowledge</li>
            </ul>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-5xl font-black text-amber-400">IEEE</div>
            <div className="text-blue-200 text-sm">1815-2012</div>
            <div className="text-xs text-blue-300 mt-1">The DNP3 standard 📐</div>
          </div>
        </div>
      </motion.div>

      {/* Chapter grid */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-navy-700 mb-4">Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHAPTERS.filter((c) => c.id !== 'home').map((ch) => (
            <Link
              key={ch.id}
              to={ch.path}
              className="card flex items-center gap-4 hover:border-mblue-200 hover:shadow-md transition-all group"
            >
              <span className="text-3xl">{ch.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-navy-700 group-hover:text-mblue-600 transition-colors">
                  {ch.label}
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-mblue-400 transition-colors" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Footer motivator */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-slate-400 text-sm italic">
          "DNP3 was designed by utilities, for utilities. It assumes you have bad comms links,
          unreliable clocks, and events that matter. Respect that and you'll be fine." ⚡
        </p>
      </motion.div>
    </motion.div>
  )
}
