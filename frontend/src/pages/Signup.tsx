import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (name.length < 2 || name.length > 50) e.name = 'Name must be 2–50 characters'
    if (password.length < 8) e.password = 'Password must be at least 8 characters'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await api.post('/api/auth/signup', { email, password, name })
      login(res.data.access_token, res.data.user)
      navigate('/onboarding', { replace: true })
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setErrors({ general: typeof detail === 'string' ? detail : 'Something went wrong. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout heading="STEP ON THE MAT" tagline="Train. Track. Tap them.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Fighter Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          error={errors.name}
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="fighter@gym.com"
          error={errors.email}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          error={errors.password}
          autoComplete="new-password"
          required
        />
        {errors.general && (
          <p className="text-sm text-red-500 font-medium border-l-2 border-red-600 pl-3">
            {errors.general}
          </p>
        )}
        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Begin Your Journey
        </Button>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-600 pt-2">
          Already a fighter?{' '}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Log In →
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
