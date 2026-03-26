import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppointmentModal from '../components/AppointmentModal'
import ParticleField from '../components/ParticleField'

const stats = [
  { value: '99.8%', label: 'Disponibilité' },
  { value: '< 2min', label: 'Temps de réponse' },
  { value: '24/7', label: 'Accessibilité' },
  { value: '100%', label: 'Sécurisé' },
]

const features = [
  {
    icon: '⚡',
    title: 'Prise de RDV Instantanée',
    desc: 'Réservez votre créneau en quelques secondes avec notre système de calendrier intelligent.'
  },
  {
    icon: '🛡️',
    title: 'Suivi en Temps Réel',
    desc: 'Recevez des notifications instantanées par email à chaque étape de votre demande.'
  },
  {
    icon: '🎯',
    title: 'Gestion des Priorités',
    desc: 'Système de tri par urgence garantissant un traitement optimal de chaque demande.'
  },
  {
    icon: '🔐',
    title: 'Données Sécurisées',
    desc: 'Vos informations personnelles sont protégées avec les standards de sécurité les plus élevés.'
  },
]

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <ParticleField />

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="nav-bar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '16px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrollY > 50 ? 'rgba(5,10,20,0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(0,220,255,0.15)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(0,100,200,0.4), rgba(0,220,255,0.2))',
            border: '1px solid rgba(0,220,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>📅</div>
          <span className="nav-brand-text" style={{
            fontFamily: 'var(--font-display)', fontSize: '1rem',
            color: 'var(--cyan)', letterSpacing: 3, fontWeight: 700,
          }}>SYSTÈME<span style={{ color: 'rgba(0,220,255,0.5)' }}>·</span>RDV</span>
        </div>

        <div className="nav-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/admin" style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            letterSpacing: 2, color: 'var(--text-muted)',
            textDecoration: 'none', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >Admin</a>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Prendre RDV
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="hero-section" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
      }}>
        {/* Glowing orb */}
        <div className="hero-orb" style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,220,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, position: 'relative' }}>
          {/* Pre-title badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,220,255,0.08)', border: '1px solid rgba(0,220,255,0.3)',
              borderRadius: 100, padding: '8px 20px', marginBottom: 32,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00E676',
              boxShadow: '0 0 10px #00E676',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.65rem',
              letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase',
            }}>
              Système Actif — En Ligne
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900, lineHeight: 1.1,
              marginBottom: 24,
              background: 'linear-gradient(135deg, #ffffff 0%, #00dcff 40%, #ffffff 80%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            GESTION DE
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00dcff, #0066ff)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>RENDEZ-VOUS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '1.2rem', color: 'var(--text-secondary)',
              maxWidth: 600, margin: '0 auto 48px',
              fontWeight: 400, lineHeight: 1.8,
            }}
          >
            Planifiez, gérez et suivez vos rendez-vous avec précision.
            Une interface de nouvelle génération pour une expérience sans friction.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowModal(true)}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>📅 Prendre un Rendez-vous</span>
            </button>
            <a href="#features">
              <button className="btn btn-ghost btn-lg">
                En savoir plus ↓
              </button>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              display: 'flex', gap: 0, justifyContent: 'center', marginTop: 80,
              border: '1px solid var(--border-cyan)', borderRadius: 12,
              overflow: 'hidden', maxWidth: 700, margin: '80px auto 0',
            }}
          >
            {stats.map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: '24px 16px', textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid var(--border-cyan)' : 'none',
                background: 'rgba(0,220,255,0.02)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                  fontWeight: 900, color: 'var(--cyan)',
                  textShadow: '0 0 20px rgba(0,220,255,0.5)',
                }}>{s.value}</div>
                <div style={{
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: 2, marginTop: 4,
                }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
            letterSpacing: 4, color: 'var(--cyan)', textTransform: 'uppercase',
            marginBottom: 16,
          }}>Fonctionnalités</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700, color: '#fff',
          }}>Une Plateforme Complète</h2>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ cursor: 'default' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'rgba(0,220,255,0.08)', border: '1px solid rgba(0,220,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 20,
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '0.9rem',
                color: '#fff', letterSpacing: 1, marginBottom: 12,
              }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{
        padding: '80px 40px', textAlign: 'center',
        borderTop: '1px solid var(--border-cyan)',
        background: 'linear-gradient(180deg, transparent, rgba(0,220,255,0.03))',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#fff', marginBottom: 16,
          }}>Prêt à Planifier ?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: '1.1rem' }}>
            Réservez votre créneau maintenant. Confirmation par email garantie.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            🚀 Commencer maintenant
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{
        padding: '32px 40px', textAlign: 'center',
        borderTop: '1px solid var(--border-cyan)',
        color: 'var(--text-muted)', fontSize: '0.85rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: 3 }}>
          SYSTÈME RDV © {new Date().getFullYear()} — Tous droits réservés
        </span>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
