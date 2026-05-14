import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, ChevronDown, ChevronUp, Lock, CheckCircle2, XCircle, AlertCircle, Copy, Loader2 } from 'lucide-react'

// ─── Sandboxes ────────────────────────────────────────────────────────────────
function runSandbox(userCode, testRunner) {
  const logs = []
  const fakeConsole = {
    log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
    error: (...args) => logs.push('ERROR: ' + args.join(' ')),
    warn: (...args) => logs.push('WARN: ' + args.join(' ')),
  }
  try {
    // eslint-disable-next-line no-new-func
    const wrapped = new Function('console', `"use strict"; ${userCode} return (${testRunner.toString()})(typeof solution !== "undefined" ? solution : undefined);`)
    return { success: true, logs, result: wrapped(fakeConsole) }
  } catch (e) {
    return { success: false, logs, error: e.message, result: null }
  }
}

let pyodidePromise = null
function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await new Promise((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
          s.onload = res; s.onerror = () => rej(new Error('Failed to load Pyodide'))
          document.head.appendChild(s)
        })
      }
      return await window.loadPyodide()
    })()
  }
  return pyodidePromise
}

function pyToJs(val) {
  if (val == null) return null
  if (typeof val?.toJs === 'function') return val.toJs({ dict_converter: Object.fromEntries, depth: 10 })
  return val
}

