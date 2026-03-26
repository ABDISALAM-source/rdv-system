import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RefuseModal({ onSubmit, onClose }) {
  const [motif, setMotif] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (motif.trim().length < 10) {
      setError('Le motif doit contenir au moins 10 caractères.')
      return
    }
    onSubmit(motif)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 520 }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,107,53,0.3)' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9rem',
              color: '#FF6B35', letterSpacing: 2,
            }}>REFUS AVEC EXPLICATION</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              Le client recevra votre explication par email.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '1.5rem', cursor: 'pointer',
            }}
          >×</button>
        </div>

        <div className="modal-body">
          <div style={{
            padding: '14px 16px', background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.2)', borderRadius: 8, marginBottom: 24,
            fontSize: '0.85rem', color: 'var(--text-secondary)',
          }}>
            ⚠️ Cette explication sera transmise directement au demandeur par email.
            Soyez clair et professionnel.
          </div>

          <label className="field-label">Motif du refus *</label>
          <textarea
            className="input-field"
            value={motif}
            onChange={e => { setMotif(e.target.value); setError('') }}
            placeholder="Expliquez la raison du refus (ex: créneau incompatible, manque d'informations, hors périmètre...)&#10;&#10;Minimum 10 caractères."
            rows={6}
            style={{ resize: 'vertical', marginBottom: 8 }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          }}>
            {error ? (
              <span style={{ color: '#FF3355', fontSize: '0.8rem' }}>{error}</span>
            ) : <span />}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {motif.length} / 1000
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button
              className="btn btn-danger"
              onClick={handleSubmit}
              style={{ borderColor: 'rgba(255,107,53,0.4)', color: '#FF6B35' }}
            >
              💬 Envoyer le refus
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
