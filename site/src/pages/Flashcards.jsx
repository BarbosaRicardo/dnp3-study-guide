import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen } from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { FLASHCARDS } from '../data/flashcards'

function FlashCard({ card, flipped, onFlip }) {
  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1200px', height: '260px' }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center backface-hidden"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', backfaceVisibility: 'hidden' }}
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.55)' }}>Question</div>
          <p className="text-white text-lg font-semibold leading-relaxed">{card.q}</p>
          <p className="text-slate-500 text-xs mt-6">Click to reveal answer</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center backface-hidden"
          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-4 text-green-400">Answer</div>
          <p className="text-green-300 text-base leading-relaxed">{card.a}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function Flashcards() {
  const studyChapters = CHAPTERS.filter(c => c.id !== 'home')
  const [chapterId, setChapterId] = useState(studyChapters[0]?.id || 'intro')
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  useEffect(() => {
    const raw = FLASHCARDS[chapterId] || []
    setCards(shuffled ? [...raw].sort(() => Math.random() - 0.5) : raw)
    setIndex(0)
    setFlipped(false)
  }, [chapterId, shuffled])

  const card = cards[index]
  const total = cards.length

  const prev = () => { setIndex(i => Math.max(0, i - 1)); setFlipped(false) }
  const next = () => { setIndex(i => Math.min(total - 1, i + 1)); setFlipped(false) }

  if (Object.keys(FLASHCARDS).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-16 px-4 text-center"
      >
        <div className="text-5xl mb-4">🃏</div>
        <h1 className="text-3xl font-black text-amber-400 mb-3">Flashcards</h1>
        <p className="text-slate-400">Flashcard content is being prepared. Check back soon.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto py-10 px-4"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
          <BookOpen size={12} /> Flashcards
        </div>
        <h1 className="text-3xl font-black text-amber-400">DNP3 Flashcards</h1>
        <p className="text-slate-400 text-sm mt-2">Click a card to flip it. Use arrows to navigate.</p>
      </div>

      {/* Chapter filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {studyChapters.map(ch => (
          <button
            key={ch.id}
            onClick={() => setChapterId(ch.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={chapterId === ch.id
              ? { background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.45)', color: '#fbbf24' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
          >
            {ch.emoji} {ch.label.replace(/^Ch \d+: /, '')}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🚧</div>
          <div>No flashcards for this chapter yet.</div>
        </div>
      ) : (
        <>
          <div className="text-center text-xs text-slate-600 mb-3 font-mono">
            {index + 1} / {total}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${chapterId}-${index}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <FlashCard card={card} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="h-1 rounded-full mt-4 mb-6" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={index === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', color: '#fbbf24' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <button
              onClick={() => setShuffled(s => !s)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={shuffled
                ? { background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
            >
              <Shuffle size={13} /> {shuffled ? 'Shuffled' : 'Shuffle'}
            </button>

            <button
              onClick={next}
              disabled={index === total - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', color: '#fbbf24' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}