async function runPyodideSandbox(userCode, testRunner) {
  const logs = []
  try {
    const py = await getPyodide()
    py.setStdout({ batched: (s) => { if (s.trim()) logs.push(s.trimEnd()) } })
    py.setStderr({ batched: (s) => { if (s.trim()) logs.push('ERR: ' + s.trimEnd()) } })
    await py.runPythonAsync(userCode)
    const pySolution = py.globals.get('solution')
    if (!pySolution) throw new Error("No 'solution' variable found. Add: solution = your_function_name")
    const jsSolution = (...args) => {
      const pyArgs = args.map(a => a instanceof Uint8Array ? py.toPy(Array.from(a)) : Array.isArray(a) ? py.toPy(a) : a)
      return pyToJs(pySolution(...pyArgs))
    }
    return { success: true, logs, result: testRunner(jsSolution) }
  } catch (e) {
    return { success: false, logs, error: e.message, result: null }
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────
const LEVEL_META = {
  1: { label: 'Level 1 — Foundations', color: '#fbbf24', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.25)',  emoji: '🟡' },
  2: { label: 'Level 2 — Applied',     color: '#34d399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.25)',  emoji: '🟢' },
  3: { label: 'Level 3 — Expert',      color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.25)', emoji: '🔴' },
}

const LANG_TABS = [
  { key: 'js',     label: 'JS',     monacoLang: 'javascript' },
  { key: 'python', label: 'Python', monacoLang: 'python' },
  { key: 'jython', label: 'Jython', monacoLang: 'python' },
]

const JYTHON_HEADER = `# ─── Jython 2.7 — Python 2 on the JVM ───────────────────────────────────────
# You know Python 3. Here is what changes in Jython 2.7:
#
#   Syntax differences:
#   • No f-strings          → use "Hello {}".format(name)
#   • Integer division      → 5 / 2 == 2  (not 2.5) — use float(5) / 2
#   • No walrus :=          → use a regular assignment on the line before
#   • No type hints         → def fn(x):  not  def fn(x: int) -> str:
#   • No match/case         → use if/elif chains
#
#   In Ignition specifically:
#   • system.tag.readBlocking(["[default]path"])  → returns list of QualifiedValues
#   • system.db.runNamedQuery("Name", {"param": val})  → returns dataset
#   • system.util.getLogger("MyScript").info("msg")  → Gateway/Designer logs
#   • Java types available: from java.util import ArrayList, HashMap
#
# ─────────────────────────────────────────────────────────────────────────────

`

// ─── TestResult ──────────────────────────────────────────────────────────────
function TestResult({ test, result }) {
  const passed = result?.passed
  return (
    <div className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <span className="flex-shrink-0 mt-0.5">
        {passed ? <CheckCircle2 size={14} style={{ color: '#34d399' }} /> : <XCircle size={14} style={{ color: '#f87171' }} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-slate-300">{test.description}</div>
        {!passed && result?.expected !== undefined && (
          <div className="text-xs font-mono mt-0.5" style={{ color: '#f87171' }}>
            Expected: {JSON.stringify(result.expected)} · Got: {JSON.stringify(result.actual)}
          </div>
        )}
        {!passed && result?.error && <div className="text-xs font-mono mt-0.5" style={{ color: '#f87171' }}>{result.error}</div>}
      </div>
    </div>
  )
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────────
function ExerciseCard({ ex, locked }) {
  const [lang, setLang] = useState('js')
  const [codeByLang, setCodeByLang] = useState({
    js:     ex.starter   || '// TODO: implement solution',
    python: ex.starterPy || '# TODO: implement solution\n\nsolution = None',
    jython: JYTHON_HEADER + (ex.starterJython || ex.starterPy || '# TODO: implement solution\n\nsolution = None'),
  })
  const [output, setOutput] = useState(null)
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const meta = LEVEL_META[ex.level]

  const currentCode = codeByLang[lang]
  const setCurrentCode = (v) => setCodeByLang(prev => ({ ...prev, [lang]: v || '' }))

  const run = async () => {
    setRunning(true); setOutput(null)
    const res = lang === 'python' ? await runPyodideSandbox(currentCode, ex.testRunner) : runSandbox(currentCode, ex.testRunner)
    setRunning(false)
    if (!res.success) { setOutput({ type: 'error', error: res.error, logs: res.logs }); return }
    setOutput({ type: 'result', results: res.result, logs: res.logs, passed: res.result?.every(r => r.passed) })
  }

  const reset = () => {
    setCodeByLang({ js: ex.starter || '', python: ex.starterPy || '', jython: JYTHON_HEADER + (ex.starterJython || ex.starterPy || '') })
    setOutput(null)
  }

  const copy = () => navigator.clipboard.writeText(currentCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })

  const allPassed = output?.passed

  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ border: `1px solid ${open ? meta.border : 'rgba(255,255,255,0.07)'}`, background: 'rgba(255,255,255,0.02)' }}>
      <button
        onClick={() => !locked && setOpen(o => !o)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all"
        style={{ cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.4 : 1 }}
      >
        <span className="text-lg leading-none flex-shrink-0">{locked ? '🔒' : allPassed ? '✅' : meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm" style={{ color: open ? 'white' : '#94a3b8' }}>{ex.title}</div>
          <div className="text-xs mt-0.5" style={{ color: open ? meta.color : '#475569' }}>{meta.label}</div>
        </div>
        {!locked && (open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-600 flex-shrink-0" />)}
        {locked && <Lock size={13} className="text-slate-600 flex-shrink-0" />}
      </button>

      {!locked && open && (
        <div style={{ borderTop: `1px solid ${meta.border}` }}>
          <div className="px-4 pt-4 pb-2">
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{ex.scenario}</div>
            {ex.hint && (
              <div className="mt-3 px-3 py-2 rounded-lg text-xs text-slate-400 leading-relaxed"
                style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}>
                💡 {ex.hint}
              </div>
            )}
          </div>

          <div className="mx-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-3 py-1.5 gap-2"
              style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1">
                {LANG_TABS.map(tab => (
                  <button key={tab.key} onClick={() => { setLang(tab.key); setOutput(null) }}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all"
                    style={lang === tab.key
                      ? { background: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}55` }
                      : { background: 'transparent', color: '#475569', border: '1px solid transparent' }}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                <RotateCcw size={11} /> Reset
              </button>
            </div>
            <Editor
              height="280px"
              language={LANG_TABS.find(t => t.key === lang)?.monacoLang || 'javascript'}
              theme="vs-dark"
              value={currentCode}
              onChange={v => { setCurrentCode(v); setOutput(null) }}
              options={{ fontSize: 13, fontFamily: '"JetBrains Mono","Fira Code",monospace', minimap: { enabled: false }, scrollBeyondLastLine: false, lineNumbers: 'on', wordWrap: 'on', tabSize: lang === 'js' ? 2 : 4, automaticLayout: true, padding: { top: 10, bottom: 10 } }}
            />
          </div>

          <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
            {lang === 'jython' ? (
              <>
                <button onClick={copy}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color})` }}>
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <span className="text-xs text-slate-500">Paste into a Jython 2.7 REPL or Ignition Script Console</span>
              </>
            ) : (
              <>
                <button onClick={run} disabled={running}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color})` }}>
                  {running
                    ? <><Loader2 size={14} className="animate-spin" />{lang === 'python' ? 'Loading Python…' : 'Running…'}</>
                    : <><Play size={14} />Run Code</>}
                </button>
                {lang === 'python' && !running && !output && <span className="text-xs text-slate-600">First run loads Python runtime (~10s)</span>}
                {allPassed && <span className="text-sm font-semibold" style={{ color: '#34d399' }}>✓ All tests passing</span>}
                <button onClick={copy} className="ml-auto flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  <Copy size={11} /> {copied ? 'Copied' : 'Copy'}
                </button>
              </>
            )}
          </div>

          {output && (
            <div className="mx-4 mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {output.logs?.length > 0 && (
                <div className="px-3 py-2 font-mono text-xs text-slate-400 leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {output.logs.map((l, i) => <div key={i}><span style={{ color: '#475569' }}>&gt; </span>{l}</div>)}
                </div>
              )}
              {output.type === 'error' && (
                <div className="px-3 py-2 flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  <AlertCircle size={14} style={{ color: '#f87171', marginTop: 2 }} className="flex-shrink-0" />
                  <span className="text-xs font-mono" style={{ color: '#f87171' }}>{output.error}</span>
                </div>
              )}
              {output.type === 'result' && output.results && (
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Test Results</div>
                  {output.results.map((r, i) => <TestResult key={i} test={ex.tests[i]} result={r} />)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CodeLab({ exercises }) {
  const byLevel = [1, 2, 3].map(l => exercises.filter(e => e.level === l))
  const [passedLevels, setPassedLevels] = useState({ 1: false, 2: false, 3: false })

  return (
    <div className="my-8 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-px flex-1" style={{ background: 'rgba(245,158,11,0.12)' }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.5)' }}>Code Lab</span>
        <div className="h-px flex-1" style={{ background: 'rgba(245,158,11,0.12)' }} />
      </div>
      {byLevel.map((exs, li) => {
        const level = li + 1
        const locked = level > 1 && !passedLevels[level - 1]
        return exs.map((ex) => <ExerciseCard key={ex.id} ex={ex} locked={locked} />)
      })}
    </div>
  )
}
