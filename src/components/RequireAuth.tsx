import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface AdminResolution {
  userId: string
  isAdmin: boolean
  error: string | null
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth()
  const [resolved, setResolved] = useState<AdminResolution | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)
  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle()

        if (cancelled) return

        setResolved({
          userId,
          isAdmin: !error && data?.role === 'admin',
          error: error ? error.message || 'Failed to verify admin access' : null,
        })
      } catch {
        if (!cancelled) {
          setResolved({ userId, isAdmin: false, error: 'Failed to verify admin access' })
        }
      }
    }

    void checkAdmin()

    return () => {
      cancelled = true
    }
  }, [userId])

  const handleUnauthorizedSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    setSignOutError(null)

    const { error } = await logout()
    if (error) {
      setSignOutError(error.message)
      setIsSigningOut(false)
    }
  }

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

  if (!resolved || resolved.userId !== user.id) {
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
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-[#71717a] mb-4">This account is not authorized to access the CMS.</p>
          {signOutError && <p className="text-sm text-red-300 mb-4" role="alert">{signOutError}</p>}
          <button
            type="button"
            onClick={handleUnauthorizedSignOut}
            disabled={isSigningOut}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
