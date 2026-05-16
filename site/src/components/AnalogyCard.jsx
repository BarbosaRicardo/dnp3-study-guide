import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import GifCard from './GifCard'

function parseMarkdown(text) {
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
      className="rounded-2xl overflow-hidden my-6"
      style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 text-left transition-colors"
        style={{ background: open ? 'rgba(139,92,246,0.1)' : 'transparent' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(139,92,246,0.07)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.3)' }}>
          <Zap size={18} className="text-violet-300" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(167,139,250,0.7)' }}>Analogy</div>
          <div className="font-semibold text-slate-200">{analogy.title}</div>
          <div className="text-xs text-slate-500">Concept: {analogy.concept}</div>
        </div>
        {open
          ? <ChevronUp size={18} className="text-violet-400" />
          : <ChevronDown size={18} className="text-violet-400" />}
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
              <p className="text-slate-300 text-sm leading-relaxed">
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
