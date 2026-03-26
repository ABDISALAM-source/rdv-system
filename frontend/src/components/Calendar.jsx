import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, isBefore, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import api from '../utils/api'

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30',
]

export default function Calendar({ onSelect, selectedDate, selectedHeure }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [unavailableSlots, setUnavailableSlots] = useState({})
  const [loading, setLoading] = useState(false)
  const [showTimes, setShowTimes] = useState(!!selectedDate)
  const [pickedDate, setPickedDate] = useState(selectedDate)

  const fetchUnavailable = useCallback(async (date) => {
    setLoading(true)
    try {
      const res = await api.get('/appointments/unavailable', {
        params: { month: date.getMonth() + 1, year: date.getFullYear() }
      })
      setUnavailableSlots(res.data.data || {})
    } catch {
      setUnavailableSlots({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUnavailable(currentMonth) }, [currentMonth, fetchUnavailable])

  const prev = () => setCurrentMonth(m => subMonths(m, 1))
  const next = () => setCurrentMonth(m => addMonths(m, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const weeks = []
  let day = startDate
  while (day <= endDate) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(day))
      day = addDays(day, 1)
    }
    weeks.push(week)
  }

  const getDayStatus = (date) => {
    const key = format(date, 'yyyy-MM-dd')
    const slots = unavailableSlots[key] || []
    if (slots.length >= TIME_SLOTS.length) return 'full'
    if (slots.length > 0) return 'partial'
    return 'free'
  }

  const handleDayClick = (date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return
    if (!isSameMonth(date, currentMonth)) return
    if (getDayStatus(date) === 'full') return
    setPickedDate(date)
    setShowTimes(true)
  }

  const handleTimeClick = (time) => {
    const dateKey = format(pickedDate, 'yyyy-MM-dd')
    const slots = unavailableSlots[dateKey] || []
    if (slots.includes(time)) return
    onSelect(pickedDate, time)
  }

  const isTimeUnavailable = (time) => {
    if (!pickedDate) return false
    const key = format(pickedDate, 'yyyy-MM-dd')
    return (unavailableSlots[key] || []).includes(time)
  }

  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div>
      {/* Month navigation */}
      <div className="calendar-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <button
          type="button"
          onClick={prev}
          style={{
            background: 'rgba(0,220,255,0.08)', border: '1px solid var(--border-cyan)',
            color: 'var(--cyan)', borderRadius: 6, width: 36, height: 36,
            cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>

        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '0.8rem',
          color: 'var(--cyan)', letterSpacing: 3, textTransform: 'uppercase',
        }}>
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          {loading && <span style={{ marginLeft: 8, opacity: 0.5, fontSize: '0.7rem' }}>...</span>}
        </span>

        <button
          type="button"
          onClick={next}
          style={{
            background: 'rgba(0,220,255,0.08)', border: '1px solid var(--border-cyan)',
            color: 'var(--cyan)', borderRadius: 6, width: 36, height: 36,
            cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      </div>

      {/* Day headers */}
      <div className="calendar-day-labels" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {dayLabels.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontFamily: 'var(--font-display)',
            fontSize: '0.6rem', letterSpacing: 2, color: 'var(--text-muted)',
            padding: '6px 0', textTransform: 'uppercase',
          }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weeks.flat().map((date, i) => {
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isPast = isBefore(date, new Date()) && !isToday(date)
          const isSelected = pickedDate && isSameDay(date, pickedDate)
          const status = isCurrentMonth ? getDayStatus(date) : null

          let bg = 'transparent'
          let color = isCurrentMonth ? 'var(--text-secondary)' : 'var(--text-muted)'
          let border = '1px solid transparent'
          let cursor = 'default'
          let dotColor = null

          if (isCurrentMonth && !isPast) {
            cursor = 'pointer'
            if (status === 'full') {
              color = 'rgba(255,50,50,0.5)'
              dotColor = '#FF3355'
            } else if (status === 'partial') {
              dotColor = '#FF8C00'
            }
          }

          if (isSelected) {
            bg = 'rgba(0,220,255,0.15)'
            border = '1px solid var(--cyan)'
            color = 'var(--cyan)'
          } else if (isToday(date) && isCurrentMonth) {
            bg = 'rgba(0,220,255,0.05)'
            border = '1px solid rgba(0,220,255,0.3)'
          }

          if (isPast && isCurrentMonth) { color = 'var(--text-muted)'; cursor = 'not-allowed' }

          return (
            <motion.div
              key={i}
              whileHover={isCurrentMonth && !isPast && status !== 'full' ? { scale: 1.08 } : {}}
              whileTap={isCurrentMonth && !isPast && status !== 'full' ? { scale: 0.95 } : {}}
              onClick={() => handleDayClick(date)}
              style={{
                borderRadius: 8, padding: '8px 4px',
                textAlign: 'center', background: bg, border, color, cursor,
                position: 'relative', transition: 'all 0.15s',
                opacity: !isCurrentMonth ? 0.3 : 1,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                fontWeight: isToday(date) ? 700 : 400,
              }}>
                {format(date, 'd')}
              </span>
              {dotColor && isCurrentMonth && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: dotColor, margin: '2px auto 0',
                  boxShadow: `0 0 6px ${dotColor}`,
                }} />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend" style={{
        display: 'flex', gap: 16, marginTop: 16,
        padding: '12px 16px', background: 'rgba(0,0,0,0.2)',
        borderRadius: 8, flexWrap: 'wrap',
      }}>
        {[
          { color: '#FF3355', label: 'Complet' },
          { color: '#FF8C00', label: 'Partiel' },
          { color: 'var(--cyan)', label: 'Sélectionné' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
            {label}
          </div>
        ))}
      </div>

      {/* Time slots */}
      <AnimatePresence>
        {showTimes && pickedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 20, overflow: 'hidden' }}
          >
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '0.65rem',
              letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Créneaux disponibles — {format(pickedDate, 'EEEE d MMMM', { locale: fr })}
            </div>
            <div className="time-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            }}>
              {TIME_SLOTS.map(time => {
                const unavail = isTimeUnavailable(time)
                const isSelected = selectedHeure === time && pickedDate && selectedDate && isSameDay(pickedDate, selectedDate)
                return (
                  <motion.button
                    key={time}
                    type="button"
                    whileHover={!unavail ? { scale: 1.05 } : {}}
                    whileTap={!unavail ? { scale: 0.95 } : {}}
                    onClick={() => !unavail && handleTimeClick(time)}
                    style={{
                      padding: '10px 6px', borderRadius: 8, border: '1px solid',
                      fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                      cursor: unavail ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                      background: unavail
                        ? 'rgba(255,50,50,0.08)'
                        : isSelected
                        ? 'rgba(0,220,255,0.2)'
                        : 'rgba(0,220,255,0.04)',
                      borderColor: unavail
                        ? 'rgba(255,50,50,0.3)'
                        : isSelected
                        ? 'var(--cyan)'
                        : 'var(--border-cyan)',
                      color: unavail
                        ? 'rgba(255,50,50,0.5)'
                        : isSelected
                        ? 'var(--cyan)'
                        : 'var(--text-primary)',
                      textDecoration: unavail ? 'line-through' : 'none',
                    }}
                  >
                    {time}
                    {unavail && (
                      <div style={{ fontSize: '0.55rem', color: '#FF3355', marginTop: 2 }}>Pris</div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
