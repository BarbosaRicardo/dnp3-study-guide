import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RefreshCw } from 'lucide-react'
import { FUN_FACTS } from '../data/chapters'

export default function FunFact({ index }) {
  const [current, setCurrent] = useState(
    index !== undefined ? index % FUN_FACTS.length : Math.floor(Math.random() * FUN_FACTS.length)
  )
  const fact = FUN_FACTS[current]
  const next = () => setCurrent((c) => (c + 1) % FUN_FACTS.length)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-5 my-6 relative overflow-hidden"
        style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.22)',
        }}
      >
        <div className="absolute top-0 right-0 text-8xl opacity-5 pointer-events-none select-none">⚡</div>

        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}
          >
            <Zap size={17} className="text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Field Intel</span>
              <span className="text-lg">{fact.emoji}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{fact.text}</p>
          </div>
        </div>

        <button
          onClick={next}
          className="mt-3 ml-12 flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-amber-300"
          style={{ color: 'rgba(245,158,11,0.6)' }}
        >
          <RefreshCw size={12} />
          Another fact
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
