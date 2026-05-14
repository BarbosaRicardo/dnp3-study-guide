import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Zap, LayoutGrid, BookOpen, BarChart2 } from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { getChapterStatus, overallProgress } = useProgress()
  const prog = overallProgress()

  const NavItem = ({ ch }) => {
    const status = getChapterStatus(ch.id)
    return (
      <NavLink
        to={ch.path}
        onClick={() => setOpen(false)}
        className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="text-lg leading-none">{ch.emoji}</span>
        <span className="flex-1 truncate">{ch.label}</span>
        <div className="flex gap-0.5 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${status.level1Passed ? 'bg-green-400' : status.visited ? 'bg-amber-400' : 'bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level2Passed ? 'bg-amber-400' : 'bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level3Passed ? 'bg-amber-200' : 'bg-slate-700'}`} />
        </div>
      </NavLink>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 0 16px rgba(245,158,11,0.4)' }}
          >
            <Zap size={20} className="text-black" />
          </div>
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
          <div className="mt-1.5 flex gap-3 text-xs">
            <span className="text-green-400">L1: {prog.l1 || 0}</span>
            <span className="text-amber-400">L2: {prog.l2 || 0}</span>
            <span className="text-amber-200">L3: {prog.l3 || 0}</span>
            <span className="ml-auto" style={{ color: 'rgba(245,158,11,0.4)' }}>{prog.visited} read</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {CHAPTERS.map((ch) => (
          <NavItem key={ch.id} ch={ch} />
        ))}
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
        <NavLink
          to="/report"
          onClick={() => setOpen(false)}
          className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
        >
          <BarChart2 size={16} className="flex-shrink-0" />
          <span className="flex-1">Quiz Report</span>
        </NavLink>
      </div>

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
          href="https://barbosaricardo.github.io/scada-hub/"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', color: 'rgba(245,158,11,0.7)' }}
        >
          <LayoutGrid size={12} />
          ← SCADA Hub
        </a>
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
    </>
  )
}
