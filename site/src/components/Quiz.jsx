import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, HelpCircle, ChevronRight, RotateCcw, Youtube, ExternalLink, BookOpen, Cpu } from 'lucide-react'
import Confetti from 'react-confetti'
import GifCard from './GifCard'
import { DEEP_DIVE } from '../data/deepDive'
import { useProgress } from '../hooks/useProgress'

function MCQQuestion({ q, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    onAnswer(idx === q.answer)
  }

  return (
    <div className="space-y-3 mt-4">
      {q.options.map((opt, idx) => {
        let cls = 'border-2 border-slate-200 bg-white text-slate-700 hover:border-mblue-400 hover:bg-mblue-50'
        if (selected === idx) {
          if (idx === q.answer) cls = 'border-2 border-mgreen-500 bg-green-50 text-green-800'
          else cls = 'border-2 border-mred-500 bg-red-50 text-red-800'
        } else if (answered && idx === q.answer) {
          cls = 'border-2 border-mgreen-500 bg-green-50 text-green-800'
        }

        return (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={answered}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${cls}`}
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current">
              {answered && idx === q.answer ? '✓' : answered && selected === idx ? '✗' : String.fromCharCode(65 + idx)}
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
          className={`flex-1 px-4 py-3 rounded-xl border-2 font-mono text-sm transition-colors
            ${submitted
              ? correct
                ? 'border-mgreen-500 bg-green-50 text-green-800'
                : 'border-mred-500 bg-red-50 text-red-800'
              : 'border-slate-200 focus:border-mblue-400 focus:outline-none'
            }`}
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
  if (q.type !== 'mcq') return q
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
            You got <span className="font-bold text-mblue-600">{score}/{total}</span> correct ({pct}%)
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
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden my-8">
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
      <div className="h-1 bg-slate-100">
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
            <p className="font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
              {q.question}
            </p>

            {q.type === 'mcq' && (
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
                  <div className={`rounded-xl p-4 flex gap-3 ${
                    answers[q.id]
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {answers[q.id]
                      ? <CheckCircle2 size={20} className="text-mgreen-500 flex-shrink-0 mt-0.5" />
                      : <XCircle size={20} className="text-mred-500 flex-shrink-0 mt-0.5" />
                    }
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm mb-1 ${answers[q.id] ? 'text-green-800' : 'text-red-800'}`}>
                        {answers[q.id] ? '✅ Correct!' : '❌ Not quite...'}
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{q.explanation}</p>

                      {/* Key points — shown for wrong answers */}
                      {!answers[q.id] && q.keyPoints && q.keyPoints.length > 0 && (
                        <div className="mt-3 border-t border-red-200 pt-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Key Points to Remember</p>
                          <ul className="space-y-1">
                            {q.keyPoints.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
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
                      <div className={`mt-3 rounded-xl overflow-hidden border ${correct ? 'border-slate-200' : 'border-orange-200'}`}>
                        <div className={`px-3 py-2 border-b ${correct ? 'bg-slate-50 border-slate-200' : 'bg-orange-50 border-orange-200'}`}>
                          <span className={`text-xs font-bold uppercase tracking-widest ${correct ? 'text-slate-500' : 'text-orange-600'}`}>
                            {correct ? '📚 Dig Deeper' : '🎯 Drill It — Review These'}
                          </span>
                        </div>
                        <div className={`divide-y ${correct ? 'divide-slate-100' : 'divide-orange-100'}`}>
                          {drillResources.map((r, ri) => (
                            <div key={ri}>
                              {r.type === 'youtube' && (
                                <a
                                  href={r.searchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 transition-colors group"
                                >
                                  <Youtube size={15} className="text-red-500 flex-shrink-0" />
                                  <span className="text-xs text-slate-700 flex-1 group-hover:text-red-700 leading-snug">{r.title}</span>
                                  <ExternalLink size={11} className="text-slate-300 flex-shrink-0" />
                                </a>
                              )}
                              {r.type === 'doc' && (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors group"
                                >
                                  <ExternalLink size={15} className="text-blue-500 flex-shrink-0" />
                                  <span className="text-xs text-slate-700 flex-1 group-hover:text-blue-700 leading-snug">{r.title}</span>
                                  <ExternalLink size={11} className="text-slate-300 flex-shrink-0" />
                                </a>
                              )}
                              {r.type === 'book' && (
                                <div className="flex items-start gap-3 px-3 py-2.5 bg-amber-50/60">
                                  <BookOpen size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs leading-snug">
                                    <span className="font-bold text-amber-800">{r.title}</span>
                                    {r.author && <span className="text-amber-600"> — {r.author}</span>}
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
