import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const res = await api.post('/admin/login', { email, password })
    const { token, admin: adminData } = res.data.data
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(adminData))
    setAdmin(adminData)
    return adminData
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/admin/logout') } catch {}
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAdmin(null)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
