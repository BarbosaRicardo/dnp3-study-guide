import React from 'react'
import { Lightbulb, AlertTriangle, FlaskConical, Star, Cpu } from 'lucide-react'

const TYPES = {
  key: {
    icon: Lightbulb,
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    text: '#93c5fd',
    label: '#60a5fa',
    iconBg: '#1d4ed8',
    title: 'Key Concept',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    text: '#fca5a5',
    label: '#f87171',
    iconBg: '#b91c1c',
    title: 'Warning',
  },
  example: {
    icon: FlaskConical,
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.28)',
    text: '#86efac',
    label: '#4ade80',
    iconBg: '#15803d',
    title: 'Example',
  },
  pro: {
    icon: Star,
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    text: '#fde68a',
    label: '#fbbf24',
    iconBg: '#b45309',
    title: 'Pro Tip',
  },
  field: {
    icon: Cpu,
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.35)',
    text: '#fca5a5',
    label: '#f87171',
    iconBg: '#991b1b',
    title: 'Field Gotcha',
  },
}

export default function Callout({ type = 'key', title, children }) {
  const t = TYPES[type] || TYPES.key
  const Icon = t.icon

  return (
    <div
      className="rounded-2xl p-5 my-5"
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: t.iconBg }}
        >
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: t.label }}>
            {title || t.title}
          </div>
          <div className="text-sm leading-relaxed" style={{ color: t.text }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
