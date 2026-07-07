import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading: authLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/admin', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setIsSubmitting(true)
    const { error } = await login(email, password)
    if (error) {
      toast.error(error.message)
      setIsSubmitting(false)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <main className="admin-login-screen">
      <div className="admin-login-grid" aria-hidden="true" />
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="brand-mark">
            <img src={logo} alt="Asfi Ahamed" className="h-8 w-8 object-contain" />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#7dd3fc]">Portfolio CMS</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back</h1>
          </div>
        </div>

        <div className="admin-login-note">
          <ShieldCheck size={18} />
          <span>Secure Supabase admin access</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="admin-login-field">
            <span>Email</span>
            <div className="admin-login-input-wrap">
              <Mail size={19} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-login-input"
                placeholder="admin@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <div className="admin-login-input-wrap">
              <Lock size={19} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input pr-12"
                placeholder="Password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <button type="submit" disabled={isSubmitting || authLoading} className="admin-login-submit">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="admin-login-back">
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>
      </section>
    </main>
  )
}
