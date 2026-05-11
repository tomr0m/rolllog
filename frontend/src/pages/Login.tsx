import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      login(res.data.access_token, res.data.user)
      navigate(res.data.user.onboarding_done ? '/dashboard' : '/onboarding', { replace: true })
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout heading="Enter the Mat." tagline="Classic Login — Email & Password">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="fighter@gym.com"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {error && (
          <p style={{ fontSize: '0.7rem', color: '#8B1A1A', fontFamily: 'var(--font-serif)', fontStyle: 'italic', borderLeft: '2px solid #8B1A1A', paddingLeft: '0.75rem' }}>
            {error}
          </p>
        )}
        <Button type="submit" fullWidth loading={loading} style={{ marginTop: '0.5rem' }}>
          Enter the Mat →
        </Button>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#737373', paddingTop: '0.5rem' }}>
          Quick start?{' '}
          <a href="/" style={{ color: '#8B1A1A', textDecoration: 'none' }}>
            Back to home →
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}
