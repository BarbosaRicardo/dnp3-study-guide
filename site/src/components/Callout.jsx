import React from 'react'
import { Lightbulb, AlertTriangle, FlaskConical, Star, Cpu } from 'lucide-react'

const TYPES = {
  key:     { icon: Lightbulb,     bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-800',   label: 'text-blue-600',   iconBg: 'bg-blue-500',   title: 'Key Concept' },
  warning: { icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', label: 'text-orange-600', iconBg: 'bg-orange-500', title: 'Warning' },
  example: { icon: FlaskConical,  bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-800',  label: 'text-green-600',  iconBg: 'bg-green-500',  title: 'Example' },
  pro:     { icon: Star,          bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-800',  label: 'text-amber-600',  iconBg: 'bg-amber-500',  title: 'Pro Tip' },
  field:   { icon: Cpu,           bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-800',    label: 'text-red-600',    iconBg: 'bg-red-500',    title: '⚠️ Field Gotcha' },
}

export default function Callout({ type = 'key', title, children }) {
  const t = TYPES[type] || TYPES.key
  const Icon = t.icon

  return (
    <div className={`rounded-2xl border ${t.bg} ${t.border} p-5 my-5`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 ${t.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <div className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${t.label}`}>
            {title || t.title}
          </div>
          <div className={`text-sm leading-relaxed ${t.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
