import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const APP_NAME = 'dnp3'
const LOCAL_KEY = 'quiz_submissions_v1'
const ADMIN_ROLE = 'admin'

function isAdmin(session) {
  return session?.user?.user_metadata?.role === ADMIN_ROLE
}

// ─── Write ────────────────────────────────────────────────────────────────────
export async function recordQuizSubmission({ chapter, level, score, total, attempt }) {
  const { data: { session } } = await supabase.auth.getSession()

  const record = {
    app: APP_NAME,
    chapter,
    level,
    score,
    total,
    pct: Math.round((score / total) * 100),
    passed: score / total >= 0.7,
    attempt,
    user_id: session?.user?.id ?? null,
  }

  // Always cache locally as fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    existing.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: Date.now(), ...record })
    localStorage.setItem(LOCAL_KEY, JSON.stringify(existing))
  } catch {}

  // Persist to Supabase (auth token auto-included by client)
  supabase.from('quiz_submissions').insert(record).then(({ error }) => {
    if (error) console.warn('Supabase insert failed:', error.message)
  })
}

// ─── Read (this app only) ─────────────────────────────────────────────────────
export function useQuizReport() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('quiz_submissions')
        .select('*')
        .eq('app', APP_NAME)
        .order('created_at', { ascending: false })
        .limit(1000)

      // Non-admin authenticated users: filter to own rows only
      // Admin: RLS policy allows all rows — no client-side filter needed
      const { data, error: sbError } = await query
      if (sbError) throw new Error(sbError.message)
      setSubmissions(data || [])
    } catch (e) {
      setError(e.message)
      try { setSubmissions([...JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')].reverse()) } catch {}
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [session])

  return { submissions, loading, error, refresh, isAdmin: isAdmin(session), session }
}

// ─── Read (all apps) — manager/admin view ─────────────────────────────────────
export function useAllSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: sbError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000)
      if (sbError) throw new Error(sbError.message)
      setSubmissions(data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [session])

  return { submissions, loading, error, refresh, isAdmin: isAdmin(session), session }
}
