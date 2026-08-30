import { motion } from 'framer-motion'
import styles from './SemesterDivider.module.css'

const SEMESTRES = {
  1: { label: '1º Semestre', subtitle: 'Fundamentos da Tradição Oculta Ocidental' },
  2: { label: '2º Semestre', subtitle: 'Helenismo, Magia Ritualística e Tradições do Mundo' },
  3: { label: '3º Semestre', subtitle: 'Novos Caminhos no Estudo do Oculto' },
}

export default function SemesterDivider({ semestre }) {
  const { label, subtitle } = SEMESTRES[semestre] ?? SEMESTRES[1]

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
