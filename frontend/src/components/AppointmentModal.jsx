import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import Calendar from './Calendar'
import api from '../utils/api'

const URGENCES = [
  { value: 'normal',   label: 'Normal',   color: '#00E676', desc: 'Aucune urgence particulière' },
  { value: 'faible',   label: 'Faible',   color: '#FFD700', desc: 'Léger inconfort' },
  { value: 'moyen',    label: 'Moyen',    color: '#FF8C00', desc: 'Nécessite attention' },
  { value: 'urgent',   label: 'Urgent',   color: '#FF4500', desc: 'Traitement rapide requis' },
  { value: 'critique', label: 'Critique', color: '#FF0040', desc: 'Situation critique' },
]

const steps = ['Informations', 'Calendrier', 'Urgence', 'Confirmation']

export default function AppointmentModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refNum, setRefNum] = useState(null)

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    sexe: '', objet: '', description: '',
    date_rdv: null, heure_rdv: '',
    urgence: 'normal',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: null }))
  }

  const validateStep = () => {
    const errs = {}
    if (step === 0) {
      if (!form.nom.trim()) errs.nom = 'Requis'
      if (!form.prenom.trim()) errs.prenom = 'Requis'
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email invalide'
      if (!form.telephone.match(/^[0-9+\s\-]{8,15}$/)) errs.telephone = 'Téléphone invalide'
      if (!form.sexe) errs.sexe = 'Requis'
      if (!form.objet.trim()) errs.objet = 'Requis'
    }
    if (step === 1) {
      if (!form.date_rdv) errs.date_rdv = 'Veuillez sélectionner une date'
      if (!form.heure_rdv) errs.heure_rdv = 'Veuillez sélectionner un horaire'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const prev = () => setStep(s => s - 1)

  const handleCalendarSelect = (date, heure) => {
    set('date_rdv', date)
    set('heure_rdv', heure)
  }

  const submit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        date_rdv: format(form.date_rdv, 'yyyy-MM-dd'),
      }
      const res = await api.post('/appointments', payload)
      setRefNum(res.data.data.id)
      setSubmitted(true)
      toast.success('Rendez-vous enregistré avec succès !')
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Ce créneau vient d\'être réservé. Veuillez en choisir un autre.')
        setStep(1)
      } else if (err.response?.data?.errors) {
        const serverErrors = {}
        Object.entries(err.response.data.errors).forEach(([k, v]) => {
          serverErrors[k] = Array.isArray(v) ? v[0] : v
        })
        setErrors(serverErrors)
        toast.error('Veuillez corriger les erreurs.')
      } else {
        toast.error('Une erreur est survenue. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="modal-container modal-success"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: 500, textAlign: 'center', padding: 60 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{ fontSize: 80, marginBottom: 24 }}
          >✅</motion.div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem',
            color: '#00E676', letterSpacing: 2, marginBottom: 16,
          }}>DEMANDE ENREGISTRÉE</h2>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem',
            color: 'var(--cyan)', marginBottom: 16,
          }}>#{String(refNum).padStart(6, '0')}</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            Un email de confirmation a été envoyé à
          </p>
          <p style={{ color: 'var(--cyan)', marginBottom: 32 }}>{form.email}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 32 }}>
            Votre demande est en cours de traitement. Vous serez notifié par email de la décision.
          </p>
          <button className="btn btn-primary" onClick={onClose}>Fermer</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        className="modal-container scan-effect"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 720 }}
      >
        <div className="modal-header modal-header-compact">
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1rem',
              color: 'var(--cyan)', letterSpacing: 2,
            }}>NOUVEAU RENDEZ-VOUS</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              Étape {step + 1} sur {steps.length}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >×</button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: 'rgba(0,220,255,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              background: 'linear-gradient(90deg, rgba(0,100,200,0.8), var(--cyan))',
              boxShadow: '0 0 10px var(--cyan)',
            }}
          />
        </div>

        {/* Step tabs */}
        <div className="modal-steps" style={{
          display: 'flex', padding: '16px 32px', gap: 8,
          borderBottom: '1px solid var(--border-cyan)',
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, flex: 1,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                background: i <= step ? 'rgba(0,220,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: i === step ? '1px solid var(--cyan)' : '1px solid transparent',
                color: i <= step ? 'var(--cyan)' : 'var(--text-muted)',
                transition: 'all 0.3s',
                boxShadow: i === step ? '0 0 10px rgba(0,220,255,0.3)' : 'none',
                flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="step-label" style={{
                fontSize: '0.75rem', color: i === step ? 'var(--cyan)' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)', letterSpacing: 1,
                display: 'none',
              }}>{s}</span>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1,
                  background: i < step ? 'rgba(0,220,255,0.3)' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div className="modal-body modal-body-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 0: Informations */}
              {step === 0 && (
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label className="field-label">Nom *</label>
                    <input className="input-field" value={form.nom}
                      onChange={e => set('nom', e.target.value)} placeholder="Dupont" />
                    {errors.nom && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.nom}</div>}
                  </div>
                  <div>
                    <label className="field-label">Prénom *</label>
                    <input className="input-field" value={form.prenom}
                      onChange={e => set('prenom', e.target.value)} placeholder="Jean" />
                    {errors.prenom && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.prenom}</div>}
                  </div>
                  <div>
                    <label className="field-label">Email *</label>
                    <input className="input-field" type="email" value={form.email}
                      onChange={e => set('email', e.target.value)} placeholder="jean@email.fr" />
                    {errors.email && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</div>}
                  </div>
                  <div>
                    <label className="field-label">Téléphone *</label>
                    <input className="input-field" value={form.telephone}
                      onChange={e => set('telephone', e.target.value)} placeholder="06 12 34 56 78" />
                    {errors.telephone && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.telephone}</div>}
                  </div>
                  <div>
                    <label className="field-label">Sexe *</label>
                    <select className="input-field" value={form.sexe}
                      onChange={e => set('sexe', e.target.value)}>
                      <option value="">Sélectionner...</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                      <option value="autre">Autre / Ne pas préciser</option>
                    </select>
                    {errors.sexe && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.sexe}</div>}
                  </div>
                  <div>
                    <label className="field-label">Objet du RDV *</label>
                    <input className="input-field" value={form.objet}
                      onChange={e => set('objet', e.target.value)} placeholder="Consultation, Bilan..." />
                    {errors.objet && <div style={{ color: '#FF3355', fontSize: '0.75rem', marginTop: 4 }}>{errors.objet}</div>}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="field-label">Description (optionnel)</label>
                    <textarea className="input-field" value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Décrivez votre demande en détail..."
                      rows={3} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              )}

              {/* STEP 1: Calendar */}
              {step === 1 && (
                <div>
                  <div style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Sélectionnez une date disponible, puis choisissez votre créneau horaire.
                  </div>
                  <Calendar
                    onSelect={handleCalendarSelect}
                    selectedDate={form.date_rdv}
                    selectedHeure={form.heure_rdv}
                  />
                  {(errors.date_rdv || errors.heure_rdv) && (
                    <div style={{ color: '#FF3355', fontSize: '0.8rem', marginTop: 12 }}>
                      {errors.date_rdv || errors.heure_rdv}
                    </div>
                  )}
                  {form.date_rdv && form.heure_rdv && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: 20, padding: '16px 20px',
                        background: 'rgba(0,220,255,0.08)', border: '1px solid rgba(0,220,255,0.3)',
                        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>📅</span>
                      <div>
                        <div style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: 2 }}>
                          CRÉNEAU SÉLECTIONNÉ
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {format(form.date_rdv, 'EEEE d MMMM yyyy', { locale: fr })} à {form.heure_rdv}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 2: Urgence */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
                    Sélectionnez le niveau d'urgence correspondant à votre situation.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {URGENCES.map(u => (
                      <motion.div
                        key={u.value}
                        whileHover={{ scale: 1.01, x: 4 }}
                        onClick={() => set('urgence', u.value)}
                        style={{
                          padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                          border: `1px solid ${form.urgence === u.value ? u.color : 'var(--border-cyan)'}`,
                          background: form.urgence === u.value
                            ? `rgba(${hexToRgb(u.color)}, 0.1)`
                            : 'rgba(0,220,255,0.02)',
                          display: 'flex', alignItems: 'center', gap: 16,
                          transition: 'all 0.2s',
                          boxShadow: form.urgence === u.value ? `0 0 20px rgba(${hexToRgb(u.color)}, 0.2)` : 'none',
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          background: u.color, flexShrink: 0,
                          boxShadow: `0 0 10px ${u.color}`,
                          border: '2px solid rgba(255,255,255,0.2)',
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                            color: form.urgence === u.value ? u.color : 'var(--text-primary)',
                            letterSpacing: 2, marginBottom: 2,
                          }}>{u.label.toUpperCase()}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {u.desc}
                          </div>
                        </div>
                        {form.urgence === u.value && (
                          <div style={{ color: u.color, fontSize: '1.2rem' }}>✓</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Confirmation */}
              {step === 3 && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.7rem',
                      letterSpacing: 3, color: 'var(--cyan)', marginBottom: 4,
                    }}>RÉCAPITULATIF</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Vérifiez vos informations avant de confirmer.
                    </p>
                  </div>

                  <div className="summary-grid" style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24,
                  }}>
                    {[
                      { label: 'Nom', value: `${form.prenom} ${form.nom}` },
                      { label: 'Email', value: form.email },
                      { label: 'Téléphone', value: form.telephone },
                      { label: 'Sexe', value: { homme: 'Homme', femme: 'Femme', autre: 'Autre' }[form.sexe] },
                      { label: 'Objet', value: form.objet, full: true },
                      { label: 'Date', value: format(form.date_rdv, 'EEEE d MMMM yyyy', { locale: fr }), full: true },
                      { label: 'Heure', value: form.heure_rdv },
                    ].map(({ label, value, full }) => (
                      <div key={label} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                        <div style={{
                          fontSize: '0.65rem', fontFamily: 'var(--font-display)',
                          letterSpacing: 2, color: 'var(--text-muted)',
                          textTransform: 'uppercase', marginBottom: 4,
                        }}>{label}</div>
                        <div style={{
                          color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem',
                          padding: '8px 12px',
                          background: 'rgba(0,220,255,0.03)',
                          border: '1px solid var(--border-cyan)',
                          borderRadius: 6,
                        }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '16px 20px', borderRadius: 10,
                    background: `rgba(${hexToRgb(URGENCES.find(u => u.value === form.urgence)?.color || '#00E676')}, 0.1)`,
                    border: `1px solid ${URGENCES.find(u => u.value === form.urgence)?.color || '#00E676'}40`,
                    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
                  }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: URGENCES.find(u => u.value === form.urgence)?.color,
                      boxShadow: `0 0 10px ${URGENCES.find(u => u.value === form.urgence)?.color}`,
                    }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Niveau d'urgence : <strong style={{ color: URGENCES.find(u => u.value === form.urgence)?.color }}>
                        {URGENCES.find(u => u.value === form.urgence)?.label}
                      </strong>
                    </span>
                  </div>

                  <div style={{
                    padding: '14px 16px', background: 'rgba(255,215,0,0.06)',
                    border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8,
                    fontSize: '0.85rem', color: 'var(--text-muted)',
                  }}>
                    ℹ️ Un email de confirmation sera envoyé à <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>.
                    Votre demande sera traitée dans les plus brefs délais.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="modal-navigation" style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 32,
            paddingTop: 24, borderTop: '1px solid var(--border-cyan)',
          }}>
            <button
              className="btn btn-ghost"
              onClick={step === 0 ? onClose : prev}
              disabled={loading}
            >
              {step === 0 ? 'Annuler' : '← Retour'}
            </button>

            {step < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={next}>
                Suivant →
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={submit}
                disabled={loading}
                style={{ minWidth: 160 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                    Envoi...
                  </span>
                ) : '✓ Confirmer le RDV'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
