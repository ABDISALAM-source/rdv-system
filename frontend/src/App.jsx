import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-grid" />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1628',
              color: '#e8f0f8',
              border: '1px solid rgba(0,220,255,0.3)',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
              fontSize: '0.95rem',
            },
            success: { iconTheme: { primary: '#00E676', secondary: '#0d1628' } },
            error: { iconTheme: { primary: '#FF3355', secondary: '#0d1628' } },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
