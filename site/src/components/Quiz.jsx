import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, RotateCcw, Youtube, ExternalLink, BookOpen, Cpu } from 'lucide-react'
import Confetti from 'react-confetti'
import GifCard from './GifCard'
import { DEEP_DIVE } from '../data/deepDive'
import { useProgress } from '../hooks/useProgress'
import { recordQuizSubmission } from '../hooks/useQuizReport'

function MCQQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    onAnswer(idx === q.answer)
  }

  return (
    <div className="space-y-2.5 mt-4">
      {q.options.map((opt, idx) => {
        const isCorrect = idx === q.answer
        const isSelected = selected === idx

        let style = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
        let badgeStyle = { background: 'rgba(255,255,255,0.06)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }

        if (isSelected && isCorrect) {
          style = { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.5)', color: '#6ee7b7', boxShadow: '0 0 12px rgba(16,185,129,0.2)' }
          badgeStyle = { background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.4)' }
        } else if (isSelected && !isCorrect) {
          style = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', boxShadow: '0 0 12px rgba(239,68,68,0.15)' }
          badgeStyle = { background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)' }
        } else if (answered && isCorrect) {
          style = { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7' }
          badgeStyle = { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }
        } else if (answered) {
          style = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#475569' }
        }

        return (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={answered}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3"
            style={style}
            onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(245,158,11,0.08)' }}
            onMouseLeave={e => { if (!answered) e.currentTarget.style.background = style.background }}
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={badgeStyle}>
              {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function FillQuestion({ q, onAnswer, answered }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)

  const check = () => {
    if (submitted) return
    const isCorrect = value.trim().toLowerCase() === q.answer.toLowerCase()
    setSubmitted(true)
    setCorrect(isCorrect)
    onAnswer(isCorrect)
  }

  return (
    <div className="mt-4 space-y-3">
      {q.hint && !submitted && (
        <p className="text-xs text-slate-500 italic">Hint: {q.hint}</p>
      )}
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !submitted && check()}
          disabled={submitted}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 rounded-xl font-mono text-sm transition-colors focus:outline-none"
          style={submitted
            ? correct
              ? { border: '1px solid rgba(16,185,129,0.5)', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7' }
              : { border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }
            : { border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0' }
          }
        />
        {!submitted && (
          <button onClick={check} className="btn-primary text-sm">
            Check
          </button>
        )}
      </div>
      {submitted && !correct && (
        <p className="text-sm text-mred-500">
          Correct answer: <span className="font-mono font-bold">{q.answer}</span>
        </p>
      )}
    </div>
  )
}

const LEVEL_THEME = {
  1: { header: 'bg-navy-700',    accent: 'text-mcyan-400',  label: 'Level 1 · Foundations' },
  2: { header: 'bg-slate-800',   accent: 'text-amber-400',  label: 'Level 2 · Applied' },
  3: { header: 'bg-[#0d0d14]',   accent: 'text-orange-400', label: 'Level 3 · Graduate' },
  4: { header: 'bg-[#051e0f]',   accent: 'text-green-400',  label: 'Field Scenarios' },
}

const ATTEMPT_KEY = (chapterId, level) => `quiz_attempts_${chapterId}_l${level}`

function getAttempt(chapterId, level) {
  try { return parseInt(localStorage.getItem(ATTEMPT_KEY(chapterId, level)) || '0', 10) } catch { return 0 }
}
function incAttempt(chapterId, level) {
  try { localStorage.setItem(ATTEMPT_KEY(chapterId, level), String(getAttempt(chapterId, level) + 1)) } catch {}
}

// Seeded PRNG (mulberry32) so shuffle is deterministic per attempt but different each time
function seededRng(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function shuffle(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffle answer options and update correct answer index
function shuffleOptions(q, rng) {
  if (q.type !== 'mcq' && q.type !== 'scenario') return q
  const indices = q.options.map((_, i) => i)
  const shuffled = shuffle(indices, rng)
  return {
    ...q,
    options: shuffled.map(i => q.options[i]),
    answer: shuffled.indexOf(q.answer),
  }
}

// On attempt >= 2, flip ~30% of MCQ questions to "which is INCORRECT?"
// On attempt >= 3, flip ~50%
function maybeFlip(q, rng, attempt) {
  if (q.type !== 'mcq' || q.options.length < 3) return q
  const threshold = attempt >= 3 ? 0.5 : attempt >= 2 ? 0.3 : 0
  if (rng() > threshold) return q
  // Pick a wrong option to be the new "correct" answer for the flipped question
  const wrongIndices = q.options.map((_, i) => i).filter(i => i !== q.answer)
  const newAnswer = wrongIndices[Math.floor(rng() * wrongIndices.length)]
  return {
    ...q,
    _flipped: true,
    question: `⚠️ Critical Thinking: Which of the following statements about this topic is INCORRECT?\n\n(Original context: ${q.question.replace(/^⚠️.*?\n\n/, '')})`,
    answer: newAnswer,
    explanation: `The INCORRECT statement was: "${q.options[newAnswer]}"\n\n${q.explanation}`,
  }
}

function prepareQuestions(questions, chapterId, level, attempt) {
  const seed = (attempt + 1) * 31337 + chapterId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + level * 997
  const rng = seededRng(seed)
  return shuffle(questions, rng).map(q => maybeFlip(shuffleOptions(q, seededRng(seed + q.id.charCodeAt(0))), seededRng(seed + 1), attempt))
}

export default function Quiz({ chapterId, questions, level = 1 }) {
  const { markLevelComplete } = useProgress()
  const [attempt, setAttempt] = useState(() => getAttempt(chapterId, level))
  const [activeQuestions, setActiveQuestions] = useState(() => prepareQuestions(questions, chapterId, level, getAttempt(chapterId, level)))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const theme = LEVEL_THEME[level] || LEVEL_THEME[1]
  const q = activeQuestions[current]
  const answered = q.id in answers

  const handleAnswer = (correct) => {
    setAnswers((prev) => ({ ...prev, [q.id]: correct }))
    setShowExplanation(true)
  }

  const next = () => {
    setShowExplanation(false)
    if (current + 1 < activeQuestions.length) {
      setCurrent((c) => c + 1)
    } else {
      const score = Object.values(answers).filter(Boolean).length
      const total = activeQuestions.length
      setFinished(true)
      recordQuizSubmission({ chapter: chapterId, level, score, total, attempt })
      if (score / total >= 0.7) {
        setShowConfetti(true)
        markLevelComplete(chapterId, level)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
  }

  const reset = () => {
    incAttempt(chapterId, level)
    const nextAttempt = attempt + 1
    setAttempt(nextAttempt)
    setActiveQuestions(prepareQuestions(questions, chapterId, level, nextAttempt))
    setCurrent(0)
    setAnswers({})
    setShowExplanation(false)
    setFinished(false)
    setShowConfetti(false)
  }

  if (finished) {
    const score = Object.values(answers).filter(Boolean).length
    const total = questions.length
    const pct = Math.round((score / total) * 100)
    const passed = pct >= 70

    return (
      <>
        {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 px-4"
        >
          <div className="text-6xl mb-4">{passed ? '🎉' : '😅'}</div>
          <h3 className="text-2xl font-bold mb-2">
            {passed ? 'Nailed it!' : 'Not quite yet...'}
          </h3>
          <p className="text-slate-500 mb-2">
            You got <span className="font-bold text-amber-400">{score}/{total}</span> correct ({pct}%)
          </p>
          {attempt > 0 && (
            <p className="text-xs text-slate-400 mb-4">
              Attempt {attempt + 1} — questions were {attempt >= 2 ? 'shuffled + ~50% adversarial (Which is INCORRECT?)' : 'shuffled in a new order'}
            </p>
          )}

          {passed ? (
            <GifCard gifKey="celebrate" caption="Look at you go! 🚀" side="right" className="justify-center" />
          ) : (
            <GifCard gifKey="tryAgain" caption="Review the chapter and try again!" side="right" className="justify-center" />
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button onClick={reset} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden my-8" style={{ background: 'rgba(8,13,16,0.8)', border: '1px solid rgba(245,158,11,0.15)' }}>
      {/* Header */}
      <div className={`${theme.header} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <HelpCircle size={20} className={theme.accent} />
          <div>
            <span className="text-white font-semibold text-sm">{theme.label}</span>
            {attempt > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-bold ${theme.accent} bg-white/10`}>
                Attempt {attempt + 1}{attempt >= 2 ? ' · Adversarial' : attempt >= 1 ? ' · Shuffled' : ''}
              </span>
            )}
          </div>
        </div>
        <span className="text-slate-400 text-sm">
          {current + 1} / {activeQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="progress-bar"
          style={{ width: `${((current + (answered ? 1 : 0)) / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {q.reference && (
              <div className="bg-slate-900 border border-orange-900/50 rounded-xl p-3 mb-3 flex gap-2 text-xs">
                <span className="text-orange-400 font-bold flex-shrink-0">📖</span>
                <div>
                  <span className="text-orange-300 font-semibold">{q.reference.book}</span>
                  <span className="text-slate-400 mx-1">·</span>
                  <span className="text-slate-300">{q.reference.chapter}</span>
                  {q.reference.page && <span className="text-slate-500">, p. {q.reference.page}</span>}
                </div>
              </div>
            )}
            {q.ai_application && (
              <div className="bg-purple-950/40 border border-purple-700/30 rounded-xl p-3 mb-3 flex gap-2 text-xs">
                <span className="text-purple-400 flex-shrink-0">🤖</span>
                <div className="text-purple-200">{q.ai_application}</div>
              </div>
            )}
            <p className="font-semibold text-slate-100 leading-relaxed whitespace-pre-line">
              {q.question}
            </p>

            {(q.type === 'mcq' || q.type === 'scenario') && (
              <MCQQuestion q={q} onAnswer={handleAnswer} answered={answered} />
            )}
            {q.type === 'fill' && (
              <FillQuestion q={q} onAnswer={handleAnswer} answered={answered} />
            )}

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5"
                >
                  <div
                    className="rounded-xl p-4 flex gap-3"
                    style={answers[q.id]
                      ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }
                      : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }
                    }
                  >
                    {answers[q.id]
                      ? <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      : <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    }
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm mb-1 ${answers[q.id] ? 'text-emerald-400' : 'text-red-400'}`}>
                        {answers[q.id] ? '✅ Correct!' : '❌ Not quite...'}
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>

                      {/* Key points — shown for wrong answers */}
                      {!answers[q.id] && q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="mt-3 border-t border-red-900/40 pt-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Key Points to Remember</p>
                          <ul className="space-y-1">
                            {q.keyPoints.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">→</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dig Deeper — always shown after answering */}
                  {(() => {
                    const chapterResources = (q.resources || DEEP_DIVE[chapterId]?.[`level${level}`] || []).slice(0, 3)
                    const refEntry = q.reference
                      ? [{ type: 'book', title: q.reference.book, author: q.reference.author, chapter: q.reference.chapter, page: q.reference.page }]
                      : []
                    const drillResources = [...refEntry, ...chapterResources]
                    if (drillResources.length === 0) return null
                    const correct = answers[q.id]
                    return (
                      <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${correct ? 'rgba(255,255,255,0.1)' : 'rgba(245,158,11,0.2)'}` }}>
                        <div className="px-3 py-2 border-b" style={{ background: correct ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.08)', borderColor: correct ? 'rgba(255,255,255,0.08)' : 'rgba(245,158,11,0.2)' }}>
                          <span className={`text-xs font-bold uppercase tracking-widest ${correct ? 'text-slate-500' : 'text-amber-400'}`}>
                            {correct ? '📚 Dig Deeper' : '🎯 Drill It — Review These'}
                          </span>
                        </div>
                        <div className="divide-y divide-white/5">
                          {drillResources.map((r, ri) => (
                            <div key={ri}>
                              {r.type === 'youtube' && (
                                <a
                                  href={r.searchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-900/20 transition-colors group"
                                >
                                  <Youtube size={15} className="text-red-400 flex-shrink-0" />
                                  <span className="text-xs text-slate-400 flex-1 group-hover:text-red-300 leading-snug">{r.title}</span>
                                  <ExternalLink size={11} className="text-slate-600 flex-shrink-0" />
                                </a>
                              )}
                              {r.type === 'doc' && (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-900/20 transition-colors group"
                                >
                                  <ExternalLink size={15} className="text-blue-400 flex-shrink-0" />
                                  <span className="text-xs text-slate-400 flex-1 group-hover:text-blue-300 leading-snug">{r.title}</span>
                                  <ExternalLink size={11} className="text-slate-600 flex-shrink-0" />
                                </a>
                              )}
                              {r.type === 'book' && (
                                <div className="flex items-start gap-3 px-3 py-2.5" style={{ background: 'rgba(245,158,11,0.06)' }}>
                                  <BookOpen size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs leading-snug">
                                    <span className="font-bold text-amber-300">{r.title}</span>
                                    {r.author && <span className="text-amber-500"> — {r.author}</span>}
                                    <div className="text-slate-500 mt-0.5">{r.chapter}{r.page ? `, p. ${r.page}` : ''}</div>
                                  </div>
                                </div>
                              )}
                              {r.type === 'dataset' && (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 transition-colors group"
                                >
                                  <Cpu size={15} className="text-green-500 flex-shrink-0" />
                                  <span className="text-xs text-slate-700 flex-1 group-hover:text-green-700 leading-snug">{r.title}</span>
                                  <ExternalLink size={11} className="text-slate-300 flex-shrink-0" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  <div className="flex justify-end mt-4">
                    <button onClick={next} className="btn-primary flex items-center gap-2 text-sm">
                      {current + 1 < questions.length ? 'Next Question' : 'See Results'}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
