import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading: authLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

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
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={logo} alt="Asfi Ahamed" className="w-14 h-14 mx-auto mb-4 object-contain" />
          <h1 className="text-white text-3xl font-semibold">Admin Login</h1>
          <p className="text-[#71717a] mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full rounded-2xl px-12 h-12 text-lg"
                placeholder="admin@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#a1a1aa] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a]" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full rounded-2xl px-12 h-12 text-lg pr-12"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="btn-primary w-full h-14 rounded-2xl text-lg font-medium flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#71717a] mt-8">
          <a href="/" className="hover:text-white">← Back to portfolio</a>
        </p>
      </div>
    </div>
  )
}