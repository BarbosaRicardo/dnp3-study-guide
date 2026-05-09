import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, RefreshCw } from 'lucide-react'
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
        className="bg-amber-50 border border-amber-200 rounded-2xl p-5 my-6 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 text-8xl opacity-5 pointer-events-none select-none">💡</div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
            <Lightbulb size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Fun Fact</span>
              <span className="text-lg">{fact.emoji}</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{fact.text}</p>
          </div>
        </div>

        <button
          onClick={next}
          className="mt-3 ml-12 flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium transition-colors"
        >
          <RefreshCw size={12} />
          Another fact
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
