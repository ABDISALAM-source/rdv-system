import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ParticleField from '../components/ParticleField'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/admin/dashboard')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Remplissez tous les champs.'); return }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Connexion réussie !')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <ParticleField />
      <div className="bg-grid" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 56, marginBottom: 16, display: 'inline-block' }}
          >🔐</motion.div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem',
            color: 'var(--cyan)', letterSpacing: 4, textTransform: 'uppercase',
          }}>Administration</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>
            Système de Gestion RDV
          </div>
        </div>

        <div className="admin-login-card" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-cyan)',
          borderRadius: 16, padding: 40, boxShadow: 'var(--shadow-cyan)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
          }} />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">Adresse Email</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@rdvsystem.fr"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label className="field-label">Mot de passe</label>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '14px', fontSize: '0.8rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                  Connexion...
                </span>
              ) : '→ ACCÉDER AU PANNEAU'}
            </motion.button>
          </form>

          <div style={{
            marginTop: 24, padding: '12px 16px',
            background: 'rgba(0,220,255,0.04)', borderRadius: 8,
            border: '1px solid rgba(0,220,255,0.1)',
            fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center',
          }}>
            Identifiants par défaut : <code style={{ color: 'var(--cyan)' }}>admin@rdvsystem.fr</code>
            <br />Mot de passe : <code style={{ color: 'var(--cyan)' }}>password</code>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{
            color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none',
            fontFamily: 'var(--font-display)', letterSpacing: 2,
          }}
          onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >← Retour à l'accueil</a>
        </div>
      </motion.div>
    </div>
  )
}
