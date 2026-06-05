import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WallOfLegends from './pages/WallOfLegends'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import TrainingLog from './pages/TrainingLog'
import LogSession from './pages/LogSession'
import Compendium from './pages/Compendium'
import Coach from './pages/Coach'

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#EBE6DA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-5 h-5 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  if (user.onboarding_done) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Wall of Legends — new cinematic login */}
          <Route path="/" element={<WallOfLegends />} />
          <Route path="/login" element={<WallOfLegends />} />

          {/* Classic email/password login — accessible but not linked from main UI */}
          <Route path="/login/classic" element={<Login />} />

          {/* Onboarding wizard */}
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            }
          />

          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Training log */}
          <Route
            path="/log"
            element={
              <ProtectedRoute>
                <TrainingLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log/new"
            element={
              <ProtectedRoute>
                <LogSession />
              </ProtectedRoute>
            }
          />

          {/* Compendium — technique tree */}
          <Route
            path="/techniques"
            element={
              <ProtectedRoute>
                <Compendium />
              </ProtectedRoute>
            }
          />

          {/* Coach — AI insights dashboard */}
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Coach />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
