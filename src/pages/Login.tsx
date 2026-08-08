import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'
import '../styles/login.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginErrorField = 'email' | 'password' | null

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading: authLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errorField, setErrorField] = useState<LoginErrorField>(null)

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/admin', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setErrorField(null)

    if (!email.trim()) {
      const message = 'Enter your email address.'
      setFormError(message)
      setErrorField('email')
      toast.error('Please fill in all fields')
      return
    }

    if (!EMAIL_PATTERN.test(email)) {
      const message = 'Enter a valid email address.'
      setFormError(message)
      setErrorField('email')
      toast.error(message)
      return
    }

    if (!password) {
      const message = 'Enter your password.'
      setFormError(message)
      setErrorField('password')
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    const { error } = await login(email, password)
    if (error) {
      setFormError(error.message)
      toast.error(error.message)
      setIsSubmitting(false)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <main className="login-screen">
      <div className="login-ambient" aria-hidden="true" />

      <section
        className="login-card"
        aria-labelledby="login-title"
        aria-describedby="login-description"
      >
        <header className="login-header">
          <div className="login-brand-row">
            <div className="login-brand">
              <span className="login-logo" aria-hidden="true">
                <img src={logo} alt="" />
              </span>
              <div>
                <p className="login-product-name">Asfi Ahamed</p>
                <p className="login-product-meta">Portfolio CMS</p>
              </div>
            </div>

            <p className="login-security-note">
              <ShieldCheck size={15} aria-hidden="true" />
              Secure admin access
            </p>
          </div>

          <div className="login-heading">
            <h1 id="login-title" className="login-title">Welcome back</h1>
            <p id="login-description" className="login-description">
              Sign in to manage your portfolio content.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="login-form"
          noValidate
          aria-busy={isSubmitting || authLoading}
        >
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">Email address</label>
            <div className="login-input-control">
              <Mail size={18} aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (formError) {
                    setFormError(null)
                    setErrorField(null)
                  }
                }}
                className="login-input"
                placeholder="Email address"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={isSubmitting}
                aria-invalid={errorField === 'email'}
                aria-describedby={errorField === 'email' ? 'login-error' : undefined}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-label">Password</label>
            <div className="login-input-control login-password-control">
              <Lock size={18} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (formError) {
                    setFormError(null)
                    setErrorField(null)
                  }
                }}
                className="login-input"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                aria-invalid={errorField === 'password'}
                aria-describedby={errorField === 'password' ? 'login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="login-password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {formError && (
            <div id="login-error" className="login-error" role="alert">
              <span className="login-error-mark" aria-hidden="true">!</span>
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="login-submit"
          >
            {isSubmitting && <span className="login-spinner" aria-hidden="true" />}
            <span>{isSubmitting ? 'Signing in' : 'Sign in'}</span>
          </button>

          <span className="login-live-status" aria-live="polite" aria-atomic="true">
            {isSubmitting ? 'Signing in to the admin dashboard.' : ''}
          </span>
        </form>

        <Link to="/" className="login-back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to portfolio
        </Link>
      </section>
    </main>
  )
}
