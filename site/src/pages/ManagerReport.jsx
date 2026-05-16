import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'
import QuizReport from '../components/QuizReport'

export default function ManagerReport() {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto py-12 px-4 text-center"
    >
      <div className="flex justify-center mb-4"><BarChart2 size={48} className="text-amber-400" /></div>
      <h1 className="text-3xl font-black text-amber-400 mb-3">Quiz Report</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        All quiz submissions across every DNP3 chapter — timestamped, scored, and exportable.
      </p>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}
      >
        <BarChart2 size={18} />
        Open Full Report
      </button>

      {open && <QuizReport onClose={() => setOpen(false)} />}
    </motion.div>
  )
}
