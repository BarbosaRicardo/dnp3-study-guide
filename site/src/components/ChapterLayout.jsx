import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'

export default function ChapterLayout({ chapterId, title, emoji, children, prev, next }) {
  const { markChapterVisited } = useProgress()

  useEffect(() => {
    markChapterVisited(chapterId)
    window.scrollTo(0, 0)
  }, [chapterId])

  const prevChapter = prev ? CHAPTERS.find((c) => c.id === prev) : null
  const nextChapter = next ? CHAPTERS.find((c) => c.id === next) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto py-8 px-4"
    >
      {/* Chapter header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-mblue-400 text-sm font-medium mb-2">
          <span>SCADA Training</span>
          <span>›</span>
          <span className="text-slate-400">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{emoji}</span>
          <h1 className="text-3xl font-black text-navy-700 leading-tight">{title}</h1>
        </div>
        <div className="mt-4 h-1 bg-gradient-to-r from-mblue-600 via-mcyan-400 to-transparent rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-6 text-slate-700 leading-relaxed">
        {children}
      </div>

      {/* Chapter navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
        {prevChapter ? (
          <Link to={prevChapter.path} className="flex items-center gap-2 text-sm text-slate-500 hover:text-mblue-600 transition-colors">
            <ChevronLeft size={18} />
            <div>
              <div className="text-xs text-slate-400">Previous</div>
              <div className="font-medium">{prevChapter.label}</div>
            </div>
          </Link>
        ) : <div />}

        {nextChapter ? (
          <Link to={nextChapter.path} className="flex items-center gap-2 text-sm text-slate-500 hover:text-mblue-600 transition-colors text-right">
            <div>
              <div className="text-xs text-slate-400">Next Up</div>
              <div className="font-medium">{nextChapter.label}</div>
            </div>
            <ChevronRight size={18} />
          </Link>
        ) : <div />}
      </div>
    </motion.div>
  )
}
