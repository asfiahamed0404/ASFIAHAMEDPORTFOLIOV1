import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const [resolved, setResolved] = useState<{ isAdmin: boolean; error: string | null } | null>(null)
  const inFlight = useRef(false)
  const ADMIN_EMAIL = 'asfiportfolio@gmail.com'

  useEffect(() => {
    if (!user) {
      setResolved(null)
      return
    }
    if (inFlight.current) return
    inFlight.current = true

    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        setResolved({ isAdmin: false, error: error.message || 'Failed to verify admin access' })
      } else if (data?.role === 'admin') {
        setResolved({ isAdmin: true, error: null })
      } else if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setResolved({ isAdmin: true, error: null })
      } else {
        setResolved({ isAdmin: false, error: null })
      }
      inFlight.current = false
    }
    checkAdmin()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!resolved) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (resolved.error) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Unable to verify admin access</h2>
          <p className="text-[#71717a] mb-4">{resolved.error}</p>
          <p className="text-sm text-[#71717a]">Check Supabase dashboard → Project Status</p>
        </div>
      </div>
    )
  }

  if (!resolved.isAdmin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}