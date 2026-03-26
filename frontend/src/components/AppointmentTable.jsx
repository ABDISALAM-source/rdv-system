import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const URGENCE_COLORS = {
  critique: '#FF0040',
  urgent: '#FF4500',
  moyen: '#FF8C00',
  faible: '#FFD700',
  normal: '#00E676',
}

const STATUT_LABELS = {
  en_attente: 'En attente',
  accepte: 'Accepté',
  refuse: 'Refusé',
  refuse_explique: 'Refusé (expliqué)',
  reporte: 'Reporté',
}

export default function AppointmentTable({
  appointments, type, actionLoading,
  onAccept, onRefuse, onRefuseExplain, onReport
}) {
  if (appointments.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        background: 'var(--bg-card)', border: '1px solid var(--border-cyan)',
        borderRadius: 12, color: 'var(--text-muted)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>
          {type === 'pending' ? '⏳' : type === 'accepted' ? '✅' : '❌'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', letterSpacing: 2, fontSize: '0.8rem' }}>
          Aucun rendez-vous {type === 'pending' ? 'en attente' : type === 'accepted' ? 'accepté' : 'refusé'}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-cyan)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr style={{ background: 'rgba(0,220,255,0.03)' }}>
              <th>ID</th>
              <th>Urgence</th>
              <th>Nom / Prénom</th>
              <th>Contact</th>
              <th>Objet</th>
              <th>Date & Heure</th>
              <th>Statut</th>
              {type === 'refused' && <th>Motif</th>}
              {type === 'pending' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt, i) => (
              <motion.tr
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  borderLeft: `3px solid ${URGENCE_COLORS[apt.urgence] || '#666'}`,
                }}
              >
                <td data-label="Réf.">
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}>#{String(apt.id).padStart(6, '0')}</span>
                </td>

                <td data-label="Urgence">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: URGENCE_COLORS[apt.urgence],
                      boxShadow: `0 0 8px ${URGENCE_COLORS[apt.urgence]}`,
                      flexShrink: 0,
                      animation: apt.urgence === 'critique' ? 'pulse-glow 1s ease-in-out infinite' : 'none',
                    }} />
                    <span className={`urgence-badge urgence-${apt.urgence}`} style={{ padding: '2px 8px', fontSize: '0.6rem' }}>
                      {apt.urgence_label}
                    </span>
                  </div>
                </td>

                <td data-label="Nom / Prénom">
                  <div style={{ fontWeight: 600 }}>{apt.prenom} {apt.nom}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {apt.sexe === 'homme' ? '♂' : apt.sexe === 'femme' ? '♀' : '⚧'} {apt.sexe}
                  </div>
                </td>

                <td data-label="Contact">
                  <div style={{ fontSize: '0.85rem' }}>{apt.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {apt.telephone}
                  </div>
                </td>

                <td data-label="Objet">
                  <div style={{ fontWeight: 500, maxWidth: 180 }}>{apt.objet}</div>
                  {apt.description && (
                    <div style={{
                      fontSize: '0.75rem', color: 'var(--text-muted)',
                      maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{apt.description}</div>
                  )}
                </td>

                <td data-label="Date & Heure">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cyan)' }}>
                    {format(new Date(apt.date_rdv), 'dd/MM/yyyy')}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {apt.heure_rdv}
                  </div>
                </td>

                <td data-label="Statut">
                  <span className={`statut-badge statut-${apt.statut}`}>
                    {STATUT_LABELS[apt.statut]}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {apt.created_at}
                  </div>
                </td>

                {type === 'refused' && (
                  <td data-label="Motif">
                    {apt.motif_refus ? (
                      <div style={{
                        maxWidth: 200, fontSize: '0.8rem', color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {apt.motif_refus}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                )}

                {type === 'pending' && (
                  <td data-label="Actions">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <motion.button
                        className="btn btn-success btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAccept(apt.id)}
                        disabled={actionLoading === apt.id + '-accept'}
                        title="Accepter"
                      >
                        {actionLoading === apt.id + '-accept' ? '⟳' : '✓ Accepter'}
                      </motion.button>

                      <motion.button
                        className="btn btn-warning btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRefuseExplain(apt.id)}
                        title="Refuser avec explication"
                      >
                        💬 Refuser+
                      </motion.button>

                      <motion.button
                        className="btn btn-danger btn-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRefuse(apt.id)}
                        disabled={actionLoading === apt.id + '-refuse'}
                        title="Refuser directement"
                      >
                        {actionLoading === apt.id + '-refuse' ? '⟳' : '✗ Refuser'}
                      </motion.button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
