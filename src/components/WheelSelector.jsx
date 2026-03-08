import { motion } from 'framer-motion'
import CardIcon from '../utils/iconMap'
import styles from './WheelSelector.module.css'

const slots = [
  { left: '15%', bottom: '28%', rotate: -18, scale: 0.82 },   // left
  { left: '50%', bottom: '45%', rotate: 0, scale: 1.18 },     // center (selected)
  { left: '85%', bottom: '28%', rotate: 18, scale: 0.82 },    // right
]

const offsetToSlot = [1, 2, 0]

export default function WheelSelector({ cards, selectedIndex, onSelect }) {
  return (
    <div className={styles.wheelContainer}>
      {cards.map((card, i) => {
        const offset = (i - selectedIndex + cards.length) % cards.length
        const slot = slots[offsetToSlot[offset]]
        const isActive = offset === 0

        return (
          <motion.button
            key={card.id}
            className={`${styles.tarotItem} ${isActive ? styles.active : ''}`}
            style={{ position: 'absolute' }}
            animate={{
              left: slot.left,
              bottom: slot.bottom,
              x: '-50%',
              y: '50%',
              rotate: slot.rotate,
              scale: slot.scale,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            onClick={() => onSelect(i)}
          >
            <div className={styles.tarotCard}>
              <div className={styles.tarotInner}>
                <CardIcon name={card.icone} className={styles.tarotIcon} size="100%" />
                <span className={styles.tarotLabel}>{card.titulo}</span>
              </div>
            </div>
            {isActive && (
              <motion.div
                className={styles.tarotGlow}
                layoutId="tarotGlow"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
