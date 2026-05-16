import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import GifCard from './GifCard'

function parseMarkdown(text) {
  // Very simple bold/newline renderer
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-amber-400">{part.slice(2, -2)}</strong>
    }
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

export default function AnalogyCard({ analogy }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl overflow-hidden my-6"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-purple-50/50 transition-colors"
      >
        <div className="flex-shrink-0 w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-0.5">Analogy</div>
          <div className="font-semibold text-slate-800">{analogy.title}</div>
          <div className="text-xs text-slate-500">Concept: {analogy.concept}</div>
        </div>
        {open ? <ChevronUp size={18} className="text-purple-400" /> : <ChevronDown size={18} className="text-purple-400" />}
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <p className="text-slate-700 text-sm leading-relaxed">
                {parseMarkdown(analogy.analogy)}
              </p>
            </div>
            {analogy.gif && (
              <div className="flex justify-center">
                <GifCard gifKey={analogy.gif} side="right" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
