import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import AppointmentTable from '../components/AppointmentTable'
import RefuseModal from '../components/RefuseModal'
import PrintTable from '../components/PrintTable'

const tabs = [
  { key: 'pending',   label: 'En Attente',  icon: '⏳', color: '#FFD700' },
  { key: 'accepted',  label: 'Acceptés',    icon: '✅', color: '#00E676' },
  { key: 'refused',   label: 'Refusés',     icon: '❌', color: '#FF3355' },
]

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  const [appointments, setAppointments] = useState({ pending: [], accepted: [], refused: [] })
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [refuseModal, setRefuseModal] = useState(null) // { id, type }
  const [printModal, setPrintModal] = useState(null) // type
  const [actionLoading, setActionLoading] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pendingRes, acceptedRes, refusedRes, statsRes] = await Promise.all([
        api.get('/admin/appointments/pending'),
        api.get('/admin/appointments/accepted'),
        api.get('/admin/appointments/refused'),
        api.get('/admin/appointments/stats'),
      ])
      setAppointments({
        pending: pendingRes.data.data,
        accepted: acceptedRes.data.data,
        refused: refusedRes.data.data,
      })
      setStats(statsRes.data.data)
    } catch {
      toast.error('Erreur de chargement des données.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  const handleAccept = async (id) => {
    setActionLoading(id + '-accept')
    try {
      await api.patch(`/admin/appointments/${id}/accept`)
      toast.success('Rendez-vous accepté ✓')
      fetchAll()
    } catch { toast.error('Erreur lors de l\'acceptation.') }
    finally { setActionLoading(null) }
  }

  const handleRefuse = async (id) => {
    setActionLoading(id + '-refuse')
    try {
      await api.patch(`/admin/appointments/${id}/refuse`)
      toast.success('Rendez-vous refusé.')
      fetchAll()
    } catch { toast.error('Erreur.') }
    finally { setActionLoading(null) }
  }

  const handleRefuseExplain = async (id, motif) => {
    try {
      await api.patch(`/admin/appointments/${id}/refuse-explain`, { motif })
      toast.success('Rendez-vous refusé avec explication.')
      setRefuseModal(null)
      fetchAll()
    } catch { toast.error('Erreur.') }
  }

  const handleReport = async (id) => {
    setActionLoading(id + '-report')
    try {
      await api.patch(`/admin/appointments/${id}/report`)
      toast.success('Rendez-vous reporté.')
      fetchAll()
    } catch { toast.error('Erreur.') }
    finally { setActionLoading(null) }
  }

  const currentList = appointments[activeTab] || []

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px 40px', position: 'relative', zIndex: 1 }}>
      <div className="bg-grid" />

      {/* Top bar */}
      <div className="admin-topbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-cyan)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.85rem',
            color: 'var(--cyan)', letterSpacing: 3,
          }}>SYSTÈME RDV</span>
          <span style={{
            background: 'rgba(0,220,255,0.1)', border: '1px solid rgba(0,220,255,0.3)',
            borderRadius: 4, padding: '2px 8px', fontSize: '0.65rem',
            fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: 2,
          }}>ADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: 'rgba(0,220,255,0.05)',
            border: '1px solid var(--border-cyan)', borderRadius: 6,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#00E676',
              boxShadow: '0 0 8px #00E676',
            }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{admin?.nom}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            letterSpacing: 4, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8,
          }}>Tableau de bord</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#fff', fontWeight: 900,
          }}>Gestion des Rendez-vous</h1>
        </motion.div>

        {/* Stats cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 32,
        }}>
          {[
            { label: 'Total', value: stats.total, color: 'var(--cyan)', icon: '📊' },
            { label: 'En attente', value: stats.en_attente, color: '#FFD700', icon: '⏳' },
            { label: 'Acceptés', value: stats.accepte, color: '#00E676', icon: '✅' },
            { label: 'Refusés', value: stats.refuse, color: '#FF3355', icon: '❌' },
            { label: 'Critiques', value: stats.critique, color: '#FF0040', icon: '🔴' },
            { label: 'Urgents', value: stats.urgent, color: '#FF4500', icon: '🟠' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-cyan)',
                borderRadius: 12, padding: '20px 16px', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                color: s.color, fontWeight: 900,
                textShadow: `0 0 20px ${s.color}60`,
              }}>
                {loading ? '—' : (s.value ?? 0)}
              </div>
              <div style={{
                fontSize: '0.65rem', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 2, marginTop: 4,
              }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Print buttons */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
          padding: '16px 20px', background: 'var(--bg-card)',
          border: '1px solid var(--border-cyan)', borderRadius: 12,
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase',
            marginRight: 8,
          }}>🖨️ Imprimer :</span>
          <button className="btn btn-success btn-sm" onClick={() => setPrintModal('accepted')}>
            ✅ Acceptés
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setPrintModal('refused')}>
            ❌ Refusés
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPrintModal('pending')}>
            ⏳ En attente
          </button>
          <button className="btn btn-ghost btn-sm" onClick={fetchAll} style={{ marginLeft: 'auto' }}>
            ↻ Actualiser
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: 'var(--bg-card)', border: '1px solid var(--border-cyan)',
          borderRadius: 10, padding: 6,
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: '10px 16px',
                border: 'none', borderRadius: 8,
                fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === t.key ? `rgba(${hexToRgb(t.color)}, 0.15)` : 'transparent',
                color: activeTab === t.key ? t.color : 'var(--text-muted)',
                borderBottom: activeTab === t.key ? `2px solid ${t.color}` : '2px solid transparent',
              }}
            >
              {t.icon} {t.label}
              {appointments[t.key]?.length > 0 && (
                <span style={{
                  marginLeft: 8, background: activeTab === t.key ? t.color : 'rgba(255,255,255,0.1)',
                  color: activeTab === t.key ? '#000' : 'var(--text-muted)',
                  borderRadius: 100, padding: '1px 7px', fontSize: '0.65rem',
                  fontWeight: 700,
                }}>
                  {appointments[t.key].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 80, color: 'var(--text-muted)', fontSize: '0.9rem',
              }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: 12, fontSize: '1.5rem' }}>⟳</span>
                Chargement...
              </div>
            ) : (
              <AppointmentTable
                appointments={currentList}
                type={activeTab}
                actionLoading={actionLoading}
                onAccept={handleAccept}
                onRefuse={handleRefuse}
                onRefuseExplain={(id) => setRefuseModal({ id, type: 'explain' })}
                onReport={handleReport}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Refuse modal */}
      <AnimatePresence>
        {refuseModal && (
          <RefuseModal
            onSubmit={(motif) => handleRefuseExplain(refuseModal.id, motif)}
            onClose={() => setRefuseModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Print modal */}
      <AnimatePresence>
        {printModal && (
          <PrintTable
            appointments={appointments[printModal] || []}
            type={printModal}
            onClose={() => setPrintModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function hexToRgb(hex) {
  if (hex.startsWith('var(')) return '0,220,255'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
