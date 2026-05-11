import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      login(res.data.access_token, res.data.user)
      navigate(res.data.user.onboarding_done ? '/dashboard' : '/onboarding', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout heading="ENTER THE MAT" tagline="Train. Track. Tap them.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="fighter@gym.com"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {error && (
          <p className="text-sm text-red-500 font-medium border-l-2 border-red-600 pl-3">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Enter the Mat
        </Button>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-600 pt-2">
          New fighter?{' '}
          <Link
            to="/signup"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Create Account →
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
