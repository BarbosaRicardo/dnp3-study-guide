import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CheckCircle2, Circle, Menu, X, Radio } from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { getChapterStatus, overallProgress } = useProgress()
  const location = useLocation()
  const prog = overallProgress()

  const NavItem = ({ ch }) => {
    const status = getChapterStatus(ch.id)

    return (
      <NavLink
        to={ch.path}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `chapter-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <span className="text-lg leading-none">{ch.emoji}</span>
        <span className="flex-1 truncate">{ch.label}</span>
        <div className="flex gap-0.5 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${status.level1Passed ? 'bg-mgreen-400' : status.visited ? 'bg-amber-400' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level2Passed ? 'bg-amber-500' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level3Passed ? 'bg-orange-500' : 'bg-slate-200'}`} />
        </div>
      </NavLink>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mblue-600 rounded-xl flex items-center justify-center">
            <Radio size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-navy-700 leading-tight">DNP3</div>
            <div className="text-xs text-slate-400 font-medium">Study Guide</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Overall Progress</span>
            <span className="font-semibold text-mblue-600">{prog.pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="progress-bar"
              style={{ width: `${prog.pct}%` }}
            />
          </div>
          <div className="mt-1 flex gap-2 text-xs">
            <span className="text-mgreen-400">L1: {prog.l1 || 0}</span>
            <span className="text-amber-400">L2: {prog.l2 || 0}</span>
            <span className="text-orange-400">L3: {prog.l3 || 0}</span>
            <span className="text-slate-400 ml-auto">{prog.visited} read</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {CHAPTERS.map((ch) => (
          <NavItem key={ch.id} ch={ch} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <a
          href={`${import.meta.env.BASE_URL}study_guide.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-mblue-600 hover:bg-mblue-700 text-white text-xs font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          Download Study Guide PDF
        </a>
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          SCADA Automation Engineering<br />
          <span className="text-mblue-400">DNP3 Protocol · May 2026</span>
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-mblue-600 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`
        lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>
    </>
  )
}
