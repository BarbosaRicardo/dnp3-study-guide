import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Zap, LayoutGrid, BookOpen, BarChart2, LogIn, LogOut, Home, Radio, Layers, Link, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical, FileText, ChevronDown, Network, Globe, Code2, Sliders, Server, LayoutDashboard, ScanSearch} from 'lucide-react'
import { CHAPTERS } from '../data/chapters'
import { useProgress } from '../hooks/useProgress'
import { supabase } from '../lib/supabase'

const ICON_MAP = {
  Home, Radio, Layers, Link, Package, FolderTree, Settings, Bell, Shield, Wrench, FlaskConical,
}

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showGuides, setShowGuides] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setSessionLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  function resolveEmail(input) {
    const t = input.trim()
    return t.includes('@') ? t : `${t}@scadahub.io`
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: resolveEmail(loginEmail),
      password: loginPassword,
    })
    setLoginLoading(false)
    if (error) { setLoginError(error.message) } else { setShowLogin(false) }
  }
  const { getChapterStatus, overallProgress } = useProgress()
  const prog = overallProgress()

  const NavItem = ({ ch }) => {
    const status = getChapterStatus(ch.id)
    const Icon = ICON_MAP[ch.icon] || BookOpen
    return (
      <NavLink
        to={ch.path}
        onClick={() => setOpen(false)}
        className={({ isActive }) => `chapter-nav-item ${isActive ? 'active' : ''}`}
      >
        <Icon size={15} className="flex-shrink-0 opacity-70" />
        <span className="flex-1 truncate">{ch.label}</span>
        <div className="flex gap-0.5 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${status.level1Passed ? 'bg-green-400' : status.visited ? 'bg-amber-400' : 'bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level2Passed ? 'bg-amber-400' : 'bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full ${status.level3Passed ? 'bg-amber-200' : 'bg-slate-700'}`} />
        </div>
      </NavLink>
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
      <span className="flex-1 truncate">Home</span>
    </NavLink>
  )
  const AllGuidesItem = () => {
    const isGH = import.meta.env.BASE_URL !== '/'
    const guideUrl = (slug) => isGH
      ? `https://barbosaricardo.github.io/${slug}-study-guide/`
      : `https://${slug}-study-guide.vercel.app/`
    const hubUrl = isGH
      ? 'https://barbosaricardo.github.io/scada-hub/'
      : 'https://scada-hub.vercel.app'
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
        <HomeItem />
        <AllGuidesItem />
        {CHAPTERS.filter(ch => ch.id !== 'home').map((ch) => (
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
          href={import.meta.env.BASE_URL !== '/' ? 'https://barbosaricardo.github.io/scada-hub/' : 'https://scada-hub.vercel.app'}
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
    </>
  )
}
