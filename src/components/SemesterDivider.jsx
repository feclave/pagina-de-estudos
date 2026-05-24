import { motion } from 'framer-motion'
import styles from './SemesterDivider.module.css'

export default function SemesterDivider({ semestre }) {
  const label = semestre === 1 ? '1º Semestre' : '2º Semestre'
  const subtitle = semestre === 1
    ? 'Fundamentos da Tradição Oculta Ocidental'
    : 'Helenismo, Magia Ritualística e Tradições do Mundo'

  return (
    <motion.div
      className={styles.divider}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className={styles.line} />
      <div className={styles.center}>
        <span className={styles.label}>{label}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
      <div className={styles.line} />
    </motion.div>
  )
}
