import { useRef } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_LABELS = {
  pending: 'En Attente',
  accepted: 'Acceptés',
  refused: 'Refusés',
}

const URGENCE_COLORS = {
  critique: '#FF0040',
  urgent: '#FF4500',
  moyen: '#FF8C00',
  faible: '#FFD700',
  normal: '#00E676',
}

export default function PrintTable({ appointments, type, onClose }) {
  const printRef = useRef(null)

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Tableau RDV - ${TYPE_LABELS[type]} - ${format(new Date(), 'dd/MM/yyyy')}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 20px; }
          .print-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0066cc; padding-bottom: 20px; }
          .print-title { font-size: 22px; font-weight: 700; color: #0066cc; text-transform: uppercase; letter-spacing: 3px; }
          .print-sub { font-size: 13px; color: #666; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #0066cc; color: white; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
          td { padding: 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
          tr:nth-child(even) td { background: #f8fafc; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; }
          .urgence-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
          .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 12px; }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 500)
  }

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 1000, maxHeight: '85vh' }}
      >
        <div className="modal-header">
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9rem',
              color: 'var(--cyan)', letterSpacing: 2,
            }}>
              🖨️ TABLEAU D'IMPRESSION — {TYPE_LABELS[type].toUpperCase()}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              {appointments.length} rendez-vous
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ Imprimer
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
            >×</button>
          </div>
        </div>

        <div className="modal-body">
          <div ref={printRef}>
            <div className="print-header">
              <div className="print-title">
                Tableau des Rendez-vous — {TYPE_LABELS[type]}
              </div>
              <div className="print-sub">
                Généré le {format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })} | Total : {appointments.length} RDV
              </div>
            </div>

            {appointments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                Aucun rendez-vous dans cette catégorie.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Réf.</th>
                    <th>Urgence</th>
                    <th>Nom / Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Objet</th>
                    <th>Date</th>
                    <th>Heure</th>
                    {type === 'refused' && <th>Motif</th>}
                    <th>Enregistré le</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>#{String(apt.id).padStart(6, '0')}</td>
                      <td>
                        <span className="urgence-dot" style={{ background: URGENCE_COLORS[apt.urgence] }} />
                        {apt.urgence_label}
                      </td>
                      <td><strong>{apt.prenom} {apt.nom}</strong></td>
                      <td>{apt.email}</td>
                      <td>{apt.telephone}</td>
                      <td>{apt.objet}</td>
                      <td>{format(new Date(apt.date_rdv), 'dd/MM/yyyy')}</td>
                      <td>{apt.heure_rdv}</td>
                      {type === 'refused' && <td>{apt.motif_refus || '—'}</td>}
                      <td>{apt.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="footer">
              Système de Gestion des Rendez-vous — Document confidentiel — {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
