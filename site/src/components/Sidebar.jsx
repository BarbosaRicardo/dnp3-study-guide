import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Zap, LayoutGrid, BookOpen, BarChart2, Home, Radio, Layers, Link, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical, FileText, ChevronDown, Network, Globe, Code2, Sliders, Server, LayoutDashboard, ScanSearch, GraduationCap, CheckCircle2 } from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'
import TrainingModal from './TrainingModal'
import BadgeTray from './BadgeTray'

const READ_TIME = {
  intro: 12, layers: 10, datalink: 12, appLayer: 14,
  objects: 12, fc: 10, unsol: 10, security: 12,
  troubleshoot: 12, lab: 20,
}

const ICON_MAP = {
  Home, Radio, Layers, Link, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical,
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [showGuides, setShowGuides] = useState(false)
  const [showChapters, setShowChapters] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const { getChapterStatus, overallProgress } = useProgress()
  const prog = overallProgress()

  const [streak] = useState(() => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const lastDate = localStorage.getItem('scadahub_streak_date') || ''
      const cur = parseInt(localStorage.getItem('scadahub_streak') || '0', 10)
      if (lastDate === today) return cur
      const next = lastDate === yesterday ? cur + 1 : 1
      localStorage.setItem('scadahub_streak', String(next))
      localStorage.setItem('scadahub_streak_date', today)
      return next
    } catch { return 1 }
  })

  const chaptersOnly = CHAPTERS.filter(ch => ch.id !== 'home')
  const totalChapters = chaptersOnly.length
  const completedCount = chaptersOnly.filter(ch => {
    const s = getChapterStatus(ch.id)
    return s.level1Passed && s.level2Passed && s.level3Passed && s.level4Passed
  }).length
  const remaining = totalChapters - completedCount
  const nextChapterId = chaptersOnly.find(ch => !getChapterStatus(ch.id).level1Passed)?.id

  const NavItem = ({ ch }) => {
    const status = getChapterStatus(ch.id)
    const Icon = ICON_MAP[ch.icon] || BookOpen
    const isNext = ch.id === nextChapterId
    const readTime = READ_TIME[ch.id]

    const colonIdx = ch.label.indexOf(': ')
    const prefix = colonIdx !== -1 ? ch.label.slice(0, colonIdx + 1) : null
    const topic  = colonIdx !== -1 ? ch.label.slice(colonIdx + 2) : ch.label

    const filledCount = [status.level1Passed, status.level2Passed, status.level3Passed].filter(Boolean).length
    const nearComplete = filledCount > 0 && filledCount < 3

    return (
      <div>
        <NavLink
          to={ch.path}
          onClick={() => setOpen(false)}
          className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={15} className="flex-shrink-0 opacity-70" />
          <span className="flex-1 truncate">
            {prefix && (
              <span className="opacity-40 font-normal mr-1 text-xs">{prefix}</span>
            )}
            <span className="font-semibold">{topic}</span>
          </span>
          <div className="flex gap-0.5 flex-shrink-0 items-center">
            {status.completed ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <>
                <div className={`rounded-full transition-all ${
                  status.level1Passed
                    ? 'w-1.5 h-1.5 bg-emerald-400 shadow-glow-green'
                    : nearComplete
                      ? 'w-2 h-2 bg-white/15'
                      : status.visited
                        ? 'w-1.5 h-1.5 bg-amber-400'
                        : 'w-1.5 h-1.5 bg-white/10'
                }`}
                  style={!status.level1Passed && nearComplete ? { boxShadow: '0 0 5px rgba(45,212,191,0.4)' } : {}}
                />
                <div className={`rounded-full transition-all ${
                  status.level2Passed
                    ? 'w-1.5 h-1.5 bg-amber-400'
                    : nearComplete && filledCount >= 1
                      ? 'w-2 h-2 bg-white/15'
                      : 'w-1.5 h-1.5 bg-white/10'
                }`}
                  style={!status.level2Passed && nearComplete && filledCount >= 1 ? { boxShadow: '0 0 5px rgba(45,212,191,0.4)' } : {}}
                />
                <div className={`rounded-full transition-all ${
                  status.level3Passed
                    ? 'w-1.5 h-1.5 bg-rose-400'
                    : nearComplete && filledCount >= 2
                      ? 'w-2 h-2 bg-white/15'
                      : 'w-1.5 h-1.5 bg-white/10'
                }`}
                  style={!status.level3Passed && nearComplete && filledCount >= 2 ? { boxShadow: '0 0 5px rgba(45,212,191,0.4)' } : {}}
                />
              </>
            )}
          </div>
        </NavLink>
        {(isNext || (!status.visited && readTime)) && (
          <div className="ml-9 mb-0.5 mt-0.5 flex items-center gap-2">
            {isNext && (
              <span className="font-semibold tracking-wide" style={{ color: '#fbbf24', fontSize: '0.65rem' }}>▶ Up next</span>
            )}
            {!status.visited && readTime && (
              <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.6rem' }}>~{readTime} min</span>
            )}
          </div>
        )}
      </div>
    )
  }
  const HomeItem = () => (
    <NavLink
      to="/"
      end
      onClick={() => setOpen(false)}
      className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
    >
      <Home size={15} className="flex-shrink-0 opacity-70" />
      <span className="flex-1 truncate">Course Home</span>
    </NavLink>
  )
  const AllGuidesItem = () => {
    const guideUrl = (slug) => `https://${slug}-study-guide.vercel.app/`
    const hubUrl = 'https://scada-hub.vercel.app'
    const GUIDE_LIST = [
      { name: 'Modbus', slug: 'modbus', color: '#60a5fa', Icon: Network },
      { name: 'OPC UA', slug: 'opcua', color: '#a78bfa', Icon: Globe },
      { name: 'DNP3', slug: 'dnp3', color: '#fbbf24', Icon: Zap },
      { name: 'IEC 61131-3', slug: 'iec61131', color: '#2dd4bf', Icon: Code2 },
      { name: 'PID Controllers', slug: 'pid', color: '#4ade80', Icon: Sliders },
      { name: 'SEL RTAC', slug: 'rtac', color: '#818cf8', Icon: Server },
      { name: 'Ignition SCADA', slug: 'ignition', color: '#fb923c', Icon: LayoutDashboard },
      { name: 'Wireshark', slug: 'wireshark', color: '#38bdf8', Icon: ScanSearch },
    ]
    return (
      <div>
        <button
          onClick={() => setShowGuides(g => !g)}
          className="chapter-nav-item w-full"
        >
          <LayoutGrid size={15} className="flex-shrink-0 opacity-70" />
          <span className="flex-1 text-left">All Courses</span>
          <ChevronDown size={13} className="flex-shrink-0 opacity-50 transition-transform" style={{ transform: showGuides ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
        {showGuides && (
          <div className="ml-2 mt-0.5 space-y-0.5">
            {GUIDE_LIST.map((g) => (
              <a
                key={g.name}
                href={guideUrl(g.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: g.color + '22' }}>
                  <g.Icon size={11} style={{ color: g.color }} />
                </div>
                <span className="truncate">{g.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }



  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center lg:cursor-default"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 0 16px rgba(245,158,11,0.4)' }}
          >
            <Zap size={20} className="text-black" />
          </button>
          <div>
            <div className="font-black text-amber-400 leading-tight tracking-wide">DNP3</div>
            <div className="text-xs font-medium" style={{ color: 'rgba(245,158,11,0.55)' }}>Study Guide</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(245,158,11,0.6)' }}>
            <span>Overall Progress</span>
            <span className="font-bold text-amber-400">{prog.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <div className="progress-bar h-full" style={{ width: `${prog.pct}%` }} />
          </div>
          {/* Streak counter */}
          {streak > 1 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span style={{ fontSize: '0.7rem' }}>🔥</span>
              <span className="text-xs font-bold" style={{ color: '#f97316' }}>{streak}-day streak</span>
              <span className="text-xs" style={{ color: 'rgba(249,115,22,0.4)' }}>— don't break it</span>
            </div>
          )}
          {/* Completion counter */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex gap-3">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />L1: {prog.l1 || 0}</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />L2: {prog.l2 || 0}</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />L3: {prog.l3 || 0}</span>
            </div>
            <span className="font-medium transition-colors" style={{ color: remaining === 0 ? '#4ade80' : '#64748b' }}>
              {remaining === 0
                ? 'All done ✓'
                : completedCount === 0
                  ? `${totalChapters} to finish`
                  : `${remaining} left`}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <HomeItem />
        <AllGuidesItem />
        <div>
          <button
            onClick={() => setShowChapters(c => !c)}
            className="chapter-nav-item w-full"
          >
            <BookOpen size={15} className="flex-shrink-0 opacity-70" />
            <span className="flex-1 text-left">Chapters</span>
            <ChevronDown size={13} className="flex-shrink-0 opacity-50 transition-transform" style={{ transform: showChapters ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {showChapters && (
            <div className="ml-1 space-y-0.5 mt-0.5">
              {CHAPTERS.filter(ch => ch.id !== 'home').map((ch) => (
                <NavItem key={ch.id} ch={ch} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Extras */}
      <div className="px-3 pb-2 space-y-0.5" style={{ borderTop: '1px solid rgba(245,158,11,0.10)' }}>
        <div className="pt-2" />
        <NavLink
          to="/flashcards"
          onClick={() => setOpen(false)}
          className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={16} className="flex-shrink-0" />
          <span className="flex-1">Flashcards</span>
        </NavLink>
          <button
            onClick={() => setShowTraining(true)}
            className="chapter-nav-item w-full mt-0.5"
          >
            <GraduationCap size={15} className="text-blue-400 flex-shrink-0" />
            <span className="flex-1 text-left truncate">More Training</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full text-blue-400"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              LIVE
            </span>
          </button>
      </div>      <BadgeTray />


      {/* Footer */}
      <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
        <a
          href={`${import.meta.env.BASE_URL}study_guide.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-black text-xs font-bold transition-all"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 0 14px rgba(245,158,11,0.35)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          Download PDF Study Guide
        </a>
        <a
          href={`${import.meta.env.BASE_URL}syllabus.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', color: 'rgba(245,158,11,0.7)' }}
        >
          <FileText size={12} />
          Course Syllabus
        </a>
        <a
          href={'https://scada-hub.vercel.app'}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', color: 'rgba(245,158,11,0.7)' }}
        >
          <LayoutGrid size={12} />
          ← SCADA Hub
        </a>
        <NavLink
          to="/report"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', color: 'rgba(245,158,11,0.7)' }}
        >
          <BarChart2 size={12} />
          Quiz Results
        </NavLink>
        <p className="text-center text-xs" style={{ color: 'rgba(245,158,11,0.35)' }}>
          DNP3 · IEEE 1815 · May 2026
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 text-black rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{ background: 'rgba(8,13,16,0.95)', borderRight: '1px solid rgba(245,158,11,0.12)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 z-50 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(8,13,16,0.98)', borderRight: '1px solid rgba(245,158,11,0.15)' }}
      >
        <SidebarContent />
      </aside>
      {showTraining && <TrainingModal course="dnp3" onClose={() => setShowTraining(false)} />}
    </>
  )
}
